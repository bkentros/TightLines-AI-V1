/**
 * Explicit LLM guardrails derived from normalized state — not redundant with
 * driver prose; tells the model how to interpret temperature vs tactics/timing.
 */

import type { SharedNormalizedOutput, TemperatureMetabolicContext } from "../contracts/mod.ts";
import { evaluateTemperatureWindow } from "../timing/evaluators/evaluateTemperatureWindow.ts";
import type { TimingEvalOptions } from "../timing/timingTypes.ts";
import { engineScoreTier, ENGINE_SCORE_EPSILON } from "../score/engineScoreMath.ts";

const DAYPART_LABELS = ["dawn", "morning", "afternoon", "evening"] as const;

export function deriveTemperatureMetabolicContext(
  t: SharedNormalizedOutput["normalized"]["temperature"],
): TemperatureMetabolicContext {
  if (!t) return "neutral";
  const { band_label, final_score } = t;
  if (
    (band_label === "very_warm" || band_label === "warm") &&
    final_score <= ENGINE_SCORE_EPSILON
  ) {
    return "heat_limited";
  }
  if (
    (band_label === "very_cold" || band_label === "cool") &&
    engineScoreTier(final_score) <= -1
  ) {
    return "cold_limited";
  }
  return "neutral";
}

/** Same gate as timing avoid_heat + reconcile (cloud / trend exclusions). */
export function avoidHeatTimingApplies(
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): boolean {
  return evaluateTemperatureWindow("avoid_heat", norm, opts) !== null;
}

export function highlightedDaypartLabels(
  periods: readonly [boolean, boolean, boolean, boolean],
): string[] {
  return DAYPART_LABELS.filter((_, i) => periods[i]);
}
