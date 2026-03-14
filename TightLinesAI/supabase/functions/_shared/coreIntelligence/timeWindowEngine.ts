// =============================================================================
// CORE INTELLIGENCE ENGINE — TIME WINDOW ENGINE
// Implements Section 7 of core_intelligence_spec.md
// 30-minute block scoring and window classification for the current day.
// Edge-case rules per ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md
// =============================================================================

import type {
  EnvironmentSnapshot,
  WaterType,
  TimeWindow,
  WorstWindow,
  WindowLabel,
  WaterTempZone,
  TempTrendState,
  PressureState,
  LightCondition,
  SeasonalFishBehaviorState,
  FreshwaterSubtype,
  LatitudeBand,
  SaltwaterSeasonalState,
  BlockResult,
} from "./types.ts";
import {
  hmToMinutes,
  localTimeStringToUtcMs,
  deriveWaterTempZone,
  estimateFreshwaterTemp,
  getMeteoSeason,
  computeEffectiveLatitude,
  getLatitudeBand,
} from "./derivedVariables.ts";
import { clamp } from "./scoreEngine.ts";
import { isBlockSafe, getCoastalBand } from "./seasonalProfiles.ts";
import { getFeedingPreferenceForBlock } from "./fishBiology.ts";

// ---------------------------------------------------------------------------
// Section 7A — Resolution: 48 blocks of 30 minutes (00:00–23:30)
// Block scores are anchored to the daily raw_score (Gaussian baselines) and
// differentiated by time-varying factors: light, solunar, tides, feeding.
// ---------------------------------------------------------------------------

interface TimeQualityResult {
  factor: number;     // 0.0 – ~1.0, multiplied against daily raw_score
  drivers: string[];
}

// @deprecated — kept for type compatibility in edge-case rule layer
interface Block {
  startMin: number;
  points: number;
  maxPoints: number;
  drivers: string[];
}

/** Rule context passed to edge-case rule layer. Used for deterministic overrides. */
export interface TimeWindowRuleContext {
  waterType: WaterType;
  water_temp_zone: WaterTempZone | null;
  temp_trend_state: TempTrendState | null;
  pressure_state: PressureState | null;
  cloud_cover_pct: number | null;
  light_condition: LightCondition | null;
  recovery_active: boolean;
  salinity_disruption_alert: boolean;
  range_strength_pct: number | null;
  seasonal_fish_behavior?: SeasonalFishBehaviorState | null;
  freshwater_subtype?: FreshwaterSubtype | null;
  saltwater_seasonal_state?: SaltwaterSeasonalState | null;  // NEW
}

// ---------------------------------------------------------------------------
// Helper: is a block (startMin to startMin+30) inside a time range?
// ---------------------------------------------------------------------------

function blockInRange(
  blockStartMin: number,
  rangeStartMin: number,
  rangeEndMin: number
): boolean {
  const blockEndMin = blockStartMin + 30;
  return blockStartMin < rangeEndMin && blockEndMin > rangeStartMin;
}

// ---------------------------------------------------------------------------
// Section 7B — Window Score Additions
// ---------------------------------------------------------------------------

interface DawnDusk {
  dawnStart: number | null;
  dawnEnd: number | null;
  duskStart: number | null;
  duskEnd: number | null;
}

interface FreshwaterThermalTimingProfile {
  dawnDuskBonus: number;
  middayWarmBonus: number;
  middayWarmStart: number;
  middayWarmEnd: number;
}

function computeDawnDusk(env: EnvironmentSnapshot): DawnDusk {
  const sunrise = hmToMinutes(env.sunrise_local);
  const sunset = hmToMinutes(env.sunset_local);
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);

  return {
    dawnStart: twilightBegin,
    dawnEnd: sunrise !== null ? sunrise + 90 : null,
    duskStart: sunset !== null ? sunset - 90 : null,
    duskEnd: twilightEnd,
  };
}

