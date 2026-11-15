import mongoose, { Document, Schema } from 'mongoose';

export interface ISubtopic {
  id: string;
  name: string;
  description: string;
  explanation?: string;
  isMandatory: boolean;
}

export interface ICurriculumItem extends Document {
  itemId: string; // e.g. "phase1_w1_d1_topic1"
  title: string;
  type: 'topic' | 'checkpoint';
  category: 'dsa' | 'javascript' | 'react' | 'backend' | 'database' | 'devops' | 'ai' | 'core_cs';
  description: string;
  whatYouWillLearn: string[];
  learningObjectives: string[];
  subtopics: ISubtopic[];
  practicalTask?: string;
  expectedOutcome?: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phase: number;
  week: number;
  day: number;
  order: number;
}

const SubtopicSchema = new Schema<ISubtopic>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  explanation: { type: String },
  isMandatory: { type: Boolean, default: true },
});

const CurriculumItemSchema = new Schema<ICurriculumItem>({
  itemId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['topic', 'checkpoint'], default: 'topic' },
  category: {
    type: String,
    enum: ['dsa', 'javascript', 'react', 'backend', 'database', 'devops', 'ai', 'core_cs'],
    required: true,
  },
  description: { type: String, required: true },
  whatYouWillLearn: [{ type: String }],
  learningObjectives: [{ type: String }],
  subtopics: [SubtopicSchema],
  practicalTask: { type: String },
  expectedOutcome: { type: String },
  estimatedMinutes: { type: Number, default: 45 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  phase: { type: Number, required: true, index: true },
  week: { type: Number, required: true, index: true },
  day: { type: Number, required: true },
  order: { type: Number, default: 1 },
});

export default mongoose.models.CurriculumItem || mongoose.model<ICurriculumItem>('CurriculumItem', CurriculumItemSchema);

