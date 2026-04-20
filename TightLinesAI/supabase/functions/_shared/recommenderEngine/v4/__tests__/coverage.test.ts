/**
 * §20.4 — experimental **v4 engine** (`computeRecommenderV4`), not production rebuild.
 *
 * Writes `docs/authoring/coverage-per-region.md` when run. Opt-in only:
 *
 * ```
 * TL_RUN_V4_COVERAGE_MATRIX=1 deno test --allow-read --allow-write \\
 *   supabase/functions/_shared/recommenderEngine/v4/__tests__/coverage.test.ts
 * ```
 */
import { assertEquals } from "jsr:@std/assert";

/** Env opt-in reads `TL_RUN_V4_COVERAGE_MATRIX=1`; works without `--allow-env` (defaults false). */
let RUN_V4_COVERAGE_MATRIX = false;
try {
  RUN_V4_COVERAGE_MATRIX = Deno.env.get("TL_RUN_V4_COVERAGE_MATRIX") === "1";
} catch {
  RUN_V4_COVERAGE_MATRIX = false;
}
import { join } from "jsr:@std/path/join";
import type { RecommenderRequest } from "../../contracts/input.ts";
import type { SeasonalRowV4 } from "../contracts.ts";
import { computeRecommenderV4 } from "../engine/runRecommenderV4.ts";
import { createCollectingDiagWriter, type RecommenderV4DiagPayload } from "../engine/diagnostics.ts";
import { toLegacyRecommenderSpecies } from "../scope.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../seasonal/generated/trout.ts";
import { analysisWithScore } from "./helpers/analysisStub.ts";

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const NINE_PAYLOADS = [
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "clear" as const },
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "stained" as const },
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "dirty" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "clear" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "stained" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "dirty" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "clear" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "stained" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "dirty" as const },
];

function tripleKey(row: SeasonalRowV4): string {
  return `${row.species}|${row.region_key}|${row.water_type}`;
}

function requestForRow(row: SeasonalRowV4, payload: (typeof NINE_PAYLOADS)[number]): RecommenderRequest {
  const st = row.state_code?.trim();
  return {
    location: {
      latitude: 40,
      longitude: -100,
      state_code: st && st.length > 0 ? st : "MN",
      region_key: row.region_key,
      local_date: `2026-${String(row.month).padStart(2, "0")}-15`,
      local_timezone: "America/Chicago",
      month: row.month,
    },
    species: toLegacyRecommenderSpecies(row.species),
    context: row.water_type,
    water_clarity: payload.water_clarity,
    env_data: { wind_speed_mph: payload.wind_mph },
  };
}

function userIdForCell(row: SeasonalRowV4, pi: number): string {
  return `coverage|${row.species}|${row.region_key}|${row.month}|${row.water_type}|${pi}`;
}

type TripleAgg = {
  totalCells: number;
  /** Count of cells (row × payload) where `pool_undersized` fired at least once (lure and/or fly). */
  poolUndersizedCells: number;
  /** §20.4 — cells where at least one `pace_relaxed` or `column_relaxed` diagnostic fired (lure and/or fly diags merged per cell). */
  paceOrColumnRelaxedCells: number;
  familyRedundancyCells: number;
  headlineNonNoneCells: number;
  surfaceCapCells: number;
  bothRelaxedCells: number;
  /** §20.4: union of lure + fly ids seen in any top-3 across the triple’s cells */
  archetypeIds: Set<string>;
};

function emptyTripleAgg(): TripleAgg {
  return {
    totalCells: 0,
    poolUndersizedCells: 0,
    paceOrColumnRelaxedCells: 0,
    familyRedundancyCells: 0,
    headlineNonNoneCells: 0,
    surfaceCapCells: 0,
    bothRelaxedCells: 0,
    archetypeIds: new Set(),
  };
}

