import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  handleRiverRunRequest as handleRiverRunRequestBase,
  type RiverRunHandlerDeps,
} from "./index.ts";
import {
  addDays,
  type AuditedObservedRiverRunProfile,
  type AuditedRiverRunProfile,
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_RIVER_PROFILE,
  buildConditionRefresh,
  buildDailySnapshot,
  type NormalizedGaugeObservation,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type RiverRunConditionRefreshRow,
  type RiverRunDailySnapshotRow,
  serializeConditionRefresh,
  serializeDailySnapshot,
  type SupabaseLikeClient,
} from "../_shared/riverRunEngine/index.ts";

class MockQuery {
  filters: Record<string, unknown> = {};
  ranges: Array<{ column: string; op: "gte" | "lte"; value: unknown }> = [];
  orderColumn: string | null = null;
  orderAscending = true;
  limitCount: number | null = null;
  private upsertedRow: Record<string, unknown> | null = null;
  private updatedValues: Record<string, unknown> | null = null;

  constructor(
    private readonly client: MockClient,
    private readonly tableName: string,
  ) {}

  select(): MockQuery {
    return this;
  }

  upsert(
    row: Record<string, unknown>,
    options?: { onConflict?: string },
  ): MockQuery {
    this.upsertedRow = row;
    this.client.upserts.push({ table: this.tableName, row, options });
    this.client.rows[this.tableName] ??= [];
    this.client.rows[this.tableName].push(row);
    return this;
  }

  update(values: Record<string, unknown>): MockQuery {
    this.updatedValues = values;
    return this;
  }

  eq(column: string, value: unknown): MockQuery {
    this.filters[column] = value;
    this.client.filters.push({
      table: this.tableName,
      column,
      value,
      op: "eq",
    });
    return this;
  }

  is(column: string, value: unknown): MockQuery {
    return this.eq(column, value);
  }

  gte(column: string, value: unknown): MockQuery {
    this.ranges.push({ column, op: "gte", value });
    this.client.filters.push({
      table: this.tableName,
      column,
      value,
      op: "gte",
    });
    return this;
  }

