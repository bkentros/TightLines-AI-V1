// =============================================================================
// ENGINE V2 — CORE CONTRACTS
// All canonical types for the rebuilt TightLines AI V1 deterministic engine.
// Architecture ref: tightlines_v1_engine_architecture_codebase_aligned.md
// API contract ref: tightlines_v1_engine_api_input_contract_sheet_codebase_aligned.md
// =============================================================================

// ---------------------------------------------------------------------------
// Confirmed Environment Modes — the four canonical V1 execution modes
// ---------------------------------------------------------------------------

export type EnvironmentMode =
  | 'freshwater_lake'
  | 'freshwater_river'
  | 'brackish'
  | 'saltwater';

export type WaterType = 'freshwater' | 'brackish' | 'saltwater';

export type FreshwaterSubtype = 'lake' | 'river_stream' | 'reservoir';

// ---------------------------------------------------------------------------
// Regions — 7 mainland USA regions used for seasonal-state inference
// ---------------------------------------------------------------------------

export type Region =
  | 'northeast'
  | 'great_lakes_upper_midwest'
  | 'mid_atlantic'
  | 'southeast_atlantic'
  | 'gulf_florida'
  | 'interior_south_plains'
  | 'west_southwest';

// ---------------------------------------------------------------------------
// Seasonal States
// ---------------------------------------------------------------------------

export type FreshwaterSeasonalState =
  | 'deep_winter'
  | 'winter_transition'
  | 'spring_warming'
  | 'spawn_window_broad'
  | 'post_spawn_broad'
  | 'stable_summer'
  | 'summer_heat_stress'
  | 'early_fall_feed'
  | 'late_fall_cooling';

export type CoastalSeasonalState =
  | 'coastal_cold_slow'
  | 'coastal_cold_but_active'
  | 'coastal_transition_feed'
  | 'coastal_stable_warm'
  | 'coastal_heat_stress';

export type SeasonalState = FreshwaterSeasonalState | CoastalSeasonalState;

// ---------------------------------------------------------------------------
// Water Temperature Source Priority
// ---------------------------------------------------------------------------

export type WaterTempSource =
  | 'manual_user_entered'     // freshwater only; highest priority
  | 'measured_coastal'        // salt/brackish measured source
  | 'inferred_freshwater'     // air-temp model inference
  | 'fallback_measured'       // secondary measured source
  | 'unavailable';            // no source available; degraded state

// ---------------------------------------------------------------------------
// Context Selection — built by the frontend before invoking the engine
// ---------------------------------------------------------------------------

export interface ConfirmedFishingContext {
  waterType: WaterType;
  freshwaterSubtype?: FreshwaterSubtype | null;
  environmentMode: EnvironmentMode;
  manualFreshwaterWaterTempF?: number | null;
}

// ---------------------------------------------------------------------------
// Engine Request Contract — the single confirmed-context request
// ---------------------------------------------------------------------------

export interface HowFishingRequestV2 {
  latitude: number;
  longitude: number;
  units: 'imperial' | 'metric';

  water_type: WaterType;
  freshwater_subtype?: FreshwaterSubtype | null;
  environment_mode: EnvironmentMode;

  manual_freshwater_water_temp_f?: number | null;

  target_date?: string | null;
  mode?: 'daily_detail' | 'weekly_overview';

  env_data?: RawEnvironmentData | null;
}

// ---------------------------------------------------------------------------
// Raw Environment Data — preserved from existing get-environment output
// Keep the existing EnvironmentData shape flowing from get-environment;
// normalization happens inside the engine before the engine modules run.
// ---------------------------------------------------------------------------

export interface RawEnvironmentData {
  // Location
  lat?: number;
  lon?: number;
  timezone?: string | null;
  coastal?: boolean;
  nearest_tide_station_id?: string | null;

  // Weather current
  weather?: {
    temperature?: number | null;
    wind_speed?: number | null;
    wind_direction?: number | null;
    wind_gust?: number | null;
    cloud_cover?: number | null;
    current_precip_in_hr?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    pressure_trend?: string | null;
    [key: string]: unknown;
  } | null;

  // Pressure history
  hourly_pressure?: Array<{ time_utc: string; value: number }> | null;

