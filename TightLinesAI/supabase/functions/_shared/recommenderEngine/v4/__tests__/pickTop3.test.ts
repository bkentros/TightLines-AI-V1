import { assertEquals, assertThrows } from "jsr:@std/assert";
import { createMulberry32 } from "../engine/prng.ts";
import {
  applyRelaxationChain,
  buildSlotRecipe,
  pickTop3V4,
} from "../engine/pickTop3.ts";
import { buildEligiblePoolV4, buildHeadlinePoolV4 } from "../engine/buildEligiblePool.ts";
import { createCollectingDiagWriter, type RecommenderV4DiagPayload } from "../engine/diagnostics.ts";
import type {
  ArchetypeProfileV4,
  LureArchetypeIdV4,
  SeasonalRowV4,
  TacticalPace,
} from "../contracts.ts";
import { LURE_ARCHETYPE_IDS_V4 } from "../contracts.ts";
import { RecommenderV4EngineError } from "../engine/RecommenderV4EngineError.ts";
import { LURE_ARCHETYPES_V4 } from "../candidates/lures.ts";

const row = (): SeasonalRowV4 => ({
  species: "largemouth_bass",
  region_key: "appalachian",
  month: 6,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: "upper",
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: "fast",
  primary_forage: "bluegill_perch",
  secondary_forage: "baitfish",
  surface_seasonally_possible: true,
  primary_lure_ids: [...LURE_ARCHETYPE_IDS_V4] as readonly LureArchetypeIdV4[],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("pickTop3: exact bucket produces 3 distinct family_groups", () => {
  const r = row();
  const eligible = buildEligiblePoolV4(
    "lure",
    r,
    ["upper", "surface"],
    ["fast", "medium"],
    "stained",
    "largemouth_bass",
    "freshwater_lake_pond",
  );
  const { pool: headline } = buildHeadlinePoolV4("lure", r, eligible);
  const recipe = buildSlotRecipe(["upper", "upper", "surface"], ["fast", "fast", "medium"]);
  const diags: RecommenderV4DiagPayload[] = [];
  const writer = createCollectingDiagWriter(diags);
  const seed = createMulberry32(999);
  const picks = pickTop3V4(
    recipe,
    eligible,
    headline,
    seed,
    ["bottom", "mid", "upper", "surface"],
    new Set(["fast", "medium"]),
    new Set(["upper", "surface"]),
    writer,
    "lure",
    r,
  );
  const fam = picks.map((p) => p.archetype.family_group);
  assertEquals(new Set(fam).size, 3);
});

function lurePatch(id: LureArchetypeIdV4, patch: Partial<ArchetypeProfileV4>): ArchetypeProfileV4 {
  const base = LURE_ARCHETYPES_V4.find((a) => a.id === id)!;
  return { ...base, ...patch } as ArchetypeProfileV4;
}

const relaxRow = (): SeasonalRowV4 => ({
  species: "largemouth_bass",
  region_key: "appalachian",
  month: 6,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: "mid",
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: "medium",
  primary_forage: "baitfish",
  surface_seasonally_possible: true,
  primary_lure_ids: ["ned_rig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("pickTop3 relaxation: pace_relaxed (same column, pace set)", () => {
  const r = relaxRow();
  const diags: RecommenderV4DiagPayload[] = [];
  const seed = createMulberry32(42);
  const pool: ArchetypeProfileV4[] = [
    lurePatch("ned_rig", { column: "mid", primary_pace: "medium", family_group: "fam_a" }),
    lurePatch("football_jig", { column: "mid", primary_pace: "fast", family_group: "fam_b" }),
  ];
  const slot = { column: "mid" as const, pace: "slow" as const, role: "secondary" as const };
  const picked = applyRelaxationChain(
    slot,
    pool,
    new Set(),
    new Set(),
    [],
    seed,
    ["bottom", "mid", "upper"],
    new Set<TacticalPace>(["slow", "medium", "fast"]),
    new Set(["bottom", "mid", "upper"] as const),
    createCollectingDiagWriter(diags),
    1,
    "lure",
    r,
    false,
  );
  assertEquals(picked != null, true);
  assertEquals(diags.some((d) => d.event === "pace_relaxed"), true);
});

Deno.test("pickTop3 relaxation: adjacent_same_pace", () => {
  const r = relaxRow();
  const diags: RecommenderV4DiagPayload[] = [];
  const seed = createMulberry32(43);
  const pool: ArchetypeProfileV4[] = [
    lurePatch("ned_rig", { column: "mid", primary_pace: "slow", family_group: "fam_a" }),
  ];
  const slot = { column: "bottom" as const, pace: "slow" as const, role: "secondary" as const };
  const picked = applyRelaxationChain(
    slot,
    pool,
    new Set(),
    new Set(),
    [],
    seed,
    ["bottom", "mid"],
    new Set<TacticalPace>(["slow"]),
    new Set(["bottom", "mid"] as const),
    createCollectingDiagWriter(diags),
    1,
    "lure",
    r,
    false,
  );
  assertEquals(picked != null, true);
  assertEquals(diags.some((d) => d.event === "column_relaxed" && d.variant === "adjacent_same_pace"), true);
});

Deno.test("pickTop3 relaxation: adjacent_any_pace", () => {
  const r = relaxRow();
  const diags: RecommenderV4DiagPayload[] = [];
  const seed = createMulberry32(44);
  const pool: ArchetypeProfileV4[] = [
    lurePatch("ned_rig", { column: "mid", primary_pace: "fast", family_group: "fam_a" }),
  ];
  const slot = { column: "bottom" as const, pace: "slow" as const, role: "secondary" as const };
  const paceSet = new Set<TacticalPace>(["slow", "medium", "fast"]);
  const picked = applyRelaxationChain(
    slot,
    pool,
    new Set(),
    new Set(),
    [],
    seed,
    ["bottom", "mid"],
    paceSet,
    new Set(["bottom", "mid"] as const),
    createCollectingDiagWriter(diags),
    1,
    "lure",
    r,
    false,
  );
  assertEquals(picked != null, true);
  assertEquals(diags.some((d) => d.event === "column_relaxed" && d.variant === "adjacent_any_pace"), true);
});

Deno.test("pickTop3 relaxation: any_today", () => {
  const r = relaxRow();
  const diags: RecommenderV4DiagPayload[] = [];
  const seed = createMulberry32(45);
  const pool: ArchetypeProfileV4[] = [
    lurePatch("ned_rig", { column: "upper", primary_pace: "medium", family_group: "fam_a" }),
  ];
  const slot = { column: "bottom" as const, pace: "slow" as const, role: "secondary" as const };
  const picked = applyRelaxationChain(
    slot,
    pool,
    new Set(),
    new Set(),
    [],
    seed,
    ["bottom", "mid", "upper"],
    new Set<TacticalPace>(["slow", "medium"]),
    new Set(["bottom", "mid", "upper"] as const),
    createCollectingDiagWriter(diags),
    1,
    "lure",
    r,
    false,
  );
  assertEquals(picked != null, true);
  assertEquals(diags.some((d) => d.event === "column_relaxed" && d.variant === "any_today"), true);
});

Deno.test("pickTop3 relaxation: relaxFamily=true fills when family redundancy blocks strict chain", () => {
  const r = relaxRow();
  const diags: RecommenderV4DiagPayload[] = [];
  const seed = createMulberry32(46);
  const pool: ArchetypeProfileV4[] = [
    lurePatch("ned_rig", { column: "mid", primary_pace: "slow", family_group: "same_fam" }),
    lurePatch("football_jig", { column: "mid", primary_pace: "medium", family_group: "same_fam" }),
  ];
  const slot = { column: "mid" as const, pace: "slow" as const, role: "secondary" as const };
  const pickedFalse = applyRelaxationChain(
    slot,
    pool,
    new Set(["same_fam"]),
    new Set(),
    [],
    seed,
    ["mid"],
    new Set<TacticalPace>(["slow", "medium"]),
    new Set(["mid"] as const),
    createCollectingDiagWriter([]),
    1,
    "lure",
    r,
    false,
  );
  assertEquals(pickedFalse, null);
  const picked = applyRelaxationChain(
    slot,
    pool,
    new Set(["same_fam"]),
    new Set(),
    [],
    seed,
    ["mid"],
    new Set<TacticalPace>(["slow", "medium"]),
    new Set(["mid"] as const),
    createCollectingDiagWriter(diags),
    1,
    "lure",
    r,
    true,
  );
  assertEquals(picked != null, true);
  assertEquals(diags.some((d) => d.event === "pace_relaxed"), true);
});

Deno.test("pickTop3: catastrophically empty pool throws engine error", () => {
  const r = row();
  const empty: readonly ArchetypeProfileV4[] = [];
  const recipe = buildSlotRecipe(["bottom", "bottom", "bottom"], ["slow", "slow", "slow"]);
  const diags: RecommenderV4DiagPayload[] = [];
  const writer = createCollectingDiagWriter(diags);
  const seed = createMulberry32(1);
  assertThrows(
    () =>
      pickTop3V4(
        recipe,
        empty,
        empty,
        seed,
        ["bottom"],
        new Set(["slow"]),
        new Set(["bottom"]),
        writer,
        "lure",
        r,
      ),
    RecommenderV4EngineError,
  );
});
