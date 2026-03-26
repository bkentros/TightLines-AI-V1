/**
 * Temperature timing evaluator — seek_warmth vs avoid_heat.
 *
 * seek_warmth (cold/cool bands):
 * - Never anchors on adverse cold: sharp cooldown or multi-day cooling trend → null
 *   (cascade to secondary / family fallback).
 * - Qualifies only when there is a **warming reason**: sharp warmup shock, 72h warming
 *   trend, or ≥5°F day-over-day mean lift (feeds optional hourly placement).
 * - Optional `hourly_air_temp_f` (24 values, local hour 0 = index 0): place the window on
 *   the largest hour-over-hour **rise**, else the warmest fishable-hour peak.
 * - Without hourly: large jumps use afternoon + evening; moderate signals use afternoon.
 *
 * avoid_heat: warm/very_warm, negative score, light cloud gate — unchanged in spirit.
 */

import type { SharedNormalizedOutput } from "../../contracts/mod.ts";
import type {
  DaypartFlags,
  TimingEvalOptions,
  TimingSignal,
  TimingStrength,
} from "../timingTypes.ts";
import {
  daypartIndexFromClockHour,
  singleDaypart,
} from "../daypartHourly.ts";
import { ENGINE_SCORE_EPSILON } from "../../score/engineScoreMath.ts";

export type TemperatureMode = "seek_warmth" | "avoid_heat";

/** Matches 72h trend threshold in normalizeTemperature (5°F). */
const MODERATE_DAY_OVER_DAY_WARM_F = 5;
/** Hourly step must clear this to treat as an intraday "spike" (noise filter). */
const MIN_HOURLY_WARMING_STEP_F = 2;
/** Without hourly data, treat this day-over-day mean rise as "late warmth possible". */
const BROAD_WARMTH_WINDOW_DAY_DELTA_F = 8;

export function evaluateTemperatureWindow(
  mode: TemperatureMode,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const temp = norm.normalized.temperature;
  if (!temp) return null;

  if (mode === "seek_warmth") {
    return evaluateSeekWarmth(temp, opts);
  }
  return evaluateAvoidHeat(temp, opts);
}

/**
 * 24 hourly temps, index 0 = local midnight. Prefer the hour ending the steepest
 * warming step; else the hour of max temp between 06:00–21:00.
 */
function periodsFromHourlyWarmth(hourly: number[]): DaypartFlags | null {
  const n = Math.min(hourly.length, 24);
  if (n < 12) return null;

  let maxDelta = -Infinity;
  let hourAfterMaxDelta = 14;
  for (let i = 1; i < n; i++) {
    const d = hourly[i]! - hourly[i - 1]!;
    if (d > maxDelta) {
      maxDelta = d;
      hourAfterMaxDelta = i;
    }
  }
  if (maxDelta >= MIN_HOURLY_WARMING_STEP_F) {
    return singleDaypart(daypartIndexFromClockHour(hourAfterMaxDelta));
  }

  let maxT = -Infinity;
  let maxH = 14;
  for (let h = 6; h < Math.min(n, 22); h++) {
    if (hourly[h]! > maxT) {
      maxT = hourly[h]!;
      maxH = h;
    }
  }
  return singleDaypart(daypartIndexFromClockHour(maxH));
}

function defaultPeriodsWithoutHourly(
  sharpWarmup: boolean,
  dayDelta: number | null,
): DaypartFlags {
  const wide =
    sharpWarmup ||
    (dayDelta != null && dayDelta >= BROAD_WARMTH_WINDOW_DAY_DELTA_F);
  if (wide) return [false, false, true, true];
  return [false, false, true, false];
}

