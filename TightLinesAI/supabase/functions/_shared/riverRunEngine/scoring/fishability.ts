import type {
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  PrimitiveDisplay,
  RawFlowTrendSignal,
  RiverRunReasonCode,
} from "../types.ts";
import { flowBandReasonCode } from "../metrics/flow.ts";

export type FishabilityScoreComponents = {
  bandBase: number;
  trendModifier: number;
  appliedCaps: number[];
};

export type FishabilityScoreInput = {
  rules: FishabilityBands;
  gaugeFreshness: GaugeFreshness;
  flowBand?: FlowBand;
  flowSignal: RawFlowTrendSignal;
  currentHydraulicValue?: number | null;
  hydraulicAbsoluteChange24h?: number | null;
  hydraulicPercentChange24h?: number | null;
  flowReasonCodes?: RiverRunReasonCode[];
};

export type FishabilityScoreResult = PrimitiveDisplay & {
  components?: FishabilityScoreComponents;
  rulesVersion?: string;
};

export function scoreFishability(
  input: FishabilityScoreInput,
): FishabilityScoreResult {
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h" ||
    !isNumber(input.currentHydraulicValue)
  ) {
    return unavailableResult(input, "gauge");
  }
  if (!input.flowBand) return unavailableResult(input, "band");

  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    ...(input.flowReasonCodes ?? []),
    flowBandReasonCode(input.flowBand),
  ]);
  const bandBase = bandBaseScore(input.flowBand);
  const trendModifier = trendScoreModifier(input.flowSignal);
  const appliedCaps: number[] = [];
  let score = bandBase + trendModifier;

  if (input.flowBand === "very_low") {
    score = applyCap(score, input.rules.caps.veryLow, appliedCaps);
    reasonCodes.add("fishability_very_low_cap");
  }
  if (input.flowBand === "blown_out") {
    score = applyCap(score, input.rules.caps.blownOut, appliedCaps);
    reasonCodes.add("fishability_blown_out_cap");
  }
  if (
    input.flowSignal === "sharp_rise" &&
    (input.flowBand === "high_fishable" ||
      input.flowBand === "very_high" ||
      input.flowBand === "blown_out")
  ) {
    score = applyCap(score, input.rules.caps.sharpRiseHigh, appliedCaps);
    reasonCodes.add("fishability_sharp_rise_high_cap");
  }
  if (input.flowSignal === "unknown") {
    score = applyCap(score, input.rules.caps.unknownTrend, appliedCaps);
    reasonCodes.add("fishability_unknown_trend_cap");
  }
  if (input.gaugeFreshness === "stale") {
    score = applyCap(score, input.rules.caps.staleGauge, appliedCaps);
    reasonCodes.add("fishability_stale_gauge_cap");
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  const label = fishabilityLabel(finalScore);
  const components = {
    bandBase,
    trendModifier,
    appliedCaps: [...new Set(appliedCaps)].toSorted((a, b) => a - b),
  };
  return {
    score: finalScore,
    label,
    ...fishabilityCopy({
      label,
      flowBand: input.flowBand,
      flowSignal: input.flowSignal,
      currentHydraulicValue: input.currentHydraulicValue,
      hydraulicAbsoluteChange24h: input.hydraulicAbsoluteChange24h,
      hydraulicPercentChange24h: input.hydraulicPercentChange24h,
      rules: input.rules,
    }),
    reasonCodes: [...reasonCodes],
    components,
    rulesVersion: input.rules.version,
  };
}

function bandBaseScore(band: FlowBand): number {
  switch (band) {
    case "very_low":
      return 35;
    case "low":
      return 55;
    case "normal_fishable":
      return 70;
    case "ideal":
      return 88;
    case "high_fishable":
      return 68;
    case "very_high":
      return 40;
    case "blown_out":
      return 15;
  }
}

function trendScoreModifier(signal: RawFlowTrendSignal): number {
  switch (signal) {
    case "stable":
      return 5;
    case "falling":
      return 2;
    case "rising":
      return 0;
    case "meaningful_rise":
      return -8;
    case "sharp_rise":
      return -20;
    case "unknown":
      return -10;
  }
}

function fishabilityLabel(score: number): string {
  if (score <= 24) return "Poor";
  if (score <= 49) return "Tough";
  if (score <= 69) return "Fishable";
  if (score <= 84) return "Good";
  return "Excellent";
}

