import type {
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  MovementEngineId,
  PushRules,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverMetric,
  RiverRunReasonCode,
  TemperatureSourceType,
  WeatherFreshness,
} from "../types.ts";
import { scoreFishability } from "../scoring/fishability.ts";
import { type PushScoreResult, scorePush } from "../scoring/push.ts";
import type { RefreshSlot } from "./refreshSlots.ts";
import type { RiverRunDailySnapshot } from "./buildDailySnapshot.ts";
import { resolveDataQuality } from "./dataQuality.ts";
import { resolveInterpretationNote } from "../copy/interpretation.ts";
import { compareLocalDates } from "../metrics/dateWindow.ts";

export type ConditionRefreshMetrics = {
  gauge?: {
    provider?: string;
    siteId?: string;
    observedAt?: string;
    primaryMetric: RiverMetric;
    value?: number | null;
    band?: FlowBand;
    trend?: RawFlowTrendSignal;
    absoluteChange24h?: number | null;
    percentChange24h?: number | null;
  };
  weather?: {
    provider?: "OPEN_METEO";
    evidenceType?: "modeled_grid";
    weatherPointId?: string;
    rain24hIn?: number | null;
    rain48hIn?: number | null;
    rain72hIn?: number | null;
    forecastDaily?: Array<Record<string, unknown>>;
  };
  waterTemperature?: {
    provider?: string;
    sourceId?: string;
    siteId?: string;
    seriesId?: string;
    observedAt?: string;
    waterTempF?: number | null;
    trend?: RawTemperatureTrendSignal;
    sourceType: TemperatureSourceType;
    isUpstreamFallback?: boolean;
    attribution?: string;
  };
  conditionsWaterTemperature?: {
    provider?: string;
    sourceId?: string;
    siteId?: string;
    seriesId?: string;
    observedAt?: string;
    waterTempF?: number | null;
    trend?: RawTemperatureTrendSignal;
    sourceType: TemperatureSourceType;
    attribution?: string;
  };
};

export type RiverRunConditionRefresh = {
  riverId: string;
  runId: string;
  localDate: string;
  refreshSlot: RefreshSlot;
  push: PushScoreResult;
  fishability: ReturnType<typeof scoreFishability>;
  runStage: RiverRunDailySnapshot["runStage"];
  conditionsSuggest: RiverRunDailySnapshot["conditionsSuggest"];
  fishInRiver: RiverRunDailySnapshot["fishInRiver"];
  sourceMetrics: ConditionRefreshMetrics;
  freshness: {
    gauge: GaugeFreshness;
    weather: WeatherFreshness;
    waterTemperature: GaugeFreshness;
    conditionsWaterTemperature: GaugeFreshness;
    conditionsSuggestDaysUsable: number;
  };
  dataQuality: ReturnType<typeof resolveDataQuality>;
  interpretationNote?: ReturnType<typeof resolveInterpretationNote>;
  reasonCodes: RiverRunReasonCode[];
  engineVersion: string;
  configVersion: string;
};

