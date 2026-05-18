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
import { FLY_ARCHETYPES_V4 } from "../../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";

function lure(id: string): ArchetypeProfileV4 {
  const profile = LURE_ARCHETYPES_V4.find((candidate) => candidate.id === id);
  if (profile == null) throw new Error(`missing test lure ${id}`);
  return profile;
}

function fly(id: string): ArchetypeProfileV4 {
  const profile = FLY_ARCHETYPES_V4.find((candidate) => candidate.id === id);
  if (profile == null) throw new Error(`missing test fly ${id}`);
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
  side?: "lure" | "fly";
}) {
  return scoreCandidate({
    profile: args.profile,
    side: args.side ?? "lure",
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

Deno.test("DailyPick candidate pool protects frog from closed surface gates", () => {
  const row = baseRow({
    primary_lure_ids: ["hollow_body_frog", "spinnerbait"],
    primary_fly_ids: [],
  });
  const closed = buildCandidatePool({
    row,
    scenario: baseScenario({ surface_daily_gate: "closed" }),
  });
  const open = buildCandidatePool({
    row,
    scenario: baseScenario({
      surface_daily_gate: "open",
      scenario_tags: ["low_light_surface", "calm_surface", "cover_ambush"],
    }),
  });

  assertEquals(ids(closed.lures), ["spinnerbait"]);
  assertEquals(ids(open.lures).sort(), ["hollow_body_frog", "spinnerbait"]);
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

Deno.test("DailyPick scoring diminishes same-family wind and dirty reaction tags", () => {
  const row = baseRow({
    primary_lure_ids: ["squarebill_crankbait"],
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    water_clarity: "stained",
  });
  const scored = scoreFor({
    profile: lure("squarebill_crankbait"),
    row,
    scenario,
  });

  assert(scored.reasons.includes("condition_tag:wind_reaction:+16"));
  assert(scored.reasons.includes("condition_tag:dirty_vibration:+0"));
});

Deno.test("DailyPick scoring no longer gives Bladed Jig crawfish forage credit", () => {
  const row = baseRow({
    primary_lure_ids: ["bladed_jig"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["wind_reaction"],
    water_clarity: "stained",
  });
  const scored = scoreFor({ profile: lure("bladed_jig"), row, scenario });

  assert(scored.reasons.includes("condition_tag:wind_reaction:+16"));
  assert(!scored.reasons.includes("primary_forage:crawfish:+12"));
  assert(scored.reasons.includes("secondary_forage:baitfish:+6"));
});

Deno.test("DailyPick scoring makes Bladed Jig a windy stained/dirty reaction staple", () => {
  const row = baseRow({
    primary_lure_ids: ["bladed_jig", "spinnerbait", "swim_jig"],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    water_clarity: "dirty",
  });
  const bladed = scoreFor({ profile: lure("bladed_jig"), row, scenario });
  const swimJig = scoreFor({ profile: lure("swim_jig"), row, scenario });

  assert(bladed.reasons.includes("condition_tag:wind_reaction:+16"));
  assert(bladed.reasons.includes("condition_tag:dirty_vibration:+0"));
  assert(bladed.reasons.includes("goal:all_purpose:reliable_action:+18"));
  assert(bladed.reasons.includes("goal:all_purpose:versatile_search:+12"));
  assert(bladed.reasons.includes("clarity_strength:dirty:+8"));
  assert(bladed.score > swimJig.score);
});

Deno.test("DailyPick scoring keeps Texas Craw condition-truthful across finesse and cover lanes", () => {
  const row = baseRow({
    primary_lure_ids: ["texas_rigged_soft_plastic_craw", "ned_rig"],
    primary_forage: "crawfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const coldScenario = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: ["cold_slow"],
    water_clarity: "clear",
    activity_level: "neutral",
  });

  const cold = scoreFor({
    profile: lure("texas_rigged_soft_plastic_craw"),
    row,
    scenario: coldScenario,
  });

  assert(cold.reasons.includes("condition_tag:cold_slow:+16"));
  assert(cold.reasons.includes("goal:all_purpose:reliable_action:+18"));
  assert(cold.reasons.includes("daily_lane:craw_bottom_all_purpose:+6"));
  assert(
    cold.reasons.includes("daily_lane:largemouth_texas_craw_all_purpose:+14"),
  );
  assert(!cold.reasons.includes("goal:all_purpose:versatile_search:+12"));
  assert(!cold.reasons.some((reason) => reason.startsWith("goal:big_fish")));
});

Deno.test("DailyPick scoring gives LMB Texas Craw a narrow PB bottom-cover path", () => {
  const row = baseRow({
    primary_lure_ids: [
      "texas_rigged_soft_plastic_craw",
      "compact_flipping_jig",
    ],
    primary_forage: "crawfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const supported = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["cover_ambush", "heat_finesse"],
    water_clarity: "stained",
    thermal_mode: "heat_limited",
  });
  const unsupported = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["open_water_search"],
    water_clarity: "clear",
  });
  const supportedScore = scoreFor({
    profile: lure("texas_rigged_soft_plastic_craw"),
    row,
    scenario: supported,
  });
  const unsupportedScore = scoreFor({
    profile: lure("texas_rigged_soft_plastic_craw"),
    row: { ...row, primary_forage: "baitfish", column_baseline: "mid" },
    scenario: unsupported,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:largemouth_texas_craw_big_fish:+16",
    ),
  );
  assert(
    !supportedScore.reasons.some((reason) =>
      reason.startsWith("goal:big_fish:big_fish_upside")
    ),
  );
  assert(
    !unsupportedScore.reasons.includes(
      "daily_lane:largemouth_texas_craw_big_fish:+16",
    ),
  );
  assert(supportedScore.score > unsupportedScore.score);
});

Deno.test("DailyPick scoring gives Magnum Worm a PB-only warm cover path", () => {
  const row = baseRow({
    primary_lure_ids: ["magnum_worm", "football_jig"],
    primary_forage: "leech_worm",
    secondary_forage: "crawfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const bigFish = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["cover_ambush", "heat_finesse"],
    thermal_mode: "heat_limited",
    water_clarity: "stained",
  });
  const allPurpose = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: ["cover_ambush", "heat_finesse"],
    thermal_mode: "heat_limited",
    water_clarity: "stained",
  });

  const pbScore = scoreFor({
    profile: lure("magnum_worm"),
    row,
    scenario: bigFish,
  });
  const apScore = scoreFor({
    profile: lure("magnum_worm"),
    row,
    scenario: allPurpose,
  });

  assert(pbScore.reasons.includes("goal:big_fish:big_fish_upside:+20"));
  assert(pbScore.reasons.includes("goal:big_fish:high_risk_high_reward:+12"));
  assert(pbScore.reasons.includes("condition_tag:cover_ambush:+16"));
  assert(pbScore.score > apScore.score);
  assert(
    !apScore.reasons.some((reason) => reason.startsWith("goal:all_purpose")),
  );
});

Deno.test("DailyPick scoring lets Paddle-Tail gain only from open-water warming support", () => {
  const row = baseRow({
    primary_lure_ids: ["paddle_tail_swimbait"],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const supported = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: ["open_water_search", "warming_search"],
    water_clarity: "stained",
  });
  const unsupported = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: [],
    water_clarity: "clear",
  });

  const supportedScore = scoreFor({
    profile: lure("paddle_tail_swimbait"),
    row,
    scenario: supported,
  });
  const unsupportedScore = scoreFor({
    profile: lure("paddle_tail_swimbait"),
    row,
    scenario: unsupported,
  });

  assert(
    supportedScore.reasons.includes("condition_tag:open_water_search:+16"),
  );
  assert(supportedScore.reasons.includes("condition_tag:warming_search:+0"));
  assert(
    !supportedScore.reasons.some((reason) =>
      reason.startsWith("condition_tag:low_light_surface")
    ),
  );
  assert(
    supportedScore.reasons.includes("goal:all_purpose:reliable_action:+18"),
  );
  assert(
    supportedScore.reasons.includes("goal:all_purpose:versatile_search:+12"),
  );
  assert(
    !supportedScore.reasons.some((reason) =>
      reason.startsWith("goal:big_fish")
    ),
  );
  assert(supportedScore.score > unsupportedScore.score);
});