function getFreshwaterThermalTimingProfile(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  seasonalState: SeasonalFishBehaviorState | null,
  subtype: FreshwaterSubtype | null
): FreshwaterThermalTimingProfile | null {
  if (waterType !== "freshwater") return null;

  const effectiveLat = computeEffectiveLatitude(env.lat, env.altitude_ft);
  const latBand: LatitudeBand = getLatitudeBand(effectiveLat);
  const estTemp = estimateFreshwaterTemp(env, subtype, latBand, seasonalState);
  if (estTemp === null) return null;

  const zone = deriveWaterTempZone(estTemp, "freshwater");
  if (zone === null || seasonalState === null) return null;

  switch (seasonalState) {
    case "deep_winter_survival":
      return {
        dawnDuskBonus: 10,
        middayWarmBonus: subtype === "river_stream" ? 30 : 36,
        middayWarmStart: 11 * 60,
        middayWarmEnd: 15.5 * 60,
      };
    case "pre_spawn_buildup":
      return {
        dawnDuskBonus: zone === "transitional" ? 22 : 18,
        middayWarmBonus: 28,
        middayWarmStart: 10 * 60,
        middayWarmEnd: 16 * 60,
      };
    case "spawn_period":
      return {
        dawnDuskBonus: 20,
        middayWarmBonus: 18,
        middayWarmStart: 9.5 * 60,
        middayWarmEnd: 14 * 60,
      };
    case "post_spawn_recovery":
      return {
        dawnDuskBonus: 30,
        middayWarmBonus: 6,
        middayWarmStart: 11 * 60,
        middayWarmEnd: 13 * 60,
      };
    case "summer_peak_activity":
      return {
        dawnDuskBonus: 40,
        middayWarmBonus: 0,
        middayWarmStart: 0,
        middayWarmEnd: 0,
      };
    case "summer_heat_suppression":
      return {
        dawnDuskBonus: 42,
        middayWarmBonus: 0,
        middayWarmStart: 0,
        middayWarmEnd: 0,
      };
    case "fall_feed_buildup":
      return {
        dawnDuskBonus: 34,
        middayWarmBonus: 12,
        middayWarmStart: 12 * 60,
        middayWarmEnd: 16 * 60,
      };
    case "late_fall_slowdown":
      return {
        dawnDuskBonus: 16,
        middayWarmBonus: 26,
        middayWarmStart: 10.5 * 60,
        middayWarmEnd: 15.5 * 60,
      };
    case "mild_winter_active":
      return {
        dawnDuskBonus: 24,
        middayWarmBonus: 18,
        middayWarmStart: 10 * 60,
        middayWarmEnd: 16 * 60,
      };
    default:
      return null;
  }
}

interface TideBlockInfo {
  phaseState: string | null;
  tideStrengthAboveAverage: boolean;
}

function getTidePhaseForBlock(
  blockStartMin: number,
  env: EnvironmentSnapshot
): TideBlockInfo {
  if (env.tide_predictions_today.length < 2) {
    return { phaseState: null, tideStrengthAboveAverage: false };
  }

  const blockUtcMs =
    getLocalMidnightUtcMs(env) + blockStartMin * 60 * 1000 + 15 * 60 * 1000; // midpoint

  const preds = env.tide_predictions_today
    .map((p) => ({
      utcMs: localTimeStringToUtcMs(p.time_local, env.tz_offset_hours),
      type: p.type,
    }))
    .sort((a, b) => a.utcMs - b.utcMs);

  let last: (typeof preds)[0] | null = null;
  let next: (typeof preds)[0] | null = null;

  for (const p of preds) {
    if (p.utcMs <= blockUtcMs) last = p;
    else if (!next) next = p;
  }

  if (!last || !next) return { phaseState: null, tideStrengthAboveAverage: false };

  const minSinceLast = (blockUtcMs - last.utcMs) / 60000;
  const minToNext = (next.utcMs - blockUtcMs) / 60000;

  let phaseState: string | null = null;
  if (minToNext <= 15 || minSinceLast <= 15) phaseState = "slack";
  else if (minToNext <= 60) phaseState = "final_hour";
  else if (last.type === "L" && next.type === "H") {
    phaseState = minSinceLast <= 120 ? "incoming_first_2h" : "incoming_mid";
  } else if (last.type === "H" && next.type === "L") {
    phaseState = minSinceLast <= 120 ? "outgoing_first_2h" : "outgoing_mid";
  }

  return { phaseState, tideStrengthAboveAverage: false }; // strength checked separately
}

