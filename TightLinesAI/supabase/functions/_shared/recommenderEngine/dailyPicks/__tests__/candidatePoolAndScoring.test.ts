import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  buildCandidatePool,
  type DailyPickCandidatePool,
} from "../buildCandidatePool.ts";
import { scoreCandidate } from "../scoreCandidate.ts";
import type { DailyScenario } from "../buildDailyScenario.ts";
import type {
  ArchetypeProfileV4,
  GoalTag,
  SeasonalRowV4,
} from "../../v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";

function lure(id: string): ArchetypeProfileV4 {
  const profile = LURE_ARCHETYPES_V4.find((candidate) => candidate.id === id);
  if (profile == null) throw new Error(`missing test lure ${id}`);
  return profile;
}

function ids(candidates: DailyPickCandidatePool["lures"]): string[] {
  return candidates.map((candidate) => candidate.profile.id);
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
    primary_lure_ids: ["spinnerbait", "buzzbait", "walking_topwater"],
    primary_fly_ids: ["clouser_minnow"],
    ...overrides,
  };
}

function baseScenario(overrides: Partial<DailyScenario> = {}): DailyScenario {
  return {
    local_date: "2026-06-15",
    local_timezone: "UTC",
    species: "largemouth_bass",
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    hows_score: 72,
    activity_level: "active",
    surface_daily_gate: "open",
    surface_daily_reason_codes: ["seasonal_surface_open"],
    light_mode: "mixed",
    wind_mode: "breezy",
    daylight_wind_mph: 8,
    thermal_mode: "stable",
    water_movement_mode: "not_applicable",
    pressure_mode: "stable",
    scenario_tags: ["wind_reaction", "open_water_search"],
    missing_inputs: [],
    confidence: "high",
    ...overrides,
  };
}

function scoreFor(args: {
  profile: ArchetypeProfileV4;
  row?: SeasonalRowV4;
  scenario?: DailyScenario;
}) {
  return scoreCandidate({
    profile: args.profile,
    side: "lure",
    row: args.row ?? baseRow(),
    scenario: args.scenario ?? baseScenario(),
  });
}

function cloneWithGoalTags(
  profile: ArchetypeProfileV4,
  goalTags: readonly GoalTag[],
): ArchetypeProfileV4 {
  return {
    ...profile,
    goal_tags: goalTags,
  };
}

Deno.test("DailyPick candidate pool includes only row-authored IDs", () => {
  const pool = buildCandidatePool({
    row: baseRow({
      primary_lure_ids: ["spinnerbait", "buzzbait"],
      primary_fly_ids: [],
    }),
    scenario: baseScenario(),
  });

  assertEquals(ids(pool.lures).sort(), ["buzzbait", "spinnerbait"]);
  assertEquals(pool.flies, []);
});

Deno.test("DailyPick candidate pool removes row-excluded IDs", () => {
  const pool = buildCandidatePool({
    row: baseRow({
      primary_lure_ids: ["spinnerbait", "buzzbait"],
      excluded_lure_ids: ["spinnerbait"],
      primary_fly_ids: [],
    }),
    scenario: baseScenario(),
  });

  assertEquals(ids(pool.lures), ["buzzbait"]);
});

Deno.test("DailyPick candidate pool removes catalog species and water mismatches", () => {
  const pool = buildCandidatePool({
    row: baseRow({
      water_type: "freshwater_river",
      primary_lure_ids: [
        "weightless_stick_worm",
        "large_profile_pike_swimbait",
        "carolina_rigged_stick_worm",
      ],
      primary_fly_ids: [],
    }),
    scenario: baseScenario({ water_type: "freshwater_river" }),
  });

  assertEquals(ids(pool.lures), ["weightless_stick_worm"]);
});

Deno.test("DailyPick candidate pool throws when row species does not match scenario", () => {
  assertThrows(
    () =>
      buildCandidatePool({
        row: baseRow({ species: "smallmouth_bass" }),
        scenario: baseScenario(),
      }),
    Error,
    "daily picks row/scenario mismatch: species",
  );
});

Deno.test("DailyPick candidate pool throws when row region does not match scenario", () => {
  assertThrows(
    () =>
      buildCandidatePool({
        row: baseRow({ region_key: "florida" }),
        scenario: baseScenario(),
      }),
    Error,
    "daily picks row/scenario mismatch: region_key",
  );
});

Deno.test("DailyPick candidate pool throws when row month does not match scenario", () => {
  assertThrows(
    () =>
      buildCandidatePool({
        row: baseRow({ month: 7 }),
        scenario: baseScenario(),
      }),
    Error,
    "daily picks row/scenario mismatch: month",
  );
});

Deno.test("DailyPick candidate pool throws when row water type does not match scenario", () => {
  assertThrows(
    () =>
      buildCandidatePool({
        row: baseRow({ water_type: "freshwater_river" }),
        scenario: baseScenario(),
      }),
    Error,
    "daily picks row/scenario mismatch: water_type",
  );
});

Deno.test("DailyPick candidate pool removes surface candidates when DailyScenario surface is closed", () => {
  const pool = buildCandidatePool({
    row: baseRow({
      primary_lure_ids: ["spinnerbait", "buzzbait", "walking_topwater"],
      primary_fly_ids: [],
    }),
    scenario: baseScenario({ surface_daily_gate: "closed" }),
  });

  assertEquals(ids(pool.lures), ["spinnerbait"]);
});