Deno.test("DailyPick scoring gives LMB Paddle-Tail only condition-supported PB lift", () => {
  const row = baseRow({
    primary_lure_ids: ["paddle_tail_swimbait"],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const supported = baseScenario({
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    scenario_tags: ["open_water_search", "warming_search"],
    water_clarity: "stained",
  });
  const unsupported = baseScenario({
    recommendation_goal: "big_fish",
    activity_level: "suppressed",
    scenario_tags: ["open_water_search", "warming_search"],
    water_clarity: "stained",
  });

  const supportedScore = scoreFor({
    profile: lure("paddle_tail_swimbait"),
    row,
    scenario: supported,
  });
  const unsupportedScore = scoreFor({
    profile: lure("paddle_tail_swimbait"),
    row,
    scenario: unsupported,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:largemouth_paddle_tail_big_fish:+14",
    ),
  );
  assert(
    !unsupportedScore.reasons.includes(
      "daily_lane:largemouth_paddle_tail_big_fish:+14",
    ),
  );
  assert(supportedScore.score > unsupportedScore.score);
});

Deno.test("DailyPick scoring keeps frog competitive only in warm surface cover windows", () => {
  const row = baseRow({
    primary_lure_ids: ["hollow_body_frog", "walking_topwater"],
    primary_forage: "bluegill_perch",
    secondary_forage: "surface_prey",
    column_baseline: "surface",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["low_light_surface", "calm_surface", "cover_ambush"],
    water_clarity: "stained",
    light_mode: "low_light",
  });
  const frog = scoreFor({ profile: lure("hollow_body_frog"), row, scenario });
  const walking = scoreFor({
    profile: lure("walking_topwater"),
    row,
    scenario,
  });

  assert(frog.reasons.includes("condition_tag:low_light_surface:+16"));
  assert(frog.reasons.includes("condition_tag:cover_ambush:+16"));
  assert(frog.reasons.includes("goal:big_fish:big_fish_upside:+20"));
  assert(
    frog.reasons.includes("daily_lane:largemouth_frog_cover_big_fish:+36"),
  );
  assert(frog.score >= walking.score - 12);
});

Deno.test("DailyPick scoring blocks frog PB lift outside surface-cover fit", () => {
  const row = baseRow({
    primary_lure_ids: ["hollow_body_frog"],
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    column_baseline: "surface",
    pace_baseline: "slow",
  });
  const closed = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "closed",
    scenario_tags: ["cover_ambush", "low_light_surface"],
    water_clarity: "stained",
  });
  const openNoCover = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    scenario_tags: ["low_light_surface"],
    water_clarity: "clear",
  });

  for (const scenario of [closed, openNoCover]) {
    const scored = scoreFor({
      profile: lure("hollow_body_frog"),
      row,
      scenario,
    });
    assert(
      !scored.reasons.includes(
        "daily_lane:largemouth_frog_cover_big_fish:+36",
      ),
    );
  }
});

