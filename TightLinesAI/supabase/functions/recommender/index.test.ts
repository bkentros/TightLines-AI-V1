import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildRecommenderEngineRequest,
  handleRecommenderRequest,
} from "./index.ts";
import { DAILY_PICKS_SESSION_ENGINE_VERSION } from "./dailyPicksSession.ts";

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

function previewHeaders(): HeadersInit {
  return { "x-recommender-preview": "daily_picks_2x2" };
}

function previewPickIds(json: {
  diagnostics: {
    selected_lure_ids: string[];
    selected_fly_ids: string[];
  };
}): string[] {
  return [
    ...json.diagnostics.selected_lure_ids.map((id) => `lure:${id}`),
    ...json.diagnostics.selected_fly_ids.map((id) => `fly:${id}`),
  ];
}

function mockClient(options: {
  userId?: string | null;
  authError?: unknown;
  subscriptionTier?: string | null;
  freeRecommenderTrialUsed?: boolean;
  dailySessions?: Map<string, Record<string, unknown>>;
  firstCreateConflict?: boolean;
  refreshClaimConflict?: boolean;
}) {
  const dailySessions = options.dailySessions ??
    new Map<string, Record<string, unknown>>();
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
    "recommendation_goal",
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
                  : {
                    subscription_tier: options.subscriptionTier,
                    free_recommender_trial_used_at:
                      options.freeRecommenderTrialUsed
                        ? "2026-01-01T00:00:00.000Z"
                        : null,
                    free_water_read_trial_used_at: null,
                    free_today_bite_full_used_at: null,
                  },
              }),
            }),
          }),
          update: () => ({
            eq: () => ({
              is: async () => ({ error: null }),
            }),
          }),
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
  assertEquals(built.engineReq.recommendation_goal, "all_purpose");
});

Deno.test("buildRecommenderEngineRequest preserves hourly wind inputs for daily-picks", () => {
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

Deno.test("recommender handler rejects missing auth before doing work", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(validBody(), { Authorization: "" }),
    { createAdminClient: () => mockClient({}) as never },
  );

  assertEquals(response.status, 401);
  const json = await response.json();
  assertEquals(json.error, "unauthorized");
});

Deno.test("recommender handler enforces subscription gate after free trial spent", async () => {
  const response = await handleRecommenderRequest(makeRequest(validBody()), {
    createAdminClient: () =>
      mockClient({
        userId: "user-1",
        subscriptionTier: "free",
        freeRecommenderTrialUsed: true,
      }) as never,
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
        mockClient({ userId: "user-1", subscriptionTier: "angler" }) as never,
    },
  );

  assertEquals(response.status, 422);
  const json = await response.json();
  assertEquals(json.error, "species_not_available");
});

Deno.test("recommender handler rejects unsupported daily-picks species even if globally valid", async () => {
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
        mockClient({ userId: "user-1", subscriptionTier: "angler" }) as never,
    },
  );

  assertEquals(response.status, 422);
  const json = await response.json();
  assertEquals(json.error, "unsupported_recommender_scope");
});

Deno.test("recommender handler rejects invalid recommendation_goal", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(validBody({ recommendation_goal: "numbers_only" })),
    {
      createAdminClient: () =>
        mockClient({ userId: "user-1", subscriptionTier: "angler" }) as never,
    },
  );

  assertEquals(response.status, 400);
  const json = await response.json();
  assertEquals(json.error, "invalid_goal");
  assertEquals(
    json.message,
    "Invalid recommendation_goal. Must be: all_purpose | big_fish",
  );
});

Deno.test("recommender handler returns daily-picks 2x2 by default for valid requests", async () => {
  const response = await handleRecommenderRequest(makeRequest(validBody()), {
    createAdminClient: () =>
      mockClient({ userId: "user-1", subscriptionTier: "angler" }) as never,
  });

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.feature, "recommender_daily_picks_2x2_future");
  assertEquals(json.engine_version, "daily_picks_2x2_response_v1");
  assertEquals(json.species, "smallmouth_bass");
  assertEquals(json.context, "freshwater_river");
  assertEquals(json.recommendation_goal, "all_purpose");
  assertEquals(Object.keys(json.picks).sort(), [
    "fly_of_the_day",
    "honorable_fly",
    "honorable_lure",
    "lure_of_the_day",
  ]);
  assertEquals("lure_recommendations" in json, false);
  assertEquals("fly_recommendations" in json, false);
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.available_variants, ["A"]);
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

