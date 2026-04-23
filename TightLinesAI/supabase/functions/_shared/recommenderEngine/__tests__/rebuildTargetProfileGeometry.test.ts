import { assert, assertEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import { buildTargetProfiles } from "../rebuild/shapeProfiles.ts";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";

function row(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "florida",
    month: 6,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "upper",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "bluegill_perch",
    secondary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["hollow_body_frog"],
    primary_fly_ids: ["frog_fly"],
    ...overrides,
  };
}

Deno.test("target profiles: surface leads only for legal upper-anchor aggressive rows", () => {
  const profiles = buildTargetProfiles({
    row: row({ column_baseline: "upper" }),
    regime: "aggressive",
    surfaceBlocked: false,
  });

  assertEquals(profiles[0], { column: "surface", pace: "slow" });
  assertEquals(profiles[1]!.column, "upper");
});

Deno.test("target profiles: ordinary surface rows keep their authored pace cadence", () => {
  const profiles = buildTargetProfiles({
    row: row({
      primary_lure_ids: ["walking_topwater"],
      primary_fly_ids: ["deer_hair_slider"],
    }),
    regime: "aggressive",
    surfaceBlocked: false,
  });

  assertEquals(profiles[0], { column: "surface", pace: "fast" });
});

Deno.test("target profiles: aggressive mid-anchor rows do not lead with surface", () => {
  const profiles = buildTargetProfiles({
    row: row({ column_baseline: "mid" }),
    regime: "aggressive",
    surfaceBlocked: false,
  });

  assertEquals(profiles[0]!.column, "upper");
  assertEquals(profiles[2], { column: "surface", pace: "slow" });
});

Deno.test("target profiles: neutral upper-anchor rows keep surface as support, not lead", () => {
  const profiles = buildTargetProfiles({
    row: row({ column_baseline: "upper" }),
    regime: "neutral",
    surfaceBlocked: false,
  });

  assertEquals(profiles[0]!.column, "upper");
  assertEquals(profiles[1], { column: "surface", pace: "slow" });
});

Deno.test("target profiles: surface blocked removes surface from profile set", () => {
  const profiles = buildTargetProfiles({
    row: row({ column_baseline: "upper" }),
    regime: "aggressive",
    surfaceBlocked: true,
  });

  assert(!profiles.some((p) => p.column === "surface"));
});

Deno.test("target profiles: suppressive medium-anchor rows include an anchor slow lane", () => {
  const profiles = buildTargetProfiles({
    row: row({ column_baseline: "mid", pace_baseline: "medium" }),
    regime: "suppressive",
    surfaceBlocked: false,
  });

  assert(
    profiles.some((p) => p.column === "mid" && p.pace === "slow"),
    `expected a mid/slow anchor support lane, got ${
      profiles.map((p) => `${p.column}/${p.pace}`).join(", ")
    }`,
  );
});

Deno.test("catalog: woolly_bugger has its own family group", () => {
  const bugger = FLY_ARCHETYPES_V4.find((a) => a.id === "woolly_bugger");
  assert(bugger);
  assertEquals(bugger.family_group, "bugger_streamer");
});
