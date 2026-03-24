/**
 * Date arithmetic and unix-to-local conversion helpers for the live audit runner.
 */

/** Add n days (positive or negative) to a YYYY-MM-DD string. */
export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00Z"); // noon UTC to avoid DST edge cases
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Strip dashes from YYYY-MM-DD for NOAA API format → YYYYMMDD. */
export function toYYYYMMDD(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/** Convert a Unix timestamp (seconds) to local YYYY-MM-DD using IANA timezone. */
export function localDateFromUnix(unixSec: number, ianaTimezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(unixSec * 1000))
    .replace(/\//g, "-"); // en-CA returns YYYY-MM-DD already
}

/** Convert a Unix timestamp (seconds) to local hour (0–23) using IANA timezone. */
export function localHourFromUnix(unixSec: number, ianaTimezone: string): number {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      hour: "numeric",
      hour12: false,
    }).format(new Date(unixSec * 1000)),
    10,
  );
}

/**
 * Find the index in an hourly Unix-seconds array where local date === targetDate
 * and local hour === 12 (noon). Returns -1 if not found.
 */
export function findNoonHourIndex(
  hourlyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let i = 0; i < hourlyUnixSec.length; i++) {
    const sec = hourlyUnixSec[i]!;
    if (
      localDateFromUnix(sec, ianaTimezone) === targetDate &&
      localHourFromUnix(sec, ianaTimezone) === 12
    ) {
      return i;
    }
  }
  return -1;
}

/**
 * Find the index where local date === targetDate and local hour === 0 (midnight).
 * Returns -1 if not found.
 */
export function findMidnightHourIndex(
  hourlyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let i = 0; i < hourlyUnixSec.length; i++) {
    const sec = hourlyUnixSec[i]!;
    if (
      localDateFromUnix(sec, ianaTimezone) === targetDate &&
      localHourFromUnix(sec, ianaTimezone) === 0
    ) {
      return i;
    }
  }
  return -1;
}

/**
 * Find the index in a daily Unix-seconds array where local date === targetDate.
 * Returns -1 if not found.
 */
export function findDailyIndex(
  dailyUnixSec: number[],
  targetDate: string,
  ianaTimezone: string,
): number {
  for (let i = 0; i < dailyUnixSec.length; i++) {
    if (localDateFromUnix(dailyUnixSec[i]!, ianaTimezone) === targetDate) {
      return i;
    }
  }
  return -1;
}

/** Parse Open-Meteo unix timestamp (number or numeric string). */
export function parseUnixSeconds(t: unknown): number | null {
  if (typeof t === "number" && Number.isFinite(t)) return t;
  if (typeof t === "string" && t.length > 0) {
    const n = Number(t);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
