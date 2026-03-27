import type {
  PresentationArchetypeScore,
  RankedFamily,
  RecommenderConfidence,
  RecommenderResponse,
} from "./contracts.ts";
import type { BehaviorResolution } from "./modifiers.ts";

function relationLabel(id: string): string {
  const map: Record<string, string> = {
    cover_oriented: "cover",
    vegetation_oriented: "vegetation and weed lines",
    edge_oriented: "edges and transitions",
    structure_oriented: "hard structure",
    current_break_oriented: "current breaks",
    channel_related: "channel edges",
    flats_related: "open flats",
    shoreline_cruising: "shoreline",
    open_water_roaming: "open water",
    shade_oriented: "shaded areas",
    depth_transition_oriented: "depth transitions",
    undercut_bank_oriented: "undercut banks",
    hole_oriented: "deeper holes",
    seam_oriented: "current seams",
    point_oriented: "points",
    drain_oriented: "drains",
    grass_edge_oriented: "grass edges",
    pothole_oriented: "potholes",
    trough_oriented: "troughs",
    oyster_bar_oriented: "oyster bars",
    marsh_edge_oriented: "marsh edges",
  };
  return map[id] ?? id.replaceAll("_", " ");
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

export function archetypeLabel(id: string): string {
  const map: Record<string, string> = {
    subtle_shallow_cover: "finesse shallow cover work",
    slow_bottom_contact: "slow bottom contact",
    horizontal_search_mid_column: "mid-column search",
    surface_low_light_commotion: "low-light topwater",
    current_seam_drift: "current seam drift",
    drain_edge_intercept: "drain edge intercept",
    grass_edge_swim: "grass edge swim",
    depth_break_suspend_pause: "suspend and pause near depth breaks",
    open_flats_cruise_intercept: "open flats intercept",
    tight_to_cover_vertical: "tight vertical cover work",
  };
  return map[id] ?? id.replaceAll("_", " ");
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
  const topLureMethod = params.lureRankings[0]?.best_method.label;
  const topFly = params.flyRankings[0]?.display_name;
  const topFlyMethod = params.flyRankings[0]?.best_method.label;

  return {
    summary_seed:
      `Best bet is to start around ${depthLabel(topDepth)} with fish relating to ${relationLabel(topRelation)}. ` +
      `The current setup leans toward ${topArchetype ? archetypeLabel(topArchetype.archetype_id) : "a balanced search presentation"}.`,
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
        ? `Top starting reads are ${topLure}${topLureMethod ? ` on a ${topLureMethod}` : ""} and ${topFly}${topFlyMethod ? ` on a ${topFlyMethod}` : ""}.`
        : topLure
        ? `Top starting family is ${topLure}${topLureMethod ? ` on a ${topLureMethod}` : ""}.`
        : topFly
        ? `Top starting fly family is ${topFly}${topFlyMethod ? ` on a ${topFlyMethod}` : ""}.`
        : "Use the top-ranked family as the first read and rotate only if fish show otherwise.",
    ],
    confidence_note: confidenceNote(params.confidence),
  };
}
