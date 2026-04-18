/**
 * Recommender v4 — pre-authoring catalog gap analysis (§17.9).
 *
 * Run from repo root `TightLinesAI/`:
 *   deno run -A scripts/catalog-gap-analysis-v4.ts [--species <id>] [--format markdown|json]
 *
 * Default: --format markdown → writes docs/authoring/catalog-gap-analysis.md
 * JSON: prints { summary, rows } to stdout (no file write).
 */
import type { EngineContext } from "../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import type { ArchetypeProfileV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  RECOMMENDER_V4_SPECIES,
  TACTICAL_COLUMNS_V4,
  TACTICAL_PACES_V4,
  type RecommenderV4Species,
  type TacticalColumn,
  type TacticalPace,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

const WATERS: readonly EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
];

const CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];

const MD_REL_PATH = "docs/authoring/catalog-gap-analysis.md";

type Verdict = "ok" | "thin" | "critical";

type GapRow = {
  species: RecommenderV4Species;
  water_type: EngineContext;
  column: TacticalColumn;
  pace: TacticalPace;
  clarity: WaterClarity;
  lure_count: number;
  fly_count: number;
  verdict: Verdict;
};

function matchesCell(
  p: ArchetypeProfileV4,
  species: RecommenderV4Species,
  water: EngineContext,
  column: TacticalColumn,
  pace: TacticalPace,
  clarity: WaterClarity,
): boolean {
  if (!p.species_allowed.includes(species)) return false;
  if (!p.water_types_allowed.includes(water)) return false;
  if (p.column !== column) return false;
  const paceOk = p.primary_pace === pace || p.secondary_pace === pace;
  if (!paceOk) return false;
  if (!p.clarity_strengths.includes(clarity)) return false;
  return true;
}

function verdictFor(lureCount: number, flyCount: number): Verdict {
  if (lureCount >= 4 && flyCount >= 3) return "ok";
  if (lureCount >= 2 && flyCount >= 2) return "thin";
  return "critical";
}

function parseArgs(): { species: RecommenderV4Species[] | null; format: "markdown" | "json" } {
  const argv = Deno.args;
  let species: RecommenderV4Species[] | null = null;
  let format: "markdown" | "json" = "markdown";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--species" && argv[i + 1]) {
      const id = argv[i + 1]!;
      if (!(RECOMMENDER_V4_SPECIES as readonly string[]).includes(id)) {
        throw new Error(
          `--species must be one of: ${RECOMMENDER_V4_SPECIES.join(", ")} (got "${id}")`,
        );
      }
      species = [id as RecommenderV4Species];
      i++;
    } else if (argv[i] === "--format" && argv[i + 1]) {
      const f = argv[i + 1]!;
      if (f !== "markdown" && f !== "json") {
        throw new Error(`--format must be markdown|json (got "${f}")`);
      }
      format = f;
      i++;
    }
  }
  return { species, format };
}

function collectRows(filterSpecies: RecommenderV4Species[] | null): GapRow[] {
  const speciesList = filterSpecies ?? [...RECOMMENDER_V4_SPECIES];
  const rows: GapRow[] = [];
  for (const species of speciesList) {
    for (const water_type of WATERS) {
      for (const column of TACTICAL_COLUMNS_V4) {
        for (const pace of TACTICAL_PACES_V4) {
          for (const clarity of CLARITIES) {
            const lure_count = LURE_ARCHETYPES_V4.filter((p) =>
              matchesCell(p, species, water_type, column, pace, clarity)
            ).length;
            const fly_count = FLY_ARCHETYPES_V4.filter((p) =>
              matchesCell(p, species, water_type, column, pace, clarity)
            ).length;
            rows.push({
              species,
              water_type,
              column,
              pace,
              clarity,
              lure_count,
              fly_count,
              verdict: verdictFor(lure_count, fly_count),
            });
          }
        }
      }
    }
  }
  return rows;
}

function summarize(rows: GapRow[]) {
  let ok = 0;
  let thin = 0;
  let critical = 0;
  for (const r of rows) {
    if (r.verdict === "ok") ok++;
    else if (r.verdict === "thin") thin++;
    else critical++;
  }
  return { ok, thin, critical, total: rows.length };
}

function criticalBuckets(rows: GapRow[]): Map<string, GapRow[]> {
  const criticalRows = rows.filter((r) => r.verdict === "critical");
  const m = new Map<string, GapRow[]>();
  for (const r of criticalRows) {
    const k = `lure_${r.lure_count}_fly_${r.fly_count}`;
    const list = m.get(k) ?? [];
    list.push(r);
    m.set(k, list);
  }
  return m;
}

