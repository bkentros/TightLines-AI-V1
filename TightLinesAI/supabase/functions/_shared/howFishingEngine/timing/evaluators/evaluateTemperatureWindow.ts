/**
 * Temperature timing evaluator — seek_warmth vs avoid_heat.
 *
 * seek_warmth (cold/cool bands):
 * - Never anchors on adverse cold: sharp cooldown or multi-day cooling trend → null
 *   (cascade to secondary / family fallback).
 * - Qualifies only when there is a **warming reason**: sharp warmup shock, 72h warming
 *   trend, or ≥5°F day-over-day mean lift (feeds optional hourly placement).
 * - Optional `hourly_air_temp_f` (24 values, local hour 0 = index 0): place the window on
 *   the warmest fishable-hour peak. For broad fishing windows, fish biology tracks the
 *   accumulated warmest water better than the first sharp warming step after sunrise.
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
  daypartMeansForSeries,
} from "../daypartHourly.ts";
import { ENGINE_SCORE_EPSILON } from "../../score/engineScoreMath.ts";
import { notePoolKeyForDaypartFlags } from "../timingNotes.ts";

export type TemperatureMode = "seek_warmth" | "avoid_heat";

/** Matches 72h trend threshold in normalizeTemperature (5°F). */
const MODERATE_DAY_OVER_DAY_WARM_F = 5;
/** Without hourly data, treat this day-over-day mean rise as "late warmth possible". */
const BROAD_WARMTH_WINDOW_DAY_DELTA_F = 8;
/** Adjacent bucket can join when thermal means stay close enough to act like one broad window. */
const TEMP_BUCKET_PLATEAU_DELTA_F = 3;

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

function formatBucketMeans(means: (number | null)[]): string {
  return means.map((m) => (m == null ? "x" : m.toFixed(1))).join("/");
}

function periodsFromHourlyWarmth(hourly: number[]): { periods: DaypartFlags; debug: string } | null {
  const means = daypartMeansForSeries(hourly);
  if (!means) return null;

  let bestIdx = 0;
  let bestMean = -Infinity;
  for (let i = 0; i < means.length; i++) {
    const mean = means[i];
    if (mean == null) continue;
    if (mean > bestMean || (mean === bestMean && i > bestIdx)) {
      bestMean = mean;
      bestIdx = i;
    }
  }
  if (!Number.isFinite(bestMean)) return null;

  const periods: DaypartFlags = [false, false, false, false];
  periods[bestIdx] = true;

  const adjacent = [bestIdx - 1, bestIdx + 1]
    .filter((idx) => idx >= 0 && idx < means.length)
    .map((idx) => ({ idx, mean: means[idx] }))
    .filter((x): x is { idx: number; mean: number } => x.mean != null)
    .filter((x) => x.mean >= bestMean - TEMP_BUCKET_PLATEAU_DELTA_F)
    .sort((a, b) => (b.idx - a.idx) || (b.mean - a.mean));

  if (adjacent.length > 0) {
    periods[adjacent[0]!.idx as 0 | 1 | 2 | 3] = true;
  }

  return {
    periods,
    debug: `bucketMeans=${formatBucketMeans(means)} best=${bestIdx} bestMean=${bestMean.toFixed(1)}`,
  };
}

function periodsFromHourlyCool(hourly: number[]): { periods: DaypartFlags; debug: string } | null {
  const means = daypartMeansForSeries(hourly);
  if (!means) return null;

  const allowed: Array<{ idx: 0 | 1 | 3; mean: number }> = [0, 1, 3]
    .map((idx) => ({ idx: idx as 0 | 1 | 3, mean: means[idx] }))
    .filter((x): x is { idx: 0 | 1 | 3; mean: number } => x.mean != null);
  if (allowed.length === 0) return null;

  const coolestMean = Math.min(...allowed.map((x) => x.mean));
  const qualified = new Set(
    allowed
      .filter((x) => x.mean <= coolestMean + TEMP_BUCKET_PLATEAU_DELTA_F)
      .map((x) => x.idx),
  );

  const periods: DaypartFlags = [false, false, false, false];
  if (qualified.has(0) && qualified.has(3)) {
    periods[0] = true;
    periods[3] = true;
  } else if (qualified.has(0) && qualified.has(1)) {
    periods[0] = true;
    periods[1] = true;
  } else if (qualified.has(1) && qualified.has(3)) {
    periods[1] = true;
    periods[3] = true;
  } else {
    const best = allowed.sort((a, b) => a.mean - b.mean || a.idx - b.idx)[0]!;
    periods[best.idx] = true;
  }

  return {
    periods,
    debug: `bucketMeans=${formatBucketMeans(means)} coolest=${coolestMean.toFixed(1)} qualified=${[...qualified].join(",")}`,
  };
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
      stablePeriods = intraday?.periods ?? [false, false, true, false];
    } else {
      stablePeriods = [false, false, true, false]; // afternoon default
    }
    return {
      driver_id: "seek_warmth",
      role: "anchor",
      strength: "good",
      periods: stablePeriods,
      note_pool_key: notePoolKeyForDaypartFlags(stablePeriods),
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
      periods = intraday.periods;
      notePoolKey = periods.filter(Boolean).length >= 2
        ? "warmth_plateau_window"
        : "warmth_intraday_peak";
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
    `periods=${periods.map((v, i) => v ? ["dawn", "morning", "afternoon", "evening"][i] : "").filter(Boolean).join("+")}` +
    (hourly && hourly.length >= 12 && periodsFromHourlyWarmth(hourly)
      ? `; ${periodsFromHourlyWarmth(hourly)!.debug}`
      : "");

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

  const hourly = opts.hourly_air_temp_f;
  let periods: DaypartFlags = [true, false, false, true];
  if (hourly && hourly.length >= 12) {
    const intraday = periodsFromHourlyCool(hourly);
    if (intraday) {
      periods = intraday.periods;
    }
  }

  const notePoolKey =
    periods[0] === true && periods[3] === true && !periods[1] && !periods[2]
      ? "cooler_low_light"
      : "coolest_window";

  return {
    driver_id: "avoid_heat",
    role: "anchor",
    strength,
    periods,
    note_pool_key: notePoolKey,
    debug_reason:
      `avoid_heat: band=${band_label}, final_score=${final_score}, cloud=${cloudPct ?? "unknown"}%; ` +
      `periods=${periods.map((v, i) => v ? ["dawn", "morning", "afternoon", "evening"][i] : "").filter(Boolean).join("+")}` +
      (hourly && hourly.length >= 12 && periodsFromHourlyCool(hourly)
        ? `; ${periodsFromHourlyCool(hourly)!.debug}`
        : ""),
  };
}
