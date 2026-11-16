export interface Subtopic {
  id: string;
  name: string;
  description: string;
  explanation?: string;
  completed: boolean;
}

export interface Attachment {
  publicId: string;
  url: string;
  originalName: string;
  format: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface AssignedItem {
  itemId: string;
  title: string;
  type: 'topic' | 'checkpoint' | 'review';
  category: string;
  description: string;
  whatYouWillLearn: string[];
  learningObjectives: string[];
  subtopics: Subtopic[];
  practicalTask?: string;
  expectedOutcome?: string;
  estimatedMinutes: number;
  completed: boolean;
  progressPct: number;
  notes: string;
  attachments: Attachment[];
}

export interface DailyPlan {
  _id?: string;
  date: string; // YYYY-MM-DD
  journeyDay: number;
  phase: number;
  week: number;
  assignedItems: AssignedItem[];
  completionPercentage: number;
  completed: boolean;
  completedAt?: string;
}

export interface Milestone {
  _id?: string;
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

export interface ProgressSummary {
  todayDate: string;
  streak: number;
  totalDaysRecorded: number;
  completedDaysCount: number;
  todayPlan: DailyPlan | null;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'streak' | 'completion' | 'checkpoint' | 'info';
  createdAt: string;
}

