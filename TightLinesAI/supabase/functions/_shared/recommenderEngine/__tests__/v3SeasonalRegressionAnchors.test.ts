/**
 * High-value seasonal row anchors (narrow overrides / fragile families).
 * Run from TightLinesAI/: deno test --allow-read supabase/functions/_shared/recommenderEngine/__tests__/v3SeasonalRegressionAnchors.test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import { resolveSeasonalRowV3 } from "../v3/seasonal/resolveSeasonalRow.ts";

Deno.test("Regression: south_central April pike river row keeps dungeon streamer as first fly primary", () => {
  const row = resolveSeasonalRowV3(
    "northern_pike",
    "south_central",
    4,
    "freshwater_river",
  );
  assertEquals(row.primary_fly_ids?.[0], "articulated_dungeon_streamer");
});

Deno.test("Regression: mountain_west April trout river override keeps inline spinner lead", () => {
  const row = resolveSeasonalRowV3("trout", "mountain_west", 4, "freshwater_river");
  assertEquals(row.primary_lure_ids?.[0], "inline_spinner");
  assertEquals(row.primary_fly_ids?.[0], "sculpin_streamer");
});
