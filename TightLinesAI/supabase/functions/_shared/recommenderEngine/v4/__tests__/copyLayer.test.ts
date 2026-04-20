import { assertEquals } from "jsr:@std/assert";
import { buildWhyChosenV4, pickHowToFish } from "../engine/buildCopy.ts";
import type { SeasonalRowV4 } from "../contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../candidates/lures.ts";

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

Deno.test("copyLayer: how_to_fish clarity index order", () => {
  const ned = LURE_ARCHETYPES_V4.find((l) => l.id === "ned_rig")!;
  assertEquals(pickHowToFish(ned, "clear"), ned.how_to_fish_variants[0]);
  assertEquals(pickHowToFish(ned, "stained"), ned.how_to_fish_variants[1]);
  assertEquals(pickHowToFish(ned, "dirty"), ned.how_to_fish_variants[2]);
});

Deno.test("copyLayer: headline forage_claim_ok uses forage phrasing", () => {
  const ned = LURE_ARCHETYPES_V4.find((l) => l.id === "ned_rig")!;
  const s = buildWhyChosenV4({
    archetype: ned,
    slot_role: "headline",
    posture: "aggressive",
    column_shape_spread: false,
    headline_forage_copy: "forage_claim_ok",
    pick_is_surface: false,
    anchor_column: "bottom",
    outward_column: "upper",
    slot_column: "bottom",
    slot_pace: "slow",
    row: row(),
  });
  assertEquals(s.includes("Today's baitfish read lines up"), true);
});

Deno.test("copyLayer: headline no_forage_claim avoids forage alignment", () => {
  const ned = LURE_ARCHETYPES_V4.find((l) => l.id === "ned_rig")!;
  const s = buildWhyChosenV4({
    archetype: ned,
    slot_role: "headline",
    posture: "aggressive",
    column_shape_spread: false,
    headline_forage_copy: "no_forage_claim",
    pick_is_surface: false,
    anchor_column: "bottom",
    outward_column: "upper",
    slot_column: "bottom",
    slot_pace: "slow",
    row: row(),
  });
  assertEquals(s.includes("Today's baitfish read lines up"), false);
  assertEquals(s.includes("doesn't line up perfectly"), true);
});