function getLocalMidnightUtcMs(env: EnvironmentSnapshot): number {
  const nowUtcMs = new Date(env.timestamp_utc).getTime();
  const localMs = nowUtcMs + env.tz_offset_hours * 3600 * 1000;
  const localDate = new Date(localMs);
  const midnightLocalMs =
    localMs -
    (localDate.getUTCHours() * 3600000 +
      localDate.getUTCMinutes() * 60000 +
      localDate.getUTCSeconds() * 1000 +
      localDate.getUTCMilliseconds());
  return midnightLocalMs - env.tz_offset_hours * 3600 * 1000;
}

// ---------------------------------------------------------------------------
// TIME QUALITY FACTOR — replaces old scoreBlock()
// Computes a 0.0–1.0 multiplier for each 30-min block based on
// time-varying signals only. Daily raw_score (Gaussian baselines)
// provides the condition quality; this differentiates WHEN is better.
// ---------------------------------------------------------------------------

function computeTimeQualityFactor(
  blockStartMin: number,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  rangeStrengthPct: number | null,
  ruleCtx: TimeWindowRuleContext | null
): TimeQualityResult {
  const drivers: string[] = [];

  // ---- A. LIGHT QUALITY SUB-FACTOR ----
  // Uses FreshwaterThermalTimingProfile for freshwater to preserve
  // seasonal dawn/dusk vs midday biological ratios.
  let lightFactor = 0.55; // default midday

  const freshwaterTimingProfile = getFreshwaterThermalTimingProfile(
    env,
    waterType,
    ruleCtx?.seasonal_fish_behavior ?? null,
    ruleCtx?.freshwater_subtype ?? env.freshwater_subtype_hint
  );

  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  const isNight = twilightEnd !== null && twilightBegin !== null &&
    (blockStartMin >= twilightEnd || blockStartMin + 30 <= twilightBegin);

  const isDawn = dawnDusk.dawnStart !== null && dawnDusk.dawnEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.dawnStart, dawnDusk.dawnEnd);
  const isDusk = dawnDusk.duskStart !== null && dawnDusk.duskEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.duskStart, dawnDusk.duskEnd);

  if (freshwaterTimingProfile) {
    // Freshwater: use the profile's biological ratios to set light factor.
    // The profile encodes seasonal biology — deep winter: midday dominant,
    // summer: dawn/dusk dominant. Normalize to 0–1.0 scale.
    const maxBonus = Math.max(
      freshwaterTimingProfile.dawnDuskBonus,
      freshwaterTimingProfile.middayWarmBonus,
      1 // prevent div/0
    );

    if (isDawn || isDusk) {
      lightFactor = freshwaterTimingProfile.dawnDuskBonus / maxBonus;
      drivers.push(isDawn ? "dawn_window" : "dusk_window");
    } else if (
      freshwaterTimingProfile.middayWarmBonus > 0 &&
      blockInRange(
        blockStartMin,
        freshwaterTimingProfile.middayWarmStart,
        freshwaterTimingProfile.middayWarmEnd
      )
    ) {
      lightFactor = freshwaterTimingProfile.middayWarmBonus / maxBonus;
      drivers.push("midday_warming_window");
    } else if (isNight) {
      lightFactor = 0.15; // minimal activity at night for most freshwater
      drivers.push("night_block");
    } else {
      // Non-window midday — modest but fishable
      lightFactor = 0.40;
    }
  } else {
    // Saltwater / brackish / freshwater without profile
    if (isDawn || isDusk) {
      lightFactor = 1.0;
      drivers.push(isDawn ? "dawn_window" : "dusk_window");
    } else if (isNight) {
      lightFactor = 0.50;
      drivers.push("night_block");
    } else {
      lightFactor = 0.55; // midday base
    }
  }

  // ---- B. SOLUNAR PROXIMITY SUB-FACTOR ----
  let solunarFactor = 0.35; // outside all windows

  for (const period of env.solunar_major_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      if (blockInRange(blockStartMin, s, e)) {
        solunarFactor = 1.0;
        drivers.push("major_solunar_window");
      } else {
        // Within 30 min of major window
        const blockEnd = blockStartMin + 30;
        if (
          (blockEnd >= s - 30 && blockEnd <= s) ||
          (blockStartMin >= e && blockStartMin <= e + 30)
        ) {
          solunarFactor = Math.max(solunarFactor, 0.85);
          drivers.push("near_major_solunar");
        }
      }
      break;
    }
  }

  for (const period of env.solunar_minor_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      if (blockInRange(blockStartMin, s, e)) {
        solunarFactor = Math.max(solunarFactor, 0.70);
        drivers.push("minor_solunar_window");
      } else {
        const blockEnd = blockStartMin + 30;
        if (
          (blockEnd >= s - 30 && blockEnd <= s) ||
          (blockStartMin >= e && blockStartMin <= e + 30)
        ) {
          solunarFactor = Math.max(solunarFactor, 0.55);
        }
      }
      break;
    }
  }

  // ---- C. TIDE SUB-FACTOR (salt/brackish only) ----
  let tideFactor = 0.50; // neutral default

  if (waterType !== "freshwater" && env.tide_predictions_today.length >= 2) {
    const { phaseState } = getTidePhaseForBlock(blockStartMin, env);

    if (phaseState === "incoming_first_2h") {
      tideFactor = 1.0;
      drivers.push("incoming_first_2_hours");
    } else if (phaseState === "outgoing_first_2h") {
      tideFactor = 0.95;
      drivers.push("outgoing_first_2_hours");
    } else if (phaseState === "incoming_mid") {
      tideFactor = 0.75;
      drivers.push("mid_tide_movement");
    } else if (phaseState === "outgoing_mid") {
      tideFactor = 0.70;
      drivers.push("mid_tide_movement");
    } else if (phaseState === "final_hour") {
      tideFactor = 0.40;
    } else if (phaseState === "slack") {
      tideFactor = 0.20;
      drivers.push("slack_tide");
    }

    // Tide strength bonus: strong tides amplify the phase signal
    if (rangeStrengthPct !== null && rangeStrengthPct >= 65) {
      tideFactor = Math.min(1.0, tideFactor * (1.0 + (rangeStrengthPct - 65) / 200));
      drivers.push(
        rangeStrengthPct >= 85 ? "strong_tide_strength" : "above_average_tide_strength"
      );
    }
  }

  // ---- D. COMBINE SUB-FACTORS ----
  // Water-type-specific weighting ensures tides dominate saltwater,
  // light/solunar dominate freshwater, brackish is balanced.
  let factor: number;

  if (waterType === "freshwater") {
    // Light=0.55, Solunar=0.30, Floor=0.15
    factor = lightFactor * 0.55 + solunarFactor * 0.30 + 0.15;
  } else if (waterType === "saltwater") {
    // Light=0.30, Solunar=0.15, Tide=0.35, Floor=0.20
    factor = lightFactor * 0.30 + solunarFactor * 0.15 + tideFactor * 0.35 + 0.20;
  } else {
    // Brackish: Light=0.35, Solunar=0.22, Tide=0.28, Floor=0.15
    factor = lightFactor * 0.35 + solunarFactor * 0.22 + tideFactor * 0.28 + 0.15;
  }

  return { factor: clamp(factor, 0.0, 1.0), drivers };
}

