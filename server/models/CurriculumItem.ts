import mongoose, { Document, Schema } from 'mongoose';

export interface ISubtopicItem {
  id: string;
  name: string;
  description?: string;
}

export interface ICurriculumItem extends Document {
  itemId: string; // journey_day_001 .. journey_day_547
  journeyDay: number;
  date: string; // YYYY-MM-DD
  dayOfWeek: number;
  kind: 'topic' | 'checkpoint' | 'review';
  title: string;
  category: string;
  minutes: number;
  practice: string;
  supportingPractice?: string;
  subtopics: string[];
  subtopicItems: ISubtopicItem[];
  learningObjectives: string[];
  description: string;
  expectedOutcome: string;
  difficulty?: string;
  phase: number;
  phaseId: string;
  phaseTitle: string;
  globalWeek: number;
  phaseWeek: number;
  weekTitle: string;
  weekFocus: string;
  weeklyDeliverable: string;
  weekResearchCheckpoint?: string | null;
  milestoneId: string;
}

const SubtopicItemSchema = new Schema<ISubtopicItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const CurriculumItemSchema = new Schema<ICurriculumItem>({
  itemId: { type: String, required: true, unique: true, index: true },
  journeyDay: { type: Number, required: true, unique: true, index: true },
  date: { type: String, required: true, unique: true, index: true },
  dayOfWeek: { type: Number, required: true },
  kind: { type: String, enum: ['topic', 'checkpoint', 'review'], required: true, index: true },
  title: { type: String, required: true },
  category: { type: String, required: true, index: true },
  minutes: { type: Number, default: 120 },
  practice: { type: String, default: '' },
  supportingPractice: { type: String, default: '' },
  subtopics: [{ type: String }],
  subtopicItems: [SubtopicItemSchema],
  learningObjectives: [{ type: String }],
  description: { type: String, default: '' },
  expectedOutcome: { type: String, default: '' },
  difficulty: { type: String },
  phase: { type: Number, required: true, index: true },
  phaseId: { type: String, default: '' },
  phaseTitle: { type: String, default: '' },
  globalWeek: { type: Number, required: true, index: true },
  phaseWeek: { type: Number, default: 1 },
  weekTitle: { type: String, default: '' },
  weekFocus: { type: String, default: '' },
  weeklyDeliverable: { type: String, default: '' },
  weekResearchCheckpoint: { type: mongoose.Schema.Types.Mixed, default: null },
  milestoneId: { type: String, required: true, index: true },
});

CurriculumItemSchema.index({ phase: 1, globalWeek: 1, dayOfWeek: 1 });
CurriculumItemSchema.index({ kind: 1, phase: 1 });
CurriculumItemSchema.index({ category: 1, phase: 1 });
CurriculumItemSchema.index({ title: 'text', description: 'text', practice: 'text', subtopics: 'text' });

export default mongoose.models.CurriculumItem || mongoose.model<ICurriculumItem>('CurriculumItem', CurriculumItemSchema);
