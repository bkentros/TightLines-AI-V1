import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  assembleConditionInputs,
  buildConditionRefresh,
  buildDailySnapshot,
  compareLocalDates,
  type ConditionsSuggestEvidenceByDate,
  fetchMonitorMyWatershedTemperature,
  fetchRiverRunWeatherSnapshot,
  fetchUsgsInstantaneousValues,
  fetchUsgsWaterTemperature,
  getConditionRefresh,
  getDailySnapshot,
  getLastSupportivePushConditions,
  getPrimaryHydraulicSource,
  getPrimaryWeatherPoint,
  getRecentDailyPushConditions,
  getRunTemperatureSources,
  type LastSupportivePushConditions,
  listPublishedConfigurations,
  listVisibleRiverRuns,
  type NormalizedGaugeObservation,
  type NormalizedWaterTemperatureObservation,
  normalizeGaugeRead,
  normalizeWeatherSnapshot,
  type ObservedConditionRunProfile,
  parseMonitorMyWatershedTemperature,
  parseUsgsInstantaneousValues,
  parseUsgsWaterTemperature,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PUSH_SUPPORTIVE_SCORE_MINIMUM,
  readConditionsSuggestBaselines,
  type RecentDailyPushConditions,
  type RefreshSlot,
  resolveConditionsSuggestCheckpointState,
  resolveLatestRefreshSlot,
  resolveNextConditionRefresh,
  resolveRunStage,
  resolveWaterTemperatureRead,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  type RiverProfile,
  type RiverRunConditionRefresh,
  type RiverRunFetch,
  type RiverRunProfile,
  type RiverRunReasonCode,
  staticConfigurationVersionForRun,
  type StoredConditionRefresh,
  type StoredDailySnapshot,
  type SupabaseLikeClient,
  upsertConditionRefresh,
  upsertDailySnapshot,
  validateConfigurationRevision,
} from "../_shared/riverRunEngine/index.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";

const ENGINE_VERSION = "river-run-v1.9.0";
const CONFIG_VERSION = PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion;
const RIVER_RUN_SNAPSHOT_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 60 },
  { windowSeconds: 86400, maxRequests: 1000 },
];
const PROVIDER_TIMEOUT_MS = 8_000;
const INTERNAL_KEY_HEADER = "x-river-run-internal-key";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      `Content-Type, Authorization, apikey, x-user-token, ${INTERNAL_KEY_HEADER}`,
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
  waterTemperatureObservationsBySource?: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
  weatherSnapshot?: Record<string, unknown>;
  now?: Date;
  engineVersion?: string;
  configVersion?: string;
  configSource?: "static" | "database";
  publicEnabled?: boolean;
  internalSecret?: string;
  allowTestOverrides?: boolean;
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

type RequestTiming = {
  localDate: string;
  localTime: string;
  refreshAtUtc: string;
  refreshSlot: RefreshSlot;
};

type PushHistoryContext = {
  status:
    | "not_started"
    | "active_now"
    | "previously_recorded"
    | "none_recorded"
    | "unavailable"
    | "complete";
  minimumSupportiveScore: number;
  trackingStartDate: string;
  trackingEndDate: string;
  throughDate: string;
  recentDailyReadsStatus: "available" | "unavailable";
  recentDailyReads: PushDailyHistoryRead[];
  lastSupportiveConditions?: LastSupportivePushConditions;
};

type PushDailyHistoryRead =
  | RecentDailyPushConditions
  | {
    localDate: string;
    status: "missing";
    score: null;
    label: "No recorded read";
  };

async function resolveRuntimeCatalog(
  deps: RiverRunHandlerDeps,
): Promise<
  {
    rivers: RiverProfile[];
    runs: RiverRunProfile[];
    configVersionByRun: Map<string, string>;
  } | Response
