// =============================================================================
// ENGINE V3 — Freshwater Temperature Baseline Lookup
// Maps V3 freshwater subtypes (lake, river_stream, reservoir) to baseline subtypes.
// =============================================================================

import type { FreshwaterTempBaseline } from './baselineTypes.ts';
import type { FreshwaterSubtypeV3 } from '../types.ts';
import { FRESHWATER_LAKE_BASELINES, FRESHWATER_RIVER_BASELINES } from './freshwaterTempData.ts';

// V3 reservoir -> use lake baseline
const SUBTYPE_MAP: Record<string, 'lake' | 'river_stream'> = {
  lake: 'lake',
  river_stream: 'river_stream',
  reservoir: 'lake',
};

/**
 * Returns state monthly freshwater temperature baseline for the given subtype.
 * reservoir maps to lake baseline.
 */
export function getFreshwaterTempBaseline(
  state: string,
  month: number,
  subtype: FreshwaterSubtypeV3
): FreshwaterTempBaseline | null {
  const s = state?.toUpperCase();
  if (!s || month < 1 || month > 12) return null;
  const mapped = SUBTYPE_MAP[subtype] ?? subtype;
  if (mapped === 'river_stream') {
    return FRESHWATER_RIVER_BASELINES[s]?.[month] ?? null;
  }
  return FRESHWATER_LAKE_BASELINES[s]?.[month] ?? null;
}