// ---------------------------------------------------------------------------
// EDGE-CASE RULE LAYER (ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md)
// Applies deterministic biological overrides after base block scoring.
// ---------------------------------------------------------------------------

function getBlockLightCategory(
  blockStartMin: number,
  dawnDusk: DawnDusk,
  cloudCover: number | null
): "dawn" | "dusk" | "midday" | "night" {
  const blockMid = blockStartMin + 15;
  const twilightEnd = dawnDusk.dawnEnd !== null ? (dawnDusk.duskEnd ?? 24 * 60) : 24 * 60;
  const twilightBegin = dawnDusk.dawnStart ?? 0;

  if (dawnDusk.dawnStart !== null && dawnDusk.dawnEnd !== null && blockInRange(blockStartMin, dawnDusk.dawnStart, dawnDusk.dawnEnd)) return "dawn";
  if (dawnDusk.duskStart !== null && dawnDusk.duskEnd !== null && blockInRange(blockStartMin, dawnDusk.duskStart, dawnDusk.duskEnd)) return "dusk";
  if (blockMid >= twilightEnd || blockMid + 30 <= twilightBegin) return "night";
  return "midday";
}

function isMiddayFullOrPartlyCloudy(blockStartMin: number, dawnDusk: DawnDusk, cloudCover: number | null): boolean {
  const cat = getBlockLightCategory(blockStartMin, dawnDusk, cloudCover);
  if (cat !== "midday") return false;
  const cc = cloudCover ?? 0;
  return cc < 70; // midday_full_sun (cc<35) or midday_partly_cloudy (35-69)
}

