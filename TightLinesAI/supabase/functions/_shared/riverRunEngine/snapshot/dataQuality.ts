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
  /** Whether an enabled current primitive is configured to consume temperature. */
  temperatureExpected?: boolean;
  temperatureIsUpstreamFallback?: boolean;
  conditionsSuggestDaysUsable: number;
  conditionsSuggestExpectedDays?: number;
  hasUnavailableCurrentPrimitive?: boolean;
  conditionsSuggestInsufficient?: boolean;
  missingNonGaugeInputCount?: number;
};

export function resolveDataQuality(input: DataQualityInput): DataQuality {
  const reasonCodes = new Set<RiverRunReasonCode>();
  reasonCodes.add(gaugeReasonCode(input.gaugeFreshness));
  reasonCodes.add(weatherReasonCode(input.weatherFreshness));

  let nonCriticalLimitations = 0;
  const temperatureUnavailable = input.temperatureSourceType === "unavailable";
  const temperatureExpected = input.temperatureExpected ?? true;
  if (temperatureUnavailable && temperatureExpected) {
    nonCriticalLimitations++;
    reasonCodes.add("temperature_unavailable");
  }
  if (input.temperatureIsUpstreamFallback && temperatureExpected) {
    nonCriticalLimitations++;
    reasonCodes.add("temperature_upstream_fallback");
  }
  // The assembled count includes missing temperature. Remove that already
  // represented dimension before counting other missing inputs such as rain.
  const otherMissingNonGaugeInputs = Math.max(
    0,
    (input.missingNonGaugeInputCount ?? 0) -
      (temperatureUnavailable ? 1 : 0),
  );
  nonCriticalLimitations += Math.min(2, otherMissingNonGaugeInputs);
  const expectedConditionsDays = input.conditionsSuggestExpectedDays ?? 0;
  const conditionsCoverage = expectedConditionsDays > 0
    ? input.conditionsSuggestDaysUsable / expectedConditionsDays
    : 1;
  if (
    expectedConditionsDays > 0 &&
    conditionsCoverage >= 0.8 &&
    conditionsCoverage < 1
  ) {
    nonCriticalLimitations++;
    reasonCodes.add("conditions_limited_source_days");
  }
  if (input.conditionsSuggestInsufficient) {
    reasonCodes.add("conditions_limited_source_days");
  }

  if (
    input.hasUnavailableCurrentPrimitive ||
    input.conditionsSuggestInsufficient ||
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
    conditionsCoverage >= 0.8
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
