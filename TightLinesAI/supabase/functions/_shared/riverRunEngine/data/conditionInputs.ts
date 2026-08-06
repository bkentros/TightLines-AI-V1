import type { RiverRunConditionRefresh } from "../snapshot/buildConditionRefresh.ts";
import type {
  FlowBand,
  ObservedConditionRunProfile,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverMetric,
  RiverProfile,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";
import type { NormalizedGaugeRead } from "./usgs.ts";
import { metricValue } from "./usgs.ts";
import type { NormalizedWaterTemperatureRead } from "./waterTemperature.ts";
import type { NormalizedWeatherSnapshot } from "./weatherSnapshot.ts";
import { resolveFlowBand } from "./baselines.ts";
import {
  getPrimaryHydraulicSource,
  getPrimaryWeatherPoint,
} from "../config/sources.ts";
import { resolveRainSignal } from "../metrics/rain.ts";

export type RiverRunConditionInputs = {
  gaugeFreshness: RiverRunConditionRefresh["freshness"]["gauge"];
  weatherFreshness: RiverRunConditionRefresh["freshness"]["weather"];
  waterTemperatureFreshness:
    RiverRunConditionRefresh["freshness"]["waterTemperature"];
  conditionsWaterTemperatureFreshness:
    RiverRunConditionRefresh["freshness"]["conditionsWaterTemperature"];
  flowBand?: FlowBand;
  rainSignal: RawRainSignal;
  rainReasonCodes: RiverRunReasonCode[];
  flowSignal: RawFlowTrendSignal;
  flowReasonCodes: RiverRunReasonCode[];
  currentHydraulicValue: number | null;
  hydraulicAbsoluteChange24h: number | null;
  hydraulicPercentChange24h: number | null;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureReasonCodes: RiverRunReasonCode[];
  temperatureSourceType: TemperatureSourceType;
  temperatureIsUpstreamFallback: boolean;
  temperaturePositiveSignalCap?: 0 | 1 | 2;
  waterTempF: number | null;
  missingNonGaugeInputCount: number;
  sourceMetrics: RiverRunConditionRefresh["sourceMetrics"];
};

export function assembleConditionInputs(input: {
  river: RiverProfile;
  run: ObservedConditionRunProfile;
  refreshAtUtc: string;
  localDate: string;
  gauge: NormalizedGaugeRead;
  waterTemperature?: NormalizedWaterTemperatureRead;
  conditionsWaterTemperature?: NormalizedWaterTemperatureRead;
  weather: NormalizedWeatherSnapshot;
}): RiverRunConditionInputs {
  const primaryHydraulicSource = getPrimaryHydraulicSource(input.river);
  const primaryWeatherPoint = getPrimaryWeatherPoint(input.river);
  const primaryMetric = primaryHydraulicSource.primaryMetric;
  const currentValue = input.gauge.current
    ? metricValue(input.gauge.current, primaryMetric)
    : null;
  const flowBandResolution = resolveConditionFlowBand({
    run: input.run,
    metric: primaryMetric,
    value: currentValue,
  });
  const flowBand = flowBandResolution?.band;
  const measuredTemperature = input.waterTemperature?.current &&
      input.waterTemperature.freshness === "fresh" &&
      input.waterTemperature.smoothedWaterTempF != null
    ? input.waterTemperature
    : null;
  const temperatureSourceType = measuredTemperature
    ? measuredTemperature.sourceType
    : "unavailable";
  const temperatureSignal = measuredTemperature
    ? measuredTemperature.trend.rawSignal
    : "neutral_missing";
  const temperatureReasonCodes = measuredTemperature
    ? measuredTemperature.reasonCodes
    : ["temperature_unavailable", "temperature_neutral_missing"] as const;
  const rainSignal = resolveRainSignal(
    input.weather.rainTotals,
    input.run.push.rain,
  );
  const missingNonGaugeInputCount =
    (rainSignal.rawSignal === "missing_rain_data" ? 1 : 0) +
    (temperatureSignal === "neutral_missing" ? 1 : 0);

  return {
    gaugeFreshness: input.gauge.gaugeFreshness,
    weatherFreshness: input.weather.weatherFreshness,
    waterTemperatureFreshness: input.waterTemperature?.freshness ?? "missing",
    conditionsWaterTemperatureFreshness:
      input.conditionsWaterTemperature?.freshness ?? "missing",
    flowBand,
    rainSignal: rainSignal.rawSignal,
    rainReasonCodes: rainSignal.reasonCodes,
    flowSignal: input.gauge.flowTrend.rawSignal,
    flowReasonCodes: input.gauge.flowTrend.reasonCodes,
    currentHydraulicValue: currentValue,
    hydraulicAbsoluteChange24h: input.gauge.flowTrend.absoluteChange24h,
    hydraulicPercentChange24h: input.gauge.flowTrend.percentChange24h,
    temperatureSignal,
    temperatureReasonCodes: [...temperatureReasonCodes],
    temperatureSourceType,
    temperatureIsUpstreamFallback: measuredTemperature?.isUpstreamFallback ??
      false,
    temperaturePositiveSignalCap: measuredTemperature?.isUpstreamFallback
      ? input.run.waterTemperature.upstreamFallbackPositiveSignalCap
      : undefined,
    waterTempF: measuredTemperature?.smoothedWaterTempF ?? null,
    missingNonGaugeInputCount,
    sourceMetrics: {
      gauge: {
        provider: input.gauge.provider,
        siteId: input.gauge.siteId,
        observedAt: input.gauge.current?.observedAt,
        primaryMetric,
        value: currentValue,
        band: flowBandResolution?.band,
        trend: input.gauge.flowTrend.rawSignal,
        absoluteChange24h: input.gauge.flowTrend.absoluteChange24h,
        percentChange24h: input.gauge.flowTrend.percentChange24h,
      },
      weather: {
        provider: "OPEN_METEO",
        evidenceType: "modeled_grid",
        weatherPointId: primaryWeatherPoint.weatherPointId,
        rain24hIn: input.weather.rainTotals.rain24hIn,
        rain48hIn: input.weather.rainTotals.rain48hIn,
        rain72hIn: input.weather.rainTotals.rain72hIn,
        forecastDaily: input.weather.forecastDaily,
        hourlyActivityWeather: input.weather.hourlyActivityWeather,
      },
      waterTemperature: measuredTemperature
        ? {
          provider: measuredTemperature.current?.provider,
          sourceId: measuredTemperature.sourceId,
          siteId: measuredTemperature.current?.siteId,
          seriesId: measuredTemperature.current?.seriesId,
          observedAt: measuredTemperature.current?.observedAt,
          waterTempF: measuredTemperature.smoothedWaterTempF,
          trend: measuredTemperature.trend.rawSignal,
          sourceType: measuredTemperature.sourceType,
          isUpstreamFallback: measuredTemperature.isUpstreamFallback,
          attribution: input.river.waterTemperatureSources.find((source) =>
            source.sourceId === measuredTemperature.sourceId
          )?.attribution,
        }
        : {
          sourceType: temperatureSourceType,
          trend: temperatureSignal,
        },
      conditionsWaterTemperature: input.conditionsWaterTemperature?.current &&
          input.conditionsWaterTemperature.freshness === "fresh" &&
          input.conditionsWaterTemperature.smoothedWaterTempF != null
        ? {
          provider: input.conditionsWaterTemperature.current.provider,
          sourceId: input.conditionsWaterTemperature.sourceId,
          siteId: input.conditionsWaterTemperature.current.siteId,
          seriesId: input.conditionsWaterTemperature.current.seriesId,
          observedAt: input.conditionsWaterTemperature.current.observedAt,
          waterTempF: input.conditionsWaterTemperature.smoothedWaterTempF,
          trend: input.conditionsWaterTemperature.trend.rawSignal,
          sourceType: input.conditionsWaterTemperature.sourceType,
          attribution: input.river.waterTemperatureSources.find((source) =>
            source.sourceId === input.conditionsWaterTemperature?.sourceId
          )?.attribution,
        }
        : {
          sourceType: "unavailable",
          trend: "neutral_missing",
        },
    },
  };
}

function resolveConditionFlowBand(input: {
  run: ObservedConditionRunProfile;
  metric: RiverMetric;
  value: number | null;
}): { band: FlowBand } | null {
  if (input.value == null) return null;
  const resolved = resolveFlowBand({
    metric: input.metric,
    value: input.value,
    fishabilityBands: input.run.fishabilityBands,
  });
  return resolved ? { band: resolved.band } : null;
}
