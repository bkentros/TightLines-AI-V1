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

// ---------------------------------------------------------------------------
// Regional freshwater temperature baselines (°F) by month.
// These represent approximate average lake surface temps for each region.
// Water has massive thermal inertia — it doesn't crash with short cold snaps.
// The baseline anchors the estimate; air temp history MODIFIES the baseline.
// ---------------------------------------------------------------------------

type RegionKey = string;

const REGIONAL_LAKE_BASELINES: Record<RegionKey, number[]> = {
  // Index 0 = Jan, 11 = Dec. Values = approximate avg lake surface temp (°F)
  // Source: USGS/NOAA historical freshwater surface temp data (simplified)
  gulf_florida:               [58, 60, 65, 70, 76, 82, 84, 84, 82, 74, 66, 60],
  southeast_atlantic:         [45, 48, 54, 62, 70, 78, 82, 82, 76, 66, 55, 47],
  mid_atlantic:               [35, 34, 38, 48, 58, 68, 75, 76, 70, 58, 46, 38],
  northeast:                  [33, 33, 34, 42, 52, 64, 72, 74, 66, 54, 42, 35],
  great_lakes_upper_midwest:  [33, 33, 34, 40, 50, 62, 72, 74, 66, 54, 42, 35],
  interior_south_plains:      [42, 44, 50, 58, 66, 76, 82, 82, 76, 64, 52, 44],
  west_southwest:             [42, 44, 48, 54, 60, 68, 74, 76, 70, 60, 50, 44],
};

// River baselines track air more closely (faster turnover, shallower)
const REGIONAL_RIVER_BASELINES: Record<RegionKey, number[]> = {
  gulf_florida:               [56, 58, 62, 68, 74, 80, 82, 82, 80, 72, 64, 58],
  southeast_atlantic:         [42, 45, 50, 58, 66, 74, 78, 78, 72, 62, 52, 44],
  mid_atlantic:               [34, 33, 36, 44, 54, 64, 70, 72, 66, 54, 44, 36],
  northeast:                  [33, 33, 33, 38, 48, 58, 66, 68, 62, 50, 40, 34],
  great_lakes_upper_midwest:  [33, 33, 33, 36, 46, 56, 66, 68, 62, 50, 40, 34],
  interior_south_plains:      [40, 42, 46, 54, 62, 72, 78, 78, 72, 60, 48, 42],
  west_southwest:             [38, 40, 44, 50, 56, 64, 70, 72, 66, 56, 46, 40],
};

function getRegionalBaseline(region: string, month: number, isRiver: boolean): number {
  const table = isRiver ? REGIONAL_RIVER_BASELINES : REGIONAL_LAKE_BASELINES;
  const row = table[region] ?? table['interior_south_plains']; // fallback
  return row[month - 1]; // month is 1-12, index is 0-11
}

export function inferFreshwaterTemp(env: NormalizedEnvironmentV2, ctx: ResolvedContext): number | null {
  const airTemp = env.current.airTempF;
  if (airTemp == null) return null;

  const isRiver = ctx.environmentMode === 'freshwater_river';
  const baseline = getRegionalBaseline(ctx.region, ctx.month, isRiver);

  const highs = env.histories.dailyAirTempHighF?.filter((v): v is number => v != null) ?? [];
  const lows = env.histories.dailyAirTempLowF?.filter((v): v is number => v != null) ?? [];

  if (highs.length < 3 || lows.length < 3) {
    // Not enough history — use regional baseline with small air-temp adjustment
    const airDeviation = airTemp - baseline;
    // Air temp moves faster than water — only apply 30% of the deviation
    const adjustment = airDeviation * 0.30;
    return Math.max(32, Math.round((baseline + adjustment) * 10) / 10);
  }

  // Use up to 14 days of history with equal weighting (per calibration spec)
  // Longer window smooths out short cold/heat spells and reflects thermal inertia
  const recentHighs = highs.slice(-14);
  const recentLows = lows.slice(-14);

  // Equal-weighted average of all available days (up to 14)
  const avgHigh = recentHighs.reduce((a, b) => a + b, 0) / recentHighs.length;
  const avgLow = recentLows.reduce((a, b) => a + b, 0) / recentLows.length;
  const airAvg = avgHigh * 0.6 + avgLow * 0.4;

  // Blend air-temp-derived estimate with regional baseline.
  // The baseline provides stability; air history provides responsiveness.
  // Warmer months = air history matters more (water tracks air better).
  // Colder months = baseline matters more (water has higher inertia).
  const month = ctx.month;
  // Blending weight for air history: higher in summer, lower in winter
  const airWeight = month >= 5 && month <= 9 ? 0.55 : month >= 4 && month <= 10 ? 0.45 : 0.35;
  const baselineWeight = 1.0 - airWeight;

  // Small lag: water always trails air slightly
  const lag = isRiver ? 2 : 3;
  const airDerivedEstimate = airAvg - lag;

  // Blended estimate
  const blended = (airDerivedEstimate * airWeight) + (baseline * baselineWeight);

  const estimated = Math.max(32, blended);
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
