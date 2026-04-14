import { assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildRecommenderEngineRequest,
  handleRecommenderRequest,
} from "./index.ts";
import { locationLocalMidnightIso } from "../_shared/recommenderEngine/runRecommenderV3Surface.ts";

function makeRequest(body: Record<string, unknown>, headers: HeadersInit = {}): Request {
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

function validBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
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

function mockClient(options: {
  userId?: string | null;
  authError?: unknown;
  subscriptionTier?: string | null;
}) {
  return {
    auth: {
      getUser: async () => ({
        data: { user: options.userId ? { id: options.userId } : null },
        error: options.authError ?? null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data:
              options.subscriptionTier === undefined
                ? null
                : { subscription_tier: options.subscriptionTier },
          }),
        }),
      }),
    }),
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
        time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000).toISOString(),
        value: 1000 + i,
      })),
      hourly_air_temp_f: Array.from({ length: 24 }, (_, h) => ({
        time_utc: new Date(`2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`).toISOString(),
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
  assertEquals(json.feature, "recommender_v3");
  assertEquals(json.species, "smallmouth_bass");
  assertEquals(json.context, "freshwater_river");
  assertEquals(json.lure_recommendations.length, 3);
  assertEquals(json.fly_recommendations.length, 3);
  assertEquals(typeof json.summary.daily_tactical_preference.posture_band, "string");
  assertMatch(json.generated_at, /^\d{4}-\d{2}-\d{2}T/);
  assertMatch(json.cache_expires_at, /^\d{4}-\d{2}-\d{2}T/);
  const generated = new Date(json.generated_at).getTime();
  const expires = new Date(json.cache_expires_at).getTime();
  assertEquals(expires > generated, true);
});
