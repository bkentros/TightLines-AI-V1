import type {
  FishBehaviorOutput,
  RefinementTag,
  RecommenderRunInput,
  RelationTagId,
  ScoredId,
  WaterClarity,
} from "./contracts.ts";
import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { EngineContext } from "../howFishingEngine/contracts/mod.ts";
import type { BehaviorAccumulator, ClimateBand, SeasonPhase } from "./baseline.ts";
import {
  activityFromIndex,
  addToScore,
  chaseRadiusFromIndex,
  clamp,
  daypartLabel,
  highlightedDayparts,
  strikeZoneFromIndex,
  topScoredIds,
  uniq,
} from "./helpers.ts";

export type BehaviorResolution = {
  fish_behavior: FishBehaviorOutput;
  depth_scores: Array<ScoredId<FishBehaviorOutput["position"]["depth_lanes"][number]["id"]>>;
  relation_scores: Array<ScoredId<RelationTagId>>;
  style_flags: string[];
  active_modifiers: string[];
  inferred_clarity: WaterClarity;
  light_profile: "bright" | "mixed" | "low_light";
  current_profile: "slack" | "moving" | "strong";
  best_dayparts: string[];
  month_groups: string[];
  season_phase: SeasonPhase;
  climate_band: ClimateBand;
  confidence_reasons: string[];
};

function inferClarity(
  analysis: SharedConditionAnalysis,
  input: RecommenderRunInput,
): WaterClarity {
  const user = input.refinements.water_clarity;
  if (user) return user;

  const runoff = analysis.norm.normalized.runoff_flow_disruption?.score ?? 0;
  const precip = analysis.norm.normalized.precipitation_disruption?.score ?? 0;
  if (runoff <= -1 || precip <= -1.25) return "dirty";
  if (runoff < 0 || precip < 0) return "stained";
  const light = analysis.norm.normalized.light_cloud_condition?.score ?? 0;
  return light < 0 ? "clear" : "stained";
}

function currentProfileFor(
  analysis: SharedConditionAnalysis,
  context: EngineContext,
): "slack" | "moving" | "strong" {
  if (context !== "coastal" && context !== "coastal_flats_estuary") {
    const runoff = analysis.norm.normalized.runoff_flow_disruption?.score ?? 0;
    if (runoff <= -1) return "strong";
    if (runoff < 0) return "moving";
    return "slack";
  }
  const tideScore = analysis.norm.normalized.tide_current_movement?.score ?? 0;
  if (tideScore >= 1.25) return "strong";
  if (tideScore > 0) return "moving";
  return "slack";
}

function monthGroups(seasonPhase: SeasonPhase, month: number): string[] {
  const groups = ["all_year", seasonPhase];
  if (month >= 5 && month <= 9) groups.push("warm_months");
  if (month >= 10 || month <= 2 || seasonPhase === "winter_hold" || seasonPhase === "late_fall") {
    groups.push("cool_months");
  }
  if (month >= 6 && month <= 8) groups.push("topwater_window");
  if (month >= 9 && month <= 11) groups.push("baitfish_push");
  return groups;
}