> {
  const staticRivers = deps.rivers ?? RIVER_RUN_RIVER_PROFILES;
  const staticRuns = deps.runs ?? RIVER_RUN_RUN_PROFILES;
  const staticResult = {
    rivers: staticRivers,
    runs: staticRuns,
    configVersionByRun: new Map(
      staticRuns.map((run) => [
        run.runId,
        deps.configVersion ?? staticConfigurationVersionForRun(run.runId),
      ]),
    ),
  };
  if (deps.rivers || deps.runs) return staticResult;

  const configSource = deps.configSource ??
    (Deno.env.get("RIVER_RUN_CONFIG_SOURCE") === "database"
      ? "database"
      : "static");
  if (configSource === "static") return staticResult;

  try {
    const client = deps.createAdminClient?.() ?? createDefaultAdminClient();
    const result = await listPublishedConfigurations(client);
    if (result.error) {
      console.error("[river-run] published configuration read failed", {
        message: result.error.message,
      });
      return jsonError(
        "River Run configuration is temporarily unavailable.",
        "river_run_config_unavailable",
        503,
      );
    }
    const revisions = (result.data ?? []).filter((revision) => {
      const issues = validateConfigurationRevision(revision).filter((item) =>
        item.severity === "error"
      );
      if (issues.length > 0) {
        console.error("[river-run] invalid published configuration hidden", {
          configKey: revision.configKey,
          revision: revision.revision,
          issueCount: issues.length,
        });
      }
      return issues.length === 0;
    });
    return {
      rivers: revisions.map((revision) => revision.document.river),
      runs: revisions.flatMap((revision) => revision.document.runs),
      configVersionByRun: new Map(
        revisions.flatMap((revision) =>
          revision.document.runs.map((run) => [
            run.runId,
            revision.document.configVersion,
          ])
        ),
      ),
    };
  } catch (error) {
    console.error("[river-run] published configuration resolution failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return jsonError(
      "River Run configuration is temporarily unavailable.",
      "river_run_config_unavailable",
      503,
    );
  }
}

