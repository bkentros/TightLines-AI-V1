import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "jsr:@std/assert";
import type { DailyScenario } from "../buildDailyScenario.ts";
import type { CandidateScore } from "../scoreCandidate.ts";
import { selectDailyPicks } from "../selectDailyPicks.ts";
import type { ArchetypeProfileV4 } from "../../v4/contracts.ts";

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
    scenario_tags: ["wind_reaction"],
    missing_inputs: [],
    confidence: "high",
    ...overrides,
  };
}

function profile(args: {
  id: ArchetypeProfileV4["id"];
  gear_mode: "lure" | "fly";
  family_group?: string;
  presentation_group?: string;
  column?: ArchetypeProfileV4["column"];
  primary_pace?: ArchetypeProfileV4["primary_pace"];
  secondary_pace?: ArchetypeProfileV4["secondary_pace"];
  goal_tags?: ArchetypeProfileV4["goal_tags"];
}): ArchetypeProfileV4 {
  return {
    id: args.id,
    display_name: args.id,
    gear_mode: args.gear_mode,
    species_allowed: ["largemouth_bass"],
    water_types_allowed: ["freshwater_lake_pond"],
    family_group: args.family_group ?? `${args.gear_mode}_family`,
    presentation_group: args.presentation_group ??
      `${args.gear_mode}_presentation`,
    column: args.column ?? "mid",
    primary_pace: args.primary_pace ?? "medium",
    secondary_pace: args.secondary_pace,
    forage_tags: ["baitfish"],
    clarity_strengths: ["stained"],
    condition_tags: ["wind_reaction"],
    goal_tags: args.goal_tags ?? ["reliable_action"],
    is_surface: args.column === "surface",
    how_to_fish_variants: ["one", "two", "three"],
  };
}

function candidate(args: {
  id: ArchetypeProfileV4["id"];
  side: "lure" | "fly";
  score: number;
  reasons?: string[];
  family_group?: string;
  presentation_group?: string;
  column?: ArchetypeProfileV4["column"];
  primary_pace?: ArchetypeProfileV4["primary_pace"];
  secondary_pace?: ArchetypeProfileV4["secondary_pace"];
  goal_tags?: ArchetypeProfileV4["goal_tags"];
}): CandidateScore {
  return {
    profile: profile({
      id: args.id,
      gear_mode: args.side,
      family_group: args.family_group,
      presentation_group: args.presentation_group,
      column: args.column,
      primary_pace: args.primary_pace,
      secondary_pace: args.secondary_pace,
      goal_tags: args.goal_tags,
    }),
    side: args.side,
    score: args.score,
    reasons: args.reasons ?? [`test:${args.score}`],
  };
}

function baseLures(): CandidateScore[] {
  return [
    candidate({ id: "spinnerbait", side: "lure", score: 120 }),
    candidate({ id: "swim_jig", side: "lure", score: 116 }),
    candidate({ id: "paddle_tail_swimbait", side: "lure", score: 114 }),
  ];
}

function baseFlies(): CandidateScore[] {
  return [
    candidate({ id: "clouser_minnow", side: "fly", score: 120 }),
    candidate({ id: "deceiver", side: "fly", score: 116 }),
    candidate({
      id: "bucktail_baitfish_streamer",
      side: "fly",
      score: 114,
    }),
  ];
}

function selectedIds(selection: ReturnType<typeof selectDailyPicks>): string[] {
  return [
    selection.lure_of_the_day.profile.id,
    selection.honorable_lure.profile.id,
    selection.fly_of_the_day.profile.id,
    selection.honorable_fly.profile.id,
  ];
}

Deno.test("DailyPick selector is stable for the same seed, date, goal, and variant", () => {
  const args = {
    lureScores: baseLures(),
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "stable-seed",
    variant: "A" as const,
  };

  assertEquals(
    selectedIds(selectDailyPicks(args)),
    selectedIds(selectDailyPicks(args)),
  );
});

Deno.test("DailyPick selector can rotate among similarly scored candidates on different dates", () => {
  const lureScores = [
    candidate({ id: "spinnerbait", side: "lure", score: 100 }),
    candidate({ id: "swim_jig", side: "lure", score: 100 }),
    candidate({ id: "paddle_tail_swimbait", side: "lure", score: 100 }),
  ];
  const flyScores = baseFlies();
  const topIds = new Set<string>();

  for (let day = 1; day <= 14; day++) {
    const localDate = `2026-06-${String(day).padStart(2, "0")}`;
    topIds.add(
      selectDailyPicks({
        lureScores,
        flyScores,
        scenario: baseScenario({ local_date: localDate }),
        seed: "rotation-seed",
        variant: "A",
      }).lure_of_the_day.profile.id,
    );
  }

  assert(topIds.size > 1);
});

Deno.test("DailyPick selector keeps commanding candidates in the finalist pool without locking the top slot", () => {
  const lureScores = [
    candidate({ id: "spinnerbait", side: "lure", score: 140 }),
    candidate({ id: "swim_jig", side: "lure", score: 128 }),
    candidate({ id: "paddle_tail_swimbait", side: "lure", score: 127 }),
  ];
  const topIds = new Set<string>();

  for (let day = 1; day <= 14; day++) {
    const localDate = `2026-06-${String(day).padStart(2, "0")}`;
    topIds.add(
      selectDailyPicks({
        lureScores,
        flyScores: baseFlies(),
        scenario: baseScenario({ local_date: localDate }),
        seed: "clear-winner-seed",
        variant: "A",
      }).lure_of_the_day.profile.id,
    );
  }

  assert(topIds.has("spinnerbait"));
  assert(topIds.size > 1);
});

Deno.test("DailyPick selector can rotate close non-tied candidates without leaving the top quality band", () => {
  const lureScores = [
    candidate({ id: "spinnerbait", side: "lure", score: 140 }),
    candidate({ id: "swim_jig", side: "lure", score: 134 }),
    candidate({ id: "paddle_tail_swimbait", side: "lure", score: 132 }),
    candidate({ id: "squarebill_crankbait", side: "lure", score: 100 }),
  ];
  const topIds = new Set<string>();

  for (let day = 1; day <= 21; day++) {
    const localDate = `2026-06-${String(day).padStart(2, "0")}`;
    topIds.add(
      selectDailyPicks({
        lureScores,
        flyScores: baseFlies(),
        scenario: baseScenario({ local_date: localDate }),
        seed: "close-variety-seed",
        variant: "A",
      }).lure_of_the_day.profile.id,
    );
  }

  assert(topIds.size > 1);
  assert(!topIds.has("squarebill_crankbait"));
});

