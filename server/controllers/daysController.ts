import { Request, Response } from 'express';
import DailyPlan from '../models/DailyPlan.js';
import Notification from '../models/Notification.js';
import { getOrCreateDailyPlan } from '../services/curriculumService.js';
import { formatISTDate, addDaysToDateStr } from '../../src/lib/date-utils.js';

export async function getTodayPlan(_req: Request, res: Response): Promise<void> {
  const todayStr = formatISTDate();
  try {
    const plan = await getOrCreateDailyPlan(todayStr);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching today plan' });
  }
}

export async function getPlanByDate(req: Request, res: Response): Promise<void> {
  const dateStr = (req.query.date as string) || req.params.date || formatISTDate();
  try {
    const plan = await getOrCreateDailyPlan(dateStr);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching plan for date' });
  }
}

/**
 * Returns rolling list of plans for the Daily List view
 */
export async function getDailyList(_req: Request, res: Response): Promise<void> {
  try {
    const todayStr = formatISTDate();
    // Pre-generate rolling 30 days starting from today (or roadmap start)
    const days: any[] = [];
    for (let i = 0; i < 30; i++) {
      const dateStr = addDaysToDateStr(todayStr, i);
      const plan = await getOrCreateDailyPlan(dateStr);
      days.push(plan);
    }
    res.json(days);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching daily list' });
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

    const item = plan.assignedItems.find(i => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    item.completed = completed;
    item.progressPct = completed ? 100 : 0;
    item.subtopics.forEach(s => {
      s.completed = completed;
    });

    recalculatePlanProgress(plan);
    await plan.save();

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

    const item = plan.assignedItems.find(i => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    const subtopic = item.subtopics.find(s => s.id === subtopicId);
    if (!subtopic) {
      res.status(404).json({ error: 'Subtopic not found' });
      return;
    }

    subtopic.completed = completed;

    const totalSubtopics = item.subtopics.length;
    const completedSubtopics = item.subtopics.filter(s => s.completed).length;
    item.progressPct = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 100;
    item.completed = completedSubtopics === totalSubtopics && totalSubtopics > 0;

    recalculatePlanProgress(plan);
    await plan.save();

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

    const item = plan.assignedItems.find(i => i.itemId === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in daily plan' });
      return;
    }

    item.notes = notes ?? '';
    plan.updatedAt = new Date();
    await plan.save();

    res.json({ success: true, notes: item.notes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating notes' });
  }
}

export async function getProgressSummary(_req: Request, res: Response): Promise<void> {
  try {
    const todayStr = formatISTDate();
    const plans = await DailyPlan.find({}).sort({ date: -1 });

    let streak = 0;
    let checkDate = todayStr;

    const todayPlan = plans.find(p => p.date === todayStr);
    if (todayPlan && todayPlan.completed) {
      streak += 1;
      checkDate = addDaysToDateStr(todayStr, -1);
    } else {
      checkDate = addDaysToDateStr(todayStr, -1);
    }

    while (true) {
      const p = plans.find(plan => plan.date === checkDate);
      if (p && p.completed) {
        streak += 1;
        checkDate = addDaysToDateStr(checkDate, -1);
      } else {
        break;
      }
    }

    const totalDaysRecorded = plans.length;
    const completedDaysCount = plans.filter(p => p.completed).length;

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

export async function getProgressHistory(_req: Request, res: Response): Promise<void> {
  try {
    const plans = await DailyPlan.find({})
      .select('date journeyDay completionPercentage completed assignedItems')
      .sort({ date: -1 })
      .limit(60);
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
