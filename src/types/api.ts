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
  supportingPractice?: string;
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
  startJourneyDay?: number;
  endJourneyDay?: number;
  targetDate: string; // YYYY-MM-DD
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  topicsCovered: string[];
  acceptanceCriteria: string[];
  requiredItemIds?: string[];
  requiredItemCount?: number;
  completedItemCount?: number;
  progressPct?: number;
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

// ─── Curriculum Catalog ───────────────────────────────────────────────────────

export type CurriculumKind = 'topic' | 'checkpoint' | 'review';
export type CurriculumStatus = 'not_started' | 'in_progress' | 'completed';

export interface CurriculumCatalogItem {
  _id?: string;
  itemId: string;
  journeyDay: number;
  date: string; // YYYY-MM-DD
  dayOfWeek?: number;
  kind: CurriculumKind;
  title: string;
  category: string;
  minutes: number;
  phase: number;
  globalWeek: number;
  phaseWeek: number;
  milestoneId: string;
  subtopics?: string[];
  subtopicItems?: Array<{ id: string; name: string; description?: string }>;
  practice?: string;
  supportingPractice?: string;
  status: CurriculumStatus;
  completed: boolean;
  progressPct: number;
  completedSubtopicIds?: string[];
}

export interface CurriculumItemDetail extends CurriculumCatalogItem {
  description?: string;
  whatYouWillLearn?: string[];
  learningObjectives?: string[];
  practicalTask?: string;
  expectedOutcome?: string;
  weekResearchCheckpoint?: { title: string; task: string; note?: string } | string | null;
  notes?: string;
  completedAt?: string | null;
  linkedProject?: {
    projectId: string;
    title: string;
    description: string;
    technologies?: string[];
  } | null;
}

export interface CurriculumListSummary {
  totalItems: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export interface CurriculumListResponse {
  items: CurriculumCatalogItem[];
  nextCursor: number | null;
  total: number;
  summary: CurriculumListSummary;
}
