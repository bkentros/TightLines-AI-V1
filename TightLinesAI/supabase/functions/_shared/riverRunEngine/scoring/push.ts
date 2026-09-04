import type {
  DirectEventSample,
  GaugeFreshness,
  MovementEngineId,
  PrimitiveDisplay,
  PushRules,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverRunReasonCode,
  RunStageCopyStrategy,
  TemperatureSourceType,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";

export type PushHydraulicState = "low" | "normal" | "high" | "severe_high";
export type PushTemperatureState =
  | "supportive"
  | "transitional_warm"
  | "too_warm"
  | "migration_barrier"
  | "cool_plateau"
  | "cold_active"
  | "cold_holding";
export type PushRainRole =
  | "precursor"
  | "partial_precursor"
  | "absorbed_by_gauge"
  | "suppressed_high_flow"
  | "dry"
  | "neutral"
  | "missing";
export type PushTrackingState =
  | "offseason"
  | "not_started"
  | "active"
  | "complete";

export type PushScoreComponents = {
  hydraulicBase: number;
  hydraulicAdjustment: number;
  temperatureModifier: number;
  rainModifier: number;
  hydraulicState: PushHydraulicState;
  temperatureState: PushTemperatureState;
  rainRole: PushRainRole;
  appliedCaps: number[];
};

export type PushScoreInput = {
  movementEngineId: MovementEngineId;
  rules: PushRules;
  gaugeFreshness: GaugeFreshness;
  flowSignal: RawFlowTrendSignal;
  currentHydraulicValue?: number | null;
  hydraulicAbsoluteChange24h?: number | null;
  hydraulicPercentChange24h?: number | null;
  rainSignal: RawRainSignal;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureSourceType: TemperatureSourceType;
  waterTempF?: number | null;
  temperaturePositiveSignalCap?: 0 | 1 | 2;
  trackingState: PushTrackingState;
  trackingStartDate: string;
  trackingEndDate: string;
  rainReasonCodes?: RiverRunReasonCode[];
  flowReasonCodes?: RiverRunReasonCode[];
  temperatureReasonCodes?: RiverRunReasonCode[];
  localDate?: string;
  copyStrategy?: RunStageCopyStrategy;
  monitoringStartDate?: string;
  hydraulicChanges?: Array<{
    hours: 12 | 24 | 48;
    absolute: number | null;
    percent: number | null;
  }>;
  temperatureChanges?: Array<{
    hours: 12 | 24 | 48;
    deltaF: number | null;
  }>;
  hydraulicFourHourSeries?: DirectEventSample[];
  temperatureFourHourSeries?: DirectEventSample[];
};

export type PushScoreResult = PrimitiveDisplay & {
  components?: PushScoreComponents;
  rulesVersion?: string;
  model?: "direct_event_state";
  evidenceConfidence?: "Standard" | "Lower";
  directSignals?: {
    hydraulic?: DirectEventSignalState;
    temperature?: DirectEventSignalState;
  };
};

export type DirectEventSignalState = {
  level: 0 | 1 | 2 | 3;
  phase: "neutral" | "building" | "holding" | "fading";
  onsetAt?: string;
  ageHours?: number;
  baseline?: number;
  current?: number;
  peakChange?: number;
  retainedChange?: number;
  retentionFraction?: number;
  triggerWindowHours?: 12 | 24;
};

export const PUSH_SUPPORTIVE_SCORE_MINIMUM = 50;

export function scorePush(input: PushScoreInput): PushScoreResult {
  if (input.trackingState !== "active") {
    const result = inactiveTrackingResult(input);
    const lowerConfidence =
      input.rules.directEvent?.evidenceConfidence === "lower";
    return input.rules.model === "direct_event_state"
      ? {
        ...result,
        detail: `${directEventInactiveDetail(input)}${
          lowerConfidence && input.rules.directEvent?.limitationCopy
            ? ` ${input.rules.directEvent.limitationCopy}`
            : ""
        }`,
        model: "direct_event_state",
        evidenceConfidence: lowerConfidence ? "Lower" : "Standard",
      }
      : result;
  }
  if (input.rules.model === "direct_event_state") {
    return scoreDirectEventPush(input);
  }
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h" ||
    !isNumber(input.currentHydraulicValue)
  ) {
    return unavailableResult({
      reason: "gauge",
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        ...(input.flowReasonCodes ?? []),
      ],
      rules: input.rules,
    });
  }
  if (
    input.temperatureSourceType === "unavailable" ||
    !isNumber(input.waterTempF)
  ) {
    return unavailableResult({
      reason: "temperature",
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        ...(input.temperatureReasonCodes ?? []),
        "temperature_unavailable",
      ],
      rules: input.rules,
    });
  }
  if (
    input.movementEngineId !== "fall_cooling" &&
    input.movementEngineId !== "fall_entry_cooling"
  ) {
    return unavailableResult({
      reason: "engine",
      reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
      rules: input.rules,
    });
  }

  const hydraulicState = resolveHydraulicState(
    input.currentHydraulicValue,
    input.rules,
  );
  const temperatureState = resolveTemperatureState(
    input.waterTempF,
    input.rules,
    input.movementEngineId,
  );
  const hydraulicBase = hydraulicBaseScore(input.flowSignal);
  const hydraulicAdjustment = hydraulicStateAdjustment(
    hydraulicState,
    input.flowSignal,
  );
  const temperatureModifier = resolveTemperatureModifier({
    state: temperatureState,
    trend: input.temperatureSignal,
    positiveSignalCap: input.temperaturePositiveSignalCap,
  });
  const rain = resolveRainModifier({
    signal: input.rainSignal,
    flowSignal: input.flowSignal,
    hydraulicState,
  });
  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    ...(input.rainReasonCodes ?? []),
    ...(input.flowReasonCodes ?? []),
    ...(input.temperatureReasonCodes ?? []),
    hydraulicStateReasonCode(hydraulicState),
    temperatureStateReasonCode(temperatureState),
    rainRoleReasonCode(rain.role),
  ]);
  const appliedCaps: number[] = [];
  let score = hydraulicBase + hydraulicAdjustment + temperatureModifier +
    rain.modifier;

  if (
    input.flowSignal !== "rising" &&
    input.flowSignal !== "meaningful_rise" &&
    input.flowSignal !== "sharp_rise"
  ) {
    score = applyCap(score, input.rules.caps.noGaugeResponse, appliedCaps);
    reasonCodes.add("push_no_gauge_response_cap");
  }
  if (input.flowSignal === "unknown") {
    score = applyCap(score, input.rules.caps.unknownTrend, appliedCaps);
    reasonCodes.add("push_unknown_trend_cap");
  }
  if (temperatureState === "too_warm") {
    score = applyCap(score, input.rules.caps.tooWarm, appliedCaps);
    reasonCodes.add("temperature_too_warm_cap");
  }
  if (temperatureState === "migration_barrier") {
    score = applyCap(
      score,
      input.rules.caps.migrationBarrier,
      appliedCaps,
    );
    reasonCodes.add("push_temperature_barrier_cap");
  }
  if (temperatureState === "cold_holding") {
    score = applyCap(
      score,
      input.rules.caps.coldHolding ?? 49,
      appliedCaps,
    );
    reasonCodes.add("push_cold_holding_cap");
  }
  if (hydraulicState === "severe_high") {
    score = applyCap(
      score,
      input.rules.caps.severeHighFlow,
      appliedCaps,
    );
    reasonCodes.add("push_severe_high_flow_cap");
  }
  if (input.gaugeFreshness === "stale") {
    score -= 10;
    score = applyCap(score, input.rules.caps.staleGauge, appliedCaps);
    reasonCodes.add("push_stale_gauge_cap");
  }
  const finalScore = clamp(Math.round(score), 0, 100);
  const label = pushLabel(finalScore);
  const components: PushScoreComponents = {
    hydraulicBase,
    hydraulicAdjustment,
    temperatureModifier,
    rainModifier: rain.modifier,
    hydraulicState,
    temperatureState,
    rainRole: rain.role,
    appliedCaps: [...new Set(appliedCaps)].toSorted((a, b) => a - b),
  };
  return {
    score: finalScore,
    label,
    ...pushCopy({
      label,
      input,
      components,
    }),
    reasonCodes: [...reasonCodes],
    components,
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

type DirectSignalLevel = 0 | 1 | 2 | 3;

/**
 * Scores a recent environmental movement-support event, not fish presence or
 * the probability that fish entered. Neutral is the floor: absent evidence is
 * deliberately not presented as a negative movement forecast.
 */
function scoreDirectEventPush(input: PushScoreInput): PushScoreResult {
  const policy = input.rules.directEvent;
  if (!policy) {
    throw new Error("direct_event_state Push requires directEvent rules.");
  }
  const hydraulicAvailable = policy.hydraulic === "trigger" &&
    input.gaugeFreshness !== "missing" &&
    input.gaugeFreshness !== "older_than_24h" &&
    isNumber(input.currentHydraulicValue);
  const temperatureAvailable = policy.temperature !== "disabled" &&
    input.temperatureSourceType !== "unavailable" &&
    isNumber(input.waterTempF);
  const temperatureCanTrigger = temperatureAvailable &&
    policy.temperature === "trigger_and_constraint";
  if (!hydraulicAvailable && !temperatureCanTrigger) {
    const missingHydraulicTrigger = policy.hydraulic === "trigger";
    const missingTemperatureTrigger =
      policy.temperature === "trigger_and_constraint";
    const result = unavailableResult({
      reason: missingHydraulicTrigger && missingTemperatureTrigger
        ? "direct_sources"
        : missingHydraulicTrigger
        ? "direct_gauge"
        : "direct_temperature",
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        ...(input.flowReasonCodes ?? []),
        ...(input.temperatureReasonCodes ?? []),
      ],
      rules: input.rules,
    });
    return {
      ...result,
      detail: policy.evidenceConfidence === "lower" && policy.limitationCopy
        ? `${result.detail} ${policy.limitationCopy}`
        : result.detail,
      model: "direct_event_state",
      evidenceConfidence: policy.evidenceConfidence === "lower"
        ? "Lower"
        : "Standard",
    };
  }

  const hydraulicState = isNumber(input.currentHydraulicValue)
    ? resolveHydraulicState(input.currentHydraulicValue, input.rules)
    : "normal";
  const temperatureState = isNumber(input.waterTempF)
    ? resolveTemperatureState(
      input.waterTempF,
      input.rules,
      input.movementEngineId,
    )
    : "supportive";
  const hydraulicEvent = hydraulicAvailable
    ? resolveDirectEvent({
      series: input.hydraulicFourHourSeries ?? [],
      direction: "rise",
      thresholds: [
        input.rules.hydraulic.rising24h,
        input.rules.hydraulic.meaningfulRise24h,
        input.rules.hydraulic.sharpRise24h,
      ],
      triggerWindows: [12, 24],
      persistenceHours: policy.persistenceHours,
      fullRetentionFraction: policy.fullRetentionFraction,
      minimumRetentionFraction: policy.minimumRetentionFraction,
    })
    : neutralDirectEvent();
  const temperatureEvent = temperatureAvailable &&
      policy.temperature === "trigger_and_constraint"
    ? resolveDirectEvent({
      series: input.temperatureFourHourSeries ?? [],
      direction: "drop",
      thresholds: [
        { absolute: policy.buildingCoolingF },
        { absolute: policy.coolingF },
        { absolute: policy.strongCoolingF },
      ],
      // Temperature is compared to the same time yesterday. A 12-hour
      // temperature comparison aliases the normal day/night cycle and can
      // manufacture a cooling event even when the daily regime is unchanged.
      triggerWindows: [24],
      persistenceHours: policy.persistenceHours,
      fullRetentionFraction: policy.fullRetentionFraction,
      minimumRetentionFraction: policy.minimumRetentionFraction,
    })
    : neutralDirectEvent();
  const hydraulicLevel = hydraulicEvent.level;
  const temperatureLevel = temperatureEvent.level;

  // Independent signals corroborate the read but do not add invented points.
  // The stronger observed event controls, preventing flow-plus-temperature
  // double counting when the two variables respond to the same weather event.
  let level = Math.max(hydraulicLevel, temperatureLevel) as DirectSignalLevel;
  const constrainedTemperature = temperatureAvailable &&
    (temperatureState === "too_warm" ||
      temperatureState === "migration_barrier" ||
      temperatureState === "cold_holding");
  if (
    temperatureAvailable &&
    (temperatureState === "migration_barrier" ||
      temperatureState === "cold_holding")
  ) level = 0;
  else if (temperatureState === "too_warm") {
    level = Math.min(level, 1) as DirectSignalLevel;
  }
  if (hydraulicState === "severe_high") level = 0;
  level = Math.min(level, policy.maximumLevel ?? 3) as DirectSignalLevel;
  if (input.gaugeFreshness === "stale" && hydraulicLevel >= temperatureLevel) {
    level = Math.max(0, level - 1) as DirectSignalLevel;
  }

  const labels = ["Neutral", "Possible", "Elevated", "Strong"] as const;
  const scores = [50, 64, 78, 92] as const;
  const label = labels[level];
  const sourceSummary = hydraulicLevel > 0 && temperatureLevel > 0
    ? "Measured temperature and river flow are both showing a recent event."
    : hydraulicLevel > 0
    ? "Measured river flow is showing a recent rise."
    : temperatureLevel > 0
    ? "Measured water temperature is showing recent cooling."
    : "No elevated direct water signal is currently detected.";
  const constrainedSummary = hydraulicState === "severe_high"
    ? `${
      sourceSummary.slice(0, -1)
    }, but exceptionally high flow keeps the event from being treated as favorable.`
    : constrainedTemperature
    ? `${
      sourceSummary.slice(0, -1)
    }, while the current absolute temperature limits the signal's strength.`
    : sourceSummary;
  const proxyLimitation = policy.evidenceConfidence === "lower" &&
      policy.limitationCopy
    ? ` ${policy.limitationCopy}`
    : "";
  const freshnessLimitation = input.gaugeFreshness === "stale" &&
      hydraulicLevel >= temperatureLevel
    ? " The flow reading is stale, so the signal is reduced by one level."
    : "";
  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    ...(input.flowReasonCodes ?? []),
    ...(input.temperatureReasonCodes ?? []),
    hydraulicStateReasonCode(hydraulicState),
    ...(temperatureAvailable
      ? [temperatureStateReasonCode(temperatureState)]
      : []),
  ]);
  return {
    score: scores[level],
    label,
    headline: policy.evidenceConfidence === "lower"
      ? level === 0
        ? "The lower-confidence upstream flow proxy is neutral."
        : `${label} support from a lower-confidence upstream flow proxy.`
      : level === 0
      ? "Water signals are neutral for a fresh movement event."
      : `${label} environmental support for possible fresh movement.`,
    detail:
      `${constrainedSummary}${freshnessLimitation}${proxyLimitation} This estimates movement-supporting conditions, not fish entry or abundance.`,
    tip: level >= 2
      ? "Use this as a reason to check fresh-entry and travel water, then verify conditions directly."
      : "Keep Migration Stage primary and watch the next four-hour update for a developing event.",
    reasonCodes: [...reasonCodes],
    components: {
      hydraulicBase: policy.evidenceConfidence === "lower"
        ? level
        : hydraulicLevel,
      hydraulicAdjustment: 0,
      temperatureModifier: temperatureLevel,
      rainModifier: 0,
      hydraulicState,
      temperatureState,
      rainRole: "missing",
      appliedCaps: [],
    },
    model: "direct_event_state",
    evidenceConfidence: policy.evidenceConfidence === "lower"
      ? "Lower"
      : "Standard",
    directSignals: {
      ...(hydraulicAvailable
        ? {
          hydraulic: policy.evidenceConfidence === "lower"
            ? {
              ...hydraulicEvent,
              level,
              phase: level === 0 ? "neutral" as const : hydraulicEvent.phase,
            }
            : hydraulicEvent,
        }
        : {}),
      ...(temperatureAvailable ? { temperature: temperatureEvent } : {}),
    },
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function resolveDirectEvent(input: {
  series: DirectEventSample[];
  direction: "rise" | "drop";
  thresholds: Array<{ absolute: number; percent?: number }>;
  triggerWindows: Array<12 | 24>;
  persistenceHours: number;
  fullRetentionFraction: number;
  minimumRetentionFraction: number;
}): DirectEventSignalState {
  const series = input.series.toSorted((a, b) =>
    Date.parse(a.windowEndAt) - Date.parse(b.windowEndAt)
  );
  const current = series.at(-1);
  if (!current) return neutralDirectEvent();
  const candidates: Array<{
    at: string;
    baseline: number;
    level: DirectSignalLevel;
    hours: 12 | 24;
  }> = [];
  for (let index = 0; index < series.length; index++) {
    for (const hours of input.triggerWindows) {
      const prior = sampleAt(
        series,
        Date.parse(series[index].windowEndAt) -
          hours * 60 * 60 * 1000,
      );
      if (!prior || prior.value <= 0) continue;
      const change = input.direction === "rise"
        ? series[index].value - prior.value
        : prior.value - series[index].value;
      const percent = change / prior.value * 100;
      const level = thresholdLevel(change, percent, input.thresholds);
      if (level > 0) {
        candidates.push({
          at: series[index].windowEndAt,
          baseline: prior.value,
          level,
          hours,
        });
      }
    }
  }
  const ordered = candidates.toSorted((a, b) =>
    Date.parse(a.at) - Date.parse(b.at)
  );
  if (ordered.length === 0) {
    return { ...neutralDirectEvent(), current: current.value };
  }

  // Treat detections no more than eight hours apart as one event and select the
  // most recent event. Its first qualifying read freezes the baseline.
  let clusterStart = 0;
  for (let index = 1; index < ordered.length; index++) {
    if (
      Date.parse(ordered[index].at) - Date.parse(ordered[index - 1].at) >
        8 * 60 * 60 * 1000
    ) clusterStart = index;
  }
  const cluster = ordered.slice(clusterStart);
  const onset = cluster[0];
  const ageHours = (Date.parse(current.windowEndAt) - Date.parse(onset.at)) /
    (60 * 60 * 1000);
  if (ageHours > input.persistenceHours) {
    return { ...neutralDirectEvent(), current: current.value };
  }
  const eventSamples = series.filter((sample) =>
    Date.parse(sample.windowEndAt) >= Date.parse(onset.at)
  );
  const directionalChanges = eventSamples.map((sample) =>
    input.direction === "rise"
      ? sample.value - onset.baseline
      : onset.baseline - sample.value
  );
  const peakChange = Math.max(0, ...directionalChanges);
  const retainedChange = input.direction === "rise"
    ? current.value - onset.baseline
    : onset.baseline - current.value;
  const retentionFraction = peakChange > 0
    ? Math.max(0, Math.min(1, retainedChange / peakChange))
    : 0;
  let level = Math.max(
    ...cluster.map((candidate) => candidate.level),
  ) as DirectSignalLevel;
  if (retentionFraction < input.minimumRetentionFraction) level = 0;
  else if (retentionFraction < input.fullRetentionFraction) {
    level = Math.max(1, level - 1) as DirectSignalLevel;
  }
  // A prior spike cannot keep an event alive after the current reading has
  // surrendered even the run-specific Possible threshold.
  const retainedPercent = onset.baseline > 0
    ? retainedChange / onset.baseline * 100
    : 0;
  if (
    thresholdLevel(retainedChange, retainedPercent, [input.thresholds[0]]) === 0
  ) {
    level = 0;
  }
  return {
    level,
    phase: level === 0
      ? "neutral"
      : ageHours <= 8
      ? "building"
      : retentionFraction < input.fullRetentionFraction
      ? "fading"
      : "holding",
    onsetAt: onset.at,
    ageHours,
    baseline: onset.baseline,
    current: current.value,
    peakChange,
    retainedChange,
    retentionFraction,
    triggerWindowHours: onset.hours,
  };
}

function sampleAt(
  series: DirectEventSample[],
  targetMs: number,
): DirectEventSample | undefined {
  return series.find((sample) =>
    Math.abs(Date.parse(sample.windowEndAt) - targetMs) <= 30 * 60 * 1000
  );
}

function thresholdLevel(
  absolute: number,
  percent: number,
  thresholds: Array<{ absolute: number; percent?: number }>,
): DirectSignalLevel {
  let level: DirectSignalLevel = 0;
  thresholds.forEach((threshold, index) => {
    if (
      absolute >= threshold.absolute &&
      (threshold.percent == null || percent >= threshold.percent)
    ) {
      level = (index + 1) as DirectSignalLevel;
    }
  });
  return level;
}

function neutralDirectEvent(): DirectEventSignalState {
  return { level: 0, phase: "neutral" };
}

function hydraulicBaseScore(signal: RawFlowTrendSignal): number {
  switch (signal) {
    case "falling":
      return 20;
    case "stable":
      return 35;
    case "rising":
      return 52;
    case "meaningful_rise":
      return 70;
    case "sharp_rise":
      return 80;
    case "unknown":
      return 30;
  }
}

function hydraulicStateAdjustment(
  state: PushHydraulicState,
  signal: RawFlowTrendSignal,
): number {
  if (
    state === "low" &&
    (signal === "falling" || signal === "stable" || signal === "unknown")
  ) {
    return -5;
  }
  if (state === "high" || state === "severe_high") return -5;
  return 0;
}

function resolveHydraulicState(
  value: number,
  rules: PushRules,
): PushHydraulicState {
  if (value >= rules.hydraulic.severeHighValue) return "severe_high";
  if (value >= rules.hydraulic.highValue) return "high";
  if (value <= rules.hydraulic.lowValue) return "low";
  return "normal";
}

function resolveTemperatureState(
  waterTempF: number,
  rules: PushRules,
  movementEngineId: MovementEngineId = "fall_cooling",
): PushTemperatureState {
  if (waterTempF >= rules.temperature.migrationBarrierF) {
    return "migration_barrier";
  }
  if (waterTempF > rules.temperature.tooWarmF) return "too_warm";
  if (waterTempF > rules.temperature.supportiveMaxF) {
    return "transitional_warm";
  }
  if (movementEngineId === "fall_entry_cooling") {
    if (
      rules.temperature.coldHoldingF != null &&
      waterTempF <= rules.temperature.coldHoldingF
    ) {
      return "cold_holding";
    }
    if (
      rules.temperature.preferredMinF != null &&
      waterTempF < rules.temperature.preferredMinF
    ) {
      return "cold_active";
    }
  }
  if (waterTempF < rules.temperature.supportiveMinF) return "cool_plateau";
  return "supportive";
}

function resolveTemperatureModifier(input: {
  state: PushTemperatureState;
  trend: RawTemperatureTrendSignal;
  positiveSignalCap?: 0 | 1 | 2;
}): number {
  let modifier: number;
  switch (input.state) {
    case "supportive":
      modifier = trendModifier(input.trend, {
        strongCooling: 10,
        cooling: 6,
        neutral: 0,
        warming: -5,
        strongWarming: -10,
      });
      break;
    case "transitional_warm":
      modifier = trendModifier(input.trend, {
        strongCooling: 8,
        cooling: 5,
        neutral: -3,
        warming: -8,
        strongWarming: -12,
      });
      break;
    case "too_warm":
      modifier = trendModifier(input.trend, {
        strongCooling: -5,
        cooling: -8,
        neutral: -12,
        warming: -15,
        strongWarming: -18,
      });
      break;
    case "migration_barrier":
      modifier = -20;
      break;
    case "cool_plateau":
      modifier = 0;
      break;
    case "cold_active":
      modifier = trendModifier(input.trend, {
        strongCooling: -6,
        cooling: -3,
        neutral: 1,
        warming: 2,
        strongWarming: 0,
      });
      break;
    case "cold_holding":
      modifier = -15;
      break;
  }
  if (modifier <= 0 || input.positiveSignalCap == null) return modifier;
  return Math.min(modifier, input.positiveSignalCap * 5);
}

function trendModifier(
  trend: RawTemperatureTrendSignal,
  values: {
    strongCooling: number;
    cooling: number;
    neutral: number;
    warming: number;
    strongWarming: number;
  },
): number {
  switch (trend) {
    case "strong_cooling":
      return values.strongCooling;
    case "cooling":
      return values.cooling;
    case "warming":
      return values.warming;
    case "strong_warming":
      return values.strongWarming;
    case "neutral":
    case "neutral_missing":
      return values.neutral;
  }
}

function resolveRainModifier(input: {
  signal: RawRainSignal;
  flowSignal: RawFlowTrendSignal;
  hydraulicState: PushHydraulicState;
}): { modifier: number; role: PushRainRole } {
  if (input.signal === "missing_rain_data") {
    return { modifier: 0, role: "missing" };
  }
  if (
    input.signal === "dry" &&
    (input.flowSignal === "meaningful_rise" ||
      input.flowSignal === "sharp_rise")
  ) {
    return { modifier: 0, role: "absorbed_by_gauge" };
  }
  if (input.signal === "dry") return { modifier: -5, role: "dry" };
  if (input.signal === "light_rain") {
    return { modifier: 0, role: "neutral" };
  }
  if (
    input.hydraulicState === "high" ||
    input.hydraulicState === "severe_high"
  ) {
    return { modifier: 0, role: "suppressed_high_flow" };
  }
  if (
    input.flowSignal === "meaningful_rise" ||
    input.flowSignal === "sharp_rise"
  ) {
    return { modifier: 0, role: "absorbed_by_gauge" };
  }
  const raw = input.signal === "heavy_rain"
    ? 10
    : input.signal === "strong_rain"
    ? 8
    : 5;
  if (input.flowSignal === "rising") {
    return {
      modifier: Math.min(raw, 3),
      role: "partial_precursor",
    };
  }
  return { modifier: raw, role: "precursor" };
}

function pushLabel(score: number): string {
  if (score <= 24) return "Weak";
  if (score <= 49) return "No clear push";
  if (score <= 69) return "Possible";
  if (score <= 84) return "Strong";
  return "Very strong";
}

function pushCopy(input: {
  label: string;
  input: PushScoreInput;
  components: PushScoreComponents;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (input.input.copyStrategy === "pere_marquette") {
    return pereMarquettePushCopy(input);
  }
  if (input.input.copyStrategy === "big_manistee_tailwater") {
    return bigManisteePushCopy(input);
  }
  if (input.input.copyStrategy === "muskegon_croton_tailwater") {
    return muskegonPushCopy(input);
  }
  const nilesScoped = input.input.rules.hydraulic.sourceLabel ===
    "Niles mainstem reach";
  if (nilesScoped) return stJosephPushCopy(input);
  const detail = [
    hydraulicCopy(input.input),
    temperatureCopy(input.input, input.components.temperatureState),
    temperatureSourceCopy(input.input),
    rainCopy(input.components.rainRole),
    capCopy(input.input),
  ].filter(Boolean).join(" ");
  const tip = pushTip(input.label, input.input, input.components);
  return {
    headline: pushHeadline(input.label, input.input, input.components),
    detail: nilesScoped
      ? `${detail} This Push describes fresh-movement support at Niles only; it does not prove a new wave at the harbor, Berrien Springs, South Bend, Mishawaka, or Twin Branch.`
      : detail,
    tip: nilesScoped
      ? `${tip} Use the Niles signal to choose between Niles-area holding water and a lower-Michigan travel-water check; verify Indiana movement directly.`
      : tip,
  };
}

function stJosephPushCopy(input: {
  label: string;
  input: PushScoreInput;
  components: PushScoreComponents;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const points = [
    stJosephHydraulicPoint(input.input, input.components.hydraulicState),
    temperatureCopy(input.input, input.components.temperatureState),
    input.input.gaugeFreshness === "stale"
      ? "The Niles reading is aging, so confidence is reduced."
      : input.input.flowSignal === "unknown"
      ? "Without a dependable Niles trend, the read cannot show a clear Push."
      : stJosephRainPoint(input.components.rainRole),
  ].filter((point): point is string => Boolean(point));
  const headline = input.components.hydraulicState === "severe_high"
    ? "Extreme Niles flow prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "migration_barrier"
    ? "Warm Niles water prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "cold_holding"
    ? "Cold Niles water limits confidence in continued fall entry."
    : ({
      Weak: "Niles water shows little support for fresh movement.",
      "No clear push":
        "Niles water does not show a clear fresh-movement signal.",
      Possible: "Niles water offers some support for fresh movement.",
      Strong: "Niles water strongly supports possible fresh movement.",
      "Very strong":
        "Niles water offers its strongest support for fresh movement.",
    } as Record<string, string>)[input.label] ??
      "A Niles fresh-movement read is available.";
  const tip = input.label === "Weak" || input.label === "No clear push"
    ? "Keep Migration Stage’s section primary. Do not shift sections from this Niles read."
    : input.label === "Possible"
    ? "Keep Migration Stage’s section primary and add one Niles-area movement check."
    : "Use Niles as the movement check, then verify the Lower and Upper river directly.";
  return { headline, detail: points.slice(0, 3).join(" "), tip };
}

function stJosephHydraulicPoint(
  input: PushScoreInput,
  state: PushHydraulicState,
): string {
  const trend = ({
    sharp_rise: "is rising quickly",
    meaningful_rise: "has made a clear rise",
    rising: "has started to rise",
    stable: "is steady without a meaningful rise",
    falling: "is falling",
    unknown: "does not have a dependable recent trend",
  } as Record<RawFlowTrendSignal, string>)[input.flowSignal];
  const level = state === "low"
    ? ", while overall flow remains low"
    : state === "high"
    ? ", while overall flow is high"
    : state === "severe_high"
    ? ", while overall flow is extreme"
    : "";
  return `Niles flow ${trend}${level}.`;
}

function stJosephRainPoint(role: PushRainRole): string {
  return ({
    precursor: "Rain is only a precursor because Niles has not responded.",
    partial_precursor: "Rain adds limited support while Niles begins to rise.",
    absorbed_by_gauge:
      "Niles already reflects the rain response, so rain adds no extra credit.",
    suppressed_high_flow:
      "Rain adds no support while Niles flow is already high.",
    dry: "Recent watershed weather shows little rain.",
    missing: "Rainfall data is unavailable and adds no confidence.",
    neutral: "Recent rainfall is too light to affect the read.",
  } as Record<PushRainRole, string>)[role];
}

function bigManisteePushCopy(input: {
  label: string;
  input: PushScoreInput;
  components: PushScoreComponents;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const points = [
    hydraulicCopy(input.input).replace(". Overall flow", "; overall flow"),
    temperatureCopy(input.input, input.components.temperatureState),
    input.input.gaugeFreshness === "stale"
      ? "The Wellston reading is aging, so confidence is reduced."
      : input.input.flowSignal === "unknown"
      ? "Without a dependable Wellston trend, the read cannot show a clear Push."
      : bigManisteeRainPoint(input.components.rainRole),
  ].filter((point): point is string => Boolean(point));
  const headline = input.components.hydraulicState === "severe_high"
    ? "Extreme Upper-river flow prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "migration_barrier"
    ? "Warm Upper-river water prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "cold_holding"
    ? "Cold Upper-river water limits confidence in continued fall entry."
    : ({
      Weak: "Upper-river water shows little support for fresh movement.",
      "No clear push":
        "Upper-river water does not show a clear fresh-movement signal.",
      Possible: "Upper-river water offers some support for fresh movement.",
      Strong: "Upper-river water strongly supports possible fresh movement.",
      "Very strong":
        "Upper-river water offers its strongest support for fresh movement.",
    } as Record<string, string>)[input.label] ??
      "An Upper-river fresh-movement read is available.";
  const tip = input.label === "Weak" || input.label === "No clear push"
    ? "Keep Migration Stage’s section primary. Do not shift to fresh-entry water from this read."
    : input.label === "Possible"
    ? "Keep Migration Stage’s section primary and add one Lower-river fresh-entry check."
    : "Use the Lower river as the fresh-entry comparison, then return to Migration Stage’s section.";
  return {
    headline,
    detail: points.slice(0, 3).join(" "),
    tip,
  };
}

function bigManisteeRainPoint(role: PushRainRole): string {
  return ({
    precursor: "Rain is only a precursor because Wellston has not responded.",
    partial_precursor:
      "Rain adds limited support while Wellston begins to rise.",
    absorbed_by_gauge:
      "Wellston already reflects the rain response, so rain adds no extra credit.",
    suppressed_high_flow:
      "Rain adds no support while Wellston flow is already high.",
    dry: "Recent watershed weather shows little rain.",
    missing: "Rainfall data is unavailable and adds no confidence.",
    neutral: "Recent rainfall is too light to affect the read.",
  } as Record<PushRainRole, string>)[role];
}

function muskegonPushCopy(input: {
  label: string;
  input: PushScoreInput;
  components: PushScoreComponents;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const points = [
    hydraulicCopy(input.input).replace(". Overall flow", "; overall flow"),
    temperatureCopy(input.input, input.components.temperatureState),
    input.input.gaugeFreshness === "stale"
      ? "The Croton reading is aging, so confidence is reduced."
      : input.input.flowSignal === "unknown"
      ? "Without a dependable Croton trend, the read cannot show a clear Push."
      : muskegonRainPoint(input.components.rainRole),
  ].filter((point): point is string => Boolean(point));
  const headline = input.components.hydraulicState === "severe_high"
    ? "Extreme Croton-area flow prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "migration_barrier"
    ? "Warm Croton-area water prevents a dependable fresh-movement signal."
    : input.components.temperatureState === "cold_holding"
    ? "Cold Croton-area water limits confidence in continued fall entry."
    : ({
      Weak: "Croton-area water shows little support for fresh movement.",
      "No clear push":
        "Croton-area water does not show a clear fresh-movement signal.",
      Possible: "Croton-area water offers some support for fresh movement.",
      Strong: "Croton-area water strongly supports possible fresh movement.",
      "Very strong":
        "Croton-area water offers its strongest support for fresh movement.",
    } as Record<string, string>)[input.label] ??
      "A Croton-area fresh-movement read is available.";
  const tip = input.label === "Weak" || input.label === "No clear push"
    ? "Keep Migration Stage’s section primary. Do not shift sections from this read."
    : input.label === "Possible"
    ? "Keep Migration Stage’s section primary and add one Croton Dam-area movement check."
    : "Prioritize movement water near Croton Dam, then verify any downstream section directly.";
  return {
    headline,
    detail: points.slice(0, 3).join(" "),
    tip,
  };
}

function muskegonRainPoint(role: PushRainRole): string {
  return ({
    precursor: "Rain is only a precursor because Croton has not responded.",
    partial_precursor: "Rain adds limited support while Croton begins to rise.",
    absorbed_by_gauge:
      "Croton already reflects the rain response, so rain adds no extra credit.",
    suppressed_high_flow:
      "Rain adds no support while Croton-area flow is already high.",
    dry: "Recent watershed weather shows little rain.",
    missing: "Rainfall data is unavailable and adds no confidence.",
    neutral: "Recent rainfall is too light to affect the read.",
  } as Record<PushRainRole, string>)[role];
}

function pereMarquettePushCopy(input: {
  label: string;
  input: PushScoreInput;
  components: PushScoreComponents;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const { label, components } = input;
  const points = [
    pmHydraulicPoint(input.input, components.hydraulicState),
    pmTemperaturePoint(input.input, components.temperatureState),
    pmPushQualification(input.input, components),
  ].filter((point): point is string => Boolean(point));
  const headline = components.hydraulicState === "severe_high"
    ? "Extreme Scottville flow prevents a dependable fresh-movement signal."
    : components.temperatureState === "migration_barrier"
    ? "Warm PM water prevents a dependable fresh-movement signal."
    : components.temperatureState === "cold_holding"
    ? "Cold PM water limits confidence in continued fall entry."
    : input.input.gaugeFreshness === "stale"
    ? "An aging Scottville reading limits confidence in PM fresh movement."
    : ({
      Weak: "PM water shows little support for fresh movement.",
      "No clear push": "PM water does not show a clear fresh-movement signal.",
      Possible: "PM water offers some support for fresh movement.",
      Strong: "PM water strongly supports possible fresh movement.",
      "Very strong":
        "PM water offers its strongest support for fresh movement.",
    } as Record<string, string>)[label] ??
      "A PM fresh-movement read is available.";
  const tip = components.hydraulicState === "severe_high"
    ? "Do not chase a movement event. Let Fishability determine whether the Scottville reach offers any practical presentation water."
    : components.temperatureState === "migration_barrier" ||
        components.temperatureState === "too_warm"
    ? "Keep the section named by Migration Stage. Leave fresh-entry travel water secondary until measured temperature improves."
    : label === "Weak" || label === "No clear push"
    ? "Keep the section named by Migration Stage. Do not shift lower for a fresh wave this water does not support."
    : label === "Possible"
    ? "Keep Migration Stage’s section primary. Add one Lower river travel-water check before returning to established holding water."
    : "Use Lower river travel water as the fresh-movement check, then return to the section named by Migration Stage.";
  return {
    headline,
    detail: points.slice(0, 3).join(" "),
    tip,
  };
}

function pmHydraulicPoint(
  input: PushScoreInput,
  state: PushHydraulicState,
): string {
  const trend = ({
    sharp_rise: "is rising quickly",
    meaningful_rise: "has made a clear rise",
    rising: "has started to rise",
    stable: "is steady without a meaningful rise",
    falling: "is falling",
    unknown: "does not have a dependable recent trend",
  } as Record<RawFlowTrendSignal, string>)[input.flowSignal];
  const level = state === "low"
    ? ", while overall flow remains low"
    : state === "high"
    ? ", while overall flow is high"
    : state === "severe_high"
    ? ", while overall flow is extreme"
    : "";
  return `Scottville flow ${trend}${level}.`;
}

function pmTemperaturePoint(
  input: PushScoreInput,
  state: PushTemperatureState,
): string {
  const trend = input.temperatureSignal === "strong_cooling"
    ? " and cooling quickly"
    : input.temperatureSignal === "cooling"
    ? " and cooling"
    : input.temperatureSignal === "warming"
    ? " but warming"
    : input.temperatureSignal === "strong_warming"
    ? " but warming quickly"
    : "";
  const stateCopy = ({
    supportive: "favorable for this migration",
    transitional_warm: "warmer than preferred",
    too_warm: "too warm for strong movement support",
    migration_barrier: "warm enough to block a dependable movement call",
    cool_plateau: "already cool enough that more cooling adds no credit",
    cold_active: "cold but still compatible with fall Steelhead movement",
    cold_holding: "cold enough to favor holding over active fall entry",
  } as Record<PushTemperatureState, string>)[state];
  return `Measured water temperature is ${stateCopy}${trend}.`;
}

function pmPushQualification(
  input: PushScoreInput,
  components: PushScoreComponents,
): string {
  if (input.gaugeFreshness === "stale") {
    return "The latest Scottville reading is aging, so confidence is reduced.";
  }
  if (input.flowSignal === "unknown") {
    return "Without a dependable Scottville trend, the model cannot call a clear Push.";
  }
  if (input.temperaturePositiveSignalCap === 0) {
    return "The temperature source is upstream, so its cooling cannot add positive lower-river credit.";
  }
  if (input.temperaturePositiveSignalCap != null) {
    return "The upstream temperature source reduces confidence in Lower river conditions.";
  }
  return ({
    precursor:
      "Rain is only a precursor because Scottville has not shown enough response.",
    partial_precursor:
      "Rain adds limited support while Scottville begins to rise.",
    absorbed_by_gauge:
      "Scottville already reflects the rain response, so rain adds no extra credit.",
    suppressed_high_flow:
      "Additional rain adds no support while Scottville flow is already high.",
    dry: "Recent watershed weather shows little rain.",
    missing: "Watershed rainfall data is unavailable and adds no confidence.",
    neutral: "Recent watershed rainfall is too light to affect the read.",
  } as Record<PushRainRole, string>)[components.rainRole];
}

function inactiveTrackingResult(
  input: PushScoreInput,
): PushScoreResult {
  if (input.trackingState === "offseason") {
    if (input.copyStrategy === "muskegon_croton_tailwater") {
      return {
        score: null,
        label: "Offseason",
        headline: "Muskegon Push is outside its fall movement window.",
        detail:
          "Current Croton flow and measured temperature do not provide an in-season fresh-movement signal for this run.",
        tip: `Check back ${
          input.monitoringStartDate
            ? seasonalReturnPhrase(input.monitoringStartDate.slice(5))
            : "when fall tracking resumes"
        }.`,
        reasonCodes: ["push_tracking_offseason"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    if (input.copyStrategy === "big_manistee_tailwater") {
      return {
        score: null,
        label: "Offseason",
        headline: "Big Manistee Push is outside its fall movement window.",
        detail:
          "Current Wellston flow and temperature do not provide an in-season fresh-movement signal for this run.",
        tip: `Check back ${
          input.monitoringStartDate
            ? seasonalReturnPhrase(input.monitoringStartDate.slice(5))
            : "when fall tracking resumes"
        }.`,
        reasonCodes: ["push_tracking_offseason"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    if (input.copyStrategy === "pere_marquette") {
      const returnPhrase = input.monitoringStartDate
        ? seasonalReturnPhrase(input.monitoringStartDate.slice(5))
        : "when Migration Stage enters staging";
      return {
        score: null,
        label: "Offseason",
        headline: "PM Push is outside its fall movement window.",
        detail:
          "Current rain, Scottville flow, and water temperature do not provide an in-season fresh-movement signal for this run.",
        tip:
          `Check back ${returnPhrase} when fall movement monitoring resumes.`,
        reasonCodes: ["push_tracking_offseason"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    return {
      score: null,
      label: "Offseason",
      headline: "Push is not active outside the river migration season.",
      detail:
        "Rain, river level, and water temperature can still change, but they do not provide a useful fresh-arrival signal for this species right now.",
      tip:
        "Do not use Push to plan for this species outside its migration season. Follow an active species instead, or return when early monitoring begins.",
      reasonCodes: ["push_tracking_offseason"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.trackingState === "not_started") {
    const fallEntry = input.movementEngineId === "fall_entry_cooling";
    if (input.copyStrategy === "pere_marquette") {
      return {
        score: null,
        label: "Waiting for migration",
        headline: fallEntry
          ? "Dependable PM Steelhead fall entry has not started."
          : "Dependable PM river entry has not started.",
        detail:
          "Rain, Scottville flow, and water temperature are not scored as an in-season movement signal yet.",
        tip:
          "Use Migration Stage. Do not move inland because offseason water resembles an in-season Push.",
        reasonCodes: ["push_tracking_not_started"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    if (input.copyStrategy === "big_manistee_tailwater") {
      return {
        score: null,
        label: "Waiting for migration",
        headline: "Dependable Big Manistee river entry has not started.",
        detail:
          "Wellston flow and temperature are not scored as an in-season fresh-movement signal yet.",
        tip:
          "Use Migration Stage. Do not move inland because offseason water resembles a Push.",
        reasonCodes: ["push_tracking_not_started"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    if (input.copyStrategy === "muskegon_croton_tailwater") {
      return {
        score: null,
        label: "Waiting for migration",
        headline: fallEntry
          ? "Dependable Muskegon Steelhead fall entry has not started."
          : "Dependable Muskegon river entry has not started.",
        detail:
          "Croton flow and measured temperature are not scored as an in-season fresh-movement signal yet.",
        tip:
          "Use Migration Stage. Do not move inland because offseason water resembles a Push.",
        reasonCodes: ["push_tracking_not_started"],
        rulesVersion: input.rules.version,
        copyVersion: RIVER_RUN_COPY_VERSION,
      };
    }
    return {
      score: null,
      label: "Waiting for migration",
      headline: fallEntry
        ? "Dependable fall entry has not started, so Push is not active yet."
        : "Fish have not started entering the river, so there is no Push read yet.",
      detail: fallEntry
        ? "An occasional early steelhead is possible, but Push is reserved for the expected entry window, when rain, river level, and water temperature can provide a responsible fresh-movement read."
        : "Push is meant to spot water conditions that may help fish enter or move during the active migration. Before that, most opportunity should remain in the lake, harbor, or river-mouth transition.",
      tip: fallEntry
        ? "Keep most effort near the lake, harbor, and river-mouth transition. Do not move inland just because rain or cooling resembles an in-season movement event."
        : "Keep the trip in the lake, harbor, and river-mouth zone. Do not move inland just because rain or cooling resembles an in-season movement event.",
      reasonCodes: ["push_tracking_not_started"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (
    (input.copyStrategy === "pere_marquette" ||
      input.copyStrategy === "big_manistee_tailwater" ||
      input.copyStrategy === "muskegon_croton_tailwater" ||
      input.copyStrategy === "st_joseph_corridor") &&
    input.movementEngineId === "fall_entry_cooling"
  ) {
    return {
      score: null,
      label: "Fall entry complete",
      headline: input.copyStrategy === "big_manistee_tailwater"
        ? "Big Manistee Steelhead fall-entry Push is complete."
        : input.copyStrategy === "muskegon_croton_tailwater"
        ? "Muskegon Steelhead fall-entry Push is complete."
        : input.copyStrategy === "st_joseph_corridor"
        ? "St. Joseph Steelhead fall-entry Push is complete."
        : "PM Steelhead fall-entry Push is complete.",
      detail:
        "Current water may affect Steelhead still in the river. This fall model no longer scores fresh-entry support.",
      tip:
        "Do not use a completed fall Push to infer current presence. Check back in early September.",
      reasonCodes: ["push_tracking_complete"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.copyStrategy === "muskegon_croton_tailwater") {
    return {
      score: null,
      label: "Fall run complete",
      headline: "Muskegon fall-run Push is complete.",
      detail:
        "Current Croton water no longer provides an in-season fresh-movement read for this run.",
      tip:
        "Do not use a completed Push to infer current presence. Return when fall movement tracking resumes.",
      reasonCodes: ["push_tracking_complete"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    score: null,
    label: input.movementEngineId === "fall_entry_cooling"
      ? "Winter holding"
      : "Migration complete",
    headline: "The season's fresh-movement read is complete.",
    detail: input.movementEngineId === "fall_entry_cooling"
      ? "Steelhead may remain in the river, but the fall-entry signal has handed off to winter holding. Winter activity requires a different water-temperature and feeding read."
      : "At this point in the season, current rain, river level, and water temperature no longer provide a dependable read on fresh arrivals.",
    tip: input.movementEngineId === "fall_entry_cooling"
      ? "Use the winter fishery read for activity and presentation decisions. Do not treat a muted Push as evidence that steelhead left the river."
      : "Stop searching lower travel lanes for a new wave. Fish only established late-season holding water supported by Fish In River, or shift to another seasonal species.",
    reasonCodes: ["push_tracking_complete"],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function directEventInactiveDetail(input: PushScoreInput): string {
  const policy = input.rules.directEvent!;
  const sources = policy.hydraulic === "trigger" &&
      policy.temperature === "trigger_and_constraint"
    ? "Measured river flow and water temperature"
    : policy.hydraulic === "trigger"
    ? "Measured river flow"
    : "Measured water temperature";
  const verb = policy.hydraulic === "trigger" &&
      policy.temperature === "trigger_and_constraint"
    ? "are"
    : "is";
  if (input.trackingState === "not_started") {
    return `${sources} ${verb} not scored as a fresh-movement event until this migration reaches Beginning.`;
  }
  if (input.trackingState === "complete") {
    return `${sources} ${verb} no longer scored for this completed seasonal Push window. This does not indicate current fish presence or absence.`;
  }
  return `${sources} ${verb} outside this species' active Push window and does not provide an in-season fresh-movement read.`;
}

function pushHeadline(
  label: string,
  input: PushScoreInput,
  components: PushScoreComponents,
): string {
  if (components.hydraulicState === "severe_high") {
    return "The river is rising hard, but extreme flow makes this an unreliable fresh-movement read.";
  }
  if (components.temperatureState === "migration_barrier") {
    return "The river is rising, but warm water prevents a dependable fresh-movement read.";
  }
  if (components.temperatureState === "cold_holding") {
    return "Steelhead may remain in the river, but water is cold enough to limit a dependable fresh-movement signal.";
  }
  if (
    components.hydraulicState === "high" &&
    label === "No clear push" &&
    input.flowSignal !== "falling" &&
    input.flowSignal !== "stable"
  ) {
    return "The river is rising, but already-high flow keeps this from being a clear fresh-movement signal.";
  }
  if (input.gaugeFreshness === "stale") {
    return "The water may support fresh movement, but an aging river reading limits confidence.";
  }
  switch (label) {
    case "Weak":
      return "The current window's water conditions show little support for fresh movement.";
    case "No clear push":
      return "The current window's water conditions do not show a clear fresh-movement signal.";
    case "Possible":
      return "The current window's water conditions offer some support for fresh fish moving into or through the river.";
    case "Strong":
      return "The current window's river rise and water temperature strongly support the possibility of fresh movement.";
    case "Very strong":
      return "The current window's water conditions show the strongest support for fresh movement.";
    default:
      return "A current-window fresh-movement read is available.";
  }
}

function hydraulicCopy(input: PushScoreInput): string {
  const levelContext = resolveHydraulicState(
      input.currentHydraulicValue!,
      input.rules,
    ) === "low"
    ? " Overall flow remains low."
    : resolveHydraulicState(input.currentHydraulicValue!, input.rules) ===
        "high"
    ? " Overall flow is already high."
    : resolveHydraulicState(input.currentHydraulicValue!, input.rules) ===
        "severe_high"
    ? " Overall flow is extremely high."
    : "";
  switch (input.flowSignal) {
    case "sharp_rise":
      return `The river is rising quickly, creating conditions fish often use to move.${levelContext}`;
    case "meaningful_rise":
      return `The river has made a clear rise since yesterday.${levelContext}`;
    case "rising":
      return `The river has started to rise since yesterday.${levelContext}`;
    case "falling":
      return `The river is falling instead of showing a fresh rise.${levelContext}`;
    case "stable":
      return `The river is holding steady with no meaningful rise yet.${levelContext}`;
    case "unknown":
      return `There is not enough recent river-level history to tell whether the river is rising or falling.${levelContext}`;
  }
}

function temperatureCopy(
  input: PushScoreInput,
  state: PushTemperatureState,
): string {
  const trend = temperatureTrendText(input.temperatureSignal);
  switch (state) {
    case "supportive":
      return `Water temperature is favorable for fall migration${trend}.`;
    case "transitional_warm":
      return `Water is on the warm side for fall migration${trend}.`;
    case "too_warm":
      return `Water temperature remains too warm to support a strong Push${trend}.`;
    case "migration_barrier":
      return "Water temperature is warm enough to seriously limit confidence in fresh movement.";
    case "cool_plateau":
      return "Water is already plenty cool for migration, so more cooling does not strengthen the read by itself.";
    case "cold_active":
      return "Water is cold enough for steelhead movement, but additional cooling increasingly favors slower holding behavior.";
    case "cold_holding":
      return "Water is at or below the cold-holding threshold, so active upstream movement is less likely even though steelhead may remain in the river.";
  }
}

function temperatureSourceCopy(input: PushScoreInput): string {
  if (input.temperaturePositiveSignalCap == null) return "";
  if (input.temperaturePositiveSignalCap === 0) {
    return "The temperature reading comes from farther upstream, so cooling there is not treated as proof of lower-river conditions.";
  }
  return "The temperature reading comes from farther upstream, which lowers confidence in how well it represents the lower river.";
}

function temperatureTrendText(signal: RawTemperatureTrendSignal): string {
  switch (signal) {
    case "strong_cooling":
      return " and is cooling sharply";
    case "cooling":
      return " and is cooling";
    case "warming":
      return " but is warming";
    case "strong_warming":
      return " but is warming sharply";
    case "neutral":
      return " and is relatively steady";
    case "neutral_missing":
      return "";
  }
}

function rainCopy(role: PushRainRole): string {
  switch (role) {
    case "precursor":
      return "Recent rain around the river may help, but the river has not responded enough for rain alone to create a strong Push.";
    case "partial_precursor":
      return "Recent rain around the river adds some support while the river begins to rise.";
    case "absorbed_by_gauge":
      return "The river has already made a meaningful rise, so that measured response carries the useful movement signal and rainfall adds no separate weight.";
    case "suppressed_high_flow":
      return "Additional rain does not improve the read while the river is already high.";
    case "dry":
      return "Recent weather estimates indicate very little rain around the river.";
    case "missing":
      return "Recent rainfall information is unavailable, so it adds no confidence.";
    case "neutral":
      return "Recent rainfall has been too light to meaningfully change the river.";
  }
}

function capCopy(
  input: PushScoreInput,
): string {
  if (input.gaugeFreshness === "stale") {
    return "The latest river-level reading is aging, so confidence is reduced.";
  }
  if (input.flowSignal === "unknown") {
    return "Without a dependable river trend, there is no clear Push.";
  }
  return "";
}

function pushTip(
  label: string,
  input: PushScoreInput,
  components: PushScoreComponents,
): string {
  if (components.hydraulicState === "severe_high") {
    return "Do not chase movement in the main channel. If Fishability remains usable, fish only protected margins, inside turns, and soft current with short controlled presentations.";
  }
  if (
    components.temperatureState === "too_warm" ||
    components.temperatureState === "migration_barrier"
  ) {
    return "Do not build the day around new arrivals while the river remains warm. Start in established holding water at first or last light and leave lower travel lanes secondary.";
  }
  if (components.temperatureState === "cold_holding") {
    return "Do not chase a new wave from this signal. Treat the fish as wintering steelhead and base the day on temperature-driven activity and controlled presentations in dependable holding water.";
  }
  if (input.flowSignal === "unknown" || input.gaugeFreshness === "stale") {
    return "Do not relocate the trip around this Push read. Begin in established holding water, verify the river at the first access, and add travel lanes only after confirming workable conditions.";
  }
  switch (label) {
    case "Weak":
      return "Skip the fresh-arrival hunt. Begin in established holding holes and fish each one thoroughly before moving; leave lower travel lanes as a secondary check.";
    case "No clear push":
      return "Fish established holding water from the head through the inside seam and tail. Do not spend the day racing between lower travel lanes for a wave the water does not support.";
    case "Possible":
      return "Start in lower-river travel lanes, then fish the first deep resting water immediately upstream. Move to established holding water if those entry routes stay quiet.";
    case "Strong":
      return "Begin on lower-river travel lanes and inside seams, then work the first resting holes along that route. Keep moving until fish establish a pattern; the signal still does not prove a wave entered.";
    case "Very strong":
      return "Start low and fish softer travel lanes, newly formed inside seams, and the first resting water above them. Skip any lane Fishability says is too fast or difficult to control.";
    default:
      return "Begin with the travel and holding water appropriate to Migration Stage, and keep the presentation inside the flow Fishability identifies as workable. Do not treat this signal as proof fish entered.";
  }
}

function unavailableResult(input: {
  reason:
    | "gauge"
    | "temperature"
    | "engine"
    | "direct_gauge"
    | "direct_temperature"
    | "direct_sources";
  reasonCodes: RiverRunReasonCode[];
  rules: PushRules;
}): PushScoreResult {
  if (input.reason === "direct_gauge") {
    return {
      score: null,
      label: "Unavailable",
      headline: "A current measured river-flow reading is unavailable.",
      detail:
        "A direct flow event cannot be estimated until the river sensor returns a current reading.",
      tip:
        "Keep Migration Stage primary and check again after the next four-hour update. Do not infer a fresh movement event from weather alone.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.reason === "direct_temperature") {
    return {
      score: null,
      label: "Unavailable",
      headline: "A current measured water-temperature reading is unavailable.",
      detail:
        "A direct cooling event cannot be estimated until the water-temperature sensor returns a current reading.",
      tip:
        "Keep Migration Stage primary and check again after the next four-hour update. Do not substitute air temperature for measured water.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.reason === "direct_sources") {
    return {
      score: null,
      label: "Unavailable",
      headline:
        "Current direct flow and water-temperature readings are unavailable.",
      detail:
        "A direct water event cannot be estimated until at least one required sensor returns a current reading.",
      tip:
        "Keep Migration Stage primary and check again after the next four-hour update. Do not substitute weather for measured water conditions.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.rules.hydraulic.sourceLabel === "Scottville") {
    const copy = input.reason === "temperature"
      ? {
        headline: "A current measured PM water temperature is unavailable.",
        detail:
          "Without measured water temperature, Scottville flow cannot produce a dependable fresh-movement read.",
        tip:
          "Keep the section named by Migration Stage. Do not chase a fresh wave until measured temperature returns.",
      }
      : input.reason === "gauge"
      ? {
        headline: "A current Scottville flow reading is unavailable.",
        detail:
          "Without Scottville flow and direction, rain cannot produce a dependable PM fresh-movement read.",
        tip:
          "Keep the section named by Migration Stage. Do not treat recent rain as proof of movement.",
      }
      : {
        headline: "This PM run does not have a supported Push model.",
        detail:
          "Another species or season’s water response would produce a misleading fresh-movement read.",
        tip:
          "Use Migration Stage for seasonal position. Do not borrow another run’s Push pattern.",
      };
    return {
      score: null,
      label: "Unavailable",
      ...copy,
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.reason === "temperature") {
    return {
      score: null,
      label: "Unavailable",
      headline:
        "There is no dependable Push read without a current water temperature.",
      detail:
        "Water temperature is a critical part of judging whether today's conditions support fresh movement, and that reading is missing.",
      tip:
        "Do not chase a fresh wave from this read. Fish established holding water for the current Migration Stage and check again after the next temperature update.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  if (input.reason === "engine") {
    return {
      score: null,
      label: "Unavailable",
      headline:
        "This species and season do not have a dependable Push read yet.",
      detail:
        "Different migrations respond to water and weather in different ways, so another species' movement pattern would give a misleading result.",
      tip:
        "Fish the river section and holding water identified by Migration Stage and Fish In River. Do not apply another species' rain-and-temperature pattern to this migration.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline: "There is no dependable Push read without a current river level.",
    detail:
      "The river's response is the most important part of a Push, and the latest level is missing or too old to use.",
    tip:
      "Begin in established holding water and keep lower travel lanes secondary. Check again after the next river update; do not chase recent rain as proof of a fresh wave.",
    reasonCodes: [...new Set(input.reasonCodes)],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
}

function hydraulicStateReasonCode(
  state: PushHydraulicState,
): RiverRunReasonCode {
  switch (state) {
    case "low":
      return "push_low_flow_context";
    case "normal":
      return "push_normal_flow_context";
    case "high":
      return "push_high_flow_context";
    case "severe_high":
      return "push_severe_high_flow_context";
  }
}

function temperatureStateReasonCode(
  state: PushTemperatureState,
): RiverRunReasonCode {
  switch (state) {
    case "supportive":
      return "push_temperature_supportive";
    case "transitional_warm":
      return "push_temperature_transitional";
    case "too_warm":
      return "push_temperature_too_warm";
    case "migration_barrier":
      return "push_temperature_migration_barrier";
    case "cool_plateau":
      return "push_temperature_cool_plateau";
    case "cold_active":
      return "push_temperature_cold_active";
    case "cold_holding":
      return "push_temperature_cold_holding";
  }
}

function rainRoleReasonCode(role: PushRainRole): RiverRunReasonCode {
  switch (role) {
    case "precursor":
      return "push_rain_precursor";
    case "partial_precursor":
      return "push_rain_partial_precursor";
    case "absorbed_by_gauge":
      return "push_rain_absorbed_by_gauge";
    case "suppressed_high_flow":
      return "push_rain_suppressed_high_flow";
    case "dry":
      return "dry_72h";
    case "neutral":
      return "light_rain_48h";
    case "missing":
      return "rain_missing";
  }
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

function applyCap(score: number, cap: number, appliedCaps: number[]): number {
  if (score > cap) appliedCaps.push(cap);
  return Math.min(score, cap);
}

function seasonalReturnPhrase(monthDay: string): string {
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3, 5));
  const period = day <= 10 ? "in early" : day <= 20 ? "in mid" : "in late";
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month - 1];
  return `${period} ${monthName}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
