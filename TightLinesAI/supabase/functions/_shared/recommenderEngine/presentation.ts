import type {
  ActivityState,
  PresentationArchetypeId,
  PresentationArchetypeScore,
  PresentationDepthTarget,
  PresentationMotion,
  PresentationSpeed,
  PresentationTrigger,
  RelationTagId,
  StrikeZoneState,
} from "./contracts.ts";
import type { EngineContext } from "../howFishingEngine/contracts/mod.ts";
import type { BehaviorResolution } from "./modifiers.ts";

type ArchetypeDefinition = {
  id: PresentationArchetypeId;
  supported_contexts: EngineContext[];
  depth_target: PresentationDepthTarget;
  speed: PresentationSpeed;
  motions: PresentationMotion[];
  triggers: PresentationTrigger[];
  depth_fit: string[];
  relation_fit: RelationTagId[];
  activity_fit: ActivityState[];
  strike_fit: StrikeZoneState[];
  style_flags: string[];
  light_fit?: Array<BehaviorResolution["light_profile"]>;
  current_fit?: Array<BehaviorResolution["current_profile"]>;
  daypart_fit?: string[];
};

const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: "subtle_shallow_cover",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river"],
    depth_target: "upper_column",
    speed: "slow",
    motions: ["subtle", "twitch_pause"],
    triggers: ["finesse", "natural_match"],
    depth_fit: ["very_shallow", "shallow", "upper_column"],
    relation_fit: ["cover_oriented", "vegetation_oriented", "shade_oriented"],
    activity_fit: ["inactive", "neutral", "active"],
    strike_fit: ["narrow", "moderate"],
    style_flags: ["finesse_best", "tight_to_cover"],
    light_fit: ["bright", "mixed"],
  },
  {
    id: "slow_bottom_contact",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river", "coastal", "coastal_flats_estuary"],
    depth_target: "bottom_contact",
    speed: "dead_slow",
    motions: ["dragging", "hopping"],
    triggers: ["finesse", "bottom_contact"],
    depth_fit: ["deep", "bottom_oriented", "lower_column"],
    relation_fit: ["structure_oriented", "depth_transition_oriented", "hole_oriented", "trough_oriented"],
    activity_fit: ["inactive", "neutral"],
    strike_fit: ["narrow", "moderate"],
    style_flags: ["slow_bottom_best", "finesse_best"],
  },
  {
    id: "horizontal_search_mid_column",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    depth_target: "mid_column",
    speed: "moderate",
    motions: ["steady", "straight_retrieve"],
    triggers: ["reaction", "flash", "vibration"],
    depth_fit: ["shallow", "mid_depth", "suspended"],
    relation_fit: ["edge_oriented", "point_oriented", "channel_related", "grass_edge_oriented"],
    activity_fit: ["active", "aggressive"],
    strike_fit: ["moderate", "wide"],
    style_flags: ["horizontal_search_best", "willing_to_chase", "baitfish_match"],
  },
  {
    id: "surface_low_light_commotion",
    supported_contexts: ["freshwater_lake_pond", "coastal", "coastal_flats_estuary"],
    depth_target: "surface",
    speed: "moderate",
    motions: ["walk_pause", "pop_pause"],
    triggers: ["commotion", "silhouette"],
    depth_fit: ["very_shallow", "shallow", "upper_column"],
    relation_fit: ["vegetation_oriented", "shoreline_cruising", "grass_edge_oriented", "marsh_edge_oriented"],
    activity_fit: ["active", "aggressive"],
    strike_fit: ["moderate", "wide"],
    style_flags: ["topwater_window"],
    light_fit: ["low_light"],
    daypart_fit: ["Dawn", "Evening"],
  },
  {
    id: "current_seam_drift",
    supported_contexts: ["freshwater_river", "coastal"],
    depth_target: "near_bottom",
    speed: "slow",
    motions: ["drift_natural", "sweeping"],
    triggers: ["current_drift", "natural_match"],
    depth_fit: ["mid_depth", "lower_column", "bottom_oriented"],
    relation_fit: ["seam_oriented", "current_break_oriented", "hole_oriented", "channel_related"],
    activity_fit: ["inactive", "neutral", "active"],
    strike_fit: ["narrow", "moderate"],
    style_flags: ["current_drift_best"],
    current_fit: ["moving", "strong"],
  },
  {
    id: "drain_edge_intercept",
    supported_contexts: ["coastal_flats_estuary"],
    depth_target: "near_bottom",
    speed: "moderate",
    motions: ["steady", "twitch_pause"],
    triggers: ["reaction", "current_drift", "visibility"],
    depth_fit: ["shallow", "lower_column", "bottom_oriented"],
    relation_fit: ["drain_oriented", "trough_oriented", "pothole_oriented", "oyster_bar_oriented"],
    activity_fit: ["neutral", "active", "aggressive"],
    strike_fit: ["moderate", "wide"],
    style_flags: ["draining_window_best"],
    current_fit: ["moving", "strong"],
  },
  {
    id: "grass_edge_swim",
    supported_contexts: ["freshwater_lake_pond", "coastal_flats_estuary"],
    depth_target: "upper_column",
    speed: "moderate",
    motions: ["steady", "straight_retrieve"],
    triggers: ["reaction", "visibility", "flash"],
    depth_fit: ["very_shallow", "shallow", "upper_column"],
    relation_fit: ["vegetation_oriented", "grass_edge_oriented", "cover_oriented"],
    activity_fit: ["active", "aggressive"],
    strike_fit: ["moderate", "wide"],
    style_flags: ["horizontal_search_best", "willing_to_chase"],
  },
  {
    id: "depth_break_suspend_pause",
    supported_contexts: ["freshwater_lake_pond", "coastal"],
    depth_target: "mid_column",
    speed: "slow",
    motions: ["twitch_pause", "subtle"],
    triggers: ["reaction", "flash", "finesse"],
    depth_fit: ["mid_depth", "suspended", "lower_column"],
    relation_fit: ["depth_transition_oriented", "channel_related", "point_oriented", "structure_oriented"],
    activity_fit: ["neutral", "active"],
    strike_fit: ["narrow", "moderate"],
    style_flags: ["baitfish_match"],
  },
  {
    id: "open_flats_cruise_intercept",
    supported_contexts: ["coastal_flats_estuary"],
    depth_target: "upper_column",
    speed: "moderate",
    motions: ["steady", "straight_retrieve"],
    triggers: ["natural_match", "visibility", "flash"],
    depth_fit: ["very_shallow", "shallow", "upper_column"],
    relation_fit: ["flats_related", "marsh_edge_oriented", "shoreline_cruising", "grass_edge_oriented"],
    activity_fit: ["active", "aggressive"],
    strike_fit: ["moderate", "wide"],
    style_flags: ["flooding_window_best", "willing_to_chase"],
    light_fit: ["mixed", "low_light"],
  },
  {
    id: "tight_to_cover_vertical",
    supported_contexts: ["freshwater_lake_pond", "freshwater_river", "coastal"],
    depth_target: "near_bottom",
    speed: "slow",
    motions: ["hopping", "dragging"],
    triggers: ["bottom_contact", "finesse"],
    depth_fit: ["mid_depth", "deep", "bottom_oriented"],
    relation_fit: ["cover_oriented", "structure_oriented", "current_break_oriented"],
    activity_fit: ["inactive", "neutral"],
    strike_fit: ["narrow", "moderate"],
    style_flags: ["tight_to_cover", "finesse_best"],
    light_fit: ["bright", "mixed"],
  },
];