Deno.test("recommender preview gate returns future daily-picks 2x2 response", async () => {
  const response = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000101",
          subscriptionTier: "angler",
        }) as never,
    },
  );

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.feature, "recommender_daily_picks_2x2_future");
  assertEquals(Object.keys(json.picks).sort(), [
    "fly_of_the_day",
    "honorable_fly",
    "honorable_lure",
    "lure_of_the_day",
  ]);
  assertEquals("lure_recommendations" in json, false);
  assertEquals("fly_recommendations" in json, false);
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.available_variants, ["A"]);
  assertEquals(json.recommendation_session.refreshes_remaining, 1);
});

Deno.test("recommender preview daily-picks session: repeat request returns same stored A", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000102",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );
  const second = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );

  const a = await first.json();
  const again = await second.json();
  assertEquals(again.recommendation_session.variant, "A");
  assertEquals(previewPickIds(again), previewPickIds(a));
  assertEquals(again.generated_at, a.generated_at);
  assertEquals(dailySessions.size, 1);
});

Deno.test("recommender preview daily-picks session: refresh creates B with avoid IDs and locks", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000103",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );
  const refreshed = await handleRecommenderRequest(
    makeRequest(
      { ...floridaLargemouthWindBody(5), refresh_requested: true },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );

  const a = await first.json();
  const b = await refreshed.json();
  assertEquals(a.recommendation_session.variant, "A");
  assertEquals(b.recommendation_session.variant, "B");
  assertEquals(b.recommendation_session.available_variants, ["A", "B"]);
  assertEquals(b.recommendation_session.can_refresh, false);
  assertEquals(b.recommendation_session.refreshes_remaining, 0);
  assertEquals(
    b.diagnostics.avoid_lure_ids_applied,
    a.diagnostics.selected_lure_ids,
  );
  assertEquals(
    b.diagnostics.avoid_fly_ids_applied,
    a.diagnostics.selected_fly_ids,
  );
  assertEquals([...dailySessions.values()][0].active_variant, "B");
});

Deno.test("recommender preview daily-picks session: repeated refresh returns stored B", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000104",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );
  const firstRefresh = await handleRecommenderRequest(
    makeRequest(
      { ...floridaLargemouthWindBody(5), refresh_requested: true },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );
  const secondRefresh = await handleRecommenderRequest(
    makeRequest(
      { ...floridaLargemouthWindBody(5), refresh_requested: true },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );

  const b = await firstRefresh.json();
  const bAgain = await secondRefresh.json();
  assertEquals(bAgain.recommendation_session.variant, "B");
  assertEquals(previewPickIds(bAgain), previewPickIds(b));
  assertEquals(bAgain.generated_at, b.generated_at);
  assertEquals(dailySessions.size, 1);
});

Deno.test("recommender preview daily-picks session: stored A can be viewed after B exists", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000104",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );
  await handleRecommenderRequest(
    makeRequest(
      { ...floridaLargemouthWindBody(5), refresh_requested: true },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );
  const viewedA = await handleRecommenderRequest(
    makeRequest(
      { ...floridaLargemouthWindBody(5), view_variant: "A" },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );

  const a = await first.json();
  const aAgain = await viewedA.json();
  assertEquals(viewedA.status, 200);
  assertEquals(aAgain.recommendation_session.variant, "A");
  assertEquals(aAgain.recommendation_session.can_refresh, false);
  assertEquals(aAgain.recommendation_session.available_variants, ["A", "B"]);
  assertEquals(previewPickIds(aAgain), previewPickIds(a));
  assertEquals(dailySessions.size, 1);
});

Deno.test("recommender preview header remains compatible with default daily-picks sessions", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000105",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const production = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  const preview = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5), previewHeaders()),
    { createAdminClient: () => client },
  );

  assertEquals(production.status, 200);
  assertEquals(preview.status, 200);
  const productionJson = await production.json();
  const previewJson = await preview.json();
  assertEquals(productionJson.feature, "recommender_daily_picks_2x2_future");
  assertEquals(previewJson.feature, "recommender_daily_picks_2x2_future");
  assertEquals(previewPickIds(previewJson), previewPickIds(productionJson));
  assertEquals(dailySessions.size, 1);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.engine_version)),
    new Set([DAILY_PICKS_SESSION_ENGINE_VERSION]),
  );
});

Deno.test("recommender preview all-purpose and big-fish sessions remain separate", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000106",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;
  const baseBody = floridaLargemouthWindBody(5);

  const allPurpose = await handleRecommenderRequest(
    makeRequest(
      { ...baseBody, recommendation_goal: "all_purpose" },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );
  const bigFish = await handleRecommenderRequest(
    makeRequest(
      { ...baseBody, recommendation_goal: "big_fish" },
      previewHeaders(),
    ),
    { createAdminClient: () => client },
  );

  assertEquals(allPurpose.status, 200);
  assertEquals(bigFish.status, 200);
  const allJson = await allPurpose.json();
  const bigJson = await bigFish.json();
  assertEquals(allJson.recommendation_goal, "all_purpose");
  assertEquals(bigJson.recommendation_goal, "big_fish");
  assertEquals(dailySessions.size, 2);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.recommendation_goal)),
    new Set(["all_purpose", "big_fish"]),
  );
});

