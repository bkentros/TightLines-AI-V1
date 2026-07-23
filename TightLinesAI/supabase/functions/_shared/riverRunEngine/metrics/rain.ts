import type { RawRainSignal, RiverRunReasonCode } from "../index.ts";

export type RainTotals = {
  rain24hIn?: number | null;
  rain48hIn?: number | null;
  rain72hIn?: number | null;
};

export type RainThresholds = {
  meaningful48hIn?: number;
  strong48hIn?: number;
  heavy48hIn?: number;
};

export type RainSignalResult = {
  rawSignal: RawRainSignal;
  reasonCodes: RiverRunReasonCode[];
};

export function resolveRainSignal(
  totals: RainTotals,
  thresholds: RainThresholds = {},
): RainSignalResult {
  const rain48 = totals.rain48hIn;
  const rain72 = totals.rain72hIn;
  if (!isUsableNumber(rain48) || !isUsableNumber(rain72)) {
    return { rawSignal: "missing_rain_data", reasonCodes: ["rain_missing"] };
  }

  const meaningful = thresholds.meaningful48hIn ?? 0.35;
  const strong = thresholds.strong48hIn ?? 0.75;
  const heavy = thresholds.heavy48hIn ?? 1.5;

  if (rain48 >= heavy) {
    return { rawSignal: "heavy_rain", reasonCodes: ["heavy_rain_48h"] };
  }
  if (rain48 >= strong) {
    return { rawSignal: "strong_rain", reasonCodes: ["strong_rain_48h"] };
  }
  if (rain48 >= meaningful) {
    return {
      rawSignal: "meaningful_rain",
      reasonCodes: ["meaningful_rain_48h"],
    };
  }
  if (rain48 >= 0.1) {
    return { rawSignal: "light_rain", reasonCodes: ["light_rain_48h"] };
  }
  if (rain72 < 0.1) {
    return { rawSignal: "dry", reasonCodes: ["dry_72h"] };
  }

  return { rawSignal: "light_rain", reasonCodes: ["light_rain_48h"] };
}

function isUsableNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
