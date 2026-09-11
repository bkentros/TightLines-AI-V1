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

export type PierCastStructureRead = {
  structureId: string;
  displayName: string;
  municipality: string;
  disposition: "candidate" | "excluded" | "unresolved";
  accessStatus: "not_live_verified" | "reported_closed" | "route_unverified";
  limitation: string;
};

export type PierCastCitySpeciesRead = {
  speciesId: PierCastSpeciesId;
  inheritance: "candidate" | "conditional" | "historical_lead" | "unresolved";
  seasonalOpportunityCurve: {
    curveId: string;
    calibrationStatus: "provisional" | "approved_for_pilot";
    knots: Array<{ monthDay: string; rating: number }>;
  } | null;
  ratingEnabled: boolean;
  limitation: string | null;
};

export type PierCastScoreRead =
  | {
    status: "available";
    score: number;
    displayScore: number;
    displayText: `${number}/10`;
    label: "Poor" | "Limited" | "Fair" | "Good" | "Excellent";
    ratingName: "FinFindr Opportunity Rating";
    rubricVersion: string;
  }
  | {
    status: "unavailable" | "unsupported" | "restricted";
    score: null;
    reasonCodes: string[];
    ratingName: "FinFindr Opportunity Rating";
  };

export type PierCastCatalogCityRead = {
  cityId: string;
  displayName: string;
  stateCode: "MI" | "WI";
  timezone: "America/Detroit" | "America/Chicago";
  tentative: boolean;
  releaseStatus: "research_only";
  waterTemperatureSource: {
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
    issueCyclesUtc: [0, 6, 12, 18];
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
  } | null;
  structures: PierCastStructureRead[];
  species: PierCastCitySpeciesRead[];
};

export type PierCastCatalogResponse = {
  mode: "public" | "review";
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion: "seasonal-opportunity-bounded-temperature-v2";
  formula:
    "clamp(1, 10, 1 + (seasonalRating - 1) * (0.30 + 0.75 * temperatureSuitability))";
  winterOpenWaterNotice: string;
  disclosure: string;
  cities: PierCastCatalogCityRead[];
};

export type PierCastReviewTemperaturePointRead = {
  validAt: string;
  temperatureC: number;
};

export type PierCastReviewSpeciesOutlookRead = {
  speciesId: PierCastSpeciesId;
  previewMode: "disabled_provisional";
  configurationRatingEnabled: false;
  seasonalRating: number | null;
  seasonalCurveId: string | null;
  temperatureCurveId: string | null;
  temperatureSuitabilityRange: [number, number] | null;
  biological: PierCastScoreRead;
  coverage: {
    status: "complete" | "partial" | "none";
    coveredIntervals: Array<{ start: string; end: string }>;
    fraction: number;
    reasonCodes: string[];
  };
  targetingEligibility: "eligible" | "restricted" | "unknown";
  promotion: {
    status: "eligible" | "limited" | "blocked" | "unknown";
    reasonCodes: string[];
  };
  reasonCodes: string[];
};

export type PierCastReviewDateOutlookRead = {
  localDate: string;
  timezone: string;
  scope: "remaining_day" | "full_day";
  requestedInterval: { start: string; end: string };
  openWaterNoticeApplies: boolean;
  waterTemperature: {
    status: "complete" | "partial" | "none";
    minimumC: number | null;
    maximumC: number | null;
    coverageFraction: number;
    points: PierCastReviewTemperaturePointRead[];
  };
  headline: {
    overall: PierCastScoreRead;
    drivingSpeciesId: PierCastSpeciesId | null;
    headlineMode: "daily_outlook" | "biological_only" | "unavailable";
    promotion: {
      status: "eligible" | "limited" | "blocked" | "unknown";
      reasonCodes: string[];
    };
    reasonCodes: string[];
  };
  species: PierCastReviewSpeciesOutlookRead[];
};

export type PierCastReviewCityOutlookRead = {
  cityId: string;
  displayName: string;
  timezone: "America/Detroit" | "America/Chicago";
  representationDecision: "blocked_insufficient_evidence";
  dates: PierCastReviewDateOutlookRead[];
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
  source: {
    status: "fresh_archived_complete_cycle";
    productId: "NOAA_NOS_LMHOFS_REGULARGRID";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
    cityCount: 5;
    sampleCount: 605;
  };
  cities: PierCastReviewCityOutlookRead[];
};

export type PierCastShadowOutcomeAssessmentStatus =
  | "assessable"
  | "not_assessable_access"
  | "not_assessable_conditions"
  | "insufficient_evidence";

export type PierCastShadowOutcomeInput = {
  dedupeKey: string;
  cityId: string;
  speciesId: "chinook_salmon" | "coho_salmon" | "steelhead" | "brown_trout";
  localDate: string;
  structureName: string;
  observedAt: string | null;
  assessmentStatus: PierCastShadowOutcomeAssessmentStatus;
  result: "positive" | "zero_catch" | "unknown";
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
    cityId: string;
    speciesId: "chinook_salmon" | "coho_salmon" | "steelhead" | "brown_trout";
    localDate: string;
    seasonalRating: number | null;
    displayScore: number | null;
    scoreStatus: "available" | "unavailable";
  }>;
  recentOutcomes: PierCastShadowOutcomeRead[];
};