export async function handleRiverRunRequest(
  req: Request,
  deps: RiverRunHandlerDeps = {},
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }
  const url = new URL(req.url);
  const catalog = await resolveRuntimeCatalog(deps);
  if (catalog instanceof Response) return catalog;
  const rivers = deps.rivers ?? catalog.rivers;
  const runs = deps.runs ?? catalog.runs;
  const engineVersion = deps.engineVersion ?? ENGINE_VERSION;
  const publicEnabled = deps.publicEnabled ??
    Deno.env.get("RIVER_RUN_PUBLIC_ENABLED") === "true";

  if (
    req.method === "POST" && url.pathname.endsWith("/internal/refresh")
  ) {
    return await handleInternalRefresh(req, {
      ...deps,
      rivers,
      runs,
      engineVersion,
      configVersionByRun: catalog.configVersionByRun,
    });
  }
  if (req.method !== "GET") {
    return jsonError("Method not allowed.", "method_not_allowed", 405);
  }

  if (url.pathname.endsWith("/rivers")) {
    return jsonResponse({
      states: publicEnabled ? listVisibleRiverRuns(rivers, runs) : [],
    });
  }
  if (!url.pathname.endsWith("/snapshot")) {
    return jsonError("Unknown River Run route.", "not_found", 404);
  }

  const riverId = url.searchParams.get("riverId") ?? "";
  const runId = url.searchParams.get("runId") ?? "";
  const requestedPresentationState =
    url.searchParams.get("presentationState")?.trim().toUpperCase() ?? "";
  const river = rivers.find((item) => item.riverId === riverId);
  const run = runs.find((item) =>
    item.runId === runId && item.riverId === riverId
  );
  const configVersion = deps.configVersion ??
    catalog.configVersionByRun.get(runId) ??
    CONFIG_VERSION;
  if (!river || !run) {
    return jsonError(
      "River Run profile not found.",
      "river_run_not_found",
      404,
    );
  }
  const presentation = resolveSnapshotPresentation(
    river,
    requestedPresentationState,
  );
  if (!presentation) {
    return jsonError(
      requestedPresentationState
        ? "River Run is not available for the requested state presentation."
        : "A state presentation is required for this River Run.",
      "river_run_presentation_not_found",
      400,
    );
  }
  if (!publicEnabled) {
    return jsonError(
      "River Run is not publicly released.",
      "river_run_not_released",
      403,
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
  try {
    const timing = resolveRequestTiming(
      url,
      river,
      run,
      deps.now ?? new Date(),
      deps.allowTestOverrides === true,
    );
    const result = await readOrBuildSnapshot({
      client,
      river,
      run,
      timing,
      engineVersion,
      configVersion,
      fetchFn: deps.fetchFn ?? fetch,
      gaugeObservations: deps.gaugeObservations,
      waterTemperatureObservationsBySource:
        deps.waterTemperatureObservationsBySource,
      weatherSnapshot: deps.weatherSnapshot,
    });
    const pushHistory = await resolvePushHistoryContext({
      client,
      dailySnapshot: result.dailySnapshot,
      condition: result.condition,
      engineVersion,
      configVersion,
    });
    return jsonResponse(shapeSnapshotResponse({
      ...result,
      river,
      run,
      timing,
      pushHistory,
      presentation,
    }));
  } catch (error) {
    console.error("[river-run] snapshot failed", {
      riverId,
      runId,
      message: error instanceof Error ? error.message : String(error),
    });
    return jsonError(
      "River Run is temporarily unavailable.",
      "river_run_temporarily_unavailable",
      503,
    );
  }
}

async function resolvePushHistoryContext(input: {
  client: SupabaseLikeClient;
  dailySnapshot: StoredDailySnapshot;
  condition: StoredConditionRefresh;
  engineVersion: string;
  configVersion: string;
}): Promise<PushHistoryContext> {
  const window = input.dailySnapshot.runStage.window;
  const trackingStartDate = window.startDate;
  const trackingEndDate = window.endDate;
  const currentDate = input.dailySnapshot.localDate;
  const afterTrackingStart =
    compareLocalDates(currentDate, trackingStartDate) >= 0;
  const beforeTrackingEnd =
    compareLocalDates(currentDate, trackingEndDate) <= 0;
  const throughDate = compareLocalDates(currentDate, trackingEndDate) > 0
    ? trackingEndDate
    : currentDate;
  const base = {
    minimumSupportiveScore: PUSH_SUPPORTIVE_SCORE_MINIMUM,
    trackingStartDate,
    trackingEndDate,
    throughDate,
  };

  if (
    input.condition.push.reasonCodes.includes(
      "primitive_push_unavailable_for_river",
    )
  ) {
    return {
      ...base,
      status: "unavailable",
      recentDailyReadsStatus: "unavailable",
      recentDailyReads: [],
    };
  }

  if (!afterTrackingStart) {
    return {
      ...base,
      status: "not_started",
      recentDailyReadsStatus: "available",
      recentDailyReads: [],
    };
  }

  const recentDailyReads = await resolveRecentDailyPushReads({
    client: input.client,
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    trackingStartDate,
    throughDate: beforeTrackingEnd ? addDays(currentDate, -1) : trackingEndDate,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });

  if (!beforeTrackingEnd) {
    return {
      ...base,
      status: "complete",
      ...recentDailyReads,
    };
  }

  if (
    typeof input.condition.push.score === "number" &&
    input.condition.push.score >= PUSH_SUPPORTIVE_SCORE_MINIMUM
  ) {
    return {
      ...base,
      status: "active_now",
      ...recentDailyReads,
      lastSupportiveConditions: {
        localDate: input.condition.localDate,
        refreshSlot: input.condition.refreshSlot,
        conditionRefreshAt: input.condition.conditionRefreshAt,
        score: input.condition.push.score,
        label: input.condition.push.label,
      },
    };
  }

  const result = await getLastSupportivePushConditions(input.client, {
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    trackingStartDate,
    throughDate,
    minimumScore: PUSH_SUPPORTIVE_SCORE_MINIMUM,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  if (result.error) {
    console.error("[river-run] supportive Push history read failed", {
      riverId: input.dailySnapshot.riverId,
      runId: input.dailySnapshot.runId,
      message: result.error.message,
    });
    return {
      ...base,
      status: "unavailable",
      ...recentDailyReads,
    };
  }
  if (!result.found || !result.data) {
    return {
      ...base,
      status: "none_recorded",
      ...recentDailyReads,
    };
  }
  return {
    ...base,
    status: "previously_recorded",
    ...recentDailyReads,
    lastSupportiveConditions: result.data,
  };
}

async function resolveRecentDailyPushReads(input: {
  client: SupabaseLikeClient;
  riverId: string;
  runId: string;
  trackingStartDate: string;
  throughDate: string;
  engineVersion: string;
  configVersion: string;
}): Promise<
  Pick<
    PushHistoryContext,
    "recentDailyReadsStatus" | "recentDailyReads"
  >
> {
  if (compareLocalDates(input.throughDate, input.trackingStartDate) < 0) {
    return {
      recentDailyReadsStatus: "available",
      recentDailyReads: [],
    };
  }
  const result = await getRecentDailyPushConditions(input.client, {
    ...input,
    maximumDays: 7,
    minimumSupportiveScore: PUSH_SUPPORTIVE_SCORE_MINIMUM,
  });
  if (result.error) {
    console.error("[river-run] recent daily Push history read failed", {
      riverId: input.riverId,
      runId: input.runId,
      message: result.error.message,
    });
    return {
      recentDailyReadsStatus: "unavailable",
      recentDailyReads: [],
    };
  }
  const recordedByDate = new Map(
    (result.data ?? []).map((read) => [read.localDate, read]),
  );
  const reads: PushDailyHistoryRead[] = [];
  for (
    let localDate = input.throughDate;
    compareLocalDates(localDate, input.trackingStartDate) >= 0 &&
    reads.length < 7;
    localDate = addDays(localDate, -1)
  ) {
    const recorded = recordedByDate.get(localDate);
    reads.push(
      recorded ?? {
        localDate,
        status: "missing",
        score: null,
        label: "No recorded read",
      },
    );
  }
  return {
    recentDailyReadsStatus: "available",
    recentDailyReads: reads,
  };
}

async function handleInternalRefresh(
  req: Request,
  deps: RiverRunHandlerDeps & {
    rivers: RiverProfile[];
    runs: RiverRunProfile[];
    engineVersion: string;
    configVersionByRun: Map<string, string>;
  },
): Promise<Response> {
  const configuredSecret = deps.internalSecret ??
    Deno.env.get("RIVER_RUN_INTERNAL_KEY");
  if (!configuredSecret || configuredSecret.trim().length < 16) {
    return jsonError(
      "River Run internal refresh secret is not configured.",
      "internal_misconfigured",
      500,
    );
  }
  if (req.headers.get(INTERNAL_KEY_HEADER) !== configuredSecret) {
    return jsonError(
      "This endpoint is reserved for internal River Run infrastructure.",
      "forbidden",
      403,
    );
  }

  const client = deps.createAdminClient?.() ?? createDefaultAdminClient();
  const now = deps.now ?? new Date();
  const visibleCatalog = listVisibleRiverRuns(deps.rivers, deps.runs);
  const visibleRunIds = new Set(
    visibleCatalog.flatMap((state) =>
      state.rivers.flatMap((river) => river.runs.map((run) => run.runId))
    ),
  );
  const targets = deps.runs.flatMap((run) => {
    if (!visibleRunIds.has(run.runId)) return [];
    const river = deps.rivers.find((item) => item.riverId === run.riverId);
    return river ? [{ river, run }] : [];
  });
  const results: Array<Record<string, unknown>> = [];
  let failed = 0;

  for (const target of targets) {
    const timing = resolveRequestTiming(
      new URL(req.url),
      target.river,
      target.run,
      now,
      false,
    );
    try {
      const snapshot = await readOrBuildSnapshot({
        client,
        river: target.river,
        run: target.run,
        timing,
        engineVersion: deps.engineVersion,
        configVersion: deps.configVersion ??
          deps.configVersionByRun.get(target.run.runId) ??
          CONFIG_VERSION,
        fetchFn: deps.fetchFn ?? fetch,
        gaugeObservations: deps.gaugeObservations,
        waterTemperatureObservationsBySource:
          deps.waterTemperatureObservationsBySource,
        weatherSnapshot: deps.weatherSnapshot,
      });
      results.push({
        riverId: target.river.riverId,
        runId: target.run.runId,
        localDate: timing.localDate,
        refreshSlot: timing.refreshSlot,
        conditionRefreshAt: snapshot.condition.conditionRefreshAt,
        dataQuality: snapshot.condition.dataQuality.label,
        gaugeFreshness: snapshot.condition.freshness.gauge,
        weatherFreshness: snapshot.condition.freshness.weather,
      });
    } catch (error) {
      failed++;
      console.error("[river-run] internal refresh failed", {
        riverId: target.river.riverId,
        runId: target.run.runId,
        message: error instanceof Error ? error.message : String(error),
      });
      results.push({
        riverId: target.river.riverId,
        runId: target.run.runId,
        localDate: timing.localDate,
        refreshSlot: timing.refreshSlot,
        error: "refresh_failed",
      });
    }
  }

  return jsonResponse(
    {
      refreshedAt: now.toISOString(),
      targetCount: targets.length,
      failedCount: failed,
      results,
    },
    failed > 0 ? 503 : 200,
  );
}

async function readOrBuildSnapshot(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  run: RiverRunProfile;
  timing: RequestTiming;
  engineVersion: string;
  configVersion: string;
  fetchFn: RiverRunFetch;
  gaugeObservations?: NormalizedGaugeObservation[];
  waterTemperatureObservationsBySource?: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
  weatherSnapshot?: Record<string, unknown> | null;
}): Promise<{
  dailySnapshot: StoredDailySnapshot;
  condition: StoredConditionRefresh;
}> {
  const dailySnapshot = await readOrBuildDailySnapshot({
    client: input.client,
    river: input.river,
    run: input.run,
    localDate: input.timing.localDate,
    progressionSnapshotAt: input.timing.refreshAtUtc,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  const condition = await readOrBuildConditionRefresh({
    client: input.client,
    river: input.river,
    run: input.run,
    dailySnapshot,
    localDate: input.timing.localDate,
    refreshSlot: input.timing.refreshSlot,
    refreshAtUtc: input.timing.refreshAtUtc,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
    fetchFn: input.fetchFn,
    gaugeObservations: input.gaugeObservations,
    waterTemperatureObservationsBySource:
      input.waterTemperatureObservationsBySource,
    weatherSnapshot: input.weatherSnapshot,
  });
  return { dailySnapshot, condition };
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
  throwOnStorageError("read daily snapshot", cached.error);
  if (cached.data) return cached.data;

  const timingCapability = input.run.primitiveCapabilities.migrationTiming;
  let conditionsEvidenceByDate: ConditionsSuggestEvidenceByDate = {};
  let conditionsBaselines = null;
  if (timingCapability.status === "available") {
    const observedRun = requireObservedRun(input.run);
    const [evidence, baselinesResult] = await Promise.all([
      readConditionsSuggestEvidence(
        input.client,
        observedRun,
        input.localDate,
        input.engineVersion,
        input.configVersion,
      ),
      readConditionsSuggestBaselines(input.client, {
        riverId: observedRun.riverId,
        runId: observedRun.runId,
        baselineVersion: observedRun.conditionsSuggest.baselineVersion,
      }),
    ]);
    throwOnStorageError(
      "read Conditions Suggest baselines",
      baselinesResult.error,
    );
    conditionsEvidenceByDate = evidence;
    conditionsBaselines = baselinesResult.data;
  }
  const built = buildDailySnapshot({
    river: input.river,
    run: input.run,
    localDate: input.localDate,
    conditionsEvidenceByDate,
    conditionsBaselines,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  const stored: StoredDailySnapshot = {
    ...built,
    progressionSnapshotAt: input.progressionSnapshotAt,
  };
  const upserted = await upsertDailySnapshot(input.client, stored);
  throwOnStorageError("store daily snapshot", upserted.error);
  return upserted.data ?? stored;
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
  waterTemperatureObservationsBySource?: Record<
    string,
    NormalizedWaterTemperatureObservation[]
  >;
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
  throwOnStorageError("read condition refresh", cached.error);
  if (cached.data) return cached.data;

  const allCurrentPrimitivesUnavailable =
    input.run.primitiveCapabilities.push.status === "unavailable" &&
    input.run.primitiveCapabilities.fishability.status === "unavailable";
  if (allCurrentPrimitivesUnavailable) {
    const built = buildConditionRefresh({
      dailySnapshot: input.dailySnapshot,
      localDate: input.localDate,
      refreshSlot: input.refreshSlot,
      movementEngineId: input.run.movementEngineId,
      primitiveCapabilities: input.run.primitiveCapabilities,
      gaugeFreshness: "missing",
      weatherFreshness: "missing",
      waterTemperatureFreshness: "missing",
      conditionsWaterTemperatureFreshness: "missing",
      currentHydraulicValue: null,
      hydraulicAbsoluteChange24h: null,
      hydraulicPercentChange24h: null,
      rainSignal: "missing_rain_data",
      flowSignal: "unknown",
      temperatureSignal: "neutral_missing",
      temperatureSourceType: "unavailable",
      waterTempF: null,
      missingNonGaugeInputCount: 2,
      rainReasonCodes: ["rain_missing"],
      flowReasonCodes: ["gauge_missing", "flow_trend_unknown"],
      temperatureReasonCodes: [
        "temperature_unavailable",
        "temperature_neutral_missing",
      ],
      sourceMetrics: {},
      engineVersion: input.engineVersion,
      configVersion: input.configVersion,
    });
    return await storeConditionRefresh(input, built);
  }

  const observedRun = requireObservedRun(input.run);

  const boundedFetch = withTimeoutFetch(input.fetchFn, PROVIDER_TIMEOUT_MS);
  const primaryHydraulicSource = getPrimaryHydraulicSource(input.river);
  const gaugeObservations = input.gaugeObservations ??
    await fetchLiveGaugeOrEmpty({
      fetchFn: boundedFetch,
      river: input.river,
      refreshAtUtc: input.refreshAtUtc,
    });
  const gauge = normalizeGaugeRead({
    observations: gaugeObservations,
    siteId: primaryHydraulicSource.siteId,
    primaryMetric: primaryHydraulicSource.primaryMetric,
    refreshAtUtc: input.refreshAtUtc,
    maxAgeHours: primaryHydraulicSource.maxAgeHours,
    riseThresholds: {
      rising24hAbsolute: observedRun.push.hydraulic.rising24h.absolute,
      rising24hPercent: observedRun.push.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute:
        observedRun.push.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent:
        observedRun.push.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: observedRun.push.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: observedRun.push.hydraulic.sharpRise24h.percent,
    },
  });
  const temperatureSources = getRunTemperatureSources(
    input.river,
    observedRun,
  );
  const temperaturePayload = input.waterTemperatureObservationsBySource
    ? {
      observationsBySource: input.waterTemperatureObservationsBySource,
      rejectedBySource: {},
    }
    : await fetchLiveWaterTemperatures({
      fetchFn: boundedFetch,
      sources: temperatureSources,
      refreshAtUtc: input.refreshAtUtc,
    });
  const waterTemperature = resolveWaterTemperatureRead({
    sources: temperatureSources,
    sourcePriority: observedRun.waterTemperature.sourcePriority,
    observationsBySource: temperaturePayload.observationsBySource,
    rejectedBySource: temperaturePayload.rejectedBySource,
    refreshAtUtc: input.refreshAtUtc,
  });
  const conditionsTemperatureSources = temperatureSources.filter((source) =>
    source.sourceId === observedRun.conditionsSuggest.temperatureSourceId
  );
  const conditionsWaterTemperature = resolveWaterTemperatureRead({
    sources: conditionsTemperatureSources,
    sourcePriority: [observedRun.conditionsSuggest.temperatureSourceId],
    observationsBySource: temperaturePayload.observationsBySource,
    rejectedBySource: temperaturePayload.rejectedBySource,
    refreshAtUtc: input.refreshAtUtc,
  });
  const weatherSnapshot = input.weatherSnapshot ??
    await fetchLiveWeatherOrNull({
      fetchFn: boundedFetch,
      river: input.river,
      refreshAtUtc: input.refreshAtUtc,
    });
  const weather = normalizeWeatherSnapshot({
    snapshot: weatherSnapshot,
    refreshAtUtc: input.refreshAtUtc,
    localDate: input.localDate,
  });
  const conditionInputs = assembleConditionInputs({
    river: input.river,
    run: observedRun,
    refreshAtUtc: input.refreshAtUtc,
    localDate: input.localDate,
    gauge,
    waterTemperature,
    conditionsWaterTemperature,
    weather,
  });
  const activityTargetDate = input.refreshSlot >= "21:00"
    ? addDays(input.localDate, 1)
    : input.localDate;
  const activityTargetStage = resolveRunStage(observedRun, activityTargetDate);
  const activityActive = compareLocalDates(
        activityTargetDate,
        activityTargetStage.window.stagingStartDate,
      ) >= 0 &&
    compareLocalDates(
        activityTargetDate,
        activityTargetStage.window.lateEndDate,
      ) <= 0;
  const built = buildConditionRefresh({
    dailySnapshot: input.dailySnapshot,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    movementEngineId: input.run.movementEngineId,
    primitiveCapabilities: observedRun.primitiveCapabilities,
    pushRules: observedRun.push,
    fishabilityBands: observedRun.fishabilityBands,
    activityRules: activityActive ? observedRun.activity : undefined,
    activityTargetDate: activityActive ? activityTargetDate : undefined,
    activityTargetStage: activityTargetStage.stage,
    activityStaging: compareLocalDates(
          activityTargetDate,
          activityTargetStage.window.stagingStartDate,
        ) >= 0 &&
      compareLocalDates(
          activityTargetDate,
          activityTargetStage.window.startDate,
        ) < 0,
    ...conditionInputs,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  });
  return await storeConditionRefresh(input, built);
}

async function storeConditionRefresh(
  input: {
    client: SupabaseLikeClient;
    refreshAtUtc: string;
  },
  built: RiverRunConditionRefresh,
): Promise<StoredConditionRefresh> {
  const stored: StoredConditionRefresh = {
    ...built,
    conditionRefreshAt: input.refreshAtUtc,
  };
  const upserted = await upsertConditionRefresh(input.client, stored);
  throwOnStorageError("store condition refresh", upserted.error);
  return upserted.data ?? stored;
}

function requireObservedRun(
  run: RiverRunProfile,
): ObservedConditionRunProfile {
  if (
    run.primitiveCapabilities.migrationTiming.status !== "available" ||
    run.primitiveCapabilities.push.status !== "available" ||
    run.primitiveCapabilities.fishability.status !== "available" ||
    !run.push || !run.fishabilityBands || !run.baselineCoverage ||
    !run.waterTemperature || !run.conditionsSuggest
  ) {
    throw new Error(
      "Observed River Migration runtime requires all condition calibrations.",
    );
  }
  return run as ObservedConditionRunProfile;
}

async function readConditionsSuggestEvidence(
  client: SupabaseLikeClient,
  run: ObservedConditionRunProfile,
  localDate: string,
  engineVersion: string,
  configVersion: string,
): Promise<ConditionsSuggestEvidenceByDate> {
  const checkpointState = resolveConditionsSuggestCheckpointState(
    run,
    localDate,
  );
  if (!checkpointState.activeCheckpoint) return {};
  const response = await (client as any)
    .from("river_run_condition_refreshes")
    .select()
    .eq("river_id", run.riverId)
    .eq("run_id", run.runId)
    .eq("engine_version", engineVersion)
    .eq("config_version", configVersion)
    .gte(
      "local_date",
      checkpointState.activeCheckpoint.observationStartDate,
    )
    .lte("local_date", checkpointState.activeCheckpoint.cutoffDate)
    .order("local_date", { ascending: true });
  if (response?.error) {
    throw new Error(
      `read Conditions Suggest evidence history: ${
        response.error.message ?? "storage operation failed"
      }`,
    );
  }
  const rows = (response?.data ?? []) as ConditionRefreshRow[];
  const byDate: ConditionsSuggestEvidenceByDate = {};
  for (const row of rows) {
    byDate[row.local_date] ??= {};
    byDate[row.local_date][row.refresh_slot] = {
      gaugeFreshness: row.freshness.gauge,
      gaugeValue: row.source_metrics?.gauge?.value,
      gaugeMetric: row.source_metrics?.gauge?.primaryMetric,
      gaugeSiteId: row.source_metrics?.gauge?.siteId,
      waterTemperatureFreshness: row.freshness.conditionsWaterTemperature,
      waterTempF: row.source_metrics?.conditionsWaterTemperature?.waterTempF,
      waterTemperatureSourceId: row.source_metrics?.conditionsWaterTemperature
        ?.sourceId,
      reasonCodes: row.reason_codes,
    };
  }
  return byDate;
}

function shapeSnapshotResponse(input: {
  dailySnapshot: StoredDailySnapshot;
  condition: StoredConditionRefresh;
  river: RiverProfile;
  run: RiverRunProfile;
  presentation: {
    state: string;
    displayName?: string;
    defaultReachId?: string;
    regulationReminderCopy: string;
  };
  pushHistory: PushHistoryContext;
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
    run: input.run,
    schedule: input.river.conditionRefreshSchedule,
  });
  return {
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    presentation: input.presentation,
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
    conditionsSuggest: input.dailySnapshot.conditionsSuggest,
    push: input.condition.push,
    pushHistory: input.pushHistory,
    fishability: input.condition.fishability,
    activity: input.condition.activity,
    fishInRiver: input.dailySnapshot.fishInRiver,
    gauge: input.condition.sourceMetrics.gauge,
    weather: input.condition.sourceMetrics.weather,
    waterTemperature: input.condition.sourceMetrics.waterTemperature,
    conditionsWaterTemperature:
      input.condition.sourceMetrics.conditionsWaterTemperature,
    freshness: input.condition.freshness,
    dataQuality: input.condition.dataQuality,
    interpretationNote: input.condition.interpretationNote,
    secondaryNote: input.condition.sourceMetrics.weather?.forecastDaily?.length
      ? "Forecast weather informs Activity Outlook only; Push and Fishability remain observation-led."
      : undefined,
    safety: {
      regulationReminder: input.presentation.regulationReminderCopy,
      gaugeBasis: input.river.gaugeLimitationCopy,
      activityDisclaimer:
        "Fishability describes fishing conditions, not wading or boating safety.",
    },
    engineVersion: input.condition.engineVersion,
    configVersion: input.condition.configVersion,
  };
}

function resolveSnapshotPresentation(
  river: RiverProfile,
  requestedState: string,
): {
  state: string;
  displayName?: string;
  defaultReachId?: string;
  regulationReminderCopy: string;
} | null {
  const contexts = river.presentationContexts;
  if (contexts?.length) {
    if (!requestedState) return null;
    return contexts.find((context) => context.state === requestedState) ?? null;
  }
  if (requestedState && requestedState !== river.state) return null;
  return {
    state: river.state,
    regulationReminderCopy: river.regulationReminderCopy ??
      "Check current local regulations before fishing.",
  };
}

async function fetchLiveWeatherOrNull(input: {
  fetchFn: RiverRunFetch;
  river: RiverProfile;
  refreshAtUtc: string;
}): Promise<Record<string, unknown> | null> {
  try {
    const weatherPoint = getPrimaryWeatherPoint(input.river);
    return await fetchRiverRunWeatherSnapshot({
      fetchFn: input.fetchFn,
      lat: weatherPoint.lat,
      lon: weatherPoint.lon,
      fetchedAtUtc: input.refreshAtUtc,
    }) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

async function fetchLiveGaugeOrEmpty(input: {
  fetchFn: RiverRunFetch;
  river: RiverProfile;
  refreshAtUtc: string;
}): Promise<NormalizedGaugeObservation[]> {
  const source = getPrimaryHydraulicSource(input.river);
  try {
    return parseUsgsInstantaneousValues(
      await fetchUsgsInstantaneousValues({
        fetchFn: input.fetchFn,
        siteId: source.siteId,
        metrics: source.availableMetrics,
        endAtUtc: input.refreshAtUtc,
      }) ?? {},
      source.siteId,
    );
  } catch (error) {
    console.error("[river-run] gauge provider failed", {
      siteId: source.siteId,
      message: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function fetchLiveWaterTemperatures(input: {
  fetchFn: RiverRunFetch;
  sources: ReturnType<typeof getRunTemperatureSources>;
  refreshAtUtc: string;
}): Promise<{
  observationsBySource: Record<string, NormalizedWaterTemperatureObservation[]>;
  rejectedBySource: Record<string, number>;
}> {
  const entries = await Promise.all(input.sources.map(async (source) => {
    try {
      if (source.provider === "MONITOR_MY_WATERSHED") {
        const csv = await fetchMonitorMyWatershedTemperature({
          fetchFn: input.fetchFn,
          source,
          endAtUtc: input.refreshAtUtc,
        });
        const parsed = csv
          ? parseMonitorMyWatershedTemperature({ csv, source })
          : { observations: [], rejectedObservationCount: 0 };
        return [source.sourceId, parsed] as const;
      }
      const payload = await fetchUsgsWaterTemperature({
        fetchFn: input.fetchFn,
        source,
        endAtUtc: input.refreshAtUtc,
      });
      const parsed = payload
        ? parseUsgsWaterTemperature({ payload, source })
        : { observations: [], rejectedObservationCount: 0 };
      return [source.sourceId, parsed] as const;
    } catch (error) {
      console.error("[river-run] water temperature provider failed", {
        sourceId: source.sourceId,
        message: error instanceof Error ? error.message : String(error),
      });
      return [
        source.sourceId,
        {
          observations: [] as NormalizedWaterTemperatureObservation[],
          rejectedObservationCount: 1,
        },
      ] as const;
    }
  }));
  return {
    observationsBySource: Object.fromEntries(
      entries.map(([sourceId, parsed]) => [sourceId, parsed.observations]),
    ),
    rejectedBySource: Object.fromEntries(
      entries.map(([sourceId, parsed]) => [
        sourceId,
        parsed.rejectedObservationCount,
      ]),
    ),
  };
}

function withTimeoutFetch(
  fetchFn: RiverRunFetch,
  timeoutMs: number,
): RiverRunFetch {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetchFn(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  };
}

function resolveRequestTiming(
  url: URL,
  river: RiverProfile,
  run: RiverRunProfile,
  now: Date,
  allowTestOverrides: boolean,
): RequestTiming {
  const refreshAtUtc = allowTestOverrides
    ? url.searchParams.get("refreshAtUtc") ?? now.toISOString()
    : now.toISOString();
  const dateForDefaults = new Date(refreshAtUtc);
  const localDate = allowTestOverrides
    ? url.searchParams.get("localDate") ??
      localDateInTz(river.timezone, dateForDefaults)
    : localDateInTz(river.timezone, dateForDefaults);
  const localTime = allowTestOverrides
    ? url.searchParams.get("localTime") ??
      localTimeInTz(river.timezone, dateForDefaults)
    : localTimeInTz(river.timezone, dateForDefaults);
  const latest = resolveLatestRefreshSlot({
    localDate,
    localTime,
    timezone: river.timezone,
    run,
    schedule: river.conditionRefreshSchedule,
  });
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

function throwOnStorageError(
  operation: string,
  error: { message?: string } | null,
): void {
  if (error) {
    throw new Error(`${operation}: ${error.message ?? "storage failed"}`);
  }
}

if (import.meta.main) {
  Deno.serve((req) => handleRiverRunRequest(req));
}
