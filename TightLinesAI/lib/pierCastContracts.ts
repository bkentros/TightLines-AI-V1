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
  | "largemouth_bass"
  | "atlantic_salmon"
  | "northern_pike"
  | "burbot"
  | "white_perch"
  | "white_bass"
  | "bluegill";

export type PierCastStructureRead = {
  structureId: string;
  displayName: string;
  municipality: string;
  disposition: "candidate" | "excluded" | "unresolved";
  accessStatus:
    | "open_by_published_rules"
    | "not_live_verified"
    | "reported_closed"
    | "route_unverified";
  accessRoute: {
    displayName: string;
    streetAddress: string;
    latitude: number;
    longitude: number;
    coordinateSource: string;
  } | null;
  accessEvidence: Array<{
    evidenceId: string;
    authority: string;
    title: string;
    url: string;
    reviewedAt: string;
  }>;
  liveAccessStatus: "not_live_checked" | "reported_closed";
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
  stateCode: "MI" | "WI" | "IL";
  timezone: "America/Detroit" | "America/Chicago";
  tentative: boolean;
  releaseStatus: "research_only" | "public_research";
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
        coordinateSource:
          | "NOAA Coast Pilot 6"
          | "NOAA Aids to Navigation"
          | "Michigan Water Trails"
          | "U.S. Coast Guard Light List";
      };
      gridCellStatus: "candidate" | "approved_for_pilot";
    } | null;
    issueCyclesUtc: [0, 6, 12, 18];
    forecastHorizonHours: 120;
    freshnessLimitHours: number;
    fallbackPolicy: "unavailable";
    validationObservation: {
      provider: "GLOS Seagull ERDDAP" | "NOAA CO-OPS";
      datasetId: string;
      seasonal: true;
      availabilityStatus: "active_seasonal" | "historical_only";
      temperatureVariable: string;
      aggregateQualityVariable: string;
      reportedUnit: "K" | "C";
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
  formulaVersion: "seasonal-opportunity-bounded-temperature-v2" |
    "piercast-opportunity-modes-bounded-temperature-v3";
  formula: string;
  winterOpenWaterNotice: string;
  disclosure: string;
  cities: PierCastCatalogCityRead[];
};

export type PierCastReviewTemperaturePointRead = {
  validAt: string;
  temperatureC: number;
};

export type PierCastTemperatureEventRead = {
  eventId: string;
  direction: "cooling" | "warming";
  severity: "minor" | "notable" | "major" | "extreme";
  startAt: string;
  endAt: string;
  startTemperatureC: number;
  endTemperatureC: number;
  changeC: number;
  magnitudeC: number;
  durationHours: number;
  triggerWindowHours: 12 | 24;
  maximumChangeByWindowC: {
    hours6: number;
    hours12: number;
    hours24: number;
  };
  startsAtCoverageBoundary: boolean;
  endsAtCoverageBoundary: boolean;
};

export type PierCastTemperatureEventSummaryRead = {
  status: "available" | "partial" | "unavailable";
  detectorVersion: "piercast-temperature-events-v1";
  coverageStart: string | null;
  coverageEnd: string | null;
  pointCount: number;
  segmentCount: number;
  events: PierCastTemperatureEventRead[];
  reasonCodes: string[];
};

export type PierCastReviewSpeciesOutlookRead = {
  speciesId: PierCastSpeciesId;
  previewMode: "disabled_provisional" | "disabled_shadow_only";
  configurationRatingEnabled: false;
  publicEnabled?: false;
  seasonalRating?: number | null;
  seasonalCurveId?: string | null;
  activeMode?: {
    modeCalibrationId: string;
    modeId: string;
    fisheryStrength: number;
    seasonalAvailability: number;
    seasonalPotential: number;
    thermalCurveId: string;
  } | null;
  evaluatedModeCount?: number;
  temperatureCurveId: string | null;
  temperatureSuitabilityRange: [number, number] | null;
  biological: PierCastScoreRead;
  /** Older saved city reports may not include these windows. */
  timeWindows?: Array<{
    slotIndex: 0 | 1 | 2 | 3;
    startAt: string;
    endAt: string;
    phase: "past" | "current" | "upcoming";
    assessedInterval: { start: string; end: string } | null;
    biological: PierCastScoreRead;
    coverage: {
      status: "complete" | "partial" | "none";
      coveredIntervals: Array<{ start: string; end: string }>;
      fraction: number;
      reasonCodes: string[];
    } | null;
  }>;
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
  regulationNotices?: Array<{
    noticeId: string;
    cityId: string;
    speciesId: PierCastSpeciesId | "all";
    startMonthDay: string;
    endMonthDay: string;
    reasonCode: "special_tackle_restriction";
    title: string;
    message: string;
    evidenceIds: readonly string[];
  }>;
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
  temperatureTimeline?: PierCastReviewTemperaturePointRead[];
  /** Optional for saved reports created before the event detector shipped. */
  temperatureEvents?: PierCastTemperatureEventSummaryRead;
  dates: PierCastReviewDateOutlookRead[];
};

export type PierCastDailyScoreSnapshotRead = {
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
  source: { issuedAt: string; fetchedAt: string };
  cities: Array<{
    cityId: string;
    date: PierCastReviewDateOutlookRead;
  }>;
};

export type PierCastReviewOutlookResponse = {
  mode: "review" | "public_research";
  previewOnly: boolean;
  releasePolicyVersion?: string;
  generatedAt: string;
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion:
    | "seasonal-opportunity-bounded-temperature-v2"
    | "seasonal-ceiling-x-temperature-v1"
    | "piercast-opportunity-modes-bounded-temperature-v3";
  disclosure: string;
  source: {
    status: "fresh_archived_complete_cycle";
    productId: "NOAA_NOS_LMHOFS_REGULARGRID";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
    cityCount: number;
    sampleCount: number;
  };
  dailyScoreSnapshot?: PierCastDailyScoreSnapshotRead;
  cities: PierCastReviewCityOutlookRead[];
};

export type PierCastV3ReviewOutlookResponse = {
  mode: "v3_shadow_review";
  previewOnly: true;
  generatedAt: string;
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion: "piercast-opportunity-modes-bounded-temperature-v3";
  formula:
    "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)";
  modeSelection: "maximum_realized_mode_never_sum";
  configVersion: string;
  sourceHashes: {
    pass1CandidatesSha256: string;
    pass1CalibrationSha256: string;
  };
  promotion: { status: "blocked"; reasonCodes: string[] };
  source: PierCastReviewOutlookResponse["source"];
  dailyScoreSnapshot?: never;
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

/** Public standings intentionally contain no species, conditions, or full snapshots. */
export type PierCastLeaderboardResponse = {
  generatedAt: string;
  dailyScoreSnapshot?: Pick<
    PierCastDailyScoreSnapshotRead,
    "status" | "lakeDate" | "setAt" | "publishAt"
  >;
  cities: Array<
    {
      cityId: string;
      dates: Array<
        Pick<PierCastReviewDateOutlookRead, "localDate" | "headline">
      >;
    }
  >;
};
