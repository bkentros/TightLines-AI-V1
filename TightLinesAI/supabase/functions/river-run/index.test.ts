import { assert, assertEquals } from "jsr:@std/assert";
import { handleRiverRunRequest } from "./index.ts";
import {
  type AuditedRiverRunProfile,
  buildConditionRefresh,
  buildDailySnapshot,
  type NormalizedGaugeObservation,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
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
    this.client.upserts.push({ table: this.tableName, row, options });
    this.client.rows[this.tableName] ??= [];
    this.client.rows[this.tableName].push(row);
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

  order(column: string): MockQuery {
    this.orderColumn = column;
    return this;
  }

  maybeSingle(): Promise<
    { data: Record<string, unknown> | null; error: null }
  > {
    return Promise.resolve({
      data: this.matchingRows()[0] ?? null,
      error: null,
    });
  }

  then<
    TResult1 = { data: Record<string, unknown>[]; error: null },
    TResult2 = never,
  >(
    onfulfilled?:
      | ((
        value: { data: Record<string, unknown>[]; error: null },
      ) => TResult1 | PromiseLike<TResult1>)
      | null,
    _onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve({ data: this.matchingRows(), error: null }).then(
      onfulfilled ?? undefined,
    );
  }

  private matchingRows(): Record<string, unknown>[] {
    const rows = this.client.rows[this.tableName] ?? [];
    return rows.filter((row) =>
      Object.entries(this.filters).every(([column, value]) =>
        row[column] === value
      ) &&
      this.ranges.every((range) => {
        const actual = row[range.column];
        if (typeof actual !== "string" || typeof range.value !== "string") {
          return false;
        }
        return range.op === "gte"
          ? actual >= range.value
          : actual <= range.value;
      })
    );
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
      rateLimitAllowed?: boolean;
    } = {},
  ) {
    this.auth = {
      getUser: (token: string) =>
        Promise.resolve(
          token === (this.options.validToken ?? "valid-token")
            ? { data: { user: { id: "user-1" } }, error: null }
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

const enabledRun: AuditedRiverRunProfile = {
  ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  publicAudit: { isEnabled: true },
};

const disabledRun: AuditedRiverRunProfile = {
  ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  publicAudit: { isEnabled: false },
};

const gaugeObservation: NormalizedGaugeObservation = {
  provider: "USGS",
  siteId: "04122500",
  observedAt: "2026-09-20T19:30:00.000Z",
  flow_cfs: 600,
  source: "usgs_instantaneous_values",
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
  weather: { temp_7day_low: [65, 62, 58, 56] },
};

function request(
  path: string,
  options: { token?: string | null; authorization?: string } = {},
): Request {
  const headers = new Headers();
  if (options.authorization) {
    headers.set("Authorization", options.authorization);
  }
  const token = options.token === undefined && path.startsWith("/snapshot")
    ? "valid-token"
    : options.token;
  if (token) {
    headers.set("x-user-token", token);
  }
  return new Request(`https://example.com/functions/v1/river-run${path}`, {
    method: "GET",
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
      scheduleRefreshesByDate: {},
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
      scheduleRefreshesByDate: {},
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
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      rainSignal: "dry",
      flowSignal: "stable",
      temperatureSignal: "cooling",
      temperatureSourceType: "air_temp_proxy",
      sourceMetrics: {
        gauge: {
          primaryMetric: "flow_cfs",
          value: 600,
          band: "ideal",
          trend: "stable",
        },
        weather: {
          temperatureSource: "air_temp_proxy",
          temperatureTrend: "cooling",
        },
      },
      engineVersion: "test-engine",
      configVersion: "test-config",
    }),
    conditionRefreshAt: `${localDate}T20:10:00.000Z`,
  });
}

Deno.test("GET /river-run/rivers returns PM with default audited config", async () => {
  const response = await handleRiverRunRequest(request("/rivers"));
  const body = await json(response);
  assertEquals(response.status, 200);
  assertEquals(
    body.states[0].rivers[0].runs[0].runId,
    "pere_marquette_fall_chinook",
  );
});

Deno.test("GET /river-run/rivers hides PM with explicit disabled audit gate", async () => {
  const response = await handleRiverRunRequest(request("/rivers"), {
    runs: [disabledRun],
  });
  assertEquals(response.status, 200);
  assertEquals(await json(response), { states: [] });
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
  assertEquals(response.status, 200);
});

Deno.test("visible PM snapshot with seeded matching baseline returns Fishability available", async () => {
  const client = new MockClient();
  client.rows.river_run_gauge_baselines = [{
    river_id: "pere_marquette",
    metric: "flow_cfs",
    day_of_year: 263,
    baseline_version: "2026-07-08",
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

Deno.test("schedule source history is read from stored prior condition refreshes", async () => {
  const client = new MockClient();
  client.rows.river_run_condition_refreshes = Array.from(
    { length: 7 },
    (_, index) => {
      const day = `2026-09-${String(13 + index).padStart(2, "0")}`;
      return {
        ...conditionRow(day),
        local_date: day,
        refresh_slot: "16:00",
        push: {
          ...conditionRow(day).push,
          favorability: {
            favorabilityIndex: 3,
            favorabilityLevel: "favorable",
          },
        },
        freshness: {
          gauge: "fresh",
          weather: "fresh",
          waterTemperature: "air_temp_proxy",
          scheduleDaysUsable: 7,
        },
      };
    },
  );
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

  assertEquals(body.schedule.usableDays, 7);
  assert(
    client.filters.some((filter) =>
      filter.table === "river_run_condition_refreshes" &&
      filter.column === "local_date" &&
      filter.op === "gte" &&
      filter.value === "2026-09-13"
    ),
  );
  assert(
    client.filters.some((filter) =>
      filter.table === "river_run_condition_refreshes" &&
      filter.column === "local_date" &&
      filter.op === "lte" &&
      filter.value === "2026-09-19"
    ),
  );
});

Deno.test("absent prior condition refresh history produces Uncertain limited schedule", async () => {
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

  assertEquals(body.schedule.label, "Uncertain");
  assert(body.schedule.reasonCodes.includes("schedule_limited_source_days"));
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
      engineVersion: "test-engine",
      configVersion: "test-config",
    },
  );
  const body = await json(response);

  assert(body.dataQuality);
  assert(body.safety);
  assert(body.freshness);
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

Deno.test("snapshot preserves unresolved flow band instead of exposing normal default", async () => {
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

  assertEquals(body.gauge.band, undefined);
});

Deno.test("unresolved flow band makes Fishability unavailable and DataQuality Limited", async () => {
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

  assertEquals(body.fishability.score, null);
  assertEquals(body.fishability.label, "Unavailable");
  assert(body.fishability.reasonCodes.includes("baseline_missing"));
  assertEquals(body.dataQuality.label, "Limited");
});

Deno.test("Push does not receive fake normal band modifier when band unresolved", async () => {
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

  assertEquals(body.push.score, 45);
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
          },
          daily: {
            time: ["2026-09-17", "2026-09-18", "2026-09-19", "2026-09-20"],
            temperature_2m_min: [65, 62, 58, 56],
            temperature_2m_max: [75, 72, 68, 66],
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
  assertEquals(body.weather.temperatureTrend, "strong_cooling");
  assertEquals(
    body.secondaryNote,
    "Forecast data is informational only and does not change scores.",
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
