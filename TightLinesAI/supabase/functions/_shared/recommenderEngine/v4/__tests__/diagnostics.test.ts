import { assertEquals } from "jsr:@std/assert";
import { computeRecommenderV4 } from "../engine/runRecommenderV4.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import {
  FLY_ARCHETYPE_IDS_V4,
  LURE_ARCHETYPE_IDS_V4,
  type FlyArchetypeIdV4,
  type LureArchetypeIdV4,
  type SeasonalRowV4,
} from "../contracts.ts";
import { createCollectingDiagWriter, type RecommenderV4DiagPayload } from "../engine/diagnostics.ts";
import { RECOMMENDER_V4_DIAG_PREFIX } from "../engine/diagnostics.ts";
import { formatRecommenderV4DiagLine } from "../engine/diagnostics.ts";
import { analysisWithScore } from "./helpers/analysisStub.ts";

Deno.test("diagnostics: structured line uses stable prefix (P25)", () => {
  const line = formatRecommenderV4DiagLine({
    event: "wind_missing",
    variant: null,
    species: "largemouth_bass",
    region_key: "appalachian",
    month: 1,
    water_type: "freshwater_lake_pond",
  });
  assertEquals(line.startsWith(RECOMMENDER_V4_DIAG_PREFIX), true);
});

Deno.test("diagnostics: collector captures headline_fallback", () => {
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
    primary_lure_ids: [...LURE_ARCHETYPE_IDS_V4] as readonly LureArchetypeIdV4[],
    primary_fly_ids: [...FLY_ARCHETYPE_IDS_V4] as readonly FlyArchetypeIdV4[],
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
    env_data: {},
  };
  const diags: RecommenderV4DiagPayload[] = [];
  computeRecommenderV4(req, "diag-user", analysisWithScore(60), row, createCollectingDiagWriter(diags));
  assertEquals(diags.some((d) => d.event === "wind_missing"), true);
  assertEquals(diags.some((d) => d.event === "headline_fallback"), true);
});