  lte(column: string, value: unknown): MockQuery {
    this.ranges.push({ column, op: "lte", value });
    this.client.filters.push({
      table: this.tableName,
      column,
      value,
      op: "lte",
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQuery {
    this.orderColumn = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number): MockQuery {
    this.limitCount = count;
    return this;
  }

  maybeSingle(): Promise<
    {
      data: Record<string, unknown> | null;
      error: { message: string } | null;
    }
  > {
    if (
      this.client.historyReadError &&
      this.ranges.some((range) => range.column === "push->score")
    ) {
      return Promise.resolve({
        data: null,
        error: { message: "history offline" },
      });
    }
    const matched = this.matchingRows()[0] ?? null;
    if (matched && this.updatedValues) {
      Object.assign(matched, this.updatedValues);
    }
    return Promise.resolve({
      data: this.upsertedRow ?? matched,
      error: null,
    });
  }

  then<
    TResult1 = {
      data: Record<string, unknown>[];
      error: { message: string } | null;
    },
    TResult2 = never,
  >(
    onfulfilled?:
      | ((
        value: {
          data: Record<string, unknown>[];
          error: { message: string } | null;
        },
      ) => TResult1 | PromiseLike<TResult1>)
      | null,
    _onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    const isConditionHistory =
      this.tableName === "river_run_condition_refreshes";
    const isSupportiveHistory = this.ranges.some((range) =>
      range.column === "push->score"
    );
    const isRecentDailyHistory =
      this.ranges.some((range) => range.column === "local_date") &&
      !isSupportiveHistory &&
      !this.ranges.some((range) => range.column === "condition_refresh_at");
    const response = (this.client.historyReadError && isConditionHistory &&
        isSupportiveHistory) ||
        (this.client.recentHistoryReadError && isConditionHistory &&
          isRecentDailyHistory)
      ? {
        data: [],
        error: {
          message: isSupportiveHistory
            ? "history offline"
            : "recent history offline",
        },
      }
      : { data: this.matchingRows(), error: null };
    return Promise.resolve(response).then(onfulfilled ?? undefined);
  }

  private matchingRows(): Record<string, unknown>[] {
    const rows = this.client.rows[this.tableName] ?? [];
    const matches = rows.filter((row) =>
      Object.entries(this.filters).every(([column, value]) =>
        this.rowValue(row, column) === value
      ) &&
      this.ranges.every((range) => {
        const actual = this.rowValue(row, range.column);
        if (
          (typeof actual !== "string" && typeof actual !== "number") ||
          typeof actual !== typeof range.value
        ) {
          return false;
        }
        if (typeof actual === "number" && typeof range.value === "number") {
          return range.op === "gte"
            ? actual >= range.value
            : actual <= range.value;
        }
        if (typeof actual === "string" && typeof range.value === "string") {
          return range.op === "gte"
            ? actual >= range.value
            : actual <= range.value;
        }
        return false;
      })
    );
    if (this.orderColumn) {
      const column = this.orderColumn;
      matches.sort((a, b) => {
        const left = this.rowValue(a, column);
        const right = this.rowValue(b, column);
        const comparison = left === right
          ? 0
          : left == null
          ? -1
          : right == null
          ? 1
          : left < right
          ? -1
          : 1;
        return this.orderAscending ? comparison : -comparison;
      });
    }
    return this.limitCount == null
      ? matches
      : matches.slice(0, this.limitCount);
  }

  private rowValue(
    row: Record<string, unknown>,
    column: string,
  ): unknown {
    return column.split("->").reduce<unknown>((value, part) => {
      if (!value || typeof value !== "object") return undefined;
      return (value as Record<string, unknown>)[part];
    }, row);
  }
}

class MockClient implements SupabaseLikeClient {
  rows: Record<string, Record<string, unknown>[]> = {};
  upserts: Array<{
    table: string;
    row: Record<string, unknown>;
    options?: { onConflict?: string };
  }> = [];
  filters: Array<
    { table: string; column: string; value: unknown; op: string }
  > = [];
  readonly historyReadError: boolean;
  readonly recentHistoryReadError: boolean;
  auth: {
    getUser: (
      token: string,
    ) => Promise<{
      data: { user: { id: string } | null };
      error: { message: string } | null;
    }>;
  };

  constructor(
    private readonly options: {
      validToken?: string;
      subscriptionTier?: "free" | "angler" | "master_angler";
      rateLimitAllowed?: boolean;
      historyReadError?: boolean;
      recentHistoryReadError?: boolean;
      email?: string;
      freeRiverRunTrial?: Partial<{
        usedAt: string | null;
        riverId: string | null;
        runId: string | null;
        presentationState: string | null;
        localDate: string | null;
        refreshSlot: string | null;
        engineVersion: string | null;
        configVersion: string | null;
      }>;
    } = {},
  ) {
    this.rows.profiles = [{
      id: "user-1",
      subscription_tier: options.subscriptionTier ?? "angler",
      free_recommender_trial_used_at: null,
      free_water_read_trial_used_at: null,
      free_today_bite_full_used_at: null,
      free_river_run_trial_used_at: options.freeRiverRunTrial?.usedAt ?? null,
      free_river_run_trial_river_id: options.freeRiverRunTrial?.riverId ?? null,
      free_river_run_trial_run_id: options.freeRiverRunTrial?.runId ?? null,
      free_river_run_trial_presentation_state:
        options.freeRiverRunTrial?.presentationState ?? null,
      free_river_run_trial_local_date: options.freeRiverRunTrial?.localDate ??
        null,
      free_river_run_trial_refresh_slot:
        options.freeRiverRunTrial?.refreshSlot ?? null,
      free_river_run_trial_engine_version:
        options.freeRiverRunTrial?.engineVersion ?? null,
      free_river_run_trial_config_version:
        options.freeRiverRunTrial?.configVersion ?? null,
    }];
    this.historyReadError = options.historyReadError === true;
    this.recentHistoryReadError = options.recentHistoryReadError === true;
    this.auth = {
      getUser: (token: string) =>
        Promise.resolve(
          token === (this.options.validToken ?? "valid-token")
            ? {
              data: {
                user: {
                  id: "user-1",
                  email: this.options.email ?? "angler@example.com",
                },
              },
              error: null,
            }
            : { data: { user: null }, error: { message: "invalid token" } },
        ),
    };
  }

  from(table: string): MockQuery {
    return new MockQuery(this, table);
  }

  rpc(
    name: string,
    args: Record<string, unknown>,
  ): Promise<{ data: Record<string, unknown>; error: null }> {
    assertEquals(name, "consume_app_feature_rate_limit");
    assertEquals(args.in_feature, "river_run_snapshot");
    const allowed = this.options.rateLimitAllowed !== false;
    return Promise.resolve({
      data: {
        allowed,
        feature: "river_run_snapshot",
        window_seconds: args.in_window_seconds,
        max_requests: args.in_max_requests,
        request_count: allowed ? 1 : args.in_max_requests,
        remaining: allowed ? 59 : 0,
        reset_at: "2026-09-20T20:31:00.000Z",
        retry_after_seconds: 60,
      },
      error: null,
    });
  }
}

const enabledRun: AuditedObservedRiverRunProfile = {
  ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  publicAudit: { isEnabled: true },
};

const disabledRun: AuditedObservedRiverRunProfile = {
  ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  publicAudit: { isEnabled: false },
};

const enabledBetsieRun: AuditedRiverRunProfile = {
  ...BETSIE_FALL_CHINOOK_RUN_PROFILE,
  publicAudit: { isEnabled: true },
};

const enabledBetsieCohoRun: AuditedRiverRunProfile = {
  ...BETSIE_FALL_COHO_RUN_PROFILE,
  publicAudit: { isEnabled: true },
};

const enabledBetsieSteelheadRun: AuditedRiverRunProfile = {
  ...BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  publicAudit: { isEnabled: true },
};

const gaugeObservation: NormalizedGaugeObservation = {
  provider: "USGS",
  siteId: "04122500",
  observedAt: "2026-09-20T19:30:00.000Z",
  flow_cfs: 600,
  source: "usgs_continuous_values",
};

const envData = {
  fetched_at: "2026-09-20T19:00:00.000Z",
  hourly_precipitation_in: Array.from({ length: 72 }, (_, index) => ({
    time_utc: new Date(
      Date.parse("2026-09-17T21:00:00.000Z") + index * 3600_000,
    )
      .toISOString(),
    value: 0,
  })),
};

const grandActivityWeatherData = {
  ...envData,
  weather_available: true,
  hourly_activity_weather: Array.from({ length: 24 }, (_, hour) => ({
    time_local: `2026-09-20T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: 55,
    shortwave_w_m2: hour >= 7 && hour < 20 ? 280 : 0,
    clear_sky_shortwave_w_m2: hour >= 7 && hour < 20 ? 600 : 0,
    precipitation_in: 0,
  })),
};

function handleRiverRunRequest(
  req: Request,
  deps: RiverRunHandlerDeps = {},
): Promise<Response> {
  return handleRiverRunRequestBase(req, {
    publicEnabled: true,
    allowTestOverrides: true,
    waterTemperatureObservationsBySource: {},
    ...deps,
  });
}

function request(
  path: string,
  options: {
    token?: string | null;
    authorization?: string;
    method?: "GET" | "POST";
    internalKey?: string;
  } = {},
): Request {
  const headers = new Headers();
  if (options.authorization) {
    headers.set("Authorization", options.authorization);
  }
  const token = options.token === undefined &&
      (path.startsWith("/snapshot") || path.startsWith("/review/"))
    ? "valid-token"
    : options.token;
  if (token) {
    headers.set("x-user-token", token);
  }
  if (options.internalKey) {
    headers.set("x-river-run-internal-key", options.internalKey);
  }
  return new Request(`https://example.com/functions/v1/river-run${path}`, {
    method: options.method ?? "GET",
    headers,
  });
}

async function json(response: Response) {
  return await response.json();
}

function dailyRow(localDate = "2026-09-20"): RiverRunDailySnapshotRow {
  return serializeDailySnapshot({
    ...buildDailySnapshot({
      river: PERE_MARQUETTE_RIVER_PROFILE,
      run: enabledRun,
      localDate,
      conditionsEvidenceByDate: {},
      engineVersion: "test-engine",
      configVersion: "test-config",
    }),
    progressionSnapshotAt: `${localDate}T04:10:00.000Z`,
  });
}

function conditionRow(localDate = "2026-09-20"): RiverRunConditionRefreshRow {
  const daily = {
    ...buildDailySnapshot({
      river: PERE_MARQUETTE_RIVER_PROFILE,
      run: enabledRun,
      localDate,
      conditionsEvidenceByDate: {},
      engineVersion: "test-engine",
      configVersion: "test-config",
    }),
    progressionSnapshotAt: `${localDate}T04:10:00.000Z`,
  };
  return serializeConditionRefresh({
    ...buildConditionRefresh({
      dailySnapshot: daily,
      localDate,
      refreshSlot: "16:00",
      movementEngineId: "fall_cooling",
      pushRules: enabledRun.push,
      fishabilityBands: enabledRun.fishabilityBands,
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      waterTemperatureFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 600,
      hydraulicAbsoluteChange24h: 0,
      hydraulicPercentChange24h: 0,
      rainSignal: "dry",
      flowSignal: "stable",
      temperatureSignal: "cooling",
      temperatureSourceType: "same_gauge",
      waterTempF: 61,
      sourceMetrics: {
        gauge: {
          provider: "USGS",
          siteId: "04122500",
          primaryMetric: "flow_cfs",
          value: 600,
          band: "ideal",
          trend: "stable",
        },
        waterTemperature: {
          provider: "USGS",
          sourceId: "pm_maple_leaf_temperature",
          siteId: "04122200",
          waterTempF: 61,
          trend: "cooling",
          sourceType: "same_gauge",
        },
        conditionsWaterTemperature: {
          provider: "MONITOR_MY_WATERSHED",
          sourceId: "pm_m37_temperature",
          siteId: "PMTU37-1",
          seriesId: "3201",
          waterTempF: 61,
          trend: "cooling",
          sourceType: "nearby_gauge",
        },
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    }),
    conditionRefreshAt: `${localDate}T20:10:00.000Z`,
  });
}

function missingPushHistoryReads(
  throughDate: string,
  trackingStartDate = "2026-08-15",
) {
  const reads = [];
  for (
    let localDate = throughDate;
    localDate >= trackingStartDate && reads.length < 7;
    localDate = addDays(localDate, -1)
  ) {
    reads.push({
      localDate,
      status: "missing",
      score: null,
      label: "No recorded read",
    });
  }
  return reads;
}

Deno.test("GET /river-run/rivers returns the complete audited public catalog", async () => {
  const response = await handleRiverRunRequest(request("/rivers"));
  const body = await json(response);
  assertEquals(response.status, 200);
  const rivers = body.states.flatMap((state: { rivers: unknown[] }) =>
    state.rivers
  );
  const riverIds = rivers.map((river: { riverId: string }) => river.riverId);
  const runIds = rivers.flatMap(
    (river: { runs: Array<{ runId: string }> }) =>
      river.runs.map((run) => run.runId),
  );

  // St. Joseph is intentionally presented in both Michigan and Indiana.
  assertEquals(riverIds.length, 9);
  assertEquals(runIds.length, 27);
  assertEquals(new Set(riverIds).size, 8);
  assertEquals(new Set(runIds).size, 24);
  for (const riverId of ["grand", "platte", "white"]) {
    assertEquals(riverIds.includes(riverId), true);
  }
  for (
    const runId of [
      "grand_fall_chinook",
      "grand_fall_coho",
      "grand_fall_steelhead",
      "platte_fall_chinook",
      "platte_fall_coho",
      "platte_fall_steelhead",
      "white_fall_chinook",
      "white_fall_coho",
      "white_fall_steelhead",
    ]
  ) {
    assertEquals(runIds.includes(runId), true);
  }
});

Deno.test("database config source loads only the published validated document", async () => {
  const client = new MockClient();
  client.rows.river_run_config_revisions = [{
    config_key: "pere_marquette",
    revision: 1,
    status: "published",
    schema_version: "river-run-config-v1",
    config_version: "2026-07-27",
    movement_engine_version: "fall-cooling-v1",
    document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    evidence_notes: "Published PM fixture.",
    published_at: "2026-07-27T12:00:00.000Z",
  }];
  const response = await handleRiverRunRequest(request("/rivers"), {
    configSource: "database",
    createAdminClient: () => client,
  });
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(
    body.states[0].rivers[0].runs[0].runId,
    "pere_marquette_fall_chinook",
  );
  assert(
    client.filters.some((filter) =>
      filter.table === "river_run_config_revisions" &&
      filter.column === "status" &&
      filter.value === "published"
    ),
  );
});

Deno.test("GET /river-run/rivers hides PM with explicit disabled audit gate", async () => {
  const response = await handleRiverRunRequest(request("/rivers"), {
    runs: [disabledRun],
  });
  assertEquals(response.status, 200);
  assertEquals(await json(response), { states: [] });
});

Deno.test("public release gate hides catalog and snapshots by default", async () => {
  const catalog = await handleRiverRunRequestBase(request("/rivers"), {
    runs: [enabledRun],
    publicEnabled: false,
  });
  assertEquals(await json(catalog), { states: [] });

  const snapshot = await handleRiverRunRequestBase(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook",
    ),
    {
      runs: [enabledRun],
      publicEnabled: false,
    },
  );
  assertEquals(snapshot.status, 403);
  assertEquals((await json(snapshot)).error, "river_run_not_released");
});

Deno.test("owner-review snapshot rejects authenticated non-admin users", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/review/snapshot?riverId=grand&runId=grand_fall_chinook&presentationState=MI",
    ),
    { createAdminClient: () => new MockClient() },
  );
  assertEquals(response.status, 403);
  assertEquals((await json(response)).error, "river_run_review_forbidden");
});

Deno.test("owner-review catalog is admin-only and includes the Wisconsin draft portfolio", async () => {
  const forbidden = await handleRiverRunRequestBase(
    request("/review/rivers"),
    { createAdminClient: () => new MockClient() },
  );
  assertEquals(forbidden.status, 403);
  assertEquals((await json(forbidden)).error, "river_run_review_forbidden");

  const response = await handleRiverRunRequestBase(
    request("/review/rivers"),
    {
      createAdminClient: () =>
        new MockClient({ email: "brandonkentros@icloud.com" }),
    },
  );
  const body = await json(response);
  const wisconsin = body.states.find(
    (state: { state: string }) => state.state === "WI",
  );

  assertEquals(response.status, 200);
  assertEquals(
    wisconsin.rivers.map((river: { riverId: string }) => river.riverId).sort(),
    ["bois_brule", "milwaukee", "root", "sheboygan"],
  );
  assertEquals(
    wisconsin.rivers.every(
      (river: { runs: Array<{ species: string }> }) =>
        river.runs.length === 4 &&
        river.runs.some((run) => run.species === "lake_run_brown_trout"),
    ),
    true,
  );
});

Deno.test("owner-review snapshot uses current provider inputs without fixture substitution", async () => {
  const client = new MockClient({ email: "brandonkentros@icloud.com" });
  const response = await handleRiverRunRequestBase(
    request(
      "/review/snapshot?riverId=grand&runId=grand_fall_chinook&presentationState=MI&localDate=1999-01-01",
    ),
    {
      createAdminClient: () => client,
      now: new Date("2026-08-24T23:00:00.000Z"),
      gaugeObservations: [{
        provider: "USGS",
        siteId: "04119000",
        observedAt: "2026-08-24T22:45:00.000Z",
        flow_cfs: 2_500,
        gage_height_ft: 5.42,
        source: "usgs_continuous_values",
      }],
      waterTemperatureObservationsBySource: {
        grand_north_park_temperature: [{
          provider: "USGS",
          sourceId: "grand_north_park_temperature",
          siteId: "04118564",
          observedAt: "2026-08-24T22:45:00.000Z",
          waterTempF: 74.7,
          approvalStatus: "provisional",
          source: "usgs_continuous_values",
        }],
      },
      weatherSnapshot: {},
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "owner-review-test-engine",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.localDate, "2026-08-24");
  assertEquals(body.runId, "grand_fall_chinook");
  assertEquals(body.engineVersion, "owner-review-test-engine");
  assertEquals(body.riverConditions.status, "available");
  assertEquals(
    body.riverConditions.metrics.find((metric: { metric: string }) =>
      metric.metric === "flow_cfs"
    ).value,
    2_500,
  );
  assertEquals(
    body.riverConditions.metrics.find((metric: { metric: string }) =>
      metric.metric === "water_temp_f"
    ).value,
    74.7,
  );
  assertEquals(
    body.riverConditions.dataVersion,
    "river-live-conditions-v4",
  );
  assertEquals(body.activity.label, "Unavailable");
});

Deno.test("owner-review snapshot fails closed when current providers have no usable readings", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/review/snapshot?riverId=grand&runId=grand_fall_chinook&presentationState=MI",
    ),
    {
      createAdminClient: () =>
        new MockClient({ email: "brandonkentros@icloud.com" }),
      now: new Date("2026-08-24T23:00:00.000Z"),
      gaugeObservations: [],
      waterTemperatureObservationsBySource: {},
      weatherSnapshot: {},
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
        water_temp_f: null,
      },
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.riverConditions.status, "unavailable");
  assertEquals(
    body.riverConditions.metrics.every(
      (metric: { value: number | null }) => metric.value === null,
    ),
    true,
  );
  assertEquals(body.fishability.label, "Unavailable");
  assertEquals(body.activity.label, "Unavailable");
});

