import type { PierCastReviewDateOutlookRead } from "./pierCastContracts";

/** Keep research-only bluegill out of every displayed PierCast forecast. */
export function presentPierCastDate(
  date: PierCastReviewDateOutlookRead,
): PierCastReviewDateOutlookRead {
  const species = date.species.filter((row) => row.speciesId !== "bluegill");
  if (date.headline.drivingSpeciesId !== "bluegill") {
    return species.length === date.species.length ? date : { ...date, species };
  }

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
      ...date,
      species,
      headline: {
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
      },
    };
  }

  const promoted = leader.promotion.status === "eligible" ||
    leader.promotion.status === "limited";
  return {
    ...date,
    species,
    headline: {
      overall: leader.biological,
      drivingSpeciesId: leader.speciesId,
      headlineMode: promoted ? "daily_outlook" : "biological_only",
      promotion: leader.promotion,
      reasonCodes: promoted ? [] : ["headline_biology_only"],
    },
  };
}
