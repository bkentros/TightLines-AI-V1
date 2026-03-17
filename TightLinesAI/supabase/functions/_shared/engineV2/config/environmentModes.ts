// =============================================================================
// ENGINE V2 CONFIG — Environment Modes
// Defines the four canonical V1 execution modes and their properties.
// =============================================================================

import type { EnvironmentMode, WaterType } from '../types/contracts.ts';

export interface EnvironmentModeConfig {
  mode: EnvironmentMode;
  waterType: WaterType;
  useTideVariables: boolean;
  label: string;
  bodyTypeDescription: string;
}

export const ENVIRONMENT_MODE_CONFIGS: Record<EnvironmentMode, EnvironmentModeConfig> = {
  freshwater_lake: {
    mode: 'freshwater_lake',
    waterType: 'freshwater',
    useTideVariables: false,
    label: 'Freshwater Lake',
    bodyTypeDescription: 'Lakes, ponds, and reservoirs — stillwater freshwater systems',
  },
  freshwater_river: {
    mode: 'freshwater_river',
    waterType: 'freshwater',
    useTideVariables: false,
    label: 'Freshwater River',
    bodyTypeDescription: 'Rivers and streams — moving freshwater systems',
  },
  brackish: {
    mode: 'brackish',
    waterType: 'brackish',
    useTideVariables: true,
    label: 'Brackish',
    bodyTypeDescription: 'Estuaries, marsh systems, tidal creeks, backwater transition zones',
  },
  saltwater: {
    mode: 'saltwater',
    waterType: 'saltwater',
    useTideVariables: true,
    label: 'Saltwater',
    bodyTypeDescription: 'Bays, flats, coastal inlets, marsh edges, inshore coastline',
  },
};

/**
 * Returns valid environment modes for a given water type selection.
 * Used by the UI to filter body type options after water type is chosen.
 */
export function getValidModesForWaterType(waterType: WaterType): EnvironmentMode[] {
  switch (waterType) {
    case 'freshwater':
      return ['freshwater_lake', 'freshwater_river'];
    case 'brackish':
      return ['brackish'];
    case 'saltwater':
      return ['saltwater'];
  }
}

/**
 * Returns true if the environment mode is a freshwater mode.
 */
export function isFreshwaterMode(mode: EnvironmentMode): boolean {
  return mode === 'freshwater_lake' || mode === 'freshwater_river';
}

/**
 * Returns true if the environment mode is a coastal mode (salt or brackish).
 */
export function isCoastalMode(mode: EnvironmentMode): boolean {
  return mode === 'saltwater' || mode === 'brackish';
}
