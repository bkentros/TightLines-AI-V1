import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import { buildBaselineBehavior } from "./baseline.ts";
import {
  RECOMMENDER_FEATURE,
  type PresentationArchetypeScore,
  type RankedFamily,
  type RecommenderConfidence,
  type RecommenderResponse,
  type RecommenderRunInput,
} from "./contracts.ts";
import { buildDebugPayload } from "./debug.ts";
import { rankFamilies } from "./families.ts";
import { scoreInventoryCompatibility } from "./inventory.ts";
import { applyDailyModifiers, type BehaviorResolution } from "./modifiers.ts";
import { buildNarrationPayload } from "./narration.ts";
import { resolvePresentationArchetypes } from "./presentation.ts";

function confidenceLevel(value: number): "high" | "medium" | "low" {
  if (value >= 2) return "high";
  if (value >= 1) return "medium";
  return "low";
}

function familyGap(rankings: RankedFamily[]): number {
  if (rankings.length < 2) return rankings[0]?.score ?? 0;
  return rankings[0]!.score - rankings[1]!.score;
}

function buildConfidence(params: {
  input: RecommenderRunInput;
  sharedReliability: "high" | "medium" | "low";
  behaviorReasons: string[];
  lureRankings: RankedFamily[];
  flyRankings: RankedFamily[];
  archetypeScores: PresentationArchetypeScore[];
}): RecommenderConfidence {
  let behaviorScore = params.sharedReliability === "high"
    ? 3
    : params.sharedReliability === "medium"
    ? 2
    : 1;
  let presentationScore = behaviorScore;
  let familyScore = behaviorScore;

  const reasons = [...params.behaviorReasons];

  if (!params.input.refinements.water_clarity) {
    presentationScore -= 1;
    familyScore -= 1;
    reasons.push("Water clarity is inferred, so presentation and family matching stay broader.");
  }
  if (
    (params.input.request.context === "coastal" ||
      params.input.request.context === "coastal_flats_estuary") &&
    params.input.request.environment.tide_movement_state == null
  ) {
    presentationScore -= 1;
    reasons.push("Live tide movement detail is missing.");
  }
  if (params.archetypeScores.length >= 2) {
    const topScore = params.archetypeScores[0]!.score;
    const secondScore = params.archetypeScores[1]!.score;
    if (topScore > 0 && (topScore - secondScore) < topScore * 0.1) {
      presentationScore -= 1;
      reasons.push("Presentation styles are close — rotate approaches if the first one isn't connecting.");
    }
  } else if (params.archetypeScores.length < 2) {
    presentationScore -= 1;
    reasons.push("Only one presentation style stood out clearly.");
  }

  const lureGap = familyGap(params.lureRankings);
  const flyGap = familyGap(params.flyRankings);
  if (Math.max(lureGap, flyGap) < 8) {
    familyScore -= 1;
    reasons.push("The top family choices are close together, so rotate if the first pick is not drawing interest.");
  }
  if ((params.lureRankings[0]?.score ?? 0) < 45 && (params.flyRankings[0]?.score ?? 0) < 45) {
    familyScore -= 1;
    reasons.push("Family guidance is broader than usual because conditions are mixed.");
  }

  return {
    behavior_confidence: confidenceLevel(behaviorScore),
    presentation_confidence: confidenceLevel(presentationScore),
    family_confidence: confidenceLevel(familyScore),
    reasons: [...new Set(reasons)],
  };
}

export type RecommenderRunResult = {
  response: RecommenderResponse;
  behaviorResolution: BehaviorResolution;
};

export function runRecommender(
  input: RecommenderRunInput,
  meta?: { generated_at?: string; cache_expires_at?: string },
): RecommenderRunResult {
  const analysis = analyzeSharedConditions(input.request);
  const month = parseInt(input.request.local_date.slice(5, 7), 10) || 1;
  const baseline = buildBaselineBehavior(
    input.request.region_key,
    month,
    input.request.context,
  );
  const behavior = applyDailyModifiers(baseline, analysis, input);
  const presentationArchetypes = resolvePresentationArchetypes(
    behavior,
    input.request.context,
  );
  const lureRankings = rankFamilies("lure", behavior, presentationArchetypes, input);
  const flyRankings = rankFamilies("fly", behavior, presentationArchetypes, input);

  const confidence = buildConfidence({
    input,
    sharedReliability: analysis.norm.reliability,
    behaviorReasons: behavior.confidence_reasons,
    lureRankings: lureRankings.ranked,
    flyRankings: flyRankings.ranked,
    archetypeScores: presentationArchetypes,
  });

  const narrationPayload = buildNarrationPayload({
    behavior,
    archetypes: presentationArchetypes,
    lureRankings: lureRankings.ranked,
    flyRankings: flyRankings.ranked,
    confidence,
  });

  return {
    response: {
      feature: RECOMMENDER_FEATURE,
      context: input.request.context,
      generated_at: meta?.generated_at ?? new Date().toISOString(),
      cache_expires_at: meta?.cache_expires_at ?? new Date().toISOString(),
      shared_condition_summary: {
        reliability: analysis.norm.reliability,
        timing_strength: analysis.timing.timing_strength,
        highlighted_periods: analysis.timing.highlighted_periods,
        drivers: analysis.scored.drivers.map((driver) => ({
          variable: driver.key,
          label: driver.label || driver.key,
        })),
        suppressors: analysis.scored.suppressors.map((suppressor) => ({
          variable: suppressor.key,
          label: suppressor.label || suppressor.key,
        })),
      },
      fish_behavior: behavior.fish_behavior,
      presentation_archetypes: presentationArchetypes,
      lure_rankings: lureRankings.ranked,
      fly_rankings: flyRankings.ranked,
      confidence,
      ...(input.inventory_items?.length
        ? {
            inventory: scoreInventoryCompatibility(
              input.inventory_items,
              lureRankings.ranked,
              flyRankings.ranked,
            ),
          }
        : {}),
      debug: buildDebugPayload({
        baselineProfileId: behavior.fish_behavior.baseline_profile_id,
        regionKey: input.request.region_key,
        month,
        reliability: analysis.norm.reliability,
        behavior,
        archetypes: presentationArchetypes,
        familyScores: [
          ...lureRankings.debug_scores,
          ...flyRankings.debug_scores,
        ],
        methodScores: [
          ...lureRankings.method_scores,
          ...flyRankings.method_scores,
        ],
        confidence,
      }),
      polished: null,
      narration_payload: narrationPayload,
    },
    behaviorResolution: behavior,
  };
}
