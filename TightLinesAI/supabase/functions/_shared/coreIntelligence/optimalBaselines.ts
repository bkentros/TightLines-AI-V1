// =============================================================================
// OPTIMAL BASELINE SCORING SYSTEM
//
// For every continuous environmental variable, defines the OPTIMAL value for
// each month × region × water type, plus asymmetric tolerance ranges.
//
// Score = 100 at optimal, tapering via Gaussian falloff as actual conditions
// deviate above or below. Each variable's optimal shifts monthly because fish
// acclimate to seasonal conditions — what's "good" in January is different
// from what's "good" in July, and differs by region and water type.
//
// Data sources: NOAA fisheries thermal tolerance studies, state fish & wildlife
// agency reports (FL FWC, MI DNR, TX Parks), university extension services,
// peer-reviewed fisheries biology journals (PMC, SpringerLink), EPA dissolved
// oxygen research, and established angling science (In-Fisherman, Bassmaster).
// =============================================================================

import type { LatitudeBand, WaterType } from "./types.ts";
import type { CoastalBand } from "./seasonalProfiles.ts";

type Band = LatitudeBand | CoastalBand;

// 12-element tuple: index 0 = January, 11 = December
type Month12 = [number, number, number, number, number, number, number, number, number, number, number, number];

/**
 * Defines the optimal value and tolerance for a variable in a specific context.
 * - optimal: the value at which score = 100 for that month
 * - sigmaAbove: how far above optimal before score drops to ~61% (1σ)
 * - sigmaBelow: how far below optimal before score drops to ~61% (1σ)
 *
 * Asymmetric tolerances encode biological reality:
 * e.g., fish tolerate 5°F above optimal but only 3°F below in cold months.
 */
export interface OptimalProfile {
  optimal: Month12;
  sigmaAbove: Month12;
  sigmaBelow: Month12;
}

// ---------------------------------------------------------------------------
// CORE SCORING FORMULA
// ---------------------------------------------------------------------------
// Gaussian falloff: score = 100 * exp(-k * ((actual - optimal) / sigma)^2)
// k = 0.5 gives:  at ±1σ → 61%,  at ±2σ → 14%,  at ±3σ → 1%
// This creates a smooth, biologically realistic degradation curve.

const K = 0.5;

/**
 * Score a continuous variable against its optimal baseline.
 * Returns 0-100 where 100 = at optimal, degrading smoothly with distance.
 */
export function scoreFromOptimal(
  actual: number,
  profile: OptimalProfile,
  month: number,
): number {
  const idx = Math.max(0, Math.min(11, month - 1));
  const opt = profile.optimal[idx];
  const sigAbove = profile.sigmaAbove[idx];
  const sigBelow = profile.sigmaBelow[idx];

  const deviation = actual - opt;
  const sigma = deviation >= 0 ? sigAbove : sigBelow;

  if (sigma <= 0) return deviation === 0 ? 100 : 0;

  const normalizedDev = deviation / sigma;
  const score = 100 * Math.exp(-K * normalizedDev * normalizedDev);
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Interpolate between two months' profiles for mid-month accuracy.
 * dayOfMonth 1-15 blends toward current month, 16-31 blends toward next.
 */
export function scoreFromOptimalInterpolated(
  actual: number,
  profile: OptimalProfile,
  month: number,
  dayOfMonth: number,
): number {
  const score1 = scoreFromOptimal(actual, profile, month);

  // Early/late month: blend toward adjacent month
  if (dayOfMonth <= 10) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const score2 = scoreFromOptimal(actual, profile, prevMonth);
    const t = dayOfMonth / 10; // 0.1 to 1.0
    return Math.round(score2 * (1 - t) + score1 * t);
  }
  if (dayOfMonth >= 21) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const score2 = scoreFromOptimal(actual, profile, nextMonth);
    const t = (dayOfMonth - 20) / 11; // 0.09 to 1.0
    return Math.round(score1 * (1 - t) + score2 * t);
  }

  return score1;
}

// =============================================================================
// WATER TEMPERATURE OPTIMAL BASELINES (°F)
// =============================================================================
// The most critical variable. Optimal reflects what composite gamefish species
// are acclimated to and feed most actively at for each month/region.
//
// Biology: Fish are ectotherms — their metabolism, digestion rate, and feeding
// aggression are directly governed by water temperature. Each species has a
// thermal preference range, but crucially this shifts with seasonal acclimation.
// A largemouth bass in Michigan January is acclimated to 33-38°F water and will
// feed actively at 38°F. That same bass in July is acclimated to 75°F and would
// be in cold shock at 38°F. The optimal tracks this acclimation.
//
// Sources: Species-specific thermal preferences from state DNR studies,
// composite weighted toward most common gamefish per region.
// Freshwater composite: bass (40%), walleye (20%), panfish (20%), trout (10%), catfish (10%)
// Saltwater composite: redfish (25%), snook (20%), flounder (15%), trout (15%), tarpon (10%), misc (15%)

