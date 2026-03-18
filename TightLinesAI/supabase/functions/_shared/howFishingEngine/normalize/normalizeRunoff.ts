import type { RegionKey, VariableState } from "../contracts/mod.ts";

type Sens = "low" | "medium" | "high";

const REGION_SENS: Record<RegionKey, Sens> = {
  mountain_west: "low",
  northeast: "medium",
  southeast_atlantic: "medium",
  florida: "medium",
  great_lakes_upper_midwest: "medium",
  south_central: "medium",
  pacific_coast: "medium",
  gulf_coast: "high",
  midwest_interior: "high",
  southwest: "high",
};

function classify(s: Sens, p24: number, p72: number, p7d: number): VariableState {
  if (s === "low") {
    if (p24 < 0.3 && p72 < 0.7 && p7d < 1.5) {
      return { label: "stable", score: 1 };
    }
    if (p24 < 0.6 && p72 < 1.2 && p7d < 2.5) {
      return { label: "slightly_elevated", score: 0 };
    }
    if (p24 < 1.0 && p72 < 2.0 && p7d < 4.0) {
      return { label: "elevated", score: -1 };
    }
    return { label: "blown_out", score: -2 };
  }
  if (s === "medium") {
    if (p24 < 0.2 && p72 < 0.5 && p7d < 1.2) {
      return { label: "stable", score: 1 };
    }
    if (p24 < 0.45 && p72 < 1.0 && p7d < 2.2) {
      return { label: "slightly_elevated", score: 0 };
    }
    if (p24 < 0.8 && p72 < 1.75 && p7d < 3.5) {
      return { label: "elevated", score: -1 };
    }
    return { label: "blown_out", score: -2 };
  }
  if (p24 < 0.15 && p72 < 0.4 && p7d < 1.0) return { label: "stable", score: 1 };
  if (p24 < 0.35 && p72 < 0.8 && p7d < 1.8) {
    return { label: "slightly_elevated", score: 0 };
  }
  if (p24 < 0.6 && p72 < 1.4 && p7d < 3.0) {
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
