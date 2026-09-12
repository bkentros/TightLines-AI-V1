import type { PierCastCityId } from "../types.ts";

export type PierCastFieldTemperatureSite = {
  sourceId: string;
  cityId: PierCastCityId;
  structureId: string;
  displayName: string;
  targetLatitude: number;
  targetLongitude: number;
  coordinateSource: string;
  maximumDistanceM: number;
  targetDepthM: number;
  depthToleranceM: number;
  deploymentStatus: "authorization_and_deployment_required";
};

const site = (
  value: PierCastFieldTemperatureSite,
): PierCastFieldTemperatureSite => value;

/**
 * Independent field-validation sites for the frozen seven-structure scope.
 * These are evidence inputs only and can never replace LMHOFS at runtime.
 */
export const PIER_CAST_FIELD_TEMPERATURE_SITES = [
  site({
    sourceId: "ludington_north_breakwater__surface_logger_v1",
    cityId: "ludington_mi",
    structureId: "ludington_north_breakwater",
    displayName: "Ludington North Breakwater lake-side validation site",
    targetLatitude: 43.9536111111,
    targetLongitude: -86.4694444444,
    coordinateSource: "NOAA Coast Pilot 6 north-breakwater light",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "grand_haven_south_pier__surface_logger_v1",
    cityId: "grand_haven_mi",
    structureId: "grand_haven_south_pier",
    displayName: "Grand Haven South Pier lake-side validation site",
    targetLatitude: 43.0569444444,
    targetLongitude: -86.2558333333,
    coordinateSource: "NOAA Coast Pilot 6 south-pierhead entrance light",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "manistee_north_pier__surface_logger_v1",
    cityId: "manistee_mi",
    structureId: "manistee_north_pier",
    displayName: "Manistee North Pier lake-side validation site",
    targetLatitude: 44.2519444444,
    targetLongitude: -86.3469444444,
    coordinateSource: "NOAA Coast Pilot 6 north-pierhead light",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "frankfort_north_breakwater__surface_logger_v1",
    cityId: "frankfort_elberta_mi",
    structureId: "frankfort_north_breakwater",
    displayName: "Frankfort North Breakwater lake-side validation site",
    targetLatitude: 44.6308772222,
    targetLongitude: -86.2521497222,
    coordinateSource: "USCG Light List 18375",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "elberta_south_breakwater__surface_logger_v1",
    cityId: "frankfort_elberta_mi",
    structureId: "elberta_south_breakwater",
    displayName: "Elberta South Breakwater lake-side validation site",
    targetLatitude: 44.6294608333,
    targetLongitude: -86.2522672222,
    coordinateSource: "USCG Light List 18385",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "sheboygan_north_pier__surface_logger_v1",
    cityId: "sheboygan_wi",
    structureId: "sheboygan_north_pier",
    displayName: "Sheboygan North Pier lake-side validation site",
    targetLatitude: 43.7494444444,
    targetLongitude: -87.6927777778,
    coordinateSource: "NOAA Coast Pilot 6 breakwater light",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
  site({
    sourceId: "sheboygan_south_pier__surface_logger_v1",
    cityId: "sheboygan_wi",
    structureId: "sheboygan_south_pier",
    displayName: "Sheboygan South Pier lake-side validation site",
    targetLatitude: 43.74861,
    targetLongitude: -87.69481,
    coordinateSource: "USCG Light List south-pierhead light",
    maximumDistanceM: 350,
    targetDepthM: 0.5,
    depthToleranceM: 0.25,
    deploymentStatus: "authorization_and_deployment_required",
  }),
] as const satisfies readonly PierCastFieldTemperatureSite[];

export const PIER_CAST_FIELD_TEMPERATURE_PROTOCOL = {
  protocolVersion: "piercast-field-temperature-v1",
  maximumInstrumentAccuracyC: 0.2,
  maximumCalibrationErrorC: 0.2,
  maximumCalibrationAgeDays: 30,
  maximumCadenceMinutes: 15,
  minimumGoodDaysPerDeployment: 60,
  minimumSeasonalDeployments: 2,
  minimumMatchesPerLeadPerDeployment: 30,
} as const;

export function getPierCastFieldTemperatureSite(
  sourceId: string,
): PierCastFieldTemperatureSite | null {
  return PIER_CAST_FIELD_TEMPERATURE_SITES.find((candidate) =>
    candidate.sourceId === sourceId
  ) ?? null;
}
