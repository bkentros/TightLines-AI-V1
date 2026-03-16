// =============================================================================
// ENGINE V2 — Thermal Assessment
//
// Evaluates fish comfort relative to water temperature.
// Non-species-specific — operates on broad activity comfort zones.
//
// Rules:
// - Manual freshwater temp → highest confidence, full score resolution
// - Inferred freshwater temp → confidence-penalized output
// - Measured salt/brackish temp → high confidence
// - No temp available → neutral pass-through, claim guard active
//
// Does NOT:
// - Claim exact depths
// - Claim spawn stages
// - Reference specific species
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
  ReliabilitySummary,
} from '../types/contracts.ts';

// ---------------------------------------------------------------------------
// Broad comfort zones by environment mode family
// These are the non-species-specific activity comfort ranges (°F).
// The engine does not guarantee species-specific precision.
// ---------------------------------------------------------------------------

interface ThermalBand {
  /** Temps below this = significant cold stress / metabolic shutdown */
  coldStressFloor: number;
  /** Lower bound of broad comfort zone */
  comfortLow: number;
  /** Peak activity sweet spot — center of comfort */
  peakLow: number;
  peakHigh: number;
  /** Upper bound of broad comfort zone */
  comfortHigh: number;
  /** Above this = heat stress begins */
  heatStressFloor: number;
  /** Above this = significant heat suppression */
  severeHeatFloor: number;
}

// Freshwater broad warmwater/coolwater mix (lake and river)
// Represents a population-level comfort envelope across common species in
// each region — not tuned to a single target species.
const FRESHWATER_THERMAL_BAND: ThermalBand = {
  coldStressFloor: 40,   // Below 40°F: fish highly inactive
  comfortLow: 50,        // 50°F: activity picking up
  peakLow: 60,           // 60–72°F: broad activity sweet spot
  peakHigh: 72,
  comfortHigh: 82,       // 82°F: still fishable but warmth is a factor
  heatStressFloor: 84,   // 84°F+: stress begins for most species
  severeHeatFloor: 90,   // 90°F+: significant suppression
};

// Saltwater and brackish — inshore/coastal species run warmer overall
const COASTAL_THERMAL_BAND: ThermalBand = {
  coldStressFloor: 45,
  comfortLow: 55,
  peakLow: 65,
  peakHigh: 80,
  comfortHigh: 85,
  heatStressFloor: 87,
  severeHeatFloor: 92,
};

function getBand(ctx: ResolvedContext): ThermalBand {
  return ctx.isFreshwater ? FRESHWATER_THERMAL_BAND : COASTAL_THERMAL_BAND;
}

// ---------------------------------------------------------------------------
// Seasonal state modifiers
// The seasonal state shifts which part of the curve matters most.
// ---------------------------------------------------------------------------

interface SeasonalThermalModifier {
  /** Additional penalty multiplier when below comfortLow (e.g. deep winter penalizes harder) */
  coldPenaltyMult: number;
  /** Additional penalty multiplier when above heatStressFloor */
  heatPenaltyMult: number;
  /** Bonus score when in peak zone during a feeding-season state */
  peakBonus: number;
}

function getSeasonalModifier(ctx: ResolvedContext): SeasonalThermalModifier {
  switch (ctx.seasonalState) {
    case 'deep_winter':
      return { coldPenaltyMult: 1.4, heatPenaltyMult: 0.5, peakBonus: 0 };
    case 'winter_transition':
      return { coldPenaltyMult: 1.2, heatPenaltyMult: 0.6, peakBonus: 5 };
    case 'spring_warming':
      return { coldPenaltyMult: 0.9, heatPenaltyMult: 0.7, peakBonus: 8 };
    case 'spawn_window_broad':
      return { coldPenaltyMult: 1.1, heatPenaltyMult: 0.8, peakBonus: 10 };
    case 'post_spawn_broad':
      return { coldPenaltyMult: 0.8, heatPenaltyMult: 0.9, peakBonus: 5 };
    case 'stable_summer':
      return { coldPenaltyMult: 0.7, heatPenaltyMult: 1.0, peakBonus: 8 };
    case 'summer_heat_stress':
      return { coldPenaltyMult: 0.5, heatPenaltyMult: 1.5, peakBonus: 0 };
    case 'early_fall_feed':
      return { coldPenaltyMult: 0.8, heatPenaltyMult: 1.1, peakBonus: 12 };
    case 'late_fall_cooling':
      return { coldPenaltyMult: 1.1, heatPenaltyMult: 0.6, peakBonus: 5 };
    // Coastal states
    case 'coastal_cold_slow':
      return { coldPenaltyMult: 1.3, heatPenaltyMult: 0.5, peakBonus: 0 };
    case 'coastal_cold_but_active':
      return { coldPenaltyMult: 0.9, heatPenaltyMult: 0.5, peakBonus: 6 };
    case 'coastal_transition_feed':
      return { coldPenaltyMult: 0.8, heatPenaltyMult: 0.8, peakBonus: 10 };
    case 'coastal_stable_warm':
      return { coldPenaltyMult: 0.6, heatPenaltyMult: 1.0, peakBonus: 8 };
    case 'coastal_heat_stress':
      return { coldPenaltyMult: 0.5, heatPenaltyMult: 1.6, peakBonus: 0 };
    default:
      return { coldPenaltyMult: 1.0, heatPenaltyMult: 1.0, peakBonus: 0 };
  }
}

