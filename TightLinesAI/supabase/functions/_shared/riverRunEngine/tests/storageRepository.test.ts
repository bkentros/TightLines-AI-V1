import { assertEquals } from "jsr:@std/assert";
import {
  buildConditionRefresh,
  buildDailySnapshot,
  deserializeConditionRefresh,
  deserializeDailySnapshot,
  getConditionRefresh,
  getDailySnapshot,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  readGaugeBaselines,
  type RiverRunGaugeBaselineRow,
  serializeConditionRefresh,
  serializeDailySnapshot,
  type StoredConditionRefresh,
  type StoredDailySnapshot,
  upsertConditionRefresh,
  upsertDailySnapshot,
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
      scheduleRefreshesByDate: {},
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
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
      temperatureSourceType: "same_gauge",
      sourceMetrics: {
        gauge: {
          primaryMetric: "flow_cfs",
          band: "ideal",
          trend: "meaningful_rise",
        },
        weather: {
          temperatureSource: "same_gauge",
          temperatureTrend: "strong_cooling",
        },
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
  assertEquals(dailyRoundTrip.schedule, daily.schedule);
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
