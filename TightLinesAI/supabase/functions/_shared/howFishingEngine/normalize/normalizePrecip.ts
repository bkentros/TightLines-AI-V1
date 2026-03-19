import type { EngineContext, VariableState } from "../contracts/mod.ts";

/**
 * VARIABLE_THRESHOLDS — precedence: active_disruption → recent_rain → dry_stable.
 * Context-aware so coastal rain is softer than lake/pond rain.
 */
export function normalizePrecipitationDisruption(
  context: Extract<EngineContext, "freshwater_lake_pond" | "coastal">,
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

  if (context === "coastal") {
    if (rate >= 0.12 || r24 >= 1.1 || r72 >= 2.2 || activeNow === true) {
      return { label: "active_disruption", score: -2 };
    }
    if (
      (rate >= 0.03 && rate < 0.12) ||
      (r24 >= 0.2 && r24 < 1.1) ||
      (r72 >= 0.6 && r72 < 2.2)
    ) {
      return { label: "recent_rain", score: -1 };
    }
    return { label: "dry_stable", score: 0 };
  }

  if (rate >= 0.1 || r24 >= 0.75 || r72 >= 1.5 || activeNow === true) {
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
