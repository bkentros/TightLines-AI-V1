export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function toYYYYMMDD(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

export function localDateFromUnix(unixSec: number, ianaTimezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(unixSec * 1000)).replace(/\//g, "-");
}

export function localHourFromUnix(unixSec: number, ianaTimezone: string): number {
  return Number.parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      hour: "numeric",
      hour12: false,
    }).format(new Date(unixSec * 1000)),
    10,
  );
}

export function findNoonHourIndex(
  hourlyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let index = 0; index < hourlyUnixSec.length; index++) {
    const unixSec = hourlyUnixSec[index]!;
    if (
      localDateFromUnix(unixSec, ianaTimezone) === targetDate &&
      localHourFromUnix(unixSec, ianaTimezone) === 12
    ) {
      return index;
    }
  }
  return -1;
}

export function findMidnightHourIndex(
  hourlyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let index = 0; index < hourlyUnixSec.length; index++) {
    const unixSec = hourlyUnixSec[index]!;
    if (
      localDateFromUnix(unixSec, ianaTimezone) === targetDate &&
      localHourFromUnix(unixSec, ianaTimezone) === 0
    ) {
      return index;
    }
  }
  return -1;
}

export function findDailyIndex(
  dailyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let index = 0; index < dailyUnixSec.length; index++) {
    if (localDateFromUnix(dailyUnixSec[index]!, ianaTimezone) === targetDate) {
      return index;
    }
  }
  return -1;
}

export function parseUnixSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}
