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

  let actionable_tip = "Work the water methodically — focus on your best structure and high-percentage spots.";
  let actionable_tip_tag: ActionableTipTag = "general_flexibility";

  if (context === "coastal" && norm.tide_current_movement?.score === 2) {
    actionable_tip = "Get on the water during the strongest tidal flow — that's your window today.";
    actionable_tip_tag = "coastal_tide_positive";
  } else if (topSuppressor?.key === "wind_condition" && topSuppressor.score < 0) {
    actionable_tip = "The wind is the story today. Get behind a sheltered bank or work the lee side.";
    actionable_tip_tag = "wind_shelter";
  } else if (topSuppressor?.key === "runoff_flow_disruption" && topSuppressor.score < 0) {
    actionable_tip = "Find the cleaner, slower water. Tributaries and backwater areas are your best bet.";
    actionable_tip_tag = "runoff_clarity_flow";
  } else if (
    topDriver?.key === "temperature_condition" &&
    topDriver.score > 0 &&
    (context === "freshwater_river" || context === "freshwater_lake_pond") &&
    isColdSeasonFreshwater(month)
  ) {
    actionable_tip =
      "Plan your best effort around the afternoon warmth — that's when things will turn on.";
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver?.key === "temperature_condition" && topDriver.score > 0) {
    actionable_tip =
      "Temperature is your biggest ally today. Time your effort around the warmest stretch.";
    actionable_tip_tag = "temperature_intraday_flex";
  } else if (topDriver) {
    const driverName = topDriver.key.replace(/_/g, " ");
    actionable_tip = `Your biggest edge today is ${driverName} — build your game plan around it.`;
    actionable_tip_tag = "lean_into_top_driver";
  }

  let daypart_preset: DaypartNotePreset;
  let daypart_note: string;

  if (reliability === "low") {
    daypart_preset = "no_timing_edge";
    daypart_note = "No clear timing edge stands out — fish it as the day comes.";
  } else if (context === "coastal" && norm.tide_current_movement && norm.tide_current_movement.score >= 1) {
    daypart_preset = "moving_water_periods";
    daypart_note = "Time it around the moving water — that's when the bite turns on.";
  } else if (norm.light_cloud_condition?.label === "low_light" && norm.light_cloud_condition.score > 0) {
    daypart_preset = "early_late_low_light";
    daypart_note = "The low-light windows early and late are your best bet today.";
  } else if (
    norm.temperature?.band_label === "very_cold" ||
    norm.temperature?.band_label === "cool"
  ) {
    if (norm.temperature.trend_label === "warming" || norm.temperature.final_score >= 0) {
      daypart_preset = "warmest_part_may_help";
      daypart_note = "Afternoon warmth will be the trigger — plan your best push around it.";
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = "Cold temps all day — no single window stands out over another.";
    }
  } else if (
    norm.temperature?.band_label === "very_warm" ||
    norm.temperature?.band_label === "warm"
  ) {
    if (norm.temperature.final_score <= 0) {
      daypart_preset = "cooler_low_light_better";
      daypart_note = "Beat the heat — early morning and evening are the productive windows.";
    } else {
      daypart_preset = "no_timing_edge";
      daypart_note = "Temps are warm but productive — any part of the day can work.";
    }
  } else if (solunar && reliability !== "low") {
    daypart_preset = "early_late_low_light";
    daypart_note = "Early feeding windows look strongest — get out there at first light.";
  } else {
    daypart_preset = "no_timing_edge";
    daypart_note = "No major timing advantage today — fish it when you can get out.";
  }

  return {
    actionable_tip,
    actionable_tip_tag,
    daypart_note,
    daypart_preset,
  };
}
