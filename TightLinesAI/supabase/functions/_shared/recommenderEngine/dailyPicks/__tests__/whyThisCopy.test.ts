import { assert, assertEquals } from "jsr:@std/assert";
import { FLY_ARCHETYPES_V4 } from "../../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../../v4/candidates/lures.ts";
import type { ArchetypeProfileV4 } from "../../v4/contracts.ts";
import type { DailyScenario } from "../buildDailyScenario.ts";
import type { CandidateScore } from "../scoreCandidate.ts";
import { whyThisCopy } from "../whyThisCopy.ts";

const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];

function scenario(
  profile: ArchetypeProfileV4,
  localDate: string,
): DailyScenario {
  return {
    local_date: localDate,
    local_timezone: "UTC",
    species: profile.species_allowed[0],
    region_key: "great_lakes_upper_midwest",
    month: 6,
    water_type: profile.water_types_allowed[0],
    water_clarity: profile.clarity_strengths[0],
    recommendation_goal: "all_purpose",
    hows_score: 70,
    activity_level: "active",
    surface_daily_gate: profile.is_surface ? "open" : "closed",
    surface_daily_reason_codes: [],
    light_mode: "mixed",
    wind_mode: "breezy",
    daylight_wind_mph: 10,
    thermal_mode: "stable",
    water_movement_mode: "not_applicable",
    pressure_mode: "stable",
    scenario_tags: [profile.condition_tags[0]],
    missing_inputs: [],
    confidence: "high",
  };
}

function score(profile: ArchetypeProfileV4): CandidateScore {
  return {
    profile,
    side: profile.gear_mode,
    score: 150,
    reasons: [
      `condition_tag:${profile.condition_tags[0]}:+16`,
      `primary_forage:${profile.forage_tags[0]}:+12`,
      `clarity_strength:${profile.clarity_strengths[0]}:+8`,
    ],
  };
}

function scoreWithReasons(
  profile: ArchetypeProfileV4,
  reasons: string[],
): CandidateScore {
  return {
    profile,
    side: profile.gear_mode,
    score: 150,
    reasons,
  };
}

function scenarioWith(
  profile: ArchetypeProfileV4,
  overrides: Partial<DailyScenario>,
): DailyScenario {
  return {
    ...scenario(profile, "2026-06-15"),
    ...overrides,
  };
}

function archetype(id: string): ArchetypeProfileV4 {
  const profile = ALL_ARCHETYPES.find((candidate) => candidate.id === id);
  assert(profile, `Missing archetype fixture: ${id}`);
  return profile;
}

function hasWindLanguage(copy: string): boolean {
  return /\b(wind|windy|breeze|breezy|chop|choppy|ripple)\b/i.test(copy);
}

Deno.test("why-this copy stays guide-facing, concise, and varied for every archetype", () => {
  const bannedTerms = [
    "daily signal",
    "condition_tag",
    "surface gate",
    "engine",
    "confidence",
    "score",
    "missing",
    "goal:",
  ];

  assertEquals(ALL_ARCHETYPES.length, 80);

  for (const profile of ALL_ARCHETYPES) {
    const sampled = new Set<string>();

    for (let index = 0; index < 9; index++) {
      const day = String(index + 1).padStart(2, "0");
      const copy = whyThisCopy({
        score: score(profile),
        scenario: scenario(profile, `2026-06-${day}`),
        slot: index % 2 === 0 ? "lure_of_the_day" : "honorable_lure",
        seed: `why-copy-audit-${index}`,
        variant: index % 2 === 0 ? "A" : "B",
      });
      sampled.add(copy);

      assert(copy.length <= 220, `${profile.id} copy is too long: ${copy}`);
      assertEquals(
        copy.match(/[.!?]/g)?.length ?? 0,
        1,
        `${profile.id} should be one sentence: ${copy}`,
      );
      assert(!copy.includes("_"), `${profile.id} leaks token copy: ${copy}`);
      for (const term of bannedTerms) {
        assert(
          !copy.toLowerCase().includes(term),
          `${profile.id} leaks "${term}" in why-this copy: ${copy}`,
        );
      }
      assert(
        copy.toLowerCase().includes("today"),
        `${profile.id} should mention today's daily setup or conditions: ${copy}`,
      );
    }

    assert(
      sampled.size >= 2,
      `${profile.id} should produce varied why-this copy across seeds`,
    );
  }
});

