import type { VariableState } from "../contracts/mod.ts";
import {
  normalizeTideCurrentMovement,
  type TideMovementInput,
  type TideScoringPolicy,
} from "../normalize/normalizeTide.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

export type TideV2Profile =
  | "production_control"
  | "score_only_soft_current_floor"
  | "score_only_too_hard_penalty"
  | "score_only_combined";

function tideLabelFromKnots(
  c: number,
): "slack" | "moving" | "strong_moving" | "too_strong" {
  if (c < 0.5) return "slack";
  if (c < 1.5) return "moving";
  if (c <= 2.5) return "strong_moving";
  return "too_strong";
}

function tideLabelFromFt(
  max3h: number,
): "slack" | "moving" | "strong_moving" | "too_strong" {
  if (max3h < 0.3) return "slack";
  if (max3h < 1.0) return "moving";
  if (max3h <= 1.8) return "strong_moving";
  return "too_strong";
}

function usesSoftFloor(profile: TideV2Profile): boolean {
  return profile === "score_only_soft_current_floor" ||
    profile === "score_only_combined";
}

function usesHardPenalty(profile: TideV2Profile): boolean {
  return profile === "score_only_too_hard_penalty" ||
    profile === "score_only_combined";
}

function fromCurrentSpeedKnots(
  c: number,
  policy: TideScoringPolicy,
  profile: TideV2Profile,
): VariableState {
  const label = tideLabelFromKnots(c);
  const softFloor = usesSoftFloor(profile);
  const hardPenalty = usesHardPenalty(profile);
  let score: number;

  if (policy === "flats_estuary") {
    if (c < 0.5) {
      score = pieceLinear(c, 0, 0.5, -0.25, 0.05);
    } else if (c < 1.0) {
      score = pieceLinear(c, 0.5, 1.0, softFloor ? 0.20 : 0.05, 0.85);
    } else if (c <= 1.6) {
      score = pieceLinear(c, 1.0, 1.6, 0.85, 1.25);
    } else if (c <= 2.0) {
      score = hardPenalty
        ? pieceLinear(c, 1.6, 2.0, 0.90, -0.35)
        : pieceLinear(c, 1.6, 2.0, 1.25, 0.2);
    } else {
      score = hardPenalty
        ? pieceLinear(c, 2.0, 3.2, -0.35, -1.6)
        : pieceLinear(c, 2.0, 3.2, 0.2, -1.4);
    }
  } else {
    if (c < 0.5) {
      score = pieceLinear(c, 0, 0.5, -1.0, -0.7);
    } else if (c < 1.2) {
      score = softFloor
        ? c < 0.65
          ? pieceLinear(c, 0.5, 0.65, -0.20, 0.2071)
          : pieceLinear(c, 0.65, 1.2, 0.2071, 0.60)
        : pieceLinear(c, 0.5, 1.2, -0.7, 0.9);
    } else if (c <= 2.0) {
      score = pieceLinear(c, 1.2, 2.0, 0.9, 1.6);
    } else if (c <= 2.6) {
      score = hardPenalty
        ? pieceLinear(c, 2.0, 2.6, 1.35, 0.45)
        : pieceLinear(c, 2.0, 2.6, 1.6, 0.8);
    } else {
      score = hardPenalty
        ? pieceLinear(c, 2.6, 4.0, 0.10, -1.45)
        : pieceLinear(c, 2.6, 4.0, 0.8, -1.1);
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

function fromMax3hDeltaFt(
  max3h: number,
  policy: TideScoringPolicy,
  profile: TideV2Profile,
): VariableState {
  const label = tideLabelFromFt(max3h);
  const softFloor = usesSoftFloor(profile);
  const hardPenalty = usesHardPenalty(profile);
  let score: number;

  if (policy === "flats_estuary") {
    if (max3h < 0.3) {
      score = pieceLinear(max3h, 0, 0.3, -0.25, 0.05);
    } else if (max3h < 0.8) {
      score = pieceLinear(max3h, 0.3, 0.8, softFloor ? 0.20 : 0.05, 0.85);
    } else if (max3h <= 1.2) {
      score = pieceLinear(max3h, 0.8, 1.2, 0.85, 1.25);
    } else if (max3h <= 1.6) {
      score = hardPenalty
        ? pieceLinear(max3h, 1.2, 1.6, 0.90, -0.35)
        : pieceLinear(max3h, 1.2, 1.6, 1.25, 0.2);
    } else {
      score = hardPenalty
        ? pieceLinear(max3h, 1.6, 2.4, -0.35, -1.6)
        : pieceLinear(max3h, 1.6, 2.4, 0.2, -1.4);
    }
  } else {
    if (max3h < 0.3) {
      score = pieceLinear(max3h, 0, 0.3, -1.0, -0.7);
    } else if (max3h < 0.9) {
      score = softFloor
        ? max3h < 0.45
          ? pieceLinear(max3h, 0.3, 0.45, -0.20, 0.2071)
          : pieceLinear(max3h, 0.45, 0.9, 0.2071, 0.60)
        : pieceLinear(max3h, 0.3, 0.9, -0.7, 0.9);
    } else if (max3h <= 1.5) {
      score = pieceLinear(max3h, 0.9, 1.5, 0.9, 1.6);
    } else if (max3h <= 1.9) {
      score = hardPenalty
        ? pieceLinear(max3h, 1.5, 1.9, 1.35, 0.45)
        : pieceLinear(max3h, 1.5, 1.9, 1.6, 0.8);
    } else {
      score = hardPenalty
        ? pieceLinear(max3h, 1.9, 3.0, 0.10, -1.45)
        : pieceLinear(max3h, 1.9, 3.0, 0.8, -1.1);
    }
  }

  return { label, score: clampEngineScore(score) };
}

function parseTideTime(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

function maxDeltaFromHighLow(
  events: Array<{ time: string; value: number }>,
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

function maxAdjacentExchangeRangeFt(
  events: Array<{ time: string; value: number }>,
): number | null {
  const parsed = events
    .map((event) => ({ t: parseTideTime(event.time), v: event.value }))
    .filter((event) => !Number.isNaN(event.t))
    .sort((a, b) => a.t - b.t);
  if (parsed.length < 2) return null;

  let maxRange = 0;
  for (let index = 0; index < parsed.length - 1; index++) {
    maxRange = Math.max(
      maxRange,
      Math.abs(parsed[index + 1]!.v - parsed[index]!.v),
    );
  }
  return maxRange > 0 ? maxRange : null;
}

function fromExchangeRangeFt(
  rangeFt: number,
  policy: TideScoringPolicy,
  profile: TideV2Profile,
): VariableState {
  const hardPenalty = usesHardPenalty(profile);
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
      score = hardPenalty
        ? pieceLinear(Math.min(rangeFt, 4.5), 2.0, 4.5, 0.90, 0.85)
        : pieceLinear(Math.min(rangeFt, 4.5), 2.0, 4.5, 0.95, 1.2);
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
      score = hardPenalty
        ? pieceLinear(Math.min(rangeFt, 5.5), 2.2, 5.5, 1.10, 1.20)
        : pieceLinear(Math.min(rangeFt, 5.5), 2.2, 5.5, 1.15, 1.55);
      label = "strong_moving";
    }
  }

  return {
    label,
    score: clampEngineScore(score),
    detail: `${rangeFt.toFixed(1)} ft exchange range`,
  };
}

export function normalizeTideCurrentMovementV2(
  input: TideMovementInput,
  policy: TideScoringPolicy = "inshore",
  profile: TideV2Profile = "score_only_combined",
): VariableState | null {
  if (profile === "production_control") {
    return normalizeTideCurrentMovement(input, policy);
  }

  const c = input.current_speed_knots_max;
  if (c != null && Number.isFinite(c) && c >= 0) {
    return fromCurrentSpeedKnots(c, policy, profile);
  }

  const hourly = input.tide_height_hourly_ft;
  if (hourly && hourly.length >= 4) {
    const lag = hourly.length >= 12
      ? 3
      : Math.max(1, Math.round((3 * (hourly.length - 1)) / 24));
    return fromMax3hDeltaFt(
      max3hTideDeltaFt(hourly, Math.min(lag, hourly.length - 1)),
      policy,
      profile,
    );
  }

  const hl = input.tide_high_low;
  if (hl && hl.length >= 2) {
    const maxD = maxDeltaFromHighLow(hl);
    if (maxD != null && maxD >= 0.05) {
      return fromMax3hDeltaFt(maxD, policy, profile);
    }
    const exchangeRange = maxAdjacentExchangeRangeFt(hl);
    if (exchangeRange != null && exchangeRange >= 0.2) {
      return fromExchangeRangeFt(exchangeRange, policy, profile);
    }
  }

  return normalizeTideCurrentMovement(input, policy);
}