Deno.test("DailyPick scoring gives LMB popper a narrow PB target-surface path", () => {
  const row = baseRow({
    primary_lure_ids: ["popping_topwater"],
    primary_forage: "surface_prey",
    secondary_forage: "bluegill_perch",
    column_baseline: "surface",
    pace_baseline: "medium",
  });
  const supported = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    wind_mode: "slight",
    scenario_tags: ["calm_surface", "low_light_surface"],
    water_clarity: "stained",
    light_mode: "low_light",
  });
  const closed = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "closed",
    wind_mode: "calm",
    scenario_tags: ["calm_surface", "low_light_surface"],
    water_clarity: "stained",
    light_mode: "low_light",
  });
  const heatNoLight = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    wind_mode: "calm",
    scenario_tags: ["calm_surface"],
    thermal_mode: "heat_limited",
    light_mode: "mixed",
  });

  const supportedScore = scoreFor({
    profile: lure("popping_topwater"),
    row,
    scenario: supported,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:largemouth_popper_target_big_fish:+20",
    ),
  );
  for (const scenario of [closed, heatNoLight]) {
    assert(
      !scoreFor({ profile: lure("popping_topwater"), row, scenario }).reasons
        .includes("daily_lane:largemouth_popper_target_big_fish:+20"),
    );
  }
});

Deno.test("DailyPick scoring gives LMB Buzzbait PB lift only in noisy low-light surface windows", () => {
  const row = baseRow({
    primary_lure_ids: ["buzzbait"],
    primary_forage: "baitfish",
    secondary_forage: "surface_prey",
    column_baseline: "surface",
    pace_baseline: "fast",
  });
  const supported = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    light_mode: "low_light",
    scenario_tags: ["low_light_surface", "wind_reaction", "dirty_vibration"],
    water_clarity: "stained",
  });
  const clearCalm = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    light_mode: "low_light",
    scenario_tags: ["low_light_surface", "calm_surface"],
    water_clarity: "clear",
  });
  const allPurpose = baseScenario({
    recommendation_goal: "all_purpose",
    surface_daily_gate: "open",
    light_mode: "low_light",
    scenario_tags: ["low_light_surface", "wind_reaction", "dirty_vibration"],
    water_clarity: "stained",
  });

  const supportedScore = scoreFor({
    profile: lure("buzzbait"),
    row,
    scenario: supported,
  });
  const clearCalmScore = scoreFor({
    profile: lure("buzzbait"),
    row,
    scenario: clearCalm,
  });
  const allPurposeScore = scoreFor({
    profile: lure("buzzbait"),
    row,
    scenario: allPurpose,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:largemouth_buzzbait_big_fish:+6",
    ),
  );
  assert(
    !clearCalmScore.reasons.includes(
      "daily_lane:largemouth_buzzbait_big_fish:+6",
    ),
  );
  assert(
    !allPurposeScore.reasons.includes(
      "daily_lane:largemouth_buzzbait_big_fish:+6",
    ),
  );
});

