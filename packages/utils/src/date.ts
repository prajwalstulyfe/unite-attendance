// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Date Utilities
// ═══════════════════════════════════════════════════════════════

import {
  format,
  formatDistanceToNow,
  parseISO,
  isToday,
  isYesterday,
  isSameDay,
  differenceInMinutes,
  differenceInHours,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  getDay,
} from 'date-fns';
import { DayOfWeek } from '@repo/types';

/**
 * Format a date string or Date to a human-readable date
 * @example formatDate('2026-07-29T09:00:00Z') → "29 Jul 2026"
 */
export function formatDate(date: string | Date, pattern = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

/**
 * Format a date to time only
 * @example formatTime('2026-07-29T09:00:00Z') → "9:00 AM"
 */
export function formatTime(date: string | Date, is24h = false): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, is24h ? 'HH:mm' : 'h:mm a');
}

/**
 * Format a date to a relative time string
 * @example getRelativeTime('2026-07-29T09:00:00Z') → "2 hours ago"
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format date for display: "Today", "Yesterday", or "29 Jul 2026"
 */
export function formatDateSmart(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'dd MMM yyyy');
}

/**
 * Get the difference in minutes between two dates
 */
export function diffMinutes(dateA: string | Date, dateB: string | Date): number {
  const a = typeof dateA === 'string' ? parseISO(dateA) : dateA;
  const b = typeof dateB === 'string' ? parseISO(dateB) : dateB;
  return Math.abs(differenceInMinutes(a, b));
}

/**
 * Format working hours from minutes
 * @example formatWorkingHours(490) → "8h 10m"
 */
export function formatWorkingHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Parse a time string "HH:mm" into a Date object for today
 */
export function parseTimeToday(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const today = startOfDay(new Date());
  today.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return today;
}

/**
 * Get the DayOfWeek enum value for a given date
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  const dayMap: Record<number, DayOfWeek> = {
    0: DayOfWeek.SUN,
    1: DayOfWeek.MON,
    2: DayOfWeek.TUE,
    3: DayOfWeek.WED,
    4: DayOfWeek.THU,
    5: DayOfWeek.FRI,
    6: DayOfWeek.SAT,
  };
  return dayMap[getDay(date)] ?? DayOfWeek.MON;
}

/**
 * Get all dates in a range
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let current = startOfDay(start);
  const endDate = startOfDay(end);
  while (current <= endDate) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

export {
  parseISO,
  isToday,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  format,
};
