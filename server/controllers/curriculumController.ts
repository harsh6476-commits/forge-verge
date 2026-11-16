import { Request, Response } from 'express';
import CurriculumItem from '../models/CurriculumItem.js';
import CurriculumProgress from '../models/CurriculumProgress.js';
import { loadCurriculumData } from '../services/curriculumService.js';

export async function getCurriculumList(req: Request, res: Response): Promise<void> {
  try {
    const { phase, week, category, kind, status, q, cursor } = req.query;
    const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 50);

    const query: any = {};

    if (phase) {
      query.phase = Number(phase);
    }
    if (week) {
      query.globalWeek = Number(week);
    }
    if (category) {
      query.category = category;
    }
    if (kind) {
      query.kind = kind;
    }

    if (q && typeof q === 'string' && q.trim()) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { practice: { $regex: escaped, $options: 'i' } },
        { 'subtopics': { $regex: escaped, $options: 'i' } },
        { 'subtopicItems.name': { $regex: escaped, $options: 'i' } },
      ];
    }

    if (status) {
      if (status === 'completed') {
        const completedDocs = await CurriculumProgress.find({ completed: true }, { itemId: 1 }).lean();
        query.itemId = { $in: completedDocs.map((d: any) => d.itemId) };
      } else if (status === 'in_progress') {
        const inProgressDocs = await CurriculumProgress.find({ status: 'in_progress' }, { itemId: 1 }).lean();
        query.itemId = { $in: inProgressDocs.map((d: any) => d.itemId) };
      } else if (status === 'not_started') {
        const startedDocs = await CurriculumProgress.find(
          { status: { $in: ['in_progress', 'completed'] } },
          { itemId: 1 }
        ).lean();
        query.itemId = { $nin: startedDocs.map((d: any) => d.itemId) };
      }
    }

    const total = await CurriculumItem.countDocuments(query);

    // Apply cursor pagination on journeyDay
    if (cursor) {
      query.journeyDay = { $gt: Number(cursor) };
    }

    const rawItems = await CurriculumItem.find(query)
      .select('itemId journeyDay date dayOfWeek kind title category minutes phase globalWeek phaseWeek milestoneId subtopics subtopicItems practice supportingPractice')
      .sort({ journeyDay: 1 })
      .limit(limit + 1)
      .lean();

    const hasNext = rawItems.length > limit;
    const itemsToReturn = hasNext ? rawItems.slice(0, limit) : rawItems;
    const nextCursor = hasNext && itemsToReturn.length > 0 ? itemsToReturn[itemsToReturn.length - 1].journeyDay : null;

    // Attach canonical progress to returned items
    const itemIds = itemsToReturn.map((i: any) => i.itemId);
    const progressDocs = await CurriculumProgress.find({ itemId: { $in: itemIds } }).lean();
    const progressMap = new Map(progressDocs.map((p: any) => [p.itemId, p]));

    const items = itemsToReturn.map((item: any) => {
      const prog = progressMap.get(item.itemId);
      const isCompleted = Boolean(prog?.completed);
      const itemStatus = isCompleted ? 'completed' : prog?.status || 'not_started';
      const progressPct = isCompleted ? 100 : prog?.progressPct || 0;

      return {
        ...item,
        status: itemStatus,
        completed: isCompleted,
        progressPct,
        completedSubtopicIds: prog?.completedSubtopicIds || [],
      };
    });

    const [completedCount, inProgressCount] = await Promise.all([
      CurriculumProgress.countDocuments({ completed: true }),
      CurriculumProgress.countDocuments({ status: 'in_progress' }),
    ]);

    res.json({
      items,
      nextCursor,
      total,
      summary: {
        totalItems: 547,
        completed: completedCount,
        inProgress: inProgressCount,
        notStarted: Math.max(547 - completedCount - inProgressCount, 0),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching curriculum catalog' });
  }
}

export async function getCurriculumItemDetails(req: Request, res: Response): Promise<void> {
  const { itemId } = req.params;

  try {
    const item = await CurriculumItem.findOne({
      $or: [{ itemId }, { journeyDay: Number(itemId) || -1 }],
    }).lean();

    if (!item) {
      res.status(404).json({ error: 'Curriculum item not found' });
      return;
    }

    const { projectsMap } = loadCurriculumData();

    const progress = await CurriculumProgress.findOne({ itemId: item.itemId }).lean();

    // Check if linked milestone has a project
    let linkedProject = null;
    const { cachedMilestones } = loadCurriculumData();
    const ms = cachedMilestones.find((m) => m.milestoneId === item.milestoneId);
    if (ms && ms.projectId && projectsMap.has(ms.projectId)) {
      linkedProject = projectsMap.get(ms.projectId);
    }

    res.json({
      ...item,
      status: progress?.status || 'not_started',
      completed: Boolean(progress?.completed),
      progressPct: progress?.progressPct || 0,
      completedSubtopicIds: progress?.completedSubtopicIds || [],
      notes: progress?.notes || '',
      completedAt: progress?.completedAt || null,
      linkedProject,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching curriculum item' });
  }
}