export function buildConditionRefresh(input: {
  dailySnapshot: RiverRunDailySnapshot;
  localDate: string;
  refreshSlot: RefreshSlot;
  movementEngineId: MovementEngineId;
  pushRules: PushRules;
  fishabilityBands: FishabilityBands;
  gaugeFreshness: GaugeFreshness;
  weatherFreshness: WeatherFreshness;
  waterTemperatureFreshness: GaugeFreshness;
  conditionsWaterTemperatureFreshness?: GaugeFreshness;
  flowBand?: FlowBand;
  currentHydraulicValue: number | null;
  hydraulicAbsoluteChange24h: number | null;
  hydraulicPercentChange24h: number | null;
  rainSignal: RawRainSignal;
  flowSignal: RawFlowTrendSignal;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureSourceType: TemperatureSourceType;
  temperatureIsUpstreamFallback?: boolean;
  temperaturePositiveSignalCap?: 0 | 1 | 2;
  waterTempF: number | null;
  missingNonGaugeInputCount?: number;
  rainReasonCodes?: RiverRunReasonCode[];
  flowReasonCodes?: RiverRunReasonCode[];
  temperatureReasonCodes?: RiverRunReasonCode[];
  sourceMetrics: ConditionRefreshMetrics;
  engineVersion: string;
  configVersion: string;
}): RiverRunConditionRefresh {
  const trackingStartDate = input.dailySnapshot.runStage.window.startDate;
  const trackingEndDate = input.dailySnapshot.runStage.window.endDate;
  const trackingState =
    compareLocalDates(input.localDate, trackingStartDate) < 0
      ? "not_started"
      : compareLocalDates(input.localDate, trackingEndDate) > 0
      ? "complete"
      : "active";
  const push = scorePush({
    movementEngineId: input.movementEngineId,
    rules: input.pushRules,
    gaugeFreshness: input.gaugeFreshness,
    rainSignal: input.rainSignal,
    flowSignal: input.flowSignal,
    temperatureSignal: input.temperatureSignal,
    temperatureSourceType: input.temperatureSourceType,
    temperaturePositiveSignalCap: input.temperaturePositiveSignalCap,
    currentHydraulicValue: input.currentHydraulicValue,
    hydraulicAbsoluteChange24h: input.hydraulicAbsoluteChange24h,
    hydraulicPercentChange24h: input.hydraulicPercentChange24h,
    waterTempF: input.waterTempF,
    trackingState,
    trackingStartDate,
    trackingEndDate,
    rainReasonCodes: input.rainReasonCodes,
    flowReasonCodes: input.flowReasonCodes,
    temperatureReasonCodes: input.temperatureReasonCodes,
    localDate: input.localDate,
  });
  const fishability = scoreFishability({
    rules: input.fishabilityBands,
    gaugeFreshness: input.gaugeFreshness,
    flowBand: input.flowBand,
    flowSignal: input.flowSignal,
    currentHydraulicValue: input.currentHydraulicValue,
    hydraulicAbsoluteChange24h: input.hydraulicAbsoluteChange24h,
    hydraulicPercentChange24h: input.hydraulicPercentChange24h,
    flowReasonCodes: input.flowReasonCodes,
    localDate: input.localDate,
  });
  const dataQuality = resolveDataQuality({
    gaugeFreshness: input.gaugeFreshness,
    weatherFreshness: input.weatherFreshness,
    temperatureSourceType: input.temperatureSourceType,
    temperatureIsUpstreamFallback: input.temperatureIsUpstreamFallback,
    conditionsSuggestDaysUsable:
      input.dailySnapshot.conditionsSuggest.usableDays,
    conditionsSuggestExpectedDays:
      input.dailySnapshot.conditionsSuggest.expectedDays,
    missingNonGaugeInputCount: input.missingNonGaugeInputCount,
    hasUnavailableCurrentPrimitive:
      (trackingState === "active" && push.score === null) ||
      fishability.score === null,
    conditionsSuggestInsufficient:
      input.dailySnapshot.conditionsSuggest.timingLabel ===
        "Insufficient evidence" ||
      input.dailySnapshot.conditionsSuggest.label === "Insufficient evidence",
  });
  const interpretationNote = resolveInterpretationNote({
    runStage: input.dailySnapshot.runStage.stage,
    conditionsSuggestLabel: input.dailySnapshot.conditionsSuggest.label,
    push,
    fishability,
    fishInRiver: input.dailySnapshot.fishInRiver,
  });
  const reasonCodes = dedupeReasonCodes([
    ...input.dailySnapshot.reasonCodes,
    ...push.reasonCodes,
    ...fishability.reasonCodes,
    ...dataQuality.reasonCodes,
    ...(interpretationNote?.reasonCodes ?? []),
  ]);

  return {
    riverId: input.dailySnapshot.riverId,
    runId: input.dailySnapshot.runId,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    push,
    fishability,
    runStage: input.dailySnapshot.runStage,
    conditionsSuggest: input.dailySnapshot.conditionsSuggest,
    fishInRiver: input.dailySnapshot.fishInRiver,
    sourceMetrics: input.sourceMetrics,
    freshness: {
      gauge: input.gaugeFreshness,
      weather: input.weatherFreshness,
      waterTemperature: input.waterTemperatureFreshness,
      conditionsWaterTemperature: input.conditionsWaterTemperatureFreshness ??
        "missing",
      conditionsSuggestDaysUsable:
        input.dailySnapshot.conditionsSuggest.usableDays,
    },
    dataQuality,
    interpretationNote,
    reasonCodes,
    engineVersion: input.engineVersion,
    configVersion: input.configVersion,
  };
}

function dedupeReasonCodes(codes: RiverRunReasonCode[]): RiverRunReasonCode[] {
  return [...new Set(codes)];
}
