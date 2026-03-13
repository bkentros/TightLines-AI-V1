// =============================================================================
// CORE INTELLIGENCE ENGINE — SCORE ENGINE
// Implements Section 5 of core_intelligence_spec.md
// Deterministic component scoring and raw score calculation.
// =============================================================================

import type {
  WaterType,
  LatitudeBand,
  ComponentKey,
  ComponentStatus,
  ReliabilityTier,
  OverallRating,
  DerivedVariables,
  EnvironmentSnapshot,
} from "./types.ts";

import {
  getSeasonalWeights,
  getDeviationBonusPct,
  getCoastalBand,
  type CoastalBand,
} from "./seasonalProfiles.ts";

// ---------------------------------------------------------------------------
// Helper math functions (Section 5B)
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function inverseLerp(value: number, min: number, max: number): number {
  return clamp((value - min) / (max - min), 0, 1);
}

// component_score = round((component_pct / 100) * component_weight)
function toComponentScore(componentPct: number, weight: number): number {
  return Math.round((componentPct / 100) * weight);
}

// ---------------------------------------------------------------------------
// Section 5A — Weight Tables
// ---------------------------------------------------------------------------

export const FRESHWATER_WEIGHTS: Record<string, number> = {
  water_temp_zone: 24,
  pressure: 22,
  light: 18,
  temp_trend: 12,
  solunar: 10,
  wind: 8,
  moon_phase: 3,
  precipitation: 3,
};

export const SALTWATER_WEIGHTS: Record<string, number> = {
  tide_phase: 20,
  tide_strength: 17,
  water_temp_zone: 19,
  pressure: 14,
  wind: 8,
  light: 8,
  temp_trend: 6,
  solunar: 4,
  moon_phase: 2,
  precipitation: 2,
};

export const BRACKISH_WEIGHTS: Record<string, number> = {
  water_temp_zone: 18,
  tide_phase: 17,
  pressure: 15,
  tide_strength: 12,
  light: 10,
  temp_trend: 8,
  solunar: 8,
  wind: 7,
  precipitation: 3,
  moon_phase: 2,
};

/** Legacy fallback — returns static weights when no seasonal context is available. */
export function getWeights(waterType: WaterType): Record<string, number> {
  if (waterType === "freshwater") return FRESHWATER_WEIGHTS;
  if (waterType === "saltwater") return SALTWATER_WEIGHTS;
  return BRACKISH_WEIGHTS;
}

/** Seasonal-aware weight lookup with monthly interpolation. */
export function getSeasonalWeightsForScore(
  waterType: WaterType,
  latBand: LatitudeBand,
  effectiveLatitude: number,
  month: number,
  dayOfMonth: number,
  year?: number
): Record<string, number> {
  const band: LatitudeBand | CoastalBand =
    waterType === "freshwater" ? latBand : getCoastalBand(effectiveLatitude);
  return getSeasonalWeights(waterType, band, month, dayOfMonth, year);
}

// ---------------------------------------------------------------------------
// Section 5C — Barometric Pressure Scoring
// ---------------------------------------------------------------------------

function getStablePressureScore(currentMb: number): number {
  if (currentMb < 1010) {
    const t = inverseLerp(1010 - currentMb, 0, 10);
    return Math.round(lerp(50, 69, t));
  }
  if (currentMb <= 1018) {
    const t = inverseLerp(currentMb, 1010, 1018);
    return Math.round(lerp(60, 48, t));
  }
  const t = inverseLerp(currentMb, 1018, 1030);
  return Math.round(lerp(56, 40, t));
}

