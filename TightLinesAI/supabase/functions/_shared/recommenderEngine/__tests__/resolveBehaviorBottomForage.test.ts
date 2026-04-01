import { assert, assertEquals } from "jsr:@std/assert";
import { resolveBehavior } from "../engine/resolveBehavior.ts";
import type { RecommenderRequest } from "../contracts/input.ts";

Deno.test("resolveBehavior: bottom-oriented flats forage suppresses topwater and points copy down the water column", () => {
  const req: RecommenderRequest = {
    location: {
      latitude: 26.07,
      longitude: -97.17,
      state_code: "TX",
      region_key: "gulf_coast",
      local_date: "2024-10-11",
      local_timezone: "America/Chicago",
      month: 10,
    },
    species: "redfish",
    context: "coastal_flats_estuary",
    water_clarity: "dirty",
    env_data: {},
  };

  const analysis = {
    norm: {
      normalized: {
        temperature: {
          measurement_value_f: 77,
        },
        light_cloud_condition: {
          label: "mostly_clear",
        },
        pressure_regime: {
          label: "stable_neutral",
        },
        wind_condition: {
          score: 0,
        },
      },
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_band: "optimal",
      temperature_trend: "stable",
      temperature_shock: "none",
      tide_detail: "Incoming water pushing onto the flat.",
    },
  } as any;

  const behavior = resolveBehavior(req, analysis);

  assertEquals(behavior.forage_mode, "crab");
  assertEquals(behavior.topwater_viable, false);
  assert(
    !behavior.behavior_summary[2].includes("Surface"),
    "bottom-forage redfish copy should not surface a topwater-first line",
  );
});