Deno.test("DailyPick finalist tiers keep Big Fish goal fit in the finalist rotation", () => {
  const goalFitSelections = new Set<string>();
  for (let day = 1; day <= 14; day++) {
    const localDate = `2026-06-${String(day).padStart(2, "0")}`;
    const selection = selectDailyPicks({
      lureScores: [
        candidate({
          id: "spinnerbait",
          side: "lure",
          score: 150,
          family_group: "spinner",
          reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
        }),
        candidate({
          id: "football_jig",
          side: "lure",
          score: 149,
          family_group: "jig",
          goal_tags: ["big_fish_upside"],
          reasons: [
            "base:+100",
            "goal:big_fish:big_fish_upside:+20",
            "clarity_strength:stained:+8",
          ],
        }),
        candidate({
          id: "paddle_tail_swimbait",
          side: "lure",
          score: 136,
          family_group: "swimbait",
          reasons: ["base:+100"],
        }),
      ],
      flyScores: baseFlies(),
      scenario: baseScenario({
        recommendation_goal: "big_fish",
        water_clarity: "clear",
        scenario_tags: ["wind_reaction"],
        local_date: localDate,
      }),
      seed: "big-fish-tier-goal-preference",
      variant: "A",
    });
    goalFitSelections.add(selection.lure_of_the_day.profile.id);
    goalFitSelections.add(selection.honorable_lure.profile.id);
  }

  assert(goalFitSelections.has("football_jig"));
  assert(goalFitSelections.has("spinnerbait"));
});

Deno.test("DailyPick selector lets priority daily-condition fit beat goal-only when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 138,
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "paddle_tail_swimbait",
        side: "lure",
        score: 100,
        reasons: ["base:+100"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      local_date: "2026-06-17",
    }),
    seed: "priority-condition-before-goal-only",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
});

Deno.test("DailyPick selector keeps goal-plus-condition fits in the expanded finalist pair", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 138,
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:wind_reaction:+16",
        ],
      }),
      candidate({
        id: "paddle_tail_swimbait",
        side: "lure",
        score: 137,
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      local_date: "2026-06-18",
    }),
    seed: "goal-and-condition-fit",
    variant: "A",
  });

  assert(
    [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("swim_jig"),
  );
});

Deno.test("DailyPick selector does not let uniform rotation bury a higher-scoring daily-lane top pick", () => {
  for (let day = 1; day <= 14; day++) {
    const selection = selectDailyPicks({
      lureScores: [
        candidate({
          id: "ned_rig",
          side: "lure",
          score: 151,
          family_group: "finesse_plastic",
          presentation_group: "ned_tube_finesse",
          reasons: [
            "base:+100",
            "goal:all_purpose:reliable_action:+18",
            "daily_lane:slow_subtle_all_purpose:+10",
          ],
        }),
        candidate({
          id: "suspending_jerkbait",
          side: "lure",
          score: 150,
          family_group: "jerkbait",
          presentation_group: "jerkbait",
          reasons: [
            "base:+100",
            "goal:all_purpose:versatile_search:+12",
          ],
        }),
        candidate({
          id: "spinnerbait",
          side: "lure",
          score: 130,
          reasons: ["base:+100"],
        }),
      ],
      flyScores: baseFlies(),
      scenario: baseScenario({
        recommendation_goal: "all_purpose",
        activity_level: "suppressed",
        water_clarity: "clear",
        scenario_tags: ["clear_subtle", "cold_slow"],
        local_date: `2026-03-${String(day).padStart(2, "0")}`,
      }),
      seed: "daily-lane-no-jitter-bury",
      variant: "A",
    });

    assertEquals(selection.lure_of_the_day.profile.id, "ned_rig");
  }
});

Deno.test("DailyPick selector keeps true-lane specialist staples ahead of broader profiles", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "ned_rig",
        side: "lure",
        score: 150,
        family_group: "finesse_plastic",
        presentation_group: "ned_tube_finesse",
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "daily_lane:slow_subtle_all_purpose:+10",
        ],
      }),
      candidate({
        id: "carolina_rigged_stick_worm",
        side: "lure",
        score: 150,
        family_group: "soft_plastic_worm",
        presentation_group: "worm_finesse",
        goal_tags: ["reliable_action", "versatile_search"],
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "goal:all_purpose:versatile_search:+12",
          "daily_lane:slow_subtle_all_purpose:+10",
        ],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 130,
        reasons: ["base:+100"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      activity_level: "suppressed",
      water_clarity: "clear",
      scenario_tags: ["clear_subtle", "cold_slow"],
      local_date: "2026-03-15",
    }),
    seed: "daily-lane-specialist-tie",
    variant: "A",
  });

  assert(
    ["ned_rig", "carolina_rigged_stick_worm"].includes(
      selection.lure_of_the_day.profile.id,
    ),
  );
});

Deno.test("DailyPick selector keeps close active condition specialists in finalist rotation", () => {
  let sawSpecialist = false;
  for (let day = 1; day <= 40; day++) {
    const selection = selectDailyPicks({
      lureScores: [
        candidate({
          id: "tube_jig",
          side: "lure",
          score: 176,
          family_group: "tube",
          presentation_group: "ned_tube_finesse",
          reasons: [
            "base:+100",
            "condition_tag:dirty_vibration:+16",
            "goal:all_purpose:reliable_action:+18",
          ],
        }),
        candidate({
          id: "suspending_jerkbait",
          side: "lure",
          score: 172,
          family_group: "jerkbait",
          presentation_group: "jerkbait",
          reasons: [
            "base:+100",
            "condition_tag:dirty_vibration:+16",
            "goal:all_purpose:reliable_action:+18",
          ],
        }),
        candidate({
          id: "squarebill_crankbait",
          side: "lure",
          score: 168,
          family_group: "crankbait_squarebill",
          presentation_group: "crankbait",
          reasons: [
            "base:+100",
            "condition_tag:dirty_vibration:+16",
            "goal:all_purpose:reliable_action:+18",
          ],
        }),
        candidate({
          id: "medium_diving_crankbait",
          side: "lure",
          score: 164,
          family_group: "crankbait_medium",
          presentation_group: "crankbait",
          reasons: [
            "base:+100",
            "condition_tag:dirty_vibration:+16",
            "goal:all_purpose:reliable_action:+18",
          ],
        }),
        candidate({
          id: "bladed_jig",
          side: "lure",
          score: 140,
          family_group: "bladed_jig",
          presentation_group: "spinner_vibration",
          goal_tags: [],
          reasons: [
            "base:+100",
            "condition_tag:dirty_vibration:+16",
            "clarity_strength:stained:+8",
          ],
        }),
      ],
      flyScores: baseFlies(),
      scenario: baseScenario({
        recommendation_goal: "all_purpose",
        water_clarity: "stained",
        scenario_tags: ["dirty_vibration", "wind_reaction"],
        local_date: `2026-04-${String(day).padStart(2, "0")}`,
      }),
      seed: "close-specialist-finalist",
      variant: "A",
    });
    sawSpecialist ||= [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("bladed_jig");
  }

  assert(sawSpecialist);
});

Deno.test("DailyPick Set B group novelty does not bury a much stronger daily-lane candidate", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "carolina_rigged_stick_worm",
        side: "lure",
        score: 162,
        family_group: "soft_plastic_worm",
        presentation_group: "worm_finesse",
        reasons: ["base:+100", "daily_lane:slow_subtle_all_purpose:+10"],
      }),
      candidate({
        id: "ned_rig",
        side: "lure",
        score: 160,
        family_group: "finesse_plastic",
        presentation_group: "worm_finesse",
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "daily_lane:slow_subtle_all_purpose:+10",
        ],
      }),
      candidate({
        id: "blade_bait",
        side: "lure",
        score: 148,
        family_group: "blade_bait",
        presentation_group: "metal_vibration",
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      activity_level: "suppressed",
      water_clarity: "clear",
      scenario_tags: ["clear_subtle", "cold_slow"],
      local_date: "2026-03-16",
    }),
    seed: "set-b-novelty-quality-band",
    variant: "B",
    avoidLureIds: ["carolina_rigged_stick_worm"],
  });

  assertEquals(selection.lure_of_the_day.profile.id, "ned_rig");
});