Deno.test("Grand owner-review Activity becomes Full only with fresh Fulton, North Park, and weather inputs", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/review/snapshot?riverId=grand&runId=grand_fall_chinook&presentationState=MI",
    ),
    {
      createAdminClient: () =>
        new MockClient({ email: "brandonkentros@icloud.com" }),
      now: new Date("2026-09-20T20:30:00.000Z"),
      gaugeObservations: [
        {
          provider: "USGS",
          siteId: "04119000",
          observedAt: "2026-09-19T19:30:00.000Z",
          flow_cfs: 2_200,
          source: "usgs_continuous_values",
        },
        {
          provider: "USGS",
          siteId: "04119000",
          observedAt: "2026-09-20T19:30:00.000Z",
          flow_cfs: 2_350,
          gage_height_ft: 4.9,
          source: "usgs_continuous_values",
        },
      ],
      waterTemperatureObservationsBySource: {
        grand_north_park_temperature: [{
          provider: "USGS",
          sourceId: "grand_north_park_temperature",
          siteId: "04118564",
          observedAt: "2026-09-20T19:30:00.000Z",
          waterTempF: 58,
          approvalStatus: "provisional",
          source: "usgs_continuous_values",
        }],
      },
      weatherSnapshot: grandActivityWeatherData,
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "grand-observed-test-engine",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.activity.confidence, "Full");
  assertEquals(body.activity.blocks.length, 4);
  assert(body.activity.score !== null);
  assertEquals(body.freshness.gauge, "fresh");
  assertEquals(body.freshness.waterTemperature, "fresh");
  assertEquals(body.waterTemperature.waterTempF, 58);
  assertMatch(body.activity.detail, /downtown Grand Rapids mainstem/i);
  assertMatch(body.activity.detail, /does not directly measure Grand Haven/i);
});

