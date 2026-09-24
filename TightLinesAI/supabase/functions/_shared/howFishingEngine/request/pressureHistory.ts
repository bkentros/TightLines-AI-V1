import { utcIsoToLocalDateHour } from "./hourlyLocalDay.ts";

const HOUR = 3_600_000;

/** Local noon is unambiguous across US DST transitions. */
function localNoonUtc(localDate: string, timezone: string): number {
  const wallNoon = Date.parse(`${localDate}T12:00:00Z`);
  let utc = wallNoon;
  for (let i = 0; i < 3; i++) {
    const local = utcIsoToLocalDateHour(new Date(utc).toISOString(), timezone)!;
    const rendered = Date.parse(
      `${local.ymd}T${String(local.hour).padStart(2, "0")}:00:00Z`,
    );
    const correction = wallNoon - rendered;
    utc += correction;
    if (correction === 0) break;
  }
  return utc;
}

/**
 * Preserve elapsed hourly slots, including missing readings. Return undefined
 * only for legacy arrays without usable timestamps (their positional adapter remains).
 * Forecast/calendar-day requests end at local noon; live fallback ends at fetched_at.
 */
export function timestampedPressureHistory(
  points: unknown[],
  localDate: string,
  timezone: string,
  calendarDay: boolean,
  fetchedAt: unknown,
): (number | null)[] | undefined {
  const readings = new Map<number, number | null>();
  for (const point of points) {
    if (!point || typeof point !== "object") continue;
    const p = point as { time_utc?: unknown; value?: unknown };
    if (typeof p.time_utc !== "string") continue;
    const timestamp = Date.parse(p.time_utc);
    if (!Number.isFinite(timestamp)) continue;
    const value = p.value == null ? NaN : Number(p.value);
    readings.set(timestamp, Number.isFinite(value) && value > 0 ? value : null);
  }
  if (readings.size === 0) return undefined;
  const fetched = typeof fetchedAt === "string" ? Date.parse(fetchedAt) : NaN;
  // Never use the last forecast timestamp as a live observation. In legacy
  // payloads lacking fetched_at, use the requested day's noon deterministically.
  const end = !calendarDay && Number.isFinite(fetched)
    ? Math.floor(fetched / HOUR) * HOUR
    : localNoonUtc(localDate, timezone);
  return Array.from(
    { length: 48 },
    (_, i) => readings.get(end - (47 - i) * HOUR) ?? null,
  );
}
