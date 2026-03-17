// =============================================================================
// ENGINE V3 — Baseline Lookup Module
// Phase 2: Historical baseline lookup for context; does not affect scoring.
// =============================================================================

export type {
  AirTempBaseline,
  PrecipBaseline,
  FreshwaterTempBaseline,
  CoastalWaterTempBaseline,
  BaselineQuality,
  FreshwaterSubtype,
} from './baselineTypes.ts';

export { getAirTempBaseline } from './airTempBaselines.ts';
export { getPrecipBaseline } from './precipBaselines.ts';
export { getFreshwaterTempBaseline } from './freshwaterTempBaselines.ts';
export { getCoastalWaterTempBaseline } from './coastalWaterTempBaselines.ts';
export { COASTAL_STATES } from './coastalWaterTempData.ts';