function fishabilityCopy(input: {
  label: string;
  flowBand: FlowBand;
  flowSignal: RawFlowTrendSignal;
  currentHydraulicValue: number;
  hydraulicAbsoluteChange24h?: number | null;
  hydraulicPercentChange24h?: number | null;
  rules: FishabilityBands;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const unit = input.rules.metric === "flow_cfs" ? "cfs" : "ft";
  const current = `${round(input.currentHydraulicValue)} ${unit}`;
  const comparison = isNumber(input.hydraulicAbsoluteChange24h) &&
      isNumber(input.hydraulicPercentChange24h)
    ? `changed ${signed(input.hydraulicAbsoluteChange24h)} ${unit} (${
      signed(input.hydraulicPercentChange24h)
    }%) over the matched 24-hour comparison`
    : "does not have a trustworthy matched 24-hour comparison";
  return {
    headline: headlineForLabel(input.label),
    detail: `${input.rules.sourceLabel} is ${current}, inside the configured ${
      flowBandLabel(input.flowBand)
    } band, and ${comparison}. ${trendMeaning(input.flowSignal)}`,
    tip: fishabilityTip(input.flowBand, input.flowSignal),
  };
}

function headlineForLabel(label: string): string {
  switch (label) {
    case "Poor":
      return "The primary gauged reach is currently poor for consistent fishing.";
    case "Tough":
      return "The primary gauged reach currently presents meaningful constraints.";
    case "Fishable":
      return "The primary gauged reach currently remains workable.";
    case "Good":
      return "The primary gauged reach currently supports good fishing conditions.";
    case "Excellent":
      return "The primary gauged reach is currently in an excellent working range.";
    default:
      return "The current primary-reach fishing shape is available.";
  }
}

function trendMeaning(signal: RawFlowTrendSignal): string {
  switch (signal) {
    case "stable":
      return "The river is relatively stable.";
    case "falling":
      return "The river is falling materially.";
    case "rising":
      return "The river has an early rise.";
    case "meaningful_rise":
      return "The river is changing enough to reduce presentation consistency.";
    case "sharp_rise":
      return "The sharp rise substantially reduces hydraulic predictability.";
    case "unknown":
      return "The unresolved trend reduces confidence in the current shape.";
  }
}

function fishabilityTip(
  band: FlowBand,
  trend: RawFlowTrendSignal,
): string {
  if (trend === "sharp_rise") {
    return "A fast-changing river can make access and presentation less predictable. This is not a wading or boating safety determination.";
  }
  switch (band) {
    case "very_low":
      return "Very low water can reduce cover and make presentations less forgiving; it does not mean fish are absent.";
    case "low":
      return "Lower water remains workable, but reduced cover can make the river less forgiving.";
    case "normal_fishable":
      return "This is a workable primary-reach shape with fewer hydraulic advantages than the configured ideal band.";
    case "ideal":
      return "This band offers the broadest primary-reach presentation options represented by the configured gauge.";
    case "high_fishable":
      return "Higher water remains fishable, but some access and presentation options may narrow.";
    case "very_high":
      return "Very high water can materially limit access and presentation. This is not a wading or boating safety determination.";
    case "blown_out":
      return "This primary-reach hydraulic state is rarely workable for consistent fishing. Do not treat Fishability as a safety rating.";
  }
}

function flowBandLabel(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "Very Low";
    case "low":
      return "Low";
    case "normal_fishable":
      return "Normal Fishable";
    case "ideal":
      return "Ideal";
    case "high_fishable":
      return "High Fishable";
    case "very_high":
      return "Very High";
    case "blown_out":
      return "Blown Out";
  }
}

function unavailableResult(
  input: FishabilityScoreInput,
  reason: "gauge" | "band",
): FishabilityScoreResult {
  if (reason === "band") {
    return {
      score: null,
      label: "Unavailable",
      headline:
        "Current primary-reach shape is unavailable without a configured river band.",
      detail:
        "A current primary-gauge value must resolve against the audited reach-specific Fishability thresholds.",
      tip:
        "Fishability stays unavailable rather than substituting seasonal percentiles for physical fishing thresholds.",
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        "baseline_missing",
        ...(input.flowReasonCodes ?? []),
      ],
      rulesVersion: input.rules.version,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline:
      "Fishability is unavailable without a current primary-gauge read.",
    detail: `A usable ${input.rules.sourceLabel} ${
      input.rules.metric === "flow_cfs" ? "discharge" : "gage-height"
    } reading is required to describe current primary-reach shape.`,
    tip: "Check again after the next condition refresh.",
    reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
    rulesVersion: input.rules.version,
  };
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

function signed(value: number): string {
  const rounded = round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
