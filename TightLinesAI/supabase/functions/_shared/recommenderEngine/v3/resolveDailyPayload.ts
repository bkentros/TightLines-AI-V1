import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderV3Context } from "./contracts.ts";
import {
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
  type RecommenderV3DailyMoodNudge,
  type RecommenderV3DailyPayload,
  type RecommenderV3DailyPresentationNudge,
  type RecommenderV3DailyWaterColumnNudge,
} from "./contracts.ts";

type Accumulator = {
  mood: number;
  water: number;
  presentation: number;
};

type TriggerKey =
  | "temperature_condition"
  | "pressure_regime"
  | "wind_condition"
  | "light_cloud_condition"
  | "precipitation_disruption"
  | "runoff_flow_disruption"
  | "source_score_guardrail";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pushUnique(list: string[], note: string) {
  if (!list.includes(note)) list.push(note);
}

function markTriggered(list: TriggerKey[], key: TriggerKey) {
  if (!list.includes(key)) list.push(key);
}

function adjust(
  accumulator: Accumulator,
  next: Partial<Accumulator>,
) {
  accumulator.mood += next.mood ?? 0;
  accumulator.water += next.water ?? 0;
  accumulator.presentation += next.presentation ?? 0;
}

function toMoodNudge(score: number): RecommenderV3DailyMoodNudge {
  if (score >= 2) return "up_2";
  if (score >= 1) return "up_1";
  if (score <= -1) return "down_1";
  return "neutral";
}

function toWaterColumnNudge(score: number): RecommenderV3DailyWaterColumnNudge {
  if (score >= 1) return "higher_1";
  if (score <= -1) return "lower_1";
  return "neutral";
}

function toPresentationNudge(score: number): RecommenderV3DailyPresentationNudge {
  if (score >= 1) return "bolder";
  if (score <= -1) return "subtler";
  return "neutral";
}

function applyTemperatureRules(
  accumulator: Accumulator,
  analysis: SharedConditionAnalysis,
  notes: string[],
  triggered: TriggerKey[],
) {
  const context = analysis.condition_context;
  let touched = false;

  if (context.temperature_metabolic_context === "cold_limited") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "Cold-limited conditions pull fish tighter, lower, and less willing.");
    touched = true;
  } else if (context.temperature_metabolic_context === "heat_limited") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "Heat-limited conditions tighten fish and reduce roaming willingness.");
    touched = true;
  }

  if (context.temperature_trend === "warming") {
    adjust(accumulator, { mood: 1, water: 1 });
    pushUnique(notes, "A warming trend can lift fish slightly and improve willingness.");
    touched = true;
  } else if (context.temperature_trend === "cooling") {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(notes, "A cooling trend favors a lower, tighter daily lane.");
    touched = true;
  }

  if (context.temperature_shock === "sharp_warmup") {
    adjust(accumulator, { presentation: 1 });
    pushUnique(notes, "A sharp warmup can add some visibility need, but not a full aggressive move-up read.");
    touched = true;
  } else if (context.temperature_shock === "sharp_cooldown") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "A sharp cooldown pushes the day back toward control and patience.");
    touched = true;
  }

  if (touched) {
    markTriggered(triggered, "temperature_condition");
  }
}

function applyPressureRules(
  accumulator: Accumulator,
  pressureLabel: string | null,
  pressureScore: number | null,
  notes: string[],
  triggered: TriggerKey[],
) {
  let touched = false;
  switch (pressureLabel) {
    case "falling_slow":
    case "falling_moderate":
      adjust(accumulator, { mood: 1, presentation: 1 });
      if ((pressureScore ?? 0) >= 0.9) {
        adjust(accumulator, { mood: 1 });
      }
      pushUnique(notes, "Pre-front pressure supports more willingness and a stronger look.");
      touched = true;
      break;
    case "falling_hard":
    case "volatile":
    case "rising_fast":
      adjust(accumulator, { mood: -1, presentation: -1 });
      pushUnique(notes, "Unstable pressure favors a cleaner, more patient daily read.");
      touched = true;
      break;
    case "rising_slow":
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Slowly rising pressure trims the day toward subtler presentation.");
      touched = true;
      break;
    default:
      break;
  }
  if (touched) {
    markTriggered(triggered, "pressure_regime");
  }
}

