import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { RecommenderV3DailyPayload } from "../v3/index.ts";
import type { RecommenderV3SeasonalRow } from "../v3/index.ts";
import {
  resolveDailyPayloadV3,
  resolveFinalProfileV3,
  resolveSeasonalRowV3,
  scoreLureCandidatesV3,
  scoreFlyCandidatesV3,
  TROUT_V3_SEASONAL_ROWS,
  TROUT_V3_SUPPORTED_REGIONS,
} from "../v3/index.ts";
import { getValidSpeciesForState, isSpeciesValidForState } from "../index.ts";

function analysis(overrides: Record<string, unknown> = {}) {
  return {
    scored: {
      score: 58,
      band: "Fair",
      drivers: [],
      suppressors: [],
      ...(overrides.scored as object | undefined),
    },
    timing: {
      timing_strength: "fair",
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
      latitude: 45.31,
      longitude: -121.69,
      state_code: "OR",
      region_key: "mountain_west",
      local_date: "2026-10-05",
      local_timezone: "America/Los_Angeles",
      month: 10,
    },
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "clear",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3C keeps trout geo-gated by the shared state species map", () => {
  assertEquals(
    isSpeciesValidForState("FL", "river_trout", "freshwater_river"),
    false,
  );
  assertEquals(
    isSpeciesValidForState("NC", "river_trout", "freshwater_river"),
    true,
  );

  const ncFreshwaterRiverSpecies = getValidSpeciesForState(
    "NC",
    "freshwater_river",
  )
    .map((entry: { species: string }) => entry.species);
  assert(ncFreshwaterRiverSpecies.includes("river_trout"));
});

Deno.test("V3 Phase 3C covers every supported trout region and month for river context", () => {
  for (const region of TROUT_V3_SUPPORTED_REGIONS) {
    const monthSet = new Set(
      TROUT_V3_SEASONAL_ROWS
        .filter((row: RecommenderV3SeasonalRow) =>
          row.region_key === region && row.context === "freshwater_river"
        )
        .map((row: RecommenderV3SeasonalRow) => row.month),
    );
    const months = [...monthSet].sort((a: number, b: number) => a - b);

    assertEquals(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }
});

Deno.test("V3 Phase 3C resolves warm-tailwater trout as summer-deeper and more restrained", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "south_central",
    8,
    "freshwater_river",
  );
  assertEquals(row.base_water_column, "bottom");
  assertEquals(row.base_mood, "negative");
  assertEquals(row.primary_forage, "baitfish");
  assert(row.viable_fly_archetypes.includes("muddler_sculpin"));
  assert(!row.viable_fly_archetypes.includes("mouse_fly"));
});

