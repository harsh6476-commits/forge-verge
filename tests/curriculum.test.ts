import { describe, it, expect } from 'vitest';
import { loadCurriculumData } from '../server/services/curriculumService';

describe('18-Month Curriculum Integrity & Ingestion', () => {
  it('loads the curriculum JSON and indexes all 547 dates', () => {
    const { curriculumByDate, cachedMilestones, projectsMap } = loadCurriculumData();

    // 546 regular roadmap days + Day 547 graduation showcase = 547 days
    expect(curriculumByDate.size).toBe(547);

    // 17 outcome-based milestones
    expect(cachedMilestones.length).toBe(17);

    // 7 projects
    expect(projectsMap.size).toBe(7);
  });

  it('correctly maps Day 1 on 2026-11-16 to engineering baseline', () => {
    const { curriculumByDate } = loadCurriculumData();
    const day1 = curriculumByDate.get('2026-11-16');

    expect(day1).toBeDefined();
    expect(day1?.journeyDay).toBe(1);
    expect(day1?.title).toBe('Engineering baseline and toolchain audit');
    expect(day1?.kind).toBe('topic');
    expect(day1?.subtopics?.length).toBeGreaterThan(0);
    expect(day1?.practice).toContain('diagnostic');
  });

  it('correctly maps Day 547 on 2028-05-15 to final showcase', () => {
    const { curriculumByDate } = loadCurriculumData();
    const day547 = curriculumByDate.get('2028-05-15');

    expect(day547).toBeDefined();
    expect(day547?.journeyDay).toBe(547);
    expect(day547?.title).toBe('18-month engineering showcase');
    expect(day547?.category).toBe('Portfolio / Review');
  });

  it('preserves Day 6 checkpoints and Day 7 weekly reviews across weeks', () => {
    const { curriculumByDate } = loadCurriculumData();

    // Week 1 Day 6 (2026-11-21)
    const day6 = curriculumByDate.get('2026-11-21');
    expect(day6).toBeDefined();
    expect(day6?.kind).toBe('checkpoint');
    expect(day6?.title).toContain('Checkpoint');

    // Week 1 Day 7 (2026-11-22)
    const day7 = curriculumByDate.get('2026-11-22');
    expect(day7).toBeDefined();
    expect(day7?.kind).toBe('review');
    expect(day7?.title).toContain('Weekly review');
    expect(day7?.subtopics?.length).toBeGreaterThanOrEqual(4);
  });

  it('validates 17 milestones metadata and acceptance criteria', () => {
    const { cachedMilestones } = loadCurriculumData();

    expect(cachedMilestones[0].milestoneId).toBe('M01');
    expect(cachedMilestones[0].status).toBe('current');
    expect(cachedMilestones[0].acceptanceCriteria?.length).toBeGreaterThan(0);

    const m17 = cachedMilestones[16];
    expect(m17.milestoneId).toBe('M17');
    expect(m17.journeyDay).toBe(547);
    expect(m17.targetDate).toBe('2028-05-15');

    // All milestones must have acceptance criteria
    for (const m of cachedMilestones) {
      expect(m.acceptanceCriteria).toBeDefined();
      expect(m.acceptanceCriteria?.length).toBeGreaterThan(0);
    }
  });
});
