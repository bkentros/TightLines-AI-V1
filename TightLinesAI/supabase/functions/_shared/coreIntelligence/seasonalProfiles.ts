// =============================================================================
// CORE INTELLIGENCE ENGINE — SEASONAL PROFILES
// Monthly weight tables, expected water temperatures, fishable hours,
// and deviation bonus logic per latitude/coastal band.
// =============================================================================

import type { WaterType, LatitudeBand, WaterTempZone } from "./types.ts";

// ---------------------------------------------------------------------------
// Coastal band type (saltwater / brackish regional grouping)
// ---------------------------------------------------------------------------

export type CoastalBand = "north_coast" | "mid_coast" | "south_coast";

// ---------------------------------------------------------------------------
// Weight profile type — component name → weight (sums to 100)
// ---------------------------------------------------------------------------

export type WeightProfile = Record<string, number>;

// ---------------------------------------------------------------------------
// Fishable hours config
// ---------------------------------------------------------------------------

export interface FishableHoursConfig {
  /** Half-hour block indices that are fishable (0 = 00:00–00:30, 47 = 23:30–00:00) */
  fishable_blocks: number[];
  reason: string;
}

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

const FW_FAR_NORTH: WeightProfile[] = [
  { water_temp_zone: 32, pressure: 20, light: 20, temp_trend: 14, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2 },  // Jan
  { water_temp_zone: 30, pressure: 20, light: 20, temp_trend: 14, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Feb
  { water_temp_zone: 28, pressure: 22, light: 16, temp_trend: 16, solunar: 6, wind: 7, moon_phase: 2, precipitation: 3 },  // Mar
  { water_temp_zone: 26, pressure: 22, light: 14, temp_trend: 16, solunar: 8, wind: 8, moon_phase: 3, precipitation: 3 },  // Apr
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // May
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jul
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 10, solunar: 13, wind: 8, moon_phase: 4, precipitation: 5 }, // Aug
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 12, solunar: 11, wind: 7, moon_phase: 4, precipitation: 4 }, // Sep
  { water_temp_zone: 26, pressure: 22, light: 16, temp_trend: 14, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Oct
  { water_temp_zone: 30, pressure: 20, light: 18, temp_trend: 14, solunar: 6, wind: 7, moon_phase: 2, precipitation: 3 },  // Nov
  { water_temp_zone: 32, pressure: 20, light: 20, temp_trend: 14, solunar: 4, wind: 6, moon_phase: 2, precipitation: 2 },  // Dec
];

