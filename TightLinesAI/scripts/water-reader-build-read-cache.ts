import { createClient } from '@supabase/supabase-js';
import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  detectWaterReaderFeatures,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
} from '../lib/water-reader-engine';
import { lookupWaterReaderSeason } from '../lib/water-reader-engine/seasons';
import {
  WATER_READER_READ_FEATURE,
  type WaterReaderReadResponse,
  type WaterbodyPreviewBbox,
  type WaterbodyType,
  type WaterReaderPolygonSupportStatus,
} from '../lib/waterReaderContracts';

const WATER_READER_APP_SVG_WIDTH = 420;
const WATER_READER_ENGINE_VERSION = 'water-reader-engine-v2-feature-envelope';
const BASELINE_9_LAKES: Array<{ label: string; query: string; county?: string }> = [
  { label: 'Torch Lake, MI', query: 'Torch Lake' },
  { label: 'Glen Lake, Leelanau County, MI', query: 'Glen Lake', county: 'Leelanau' },
  { label: 'Houghton Lake, MI', query: 'Houghton Lake' },
  { label: 'Higgins Lake, MI', query: 'Higgins Lake' },
  { label: 'Crystal Lake, Benzie County, MI', query: 'Crystal Lake', county: 'Benzie' },
  { label: 'Elk Lake, MI', query: 'Elk Lake' },
  { label: 'Burt Lake, MI', query: 'Burt Lake' },
  { label: 'Mullett Lake, MI', query: 'Mullett Lake' },
  { label: 'Lake Charlevoix, MI', query: 'Lake Charlevoix' },
];

interface SearchRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodyType;
  water_reader_support_status: WaterReaderPolygonSupportStatus;
}

interface PolygonRpcRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodyType | string;
  centroid_lat: number;
  centroid_lon: number;
  bbox_min_lon: number | null;
  bbox_min_lat: number | null;
  bbox_max_lon: number | null;
  bbox_max_lat: number | null;
  area_sq_m: number | null;
  area_acres: number | null;
  perimeter_m: number | null;
  geojson: unknown | null;
  geometry_is_valid: boolean;
  geometry_validity_detail: string | null;
  component_count: number;
  interior_ring_count: number;
  water_reader_support_status: WaterReaderPolygonSupportStatus;
  water_reader_support_reason: string;
  polygon_qa_flags: string[] | null;
}

interface BuildArgs {
  lakes: Array<{ label: string; query: string; county?: string }>;
  date: Date;
  upsert: boolean;
  state: string | null;
  baseline9: boolean;
}

function argValues(flag: string): string[] {
  const out: string[] = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === flag && argv[i + 1]) out.push(argv[i + 1]!);
  }
  return out;
}

function parseArgs(): BuildArgs {
  const lakeValues = argValues('--lake');
  const baseline9 = process.argv.includes('--baseline-9');
  const dateRaw = argValues('--date')[0] ?? new Date().toISOString().slice(0, 10);
  const date = new Date(`${dateRaw}T12:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid --date value: ${dateRaw}`);
  const lakes = baseline9
    ? BASELINE_9_LAKES
    : lakeValues.length > 0
      ? lakeValues.map((lake) => ({ label: lake, query: lake }))
      : ['Burt', 'Mullett'].map((lake) => ({ label: lake, query: lake }));
  return {
    lakes,
    date,
    upsert: process.argv.includes('--upsert'),
    state: argValues('--state')[0]?.trim().toUpperCase() ?? (baseline9 ? 'MI' : null),
    baseline9,
  };
}

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function mapPreviewBbox(row: PolygonRpcRow): WaterbodyPreviewBbox | null {
  const minLon = row.bbox_min_lon;
  const minLat = row.bbox_min_lat;
  const maxLon = row.bbox_max_lon;
  const maxLat = row.bbox_max_lat;
  if (
    typeof minLon !== 'number' ||
    typeof minLat !== 'number' ||
    typeof maxLon !== 'number' ||
    typeof maxLat !== 'number' ||
    !Number.isFinite(minLon) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLon) ||
    !Number.isFinite(maxLat) ||
    minLon >= maxLon ||
    minLat >= maxLat
  ) {
    return null;
  }
  return { minLon, minLat, maxLon, maxLat };
}

function buildSeasonContextKey(state: string, date: Date): string {
  // Full read/SVG cache remains season-context keyed because legend guidance and response text vary by season.
  // Zone geometry is intentionally season-invariant in the feature-envelope engine.
  const lookup = lookupWaterReaderSeason(state, date);
  if (!lookup) return 'group:unknown|season:summer|transition:none';
  const transitionKey = lookup.inTransitionWindow && lookup.transitionFrom && lookup.transitionTo
    ? `transition:${lookup.transitionFrom}->${lookup.transitionTo}`
    : 'transition:none';
  return `group:${lookup.seasonGroup}|season:${lookup.season}|${transitionKey}`;
}

