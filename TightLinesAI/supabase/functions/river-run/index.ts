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
  getLatestPriorActivity,
  getPrimaryHydraulicSource,
  getPrimaryWeatherPoint,
  getPushConditionsForDate,
  getRecentDailyPushConditions,
  getRunTemperatureSources,
  type LastSupportivePushConditions,
  listPublishedConfigurations,
  listVisibleRiverRuns,
  metricValue,
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
  type PushWindowConditions,
  readConditionsSuggestBaselines,
  readOrBuildRiverLiveConditions,
  readOrRefreshFishCountSource,
  readOrRefreshRiverRunFishCount,
  readTimingObservations,
  type RecentDailyPushConditions,
  type RefreshSlot,
  resolveConditionsSuggestCheckpointState,
  resolveFlowBand,
  resolveLatestRefreshSlot,
  resolveNextConditionRefresh,
  resolvePushReadWindow,
  resolveRunStage,
  resolveSeasonalZone,
  resolveWaterTemperatureRead,
  RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS,
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  type RiverLiveConditions,
  type RiverLiveMetricId,
  type RiverLiveSeasonalContext,
  type RiverProfile,
  type RiverRunConditionRefresh,
  type RiverRunConditionsSuggestBaseline,
  type RiverRunFetch,
  type RiverRunFishCountRead,
  type RiverRunProfile,
  type RiverRunReasonCode,
  staticConfigurationVersionForRun,
  type StoredConditionRefresh,
  type StoredDailySnapshot,
  type SupabaseLikeClient,
  upsertConditionRefresh,
  upsertDailySnapshot,
  upsertTimingObservationFromConditionRefresh,
  validateConfigurationRevision,
} from "../_shared/riverRunEngine/index.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";
import {
  isAdminEmail,
  resolveServerSubscriptionTier,
} from "../_shared/appAccess.ts";
import {
  FREE_TRIAL_PROFILE_SELECT,
  freeRiverRunTrialAvailable,
  type FreeTrialProfileRow,
} from "../_shared/freeTrialAccess.ts";

// Bump whenever response semantics change so hourly refresh rows built by an
// older deployment cannot mask the corrected live behavior.
const ENGINE_VERSION = "river-run-v1.17.0";
const CONFIG_VERSION = PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion;
const RIVER_RUN_SNAPSHOT_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 60 },
  { windowSeconds: 86400, maxRequests: 1000 },
];
const PROVIDER_TIMEOUT_MS = 8_000;
const INTERNAL_KEY_HEADER = "x-river-run-internal-key";
const CLIENT_CAPABILITIES_HEADER = "x-finfindr-river-run-capabilities";
const MIDWEST_OWNER_REVIEW_CAPABILITY = "midwest-owner-review-v1";
const MIDWEST_OWNER_REVIEW_RIVER_IDS = new Set([
  "trail_creek",
  "kewaunee_river",
]);
const FALL_2026_OWNER_REVIEW_CAPABILITY = "fall-2026-owner-review-v1";
const FALL_2026_OWNER_REVIEW_RIVER_IDS = new Set([
  "clackamas",
  "manitowoc",
  "oswego",
]);

function ownerReviewDraftRiverIdsForClient(req: Request): Set<string> {
  const capabilities = new Set(
    (req.headers.get(CLIENT_CAPABILITIES_HEADER) ?? "")
      .split(",")
      .map((capability) => capability.trim())
      .filter(Boolean),
  );
  const supportsMidwest = capabilities.has(MIDWEST_OWNER_REVIEW_CAPABILITY);
  const supportsFall2026 = capabilities.has(FALL_2026_OWNER_REVIEW_CAPABILITY);
  return new Set(
    RIVER_RUN_DRAFT_RIVER_PROFILES
      .filter((river) =>
        (supportsMidwest ||
          !MIDWEST_OWNER_REVIEW_RIVER_IDS.has(river.riverId)) &&
        (supportsFall2026 ||
          !FALL_2026_OWNER_REVIEW_RIVER_IDS.has(river.riverId))
      )
      .map((river) => river.riverId),
  );
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      `Content-Type, Authorization, apikey, x-user-token, ${INTERNAL_KEY_HEADER}, ${CLIENT_CAPABILITIES_HEADER}`,
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
  seasonalContextsByMetric?: Partial<
    Record<RiverLiveMetricId, RiverLiveSeasonalContext | null>
  >;
  now?: Date;
  engineVersion?: string;
  configVersion?: string;
  configSource?: "static" | "database";
  publicEnabled?: boolean;
  releasedRunIds?: readonly string[] | "all";
  internalSecret?: string;
  allowTestOverrides?: boolean;
};

// This is the catalog currently served by production. New profiles can be
// owner-approved and committed without becoming reachable by installed app
// builds. Production expansion requires an explicit RIVER_RUN_RELEASED_RUN_IDS
// update after client and backend release checks pass.
const LEGACY_RELEASED_RUN_IDS = new Set([
  "pere_marquette_fall_chinook",
  "pere_marquette_fall_coho",
  "pere_marquette_fall_steelhead",
  "betsie_fall_chinook",
  "betsie_fall_coho",
  "betsie_fall_steelhead",
  "big_manistee_fall_chinook",
  "big_manistee_fall_coho",
  "big_manistee_fall_steelhead",
  "muskegon_fall_chinook",
  "muskegon_fall_coho",
  "muskegon_fall_steelhead",
  "st_joseph_fall_chinook",
  "st_joseph_fall_coho",
  "st_joseph_fall_steelhead",
  "grand_fall_chinook",
  "grand_fall_coho",
  "grand_fall_steelhead",
  "platte_fall_chinook",
  "platte_fall_coho",
  "platte_fall_steelhead",
  "white_fall_chinook",
  "white_fall_coho",
  "white_fall_steelhead",
]);

