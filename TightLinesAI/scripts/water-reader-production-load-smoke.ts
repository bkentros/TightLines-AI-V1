import { createClient } from '@supabase/supabase-js';
import type { AddressInfo } from 'node:net';
import { startHeavyGeneratorServer } from './water-reader-heavy-generator-server.ts';
import type {
  WaterReaderHistoryResponse,
  WaterReaderReadResponse,
  WaterbodySearchResponse,
  WaterbodySearchResult,
} from '../lib/waterReaderContracts.ts';

const CURRENT_DATE = '2026-07-15T12:00:00.000Z';
const ENGINE_VERSION = 'water-reader-engine-v7-legend-guidance-copy';
const MAP_WIDTH = 420;
const DEFAULT_USERS = 3;
const READY_TARGETS = [
  { label: 'Van Norman Lake', state: 'MI', query: 'van norman' },
  { label: 'Glen Lake', state: 'MI', query: 'glen lake' },
];
const GUARD_HEAVY_TARGET = { label: 'Moosehead Lake', state: 'ME', query: 'moosehead' };
const GUARD_SECOND_TARGET = { label: 'Mullett Lake', state: 'MI', query: 'mullett' };
const SHARED_QUEUE_TARGET = { label: 'Lake Okeechobee', state: 'FL', query: 'okeechobee' };

type SmokeStatus = 'passed' | 'failed';

interface SmokeUser {
  email: string;
  password: string;
  userId: string;
  token: string;
}

interface StepResult {
  step: string;
  status: SmokeStatus;
  elapsedMs?: number;
  details: Record<string, unknown>;
}

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing required env: ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

async function invokeEdge<T>(params: {
  supabaseUrl: string;
  anonKey: string;
  token: string;
  functionName: string;
  body: Record<string, unknown>;
}): Promise<{ status: number; body: T | null; text: string; elapsedMs: number }> {
  const started = Date.now();
  const response = await fetch(`${params.supabaseUrl}/functions/v1/${params.functionName}`, {
    method: 'POST',
    headers: {
      apikey: params.anonKey,
      Authorization: `Bearer ${params.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params.body),
  });
  const elapsedMs = Date.now() - started;
  const text = await response.text();
  let body: T | null = null;
  try {
    body = text ? JSON.parse(text) as T : null;
  } catch {
    body = null;
  }
  return { status: response.status, body, text, elapsedMs };
}

async function createSmokeUsers(params: {
  admin: ReturnType<typeof createClient>;
  authClient: ReturnType<typeof createClient>;
  count: number;
}): Promise<SmokeUser[]> {
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const users: SmokeUser[] = [];
  for (let i = 0; i < params.count; i += 1) {
    const email = `water-reader-load-smoke-${stamp}-${i}@example.com`;
    const password = `WaterReaderSmoke!${stamp}!${i}`;
    const created = await params.admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (created.error || !created.data.user) {
      throw new Error(`create_smoke_user_failed:${created.error?.message ?? 'missing user'}`);
    }
    const userId = created.data.user.id;
    const profile = await params.admin.from('profiles').upsert({
      id: userId,
      username: `wr_load_${userId.slice(0, 8)}`,
      display_name: 'Water Reader Load Smoke',
      home_region: 'Smoke Test',
      home_state: 'MI',
      home_city: 'Smoke',
      fishing_mode: 'both',
      preferred_units: 'imperial',
      target_species: [],
      subscription_tier: 'master_angler',
      onboarding_complete: true,
    }, { onConflict: 'id' });
    if (profile.error) throw new Error(`profile_upsert_failed:${profile.error.message}`);

    const signedIn = await params.authClient.auth.signInWithPassword({ email, password });
    if (signedIn.error || !signedIn.data.session) {
      throw new Error(`sign_in_smoke_user_failed:${signedIn.error?.message ?? 'missing session'}`);
    }
    users.push({ email, password, userId, token: signedIn.data.session.access_token });
  }
  return users;
}

async function cleanupSmokeUsers(params: {
  admin: ReturnType<typeof createClient>;
  users: SmokeUser[];
}) {
  for (const user of params.users) {
    await params.admin.rpc('clear_water_reader_user_active_generation_request', {
      in_user_id: user.userId,
      in_generation_job_id: null,
      in_lake_id: null,
      in_season_context_key: null,
      in_map_width: null,
      in_engine_version: null,
    });
    await params.admin.from('water_reader_user_history').delete().eq('user_id', user.userId);
    await params.admin.auth.admin.deleteUser(user.userId);
  }
}

async function searchTarget(params: {
  supabaseUrl: string;
  anonKey: string;
  token: string;
  state: string;
  query: string;
  label: string;
}): Promise<WaterbodySearchResult> {
  const search = await invokeEdge<WaterbodySearchResponse>({
    supabaseUrl: params.supabaseUrl,
    anonKey: params.anonKey,
    token: params.token,
    functionName: 'waterbody-search',
    body: { state: params.state, query: params.query, limit: 8 },
  });
  const rows = search.body?.results ?? [];
  const target = rows.find((row) => row.name === params.label) ??
    rows.find((row) => row.hasPolygonGeometry && row.waterReaderSupportStatus !== 'not_supported');
  if (search.status !== 200 || !target) {
    throw new Error(`target_search_failed:${params.label}:status=${search.status}:body=${search.text.slice(0, 300)}`);
  }
  return target;
}

async function deleteCache(params: {
  admin: ReturnType<typeof createClient>;
  lakeId: string;
}) {
  const { error } = await params.admin
    .from('water_reader_engine_read_cache')
    .delete()
    .eq('lake_id', params.lakeId)
    .eq('map_width', MAP_WIDTH)
    .eq('engine_version', ENGINE_VERSION);
  if (error) throw new Error(`cache_delete_failed:${error.message}`);
}

async function ensureCachedViaLocalWorker(params: {
  workerUrl: string;
  internalKey: string;
  lakeId: string;
}) {
  const response = await fetch(`${params.workerUrl}/water-reader/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-water-reader-internal-key': params.internalKey,
    },
    body: JSON.stringify({
      lakeId: params.lakeId,
      currentDate: CURRENT_DATE,
      mapWidth: MAP_WIDTH,
      engineVersion: ENGINE_VERSION,
    }),
  });
  if (!response.ok) {
    throw new Error(`local_worker_generate_failed:${response.status}:${(await response.text()).slice(0, 300)}`);
  }
  const body = await response.json() as WaterReaderReadResponse;
  if (!body.productionSvgResult?.svg || body.cacheWriteStatus === 'failed') {
    throw new Error(`local_worker_generate_bad_read:${params.lakeId}`);
  }
}

