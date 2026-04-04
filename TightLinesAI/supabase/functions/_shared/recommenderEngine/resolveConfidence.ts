/**
 * resolveConfidence — determines how confident we are in the recommendation.
 *
 * Kept as a small shared utility for the live V3 surface so confidence logic
 * is not tied to deleted V1/V2 scoring modules.
 */

import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { ActivityLevel, BehaviorOutput, SeasonalFlag } from "./contracts/behavior.ts";
import type { RecommenderConfidence, RecommenderConfidenceTier } from "./contracts/output.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import { getSpeciesTierForState } from "./config/stateSpeciesGating.ts";

type ConfidenceRankedFamily = {
  score: number;
  breakdown: Array<{ direction: "bonus" | "penalty" }>;
};

function seasonScore(flag: SeasonalFlag | undefined): number {
  switch (flag) {
    case "peak_season":
    case "pre_spawn":
      return 2;
    case "spawning":
    case "post_spawn":
      return 1;
    case "off_season":
      return 0;
    default:
      return 1;
  }
}

function activityScore(activity: ActivityLevel): number {
  switch (activity) {
    case "aggressive":
    case "active":
      return 2;
    case "neutral":
      return 1;
    case "low":
    case "inactive":
      return 0;
  }
}

function tempGateScore(
  analysis: SharedConditionAnalysis,
): number {
  const band = analysis.norm.normalized.temperature?.band_label ?? null;
  if (band === null) return 1;
  if (band === "optimal" || band === "near_optimal") return 1;
  if (band === "cool" || band === "warm") return 1;
  if (band === "very_cold" || band === "very_warm") return 0;
  return 1;
}

function buildReasons(
  availabilityTier: "primary" | "marginal" | null,
  seasonalFlag: SeasonalFlag | undefined,
  activity: ActivityLevel,
  missingVars: string[],
  speciesDisplay: string,
  recommendationRobustness: number,
  penaltyPressure: number,
): string[] {
  const reasons: string[] = [];

  if (availabilityTier === "primary") {
    reasons.push(`${speciesDisplay} are well-established in this region.`);
  }
  if (seasonalFlag === "peak_season" || seasonalFlag === "pre_spawn") {
    reasons.push("Seasonal timing is favorable and fish behavior is well defined.");
  }
  if (activity === "active" || activity === "aggressive") {
    reasons.push("Conditions support a stronger bite window.");
  }
  if (recommendationRobustness >= 2) {
    reasons.push("Top recommendations separate clearly from the backup options.");
  }

  if (availabilityTier === "marginal") {
    reasons.push(`${speciesDisplay} are present but less common in this area.`);
  }
  if (seasonalFlag === "off_season") {
    reasons.push("Seasonal positioning is tougher, so expect a narrower window.");
  }
  if (seasonalFlag === "spawning") {
    reasons.push("Spawning-period fish can be less consistent day to day.");
  }
  if (activity === "inactive" || activity === "low") {
    reasons.push("Conditions keep fish tighter to their lane, so small adjustments matter more.");
  }
  if (missingVars.length > 0) {
    reasons.push("Some environmental data is missing, so this leans more on the seasonal baseline.");
  }
  if (recommendationRobustness === 0) {
    reasons.push("The top picks are clustered closely, so execution matters more than usual.");
  }
  if (penaltyPressure >= 2) {
    reasons.push("Even the best fits still carry some tradeoffs today.");
  }

  if (reasons.length === 0) {
    reasons.push("The recommendation is grounded in typical conditions for this species and region.");
  }

  return reasons;
}

function recommendationRobustness(rankings: ConfidenceRankedFamily[]): number {
  if (rankings.length === 0) return 0;
  const winner = rankings[0]!;
  const runnerUp = rankings[1];
  const gap = runnerUp ? winner.score - runnerUp.score : winner.score;
  const penaltyCount = winner.breakdown.filter((item) => item.direction === "penalty").length;

  if (winner.score >= 80 && gap >= 10 && penaltyCount <= 1) return 2;
  if (winner.score >= 65 && gap >= 5 && penaltyCount <= 2) return 1;
  return 0;
}

function averageRobustness(
  lureRankings: ConfidenceRankedFamily[],
  flyRankings: ConfidenceRankedFamily[],
): number {
  const scores = [lureRankings, flyRankings]
    .map(recommendationRobustness)
    .filter((value) => Number.isFinite(value));
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

function penaltyPressure(
  lureRankings: ConfidenceRankedFamily[],
  flyRankings: ConfidenceRankedFamily[],
): number {
  const winners = [lureRankings[0], flyRankings[0]].filter(Boolean) as ConfidenceRankedFamily[];
  if (winners.length === 0) return 0;
  return Math.round(
    winners.reduce((sum, family) => sum + family.breakdown.filter((item) => item.direction === "penalty").length, 0) /
      winners.length,
  );
}

export function resolveConfidence(
  req: RecommenderRequest,
  behavior: BehaviorOutput,
  analysis: SharedConditionAnalysis,
  speciesDisplayName: string,
  lureRankings: ConfidenceRankedFamily[],
  flyRankings: ConfidenceRankedFamily[],
): RecommenderConfidence {
  const availabilityTier = getSpeciesTierForState(req.location.state_code, req.species);
  const missingVars = analysis.condition_context.missing_variables ?? [];
  const recommendationRobustnessValue = averageRobustness(lureRankings, flyRankings);
  const topPenaltyPressure = penaltyPressure(lureRankings, flyRankings);

  const tierScore = availabilityTier === "primary" ? 2 : availabilityTier === "marginal" ? 1 : 0;
  const total =
    tierScore +
    seasonScore(behavior.seasonal_flag) +
    activityScore(behavior.activity) +
    (missingVars.length === 0 ? 2 : missingVars.length <= 2 ? 1 : 0) +
    tempGateScore(analysis) +
    recommendationRobustnessValue;

  let tier: RecommenderConfidenceTier;
  if (total >= 8) {
    tier = "high";
  } else if (total >= 5) {
    tier = "medium";
  } else {
    tier = "low";
  }

  if (availabilityTier === null) {
    tier = "low";
  }

  return {
    tier,
    reasons: buildReasons(
      availabilityTier,
      behavior.seasonal_flag,
      behavior.activity,
      missingVars,
      speciesDisplayName,
      recommendationRobustnessValue,
      topPenaltyPressure,
    ),
  };
}