Deno.test("recommender CORS allows internal preview header", async () => {
  const response = await handleRecommenderRequest(
    new Request("https://example.com/functions/v1/recommender", {
      method: "OPTIONS",
    }),
  );

  assertEquals(response.status, 204);
  assert(
    response.headers.get("Access-Control-Allow-Headers")?.includes(
      "x-recommender-preview",
    ),
  );
});

Deno.test("recommender default daily-picks session: first request creates variant A with one refresh remaining", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const response = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000001",
          subscriptionTier: "angler",
          dailySessions,
        }) as never,
    },
  );

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.recommendation_session.variant, "A");
  assertEquals(json.recommendation_session.available_variants, ["A"]);
  assertEquals(json.recommendation_session.refreshes_remaining, 1);
  assertEquals(json.recommendation_session.can_refresh, true);
  assertEquals(json.recommendation_session.locked_until, json.cache_expires_at);
  assertEquals(dailySessions.size, 1);
  const row = [...dailySessions.values()][0];
  assertEquals(row.engine_version, DAILY_PICKS_SESSION_ENGINE_VERSION);
  assertEquals(row.recommendation_goal, "all_purpose");
});

Deno.test("recommender default daily-picks session: repeat request returns same active A", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000002",
    subscriptionTier: "angler",
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
  assertEquals(previewPickIds(again), previewPickIds(a));
  assertEquals(again.generated_at, a.generated_at);
});

Deno.test("recommender default daily-picks session: refresh after A returns B and locks refresh", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000003",
    subscriptionTier: "angler",
    dailySessions,
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
  assertEquals(b.recommendation_session.available_variants, ["A", "B"]);
  assertEquals(b.recommendation_session.refreshes_remaining, 0);
  assertEquals(b.recommendation_session.can_refresh, false);
  assertEquals(b.recommendation_session.locked_until, b.cache_expires_at);
  assert(
    previewPickIds(a).join("|") !== previewPickIds(b).join("|"),
    "expected Set B to differ from Set A for rich Florida LMB pool",
  );
});

Deno.test("recommender default daily-picks session: goal separates all-purpose and big-fish sessions", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000009",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const baseBody = floridaLargemouthWindBody(5);
  const allPurpose = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "all_purpose" }),
    { createAdminClient: () => client },
  );
  const bigFish = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "big_fish" }),
    { createAdminClient: () => client },
  );
  const allPurposeAgain = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "all_purpose" }),
    { createAdminClient: () => client },
  );

  assertEquals(allPurpose.status, 200);
  assertEquals(bigFish.status, 200);
  assertEquals(allPurposeAgain.status, 200);
  const allJson = await allPurpose.json();
  const bigJson = await bigFish.json();
  const allAgainJson = await allPurposeAgain.json();

  assertEquals(allJson.recommendation_goal, "all_purpose");
  assertEquals(bigJson.recommendation_goal, "big_fish");
  assertEquals(allAgainJson.recommendation_goal, "all_purpose");
  assertEquals(allAgainJson.recommendation_session.variant, "A");
  assertEquals(allAgainJson.generated_at, allJson.generated_at);
  assertEquals(dailySessions.size, 2);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.recommendation_goal)),
    new Set(["all_purpose", "big_fish"]),
  );
});

Deno.test("recommender default daily-picks session: refresh for one goal does not spend the other goal", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000010",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const baseBody = floridaLargemouthWindBody(5);
  const allPurpose = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "all_purpose" }),
    { createAdminClient: () => client },
  );
  const bigFish = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "big_fish" }),
    { createAdminClient: () => client },
  );
  const refreshedBigFish = await handleRecommenderRequest(
    makeRequest({
      ...baseBody,
      recommendation_goal: "big_fish",
      refresh_requested: true,
    }),
    { createAdminClient: () => client },
  );
  const allPurposeAgain = await handleRecommenderRequest(
    makeRequest({ ...baseBody, recommendation_goal: "all_purpose" }),
    { createAdminClient: () => client },
  );

  assertEquals(allPurpose.status, 200);
  assertEquals(bigFish.status, 200);
  assertEquals(refreshedBigFish.status, 200);
  assertEquals(allPurposeAgain.status, 200);

  const allJson = await allPurpose.json();
  const bigJson = await bigFish.json();
  const refreshedBigJson = await refreshedBigFish.json();
  const allAgainJson = await allPurposeAgain.json();

  assertEquals(allJson.recommendation_session.variant, "A");
  assertEquals(bigJson.recommendation_session.variant, "A");
  assertEquals(refreshedBigJson.recommendation_goal, "big_fish");
  assertEquals(refreshedBigJson.recommendation_session.variant, "B");
  assertEquals(refreshedBigJson.recommendation_session.refreshes_remaining, 0);
  assertEquals(allAgainJson.recommendation_goal, "all_purpose");
  assertEquals(allAgainJson.recommendation_session.variant, "A");
  assertEquals(allAgainJson.recommendation_session.refreshes_remaining, 1);
  assertEquals(allAgainJson.generated_at, allJson.generated_at);
  assertEquals(dailySessions.size, 2);
});

