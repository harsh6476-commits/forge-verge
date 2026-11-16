import fs from 'fs';
import path from 'path';
import Milestone from '../models/Milestone.js';
import DailyPlan, { IDailyPlan } from '../models/DailyPlan.js';
import {
  formatISTDate,
  getDayNumberInRoadmap,
  getPhaseNumberForDate,
  getWeekNumberForDate,
} from '../../src/lib/date-utils.js';

interface RawDay {
  date: string;
  journeyDay: number;
  dayOfWeek?: number;
  kind?: 'topic' | 'checkpoint' | 'review';
  title: string;
  category: string;
  minutes?: number;
  subtopics?: Array<string | { id?: string; title?: string; name?: string; description?: string; explanation?: string }>;
  practice?: string;
  supportingPractice?: string;
  description?: string;
  learningObjectives?: string[];
  expectedOutcome?: string;
  difficulty?: string;
  phase?: number;
  week?: number;
}

interface RawMilestone {
  milestoneId: string;
  title: string;
  tagline?: string;
  description: string;
  phase: number;
  targetWeek: number | null;
  journeyDay: number;
  targetDate: string;
  technologies?: string[];
  topicsCovered?: string[];
  acceptanceCriteria?: string[];
  status?: 'upcoming' | 'current' | 'completed';
  completedDate?: string | null;
  notes?: string;
  projectId?: string | null;
}

let curriculumByDate: Map<string, RawDay> | null = null;
let cachedMilestones: RawMilestone[] | null = null;
let projectsMap: Map<string, any> = new Map();

export function loadCurriculumData(): {
  curriculumByDate: Map<string, RawDay>;
  cachedMilestones: RawMilestone[];
  projectsMap: Map<string, any>;
} {
  if (curriculumByDate && cachedMilestones) {
    return { curriculumByDate, cachedMilestones, projectsMap };
  }

  const possiblePaths = [
    path.resolve(process.cwd(), 'server/data/FORGE_OS_18_MONTH_CURRICULUM.json'),
    path.resolve(process.cwd(), 'data/FORGE_OS_18_MONTH_CURRICULUM.json'),
    path.resolve(process.cwd(), '../data/FORGE_OS_18_MONTH_CURRICULUM.json'),
  ];

  let rawJson = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      rawJson = fs.readFileSync(p, 'utf8');
      break;
    }
  }

  if (!rawJson) {
    throw new Error('FORGE_OS_18_MONTH_CURRICULUM.json not found');
  }

  const data = JSON.parse(rawJson);
  const byDate = new Map<string, RawDay>();

  if (Array.isArray(data.phases)) {
    for (const phase of data.phases) {
      if (Array.isArray(phase.weeks)) {
        for (const week of phase.weeks) {
          if (Array.isArray(week.days)) {
            for (const day of week.days) {
              byDate.set(day.date, {
                ...day,
                phase: phase.phaseNumber,
                week: week.weekNumber,
              });
            }
          }
        }
      }
    }
  }

  if (data.graduationDay && data.graduationDay.date) {
    byDate.set(data.graduationDay.date, {
      ...data.graduationDay,
      phase: 6,
      week: 78,
      kind: 'review',
    });
  }

  if (Array.isArray(data.projects)) {
    for (const proj of data.projects) {
      if (proj.id) {
        projectsMap.set(proj.id, proj);
      }
    }
  }

  curriculumByDate = byDate;
  cachedMilestones = Array.isArray(data.milestones) ? data.milestones : [];

  return { curriculumByDate, cachedMilestones, projectsMap };
}