const FW_NORTH: WeightProfile[] = [
  { water_temp_zone: 30, pressure: 22, light: 18, temp_trend: 14, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Jan
  { water_temp_zone: 28, pressure: 22, light: 18, temp_trend: 14, solunar: 6, wind: 6, moon_phase: 3, precipitation: 3 },  // Feb
  { water_temp_zone: 26, pressure: 22, light: 16, temp_trend: 16, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Mar
  { water_temp_zone: 24, pressure: 22, light: 14, temp_trend: 14, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Apr
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // May
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Jul
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 10, solunar: 13, wind: 8, moon_phase: 4, precipitation: 5 }, // Aug
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 12, solunar: 11, wind: 7, moon_phase: 4, precipitation: 4 }, // Sep
  { water_temp_zone: 26, pressure: 22, light: 16, temp_trend: 14, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Oct
  { water_temp_zone: 28, pressure: 22, light: 18, temp_trend: 14, solunar: 6, wind: 6, moon_phase: 3, precipitation: 3 },  // Nov
  { water_temp_zone: 30, pressure: 22, light: 18, temp_trend: 14, solunar: 5, wind: 6, moon_phase: 2, precipitation: 3 },  // Dec
];

const FW_MID: WeightProfile[] = [
  { water_temp_zone: 26, pressure: 22, light: 18, temp_trend: 14, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Jan
  { water_temp_zone: 26, pressure: 22, light: 16, temp_trend: 14, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Feb
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 9, wind: 8, moon_phase: 3, precipitation: 4 },  // Mar
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Apr
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // May
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 10, solunar: 12, wind: 8, moon_phase: 4, precipitation: 6 }, // Jun
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 10, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Jul
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 10, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Aug
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 10, wind: 7, moon_phase: 3, precipitation: 4 }, // Oct
  { water_temp_zone: 26, pressure: 22, light: 16, temp_trend: 14, solunar: 8, wind: 7, moon_phase: 3, precipitation: 4 },  // Nov
  { water_temp_zone: 26, pressure: 22, light: 18, temp_trend: 14, solunar: 7, wind: 7, moon_phase: 3, precipitation: 3 },  // Dec
];

const FW_SOUTH: WeightProfile[] = [
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Jan
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Feb
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Mar
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Apr
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // May
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 10, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Jun
  { water_temp_zone: 26, pressure: 20, light: 18, temp_trend: 10, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Jul
  { water_temp_zone: 26, pressure: 20, light: 18, temp_trend: 10, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Aug
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 12, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 14, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Oct
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Nov
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 14, solunar: 9, wind: 7, moon_phase: 4, precipitation: 4 },  // Dec
];

const FW_DEEP_SOUTH: WeightProfile[] = [
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Jan
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Feb
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Mar
  { water_temp_zone: 20, pressure: 22, light: 16, temp_trend: 10, solunar: 14, wind: 8, moon_phase: 4, precipitation: 6 }, // Apr
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 10, solunar: 12, wind: 8, moon_phase: 4, precipitation: 6 }, // May
  { water_temp_zone: 26, pressure: 20, light: 18, temp_trend: 10, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Jun
  { water_temp_zone: 28, pressure: 20, light: 18, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 4, precipitation: 4 },  // Jul
  { water_temp_zone: 28, pressure: 20, light: 18, temp_trend: 10, solunar: 8, wind: 8, moon_phase: 4, precipitation: 4 },  // Aug
  { water_temp_zone: 24, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 4 }, // Sep
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Oct
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Nov
  { water_temp_zone: 22, pressure: 22, light: 16, temp_trend: 12, solunar: 10, wind: 8, moon_phase: 4, precipitation: 6 }, // Dec
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
// FISHABLE HOURS by water_temp_zone
// Returns array of half-hour block indices (0-47) that are fishable.
// ---------------------------------------------------------------------------

function blockRange(startHour: number, startMin: number, endHour: number, endMin: number): number[] {
  const startBlock = startHour * 2 + (startMin >= 30 ? 1 : 0);
  const endBlock = endHour * 2 + (endMin >= 30 ? 1 : 0);
  const blocks: number[] = [];
  if (endBlock > startBlock) {
    for (let i = startBlock; i < endBlock; i++) blocks.push(i);
  } else {
    // wraps midnight
    for (let i = startBlock; i < 48; i++) blocks.push(i);
    for (let i = 0; i < endBlock; i++) blocks.push(i);
  }
  return blocks;
}

const ALL_BLOCKS = Array.from({ length: 48 }, (_, i) => i);

const FISHABLE_HOURS_MAP: Record<WaterTempZone, FishableHoursConfig> = {
  near_shutdown_cold: {
    fishable_blocks: blockRange(10, 0, 15, 0),  // 10:00 AM – 3:00 PM
    reason: "Only the warmest midday window; fish nearly immobile in near-shutdown temperatures.",
  },
  lethargic: {
    fishable_blocks: blockRange(9, 0, 17, 0),   // 9:00 AM – 5:00 PM
    reason: "Daytime warming needed to activate lethargic fish.",
  },
  transitional: {
    fishable_blocks: blockRange(6, 0, 21, 0),   // 6:00 AM – 9:00 PM
    reason: "Solid range but still light-dependent for transitional metabolism.",
  },
  active_prime: {
    fishable_blocks: ALL_BLOCKS,                  // All 24 hours
    reason: "Prime metabolism — night fishing is viable.",
  },
  peak_aggression: {
    fishable_blocks: ALL_BLOCKS,                  // All 24 hours
    reason: "Maximum metabolism — any time can produce.",
  },
  thermal_stress_heat: {
    // Dawn: 5AM-9AM, Dusk+Night: 6PM-5AM (wraps)
    fishable_blocks: [
      ...blockRange(5, 0, 9, 0),    // dawn
      ...blockRange(18, 0, 24, 0),   // evening
      ...blockRange(0, 0, 5, 0),     // overnight to dawn
    ],
    reason: "Thermal stress suppresses midday. Best action at dawn, dusk, and overnight.",
  },
};

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
 * Get fishable hours config for a water temp zone.
 */
export function getFishableHoursConfig(zone: WaterTempZone | null): FishableHoursConfig {
  if (zone === null) {
    // Conservative: use transitional as default
    return FISHABLE_HOURS_MAP.transitional;
  }
  return FISHABLE_HOURS_MAP[zone];
}

/**
 * Check if a specific half-hour block is within fishable hours.
 * Also applies air temp safety override: if airTempF < 15 at block time, NOT fishable.
 */
export function isBlockFishable(
  blockIndex: number,
  zone: WaterTempZone | null,
  blockAirTempF: number | null
): boolean {
  // Air temp safety override
  if (blockAirTempF !== null && blockAirTempF < 15) {
    return false;
  }

  const config = getFishableHoursConfig(zone);
  return config.fishable_blocks.includes(blockIndex);
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
