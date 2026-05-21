import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveServerSubscriptionTier } from "../_shared/appAccess.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";

const WATER_READER_HISTORY_FEATURE = "water_reader_history_v1" as const;
const WATER_READER_HISTORY_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 120 },
  { windowSeconds: 86400, maxRequests: 1500 },
];

type HistoryStatus = "preparing" | "ready" | "failed";
type JobStatus = "queued" | "processing" | "complete" | "failed";
type DerivedStatus = "ready" | "building" | "failed";

interface HistoryRow {
  id: string;
  user_id: string;
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  generation_job_id: string | null;
  status: HistoryStatus;
  is_pinned?: boolean | null;
  last_viewed_at: string;
}

interface WaterbodyRow {
  id: string;
  canonical_name: string | null;
  state_code: string | null;
  county_name: string | null;
  surface_area_acres: number | string | null;
}

interface CacheRow {
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  generated_at: string;
}

interface GenerationJobRow {
  id: string;
  status: JobStatus;
  completed_at: string | null;
  updated_at: string | null;
  attempts?: number | null;
  max_attempts?: number | null;
  last_error?: string | null;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonError(message: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message }),
    { status, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

function clampLimit(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 10;
  return Math.max(1, Math.min(20, Math.floor(value)));
}

function cacheKey(row: {
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
}): string {
  return `${row.lake_id}:${row.season_context_key}:${row.map_width}:${row.engine_version}`;
}

function deriveStatus(params: {
  history: HistoryRow;
  cache: CacheRow | null;
  job: GenerationJobRow | null;
}): DerivedStatus {
  if (params.cache || params.job?.status === "complete") return "ready";
  if (params.job?.status === "failed" || params.history.status === "failed") return "failed";
  if (
    params.job?.status === "queued" ||
    params.job?.status === "processing" ||
    params.history.status === "preparing"
  ) {
    return "building";
  }
  return "ready";
}

function normalizeAreaAcres(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function runInBackground(promise: Promise<unknown>) {
  const edgeRuntime = (globalThis as unknown as {
    EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
  }).EdgeRuntime;
  if (typeof edgeRuntime?.waitUntil === "function") {
    edgeRuntime.waitUntil(promise);
    return;
  }
  promise.catch((error) => {
    console.error("[water-reader-history] background task failed", {
      message: error instanceof Error ? error.message : String(error),
    });
  });
}

async function kickGenerationWorker(params: {
  jobId: string;
  lakeId: string;
  seasonContextKey: string;
}) {
  const url = Deno.env.get("WATER_READER_HEAVY_GENERATOR_URL");
  const internalKey = Deno.env.get("WATER_READER_INTERNAL_KEY");
  if (!url || !internalKey) return;

  const endpoint = `${url.replace(/\/$/, "")}/water-reader/jobs/drain`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-water-reader-internal-key": internalKey,
      },
      body: JSON.stringify({ maxJobs: 1 }),
    });
    if (!response.ok) {
      const message = (await response.text()).slice(0, 500);
      console.error("[water-reader-history] worker kick failed", {
        jobId: params.jobId,
        lakeId: params.lakeId,
        seasonContextKey: params.seasonContextKey,
        status: response.status,
        message,
      });
    }
  } catch (error) {
    console.error("[water-reader-history] worker kick request failed", {
      jobId: params.jobId,
      lakeId: params.lakeId,
      seasonContextKey: params.seasonContextKey,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function clearActiveGenerationRequest(params: {
  supabase: any;
  userId: string;
  lakeId: string;
  seasonContextKey: string;
  mapWidth: number;
  engineVersion: string;
}) {
  const { error } = await params.supabase.rpc("clear_water_reader_user_active_generation_request", {
    in_user_id: params.userId,
    in_generation_job_id: null,
    in_lake_id: params.lakeId,
    in_season_context_key: params.seasonContextKey,
    in_map_width: params.mapWidth,
    in_engine_version: params.engineVersion,
  });
  if (error) {
    console.error("[water-reader-history] active generation request clear failed", {
      lakeId: params.lakeId,
      userId: params.userId,
      message: error.message,
    });
  }
}

async function fetchHistoryRows(params: {
  supabase: any;
  userId: string;
  limit: number;
  includePinned: boolean;
}): Promise<{ rows: HistoryRow[]; missingPinnedColumn: boolean }> {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const selectColumns = params.includePinned
    ? "id,user_id,lake_id,season_context_key,map_width,engine_version,generation_job_id,status,is_pinned,last_viewed_at"
    : "id,user_id,lake_id,season_context_key,map_width,engine_version,generation_job_id,status,last_viewed_at";
  let query = params.supabase
    .from("water_reader_user_history")
    .select(selectColumns)
    .eq("user_id", params.userId)
    .order("last_viewed_at", { ascending: false })
    .limit(params.limit);

  query = params.includePinned
    ? query.or(`last_viewed_at.gte.${cutoff},is_pinned.eq.true`)
    : query.gte("last_viewed_at", cutoff);

  const { data, error } = await query;
  if (!error) return { rows: (data ?? []) as HistoryRow[], missingPinnedColumn: false };
  if (params.includePinned && error.message.toLowerCase().includes("is_pinned")) {
    return { rows: [], missingPinnedColumn: true };
  }
  throw error;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ?? (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return jsonError("Missing authentication token", "unauthorized", 401);
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return jsonError("Unauthorized", "unauthorized", 401);
  }

  const rateLimit = await checkUserRateLimit(supabase, {
    userId: user.id,
    feature: "water_reader_history",
    rules: WATER_READER_HISTORY_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: string | null }>();
  const tier = resolveServerSubscriptionTier(
    profile?.subscription_tier,
    user.email,
  );
  if (tier === "free") {
    return jsonError("Subscribe to use this feature", "subscription_required", 403);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const limit = clampLimit(body.limit);

  let historyRows: HistoryRow[] = [];
  try {
    const first = await fetchHistoryRows({ supabase, userId: user.id, limit, includePinned: true });
    if (first.missingPinnedColumn) {
      const fallback = await fetchHistoryRows({ supabase, userId: user.id, limit, includePinned: false });
      historyRows = fallback.rows;
    } else {
      historyRows = first.rows;
    }
  } catch (error) {
    console.error("[water-reader-history] history lookup failed", {
      userId: user.id,
      message: error instanceof Error ? error.message : String(error),
    });
    return jsonError("Failed to load recent Water Reads", "water_reader_history_lookup_failed", 500);
  }

  if (historyRows.length === 0) {
    return new Response(
      JSON.stringify({ feature: WATER_READER_HISTORY_FEATURE, items: [] }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const lakeIds = Array.from(new Set(historyRows.map((row) => row.lake_id)));
  const jobIds = Array.from(
    new Set(historyRows.map((row) => row.generation_job_id).filter((id): id is string => Boolean(id))),
  );

  const metadataByLake = new Map<string, WaterbodyRow>();
  const cacheByKey = new Map<string, CacheRow>();
  const jobById = new Map<string, GenerationJobRow>();

  const { data: metadataRows, error: metadataError } = await supabase
    .from("waterbody_index")
    .select("id,canonical_name,state_code,county_name,surface_area_acres")
    .in("id", lakeIds);
  if (metadataError) {
    console.error("[water-reader-history] metadata lookup failed", {
      message: metadataError.message,
    });
    return jsonError("Failed to load recent Water Read metadata", "water_reader_history_metadata_failed", 500);
  }
  for (const row of (metadataRows ?? []) as WaterbodyRow[]) {
    metadataByLake.set(row.id, row);
  }

  const { data: cacheRows, error: cacheError } = await supabase
    .from("water_reader_engine_read_cache")
    .select("lake_id,season_context_key,map_width,engine_version,generated_at")
    .in("lake_id", lakeIds);
  if (cacheError) {
    console.error("[water-reader-history] cache lookup failed", {
      message: cacheError.message,
    });
    return jsonError("Failed to load recent Water Read status", "water_reader_history_cache_failed", 500);
  }
  for (const row of (cacheRows ?? []) as CacheRow[]) {
    cacheByKey.set(cacheKey(row), row);
  }

  if (jobIds.length > 0) {
    const { error: staleError } = await supabase.rpc("requeue_stale_water_reader_generation_jobs");
    if (staleError) {
      console.error("[water-reader-history] stale job watchdog failed", {
        message: staleError.message,
      });
    }

    const { data: jobRows, error: jobError } = await supabase
      .from("water_reader_generation_jobs")
      .select("id,status,completed_at,updated_at,attempts,max_attempts,last_error")
      .in("id", jobIds);
    if (jobError) {
      console.error("[water-reader-history] job lookup failed", {
        message: jobError.message,
      });
      return jsonError("Failed to load recent Water Read status", "water_reader_history_job_failed", 500);
    }
    for (const row of (jobRows ?? []) as GenerationJobRow[]) {
      jobById.set(row.id, row);
    }

    for (const row of (jobRows ?? []) as GenerationJobRow[]) {
      if (row.status !== "failed") continue;
      const { data: requeuedJob, error: requeueError } = await supabase.rpc(
        "requeue_water_reader_generation_job",
        {
          in_job_id: row.id,
          in_reason: row.last_error ?? "Retrying Water Reader generation from Recent Water Reads.",
        },
      );
      if (requeueError) {
        console.error("[water-reader-history] retryable failed job requeue failed", {
          jobId: row.id,
          message: requeueError.message,
        });
        continue;
      }
      const normalized = Array.isArray(requeuedJob) ? requeuedJob[0] : requeuedJob;
      if (normalized?.id) jobById.set(normalized.id, normalized as GenerationJobRow);
    }
  }

  const readyHistoryIds: string[] = [];
  const activeRequestsToClear: Array<{
    lakeId: string;
    seasonContextKey: string;
    mapWidth: number;
    engineVersion: string;
  }> = [];
  const queuedJobsToKick: Array<{ jobId: string; lakeId: string; seasonContextKey: string }> = [];
  const items = historyRows.map((history) => {
    const metadata = metadataByLake.get(history.lake_id);
    const cache = cacheByKey.get(cacheKey(history)) ?? null;
    const job = history.generation_job_id ? jobById.get(history.generation_job_id) ?? null : null;
    const status = deriveStatus({ history, cache, job });
    if (cache) {
      activeRequestsToClear.push({
        lakeId: history.lake_id,
        seasonContextKey: history.season_context_key,
        mapWidth: history.map_width,
        engineVersion: history.engine_version,
      });
      if (history.status === "preparing") readyHistoryIds.push(history.id);
    }
    if (!cache && status === "building" && job?.status === "queued") {
      queuedJobsToKick.push({
        jobId: job.id,
        lakeId: history.lake_id,
        seasonContextKey: history.season_context_key,
      });
    }

    return {
      historyId: history.id,
      lakeId: history.lake_id,
      lakeName: metadata?.canonical_name ?? "Unknown waterbody",
      state: metadata?.state_code ?? null,
      county: metadata?.county_name ?? null,
      areaAcres: normalizeAreaAcres(metadata?.surface_area_acres),
      seasonContextKey: history.season_context_key,
      mapWidth: history.map_width,
      engineVersion: history.engine_version,
      status,
      generationJobId: history.generation_job_id,
      lastViewedAt: history.last_viewed_at,
      generatedAt: cache?.generated_at ?? job?.completed_at ?? null,
    };
  });

  if (readyHistoryIds.length > 0) {
    const { error } = await supabase
      .from("water_reader_user_history")
      .update({ status: "ready" })
      .in("id", readyHistoryIds);
    if (error) {
      console.error("[water-reader-history] best-effort history ready update failed", {
        count: readyHistoryIds.length,
        message: error.message,
      });
    }
  }

  const seenClearKeys = new Set<string>();
  for (const active of activeRequestsToClear) {
    const key = `${active.lakeId}:${active.seasonContextKey}:${active.mapWidth}:${active.engineVersion}`;
    if (seenClearKeys.has(key)) continue;
    seenClearKeys.add(key);
    runInBackground(clearActiveGenerationRequest({
      supabase,
      userId: user.id,
      ...active,
    }));
  }

  const seenKickKeys = new Set<string>();
  for (const job of queuedJobsToKick) {
    if (seenKickKeys.has(job.jobId)) continue;
    seenKickKeys.add(job.jobId);
    runInBackground(kickGenerationWorker(job));
  }

  return new Response(
    JSON.stringify({ feature: WATER_READER_HISTORY_FEATURE, items }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
