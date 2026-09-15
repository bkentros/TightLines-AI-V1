import type { PierCastCityId, PierCastSpeciesId } from "../types.ts";

export const PIER_CAST_V3_FORMULA_VERSION =
  "piercast-opportunity-modes-bounded-temperature-v3" as const;
export const PIER_CAST_V3_THERMAL_FLOOR = 0.30 as const;
export const PIER_CAST_V3_THERMAL_WEIGHT = 0.70 as const;
export const PIER_CAST_V3_MODE_SELECTION =
  "maximum_realized_mode_never_sum" as const;

export const PIER_CAST_V3_CITY_IDS = [
  "ludington_mi",
  "grand_haven_mi",
  "manistee_mi",
  "frankfort_elberta_mi",
  "sheboygan_wi",
  "port_washington_wi",
  "milwaukee_wi",
  "racine_wi",
  "kenosha_wi",
] as const satisfies readonly PierCastCityId[];

export const PIER_CAST_V3_SPECIES_IDS = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
] as const satisfies readonly PierCastSpeciesId[];

export type PierCastV3AvailabilityKnot = {
  monthDay: string;
  availability: number;
};

export type PierCastV3OpportunityMode = {
  modeCalibrationId: string;
  modeId: string;
  modeName: string;
  evidenceGrade: "A" | "B";
  fisheryStrength: number;
  availabilityKnots: readonly PierCastV3AvailabilityKnot[];
  thermalCurveId: string;
  fisheryEvidenceIds: readonly string[];
  limitations: readonly string[];
  promotionEligible: false;
};

export type PierCastV3PairCalibration = {
  pairKey: string;
  cityId: PierCastCityId;
  speciesId: PierCastSpeciesId;
  ratingEnabled: false;
  publicEnabled: false;
  promotionEligible: false;
  modes: readonly PierCastV3OpportunityMode[];
};

export type PierCastV3ModePotential = {
  modeCalibrationId: string;
  modeId: string;
  fisheryStrength: number;
  seasonalAvailability: number;
  seasonalPotential: number;
  thermalCurveId: string;
};

export type PierCastV3OpportunityRead =
  | {
    status: "available";
    score: number;
    activeMode: PierCastV3ModePotential;
    temperatureSuitability: number;
    temperatureModifier: number;
    reasonCodes: readonly [];
  }
  | {
    status: "unavailable";
    score: null;
    activeMode: null;
    temperatureSuitability: null;
    temperatureModifier: null;
    reasonCodes: string[];
  };

export {
  PIER_CAST_V3_CALIBRATION_SHA256,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_PUBLIC_ENABLED,
  PIER_CAST_V3_RATING_ENABLED,
  PIER_CAST_V3_SOURCE_SCHEMA_VERSION,
  PIER_CAST_V3_SOURCE_SHA256,
} from "./v3Calibration.generated.ts";

import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "./v3Calibration.generated.ts";

export function getPierCastV3PairCalibration(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
): PierCastV3PairCalibration | null {
  return PIER_CAST_V3_PAIR_CALIBRATIONS.find((pair) =>
    pair.cityId === cityId && pair.speciesId === speciesId
  ) ?? null;
}