function applyWindRules(
  accumulator: Accumulator,
  context: RecommenderV3Context,
  windLabel: string | null,
  windScore: number | null,
  notes: string[],
  triggered: TriggerKey[],
) {
  if (windLabel == null || windScore == null) return;
  let touched = false;

  if (context === "freshwater_lake_pond") {
    if ((windLabel === "calm" || windLabel === "light") && windScore >= 0.55) {
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Calmer lake water pushes the day toward subtler execution.");
      touched = true;
      markTriggered(triggered, "wind_condition");
      return;
    }

    if ((windLabel === "moderate" || windLabel === "strong") && windScore >= 0.45) {
      adjust(accumulator, { presentation: 1 });
      if (windScore >= 0.85) {
        adjust(accumulator, { mood: 1 });
      }
      pushUnique(notes, "Productive chop supports a bolder moving presentation.");
      touched = true;
      markTriggered(triggered, "wind_condition");
      return;
    }

    if ((windLabel === "strong" || windLabel === "extreme") && windScore <= -0.75) {
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Too much wind lowers comfort and fish position, but still favors added presence.");
      touched = true;
    }
    if (touched) markTriggered(triggered, "wind_condition");
    return;
  }

  if ((windLabel === "calm" || windLabel === "light") && windScore >= 0.55) {
    adjust(accumulator, { presentation: -1 });
    pushUnique(notes, "Calmer river conditions still reward a cleaner presentation.");
    markTriggered(triggered, "wind_condition");
    return;
  }

  if (windLabel === "strong" && windScore <= -0.75) {
    adjust(accumulator, { mood: -1 });
    pushUnique(notes, "Strong river wind lowers willingness even if current remains the primary driver.");
    touched = true;
  } else if (windLabel === "extreme" && windScore <= -1.0) {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(notes, "Extreme river wind tightens the daily read and lowers fish position slightly.");
    touched = true;
  }
  if (touched) {
    markTriggered(triggered, "wind_condition");
  }
}

function applyLightRules(
  accumulator: Accumulator,
  lightLabel: string | null,
  notes: string[],
  triggered: TriggerKey[],
) {
  let touched = false;
  switch (lightLabel) {
    case "heavy_overcast":
    case "low_light":
      adjust(accumulator, { mood: 1, presentation: 1 });
      pushUnique(notes, "Lower light supports a more assertive daily posture.");
      touched = true;
      break;
    case "glare":
    case "bright":
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Bright overhead light pushes the day toward subtler execution.");
      touched = true;
      break;
    default:
      break;
  }
  if (touched) {
    markTriggered(triggered, "light_cloud_condition");
  }
}

function applyDisruptionRules(
  accumulator: Accumulator,
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  notes: string[],
  triggered: TriggerKey[],
) {
  if (context === "freshwater_lake_pond") {
    const precipLabel = analysis.norm.normalized.precipitation_disruption?.label ?? null;
    const precipScore = analysis.norm.normalized.precipitation_disruption?.score ?? null;
    if (precipLabel === "active_disruption" || (precipScore ?? 0) <= -1.0) {
      adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
      pushUnique(notes, "Active rain disruption should tighten and slow the lake plan.");
      markTriggered(triggered, "precipitation_disruption");
    } else if (precipLabel === "recent_rain" && (precipScore ?? 0) <= -0.5) {
      adjust(accumulator, { mood: -1, water: -1 });
      pushUnique(notes, "Recent rain keeps lake fish a bit tighter even if the day stays fishable.");
      markTriggered(triggered, "precipitation_disruption");
    }
    return;
  }

  const precipLabel = analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const precipScore = analysis.norm.normalized.precipitation_disruption?.score ?? null;
  if (precipLabel === "active_disruption" || (precipScore ?? 0) <= -1.0) {
    adjust(accumulator, { mood: -1, presentation: -1 });
    pushUnique(notes, "Active river rain disruption should tighten the daily plan even before full runoff change.");
    markTriggered(triggered, "precipitation_disruption");
  } else if (precipLabel === "recent_rain" && (precipScore ?? 0) <= -0.6) {
    adjust(accumulator, { mood: -1 });
    pushUnique(notes, "Recent river rain trims willingness ahead of a larger flow shift.");
    markTriggered(triggered, "precipitation_disruption");
  }

  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ?? null;
  const runoffScore = analysis.norm.normalized.runoff_flow_disruption?.score ?? null;
  switch (runoffLabel) {
    case "perfect_clear":
    case "stable":
      adjust(accumulator, { mood: 1 });
      pushUnique(notes, "Stable river flow should improve fish willingness without changing the seasonal lane much.");
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "slightly_elevated":
      adjust(accumulator, { water: 1, presentation: 1 });
      if ((runoffScore ?? 0) <= -0.6) {
        adjust(accumulator, { mood: -1 });
      }
      pushUnique(notes, "Slightly elevated flow can pull fish toward softer higher-visibility current edges.");
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "elevated":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Elevated flow tightens the day, but asks for more presence.");
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "blown_out":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Blown-out flow is a tough day that still calls for added visibility and push.");
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    default:
      break;
  }
}

