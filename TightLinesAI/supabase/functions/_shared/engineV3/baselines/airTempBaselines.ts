// =============================================================================
// ENGINE V3 — Air Temperature Baseline Lookup
// =============================================================================

import type { AirTempBaseline } from './baselineTypes.ts';
import { AIR_TEMP_BASELINES } from './airTempData.ts';

/**
 * Returns state monthly air temperature baseline, or null if not found.
 */
export function getAirTempBaseline(state: string, month: number): AirTempBaseline | null {
  const s = state?.toUpperCase();
  if (!s || month < 1 || month > 12) return null;
  return AIR_TEMP_BASELINES[s]?.[month] ?? null;
}
