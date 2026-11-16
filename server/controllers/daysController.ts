import { Request, Response } from 'express';
import DailyPlan from '../models/DailyPlan.js';
import Notification from '../models/Notification.js';
import { getOrCreateDailyPlan, syncItemProgress } from '../services/curriculumService.js';
import { formatISTDate, addDaysToDateStr } from '../../src/lib/date-utils.js';

export async function getTodayPlan(_req: Request, res: Response): Promise<void> {
  const todayStr = formatISTDate();
  try {
    const plan = await getOrCreateDailyPlan(todayStr);
    if (!plan) {
      res.status(404).json({ error: `No scheduled curriculum for today (${todayStr})` });
      return;
    }
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching today plan' });
  }
}

export async function getPlanByDate(req: Request, res: Response): Promise<void> {
  const rawDate = req.query.date || req.params.date;
  const dateStr = typeof rawDate === 'string' ? rawDate : formatISTDate();
  try {
    const plan = await getOrCreateDailyPlan(dateStr);
    if (!plan) {
      res.status(404).json({ error: `No scheduled curriculum for date (${dateStr})` });
      return;
    }
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching plan for date' });
  }
}

export async function updateItemCompletion(req: Request, res: Response): Promise<void> {
  const { date, itemId } = req.params;
  const { completed } = req.body;

  try {
    const plan = await DailyPlan.findOne({ date });
    if (!plan) {
      res.status(404).json({ error: 'Daily plan not found' });
      return;
    }

    const item = plan.assignedItems.find((i: any) => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    item.completed = completed;
    item.progressPct = completed ? 100 : 0;
    item.subtopics.forEach((s: any) => {
      s.completed = completed;
    });

    recalculatePlanProgress(plan);
    await plan.save();

    // Sync canonical CurriculumProgress and recalculate milestone progress
    const completedSubtopicIds = item.subtopics
      .filter((s: any) => s.completed)
      .map((s: any) => s.id);

    await syncItemProgress(item.itemId, completed, completedSubtopicIds, item.notes);

    res.json({ plan, item });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating item completion' });
  }
}

export async function updateSubtopicCompletion(req: Request, res: Response): Promise<void> {
  const { date, itemId, subtopicId } = req.params;
  const { completed } = req.body;

  try {
    const plan = await DailyPlan.findOne({ date });
    if (!plan) {
      res.status(404).json({ error: 'Daily plan not found' });
      return;
    }

    const item = plan.assignedItems.find((i: any) => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    const subtopic = item.subtopics.find((s: any) => s.id === subtopicId);
    if (!subtopic) {
      res.status(404).json({ error: 'Subtopic not found' });
      return;
    }

    subtopic.completed = completed;

    const totalSubtopics = item.subtopics.length;
    const completedSubtopics = item.subtopics.filter((s: any) => s.completed).length;
    item.progressPct = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 100;
    item.completed = completedSubtopics === totalSubtopics && totalSubtopics > 0;

    recalculatePlanProgress(plan);
    await plan.save();

    // Sync canonical progress
    const completedSubtopicIds = item.subtopics
      .filter((s: any) => s.completed)
      .map((s: any) => s.id);

    await syncItemProgress(item.itemId, item.completed, completedSubtopicIds, item.notes);

    res.json({ plan, item, subtopic });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating subtopic' });
  }
}

export async function updateItemNotes(req: Request, res: Response): Promise<void> {
  const { date, itemId } = req.params;
  const { notes } = req.body;

  try {
    const plan = await DailyPlan.findOne({ date });
    if (!plan) {
      res.status(404).json({ error: 'Daily plan not found' });
      return;
    }

    const item = plan.assignedItems.find((i: any) => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    item.notes = notes ?? '';
    plan.updatedAt = new Date();
    await plan.save();

    const completedSubtopicIds = item.subtopics
      .filter((s: any) => s.completed)
      .map((s: any) => s.id);

    await syncItemProgress(item.itemId, item.completed, completedSubtopicIds, item.notes);

    res.json({ success: true, notes: item.notes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating notes' });
  }
}

/**
 * Fast, bounded, indexed streak & summary calculation
 */
export async function getProgressSummary(_req: Request, res: Response): Promise<void> {
  try {
    const todayStr = formatISTDate();
    const todayPlan = await DailyPlan.findOne({ date: todayStr }).lean();

    let streak = 0;
    let checkDate = todayStr;

    if (todayPlan && (todayPlan as any).completed) {
      streak = 1;
      checkDate = addDaysToDateStr(todayStr, -1);
    } else {
      checkDate = addDaysToDateStr(todayStr, -1);
    }

    // Bounded indexed query for previous completed days (up to 365 days)
    const pastCompleted = await DailyPlan.find({
      date: { $lte: checkDate },
      completed: true,
    })
      .sort({ date: -1 })
      .limit(365)
      .select('date completed')
      .lean();

    const completedSet = new Set(pastCompleted.map((p: any) => p.date));

    while (completedSet.has(checkDate)) {
      streak += 1;
      checkDate = addDaysToDateStr(checkDate, -1);
    }

    const [totalDaysRecorded, completedDaysCount] = await Promise.all([
      DailyPlan.countDocuments(),
      DailyPlan.countDocuments({ completed: true }),
    ]);

    res.json({
      todayDate: todayStr,
      streak,
      totalDaysRecorded,
      completedDaysCount,
      todayPlan: todayPlan || null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error calculating progress summary' });
  }
}

export async function getProgressHistory(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 60);
    const beforeDate = req.query.before as string;

    const query: any = {};
    if (beforeDate) {
      query.date = { $lt: beforeDate };
    }

    const plans = await DailyPlan.find(query)
      .select('date journeyDay completionPercentage completed assignedItems')
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching progress history' });
  }
}

function recalculatePlanProgress(plan: any): void {
  const totalItems = plan.assignedItems.length;
  if (totalItems === 0) {
    plan.completionPercentage = 0;
    plan.completed = false;
    return;
  }

  const completedItems = plan.assignedItems.filter((i: any) => i.completed).length;
  const sumProgress = plan.assignedItems.reduce((acc: number, i: any) => acc + (i.progressPct || 0), 0);
  plan.completionPercentage = Math.round(sumProgress / totalItems);

  const wasCompleted = plan.completed;
  plan.completed = completedItems === totalItems;
  if (plan.completed && !wasCompleted) {
    plan.completedAt = new Date();
    Notification.create({
      title: "Today's learning plan completed!",
      message: 'Great work! All scheduled topics have been completed.',
      date: plan.date,
      type: 'completion',
    }).catch(() => {});
  } else if (!plan.completed) {
    plan.completedAt = undefined;
  }
  plan.updatedAt = new Date();
}
