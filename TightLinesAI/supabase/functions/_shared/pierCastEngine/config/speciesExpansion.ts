import type {
  PierCastCityId,
  PierCastCitySpeciesProfile,
  PierCastSpeciesId,
  PierCastTemperatureCurve,
} from "../types.ts";
import {
  PIER_CAST_SPECIES_EXPANSION_ADMITTED_PAIR_KEYS,
  PIER_CAST_SPECIES_EXPANSION_NEW_SPECIES,
  PIER_CAST_SPECIES_EXPANSION_REGULATION_NOTICES,
  PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES,
} from "./speciesExpansion.generated.ts";

const admittedPairKeys = new Set<string>(
  PIER_CAST_SPECIES_EXPANSION_ADMITTED_PAIR_KEYS,
);

export type PierCastV3RegulationNotice = {
  noticeId: string;
  cityId: PierCastCityId;
  speciesId: PierCastSpeciesId | "all";
  startMonthDay: string;
  endMonthDay: string;
  reasonCode: "special_tackle_restriction";
  title: string;
  message: string;
  evidenceIds: readonly string[];
};

export function isPierCastSpeciesExpansionAdmission(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
): boolean {
  return admittedPairKeys.has(`${cityId}/${speciesId}`);
}

export function applyPierCastSpeciesExpansionDispositions(
  cityId: PierCastCityId,
  baseSpecies: readonly PierCastCitySpeciesProfile[],
): PierCastCitySpeciesProfile[] {
  const seen = new Set<PierCastSpeciesId>();
  const merged: PierCastCitySpeciesProfile[] = baseSpecies.map((profile) => {
    if (seen.has(profile.speciesId)) {
      throw new Error(
        `Duplicate PierCast city species before expansion: ${cityId}/${profile.speciesId}.`,
      );
    }
    seen.add(profile.speciesId);
    return isPierCastSpeciesExpansionAdmission(cityId, profile.speciesId)
      ? {
        ...profile,
        inheritance: "candidate",
        ratingEnabled: false,
        limitation: profile.limitation ??
          "Evidence-admitted Formula v3 species-expansion private-shadow candidate; numeric scoring remains disabled and promotion-blocked.",
      }
      : { ...profile };
  });
  for (const species of PIER_CAST_SPECIES_EXPANSION_NEW_SPECIES) {
    if (seen.has(species.speciesId)) continue;
    seen.add(species.speciesId);
    merged.push(
      isPierCastSpeciesExpansionAdmission(cityId, species.speciesId)
        ? admittedProfile(species.speciesId)
        : {
          speciesId: species.speciesId,
          inheritance: "unresolved",
          seasonalOpportunityCurve: null,
          ratingEnabled: false,
          limitation:
            "Explicitly excluded from this city by the species-expansion decision matrix; no numeric city-pier score is configured.",
        },
    );
  }
  return merged;
}

export function getPierCastSpeciesExpansionTemperatureCurve(
  speciesId: PierCastSpeciesId,
): PierCastTemperatureCurve | null {
  return PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES.find((candidate) =>
    candidate.speciesId === speciesId
  )?.curve ?? null;
}

export function getPierCastV3RegulationNotices(input: {
  cityId: PierCastCityId;
  speciesId: PierCastSpeciesId;
  localDate: string;
}): PierCastV3RegulationNotice[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.localDate)) return [];
  const monthDay = input.localDate.slice(5);
  return PIER_CAST_SPECIES_EXPANSION_REGULATION_NOTICES.filter((notice) =>
    notice.cityId === input.cityId &&
    (notice.speciesId === "all" || notice.speciesId === input.speciesId) &&
    recurringWindowIncludes(
      monthDay,
      notice.startMonthDay,
      notice.endMonthDay,
    )
  ).map((notice) => ({ ...notice } as PierCastV3RegulationNotice));
}

function admittedProfile(
  speciesId: PierCastSpeciesId,
): PierCastCitySpeciesProfile {
  return {
    speciesId,
    inheritance: "candidate",
    seasonalOpportunityCurve: null,
    ratingEnabled: false,
    limitation:
      "Evidence-admitted Formula v3 species-expansion private-shadow candidate; numeric scoring remains disabled and promotion-blocked.",
  };
}

function recurringWindowIncludes(
  monthDay: string,
  startMonthDay: string,
  endMonthDay: string,
): boolean {
  return startMonthDay <= endMonthDay
    ? monthDay >= startMonthDay && monthDay <= endMonthDay
    : monthDay >= startMonthDay || monthDay <= endMonthDay;
}
