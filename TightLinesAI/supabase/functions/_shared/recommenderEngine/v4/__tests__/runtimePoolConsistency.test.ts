import { assertEquals } from "jsr:@std/assert";
import { buildEligiblePoolV4 } from "../engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const row = (): SeasonalRowV4 => ({
  species: "northern_pike",
  region_key: "great_lakes_upper_midwest",
  month: 12,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid"],
  column_baseline: "bottom",
  pace_range: ["slow"],
  pace_baseline: "slow",
  primary_forage: "baitfish",
  surface_seasonally_possible: false,
  primary_lure_ids: ["pike_jerkbait"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("runtimePoolConsistency: identical inputs yield identical pools", () => {
  const r = row();
  const a = buildEligiblePoolV4(
    "lure",
    r,
    ["bottom", "mid"],
    ["slow"],
    "stained",
    "northern_pike",
    "freshwater_lake_pond",
  );
  const b = buildEligiblePoolV4(
    "lure",
    r,
    ["bottom", "mid"],
    ["slow"],
    "stained",
    "northern_pike",
    "freshwater_lake_pond",
  );
  assertEquals(a.map((x) => x.id).join(","), b.map((x) => x.id).join(","));
});
