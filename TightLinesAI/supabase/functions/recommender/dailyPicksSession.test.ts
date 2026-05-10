import { assert, assertEquals } from "jsr:@std/assert";
import type { RecommenderRequest } from "../_shared/recommenderEngine/contracts/input.ts";
import {
  DAILY_PICKS_RESPONSE_FEATURE,
  DAILY_PICKS_RESPONSE_VERSION,
  type DailyPicksFutureResponse,
} from "../_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts";
import {
  DAILY_PICKS_SESSION_ENGINE_VERSION,
  dailyPicksLocationLocalMidnightIso,
  type GenerateDailyPicksVariantOptions,
  resolveDailyPicksSession,
} from "./dailyPicksSession.ts";

const LEGACY_REBUILD_SESSION_ENGINE_VERSION =
  "recommender_rebuild_tacv3_sessionv3_goalv1" as const;

function baseReq(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  return {
    location: {
      latitude: 28.54,
      longitude: -81.38,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    env_data: { wind_speed_mph: 5 },
    ...overrides,
  };
}

function pick(id: string, gearMode: "lure" | "fly") {
  return {
    slot: gearMode === "lure"
      ? "lure_of_the_day" as const
      : "fly_of_the_day" as const,
    id,
    display_name: id,
    gear_mode: gearMode,
    family_group: `${gearMode}_family`,
    presentation_group: `${gearMode}_presentation`,
    column: "mid" as const,
    primary_pace: "medium" as const,
    is_surface: false,
    score: 100,
    score_reasons: ["base:+100"],
    why_chosen: "Selected from the valid daily pool.",
    how_to_fish: `fish ${id}`,
  };
}

function futureResponse(args: {
  variant: "A" | "B";
  goal?: "all_purpose" | "big_fish";
  lureIds?: readonly [string, string];
  flyIds?: readonly [string, string];
}): DailyPicksFutureResponse {
  const lureIds = args.lureIds ??
    (args.variant === "A"
      ? ["spinnerbait", "swim_jig"] as const
      : ["paddle_tail_swimbait", "bladed_jig"] as const);
  const flyIds = args.flyIds ??
    (args.variant === "A"
      ? ["clouser_minnow", "deceiver"] as const
      : ["articulated_baitfish_streamer", "foam_gurgler_fly"] as const);

  return {
    feature: DAILY_PICKS_RESPONSE_FEATURE,
    engine_version: DAILY_PICKS_RESPONSE_VERSION,
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: args.goal ?? "all_purpose",
    local_date: "2026-07-18",
    region_key: "florida",
    month: 7,
    scenario_summary: {
      activity_level: "active",
      surface_daily_gate: "open",
      surface_daily_reason_codes: ["seasonal_surface_open"],
      scenario_tags: ["wind_reaction"],
      missing_inputs: [],
      confidence: "high",
    },
    diagnostics: {
      row_authored_lure_count: 4,
      row_authored_fly_count: 4,
      hard_gated_lure_candidate_count: 4,
      hard_gated_fly_candidate_count: 4,
      selected_lure_ids: lureIds,
      selected_fly_ids: flyIds,
      variant: args.variant,
      avoid_lure_ids_applied: [],
      avoid_fly_ids_applied: [],
      scenario_tags: ["wind_reaction"],
      surface_daily_gate: "open",
      missing_inputs: [],
      confidence: "high",
      family_diversity: {
        lures: {
          top_family_group: "test_top_lure_family",
          honorable_family_group: "test_honorable_lure_family",
          different_family_selected: true,
          different_family_available_in_band: true,
        },
        flies: {
          top_family_group: "test_top_fly_family",
          honorable_family_group: "test_honorable_fly_family",
          different_family_selected: true,
          different_family_available_in_band: true,
        },
      },
    },
    picks: {
      lure_of_the_day: { ...pick(lureIds[0], "lure"), slot: "lure_of_the_day" },
      honorable_lure: { ...pick(lureIds[1], "lure"), slot: "honorable_lure" },
      fly_of_the_day: { ...pick(flyIds[0], "fly"), slot: "fly_of_the_day" },
      honorable_fly: { ...pick(flyIds[1], "fly"), slot: "honorable_fly" },
    },
  };
}

function mockClient(options: {
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
    from: (table: string) => {
      if (table !== "recommender_daily_sessions") {
        throw new Error(`unexpected table ${table}`);
      }
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
                variant_b_response: storedBResponse,
              };
              dailySessions.set(keyForRow(storedB), storedB);
            }
          }
          updatePatch = patch;
          return builder;
        },
      };
      return builder;
    },
  };
}