function buildCachedRead(row: PolygonRpcRow, currentDate: Date): WaterReaderReadResponse {
  const input = {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    acreage: row.area_acres,
    geojson:
      row.geojson &&
        typeof row.geojson === 'object' &&
        'type' in row.geojson &&
        'coordinates' in row.geojson
        ? row.geojson as { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown }
        : null,
    currentDate,
  };

  const started = Date.now();
  const preprocessStarted = Date.now();
  const preprocess = preprocessWaterReaderGeometry(input);
  const featuresStarted = Date.now();
  const features = detectWaterReaderFeatures(preprocess, input);
  const zonesStarted = Date.now();
  const zoneResult = placeWaterReaderZones(preprocess, features, input, { allowUniversalFallback: false });
  const legendStarted = Date.now();
  const legend = buildWaterReaderLegend(zoneResult, { state: input.state, currentDate });
  const displayStarted = Date.now();
  const displayModel = buildWaterReaderDisplayModel(zoneResult, legend, {
    acreage: input.acreage,
    longestDimensionM: preprocess.metrics?.longestDimensionM,
  });
  const renderStarted = Date.now();
  const fallbackMessage =
    !input.geojson
      ? 'This waterbody does not have polygon geometry available for a Water Reader map yet.'
      : !row.geometry_is_valid
        ? 'This polygon needs geometry cleanup before Water Reader can draw a trustworthy structure map.'
        : row.water_reader_support_status === 'not_supported'
          ? row.water_reader_support_reason || 'This polygon is not supported for a Water Reader map yet.'
          : preprocess.supportStatus === 'not_supported'
            ? preprocess.supportReason || 'This polygon is not supported for a Water Reader map yet.'
            : !preprocess.primaryPolygon || !preprocess.metrics
              ? 'This polygon could not be projected into lake-space geometry for a trustworthy read.'
              : displayModel.displayedEntries.length === 0
                ? 'No trustworthy structure areas passed the geometry filters for this outline. Nothing was added to fill space.'
                : null;

  const productionSvgResult =
    !fallbackMessage && preprocess.primaryPolygon
      ? buildWaterReaderProductionSvg(displayModel, {
        lakePolygon: preprocess.primaryPolygon,
        title: row.name,
        subtitle: `Structure areas | ${zoneResult.season} legend guidance | polygon geometry`,
        mapWidth: WATER_READER_APP_SVG_WIDTH,
      })
      : null;
  const doneAt = Date.now();

  return {
    feature: WATER_READER_READ_FEATURE,
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    centroid: { lat: row.centroid_lat, lon: row.centroid_lon },
    bbox: mapPreviewBbox(row),
    areaSqM: row.area_sq_m,
    areaAcres: row.area_acres,
    perimeterM: row.perimeter_m,
    geometryIsValid: row.geometry_is_valid,
    geometryValidityDetail: row.geometry_validity_detail,
    componentCount: row.component_count,
    interiorRingCount: row.interior_ring_count,
    waterReaderSupportStatus: row.water_reader_support_status,
    waterReaderSupportReason: row.water_reader_support_reason,
    polygonQaFlags: row.polygon_qa_flags ?? [],
    engineSupportStatus: preprocess.supportStatus,
    engineSupportReason: preprocess.supportReason,
    displayedEntryCount: displayModel.displayedEntries.length,
    retainedEntryCount: displayModel.retainedEntries.length,
    rendererWarningCount: productionSvgResult?.summary.warningCount ?? 0,
    season: zoneResult.season,
    seasonGroup: zoneResult.seasonGroup,
    productionSvgResult,
    fallbackMessage,
    cacheStatus: 'hit',
    seasonContextKey: buildSeasonContextKey(row.state, currentDate),
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    timings: {
      fetchMs: 0,
      preprocessMs: featuresStarted - preprocessStarted,
      featuresMs: zonesStarted - featuresStarted,
      zonesMs: legendStarted - zonesStarted,
      legendMs: displayStarted - legendStarted,
      displayMs: renderStarted - displayStarted,
      renderMs: doneAt - renderStarted,
      totalMs: doneAt - started,
    },
  };
}

function legendTitleCounts(read: WaterReaderReadResponse): Record<string, number> {
  const svg = read.productionSvgResult?.svg ?? '';
  const counts: Record<string, number> = {};
  for (const match of svg.matchAll(/<g class="water-reader-display-legend-entry"[\s\S]*?<text[^>]*>([^<]+)<\/text>/g)) {
    const title = (match[1] ?? '').replace(/^\d+\.\s*/, '').trim();
    if (!title) continue;
    counts[title] = (counts[title] ?? 0) + 1;
  }
  return counts;
}

