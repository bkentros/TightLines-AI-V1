import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3Surface } from "../index.ts";
import type { RecommenderRequest } from "../contracts/input.ts";

function request(overrides: Partial<RecommenderRequest> = {}): RecommenderRequest {
  return {
    location: {
      latitude: 35.56,
      longitude: -82.58,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-04-15",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 surface returns the current frontend contract for a supported freshwater species", () => {
  const result = runRecommenderV3Surface(request());

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_rankings.length, 3);
  assertEquals(result.fly_rankings.length, 3);
  assertEquals(result.behavior.behavior_summary.length, 3);
  for (const row of result.behavior.behavior_summary) {
    assert(typeof row.label === "string");
    assert(typeof row.detail === "string");
  }
  assert(typeof result.primary_pattern_summary === "string");
  assert(result.confidence.reasons.length > 0);

  for (const candidate of [...result.lure_rankings, ...result.fly_rankings]) {
    assert(typeof candidate.display_name === "string");
    assert(typeof candidate.color_guide === "string");
    assert(typeof candidate.how_to_fish === "string");
    assert(candidate.rank_context === undefined || typeof candidate.rank_context === "string");
  }
});

Deno.test("V3 surface maps trout and pike through the current response shape", () => {
  const trout = runRecommenderV3Surface(request({
    location: {
      latitude: 45.31,
      longitude: -121.69,
      state_code: "OR",
      region_key: "mountain_west",
      local_date: "2026-10-05",
      local_timezone: "America/Los_Angeles",
      month: 10,
    },
    species: "river_trout",
    context: "freshwater_river",
  }));

  const pike = runRecommenderV3Surface(request({
    location: {
      latitude: 46.78,
      longitude: -92.1,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-10-10",
      local_timezone: "America/Chicago",
      month: 10,
    },
    species: "pike_musky",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  }));

  assertEquals(trout.species, "river_trout");
  assertEquals(trout.context, "freshwater_river");
  assertEquals(pike.species, "pike_musky");
  assertEquals(pike.context, "freshwater_lake_pond");
});
