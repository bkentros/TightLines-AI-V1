export type RiverRunSeason = "spring" | "summer" | "fall" | "winter";

export type RiverRunSupportStatus = "beta" | "verified";

export type RiverRunPrimitiveDisplay = {
  score?: number | null;
  maximum?: number;
  label: string;
  headline?: string;
  detail?: string;
  tip?: string;
  reasonCodes?: string[];
};

export type RiverRunCatalogRun = {
  runId: string;
  displayName: string;
  species: string;
  season: RiverRunSeason;
  runType?: string;
  supportStatus?: RiverRunSupportStatus;
};

export type RiverRunCatalogRiver = {
  riverId: string;
  displayName: string;
  state: string;
  timezone?: string;
  runs: RiverRunCatalogRun[];
};

export type RiverRunCatalogState = {
  state: string;
  displayName?: string;
  rivers: RiverRunCatalogRiver[];
};

export type RiverRunCatalogResponse = {
  states: RiverRunCatalogState[];
};

export type RiverRunConditionsTimingLabel =
  | "Ahead"
  | "Typical"
  | "Delayed"
  | "Insufficient evidence";

export type RiverRunConditionsSuggestLabel =
  | RiverRunConditionsTimingLabel
  | "Evaluating"
  | "Timing complete";

export type RiverRunConditionsCheckpointId =
  | "river_start"
  | "building_start"
  | "peak_start"
  | "peak_complete";

export type RiverRunConditionsSuggest =
  & Omit<
    RiverRunPrimitiveDisplay,
    "label"
  >
  & {
    label: RiverRunConditionsSuggestLabel;
    timingLabel?: RiverRunConditionsTimingLabel | null;
    candidateLabel?: RiverRunConditionsTimingLabel | null;
    checkpointId?: RiverRunConditionsCheckpointId;
    checkpointDate?: string;
    cutoffDate?: string;
    observationStartDate?: string;
    nextCheckpointDate?: string;
    completedCheckpointCount?: number;
    currentIndex?: number | null;
    currentPercentile?: number | null;
    gaugeResponsePercentile?: number | null;
    waterTemperaturePercentile?: number | null;
    usableDays?: number;
    expectedDays?: number;
    coveragePercent?: number;
    historicalYears?: number;
    baselineVersion?: string;
    gaugeSiteId?: string;
    temperatureSourceId?: string;
  };

export type RiverRunStage = RiverRunPrimitiveDisplay & {
  stage?: string;
};

export type RiverRunFishInRiver = RiverRunPrimitiveDisplay & {
  curveFraction?: number;
};

export type RiverRunPush = RiverRunPrimitiveDisplay & {
  rulesVersion?: string;
  components?: {
    hydraulicBase?: number;
    hydraulicAdjustment?: number;
    temperatureModifier?: number;
    rainModifier?: number;
    hydraulicState?: "low" | "normal" | "high" | "severe_high";
    temperatureState?:
      | "supportive"
      | "transitional_warm"
      | "too_warm"
      | "migration_barrier"
      | "cool_plateau";
    rainRole?:
      | "precursor"
      | "partial_precursor"
      | "absorbed_by_gauge"
      | "suppressed_high_flow"
      | "dry"
      | "neutral"
      | "missing";
    appliedCaps?: number[];
  };
};

export type RiverRunFishability = RiverRunPrimitiveDisplay & {
  rulesVersion?: string;
  components?: {
    bandBase?: number;
    trendModifier?: number;
    appliedCaps?: number[];
  };
};

export type RiverRunGauge = {
  provider?: string;
  siteId?: string;
  primaryMetric?: string;
  observedAt?: string;
  value?: number | null;
  band?: string | null;
  trend?: string | null;
  absoluteChange24h?: number | null;
  percentChange24h?: number | null;
};

export type RiverRunWeather = {
  provider?: "OPEN_METEO";
  evidenceType?: "modeled_grid";
  weatherPointId?: string;
  rain24hIn?: number | null;
  rain48hIn?: number | null;
  rain72hIn?: number | null;
  forecastDaily?: unknown[];
};

export type RiverRunWaterTemperature = {
  provider?: string;
  sourceId?: string;
  siteId?: string;
  seriesId?: string;
  observedAt?: string;
  waterTempF?: number | null;
  trend?: string;
  sourceType?: string;
  isUpstreamFallback?: boolean;
  attribution?: string;
};

export type RiverRunFreshness = {
  gauge?: string;
  weather?: string;
  waterTemperature?: string;
  conditionsWaterTemperature?: string;
  conditionsSuggestDaysUsable?: number;
};

export type RiverRunDataQuality = {
  label: "Fresh" | "Partial" | "Stale" | "Limited";
  reasonCodes?: string[];
};

export type RiverRunInterpretationNote = {
  headline: string;
  detail?: string;
  reasonCodes?: string[];
};

export type RiverRunSafety = {
  regulationReminder: string;
  gaugeBasis: string;
  activityDisclaimer: string;
};

export type RiverRunPushHistory = {
  status:
    | "not_started"
    | "active_now"
    | "previously_recorded"
    | "none_recorded"
    | "unavailable"
    | "complete";
  minimumSupportiveScore: number;
  trackingStartDate: string;
  trackingEndDate: string;
  throughDate: string;
  lastSupportiveConditions?: {
    localDate: string;
    refreshSlot: string;
    conditionRefreshAt: string;
    score: number;
    label: string;
  };
};

export type RiverRunSnapshotResponse = {
  riverId: string;
  runId: string;
  localDate: string;
  timezone: string;
  progressionSnapshotAt: string;
  conditionRefreshAt: string;
  refreshSlot: string;
  progressionExpiresAt: string;
  nextConditionRefreshAt: string;
  runStage: RiverRunStage;
  conditionsSuggest: RiverRunConditionsSuggest;
  push: RiverRunPush;
  pushHistory: RiverRunPushHistory;
  fishability: RiverRunFishability;
  fishInRiver: RiverRunFishInRiver;
  gauge?: RiverRunGauge | null;
  weather?: RiverRunWeather | null;
  waterTemperature?: RiverRunWaterTemperature | null;
  conditionsWaterTemperature?: RiverRunWaterTemperature | null;
  freshness: RiverRunFreshness;
  dataQuality: RiverRunDataQuality;
  interpretationNote?: RiverRunInterpretationNote | null;
  secondaryNote?: string;
  safety: RiverRunSafety;
  engineVersion: string;
  configVersion: string;
};
