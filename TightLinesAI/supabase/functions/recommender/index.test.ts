import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildRecommenderEngineRequest,
  handleRecommenderRequest,
} from "./index.ts";
import { RECOMMENDER_DAILY_SESSION_ENGINE_VERSION } from "../_shared/recommenderEngine/contracts/output.ts";
import { locationLocalMidnightIso } from "../_shared/recommenderEngine/runRecommenderRebuildSurface.ts";
import { analyzeRecommenderConditions } from "../_shared/recommenderEngine/sharedAnalysis.ts";
import { computeRecommenderRebuild } from "../_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts";

function makeRequest(
  body: Record<string, unknown>,
  headers: HeadersInit = {},
): Request {
  return new Request("https://example.com/functions/v1/recommender", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer test-token",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function validBody(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    latitude: 35.56,
    longitude: -82.58,
    state_code: "NC",
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {
      timezone: "America/New_York",
      fetched_at: "2026-07-11T16:00:00.000Z",
      altitude_ft: 315,
      weather: {
        temperature: 70,
        pressure: 1014,
        wind_speed: 8,
        cloud_cover: 45,
        precipitation: 0,
        wind_speed_unit: "mph",
        temp_7day_high: Array.from({ length: 21 }, () => 78),
        temp_7day_low: Array.from({ length: 21 }, () => 54),
        precip_7day_daily: Array.from({ length: 21 }, () => 0),
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 10),
      },
      hourly_pressure_mb: Array.from({ length: 48 }, (_, idx) => ({
        time_utc: new Date(Date.UTC(2026, 6, 10, idx)).toISOString(),
        value: 1012 + (idx % 3),
      })),
    },
    ...overrides,
  };
}

function hourlyWindForLocalDate(
  localDate: string,
  utcOffset: string,
  daylightValue: number,
  outsideValue: number,
) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: new Date(
      `${localDate}T${String(hour).padStart(2, "0")}:00:00${utcOffset}`,
    ).toISOString(),
    value: hour >= 5 && hour <= 21 ? daylightValue : outsideValue,
  }));
}

function floridaLargemouthWindBody(
  daylightWindMph: number,
): Record<string, unknown> {
  return validBody({
    latitude: 28.54,
    longitude: -81.38,
    state_code: "FL",
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    target_date: "2026-07-18",
    env_data: {
      timezone: "America/New_York",
      fetched_at: "2026-07-18T16:00:00.000Z",
      altitude_ft: 82,
      weather: {
        temperature: 82,
        pressure: 1012,
        wind_speed: 2,
        cloud_cover: 35,
        precipitation: 0,
        wind_speed_unit: "mph",
        temp_7day_high: Array.from({ length: 21 }, () => 88),
        temp_7day_low: Array.from({ length: 21 }, () => 72),
        precip_7day_daily: Array.from({ length: 21 }, () => 0),
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 10),
      },
      hourly_pressure_mb: Array.from({ length: 48 }, (_, idx) => ({
        time_utc: new Date(Date.UTC(2026, 6, 17, idx)).toISOString(),
        value: 1012,
      })),
      hourly_wind_speed: hourlyWindForLocalDate(
        "2026-07-18",
        "-04:00",
        daylightWindMph,
        3,
      ),
    },
  });
}

function recommendationIds(json: {
  lure_recommendations: Array<{ id: string }>;
  fly_recommendations: Array<{ id: string }>;
}): string[] {
  return [
    ...json.lure_recommendations.map((pick) => `lure:${pick.id}`),
    ...json.fly_recommendations.map((pick) => `fly:${pick.id}`),
  ];
}

