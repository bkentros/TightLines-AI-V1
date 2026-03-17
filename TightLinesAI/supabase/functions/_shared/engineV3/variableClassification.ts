// =============================================================================
// ENGINE V3 — Variable Classification Model
// Phase 1: Formal classification structure for engine variables.
// Each variable family is classifiable by role and provenance.
// =============================================================================

import type {
  VariableClassificationV3,
  VariableRole,
  ValueProvenance,
  EnvironmentModeV3,
} from './types.ts';

const ALL_MODES: EnvironmentModeV3[] = [
  'freshwater_lake',
  'freshwater_river',
  'brackish',
  'saltwater',
];

const FRESHWATER_MODES: EnvironmentModeV3[] = ['freshwater_lake', 'freshwater_river'];
const COASTAL_MODES: EnvironmentModeV3[] = ['brackish', 'saltwater'];

/**
 * Canonical variable classification for V3 engine.
 * Phase 1: structure exists; per-variable production tuning in later phases.
 */
export const VARIABLE_CLASSIFICATIONS: VariableClassificationV3[] = [
  {
    variableFamily: 'air_temp',
    roles: ['measured_score', 'window_input', 'historical_context', 'narration_input'],
    provenance: 'measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'air_temp_trend',
    roles: ['measured_score', 'window_input', 'historical_context', 'narration_input'],
    provenance: 'derived_from_measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'pressure',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'pressure_trend',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'derived_from_measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'wind',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'cloud_cover_light',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'precipitation',
    roles: ['measured_score', 'window_input', 'historical_context', 'narration_input'],
    provenance: 'measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'solunar_moon',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'derived_from_measured',
    applicableModes: ALL_MODES,
  },
  {
    variableFamily: 'tide_current',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'measured',
    applicableModes: COASTAL_MODES,
  },
  {
    variableFamily: 'coastal_water_temp',
    roles: ['measured_score', 'window_input', 'historical_context', 'narration_input'],
    provenance: 'measured',
    applicableModes: COASTAL_MODES,
  },
  {
    variableFamily: 'freshwater_water_temp_range_context',
    roles: ['historical_context', 'narration_input'],
    provenance: 'historical_baseline',
    applicableModes: FRESHWATER_MODES,
  },
  {
    variableFamily: 'daylight_time_of_day',
    roles: ['measured_score', 'window_input', 'narration_input'],
    provenance: 'derived_from_measured',
    applicableModes: ALL_MODES,
  },
];

/**
 * Lookup classification by variable family.
 */
export function getVariableClassification(
  variableFamily: string
): VariableClassificationV3 | undefined {
  return VARIABLE_CLASSIFICATIONS.find(
    (c) => c.variableFamily === variableFamily
  );
}

/**
 * Check if a variable has a given role for a mode.
 */
export function variableHasRole(
  variableFamily: string,
  role: VariableRole,
  mode: EnvironmentModeV3
): boolean {
  const c = getVariableClassification(variableFamily);
  if (!c) return false;
  if (!c.applicableModes.includes(mode)) return false;
  return c.roles.includes(role);
}
