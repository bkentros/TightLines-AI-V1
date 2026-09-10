import type { PierCastCityId } from "../types.ts";

export type PierCastCalibrationObservationSource = {
  cityId: PierCastCityId;
  provider: "GLOS Seagull ERDDAP";
  datasetId: string;
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
    datasetId: "obs_62",
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
    datasetId: "obs_671",
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
    datasetId: "obs_709",
    temperatureVariable: "Temp0",
    aggregateQualityVariable: "Temp0_aggregate_test",
    reportedUnit: "K",
    role: "configured",
    limitation:
      "Near-cell seasonal buoy, but the audited 2026 series contained no aggregate-QC-good Temp0 records and lacks numeric depth metadata.",
  },
] as const satisfies readonly PierCastCalibrationObservationSource[];
