import type {
  DataQuality,
  GaugeFreshness,
  RiverRunReasonCode,
  TemperatureSourceType,
  WeatherFreshness,
} from "../types.ts";

export type DataQualityInput = {
  gaugeFreshness: GaugeFreshness;
  weatherFreshness: WeatherFreshness;
  temperatureSourceType: TemperatureSourceType;
  scheduleDaysUsable: number;
  hasUnavailableCurrentPrimitive?: boolean;
  scheduleUncertainFromMissingInputs?: boolean;
  missingNonGaugeInputCount?: number;
};

export function resolveDataQuality(input: DataQualityInput): DataQuality {
  const reasonCodes = new Set<RiverRunReasonCode>();
  reasonCodes.add(gaugeReasonCode(input.gaugeFreshness));
  reasonCodes.add(weatherReasonCode(input.weatherFreshness));

  let nonCriticalLimitations = 0;
  if (input.temperatureSourceType === "air_temp_proxy") {
    nonCriticalLimitations++;
    reasonCodes.add("temperature_air_proxy");
  } else if (input.temperatureSourceType === "unavailable") {
    nonCriticalLimitations++;
    reasonCodes.add("temperature_unavailable");
  }
  if ((input.missingNonGaugeInputCount ?? 0) === 1) nonCriticalLimitations++;
  if (input.scheduleDaysUsable >= 4 && input.scheduleDaysUsable <= 5) {
    nonCriticalLimitations++;
    reasonCodes.add("schedule_limited_source_days");
  }

  if (
    input.hasUnavailableCurrentPrimitive ||
    input.scheduleUncertainFromMissingInputs ||
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h" ||
    input.weatherFreshness === "missing" ||
    nonCriticalLimitations > 1
  ) {
    reasonCodes.add("data_quality_limited");
    return { label: "Limited", reasonCodes: [...reasonCodes] };
  }

  if (input.gaugeFreshness === "stale" || input.weatherFreshness === "stale") {
    reasonCodes.add("data_quality_stale");
    return { label: "Stale", reasonCodes: [...reasonCodes] };
  }

  if (nonCriticalLimitations === 1) {
    reasonCodes.add("data_quality_partial");
    return { label: "Partial", reasonCodes: [...reasonCodes] };
  }

  if (
    input.gaugeFreshness === "fresh" &&
    input.weatherFreshness === "fresh" &&
    input.scheduleDaysUsable >= 6
  ) {
    reasonCodes.add("data_quality_fresh");
    return { label: "Fresh", reasonCodes: [...reasonCodes] };
  }

  reasonCodes.add("data_quality_partial");
  return { label: "Partial", reasonCodes: [...reasonCodes] };
}

function gaugeReasonCode(freshness: GaugeFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "gauge_fresh";
    case "stale":
      return "gauge_stale";
    case "missing":
      return "gauge_missing";
    case "older_than_24h":
      return "gauge_older_than_24h";
  }
}

function weatherReasonCode(freshness: WeatherFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "weather_fresh";
    case "stale":
      return "weather_stale";
    case "missing":
      return "weather_missing";
  }
}