export async function seedInitialCurriculum(): Promise<void> {
  try {
    const { cachedMilestones } = loadCurriculumData();

    // 1. Purge legacy placeholder milestones if any exist
    await Milestone.deleteMany({ milestoneId: { $not: /^M\d+$/ } });

    // 2. Seed all 17 milestones idempotently
    for (let i = 0; i < cachedMilestones.length; i++) {
      const ms = cachedMilestones[i];
      await Milestone.findOneAndUpdate(
        { milestoneId: ms.milestoneId },
        {
          $setOnInsert: {
            status: ms.status || (i === 0 ? 'current' : 'upcoming'),
            completedDate: ms.completedDate || null,
            notes: ms.notes || '',
          },
          $set: {
            order: i + 1,
            phase: ms.phase,
            targetWeek: ms.targetWeek ?? null,
            journeyDay: ms.journeyDay,
            targetDate: ms.targetDate,
            title: ms.title,
            tagline: ms.tagline || '',
            description: ms.description,
            technologies: ms.technologies || [],
            topicsCovered: ms.topicsCovered || [],
            acceptanceCriteria: ms.acceptanceCriteria || [],
            projectId: ms.projectId || null,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // 3. Purge any legacy daily plans created from old temporary dummy seeds
    await DailyPlan.deleteMany({
      'assignedItems.itemId': { $regex: /^p1_w1_/ },
    });

    // 4. Ensure Today's DailyPlan exists with exact dated record
    const todayStr = formatISTDate();
    await getOrCreateDailyPlan(todayStr);

    console.log(
      `[Curriculum] 18-month curriculum ready: ${curriculumByDate?.size || 0} dates indexed, ${cachedMilestones.length} milestones active.`
    );
  } catch (err) {
    console.warn('[Curriculum] Seed operation deferred (MongoDB may be connecting):', err);
  }
}

export async function getOrCreateDailyPlan(dateStr: string): Promise<IDailyPlan | any> {
  const existing = await DailyPlan.findOne({ date: dateStr });
  if (existing) {
    return existing;
  }

  const { curriculumByDate } = loadCurriculumData();
  const dayData = curriculumByDate.get(dateStr);

  const journeyDay = dayData ? dayData.journeyDay : getDayNumberInRoadmap(dateStr);
  const phase = dayData?.phase ?? getPhaseNumberForDate(dateStr);
  const week = dayData?.week ?? getWeekNumberForDate(dateStr);

  const rawSubtopics = dayData?.subtopics || [];
  const subtopics = rawSubtopics.map((s: any, idx: number) => {
    if (typeof s === 'string') {
      return {
        id: `sub_${journeyDay}_${idx + 1}`,
        name: s,
        description: '',
        explanation: '',
        completed: false,
      };
    }
    return {
      id: s.id || `sub_${journeyDay}_${idx + 1}`,
      name: s.title || s.name || '',
      description: s.description || '',
      explanation: s.explanation || '',
      completed: false,
    };
  });

  const learningObjectives: string[] = dayData?.learningObjectives || rawSubtopics.map((s: any) =>
    typeof s === 'string' ? s : (s.title || s.name || '')
  );

  const whatYouWillLearn: string[] = rawSubtopics.map((s: any) =>
    typeof s === 'string' ? s : `${s.title || s.name}: ${s.description || ''}`
  );

  let type: 'topic' | 'checkpoint' | 'review' = 'topic';
  if (dayData?.kind) {
    type = dayData.kind;
  } else if (dayData?.dayOfWeek === 6) {
    type = 'checkpoint';
  } else if (dayData?.dayOfWeek === 7) {
    type = 'review';
  }

  const title = dayData?.title || `Day ${journeyDay} Deliberate Practice`;
  const category = dayData?.category || 'Core CS';
  const practicalTask = dayData?.practice || '';
  const expectedOutcome =
    dayData?.expectedOutcome ||
    (dayData?.supportingPractice ? `Supporting practice: ${dayData.supportingPractice}` : '');
  const estimatedMinutes = dayData?.minutes || 150;
  const description = dayData?.description || (practicalTask ? `Practice: ${practicalTask}` : title);

  const assignedItem = {
    itemId: `day_${journeyDay}`,
    title,
    type,
    category,
    description,
    whatYouWillLearn,
    learningObjectives,
    subtopics,
    practicalTask,
    expectedOutcome,
    estimatedMinutes,
    completed: false,
    progressPct: 0,
    notes: '',
    attachments: [],
  };

  const newPlan = await DailyPlan.create({
    date: dateStr,
    journeyDay,
    phase,
    week,
    assignedItems: [assignedItem],
    completionPercentage: 0,
    completed: false,
  });

  return newPlan;
}