function maxRepeatedLegendTitle(read: WaterReaderReadResponse): { title: string | null; count: number } {
  const counts = legendTitleCounts(read);
  return Object.entries(counts).reduce(
    (best, [title, count]) => count > best.count ? { title, count } : best,
    { title: null as string | null, count: 0 },
  );
}

function reviewFlags(read: WaterReaderReadResponse): string[] {
  const repeated = maxRepeatedLegendTitle(read);
  return [
    read.fallbackMessage ? 'fallback_no_map' : null,
    read.displayedEntryCount === 0 ? 'zero_displayed_entries' : null,
    read.rendererWarningCount > 0 ? 'renderer_warnings' : null,
    read.retainedEntryCount > 0 ? 'retained_entries' : null,
    (read.productionSvgResult?.summary.calloutLabelCount ?? 0) === read.displayedEntryCount && read.displayedEntryCount > 0 ? 'all_labels_callouts' : null,
    repeated.count >= 4 ? `repeated_legend_title:${repeated.title}:${repeated.count}` : null,
    read.retainedEntryCount > 0 ? 'display_cap_pressure' : null,
  ].filter(Boolean) as string[];
}

async function main() {
  const args = parseArgs();
  const env = requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const outputs = [];
  for (const lake of args.lakes) {
    const { data: searchData, error: searchError } = await supabase.rpc('search_waterbodies', {
      query_text: lake.query,
      state_filter: args.state,
      result_limit: 10,
    });
    if (searchError) throw new Error(`search_waterbodies failed for ${lake.label}: ${searchError.message}`);
    const rows = Array.isArray(searchData) ? searchData as SearchRow[] : [];
    const selected =
      rows.find((row) =>
        row.name.toLowerCase() === lake.query.toLowerCase() &&
        (!lake.county || row.county?.toLowerCase() === lake.county.toLowerCase())
      ) ??
      rows.find((row) =>
        row.name.toLowerCase().includes(lake.query.toLowerCase()) &&
        (!lake.county || row.county?.toLowerCase() === lake.county.toLowerCase())
      ) ??
      rows[0];
    if (!selected) throw new Error(`No waterbody found for --lake "${lake.label}"`);

    const { data: polygonData, error: polygonError } = await supabase.rpc('get_waterbody_polygon_for_reader', {
      in_lake_id: selected.lake_id,
    });
    if (polygonError) throw new Error(`get_waterbody_polygon_for_reader failed for ${selected.name}: ${polygonError.message}`);
    const polygonRows = Array.isArray(polygonData) ? polygonData as PolygonRpcRow[] : [];
    const polygon = polygonRows[0];
    if (!polygon) throw new Error(`No polygon row found for ${selected.name} (${selected.lake_id})`);

    const read = buildCachedRead(polygon, args.date);
    const repeated = maxRepeatedLegendTitle(read);
    const flags = reviewFlags(read);
    const cacheRow = {
      lake_id: read.lakeId,
      season_context_key: read.seasonContextKey,
      map_width: WATER_READER_APP_SVG_WIDTH,
      engine_version: WATER_READER_ENGINE_VERSION,
      read_response: read,
      timings: read.timings ?? null,
      qa_flags: [...(polygon.polygon_qa_flags ?? []), ...flags],
    };

    if (args.upsert) {
      const { error: upsertError } = await supabase
        .from('water_reader_engine_read_cache')
        .upsert(cacheRow, {
          onConflict: 'lake_id,season_context_key,map_width,engine_version',
        });
      if (upsertError) throw new Error(`cache upsert failed for ${read.name}: ${upsertError.message}`);
    }

    outputs.push({
      requestedLake: lake.label,
      lake: read.name,
      lakeId: read.lakeId,
      selectedCounty: read.county,
      mode: args.upsert ? 'upserted' : 'dry-run',
      seasonContextKey: read.seasonContextKey,
      mapWidth: read.mapWidth,
      displayedEntryCount: read.displayedEntryCount,
      retainedEntryCount: read.retainedEntryCount,
      rendererWarningCount: read.rendererWarningCount,
      calloutLabelCount: read.productionSvgResult?.summary.calloutLabelCount ?? 0,
      svgViewBox: read.productionSvgResult?.summary.viewBox ?? null,
      fallback: read.fallbackMessage,
      repeatedLegendTitle: repeated.count >= 4 ? repeated : null,
      reviewFlags: flags,
      timings: read.timings,
    });
  }

  console.log(JSON.stringify({ ok: true, upsert: args.upsert, baseline9: args.baseline9, date: args.date.toISOString().slice(0, 10), results: outputs }, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