function scorePressure(dv: DerivedVariables, env: EnvironmentSnapshot): number | null {
  const rate = dv.pressure_change_rate_mb_hr;
  const current = env.pressure_mb;
  if (rate === null || current === null) return null;

  // Rapidly falling (rate < -1.5)
  if (rate < -1.5) {
    const t = inverseLerp(Math.abs(rate), 1.5, 3.0);
    return Math.round(lerp(90, 100, t));
  }

  // Clearly slowly falling (rate < -0.6)
  if (rate < -0.6) {
    const t = inverseLerp(Math.abs(rate), 0.6, 1.5);
    return Math.round(lerp(70, 89, t));
  }

  // Blend zone: slowly_falling → stable (rate -0.6 to -0.4)
  if (rate < -0.4) {
    const fallingScore = 70;
    const stableScore = getStablePressureScore(current);
    const t = inverseLerp(rate, -0.6, -0.4);
    return Math.round(lerp(fallingScore, stableScore, t));
  }

  // Stable zone (rate -0.4 to +0.4)
  if (rate <= 0.4) {
    return getStablePressureScore(current);
  }

  // Blend zone: stable → slowly_rising (rate +0.4 to +0.6)
  if (rate <= 0.6) {
    const stableScore = getStablePressureScore(current);
    const risingScore = 39;
    const t = inverseLerp(rate, 0.4, 0.6);
    return Math.round(lerp(stableScore, risingScore, t));
  }

  // Clearly slowly rising (rate +0.6 to +1.5)
  if (rate <= 1.5) {
    const t = inverseLerp(rate, 0.6, 1.5);
    return Math.round(lerp(39, 20, t));
  }

  // Rapidly rising (rate > 1.5)
  const t = inverseLerp(rate, 1.5, 3.0);
  return Math.round(lerp(19, 0, t));
}

// ---------------------------------------------------------------------------
// Section 5D — Light Condition Scoring
// ---------------------------------------------------------------------------

const LIGHT_SCORE_MAP: Record<string, number> = {
  dawn_window_overcast: 100,
  dusk_window_overcast: 98,
  dawn_window_clear: 84,
  dusk_window_clear: 82,
  midday_overcast: 60,
  night: 52,
  midday_partly_cloudy: 40,
  midday_full_sun: 12,
};

function scoreLight(dv: DerivedVariables, cloudCoverPct: number | null): number | null {
  if (dv.light_condition === null) return null;
  const cc = cloudCoverPct ?? 0;

  // Non-midday conditions: use fixed scores (no cloud transitions)
  if (
    dv.light_condition === "dawn_window_overcast" ||
    dv.light_condition === "dusk_window_overcast" ||
    dv.light_condition === "dawn_window_clear" ||
    dv.light_condition === "dusk_window_clear" ||
    dv.light_condition === "night"
  ) {
    return LIGHT_SCORE_MAP[dv.light_condition] ?? null;
  }

  // Midday conditions: interpolate in transition zones
  // Zone 1: cc 30-40 → blend full_sun (12) and partly_cloudy (40)
  if (cc >= 30 && cc < 40) {
    const t = (cc - 30) / 10;
    return Math.round(lerp(12, 40, t));
  }

  // Zone 2: cc 65-75 → blend partly_cloudy (40) and overcast (60)
  if (cc >= 65 && cc < 75) {
    const t = (cc - 65) / 10;
    return Math.round(lerp(40, 60, t));
  }

  // Outside transition zones: use categorical score
  return LIGHT_SCORE_MAP[dv.light_condition] ?? null;
}

// ---------------------------------------------------------------------------
// Section 5E — Solunar Scoring
// ---------------------------------------------------------------------------

const SOLUNAR_SCORE_MAP: Record<string, number> = {
  within_major_window: 95,
  within_30min_of_major: 75,
  within_60min_of_major: 40,    // smooth transition
  within_90min_of_major: 20,    // smooth transition
  within_minor_window: 58,
  within_30min_of_minor: 35,
  within_60min_of_minor: 18,    // smooth transition
  outside_all_windows: 8,
};

function scoreSolunar(dv: DerivedVariables): number | null {
  if (dv.solunar_state === null) return null;
  return SOLUNAR_SCORE_MAP[dv.solunar_state] ?? null;
}

// ---------------------------------------------------------------------------
// Section 5F — Tide Phase Scoring
// ---------------------------------------------------------------------------

const TIDE_PHASE_SCORE_MAP: Record<string, number> = {
  incoming_first_2_hours: 96,
  outgoing_first_2_hours: 92,
  incoming_mid: 74,
  outgoing_mid: 70,
  final_hour_before_slack: 32,
  slack: 5,
};

