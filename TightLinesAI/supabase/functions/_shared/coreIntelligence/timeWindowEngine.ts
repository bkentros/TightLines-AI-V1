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

// ---------------------------------------------------------------------------
// Section 7A — Resolution: 48 blocks of 30 minutes (00:00–23:30)
// ---------------------------------------------------------------------------

interface Block {
  startMin: number; // minutes since midnight (0, 30, 60, ...)
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

function scoreBlock(
  blockStartMin: number,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  rangeStrengthPct: number | null,
  pressureFalling: boolean,
  cloudCover: number | null,
  ruleCtx: TimeWindowRuleContext | null
): Block {
  let points = 0;
  let maxPoints = 0;
  const drivers: string[] = [];
  const freshwaterTimingProfile = getFreshwaterThermalTimingProfile(
    env,
    waterType,
    ruleCtx?.seasonal_fish_behavior ?? null,
    ruleCtx?.freshwater_subtype ?? env.freshwater_subtype_hint
  );
  const dawnDuskBonus = freshwaterTimingProfile?.dawnDuskBonus ?? 35;

  // Dawn window
  if (
    dawnDusk.dawnStart !== null &&
    dawnDusk.dawnEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.dawnStart, dawnDusk.dawnEnd)
  ) {
    maxPoints += dawnDuskBonus;
    points += dawnDuskBonus;
    drivers.push("dawn_window");
  }

  // Dusk window
  if (
    dawnDusk.duskStart !== null &&
    dawnDusk.duskEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.duskStart, dawnDusk.duskEnd)
  ) {
    maxPoints += dawnDuskBonus;
    points += dawnDuskBonus;
    drivers.push("dusk_window");
  }

  // Cold-season freshwater often improves as shallow water warms into midday.
  if (
    freshwaterTimingProfile &&
    freshwaterTimingProfile.middayWarmBonus > 0 &&
    blockInRange(
      blockStartMin,
      freshwaterTimingProfile.middayWarmStart,
      freshwaterTimingProfile.middayWarmEnd
    )
  ) {
    maxPoints += freshwaterTimingProfile.middayWarmBonus;
    points += freshwaterTimingProfile.middayWarmBonus;
    drivers.push("midday_warming_window");
  }

  // Night block (+5) — after twilight end or before twilight begin
  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  if (twilightEnd !== null && twilightBegin !== null) {
    maxPoints += 5;
    if (blockStartMin >= twilightEnd || blockStartMin + 30 <= twilightBegin) {
      points += 5;
      drivers.push("night_block");
    }
  }

  // Solunar windows
  for (const period of env.solunar_major_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      const addPoints = waterType === "saltwater" ? 8 : 20;
      maxPoints += addPoints;
      if (blockInRange(blockStartMin, s, e)) {
        points += addPoints;
        drivers.push("major_solunar_window");
      }
      break; // score each period once
    }
  }

  for (const period of env.solunar_minor_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      const addPoints = waterType === "saltwater" ? 4 : 12;
      maxPoints += addPoints;
      if (blockInRange(blockStartMin, s, e)) {
        points += addPoints;
        drivers.push("minor_solunar_window");
      }
      break;
    }
  }

  // Tide-based additions (saltwater + brackish only)
  if (waterType !== "freshwater" && env.tide_predictions_today.length >= 2) {
    const { phaseState } = getTidePhaseForBlock(blockStartMin, env);
    maxPoints += 25; // first 2 hours max

    if (phaseState === "incoming_first_2h" || phaseState === "outgoing_first_2h") {
      points += 25;
      drivers.push(
        phaseState === "incoming_first_2h"
          ? "incoming_first_2_hours"
          : "outgoing_first_2_hours"
      );
    } else if (phaseState === "incoming_mid" || phaseState === "outgoing_mid") {
      points += 15;
      drivers.push("mid_tide_movement");
    }

    // Tide strength bonus
    if (rangeStrengthPct !== null) {
      maxPoints += 10;
      if (rangeStrengthPct >= 65) {
        points += 10;
        drivers.push(
          rangeStrengthPct >= 85 ? "strong_tide_strength" : "above_average_tide_strength"
        );
      }
    }
  }

  // Pressure falling (+15)
  maxPoints += 15;
  if (pressureFalling) {
    points += 15;
    drivers.push("pressure_falling");
  }

  // Cloud cover > 60% (+8)
  if (cloudCover !== null) {
    maxPoints += 8;
    if (cloudCover > 60) {
      points += 8;
      drivers.push("overcast_cloud_cover");
    }
  }

  if (maxPoints === 0) {
    return { startMin: blockStartMin, points: 0, maxPoints: 1, drivers: [] };
  }

  return { startMin: blockStartMin, points, maxPoints, drivers };
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

