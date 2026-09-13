import {
  getPierCastCoreSeasonalCurve,
  getPierCastCoreTemperatureCurve,
  PIER_CAST_CORE_SPECIES_IDS,
} from "./coreCalibration.ts";
import { PIER_CAST_FROZEN_CITY_IDS, PIER_CAST_SCOPE_VERSION } from "./scope.ts";
import {
  PIER_CAST_PRIVATE_ADMISSIONS,
  PIER_CAST_PRIVATE_ROSTER_VERSION,
} from "./privateAdmissions.generated.ts";
import { PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH } from "./additionalSeasonalResearch.generated.ts";
import { PIER_CAST_ADDITIONAL_THERMAL_RESEARCH } from "./additionalThermalResearch.generated.ts";
import type { PierCastCityId, PierCastSpeciesId } from "../types.ts";
export { PIER_CAST_PRIVATE_ADMISSIONS, PIER_CAST_PRIVATE_ROSTER_VERSION };
export const PIER_CAST_LEGACY_ROSTER_VERSION = PIER_CAST_SCOPE_VERSION;
export function getPierCastPrivateSpeciesIds(
  cityId: PierCastCityId,
  version: string = PIER_CAST_PRIVATE_ROSTER_VERSION,
): PierCastSpeciesId[] {
  if (!PIER_CAST_FROZEN_CITY_IDS.includes(cityId)) {
    throw new Error("Unknown PierCast city.");
  }
  if (version === PIER_CAST_LEGACY_ROSTER_VERSION) {
    return [...PIER_CAST_CORE_SPECIES_IDS];
  }
  if (version !== PIER_CAST_PRIVATE_ROSTER_VERSION) {
    throw new Error("Unknown PierCast roster version.");
  }
  return [
    ...PIER_CAST_CORE_SPECIES_IDS,
    ...PIER_CAST_PRIVATE_ADMISSIONS.filter((r) => r.cityId === cityId).map(
      (r) => r.speciesId,
    ),
  ];
}
export function pierCastRosterMatches(
  cityId: PierCastCityId,
  ids: readonly string[],
  version: string = PIER_CAST_PRIVATE_ROSTER_VERSION,
): boolean {
  const expected = getPierCastPrivateSpeciesIds(cityId, version);
  return ids.length === expected.length && new Set(ids).size === ids.length &&
    ids.every((id) => expected.includes(id as PierCastSpeciesId));
}
export function getPierCastPrivateAdmission(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
) {
  return PIER_CAST_PRIVATE_ADMISSIONS.find((r) =>
    r.cityId === cityId && r.speciesId === speciesId
  );
}
export function getPierCastPrivateSeasonalCurve(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
) {
  return getPierCastCoreSeasonalCurve(cityId, speciesId) ??
    (getPierCastPrivateAdmission(cityId, speciesId)
      ? PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH.find((r) =>
        r.cityId === cityId && r.speciesId === speciesId
      ) ?? null
      : null);
}
export function getPierCastPrivateTemperatureCurve(
  speciesId: PierCastSpeciesId,
) {
  return getPierCastCoreTemperatureCurve(speciesId) ??
    (PIER_CAST_PRIVATE_ADMISSIONS.some((r) => r.speciesId === speciesId)
      ? PIER_CAST_ADDITIONAL_THERMAL_RESEARCH.find((r) =>
        r.speciesId === speciesId
      )?.curve ?? null
      : null);
}
export const PIER_CAST_PRIVATE_FORECAST_COUNT = PIER_CAST_FROZEN_CITY_IDS
  .reduce((n, id) => n + getPierCastPrivateSpeciesIds(id).length * 5, 0);

export const PIER_CAST_PRIVATE_SEASONAL_VERSION =
  "piercast-private-seasonal-v1-core-v0.4.0";
export const PIER_CAST_PRIVATE_THERMAL_VERSION =
  "piercast-private-temperature-v1-core-v0.2.0";
