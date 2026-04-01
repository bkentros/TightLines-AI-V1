import { assert, assertNotEquals, assertStringIncludes } from "jsr:@std/assert";
import { buildExplanations } from "../engine/buildExplanations.ts";
import { scoreLureFamilies } from "../engine/scoreFamilies.ts";
import type { BehaviorOutput, PresentationOutput } from "../contracts/behavior.ts";

Deno.test("buildExplanations: top families get explanation copy from their own score drivers", () => {
  const behavior: BehaviorOutput = {
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

  const presentation: PresentationOutput = {
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

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "clear",
  ).slice(0, 2);

  const explained = buildExplanations(
    ranked,
    behavior,
    presentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "2026-04-01",
    "clear",
  );

  assert(
    explained[0]?.why_picked.includes("crawfish") ||
      explained[0]?.why_picked.includes("grass") ||
      explained[0]?.why_picked.includes("vegetation"),
  );
  assert(explained[1]?.best_when.includes("pre spawn"));
  assertNotEquals(explained[0]?.why_picked, explained[1]?.why_picked);
});

Deno.test("buildExplanations: baitfish families get baitfish-specific copy and not blanket craw colors", () => {
  const behavior: BehaviorOutput = {
    activity: "active",
    aggression: "aggressive",
    strike_zone: "moderate",
    chase_radius: "short",
    depth_lane: "upper",
    habitat_tags: ["spawning_flat", "grass_edge"],
    forage_mode: "crawfish",
    secondary_forage: "baitfish",
    topwater_viable: true,
    speed_preference: "slow",
    noise_preference: "subtle",
    flash_preference: "subtle",
    behavior_summary: ["a", "b", "c"],
    seasonal_flag: "spawning",
  };

  const presentation: PresentationOutput = {
    depth_target: "upper",
    speed: "moderate",
    motion: "steady",
    trigger_type: "reaction",
    noise: "moderate",
    flash: "heavy",
    profile: "medium",
    color_family: "chartreuse_white",
    topwater_viable: true,
  };

  const ranked = scoreLureFamilies(
    behavior,
    presentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "dirty",
  ).filter((family) => family.family_id === "spinnerbait");

  const explained = buildExplanations(
    ranked,
    behavior,
    presentation,
    "largemouth_bass",
    "freshwater_lake_pond",
    "2026-04-01",
    "dirty",
  );

  assertStringIncludes(explained[0]!.why_picked, "baitfish");
  assertStringIncludes(explained[0]!.color_guide, "White / Chartreuse");
  assertStringIncludes(explained[0]!.examples.join(" "), "Bladed jig");
});
