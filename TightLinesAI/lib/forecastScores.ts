/**
 * forecastScores — 7-day deterministic fishing score forecast
 *
 * Calls the forecast-scores edge function (no LLM, no auth required).
 * Results are cached until midnight local time — consistent with the full
 * report cache so scores stay fresh and aligned daily.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const CACHE_KEY_PREFIX = 'forecast_scores_v1';

/** Returns the UTC timestamp of the next local midnight (device timezone). */
function nextLocalMidnightMs(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // next midnight in device local time
  return midnight.getTime();
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
}

export interface ForecastScoresResult {
  forecast: DayForecastScore[];
  timezone: string;
  fetched_at: string; // ISO string
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
 * Returns the best score across all three contexts for a day, 0–100.
 */
export function bestDayScore(day: DayForecastScore): number {
  return Math.max(day.freshwater_lake_pond, day.freshwater_river, day.coastal);
}

/**
 * Mean score (0–100) across the water-type tabs the user can open at this location.
 * Matches how the 7-day outlook aligns with multi-tab reports: inland = lake + river,
 * coastal-eligible = lake + river + coastal.
 */
export function meanDayScore(day: DayForecastScore, isCoastalEligible: boolean): number {
  if (isCoastalEligible) {
    return (
      day.freshwater_lake_pond + day.freshwater_river + day.coastal
    ) / 3;
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
 * Returns cached data if it was fetched today (before midnight), otherwise fetches fresh.
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
        return parsed;
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

    const json = await res.json() as { forecast?: DayForecastScore[]; timezone?: string };
    if (!Array.isArray(json.forecast) || json.forecast.length === 0) {
      if (__DEV__) console.error('[forecastScores] empty or missing forecast array:', json);
      return null;
    }

    const data: ForecastScoresResult = {
      forecast: json.forecast,
      timezone: json.timezone ?? 'UTC',
      fetched_at: new Date().toISOString(),
    };

    // Persist to cache — expires at tonight's local midnight
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          ...data,
          _fetched_at: Date.now(),
          _expires_at: nextLocalMidnightMs(),
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
 * Removes the cached forecast for the given location.
 * Call after generating a full report so the calendar reflects updated scores.
 */
export function invalidateForecastCache(lat: number, lon: number): void {
  const key = cacheKey(lat, lon);
  AsyncStorage.removeItem(key).catch(() => {});
}