function applyHabitatTag(
  acc: BehaviorAccumulator,
  tag: RefinementTag,
): void {
  switch (tag) {
    case "grass":
      addToScore(acc.relation_scores, "vegetation_oriented", 1.2);
      addToScore(acc.relation_scores, "grass_edge_oriented", 0.9);
      break;
    case "wood":
    case "docks":
    case "dock":
      addToScore(acc.relation_scores, "cover_oriented", 1);
      addToScore(acc.relation_scores, "structure_oriented", 0.8);
      break;
    case "rock":
    case "breakline":
      addToScore(acc.relation_scores, "depth_transition_oriented", 0.9);
      addToScore(acc.relation_scores, "structure_oriented", 0.8);
      break;
    case "shade":
      addToScore(acc.relation_scores, "shade_oriented", 1.2);
      break;
    case "seam":
    case "current_seam":
      addToScore(acc.relation_scores, "seam_oriented", 1.2);
      addToScore(acc.relation_scores, "current_break_oriented", 0.8);
      break;
    case "eddy":
      addToScore(acc.relation_scores, "current_break_oriented", 1);
      addToScore(acc.relation_scores, "hole_oriented", 0.5);
      break;
    case "hole":
      addToScore(acc.relation_scores, "hole_oriented", 1.1);
      break;
    case "riffle_run":
      addToScore(acc.relation_scores, "seam_oriented", 0.8);
      break;
    case "undercut_bank":
      addToScore(acc.relation_scores, "undercut_bank_oriented", 1.2);
      addToScore(acc.relation_scores, "shade_oriented", 0.5);
      break;
    case "wood_boulder":
      addToScore(acc.relation_scores, "structure_oriented", 0.9);
      addToScore(acc.relation_scores, "current_break_oriented", 0.8);
      break;
    case "channel_edge":
      addToScore(acc.relation_scores, "channel_related", 1.2);
      addToScore(acc.relation_scores, "depth_transition_oriented", 0.8);
      break;
    case "point":
      addToScore(acc.relation_scores, "point_oriented", 1.2);
      break;
    case "shoreline_edge":
      addToScore(acc.relation_scores, "edge_oriented", 0.9);
      addToScore(acc.relation_scores, "shoreline_cruising", 0.6);
      break;
    case "drain":
      addToScore(acc.relation_scores, "drain_oriented", 1.2);
      break;
    case "grass_edge":
      addToScore(acc.relation_scores, "grass_edge_oriented", 1.3);
      addToScore(acc.relation_scores, "vegetation_oriented", 0.9);
      break;
    case "pothole":
      addToScore(acc.relation_scores, "pothole_oriented", 1.2);
      break;
    case "trough":
      addToScore(acc.relation_scores, "trough_oriented", 1.2);
      break;
    case "oyster":
      addToScore(acc.relation_scores, "oyster_bar_oriented", 1.2);
      addToScore(acc.relation_scores, "structure_oriented", 0.5);
      break;
    case "marsh_edge":
      addToScore(acc.relation_scores, "marsh_edge_oriented", 1.3);
      addToScore(acc.relation_scores, "shoreline_cruising", 0.5);
      break;
  }
}

function addModifier(modifiers: string[], id: string): void {
  if (!modifiers.includes(id)) modifiers.push(id);
}