function ingestCellDiags(agg: TripleAgg, diags: RecommenderV4DiagPayload[]) {
  if (diags.some((d) => d.event === "pool_undersized")) agg.poolUndersizedCells++;
  if (diags.some((d) => d.event === "pace_relaxed" || d.event === "column_relaxed")) {
    agg.paceOrColumnRelaxedCells++;
  }
  if (diags.some((d) => d.event === "family_redundancy_relaxed")) agg.familyRedundancyCells++;
  if (diags.some((d) => d.event === "headline_fallback")) agg.headlineNonNoneCells++;
  if (diags.some((d) => d.event === "headline_fallback" && d.variant === "both_relaxed")) {
    agg.bothRelaxedCells++;
  }
  if (diags.some((d) => d.event === "surface_cap_fired")) agg.surfaceCapCells++;
}

function assertTop3Invariant(row: SeasonalRowV4, r: ReturnType<typeof computeRecommenderV4>) {
  const colRange = new Set(row.column_range as readonly string[]);
  for (const gear of [r.lure_recommendations, r.fly_recommendations] as const) {
    assertEquals(gear.length, 3);
    const fams = gear.map((p) => p.family_group);
    assertEquals(new Set(fams).size, 3, "family_group uniqueness within top-3");
    const ids = gear.map((p) => p.id);
    assertEquals(new Set(ids).size, 3, "distinct archetype ids");
    const surf = gear.filter((p) => p.column === "surface").length;
    assertEquals(surf <= 1, true, "P4 surface cap on output column");
    for (const p of gear) {
      assertEquals(
        colRange.has(p.column),
        true,
        `pick column ${p.column} must stay in seasonal column_range`,
      );
    }
  }
}

