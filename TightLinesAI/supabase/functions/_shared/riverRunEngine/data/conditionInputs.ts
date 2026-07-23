import type { RiverRunConditionRefresh } from "../snapshot/buildConditionRefresh.ts";
import type {
  FlowBand,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverMetric,
  RiverProfile,
  RiverRunProfile,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";
import type { NormalizedGaugeRead } from "./usgs.ts";
import { metricValue } from "./usgs.ts";
import type { NormalizedWeatherSnapshot } from "./weatherSnapshot.ts";
import { resolveFlowBand } from "./baselines.ts";
import type { RiverRunGaugeBaseline } from "../storage/types.ts";
import { canonicalBaselineDayCandidates } from "./baselineCalendar.ts";

export type RiverRunConditionInputs = {
  gaugeFreshness: RiverRunConditionRefresh["freshness"]["gauge"];
  weatherFreshness: RiverRunConditionRefresh["freshness"]["weather"];
  flowBand?: FlowBand;
  rainSignal: RawRainSignal;
  rainReasonCodes: RiverRunReasonCode[];
  flowSignal: RawFlowTrendSignal;
  flowReasonCodes: RiverRunReasonCode[];
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureReasonCodes: RiverRunReasonCode[];
  temperatureSourceType: TemperatureSourceType;
  measuredWaterTooWarm: boolean;
  missingNonGaugeInputCount: number;
  sourceMetrics: RiverRunConditionRefresh["sourceMetrics"];
};

export function assembleConditionInputs(input: {
  river: RiverProfile;
  run: RiverRunProfile;
  refreshAtUtc: string;
  localDate: string;
  gauge: NormalizedGaugeRead;
  weather: NormalizedWeatherSnapshot;
  baselineRows?: RiverRunGaugeBaseline[];
}): RiverRunConditionInputs {
  const primaryMetric = input.river.gauge.primaryMetric;
  const currentValue = input.gauge.current
    ? metricValue(input.gauge.current, primaryMetric)
    : null;
  const flowBandResolution = resolveConditionFlowBand({
    run: input.run,
    metric: primaryMetric,
    localDate: input.localDate,
    value: currentValue,
    baselineRows: input.baselineRows,
  });
  const flowBand = flowBandResolution?.band;
  const temperatureSourceType = input.run.waterTemperatureSource.type;
  const measuredWaterTooWarm = temperatureSourceType !== "air_temp_proxy" &&
    temperatureSourceType !== "unavailable" &&
    typeof input.weather.measuredWaterTempF === "number" &&
    typeof input.run.temperatureRules?.tooWarmF === "number" &&
    input.weather.measuredWaterTempF > input.run.temperatureRules.tooWarmF;
  const temperatureSignal = input.weather.temperatureTrend.rawSignal;
  const missingNonGaugeInputCount =
    (input.weather.rainSignal.rawSignal === "missing_rain_data" ? 1 : 0) +
    (temperatureSignal === "neutral_missing" ? 1 : 0);

  return {
    gaugeFreshness: input.gauge.gaugeFreshness,
    weatherFreshness: input.weather.weatherFreshness,
    flowBand,
    rainSignal: input.weather.rainSignal.rawSignal,
    rainReasonCodes: input.weather.rainSignal.reasonCodes,
    flowSignal: input.gauge.flowTrend.rawSignal,
    flowReasonCodes: input.gauge.flowTrend.reasonCodes,
    temperatureSignal,
    temperatureReasonCodes: input.weather.temperatureTrend.reasonCodes,
    temperatureSourceType,
    measuredWaterTooWarm,
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
      },
      weather: {
        rain24hIn: input.weather.rainTotals.rain24hIn,
        rain48hIn: input.weather.rainTotals.rain48hIn,
        rain72hIn: input.weather.rainTotals.rain72hIn,
        temperatureTrend: temperatureSignal,
        temperatureSource: temperatureSourceType,
        forecastDaily: input.weather.forecastDaily,
      },
    },
  };
}

function resolveConditionFlowBand(input: {
  run: RiverRunProfile;
  metric: RiverMetric;
  localDate: string;
  value: number | null;
  baselineRows?: RiverRunGaugeBaseline[];
}): { band: FlowBand } | null {
  if (input.value == null) return null;
  const candidates = canonicalBaselineDayCandidates(input.localDate);
  const baseline =
    input.baselineRows?.find((row) =>
      row.riverId === input.run.riverId &&
      row.metric === input.metric &&
      candidates.includes(row.dayOfYear)
    ) ??
      null;
  const resolved = resolveFlowBand({
    metric: input.metric,
    value: input.value,
    fishabilityBands: input.run.fishabilityBands,
    baseline,
  });
  return resolved ? { band: resolved.band } : null;
}
