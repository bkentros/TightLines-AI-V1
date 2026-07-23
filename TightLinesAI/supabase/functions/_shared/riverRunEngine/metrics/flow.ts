import type {
  FlowBand,
  RawFlowTrendSignal,
  RiverRunReasonCode,
} from "../types.ts";

export type FlowTrendInput = {
  currentValue?: number | null;
  value24hAgo?: number | null;
  rising24hPercent?: number;
  meaningfulRise24hPercent?: number;
  sharpRise24hPercent?: number;
};

export type FlowTrendResult = {
  rawSignal: RawFlowTrendSignal;
  percentChange24h: number | null;
  reasonCodes: RiverRunReasonCode[];
};

export function resolveFlowTrendSignal(input: FlowTrendInput): FlowTrendResult {
  const current = input.currentValue;
  const prior = input.value24hAgo;
  if (!isUsableNumber(current) || !isUsableNumber(prior) || prior <= 0) {
    return {
      rawSignal: "unknown",
      percentChange24h: null,
      reasonCodes: ["flow_trend_unknown"],
    };
  }

  const pct = ((current - prior) / prior) * 100;
  const rising = input.rising24hPercent ?? 10;
  const meaningfulRise = input.meaningfulRise24hPercent ?? 25;
  const sharpRise = input.sharpRise24hPercent ?? 50;

  if (pct <= -10) {
    return {
      rawSignal: "falling",
      percentChange24h: pct,
      reasonCodes: ["flow_falling_24h"],
    };
  }
  if (pct >= sharpRise) {
    return {
      rawSignal: "sharp_rise",
      percentChange24h: pct,
      reasonCodes: ["flow_sharp_rise_24h"],
    };
  }
  if (pct >= meaningfulRise) {
    return {
      rawSignal: "meaningful_rise",
      percentChange24h: pct,
      reasonCodes: ["flow_meaningful_rise_24h"],
    };
  }
  if (pct >= rising) {
    return {
      rawSignal: "rising",
      percentChange24h: pct,
      reasonCodes: ["flow_rising_24h"],
    };
  }
  return {
    rawSignal: "stable",
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