Deno.test({
  name:
    "§20.4 coverage (experimental v4 engine): 9-payload matrix + per-region report [TL_RUN_V4_COVERAGE_MATRIX=1]",
  ignore: !RUN_V4_COVERAGE_MATRIX,
  async fn() {
    const tripleMap = new Map<string, TripleAgg>();
    let globalCells = 0;
    let globalPoolUndersizedCells = 0;
    let globalPaceColRelaxedCells = 0;
    let globalFamilyRedCells = 0;
    let globalHeadlineCells = 0;
    let globalBothRelaxedCells = 0;
    let globalSurfaceCapCells = 0;
    const failures: string[] = [];

    for (const row of ALL_ROWS) {
      const key = tripleKey(row);
      if (!tripleMap.has(key)) tripleMap.set(key, emptyTripleAgg());
      const tAgg = tripleMap.get(key)!;

      for (let pi = 0; pi < NINE_PAYLOADS.length; pi++) {
        const payload = NINE_PAYLOADS[pi]!;
        const req = requestForRow(row, payload);
        const diags: RecommenderV4DiagPayload[] = [];
        const writer = createCollectingDiagWriter(diags);
        globalCells++;
        tAgg.totalCells++;

        try {
          const analysis = analysisWithScore(payload.score);
          const r = computeRecommenderV4(req, userIdForCell(row, pi), analysis, row, writer);
          assertTop3Invariant(row, r);
          for (const p of r.lure_recommendations) tAgg.archetypeIds.add(p.id);
          for (const p of r.fly_recommendations) tAgg.archetypeIds.add(p.id);
          /** §20.4 metrics apply only to successful cells (partial diags after a throw would skew rates). */
          ingestCellDiags(tAgg, diags);
          if (diags.some((d) => d.event === "pool_undersized")) globalPoolUndersizedCells++;
          if (diags.some((d) => d.event === "pace_relaxed" || d.event === "column_relaxed")) {
            globalPaceColRelaxedCells++;
          }
          if (diags.some((d) => d.event === "family_redundancy_relaxed")) globalFamilyRedCells++;
          if (diags.some((d) => d.event === "headline_fallback")) globalHeadlineCells++;
          if (diags.some((d) => d.event === "headline_fallback" && d.variant === "both_relaxed")) {
            globalBothRelaxedCells++;
          }
          if (diags.some((d) => d.event === "surface_cap_fired")) globalSurfaceCapCells++;
        } catch (e) {
          failures.push(`${key} payload#${pi}: ${e}`);
        }
      }
    }

    const mdLines: string[] = [
      "# Recommender v4 coverage (per species × region × water_type)",
      "",
      "Generated by `coverage.test.ts` (§20.4). One row per triple: rates are over `months × 9` cells.",
      "",
      "**Relaxation rate (§20.4):** `pace_relaxed` + `column_relaxed` — share of **successful** cells (full lure+fly run, no throw) where **at least one** such diagnostic fired (lure and/or fly diags merged per cell). Per-triple cap: this share ≤ 25%.",
      "",
      "| species | region_key | water_type | cells | pool_undersized% | relax_cells% | family_redundancy% | headline≠none% | both_relaxed% | surface_cap | unique archetype ids (lure∪fly) | triple caps |",
      "|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|",
    ];

    const tripleFailures: string[] = [];
    for (const [key, agg] of [...tripleMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const species = key.split("|")[0]!;
      const minUnique = species === "trout" ? 4 : 6;
      const u = agg.archetypeIds.size;
      const pu = agg.totalCells > 0 ? (100 * agg.poolUndersizedCells) / agg.totalCells : 0;
      const rx = agg.totalCells > 0 ? agg.paceOrColumnRelaxedCells / agg.totalCells : 0;
      const fr = agg.totalCells > 0 ? (100 * agg.familyRedundancyCells) / agg.totalCells : 0;
      const hn = agg.totalCells > 0 ? (100 * agg.headlineNonNoneCells) / agg.totalCells : 0;
      const br = agg.totalCells > 0 ? (100 * agg.bothRelaxedCells) / agg.totalCells : 0;

      const capOk =
        pu <= 20 &&
        rx <= 0.25 &&
        hn <= 15 &&
        u >= minUnique &&
        agg.surfaceCapCells === 0;
      const capStr = capOk ? "PASS" : "FAIL";
      if (!capOk) {
        tripleFailures.push(
          `${key}: pool≤20% ${pu.toFixed(1)} relax≤0.25 ${rx.toFixed(3)} headline≤15% ${hn.toFixed(1)} unique≥${minUnique} got ${u} surface_cap_cells=${agg.surfaceCapCells}`,
        );
      }

      const [sp, rk, wt] = key.split("|");
      mdLines.push(
        `| ${sp} | ${rk} | ${wt} | ${agg.totalCells} | ${pu.toFixed(2)} | ${(100 * rx).toFixed(2)} | ${fr.toFixed(2)} | ${hn.toFixed(2)} | ${br.toFixed(2)} | ${agg.surfaceCapCells} | ${u} | ${capStr} |`,
      );
    }

    mdLines.push("", `**Engine errors this run:** ${failures.length} (cells where computeRecommenderV4 threw).`, "");

    const outPath = join(
      import.meta.dirname!,
      "..",
      "..",
      "..",
      "..",
      "..",
      "..",
      "docs",
      "authoring",
      "coverage-per-region.md",
    );
    await Deno.mkdir(join(import.meta.dirname!, "..", "..", "..", "..", "..", "..", "docs", "authoring"), {
      recursive: true,
    });
    await Deno.writeTextFile(outPath, mdLines.join("\n") + "\n");

    const gPool = (100 * globalPoolUndersizedCells) / globalCells;
    const gFam = (100 * globalFamilyRedCells) / globalCells;
    const gBoth = (100 * globalBothRelaxedCells) / globalCells;

    if (failures.length > 0) {
      throw new Error(
        `coverage: ${failures.length} engine errors (see docs/authoring/coverage-per-region.md). First: ${failures[0]}`,
      );
    }
    assertEquals(globalSurfaceCapCells, 0, "global: surface_cap_fired must be 0");
    assertEquals(gPool <= 5, true, `global pool_undersized ${gPool.toFixed(2)}% > 5%`);
    assertEquals(gFam <= 2, true, `global family_redundancy_relaxed ${gFam.toFixed(2)}% > 2%`);
    assertEquals(gBoth <= 1, true, `global headline both_relaxed ${gBoth.toFixed(2)}% > 1%`);
    assertEquals(tripleFailures.length, 0, `per-triple caps:\n${tripleFailures.slice(0, 20).join("\n")}`);
  },
});
