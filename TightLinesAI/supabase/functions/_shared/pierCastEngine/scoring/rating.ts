import type { PierCastRatingLabel, PierCastScoreRead } from "../types.ts";

export const PIER_CAST_RUBRIC_VERSION = "finfindr-opportunity-v1";

export function pierCastRatingLabel(displayScore: number): PierCastRatingLabel {
  if (displayScore <= 2) return "Poor";
  if (displayScore <= 4) return "Limited";
  if (displayScore <= 6) return "Fair";
  if (displayScore <= 8) return "Good";
  return "Excellent";
}

export function formatPierCastRating(displayScore: number): `${number}/10` {
  return `${displayScore.toFixed(1)}/10` as `${number}/10`;
}

export function toFinFindrOpportunityRating(score: number): PierCastScoreRead {
  if (!Number.isFinite(score) || score < 1 || score > 10) {
    return {
      status: "unavailable",
      score: null,
      reasonCodes: ["score_outside_rubric"],
      ratingName: "FinFindr Opportunity Rating",
    };
  }
  const displayScore = Math.round((score + Number.EPSILON) * 10) / 10;
  return {
    status: "available",
    score,
    displayScore,
    displayText: formatPierCastRating(displayScore),
    label: pierCastRatingLabel(displayScore),
    ratingName: "FinFindr Opportunity Rating",
    rubricVersion: PIER_CAST_RUBRIC_VERSION,
  };
}