Deno.test("Grand owner-review Activity is capped Moderate when North Park temperature is missing", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/review/snapshot?riverId=grand&runId=grand_fall_chinook&presentationState=MI",
    ),
    {
      createAdminClient: () =>
        new MockClient({ email: "brandonkentros@icloud.com" }),
      now: new Date("2026-09-20T20:30:00.000Z"),
      gaugeObservations: [{
        provider: "USGS",
        siteId: "04119000",
        observedAt: "2026-09-20T19:30:00.000Z",
        flow_cfs: 2_350,
        source: "usgs_continuous_values",
      }],
      waterTemperatureObservationsBySource: {},
      weatherSnapshot: grandActivityWeatherData,
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "grand-partial-test-engine",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.activity.confidence, "Moderate");
  assert(body.activity.score !== null && body.activity.score <= 64);
  assertEquals(body.freshness.waterTemperature, "missing");
});

Deno.test("production snapshot timing ignores caller query overrides", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=1999-01-01&localTime=00:01&refreshAtUtc=1999-01-01T00:01:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      publicEnabled: true,
      now: new Date("2026-09-20T20:30:00.000Z"),
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      seasonalContextsByMetric: {
        flow_cfs: {
          average: 540,
          p10: 400,
          p25: 470,
          median: 540,
          p75: 630,
          p90: 800,
          historicalYears: 87,
          sampleCount: 609,
          availableWindowDays: 7,
          windowRadiusDays: 3,
          windowStartMonthDay: "09-17",
          windowEndMonthDay: "09-23",
          recordKind: "long_term",
          baselineVersion: "test-live-baseline",
          source: "usgs_statistics",
        },
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.localDate, "2026-09-20");
  assertEquals(body.refreshSlot, "16:00");
  assertEquals(body.conditionRefreshAt, "2026-09-20T20:30:00.000Z");
});

Deno.test("live conditions refresh hourly independently of primitive cadence", async () => {
  const response = await handleRiverRunRequestBase(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun, PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE],
      publicEnabled: true,
      now: new Date("2026-12-01T18:30:00.000Z"),
      gaugeObservations: [gaugeObservation],
      waterTemperatureObservationsBySource: {},
      weatherSnapshot: envData,
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.refreshSlot, "00:00");
  assertEquals(body.riverConditions.refreshSlot, "13:00");
});

Deno.test("production snapshot ignores caller weather payload", async () => {
  const injectedWeather = encodeURIComponent(JSON.stringify(envData));
  const response = await handleRiverRunRequestBase(
    request(
      `/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&envData=${injectedWeather}`,
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      publicEnabled: true,
      now: new Date("2026-09-20T20:30:00.000Z"),
      gaugeObservations: [gaugeObservation],
      fetchFn: async () => ({ ok: false, json: async () => ({}) }),
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.freshness.weather, "missing");
});

Deno.test("internal refresh requires a secret and warms the current slot", async () => {
  const forbidden = await handleRiverRunRequestBase(
    request("/internal/refresh", { method: "POST" }),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      internalSecret: "correct-internal-secret",
      now: new Date("2026-09-20T20:30:00.000Z"),
    },
  );
  assertEquals(forbidden.status, 403);

  const client = new MockClient();
  const response = await handleRiverRunRequestBase(
    request("/internal/refresh", {
      method: "POST",
      internalKey: "correct-internal-secret",
    }),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      internalSecret: "correct-internal-secret",
      now: new Date("2026-09-20T20:30:00.000Z"),
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.targetCount, 1);
  assertEquals(body.failedCount, 0);
  assertEquals(body.results[0].refreshSlot, "16:00");
  assert(
    client.upserts.some((item) =>
      item.table === "river_run_condition_refreshes"
    ),
  );
});

Deno.test("visible snapshot without user token returns 401", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook",
      { token: null },
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
    },
  );
  assertEquals(response.status, 401);
  assertEquals((await json(response)).error, "unauthorized");
});

Deno.test("visible snapshot with invalid token returns 401", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook",
      { token: "invalid-token" },
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
    },
  );
  assertEquals(response.status, 401);
  assertEquals((await json(response)).error, "unauthorized");
});

Deno.test("visible snapshot with valid token returns 200", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  assertEquals(response.status, 200);
});

Deno.test("free user gets one lifetime snapshot and same-refresh replay only", async () => {
  const client = new MockClient({ subscriptionTier: "free" });
  const path =
    "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z";
  const deps = {
    createAdminClient: () => client,
    runs: [enabledRun],
    gaugeObservations: [gaugeObservation],
    weatherSnapshot: envData,
    engineVersion: "free-trial-engine",
    configVersion: "free-trial-config",
  };

  const first = await handleRiverRunRequest(request(path), deps);
  assertEquals(first.status, 200);
  assertEquals((await json(first)).accessTier, "free_trial");
  const claimed = client.rows.profiles[0];
  assertEquals(claimed.free_river_run_trial_river_id, "pere_marquette");
  assertEquals(
    claimed.free_river_run_trial_run_id,
    "pere_marquette_fall_chinook",
  );
  assertEquals(claimed.free_river_run_trial_local_date, "2026-08-15");
  assertEquals(claimed.free_river_run_trial_refresh_slot, "16:00");

  const replay = await handleRiverRunRequest(request(path), deps);
  assertEquals(replay.status, 200);
  assertEquals((await json(replay)).accessTier, "free_trial");

  const nextRefresh = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=20:30&refreshAtUtc=2026-08-16T00:30:00.000Z",
    ),
    deps,
  );
  assertEquals(nextRefresh.status, 403);
  assertEquals((await json(nextRefresh)).error, "subscription_required");
});

Deno.test("spent free River Migration trial blocks every other combination", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () =>
        new MockClient({
          subscriptionTier: "free",
          freeRiverRunTrial: {
            usedAt: "2026-08-15T19:00:00.000Z",
            riverId: "betsie",
            runId: "betsie_fall_chinook",
            presentationState: "MI",
            localDate: "2026-08-15",
            refreshSlot: "16:00",
            engineVersion: "free-trial-engine",
            configVersion: "free-trial-config",
          },
        }),
      runs: [enabledRun],
      engineVersion: "free-trial-engine",
      configVersion: "free-trial-config",
    },
  );
  assertEquals(response.status, 403);
  assertEquals((await json(response)).error, "subscription_required");
});

Deno.test("visible snapshot accepts Master Angler access", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=betsie&runId=betsie_fall_chinook",
    ),
    {
      createAdminClient: () =>
        new MockClient({ subscriptionTier: "master_angler" }),
      rivers: [BETSIE_RIVER_PROFILE],
      runs: [enabledBetsieRun],
      now: new Date("2026-09-15T20:30:00.000Z"),
      engineVersion: "test-engine",
      configVersion: "test-betsie-config",
    },
  );
  assertEquals(response.status, 200);
});

