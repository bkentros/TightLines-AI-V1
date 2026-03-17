// =============================================================================
// ENGINE V3 — Baseline Types
// Typed structures for historical baseline lookups.
// Phase 2: Context inputs only; do not affect scoring.
// =============================================================================

/** Quality/confidence tier for baseline values */
export type BaselineQuality = 'high' | 'medium' | 'approximation';

/** Freshwater subtype for baseline lookup */
export type FreshwaterSubtype = 'lake' | 'river_stream';

// ---------------------------------------------------------------------------
// Air temperature baseline
// ---------------------------------------------------------------------------

export interface AirTempBaseline {
  state: string;
  month: number;
  avgTempNormalF: number;
  avgHighNormalF: number;
  avgLowNormalF: number;
  rangeLowF: number;
  rangeHighF: number;
  sourceName: string;
  sourcePeriod: string;
  quality: BaselineQuality;
}

// ---------------------------------------------------------------------------
// Precipitation baseline
// ---------------------------------------------------------------------------

export interface PrecipBaseline {
  state: string;
  month: number;
  precipTotalNormalInches: number;
  rangeLowInches: number;
  rangeHighInches: number;
  sourceName: string;
  sourcePeriod: string;
  quality: BaselineQuality;
}

// ---------------------------------------------------------------------------
// Freshwater temperature baseline
// ---------------------------------------------------------------------------

export interface FreshwaterTempBaseline {
  state: string;
  month: number;
  subtype: FreshwaterSubtype;
  tempRangeLowF: number;
  tempRangeHighF: number;
  methodologyNote: string;
  sourceName: string;
  sourcePeriod: string;
  quality: BaselineQuality;
}

// ---------------------------------------------------------------------------
// Coastal water temperature baseline
// ---------------------------------------------------------------------------

export interface CoastalWaterTempBaseline {
  stateOrZone: string;
  month: number;
  tempRangeLowF: number;
  tempRangeHighF: number;
  sourceName: string;
  sourcePeriod: string;
  quality: BaselineQuality;
}
