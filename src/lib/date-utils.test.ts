import { describe, it, expect } from 'vitest';
import {
  getDayNumberInRoadmap,
  getPhaseNumberForDate,
  getWeekNumberForDate,
  isSameISTCalendarDay,
  addDaysToDateStr,
  formatISTTime,
} from './date-utils';

describe('Asia/Kolkata Timezone & Roadmap Date Utilities', () => {
  it('correctly calculates start day as Day 1', () => {
    expect(getDayNumberInRoadmap('2026-11-16')).toBe(1);
    expect(getPhaseNumberForDate('2026-11-16')).toBe(1);
    expect(getWeekNumberForDate('2026-11-16')).toBe(1);
  });

  it('correctly calculates Phase 1 ending and Phase 2 transition', () => {
    // Phase 1 has 13 weeks = 91 days
    // Day 91: 2026-11-16 + 90 days = 2027-02-14
    expect(getDayNumberInRoadmap('2027-02-14')).toBe(91);
    expect(getPhaseNumberForDate('2027-02-14')).toBe(1);
    expect(getWeekNumberForDate('2027-02-14')).toBe(13);

    // Day 92 (Phase 2, Week 14): 2027-02-15
    expect(getDayNumberInRoadmap('2027-02-15')).toBe(92);
    expect(getPhaseNumberForDate('2027-02-15')).toBe(2);
    expect(getWeekNumberForDate('2027-02-15')).toBe(14);
  });

  it('handles same IST calendar day comparison', () => {
    expect(isSameISTCalendarDay('2026-11-16', '2026-11-16')).toBe(true);
    expect(isSameISTCalendarDay('2026-11-16', '2026-11-17')).toBe(false);
  });

  it('correctly adds days to YYYY-MM-DD date string', () => {
    expect(addDaysToDateStr('2026-11-16', 1)).toBe('2026-11-17');
    expect(addDaysToDateStr('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDaysToDateStr('2026-11-16', 7)).toBe('2026-11-23');
  });

  it('formats time with IST indicator', () => {
    const formatted = formatISTTime(new Date());
    expect(formatted).toContain('IST');
  });
});
