import type { VariableState } from "../contracts/mod.ts";

/**
 * VARIABLE_THRESHOLDS — precedence: active_disruption → recent_rain → dry_stable.
 * Requires at least one input signal; otherwise null (missing).
 */
export function normalizePrecipitationDisruption(
  rateNow: number | null | undefined,
  p24: number | null | undefined,
  p72: number | null | undefined,
  activeNow: boolean | null | undefined
): VariableState | null {
  const hasSignal =
    p24 != null || p72 != null || rateNow != null || activeNow === true;
  if (!hasSignal) return null;

  const rate = rateNow ?? 0;
  const r24 = p24 ?? 0;
  const r72 = p72 ?? 0;

  if (
    rate >= 0.1 ||
    r24 >= 0.75 ||
    r72 >= 1.5 ||
    activeNow === true
  ) {
    return { label: "active_disruption", score: -2 };
  }
  if (
    (rate >= 0.02 && rate < 0.1) ||
    (r24 >= 0.1 && r24 < 0.75) ||
    (r72 >= 0.35 && r72 < 1.5)
  ) {
    return { label: "recent_rain", score: -1 };
  }
  return { label: "dry_stable", score: 0 };
}
