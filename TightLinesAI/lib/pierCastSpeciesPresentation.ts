import type {
  PierCastReviewDateOutlookRead,
  PierCastSpeciesId,
} from "./pierCastContracts";

export const PRIMARY_PIER_CAST_SPECIES: ReadonlySet<PierCastSpeciesId> =
  new Set([
    "coho_salmon",
    "chinook_salmon",
    "atlantic_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "freshwater_drum",
  ]);

export function isPrimaryPierCastSpecies(
  speciesId: PierCastSpeciesId,
): boolean {
  return PRIMARY_PIER_CAST_SPECIES.has(speciesId);
}

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

/** Show all configured targets except bluegill, with a primary-species headline. */
export function presentPierCastDate(
  date: PierCastReviewDateOutlookRead,
): PierCastReviewDateOutlookRead {
  const species = date.species.filter((row) => row.speciesId !== "bluegill");
  return {
    ...date,
    species,
    headline: date.headline.overall.status === "available"
      ? headlineForSpecies(
        species.filter((row) =>
          isPrimaryPierCastSpecies(row.speciesId)
        ),
      )
      : date.headline,
  };
}
