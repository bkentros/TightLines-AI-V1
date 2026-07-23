import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  assembleConditionInputs,
  buildConditionRefresh,
  buildDailySnapshot,
  fetchRiverRunWeatherSnapshot,
  fetchUsgsInstantaneousValues,
  getConditionRefresh,
  getDailySnapshot,
  listVisibleRiverRuns,
  type NormalizedGaugeObservation,
  normalizeGaugeRead,
  normalizeWeatherSnapshot,
  parseUsgsInstantaneousValues,
  readGaugeBaselines,
  type RefreshSlot,
  resolveLatestRefreshSlot,
  resolveNextConditionRefresh,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  type RiverProfile,
  type RiverRunConditionRefresh,
  type RiverRunFetch,
  type RiverRunProfile,
  type RiverRunReasonCode,
  type ScheduleRefreshesByDate,
  type StoredConditionRefresh,
  type StoredDailySnapshot,
  type SupabaseLikeClient,
  upsertConditionRefresh,
  upsertDailySnapshot,
} from "../_shared/riverRunEngine/index.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";

const ENGINE_VERSION = "river-run-v1.0.0";
const CONFIG_VERSION = "2026-07-08";
const RIVER_RUN_SNAPSHOT_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 60 },
  { windowSeconds: 86400, maxRequests: 1000 },
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function jsonError(message: string, code: string, status: number): Response {
  return jsonResponse({ error: code, message }, status);
}

export type RiverRunHandlerDeps = {
  createAdminClient?: () => SupabaseLikeClient;
  fetchFn?: RiverRunFetch;
  rivers?: RiverProfile[];
  runs?: RiverRunProfile[];
  gaugeObservations?: NormalizedGaugeObservation[];
  weatherSnapshot?: Record<string, unknown>;
  now?: Date;
  engineVersion?: string;
  configVersion?: string;
};

type ConditionRefreshRow = {
  river_id: string;
  run_id: string;
  local_date: string;
  refresh_slot: RefreshSlot;
  push: RiverRunConditionRefresh["push"];
  freshness: RiverRunConditionRefresh["freshness"];
  source_metrics?: RiverRunConditionRefresh["sourceMetrics"];
  reason_codes?: RiverRunReasonCode[];
};

export async function handleRiverRunRequest(
  req: Request,
  deps: RiverRunHandlerDeps = {},
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }
  if (req.method !== "GET") {
    return jsonError("Method not allowed.", "method_not_allowed", 405);
  }

  const url = new URL(req.url);
  const rivers = deps.rivers ?? RIVER_RUN_RIVER_PROFILES;
  const runs = deps.runs ?? RIVER_RUN_RUN_PROFILES;
  const engineVersion = deps.engineVersion ?? ENGINE_VERSION;
  const configVersion = deps.configVersion ?? CONFIG_VERSION;

  if (url.pathname.endsWith("/rivers")) {
    return jsonResponse({ states: listVisibleRiverRuns(rivers, runs) });
  }
  if (!url.pathname.endsWith("/snapshot")) {
    return jsonError("Unknown River Run route.", "not_found", 404);
  }

  const riverId = url.searchParams.get("riverId") ?? "";
  const runId = url.searchParams.get("runId") ?? "";
  const river = rivers.find((item) => item.riverId === riverId);
  const run = runs.find((item) =>
    item.runId === runId && item.riverId === riverId
  );
  if (!river || !run) {
    return jsonError(
      "River Run profile not found.",
      "river_run_not_found",
      404,
    );
  }
  const visible = listVisibleRiverRuns([river], [run]);
  if (visible.length === 0) {
    return jsonError(
      "River Run profile is not public.",
      "river_run_hidden",
      403,
    );
  }

  const client = deps.createAdminClient?.() ?? createDefaultAdminClient();
  const auth = await authenticateSnapshotRequest(req, client);
  if (auth instanceof Response) return auth;
  const rateLimit = await checkUserRateLimit(client, {
    userId: auth.userId,
    feature: "river_run_snapshot",
    rules: RIVER_RUN_SNAPSHOT_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }
  const timing = resolveRequestTiming(
    url,
    river.timezone,
    deps.now ?? new Date(),
  );
  const dailySnapshot = await readOrBuildDailySnapshot({
    client,
    river,
    run,
    localDate: timing.localDate,
    progressionSnapshotAt: timing.refreshAtUtc,
    engineVersion,
    configVersion,
  });
  const condition = await readOrBuildConditionRefresh({
    client,
    river,
    run,
    dailySnapshot,
    localDate: timing.localDate,
    refreshSlot: timing.refreshSlot,
    refreshAtUtc: timing.refreshAtUtc,
    engineVersion,
    configVersion,
    fetchFn: deps.fetchFn ?? fetch,
    gaugeObservations: deps.gaugeObservations,
    weatherSnapshot: deps.weatherSnapshot ??
      parseJsonQuery(url.searchParams.get("envData")),
  });

  return jsonResponse(shapeSnapshotResponse({
    dailySnapshot,
    condition,
    river,
    timing,
  }));
}

