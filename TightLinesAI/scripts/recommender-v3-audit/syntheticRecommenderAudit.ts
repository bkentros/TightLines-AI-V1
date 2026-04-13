/**
 * Shared neutral analysis + synthetic daily payloads for V3 audit scripts.
 */
import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import type {
  DailyPostureBandV3,
  DailySurfaceWindowV3,
  PresentationStyleV3,
  RecommenderV3DailyPayload,
} from "../../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";

export function coverageNeutralAnalysis(): SharedConditionAnalysis {
  return {
    scored: {
      score: 60,
      band: "Good",
      drivers: [],
      suppressors: [],
    },
    timing: {
      timing_strength: "good",
      highlighted_periods: [false, false, false, false],
    },
    condition_context: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
    },
    norm: {
      normalized: {
        pressure_regime: { label: "stable_neutral", score: 0 },
        wind_condition: { label: "light", score: 0 },
        light_cloud_condition: { label: "mixed", score: 0 },
        precipitation_disruption: { label: "dry_stable", score: 0 },
        runoff_flow_disruption: { label: "stable", score: 0 },
      },
    },
  } as SharedConditionAnalysis;
}

function postureScoreFromBand(band: DailyPostureBandV3): number {
  switch (band) {
    case "suppressed":
      return 2.2;
    case "slightly_suppressed":
      return 3.6;
    case "neutral":
      return 5.1;
    case "slightly_aggressive":
      return 7;
    case "aggressive":
      return 9;
  }
}

export function buildSyntheticDaily(
  band: DailyPostureBandV3,
  presentation: PresentationStyleV3,
  columnBias: -1 | 0 | 1,
  surface: DailySurfaceWindowV3,
): RecommenderV3DailyPayload {
  const posture_score_10 = postureScoreFromBand(band);
  const suppress_fast =
    band === "suppressed" || band === "slightly_suppressed";

  const max_up: 0 | 1 | 2 =
    band === "aggressive" ? 2 : band === "slightly_aggressive" ? 1 : 0;
  const max_down: 0 | 1 | 2 =
    band === "suppressed" ? 2 : band === "slightly_suppressed" ? 1 : 0;

  let surface_window_today = surface;
  let surface_allowed_today = band !== "suppressed";
  let suppress_true_topwater = false;

  if (surface === "closed") {
    surface_window_today = "closed";
    suppress_true_topwater = true;
  }

  return {
    posture_score_10,
    posture_band: band,
    presentation_presence_today: presentation,
    column_shift_bias_half_steps: columnBias as -2 | -1 | 0 | 1 | 2,
    max_upward_column_shift_today: max_up,
    max_downward_column_shift_today: max_down,
    surface_allowed_today,
    suppress_true_topwater,
    surface_window_today,
    suppress_fast_presentations: suppress_fast,
    high_visibility_needed_today: presentation === "bold",
    variables_considered: [],
    variables_triggered: [],
    notes: [],
  };
}

export function allSyntheticDailyPayloads(): readonly RecommenderV3DailyPayload[] {
  const bands: DailyPostureBandV3[] = [
    "suppressed",
    "slightly_suppressed",
    "neutral",
    "slightly_aggressive",
    "aggressive",
  ];
  const presentations: PresentationStyleV3[] = ["subtle", "balanced", "bold"];
  const colBiases = [-1, 0, 1] as const;
  const surfaces: DailySurfaceWindowV3[] = ["closed", "rippled", "clean"];
  const out: RecommenderV3DailyPayload[] = [];
  for (const band of bands) {
    for (const presentation of presentations) {
      for (const columnBias of colBiases) {
        for (const surface of surfaces) {
          out.push(buildSyntheticDaily(band, presentation, columnBias, surface));
        }
      }
    }
  }
  return out;
}

export const COVERAGE_ANALYSIS = coverageNeutralAnalysis();

export const NEUTRAL_SYNTHETIC_DAILY = buildSyntheticDaily(
  "neutral",
  "balanced",
  0,
  "clean",
);
