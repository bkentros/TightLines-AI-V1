#!/usr/bin/env -S deno run --allow-read --allow-write

import { computeRecommenderV3 } from "../../supabase/functions/_shared/recommenderEngine/runRecommenderV3.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";

const OUTPUT_JSON =
  "docs/recommender-v3-audit/generated/v3-daily-shift-audit.json";
const OUTPUT_MARKDOWN =
  "docs/recommender-v3-audit/generated/v3-daily-shift-audit.md";

type AnalysisInput = Record<string, unknown>;

type ScenarioCase = {
  id: string;
  label: string;
  request: RecommenderRequest;
  analysis: AnalysisInput;
};

type CheckResult = {
  label: string;
  pass: boolean;
  detail: string;
};

type PairAudit = {
  id: string;
  label: string;
  left: ScenarioCase;
  right: ScenarioCase;
  evaluate: (left: ScenarioSummary, right: ScenarioSummary) => CheckResult[];
};

type ScenarioSummary = {
  id: string;
  label: string;
  species: string;
  context: string;
  region_key: string;
  month: number;
  water_clarity: string;
  daily_payload: {
    surface_window: string;
    reaction_window: string;
    finesse_window: string;
    pace_bias: string;
  };
  resolved_profile: {
    final_water_column: string;
    final_mood: string;
    final_presentation_style: string;
  };
  lure_top3: string[];
  fly_top3: string[];
  lure_lanes: string[];
  fly_lanes: string[];
};

type PairResult = {
  id: string;
  label: string;
  checks: CheckResult[];
  left: ScenarioSummary;
  right: ScenarioSummary;
};

function analysis(overrides: AnalysisInput = {}) {
  return {
    scored: {
      score: 60,
      band: "Good",
      drivers: [],
      suppressors: [],
      ...(overrides.scored as object | undefined),
    },
    timing: {
      timing_strength: "fair",
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
        pressure_regime: { label: "recently_stabilizing", score: 0 },
        wind_condition: { label: "light", score: 0.3 },
        light_cloud_condition: { label: "mixed_sky" },
        ...((overrides.norm as { normalized?: object } | undefined)
          ?.normalized ?? {}),
      },
    },
  } as any;
}

function auditSurfaceWindow(
  daily: { surface_allowed_today: boolean; surface_window: string },
): "on" | "off" | "watch" {
  if (!daily.surface_allowed_today || daily.surface_window === "closed") {
    return "off";
  }
  if (daily.surface_window === "clean") return "on";
  return "watch";
}

function auditReactionWindow(posture_band: string): "on" | "off" | "watch" {
  if (posture_band === "aggressive" || posture_band === "slightly_aggressive") {
    return "on";
  }
  if (posture_band === "suppressed" || posture_band === "slightly_suppressed") {
    return "off";
  }
  return "watch";
}

function auditFinesseWindow(presentation: string): "on" | "off" {
  return presentation === "subtle" ? "on" : "off";
}

function auditPaceBias(daily: {
  suppress_fast_presentations: boolean;
  posture_band: string;
}): "slow" | "fast" | "neutral" {
  if (daily.suppress_fast_presentations) return "slow";
  if (daily.posture_band === "aggressive") return "fast";
  return "neutral";
}

function simplifyWaterColumn(likely: string): "top" | "shallow" | "mid" | "bottom" {
  if (likely === "top" || likely === "high_top" || likely === "surface") return "top";
  if (likely === "high" || likely === "mid_high" || likely === "upper") return "shallow";
  if (likely === "mid") return "mid";
  return "bottom";
}

function summarize(caseDef: ScenarioCase): ScenarioSummary {
  const result = computeRecommenderV3(caseDef.request, analysis(caseDef.analysis));
  const dp = result.daily_payload;
  const rp = result.resolved_profile;
  return {
    id: caseDef.id,
    label: caseDef.label,
    species: result.species,
    context: result.context,
    region_key: result.region_key,
    month: result.month,
    water_clarity: result.water_clarity,
    daily_payload: {
      surface_window: auditSurfaceWindow(dp),
      reaction_window: dp.reaction_window ?? auditReactionWindow(dp.posture_band),
      finesse_window: auditFinesseWindow(rp.daily_preference.preferred_presence),
      pace_bias: rp.daily_preference.preferred_pace ?? auditPaceBias(dp),
    },
    resolved_profile: {
      final_water_column: simplifyWaterColumn(rp.daily_preference.preferred_column),
      final_mood: dp.posture_band,
      final_presentation_style: rp.daily_preference.preferred_presence,
    },
    lure_top3: result.lure_recommendations.map((candidate) => candidate.id),
    fly_top3: result.fly_recommendations.map((candidate) => candidate.id),
    lure_lanes: result.lure_recommendations.map((candidate) => candidate.tactical_lane),
    fly_lanes: result.fly_recommendations.map((candidate) => candidate.tactical_lane),
  };
}

