import type {
  ActivityRules,
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  MovementEngineId,
  PushRules,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverMetric,
  RiverRunPrimitiveCapabilities,
  RiverRunReasonCode,
  TemperatureSourceType,
  WeatherFreshness,
} from "../types.ts";
import { scoreFishability } from "../scoring/fishability.ts";
import {
  type ActivityWeatherHour,
  scoreActivity,
} from "../scoring/activity.ts";
import { type PushScoreResult, scorePush } from "../scoring/push.ts";
import type { RefreshSlot } from "./refreshSlots.ts";
import type { RiverRunDailySnapshot } from "./buildDailySnapshot.ts";
import { resolveDataQuality } from "./dataQuality.ts";
import { resolveInterpretationNote } from "../copy/interpretation.ts";
import { compareLocalDates } from "../metrics/dateWindow.ts";
import {
  unavailableFishability,
  unavailablePush,
} from "../scoring/unavailablePrimitives.ts";

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
    hourlyActivityWeather?: ActivityWeatherHour[];
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
  activity: ReturnType<typeof scoreActivity> | null;
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
  primitiveCapabilities?: RiverRunPrimitiveCapabilities;
  pushRules?: PushRules;
  fishabilityBands?: FishabilityBands;
  activityRules?: ActivityRules;
  activityTargetDate?: string;
  activityTargetStage?: RiverRunDailySnapshot["runStage"]["stage"];
  activityStaging?: boolean;
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
  const trackingState = input.dailySnapshot.runStage.label === "Offseason" ||
      input.dailySnapshot.runStage.label === "Fall run complete"
    ? "offseason"
    : input.dailySnapshot.runStage.label === "Fall entry complete"
    ? "complete"
    : compareLocalDates(input.localDate, trackingStartDate) < 0
    ? "not_started"
    : compareLocalDates(input.localDate, trackingEndDate) > 0
    ? "complete"
    : "active";
  const pushCapability = input.primitiveCapabilities?.push ?? {
    status: "available" as const,
  };
  const fishabilityCapability = input.primitiveCapabilities?.fishability ?? {
    status: "available" as const,
  };
  const push = pushCapability.status === "unavailable"
    ? unavailablePush(pushCapability.reason)
    : scorePush({
      movementEngineId: input.movementEngineId,
      rules: requirePushRules(input.pushRules),
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
      copyStrategy: input.dailySnapshot.runStage.copyStrategy,
      monitoringStartDate: input.dailySnapshot.runStage.window.stagingStartDate,
    });
  const fishability = fishabilityCapability.status === "unavailable"
    ? unavailableFishability(fishabilityCapability.reason)
    : scoreFishability({
      rules: requireFishabilityBands(input.fishabilityBands),
      gaugeFreshness: input.gaugeFreshness,
      flowBand: input.flowBand,
      currentHydraulicValue: input.currentHydraulicValue,
      flowSignal: input.flowSignal,
      hydraulicAbsoluteChange24h: input.hydraulicAbsoluteChange24h,
      hydraulicPercentChange24h: input.hydraulicPercentChange24h,
      flowReasonCodes: input.flowReasonCodes,
      localDate: input.localDate,
      copyStrategy: input.dailySnapshot.runStage.copyStrategy,
    });
  const activity = input.activityRules && input.activityTargetDate
    ? scoreActivity({
      rules: input.activityRules,
      requestDate: input.localDate,
      runStage: input.activityTargetStage ?? input.dailySnapshot.runStage.stage,
      staging: input.activityStaging ?? false,
      targetDate: input.activityTargetDate,
      waterTempF: input.waterTempF,
      temperatureTrend: input.temperatureSignal,
      gaugeFreshness: input.gaugeFreshness,
      weatherFreshness: input.weatherFreshness,
      flowBand: input.flowBand,
      currentHydraulicValue: input.currentHydraulicValue,
      fishabilityBands: input.fishabilityBands,
      flowSignal: input.flowSignal,
      hourlyWeather: input.sourceMetrics.weather?.hourlyActivityWeather ?? [],
      copyStrategy: input.dailySnapshot.runStage.copyStrategy,
      fallEntryComplete:
        input.dailySnapshot.runStage.label === "Fall entry complete",
    })
    : null;
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
    broadBuildingContext: input.dailySnapshot.runStage.broadBuildingContext,
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
    activity,
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

function requirePushRules(rules?: PushRules): PushRules {
  if (!rules) {
    throw new Error("Available Push requires calibrated Push rules.");
  }
  return rules;
}

function requireFishabilityBands(
  bands?: FishabilityBands,
): FishabilityBands {
  if (!bands) {
    throw new Error(
      "Available Fishability requires calibrated Fishability bands.",
    );
  }
  return bands;
}

function dedupeReasonCodes(codes: RiverRunReasonCode[]): RiverRunReasonCode[] {
  return [...new Set(codes)];
}
