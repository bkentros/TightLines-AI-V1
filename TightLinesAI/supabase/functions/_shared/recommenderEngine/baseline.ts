import type {
  DepthLaneId,
  FishBehaviorOutput,
  RelationTagId,
} from "./contracts.ts";
import type {
  EngineContext,
  RegionKey,
} from "../howFishingEngine/contracts/mod.ts";
import { resolveTimingFamily } from "../howFishingEngine/timing/timingFamilies.ts";
import {
  DEPTH_LANE_IDS,
  RELATION_TAG_IDS,
  addToScore,
  emptyScoreMap,
} from "./helpers.ts";

export type ClimateBand =
  | "cold"
  | "temperate"
  | "warm"
  | "tropical"
  | "alpine"
  | "arid"
  | "maritime";

export type SeasonPhase =
  | "winter_hold"
  | "spring_transition"
  | "warm_transition"
  | "summer_pattern"
  | "summer_heat"
  | "fall_feed"
  | "late_fall";

export type BehaviorAccumulator = {
  baseline_profile_id: string;
  climate_band: ClimateBand;
  season_phase: SeasonPhase;
  depth_scores: Record<DepthLaneId, number>;
  relation_scores: Record<RelationTagId, number>;
  activity_index: number;
  strike_index: number;
  chase_index: number;
  style_flags: Set<string>;
  forage: FishBehaviorOutput["forage"];
};

function climateBandForRegion(region: RegionKey): ClimateBand {
  switch (region) {
    case "alaska":
    case "great_lakes_upper_midwest":
    case "northeast":
    case "appalachian":
      return "cold";
    case "pacific_northwest":
    case "northern_california":
      return "maritime";
    case "midwest_interior":
    case "south_central":
    case "mountain_west":
      return "temperate";
    case "mountain_alpine":
    case "inland_northwest":
      return "alpine";
    case "southwest_desert":
    case "southwest_high_desert":
      return "arid";
    case "florida":
    case "hawaii":
      return "tropical";
    case "southeast_atlantic":
    case "gulf_coast":
    case "southern_california":
      return "warm";
  }
}

function seasonPhaseForMonth(climateBand: ClimateBand, month: number): SeasonPhase {
  switch (climateBand) {
    case "cold":
      if (month <= 2 || month === 12) return "winter_hold";
      if (month <= 4) return "spring_transition";
      if (month <= 6) return "warm_transition";
      if (month <= 8) return "summer_pattern";
      if (month <= 10) return "fall_feed";
      return "late_fall";
    case "maritime":
      if (month <= 2 || month === 12) return "winter_hold";
      if (month <= 4) return "spring_transition";
      if (month <= 6) return "warm_transition";
      if (month <= 8) return "summer_pattern";
      if (month <= 10) return "fall_feed";
      return "late_fall";
    case "temperate":
      if (month <= 2 || month === 12) return "winter_hold";
      if (month <= 4) return "spring_transition";
      if (month <= 5) return "warm_transition";
      if (month <= 8) return "summer_pattern";
      if (month <= 10) return "fall_feed";
      return "late_fall";
    case "warm":
      if (month <= 1 || month === 12) return "winter_hold";
      if (month <= 3) return "spring_transition";
      if (month <= 5) return "warm_transition";
      if (month <= 9) return "summer_heat";
      if (month <= 10) return "fall_feed";
      return "late_fall";
    case "tropical":
      if (month <= 2 || month === 12) return "spring_transition";
      if (month <= 4) return "warm_transition";
      if (month <= 9) return "summer_heat";
      if (month <= 11) return "fall_feed";
      return "late_fall";
    case "alpine":
      if (month <= 4 || month === 12) return "winter_hold";
      if (month <= 6) return "spring_transition";
      if (month <= 8) return "summer_pattern";
      if (month <= 10) return "fall_feed";
      return "late_fall";
    case "arid":
      if (month <= 2 || month === 12) return "winter_hold";
      if (month <= 4) return "spring_transition";
      if (month <= 5) return "warm_transition";
      if (month <= 9) return "summer_heat";
      if (month <= 10) return "fall_feed";
      return "late_fall";
  }
}

