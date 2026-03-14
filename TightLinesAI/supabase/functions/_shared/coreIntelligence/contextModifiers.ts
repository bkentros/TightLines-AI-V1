// =============================================================================
// @deprecated — SUPERSEDED BY optimalBaselines.ts
// This file's delta-based context modifiers have been replaced by the Gaussian
// optimal baseline system. All scoring context is now handled via per-month ×
// per-region × per-water-type optimal profiles with asymmetric sigma tolerances.
// This file is no longer imported by any module. Kept for reference only.
// =============================================================================
//
// CONTEXT-AWARE COMPONENT SCORE MODIFIERS (LEGACY)
//
// Adjusts raw component percentages based on month × region × water type.
// Applied after base scoring, before weighting.
//
// Each modifier returns a delta (-40 to +40) added to the base component pct.
// The calling code clamps the result to [0, 100].
//
// Biology basis:
// - Light: midday sun in winter = good (warms water, activates feeding)
//          midday sun in summer = bad (thermal stress, fish seek shade)
// - Wind: summer wind = dissolved oxygen boost (fish more active)
//         winter wind = wind chill / cooling = negative
// - Precip: spring/fall light rain = insect hatches = excellent
//           winter rain = cold shock risk
//           summer rain = cooling relief OR runoff disruption
// =============================================================================

import type { LatitudeBand, WaterType, LightCondition } from "./types.ts";
import type { CoastalBand } from "./seasonalProfiles.ts";

type Band = LatitudeBand | CoastalBand;

// ---------------------------------------------------------------------------
// Light Context Modifier
// ---------------------------------------------------------------------------
// Base scores: dawn/dusk ~82-100, midday_overcast 60, midday_partly_cloudy 40, midday_full_sun 12
// Problem: midday sun scored 12 everywhere. In winter at northern latitudes,
// midday sun is the BEST time to fish (warming water activates sluggish fish).

// month → delta for midday_full_sun by band
// Positive = midday sun is better than base score suggests
// Negative = midday sun is even worse than base score (already low)
const MIDDAY_SUN_DELTA: Record<Band, number[]> = {
  // Freshwater bands — month 1-12 (index 0 = Jan)
  far_north:  [+38, +36, +30, +20, +10,  -5, -10, -10,  +5, +18, +30, +38],
  north:      [+35, +32, +25, +15,  +5,  -8, -12, -12,   0, +12, +25, +35],
  mid:        [+28, +24, +18,  +8,   0, -10, -15, -15,  -5,  +5, +18, +28],
  south:      [+18, +15, +10,   0,  -5, -15, -18, -18, -10,   0, +10, +18],
  deep_south: [+12, +10,  +5,  -5, -10, -18, -20, -20, -12,  -5,  +5, +12],
  // Coastal bands
  north_coast: [+32, +28, +22, +12,  +5,  -6, -10, -10,   0, +10, +22, +32],
  mid_coast:   [+20, +16, +10,   0,  -5, -12, -15, -15,  -8,   0, +10, +20],
  south_coast: [+10,  +8,  +2,  -5, -10, -18, -20, -20, -12,  -5,  +2, +10],
};

// midday_partly_cloudy also needs adjustment (base = 40)
const MIDDAY_PARTLY_CLOUDY_DELTA: Record<Band, number[]> = {
  far_north:  [+20, +18, +15, +10,  +5,  -2,  -5,  -5,  +3, +10, +15, +20],
  north:      [+18, +16, +12,  +8,  +3,  -4,  -6,  -6,   0,  +6, +12, +18],
  mid:        [+14, +12,  +8,  +4,   0,  -5,  -8,  -8,  -2,  +2,  +8, +14],
  south:      [+10,  +8,  +5,   0,  -2,  -8, -10, -10,  -5,   0,  +5, +10],
  deep_south: [ +6,  +5,  +2,  -2,  -5, -10, -12, -12,  -6,  -2,  +2,  +6],
  north_coast:[+16, +14, +10,  +6,  +2,  -3,  -5,  -5,   0,  +4, +10, +16],
  mid_coast:  [+10,  +8,  +5,   0,  -2,  -6,  -8,  -8,  -4,   0,  +5, +10],
  south_coast:[ +5,  +4,  +1,  -3,  -5, -10, -12, -12,  -6,  -3,  +1,  +5],
};

