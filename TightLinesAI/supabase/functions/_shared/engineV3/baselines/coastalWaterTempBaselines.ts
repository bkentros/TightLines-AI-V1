// =============================================================================
// ENGINE V3 — Coastal Water Temperature Baseline Lookup
// Returns null for inland states (no coastal baseline).
// =============================================================================

import type { CoastalWaterTempBaseline } from './baselineTypes.ts';
import {
  COASTAL_WATER_TEMP_BASELINES,
  COASTAL_STATES,
} from './coastalWaterTempData.ts';

/**
 * Returns state monthly coastal water temperature baseline.
 * Returns null for inland states or when not found.
 */
export function getCoastalWaterTempBaseline(
  state: string,
  month: number
): CoastalWaterTempBaseline | null {
  const s = state?.toUpperCase();
  if (!s || month < 1 || month > 12) return null;
  if (!COASTAL_STATES.has(s)) return null;
  return COASTAL_WATER_TEMP_BASELINES[s]?.[month] ?? null;
}
