import { assertEquals } from "jsr:@std/assert";
import { computeRecommenderV4 } from "../engine/runRecommenderV4.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import type { SeasonalRowV4 } from "../contracts.ts";
import { createCollectingDiagWriter, type RecommenderV4DiagPayload } from "../engine/diagnostics.ts";
import { analysisWithScore } from "./helpers/analysisStub.ts";

Deno.test("forageFallbackCopy: forage_relaxed headline avoids forage-match phrasing", () => {
  const row: SeasonalRowV4 = {
    species: "largemouth_bass",
    region_key: "appalachian",
    month: 6,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "surface_prey",
    surface_seasonally_possible: false,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
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
    water_clarity: "clear",
    env_data: { wind_speed_mph: 5 },
  };
  const diags: RecommenderV4DiagPayload[] = [];
  const r = computeRecommenderV4(
    req,
    "forage-fallback-copy-user",
    analysisWithScore(72),
    row,
    createCollectingDiagWriter(diags),
  );
  assertEquals(diags.some((d) => d.event === "headline_fallback" && d.variant === "forage_relaxed"), true);
  const headline = r.lure_recommendations[0]!.why_chosen;
  assertEquals(headline.includes("Today's surface prey read lines up"), false);
});
