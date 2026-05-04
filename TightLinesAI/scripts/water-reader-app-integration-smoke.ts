import { readFileSync } from 'fs';
import {
  WATER_READER_READ_FEATURE,
  type WaterReaderReadRequest,
  type WaterReaderReadResponse,
} from '../lib/waterReaderContracts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const appSource = readFileSync('app/water-reader.tsx', 'utf8');
const clientSource = readFileSync('lib/waterReader.ts', 'utf8');
const contractSource = readFileSync('lib/waterReaderContracts.ts', 'utf8');
const serverSource = readFileSync('supabase/functions/water-reader-read/index.ts', 'utf8');
const serverHelperSource = readFileSync('supabase/functions/_shared/waterReaderRead/buildRead.ts', 'utf8');
const serverContractsSource = readFileSync('supabase/functions/_shared/waterReaderRead/contracts.ts', 'utf8');
const cacheBuilderSource = readFileSync('scripts/water-reader-build-read-cache.ts', 'utf8');
const migrationSource = readFileSync('supabase/migrations/202605030001_water_reader_engine_read_cache.sql', 'utf8');

const requestShape: WaterReaderReadRequest = {
  lakeId: '00000000-0000-4000-8000-000000000001',
  currentDate: '2026-07-15T00:00:00.000Z',
};
const responseShape: Pick<WaterReaderReadResponse, 'feature' | 'productionSvgResult' | 'fallbackMessage'> = {
  feature: WATER_READER_READ_FEATURE,
  productionSvgResult: null,
  fallbackMessage: 'controlled fallback',
};

assert(requestShape.lakeId.length > 0, 'read request contract should include lakeId');
assert(responseShape.feature === 'water_reader_read_v1', 'read response feature marker should be stable');
assert(clientSource.includes('export async function fetchWaterReaderRead'), 'fetchWaterReaderRead should be exported');
assert(clientSource.includes('invokeEdgeFunction<WaterReaderReadResponse>("water-reader-read"'), 'client should call water-reader-read edge function');
assert(contractSource.includes('export interface WaterReaderReadResponse'), 'app read response contract should exist');
assert(!appSource.includes('buildWaterReaderEngineRead'), 'app screen should not import or call local engine read helper');
assert(!appSource.includes('fetchWaterbodyPolygon'), 'app screen should not fetch polygon before server read');
assert(appSource.includes('fetchWaterReaderRead({ lakeId })'), 'app screen should call server read after selection');
assert(serverSource.includes('get_waterbody_polygon_for_reader'), 'server read endpoint should use existing polygon RPC');
assert(serverSource.includes('water_reader_engine_read_cache'), 'server read endpoint should query cached reads');
assert(!serverSource.includes('detectWaterReaderFeatures'), 'server read endpoint should not live-compute features');
assert(!serverSource.includes('placeWaterReaderZones'), 'server read endpoint should not live-compute zones');
assert(!serverSource.includes('buildWaterReaderProductionSvg'), 'server read endpoint should not live-render SVG');
assert(serverSource.includes('This Water Reader map is still being prepared.'), 'cache miss should return controlled preparing fallback');
assert(cacheBuilderSource.includes('allowUniversalFallback: false'), 'cache builder should explicitly disable universal fallback');
assert(serverHelperSource.includes('allowUniversalFallback: false'), 'shared read generator should explicitly disable universal fallback');
assert(!serverHelperSource.includes(`allowUniversalFallback: ${String(true)}`), 'server read helper should never enable universal fallback');
assert(!cacheBuilderSource.includes(`allowUniversalFallback: ${String(true)}`), 'cache builder should never enable universal fallback');
assert(cacheBuilderSource.includes('mapWidth: WATER_READER_APP_SVG_WIDTH'), 'cache builder should use app SVG width constant');
assert(serverHelperSource.includes('mapWidth: WATER_READER_APP_SVG_WIDTH'), 'shared read generator should use app SVG width constant');
assert(serverContractsSource.includes('WATER_READER_APP_SVG_WIDTH = 420'), 'server app SVG width should be 420');
assert(migrationSource.includes('water_reader_engine_read_cache'), 'cache table migration should exist');
assert(migrationSource.includes('primary key (lake_id, season_context_key, map_width, engine_version)'), 'cache table should prevent duplicate cache keys');

console.log(JSON.stringify({
  ok: true,
  feature: WATER_READER_READ_FEATURE,
  fetchWaterReaderRead: 'exported',
  appUsesServerRead: true,
  edgeLiveCompute: false,
  cacheMissFallback: true,
  serverSvgWidth: 420,
}));