  // Temperature history
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }> | null;
  daily_air_temp_high_f?: Array<number | null> | null;
  daily_air_temp_low_f?: Array<number | null> | null;

  // Precipitation
  precip_48hr_inches?: number | null;
  precip_7day_inches?: number | null;

  // Sun
  sun?: {
    sunrise?: string | null;
    sunset?: string | null;
    civil_twilight_begin?: string | null;
    civil_twilight_end?: string | null;
    [key: string]: unknown;
  } | null;

  // Moon
  moon?: {
    phase?: string | null;
    illumination?: number | null;
    moonrise?: string | null;
    moonset?: string | null;
    is_waxing?: boolean | null;
    [key: string]: unknown;
  } | null;

  // Solunar
  solunar?: {
    major_periods?: Array<{ start_local: string; end_local: string }> | null;
    minor_periods?: Array<{ start_local: string; end_local: string }> | null;
    [key: string]: unknown;
  } | null;

  // Tides
  tides?: {
    predictions_today?: Array<{ time_local: string; type: 'H' | 'L'; height_ft: number }> | null;
    predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }> | null;
    phase?: string | null;
    [key: string]: unknown;
  } | null;

  // Water temperature
  measured_water_temp_f?: number | null;
  measured_water_temp_source?: string | null;
  measured_water_temp_72h_ago_f?: number | null;

  // Manual freshwater override
  manual_freshwater_water_temp_f?: number | null;

  // Altitude
  altitude_ft?: number | null;

  // Weekly forecast
  forecast_daily?: Array<{
    date: string;
    high_f?: number | null;
    low_f?: number | null;
    wind_mph_avg?: number | null;
    precip_chance_pct?: number | null;
    [key: string]: unknown;
  }> | null;

  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Normalized Environment — the V2 engine consumes this, not raw data
// ---------------------------------------------------------------------------

export interface NormalizedEnvironmentV2 {
  location: {
    lat: number;
    lon: number;
    timezone: string;
    tzOffsetHours?: number | null;  // UTC offset in hours (e.g. -5 for EST)
    coastalHint: boolean;
    nearestTideStationId?: string | null;
    altitudeFt?: number | null;
  };

  current: {
    airTempF?: number | null;
    pressureMb?: number | null;
    windSpeedMph?: number | null;
    windDirectionDeg?: number | null;
    cloudCoverPct?: number | null;
    precipInHr?: number | null;
  };

  histories: {
    hourlyPressureMb?: Array<{ timeUtc: string; value: number }>;
    hourlyAirTempF?: Array<{ timeUtc: string; value: number }>;
    dailyAirTempHighF?: Array<number | null>;
    dailyAirTempLowF?: Array<number | null>;
    precip48hrInches?: number | null;
    precip7dayInches?: number | null;
  };

  solarLunar: {
    sunriseLocal?: string | null;
    sunsetLocal?: string | null;
    civilTwilightBeginLocal?: string | null;
    civilTwilightEndLocal?: string | null;
    moonPhase?: string | null;
    moonIlluminationPct?: number | null;
    moonIsWaxing?: boolean | null;
    solunarMajorPeriods?: Array<{ startLocal: string; endLocal: string }>;
    solunarMinorPeriods?: Array<{ startLocal: string; endLocal: string }>;
  };

  marine: {
    tidePredictionsToday?: Array<{ timeLocal: string; type: 'H' | 'L'; heightFt: number }>;
    tidePredictions30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
    measuredWaterTempF?: number | null;
    measuredWaterTempSource?: string | null;
    measuredWaterTemp72hAgoF?: number | null;
  };

  userOverrides: {
    manualFreshwaterWaterTempF?: number | null;
  };
}

// ---------------------------------------------------------------------------
// Resolved Context — output of the context resolution layer
// ---------------------------------------------------------------------------

export interface ResolvedContext {
  environmentMode: EnvironmentMode;
  waterType: WaterType;
  freshwaterSubtype?: FreshwaterSubtype | null;
  region: Region;
  month: number;             // 1–12
  seasonalState: SeasonalState;
  isFreshwater: boolean;
  isCoastal: boolean;        // saltwater or brackish
  useTideVariables: boolean; // only true for saltwater/brackish
}

