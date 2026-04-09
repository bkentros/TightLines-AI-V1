import { assertEquals } from "jsr:@std/assert";
import {
  normalizeLightBucketV3,
  type RecommenderV3ResolvedProfile,
  type RecommenderV3SeasonalRow,
  resolveColorDecisionV3,
  resolveDailyPayloadV3,
  scoreLureCandidatesV3,
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
        ...((overrides.norm as { normalized?: object } | undefined)
          ?.normalized ?? {}),
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
  assertEquals(
    daily.variables_triggered,
    [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "source_score_guardrail",
      "reaction_window",
      "pace_bias",
    ],
  );
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
  assertEquals(daily.presentation_nudge, "neutral");
  assertEquals(
    daily.variables_triggered,
    [
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "source_score_guardrail",
      "reaction_window",
      "pace_bias",
    ],
  );
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
  assertEquals(daily.presentation_nudge, "neutral");
  assertEquals(
    daily.variables_triggered,
    [
      "temperature_condition",
      "runoff_flow_disruption",
      "source_score_guardrail",
      "finesse_window",
      "pace_bias",
    ],
  );
});

const COLOR_MATRIX_CASES = [
  ["clear", "bright", "natural"],
  ["clear", "glare", "natural"],
  ["clear", "mixed", "natural"],
  ["clear", "mixed_sky", "natural"],
  ["clear", "low_light", "dark"],
  ["clear", "heavy_overcast", "dark"],
  ["stained", "bright", "dark"],
  ["stained", "glare", "dark"],
  ["stained", "mixed", "dark"],
  ["stained", "mixed_sky", "dark"],
  ["stained", "low_light", "bright"],
  ["stained", "heavy_overcast", "bright"],
  ["dirty", "bright", "dark"],
  ["dirty", "glare", "dark"],
  ["dirty", "mixed", "bright"],
  ["dirty", "mixed_sky", "bright"],
  ["dirty", "low_light", "bright"],
  ["dirty", "heavy_overcast", "bright"],
] as const;

Deno.test("V3 lockdown color matrix resolves every clarity/light combination deterministically", () => {
  for (const [clarity, lightLabel, expectedTheme] of COLOR_MATRIX_CASES) {
    const lightBucket = normalizeLightBucketV3(lightLabel);
    const decision = resolveColorDecisionV3(clarity, lightBucket);
    assertEquals(
      decision.color_theme,
      expectedTheme,
      `${clarity} + ${lightLabel} should resolve ${expectedTheme}`,
    );
  }
});

Deno.test("V3 lockdown scored candidates inherit the shared color decision instead of old lure-specific logic", () => {
  const result = scoreLureCandidatesV3(
    seasonalRow(["football_jig", "swim_jig", "suspending_jerkbait"]),
    resolvedProfile({
      final_mood: "active",
      final_presentation_style: "bold",
      primary_forage: "baitfish",
    }),
    {
      mood_nudge: "neutral",
      water_column_nudge: "neutral",
      presentation_nudge: "neutral",
      surface_window: "off",
      variables_considered: [],
      variables_triggered: [],
      notes: [],
      source_score: 60,
      source_band: "Good",
    },
    "stained",
    "low_light",
  );

  assertEquals(result.length, 3);
  for (const candidate of result) {
    assertEquals(candidate.color_theme, "bright");
  }
});
