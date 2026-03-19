import type { VariableState } from "../contracts/mod.ts";

function fromCurrentSpeedKnots(c: number): VariableState {
  if (c < 0.5) return { label: "slack", score: -1 };
  if (c < 1.5) return { label: "moving", score: 1 };
  if (c <= 2.5) return { label: "strong_moving", score: 2 };
  return { label: "too_strong", score: -1 };
}

/** Max |h[i+lag]-h[i]| as proxy for 3h swing; lag=3 for hourly ft heights */
function max3hTideDeltaFt(heightsFt: number[], lag: number): number {
  let max = 0;
  for (let i = 0; i + lag < heightsFt.length; i++) {
    max = Math.max(max, Math.abs(heightsFt[i + lag]! - heightsFt[i]!));
  }
  return max;
}

function fromMax3hDeltaFt(max3h: number): VariableState {
  if (max3h < 0.3) return { label: "slack", score: -1 };
  if (max3h < 1.0) return { label: "moving", score: 1 };
  if (max3h <= 1.8) return { label: "strong_moving", score: 2 };
  return { label: "too_strong", score: -1 };
}

function parseTideTime(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

/**
 * High/low events within 3h windows (sparse CO-OPS hilo).
 */
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

/**
 * VARIABLE_THRESHOLDS priority: current knots → hourly heights → hilo 3h → stage label.
 */
export function normalizeTideCurrentMovement(input: TideMovementInput): VariableState | null {
  const c = input.current_speed_knots_max;
  if (c != null && Number.isFinite(c) && c >= 0) {
    return fromCurrentSpeedKnots(c);
  }

  const hourly = input.tide_height_hourly_ft;
  if (hourly && hourly.length >= 4) {
    const lag = hourly.length >= 12 ? 3 : Math.max(1, Math.round((3 * (hourly.length - 1)) / 24));
    return fromMax3hDeltaFt(max3hTideDeltaFt(hourly, Math.min(lag, hourly.length - 1)));
  }

  const hl = input.tide_high_low;
  if (hl && hl.length >= 2) {
    const maxD = maxDeltaFromHighLow(hl);
    if (maxD != null && maxD >= 0.05) {
      return fromMax3hDeltaFt(maxD);
    }
  }

  return normalizeTideFromStage(input.stage);
}

export function normalizeTideFromStage(tideState: string | null | undefined): VariableState | null {
  if (!tideState || typeof tideState !== "string") return null;
  const s = tideState.toLowerCase();

  if (/slack|high slack|low slack/.test(s)) {
    return { label: "slack", score: -1 };
  }
  if (/spring|strong|peak flow/.test(s)) {
    return { label: "strong_moving", score: 2 };
  }
  if (/incoming|outgoing|rising|falling/.test(s)) {
    return { label: "moving", score: 1 };
  }
  return null;
}
