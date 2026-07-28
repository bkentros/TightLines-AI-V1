import type {
  FishabilityBands,
  FlowBand,
  GaugeFreshness,
  PrimitiveDisplay,
  RawFlowTrendSignal,
  RiverRunReasonCode,
} from "../types.ts";
import {
  alternate,
  type RiverRunCopyVariant,
  RIVER_RUN_COPY_VERSION,
  resolveCopyVariant,
} from "../copy/variants.ts";
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
  localDate?: string;
  copyVariant?: RiverRunCopyVariant;
  copyKey?: string;
};

export type FishabilityScoreResult = PrimitiveDisplay & {
  components?: FishabilityScoreComponents;
  rulesVersion?: string;
};

export function scoreFishability(
  input: FishabilityScoreInput,
): FishabilityScoreResult {
  const copyVariant = resolveCopyVariant(
    input.copyKey ??
      `${input.localDate ?? "undated"}:${input.flowBand ?? "no-band"}:${input.flowSignal}:${input.gaugeFreshness}`,
    input.copyVariant,
  );
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h" ||
    !isNumber(input.currentHydraulicValue)
  ) {
    return unavailableResult(input, "gauge", copyVariant);
  }
  if (!input.flowBand) return unavailableResult(input, "band", copyVariant);

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
      variant: copyVariant,
    }),
    reasonCodes: [...reasonCodes],
    components,
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant,
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
  variant: RiverRunCopyVariant;
}): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  const unit = input.rules.metric === "flow_cfs" ? "cfs" : "ft";
  const current = `${round(input.currentHydraulicValue)} ${unit}`;
  const comparison = isNumber(input.hydraulicAbsoluteChange24h) &&
      isNumber(input.hydraulicPercentChange24h)
    ? `has changed ${signed(input.hydraulicAbsoluteChange24h)} ${unit} (${
      signed(input.hydraulicPercentChange24h)
    }%) since roughly the same time yesterday`
    : "does not have a trustworthy same-time-yesterday comparison";
  return {
    headline: headlineForLabel(input.label, input.variant),
    detail: `${input.rules.sourceLabel} is ${current}, inside this river's ${
      flowBandLabel(input.flowBand)
    } band, and ${comparison}. ${trendMeaning(input.flowSignal)} This describes the stretch represented by the ${input.rules.sourceLabel} gauge; it does not rate fish abundance or predict a bite.`,
    tip: fishabilityTip(input.flowBand, input.flowSignal, input.variant),
  };
}

function headlineForLabel(
  label: string,
  variant: RiverRunCopyVariant,
): string {
  switch (label) {
    case "Poor":
      return alternate(
        variant,
        "The gauged river stretch is poor for consistent fishing right now.",
        "Current river shape creates major fishing limitations.",
      );
    case "Tough":
      return alternate(
        variant,
        "The gauged river stretch is fishable, but conditions are demanding.",
        "Current river shape leaves a narrow margin for consistent fishing.",
      );
    case "Fishable":
      return alternate(
        variant,
        "The gauged river stretch is workable right now.",
        "Current river shape supports a fishable window.",
      );
    case "Good":
      return alternate(
        variant,
        "The gauged river stretch has a good fishing shape.",
        "Current flow supports good presentation options.",
      );
    case "Excellent":
      return alternate(
        variant,
        "The gauged river stretch is in an excellent working range.",
        "Current river shape offers the broadest presentation options.",
      );
    default:
      return alternate(
        variant,
        "The current gauged-river fishing shape is available.",
        "The gauge provides a current river-shape read.",
      );
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
      return "The river is rising enough to make presentation less consistent.";
    case "sharp_rise":
      return "The sharp rise makes holding water, access, and presentation less predictable.";
    case "unknown":
      return "The unresolved trend reduces confidence in the current shape.";
  }
}

