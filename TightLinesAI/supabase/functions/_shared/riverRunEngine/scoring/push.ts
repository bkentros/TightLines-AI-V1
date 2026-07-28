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
};

export type PushScoreResult = PrimitiveDisplay & {
  components?: PushScoreComponents;
  rulesVersion?: string;
};

export const PUSH_SUPPORTIVE_SCORE_MINIMUM = 50;

const LAKE_ENTRY_DISCLAIMER =
  "Fresh fish can enter from the lake at any point during the active run, including without a textbook weather event. Fresh entries are more commonly associated with cooling, rainfall, and a river rise, but Push cannot confirm or rule out movement.";

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
    rainCopy(
      input.components.rainRole,
      input.input.rules.hydraulic.sourceLabel,
    ),
    capCopy(input.input, input.components),
  ].filter(Boolean).join(" ");
  return {
    headline: headlineForLabel(input.label),
    detail,
    tip: LAKE_ENTRY_DISCLAIMER,
  };
}

function inactiveTrackingResult(input: PushScoreInput): PushScoreResult {
  if (input.trackingState === "not_started") {
    return {
      score: null,
      label: "Tracking not started",
      headline: `Push tracking begins ${
        displayLocalDate(input.trackingStartDate)
      }.`,
      detail:
        "This is the configured river-run start date. Before then, nearby lake, harbor, and river-mouth staging is covered by Run Stage rather than a river-entry Push report.",
      tip: "Push will begin automatically when this specific river run begins.",
      reasonCodes: ["push_tracking_not_started"],
      rulesVersion: input.rules.version,
    };
  }
  return {
    score: null,
    label: "Tracking complete",
    headline: "Fresh-push tracking is complete for this run.",
    detail: `The configured river run ended ${
      displayLocalDate(input.trackingEndDate)
    }. Push no longer reports current movement-trigger conditions or prior supportive-condition dates.`,
    tip:
      "Run Stage and Fish In River continue to describe the remaining seasonal context.",
    reasonCodes: ["push_tracking_complete"],
    rulesVersion: input.rules.version,
  };
}

function displayLocalDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const months = [
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
  ];
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

function headlineForLabel(label: string): string {
  switch (label) {
    case "Weak":
      return "Current conditions show a weak fresh-push signal.";
    case "No clear push":
      return "Current conditions do not show a clear fresh-push signal.";
    case "Possible":
      return "Current conditions show a possible fresh-push signal.";
    case "Strong":
      return "Current conditions support a strong fresh-push signal.";
    case "Very strong":
      return "Current conditions support a very strong fresh-push signal.";
    default:
      return "Current trigger conditions are available.";
  }
}

function hydraulicCopy(input: PushScoreInput): string {
  const value = input.currentHydraulicValue;
  const absolute = input.hydraulicAbsoluteChange24h;
  const percent = input.hydraulicPercentChange24h;
  const source = input.rules.hydraulic.sourceLabel;
  const unit = input.rules.hydraulic.metric === "flow_cfs" ? "cfs" : "ft";
  const metric = input.rules.hydraulic.metric === "flow_cfs"
    ? "discharge"
    : "gage height";
  const measurement = isNumber(absolute) && isNumber(percent)
    ? `${source} changed ${signed(absolute)} ${unit} (${
      signed(percent)
    }%) over the matched 24-hour comparison`
    : `${source} does not have a usable matched 24-hour comparison`;
  switch (input.flowSignal) {
    case "sharp_rise":
      return `${measurement}, a sharp river response.`;
    case "meaningful_rise":
      return `${measurement}, a meaningful river response.`;
    case "rising":
      return `${measurement}, an early river response.`;
    case "falling":
      return `${measurement}, with the river falling.`;
    case "stable":
      return `${measurement}, with no material river response yet.`;
    case "unknown":
      return `${measurement}. Current ${metric} is ${round(value)} ${unit}.`;
  }
}