Deno.test("DailyPick Set B novelty keeps close all-purpose finesse specialists eligible", () => {
  const lureScores = [
    candidate({
      id: "tube_jig",
      side: "lure",
      score: 196,
      family_group: "tube_jig",
      presentation_group: "ned_tube_finesse",
      column: "bottom",
      primary_pace: "slow",
      reasons: [
        "base:+100",
        "condition_tag:cold_slow:+16",
        "goal:all_purpose:reliable_action:+18",
        "daily_lane:slow_subtle_all_purpose:+10",
      ],
    }),
    candidate({
      id: "ned_rig",
      side: "lure",
      score: 190,
      family_group: "finesse_plastic",
      presentation_group: "ned_tube_finesse",
      column: "bottom",
      primary_pace: "slow",
      reasons: [
        "base:+100",
        "condition_tag:cold_slow:+16",
        "goal:all_purpose:reliable_action:+18",
        "daily_lane:slow_subtle_all_purpose:+10",
      ],
    }),
    candidate({
      id: "finesse_jig",
      side: "lure",
      score: 190,
      family_group: "skirted_jig_bottom",
      presentation_group: "bottom_jig_craw",
      column: "bottom",
      primary_pace: "slow",
      reasons: [
        "base:+100",
        "condition_tag:cold_slow:+16",
        "goal:all_purpose:reliable_action:+18",
        "daily_lane:slow_subtle_all_purpose:+10",
      ],
    }),
    candidate({
      id: "texas_rigged_soft_plastic_craw",
      side: "lure",
      score: 190,
      family_group: "soft_plastic_craw",
      presentation_group: "bottom_jig_craw",
      column: "bottom",
      primary_pace: "slow",
      reasons: [
        "base:+100",
        "condition_tag:cold_slow:+16",
        "goal:all_purpose:reliable_action:+18",
        "daily_lane:slow_subtle_all_purpose:+10",
      ],
    }),
    candidate({
      id: "suspending_jerkbait",
      side: "lure",
      score: 190,
      family_group: "jerkbait",
      presentation_group: "jerkbait",
      reasons: [
        "base:+100",
        "condition_tag:cold_slow:+16",
        "goal:all_purpose:reliable_action:+18",
      ],
    }),
  ];
  let sawNedRig = false;

  for (let day = 1; day <= 40; day++) {
    const selection = selectDailyPicks({
      lureScores,
      flyScores: baseFlies(),
      scenario: baseScenario({
        recommendation_goal: "all_purpose",
        activity_level: "neutral",
        water_clarity: "clear",
        scenario_tags: ["cold_slow", "clear_subtle"],
        local_date: `2026-03-${String(day).padStart(2, "0")}`,
      }),
      seed: "set-b-close-finesse-specialist",
      variant: "B",
      avoidLureIds: ["tube_jig"],
    });

    sawNedRig ||= [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("ned_rig");
    assertNotEquals(selection.lure_of_the_day.profile.id, "tube_jig");
    assertNotEquals(selection.honorable_lure.profile.id, "tube_jig");
  }

  assert(sawNedRig);
});

Deno.test("DailyPick Set B top finalist avoids exact Set A IDs while keeping close finalists", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 152,
        family_group: "spinner",
        presentation_group: "spinner_vibration",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 150,
        family_group: "bladed_jig",
        presentation_group: "spinner_vibration",
      }),
      candidate({
        id: "squarebill_crankbait",
        side: "lure",
        score: 140,
        family_group: "crankbait",
        presentation_group: "crankbait",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({ local_date: "2026-06-26" }),
    seed: "set-b-close-presentation-novelty",
    variant: "B",
    avoidLureIds: ["spinnerbait"],
  });

  assertNotEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assert(
    ["bladed_jig", "squarebill_crankbait"].includes(
      selection.lure_of_the_day.profile.id,
    ),
  );
});

Deno.test("DailyPick selector elevates wind and dirty-water reaction fits when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "paddle_tail_swimbait",
        side: "lure",
        score: 144,
        reasons: ["base:+100", "goal:all_purpose:versatile_search:+12"],
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 140,
        reasons: [
          "base:+100",
          "condition_tag:wind_reaction:+16",
          "condition_tag:dirty_vibration:+16",
        ],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 138,
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "condition_tag:wind_reaction:+16",
        ],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      water_clarity: "dirty",
      scenario_tags: ["wind_reaction", "dirty_vibration"],
      local_date: "2026-06-23",
    }),
    seed: "wind-dirty-condition-fit",
    variant: "A",
  });

  assert(
    selection.lure_of_the_day.reasons.some((reason) =>
      reason.startsWith("condition_tag:wind_reaction:") ||
      reason.startsWith("condition_tag:dirty_vibration:")
    ),
  );
});

Deno.test("DailyPick Big Fish stained Set B protects close dirty-wind reaction fit", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "magnum_jerkbait",
        side: "lure",
        score: 152,
        family_group: "jerkbait",
        goal_tags: ["big_fish_upside"],
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "lipless_crankbait",
        side: "lure",
        score: 164,
        family_group: "crankbait_lipless",
        presentation_group: "crankbait",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
      candidate({
        id: "football_jig",
        side: "lure",
        score: 144,
        family_group: "jig",
        goal_tags: ["big_fish_upside"],
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      water_clarity: "stained",
      scenario_tags: ["wind_reaction", "dirty_vibration"],
      local_date: "2026-06-24",
    }),
    seed: "set-b-dirty-wind-protects-reaction",
    variant: "B",
    avoidLureIds: ["spinnerbait"],
  });

  assert(
    [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].some((id) => id === "lipless_crankbait"),
  );
});