function isMiddayBlock(blockStartMin: number, dawnDusk: DawnDusk): boolean {
  const cat = getBlockLightCategory(blockStartMin, dawnDusk, null);
  return cat === "midday";
}

function isLateMorningToAfternoon(blockStartMin: number): boolean {
  const blockMid = blockStartMin + 15;
  return blockMid >= 9 * 60 && blockMid < 18 * 60; // 09:00–18:00
}

function isMiddayWarmingWindow(blockStartMin: number): boolean {
  const blockMid = blockStartMin + 15;
  return blockMid >= 11 * 60 && blockMid < 15 * 60;
}

// ---------------------------------------------------------------------------
// EDGE-CASE SCORE RULES — operates on score (0-100) directly
// Converts from the old ±points system to ±score adjustments.
// All 10 original biological rules preserved.
// ---------------------------------------------------------------------------

interface EdgeCaseResult {
  adjustedScore: number;
  labelCeiling: WindowLabel | null;
  drivers: string[];
}

function applyEdgeCaseScoreRules(
  rawBlockScore: number,
  blockStartMin: number,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  ruleCtx: TimeWindowRuleContext,
  tidePhaseForBlock: string | null,
  existingDrivers: string[]
): EdgeCaseResult {
  let score = rawBlockScore;
  const drivers = [...existingDrivers];
  let labelCeiling: WindowLabel | null = null;

  const zone = ruleCtx.water_temp_zone;
  const tempTrend = ruleCtx.temp_trend_state;
  const pressureState = ruleCtx.pressure_state;
  const cloudCover = ruleCtx.cloud_cover_pct;
  const seasonalState = ruleCtx.seasonal_fish_behavior ?? null;
  const season = getMeteoSeason(new Date(env.timestamp_utc).getUTCMonth() + 1);
  const isColdSeason = season === "DJF" || season === "MAM";

  // --- Rule 1: Freshwater Cold-Season Midday Warming ---
  // Already encoded in time quality factor via FreshwaterThermalTimingProfile.

  // --- Rule 2: Freshwater Summer Heat Suppression ---
  if (
    waterType === "freshwater" &&
    zone !== null &&
    (zone === "thermal_stress_heat" || zone === "peak_aggression") &&
    isMiddayFullOrPartlyCloudy(blockStartMin, dawnDusk, cloudCover)
  ) {
    score -= 22;
    if (!drivers.includes("heat_suppression_midday")) drivers.push("heat_suppression_midday");
  }

  // --- Rule 3: Freshwater Rapid Warming Late-Day Shift ---
  if (
    waterType === "freshwater" &&
    tempTrend !== null &&
    (tempTrend === "rapid_warming" || tempTrend === "warming") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic" || zone === "transitional") &&
    isLateMorningToAfternoon(blockStartMin)
  ) {
    score += 15;
    if (!drivers.includes("rapid_warming_late_day_bonus")) drivers.push("rapid_warming_late_day_bonus");
  }

  // --- Rule 4: Freshwater Overcast Extension ---
  if (
    waterType === "freshwater" &&
    (cloudCover ?? 0) >= 70 &&
    zone !== null &&
    zone !== "thermal_stress_heat" &&
    zone !== "peak_aggression" &&
    (zone !== "near_shutdown_cold" || isColdSeason) &&
    isMiddayBlock(blockStartMin, dawnDusk)
  ) {
    score += 10;
    if (!drivers.includes("overcast_extension")) drivers.push("overcast_extension");
  }

  // --- Rule 5: Post-Front Bluebird Compression ---
  if (
    ruleCtx.recovery_active &&
    pressureState !== null &&
    (pressureState === "slowly_rising" || pressureState === "rapidly_rising") &&
    (cloudCover ?? 100) < 50
  ) {
    score -= 12;
    if (!drivers.includes("post_front_compression")) drivers.push("post_front_compression");
    labelCeiling = labelCeiling ?? "GOOD";
  }

  // --- Rule 6: Saltwater Slack-Tide Dominance Cap ---
  if (
    waterType === "saltwater" &&
    (tidePhaseForBlock === "slack" || tidePhaseForBlock === "final_hour")
  ) {
    if (score >= 65) {
      score = 44;
      if (!drivers.includes("slack_cap_applied")) drivers.push("slack_cap_applied");
    }
  }

  // --- Rule 7: Brackish Runoff / Freshwater Influx Proxy ---
  if (waterType === "brackish" && ruleCtx.salinity_disruption_alert) {
    if (tidePhaseForBlock === "outgoing_first_2h" || tidePhaseForBlock === "outgoing_mid") {
      score -= 18;
      if (!drivers.includes("runoff_outgoing_penalty")) drivers.push("runoff_outgoing_penalty");
    }
    if (tidePhaseForBlock === "incoming_first_2h" || tidePhaseForBlock === "incoming_mid") {
      score += 10;
      if (!drivers.includes("runoff_incoming_preference")) drivers.push("runoff_incoming_preference");
    }
  }

  // --- Rule 8: Cold Inshore / Brackish Midday Warming ---
  if (
    (waterType === "saltwater" || waterType === "brackish") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic") &&
    isMiddayWarmingWindow(blockStartMin)
  ) {
    const saltwaterProtectedLike =
      waterType === "brackish" ||
      (waterType === "saltwater" &&
        ruleCtx.range_strength_pct !== null &&
        ruleCtx.range_strength_pct < 65);
    const strongIncoming = tidePhaseForBlock === "incoming_first_2h";
    if (saltwaterProtectedLike && !strongIncoming) {
      score += 12;
      if (!drivers.includes("cold_inshore_midday_warming")) drivers.push("cold_inshore_midday_warming");
    }
  }

  // --- Rule 9: Freshwater state-specific seasonal behavior windows ---
  if (waterType === "freshwater" && seasonalState !== null) {
    const lightCategory = getBlockLightCategory(blockStartMin, dawnDusk, cloudCover);

    if (seasonalState === "deep_winter_survival") {
      if (lightCategory === "midday") {
        score += 15;
        if (!drivers.includes("deep_winter_midday_window")) drivers.push("deep_winter_midday_window");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        score -= 10;
        if (!drivers.includes("deep_winter_low_light_penalty")) drivers.push("deep_winter_low_light_penalty");
      }
    }

    if (seasonalState === "pre_spawn_buildup" && isLateMorningToAfternoon(blockStartMin)) {
      score += 10;
      if (!drivers.includes("pre_spawn_movement_window")) drivers.push("pre_spawn_movement_window");
    }

    if (seasonalState === "spawn_period") {
      if (lightCategory === "midday") {
        score += 12;
        if (!drivers.includes("spawn_shallow_window")) drivers.push("spawn_shallow_window");
      }
    }

    if (seasonalState === "post_spawn_recovery") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        score += 10;
        if (!drivers.includes("post_spawn_low_light_window")) drivers.push("post_spawn_low_light_window");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 50) {
        score -= 8;
        if (!drivers.includes("post_spawn_midday_penalty")) drivers.push("post_spawn_midday_penalty");
      }
    }

    if (seasonalState === "summer_peak_activity") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        score += 8;
        if (!drivers.includes("summer_low_light_feed")) drivers.push("summer_low_light_feed");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 70) {
        score -= 10;
        if (!drivers.includes("summer_midday_bright_penalty")) drivers.push("summer_midday_bright_penalty");
      }
    }

    if (seasonalState === "summer_heat_suppression") {
      if (lightCategory === "midday") {
        score -= 15;
        if (!drivers.includes("summer_heat_midday_penalty")) drivers.push("summer_heat_midday_penalty");
      } else if (lightCategory === "dawn" || lightCategory === "dusk" || lightCategory === "night") {
        score += 8;
        if (!drivers.includes("summer_heat_low_light_relief")) drivers.push("summer_heat_low_light_relief");
      }
    }

    if (seasonalState === "fall_feed_buildup" && isLateMorningToAfternoon(blockStartMin)) {
      if (pressureState === "slowly_falling" || pressureState === "rapidly_falling" || (cloudCover ?? 0) >= 40) {
        score += 12;
        if (!drivers.includes("fall_feed_window")) drivers.push("fall_feed_window");
      }
    }

    if (seasonalState === "late_fall_slowdown") {
      if (lightCategory === "midday") {
        score += 12;
        if (!drivers.includes("late_fall_midday_window")) drivers.push("late_fall_midday_window");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        score -= 8;
        if (!drivers.includes("late_fall_low_light_penalty")) drivers.push("late_fall_low_light_penalty");
      }
    }

    if (seasonalState === "mild_winter_active") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        score += 5;
        if (!drivers.includes("mild_winter_low_light_window")) drivers.push("mild_winter_low_light_window");
      }
    }
  }

  // --- Rule 10: Saltwater seasonal timing adjustments ---
  if (waterType !== "freshwater" && ruleCtx.saltwater_seasonal_state) {
    const swState = ruleCtx.saltwater_seasonal_state;
    const lightCategory = getBlockLightCategory(blockStartMin, dawnDusk, cloudCover);

    if (swState === "sw_cold_inactive") {
      if (lightCategory === "midday") {
        score += 10;
        if (!drivers.includes("sw_cold_midday_warming")) drivers.push("sw_cold_midday_warming");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        score -= 5;
      }
    }

    if (swState === "sw_summer_heat_stress") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        score += 10;
        if (!drivers.includes("sw_summer_low_light_feed")) drivers.push("sw_summer_low_light_feed");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 60) {
        score -= 12;
        if (!drivers.includes("sw_summer_heat_midday_penalty")) drivers.push("sw_summer_heat_midday_penalty");
      } else if (lightCategory === "night") {
        score += 6;
        if (!drivers.includes("sw_summer_night_feed")) drivers.push("sw_summer_night_feed");
      }
    }
  }

  score = Math.max(0, score);

  // Apply label ceiling — post-front compression caps at GOOD (64)
  if (labelCeiling === "GOOD" && score >= 65) {
    score = 64;
  }

  return { adjustedScore: score, labelCeiling, drivers };
}

