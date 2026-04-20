import { assertEquals } from "jsr:@std/assert";
import { computeTodayColumns } from "../engine/resolveTodayTactics.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const row = (): SeasonalRowV4 => ({
  species: "largemouth_bass",
  region_key: "appalachian",
  month: 6,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: "upper",
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: "fast",
  primary_forage: "baitfish",
  surface_seasonally_possible: true,
  primary_lure_ids: ["ned_rig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("windMissingDefault: wind 99 strips surface from today_columns (P24)", () => {
  const cols = computeTodayColumns(row(), "aggressive", 99);
  assertEquals(cols.includes("surface"), false);
});
