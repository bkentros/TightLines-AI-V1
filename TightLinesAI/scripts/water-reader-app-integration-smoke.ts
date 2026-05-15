import { readFileSync } from 'fs';
import {
  WATER_READER_READ_FEATURE,
  type WaterReaderReadRequest,
  type WaterReaderReadResponse,
} from '../lib/waterReaderContracts';
import {
  pickLegendBody,
  waterReaderLegendTemplateQualityReport,
} from '../lib/waterReaderLegendTemplates';
import { paperifyWaterReaderSvg } from '../lib/water-reader-paperify-svg';

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
const queueMigrationSource = readFileSync('supabase/migrations/20260515120000_water_reader_generation_queue_history.sql', 'utf8');
const searchFunctionSource = readFileSync('supabase/functions/waterbody-search/index.ts', 'utf8');
const aliasSeedMigrationSource = readFileSync('supabase/migrations/20260507211500_seed_waterbody_search_aliases.sql', 'utf8');
const sharedStatesMigrationSource = readFileSync('supabase/migrations/20260507214500_waterbody_shared_states.sql', 'utf8');

const requestShape: WaterReaderReadRequest = {
  lakeId: '00000000-0000-4000-8000-000000000001',
  currentDate: '2026-07-15T00:00:00.000Z',
};
const responseShape: Pick<WaterReaderReadResponse, 'feature' | 'productionSvgResult' | 'fallbackMessage'> = {
  feature: WATER_READER_READ_FEATURE,
  productionSvgResult: null,
  fallbackMessage: 'controlled fallback',
};
const pendingResponseShape: Pick<WaterReaderReadResponse, 'feature' | 'productionSvgResult' | 'fallbackMessage' | 'generationStatus' | 'generationJobId' | 'retryAfterMs'> = {
  feature: WATER_READER_READ_FEATURE,
  productionSvgResult: null,
  fallbackMessage: null,
  generationStatus: 'queued',
  generationJobId: '00000000-0000-4000-8000-000000000002',
  retryAfterMs: 4000,
};
const leaderPaperifyFixture = `<svg viewBox="0 0 200 200"><defs></defs><path class="water-reader-label-leader" d="M 106.72 188.74 L 106.72 220.68" fill="none" stroke="#0F172A" stroke-width="1" stroke-opacity="0.5" stroke-linecap="round"/></svg>`;
const paperifiedLeaderFixture = paperifyWaterReaderSvg(leaderPaperifyFixture).svg;
const legendCopyQuality = waterReaderLegendTemplateQualityReport();
const pointCoveConfluenceFixture = pickLegendBody({
  featureClass: 'structure_confluence',
  featureClasses: ['main_lake_point', 'cove'],
  season: 'fall',
  zoneId: 'confluence-fixture',
  zoneIds: ['point-1', 'cove-1'],
  title: 'Point + Cove - Structure Area',
  placementKinds: ['main_point_structure_area', 'cove_structure_area'],
});
const islandSaddleConfluenceFixture = pickLegendBody({
  featureClass: 'structure_confluence',
  featureClasses: ['island', 'saddle'],
  season: 'summer',
  zoneId: 'island-saddle-fixture',
  zoneIds: ['island-1', 'saddle-1'],
  title: 'Island + Saddle - Structure Area',
  placementKinds: ['island_structure_area', 'saddle_structure_area'],
});

