import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import type { ArchetypeProfileV4, SeasonalRowV4 } from "../../v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";
import type { DailyScenario } from "../buildDailyScenario.ts";
import type { CandidateScore } from "../scoreCandidate.ts";
import type { DailyPicksEngineResult } from "../runDailyPicksEngine.ts";
import {
  DAILY_PICKS_RESPONSE_FEATURE,
  shapeDailyPicksResponse,
} from "../shapeDailyPicksResponse.ts";

function profile(id: string): ArchetypeProfileV4 {
  const found = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4].find(
    (candidate) => candidate.id === id,
  );
  if (found == null) throw new Error(`missing test profile ${id}`);
  return found;
}

function score(
  id: string,
  side: "lure" | "fly",
  reasons: readonly string[] = [
    "base:+100",
    "goal:all_purpose:versatile_search:+12",
    "condition_tag:wind_reaction:+16",
    "primary_forage:baitfish:+12",
    "clarity_strength:stained:+8",
  ],
): CandidateScore {
  return {
    profile: profile(id),
    side,
    score: 148,
    reasons: [...reasons],
  };
}

function scenario(overrides: Partial<DailyScenario> = {}): DailyScenario {
  return {
    local_date: "2026-06-15",
    local_timezone: "UTC",
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    hows_score: 74,
    activity_level: "active",
    surface_daily_gate: "caution",
    surface_daily_reason_codes: [
      "seasonal_surface_open",
      "surface_caution_mixed_daily_conditions",
    ],
    light_mode: "mixed",
    wind_mode: "breezy",
    daylight_wind_mph: 8,
    thermal_mode: "stable",
    water_movement_mode: "not_applicable",
    pressure_mode: "stable",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    missing_inputs: [],
    confidence: "high",
    ...overrides,
  };
}

function row(): SeasonalRowV4 {
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
      "buzzbait",
      "spinnerbait",
      "paddle_tail_swimbait",
      "swim_jig",
    ],
    primary_fly_ids: [
      "clouser_minnow",
      "deceiver",
      "articulated_baitfish_streamer",
      "foam_gurgler_fly",
    ],
  };
}

function result(
  overrides: {
    scenario?: DailyScenario;
    variant?: "A" | "B";
    lureOfDay?: CandidateScore;
    honorableLure?: CandidateScore;
    flyOfDay?: CandidateScore;
    honorableFly?: CandidateScore;
  } = {},
): DailyPicksEngineResult {
  const sc = overrides.scenario ?? scenario();
  const lureOfDay = overrides.lureOfDay ?? score("buzzbait", "lure", [
    "base:+100",
    "goal:big_fish:big_fish_upside:+20",
    "condition_tag:wind_reaction:+16",
    "condition_tag:cover_ambush:+16",
    "primary_forage:baitfish:+12",
    "clarity_strength:stained:+8",
    "surface_daily_gate:caution:-24",
  ]);
  const honorableLure = overrides.honorableLure ??
    score("spinnerbait", "lure");
  const flyOfDay = overrides.flyOfDay ?? score("clouser_minnow", "fly");
  const honorableFly = overrides.honorableFly ?? score("deceiver", "fly");
  const lureScores = [lureOfDay, honorableLure];
  const flyScores = [flyOfDay, honorableFly];
  const familyDiversity = {
    lures: {
      top_family_group: lureOfDay.profile.family_group,
      honorable_family_group: honorableLure.profile.family_group,
      different_family_selected: lureOfDay.profile.family_group !==
        honorableLure.profile.family_group,
      different_family_available_in_band: lureOfDay.profile.family_group !==
        honorableLure.profile.family_group,
    },
    flies: {
      top_family_group: flyOfDay.profile.family_group,
      honorable_family_group: honorableFly.profile.family_group,
      different_family_selected: flyOfDay.profile.family_group !==
        honorableFly.profile.family_group,
      different_family_available_in_band: flyOfDay.profile.family_group !==
        honorableFly.profile.family_group,
    },
  };

  return {
    row: row(),
    scenario: sc,
    candidate_pool: {
      lures: lureScores.map((candidate) => ({
        side: "lure" as const,
        profile: candidate.profile,
      })),
      flies: flyScores.map((candidate) => ({
        side: "fly" as const,
        profile: candidate.profile,
      })),
    },
    lure_scores: lureScores,
    fly_scores: flyScores,
    selection: {
      lure_of_the_day: lureOfDay,
      honorable_lure: honorableLure,
      fly_of_the_day: flyOfDay,
      honorable_fly: honorableFly,
    },
    diagnostics: {
      row_authored_lure_count: 4,
      row_authored_fly_count: 4,
      hard_gated_lure_candidate_count: 2,
      hard_gated_fly_candidate_count: 2,
      selected_lure_ids: [lureOfDay.profile.id, honorableLure.profile.id],
      selected_fly_ids: [flyOfDay.profile.id, honorableFly.profile.id],
      variant: overrides.variant ?? "A",
      avoid_lure_ids_applied: [],
      avoid_fly_ids_applied: [],
      scenario_tags: sc.scenario_tags,
      surface_daily_gate: sc.surface_daily_gate,
      missing_inputs: sc.missing_inputs,
      confidence: sc.confidence,
      family_diversity: familyDiversity,
      finalist_pools: [],
    },
  };
}