Deno.test("recommender default daily-picks session: water clarity creates a separate session with fresh refresh allowance", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000011",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;
  const baseBody = floridaLargemouthWindBody(5);

  await handleRecommenderRequest(
    makeRequest({ ...baseBody, water_clarity: "stained" }),
    { createAdminClient: () => client },
  );
  await handleRecommenderRequest(
    makeRequest({
      ...baseBody,
      water_clarity: "stained",
      refresh_requested: true,
    }),
    { createAdminClient: () => client },
  );
  const clear = await handleRecommenderRequest(
    makeRequest({ ...baseBody, water_clarity: "clear" }),
    { createAdminClient: () => client },
  );

  assertEquals(clear.status, 200);
  const clearJson = await clear.json();
  assertEquals(clearJson.water_clarity, "clear");
  assertEquals(clearJson.recommendation_session.variant, "A");
  assertEquals(clearJson.recommendation_session.refreshes_remaining, 1);
  assertEquals(clearJson.recommendation_session.available_variants, ["A"]);
  assertEquals(dailySessions.size, 2);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.water_clarity)),
    new Set(["stained", "clear"]),
  );
});

Deno.test("recommender default daily-picks session: repeated refresh returns B without third generation", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000004",
    subscriptionTier: "angler",
    dailySessions,
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
  assertEquals(previewPickIds(bAgain), previewPickIds(b));
  assertEquals(bAgain.generated_at, b.generated_at);
});

Deno.test("recommender default daily-picks session: stored A can be viewed after B exists", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000012",
    subscriptionTier: "angler",
    dailySessions,
  }) as never;

  const first = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    { createAdminClient: () => client },
  );
  await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), refresh_requested: true }),
    { createAdminClient: () => client },
  );
  const viewedA = await handleRecommenderRequest(
    makeRequest({ ...floridaLargemouthWindBody(5), view_variant: "A" }),
    { createAdminClient: () => client },
  );

  const a = await first.json();
  const aAgain = await viewedA.json();
  assertEquals(viewedA.status, 200);
  assertEquals(aAgain.recommendation_session.variant, "A");
  assertEquals(aAgain.recommendation_session.can_refresh, false);
  assertEquals(aAgain.recommendation_session.available_variants, ["A", "B"]);
  assertEquals(previewPickIds(aAgain), previewPickIds(a));
  assertEquals(dailySessions.size, 1);
});

Deno.test("recommender default daily-picks session: refresh_requested on first request returns A without spending refresh", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000005",
    subscriptionTier: "angler",
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

Deno.test("recommender default daily-picks session: stale refresh claim returns stored B", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({
    userId: "00000000-0000-0000-0000-000000000007",
    subscriptionTier: "angler",
    dailySessions,
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
});

Deno.test("recommender default daily-picks session: first-create conflict returns existing session", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const response = await handleRecommenderRequest(
    makeRequest(floridaLargemouthWindBody(5)),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000008",
          subscriptionTier: "angler",
          dailySessions,
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
});

Deno.test("recommender handler rejects non-boolean refresh_requested", async () => {
  const response = await handleRecommenderRequest(
    makeRequest({ ...validBody(), refresh_requested: "yes" }),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000006",
          subscriptionTier: "angler",
        }) as never,
    },
  );

  assertEquals(response.status, 400);
  const json = await response.json();
  assertEquals(json.error, "invalid_input");
});

Deno.test("recommender handler rejects invalid view_variant", async () => {
  const response = await handleRecommenderRequest(
    makeRequest({ ...validBody(), view_variant: "C" }),
    {
      createAdminClient: () =>
        mockClient({
          userId: "00000000-0000-0000-0000-000000000108",
          subscriptionTier: "angler",
        }) as never,
    },
  );

  assertEquals(response.status, 400);
  const json = await response.json();
  assertEquals(json.error, "invalid_view_variant");
});
