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

  it('verifies exact counts of kinds: 390 topics, 79 checkpoints, 78 reviews', () => {
    const { curriculumByItemId } = loadCurriculumData();
    const items = Array.from(curriculumByItemId.values());
    expect(items.length).toBe(547);

    const counts: Record<string, number> = { topic: 0, checkpoint: 0, review: 0 };
    for (const item of items) {
      counts[item.kind] = (counts[item.kind] || 0) + 1;
    }

    expect(counts.topic).toBe(390);
    expect(counts.checkpoint).toBe(79); // 78 weekly + 1 Day 547 final
    expect(counts.review).toBe(78);
  });

  it('ensures all 547 items have unique itemIds and valid subtopic IDs', () => {
    const { curriculumByItemId } = loadCurriculumData();
    const items = Array.from(curriculumByItemId.values());
    const itemIds = new Set<string>();
    const subtopicIds = new Set<string>();

    for (const item of items) {
      expect(item.itemId).toBeDefined();
      expect(itemIds.has(item.itemId)).toBe(false);
      itemIds.add(item.itemId);

      if (item.subtopicItems) {
        for (const sub of item.subtopicItems) {
          expect(sub.id).toBeDefined();
          expect(subtopicIds.has(sub.id)).toBe(false);
          subtopicIds.add(sub.id);
        }
      }
    }

    expect(itemIds.size).toBe(547);
    expect(subtopicIds.size).toBeGreaterThan(1500);
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

  it('validates 17 milestones partition all 547 requiredItemIds without overlaps or gaps', () => {
    const { cachedMilestones } = loadCurriculumData();
    expect(cachedMilestones.length).toBe(17);

    const coveredItemIds = new Set<string>();

    for (const m of cachedMilestones) {
      expect(m.requiredItemIds).toBeDefined();
      expect(m.requiredItemIds?.length).toBeGreaterThan(0);

      for (const id of m.requiredItemIds!) {
        expect(coveredItemIds.has(id)).toBe(false); // No overlap
        coveredItemIds.add(id);
      }
    }

    // Exactly all 547 items must be covered
    expect(coveredItemIds.size).toBe(547);
  });

  it('validates milestone acceptance criteria and boundaries', () => {
    const { cachedMilestones } = loadCurriculumData();

    expect(cachedMilestones[0].milestoneId).toBe('M01');
    expect(cachedMilestones[0].acceptanceCriteria?.length).toBeGreaterThan(0);

    const m17 = cachedMilestones[16];
    expect(m17.milestoneId).toBe('M17');
    expect(m17.journeyDay).toBe(547);
    expect(m17.targetDate).toBe('2028-05-15');

    for (const m of cachedMilestones) {
      expect(m.acceptanceCriteria).toBeDefined();
      expect(m.acceptanceCriteria?.length).toBeGreaterThan(0);
      expect(m.startJourneyDay).toBeDefined();
      expect(m.endJourneyDay).toBeDefined();
      expect(m.startJourneyDay).toBeLessThanOrEqual(m.endJourneyDay!);
    }
  });
});
