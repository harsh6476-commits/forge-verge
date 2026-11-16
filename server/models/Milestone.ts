import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone extends Document {
  milestoneId: string; // M01 .. M17
  order: number;
  phase: number;
  targetWeek: number | null;
  journeyDay: number;
  targetDate: string; // YYYY-MM-DD
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  topicsCovered: string[];
  acceptanceCriteria: string[];
  startJourneyDay: number;
  endJourneyDay: number;
  requiredItemIds: string[];
  requiredItemCount: number;
  progressRule?: string;
  completedItemCount: number;
  progressPct: number;
  status: 'upcoming' | 'current' | 'completed';
  completedDate?: string | null;
  notes: string;
  projectId?: string | null;
}

const MilestoneSchema = new Schema<IMilestone>({
  milestoneId: { type: String, required: true, unique: true, index: true },
  order: { type: Number, required: true, unique: true, index: true },
  phase: { type: Number, required: true, index: true },
  targetWeek: { type: Number, default: null },
  journeyDay: { type: Number, required: true },
  targetDate: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  topicsCovered: [{ type: String }],
  acceptanceCriteria: [{ type: String }],
  startJourneyDay: { type: Number, required: true },
  endJourneyDay: { type: Number, required: true },
  requiredItemIds: [{ type: String }],
  requiredItemCount: { type: Number, required: true },
  progressRule: { type: String },
  completedItemCount: { type: Number, default: 0 },
  progressPct: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'current', 'completed'], default: 'upcoming', index: true },
  completedDate: { type: String, default: null },
  notes: { type: String, default: '' },
  projectId: { type: String, default: null },
});

export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);
