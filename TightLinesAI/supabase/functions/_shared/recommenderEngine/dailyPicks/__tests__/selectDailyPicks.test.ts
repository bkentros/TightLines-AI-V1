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
    goal_tags: ["reliable_action"],
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

Deno.test("DailyPick selector keeps a commanding clear winner despite date variety", () => {
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

  assertEquals([...topIds], ["spinnerbait"]);
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

Deno.test("DailyPick selector prefers active goal fit before condition-only fit inside variety band", () => {
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
    seed: "goal-fit-before-condition-fit",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "swim_jig");
});

Deno.test("DailyPick selector prefers candidates with both active goal and condition fit when available", () => {
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

  assertEquals(selection.lure_of_the_day.profile.id, "swim_jig");
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
        "condition_tag:cover_oriented:+14",
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

  assertEquals(allPurpose.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(bigFish.lure_of_the_day.profile.id, "magnum_worm");
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

  assertEquals(selection.lure_of_the_day.profile.id, "magnum_worm");
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

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
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

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
});

Deno.test("DailyPick honorable mention may reuse family when every in-band candidate shares top family", () => {
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

Deno.test("DailyPick honorable mention does not drop far below the quality band for diversity", () => {
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
        presentation_group: "swim_jig",
      }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "quality-band",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(selection.honorable_lure.profile.id, "bladed_jig");
});

Deno.test("DailyPick family diversity outranks presentation diversity inside honorable band", () => {
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

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(selection.honorable_lure.profile.id, "swim_jig");
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
      candidate({ id: "swim_jig", side: "lure", score: 110 }),
    ],
    flyScores: baseFlies(),
    scenario: baseScenario(),
    seed: "preserve-profile",
    variant: "A",
  });

  assertEquals(selection.lure_of_the_day.profile.id, "spinnerbait");
  assertEquals(selection.lure_of_the_day.profile.column, "upper");
  assertEquals(selection.lure_of_the_day.profile.primary_pace, "fast");
  assertEquals(selection.lure_of_the_day.profile.secondary_pace, "medium");
});

Deno.test("DailyPick selector does not import or call the current 3:3 rebuild selector", async () => {
  const text = await Deno.readTextFile(
    "supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts",
  );
  assert(!text.includes("selectArchetypesForSide"));
  assert(!text.includes("../rebuild/"));
});
