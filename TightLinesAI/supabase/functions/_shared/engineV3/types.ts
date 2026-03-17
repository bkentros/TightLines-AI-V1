// =============================================================================
// ENGINE V3 — CORE TYPES
// Phase 1: Schema and contract reset.
// V3 normalized environment, context, variable classification, and data coverage.
// =============================================================================

// ---------------------------------------------------------------------------
// Provenance — how each value was obtained
// ---------------------------------------------------------------------------

export type ValueProvenance =
  | 'measured'           // Direct from API/sensor
  | 'derived_from_measured'  // Computed from measured inputs
  | 'historical_baseline'     // From baseline tables (Phase 2+)
  | 'missing';           // Not available; do not fake

// ---------------------------------------------------------------------------
// Variable role — how the engine uses each variable
// ---------------------------------------------------------------------------

export type VariableRole =
  | 'measured_score'     // Eligible for headline score when present
  | 'window_input'       // Used for time-window logic
  | 'historical_context' // For relative-to-normal flags only
  | 'narration_input';   // Safe for LLM to narrate

// ---------------------------------------------------------------------------
// Environment modes (same as V2)
// ---------------------------------------------------------------------------

export type EnvironmentModeV3 =
  | 'freshwater_lake'
  | 'freshwater_river'
  | 'brackish'
  | 'saltwater';

export type WaterTypeV3 = 'freshwater' | 'brackish' | 'saltwater';

export type FreshwaterSubtypeV3 = 'lake' | 'river_stream' | 'reservoir';

// ---------------------------------------------------------------------------
// Regions (7 mainland USA — preserved from V2)
// ---------------------------------------------------------------------------

export type RegionV3 =
  | 'northeast'
  | 'great_lakes_upper_midwest'
  | 'mid_atlantic'
  | 'southeast_atlantic'
  | 'gulf_florida'
  | 'interior_south_plains'
  | 'west_southwest';

// ---------------------------------------------------------------------------
// Typed value with provenance
// ---------------------------------------------------------------------------

export interface TypedValue<T> {
  value: T | null;
  provenance: ValueProvenance;
}

// ---------------------------------------------------------------------------
// V3 Normalized Environment Contract
// Each field group has explicit provenance; nulls are explicit.
// ---------------------------------------------------------------------------

export interface NormalizedEnvironmentV3 {
  geo: {
    lat: number;
    lon: number;
    timezone: string;
    tzOffsetHours: number | null;
    altitudeFt: TypedValue<number>;
  };

  time: {
    /** ISO UTC timestamp of report generation */
    reportTimestampUtc: string;
    /** Local date key YYYY-MM-DD for report date */
    reportDateLocal: string;
    /** Month 1–12 for context */
    month: number;
  };

  atmospheric: {
    airTempF: TypedValue<number>;
    airTempTrend3Day: TypedValue<string>;
    airTempTrendDirectionF: TypedValue<number>;
    pressureMb: TypedValue<number>;
    pressureTrend: TypedValue<string>;
    pressureChangeRateMbHr: TypedValue<number>;
    windSpeedMph: TypedValue<number>;
    windDirectionDeg: TypedValue<number>;
    cloudCoverPct: TypedValue<number>;
  };

  light_daylight: {
    sunriseLocal: TypedValue<string>;
    sunsetLocal: TypedValue<string>;
    civilTwilightBegin: TypedValue<string>;
    civilTwilightEnd: TypedValue<string>;
  };

  precipitation: {
    precip48hrInches: TypedValue<number>;
    precip7dayInches: TypedValue<number>;
    currentPrecipInHr: TypedValue<number>;
  };

  lunar_solunar: {
    moonPhase: TypedValue<string>;
    moonIlluminationPct: TypedValue<number>;
    moonIsWaxing: TypedValue<boolean>;
    solunarMajorPeriods: Array<{ startLocal: string; endLocal: string }>;
    solunarMinorPeriods: Array<{ startLocal: string; endLocal: string }>;
  };

  marine_tide: {
    tidePredictionsToday: Array<{ timeLocal: string; type: 'H' | 'L'; heightFt: number }>;
    tidePredictions30day: Array<{ date: string; high_ft: number; low_ft: number }>;
    tidePhase: TypedValue<string>;
    coastalHint: boolean;
  };

  water_temperature: {
    /** Coastal measured only — no manual or inferred freshwater */
    coastalMeasuredF: TypedValue<number>;
    coastalMeasured72hAgoF: TypedValue<number>;
    coastalSource: TypedValue<string>;
    /** Freshwater: always missing for V3; no score-affecting guess */
    freshwaterMeasuredF: TypedValue<number>;
  };

  /** Phase 2: Historical baseline inputs for context; do not affect scoring */
  historical_context_inputs: HistoricalContextInputsV3;

  /** Populated by buildDataCoverageV3 */
  data_coverage: DataCoverageV3;
}

// ---------------------------------------------------------------------------
// Historical context inputs (Phase 2 baselines)
// ---------------------------------------------------------------------------

export interface HistoricalContextInputsV3 {
  /** State resolution succeeded */
  stateResolved: boolean;
  /** Air temp baseline for state+month (NOAA NCEI normals — primary source) */
  airTempBaseline: {
    avgTempNormalF: number;
    avgHighNormalF: number;
    avgLowNormalF: number;
    rangeLowF: number;
    rangeHighF: number;
    quality: 'high' | 'medium' | 'approximation';
    sourceName: string;
  } | null;
  /** Precipitation baseline for state+month (NOAA NCEI normals — primary source) */
  precipBaseline: {
    precipTotalNormalInches: number;
    rangeLowInches: number;
    rangeHighInches: number;
    quality: 'high' | 'medium' | 'approximation';
    sourceName: string;
  } | null;
  /** Freshwater temp baseline — APPROXIMATION; not equivalent to climate normals */
  freshwaterTempBaseline: {
    tempRangeLowF: number;
    tempRangeHighF: number;
    subtype: string;
    quality: 'approximation';
    methodologyNote: string;
    sourceName: string;
  } | null;
  /** Coastal water temp baseline for state+month (null for inland; NOAA NDBC — primary source) */
  coastalWaterTempBaseline: {
    tempRangeLowF: number;
    tempRangeHighF: number;
    quality: 'high' | 'medium' | 'approximation';
    sourceName: string;
  } | null;
}

