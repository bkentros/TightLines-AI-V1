/**
 * Deterministic float scores in [-2, 2] for tapered normalizers.
 * Integer thresholds for gates that used to compare to -2..2 discrete steps.
 */

export const ENGINE_SCORE_MIN = -2;
export const ENGINE_SCORE_MAX = 2;

/** Half-step boundaries between legacy integer buckets (see plan). */
export const ENGINE_SCORE_EPSILON = 0.5;

/** Quantize to 4 decimal places for stable JSON and tests. */
export function quantizeEngineScore(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function clampEngineScore(n: number): number {
  return quantizeEngineScore(
    Math.max(ENGINE_SCORE_MIN, Math.min(ENGINE_SCORE_MAX, n)),
  );
}

/** Map float score to nearest legacy tier for label routing (driver copy, etc.). */
export function engineScoreTier(score: number): -2 | -1 | 0 | 1 | 2 {
  if (score >= 1.5) return 2;
  if (score >= 0.5) return 1;
  if (score > -0.5) return 0;
  if (score > -1.5) return -1;
  return -2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Linear ramp: x in [x0,x1] -> y in [y0,y1], clamped to segment. */
export function pieceLinear(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): number {
  if (x1 === x0) return y0;
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  const u = (x - x0) / (x1 - x0);
  return lerp(y0, y1, u);
}