const WATER_TEMP_FW: Record<LatitudeBand, OptimalProfile> = {
  far_north: {
    //                Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
    optimal:      [  36,  36,  42,  52,  60,  68,  72,  70,  65,  55,  44,  37],
    sigmaAbove:   [   4,   4,   6,   7,   8,   7,   6,   6,   7,   7,   6,   4],
    sigmaBelow:   [   3,   3,   4,   5,   6,   6,   6,   7,   6,   5,   4,   3],
  },
  north: {
    optimal:      [  38,  38,  45,  55,  63,  70,  74,  72,  67,  58,  47,  40],
    sigmaAbove:   [   4,   4,   6,   7,   8,   7,   6,   6,   7,   7,   6,   4],
    sigmaBelow:   [   3,   3,   5,   5,   6,   6,   6,   7,   6,   5,   4,   3],
  },
  mid: {
    optimal:      [  42,  44,  52,  60,  68,  74,  76,  75,  70,  62,  52,  44],
    sigmaAbove:   [   5,   5,   6,   7,   7,   6,   5,   5,   7,   7,   6,   5],
    sigmaBelow:   [   4,   4,   5,   6,   6,   6,   6,   7,   6,   5,   5,   4],
  },
  south: {
    optimal:      [  48,  50,  56,  64,  72,  76,  78,  77,  73,  66,  56,  50],
    sigmaAbove:   [   6,   6,   7,   7,   7,   5,   5,   5,   6,   7,   7,   6],
    sigmaBelow:   [   4,   4,   5,   6,   6,   6,   6,   7,   6,   5,   5,   4],
  },
  deep_south: {
    optimal:      [  58,  60,  64,  70,  76,  78,  78,  78,  76,  72,  64,  60],
    sigmaAbove:   [   7,   7,   7,   7,   6,   5,   4,   4,   5,   6,   7,   7],
    sigmaBelow:   [   5,   5,   5,   6,   6,   6,   6,   7,   6,   5,   5,   5],
  },
};

const WATER_TEMP_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [  40,  39,  42,  50,  58,  66,  72,  74,  68,  58,  48,  42],
    sigmaAbove:   [   5,   5,   6,   7,   8,   7,   6,   6,   7,   7,   6,   5],
    sigmaBelow:   [   3,   3,   4,   5,   6,   6,   6,   7,   6,   5,   4,   3],
  },
  mid_coast: {
    optimal:      [  52,  52,  56,  62,  70,  76,  80,  80,  76,  68,  58,  54],
    sigmaAbove:   [   6,   6,   7,   7,   7,   6,   5,   5,   6,   7,   7,   6],
    sigmaBelow:   [   4,   4,   5,   6,   6,   6,   6,   7,   6,   5,   5,   4],
  },
  south_coast: {
    optimal:      [  66,  66,  70,  74,  78,  82,  83,  83,  82,  78,  72,  68],
    sigmaAbove:   [   7,   7,   7,   6,   5,   4,   4,   4,   5,   6,   7,   7],
    sigmaBelow:   [   5,   5,   5,   5,   6,   6,   6,   6,   5,   5,   5,   5],
  },
};

const WATER_TEMP_BK: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [  42,  41,  44,  52,  60,  68,  73,  75,  70,  60,  50,  44],
    sigmaAbove:   [   5,   5,   6,   7,   8,   7,   6,   6,   7,   7,   6,   5],
    sigmaBelow:   [   3,   3,   4,   5,   6,   6,   6,   7,   6,   5,   4,   3],
  },
  mid_coast: {
    optimal:      [  50,  50,  54,  60,  68,  74,  78,  78,  74,  66,  56,  52],
    sigmaAbove:   [   6,   6,   7,   7,   7,   6,   5,   5,   6,   7,   7,   6],
    sigmaBelow:   [   4,   4,   5,   6,   6,   6,   6,   7,   6,   5,   5,   4],
  },
  south_coast: {
    optimal:      [  64,  64,  68,  72,  76,  80,  82,  82,  80,  76,  70,  66],
    sigmaAbove:   [   7,   7,   7,   6,   5,   4,   4,   4,   5,   6,   7,   7],
    sigmaBelow:   [   5,   5,   5,   5,   6,   6,   6,   6,   5,   5,   5,   5],
  },
};

// =============================================================================
// WIND SPEED OPTIMAL BASELINES (mph)
// =============================================================================
// Biology: Wind drives dissolved oxygen via surface aeration (critical above
// ~4-9 mph per SpringerLink research). In warm months, wind mixing prevents
// thermal stratification and oxygen depletion — moderate wind is excellent.
// In cold months, wind creates wind chill on exposed water, pushes warm surface
// layers away, and increases cold stress — calm is preferred.
//
// Sources: EPA dissolved oxygen research, UF/IFAS warm-water lake studies,
// PMC studies on wind exposure and water oxygenation in shallow lakes.

