/**
 * Rebuild finalist-pool policy: structural narrowing, not peer scoring.
 */
import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { TargetProfile } from "../rebuild/shapeProfiles.ts";
import {
  CLARITY_SPECIALIST_WHITELIST,
  clarityDesignatedSlot,
  finalistChoiceKey,
  forageDesignatedSlot,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../rebuild/selectSide.ts";

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "appalachian",
    month: 5,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    surface_seasonally_possible: false,
    primary_lure_ids: ["swim_jig"],
    primary_fly_ids: ["clouser_minnow"],
    ...overrides,
  };
}

function profilesWithOnly(
  slot: number,
  profile: TargetProfile,
): TargetProfile[] {
  return [0, 1, 2].map((i) =>
    i === slot ? profile : { column: "upper", pace: "fast" }
  ) as TargetProfile[];
}

Deno.test("finalistChoiceKey: same inputs are deterministic and id-scoped", () => {
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
  const c = finalistChoiceKey({
    seedBase: "s",
    side: "lure",
    slot: 0,
    candidateId: "bladed_jig",
    tier: 1,
  });
  assertEquals(a, b);
  assertNotEquals(a, c);
});

Deno.test("designated clarity slot is deterministic and differs from forage slot", () => {
  const seedBase = "slot-policy";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
  });
  assert([0, 1, 2].includes(forageSlot));
  assert([0, 1, 2].includes(claritySlot));
  assertNotEquals(claritySlot, forageSlot);
  assertEquals(
    claritySlot,
    clarityDesignatedSlot({ seedBase, side: "lure", forageSlot }),
  );
});

Deno.test("forage narrows only the deterministic forage slot", () => {
  const seedBase = "forage-policy";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const row = baseRow({
    primary_forage: "leech_worm",
    secondary_forage: "surface_prey",
    primary_lure_ids: [
      "shaky_head_worm",
      "ned_rig",
      "texas_rigged_soft_plastic_craw",
      "football_jig",
      "finesse_jig",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(forageSlot, { column: "bottom", pace: "slow" }),
    surfaceBlocked: false,
    seedBase,
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(out.length, 1);
  const shaped = traces.filter((t) => t.forageNarrowed);
  assertEquals(shaped.length, 1);
  assertEquals(shaped[0]!.slot, forageSlot);
  assert(
    shaped[0]!.finalistIds.every((id) =>
      ["shaky_head_worm", "ned_rig", "finesse_jig"].includes(id)
    ),
  );
});

Deno.test("forage ignores secondary forage matches", () => {
  const seedBase = "forage-primary-only";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const row = baseRow({
    primary_forage: "bluegill_perch",
    secondary_forage: "surface_prey",
    column_range: ["mid", "upper", "surface"],
    surface_seasonally_possible: true,
    primary_lure_ids: [
      "walking_topwater",
      "buzzbait",
      "hollow_body_frog",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(forageSlot, { column: "surface", pace: "fast" }),
    surfaceBlocked: false,
    seedBase,
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(out.length, 1);
  assertEquals(traces.filter((t) => t.forageNarrowed).length, 0);
});

Deno.test("forage only narrows on a strict primary-forage subset", () => {
  const seedBase = "forage-strict-subset";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const row = baseRow({
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "lipless_crankbait",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained",
    profiles: profilesWithOnly(forageSlot, { column: "mid", pace: "medium" }),
    surfaceBlocked: false,
    seedBase,
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(out.length, 1);
  assertEquals(traces.filter((t) => t.forageNarrowed).length, 0);
});

Deno.test("clarity narrows only whitelisted archetypes on its deterministic slot", () => {
  const seedBase = "clarity-policy";
  const forageSlot = forageDesignatedSlot({ seedBase, side: "lure" });
  const claritySlot = clarityDesignatedSlot({
    seedBase,
    side: "lure",
    forageSlot,
  });
  const row = baseRow({
    primary_forage: "bluegill_perch",
    secondary_forage: "surface_prey",
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
      "suspending_jerkbait",
      "lipless_crankbait",
    ],
  });
  const traces: RebuildSlotSelectionTrace[] = [];
  const out = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "clear",
    profiles: profilesWithOnly(claritySlot, { column: "mid", pace: "medium" }),
    surfaceBlocked: false,
    seedBase,
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(out.length, 1);
  const shaped = traces.filter((t) => t.clarityNarrowed);
  assertEquals(shaped.length, 1);
  assertEquals(shaped[0]!.slot, claritySlot);
  assertEquals(shaped[0]!.finalistIds, ["suspending_jerkbait"]);
  assertEquals(
    CLARITY_SPECIALIST_WHITELIST.lure.suspending_jerkbait,
    ["clear"],
  );
});

Deno.test("recency structurally narrows away from a recent finalist when alternatives exist", () => {
  const row = baseRow({
    primary_lure_ids: [
      "swim_jig",
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
    ],
  });
  const common = {
    side: "lure" as const,
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: "stained" as const,
    profiles: [{ column: "mid", pace: "medium" }] as TargetProfile[],
    surfaceBlocked: false,
    seedBase: "recency-policy",
    currentLocalDate: "2026-04-22",
  };
  const baseline = selectArchetypesForSide(common);
  assertEquals(baseline.length, 1);

  const traces: RebuildSlotSelectionTrace[] = [];
  const cooled = selectArchetypesForSide({
    ...common,
    recentHistory: [{
      archetype_id: baseline[0]!.archetype.id,
      gear_mode: "lure",
      local_date: "2026-04-21",
    }],
    onSlotTrace: (trace) => traces.push(trace),
  });

  assertEquals(cooled.length, 1);
  assertNotEquals(cooled[0]!.archetype.id, baseline[0]!.archetype.id);
  assert(traces.some((trace) => trace.recencyNarrowed));
});
