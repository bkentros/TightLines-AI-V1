import type {
  PierCastCatalogCityRead,
  PierCastSpeciesId,
} from "./pierCastContracts.ts";

/**
 * Versioned contract for the PierCast conditions renovation.
 *
 * Pass 1 froze the shape, Pass 2 implemented the engine and routes, and Pass 3
 * moved the consumer leaderboard and city report onto it. Legacy v3 response
 * fields remain supported only for the staged compatibility window.
 */
export const PIER_CAST_CONDITIONS_SCHEMA_VERSION =
  "piercast-conditions-v4" as const;
export const PIER_CAST_CONDITIONS_FORMULA_VERSION =
  "seasonal-outlook-plus-thermal-match-v1" as const;
export const PIER_CAST_RANKING_VERSION =
  "species-seasonal-band-then-thermal-v1" as const;
export const PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION =
  "piercast-saved-report-v4" as const;
export const PIER_CAST_CONDITIONS_CATALOG_SCHEMA_VERSION =
  "piercast-conditions-catalog-v2" as const;
export const PIER_CAST_COMMON_TARGET_MINIMUM_SEASONAL_BAND = "fair" as const;
export const PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION =
  "piercast-regional-seasonal-profile-v1" as const;
export const PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION =
  "piercast-thermal-profile-v2" as const;

export const PIER_CAST_SEASONAL_BANDS = [
  "excellent",
  "good",
  "fair",
  "poor",
  "usually_off",
] as const;

export const PIER_CAST_THERMAL_BANDS = [
  "excellent",
  "good",
  "fair",
  "poor",
] as const;

export const PIER_CAST_SEASON_STAGES = [
  "early",
  "building",
  "active",
  "fading",
  "late",
  "off",
] as const;

export type PierCastSeasonalBandV4 = (typeof PIER_CAST_SEASONAL_BANDS)[number];
export type PierCastThermalBandV4 = (typeof PIER_CAST_THERMAL_BANDS)[number];
export type PierCastSeasonStageV4 = (typeof PIER_CAST_SEASON_STAGES)[number];
export type PierCastGreatLakeIdV4 =
  | "superior"
  | "michigan"
  | "huron"
  | "erie"
  | "ontario";

export type PierCastConditionsCatalogCityV4 = Omit<
  PierCastCatalogCityRead,
  "species"
> & {
  /** Discovery-only roster. No retired score or calibration fields are exposed. */
  supportedSpeciesIds: PierCastSpeciesId[];
};

export type PierCastConditionsCatalogResponseV4 = {
  schemaVersion: typeof PIER_CAST_CONDITIONS_CATALOG_SCHEMA_VERSION;
  disclosure: string;
  cities: PierCastConditionsCatalogCityV4[];
};

export type PierCastRegionalSeasonalProfileV4 = {
  schemaVersion: typeof PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION;
  profileId: string;
  speciesId: PierCastSpeciesId;
  lakeId: PierCastGreatLakeIdV4;
  basinId: string;
  referenceLatitude: number;
  latitudeAdjustment: {
    timingShiftDaysPerDegree: number;
    maximumAbsoluteShiftDays: number;
  };
  knots: readonly {
    monthDay: string;
    value: number;
    stage: PierCastSeasonStageV4;
  }[];
  evidenceIds: readonly string[];
  derivation: {
    methodVersion: string;
    sourceConfigVersion: string;
    sourceCalibrationSha256: string;
    excludedInputs: readonly ["fisheryStrength"];
  };
  calibrationStatus: "provisional" | "approved_for_pilot";
};

export type PierCastThermalProfileV4 = {
  schemaVersion: typeof PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION;
  calibrationVersion: string;
  curveId: string;
  speciesId: PierCastSpeciesId;
  context: "modeled_nearshore_surface";
  interpretation: "surface_temperature_compatibility_not_fish_presence";
  acceptedDomainC: readonly [minimumC: number, maximumC: number];
  optimumRangeC: readonly [minimumC: number, maximumC: number];
  knots: readonly {
    temperatureC: number;
    suitability: number;
  }[];
  evidenceIds: readonly string[];
  calibrationStatus: "provisional" | "approved_for_pilot";
};

export const PIER_CAST_SEASONAL_BAND_LABELS = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  usually_off: "Usually Off",
} as const satisfies Record<PierCastSeasonalBandV4, string>;

export const PIER_CAST_THERMAL_BAND_LABELS = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
} as const satisfies Record<PierCastThermalBandV4, string>;

export const PIER_CAST_SEASON_STAGE_LABELS = {
  early: "Early",
  building: "Building",
  active: "Active",
  fading: "Fading",
  late: "Late",
  off: "Off-season",
} as const satisfies Record<PierCastSeasonStageV4, string>;

