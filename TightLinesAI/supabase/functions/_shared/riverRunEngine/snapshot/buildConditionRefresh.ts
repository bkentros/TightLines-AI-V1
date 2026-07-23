import type {
  BehaviorProfile,
  FlowBand,
  GaugeFreshness,
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

export type ConditionRefreshMetrics = {
  gauge?: {
    provider?: string;
    siteId?: string;
    observedAt?: string;
    primaryMetric: RiverMetric;
    value?: number | null;
    band?: FlowBand;
    trend?: RawFlowTrendSignal;
  };
  weather?: {
    rain24hIn?: number | null;
    rain48hIn?: number | null;
    rain72hIn?: number | null;
    temperatureTrend?: RawTemperatureTrendSignal;
    temperatureSource: TemperatureSourceType;
    forecastDaily?: Array<Record<string, unknown>>;
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
  schedule: RiverRunDailySnapshot["schedule"];
  fishInRiver: RiverRunDailySnapshot["fishInRiver"];
  sourceMetrics: ConditionRefreshMetrics;
  freshness: {
    gauge: GaugeFreshness;
    weather: WeatherFreshness;
    waterTemperature: TemperatureSourceType;
    scheduleDaysUsable: number;
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
  behaviorProfile: BehaviorProfile;
  gaugeFreshness: GaugeFreshness;
  weatherFreshness: WeatherFreshness;
  flowBand?: FlowBand;
  rainSignal: RawRainSignal;
  flowSignal: RawFlowTrendSignal;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureSourceType: TemperatureSourceType;
  measuredWaterTooWarm?: boolean;
  missingNonGaugeInputCount?: number;
  rainReasonCodes?: RiverRunReasonCode[];
  flowReasonCodes?: RiverRunReasonCode[];
  temperatureReasonCodes?: RiverRunReasonCode[];
  sourceMetrics: ConditionRefreshMetrics;
  engineVersion: string;
  configVersion: string;
}): RiverRunConditionRefresh {
  const push = scorePush({
    behaviorProfile: input.behaviorProfile,
    gaugeFreshness: input.gaugeFreshness,
    rainSignal: input.rainSignal,
    flowSignal: input.flowSignal,
    temperatureSignal: input.temperatureSignal,
    temperatureSourceType: input.temperatureSourceType,
    flowBand: input.flowBand,
    measuredWaterTooWarm: input.measuredWaterTooWarm,
    rainReasonCodes: input.rainReasonCodes,
    flowReasonCodes: input.flowReasonCodes,
    temperatureReasonCodes: input.temperatureReasonCodes,
  });
  const fishability = scoreFishability({
    gaugeFreshness: input.gaugeFreshness,
    weatherFreshness: input.weatherFreshness,
    flowBand: input.flowBand,
    flowSignal: input.flowSignal,
    rainSignal: input.rainSignal,
    rainReasonCodes: input.rainReasonCodes,
    flowReasonCodes: input.flowReasonCodes,
  });
  const dataQuality = resolveDataQuality({
    gaugeFreshness: input.gaugeFreshness,
    weatherFreshness: input.weatherFreshness,
    temperatureSourceType: input.temperatureSourceType,
    scheduleDaysUsable: input.dailySnapshot.schedule.usableDays,
    missingNonGaugeInputCount: input.missingNonGaugeInputCount,
    hasUnavailableCurrentPrimitive: push.score === null ||
      fishability.score === null,
    scheduleUncertainFromMissingInputs: input.dailySnapshot.schedule.reasonCodes
      .includes(
        "schedule_missing_required_inputs",
      ),
  });
  const interpretationNote = resolveInterpretationNote({
    runStage: input.dailySnapshot.runStage.stage,
    scheduleLabel: input.dailySnapshot.schedule.label,
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
    schedule: input.dailySnapshot.schedule,
    fishInRiver: input.dailySnapshot.fishInRiver,
    sourceMetrics: input.sourceMetrics,
    freshness: {
      gauge: input.gaugeFreshness,
      weather: input.weatherFreshness,
      waterTemperature: input.temperatureSourceType,
      scheduleDaysUsable: input.dailySnapshot.schedule.usableDays,
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
