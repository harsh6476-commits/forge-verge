// Core Domain Models for FORGE OS

export type AcademicMode = 'normal' | 'examination' | 'vacation';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  degree: string;
  currentYear: number;
  currentSemester: number;
  githubUsername: string;
  onboardingCompleted: boolean;
  roadmapStartDate: string; // YYYY-MM-DD
  roadmapEndDate: string; // YYYY-MM-DD
  dailyStudyHours: number; // e.g. 2.5
  academicMode: AcademicMode;
  examStartDate?: string;
  examEndDate?: string;
  notificationTime: string; // e.g. '18:00'
  browserNotificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number; // 1 to 6
  name: string;
  focusArea: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  weeksCount: number; // 13 weeks
  status: 'pending' | 'active' | 'completed';
  primaryTechnologies: string[];
  majorProjectTitle: string;
  checkpointTitle: string;
}

export type SessionType = 'dsa' | 'engineering' | 'practice' | 'reasoning' | 'academic';
export type TaskPriority = 'p0' | 'p1' | 'p2';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'skipped';

export interface LearningTask {
  id: string;
  dailyPlanId: string;
  dateStr: string; // YYYY-MM-DD
  sessionType: SessionType;
  topic: string;
  objective: string;
  durationMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  visualLessonId?: string;
  codeTaskSnippet?: string;
  challengePrompt?: string;
  expectedOutput?: string;
  resourceLinks?: { title: string; url: string }[];
  evidenceRequired: boolean;
  evidenceId?: string;
  completedAt?: string;
  selfRating?: number; // 1-5
  reflectionNotes?: string;
}

export interface DailyPlan {
  id: string;
  dateStr: string; // YYYY-MM-DD
  phaseNumber: number;
  weekNumber: number;
  dayNumber: number;
  dayTitle: string; // e.g. "Arrays & Time Complexity"
  dailyObjective: string;
  plannedHours: number;
  actualHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rest_day';
  mode: AcademicMode;
  tasks: LearningTask[];
}

export type VerificationLevel = 1 | 2 | 3 | 4 | 5;
// Level 1: Self-Reported
// Level 2: Evidence Submitted (file/link attached)
// Level 3: Automatically Validated (HTTP 200 / GitHub Commit Check)
// Level 4: Rubric Self-Reviewed
// Level 5: Verified Milestone / Checkpoint Passed

export type EvidenceType = 
  | 'github_repo' 
  | 'github_commit' 
  | 'github_pr' 
  | 'deployed_url' 
  | 'screenshot' 
  | 'file_upload' 
  | 'technical_writeup' 
  | 'test_results';

export interface EvidenceRecord {
  id: string;
  taskId?: string;
  projectTaskId?: string;
  checkpointId?: string;
  title: string;
  evidenceType: EvidenceType;
  url?: string;
  filePath?: string;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  verificationLevel: VerificationLevel;
  verificationMetadata?: {
    checkedAt?: string;
    repoExists?: boolean;
    commitAuthorMatches?: boolean;
    httpStatus?: number;
    notes?: string;
  };
  rubricAnswers?: Record<string, string | number>;
  createdAt: string;
}

export type DSAPlatform = 'leetcode' | 'striver' | 'cses' | 'codeforces' | 'custom';
export type DSADifficulty = 'easy' | 'medium' | 'hard';
export type DSATopic = 
  | 'Arrays' 
  | 'Strings' 
  | 'Hashing' 
  | 'Two Pointers' 
  | 'Sliding Window' 
  | 'Binary Search' 
  | 'Linked Lists' 
  | 'Stacks' 
  | 'Queues' 
  | 'Recursion' 
  | 'Trees' 
  | 'Graphs' 
  | 'Dynamic Programming' 
  | 'Greedy';

export interface DSAProblem {
  id: string;
  title: string;
  platform: DSAPlatform;
  url: string;
  topic: DSATopic;
  difficulty: DSADifficulty;
  language: string; // 'cpp'
  solvedIndependently: boolean;
  usedHints: boolean;
  bruteForceNotes?: string;
  optimalNotes?: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionCode?: string;
  firstSolvedAt: string;
  attemptsCount: number;
}

export interface RevisionQueueItem {
  id: string;
  problemId: string;
  problemTitle: string;
  topic: DSATopic;
  difficulty: DSADifficulty;
  intervalStage: 1 | 2 | 3 | 4; // 1=1d, 2=3d, 3=7d, 4=21d
  nextRevisionDate: string; // YYYY-MM-DD
  status: 'pending' | 'reviewed' | 'archived';
  lastReviewedAt?: string;
  repetitionCount: number;
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'databases' 
  | 'messaging' 
  | 'devops' 
  | 'testing' 
  | 'monitoring' 
  | 'ai' 
  | 'security' 
  | 'core_cs';

export type SkillMaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = Not started
// 1 = Understand concepts
// 2 = Complete guided practice
// 3 = Implement independently
// 4 = Build, test and deploy
// 5 = Explain internals, evaluate trade-offs, production use

export interface SkillItem {
  id: string;
  category: SkillCategory;
  name: string;
  currentLevel: SkillMaturityLevel;
  targetLevel: SkillMaturityLevel;
  lastPracticedAt?: string;
  evidenceIds: string[];
}

export interface JournalEntry {
  id: string;
  dateStr: string; // YYYY-MM-DD
  entryType: 'daily' | 'weekly' | 'architecture_decision';
  title: string;
  content: string; // Markdown supported
  keyLearnings: string[];
  blockers: string[];
  alternativesConsidered?: string;
  decisionReason?: string;
  tags: string[];
  createdAt: string;
}

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  attendancePct: number;
  syllabusProgress: number; // 0-100%
  upcomingExams: { title: string; date: string }[];
}

export interface MarketIntelligenceItem {
  id: string;
  sourceName: string;
  originalUrl: string;
  publicationDate: string;
  geography: string;
  methodology: string;
  lastVerifiedDate: string;
  supportedConclusion: string;
  isVerifiedPublicData: boolean;
  category: 'languages' | 'backend' | 'ai' | 'cloud' | 'hiring_trend';
  keyStat: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  weeklyConsistencyPct: number;
  totalStudyMinutes: number;
  dsaStreak: number;
  lastActiveDate?: string;
  graceDaysRemaining: number;
}