// ---------------------------------------------------------------------------
// Core temperature-to-score curve
// Produces a 0–100 raw score from a temperature reading relative to a band.
// ---------------------------------------------------------------------------

function tempToRawScore(tempF: number, band: ThermalBand, seasonal: SeasonalThermalModifier): number {
  // Severe heat suppression
  if (tempF >= band.severeHeatFloor) {
    const overshoot = tempF - band.severeHeatFloor;
    return Math.max(0, 20 - overshoot * 3 * seasonal.heatPenaltyMult);
  }

  // Heat stress zone
  if (tempF >= band.heatStressFloor) {
    const penetration = (tempF - band.heatStressFloor) / (band.severeHeatFloor - band.heatStressFloor);
    return Math.max(20, 50 - penetration * 30 * seasonal.heatPenaltyMult);
  }

  // Peak comfort zone — full marks + seasonal bonus
  if (tempF >= band.peakLow && tempF <= band.peakHigh) {
    return Math.min(100, 80 + seasonal.peakBonus);
  }

  // Upper transition (comfort but not peak)
  if (tempF > band.peakHigh && tempF < band.heatStressFloor) {
    const span = band.heatStressFloor - band.peakHigh;
    const dist = tempF - band.peakHigh;
    const fade = dist / span;
    return Math.round(80 - fade * 30);
  }

  // Lower transition (warming toward comfort)
  if (tempF >= band.comfortLow && tempF < band.peakLow) {
    const span = band.peakLow - band.comfortLow;
    const dist = tempF - band.comfortLow;
    const ramp = dist / span;
    return Math.round(50 + ramp * 30 + seasonal.peakBonus * ramp);
  }

  // Cold stress approach (below comfort but above floor)
  if (tempF >= band.coldStressFloor && tempF < band.comfortLow) {
    const span = band.comfortLow - band.coldStressFloor;
    const dist = tempF - band.coldStressFloor;
    const ramp = dist / span;
    const base = 20 + ramp * 30;
    return Math.max(0, Math.round(base - (1 - ramp) * 10 * seasonal.coldPenaltyMult));
  }

  // Below cold stress floor
  const drop = band.coldStressFloor - tempF;
  return Math.max(0, Math.round(20 - drop * 4 * seasonal.coldPenaltyMult));
}

// ---------------------------------------------------------------------------
// Build human-readable state label
// ---------------------------------------------------------------------------

function buildStateLabel(tempF: number, band: ThermalBand): string {
  if (tempF < band.coldStressFloor) return 'cold_stress';
  if (tempF < band.comfortLow) return 'below_comfort';
  if (tempF < band.peakLow) return 'warming_toward_comfort';
  if (tempF <= band.peakHigh) return 'peak_comfort';
  if (tempF < band.heatStressFloor) return 'above_peak_still_comfortable';
  if (tempF < band.severeHeatFloor) return 'heat_stress';
  return 'severe_heat';
}

// ---------------------------------------------------------------------------
// Build driver / suppressor tags
// ---------------------------------------------------------------------------

function buildThermalTags(label: string, source: string): string[] {
  switch (label) {
    case 'peak_comfort':
      return source === 'manual_user_entered'
        ? ['confirmed_comfortable_water_temp', 'peak_activity_range']
        : ['water_temp_in_comfort_range', 'broad_activity_support'];
    case 'above_peak_still_comfortable':
      return ['water_temp_warm_but_fishable', 'activity_possible'];
    case 'warming_toward_comfort':
      return ['water_temp_improving', 'below_ideal_but_trending_positive'];
    case 'below_comfort':
      return ['cool_water', 'reduced_fish_activity'];
    case 'cold_stress':
      return ['cold_water_stress', 'significantly_reduced_metabolic_activity'];
    case 'heat_stress':
      return ['heat_stress', 'fish_seeking_cooler_water'];
    case 'severe_heat':
      return ['severe_heat_stress', 'major_activity_suppression'];
    default:
      return ['water_temp_evaluated'];
  }
}

// ---------------------------------------------------------------------------
// Freshwater temperature inference model
// More realistic than the Phase 3 stub (airTemp - 5).
// Uses recent daily high/low history to build a lagged water temp estimate.
// ---------------------------------------------------------------------------