/**
 * Versioned product thresholds. Values exactly on a boundary enter the more
 * favorable band. Pass 2 must not change these without a new formula version.
 */
export const PIER_CAST_SEASONAL_BAND_THRESHOLDS = Object.freeze({
  excellent: 0.75,
  good: 0.5,
  fair: 0.25,
  poor: 0.05,
});

export const PIER_CAST_THERMAL_BAND_THRESHOLDS = Object.freeze({
  excellent: 0.85,
  good: 0.65,
  fair: 0.35,
});

export type PierCastConditionUnavailableReasonV4 =
  | "seasonal_profile_missing"
  | "seasonal_profile_invalid"
  | "temperature_missing"
  | "temperature_stale"
  | "temperature_partial_horizon"
  | "temperature_out_of_domain"
  | "temperature_curve_missing"
  | "temperature_curve_invalid"
  | "targeting_restricted"
  | "targeting_unknown"
  | "source_unavailable";

export type PierCastSeasonalOutlookReadV4 =
  | {
    status: "available";
    value: number;
    band: PierCastSeasonalBandV4;
    stage: PierCastSeasonStageV4;
    trend: "building" | "steady" | "fading";
    profileId: string;
    basis: "regional" | "regional_with_local_context";
    localDate: string;
    reasonCodes: string[];
  }
  | {
    status: "unavailable";
    value: null;
    band: null;
    stage: null;
    trend: null;
    profileId: string | null;
    basis: null;
    localDate: string;
    reasonCodes: PierCastConditionUnavailableReasonV4[];
  };

export type PierCastThermalMatchReadV4 =
  | {
    status: "available";
    value: number;
    band: PierCastThermalBandV4;
    temperatureC: number;
    optimumRangeC: readonly [minimumC: number, maximumC: number];
    distanceFromOptimumC: number;
    curveId: string;
    validAt: string;
    sourceKind: "model";
    reasonCodes: string[];
  }
  | {
    status: "unavailable";
    value: null;
    band: null;
    temperatureC: number | null;
    optimumRangeC: readonly [number, number] | null;
    distanceFromOptimumC: null;
    curveId: string | null;
    validAt: string | null;
    sourceKind: "model";
    reasonCodes: PierCastConditionUnavailableReasonV4[];
  };

export type PierCastTargetingEligibilityV4 =
  | "eligible"
  | "restricted"
  | "unknown";

export type PierCastRankingDispositionV4 =
  | "ranked"
  | "unranked"
  | "blocked";

export type PierCastLocalFisheryContextV4 = {
  status: "available" | "unavailable";
  label: "established" | "documented" | "limited_evidence" | null;
  evidenceIds: string[];
  /** Local context is explanatory only and never participates in ranking. */
  affectsRanking: false;
};

export type PierCastSpeciesConditionsReadV4 = {
  speciesId: PierCastSpeciesId;
  seasonalOutlook: PierCastSeasonalOutlookReadV4;
  thermalMatch: PierCastThermalMatchReadV4;
  targetingEligibility: PierCastTargetingEligibilityV4;
  rankingDisposition: PierCastRankingDispositionV4;
  localFisheryContext: PierCastLocalFisheryContextV4 | null;
  reasonCodes: string[];
};

export type PierCastModeledTemperaturePointV4 = {
  validAt: string;
  temperatureC: number;
  sourceKind: "model";
};

export type PierCastConditionsCityReadV4 = {
  cityId: string;
  displayName: string;
  stateCode: PierCastLeaderboardCityReadV4["stateCode"];
  lakeId: PierCastGreatLakeIdV4;
  basinId: string;
  timezone: PierCastLeaderboardCityReadV4["timezone"];
  latitude: number;
  longitude: number;
  currentTemperature: PierCastModeledTemperaturePointV4 | null;
  temperatureTimeline: PierCastModeledTemperaturePointV4[];
  species: PierCastSpeciesConditionsReadV4[];
};

export type PierCastConditionsOutlookV4 = {
  schemaVersion: typeof PIER_CAST_CONDITIONS_SCHEMA_VERSION;
  formulaVersion: typeof PIER_CAST_CONDITIONS_FORMULA_VERSION;
  rankingVersion: typeof PIER_CAST_RANKING_VERSION;
  generatedAt: string;
  source: {
    status: "fresh_archived_complete_cycle";
    productId: "NOAA_NOS_LMHOFS_REGULARGRID";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
  };
  cities: PierCastConditionsCityReadV4[];
  disclosure: string;
};

export type PierCastLeaderboardCityReadV4 = PierCastSpeciesConditionsReadV4 & {
  cityId: string;
  displayName: string;
  lakeId: PierCastGreatLakeIdV4;
  stateCode: "MI" | "WI" | "IL" | "IN" | "MN" | "OH" | "PA" | "NY" | "ON";
  timezone:
    | "America/Detroit"
    | "America/Chicago"
    | "America/New_York"
    | "America/Toronto";
  rank: number | null;
};

