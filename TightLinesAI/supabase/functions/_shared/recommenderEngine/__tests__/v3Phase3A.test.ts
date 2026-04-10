import { assert, assertEquals } from "jsr:@std/assert";
import { runRecommenderV3 } from "../runRecommenderV3.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { RecommenderV3DailyPayload } from "../v3/index.ts";
import { resolveSeasonalRowV3 } from "../v3/index.ts";
import { resolveFinalProfileV3 } from "../v3/index.ts";
import { resolveDailyPayloadV3 } from "../v3/index.ts";
import { scoreLureCandidatesV3 } from "../v3/index.ts";
import { scoreFlyCandidatesV3 } from "../v3/index.ts";

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
      latitude: 26.94,
      longitude: -80.8,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-01-15",
      local_timezone: "America/New_York",
      month: 1,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

Deno.test("V3 Phase 3A resolves the correct largemouth seasonal row", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "florida",
    1,
    "freshwater_lake_pond",
  );
  assertEquals(row.base_water_column, "bottom");
  assertEquals(row.base_mood, "negative");
  assert(row.viable_lure_archetypes.includes("football_jig"));
});

Deno.test("V3 Phase 3A keeps a winter Florida largemouth warm-up bounded to an in-range opening", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "florida",
    1,
    "freshwater_lake_pond",
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
          wind_condition: { score: -0.8 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_lake_pond",
  );
  const resolved = resolveFinalProfileV3(row, daily, "stained");

  assertEquals(resolved.final_water_column, "mid");
  assertEquals(resolved.final_mood, "active");
  // 55/45 seasonal/daily presentation blend keeps seasonal subtle when daily only reaches balanced.
  assertEquals(resolved.final_presentation_style, "subtle");
});

Deno.test("V3 Phase 3A returns 3 lure and fly recommendations with color guidance", () => {
  const result = runRecommenderV3(request({
    location: {
      latitude: 26.94,
      longitude: -80.8,
      state_code: "FL",
      region_key: "florida",
      local_date: "2026-03-15",
      local_timezone: "America/New_York",
      month: 3,
    },
  }));

  assertEquals(result.feature, "recommender_v3");
  assertEquals(result.lure_recommendations.length, 3);
  assertEquals(result.fly_recommendations.length, 3);
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

Deno.test("V3 Phase 3A avoids redundant top 3 lure outputs in a tight fall window", () => {
  const result = runRecommenderV3(request({
    location: {
      latitude: 35.5,
      longitude: -82.5,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-10-10",
      local_timezone: "America/New_York",
      month: 10,
    },
  }));

  const tacticalLanes = result.lure_recommendations.map((candidate) =>
    candidate.tactical_lane
  );
  assert(new Set(tacticalLanes).size >= 2);
});

Deno.test("V3 Phase 3A blocks tagged near-duplicate finesse stick worms from sharing the top 3", () => {
  const row = {
    species: "largemouth_bass",
    region_key: "northeast",
    month: 7,
    context: "freshwater_lake_pond",
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "subtle",
    primary_forage: "leech_worm",
    secondary_forage: "baitfish",
    primary_lure_archetypes: [
      "wacky_rigged_stick_worm",
      "weightless_stick_worm",
    ],
    viable_lure_archetypes: [
      "wacky_rigged_stick_worm",
      "weightless_stick_worm",
      "drop_shot_worm",
      "carolina_rigged_stick_worm",
      "soft_jerkbait",
    ],
    primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
    viable_fly_archetypes: [
      "woolly_bugger",
      "clouser_minnow",
      "game_changer",
      "deceiver",
    ],
  } as const;
  const resolved = resolveFinalProfileV3(row, {
    mood_nudge: "neutral",
    water_column_nudge: "neutral",
    presentation_nudge: "neutral",
    surface_window: "off",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 60,
    source_band: "Good",
  }, "clear");

  const recommendations = scoreLureCandidatesV3(
    row,
    resolved,
    {
      mood_nudge: "neutral",
      water_column_nudge: "neutral",
      presentation_nudge: "neutral",
      surface_window: "off",
      variables_considered: [],
      variables_triggered: [],
      notes: [],
      source_score: 60,
      source_band: "Good",
    },
    "clear",
    null,
  );
  const ids = recommendations.map((candidate) => candidate.id);
  const finesseStickCount =
    ids.filter((id) =>
      id === "wacky_rigged_stick_worm" || id === "weightless_stick_worm"
    ).length;

  assertEquals(recommendations.length, 3);
  assertEquals(finesseStickCount, 1);
});

Deno.test("V3 Phase 3A keeps a reaction-forward top 3 from dragging in a slow bottom lane", () => {
  const row = {
    species: "largemouth_bass",
    region_key: "south_central",
    month: 5,
    context: "freshwater_lake_pond",
    base_water_column: "shallow",
    base_mood: "active",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    primary_lure_archetypes: ["spinnerbait", "football_jig"],
    viable_lure_archetypes: [
      "spinnerbait",
      "football_jig",
      "walking_topwater",
      "paddle_tail_swimbait",
      "swim_jig",
    ],
    primary_fly_archetypes: ["clouser_minnow", "game_changer"],
    viable_fly_archetypes: [
      "clouser_minnow",
      "game_changer",
      "popper_fly",
      "woolly_bugger",
    ],
  } as const;
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
    source_score: 72,
    source_band: "Good",
  };
  const resolved = resolveFinalProfileV3(row, daily, "stained");
  const recommendations = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "stained",
    "low_light",
  );

  assertEquals(recommendations.length, 3);
  assert(
    recommendations.every((candidate) =>
      candidate.tactical_lane !== "bottom_contact"
    ),
  );
});