Deno.test("V3 Phase 3C keeps a cold-season trout warm-up bounded away from surface output", () => {
  const row = resolveSeasonalRowV3("trout", "northeast", 1, "freshwater_river");
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 72, band: "Good" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow" },
          wind_condition: { score: -0.6 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );
  const resolved = resolveFinalProfileV3(row, daily, "clear");
  // Mid seasonal + higher_1 daily nudge moves one step shallower.
  assertEquals(resolved.final_water_column, "shallow");
  assertEquals(resolved.final_mood, "active");

  const result = runRecommenderV3(request({
    location: {
      latitude: 41.99,
      longitude: -74.92,
      state_code: "NY",
      region_key: "northeast",
      local_date: "2026-01-20",
      local_timezone: "America/New_York",
      month: 1,
    },
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

Deno.test("V3 Phase 3C gives western midsummer trout a real mouse-fly window without changing the lure story", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "mountain_west",
    7,
    "freshwater_river",
  );
  assertEquals(row.base_water_column, "shallow");
  assertEquals(row.base_mood, "active");
  assertEquals(row.primary_lure_archetypes, [
    "inline_spinner",
    "soft_jerkbait",
  ]);
  assertEquals(row.primary_fly_archetypes, [
    "mouse_fly",
    "slim_minnow_streamer",
  ]);
  assert(row.viable_fly_archetypes.includes("mouse_fly"));

  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 72, band: "Good" },
      timing: {
        timing_strength: "good",
        highlighted_periods: [true, false, false, true],
      },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow", score: 0.7 },
          wind_condition: { label: "light", score: 0.65 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );
  const resolved = resolveFinalProfileV3(row, daily, "clear");
  const flies = scoreFlyCandidatesV3(
    row,
    resolved,
    daily,
    "clear",
    "low_light",
  );

  assertEquals(daily.surface_window, "on");
  assertEquals(flies[0]?.id, "mouse_fly");
});

Deno.test("V3 Phase 3C rotates cool-summer trout baitfish flies by daily posture", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "mountain_west",
    6,
    "freshwater_river",
  );
  assertEquals(row.primary_fly_archetypes, [
    "slim_minnow_streamer",
    "clouser_minnow",
  ]);

  const slowDaily: RecommenderV3DailyPayload = {
    mood_nudge: "down_1",
    water_column_nudge: "neutral",
    presentation_nudge: "subtler",
    surface_window: "off",
    reaction_window: "off",
    finesse_window: "on",
    pace_bias: "slow",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 54,
    source_band: "Fair",
  };
  const fastDaily: RecommenderV3DailyPayload = {
    mood_nudge: "up_1",
    water_column_nudge: "neutral",
    presentation_nudge: "bolder",
    surface_window: "off",
    reaction_window: "on",
    finesse_window: "off",
    pace_bias: "fast",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 72,
    source_band: "Good",
  };

  const slowResolved = resolveFinalProfileV3(row, slowDaily, "clear");
  const fastResolved = resolveFinalProfileV3(row, fastDaily, "clear");
  const slowFlies = scoreFlyCandidatesV3(
    row,
    slowResolved,
    slowDaily,
    "clear",
    "bright",
  );
  const fastFlies = scoreFlyCandidatesV3(
    row,
    fastResolved,
    fastDaily,
    "clear",
    "low_light",
  );

  assertEquals(slowFlies[0]?.id, "slim_minnow_streamer");
  assertEquals(fastFlies[0]?.id, "clouser_minnow");
});

Deno.test("V3 Phase 3C rotates warm-tailwater trout bottom flies by daily pace", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "south_central",
    8,
    "freshwater_river",
  );
  assertEquals(row.primary_fly_archetypes, [
    "muddler_sculpin",
    "woolly_bugger",
  ]);

  const slowDaily: RecommenderV3DailyPayload = {
    mood_nudge: "down_1",
    water_column_nudge: "neutral",
    presentation_nudge: "subtler",
    surface_window: "off",
    reaction_window: "off",
    finesse_window: "on",
    pace_bias: "slow",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 46,
    source_band: "Fair",
  };
  const fastDaily: RecommenderV3DailyPayload = {
    mood_nudge: "up_1",
    water_column_nudge: "higher_1",
    presentation_nudge: "bolder",
    surface_window: "off",
    reaction_window: "on",
    finesse_window: "off",
    pace_bias: "fast",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 68,
    source_band: "Good",
  };

  const slowResolved = resolveFinalProfileV3(row, slowDaily, "clear");
  const fastResolved = resolveFinalProfileV3(row, fastDaily, "clear");
  const slowFlies = scoreFlyCandidatesV3(
    row,
    slowResolved,
    slowDaily,
    "clear",
    "bright",
  );
  const fastFlies = scoreFlyCandidatesV3(
    row,
    fastResolved,
    fastDaily,
    "clear",
    "mixed_sky",
  );

  assertEquals(slowFlies[0]?.id, "woolly_bugger");
  assertEquals(fastFlies[0]?.id, "muddler_sculpin");
});