const WIND_FW: Record<LatitudeBand, OptimalProfile> = {
  far_north: {
    //                Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
    // Winter: calm preferred (preserves surface warmth, reduces wind chill)
    // Summer: moderate wind excellent (O2 mixing, breaks stratification)
    optimal:      [   2,   2,   4,   6,   8,  10,  10,  10,   8,   6,   4,   2],
    sigmaAbove:   [   3,   3,   4,   5,   6,   6,   6,   6,   6,   5,   4,   3],
    sigmaBelow:   [   2,   2,   3,   4,   5,   5,   5,   5,   5,   4,   3,   2],
  },
  north: {
    optimal:      [   3,   3,   5,   7,   8,  10,  10,  10,   8,   7,   5,   3],
    sigmaAbove:   [   3,   3,   4,   5,   6,   6,   6,   6,   6,   5,   4,   3],
    sigmaBelow:   [   2,   2,   3,   4,   5,   5,   5,   5,   5,   4,   3,   2],
  },
  mid: {
    optimal:      [   4,   4,   6,   7,   8,  10,  10,  10,   8,   7,   6,   4],
    sigmaAbove:   [   4,   4,   5,   5,   6,   6,   6,   6,   6,   5,   5,   4],
    sigmaBelow:   [   3,   3,   4,   4,   5,   5,   5,   5,   5,   4,   4,   3],
  },
  south: {
    optimal:      [   5,   5,   7,   8,   9,  10,  10,  10,   9,   8,   7,   5],
    sigmaAbove:   [   4,   4,   5,   6,   6,   6,   6,   6,   6,   6,   5,   4],
    sigmaBelow:   [   3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
  deep_south: {
    optimal:      [   6,   6,   8,   9,  10,  11,  12,  12,  10,   8,   7,   6],
    sigmaAbove:   [   5,   5,   5,   6,   6,   6,   6,   6,   6,   6,   5,   5],
    sigmaBelow:   [   3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
};

const WIND_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    // Saltwater: slightly higher wind tolerance (open water, current mixing)
    optimal:      [   4,   4,   6,   8,  10,  12,  12,  12,  10,   8,   6,   4],
    sigmaAbove:   [   4,   4,   5,   6,   7,   7,   7,   7,   7,   6,   5,   4],
    sigmaBelow:   [   3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
  mid_coast: {
    optimal:      [   6,   6,   8,   9,  10,  12,  12,  12,  10,   9,   8,   6],
    sigmaAbove:   [   5,   5,   6,   6,   7,   7,   7,   7,   7,   6,   6,   5],
    sigmaBelow:   [   3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
  south_coast: {
    optimal:      [   7,   7,   8,  10,  10,  12,  12,  12,  10,   9,   8,   7],
    sigmaAbove:   [   5,   5,   6,   6,   7,   7,   7,   7,   7,   6,   6,   5],
    sigmaBelow:   [   4,   4,   5,   5,   5,   5,   5,   5,   5,   5,   5,   4],
  },
};

const WIND_BK: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [   3,   3,   5,   7,   9,  10,  10,  10,   9,   7,   5,   3],
    sigmaAbove:   [   4,   4,   5,   6,   6,   6,   6,   6,   6,   6,   5,   4],
    sigmaBelow:   [   2,   2,   3,   4,   5,   5,   5,   5,   5,   4,   3,   2],
  },
  mid_coast: {
    optimal:      [   5,   5,   7,   8,   9,  10,  10,  10,   9,   8,   7,   5],
    sigmaAbove:   [   5,   5,   5,   6,   6,   6,   6,   6,   6,   6,   5,   5],
    sigmaBelow:   [   3,   3,   4,   4,   5,   5,   5,   5,   5,   4,   4,   3],
  },
  south_coast: {
    optimal:      [   6,   6,   8,   9,  10,  11,  11,  11,  10,   8,   7,   6],
    sigmaAbove:   [   5,   5,   6,   6,   6,   6,   6,   6,   6,   6,   6,   5],
    sigmaBelow:   [   3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
};

// =============================================================================
// BAROMETRIC PRESSURE CHANGE RATE OPTIMAL (mb/hr)
// =============================================================================
// Biology: Falling pressure is the #1 feeding trigger across nearly all gamefish.
// Fish sense pressure changes via their swim bladder. A moderate drop (-0.5 to
// -1.5 mb/hr) triggers aggressive feeding as fish anticipate incoming fronts.
// The SENSITIVITY to pressure changes varies seasonally:
//   - Spring/fall: fish metabolically primed, respond strongly to drops
//   - Deep winter: sluggish metabolism, muted pressure response
//   - Summer: pre-storm drops trigger intense but short feeding bursts
//
// Sources: In-Fisherman barometric studies, Bassmaster Elite field data,
// peer-reviewed research on swim bladder pressure sensing.

const PRESSURE_RATE_FW: Record<LatitudeBand, OptimalProfile> = {
  far_north: {
    //                Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   Oct   Nov   Dec
    // Optimal = negative (falling). More negative = falling faster.
    // Winter: fish sluggish, optimal closer to stable (0)
    // Spring/fall: strong response to pressure drops
    optimal:      [-0.3, -0.3, -0.6, -1.0, -1.2, -0.8, -0.8, -0.8, -1.0, -1.2, -0.6, -0.3],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.6,  0.6,  0.6,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  1.0,  0.6,  0.6],
  },
  north: {
    optimal:      [-0.4, -0.4, -0.7, -1.0, -1.2, -0.8, -0.8, -0.8, -1.0, -1.2, -0.7, -0.4],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.6,  0.6,  0.7,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  1.0,  0.7,  0.6],
  },
  mid: {
    optimal:      [-0.5, -0.5, -0.8, -1.0, -1.0, -0.8, -0.8, -0.8, -1.0, -1.0, -0.8, -0.5],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.7,  0.7,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.7],
  },
  south: {
    optimal:      [-0.6, -0.6, -0.8, -1.0, -1.0, -0.8, -0.8, -0.8, -1.0, -1.0, -0.8, -0.6],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.7,  0.7,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.7],
  },
  deep_south: {
    optimal:      [-0.6, -0.6, -0.8, -1.0, -1.0, -0.8, -0.8, -0.8, -1.0, -1.0, -0.8, -0.6],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.8,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8],
  },
};

const PRESSURE_RATE_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [-0.4, -0.4, -0.7, -1.0, -1.2, -0.8, -0.8, -0.8, -1.0, -1.2, -0.7, -0.4],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.6,  0.6,  0.7,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  1.0,  0.7,  0.6],
  },
  mid_coast: {
    optimal:      [-0.5, -0.5, -0.8, -1.0, -1.0, -0.8, -0.8, -0.8, -1.0, -1.0, -0.8, -0.5],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.7,  0.7,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.7],
  },
  south_coast: {
    optimal:      [-0.6, -0.6, -0.8, -1.0, -1.0, -0.8, -0.8, -0.8, -1.0, -1.0, -0.8, -0.6],
    sigmaAbove:   [ 0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8,  0.8],
    sigmaBelow:   [ 0.8,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8,  1.0,  0.8,  0.8,  0.8],
  },
};