// ---------------------------------------------------------------------------
// Reliability Summary — output of the reliability and claim guard layer
// ---------------------------------------------------------------------------

export type ConfidenceBand = 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';

export type DegradedModule =
  | 'water_temp'
  | 'pressure_history'
  | 'tide_data'
  | 'solunar_data'
  | 'precip_data'
  | 'wind_data'
  | 'air_temp';

export interface ReliabilitySummary {
  overallConfidenceBand: ConfidenceBand;
  waterTempSource: WaterTempSource;
  waterTempConfidence: number;           // 0–1
  degradedModules: DegradedModule[];
  criticalInferredInputs: string[];      // human-readable list of what was inferred
  claimGuardActive: boolean;             // if true, LLM should soften biological claims
  safeForTacticalSpecificity: boolean;   // if false, avoid strong positioning/depth claims
  notes: string[];
}

// ---------------------------------------------------------------------------
// Assessment Outputs — output of the condition assessment layer
// ---------------------------------------------------------------------------

export type AssessmentDirection = 'positive' | 'negative' | 'neutral';

export interface SingleAssessment {
  componentScore: number;             // 0–100
  stateLabel: string;
  dominantTags: string[];
  direction: AssessmentDirection;
  confidenceDependency: ConfidenceBand;
  applicable: boolean;                // false = not applicable for this environment mode
}

export interface AssessmentOutputs {
  thermal: SingleAssessment;
  tempTrend: SingleAssessment;
  pressure: SingleAssessment;
  wind: SingleAssessment;
  light: SingleAssessment;
  precipRunoff: SingleAssessment;
  tideCurrent: SingleAssessment;      // applicable only for saltwater/brackish
  moonSolunar: SingleAssessment;
  timeOfDay: SingleAssessment;
}

// ---------------------------------------------------------------------------
// Behavior Outputs — output of the behavior engine layer
// ---------------------------------------------------------------------------

export type ActivityState =
  | 'shutdown'
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'elevated'
  | 'high'
  | 'peak';

export type FeedingReadiness =
  | 'not_feeding'
  | 'reluctant'
  | 'opportunistic'
  | 'active'
  | 'aggressive';

export type OpportunityState =
  | 'poor'
  | 'fair'
  | 'good'
  | 'great';

export type PositioningTendency =
  | 'deep_thermal_refuge'
  | 'deep_stable_structure'
  | 'mid_column_transition'
  | 'shallow_warming_flats'
  | 'shallow_feeding_edges'
  | 'current_breaks_and_structure'
  | 'tidal_cuts_and_creek_mouths'
  | 'variable_follows_tide'
  | 'unknown';

export type PresentationSpeedBias =
  | 'very_slow'
  | 'slow'
  | 'moderate'
  | 'fast'
  | 'aggressive';

export interface BehaviorOutputs {
  activityState: ActivityState;
  feedingReadiness: FeedingReadiness;
  opportunityState: OpportunityState;
  broadPositioningTendency: PositioningTendency;
  presentationSpeedBias: PresentationSpeedBias;
  dominantPositiveDrivers: string[];
  dominantNegativeDrivers: string[];
  suppressionActive: boolean;
  suppressionReasons: string[];
}

// ---------------------------------------------------------------------------
// Opportunity Curve — hourly opportunity windows
// ---------------------------------------------------------------------------

export type WindowQuality = 'best' | 'fair' | 'poor';

export interface OpportunityWindow {
  startLocal: string;           // "HH:MM"
  endLocal: string;             // "HH:MM"
  quality: WindowQuality;
  windowScore: number;          // 0–100
  drivers: string[];
}

export interface OpportunityCurve {
  windows: OpportunityWindow[];
  bestWindows: OpportunityWindow[];
  fairWindows: OpportunityWindow[];
  poorWindows: OpportunityWindow[];
  peakWindowScore: number;
}

// ---------------------------------------------------------------------------
// Score Bands
// ---------------------------------------------------------------------------

export type ScoreBand = 'Poor' | 'Fair' | 'Good' | 'Great';

// ---------------------------------------------------------------------------
// How's Fishing Engine Output — deterministic structured output before LLM
// ---------------------------------------------------------------------------