function applyEdgeCaseRules(
  block: Block,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  ruleCtx: TimeWindowRuleContext,
  tidePhaseForBlock: string | null
): Block {
  let points = block.points;
  let maxPoints = block.maxPoints;
  const drivers = [...block.drivers];
  let labelCeiling: WindowLabel | null = null;

  const zone = ruleCtx.water_temp_zone;
  const tempTrend = ruleCtx.temp_trend_state;
  const pressureState = ruleCtx.pressure_state;
  const cloudCover = ruleCtx.cloud_cover_pct;
  const seasonalState = ruleCtx.seasonal_fish_behavior ?? null;
  const season = getMeteoSeason(new Date(env.timestamp_utc).getUTCMonth() + 1);
  const isColdSeason = season === "DJF" || season === "MAM";

  // --- Rule 1: Freshwater Cold-Season Midday Warming (formalization) ---
  // Already in base scoring via getFreshwaterThermalTimingProfile. No change.

  // --- Rule 2: Freshwater Summer Heat Suppression ---
  if (
    waterType === "freshwater" &&
    zone !== null &&
    (zone === "thermal_stress_heat" || zone === "peak_aggression") &&
    isMiddayFullOrPartlyCloudy(block.startMin, dawnDusk, cloudCover)
  ) {
    points -= 18;
    if (!drivers.includes("heat_suppression_midday")) drivers.push("heat_suppression_midday");
  }

  // --- Rule 3: Freshwater Rapid Warming Late-Day Shift ---
  if (
    waterType === "freshwater" &&
    tempTrend !== null &&
    (tempTrend === "rapid_warming" || tempTrend === "warming") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic" || zone === "transitional") &&
    isLateMorningToAfternoon(block.startMin)
  ) {
    points += 12;
    if (!drivers.includes("rapid_warming_late_day_bonus")) drivers.push("rapid_warming_late_day_bonus");
  }

  // --- Rule 4: Freshwater Overcast Extension (cold-season includes near_shutdown/lethargic) ---
  if (
    waterType === "freshwater" &&
    (cloudCover ?? 0) >= 70 &&
    zone !== null &&
    zone !== "thermal_stress_heat" &&
    zone !== "peak_aggression" &&
    (zone !== "near_shutdown_cold" || isColdSeason) &&
    isMiddayBlock(block.startMin, dawnDusk)
  ) {
    points += 8;
    if (!drivers.includes("overcast_extension")) drivers.push("overcast_extension");
  }

  // --- Rule 5: Post-Front Bluebird Compression ---
  if (
    ruleCtx.recovery_active &&
    pressureState !== null &&
    (pressureState === "slowly_rising" || pressureState === "rapidly_rising") &&
    (cloudCover ?? 100) < 50
  ) {
    points -= 10;
    if (!drivers.includes("post_front_compression")) drivers.push("post_front_compression");
    labelCeiling = labelCeiling ?? "GOOD";
  }

  // --- Rule 6: Saltwater Slack-Tide Dominance Cap ---
  if (
    waterType === "saltwater" &&
    (tidePhaseForBlock === "slack" || tidePhaseForBlock === "final_hour")
  ) {
    const rawScore = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
    if (rawScore >= 65) {
      points = Math.floor((maxPoints * 44) / 100);
      if (!drivers.includes("slack_cap_applied")) drivers.push("slack_cap_applied");
    }
  }

  // --- Rule 7: Brackish Runoff / Freshwater Influx Proxy ---
  if (waterType === "brackish" && ruleCtx.salinity_disruption_alert) {
    if (tidePhaseForBlock === "outgoing_first_2h" || tidePhaseForBlock === "outgoing_mid") {
      points -= 15;
      if (!drivers.includes("runoff_outgoing_penalty")) drivers.push("runoff_outgoing_penalty");
    }
    if (tidePhaseForBlock === "incoming_first_2h" || tidePhaseForBlock === "incoming_mid") {
      points += 8;
      if (!drivers.includes("runoff_incoming_preference")) drivers.push("runoff_incoming_preference");
    }
  }

  // --- Rule 8: Cold Inshore / Brackish Midday Warming ---
  if (
    (waterType === "saltwater" || waterType === "brackish") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic") &&
    isMiddayWarmingWindow(block.startMin)
  ) {
    const saltwaterProtectedLike =
      waterType === "brackish" ||
      (waterType === "saltwater" &&
        ruleCtx.range_strength_pct !== null &&
        ruleCtx.range_strength_pct < 65);
    const strongIncoming = tidePhaseForBlock === "incoming_first_2h";
    if (saltwaterProtectedLike && !strongIncoming) {
      points += 10;
      if (!drivers.includes("cold_inshore_midday_warming")) drivers.push("cold_inshore_midday_warming");
    }
  }

  // --- Rule 9: Freshwater state-specific seasonal behavior windows ---
  if (waterType === "freshwater" && seasonalState !== null) {
    const lightCategory = getBlockLightCategory(block.startMin, dawnDusk, cloudCover);

    if (seasonalState === "deep_winter_survival") {
      if (lightCategory === "midday") {
        points += 12;
        if (!drivers.includes("deep_winter_midday_window")) drivers.push("deep_winter_midday_window");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        points -= 8;
        if (!drivers.includes("deep_winter_low_light_penalty")) drivers.push("deep_winter_low_light_penalty");
      }
    }

    if (seasonalState === "pre_spawn_buildup" && isLateMorningToAfternoon(block.startMin)) {
      points += 8;
      if (!drivers.includes("pre_spawn_movement_window")) drivers.push("pre_spawn_movement_window");
    }

    if (seasonalState === "spawn_period") {
      if (lightCategory === "midday") {
        points += 10;
        if (!drivers.includes("spawn_shallow_window")) drivers.push("spawn_shallow_window");
      }
    }

    if (seasonalState === "post_spawn_recovery") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 8;
        if (!drivers.includes("post_spawn_low_light_window")) drivers.push("post_spawn_low_light_window");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 50) {
        points -= 6;
        if (!drivers.includes("post_spawn_midday_penalty")) drivers.push("post_spawn_midday_penalty");
      }
    }

    if (seasonalState === "summer_peak_activity") {
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 6;
        if (!drivers.includes("summer_low_light_feed")) drivers.push("summer_low_light_feed");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 70) {
        points -= 8;
        if (!drivers.includes("summer_midday_bright_penalty")) drivers.push("summer_midday_bright_penalty");
      }
    }

    if (seasonalState === "summer_heat_suppression") {
      if (lightCategory === "midday") {
        points -= 12;
        if (!drivers.includes("summer_heat_midday_penalty")) drivers.push("summer_heat_midday_penalty");
      } else if (lightCategory === "dawn" || lightCategory === "dusk" || lightCategory === "night") {
        points += 6;
        if (!drivers.includes("summer_heat_low_light_relief")) drivers.push("summer_heat_low_light_relief");
      }
    }

    if (seasonalState === "fall_feed_buildup" && isLateMorningToAfternoon(block.startMin)) {
      if (pressureState === "slowly_falling" || pressureState === "rapidly_falling" || (cloudCover ?? 0) >= 40) {
        points += 10;
        if (!drivers.includes("fall_feed_window")) drivers.push("fall_feed_window");
      }
    }

    if (seasonalState === "late_fall_slowdown") {
      if (lightCategory === "midday") {
        points += 10;
        if (!drivers.includes("late_fall_midday_window")) drivers.push("late_fall_midday_window");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        points -= 6;
        if (!drivers.includes("late_fall_low_light_penalty")) drivers.push("late_fall_low_light_penalty");
      }
    }

    if (seasonalState === "mild_winter_active") {
      // Mild winter: all-day viable, slight dawn/dusk preference
      // Solunar, pressure, and tide become primary differentiators
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 4;
        if (!drivers.includes("mild_winter_low_light_window")) drivers.push("mild_winter_low_light_window");
      }
      // No midday penalty — fishing is viable all day
    }
  }

  // --- Rule 10: Saltwater seasonal timing adjustments ---
  if (waterType !== "freshwater" && ruleCtx.saltwater_seasonal_state) {
    const swState = ruleCtx.saltwater_seasonal_state;
    const lightCategory = getBlockLightCategory(block.startMin, dawnDusk, cloudCover);

    if (swState === "sw_cold_inactive") {
      // Winter: midday is better (sun warms shallows)
      if (lightCategory === "midday") {
        points += 8;
        if (!drivers.includes("sw_cold_midday_warming")) drivers.push("sw_cold_midday_warming");
      } else if (lightCategory === "dawn" || lightCategory === "dusk") {
        points -= 4;
      }
    }

    if (swState === "sw_summer_heat_stress") {
      // Summer heat: dawn/dusk/night much better
      if (lightCategory === "dawn" || lightCategory === "dusk") {
        points += 8;
        if (!drivers.includes("sw_summer_low_light_feed")) drivers.push("sw_summer_low_light_feed");
      } else if (lightCategory === "midday" && (cloudCover ?? 0) < 60) {
        points -= 10;
        if (!drivers.includes("sw_summer_heat_midday_penalty")) drivers.push("sw_summer_heat_midday_penalty");
      } else if (lightCategory === "night") {
        points += 5;
        if (!drivers.includes("sw_summer_night_feed")) drivers.push("sw_summer_night_feed");
      }
    }
  }

  points = Math.max(0, points);
  if (labelCeiling === "GOOD") {
    const rawScore = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
    if (rawScore >= 65) points = Math.floor((maxPoints * 64) / 100);
  }

  return { ...block, points, maxPoints, drivers };
}

