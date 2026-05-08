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
    reasons: [`test:${args.score}`],
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