function generatorSpy() {
  const calls: Array<{
    variant: "A" | "B";
    options: GenerateDailyPicksVariantOptions;
  }> = [];
  return {
    calls,
    generate: (
      variant: "A" | "B",
      options: GenerateDailyPicksVariantOptions,
    ) => {
      calls.push({ variant, options });
      return futureResponse({ variant });
    },
  };
}

const NOW = new Date("2026-07-18T16:00:00.000Z");

Deno.test("daily-picks session: first request creates variant A with one refresh remaining", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const resolved = await resolveDailyPicksSession({
    supabase: mockClient({ dailySessions }),
    userId: "user-1",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(resolved.generatedVariant, "A");
  assertEquals(resolved.result.recommendation_session.variant, "A");
  assertEquals(resolved.result.recommendation_session.available_variants, [
    "A",
  ]);
  assertEquals(resolved.result.recommendation_session.can_refresh, true);
  assertEquals(resolved.result.recommendation_session.refreshes_remaining, 1);
  assertEquals(dailySessions.size, 1);
  assertEquals(spy.calls.length, 1);
});

Deno.test("daily-picks session: repeat request returns same A without regeneration", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const client = mockClient({ dailySessions });

  const first = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-2",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const second = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-2",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(second.generatedVariant, null);
  assertEquals(second.result.recommendation_session.variant, "A");
  assertEquals(second.result.generated_at, first.result.generated_at);
  assertEquals(
    second.result.diagnostics.selected_lure_ids,
    first.result.diagnostics.selected_lure_ids,
  );
  assertEquals(spy.calls.length, 1);
});

Deno.test("daily-picks session: refresh after A creates B, stores it, and locks refresh", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const client = mockClient({ dailySessions });

  const first = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-3",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const refreshed = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-3",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(first.result.recommendation_session.variant, "A");
  assertEquals(refreshed.generatedVariant, "B");
  assertEquals(refreshed.result.recommendation_session.variant, "B");
  assertEquals(refreshed.result.recommendation_session.available_variants, [
    "A",
    "B",
  ]);
  assertEquals(refreshed.result.recommendation_session.can_refresh, false);
  assertEquals(refreshed.result.recommendation_session.refreshes_remaining, 0);
  assertEquals(dailySessions.size, 1);
  assertEquals([...dailySessions.values()][0].active_variant, "B");
});

Deno.test("daily-picks session: repeated refresh returns stored B without third generation", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const client = mockClient({ dailySessions });

  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const firstRefresh = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const secondRefresh = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(secondRefresh.generatedVariant, null);
  assertEquals(secondRefresh.result.recommendation_session.variant, "B");
  assertEquals(
    secondRefresh.result.generated_at,
    firstRefresh.result.generated_at,
  );
  assertEquals(spy.calls.length, 2);
});

Deno.test("daily-picks session: stored Set A can be viewed after Set B exists", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const client = mockClient({ dailySessions });

  const first = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4a",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4a",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const viewedA = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-4a",
    req: baseReq(),
    refreshRequested: false,
    viewVariant: "A",
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(viewedA.generatedVariant, null);
  assertEquals(viewedA.result.recommendation_session.variant, "A");
  assertEquals(viewedA.result.recommendation_session.can_refresh, false);
  assertEquals(viewedA.result.recommendation_session.available_variants, [
    "A",
    "B",
  ]);
  assertEquals(
    viewedA.result.diagnostics.selected_lure_ids,
    first.result.diagnostics.selected_lure_ids,
  );
  assertEquals(spy.calls.length, 2);
});

Deno.test("daily-picks session: B receives A selected IDs as avoid IDs", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const spy = generatorSpy();
  const client = mockClient({ dailySessions });

  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-5",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-5",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(spy.calls[1].variant, "B");
  assertEquals(spy.calls[1].options.avoidLureIds, ["spinnerbait", "swim_jig"]);
  assertEquals(spy.calls[1].options.avoidFlyIds, [
    "clouser_minnow",
    "deceiver",
  ]);
});

Deno.test("daily-picks session: goal separates sessions and is part of the key", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({ dailySessions });
  const spy = generatorSpy();

  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-6",
    req: baseReq({ recommendation_goal: "all_purpose" }),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-6",
    req: baseReq({ recommendation_goal: "big_fish" }),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: (variant, options) => {
      spy.calls.push({ variant, options });
      return futureResponse({ variant, goal: "big_fish" });
    },
  });

  assertEquals(dailySessions.size, 2);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.recommendation_goal)),
    new Set(["all_purpose", "big_fish"]),
  );
});

