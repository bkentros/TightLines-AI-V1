/**
 * Strict exact slot fit for rebuild `selectArchetypesForSide` — column + pace
 * (primary or secondary_pace only); no adjacent drift.
 */
import { assert, assertEquals } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { ArchetypeProfileV4, SeasonalRowV4 } from "../v4/contracts.ts";
import { analyzeRecommenderConditions } from "../sharedAnalysis.ts";
import { computeRecommenderRebuild } from "../rebuild/runRecommenderRebuild.ts";
import { selectArchetypesForSide } from "../rebuild/selectSide.ts";
import type { TargetProfile } from "../rebuild/shapeProfiles.ts";

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "smallmouth_bass",
    region_key: "appalachian",
    month: 4,
    water_type: "freshwater_river",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    surface_seasonally_possible: true,
    primary_lure_ids: ["drop_shot_worm"],
    primary_fly_ids: ["clouser_minnow"],
    ...overrides,
  };
}

function assertArchetypeMatchesSlot(
  a: ArchetypeProfileV4,
  p: TargetProfile,
): void {
  assertEquals(a.column, p.column);
  const paceOk = a.primary_pace === p.pace ||
    (a.secondary_pace != null && a.secondary_pace === p.pace);
  assert(paceOk, `expected slot pace ${p.pace} via primary or secondary`);
}

Deno.test("selectSide: no adjacent-column fill — mid lure cannot fill upper slot", () => {
  const row = baseRow({
    primary_lure_ids: ["swim_jig"],
    column_range: ["bottom", "mid", "upper"],
  });
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "stained",
    profiles: [{ column: "upper", pace: "medium" }],
    surfaceBlocked: false,
    seedBase: "t-adj-col",
  });
  assertEquals(out.length, 0);
});

Deno.test("selectSide: no adjacent-pace fill", () => {
  const row = baseRow({ primary_lure_ids: ["weightless_stick_worm"] });
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    profiles: [{ column: "upper", pace: "fast" }],
    surfaceBlocked: false,
    seedBase: "t-adj-pace",
  });
  assertEquals(out.length, 0);
});

Deno.test("selectSide: secondary_pace exact match fills slot", () => {
  const row = baseRow({ primary_lure_ids: ["weightless_stick_worm"] });
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    profiles: [{ column: "upper", pace: "slow" }],
    surfaceBlocked: false,
    seedBase: "t-sec-pace",
  });
  assertEquals(out.map((p) => p.archetype.id), ["weightless_stick_worm"]);
});

Deno.test("selectSide: stops when later slot has no exact fit (no drift)", () => {
  const row = baseRow({ primary_lure_ids: ["drop_shot_worm"] });
  const profiles: TargetProfile[] = [
    { column: "mid", pace: "slow" },
    { column: "upper", pace: "fast" },
  ];
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    profiles,
    surfaceBlocked: false,
    seedBase: "t-thin",
  });
  assertEquals(out.length, 1);
  assertEquals(out[0]!.archetype.id, "drop_shot_worm");
});

Deno.test("selectSide: deterministic duplicate runs", () => {
  const row = baseRow({ primary_lure_ids: ["weightless_stick_worm"] });
  const args = {
    side: "lure" as const,
    row,
    species: "smallmouth_bass" as const,
    context: "freshwater_river" as const,
    water_clarity: "clear" as const,
    profiles: [{ column: "upper", pace: "slow" }] as TargetProfile[],
    surfaceBlocked: false,
    seedBase: "t-det",
  };
  assertEquals(selectArchetypesForSide(args), selectArchetypesForSide(args));
});

function surfaceRequest(): RecommenderRequest {
  return {
    location: {
      latitude: 35.56,
      longitude: -82.58,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-04-15",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
  };
}

Deno.test("rebuild: each lure/fly pick matches exact slot column+pace for its index", () => {
  const req = surfaceRequest();
  const eng = computeRecommenderRebuild(
    req,
    analyzeRecommenderConditions(req),
  );
  for (const pick of eng.lureSlotPicks) {
    assertArchetypeMatchesSlot(pick.archetype, pick.profile);
  }
  for (const pick of eng.flySlotPicks) {
    assertArchetypeMatchesSlot(pick.archetype, pick.profile);
  }
});

Deno.test("rebuild: Florida LMB river returns flies when early shared slots are fly-thin", () => {
  const req: RecommenderRequest = {
    location: {
      latitude: 28.06,
      longitude: -82.29,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-04-21",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "largemouth_bass",
    context: "freshwater_river",
    water_clarity: "dirty",
    env_data: {
      timezone: "America/New_York",
      hourly: { wind_speed_mph: Array(24).fill(5) },
    },
  };
  const eng = computeRecommenderRebuild(
    req,
    analyzeRecommenderConditions(req),
  );
  assert(eng.lureSlotPicks.length >= 1, "expected at least one lure");
  assert(eng.flySlotPicks.length >= 1, "expected at least one fly after slot-skip");
});
