export const PIER_CAST_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export type PierCastMonth = (typeof PIER_CAST_MONTHS)[number];

export type PierCastSpeciesId =
  | "chinook_salmon"
  | "coho_salmon"
  | "steelhead"
  | "brown_trout"
  | "lake_trout"
  | "walleye"
  | "smallmouth_bass"
  | "freshwater_drum"
  | "yellow_perch"
  | "lake_whitefish"
  | "round_whitefish"
  | "channel_catfish"
  | "largemouth_bass";

export type PierCastCityId =
  | "ludington_mi"
  | "grand_haven_mi"
  | "manistee_mi"
  | "frankfort_elberta_mi"
  | "sheboygan_wi";

export type PierCastMonthEvidenceState =
  | "sourced_biology"
  | "proposed_regional_transfer"
  | "absent_biology_evidence";

export type PierCastBehaviorContext = {
  code: string;
  evidenceState: PierCastMonthEvidenceState;
};

export type PierCastSpeciesProfile = {
  speciesId: PierCastSpeciesId;
  displayName: string;
  aliases: string[];
  behavioralProfileIds: string[];
  monthContexts: Record<PierCastMonth, PierCastBehaviorContext>;
  evidenceIds: string[];
  calibrationStatus: "not_calibrated" | "provisional" | "approved_for_pilot";
  seasonalTemperatureCurves: readonly PierCastTemperatureCurve[] | null;
  ratingEnabled: boolean;
};

export type PierCastStructureDisposition =
  | "candidate"
  | "excluded"
  | "unresolved";

export type PierCastStructure = {
  structureId: string;
  displayName: string;
  municipality: string;
  disposition: PierCastStructureDisposition;
  accessStatus:
    | "not_live_verified"
    | "reported_closed"
    | "route_unverified";
  limitation: string;
};

export type PierCastSpeciesInheritance =
  | "candidate"
  | "conditional"
  | "historical_lead"
  | "unresolved";

export type PierCastCitySpeciesProfile = {
  speciesId: PierCastSpeciesId;
  inheritance: PierCastSpeciesInheritance;
  seasonalOpportunityCurve: PierCastSeasonalOpportunityCurve | null;
  ratingEnabled: boolean;
  limitation: string | null;
};

export type PierCastCityTemperatureSource = {
  sourceId: string;
  productId: string;
  displayName: string;
  kind: "observation" | "model";
  canonicalUnit: "C";
  calibrationStatus: "provisional" | "approved_for_pilot";
  endpoint: string;
  variable: "temp";
  configuredLocation: {
    latitude: number;
    longitude: number;
    verticalSelection: "surface";
    depthIndex: 0;
    gridRow: number;
    gridColumn: number;
    modelBathymetryM: number;
    selectionMethod: "nearest_wet_lakeward_regular_grid_center";
    referencePoint: {
      referenceId: string;
      displayName: string;
      latitude: number;
      longitude: number;
      distanceM: number;
      coordinateSource: "NOAA Coast Pilot 6";
    };
    gridCellStatus: "candidate" | "approved_for_pilot";
  } | null;
  issueCyclesUtc: readonly [0, 6, 12, 18];
  forecastHorizonHours: 120;
  freshnessLimitHours: number;
  fallbackPolicy: "unavailable";
  validationObservation: {
    provider: "GLOS Seagull ERDDAP";
    datasetId: string;
    seasonal: true;
    availabilityStatus: "active_seasonal" | "historical_only";
    temperatureVariable: string;
    aggregateQualityVariable: string;
    reportedUnit: "K";
    nominalDepthM: number | null;
  } | null;
  limitation: string;
};

export type PierCastCityProfile = {
  cityId: PierCastCityId;
  displayName: string;
  stateCode: "MI" | "WI";
  timezone: "America/Detroit" | "America/Chicago";
  tentative: boolean;
  publicEnabled: false;
  waterTemperatureSource: PierCastCityTemperatureSource | null;
  structures: PierCastStructure[];
  species: PierCastCitySpeciesProfile[];
};

export type PierCastCatalogMode = "public" | "review";

export type PierCastCatalogCity = {
  cityId: PierCastCityId;
  displayName: string;
  stateCode: "MI" | "WI";
  timezone: "America/Detroit" | "America/Chicago";
  tentative: boolean;
  releaseStatus: "research_only";
  waterTemperatureSource: PierCastCityTemperatureSource | null;
  structures: PierCastStructure[];
  species: PierCastCitySpeciesProfile[];
};

export type PierCastCatalogResponse = {
  mode: PierCastCatalogMode;
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion: "seasonal-opportunity-bounded-temperature-v2";
  formula:
    "clamp(1, 10, 1 + (seasonalRating - 1) * (0.30 + 0.75 * temperatureSuitability))";
  winterOpenWaterNotice: string;
  disclosure: string;
  cities: PierCastCatalogCity[];
};

export type PierCastTemperatureKnot = {
  temperatureC: number;
  suitability: number;
};

