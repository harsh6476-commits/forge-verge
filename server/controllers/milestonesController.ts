import { Request, Response } from 'express';
import Milestone from '../models/Milestone.js';
import { recalculateMilestoneProgress } from '../services/curriculumService.js';

export async function getMilestones(_req: Request, res: Response): Promise<void> {
  try {
    await recalculateMilestoneProgress();
    const milestones = await Milestone.find({}).sort({ order: 1 }).lean();
    res.json(milestones);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching milestones' });
  }
}

/**
 * Manual toggle is disabled in V2: milestones are strictly driven by curriculum progress
 */
export async function updateMilestoneCompletion(_req: Request, res: Response): Promise<void> {
  res.status(400).json({
    error: 'Manual milestone completion is disabled. Milestones are automatically unlocked as required topics are completed.',
  });
}

export async function updateMilestoneNotes(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const milestone = await Milestone.findOne({
      $or: [{ milestoneId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found' });
      return;
    }

    milestone.notes = notes ?? '';
    await milestone.save();

    res.json(milestone);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating milestone notes' });
  }
}
