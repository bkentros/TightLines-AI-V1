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

const SNOWMELT_RISK_REGIONS = new Set<RegionKey>([
  "mountain_alpine",
  "alaska",
  "mountain_west",
  "pacific_northwest",
  "inland_northwest",
  "northern_california",
  "great_lakes_upper_midwest",
]);

const FLASHY_REGIONS = new Set<RegionKey>([
  "southwest_desert",
  "southwest_high_desert",
  "southern_california",
]);

export type RunoffV2Calibration = {
  perfectClearMax: number;
  stableMax: number;
};

export const DEFAULT_RUNOFF_V2_CALIBRATION: RunoffV2Calibration = {
  perfectClearMax: 0.55,
  stableMax: 0.35,
};

function finiteWindow(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value >= 0;
}

function baseThresholds(sens: Sens) {
  switch (sens) {
    case "low":
      return {
        clear: [0.12, 0.20, 0.50],
        stable: [0.35, 0.85, 1.8],
        slight: [0.70, 1.6, 3.0],
        elevated: [1.1, 2.6, 4.8],
      };
    case "medium":
      return {
        clear: [0.08, 0.15, 0.40],
        stable: [0.22, 0.55, 1.25],
        slight: [0.50, 1.15, 2.3],
        elevated: [0.90, 2.0, 3.9],
      };
    case "high":
      return {
        clear: [0.05, 0.10, 0.25],
        stable: [0.15, 0.40, 1.0],
        slight: [0.35, 0.80, 1.8],
        elevated: [0.65, 1.5, 3.1],
      };
  }
}

function scaledThresholds(region: RegionKey, month: number) {
  const sens = REGION_SENS[region] ?? "medium";
  const t = baseThresholds(sens);
  let scale = 1;
  if (
    month >= 4 && month <= 6 && SNOWMELT_RISK_REGIONS.has(region)
  ) {
    scale *= 0.60;
  }
  if (FLASHY_REGIONS.has(region)) {
    scale *= 0.82;
  }
  const scaleArr = (arr: number[]) => arr.map((x) => x * scale);
  return {
    clear: scaleArr(t.clear),
    stable: scaleArr(t.stable),
    slight: scaleArr(t.slight),
    elevated: scaleArr(t.elevated),
  };
}

function maxU(p24: number, p72: number, p7d: number, b: number[]): number {
  return Math.max(p24 / b[0]!, p72 / b[1]!, p7d / b[2]!);
}

function belowAll(p24: number, p72: number, p7d: number, b: number[]): boolean {
  return p24 < b[0]! && p72 < b[1]! && p7d < b[2]!;
}

function rampBetween(
  p24: number,
  p72: number,
  p7d: number,
  lo: number[],
  hi: number[],
): number {
  return Math.max(
    pieceLinear(p24, lo[0]!, hi[0]!, 0, 1),
    pieceLinear(p72, lo[1]!, hi[1]!, 0, 1),
    pieceLinear(p7d, lo[2]!, hi[2]!, 0, 1),
  );
}

/**
 * Experimental river Hydrology / Runoff Proxy V2.
 *
 * Shadow-only. Missing 24h/72h/7d windows still return null; no imputed zeros.
 * Positive clear/stable states are compressed, seasonal snowmelt regions get
 * spring/early-summer sensitivity, and arid Southwest regions remain flashy.
 */
export function normalizeRunoffV2(
  region: RegionKey,
  month: number,
  p24: number | null | undefined,
  p72: number | null | undefined,
  p7d: number | null | undefined,
  calibration: RunoffV2Calibration = DEFAULT_RUNOFF_V2_CALIBRATION,
): VariableState | null {
  if (!finiteWindow(p24) || !finiteWindow(p72) || !finiteWindow(p7d)) {
    return null;
  }

  const t = scaledThresholds(region, month);
  if (belowAll(p24, p72, p7d, t.clear)) {
    return {
      label: "perfect_clear",
      score: clampEngineScore(
        pieceLinear(
          maxU(p24, p72, p7d, t.clear),
          0,
          1,
          calibration.perfectClearMax,
          Math.min(0.08, calibration.perfectClearMax),
        ),
      ),
    };
  }
  if (belowAll(p24, p72, p7d, t.stable)) {
    return {
      label: "stable",
      score: clampEngineScore(
        pieceLinear(
          rampBetween(p24, p72, p7d, t.clear, t.stable),
          0,
          1,
          calibration.stableMax,
          0,
        ),
      ),
    };
  }
  if (belowAll(p24, p72, p7d, t.slight)) {
    return {
      label: "slightly_elevated",
      score: clampEngineScore(
        pieceLinear(
          rampBetween(p24, p72, p7d, t.stable, t.slight),
          0,
          1,
          -0.05,
          -0.60,
        ),
      ),
    };
  }
  if (belowAll(p24, p72, p7d, t.elevated)) {
    return {
      label: "elevated",
      score: clampEngineScore(
        pieceLinear(
          rampBetween(p24, p72, p7d, t.slight, t.elevated),
          0,
          1,
          -0.65,
          -1.25,
        ),
      ),
    };
  }

  const u = Math.min(
    1,
    Math.max(
      pieceLinear(p24, t.elevated[0]!, t.elevated[0]! * 2, 0, 1),
      pieceLinear(p72, t.elevated[1]!, t.elevated[1]! * 2, 0, 1),
      pieceLinear(p7d, t.elevated[2]!, t.elevated[2]! * 1.8, 0, 1),
    ),
  );
  return {
    label: "blown_out",
    score: clampEngineScore(pieceLinear(u, 0, 1, -1.4, -2)),
  };
}
