// =============================================================================
// ENGINE V3 — Geo / Context Resolution
// Phase 2: State-first resolution. lat/lon -> state (Census bounds) -> region (state map).
// Falls back to bounding-box region when state cannot be resolved.
// =============================================================================

import type {
  GeoContextV3,
  RegionV3,
  WaterTypeV3,
  FreshwaterSubtypeV3,
  EnvironmentModeV3,
} from '../types.ts';
import { resolveStateFromCoords } from '../geo/stateBounds.ts';
import { getRegionFromState } from '../geo/stateToRegionMap.ts';

/**
 * Bounding-box region fallback when state is unknown (non-US or edge case).
 */
function resolveRegionFromCoordsFallback(lat: number, lon: number): RegionV3 {
  if (lat >= 24 && lat <= 31.5 && lon >= -98 && lon <= -79.5) return 'gulf_florida';
  if (lat >= 30 && lat <= 36.5 && lon >= -82 && lon <= -75) return 'southeast_atlantic';
  if (lat >= 36.5 && lat <= 42 && lon >= -78 && lon <= -70) return 'mid_atlantic';
  if (lat >= 41 && lat <= 47.5 && lon >= -77 && lon <= -66) return 'northeast';
  if (lat >= 40 && lat <= 49 && lon >= -97 && lon <= -76) return 'great_lakes_upper_midwest';
  if (lon <= -104) return 'west_southwest';
  return 'interior_south_plains';
}

export interface ResolveGeoContextInputV3 {
  latitude: number;
  longitude: number;
  waterType: WaterTypeV3;
  freshwaterSubtype?: FreshwaterSubtypeV3 | null;
  environmentMode: EnvironmentModeV3;
  targetDate?: string | null;
}

/**
 * Resolves full V3 geo context from coordinates and confirmed water context.
 */
export function resolveGeoContextV3(input: ResolveGeoContextInputV3): GeoContextV3 {
  const { latitude, longitude, waterType, freshwaterSubtype, environmentMode, targetDate } = input;

  const state = resolveStateFromCoords(latitude, longitude);
  const region: RegionV3 =
    state ? (getRegionFromState(state) ?? resolveRegionFromCoordsFallback(latitude, longitude))
    : resolveRegionFromCoordsFallback(latitude, longitude);

  const d = targetDate ? new Date(targetDate) : new Date();
  const month = d.getMonth() + 1;

  return {
    state,
    region,
    month,
    waterType,
    freshwaterSubtype: freshwaterSubtype ?? null,
    environmentMode,
  };
}