// ---------------------------------------------------------------------------
// Section 7C — Window Classification
// ---------------------------------------------------------------------------

function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function classifyBlockFromScore(score: number, isSafe: boolean): WindowLabel {
  if (!isSafe) return "NOT_RECOMMENDED";
  if (score >= 65) return "PRIME";
  if (score >= 45) return "GOOD";
  if (score >= 25) return "FAIR";
  return "SLOW";
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — computeTimeWindows
// ---------------------------------------------------------------------------

/**
 * Estimate the air temperature at a specific block time using hourly history.
 * Returns null if insufficient data.
 */
function estimateBlockAirTemp(
  blockIndex: number,
  env: EnvironmentSnapshot
): number | null {
  // Use the hourly air temp closest to this block's time
  if (env.hourly_air_temp_f.length === 0) return env.air_temp_f;

  const midnightUtcMs = getLocalMidnightUtcMs(env);
  const blockMidUtcMs = midnightUtcMs + (blockIndex * 30 + 15) * 60 * 1000;

  let closest: { value: number; diff: number } | null = null;
  for (const h of env.hourly_air_temp_f) {
    const t = new Date(h.time_utc).getTime();
    const diff = Math.abs(t - blockMidUtcMs);
    if (closest === null || diff < closest.diff) {
      closest = { value: h.value, diff };
    }
  }
  return closest ? closest.value : env.air_temp_f;
}

/**
 * Score all 48 blocks anchored to the daily raw_score (Gaussian baselines).
 * Each block's score = dailyRawScore × timeQualityFactor ± edge-case adjustments × feedingMult.
 * This ensures blocks inherit ALL condition intelligence from the daily engine.
 */
export function computeAllBlocks(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  rangeStrengthPct: number | null,
  pressureState: string | null,
  cloudCoverPct: number | null,
  waterTempZone: WaterTempZone | null,
  ruleContext?: TimeWindowRuleContext | null,
  dailyRawScore?: number  // from computeRawScore() — anchors all blocks to condition quality
): BlockResult[] {
  const dawnDusk = computeDawnDusk(env);
  const ruleCtx: TimeWindowRuleContext | null = ruleContext ?? null;
  const baseScore = dailyRawScore ?? 50; // fallback if not provided

  // Biological feeding preference: compute band + month once
  const effectiveLat = computeEffectiveLatitude(env.lat, env.altitude_ft);
  const bioLatBand = getLatitudeBand(effectiveLat);
  const bioCoastalBand = getCoastalBand(effectiveLat);
  const bioBand = waterType === "freshwater" ? bioLatBand : bioCoastalBand;
  const localDate = new Date(
    new Date(env.timestamp_utc).getTime() + env.tz_offset_hours * 3600 * 1000
  );
  const bioMonth = localDate.getUTCMonth() + 1;
  const sunriseMin = hmToMinutes(env.sunrise_local);
  const sunsetMin = hmToMinutes(env.sunset_local);

  const results: BlockResult[] = [];

  for (let blockIdx = 0; blockIdx < 48; blockIdx++) {
    const startMin = blockIdx * 30;

    // Safety check — sub-15°F air temp is genuinely dangerous
    const blockAirTemp = estimateBlockAirTemp(blockIdx, env);
    const safe = isBlockSafe(blockAirTemp);

    if (!safe) {
      results.push({
        block_index: blockIdx,
        start_local: minutesToHHMM(startMin),
        end_local: minutesToHHMM(startMin + 30),
        score: 0,
        label: "NOT_RECOMMENDED",
        fishable: false,
        drivers: ["dangerously_cold_air_temp"],
      });
      continue;
    }

    // 1. Compute time quality factor (light, solunar, tide)
    const tqf = computeTimeQualityFactor(
      startMin, env, waterType, dawnDusk, rangeStrengthPct, ruleCtx
    );

    // 2. Anchor block score to daily condition quality
    let blockScore = Math.round(baseScore * tqf.factor);
    const drivers = [...tqf.drivers];

    // 3. Apply edge-case biological rules (±score adjustments)
    const tideInfo = waterType !== "freshwater"
      ? getTidePhaseForBlock(startMin, env)
      : { phaseState: null };

    if (ruleCtx) {
      const edgeResult = applyEdgeCaseScoreRules(
        blockScore, startMin, env, waterType, dawnDusk, ruleCtx,
        tideInfo.phaseState, drivers
      );
      blockScore = edgeResult.adjustedScore;
      drivers.length = 0;
      drivers.push(...edgeResult.drivers);
    }

    // 4. Apply biological feeding preference multiplier
    const feedingMult = getFeedingPreferenceForBlock(
      waterType, bioBand, bioMonth, startMin, sunriseMin, sunsetMin
    );
    blockScore = Math.round(blockScore * feedingMult);

    // 5. Clamp and classify
    blockScore = clamp(blockScore, 0, 100);
    const label = classifyBlockFromScore(blockScore, safe);

    results.push({
      block_index: blockIdx,
      start_local: minutesToHHMM(startMin),
      end_local: minutesToHHMM(startMin + 30),
      score: blockScore,
      label,
      fishable: safe,
      drivers,
    });
  }

  return results;
}

/**
 * Merge pre-computed blocks into contiguous time windows.
 * Accepts BlockResult[] directly — no redundant recomputation.
 */
export function computeTimeWindows(
  allBlocks: BlockResult[]
): { best_windows: TimeWindow[]; fair_windows: TimeWindow[]; worst_windows: WorstWindow[] } {
  // Merge contiguous blocks of same label into windows
  const allWindows: TimeWindow[] = [];
  let i = 0;
  while (i < allBlocks.length) {
    const b = allBlocks[i];
    let j = i + 1;
    const mergedDrivers = new Set(b.drivers);
    let maxScore = b.score;

    while (j < allBlocks.length && allBlocks[j].label === b.label) {
      allBlocks[j].drivers.forEach((d: string) => mergedDrivers.add(d));
      maxScore = Math.max(maxScore, allBlocks[j].score);
      j++;
    }

    allWindows.push({
      label: b.label,
      start_local: b.start_local,
      end_local: allBlocks[j - 1].end_local,
      window_score: maxScore,
      drivers: Array.from(mergedDrivers),
    });

    i = j;
  }

  // Split into best (PRIME + GOOD), fair (FAIR), worst (SLOW), and not_recommended
  const best_windows = allWindows.filter(
    (w) => w.label === "PRIME" || w.label === "GOOD"
  );
  const fair_windows = allWindows.filter((w) => w.label === "FAIR");
  const worst_windows: WorstWindow[] = allWindows
    .filter((w) => w.label === "SLOW" || w.label === "NOT_RECOMMENDED")
    .map((w) => ({
      start_local: w.start_local,
      end_local: w.end_local,
      window_score: w.window_score,
      label: w.label,
    }));

  return {
    best_windows,
    fair_windows,
    worst_windows,
  };
}
