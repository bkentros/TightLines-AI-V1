import type { SharedConditionAnalysis } from "../../../../howFishingEngine/analyzeSharedConditions.ts";

/** Minimal analysis for `computeRecommenderV4` tests (score + light label only). */
export function analysisWithScore(
  score: number,
  lightLabel: string | null = "mixed",
): SharedConditionAnalysis {
  return {
    scored: {
      score,
      band: "Fair",
      contributions: [],
      drivers: [],
      suppressors: [],
    },
    norm: {
      normalized: {
        light_cloud_condition: { label: lightLabel },
      },
    } as SharedConditionAnalysis["norm"],
    timing: {
      timing_strength: "good",
      highlighted_periods: [false, false, false, false],
    } as SharedConditionAnalysis["timing"],
    condition_context: {
      temperature_band: "optimal",
      temperature_trend: "stable",
      temperature_shock: "none",
      pressure_detail: null,
    } as SharedConditionAnalysis["condition_context"],
  };
}
