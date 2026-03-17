// =============================================================================
// ENGINE V3 — State to Region Mapping
// Maps US state (2-letter code) to one of the 7 TightLines regions.
// Region = rule layer for weighting, timing, and rule selection.
// State = baseline lookup layer.
// =============================================================================

import type { RegionV3 } from '../types.ts';

/**
 * State -> Region mapping. Preserves the 7-region concept from V2.
 * Source: TightLines regional design (northeast, great_lakes, mid_atlantic, etc.)
 */
export const STATE_TO_REGION: Record<string, RegionV3> = {
  // Northeast
  ME: 'northeast',
  NH: 'northeast',
  VT: 'northeast',
  MA: 'northeast',
  RI: 'northeast',
  CT: 'northeast',
  NY: 'northeast',

  // Great Lakes / Upper Midwest
  MI: 'great_lakes_upper_midwest',
  WI: 'great_lakes_upper_midwest',
  MN: 'great_lakes_upper_midwest',
  IL: 'great_lakes_upper_midwest',
  IN: 'great_lakes_upper_midwest',
  OH: 'great_lakes_upper_midwest',
  IA: 'great_lakes_upper_midwest',
  ND: 'great_lakes_upper_midwest',
  SD: 'great_lakes_upper_midwest',

  // Mid-Atlantic
  PA: 'mid_atlantic',
  NJ: 'mid_atlantic',
  DE: 'mid_atlantic',
  MD: 'mid_atlantic',
  DC: 'mid_atlantic',
  WV: 'mid_atlantic',
  VA: 'mid_atlantic',

  // Southeast Atlantic
  NC: 'southeast_atlantic',
  SC: 'southeast_atlantic',
  GA: 'southeast_atlantic',

  // Gulf / Florida
  FL: 'gulf_florida',
  AL: 'gulf_florida',
  MS: 'gulf_florida',
  LA: 'gulf_florida',

  // Interior South / Plains
  TN: 'interior_south_plains',
  KY: 'interior_south_plains',
  AR: 'interior_south_plains',
  OK: 'interior_south_plains',
  KS: 'interior_south_plains',
  MO: 'interior_south_plains',
  NE: 'interior_south_plains',
  TX: 'interior_south_plains',

  // West / Southwest
  MT: 'west_southwest',
  WY: 'west_southwest',
  CO: 'west_southwest',
  NM: 'west_southwest',
  AZ: 'west_southwest',
  UT: 'west_southwest',
  NV: 'west_southwest',
  ID: 'west_southwest',
  WA: 'west_southwest',
  OR: 'west_southwest',
  CA: 'west_southwest',
  AK: 'west_southwest',
  HI: 'west_southwest',
};

export function getRegionFromState(state: string): RegionV3 | null {
  return STATE_TO_REGION[state.toUpperCase()] ?? null;
}
