import { Request, Response } from 'express';
import Milestone from '../models/Milestone.js';
import { formatISTDate } from '../../src/lib/date-utils.js';

export async function getMilestones(_req: Request, res: Response): Promise<void> {
  try {
    const milestones = await Milestone.find({}).sort({ order: 1 });
    res.json(milestones);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching milestones' });
  }
}

export async function updateMilestoneCompletion(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const milestone = await Milestone.findOne({
      $or: [{ milestoneId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found' });
      return;
    }

    milestone.status = completed ? 'completed' : 'upcoming';
    milestone.completedDate = completed ? formatISTDate() : undefined;
    await milestone.save();

    // Auto-update 'current' milestone: first non-completed milestone becomes 'current'
    const all = await Milestone.find({}).sort({ order: 1 });
    let currentAssigned = false;
    for (const m of all) {
      if (m.status !== 'completed' && !currentAssigned) {
        m.status = 'current';
        currentAssigned = true;
        await m.save();
      } else if (m.status === 'current' && currentAssigned) {
        m.status = 'upcoming';
        await m.save();
      }
    }

    const refreshed = await Milestone.find({}).sort({ order: 1 });
    res.json(refreshed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating milestone' });
  }
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

