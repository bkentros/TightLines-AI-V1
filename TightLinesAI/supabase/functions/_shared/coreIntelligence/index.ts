// =============================================================================
// CORE INTELLIGENCE ENGINE — PUBLIC ENTRYPOINT
// runCoreIntelligence(env, waterType) → EngineOutput
//
// This is the single shared deterministic intelligence layer consumed by all
// AI features (How's Fishing, Recommender, Water Reader).
// Spec reference: core_intelligence_spec.md
// =============================================================================

import type {
  EnvironmentSnapshot,
  WaterType,
  EngineOutput,
  EngineEnvironmentSnapshot,
  DataQuality,
  ComponentStatus,
  WaterTempSource,
} from "./types.ts";

import { deriveDerivedVariables } from "./derivedVariables.ts";
import { computeRawScore, getOverallRating } from "./scoreEngine.ts";
import {
  detectColdFront,
  getRecoveryMultiplier,
  computeAdjustedScore,
} from "./recoveryModifier.ts";
import { computeTimeWindows } from "./timeWindowEngine.ts";
import { deriveBehavior } from "./behaviorInference.ts";

// ---------------------------------------------------------------------------
// Build the environment snapshot that the engine returns in its output
// ---------------------------------------------------------------------------

function buildEngineEnvironment(
  env: EnvironmentSnapshot,
  dv: ReturnType<typeof deriveDerivedVariables>,
  daysSinceFront: number
): EngineEnvironmentSnapshot {
  return {
    air_temp_f: env.air_temp_f,
    water_temp_f: dv.water_temp_f,
    water_temp_source: dv.water_temp_source,
    water_temp_zone: dv.water_temp_zone,
    wind_speed_mph: env.wind_speed_mph,
    wind_direction: env.wind_direction_label,
    wind_direction_deg: env.wind_direction_deg,
    cloud_cover_pct: env.cloud_cover_pct,
    pressure_mb: env.pressure_mb,
    pressure_change_rate_mb_hr: dv.pressure_change_rate_mb_hr,
    pressure_state: dv.pressure_state,
    precip_48hr_inches: env.precip_48hr_inches,
    precip_7day_inches: env.precip_7day_inches,
    precip_condition: dv.precip_condition,
    moon_phase: dv.moon_phase,
    moon_illumination_pct: env.moon_illumination_pct,
    solunar_state: dv.solunar_state,
    tide_phase_state: dv.tide_phase_state,
    tide_strength_state: dv.tide_strength_state,
    range_strength_pct: dv.range_strength_pct,
    light_condition: dv.light_condition,
    temp_trend_state: dv.temp_trend_state,
    temp_trend_direction_f: dv.temp_trend_direction_f,
    days_since_front: daysSinceFront,
    freshwater_subtype: dv.freshwater_subtype,
    seasonal_fish_behavior: dv.seasonal_fish_behavior,
    // New fields (Sweep 1):
    effective_latitude: dv.effective_latitude,
    latitude_band: dv.latitude_band,
    saltwater_seasonal_state: dv.saltwater_seasonal_state,
    altitude_ft: env.altitude_ft,
    severe_weather_alert: dv.severe_weather_alert,
    severe_weather_reasons: dv.severe_weather_reasons,
  };
}

// ---------------------------------------------------------------------------
// Build a plain-English front label — no jargon, no "recovery" framing
// ---------------------------------------------------------------------------