function mockClient(options: {
  userId?: string | null;
  authError?: unknown;
  subscriptionTier?: string | null;
  dailySessions?: Map<string, Record<string, unknown>>;
  historyWrites?: unknown[][];
  firstCreateConflict?: boolean;
  refreshClaimConflict?: boolean;
}) {
  const dailySessions = options.dailySessions ??
    new Map<string, Record<string, unknown>>();
  const historyWrites = options.historyWrites ?? [];
  let firstCreateConflictUsed = false;
  let refreshClaimConflictUsed = false;
  const sessionKeyColumns = [
    "user_id",
    "local_date",
    "lat_key",
    "lon_key",
    "state_code",
    "species",
    "region_key",
    "water_type",
    "water_clarity",
    "engine_version",
  ];
  const keyForRow = (row: Record<string, unknown>) =>
    sessionKeyColumns.map((column) => String(row[column])).join("|");

  return {
    auth: {
      getUser: async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
        error: options.authError ?? null,
      }),
    },
    from: (table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: options.subscriptionTier === undefined
                  ? null
                  : { subscription_tier: options.subscriptionTier },
              }),
            }),
          }),
        };
      }

      if (table === "recommender_recent_history") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    lt: () => ({
                      gte: () => ({
                        order: async () => ({ data: [], error: null }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
          upsert: async (rows: unknown[]) => {
            historyWrites.push(rows);
            return { error: null };
          },
        };
      }

      if (table === "recommender_daily_sessions") {
        const filters: Record<string, unknown> = {};
        let updatePatch: Record<string, unknown> | null = null;
        const builder = {
          select: () => builder,
          eq: (column: string, value: unknown) => {
            filters[column] = value;
            return builder;
          },
          is: (column: string, value: unknown) => {
            filters[column] = value;
            return builder;
          },
          maybeSingle: async () => {
            const matches = (candidate: Record<string, unknown>) =>
              Object.entries(filters).every(([column, value]) =>
                candidate[column] === value
              );
            if (updatePatch) {
              const row = [...dailySessions.values()].find(matches);
              if (!row) return { data: null, error: null };
              const updated = { ...row, ...updatePatch };
              dailySessions.set(keyForRow(updated), updated);
              return { data: updated, error: null };
            }
            const row = [...dailySessions.values()].find(matches);
            return { data: row ?? null, error: null };
          },
          insert: (row: Record<string, unknown>) => {
            const inserted = { ...row };
            return {
              select: () => ({
                maybeSingle: async () => {
                  const key = keyForRow(inserted);
                  if (dailySessions.has(key)) {
                    return {
                      data: null,
                      error: { code: "23505", message: "duplicate key" },
                    };
                  }
                  if (options.firstCreateConflict && !firstCreateConflictUsed) {
                    firstCreateConflictUsed = true;
                    const existing = {
                      ...inserted,
                      variant_a_response: {
                        ...(inserted.variant_a_response as Record<
                          string,
                          unknown
                        >),
                        generated_at: "2026-07-18T00:00:00.000Z",
                      },
                    };
                    dailySessions.set(key, existing);
                    return {
                      data: null,
                      error: { code: "23505", message: "duplicate key" },
                    };
                  }
                  dailySessions.set(key, inserted);
                  return { data: inserted, error: null };
                },
              }),
            };
          },
          update: (patch: Record<string, unknown>) => {
            if (options.refreshClaimConflict && !refreshClaimConflictUsed) {
              refreshClaimConflictUsed = true;
              const existingA = [...dailySessions.values()].find((candidate) =>
                candidate.active_variant === "A" &&
                candidate.refreshes_used === 0 &&
                candidate.variant_b_response == null
              );
              if (existingA) {
                const storedBResponse = {
                  ...(patch.variant_b_response as Record<string, unknown>),
                  generated_at: "2026-07-18T01:00:00.000Z",
                };
                const storedB = {
                  ...existingA,
                  active_variant: "B",
                  refreshes_used: 1,
                  variant_b_response: {
                    ...storedBResponse,
                    recommendation_session: {
                      local_date: existingA.local_date,
                      variant: "B",
                      can_refresh: false,
                      refreshes_remaining: 0,
                      locked_until: existingA.cache_expires_at,
                    },
                  },
                };
                dailySessions.set(keyForRow(storedB), storedB);
              }
            }
            updatePatch = patch;
            return builder;
          },
        };
        return builder;
      }

      throw new Error(`unexpected table ${table}`);
    },
  };
}

