import { assert, assertEquals } from "jsr:@std/assert";
import { scoreFlyFamilies, scoreLureFamilies } from "../engine/scoreFamilies.ts";
import type { BehaviorOutput, PresentationOutput } from "../contracts/behavior.ts";

const lowActivityCrawBehavior: BehaviorOutput = {
  activity: "low",
  aggression: "passive",
  strike_zone: "narrow",
  chase_radius: "short",
  depth_lane: "near_bottom",
  habitat_tags: ["weed_edges"],
  forage_mode: "crawfish",
  topwater_viable: false,
  speed_preference: "slow",
  noise_preference: "silent",
  flash_preference: "none",
  behavior_summary: ["a", "b", "c"],
  seasonal_flag: "pre_spawn",
};

const lowActivityCrawPresentation: PresentationOutput = {
  depth_target: "near_bottom",
  speed: "slow",
  motion: "hop",
  trigger_type: "finesse",
  noise: "silent",
  flash: "none",
  profile: "medium",
  color_family: "craw_pattern",
  topwater_viable: false,
};

Deno.test("scoreLureFamilies: low-activity crawfish setup prefers bottom finesse families", () => {
  const ranked = scoreLureFamilies(
    lowActivityCrawBehavior,
    lowActivityCrawPresentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "clear",
  );

  // ned_rig's finesse trigger is the exact match for this low-activity crawfish
  // scenario; soft_craw's natural_match trigger is adjacent (+1.5 vs +3).
  const top3Ids = ranked.slice(0, 3).map((f) => f.family_id);
  assert(top3Ids.includes("ned_rig"), "ned_rig should be top-3 in low-activity crawfish finesse");
  assert(top3Ids.includes("soft_craw"), "soft_craw should be top-3 in low-activity crawfish finesse");

  const lipless = ranked.find((family) => family.family_id === "lipless_crankbait");
  assert(lipless);
  assert(ranked[0]!.raw_score > lipless.raw_score);
  assert(ranked[0]!.score_reasons.some((reason) => reason.includes("crawfish")));
});

Deno.test("scoreLureFamilies: fast dirty-water baitfish setup rewards search families over finesse", () => {
  const behavior: BehaviorOutput = {
    activity: "active",
    aggression: "aggressive",
    strike_zone: "wide",
    chase_radius: "long",
    depth_lane: "upper",
    habitat_tags: ["baitfish_blitz"],
    forage_mode: "baitfish",
    secondary_forage: "shrimp",
    topwater_viable: true,
    speed_preference: "fast",
    noise_preference: "moderate",
    flash_preference: "heavy",
    behavior_summary: ["a", "b", "c"],
    seasonal_flag: "peak_season",
  };

  const presentation: PresentationOutput = {
    depth_target: "upper",
    speed: "fast",
    motion: "rip",
    trigger_type: "reaction",
    noise: "moderate",
    flash: "heavy",
    profile: "slim",
    color_family: "shad_silver",
    topwater_viable: true,
    current_technique: "cross_current",
  };

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "striped_bass",
    "coastal",
    "dirty",
  );

  assert(
    ranked[0]?.family_id === "soft_swimbait" || ranked[0]?.family_id === "casting_spoon",
  );

  const jig = ranked.find((family) => family.family_id === "jig");
  assert(jig);
  assert(ranked[0]!.raw_score > jig.raw_score);
});

Deno.test("scoreLureFamilies: clear-water baitfish setup keeps jerkbait-fluke family in the conversation", () => {
  const behavior: BehaviorOutput = {
    activity: "active",
    aggression: "reactive",
    strike_zone: "moderate",
    chase_radius: "moderate",
    depth_lane: "upper",
    habitat_tags: ["points", "grass_edge", "baitfish_schools"],
    forage_mode: "baitfish",
    topwater_viable: false,
    speed_preference: "slow",
    noise_preference: "subtle",
    flash_preference: "subtle",
    behavior_summary: ["a", "b", "c"],
    seasonal_flag: "post_spawn",
  };

  const presentation: PresentationOutput = {
    depth_target: "upper",
    speed: "slow",
    motion: "twitch_pause",
    trigger_type: "reaction",
    noise: "subtle",
    flash: "moderate",
    profile: "slim",
    color_family: "shad_silver",
    topwater_viable: false,
  };

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "clear",
  );

  assert(ranked.slice(0, 3).some((family) => family.family_id === "jerkbait"));
});