const PRESSURE_RATE_BK: Record<CoastalBand, OptimalProfile> = {
  north_coast: { ...PRESSURE_RATE_SW.north_coast },
  mid_coast:   { ...PRESSURE_RATE_SW.mid_coast },
  south_coast: { ...PRESSURE_RATE_SW.south_coast },
};

// =============================================================================
// CLOUD COVER OPTIMAL BASELINES (% 0-100)
// =============================================================================
// Biology: Light penetration affects predator-prey dynamics. Overcast reduces
// visibility, emboldening predators. But in cold months, sunlight warming
// shallow water activates feeding — clear skies become optimal.
//
// Winter far north: 10-20% (sun warms water, activates sluggish fish)
// Summer deep south: 70-80% (shade reduces thermal stress, emboldens feeding)
// Spring/fall: 40-60% (moderate light, insect activity)
//
// Sources: FL FWC light/feeding studies, MI DNR ice-out feeding observations.

const CLOUD_COVER_FW: Record<LatitudeBand, OptimalProfile> = {
  far_north: {
    //                Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
    optimal:      [  15,  15,  25,  40,  50,  60,  65,  65,  55,  45,  25,  15],
    sigmaAbove:   [  30,  30,  22,  25,  25,  25,  25,  25,  25,  25,  30,  30],
    sigmaBelow:   [  10,  10,  15,  20,  25,  25,  25,  25,  25,  20,  15,  10],
    // Winter sigmaAbove widened: under ice, cloud cover has less impact on water temp
  },
  north: {
    optimal:      [  20,  20,  30,  42,  50,  60,  65,  65,  55,  45,  30,  20],
    sigmaAbove:   [  28,  28,  22,  25,  25,  25,  25,  25,  25,  25,  22,  28],
    sigmaBelow:   [  12,  12,  18,  22,  25,  25,  25,  25,  25,  22,  18,  12],
  },
  mid: {
    optimal:      [  25,  25,  35,  45,  55,  65,  70,  70,  60,  50,  35,  25],
    sigmaAbove:   [  18,  18,  22,  25,  25,  25,  25,  25,  25,  25,  22,  18],
    sigmaBelow:   [  15,  15,  20,  22,  25,  25,  25,  25,  25,  22,  20,  15],
  },
  south: {
    optimal:      [  30,  30,  40,  50,  58,  68,  72,  72,  62,  52,  40,  30],
    sigmaAbove:   [  20,  20,  22,  25,  25,  25,  25,  25,  25,  25,  22,  20],
    sigmaBelow:   [  18,  18,  20,  22,  25,  25,  25,  25,  25,  22,  20,  18],
  },
  deep_south: {
    optimal:      [  35,  35,  45,  55,  62,  72,  78,  78,  68,  55,  45,  35],
    sigmaAbove:   [  22,  22,  25,  25,  25,  22,  20,  20,  25,  25,  25,  22],
    sigmaBelow:   [  20,  20,  22,  22,  25,  25,  25,  25,  25,  22,  22,  20],
  },
};