// ---------------------------------------------------------------------------
// Section 7C — Window Classification
// ---------------------------------------------------------------------------

function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function classifyBlock(block: Block): WindowLabel {
  const score = Math.round((block.points / block.maxPoints) * 100);
  if (score >= 65) return "PRIME";
  if (score >= 45) return "GOOD";
  if (score >= 25) return "FAIR";
  return "SLOW";
}

function getBlockScore(block: Block): number {
  return Math.round((block.points / block.maxPoints) * 100);
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — computeTimeWindows
// ---------------------------------------------------------------------------

export function computeTimeWindows(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  rangeStrengthPct: number | null,
  pressureState: string | null,
  cloudCoverPct: number | null,
  ruleContext?: TimeWindowRuleContext | null
): { best_windows: TimeWindow[]; fair_windows: TimeWindow[]; worst_windows: WorstWindow[] } {
  const dawnDusk = computeDawnDusk(env);
  const pressureFalling =
    pressureState === "slowly_falling" || pressureState === "rapidly_falling";

  const ruleCtx: TimeWindowRuleContext | null = ruleContext ?? null;

  // Score all 48 blocks
  let blocks: Block[] = [];
  for (let startMin = 0; startMin < 24 * 60; startMin += 30) {
    const base = scoreBlock(
      startMin,
      env,
      waterType,
      dawnDusk,
      rangeStrengthPct,
      pressureFalling,
      cloudCoverPct,
      ruleCtx
    );
    const tideInfo = waterType !== "freshwater" ? getTidePhaseForBlock(startMin, env) : { phaseState: null };
    const adjusted = ruleCtx
      ? applyEdgeCaseRules(base, env, waterType, dawnDusk, ruleCtx, tideInfo.phaseState)
      : base;
    blocks.push(adjusted);
  }

  // Classify all blocks (every block gets a label now)
  const scoredBlocks = blocks.map((b) => ({
    ...b,
    label: classifyBlock(b),
    score: getBlockScore(b),
  }));

  // Merge contiguous blocks of same label into windows
  const allWindows: TimeWindow[] = [];
  let i = 0;
  while (i < scoredBlocks.length) {
    const b = scoredBlocks[i];
    let j = i + 1;
    const mergedDrivers = new Set(b.drivers);
    let maxScore = b.score;

    while (j < scoredBlocks.length && scoredBlocks[j].label === b.label) {
      scoredBlocks[j].drivers.forEach((d) => mergedDrivers.add(d));
      maxScore = Math.max(maxScore, scoredBlocks[j].score);
      j++;
    }

    allWindows.push({
      label: b.label,
      start_local: minutesToHHMM(b.startMin),
      end_local: minutesToHHMM(scoredBlocks[j - 1].startMin + 30),
      window_score: maxScore,
      drivers: Array.from(mergedDrivers),
    });

    i = j;
  }

  // Split into best (PRIME + GOOD), fair (FAIR), and worst (SLOW)
  const best_windows = allWindows.filter(
    (w) => w.label === "PRIME" || w.label === "GOOD"
  );
  const fair_windows = allWindows.filter((w) => w.label === "FAIR");
  const worst_windows: WorstWindow[] = allWindows
    .filter((w) => w.label === "SLOW")
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
