import { assertEquals, assertThrows } from "jsr:@std/assert";
import { resolveSeasonalRowFromTableV4 } from "../seasonal/resolveSeasonalRow.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const rows: readonly SeasonalRowV4[] = [
  {
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 7,
    water_type: "freshwater_lake_pond",
    state_code: "MI",
    column_range: ["bottom"],
    column_baseline: "bottom",
    pace_range: ["slow"],
    pace_baseline: "slow",
    primary_forage: "baitfish",
    surface_seasonally_possible: false,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
  },
  {
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 7,
    water_type: "freshwater_lake_pond",
    column_range: ["mid"],
    column_baseline: "mid",
    pace_range: ["medium"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: false,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
  },
];

Deno.test("seasonalRowLookup: state-scoped row wins", () => {
  const r = resolveSeasonalRowFromTableV4(
    rows,
    "largemouth_bass",
    "great_lakes_upper_midwest",
    7,
    "freshwater_lake_pond",
    "MI",
  );
  assertEquals(r.row.column_baseline, "bottom");
  assertEquals(r.used_state_scoped_row, true);
});

Deno.test("seasonalRowLookup: falls back to unscoped row", () => {
  const r = resolveSeasonalRowFromTableV4(
    rows,
    "largemouth_bass",
    "great_lakes_upper_midwest",
    7,
    "freshwater_lake_pond",
    "OH",
  );
  assertEquals(r.row.column_baseline, "mid");
  assertEquals(r.used_state_scoped_row, false);
});

Deno.test("seasonalRowLookup: missing row throws", () => {
  assertThrows(() =>
    resolveSeasonalRowFromTableV4(
      rows,
      "largemouth_bass",
      "great_lakes_upper_midwest",
      8,
      "freshwater_lake_pond",
      undefined,
    )
  );
});