function hasAny(ids: readonly string[], expected: readonly string[]): boolean {
  return expected.some((id) => ids.includes(id));
}

function hasNo(ids: readonly string[], blocked: readonly string[]): boolean {
  return blocked.every((id) => !ids.includes(id));
}

function isDeeperOrEqual(left: string, right: string): boolean {
  const order = ["top", "shallow", "mid", "bottom"];
  return order.indexOf(left) >= order.indexOf(right);
}

function formatScenario(summary: ScenarioSummary): string[] {
  return [
    `- ${summary.label}`,
    `  daily: surface=${summary.daily_payload.surface_window}, reaction=${summary.daily_payload.reaction_window}, finesse=${summary.daily_payload.finesse_window}, pace=${summary.daily_payload.pace_bias}`,
    `  resolved: water=${summary.resolved_profile.final_water_column}, mood=${summary.resolved_profile.final_mood}, presentation=${summary.resolved_profile.final_presentation_style}`,
    `  lure top 3: ${summary.lure_top3.join(", ")}`,
    `  fly top 3: ${summary.fly_top3.join(", ")}`,
  ];
}

const PAIRS: readonly PairAudit[] = [
  {
    id: "florida_may_overcast_vs_bright",
    label: "Florida May bass: overcast midday vs bright midday",
    left: {
      id: "fl_may_overcast_midday",
      label: "Florida May overcast midday",
      request: {
        location: {
          latitude: 28.54,
          longitude: -81.38,
          state_code: "FL",
          region_key: "florida",
          local_date: "2026-05-18",
          local_timezone: "America/New_York",
          month: 5,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 69, band: "Good" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.6 },
            light_cloud_condition: { label: "heavy_overcast" },
          },
        },
      },
    },
    right: {
      id: "fl_may_bright_midday",
      label: "Florida May bright midday",
      request: {
        location: {
          latitude: 28.54,
          longitude: -81.38,
          state_code: "FL",
          region_key: "florida",
          local_date: "2026-05-18",
          local_timezone: "America/New_York",
          month: 5,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 69, band: "Good" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.6 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Overcast midday opens a bounded surface lane",
        pass: (left.daily_payload.surface_window === "watch" ||
          left.daily_payload.surface_window === "on") &&
          (hasAny(left.lure_top3, ["hollow_body_frog"]) ||
            hasAny(left.fly_top3, ["frog_fly"])),
        detail:
          `left surface=${left.daily_payload.surface_window}; left lure=${left.lure_top3.join(", ")}; left fly=${left.fly_top3.join(", ")}`,
      },
      {
        label: "Bright midday suppresses frog options",
        pass: right.daily_payload.surface_window === "off" &&
          hasNo(right.lure_top3, ["hollow_body_frog"]) &&
          hasNo(right.fly_top3, ["frog_fly"]),
        detail:
          `right surface=${right.daily_payload.surface_window}; right lure=${right.lure_top3.join(", ")}; right fly=${right.fly_top3.join(", ")}`,
      },
    ],
  },
  {
    id: "largemouth_finesse_vs_reaction",
    label: "Largemouth daily posture: winter post-front finesse vs fall reaction",
    left: {
      id: "tx_winter_finesse",
      label: "Texas winter post-front bright day",
      request: {
        location: {
          latitude: 32.78,
          longitude: -96.8,
          state_code: "TX",
          region_key: "south_central",
          local_date: "2026-12-12",
          local_timezone: "America/Chicago",
          month: 12,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 46, band: "Fair" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "cold_limited",
          temperature_trend: "stable",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "rising_fast", score: -0.8 },
            wind_condition: { label: "calm", score: 0.7 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    right: {
      id: "tx_fall_reaction",
      label: "Texas productive windy fall day",
      request: {
        location: {
          latitude: 32.78,
          longitude: -96.8,
          state_code: "TX",
          region_key: "south_central",
          local_date: "2026-10-18",
          local_timezone: "America/Chicago",
          month: 10,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 74, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.8 },
            wind_condition: { label: "moderate", score: 0.8 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Winter post-front day resolves to finesse/slow without surface or search noise",
        pass: left.daily_payload.finesse_window === "on" &&
          left.daily_payload.pace_bias === "slow" &&
          left.lure_lanes.every((lane) => !["surface", "reaction_mid_column", "horizontal_search"].includes(lane)),
        detail: `left lanes=${left.lure_lanes.join(", ")}; pace=${left.daily_payload.pace_bias}`,
      },
      {
        label: "Productive fall day resolves to reaction/fast without bottom drag",
        pass: right.daily_payload.reaction_window === "on" &&
          right.daily_payload.pace_bias === "fast" &&
          right.lure_lanes.every((lane) => !["bottom_contact", "finesse_subtle"].includes(lane)),
        detail: `right lanes=${right.lure_lanes.join(", ")}; pace=${right.daily_payload.pace_bias}`,
      },
    ],
  },
  {
    id: "florida_july_lowlight_vs_heat",
    label: "Florida July bass: productive low-light vs heat-limited midday",
    left: {
      id: "fl_july_lowlight",
      label: "Florida July low-light shoulder window",
      request: {
        location: {
          latitude: 28.54,
          longitude: -81.38,
          state_code: "FL",
          region_key: "florida",
          local_date: "2026-07-22",
          local_timezone: "America/New_York",
          month: 7,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 74, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.8 },
            wind_condition: { label: "light", score: 0.65 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    right: {
      id: "fl_july_heat_midday",
      label: "Florida July bright heat-limited midday",
      request: {
        location: {
          latitude: 28.54,
          longitude: -81.38,
          state_code: "FL",
          region_key: "florida",
          local_date: "2026-07-22",
          local_timezone: "America/New_York",
          month: 7,
        },
        species: "largemouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 44, band: "Fair" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "heat_limited",
          temperature_trend: "stable",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "rising_fast", score: -0.7 },
            wind_condition: { label: "light", score: 0.4 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Good low-light summer day keeps surface and topwater available",
        pass: left.daily_payload.surface_window === "on" &&
          hasAny(left.lure_top3, ["buzzbait", "hollow_body_frog"]) &&
          hasAny(left.fly_top3, ["frog_fly", "mouse_fly"]),
        detail: `left surface=${left.daily_payload.surface_window}; lures=${left.lure_top3.join(", ")}; flies=${left.fly_top3.join(", ")}`,
      },
      {
        label: "Heat-limited midday shuts off surface and slows/deepens the day",
        pass: right.daily_payload.surface_window === "off" &&
          (right.daily_payload.finesse_window === "on" ||
            right.resolved_profile.final_presentation_style === "moderate" ||
            right.resolved_profile.final_presentation_style === "subtle") &&
          right.daily_payload.pace_bias !== "fast" &&
          isDeeperOrEqual(right.resolved_profile.final_water_column, left.resolved_profile.final_water_column) &&
          hasNo(right.lure_top3, ["buzzbait", "hollow_body_frog"]) &&
          hasNo(right.fly_top3, ["frog_fly", "mouse_fly"]),
        detail:
          `right water=${right.resolved_profile.final_water_column}; lures=${right.lure_top3.join(", ")}; flies=${right.fly_top3.join(", ")}`,
      },
    ],
  },
  {
    id: "smallmouth_surface_rotation",
    label: "Smallmouth summer lake: low-light surface window vs bright restraint",
    left: {
      id: "smallmouth_lowlight",
      label: "Great Lakes summer smallmouth low light",
      request: {
        location: {
          latitude: 44.97,
          longitude: -93.26,
          state_code: "MN",
          region_key: "great_lakes_upper_midwest",
          local_date: "2026-07-18",
          local_timezone: "America/Chicago",
          month: 7,
        },
        species: "smallmouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 73, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.5 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    right: {
      id: "smallmouth_bright",
      label: "Great Lakes summer smallmouth bright midday",
      request: {
        location: {
          latitude: 44.97,
          longitude: -93.26,
          state_code: "MN",
          region_key: "great_lakes_upper_midwest",
          local_date: "2026-07-18",
          local_timezone: "America/Chicago",
          month: 7,
        },
        species: "smallmouth_bass",
        context: "freshwater_lake_pond",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 54, band: "Fair" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "stable",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "recently_stabilizing", score: 0 },
            wind_condition: { label: "light", score: 0.4 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Low-light summer smallmouth allows surface options",
        pass: left.daily_payload.surface_window === "on" &&
          (left.lure_lanes.includes("surface") || left.fly_lanes.includes("fly_surface")),
        detail: `left lure lanes=${left.lure_lanes.join(", ")}; fly lanes=${left.fly_lanes.join(", ")}`,
      },
      {
        label: "Bright summer smallmouth removes surface options",
        pass: right.daily_payload.surface_window === "off" &&
          right.lure_lanes.every((lane) => lane !== "surface") &&
          right.fly_lanes.every((lane) => lane !== "fly_surface"),
        detail: `right lure lanes=${right.lure_lanes.join(", ")}; fly lanes=${right.fly_lanes.join(", ")}`,
      },
    ],
  },
  {
    id: "trout_mouse_vs_river_wind",
    label: "Northern California midsummer trout: mouse window vs strong river wind",
    left: {
      id: "trout_mouse_window",
      label: "Northern California midsummer trout mouse window",
      request: {
        location: {
          latitude: 41.7922,
          longitude: -122.6217,
          state_code: "CA",
          region_key: "northern_california",
          local_date: "2026-07-18",
          local_timezone: "America/Los_Angeles",
          month: 7,
        },
        species: "river_trout",
        context: "freshwater_river",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 72, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.65 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    right: {
      id: "trout_mouse_windy",
      label: "Northern California midsummer trout strong river wind",
      request: {
        location: {
          latitude: 41.7922,
          longitude: -122.6217,
          state_code: "CA",
          region_key: "northern_california",
          local_date: "2026-07-18",
          local_timezone: "America/Los_Angeles",
          month: 7,
        },
        species: "river_trout",
        context: "freshwater_river",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 72, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "strong", score: -0.8 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Mouse window truly elevates mouse fly",
        pass: left.daily_payload.surface_window === "on" &&
          left.fly_top3.includes("mouse_fly"),
        detail: `left surface=${left.daily_payload.surface_window}; left fly=${left.fly_top3.join(", ")}`,
      },
      {
        label: "Strong river wind removes the mouse lane",
        pass: ["watch", "off"].includes(right.daily_payload.surface_window) &&
          hasNo(right.fly_top3, ["mouse_fly"]),
        detail: `right surface=${right.daily_payload.surface_window}; right fly=${right.fly_top3.join(", ")}`,
      },
    ],
  },
  {
    id: "trout_warmup_vs_coldsnap",
    label: "Western midsummer trout: warmup vs cold snap",
    left: {
      id: "trout_warmup",
      label: "Western midsummer trout warming day",
      request: {
        location: {
          latitude: 44.42,
          longitude: -110.59,
          state_code: "WY",
          region_key: "mountain_west",
          local_date: "2026-07-18",
          local_timezone: "America/Denver",
          month: 7,
        },
        species: "river_trout",
        context: "freshwater_river",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 72, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.5 },
            light_cloud_condition: { label: "mixed_sky" },
          },
        },
      },
    },
    right: {
      id: "trout_coldsnap",
      label: "Western midsummer trout cold snap",
      request: {
        location: {
          latitude: 44.42,
          longitude: -110.59,
          state_code: "WY",
          region_key: "mountain_west",
          local_date: "2026-07-18",
          local_timezone: "America/Denver",
          month: 7,
        },
        species: "river_trout",
        context: "freshwater_river",
        water_clarity: "clear",
        env_data: {},
      },
      analysis: {
        scored: { score: 48, band: "Fair" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "cold_limited",
          temperature_trend: "cooling",
          temperature_shock: "sharp_cooldown",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "rising_fast", score: -0.8 },
            wind_condition: { label: "light", score: 0.5 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Warmup stays shallow and fast",
        pass: left.daily_payload.reaction_window === "on" &&
          left.daily_payload.pace_bias === "fast" &&
          left.resolved_profile.final_water_column === "shallow",
        detail:
          `left reaction=${left.daily_payload.reaction_window}; left pace=${left.daily_payload.pace_bias}; left water=${left.resolved_profile.final_water_column}`,
      },
      {
        label: "Cold snap slows and deepens with a hair-jig fallback",
        pass: right.daily_payload.finesse_window === "on" &&
          right.daily_payload.pace_bias !== "fast" &&
          isDeeperOrEqual(right.resolved_profile.final_water_column, left.resolved_profile.final_water_column) &&
          hasAny(right.lure_top3, ["hair_jig"]),
        detail:
          `right finesse=${right.daily_payload.finesse_window}; right pace=${right.daily_payload.pace_bias}; right water=${right.resolved_profile.final_water_column}; right lures=${right.lure_top3.join(", ")}`,
      },
    ],
  },
  {
    id: "pike_lowlight_vs_bright",
    label: "Northern pike summer: low-light surface opening vs bright restraint",
    left: {
      id: "pike_lowlight",
      label: "Northern pike summer low light",
      request: {
        location: {
          latitude: 46.87,
          longitude: -96.79,
          state_code: "MN",
          region_key: "great_lakes_upper_midwest",
          local_date: "2026-07-22",
          local_timezone: "America/Chicago",
          month: 7,
        },
        species: "pike_musky",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 72, band: "Good" },
        timing: { timing_strength: "good", highlighted_periods: [true, false, false, true] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "warming",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "falling_slow", score: 0.7 },
            wind_condition: { label: "light", score: 0.5 },
            light_cloud_condition: { label: "low_light" },
          },
        },
      },
    },
    right: {
      id: "pike_bright",
      label: "Northern pike summer bright midday",
      request: {
        location: {
          latitude: 46.87,
          longitude: -96.79,
          state_code: "MN",
          region_key: "great_lakes_upper_midwest",
          local_date: "2026-07-22",
          local_timezone: "America/Chicago",
          month: 7,
        },
        species: "pike_musky",
        context: "freshwater_lake_pond",
        water_clarity: "stained",
        env_data: {},
      },
      analysis: {
        scored: { score: 58, band: "Fair" },
        timing: { timing_strength: "fair", highlighted_periods: [false, false, false, false] },
        condition_context: {
          temperature_metabolic_context: "neutral",
          temperature_trend: "stable",
          temperature_shock: "none",
        },
        norm: {
          normalized: {
            pressure_regime: { label: "recently_stabilizing", score: 0 },
            wind_condition: { label: "light", score: 0.5 },
            light_cloud_condition: { label: "bright" },
          },
        },
      },
    },
    evaluate: (left, right) => [
      {
        label: "Low-light pike opens at least one surface-adjacent option",
        pass: left.daily_payload.surface_window === "on" &&
          (hasAny(left.lure_top3, ["walking_topwater"]) ||
            hasAny(left.fly_top3, ["frog_fly"])),
        detail: `left lures=${left.lure_top3.join(", ")}; left flies=${left.fly_top3.join(", ")}`,
      },
      {
        label: "Bright pike day removes surface-adjacent options",
        pass: right.daily_payload.surface_window === "off" &&
          hasNo(right.lure_top3, ["walking_topwater"]) &&
          hasNo(right.fly_top3, ["frog_fly"]),
        detail: `right lures=${right.lure_top3.join(", ")}; right flies=${right.fly_top3.join(", ")}`,
      },
    ],
  },
];

const pairResults: PairResult[] = PAIRS.map((pair) => {
  const left = summarize(pair.left);
  const right = summarize(pair.right);
  return {
    id: pair.id,
    label: pair.label,
    checks: pair.evaluate(left, right),
    left,
    right,
  };
});

const totalChecks = pairResults.reduce((sum, pair) => sum + pair.checks.length, 0);
const passedChecks = pairResults.reduce(
  (sum, pair) => sum + pair.checks.filter((check) => check.pass).length,
  0,
);

const report = {
  generated_at: new Date().toISOString(),
  total_pairs: pairResults.length,
  total_checks: totalChecks,
  passed_checks: passedChecks,
  failed_checks: totalChecks - passedChecks,
  pairs: pairResults,
};

const markdown = [
  "# V3 Daily Shift Audit",
  "",
  `Generated: ${report.generated_at}`,
  "",
  `Scenario pairs: ${report.total_pairs}`,
  `Checks passed: ${report.passed_checks}/${report.total_checks}`,
  "",
  "## Summary",
  "",
  ...pairResults.map((pair) => {
    const pairPass = pair.checks.every((check) => check.pass) ? "PASS" : "FAIL";
    return `- ${pairPass} ${pair.label}`;
  }),
  "",
  "## Pair Details",
  "",
  ...pairResults.flatMap((pair) => [
    `### ${pair.label}`,
    "",
    ...formatScenario(pair.left),
    ...formatScenario(pair.right),
    "",
    ...pair.checks.map((check) =>
      `- ${check.pass ? "PASS" : "FAIL"} ${check.label}: ${check.detail}`
    ),
    "",
  ]),
].join("\n");

await Deno.writeTextFile(OUTPUT_JSON, JSON.stringify(report, null, 2));
await Deno.writeTextFile(OUTPUT_MARKDOWN, `${markdown}\n`);

console.log(markdown);
