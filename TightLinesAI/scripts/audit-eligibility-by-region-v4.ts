/**
 * §17.8 — Per-region × 12-month eligibility audit markdown.
 *
 * Usage: deno run -A scripts/audit-eligibility-by-region-v4.ts
 */
import type { EngineContext } from "../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { RegionKey } from "../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { RecommenderV4Species, SeasonalRowV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { RECOMMENDER_V4_SPECIES } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { LARGEMOUTH_V3_SUPPORTED_REGIONS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth.ts";
import { SMALLMOUTH_V3_SUPPORTED_REGIONS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts";
import { NORTHERN_PIKE_V3_SUPPORTED_REGIONS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/pike.ts";
import { TROUT_V3_SUPPORTED_REGIONS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/trout.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildEligiblePoolV4,
  tacticsForPosture,
  type PostureV4,
} from "./lib/seasonalMatrixV4/tacticsAndPools.ts";

const OUT_DIR = "docs/authoring/eligibility-audits";

const CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];
const POSTURES: readonly PostureV4[] = ["aggressive", "neutral", "suppressed"];

const ROWS_BY_SPECIES: Record<RecommenderV4Species, readonly SeasonalRowV4[]> = {
  largemouth_bass: LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  smallmouth_bass: SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  northern_pike: NORTHERN_PIKE_SEASONAL_ROWS_V4,
  trout: TROUT_SEASONAL_ROWS_V4,
};

const REGIONS_BY_SPECIES: Record<RecommenderV4Species, readonly RegionKey[]> = {
  largemouth_bass: LARGEMOUTH_V3_SUPPORTED_REGIONS,
  smallmouth_bass: SMALLMOUTH_V3_SUPPORTED_REGIONS,
  northern_pike: NORTHERN_PIKE_V3_SUPPORTED_REGIONS,
  trout: TROUT_V3_SUPPORTED_REGIONS,
};

function findRegionalRow(
  rows: readonly SeasonalRowV4[],
  region: RegionKey,
  month: number,
  water: EngineContext,
): SeasonalRowV4 | undefined {
  return rows.find(
    (r) =>
      r.region_key === region &&
      r.month === month &&
      r.water_type === water &&
      r.state_code == null,
  );
}

function topFamilies(
  pool: { id: string; family_group: string }[],
  n: number,
): string {
  const m = new Map<string, number>();
  for (const p of pool) {
    m.set(p.family_group, (m.get(p.family_group) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, c]) => `${k}(${c})`)
    .join(", ");
}

function minPoolOk(species: RecommenderV4Species, n: number): boolean {
  return species === "trout" ? n >= 4 : n >= 6;
}

function auditFilename(
  species: RecommenderV4Species,
  region: RegionKey,
  water: EngineContext,
): string {
  return `${species}-${region}-${water}.md`;
}

async function writeAudit(
  species: RecommenderV4Species,
  region: RegionKey,
  water: EngineContext,
) {
  const rows = ROWS_BY_SPECIES[species];
  const lines: string[] = [];
  lines.push(`# Eligibility audit — ${species} — ${region} — ${water}`);
  lines.push("");
  lines.push(
    "Runtime pool sizes use §11 `buildEligiblePoolV4` with `tacticsForPosture` column/pace sets (wind=10 mph). Pools are **not** filtered by forage (forage applies to headline slot only).",
  );
  lines.push("");
  lines.push(
    "| Month | Clarity | Posture | Lure pool | Fly pool | Top lure families | Top fly families | Notes |",
  );
  lines.push("| ---: | --- | --- | ---: | ---: | --- | --- | --- |");

  for (let month = 1; month <= 12; month++) {
    const row = findRegionalRow(rows, region, month, water);
    if (!row) {
      for (const clarity of CLARITIES) {
        for (const posture of POSTURES) {
          lines.push(
            `| ${month} | ${clarity} | ${posture} | — | — | — | — | **No regional row** — add CSV or confirm v3 fallback region. |`,
          );
        }
      }
      continue;
    }
    for (const clarity of CLARITIES) {
      for (const posture of POSTURES) {
        let notes = "";
        try {
          const { poolColumns, poolPaces } = tacticsForPosture(row, posture, 10);
          const lurePool = buildEligiblePoolV4(
            "lure",
            row,
            poolColumns,
            poolPaces,
            clarity,
            species,
            water,
            LURE_ARCHETYPES_V4,
          );
          const flyPool = buildEligiblePoolV4(
            "fly",
            row,
            poolColumns,
            poolPaces,
            clarity,
            species,
            water,
            FLY_ARCHETYPES_V4,
          );
          if (!minPoolOk(species, lurePool.length)) {
            notes += `Lure pool < ${species === "trout" ? 4 : 6}. `;
          }
          if (!minPoolOk(species, flyPool.length)) {
            notes += `Fly pool < ${species === "trout" ? 4 : 6}. `;
          }
          lines.push(
            `| ${month} | ${clarity} | ${posture} | ${lurePool.length} | ${flyPool.length} | ${topFamilies(lurePool, 5)} | ${topFamilies(flyPool, 5)} | ${notes.trim() || "—"} |`,
          );
        } catch (e) {
          lines.push(
            `| ${month} | ${clarity} | ${posture} | — | — | — | — | **Tactics error:** ${e} |`,
          );
        }
      }
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Reviewer sign-off");
  lines.push("");
  lines.push("- [ ] Pool arcs reviewed for biological credibility");
  lines.push("- [ ] Thin cells either accepted (notes in CSV) or scheduled for catalog/range follow-up");
  lines.push("");
  lines.push(
    "**Reviewer:** _______________  **Date:** _______________",
  );

  const path = `${OUT_DIR}/${auditFilename(species, region, water)}`;
  await Deno.writeTextFile(path, lines.join("\n") + "\n");
}

async function main() {
  await Deno.mkdir(OUT_DIR, { recursive: true });
  let n = 0;
  for (const species of RECOMMENDER_V4_SPECIES) {
    const regions = REGIONS_BY_SPECIES[species];
    const waters: EngineContext[] =
      species === "trout"
        ? ["freshwater_river"]
        : ["freshwater_lake_pond", "freshwater_river"];
    for (const region of regions) {
      for (const water of waters) {
        await writeAudit(species, region, water);
        n++;
      }
    }
  }
  console.error(`Wrote ${n} audit files to ${OUT_DIR}/`);
}

main();
