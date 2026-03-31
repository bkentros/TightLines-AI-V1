import type { VariableState } from "../contracts/mod.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

/** Inshore: favor moving tide; flats/estuary: soften slack penalty (skinny water / brackish norms). */
export type TideScoringPolicy = "inshore" | "flats_estuary";

function tideLabelFromKnots(c: number): "slack" | "moving" | "strong_moving" | "too_strong" {
  if (c < 0.5) return "slack";
  if (c < 1.5) return "moving";
  if (c <= 2.5) return "strong_moving";
  return "too_strong";
}

function fromCurrentSpeedKnots(c: number, policy: TideScoringPolicy): VariableState {
  const label = tideLabelFromKnots(c);
  let score: number;
  if (policy === "flats_estuary") {
    if (c < 0.5) {
      score = pieceLinear(c, 0, 0.5, -0.25, 0.05);
    } else if (c < 1.0) {
      score = pieceLinear(c, 0.5, 1.0, 0.05, 0.85);
    } else if (c <= 1.6) {
      score = pieceLinear(c, 1.0, 1.6, 0.85, 1.25);
    } else if (c <= 2.0) {
      score = pieceLinear(c, 1.6, 2.0, 1.25, 0.2);
    } else {
      score = pieceLinear(c, 2.0, 3.2, 0.2, -1.4);
    }
  } else {
    if (c < 0.5) {
      score = pieceLinear(c, 0, 0.5, -1.0, -0.7);
    } else if (c < 1.2) {
      score = pieceLinear(c, 0.5, 1.2, -0.7, 0.9);
    } else if (c <= 2.0) {
      score = pieceLinear(c, 1.2, 2.0, 0.9, 1.6);
    } else if (c <= 2.6) {
      score = pieceLinear(c, 2.0, 2.6, 1.6, 0.8);
    } else {
      score = pieceLinear(c, 2.6, 4.0, 0.8, -1.1);
    }
  }
  return { label, score: clampEngineScore(score) };
}

function max3hTideDeltaFt(heightsFt: number[], lag: number): number {
  let max = 0;
  for (let i = 0; i + lag < heightsFt.length; i++) {
    max = Math.max(max, Math.abs(heightsFt[i + lag]! - heightsFt[i]!));
  }
  return max;
}

function tideLabelFromFt(max3h: number): "slack" | "moving" | "strong_moving" | "too_strong" {
  if (max3h < 0.3) return "slack";
  if (max3h < 1.0) return "moving";
  if (max3h <= 1.8) return "strong_moving";
  return "too_strong";
}

function fromMax3hDeltaFt(max3h: number, policy: TideScoringPolicy): VariableState {
  const label = tideLabelFromFt(max3h);
  let score: number;
  if (policy === "flats_estuary") {
    if (max3h < 0.3) {
      score = pieceLinear(max3h, 0, 0.3, -0.25, 0.05);
    } else if (max3h < 0.8) {
      score = pieceLinear(max3h, 0.3, 0.8, 0.05, 0.85);
    } else if (max3h <= 1.2) {
      score = pieceLinear(max3h, 0.8, 1.2, 0.85, 1.25);
    } else if (max3h <= 1.6) {
      score = pieceLinear(max3h, 1.2, 1.6, 1.25, 0.2);
    } else {
      score = pieceLinear(max3h, 1.6, 2.4, 0.2, -1.4);
    }
  } else {
    if (max3h < 0.3) {
      score = pieceLinear(max3h, 0, 0.3, -1.0, -0.7);
    } else if (max3h < 0.9) {
      score = pieceLinear(max3h, 0.3, 0.9, -0.7, 0.9);
    } else if (max3h <= 1.5) {
      score = pieceLinear(max3h, 0.9, 1.5, 0.9, 1.6);
    } else if (max3h <= 1.9) {
      score = pieceLinear(max3h, 1.5, 1.9, 1.6, 0.8);
    } else {
      score = pieceLinear(max3h, 1.9, 3.0, 0.8, -1.1);
    }
  }
  return { label, score: clampEngineScore(score) };
}

function maxAdjacentExchangeRangeFt(
  events: Array<{ time: string; value: number }>
): number | null {
  const parsed = events
    .map((event) => ({ t: parseTideTime(event.time), v: event.value }))
    .filter((event) => !Number.isNaN(event.t))
    .sort((a, b) => a.t - b.t);
  if (parsed.length < 2) return null;

  let maxRange = 0;
  for (let index = 0; index < parsed.length - 1; index++) {
    maxRange = Math.max(maxRange, Math.abs(parsed[index + 1]!.v - parsed[index]!.v));
  }
  return maxRange > 0 ? maxRange : null;
}

