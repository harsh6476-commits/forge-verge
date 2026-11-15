import CurriculumItem from '../models/CurriculumItem.js';
import Milestone from '../models/Milestone.js';
import DailyPlan, { IDailyPlan } from '../models/DailyPlan.js';
import { INITIAL_CURRICULUM_SEEDS, INITIAL_MILESTONES_SEEDS } from './curriculumSeeds.js';
import { formatISTDate, getDayNumberInRoadmap, getPhaseNumberForDate, getWeekNumberForDate } from '../../src/lib/date-utils.js';

export async function seedInitialCurriculum(): Promise<void> {
  try {
    // 1. Seed Curriculum Items idempotently
    for (const item of INITIAL_CURRICULUM_SEEDS) {
      await CurriculumItem.findOneAndUpdate(
        { itemId: item.itemId },
        { $set: item },
        { upsert: true, new: true }
      );
    }

    // 2. Seed Milestones idempotently
    for (const ms of INITIAL_MILESTONES_SEEDS) {
      await Milestone.findOneAndUpdate(
        { milestoneId: ms.milestoneId },
        { $set: ms },
        { upsert: true, new: true }
      );
    }

    // 3. Ensure Today's DailyPlan exists
    const todayStr = formatISTDate();
    await getOrCreateDailyPlan(todayStr);

    console.log('Curriculum and Milestones initialized successfully');
  } catch (err) {
    console.warn('Seed operation deferred (MongoDB may be connecting):', err);
  }
}

export async function getOrCreateDailyPlan(dateStr: string): Promise<IDailyPlan | any> {
  const existing = await DailyPlan.findOne({ date: dateStr });
  if (existing) {
    return existing;
  }

  const journeyDay = getDayNumberInRoadmap(dateStr);
  const phase = getPhaseNumberForDate(dateStr);
  const week = getWeekNumberForDate(dateStr);

  // Day of week cycle (1 to 7)
  const dayInCycle = ((journeyDay - 1) % 7) + 1;

  // Find curriculum items for this phase/week/day
  let items = await CurriculumItem.find({ phase, week, day: dayInCycle }).sort({ order: 1 });

  // If none found for specific day, fallback to cycle modulo existing seeds
  if (!items || items.length === 0) {
    const fallbackDay = ((journeyDay - 1) % 3) + 1; // map to days 1..3
    items = await CurriculumItem.find({ day: fallbackDay }).sort({ order: 1 });
  }

  const assignedItems = items.map(item => ({
    itemId: item.itemId,
    title: item.title,
    type: item.type,
    category: item.category,
    description: item.description,
    whatYouWillLearn: item.whatYouWillLearn,
    learningObjectives: item.learningObjectives,
    subtopics: item.subtopics.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      explanation: s.explanation,
      completed: false,
    })),
    practicalTask: item.practicalTask,
    expectedOutcome: item.expectedOutcome,
    estimatedMinutes: item.estimatedMinutes,
    completed: false,
    progressPct: 0,
    notes: '',
    attachments: [],
  }));

  const newPlan = await DailyPlan.create({
    date: dateStr,
    journeyDay,
    phase,
    week,
    assignedItems,
    completionPercentage: 0,
    completed: false,
  });

  return newPlan;
}

