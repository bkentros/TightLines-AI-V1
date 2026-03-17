// =============================================================================
// ENGINE V2 — Context Resolution Layer
// Resolves the full ResolvedContext from normalized environment + confirmed request.
// =============================================================================

import type {
  HowFishingRequestV2,
  NormalizedEnvironmentV2,
  ResolvedContext,
  EnvironmentMode,
  WaterType,
  FreshwaterSubtype,
} from '../types/contracts.ts';
import { resolveRegionFromCoords } from '../config/regions.ts';
import { resolveSeasonalState } from '../config/seasonalStates.ts';
import { isFreshwaterMode, isCoastalMode } from '../config/environmentModes.ts';

/**
 * Validates that the request context fields are internally consistent.
 * Returns an error string if invalid, or null if valid.
 */
export function validateRequestContext(req: HowFishingRequestV2): string | null {
  const { water_type, freshwater_subtype, environment_mode } = req;

  if (water_type === 'freshwater') {
    if (!freshwater_subtype) {
      return 'freshwater_subtype is required when water_type is freshwater';
    }
    if (environment_mode !== 'freshwater_lake' && environment_mode !== 'freshwater_river') {
      return 'environment_mode must be freshwater_lake or freshwater_river for freshwater water_type';
    }
  }

  if (water_type === 'saltwater') {
    if (freshwater_subtype) {
      return 'freshwater_subtype must be null for saltwater water_type';
    }
    if (environment_mode !== 'saltwater') {
      return 'environment_mode must be saltwater for saltwater water_type';
    }
  }

  if (water_type === 'brackish') {
    if (freshwater_subtype) {
      return 'freshwater_subtype must be null for brackish water_type';
    }
    if (environment_mode !== 'brackish') {
      return 'environment_mode must be brackish for brackish water_type';
    }
  }

  return null;
}

/**
 * Resolves the full context object used by all downstream engine modules.
 */
export function resolveContext(
  req: HowFishingRequestV2,
  env: NormalizedEnvironmentV2,
  targetDateOrNow?: string | null
): ResolvedContext {
  const mode: EnvironmentMode = req.environment_mode;
  const waterType: WaterType = req.water_type;
  const freshwaterSubtype: FreshwaterSubtype | null = req.freshwater_subtype ?? null;

  const region = resolveRegionFromCoords(req.latitude, req.longitude);

  const now = targetDateOrNow ? new Date(targetDateOrNow) : new Date();
  const month = now.getMonth() + 1; // 1–12

  // Average air temp for seasonal-state bias
  const avgAirTempF = env.current.airTempF;

  // Water temp for coastal seasonal-state resolution
  const waterTempF = env.marine.measuredWaterTempF ?? null;

  const seasonalState = resolveSeasonalState(mode, region, month, avgAirTempF, waterTempF);

  return {
    environmentMode: mode,
    waterType,
    freshwaterSubtype,
    region,
    month,
    seasonalState,
    isFreshwater: isFreshwaterMode(mode),
    isCoastal: isCoastalMode(mode),
    useTideVariables: isCoastalMode(mode),
  };
}
