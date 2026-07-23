import { addDays } from "../metrics/dateWindow.ts";

const LOCAL_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function canonicalBaselineDay(localDate: string): number {
  const { month, day } = parseLocalDateParts(localDate);
  if (month === 2 && day === 29) return 60;
  const date = parseLocalDate(localDate);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const actualDay = Math.floor(
    (date.getTime() - yearStart.getTime()) / 86_400_000,
  ) + 1;
  return isLeapYear(date.getUTCFullYear()) && actualDay > 60
    ? actualDay - 1
    : actualDay;
}

export function canonicalBaselineDayCandidates(localDate: string): number[] {
  const { month, day } = parseLocalDateParts(localDate);
  return month === 2 && day === 29
    ? [59, 60]
    : [canonicalBaselineDay(localDate)];
}

export function canonicalMonthDayFromBaselineDay(dayOfYear: number): string {
  if (!Number.isInteger(dayOfYear) || dayOfYear < 1 || dayOfYear > 365) {
    throw new Error(`Invalid canonical baseline day: ${dayOfYear}`);
  }
  const date = new Date(Date.UTC(2025, 0, dayOfYear));
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${
    String(date.getUTCDate()).padStart(2, "0")
  }`;
}

export function canonicalBaselineDaysBetween(
  startLocalDate: string,
  endLocalDate: string,
): number[] {
  const days: number[] = [];
  for (
    let current = startLocalDate;
    current <= endLocalDate;
    current = addDays(current, 1)
  ) {
    for (const candidate of canonicalBaselineDayCandidates(current)) {
      if (!days.includes(candidate)) days.push(candidate);
    }
  }
  return days;
}

function parseLocalDate(value: string): Date {
  const { year, month, day } = parseLocalDateParts(value);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid local date: ${value}`);
  }
  return date;
}

function parseLocalDateParts(value: string): {
  year: number;
  month: number;
  day: number;
} {
  const match = LOCAL_DATE_RE.exec(value);
  if (!match) throw new Error(`Invalid local date: ${value}`);
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