export type PierCastTemperatureCurve = {
  curveId: string;
  calibrationStatus: "provisional" | "approved_for_pilot";
  acceptedDomainC: readonly [number, number];
  knots: readonly PierCastTemperatureKnot[];
};

export type PierCastSeasonalOpportunityKnot = {
  /** Recurring local-calendar anchor in MM-DD format. */
  monthDay: string;
  /** Baseline FinFindr Opportunity Rating under broadly supportive conditions. */
  rating: number;
};

export type PierCastSeasonalOpportunityCurve = {
  curveId: string;
  calibrationStatus: "provisional" | "approved_for_pilot";
  knots: readonly PierCastSeasonalOpportunityKnot[];
};

export type PierCastSeasonalOpportunityEvaluation =
  | {
    status: "available";
    rating: number;
    curveId: string;
    calibrationStatus: PierCastSeasonalOpportunityCurve["calibrationStatus"];
    reasonCodes: [];
  }
  | {
    status: "unavailable";
    rating: null;
    reasonCodes: string[];
  };

export type PierCastTemperatureInputStatus =
  | "valid"
  | "missing"
  | "stale"
  | "partial_horizon"
  | "unreviewed_representation";

export type PierCastUnavailableReasonCode =
  | "rating_not_enabled"
  | "calibration_not_approved"
  | "temperature_missing"
  | "temperature_stale"
  | "temperature_partial_horizon"
  | "temperature_representation_unreviewed"
  | "temperature_out_of_domain"
  | "temperature_curve_invalid"
  | "month_biology_unsupported";

export type PierCastTemperatureSuitability =
  | {
    status: "available";
    suitability: number;
    curveId: string;
    calibrationStatus: PierCastTemperatureCurve["calibrationStatus"];
    reasonCodes: [];
  }
  | {
    status: "unavailable";
    suitability: null;
    reasonCodes: PierCastUnavailableReasonCode[];
  };

export type PierCastRatingLabel =
  | "Poor"
  | "Limited"
  | "Fair"
  | "Good"
  | "Excellent";

export type PierCastAvailableScoreRead = {
  status: "available";
  score: number;
  displayScore: number;
  displayText: `${number}/10`;
  label: PierCastRatingLabel;
  ratingName: "FinFindr Opportunity Rating";
  rubricVersion: string;
};

export type PierCastUnavailableScoreRead = {
  status: "unavailable" | "unsupported" | "restricted";
  score: null;
  reasonCodes: string[];
  ratingName: "FinFindr Opportunity Rating";
};

export type PierCastScoreRead =
  | PierCastAvailableScoreRead
  | PierCastUnavailableScoreRead;

export type PierCastInstantOpportunityRead =
  | {
    status: "available";
    seasonalRating: number;
    temperatureSuitability: number;
    temperatureModifier: number;
    opportunityFraction: number;
    rating: PierCastAvailableScoreRead;
    formulaVersion: string;
    reasonCodes: [];
  }
  | {
    status: "unavailable";
    seasonalRating: number | null;
    temperatureSuitability: number | null;
    temperatureModifier: null;
    opportunityFraction: null;
    rating: PierCastUnavailableScoreRead;
    formulaVersion: string;
    reasonCodes: string[];
  };

export type PierCastInterval = {
  start: string;
  end: string;
};

export type PierCastDailyAssessmentWindow = {
  localDate: string;
  timezone: string;
  scope: "remaining_day" | "full_day";
  requestedInterval: PierCastInterval;
};

export type PierCastScoredSegment = PierCastInterval & {
  scoreAtStart: number;
  scoreAtEnd: number;
};

export type PierCastCoverageRead = {
  status: "complete" | "partial" | "none";
  coveredIntervals: PierCastInterval[];
  fraction: number;
  reasonCodes: string[];
};

export type PierCastDailyAggregate = {
  biological: PierCastScoreRead;
  coverage: PierCastCoverageRead;
};

export type PierCastPromotionRead = {
  status: "eligible" | "limited" | "blocked" | "unknown";
  reasonCodes: string[];
};

export type PierCastSpeciesDailyCandidate = {
  speciesId: PierCastSpeciesId;
  biological: PierCastScoreRead;
  coverage: PierCastCoverageRead;
  targetingEligibility: "eligible" | "restricted" | "unknown";
  promotion: PierCastPromotionRead;
};

export type PierCastDailyHeadline = {
  overall: PierCastScoreRead;
  drivingSpeciesId: PierCastSpeciesId | null;
  headlineMode: "daily_outlook" | "biological_only" | "unavailable";
  promotion: PierCastPromotionRead;
  reasonCodes: string[];
};

export type PierCastReviewTemperaturePoint = {
  validAt: string;
  temperatureC: number;
};

export type PierCastReviewDailyTemperature = {
  status: "complete" | "partial" | "none";
  minimumC: number | null;
  maximumC: number | null;
  coverageFraction: number;
  points: PierCastReviewTemperaturePoint[];
};