function buildFrontLabel(
  recoveryActive: boolean,
  daysSinceFront: number,
  frontSeverity: import("./types.ts").FrontSeverity | null
): string | null {
  if (!recoveryActive || frontSeverity === null) return null;

  const sevWord =
    frontSeverity === "mild" ? "mild" : frontSeverity === "severe" ? "strong" : "cold";

  if (daysSinceFront === 0) {
    return `A ${sevWord} cold front moved through — fish are tight-lipped today. Expect slow action.`;
  }
  if (daysSinceFront === 1) {
    return `Cold front came through yesterday. Fish still reluctant — try slow presentations near structure.`;
  }
  if (daysSinceFront === 2) {
    return `Two days post-front. Fish starting to stir — bite should improve, especially midday.`;
  }
  if (daysSinceFront === 3) {
    return `Three days after the front. Conditions stabilizing — expect a solid bite window today.`;
  }
  if (daysSinceFront >= 4) {
    return `Front has passed. Fish back to normal patterns — fish confidently.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Build data quality metadata
// ---------------------------------------------------------------------------

function buildDataQuality(
  componentStatus: Record<string, ComponentStatus>,
  dv: ReturnType<typeof deriveDerivedVariables>
): DataQuality {
  const missingVariables: string[] = [];
  const fallbackVariables: string[] = [];
  const notes: string[] = [];

  for (const [key, status] of Object.entries(componentStatus)) {
    if (status === "unavailable") missingVariables.push(key);
    if (status === "fallback_used") fallbackVariables.push(key);
  }

  if (dv.water_temp_source === "freshwater_air_model") {
    notes.push(
      "Freshwater temperature is estimated from recent air-temperature history. No direct measurement available."
    );
  }

  if (dv.cold_stun_status === "not_evaluable_missing_inputs") {
    notes.push("Cold stun alert could not be fully evaluated: missing water temperature history.");
  }

  if (dv.salinity_disruption_status === "not_evaluable_missing_inputs") {
    notes.push("Salinity disruption alert could not be evaluated: missing precipitation data.");
  }

  return {
    missing_variables: [...new Set(missingVariables)],
    fallback_variables: [...new Set(fallbackVariables)],
    notes,
  };
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — runCoreIntelligence
// ---------------------------------------------------------------------------

export function runCoreIntelligence(
  env: EnvironmentSnapshot,
  waterType: WaterType
): EngineOutput {
  const effectiveWaterType: WaterType = waterType;

  // Section 4 — Derived variables
  const dv = deriveDerivedVariables(env, effectiveWaterType);

  // Section 5 — Raw score
  const {
    weights,
    component_status,
    components,
    coverage_pct,
    reliability_tier,
    raw_score,
  } = computeRawScore(env, dv, effectiveWaterType);

  // Section 6 — Recovery modifier
  const { daysSinceFront, frontSeverity } = detectColdFront(env);
  const recoveryMultiplier = getRecoveryMultiplier(effectiveWaterType, daysSinceFront, frontSeverity);
  const adjustedScore = computeAdjustedScore(raw_score, recoveryMultiplier);

  // Section 5N — Rating
  const overallRating = getOverallRating(adjustedScore);

  // Section 7 — Time windows (with edge-case rule context)
  const ruleContext = {
    waterType: effectiveWaterType,
    water_temp_zone: dv.water_temp_zone,
    temp_trend_state: dv.temp_trend_state,
    pressure_state: dv.pressure_state,
    cloud_cover_pct: env.cloud_cover_pct,
    light_condition: dv.light_condition,
    recovery_active: daysSinceFront >= 0 && daysSinceFront <= 5,
    salinity_disruption_alert: dv.salinity_disruption_alert,
    range_strength_pct: dv.range_strength_pct,
    seasonal_fish_behavior: dv.seasonal_fish_behavior,
    freshwater_subtype: dv.freshwater_subtype,
  };
  const { best_windows, worst_windows } = computeTimeWindows(
    env,
    effectiveWaterType,
    dv.range_strength_pct,
    dv.pressure_state,
    env.cloud_cover_pct,
    ruleContext
  );

  // Section 8 — Behavior inference
  const behavior = deriveBehavior(
    effectiveWaterType,
    dv,
    adjustedScore,
    components as Record<string, number>,
    weights,
    env.wind_speed_mph
  );

  // Build final output
  const engineEnv = buildEngineEnvironment(env, dv, daysSinceFront);
  const dataQuality = buildDataQuality(component_status as Record<string, ComponentStatus>, dv);

  const recoveryActive = daysSinceFront >= 0 && daysSinceFront <= 5 && frontSeverity !== null;
  const frontLabel = buildFrontLabel(recoveryActive, daysSinceFront, frontSeverity);

  return {
    engine: "fishing_core_intelligence_v1",
    water_type: effectiveWaterType,
    location: {
      lat: env.lat,
      lon: env.lon,
      timezone: env.timezone,
      coastal: env.coastal,
      nearest_tide_station_id: env.nearest_tide_station_id,
    },
    environment: engineEnv,
    scoring: {
      weights,
      component_status: component_status as Record<string, any>,
      components: components as Record<string, number>,
      coverage_pct,
      reliability_tier,
      raw_score,
      recovery_multiplier: recoveryMultiplier,
      adjusted_score: adjustedScore,
      overall_rating: overallRating,
    },
    behavior,
    data_quality: dataQuality,
    alerts: {
      cold_stun_alert: dv.cold_stun_alert,
      cold_stun_status: dv.cold_stun_status,
      salinity_disruption_alert: dv.salinity_disruption_alert,
      salinity_disruption_status: dv.salinity_disruption_status,
      rapid_cooling_alert: dv.temp_trend_state === "rapid_cooling",
      recovery_active: recoveryActive,
      days_since_front: daysSinceFront,
      front_severity: frontSeverity,
      front_label: frontLabel,
      severe_weather_alert: dv.severe_weather_alert,
      severe_weather_reasons: dv.severe_weather_reasons,
    },
    time_windows: best_windows,
    worst_windows,
  };
}

// Re-export types for consumers
export type { EngineOutput, EnvironmentSnapshot, WaterType } from "./types.ts";
