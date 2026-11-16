import mongoose, { Document, Schema } from 'mongoose';

export interface ICurriculumProgress extends Document {
  itemId: string; // journey_day_001 .. journey_day_547
  journeyDay: number;
  date: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed: boolean;
  completedSubtopicIds: string[];
  progressPct: number;
  completedAt?: Date | null;
  lastActivityAt: Date;
  notes?: string;
}

const CurriculumProgressSchema = new Schema<ICurriculumProgress>({
  itemId: { type: String, required: true, unique: true, index: true },
  journeyDay: { type: Number, required: true, index: true },
  date: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
    index: true,
  },
  completed: { type: Boolean, default: false, index: true },
  completedSubtopicIds: [{ type: String }],
  progressPct: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },
  lastActivityAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
});

CurriculumProgressSchema.index({ completed: 1, journeyDay: 1 });

export default mongoose.models.CurriculumProgress ||
  mongoose.model<ICurriculumProgress>('CurriculumProgress', CurriculumProgressSchema);