Deno.test("Betsie snapshot fetches only weather for its seasonal Activity", async () => {
  let providerCalls = 0;
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=betsie&runId=betsie_fall_chinook&localDate=2026-09-15&localTime=16:30&refreshAtUtc=2026-09-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      rivers: [BETSIE_RIVER_PROFILE],
      runs: [enabledBetsieRun],
      fetchFn: async () => {
        providerCalls += 1;
        throw new Error(
          "weather offline",
        );
      },
      now: new Date("2026-09-15T20:30:00.000Z"),
      engineVersion: "test-engine",
      configVersion: "test-betsie-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(providerCalls, 1);
  assertEquals(body.runStage.label, "Peak");
  assertEquals(body.fishInRiver.score, 100);
  assertEquals(body.conditionsSuggest.label, "Unavailable");
  assertEquals(body.conditionsSuggest.score, null);
  assertEquals(body.push.label, "Unavailable");
  assertEquals(body.push.score, null);
  assertEquals(body.fishability.label, "Unavailable");
  assertEquals(body.fishability.score, null);
  assertEquals(body.pushHistory.status, "unavailable");
  assertEquals(body.pushHistory.recentDailyReadsStatus, "unavailable");
  assertEquals(body.gauge, undefined);
  assertEquals(body.weather.provider, "OPEN_METEO");
  assertEquals(body.waterTemperature, undefined);
  assertEquals(body.conditionsWaterTemperature, undefined);
  assertMatch(body.safety.regulationReminder, /300 feet/i);
});

Deno.test("Betsie Coho snapshot uses weather-only Activity and honors its limited ceiling", async () => {
  let providerCalls = 0;
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=betsie&runId=betsie_fall_coho&localDate=2026-10-15&localTime=16:30&refreshAtUtc=2026-10-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      rivers: [BETSIE_RIVER_PROFILE],
      runs: [enabledBetsieCohoRun],
      fetchFn: async () => {
        providerCalls += 1;
        throw new Error(
          "weather offline",
        );
      },
      now: new Date("2026-10-15T20:30:00.000Z"),
      engineVersion: "test-engine",
      configVersion: "test-betsie-coho-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(providerCalls, 1);
  assertEquals(body.runStage.label, "Peak");
  assertEquals(body.fishInRiver.score, 30);
  assertEquals(body.fishInRiver.riverCeiling, 30);
  assertEquals(body.fishInRiver.historicalRunStrength, "limited");
  assertEquals(body.conditionsSuggest.label, "Unavailable");
  assertEquals(body.push.label, "Unavailable");
  assertEquals(body.fishability.label, "Unavailable");
  assertEquals(body.gauge, undefined);
  assertEquals(body.weather.provider, "OPEN_METEO");
  assertEquals(body.waterTemperature, undefined);
  assertMatch(body.safety.regulationReminder, /300 feet/i);
});

Deno.test("Betsie Steelhead snapshot uses weather-only Activity and honors its 70-point ceiling", async () => {
  let providerCalls = 0;
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=betsie&runId=betsie_fall_steelhead&localDate=2026-11-10&localTime=16:30&refreshAtUtc=2026-11-10T21:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      rivers: [BETSIE_RIVER_PROFILE],
      runs: [enabledBetsieSteelheadRun],
      fetchFn: async () => {
        providerCalls += 1;
        throw new Error(
          "weather offline",
        );
      },
      now: new Date("2026-11-10T21:30:00.000Z"),
      engineVersion: "test-engine",
      configVersion: "test-betsie-steelhead-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(providerCalls, 1);
  assertEquals(body.runStage.label, "Peak");
  assertEquals(body.fishInRiver.score, 70);
  assertEquals(body.fishInRiver.riverCeiling, 70);
  assertEquals(body.fishInRiver.historicalRunStrength, "moderate");
  assertEquals(body.conditionsSuggest.label, "Unavailable");
  assertEquals(body.push.label, "Unavailable");
  assertEquals(body.fishability.label, "Unavailable");
  assertEquals(body.gauge, undefined);
  assertEquals(body.weather.provider, "OPEN_METEO");
  assertEquals(body.waterTemperature, undefined);
  assertMatch(body.safety.regulationReminder, /300 feet/i);
});

Deno.test("snapshot exposes selected measured-water value and provenance", async () => {
  const source = PERE_MARQUETTE_RIVER_PROFILE.waterTemperatureSources[0];
  const conditionsSource = PERE_MARQUETTE_RIVER_PROFILE
    .waterTemperatureSources.find((candidate) =>
      candidate.sourceId === enabledRun.conditionsSuggest.temperatureSourceId
    )!;
  const temperatureObservations = [
    ["2026-09-17T19:30:00.000Z", 66],
    ["2026-09-19T19:30:00.000Z", 63],
    ["2026-09-20T18:30:00.000Z", 60.5],
    ["2026-09-20T19:30:00.000Z", 60],
  ].map(([observedAt, waterTempF]) => ({
    sourceId: source.sourceId,
    provider: source.provider,
    siteId: source.siteId,
    seriesId: source.seriesId,
    observedAt: String(observedAt),
    waterTempF: Number(waterTempF),
    source: "monitor_my_watershed_csv" as const,
  }));
  const conditionsTemperatureObservations = temperatureObservations.map((
    observation,
  ) => ({
    ...observation,
    sourceId: conditionsSource.sourceId,
    provider: conditionsSource.provider,
    siteId: conditionsSource.siteId,
    seriesId: conditionsSource.seriesId,
    waterTempF: observation.waterTempF - 1,
  }));
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      waterTemperatureObservationsBySource: {
        [source.sourceId]: temperatureObservations,
        [conditionsSource.sourceId]: conditionsTemperatureObservations,
      },
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.waterTemperature.sourceId, source.sourceId);
  assertEquals(body.waterTemperature.provider, "MONITOR_MY_WATERSHED");
  assertEquals(body.waterTemperature.waterTempF, 60.25);
  assertEquals(body.waterTemperature.isUpstreamFallback, false);
  assertEquals(body.freshness.waterTemperature, "fresh");
  assertEquals(
    body.conditionsWaterTemperature.sourceId,
    conditionsSource.sourceId,
  );
  assertEquals(body.conditionsWaterTemperature.waterTempF, 59.25);
  assertEquals(body.freshness.conditionsWaterTemperature, "fresh");
});

Deno.test("visible PM snapshot with seeded matching baseline returns Fishability available", async () => {
  const client = new MockClient();
  client.rows.river_run_gauge_baselines = [{
    river_id: "pere_marquette",
    metric: "flow_cfs",
    day_of_year: 263,
    baseline_version: enabledRun.baselineCoverage?.version,
    percentiles: {
      p10: 100,
      p25: 250,
      p40: 400,
      p65: 650,
      p85: 850,
      p90: 900,
    },
    band_data: {},
    sample_count: 40,
    distinct_years: 3,
    window_days: 14,
    source_notes: "test baseline",
  }];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "2026-07-08",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.gauge.band, "ideal");
  assertEquals(body.fishability.label === "Unavailable", false);
  assertEquals(body.fishability.score == null, false);
});

Deno.test("rate-limited snapshot returns 429", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient({ rateLimitAllowed: false }),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  assertEquals(response.status, 429);
  assertEquals((await json(response)).error, "rate_limited");
});

Deno.test("snapshot request for hidden PM returns deterministic error", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook",
    ),
    { runs: [disabledRun] },
  );
  assertEquals(response.status, 403);
  assertEquals((await json(response)).error, "river_run_hidden");
});

Deno.test("snapshot builds daily snapshot on cache miss and upserts it", async () => {
  const client = new MockClient();
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );

  assertEquals(response.status, 200);
  assert(
    client.upserts.some((item) =>
      item.table === "river_run_daily_progression_snapshots"
    ),
  );
});

