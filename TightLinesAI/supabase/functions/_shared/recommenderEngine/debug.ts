import type {
  RecommenderConfidence,
  RecommenderDebugPayload,
} from "./contracts.ts";
import type { RegionKey } from "../howFishingEngine/contracts/mod.ts";
import type { BehaviorResolution } from "./modifiers.ts";
import type { PresentationArchetypeScore } from "./contracts.ts";

export function buildDebugPayload(params: {
  baselineProfileId: string;
  regionKey: RegionKey;
  month: number;
  reliability: "high" | "medium" | "low";
  behavior: BehaviorResolution;
  archetypes: PresentationArchetypeScore[];
  familyScores: RecommenderDebugPayload["family_scores"];
  confidence: RecommenderConfidence;
}): RecommenderDebugPayload {
  return {
    baseline_profile_id: params.baselineProfileId,
    region_key: params.regionKey,
    month: params.month,
    shared_condition_reliability: params.reliability,
    active_modifiers: params.behavior.active_modifiers,
    depth_lane_scores: params.behavior.depth_scores,
    relation_scores: params.behavior.relation_scores,
    archetype_scores: params.archetypes.map((item) => ({
      archetype_id: item.archetype_id,
      score: item.score,
      reasons: item.reasons,
    })),
    family_scores: params.familyScores,
    confidence_reasons: params.confidence.reasons,
  };
}
