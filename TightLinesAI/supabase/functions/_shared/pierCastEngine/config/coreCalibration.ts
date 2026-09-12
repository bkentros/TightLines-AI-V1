import type {
  PierCastCityId,
  PierCastCityTemperatureSource,
  PierCastSeasonalOpportunityCurve,
  PierCastSpeciesId,
  PierCastTemperatureCurve,
} from "../types.ts";
import { PIER_CAST_CORE_SEASONAL_CURVES } from "./coreSeasonal.generated.ts";
import { PIER_CAST_FROZEN_SPECIES_IDS } from "./scope.ts";

export const PIER_CAST_SEASONAL_CALIBRATION_VERSION =
  "piercast-core-seasonal-v0.4.0";
export const PIER_CAST_TEMPERATURE_CALIBRATION_VERSION =
  "piercast-core-temperature-v0.2.0";

export const PIER_CAST_CORE_SPECIES_IDS = PIER_CAST_FROZEN_SPECIES_IDS;

export type PierCastCoreSpeciesId = (typeof PIER_CAST_CORE_SPECIES_IDS)[number];

/**
 * Product-calibration curves, not measured biological response functions.
 * The broad shoulders deliberately keep temperature secondary to the
 * city/species seasonal opportunity. Every curve remains private and
 * provisional.
 */
