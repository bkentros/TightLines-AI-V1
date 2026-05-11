import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import {
  hourlyPointsTo24ArrayForLocalDate,
} from "../../howFishingEngine/request/hourlyLocalDay.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type {
  RecommendationGoal,
  RecommenderRequest,
  WaterClarity,
} from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type {
  ConditionTag,
  RecommenderV4Species,
  SeasonalRowV4,
} from "../v4/contracts.ts";

export type DailyActivityLevel =
  | "suppressed"
  | "neutral"
  | "active"
  | "high_opportunity";

export type DailySurfaceGate = "closed" | "caution" | "open";

export type DailyLightMode =
  | "low_light"
  | "mixed"
  | "bright"
  | "glare"
  | "unknown";

export type DailyWindMode = "calm" | "breezy" | "windy" | "unknown";

export type DailyThermalMode =
  | "cold_slow"
  | "warming"
  | "stable"
  | "cooling_or_shock"
  | "heat_limited"
  | "unknown";

export type DailyWaterMovementMode =
  | "stable"
  | "elevated_or_dirty"
  | "blown_out"
  | "not_applicable"
  | "unknown";

export type DailyPressureMode =
  | "falling"
  | "stable"
  | "rising"
  | "unstable"
  | "unknown";

export type DailyScenarioTag = ConditionTag;

export type DailyScenario = {
  local_date: string;
  local_timezone: string;
  species: RecommenderV4Species;
  region_key: RegionKey;
  month: number;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  hows_score: number;
  activity_level: DailyActivityLevel;
  surface_daily_gate: DailySurfaceGate;
  surface_daily_reason_codes: string[];
  light_mode: DailyLightMode;
  wind_mode: DailyWindMode;
  daylight_wind_mph: number | null;
  thermal_mode: DailyThermalMode;
  water_movement_mode: DailyWaterMovementMode;
  pressure_mode: DailyPressureMode;
  scenario_tags: DailyScenarioTag[];
  missing_inputs: string[];
  confidence: "high" | "medium" | "low";
};

function speciesToV4(
  species: SpeciesGroup | RecommenderV4Species,
): RecommenderV4Species {
  switch (species) {
    case "largemouth_bass":
    case "smallmouth_bass":
      return species;
    case "pike_musky":
    case "northern_pike":
      return "northern_pike";
    case "river_trout":
    case "trout":
      return "trout";
    default:
      throw new Error(`daily scenario: unsupported species '${species}'`);
  }
}

function windToMph(speed: number | null, windUnitRaw: unknown): number | null {
  if (speed == null || !Number.isFinite(speed)) return null;
  const unit = String(windUnitRaw ?? "mph").toLowerCase();
  return unit.includes("km") ? speed * 0.621371 : speed;
}

function readWeather(
  envData: Record<string, unknown>,
): Record<string, unknown> | null {
  return envData.weather && typeof envData.weather === "object"
    ? envData.weather as Record<string, unknown>
    : null;
}

function computeDaylightWindMph(args: {
  env_data: Record<string, unknown>;
  local_date: string;
  local_timezone: string;
}): number | null {
  const { env_data, local_date, local_timezone } = args;
  const weather = readWeather(env_data);
  const windUnit = weather?.wind_speed_unit;
  const hourlyRaw = env_data.hourly_wind_speed;
  const hourlyPts = Array.isArray(hourlyRaw) && hourlyRaw.length > 0
    ? hourlyRaw as Array<{ time_utc: string; value: number }>
    : null;

  if (hourlyPts != null) {
    const arr = hourlyPointsTo24ArrayForLocalDate(
      hourlyPts,
      local_date,
      local_timezone,
    );
    if (arr != null && arr.length === 24) {
      let sum = 0;
      let count = 0;
      for (let hour = 5; hour <= 21; hour++) {
        const mph = windToMph(arr[hour]!, windUnit);
        if (mph != null && Number.isFinite(mph)) {
          sum += mph;
          count++;
        }
      }
      if (count === 17) return sum / count;
    }
  }

  const normalizedWindMph = env_data.wind_speed_mph;
  if (
    typeof normalizedWindMph === "number" &&
    Number.isFinite(normalizedWindMph)
  ) {
    return normalizedWindMph;
  }

  return null;
}

function windModeFromMph(daylightWindMph: number | null): DailyWindMode {
  if (daylightWindMph == null) return "unknown";
  if (daylightWindMph < 6) return "calm";
  if (daylightWindMph <= 14) return "breezy";
  return "windy";
}

function activityLevelFromScore(score: number): DailyActivityLevel {
  if (score <= 35) return "suppressed";
  if (score >= 70) return "active";
  return "neutral";
}

function lightModeFromLabel(label: string | null | undefined): DailyLightMode {
  switch (label) {
    case "low_light":
    case "heavy_overcast":
      return "low_light";
    case "mixed":
      return "mixed";
    case "bright":
      return "bright";
    case "glare":
      return "glare";
    default:
      return "unknown";
  }
}