function fromExchangeRangeFt(rangeFt: number, policy: TideScoringPolicy): VariableState {
  let score: number;
  let label: "moving" | "strong_moving";

  if (policy === "flats_estuary") {
    if (rangeFt < 0.8) {
      score = pieceLinear(rangeFt, 0.2, 0.8, 0.25, 0.6);
      label = "moving";
    } else if (rangeFt < 2.0) {
      score = pieceLinear(rangeFt, 0.8, 2.0, 0.6, 0.95);
      label = "moving";
    } else {
      score = pieceLinear(Math.min(rangeFt, 4.5), 2.0, 4.5, 0.95, 1.2);
      label = "strong_moving";
    }
  } else {
    if (rangeFt < 1.0) {
      score = pieceLinear(rangeFt, 0.3, 1.0, 0.45, 0.85);
      label = "moving";
    } else if (rangeFt < 2.2) {
      score = pieceLinear(rangeFt, 1.0, 2.2, 0.85, 1.15);
      label = "moving";
    } else {
      score = pieceLinear(Math.min(rangeFt, 5.5), 2.2, 5.5, 1.15, 1.55);
      label = "strong_moving";
    }
  }

  return {
    label,
    score: clampEngineScore(score),
    detail: `${rangeFt.toFixed(1)} ft exchange range`,
  };
}

function parseTideTime(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

function maxDeltaFromHighLow(
  events: Array<{ time: string; value: number }>
): number | null {
  const parsed = events
    .map((e) => ({ t: parseTideTime(e.time), v: e.value }))
    .filter((e) => !Number.isNaN(e.t))
    .sort((a, b) => a.t - b.t);
  if (parsed.length < 2) return null;
  const threeH = 3 * 3600000;
  let maxD = 0;
  for (let i = 0; i < parsed.length; i++) {
    for (let j = i + 1; j < parsed.length; j++) {
      if (parsed[j]!.t - parsed[i]!.t > threeH) break;
      maxD = Math.max(maxD, Math.abs(parsed[j]!.v - parsed[i]!.v));
    }
  }
  return maxD > 0 ? maxD : null;
}

export type TideMovementInput = {
  current_speed_knots_max?: number | null;
  tide_height_hourly_ft?: number[] | null;
  tide_high_low?: Array<{ time: string; value: number }> | null;
  stage?: string | null;
};

export function normalizeTideCurrentMovement(
  input: TideMovementInput,
  policy: TideScoringPolicy = "inshore",
): VariableState | null {
  const c = input.current_speed_knots_max;
  if (c != null && Number.isFinite(c) && c >= 0) {
    return fromCurrentSpeedKnots(c, policy);
  }

  const hourly = input.tide_height_hourly_ft;
  if (hourly && hourly.length >= 4) {
    const lag = hourly.length >= 12 ? 3 : Math.max(1, Math.round((3 * (hourly.length - 1)) / 24));
    return fromMax3hDeltaFt(max3hTideDeltaFt(hourly, Math.min(lag, hourly.length - 1)), policy);
  }

  const hl = input.tide_high_low;
  if (hl && hl.length >= 2) {
    const maxD = maxDeltaFromHighLow(hl);
    if (maxD != null && maxD >= 0.05) {
      return fromMax3hDeltaFt(maxD, policy);
    }
    const exchangeRange = maxAdjacentExchangeRangeFt(hl);
    if (exchangeRange != null && exchangeRange >= 0.2) {
      return fromExchangeRangeFt(exchangeRange, policy);
    }
  }

  return normalizeTideFromStage(input.stage, policy);
}

export function normalizeTideFromStage(
  tideState: string | null | undefined,
  policy: TideScoringPolicy = "inshore",
): VariableState | null {
  if (!tideState || typeof tideState !== "string") return null;
  const s = tideState.toLowerCase();

  if (/slack|high slack|low slack/.test(s)) {
    return {
      label: "slack",
      score: policy === "flats_estuary" ? -0.2 : -0.85,
    };
  }
  if (/spring|strong|peak flow/.test(s)) {
    return {
      label: "strong_moving",
      score: policy === "flats_estuary" ? 0.8 : 1.25,
    };
  }
  if (/incoming|outgoing|rising|falling/.test(s)) {
    return {
      label: "moving",
      score: policy === "flats_estuary" ? 0.5 : 0.7,
    };
  }
  return null;
}
