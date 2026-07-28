import type {
  FlowBand,
  RawFlowTrendSignal,
  RiverRunReasonCode,
} from "../types.ts";

export type FlowTrendInput = {
  currentValue?: number | null;
  value24hAgo?: number | null;
  rising24hAbsolute?: number;
  rising24hPercent?: number;
  meaningfulRise24hAbsolute?: number;
  meaningfulRise24hPercent?: number;
  sharpRise24hAbsolute?: number;
  sharpRise24hPercent?: number;
};

export type FlowTrendResult = {
  rawSignal: RawFlowTrendSignal;
  absoluteChange24h: number | null;
  percentChange24h: number | null;
  reasonCodes: RiverRunReasonCode[];
};

export function resolveFlowTrendSignal(input: FlowTrendInput): FlowTrendResult {
  const current = input.currentValue;
  const prior = input.value24hAgo;
  if (!isUsableNumber(current) || !isUsableNumber(prior) || prior <= 0) {
    return {
      rawSignal: "unknown",
      absoluteChange24h: null,
      percentChange24h: null,
      reasonCodes: ["flow_trend_unknown"],
    };
  }

  const absolute = current - prior;
  const pct = (absolute / prior) * 100;
  const risingAbsolute = input.rising24hAbsolute ?? 0;
  const rising = input.rising24hPercent ?? 10;
  const meaningfulRiseAbsolute = input.meaningfulRise24hAbsolute ?? 0;
  const meaningfulRise = input.meaningfulRise24hPercent ?? 25;
  const sharpRiseAbsolute = input.sharpRise24hAbsolute ?? 0;
  const sharpRise = input.sharpRise24hPercent ?? 50;

  if (pct <= -10) {
    return {
      rawSignal: "falling",
      absoluteChange24h: absolute,
      percentChange24h: pct,
      reasonCodes: ["flow_falling_24h"],
    };
  }
  if (absolute >= sharpRiseAbsolute && pct >= sharpRise) {
    return {
      rawSignal: "sharp_rise",
      absoluteChange24h: absolute,
      percentChange24h: pct,
      reasonCodes: ["flow_sharp_rise_24h"],
    };
  }
  if (
    absolute >= meaningfulRiseAbsolute &&
    pct >= meaningfulRise
  ) {
    return {
      rawSignal: "meaningful_rise",
      absoluteChange24h: absolute,
      percentChange24h: pct,
      reasonCodes: ["flow_meaningful_rise_24h"],
    };
  }
  if (absolute >= risingAbsolute && pct >= rising) {
    return {
      rawSignal: "rising",
      absoluteChange24h: absolute,
      percentChange24h: pct,
      reasonCodes: ["flow_rising_24h"],
    };
  }
  return {
    rawSignal: "stable",
    absoluteChange24h: absolute,
    percentChange24h: pct,
    reasonCodes: ["flow_stable_24h"],
  };
}

export function flowBandReasonCode(band: FlowBand): RiverRunReasonCode {
  switch (band) {
    case "very_low":
      return "very_low_flow_band";
    case "low":
      return "low_flow_band";
    case "normal_fishable":
      return "normal_flow_band";
    case "ideal":
      return "ideal_flow_band";
    case "high_fishable":
      return "high_fishable_flow_band";
    case "very_high":
      return "very_high_flow_band";
    case "blown_out":
      return "blown_out_flow_band";
  }
}

function isUsableNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
