// =============================================================================
// CORE INTELLIGENCE ENGINE — BEHAVIOR INFERENCE LAYER
// Implements Section 8 of core_intelligence_spec.md
// Converts score outputs into machine-readable fish-behavior states.
// =============================================================================

import type {
  WaterType,
  WaterTempZone,
  MetabolicState,
  AggressionState,
  FeedingTimer,
  PresentationDifficulty,
  PositioningBias,
  PositioningSecondaryTag,
  BehaviorOutput,
  DerivedVariables,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Section 8B — Metabolic State
// ---------------------------------------------------------------------------

export function deriveMetabolicState(
  zone: WaterTempZone | null,
  coldStunAlert: boolean
): MetabolicState {
  if (coldStunAlert) return "cold_stun";

  if (zone === null) return "building"; // conservative default

  const map: Record<WaterTempZone, MetabolicState> = {
    near_shutdown_cold: "shutdown",
    lethargic: "lethargic",
    transitional: "building",
    active_prime: "active",
    peak_aggression: "aggressive",
    thermal_stress_heat: "suppressed_heat",
  };

  return map[zone];
}

// ---------------------------------------------------------------------------
// Section 8C — Aggression State
// ---------------------------------------------------------------------------

export function deriveAggressionState(
  adjustedScore: number,
  metabolicState: MetabolicState,
  coldStunAlert: boolean
): AggressionState {
  if (coldStunAlert) return "shut_down";

  let base: AggressionState;
  if (adjustedScore <= 19) base = "shut_down";
  else if (adjustedScore <= 37) base = "negative";
  else if (adjustedScore <= 54) base = "cautious";
  else if (adjustedScore <= 71) base = "active";
  else if (adjustedScore <= 87) base = "strong_feed";
  else base = "peak_feed";

  // Override rules
  if (metabolicState === "shutdown") {
    const cap: AggressionState = "negative";
    return aggressionCap(base, cap);
  }
  if (metabolicState === "suppressed_heat") {
    const cap: AggressionState = "cautious";
    return aggressionCap(base, cap);
  }

  return base;
}

const AGGRESSION_ORDER: AggressionState[] = [
  "shut_down",
  "negative",
  "cautious",
  "active",
  "strong_feed",
  "peak_feed",
];

function aggressionCap(state: AggressionState, cap: AggressionState): AggressionState {
  const stateIdx = AGGRESSION_ORDER.indexOf(state);
  const capIdx = AGGRESSION_ORDER.indexOf(cap);
  return stateIdx > capIdx ? cap : state;
}

// ---------------------------------------------------------------------------
// Section 8D — Feeding Timer
// ---------------------------------------------------------------------------

export function deriveFeedingTimer(waterType: WaterType): FeedingTimer {
  if (waterType === "freshwater") return "light_solunar";
  if (waterType === "saltwater") return "tide_current";
  return "tide_plus_solunar";
}

// ---------------------------------------------------------------------------
// Section 8E — Presentation Difficulty
// ---------------------------------------------------------------------------

export function derivePresentationDifficulty(
  aggressionState: AggressionState
): PresentationDifficulty {
  const map: Record<AggressionState, PresentationDifficulty> = {
    shut_down: "finesse_only",
    negative: "difficult",
    cautious: "moderate",
    active: "standard",
    strong_feed: "favorable",
    peak_feed: "easiest_window",
  };
  return map[aggressionState];
}

// ---------------------------------------------------------------------------
// Section 8F — Positioning Bias
// ---------------------------------------------------------------------------

function derivePositioningBias(
  waterType: WaterType,
  dv: DerivedVariables,
  adjustedScore: number,
  windSpeedMph: number | null
): { primary: PositioningBias; secondary: PositioningSecondaryTag[] } {
  const secondaryTags: PositioningSecondaryTag[] = [];

  if (waterType === "freshwater") {
    let primary: PositioningBias;
    const seasonal = dv.seasonal_fish_behavior;

    const isDawnDusk =
      dv.light_condition === "dawn_window_clear" ||
      dv.light_condition === "dawn_window_overcast" ||
      dv.light_condition === "dusk_window_clear" ||
      dv.light_condition === "dusk_window_overcast";

    const isActiveMetabolic =
      dv.water_temp_zone === "active_prime" ||
      dv.water_temp_zone === "peak_aggression";

    const isLethargyOrShutdown =
      dv.water_temp_zone === "lethargic" ||
      dv.water_temp_zone === "near_shutdown_cold";

    if (isDawnDusk && isActiveMetabolic) {
      primary = "shallow_feeding_edges";
    } else if (
      dv.light_condition === "midday_full_sun" ||
      dv.pressure_state === "slowly_rising" ||
      dv.pressure_state === "rapidly_rising"
    ) {
      primary = "shade_depth_structure";
    } else if (isLethargyOrShutdown) {
      primary = "deepest_stable_water";
    } else if (seasonal === "deep_winter_survival") {
      primary = "deepest_stable_water";
    } else if (seasonal === "pre_spawn_buildup") {
      primary = "warming_flats_and_transitions";
    } else if (seasonal === "spawn_period") {
      primary = "warming_flats_and_transitions";
    } else if (seasonal === "post_spawn_recovery") {
      primary = "first_drop_and_transition_edges";
    } else if (seasonal === "summer_heat_suppression") {
      primary = "shade_depth_structure";
    } else if (seasonal === "fall_feed_buildup") {
      primary = isDawnDusk ? "shallow_feeding_edges" : "first_drop_and_transition_edges";
    } else if (seasonal === "late_fall_slowdown") {
      primary =
        dv.temp_trend_state === "rapid_warming" || dv.temp_trend_state === "warming"
          ? "warming_flats_and_transitions"
          : "deepest_stable_water";
    } else if (seasonal === "mild_winter_active") {
      primary = isDawnDusk ? "shallow_feeding_edges" : "warming_flats_and_transitions";
    } else if (dv.temp_trend_state === "rapid_warming") {
      primary = "warming_flats_and_transitions";
    } else if (dv.temp_trend_state === "rapid_cooling" && isActiveMetabolic) {
      primary = "first_drop_and_transition_edges";
    } else {
      primary = "shade_depth_structure";
    }

    // Secondary tags
    // windward_banks fires when wind is 5–12 mph (component_pct = 92, >= 85 threshold per spec 8F)
    if (windSpeedMph !== null && windSpeedMph >= 5 && windSpeedMph <= 12) {
      secondaryTags.push("windward_banks");
    }
    if (isDawnDusk) {
      secondaryTags.push("low_light_surface_window");
    }

    return { primary, secondary: secondaryTags };
  }

  if (waterType === "saltwater") {
    let primary: PositioningBias;
    const isDawnDusk =
      dv.light_condition === "dawn_window_clear" ||
      dv.light_condition === "dawn_window_overcast" ||
      dv.light_condition === "dusk_window_clear" ||
      dv.light_condition === "dusk_window_overcast";

    if (dv.cold_stun_alert) {
      primary = "warmest_available_refuge";
    } else if (dv.water_temp_zone === "thermal_stress_heat") {
      primary = "cooler_deeper_current_refuge";
    } else if (
      dv.tide_phase_state === "slack" ||
      dv.tide_strength_state === "minimal_movement"
    ) {
      primary = "deeper_edges_channels_adjacent_structure";
    } else if (dv.saltwater_seasonal_state === "sw_cold_inactive") {
      primary = "deepest_stable_water";
    } else if (dv.saltwater_seasonal_state === "sw_summer_heat_stress") {
      primary = isDawnDusk ? "current_breaks_cuts_passes_flats" : "cooler_deeper_current_refuge";
    } else {
      primary = "current_breaks_cuts_passes_flats";
    }

    if (dv.wind_tide_relation === "wind_with_tide") {
      secondaryTags.push("windward_bait_push");
    }
    if (
      dv.light_condition === "night" &&
      (dv.tide_strength_state === "strong_movement" ||
        dv.tide_strength_state === "above_average_movement")
    ) {
      secondaryTags.push("night_current_window");
    }

    return { primary, secondary: secondaryTags };
  }

  // Brackish
  let primary: PositioningBias;

  if (dv.salinity_disruption_alert) {
    primary = "higher_salinity_inlets_and_passes";
  } else if (
    dv.light_condition === "midday_full_sun" &&
    (dv.pressure_state === "stable" ||
      dv.pressure_state === "slowly_rising" ||
      dv.pressure_state === "rapidly_rising")
  ) {
    primary = "deeper_drains_dropoffs_and_shade";
  } else if (dv.temp_trend_state === "rapid_warming") {
    primary = "warming_flats_adjacent_to_escape_depth";
  } else {
    primary = "creek_mouths_oyster_bars_tidal_cuts";
  }

  const isDawnDusk =
    dv.light_condition === "dawn_window_clear" ||
    dv.light_condition === "dawn_window_overcast" ||
    dv.light_condition === "dusk_window_clear" ||
    dv.light_condition === "dusk_window_overcast";

  secondaryTags.push("wind_driven_shoreline_push"); // conservative add for brackish wind sensitivity
  if (dv.solunar_state === "within_major_window") {
    secondaryTags.push("solunar_overlay_active");
  }

  return { primary, secondary: secondaryTags };
}

// ---------------------------------------------------------------------------
// Section 8G — Dominant Drivers
// ---------------------------------------------------------------------------

interface DriverCandidate {
  key: string;
  score: number;
  isHardSuppressor: boolean;
}

function computeDominantDrivers(
  dv: DerivedVariables,
  componentScores: Record<string, number>,
  componentWeights: Record<string, number>
): { positive: string[]; negative: string[] } {
  const maxScores: Record<string, number> = {};
  for (const [key, weight] of Object.entries(componentWeights)) {
    maxScores[key] = weight;
  }

  const positive: DriverCandidate[] = [];
  const negative: DriverCandidate[] = [];

  for (const [key, score] of Object.entries(componentScores)) {
    const weight = componentWeights[key] ?? 0;
    const maxScore = maxScores[key] ?? weight;
    const pct = maxScore > 0 ? score / maxScore : 0;

    const isHardPositive = pct >= 0.75;
    const isHardNegative = pct <= 0.35;

    const isHardSuppressor =
      dv.cold_stun_alert ||
      dv.salinity_disruption_alert ||
      dv.water_temp_zone === "near_shutdown_cold" ||
      dv.water_temp_zone === "thermal_stress_heat" ||
      dv.pressure_state === "rapidly_rising";

    if (isHardPositive) {
      positive.push({ key, score, isHardSuppressor: false });
    }
    if (isHardNegative || (isHardSuppressor && key === "water_temp_zone")) {
      negative.push({ key, score, isHardSuppressor });
    }
  }

  // Mandatory hard suppressors must always appear when active
  const mandatoryNegatives: string[] = [];
  if (dv.cold_stun_alert) mandatoryNegatives.push("cold_stun_alert");
  if (dv.salinity_disruption_alert) mandatoryNegatives.push("salinity_disruption_alert");
  if (dv.water_temp_zone === "near_shutdown_cold")
    mandatoryNegatives.push("near_shutdown_cold");
  if (dv.water_temp_zone === "thermal_stress_heat")
    mandatoryNegatives.push("thermal_stress_heat");
  if (dv.pressure_state === "rapidly_rising")
    mandatoryNegatives.push("rapidly_rising_pressure");

  // Sort positives by score descending
  positive.sort((a, b) => b.score - a.score);

  // Sort negatives: hard suppressors first, then by score ascending
  negative.sort((a, b) => {
    if (a.isHardSuppressor && !b.isHardSuppressor) return -1;
    if (!a.isHardSuppressor && b.isHardSuppressor) return 1;
    return a.score - b.score;
  });

  const topPositive = positive
    .slice(0, 3)
    .map((d) => d.key);

  const topNegative = [
    ...new Set([
      ...mandatoryNegatives,
      ...negative.slice(0, 3).map((d) => d.key),
    ]),
  ].slice(0, 3);

  return { positive: topPositive, negative: topNegative };
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — deriveBehavior
// ---------------------------------------------------------------------------

export function deriveBehavior(
  waterType: WaterType,
  dv: DerivedVariables,
  adjustedScore: number,
  componentScores: Record<string, number>,
  componentWeights: Record<string, number>,
  windSpeedMph: number | null
): BehaviorOutput {
  const metabolicState = deriveMetabolicState(dv.water_temp_zone, dv.cold_stun_alert);
  const aggressionState = deriveAggressionState(adjustedScore, metabolicState, dv.cold_stun_alert);
  const feedingTimer = deriveFeedingTimer(waterType);
  const presentationDifficulty = derivePresentationDifficulty(aggressionState);
  const { primary: positioningBias, secondary: secondaryTags } = derivePositioningBias(
    waterType,
    dv,
    adjustedScore,
    windSpeedMph
  );

  const { positive: domPositive, negative: domNegative } = computeDominantDrivers(
    dv,
    componentScores,
    componentWeights
  );

  return {
    metabolic_state: metabolicState,
    aggression_state: aggressionState,
    feeding_timer: feedingTimer,
    presentation_difficulty: presentationDifficulty,
    positioning_bias: positioningBias,
    secondary_positioning_tags: secondaryTags,
    dominant_positive_drivers: domPositive,
    dominant_negative_drivers: domNegative,
  };
}
