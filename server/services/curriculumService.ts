import fs from 'fs';
import path from 'path';
import CurriculumItem from '../models/CurriculumItem.js';
import Milestone from '../models/Milestone.js';
import DailyPlan, { IDailyPlan } from '../models/DailyPlan.js';
import CurriculumProgress from '../models/CurriculumProgress.js';
import { formatISTDate } from '../../src/lib/date-utils.js';

interface RawDay {
  date: string;
  journeyDay: number;
  dayOfWeek: number;
  kind: 'topic' | 'checkpoint' | 'review';
  title: string;
  category: string;
  minutes: number;
  practice: string;
  supportingPractice?: string;
  subtopics: string[];
  subtopicItems: Array<{ id: string; name: string; description?: string }>;
  learningObjectives?: string[];
  description?: string;
  expectedOutcome?: string;
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
  itemId: string;
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
  startJourneyDay: number;
  endJourneyDay: number;
  requiredItemIds: string[];
  requiredItemCount: number;
  progressRule?: string;
  projectId?: string | null;
  notes?: string;
}

let curriculumByDate: Map<string, RawDay> | null = null;
let curriculumByItemId: Map<string, RawDay> | null = null;
let cachedMilestones: RawMilestone[] = [];
let projectsMap: Map<string, any> = new Map();
let researchCheckpoints: any[] = [];

