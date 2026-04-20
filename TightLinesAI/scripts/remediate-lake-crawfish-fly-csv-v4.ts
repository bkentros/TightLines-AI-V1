/**
 * Phase 3 remediation: remove Appendix-A river-only `crawfish_streamer` from
 * `primary_fly_ids` on `freshwater_lake_pond` rows, then pad `primary_fly_ids`
 * until G1 fly-forage / count rules pass (no catalog edits).
 *
 * Run: deno run -A scripts/remediate-lake-crawfish-fly-csv-v4.ts
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
import { decodeCsvField, encodeCsvField, parsePipeList, splitCsvLine } from "./lib/seasonalMatrixV4/csv.ts";
import { validateSeasonalRowV4 } from "./lib/seasonalMatrixV4/validateSeasonalRowV4.ts";

const FILES = [
  "data/seasonal-matrix/largemouth_bass.csv",
  "data/seasonal-matrix/smallmouth_bass.csv",
] as const;

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
  if (fields.length !== 17) {
    throw new Error(`Line ${lineNo}: expected 17 columns, got ${fields.length}`);
  }
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
  if (!(RECOMMENDER_V4_SPECIES as readonly string[]).includes(species)) {
    throw new Error(`Line ${lineNo}: invalid species`);
  }
  if (!isRegionKey(regionRaw)) throw new Error(`Line ${lineNo}: bad region`);
  const region_key = regionRaw as RegionKey;
  const month = Number(monthRaw);
  const water_type = waterRaw as EngineContext;
  const state_trim = stateRaw.trim();
  const state_code = state_trim.length ? state_trim.toUpperCase() : undefined;
  const column_range = parsePipeList(colRangeRaw).map(assertCol);
  const column_baseline = assertCol(colBaseRaw.trim());
  const pace_range = parsePipeList(paceRangeRaw).map(assertPace);
  const pace_baseline = assertPace(paceBaseRaw.trim());
  const primary_forage = assertForage(priForRaw.trim());
  const secondary_forage = secForRaw.trim()
    ? assertForage(secForRaw.trim())
    : undefined;
  const surface_seasonally_possible = surfRaw === "true";
  const primary_lure_ids = parsePipeList(lureRaw) as LureArchetypeIdV4[];
  let primary_fly_ids = parsePipeList(flyRaw) as FlyArchetypeIdV4[];
  const excluded_lure_ids = parsePipeList(exLureRaw) as LureArchetypeIdV4[];
  const excluded_fly_ids = parsePipeList(exFlyRaw) as FlyArchetypeIdV4[];

  if (water_type === "freshwater_lake_pond") {
    primary_fly_ids = primary_fly_ids.filter((id) => id !== "crawfish_streamer");
  }

  const row: SeasonalRowV4 = {
    species,
    region_key,
    month,
    water_type,
    state_code,
    column_range,
    column_baseline,
    pace_range,
    pace_baseline,
    primary_forage,
    secondary_forage,
    surface_seasonally_possible,
    primary_lure_ids,
    primary_fly_ids,
    excluded_lure_ids: excluded_lure_ids.length ? excluded_lure_ids : undefined,
    excluded_fly_ids: excluded_fly_ids.length ? excluded_fly_ids : undefined,
  };
  return row;
}

function matchesRowFly(
  id: FlyArchetypeIdV4,
  species: RecommenderV4Species,
  waterType: EngineContext,
  columnRange: readonly TacticalColumn[],
  paceRange: readonly TacticalPace[],
): boolean {
  const a = FLY_ARCHETYPES_V4.find((x) => x.id === id);
  if (!a) return false;
  if (!a.species_allowed.includes(species)) return false;
  if (!a.water_types_allowed.includes(waterType)) return false;
  if (!columnRange.includes(a.column)) return false;
  return (
    paceRange.includes(a.primary_pace) ||
    (a.secondary_pace != null && paceRange.includes(a.secondary_pace))
  );
}

function padFlyPrimariesForG1(row: SeasonalRowV4): FlyArchetypeIdV4[] {
  const minCount =
    row.species === "trout" &&
    row.water_type === "freshwater_river" &&
    [12, 1, 2].includes(row.month)
      ? 2
      : 3;
  const minForage =
    row.species === "trout" &&
    row.water_type === "freshwater_river" &&
    [12, 1, 2].includes(row.month)
      ? 1
      : 2;

  const allowed = [row.primary_forage, row.secondary_forage].filter(Boolean) as ForageBucket[];
  const forageHits = (ids: readonly FlyArchetypeIdV4[]) =>
    ids.filter((id) => {
      const a = FLY_ARCHETYPES_V4.find((x) => x.id === id);
      return a && a.forage_tags.some((t) => allowed.includes(t));
    }).length;

  let ids = [...row.primary_fly_ids];
  const tryAdd = (): boolean => {
    for (const a of FLY_ARCHETYPES_V4) {
      if (ids.length >= 8) return false;
      const fid = a.id as FlyArchetypeIdV4;
      if (ids.includes(fid)) continue;
      if (
        !matchesRowFly(fid, row.species, row.water_type, row.column_range, row.pace_range)
      ) {
        continue;
      }
      if (!a.forage_tags.some((t) => allowed.includes(t))) continue;
      ids.push(fid);
      return true;
    }
    return false;
  };

  while (ids.length < minCount) {
    if (!tryAdd()) break;
  }
  while (forageHits(ids) < minForage && ids.length < 8) {
    if (!tryAdd()) break;
  }

  return ids.slice(0, 8);
}

function rowToFields(row: SeasonalRowV4, notes: string): string[] {
  return [
    row.species,
    row.region_key,
    String(row.month),
    row.water_type,
    row.state_code ?? "",
    row.column_range.join("|"),
    row.column_baseline,
    row.pace_range.join("|"),
    row.pace_baseline,
    row.primary_forage,
    row.secondary_forage ?? "",
    String(row.surface_seasonally_possible),
    row.primary_lure_ids.join("|"),
    row.primary_fly_ids.join("|"),
    (row.excluded_lure_ids ?? []).join("|"),
    (row.excluded_fly_ids ?? []).join("|"),
    notes,
  ];
}

async function processFile(path: string) {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = lines[0]!;
  const out: string[] = [header];
  let changed = 0;
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i]!;
    const fields = splitCsvLine(raw).map(decodeCsvField);
    const water = fields[3];
    let notes = fields[16] ?? "";
    if (water === "freshwater_lake_pond") {
      const before = fields[13] ?? "";
      if (before.includes("crawfish_streamer")) {
        let baseRow = rowFromFields(fields, i + 1);
        let padded = padFlyPrimariesForG1(baseRow);
        let newRow: SeasonalRowV4 = { ...baseRow, primary_fly_ids: padded };
        let diags = validateSeasonalRowV4(newRow);
        let errs = diags.filter((d) => d.level === "DATA_QUALITY_ERROR");
        let forageNote = "";
        if (
          errs.some((e) => e.message.includes("primary-fly-forage-coverage")) &&
          baseRow.primary_forage === "crawfish"
        ) {
          newRow = {
            ...newRow,
            primary_forage: "baitfish",
          };
          forageNote =
            " primary_forage crawfish→baitfish on lake row: Appendix A §22.2 has no crawfish-tagged fly with stillwater water_types_allowed (crawfish_streamer is R-only); G1 fly-forage coverage cannot be met otherwise.";
          diags = validateSeasonalRowV4(newRow);
          errs = diags.filter((d) => d.level === "DATA_QUALITY_ERROR");
        }
        if (errs.length) {
          throw new Error(
            `${path} line ${i + 1}: after remediation still invalid:\n${errs.map((e) => e.message).join("\n")}`,
          );
        }
        const suffix =
          " Remediation 2026-04-18: removed river-only crawfish_streamer from lake primary_fly_ids per Appendix A §22.2; padded primaries for G1." +
          forageNote;
        notes = (notes + suffix).trim();
        fields[9] = newRow.primary_forage;
        fields[13] = newRow.primary_fly_ids.join("|");
        fields[16] = notes;
        changed++;
      }
    }
    out.push(fields.map(encodeCsvField).join(","));
  }
  await Deno.writeTextFile(path, out.join("\n") + "\n");
  console.error(`${path}: updated ${changed} lake rows with crawfish_streamer removal/pad`);
}

async function main() {
  for (const f of FILES) {
    await processFile(f);
  }
}

main();
