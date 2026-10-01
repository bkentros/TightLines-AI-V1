import {
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_V3_FORMULA_VERSION,
} from "./v3Calibration.ts";
import type { PierCastCityId } from "../types.ts";

/** Owner-authorized live PierCast scope. */
export const PIER_CAST_PUBLIC_V3_RELEASE = {
  version: "piercast-public-v3-2026-09-22-thirty-two-city",
  formulaVersion: PIER_CAST_V3_FORMULA_VERSION,
  // Live owner-authorized public city roster.
  cityIds: [
    "ludington_mi",
    "grand_haven_mi",
    "manistee_mi",
    "frankfort_elberta_mi",
    "sheboygan_wi",
    "port_washington_wi",
    "milwaukee_wi",
    "racine_wi",
    "kenosha_wi",
    "harbor_beach_mi",
    "oscoda_mi",
    "port_sanilac_mi",
    "two_rivers_wi",
    "kewaunee_wi",
    "algoma_wi",
    "manitowoc_wi",
    "waukegan_il",
    "chicago_il",
    "michigan_city_in",
    "muskegon_mi",
    "whitehall_mi",
    "alpena_mi",
    "st_joseph_mi",
    "south_haven_mi",
    "holland_mi",
    "lexington_mi",
    "harrisville_mi",
    "pentwater_mi",
    "rogers_city_mi",
    "tawas_city_mi",
    "charlevoix_mi",
    "caseville_mi",
  ] as const satisfies readonly PierCastCityId[],
} as const;

export function isPierCastPublicV3City(
  cityId: string,
): cityId is PierCastCityId {
  return PIER_CAST_PUBLIC_V3_RELEASE.cityIds.some((id) => id === cityId);
}

export function publicV3Species(cityId: PierCastCityId) {
  return getPierCastV3SpeciesIdsForCity(cityId);
}