function scoreTidePhase(dv: DerivedVariables): number | null {
  if (dv.tide_phase_state === null) return null;
  return TIDE_PHASE_SCORE_MAP[dv.tide_phase_state] ?? null;
}

// ---------------------------------------------------------------------------
// Section 5G — Tide Strength Scoring
// ---------------------------------------------------------------------------

function scoreTideStrength(dv: DerivedVariables): number | null {
  if (dv.range_strength_pct === null) return null;
  return Math.round(dv.range_strength_pct);
}

// ---------------------------------------------------------------------------
// Section 5H — Water Temperature Absolute Zone Scoring
// ---------------------------------------------------------------------------

const ZONE_BOUNDS: Record<
  WaterType,
  Partial<Record<string, [number, number]>>
> = {
  freshwater: {
    lethargic: [36, 48],
    transitional: [48, 58],
    active_prime: [58, 72],
    peak_aggression: [72, 82],
  },
  saltwater: {
    lethargic: [50, 60],
    transitional: [60, 68],
    active_prime: [68, 80],
    peak_aggression: [80, 88],
  },
  brackish: {
    lethargic: [48, 58],
    transitional: [58, 66],
    active_prime: [66, 78],
    peak_aggression: [78, 86],
  },
};

function scoreWaterTempZone(
  dv: DerivedVariables,
  waterType: WaterType
): number | null {
  if (dv.water_temp_zone === null || dv.water_temp_f === null) return null;
  if (dv.cold_stun_alert) return 0;

  const zone = dv.water_temp_zone;

  let pct: number | null = null;

  // Freshwater cold-season: cold water in winter is expected; score higher than cold_shock
  const coldContext = dv.freshwater_cold_context;
  if (waterType === "freshwater" && (zone === "near_shutdown_cold" || zone === "lethargic")) {
    if (coldContext === "seasonally_expected_cold") {
      if (zone === "near_shutdown_cold") {
        // Interpolate within near_shutdown_cold: 30% at 32°F → 44% at ~36°F
        const waterTemp = dv.water_temp_f ?? 33;
        const minTemp = 32;
        const maxTemp = 36;
        const minPct = 30;
        const maxPct = 44;
        pct = minPct + ((Math.max(minTemp, Math.min(maxTemp, waterTemp)) - minTemp) / (maxTemp - minTemp)) * (maxPct - minPct);
        pct = Math.round(pct);
      }
      // lethargic: boost range to 45–62 so winter cold is viable
      const bounds = ZONE_BOUNDS[waterType][zone];
      if (bounds && zone === "lethargic") {
        const [lo, hi] = bounds;
        const progress = inverseLerp(dv.water_temp_f, lo, hi);
        pct = Math.round(lerp(45, 62, progress));
      }
    }
    if (coldContext === "cold_shock") {
      if (zone === "near_shutdown_cold") pct = 8;
    }
  }

  if (pct === null) {
    if (zone === "near_shutdown_cold") {
      // Interpolate: 5% at 32°F → 20% at ~36°F (non-seasonal or non-freshwater)
      const waterTemp = dv.water_temp_f ?? 33;
      pct = Math.round(5 + ((Math.max(32, Math.min(36, waterTemp)) - 32) / 4) * 15);
    }
    else if (zone === "thermal_stress_heat") pct = 28;
    else {
      const bounds = ZONE_BOUNDS[waterType][zone];
      if (!bounds) return null;

      const [lo, hi] = bounds;
      const progress = inverseLerp(dv.water_temp_f, lo, hi);

      if (zone === "lethargic") pct = Math.round(lerp(25, 42, progress));
      else if (zone === "transitional") pct = Math.round(lerp(50, 67, progress));
      else if (zone === "active_prime") pct = Math.round(lerp(75, 92, progress));
      else if (zone === "peak_aggression") pct = Math.round(lerp(83, 100, progress));
      else return null;
    }
  }

  if (waterType !== "freshwater" || dv.seasonal_fish_behavior === null) {
    // Saltwater/Brackish seasonal scoring
    if (waterType !== "freshwater" && dv.saltwater_seasonal_state !== null) {
      switch (dv.saltwater_seasonal_state) {
        case "sw_cold_inactive":
          if (zone === "near_shutdown_cold") pct += 10;
          else if (zone === "lethargic") pct += 8;
          else if (zone === "transitional") pct -= 4;
          break;
        case "sw_cold_mild_active":
          if (zone === "near_shutdown_cold") pct += 14;
          else if (zone === "lethargic") pct += 10;
          else if (zone === "transitional") pct += 6;
          else if (zone === "active_prime") pct += 4;
          break;
        case "sw_transitional_feed":
          if (zone === "transitional") pct += 10;
          else if (zone === "active_prime") pct += 12;
          break;
        case "sw_summer_peak":
          if (zone === "active_prime") pct += 8;
          else if (zone === "peak_aggression") pct += 6;
          else if (zone === "thermal_stress_heat") pct -= 8;
          break;
        case "sw_summer_heat_stress":
          if (zone === "peak_aggression") pct -= 8;
          else if (zone === "thermal_stress_heat") pct -= 16;
          break;
      }
    }
    return clamp(pct, 0, 100);
  }

  switch (dv.seasonal_fish_behavior) {
    case "deep_winter_survival":
      if (zone === "near_shutdown_cold") pct += 12;
      else if (zone === "lethargic") pct += 10;
      else if (zone === "transitional") pct -= 6;
      break;
    case "pre_spawn_buildup":
      if (zone === "transitional") pct += 8;
      else if (zone === "active_prime") pct += 10;
      else if (zone === "near_shutdown_cold") pct -= 6;
      break;
    case "spawn_period":
      if (zone === "transitional") pct += 6;
      else if (zone === "active_prime") pct += 8;
      else if (zone === "peak_aggression") pct -= 4;
      break;
    case "post_spawn_recovery":
      if (zone === "active_prime") pct += 4;
      else if (zone === "peak_aggression") pct -= 8;
      break;
    case "summer_peak_activity":
      if (zone === "active_prime") pct += 8;
      else if (zone === "peak_aggression") pct += 6;
      else if (zone === "thermal_stress_heat") pct -= 8;
      break;
    case "summer_heat_suppression":
      if (zone === "peak_aggression") pct -= 10;
      else if (zone === "thermal_stress_heat") pct -= 18;
      break;
    case "fall_feed_buildup":
      if (zone === "transitional") pct += 10;
      else if (zone === "active_prime") pct += 12;
      else if (zone === "near_shutdown_cold") pct += 4;
      break;
    case "late_fall_slowdown":
      if (zone === "near_shutdown_cold") pct += 10;
      else if (zone === "lethargic") pct += 8;
      else if (zone === "transitional") pct += 3;
      break;
    case "mild_winter_active":
      if (zone === "near_shutdown_cold") pct += 15;
      else if (zone === "lethargic") pct += 12;
      else if (zone === "transitional") pct += 8;
      else if (zone === "active_prime") pct += 6;
      break;
  }

  return clamp(pct, 0, 100);
}

