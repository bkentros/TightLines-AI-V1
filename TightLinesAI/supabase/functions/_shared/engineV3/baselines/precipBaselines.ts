// =============================================================================
// ENGINE V3 — Precipitation Baseline Lookup
// =============================================================================

import type { PrecipBaseline } from './baselineTypes.ts';
import { PRECIP_BASELINES } from './precipData.ts';

/**
 * Returns state monthly precipitation baseline, or null if not found.
 */
export function getPrecipBaseline(state: string, month: number): PrecipBaseline | null {
  const s = state?.toUpperCase();
  if (!s || month < 1 || month > 12) return null;
  return PRECIP_BASELINES[s]?.[month] ?? null;
}