function relationScore(
  behavior: BehaviorResolution,
  relation: RelationTagId,
): number {
  return behavior.relation_scores.find((item) => item.id === relation)?.score ?? 0;
}

function depthScore(
  behavior: BehaviorResolution,
  depthId: string,
): number {
  return behavior.depth_scores.find((item) => item.id === depthId)?.score ?? 0;
}

function overlaps<T>(items: readonly T[], compare: readonly T[]): number {
  return items.filter((item) => compare.includes(item)).length;
}

export function resolvePresentationArchetypes(
  behavior: BehaviorResolution,
  context: EngineContext,
): PresentationArchetypeScore[] {
  return ARCHETYPES
    .filter((archetype) => archetype.supported_contexts.includes(context))
    .map((archetype) => {
      let score = 0;
      const reasons: string[] = [];

      const bestDepth = Math.max(...archetype.depth_fit.map((depthId) => depthScore(behavior, depthId)));
      score += bestDepth * 14;
      if (bestDepth > 1) reasons.push(`matches the ${archetype.depth_target.replaceAll("_", " ")} lane`);

      const relationFit = archetype.relation_fit
        .map((relation) => relationScore(behavior, relation))
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((sum, value) => sum + value, 0);
      score += relationFit * 10;
      if (relationFit > 1.2) reasons.push("fits the main holding cover or edge");

      if (archetype.activity_fit.includes(behavior.fish_behavior.behavior.activity)) {
        score += 10;
        reasons.push(`fits a ${behavior.fish_behavior.behavior.activity} activity level`);
      }
      if (archetype.strike_fit.includes(behavior.fish_behavior.behavior.strike_zone)) {
        score += 8;
      }

      const styleMatches = overlaps(archetype.style_flags, behavior.style_flags);
      score += styleMatches * 7;
      if (styleMatches > 0) reasons.push("matches the day’s preferred presentation style");

      if (archetype.light_fit?.includes(behavior.light_profile)) {
        score += 6;
      }
      if (archetype.current_fit?.includes(behavior.current_profile)) {
        score += 6;
        reasons.push("lines up with the current or tide setup");
      }
      if (archetype.daypart_fit && overlaps(archetype.daypart_fit, behavior.best_dayparts) > 0) {
        score += 5;
      }

      if (context === "coastal" && behavior.inferred_clarity === "dirty") {
        if (archetype.id === "slow_bottom_contact" && behavior.fish_behavior.behavior.activity !== "aggressive") {
          score += 14;
          reasons.push("dirty inshore water favors slower lower-lane control");
        }
        if (archetype.id === "current_seam_drift") {
          score -= 16;
        }
        if (archetype.id === "depth_break_suspend_pause") {
          score -= 12;
        }
        if (archetype.id === "tight_to_cover_vertical") {
          score -= 10;
        }
      }

      return {
        archetype_id: archetype.id,
        score: Number(score.toFixed(2)),
        reasons: reasons.slice(0, 3),
        depth_target: archetype.depth_target,
        speed: archetype.speed,
        motions: archetype.motions,
        triggers: archetype.triggers,
      };
    })
    .sort((a, b) => b.score - a.score || a.archetype_id.localeCompare(b.archetype_id))
    .slice(0, 3);
}