const CLOUD_COVER_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [  20,  20,  30,  42,  50,  58,  62,  62,  52,  42,  30,  20],
    sigmaAbove:   [  15,  15,  20,  25,  25,  25,  25,  25,  25,  25,  20,  15],
    sigmaBelow:   [  12,  12,  18,  22,  25,  25,  25,  25,  25,  22,  18,  12],
  },
  mid_coast: {
    optimal:      [  28,  28,  38,  48,  55,  65,  68,  68,  58,  48,  38,  28],
    sigmaAbove:   [  18,  18,  22,  25,  25,  25,  25,  25,  25,  25,  22,  18],
    sigmaBelow:   [  15,  15,  20,  22,  25,  25,  25,  25,  25,  22,  20,  15],
  },
  south_coast: {
    optimal:      [  35,  35,  42,  52,  60,  70,  75,  75,  65,  52,  42,  35],
    sigmaAbove:   [  22,  22,  25,  25,  25,  22,  20,  20,  25,  25,  25,  22],
    sigmaBelow:   [  20,  20,  22,  22,  25,  25,  25,  25,  25,  22,  22,  20],
  },
};

const CLOUD_COVER_BK: Record<CoastalBand, OptimalProfile> = {
  north_coast: { ...CLOUD_COVER_SW.north_coast },
  mid_coast:   { ...CLOUD_COVER_SW.mid_coast },
  south_coast: { ...CLOUD_COVER_SW.south_coast },
};

// =============================================================================
// TEMPERATURE TREND OPTIMAL BASELINES (°F change over 72h)
// =============================================================================
// Biology: Fish respond to the DIRECTION and RATE of temperature change.
// In cold months, gradual warming activates metabolism and triggers feeding.
// In hot months, gradual cooling provides relief from thermal stress.
// Rapid changes in either direction can shock fish. The optimal rate shifts
// monthly to reflect what fish biology "wants" in each season.
//
// Positive = warming trend, Negative = cooling trend, 0 = stable
// Sources: PMC thermal tolerance studies, species acclimation rate research.

const TEMP_TREND_FW: Record<LatitudeBand, OptimalProfile> = {
  far_north: {
    //                Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   Oct   Nov   Dec
    // Winter: wants warming. Summer: wants slight cooling or stable.
    optimal:      [ 3.0,  3.0,  4.0,  4.0,  2.0,  0.0, -2.0, -2.0,  0.0, -2.0, -1.0,  2.0],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0,  2.0,  2.5,  2.5,  2.5,  3.0],
    sigmaBelow:   [ 2.0,  2.0,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0],
  },
  north: {
    optimal:      [ 2.5,  2.5,  3.5,  3.5,  2.0,  0.0, -1.5, -1.5,  0.0, -2.0, -1.0,  2.0],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0,  2.0,  2.5,  2.5,  2.5,  3.0],
    sigmaBelow:   [ 2.0,  2.0,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0],
  },
  mid: {
    optimal:      [ 2.0,  2.0,  3.0,  3.0,  1.5,  0.0, -2.0, -2.0, -0.5, -1.5, -0.5,  1.5],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  2.5,  2.5,  3.0],
    sigmaBelow:   [ 2.0,  2.0,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0],
  },
  south: {
    optimal:      [ 1.5,  1.5,  2.5,  2.0,  1.0, -1.0, -2.5, -2.5, -1.0, -1.5, -0.5,  1.0],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  2.5,  3.0,  3.0],
    sigmaBelow:   [ 2.5,  2.5,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5],
  },
  deep_south: {
    optimal:      [ 1.0,  1.0,  1.5,  1.0,  0.0, -2.0, -3.0, -3.0, -1.5, -1.0,  0.0,  0.5],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  3.0,  3.0,  3.0],
    sigmaBelow:   [ 2.5,  2.5,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5],
  },
};

const TEMP_TREND_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [ 2.0,  2.0,  3.0,  3.0,  1.5,  0.0, -1.5, -1.5,  0.0, -1.5, -0.5,  1.5],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  2.5,  2.5,  3.0],
    sigmaBelow:   [ 2.0,  2.0,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.0],
  },
  mid_coast: {
    optimal:      [ 1.5,  1.5,  2.0,  2.0,  1.0, -0.5, -2.0, -2.0, -0.5, -1.0, -0.5,  1.0],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  2.5,  3.0,  3.0],
    sigmaBelow:   [ 2.5,  2.5,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5],
  },
  south_coast: {
    optimal:      [ 1.0,  1.0,  1.5,  1.0,  0.0, -2.0, -2.5, -2.5, -1.5, -1.0,  0.0,  0.5],
    sigmaAbove:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5,  2.5,  2.5,  3.0,  3.0,  3.0],
    sigmaBelow:   [ 2.5,  2.5,  2.5,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  2.5,  2.5],
  },
};