Deno.test("DailyPick SMB Big Fish dirty-wind rows keep close reaction fit in the pair", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "magnum_jerkbait",
        side: "lure",
        score: 158,
        family_group: "jerkbait",
        goal_tags: ["big_fish_upside"],
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "big_smallmouth_tube",
        side: "lure",
        score: 156,
        family_group: "tube",
        goal_tags: ["big_fish_upside"],
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 156,
        family_group: "safety_pin_spinner",
        presentation_group: "spinner_vibration",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "big_fish",
      water_clarity: "stained",
      scenario_tags: ["wind_reaction", "dirty_vibration"],
      local_date: "2026-06-24",
    }),
    seed: "smb-dirty-wind-keeps-reaction",
    variant: "B",
  });

  const selected = [
    selection.lure_of_the_day,
    selection.honorable_lure,
  ];
  assert(
    selected.some((candidate) =>
      candidate.reasons.some((reason) =>
        reason.startsWith("condition_tag:wind_reaction:")
      )
    ),
  );
  assertNotEquals(
    selection.lure_of_the_day.profile.family_group,
    selection.honorable_lure.profile.family_group,
  );
});

Deno.test("DailyPick LMB dirty/stained wind rows keep active reaction coverage in the lure pair", () => {
  const coverageIds = new Set<string>();
  for (let day = 1; day <= 28; day++) {
    const selection = selectDailyPicks({
      lureScores: [
        candidate({
          id: "magnum_jerkbait",
          side: "lure",
          score: 180,
          family_group: "jerkbait",
          goal_tags: ["big_fish_upside"],
          reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
        }),
        candidate({
          id: "football_jig",
          side: "lure",
          score: 156,
          family_group: "jig",
          goal_tags: ["big_fish_upside"],
          reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
        }),
        candidate({
          id: "lipless_crankbait",
          side: "lure",
          score: 152,
          family_group: "crankbait_lipless",
          presentation_group: "crankbait",
          reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
        }),
        candidate({
          id: "spinnerbait",
          side: "lure",
          score: 150,
          family_group: "safety_pin_spinner",
          presentation_group: "spinner_vibration",
          reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
        }),
        candidate({
          id: "squarebill_crankbait",
          side: "lure",
          score: 148,
          family_group: "crankbait_shallow",
          presentation_group: "crankbait",
          reasons: ["base:+100", "condition_tag:dirty_vibration:+16"],
        }),
        candidate({
          id: "paddle_tail_swimbait",
          side: "lure",
          score: 146,
          family_group: "swimbait",
          presentation_group: "swimbait",
          reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
        }),
      ],
      flyScores: baseFlies(),
      scenario: baseScenario({
        species: "largemouth_bass",
        recommendation_goal: "big_fish",
        water_clarity: "stained",
        scenario_tags: ["wind_reaction", "dirty_vibration"],
        local_date: `2026-06-${String(day).padStart(2, "0")}`,
      }),
      seed: "lmb-dirty-wind-pair-coverage",
      variant: "A",
    });

    const selected = [
      selection.lure_of_the_day,
      selection.honorable_lure,
    ];
    assert(
      selected.some((candidate) =>
        candidate.reasons.some((reason) =>
          reason.startsWith("condition_tag:wind_reaction:") ||
          reason.startsWith("condition_tag:dirty_vibration:")
        )
      ),
    );
    assertNotEquals(
      selection.lure_of_the_day.profile.family_group,
      selection.honorable_lure.profile.family_group,
    );
    coverageIds.add(selection.honorable_lure.profile.id);
  }
  assert(coverageIds.size > 1);
  assert(!coverageIds.has("football_jig"));
});

Deno.test("DailyPick selector elevates clear bright subtle fits when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "paddle_tail_swimbait",
        side: "lure",
        score: 144,
        reasons: ["base:+100", "goal:all_purpose:versatile_search:+12"],
      }),
      candidate({
        id: "weightless_stick_worm",
        side: "lure",
        score: 140,
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "condition_tag:clear_subtle:+16",
        ],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 138,
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      water_clarity: "clear",
      light_mode: "bright",
      wind_mode: "calm",
      scenario_tags: ["clear_subtle"],
      local_date: "2026-06-24",
    }),
    seed: "clear-subtle-condition-fit",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "weightless_stick_worm");
});

Deno.test("DailyPick selector favors heat finesse for all-purpose when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 144,
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
      candidate({
        id: "drop_shot_minnow",
        side: "lure",
        score: 140,
        reasons: [
          "base:+100",
          "goal:all_purpose:reliable_action:+18",
          "condition_tag:heat_finesse:+16",
        ],
      }),
      candidate({
        id: "squarebill_crankbait",
        side: "lure",
        score: 138,
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      thermal_mode: "heat_limited",
      wind_mode: "calm",
      scenario_tags: ["heat_finesse"],
      local_date: "2026-07-15",
    }),
    seed: "heat-finesse-condition-fit",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "drop_shot_minnow");
});

Deno.test("DailyPick selector can preserve AP/BF separation when active goal-fit alternatives are in band", () => {
  const lureScores = [
    candidate({
      id: "spinnerbait",
      side: "lure",
      score: 140,
      reasons: [
        "base:+100",
        "goal:all_purpose:reliable_action:+18",
        "condition_tag:wind_reaction:+16",
      ],
    }),
    candidate({
      id: "magnum_worm",
      side: "lure",
      score: 138,
      reasons: [
        "base:+100",
        "goal:big_fish:big_fish_upside:+20",
        "condition_tag:wind_reaction:+16",
      ],
    }),
    candidate({
      id: "paddle_tail_swimbait",
      side: "lure",
      score: 136,
      reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
    }),
  ];

  const allPurpose = selectDailyPicks({
    lureScores,
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      local_date: "2026-06-19",
    }),
    seed: "goal-separation",
    variant: "A",
  });
  const bigFish = selectDailyPicks({
    lureScores,
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      local_date: "2026-06-19",
    }),
    seed: "goal-separation",
    variant: "A",
  });

  assert(
    [
      allPurpose.lure_of_the_day.profile.id,
      allPurpose.honorable_lure.profile.id,
    ].includes("spinnerbait"),
  );
  assert(
    [
      bigFish.lure_of_the_day.profile.id,
      bigFish.honorable_lure.profile.id,
    ].includes("magnum_worm"),
  );
});

Deno.test("DailyPick big-fish keeps open low-light summer topwater when it has goal and condition fit", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "magnum_worm",
        side: "lure",
        score: 146,
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "walking_topwater",
        side: "lure",
        score: 142,
        column: "surface",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:low_light_surface:+16",
        ],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      month: 7,
      surface_daily_gate: "open",
      light_mode: "low_light",
      scenario_tags: ["low_light_surface", "calm_surface"],
      local_date: "2026-07-20",
    }),
    seed: "low-light-surface-big-fish",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "walking_topwater");
});