Deno.test("DailyPicks response shaper returns exactly four slots", () => {
  const response = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  });

  assertEquals(response.feature, DAILY_PICKS_RESPONSE_FEATURE);
  assertEquals(Object.keys(response.picks).sort(), [
    "fly_of_the_day",
    "honorable_fly",
    "honorable_lure",
    "lure_of_the_day",
  ]);
});

Deno.test("DailyPicks response preserves selected profile identity and intrinsic fields", () => {
  const response = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  });
  const pick = response.picks.lure_of_the_day;
  const source = profile("buzzbait");

  assertEquals(pick.id, source.id);
  assertEquals(pick.display_name, source.display_name);
  assertEquals(pick.column, source.column);
  assertEquals(pick.primary_pace, source.primary_pace);
  assertEquals(pick.secondary_pace, source.secondary_pace);
  assertEquals(pick.is_surface, source.is_surface);
});

Deno.test("DailyPicks response keeps buzzbait surface fast/medium rather than rewriting it slow", () => {
  const pick = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  }).picks.lure_of_the_day;

  assertEquals(pick.id, "buzzbait");
  assertEquals(pick.column, "surface");
  assertEquals(pick.primary_pace, "fast");
  assertEquals(pick.secondary_pace, "medium");
});

Deno.test("DailyPicks why_chosen uses real reasons and does not invent unavailable tags", () => {
  const pick = shapeDailyPicksResponse({
    result: result({
      scenario: scenario({ recommendation_goal: "big_fish" }),
    }),
    seed: "shape-test",
  }).picks.lure_of_the_day;

  assert(pick.why_chosen.includes("big-fish goal"));
  assert(pick.why_chosen.includes("wind reaction"));
  assert(!pick.why_chosen.includes("cover ambush"));
  assert(!pick.why_chosen.includes("calm surface"));
});

Deno.test("DailyPicks all-purpose why_chosen ignores stale big-fish score reasons", () => {
  const pick = shapeDailyPicksResponse({
    result: result({
      scenario: scenario({ recommendation_goal: "all_purpose" }),
      lureOfDay: score("buzzbait", "lure", [
        "base:+100",
        "goal:big_fish:big_fish_upside:+20",
        "condition_tag:wind_reaction:+16",
        "primary_forage:baitfish:+12",
      ]),
    }),
    seed: "goal-copy",
  }).picks.lure_of_the_day;

  assert(!pick.why_chosen.includes("big-fish goal"));
  assert(!pick.why_chosen.includes("all-purpose goal"));
  assert(pick.why_chosen.includes("wind reaction"));
});

Deno.test("DailyPicks big-fish why_chosen ignores stale all-purpose score reasons", () => {
  const pick = shapeDailyPicksResponse({
    result: result({
      scenario: scenario({ recommendation_goal: "big_fish" }),
      lureOfDay: score("spinnerbait", "lure", [
        "base:+100",
        "goal:all_purpose:versatile_search:+12",
        "condition_tag:wind_reaction:+16",
        "primary_forage:baitfish:+12",
      ]),
    }),
    seed: "goal-copy",
  }).picks.lure_of_the_day;

  assert(!pick.why_chosen.includes("all-purpose goal"));
  assert(!pick.why_chosen.includes("big-fish goal"));
  assert(pick.why_chosen.includes("wind reaction"));
});

Deno.test("DailyPicks how_to_fish comes from selected profile variants", () => {
  const response = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  });
  const source = profile(response.picks.lure_of_the_day.id);

  assert(
    source.how_to_fish_variants.includes(
      response.picks.lure_of_the_day.how_to_fish,
    ),
  );
});

