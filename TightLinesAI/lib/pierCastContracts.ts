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
  accessStatus:
    | "not_live_verified"
    | "reported_closed"
    | "route_unverified";
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
  formulaVersion: "seasonal-ceiling-x-temperature-v1";
  formula: "1 + (seasonalRating - 1) * temperatureSuitability";
  winterOpenWaterNotice: string;
  disclosure: string;
  cities: PierCastCatalogCityRead[];
};