export function inferFreshwaterTemp(env: NormalizedEnvironmentV2, ctx: ResolvedContext): number | null {
  const airTemp = env.current.airTempF;
  if (airTemp == null) return null;

  const highs = env.histories.dailyAirTempHighF?.filter((v): v is number => v != null) ?? [];
  const lows = env.histories.dailyAirTempLowF?.filter((v): v is number => v != null) ?? [];

  if (highs.length < 3 || lows.length < 3) {
    // Not enough history — use simple conservative lag
    const conservativeLag = ctx.environmentMode === 'freshwater_river' ? 3 : 6;
    return Math.max(32, airTemp - conservativeLag);
  }

  // Use last 5 days of history (most recent = index at end)
  const recentHighs = highs.slice(-5);
  const recentLows = lows.slice(-5);
  const avgRecent = recentHighs.reduce((a, b) => a + b, 0) / recentHighs.length * 0.6 +
                    recentLows.reduce((a, b) => a + b, 0) / recentLows.length * 0.4;

  // Water lags air, and rivers lag less than lakes (faster turnover)
  // Lake/pond: ~6–10°F lag in spring, closer in summer, more in winter
  // River: ~3–5°F lag (faster exchange with air)
  const monthBasedLag = (() => {
    const month = ctx.month; // 1-12
    if (month <= 2 || month === 12) return ctx.environmentMode === 'freshwater_river' ? 8 : 14; // Dec/Jan/Feb deep winter
    if (month === 3 || month === 11) return ctx.environmentMode === 'freshwater_river' ? 5 : 10; // late fall / early spring shoulder
    if (month <= 4) return ctx.environmentMode === 'freshwater_river' ? 3 : 7;  // early spring (April)
    if (month <= 6) return ctx.environmentMode === 'freshwater_river' ? 2 : 4;  // late spring
    if (month <= 8) return ctx.environmentMode === 'freshwater_river' ? 1 : 2;  // summer (close)
    if (month <= 9) return ctx.environmentMode === 'freshwater_river' ? 2 : 5;  // early fall
    return ctx.environmentMode === 'freshwater_river' ? 4 : 8; // mid-late fall (Oct)
  })();

  const estimated = Math.max(32, avgRecent - monthBasedLag);
  return Math.round(estimated * 10) / 10;
}

// ---------------------------------------------------------------------------
// Main thermal assessment function
// ---------------------------------------------------------------------------

export function assessThermal(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext,
  reliability: ReliabilitySummary
): SingleAssessment {
  // Get the effective water temperature and its source
  let waterTempF: number | null = null;
  let tempSource: string = 'unavailable';

  if (ctx.isFreshwater) {
    if (env.userOverrides.manualFreshwaterWaterTempF != null) {
      waterTempF = env.userOverrides.manualFreshwaterWaterTempF;
      tempSource = 'manual_user_entered';
    } else {
      waterTempF = inferFreshwaterTemp(env, ctx);
      tempSource = waterTempF != null ? 'inferred_freshwater' : 'unavailable';
    }
  } else {
    // Saltwater / brackish: measured source only
    if (env.marine.measuredWaterTempF != null) {
      waterTempF = env.marine.measuredWaterTempF;
      tempSource = 'measured_coastal';
    }
  }

  // No temperature data available
  if (waterTempF == null) {
    return {
      componentScore: 50, // neutral pass-through — can't assess
      stateLabel: 'no_water_temp_data',
      dominantTags: ['water_temp_unavailable'],
      direction: 'neutral',
      confidenceDependency: 'very_low',
      applicable: true,
    };
  }

  const band = getBand(ctx);
  const seasonal = getSeasonalModifier(ctx);
  const rawScore = tempToRawScore(waterTempF, band, seasonal);
  const stateLabel = buildStateLabel(waterTempF, band);
  const tags = buildThermalTags(stateLabel, tempSource);

  // Apply confidence penalty for inferred temp
  let finalScore = rawScore;
  if (tempSource === 'inferred_freshwater') {
    // Inferred temps pull toward neutral (50) proportional to uncertainty
    const confidencePull = 1.0 - reliability.waterTempConfidence;
    const pullStrength = 0.25 * confidencePull; // max 25% pull toward neutral
    finalScore = Math.round(rawScore * (1 - pullStrength) + 50 * pullStrength);
  }

  // Clamp to 0–100
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine direction for score composition
  const direction = finalScore >= 65 ? 'positive' : finalScore <= 38 ? 'negative' : 'neutral';

  // Severe states override to negative regardless
  const isSevereSuppressor = stateLabel === 'cold_stress' || stateLabel === 'severe_heat';

  return {
    componentScore: finalScore,
    stateLabel,
    dominantTags: tags,
    direction: isSevereSuppressor ? 'negative' : direction,
    confidenceDependency: tempSource === 'manual_user_entered' ? 'high'
      : tempSource === 'measured_coastal' ? 'high'
      : tempSource === 'inferred_freshwater' ? 'moderate'
      : 'very_low',
    applicable: true,
  };
}
