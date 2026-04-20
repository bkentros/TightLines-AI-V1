/**
 * One-shot migration: v3 seasonal TS → v4 CSVs per §19 Phase 3.
 * Run: deno run -A scripts/migrate-v3-seasonal-csv-v4.ts
 */
import type { ForageBucketV3, RecommenderV3SeasonalRow } from "../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "../supabase/functions/_shared/recommenderEngine/v3/seasonal/trout.ts";
import type {
  FlyArchetypeIdV4,
  ForageBucket,
  LureArchetypeIdV4,
  RecommenderV4Species,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import {
  FLY_ARCHETYPE_IDS_V4,
  LURE_ARCHETYPE_IDS_V4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { encodeCsvField, joinPipeList } from "./lib/seasonalMatrixV4/csv.ts";

const LURE_SET = new Set<string>(LURE_ARCHETYPE_IDS_V4 as readonly string[]);
const FLY_SET = new Set<string>(FLY_ARCHETYPE_IDS_V4 as readonly string[]);
const LURE_BY_ID = new Map(LURE_ARCHETYPES_V4.map((a) => [a.id, a]));
const FLY_BY_ID = new Map(FLY_ARCHETYPES_V4.map((a) => [a.id, a]));

const HEADER =
  "species,region_key,month,water_type,state_code,column_range,column_baseline,pace_range,pace_baseline,primary_forage,secondary_forage,surface_seasonally_possible,primary_lure_ids,primary_fly_ids,excluded_lure_ids,excluded_fly_ids,notes";

function mapForage(
  species: RecommenderV4Species,
  primary: ForageBucketV3,
  secondary: ForageBucketV3 | undefined,
): { primary_forage: ForageBucket; secondary_forage?: ForageBucket } {
  let sec = secondary as ForageBucket | undefined;
  if (species === "trout" && sec === "insect_misc") {
    sec = "leech_worm";
  }
  return { primary_forage: primary as ForageBucket, secondary_forage: sec };
}

function columnBaselineV3(
  preference: readonly string[],
  allowed: readonly string[],
): string {
  for (const c of preference) {
    if (c !== "surface") return c;
  }
  const ns = allowed.find((c) => c !== "surface");
  if (!ns) {
    throw new Error("No non-surface column in allowed_columns");
  }
  return ns;
}

function matchesRowLure(
  id: LureArchetypeIdV4,
  species: RecommenderV4Species,
  waterType: string,
  columnRange: readonly string[],
  paceRange: readonly string[],
): boolean {
  const a = LURE_BY_ID.get(id);
  if (!a) return false;
  if (!a.species_allowed.includes(species)) return false;
  if (!a.water_types_allowed.includes(waterType as "freshwater_lake_pond" | "freshwater_river")) {
    return false;
  }
  if (!columnRange.includes(a.column)) return false;
  const paceOk =
    paceRange.includes(a.primary_pace) ||
    (a.secondary_pace != null && paceRange.includes(a.secondary_pace));
  return paceOk;
}

function matchesRowFly(
  id: FlyArchetypeIdV4,
  species: RecommenderV4Species,
  waterType: string,
  columnRange: readonly string[],
  paceRange: readonly string[],
): boolean {
  const a = FLY_BY_ID.get(id);
  if (!a) return false;
  if (!a.species_allowed.includes(species)) return false;
  if (!a.water_types_allowed.includes(waterType as "freshwater_lake_pond" | "freshwater_river")) {
    return false;
  }
  if (!columnRange.includes(a.column)) return false;
  const paceOk =
    paceRange.includes(a.primary_pace) ||
    (a.secondary_pace != null && paceRange.includes(a.secondary_pace));
  return paceOk;
}

function flyForageMatchCount(
  ids: readonly FlyArchetypeIdV4[],
  primary_forage: ForageBucket,
  secondary_forage?: ForageBucket,
): number {
  const allowed = [primary_forage, secondary_forage].filter(Boolean) as ForageBucket[];
  return ids.filter((id) => {
    const a = FLY_BY_ID.get(id);
    return a && a.forage_tags.some((t) => allowed.includes(t));
  }).length;
}

function ensureFlyForageCoverage(
  ids: FlyArchetypeIdV4[],
  species: RecommenderV4Species,
  waterType: string,
  columnRange: readonly string[],
  paceRange: readonly string[],
  primary_forage: ForageBucket,
  secondary_forage: ForageBucket | undefined,
  minForage: number,
): FlyArchetypeIdV4[] {
  const out = [...ids];
  while (
    flyForageMatchCount(out, primary_forage, secondary_forage) < minForage &&
    out.length < 8
  ) {
    let added = false;
    for (const a of FLY_ARCHETYPES_V4) {
      const fid = a.id as FlyArchetypeIdV4;
      if (out.includes(fid)) continue;
      if (!FLY_SET.has(fid)) continue;
      if (!matchesRowFly(fid, species, waterType, columnRange, paceRange)) {
        continue;
      }
      const allowed = [primary_forage, secondary_forage].filter(Boolean) as ForageBucket[];
      if (!a.forage_tags.some((t) => allowed.includes(t))) continue;
      out.push(fid);
      added = true;
      break;
    }
    if (!added) break;
  }
  return out;
}

function pickPrimaries<L extends string>(
  preferred: readonly L[] | undefined,
  eligible: readonly L[],
  catalogFallback: readonly L[],
  matcher: (id: L) => boolean,
  min: number,
  max: number,
): L[] {
  const out: L[] = [];
  const add = (id: L) => {
    if (out.length >= max) return;
    if (!matcher(id)) return;
    if (!out.includes(id)) out.push(id);
  };
  if (preferred?.length) {
    for (const id of preferred) add(id);
  }
  for (const id of eligible) add(id);
  for (const id of catalogFallback) add(id);
  if (out.length < min) {
    throw new Error(`Could not fill primaries: got ${out.length}, need ${min}`);
  }
  return out.slice(0, max);
}

function v3RowToV4(row: RecommenderV3SeasonalRow): SeasonalRowV4 {
  const species = row.species as RecommenderV4Species;
  const water_type = row.context;
  const mb = row.monthly_baseline;
  let column_range = [...mb.allowed_columns] as SeasonalRowV4["column_range"];
  let surface_seasonally_possible = mb.surface_seasonally_possible;
  if (surface_seasonally_possible && !column_range.includes("surface")) {
    surface_seasonally_possible = false;
  }
  if (!surface_seasonally_possible) {
    column_range = column_range.filter((c) => c !== "surface");
  }
  const column_baseline = columnBaselineV3(
    mb.column_preference_order as readonly string[],
    mb.allowed_columns as readonly string[],
  ) as SeasonalRowV4["column_baseline"];
  const pace_range = [...mb.allowed_paces] as SeasonalRowV4["pace_range"];
  const pace_baseline = mb.pace_preference_order[0] as SeasonalRowV4["pace_baseline"];
  const { primary_forage, secondary_forage } = mapForage(
    species,
    mb.primary_forage,
    mb.secondary_forage,
  );

  const lureCatalogIds = LURE_ARCHETYPES_V4.map((a) => a.id) as readonly LureArchetypeIdV4[];
  const flyCatalogIds = FLY_ARCHETYPES_V4.map((a) => a.id) as readonly FlyArchetypeIdV4[];

  const primary_lure_ids = pickPrimaries(
    row.primary_lure_ids,
    row.eligible_lure_ids,
    lureCatalogIds,
    (id) =>
      LURE_SET.has(id) &&
      matchesRowLure(
        id as LureArchetypeIdV4,
        species,
        water_type,
        column_range,
        pace_range,
      ),
    3,
    8,
  ) as SeasonalRowV4["primary_lure_ids"];

  let primary_fly_ids = pickPrimaries(
    row.primary_fly_ids,
    row.eligible_fly_ids,
    flyCatalogIds,
    (id) =>
      FLY_SET.has(id) &&
      matchesRowFly(
        id as FlyArchetypeIdV4,
        species,
        water_type,
        column_range,
        pace_range,
      ),
    species === "trout" && water_type === "freshwater_river" && [12, 1, 2].includes(row.month)
      ? 2
      : 3,
    8,
  ) as SeasonalRowV4["primary_fly_ids"];

  const minFlyForage =
    species === "trout" && water_type === "freshwater_river" && [12, 1, 2].includes(row.month)
      ? 1
      : 2;
  primary_fly_ids = ensureFlyForageCoverage(
    [...primary_fly_ids],
    species,
    water_type,
    column_range,
    pace_range,
    primary_forage,
    secondary_forage,
    minFlyForage,
  );

  return {
    species,
    region_key: row.region_key,
    month: row.month,
    water_type,
    state_code: row.state_code,
    column_range,
    column_baseline,
    pace_range,
    pace_baseline,
    primary_forage,
    secondary_forage,
    surface_seasonally_possible,
    primary_lure_ids,
    primary_fly_ids,
    excluded_lure_ids: undefined,
    excluded_fly_ids: undefined,
  };
}

function rowToCsvLine(row: SeasonalRowV4, notes: string): string {
  const fields = [
    row.species,
    row.region_key,
    String(row.month),
    row.water_type,
    row.state_code ?? "",
    joinPipeList(row.column_range),
    row.column_baseline,
    joinPipeList(row.pace_range),
    row.pace_baseline,
    row.primary_forage,
    row.secondary_forage ?? "",
    String(row.surface_seasonally_possible),
    joinPipeList(row.primary_lure_ids),
    joinPipeList(row.primary_fly_ids),
    joinPipeList(row.excluded_lure_ids ?? []),
    joinPipeList(row.excluded_fly_ids ?? []),
    notes,
  ];
  return fields.map(encodeCsvField).join(",");
}

function sortKey(row: SeasonalRowV4): string {
  return [
    row.species,
    row.region_key,
    String(row.month).padStart(2, "0"),
    row.water_type,
    row.state_code ?? "",
  ].join("\t");
}

async function writeSpeciesCsv(
  path: string,
  rows: SeasonalRowV4[],
  note: string,
) {
  const sorted = [...rows].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const lines = [HEADER];
  for (const r of sorted) {
    lines.push(rowToCsvLine(r, note));
  }
  await Deno.writeTextFile(path, lines.join("\n") + "\n");
}

const MIGRATE_NOTE = "Migrated from v3 seasonal rows; secondary insect_misc→leech_worm for trout per §17.6.";

async function main() {
  const outDir = "data/seasonal-matrix";
  await Deno.mkdir(outDir, { recursive: true });

  const lmb = LARGEMOUTH_V3_SEASONAL_ROWS.map(v3RowToV4);
  const smb = SMALLMOUTH_V3_SEASONAL_ROWS.map(v3RowToV4);
  const pike = NORTHERN_PIKE_V3_SEASONAL_ROWS.map(v3RowToV4);
  const trout = TROUT_V3_SEASONAL_ROWS.map(v3RowToV4);

  await writeSpeciesCsv(`${outDir}/largemouth_bass.csv`, lmb, MIGRATE_NOTE);
  await writeSpeciesCsv(`${outDir}/smallmouth_bass.csv`, smb, MIGRATE_NOTE);
  await writeSpeciesCsv(`${outDir}/northern_pike.csv`, pike, MIGRATE_NOTE);
  await writeSpeciesCsv(`${outDir}/trout.csv`, trout, MIGRATE_NOTE);

  console.log(
    `Wrote ${lmb.length} largemouth, ${smb.length} smallmouth, ${pike.length} pike, ${trout.length} trout rows → ${outDir}/`,
  );
}

main();