const TEMP_TREND_BK: Record<CoastalBand, OptimalProfile> = {
  north_coast: { ...TEMP_TREND_SW.north_coast },
  mid_coast:   { ...TEMP_TREND_SW.mid_coast },
  south_coast: { ...TEMP_TREND_SW.south_coast },
};

// =============================================================================
// TIDE STRENGTH OPTIMAL BASELINES (% of max tidal range)
// =============================================================================
// Biology: Moderate to strong tidal current moves baitfish, creates feeding
// ambush points, and concentrates prey. Too weak (neap) = not enough current
// movement. Too strong (peak spring) = can scatter bait and overwhelm
// structure-oriented fish.
//
// Optimal is 65-80% of max range across most contexts.
// Slight seasonal variation: spring/fall transition periods fish are more
// structure-oriented and prefer slightly lower current.
//
// Sources: FL FWC tidal fishing studies, NOAA tidal prediction research.

const TIDE_STRENGTH_SW: Record<CoastalBand, OptimalProfile> = {
  north_coast: {
    optimal:      [  65,  65,  70,  75,  75,  72,  72,  72,  75,  75,  70,  65],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  20,  20,  20,  22,  22,  20,  20,  20,  22,  22,  20,  20],
  },
  mid_coast: {
    optimal:      [  68,  68,  72,  75,  75,  72,  72,  72,  75,  75,  72,  68],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  20,  20,  20,  22,  22,  20,  20,  20,  22,  22,  20,  20],
  },
  south_coast: {
    optimal:      [  70,  70,  72,  75,  75,  72,  72,  72,  75,  75,  72,  70],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  20,  20,  20,  22,  22,  20,  20,  20,  22,  22,  20,  20],
  },
};

const TIDE_STRENGTH_BK: Record<CoastalBand, OptimalProfile> = {
  // Brackish: slightly lower optimal (less current preferred in estuaries)
  north_coast: {
    optimal:      [  60,  60,  65,  70,  70,  68,  68,  68,  70,  70,  65,  60],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  18,  18,  20,  20,  20,  18,  18,  18,  20,  20,  20,  18],
  },
  mid_coast: {
    optimal:      [  62,  62,  68,  72,  72,  70,  70,  70,  72,  72,  68,  62],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  18,  18,  20,  20,  20,  18,  18,  18,  20,  20,  20,  18],
  },
  south_coast: {
    optimal:      [  65,  65,  70,  72,  72,  70,  70,  70,  72,  72,  70,  65],
    sigmaAbove:   [  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18,  18],
    sigmaBelow:   [  18,  18,  20,  20,  20,  18,  18,  18,  20,  20,  20,  18],
  },
};

// =============================================================================
// PRECIPITATION OPTIMAL BASELINES
// =============================================================================
// Precipitation is categorical in our system (light_rain, moderate_rain, etc.)
// Rather than optimal + Gaussian, we use context-aware categorical scoring maps.
// Each map gives the base score for each precipitation condition by month × band.
//
// Biology:
// - Light rain in spring/fall = insect hatches, terrestrial prey wash-in (excellent)
// - Light rain in winter far north = cold shock risk (negative)
// - Moderate rain in summer = cooling relief + O2 boost (good if hot)
// - Heavy rain = always negative (turbidity, flash flooding, unsafe)
// - Post-rain clearing = generally good (clean water + activated baitfish)
//
// Returns 0-100 score directly (not using Gaussian formula).

interface PrecipScoreMap {
  light_rain: Month12;
  no_precip_stable: Month12;
  moderate_rain: Month12;
  post_light_rain_clearing: Month12;
  heavy_rain: Month12;
  post_heavy_rain_48hr: Month12;
}