function applySourceScoreGuardrail(
  accumulator: Accumulator,
  sourceScore: number,
  notes: string[],
  triggered: TriggerKey[],
) {
  if (sourceScore <= 40) {
    accumulator.mood = Math.min(accumulator.mood, 0);
    accumulator.water = Math.min(accumulator.water, 0);
    accumulator.presentation = Math.min(accumulator.presentation, 0);
    pushUnique(notes, "Poor overall How's Fishing score caps the day from resolving as an upbeat move-up read.");
    markTriggered(triggered, "source_score_guardrail");
  } else if (sourceScore >= 80) {
    accumulator.mood = Math.max(accumulator.mood, 0);
    accumulator.water = Math.max(accumulator.water, 0);
    pushUnique(notes, "Strong overall How's Fishing score keeps the day from collapsing into a suppressed lane.");
    markTriggered(triggered, "source_score_guardrail");
  }
}

/**
 * V3 keeps the How's Fishing handoff intentionally compact:
 * - mood nudge
 * - water-column nudge
 * - presentation nudge
 *
 * This function reads only the core freshwater variables already prioritized in
 * How's Fishing and resolves whether today's conditions should open things up,
 * tighten things down, or stay neutral.
 */
export function resolveDailyPayloadV3(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
): RecommenderV3DailyPayload {
  const pressureLabel = analysis.norm.normalized.pressure_regime?.label ?? null;
  const pressureScore = analysis.norm.normalized.pressure_regime?.score ?? null;
  const windScore = analysis.norm.normalized.wind_condition?.score ?? null;
  const windLabel = analysis.norm.normalized.wind_condition?.label ?? null;
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const accumulator: Accumulator = {
    mood: 0,
    water: 0,
    presentation: 0,
  };
  const notes: string[] = [];
  const triggered: TriggerKey[] = [];

  applyTemperatureRules(accumulator, analysis, notes, triggered);
  applyPressureRules(accumulator, pressureLabel, pressureScore, notes, triggered);
  applyWindRules(accumulator, context, windLabel, windScore, notes, triggered);
  applyLightRules(accumulator, lightLabel, notes, triggered);
  applyDisruptionRules(accumulator, analysis, context, notes, triggered);
  applySourceScoreGuardrail(accumulator, analysis.scored.score, notes, triggered);

  const clampedMood = clamp(accumulator.mood, -1, 2);
  const clampedWaterColumn = clamp(accumulator.water, -1, 1);
  const clampedPresentation = clamp(accumulator.presentation, -1, 1);

  return {
    mood_nudge: toMoodNudge(clampedMood),
    water_column_nudge: toWaterColumnNudge(clampedWaterColumn),
    presentation_nudge: toPresentationNudge(clampedPresentation),
    variables_considered: V3_SCORED_VARIABLE_KEYS_BY_CONTEXT[context],
    variables_triggered: triggered,
    notes,
    source_score: analysis.scored.score,
    source_band: analysis.scored.band,
  };
}