type ConditionRefreshRow = {
  river_id: string;
  run_id: string;
  local_date: string;
  refresh_slot: RefreshSlot;
  condition_refresh_at?: string;
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
  todayReadsStatus: "available" | "unavailable";
  todayReads: PushWindowRead[];
  currentWindow?: PushWindowRead;
  lastSupportiveConditions?: LastSupportivePushConditions;
};

type PushWindowRead = PushWindowConditions & {
  startTime: string;
  endTime: string;
  isCurrent: boolean;
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

function releasedRuntimeCatalog(
  catalog: {
    rivers: RiverProfile[];
    runs: RiverRunProfile[];
    configVersionByRun: Map<string, string>;
  },
  deps: RiverRunHandlerDeps,
) {
  // Explicit injected catalogs are test/review boundaries and retain their
  // supplied runs unless the caller also supplies a release set.
  const configured = deps.releasedRunIds ??
    (deps.rivers || deps.runs
      ? "all"
      : releasedRunIdsFromEnvironment(catalog.runs));
  if (configured === "all") return catalog;
  const released = new Set(configured);
  const runs = catalog.runs.filter((run) => released.has(run.runId));
  const riverIds = new Set(runs.map((run) => run.riverId));
  return {
    rivers: catalog.rivers.filter((river) => riverIds.has(river.riverId)),
    runs,
    configVersionByRun: new Map(
      [...catalog.configVersionByRun].filter(([runId]) => released.has(runId)),
    ),
  };
}

function releasedRunIdsFromEnvironment(
  availableRuns: readonly RiverRunProfile[],
): readonly string[] | "all" {
  const raw = Deno.env.get("RIVER_RUN_RELEASED_RUN_IDS")?.trim();
  if (!raw) return [...LEGACY_RELEASED_RUN_IDS];
  if (raw === "*") return "all";
  const available = new Set(availableRuns.map((run) => run.runId));
  const requested = [
    ...new Set(
      raw.split(",").map((id) => id.trim()).filter(
        Boolean,
      ),
    ),
  ];
  const invalid = requested.filter((runId) => !available.has(runId));
  if (!requested.length || invalid.length) {
    console.error("[river-run] invalid released-run configuration", {
      invalidRunIds: invalid,
    });
    return [...LEGACY_RELEASED_RUN_IDS];
  }
  return requested;
}

export async function handleRiverRunRequest(
  req: Request,
  deps: RiverRunHandlerDeps = {},
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }
  const url = new URL(req.url);
  if (
    req.method === "GET" && url.pathname.endsWith("/review/rivers")
  ) {
    return await handleOwnerReviewCatalog(req, deps);
  }
  if (
    req.method === "GET" && url.pathname.endsWith("/review/snapshot")
  ) {
    return await handleOwnerReviewSnapshot(req, url, deps);
  }
  const resolvedCatalog = await resolveRuntimeCatalog(deps);
  if (resolvedCatalog instanceof Response) return resolvedCatalog;
  const catalog = releasedRuntimeCatalog(resolvedCatalog, deps);
  const rivers = catalog.rivers;
  const runs = catalog.runs;
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
  const profileResult = await client
    .from("profiles")
    .select(FREE_TRIAL_PROFILE_SELECT)
    .eq("id", auth.userId)
    .maybeSingle();
  const profile = profileResult.data as FreeTrialProfileRow | null;
  const profileError = profileResult.error;
  if (profileError) {
    console.error("[river-run] subscription profile read failed", {
      userId: auth.userId,
      message: profileError.message,
    });
    return jsonError(
      "River Run access is temporarily unavailable.",
      "subscription_check_unavailable",
      503,
    );
  }
  const tier = resolveServerSubscriptionTier(
    typeof profile?.subscription_tier === "string"
      ? profile.subscription_tier
      : null,
    auth.email,
  );
  const timing = resolveRequestTiming(
    url,
    river,
    run,
    deps.now ?? new Date(),
    deps.allowTestOverrides === true,
  );
  const liveConditionsTiming = resolveRiverLiveConditionsTiming({
    url,
    river,
    runs: deps.runs ?? RIVER_RUN_RUN_PROFILES,
    fallbackRun: run,
    now: deps.now ?? new Date(),
    allowTestOverrides: deps.allowTestOverrides === true,
  });
  const freeTrialKey: FreeRiverRunTrialKey = {
    riverId,
    runId,
    presentationState: presentation.state,
    localDate: timing.localDate,
    refreshSlot: timing.refreshSlot,
    engineVersion,
    configVersion,
  };
  const freeTrialUnused = freeRiverRunTrialAvailable(profile);
  if (
    tier === "free" && !freeTrialUnused &&
    !freeRiverRunTrialMatches(profile, freeTrialKey)
  ) {
    return jsonError(
      "Your free River Migration read has already expired. Subscribe for current reports.",
      "subscription_required",
      403,
    );
  }
  const rateLimit = await checkUserRateLimit(client, {
    userId: auth.userId,
    feature: "river_run_snapshot",
    rules: RIVER_RUN_SNAPSHOT_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }
  try {
    const providerFetch = deps.fetchFn ?? fetch;
    const [result, riverConditions, fishCounts] = await Promise.all([
      readOrBuildSnapshot({
        client,
        river,
        run,
        timing,
        engineVersion,
        configVersion,
        fetchFn: providerFetch,
        gaugeObservations: deps.gaugeObservations,
        waterTemperatureObservationsBySource:
          deps.waterTemperatureObservationsBySource,
        weatherSnapshot: deps.weatherSnapshot,
      }),
      readOrBuildRiverLiveConditions({
        client,
        river,
        localDate: liveConditionsTiming.localDate,
        refreshSlot: liveConditionsTiming.refreshSlot,
        refreshAtUtc: liveConditionsTiming.refreshAtUtc,
        fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
        gaugeObservations: deps.gaugeObservations,
        waterTemperatureObservationsBySource:
          deps.waterTemperatureObservationsBySource,
        seasonalContextsByMetric: deps.seasonalContextsByMetric,
      }),
      readOrRefreshRiverRunFishCount({
        client,
        river,
        species: run.species,
        fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
        now: deps.now ?? new Date(),
      }),
    ]);
    const pushHistory = await resolvePushHistoryContext({
      client,
      dailySnapshot: result.dailySnapshot,
      condition: result.condition,
      rulesVersion: run.push?.version ?? "",
    });
    if (tier === "free" && freeTrialUnused) {
      const claimed = await claimFreeRiverRunTrial(
        client,
        auth.userId,
        freeTrialKey,
      );
      if (!claimed) {
        return jsonError(
          "Your free River Migration read has already been used. Subscribe for current reports.",
          "subscription_required",
          403,
        );
      }
    }
    return jsonResponse({
      ...shapeSnapshotResponse({
        ...result,
        river,
        run,
        timing,
        pushHistory,
        presentation,
        riverConditions,
        fishCounts,
      }),
      accessTier: tier === "free" ? "free_trial" : "angler",
    });
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

async function handleOwnerReviewCatalog(
  req: Request,
  deps: RiverRunHandlerDeps,
): Promise<Response> {
  const client = deps.createAdminClient?.() ?? createDefaultAdminClient();
  const auth = await authenticateSnapshotRequest(req, client);
  if (auth instanceof Response) return auth;
  if (!isAdminEmail(auth.email)) {
    return jsonError(
      "Owner-review access is restricted.",
      "river_run_review_forbidden",
      403,
    );
  }

  const compatibleDraftRiverIds = ownerReviewDraftRiverIdsForClient(req);
  const compatibleDraftRivers = RIVER_RUN_DRAFT_RIVER_PROFILES.filter((river) =>
    compatibleDraftRiverIds.has(river.riverId)
  );
  const compatibleDraftRuns = RIVER_RUN_DRAFT_RUN_PROFILES.filter((run) =>
    compatibleDraftRiverIds.has(run.riverId)
  );
  const riversById = new Map(
    [...RIVER_RUN_RIVER_PROFILES, ...compatibleDraftRivers].map(
      (river) => [river.riverId, river],
    ),
  );
  const runsById = new Map(
    [...RIVER_RUN_RUN_PROFILES, ...compatibleDraftRuns].map(
      (run) => [run.runId, run],
    ),
  );
  const states = new Map<string, {
    state: string;
    rivers: Array<{
      riverId: string;
      displayName: string;
      runs: Array<{
        runId: string;
        displayName: string;
        species: string;
        season: string;
        supportStatus: string;
      }>;
    }>;
  }>();

  for (const river of riversById.values()) {
    const riverRuns = [...runsById.values()]
      .filter((run) => run.riverId === river.riverId)
      .map((run) => ({
        runId: run.runId,
        displayName: run.displayName,
        species: run.species,
        season: run.season,
        supportStatus: river.supportStatus,
      }));
    if (riverRuns.length === 0) continue;
    const placements = river.presentationContexts?.length
      ? river.presentationContexts
      : [{ state: river.state, displayName: river.displayName }];
    for (const placement of placements) {
      const state = states.get(placement.state) ?? {
        state: placement.state,
        rivers: [],
      };
      state.rivers.push({
        riverId: river.riverId,
        displayName: placement.displayName ?? river.displayName,
        runs: riverRuns,
      });
      states.set(placement.state, state);
    }
  }

  return jsonResponse({ states: [...states.values()] });
}

async function handleOwnerReviewSnapshot(
  req: Request,
  url: URL,
  deps: RiverRunHandlerDeps,
): Promise<Response> {
  const riverId = url.searchParams.get("riverId") ?? "";
  const runId = url.searchParams.get("runId") ?? "";
  const requestedPresentationState =
    url.searchParams.get("presentationState")?.trim().toUpperCase() ?? "";
  const compatibleDraftRiverIds = ownerReviewDraftRiverIdsForClient(req);
  const reviewRivers = [
    ...RIVER_RUN_RIVER_PROFILES,
    ...RIVER_RUN_DRAFT_RIVER_PROFILES.filter((river) =>
      compatibleDraftRiverIds.has(river.riverId)
    ),
  ];
  const reviewRuns = [
    ...RIVER_RUN_RUN_PROFILES,
    ...RIVER_RUN_DRAFT_RUN_PROFILES.filter((run) =>
      compatibleDraftRiverIds.has(run.riverId)
    ),
  ];
  const river = reviewRivers.find((item) => item.riverId === riverId);
  const run = reviewRuns.find((item) =>
    item.runId === runId && item.riverId === riverId
  );
  if (!river || !run) {
    return jsonError(
      "Owner-review River Run profile not found.",
      "river_run_review_not_found",
      404,
    );
  }

  const presentation = resolveSnapshotPresentation(
    river,
    requestedPresentationState,
  );
  if (!presentation) {
    return jsonError(
      "A valid state presentation is required for this owner-review River Run.",
      "river_run_review_presentation_not_found",
      400,
    );
  }

  const client = deps.createAdminClient?.() ?? createDefaultAdminClient();
  const auth = await authenticateSnapshotRequest(req, client);
  if (auth instanceof Response) return auth;
  if (!isAdminEmail(auth.email)) {
    return jsonError(
      "Owner-review access is restricted.",
      "river_run_review_forbidden",
      403,
    );
  }

  const now = deps.now ?? new Date();
  const timing = resolveRequestTiming(url, river, run, now, false);
  const liveConditionsTiming = resolveRiverLiveConditionsTiming({
    url,
    river,
    runs: reviewRuns,
    fallbackRun: run,
    now,
    allowTestOverrides: false,
  });
  const configVersion = RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS.find(
    (document) => document.river.riverId === riverId,
  )?.configVersion ?? staticConfigurationVersionForRun(runId);
  const engineVersion = deps.engineVersion ?? ENGINE_VERSION;
  const providerFetch = deps.fetchFn ?? fetch;

  try {
    const [result, riverConditions, fishCounts] = await Promise.all([
      readOrBuildSnapshot({
        client,
        river,
        run,
        timing,
        engineVersion,
        configVersion,
        fetchFn: providerFetch,
        gaugeObservations: deps.gaugeObservations,
        waterTemperatureObservationsBySource:
          deps.waterTemperatureObservationsBySource,
        weatherSnapshot: deps.weatherSnapshot,
      }),
      readOrBuildRiverLiveConditions({
        client,
        river,
        localDate: liveConditionsTiming.localDate,
        refreshSlot: liveConditionsTiming.refreshSlot,
        refreshAtUtc: liveConditionsTiming.refreshAtUtc,
        fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
        gaugeObservations: deps.gaugeObservations,
        waterTemperatureObservationsBySource:
          deps.waterTemperatureObservationsBySource,
        seasonalContextsByMetric: deps.seasonalContextsByMetric,
      }),
      readOrRefreshRiverRunFishCount({
        client,
        river,
        species: run.species,
        fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
        now,
      }),
    ]);
    const pushHistory = await resolvePushHistoryContext({
      client,
      dailySnapshot: result.dailySnapshot,
      condition: result.condition,
      rulesVersion: run.push?.version ?? "",
    });
    return jsonResponse(shapeSnapshotResponse({
      ...result,
      river,
      run,
      timing,
      pushHistory,
      presentation,
      riverConditions,
      fishCounts,
    }));
  } catch (error) {
    console.error("[river-run] owner-review snapshot failed", {
      riverId,
      runId,
      message: error instanceof Error ? error.message : String(error),
    });
    return jsonError(
      "Owner-review River Run is temporarily unavailable.",
      "river_run_review_temporarily_unavailable",
      503,
    );
  }
}

async function resolvePushHistoryContext(input: {
  client: SupabaseLikeClient;
  dailySnapshot: StoredDailySnapshot;
  condition: StoredConditionRefresh;
  rulesVersion: string;
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
  const currentWindow = pushWindowRead({
    localDate: input.condition.localDate,
    refreshSlot: input.condition.refreshSlot,
    conditionRefreshAt: input.condition.conditionRefreshAt,
    score: input.condition.push.score,
    label: input.condition.push.label,
  }, true);
  const todayResult = await getPushConditionsForDate(input.client, {
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    localDate: currentDate,
    throughConditionRefreshAt: input.condition.conditionRefreshAt,
    rulesVersion: input.rulesVersion,
  });
  const todayReadsStatus = todayResult.error
    ? "unavailable" as const
    : "available" as const;
  const todayReads = (todayResult.data ?? []).flatMap((read) => {
    const resolved = pushWindowRead(
      read,
      read.refreshSlot === currentWindow?.refreshSlot,
    );
    return resolved ? [resolved] : [];
  });
  const windowContext = {
    todayReadsStatus,
    todayReads: todayReads.length > 0
      ? todayReads
      : currentWindow
      ? [currentWindow]
      : [],
    ...(currentWindow ? { currentWindow } : {}),
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
      ...windowContext,
    };
  }

  if (!afterTrackingStart) {
    return {
      ...base,
      status: "not_started",
      recentDailyReadsStatus: "available",
      recentDailyReads: [],
      ...windowContext,
    };
  }

  const recentDailyReads = await resolveRecentDailyPushReads({
    client: input.client,
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    trackingStartDate,
    throughDate: beforeTrackingEnd ? addDays(currentDate, -1) : trackingEndDate,
    rulesVersion: input.rulesVersion,
  });

  if (!beforeTrackingEnd) {
    return {
      ...base,
      status: "complete",
      ...recentDailyReads,
      ...windowContext,
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
      ...windowContext,
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
    rulesVersion: input.rulesVersion,
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
      ...windowContext,
    };
  }
  if (!result.found || !result.data) {
    return {
      ...base,
      status: "none_recorded",
      ...recentDailyReads,
      ...windowContext,
    };
  }
  return {
    ...base,
    status: "previously_recorded",
    ...recentDailyReads,
    ...windowContext,
    lastSupportiveConditions: result.data,
  };
}

async function resolveRecentDailyPushReads(input: {
  client: SupabaseLikeClient;
  riverId: string;
  runId: string;
  trackingStartDate: string;
  throughDate: string;
  rulesVersion: string;
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

function pushWindowRead(
  read: {
    localDate: string;
    refreshSlot: string;
    conditionRefreshAt: string;
    score: number | null | undefined;
    label: string;
  },
  isCurrent: boolean,
): PushWindowRead | undefined {
  if (typeof read.score !== "number" || !Number.isFinite(read.score)) {
    return undefined;
  }
  const effectiveSlot = read.refreshSlot === "21:00"
    ? "20:00"
    : read.refreshSlot;
  return {
    ...read,
    score: read.score,
    refreshSlot: effectiveSlot,
    ...resolvePushReadWindow(effectiveSlot),
    isCurrent,
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

  const fishCountSources = new Map<string, {
    riverId: string;
    source: NonNullable<RiverProfile["fishCountSources"]>[number];
  }>();
  for (const target of targets) {
    for (const source of target.river.fishCountSources ?? []) {
      fishCountSources.set(source.sourceId, {
        riverId: target.river.riverId,
        source,
      });
    }
  }
  const providerFetch = deps.fetchFn ?? fetch;
  const fishCountResults: Array<Record<string, unknown>> = [];
  for (const target of fishCountSources.values()) {
    try {
      const report = await readOrRefreshFishCountSource({
        client,
        riverId: target.riverId,
        source: target.source,
        fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
        now,
        forceRefresh: true,
      });
      fishCountResults.push({
        riverId: target.riverId,
        sourceId: target.source.sourceId,
        reportIdentity: report.reportIdentity,
        fetchStatus: report.fetchStatus,
      });
    } catch (error) {
      failed++;
      fishCountResults.push({
        riverId: target.riverId,
        sourceId: target.source.sourceId,
        error: "refresh_failed",
      });
      console.error("[river-run] fish-count refresh failed", {
        riverId: target.riverId,
        sourceId: target.source.sourceId,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  for (const target of targets) {
    const timing = resolveRequestTiming(
      new URL(req.url),
      target.river,
      target.run,
      now,
      false,
    );
    const liveConditionsTiming = resolveRiverLiveConditionsTiming({
      url: new URL(req.url),
      river: target.river,
      runs: deps.runs,
      fallbackRun: target.run,
      now,
      allowTestOverrides: false,
    });
    try {
      const providerFetch = deps.fetchFn ?? fetch;
      const [snapshot, riverConditions] = await Promise.all([
        readOrBuildSnapshot({
          client,
          river: target.river,
          run: target.run,
          timing,
          engineVersion: deps.engineVersion,
          configVersion: deps.configVersion ??
            deps.configVersionByRun.get(target.run.runId) ??
            CONFIG_VERSION,
          fetchFn: providerFetch,
          gaugeObservations: deps.gaugeObservations,
          waterTemperatureObservationsBySource:
            deps.waterTemperatureObservationsBySource,
          weatherSnapshot: deps.weatherSnapshot,
        }),
        readOrBuildRiverLiveConditions({
          client,
          river: target.river,
          localDate: liveConditionsTiming.localDate,
          refreshSlot: liveConditionsTiming.refreshSlot,
          refreshAtUtc: liveConditionsTiming.refreshAtUtc,
          fetchFn: withTimeoutFetch(providerFetch, PROVIDER_TIMEOUT_MS),
          gaugeObservations: deps.gaugeObservations,
          waterTemperatureObservationsBySource:
            deps.waterTemperatureObservationsBySource,
          seasonalContextsByMetric: deps.seasonalContextsByMetric,
        }),
      ]);
      results.push({
        riverId: target.river.riverId,
        runId: target.run.runId,
        localDate: timing.localDate,
        refreshSlot: timing.refreshSlot,
        conditionRefreshAt: snapshot.condition.conditionRefreshAt,
        dataQuality: snapshot.condition.dataQuality.label,
        gaugeFreshness: snapshot.condition.freshness.gauge,
        weatherFreshness: snapshot.condition.freshness.weather,
        liveConditionsStatus: riverConditions.status,
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
      fishCountSourceCount: fishCountSources.size,
      failedCount: failed,
      results,
      fishCountResults,
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
): Promise<{ userId: string; email: string | null } | Response> {
  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ??
    (authHeader?.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null);
  if (!token) {
    return jsonError("Missing authentication token.", "unauthorized", 401);
  }

  const authClient = (client as {
    auth?: {
      getUser?: (
        token: string,
      ) => Promise<{
        data: { user: { id?: string; email?: string | null } | null };
        error: unknown;
      }>;
    };
  }).auth;
  if (!authClient || typeof authClient.getUser !== "function") {
    return jsonError("Unauthorized.", "unauthorized", 401);
  }

  // Keep the Supabase AuthClient receiver bound. Extracting getUser into a
  // standalone function works in simple mocks but throws in production because
  // the SDK method reads client state through `this`.
  const { data: { user }, error } = await authClient.getUser(token);
  if (error || !user?.id) {
    return jsonError("Unauthorized.", "unauthorized", 401);
  }

  return { userId: user.id, email: user.email ?? null };
}

type FreeRiverRunTrialKey = {
  riverId: string;
  runId: string;
  presentationState: string;
  localDate: string;
  refreshSlot: RefreshSlot;
  engineVersion: string;
  configVersion: string;
};

function freeRiverRunTrialMatches(
  profile: FreeTrialProfileRow | null | undefined,
  key: FreeRiverRunTrialKey,
): boolean {
  return profile?.free_river_run_trial_used_at != null &&
    profile.free_river_run_trial_river_id === key.riverId &&
    profile.free_river_run_trial_run_id === key.runId &&
    profile.free_river_run_trial_presentation_state ===
      key.presentationState &&
    profile.free_river_run_trial_local_date === key.localDate &&
    profile.free_river_run_trial_refresh_slot === key.refreshSlot &&
    profile.free_river_run_trial_engine_version === key.engineVersion &&
    profile.free_river_run_trial_config_version === key.configVersion;
}

async function claimFreeRiverRunTrial(
  client: SupabaseLikeClient,
  userId: string,
  key: FreeRiverRunTrialKey,
): Promise<boolean> {
  const markedAt = new Date().toISOString();
  const { data, error } = await (client as any)
    .from("profiles")
    .update({
      free_river_run_trial_used_at: markedAt,
      free_river_run_trial_river_id: key.riverId,
      free_river_run_trial_run_id: key.runId,
      free_river_run_trial_presentation_state: key.presentationState,
      free_river_run_trial_local_date: key.localDate,
      free_river_run_trial_refresh_slot: key.refreshSlot,
      free_river_run_trial_engine_version: key.engineVersion,
      free_river_run_trial_config_version: key.configVersion,
    })
    .eq("id", userId)
    .is("free_river_run_trial_used_at", null)
    .select(FREE_TRIAL_PROFILE_SELECT)
    .maybeSingle();
  if (error) {
    throw new Error(`claim_free_river_run_trial_failed:${error.message}`);
  }
  if (data && freeRiverRunTrialMatches(data as FreeTrialProfileRow, key)) {
    return true;
  }

  // A concurrent first request may have won the claim. Permit only if it won
  // with this exact report and refresh identity; every other race fails closed.
  const { data: current, error: readError } = await (client as any)
    .from("profiles")
    .select(FREE_TRIAL_PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();
  if (readError) {
    throw new Error(
      `claim_free_river_run_trial_verify_failed:${readError.message}`,
    );
  }
  return freeRiverRunTrialMatches(
    current as FreeTrialProfileRow | null,
    key,
  );
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
    const baselinesResult = await readConditionsSuggestBaselines(input.client, {
      riverId: observedRun.riverId,
      runId: observedRun.runId,
      baselineVersion: observedRun.conditionsSuggest.baselineVersion,
    });
    throwOnStorageError(
      "read Conditions Suggest baselines",
      baselinesResult.error,
    );
    conditionsBaselines = baselinesResult.data;
    conditionsEvidenceByDate = await readConditionsSuggestEvidence(
      input.client,
      observedRun,
      input.localDate,
      baselinesResult.data ?? [],
    );
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
  if (cached.data) {
    const timingObservation = await upsertTimingObservationFromConditionRefresh(
      input.client,
      cached.data,
    );
    throwOnStorageError("store Timing observation", timingObservation.error);
    return cached.data;
  }

  const activityTargetDate = input.refreshSlot >= "21:00"
    ? addDays(input.localDate, 1)
    : input.localDate;
  const previousActivityResult = await getLatestPriorActivity(input.client, {
    riverId: input.river.riverId,
    runId: input.run.runId,
    localDate: input.localDate,
    beforeRefreshSlot: input.refreshSlot,
    targetDate: activityTargetDate,
  });
  throwOnStorageError("read prior Activity", previousActivityResult.error);
  const previousActivity = previousActivityResult.data;

  const pushUnavailable =
    input.run.primitiveCapabilities.push.status === "unavailable";
  if (pushUnavailable) {
    const activityTargetStage = resolveRunStage(input.run, activityTargetDate);
    const activityActive =
      input.run.primitiveCapabilities.activity?.status === "available" &&
      compareLocalDates(
          activityTargetDate,
          activityTargetStage.window.stagingStartDate,
        ) >= 0 &&
      compareLocalDates(
          activityTargetDate,
          activityTargetStage.window.lateEndDate,
        ) <= 0;
    const boundedFetch = withTimeoutFetch(input.fetchFn, PROVIDER_TIMEOUT_MS);
    const fishabilityAvailable =
      input.run.primitiveCapabilities.fishability.status === "available";
    const observedActivity = activityActive &&
      input.run.activity?.dataMode !== "weather_only";
    const primaryHydraulicSource = fishabilityAvailable || observedActivity
      ? getPrimaryHydraulicSource(input.river)
      : null;
    const gaugeObservations = primaryHydraulicSource
      ? input.gaugeObservations ?? await fetchLiveGaugeOrEmpty({
        fetchFn: boundedFetch,
        river: input.river,
        refreshAtUtc: input.refreshAtUtc,
      })
      : [];
    const gauge = primaryHydraulicSource
      ? normalizeGaugeRead({
        observations: gaugeObservations,
        siteId: primaryHydraulicSource.siteId,
        primaryMetric: primaryHydraulicSource.primaryMetric,
        refreshAtUtc: input.refreshAtUtc,
        maxAgeHours: primaryHydraulicSource.maxAgeHours,
        riseThresholds: input.run.activity?.hydraulicTrend
          ? {
            rising24hAbsolute:
              input.run.activity.hydraulicTrend.rising24h.absolute,
            rising24hPercent:
              input.run.activity.hydraulicTrend.rising24h.percent,
            meaningfulRise24hAbsolute:
              input.run.activity.hydraulicTrend.meaningfulRise24h.absolute,
            meaningfulRise24hPercent:
              input.run.activity.hydraulicTrend.meaningfulRise24h.percent,
            sharpRise24hAbsolute:
              input.run.activity.hydraulicTrend.sharpRise24h.absolute,
            sharpRise24hPercent:
              input.run.activity.hydraulicTrend.sharpRise24h.percent,
          }
          : undefined,
      })
      : null;
    const currentHydraulicValue = gauge?.current && primaryHydraulicSource
      ? metricValue(gauge.current, primaryHydraulicSource.primaryMetric)
      : null;
    const flowBand = currentHydraulicValue != null && input.run.fishabilityBands
      ? resolveFlowBand({
        metric: primaryHydraulicSource!.primaryMetric,
        value: currentHydraulicValue,
        fishabilityBands: input.run.fishabilityBands,
      })?.band
      : undefined;
    const weatherSnapshot = activityActive
      ? input.weatherSnapshot ?? await fetchLiveWeatherOrNull({
        fetchFn: boundedFetch,
        river: input.river,
        refreshAtUtc: input.refreshAtUtc,
      })
      : null;
    const weather = normalizeWeatherSnapshot({
      snapshot: weatherSnapshot,
      refreshAtUtc: input.refreshAtUtc,
      localDate: input.localDate,
    });
    const temperatureSources = observedActivity && input.run.waterTemperature
      ? getRunTemperatureSources(input.river, {
        waterTemperature: input.run.waterTemperature,
      })
      : [];
    const temperaturePayload = temperatureSources.length === 0
      ? { observationsBySource: {}, rejectedBySource: {} }
      : input.waterTemperatureObservationsBySource
      ? {
        observationsBySource: input.waterTemperatureObservationsBySource,
        rejectedBySource: {},
      }
      : await fetchLiveWaterTemperatures({
        fetchFn: boundedFetch,
        sources: temperatureSources,
        refreshAtUtc: input.refreshAtUtc,
      });
    const waterTemperature = temperatureSources.length > 0 &&
        input.run.waterTemperature
      ? resolveWaterTemperatureRead({
        sources: temperatureSources,
        sourcePriority: input.run.waterTemperature.sourcePriority,
        observationsBySource: temperaturePayload.observationsBySource,
        rejectedBySource: temperaturePayload.rejectedBySource,
        refreshAtUtc: input.refreshAtUtc,
      })
      : null;
    const measuredTemperature = waterTemperature?.current &&
        waterTemperature.freshness === "fresh" &&
        waterTemperature.smoothedWaterTempF != null
      ? waterTemperature
      : null;
    const primaryWeatherPoint = getPrimaryWeatherPoint(input.river);
    const built = buildConditionRefresh({
      dailySnapshot: input.dailySnapshot,
      localDate: input.localDate,
      refreshSlot: input.refreshSlot,
      movementEngineId: input.run.movementEngineId,
      primitiveCapabilities: input.run.primitiveCapabilities,
      activityRules: activityActive ? input.run.activity : undefined,
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
      previousActivity,
      fishabilityBands: input.run.fishabilityBands,
      gaugeFreshness: gauge?.gaugeFreshness ?? "missing",
      weatherFreshness: weather.weatherFreshness,
      waterTemperatureFreshness: waterTemperature?.freshness ?? "missing",
      conditionsWaterTemperatureFreshness: "missing",
      flowBand,
      currentHydraulicValue,
      hydraulicAbsoluteChange24h: gauge?.flowTrend.absoluteChange24h ?? null,
      hydraulicPercentChange24h: gauge?.flowTrend.percentChange24h ?? null,
      rainSignal: "missing_rain_data",
      flowSignal: gauge?.flowTrend.rawSignal ?? "unknown",
      temperatureSignal: measuredTemperature?.trend.rawSignal ??
        "neutral_missing",
      temperatureSourceType: measuredTemperature?.sourceType ?? "unavailable",
      temperatureIsUpstreamFallback: measuredTemperature?.isUpstreamFallback ??
        false,
      waterTempF: measuredTemperature?.smoothedWaterTempF ?? null,
      missingNonGaugeInputCount:
        (weather.weatherFreshness === "missing" ? 1 : 0) +
        (measuredTemperature ? 0 : 1),
      rainReasonCodes: ["rain_missing"],
      flowReasonCodes: gauge?.flowTrend.reasonCodes ?? [
        "gauge_missing",
        "flow_trend_unknown",
      ],
      temperatureReasonCodes: measuredTemperature?.reasonCodes ?? [
        "temperature_unavailable",
        "temperature_neutral_missing",
      ],
      sourceMetrics: {
        gauge: gauge && primaryHydraulicSource
          ? {
            provider: gauge.provider,
            siteId: gauge.siteId,
            observedAt: gauge.current?.observedAt,
            primaryMetric: primaryHydraulicSource.primaryMetric,
            value: currentHydraulicValue,
            band: flowBand,
            trend: gauge.flowTrend.rawSignal,
            absoluteChange24h: gauge.flowTrend.absoluteChange24h,
            percentChange24h: gauge.flowTrend.percentChange24h,
          }
          : undefined,
        weather: {
          provider: "OPEN_METEO",
          evidenceType: "modeled_grid",
          weatherPointId: primaryWeatherPoint.weatherPointId,
          rain24hIn: weather.rainTotals.rain24hIn,
          rain48hIn: weather.rainTotals.rain48hIn,
          rain72hIn: weather.rainTotals.rain72hIn,
          forecastDaily: weather.forecastDaily,
          hourlyActivityWeather: weather.hourlyActivityWeather,
        },
        ...(observedActivity
          ? {
            waterTemperature: measuredTemperature
              ? {
                provider: measuredTemperature.current?.provider,
                sourceId: measuredTemperature.sourceId,
                siteId: measuredTemperature.current?.siteId,
                seriesId: measuredTemperature.current?.seriesId,
                observedAt: measuredTemperature.current?.observedAt,
                waterTempF: measuredTemperature.smoothedWaterTempF,
                trend: measuredTemperature.trend.rawSignal,
                sourceType: measuredTemperature.sourceType,
                isUpstreamFallback: measuredTemperature.isUpstreamFallback,
                attribution: temperatureSources.find((source) =>
                  source.sourceId === measuredTemperature.sourceId
                )?.attribution,
              }
              : {
                sourceType: "unavailable" as const,
                trend: "neutral_missing" as const,
              },
          }
          : {}),
      },
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
    previousActivity,
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
  const resolved = upserted.data ?? stored;
  const timingObservation = await upsertTimingObservationFromConditionRefresh(
    input.client,
    resolved,
  );
  throwOnStorageError("store Timing observation", timingObservation.error);
  return resolved;
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
  baselines: RiverRunConditionsSuggestBaseline[],
): Promise<ConditionsSuggestEvidenceByDate> {
  const checkpointState = resolveConditionsSuggestCheckpointState(
    run,
    localDate,
  );
  if (!checkpointState.activeCheckpoint) return {};
  const legacyQuery = (client as any)
    .from("river_run_condition_refreshes")
    .select()
    .eq("river_id", run.riverId)
    .eq("run_id", run.runId)
    .gte(
      "local_date",
      checkpointState.activeCheckpoint.observationStartDate,
    )
    .lte("local_date", checkpointState.activeCheckpoint.cutoffDate)
    .order("local_date", { ascending: true })
    .order("condition_refresh_at", { ascending: true });
  const [response, canonicalResult] = await Promise.all([
    legacyQuery,
    readTimingObservations(client, {
      riverId: run.riverId,
      runId: run.runId,
      startDate: checkpointState.activeCheckpoint.observationStartDate,
      endDate: checkpointState.activeCheckpoint.cutoffDate,
    }),
  ]);
  if (response?.error) {
    throw new Error(
      `read Conditions Suggest evidence history: ${
        response.error.message ?? "storage operation failed"
      }`,
    );
  }
  throwOnStorageError(
    "read canonical Timing observations",
    canonicalResult.error,
  );
  const rows = (response?.data ?? []) as ConditionRefreshRow[];
  const compatibleSources = new Set(
    baselines.map((baseline) =>
      `${baseline.gaugeMetric}|${baseline.gaugeSiteId}|${baseline.temperatureSourceId}`
    ),
  );
  const byDate: ConditionsSuggestEvidenceByDate = {};
  for (const row of rows) {
    const evidence = {
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
    const sourceKey =
      `${evidence.gaugeMetric}|${evidence.gaugeSiteId}|${evidence.waterTemperatureSourceId}`;
    const existing = byDate[row.local_date]?.[row.refresh_slot];
    const existingKey = existing
      ? `${existing.gaugeMetric}|${existing.gaugeSiteId}|${existing.waterTemperatureSourceId}`
      : undefined;
    if (
      existing && compatibleSources.has(existingKey ?? "") &&
      !compatibleSources.has(sourceKey)
    ) continue;
    byDate[row.local_date] ??= {};
    byDate[row.local_date][row.refresh_slot] = evidence;
  }
  for (const row of canonicalResult.data ?? []) {
    const sourceKey =
      `${row.gauge_metric}|${row.gauge_site_id}|${row.temperature_source_id}`;
    if (!compatibleSources.has(sourceKey)) continue;
    byDate[row.local_date] ??= {};
    byDate[row.local_date][row.refresh_slot as RefreshSlot] = {
      gaugeFreshness: row
        .gauge_freshness as RiverRunConditionRefresh["freshness"]["gauge"],
      gaugeValue: row.gauge_value,
      gaugeMetric: row.gauge_metric,
      gaugeSiteId: row.gauge_site_id,
      waterTemperatureFreshness: row
        .temperature_freshness as RiverRunConditionRefresh["freshness"][
          "conditionsWaterTemperature"
        ],
      waterTempF: row.water_temp_f,
      waterTemperatureSourceId: row.temperature_source_id,
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
    foundationReachIds?: string[];
    regulationReminderCopy: string;
  };
  pushHistory: PushHistoryContext;
  timing: {
    localDate: string;
    localTime: string;
    refreshAtUtc: string;
    refreshSlot: RefreshSlot;
  };
  riverConditions: RiverLiveConditions;
  fishCounts?: RiverRunFishCountRead;
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
    seasonalZone: resolveSeasonalZone({
      river: input.river,
      run: input.run,
      stage: input.dailySnapshot.runStage,
      localDate: input.dailySnapshot.localDate,
      presentationReachIds: input.presentation.foundationReachIds,
    }),
    conditionsSuggest: input.dailySnapshot.conditionsSuggest,
    push: input.condition.push,
    pushHistory: input.pushHistory,
    fishability: input.condition.fishability,
    activity: input.condition.activity,
    fishInRiver: input.dailySnapshot.fishInRiver,
    riverConditions: input.riverConditions,
    fishCounts: input.fishCounts,
    gauge: input.condition.sourceMetrics.gauge,
    weather: input.condition.sourceMetrics.weather,
    waterTemperature: input.condition.sourceMetrics.waterTemperature,
    conditionsWaterTemperature:
      input.condition.sourceMetrics.conditionsWaterTemperature,
    freshness: input.condition.freshness,
    dataQuality: input.condition.dataQuality,
    interpretationNote: input.condition.interpretationNote,
    secondaryNote: input.condition.sourceMetrics.weather?.forecastDaily?.length
      ? "Forecast weather informs Activity Outlook only; Fishing Shape remains observation-led."
      : undefined,
    safety: {
      regulationReminder: input.presentation.regulationReminderCopy,
      gaugeBasis: publicRiverRunTerminology(input.river.gaugeLimitationCopy),
      activityDisclaimer:
        "Fishing Shape describes presentation conditions, not wading or boating safety.",
    },
    engineVersion: input.condition.engineVersion,
    configVersion: input.condition.configVersion,
  };
}

function publicRiverRunTerminology(value: string): string {
  return value
    .replaceAll("Fishability", "Fishing Shape")
    .replaceAll("Fish In River", "Seasonal Presence");
}

function resolveSnapshotPresentation(
  river: RiverProfile,
  requestedState: string,
): {
  state: string;
  displayName?: string;
  defaultReachId?: string;
  foundationReachIds?: string[];
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

function resolveRiverLiveConditionsTiming(input: {
  url: URL;
  river: RiverProfile;
  runs: RiverRunProfile[];
  fallbackRun: RiverRunProfile;
  now: Date;
  allowTestOverrides: boolean;
}): RequestTiming {
  const refreshAtUtc = input.allowTestOverrides
    ? input.url.searchParams.get("refreshAtUtc") ?? input.now.toISOString()
    : input.now.toISOString();
  const dateForDefaults = new Date(refreshAtUtc);
  const localDate = input.allowTestOverrides
    ? input.url.searchParams.get("localDate") ??
      localDateInTz(input.river.timezone, dateForDefaults)
    : localDateInTz(input.river.timezone, dateForDefaults);
  const localTime = input.allowTestOverrides
    ? input.url.searchParams.get("localTime") ??
      localTimeInTz(input.river.timezone, dateForDefaults)
    : localTimeInTz(input.river.timezone, dateForDefaults);
  const hour = localTime.slice(0, 2);
  return {
    localDate,
    localTime,
    refreshAtUtc,
    // Gauge Read is intentionally independent of the four-hour primitive
    // scoring cadence. The existing hourly protected job warms this key, and
    // the first in-hour request safely fills it if the job has not run yet.
    refreshSlot: `${hour}:00`,
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