function fishabilityTip(
  band: FlowBand,
  trend: RawFlowTrendSignal,
  variant: RiverRunCopyVariant,
): string {
  if (trend === "sharp_rise") {
    return alternate(
      variant,
      "A fast-changing river can quickly alter access, holding water, and presentation. This is not a wading or boating safety determination.",
      "Favor conservative access and water with softer current while the rise settles. Fishability is not a safety rating.",
    );
  }
  switch (band) {
    case "very_low":
      return alternate(
        variant,
        "Very low water reduces cover and forgiveness. Favor low light, deeper slots, and a quiet approach; low water does not mean fish are absent.",
        "Expect exposed fish and fewer comfortable lies. Scale down disturbance and concentrate on depth and shade.",
      );
    case "low":
      return alternate(
        variant,
        "Lower water remains workable, but a quieter approach and the best available depth usually matter more.",
        "Reduced cover can make fish less forgiving; prioritize low light, broken surface, and deeper travel lanes.",
      );
    case "normal_fishable":
      return alternate(
        variant,
        "This is a dependable, workable river shape, though it offers fewer hydraulic advantages than the ideal band.",
        "Most standard presentations remain practical; let current speed and available cover choose the lane.",
      );
    case "ideal":
      return alternate(
        variant,
        "This band offers the broadest mix of holding water and presentation options represented by the gauge.",
        "Use the full range of productive seams, slots, and travel lanes available at this flow.",
      );
    case "high_fishable":
      return alternate(
        variant,
        "Higher water remains fishable; focus on softer edges, inside seams, and protected travel lanes.",
        "Some access and presentations narrow, while softer current near structure becomes more important.",
      );
    case "very_high":
      return alternate(
        variant,
        "Very high water materially narrows access and presentation. Favor protected edges and soft current; this is not a safety determination.",
        "Workable water may be limited to the softest margins and inside turns. Fishability is not a wading or boating safety rating.",
      );
    case "blown_out":
      return alternate(
        variant,
        "This river shape is rarely workable for consistent fishing. Wait for the river to recover; Fishability is not a safety rating.",
        "Access, visibility, and presentation are too compromised for a dependable recommendation. Do not treat this as a safety determination.",
      );
  }
}

function flowBandLabel(band: FlowBand): string {
  switch (band) {
    case "very_low":
      return "Very Low";
    case "low":
      return "Low";
    case "normal_fishable":
      return "Normal";
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
  variant: RiverRunCopyVariant,
): FishabilityScoreResult {
  if (reason === "band") {
    return {
      score: null,
      label: "Unavailable",
      headline: alternate(
        variant,
        "Fishability is unavailable until this river has audited flow bands.",
        "This gauge reading cannot be rated without river-specific fishing thresholds.",
      ),
      detail:
        "A current gauge value must be matched to audited thresholds for the river stretch that gauge represents.",
      tip: alternate(
        variant,
        "Fishability stays unavailable rather than substituting a generic or seasonal percentile.",
        "No other river's thresholds are borrowed to fill this gap.",
      ),
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        "baseline_missing",
        ...(input.flowReasonCodes ?? []),
      ],
      rulesVersion: input.rules.version,
      copyVersion: RIVER_RUN_COPY_VERSION,
      copyVariant: variant,
    };
  }
  return {
    score: null,
    label: "Unavailable",
    headline: alternate(
      variant,
      "Fishability is unavailable without a current gauge reading.",
      "A current river-shape rating cannot be made yet.",
    ),
    detail: `A usable ${input.rules.sourceLabel} ${
      input.rules.metric === "flow_cfs" ? "discharge" : "gage-height"
    } reading is required to describe the river stretch represented by this gauge.`,
    tip: alternate(
      variant,
      "Check again after the next condition refresh.",
      "The card will rate river shape as soon as a usable gauge reading returns.",
    ),
    reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
    rulesVersion: input.rules.version,
    copyVersion: RIVER_RUN_COPY_VERSION,
    copyVariant: variant,
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