Deno.test("DailyPick scoring no longer gives Lipless Crankbait permanent crawfish forage credit", () => {
  const row = baseRow({
    primary_lure_ids: ["lipless_crankbait"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "all_purpose",
    scenario_tags: ["wind_reaction", "warming_search"],
    water_clarity: "stained",
  });
  const scored = scoreFor({
    profile: lure("lipless_crankbait"),
    row,
    scenario,
  });

  assert(!scored.reasons.includes("primary_forage:crawfish:+12"));
  assert(scored.reasons.includes("secondary_forage:baitfish:+6"));
  assert(scored.reasons.includes("condition_tag:wind_reaction:+16"));
  assert(!scored.reasons.includes("condition_tag:warming_search:+16"));
});

Deno.test("DailyPick scoring keeps Spinnerbait credible in big-fish wind and stain without explicit upside", () => {
  const row = baseRow({
    primary_lure_ids: ["bladed_jig", "spinnerbait"],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    water_clarity: "stained",
    activity_level: "active",
  });
  const bladed = scoreFor({ profile: lure("bladed_jig"), row, scenario });
  const spinnerbait = scoreFor({ profile: lure("spinnerbait"), row, scenario });

  assert(
    !spinnerbait.reasons.some((reason) =>
      reason.startsWith("goal:big_fish:big_fish_upside:")
    ),
  );
  assert(spinnerbait.reasons.includes("condition_tag:wind_reaction:+16"));
  assert(spinnerbait.reasons.includes("condition_tag:dirty_vibration:+0"));
  assert(
    spinnerbait.score >= bladed.score - 24,
    `expected Spinnerbait ${spinnerbait.score} to compete with Bladed Jig ${bladed.score}`,
  );
});

Deno.test("DailyPick scoring keeps clear and cold finesse tags fully stackable", () => {
  const row = baseRow({
    primary_lure_ids: ["ned_rig"],
    primary_forage: "crawfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "suppressed",
  });
  const scored = scoreFor({ profile: lure("ned_rig"), row, scenario });

  assert(scored.reasons.includes("condition_tag:clear_subtle:+16"));
  assert(scored.reasons.includes("condition_tag:cold_slow:+16"));
  assert(scored.reasons.includes("daily_lane:slow_subtle_all_purpose:+10"));
  assert(scored.reasons.includes("daily_lane:craw_bottom_all_purpose:+6"));
});

Deno.test("DailyPick scoring rewards slow bottom finesse in heat-limited all-purpose windows", () => {
  const row = baseRow({
    primary_lure_ids: [
      "ned_rig",
      "finesse_jig",
      "texas_rigged_soft_plastic_craw",
    ],
    primary_forage: "crawfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    scenario_tags: ["heat_finesse", "clear_subtle"],
    water_clarity: "clear",
    activity_level: "neutral",
  });

  for (
    const profileId of [
      "ned_rig",
      "finesse_jig",
      "texas_rigged_soft_plastic_craw",
    ] as const
  ) {
    const scored = scoreFor({ profile: lure(profileId), row, scenario });
    assert(
      scored.reasons.includes("condition_tag:heat_finesse:+16"),
      `${profileId} should receive heat_finesse`,
    );
    assert(
      scored.reasons.includes(
        "daily_lane:heat_slow_bottom_all_purpose:+6",
      ),
      `${profileId} should receive heat slow-bottom lane`,
    );
  }
});

Deno.test("DailyPick scoring keeps LMB bottom finesse competitive in clear cold suppressed windows", () => {
  const row = baseRow({
    primary_lure_ids: [
      "bladed_jig",
      "ned_rig",
      "carolina_rigged_stick_worm",
      "finesse_jig",
    ],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "suppressed",
  });
  const bladed = scoreFor({ profile: lure("bladed_jig"), row, scenario });
  const finesseScores = [
    scoreFor({ profile: lure("ned_rig"), row, scenario }),
    scoreFor({ profile: lure("carolina_rigged_stick_worm"), row, scenario }),
    scoreFor({ profile: lure("finesse_jig"), row, scenario }),
  ];

  assert(
    finesseScores.some((score) => score.score >= bladed.score),
    `expected a finesse profile to be competitive with bladed ${bladed.score}; got ${
      finesseScores.map((score) => `${score.profile.id}:${score.score}`).join(
        ", ",
      )
    }`,
  );
});

Deno.test("DailyPick scoring keeps SMB finesse profiles competitive in clear cold suppressed windows", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_lure_ids: [
      "bladed_jig",
      "ned_rig",
      "tube_jig",
      "drop_shot_minnow",
    ],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    species: "smallmouth_bass",
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "suppressed",
  });
  const bladed = scoreFor({ profile: lure("bladed_jig"), row, scenario });
  const finesseScores = [
    scoreFor({ profile: lure("ned_rig"), row, scenario }),
    scoreFor({ profile: lure("tube_jig"), row, scenario }),
    scoreFor({ profile: lure("drop_shot_minnow"), row, scenario }),
  ];

  assert(
    finesseScores.some((score) => score.score >= bladed.score),
    `expected an SMB finesse profile to be competitive with bladed ${bladed.score}; got ${
      finesseScores.map((score) => `${score.profile.id}:${score.score}`).join(
        ", ",
      )
    }`,
  );
});

