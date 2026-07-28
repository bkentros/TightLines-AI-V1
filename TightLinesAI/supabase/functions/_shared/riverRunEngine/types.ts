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

export type MovementEngineId =
  | "fall_cooling"
  | "spring_warming"
  | "winter_thaw"
  | "summer_cooling"
  | "stable_cool_holding";

export type RiverMetric = "flow_cfs" | "gage_height_ft";
export type GaugeProvider = "USGS";
export type TemperatureProvider = "USGS" | "MONITOR_MY_WATERSHED";
export type SupportStatus = "beta" | "verified";
export type ReachQuality = "good" | "acceptable" | "limited";
export type TemperatureSourceType =
  | "same_gauge"
  | "nearby_gauge"
  | "adjusted_reference_gauge"
  | "unavailable";

export type FishabilityBandSource = "audited_absolute";
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
  version: string;
  metric: RiverMetric;
  sourceLabel: string;
  tooLow: { max: number };
  lowFishable: { min: number; max: number };
  ideal: { min: number; max: number };
  highFishable: { min: number; max: number };
  blownOut: { min: number };
  caps: {
    staleGauge: number;
    unknownTrend: number;
    veryLow: number;
    blownOut: number;
    sharpRiseHigh: number;
  };
  evidenceNotes: string;
  sourceNotes: string;
};

export type BaselineCoverage = {
  metric: RiverMetric;
  version: string;
  hasPercentileBaselines: boolean;
  coveredWindowPercent: number;
  minimumHistoryYears: number;
  sourceNotes: string;
};

export type HydraulicSourceRole =
  | "primary"
  | "upstream_context"
  | "tributary_context"
  | "secondary_context";

export type HydraulicSourceConfig = {
  sourceId: string;
  provider: GaugeProvider;
  siteId: string;
  name: string;
  role: HydraulicSourceRole;
  primaryMetric: RiverMetric;
  availableMetrics: RiverMetric[];
  historyYearsAvailable: number;
  maxAgeHours: number;
  reachQuality: ReachQuality;
  reachNotes: string;
};

export type WaterTemperatureSourceRole =
  | "primary"
  | "fallback"
  | "validation";

export type WaterTemperatureSourceConfig = {
  sourceId: string;
  provider: TemperatureProvider;
  siteId: string;
  seriesId?: string;
  name: string;
  role: WaterTemperatureSourceRole;
  priority: number;
  sourceType: Exclude<TemperatureSourceType, "unavailable">;
  maxAgeHours: number;
  smoothingWindowHours: number;
  minValidF: number;
  maxValidF: number;
  maxRateChangeFPerHour: number;
  maxPeerDifferenceF: number;
  adjustmentF?: number;
  reachNotes: string;
  attribution: string;
};

export type WeatherPointConfig = {
  weatherPointId: string;
  lat: number;
  lon: number;
  role: "primary" | "basin_context";
  basinWeight?: number;
};

export type RiverProfile = {
  riverId: string;
  displayName: string;
  state: GreatLakesState;
  region: RiverRunRegion;
  timezone: string;

  mouthLat: number;
  mouthLon: number;
  hydraulicSources: HydraulicSourceConfig[];
  waterTemperatureSources: WaterTemperatureSourceConfig[];
  weatherPoints: WeatherPointConfig[];

  supportStatus: SupportStatus;
  gaugeLimitationCopy: string;
};

export type HistoricalPresenceConfig = {
  maximum: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  curveVersion: string;
  evidenceNotes: string;
  sourceNotes: string;
  anchors: Array<{
    dayOffsetFromStart: number;
    fractionOfMaximum: number;
  }>;
};

export type PushRules = {
  version: string;
  hydraulic: {
    metric: RiverMetric;
    sourceLabel: string;
    lowValue: number;
    highValue: number;
    severeHighValue: number;
    rising24h: {
      absolute: number;
      percent: number;
    };
    meaningfulRise24h: {
      absolute: number;
      percent: number;
    };
    sharpRise24h: {
      absolute: number;
      percent: number;
    };
  };
  rain: {
    meaningful48hIn: number;
    strong48hIn: number;
    heavy48hIn: number;
  };
  temperature: {
    suitabilityLabel: string;
    supportiveMinF: number;
    supportiveMaxF: number;
    tooWarmF: number;
    migrationBarrierF: number;
  };
  caps: {
    staleGauge: number;
    unknownTrend: number;
    noGaugeResponse: number;
    tooWarm: number;
    migrationBarrier: number;
    severeHighFlow: number;
    outsideExtendedWindow: number;
  };
  evidenceNotes: string;
  sourceNotes: string;
};

export type RiverRunProfile = {
  runId: string;
  riverId: string;

  displayName: string;
  species: RiverRunSpecies;
  season: Season;
  runType: RunType;
  movementEngineId: MovementEngineId;

  runWindow: {
    stagingStart: string;
    start: string;
    peak: string;
    end: string;
    lateEnd: string;
    peakWindowDays?: number;
  };

  historicalPresence: HistoricalPresenceConfig;

  push: PushRules;

  fishabilityBands: FishabilityBands;
  baselineCoverage: BaselineCoverage;

  waterTemperature: {
    sourcePriority: string[];
    upstreamFallbackPositiveSignalCap: 0 | 1;
    notes: string;
  };

  conditionsSuggest: {
    baselineVersion: string;
    temperatureSourceId: string;
    minimumUsableYears: number;
    minimumCoveragePercent: number;
    aheadPercentile: number;
    delayedPercentile: number;
    coolEnoughPercentileCap: number;
  };

  userCopyHints?: {
    stagingTip?: string;
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

export type RiverRunConfigurationStatus =
  | "draft"
  | "published"
  | "archived";

export type RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1";
  configVersion: string;
  movementEngineVersion: string;
  river: RiverProfile;
  runs: AuditedRiverRunProfile[];
};

export type RiverRunConfigurationRevision = {
  configKey: string;
  revision: number;
  status: RiverRunConfigurationStatus;
  document: RiverRunConfigurationDocument;
  evidenceNotes: string;
  publishedAt?: string;
};

export type RiverRunValidationCode =
  | RiverRunReasonCode
  | "config_required_field_missing"
  | "config_invalid_value"
  | "config_date_invalid"
  | "config_date_order_invalid"
  | "config_source_invalid"
  | "config_source_reference_missing"
  | "config_movement_engine_unavailable"
  | "config_revision_invalid"
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
