/**
 * forecastScores — 7-day deterministic fishing score forecast
 *
 * Calls the forecast-scores edge function (no generative calls; signed-in users only).
 * Results are cached until the next midnight in the fishing location timezone so the
 * 7-day outlook stays stable all day and future-day reports can reuse the same snapshot.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EnvironmentData, WeatherData } from "./env/types";
import {
  MEASURED_WATER_TEMP_KEYS,
  nextMidnightInTimeZoneMs,
  stripMeasuredWaterTempFields,
} from "./forecastSnapshot";
import { getValidAccessToken } from "./supabase";

export {
  MEASURED_WATER_TEMP_KEYS,
  nextMidnightInTimeZoneMs,
  stripMeasuredWaterTempFields,
} from "./forecastSnapshot";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/** v7 keys include the requested forecast scope so free previews never hydrate from a full paid cache. */
const CACHE_KEY_PREFIX = "forecast_scores_v7";

const LEGACY_FORECAST_CACHE_PREFIXES = [
  "forecast_scores_v1",
  "forecast_scores_v2",
  "forecast_scores_v3",
  "forecast_scores_v4",
  "forecast_scores_v5",
  "forecast_scores_v6",
  "forecast_scores_v7",
] as const;

function isSignedOutError(err: unknown): boolean {
  return err instanceof Error && /not signed in/i.test(err.message);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DayForecastScore {
  date: string; // "YYYY-MM-DD"
  day_offset: number; // 0 = today, 1 = tomorrow, …, 6 = day+6
  day_label: string; // "Today" | "Tmrw" | "Mon" | "Tue" | …
  month_day: string; // "3/22" — short display date
  freshwater_lake_pond: number; // 0–100 raw score
  freshwater_river: number;
  coastal: number;
  coastal_flats_estuary: number;
}

export interface ForecastScoresResult {
  forecast: DayForecastScore[];
  timezone: string;
  fetched_at: string; // ISO string
  snapshot_env?: ForecastSnapshotEnv;
}

export interface ForecastScoresOptions {
  /** Highest day_offset to request from the edge function. Defaults to the full 6-day outlook. */
  maxDayOffset?: number;
  /** Include the forecast snapshot used for report generation and per-day hi/lo display. */
  includeSnapshotEnv?: boolean;
}

export interface ForecastSnapshotTideDay {
  date: string;
  station_id: string;
  station_name: string;
  high_low: Array<{ time: string; type: "H" | "L"; value: number }>;
  phase?: string;
  unit: string;
}

export interface ForecastSnapshotEnv {
  timezone?: string;
  tz_offset_hours?: number;
  coastal?: boolean;
  tides_available?: boolean;
  nearest_tide_station_id?: string | null;
  measured_water_temp_f?: number | null;
  measured_water_temp_24h_ago_f?: number | null;
  measured_water_temp_72h_ago_f?: number | null;
  measured_water_temp_source?: string | null;
  weather: WeatherData;
  forecast_daily?: Array<{
    date: string;
    sunrise_local?: string | null;
    sunset_local?: string | null;
  }>;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  forecast_tides_by_date?: ForecastSnapshotTideDay[];
}

export function mergeMeasuredWaterTempFields<T extends Record<string, unknown>>(
  forecastEnv: T,
  envData:
    | Pick<EnvironmentData, typeof MEASURED_WATER_TEMP_KEYS[number]>
    | Record<string, unknown>
    | null
    | undefined,
): T {
  if (!envData || typeof envData !== "object") return forecastEnv;
  const out: Record<string, unknown> = { ...forecastEnv };
  let changed = false;
  for (const key of MEASURED_WATER_TEMP_KEYS) {
    if (Object.prototype.hasOwnProperty.call(envData, key)) {
      out[key] = (envData as Record<string, unknown>)[key];
      changed = true;
    }
  }
  return changed ? (out as T) : forecastEnv;
}

function normalizeForecastRows(
  rows: Partial<DayForecastScore>[],
): DayForecastScore[] {
  return rows.map((row) => ({
    date: row.date!,
    day_offset: row.day_offset!,
    day_label: row.day_label!,
    month_day: row.month_day!,
    freshwater_lake_pond: row.freshwater_lake_pond ?? 50,
    freshwater_river: row.freshwater_river ?? 50,
    coastal: row.coastal ?? 50,
    coastal_flats_estuary: row.coastal_flats_estuary ?? row.coastal ?? 50,
  }));
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

function normalizedForecastOptions(options?: ForecastScoresOptions): {
  maxDayOffset: number;
  includeSnapshotEnv: boolean;
} {
  const rawMax = options?.maxDayOffset;
  const maxDayOffset = Number.isFinite(rawMax)
    ? Math.max(0, Math.min(6, Math.floor(rawMax as number)))
    : 6;
  return {
    maxDayOffset,
    includeSnapshotEnv: options?.includeSnapshotEnv ?? true,
  };
}

function cacheKey(
  lat: number,
  lon: number,
  options?: ForecastScoresOptions,
): string {
  // Round to ~1km to tolerate minor GPS drift
  const latR = Math.round(lat * 100) / 100;
  const lonR = Math.round(lon * 100) / 100;
  const normalized = normalizedForecastOptions(options);
  return `${CACHE_KEY_PREFIX}_${latR}_${lonR}_d${normalized.maxDayOffset}_s${
    normalized.includeSnapshotEnv ? 1 : 0
  }`;
}

// ---------------------------------------------------------------------------
// Score helpers
// ---------------------------------------------------------------------------

/**
 * Returns the best score across all tab contexts for a day, 0–100.
 */
export function bestDayScore(day: DayForecastScore): number {
  const flats = day.coastal_flats_estuary ?? day.coastal;
  return Math.max(
    day.freshwater_lake_pond,
    day.freshwater_river,
    day.coastal,
    flats,
  );
}

/**
 * Mean score (0–100) across the water-type tabs the user can open at this location.
 * Matches how the 7-day outlook aligns with multi-tab reports: inland = lake + river;
 * coastal-eligible = lake + river + inshore + flats/estuary (four-way mean).
 */
export function meanDayScore(
  day: DayForecastScore,
  isCoastalEligible: boolean,
): number {
  if (isCoastalEligible) {
    const flats = day.coastal_flats_estuary ?? day.coastal;
    return (
      day.freshwater_lake_pond + day.freshwater_river + day.coastal + flats
    ) / 4;
  }
  return (day.freshwater_lake_pond + day.freshwater_river) / 2;
}

/**
 * Converts a raw 0–100 score to an out-of-10 display string ("7.2" or "7").
 */
export function formatScoreDisplay(raw: number): string {
  const v = Math.round(raw) / 10;
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

/**
 * Returns a color for the given 0–100 score.
 * Aligned with bandFromScore (5-band field-edition palette):
 *   Prime ≥80, Good ≥65, Fair ≥50, Poor ≥35, Tough <35.
 */
export function scoreColor(raw: number): string {
  if (raw >= 80) return "#3DA85F"; // Prime
  if (raw >= 65) return "#7CC36A"; // Good
  if (raw >= 50) return "#E8C547"; // Fair
  if (raw >= 35) return "#E89647"; // Poor
  return "#D94B3A"; // Tough
}

// ---------------------------------------------------------------------------
// Main fetch with cache
// ---------------------------------------------------------------------------

/**
 * Fetches 7-day forecast scores for the given location.
 * Returns cached data until the next location-midnight rollover.
 */
export async function getForecastScores(
  lat: number,
  lon: number,
  options?: ForecastScoresOptions,
): Promise<ForecastScoresResult | null> {
  const normalizedOptions = normalizedForecastOptions(options);
  const key = cacheKey(lat, lon, normalizedOptions);

  // Check cache first
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as ForecastScoresResult & {
        _fetched_at: number;
        _expires_at: number;
      };
      // Valid until the midnight that was computed when the data was fetched
      if (Date.now() < (parsed._expires_at ?? 0)) {
        return {
          ...parsed,
          forecast: normalizeForecastRows(parsed.forecast ?? []),
        };
      }
    }
  } catch {
    // Cache miss — fetch fresh
  }

  // Fetch from edge function
  try {
    const accessToken = await getValidAccessToken();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/forecast-scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "x-user-token": accessToken,
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lon,
        max_day_offset: normalizedOptions.maxDayOffset,
        include_snapshot_env: normalizedOptions.includeSnapshotEnv,
      }),
    });

    if (!res.ok) {
      if (__DEV__) {
        const text = await res.text().catch(() => "(unreadable)");
        console.warn(`[forecastScores] edge fn returned ${res.status}:`, text);
      }
      return null;
    }

    const json = await res.json() as {
      forecast?: Partial<DayForecastScore>[];
      timezone?: string;
      snapshot_env?: ForecastSnapshotEnv;
    };
    if (!Array.isArray(json.forecast) || json.forecast.length === 0) {
      if (__DEV__) {
        console.warn(
          "[forecastScores] empty or missing forecast array:",
          json,
        );
      }
      return null;
    }

    const data: ForecastScoresResult = {
      forecast: normalizeForecastRows(json.forecast),
      timezone: json.timezone ?? "UTC",
      fetched_at: new Date().toISOString(),
      snapshot_env: json.snapshot_env,
    };

    // Persist to cache — stable until the location's next midnight rollover.
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          ...data,
          _fetched_at: Date.now(),
          _expires_at: nextMidnightInTimeZoneMs(data.timezone),
        }),
      );
    } catch {
      // Non-fatal
    }

    return data;
  } catch (err) {
    if (__DEV__ && !isSignedOutError(err)) {
      console.warn("[forecastScores] fetch error:", err);
    }
    return null;
  }
}

/**
 * Removes the cached forecast for the given location (e.g. after changing pin
 * so the next fetch is for the new coordinates).
 */
export function invalidateForecastCache(lat: number, lon: number): void {
  const latR = Math.round(lat * 100) / 100;
  const lonR = Math.round(lon * 100) / 100;
  AsyncStorage.getAllKeys()
    .then((keys) =>
      AsyncStorage.multiRemove(
        keys.filter((k) =>
          k.startsWith(`${CACHE_KEY_PREFIX}_${latR}_${lonR}_`)
        ),
      )
    )
    .catch(() => {});
}

/** Remove all stored 7-day forecast chip caches (any location). */
export async function clearAllForecastScoreCaches(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter((k) =>
      LEGACY_FORECAST_CACHE_PREFIXES.some((p) => k.startsWith(`${p}_`))
    );
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch {
    // non-fatal
  }
}
