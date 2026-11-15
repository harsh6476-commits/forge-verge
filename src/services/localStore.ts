import { get, set } from 'idb-keyval';
import {
  UserProfile,
  RoadmapPhase,
  DailyPlan,
  LearningTask,
  DSAProblem,
  RevisionQueueItem,
  SkillItem,
  JournalEntry,
  AcademicCourse,
  MarketIntelligenceItem,
  StreakData,
  EvidenceRecord,
  AcademicMode,
} from '@/types';
import {
  INITIAL_ROADMAP_PHASES,
  INITIAL_SKILLS,
  INITIAL_MARKET_INTELLIGENCE,
  INITIAL_ACADEMIC_COURSES,
} from '@/data/initialData';
import { generateRollingDailyPlans } from './curriculumGenerator';
import { formatISTDate, ROADMAP_START_DATE_STR, addDaysToDateStr } from '@/lib/date-utils';

const STORAGE_KEYS = {
  PROFILE: 'forge_profile',
  ROADMAP_PHASES: 'forge_roadmap_phases',
  DAILY_PLANS: 'forge_daily_plans',
  DSA_PROBLEMS: 'forge_dsa_problems',
  REVISION_QUEUE: 'forge_revision_queue',
  SKILLS: 'forge_skills',
  JOURNAL_ENTRIES: 'forge_journal_entries',
  ACADEMIC_COURSES: 'forge_academic_courses',
  MARKET_DATA: 'forge_market_data',
  STREAK: 'forge_streak',
  EVIDENCE: 'forge_evidence',
};

