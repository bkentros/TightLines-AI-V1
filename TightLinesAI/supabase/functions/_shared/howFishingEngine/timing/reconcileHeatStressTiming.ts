/**
 * Final pass: when air-temp scoring says "avoid_heat" qualifies, never highlight
 * midday (afternoon bucket) or the combo-fallback "morning+afternoon" block —
 * even if month/region family, widener merge, or month-blend OR'd those on.
 *
 * Tide-anchored coastal timing is left unchanged (clock tied to exchanges).
 */

import type { EngineContext, SharedNormalizedOutput } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import type { DaypartFlags, TimingEvalOptions, TimingResult } from "./timingTypes.ts";
import { evaluateTemperatureWindow } from "./evaluators/evaluateTemperatureWindow.ts";
import { pickTimingNote } from "./timingNotes.ts";

/** [dawn, morning, afternoon, evening] — matches avoid_heat evaluator */
const HEAT_ESCAPE_PERIODS: DaypartFlags = [true, false, false, true];

function mapFlagsToPreset(p: DaypartFlags): TimingResult["daypart_preset"] {
  const key = p.map((v) => (v ? "1" : "0")).join("");
  switch (key) {
    case "1001":
      return "early_late_low_light";
    case "0010":
      return "warmest_part_may_help";
    case "1101":
      return "cooler_low_light_better";
    case "1111":
      return "moving_water_periods";
    case "0110":
      return "warmest_part_may_help";
    case "0101":
      return "early_late_low_light";
    case "1100":
      return "early_late_low_light";
    case "0000":
      return "no_timing_edge";
    case "0011":
      return "warmest_part_may_help";
    case "0001":
      return "warmest_part_may_help";
    case "0100":
      return "warmest_part_may_help";
    case "1000":
      return "early_late_low_light";
    default:
      return "no_timing_edge";
  }
}

function needsHeatReconcile(p: DaypartFlags): boolean {
  const afternoon = p[2] === true;
  const morningAfternoonFallback =
    p[0] === false && p[1] === true && p[2] === true && p[3] === false;
  return afternoon || morningAfternoonFallback;
}

/**
 * @returns Updated result and whether periods/note were changed.
 */
export function reconcileHeatStressTiming(
  context: EngineContext,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
  result: TimingResult,
): { result: TimingResult; applied: boolean } {
  const heatSignal = evaluateTemperatureWindow("avoid_heat", norm, opts);
  if (!heatSignal) {
    return { result, applied: false };
  }

  if (isCoastalFamilyContext(context) && result.anchor_driver === "tide_exchange_window") {
    return { result, applied: false };
  }

  if (!needsHeatReconcile(result.highlighted_periods)) {
    return { result, applied: false };
  }

  const periods = [...HEAT_ESCAPE_PERIODS] as DaypartFlags;
  const preset = mapFlagsToPreset(periods);
  const note = pickTimingNote(
    "cooler_low_light",
    [
      context,
      norm.location.region_key,
      norm.location.local_date,
      result.anchor_driver,
      periods.map((v) => (v ? "1" : "0")).join(""),
    ].join("|"),
  );

  return {
    result: {
      ...result,
      anchor_driver: "avoid_heat",
      highlighted_periods: periods,
      daypart_preset: preset,
      daypart_note: note,
      timing_strength:
        result.timing_strength === "fair_default" ? "good" : result.timing_strength,
      trace: {
        ...result.trace,
        selection_reason:
          `${result.trace.selection_reason} | heat_stress_reconcile: removed midday/morning-afternoon highlight where air-temp model flags warm-day stress.`,
      },
    },
    applied: true,
  };
}
