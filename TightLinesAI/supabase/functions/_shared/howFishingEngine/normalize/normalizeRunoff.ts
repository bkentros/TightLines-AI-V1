import type { RegionKey, VariableState } from "../contracts/mod.ts";

/**
 * River runoff / flow disruption normalizer.
 *
 * Five tiers covering the full [-2, +2] range.
 * Previously max was +1 ("stable") — added "perfect_clear" at +2 for
 * genuinely pristine, bone-dry conditions so an ideal river day can score
 * all the way to 10.0.
 *
 * Region sensitivity controls how much rain it takes to elevate flows —
 * high-sensitivity rivers (Northeast, Great Lakes, etc.) react faster.
 */
type Sens = "low" | "medium" | "high";

const REGION_SENS: Record<RegionKey, Sens> = {
  florida: "low",
  southeast_atlantic: "medium",
  gulf_coast: "medium",
  south_central: "medium",
  mountain_west: "medium",
  northeast: "high",
  great_lakes_upper_midwest: "high",
  midwest_interior: "high",
  southwest_desert: "high",
  southwest_high_desert: "high",
  pacific_northwest: "high",
  southern_california: "high",
  // Alpine rivers react extremely fast to snowmelt and afternoon thunderstorms
  mountain_alpine: "high",
  // NorCal rivers (Sacramento, Trinity) flood fast in winter rain events
  northern_california: "high",
  appalachian: "high",
  inland_northwest: "medium",
  alaska: "high",
  hawaii: "medium",
};

function classify(
  s: Sens,
  p24: number,
  p72: number,
  p7d: number,
): VariableState {
  if (s === "low") {
    // Perfect clear — bone dry, flow pristine
    if (p24 < 0.12 && p72 < 0.20 && p7d < 0.50) {
      return { label: "perfect_clear", score: 2 };
    }
    if (p24 < 0.35 && p72 < 0.85 && p7d < 1.8) {
      return { label: "stable", score: 1 };
    }
    if (p24 < 0.7 && p72 < 1.6 && p7d < 3.0) {
      return { label: "slightly_elevated", score: 0 };
    }
    if (p24 < 1.1 && p72 < 2.6 && p7d < 4.8) {
      return { label: "elevated", score: -1 };
    }
    return { label: "blown_out", score: -2 };
  }

  if (s === "medium") {
    // Perfect clear
    if (p24 < 0.08 && p72 < 0.15 && p7d < 0.40) {
      return { label: "perfect_clear", score: 2 };
    }
    if (p24 < 0.22 && p72 < 0.55 && p7d < 1.25) {
      return { label: "stable", score: 1 };
    }
    if (p24 < 0.5 && p72 < 1.15 && p7d < 2.3) {
      return { label: "slightly_elevated", score: 0 };
    }
    if (p24 < 0.9 && p72 < 2.0 && p7d < 3.9) {
      return { label: "elevated", score: -1 };
    }
    return { label: "blown_out", score: -2 };
  }

  // high sensitivity
  // Perfect clear
  if (p24 < 0.05 && p72 < 0.10 && p7d < 0.25) {
    return { label: "perfect_clear", score: 2 };
  }
  if (p24 < 0.15 && p72 < 0.4 && p7d < 1.0) {
    return { label: "stable", score: 1 };
  }
  if (p24 < 0.35 && p72 < 0.8 && p7d < 1.8) {
    return { label: "slightly_elevated", score: 0 };
  }
  if (p24 < 0.65 && p72 < 1.5 && p7d < 3.1) {
    return { label: "elevated", score: -1 };
  }
  return { label: "blown_out", score: -2 };
}

/**
 * Requires all three precip windows as finite, non-negative inches.
 * Missing longer windows are NOT treated as zero — that overstated "dry" flow
 * when only 24h was present. Caller must supply a full triplet or omit runoff.
 */
export function normalizeRunoff(
  region: RegionKey,
  p24: number | null | undefined,
  p72: number | null | undefined,
  p7d: number | null | undefined,
): VariableState | null {
  if (p24 == null || p72 == null || p7d == null) return null;
  if (![p24, p72, p7d].every((x) => Number.isFinite(x) && x >= 0)) return null;
  const sens = REGION_SENS[region] ?? "medium";
  return classify(sens, p24, p72, p7d);
}