const PRECIP_FW: Record<LatitudeBand, PrecipScoreMap> = {
  far_north: {
    //                    Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
    light_rain:         [ 40,  42,  65,  85,  92,  88,  82,  82,  88,  80,  55,  40],
    no_precip_stable:   [ 55,  55,  52,  48,  45,  42,  38,  38,  45,  48,  52,  55],
    moderate_rain:      [ 15,  18,  35,  50,  55,  60,  65,  65,  55,  45,  30,  15],
    post_light_rain_clearing: [48, 50, 58, 62, 60, 55, 52, 52, 58, 60, 52, 48],
    heavy_rain:         [  5,   5,   8,  10,  10,  12,  12,  12,  10,  10,   8,   5],
    post_heavy_rain_48hr: [3,   3,   5,   6,   6,   8,   8,   8,   6,   6,   5,   3],
  },
  north: {
    light_rain:         [ 45,  48,  70,  88,  92,  86,  80,  80,  86,  82,  60,  45],
    no_precip_stable:   [ 55,  55,  50,  46,  44,  40,  36,  36,  44,  46,  50,  55],
    moderate_rain:      [ 20,  22,  38,  52,  55,  62,  66,  66,  58,  48,  32,  20],
    post_light_rain_clearing: [50, 52, 58, 60, 58, 54, 50, 50, 56, 58, 52, 50],
    heavy_rain:         [  5,   6,   8,  10,  10,  12,  12,  12,  10,  10,   8,   5],
    post_heavy_rain_48hr: [3,   4,   5,   6,   6,   8,   8,   8,   6,   6,   5,   3],
  },
  mid: {
    light_rain:         [ 52,  55,  75,  90,  92,  85,  78,  78,  85,  85,  65,  52],
    no_precip_stable:   [ 52,  52,  48,  44,  42,  38,  34,  34,  42,  44,  48,  52],
    moderate_rain:      [ 28,  30,  42,  52,  55,  64,  68,  68,  60,  50,  36,  28],
    post_light_rain_clearing: [52, 54, 58, 60, 58, 52, 48, 48, 54, 58, 54, 52],
    heavy_rain:         [  6,   6,   8,  10,  10,  12,  12,  12,  10,  10,   8,   6],
    post_heavy_rain_48hr: [4,   4,   5,   6,   6,   8,   8,   8,   6,   6,   5,   4],
  },
  south: {
    light_rain:         [ 58,  60,  78,  88,  90,  82,  75,  75,  82,  85,  68,  58],
    no_precip_stable:   [ 50,  50,  46,  42,  40,  36,  32,  32,  40,  42,  46,  50],
    moderate_rain:      [ 32,  35,  45,  52,  55,  65,  70,  70,  62,  52,  40,  32],
    post_light_rain_clearing: [54, 56, 60, 62, 58, 50, 46, 46, 52, 58, 56, 54],
    heavy_rain:         [  6,   7,   8,  10,  10,  12,  12,  12,  10,  10,   8,   6],
    post_heavy_rain_48hr: [4,   4,   5,   6,   6,   8,   8,   8,   6,   6,   5,   4],
  },
  deep_south: {
    light_rain:         [ 62,  65,  80,  86,  88,  78,  72,  72,  80,  84,  70,  62],
    no_precip_stable:   [ 48,  48,  44,  40,  38,  34,  30,  30,  38,  40,  44,  48],
    moderate_rain:      [ 38,  40,  48,  52,  55,  66,  72,  72,  64,  55,  44,  38],
    post_light_rain_clearing: [56, 58, 62, 60, 56, 48, 44, 44, 50, 56, 58, 56],
    heavy_rain:         [  7,   8,   9,  10,  10,  12,  12,  12,  10,  10,   9,   7],
    post_heavy_rain_48hr: [4,   5,   5,   6,   6,   8,   8,   8,   6,   6,   5,   4],
  },
};

interface SwPrecipScoreMap {
  no_precip: Month12;
  current_rain_any_intensity: Month12;
  post_major_storm: Month12;
  extreme_storm_surge: Month12;
}

const PRECIP_SW: Record<CoastalBand, SwPrecipScoreMap> = {
  north_coast: {
    no_precip:                  [ 62,  62,  60,  55,  52,  48,  44,  44,  52,  55,  60,  62],
    current_rain_any_intensity: [ 38,  40,  55,  65,  68,  62,  58,  58,  62,  60,  48,  38],
    post_major_storm:           [ 20,  20,  25,  30,  30,  28,  28,  28,  30,  30,  25,  20],
    extreme_storm_surge:        [  3,   3,   4,   5,   5,   5,   5,   5,   5,   5,   4,   3],
  },
  mid_coast: {
    no_precip:                  [ 60,  60,  58,  52,  50,  44,  40,  40,  48,  52,  58,  60],
    current_rain_any_intensity: [ 42,  44,  58,  68,  68,  60,  55,  55,  62,  64,  52,  42],
    post_major_storm:           [ 22,  22,  26,  30,  30,  28,  28,  28,  30,  30,  26,  22],
    extreme_storm_surge:        [  4,   4,   4,   5,   5,   5,   5,   5,   5,   5,   4,   4],
  },
  south_coast: {
    no_precip:                  [ 58,  58,  55,  50,  48,  40,  36,  36,  44,  50,  55,  58],
    current_rain_any_intensity: [ 48,  50,  60,  65,  62,  55,  48,  48,  58,  62,  55,  48],
    post_major_storm:           [ 24,  24,  28,  30,  30,  26,  24,  24,  28,  30,  28,  24],
    extreme_storm_surge:        [  4,   4,   5,   5,   5,   4,   4,   4,   5,   5,   5,   4],
  },
};

interface BkPrecipScoreMap {
  no_precip_stable: Month12;
  light_rain: Month12;
  moderate_rain: Month12;
  heavy_rain: Month12;
  post_heavy_rain_48hr: Month12;
  post_light_rain_clearing: Month12;
}

