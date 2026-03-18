import type {
  EngineContext,
  ScoredVariableKey,
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableDataGap,
} from "../contracts/mod.ts";
import { SCORED_VARIABLE_KEYS_BY_CONTEXT } from "../contracts/mod.ts";
import type { ReliabilityTierNormalized } from "../contracts/normalized.ts";
import { monthIndexFromDate } from "../config/monthModifiers.ts";
import { normalizeTemperature } from "./normalizeTemperature.ts";
import {
  normalizePressureDetailed,
  type PressureHistoryQuality,
} from "./normalizePressure.ts";
import { normalizeWind } from "./normalizeWind.ts";
import { normalizeLight } from "./normalizeLight.ts";
import { normalizePrecipitationDisruption } from "./normalizePrecip.ts";
import { normalizeRunoff } from "./normalizeRunoff.ts";
import { normalizeTideCurrentMovement } from "./normalizeTide.ts";

function buildDataGaps(
  context: EngineContext,
  missing: string[]
): VariableDataGap[] {
  const expected = SCORED_VARIABLE_KEYS_BY_CONTEXT[context];
  const gaps: VariableDataGap[] = [];
  for (const key of expected) {
    if (missing.includes(key)) {
      gaps.push({ variable_key: key as ScoredVariableKey, reason: "absent" });
    }
  }
  return gaps;
}

function downgradeOnce(t: ReliabilityTierNormalized): ReliabilityTierNormalized {
  if (t === "high") return "medium";
  return "low";
}

function minTier(
  a: ReliabilityTierNormalized,
  b: ReliabilityTierNormalized
): ReliabilityTierNormalized {
  const o = { low: 0, medium: 1, high: 2 };
  return o[a] <= o[b] ? a : b;
}

function computeReliability(
  context: EngineContext,
  available: string[],
  missing: string[],
  pressureQuality: PressureHistoryQuality | null
): ReliabilityTierNormalized {
  const n = available.length;
  if (n < 3) return "low";

  let tier: ReliabilityTierNormalized = n <= 4 ? "medium" : "high";

  const core = [...SCORED_VARIABLE_KEYS_BY_CONTEXT[context]];
  const missingCore = core.filter((k) => missing.includes(k));
  if (missingCore.length >= 2) {
    tier = minTier(tier, "medium");
  }
  if (missingCore.length >= 3) {
    tier = "low";
  }

  if (
    pressureQuality != null &&
    available.includes("pressure_regime") &&
    (pressureQuality === "sparse" || pressureQuality === "two_point")
  ) {
    tier = downgradeOnce(tier);
  }

  if (context === "coastal" && missing.includes("tide_current_movement")) {
    tier = minTier(tier, "medium");
  }

  return tier;
}

export function buildSharedNormalizedOutput(req: SharedEngineRequest): SharedNormalizedOutput {
  const month = monthIndexFromDate(req.local_date);
  const e = req.environment;

  const dailyMean =
    e.daily_mean_air_temp_f ??
    e.current_air_temp_f ??
    null;

  const temp = normalizeTemperature(
    req.context,
    req.region_key,
    month,
    dailyMean,
    e.prior_day_mean_air_temp_f,
    e.day_minus_2_mean_air_temp_f
  );

  const pressureResult = normalizePressureDetailed(e.pressure_history_mb);
  const pressure = pressureResult?.state ?? null;
  const pressureQuality: PressureHistoryQuality | null = pressureResult
    ? pressureResult.quality
    : null;

  const wind = normalizeWind(e.wind_speed_mph, req.context);
  const light = normalizeLight(e.cloud_cover_pct, req.context);

  let precip: ReturnType<typeof normalizePrecipitationDisruption> = null;
  if (req.context === "freshwater_lake_pond" || req.context === "coastal") {
    if (
      e.precip_24h_in != null ||
      e.precip_72h_in != null ||
      e.precip_rate_now_in_per_hr != null ||
      e.active_precip_now === true
    ) {
      precip = normalizePrecipitationDisruption(
        e.precip_rate_now_in_per_hr,
        e.precip_24h_in,
        e.precip_72h_in,
        e.active_precip_now
      );
    }
  }

  let runoff: ReturnType<typeof normalizeRunoff> = null;
  if (req.context === "freshwater_river") {
    if (e.precip_24h_in != null || e.precip_72h_in != null || e.precip_7d_in != null) {
      runoff = normalizeRunoff(req.region_key, e.precip_24h_in, e.precip_72h_in, e.precip_7d_in);
    }
  }

  let tide: ReturnType<typeof normalizeTideCurrentMovement> = null;
  if (req.context === "coastal") {
    tide = normalizeTideCurrentMovement({
      current_speed_knots_max: e.current_speed_knots_max,
      tide_height_hourly_ft: e.tide_height_hourly_ft,
      tide_high_low: e.tide_high_low,
      stage: e.tide_movement_state,
    });
  }

  const normalized: SharedNormalizedOutput["normalized"] = {};
  const available: string[] = [];
  const missing: string[] = [];

  if (temp) {
    normalized.temperature = temp;
    available.push("temperature_condition");
  } else missing.push("temperature_condition");

  if (pressure) {
    normalized.pressure_regime = pressure;
    available.push("pressure_regime");
  } else missing.push("pressure_regime");

  if (wind) {
    normalized.wind_condition = wind;
    available.push("wind_condition");
  } else missing.push("wind_condition");

  if (light) {
    normalized.light_cloud_condition = light;
    available.push("light_cloud_condition");
  } else missing.push("light_cloud_condition");

  if (precip) {
    normalized.precipitation_disruption = precip;
    available.push("precipitation_disruption");
  } else if (req.context === "freshwater_lake_pond" || req.context === "coastal") {
    missing.push("precipitation_disruption");
  }

  if (runoff) {
    normalized.runoff_flow_disruption = runoff;
    available.push("runoff_flow_disruption");
  } else if (req.context === "freshwater_river") {
    missing.push("runoff_flow_disruption");
  }

  if (tide) {
    normalized.tide_current_movement = tide;
    available.push("tide_current_movement");
  } else if (req.context === "coastal") {
    missing.push("tide_current_movement");
  }

  const reliability = computeReliability(
    req.context,
    available,
    missing,
    pressureQuality
  );
  const data_gaps = buildDataGaps(req.context, missing);

  return {
    location: {
      latitude: req.latitude,
      longitude: req.longitude,
      state_code: req.state_code,
      region_key: req.region_key,
      local_date: req.local_date,
      local_timezone: req.local_timezone,
    },
    context: req.context,
    normalized,
    available_variables: available,
    missing_variables: missing,
    data_gaps,
    reliability,
  };
}