Deno.test("DailyPick scoring gives SMB Ned Texas Craw and Finesse Jig only AP finesse-lane support", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_lure_ids: [
      "ned_rig",
      "texas_rigged_soft_plastic_craw",
      "finesse_jig",
    ],
    primary_forage: "crawfish",
    secondary_forage: "leech_worm",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const supported = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "all_purpose",
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "neutral",
  });
  const bigFish = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "neutral",
  });
  const dirtyUnsupported = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "all_purpose",
    scenario_tags: ["dirty_vibration"],
    water_clarity: "dirty",
    activity_level: "neutral",
  });

  for (
    const id of [
      "ned_rig",
      "texas_rigged_soft_plastic_craw",
      "finesse_jig",
    ] as const
  ) {
    const supportedScore = scoreFor({
      profile: lure(id),
      row,
      scenario: supported,
    });
    const bigFishScore = scoreFor({
      profile: lure(id),
      row,
      scenario: bigFish,
    });
    const dirtyScore = scoreFor({
      profile: lure(id),
      row,
      scenario: dirtyUnsupported,
    });
    assert(
      supportedScore.reasons.includes(
        "daily_lane:smallmouth_bottom_finesse_all_purpose:+6",
      ),
      `${id} should receive SMB AP finesse support`,
    );
    if (id === "ned_rig") {
      assert(
        supportedScore.reasons.includes(
          "daily_lane:smallmouth_ned_finesse:+18",
        ),
        "Ned should receive SMB finesse support",
      );
    }
    if (id === "texas_rigged_soft_plastic_craw") {
      assert(
        supportedScore.reasons.includes(
          "daily_lane:smallmouth_texas_craw:+14",
        ),
        "Texas Craw should receive SMB craw support",
      );
    }
    if (id === "finesse_jig") {
      assert(
        supportedScore.reasons.includes(
          "daily_lane:smallmouth_finesse_jig:+14",
        ),
        "Finesse Jig should receive SMB finesse support",
      );
    }
    assert(
      !bigFishScore.reasons.includes(
        "daily_lane:smallmouth_bottom_finesse_all_purpose:+6",
      ),
    );
    assert(
      !dirtyScore.reasons.includes(
        "daily_lane:smallmouth_bottom_finesse_all_purpose:+6",
      ),
    );
  }
});

Deno.test("DailyPick scoring keeps SMB Tube Jig AP-meaningful in bottom finesse windows", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_lure_ids: ["tube_jig", "ned_rig"],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const scenario = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "all_purpose",
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "neutral",
  });
  const bigFish = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    scenario_tags: ["clear_subtle", "cold_slow"],
    water_clarity: "clear",
    activity_level: "neutral",
  });

  assert(
    scoreFor({ profile: lure("tube_jig"), row, scenario }).reasons.includes(
      "daily_lane:smallmouth_tube_jig_all_purpose:+14",
    ),
  );
  assert(
    !scoreFor({ profile: lure("tube_jig"), row, scenario: bigFish }).reasons
      .includes("daily_lane:smallmouth_tube_jig_all_purpose:+14"),
  );
});

Deno.test("DailyPick scoring gives SMB paddle-tail and blade bait condition-specific support", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_lure_ids: ["paddle_tail_swimbait", "blade_bait"],
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const searchScenario = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    scenario_tags: ["warming_search", "open_water_search"],
    water_clarity: "stained",
  });
  const coldReaction = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    scenario_tags: ["cold_slow", "wind_reaction", "dirty_vibration"],
    water_clarity: "dirty",
  });
  const suppressed = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "all_purpose",
    activity_level: "suppressed",
    scenario_tags: ["warming_search", "open_water_search"],
    water_clarity: "stained",
  });

  assert(
    scoreFor({
      profile: lure("paddle_tail_swimbait"),
      row,
      scenario: searchScenario,
    })
      .reasons.includes("daily_lane:smallmouth_paddle_tail_search:+16"),
  );
  assert(
    !scoreFor({
      profile: lure("paddle_tail_swimbait"),
      row,
      scenario: suppressed,
    })
      .reasons.includes("daily_lane:smallmouth_paddle_tail_search:+16"),
  );
  assert(
    scoreFor({ profile: lure("blade_bait"), row, scenario: coldReaction })
      .reasons.includes("daily_lane:smallmouth_blade_bait_cold_reaction:+16"),
  );
});

Deno.test("DailyPick scoring gives SMB gurgler PB support only in safe surface windows", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_fly_ids: ["foam_gurgler_fly", "deer_hair_slider"],
    primary_forage: "surface_prey",
    secondary_forage: "baitfish",
    column_baseline: "surface",
    pace_baseline: "medium",
  });
  const supported = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    scenario_tags: ["calm_surface", "low_light_surface"],
    light_mode: "low_light",
  });
  const closed = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    surface_daily_gate: "closed",
    scenario_tags: ["calm_surface", "low_light_surface"],
    light_mode: "low_light",
  });

  const supportedScore = scoreFor({
    profile: fly("foam_gurgler_fly"),
    side: "fly",
    row,
    scenario: supported,
  });
  const closedScore = scoreFor({
    profile: fly("foam_gurgler_fly"),
    side: "fly",
    row,
    scenario: closed,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:smallmouth_gurgler_surface_big_fish:+34",
    ),
  );
  assert(
    !closedScore.reasons.includes(
      "daily_lane:smallmouth_gurgler_surface_big_fish:+34",
    ),
  );
});