export interface HowFishingEngineOutput {
  score: number;                        // 0–100
  scoreBand: ScoreBand;
  confidence: ConfidenceBand;
  assessments: AssessmentOutputs;
  behavior: BehaviorOutputs;
  opportunityCurve: OpportunityCurve;
  reliability: ReliabilitySummary;
  resolvedContext: ResolvedContext;
  topDrivers: string[];
  suppressors: string[];
  severeSuppression: boolean;
  severeSuppressionReasons: string[];
  dataQualityNotes: string[];
}

// ---------------------------------------------------------------------------
// LLM Approved Report Payload — what the LLM receives; no raw weather blobs
// ---------------------------------------------------------------------------

export interface LLMApprovedReportPayload {
  environmentMode: EnvironmentMode;
  region: Region;
  seasonalState: SeasonalState;
  score: number;
  scoreBand: ScoreBand;
  confidence: ConfidenceBand;
  bestWindows: OpportunityWindow[];
  fairWindows: OpportunityWindow[];
  poorWindows: OpportunityWindow[];
  topDrivers: string[];
  suppressors: string[];
  activityState: ActivityState;
  feedingReadiness: FeedingReadiness;
  broadPositioningTendency: PositioningTendency;
  presentationSpeedBias: PresentationSpeedBias;
  severeSuppression: boolean;
  severeSuppressionReasons: string[];
  claimGuardActive: boolean;
  dataQualityNotes: string[];
  // Approved environmental facts for narration
  approvedFacts: {
    airTempF?: number | null;
    waterTempF?: number | null;
    waterTempSource: WaterTempSource;
    waterTempIsInferred: boolean;
    windSpeedMph?: number | null;
    pressureStateSummary?: string | null;
    moonPhase?: string | null;
    precipSummary?: string | null;
    tideStateSummary?: string | null;
    timingNarrationHint?: string | null;   // safe LLM timing summary e.g. "best support: 06:30–08:00"
  };
}

// ---------------------------------------------------------------------------
// LLM Narration Output — returned by the LLM after narration
// ---------------------------------------------------------------------------

export interface LLMNarrationOutput {
  headlineSummary: string;
  overallRating: {
    label: ScoreBand;
    summary: string;
  };
  bestTimesToFishToday: Array<{
    timeRange: string;
    label: WindowQuality;
    reasoning: string;
  }>;
  decentTimesToday?: Array<{
    timeRange: string;
    reasoning: string;
  }>;
  worstTimesToFishToday: Array<{
    timeRange: string;
    reasoning: string;
  }>;
  keyFactors: {
    barometricPressure?: string;
    temperatureTrend?: string;
    lightConditions?: string;
    tideOrSolunar?: string;
    moonPhase?: string;
    wind?: string;
    precipitationRecentRain?: string;
    [key: string]: string | undefined;
  };
  tipsForToday: string[];
  strategy?: {
    presentationSpeed: string;
    depthFocus: string;
    approachNote: string;
  };
}

// ---------------------------------------------------------------------------
// How's Fishing Response V2 — single-context daily detail response
// ---------------------------------------------------------------------------

export interface HowFishingResponseV2 {
  feature: 'hows_fishing_feature_v2';
  generated_at: string;
  cache_expires_at: string;

  context: {
    water_type: WaterType;
    freshwater_subtype?: FreshwaterSubtype | null;
    environment_mode: EnvironmentMode;
    region: Region;
    seasonal_state: SeasonalState;
  };

  engine: HowFishingEngineOutput;
  llm: LLMNarrationOutput;
}

// ---------------------------------------------------------------------------
// Weekly Overview Response V2 — single confirmed context weekly forecast
// ---------------------------------------------------------------------------

export interface ForecastDayV2 {
  date: string;
  dailyScore: number;
  scoreBand: ScoreBand;
  summaryLine: string;
  highTempF: number;
  lowTempF: number;
  windMphAvg: number;
  precipChancePct: number;
  frontLabel: string | null;
}

export interface WeeklyOverviewResponseV2 {
  feature: 'hows_fishing_weekly_overview_v2';
  generated_at: string;
  cache_expires_at: string;
  context: {
    environment_mode: EnvironmentMode;
    region: Region;
  };
  days: ForecastDayV2[];
}