Deno.test("DailyPick candidate pool keeps surface candidates when seasonal and daily surface gates are open", () => {
  const pool = buildCandidatePool({
    row: baseRow({
      primary_lure_ids: ["spinnerbait", "buzzbait"],
      primary_fly_ids: [],
    }),
    scenario: baseScenario({ surface_daily_gate: "open" }),
  });

  assertEquals(ids(pool.lures).sort(), ["buzzbait", "spinnerbait"]);
});

Deno.test("DailyPick candidate pool does not hard-gate clarity mismatch, but scoring skips clarity bonus", () => {
  const row = baseRow({
    primary_lure_ids: ["drop_shot_worm"],
    primary_fly_ids: [],
  });
  const dirtyPool = buildCandidatePool({
    row,
    scenario: baseScenario({ water_clarity: "dirty" }),
  });
  assertEquals(ids(dirtyPool.lures), ["drop_shot_worm"]);

  const dirtyScore = scoreFor({
    profile: lure("drop_shot_worm"),
    row,
    scenario: baseScenario({ water_clarity: "dirty" }),
  });
  const clearScore = scoreFor({
    profile: lure("drop_shot_worm"),
    row,
    scenario: baseScenario({ water_clarity: "clear" }),
  });

  assert(
    !dirtyScore.reasons.some((reason) => reason.startsWith("clarity_strength")),
  );
  assert(
    clearScore.reasons.some((reason) => reason === "clarity_strength:clear:+8"),
  );
  assert(clearScore.score > dirtyScore.score);
});

Deno.test("DailyPick scoring ranks condition-tag matches above non-matches", () => {
  const row = baseRow({
    primary_lure_ids: ["spinnerbait", "drop_shot_worm"],
    primary_fly_ids: [],
  });
  const scenario = baseScenario({
    scenario_tags: ["wind_reaction"],
    water_clarity: "stained",
  });
  const matching = scoreFor({ profile: lure("spinnerbait"), row, scenario });
  const nonMatching = scoreFor({
    profile: lure("drop_shot_worm"),
    row,
    scenario,
  });

  assert(
    matching.reasons.includes("condition_tag:wind_reaction:+16"),
  );
  assert(matching.score > nonMatching.score);
});

Deno.test("DailyPick scoring favors reliable and versatile candidates for all_purpose when comparable", () => {
  const base = lure("weightless_stick_worm");
  const reliable = cloneWithGoalTags(base, [
    "reliable_action",
    "versatile_search",
  ]);
  const highRisk = cloneWithGoalTags(base, [
    "big_fish_upside",
    "high_risk_high_reward",
  ]);
  const row = baseRow({
    column_baseline: base.column,
    pace_baseline: base.primary_pace,
    primary_forage: "leech_worm",
    primary_lure_ids: ["weightless_stick_worm"],
  });
  const scenario = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: [],
  });

  assert(
    scoreFor({ profile: reliable, row, scenario }).score >
      scoreFor({ profile: highRisk, row, scenario }).score,
  );
});

Deno.test("DailyPick scoring favors big-fish candidates for big_fish when comparable", () => {
  const base = lure("weightless_stick_worm");
  const reliable = cloneWithGoalTags(base, [
    "reliable_action",
    "versatile_search",
  ]);
  const highRisk = cloneWithGoalTags(base, [
    "big_fish_upside",
    "high_risk_high_reward",
  ]);
  const row = baseRow({
    column_baseline: base.column,
    pace_baseline: base.primary_pace,
    primary_forage: "leech_worm",
    primary_lure_ids: ["weightless_stick_worm"],
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: [],
  });

  assert(
    scoreFor({ profile: highRisk, row, scenario }).score >
      scoreFor({ profile: reliable, row, scenario }).score,
  );
});

Deno.test("DailyPick pool and scoring preserve intrinsic catalog column and pace", () => {
  const row = baseRow({
    primary_lure_ids: ["buzzbait"],
    primary_fly_ids: [],
  });
  const pool = buildCandidatePool({
    row,
    scenario: baseScenario({ surface_daily_gate: "open" }),
  });
  const candidate = pool.lures[0]!;
  const scored = scoreFor({ profile: candidate.profile, row });

  assertEquals(candidate.profile.id, "buzzbait");
  assertEquals(candidate.profile.column, "surface");
  assertEquals(candidate.profile.primary_pace, "fast");
  assertEquals(candidate.profile.secondary_pace, "medium");
  assertEquals(scored.profile.column, "surface");
  assertEquals(scored.profile.primary_pace, "fast");
  assertEquals(scored.profile.secondary_pace, "medium");
});

Deno.test("DailyPick direct scoring throws when row and scenario identities mismatch", () => {
  assertThrows(
    () =>
      scoreFor({
        profile: lure("spinnerbait"),
        row: baseRow({ month: 7 }),
        scenario: baseScenario(),
      }),
    Error,
    "daily picks row/scenario mismatch: month",
  );
});

Deno.test("DailyPick pool and scoring do not import or call the current 3:3 selector", async () => {
  const files = [
    "supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts",
    "supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts",
  ];
  for (const file of files) {
    const text = await Deno.readTextFile(file);
    assert(!text.includes("selectSide"));
    assert(!text.includes("selectArchetypesForSide"));
    assert(!text.includes("../rebuild/"));
  }
});
