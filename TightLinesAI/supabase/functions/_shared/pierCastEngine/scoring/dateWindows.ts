import type { PierCastDailyAssessmentWindow } from "../types.ts";

type DateParts = { year: number; month: number; day: number };

function localParts(instant: Date, timezone: string): DateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function addLocalDays(date: DateParts, days: number): DateParts {
  const instant = new Date(
    Date.UTC(date.year, date.month - 1, date.day + days),
  );
  return {
    year: instant.getUTCFullYear(),
    month: instant.getUTCMonth() + 1,
    day: instant.getUTCDate(),
  };
}

function localDateString(date: DateParts): string {
  return [
    String(date.year).padStart(4, "0"),
    String(date.month).padStart(2, "0"),
    String(date.day).padStart(2, "0"),
  ].join("-");
}

function parseLocalDate(value: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid local date: ${value}`);
  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  if (localDateString(date) !== value) {
    throw new Error(`Invalid local date: ${value}`);
  }
  const roundTrip = new Date(Date.UTC(date.year, date.month - 1, date.day));
  if (
    roundTrip.getUTCFullYear() !== date.year ||
    roundTrip.getUTCMonth() + 1 !== date.month ||
    roundTrip.getUTCDate() !== date.day
  ) {
    throw new Error(`Invalid local date: ${value}`);
  }
  return date;
}

function zonedMidnightUtc(date: DateParts, timezone: string): Date {
  const desiredLocalAsUtc = Date.UTC(date.year, date.month - 1, date.day);
  let candidate = desiredLocalAsUtc;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(candidate)).map((part) => [
        part.type,
        part.value,
      ]),
    );
    const representedLocalAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    const correction = desiredLocalAsUtc - representedLocalAsUtc;
    candidate += correction;
    if (correction === 0) return new Date(candidate);
  }
  throw new Error(
    `Could not resolve local midnight for ${
      localDateString(date)
    } ${timezone}.`,
  );
}

export function buildPierCastFiveDateWindows(input: {
  evaluationTime: string;
  timezone: string;
}): PierCastDailyAssessmentWindow[] {
  const evaluatedAt = new Date(input.evaluationTime);
  if (!Number.isFinite(evaluatedAt.getTime())) {
    throw new Error(`Invalid evaluation time: ${input.evaluationTime}`);
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: input.timezone }).format(
      evaluatedAt,
    );
  } catch {
    throw new Error(`Invalid timezone: ${input.timezone}`);
  }

  const today = localParts(evaluatedAt, input.timezone);
  return Array.from({ length: 5 }, (_, index) => {
    const date = addLocalDays(today, index);
    const nextDate = addLocalDays(date, 1);
    const start = index === 0
      ? evaluatedAt
      : zonedMidnightUtc(date, input.timezone);
    const end = zonedMidnightUtc(nextDate, input.timezone);
    return {
      localDate: localDateString(date),
      timezone: input.timezone,
      scope: index === 0 ? "remaining_day" : "full_day",
      requestedInterval: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };
  });
}

export function buildPierCastFullDayWindow(input: {
  localDate: string;
  timezone: string;
}): PierCastDailyAssessmentWindow {
  const date = parseLocalDate(input.localDate);
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: input.timezone }).format(
      new Date(),
    );
  } catch {
    throw new Error(`Invalid timezone: ${input.timezone}`);
  }
  return {
    localDate: input.localDate,
    timezone: input.timezone,
    scope: "full_day",
    requestedInterval: {
      start: zonedMidnightUtc(date, input.timezone).toISOString(),
      end: zonedMidnightUtc(addLocalDays(date, 1), input.timezone)
        .toISOString(),
    },
  };
}
