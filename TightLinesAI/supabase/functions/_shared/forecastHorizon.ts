export interface ForecastHorizonRow {
  date?: unknown;
  day_offset?: unknown;
}

function parseCalendarDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return null;
  return parsed;
}

function expectedDate(start: Date, offset: number): string {
  const date = new Date(start.getTime());
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

/**
 * Enforces the API contract: offset 0 through maxDayOffset must all be present,
 * unique, valid calendar dates, and consecutive. Partial horizons must never be
 * cached or presented as a successful six-day forecast.
 */
export function hasCompleteForecastHorizon(
  rows: unknown,
  maxDayOffset: number,
): rows is ForecastHorizonRow[] {
  if (!Array.isArray(rows)) return false;
  const byOffset = new Map<number, ForecastHorizonRow>();
  for (const candidate of rows) {
    if (!candidate || typeof candidate !== "object") continue;
    const row = candidate as ForecastHorizonRow;
    const offset = Number(row.day_offset);
    if (!Number.isInteger(offset) || offset < 0 || offset > maxDayOffset) {
      continue;
    }
    if (byOffset.has(offset)) return false;
    byOffset.set(offset, row);
  }
  const first = byOffset.get(0);
  const start = parseCalendarDate(first?.date);
  if (!start) return false;
  for (let offset = 0; offset <= maxDayOffset; offset++) {
    const row = byOffset.get(offset);
    if (!row || row.date !== expectedDate(start, offset)) return false;
  }
  return true;
}

/** Validate the unscored daily weather snapshot that feeds forecast scoring. */
export function hasCompleteSnapshotHorizon(
  payload: unknown,
  maxDayOffset: number,
): boolean {
  if (!payload || typeof payload !== "object") return false;
  const daily = (payload as Record<string, unknown>).forecast_daily;
  if (!Array.isArray(daily) || daily.length < maxDayOffset + 1) return false;
  const start = parseCalendarDate(
    (daily[0] as { date?: unknown } | null)?.date,
  );
  if (!start) return false;
  for (let offset = 0; offset <= maxDayOffset; offset++) {
    const entry = daily[offset];
    if (
      !entry ||
      typeof entry !== "object" ||
      (entry as { date?: unknown }).date !== expectedDate(start, offset)
    ) return false;
  }
  return true;
}

/**
 * Always returns the requested number of future calendar slots. Missing API
 * rows become null placeholders instead of making the Home calendar collapse.
 */
export function buildFutureForecastSlots<T extends ForecastHorizonRow>(
  rows: readonly T[] | null | undefined,
  futureDays: number,
): Array<T | null> {
  const byOffset = new Map<number, T>();
  for (const row of rows ?? []) {
    const offset = Number(row.day_offset);
    if (
      Number.isInteger(offset) &&
      offset >= 1 &&
      offset <= futureDays &&
      !byOffset.has(offset)
    ) byOffset.set(offset, row);
  }
  return Array.from(
    { length: futureDays },
    (_, index) => byOffset.get(index + 1) ?? null,
  );
}
