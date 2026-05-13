export interface ForecastSnapshotDailyDay {
  date: string;
  sunrise_local?: string | null;
  sunset_local?: string | null;
}

export interface ForecastSnapshotTideDay {
  date: string;
  station_id: string;
  station_name: string;
  high_low: Array<{ time: string; type: "H" | "L"; value: number }>;
  phase?: string;
  unit: string;
}

export interface ForecastSnapshotEnvLike {
  coastal?: boolean;
  tides_available?: boolean;
  nearest_tide_station_id?: string | null;
  measured_water_temp_f?: number | null;
  measured_water_temp_24h_ago_f?: number | null;
  measured_water_temp_72h_ago_f?: number | null;
  measured_water_temp_source?: string | null;
  forecast_daily?: ForecastSnapshotDailyDay[];
  forecast_tides_by_date?: ForecastSnapshotTideDay[];
  sun?: Record<string, unknown> | null;
}

export const MEASURED_WATER_TEMP_KEYS = [
  "measured_water_temp_f",
  "measured_water_temp_24h_ago_f",
  "measured_water_temp_72h_ago_f",
  "measured_water_temp_source",
] as const;

export type MeasuredWaterTempKey = typeof MEASURED_WATER_TEMP_KEYS[number];

export function stripMeasuredWaterTempFields<
  T extends Record<string, unknown>,
>(
  envData: T,
): T {
  const out: Record<string, unknown> = { ...envData };
  for (const key of MEASURED_WATER_TEMP_KEYS) {
    delete out[key];
  }
  return out as T;
}

/**
 * Next instant (UTC ms) when the calendar date advances in `timeZone` (IANA).
 * Falls back to device-local next midnight if the zone is invalid.
 */
export function nextMidnightInTimeZoneMs(
  timeZone: string,
  fromMs: number = Date.now(),
): number {
  const tz = typeof timeZone === "string" && timeZone.trim().length > 0
    ? timeZone.trim()
    : "UTC";
  try {
    const dayFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const startKey = dayFmt.format(new Date(fromMs));
    let lo = fromMs;
    let hi = fromMs + 25 * 60 * 60 * 1000;
    if (dayFmt.format(new Date(hi)) === startKey) {
      hi = fromMs + 96 * 60 * 60 * 1000;
    }
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (dayFmt.format(new Date(mid)) === startKey) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  } catch {
    const midnight = new Date(fromMs);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime();
  }
}

export function shouldUseMeasuredWaterTempForForecastReport(args: {
  isForecastDay: boolean;
  snapshotDateForReport: string | null;
  todaySnapshotDate: string | null;
}): boolean {
  if (!args.isForecastDay) return true;
  return args.snapshotDateForReport != null &&
    args.todaySnapshotDate != null &&
    args.snapshotDateForReport === args.todaySnapshotDate;
}

export function materializeForecastEnvForDate(
  snapshot: ForecastSnapshotEnvLike | null,
  targetDate: string | null,
  opts?: { allowMeasuredWaterTemp?: boolean },
): Record<string, unknown> | null {
  if (!snapshot) return null;
  const allowMeasuredWaterTemp = opts?.allowMeasuredWaterTemp ?? true;
  const tideForDate = targetDate != null
    ? snapshot.forecast_tides_by_date?.find((entry) =>
      entry.date === targetDate
    ) ?? null
    : null;
  const dailyForDate = targetDate != null
    ? snapshot.forecast_daily?.find((entry) => entry.date === targetDate) ??
      null
    : null;

  const materialized = {
    ...snapshot,
    coastal: tideForDate != null ? true : Boolean(snapshot.coastal),
    tides_available: tideForDate != null,
    nearest_tide_station_id: tideForDate?.station_id ??
      snapshot.nearest_tide_station_id ?? null,
    tides: tideForDate
      ? {
        station_id: tideForDate.station_id,
        station_name: tideForDate.station_name,
        high_low: tideForDate.high_low,
        phase: tideForDate.phase,
        unit: tideForDate.unit,
      }
      : null,
    sun: dailyForDate?.sunrise_local && dailyForDate?.sunset_local
      ? {
        ...(snapshot.sun && typeof snapshot.sun === "object"
          ? snapshot.sun
          : {}),
        sunrise: dailyForDate.sunrise_local,
        sunset: dailyForDate.sunset_local,
      }
      : snapshot.sun ?? null,
  };
  return allowMeasuredWaterTemp
    ? materialized
    : stripMeasuredWaterTempFields(materialized);
}
