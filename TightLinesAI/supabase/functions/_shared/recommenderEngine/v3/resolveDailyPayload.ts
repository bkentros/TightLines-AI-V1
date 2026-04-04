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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pushUnique(list: string[], note: string) {
  if (!list.includes(note)) list.push(note);
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
) {
  const context = analysis.condition_context;

  if (context.temperature_metabolic_context === "cold_limited") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "Cold-limited conditions pull fish tighter, lower, and less willing.");
  } else if (context.temperature_metabolic_context === "heat_limited") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "Heat-limited conditions tighten fish and reduce roaming willingness.");
  }

  if (context.temperature_trend === "warming") {
    adjust(accumulator, { mood: 1, water: 1 });
    pushUnique(notes, "A warming trend can lift fish slightly and improve willingness.");
  } else if (context.temperature_trend === "cooling") {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(notes, "A cooling trend favors a lower, tighter daily lane.");
  }

  if (context.temperature_shock === "sharp_warmup") {
    adjust(accumulator, { mood: 1, presentation: 1 });
    pushUnique(notes, "A sharp warmup can justify a slightly more aggressive daily posture.");
  } else if (context.temperature_shock === "sharp_cooldown") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(notes, "A sharp cooldown pushes the day back toward control and patience.");
  }
}

function applyPressureRules(
  accumulator: Accumulator,
  pressureLabel: string | null,
  notes: string[],
) {
  switch (pressureLabel) {
    case "falling_slow":
    case "falling_moderate":
      adjust(accumulator, { mood: 1, presentation: 1 });
      pushUnique(notes, "Pre-front pressure supports more willingness and a stronger look.");
      break;
    case "falling_hard":
    case "volatile":
    case "rising_fast":
      adjust(accumulator, { mood: -1, presentation: -1 });
      pushUnique(notes, "Unstable pressure favors a cleaner, more patient daily read.");
      break;
    case "rising_slow":
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Slowly rising pressure trims the day toward subtler presentation.");
      break;
    default:
      break;
  }
}

function applyWindRules(
  accumulator: Accumulator,
  context: RecommenderV3Context,
  windLabel: string | null,
  windScore: number | null,
  notes: string[],
) {
  if (windLabel == null || windScore == null) return;

  if (context === "freshwater_lake_pond") {
    if ((windLabel === "calm" || windLabel === "light") && windScore >= 0.55) {
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Calmer lake water pushes the day toward subtler execution.");
      return;
    }

    if ((windLabel === "moderate" || windLabel === "strong") && windScore >= 0.45) {
      adjust(accumulator, { presentation: 1 });
      pushUnique(notes, "Productive chop supports a bolder moving presentation.");
      return;
    }

    if ((windLabel === "strong" || windLabel === "extreme") && windScore <= -0.75) {
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Too much wind lowers comfort and fish position, but still favors added presence.");
    }
    return;
  }

  if ((windLabel === "calm" || windLabel === "light") && windScore >= 0.55) {
    adjust(accumulator, { presentation: -1 });
    pushUnique(notes, "Calmer river conditions still reward a cleaner presentation.");
    return;
  }

  if (windLabel === "strong" && windScore <= -0.75) {
    adjust(accumulator, { mood: -1 });
    pushUnique(notes, "Strong river wind lowers willingness even if current remains the primary driver.");
  } else if (windLabel === "extreme" && windScore <= -1.0) {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(notes, "Extreme river wind tightens the daily read and lowers fish position slightly.");
  }
}

function applyLightRules(
  accumulator: Accumulator,
  lightLabel: string | null,
  notes: string[],
) {
  switch (lightLabel) {
    case "heavy_overcast":
    case "low_light":
      adjust(accumulator, { mood: 1, presentation: 1 });
      pushUnique(notes, "Lower light supports a more assertive daily posture.");
      break;
    case "glare":
    case "bright":
      adjust(accumulator, { presentation: -1 });
      pushUnique(notes, "Bright overhead light pushes the day toward subtler execution.");
      break;
    default:
      break;
  }
}

function applyDisruptionRules(
  accumulator: Accumulator,
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  notes: string[],
) {
  if (context === "freshwater_lake_pond") {
    const precipLabel = analysis.norm.normalized.precipitation_disruption?.label ?? null;
    const precipScore = analysis.norm.normalized.precipitation_disruption?.score ?? null;
    if (precipLabel === "active_disruption" || (precipScore ?? 0) <= -1.0) {
      adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
      pushUnique(notes, "Active rain disruption should tighten and slow the lake plan.");
    } else if (precipLabel === "recent_rain" && (precipScore ?? 0) <= -0.5) {
      adjust(accumulator, { mood: -1, water: -1 });
      pushUnique(notes, "Recent rain keeps lake fish a bit tighter even if the day stays fishable.");
    }
    return;
  }

  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ?? null;
  switch (runoffLabel) {
    case "perfect_clear":
    case "stable":
      adjust(accumulator, { mood: 1 });
      pushUnique(notes, "Stable river flow should improve fish willingness without changing the seasonal lane much.");
      break;
    case "slightly_elevated":
      adjust(accumulator, { water: 1, presentation: 1 });
      pushUnique(notes, "Slightly elevated flow can pull fish toward softer higher-visibility current edges.");
      break;
    case "elevated":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Elevated flow tightens the day, but asks for more presence.");
      break;
    case "blown_out":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(notes, "Blown-out flow is a tough day that still calls for added visibility and push.");
      break;
    default:
      break;
  }
}

function applySourceScoreGuardrail(
  accumulator: Accumulator,
  sourceScore: number,
  notes: string[],
) {
  if (sourceScore <= 40) {
    accumulator.mood = Math.min(accumulator.mood, 0);
    accumulator.water = Math.min(accumulator.water, 0);
    pushUnique(notes, "Poor overall How's Fishing score caps the day from resolving as an upbeat move-up read.");
  } else if (sourceScore >= 80) {
    accumulator.mood = Math.max(accumulator.mood, 0);
    accumulator.water = Math.max(accumulator.water, 0);
    pushUnique(notes, "Strong overall How's Fishing score keeps the day from collapsing into a suppressed lane.");
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
  const windScore = analysis.norm.normalized.wind_condition?.score ?? null;
  const windLabel = analysis.norm.normalized.wind_condition?.label ?? null;
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const accumulator: Accumulator = {
    mood: 0,
    water: 0,
    presentation: 0,
  };
  const notes: string[] = [];

  applyTemperatureRules(accumulator, analysis, notes);
  applyPressureRules(accumulator, pressureLabel, notes);
  applyWindRules(accumulator, context, windLabel, windScore, notes);
  applyLightRules(accumulator, lightLabel, notes);
  applyDisruptionRules(accumulator, analysis, context, notes);
  applySourceScoreGuardrail(accumulator, analysis.scored.score, notes);

  const clampedMood = clamp(accumulator.mood, -1, 2);
  const clampedWaterColumn = clamp(accumulator.water, -1, 1);
  const clampedPresentation = clamp(accumulator.presentation, -1, 1);

  return {
    mood_nudge: toMoodNudge(clampedMood),
    water_column_nudge: toWaterColumnNudge(clampedWaterColumn),
    presentation_nudge: toPresentationNudge(clampedPresentation),
    variables_considered: V3_SCORED_VARIABLE_KEYS_BY_CONTEXT[context],
    notes,
    source_score: analysis.scored.score,
    source_band: analysis.scored.band,
  };
}
