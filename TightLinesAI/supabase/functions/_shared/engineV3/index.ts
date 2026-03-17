// =============================================================================
// ENGINE V3 — Phase 3 Entrypoint
// Schema, geo resolution, baseline layer, measured scoring engine.
// Windows/narration in later phases.
// =============================================================================

export * from './types.ts';
export { normalizeEnvironmentV3 } from './normalizeEnvironmentV3.ts';
export { resolveGeoContextV3, type ResolveGeoContextInputV3 } from './context/resolveGeoContextV3.ts';
export {
  VARIABLE_CLASSIFICATIONS,
  getVariableClassification,
  variableHasRole,
} from './variableClassification.ts';
export { buildDataCoverageV3 } from './dataCoverage.ts';
export {
  getAirTempBaseline,
  getPrecipBaseline,
  getFreshwaterTempBaseline,
  getCoastalWaterTempBaseline,
  COASTAL_STATES,
} from './baselines/index.ts';

// Phase 3 — Measured scoring engine
export { runScoreEngineV3 } from './scoreEngine.ts';
export { resolvePrimaryConditionsRegime } from './regime/resolveRegime.ts';
export { getWeightProfile, getMonthGroup } from './weights/weightProfiles.ts';
export { reweightForMissingAndRegime } from './weights/reweight.ts';
export { runAssessmentsV3 } from './assessments/assessmentsV3.ts';

// Phase 4 — Window engine
export { runWindowEngineV3 } from './windows/windowEngine.ts';
export { getWindowContextProfile } from './windows/windowContextProfiles.ts';

// Phase 5 — Narration
export { buildNarrationPayloadV3, type NarrationPayloadV3 } from './narration/narrationPayload.ts';
export { shapeV3ToEngineOutput } from './narration/reportAdapter.ts';
