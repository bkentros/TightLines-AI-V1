import type {
  RawTemperatureTrendSignal,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";

export type TemperatureTrendInput = {
  sourceType: TemperatureSourceType;
  delta72hF?: number | null;
  delta24hF?: number | null;
  hasEnoughValues?: boolean;
};

export type TemperatureTrendResult = {
  rawSignal: RawTemperatureTrendSignal;
  reasonCodes: RiverRunReasonCode[];
};

export function resolveTemperatureTrendSignal(
  input: TemperatureTrendInput,
): TemperatureTrendResult {
  if (input.sourceType === "unavailable") {
    return {
      rawSignal: "neutral_missing",
      reasonCodes: ["temperature_unavailable", "temperature_neutral_missing"],
    };
  }
  if (input.hasEnoughValues === false || !isUsableNumber(input.delta72hF)) {
    return {
      rawSignal: "neutral_missing",
      reasonCodes: [
        sourceReasonCode(input.sourceType),
        "temperature_neutral_missing",
      ],
    };
  }

  const result = input.sourceType === "air_temp_proxy"
    ? resolveAirProxyTrend(input.delta72hF)
    : resolveMeasuredTrend(input.delta72hF, input.delta24hF);

  return {
    rawSignal: result,
    reasonCodes: [
      sourceReasonCode(input.sourceType),
      ...temperatureTrendReasonCodes(result),
    ],
  };
}

function resolveMeasuredTrend(
  delta72hF: number,
  delta24hF?: number | null,
): RawTemperatureTrendSignal {
  const delta24 = isUsableNumber(delta24hF) ? delta24hF : 0;
  if (delta72hF <= -5 || delta24 <= -3) return "strong_cooling";
  if (
    (delta72hF <= -2 && delta72hF > -5) || (delta24 <= -1.5 && delta24 > -3)
  ) {
    return "cooling";
  }
  if (delta72hF >= 5 || delta24 >= 3) return "strong_warming";
  if ((delta72hF >= 2 && delta72hF < 5) || (delta24 >= 1.5 && delta24 < 3)) {
    return "warming";
  }
  return "neutral";
}

function resolveAirProxyTrend(delta72hF: number): RawTemperatureTrendSignal {
  if (delta72hF <= -8) return "strong_cooling";
  if (delta72hF <= -4) return "cooling";
  if (delta72hF >= 8) return "strong_warming";
  if (delta72hF >= 4) return "warming";
  return "neutral";
}

function sourceReasonCode(type: TemperatureSourceType): RiverRunReasonCode {
  if (type === "air_temp_proxy") return "temperature_air_proxy";
  if (type === "adjusted_reference_gauge") {
    return "temperature_adjusted_reference";
  }
  if (type === "unavailable") return "temperature_unavailable";
  return "temperature_measured";
}

function temperatureTrendReasonCodes(
  signal: RawTemperatureTrendSignal,
): RiverRunReasonCode[] {
  switch (signal) {
    case "strong_cooling":
      return ["temperature_strong_cooling"];
    case "cooling":
      return ["temperature_cooling"];
    case "warming":
      return ["temperature_warming"];
    case "strong_warming":
      return ["temperature_strong_warming"];
    case "neutral_missing":
      return ["temperature_neutral_missing"];
    case "neutral":
      return [];
  }
}

function isUsableNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