export type PierCastTargetSpeciesOptionV4 = {
  speciesId: PierCastSpeciesId;
  displayName: string;
  placement: "commonly_targeted_now" | "all_species";
  bestSeasonalBand: PierCastSeasonalBandV4 | null;
  availableCityCount: number;
};

export type PierCastLeaderboardResponseV4 = {
  schemaVersion: typeof PIER_CAST_CONDITIONS_SCHEMA_VERSION;
  formulaVersion: typeof PIER_CAST_CONDITIONS_FORMULA_VERSION;
  rankingVersion: typeof PIER_CAST_RANKING_VERSION;
  generatedAt: string;
  selectedSpeciesId: PierCastSpeciesId | null;
  selectionRequired: boolean;
  targetSpecies: PierCastTargetSpeciesOptionV4[];
  cities: PierCastLeaderboardCityReadV4[];
  disclosure: string;
};

export type PierCastCityReportReadV4 = {
  schemaVersion: typeof PIER_CAST_CONDITIONS_SCHEMA_VERSION;
  formulaVersion: typeof PIER_CAST_CONDITIONS_FORMULA_VERSION;
  generatedAt: string;
  cityId: string;
  displayName: string;
  stateCode: PierCastLeaderboardCityReadV4["stateCode"];
  lakeId: PierCastGreatLakeIdV4;
  basinId: string;
  timezone: PierCastLeaderboardCityReadV4["timezone"];
  selectedSpeciesId: PierCastSpeciesId;
  species: PierCastSpeciesConditionsReadV4[];
  currentTemperature: PierCastModeledTemperaturePointV4 | null;
  temperatureTimeline: PierCastModeledTemperaturePointV4[];
  source: PierCastConditionsOutlookV4["source"];
  disclosure: string;
};

export type PierCastConditionsShadowComparisonV4 = {
  generatedAt: string;
  formulaVersion: typeof PIER_CAST_CONDITIONS_FORMULA_VERSION;
  comparedPairCount: number;
  comparablePairCount: number;
  materialRankMovementCount: number;
  species: Array<{
    speciesId: PierCastSpeciesId;
    candidateCount: number;
    meanAbsoluteRankDelta: number | null;
    pairs: Array<{
      cityId: string;
      speciesId: PierCastSpeciesId;
      legacyScore: number | null;
      legacyRank: number | null;
      conditionsRank: number | null;
      rankDelta: number | null;
      seasonalValue: number | null;
      seasonalBand: PierCastSeasonalBandV4 | null;
      thermalValue: number | null;
      thermalBand: PierCastThermalBandV4 | null;
    }>;
  }>;
};

export type PierCastConditionsReviewResponseV4 = {
  outlook: PierCastConditionsOutlookV4;
  shadowComparison: PierCastConditionsShadowComparisonV4;
};

export type PierCastSavedReportEnvelopeV4 = {
  envelopeVersion: typeof PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION;
  reportKey: string;
  generatedAt: string;
  report: PierCastCityReportReadV4;
  migration: {
    source: "native_v4" | "adapted_legacy";
    legacyFormulaVersion: string | null;
  };
};

export type PierCastSavedReportReadV4 =
  | { status: "available"; envelope: PierCastSavedReportEnvelopeV4 }
  | {
    status: "archived_legacy";
    envelope: null;
    reason: string;
    refreshAvailable: true;
  }
  | { status: "empty"; envelope: null };

export type PierCastMapTimeModeV4 = "now" | "forecast";
export type PierCastMapLayerV4 = "match" | "temperature" | "bathymetry";

export type PierCastMapSpeciesFrameReadV4 = {
  validAt: string;
  temperatureC: number;
  seasonalOutlook: PierCastSeasonalOutlookReadV4;
  thermalMatch: PierCastThermalMatchReadV4;
  targetingEligibility: PierCastTargetingEligibilityV4;
  rankingDisposition: PierCastRankingDispositionV4;
  reasonCodes: string[];
};

export type PierCastConditionsMapCityReadV4 = {
  cityId: string;
  displayName: string;
  stateCode: PierCastLeaderboardCityReadV4["stateCode"];
  lakeId: PierCastGreatLakeIdV4;
  basinId: string;
  timezone: PierCastLeaderboardCityReadV4["timezone"];
  latitude: number;
  longitude: number;
  temperatureTimeline: PierCastModeledTemperaturePointV4[];
  selectedSpecies: {
    speciesId: PierCastSpeciesId;
    localFisheryContext: PierCastLocalFisheryContextV4 | null;
    frames: PierCastMapSpeciesFrameReadV4[];
  } | null;
};