Deno.test("daily snapshot built timestamp is deterministic from request timing", async () => {
  const client = new MockClient();
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);
  const dailyUpsert = client.upserts.find((item) =>
    item.table === "river_run_daily_progression_snapshots"
  );

  assertEquals(body.progressionSnapshotAt, "2026-09-20T20:30:00.000Z");
  assertEquals(
    dailyUpsert?.row.progression_snapshot_at,
    "2026-09-20T20:30:00.000Z",
  );
});

Deno.test("snapshot returns cached daily snapshot when present", async () => {
  const client = new MockClient();
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );

  assertEquals(response.status, 200);
  assertEquals(
    client.upserts.filter((item) =>
      item.table === "river_run_daily_progression_snapshots"
    ).length,
    0,
  );
});

Deno.test("snapshot builds condition refresh on cache miss and upserts it", async () => {
  const client = new MockClient();
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );

  assertEquals(response.status, 200);
  assert(
    client.upserts.some((item) =>
      item.table === "river_run_condition_refreshes"
    ),
  );
});

Deno.test("snapshot returns cached condition refresh when present", async () => {
  const client = new MockClient();
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [conditionRow()];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );

  assertEquals(response.status, 200);
  assertEquals(
    client.upserts.filter((item) =>
      item.table === "river_run_condition_refreshes"
    ).length,
    0,
  );
});

Deno.test("Push history reports supportive conditions active now", async () => {
  const client = new MockClient();
  const current = conditionRow();
  current.push = {
    ...current.push,
    score: 74,
    label: "Strong",
  };
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [current];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.pushHistory, {
    status: "active_now",
    minimumSupportiveScore: 50,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-27",
    throughDate: "2026-09-20",
    recentDailyReadsStatus: "available",
    recentDailyReads: missingPushHistoryReads("2026-09-19"),
    todayReadsStatus: "available",
    todayReads: [{
      localDate: "2026-09-20",
      refreshSlot: "16:00",
      conditionRefreshAt: "2026-09-20T20:10:00.000Z",
      startTime: "16:00",
      endTime: "20:00",
      score: 74,
      label: "Strong",
      isCurrent: true,
    }],
    currentWindow: {
      localDate: "2026-09-20",
      refreshSlot: "16:00",
      conditionRefreshAt: "2026-09-20T20:10:00.000Z",
      startTime: "16:00",
      endTime: "20:00",
      score: 74,
      label: "Strong",
      isCurrent: true,
    },
    lastSupportiveConditions: {
      localDate: "2026-09-20",
      refreshSlot: "16:00",
      conditionRefreshAt: "2026-09-20T20:10:00.000Z",
      score: 74,
      label: "Strong",
    },
  });
});

Deno.test("Push history survives engine and copy configuration changes when Push rules remain compatible", async () => {
  const client = new MockClient();
  const current = conditionRow();
  const validPrior = conditionRow("2026-09-16");
  validPrior.push = {
    ...validPrior.push,
    score: 63,
    label: "Possible",
  };
  const wrongConfig = conditionRow("2026-09-19");
  wrongConfig.config_version = "other-config";
  wrongConfig.push = {
    ...wrongConfig.push,
    score: 86,
    label: "Very strong",
  };
  const priorSeason = conditionRow("2025-09-19");
  priorSeason.push = {
    ...priorSeason.push,
    score: 86,
    label: "Very strong",
  };
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [
    current,
    wrongConfig,
    priorSeason,
    validPrior,
  ];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.pushHistory.status, "previously_recorded");
  assertEquals(body.pushHistory.lastSupportiveConditions, {
    localDate: "2026-09-19",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-09-19T20:10:00.000Z",
    score: 86,
    label: "Very strong",
  });
  assertEquals(body.pushHistory.recentDailyReadsStatus, "available");
  assertEquals(body.pushHistory.recentDailyReads[0], {
    localDate: "2026-09-19",
    status: "supportive_window",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-09-19T20:10:00.000Z",
    score: 86,
    label: "Very strong",
  });
  assertEquals(body.pushHistory.recentDailyReads[3], {
    localDate: "2026-09-16",
    status: "supportive_window",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-09-16T20:10:00.000Z",
    score: 63,
    label: "Possible",
  });
});

Deno.test("Push history is honest when no supportive condition has been recorded", async () => {
  const client = new MockClient();
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [conditionRow()];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.pushHistory.status, "none_recorded");
  assertEquals(body.pushHistory.lastSupportiveConditions, undefined);
  assertEquals(
    body.pushHistory.recentDailyReads,
    missingPushHistoryReads("2026-09-19"),
  );
});

Deno.test("Push and supportive history wait for the migration", async () => {
  const client = new MockClient();
  client.rows.river_run_daily_progression_snapshots = [dailyRow("2026-08-10")];
  client.rows.river_run_condition_refreshes = [conditionRow("2026-08-10")];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-10&localTime=16:30&refreshAtUtc=2026-08-10T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.push.score, null);
  assertEquals(body.push.label, "Waiting for migration");
  assert(body.push.headline.includes("river entry has not started"));
  assertEquals(body.push.headline.includes("August 15, 2026"), false);
  assertEquals(body.pushHistory.status, "not_started");
  assertEquals(body.pushHistory.lastSupportiveConditions, undefined);
  assertEquals(body.pushHistory.recentDailyReadsStatus, "available");
  assertEquals(body.pushHistory.recentDailyReads, []);
  assertEquals(
    body.dataQuality.reasonCodes.includes("data_quality_limited"),
    false,
  );
});

Deno.test("Push history starts empty on the first tracking date and adds that date the next day", async () => {
  const firstDayClient = new MockClient();
  firstDayClient.rows.river_run_daily_progression_snapshots = [
    dailyRow("2026-08-15"),
  ];
  firstDayClient.rows.river_run_condition_refreshes = [
    conditionRow("2026-08-15"),
  ];
  const firstDayResponse = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => firstDayClient,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const firstDayBody = await json(firstDayResponse);
  assertEquals(firstDayBody.pushHistory.recentDailyReads, []);

  const secondDayClient = new MockClient();
  secondDayClient.rows.river_run_daily_progression_snapshots = [
    dailyRow("2026-08-16"),
  ];
  secondDayClient.rows.river_run_condition_refreshes = [
    conditionRow("2026-08-16"),
    conditionRow("2026-08-15"),
  ];
  const secondDayResponse = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-16&localTime=16:30&refreshAtUtc=2026-08-16T20:30:00.000Z",
    ),
    {
      createAdminClient: () => secondDayClient,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const secondDayBody = await json(secondDayResponse);
  assertEquals(secondDayBody.pushHistory.recentDailyReads, [{
    localDate: "2026-08-15",
    status: "no_supportive_window",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-08-15T20:10:00.000Z",
    score: 36,
    label: "No clear push",
  }]);
});

Deno.test("Push and supportive history stop after the configured run end", async () => {
  const client = new MockClient();
  const prior = conditionRow("2026-10-25");
  prior.push = { ...prior.push, score: 75, label: "Strong" };
  client.rows.river_run_daily_progression_snapshots = [dailyRow("2026-10-28")];
  client.rows.river_run_condition_refreshes = [
    conditionRow("2026-10-28"),
    prior,
  ];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-10-28&localTime=16:30&refreshAtUtc=2026-10-28T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.push.score, null);
  assertEquals(body.push.label, "Migration complete");
  assertEquals(body.pushHistory.status, "complete");
  assertEquals(body.pushHistory.lastSupportiveConditions, undefined);
  assertEquals(body.pushHistory.recentDailyReadsStatus, "available");
  assertEquals(body.pushHistory.recentDailyReads[0], {
    localDate: "2026-10-27",
    status: "missing",
    score: null,
    label: "No recorded read",
  });
  assertEquals(body.pushHistory.recentDailyReads[2], {
    localDate: "2026-10-25",
    status: "supportive_window",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-10-25T20:10:00.000Z",
    score: 75,
    label: "Strong",
  });
});

