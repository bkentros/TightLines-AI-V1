import { assert } from "jsr:@std/assert";
import type { RecommenderRequest } from "../contracts/input.ts";
import { computeRecommenderV3 } from "../runRecommenderV3.ts";
import { LURE_ARCHETYPES_V3 } from "../v3/candidates/lures.ts";
import { FLY_ARCHETYPES_V3 } from "../v3/candidates/flies.ts";
import { peerArchetypesCoherenceConflict } from "../v3/scoreCandidates.ts";

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
      highlighted_periods: [false, false, false, false],
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
        pressure_regime: { label: "stable_neutral", score: 0 },
        wind_condition: { label: "light", score: 0.2 },
        light_cloud_condition: { label: "mixed", score: 0 },
        precipitation_disruption: { label: "dry_stable", score: 0.1 },
        runoff_flow_disruption: { label: "stable", score: 0.6 },
        ...((overrides.norm as { normalized?: object } | undefined)?.normalized ?? {}),
      },
    },
  } as any;
}

function request(overrides: Partial<RecommenderRequest> = {}): RecommenderRequest {
  return {
    location: {
      latitude: 35.5,
      longitude: -82.5,
      state_code: "NC",
      region_key: "appalachian",
      local_date: "2026-07-18",
      local_timezone: "America/New_York",
      month: 7,
    },
    species: "largemouth_bass",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
    env_data: {},
    ...overrides,
  };
}

Deno.test("Phase 3 lure pick 3 does not peer-conflict with lure pick 2 (windy summer lake)", () => {
  const result = computeRecommenderV3(
    request(),
    analysis({
      norm: {
        normalized: {
          pressure_regime: { label: "stable_neutral", score: 0 },
          wind_condition: { label: "strong", score: -0.9 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );
  assert(result.lure_recommendations.length >= 3);
  const daily = result.daily_payload;
  const resolved = result.resolved_profile;
  const p1 = LURE_ARCHETYPES_V3[result.lure_recommendations[1]!.id as never];
  const p2 = LURE_ARCHETYPES_V3[result.lure_recommendations[2]!.id as never];
  assert(
    !peerArchetypesCoherenceConflict(p1, p2, daily, resolved),
    "pick 3 should not violate peer coherence against pick 2",
  );
});

Deno.test("Phase 3 fly pick 3 does not peer-conflict with fly pick 2 (same scenario)", () => {
  const result = computeRecommenderV3(
    request(),
    analysis({
      norm: {
        normalized: {
          pressure_regime: { label: "stable_neutral", score: 0 },
          wind_condition: { label: "strong", score: -0.9 },
          light_cloud_condition: { label: "mixed", score: 0 },
          precipitation_disruption: { label: "dry_stable", score: 0.1 },
        },
      },
    }),
  );
  assert(result.fly_recommendations.length >= 3);
  const daily = result.daily_payload;
  const resolved = result.resolved_profile;
  const p1 = FLY_ARCHETYPES_V3[result.fly_recommendations[1]!.id as never];
  const p2 = FLY_ARCHETYPES_V3[result.fly_recommendations[2]!.id as never];
  assert(
    !peerArchetypesCoherenceConflict(p1, p2, daily, resolved),
    "fly pick 3 should not violate peer coherence against fly pick 2",
  );
});
