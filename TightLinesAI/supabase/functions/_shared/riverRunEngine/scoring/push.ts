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
import {
  alternate,
  type RiverRunCopyVariant,
  RIVER_RUN_COPY_VERSION,
  resolveCopyVariant,
} from "../copy/variants.ts";

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
  copyVariant?: RiverRunCopyVariant;
  copyKey?: string;
};

export type PushScoreResult = PrimitiveDisplay & {
  components?: PushScoreComponents;
  rulesVersion?: string;
};

export const PUSH_SUPPORTIVE_SCORE_MINIMUM = 50;

const LAKE_ENTRY_DISCLAIMER =
  "Fresh fish can enter from the lake at any point during the active run, including without a textbook weather event. Fresh entries are more commonly associated with cooling, rainfall, and a river rise, but Push cannot confirm or rule out movement.";
const LAKE_ENTRY_DISCLAIMER_ALTERNATE =
  "A weather-supported Push raises the odds of fresh lake entry; it never proves that entry occurred. Fish can still move during the active run without an obvious cooling, rain, and river-rise combination.";

export function scorePush(input: PushScoreInput): PushScoreResult {
  const copyVariant = resolveCopyVariant(
    input.copyKey ??
      `${input.localDate ?? "undated"}:${input.trackingState}:${input.flowSignal}:${input.temperatureSignal}:${input.rainSignal}:${input.gaugeFreshness}`,
    input.copyVariant,
  );
  if (input.trackingState !== "active") {
    return inactiveTrackingResult(input, copyVariant);
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
      variant: copyVariant,
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
      variant: copyVariant,
    });
  }
  if (input.movementEngineId !== "fall_cooling") {
    return unavailableResult({
      reason: "engine",
      reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
      rules: input.rules,
      variant: copyVariant,
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
      variant: copyVariant,
    }),
    reasonCodes: [...reasonCodes],
    components,
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant,
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
  variant: RiverRunCopyVariant;
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
    headline: headlineForLabel(input.label, input.variant),
    detail,
    tip: alternate(
      input.variant,
      LAKE_ENTRY_DISCLAIMER,
      LAKE_ENTRY_DISCLAIMER_ALTERNATE,
    ),
  };
}

function inactiveTrackingResult(
  input: PushScoreInput,
  variant: RiverRunCopyVariant,
): PushScoreResult {
  if (input.trackingState === "not_started") {
    return {
      score: null,
      label: "Tracking not started",
      headline: alternate(
        variant,
        `Push tracking begins ${displayLocalDate(input.trackingStartDate)}.`,
        `Fresh-entry conditions will begin reporting ${
          displayLocalDate(input.trackingStartDate)
        }.`,
      ),
      detail:
        "That is this river's configured run start. Before then, Run Stage covers possible lake, harbor, and river-mouth staging; Push does not imply river entry before tracking opens.",
      tip: alternate(
        variant,
        "Push will begin automatically when this specific river run begins.",
        "Until then, use the staging context without treating it as evidence of river movement.",
      ),
      reasonCodes: ["push_tracking_not_started"],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
      copyVariant: variant,
    };
  }
  return {
    score: null,
    label: "Tracking complete",
    headline: alternate(
      variant,
      "Fresh-push tracking is complete for this run.",
      "This run's fresh-entry conditions are no longer reported.",
    ),
    detail: `The configured river run ended ${
      displayLocalDate(input.trackingEndDate)
    }. Push no longer reports current movement-trigger conditions or prior supportive-condition dates.`,
    tip: alternate(
      variant,
      "Run Stage and Fish In River continue to describe the remaining seasonal context.",
      "Use the calendar and historical-presence cards for any remaining late-run context.",
    ),
    reasonCodes: ["push_tracking_complete"],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant: variant,
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

function headlineForLabel(
  label: string,
  variant: RiverRunCopyVariant,
): string {
  switch (label) {
    case "Weak":
      return alternate(
        variant,
        "Current conditions show a weak fresh-push signal.",
        "Little in the current water pattern supports a fresh push.",
      );
    case "No clear push":
      return alternate(
        variant,
        "Current conditions do not show a clear fresh-push signal.",
        "The current signals do not align into a clear push.",
      );
    case "Possible":
      return alternate(
        variant,
        "Current conditions show a possible fresh-push signal.",
        "The river has some support for a fresh push.",
      );
    case "Strong":
      return alternate(
        variant,
        "Current conditions support a strong fresh-push signal.",
        "The measured pattern strongly favors a fresh push.",
      );
    case "Very strong":
      return alternate(
        variant,
        "Current conditions support a very strong fresh-push signal.",
        "River rise and cooling align into the strongest fresh-push class.",
      );
    default:
      return alternate(
        variant,
        "Current fresh-entry conditions are available.",
        "Push has a current movement-condition read.",
      );
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
    ? `${source} is ${round(value)} ${unit} and has changed ${
      signed(absolute)
    } ${unit} (${
      signed(percent)
    }%) since roughly the same time yesterday`
    : `${source} is ${round(value)} ${unit} but does not have a usable same-time-yesterday comparison`;
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
      return `${measurement}. The ${metric} trend is therefore unresolved.`;
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
      return `${value} is already cool enough that additional cooling adds no extra Push credit.`;
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
      return `Recent modeled rainfall adds modest early support because ${hydraulicSourceLabel} has not yet shown the full river response.`;
    case "partial_precursor":
      return `Recent modeled rainfall adds only limited early support because ${hydraulicSourceLabel} has already begun rising.`;
    case "absorbed_by_gauge":
      return `Rain is already reflected in the meaningful ${hydraulicSourceLabel} rise, so it is not counted a second time.`;
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
  variant: RiverRunCopyVariant;
}): PushScoreResult {
  if (input.reason === "temperature") {
    return {
      score: null,
      label: "Unavailable",
      headline: alternate(
        input.variant,
        "Push is unavailable without a current measured water temperature.",
        "A fresh-push signal cannot be rated until measured water temperature returns.",
      ),
      detail:
        "A fresh reading from an approved water-temperature source is required to evaluate current movement-trigger conditions.",
      tip: `${
        alternate(
          input.variant,
          LAKE_ENTRY_DISCLAIMER,
          LAKE_ENTRY_DISCLAIMER_ALTERNATE,
        )
      } Check again after the next condition refresh.`,
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
      copyVariant: input.variant,
    };
  }
  if (input.reason === "engine") {
    return {
      score: null,
      label: "Unavailable",
      headline: alternate(
        input.variant,
        "Push is unavailable for this run type.",
        "This run does not yet have an audited Push model.",
      ),
      detail:
        "A Push decision table has not been researched and implemented for the selected seasonal movement pattern.",
      tip: alternate(
        input.variant,
        "River Run will not substitute rules from a different run type.",
        "The feature stays unavailable instead of guessing with another season's rules.",
      ),
      reasonCodes: [...new Set(input.reasonCodes)],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
      copyVariant: input.variant,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline: alternate(
      input.variant,
      "Push is unavailable without a current gauge reading.",
      "The river response cannot be rated until the gauge updates.",
    ),
    detail: `A usable ${input.rules.hydraulic.sourceLabel} ${
      input.rules.hydraulic.metric === "flow_cfs" ? "discharge" : "gage-height"
    } reading is required to evaluate the current river response.`,
    tip: `${
      alternate(
        input.variant,
        LAKE_ENTRY_DISCLAIMER,
        LAKE_ENTRY_DISCLAIMER_ALTERNATE,
      )
    } Check again after the next condition refresh.`,
    reasonCodes: [...new Set(input.reasonCodes)],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant: input.variant,
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
