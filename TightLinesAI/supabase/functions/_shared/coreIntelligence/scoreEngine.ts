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
  getCoastalBand,
  type CoastalBand,
} from "./seasonalProfiles.ts";
import {
  scoreFromOptimalInterpolated,
  getWaterTempProfile,
  getWindProfile,
  getPressureRateProfile,
  getCloudCoverProfile,
  getTempTrendProfile,
  getTideStrengthProfile,
  scorePrecipFromBaseline,
  type OptimalProfile,
} from "./optimalBaselines.ts";

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

function getProfileWindow(profile: OptimalProfile, month: number, dayOfMonth: number) {
  const idx = Math.max(0, Math.min(11, month - 1));
  const nextIdx = month === 12 ? 0 : idx + 1;
  const prevIdx = month === 1 ? 11 : idx - 1;

  let opt = profile.optimal[idx];
  let sigAbove = profile.sigmaAbove[idx];
  let sigBelow = profile.sigmaBelow[idx];

  if (dayOfMonth <= 10) {
    const t = dayOfMonth / 10;
    opt = lerp(profile.optimal[prevIdx], opt, t);
    sigAbove = lerp(profile.sigmaAbove[prevIdx], sigAbove, t);
    sigBelow = lerp(profile.sigmaBelow[prevIdx], sigBelow, t);
  } else if (dayOfMonth >= 21) {
    const t = (dayOfMonth - 20) / 11;
    opt = lerp(opt, profile.optimal[nextIdx], t);
    sigAbove = lerp(sigAbove, profile.sigmaAbove[nextIdx], t);
    sigBelow = lerp(sigBelow, profile.sigmaBelow[nextIdx], t);
  }

  return { opt, sigAbove, sigBelow };
}

function scoreFromSeasonalRange(
  actual: number,
  profile: OptimalProfile,
  month: number,
  dayOfMonth: number,
  options?: { favorableWidthMultiplier?: number; stressWidthMultiplier?: number; floor?: number }
): number {
  const { opt, sigAbove, sigBelow } = getProfileWindow(profile, month, dayOfMonth);
  const favorableMult = options?.favorableWidthMultiplier ?? 0.65;
  const stressMult = options?.stressWidthMultiplier ?? 2.2;
  const floor = options?.floor ?? 10;

  const favorableHigh = opt + sigAbove * favorableMult;
  const favorableLow = opt - sigBelow * favorableMult;
  const stressHigh = opt + sigAbove * stressMult;
  const stressLow = opt - sigBelow * stressMult;

  if (actual >= favorableLow && actual <= favorableHigh) return 100;

  if (actual > favorableHigh) {
    if (actual >= stressHigh) return floor;
    const t = inverseLerp(actual, favorableHigh, stressHigh);
    return Math.round(lerp(100, floor, t));
  }

  if (actual <= stressLow) return floor;
  const t = inverseLerp(actual, stressLow, favorableLow);
  return Math.round(lerp(floor, 100, t));
}

function computeWaterTempConfidenceScale(confidence: number | null): number {
  if (confidence === null) return 1;
  return clamp(0.55 + confidence * 0.45, 0.6, 1);
}