// ---------------------------------------------------------------------------
// Section 5I — Temperature Trend Scoring
// ---------------------------------------------------------------------------

const TEMP_TREND_BASE_PCT: Record<string, number> = {
  rapid_warming: 94,
  warming: 75,
  stable: 60,
  cooling: 43,
  rapid_cooling: 90,
};

function getZoneModifier(
  trendState: string,
  zone: string | null
): number {
  if (zone === null) return 1.0;

  if (trendState === "rapid_cooling") {
    if (zone === "active_prime" || zone === "peak_aggression") return 1.0;
    if (zone === "transitional") return 0.70;
    if (zone === "lethargic") return 0.25;
    if (zone === "near_shutdown_cold") return 0.05;
    return 1.0;
  }

  if (trendState === "rapid_warming") {
    if (zone === "lethargic" || zone === "transitional") return 1.0;
    if (zone === "active_prime") return 0.80;
    if (zone === "thermal_stress_heat") return 0.10;
    return 1.0;
  }

  if (trendState === "stable") {
    if (zone === "active_prime" || zone === "peak_aggression") return 1.0;
    if (zone === "lethargic" || zone === "near_shutdown_cold") return 0.40;
    return 1.0;
  }

  if (trendState === "cooling") {
    if (zone === "active_prime") return 0.85;
    if (zone === "transitional") return 0.70;
    if (zone === "lethargic" || zone === "near_shutdown_cold") return 0.35;
    return 1.0;
  }

  return 1.0;
}