Deno.test("Push history failure does not make the current snapshot unavailable", async () => {
  const client = new MockClient({ historyReadError: true });
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [conditionRow()];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.pushHistory.status, "unavailable");
  assertEquals(body.pushHistory.recentDailyReadsStatus, "available");
  assertEquals(body.pushHistory.recentDailyReads.length, 7);
  assertEquals(body.push.label, conditionRow().push.label);
});

Deno.test("recent daily Push history failure is isolated from today's Push read", async () => {
  const client = new MockClient({ recentHistoryReadError: true });
  client.rows.river_run_daily_progression_snapshots = [dailyRow()];
  client.rows.river_run_condition_refreshes = [conditionRow()];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.pushHistory.recentDailyReadsStatus, "unavailable");
  assertEquals(body.pushHistory.recentDailyReads, []);
  assertEquals(body.push.label, conditionRow().push.label);
  assertEquals(body.push.score, conditionRow().push.score);
});

Deno.test("Push history exposes each completed day's strongest supportive window", async () => {
  const client = new MockClient();
  const reads = [
    ["2026-08-29", 42, "No clear push"],
    ["2026-08-28", 21, "Weak"],
    ["2026-08-27", 63, "Possible"],
    ["2026-08-26", 81, "Strong"],
    ["2026-08-25", 100, "Very strong"],
    ["2026-08-24", 42, "No clear push"],
    ["2026-08-23", 63, "Possible"],
    ["2026-08-22", 21, "Weak"],
  ] as const;
  const storedReads = reads.map(([localDate, score, label]) => {
    const row = conditionRow(localDate);
    row.push = { ...row.push, score, label };
    return row;
  });
  const earlierAugust29Read = conditionRow("2026-08-29");
  earlierAugust29Read.push = {
    ...earlierAugust29Read.push,
    score: 81,
    label: "Strong",
  };
  earlierAugust29Read.refresh_slot = "12:00";
  earlierAugust29Read.condition_refresh_at = "2026-08-29T16:10:00.000Z";
  storedReads[0].refresh_slot = "20:00";
  storedReads[0].condition_refresh_at = "2026-08-29T23:59:00.000Z";

  client.rows.river_run_daily_progression_snapshots = [
    dailyRow("2026-08-30"),
  ];
  client.rows.river_run_condition_refreshes = [
    conditionRow("2026-08-30"),
    earlierAugust29Read,
    ...storedReads,
  ];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-30&localTime=16:30&refreshAtUtc=2026-08-30T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(
    body.pushHistory.recentDailyReads.map(
      (read: { localDate: string }) => read.localDate,
    ),
    [
      "2026-08-29",
      "2026-08-28",
      "2026-08-27",
      "2026-08-26",
      "2026-08-25",
      "2026-08-24",
      "2026-08-23",
    ],
  );
  assertEquals(body.pushHistory.recentDailyReads[0], {
    localDate: "2026-08-29",
    status: "supportive_window",
    refreshSlot: "12:00",
    conditionRefreshAt: "2026-08-29T16:10:00.000Z",
    score: 81,
    label: "Strong",
  });
  assertEquals(body.pushHistory.recentDailyReads[1], {
    localDate: "2026-08-28",
    status: "no_supportive_window",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-08-28T20:10:00.000Z",
    score: 21,
    label: "Weak",
  });
  assertEquals(
    body.pushHistory.recentDailyReads.some(
      (read: { localDate: string }) => read.localDate === "2026-08-22",
    ),
    false,
  );
});

function conditionsBaselineRow() {
  return {
    river_id: "pere_marquette",
    run_id: "pere_marquette_fall_chinook",
    checkpoint_id: "river_start",
    reference_day_of_year: 227,
    observation_start_day_of_year: 209,
    baseline_version: enabledRun.conditionsSuggest.baselineVersion,
    gauge_metric: "flow_cfs",
    gauge_site_id: "04122500",
    temperature_source_id: enabledRun.conditionsSuggest.temperatureSourceId,
    component_samples: {
      gaugeAbsoluteRise: [0, 200, 400, 600, 800],
      gaugeRelativeRisePct: [0, 20, 40, 60, 80],
      meanWaterTempF: [50, 55, 60, 65, 70],
      waterCoolingF: [-5, 0, 5, 10, 15],
    },
    historical_samples: [10, 30, 50, 70, 90].map((
      evidenceIndex,
      index,
    ) => ({
      year: 2021 + index,
      usableDays: 18,
      gaugeAbsoluteRise: index * 200,
      gaugeRelativeRisePct: index * 20,
      meanWaterTempF: 70 - index * 5,
      waterCoolingF: -5 + index * 5,
      gaugeResponsePercentile: 10 + index * 20,
      waterTemperaturePercentile: 10 + index * 20,
      evidenceIndex,
    })),
    index_percentiles: { p10: 18, p25: 30, p75: 70, p90: 82 },
    distinct_years: 5,
    expected_days: 18,
    minimum_usable_days: 15,
    source_notes: "Fixture.",
  };
}

function completedConditionsRows() {
  return Array.from({ length: 18 }, (_, index) => {
    const day = addDays("2026-07-28", index);
    const row = conditionRow(day);
    return {
      ...row,
      source_metrics: {
        ...row.source_metrics,
        gauge: {
          ...row.source_metrics.gauge,
          value: 500 + index * 20,
        },
        waterTemperature: {
          ...row.source_metrics.waterTemperature,
          waterTempF: 64 - index * 0.4,
        },
        conditionsWaterTemperature: {
          ...row.source_metrics.conditionsWaterTemperature,
          waterTempF: 64 - index * 0.4,
        },
      },
      freshness: {
        ...row.freshness,
        gauge: "fresh",
        waterTemperature: "fresh",
        conditionsWaterTemperature: "fresh",
      },
    };
  });
}

Deno.test("Conditions Suggest retains compatible prior-day evidence across engine and copy revisions", async () => {
  const client = new MockClient();
  const historicalRows = completedConditionsRows().map((row) => ({
    ...row,
    engine_version: "older-engine",
    config_version: "older-copy-config",
  }));
  const incompatibleReplacement = {
    ...historicalRows.at(-1)!,
    condition_refresh_at: "2026-08-14T20:11:00.000Z",
    engine_version: "newer-engine",
    config_version: "newer-config",
    source_metrics: {
      ...historicalRows.at(-1)!.source_metrics,
      conditionsWaterTemperature: {
        ...historicalRows.at(-1)!.source_metrics.conditionsWaterTemperature,
        sourceId: "different-temperature-source",
      },
    },
  };
  client.rows.river_run_condition_refreshes = [
    ...historicalRows,
    incompatibleReplacement,
  ];
  client.rows.river_run_conditions_suggest_baselines = [
    conditionsBaselineRow(),
  ];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.conditionsSuggest.usableDays, 18);
  assertEquals(body.conditionsSuggest.label, "Typical");
  assertEquals(body.conditionsSuggest.checkpointId, "river_start");
  assert(
    client.filters.some((filter) =>
      filter.table === "river_run_condition_refreshes" &&
      filter.column === "local_date" &&
      filter.op === "gte" &&
      filter.value === "2026-07-28"
    ),
  );
  assert(
    client.filters.some((filter) =>
      filter.table === "river_run_condition_refreshes" &&
      filter.column === "local_date" &&
      filter.op === "lte" &&
      filter.value === "2026-08-14"
    ),
  );
});

