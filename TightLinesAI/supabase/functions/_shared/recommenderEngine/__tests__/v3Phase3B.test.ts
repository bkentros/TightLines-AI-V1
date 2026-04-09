import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { RecommenderV3DailyPayload } from "../v3/index.ts";
import {
  resolveDailyPayloadV3,
  resolveFinalProfileV3,
  resolveSeasonalRowV3,
  scoreLureCandidatesV3,
  SMALLMOUTH_V3_SEASONAL_ROWS,
  SMALLMOUTH_V3_SUPPORTED_REGIONS,
} from "../v3/index.ts";

function analysis(overrides: Record<string, unknown> = {}) {
  return {
    scored: {
      score: 60,
      band: "Good",
      drivers: [],
      suppressors: [],
      ...(overrides.scored as object | undefined),
    },
    timing: {
      timing_strength: "good",
      ...(overrides.timing as object | undefined),
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
      ...(overrides.condition_context as object | undefined),
    },
    norm: {
      normalized: {
        pressure_regime: { label: "recently_stabilizing" },
        wind_condition: { score: 0 },
        light_cloud_condition: { label: "mixed_sky" },
        ...((overrides.norm as { normalized?: object } | undefined)
          ?.normalized ?? {}),
      },
    },
  } as any;
}

function request(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  return {
    location: {
      latitude: 35.56,
      longitude: -82.58,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-04-15",
      local_timezone: "America/New_York",
      month: 4,
    },
    species: "smallmouth_bass",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3B covers every supported smallmouth region, month, and context", () => {
  for (const region of SMALLMOUTH_V3_SUPPORTED_REGIONS) {
    for (
      const context of ["freshwater_lake_pond", "freshwater_river"] as const
    ) {
      const monthSet = new Set(
        SMALLMOUTH_V3_SEASONAL_ROWS
          .filter((row) => row.region_key === region && row.context === context)
          .map((row) => row.month),
      );
      const months = [...monthSet].sort((a, b) => a - b);
      assertEquals(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
  }
});

Deno.test("V3 Phase 3B resolves a spring Appalachian river row with a true smallmouth crawfish lane", () => {
  const row = resolveSeasonalRowV3(
    "smallmouth_bass",
    "appalachian",
    4,
    "freshwater_river",
  );
  assertEquals(row.base_water_column, "mid");
  assertEquals(row.base_mood, "neutral");
  assertEquals(row.primary_forage, "crawfish");
  assert(row.viable_lure_archetypes.includes("tube_jig"));
  assert(row.viable_lure_archetypes.includes("inline_spinner"));
  assert(row.viable_fly_archetypes.includes("crawfish_streamer"));
});

Deno.test("V3 Phase 3B keeps a winter Great Lakes smallmouth warm-up bounded away from topwater", () => {
  const row = resolveSeasonalRowV3(
    "smallmouth_bass",
    "great_lakes_upper_midwest",
    2,
    "freshwater_river",
  );
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 74, band: "Good" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow" },
          wind_condition: { score: -0.5 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );
  const resolved = resolveFinalProfileV3(row, daily, "stained");

  assertEquals(resolved.final_water_column, "mid");
  assertEquals(resolved.final_mood, "active");

  const result = runRecommenderV3(request({
    location: {
      latitude: 44.76,
      longitude: -85.62,
      state_code: "MI",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-02-20",
      local_timezone: "America/New_York",
      month: 2,
    },
    water_clarity: "stained",
  }));

  assert(
    result.lure_recommendations.every((candidate) =>
      candidate.tactical_lane !== "surface"
    ),
  );
  assert(
    result.fly_recommendations.every((candidate) =>
      candidate.tactical_lane !== "fly_surface"
    ),
  );
});

Deno.test("V3 Phase 3B returns tube-forward, color-guided smallmouth recommendations for spring rivers", () => {
  const result = runRecommenderV3(request());

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "tube_jig"
    ),
  );

  for (
    const candidate of [
      ...result.lure_recommendations,
      ...result.fly_recommendations,
    ]
  ) {
    assertEquals(candidate.color_recommendations.length, 3);
    assert(candidate.score > 0);
  }
});

Deno.test("V3 Phase 3B gives smallmouth specialty winners explicit narrow primary windows", () => {
  const midsummerPopper = resolveSeasonalRowV3(
    "smallmouth_bass",
    "great_lakes_upper_midwest",
    7,
    "freshwater_lake_pond",
  );
  const dirtySummerCrank = resolveSeasonalRowV3(
    "smallmouth_bass",
    "midwest_interior",
    6,
    "freshwater_lake_pond",
  );

  assertEquals(midsummerPopper.primary_lure_archetypes, [
    "popping_topwater",
    "walking_topwater",
  ]);
  assertEquals(dirtySummerCrank.primary_lure_archetypes, [
    "medium_diving_crankbait",
    "spinnerbait",
  ]);
});

Deno.test("V3 Phase 3B gives smallmouth finesse winners real seasonal windows", () => {
  const nedRow = resolveSeasonalRowV3(
    "smallmouth_bass",
    "appalachian",
    5,
    "freshwater_lake_pond",
  );
  const finesseJigRow = resolveSeasonalRowV3(
    "smallmouth_bass",
    "great_lakes_upper_midwest",
    11,
    "freshwater_lake_pond",
  );
  const toughDaily: RecommenderV3DailyPayload = {
    mood_nudge: "down_1",
    water_column_nudge: "lower_1",
    presentation_nudge: "subtler",
    surface_window: "off",
    reaction_window: "off",
    finesse_window: "on",
    pace_bias: "slow",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 48,
    source_band: "Fair",
  };

  assertEquals(nedRow.primary_lure_archetypes, ["ned_rig", "tube_jig"]);
  assertEquals(finesseJigRow.primary_lure_archetypes, [
    "finesse_jig",
    "tube_jig",
  ]);

  const nedResolved = resolveFinalProfileV3(nedRow, toughDaily, "clear");
  const nedRecommendations = scoreLureCandidatesV3(
    nedRow,
    nedResolved,
    toughDaily,
    "clear",
    "bright",
  );
  const finesseJigResolved = resolveFinalProfileV3(
    finesseJigRow,
    toughDaily,
    "clear",
  );
  const finesseJigRecommendations = scoreLureCandidatesV3(
    finesseJigRow,
    finesseJigResolved,
    toughDaily,
    "clear",
    "bright",
  );

  assertEquals(nedRecommendations[0]?.id, "ned_rig");
  assertEquals(finesseJigRecommendations[0]?.id, "finesse_jig");
});
