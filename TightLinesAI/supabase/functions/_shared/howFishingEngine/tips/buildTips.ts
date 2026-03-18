import type {
  ActionableTipTag,
  DaypartNotePreset,
  EngineContext,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "../score/types.ts";

export type EngineTipDaypartBundle = {
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
  daypart_note: string | null;
  daypart_preset: DaypartNotePreset | null;
};

export type TipDaypartOptions = {
  local_date: string;
  solunar_peak_local?: string[] | null;
};

function monthFromDate(iso: string): number {
  return parseInt(iso.slice(5, 7), 10) || 6;
}

/** Nov–Mar cold-season air-temp framing for freshwater */
function isColdSeasonFreshwater(month: number): boolean {
  return month === 11 || month === 12 || month <= 3;
}

export function buildTipAndDaypart(
  context: EngineContext,
  topDriver: ActiveVariableScore | undefined,
  topSuppressor: ActiveVariableScore | undefined,
  norm: SharedNormalizedOutput["normalized"],
  reliability: string,
  opts?: TipDaypartOptions
): EngineTipDaypartBundle {
  const month = opts?.local_date ? monthFromDate(opts.local_date) : 6;
  const solunar = opts?.solunar_peak_local?.length
    ? opts.solunar_peak_local
    : null;

  let actionable_tip = "Stay flexible and cover likely holding water.";
  let actionable_tip_tag: ActionableTipTag = "general_flexibility";

  if (context === "coastal" && norm.tide_current_movement?.score === 2) {
    actionable_tip = "Prioritize spots with strong tidal movement today.";
    actionable_tip_tag = "coastal_tide_positive";
  } else if (topSuppressor?.key === "wind_condition" && topSuppressor.score < 0) {
    actionable_tip = "Seek protected banks and lee shorelines.";
    actionable_tip_tag = "wind_shelter";
  } else if (topSuppressor?.key === "runoff_flow_disruption" && topSuppressor.score < 0) {
    actionable_tip = "Focus on slower, clearer water and reduced flows.";
    actionable_tip_tag = "runoff_clarity_flow";
  } else if (
    topDriver?.key === "temperature_condition" &&
    topDriver.score > 0 &&
    (context === "freshwater_river" || context === "freshwater_lake_pond") &&
    isColdSeasonFreshwater(month)
  ) {
    actionable_tip =
      "Let the warmer part of the day work for you rather than treating the whole day the same.";
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "temperature_condition" && topDriver.score > 0) {
    actionable_tip =
      "Let temperature trends work for you — adjust timing within the day.";
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver) {
    actionable_tip = `Lean into what's helping: ${topDriver.key.replace(/_/g, " ")}.`;
    actionable_tip_tag = "lean_into_top_driver";
  }

  let daypart_preset: DaypartNotePreset;
  let daypart_note: string;

  if (reliability === "low") {
    daypart_preset = "no_timing_edge";
    daypart_note = "No strong timing edge today.";
  } else if (context === "coastal" && norm.tide_current_movement && norm.tide_current_movement.score >= 1) {
    daypart_preset = "moving_water_periods";
    daypart_note = "Moving-water periods matter most.";
  } else if (norm.light_cloud_condition?.label === "low_light" && norm.light_cloud_condition.score > 0) {
    daypart_preset = "early_late_low_light";
    daypart_note = "Better early or late when light is lower.";
  } else if (
    norm.temperature?.band_label === "very_cold" ||
    norm.temperature?.band_label === "cool"
  ) {
    if (norm.temperature.trend_label === "warming" || norm.temperature.final_score >= 0) {
      daypart_preset = "warmest_part_may_help";
      daypart_note = "Warmest part of the day may help.";
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = "No strong timing edge today.";
    }
  } else if (
    norm.temperature?.band_label === "very_warm" ||
    norm.temperature?.band_label === "warm"
  ) {
    if (norm.temperature.final_score <= 0) {
      daypart_preset = "cooler_low_light_better";
      daypart_note = "Cooler / lower-light periods may be better.";
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = "No strong timing edge today.";
    }
  } else if (solunar && reliability !== "low") {
    daypart_preset = "early_late_low_light";
    daypart_note = "Feeding windows may line up better early.";
  } else {
    daypart_preset = "no_timing_edge";
    daypart_note = "No strong timing edge today.";
  }

  return {
    actionable_tip,
    actionable_tip_tag,
    daypart_note,
    daypart_preset,
  };
}
