import { toZonedTime, format } from 'date-fns-tz';
import { addDays, differenceInCalendarDays, parseISO } from 'date-fns';

export const TIMEZONE_IST = 'Asia/Kolkata';

// 18-Month Program Constants:
// Start Date: 16 November 2026
// End Date: 15 May 2028 (6 Phases x 13 Weeks = 78 Weeks)
export const ROADMAP_START_DATE_STR = '2026-11-16';
export const ROADMAP_END_DATE_STR = '2028-05-15';
export const TOTAL_PROGRAM_WEEKS = 78;
export const TOTAL_PROGRAM_PHASES = 6;
export const WEEKS_PER_PHASE = 13;

/**
 * Returns current Date in Asia/Kolkata timezone
 */
export function getNowInIST(): Date {
  return toZonedTime(new Date(), TIMEZONE_IST);
}

/**
 * Formats a Date into YYYY-MM-DD in Asia/Kolkata
 */
export function formatISTDate(date: Date = new Date()): string {
  const zoned = toZonedTime(date, TIMEZONE_IST);
  return format(zoned, 'yyyy-MM-dd', { timeZone: TIMEZONE_IST });
}

/**
 * Parses YYYY-MM-DD into a localized Date representing that day in IST
 */
export function parseISTDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Human-readable IST date (e.g. "Monday, 16 November 2026")
 */
export function formatHumanISTDate(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const zoned = toZonedTime(d, TIMEZONE_IST);
  return format(zoned, 'EEEE, d MMMM yyyy', { timeZone: TIMEZONE_IST });
}

/**
 * Human-readable short format (e.g. "16 Nov 2026")
 */
export function formatShortISTDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const zoned = toZonedTime(d, TIMEZONE_IST);
  return format(zoned, 'dd MMM yyyy', { timeZone: TIMEZONE_IST });
}

/**
 * Current live time format in IST (e.g. "19:45:12 IST")
 */
export function formatISTTime(date: Date = new Date()): string {
  const zoned = toZonedTime(date, TIMEZONE_IST);
  return `${format(zoned, 'HH:mm:ss', { timeZone: TIMEZONE_IST })} IST`;
}

/**
 * Checks if two dates represent the exact same calendar day in IST
 */
export function isSameISTCalendarDay(d1: Date | string, d2: Date | string): boolean {
  const s1 = typeof d1 === 'string' ? d1 : formatISTDate(d1);
  const s2 = typeof d2 === 'string' ? d2 : formatISTDate(d2);
  return s1 === s2;
}

/**
 * Calculates days between roadmap start and target date
 */
export function getDayNumberInRoadmap(targetDateStr: string, startDateStr: string = ROADMAP_START_DATE_STR): number {
  const start = parseISO(startDateStr);
  const target = parseISO(targetDateStr);
  const diff = differenceInCalendarDays(target, start);
  return diff + 1; // Day 1 = start date
}

/**
 * Calculates current phase (1 to 6) based on target date
 */
export function getPhaseNumberForDate(targetDateStr: string, startDateStr: string = ROADMAP_START_DATE_STR): number {
  const dayNumber = getDayNumberInRoadmap(targetDateStr, startDateStr);
  if (dayNumber < 1) return 1;
  const daysPerPhase = 13 * 7; // 91 days
  const phase = Math.ceil(dayNumber / daysPerPhase);
  return Math.min(Math.max(phase, 1), 6);
}

/**
 * Calculates week number (1 to 78)
 */
export function getWeekNumberForDate(targetDateStr: string, startDateStr: string = ROADMAP_START_DATE_STR): number {
  const dayNumber = getDayNumberInRoadmap(targetDateStr, startDateStr);
  if (dayNumber < 1) return 1;
  const week = Math.ceil(dayNumber / 7);
  return Math.min(Math.max(week, 1), TOTAL_PROGRAM_WEEKS);
}

/**
 * Adds N days to YYYY-MM-DD string and returns formatted string
 */
export function addDaysToDateStr(dateStr: string, days: number): string {
  const d = parseISO(dateStr);
  const next = addDays(d, days);
  return format(next, 'yyyy-MM-dd');
}
