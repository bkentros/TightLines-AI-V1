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
const searchFunctionSource = readFileSync('supabase/functions/waterbody-search/index.ts', 'utf8');

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
assert(contractSource.includes('legendEntries: WaterReaderProductionSvgLegendEntry[]'), 'app SVG contract should expose native legend entries');
assert(serverContractsSource.includes('water-reader-engine-v2-feature-envelope'), 'server read contract should use the feature-envelope cache version');
assert(cacheBuilderSource.includes('water-reader-engine-v2-feature-envelope'), 'cache builder should use the feature-envelope cache version');
const oldEngineVersionNeedle = ['water-reader-engine', 'v1'].join('-');
assert(!serverContractsSource.includes(oldEngineVersionNeedle), 'server read contract should not use v1 cache version');
assert(!cacheBuilderSource.includes(oldEngineVersionNeedle), 'cache builder should not use v1 cache version');
assert(contractSource.includes('sameNameStateCandidateCount'), 'search contract should expose same-name candidate count');
assert(contractSource.includes('isAmbiguousNameInState'), 'search contract should expose same-name ambiguity flag');
assert(!appSource.includes('buildWaterReaderEngineRead'), 'app screen should not import or call local engine read helper');
assert(!appSource.includes('fetchWaterbodyPolygon'), 'app screen should not fetch polygon before server read');
assert(appSource.includes('fetchWaterReaderRead({ lakeId })'), 'app screen should call server read after selection');
assert(serverSource.includes('get_waterbody_polygon_runtime_for_reader'), 'server read endpoint should use runtime-safe polygon RPC');
assert(serverSource.includes('water_reader_engine_read_cache'), 'server read endpoint should query cached reads');
assert(serverSource.includes('waterbody_index'), 'server read endpoint should use lightweight metadata before runtime polygon fetch');
assert(serverSource.indexOf('maybeSingle<CacheRow>()') < serverSource.indexOf('rpc("get_waterbody_polygon_runtime_for_reader"'), 'server read endpoint should check cache before runtime polygon fetch');
assert(serverSource.includes('buildServerWaterReaderRead'), 'server read endpoint should generate on cache miss');
assert(serverSource.includes('WATER_READER_HEAVY_GENERATOR_URL'), 'server read endpoint should route heavy rows to worker when configured');
assert(serverSource.includes('x-water-reader-internal-key'), 'server read endpoint should use internal key for diagnostics and worker auth');
assert(serverSource.includes('heavyRouteInfo'), 'server read endpoint should classify heavy rows structurally');
assert(serverSource.includes('.upsert({'), 'server read endpoint should write generated cache misses');
assert(!serverSource.includes('This Water Reader map is still being prepared.'), 'cache miss should no longer return preparing fallback');
assert(appSource.includes("r.hasPolygonGeometry && r.waterReaderSupportStatus !== 'not_supported'"), 'app should open every polygon-backed non-blocked support status');
assert(appSource.includes('same-name') && appSource.includes('compare county and acres'), 'app should surface duplicate-name disambiguation copy');
assert(serverSource.includes('cacheWriteStatus'), 'server read endpoint should report cache write status');
assert(searchFunctionSource.indexOf('const areaDelta') < searchFunctionSource.indexOf('a.originalIndex !== b.originalIndex'), 'same-name search acreage ordering should happen before original SQL order');
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
  edgeGeneratesOnCacheMiss: true,
  cacheMissFallback: false,
  serverSvgWidth: 420,
}));