Deno.test("V3 Phase 3A keeps a slow finesse top 3 from dragging in a surface lane", () => {
  const row = {
    species: "largemouth_bass",
    region_key: "northeast",
    month: 10,
    context: "freshwater_lake_pond",
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "subtle",
    primary_forage: "leech_worm",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["football_jig", "walking_topwater"],
    viable_lure_archetypes: [
      "football_jig",
      "walking_topwater",
      "shaky_head_worm",
      "tube_jig",
      "spinnerbait",
    ],
    primary_fly_archetypes: ["woolly_bugger", "clouser_minnow"],
    viable_fly_archetypes: [
      "woolly_bugger",
      "clouser_minnow",
      "game_changer",
      "popper_fly",
    ],
  } as const;
  const daily: RecommenderV3DailyPayload = {
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
    source_score: 46,
    source_band: "Fair",
  };
  const resolved = resolveFinalProfileV3(row, daily, "clear");
  const recommendations = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "clear",
    "bright",
  );

  assertEquals(recommendations.length, 3);
  assert(
    recommendations.every((candidate) => candidate.tactical_lane !== "surface"),
  );
});

Deno.test("V3 Phase 3A keeps a slow anchor from promoting a hard reaction add-on just because the day trends faster", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "south_central",
    12,
    "freshwater_lake_pond",
  );
  const daily: RecommenderV3DailyPayload = {
    mood_nudge: "down_1",
    water_column_nudge: "neutral",
    presentation_nudge: "subtler",
    surface_window: "off",
    reaction_window: "watch",
    finesse_window: "off",
    pace_bias: "fast",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 64,
    source_band: "Good",
  };
  const resolved = resolveFinalProfileV3(row, daily, "clear");
  const recommendations = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "clear",
    "mixed_sky",
  );

  assertEquals(recommendations[0]?.id, "shaky_head_worm");
  assertEquals(recommendations[1]?.id, "texas_rigged_soft_plastic_craw");
  assertEquals(recommendations[2]?.id, "football_jig");
  assert(
    recommendations.every((candidate) =>
      candidate.id !== "flat_sided_crankbait"
    ),
  );
});