function evaluateSeekWarmth(
  temp: NonNullable<SharedNormalizedOutput["normalized"]["temperature"]>,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const { band_label, trend_label, shock_label } = temp;

  if (band_label !== "very_cold" && band_label !== "cool") return null;

  if (shock_label === "sharp_cooldown" || trend_label === "cooling") {
    return null;
  }

  const daily = opts.daily_mean_air_temp_f;
  const prior = opts.prior_day_mean_air_temp_f;
  const dayDelta =
    daily != null &&
    prior != null &&
    !Number.isNaN(daily) &&
    !Number.isNaN(prior)
      ? daily - prior
      : null;

  const sharpWarmup = shock_label === "sharp_warmup";
  const warming72 = trend_label === "warming";
  const moderateDayRise =
    dayDelta !== null && dayDelta >= MODERATE_DAY_OVER_DAY_WARM_F;

  if (!sharpWarmup && !warming72 && !moderateDayRise) {
    // On a stable very-cold day with no warming signal, fish still gravitate to the
    // warmest water at midday even without a temperature rise. Guide anglers there at
    // lower confidence rather than cascading to light/fallback.
    if (band_label !== "very_cold") return null;

    const stableHourly = opts.hourly_air_temp_f;
    let stablePeriods: DaypartFlags;
    if (stableHourly && stableHourly.length >= 12) {
      const intraday = periodsFromHourlyWarmth(stableHourly);
      stablePeriods = intraday ?? [false, false, true, false];
    } else {
      stablePeriods = [false, false, true, false]; // afternoon default
    }
    return {
      driver_id: "seek_warmth",
      role: "anchor",
      strength: "good",
      periods: stablePeriods,
      note_pool_key: "warmest_window",
      debug_reason:
        `seek_warmth: stable very_cold (no spike/trend/rise), band=${band_label}; ` +
        `warmest midday window — fish seek heat at coldest temps regardless of trend.`,
    };
  }

  let strength: TimingStrength;
  if (sharpWarmup) strength = "very_strong";
  else if (moderateDayRise && (dayDelta ?? 0) >= 9) strength = "strong";
  else if (warming72 && moderateDayRise) strength = "strong";
  else if (warming72 || moderateDayRise) strength = "good";
  else strength = "good";

  const hourly = opts.hourly_air_temp_f;
  let periods: DaypartFlags;
  let notePoolKey: string;

  if (hourly && hourly.length >= 12) {
    const intraday = periodsFromHourlyWarmth(hourly);
    if (intraday) {
      periods = intraday;
      notePoolKey = "warmth_intraday_peak";
    } else {
      periods = defaultPeriodsWithoutHourly(sharpWarmup, dayDelta);
      notePoolKey = sharpWarmup ? "warmth_spike_aggregate" : "warmest_window";
    }
  } else {
    periods = defaultPeriodsWithoutHourly(sharpWarmup, dayDelta);
    notePoolKey = sharpWarmup ? "warmth_spike_aggregate" : "warmest_window";
  }

  const debugReason =
    `seek_warmth: band=${band_label}, shock=${shock_label}, trend=${trend_label}, ` +
    `dayDelta=${dayDelta ?? "n/a"}; hourly=${hourly && hourly.length >= 12 ? "yes" : "no"} → ` +
    `periods=${periods.map((v, i) => v ? ["dawn", "morning", "afternoon", "evening"][i] : "").filter(Boolean).join("+")}`;

  return {
    driver_id: "seek_warmth",
    role: "anchor",
    strength,
    periods,
    note_pool_key: notePoolKey,
    debug_reason: debugReason,
  };
}

function evaluateAvoidHeat(
  temp: NonNullable<SharedNormalizedOutput["normalized"]["temperature"]>,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const { band_label, final_score, shock_label, trend_label } = temp;
  const cloudPct = opts.cloud_cover_pct;

  if (band_label !== "warm" && band_label !== "very_warm") return null;

  if (final_score > ENGINE_SCORE_EPSILON) return null;

  // Sudden cold push on an otherwise warm day — do not anchor "escape the heat" on temp
  if (shock_label === "sharp_cooldown" || trend_label === "cooling") {
    return null;
  }

  if (cloudPct != null && cloudPct >= 85) return null;

  let strength: TimingStrength;
  if (band_label === "very_warm" && final_score <= -ENGINE_SCORE_EPSILON) {
    strength = "strong";
  } else {
    strength = "good";
  }

  const periods: DaypartFlags = [true, false, false, true];

  return {
    driver_id: "avoid_heat",
    role: "anchor",
    strength,
    periods,
    note_pool_key: "cooler_low_light",
    debug_reason:
      `avoid_heat: band=${band_label}, final_score=${final_score}, cloud=${cloudPct ?? "unknown"}%; ` +
      `dawn+evening highlighted.`,
  };
}