export class LocalDataStore {
  /**
   * Initializes local store with default seeds if not already populated
   */
  async initializeStore(): Promise<void> {
    const existingProfile = await get<UserProfile>(STORAGE_KEYS.PROFILE);
    if (!existingProfile) {
      const defaultProfile: UserProfile = {
        id: 'usr_default_01',
        fullName: 'Engineering Scholar',
        email: 'engineer@forge-os.dev',
        degree: 'B.Tech Computer Science Engineering',
        currentYear: 2,
        currentSemester: 3,
        githubUsername: 'forge-engineer',
        onboardingCompleted: true,
        roadmapStartDate: ROADMAP_START_DATE_STR,
        roadmapEndDate: '2028-05-15',
        dailyStudyHours: 2.5,
        academicMode: 'normal',
        notificationTime: '18:00',
        browserNotificationsEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await set(STORAGE_KEYS.PROFILE, defaultProfile);
      await set(STORAGE_KEYS.ROADMAP_PHASES, INITIAL_ROADMAP_PHASES);
      await set(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
      await set(STORAGE_KEYS.MARKET_DATA, INITIAL_MARKET_INTELLIGENCE);
      await set(STORAGE_KEYS.ACADEMIC_COURSES, INITIAL_ACADEMIC_COURSES);

      // Generate initial 30 days of rolling daily plans
      const initialPlans = generateRollingDailyPlans(ROADMAP_START_DATE_STR, 30, 'normal', 2.5);
      await set(STORAGE_KEYS.DAILY_PLANS, initialPlans);

      // Initialize empty arrays
      await set(STORAGE_KEYS.DSA_PROBLEMS, []);
      await set(STORAGE_KEYS.REVISION_QUEUE, []);
      await set(STORAGE_KEYS.JOURNAL_ENTRIES, []);
      await set(STORAGE_KEYS.EVIDENCE, []);

      const initialStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        weeklyConsistencyPct: 100,
        totalStudyMinutes: 0,
        dsaStreak: 1,
        lastActiveDate: formatISTDate(),
        graceDaysRemaining: 2,
      };
      await set(STORAGE_KEYS.STREAK, initialStreak);
    }
  }

  // --- Profile & Settings ---
  async getProfile(): Promise<UserProfile> {
    await this.initializeStore();
    return (await get<UserProfile>(STORAGE_KEYS.PROFILE))!;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await set(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  async setAcademicMode(mode: AcademicMode): Promise<void> {
    await this.updateProfile({ academicMode: mode });
    // Regenerate upcoming incomplete daily plans to match the new mode
    const plans = await this.getAllDailyPlans();
    const today = formatISTDate();
    const updated = plans.map(p => {
      if (p.dateStr >= today && p.status !== 'completed') {
        const [refreshed] = generateRollingDailyPlans(p.dateStr, 1, mode);
        return { ...refreshed, id: p.id };
      }
      return p;
    });
    await set(STORAGE_KEYS.DAILY_PLANS, updated);
  }

  // --- Roadmap Phases ---
  async getRoadmapPhases(): Promise<RoadmapPhase[]> {
    await this.initializeStore();
    return (await get<RoadmapPhase[]>(STORAGE_KEYS.ROADMAP_PHASES)) || INITIAL_ROADMAP_PHASES;
  }

  // --- Daily Plans & Tasks ---
  async getAllDailyPlans(): Promise<DailyPlan[]> {
    await this.initializeStore();
    return (await get<DailyPlan[]>(STORAGE_KEYS.DAILY_PLANS)) || [];
  }

  async getDailyPlanForDate(dateStr: string): Promise<DailyPlan> {
    const plans = await this.getAllDailyPlans();
    let plan = plans.find(p => p.dateStr === dateStr);
    if (!plan) {
      // Lazy generate if requesting date beyond loaded window
      const profile = await this.getProfile();
      const generated = generateRollingDailyPlans(dateStr, 1, profile.academicMode, profile.dailyStudyHours);
      plan = generated[0];
      plans.push(plan);
      await set(STORAGE_KEYS.DAILY_PLANS, plans);
    }
    return plan;
  }

  async toggleTaskCompletion(
    dateStr: string,
    taskId: string,
    completed: boolean,
    notes?: string
  ): Promise<{ dailyPlan: DailyPlan; task: LearningTask }> {
    const plans = await this.getAllDailyPlans();
    const planIndex = plans.findIndex(p => p.dateStr === dateStr);
    if (planIndex === -1) throw new Error(`Plan for date ${dateStr} not found.`);

    const plan = plans[planIndex];
    const taskIndex = plan.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error(`Task ${taskId} not found.`);

    const task = plan.tasks[taskIndex];
    const wasCompleted = task.status === 'completed';
    task.status = completed ? 'completed' : 'todo';
    task.completedAt = completed ? new Date().toISOString() : undefined;
    if (notes) task.reflectionNotes = notes;

    // Recalculate actual hours
    const completedTasks = plan.tasks.filter(t => t.status === 'completed');
    const totalMinutes = completedTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
    plan.actualHours = Number((totalMinutes / 60).toFixed(1));

    if (completedTasks.length === plan.tasks.length && plan.tasks.length > 0) {
      plan.status = 'completed';
    } else if (completedTasks.length > 0) {
      plan.status = 'in_progress';
    } else {
      plan.status = 'pending';
    }

    plans[planIndex] = plan;
    await set(STORAGE_KEYS.DAILY_PLANS, plans);

    // Update streak if completing a meaningful task for today
    if (completed && !wasCompleted) {
      await this.recordActivityForStreak(dateStr, task.durationMinutes, task.sessionType === 'dsa');
    }

    return { dailyPlan: plan, task };
  }

  // --- Streak Engine ---
  async getStreak(): Promise<StreakData> {
    await this.initializeStore();
    return (
      (await get<StreakData>(STORAGE_KEYS.STREAK)) || {
        currentStreak: 1,
        longestStreak: 1,
        weeklyConsistencyPct: 100,
        totalStudyMinutes: 0,
        dsaStreak: 1,
        lastActiveDate: formatISTDate(),
        graceDaysRemaining: 2,
      }
    );
  }

  private async recordActivityForStreak(dateStr: string, minutes: number, isDSA: boolean): Promise<void> {
    const streak = await this.getStreak();
    streak.totalStudyMinutes += minutes;

    if (streak.lastActiveDate !== dateStr) {
      const yesterdayStr = addDaysToDateStr(dateStr, -1);
      if (streak.lastActiveDate === yesterdayStr) {
        streak.currentStreak += 1;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      }
      if (isDSA) {
        streak.dsaStreak += 1;
      }
      streak.lastActiveDate = dateStr;
    }
    await set(STORAGE_KEYS.STREAK, streak);
  }

  // --- DSA Lab & Spaced Repetition ---
  async getDSAProblems(): Promise<DSAProblem[]> {
    await this.initializeStore();
    return (await get<DSAProblem[]>(STORAGE_KEYS.DSA_PROBLEMS)) || [];
  }

  async logDSAProblem(problemInput: Omit<DSAProblem, 'id' | 'firstSolvedAt' | 'attemptsCount'>): Promise<DSAProblem> {
    const problems = await this.getDSAProblems();
    const newProblem: DSAProblem = {
      ...problemInput,
      id: `dsa_${Date.now()}`,
      firstSolvedAt: new Date().toISOString(),
      attemptsCount: 1,
    };
    problems.unshift(newProblem);
    await set(STORAGE_KEYS.DSA_PROBLEMS, problems);

    // Add to revision queue: 1 day interval
    const today = formatISTDate();
    await this.addProblemToRevisionQueue(newProblem.id, newProblem.title, newProblem.topic, newProblem.difficulty, today);

    // Increment streak DSA count
    await this.recordActivityForStreak(today, 45, true);

    return newProblem;
  }

  async getRevisionQueue(): Promise<RevisionQueueItem[]> {
    await this.initializeStore();
    return (await get<RevisionQueueItem[]>(STORAGE_KEYS.REVISION_QUEUE)) || [];
  }

  private async addProblemToRevisionQueue(
    problemId: string,
    problemTitle: string,
    topic: DSAProblem['topic'],
    difficulty: DSAProblem['difficulty'],
    fromDateStr: string
  ): Promise<void> {
    const queue = await this.getRevisionQueue();
    const nextDate = addDaysToDateStr(fromDateStr, 1); // 1-day interval
    const item: RevisionQueueItem = {
      id: `rev_${Date.now()}`,
      problemId,
      problemTitle,
      topic,
      difficulty,
      intervalStage: 1,
      nextRevisionDate: nextDate,
      status: 'pending',
      repetitionCount: 0,
    };
    queue.push(item);
    await set(STORAGE_KEYS.REVISION_QUEUE, queue);
  }

  async completeRevision(queueId: string, successful: boolean): Promise<void> {
    const queue = await this.getRevisionQueue();
    const itemIndex = queue.findIndex(q => q.id === queueId);
    if (itemIndex === -1) return;

    const item = queue[itemIndex];
    const today = formatISTDate();

    if (successful) {
      item.repetitionCount += 1;
      item.lastReviewedAt = new Date().toISOString();

      // Spaced repetition progression: 1d -> 3d -> 7d -> 21d -> archived
      if (item.intervalStage === 1) {
        item.intervalStage = 2;
        item.nextRevisionDate = addDaysToDateStr(today, 3);
      } else if (item.intervalStage === 2) {
        item.intervalStage = 3;
        item.nextRevisionDate = addDaysToDateStr(today, 7);
      } else if (item.intervalStage === 3) {
        item.intervalStage = 4;
        item.nextRevisionDate = addDaysToDateStr(today, 21);
      } else {
        item.status = 'archived';
      }
    } else {
      // Failed revision: Reset back to Stage 1 (1 day)
      item.intervalStage = 1;
      item.nextRevisionDate = addDaysToDateStr(today, 1);
      item.status = 'pending';
    }

    queue[itemIndex] = item;
    await set(STORAGE_KEYS.REVISION_QUEUE, queue);
  }

  // --- Skills Matrix ---
  async getSkills(): Promise<SkillItem[]> {
    await this.initializeStore();
    return (await get<SkillItem[]>(STORAGE_KEYS.SKILLS)) || INITIAL_SKILLS;
  }

  async updateSkillLevel(skillId: string, level: SkillItem['currentLevel']): Promise<void> {
    const skills = await this.getSkills();
    const target = skills.find(s => s.id === skillId);
    if (target) {
      target.currentLevel = level;
      target.lastPracticedAt = new Date().toISOString();
      await set(STORAGE_KEYS.SKILLS, skills);
    }
  }

  // --- Journal Entries ---
  async getJournalEntries(): Promise<JournalEntry[]> {
    await this.initializeStore();
    return (await get<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES)) || [];
  }

  async createJournalEntry(entryInput: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry> {
    const entries = await this.getJournalEntries();
    const newEntry: JournalEntry = {
      ...entryInput,
      id: `journal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    await set(STORAGE_KEYS.JOURNAL_ENTRIES, entries);
    return newEntry;
  }

  // --- Evidence Management ---
  async getEvidenceRecords(): Promise<EvidenceRecord[]> {
    await this.initializeStore();
    return (await get<EvidenceRecord[]>(STORAGE_KEYS.EVIDENCE)) || [];
  }

  async submitEvidence(input: Omit<EvidenceRecord, 'id' | 'createdAt'>): Promise<EvidenceRecord> {
    const records = await this.getEvidenceRecords();
    const newRecord: EvidenceRecord = {
      ...input,
      id: `evi_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    await set(STORAGE_KEYS.EVIDENCE, records);
    return newRecord;
  }

  // --- Academic Manager ---
  async getAcademicCourses(): Promise<AcademicCourse[]> {
    await this.initializeStore();
    return (await get<AcademicCourse[]>(STORAGE_KEYS.ACADEMIC_COURSES)) || INITIAL_ACADEMIC_COURSES;
  }

  // --- Market Intelligence ---
  async getMarketIntelligence(): Promise<MarketIntelligenceItem[]> {
    await this.initializeStore();
    return (await get<MarketIntelligenceItem[]>(STORAGE_KEYS.MARKET_DATA)) || INITIAL_MARKET_INTELLIGENCE;
  }

  // --- Backup & Export ---
  async exportAllData(): Promise<Record<string, unknown>> {
    return {
      profile: await this.getProfile(),
      roadmapPhases: await this.getRoadmapPhases(),
      dailyPlans: await this.getAllDailyPlans(),
      dsaProblems: await this.getDSAProblems(),
      revisionQueue: await this.getRevisionQueue(),
      skills: await this.getSkills(),
      journalEntries: await this.getJournalEntries(),
      evidence: await this.getEvidenceRecords(),
      academicCourses: await this.getAcademicCourses(),
      marketData: await this.getMarketIntelligence(),
      streak: await this.getStreak(),
      exportedAt: new Date().toISOString(),
      timezone: 'Asia/Kolkata',
    };
  }
}

export const localStore = new LocalDataStore();

