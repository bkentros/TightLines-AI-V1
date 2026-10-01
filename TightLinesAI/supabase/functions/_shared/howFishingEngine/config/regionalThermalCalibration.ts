import type { RegionKey } from "../contracts/region.ts";
import { pieceLinear } from "../score/engineScoreMath.ts";

/**
 * Replace the former weather-gated +1.35 repair with an explicit monotone curve.
 * Same historically adjusted regions; no expansion of regional scope. These are
 * conservative compatibility anchors, not experimentally measured catch rates.
 * Severe thermal scores and favorable scores are unchanged; no flat +0.45 plateau.
 */
const REGIONS = new Set<RegionKey>([
  "northeast",
  "florida",
  "mountain_west",
  "pacific_northwest",
  "northern_california",
  "appalachian",
  "inland_northwest",
  "hawaii",
]);
const POINTS = [[-1.5, -1.5], [-1, 0], [-.5, .2], [.2, .45], [.5, .5]] as const;
export function calibratedRegionalThermalScore(
  region: RegionKey,
  score: number,
): number {
  if (!REGIONS.has(region) || score <= -1.5 || score >= .5) return score;
  for (let i = 1; i < POINTS.length; i++) {
    const a = POINTS[i - 1], b = POINTS[i];
    if (score <= b[0]) return pieceLinear(score, a[0], b[0], a[1], b[1]);
  }
  return score;
}
