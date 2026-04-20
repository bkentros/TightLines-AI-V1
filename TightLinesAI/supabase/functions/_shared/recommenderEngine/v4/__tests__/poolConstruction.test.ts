import { assertEquals } from "jsr:@std/assert";
import { buildEligiblePoolV4 } from "../engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const row = (): SeasonalRowV4 => ({
  species: "smallmouth_bass",
  region_key: "appalachian",
  month: 4,
  water_type: "freshwater_river",
  column_range: ["bottom", "mid", "upper"],
  column_baseline: "mid",
  pace_range: ["slow", "medium"],
  pace_baseline: "medium",
  primary_forage: "crawfish",
  secondary_forage: "baitfish",
  surface_seasonally_possible: false,
  primary_lure_ids: ["ned_rig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("poolConstruction: wrong water_type excluded", () => {
  const pool = buildEligiblePoolV4(
    "lure",
    row(),
    ["bottom", "mid", "upper"],
    ["slow", "medium"],
    "stained",
    "smallmouth_bass",
    "freshwater_river",
  );
  for (const a of pool) {
    assertEquals(a.water_types_allowed.includes("freshwater_river"), true);
  }
});

Deno.test("poolConstruction: secondary_pace matches pace set", () => {
  const pool = buildEligiblePoolV4(
    "lure",
    row(),
    ["upper"],
    ["slow", "fast"],
    "stained",
    "smallmouth_bass",
    "freshwater_river",
  );
  const stick = pool.find((a) => a.id === "weightless_stick_worm");
  assertEquals(stick != null, true);
});