export type PierCastReviewSpeciesOutlook = {
  speciesId: PierCastSpeciesId;
  previewMode: "disabled_provisional";
  configurationRatingEnabled: false;
  seasonalRating: number | null;
  seasonalCurveId: string | null;
  temperatureCurveId: string | null;
  temperatureSuitabilityRange: readonly [number, number] | null;
  biological: PierCastScoreRead;
  coverage: PierCastCoverageRead;
  targetingEligibility: "eligible" | "restricted" | "unknown";
  promotion: PierCastPromotionRead;
  reasonCodes: string[];
};

export type PierCastReviewDateOutlook = {
  localDate: string;
  timezone: string;
  scope: "remaining_day" | "full_day";
  requestedInterval: PierCastInterval;
  openWaterNoticeApplies: boolean;
  waterTemperature: PierCastReviewDailyTemperature;
  headline: PierCastDailyHeadline;
  species: PierCastReviewSpeciesOutlook[];
};

export type PierCastReviewCityOutlook = {
  cityId: PierCastCityId;
  displayName: string;
  timezone: "America/Detroit" | "America/Chicago";
  representationDecision: "blocked_insufficient_evidence";
  temperatureTimeline: PierCastReviewTemperaturePoint[];
  dates: PierCastReviewDateOutlook[];
};

export type PierCastDailyScoreSnapshot = {
  status: "locked_daily_snapshot";
  lakeDate: string;
  scoreTimezone: "America/Chicago";
  setAt: string;
  publishAt: string;
  engineVersion: string;
  formulaVersion:
    | "seasonal-opportunity-bounded-temperature-v2"
    | "seasonal-ceiling-x-temperature-v1";
  rubricVersion: string;
  seasonalCalibrationVersion: string;
  temperatureCalibrationVersion: string;
  source: {
    issuedAt: string;
    fetchedAt: string;
  };
  cities: Array<{
    cityId: PierCastCityId;
    date: PierCastReviewDateOutlook;
  }>;
};

export type PierCastReviewOutlookResponse = {
  mode: "review";
  previewOnly: true;
  generatedAt: string;
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion:
    | "seasonal-opportunity-bounded-temperature-v2"
    | "seasonal-ceiling-x-temperature-v1";
  disclosure: string;
  dailyScoreSnapshot?: PierCastDailyScoreSnapshot;
  source: {
    status: "fresh_archived_complete_cycle";
    productId: "NOAA_NOS_LMHOFS_REGULARGRID";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
    cityCount: 5;
    sampleCount: 605;
  };
  cities: PierCastReviewCityOutlook[];
};

export type PierCastShadowOutcomeAssessmentStatus =
  | "assessable"
  | "not_assessable_access"
  | "not_assessable_conditions"
  | "insufficient_evidence";

export type PierCastShadowOutcomeResult =
  | "positive"
  | "zero_catch"
  | "unknown";

export type PierCastShadowOutcomeInput = {
  dedupeKey: string;
  cityId: PierCastCityId;
  speciesId: "chinook_salmon" | "coho_salmon" | "steelhead" | "brown_trout";
  localDate: string;
  structureName: string;
  observedAt: string | null;
  assessmentStatus: PierCastShadowOutcomeAssessmentStatus;
  result: PierCastShadowOutcomeResult;
  effortMinutes: number | null;
  catchCount: number | null;
  sourceType:
    | "owner_trip"
    | "verified_pier_report"
    | "agency_creel"
    | "other_documented";
  evidenceQuality:
    | "direct_effort"
    | "direct_observation"
    | "verified_quantitative"
    | "verified_qualitative";
  sourceReference: string | null;
  notes: string | null;
};

export type PierCastShadowOutcomeCommit = {
  status: "committed" | "already_committed";
  outcomeId: string;
};

export type PierCastShadowOutcomeRead = PierCastShadowOutcomeInput & {
  outcomeId: string;
  createdAt: string;
};

export type PierCastShadowReviewResponse = {
  status: "private_shadow_validation";
  runCount: number;
  forecastCount: number;
  outcomeCount: number;
  pairedForecastCount: number;
  latestRun: {
    runId: string;
    generatedAt: string;
    sourceIssuedAt: string;
    engineVersion: string;
    formulaVersion:
      | "seasonal-opportunity-bounded-temperature-v2"
      | "seasonal-ceiling-x-temperature-v1";
    forecastCount: number;
  } | null;
  outcomeCandidates: Array<{
    cityId: PierCastCityId;
    speciesId: "chinook_salmon" | "coho_salmon" | "steelhead" | "brown_trout";
    localDate: string;
    seasonalRating: number | null;
    displayScore: number | null;
    scoreStatus: "available" | "unavailable";
  }>;
  recentOutcomes: PierCastShadowOutcomeRead[];
};

export type PierCastValidationIssue = {
  code: string;
  field: string;
  message: string;
};
