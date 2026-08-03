import { assertEquals } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  deserializeConditionRefresh,
  deserializeDailySnapshot,
  getConditionRefresh,
  getDailySnapshot,
  getLastSupportivePushConditions,
  getPublishedConfiguration,
  getRecentDailyPushConditions,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  readConditionsSuggestBaselines,
  readGaugeBaselines,
  type RiverRunConditionsSuggestBaselineRow,
  type RiverRunGaugeBaselineRow,
  serializeConditionRefresh,
  serializeDailySnapshot,
  type StoredConditionRefresh,
  type StoredDailySnapshot,
  upsertConditionRefresh,
  upsertDailySnapshot,
  upsertDraftConfiguration,
} from "../index.ts";
import type { SupabaseLikeClient } from "../storage/types.ts";

class MockQuery {
  filters: Array<{ column: string; value: unknown }> = [];
  selected = false;
  orderedBy: { column: string; ascending?: boolean } | null = null;

  constructor(
    private readonly client: MockSupabaseClient,
    private readonly tableName: string,
  ) {}

  select(): MockQuery {
    this.selected = true;
    return this;
  }

  upsert(
    row: Record<string, unknown>,
    options?: { onConflict?: string },
  ): MockQuery {
    this.client.upserts.push({
      table: this.tableName,
      row,
      options,
    });
    this.client.singleResponse = { data: row, error: null };
    return this;
  }

  eq(column: string, value: unknown): MockQuery {
    this.filters.push({ column, value });
    this.client.filters.push({ table: this.tableName, column, value });
    return this;
  }

  gte(column: string, value: unknown): MockQuery {
    this.client.filters.push({ table: this.tableName, column, value });
    return this;
  }

