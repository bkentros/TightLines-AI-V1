import type {
  FishBehaviorOutput,
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
  seasonal_basis: string[];
  daily_adjustments: string[];
  clarity_adjustments: string[];
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
  return "stained";
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

function monthGroups(seasonPhase: SeasonPhase, month: number, climateBand: ClimateBand): string[] {
  const groups = ["all_year", seasonPhase];
  const warmClimate =
    climateBand === "warm" || climateBand === "tropical" || climateBand === "arid";

  if (warmClimate ? (month >= 3 && month <= 10) : (month >= 5 && month <= 9)) {
    groups.push("warm_months");
  }
  if (month >= 10 || month <= 2 || seasonPhase === "winter_hold" || seasonPhase === "late_fall") {
    groups.push("cool_months");
  }
  if (warmClimate ? (month >= 4 && month <= 9) : (month >= 6 && month <= 8)) {
    groups.push("topwater_window");
  }
  if (month >= 9 && month <= 11) groups.push("baitfish_push");
  return groups;
}

function addModifier(modifiers: string[], id: string): void {
  if (!modifiers.includes(id)) modifiers.push(id);
}

function seasonalBasisNotes(
  seasonPhase: SeasonPhase,
  climateBand: ClimateBand,
  context: EngineContext,
): string[] {
  const notes = [`Season phase: ${seasonPhase.replaceAll("_", " ")}`];
  if (climateBand === "cold" || climateBand === "alpine" || climateBand === "maritime") {
    notes.push("Cold-climate seasonal logic stays conservative until the seasonal hold clears.");
  }
  switch (seasonPhase) {
    case "winter_hold":
      notes.push("Seasonal bias keeps fish slower and lower in the water column.");
      break;
    case "spring_transition":
      notes.push("Seasonal transition starts sliding fish shallower, but not into full chase mode.");
      break;
    case "warm_transition":
      notes.push("Warm transition opens broader feeding lanes and more willing fish behavior.");
      break;
    case "summer_pattern":
      notes.push("Summer pattern stabilizes fish positioning around repeatable cover and lane choices.");
      break;
    case "summer_heat":
      notes.push("Summer heat biases fish toward shade, deeper lanes, and shorter feeding windows.");
      break;
    case "fall_feed":
      notes.push("Fall feed expands chase radius and rewards baitfish-style search tools.");
      break;
    case "late_fall":
      notes.push("Late-fall logic pulls fish back toward slower, lower, more deliberate setups.");
      break;
  }
  if (context === "coastal_flats_estuary") {
    notes.push("Flats logic favors drains, grass edges, potholes, troughs, and marsh lanes over broad inshore channels.");
  } else if (context === "coastal") {
    notes.push("Coastal inshore logic favors channels, points, and moving-water edges.");
  } else if (context === "freshwater_river") {
    notes.push("River logic keeps fish tied to seams, current breaks, and softer flow lanes.");
  } else {
    notes.push("Lake and pond logic centers on edges, cover, vegetation, and depth transitions.");
  }
  return notes;
}

export function applyDailyModifiers(
  baseline: BehaviorAccumulator,
  analysis: SharedConditionAnalysis,
  input: RecommenderRunInput,
): BehaviorResolution {
  const acc = baseline;
  const modifiers: string[] = [];
  const dailyAdjustments: string[] = [];
  const clarityAdjustments: string[] = [];
  const confidenceReasons: string[] = [];
  const context = input.request.context;
  const seasonalBasis = seasonalBasisNotes(acc.season_phase, acc.climate_band, context);

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
        addToScore(acc.depth_scores, "very_shallow", 0.55);
        addToScore(acc.depth_scores, "shallow", 0.35);
        addToScore(acc.depth_scores, "upper_column", 0.45);
        addToScore(acc.depth_scores, "deep", -0.35);
        addToScore(acc.depth_scores, "lower_column", -0.2);
        addToScore(acc.relation_scores, "vegetation_oriented", 0.45);
        addToScore(acc.relation_scores, "grass_edge_oriented", 0.7);
        addToScore(acc.relation_scores, "shoreline_cruising", 0.25);
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

  const clarity = inferClarity(analysis, input);
  if (clarity === "dirty") {
    acc.strike_index -= 0.15;
    acc.chase_index -= 0.1;
    addToScore(acc.relation_scores, "cover_oriented", 0.35);
    addToScore(acc.relation_scores, "shoreline_cruising", 0.25);
    acc.style_flags.add("loud_profile_window");
    acc.style_flags.add("bulk_profile_window");
    addModifier(modifiers, "dirty_water_profile");
    clarityAdjustments.push("Dirty water pushes the recommendation toward stronger silhouettes, more vibration, and easier-to-find presentations.");
  } else if (clarity === "clear") {
    addToScore(acc.relation_scores, "shade_oriented", 0.3);
    acc.strike_index -= 0.05;
    acc.style_flags.add("natural_profile_window");
    acc.style_flags.add("finesse_best");
    addModifier(modifiers, "clear_water_profile");
    clarityAdjustments.push("Clear water tightens the recommendation toward natural profiles, subtler actions, and cleaner presentations.");
  } else {
    acc.style_flags.add("contrast_profile_window");
    clarityAdjustments.push("Stained water supports moderate contrast and balanced profile choices.");
  }

  // ── Seasonal activity caps ──────────────────────────────────────────
  // Prevent daily modifiers from pushing fish behavior beyond what the
  // season phase biologically supports.
  const SEASON_ACTIVITY_CAPS: Partial<Record<SeasonPhase, number>> = {
    winter_hold: 0.2,
    late_fall: 0.6,
    spring_transition: 0.8,
  };
  const seasonCap = SEASON_ACTIVITY_CAPS[acc.season_phase];
  if (seasonCap != null && acc.activity_index > seasonCap) {
    acc.activity_index = seasonCap;
    addModifier(modifiers, "seasonal_activity_cap");
  }
  if (seasonCap != null && acc.chase_index > seasonCap) {
    acc.chase_index = seasonCap;
  }
  if (seasonCap != null && acc.strike_index > seasonCap + 0.15) {
    acc.strike_index = seasonCap + 0.15;
  }

  // Strip topwater flags in cold-climate cold seasons
  const coldClimateEarlySeason =
    (acc.season_phase === "winter_hold" ||
      acc.season_phase === "late_fall" ||
      acc.season_phase === "spring_transition") &&
    (acc.climate_band === "cold" ||
      acc.climate_band === "alpine" ||
      acc.climate_band === "maritime");
  if (coldClimateEarlySeason) {
    acc.style_flags.delete("topwater_window");
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
    seasonal_basis: seasonalBasis,
    daily_adjustments: uniq(dailyAdjustments.length > 0 ? dailyAdjustments : modifiers.filter((id) =>
      id !== "dirty_water_profile" && id !== "clear_water_profile"
    )),
    clarity_adjustments: uniq(clarityAdjustments),
    active_modifiers: modifiers,
    inferred_clarity: clarity,
    light_profile: lightProfile,
    current_profile: currentProfileFor(analysis, context),
    best_dayparts: bestDayparts.length > 0 ? bestDayparts : ["Dawn", "Evening"],
    month_groups: monthGroups(acc.season_phase, parseInt(input.request.local_date.slice(5, 7), 10) || 1, acc.climate_band),
    season_phase: acc.season_phase,
    climate_band: acc.climate_band,
    confidence_reasons: uniq(confidenceReasons),
  };
}