async function drainLocalWorker(params: {
  workerUrl: string;
  internalKey: string;
  maxJobs: number;
}) {
  const response = await fetch(`${params.workerUrl}/water-reader/jobs/drain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-water-reader-internal-key': params.internalKey,
      'x-water-reader-worker-id': 'production-load-smoke-local-worker',
    },
    body: JSON.stringify({ maxJobs: params.maxJobs }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`local_worker_drain_failed:${response.status}:${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function isReadyRead(read: WaterReaderReadResponse | null): boolean {
  return Boolean(
    read?.generationStatus === 'ready' &&
      read?.engineVersion === ENGINE_VERSION &&
      read?.mapWidth === MAP_WIDTH &&
      read?.productionSvgResult?.svg &&
      read.displayedEntryCount > 0 &&
      read.fallbackMessage == null,
  );
}

function isBuildingBlock(read: WaterReaderReadResponse | null): boolean {
  return read?.operationalDiagnostics?.code === 'recent_water_read_building';
}

function isPendingRead(read: WaterReaderReadResponse | null): boolean {
  return read?.generationStatus === 'queued' || read?.generationStatus === 'processing';
}

async function pollHistoryReady(params: {
  supabaseUrl: string;
  anonKey: string;
  user: SmokeUser;
  lakeId: string;
  timeoutMs: number;
}): Promise<{ ready: boolean; elapsedMs: number; lastStatus: string | null }> {
  const started = Date.now();
  let lastStatus: string | null = null;
  while (Date.now() - started < params.timeoutMs) {
    const history = await invokeEdge<WaterReaderHistoryResponse>({
      supabaseUrl: params.supabaseUrl,
      anonKey: params.anonKey,
      token: params.user.token,
      functionName: 'water-reader-history',
      body: { limit: 10 },
    });
    const item = history.body?.items?.find((row) => row.lakeId === params.lakeId);
    lastStatus = item?.status ?? null;
    if (item?.status === 'ready') return { ready: true, elapsedMs: Date.now() - started, lastStatus };
    await sleep(3000);
  }
  return { ready: false, elapsedMs: Date.now() - started, lastStatus };
}

async function waitForActiveGuard(params: {
  admin: ReturnType<typeof createClient>;
  userId: string;
  timeoutMs: number;
}) {
  const started = Date.now();
  while (Date.now() - started < params.timeoutMs) {
    const active = await params.admin
      .from('water_reader_user_active_generation_requests')
      .select('generation_job_id,lake_id')
      .eq('user_id', params.userId)
      .maybeSingle();
    if (active.data?.generation_job_id) return active.data;
    await sleep(100);
  }
  return null;
}

async function main() {
  const env = requireEnv([
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'WATER_READER_INTERNAL_KEY',
  ]);
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL.replace(/\/$/, '');
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const admin = createClient(supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const userCount = Math.max(1, Math.min(8, Number(arg('--users') ?? process.env.WATER_READER_LOAD_SMOKE_USERS ?? DEFAULT_USERS)));
  const drainQueued = hasFlag('--drain-local') || process.env.WATER_READER_LOAD_SMOKE_DRAIN_LOCAL === '1';
  const queueWaitMs = Math.max(
    15000,
    Math.min(10 * 60 * 1000, Number(arg('--queue-wait-ms') ?? process.env.WATER_READER_LOAD_SMOKE_QUEUE_WAIT_MS ?? 120000)),
  );
  const results: StepResult[] = [];
  const server = startHeavyGeneratorServer(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as AddressInfo;
  const workerUrl = `http://127.0.0.1:${address.port}`;
  const users = await createSmokeUsers({ admin, authClient, count: userCount });

  try {
    const targetToken = users[0]!.token;
    const readyTargets = [];
    for (const target of READY_TARGETS) {
      readyTargets.push(await searchTarget({ supabaseUrl, anonKey, token: targetToken, ...target }));
    }
    const guardHeavyTarget = await searchTarget({ supabaseUrl, anonKey, token: targetToken, ...GUARD_HEAVY_TARGET });
    const guardSecondTarget = await searchTarget({ supabaseUrl, anonKey, token: targetToken, ...GUARD_SECOND_TARGET });
    const sharedQueueTarget = await searchTarget({ supabaseUrl, anonKey, token: targetToken, ...SHARED_QUEUE_TARGET });

    const cacheStart = Date.now();
    for (const target of readyTargets) {
      await ensureCachedViaLocalWorker({ workerUrl, internalKey: env.WATER_READER_INTERNAL_KEY, lakeId: target.lakeId });
    }
    results.push({
      step: 'prewarm cached targets',
      status: 'passed',
      elapsedMs: Date.now() - cacheStart,
      details: { targets: readyTargets.map((target) => target.name) },
    });

    const cachedStarted = Date.now();
    const cachedReads = await Promise.all(users.flatMap((user) =>
      readyTargets.map((target) =>
        invokeEdge<WaterReaderReadResponse>({
          supabaseUrl,
          anonKey,
          token: user.token,
          functionName: 'water-reader-read',
          body: { lakeId: target.lakeId, currentDate: CURRENT_DATE },
        }).then((read) => ({ user, target, read }))
      )
    ));
    const cachedFailures = cachedReads.filter((row) => row.read.status !== 200 || !isReadyRead(row.read.body));
    results.push({
      step: 'cached burst',
      status: cachedFailures.length === 0 ? 'passed' : 'failed',
      elapsedMs: Date.now() - cachedStarted,
      details: {
        requests: cachedReads.length,
        maxElapsedMs: Math.max(...cachedReads.map((row) => row.read.elapsedMs)),
        failures: cachedFailures.map((row) => ({
          target: row.target.name,
          status: row.read.status,
          elapsedMs: row.read.elapsedMs,
          generationStatus: row.read.body?.generationStatus ?? null,
          fallbackMessage: row.read.body?.fallbackMessage ?? null,
        })),
      },
    });

    const guardUser = users[0]!;
    await admin.rpc('clear_water_reader_user_active_generation_request', {
      in_user_id: guardUser.userId,
      in_generation_job_id: null,
      in_lake_id: null,
      in_season_context_key: null,
      in_map_width: null,
      in_engine_version: null,
    });
    await deleteCache({ admin, lakeId: guardHeavyTarget.lakeId });
    await deleteCache({ admin, lakeId: guardSecondTarget.lakeId });

    const guardStarted = Date.now();
    const firstPromise = invokeEdge<WaterReaderReadResponse>({
      supabaseUrl,
      anonKey,
      token: guardUser.token,
      functionName: 'water-reader-read',
      body: { lakeId: guardHeavyTarget.lakeId, currentDate: CURRENT_DATE },
    });
    const active = await waitForActiveGuard({ admin, userId: guardUser.userId, timeoutMs: 5000 });
    const second = await invokeEdge<WaterReaderReadResponse>({
      supabaseUrl,
      anonKey,
      token: guardUser.token,
      functionName: 'water-reader-read',
      body: { lakeId: guardSecondTarget.lakeId, currentDate: CURRENT_DATE },
    });
    const first = await firstPromise;
    results.push({
      step: 'same-user active guard',
      status: active && first.status === 200 && second.status === 200 && isBuildingBlock(second.body) ? 'passed' : 'failed',
      elapsedMs: Date.now() - guardStarted,
      details: {
        first: {
          target: guardHeavyTarget.name,
          status: first.status,
          elapsedMs: first.elapsedMs,
          generationStatus: first.body?.generationStatus ?? null,
          hasSvg: Boolean(first.body?.productionSvgResult?.svg),
          fallbackMessage: first.body?.fallbackMessage ?? null,
          diagnostic: first.body?.operationalDiagnostics?.code ?? null,
        },
        activeGuardObserved: Boolean(active),
        second: {
          target: guardSecondTarget.name,
          status: second.status,
          elapsedMs: second.elapsedMs,
          diagnostic: second.body?.operationalDiagnostics?.code ?? null,
          fallbackMessage: second.body?.fallbackMessage ?? null,
        },
      },
    });

    await deleteCache({ admin, lakeId: sharedQueueTarget.lakeId });
    await Promise.all(users.map((user) =>
      admin.rpc('clear_water_reader_user_active_generation_request', {
        in_user_id: user.userId,
        in_generation_job_id: null,
        in_lake_id: null,
        in_season_context_key: null,
        in_map_width: null,
        in_engine_version: null,
      })
    ));

    const sharedStarted = Date.now();
    const sharedReads = await Promise.all(users.map((user) =>
      invokeEdge<WaterReaderReadResponse>({
        supabaseUrl,
        anonKey,
        token: user.token,
        functionName: 'water-reader-read',
        body: { lakeId: sharedQueueTarget.lakeId, currentDate: CURRENT_DATE },
      }).then((read) => ({ user, read }))
    ));
    const sharedAcceptable = sharedReads.every((row) =>
      row.read.status === 200 &&
      (isPendingRead(row.read.body) || isReadyRead(row.read.body))
    );
    const pendingShared = sharedReads.filter((row) => isPendingRead(row.read.body));
    let drainResult: unknown = null;
    if (pendingShared.length > 0 && drainQueued) {
      drainResult = await drainLocalWorker({
        workerUrl,
        internalKey: env.WATER_READER_INTERNAL_KEY,
        maxJobs: Math.max(3, users.length + 2),
      });
    }
    const historyPolls = await Promise.all(users.map((user) =>
      pollHistoryReady({
        supabaseUrl,
        anonKey,
        user,
        lakeId: sharedQueueTarget.lakeId,
        timeoutMs: queueWaitMs,
      })
    ));
    results.push({
      step: 'multi-user shared queued read',
      status: sharedAcceptable && (pendingShared.length === 0 || historyPolls.every((row) => row.ready)) ? 'passed' : 'failed',
      elapsedMs: Date.now() - sharedStarted,
      details: {
        target: sharedQueueTarget.name,
        users: users.length,
        responseStatuses: sharedReads.map((row) => ({
          httpStatus: row.read.status,
          elapsedMs: row.read.elapsedMs,
          generationStatus: row.read.body?.generationStatus ?? null,
          generationJobId: row.read.body?.generationJobId ?? null,
          cacheStatus: row.read.body?.cacheStatus ?? null,
          cacheWriteStatus: row.read.body?.cacheWriteStatus ?? null,
          hasSvg: Boolean(row.read.body?.productionSvgResult?.svg),
          diagnostic: row.read.body?.operationalDiagnostics?.code ?? null,
        })),
        pendingCount: pendingShared.length,
        drainQueued,
        drainResult,
        historyPolls,
      },
    });

    const activeRows = await admin
      .from('water_reader_user_active_generation_requests')
      .select('user_id,lake_id,generation_job_id')
      .in('user_id', users.map((user) => user.userId));
    results.push({
      step: 'active guard cleanup',
      status: (activeRows.data ?? []).length === 0 ? 'passed' : 'failed',
      details: {
        activeRows: activeRows.data ?? [],
        error: activeRows.error?.message ?? null,
      },
    });
  } finally {
    await cleanupSmokeUsers({ admin, users }).catch((error) => {
      results.push({
        step: 'cleanup smoke users',
        status: 'failed',
        details: { message: error instanceof Error ? error.message : String(error) },
      });
    });
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    host: new URL(supabaseUrl).host,
    users: userCount,
    drainLocal: drainQueued,
    queueWaitMs,
    status: results.every((row) => row.status === 'passed') ? 'passed' : 'failed',
    results,
  };
  console.log(JSON.stringify(payload, null, 2));
  if (payload.status !== 'passed') process.exit(1);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
