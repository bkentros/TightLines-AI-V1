import { assertEquals } from "jsr:@std/assert";
import { buildEligiblePoolV4 } from "../engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../candidates/index.ts";

function fly(id: string) {
  const a = FLY_ARCHETYPES_V4.find((x) => x.id === id);
  if (a == null) throw new Error(`missing fly ${id}`);
  return a;
}

Deno.test("surfaceFlySpeciesGate: mouse_fly dims match slice so pike exclusion is species (G7 / §20.6)", () => {
  const mouse = fly("mouse_fly");
  assertEquals(mouse.species_allowed, ["trout"]);
  const row: SeasonalRowV4 = {
    species: "northern_pike",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_river",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["pike_jerkbait"],
    primary_fly_ids: ["woolly_bugger"],
  };
  const pool = buildEligiblePoolV4(
    "fly",
    row,
    ["surface"],
    ["slow", "medium"],
    "clear",
    "northern_pike",
    "freshwater_river",
  );
  assertEquals(pool.some((a) => a.id === "mouse_fly"), false);
});

Deno.test("surfaceFlySpeciesGate: trout admits mouse_fly when slice matches catalog (control)", () => {
  const row: SeasonalRowV4 = {
    species: "trout",
    region_key: "inland_northwest",
    month: 5,
    water_type: "freshwater_river",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
  };
  const pool = buildEligiblePoolV4(
    "fly",
    row,
    ["surface"],
    ["slow", "medium"],
    "clear",
    "trout",
    "freshwater_river",
  );
  assertEquals(pool.some((a) => a.id === "mouse_fly"), true);
});

Deno.test("surfaceFlySpeciesGate: trout never admits frog_fly when lake/surface/stained match frog dims (G7 / §20.6)", () => {
  const frog = fly("frog_fly");
  assertEquals(frog.species_allowed.includes("trout"), false);
  const row: SeasonalRowV4 = {
    species: "trout",
    region_key: "inland_northwest",
    month: 5,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
  };
  const pool = buildEligiblePoolV4(
    "fly",
    row,
    ["surface"],
    ["slow", "medium"],
    "stained",
    "trout",
    "freshwater_lake_pond",
  );
  assertEquals(pool.some((a) => a.id === "frog_fly"), false);
});

Deno.test("surfaceFlySpeciesGate: trout admits popper_fly when surface/medium/clear match catalog dims (G7)", () => {
  const popper = fly("popper_fly");
  assertEquals(popper.species_allowed.includes("trout"), true);
  const row: SeasonalRowV4 = {
    species: "trout",
    region_key: "inland_northwest",
    month: 5,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["ned_rig"],
    primary_fly_ids: ["woolly_bugger"],
  };
  const pool = buildEligiblePoolV4(
    "fly",
    row,
    ["surface"],
    ["medium", "slow"],
    "clear",
    "trout",
    "freshwater_lake_pond",
  );
  assertEquals(pool.some((a) => a.id === "popper_fly"), true);
});