export const PIER_CAST_CORE_TEMPERATURE_CURVES_V0_1 = {
  chinook_salmon: {
    curveId: "chinook_salmon__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.3 },
      { temperatureC: 4, suitability: 0.5 },
      { temperatureC: 7, suitability: 0.78 },
      { temperatureC: 9, suitability: 0.95 },
      { temperatureC: 10, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16, suitability: 0.9 },
      { temperatureC: 18, suitability: 0.7 },
      { temperatureC: 20, suitability: 0.45 },
      { temperatureC: 22, suitability: 0.2 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  coho_salmon: {
    curveId: "coho_salmon__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.3 },
      { temperatureC: 4, suitability: 0.5 },
      { temperatureC: 8, suitability: 0.75 },
      { temperatureC: 10, suitability: 0.9 },
      { temperatureC: 12, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16.5, suitability: 0.9 },
      { temperatureC: 19, suitability: 0.65 },
      { temperatureC: 21, suitability: 0.35 },
      { temperatureC: 23, suitability: 0.15 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  steelhead: {
    curveId: "steelhead__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.5 },
      { temperatureC: 2, suitability: 0.6 },
      { temperatureC: 5, suitability: 0.75 },
      { temperatureC: 8, suitability: 0.9 },
      { temperatureC: 10, suitability: 0.97 },
      { temperatureC: 12, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16, suitability: 0.92 },
      { temperatureC: 18, suitability: 0.75 },
      { temperatureC: 20, suitability: 0.5 },
      { temperatureC: 22, suitability: 0.25 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  brown_trout: {
    curveId: "brown_trout__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.35 },
      { temperatureC: 3, suitability: 0.5 },
      { temperatureC: 6, suitability: 0.7 },
      { temperatureC: 8, suitability: 0.85 },
      { temperatureC: 10, suitability: 1 },
      { temperatureC: 16, suitability: 1 },
      { temperatureC: 18, suitability: 0.9 },
      { temperatureC: 20, suitability: 0.7 },
      { temperatureC: 22, suitability: 0.45 },
      { temperatureC: 24, suitability: 0.25 },
      { temperatureC: 26, suitability: 0.1 },
    ],
  },
} as const satisfies Record<PierCastCoreSpeciesId, PierCastTemperatureCurve>;

/**
 * Active private v0.2 candidate. The post-implementation biological audit
 * raised only the sub-50 F cold shoulders. Every v0.1 value at 10 C / 50 F
 * and warmer is retained exactly so the warm-side decision stays isolated.
 * V0.1 remains exported above for deterministic side-by-side validation.
 */
export const PIER_CAST_CORE_TEMPERATURE_CURVES = {
  chinook_salmon: {
    curveId: "chinook_salmon__shared_temperature__v0_2",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.45 },
      { temperatureC: 4, suitability: 0.6 },
      { temperatureC: 7, suitability: 0.82 },
      { temperatureC: 9, suitability: 0.95 },
      { temperatureC: 10, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16, suitability: 0.9 },
      { temperatureC: 18, suitability: 0.7 },
      { temperatureC: 20, suitability: 0.45 },
      { temperatureC: 22, suitability: 0.2 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  coho_salmon: {
    curveId: "coho_salmon__shared_temperature__v0_2",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.5 },
      { temperatureC: 4, suitability: 0.65 },
      { temperatureC: 7, suitability: 0.82 },
      { temperatureC: 10, suitability: 0.9 },
      { temperatureC: 12, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16.5, suitability: 0.9 },
      { temperatureC: 19, suitability: 0.65 },
      { temperatureC: 21, suitability: 0.35 },
      { temperatureC: 23, suitability: 0.15 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  steelhead: {
    curveId: "steelhead__shared_temperature__v0_2",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.65 },
      { temperatureC: 2, suitability: 0.7 },
      { temperatureC: 5, suitability: 0.82 },
      { temperatureC: 8, suitability: 0.93 },
      { temperatureC: 10, suitability: 0.97 },
      { temperatureC: 12, suitability: 1 },
      { temperatureC: 14, suitability: 1 },
      { temperatureC: 16, suitability: 0.92 },
      { temperatureC: 18, suitability: 0.75 },
      { temperatureC: 20, suitability: 0.5 },
      { temperatureC: 22, suitability: 0.25 },
      { temperatureC: 26, suitability: 0.05 },
    ],
  },
  brown_trout: {
    curveId: "brown_trout__shared_temperature__v0_2",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 26],
    knots: [
      { temperatureC: 0, suitability: 0.6 },
      { temperatureC: 3, suitability: 0.7 },
      { temperatureC: 6, suitability: 0.82 },
      { temperatureC: 8, suitability: 0.92 },
      { temperatureC: 10, suitability: 1 },
      { temperatureC: 16, suitability: 1 },
      { temperatureC: 18, suitability: 0.9 },
      { temperatureC: 20, suitability: 0.7 },
      { temperatureC: 22, suitability: 0.45 },
      { temperatureC: 24, suitability: 0.25 },
      { temperatureC: 26, suitability: 0.1 },
    ],
  },
} as const satisfies Record<PierCastCoreSpeciesId, PierCastTemperatureCurve>;

export function getPierCastCoreSeasonalCurve(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
): PierCastSeasonalOpportunityCurve | null {
  const curve = PIER_CAST_CORE_SEASONAL_CURVES.find((candidate) =>
    candidate.cityId === cityId && candidate.speciesId === speciesId
  );
  if (!curve) return null;
  return {
    curveId: curve.curveId,
    calibrationStatus: curve.calibrationStatus,
    knots: curve.knots,
  };
}

export function getPierCastCoreTemperatureCurve(
  speciesId: PierCastSpeciesId,
): PierCastTemperatureCurve | null {
  return PIER_CAST_CORE_SPECIES_IDS.includes(
      speciesId as PierCastCoreSpeciesId,
    )
    ? PIER_CAST_CORE_TEMPERATURE_CURVES[speciesId as PierCastCoreSpeciesId]
    : null;
}

const LMHOFS_ENDPOINT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc";

type PierCastConfiguredLocation = NonNullable<
  PierCastCityTemperatureSource["configuredLocation"]
>;

/**
 * Reproducible regular-grid candidates selected from the 2026-09-09 12 UTC
 * LMHOFS grid. A candidate is configuration for validation, not approval for
 * scoring. Reference coordinates are outer-light positions from Coast Pilot 6
 * and must never be presented as navigation destinations.
 */
export const PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS = {
  ludington_mi: {
    latitude: 43.95,
    longitude: -86.47,
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 235,
    gridColumn: 159,
    modelBathymetryM: 6.615642314703742,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "ludington_north_breakwater_light",
      displayName: "Ludington North Breakwater Light",
      latitude: 43.9536111111,
      longitude: -86.4694444444,
      distanceM: 404,
      coordinateSource: "NOAA Coast Pilot 6",
    },
    gridCellStatus: "candidate",
  },
  grand_haven_mi: {
    latitude: 43.06,
    longitude: -86.26,
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 146,
    gridColumn: 180,
    modelBathymetryM: 9.928779235854584,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "grand_haven_south_pierhead_entrance_light",
      displayName: "Grand Haven South Pierhead Entrance Light",
      latitude: 43.0569444444,
      longitude: -86.2558333333,
      distanceM: 480,
      coordinateSource: "NOAA Coast Pilot 6",
    },
    gridCellStatus: "candidate",
  },
  manistee_mi: {
    latitude: 44.25,
    longitude: -86.35,
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 265,
    gridColumn: 171,
    modelBathymetryM: 7.5400476937748575,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "manistee_north_pierhead_light",
      displayName: "Manistee North Pierhead Light",
      latitude: 44.2519444444,
      longitude: -86.3469444444,
      distanceM: 326,
      coordinateSource: "NOAA Coast Pilot 6",
    },
    gridCellStatus: "candidate",
  },
  frankfort_elberta_mi: {
    latitude: 44.63,
    longitude: -86.26,
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 303,
    gridColumn: 180,
    modelBathymetryM: 12.58709828741525,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "frankfort_north_breakwater_light",
      displayName: "Frankfort North Breakwater Light",
      latitude: 44.6308333333,
      longitude: -86.2522222222,
      distanceM: 622,
      coordinateSource: "NOAA Coast Pilot 6",
    },
    gridCellStatus: "candidate",
  },
  sheboygan_wi: {
    latitude: 43.75,
    longitude: -87.69,
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: 215,
    gridColumn: 37,
    modelBathymetryM: 8.680713550792786,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "sheboygan_breakwater_light",
      displayName: "Sheboygan Breakwater Light",
      latitude: 43.7494444444,
      longitude: -87.6927777778,
      distanceM: 232,
      coordinateSource: "NOAA Coast Pilot 6",
    },
    gridCellStatus: "candidate",
  },
} as const satisfies Record<PierCastCityId, PierCastConfiguredLocation>;

