import { DailyPlan, LearningTask, AcademicMode } from '@/types';
import { addDaysToDateStr, getDayNumberInRoadmap, getPhaseNumberForDate, getWeekNumberForDate } from '@/lib/date-utils';

interface DayCurriculumTemplate {
  dayTitle: string;
  dailyObjective: string;
  dsaTopic: string;
  dsaTask: string;
  dsaDuration: number;
  engTopic: string;
  engTask: string;
  engDuration: number;
  reasoningTask: string;
  visualLessonId?: string;
}

// 7-day revolving structured curriculum cycle for Phase 1
const PHASE_1_CURRICULUM_CYCLE: DayCurriculumTemplate[] = [
  // Day 1: Monday
  {
    dayTitle: 'Time Complexity & Array Traversal',
    dailyObjective: 'Master Big-O analysis and fundamental array traversal in C++ & JavaScript.',
    dsaTopic: 'Time Complexity & Arrays in C++',
    dsaTask: 'Solve "Maximum and Minimum in Array" and "Second Largest Element in Array" on LeetCode/Striver.',
    dsaDuration: 45,
    engTopic: 'JavaScript Arrays & Execution Context',
    engTask: 'Deep dive into V8 Array memory layouts, map/filter/reduce performance, and call stack.',
    engDuration: 60,
    reasoningTask: 'Explain why O(n) linear scan is optimal for unsorted arrays compared to O(n log n) sorting.',
    visualLessonId: 'vis-time-complexity',
  },
  // Day 2: Tuesday
  {
    dayTitle: 'Prefix Sums & Frequency Hashing',
    dailyObjective: 'Implement hash map lookups and prefix sum optimization in O(1) time.',
    dsaTopic: 'Frequency Counting & Prefix Sums',
    dsaTask: 'Solve "Two Sum" using hash map and "Subarray Sum Equals K" in C++.',
    dsaDuration: 45,
    engTopic: 'JS Objects, Maps & Memory References',
    engTask: 'Benchmark Map vs Object lookups with 100k items. Document garbage collection impact.',
    engDuration: 60,
    reasoningTask: 'Differentiate hash collisions handling (Separate Chaining vs Open Addressing).',
    visualLessonId: 'vis-hash-maps',
  },
  // Day 3: Wednesday
  {
    dayTitle: 'Two Pointers & String Manipulation',
    dailyObjective: 'Write two-pointer solutions for in-place array/string transformations.',
    dsaTopic: 'Two Pointers Pattern',
    dsaTask: 'Solve "Valid Palindrome" and "Container With Most Water" using two pointers in C++.',
    dsaDuration: 45,
    engTopic: 'React Component Lifecycle & Re-rendering',
    engTask: 'Build a high-performance React component with memo, useMemo, and useCallback to verify renders.',
    engDuration: 60,
    reasoningTask: 'When does two pointers fail on unsorted data without preprocessing?',
    visualLessonId: 'vis-two-pointers',
  },
  // Day 4: Thursday
  {
    dayTitle: 'Sliding Window & Substring Problems',
    dailyObjective: 'Understand fixed vs dynamic sliding window algorithms.',
    dsaTopic: 'Sliding Window Algorithm',
    dsaTask: 'Solve "Maximum Subarray of Size K" and "Longest Substring Without Repeating Characters".',
    dsaDuration: 45,
    engTopic: 'Custom Hooks & State Encapsulation',
    engTask: 'Implement a reusable `useLocalStorage` and `useDebounce` hook with TypeScript generics.',
    engDuration: 60,
    reasoningTask: 'Analyze the amortized time complexity of the right and left pointers advancing in sliding window.',
    visualLessonId: 'vis-sliding-window',
  },
  // Day 5: Friday
  {
    dayTitle: 'Binary Search Fundamentals',
    dailyObjective: 'Implement bug-free binary search on sorted arrays and search spaces.',
    dsaTopic: 'Binary Search & Monotonic Spaces',
    dsaTask: 'Solve "Binary Search" and "Search in Rotated Sorted Array" in C++.',
    dsaDuration: 45,
    engTopic: 'Async JavaScript & Event Loop Microtasks',
    engTask: 'Write a custom Promise polyfill or rate-limited fetch queue using async/await.',
    engDuration: 60,
    reasoningTask: 'Why does `mid = left + (right - left) / 2` prevent integer overflow in C++?',
    visualLessonId: 'vis-event-loop',
  },
  // Day 6: Saturday
  {
    dayTitle: 'Project Deep Work: Productivity Platform',
    dailyObjective: 'Advance the portfolio project with modular architecture and test coverage.',
    dsaTopic: 'Mixed Problem Solving Assessment',
    dsaTask: 'Timed 40-minute assessment solving 2 mixed array/pointer problems under pressure.',
    dsaDuration: 40,
    engTopic: 'Portfolio Architecture & Component Design',
    engTask: 'Implement task filtering, search indexing, and local persistence in the Productivity App.',
    engDuration: 75,
    reasoningTask: 'Write an architecture decision record (ADR) justifying client-side indexing vs server querying.',
    visualLessonId: 'vis-architecture-adr',
  },
  // Day 7: Sunday
  {
    dayTitle: 'Weekly Checkpoint & Spaced Revision',
    dailyObjective: 'Consolidate the week, complete spaced repetition, and write engineering reflection.',
    dsaTopic: 'Spaced Repetition & Revision Queue',
    dsaTask: 'Review all problems tagged in the 1-day and 3-day revision queues without hints.',
    dsaDuration: 45,
    engTopic: 'Weekly Engineering Journal & Synthesis',
    engTask: 'Draft the weekly reflection covering what worked, blockers, and next week priorities.',
    engDuration: 45,
    reasoningTask: 'Document one conceptual mistake made this week and how you resolved it.',
    visualLessonId: 'vis-weekly-review',
  },
];

