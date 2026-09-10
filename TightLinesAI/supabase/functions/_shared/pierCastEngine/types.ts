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
  formulaVersion: "seasonal-ceiling-x-temperature-v1";
  formula: "1 + (seasonalRating - 1) * temperatureSuitability";
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
  /** Maximum FinFindr Opportunity Rating under ideal water temperature. */
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
    opportunityFraction: number;
    rating: PierCastAvailableScoreRead;
    formulaVersion: string;
    reasonCodes: [];
  }
  | {
    status: "unavailable";
    seasonalRating: number | null;
    temperatureSuitability: number | null;
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

export type PierCastValidationIssue = {
  code: string;
  field: string;
  message: string;
};