export function applyDailyModifiers(
  baseline: BehaviorAccumulator,
  analysis: SharedConditionAnalysis,
  input: RecommenderRunInput,
): BehaviorResolution {
  const acc = baseline;
  const modifiers: string[] = [];
  const confidenceReasons: string[] = [];
  const context = input.request.context;

  const temp = analysis.norm.normalized.temperature;
  const coldFreshwaterDay = temp != null &&
    (temp.band_label === "very_cold" || temp.band_label === "cool") &&
    (context === "freshwater_lake_pond" || context === "freshwater_river");
  if (temp) {
    if (temp.band_label === "very_cold") {
      addToScore(acc.depth_scores, "deep", 0.9);
      addToScore(acc.depth_scores, "bottom_oriented", 1);
      addToScore(acc.depth_scores, "very_shallow", -0.8);
      addToScore(acc.depth_scores, "shallow", -0.5);
      addToScore(acc.depth_scores, "upper_column", -0.9);
      acc.activity_index -= 0.7;
      acc.strike_index -= 0.5;
      acc.chase_index -= 0.5;
      acc.style_flags.add("finesse_best");
      acc.style_flags.add("slow_bottom_best");
      addModifier(modifiers, "very_cold_band");
    } else if (temp.band_label === "cool") {
      addToScore(acc.depth_scores, "deep", 0.8);
      addToScore(acc.depth_scores, "bottom_oriented", 0.9);
      addToScore(acc.depth_scores, "lower_column", 0.6);
      addToScore(acc.depth_scores, "mid_depth", 0.35);
      addToScore(acc.depth_scores, "very_shallow", -0.6);
      addToScore(acc.depth_scores, "shallow", -0.4);
      addToScore(acc.depth_scores, "upper_column", -0.4);
      addToScore(acc.relation_scores, "depth_transition_oriented", 0.5);
      addToScore(acc.relation_scores, "structure_oriented", 0.3);
      acc.activity_index -= 0.45;
      acc.strike_index -= 0.35;
      acc.chase_index -= 0.4;
      acc.style_flags.add("finesse_best");
      acc.style_flags.add("slow_bottom_best");
      addModifier(modifiers, "cool_temperature_band");
    } else if (temp.band_label === "optimal") {
      acc.activity_index += 0.5;
      acc.strike_index += 0.4;
      acc.chase_index += 0.4;
      addModifier(modifiers, "optimal_temperature_band");
    } else if (temp.band_label === "very_warm") {
      addToScore(acc.depth_scores, "deep", 0.8);
      addToScore(acc.depth_scores, "lower_column", 0.7);
      addToScore(acc.relation_scores, "shade_oriented", 0.9);
      addToScore(acc.relation_scores, "current_break_oriented", 0.6);
      acc.activity_index -= 0.35;
      acc.strike_index -= 0.25;
      acc.style_flags.add("short_feeding_windows");
      addModifier(modifiers, "very_warm_band");
    }

    if (temp.trend_label === "warming") {
      if (
        acc.season_phase === "winter_hold" ||
        acc.season_phase === "spring_transition"
      ) {
        const conservativeColdWindow =
          acc.season_phase === "winter_hold" ||
          temp.band_label === "very_cold" ||
          temp.band_label === "cool";
        addToScore(acc.depth_scores, "mid_depth", conservativeColdWindow ? 0.35 : 0.2);
        addToScore(acc.depth_scores, "shallow", conservativeColdWindow ? 0.35 : 0.9);
        addToScore(acc.depth_scores, "upper_column", conservativeColdWindow ? 0.15 : 0.6);
        acc.activity_index += conservativeColdWindow ? 0.25 : 0.6;
        acc.strike_index += conservativeColdWindow ? 0.15 : 0.4;
        acc.chase_index += conservativeColdWindow ? 0.1 : 0.4;
        if (!conservativeColdWindow && temp.band_label === "optimal") {
          acc.style_flags.add("willing_to_chase");
        }
        addModifier(
          modifiers,
          conservativeColdWindow ? "warming_transition_window" : "warming_transition_push",
        );
      } else {
        addToScore(acc.depth_scores, "mid_depth", 0.4);
        addToScore(acc.relation_scores, "shade_oriented", 0.4);
        acc.style_flags.add("short_feeding_windows");
        addModifier(modifiers, "warming_late_season_caution");
      }
    } else if (temp.trend_label === "cooling") {
      if (acc.season_phase === "summer_heat") {
        acc.activity_index += 0.25;
        acc.strike_index += 0.15;
        acc.style_flags.add("horizontal_search_best");
        addModifier(modifiers, "cooling_relief_window");
      } else {
        addToScore(acc.depth_scores, "lower_column", 0.4);
        acc.activity_index -= 0.2;
        acc.strike_index -= 0.15;
        addModifier(modifiers, "cooling_slowdown");
      }
    }

    if (temp.shock_label === "sharp_cooldown") {
      addToScore(acc.depth_scores, "bottom_oriented", 0.9);
      addToScore(acc.depth_scores, "deep", 0.8);
      acc.activity_index -= 0.6;
      acc.strike_index -= 0.5;
      acc.chase_index -= 0.4;
      acc.style_flags.add("finesse_best");
      acc.style_flags.add("slow_bottom_best");
      addModifier(modifiers, "sharp_cooldown");
    } else if (temp.shock_label === "sharp_warmup") {
      if (
        acc.season_phase === "winter_hold" ||
        acc.season_phase === "spring_transition"
      ) {
        const conservativeColdWindow =
          acc.season_phase === "winter_hold" ||
          temp.band_label === "very_cold" ||
          temp.band_label === "cool";
        addToScore(acc.depth_scores, conservativeColdWindow ? "mid_depth" : "shallow", 0.35);
        if (!conservativeColdWindow) addToScore(acc.depth_scores, "shallow", 0.25);
        acc.activity_index += conservativeColdWindow ? 0.15 : 0.3;
        acc.strike_index += conservativeColdWindow ? 0.1 : 0.2;
        acc.chase_index += conservativeColdWindow ? 0.05 : 0.15;
        addModifier(
          modifiers,
          conservativeColdWindow ? "sharp_warmup_cold_window" : "sharp_warmup_positive",
        );
      } else {
        addToScore(acc.relation_scores, "shade_oriented", 0.5);
        acc.style_flags.add("short_feeding_windows");
        addModifier(modifiers, "sharp_warmup_caution");
      }
    }
  } else {
    confidenceReasons.push("Temperature trend confidence is limited.");
  }

  const pressureScore = analysis.norm.normalized.pressure_regime?.score ?? 0;
  if (pressureScore >= 0.75) {
    acc.activity_index += 0.35;
    acc.strike_index += 0.2;
    acc.chase_index += 0.2;
    acc.style_flags.add("reaction_best");
    addModifier(modifiers, "positive_pressure_regime");
  } else if (pressureScore <= -0.75) {
    addToScore(acc.relation_scores, "cover_oriented", 0.6);
    addToScore(acc.relation_scores, "current_break_oriented", 0.5);
    acc.activity_index -= 0.35;
    acc.strike_index -= 0.3;
    acc.style_flags.add("finesse_best");
    addModifier(modifiers, "negative_pressure_regime");
  }

  const windScore = analysis.norm.normalized.wind_condition?.score ?? 0;
  if (windScore >= 0.5) {
    acc.activity_index += coldFreshwaterDay ? 0.1 : 0.2;
    acc.chase_index += coldFreshwaterDay ? 0.05 : 0.15;
    if (!coldFreshwaterDay) {
      acc.style_flags.add("horizontal_search_best");
    }
    if (context === "freshwater_lake_pond") {
      addToScore(acc.relation_scores, "edge_oriented", coldFreshwaterDay ? 0.4 : 0.6);
      if (coldFreshwaterDay) {
        addToScore(acc.relation_scores, "depth_transition_oriented", 0.35);
      } else {
        addToScore(acc.relation_scores, "point_oriented", 0.4);
      }
    } else if (context === "freshwater_river") {
      addToScore(acc.relation_scores, "seam_oriented", coldFreshwaterDay ? 0.25 : 0.4);
      if (coldFreshwaterDay) addToScore(acc.relation_scores, "hole_oriented", 0.25);
    } else if (context === "coastal") {
      addToScore(acc.relation_scores, "point_oriented", 0.6);
      addToScore(acc.relation_scores, "current_break_oriented", 0.5);
    } else {
      addToScore(acc.relation_scores, "grass_edge_oriented", 0.6);
      addToScore(acc.relation_scores, "drain_oriented", 0.5);
    }
    addModifier(modifiers, "fishable_wind_window");
  } else if (windScore <= -0.75) {
    addToScore(acc.relation_scores, "cover_oriented", 0.4);
    acc.strike_index -= 0.1;
    addModifier(modifiers, "exposed_wind_penalty");
  }

  const lightScore = analysis.norm.normalized.light_cloud_condition?.score ?? 0;
  let lightProfile: "bright" | "mixed" | "low_light" = "mixed";
  if (lightScore >= 0.75) {
    lightProfile = "low_light";
    if (coldFreshwaterDay) {
      addToScore(acc.depth_scores, "mid_depth", 0.2);
      addToScore(acc.depth_scores, "shallow", 0.15);
      addToScore(acc.relation_scores, "shoreline_cruising", 0.2);
      acc.activity_index += 0.1;
      acc.strike_index += 0.05;
      addModifier(modifiers, "cold_low_light_window");
    } else {
      addToScore(acc.depth_scores, "upper_column", 0.8);
      addToScore(acc.depth_scores, "shallow", 0.7);
      addToScore(acc.relation_scores, "shoreline_cruising", 0.5);
      if (
        context === "freshwater_lake_pond" &&
        (acc.season_phase === "summer_pattern" || acc.season_phase === "summer_heat")
      ) {
        addToScore(acc.depth_scores, "shallow", 0.35);
        addToScore(acc.depth_scores, "upper_column", 0.45);
        addToScore(acc.depth_scores, "deep", -0.35);
        addToScore(acc.depth_scores, "lower_column", -0.2);
      }
      acc.activity_index += 0.35;
      acc.strike_index += 0.25;
      acc.style_flags.add("topwater_window");
      addModifier(modifiers, "low_light_window");
    }
  } else if (lightScore <= -0.75) {
    lightProfile = "bright";
    addToScore(acc.depth_scores, "lower_column", 0.7);
    addToScore(acc.relation_scores, "shade_oriented", 0.8);
    addToScore(acc.relation_scores, "cover_oriented", 0.5);
    acc.strike_index -= 0.2;
    acc.style_flags.add("tight_to_cover");
    addModifier(modifiers, "bright_light_tightening");
  }

  const precipState = analysis.norm.normalized.precipitation_disruption;
  const precipScore = precipState?.score ?? 0;
  if (precipState?.label === "light_mist") {
    acc.activity_index += 0.1;
    addToScore(acc.depth_scores, "shallow", 0.1);
    addModifier(modifiers, "light_precip_activation");
  } else if (precipScore <= -0.8) {
    addToScore(acc.relation_scores, "cover_oriented", 0.4);
    acc.strike_index -= 0.2;
    addModifier(modifiers, "precip_disruption");
  }

  const runoffScore = analysis.norm.normalized.runoff_flow_disruption?.score ?? 0;
  if (context === "freshwater_river" && runoffScore <= -0.6) {
    addToScore(acc.relation_scores, "seam_oriented", 0.9);
    addToScore(acc.relation_scores, "current_break_oriented", 0.9);
    addToScore(acc.relation_scores, "hole_oriented", 0.7);
    addToScore(acc.depth_scores, "lower_column", 0.5);
    acc.strike_index -= 0.15;
    acc.style_flags.add("current_drift_best");
    addModifier(modifiers, "runoff_soft_water_shift");
  }

  const tideScore = analysis.norm.normalized.tide_current_movement?.score ?? 0;
  const tideState = input.request.environment.tide_movement_state ?? "";
  if (context === "coastal" || context === "coastal_flats_estuary") {
    if (tideScore > 0) {
      acc.activity_index += 0.45;
      acc.strike_index += 0.2;
      acc.chase_index += 0.2;
      if (context === "coastal") {
        addToScore(acc.relation_scores, "channel_related", 0.8);
        addToScore(acc.relation_scores, "point_oriented", 0.7);
        addToScore(acc.relation_scores, "current_break_oriented", 0.7);
      } else {
        addToScore(acc.relation_scores, "drain_oriented", 0.7);
        addToScore(acc.relation_scores, "grass_edge_oriented", 0.7);
        addToScore(acc.relation_scores, "oyster_bar_oriented", 0.5);
      }
      addModifier(modifiers, "moving_tide_window");
    } else {
      acc.style_flags.add("short_feeding_windows");
      addModifier(modifiers, "slack_tide_window");
    }

    if (tideState.includes("incoming") || tideState.includes("rising")) {
      if (context === "coastal_flats_estuary") {
        addToScore(acc.depth_scores, "very_shallow", 0.8);
        addToScore(acc.depth_scores, "shallow", 0.7);
        addToScore(acc.relation_scores, "marsh_edge_oriented", 0.9);
        addToScore(acc.relation_scores, "grass_edge_oriented", 0.7);
        acc.style_flags.add("flooding_window_best");
        addModifier(modifiers, "flood_tide_shallow_push");
      }
    } else if (tideState.includes("outgoing") || tideState.includes("falling")) {
      if (context === "coastal_flats_estuary") {
        addToScore(acc.relation_scores, "drain_oriented", 1);
        addToScore(acc.relation_scores, "trough_oriented", 0.8);
        addToScore(acc.relation_scores, "pothole_oriented", 0.7);
        acc.style_flags.add("draining_window_best");
        addModifier(modifiers, "falling_tide_drain_focus");
      }
    }
  }

  if (input.refinements.vegetation === "heavy") {
    addToScore(acc.relation_scores, "vegetation_oriented", 1.1);
    addToScore(acc.relation_scores, "grass_edge_oriented", 0.7);
    addToScore(acc.relation_scores, "cover_oriented", 0.4);
    addModifier(modifiers, "heavy_vegetation_refinement");
  } else if (input.refinements.vegetation === "moderate") {
    addToScore(acc.relation_scores, "vegetation_oriented", 0.8);
    addModifier(modifiers, "vegetation_refinement");
  }

  for (const tag of input.refinements.habitat_tags ?? []) {
    applyHabitatTag(acc, tag);
  }
  if ((input.refinements.habitat_tags ?? []).length > 0) {
    addModifier(modifiers, "manual_habitat_refinement");
  }

  if (input.refinements.platform === "bank") {
    addToScore(acc.relation_scores, "shoreline_cruising", 0.4);
    addToScore(acc.relation_scores, "edge_oriented", 0.4);
    addModifier(modifiers, "bank_access_bias");
  }

  const clarity = inferClarity(analysis, input);
  if (clarity === "dirty") {
    acc.strike_index -= 0.1;
    acc.style_flags.add("finesse_best");
    addModifier(modifiers, "dirty_water_profile");
  } else if (clarity === "clear") {
    addToScore(acc.relation_scores, "shade_oriented", 0.3);
    addModifier(modifiers, "clear_water_profile");
  }

  const depthScores = topScoredIds(acc.depth_scores, Object.keys(acc.depth_scores) as Array<keyof typeof acc.depth_scores>, 5);
  const relationScores = topScoredIds(acc.relation_scores, Object.keys(acc.relation_scores) as Array<keyof typeof acc.relation_scores>, 7);
  const visibleDepthScores = depthScores.filter((item) => item.score > 0).slice(0, 4);
  const visibleRelationScores = relationScores.filter((item) => item.score > 0).slice(0, 6);

  if (analysis.norm.reliability !== "high") {
    confidenceReasons.push(
      analysis.norm.reliability === "medium"
        ? "Shared condition data is usable but not fully complete."
        : "Shared condition data is limited, so the recommendation stays broad.",
    );
  }
  if (!input.refinements.water_clarity) {
    confidenceReasons.push("Water clarity was inferred rather than confirmed.");
  }
  if ((input.refinements.habitat_tags ?? []).length === 0) {
    confidenceReasons.push("Habitat position is broader because no spot details were selected.");
  }
  if (
    (context === "coastal" || context === "coastal_flats_estuary") &&
    !analysis.norm.available_variables.includes("tide_current_movement")
  ) {
    confidenceReasons.push("Tide/current detail is thin for this coastal recommendation.");
  }

  const bestDayparts = highlightedDayparts(analysis.timing.highlighted_periods).map(daypartLabel);

  const styleFlags = uniq(
    [...acc.style_flags].sort((a, b) => a.localeCompare(b)),
  );
  if (acc.activity_index >= 0.6 && acc.chase_index >= 0.4) {
    styleFlags.push("willing_to_chase");
  }
  if (lightProfile === "low_light") {
    styleFlags.push("topwater_window");
  }

  return {
    fish_behavior: {
      baseline_profile_id: acc.baseline_profile_id,
      position: {
        depth_lanes: visibleDepthScores.length > 0 ? visibleDepthScores : depthScores.slice(0, 4),
        relation_tags: visibleRelationScores.length > 0
          ? visibleRelationScores
          : relationScores.slice(0, 6),
      },
      behavior: {
        activity: activityFromIndex(acc.activity_index),
        style_flags: uniq(styleFlags),
        strike_zone: strikeZoneFromIndex(acc.strike_index),
        chase_radius: chaseRadiusFromIndex(acc.chase_index),
      },
      forage: {
        baitfish_bias: clamp(acc.forage.baitfish_bias, 0, 1.5),
        crustacean_bias: clamp(acc.forage.crustacean_bias, 0, 1.5),
        insect_bias: clamp(acc.forage.insect_bias, 0, 1.5),
        ...(acc.forage.amphibian_surface_bias != null
          ? {
              amphibian_surface_bias: clamp(
                acc.forage.amphibian_surface_bias,
                0,
                1.2,
              ),
            }
          : {}),
      },
    },
    depth_scores: depthScores,
    relation_scores: relationScores,
    style_flags: uniq(styleFlags),
    active_modifiers: modifiers,
    inferred_clarity: clarity,
    light_profile: lightProfile,
    current_profile: currentProfileFor(analysis, context),
    best_dayparts: bestDayparts.length > 0 ? bestDayparts : ["Dawn", "Evening"],
    month_groups: monthGroups(acc.season_phase, parseInt(input.request.local_date.slice(5, 7), 10) || 1),
    season_phase: acc.season_phase,
    climate_band: acc.climate_band,
    confidence_reasons: uniq(confidenceReasons),
  };
}