function scorePrecipOpportunity(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  month: number,
  band: LatitudeBand | CoastalBand
): number | null {
  const current = env.current_precip_in_hr ?? 0;
  const p48 = env.precip_48hr_inches ?? 0;
  const p7 = env.precip_7day_inches ?? 0;
  if (env.current_precip_in_hr === null && env.precip_48hr_inches === null && env.precip_7day_inches === null) {
    return null;
  }

  if (waterType === "saltwater") {
    let score = 82;
    if (current >= 0.6) score -= 26;
    else if (current >= 0.2) score -= 14;
    else if (current > 0) score -= 6;
    if (p48 >= 4) score -= 24;
    else if (p48 >= 2) score -= 12;
    if (p7 >= 8) score -= 10;
    return clamp(Math.round(score), 18, 92);
  }

  if (waterType === "brackish") {
    let score = 78;
    if (current >= 0.5) score -= 18;
    else if (current >= 0.15) score -= 10;
    if (p48 >= 3) score -= 36;
    else if (p48 >= 1.5) score -= 20;
    else if (p48 >= 0.5) score -= 8;
    if (p7 >= 6) score -= 14;
    return clamp(Math.round(score), 5, 90);
  }

  let score = 76;
  // Summer convection can be fishable unless runoff is sustained.
  const summerRelief = month >= 6 && month <= 8 ? 4 : 0;
  if (current >= 0.6) score -= 16;
  else if (current >= 0.2) score -= 8;
  else if (current > 0) score -= 2;
  if (p48 >= 3) score -= 24;
  else if (p48 >= 1.5) score -= 12;
  else if (p48 >= 0.4) score += 6 + summerRelief;
  if (p7 >= 6) score -= 12;
  else if (p7 >= 1 && p7 <= 3.5) score += 4;
  return clamp(Math.round(score), 20, 90);
}

