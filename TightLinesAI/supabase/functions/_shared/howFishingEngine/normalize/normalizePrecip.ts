import type { EngineContext, VariableState } from "../contracts/mod.ts";

/**
 * Precipitation disruption normalizer (freshwater_lake_pond and coastal).
 *
 * Four tiers covering the full [-2, +2] range.
 * Previously max was +1 ("dry_stable") — added "extended_dry" at +2 for
 * bone-dry conditions so a perfect precip situation contributes fully.
 *
 * extended_dry  — essentially zero rain in 24h AND 72h, no active precip
 * dry_stable    — dry enough not to affect water quality or fish behavior
 * recent_rain   — recent precipitation affecting clarity / conditions
 * active_disruption — currently raining or heavy recent totals
 */
export function normalizePrecipitationDisruption(
  context: Extract<EngineContext, "freshwater_lake_pond" | "coastal">,
  rateNow: number | null | undefined,
  p24: number | null | undefined,
  p72: number | null | undefined,
  activeNow: boolean | null | undefined,
): VariableState | null {
  const hasSignal =
    p24 != null || p72 != null || rateNow != null || activeNow === true;
  if (!hasSignal) return null;

  const rate = rateNow ?? 0;
  const r24 = p24 ?? 0;
  const r72 = p72 ?? 0;

  if (context === "coastal") {
    // Active disruption
    if (rate >= 0.12 || r24 >= 1.1 || r72 >= 2.2 || activeNow === true) {
      return { label: "active_disruption", score: -2 };
    }
    // Recent rain
    if (
      (rate >= 0.03 && rate < 0.12) ||
      (r24 >= 0.2 && r24 < 1.1) ||
      (r72 >= 0.6 && r72 < 2.2)
    ) {
      return { label: "recent_rain", score: -1 };
    }
    // Extended dry — bone dry over 24h and 72h windows
    // If activeNow were true, we already returned active_disruption above.
    if (r24 < 0.01 && r72 < 0.01 && rate < 0.01) {
      return { label: "extended_dry", score: 2 };
    }
    // Dry stable — dry but not necessarily bone dry
    return { label: "dry_stable", score: 1 };
  }

  // freshwater_lake_pond
  // Active disruption
  if (rate >= 0.1 || r24 >= 0.75 || r72 >= 1.5 || activeNow === true) {
    return { label: "active_disruption", score: -2 };
  }
  // Recent rain
  if (
    (rate >= 0.02 && rate < 0.1) ||
    (r24 >= 0.1 && r24 < 0.75) ||
    (r72 >= 0.35 && r72 < 1.5)
  ) {
    return { label: "recent_rain", score: -1 };
  }
  // Extended dry — essentially zero precip over both windows
  if (r24 < 0.01 && r72 < 0.01 && rate < 0.01) {
    return { label: "extended_dry", score: 2 };
  }
  // Dry stable
  return { label: "dry_stable", score: 1 };
}
