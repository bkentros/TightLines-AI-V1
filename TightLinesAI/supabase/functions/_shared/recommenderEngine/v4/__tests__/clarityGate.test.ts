import { assertEquals } from "jsr:@std/assert";
import { buildEligiblePoolV4 } from "../engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const row = (): SeasonalRowV4 => ({
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
  primary_lure_ids: ["ned_rig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("clarityGate: stained+dirty archetypes excluded in clear water", () => {
  const pool = buildEligiblePoolV4(
    "lure",
    row(),
    ["bottom", "mid", "upper"],
    ["slow", "medium", "fast"],
    "clear",
    "largemouth_bass",
    "freshwater_lake_pond",
  );
  const ids = new Set(pool.map((p) => p.id));
  assertEquals(ids.has("squarebill_crankbait"), false);
});

Deno.test("clarityGate: stained archetypes survive stained", () => {
  const pool = buildEligiblePoolV4(
    "lure",
    row(),
    ["bottom", "mid", "upper"],
    ["slow", "medium", "fast"],
    "stained",
    "largemouth_bass",
    "freshwater_lake_pond",
  );
  const ids = new Set(pool.map((p) => p.id));
  assertEquals(ids.has("squarebill_crankbait"), true);
});
