// =============================================================================
// CORE INTELLIGENCE ENGINE — SEASONAL PROFILES
// Monthly weight tables, expected water temperatures, fishable hours,
// and deviation bonus logic per latitude/coastal band.
// =============================================================================

import type { WaterType, LatitudeBand } from "./types.ts";

// ---------------------------------------------------------------------------
// Coastal band type (saltwater / brackish regional grouping)
// ---------------------------------------------------------------------------

export type CoastalBand = "north_coast" | "mid_coast" | "south_coast";

// ---------------------------------------------------------------------------
// Weight profile type — component name → weight (sums to 100)
// ---------------------------------------------------------------------------

export type WeightProfile = Record<string, number>;

// ---------------------------------------------------------------------------
// (FishableHoursConfig removed — replaced by condition-based scoring + biology curves)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helper: get number of days in a month (1-indexed)
// ---------------------------------------------------------------------------

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// ---------------------------------------------------------------------------
// FRESHWATER MONTHLY WEIGHTS — 5 bands × 12 months × 8 components
// Components: water_temp_zone, pressure, light, temp_trend, solunar, wind, moon_phase, precipitation
// All rows sum to 100.
// ---------------------------------------------------------------------------

// Freshwater water_temp weights reduced ~20% vs original to account for
// inferred estimation uncertainty. Redistributed to pressure + temp_trend
// (both directly measured). Reduction is strongest in cold months where
// air-water correlation is weakest (ice cover, thermal inversion).
const FW_FAR_NORTH: WeightProfile[] = [
  { water_temp_zone: 26, pressure: 23, light: 20, temp_trend: 17, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2 },  // Jan  (-6 wt → +3p +3tt)
  { water_temp_zone: 24, pressure: 23, light: 20, temp_trend: 17, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Feb  (-6 → +3p +3tt)
  { water_temp_zone: 23, pressure: 24, light: 16, temp_trend: 19, solunar: 6, wind: 7, moon_phase: 2, precipitation: 3 },  // Mar  (-5 → +2p +3tt)
  { water_temp_zone: 22, pressure: 24, light: 14, temp_trend: 18, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3 },  // Apr  (-4 → +2p +2tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // May  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jul  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 11, solunar: 13, wind: 8, moon_phase: 4, precipitation: 5 }, // Aug  (-2 → +1p +1tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 14, solunar: 11, wind: 7, moon_phase: 4, precipitation: 4 }, // Sep  (-3 → +1p +2tt)
  { water_temp_zone: 22, pressure: 24, light: 16, temp_trend: 16, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Oct  (-4 → +2p +2tt)
  { water_temp_zone: 24, pressure: 23, light: 18, temp_trend: 17, solunar: 6, wind: 7, moon_phase: 2, precipitation: 3 },  // Nov  (-6 → +3p +3tt)
  { water_temp_zone: 26, pressure: 23, light: 20, temp_trend: 17, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2 },  // Dec  (-6 → +3p +3tt)
];

const FW_NORTH: WeightProfile[] = [
  { water_temp_zone: 24, pressure: 25, light: 18, temp_trend: 17, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Jan  (-6 → +3p +3tt)
  { water_temp_zone: 23, pressure: 24, light: 18, temp_trend: 17, solunar: 6, wind: 6, moon_phase: 3, precipitation: 3 },  // Feb  (-5 → +2p +3tt)
  { water_temp_zone: 22, pressure: 24, light: 16, temp_trend: 18, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Mar  (-4 → +2p +2tt)
  { water_temp_zone: 21, pressure: 23, light: 14, temp_trend: 16, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Apr  (-3 → +1p +2tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // May  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jul  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 11, solunar: 13, wind: 8, moon_phase: 4, precipitation: 5 }, // Aug  (-2 → +1p +1tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 14, solunar: 11, wind: 7, moon_phase: 4, precipitation: 4 }, // Sep  (-3 → +1p +2tt)
  { water_temp_zone: 22, pressure: 24, light: 16, temp_trend: 16, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Oct  (-4 → +2p +2tt)
  { water_temp_zone: 23, pressure: 24, light: 18, temp_trend: 17, solunar: 6, wind: 6, moon_phase: 3, precipitation: 3 },  // Nov  (-5 → +2p +3tt)
  { water_temp_zone: 24, pressure: 25, light: 18, temp_trend: 17, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Dec  (-6 → +3p +3tt)
];

const FW_MID: WeightProfile[] = [
  { water_temp_zone: 22, pressure: 24, light: 18, temp_trend: 16, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Jan  (-4 → +2p +2tt)
  { water_temp_zone: 22, pressure: 24, light: 16, temp_trend: 16, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Feb  (-4 → +2p +2tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 9, wind: 8, moon_phase: 3, precipitation: 4 },  // Mar  (-3 → +1p +2tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Apr  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // May  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 11, solunar: 12, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun  (-2 → +1p +1tt)
  { water_temp_zone: 22, pressure: 23, light: 16, temp_trend: 11, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Jul  (-2 → +1p +1tt)
  { water_temp_zone: 22, pressure: 23, light: 16, temp_trend: 11, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Aug  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep  (-2 → +1p +1tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 10, wind: 7, moon_phase: 3, precipitation: 4 }, // Oct  (-3 → +1p +2tt)
  { water_temp_zone: 22, pressure: 24, light: 16, temp_trend: 16, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Nov  (-4 → +2p +2tt)
  { water_temp_zone: 22, pressure: 24, light: 18, temp_trend: 16, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Dec  (-4 → +2p +2tt)
];

const FW_SOUTH: WeightProfile[] = [
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Jan  (-3 → +1p +2tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Feb  (-3 → +1p +2tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Mar  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Apr  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // May  (-2 → +1p +1tt)
  { water_temp_zone: 22, pressure: 23, light: 16, temp_trend: 11, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Jun  (-2 → +1p +1tt)
  { water_temp_zone: 24, pressure: 21, light: 18, temp_trend: 11, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Jul  (-2 → +1p +1tt)
  { water_temp_zone: 24, pressure: 21, light: 18, temp_trend: 11, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Aug  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 15, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Oct  (-2 → +1p +1tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Nov  (-3 → +1p +2tt)
  { water_temp_zone: 21, pressure: 23, light: 16, temp_trend: 16, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Dec  (-3 → +1p +2tt)
];

const FW_DEEP_SOUTH: WeightProfile[] = [
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Jan  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Feb  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Mar  (-2 → +1p +1tt)
  { water_temp_zone: 18, pressure: 23, light: 16, temp_trend: 11, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Apr  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 11, solunar: 12, wind: 8, moon_phase: 4, precipitation: 6 }, // May  (-2 → +1p +1tt)
  { water_temp_zone: 24, pressure: 21, light: 18, temp_trend: 11, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Jun  (-2 → +1p +1tt)
  { water_temp_zone: 26, pressure: 21, light: 18, temp_trend: 11, solunar: 8, wind: 8, moon_phase: 4, precipitation: 4 },  // Jul  (-2 → +1p +1tt)
  { water_temp_zone: 26, pressure: 21, light: 18, temp_trend: 11, solunar: 8, wind: 8, moon_phase: 4, precipitation: 4 },  // Aug  (-2 → +1p +1tt)
  { water_temp_zone: 22, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Oct  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Nov  (-2 → +1p +1tt)
  { water_temp_zone: 20, pressure: 23, light: 16, temp_trend: 13, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Dec  (-2 → +1p +1tt)
];

const FRESHWATER_MONTHLY_WEIGHTS: Record<LatitudeBand, WeightProfile[]> = {
  far_north: FW_FAR_NORTH,
  north: FW_NORTH,
  mid: FW_MID,
  south: FW_SOUTH,
  deep_south: FW_DEEP_SOUTH,
};

// ---------------------------------------------------------------------------
// SALTWATER MONTHLY WEIGHTS — 3 bands × 12 months × 10 components
// Components: water_temp_zone, pressure, light, temp_trend, solunar, wind, moon_phase, precipitation, tide_phase, tide_strength
// All rows sum to 100.
// ---------------------------------------------------------------------------

const SW_NORTH_COAST: WeightProfile[] = [
  { water_temp_zone: 24, pressure: 16, light: 14, temp_trend: 10, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 22, pressure: 16, light: 14, temp_trend: 10, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 20, pressure: 16, light: 12, temp_trend: 12, solunar: 6, wind: 7, moon_phase: 2, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 20, pressure: 16, light: 12, temp_trend: 12, solunar: 6, wind: 7, moon_phase: 3, precipitation: 2, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 22, pressure: 16, light: 14, temp_trend: 10, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 24, pressure: 16, light: 14, temp_trend: 10, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2, tide_phase: 12, tide_strength: 10 },
];

const SW_MID_COAST: WeightProfile[] = [
  { water_temp_zone: 20, pressure: 16, light: 12, temp_trend: 10, solunar: 6, wind: 7, moon_phase: 3, precipitation: 2, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 10, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 10, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 20, pressure: 16, light: 12, temp_trend: 10, solunar: 6, wind: 7, moon_phase: 3, precipitation: 2, tide_phase: 14, tide_strength: 10 },
];

const SW_SOUTH_COAST: WeightProfile[] = [
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 16, tide_strength: 12 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 20, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 8 },
  { water_temp_zone: 22, pressure: 14, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 8 },
  { water_temp_zone: 22, pressure: 14, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 12, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 8 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3, tide_phase: 14, tide_strength: 12 },
];

const SALTWATER_MONTHLY_WEIGHTS: Record<CoastalBand, WeightProfile[]> = {
  north_coast: SW_NORTH_COAST,
  mid_coast: SW_MID_COAST,
  south_coast: SW_SOUTH_COAST,
};

// ---------------------------------------------------------------------------
// BRACKISH MONTHLY WEIGHTS — 3 bands × 12 months × 10 components
// ---------------------------------------------------------------------------

const BK_NORTH_COAST: WeightProfile[] = [
  { water_temp_zone: 26, pressure: 18, light: 14, temp_trend: 12, solunar: 4, wind: 6, moon_phase: 2, precipitation: 4, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 24, pressure: 18, light: 14, temp_trend: 12, solunar: 5, wind: 6, moon_phase: 2, precipitation: 5, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 22, pressure: 18, light: 14, temp_trend: 14, solunar: 6, wind: 7, moon_phase: 2, precipitation: 5, tide_phase: 6, tide_strength: 6 },
  { water_temp_zone: 20, pressure: 18, light: 14, temp_trend: 12, solunar: 8, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 6, tide_strength: 6 },
  { water_temp_zone: 18, pressure: 18, light: 14, temp_trend: 10, solunar: 10, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 16, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 16, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 10, tide_strength: 6 },
  { water_temp_zone: 20, pressure: 18, light: 14, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 22, pressure: 18, light: 14, temp_trend: 12, solunar: 6, wind: 7, moon_phase: 3, precipitation: 4, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 24, pressure: 18, light: 14, temp_trend: 12, solunar: 5, wind: 6, moon_phase: 2, precipitation: 5, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 26, pressure: 18, light: 14, temp_trend: 12, solunar: 4, wind: 6, moon_phase: 2, precipitation: 4, tide_phase: 8, tide_strength: 6 },
];

const BK_MID_COAST: WeightProfile[] = [
  { water_temp_zone: 22, pressure: 18, light: 14, temp_trend: 10, solunar: 6, wind: 7, moon_phase: 3, precipitation: 6, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 20, pressure: 18, light: 14, temp_trend: 10, solunar: 7, wind: 7, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 18, pressure: 18, light: 14, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 16, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 14, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 16, pressure: 18, light: 14, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 16, pressure: 18, light: 14, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 18, light: 14, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 3, precipitation: 5, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 20, pressure: 18, light: 14, temp_trend: 10, solunar: 7, wind: 7, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 6 },
  { water_temp_zone: 22, pressure: 18, light: 14, temp_trend: 10, solunar: 6, wind: 7, moon_phase: 3, precipitation: 6, tide_phase: 8, tide_strength: 6 },
];

const BK_SOUTH_COAST: WeightProfile[] = [
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 14, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 12, tide_strength: 10 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 10 },
  { water_temp_zone: 20, pressure: 16, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 22, pressure: 14, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 22, pressure: 14, light: 14, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 8, tide_strength: 8 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 8 },
  { water_temp_zone: 16, pressure: 16, light: 12, temp_trend: 8, solunar: 10, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 10 },
  { water_temp_zone: 18, pressure: 16, light: 12, temp_trend: 8, solunar: 8, wind: 8, moon_phase: 3, precipitation: 7, tide_phase: 10, tide_strength: 10 },
];

const BRACKISH_MONTHLY_WEIGHTS: Record<CoastalBand, WeightProfile[]> = {
  north_coast: BK_NORTH_COAST,
  mid_coast: BK_MID_COAST,
  south_coast: BK_SOUTH_COAST,
};

// ---------------------------------------------------------------------------
// EXPECTED MONTHLY WATER TEMPERATURES (°F)
// Used for deviation bonus — how does actual temp compare to expected?
// ---------------------------------------------------------------------------

const EXPECTED_WATER_TEMP_FW: Record<LatitudeBand, number[]> = {
  //                   Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
  far_north:         [ 33,  33,  35,  42,  52,  64,  72,  70,  62,  50,  40,  34 ],
  north:             [ 35,  34,  38,  48,  58,  68,  75,  74,  66,  54,  43,  37 ],
  mid:               [ 42,  41,  46,  56,  66,  75,  80,  79,  72,  60,  50,  44 ],
  south:             [ 48,  48,  54,  62,  72,  80,  84,  83,  78,  66,  56,  50 ],
  deep_south:        [ 55,  56,  62,  70,  78,  84,  87,  86,  82,  73,  63,  57 ],
};

const EXPECTED_WATER_TEMP_SW: Record<CoastalBand, number[]> = {
  north_coast:       [ 40,  38,  42,  48,  56,  66,  72,  74,  68,  58,  50,  44 ],
  mid_coast:         [ 55,  54,  58,  64,  72,  80,  84,  85,  80,  72,  64,  58 ],
  south_coast:       [ 68,  68,  72,  76,  80,  84,  86,  87,  85,  80,  74,  70 ],
};

const EXPECTED_WATER_TEMP_BK: Record<CoastalBand, number[]> = {
  north_coast:       [ 38,  36,  40,  47,  55,  65,  71,  72,  66,  56,  48,  42 ],
  mid_coast:         [ 52,  51,  55,  62,  70,  78,  82,  83,  78,  70,  62,  55 ],
  south_coast:       [ 65,  65,  69,  74,  78,  83,  85,  86,  83,  78,  72,  68 ],
};

// ---------------------------------------------------------------------------
// COLD/HOT MONTH CLASSIFICATION by band
// Determines which deviation bonus formula to apply.
// ---------------------------------------------------------------------------

type MonthClass = "cold" | "hot" | "comfortable";

const FW_MONTH_CLASS: Record<LatitudeBand, MonthClass[]> = {
  //                        Jan     Feb     Mar     Apr       May        Jun        Jul     Aug        Sep        Oct        Nov     Dec
  far_north:  ["cold", "cold", "cold", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "cold", "cold"],
  north:      ["cold", "cold", "cold", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "cold", "cold"],
  mid:        ["cold", "cold", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "comfortable", "cold"],
  south:      ["cold", "comfortable", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "hot", "comfortable", "comfortable", "cold"],
  deep_south: ["cold", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "hot", "hot", "comfortable", "comfortable", "comfortable"],
};

const SW_MONTH_CLASS: Record<CoastalBand, MonthClass[]> = {
  north_coast:  ["cold", "cold", "cold", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "cold", "cold"],
  mid_coast:    ["cold", "cold", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "comfortable", "cold"],
  south_coast:  ["comfortable", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "hot", "hot", "comfortable", "comfortable", "comfortable"],
};

const BK_MONTH_CLASS: Record<CoastalBand, MonthClass[]> = {
  north_coast:  ["cold", "cold", "cold", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "cold", "cold"],
  mid_coast:    ["cold", "cold", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "comfortable", "comfortable", "comfortable", "cold"],
  south_coast:  ["comfortable", "comfortable", "comfortable", "comfortable", "comfortable", "hot", "hot", "hot", "hot", "comfortable", "comfortable", "comfortable"],
};

// ---------------------------------------------------------------------------
// Deviation bonus parameters
// ---------------------------------------------------------------------------

const COLD_MONTH_BONUS_PER_F = 2;        // +2% per °F above expected
const HOT_MONTH_BONUS_PER_F = 1.5;       // +1.5% per °F below expected (cooler = better)
const COMFORTABLE_THRESHOLD_F = 3;        // No bonus within ±3°F
const COMFORTABLE_BONUS_PER_F = 1;        // ±1% per °F beyond threshold
const MAX_BONUS_PCT = 15;                 // Cap at ±15%

// ---------------------------------------------------------------------------
// FISHABLE HOURS MASK — REMOVED
// The static time-based fishable hours mask has been removed. Every block is
// now scored on actual hourly conditions (air temp, wind, precip, cloud cover).
// Bad blocks score low naturally because conditions are bad, not because of
// a clock. Only the sub-15°F air temp safety override remains (genuine danger).
// Fish biology time-of-day preferences are handled by the biological feeding
// preference curves in fishBiology.ts (a soft multiplier, not a hard gate).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * Get the coastal band from effective latitude.
 * Thresholds: >=39 → north_coast, 30-39 → mid_coast, <30 → south_coast
 */
export function getCoastalBand(effectiveLatitude: number): CoastalBand {
  if (effectiveLatitude >= 39) return "north_coast";
  if (effectiveLatitude >= 30) return "mid_coast";
  return "south_coast";
}

/**
 * Get interpolated seasonal weights for a given water type, band, and date.
 * Linear interpolation between current month and next month using dayOfMonth.
 */
export function getSeasonalWeights(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number,        // 1-12
  dayOfMonth: number,   // 1-31
  year: number = 2026
): WeightProfile {
  let table: WeightProfile[];

  if (waterType === "freshwater") {
    table = FRESHWATER_MONTHLY_WEIGHTS[band as LatitudeBand];
  } else if (waterType === "saltwater") {
    table = SALTWATER_MONTHLY_WEIGHTS[band as CoastalBand];
  } else {
    table = BRACKISH_MONTHLY_WEIGHTS[band as CoastalBand];
  }

  if (!table) {
    // Fallback: return mid-band June weights as safe default
    if (waterType === "freshwater") table = FRESHWATER_MONTHLY_WEIGHTS.mid;
    else if (waterType === "saltwater") table = SALTWATER_MONTHLY_WEIGHTS.mid_coast;
    else table = BRACKISH_MONTHLY_WEIGHTS.mid_coast;
  }

  const currentIdx = month - 1; // 0-indexed
  const nextIdx = month === 12 ? 0 : month;
  const current = table[currentIdx];
  const next = table[nextIdx];

  const totalDays = daysInMonth(month, year);
  const t = Math.max(0, Math.min(1, (dayOfMonth - 1) / Math.max(totalDays - 1, 1)));

  // Interpolate each component
  const result: WeightProfile = {};
  const allKeys = new Set([...Object.keys(current), ...Object.keys(next)]);
  for (const key of allKeys) {
    const a = current[key] ?? 0;
    const b = next[key] ?? 0;
    result[key] = Math.round(a + (b - a) * t);
  }

  // Normalize to sum to 100 (rounding can cause ±1 drift)
  const sum = Object.values(result).reduce((s, v) => s + v, 0);
  if (sum !== 100 && sum > 0) {
    const diff = 100 - sum;
    // Add/subtract from the largest component
    const largestKey = Object.entries(result).sort((a, b) => b[1] - a[1])[0][0];
    result[largestKey] += diff;
  }

  return result;
}

/**
 * Get the expected water temperature for a given water type, band, and month.
 */
export function getExpectedWaterTemp(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number   // 1-12
): number {
  const idx = month - 1;
  if (waterType === "freshwater") {
    return EXPECTED_WATER_TEMP_FW[band as LatitudeBand]?.[idx] ?? 60;
  }
  if (waterType === "saltwater") {
    return EXPECTED_WATER_TEMP_SW[band as CoastalBand]?.[idx] ?? 70;
  }
  return EXPECTED_WATER_TEMP_BK[band as CoastalBand]?.[idx] ?? 65;
}

/**
 * Compute the deviation bonus percentage for the water_temp_zone component.
 * Positive = water temp is favorable relative to season expectations.
 * Negative = water temp is unfavorable.
 */
export function getDeviationBonusPct(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number,         // 1-12
  actualTempF: number
): number {
  const expected = getExpectedWaterTemp(waterType, band, month);
  const deviation = actualTempF - expected;

  // Get month classification
  let monthClass: MonthClass;
  const idx = month - 1;
  if (waterType === "freshwater") {
    monthClass = FW_MONTH_CLASS[band as LatitudeBand]?.[idx] ?? "comfortable";
  } else if (waterType === "saltwater") {
    monthClass = SW_MONTH_CLASS[band as CoastalBand]?.[idx] ?? "comfortable";
  } else {
    monthClass = BK_MONTH_CLASS[band as CoastalBand]?.[idx] ?? "comfortable";
  }

  let bonusPct = 0;

  if (monthClass === "cold") {
    // Warmer than expected = good → positive bonus
    // Colder than expected = bad → negative bonus
    bonusPct = deviation * COLD_MONTH_BONUS_PER_F;
  } else if (monthClass === "hot") {
    // Cooler than expected = good → positive bonus
    // Warmer than expected = bad → negative bonus
    bonusPct = -deviation * HOT_MONTH_BONUS_PER_F;
  } else {
    // Comfortable months: no bonus within ±threshold, then ±1%/°F beyond
    const absDeviation = Math.abs(deviation);
    if (absDeviation <= COMFORTABLE_THRESHOLD_F) {
      return 0;
    }
    const excessF = absDeviation - COMFORTABLE_THRESHOLD_F;
    // Any deviation beyond threshold is slightly negative (fish are optimized for expected)
    bonusPct = -excessF * COMFORTABLE_BONUS_PER_F;
  }

  return Math.max(-MAX_BONUS_PCT, Math.min(MAX_BONUS_PCT, Math.round(bonusPct * 10) / 10));
}

/**
 * Air temperature safety check — the ONLY hard gate remaining.
 * Sub-15°F air temp is genuinely dangerous (hypothermia risk, ice hazards).
 * All other time-of-day preferences are handled by biological feeding curves.
 */
export function isBlockSafe(blockAirTempF: number | null): boolean {
  if (blockAirTempF !== null && blockAirTempF < 15) {
    return false;
  }
  return true;
}

/**
 * Check if a month is classified as cold for the given band.
 */
export function isColdMonth(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number
): boolean {
  const idx = month - 1;
  if (waterType === "freshwater") return FW_MONTH_CLASS[band as LatitudeBand]?.[idx] === "cold";
  if (waterType === "saltwater") return SW_MONTH_CLASS[band as CoastalBand]?.[idx] === "cold";
  return BK_MONTH_CLASS[band as CoastalBand]?.[idx] === "cold";
}

/**
 * Check if a month is classified as hot for the given band.
 */
export function isHotMonth(
  waterType: WaterType,
  band: LatitudeBand | CoastalBand,
  month: number
): boolean {
  const idx = month - 1;
  if (waterType === "freshwater") return FW_MONTH_CLASS[band as LatitudeBand]?.[idx] === "hot";
  if (waterType === "saltwater") return SW_MONTH_CLASS[band as CoastalBand]?.[idx] === "hot";
  return BK_MONTH_CLASS[band as CoastalBand]?.[idx] === "hot";
}
