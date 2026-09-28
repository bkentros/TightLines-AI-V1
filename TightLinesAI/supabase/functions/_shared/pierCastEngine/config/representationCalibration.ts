import type { PierCastCityId } from "../types.ts";

export type PierCastCalibrationObservationSource = {
  cityId: PierCastCityId;
  provider: "GLOS Seagull ERDDAP";
  stationId: string;
  displayName: string;
  datasetId: string;
  latitude: number;
  longitude: number;
  measurementDepthM: number | null;
  temperatureVariable: string;
  aggregateQualityVariable: string;
  reportedUnit: "K";
  role: "configured" | "supplemental";
  limitation: string;
};

/**
 * These feeds are validation evidence only. They never replace LMHOFS at
 * runtime, never fill a failed forecast, and never select a favorable score.
 */
export const PIER_CAST_CALIBRATION_OBSERVATION_SOURCES = [
  {
    cityId: "ludington_mi",
    provider: "GLOS Seagull ERDDAP",
    stationId: "glos-obs-62",
    displayName: "Ludington offshore buoy",
    datasetId: "obs_62",
    latitude: 43.97999954223633,
    longitude: -86.55999755859375,
    measurementDepthM: null,
    temperatureVariable: "sea_surface_temperature",
    aggregateQualityVariable: "sea_surface_temperature_aggregate_test",
    reportedUnit: "K",
    role: "supplemental",
    limitation:
      "Seasonal offshore buoy about 7.9 km from the runtime cell; numeric sensor depth is absent from ERDDAP metadata.",
  },
  {
    cityId: "grand_haven_mi",
    provider: "GLOS Seagull ERDDAP",
    stationId: "glos-obs-671",
    displayName: "Grand Haven Spotter buoy",
    datasetId: "obs_671",
    latitude: 43.002254486083984,
    longitude: -86.27080535888672,
    measurementDepthM: null,
    temperatureVariable: "sea_water_temperature_1",
    aggregateQualityVariable: "sea_water_temperature_1_aggregate_test",
    reportedUnit: "K",
    role: "configured",
    limitation:
      "Seasonal buoy about 6.5 km from the runtime cell; numeric sensor depth is absent from ERDDAP metadata.",
  },
  {
    cityId: "sheboygan_wi",
    provider: "GLOS Seagull ERDDAP",
    stationId: "glos-obs-709",
    displayName: "Sheboygan Panther buoy",
    datasetId: "obs_709",
    latitude: 43.75586,
    longitude: -87.68872,
    measurementDepthM: null,
    temperatureVariable: "Temp0",
    aggregateQualityVariable: "Temp0_aggregate_test",
    reportedUnit: "K",
    role: "configured",
    limitation:
      "Near-cell seasonal buoy, but the audited 2026 series contained no aggregate-QC-good Temp0 records and lacks numeric depth metadata.",
  },
] as const satisfies readonly PierCastCalibrationObservationSource[];
