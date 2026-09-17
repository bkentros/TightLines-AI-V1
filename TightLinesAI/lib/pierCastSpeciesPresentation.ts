import type {
  PierCastReviewDateOutlookRead,
  PierCastSpeciesId,
} from "./pierCastContracts";

export const PRIMARY_PIER_CAST_SPECIES: ReadonlySet<PierCastSpeciesId> =
  new Set([
    "coho_salmon",
    "chinook_salmon",
    "steelhead",
    "brown_trout",
    "freshwater_drum",
  ]);

function headlineForSpecies(
  species: PierCastReviewDateOutlookRead["species"],
): PierCastReviewDateOutlookRead["headline"] {
  const eligible = species
    .filter((row) =>
      row.biological.status === "available" &&
      row.coverage.status === "complete" &&
      row.targetingEligibility === "eligible"
    )
    .sort((left, right) => {
      const leftScore = left.biological.score ?? Number.NEGATIVE_INFINITY;
      const rightScore = right.biological.score ?? Number.NEGATIVE_INFINITY;
      return rightScore - leftScore ||
        left.speciesId.localeCompare(right.speciesId);
    });
  const leader = eligible[0];
  if (!leader) {
    const reasonCode = "no_eligible_headline_species";
    return {
      overall: {
        status: "unavailable",
        score: null,
        reasonCodes: [reasonCode],
        ratingName: "FinFindr Opportunity Rating",
      },
      drivingSpeciesId: null,
      headlineMode: "unavailable",
      promotion: { status: "unknown", reasonCodes: [reasonCode] },
      reasonCodes: [reasonCode],
    };
  }

  const promoted = leader.promotion.status === "eligible" ||
    leader.promotion.status === "limited";
  return {
    overall: leader.biological,
    drivingSpeciesId: leader.speciesId,
    headlineMode: promoted ? "daily_outlook" : "biological_only",
    promotion: leader.promotion,
    reasonCodes: promoted ? [] : ["headline_biology_only"],
  };
}

/** Keep research-only bluegill out of every displayed PierCast forecast. */
export function presentPierCastDate(
  date: PierCastReviewDateOutlookRead,
): PierCastReviewDateOutlookRead {
  const species = date.species.filter((row) => row.speciesId !== "bluegill");
  if (date.headline.drivingSpeciesId !== "bluegill") {
    return species.length === date.species.length ? date : { ...date, species };
  }

  return {
    ...date,
    species,
    headline: headlineForSpecies(species),
  };
}

/** The standings score and featured fish come only from primary species. */
export function presentPierCastStandingsDate(
  date: PierCastReviewDateOutlookRead,
): PierCastReviewDateOutlookRead {
  const displayed = presentPierCastDate(date);
  return {
    ...displayed,
    headline: headlineForSpecies(
      displayed.species.filter((row) =>
        PRIMARY_PIER_CAST_SPECIES.has(row.speciesId)
      ),
    ),
  };
}
