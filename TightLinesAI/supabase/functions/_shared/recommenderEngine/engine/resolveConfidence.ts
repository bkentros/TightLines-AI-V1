/**
 * resolveConfidence — determines how confident we are in the recommendation.
 *
 * Inputs considered:
 *   1. Species availability tier for the angler's state (primary vs marginal)
 *   2. Seasonal flag (peak_season vs spawning vs off_season)
 *   3. Temperature gate proximity (near floor/ceiling = less confident)
 *   4. Missing environmental data
 *   5. Activity level (inactive = low confidence in any positive recommendation)
 *
 * Tiers:
 *   high   — primary species, peak season or active spawn, temp optimal, data complete
 *   medium — primary species off-peak, marginal species in-season, moderate conditions
 *   low    — marginal species, off-season, near temp gates, inactive fish, missing data
 */

import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { ActivityLevel, BehaviorOutput, SeasonalFlag } from "../contracts/behavior.ts";
import type { RecommenderConfidence, RecommenderConfidenceTier } from "../contracts/output.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { getSpeciesTierForState } from "../config/stateSpeciesGating.ts";

// ─── Confidence tier logic ────────────────────────────────────────────────────

function seasonScore(flag: SeasonalFlag | undefined): number {
  switch (flag) {
    case "peak_season":   return 2;
    case "pre_spawn":     return 2;  // often hot bite
    case "spawning":      return 1;  // variable — some species protected
    case "post_spawn":    return 1;
    case "off_season":    return 0;
    default:              return 1;  // undefined = neutral
  }
}

function activityScore(activity: ActivityLevel): number {
  switch (activity) {
    case "aggressive": return 2;
    case "active":     return 2;
    case "neutral":    return 1;
    case "low":        return 0;
    case "inactive":   return 0;
  }
}

function tempGateScore(
  analysis: SharedConditionAnalysis,
  activity: ActivityLevel,
): number {
  const band = analysis.norm.normalized.temperature?.band_label ?? null;
  // If activity is inactive from temp gates, we already penalize via activityScore.
  // Here we add an independent thermal comfort signal.
  if (band === null) return 1;  // unknown — don't penalise
  if (band === "optimal" || band === "near_optimal") return 1;  // ideal
  if (band === "cool" || band === "warm") return 1;  // acceptable
  // very_cold or very_warm = thermal stress conditions → lower confidence
  if (band === "very_cold" || band === "very_warm") return 0;
  return 1;
}

// ─── Reason strings ───────────────────────────────────────────────────────────

function buildReasons(
  tier: RecommenderConfidenceTier,
  availability_tier: "primary" | "marginal" | null,
  seasonal_flag: SeasonalFlag | undefined,
  activity: ActivityLevel,
  missing_vars: string[],
  species_display: string,
): string[] {
  const reasons: string[] = [];

  // Positive reasons
  if (availability_tier === "primary") {
    reasons.push(`${species_display} are well-established in this region.`);
  }
  if (seasonal_flag === "peak_season" || seasonal_flag === "pre_spawn") {
    reasons.push("Seasonal timing is favorable — expect active fish.");
  }
  if (activity === "active" || activity === "aggressive") {
    reasons.push("Conditions support good feeding activity.");
  }

  // Caution reasons
  if (availability_tier === "marginal") {
    reasons.push(`${species_display} are present but less common in this area.`);
  }
  if (seasonal_flag === "off_season") {
    reasons.push("Fish are in off-season patterns — bites will be tougher.");
  }
  if (seasonal_flag === "spawning") {
    reasons.push("Spawning fish can be less food-motivated in some areas.");
  }
  if (activity === "inactive" || activity === "low") {
    reasons.push("Current conditions have fish holding tight — finesse approach advised.");
  }
  if (missing_vars.length > 0) {
    reasons.push("Some environmental data unavailable — recommendation is based on typical conditions.");
  }

  // Fallback
  if (reasons.length === 0) {
    reasons.push("Typical seasonal conditions for this species and region.");
  }

  return reasons;
}

// ─── Main resolver ────────────────────────────────────────────────────────────

export function resolveConfidence(
  req: RecommenderRequest,
  behavior: BehaviorOutput,
  analysis: SharedConditionAnalysis,
  species_display_name: string,
): RecommenderConfidence {
  const availability_tier = getSpeciesTierForState(req.location.state_code, req.species);
  const missing_vars = analysis.condition_context.missing_variables ?? [];

  // Score components (0–2 each)
  const tier_score = availability_tier === "primary" ? 2 : availability_tier === "marginal" ? 1 : 0;
  const season_score = seasonScore(behavior.seasonal_flag);
  const activity_s = activityScore(behavior.activity);
  const data_score = missing_vars.length === 0 ? 2 : missing_vars.length <= 2 ? 1 : 0;
  const temp_s = tempGateScore(analysis, behavior.activity);

  const total = tier_score + season_score + activity_s + data_score + temp_s;
  // Max possible: 2+2+2+2+1 = 9

  let confidence_tier: RecommenderConfidenceTier;
  if (total >= 7) {
    confidence_tier = "high";
  } else if (total >= 4) {
    confidence_tier = "medium";
  } else {
    confidence_tier = "low";
  }

  // Hard override: if species is not valid for state at all, low
  if (availability_tier === null) {
    confidence_tier = "low";
  }

  const reasons = buildReasons(
    confidence_tier,
    availability_tier,
    behavior.seasonal_flag,
    behavior.activity,
    missing_vars,
    species_display_name,
  );

  return { tier: confidence_tier, reasons };
}