function buildMarkdown(rows: GapRow[], summary: ReturnType<typeof summarize>): string {
  const lines: string[] = [];
  lines.push("# Catalog gap analysis (v4)");
  lines.push("");
  if (summary.critical === 0) {
    lines.push(
      "> `Gate passed — Phase 3 may begin — [REVIEWER_INITIALS] — [DATE]` — *Replace bracketed placeholders after review.*",
    );
  } else {
    lines.push(
      "> **Gate blocked — Phase 3 must not begin** until every **critical** row below has an explicit disposition (expand catalog / accept thinness / mark unreachable) and any required Appendix or catalog change is merged. *`Pending product-owner sign-off — [REVIEWER_INITIALS] — [DATE]`*",
    );
  }
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Total cells:** ${summary.total}`);
  lines.push(`- **ok** (lure ≥ 4 and fly ≥ 3): **${summary.ok}**`);
  lines.push(`- **thin** (below ok but lure ≥ 2 and fly ≥ 2): **${summary.thin}**`);
  lines.push(`- **critical** (lure < 2 or fly < 2): **${summary.critical}**`);
  lines.push("");
  lines.push("## Method (§17.9)");
  lines.push("");
  lines.push(
    "Cross-product: `(species × water_type × column × pace × clarity)`. Count lures and flies where `species ∈ species_allowed`, `water_type ∈ water_types_allowed`, `column` matches, `pace` matches `primary_pace` or `secondary_pace`, and `clarity ∈ clarity_strengths`.",
  );
  lines.push("");
  lines.push("| Verdict | condition |");
  lines.push("|---|---|");
  lines.push("| ok | lure_count ≥ 4 **and** fly_count ≥ 3 |");
  lines.push("| thin | below ok, but lure_count ≥ 2 **and** fly_count ≥ 2 |");
  lines.push("| critical | lure_count < 2 **or** fly_count < 2 |");
  lines.push("");
  lines.push("## Critical pattern aggregates");
  lines.push("");
  lines.push(
    "Buckets by `(lure_count, fly_count)` for critical cells — use for batch disposition. *Implementing-agent note: many critical cells are driven by Appendix A fly `water_types_allowed` (e.g. river-only bottom streamers) and `column` coverage; full cross-product includes combinations that may never co-occur in seasonal rows — product owner must confirm **mark unreachable** vs **expand catalog** vs **accept thinness** per §17.9.*",
  );
  lines.push("");
  const buckets = criticalBuckets(rows);
  const keys = [...buckets.keys()].sort();
  lines.push("| lure_count | fly_count | critical cells | example (species, water, column, pace, clarity) |");
  lines.push("|---:|---:|---:|---|");
  for (const k of keys) {
    const list = buckets.get(k)!;
    const ex = list[0]!;
    lines.push(
      `| ${ex.lure_count} | ${ex.fly_count} | ${list.length} | ${ex.species}, ${ex.water_type}, ${ex.column}, ${ex.pace}, ${ex.clarity} |`,
    );
  }
  lines.push("");
  lines.push("## Critical cells — disposition log");
  lines.push("");
  lines.push(
    "Per §17.9: for each **critical** row choose **expand catalog** | **accept thinness** | **mark unreachable**, with reviewer initials + date. *Implementing-agent default: **pending PO** for all rows until reviewed.*",
  );
  lines.push("");
  const criticalRows = rows.filter((r) => r.verdict === "critical");
  lines.push("| species | water_type | column | pace | clarity | lure_count | fly_count | disposition | initials | date |");
  lines.push("|---|---|---|---|---:|---:|---|---|---|---|");
  for (const r of criticalRows) {
    lines.push(
      `| ${r.species} | ${r.water_type} | ${r.column} | ${r.pace} | ${r.clarity} | ${r.lure_count} | ${r.fly_count} | pending PO | | |`,
    );
  }
  lines.push("");
  lines.push("## Thin cells (optional log)");
  lines.push("");
  const thinRows = rows.filter((r) => r.verdict === "thin");
  lines.push(`*Count: ${thinRows.length}* — per §17.9, thin may proceed; see full matrix.`);
  lines.push("");
  lines.push("## Full matrix");
  lines.push("");
  lines.push("| species | water_type | column | pace | clarity | lure_count | fly_count | verdict |");
  lines.push("|---|---|---|---|---:|---:|---:|---|");
  for (const r of rows) {
    lines.push(
      `| ${r.species} | ${r.water_type} | ${r.column} | ${r.pace} | ${r.clarity} | ${r.lure_count} | ${r.fly_count} | ${r.verdict} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

const { species: speciesFilter, format } = parseArgs();
const rows = collectRows(speciesFilter);
const summary = summarize(rows);

if (format === "json") {
  console.log(JSON.stringify({ summary, rows }, null, 2));
} else {
  const md = buildMarkdown(rows, summary);
  await Deno.mkdir("docs/authoring", { recursive: true });
  await Deno.writeTextFile(MD_REL_PATH, md);
  console.log(`Wrote ${MD_REL_PATH} (${summary.total} rows, critical=${summary.critical})`);
}