Deno.test("V3 Phase 3A allows a surface plan to keep a close bottom fallback when the window is real", () => {
  const row = {
    species: "largemouth_bass",
    region_key: "southeast_atlantic",
    month: 8,
    context: "freshwater_lake_pond",
    base_water_column: "mid",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    primary_lure_archetypes: ["walking_topwater", "football_jig"],
    viable_lure_archetypes: [
      "walking_topwater",
      "football_jig",
      "soft_jerkbait",
      "spinnerbait",
    ],
    primary_fly_archetypes: ["popper_fly", "clouser_minnow"],
    viable_fly_archetypes: [
      "popper_fly",
      "clouser_minnow",
      "woolly_bugger",
      "game_changer",
    ],
  } as const;
  const daily: RecommenderV3DailyPayload = {
    mood_nudge: "neutral",
    water_column_nudge: "neutral",
    presentation_nudge: "neutral",
    surface_window: "on",
    reaction_window: "watch",
    finesse_window: "watch",
    pace_bias: "neutral",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 71,
    source_band: "Good",
  };
  const resolved = resolveFinalProfileV3(row, daily, "stained");
  const recommendations = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "stained",
    "low_light",
  );

  assertEquals(recommendations.length, 3);
  assert(
    recommendations.some((candidate) => candidate.tactical_lane === "surface"),
  );
  assert(
    recommendations.some((candidate) =>
      candidate.tactical_lane === "bottom_contact"
    ),
  );
});

Deno.test("V3 Phase 3A resolves a real surface window from shoulder timing and low light", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 70, band: "Good" },
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

  assertEquals(daily.surface_window, "on");
});

Deno.test("V3 Phase 3A caps or shuts off river surface windows when wind is too strong", () => {
  const strongWind = resolveDailyPayloadV3(
    analysis({
      scored: { score: 70, band: "Good" },
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
          wind_condition: { label: "strong", score: -0.8 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );
  const extremeWind = resolveDailyPayloadV3(
    analysis({
      scored: { score: 70, band: "Good" },
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
          wind_condition: { label: "extreme", score: -1.0 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_river",
  );

  assertEquals(strongWind.surface_window, "watch");
  assertEquals(extremeWind.surface_window, "off");
});

Deno.test("V3 Phase 3A gives largemouth specialty winners explicit narrow primary windows", () => {
  const floridaBuzz = resolveSeasonalRowV3(
    "largemouth_bass",
    "florida",
    7,
    "freshwater_lake_pond",
  );
  const floridaProp = resolveSeasonalRowV3(
    "largemouth_bass",
    "florida",
    8,
    "freshwater_lake_pond",
  );
  const gulfLipless = resolveSeasonalRowV3(
    "largemouth_bass",
    "gulf_coast",
    3,
    "freshwater_lake_pond",
  );

  assertEquals(floridaBuzz.primary_lure_archetypes, [
    "buzzbait",
    "hollow_body_frog",
  ]);
  assertEquals(floridaProp.primary_lure_archetypes, [
    "prop_bait",
    "hollow_body_frog",
  ]);
  assertEquals(gulfLipless.primary_lure_archetypes, [
    "lipless_crankbait",
    "spinnerbait",
  ]);
});

Deno.test("V3 Phase 3A gives pressured largemouth finesse winners real seasonal windows", () => {
  const shakyRow = resolveSeasonalRowV3(
    "largemouth_bass",
    "south_central",
    12,
    "freshwater_lake_pond",
  );
  const dropShotRow = resolveSeasonalRowV3(
    "largemouth_bass",
    "great_lakes_upper_midwest",
    8,
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

  assertEquals(shakyRow.primary_lure_archetypes, [
    "shaky_head_worm",
    "football_jig",
  ]);
  assertEquals(dropShotRow.primary_lure_archetypes, [
    "drop_shot_worm",
    "wacky_rigged_stick_worm",
  ]);

  const shakyResolved = resolveFinalProfileV3(shakyRow, toughDaily, "clear");
  const shakyRecommendations = scoreLureCandidatesV3(
    shakyRow,
    shakyResolved,
    toughDaily,
    "clear",
    "bright",
  );
  const dropShotResolved = resolveFinalProfileV3(
    dropShotRow,
    toughDaily,
    "clear",
  );
  const dropShotRecommendations = scoreLureCandidatesV3(
    dropShotRow,
    dropShotResolved,
    toughDaily,
    "clear",
    "bright",
  );

  assertEquals(shakyRecommendations[0]?.id, "shaky_head_worm");
  assertEquals(dropShotRecommendations[0]?.id, "drop_shot_worm");
});

Deno.test("V3 Phase 3A gives flat-sided crankbait and deceiver true narrow largemouth winner windows", () => {
  const flatSideRow = resolveSeasonalRowV3(
    "largemouth_bass",
    "great_lakes_upper_midwest",
    3,
    "freshwater_lake_pond",
  );
  const deceiverRow = resolveSeasonalRowV3(
    "largemouth_bass",
    "south_central",
    10,
    "freshwater_river",
  );
  const flatDaily: RecommenderV3DailyPayload = {
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
    source_score: 58,
    source_band: "Fair",
  };
  const deceiverDaily: RecommenderV3DailyPayload = {
    mood_nudge: "up_1",
    water_column_nudge: "neutral",
    presentation_nudge: "neutral",
    surface_window: "off",
    reaction_window: "on",
    finesse_window: "off",
    pace_bias: "fast",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
    source_score: 65,
    source_band: "Good",
  };

  assertEquals(flatSideRow.primary_lure_archetypes, [
    "flat_sided_crankbait",
    "suspending_jerkbait",
  ]);
  assertEquals(flatSideRow.primary_forage, "crawfish");
  assertEquals(deceiverRow.primary_fly_archetypes, [
    "deceiver",
    "game_changer",
  ]);

  const flatResolved = resolveFinalProfileV3(flatSideRow, flatDaily, "clear");
  const flatRecommendations = scoreLureCandidatesV3(
    flatSideRow,
    flatResolved,
    flatDaily,
    "clear",
    "mixed_sky",
  );
  const deceiverResolved = resolveFinalProfileV3(
    deceiverRow,
    deceiverDaily,
    "clear",
  );
  const deceiverRecommendations = scoreFlyCandidatesV3(
    deceiverRow,
    deceiverResolved,
    deceiverDaily,
    "clear",
    "mixed_sky",
  );

  assertEquals(flatRecommendations[0]?.id, "flat_sided_crankbait");
  assertEquals(deceiverResolved.final_mood, "active");
  assertEquals(deceiverRecommendations[0]?.id, "deceiver");
});

Deno.test("V3 Phase 3A resolves a reaction-forward daily posture on a productive low-light chop day", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 74, band: "Good" },
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
          pressure_regime: { label: "falling_slow", score: 0.8 },
          wind_condition: { label: "moderate", score: 0.7 },
          light_cloud_condition: { label: "low_light" },
        },
      },
    }),
    "freshwater_lake_pond",
  );

  assertEquals(daily.reaction_window, "on");
  assertEquals(daily.finesse_window, "off");
  assertEquals(daily.pace_bias, "fast");
});