type ValidationObservation = NonNullable<
  PierCastCityTemperatureSource["validationObservation"]
>;

function lmhofsSource(
  cityId: PierCastCityId,
  validationObservation: ValidationObservation | null,
  limitation: string,
): PierCastCityTemperatureSource {
  return {
    sourceId: `${cityId}__lmhofs_nearshore_surface__v0_2`,
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    displayName: "NOAA LMHOFS nearshore surface temperature (candidate)",
    kind: "model",
    canonicalUnit: "C",
    calibrationStatus: "provisional",
    endpoint: LMHOFS_ENDPOINT,
    variable: "temp",
    configuredLocation: PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS[cityId],
    issueCyclesUtc: [0, 6, 12, 18],
    forecastHorizonHours: 120,
    freshnessLimitHours: 12,
    fallbackPolicy: "unavailable",
    validationObservation,
    limitation,
  };
}

export const PIER_CAST_CITY_TEMPERATURE_SOURCES = {
  ludington_mi: lmhofsSource(
    "ludington_mi",
    {
      provider: "GLOS Seagull ERDDAP",
      datasetId: "obs_637",
      seasonal: true,
      availabilityStatus: "historical_only",
      temperatureVariable: "sea_water_temperature_1",
      aggregateQualityVariable: "sea_water_temperature_1_aggregate",
      reportedUnit: "K",
      nominalDepthM: 1,
    },
    "The frozen lake-side candidate is not approved. It must be compared with historical Ludington Smart Mooring data and new prospective observations; neither source is a pier thermometer.",
  ),
  grand_haven_mi: lmhofsSource(
    "grand_haven_mi",
    {
      provider: "GLOS Seagull ERDDAP",
      datasetId: "obs_671",
      seasonal: true,
      availabilityStatus: "active_seasonal",
      temperatureVariable: "sea_water_temperature_1",
      aggregateQualityVariable: "sea_water_temperature_1_aggregate_test",
      reportedUnit: "K",
      nominalDepthM: null,
    },
    "The frozen lake-side candidate must still pass Grand River plume and seasonal Grand Haven Spotter comparisons before pilot approval.",
  ),
  manistee_mi: lmhofsSource(
    "manistee_mi",
    null,
    "No pier-local GLOS observation was found. The frozen lake-side candidate requires prospective spatial and temperature comparison before pilot approval.",
  ),
  frankfort_elberta_mi: lmhofsSource(
    "frankfort_elberta_mi",
    null,
    "No pier-local GLOS observation was found. The frozen Frankfort candidate still requires Betsie Lake plume review and a one-cell-versus-two-structure decision before pilot approval.",
  ),
  sheboygan_wi: lmhofsSource(
    "sheboygan_wi",
    {
      provider: "GLOS Seagull ERDDAP",
      datasetId: "obs_709",
      seasonal: true,
      availabilityStatus: "active_seasonal",
      temperatureVariable: "Temp0",
      aggregateQualityVariable: "Temp0_aggregate_test",
      reportedUnit: "K",
      nominalDepthM: 0,
    },
    "The frozen lake-side candidate must be compared with the seasonal Sheboygan Panther buoy and must not be represented as harbor, river-plume, or pier-depth measurement.",
  ),
} as const satisfies Record<PierCastCityId, PierCastCityTemperatureSource>;