Deno.test("Conditions Suggest reads canonical Timing observations without scored history rows", async () => {
  const client = new MockClient();
  client.rows.river_run_timing_observations = completedConditionsRows().map(
    (row) => ({
      river_id: row.river_id,
      run_id: row.run_id,
      local_date: row.local_date,
      refresh_slot: row.refresh_slot,
      observation_at: row.condition_refresh_at,
      gauge_metric: row.source_metrics.gauge.primaryMetric,
      gauge_site_id: row.source_metrics.gauge.siteId,
      gauge_value: row.source_metrics.gauge.value,
      gauge_freshness: "fresh",
      temperature_source_id:
        row.source_metrics.conditionsWaterTemperature.sourceId,
      water_temp_f: row.source_metrics.conditionsWaterTemperature.waterTempF,
      temperature_freshness: "fresh",
      reason_codes: [],
      provenance: { kind: "canonical_test" },
    }),
  );
  client.rows.river_run_conditions_suggest_baselines = [
    conditionsBaselineRow(),
  ];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "new-engine",
      configVersion: "new-copy-config",
    },
  );
  const body = await json(response);

  assertEquals(body.conditionsSuggest.usableDays, 18);
  assertEquals(body.conditionsSuggest.label, "Typical");
});

Deno.test("endpoint keeps the checkpoint locked between transition dates", async () => {
  const client = new MockClient();
  client.rows.river_run_condition_refreshes = completedConditionsRows();
  client.rows.river_run_conditions_suggest_baselines = [
    conditionsBaselineRow(),
  ];

  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-18&localTime=16:30&refreshAtUtc=2026-08-18T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.conditionsSuggest.candidateLabel, "Typical");
  assertEquals(body.conditionsSuggest.label, "Typical");
  assertEquals(body.conditionsSuggest.checkpointId, "river_start");
  assertEquals(body.conditionsSuggest.cutoffDate, "2026-08-14");
});

Deno.test("absent completed evidence produces Insufficient evidence", async () => {
  const client = new MockClient();
  client.rows.river_run_conditions_suggest_baselines = [
    conditionsBaselineRow(),
  ];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-08-15&localTime=16:30&refreshAtUtc=2026-08-15T20:30:00.000Z",
    ),
    {
      createAdminClient: () => client,
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.conditionsSuggest.label, "Insufficient evidence");
  assert(
    body.conditionsSuggest.reasonCodes.includes(
      "conditions_missing_checkpoint_gauge",
    ),
  );
  assertEquals(body.dataQuality.label, "Limited");
});

Deno.test("snapshot response includes quality, safety, freshness, and versions", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      seasonalContextsByMetric: {
        flow_cfs: {
          average: 540,
          p10: 400,
          p25: 470,
          median: 540,
          p75: 630,
          p90: 800,
          historicalYears: 87,
          sampleCount: 609,
          availableWindowDays: 7,
          windowRadiusDays: 3,
          windowStartMonthDay: "09-17",
          windowEndMonthDay: "09-23",
          recordKind: "long_term",
          baselineVersion: "test-live-baseline",
          source: "usgs_statistics",
        },
        gage_height_ft: null,
        water_temp_f: null,
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assert(body.dataQuality);
  assert(body.safety);
  assert(
    body.safety.activityDisclaimer.includes(
      "not wading or boating safety",
    ),
  );
  assert(body.freshness);
  assert(body.riverConditions);
  assertEquals(body.riverConditions.riverId, "pere_marquette");
  assertEquals(body.riverConditions.metrics.length, 3);
  assertEquals(
    body.riverConditions.metrics.find((metric: { metric: string }) =>
      metric.metric === "flow_cfs"
    ).seasonalContext.average,
    540,
  );
  assertEquals(body.engineVersion, "test-engine");
  assertEquals(body.configVersion, "test-config");
});

Deno.test("snapshot treats omitted weather_available with valid weather data as available", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.freshness.weather, "fresh");
});

Deno.test("snapshot resolves audited Fishability band without a seasonal baseline row", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.gauge.band, "ideal");
});

Deno.test("missing 24-hour trend caps but does not erase audited Fishability", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.fishability.score, 69);
  assertEquals(body.fishability.label, "Fishable");
  assert(
    body.fishability.reasonCodes.includes("fishability_unknown_trend_cap"),
  );
  assertEquals(body.dataQuality.label, "Limited");
});

Deno.test("Push uses raw hydraulics and remains conservative when the trend is unresolved", async () => {
  const source = PERE_MARQUETTE_RIVER_PROFILE.waterTemperatureSources[0];
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      waterTemperatureObservationsBySource: {
        [source.sourceId]: [{
          sourceId: source.sourceId,
          provider: source.provider,
          siteId: source.siteId,
          seriesId: source.seriesId,
          observedAt: "2026-09-20T19:30:00.000Z",
          waterTempF: 61,
          source: "monitor_my_watershed_csv",
        }],
      },
      weatherSnapshot: envData,
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.push.score, 25);
  assertEquals(body.push.components.hydraulicState, "normal");
  assert(body.push.reasonCodes.includes("push_unknown_trend_cap"));
  assertEquals(body.push.reasonCodes.includes("normal_flow_band"), false);
});

Deno.test("live weather fallback success normalizes precipitation and lows", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      fetchFn: async () => ({
        ok: true,
        json: async () => ({
          timezone: "America/Detroit",
          hourly: {
            time: Array.from(
              { length: 72 },
              (_, index) =>
                new Date(
                  Date.parse("2026-09-17T21:00:00.000Z") + index * 3600_000,
                )
                  .toISOString(),
            ),
            precipitation: Array.from({ length: 72 }, () => 0.01),
            cloud_cover: Array.from({ length: 72 }, () => 75),
            shortwave_radiation: Array.from(
              { length: 72 },
              (_, index) => index % 24 >= 10 && index % 24 <= 16 ? 350 : 80,
            ),
          },
          daily: {
            time: ["2026-09-17", "2026-09-18", "2026-09-19", "2026-09-20"],
            precipitation_probability_max: [10, 20, 30, 40],
          },
        }),
      }),
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(body.freshness.weather, "fresh");
  assertEquals(body.weather.rain72hIn, 0.72);
  assertEquals(body.activity.blocks.length, 4);
  assertEquals(body.activity.targetDayLabel, "Today");
  assertEquals(body.activity.confidence, "Moderate");
  assertEquals(
    body.secondaryNote,
    "Forecast weather informs Activity Outlook only; Push and Fishability remain observation-led.",
  );
});

Deno.test("live weather fallback failure does not crash and yields missing weather behavior", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      gaugeObservations: [gaugeObservation],
      fetchFn: async () => ({ ok: false, json: async () => ({}) }),
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.freshness.weather, "missing");
  assertEquals(body.dataQuality.label, "Limited");
});

Deno.test("thrown provider failures degrade to unavailable inputs", async () => {
  const response = await handleRiverRunRequest(
    request(
      "/snapshot?riverId=pere_marquette&runId=pere_marquette_fall_chinook&localDate=2026-09-20&localTime=16:30&refreshAtUtc=2026-09-20T20:30:00.000Z",
    ),
    {
      createAdminClient: () => new MockClient(),
      runs: [enabledRun],
      fetchFn: async () => {
        throw new Error("provider offline");
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assertEquals(response.status, 200);
  assertEquals(body.freshness.gauge, "missing");
  assertEquals(body.freshness.weather, "missing");
  assertEquals(body.push.label, "Unavailable");
  assertEquals(body.fishability.label, "Unavailable");
});
