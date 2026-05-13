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