function scoreTempTrend(dv: DerivedVariables): number | null {
  if (dv.temp_trend_state === null) return null;
  if (dv.cold_stun_alert) return 0;

  let basePct = TEMP_TREND_BASE_PCT[dv.temp_trend_state] ?? 60;

  if (dv.seasonal_fish_behavior !== null) {
    switch (dv.seasonal_fish_behavior) {
      case "deep_winter_survival":
        if (dv.temp_trend_state === "rapid_warming") basePct += 10;
        else if (dv.temp_trend_state === "warming") basePct += 8;
        else if (dv.temp_trend_state === "stable") basePct += 4;
        else if (dv.temp_trend_state === "cooling") basePct -= 12;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 22;
        break;
      case "pre_spawn_buildup":
        if (dv.temp_trend_state === "rapid_warming") basePct += 8;
        else if (dv.temp_trend_state === "warming") basePct += 6;
        else if (dv.temp_trend_state === "cooling") basePct -= 6;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 14;
        break;
      case "spawn_period":
        if (dv.temp_trend_state === "stable") basePct += 8;
        else if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 4;
        break;
      case "post_spawn_recovery":
        if (dv.temp_trend_state === "stable") basePct += 5;
        else if (dv.temp_trend_state === "cooling") basePct -= 8;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 12;
        break;
      case "summer_peak_activity":
        if (dv.temp_trend_state === "stable") basePct += 4;
        else if (dv.temp_trend_state === "cooling") basePct += 5;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 6;
        break;
      case "summer_heat_suppression":
        if (dv.temp_trend_state === "cooling") basePct += 10;
        else if (dv.temp_trend_state === "warming") basePct -= 10;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 18;
        else if (dv.temp_trend_state === "stable") basePct -= 6;
        break;
      case "fall_feed_buildup":
        if (dv.temp_trend_state === "cooling") basePct += 12;
        else if (dv.temp_trend_state === "rapid_cooling") basePct += 6;
        else if (dv.temp_trend_state === "stable") basePct += 5;
        else if (dv.temp_trend_state === "warming") basePct -= 6;
        break;
      case "late_fall_slowdown":
        if (dv.temp_trend_state === "rapid_warming") basePct += 6;
        else if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "cooling") basePct -= 10;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 18;
        break;
      case "mild_winter_active":
        if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct += 2;
        else if (dv.temp_trend_state === "cooling") basePct -= 4;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 8;
        break;
    }
  }

  // Saltwater seasonal trend modifiers
  if (dv.saltwater_seasonal_state !== null) {
    switch (dv.saltwater_seasonal_state) {
      case "sw_cold_inactive":
        if (dv.temp_trend_state === "rapid_warming") basePct += 10;
        else if (dv.temp_trend_state === "warming") basePct += 6;
        else if (dv.temp_trend_state === "cooling") basePct -= 8;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 14;
        break;
      case "sw_cold_mild_active":
        if (dv.temp_trend_state === "warming") basePct += 4;
        else if (dv.temp_trend_state === "rapid_cooling") basePct -= 6;
        break;
      case "sw_transitional_feed":
        if (dv.temp_trend_state === "stable") basePct += 4;
        break;
      case "sw_summer_peak":
        if (dv.temp_trend_state === "cooling") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 6;
        break;
      case "sw_summer_heat_stress":
        if (dv.temp_trend_state === "cooling") basePct += 8;
        else if (dv.temp_trend_state === "warming") basePct -= 8;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 14;
        break;
    }
  }

  const modifier = getZoneModifier(dv.temp_trend_state, dv.water_temp_zone);
  return Math.round((clamp(basePct, 0, 100) / 100) * modifier * 100);
}