function seasonPhaseFromTimingFamily(
  regionKey: RegionKey,
  month: number,
  context: EngineContext,
  climateBand: ClimateBand,
): SeasonPhase {
  if (
    context === "coastal" ||
    context === "coastal_flats_estuary" ||
    climateBand === "tropical"
  ) {
    return seasonPhaseForMonth(climateBand, month);
  }

  const familyId = resolveTimingFamily(context, regionKey, month).family_id;

  if (familyId.endsWith("_winter")) return "winter_hold";

  if (familyId.endsWith("_summer")) {
    return climateBand === "warm" || climateBand === "arid"
      ? "summer_heat"
      : "summer_pattern";
  }

  if (familyId.endsWith("_fall")) {
    const lateColdMonth =
      month >= 11 ||
      (month === 10 &&
        (climateBand === "cold" || climateBand === "maritime" || climateBand === "alpine"));
    return lateColdMonth ? "late_fall" : "fall_feed";
  }

  if (climateBand === "cold" || climateBand === "maritime" || climateBand === "alpine") {
    return month <= 5 ? "spring_transition" : "warm_transition";
  }
  if (climateBand === "temperate") {
    return month <= 4 ? "spring_transition" : "warm_transition";
  }
  return month <= 4 ? "spring_transition" : "warm_transition";
}

function makeAccumulator(
  regionKey: RegionKey,
  month: number,
  context: EngineContext,
): BehaviorAccumulator {
  const climateBand = climateBandForRegion(regionKey);
  const seasonPhase = seasonPhaseFromTimingFamily(
    regionKey,
    month,
    context,
    climateBand,
  );
  return {
    baseline_profile_id: `${regionKey}:${context}:m${month}`,
    climate_band: climateBand,
    season_phase: seasonPhase,
    depth_scores: emptyScoreMap(DEPTH_LANE_IDS),
    relation_scores: emptyScoreMap(RELATION_TAG_IDS),
    activity_index: 0,
    strike_index: 0,
    chase_index: 0,
    style_flags: new Set<string>(),
    forage: {
      baitfish_bias: 0.35,
      crustacean_bias: 0.2,
      insect_bias: 0.2,
      amphibian_surface_bias: 0.05,
    },
  };
}

function addDepth(acc: BehaviorAccumulator, id: DepthLaneId, delta: number): void {
  addToScore(acc.depth_scores, id, delta);
}

function addRelation(
  acc: BehaviorAccumulator,
  id: RelationTagId,
  delta: number,
): void {
  addToScore(acc.relation_scores, id, delta);
}

function lakeBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "edge_oriented", 1.2);
  addRelation(acc, "structure_oriented", 1);
  addRelation(acc, "depth_transition_oriented", 1);
  addRelation(acc, "cover_oriented", 0.8);
  addDepth(acc, "mid_depth", 1);
  addDepth(acc, "lower_column", 0.8);
  acc.forage.baitfish_bias += 0.15;
}

function riverBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "seam_oriented", 1.4);
  addRelation(acc, "current_break_oriented", 1.4);
  addRelation(acc, "hole_oriented", 1);
  addRelation(acc, "undercut_bank_oriented", 0.8);
  addDepth(acc, "lower_column", 1.2);
  addDepth(acc, "bottom_oriented", 1);
  acc.forage.insect_bias += 0.1;
  acc.style_flags.add("current_drift_best");
}

function coastalBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "channel_related", 1.4);
  addRelation(acc, "point_oriented", 1.1);
  addRelation(acc, "current_break_oriented", 1.2);
  addRelation(acc, "depth_transition_oriented", 0.8);
  addDepth(acc, "mid_depth", 1);
  addDepth(acc, "lower_column", 1);
  acc.forage.baitfish_bias += 0.25;
  acc.forage.crustacean_bias += 0.1;
}

function flatsBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "flats_related", 1.4);
  addRelation(acc, "drain_oriented", 1.1);
  addRelation(acc, "grass_edge_oriented", 1.1);
  addRelation(acc, "pothole_oriented", 0.9);
  addRelation(acc, "trough_oriented", 0.9);
  addDepth(acc, "shallow", 1.2);
  addDepth(acc, "very_shallow", 0.6);
  addDepth(acc, "lower_column", 0.5);
  acc.forage.baitfish_bias += 0.2;
  acc.forage.crustacean_bias += 0.2;
}

