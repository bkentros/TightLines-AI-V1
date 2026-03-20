import type { RegionKey, VariableState } from "../contracts/mod.ts";

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
};

function classify(s: Sens, p24: number, p72: number, p7d: number): VariableState {
  if (s === "low") {
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
  if (p24 < 0.15 && p72 < 0.4 && p7d < 1.0) return { label: "stable", score: 1 };
  if (p24 < 0.35 && p72 < 0.8 && p7d < 1.8) {
    return { label: "slightly_elevated", score: 0 };
  }
  if (p24 < 0.65 && p72 < 1.5 && p7d < 3.1) {
    return { label: "elevated", score: -1 };
  }
  return { label: "blown_out", score: -2 };
}

export function normalizeRunoff(
  region: RegionKey,
  p24: number | null | undefined,
  p72: number | null | undefined,
  p7d: number | null | undefined
): VariableState | null {
  if (p24 == null && p72 == null && p7d == null) return null;
  const sens = REGION_SENS[region] ?? "medium";
  return classify(sens, p24 ?? 0, p72 ?? 0, p7d ?? 0);
}