function thermalModeFromLabels(args: {
  month: number;
  activityLevel: DailyActivityLevel;
  temperatureBand: string | null | undefined;
  temperatureTrend: string | null | undefined;
  temperatureShock: string | null | undefined;
  temperatureFinalScore: number | null | undefined;
}): DailyThermalMode {
  const finalScore = typeof args.temperatureFinalScore === "number" &&
      Number.isFinite(args.temperatureFinalScore)
    ? args.temperatureFinalScore
    : null;
  const summer = args.month >= 6 && args.month <= 8;

  // The band describes the actual daily thermal lane. Let hard metabolic
  // extremes win before trend/shock so hot cooldowns don't read as cold fishing.
  if (args.temperatureBand === "very_warm") return "heat_limited";
  if (args.temperatureBand === "very_cold") return "cold_slow";

  if (args.temperatureBand === "cool") {
    const winter = args.month === 12 || args.month <= 2;
    const meaningfullyCold = finalScore == null || finalScore <= -0.75;
    if (
      winter ||
      (!summer && meaningfullyCold) ||
      (!summer && args.activityLevel === "suppressed" && (finalScore ?? -1) < 0)
    ) {
      return "cold_slow";
    }
  }

  if (args.temperatureShock != null && args.temperatureShock !== "none") {
    return "cooling_or_shock";
  }
  if (args.temperatureTrend === "cooling") return "cooling_or_shock";
  if (
    args.temperatureTrend === "warming" &&
    args.activityLevel !== "suppressed" &&
    finalScore != null &&
    finalScore >= 0 &&
    (args.temperatureBand === "near_optimal" ||
      args.temperatureBand === "optimal" ||
      args.temperatureBand === "warm")
  ) {
    return "warming";
  }
  if (args.temperatureBand != null || args.temperatureTrend != null) {
    return "stable";
  }
  return "unknown";
}

function waterMovementModeFromLabel(args: {
  context: EngineContext;
  runoffLabel: string | null | undefined;
}): DailyWaterMovementMode {
  if (args.context !== "freshwater_river") return "not_applicable";
  switch (args.runoffLabel) {
    case "perfect_clear":
    case "stable":
      return "stable";
    case "slightly_elevated":
    case "elevated":
      return "elevated_or_dirty";
    case "blown_out":
      return "blown_out";
    default:
      return "unknown";
  }
}

function pressureModeFromLabel(
  label: string | null | undefined,
): DailyPressureMode {
  if (label == null) return "unknown";
  if (label.startsWith("falling_")) return "falling";
  if (label.startsWith("rising_")) return "rising";
  if (label === "stable_neutral" || label === "recently_stabilizing") {
    return "stable";
  }
  if (label === "volatile") return "unstable";
  return "unknown";
}

function seasonalSurfaceAllowed(row: SeasonalRowV4): boolean {
  return row.column_range.includes("surface") &&
    row.surface_seasonally_possible;
}

function surfaceGate(args: {
  seasonalSurfaceAllowed: boolean;
  windMode: DailyWindMode;
  activityLevel: DailyActivityLevel;
  lightMode: DailyLightMode;
  daylightWindMph: number | null;
}): { gate: DailySurfaceGate; reasonCodes: string[] } {
  const reasons: string[] = [];
  if (!args.seasonalSurfaceAllowed) {
    reasons.push("seasonal_surface_closed");
    return { gate: "closed", reasonCodes: reasons };
  }
  reasons.push("seasonal_surface_open");

  if (args.daylightWindMph == null || args.windMode === "unknown") {
    reasons.push("missing_wind_surface_closed");
    return { gate: "closed", reasonCodes: reasons };
  }

  if (args.daylightWindMph > 14) {
    reasons.push("wind_over_14_surface_closed");
    return { gate: "closed", reasonCodes: reasons };
  }

  if (args.activityLevel === "suppressed") {
    reasons.push("suppressed_activity_surface_closed");
    return { gate: "closed", reasonCodes: reasons };
  }

  if (args.windMode === "calm") {
    reasons.push("calm_surface_open");
    if (args.lightMode === "low_light") reasons.push("low_light_surface_open");
    return { gate: "open", reasonCodes: reasons };
  }

  if (args.windMode === "breezy" && args.lightMode === "low_light") {
    reasons.push("breezy_low_light_surface_open");
    return { gate: "open", reasonCodes: reasons };
  }

  reasons.push("surface_caution_mixed_daily_conditions");
  return { gate: "caution", reasonCodes: reasons };
}

function addTag(
  tags: DailyScenarioTag[],
  tag: DailyScenarioTag,
): void {
  if (!tags.includes(tag)) tags.push(tag);
}