Deno.test("DailyPick scoring keeps Bladed Jig strong in dirty windy Big Fish windows", () => {
  const row = baseRow({
    primary_lure_ids: ["bladed_jig", "ned_rig"],
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    water_clarity: "dirty",
    activity_level: "active",
  });

  assert(
    scoreFor({ profile: lure("bladed_jig"), row, scenario }).score >
      scoreFor({ profile: lure("ned_rig"), row, scenario }).score,
  );
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

Deno.test("DailyPick scoring applies a strong caution penalty to surface candidates", () => {
  const row = baseRow({
    column_baseline: "upper",
    pace_baseline: "medium",
    primary_forage: "baitfish",
    primary_lure_ids: ["buzzbait", "spinnerbait"],
  });
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    surface_daily_gate: "caution",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
    water_clarity: "dirty",
  });
  const surface = scoreFor({ profile: lure("buzzbait"), row, scenario });
  const subsurface = scoreFor({ profile: lure("spinnerbait"), row, scenario });

  assert(surface.reasons.includes("surface_daily_gate:caution:-24"));
  assert(
    subsurface.score > surface.score,
    `expected subsurface ${subsurface.score} to beat caution surface ${surface.score}`,
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

Deno.test("DailyPick scoring restores reliable all-purpose support for bass staple lanes", () => {
  const row = baseRow({
    primary_lure_ids: [
      "weightless_stick_worm",
      "spinnerbait",
      "swim_jig",
      "paddle_tail_swimbait",
    ],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "all_purpose",
    water_clarity: "stained",
    scenario_tags: ["wind_reaction", "dirty_vibration", "warming_search"],
  });

  for (
    const id of [
      "weightless_stick_worm",
      "spinnerbait",
      "swim_jig",
      "paddle_tail_swimbait",
    ]
  ) {
    const scored = scoreFor({ profile: lure(id), row, scenario });
    assert(
      scored.reasons.includes("goal:all_purpose:reliable_action:+18"),
      `${id} should carry reliable all-purpose support`,
    );
  }
});

Deno.test("DailyPick scoring shifts windy baitfish fly fit away from Baitfish Slider", () => {
  const row = baseRow({
    primary_lure_ids: [],
    primary_fly_ids: ["clouser_minnow", "deceiver", "baitfish_slider_fly"],
    primary_forage: "baitfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    recommendation_goal: "all_purpose",
    water_clarity: "stained",
    scenario_tags: ["wind_reaction", "open_water_search"],
  });
  const slider = scoreFor({
    profile: fly("baitfish_slider_fly"),
    row,
    scenario,
    side: "fly",
  });
  const clouser = scoreFor({
    profile: fly("clouser_minnow"),
    row,
    scenario,
    side: "fly",
  });
  const deceiver = scoreFor({
    profile: fly("deceiver"),
    row,
    scenario,
    side: "fly",
  });

  assert(
    !slider.reasons.some((reason) =>
      reason.startsWith("condition_tag:wind_reaction")
    ),
  );
  assert(clouser.score > slider.score);
  assert(deceiver.score > slider.score);
});

Deno.test("DailyPick scoring gives LMB Shaky Head a narrow AP finesse lane", () => {
  const row = baseRow({
    primary_lure_ids: ["shaky_head_worm", "suspending_jerkbait"],
    primary_forage: "leech_worm",
    secondary_forage: "crawfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const supported = baseScenario({
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "clear",
    scenario_tags: ["clear_subtle", "cold_slow"],
  });
  const unsupported = baseScenario({
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    water_clarity: "clear",
    scenario_tags: ["clear_subtle", "cold_slow"],
  });

  const supportedScore = scoreFor({
    profile: lure("shaky_head_worm"),
    row,
    scenario: supported,
  });
  const unsupportedScore = scoreFor({
    profile: lure("shaky_head_worm"),
    row,
    scenario: unsupported,
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:largemouth_shaky_head_all_purpose:+18",
    ),
  );
  assert(
    !unsupportedScore.reasons.includes(
      "daily_lane:largemouth_shaky_head_all_purpose:+18",
    ),
  );
  assert(supportedScore.score > unsupportedScore.score);
});

Deno.test("DailyPick scoring gives SMB popper PB support only in safe target surface", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    primary_lure_ids: [],
    primary_fly_ids: ["popper_fly", "deer_hair_slider"],
    primary_forage: "surface_prey",
    secondary_forage: "baitfish",
    column_baseline: "surface",
    pace_baseline: "medium",
  });
  const supported = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    surface_daily_gate: "open",
    wind_mode: "calm",
    water_clarity: "stained",
    scenario_tags: ["calm_surface", "low_light_surface"],
  });
  const closed = baseScenario({
    species: "smallmouth_bass",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    surface_daily_gate: "closed",
    wind_mode: "calm",
    water_clarity: "stained",
    scenario_tags: [],
  });
  const popper = scoreFor({
    profile: fly("popper_fly"),
    row,
    scenario: supported,
    side: "fly",
  });
  const closedPopper = scoreFor({
    profile: fly("popper_fly"),
    row,
    scenario: closed,
    side: "fly",
  });

  assert(
    popper.reasons.includes("daily_lane:smallmouth_popper_target_big_fish:+34"),
  );
  assert(
    !closedPopper.reasons.includes(
      "daily_lane:smallmouth_popper_target_big_fish:+34",
    ),
  );
});

