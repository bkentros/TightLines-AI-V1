import {
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_V3_FORMULA_VERSION,
} from "./v3Calibration.ts";
import type { PierCastCityId } from "../types.ts";

/** Owner-authorized public research scope; scientific validation remains ongoing. */
export const PIER_CAST_PUBLIC_V3_RELEASE = {
  version: "piercast-public-research-v3-2026-09-19-twenty-two-city",
  formulaVersion: PIER_CAST_V3_FORMULA_VERSION,
  // Frozen owner-authorized public city roster.
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