// midday_overcast (base = 60): winter overcast is less good than it looks
// (no warming), summer overcast is better than it looks (cooling relief)
const MIDDAY_OVERCAST_DELTA: Record<Band, number[]> = {
  far_north:  [-10,  -8,  -5,   0,  +3,  +8, +10, +10,  +5,   0,  -5, -10],
  north:      [ -8,  -6,  -3,   0,  +2,  +6,  +8,  +8,  +4,   0,  -3,  -8],
  mid:        [ -5,  -4,  -2,   0,  +2,  +5,  +7,  +7,  +3,   0,  -2,  -5],
  south:      [ -3,  -2,   0,  +2,  +3,  +6,  +8,  +8,  +4,  +2,   0,  -3],
  deep_south: [ -2,  -1,   0,  +3,  +5,  +8, +10, +10,  +6,  +3,   0,  -2],
  north_coast:[ -6,  -5,  -3,   0,  +2,  +5,  +7,  +7,  +3,   0,  -3,  -6],
  mid_coast:  [ -3,  -2,   0,  +2,  +3,  +6,  +8,  +8,  +4,  +2,   0,  -3],
  south_coast:[ -1,   0,  +1,  +3,  +5,  +8, +10, +10,  +6,  +3,  +1,  -1],
};

export function getLightContextDelta(
  lightCondition: LightCondition | null,
  band: Band,
  month: number,
): number {
  if (lightCondition === null) return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (lightCondition === "midday_full_sun") {
    return MIDDAY_SUN_DELTA[band]?.[idx] ?? 0;
  }
  if (lightCondition === "midday_partly_cloudy") {
    return MIDDAY_PARTLY_CLOUDY_DELTA[band]?.[idx] ?? 0;
  }
  if (lightCondition === "midday_overcast") {
    return MIDDAY_OVERCAST_DELTA[band]?.[idx] ?? 0;
  }

  // Dawn/dusk/night scores are already good — minimal seasonal adjustment
  // Dawn in winter slightly more valuable (compressed feeding window)
  if (lightCondition === "dawn_window_clear" || lightCondition === "dawn_window_overcast") {
    // Winter dawn bonus for northern bands
    const winterDawnBonus: Record<Band, number[]> = {
      far_north:  [+5, +4, +2, 0, 0, 0, 0, 0, 0, +1, +3, +5],
      north:      [+4, +3, +2, 0, 0, 0, 0, 0, 0, +1, +2, +4],
      mid:        [+2, +2, +1, 0, 0, 0, 0, 0, 0, 0, +1, +2],
      south:      [+1, +1, 0, 0, 0, 0, 0, 0, 0, 0, 0, +1],
      deep_south: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      north_coast:[+3, +3, +1, 0, 0, 0, 0, 0, 0, +1, +2, +3],
      mid_coast:  [+1, +1, 0, 0, 0, 0, 0, 0, 0, 0, 0, +1],
      south_coast:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    return winterDawnBonus[band]?.[idx] ?? 0;
  }

  return 0;
}

// (Old WIND_DO_DELTA removed — replaced by getWindSeasonDelta below which covers
// all wind speeds: calm, moderate, and high, with full month × region context)

// ---------------------------------------------------------------------------
// Precipitation Context Modifier
// ---------------------------------------------------------------------------
// Spring/fall light rain → insect hatches, higher feeding activity
// Summer rain → cooling relief (good if hot), runoff (bad if heavy)
// Winter rain → cold shock risk, generally negative

// Applied to freshwater light_rain (base 92) and moderate_rain (base 45)
const LIGHT_RAIN_DELTA_FW: Record<LatitudeBand, number[]> = {
  far_north:  [-8, -6, +2, +6, +8, +5, +3, +3, +6, +4, -2, -8],
  north:      [-6, -4, +3, +7, +8, +4, +2, +2, +6, +5, 0, -6],
  mid:        [-4, -2, +4, +8, +6, +3, 0, 0, +5, +6, +2, -4],
  south:      [-2, 0, +5, +6, +4, +2, -2, -2, +3, +5, +3, -2],
  deep_south: [0, +1, +4, +5, +3, 0, -3, -3, +2, +4, +3, 0],
};

// Moderate rain: summer = cooling relief, winter = bad
const MOD_RAIN_DELTA_FW: Record<LatitudeBand, number[]> = {
  far_north:  [-10, -8, -4, 0, +2, +5, +8, +8, +4, 0, -4, -10],
  north:      [-8, -6, -2, +1, +3, +6, +8, +8, +5, +1, -2, -8],
  mid:        [-6, -4, 0, +2, +4, +7, +10, +10, +6, +2, 0, -6],
  south:      [-4, -2, +1, +3, +5, +8, +10, +10, +7, +3, +1, -4],
  deep_south: [-2, 0, +2, +4, +6, +8, +10, +10, +8, +4, +2, -2],
};

export function getPrecipContextDelta(
  precipCondition: string | null,
  waterType: WaterType,
  band: Band,
  month: number,
): number {
  if (precipCondition === null) return 0;
  if (waterType !== "freshwater") return 0; // saltwater precip already simple
  const idx = Math.max(0, Math.min(11, month - 1));

  if (precipCondition === "light_rain") {
    return LIGHT_RAIN_DELTA_FW[band as LatitudeBand]?.[idx] ?? 0;
  }
  if (precipCondition === "moderate_rain") {
    return MOD_RAIN_DELTA_FW[band as LatitudeBand]?.[idx] ?? 0;
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Temp Trend Context Modifier (Phase 1D integration)
// ---------------------------------------------------------------------------
// rapid_warming base = 94: great in cold months, bad in hot months
// rapid_cooling base = 90: terrible in cold months, can be OK in hot months
// These are ADDITIONAL to the seasonal_fish_behavior adjustments already in scoreEngine.

const RAPID_WARMING_DELTA: Record<Band, number[]> = {
  // Cold months: rapid warming is excellent (activates metabolism)
  // Hot months: rapid warming is terrible (thermal stress, DO crash)
  far_north:  [+6, +5, +3, 0, -2, -10, -14, -14, -6, +1, +3, +6],
  north:      [+5, +4, +2, 0, -3, -10, -14, -14, -6, 0, +2, +5],
  mid:        [+4, +3, +1, 0, -4, -12, -16, -16, -8, -1, +1, +4],
  south:      [+2, +2, 0, -2, -6, -14, -18, -18, -10, -3, 0, +2],
  deep_south: [+1, +1, -1, -4, -8, -16, -20, -20, -12, -5, -1, +1],
  north_coast:[+4, +3, +2, 0, -2, -8, -12, -12, -5, 0, +2, +4],
  mid_coast:  [+2, +2, 0, -1, -4, -10, -14, -14, -8, -2, 0, +2],
  south_coast:[0, 0, -1, -3, -6, -14, -18, -18, -10, -4, -1, 0],
};

const RAPID_COOLING_DELTA: Record<Band, number[]> = {
  // Cold months: rapid cooling is devastating (already cold → shutdown)
  // Hot months: rapid cooling can trigger feeding frenzy (relief from heat)
  far_north:  [-20, -18, -12, -6, 0, +4, +8, +8, +2, -4, -10, -20],
  north:      [-18, -16, -10, -4, 0, +5, +8, +8, +3, -3, -8, -18],
  mid:        [-14, -12, -8, -2, +1, +6, +10, +10, +4, -1, -6, -14],
  south:      [-10, -8, -5, 0, +2, +8, +12, +12, +6, +1, -4, -10],
  deep_south: [-8, -6, -3, +1, +4, +10, +14, +14, +8, +3, -2, -8],
  north_coast:[-16, -14, -8, -3, 0, +5, +8, +8, +3, -2, -6, -16],
  mid_coast:  [-10, -8, -4, 0, +2, +7, +10, +10, +5, +1, -3, -10],
  south_coast:[-6, -4, -2, +1, +4, +8, +12, +12, +6, +2, -1, -6],
};

export function getTempTrendContextDelta(
  tempTrendState: string | null,
  band: Band,
  month: number,
): number {
  if (tempTrendState === null) return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (tempTrendState === "rapid_warming") {
    return RAPID_WARMING_DELTA[band]?.[idx] ?? 0;
  }
  if (tempTrendState === "rapid_cooling") {
    return RAPID_COOLING_DELTA[band]?.[idx] ?? 0;
  }

  // Stability bonus: stable temps in comfortable months = slight bonus
  if (tempTrendState === "stable") {
    // Comfortable months get a small stability bonus
    const stabilityBonus: number[] = [+2, +2, +3, +4, +4, +2, +1, +1, +3, +4, +3, +2];
    return stabilityBonus[idx] ?? 0;
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Pressure Context Modifier
// ---------------------------------------------------------------------------
// Barometric pressure is universally important, but the MAGNITUDE of fish
// response varies by season × region × water type.
//
// Biology:
// - Spring spawn / fall feed-up: fish metabolically primed, pressure drops
//   trigger aggressive feeding (high multiplier on falling pressure score)
// - Deep winter: sluggish metabolism, pressure changes produce muted response
//   (dampen both falling bonus and rising penalty)
// - Peak summer: pre-storm pressure drops trigger intense short feeding bursts
// - Stable pressure in comfortable months = slightly better than in extreme months

// For FALLING pressure: positive = even better, negative = falling matters less
const PRESSURE_FALLING_DELTA: Record<Band, number[]> = {
  // Deep winter: dampen falling bonus (fish too sluggish to respond as much)
  // Spring/fall: amplify (fish metabolically primed)
  // Summer: moderate boost (pre-storm feeding bursts)
  far_north:  [-12, -10, -4, +6, +8, +4, +2, +2, +6, +8, -2, -12],
  north:      [-10, -8, -2, +5, +7, +4, +3, +3, +6, +7, -1, -10],
  mid:        [-6, -4, 0, +4, +5, +3, +4, +4, +5, +5, 0, -6],
  south:      [-3, -2, +2, +4, +4, +3, +5, +5, +4, +4, +1, -3],
  deep_south: [-1, 0, +3, +3, +3, +4, +5, +5, +4, +3, +2, -1],
  north_coast:[-8, -6, -1, +5, +6, +4, +3, +3, +5, +6, -1, -8],
  mid_coast:  [-4, -2, +1, +4, +4, +3, +4, +4, +4, +4, +1, -4],
  south_coast:[-1, 0, +2, +3, +3, +4, +5, +5, +4, +3, +2, -1],
};

// For RISING pressure: negative = even worse, positive = rising less bad
const PRESSURE_RISING_DELTA: Record<Band, number[]> = {
  // Deep winter: rising is less punishing (fish already sluggish)
  // Spring: rising after spawn trigger = very bad
  // Fall: rising post-front = bad during feed-up
  far_north:  [+8, +6, +2, -6, -8, -3, -2, -2, -5, -7, 0, +8],
  north:      [+6, +5, +1, -5, -6, -3, -2, -2, -5, -6, 0, +6],
  mid:        [+4, +3, 0, -4, -4, -2, -3, -3, -4, -4, 0, +4],
  south:      [+2, +1, -1, -3, -3, -2, -4, -4, -3, -3, -1, +2],
  deep_south: [+1, 0, -1, -2, -2, -3, -4, -4, -3, -2, -1, +1],
  north_coast:[+5, +4, +1, -4, -5, -3, -2, -2, -4, -5, 0, +5],
  mid_coast:  [+2, +1, 0, -3, -3, -2, -3, -3, -3, -3, 0, +2],
  south_coast:[+1, 0, -1, -2, -2, -3, -4, -4, -3, -2, -1, +1],
};

// For STABLE pressure: depends on whether stability is good or bad for context
const PRESSURE_STABLE_DELTA: Record<Band, number[]> = {
  // Deep winter: stability = less bad (predictable = less shock)
  // Spring/fall: stability = slightly negative (fish want pressure CHANGE)
  // Summer comfortable: stability = fine
  far_north:  [+4, +3, -2, -4, -3, 0, +2, +2, -2, -4, 0, +4],
  north:      [+3, +2, -1, -3, -3, 0, +1, +1, -2, -3, 0, +3],
  mid:        [+2, +1, -1, -2, -2, 0, +1, +1, -1, -2, 0, +2],
  south:      [+1, +1, 0, -2, -1, 0, +1, +1, -1, -1, 0, +1],
  deep_south: [+1, 0, 0, -1, -1, 0, 0, 0, -1, -1, 0, +1],
  north_coast:[+3, +2, -1, -3, -2, 0, +1, +1, -2, -3, 0, +3],
  mid_coast:  [+1, +1, 0, -2, -1, 0, +1, +1, -1, -1, 0, +1],
  south_coast:[+1, 0, 0, -1, -1, 0, 0, 0, -1, -1, 0, +1],
};

export function getPressureContextDelta(
  pressureState: string | null,
  band: Band,
  month: number,
): number {
  if (pressureState === null) return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (pressureState === "rapidly_falling" || pressureState === "slowly_falling") {
    return PRESSURE_FALLING_DELTA[band]?.[idx] ?? 0;
  }
  if (pressureState === "rapidly_rising" || pressureState === "slowly_rising") {
    return PRESSURE_RISING_DELTA[band]?.[idx] ?? 0;
  }
  if (pressureState === "stable") {
    return PRESSURE_STABLE_DELTA[band]?.[idx] ?? 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Wind Season-Aware Base Modifier
// ---------------------------------------------------------------------------
// The base wind scoring is flat (5-12mph = 92 freshwater). This is wrong.
// Wind effect depends heavily on season and region:
//
// Biology:
// - Winter: light wind preserves surface warming (good for cold-water fish)
//           moderate wind = wind chill, pushes warm surface away (bad)
// - Summer: calm water = DO depletion, thermal stratification (bad)
//           moderate wind = mixes O2, breaks thermocline (very good)
// - Spring/fall: moderate wind generally positive (mixing, prey dispersal)

// Delta for CALM wind (0-4 mph) — base FW=65, SW=54
const WIND_CALM_DELTA: Record<Band, number[]> = {
  // Winter calm = good (preserves warmth) / Summer calm = bad (DO crash)
  far_north:  [+10, +8, +4, 0, -4, -12, -15, -15, -8, -2, +4, +10],
  north:      [+8, +6, +3, 0, -3, -10, -14, -14, -7, -1, +3, +8],
  mid:        [+5, +4, +2, 0, -4, -12, -15, -15, -8, -2, +2, +5],
  south:      [+3, +2, 0, -2, -6, -14, -16, -16, -10, -3, 0, +3],
  deep_south: [+1, +1, -1, -4, -8, -16, -18, -18, -12, -5, -1, +1],
  north_coast:[+6, +5, +2, 0, -3, -10, -13, -13, -6, -1, +2, +6],
  mid_coast:  [+3, +2, 0, -2, -5, -12, -15, -15, -8, -3, 0, +3],
  south_coast:[+1, 0, -1, -4, -7, -14, -17, -17, -10, -5, -1, +1],
};

// Delta for MODERATE wind (5-12 mph) — base FW=92, SW=75
const WIND_MODERATE_DELTA: Record<Band, number[]> = {
  // Winter: moderate wind = cold stress, surface cooling (bad)
  // Summer: moderate wind = O2 mixing, prey dispersal (very good)
  far_north:  [-10, -8, -3, +2, +5, +8, +8, +8, +5, +3, -3, -10],
  north:      [-8, -6, -2, +2, +4, +8, +8, +8, +5, +2, -2, -8],
  mid:        [-5, -4, 0, +2, +4, +8, +8, +8, +5, +2, 0, -5],
  south:      [-3, -2, +1, +3, +5, +8, +8, +8, +6, +3, +1, -3],
  deep_south: [-1, 0, +2, +3, +6, +8, +8, +8, +6, +4, +2, -1],
  north_coast:[-6, -5, -1, +2, +4, +8, +8, +8, +5, +2, -1, -6],
  mid_coast:  [-3, -2, +1, +3, +5, +8, +8, +8, +6, +3, +1, -3],
  south_coast:[-1, 0, +2, +3, +6, +8, +8, +8, +6, +4, +2, -1],
};

// Delta for HIGH wind (13-20 mph) — base FW=62, SW=22-55
const WIND_HIGH_DELTA: Record<Band, number[]> = {
  // Always somewhat negative, but less so in summer (O2 mixing still helps)
  // Much worse in winter (extreme cold stress)
  far_north:  [-12, -10, -6, -2, 0, +4, +5, +5, +2, -1, -5, -12],
  north:      [-10, -8, -4, -1, 0, +3, +4, +4, +2, -1, -4, -10],
  mid:        [-7, -5, -2, 0, +1, +3, +4, +4, +2, 0, -2, -7],
  south:      [-4, -3, -1, 0, +1, +3, +3, +3, +2, +1, -1, -4],
  deep_south: [-2, -1, 0, +1, +2, +3, +3, +3, +2, +1, 0, -2],
  north_coast:[-8, -6, -3, -1, 0, +3, +4, +4, +2, -1, -3, -8],
  mid_coast:  [-4, -3, -1, 0, +1, +3, +3, +3, +2, +1, -1, -4],
  south_coast:[-2, -1, 0, +1, +2, +3, +3, +3, +2, +1, 0, -2],
};

export function getWindSeasonDelta(
  windSpeedMph: number | null,
  band: Band,
  month: number,
): number {
  if (windSpeedMph === null) return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (windSpeedMph <= 4) {
    return WIND_CALM_DELTA[band]?.[idx] ?? 0;
  }
  if (windSpeedMph <= 12) {
    return WIND_MODERATE_DELTA[band]?.[idx] ?? 0;
  }
  if (windSpeedMph <= 20) {
    return WIND_HIGH_DELTA[band]?.[idx] ?? 0;
  }
  // 20+ mph: extreme wind, always bad, no seasonal help
  return 0;
}

// ---------------------------------------------------------------------------
// Saltwater / Brackish Precipitation Context Modifier
// ---------------------------------------------------------------------------
// Base saltwater precip: no_precip=62, current_rain_any_intensity=58
// Biology:
// - Summer rain in warm saltwater = cooling relief + baitfish activation (good)
// - Winter cold rain in north = thermal shock, salinity disruption (bad)
// - Spring rain in estuaries = nutrient flush, baitfish movement (good)

const SW_RAIN_DELTA: Record<CoastalBand, number[]> = {
  north_coast: [-8, -6, 0, +4, +6, +4, +2, +2, +4, +3, -2, -8],
  mid_coast:   [-4, -2, +2, +5, +5, +3, 0, 0, +3, +4, +1, -4],
  south_coast: [-1, 0, +3, +4, +3, -2, -4, -4, +1, +3, +2, -1],
};

const SW_NO_PRECIP_DELTA: Record<CoastalBand, number[]> = {
  // Summer no rain = hotter surface water (worse)
  // Winter no rain = stable salinity (slightly better)
  north_coast: [+3, +2, +1, 0, 0, -3, -5, -5, -2, 0, +1, +3],
  mid_coast:   [+2, +1, 0, 0, -1, -4, -6, -6, -3, 0, 0, +2],
  south_coast: [+1, 0, 0, -1, -2, -6, -8, -8, -4, -1, 0, +1],
};

const BK_RAIN_DELTA: Record<CoastalBand, number[]> = {
  // Brackish: rain affects salinity balance more dramatically
  north_coast: [-10, -8, -2, +4, +5, +2, -2, -2, +3, +3, -3, -10],
  mid_coast:   [-6, -4, 0, +5, +5, +1, -3, -3, +2, +4, -1, -6],
  south_coast: [-3, -1, +2, +4, +3, -3, -6, -6, 0, +3, +1, -3],
};

export function getSaltwaterPrecipDelta(
  precipCondition: string | null,
  waterType: WaterType,
  band: Band,
  month: number,
): number {
  if (precipCondition === null) return 0;
  if (waterType === "freshwater") return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (waterType === "saltwater") {
    if (precipCondition === "current_rain_any_intensity") {
      return SW_RAIN_DELTA[band as CoastalBand]?.[idx] ?? 0;
    }
    if (precipCondition === "no_precip") {
      return SW_NO_PRECIP_DELTA[band as CoastalBand]?.[idx] ?? 0;
    }
  }

  if (waterType === "brackish") {
    if (precipCondition === "light_rain" || precipCondition === "moderate_rain") {
      return BK_RAIN_DELTA[band as CoastalBand]?.[idx] ?? 0;
    }
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Warming / Cooling (non-rapid) Trend Context Deltas
// ---------------------------------------------------------------------------
// Base scores: warming = 75, cooling = 43
// Biology:
// - Warming in winter (north) = very good (activates sluggish fish metabolism)
// - Warming in summer (south) = bad (pushing toward thermal stress, DO depletion)
// - Cooling in summer (south) = good (relief from heat stress)
// - Cooling in winter (north) = bad (pushing toward shutdown)

const WARMING_DELTA: Record<Band, number[]> = {
  far_north:  [+12, +10, +8, +4, 0, -6, -10, -10, -4, +2, +6, +12],
  north:      [+10, +8, +6, +3, 0, -6, -10, -10, -4, +1, +4, +10],
  mid:        [+6, +5, +3, +1, -1, -8, -12, -12, -5, 0, +2, +6],
  south:      [+3, +3, +1, -1, -4, -10, -14, -14, -8, -2, +1, +3],
  deep_south: [+1, +1, 0, -3, -6, -12, -16, -16, -10, -4, 0, +1],
  north_coast:[+8, +6, +4, +2, 0, -5, -8, -8, -3, +1, +3, +8],
  mid_coast:  [+4, +3, +1, 0, -2, -8, -10, -10, -5, -1, +1, +4],
  south_coast:[+1, +1, 0, -2, -5, -10, -14, -14, -8, -3, 0, +1],
};

const COOLING_DELTA: Record<Band, number[]> = {
  far_north:  [-14, -12, -8, -3, 0, +6, +10, +10, +4, -1, -6, -14],
  north:      [-12, -10, -6, -2, 0, +6, +10, +10, +4, -1, -4, -12],
  mid:        [-8, -6, -3, -1, +1, +8, +12, +12, +5, 0, -2, -8],
  south:      [-5, -3, -1, +1, +4, +10, +14, +14, +8, +2, -1, -5],
  deep_south: [-3, -2, 0, +2, +6, +12, +16, +16, +10, +4, 0, -3],
  north_coast:[-10, -8, -4, -2, 0, +5, +8, +8, +3, -1, -3, -10],
  mid_coast:  [-5, -3, -1, 0, +2, +8, +10, +10, +5, +1, -1, -5],
  south_coast:[-3, -2, 0, +2, +5, +10, +14, +14, +8, +3, 0, -3],
};

export function getWarmingCoolingDelta(
  tempTrendState: string | null,
  band: Band,
  month: number,
): number {
  if (tempTrendState === null) return 0;
  const idx = Math.max(0, Math.min(11, month - 1));

  if (tempTrendState === "warming") {
    return WARMING_DELTA[band]?.[idx] ?? 0;
  }
  if (tempTrendState === "cooling") {
    return COOLING_DELTA[band]?.[idx] ?? 0;
  }
  return 0;
}