export type PierCastConditionsMapResponseV4 = {
  schemaVersion: typeof PIER_CAST_CONDITIONS_SCHEMA_VERSION;
  formulaVersion: typeof PIER_CAST_CONDITIONS_FORMULA_VERSION;
  generatedAt: string;
  selectedSpeciesId: PierCastSpeciesId | null;
  selectionRequiredForMatch: boolean;
  targetSpecies: PierCastTargetSpeciesOptionV4[];
  cities: PierCastConditionsMapCityReadV4[];
  source: PierCastConditionsOutlookV4["source"];
  disclosure: string;
};

export type PierCastObservedTemperatureStationReadV1 = {
  readingId: string;
  stationId: string;
  datasetId: string;
  displayName: string;
  provider: string;
  latitude: number;
  longitude: number;
  observedAt: string;
  temperatureC: number;
  reportedValue: number;
  reportedUnit: string;
  temperatureVariable: string;
  measurementDepthM: number | null;
  quality: "passed" | "not_evaluated";
  qualityFlag: string | number | null;
  freshness: "fresh" | "aging" | "stale";
  sourceUrl: string;
};

export type PierCastObservedTemperatureMapResponseV1 = {
  schemaVersion: "piercast-observed-temperature-map-v1";
  generatedAt: string;
  stations: PierCastObservedTemperatureStationReadV1[];
  cacheStatus: "fresh" | "stale";
  disclosure: string;
  diagnostics: Array<{
    datasetId: string | null;
    code: string;
    message: string;
  }>;
};

export function pierCastSeasonalBandV4(
  value: number,
): PierCastSeasonalBandV4 | null {
  if (!isUnitInterval(value)) return null;
  if (value >= PIER_CAST_SEASONAL_BAND_THRESHOLDS.excellent) {
    return "excellent";
  }
  if (value >= PIER_CAST_SEASONAL_BAND_THRESHOLDS.good) return "good";
  if (value >= PIER_CAST_SEASONAL_BAND_THRESHOLDS.fair) return "fair";
  if (value >= PIER_CAST_SEASONAL_BAND_THRESHOLDS.poor) return "poor";
  return "usually_off";
}

export function pierCastThermalBandV4(
  value: number,
): PierCastThermalBandV4 | null {
  if (!isUnitInterval(value)) return null;
  if (value >= PIER_CAST_THERMAL_BAND_THRESHOLDS.excellent) {
    return "excellent";
  }
  if (value >= PIER_CAST_THERMAL_BAND_THRESHOLDS.good) return "good";
  if (value >= PIER_CAST_THERMAL_BAND_THRESHOLDS.fair) return "fair";
  return "poor";
}

const SEASONAL_SORT_VALUE: Record<PierCastSeasonalBandV4, number> = {
  excellent: 5,
  good: 4,
  fair: 3,
  poor: 2,
  usually_off: 1,
};

const DISPOSITION_SORT_VALUE: Record<PierCastRankingDispositionV4, number> = {
  ranked: 3,
  unranked: 2,
  blocked: 1,
};

/**
 * Sorts one species only. Seasonal band is authoritative; exact thermal fit
 * orders cities within that band. Local fishery context is deliberately absent.
 */
export function sortPierCastLeaderboardV4(
  speciesId: PierCastSpeciesId,
  candidates: readonly PierCastLeaderboardCityReadV4[],
): PierCastLeaderboardCityReadV4[] {
  for (const candidate of candidates) {
    if (candidate.speciesId !== speciesId) {
      throw new Error("PierCast v4 leaderboard cannot mix species.");
    }
    if (
      candidate.rankingDisposition === "ranked" &&
      (candidate.seasonalOutlook.status !== "available" ||
        candidate.thermalMatch.status !== "available" ||
        candidate.targetingEligibility !== "eligible")
    ) {
      throw new Error(
        `Ranked PierCast candidate ${candidate.cityId} lacks complete eligible conditions.`,
      );
    }
  }

  return [...candidates].sort((left, right) => {
    const disposition = DISPOSITION_SORT_VALUE[right.rankingDisposition] -
      DISPOSITION_SORT_VALUE[left.rankingDisposition];
    if (disposition !== 0) return disposition;

    if (
      left.rankingDisposition === "ranked" &&
      right.rankingDisposition === "ranked" &&
      left.seasonalOutlook.status === "available" &&
      right.seasonalOutlook.status === "available" &&
      left.thermalMatch.status === "available" &&
      right.thermalMatch.status === "available"
    ) {
      const seasonal = SEASONAL_SORT_VALUE[right.seasonalOutlook.band] -
        SEASONAL_SORT_VALUE[left.seasonalOutlook.band];
      if (seasonal !== 0) return seasonal;
      const thermal = right.thermalMatch.value - left.thermalMatch.value;
      if (thermal !== 0) return thermal;
    }

    return left.displayName.localeCompare(right.displayName) ||
      left.cityId.localeCompare(right.cityId);
  });
}

function isUnitInterval(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}
