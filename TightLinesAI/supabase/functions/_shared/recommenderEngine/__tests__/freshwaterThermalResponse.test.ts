import { assert, assertEquals } from "jsr:@std/assert";
import { resolveBehavior } from "../engine/resolveBehavior.ts";
import type { RecommenderRequest } from "../contracts/input.ts";

function baseReq(local_date: string): RecommenderRequest {
  return {
    location: {
      latitude: 34.39,
      longitude: -86.29,
      state_code: "AL",
      region_key: "south_central",
      local_date,
      local_timezone: "America/Chicago",
      month: 1,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
  };
}

const ACTIVITY_INDEX = new Map([
  ["inactive", 0],
  ["low", 1],
  ["neutral", 2],
  ["active", 3],
  ["aggressive", 4],
]);

Deno.test("resolveBehavior: warm winter southern bass day opens fish up more than a cold one", () => {
  const cold = resolveBehavior(
    baseReq("2025-01-23"),
    {
      norm: {
        normalized: {
          temperature: { final_score: -0.81, measurement_value_f: 34.4 },
          wind_condition: { score: 0.75 },
          pressure_regime: { label: "volatile" },
          light_cloud_condition: { label: "mixed_sky" },
        },
      },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_band: "cool",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
    } as any,
  );

  const warm = resolveBehavior(
    baseReq("2024-01-30"),
    {
      norm: {
        normalized: {
          temperature: { final_score: -0.8, measurement_value_f: 41.2 },
          wind_condition: { score: 0.88 },
          pressure_regime: { label: "volatile" },
          light_cloud_condition: { label: "mostly_clear" },
        },
      },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_band: "near_optimal",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
    } as any,
  );

  assert(cold.activity !== warm.activity || cold.depth_lane !== warm.depth_lane || cold.speed_preference !== warm.speed_preference);
  assertEquals(
    (ACTIVITY_INDEX.get(warm.activity) ?? 0) >= (ACTIVITY_INDEX.get(cold.activity) ?? 0),
    true,
  );
});