Deno.test("buildRecommenderEngineRequest keeps refined shared region routing", () => {
  const built = buildRecommenderEngineRequest(validBody({
    latitude: 39.7392,
    longitude: -104.9903,
    state_code: "CO",
    env_data: {
      timezone: "America/Denver",
      fetched_at: "2026-07-11T16:00:00.000Z",
      altitude_ft: 6015,
      weather: {
        temperature: 70,
        pressure: 1014,
        wind_speed: 8,
        cloud_cover: 45,
        precipitation: 0,
        wind_speed_unit: "mph",
        temp_7day_high: Array.from({ length: 21 }, () => 78),
        temp_7day_low: Array.from({ length: 21 }, () => 54),
        precip_7day_daily: Array.from({ length: 21 }, () => 0),
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 10),
      },
      hourly_pressure_mb: Array.from({ length: 48 }, (_, idx) => ({
        time_utc: new Date(Date.UTC(2026, 6, 10, idx)).toISOString(),
        value: 1012 + (idx % 3),
      })),
    },
  }));

  assertEquals(built.timezone, "America/Denver");
  assertEquals(built.engineReq.location.region_key, "mountain_alpine");
  assertEquals(built.shared_req.region_key, "mountain_alpine");
  assertEquals(built.engineReq.location.local_timezone, "America/Denver");
  assertEquals(built.engineReq.species, "smallmouth_bass");
});

Deno.test("buildRecommenderEngineRequest preserves hourly wind inputs for the rebuild engine", () => {
  const rawHourlyWind = hourlyWindForLocalDate("2026-07-18", "-04:00", 18, 3);
  const built = buildRecommenderEngineRequest(floridaLargemouthWindBody(18));

  assertEquals(built.engineReq.env_data.hourly_wind_speed, rawHourlyWind);
  assertEquals(
    (built.engineReq.env_data.weather as Record<string, unknown>)
      .wind_speed_unit,
    "mph",
  );
});

Deno.test("buildRecommenderEngineRequest honors target_date snapshot semantics", () => {
  const built = buildRecommenderEngineRequest(validBody({
    target_date: "2026-07-11",
  }));

  assertEquals(built.local_date, "2026-07-11");
  assertEquals(built.engineReq.location.local_date, "2026-07-11");
});

Deno.test("production request path blocks seasonal surface on high daylight wind", () => {
  const built = buildRecommenderEngineRequest(floridaLargemouthWindBody(18));
  const analysis = analyzeRecommenderConditions(built.engineReq);
  const eng = computeRecommenderRebuild(built.engineReq, analysis);

  assert(eng.dailyTacticalProfile.daylightWindMph > 14);
  assertEquals(eng.dailyTacticalProfile.windBand, "windy");
  assertEquals(eng.dailyTacticalProfile.surfaceBlocked, true);
  assertEquals(eng.dailyTacticalProfile.surfaceAllowedToday, false);
});

Deno.test("production request path keeps seasonal surface open on low daylight wind", () => {
  const built = buildRecommenderEngineRequest(floridaLargemouthWindBody(5));
  const analysis = analyzeRecommenderConditions(built.engineReq);
  const eng = computeRecommenderRebuild(built.engineReq, analysis);

  assertEquals(eng.dailyTacticalProfile.daylightWindMph, 5);
  assertEquals(eng.dailyTacticalProfile.windBand, "calm");
  assertEquals(eng.dailyTacticalProfile.surfaceBlocked, false);
  assertEquals(eng.dailyTacticalProfile.surfaceAllowedToday, true);
});

Deno.test("buildRecommenderEngineRequest uses calendar-day profiling even without target_date", () => {
  const built = buildRecommenderEngineRequest(validBody({
    env_data: {
      timezone: "America/Detroit",
      fetched_at: "2026-06-15T16:00:00.000Z",
      weather: {
        temperature: 47,
        humidity: 70,
        cloud_cover: 100,
        pressure: 1008,
        wind_speed: 6,
        wind_direction: 120,
        precipitation: 0,
        wind_speed_unit: "mph",
        temp_unit: "°F",
        pressure_48hr: Array.from({ length: 48 }, () => 1008),
        temp_7day_high: Array.from({ length: 21 }, (_, i) => 60 + i),
        temp_7day_low: Array.from({ length: 21 }, (_, i) => 40 + i),
        precip_7day_daily: Array.from({ length: 21 }, () => 0),
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 10),
      },
      hourly_pressure_mb: Array.from({ length: 14 * 24 + 13 }, (_, i) => ({
        time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
          .toISOString(),
        value: 1000 + i,
      })),
      hourly_air_temp_f: Array.from({ length: 24 }, (_, h) => ({
        time_utc: new Date(
          `2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`,
        ).toISOString(),
        value: 50 + h,
      })),
      hourly_cloud_cover_pct: [],
      hourly_wind_speed: [],
    },
  }));

  assertEquals(built.shared_req.environment.current_air_temp_f, 64);
});