Deno.test("DailyPick big-fish heat-limited surface window can yield to close heat-finesse fit", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "buzzbait",
        side: "lure",
        score: 158,
        family_group: "surface_buzz",
        presentation_group: "surface_buzz",
        column: "surface",
        primary_pace: "fast",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
        ],
      }),
      candidate({
        id: "magnum_worm",
        side: "lure",
        score: 150,
        family_group: "soft_plastic_worm",
        presentation_group: "worm_big_profile",
        primary_pace: "slow",
        reasons: [
          "base:+100",
          "condition_tag:heat_finesse:+16",
          "goal:big_fish:big_fish_upside:+20",
        ],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 138,
        family_group: "spinner",
        reasons: ["base:+100"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      month: 8,
      surface_daily_gate: "open",
      scenario_tags: ["calm_surface", "heat_finesse"],
      local_date: "2026-08-12",
    }),
    seed: "heat-limited-big-fish-surface-safety",
    variant: "B",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "magnum_worm");
});

Deno.test("DailyPick big-fish Set B honorable chooses close explicit-upside fly over non-upside without priority condition", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "game_changer",
        side: "fly",
        score: 166,
        family_group: "articulated_streamer",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:wind_reaction:+16",
        ],
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 154,
        reasons: ["base:+100", "condition_tag:open_water_search:+16"],
      }),
      candidate({
        id: "articulated_dungeon_streamer",
        side: "fly",
        score: 148,
        family_group: "meat_streamer",
        presentation_group: "meat_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
    ],
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction", "open_water_search"],
      local_date: "2026-06-25",
    }),
    seed: "big-fish-honorable-upside-safety",
    variant: "B",
  });

  assert(
    [
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ].includes("game_changer"),
  );
  assert(
    [
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ].includes("articulated_dungeon_streamer"),
  );
});

Deno.test("DailyPick big-fish safety replacement prefers close upside with different family and presentation", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "game_changer",
        side: "fly",
        score: 166,
        family_group: "baitfish_streamer",
        presentation_group: "baitfish_streamer",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:wind_reaction:+16",
        ],
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 154,
        family_group: "baitfish_streamer",
        presentation_group: "baitfish_streamer",
        reasons: ["base:+100", "condition_tag:open_water_search:+16"],
      }),
      candidate({
        id: "bluegill_streamer",
        side: "fly",
        score: 150,
        family_group: "baitfish_streamer",
        presentation_group: "baitfish_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "articulated_dungeon_streamer",
        side: "fly",
        score: 148,
        family_group: "articulated_streamer",
        presentation_group: "meat_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
    ],
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction", "open_water_search"],
      local_date: "2026-06-27",
    }),
    seed: "big-fish-safety-diverse-upside",
    variant: "B",
  });

  assert(
    [
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ].includes("articulated_dungeon_streamer"),
  );
  assertNotEquals(selection.honorable_fly.profile.id, "deceiver");
});

Deno.test("DailyPick big-fish Set B fly safety can reuse avoided upside to prevent non-upside misses", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "game_changer",
        side: "fly",
        score: 154,
        family_group: "segmented_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "articulated_baitfish_streamer",
        side: "fly",
        score: 146,
        family_group: "articulated_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 134,
        family_group: "baitfish_streamer",
        reasons: ["base:+100"],
      }),
    ],
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction"],
      local_date: "2026-09-20",
    }),
    seed: "smb-big-fish-set-b-avoided-upside-fly",
    variant: "B",
    avoidFlyIds: ["game_changer"],
  });

  assertEquals(
    selection.fly_of_the_day.profile.id,
    "articulated_baitfish_streamer",
  );
  assertEquals(selection.honorable_fly.profile.id, "game_changer");
  assertNotEquals(
    selection.fly_of_the_day.profile.family_group,
    selection.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPick big-fish Set B fly safety can reuse avoided upside when no close fallback exists", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "game_changer",
        side: "fly",
        score: 154,
        family_group: "segmented_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "articulated_baitfish_streamer",
        side: "fly",
        score: 146,
        family_group: "articulated_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 120,
        family_group: "baitfish_streamer",
        reasons: ["base:+100"],
      }),
    ],
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction"],
      local_date: "2026-09-20",
    }),
    seed: "smb-big-fish-set-b-avoided-upside-no-close-fly",
    variant: "B",
    avoidFlyIds: ["game_changer"],
  });

  assertEquals(
    selection.fly_of_the_day.profile.id,
    "articulated_baitfish_streamer",
  );
  assertEquals(selection.honorable_fly.profile.id, "game_changer");
  assertNotEquals(
    selection.fly_of_the_day.profile.family_group,
    selection.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPick big-fish Set B honorable prefers close non-overlap condition fit before avoided upside", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "game_changer",
        side: "fly",
        score: 154,
        family_group: "segmented_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "articulated_baitfish_streamer",
        side: "fly",
        score: 146,
        family_group: "articulated_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "zonker_streamer",
        side: "fly",
        score: 142,
        family_group: "baitfish_streamer",
        reasons: ["base:+100", "condition_tag:open_water_search:+16"],
      }),
    ],
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction", "open_water_search"],
      local_date: "2026-03-20",
    }),
    seed: "smb-big-fish-set-b-condition-before-avoided-upside",
    variant: "B",
    avoidFlyIds: ["game_changer"],
  });

  assertEquals(
    selection.fly_of_the_day.profile.id,
    "articulated_baitfish_streamer",
  );
  assertEquals(selection.honorable_fly.profile.id, "zonker_streamer");
  assertNotEquals(
    selection.fly_of_the_day.profile.family_group,
    selection.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPick big-fish Set B lure safety can reuse avoided upside to prevent non-upside misses", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 170,
        family_group: "bladed_jig",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:wind_reaction:+16",
        ],
      }),
      candidate({
        id: "magnum_jerkbait",
        side: "lure",
        score: 154,
        family_group: "jerkbait",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "squarebill_crankbait",
        side: "lure",
        score: 120,
        family_group: "crankbait",
        reasons: ["base:+100"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "big_fish",
      scenario_tags: ["wind_reaction"],
      local_date: "2026-09-21",
    }),
    seed: "smb-big-fish-set-b-avoided-upside-lure",
    variant: "B",
    avoidLureIds: ["magnum_jerkbait"],
  });

  assertEquals(selection.lure_of_the_day.profile.id, "bladed_jig");
  assertEquals(selection.honorable_lure.profile.id, "magnum_jerkbait");
  assertNotEquals(
    selection.lure_of_the_day.profile.family_group,
    selection.honorable_lure.profile.family_group,
  );
});

Deno.test("DailyPick big-fish honorable still allows close condition-fit picks without explicit upside", () => {
  const honorableIds = new Set<string>();
  for (let day = 1; day <= 14; day++) {
    honorableIds.add(
      selectDailyPicks({
        lureScores: baseLures(),
        flyScores: [
          candidate({
            id: "game_changer",
            side: "fly",
            score: 166,
            reasons: [
              "base:+100",
              "goal:big_fish:big_fish_upside:+20",
              "condition_tag:wind_reaction:+16",
            ],
          }),
          candidate({
            id: "deceiver",
            side: "fly",
            score: 162,
            family_group: "baitfish_streamer",
            reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
          }),
          candidate({
            id: "articulated_dungeon_streamer",
            side: "fly",
            score: 148,
            family_group: "articulated_streamer",
            presentation_group: "meat_streamer",
            reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
          }),
        ],
        scenario: baseScenario({
          recommendation_goal: "big_fish",
          scenario_tags: ["wind_reaction"],
          local_date: `2026-06-${String(day).padStart(2, "0")}`,
        }),
        seed: "big-fish-condition-fit-honorable",
        variant: "B",
      }).honorable_fly.profile.id,
    );
  }

  assert(honorableIds.has("deceiver"));
});

