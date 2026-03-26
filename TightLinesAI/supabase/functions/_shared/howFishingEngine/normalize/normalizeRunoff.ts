import type { RegionKey, VariableState } from "../contracts/mod.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

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
  mountain_alpine: "high",
  northern_california: "high",
  appalachian: "high",
  inland_northwest: "medium",
  alaska: "high",
  hawaii: "medium",
};

function wetnessU(
  p24: number,
  p72: number,
  p7d: number,
  b24: number,
  b72: number,
  b7d: number,
): number {
  return Math.max(p24 / b24, p72 / b72, p7d / b7d);
}

function classify(s: Sens, p24: number, p72: number, p7d: number): VariableState {
  if (s === "low") {
    if (p24 < 0.12 && p72 < 0.20 && p7d < 0.50) {
      const u = wetnessU(p24, p72, p7d, 0.12, 0.2, 0.5);
      return {
        label: "perfect_clear",
        score: clampEngineScore(pieceLinear(u, 0, 1, 2, 1.62)),
      };
    }
    if (p24 < 0.35 && p72 < 0.85 && p7d < 1.8) {
      const u = Math.max(
        pieceLinear(p24, 0.12, 0.35, 0, 1),
        pieceLinear(p72, 0.2, 0.85, 0, 1),
        pieceLinear(p7d, 0.5, 1.8, 0, 1),
      );
      const score = clampEngineScore(pieceLinear(u, 0, 1, 1.72, 0.92));
      return { label: "stable", score };
    }
    if (p24 < 0.7 && p72 < 1.6 && p7d < 3.0) {
      const u = Math.max(
        pieceLinear(p24, 0.35, 0.7, 0, 1),
        pieceLinear(p72, 0.85, 1.6, 0, 1),
        pieceLinear(p7d, 1.8, 3.0, 0, 1),
      );
      const score = clampEngineScore(pieceLinear(u, 0, 1, 0.72, -0.08));
      return { label: "slightly_elevated", score };
    }
    if (p24 < 1.1 && p72 < 2.6 && p7d < 4.8) {
      const u = Math.max(
        pieceLinear(p24, 0.7, 1.1, 0, 1),
        pieceLinear(p72, 1.6, 2.6, 0, 1),
        pieceLinear(p7d, 3.0, 4.8, 0, 1),
      );
      const score = clampEngineScore(pieceLinear(u, 0, 1, -0.12, -1.05));
      return { label: "elevated", score };
    }
    const u = Math.min(
      1,
      Math.max(
        pieceLinear(p24, 1.1, 2.2, 0, 1),
        pieceLinear(p72, 2.6, 5.0, 0, 1),
        pieceLinear(p7d, 4.8, 9, 0, 1),
      ),
    );
    return {
      label: "blown_out",
      score: clampEngineScore(pieceLinear(u, 0, 1, -1.15, -2)),
    };
  }

  if (s === "medium") {
    if (p24 < 0.08 && p72 < 0.15 && p7d < 0.40) {
      const u = wetnessU(p24, p72, p7d, 0.08, 0.15, 0.4);
      return {
        label: "perfect_clear",
        score: clampEngineScore(pieceLinear(u, 0, 1, 2, 1.62)),
      };
    }
    if (p24 < 0.22 && p72 < 0.55 && p7d < 1.25) {
      const u = Math.max(
        pieceLinear(p24, 0.08, 0.22, 0, 1),
        pieceLinear(p72, 0.15, 0.55, 0, 1),
        pieceLinear(p7d, 0.4, 1.25, 0, 1),
      );
      return {
        label: "stable",
        score: clampEngineScore(pieceLinear(u, 0, 1, 1.72, 0.92)),
      };
    }
    if (p24 < 0.5 && p72 < 1.15 && p7d < 2.3) {
      const u = Math.max(
        pieceLinear(p24, 0.22, 0.5, 0, 1),
        pieceLinear(p72, 0.55, 1.15, 0, 1),
        pieceLinear(p7d, 1.25, 2.3, 0, 1),
      );
      return {
        label: "slightly_elevated",
        score: clampEngineScore(pieceLinear(u, 0, 1, 0.72, -0.08)),
      };
    }
    if (p24 < 0.9 && p72 < 2.0 && p7d < 3.9) {
      const u = Math.max(
        pieceLinear(p24, 0.5, 0.9, 0, 1),
        pieceLinear(p72, 1.15, 2.0, 0, 1),
        pieceLinear(p7d, 2.3, 3.9, 0, 1),
      );
      return {
        label: "elevated",
        score: clampEngineScore(pieceLinear(u, 0, 1, -0.12, -1.05)),
      };
    }
    const u = Math.min(
      1,
      Math.max(
        pieceLinear(p24, 0.9, 1.8, 0, 1),
        pieceLinear(p72, 2.0, 4.0, 0, 1),
        pieceLinear(p7d, 3.9, 8, 0, 1),
      ),
    );
    return {
      label: "blown_out",
      score: clampEngineScore(pieceLinear(u, 0, 1, -1.15, -2)),
    };
  }

  if (p24 < 0.05 && p72 < 0.10 && p7d < 0.25) {
    const u = wetnessU(p24, p72, p7d, 0.05, 0.1, 0.25);
    return {
      label: "perfect_clear",
      score: clampEngineScore(pieceLinear(u, 0, 1, 2, 1.62)),
    };
  }
  if (p24 < 0.15 && p72 < 0.4 && p7d < 1.0) {
    const u = Math.max(
      pieceLinear(p24, 0.05, 0.15, 0, 1),
      pieceLinear(p72, 0.1, 0.4, 0, 1),
      pieceLinear(p7d, 0.25, 1.0, 0, 1),
    );
    return {
      label: "stable",
      score: clampEngineScore(pieceLinear(u, 0, 1, 1.72, 0.92)),
    };
  }
  if (p24 < 0.35 && p72 < 0.8 && p7d < 1.8) {
    const u = Math.max(
      pieceLinear(p24, 0.15, 0.35, 0, 1),
      pieceLinear(p72, 0.4, 0.8, 0, 1),
      pieceLinear(p7d, 1.0, 1.8, 0, 1),
    );
    return {
      label: "slightly_elevated",
      score: clampEngineScore(pieceLinear(u, 0, 1, 0.72, -0.08)),
    };
  }
  if (p24 < 0.65 && p72 < 1.5 && p7d < 3.1) {
    const u = Math.max(
      pieceLinear(p24, 0.35, 0.65, 0, 1),
      pieceLinear(p72, 0.8, 1.5, 0, 1),
      pieceLinear(p7d, 1.8, 3.1, 0, 1),
    );
    return {
      label: "elevated",
      score: clampEngineScore(pieceLinear(u, 0, 1, -0.12, -1.05)),
    };
  }
  const u = Math.min(
    1,
    Math.max(
      pieceLinear(p24, 0.65, 1.3, 0, 1),
      pieceLinear(p72, 1.5, 3.0, 0, 1),
      pieceLinear(p7d, 3.1, 6.2, 0, 1),
    ),
  );
  return {
    label: "blown_out",
    score: clampEngineScore(pieceLinear(u, 0, 1, -1.15, -2)),
  };
}

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