/**
 * Generates a rolling window of daily plans (e.g. 30 days) from a start date
 */
export function generateRollingDailyPlans(
  startDateStr: string,
  daysCount: number = 30,
  mode: AcademicMode = 'normal',
  dailyHours: number = 2.5
): DailyPlan[] {
  const plans: DailyPlan[] = [];

  for (let i = 0; i < daysCount; i++) {
    const dateStr = addDaysToDateStr(startDateStr, i);
    const dayNumber = getDayNumberInRoadmap(dateStr);
    const phaseNumber = getPhaseNumberForDate(dateStr);
    const weekNumber = getWeekNumberForDate(dateStr);
    
    // Day of week cycle (0 to 6)
    const cycleIndex = (dayNumber - 1) % PHASE_1_CURRICULUM_CYCLE.length;
    const template = PHASE_1_CURRICULUM_CYCLE[cycleIndex];

    const planId = `plan-${dateStr}`;

    // Adjust hours based on mode
    let plannedHours = dailyHours;
    if (mode === 'examination') {
      plannedHours = 0.75; // 45 mins extracurricular, rest to academics
    } else if (mode === 'vacation') {
      plannedHours = 4.5;
    }

    const tasks: LearningTask[] = [];

    if (mode === 'examination') {
      // Examination Mode: Light DSA maintenance + academic study
      tasks.push({
        id: `task-${dateStr}-dsa`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'dsa',
        topic: template.dsaTopic,
        objective: 'Maintain problem-solving sharpness with 1 targeted problem.',
        durationMinutes: 30,
        priority: 'p0',
        status: 'todo',
        challengePrompt: template.dsaTask,
        evidenceRequired: true,
      });

      tasks.push({
        id: `task-${dateStr}-academic`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'academic',
        topic: 'University Examination Preparation',
        objective: 'Complete syllabus checklist topics and review university past papers.',
        durationMinutes: 90,
        priority: 'p0',
        status: 'todo',
        evidenceRequired: false,
      });
    } else {
      // Normal / Vacation Mode: Balanced DSA + Engineering + Practice + Reasoning
      tasks.push({
        id: `task-${dateStr}-dsa`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'dsa',
        topic: template.dsaTopic,
        objective: template.dsaTask,
        durationMinutes: template.dsaDuration,
        priority: 'p0',
        status: 'todo',
        visualLessonId: template.visualLessonId,
        challengePrompt: template.dsaTask,
        evidenceRequired: true,
      });

      tasks.push({
        id: `task-${dateStr}-eng`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'engineering',
        topic: template.engTopic,
        objective: template.engTask,
        durationMinutes: mode === 'vacation' ? template.engDuration + 60 : template.engDuration,
        priority: 'p0',
        status: 'todo',
        evidenceRequired: true,
      });

      tasks.push({
        id: `task-${dateStr}-reasoning`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'reasoning',
        topic: 'Technical Explanation & Architectural Reasoning',
        objective: template.reasoningTask,
        durationMinutes: 15,
        priority: 'p1',
        status: 'todo',
        evidenceRequired: false,
      });

      tasks.push({
        id: `task-${dateStr}-practice`,
        dailyPlanId: planId,
        dateStr,
        sessionType: 'practice',
        topic: 'Git Commit & Code Quality',
        objective: 'Commit code to GitHub with descriptive semantic commit messages.',
        durationMinutes: 15,
        priority: 'p2',
        status: 'todo',
        evidenceRequired: true,
      });
    }

    plans.push({
      id: planId,
      dateStr,
      phaseNumber,
      weekNumber,
      dayNumber,
      dayTitle: template.dayTitle,
      dailyObjective: template.dailyObjective,
      plannedHours,
      actualHours: 0,
      status: 'pending',
      mode,
      tasks,
    });
  }

  return plans;
}

