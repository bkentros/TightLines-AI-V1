import type { WaterReaderSeason, WaterReaderSeasonGroup } from './contracts.ts';

const TRANSITION_WINDOW_DAYS = 14;

type SeasonBoundary = {
  season: WaterReaderSeason;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
};

const SEASON_BOUNDARIES: Record<WaterReaderSeasonGroup, SeasonBoundary[]> = {
  deep_south: [
    { season: 'spring', startMonth: 1, startDay: 15, endMonth: 3, endDay: 31 },
    { season: 'summer', startMonth: 4, startDay: 1, endMonth: 9, endDay: 30 },
    { season: 'fall', startMonth: 10, startDay: 1, endMonth: 11, endDay: 30 },
    { season: 'winter', startMonth: 12, startDay: 1, endMonth: 1, endDay: 14 },
  ],
  south: [
    { season: 'spring', startMonth: 2, startDay: 15, endMonth: 5, endDay: 14 },
    { season: 'summer', startMonth: 5, startDay: 15, endMonth: 9, endDay: 14 },
    { season: 'fall', startMonth: 9, startDay: 15, endMonth: 11, endDay: 30 },
    { season: 'winter', startMonth: 12, startDay: 1, endMonth: 2, endDay: 14 },
  ],
  baseline: [
    { season: 'spring', startMonth: 3, startDay: 1, endMonth: 5, endDay: 31 },
    { season: 'summer', startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
    { season: 'fall', startMonth: 9, startDay: 1, endMonth: 11, endDay: 30 },
    { season: 'winter', startMonth: 12, startDay: 1, endMonth: 2, endDay: 29 },
  ],
  north: [
    { season: 'spring', startMonth: 3, startDay: 21, endMonth: 6, endDay: 21 },
    { season: 'summer', startMonth: 6, startDay: 22, endMonth: 9, endDay: 21 },
    { season: 'fall', startMonth: 9, startDay: 22, endMonth: 12, endDay: 14 },
    { season: 'winter', startMonth: 12, startDay: 15, endMonth: 3, endDay: 20 },
  ],
  mild_coastal_desert: [
    { season: 'spring', startMonth: 2, startDay: 1, endMonth: 5, endDay: 31 },
    { season: 'summer', startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 },
    { season: 'fall', startMonth: 9, startDay: 1, endMonth: 12, endDay: 14 },
    { season: 'winter', startMonth: 12, startDay: 15, endMonth: 1, endDay: 31 },
  ],
};

export const WATER_READER_STATE_SEASON_GROUP: Record<string, WaterReaderSeasonGroup> = {
  FL: 'deep_south',
  LA: 'deep_south',
  TX: 'south',
  AL: 'south',
  GA: 'south',
  MS: 'south',
  SC: 'south',
  AR: 'south',
  OK: 'south',
  NM: 'south',
  NC: 'baseline',
  VA: 'baseline',
  TN: 'baseline',
  KY: 'baseline',
  MO: 'baseline',
  KS: 'baseline',
  WV: 'baseline',
  MD: 'baseline',
  DE: 'baseline',
  NJ: 'baseline',
  PA: 'baseline',
  CT: 'baseline',
  RI: 'baseline',
  MA: 'baseline',
  IN: 'baseline',
  IL: 'baseline',
  OH: 'baseline',
  NE: 'baseline',
  MN: 'north',
  WI: 'north',
  MI: 'north',
  IA: 'north',
  SD: 'north',
  ND: 'north',
  NY: 'north',
  VT: 'north',
  NH: 'north',
  ME: 'north',
  CO: 'north',
  WY: 'north',
  MT: 'north',
  ID: 'north',
  UT: 'north',
  CA: 'mild_coastal_desert',
  AZ: 'mild_coastal_desert',
  NV: 'mild_coastal_desert',
  OR: 'mild_coastal_desert',
  WA: 'mild_coastal_desert',
};

export interface WaterReaderSeasonLookup {
  seasonGroup: WaterReaderSeasonGroup;
  season: WaterReaderSeason;
  inTransitionWindow: boolean;
  transitionFrom?: WaterReaderSeason;
  transitionTo?: WaterReaderSeason;
  daysToBoundary?: number;
  daysFromBoundary?: number;
}

export function seasonGroupForState(state: string): WaterReaderSeasonGroup | null {
  return WATER_READER_STATE_SEASON_GROUP[state.trim().toUpperCase()] ?? null;
}

export function lookupWaterReaderSeason(state: string, date: Date): WaterReaderSeasonLookup | null {
  const seasonGroup = seasonGroupForState(state);
  if (!seasonGroup) return null;
  const year = date.getUTCFullYear();
  const day = dayOfYear(date);
  const ranges = seasonRangesForYear(seasonGroup, year);
  const current = ranges.find((range) => day >= range.startDayOfYear && day <= range.endDayOfYear);
  const season = current?.season ?? 'winter';
  const next = ranges.find((range) => range.startDayOfYear > day) ?? ranges[0]!;
  const previous = [...ranges].reverse().find((range) => range.startDayOfYear <= day) ?? ranges[ranges.length - 1]!;
  const daysToBoundary = next.startDayOfYear > day
    ? next.startDayOfYear - day
    : daysInYear(year) - day + next.startDayOfYear;
  const daysFromBoundary = previous.startDayOfYear <= day
    ? day - previous.startDayOfYear
    : day + daysInYear(year) - previous.startDayOfYear;

  if (daysToBoundary <= TRANSITION_WINDOW_DAYS) {
    return {
      seasonGroup,
      season,
      inTransitionWindow: true,
      transitionFrom: season,
      transitionTo: next.season,
      daysToBoundary,
    };
  }
  if (daysFromBoundary <= TRANSITION_WINDOW_DAYS && previous.season === season) {
    const beforePrevious = ranges[(ranges.indexOf(previous) - 1 + ranges.length) % ranges.length]!;
    if (beforePrevious.season === season) return { seasonGroup, season, inTransitionWindow: false };
    return {
      seasonGroup,
      season,
      inTransitionWindow: true,
      transitionFrom: beforePrevious.season,
      transitionTo: season,
      daysFromBoundary,
    };
  }
  return { seasonGroup, season, inTransitionWindow: false };
}

function seasonRangesForYear(group: WaterReaderSeasonGroup, year: number) {
  const daysThisYear = daysInYear(year);
  const ranges = SEASON_BOUNDARIES[group].flatMap((boundary) => {
    const start = monthDayToDayOfYear(year, boundary.startMonth, boundary.startDay);
    const end = monthDayToDayOfYear(year, boundary.endMonth, boundary.endDay);
    if (start <= end) return [{ season: boundary.season, startDayOfYear: start, endDayOfYear: end }];
    return [
      { season: boundary.season, startDayOfYear: 1, endDayOfYear: end },
      { season: boundary.season, startDayOfYear: start, endDayOfYear: daysThisYear },
    ];
  });
  return ranges.sort((a, b) => a.startDayOfYear - b.startDayOfYear);
}

function dayOfYear(date: Date): number {
  return monthDayToDayOfYear(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function monthDayToDayOfYear(year: number, month: number, day: number): number {
  const maxDay = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
  const start = Date.UTC(year, 0, 1);
  const target = Date.UTC(year, month - 1, maxDay);
  return Math.floor((target - start) / 86400000) + 1;
}

function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
