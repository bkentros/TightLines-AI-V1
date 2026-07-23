import type { RiverRunProfile } from "../types.ts";

export type DateWindow = {
  snapshotDate: string;
  startDate: string;
  peakDate: string;
  endDate: string;
  earlyStartDate: string;
  lateEndDate: string;
  beginningEndDate: string;
  peakStartDate: string;
  peakEndDate: string;
  taperingEndDate: string;
  earlyWindowDays: number;
  lateWindowDays: number;
  peakWindowDays: number;
  startToPeakDays: number;
  peakToEndDays: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MONTH_DAY_RE = /^(\d{2})-(\d{2})$/;

export function resolveActiveRunWindow(
  run: Pick<RiverRunProfile, "runWindow">,
  localDate: string,
): DateWindow {
  const snapshot = parseLocalDate(localDate);
  const snapshotYear = snapshot.getUTCFullYear();
  const candidates = [snapshotYear - 1, snapshotYear, snapshotYear + 1].map((
    year,
  ) => buildWindowCandidate(run, localDate, year));

  return candidates.toSorted((a, b) =>
    windowDistance(a, snapshot) - windowDistance(b, snapshot)
  )[0];
}

export function daysBetween(startDate: string, endDate: string): number {
  return Math.round(
    (parseLocalDate(endDate).getTime() - parseLocalDate(startDate).getTime()) /
      MS_PER_DAY,
  );
}

export function addDays(localDate: string, days: number): string {
  const date = parseLocalDate(localDate);
  date.setUTCDate(date.getUTCDate() + days);
  return toLocalDateString(date);
}

export function compareLocalDates(a: string, b: string): number {
  return Math.sign(parseLocalDate(a).getTime() - parseLocalDate(b).getTime());
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function interpolate(
  value: number,
  fromValue: number,
  toValue: number,
  fromScore: number,
  toScore: number,
): number {
  if (toValue === fromValue) return toScore;
  const ratio = clamp((value - fromValue) / (toValue - fromValue), 0, 1);
  return fromScore + (toScore - fromScore) * ratio;
}

function buildWindowCandidate(
  run: Pick<RiverRunProfile, "runWindow">,
  snapshotDate: string,
  startYear: number,
): DateWindow {
  const earlyWindowDays = run.runWindow.earlyWindowDays ?? 14;
  const lateWindowDays = run.runWindow.lateWindowDays ?? 14;
  const peakWindowDays = run.runWindow.peakWindowDays ?? 5;

  const start = dateFromMonthDay(startYear, run.runWindow.start);
  const startOrdinal = monthDayOrdinal(run.runWindow.start);
  const peakYear = startYear +
    (monthDayOrdinal(run.runWindow.peak) < startOrdinal ? 1 : 0);
  const endYear = startYear +
    (monthDayOrdinal(run.runWindow.end) < startOrdinal ? 1 : 0);
  const peak = dateFromMonthDay(peakYear, run.runWindow.peak);
  const end = dateFromMonthDay(endYear, run.runWindow.end);

  const startDate = toLocalDateString(start);
  const peakDate = toLocalDateString(peak);
  const endDate = toLocalDateString(end);
  const startToPeakDays = Math.max(1, daysBetween(startDate, peakDate));
  const peakToEndDays = Math.max(1, daysBetween(peakDate, endDate));
  const beginningEndDate = addDays(
    startDate,
    Math.ceil(startToPeakDays * 0.2),
  );
  const peakStartDate = addDays(peakDate, -peakWindowDays);
  const peakEndDate = addDays(peakDate, peakWindowDays);
  const taperingEndDate = addDays(
    peakDate,
    Math.ceil(peakToEndDays * 0.75),
  );

  return {
    snapshotDate,
    startDate,
    peakDate,
    endDate,
    earlyStartDate: addDays(startDate, -earlyWindowDays),
    lateEndDate: addDays(endDate, lateWindowDays),
    beginningEndDate,
    peakStartDate,
    peakEndDate,
    taperingEndDate,
    earlyWindowDays,
    lateWindowDays,
    peakWindowDays,
    startToPeakDays,
    peakToEndDays,
  };
}

function windowDistance(window: DateWindow, snapshot: Date): number {
  const start = parseLocalDate(window.startDate).getTime();
  const end = parseLocalDate(window.endDate).getTime();
  const time = snapshot.getTime();
  if (time >= start && time <= end) return 0;
  return Math.min(Math.abs(time - start), Math.abs(time - end));
}

function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`Invalid local date: ${value}`);
  }
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
}

function dateFromMonthDay(year: number, monthDay: string): Date {
  const match = MONTH_DAY_RE.exec(monthDay);
  if (!match) {
    throw new Error(`Invalid MM-DD date: ${monthDay}`);
  }
  return new Date(Date.UTC(year, Number(match[1]) - 1, Number(match[2])));
}

function monthDayOrdinal(monthDay: string): number {
  const date = dateFromMonthDay(2024, monthDay);
  const yearStart = new Date(Date.UTC(2024, 0, 1));
  return Math.round((date.getTime() - yearStart.getTime()) / MS_PER_DAY) + 1;
}

function toLocalDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