// ---------------------------------------------------------------------------
// Section 5J — Wind Scoring
// ---------------------------------------------------------------------------

function scoreWind(
  dv: DerivedVariables,
  env: EnvironmentSnapshot,
  waterType: WaterType
): number | null {
  if (env.wind_speed_mph === null) return null;

  const speed = env.wind_speed_mph;

  if (waterType === "freshwater") {
    if (speed >= 5 && speed <= 12) return 92;
    if (speed <= 4) return 65;
    if (speed <= 20) return 62;
    return Math.max(0, Math.round(40 - Math.min(speed - 20, 16) * 2.5));
  }

  // Saltwater / brackish
  const rel = dv.wind_tide_relation;

  if (speed > 20) {
    return Math.max(0, Math.round(20 - Math.min(speed - 20, 15) * 1.33));
  }
  if (speed <= 4) return 54;
  if (speed >= 5 && speed <= 12) {
    if (rel === "wind_with_tide") return 92;
    if (rel === "wind_against_tide") return 58;
    return 75;
  }
  // 13–20
  if (rel === "wind_with_tide") return 55;
  if (rel === "wind_against_tide") return 22;
  return 39;
}

// ---------------------------------------------------------------------------
// Section 5K — Moon Phase Scoring
// ---------------------------------------------------------------------------

const MOON_PHASE_SCORE_MAP: Record<string, number> = {
  new_moon: 95,
  full_moon: 95,
  waxing_or_waning_gibbous: 70,
  first_or_third_quarter: 40,
  waxing_or_waning_crescent: 20,
};

function scoreMoonPhase(dv: DerivedVariables): number | null {
  if (dv.moon_phase === null) return null;
  return MOON_PHASE_SCORE_MAP[dv.moon_phase] ?? null;
}

// ---------------------------------------------------------------------------
// Section 5L — Precipitation Scoring
// ---------------------------------------------------------------------------

const PRECIP_SCORE_FW: Record<string, number> = {
  light_rain: 92,
  no_precip_stable: 52,
  moderate_rain: 45,
  post_light_rain_clearing: 54,
  heavy_rain: 10,
  post_heavy_rain_48hr: 6,
};

const PRECIP_SCORE_SW: Record<string, number> = {
  no_precip: 62,
  current_rain_any_intensity: 58,
  post_major_storm: 30,
  extreme_storm_surge: 5,
};

const PRECIP_SCORE_BK: Record<string, number> = {
  no_precip_stable: 62,
  light_rain: 60,
  moderate_rain: 35,
  heavy_rain: 8,
  post_heavy_rain_48hr: 5,
  post_light_rain_clearing: 60,
};

function scorePrecipitation(
  dv: DerivedVariables,
  waterType: WaterType
): number | null {
  if (dv.precip_condition === null) return null;
  if (dv.salinity_disruption_alert && waterType === "brackish") return 0;

  const cond = dv.precip_condition;

  if (waterType === "freshwater") return PRECIP_SCORE_FW[cond] ?? null;
  if (waterType === "saltwater") return PRECIP_SCORE_SW[cond] ?? null;
  return PRECIP_SCORE_BK[cond] ?? null;
}

// ---------------------------------------------------------------------------
// Section 5M — Raw Score Formula
// ---------------------------------------------------------------------------

export interface ComponentScores {
  weights: Record<string, number>;
  component_status: Record<string, ComponentStatus>;
  components: Record<string, number>;
  coverage_pct: number;
  reliability_tier: ReliabilityTier;
  raw_score: number;
}

export interface SeasonalContext {
  month: number;
  dayOfMonth: number;
  year: number;
  latBand: LatitudeBand;
  effectiveLatitude: number;
}

