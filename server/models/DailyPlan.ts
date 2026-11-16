import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignedItem {
  itemId: string;
  title: string;
  type: 'topic' | 'checkpoint' | 'review';
  category: string;
  description: string;
  whatYouWillLearn: string[];
  learningObjectives: string[];
  subtopics: {
    id: string;
    name: string;
    description: string;
    explanation?: string;
    completed: boolean;
  }[];
  practicalTask?: string;
  supportingPractice?: string;
  expectedOutcome?: string;
  estimatedMinutes: number;
  completed: boolean;
  progressPct: number;
  notes: string;
  attachments: {
    publicId: string;
    url: string;
    originalName: string;
    format: string;
    sizeBytes: number;
    uploadedAt: Date;
  }[];
}

export interface IDailyPlan extends Document {
  date: string; // YYYY-MM-DD (Asia/Kolkata)
  journeyDay: number;
  phase: number;
  week: number;
  assignedItems: IAssignedItem[];
  completionPercentage: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssignedItemSchema = new Schema({
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['topic', 'checkpoint', 'review'], default: 'topic' },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  whatYouWillLearn: [{ type: String }],
  learningObjectives: [{ type: String }],
  subtopics: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, default: '' },
      explanation: { type: String },
      completed: { type: Boolean, default: false },
    },
  ],
  practicalTask: { type: String },
  supportingPractice: { type: String, default: '' },
  expectedOutcome: { type: String },
  estimatedMinutes: { type: Number, default: 45 },
  completed: { type: Boolean, default: false },
  progressPct: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  attachments: [
    {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
      originalName: { type: String, required: true },
      format: { type: String, default: 'png' },
      sizeBytes: { type: Number, default: 0 },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const DailyPlanSchema = new Schema<IDailyPlan>({
  date: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD
  journeyDay: { type: Number, required: true },
  phase: { type: Number, required: true },
  week: { type: Number, required: true },
  assignedItems: [AssignedItemSchema],
  completionPercentage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.DailyPlan || mongoose.model<IDailyPlan>('DailyPlan', DailyPlanSchema);

