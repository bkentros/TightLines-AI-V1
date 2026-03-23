/**
 * Fallback bias evaluator — always qualifies at fair_default strength.
 *
 * Used when neither the primary nor secondary timing driver produces
 * a meaningful intraday edge. The fallback bias is combo-specific
 * (defined in the timing family config) and broadly scientifically sensible.
 *
 * This is NOT generic "morning and evening for everything."
 * Each combo family has a deliberately chosen default bias.
 */

import type {
  DaypartBias,
  DaypartFlags,
  TimingSignal,
} from "../timingTypes.ts";

const BIAS_TO_PERIODS: Record<DaypartBias, DaypartFlags> = {
  dawn_evening:       [true,  false, false, true],
  afternoon:          [false, false, true,  false],
  morning_evening:    [false, true,  false, true],
  dawn_morning:       [true,  true,  false, false],
  morning_afternoon:  [false, true,  true,  false],
  all_day:            [true,  true,  true,  true],
};

const BIAS_TO_NOTE_KEY: Record<DaypartBias, string> = {
  dawn_evening:       "fallback_dawn_evening",
  afternoon:          "fallback_afternoon",
  morning_evening:    "fallback_morning_evening",
  dawn_morning:       "fallback_dawn_morning",
  morning_afternoon:  "fallback_morning_afternoon",
  all_day:            "fallback_all_day",
};

export function evaluateFallbackBias(bias: DaypartBias): TimingSignal {
  return {
    driver_id: "neutral_fallback",
    role: "anchor",
    strength: "fair_default",
    periods: [...BIAS_TO_PERIODS[bias]] as DaypartFlags,
    note_pool_key: BIAS_TO_NOTE_KEY[bias],
    debug_reason: `Fallback bias=${bias} — neither primary nor secondary qualified.`,
  };
}