export function loadCurriculumData(): {
  curriculumByDate: Map<string, RawDay>;
  curriculumByItemId: Map<string, RawDay>;
  cachedMilestones: RawMilestone[];
  projectsMap: Map<string, any>;
  researchCheckpoints: any[];
} {
  if (curriculumByDate && curriculumByItemId && cachedMilestones.length > 0) {
    return {
      curriculumByDate,
      curriculumByItemId,
      cachedMilestones,
      projectsMap,
      researchCheckpoints,
    };
  }

  const possiblePaths = [
    path.resolve(process.cwd(), 'server/data/FORGE_OS_18_MONTH_CURRICULUM_V1_1.json'),
    path.resolve(process.cwd(), 'server/data/FORGE_OS_18_MONTH_CURRICULUM.json'),
  ];

  let rawJson = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      rawJson = fs.readFileSync(p, 'utf8');
      break;
    }
  }

  if (!rawJson) {
    throw new Error('FORGE_OS_18_MONTH_CURRICULUM_V1_1.json not found');
  }

  const data = JSON.parse(rawJson);
  const byDate = new Map<string, RawDay>();
  const byItemId = new Map<string, RawDay>();

  if (Array.isArray(data.phases)) {
    for (const phase of data.phases) {
      if (Array.isArray(phase.weeks)) {
        for (const week of phase.weeks) {
          if (Array.isArray(week.days)) {
            for (const day of week.days) {
              const itemId = day.itemId || `journey_day_${String(day.journeyDay).padStart(3, '0')}`;
              const normalizedSubtopics: string[] = (day.subtopics || []).map((s: any) => {
                if (typeof s === 'string') return s;
                if (typeof s === 'object' && s !== null) return s.title || s.name || '';
                return String(s || '');
              });

              const normalizedSubtopicItems = (day.subtopicItems || []).map((item: any, idx: number) => {
                let nameStr = '';
                let descStr = '';
                let idStr = item.id || `${itemId}_sub_${idx + 1}`;

                if (typeof item.name === 'string') {
                  nameStr = item.name;
                  descStr = item.description || '';
                } else if (typeof item.name === 'object' && item.name !== null) {
                  nameStr = item.name.title || item.name.name || '';
                  descStr = item.name.description || item.description || '';
                  if (item.name.id && !item.id) idStr = item.name.id;
                } else if (typeof item === 'string') {
                  nameStr = item;
                } else if (typeof item === 'object' && item !== null) {
                  nameStr = item.title || item.name || '';
                  descStr = item.description || '';
                }

                return {
                  id: idStr,
                  name: nameStr,
                  description: descStr,
                };
              });

              const enriched: RawDay = {
                ...day,
                itemId,
                phase: day.phase || phase.phaseNumber,
                phaseId: day.phaseId || `P${phase.phaseNumber}`,
                phaseTitle: day.phaseTitle || phase.phaseTitle || '',
                globalWeek: day.globalWeek || week.weekNumber,
                phaseWeek: day.phaseWeek || week.phaseWeek || 1,
                weekTitle: day.weekTitle || week.weekTitle || '',
                weekFocus: day.weekFocus || week.weekFocus || '',
                weeklyDeliverable: day.weeklyDeliverable || week.weeklyDeliverable || '',
                weekResearchCheckpoint: day.weekResearchCheckpoint || week.researchCheckpoint || null,
                milestoneId: day.milestoneId || 'M01',
                subtopics: normalizedSubtopics,
                subtopicItems: normalizedSubtopicItems,
              };

              byDate.set(enriched.date, enriched);
              byItemId.set(enriched.itemId, enriched);
            }
          }
        }
      }
    }
  }

  if (data.graduationDay && data.graduationDay.date) {
    const gradDay = data.graduationDay;
    const normalizedSubtopics: string[] = (gradDay.subtopics || []).map((s: any) => {
      if (typeof s === 'string') return s;
      if (typeof s === 'object' && s !== null) return s.title || s.name || '';
      return String(s || '');
    });

    const normalizedSubtopicItems = (gradDay.subtopicItems || []).map((item: any, idx: number) => {
      let nameStr = typeof item === 'string' ? item : item.name || item.title || '';
      if (typeof nameStr === 'object' && nameStr !== null) {
        nameStr = (nameStr as any).title || (nameStr as any).name || '';
      }
      return {
        id: item.id || `journey_day_547_sub_${String(idx + 1).padStart(2, '0')}`,
        name: String(nameStr),
        description: item.description || '',
      };
    });

    const enrichedGrad: RawDay = {
      ...gradDay,
      itemId: gradDay.itemId || 'journey_day_547',
      kind: gradDay.kind || 'checkpoint',
      phase: 6,
      phaseId: 'P6',
      phaseTitle: 'AI engineering, LLM systems and research',
      globalWeek: 78,
      phaseWeek: 13,
      dayOfWeek: 1,
      milestoneId: 'M17',
      subtopics: normalizedSubtopics,
      subtopicItems: normalizedSubtopicItems,
    };

    byDate.set(enrichedGrad.date, enrichedGrad);
    byItemId.set(enrichedGrad.itemId, enrichedGrad);
  }

  if (Array.isArray(data.projects)) {
    for (const proj of data.projects) {
      if (proj.id) {
        projectsMap.set(proj.id, proj);
      }
    }
  }

  if (Array.isArray(data.researchCheckpoints)) {
    researchCheckpoints = data.researchCheckpoints;
  }

  curriculumByDate = byDate;
  curriculumByItemId = byItemId;
  cachedMilestones = Array.isArray(data.milestones) ? data.milestones : [];

  return {
    curriculumByDate,
    curriculumByItemId,
    cachedMilestones,
    projectsMap,
    researchCheckpoints,
  };
}

export async function recalculateMilestoneProgress(): Promise<void> {
  // Find all completed items in CurriculumProgress
  const completedProgressRecords = await CurriculumProgress.find(
    { completed: true },
    { itemId: 1 }
  ).lean();

  const completedItemIds = new Set(completedProgressRecords.map((r: any) => r.itemId));

  const allMilestones = await Milestone.find({}).sort({ order: 1 });
  let foundCurrent = false;

  for (const m of allMilestones) {
    const required = m.requiredItemIds || [];
    const totalRequired = m.requiredItemCount || required.length || 1;
    const completedCount = required.filter((id: string) => completedItemIds.has(id)).length;
    const progressPct = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;

    let status: 'upcoming' | 'current' | 'completed' = 'upcoming';

    if (completedCount >= totalRequired && totalRequired > 0) {
      status = 'completed';
    } else if (!foundCurrent) {
      status = 'current';
      foundCurrent = true;
    } else {
      status = 'upcoming';
    }

    m.completedItemCount = completedCount;
    m.progressPct = Math.min(progressPct, 100);
    m.status = status;
    if (status === 'completed' && !m.completedDate) {
      m.completedDate = formatISTDate();
    } else if (status !== 'completed') {
      m.completedDate = null;
    }

    await m.save();
  }
}

