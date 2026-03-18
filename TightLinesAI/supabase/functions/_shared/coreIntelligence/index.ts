// =============================================================================
// [LEGACY — NOT ON HOW'S FISHING PATH]
// How's Fishing uses _shared/howFishingEngine/ only. Do not extend this for HSF.
// engineV2: golden-fixture tests. engineV3: legacy; not invoked by how-fishing.
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
  DailyOutlook,
  BlockResult,
  OverallRating,
} from "./types.ts";

import { deriveDerivedVariables } from "./derivedVariables.ts";
import { computeRawScore, getOverallRating, type SeasonalContext } from "./scoreEngine.ts";
import {
  detectColdFront,
  getRecoveryMultiplier,
  computeAdjustedScore,
} from "./recoveryModifier.ts";
import { computeTimeWindows, computeAllBlocks } from "./timeWindowEngine.ts";
import { deriveBehavior } from "./behaviorInference.ts";
import { getCoastalBand } from "./seasonalProfiles.ts";

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
    water_temp_confidence: dv.water_temp_confidence,
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

  const sevDesc =
    frontSeverity === "mild" ? "A mild" :
    frontSeverity === "severe" ? "A strong" :
    "A";

  if (daysSinceFront === 0) {
    return `${sevDesc} cold front moved through — fish are tight-lipped today. Expect slow action.`;
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
      `Freshwater temperature is estimated from recent air-temperature history. Confidence: ${dv.water_temp_confidence !== null ? Math.round(dv.water_temp_confidence * 100) : "unknown"}%.`
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
// Daily Composite Score — weighted average of all 48 blocks
// Safe blocks weight 1.0, unsafe blocks (sub-15°F air temp) weight 0.1
// ---------------------------------------------------------------------------

function computeDailyComposite(allBlocks: BlockResult[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const b of allBlocks) {
    const w = b.fishable ? 1.0 : 0.1;
    weightedSum += b.score * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

// ---------------------------------------------------------------------------
// Fishable hours extraction — contiguous fishable block ranges as HH:MM pairs
// ---------------------------------------------------------------------------

function extractFishableHours(allBlocks: BlockResult[]): Array<{ start: string; end: string }> {
  const ranges: Array<{ start: string; end: string }> = [];
  let rangeStart: string | null = null;
  let rangeEnd: string | null = null;

  for (const b of allBlocks) {
    if (b.fishable) {
      if (rangeStart === null) rangeStart = b.start_local;
      rangeEnd = b.end_local;
    } else {
      if (rangeStart !== null && rangeEnd !== null) {
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = null;
        rangeEnd = null;
      }
    }
  }
  if (rangeStart !== null && rangeEnd !== null) {
    ranges.push({ start: rangeStart, end: rangeEnd });
  }
  return ranges;
}

// ---------------------------------------------------------------------------
// Deterministic Summary Line — one-liner from engine state (no LLM)
// ---------------------------------------------------------------------------

function generateSummaryLine(
  adjustedScore: number,
  overallRating: OverallRating,
  dv: ReturnType<typeof deriveDerivedVariables>,
  recoveryActive: boolean,
  daysSinceFront: number,
  developingFront: boolean
): string {
  // Critical alerts first
  if (dv.cold_stun_alert) {
    return "Cold stun conditions — fish are immobile. Extremely tough fishing.";
  }
  if (dv.severe_weather_alert) {
    return "Severe weather active. Safety first — fishing not recommended.";
  }
  if (dv.salinity_disruption_alert) {
    return "Heavy freshwater influx disrupting salinity. Fish relocating to deeper, saltier water.";
  }

  // Recovery state
  if (recoveryActive && daysSinceFront <= 1) {
    return "Cold front impact — fish are hunkered down. Slow presentations near structure.";
  }
  if (recoveryActive && daysSinceFront === 2) {
    return "Post-front recovery underway. Bite improving, especially during midday warming.";
  }
  if (developingFront) {
    return "Pressure dropping — front approaching. Fish may feed aggressively before it hits.";
  }

  // Temperature-driven
  if (dv.water_temp_zone === "near_shutdown_cold") {
    return "Near-shutdown cold water. Target the warmest midday window with slow presentations.";
  }
  if (dv.water_temp_zone === "thermal_stress_heat") {
    return "Thermal stress — fish seeking cooler water. Best action at dawn, dusk, and overnight.";
  }

  // Score-based
  if (adjustedScore >= 80) {
    const drivers: string[] = [];
    if (dv.pressure_state === "slowly_falling" || dv.pressure_state === "rapidly_falling") drivers.push("falling pressure");
    if (dv.temp_trend_state === "rapid_warming" || dv.temp_trend_state === "warming") drivers.push("warming trend");
    if (dv.water_temp_zone === "active_prime" || dv.water_temp_zone === "peak_aggression") drivers.push("prime water temps");
    const driverStr = drivers.length > 0 ? ` — ${drivers.join(", ")}.` : ".";
    return `Outstanding conditions${driverStr} Fish should be active and aggressive.`;
  }
  if (adjustedScore >= 65) {
    return "Good conditions for an active bite. Multiple factors working in your favor.";
  }
  if (adjustedScore >= 50) {
    return "Decent conditions. Fish are around but may require some patience and finesse.";
  }
  if (adjustedScore >= 35) {
    return "Challenging day. Focus on the best time windows and fish slow presentations.";
  }
  return "Tough conditions. If you go, keep expectations low and target structure carefully.";
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

  // Build seasonal context from timestamp and derived variables
  const localDate = new Date(
    new Date(env.timestamp_utc).getTime() + env.tz_offset_hours * 3600 * 1000
  );
  const seasonalCtx: SeasonalContext = {
    month: localDate.getUTCMonth() + 1,
    dayOfMonth: localDate.getUTCDate(),
    year: localDate.getUTCFullYear(),
    latBand: dv.latitude_band,
    effectiveLatitude: dv.effective_latitude,
  };

  // Section 5 — Raw score (now with seasonal context)
  const {
    weights,
    component_status,
    components,
    coverage_pct,
    reliability_tier,
    raw_score,
    seasonal_baseline_score,
    daily_opportunity_score,
    water_temp_confidence,
  } = computeRawScore(env, dv, effectiveWaterType, seasonalCtx);

  // Section 6 — Recovery modifier
  const { daysSinceFront, frontSeverity, developing_front } = detectColdFront(env);
  const recoveryMultiplier = getRecoveryMultiplier(effectiveWaterType, daysSinceFront, frontSeverity);
  const adjustedScore = computeAdjustedScore(raw_score, recoveryMultiplier);

  // Section 5N — Rating
  const overallRating = getOverallRating(adjustedScore);

  // Section 7 — Time windows (with edge-case rule context)
  const recoveryActive = daysSinceFront >= 0 && daysSinceFront <= 5 && frontSeverity !== null;
  const ruleContext = {
    waterType: effectiveWaterType,
    water_temp_zone: dv.water_temp_zone,
    temp_trend_state: dv.temp_trend_state,
    pressure_state: dv.pressure_state,
    cloud_cover_pct: env.cloud_cover_pct,
    light_condition: dv.light_condition,
    recovery_active: recoveryActive,
    salinity_disruption_alert: dv.salinity_disruption_alert,
    range_strength_pct: dv.range_strength_pct,
    seasonal_fish_behavior: dv.seasonal_fish_behavior,
    freshwater_subtype: dv.freshwater_subtype,
    saltwater_seasonal_state: dv.saltwater_seasonal_state,
  };

  // Compute all 48 blocks anchored to daily raw_score (Gaussian baselines)
  const allBlocks = computeAllBlocks(
    env,
    effectiveWaterType,
    dv.range_strength_pct,
    dv.pressure_state,
    env.cloud_cover_pct,
    dv.water_temp_zone,
    ruleContext,
    raw_score  // anchor blocks to daily condition quality
  );

  // Merge blocks into contiguous time windows (no re-computation)
  const { best_windows, fair_windows, worst_windows } = computeTimeWindows(
    allBlocks
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

  // Component debug detail (percentage + score for each component)
  const component_detail: Record<string, { pct: number; score: number; weight: number }> = {};
  for (const [key, score] of Object.entries(components)) {
    const weight = (weights as Record<string, number>)[key] ?? 0;
    const pct = weight > 0 ? Math.round(((score as number) / weight) * 100) : 0;
    component_detail[key] = { pct, score: score as number, weight };
  }

  // Build daily outlook
  const dailyScore = computeDailyComposite(allBlocks);
  const dailyRating = getOverallRating(dailyScore);
  const summaryLine = generateSummaryLine(
    adjustedScore, overallRating, dv, recoveryActive, daysSinceFront, developing_front
  );
  const fishableHours = extractFishableHours(allBlocks);

  const daily_outlook: DailyOutlook = {
    daily_score: dailyScore,
    overall_rating: dailyRating,
    summary_line: summaryLine,
    fishable_hours: fishableHours,
  };

  // Build final output
  const engineEnv = buildEngineEnvironment(env, dv, daysSinceFront);
  const dataQuality = buildDataQuality(component_status as Record<string, ComponentStatus>, dv);

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
      seasonal_baseline_score,
      daily_opportunity_score,
      water_temp_confidence,
      component_detail,  // NEW — debug info for consistency auditing
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
      developing_front,
      severe_weather_alert: dv.severe_weather_alert,
      severe_weather_reasons: dv.severe_weather_reasons,
    },
    time_windows: [...best_windows, ...fair_windows],
    fair_windows,
    worst_windows,
    daily_outlook,
    all_blocks: allBlocks,
  };
}

// Re-export types for consumers
export type { EngineOutput, EnvironmentSnapshot, WaterType } from "./types.ts";
