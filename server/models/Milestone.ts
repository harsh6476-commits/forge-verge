import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone extends Document {
  milestoneId: string;
  phase: number;
  order: number;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  topicsCovered: string[];
  status: 'upcoming' | 'current' | 'completed';
  completedDate?: string; // YYYY-MM-DD
  notes: string;
}

const MilestoneSchema = new Schema<IMilestone>({
  milestoneId: { type: String, required: true, unique: true, index: true },
  phase: { type: Number, required: true },
  order: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  topicsCovered: [{ type: String }],
  status: { type: String, enum: ['upcoming', 'current', 'completed'], default: 'upcoming' },
  completedDate: { type: String },
  notes: { type: String, default: '' },
});

export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);

