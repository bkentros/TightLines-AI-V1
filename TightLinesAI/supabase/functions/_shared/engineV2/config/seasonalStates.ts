// =============================================================================
// ENGINE V2 CONFIG — Seasonal States
// Seasonal-state resolution from region + month + temperature context.
// Month alone is not the truth — seasonal-state is the engine truth.
// =============================================================================

import type {
  Region,
  EnvironmentMode,
  FreshwaterSeasonalState,
  CoastalSeasonalState,
  SeasonalState,
} from '../types/contracts.ts';

/**
 * Resolves a freshwater seasonal state from region + month + temperature context.
 * Temperature adjusts the month-based inference.
 * All parameters approximate; the engine can override with temp-trend signals later.
 */
export function resolveFreshwaterSeasonalState(
  region: Region,
  month: number,
  avgAirTempF?: number | null
): FreshwaterSeasonalState {
  const warmBias = avgAirTempF != null && avgAirTempF > 80;
  const coldBias = avgAirTempF != null && avgAirTempF < 45;

  // Gulf / Florida — warmer year-round, earlier spring, later fall
  if (region === 'gulf_florida') {
    if (month === 12 || month === 1) return 'winter_transition';
    if (month === 2 || month === 3) return 'spring_warming';
    if (month === 4) return 'spawn_window_broad';
    if (month === 5) return 'post_spawn_broad';
    if (month === 6 || month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9 || month === 10) return 'early_fall_feed';
    if (month === 11) return 'late_fall_cooling';
    return 'stable_summer';
  }

  // Southeast Atlantic — warm but with a real winter
  if (region === 'southeast_atlantic') {
    if (month === 12 || month === 1 || month === 2) {
      return coldBias ? 'deep_winter' : 'winter_transition';
    }
    if (month === 3) return 'spring_warming';
    if (month === 4) return 'spawn_window_broad';
    if (month === 5) return 'post_spawn_broad';
    if (month === 6 || month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9 || month === 10) return 'early_fall_feed';
    if (month === 11) return 'late_fall_cooling';
    return 'winter_transition';
  }

  // Mid-Atlantic — four distinct seasons
  if (region === 'mid_atlantic') {
    if (month === 12 || month === 1 || month === 2) {
      return coldBias ? 'deep_winter' : 'winter_transition';
    }
    if (month === 3) return 'winter_transition';
    if (month === 4) return 'spring_warming';
    if (month === 5) return 'spawn_window_broad';
    if (month === 6) return 'post_spawn_broad';
    if (month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9) return 'early_fall_feed';
    if (month === 10 || month === 11) return 'late_fall_cooling';
    return 'deep_winter';
  }

  // Northeast — cold winters, compressed spring
  if (region === 'northeast') {
    if (month === 12 || month === 1 || month === 2 || month === 3) return 'deep_winter';
    if (month === 4) return 'winter_transition';
    if (month === 5) return 'spring_warming';
    if (month === 6) return 'spawn_window_broad';
    if (month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9 || month === 10) return 'early_fall_feed';
    if (month === 11) return 'late_fall_cooling';
    return 'deep_winter';
  }

  // Great Lakes / Upper Midwest — similar to Northeast, slightly warmer interior summers
  if (region === 'great_lakes_upper_midwest') {
    if (month === 12 || month === 1 || month === 2 || month === 3) return 'deep_winter';
    if (month === 4) return 'winter_transition';
    if (month === 5) return 'spring_warming';
    if (month === 6) return 'spawn_window_broad';
    if (month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9 || month === 10) return 'early_fall_feed';
    if (month === 11) return 'late_fall_cooling';
    return 'deep_winter';
  }

  // Interior South / Plains — variable; similar to southeast with more temperature extremes
  if (region === 'interior_south_plains') {
    if (month === 12 || month === 1 || month === 2) {
      return coldBias ? 'deep_winter' : 'winter_transition';
    }
    if (month === 3) return 'spring_warming';
    if (month === 4) return 'spawn_window_broad';
    if (month === 5) return 'post_spawn_broad';
    if (month === 6 || month === 7 || month === 8) {
      return warmBias ? 'summer_heat_stress' : 'stable_summer';
    }
    if (month === 9 || month === 10) return 'early_fall_feed';
    if (month === 11) return 'late_fall_cooling';
    return 'winter_transition';
  }

  // West / Southwest — highly variable; use a conservative default
  if (month === 12 || month === 1 || month === 2) {
    return coldBias ? 'deep_winter' : 'winter_transition';
  }
  if (month === 3 || month === 4) return 'spring_warming';
  if (month === 5) return 'spawn_window_broad';
  if (month === 6) return 'post_spawn_broad';
  if (month === 7 || month === 8) {
    return warmBias ? 'summer_heat_stress' : 'stable_summer';
  }
  if (month === 9 || month === 10) return 'early_fall_feed';
  if (month === 11) return 'late_fall_cooling';
  return 'winter_transition';
}