Deno.test("locationLocalMidnightIso resolves the next local midnight", () => {
  const iso = locationLocalMidnightIso(
    "America/New_York",
    new Date("2026-07-11T16:00:00.000Z"),
  );

  assertEquals(iso, "2026-07-12T04:00:00.000Z");
});

Deno.test("recommender handler rejects missing auth before doing work", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(validBody(), { Authorization: "" }),
    { createAdminClient: () => mockClient({}) as never },
  );

  assertEquals(response.status, 401);
  const json = await response.json();
  assertEquals(json.error, "unauthorized");
});

Deno.test("recommender handler enforces subscription gate", async () => {
  const response = await handleRecommenderRequest(makeRequest(validBody()), {
    createAdminClient: () =>
      mockClient({ userId: "user-1", subscriptionTier: "free" }) as never,
  });

  assertEquals(response.status, 403);
  const json = await response.json();
  assertEquals(json.error, "subscription_required");
});

Deno.test("recommender handler rejects invalid state-species-context combos", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(
      validBody({
        state_code: "FL",
        species: "river_trout",
        context: "freshwater_river",
      }),
    ),
    {
      createAdminClient: () =>
        mockClient({ userId: "user-1", subscriptionTier: "pro" }) as never,
    },
  );

  assertEquals(response.status, 422);
  const json = await response.json();
  assertEquals(json.error, "species_not_available");
});

Deno.test("recommender handler rejects unsupported v3 species even if globally valid", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(
      validBody({
        state_code: "PA",
        species: "walleye",
        context: "freshwater_lake_pond",
      }),
    ),
    {
      createAdminClient: () =>
        mockClient({ userId: "user-1", subscriptionTier: "pro" }) as never,
    },
  );

  assertEquals(response.status, 422);
  const json = await response.json();
  assertEquals(json.error, "unsupported_recommender_scope");
});

Deno.test("recommender handler returns the public surface contract for valid requests", async () => {
  const response = await handleRecommenderRequest(makeRequest(validBody()), {
    createAdminClient: () =>
      mockClient({ userId: "user-1", subscriptionTier: "pro" }) as never,
  });

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.feature, "recommender_rebuild");
  assertEquals(json.species, "smallmouth_bass");
  assertEquals(json.context, "freshwater_river");
  assert(
    json.lure_recommendations.length >= 0 &&
      json.lure_recommendations.length <= 3,
  );
  assert(
    json.fly_recommendations.length >= 0 &&
      json.fly_recommendations.length <= 3,
  );
  assert(
    json.lure_recommendations.length + json.fly_recommendations.length >= 1,
  );
  assertEquals(
    typeof json.summary.daily_tactical_preference.posture_band,
    "string",
  );
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.refreshes_remaining, 1);
  assertEquals(json.recommendation_session.can_refresh, true);
  assertEquals(
    json.recommendation_session.locked_until,
    json.cache_expires_at,
  );
  assertMatch(json.generated_at, /^\d{4}-\d{2}-\d{2}T/);
  assertMatch(json.cache_expires_at, /^\d{4}-\d{2}-\d{2}T/);
  const generated = new Date(json.generated_at).getTime();
  const expires = new Date(json.cache_expires_at).getTime();
  assertEquals(expires > generated, true);
});

Deno.test("recommender daily session: first request creates variant A with one refresh remaining", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const historyWrites: unknown[][] = [];
  const response = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000001",
          subscriptionTier: "pro",
          dailySessions,
          historyWrites,
        }) as never,
    },
  );

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.refreshes_remaining, 1);
  assertEquals(json.recommendation_session.can_refresh, true);
  assertEquals(json.recommendation_session.locked_until, json.cache_expires_at);
  assertEquals(dailySessions.size, 1);
  const row = [...dailySessions.values()][0];
  assertEquals(row.engine_version, RECOMMENDER_DAILY_SESSION_ENGINE_VERSION);
  assertEquals(historyWrites.length, 1);
});

