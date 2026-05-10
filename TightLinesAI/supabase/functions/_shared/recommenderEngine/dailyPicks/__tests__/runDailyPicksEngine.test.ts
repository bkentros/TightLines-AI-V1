import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "jsr:@std/assert";
import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import type { SeasonalRowV4 } from "../../v4/contracts.ts";
import { runDailyPicksEngine } from "../runDailyPicksEngine.ts";

function baseReq(
  overrides: Partial<RecommenderRequest> = {},
): RecommenderRequest {
  return {
    location: {
      latitude: 44.9,
      longitude: -93.2,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-06-15",
      local_timezone: "UTC",
      month: 6,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    env_data: {
      wind_speed_mph: 8,
    },
    ...overrides,
  };
}

function baseRow(overrides: Partial<SeasonalRowV4> = {}): SeasonalRowV4 {
  return {
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_lake_pond",
    column_range: ["bottom", "mid", "upper", "surface"],
    column_baseline: "mid",
    pace_range: ["slow", "medium", "fast"],
    pace_baseline: "medium",
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    surface_seasonally_possible: true,
    primary_lure_ids: [
      "spinnerbait",
      "bladed_jig",
      "paddle_tail_swimbait",
      "buzzbait",
      "walking_topwater",
    ],
    primary_fly_ids: [
      "clouser_minnow",
      "deceiver",
      "articulated_baitfish_streamer",
      "popper_fly",
      "foam_gurgler_fly",
    ],
    ...overrides,
  };
}

function analysis(
  overrides: {
    score?: number;
    reliability?: "high" | "medium" | "low";
    lightLabel?: string | null;
    temperatureBand?: string | null;
    temperatureTrend?: string | null;
    temperatureShock?: string | null;
  } = {},
): SharedConditionAnalysis {
  const normalized: Record<string, unknown> = {};
  if (overrides.lightLabel !== undefined) {
    normalized.light_cloud_condition = overrides.lightLabel == null
      ? undefined
      : { label: overrides.lightLabel, score: 0 };
  } else {
    normalized.light_cloud_condition = { label: "mixed", score: 0 };
  }
  if (
    overrides.temperatureBand !== null ||
    overrides.temperatureTrend !== null ||
    overrides.temperatureShock !== null
  ) {
    normalized.temperature = {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 68,
      band_label: overrides.temperatureBand ?? "optimal",
      band_score: 1,
      trend_label: overrides.temperatureTrend ?? "stable",
      trend_adjustment: 0,
      shock_label: overrides.temperatureShock ?? "none",
      shock_adjustment: 0,
      final_score: 1,
    };
  }

  return {
    norm: {
      location: {
        latitude: 44.9,
        longitude: -93.2,
        state_code: "MN",
        region_key: "great_lakes_upper_midwest",
        local_date: "2026-06-15",
        local_timezone: "UTC",
      },
      context: "freshwater_lake_pond",
      normalized,
      available_variables: [],
      missing_variables: [],
      data_gaps: [],
      reliability: overrides.reliability ?? "high",
    },
    scored: { score: overrides.score ?? 72 },
    timing: {},
    condition_context: {},
  } as unknown as SharedConditionAnalysis;
}

function run(overrides: {
  req?: RecommenderRequest;
  row?: SeasonalRowV4;
  seed?: string;
  variant?: "A" | "B";
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
  analysis?: SharedConditionAnalysis;
} = {}) {
  return runDailyPicksEngine({
    req: overrides.req ?? baseReq(),
    analysis: overrides.analysis ?? analysis(),
    seasonalRow: overrides.row ?? baseRow(),
    seed: overrides.seed ?? "daily-picks-engine-test",
    variant: overrides.variant ?? "A",
    avoidLureIds: overrides.avoidLureIds,
    avoidFlyIds: overrides.avoidFlyIds,
  });
}

function selectedIds(result: ReturnType<typeof runDailyPicksEngine>): string[] {
  return [
    result.selection.lure_of_the_day.profile.id,
    result.selection.honorable_lure.profile.id,
    result.selection.fly_of_the_day.profile.id,
    result.selection.honorable_fly.profile.id,
  ];
}

Deno.test("DailyPicks engine returns exactly two lures and two flies", () => {
  const result = run();

  assertEquals(result.diagnostics.selected_lure_ids.length, 2);
  assertEquals(result.diagnostics.selected_fly_ids.length, 2);
  assertEquals(
    new Set(result.diagnostics.selected_lure_ids).size,
    2,
  );
  assertEquals(
    new Set(result.diagnostics.selected_fly_ids).size,
    2,
  );
});

Deno.test("DailyPicks engine selects IDs only from the hard-gated candidate pool", () => {
  const result = run();
  const poolIds = new Set<string>([
    ...result.candidate_pool.lures.map((candidate) => candidate.profile.id),
    ...result.candidate_pool.flies.map((candidate) => candidate.profile.id),
  ]);

  for (const id of selectedIds(result)) assert(poolIds.has(id));
});

Deno.test("DailyPicks engine does not select surface candidates when daily surface is closed", () => {
  const result = run({
    req: baseReq({ env_data: { wind_speed_mph: 20 } }),
    analysis: analysis({ score: 80, lightLabel: "low_light" }),
  });

  assertEquals(result.scenario.surface_daily_gate, "closed");
  assert(
    result.candidate_pool.lures.every((candidate) =>
      !candidate.profile.is_surface
    ),
  );
  assert(
    result.candidate_pool.flies.every((candidate) =>
      !candidate.profile.is_surface
    ),
  );
  assert(!result.selection.lure_of_the_day.profile.is_surface);
  assert(!result.selection.honorable_lure.profile.is_surface);
  assert(!result.selection.fly_of_the_day.profile.is_surface);
  assert(!result.selection.honorable_fly.profile.is_surface);
});

Deno.test("DailyPicks engine variant A is deterministic for same seed, date, and goal", () => {
  assertEquals(
    selectedIds(run({ seed: "stable-seed", variant: "A" })),
    selectedIds(run({ seed: "stable-seed", variant: "A" })),
  );
});

Deno.test("DailyPicks engine variant B with avoid IDs differs when alternatives exist", () => {
  const first = run({ seed: "variant-seed", variant: "A" });
  const second = run({
    seed: "variant-seed",
    variant: "B",
    avoidLureIds: first.diagnostics.selected_lure_ids,
    avoidFlyIds: first.diagnostics.selected_fly_ids,
  });

  assertNotEquals(
    second.diagnostics.selected_lure_ids,
    first.diagnostics.selected_lure_ids,
  );
  assertNotEquals(
    second.diagnostics.selected_fly_ids,
    first.diagnostics.selected_fly_ids,
  );
  assert(
    !first.diagnostics.selected_lure_ids.includes(
      second.selection.lure_of_the_day.profile.id,
    ),
  );
  assert(
    !first.diagnostics.selected_fly_ids.includes(
      second.selection.fly_of_the_day.profile.id,
    ),
  );
});

Deno.test("DailyPicks engine throws explicit errors for insufficient candidates", () => {
  assertThrows(
    () =>
      run({
        row: baseRow({
          primary_lure_ids: ["spinnerbait"],
          primary_fly_ids: ["clouser_minnow", "deceiver"],
        }),
      }),
    Error,
    "daily picks insufficient candidates for lure",
  );
  assertThrows(
    () =>
      run({
        row: baseRow({
          primary_lure_ids: ["spinnerbait", "bladed_jig"],
          primary_fly_ids: ["clouser_minnow"],
        }),
      }),
    Error,
    "daily picks insufficient candidates for fly",
  );
});

Deno.test("DailyPicks engine diagnostics include counts, IDs, variant, scenario state, and avoid IDs", () => {
  const result = run({
    req: baseReq({ env_data: {} }),
    variant: "B",
    avoidLureIds: ["spinnerbait"],
    avoidFlyIds: ["clouser_minnow"],
    analysis: analysis({ score: 80, reliability: "high" }),
  });

  assertEquals(result.diagnostics.row_authored_lure_count, 5);
  assertEquals(result.diagnostics.row_authored_fly_count, 5);
  assertEquals(
    result.diagnostics.hard_gated_lure_candidate_count,
    result.candidate_pool.lures.length,
  );
  assertEquals(
    result.diagnostics.hard_gated_fly_candidate_count,
    result.candidate_pool.flies.length,
  );
  assertEquals(result.diagnostics.selected_lure_ids.length, 2);
  assertEquals(result.diagnostics.selected_fly_ids.length, 2);
  assertEquals(result.diagnostics.variant, "B");
  assertEquals(result.diagnostics.avoid_lure_ids_applied, ["spinnerbait"]);
  assertEquals(result.diagnostics.avoid_fly_ids_applied, ["clouser_minnow"]);
  assertEquals(result.diagnostics.scenario_tags, result.scenario.scenario_tags);
  assertEquals(result.diagnostics.surface_daily_gate, "closed");
  assert(result.diagnostics.missing_inputs.includes("wind"));
  assertEquals(result.diagnostics.confidence, "medium");
  assertEquals(
    result.diagnostics.family_diversity.lures.top_family_group,
    result.selection.lure_of_the_day.profile.family_group,
  );
  assertEquals(
    result.diagnostics.family_diversity.lures.honorable_family_group,
    result.selection.honorable_lure.profile.family_group,
  );
  assertEquals(
    result.diagnostics.family_diversity.flies.top_family_group,
    result.selection.fly_of_the_day.profile.family_group,
  );
  assertEquals(
    result.diagnostics.family_diversity.flies.honorable_family_group,
    result.selection.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPicks engine selected top and honorable families differ when in-band alternatives exist", () => {
  const result = run();

  for (
    const side of [
      result.diagnostics.family_diversity.lures,
      result.diagnostics.family_diversity.flies,
    ]
  ) {
    if (side.different_family_available_in_band) {
      assert(side.different_family_selected);
    }
  }
});

Deno.test("DailyPicks engine keeps row/scenario mismatch protection active", () => {
  assertThrows(
    () =>
      run({
        req: baseReq({
          location: {
            ...baseReq().location,
            month: 7,
          },
        }),
      }),
    Error,
    "daily picks row/scenario mismatch: month",
  );
});

Deno.test("DailyPicks engine preserves selected profile column, pace, and surface fields", () => {
  const result = run();
  for (
    const score of [
      result.selection.lure_of_the_day,
      result.selection.honorable_lure,
      result.selection.fly_of_the_day,
      result.selection.honorable_fly,
    ]
  ) {
    const poolProfile = [
      ...result.candidate_pool.lures,
      ...result.candidate_pool.flies,
    ].find((candidate) => candidate.profile.id === score.profile.id)?.profile;

    assert(poolProfile != null);
    assertEquals(score.profile.column, poolProfile.column);
    assertEquals(score.profile.primary_pace, poolProfile.primary_pace);
    assertEquals(score.profile.secondary_pace, poolProfile.secondary_pace);
    assertEquals(score.profile.is_surface, poolProfile.is_surface);
  }
});

Deno.test("DailyPicks engine does not import or call current 3:3 runtime paths", async () => {
  const text = await Deno.readTextFile(
    "supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts",
  );
  assert(!text.includes("../rebuild/"));
  assert(!text.includes("runRecommenderRebuild"));
  assert(!text.includes("runRecommenderRebuildSurface"));
  assert(!text.includes("selectArchetypesForSide"));
});