function temperatureCopy(
  input: PushScoreInput,
  state: PushTemperatureState,
): string {
  const value = `${round(input.waterTempF)}°F measured water`;
  const trend = temperatureTrendText(input.temperatureSignal);
  switch (state) {
    case "supportive":
      return `${value} is inside the configured ${input.rules.temperature.suitabilityLabel} range${trend}.`;
    case "transitional_warm":
      return `${value} is just above the supportive range${trend}.`;
    case "too_warm":
      return `${value} remains too warm for a strong positive Push classification${trend}.`;
    case "migration_barrier":
      return `${value} is at the configured warm migration-constraint threshold.`;
    case "cool_plateau":
      return `${value} is below the movement-support range; additional cooling receives no extra credit.`;
  }
}

function temperatureSourceCopy(input: PushScoreInput): string {
  if (input.temperaturePositiveSignalCap == null) return "";
  if (input.temperaturePositiveSignalCap === 0) {
    return "The selected measured-water reading is an upstream fallback: warm constraints still apply, but cooling adds no positive credit.";
  }
  return "The selected measured-water reading is an upstream fallback, so positive cooling influence is reduced.";
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

function rainCopy(role: PushRainRole, hydraulicSourceLabel: string): string {
  switch (role) {
    case "precursor":
      return `The recent modeled rainfall estimate adds modest precursor value because ${hydraulicSourceLabel} has not shown a full river response.`;
    case "partial_precursor":
      return `The recent modeled rainfall estimate adds only limited precursor value because ${hydraulicSourceLabel} has begun rising.`;
    case "absorbed_by_gauge":
      return `The recent modeled rainfall estimate is context only once ${hydraulicSourceLabel} shows a meaningful rise; it is not scored twice.`;
    case "suppressed_high_flow":
      return `Modeled rainfall adds no positive credit while ${hydraulicSourceLabel} is already high.`;
    case "dry":
      return "The preceding 72-hour rainfall estimate is effectively dry.";
    case "missing":
      return "Rain evidence is unavailable and adds no credit.";
    case "neutral":
      return "The recent modeled rainfall estimate is too light to add precursor value.";
  }
}

function capCopy(
  input: PushScoreInput,
  components: PushScoreComponents,
): string {
  if (components.hydraulicState === "severe_high") {
    return "Severe high flow caps Push even when movement-trigger inputs otherwise align.";
  }
  if (components.temperatureState === "migration_barrier") {
    return "The warm-water barrier caps Push.";
  }
  if (input.gaugeFreshness === "stale") {
    return "The stale gauge reading caps confidence.";
  }
  if (input.flowSignal === "unknown") {
    return "Without a matched 24-hour river comparison, Push cannot reach Possible.";
  }
  return "";
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
        "Push is unavailable without a current measured water temperature.",
      detail:
        "A fresh reading from an approved water-temperature source is required to evaluate current movement-trigger conditions.",
      tip:
        `${LAKE_ENTRY_DISCLAIMER} Check again after the next condition refresh.`,
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
    };
  }
  if (input.reason === "engine") {
    return {
      score: null,
      label: "Unavailable",
      headline: "Push is unavailable for this movement engine.",
      detail:
        "The selected movement engine does not have an implemented Push decision table.",
      tip: "Use only an audited, implemented movement engine.",
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline: "Push is unavailable without a current primary-gauge read.",
    detail: `A usable ${input.rules.hydraulic.sourceLabel} ${
      input.rules.hydraulic.metric === "flow_cfs" ? "discharge" : "gage-height"
    } reading is required to evaluate the current river response.`,
    tip:
      `${LAKE_ENTRY_DISCLAIMER} Check again after the next condition refresh.`,
    reasonCodes: [...new Set(input.reasonCodes)],
    rulesVersion: input.rules.version,
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

function signed(value: number): string {
  const rounded = round(value);
  return rounded > 0 ? `+${rounded}` : String(rounded);
}

function round(value: number | null | undefined): number {
  return isNumber(value) ? Math.round(value * 10) / 10 : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