function confidenceFrom(args: {
  base: "high" | "medium" | "low";
  missingInputs: readonly string[];
}): "high" | "medium" | "low" {
  if (args.base === "low") return "low";
  if (args.missingInputs.length >= 2) return "low";
  if (args.base === "medium" || args.missingInputs.length === 1) {
    return "medium";
  }
  return "high";
}

export function buildDailyScenario(args: {
  req: RecommenderRequest;
  analysis: SharedConditionAnalysis;
  seasonalRow: SeasonalRowV4;
}): DailyScenario {
  const { req, analysis, seasonalRow } = args;
  const species = speciesToV4(req.species);
  const howsScore = analysis.scored.score;
  const activityLevel = activityLevelFromScore(howsScore);
  const daylightWindMph = computeDaylightWindMph({
    env_data: req.env_data,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
  });
  const windMode = windModeFromMph(daylightWindMph);
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ??
    null;
  const lightMode = lightModeFromLabel(lightLabel);
  const temp = analysis.norm.normalized.temperature;
  const thermalMode = thermalModeFromLabels({
    month: req.location.month,
    activityLevel,
    temperatureBand: temp?.band_label,
    temperatureTrend: temp?.trend_label,
    temperatureShock: temp?.shock_label,
    temperatureFinalScore: temp?.final_score,
  });
  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ??
    null;
  const waterMovementMode = waterMovementModeFromLabel({
    context: req.context,
    runoffLabel,
  });
  const pressureMode = pressureModeFromLabel(
    analysis.norm.normalized.pressure_regime?.label,
  );

  const missingInputs: string[] = [];
  if (daylightWindMph == null) missingInputs.push("wind");
  if (lightMode === "unknown") missingInputs.push("light");
  if (thermalMode === "unknown") missingInputs.push("temperature");
  if (req.context === "freshwater_river" && waterMovementMode === "unknown") {
    missingInputs.push("runoff");
  }

  const seasonalAllowsSurface = seasonalSurfaceAllowed(seasonalRow);
  const surface = surfaceGate({
    seasonalSurfaceAllowed: seasonalAllowsSurface,
    windMode,
    activityLevel,
    lightMode,
    daylightWindMph,
  });

  const tags: DailyScenarioTag[] = [];
  if (surface.gate === "open" && windMode === "calm") {
    addTag(tags, "calm_surface");
  }
  if (surface.gate === "open" && lightMode === "low_light") {
    addTag(tags, "low_light_surface");
  }
  if (
    windMode === "windy" ||
    (windMode === "breezy" && activityLevel !== "suppressed")
  ) {
    addTag(tags, "wind_reaction");
  }
  if (
    (req.water_clarity === "dirty" || req.water_clarity === "stained") &&
    (windMode === "breezy" || windMode === "windy" ||
      waterMovementMode === "elevated_or_dirty" ||
      waterMovementMode === "blown_out")
  ) {
    addTag(tags, "dirty_vibration");
  }
  if (
    req.water_clarity === "clear" &&
    (lightMode === "bright" || lightMode === "glare" ||
      (windMode === "calm" && activityLevel !== "active"))
  ) {
    addTag(tags, "clear_subtle");
  }
  if (thermalMode === "cold_slow") {
    addTag(tags, "cold_slow");
  }
  if (thermalMode === "warming") addTag(tags, "warming_search");
  if (thermalMode === "heat_limited") addTag(tags, "heat_finesse");
  if (
    species === "trout" &&
    req.context === "freshwater_river" &&
    (waterMovementMode === "elevated_or_dirty" ||
      waterMovementMode === "blown_out")
  ) {
    addTag(tags, "runoff_streamer");
  }
  if (
    req.context === "freshwater_river" &&
    (waterMovementMode === "elevated_or_dirty" ||
      waterMovementMode === "blown_out")
  ) {
    addTag(tags, "current_swing");
  }
  if (
    windMode === "breezy" &&
    seasonalRow.primary_forage === "baitfish" &&
    seasonalRow.column_range.some((column) =>
      column === "mid" || column === "upper"
    )
  ) {
    addTag(tags, "open_water_search");
  }

  return {
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
    species,
    region_key: req.location.region_key,
    month: req.location.month,
    water_type: req.context,
    water_clarity: req.water_clarity,
    recommendation_goal: req.recommendation_goal,
    hows_score: howsScore,
    activity_level: activityLevel,
    surface_daily_gate: surface.gate,
    surface_daily_reason_codes: surface.reasonCodes,
    light_mode: lightMode,
    wind_mode: windMode,
    daylight_wind_mph: daylightWindMph,
    thermal_mode: thermalMode,
    water_movement_mode: waterMovementMode,
    pressure_mode: pressureMode,
    scenario_tags: tags,
    missing_inputs: missingInputs,
    confidence: confidenceFrom({
      base: analysis.norm.reliability,
      missingInputs,
    }),
  };
}
