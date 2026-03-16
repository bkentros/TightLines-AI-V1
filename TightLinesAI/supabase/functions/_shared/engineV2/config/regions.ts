// =============================================================================
// ENGINE V2 CONFIG — Regions
// 7 mainland USA regions used for seasonal-state inference.
// =============================================================================

import type { Region } from '../types/contracts.ts';

export interface RegionConfig {
  region: Region;
  label: string;
  // Approximate lat/lon bounds for coordinate-to-region mapping
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}

/**
 * Maps a coordinate pair to one of the 7 V1 regions.
 * Priority is top-to-bottom; first match wins.
 * Coordinates outside all ranges fall back to the closest best match.
 */
export function resolveRegionFromCoords(lat: number, lon: number): Region {
  // Gulf / Florida — the most distinctive southern coastal band
  if (lat >= 24 && lat <= 31.5 && lon >= -98 && lon <= -79.5) {
    return 'gulf_florida';
  }

  // Southeast Atlantic — Atlantic coast south of mid-Atlantic
  if (lat >= 30 && lat <= 36.5 && lon >= -82 && lon <= -75) {
    return 'southeast_atlantic';
  }

  // Mid-Atlantic — mid-coast corridor
  if (lat >= 36.5 && lat <= 42 && lon >= -78 && lon <= -70) {
    return 'mid_atlantic';
  }

  // Northeast — New England and upstate NY
  if (lat >= 41 && lat <= 47.5 && lon >= -77 && lon <= -66) {
    return 'northeast';
  }

  // Great Lakes / Upper Midwest — the northern interior freshwater region
  if (lat >= 40 && lat <= 49 && lon >= -97 && lon <= -76) {
    return 'great_lakes_upper_midwest';
  }

  // West / Southwest — everything west of the Rockies plus mountain west
  if (lon <= -104) {
    return 'west_southwest';
  }

  // Interior South / Plains — everything else in the central/southern interior
  return 'interior_south_plains';
}

export const REGION_LABELS: Record<Region, string> = {
  northeast: 'Northeast',
  great_lakes_upper_midwest: 'Great Lakes / Upper Midwest',
  mid_atlantic: 'Mid-Atlantic',
  southeast_atlantic: 'Southeast Atlantic',
  gulf_florida: 'Gulf / Florida',
  interior_south_plains: 'Interior South / Plains',
  west_southwest: 'West / Southwest',
};