export function computeRawScore(
  env: EnvironmentSnapshot,
  dv: DerivedVariables,
  waterType: WaterType,
  seasonalCtx?: SeasonalContext
): ComponentScores {
  // Use seasonal weights when context is available, otherwise fall back to static
  const weights = seasonalCtx
    ? getSeasonalWeightsForScore(
        waterType,
        seasonalCtx.latBand,
        seasonalCtx.effectiveLatitude,
        seasonalCtx.month,
        seasonalCtx.dayOfMonth,
        seasonalCtx.year
      )
    : getWeights(waterType);

  // Compute raw component percentages
  const rawPcts: Record<string, number | null> = {
    pressure: scorePressure(dv, env),
    light: scoreLight(dv, env.cloud_cover_pct),
    solunar: scoreSolunar(dv),
    water_temp_zone: scoreWaterTempZone(dv, waterType),
    temp_trend: scoreTempTrend(dv),
    wind: scoreWind(dv, env, waterType),
    moon_phase: scoreMoonPhase(dv),
    precipitation: scorePrecipitation(dv, waterType),
  };

  // Tide components only for salt/brackish
  if (waterType !== "freshwater") {
    rawPcts.tide_phase = scoreTidePhase(dv);
    rawPcts.tide_strength = scoreTideStrength(dv);
  }

  // Apply water temp deviation bonus when seasonal context is available
  if (seasonalCtx && rawPcts.water_temp_zone !== null && dv.water_temp_f !== null) {
    const band = waterType === "freshwater"
      ? seasonalCtx.latBand
      : getCoastalBand(seasonalCtx.effectiveLatitude);
    const deviationPct = getDeviationBonusPct(
      waterType, band, seasonalCtx.month, dv.water_temp_f
    );
    rawPcts.water_temp_zone = clamp(
      rawPcts.water_temp_zone + deviationPct, 0, 100
    );
  }

  const componentStatus: Record<string, ComponentStatus> = {};
  const components: Record<string, number> = {};
  let availableWeightPoints = 0;
  let totalPossibleWeightPoints = 0;
  let scoredPoints = 0;

  for (const [key, weight] of Object.entries(weights)) {
    totalPossibleWeightPoints += weight;
    const pct = rawPcts[key];

    if (pct === null || pct === undefined) {
      componentStatus[key] = "unavailable";
      // Excluded from denominator
    } else {
      availableWeightPoints += weight;
      const score = toComponentScore(pct, weight);
      components[key] = score;
      scoredPoints += score;

      // Determine status
      const isFallback =
        key === "water_temp_zone" &&
        (dv.water_temp_source === "freshwater_air_model" ||
          dv.water_temp_source === "noaa_ndbc" ||
          dv.water_temp_source === "marine_sst");

      componentStatus[key] = isFallback ? "fallback_used" : "available";
    }
  }

  let rawScore = 0;
  if (availableWeightPoints === 0) {
    rawScore = 0;
  } else {
    rawScore = Math.round((scoredPoints / availableWeightPoints) * 100);
  }

  const coveragePct = Math.round(
    (availableWeightPoints / Math.max(totalPossibleWeightPoints, 1)) * 100
  );

  let reliabilityTier: ReliabilityTier;
  if (availableWeightPoints === 0) reliabilityTier = "very_low_confidence";
  else if (coveragePct >= 85) reliabilityTier = "high";
  else if (coveragePct >= 70) reliabilityTier = "degraded";
  else if (coveragePct >= 50) reliabilityTier = "low_confidence";
  else reliabilityTier = "very_low_confidence";

  return {
    weights,
    component_status: componentStatus,
    components,
    coverage_pct: coveragePct,
    reliability_tier: reliabilityTier,
    raw_score: rawScore,
  };
}

// ---------------------------------------------------------------------------
// Section 5N — Raw Score Interpretation
// ---------------------------------------------------------------------------

export function getOverallRating(score: number): OverallRating {
  if (score >= 88) return "Exceptional";
  if (score >= 72) return "Excellent";
  if (score >= 55) return "Good";
  if (score >= 38) return "Fair";
  if (score >= 20) return "Poor";
  return "Tough";
}

// Re-export getZoneModifier for use in behavior inference
export { getZoneModifier };