Deno.test("DailyPick scoring gives SMB Mouse only a warm calm river PB bank lane", () => {
  const row = baseRow({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    month: 8,
    primary_lure_ids: [],
    primary_fly_ids: ["mouse_fly", "deer_hair_slider"],
    primary_forage: "surface_prey",
    secondary_forage: "baitfish",
    column_baseline: "upper",
    pace_baseline: "slow",
  });
  const supported = baseScenario({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    month: 8,
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    surface_daily_gate: "open",
    wind_mode: "slight",
    water_clarity: "clear",
    scenario_tags: ["calm_surface", "low_light_surface"],
  });
  const allPurpose = baseScenario({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    month: 8,
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    surface_daily_gate: "open",
    wind_mode: "slight",
    water_clarity: "clear",
    scenario_tags: ["calm_surface", "low_light_surface"],
  });
  const coldClosed = baseScenario({
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    month: 4,
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    surface_daily_gate: "closed",
    wind_mode: "windy",
    water_clarity: "clear",
    scenario_tags: [],
  });

  const supportedScore = scoreFor({
    profile: fly("mouse_fly"),
    row,
    scenario: supported,
    side: "fly",
  });

  assert(
    supportedScore.reasons.includes(
      "daily_lane:smallmouth_mouse_bank_big_fish:+32",
    ),
  );
  assert(
    !scoreFor({
      profile: fly("mouse_fly"),
      row,
      scenario: allPurpose,
      side: "fly",
    }).reasons.includes("daily_lane:smallmouth_mouse_bank_big_fish:+32"),
  );
  assert(
    !scoreFor({
      profile: fly("mouse_fly"),
      row: { ...row, month: 4 },
      scenario: coldClosed,
      side: "fly",
    }).reasons.includes("daily_lane:smallmouth_mouse_bank_big_fish:+32"),
  );
});