  lte(column: string, value: unknown): MockQuery {
    this.client.filters.push({ table: this.tableName, column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQuery {
    this.orderedBy = { column, ascending: options?.ascending };
    this.client.orders.push({ table: this.tableName, column, options });
    return this;
  }

  limit(_count: number): MockQuery {
    return this;
  }

  maybeSingle(): Promise<
    { data: Record<string, unknown> | null; error: null }
  > {
    return Promise.resolve(this.client.singleResponse);
  }

  then<TResult1 = { data: unknown[] | null; error: null }, TResult2 = never>(
    onfulfilled?:
      | ((
        value: { data: unknown[] | null; error: null },
      ) => TResult1 | PromiseLike<TResult1>)
      | null,
    _onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.client.listResponse).then(
      onfulfilled ?? undefined,
    );
  }
}

class MockSupabaseClient implements SupabaseLikeClient {
  upserts: Array<{
    table: string;
    row: Record<string, unknown>;
    options?: { onConflict?: string };
  }> = [];
  filters: Array<{ table: string; column: string; value: unknown }> = [];
  orders: Array<
    { table: string; column: string; options?: { ascending?: boolean } }
  > = [];
  singleResponse: { data: Record<string, unknown> | null; error: null } = {
    data: null,
    error: null,
  };
  listResponse: { data: unknown[] | null; error: null } = {
    data: [],
    error: null,
  };

  from(table: string): MockQuery {
    return new MockQuery(this, table);
  }
}

function storedDailySnapshot(): StoredDailySnapshot {
  return {
    ...buildDailySnapshot({
      river: PERE_MARQUETTE_RIVER_PROFILE,
      run: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
      localDate: "2026-09-20",
      conditionsEvidenceByDate: {},
      engineVersion: "engine-test",
      configVersion: "config-test",
    }),
    progressionSnapshotAt: "2026-09-20T04:10:00Z",
  };
}

function storedConditionRefresh(): StoredConditionRefresh {
  const dailySnapshot = storedDailySnapshot();
  return {
    ...buildConditionRefresh({
      dailySnapshot,
      localDate: "2026-09-20",
      refreshSlot: "16:00",
      movementEngineId: "fall_cooling",
      pushRules: PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push,
      fishabilityBands:
        PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      waterTemperatureFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 650,
      hydraulicAbsoluteChange24h: 50,
      hydraulicPercentChange24h: 8,
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
      temperatureSourceType: "same_gauge",
      waterTempF: 60,
      sourceMetrics: {
        gauge: {
          primaryMetric: "flow_cfs",
          band: "ideal",
          trend: "meaningful_rise",
        },
        weather: {},
      },
      engineVersion: "engine-test",
      configVersion: "config-test",
    }),
    conditionRefreshAt: "2026-09-20T20:10:00Z",
  };
}

Deno.test("daily snapshot upsert uses required unique-key columns", async () => {
  const client = new MockSupabaseClient();
  await upsertDailySnapshot(client, storedDailySnapshot());

  assertEquals(
    client.upserts[0].table,
    "river_run_daily_progression_snapshots",
  );
  assertEquals(
    client.upserts[0].options?.onConflict,
    "river_id,run_id,local_date,engine_version,config_version",
  );
});

Deno.test("condition refresh upsert uses required unique-key columns", async () => {
  const client = new MockSupabaseClient();
  await upsertConditionRefresh(client, storedConditionRefresh());

  assertEquals(client.upserts[0].table, "river_run_condition_refreshes");
  assertEquals(
    client.upserts[0].options?.onConflict,
    "river_id,run_id,local_date,refresh_slot,engine_version,config_version",
  );
});

Deno.test("get daily snapshot returns not-found cleanly", async () => {
  const client = new MockSupabaseClient();
  const result = await getDailySnapshot(client, {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    localDate: "2026-09-20",
    engineVersion: "engine-test",
    configVersion: "config-test",
  });

  assertEquals(result, { data: null, found: false, error: null });
});

Deno.test("get condition refresh returns not-found cleanly", async () => {
  const client = new MockSupabaseClient();
  const result = await getConditionRefresh(client, {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    localDate: "2026-09-20",
    refreshSlot: "16:00",
    engineVersion: "engine-test",
    configVersion: "config-test",
  });

  assertEquals(result, { data: null, found: false, error: null });
});

Deno.test("supportive Push history is scoped and returns stored condition evidence", async () => {
  const client = new MockSupabaseClient();
  client.singleResponse = {
    data: {
      local_date: "2026-09-18",
      refresh_slot: "16:00",
      condition_refresh_at: "2026-09-18T20:10:00Z",
      push: { score: 72, label: "Strong" },
    },
    error: null,
  };

  const result = await getLastSupportivePushConditions(client, {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    trackingStartDate: "2026-08-15",
    throughDate: "2026-09-20",
    minimumScore: 50,
    engineVersion: "engine-test",
    configVersion: "config-test",
  });

  assertEquals(result.data, {
    localDate: "2026-09-18",
    refreshSlot: "16:00",
    conditionRefreshAt: "2026-09-18T20:10:00Z",
    score: 72,
    label: "Strong",
  });
  assertEquals(
    client.filters.map(({ column, value }) => ({ column, value })),
    [
      { column: "river_id", value: "pere_marquette" },
      { column: "run_id", value: "pere_marquette_fall_chinook" },
      { column: "engine_version", value: "engine-test" },
      { column: "config_version", value: "config-test" },
      { column: "local_date", value: "2026-08-15" },
      { column: "local_date", value: "2026-09-20" },
      { column: "push->score", value: 50 },
    ],
  );
  assertEquals(client.orders[0], {
    table: "river_run_condition_refreshes",
    column: "condition_refresh_at",
    options: { ascending: false },
  });
});

Deno.test("recent Push history keeps each day's strongest supportive window", async () => {
  const client = new MockSupabaseClient();
  client.listResponse = {
    data: [
      {
        local_date: "2026-09-19",
        refresh_slot: "20:00",
        condition_refresh_at: "2026-09-19T23:59:00Z",
        push: { score: 42, label: "No clear push" },
      },
      {
        local_date: "2026-09-19",
        refresh_slot: "16:00",
        condition_refresh_at: "2026-09-19T20:10:00Z",
        push: { score: 81, label: "Strong" },
      },
      {
        local_date: "2026-09-19",
        refresh_slot: "12:00",
        condition_refresh_at: "2026-09-19T16:10:00Z",
        push: { score: 81, label: "Strong" },
      },
      {
        local_date: "2026-09-18",
        refresh_slot: "20:00",
        condition_refresh_at: "2026-09-18T23:59:00Z",
        push: { score: 21, label: "Weak" },
      },
      {
        local_date: "2026-09-17",
        refresh_slot: "20:00",
        condition_refresh_at: "2026-09-17T23:59:00Z",
        push: { score: null, label: "Unavailable" },
      },
    ],
    error: null,
  };

  const result = await getRecentDailyPushConditions(client, {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    trackingStartDate: "2026-08-15",
    throughDate: "2026-09-19",
    maximumDays: 7,
    minimumSupportiveScore: 50,
    engineVersion: "engine-test",
    configVersion: "config-test",
  });

  assertEquals(result.data, [
    {
      localDate: "2026-09-19",
      status: "supportive_window",
      refreshSlot: "16:00",
      conditionRefreshAt: "2026-09-19T20:10:00Z",
      score: 81,
      label: "Strong",
    },
    {
      localDate: "2026-09-18",
      status: "no_supportive_window",
      score: null,
      label: "No supportive window",
    },
  ]);
  assertEquals(result.found, true);
  assertEquals(
    client.filters.map(({ column, value }) => ({ column, value })),
    [
      { column: "river_id", value: "pere_marquette" },
      { column: "run_id", value: "pere_marquette_fall_chinook" },
      { column: "engine_version", value: "engine-test" },
      { column: "config_version", value: "config-test" },
      { column: "local_date", value: "2026-08-15" },
      { column: "local_date", value: "2026-09-19" },
    ],
  );
  assertEquals(client.orders[0], {
    table: "river_run_condition_refreshes",
    column: "condition_refresh_at",
    options: { ascending: false },
  });
});

Deno.test("serialized/deserialized JSON preserves snapshot and refresh displays", () => {
  const daily = storedDailySnapshot();
  const dailyRoundTrip = deserializeDailySnapshot(
    serializeDailySnapshot(daily),
  );
  const refresh = storedConditionRefresh();
  const refreshRoundTrip = deserializeConditionRefresh(
    serializeConditionRefresh(refresh),
  );

  assertEquals(dailyRoundTrip.runStage, daily.runStage);
  assertEquals(
    dailyRoundTrip.conditionsSuggest,
    daily.conditionsSuggest,
  );
  assertEquals(dailyRoundTrip.fishInRiver, daily.fishInRiver);
  assertEquals(refreshRoundTrip.push, refresh.push);
  assertEquals(refreshRoundTrip.fishability, refresh.fishability);
  assertEquals(refreshRoundTrip.dataQuality, refresh.dataQuality);
  assertEquals(refreshRoundTrip.interpretationNote, refresh.interpretationNote);
});

Deno.test("baseline read filters by riverId, metric, and baselineVersion", async () => {
  const client = new MockSupabaseClient();
  const row: RiverRunGaugeBaselineRow = {
    river_id: "pere_marquette",
    metric: "flow_cfs",
    day_of_year: 263,
    baseline_version: "baseline-v1",
    percentiles: { p10: 100, p50: 500, p90: 1200 },
    band_data: { ideal: { min: 400, max: 850 } },
    sample_count: 45,
    distinct_years: 3,
    window_days: 14,
    source_notes: "fixture",
    created_at: "2026-07-08T00:00:00Z",
  };
  client.listResponse = { data: [row], error: null };

  const result = await readGaugeBaselines(client, {
    riverId: "pere_marquette",
    metric: "flow_cfs",
    baselineVersion: "baseline-v1",
  });

  assertEquals(
    client.filters.map((filter) => [filter.column, filter.value]),
    [
      ["river_id", "pere_marquette"],
      ["metric", "flow_cfs"],
      ["baseline_version", "baseline-v1"],
    ],
  );
  assertEquals(result.found, true);
  assertEquals(result.data?.[0].dayOfYear, 263);
});

Deno.test("Conditions Suggest baseline read preserves historical provenance", async () => {
  const client = new MockSupabaseClient();
  const row: RiverRunConditionsSuggestBaselineRow = {
    river_id: "pere_marquette",
    run_id: "pere_marquette_fall_chinook",
    checkpoint_id: "peak_start",
    reference_day_of_year: 263,
    observation_start_day_of_year: 209,
    baseline_version: "conditions-v2",
    gauge_metric: "flow_cfs",
    gauge_site_id: "04122500",
    temperature_source_id: "pm_maple_leaf_temperature",
    component_samples: {
      gaugeAbsoluteRise: [10, 20, 30, 40, 50],
      gaugeRelativeRisePct: [1, 2, 3, 4, 5],
      meanWaterTempF: [58, 60, 62, 64, 66],
      waterCoolingF: [-1, 0, 1, 2, 3],
    },
    historical_samples: [],
    index_percentiles: { p10: 10, p25: 25, p75: 75, p90: 90 },
    distinct_years: 5,
    expected_days: 49,
    minimum_usable_days: 40,
    source_notes: "Fixture.",
  };
  client.listResponse = { data: [row], error: null };

  const result = await readConditionsSuggestBaselines(client, {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    baselineVersion: "conditions-v2",
  });

  assertEquals(result.found, true);
  assertEquals(result.data?.[0].temperatureSourceId, row.temperature_source_id);
  assertEquals(result.data?.[0].distinctYears, 5);
  assertEquals(result.data?.[0].checkpointId, "peak_start");
});

Deno.test("draft configuration upsert validates and uses immutable revision key", async () => {
  const client = new MockSupabaseClient();
  const revision = {
    configKey: "pere_marquette",
    revision: 1,
    status: "draft" as const,
    document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Initial PM reusable configuration foundation.",
  };
  const result = await upsertDraftConfiguration(client, revision);

  assertEquals(result.error, null);
  assertEquals(client.upserts[0].table, "river_run_config_revisions");
  assertEquals(
    client.upserts[0].options?.onConflict,
    "config_key,revision",
  );
  assertEquals(result.data?.document.configVersion, "2026-08-02.1");
});

Deno.test("published configuration read filters by key and published status", async () => {
  const client = new MockSupabaseClient();
  client.singleResponse = {
    data: {
      config_key: "pere_marquette",
      revision: 1,
      status: "published",
      schema_version: "river-run-config-v1",
      config_version: "2026-07-27",
      movement_engine_version: "fall-cooling-v1",
      document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
      evidence_notes: "Published fixture.",
      published_at: "2026-07-27T12:00:00.000Z",
    },
    error: null,
  };
  const result = await getPublishedConfiguration(client, "pere_marquette");

  assertEquals(result.found, true);
  assertEquals(result.data?.status, "published");
  assertEquals(
    client.filters.map((filter) => [filter.column, filter.value]).slice(-2),
    [["config_key", "pere_marquette"], ["status", "published"]],
  );
});
