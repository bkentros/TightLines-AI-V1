import { assert, assertEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../../howFishingEngine/request/buildFromEnvData.ts";
import { runRecommender } from "../runRecommender.ts";

function dailySeries(base: number, dayMinus2: number, dayMinus1: number, today: number): number[] {
  const values = Array.from({ length: 21 }, () => base);
  values[12] = dayMinus2;
  values[13] = dayMinus1;
  values[14] = today;
  return values;
}

function envFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    timezone: "America/New_York",
    weather: {
      temperature: 62,
      pressure: 1013,
      wind_speed: 8,
      cloud_cover: 45,
      temp_7day_high: dailySeries(68, 60, 64, 68),
      temp_7day_low: dailySeries(52, 42, 46, 50),
      precip_7day_daily: Array.from({ length: 21 }, () => 0),
      precip_7day_inches: 0,
      ...((overrides.weather as Record<string, unknown> | undefined) ?? {}),
    },
    ...overrides,
  };
}

function scoreFor(list: Array<{ id: string; score: number }> | undefined, id: string): number {
  return list?.find((item) => item.id === id)?.score ?? 0;
}

Deno.test("recommender: warming trend is contextual by region and month", () => {
  const earlyNorthLake = buildSharedEngineRequestFromEnvData(
    44.97,
    -93.26,
    "2026-03-20",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 49,
        temp_7day_high: dailySeries(48, 38, 43, 49),
        temp_7day_low: dailySeries(34, 26, 30, 36),
      },
    }),
  );

  const hotSouthLake = buildSharedEngineRequestFromEnvData(
    27.95,
    -82.46,
    "2026-07-20",
    "America/New_York",
    "freshwater_lake_pond",
    envFixture({
      weather: {
        temperature: 92,
        cloud_cover: 12,
        temp_7day_high: dailySeries(90, 86, 88, 94),
        temp_7day_low: dailySeries(78, 74, 76, 80),
      },
    }),
  );

  const north = runRecommender({ request: earlyNorthLake, refinements: {} });
  const south = runRecommender({ request: hotSouthLake, refinements: {} });

  assert(scoreFor(north.debug?.depth_lane_scores, "shallow") > scoreFor(north.debug?.depth_lane_scores, "deep"));
  assert(scoreFor(south.debug?.depth_lane_scores, "deep") >= scoreFor(south.debug?.depth_lane_scores, "shallow"));
  assert(north.fish_behavior.behavior.activity !== "inactive");
  assert(south.fish_behavior.position.relation_tags.some((item) => item.id === "shade_oriented" || item.id === "depth_transition_oriented"));
});

Deno.test("recommender: river behavior stays current-position driven while lake stays edge-driven", () => {
  const env = envFixture({
    weather: {
      precipitation: 25.4,
      precip_7day_daily: dailySeries(0.2, 1.1, 1.3, 1.0),
      precip_7day_inches: 4.2,
    },
  });

  const river = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      35.95,
      -83.92,
      "2026-04-18",
      "America/New_York",
      "freshwater_river",
      env,
    ),
    refinements: {},
  });
  const lake = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      35.95,
      -83.92,
      "2026-04-18",
      "America/New_York",
      "freshwater_lake_pond",
      env,
    ),
    refinements: {},
  });

  assert(river.fish_behavior.position.relation_tags.some((item) => item.id === "seam_oriented"));
  assert(river.fish_behavior.behavior.style_flags.includes("current_drift_best"));
  assert(lake.fish_behavior.position.relation_tags.some((item) => item.id === "edge_oriented" || item.id === "cover_oriented"));
});

Deno.test("recommender: coastal and flats diverge on the same falling-tide day", () => {
  const tides = {
    station_id: "123",
    station_name: "Test",
    unit: "ft",
    phase: "falling",
    high_low: [
      { time: "2026-06-14T06:00:00-04:00", type: "H", value: 2.4 },
      { time: "2026-06-14T12:00:00-04:00", type: "L", value: 0.2 },
      { time: "2026-06-14T18:00:00-04:00", type: "H", value: 2.2 },
    ],
  };
  const env = envFixture({
    tides,
    coastal: true,
    nearest_tide_station_id: "123",
  });

  const coastal = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      29.14,
      -83.03,
      "2026-06-14",
      "America/New_York",
      "coastal",
      env,
    ),
    refinements: {},
  });
  const flats = runRecommender({
    request: buildSharedEngineRequestFromEnvData(
      29.14,
      -83.03,
      "2026-06-14",
      "America/New_York",
      "coastal_flats_estuary",
      env,
    ),
    refinements: {},
  });

  assert(coastal.fish_behavior.position.relation_tags.some((item) => item.id === "channel_related" || item.id === "point_oriented"));
  assert(flats.fish_behavior.position.relation_tags.some((item) => item.id === "drain_oriented" || item.id === "trough_oriented"));
  assert(flats.debug?.active_modifiers.includes("falling_tide_drain_focus"));
});

Deno.test("recommender: returns both lure and fly rankings plus debug payload", () => {
  const req = buildSharedEngineRequestFromEnvData(
    43.04,
    -87.91,
    "2026-09-15",
    "America/Chicago",
    "freshwater_lake_pond",
    envFixture(),
  );

  const result = runRecommender({
    request: req,
    refinements: {
      water_clarity: "stained",
      vegetation: "moderate",
      habitat_tags: ["grass", "shade"],
    },
  });

  assertEquals(result.feature, "recommender_v1");
  assert(result.presentation_archetypes.length > 0);
  assert(result.lure_rankings.length > 0);
  assert(result.fly_rankings.length > 0);
  assert(result.debug != null);
  assert(result.narration_payload.summary_seed.length > 0);
});

Deno.test("recommender: inventory compatibility surfaces best owned options", () => {
  const req = buildSharedEngineRequestFromEnvData(
    32.08,
    -81.09,
    "2026-10-10",
    "America/New_York",
    "coastal_flats_estuary",
    envFixture({
      tides: {
        station_id: "456",
        station_name: "Test",
        unit: "ft",
        phase: "incoming",
        high_low: [
          { time: "2026-10-10T05:45:00-04:00", type: "L", value: 0.3 },
          { time: "2026-10-10T11:40:00-04:00", type: "H", value: 2.1 },
        ],
      },
      coastal: true,
    }),
  );

  const result = runRecommender({
    request: req,
    refinements: { habitat_tags: ["grass_edge", "marsh_edge"] },
    inventory_items: [
      {
        id: "1",
        label: "My marsh streamer",
        gear_mode: "fly",
        primary_family_id: "baitfish_streamer",
        compatible_family_ids: ["shrimp_fly"],
        presentation_tags: ["open_flats_cruise_intercept"],
        motion_tags: ["steady"],
        depth_tags: ["shallow"],
        active: true,
      },
    ],
  });

  assert(result.inventory?.best_from_inventory?.length);
  assertEquals(result.inventory?.best_from_inventory?.[0]?.item_id, "1");
});
