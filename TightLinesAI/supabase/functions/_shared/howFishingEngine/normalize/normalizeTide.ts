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
  if (c < 0.5) {
    score = policy === "flats_estuary"
      ? pieceLinear(c, 0, 0.5, -0.42, 0.05)
      : pieceLinear(c, 0, 0.5, -1.08, -0.82);
  } else if (c < 1.5) {
    score = pieceLinear(c, 0.5, 1.5, -0.82, 1.05);
  } else if (c <= 2.5) {
    score = pieceLinear(c, 1.5, 2.5, 1.05, 2);
  } else {
    score = pieceLinear(c, 2.5, 4.2, 2, -1.12);
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
  if (max3h < 0.3) {
    score = policy === "flats_estuary"
      ? pieceLinear(max3h, 0, 0.3, -0.42, 0.05)
      : pieceLinear(max3h, 0, 0.3, -1.08, -0.82);
  } else if (max3h < 1.0) {
    score = pieceLinear(max3h, 0.3, 1.0, -0.82, 1.05);
  } else if (max3h <= 1.8) {
    score = pieceLinear(max3h, 1.0, 1.8, 1.05, 2);
  } else {
    score = pieceLinear(max3h, 1.8, 3.2, 2, -1.12);
  }
  return { label, score: clampEngineScore(score) };
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
      score: policy === "flats_estuary" ? -0.32 : -0.95,
    };
  }
  if (/spring|strong|peak flow/.test(s)) {
    return { label: "strong_moving", score: 1.85 };
  }
  if (/incoming|outgoing|rising|falling/.test(s)) {
    return { label: "moving", score: 1 };
  }
  return null;
}
