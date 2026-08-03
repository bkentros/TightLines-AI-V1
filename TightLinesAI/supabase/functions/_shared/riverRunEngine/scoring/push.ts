import type {
  GaugeFreshness,
  MovementEngineId,
  PrimitiveDisplay,
  PushRules,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";
import { RIVER_RUN_COPY_VERSION } from "../copy/version.ts";

export type PushHydraulicState = "low" | "normal" | "high" | "severe_high";
export type PushTemperatureState =
  | "supportive"
  | "transitional_warm"
  | "too_warm"
  | "migration_barrier"
  | "cool_plateau";
export type PushRainRole =
  | "precursor"
  | "partial_precursor"
  | "absorbed_by_gauge"
  | "suppressed_high_flow"
  | "dry"
  | "neutral"
  | "missing";
export type PushTrackingState = "not_started" | "active" | "complete";

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
};

export type PushScoreResult = PrimitiveDisplay & {
  components?: PushScoreComponents;
  rulesVersion?: string;
};

export const PUSH_SUPPORTIVE_SCORE_MINIMUM = 50;

export function scorePush(input: PushScoreInput): PushScoreResult {
  if (input.trackingState !== "active") {
    return inactiveTrackingResult(input);
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
  if (input.movementEngineId !== "fall_cooling") {
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
): PushTemperatureState {
  if (waterTempF >= rules.temperature.migrationBarrierF) {
    return "migration_barrier";
  }
  if (waterTempF > rules.temperature.tooWarmF) return "too_warm";
  if (waterTempF > rules.temperature.supportiveMaxF) {
    return "transitional_warm";
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
  const detail = [
    hydraulicCopy(input.input),
    temperatureCopy(input.input, input.components.temperatureState),
    temperatureSourceCopy(input.input),
    rainCopy(input.components.rainRole),
    capCopy(input.input),
  ].filter(Boolean).join(" ");
  return {
    headline: pushHeadline(input.label, input.input, input.components),
    detail,
    tip: pushTip(input.label, input.input, input.components),
  };
}

function inactiveTrackingResult(
  input: PushScoreInput,
): PushScoreResult {
  if (input.trackingState === "not_started") {
    return {
      score: null,
      label: "Waiting for run",
      headline: "The river run has not started, so there is no Push read yet.",
      detail:
        "Push is meant to spot water conditions that may help fish enter or move during the active run. Before that, most opportunity should remain in the lake, harbor, or river-mouth transition.",
      tip:
        "Keep the trip in the lake, harbor, and river-mouth zone. Do not move inland just because rain or cooling resembles an in-season movement event.",
      reasonCodes: ["push_tracking_not_started"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
    };
  }
  return {
    score: null,
    label: "Run complete",
    headline: "The season's fresh-movement read is complete.",
    detail:
      "At this point in the season, current rain, river level, and water temperature no longer provide a dependable read on fresh arrivals.",
    tip:
      "Stop searching lower travel lanes for a new wave. Fish only established late-season holding water supported by Fish In River, or shift to another seasonal species.",
    reasonCodes: ["push_tracking_complete"],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
  };
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
      return "Today's water shows little support for a fresh wave of fish.";
    case "No clear push":
      return "Today's water does not show a clear signal for a fresh wave of fish.";
    case "Possible":
      return "Today's water offers some support for fresh fish moving into or through the river.";
    case "Strong":
      return "Today's river rise and water temperature strongly support the possibility of a fresh wave moving into the river.";
    case "Very strong":
      return "Today's water shows the strongest support for a fresh wave moving into the river.";
    default:
      return "A current read of fresh-wave potential is available.";
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
      return "Begin with the travel and holding water appropriate to Run Stage, and keep the presentation inside the flow Fishability identifies as workable. Do not treat this signal as proof fish entered.";
  }
}

function unavailableResult(input: {
  reason: "gauge" | "temperature" | "engine";
  reasonCodes: RiverRunReasonCode[];
  rules: PushRules;
}): PushScoreResult {
  if (input.reason === "temperature") {
    return {
      score: null,
      label: "Unavailable",
      headline:
        "There is no dependable Push read without a current water temperature.",
      detail:
        "Water temperature is a critical part of judging whether today's conditions support fresh movement, and that reading is missing.",
      tip:
        "Do not chase a fresh wave from this read. Fish established holding water for the current Run Stage and check again after the next temperature update.",
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
        "Different migrations respond to water and weather in different ways, so another run's movement pattern would give a misleading result.",
      tip:
        "Fish the river section and holding water identified by Run Stage and Fish In River. Do not apply another species' rain-and-temperature pattern to this migration.",
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
