import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3Surface } from "../index.ts";
import type { RecommenderRequest } from "../contracts/input.ts";

function request(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
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
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  assert(typeof result.summary.daily_tactical_preference.posture_band === "string");
  assert(typeof result.summary.daily_tactical_preference.preferred_column === "string");
  assert(typeof result.summary.monthly_forage.primary === "string");

  for (const candidate of [...result.lure_recommendations, ...result.fly_recommendations]) {
    assert(typeof candidate.id === "string");
    assert(typeof candidate.display_name === "string");
    assert(typeof candidate.color_style === "string");
    assert(typeof candidate.why_chosen === "string");
    assert(typeof candidate.how_to_fish === "string");
  }
});

Deno.test("V3 surface keeps deterministic color style output on each recommendation", () => {
  const dirtyLowLight = runRecommenderV3Surface(request({
    water_clarity: "dirty",
    env_data: {
      timezone: "America/New_York",
      hourly: {
        cloud_cover_pct: [92, 94, 96],
      },
    },
  }));
  assert(typeof dirtyLowLight.lure_recommendations[0]?.color_style === "string");
  assert(typeof dirtyLowLight.fly_recommendations[0]?.color_style === "string");

  const clearBright = runRecommenderV3Surface(request({
    water_clarity: "clear",
    env_data: {
      timezone: "America/New_York",
      hourly: {
        cloud_cover_pct: [5, 8, 10],
      },
    },
  }));
  assert(typeof clearBright.lure_recommendations[0]?.color_style === "string");
  assert(typeof clearBright.fly_recommendations[0]?.color_style === "string");
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

Deno.test("V3 surface exposes rebuilt monthly and daily summary fields", () => {
  const winter = runRecommenderV3Surface(request({
    location: {
      latitude: 44.98,
      longitude: -93.26,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-01-12",
      local_timezone: "America/Chicago",
      month: 1,
    },
    species: "pike_musky",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  }));

  const summer = runRecommenderV3Surface(request({
    location: {
      latitude: 28.54,
      longitude: -81.38,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  }));

  assert(typeof winter.summary.monthly_baseline.allowed_columns[0] === "string");
  assert(typeof winter.summary.daily_tactical_preference.preferred_column === "string");
  assert(typeof winter.summary.daily_tactical_preference.surface_window === "string");
  assert(typeof summer.summary.daily_tactical_preference.posture_band === "string");
});

Deno.test("V3 surface keeps visible recommendation text deterministic for the same request", () => {
  const a = runRecommenderV3Surface(request());
  const b = runRecommenderV3Surface(request());

  assertEquals(a.lure_recommendations, b.lure_recommendations);
  assertEquals(a.fly_recommendations, b.fly_recommendations);
  assertEquals(a.summary, b.summary);
});