async function authenticateSnapshotRequest(
  req: Request,
  client: SupabaseLikeClient,
): Promise<{ userId: string } | Response> {
  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ??
    (authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null);
  if (!token) {
    return jsonError("Missing authentication token.", "unauthorized", 401);
  }

  const getUser = (client as {
    auth?: {
      getUser?: (
        token: string,
      ) => Promise<{
        data: { user: { id?: string } | null };
        error: unknown;
      }>;
    };
  }).auth?.getUser;
  if (typeof getUser !== "function") {
    return jsonError("Unauthorized.", "unauthorized", 401);
  }

  const { data: { user }, error } = await getUser(token);
  if (error || !user?.id) {
    return jsonError("Unauthorized.", "unauthorized", 401);
  }

  return { userId: user.id };
}

function createDefaultAdminClient(): SupabaseLikeClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
  ) as unknown as SupabaseLikeClient;
}

async function readOrBuildDailySnapshot(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  run: RiverRunProfile;
  localDate: string;
  progressionSnapshotAt: string;
  engineVersion: string;
  configVersion: string;
}): Promise<StoredDailySnapshot> {
  const cached = await getDailySnapshot(input.client, {
    riverId: input.river.riverId,
    runId: input.run.runId,
    localDate: input.localDate,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  if (cached.data) return cached.data;

  const scheduleRefreshesByDate = await readScheduleRefreshes(
    input.client,
    input.run,
    input.localDate,
    input.engineVersion,
    input.configVersion,
  );
  const built = buildDailySnapshot({
    river: input.river,
    run: input.run,
    localDate: input.localDate,
    scheduleRefreshesByDate,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  const stored: StoredDailySnapshot = {
    ...built,
    progressionSnapshotAt: input.progressionSnapshotAt,
  };
  return (await upsertDailySnapshot(input.client, stored)).data ?? stored;
}

async function readOrBuildConditionRefresh(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  run: RiverRunProfile;
  dailySnapshot: StoredDailySnapshot;
  localDate: string;
  refreshSlot: RefreshSlot;
  refreshAtUtc: string;
  engineVersion: string;
  configVersion: string;
  fetchFn: RiverRunFetch;
  gaugeObservations?: NormalizedGaugeObservation[];
  weatherSnapshot?: Record<string, unknown> | null;
}): Promise<StoredConditionRefresh> {
  const cached = await getConditionRefresh(input.client, {
    riverId: input.river.riverId,
    runId: input.run.runId,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  if (cached.data) return cached.data;

  const gaugeObservations = input.gaugeObservations ??
    parseUsgsInstantaneousValues(
      await fetchUsgsInstantaneousValues({
        fetchFn: input.fetchFn,
        siteId: input.river.gauge.siteId,
        metrics: [
          input.river.gauge.primaryMetric,
          input.river.gauge.secondaryMetric,
        ]
          .filter(Boolean) as never,
      }) ?? {},
      input.river.gauge.siteId,
    );
  const gauge = normalizeGaugeRead({
    observations: gaugeObservations,
    siteId: input.river.gauge.siteId,
    primaryMetric: input.river.gauge.primaryMetric,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: input.river.gauge.maxAgeHours ?? 6,
    riseThresholds: input.run.riseThresholds,
  });
  const weatherSnapshot = input.weatherSnapshot ??
    await fetchLiveWeatherOrNull({
      fetchFn: input.fetchFn,
      river: input.river,
      refreshAtUtc: input.refreshAtUtc,
    });
  const weather = normalizeWeatherSnapshot({
    snapshot: weatherSnapshot,
    refreshAtUtc: input.refreshAtUtc,
    localDate: input.localDate,
  });
  const baselines = await readGaugeBaselines(input.client, {
    riverId: input.river.riverId,
    metric: input.river.gauge.primaryMetric,
    baselineVersion: input.configVersion,
  });
  const conditionInputs = assembleConditionInputs({
    river: input.river,
    run: input.run,
    refreshAtUtc: input.refreshAtUtc,
    localDate: input.localDate,
    gauge,
    weather,
    baselineRows: baselines.data ?? [],
  });
  const built = buildConditionRefresh({
    dailySnapshot: input.dailySnapshot,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    behaviorProfile: input.run.behaviorProfile,
    ...conditionInputs,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  const stored: StoredConditionRefresh = {
    ...built,
    conditionRefreshAt: input.refreshAtUtc,
  };
  return (await upsertConditionRefresh(input.client, stored)).data ?? stored;
}

async function readScheduleRefreshes(
  client: SupabaseLikeClient,
  run: RiverRunProfile,
  localDate: string,
  engineVersion: string,
  configVersion: string,
): Promise<ScheduleRefreshesByDate> {
  const response = await (client as any)
    .from("river_run_condition_refreshes")
    .select()
    .eq("river_id", run.riverId)
    .eq("run_id", run.runId)
    .eq("engine_version", engineVersion)
    .eq("config_version", configVersion)
    .gte("local_date", addDays(localDate, -7))
    .lte("local_date", addDays(localDate, -1))
    .order("local_date", { ascending: true });
  const rows = (response?.data ?? []) as ConditionRefreshRow[];
  const byDate: ScheduleRefreshesByDate = {};
  for (const row of rows) {
    byDate[row.local_date] ??= {};
    byDate[row.local_date][row.refresh_slot] = {
      favorabilityIndex: row.push.favorability?.favorabilityIndex ?? 0,
      gaugeFreshness: row.freshness.gauge,
      missingNonGaugeInputCount: countMissingNonGauge(row),
      reasonCodes: row.reason_codes,
    };
  }
  return byDate;
}

function countMissingNonGauge(row: ConditionRefreshRow): number {
  const codes = new Set(row.reason_codes ?? []);
  return (codes.has("rain_missing") ? 1 : 0) +
    (codes.has("temperature_neutral_missing") ? 1 : 0);
}

function shapeSnapshotResponse(input: {
  dailySnapshot: StoredDailySnapshot;
  condition: StoredConditionRefresh;
  river: RiverProfile;
  timing: {
    localDate: string;
    localTime: string;
    refreshAtUtc: string;
    refreshSlot: RefreshSlot;
  };
}) {
  const next = resolveNextConditionRefresh({
    localDate: input.timing.localDate,
    localTime: input.timing.localTime,
    timezone: input.river.timezone,
  });
  return {
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    localDate: input.dailySnapshot.localDate,
    timezone: input.dailySnapshot.timezone,
    progressionSnapshotAt: input.dailySnapshot.progressionSnapshotAt,
    conditionRefreshAt: input.condition.conditionRefreshAt,
    refreshSlot: input.condition.refreshSlot,
    progressionExpiresAt: `${
      addDays(input.dailySnapshot.localDate, 1)
    }T00:00:00`,
    nextConditionRefreshAt: next.localDateTime,
    runStage: input.dailySnapshot.runStage,
    schedule: input.dailySnapshot.schedule,
    push: input.condition.push,
    fishability: input.condition.fishability,
    fishInRiver: input.dailySnapshot.fishInRiver,
    gauge: input.condition.sourceMetrics.gauge,
    weather: input.condition.sourceMetrics.weather,
    freshness: input.condition.freshness,
    dataQuality: input.condition.dataQuality,
    interpretationNote: input.condition.interpretationNote,
    secondaryNote: input.condition.sourceMetrics.weather?.forecastDaily?.length
      ? "Forecast data is informational only and does not change scores."
      : undefined,
    safety: {
      regulationReminder: "Check current local regulations before fishing.",
      gaugeBasis: input.river.gaugeLimitationCopy,
    },
    engineVersion: input.condition.engineVersion,
    configVersion: input.condition.configVersion,
  };
}

async function fetchLiveWeatherOrNull(input: {
  fetchFn: RiverRunFetch;
  river: RiverProfile;
  refreshAtUtc: string;
}): Promise<Record<string, unknown> | null> {
  try {
    return await fetchRiverRunWeatherSnapshot({
      fetchFn: input.fetchFn,
      lat: input.river.weatherLat ?? input.river.mouthLat,
      lon: input.river.weatherLon ?? input.river.mouthLon,
      fetchedAtUtc: input.refreshAtUtc,
    }) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

function resolveRequestTiming(url: URL, timezone: string, now: Date) {
  const refreshAtUtc = url.searchParams.get("refreshAtUtc") ??
    now.toISOString();
  const dateForDefaults = new Date(refreshAtUtc);
  const localDate = url.searchParams.get("localDate") ??
    localDateInTz(timezone, dateForDefaults);
  const localTime = url.searchParams.get("localTime") ??
    localTimeInTz(timezone, dateForDefaults);
  const latest = resolveLatestRefreshSlot({ localDate, localTime, timezone });
  return {
    localDate,
    localTime,
    refreshAtUtc,
    refreshSlot: latest.refreshSlot,
  };
}

function localDateInTz(timezone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function localTimeInTz(timezone: string, date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  return `${parts.find((part) => part.type === "hour")?.value ?? "00"}:${
    parts.find((part) => part.type === "minute")?.value ?? "00"
  }`;
}

function addDays(localDate: string, days: number): string {
  const date = new Date(`${localDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function parseJsonQuery(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

if (import.meta.main) {
  Deno.serve((req) => handleRiverRunRequest(req));
}