Deno.test("recommender daily session: repeat request returns same active A", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000002",
    subscriptionTier: "pro",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  const second = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );

  assertEquals(first.status, 200);
  assertEquals(second.status, 200);
  const a = await first.json();
  const again = await second.json();
  assertEquals(again.recommendation_session.variant, "A");
  assertEquals(recommendationIds(again), recommendationIds(a));
  assertEquals(again.generated_at, a.generated_at);
});

Deno.test("recommender daily session: refresh after A returns B and locks refresh", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const historyWrites: unknown[][] = [];
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000003",
    subscriptionTier: "pro",
    dailySessions,
    historyWrites,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  const refreshed = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );

  assertEquals(first.status, 200);
  assertEquals(refreshed.status, 200);
  const a = await first.json();
  const b = await refreshed.json();
  assertEquals(a.recommendation_session.variant, "A");
  assertEquals(b.recommendation_session.variant, "B");
  assertEquals(b.recommendation_session.refreshes_remaining, 0);
  assertEquals(b.recommendation_session.can_refresh, false);
  assertEquals(b.recommendation_session.locked_until, b.cache_expires_at);
  assertEquals(historyWrites.length, 2);
  assert(
    recommendationIds(a).join("|") !== recommendationIds(b).join("|"),
    "expected Set B to differ from Set A for rich Florida LMB pool",
  );
});

Deno.test("recommender daily session: repeated refresh returns B without third generation", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const historyWrites: unknown[][] = [];
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000004",
    subscriptionTier: "pro",
    dailySessions,
    historyWrites,
  }) as never;

  await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  const firstRefresh = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );
  const secondRefresh = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );

  const b = await firstRefresh.json();
  const bAgain = await secondRefresh.json();
  assertEquals(bAgain.recommendation_session.variant, "B");
  assertEquals(bAgain.recommendation_session.refreshes_remaining, 0);
  assertEquals(recommendationIds(bAgain), recommendationIds(b));
  assertEquals(bAgain.generated_at, b.generated_at);
  assertEquals(historyWrites.length, 2);
});

Deno.test("recommender daily session: refresh_requested on first request returns A without spending refresh", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000005",
    subscriptionTier: "pro",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );
  const refreshed = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );

  assertEquals(first.status, 200);
  assertEquals(refreshed.status, 200);
  const a = await first.json();
  const b = await refreshed.json();
  assertEquals(a.recommendation_session.variant, "A");
  assertEquals(a.recommendation_session.refreshes_remaining, 1);
  assertEquals(b.recommendation_session.variant, "B");
  assertEquals(b.recommendation_session.refreshes_remaining, 0);
});

Deno.test("recommender daily session: stale refresh claim returns stored B without history write", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const historyWrites: unknown[][] = [];
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000007",
    subscriptionTier: "pro",
    dailySessions,
    historyWrites,
    refreshClaimConflict: true,
  }) as never;

  await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  const refreshed = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );

  assertEquals(refreshed.status, 200);
  const b = await refreshed.json();
  assertEquals(b.recommendation_session.variant, "B");
  assertEquals(b.recommendation_session.refreshes_remaining, 0);
  assertEquals(b.generated_at, "2026-07-18T01:00:00.000Z");
  assertEquals(historyWrites.length, 1);
});

Deno.test("recommender daily session: first-create conflict returns existing session", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const historyWrites: unknown[][] = [];
  const response = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000008",
          subscriptionTier: "pro",
          dailySessions,
          historyWrites,
          firstCreateConflict: true,
        }) as never,
    },
  );

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.refreshes_remaining, 1);
  assertEquals(json.generated_at, "2026-07-18T00:00:00.000Z");
  assertEquals(dailySessions.size, 1);
  assertEquals(historyWrites.length, 0);
});

Deno.test("recommender handler rejects non-boolean refresh_requested", async () => {
  const response = await handleRecommenderRequest(
    makeRequest({ ...validBody(), refresh_requested: "yes" }),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000006",
          subscriptionTier: "pro",
        }) as never,
    },
  );

  assertEquals(response.status, 400);
  const json = await response.json();
  assertEquals(json.error, "invalid_input");
});