Deno.test("DailyPick scoring lifts pike alternatives only in their home windows", () => {
  const row = baseRow({
    species: "northern_pike",
    primary_lure_ids: [
      "large_bucktail_spinner",
      "pike_spinnerbait",
      "pike_jerkbait",
      "casting_spoon",
      "weedless_spoon",
      "pike_glidebait",
      "large_pike_tube",
      "large_profile_pike_swimbait",
      "pike_jig_and_plastic",
    ],
    primary_forage: "baitfish",
    secondary_forage: "bluegill_perch",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const reaction = baseScenario({
    species: "northern_pike",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    water_clarity: "stained",
    scenario_tags: [
      "wind_reaction",
      "dirty_vibration",
      "open_water_search",
      "current_swing",
    ],
  });
  const calmClear = baseScenario({
    species: "northern_pike",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    water_clarity: "clear",
    wind_mode: "calm",
    scenario_tags: ["clear_subtle", "calm_surface"],
  });
  const suppressed = baseScenario({
    species: "northern_pike",
    recommendation_goal: "big_fish",
    activity_level: "suppressed",
    water_clarity: "stained",
    scenario_tags: ["wind_reaction", "dirty_vibration"],
  });

  assert(
    scoreFor({
      profile: lure("large_bucktail_spinner"),
      row,
      scenario: reaction,
    })
      .reasons.includes("daily_lane:pike_bucktail_reaction:+20"),
  );
  assert(
    scoreFor({ profile: lure("pike_spinnerbait"), row, scenario: reaction })
      .reasons.includes("daily_lane:pike_spinnerbait_cover_reaction:+20"),
  );
  assert(
    scoreFor({ profile: lure("pike_jerkbait"), row, scenario: reaction })
      .reasons.includes("daily_lane:pike_jerkbait_pause:+18"),
  );
  assert(
    scoreFor({ profile: lure("pike_glidebait"), row, scenario: calmClear })
      .reasons.includes("daily_lane:pike_glide_ambush:+18"),
  );
  assert(
    scoreFor({ profile: lure("large_pike_tube"), row, scenario: reaction })
      .reasons.includes("daily_lane:pike_tube_bottom:+16"),
  );
  assert(
    scoreFor({
      profile: lure("large_profile_pike_swimbait"),
      row,
      scenario: reaction,
    }).reasons.includes("daily_lane:pike_large_swimbait:+16"),
  );
  assert(
    scoreFor({
      profile: lure("pike_jig_and_plastic"),
      row,
      scenario: calmClear,
    }).reasons.includes("pike_heavy_paddle_tail_off_window:-44"),
  );
  assert(
    !scoreFor({
      profile: lure("large_bucktail_spinner"),
      row,
      scenario: suppressed,
    }).reasons.includes("daily_lane:pike_bucktail_reaction:+20"),
  );
});

Deno.test("DailyPick scoring penalizes pike Blade Bait only outside specialist AP windows", () => {
  const row = baseRow({
    species: "northern_pike",
    primary_lure_ids: ["blade_bait", "casting_spoon"],
    primary_forage: "baitfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const homeWindow = baseScenario({
    species: "northern_pike",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "stained",
    scenario_tags: ["cold_slow", "open_water_search"],
  });
  const offWindow = baseScenario({
    species: "northern_pike",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "clear",
    scenario_tags: ["clear_subtle"],
  });
  const clearBreezyOpenWater = baseScenario({
    species: "northern_pike",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "clear",
    scenario_tags: ["wind_reaction", "open_water_search"],
  });
  const dirtyOpenWater = baseScenario({
    species: "northern_pike",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "dirty",
    scenario_tags: ["wind_reaction", "dirty_vibration", "open_water_search"],
  });
  const homeBlade = scoreFor({
    profile: lure("blade_bait"),
    row,
    scenario: homeWindow,
  });
  const offBlade = scoreFor({
    profile: lure("blade_bait"),
    row,
    scenario: offWindow,
  });
  const clearOpenBlade = scoreFor({
    profile: lure("blade_bait"),
    row,
    scenario: clearBreezyOpenWater,
  });
  const dirtyOpenBlade = scoreFor({
    profile: lure("blade_bait"),
    row,
    scenario: dirtyOpenWater,
  });

  assert(
    !homeBlade.reasons.includes("pike_blade_bait_off_window_specialist:-56"),
  );
  assert(
    offBlade.reasons.includes("pike_blade_bait_off_window_specialist:-56"),
  );
  assert(
    clearOpenBlade.reasons.includes(
      "pike_blade_bait_off_window_specialist:-56",
    ),
  );
  assert(
    !dirtyOpenBlade.reasons.includes(
      "pike_blade_bait_off_window_specialist:-56",
    ),
  );
  assert(homeBlade.reasons.includes("condition_tag:cold_slow:+16"));
});

Deno.test("DailyPick scoring gives pike fly alternatives condition-specific support", () => {
  const row = baseRow({
    species: "northern_pike",
    primary_lure_ids: [],
    primary_fly_ids: ["deceiver", "game_changer", "bucktail_baitfish_streamer"],
    water_type: "freshwater_river",
    primary_forage: "baitfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const scenario = baseScenario({
    species: "northern_pike",
    water_type: "freshwater_river",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    water_clarity: "stained",
    scenario_tags: ["wind_reaction", "open_water_search", "current_swing"],
  });

  for (const id of ["deceiver", "game_changer", "bucktail_baitfish_streamer"]) {
    assert(
      scoreFor({ profile: fly(id), row, scenario, side: "fly" })
        .reasons.includes("daily_lane:pike_fly_alternative:+14"),
      `${id} should gain only the named pike alternative lane`,
    );
  }
});

Deno.test("DailyPick scoring gives trout crawfish and river streamers narrow river support", () => {
  const row = baseRow({
    species: "trout",
    water_type: "freshwater_river",
    primary_lure_ids: [],
    primary_fly_ids: [
      "crawfish_streamer",
      "zonker_streamer",
      "conehead_streamer",
      "muddler_sculpin",
    ],
    primary_forage: "crawfish",
    secondary_forage: "baitfish",
    column_baseline: "bottom",
    pace_baseline: "slow",
  });
  const river = baseScenario({
    species: "trout",
    water_type: "freshwater_river",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "stained",
    scenario_tags: ["current_swing", "cold_slow"],
  });
  const lake = baseScenario({
    species: "trout",
    water_type: "freshwater_lake_pond",
    recommendation_goal: "all_purpose",
    activity_level: "neutral",
    water_clarity: "stained",
    scenario_tags: ["cold_slow"],
  });

  assert(
    scoreFor({
      profile: fly("crawfish_streamer"),
      row,
      scenario: river,
      side: "fly",
    })
      .reasons.includes("daily_lane:trout_crawfish_streamer:+34"),
  );
  assert(
    scoreFor({
      profile: fly("zonker_streamer"),
      row,
      scenario: river,
      side: "fly",
    })
      .reasons.includes("daily_lane:trout_river_streamer_alternative:+10"),
  );
  assert(
    !scoreFor({
      profile: fly("crawfish_streamer"),
      row: { ...row, water_type: "freshwater_lake_pond" },
      scenario: lake,
      side: "fly",
    }).reasons.includes("daily_lane:trout_crawfish_streamer:+34"),
  );
});

Deno.test("DailyPick scoring steers dirty trout current away from Hair Jig default", () => {
  const row = baseRow({
    species: "trout",
    water_type: "freshwater_river",
    primary_lure_ids: [
      "hair_jig",
      "inline_spinner",
      "casting_spoon",
      "blade_bait",
    ],
    primary_fly_ids: [],
    primary_forage: "baitfish",
    column_baseline: "mid",
    pace_baseline: "medium",
  });
  const dirtyCurrent = baseScenario({
    species: "trout",
    water_type: "freshwater_river",
    recommendation_goal: "big_fish",
    activity_level: "neutral",
    water_clarity: "dirty",
    scenario_tags: ["dirty_vibration", "runoff_streamer", "current_swing"],
  });

  const hair = scoreFor({
    profile: lure("hair_jig"),
    row,
    scenario: dirtyCurrent,
  });
  const blade = scoreFor({
    profile: lure("blade_bait"),
    row,
    scenario: dirtyCurrent,
  });

  assert(
    hair.reasons.includes("trout_hair_jig_dirty_current_mismatch:-16"),
  );
  assert(
    blade.reasons.includes(
      "daily_lane:trout_dirty_current_lure_alternative:+14",
    ),
  );
  assert(blade.score > hair.score);
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
