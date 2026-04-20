import { assertEquals } from "jsr:@std/assert";
import { buildEligiblePoolV4 } from "../engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

Deno.test("primaryIdsDontLeakToPool: lake-only archetype excluded on river row", () => {
  const row: SeasonalRowV4 = {
    species: "largemouth_bass",
    region_key: "appalachian",
    month: 4,
    water_type: "freshwater_river",
    column_range: ["bottom", "mid", "upper"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: false,
    primary_lure_ids: ["deep_diving_crankbait"],
    primary_fly_ids: ["woolly_bugger"],
  };
  const pool = buildEligiblePoolV4(
    "lure",
    row,
    ["bottom", "mid", "upper"],
    ["slow", "medium", "fast"],
    "clear",
    "largemouth_bass",
    "freshwater_river",
  );
  assertEquals(pool.some((a) => a.id === "deep_diving_crankbait"), false);
});