Deno.test("DailyPick all-purpose open surface can pick one topwater but avoids both high-risk-only surface lure slots", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "buzzbait",
        side: "lure",
        score: 166,
        column: "surface",
        goal_tags: ["high_risk_high_reward"],
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "condition_tag:calm_surface:+16",
        ],
      }),
      candidate({
        id: "walking_topwater",
        side: "lure",
        score: 154,
        column: "surface",
        goal_tags: ["high_risk_high_reward"],
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "condition_tag:calm_surface:+16",
        ],
      }),
      candidate({
        id: "weightless_stick_worm",
        side: "lure",
        score: 148,
        family_group: "soft_plastic_worm",
        presentation_group: "finesse_worm",
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      surface_daily_gate: "open",
      light_mode: "low_light",
      wind_mode: "calm",
      scenario_tags: ["low_light_surface", "calm_surface"],
      local_date: "2026-07-21",
    }),
    seed: "all-purpose-avoid-two-risk-surface",
    variant: "A",
  });

  assert(
    ["buzzbait", "walking_topwater"].includes(
      selection.lure_of_the_day.profile.id,
    ),
  );
  assertEquals(selection.honorable_lure.profile.id, "weightless_stick_worm");
});

Deno.test("DailyPick all-purpose avoids two surface flies outside a strong surface window", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "foam_gurgler_fly",
        side: "fly",
        score: 170,
        family_group: "fly_gurgler",
        column: "surface",
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "goal:all_purpose:reliable_action:+18",
          "goal:all_purpose:versatile_search:+12",
        ],
      }),
      candidate({
        id: "popper_fly",
        side: "fly",
        score: 164,
        family_group: "fly_popper",
        column: "surface",
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "goal:all_purpose:reliable_action:+18",
          "goal:all_purpose:versatile_search:+12",
        ],
      }),
      candidate({
        id: "warmwater_crawfish_fly",
        side: "fly",
        score: 160,
        family_group: "crawfish_fly",
        reasons: [
          "base:+100",
          "condition_tag:cold_slow:+16",
          "goal:all_purpose:reliable_action:+18",
        ],
      }),
    ],
    scenario: baseScenario({
      species: "smallmouth_bass",
      recommendation_goal: "all_purpose",
      activity_level: "neutral",
      surface_daily_gate: "open",
      scenario_tags: ["low_light_surface", "wind_reaction", "cold_slow"],
      local_date: "2026-05-10",
    }),
    seed: "all-purpose-avoid-two-surface-flies",
    variant: "A",
  });

  assert(
    ["foam_gurgler_fly", "popper_fly"].includes(
      selection.fly_of_the_day.profile.id,
    ),
  );
  assertEquals(selection.honorable_fly.profile.id, "warmwater_crawfish_fly");
});

Deno.test("DailyPick all-purpose non-surface backup prefers reliable diversity when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "buzzbait",
        side: "lure",
        score: 166,
        column: "surface",
        family_group: "topwater",
        presentation_group: "surface_reaction",
        goal_tags: ["high_risk_high_reward"],
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "condition_tag:calm_surface:+16",
        ],
      }),
      candidate({
        id: "walking_topwater",
        side: "lure",
        score: 154,
        column: "surface",
        family_group: "topwater",
        presentation_group: "surface_reaction",
        goal_tags: ["high_risk_high_reward"],
        reasons: [
          "base:+100",
          "condition_tag:low_light_surface:+16",
          "condition_tag:calm_surface:+16",
        ],
      }),
      candidate({
        id: "wake_bait",
        side: "lure",
        score: 150,
        family_group: "topwater",
        presentation_group: "surface_reaction",
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
      candidate({
        id: "weightless_stick_worm",
        side: "lure",
        score: 148,
        family_group: "soft_plastic_worm",
        presentation_group: "finesse_worm",
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      surface_daily_gate: "open",
      light_mode: "low_light",
      wind_mode: "calm",
      scenario_tags: ["low_light_surface", "calm_surface"],
      local_date: "2026-07-22",
    }),
    seed: "all-purpose-safety-diverse-backup",
    variant: "A",
  });

  assert(
    [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("weightless_stick_worm"),
  );
  assert(
    !(
      selection.lure_of_the_day.profile.is_surface &&
      selection.honorable_lure.profile.is_surface
    ),
  );
});

Deno.test("DailyPick selector avoids surface candidates under caution when in-band subsurface alternatives exist", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "walking_topwater",
        side: "lure",
        score: 140,
        column: "surface",
        reasons: [
          "base:+100",
          "goal:big_fish:big_fish_upside:+20",
          "condition_tag:low_light_surface:+16",
        ],
      }),
      candidate({
        id: "magnum_worm",
        side: "lure",
        score: 138,
        family_group: "soft_plastic_worm",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 136,
        family_group: "bladed_jig",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "big_fish",
      surface_daily_gate: "caution",
      local_date: "2026-06-20",
    }),
    seed: "surface-caution",
    variant: "A",
  });

  assertNotEquals(selection.lure_of_the_day.profile.id, "walking_topwater");
  assertNotEquals(selection.honorable_lure.profile.id, "walking_topwater");
});

Deno.test("DailyPick selector variant B avoids variant A IDs when alternatives exist", () => {
  const lureScores = [
    ...baseLures(),
    candidate({ id: "bladed_jig", side: "lure", score: 113 }),
  ];
  const flyScores = [
    ...baseFlies(),
    candidate({ id: "slim_minnow_streamer", side: "fly", score: 113 }),
  ];
  const scenario = baseScenario();
  const first = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: "variant-seed",
    variant: "A",
  });
  const avoidedLures = [
    first.lure_of_the_day.profile.id,
    first.honorable_lure.profile.id,
  ];
  const avoidedFlies = [
    first.fly_of_the_day.profile.id,
    first.honorable_fly.profile.id,
  ];
  const second = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: "variant-seed",
    variant: "B",
    avoidLureIds: avoidedLures,
    avoidFlyIds: avoidedFlies,
  });

  assert(!avoidedLures.includes(second.lure_of_the_day.profile.id));
  assert(!avoidedLures.includes(second.honorable_lure.profile.id));
  assert(!avoidedFlies.includes(second.fly_of_the_day.profile.id));
  assert(!avoidedFlies.includes(second.honorable_fly.profile.id));
});