assert(requestShape.lakeId.length > 0, 'read request contract should include lakeId');
assert(responseShape.feature === 'water_reader_read_v1', 'read response feature marker should be stable');
assert(pendingResponseShape.generationStatus === 'queued' && pendingResponseShape.productionSvgResult === null, 'pending read response contract should be representable');
assert(legendCopyQuality.ok, `legend guide copy should stay compact/public: ${JSON.stringify(legendCopyQuality.issues.slice(0, 5))}`);
assert(legendCopyQuality.checked > 500, 'legend guide copy should cover a deep standalone and confluence template pool');
assert(pointCoveConfluenceFixture.toLowerCase().includes('mouth') || pointCoveConfluenceFixture.toLowerCase().includes('cove'), 'point+cove confluence should use mouth/cove-specific guidance');
assert(islandSaddleConfluenceFixture.toLowerCase().includes('island') || islandSaddleConfluenceFixture.toLowerCase().includes('saddle'), 'island+saddle confluence should use member-specific guidance');
assert(!paperifiedLeaderFixture.includes('round"/ stroke-dasharray'), 'paperifier should not insert leader dash attributes after a self-closing slash');
assert(paperifiedLeaderFixture.includes('stroke-linecap="round" stroke-dasharray="4 3"/>'), 'paperifier should insert leader dash attributes before the self-closing slash');
assert(clientSource.includes('export async function fetchWaterReaderRead'), 'fetchWaterReaderRead should be exported');
assert(clientSource.includes('invokeEdgeFunction<WaterReaderReadResponse>("water-reader-read"'), 'client should call water-reader-read edge function');
assert(contractSource.includes('export interface WaterReaderReadResponse'), 'app read response contract should exist');
assert(contractSource.includes('generationStatus?: WaterReaderGenerationStatus'), 'app read response should expose generation status');
assert(contractSource.includes('generationJobId?: string | null'), 'app read response should expose generation job id');
assert(contractSource.includes('retryAfterMs?: number | null'), 'app read response should expose retry-after polling hint');
assert(contractSource.includes('legendEntries: WaterReaderProductionSvgLegendEntry[]'), 'app SVG contract should expose native legend entries');
assert(contractSource.includes('featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass'), 'app legend entries should expose confluence member feature classes');
// v6 keeps the dashboard-native renderer and refreshes the server-supplied
// legend copy. Bumping the constant intentionally invalidates older cached
// read rows. If renderer output, palette, or server read copy changes again,
// bump this string and the constants in the engine contracts + cache builder
// in the same change.
assert(serverContractsSource.includes('water-reader-engine-v6-conservative-copy'), 'server read contract should use the v6 conservative-copy cache version');
assert(cacheBuilderSource.includes('water-reader-engine-v6-conservative-copy'), 'cache builder should use the v6 conservative-copy cache version');
const oldEngineVersionNeedle = ['water-reader-engine', 'v1'].join('-');
assert(!serverContractsSource.includes(oldEngineVersionNeedle), 'server read contract should not use v1 cache version');
assert(!cacheBuilderSource.includes(oldEngineVersionNeedle), 'cache builder should not use v1 cache version');
// Defensive: ensure neither side accidentally still pins the previous v3
// launch cache version after a paper-redesign rebase.
const previousLaunchVersion = 'water-reader-engine-v3-live-final';
assert(!serverContractsSource.includes(previousLaunchVersion), 'server read contract should not still pin the v3 launch cache version');
assert(!cacheBuilderSource.includes(previousLaunchVersion), 'cache builder should not still pin the v3 launch cache version');
assert(contractSource.includes('sameNameStateCandidateCount'), 'search contract should expose same-name candidate count');
assert(contractSource.includes('isAmbiguousNameInState'), 'search contract should expose same-name ambiguity flag');
assert(!appSource.includes('buildWaterReaderEngineRead'), 'app screen should not import or call local engine read helper');
assert(!appSource.includes('fetchWaterbodyPolygon'), 'app screen should not fetch polygon before server read');
assert(appSource.includes('fetchWaterReaderRead({ lakeId })'), 'app screen should call server read after selection');
assert(serverSource.includes('get_waterbody_polygon_runtime_for_reader'), 'server read endpoint should use runtime-safe polygon RPC');
assert(serverSource.includes('water_reader_engine_read_cache'), 'server read endpoint should query cached reads');
assert(serverSource.includes('ensure_water_reader_generation_job'), 'server read endpoint should ensure a queue job on cache miss');
assert(serverSource.includes('water_reader_user_history'), 'server read endpoint should record user history rows');
assert(serverSource.includes('pendingReadResponse'), 'server read endpoint should return a pending contract on queued cache miss');
assert(serverSource.includes('waterbody_index'), 'server read endpoint should use lightweight metadata before runtime polygon fetch');
assert(serverSource.indexOf('maybeSingle<CacheRow>()') < serverSource.indexOf('rpc("get_waterbody_polygon_runtime_for_reader"'), 'server read endpoint should check cache before runtime polygon fetch');
assert(serverSource.includes('buildServerWaterReaderRead'), 'server read endpoint should generate on cache miss');
assert(serverSource.includes('WATER_READER_HEAVY_GENERATOR_URL'), 'server read endpoint should route heavy rows to worker when configured');
assert(serverSource.includes('x-water-reader-internal-key'), 'server read endpoint should use internal key for diagnostics and worker auth');
assert(serverSource.includes('heavyRouteInfo'), 'server read endpoint should classify heavy rows structurally');
assert(serverSource.includes('routeAllCacheMissesThroughHeavyWorker'), 'server read endpoint should route configured cache misses through the worker');
assert(serverSource.includes('EDGE_INLINE_RUNTIME_VERTEX_LIMIT = 4500'), 'server read endpoint should route Pontiac-class runtime vertex counts away from the edge worker');
assert(serverSource.includes('EDGE_INLINE_INTERIOR_RING_LIMIT = 18'), 'server read endpoint should route island-hole-heavy polygons away from the edge worker');
assert(serverSource.includes('EDGE_INLINE_RUNTIME_GEOJSON_BYTE_LIMIT = 100000'), 'server read endpoint should route large runtime payloads away from the edge worker');
assert(serverSource.includes('edge_runtime_complexity_score'), 'server read endpoint should diagnose combined edge runtime complexity routing');
assert(serverSource.includes('WATER_READER_ALLOW_EDGE_HEAVY_FALLBACK'), 'server read endpoint should require explicit opt-in before heavy local fallback');
assert(serverSource.includes('.upsert({'), 'server read endpoint should write generated cache misses');
assert(!serverSource.includes('This Water Reader map is still being prepared.'), 'cache miss should no longer return preparing fallback');
assert(appSource.includes("status: 'preparing'"), 'app read state should recognize pending generation');
assert(appSource.includes('WATER_READER_PENDING_MAX_MS'), 'app polling should have a max duration guard');
assert(appSource.includes('pendingRetryDelayMs'), 'app polling should respect retryAfterMs with bounds');
assert(appSource.includes('generationStatus') && appSource.includes("'queued'") && appSource.includes("'processing'"), 'app should poll queued/processing reads');
assert(appSource.includes("r.hasPolygonGeometry && r.waterReaderSupportStatus !== 'not_supported'"), 'app should open every polygon-backed non-blocked support status');
assert(appSource.includes('same-name') && appSource.includes('compare county and acres'), 'app should surface duplicate-name disambiguation copy');
assert(appSource.includes('const SEARCH_RESULT_LIMIT = 20'), 'app search should request enough candidates for same-name lake discovery');
assert(appSource.includes('nestedScrollEnabled') && appSource.includes('dropdownListContent'), 'app search dropdown should be independently scrollable');
assert(appSource.includes('CountyFilterChip') && appSource.includes('countyFilter'), 'app search should expose county chips for dense same-name results');
assert(appSource.includes("water-reader-pontiac-sample.png"), 'idle preview should use a bundled static Water Read sample image');
assert(!appSource.includes("const PREVIEW_LAKE_QUERY = 'Pontiac'"), 'idle preview should not fetch Pontiac on mount');
assert(serverSource.includes('cacheWriteStatus'), 'server read endpoint should report cache write status');
assert(searchFunctionSource.includes('CURATED_3DHP_ALIASES') && searchFunctionSource.includes('Lake Fork Reservoir'), 'search fallback should preserve curated aliases for unlabeled 3DHP polygons');
assert(searchFunctionSource.includes('waterbody_shared_states!inner') && searchFunctionSource.includes('search telemetry'), 'search edge should log weak searches and handle database-backed shared-state aliases');
assert(searchFunctionSource.includes('shown for ${displayState}') && searchFunctionSource.includes('indexed_state:'), 'shared-state aliases should preserve the user-selected state while tracking stored polygon state');
assert(aliasSeedMigrationSource.includes('Lake Lanier') && aliasSeedMigrationSource.includes('Toledo Bend'), 'launch alias seed migration should include high-value angler aliases');
assert(sharedStatesMigrationSource.includes('waterbody_shared_states') && sharedStatesMigrationSource.includes('Toledo Bend Reservoir'), 'shared-state migration should seed known border waters');
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
assert(queueMigrationSource.includes('water_reader_generation_jobs'), 'queue migration should create generation jobs table');
assert(queueMigrationSource.includes('water_reader_user_history'), 'queue migration should create user history table');
assert(queueMigrationSource.includes('unique (lake_id, season_context_key, map_width, engine_version)'), 'queue jobs should be unique by cache key');
assert(queueMigrationSource.includes('unique (user_id, lake_id, season_context_key, map_width, engine_version)'), 'history should be unique per user/cache key');
assert(queueMigrationSource.includes('for update skip locked'), 'claim RPC should atomically claim one job');
assert(queueMigrationSource.includes('mark_water_reader_generation_job_complete'), 'queue migration should include complete RPC');
assert(queueMigrationSource.includes('mark_water_reader_generation_job_failed'), 'queue migration should include failed/retry RPC');

console.log(JSON.stringify({
  ok: true,
  feature: WATER_READER_READ_FEATURE,
  fetchWaterReaderRead: 'exported',
  appUsesServerRead: true,
  serverHandlesCacheMiss: true,
  cacheMissFallback: false,
  serverSvgWidth: 420,
}));
