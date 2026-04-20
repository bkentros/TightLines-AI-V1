/**
 * §17.4 — Read `data/seasonal-matrix/*.csv`, validate §15.1, emit v4/generated/*.ts
 *
 * CSVs are the preferred seasonal authoring source (`data/seasonal-matrix/schema.md`).
 * Live edge recommender still uses legacy v3 embedded tables until engine cutover.
 *
 * Usage: deno run -A scripts/generate-seasonal-rows-v4.ts [--out-dir <path>]
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
import { decodeCsvField, parsePipeList, splitCsvLine } from "./lib/seasonalMatrixV4/csv.ts";
import { validateSeasonalRowV4 } from "./lib/seasonalMatrixV4/validateSeasonalRowV4.ts";

const SPECIES_FILES: Record<RecommenderV4Species, string> = {
  largemouth_bass: "largemouth_bass.csv",
  smallmouth_bass: "smallmouth_bass.csv",
  northern_pike: "northern_pike.csv",
  trout: "trout.csv",
};

const EXPORT_NAMES: Record<RecommenderV4Species, string> = {
  largemouth_bass: "LARGEMOUTH_BASS_SEASONAL_ROWS_V4",
  smallmouth_bass: "SMALLMOUTH_BASS_SEASONAL_ROWS_V4",
  northern_pike: "NORTHERN_PIKE_SEASONAL_ROWS_V4",
  trout: "TROUT_SEASONAL_ROWS_V4",
};

function parseArgs(): { outDir: string } {
  let outDir =
    "supabase/functions/_shared/recommenderEngine/v4/seasonal/generated";
  const argv = Deno.args;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out-dir" && argv[i + 1]) {
      outDir = argv[i + 1]!;
      i++;
    }
  }
  return { outDir };
}

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

function parseRow(
  fields: string[],
  lineNo: number,
): { row: SeasonalRowV4; authoringNotes: string } {
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
    throw new Error(`Line ${lineNo}: invalid species ${species}`);
  }
  if (!isRegionKey(regionRaw)) {
    throw new Error(`Line ${lineNo}: invalid region_key ${regionRaw}`);
  }
  const region_key = regionRaw as RegionKey;
  const month = Number(monthRaw);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Line ${lineNo}: invalid month ${monthRaw}`);
  }
  if (waterRaw !== "freshwater_lake_pond" && waterRaw !== "freshwater_river") {
    throw new Error(`Line ${lineNo}: invalid water_type ${waterRaw}`);
  }
  const water_type = waterRaw as EngineContext;
  if (species === "trout" && water_type !== "freshwater_river") {
    throw new Error(`Line ${lineNo}: trout must use freshwater_river (P26)`);
  }

  const state_trim = stateRaw.trim();
  const state_code = state_trim.length ? state_trim.toUpperCase() : undefined;
  if (state_code && state_code.length !== 2) {
    throw new Error(`Line ${lineNo}: state_code must be 2 letters or empty`);
  }

  const column_range = parsePipeList(colRangeRaw).map(assertCol);
  const column_baseline = assertCol(colBaseRaw.trim());
  const pace_range = parsePipeList(paceRangeRaw).map(assertPace);
  const pace_baseline = assertPace(paceBaseRaw.trim());
  const primary_forage = assertForage(priForRaw.trim());
  const secondary_forage = secForRaw.trim()
    ? assertForage(secForRaw.trim())
    : undefined;

  if (surfRaw !== "true" && surfRaw !== "false") {
    throw new Error(`Line ${lineNo}: surface_seasonally_possible must be true|false`);
  }
  const surface_seasonally_possible = surfRaw === "true";

  const primary_lure_ids = parsePipeList(lureRaw) as LureArchetypeIdV4[];
  const primary_fly_ids = parsePipeList(flyRaw) as FlyArchetypeIdV4[];
  const excluded_lure_ids = parsePipeList(exLureRaw) as LureArchetypeIdV4[];
  const excluded_fly_ids = parsePipeList(exFlyRaw) as FlyArchetypeIdV4[];

  const authoringNotes = fields[16] ?? "";

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
  return { row, authoringNotes };
}

function serializeRowTs(row: SeasonalRowV4, indent: string): string {
  const exL = row.excluded_lure_ids?.length
    ? `,\n${indent}excluded_lure_ids: ${JSON.stringify([...row.excluded_lure_ids])} as const`
    : "";
  const exF = row.excluded_fly_ids?.length
    ? `,\n${indent}excluded_fly_ids: ${JSON.stringify([...row.excluded_fly_ids])} as const`
    : "";
  const st = row.state_code
    ? `,\n${indent}state_code: ${JSON.stringify(row.state_code)}`
    : "";
  const sec = row.secondary_forage
    ? `,\n${indent}secondary_forage: ${JSON.stringify(row.secondary_forage)}`
    : "";

  return `{
${indent}species: ${JSON.stringify(row.species)},
${indent}region_key: ${JSON.stringify(row.region_key)},
${indent}month: ${row.month},
${indent}water_type: ${JSON.stringify(row.water_type)}${st},
${indent}column_range: ${JSON.stringify([...row.column_range])} as const,
${indent}column_baseline: ${JSON.stringify(row.column_baseline)},
${indent}pace_range: ${JSON.stringify([...row.pace_range])} as const,
${indent}pace_baseline: ${JSON.stringify(row.pace_baseline)},
${indent}primary_forage: ${JSON.stringify(row.primary_forage)}${sec},
${indent}surface_seasonally_possible: ${row.surface_seasonally_possible},
${indent}primary_lure_ids: ${JSON.stringify([...row.primary_lure_ids])} as const,
${indent}primary_fly_ids: ${JSON.stringify([...row.primary_fly_ids])} as const${exL}${exF},
}`;
}

const G8_NOTE_SUPPRESS = "G8 §15.1 PO-reviewed 2026-04-18";

async function parseCsv(
  path: string,
): Promise<{ row: SeasonalRowV4; authoringNotes: string }[]> {
  const text = await Deno.readTextFile(path);
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error(`${path}: empty CSV`);
  const out: { row: SeasonalRowV4; authoringNotes: string }[] = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i]!;
    const fields = splitCsvLine(raw).map(decodeCsvField);
    out.push(parseRow(fields, i + 1));
  }
  return out;
}

const BANNER = `// ┌────────────────────────────────────────────────────────────┐
// │ GENERATED FILE — DO NOT EDIT BY HAND                       │
// │ Source: data/seasonal-matrix/{species}.csv                 │
// │ Regenerate: npm run gen:seasonal-rows-v4                   │
// └────────────────────────────────────────────────────────────┘
`;

async function main() {
  const { outDir } = parseArgs();
  await Deno.mkdir(outDir, { recursive: true });

  let warnCount = 0;

  for (const species of RECOMMENDER_V4_SPECIES) {
    const csvPath = `data/seasonal-matrix/${SPECIES_FILES[species]}`;
    const parsed = await parseCsv(csvPath);
    for (const { row, authoringNotes } of parsed) {
      const diags = validateSeasonalRowV4(row);
      const suppressG8 = authoringNotes.includes(G8_NOTE_SUPPRESS);
      for (const d of diags) {
        if (d.level === "DATA_QUALITY_ERROR") {
          console.error(d.message);
          Deno.exit(1);
        }
        if (
          suppressG8 &&
          d.level === "DATA_QUALITY_WARN" &&
          d.message.includes("[G8]")
        ) {
          continue;
        }
        console.warn(d.message);
        warnCount++;
      }
    }

    const exportName = EXPORT_NAMES[species];
    const body = parsed
      .map(({ row }) => serializeRowTs(row, "    "))
      .join(",\n\n  ");

    const ts =
      `${BANNER}
import type { SeasonalRowV4 } from "../../contracts.ts";

export const ${exportName}: readonly SeasonalRowV4[] = [\n  ${body}\n] as const;
`;
    await Deno.writeTextFile(`${outDir}/${species}.ts`, ts);
    console.error(`Wrote ${outDir}/${species}.ts (${parsed.length} rows)`);
  }

  console.error(`Done. DATA_QUALITY_WARN count: ${warnCount}`);
}

main();