Deno.test("DailyPicks how_to_fish is deterministic for same seed/date/variant/id", () => {
  const first = shapeDailyPicksResponse({
    result: result(),
    seed: "stable-copy",
  });
  const second = shapeDailyPicksResponse({
    result: result(),
    seed: "stable-copy",
  });

  assertEquals(
    first.picks.lure_of_the_day.how_to_fish,
    second.picks.lure_of_the_day.how_to_fish,
  );
});

Deno.test("DailyPicks how_to_fish can vary by slot or date when variants exist", () => {
  const sameProfileResult = result({
    honorableLure: score("buzzbait", "lure", [
      "base:+100",
      "goal:big_fish:big_fish_upside:+20",
    ]),
  });
  const bySlot = shapeDailyPicksResponse({
    result: sameProfileResult,
    seed: "copy-variety",
  });
  const byDate = Array.from({ length: 14 }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return shapeDailyPicksResponse({
      result: result({
        scenario: scenario({ local_date: `2026-06-${day}` }),
      }),
      seed: "copy-variety",
    }).picks.lure_of_the_day.how_to_fish;
  });

  assert(
    new Set([
      bySlot.picks.lure_of_the_day.how_to_fish,
      bySlot.picks.honorable_lure.how_to_fish,
      ...byDate,
    ]).size > 1,
  );
});

Deno.test("DailyPicks how_to_fish uses diagnostics variant as the only variant source", () => {
  const variantsSeen = new Set<string>();

  for (let index = 0; index < 40; index++) {
    const seed = `diagnostics-variant-${index}`;
    const variantA = shapeDailyPicksResponse({
      result: result({ variant: "A" }),
      seed,
    }).picks.lure_of_the_day.how_to_fish;
    const variantB = shapeDailyPicksResponse({
      result: result({ variant: "B" }),
      seed,
    }).picks.lure_of_the_day.how_to_fish;

    variantsSeen.add(`${variantA}|${variantB}`);
    if (variantA !== variantB) {
      assertNotEquals(variantA, variantB);
      return;
    }
  }

  throw new Error(
    `expected diagnostics variant to affect how_to_fish, saw ${variantsSeen.size} variant pairs`,
  );
});

Deno.test("DailyPicks low-confidence missing-input scenario avoids overconfident copy", () => {
  const response = shapeDailyPicksResponse({
    result: result({
      scenario: scenario({
        missing_inputs: ["wind"],
        confidence: "low",
        scenario_tags: [],
      }),
    }),
    seed: "low-confidence",
  });
  const why = response.picks.lure_of_the_day.why_chosen;

  assert(why.includes("low confidence"));
  assert(why.includes("wind is missing"));
  assert(!why.includes("high confidence"));
  assert(!why.includes("certain"));
});

Deno.test("DailyPicks response includes diagnostics and scenario summary", () => {
  const response = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  });

  assertEquals(response.diagnostics.selected_lure_ids, [
    "buzzbait",
    "spinnerbait",
  ]);
  assertEquals(response.diagnostics.selected_fly_ids, [
    "clouser_minnow",
    "deceiver",
  ]);
  assertEquals(response.scenario_summary.surface_daily_gate, "caution");
  assertEquals(response.scenario_summary.confidence, "high");
  assertEquals(response.scenario_summary.scenario_tags, [
    "wind_reaction",
    "dirty_vibration",
  ]);
});

Deno.test("DailyPicks response diagnostics preserve family-diversity fields", () => {
  const response = shapeDailyPicksResponse({
    result: result(),
    seed: "shape-test",
  });

  assertEquals(
    response.diagnostics.family_diversity.lures.top_family_group,
    profile("buzzbait").family_group,
  );
  assertEquals(
    response.diagnostics.family_diversity.lures.honorable_family_group,
    profile("spinnerbait").family_group,
  );
  assertEquals(
    response.diagnostics.family_diversity.flies.top_family_group,
    profile("clouser_minnow").family_group,
  );
  assertEquals(
    response.diagnostics.family_diversity.flies.honorable_family_group,
    profile("deceiver").family_group,
  );
});

Deno.test("DailyPicks response shaper does not import or call current 3:3 runtime paths", async () => {
  const text = await Deno.readTextFile(
    "supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts",
  );
  assert(!text.includes("../rebuild/"));
  assert(!text.includes("runRecommenderRebuild"));
  assert(!text.includes("runRecommenderRebuildSurface"));
  assert(!text.includes("selectArchetypesForSide"));
});