Deno.test("DailyPick selector variant B may reuse avoided IDs only when necessary", () => {
  const lureScores = baseLures().slice(0, 2);
  const flyScores = baseFlies().slice(0, 2);
  const selection = selectDailyPicks({
    lureScores,
    flyScores,
    scenario: baseScenario(),
    seed: "reuse-seed",
    variant: "B",
    avoidLureIds: lureScores.map((score) => score.profile.id),
    avoidFlyIds: flyScores.map((score) => score.profile.id),
  });

  assertEquals(
    new Set([
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ]).size,
    2,
  );
  assertEquals(
    new Set([
      selection.fly_of_the_day.profile.id,
      selection.honorable_fly.profile.id,
    ]).size,
    2,
  );
});

Deno.test("DailyPick selector variant B may reuse avoided IDs to satisfy the family invariant", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        family_group: "wire_bait",
        presentation_group: "spinner_vibration",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 138,
        family_group: "jig",
        presentation_group: "swim_jig",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 136,
        family_group: "wire_bait",
        presentation_group: "spinner_vibration",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "avoid-before-family",
    variant: "B",
    avoidLureIds: ["swim_jig"],
  });

  assert(["spinnerbait", "bladed_jig"].includes(
    selection.lure_of_the_day.profile.id,
  ));
  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
  assertNotEquals(
    selection.lure_of_the_day.profile.family_group,
    selection.honorable_lure.profile.family_group,
  );
});

Deno.test("DailyPick selector variant B prefers different Set A presentation before family when close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 150,
        family_group: "safety_pin_spinner",
        presentation_group: "spinner_vibration",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 148,
        family_group: "bladed_jig",
        presentation_group: "spinner_vibration",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
      candidate({
        id: "squarebill_crankbait",
        side: "lure",
        score: 146,
        family_group: "crankbait_shallow",
        presentation_group: "crankbait",
        reasons: ["base:+100", "condition_tag:wind_reaction:+16"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "set-b-presentation-first",
    variant: "B",
    avoidLureIds: ["spinnerbait"],
  });

  assertEquals(selection.lure_of_the_day.profile.id, "squarebill_crankbait");
});

Deno.test("DailyPick selector variant B reuses avoided IDs only when no credible in-band alternative exists", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        family_group: "wire_bait",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 138,
        family_group: "jig",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 90,
        family_group: "bladed_jig",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "reuse-only-out-of-band",
    variant: "B",
    avoidLureIds: ["swim_jig"],
  });

  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
  assertNotEquals(selection.lure_of_the_day.profile.id, "swim_jig");
});

Deno.test("DailyPick selector never picks outside provided scored candidates", () => {
  const lureScores = baseLures();
  const flyScores = baseFlies();
  const allowed = new Set<string>([
    ...lureScores.map((score) => score.profile.id),
    ...flyScores.map((score) => score.profile.id),
  ]);
  const selection = selectDailyPicks({
    lureScores,
    flyScores,
    scenario: baseScenario(),
    seed: "provided-only",
    variant: "A",
  });

  for (const id of selectedIds(selection)) assert(allowed.has(id));
});

Deno.test("DailyPick selector throws when either side has fewer than two candidates", () => {
  assertThrows(
    () =>
      selectDailyPicks({
        lureScores: baseLures().slice(0, 1),
        flyScores: baseFlies(),
        scenario: baseScenario(),
        seed: "too-few",
        variant: "A",
      }),
    Error,
    "daily picks insufficient candidates for lure",
  );
  assertThrows(
    () =>
      selectDailyPicks({
        lureScores: baseLures(),
        flyScores: baseFlies().slice(0, 1),
        scenario: baseScenario(),
        seed: "too-few",
        variant: "A",
      }),
    Error,
    "daily picks insufficient candidates for fly",
  );
});

Deno.test("DailyPick honorable mention prefers different presentation group when scores are close", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        presentation_group: "wire_bait",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 130,
        presentation_group: "wire_bait",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 128,
        presentation_group: "swim_jig",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "diversity",
    variant: "A",
  });

  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
  assertNotEquals(selection.lure_of_the_day.profile.id, "swim_jig");
});

Deno.test("DailyPick honorable mention chooses different family when in-band alternative exists", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        family_group: "wire_bait",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 138,
        family_group: "wire_bait",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 126,
        family_group: "jig",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "family-diversity",
    variant: "A",
  });

  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
  assertNotEquals(selection.lure_of_the_day.profile.id, "swim_jig");
});

Deno.test("DailyPick honorable mention may reuse family when every hard-gated candidate shares top family", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        family_group: "wire_bait",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 136,
        family_group: "wire_bait",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 134,
        family_group: "wire_bait",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "family-unavailable",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.family_group, "wire_bait");
  assertEquals(selection.honorable_lure.profile.family_group, "wire_bait");
  assertNotEquals(
    selection.lure_of_the_day.profile.id,
    selection.honorable_lure.profile.id,
  );
});

Deno.test("DailyPick honorable mention uses different family beyond the normal quality band when available", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 140,
        presentation_group: "wire_bait",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 130,
        presentation_group: "wire_bait",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 90,
        family_group: "jig",
        presentation_group: "swim_jig",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "quality-band",
    variant: "A",
  });

  assertNotEquals(
    selection.lure_of_the_day.profile.family_group,
    selection.honorable_lure.profile.family_group,
  );
  assert(
    [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("swim_jig"),
  );
});

Deno.test("DailyPick family diversity outranks presentation diversity for honorable picks", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 160,
        family_group: "wire_bait",
        presentation_group: "wire_bait",
      }),
      candidate({
        id: "bladed_jig",
        side: "lure",
        score: 150,
        family_group: "wire_bait",
        presentation_group: "chatter",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 130,
        family_group: "jig",
        presentation_group: "wire_bait",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "family-before-presentation",
    variant: "A",
  });

  assertNotEquals(
    selection.lure_of_the_day.profile.family_group,
    selection.honorable_lure.profile.family_group,
  );
  assert(
    [
      selection.lure_of_the_day.profile.id,
      selection.honorable_lure.profile.id,
    ].includes("swim_jig"),
  );
});

