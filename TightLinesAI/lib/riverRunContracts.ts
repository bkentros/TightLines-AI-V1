export type RiverRunSeason = 'spring' | 'summer' | 'fall' | 'winter';

export type RiverRunSupportStatus = 'beta' | 'verified';

export type RiverRunPrimitiveDisplay = {
  score?: number | null;
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

export type RiverRunSchedule = RiverRunPrimitiveDisplay & {
  progressionIndex?: number | null;
  progressionLevel?: string;
  usableDays?: number;
};

export type RiverRunStage = RiverRunPrimitiveDisplay & {
  stage?: string;
};

export type RiverRunFishInRiver = RiverRunPrimitiveDisplay;

export type RiverRunPush = RiverRunPrimitiveDisplay & {
  favorability?: {
    rainSignal?: string;
    flowSignal?: string;
    tempSignal?: string;
    favorabilityIndex?: number;
    favorabilityLevel?: string;
    reasonCodes?: string[];
  };
};

export type RiverRunFishability = RiverRunPrimitiveDisplay;

export type RiverRunGauge = {
  provider?: string;
  siteId?: string;
  metric?: string;
  observedAt?: string;
  value?: number | null;
  band?: string | null;
  trend?: string | null;
  freshness?: string;
};

export type RiverRunWeather = {
  fetchedAt?: string;
  rain24hIn?: number | null;
  rain48hIn?: number | null;
  rain72hIn?: number | null;
  hourlyPrecipitationIn?: number[];
  temp7DayLow?: number | null;
  overnightLows?: number[];
  forecastDaily?: unknown[];
  freshness?: string;
};

export type RiverRunFreshness = {
  gauge?: string;
  weather?: string;
  waterTemperature?: string;
  scheduleDaysUsable?: number;
};

export type RiverRunDataQuality = {
  label: 'Fresh' | 'Partial' | 'Stale' | 'Limited';
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
  schedule: RiverRunSchedule;
  push: RiverRunPush;
  fishability: RiverRunFishability;
  fishInRiver: RiverRunFishInRiver;
  gauge?: RiverRunGauge | null;
  weather?: RiverRunWeather | null;
  freshness: RiverRunFreshness;
  dataQuality: RiverRunDataQuality;
  interpretationNote?: RiverRunInterpretationNote | null;
  secondaryNote?: string;
  safety: RiverRunSafety;
  engineVersion: string;
  configVersion: string;
};