export async function seedInitialCurriculum(): Promise<void> {
  try {
    const { curriculumByDate, cachedMilestones } = loadCurriculumData();

    // 1. Bulk Upsert all 547 Curriculum Items using bulkWrite
    const bulkOps = [];
    for (const item of curriculumByDate.values()) {
      bulkOps.push({
        updateOne: {
          filter: { itemId: item.itemId },
          update: {
            $set: {
              journeyDay: item.journeyDay,
              date: item.date,
              dayOfWeek: item.dayOfWeek,
              kind: item.kind,
              title: item.title,
              category: item.category,
              minutes: item.minutes || 120,
              practice: item.practice || '',
              supportingPractice: item.supportingPractice || '',
              subtopics: item.subtopics || [],
              subtopicItems: item.subtopicItems || [],
              learningObjectives: item.learningObjectives || item.subtopics || [],
              description: item.description || item.practice || item.title,
              expectedOutcome: item.expectedOutcome || '',
              difficulty: item.difficulty || 'foundational',
              phase: item.phase,
              phaseId: item.phaseId,
              phaseTitle: item.phaseTitle,
              globalWeek: item.globalWeek,
              phaseWeek: item.phaseWeek,
              weekTitle: item.weekTitle,
              weekFocus: item.weekFocus,
              weeklyDeliverable: item.weeklyDeliverable,
              weekResearchCheckpoint: item.weekResearchCheckpoint || null,
              milestoneId: item.milestoneId,
            },
          },
          upsert: true,
        },
      });
    }

    if (bulkOps.length > 0) {
      await CurriculumItem.bulkWrite(bulkOps, { ordered: false });
    }

    // 2. Seed all 17 milestones idempotently with requiredItemIds and counts
    for (let i = 0; i < cachedMilestones.length; i++) {
      const ms = cachedMilestones[i];
      await Milestone.findOneAndUpdate(
        { milestoneId: ms.milestoneId },
        {
          $setOnInsert: {
            notes: ms.notes || '',
            completedDate: null,
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
            startJourneyDay: ms.startJourneyDay,
            endJourneyDay: ms.endJourneyDay,
            requiredItemIds: ms.requiredItemIds || [],
            requiredItemCount: ms.requiredItemCount || (ms.requiredItemIds?.length || 0),
            progressRule: ms.progressRule || 'Complete all required items',
            projectId: ms.projectId || null,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // 3. Sync milestone statuses based on canonical CurriculumProgress
    await recalculateMilestoneProgress();

    // 4. Ensure Today's DailyPlan exists
    const todayStr = formatISTDate();
    await getOrCreateDailyPlan(todayStr);

    console.log(
      `[Curriculum V1.1] Ready: ${curriculumByDate.size} items indexed via bulkWrite, ${cachedMilestones.length} milestones synced.`
    );
  } catch (err) {
    console.warn('[Curriculum] Seed operation deferred (MongoDB may be connecting):', err);
  }
}

export async function syncItemProgress(
  itemId: string,
  completed: boolean,
  completedSubtopicIds: string[],
  notes?: string
): Promise<void> {
  const { curriculumByItemId } = loadCurriculumData();
  const item = curriculumByItemId.get(itemId);
  const journeyDay = item?.journeyDay || 1;
  const date = item?.date || formatISTDate();

  const totalSubtopics = item?.subtopicItems?.length || 0;
  const progressPct = completed
    ? 100
    : totalSubtopics > 0
    ? Math.round((completedSubtopicIds.length / totalSubtopics) * 100)
    : 0;

  const status = completed
    ? 'completed'
    : completedSubtopicIds.length > 0
    ? 'in_progress'
    : 'not_started';

  const updateFields: any = {
    journeyDay,
    date,
    status,
    completed,
    completedSubtopicIds,
    progressPct,
    lastActivityAt: new Date(),
  };

  if (completed) {
    updateFields.completedAt = new Date();
  } else {
    updateFields.completedAt = null;
  }

  if (notes !== undefined) {
    updateFields.notes = notes;
  }

  await CurriculumProgress.findOneAndUpdate(
    { itemId },
    { $set: updateFields },
    { upsert: true, returnDocument: 'after' }
  );

  // Recalculate milestone progress across all 17 milestones
  await recalculateMilestoneProgress();
}

export async function getOrCreateDailyPlan(dateStr: string): Promise<IDailyPlan | any> {
  const existing = await DailyPlan.findOne({ date: dateStr });
  const { curriculumByDate } = loadCurriculumData();
  const dayData = curriculumByDate.get(dateStr);

  if (!dayData) {
    // If date is outside curriculum boundaries, never return fallback from day 1-3
    if (existing) return existing;
    return null;
  }

  if (existing) {
    // Check if the plan is using the canonical itemId; if not, migrate while preserving user notes/attachments
    const canonicalItemId = dayData.itemId;
    const currentItem = existing.assignedItems[0];
    if (currentItem && currentItem.itemId !== canonicalItemId) {
      currentItem.itemId = canonicalItemId;
      currentItem.title = dayData.title;
      currentItem.type = dayData.kind;
      currentItem.category = dayData.category;
      currentItem.description = dayData.description || dayData.practice;
      currentItem.practicalTask = dayData.practice;
      currentItem.supportingPractice = dayData.supportingPractice || '';
      currentItem.expectedOutcome = dayData.expectedOutcome || '';
      existing.journeyDay = dayData.journeyDay;
      existing.phase = dayData.phase;
      existing.week = dayData.globalWeek;
      await existing.save();
    }
    return existing;
  }

  // Create new DailyPlan atomically
  const journeyDay = dayData.journeyDay;
  const phase = dayData.phase;
  const week = dayData.globalWeek;

  // Check if there is existing canonical progress
  const canonicalProg = await CurriculumProgress.findOne({ itemId: dayData.itemId }).lean();
  const completedSubtopicsSet = new Set((canonicalProg as any)?.completedSubtopicIds || []);
  const isItemCompleted = Boolean((canonicalProg as any)?.completed);

  const subtopics = (dayData.subtopicItems || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description || '',
    explanation: '',
    completed: completedSubtopicsSet.has(s.id) || isItemCompleted,
  }));

  const assignedItem = {
    itemId: dayData.itemId,
    title: dayData.title,
    type: dayData.kind,
    category: dayData.category,
    description: dayData.description || dayData.practice || dayData.title,
    whatYouWillLearn: dayData.subtopics || [],
    learningObjectives: dayData.learningObjectives || dayData.subtopics || [],
    subtopics,
    practicalTask: dayData.practice || '',
    supportingPractice: dayData.supportingPractice || '',
    expectedOutcome: dayData.expectedOutcome || '',
    estimatedMinutes: dayData.minutes || 120,
    completed: isItemCompleted,
    progressPct: isItemCompleted ? 100 : (canonicalProg as any)?.progressPct || 0,
    notes: (canonicalProg as any)?.notes || '',
    attachments: [],
  };

  const newPlan = await DailyPlan.findOneAndUpdate(
    { date: dateStr },
    {
      $setOnInsert: {
        date: dateStr,
        journeyDay,
        phase,
        week,
        assignedItems: [assignedItem],
        completionPercentage: isItemCompleted ? 100 : (canonicalProg as any)?.progressPct || 0,
        completed: isItemCompleted,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return newPlan;
}
