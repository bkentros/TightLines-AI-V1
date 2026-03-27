import type {
  PresentationArchetypeScore,
  RankedFamily,
  RecommenderConfidence,
  RecommenderResponse,
} from "./contracts.ts";
import type { BehaviorResolution } from "./modifiers.ts";

function relationLabel(id: string): string {
  return id.replaceAll("_", " ");
}

function depthLabel(id: string): string {
  switch (id) {
    case "very_shallow":
      return "very shallow water";
    case "mid_depth":
      return "mid-depth water";
    case "upper_column":
      return "the upper water column";
    case "lower_column":
      return "the lower water column";
    case "bottom_oriented":
      return "bottom-oriented lanes";
    default:
      return id.replaceAll("_", " ");
  }
}

function confidenceNote(confidence: RecommenderConfidence): string | null {
  if (confidence.family_confidence === "high") return null;
  if (confidence.family_confidence === "medium") {
    return "This is a strong starting recommendation, but local cover and water clarity will still steer the best family.";
  }
  return "Start broad and adjust quickly based on what the water actually looks like once you arrive.";
}

export function buildNarrationPayload(params: {
  behavior: BehaviorResolution;
  archetypes: PresentationArchetypeScore[];
  lureRankings: RankedFamily[];
  flyRankings: RankedFamily[];
  confidence: RecommenderConfidence;
}): RecommenderResponse["narration_payload"] {
  const topDepth = params.behavior.fish_behavior.position.depth_lanes[0]?.id ?? "mid_depth";
  const topRelation = params.behavior.fish_behavior.position.relation_tags[0]?.id ?? "edge_oriented";
  const topArchetype = params.archetypes[0];
  const topLure = params.lureRankings[0]?.display_name;
  const topFly = params.flyRankings[0]?.display_name;

  return {
    summary_seed:
      `Best bet is to start around ${depthLabel(topDepth)} with fish relating to ${relationLabel(topRelation)}. ` +
      `The current setup leans toward ${topArchetype ? topArchetype.archetype_id.replaceAll("_", " ") : "a balanced search presentation"}.`,
    position_points: [
      `Start around ${depthLabel(topDepth)}.`,
      `Prioritize ${relationLabel(topRelation)} first.`,
    ],
    behavior_points: [
      `Fish look ${params.behavior.fish_behavior.behavior.activity} with a ${params.behavior.fish_behavior.behavior.strike_zone} strike zone.`,
      `Chase radius looks ${params.behavior.fish_behavior.behavior.chase_radius}.`,
    ],
    presentation_points: [
      topArchetype
        ? `Lead with ${topArchetype.speed.replaceAll("_", " ")} ${topArchetype.depth_target.replaceAll("_", " ")} work.`
        : "Lead with the cleanest presentation that matches the lane.",
      topLure && topFly
        ? `Top starting families are ${topLure} on the lure side and ${topFly} on the fly side.`
        : topLure
        ? `Top starting family is ${topLure}.`
        : topFly
        ? `Top starting fly family is ${topFly}.`
        : "Use the top-ranked family as the first read and rotate only if fish show otherwise.",
    ],
    confidence_note: confidenceNote(params.confidence),
  };
}
