import type {
  PierCastInstantOpportunityRead,
  PierCastSeasonalOpportunityEvaluation,
  PierCastTemperatureSuitability,
} from "../types.ts";
import { toFinFindrOpportunityRating } from "./rating.ts";

export const PIER_CAST_FORMULA_VERSION = "seasonal-ceiling-x-temperature-v1";

function unavailable(
  reasonCodes: string[],
  seasonalRating: number | null,
  temperatureSuitability: number | null,
): PierCastInstantOpportunityRead {
  return {
    status: "unavailable",
    seasonalRating,
    temperatureSuitability,
    opportunityFraction: null,
    rating: {
      status: "unavailable",
      score: null,
      reasonCodes,
      ratingName: "FinFindr Opportunity Rating",
    },
    formulaVersion: PIER_CAST_FORMULA_VERSION,
    reasonCodes,
  };
}

/**
 * score = 1 + (seasonalRating - 1) × temperatureSuitability
 *
 * The configured seasonal rating is an absolute ceiling. Water temperature
 * can unlock or reduce that opportunity, but can never exceed it.
 */
export function calculatePierCastInstantOpportunity(input: {
  seasonalRating: number;
  temperatureSuitability: number;
}): PierCastInstantOpportunityRead {
  const reasons: string[] = [];
  if (
    !Number.isFinite(input.seasonalRating) || input.seasonalRating < 1 ||
    input.seasonalRating > 10
  ) {
    reasons.push("seasonal_rating_invalid");
  }
  if (
    !Number.isFinite(input.temperatureSuitability) ||
    input.temperatureSuitability < 0 || input.temperatureSuitability > 1
  ) {
    reasons.push("temperature_suitability_invalid");
  }
  if (reasons.length > 0) {
    return unavailable(
      reasons,
      input.seasonalRating,
      input.temperatureSuitability,
    );
  }

  const opportunityFraction = ((input.seasonalRating - 1) / 9) *
    input.temperatureSuitability;
  const rating = toFinFindrOpportunityRating(1 + 9 * opportunityFraction);
  if (rating.status !== "available") {
    return unavailable(
      rating.reasonCodes,
      input.seasonalRating,
      input.temperatureSuitability,
    );
  }
  return {
    status: "available",
    seasonalRating: input.seasonalRating,
    temperatureSuitability: input.temperatureSuitability,
    opportunityFraction,
    rating,
    formulaVersion: PIER_CAST_FORMULA_VERSION,
    reasonCodes: [],
  };
}

export function combinePierCastOpportunity(input: {
  seasonal: PierCastSeasonalOpportunityEvaluation;
  temperature: PierCastTemperatureSuitability;
}): PierCastInstantOpportunityRead {
  if (
    input.seasonal.status !== "available" ||
    input.temperature.status !== "available"
  ) {
    return unavailable(
      [...input.seasonal.reasonCodes, ...input.temperature.reasonCodes],
      input.seasonal.rating,
      input.temperature.suitability,
    );
  }
  return calculatePierCastInstantOpportunity({
    seasonalRating: input.seasonal.rating,
    temperatureSuitability: input.temperature.suitability,
  });
}
