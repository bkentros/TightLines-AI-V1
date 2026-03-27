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
    // Forage starting point — deliberately neutral before context base functions tune it.
    // Each base function (lakeBase, riverBase, coastalBase, flatsBase) sets realistic
    // defaults for that water type. Season phase functions layer seasonal tuning on top.
    forage: {
      baitfish_bias: 0.30,
      crawfish_bias: 0.15,      // freshwater crayfish; tuned up heavily for lake/river
      crustacean_bias: 0.10,    // saltwater crustaceans (shrimp, crab); tuned up for coastal/flats
      insect_bias: 0.15,        // aquatic insects; tuned heavily for rivers
      worm_invertebrate_bias: 0.10, // worms, leeches, soft invertebrates; rivers + runoff events
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
  // Lakes host baitfish schools (shad, perch, bluegill) and crayfish near hard bottom/rock.
  // Crayfish are the #1 bass forage in most US lake systems.
  acc.forage.baitfish_bias += 0.20;          // → 0.50 baitfish base
  acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.20; // → 0.35 crawfish base
  // Insects stay low (0.15) — lake insects matter less than in rivers
  // Coastal crustacean stays low (0.10) — not relevant for freshwater lake
}

function riverBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "seam_oriented", 1.4);
  addRelation(acc, "current_break_oriented", 1.4);
  addRelation(acc, "hole_oriented", 1);
  addRelation(acc, "undercut_bank_oriented", 0.8);
  addDepth(acc, "lower_column", 1.2);
  addDepth(acc, "bottom_oriented", 1);
  acc.style_flags.add("current_drift_best");
  // Rivers are insect-driven ecosystems — aquatic invertebrates are the foundation of
  // the food web. Crayfish and worms/invertebrates are also key prey.
  // Baitfish (minnows, sculpin, shiners) matter but are secondary to subsurface invertebrates.
  acc.forage.insect_bias += 0.25;                            // → 0.40 insect base
  acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.10; // → 0.25 crawfish base
  acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) + 0.10; // → 0.20 worm base
  // baitfish stays at 0.30 — minnows/sculpin/shiners are secondary river forage
  // crustacean (saltwater) stays at 0.10 — not relevant for freshwater rivers
}

