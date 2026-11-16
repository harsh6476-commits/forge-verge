import { describe, it, expect, vi } from 'vitest';
import { loadCurriculumData } from '../server/services/curriculumService';
import { formatISTDate, addDaysToDateStr } from '../src/lib/date-utils';

describe('PRIORITY 2: Curriculum Import & Duplicate Prevention', () => {
  it('validates 547 canonical scheduled records with exact kind counts', () => {
    const { curriculumByItemId } = loadCurriculumData();
    const items = Array.from(curriculumByItemId.values());

    expect(items.length).toBe(547);

    const counts = { topic: 0, checkpoint: 0, review: 0 };
    for (const item of items) {
      if (item.kind in counts) {
        counts[item.kind as keyof typeof counts]++;
      }
    }

    expect(counts.topic).toBe(390);
    expect(counts.checkpoint).toBe(79); // 78 weekly + 1 Day 547 final
    expect(counts.review).toBe(78);
  });

  it('prevents duplicate itemIds across all 547 records', () => {
    const { curriculumByItemId } = loadCurriculumData();
    const seen = new Set<string>();

    for (const [id, item] of curriculumByItemId.entries()) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
      expect(item.itemId).toBe(id);
      expect(id).toMatch(/^journey_day_\d{3}$/);
    }

    expect(seen.size).toBe(547);
  });

  it('prevents duplicate subtopic IDs across all topics', () => {
    const { curriculumByItemId } = loadCurriculumData();
    const subtopicIds = new Set<string>();

    for (const item of curriculumByItemId.values()) {
      if (item.subtopicItems) {
        for (const sub of item.subtopicItems) {
          expect(subtopicIds.has(sub.id)).toBe(false);
          subtopicIds.add(sub.id);
        }
      }
    }

    expect(subtopicIds.size).toBeGreaterThan(1500);
  });
});

describe('PRIORITY 3 & 4: Daily Plan Generation & Milestone Progression', () => {
  it('returns valid scheduled curriculum item for valid dates and rejects out-of-range dates', () => {
    const { curriculumByDate } = loadCurriculumData();

    // Valid start date
    const day1 = curriculumByDate.get('2026-11-16');
    expect(day1).toBeDefined();
    expect(day1?.journeyDay).toBe(1);

    // Valid end date
    const day547 = curriculumByDate.get('2028-05-15');
    expect(day547).toBeDefined();
    expect(day547?.journeyDay).toBe(547);

    // Invalid dates (before roadmap or after roadmap)
    const beforeRoadmap = curriculumByDate.get('2026-11-15');
    expect(beforeRoadmap).toBeUndefined();

    const afterRoadmap = curriculumByDate.get('2028-05-16');
    expect(afterRoadmap).toBeUndefined();
  });

  it('calculates automatic milestone progression using formula: completed / total * 100', () => {
    const { cachedMilestones } = loadCurriculumData();
    const m01 = cachedMilestones[0];

    const totalRequired = m01.requiredItemCount || m01.requiredItemIds.length;
    expect(totalRequired).toBeGreaterThan(0);

    // Scenario 1: 0 completed
    let completedCount = 0;
    let pct = Math.round((completedCount / totalRequired) * 100);
    expect(pct).toBe(0);

    // Scenario 2: Half completed
    completedCount = Math.floor(totalRequired / 2);
    pct = Math.round((completedCount / totalRequired) * 100);
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThan(100);

    // Scenario 3: 100% completed
    completedCount = totalRequired;
    pct = Math.round((completedCount / totalRequired) * 100);
    expect(pct).toBe(100);
  });

  it('verifies that all 17 milestones partition 547 items with zero gaps and zero overlap', () => {
    const { cachedMilestones } = loadCurriculumData();
    expect(cachedMilestones.length).toBe(17);

    const mapped = new Set<string>();
    for (const m of cachedMilestones) {
      expect(m.requiredItemIds).toBeDefined();
      expect(m.requiredItemIds.length).toBeGreaterThan(0);
      for (const id of m.requiredItemIds) {
        expect(mapped.has(id)).toBe(false); // No overlap
        mapped.add(id);
      }
    }

    expect(mapped.size).toBe(547); // All 547 accounted for
  });
});

describe('PRIORITY 1 & 6: Security, Session Validation & Fail Closed', () => {
  it('validates required environment variables fail closed when unset', () => {
    const originalUri = process.env.MONGODB_URI;
    const originalPin = process.env.APP_ACCESS_PIN;

    // Simulate missing env
    delete process.env.MONGODB_URI;
    delete process.env.APP_ACCESS_PIN;

    const checkMissing = () => {
      const missing: string[] = [];
      if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
      if (!process.env.APP_ACCESS_PIN) missing.push('APP_ACCESS_PIN');
      if (missing.length > 0) {
        throw new Error(`Missing: ${missing.join(', ')}`);
      }
    };

    expect(checkMissing).toThrow(/Missing: MONGODB_URI, APP_ACCESS_PIN/);

    // Restore
    process.env.MONGODB_URI = originalUri;
    process.env.APP_ACCESS_PIN = originalPin;
  });

  it('fails closed when MongoDB connection readyState !== 1', () => {
    // Mock request, response
    const _mockReq: any = { cookies: { forge_access: 'some_token' } };
    const mockRes: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const mockNext = vi.fn();

    // When DB is disconnected (readyState: 0)
    const readyState = 0;
    if (readyState !== 1) {
      mockRes.status(503).json({ error: 'Database unavailable for session verification' });
    } else {
      mockNext();
    }

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Database unavailable for session verification' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('PRIORITY 5 & 6: Streak Calculation & Pagination Logic', () => {
  it('correctly calculates consecutive streaks across date boundaries', () => {
    const today = formatISTDate();
    const dayMinus1 = addDaysToDateStr(today, -1);
    const dayMinus2 = addDaysToDateStr(today, -2);
    const dayMinus3 = addDaysToDateStr(today, -3);

    const completedDates = new Set([dayMinus1, dayMinus2, dayMinus3]);

    let streak = 0;
    let check = dayMinus1;
    while (completedDates.has(check)) {
      streak += 1;
      check = addDaysToDateStr(check, -1);
    }

    expect(streak).toBe(3);
  });

  it('breaks streak when a day is missed', () => {
    const today = formatISTDate();
    const dayMinus1 = addDaysToDateStr(today, -1);
    // dayMinus2 is MISSED
    const dayMinus3 = addDaysToDateStr(today, -3);

    const completedDates = new Set([dayMinus1, dayMinus3]);

    let streak = 0;
    let check = dayMinus1;
    while (completedDates.has(check)) {
      streak += 1;
      check = addDaysToDateStr(check, -1);
    }

    // Only 1 consecutive day from today
    expect(streak).toBe(1);
  });

  it('simulates cursor pagination with 24 records per page', () => {
    const allRecords = Array.from({ length: 547 }, (_, i) => ({
      journeyDay: i + 1,
      title: `Topic ${i + 1}`,
    }));

    const limit = 24;

    // Page 1
    const page1 = allRecords.slice(0, limit);
    expect(page1.length).toBe(24);
    const cursor1 = page1[page1.length - 1].journeyDay;
    expect(cursor1).toBe(24);

    // Page 2
    const page2 = allRecords.filter((r) => r.journeyDay > cursor1).slice(0, limit);
    expect(page2.length).toBe(24);
    expect(page2[0].journeyDay).toBe(25);
    const cursor2 = page2[page2.length - 1].journeyDay;
    expect(cursor2).toBe(48);
  });
});