Deno.test("V3 Phase 3C gives trout specialty streamers distinct seasonal winner windows", () => {
  const bucktailRow = resolveSeasonalRowV3(
    "trout",
    "mountain_west",
    4,
    "freshwater_river",
  );
  const zonkerRow = resolveSeasonalRowV3(
    "trout",
    "northeast",
    11,
    "freshwater_river",
  );
  const sculpzillaRow = resolveSeasonalRowV3(
    "trout",
    "southwest_high_desert",
    8,
    "freshwater_river",
  );
  const coneheadRow = resolveSeasonalRowV3(
    "trout",
    "pacific_northwest",
    12,
    "freshwater_river",
  );

  assertEquals(bucktailRow.primary_fly_archetypes, [
    "bucktail_baitfish_streamer",
    "slim_minnow_streamer",
  ]);
  assertEquals(zonkerRow.primary_fly_archetypes, [
    "zonker_streamer",
    "articulated_baitfish_streamer",
  ]);
  assertEquals(sculpzillaRow.primary_fly_archetypes, [
    "sculpzilla",
    "sculpin_streamer",
  ]);
  assertEquals(coneheadRow.primary_fly_archetypes, [
    "conehead_streamer",
    "sculpin_streamer",
  ]);

  const bucktailDaily: RecommenderV3DailyPayload = {
    mood_nudge: "neutral",
    water_column_nudge: "neutral",
    presentation_nudge: "neutral",
    surface_window: "off",
    reaction_window: "off",
    finesse_window: "watch",
    pace_bias: "neutral",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 58,
    source_band: "Fair",
  };
  const zonkerDaily: RecommenderV3DailyPayload = {
    mood_nudge: "neutral",
    water_column_nudge: "neutral",
    presentation_nudge: "neutral",
    surface_window: "off",
    reaction_window: "watch",
    finesse_window: "watch",
    pace_bias: "neutral",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 61,
    source_band: "Good",
  };
  const sculpzillaDaily: RecommenderV3DailyPayload = {
    mood_nudge: "neutral",
    water_column_nudge: "lower_1",
    presentation_nudge: "neutral",
    surface_window: "off",
    reaction_window: "watch",
    finesse_window: "off",
    pace_bias: "neutral",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 64,
    source_band: "Good",
  };
  const coneheadDaily: RecommenderV3DailyPayload = {
    mood_nudge: "down_1",
    water_column_nudge: "lower_1",
    presentation_nudge: "neutral",
    surface_window: "off",
    reaction_window: "off",
    finesse_window: "watch",
    pace_bias: "slow",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 56,
    source_band: "Fair",
  };

  const bucktailResolved = resolveFinalProfileV3(
    bucktailRow,
    bucktailDaily,
    "clear",
  );
  const zonkerResolved = resolveFinalProfileV3(
    zonkerRow,
    zonkerDaily,
    "clear",
  );
  const sculpzillaResolved = resolveFinalProfileV3(
    sculpzillaRow,
    sculpzillaDaily,
    "clear",
  );
  const coneheadResolved = resolveFinalProfileV3(
    coneheadRow,
    coneheadDaily,
    "clear",
  );

  assertEquals(
    scoreFlyCandidatesV3(
      bucktailRow,
      bucktailResolved,
      bucktailDaily,
      "clear",
      "mixed_sky",
    )[0]?.id,
    "bucktail_baitfish_streamer",
  );
  assertEquals(
    scoreFlyCandidatesV3(
      zonkerRow,
      zonkerResolved,
      zonkerDaily,
      "clear",
      "mixed_sky",
    )[0]?.id,
    "zonker_streamer",
  );
  assertEquals(
    scoreFlyCandidatesV3(
      sculpzillaRow,
      sculpzillaResolved,
      sculpzillaDaily,
      "clear",
      "mixed_sky",
    )[0]?.id,
    "sculpzilla",
  );
  assertEquals(
    scoreFlyCandidatesV3(
      coneheadRow,
      coneheadResolved,
      coneheadDaily,
      "clear",
      "mixed_sky",
    )[0]?.id,
    "conehead_streamer",
  );
});

Deno.test("V3 Phase 3C returns trout-focused fall river recommendations with color guidance", () => {
  const result = runRecommenderV3(request());

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
  assert(
    result.lure_recommendations.some((candidate) =>
      candidate.id === "inline_spinner" ||
      candidate.id === "suspending_jerkbait"
    ),
  );
  assert(
    result.fly_recommendations.some((candidate) =>
      candidate.id === "articulated_baitfish_streamer" ||
      candidate.id === "game_changer"
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

Deno.test("V3 Phase 3C gives casting spoon a true Alaska midsummer winner window", () => {
  const row = resolveSeasonalRowV3(
    "trout",
    "alaska",
    7,
    "freshwater_river",
  );
  assertEquals(row.primary_lure_archetypes, [
    "casting_spoon",
    "inline_spinner",
  ]);

  const daily: RecommenderV3DailyPayload = {
    mood_nudge: "up_2",
    water_column_nudge: "neutral",
    presentation_nudge: "bolder",
    surface_window: "watch",
    reaction_window: "on",
    finesse_window: "off",
    pace_bias: "fast",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 74,
    source_band: "Good",
  };
  const resolved = resolveFinalProfileV3(row, daily, "stained");
  const lures = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "stained",
    "low_light",
  );

  assertEquals(lures[0]?.id, "casting_spoon");
});