function coastalBase(acc: BehaviorAccumulator): void {
  addRelation(acc, "channel_related", 1.4);
  addRelation(acc, "point_oriented", 1.1);
  addRelation(acc, "current_break_oriented", 1.2);
  addRelation(acc, "depth_transition_oriented", 0.8);
  addDepth(acc, "mid_depth", 1);
  addDepth(acc, "lower_column", 1);
  // Inshore coastal is baitfish-driven (mullet, menhaden, pinfish, peanut bunker).
  // Crustaceans (shrimp, crab) are always in the mix but baitfish dominate open water searches.
  acc.forage.baitfish_bias += 0.25;   // → 0.55 baitfish base
  acc.forage.crustacean_bias += 0.25; // → 0.35 coastal crustacean base
  // crawfish not relevant for saltwater coastal
  // insects not relevant for coastal
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
  // Flats are crustacean-dominated ecosystems. Shrimp and crab are the primary forage
  // for redfish, snook, bonefish, permit, and sea trout on US flats.
  // Baitfish (pinfish, piggyperch, small mullet) are secondary but always present.
  acc.forage.crustacean_bias += 0.35; // → 0.45 crustacean base (shrimp + crab dominant)
  acc.forage.baitfish_bias += 0.10;   // → 0.40 baitfish base
  // crawfish not relevant for saltwater flats
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
    // Winter: fish move into the deepest holding water. Pools and holes are the refugia.
    // Seams still exist but fish are not actively working them — slow and deep is the rule.
    addRelation(acc, "hole_oriented", 1.1);
    addRelation(acc, "pool_oriented", 1.2);
    addRelation(acc, "seam_oriented", 0.4);
    addRelation(acc, "riffle_oriented", -0.7); // fish abandon riffles in winter — too cold, too exposed
    // Worm/invertebrate (midges, baetis nymphs) are key winter forage in rivers
    acc.forage.insect_bias += 0.10;             // midges and small nymphs dominate winter
    acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) + 0.05;
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.08; // slow crawfish near bottom
  }
  if (context === "freshwater_lake_pond") {
    // Winter lake: crawfish are slow and easy prey near deep hard-bottom areas
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.10;
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
    // Spring is the peak crawfish bite — molting crayfish are orange-bellied, exposed, and
    // vulnerable. Pre-spawn bass eat crawfish heavily as they move toward spawning flats.
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.15; // peak spring crawfish
    acc.forage.baitfish_bias += 0.05; // spawn-run baitfish starting
  }
  if (context === "freshwater_river") {
    // Spring runoff: fish move to current breaks and seams. Tailouts activate as fish
    // transition from winter pools. Runoff also washes worms and invertebrates into the water.
    addRelation(acc, "seam_oriented", 0.8);
    addRelation(acc, "current_break_oriented", 0.7);
    addRelation(acc, "tailout_oriented", 0.6);
    addRelation(acc, "riffle_oriented", 0.3); // riffles starting to activate but still cool
    addRelation(acc, "pool_oriented", -0.3);  // fish moving out of winter pools
    acc.forage.insect_bias += 0.15;           // early hatches: BWO, stoneflies, caddis starting
    acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) + 0.15; // runoff washes worms
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.10; // crawfish active in spring
  }
  if (context === "coastal") {
    addRelation(acc, "point_oriented", 0.6);
    addRelation(acc, "channel_related", 0.4);
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "grass_edge_oriented", 0.7);
    addRelation(acc, "marsh_edge_oriented", 0.7);
    addRelation(acc, "drain_oriented", 0.5);
    acc.forage.crustacean_bias += 0.10; // spring shrimp migration on Gulf and SE flats
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
    // Late spring: baitfish active, frogs starting to appear along edges, crawfish still present
    acc.forage.baitfish_bias += 0.15;
    acc.forage.amphibian_surface_bias = (acc.forage.amphibian_surface_bias ?? 0) + 0.10; // frogs starting
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) - 0.05; // crawfish less vulnerable now (active)
  }
  if (context === "freshwater_river") {
    // Warm transition: runoff subsiding, hatches ramping up, riffles and tailouts prime.
    // Prime hatch season starting — caddis, early PMD, and stoneflies.
    addRelation(acc, "seam_oriented", 0.7);
    addRelation(acc, "current_break_oriented", 0.7);
    addRelation(acc, "riffle_oriented", 0.8);    // riffles now producing insects and feeding fish
    addRelation(acc, "tailout_oriented", 0.8);   // tailouts prime feeding position
    addRelation(acc, "undercut_bank_oriented", 0.6);
    acc.style_flags.add("current_drift_best");
    acc.forage.insect_bias += 0.15; // prime early hatch season: caddis, stonefly, early PMD
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.08;
    acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) - 0.05; // runoff subsiding
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
    acc.forage.amphibian_surface_bias = (acc.forage.amphibian_surface_bias ?? 0) + 0.20; // frog season
    acc.forage.baitfish_bias += 0.10; // shad and bluegill schools active
    acc.style_flags.add("topwater_window");
  }
  if (context === "freshwater_river") {
    // Summer pattern: riffles are the prime feeding habitat. Oxygenated, insect-rich,
    // ideal temps. Undercut banks and shade are critical refuge and ambush lies.
    // Terrestrials (hoppers, beetles, ants) fall from banks and become major forage.
    addRelation(acc, "riffle_oriented", 1.0);        // riffles are the prime summer river zone
    addRelation(acc, "undercut_bank_oriented", 1.0); // shade + cool + cover = prime summer lies
    addRelation(acc, "tailout_oriented", 0.7);       // tailouts active for evening feeding
    addRelation(acc, "seam_oriented", 0.6);
    acc.forage.insect_bias += 0.20;  // peak hatch season: PMD, caddis, trico, terrestrials
    acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) + 0.10; // terrestrial spillover
    acc.style_flags.add("hatch_window"); // pre-set; modifiers.ts will verify conditions before keeping it
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
    acc.forage.crustacean_bias += 0.10; // summer shrimp and crab peak activity on flats
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
    // Summer heat: fish push deep to thermocline. Crawfish near deep rock edges.
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.10; // crawfish near deep rock
    acc.forage.baitfish_bias += 0.05;
  }
  if (context === "freshwater_river") {
    // Extreme heat: fish retreat from exposed riffles to deep pools, holes, and undercut
    // shade. Feeding windows narrow to dawn/dusk. Terrestrial insects still important in AM.
    addRelation(acc, "current_break_oriented", 0.8);
    addRelation(acc, "hole_oriented", 0.8);
    addRelation(acc, "pool_oriented", 0.7);      // pools as thermal refuge
    addRelation(acc, "undercut_bank_oriented", 0.9); // shade critical
    addRelation(acc, "riffle_oriented", -0.4);   // riffles too warm and exposed in peak heat
    acc.style_flags.add("current_drift_best");
    acc.forage.insect_bias += 0.10; // trico and terrestrial windows at dawn/dusk
    acc.forage.worm_invertebrate_bias = (acc.forage.worm_invertebrate_bias ?? 0) + 0.05;
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
    // Fall is THE baitfish season — shad and perch schools migrate to shallows.
    // This is the most important seasonal baitfish shift of the year for bass/stripers.
    acc.forage.baitfish_bias += 0.25; // peak baitfish push — school size and activity at max
    acc.forage.amphibian_surface_bias = (acc.forage.amphibian_surface_bias ?? 0) - 0.10; // frogs done
  }
  if (context === "freshwater_river") {
    // Fall: baitfish staging in tailouts, BWOs returning, crawfish still active.
    // Tailouts are the prime intercept position for feeding fish in fall.
    addRelation(acc, "tailout_oriented", 1.0); // prime fall feeding position
    addRelation(acc, "seam_oriented", 0.7);
    addRelation(acc, "riffle_oriented", 0.5);
    acc.forage.baitfish_bias += 0.15; // fall baitfish migration (shiners, dace, minnow schools)
    acc.forage.insect_bias += 0.05;   // BWO and October caddis returns
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.05;
  }
  if (context === "coastal") {
    // Mullet run (Sept-Nov, Atlantic + Gulf) is the largest coastal forage event of the year.
    acc.forage.baitfish_bias += 0.20; // mullet run — biggest coastal baitfish event
  }
  if (context === "coastal_flats_estuary") {
    addRelation(acc, "drain_oriented", 0.7);
    addRelation(acc, "grass_edge_oriented", 0.7);
    acc.forage.baitfish_bias += 0.15; // fall mullet and menhaden on flats
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
  if (context === "freshwater_lake_pond") {
    // Late fall: baitfish activity winding down, fish returning to structure and deeper edges.
    // Crawfish become important again as baitfish scatter.
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.10;
  }
  if (context === "freshwater_river") {
    // Late fall: fish transitioning back into winter pools. Holes and pools are the focus.
    addRelation(acc, "hole_oriented", 0.8);
    addRelation(acc, "pool_oriented", 0.9);    // starting return to winter refugia
    addRelation(acc, "tailout_oriented", 0.3); // tailouts still worth fishing but slowing
    addRelation(acc, "riffle_oriented", -0.4); // riffles less productive as temps drop
    acc.forage.insect_bias += 0.05;  // BWO and midges in late fall
    acc.forage.crawfish_bias = (acc.forage.crawfish_bias ?? 0) + 0.08;
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