const PRECIP_BK: Record<CoastalBand, BkPrecipScoreMap> = {
  north_coast: {
    no_precip_stable:           [ 60,  60,  58,  52,  50,  46,  42,  42,  50,  52,  58,  60],
    light_rain:                 [ 40,  42,  58,  72,  75,  68,  62,  62,  70,  68,  52,  40],
    moderate_rain:              [ 15,  18,  30,  42,  45,  40,  35,  35,  42,  40,  25,  15],
    heavy_rain:                 [  4,   4,   6,   8,   8,   8,   6,   6,   8,   8,   6,   4],
    post_heavy_rain_48hr:       [  2,   2,   4,   5,   5,   5,   4,   4,   5,   5,   4,   2],
    post_light_rain_clearing:   [ 52,  54,  60,  65,  62,  56,  52,  52,  58,  62,  56,  52],
  },
  mid_coast: {
    no_precip_stable:           [ 58,  58,  55,  50,  48,  44,  40,  40,  48,  50,  55,  58],
    light_rain:                 [ 45,  48,  62,  75,  75,  66,  58,  58,  68,  70,  55,  45],
    moderate_rain:              [ 20,  22,  34,  44,  45,  42,  36,  36,  44,  42,  28,  20],
    heavy_rain:                 [  4,   5,   6,   8,   8,   8,   6,   6,   8,   8,   6,   4],
    post_heavy_rain_48hr:       [  2,   3,   4,   5,   5,   5,   4,   4,   5,   5,   4,   2],
    post_light_rain_clearing:   [ 54,  56,  62,  66,  62,  54,  50,  50,  56,  62,  58,  54],
  },
  south_coast: {
    no_precip_stable:           [ 56,  56,  52,  48,  45,  40,  36,  36,  44,  48,  52,  56],
    light_rain:                 [ 50,  52,  65,  72,  70,  60,  52,  52,  64,  68,  58,  50],
    moderate_rain:              [ 24,  26,  36,  44,  42,  38,  30,  30,  40,  42,  32,  24],
    heavy_rain:                 [  5,   5,   6,   8,   8,   7,   5,   5,   8,   8,   6,   5],
    post_heavy_rain_48hr:       [  3,   3,   4,   5,   5,   4,   3,   3,   5,   5,   4,   3],
    post_light_rain_clearing:   [ 56,  58,  64,  65,  60,  50,  46,  46,  54,  60,  60,  56],
  },
};

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

export function getWaterTempProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return WATER_TEMP_FW[band as LatitudeBand] ?? null;
  if (waterType === "saltwater") return WATER_TEMP_SW[band as CoastalBand] ?? null;
  return WATER_TEMP_BK[band as CoastalBand] ?? null;
}

export function getWindProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return WIND_FW[band as LatitudeBand] ?? null;
  if (waterType === "saltwater") return WIND_SW[band as CoastalBand] ?? null;
  return WIND_BK[band as CoastalBand] ?? null;
}

export function getPressureRateProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return PRESSURE_RATE_FW[band as LatitudeBand] ?? null;
  if (waterType === "saltwater") return PRESSURE_RATE_SW[band as CoastalBand] ?? null;
  return PRESSURE_RATE_BK[band as CoastalBand] ?? null;
}

export function getCloudCoverProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return CLOUD_COVER_FW[band as LatitudeBand] ?? null;
  if (waterType === "saltwater") return CLOUD_COVER_SW[band as CoastalBand] ?? null;
  return CLOUD_COVER_BK[band as CoastalBand] ?? null;
}

export function getTempTrendProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return TEMP_TREND_FW[band as LatitudeBand] ?? null;
  if (waterType === "saltwater") return TEMP_TREND_SW[band as CoastalBand] ?? null;
  return TEMP_TREND_BK[band as CoastalBand] ?? null;
}

export function getTideStrengthProfile(
  waterType: WaterType,
  band: Band,
): OptimalProfile | null {
  if (waterType === "freshwater") return null; // no tides
  if (waterType === "saltwater") return TIDE_STRENGTH_SW[band as CoastalBand] ?? null;
  return TIDE_STRENGTH_BK[band as CoastalBand] ?? null;
}

// =============================================================================
// PRECIPITATION CONTEXT-AWARE SCORING
// =============================================================================
// Returns 0-100 directly based on condition + month + band + water type.

export function scorePrecipFromBaseline(
  precipCondition: string,
  waterType: WaterType,
  band: Band,
  month: number,
): number {
  const idx = Math.max(0, Math.min(11, month - 1));

  if (waterType === "freshwater") {
    const map = PRECIP_FW[band as LatitudeBand];
    if (!map) return 50;
    const key = precipCondition as keyof PrecipScoreMap;
    return map[key]?.[idx] ?? 50;
  }

  if (waterType === "saltwater") {
    const map = PRECIP_SW[band as CoastalBand];
    if (!map) return 50;
    const key = precipCondition as keyof SwPrecipScoreMap;
    return map[key]?.[idx] ?? 50;
  }

  // Brackish
  const map = PRECIP_BK[band as CoastalBand];
  if (!map) return 50;
  const key = precipCondition as keyof BkPrecipScoreMap;
  return map[key]?.[idx] ?? 50;
}
