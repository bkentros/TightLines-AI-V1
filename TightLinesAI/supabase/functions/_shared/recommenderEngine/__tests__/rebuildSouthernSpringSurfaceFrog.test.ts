/**
 * Southern spring surface frog coverage: authored shortlist + catalog clarity
 * allow frog_fly / hollow_body_frog in clear-water Florida lake contexts.
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { selectArchetypesForSide } from "../rebuild/selectSide.ts";

Deno.test("generated row: Florida Apr lake includes frog_fly and hollow_body_frog in primaries", () => {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "florida" &&
    r.month === 4 &&
    r.water_type === "freshwater_lake_pond"
  );
  assert(row, "expected Florida April lake row");
  assert(
    row.primary_fly_ids.includes("frog_fly"),
    "expected frog_fly on southern spring lake shortlist",
  );
  assert(
    row.primary_lure_ids.includes("hollow_body_frog"),
    "expected hollow_body_frog on southern spring lake shortlist",
  );
});

Deno.test("selectSide: frog_fly eligible in clear water when on shortlist (surface / slow)", () => {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "florida" &&
    r.month === 4 &&
    r.water_type === "freshwater_lake_pond"
  )!;
  const out = selectArchetypesForSide({
    side: "fly",
    row,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
    profiles: [{ column: "surface", pace: "slow" }],
    surfaceBlocked: false,
    seedBase: "t-fl-clear-frog",
  });
  assertEquals(out.length, 1);
  assertEquals(out[0]!.archetype.id, "frog_fly");
});

Deno.test("selectSide: hollow_body_frog eligible in clear water when on shortlist", () => {
  const row = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.find((r) =>
    r.region_key === "gulf_coast" &&
    r.month === 5 &&
    r.water_type === "freshwater_lake_pond"
  )!;
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
    profiles: [{ column: "surface", pace: "slow" }],
    surfaceBlocked: false,
    seedBase: "t-gulf-clear-hollow",
  });
  assertEquals(out.length, 1);
  assertEquals(out[0]!.archetype.id, "hollow_body_frog");
});