Deno.test("DailyPick fly honorable uses different family when another family exists", () => {
  const selection = selectDailyPicks({
    lureScores: baseLures(),
    flyScores: [
      candidate({
        id: "clouser_minnow",
        side: "fly",
        score: 150,
        family_group: "baitfish_streamer",
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 148,
        family_group: "baitfish_streamer",
      }),
      candidate({
        id: "game_changer",
        side: "fly",
        score: 120,
        family_group: "articulated_streamer",
      }),
    ],
    scenario: baseScenario(),
    seed: "fly-family-invariant",
    variant: "A",
  });

  assertEquals(selection.honorable_fly.profile.id, "game_changer");
  assertNotEquals(selection.fly_of_the_day.profile.id, "game_changer");
  assertNotEquals(
    selection.fly_of_the_day.profile.family_group,
    selection.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPick variant B avoidance still works with family diversity", () => {
  const lureScores = [
    candidate({
      id: "spinnerbait",
      side: "lure",
      score: 140,
      family_group: "wire_bait",
    }),
    candidate({
      id: "bladed_jig",
      side: "lure",
      score: 138,
      family_group: "jig",
    }),
    candidate({
      id: "swim_jig",
      side: "lure",
      score: 136,
      family_group: "jig",
    }),
    candidate({
      id: "paddle_tail_swimbait",
      side: "lure",
      score: 134,
      family_group: "swimbait",
    }),
  ];
  const flyScores = [
    candidate({
      id: "clouser_minnow",
      side: "fly",
      score: 140,
      family_group: "baitfish",
    }),
    candidate({
      id: "deceiver",
      side: "fly",
      score: 138,
      family_group: "baitfish",
    }),
    candidate({
      id: "bucktail_baitfish_streamer",
      side: "fly",
      score: 136,
      family_group: "bucktail",
    }),
    candidate({
      id: "slim_minnow_streamer",
      side: "fly",
      score: 134,
      family_group: "slim_streamer",
    }),
  ];
  const scenario = baseScenario();
  const first = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: "variant-family-diversity",
    variant: "A",
  });
  const second = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: "variant-family-diversity",
    variant: "B",
    avoidLureIds: [
      first.lure_of_the_day.profile.id,
      first.honorable_lure.profile.id,
    ],
    avoidFlyIds: [
      first.fly_of_the_day.profile.id,
      first.honorable_fly.profile.id,
    ],
  });

  assertNotEquals(
    first.lure_of_the_day.profile.id,
    second.lure_of_the_day.profile.id,
  );
  assertNotEquals(
    first.honorable_lure.profile.id,
    second.honorable_lure.profile.id,
  );
  assertNotEquals(
    second.lure_of_the_day.profile.family_group,
    second.honorable_lure.profile.family_group,
  );
  assertNotEquals(
    second.fly_of_the_day.profile.family_group,
    second.honorable_fly.profile.family_group,
  );
});

Deno.test("DailyPick big-fish selection preserves at least one explicit upside pick per side when credible", () => {
  const scenario = baseScenario({
    recommendation_goal: "big_fish",
    scenario_tags: ["dirty_vibration"],
    local_date: "2026-06-21",
  });
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "squarebill_crankbait",
        side: "lure",
        score: 150,
        reasons: ["base:+100", "condition_tag:dirty_vibration:+16"],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 146,
        reasons: ["base:+100", "condition_tag:dirty_vibration:+16"],
      }),
      candidate({
        id: "compact_flipping_jig",
        side: "lure",
        score: 138,
        family_group: "jig",
        presentation_group: "bottom_jig_craw",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
    ],
    flyScores: [
      candidate({
        id: "clouser_minnow",
        side: "fly",
        score: 150,
        reasons: ["base:+100", "condition_tag:dirty_vibration:+16"],
      }),
      candidate({
        id: "deceiver",
        side: "fly",
        score: 146,
        reasons: ["base:+100", "condition_tag:dirty_vibration:+16"],
      }),
      candidate({
        id: "articulated_baitfish_streamer",
        side: "fly",
        score: 138,
        family_group: "streamer_articulated",
        presentation_group: "baitfish_streamer",
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
    ],
    scenario,
    seed: "big-fish-side-fit",
    variant: "A",
  });

  const selectedLureReasons = [
    selection.lure_of_the_day,
    selection.honorable_lure,
  ].flatMap((score) => score.reasons);
  const selectedFlyReasons = [
    selection.fly_of_the_day,
    selection.honorable_fly,
  ].flatMap((score) => score.reasons);

  assert(
    selectedLureReasons.some((reason) => reason.startsWith("goal:big_fish:")),
  );
  assert(
    selectedFlyReasons.some((reason) => reason.startsWith("goal:big_fish:")),
  );
});

Deno.test("DailyPick all-purpose selection still favors reliable or versatile candidates", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "glidebait",
        side: "lure",
        score: 150,
        reasons: ["base:+100", "goal:big_fish:big_fish_upside:+20"],
      }),
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 146,
        reasons: ["base:+100", "goal:all_purpose:reliable_action:+18"],
      }),
      candidate({
        id: "paddle_tail_swimbait",
        side: "lure",
        score: 144,
        reasons: ["base:+100", "goal:all_purpose:versatile_search:+12"],
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario({
      recommendation_goal: "all_purpose",
      local_date: "2026-06-22",
    }),
    seed: "all-purpose-reliable",
    variant: "A",
  });

  assertNotEquals(selection.lure_of_the_day.profile.id, "glidebait");
});

Deno.test("DailyPick selector never selects duplicate IDs on one side", () => {
  const selection = selectDailyPicks({
    lureScores: [
      candidate({ id: "spinnerbait", side: "lure", score: 100 }),
      candidate({ id: "spinnerbait", side: "lure", score: 140 }),
      candidate({ id: "swim_jig", side: "lure", score: 99 }),
    ],
    flyScores: [
      candidate({ id: "clouser_minnow", side: "fly", score: 100 }),
      candidate({ id: "clouser_minnow", side: "fly", score: 140 }),
      candidate({ id: "deceiver", side: "fly", score: 99 }),
    ],
    scenario: baseScenario(),
    seed: "dedupe",
    variant: "A",
  });

  assertNotEquals(
    selection.lure_of_the_day.profile.id,
    selection.honorable_lure.profile.id,
  );
  assertNotEquals(
    selection.fly_of_the_day.profile.id,
    selection.honorable_fly.profile.id,
  );
});

Deno.test("DailyPick selector preserves intrinsic profile column and pace", () => {
  const expected = new Map([
    ["spinnerbait", {
      column: "upper",
      primary_pace: "fast",
      secondary_pace: "medium",
    }],
    ["swim_jig", {
      column: "bottom",
      primary_pace: "slow",
      secondary_pace: "medium",
    }],
  ]);
  const selection = selectDailyPicks({
    lureScores: [
      candidate({
        id: "spinnerbait",
        side: "lure",
        score: 120,
        column: "upper",
        primary_pace: "fast",
        secondary_pace: "medium",
      }),
      candidate({
        id: "swim_jig",
        side: "lure",
        score: 110,
        column: "bottom",
        primary_pace: "slow",
        secondary_pace: "medium",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "preserve-profile",
    variant: "A",
  });

  const expectedProfile = expected.get(selection.lure_of_the_day.profile.id);
  assert(expectedProfile);
  assertEquals(
    selection.lure_of_the_day.profile.column,
    expectedProfile.column,
  );
  assertEquals(
    selection.lure_of_the_day.profile.primary_pace,
    expectedProfile.primary_pace,
  );
  assertEquals(
    selection.lure_of_the_day.profile.secondary_pace,
    expectedProfile.secondary_pace,
  );
});

Deno.test("DailyPick selector does not import or call the current 3:3 rebuild selector", async () => {
  const text = await Deno.readTextFile(
    "supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts",
  );
  assert(!text.includes("selectArchetypesForSide"));
  assert(!text.includes("../rebuild/"));
});
