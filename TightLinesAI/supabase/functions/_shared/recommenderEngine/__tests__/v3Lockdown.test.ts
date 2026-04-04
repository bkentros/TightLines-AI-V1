import { assertEquals } from "jsr:@std/assert";
import {
  resolveDailyPayloadV3,
  scoreLureCandidatesV3,
  type RecommenderV3ResolvedProfile,
  type RecommenderV3SeasonalRow,
} from "../v3/index.ts";

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
        wind_condition: { label: "light", score: 0 },
        light_cloud_condition: { label: "mixed", score: 0 },
        precipitation_disruption: { label: "dry_stable", score: 0.2 },
        runoff_flow_disruption: { label: "stable", score: 0.8 },
        ...((overrides.norm as { normalized?: object } | undefined)?.normalized ?? {}),
      },
    },
  } as any;
}

function seasonalRow(
  lureIds: RecommenderV3SeasonalRow["viable_lure_archetypes"],
): RecommenderV3SeasonalRow {
  return {
    species: "largemouth_bass",
    region_key: "south_central",
    month: 4,
    context: "freshwater_lake_pond",
    base_water_column: "shallow",
    base_mood: "neutral",
    base_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    viable_lure_archetypes: lureIds,
    viable_fly_archetypes: ["clouser_minnow"],
  };
}

function resolvedProfile(
  overrides: Partial<RecommenderV3ResolvedProfile> = {},
): RecommenderV3ResolvedProfile {
  return {
    final_water_column: "shallow",
    final_mood: "neutral",
    final_presentation_style: "balanced",
    primary_forage: "baitfish",
    secondary_forage: "crawfish",
    ...overrides,
  };
}

Deno.test("V3 lockdown resolves an explicit upbeat lake nudge from variable rules", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 82, band: "Excellent" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "warming",
        temperature_shock: "sharp_warmup",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow", score: 0.9 },
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.9 },
          precipitation_disruption: { label: "dry_stable", score: 0.2 },
        },
      },
    }),
    "freshwater_lake_pond",
  );

  assertEquals(daily.mood_nudge, "up_2");
  assertEquals(daily.water_column_nudge, "higher_1");
  assertEquals(daily.presentation_nudge, "bolder");
});

Deno.test("V3 lockdown uses How's Fishing score only as a guardrail, not a second full engine", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 34, band: "Poor" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "stable",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "falling_slow", score: 0.9 },
          wind_condition: { label: "moderate", score: 0.8 },
          light_cloud_condition: { label: "low_light", score: 0.9 },
          precipitation_disruption: { label: "dry_stable", score: 0.2 },
        },
      },
    }),
    "freshwater_lake_pond",
  );

  assertEquals(daily.mood_nudge, "neutral");
  assertEquals(daily.water_column_nudge, "neutral");
  assertEquals(daily.presentation_nudge, "bolder");
});

Deno.test("V3 lockdown resolves blown-out rivers as down, lower, but still more visible", () => {
  const daily = resolveDailyPayloadV3(
    analysis({
      scored: { score: 38, band: "Poor" },
      condition_context: {
        temperature_metabolic_context: "neutral",
        temperature_trend: "cooling",
        temperature_shock: "none",
      },
      norm: {
        normalized: {
          pressure_regime: { label: "stable_neutral", score: 0 },
          wind_condition: { label: "light", score: 0 },
          light_cloud_condition: { label: "mixed", score: 0 },
          runoff_flow_disruption: { label: "blown_out", score: -1.7 },
        },
      },
    }),
    "freshwater_river",
  );

  assertEquals(daily.mood_nudge, "down_1");
  assertEquals(daily.water_column_nudge, "lower_1");
  assertEquals(daily.presentation_nudge, "bolder");
});

Deno.test("V3 lockdown keeps bladed jig in a dark stained-water lane when that is the intended read", () => {
  const result = scoreLureCandidatesV3(
    seasonalRow(["bladed_jig"]),
    resolvedProfile({
      final_presentation_style: "balanced",
      primary_forage: "baitfish",
    }),
    "stained",
  );

  assertEquals(result[0]?.id, "bladed_jig");
  assertEquals(result[0]?.color_theme, "dark_contrast");
});

Deno.test("V3 lockdown prefers white shad for suspending jerkbaits in stained tightening baitfish windows", () => {
  const result = scoreLureCandidatesV3(
    seasonalRow(["suspending_jerkbait"]),
    resolvedProfile({
      final_mood: "neutral",
      final_presentation_style: "balanced",
      primary_forage: "baitfish",
    }),
    "stained",
  );

  assertEquals(result[0]?.id, "suspending_jerkbait");
  assertEquals(result[0]?.color_theme, "white_shad");
});

Deno.test("V3 lockdown keeps swim jigs in a shad lane instead of inheriting bottom-jig color bias", () => {
  const result = scoreLureCandidatesV3(
    seasonalRow(["swim_jig"]),
    resolvedProfile({
      final_mood: "active",
      final_presentation_style: "balanced",
      primary_forage: "baitfish",
    }),
    "stained",
  );

  assertEquals(result[0]?.id, "swim_jig");
  assertEquals(result[0]?.color_theme, "white_shad");
});
