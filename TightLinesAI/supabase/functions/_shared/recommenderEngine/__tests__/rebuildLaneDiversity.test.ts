/**
 * Finalist-pool deterministic choice key: id-scoped, no catalog-order bias.
 */
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import {
  finalistChoiceKey,
  selectArchetypesForSide,
} from "../rebuild/selectSide.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { TargetProfile } from "../rebuild/shapeProfiles.ts";

Deno.test("finalistChoiceKey: same inputs -> same value", () => {
  const a = finalistChoiceKey({
    seedBase: "s",
    side: "lure",
    slot: 0,
    candidateId: "swim_jig",
    tier: 1,
  });
  const b = finalistChoiceKey({
    seedBase: "s",
    side: "lure",
    slot: 0,
    candidateId: "swim_jig",
    tier: 1,
  });
  assertEquals(a, b);
});

Deno.test("finalistChoiceKey: different id -> different key", () => {
  const a = finalistChoiceKey({
    seedBase: "s",
    side: "lure",
    slot: 0,
    candidateId: "a",
    tier: 1,
  });
  const b = finalistChoiceKey({
    seedBase: "s",
    side: "lure",
    slot: 0,
    candidateId: "b",
    tier: 1,
  });
  assertNotEquals(a, b);
});

Deno.test("selectSide: identical args → identical picks (determinism)", () => {
  const row: SeasonalRowV4 = {
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
  };
  const profiles: TargetProfile[] = [{ column: "upper", pace: "slow" }];
  const args = {
    side: "lure" as const,
    row,
    species: "smallmouth_bass" as const,
    context: "freshwater_river" as const,
    water_clarity: "clear" as const,
    profiles,
    surfaceBlocked: false,
    seedBase: "det-p3",
  };
  const a = selectArchetypesForSide(args);
  const b = selectArchetypesForSide(args);
  assertEquals(
    a.map((p) => p.archetype.id),
    b.map((p) => p.archetype.id),
  );
});