Deno.test("scoreLureFamilies: flats crustacean scenario rewards tide-ready bottom families", () => {
  const behavior: BehaviorOutput = {
    activity: "active",
    aggression: "reactive",
    strike_zone: "moderate",
    chase_radius: "moderate",
    depth_lane: "near_bottom",
    habitat_tags: ["grass_flats", "tidal_flats", "mud_edges", "current_breaks"],
    forage_mode: "crab",
    secondary_forage: "shrimp",
    topwater_viable: false,
    speed_preference: "dead_slow",
    noise_preference: "silent",
    flash_preference: "none",
    behavior_summary: ["a", "b", "c"],
    tidal_note: "Fish are set up on incoming water.",
    seasonal_flag: "peak_season",
  };

  const presentation: PresentationOutput = {
    depth_target: "near_bottom",
    speed: "dead_slow",
    motion: "drag",
    trigger_type: "natural_match",
    noise: "silent",
    flash: "none",
    profile: "medium",
    color_family: "crab_olive",
    topwater_viable: false,
    current_technique: "downstream_drift",
  };

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "redfish",
    "coastal_flats_estuary",
    "stained",
  );

  assertEquals(ranked[0]?.family_id, "shrimp_crab_plastic");

  const swimbait = ranked.find((family) => family.family_id === "soft_swimbait");
  assert(swimbait);
  assert(ranked[0]!.raw_score > swimbait.raw_score);
});

Deno.test("scoreLureFamilies: dirty flats crustacean scenario keeps reaction baitfish families behind shrimp-crab picks", () => {
  const behavior: BehaviorOutput = {
    activity: "aggressive",
    aggression: "aggressive",
    strike_zone: "moderate",
    chase_radius: "moderate",
    depth_lane: "near_bottom",
    habitat_tags: ["grass_flats", "tidal_flats", "mud_edges", "current_breaks"],
    forage_mode: "crab",
    secondary_forage: "shrimp",
    topwater_viable: false,
    speed_preference: "slow",
    noise_preference: "silent",
    flash_preference: "subtle",
    behavior_summary: ["a", "b", "c"],
    tidal_note: "Fish are set up on moving water.",
    seasonal_flag: "peak_season",
  };

  const presentation: PresentationOutput = {
    depth_target: "near_bottom",
    speed: "slow",
    motion: "drag",
    trigger_type: "natural_match",
    noise: "silent",
    flash: "moderate",
    profile: "medium",
    color_family: "crab_olive",
    topwater_viable: false,
    current_technique: "downstream_drift",
  };

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "redfish",
    "coastal_flats_estuary",
    "dirty",
  );

  assertEquals(ranked[0]?.family_id, "shrimp_crab_plastic");

  const lipless = ranked.find((family) => family.family_id === "lipless_crankbait");
  if (lipless) {
    assert(ranked[0]!.raw_score > lipless.raw_score);
  }
});

Deno.test("scoreFlyFamilies: dirty current-driven smallmouth setup avoids bulky articulated streamer over crawfish-friendly options", () => {
  const behavior: BehaviorOutput = {
    activity: "aggressive",
    aggression: "aggressive",
    strike_zone: "wide",
    chase_radius: "long",
    depth_lane: "mid",
    habitat_tags: ["current_seams", "rock_substrate", "eddy_seams"],
    forage_mode: "crawfish",
    secondary_forage: "baitfish",
    topwater_viable: false,
    speed_preference: "moderate",
    noise_preference: "subtle",
    flash_preference: "moderate",
    behavior_summary: ["a", "b", "c"],
    seasonal_flag: "peak_season",
  };

  const presentation: PresentationOutput = {
    depth_target: "mid",
    speed: "moderate",
    motion: "steady",
    trigger_type: "reaction",
    noise: "subtle",
    flash: "moderate",
    profile: "medium",
    color_family: "gold_amber",
    topwater_viable: false,
    current_technique: "cross_current",
  };

  const ranked = scoreFlyFamilies(
    behavior,
    presentation,
    "smallmouth_bass",
    "freshwater_river",
    "dirty",
  );

  assertEquals(ranked[0]?.family_id !== "streamer_articulated", true);
});