Deno.test("why-this avoids wind copy when wind is present in the scenario but not scored for the pick", () => {
  const profile = archetype("spinnerbait");
  const day = scenarioWith(profile, {
    water_clarity: "stained",
    wind_mode: "breezy",
    daylight_wind_mph: 9.5,
    scenario_tags: ["wind_reaction"],
  });
  const pickScore = scoreWithReasons(profile, [
    "base:+100",
    "goal:all_purpose:reliable_action:+18",
    "clarity_strength:stained:+8",
  ]);

  for (let index = 0; index < 16; index++) {
    const copy = whyThisCopy({
      score: pickScore,
      scenario: day,
      slot: "lure_of_the_day",
      seed: `wind-not-scored-${index}`,
      variant: "A",
    });

    assert(
      !hasWindLanguage(copy),
      `copy should not mention wind when wind was not scored: ${copy}`,
    );
  }
});

Deno.test("why-this keeps breezy wind-reaction copy conservative", () => {
  const profile = archetype("spinnerbait");
  const day = scenarioWith(profile, {
    water_clarity: "stained",
    wind_mode: "breezy",
    daylight_wind_mph: 9.5,
    scenario_tags: ["wind_reaction"],
  });
  const pickScore = scoreWithReasons(profile, [
    "base:+100",
    "condition_tag:wind_reaction:+16",
    "goal:all_purpose:reliable_action:+18",
  ]);

  for (let index = 0; index < 16; index++) {
    const copy = whyThisCopy({
      score: pickScore,
      scenario: day,
      slot: "lure_of_the_day",
      seed: `breezy-wind-scored-${index}`,
      variant: "A",
    });

    assert(
      !/\b(chop|choppy|stronger wind|breaks up the surface)\b/i.test(copy),
      `breezy copy should not overstate wind: ${copy}`,
    );
    assert(
      /\b(breeze|ripple)\b/i.test(copy),
      `breezy copy should describe the condition modestly: ${copy}`,
    );
  }
});

Deno.test("why-this frog copy does not invent specific surface-cover habitat", () => {
  const profile = archetype("hollow_body_frog");
  const day = scenarioWith(profile, {
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    water_clarity: "stained",
    recommendation_goal: "big_fish",
    surface_daily_gate: "open",
    surface_daily_reason_codes: [
      "seasonal_surface_closed",
      "warm_season_surface_exception",
      "calm_surface_open",
      "low_light_surface_open",
    ],
    scenario_tags: ["calm_surface", "low_light_surface"],
  });
  const pickScore = scoreWithReasons(profile, [
    "base:+100",
    "condition_tag:calm_surface:+16",
    "daily_lane:largemouth_frog_cover_big_fish:+18",
  ]);

  for (let index = 0; index < 16; index++) {
    const copy = whyThisCopy({
      score: pickScore,
      scenario: day,
      slot: "lure_of_the_day",
      seed: `generic-frog-${index}`,
      variant: "A",
    });

    assert(
      !/\b(grass|mats|pads|overhangs|shade)\b/i.test(copy),
      `frog copy should not invent specific cover habitat: ${copy}`,
    );
  }
});

Deno.test("why-this avoids wind terms on slight-wind spinnerbait fits", () => {
  const profile = archetype("spinnerbait");
  const day = scenarioWith(profile, {
    water_clarity: "dirty",
    wind_mode: "slight",
    daylight_wind_mph: 8,
    scenario_tags: ["dirty_vibration"],
  });
  const pickScore = scoreWithReasons(profile, [
    "base:+100",
    "condition_tag:dirty_vibration:+16",
    "goal:all_purpose:reliable_action:+18",
  ]);

  for (let index = 0; index < 16; index++) {
    const copy = whyThisCopy({
      score: pickScore,
      scenario: day,
      slot: "lure_of_the_day",
      seed: `slight-spinnerbait-${index}`,
      variant: "A",
    });

    assert(
      !hasWindLanguage(copy),
      `slight-wind copy should not mention wind: ${copy}`,
    );
  }
});