Deno.test("daily-picks session: water clarity separates sessions with fresh refresh allowance", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({ dailySessions });
  const spy = generatorSpy();

  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-6a",
    req: baseReq({ water_clarity: "stained" }),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-6a",
    req: baseReq({ water_clarity: "stained" }),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const clear = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-6a",
    req: baseReq({ water_clarity: "clear" }),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(dailySessions.size, 2);
  assertEquals(clear.result.recommendation_session.variant, "A");
  assertEquals(clear.result.recommendation_session.refreshes_remaining, 1);
  assertEquals(clear.result.recommendation_session.available_variants, ["A"]);
  assertEquals(
    new Set([...dailySessions.values()].map((row) => row.water_clarity)),
    new Set(["stained", "clear"]),
  );
});

Deno.test("daily-picks session: future engine version separates sessions from legacy rebuild sessions", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const req = baseReq();
  const productionLikeRow = {
    user_id: "user-7",
    local_date: req.location.local_date,
    lat_key: req.location.latitude.toFixed(3),
    lon_key: req.location.longitude.toFixed(3),
    state_code: req.location.state_code,
    region_key: req.location.region_key,
    species: req.species,
    water_type: req.context,
    water_clarity: req.water_clarity,
    recommendation_goal: req.recommendation_goal,
    engine_version: LEGACY_REBUILD_SESSION_ENGINE_VERSION,
    active_variant: "A",
    refreshes_used: 0,
    cache_expires_at: "2026-07-19T04:00:00.000Z",
    variant_a_response: {},
    variant_b_response: null,
  };
  dailySessions.set(
    Object.values(productionLikeRow).slice(0, 11).join("|"),
    productionLikeRow,
  );

  await resolveDailyPicksSession({
    supabase: mockClient({ dailySessions }),
    userId: "user-7",
    req,
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: generatorSpy().generate,
  });

  assertEquals(dailySessions.size, 2);
  assert(
    [...dailySessions.values()].some((row) =>
      row.engine_version === DAILY_PICKS_SESSION_ENGINE_VERSION
    ),
  );
});

Deno.test("daily-picks session: local midnight sets cache_expires_at and locked_until", async () => {
  const resolved = await resolveDailyPicksSession({
    supabase: mockClient({}),
    userId: "user-8",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: generatorSpy().generate,
  });
  const expected = dailyPicksLocationLocalMidnightIso(
    "America/New_York",
    NOW,
  );

  assertEquals(resolved.result.cache_expires_at, expected);
  assertEquals(resolved.result.recommendation_session.locked_until, expected);
});

Deno.test("daily-picks session: first-create conflict returns existing session", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const resolved = await resolveDailyPicksSession({
    supabase: mockClient({ dailySessions, firstCreateConflict: true }),
    userId: "user-9",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: generatorSpy().generate,
  });

  assertEquals(resolved.generatedVariant, null);
  assertEquals(resolved.result.recommendation_session.variant, "A");
  assertEquals(resolved.result.generated_at, "2026-07-18T00:00:00.000Z");
});

Deno.test("daily-picks session: stale refresh claim returns stored B", async () => {
  const dailySessions = new Map<string, Record<string, unknown>>();
  const client = mockClient({ dailySessions, refreshClaimConflict: true });
  const spy = generatorSpy();

  await resolveDailyPicksSession({
    supabase: client,
    userId: "user-10",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });
  const resolved = await resolveDailyPicksSession({
    supabase: client,
    userId: "user-10",
    req: baseReq(),
    refreshRequested: true,
    seed: "session-test",
    now: NOW,
    generateVariant: spy.generate,
  });

  assertEquals(resolved.generatedVariant, null);
  assertEquals(resolved.result.recommendation_session.variant, "B");
  assertEquals(resolved.result.generated_at, "2026-07-18T01:00:00.000Z");
});

Deno.test("daily-picks session does not require old 3:3 response fields", async () => {
  const resolved = await resolveDailyPicksSession({
    supabase: mockClient({}),
    userId: "user-11",
    req: baseReq(),
    refreshRequested: false,
    seed: "session-test",
    now: NOW,
    generateVariant: generatorSpy().generate,
  });

  assertEquals("lure_recommendations" in resolved.result, false);
  assertEquals("fly_recommendations" in resolved.result, false);
  assertEquals(resolved.result.picks.lure_of_the_day.id, "spinnerbait");
});

Deno.test("default recommender endpoint no longer imports legacy session modules", async () => {
  const indexText = await Deno.readTextFile(
    "supabase/functions/recommender/index.ts",
  );

  assert(!indexText.includes("./dailySession"));
  assert(!indexText.includes("./recentHistory"));
  assert(!indexText.includes("runRecommenderRebuildSurface"));
});
