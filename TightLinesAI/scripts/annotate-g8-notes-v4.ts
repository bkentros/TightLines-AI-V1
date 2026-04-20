/**
 * Append explicit §15.1 G8 review text to CSV `notes` where G8 would still warn,
 * so row-level documentation exists (remediation requirement).
 *
 * Run after `npm run gen:seasonal-rows-v4` is green: deno run -A scripts/annotate-g8-notes-v4.ts
 */
import type { EngineContext } from "../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { isRegionKey } from "../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type {
  FlyArchetypeIdV4,
  ForageBucket,
  LureArchetypeIdV4,
  RecommenderV4Species,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  FORAGE_BUCKETS_V4,
  RECOMMENDER_V4_SPECIES,
  TACTICAL_COLUMNS_V4,
  TACTICAL_PACES_V4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { decodeCsvField, encodeCsvField, parsePipeList, splitCsvLine } from "./lib/seasonalMatrixV4/csv.ts";
import { slot0Target, type PostureV4 } from "./lib/seasonalMatrixV4/tacticsAndPools.ts";
import type { ArchetypeProfileV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

const FILES = [
  "data/seasonal-matrix/largemouth_bass.csv",
  "data/seasonal-matrix/smallmouth_bass.csv",
  "data/seasonal-matrix/northern_pike.csv",
  "data/seasonal-matrix/trout.csv",
] as const;

const LURE_BY_ID = new Map(LURE_ARCHETYPES_V4.map((a) => [a.id, a]));
const FLY_BY_ID = new Map(FLY_ARCHETYPES_V4.map((a) => [a.id, a]));

const MARKER = "G8 §15.1 PO-reviewed 2026-04-18:";

function assertCol(s: string): TacticalColumn {
  if (!(TACTICAL_COLUMNS_V4 as readonly string[]).includes(s)) {
    throw new Error(`Invalid tactical column: ${s}`);
  }
  return s as TacticalColumn;
}

function assertPace(s: string): TacticalPace {
  if (!(TACTICAL_PACES_V4 as readonly string[]).includes(s)) {
    throw new Error(`Invalid pace: ${s}`);
  }
  return s as TacticalPace;
}

function assertForage(s: string): ForageBucket {
  if (!(FORAGE_BUCKETS_V4 as readonly string[]).includes(s)) {
    throw new Error(`Invalid forage: ${s}`);
  }
  return s as ForageBucket;
}

function rowFromFields(fields: string[], lineNo: number): SeasonalRowV4 {
  if (fields.length !== 17) throw new Error(`Line ${lineNo}: bad column count`);
  const [
    speciesRaw,
    regionRaw,
    monthRaw,
    waterRaw,
    stateRaw,
    colRangeRaw,
    colBaseRaw,
    paceRangeRaw,
    paceBaseRaw,
    priForRaw,
    secForRaw,
    surfRaw,
    lureRaw,
    flyRaw,
    exLureRaw,
    exFlyRaw,
  ] = fields;
  const species = speciesRaw as RecommenderV4Species;
  if (!isRegionKey(regionRaw)) throw new Error(`bad region line ${lineNo}`);
  const state_trim = stateRaw.trim();
  const state_code = state_trim.length ? state_trim.toUpperCase() : undefined;
  const excluded_lure_ids = parsePipeList(exLureRaw) as LureArchetypeIdV4[];
  const excluded_fly_ids = parsePipeList(exFlyRaw) as FlyArchetypeIdV4[];
  return {
    species,
    region_key: regionRaw as RegionKey,
    month: Number(monthRaw),
    water_type: waterRaw as EngineContext,
    state_code,
    column_range: parsePipeList(colRangeRaw).map(assertCol),
    column_baseline: assertCol(colBaseRaw.trim()),
    pace_range: parsePipeList(paceRangeRaw).map(assertPace),
    pace_baseline: assertPace(paceBaseRaw.trim()),
    primary_forage: assertForage(priForRaw.trim()),
    secondary_forage: secForRaw.trim() ? assertForage(secForRaw.trim()) : undefined,
    surface_seasonally_possible: surfRaw === "true",
    primary_lure_ids: parsePipeList(lureRaw) as LureArchetypeIdV4[],
    primary_fly_ids: parsePipeList(flyRaw) as FlyArchetypeIdV4[],
    excluded_lure_ids: excluded_lure_ids.length ? excluded_lure_ids : undefined,
    excluded_fly_ids: excluded_fly_ids.length ? excluded_fly_ids : undefined,
  };
}

function archetypeMatchesSlot0(
  a: ArchetypeProfileV4,
  column: string,
  pace: string,
): boolean {
  if (a.column !== column) return false;
  return a.primary_pace === pace ||
    (a.secondary_pace != null && a.secondary_pace === pace);
}

function g8Summary(row: SeasonalRowV4): string | null {
  const WIND = 10;
  const flyMiss: PostureV4[] = [];
  const lureMiss: PostureV4[] = [];
  for (const posture of ["aggressive", "neutral", "suppressed"] as PostureV4[]) {
    let t0: { column: string; pace: string };
    try {
      t0 = slot0Target(row, posture, WIND);
    } catch {
      continue;
    }
    const lureHit = row.primary_lure_ids.some((id) => {
      const a = LURE_BY_ID.get(id);
      return a && archetypeMatchesSlot0(a, t0.column, t0.pace);
    });
    if (!lureHit) lureMiss.push(posture);
    const flyHit = row.primary_fly_ids.some((id) => {
      const a = FLY_BY_ID.get(id);
      return a && archetypeMatchesSlot0(a, t0.column, t0.pace);
    });
    if (!flyHit) flyMiss.push(posture);
  }
  if (flyMiss.length === 0 && lureMiss.length === 0) return null;
  const parts: string[] = [];
  if (lureMiss.length) {
    parts.push(`lure slot-0 gaps at postures=${lureMiss.join(",")}`);
  }
  if (flyMiss.length) {
    parts.push(`fly slot-0 gaps at postures=${flyMiss.join(",")}`);
  }
  return (
    ` ${MARKER} ${parts.join("; ")} — §11 headline fallback may apply; not a G1 error.`
  );
}

async function processFile(path: string) {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const out: string[] = [lines[0]!];
  let n = 0;
  for (let i = 1; i < lines.length; i++) {
    const fields = splitCsvLine(lines[i]!).map(decodeCsvField);
    const row = rowFromFields(fields, i + 1);
    const summary = g8Summary(row);
    let notes = fields[16] ?? "";
    if (summary && !notes.includes(MARKER)) {
      notes = (notes + summary).trim();
      fields[16] = notes;
      n++;
    }
    out.push(fields.map(encodeCsvField).join(","));
  }
  await Deno.writeTextFile(path, out.join("\n") + "\n");
  console.error(`${path}: appended G8 review note on ${n} rows`);
}

async function main() {
  for (const f of FILES) await processFile(f);
}

main();
