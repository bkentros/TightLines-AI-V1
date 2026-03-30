import type {
  EngineContext,
  ScoredVariableKey,
  SharedEngineRequest,
  SharedNormalizedOutput,
  VariableDataGap,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext, SCORED_VARIABLE_KEYS_BY_CONTEXT } from "../contracts/mod.ts";
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
  missing: string[],
  runoffGapReason: "absent" | "incomplete_precip_windows",
): VariableDataGap[] {
  const expected = SCORED_VARIABLE_KEYS_BY_CONTEXT[context];
  const gaps: VariableDataGap[] = [];
  for (const key of expected) {
    if (missing.includes(key)) {
      const reason =
        key === "runoff_flow_disruption" && runoffGapReason === "incomplete_precip_windows"
          ? "incomplete_precip_windows"
          : "absent";
      gaps.push({ variable_key: key as ScoredVariableKey, reason });
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

  if (isCoastalFamilyContext(context) && missing.includes("tide_current_movement")) {
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
    e.day_minus_2_mean_air_temp_f,
    {
      measuredWaterTempF: e.measured_water_temp_f,
      measuredWaterTemp24hAgoF: e.measured_water_temp_24h_ago_f,
      measuredWaterTemp72hAgoF: e.measured_water_temp_72h_ago_f,
    }
  );

  const pressureResult = normalizePressureDetailed(e.pressure_history_mb);
  const pressure = pressureResult?.state ?? null;
  const pressureQuality: PressureHistoryQuality | null = pressureResult
    ? pressureResult.quality
    : null;

  const wind = normalizeWind(e.wind_speed_mph, req.context);
  const light = normalizeLight(e.cloud_cover_pct, req.context, {
    temperatureBandLabel: temp?.band_label ?? undefined,
  });

  const precipRate = e.precip_rate_now_in_per_hr;
  const p24 = e.precip_24h_in;
  const p72 = e.precip_72h_in;
  const p7dRiver = e.precip_7d_in;

  const precipLakeCoastalContract =
    (p24 != null && p72 != null) ||
    precipRate != null ||
    e.active_precip_now === true;

  let precip: ReturnType<typeof normalizePrecipitationDisruption> = null;
  if (req.context === "freshwater_lake_pond" || req.context === "coastal") {
    if (precipLakeCoastalContract) {
      precip = normalizePrecipitationDisruption(
        req.context,
        precipRate,
        p24,
        p72,
        e.active_precip_now,
        e.precip_7d_in
      );
    }
  }

  const riverPrecipPartial =
    req.context === "freshwater_river" &&
    (p24 != null || p72 != null || p7dRiver != null) &&
    (p24 == null || p72 == null || p7dRiver == null);

  let runoff: ReturnType<typeof normalizeRunoff> = null;
  if (req.context === "freshwater_river") {
    if (p24 != null && p72 != null && p7dRiver != null) {
      runoff = normalizeRunoff(req.region_key, p24, p72, p7dRiver);
    }
  }

  let tide: ReturnType<typeof normalizeTideCurrentMovement> = null;
  if (isCoastalFamilyContext(req.context)) {
    const tidePolicy = req.context === "coastal_flats_estuary" ? "flats_estuary" : "inshore";
    tide = normalizeTideCurrentMovement({
      current_speed_knots_max: e.current_speed_knots_max,
      tide_height_hourly_ft: e.tide_height_hourly_ft,
      tide_high_low: e.tide_high_low,
      stage: e.tide_movement_state,
    }, tidePolicy);
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
  } else if (req.context === "freshwater_lake_pond" || isCoastalFamilyContext(req.context)) {
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
  } else if (isCoastalFamilyContext(req.context)) {
    missing.push("tide_current_movement");
  }

  let reliability = computeReliability(
    req.context,
    available,
    missing,
    pressureQuality
  );

  if (
    isCoastalFamilyContext(req.context) &&
    temp != null &&
    temp.measurement_source === "air_daily_mean"
  ) {
    reliability = downgradeOnce(reliability);
  }

  const runoffGapReason: "absent" | "incomplete_precip_windows" =
    req.context === "freshwater_river" &&
    missing.includes("runoff_flow_disruption") &&
    riverPrecipPartial
      ? "incomplete_precip_windows"
      : "absent";

  const data_gaps = buildDataGaps(req.context, missing, runoffGapReason);

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