/**
 * Resolves a coastal (salt/brackish) seasonal state from region + month + water temp context.
 */
export function resolveCoastalSeasonalState(
  region: Region,
  month: number,
  waterTempF?: number | null
): CoastalSeasonalState {
  const waterWarm = waterTempF != null && waterTempF > 78;
  const waterCold = waterTempF != null && waterTempF < 55;
  const waterMild = waterTempF != null && waterTempF >= 55 && waterTempF <= 78;

  // Gulf / Florida — relatively mild year-round
  if (region === 'gulf_florida') {
    if (month === 12 || month === 1 || month === 2) {
      return waterCold ? 'coastal_cold_slow' : 'coastal_cold_but_active';
    }
    if (month === 3 || month === 4 || month === 5) return 'coastal_transition_feed';
    if (month === 6 || month === 7 || month === 8 || month === 9) {
      return waterWarm ? 'coastal_heat_stress' : 'coastal_stable_warm';
    }
    if (month === 10 || month === 11) return 'coastal_transition_feed';
    return 'coastal_stable_warm';
  }

  // Southeast Atlantic
  if (region === 'southeast_atlantic') {
    if (month === 12 || month === 1 || month === 2) {
      return waterCold ? 'coastal_cold_slow' : 'coastal_cold_but_active';
    }
    if (month === 3 || month === 4) return 'coastal_transition_feed';
    if (month === 5 || month === 6 || month === 7 || month === 8 || month === 9) {
      return waterWarm ? 'coastal_heat_stress' : 'coastal_stable_warm';
    }
    if (month === 10 || month === 11) return 'coastal_transition_feed';
    return 'coastal_cold_but_active';
  }

  // Mid-Atlantic and Northeast — colder winters, compressed warm season
  if (region === 'mid_atlantic' || region === 'northeast') {
    if (month === 12 || month === 1 || month === 2 || month === 3) return 'coastal_cold_slow';
    if (month === 4 || month === 5) return 'coastal_transition_feed';
    if (month === 6 || month === 7 || month === 8) {
      return waterWarm ? 'coastal_heat_stress' : 'coastal_stable_warm';
    }
    if (month === 9 || month === 10) return 'coastal_transition_feed';
    if (month === 11) return 'coastal_cold_but_active';
    return 'coastal_cold_slow';
  }

  // Default for other regions
  if (month >= 6 && month <= 9) return waterWarm ? 'coastal_heat_stress' : 'coastal_stable_warm';
  if (month >= 3 && month <= 5) return 'coastal_transition_feed';
  if (month >= 10 && month <= 11) return 'coastal_transition_feed';
  return waterCold ? 'coastal_cold_slow' : 'coastal_cold_but_active';
}

/**
 * Top-level seasonal state resolver that routes to freshwater or coastal.
 */
export function resolveSeasonalState(
  mode: EnvironmentMode,
  region: Region,
  month: number,
  avgAirTempF?: number | null,
  waterTempF?: number | null
): SeasonalState {
  if (mode === 'freshwater_lake' || mode === 'freshwater_river') {
    return resolveFreshwaterSeasonalState(region, month, avgAirTempF);
  }
  return resolveCoastalSeasonalState(region, month, waterTempF);
}

export const FRESHWATER_SEASONAL_STATE_LABELS: Record<FreshwaterSeasonalState, string> = {
  deep_winter: 'Deep Winter',
  winter_transition: 'Winter Transition',
  spring_warming: 'Spring Warming',
  spawn_window_broad: 'Spawn Window',
  post_spawn_broad: 'Post-Spawn',
  stable_summer: 'Stable Summer',
  summer_heat_stress: 'Summer Heat Stress',
  early_fall_feed: 'Early Fall Feed',
  late_fall_cooling: 'Late Fall Cooling',
};

export const COASTAL_SEASONAL_STATE_LABELS: Record<CoastalSeasonalState, string> = {
  coastal_cold_slow: 'Cold Slow',
  coastal_cold_but_active: 'Cold But Active',
  coastal_transition_feed: 'Transition Feed',
  coastal_stable_warm: 'Stable Warm',
  coastal_heat_stress: 'Heat Stress',
};
