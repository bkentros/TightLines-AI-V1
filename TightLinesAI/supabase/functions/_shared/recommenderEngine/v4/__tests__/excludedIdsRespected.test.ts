import { assertEquals } from "jsr:@std/assert";
import { computeRecommenderV4 } from "../engine/runRecommenderV4.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import type { SeasonalRowV4 } from "../contracts.ts";
import { createNoopDiagWriter } from "../engine/diagnostics.ts";
import { analysisWithScore } from "./helpers/analysisStub.ts";

Deno.test("excludedIdsRespected: excluded lure never appears in top-3", () => {
  const row: SeasonalRowV4 = {
    species: "largemouth_bass",
    region_key: "appalachian",
    month: 6,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: false,
    primary_lure_ids: ["ned_rig", "football_jig", "shaky_head_worm"],
    primary_fly_ids: ["woolly_bugger"],
    excluded_lure_ids: ["ned_rig"],
  };
  const req: RecommenderRequest = {
    location: {
      latitude: 40,
      longitude: -77,
      state_code: "PA",
      region_key: "appalachian",
      local_date: "2026-06-01",
      local_timezone: "America/New_York",
      month: 6,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: { wind_speed_mph: 8 },
  };
  const r = computeRecommenderV4(req, "excluded-test", analysisWithScore(72), row, createNoopDiagWriter());
  for (const p of r.lure_recommendations) {
    assertEquals(p.id === "ned_rig", false);
  }
});
