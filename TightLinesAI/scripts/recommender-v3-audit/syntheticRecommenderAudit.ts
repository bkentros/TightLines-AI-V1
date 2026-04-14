/**
 * Shared neutral analysis + synthetic daily payloads for V3 audit scripts.
 */
import type {
  DailyPostureBandV3,
  DailyReactionWindowV3,
  DailySurfaceWindowV3,
  OpportunityMixModeV3,
  PresentationStyleV3,
  RecommenderV3DailyPayload,
} from "../../supabase/functions/_shared/recommenderEngine/v3/contracts.ts";

function reactionWindowFromBand(
  band: DailyPostureBandV3,
): DailyReactionWindowV3 {
  switch (band) {
    case "suppressed":
    case "slightly_suppressed":
      return "off";
    case "aggressive":
      return "on";
    case "neutral":
    case "slightly_aggressive":
    default:
      return "watch";
  }
}

function opportunityMixFromBand(
  band: DailyPostureBandV3,
): OpportunityMixModeV3 {
  switch (band) {
    case "suppressed":
    case "slightly_suppressed":
      return "conservative";
    case "aggressive":
      return "aggressive";
    case "neutral":
    case "slightly_aggressive":
    default:
      return "balanced";
  }
}

export function buildSyntheticDaily(
  band: DailyPostureBandV3,
  presentation: PresentationStyleV3,
  columnBias: -1 | 0 | 1,
  surface: DailySurfaceWindowV3,
): RecommenderV3DailyPayload {
  const suppress_fast =
    band === "suppressed" || band === "slightly_suppressed";
  const reactionWindow = reactionWindowFromBand(band);
  const opportunityMix = opportunityMixFromBand(band);
  const presenceShift = presentation === "bold"
    ? 1
    : presentation === "subtle"
    ? -1
    : 0;

  return {
    normalized_states: {
      temperature_metabolic_context: "neutral",
      temperature_trend: "stable",
      temperature_shock: "none",
      pressure_regime: "stable_neutral",
      wind_condition: "light",
      light_cloud_condition: "mixed",
      precipitation_disruption: "dry_stable",
      runoff_flow_disruption: "stable",
    },
    posture_band: band,
    reaction_window: reactionWindow,
    surface_window: surface,
    opportunity_mix: opportunityMix,
    column_shift: columnBias,
    pace_shift: suppress_fast ? -1 : band === "aggressive" ? 1 : 0,
    presence_shift: presenceShift,
    surface_allowed_today: surface !== "closed" && band !== "suppressed",
    suppress_fast_presentations: suppress_fast,
    high_visibility_needed: presentation === "bold",
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

export const NEUTRAL_SYNTHETIC_DAILY = buildSyntheticDaily(
  "neutral",
  "balanced",
  0,
  "clean",
);
