import { assertEquals } from "jsr:@std/assert";
import {
  buildHeadlinePoolV4,
  passesForageGateForHeadline,
} from "../engine/buildEligiblePool.ts";
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
  secondary_forage: "crawfish",
  surface_seasonally_possible: false,
  primary_lure_ids: ["ned_rig", "football_jig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("forageGate: headline filter union of primary and secondary forage", () => {
  const eligible = buildEligiblePoolV4(
    "lure",
    row(),
    ["bottom", "mid", "upper"],
    ["slow", "medium", "fast"],
    "clear",
    "largemouth_bass",
    "freshwater_lake_pond",
  );
  const ned = eligible.find((a) => a.id === "ned_rig")!;
  assertEquals(passesForageGateForHeadline(ned, row()), true);
});

Deno.test("forageGate: headline forage_relaxed when primary ids do not match forage", () => {
  const eligible = buildEligiblePoolV4(
    "lure",
    row(),
    ["bottom", "mid", "upper"],
    ["slow", "medium", "fast"],
    "clear",
    "largemouth_bass",
    "freshwater_lake_pond",
  );
  const narrow: SeasonalRowV4 = {
    ...row(),
    primary_forage: "surface_prey",
    secondary_forage: undefined,
    primary_lure_ids: ["ned_rig"],
  };
  const h = buildHeadlinePoolV4("lure", narrow, eligible);
  assertEquals(h.headline_fallback, "forage_relaxed");
  assertEquals(h.pool.some((a) => a.id === "ned_rig"), true);
});
