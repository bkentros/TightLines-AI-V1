/**
 * forecastScores — 7-day deterministic fishing score forecast
 *
 * Calls the forecast-scores edge function (no LLM, no auth required).
 * Results are cached until the next midnight in the fishing location timezone so the
 * 7-day outlook stays stable all day and future-day reports can reuse the same snapshot.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WeatherData } from './env/types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/** v5 stores the shared forecast weather+tide snapshot used by future-day reports. */
const CACHE_KEY_PREFIX = 'forecast_scores_v5';

const LEGACY_FORECAST_CACHE_PREFIXES = [
  'forecast_scores_v1',
  'forecast_scores_v2',
  'forecast_scores_v3',
  'forecast_scores_v4',
  'forecast_scores_v5',
] as const;

/**
 * Next instant (UTC ms) when the calendar date advances in `timeZone` (IANA).
 * Falls back to device-local next midnight if the zone is invalid.
 */
export function nextMidnightInTimeZoneMs(timeZone: string, fromMs: number = Date.now()): number {
  const tz = typeof timeZone === 'string' && timeZone.trim().length > 0 ? timeZone.trim() : 'UTC';
  try {
    const dayFmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DayForecastScore {
  date: string;         // "YYYY-MM-DD"
  day_offset: number;   // 0 = today, 1 = tomorrow, …, 6 = day+6
  day_label: string;    // "Today" | "Tmrw" | "Mon" | "Tue" | …
  month_day: string;    // "3/22" — short display date
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

export interface ForecastSnapshotTideDay {
  date: string;
  station_id: string;
  station_name: string;
  high_low: Array<{ time: string; type: 'H' | 'L'; value: number }>;
  phase?: string;
  unit: string;
}

export interface ForecastSnapshotEnv {
  timezone?: string;
  tz_offset_hours?: number;
  coastal?: boolean;
  tides_available?: boolean;
  nearest_tide_station_id?: string | null;
  weather: WeatherData;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  forecast_tides_by_date?: ForecastSnapshotTideDay[];
}

function normalizeForecastRows(rows: Partial<DayForecastScore>[]): DayForecastScore[] {
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

function cacheKey(lat: number, lon: number): string {
  // Round to ~1km to tolerate minor GPS drift
  const latR = Math.round(lat * 100) / 100;
  const lonR = Math.round(lon * 100) / 100;
  return `${CACHE_KEY_PREFIX}_${latR}_${lonR}`;
}

// ---------------------------------------------------------------------------
// Score helpers
// ---------------------------------------------------------------------------

/**
 * Returns the best score across all tab contexts for a day, 0–100.
 */
export function bestDayScore(day: DayForecastScore): number {
  const flats = day.coastal_flats_estuary ?? day.coastal;
  return Math.max(day.freshwater_lake_pond, day.freshwater_river, day.coastal, flats);
}

/**
 * Mean score (0–100) across the water-type tabs the user can open at this location.
 * Matches how the 7-day outlook aligns with multi-tab reports: inland = lake + river;
 * coastal-eligible = lake + river + inshore + flats/estuary (four-way mean).
 */
export function meanDayScore(day: DayForecastScore, isCoastalEligible: boolean): number {
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
 * Aligned with bandFromScore: Excellent ≥80, Good ≥60, Fair ≥40, Poor <40.
 */
export function scoreColor(raw: number): string {
  if (raw >= 80) return '#2E6F40'; // Excellent
  if (raw >= 60) return '#3A8A54'; // Good
  if (raw >= 40) return '#C29B2A'; // Fair
  return '#C0504A';                // Poor
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
): Promise<ForecastScoresResult | null> {
  const key = cacheKey(lat, lon);

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
    const res = await fetch(`${SUPABASE_URL}/functions/v1/forecast-scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ latitude: lat, longitude: lon }),
    });

    if (!res.ok) {
      if (__DEV__) {
        const text = await res.text().catch(() => '(unreadable)');
        console.error(`[forecastScores] edge fn returned ${res.status}:`, text);
      }
      return null;
    }

    const json = await res.json() as {
      forecast?: Partial<DayForecastScore>[];
      timezone?: string;
      snapshot_env?: ForecastSnapshotEnv;
    };
    if (!Array.isArray(json.forecast) || json.forecast.length === 0) {
      if (__DEV__) console.error('[forecastScores] empty or missing forecast array:', json);
      return null;
    }

    const data: ForecastScoresResult = {
      forecast: normalizeForecastRows(json.forecast),
      timezone: json.timezone ?? 'UTC',
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
    if (__DEV__) console.error('[forecastScores] fetch error:', err);
    return null;
  }
}

/**
 * Removes the cached forecast for the given location (e.g. after changing pin
 * so the next fetch is for the new coordinates).
 */
export function invalidateForecastCache(lat: number, lon: number): void {
  const key = cacheKey(lat, lon);
  AsyncStorage.removeItem(key).catch(() => {});
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
