import { PIER_CAST_FROZEN_CITY_IDS } from "./scope.ts";
import {
  getPierCastPrivateSpeciesIds,
  PIER_CAST_PRIVATE_ROSTER_VERSION,
  PIER_CAST_PREVIOUS_PRIVATE_ROSTER_VERSION,
  PIER_CAST_LEGACY_ROSTER_VERSION,
  pierCastRosterMatches,
} from "./privateCalibration.ts";
import type { PierCastCityId } from "../types.ts";

/** Explicit owner-approved research release; this is NOT scientific approval. */
export const PIER_CAST_PUBLIC_RELEASE = {
  enabled: true,
  status: "public_research" as const,
  version: "piercast-public-research-v1-2026-09-13",
  rosterVersion: "piercast-private-roster-v3-2026-09-13",
  approvedAt: "2026-09-13",
};
export {
  PIER_CAST_RESEARCH_DETAIL,
  PIER_CAST_RESEARCH_DISCLOSURE,
} from "../copy/researchDisclosure.ts";
export function isPierCastResearchCity(
  cityId: string,
): cityId is PierCastCityId {
  return PIER_CAST_PUBLIC_RELEASE.enabled &&
    PIER_CAST_PUBLIC_RELEASE.rosterVersion ===
      PIER_CAST_PRIVATE_ROSTER_VERSION &&
    PIER_CAST_FROZEN_CITY_IDS.some((id) => id === cityId);
}
export function isPierCastResearchRoster(
  cityId: string,
  speciesIds: readonly string[],
  sourceRosterVersion: string = PIER_CAST_PUBLIC_RELEASE.rosterVersion,
): boolean {
  return isPierCastResearchCity(cityId) &&
    [PIER_CAST_PUBLIC_RELEASE.rosterVersion, PIER_CAST_PREVIOUS_PRIVATE_ROSTER_VERSION, PIER_CAST_LEGACY_ROSTER_VERSION].includes(sourceRosterVersion) &&
    speciesIds.every(id => publicResearchSpecies(cityId).some(approved => approved === id)) &&
    pierCastRosterMatches(
      cityId,
      speciesIds,
      sourceRosterVersion,
    );
}
export function publicResearchSpecies(cityId: PierCastCityId) {
  return getPierCastPrivateSpeciesIds(
    cityId,
    PIER_CAST_PUBLIC_RELEASE.rosterVersion,
  );
}