function applyWinterHold(
  acc: BehaviorAccumulator,
  context: EngineContext,
): void {
  addDepth(acc, "deep", 1.6);
  addDepth(acc, "bottom_oriented", 1.4);
  addDepth(acc, "lower_column", 1.1);
  addDepth(acc, "shallow", -0.8);
  addDepth(acc, "upper_column", -0.8);
  addRelation(acc, "depth_transition_oriented", 0.8);
  if (context === "freshwater_river") {
    addRelation(acc, "hole_oriented", 1.1);
    addRelation(acc, "seam_oriented", 0.6);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "drain_oriented", 0.8);
    addRelation(acc, "trough_oriented", 0.8);
    addRelation(acc, "pothole_oriented", 0.8);
    addDepth(acc, "very_shallow", -0.9);
  }
  acc.activity_index -= 1.1;
  acc.strike_index -= 0.7;
  acc.chase_index -= 0.8;
  acc.style_flags.add("finesse_best");
  acc.style_flags.add("slow_bottom_best");
}

function applySpringTransition(
  acc: BehaviorAccumulator,
  context: EngineContext,
): void {
  addDepth(acc, "shallow", 0.8);
  addDepth(acc, "upper_column", 0.5);
  addDepth(acc, "deep", -0.4);
  addRelation(acc, "edge_oriented", 0.5);
  addRelation(acc, "shoreline_cruising", 0.4);
  if (context === "freshwater_lake_pond") {
    addRelation(acc, "cover_oriented", 0.7);
    addRelation(acc, "vegetation_oriented", 0.4);
  }
  if (context === "freshwater_river") {
    addRelation(acc, "seam_oriented", 0.7);
    addRelation(acc, "current_break_oriented", 0.6);
  }
  if (context === "coastal") {
    addRelation(acc, "point_oriented", 0.6);
    addRelation(acc, "channel_related", 0.4);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "grass_edge_oriented", 0.7);
    addRelation(acc, "marsh_edge_oriented", 0.7);
    addRelation(acc, "drain_oriented", 0.5);
  }
  acc.activity_index += 0.2;
  acc.strike_index += 0.1;
  acc.chase_index += 0.1;
  acc.style_flags.add("finesse_best");
}

function applyWarmTransition(
  acc: BehaviorAccumulator,
  context: EngineContext,
): void {
  addDepth(acc, "shallow", 1.1);
  addDepth(acc, "upper_column", 0.9);
  addDepth(acc, "mid_depth", 0.6);
  addDepth(acc, "deep", -0.6);
  addRelation(acc, "edge_oriented", 0.8);
  addRelation(acc, "shoreline_cruising", 0.6);
  acc.activity_index += 0.8;
  acc.strike_index += 0.5;
  acc.chase_index += 0.5;
  acc.style_flags.add("horizontal_search_best");
  acc.style_flags.add("willing_to_chase");
  acc.style_flags.add("broad_feeding_window");
  if (context === "freshwater_lake_pond") {
    addRelation(acc, "vegetation_oriented", 0.9);
    addRelation(acc, "cover_oriented", 0.7);
    acc.style_flags.add("baitfish_match");
  }
  if (context === "freshwater_river") {
    addRelation(acc, "seam_oriented", 0.6);
    addRelation(acc, "current_break_oriented", 0.7);
    acc.style_flags.add("current_drift_best");
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "grass_edge_oriented", 0.8);
    addRelation(acc, "marsh_edge_oriented", 0.8);
    addRelation(acc, "flats_related", 0.5);
  }
}

function applySummerPattern(
  acc: BehaviorAccumulator,
  context: EngineContext,
): void {
  addDepth(acc, "shallow", 0.7);
  addDepth(acc, "mid_depth", 0.8);
  addDepth(acc, "upper_column", 0.6);
  addRelation(acc, "shade_oriented", 0.8);
  addRelation(acc, "edge_oriented", 0.7);
  acc.activity_index += 0.6;
  acc.strike_index += 0.3;
  acc.chase_index += 0.4;
  acc.style_flags.add("horizontal_search_best");
  acc.style_flags.add("short_feeding_windows");
  if (context === "freshwater_lake_pond") {
    addRelation(acc, "vegetation_oriented", 1.2);
    addRelation(acc, "cover_oriented", 0.8);
    acc.forage.amphibian_surface_bias = (acc.forage.amphibian_surface_bias ?? 0) + 0.2;
    acc.style_flags.add("topwater_window");
  }
  if (context === "freshwater_river") {
    addRelation(acc, "undercut_bank_oriented", 0.9);
    addRelation(acc, "seam_oriented", 0.7);
  }
  if (context === "coastal") {
    addRelation(acc, "point_oriented", 0.6);
    addRelation(acc, "channel_related", 0.8);
    acc.style_flags.add("baitfish_match");
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "grass_edge_oriented", 1);
    addRelation(acc, "pothole_oriented", 0.8);
    addRelation(acc, "trough_oriented", 0.8);
    acc.style_flags.add("baitfish_match");
    acc.style_flags.add("crustacean_match");
  }
}

