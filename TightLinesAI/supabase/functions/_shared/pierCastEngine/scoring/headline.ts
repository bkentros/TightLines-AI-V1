import type {
  PierCastDailyHeadline,
  PierCastScoreRead,
  PierCastSpeciesDailyCandidate,
} from "../types.ts";

function unavailableScore(reason: string): PierCastScoreRead {
  return {
    status: "unavailable",
    score: null,
    reasonCodes: [reason],
    ratingName: "FinFindr Opportunity Rating",
  };
}

export function selectPierCastDailyHeadline(
  candidates: readonly PierCastSpeciesDailyCandidate[],
): PierCastDailyHeadline {
  const eligible = candidates
    .filter((candidate) =>
      candidate.biological.status === "available" &&
      candidate.coverage.status === "complete" &&
      candidate.targetingEligibility === "eligible"
    )
    .toSorted((a, b) => {
      const scoreDifference = (b.biological.score ?? Number.NEGATIVE_INFINITY) -
        (a.biological.score ?? Number.NEGATIVE_INFINITY);
      return scoreDifference || a.speciesId.localeCompare(b.speciesId);
    });

  const driving = eligible[0];
  if (!driving || driving.biological.status !== "available") {
    return {
      overall: unavailableScore("no_eligible_headline_species"),
      drivingSpeciesId: null,
      headlineMode: "unavailable",
      promotion: {
        status: "unknown",
        reasonCodes: ["no_eligible_headline_species"],
      },
      reasonCodes: ["no_eligible_headline_species"],
    };
  }

  const promoted = driving.promotion.status === "eligible" ||
    driving.promotion.status === "limited";
  return {
    overall: { ...driving.biological },
    drivingSpeciesId: driving.speciesId,
    headlineMode: promoted ? "daily_outlook" : "biological_only",
    promotion: {
      status: driving.promotion.status,
      reasonCodes: [...driving.promotion.reasonCodes],
    },
    reasonCodes: promoted ? [] : ["headline_biology_only"],
  };
}