Deno.test("V3 Phase 3A resolves a finesse-forward daily posture on a bright post-front calm day", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 48, band: "Fair" },
      timing: {
        timing_strength: "fair",
        highlighted_periods: [false, false, false, false],
      },
      condition_context: {
        temperature_metabolic_context: "cold_limited",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "rising_fast", score: -0.8 },
          wind_condition: { label: "calm", score: 0.7 },
          light_cloud_condition: { label: "bright" },
        },
      },
    }),
    "freshwater_river",
  );

  assertEquals(daily.reaction_window, "off");
  assertEquals(daily.finesse_window, "on");
  assertEquals(daily.pace_bias, "slow");
});

Deno.test("V3 Phase 3A gives texas-rigged stick worm a true shallow-cover winner window", () => {
  const row = resolveSeasonalRowV3(
    "largemouth_bass",
    "florida",
    5,
    "freshwater_lake_pond",
  );
  assertEquals(row.primary_lure_archetypes, [
    "texas_rigged_stick_worm",
    "compact_flipping_jig",
  ]);

  const daily: RecommenderV3DailyPayload = {
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
  const resolved = resolveFinalProfileV3(row, daily, "stained");
  const lures = scoreLureCandidatesV3(
    row,
    resolved,
    daily,
    "stained",
    "bright",
  );

  assertEquals(lures[0]?.id, "texas_rigged_stick_worm");
});
