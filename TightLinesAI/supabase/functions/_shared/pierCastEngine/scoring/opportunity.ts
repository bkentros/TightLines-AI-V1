import type {
  PierCastInstantOpportunityRead,
  PierCastSeasonalOpportunityEvaluation,
  PierCastTemperatureSuitability,
} from "../types.ts";
import { toFinFindrOpportunityRating } from "./rating.ts";

export const PIER_CAST_FORMULA_VERSION =
  "seasonal-opportunity-bounded-temperature-v2";
export const PIER_CAST_BASELINE_FORMULA_VERSION =
  "seasonal-ceiling-x-temperature-v1";
export const PIER_CAST_TEMPERATURE_MODIFIER_FLOOR = 0.3;
export const PIER_CAST_TEMPERATURE_MODIFIER_WEIGHT = 0.75;

export type PierCastFormulaVersion =
  | typeof PIER_CAST_FORMULA_VERSION
  | typeof PIER_CAST_BASELINE_FORMULA_VERSION;

function unavailable(
  reasonCodes: string[],
  seasonalRating: number | null,
  temperatureSuitability: number | null,
  formulaVersion: PierCastFormulaVersion = PIER_CAST_FORMULA_VERSION,
): PierCastInstantOpportunityRead {
  return {
    status: "unavailable",
    seasonalRating,
    temperatureSuitability,
    temperatureModifier: null,
    opportunityFraction: null,
    rating: {
      status: "unavailable",
      score: null,
      reasonCodes,
      ratingName: "FinFindr Opportunity Rating",
    },
    formulaVersion,
    reasonCodes,
  };
}

/**
 * modifier = 0.30 + 0.75 × temperatureSuitability
 * score = clamp(1, 10, 1 + (seasonalRating - 1) × modifier)
 *
 * The configured seasonal rating is the historically supported opportunity
 * under broadly supportive conditions. Temperature can penalize that
 * opportunity without erasing it, and only near-optimal fit can add a bounded
 * five-percent synergy. The seasonal rating still controls the magnitude.
 */
export function calculatePierCastInstantOpportunity(input: {
  seasonalRating: number;
  temperatureSuitability: number;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastInstantOpportunityRead {
  const formulaVersion = input.formulaVersion ?? PIER_CAST_FORMULA_VERSION;
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
      formulaVersion,
    );
  }

  const temperatureModifier = formulaVersion ===
      PIER_CAST_BASELINE_FORMULA_VERSION
    ? input.temperatureSuitability
    : PIER_CAST_TEMPERATURE_MODIFIER_FLOOR +
      PIER_CAST_TEMPERATURE_MODIFIER_WEIGHT * input.temperatureSuitability;
  const rawScore = 1 + (input.seasonalRating - 1) * temperatureModifier;
  const score = Math.min(10, Math.max(1, rawScore));
  const opportunityFraction = (score - 1) / 9;
  const rating = toFinFindrOpportunityRating(score);
  if (rating.status !== "available") {
    return unavailable(
      rating.reasonCodes,
      input.seasonalRating,
      input.temperatureSuitability,
      formulaVersion,
    );
  }
  return {
    status: "available",
    seasonalRating: input.seasonalRating,
    temperatureSuitability: input.temperatureSuitability,
    temperatureModifier,
    opportunityFraction,
    rating,
    formulaVersion,
    reasonCodes: [],
  };
}

export function combinePierCastOpportunity(input: {
  seasonal: PierCastSeasonalOpportunityEvaluation;
  temperature: PierCastTemperatureSuitability;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastInstantOpportunityRead {
  if (
    input.seasonal.status !== "available" ||
    input.temperature.status !== "available"
  ) {
    return unavailable(
      [...input.seasonal.reasonCodes, ...input.temperature.reasonCodes],
      input.seasonal.rating,
      input.temperature.suitability,
      input.formulaVersion,
    );
  }
  return calculatePierCastInstantOpportunity({
    seasonalRating: input.seasonal.rating,
    temperatureSuitability: input.temperature.suitability,
    formulaVersion: input.formulaVersion,
  });
}