// ---------------------------------------------------------------------------
// V3 Data Coverage Structure
// ---------------------------------------------------------------------------

export interface DataCoverageV3 {
  variableGroupsPresent: string[];
  variableGroupsMissing: string[];
  partialDataGroups: string[];
  historicalBaselineAvailable: boolean;
  /** Phase 2: State resolved from coordinates */
  stateResolved: boolean;
  /** Phase 2: Air temp baseline available for state+month */
  airTempBaselineAvailable: boolean;
  /** Phase 2: Precip baseline available for state+month */
  precipBaselineAvailable: boolean;
  /** Phase 2: Freshwater temp baseline available for state+month+subtype */
  freshwaterTempBaselineAvailable: boolean;
  /** Phase 2: Coastal water temp baseline available (coastal states only) */
  coastalWaterTempBaselineAvailable: boolean;
  marineTideRelevant: boolean;
  marineTidePresent: boolean;
  waterTempRelevant: boolean;
  waterTempPresent: boolean;
  freshwaterWaterTempRelevant: boolean;
  freshwaterWaterTempPresent: boolean;
}

// ---------------------------------------------------------------------------
// V3 Location / Context Contract
// ---------------------------------------------------------------------------

export interface GeoContextV3 {
  state: string | null;
  region: RegionV3;
  month: number;
  waterType: WaterTypeV3;
  freshwaterSubtype: FreshwaterSubtypeV3 | null;
  environmentMode: EnvironmentModeV3;
}

// ---------------------------------------------------------------------------
// Variable classification entry
// ---------------------------------------------------------------------------

export interface VariableClassificationV3 {
  variableFamily: string;
  roles: VariableRole[];
  provenance: ValueProvenance;
  applicableModes: EnvironmentModeV3[];
}

// ---------------------------------------------------------------------------
// Phase 3 — Regime and Score Engine
// ---------------------------------------------------------------------------

export type RegimeV3 =
  | 'supportive'
  | 'neutral'
  | 'suppressive'
  | 'highly_suppressive';

export type VariableTierV3 = 'primary' | 'secondary' | 'tertiary';

/** Canonical score variable IDs — used for eligibility and weight lookup */
export type ScoreVariableId =
  | 'air_temp_trend'
  | 'pressure'
  | 'wind'
  | 'cloud_cover_light'
  | 'precipitation'
  | 'solunar_moon'
  | 'daylight_time_of_day'
  | 'tide_current'
  | 'coastal_water_temp';

/** Single variable contribution to the score */
export interface ScoreVariableContributionV3 {
  variableId: ScoreVariableId;
  tier: VariableTierV3;
  componentScore: number;
  baseWeight: number;
  regimeScaledWeight: number;
  finalNormalizedWeight: number;
  direction: 'positive' | 'negative' | 'neutral';
  stateLabel: string;
  tags: string[];
  applicable: boolean;
}

/** V3 score engine result — typed, inspectable */
export interface ScoreEngineResultV3 {
  overallScore: number;
  scoreBand: 'Poor' | 'Fair' | 'Good' | 'Great';
  regime: RegimeV3;
  contributions: ScoreVariableContributionV3[];
  topDrivers: string[];
  topSuppressors: string[];
  weightProfileId: string;
  eligibleVariables: ScoreVariableId[];
  removedVariables: ScoreVariableId[];
  baseWeights: Record<ScoreVariableId, number>;
  regimeScaledWeights: Record<ScoreVariableId, number>;
  finalNormalizedWeights: Record<ScoreVariableId, number>;
  dataCoverageUsed: DataCoverageV3;
}

// ---------------------------------------------------------------------------
// Phase 4 — Window Engine
// ---------------------------------------------------------------------------

export type WindowBlockIdV3 =
  | 'pre_dawn'
  | 'dawn'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'dusk'
  | 'evening'
  | 'night';

export type WindowQualityV3 = 'best' | 'fair' | 'poor';

export type WindowInfluenceSourceV3 = 'primary' | 'secondary' | 'tertiary';

/** Single evaluated window block — typed, inspectable */
export interface WindowBlockV3 {
  blockId: WindowBlockIdV3;
  label: string;
  startLocal: string;
  endLocal: string;
  score: number;
  band: WindowQualityV3;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  suppressors: string[];
  primaryFactorSummary: string;
  secondaryFactorSummary: string;
  tertiaryFactorSummary: string;
  regimeInfluence: string;
  shapedMainlyBy: WindowInfluenceSourceV3;
  tideOverlapMajor: boolean;
  historicalContextNote: string | null;
}

/** V3 window engine result — typed, inspectable */
export interface WindowEngineResultV3 {
  blocks: WindowBlockV3[];
  bestWindows: WindowBlockV3[];
  fairWindows: WindowBlockV3[];
  poorWindows: WindowBlockV3[];
  peakWindowScore: number;
  strongestWindows: WindowBlockV3[];
  weakestWindows: WindowBlockV3[];
  keyReasonsForBest: string[];
  keyReasonsForPoor: string[];
  regimeLimited: boolean;
  tideOverlapMajorFactor: boolean;
}
