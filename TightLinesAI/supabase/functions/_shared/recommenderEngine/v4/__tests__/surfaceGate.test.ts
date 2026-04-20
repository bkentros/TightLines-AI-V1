import { assertEquals } from "jsr:@std/assert";
import { computeTodayColumns } from "../engine/resolveTodayTactics.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const baseRow = (): SeasonalRowV4 => ({
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

Deno.test("surfaceGate: seasonally impossible removes surface", () => {
  const row = { ...baseRow(), surface_seasonally_possible: false };
  const cols = computeTodayColumns(row, "aggressive", 5);
  assertEquals(cols.includes("surface"), false);
});

Deno.test("surfaceGate: wind > 18 removes surface", () => {
  const row = baseRow();
  const cols = computeTodayColumns(row, "aggressive", 19);
  assertEquals(cols.includes("surface"), false);
});

Deno.test("surfaceGate: suppressed removes surface", () => {
  const row = baseRow();
  const cols = computeTodayColumns(row, "suppressed", 5);
  assertEquals(cols.includes("surface"), false);
});

Deno.test("surfaceGate: all favorable retains surface", () => {
  const row = baseRow();
  const cols = computeTodayColumns(row, "aggressive", 10);
  assertEquals(cols, ["bottom", "mid", "upper", "surface"]);
});
