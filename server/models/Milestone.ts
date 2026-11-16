import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone extends Document {
  milestoneId: string;
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
  status: 'upcoming' | 'current' | 'completed';
  completedDate?: string | null;
  notes: string;
  projectId?: string | null;
}

const MilestoneSchema = new Schema<IMilestone>({
  milestoneId: { type: String, required: true, unique: true, index: true },
  order: { type: Number, required: true, unique: true, index: true },
  phase: { type: Number, required: true },
  targetWeek: { type: Number, default: null },
  journeyDay: { type: Number, required: true },
  targetDate: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  topicsCovered: [{ type: String }],
  acceptanceCriteria: [{ type: String }],
  status: { type: String, enum: ['upcoming', 'current', 'completed'], default: 'upcoming' },
  completedDate: { type: String, default: null },
  notes: { type: String, default: '' },
  projectId: { type: String, default: null },
});

export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);