function computeCompositeBandScore(pcts: Array<number | null | undefined>): number | null {
  const valid = pcts.filter((v): v is number => typeof v === "number");
  if (valid.length === 0) return null;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
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
        if (dv.temp_trend_state === "rapid_cooling") basePct += 6;
        else if (dv.temp_trend_state === "stable") basePct += 4;
        else if (dv.temp_trend_state === "cooling") basePct += 5;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 6;
        break;
      case "summer_heat_suppression":
        if (dv.temp_trend_state === "rapid_cooling") basePct += 10;
        else if (dv.temp_trend_state === "cooling") basePct += 10;
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
        if (dv.temp_trend_state === "rapid_cooling") basePct += 6;
        else if (dv.temp_trend_state === "cooling") basePct += 4;
        else if (dv.temp_trend_state === "rapid_warming") basePct -= 6;
        break;
      case "sw_summer_heat_stress":
        if (dv.temp_trend_state === "rapid_cooling") basePct += 10;
        else if (dv.temp_trend_state === "cooling") basePct += 8;
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
// Section 5M-pre — Optimal Baseline Helpers
// ---------------------------------------------------------------------------

/** Fallback: categorical trend state → approximate °F/72h for Gaussian scoring */
const TREND_RATE_FALLBACK: Record<string, number> = {
  rapid_warming: 12,
  warming: 5,
  stable: 0,
  cooling: -5,
  rapid_cooling: -12,
};

/**
 * Apply scaled-down seasonal behavior modifier to the optimal baseline water temp score.
 * The Gaussian baseline already handles 90% of context awareness. These modifiers
 * capture behavioral nuances that go beyond temperature alone:
 * - Spawn fixation (reduced feeding even at optimal temp)
 * - Post-spawn exhaustion
 * - Fall urgency (amplified feeding beyond what temp suggests)
 * - Heat suppression behavioral shutdown
 */
function applySeasonalBehaviorModifier(
  basePct: number,
  dv: DerivedVariables,
  waterType: WaterType,
): number {
  let pct = basePct;

  // Freshwater behavioral modifiers
  if (waterType === "freshwater" && dv.seasonal_fish_behavior !== null) {
    switch (dv.seasonal_fish_behavior) {
      case "spawn_period":
        pct -= 5; // Fish focused on spawning, reduced feeding
        break;
      case "post_spawn_recovery":
        pct -= 8; // Exhausted from spawn, reduced aggression
        break;
      case "summer_heat_suppression":
        if (dv.water_temp_zone === "thermal_stress_heat") pct -= 10;
        else if (dv.water_temp_zone === "peak_aggression") pct -= 5;
        break;
      case "fall_feed_buildup":
        pct += 5; // Pre-winter urgency amplifies feeding
        break;
      case "pre_spawn_buildup":
        pct += 4; // Building energy for spawn
        break;
      case "deep_winter_survival":
        if (dv.water_temp_f !== null && dv.water_temp_f > 34) pct += 3;
        break;
      case "mild_winter_active":
        pct += 3; // Mild enough for continued activity
        break;
    }
  }

  // Saltwater behavioral modifiers
  if (waterType !== "freshwater" && dv.saltwater_seasonal_state !== null) {
    switch (dv.saltwater_seasonal_state) {
      case "sw_summer_heat_stress":
        if (dv.water_temp_zone === "thermal_stress_heat") pct -= 10;
        break;
      case "sw_transitional_feed":
        pct += 4; // Active transition feeding
        break;
      case "sw_cold_mild_active":
        pct += 3; // Mild enough for activity
        break;
    }
  }

  return pct;
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
  seasonal_baseline_score: number;
  daily_opportunity_score: number;
  water_temp_confidence: number | null;
}

// ---------------------------------------------------------------------------
// Solunar / Moon Phase — seasonal sensitivity modifier
// Fish are more metabolically responsive to solunar triggers during
// transitional months (spring/fall pre-spawn, fall feed) and less responsive
// during thermal extremes (deep winter, peak summer heat).
// Returns multiplier 0.85–1.15.
// ---------------------------------------------------------------------------
const SOLUNAR_MONTHLY_SENSITIVITY: number[] = [
  // Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   Oct   Nov   Dec
  0.88, 0.90, 1.08, 1.12, 1.10, 1.00, 0.92, 0.92, 1.08, 1.12, 1.00, 0.90,
];

function getSolunarSeasonalSensitivity(
  month: number,
  waterType: WaterType,
  dv: DerivedVariables
): number {
  let mult = SOLUNAR_MONTHLY_SENSITIVITY[Math.max(0, Math.min(11, month - 1))];

  // Further dampen in extreme thermal zones
  if (dv.water_temp_zone === "near_shutdown_cold") mult *= 0.85;
  else if (dv.water_temp_zone === "thermal_stress_heat") mult *= 0.88;

  // Freshwater seasonal behavior adjustments
  if (waterType === "freshwater" && dv.seasonal_fish_behavior !== null) {
    if (dv.seasonal_fish_behavior === "spawn_period") mult *= 0.90;
    else if (dv.seasonal_fish_behavior === "fall_feed_buildup") mult *= 1.08;
    else if (dv.seasonal_fish_behavior === "pre_spawn_buildup") mult *= 1.05;
  }

  return clamp(mult, 0.85, 1.15);
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

  // Determine band and month for optimal baseline scoring
  const band = seasonalCtx
    ? (waterType === "freshwater"
        ? seasonalCtx.latBand
        : getCoastalBand(seasonalCtx.effectiveLatitude))
    : (waterType === "freshwater" ? "mid" as LatitudeBand : "mid_coast" as CoastalBand);
  const month = seasonalCtx?.month ?? 6;
  const dayOfMonth = seasonalCtx?.dayOfMonth ?? 15;

  // =========================================================================
  // OPTIMAL BASELINE SCORING
  // Each variable scored against its per-month × per-region × per-water-type
  // biological optimal. Score = 100 at optimal, tapering via Gaussian falloff.
  // No context modifiers needed — direction awareness is baked into the optimal.
  // =========================================================================

  const rawPcts: Record<string, number | null> = {};

  // --- PRESSURE: Gaussian on rate (70%) + absolute level (30%) ---
  if (dv.pressure_change_rate_mb_hr !== null || env.pressure_mb !== null) {
    const rateProfile = getPressureRateProfile(waterType, band);
    let rateScore = 50;
    if (dv.pressure_change_rate_mb_hr !== null && rateProfile) {
      rateScore = scoreFromOptimalInterpolated(
        dv.pressure_change_rate_mb_hr, rateProfile, month, dayOfMonth
      );
    }

    let absScore = 50;
    if (env.pressure_mb !== null) {
      // Simple absolute pressure scoring (wide Gaussian, sigma=10 mb)
      const ABS_OPTIMAL = [1016, 1015, 1013, 1012, 1013, 1014, 1015, 1015, 1013, 1012, 1014, 1016];
      const absOpt = ABS_OPTIMAL[Math.max(0, Math.min(11, month - 1))];
      const absDev = env.pressure_mb - absOpt;
      absScore = Math.round(100 * Math.exp(-0.5 * Math.pow(absDev / 10, 2)));
    }

    if (dv.pressure_change_rate_mb_hr !== null && env.pressure_mb !== null) {
      rawPcts.pressure = Math.round(rateScore * 0.7 + absScore * 0.3);
    } else {
      rawPcts.pressure = dv.pressure_change_rate_mb_hr !== null ? rateScore : absScore;
    }
  } else {
    rawPcts.pressure = null;
  }

  // --- LIGHT: dawn/dusk high base, night moderate, midday Gaussian on cloud cover ---
  if (dv.light_condition !== null) {
    const isDawnDusk =
      dv.light_condition === "dawn_window_overcast" ||
      dv.light_condition === "dawn_window_clear" ||
      dv.light_condition === "dusk_window_overcast" ||
      dv.light_condition === "dusk_window_clear";

    if (isDawnDusk) {
      const overcastBonus =
        (dv.light_condition === "dawn_window_overcast" ||
         dv.light_condition === "dusk_window_overcast")
          ? 5 : 0;
      rawPcts.light = Math.min(100, 88 + overcastBonus);
    } else if (dv.light_condition === "night") {
      rawPcts.light = 45;
    } else {
      // Midday: Gaussian optimal cloud cover for this month × region
      const ccProfile = getCloudCoverProfile(waterType, band);
      if (ccProfile && env.cloud_cover_pct !== null) {
        rawPcts.light = scoreFromOptimalInterpolated(
          env.cloud_cover_pct, ccProfile, month, dayOfMonth
        );
      } else {
        rawPcts.light = 40; // fallback
      }
    }
  } else {
    rawPcts.light = null;
  }

  // --- SOLUNAR: categorical + seasonal sensitivity modifier ---
  rawPcts.solunar = scoreSolunar(dv);
  if (rawPcts.solunar !== null) {
    const solunarMult = getSolunarSeasonalSensitivity(month, waterType, dv);
    rawPcts.solunar = clamp(Math.round(rawPcts.solunar * solunarMult), 0, 100);
  }

  // --- WATER TEMP: Gaussian optimal + scaled seasonal behavior modifier ---
  if (dv.water_temp_f !== null) {
    if (dv.cold_stun_alert) {
      rawPcts.water_temp_zone = 0;
    } else {
      const wtProfile = getWaterTempProfile(waterType, band);
      let pct = wtProfile
        ? scoreFromSeasonalRange(dv.water_temp_f, wtProfile, month, dayOfMonth, {
            favorableWidthMultiplier: 0.75,
            stressWidthMultiplier: 2.4,
            floor: waterType === "freshwater" ? 12 : 8,
          })
        : 50;
      // Behavioral modifiers (scaled down — baseline handles most context)
      pct = applySeasonalBehaviorModifier(pct, dv, waterType);
      pct = Math.round(pct * computeWaterTempConfidenceScale(dv.water_temp_confidence));
      rawPcts.water_temp_zone = clamp(pct, 0, 100);
    }
  } else {
    rawPcts.water_temp_zone = null;
  }

  // --- TEMP TREND: Gaussian on trend direction + zone safety modifier ---
  if (dv.temp_trend_state !== null) {
    if (dv.cold_stun_alert) {
      rawPcts.temp_trend = 0;
    } else {
      const trendProfile = getTempTrendProfile(waterType, band);
      const trendF = dv.temp_trend_direction_f
        ?? TREND_RATE_FALLBACK[dv.temp_trend_state]
        ?? 0;
      let pct = trendProfile
        ? scoreFromOptimalInterpolated(trendF, trendProfile, month, dayOfMonth)
        : 50;
      // Zone safety: rapid cooling in near_shutdown_cold = catastrophic
      const zoneModifier = getZoneModifier(dv.temp_trend_state, dv.water_temp_zone);
      pct = Math.round(pct * zoneModifier);
      rawPcts.temp_trend = clamp(pct, 0, 100);
    }
  } else {
    rawPcts.temp_trend = null;
  }

  // --- WIND: Gaussian optimal + extreme-wind cap + wind-tide interaction ---
  if (env.wind_speed_mph !== null) {
    const windProfile = getWindProfile(waterType, band);
    let pct = windProfile
      ? scoreFromOptimalInterpolated(env.wind_speed_mph, windProfile, month, dayOfMonth)
      : 50;

    // Hard cap for extreme wind (25+ mph): dangerous/unfishable
    if (env.wind_speed_mph > 25) {
      pct = Math.min(pct, Math.max(0, 15 - Math.round((env.wind_speed_mph - 25) * 2)));
    }

    // Saltwater wind-tide interaction
    if (waterType !== "freshwater" && env.wind_speed_mph >= 5 && env.wind_speed_mph <= 15) {
      if (dv.wind_tide_relation === "wind_with_tide") pct = Math.min(100, pct + 10);
      else if (dv.wind_tide_relation === "wind_against_tide") pct = Math.max(0, pct - 12);
    }

    rawPcts.wind = pct;
  } else {
    rawPcts.wind = null;
  }

  // --- MOON PHASE: categorical + halved seasonal sensitivity ---
  rawPcts.moon_phase = scoreMoonPhase(dv);
  if (rawPcts.moon_phase !== null) {
    const moonMult = 1 + (getSolunarSeasonalSensitivity(month, waterType, dv) - 1) * 0.5;
    rawPcts.moon_phase = clamp(Math.round(rawPcts.moon_phase * moonMult), 0, 100);
  }

  // --- PRECIPITATION: context-aware categorical from optimal baselines ---
  if (dv.precip_condition !== null) {
    if (dv.salinity_disruption_alert && waterType === "brackish") {
      rawPcts.precipitation = 0;
    } else {
      rawPcts.precipitation = scorePrecipOpportunity(env, waterType, month, band)
        ?? scorePrecipFromBaseline(dv.precip_condition, waterType, band, month);
    }
  } else {
    rawPcts.precipitation = null;
  }

  // --- TIDES (salt/brackish only) ---
  if (waterType !== "freshwater") {
    rawPcts.tide_phase = scoreTidePhase(dv); // categorical, unchanged
    if (dv.range_strength_pct !== null) {
      const tideProfile = getTideStrengthProfile(waterType, band);
      rawPcts.tide_strength = tideProfile
        ? scoreFromOptimalInterpolated(
            dv.range_strength_pct, tideProfile, month, dayOfMonth
          )
        : Math.round(dv.range_strength_pct);
    } else {
      rawPcts.tide_strength = null;
    }
  }

  // =========================================================================
  // WEIGHTED SUM CALCULATION (unchanged)
  // =========================================================================

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
    } else {
      availableWeightPoints += weight;
      const score = toComponentScore(pct, weight);
      components[key] = score;
      scoredPoints += score;

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

  const seasonalBaselineScore = computeCompositeBandScore(
    waterType === "freshwater"
      ? [rawPcts.water_temp_zone, rawPcts.temp_trend, rawPcts.light]
      : [rawPcts.water_temp_zone, rawPcts.light, rawPcts.tide_strength]
  ) ?? rawScore;

  const dailyOpportunityScore = computeCompositeBandScore(
    waterType === "freshwater"
      ? [rawPcts.pressure, rawPcts.wind, rawPcts.precipitation, rawPcts.solunar, rawPcts.moon_phase]
      : [rawPcts.pressure, rawPcts.wind, rawPcts.precipitation, rawPcts.tide_phase, rawPcts.solunar, rawPcts.moon_phase]
  ) ?? rawScore;

  if (waterType === "freshwater" && dv.water_temp_confidence !== null) {
    const confidenceBlend = clamp(dv.water_temp_confidence, 0.45, 0.86);
    rawScore = Math.round(rawScore * (0.78 + confidenceBlend * 0.22));
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
    seasonal_baseline_score: seasonalBaselineScore,
    daily_opportunity_score: dailyOpportunityScore,
    water_temp_confidence: dv.water_temp_confidence,
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