function applySummerHeat(
  acc: BehaviorAccumulator,
  context: EngineContext,
): void {
  addDepth(acc, "mid_depth", 1.1);
  addDepth(acc, "deep", 1);
  addDepth(acc, "lower_column", 0.9);
  addDepth(acc, "very_shallow", -0.9);
  addDepth(acc, "upper_column", -0.6);
  addRelation(acc, "shade_oriented", 1.2);
  addRelation(acc, "depth_transition_oriented", 0.9);
  acc.activity_index -= 0.1;
  acc.strike_index -= 0.2;
  acc.chase_index -= 0.2;
  acc.style_flags.add("finesse_best");
  acc.style_flags.add("short_feeding_windows");
  if (context === "freshwater_lake_pond") {
    addRelation(acc, "vegetation_oriented", 0.8);
    addRelation(acc, "cover_oriented", 0.8);
  }
  if (context === "freshwater_river") {
    addRelation(acc, "current_break_oriented", 0.8);
    addRelation(acc, "hole_oriented", 0.8);
    addRelation(acc, "undercut_bank_oriented", 0.8);
    acc.style_flags.add("current_drift_best");
  }
  if (context === "coastal") {
    addRelation(acc, "channel_related", 1);
    addRelation(acc, "point_oriented", 0.8);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "drain_oriented", 0.8);
    addRelation(acc, "trough_oriented", 1);
    addRelation(acc, "pothole_oriented", 1);
    addRelation(acc, "oyster_bar_oriented", 0.6);
  }
}

function applyFallFeed(acc: BehaviorAccumulator, context: EngineContext): void {
  addDepth(acc, "shallow", 0.8);
  addDepth(acc, "mid_depth", 0.8);
  addDepth(acc, "upper_column", 0.5);
  addRelation(acc, "edge_oriented", 0.8);
  addRelation(acc, "shoreline_cruising", 0.7);
  addRelation(acc, "open_water_roaming", 0.6);
  acc.activity_index += 0.9;
  acc.strike_index += 0.7;
  acc.chase_index += 0.8;
  acc.style_flags.add("horizontal_search_best");
  acc.style_flags.add("baitfish_match");
  acc.style_flags.add("willing_to_chase");
  acc.style_flags.add("broad_feeding_window");
  if (context === "freshwater_lake_pond") {
    addRelation(acc, "point_oriented", 0.5);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "drain_oriented", 0.7);
    addRelation(acc, "grass_edge_oriented", 0.7);
  }
}

function applyLateFall(acc: BehaviorAccumulator, context: EngineContext): void {
  addDepth(acc, "mid_depth", 0.8);
  addDepth(acc, "deep", 0.9);
  addDepth(acc, "lower_column", 0.9);
  addDepth(acc, "upper_column", -0.4);
  addRelation(acc, "depth_transition_oriented", 0.8);
  addRelation(acc, "structure_oriented", 0.5);
  acc.activity_index -= 0.3;
  acc.strike_index -= 0.1;
  acc.chase_index -= 0.2;
  acc.style_flags.add("finesse_best");
  if (context === "freshwater_river") {
    addRelation(acc, "hole_oriented", 0.7);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "drain_oriented", 0.6);
    addRelation(acc, "trough_oriented", 0.6);
  }
}

export function buildBaselineBehavior(
  regionKey: RegionKey,
  month: number,
  context: EngineContext,
): BehaviorAccumulator {
  const acc = makeAccumulator(regionKey, month, context);

  switch (context) {
    case "freshwater_lake_pond":
      lakeBase(acc);
      break;
    case "freshwater_river":
      riverBase(acc);
      break;
    case "coastal":
      coastalBase(acc);
      break;
    case "coastal_flats_estuary":
      flatsBase(acc);
      break;
  }

  switch (acc.season_phase) {
    case "winter_hold":
      applyWinterHold(acc, context);
      break;
    case "spring_transition":
      applySpringTransition(acc, context);
      break;
    case "warm_transition":
      applyWarmTransition(acc, context);
      break;
    case "summer_pattern":
      applySummerPattern(acc, context);
      break;
    case "summer_heat":
      applySummerHeat(acc, context);
      break;
    case "fall_feed":
      applyFallFeed(acc, context);
      break;
    case "late_fall":
      applyLateFall(acc, context);
      break;
  }

  return acc;
}
