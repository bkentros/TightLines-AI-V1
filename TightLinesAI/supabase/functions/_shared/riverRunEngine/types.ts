import type { RiverRunReasonCode } from "./copy/reasonCodes.ts";
export type { RiverRunReasonCode } from "./copy/reasonCodes.ts";

export type GreatLakesState = "MI" | "WI" | "IL" | "IN" | "OH" | "PA" | "NY";
export type RiverRunRegion = "great_lakes";
export type Season = "spring" | "summer" | "fall" | "winter";

export type RiverRunSpecies =
  | "chinook_salmon"
  | "coho_salmon"
  | "steelhead"
  | "skamania"
  | "lake_run_brown_trout"
  | "atlantic_salmon";

export type RunType =
  | "fall_spawn"
  | "fall_entry"
  | "winter_run"
  | "spring_spawn"
  | "summer_run"
  | "holding";

export type BehaviorProfile =
  | "fall_cooling_rain_pulse"
  | "spring_warming_flow_pulse"
  | "winter_thaw_flow_window"
  | "summer_cool_rain_pulse"
  | "stable_cool_holding";

export type RiverMetric = "flow_cfs" | "gage_height_ft";
export type GaugeProvider = "USGS" | "OTHER_OFFICIAL";
export type TemperatureProvider = GaugeProvider | "OpenMeteo";
export type SupportStatus = "beta" | "verified";
export type ReachQuality = "good" | "acceptable" | "limited";
export type TemperatureSourceType =
  | "same_gauge"
  | "nearby_gauge"
  | "adjusted_reference_gauge"
  | "air_temp_proxy"
  | "unavailable";

export type FishabilityBandSource = "percentile_default" | "admin_override";
export type FlowBand =
  | "very_low"
  | "low"
  | "normal_fishable"
  | "ideal"
  | "high_fishable"
  | "very_high"
  | "blown_out";
export type GaugeFreshness = "fresh" | "stale" | "missing" | "older_than_24h";
export type WeatherFreshness = "fresh" | "stale" | "missing";
export type RawRainSignal =
  | "missing_rain_data"
  | "dry"
  | "light_rain"
  | "meaningful_rain"
  | "strong_rain"
  | "heavy_rain";
export type RawFlowTrendSignal =
  | "unknown"
  | "falling"
  | "stable"
  | "rising"
  | "meaningful_rise"
  | "sharp_rise";
export type RawTemperatureTrendSignal =
  | "neutral_missing"
  | "strong_cooling"
  | "cooling"
  | "neutral"
  | "warming"
  | "strong_warming";
export type FavorabilityLevel =
  | "very_unfavorable"
  | "unfavorable"
  | "neutral"
  | "favorable"
  | "very_favorable";
export type RunStage =
  | "pre_run"
  | "beginning"
  | "building"
  | "peak"
  | "tapering"
  | "ending"
  | "post_run";

export type PrimitiveDisplay = {
  label: string;
  score?: number | null;
  headline: string;
  detail: string;
  tip: string;
  reasonCodes: RiverRunReasonCode[];
};

export type DataQuality = {
  label: "Fresh" | "Partial" | "Stale" | "Limited";
  reasonCodes: RiverRunReasonCode[];
};

export type InterpretationNote = {
  headline: string;
  detail: string;
  reasonCodes: RiverRunReasonCode[];
};

export type FishabilityBands = {
  metric: RiverMetric;
  tooLow?: { max: number };
  lowFishable?: { min: number; max: number };
  ideal?: { min: number; max: number };
  highFishable?: { min: number; max: number };
  blownOut?: { min: number };
};

export type BaselineCoverage = {
  metric: RiverMetric;
  hasPercentileBaselines: boolean;
  coveredWindowPercent: number;
  minimumHistoryYears: number;
  sourceNotes: string;
};

export type RiverProfile = {
  riverId: string;
  displayName: string;
  state: GreatLakesState;
  region: RiverRunRegion;
  timezone: string;

  mouthLat: number;
  mouthLon: number;
  weatherLat?: number;
  weatherLon?: number;

  gauge: {
    provider: GaugeProvider;
    siteId: string;
    name: string;
    primaryMetric: RiverMetric;
    secondaryMetric?: RiverMetric;
    availableMetrics?: RiverMetric[];
    historyYearsAvailable?: number;
    maxAgeHours?: number;
    reachQuality: ReachQuality;
    reachNotes: string;
  };

  supportStatus: SupportStatus;
  gaugeLimitationCopy: string;
};

export type RiverRunProfile = {
  runId: string;
  riverId: string;

  displayName: string;
  species: RiverRunSpecies;
  season: Season;
  runType: RunType;
  behaviorProfile: BehaviorProfile;

  runWindow: {
    start: string;
    peak: string;
    end: string;
    earlyWindowDays?: number;
    lateWindowDays?: number;
    peakWindowDays?: number;
  };

  runStrength: 1 | 2 | 3 | 4 | 5;

  rainThresholds?: {
    meaningful48hIn?: number;
    strong48hIn?: number;
    heavy48hIn?: number;
  };

  riseThresholds?: {
    rising24hPercent?: number;
    meaningfulRise24hPercent?: number;
    sharpRise24hPercent?: number;
  };

  fishabilityBands?: FishabilityBands;
  baselineCoverage?: BaselineCoverage;

  waterTemperatureSource: {
    type: TemperatureSourceType;
    provider?: TemperatureProvider;
    siteId?: string;
    adjustmentF?: number;
    notes: string;
  };

  temperatureRules?: {
    tooColdF?: number;
    idealMinF?: number;
    idealMaxF?: number;
    tooWarmF?: number;
  };

  userCopyHints?: {
    preRunTip?: string;
    peakTip?: string;
    endingTip?: string;
  };

  researchNotes?: string;
  sourceNotes?: string;
};

export type PublicAuditGate = {
  isEnabled: boolean;
  auditVersion?: string;
  notes?: string;
};

export type AuditedRiverRunProfile = RiverRunProfile & {
  publicAudit: PublicAuditGate;
};

export type RiverRunValidationCode =
  | RiverRunReasonCode
  | "config_required_field_missing"
  | "config_invalid_value"
  | "config_date_invalid"
  | "config_date_order_invalid"
  | "audit_field_missing"
  | "audit_gate_disabled"
  | "audit_notes_missing"
  | "temperature_source_invalid";

export type RiverRunValidationSeverity = "error" | "warning";

export type RiverRunValidationIssue = {
  code: RiverRunValidationCode;
  severity: RiverRunValidationSeverity;
  field: string;
  message: string;
};

export type RiverValidationResult = {
  kind: "river";
  riverId?: string;
  valid: boolean;
  publicVisible: boolean;
  issues: RiverRunValidationIssue[];
};

export type RunValidationResult = {
  kind: "run";
  riverId?: string;
  runId?: string;
  valid: boolean;
  publicVisible: boolean;
  issues: RiverRunValidationIssue[];
};

export type RiverRunCatalogEntry = {
  runId: string;
  displayName: string;
  species: RiverRunSpecies;
  season: Season;
  supportStatus: SupportStatus;
};

export type VisibleRiverRunCatalog = {
  state: GreatLakesState;
  rivers: Array<{
    riverId: string;
    displayName: string;
    runs: RiverRunCatalogEntry[];
  }>;
};
