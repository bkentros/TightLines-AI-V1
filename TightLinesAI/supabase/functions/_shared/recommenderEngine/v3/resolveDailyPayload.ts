import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderV3Context } from "./contracts.ts";
import {
  type RecommenderV3DailyMoodNudge,
  type RecommenderV3DailyPayload,
  type RecommenderV3DailyPresentationNudge,
  type RecommenderV3DailyWaterColumnNudge,
  type RecommenderV3PaceBias,
  type RecommenderV3SurfaceWindow,
  type RecommenderV3TacticalWindow,
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
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
  | "source_score_guardrail"
  | "timing_window"
  | "reaction_window"
  | "finesse_window"
  | "pace_bias";

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

function toPresentationNudge(
  score: number,
): RecommenderV3DailyPresentationNudge {
  if (score >= 1) return "bolder";
  if (score <= -1) return "subtler";
  return "neutral";
}

function toTacticalWindow(score: number): RecommenderV3TacticalWindow {
  if (score >= 4) return "on";
  if (score >= 2) return "watch";
  return "off";
}

function reconcileTacticalWindows(
  reactionScore: number,
  finesseScore: number,
): {
  reaction_window: RecommenderV3TacticalWindow;
  finesse_window: RecommenderV3TacticalWindow;
} {
  let reaction_window = toTacticalWindow(reactionScore);
  let finesse_window = toTacticalWindow(finesseScore);

  if (reaction_window !== "off" && finesse_window !== "off") {
    if (reactionScore >= finesseScore + 2) {
      finesse_window = "off";
    } else if (finesseScore >= reactionScore + 2) {
      reaction_window = "off";
    } else {
      reaction_window = "watch";
      finesse_window = "watch";
    }
  }

  return { reaction_window, finesse_window };
}

function resolveReactionScore(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  pressureLabel: string | null,
  windLabel: string | null,
  windScore: number | null,
  lightLabel: string | null,
  clampedMood: number,
  clampedPresentation: number,
): number {
  let score = 0;
  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ??
    null;
  const precipLabel =
    analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const metabolicContext =
    analysis.condition_context.temperature_metabolic_context;

  if (analysis.condition_context.temperature_trend === "warming") score += 1;
  if (
    pressureLabel === "falling_slow" || pressureLabel === "falling_moderate"
  ) score += 1;
  if (lightLabel === "low_light" || lightLabel === "heavy_overcast") score += 1;
  if (analysis.scored.score >= 65) score += 1;
  if (clampedMood >= 1) score += 1;
  if (clampedPresentation >= 0) score += 1;

  if (
    context === "freshwater_lake_pond" &&
    (windLabel === "moderate" || windLabel === "strong") &&
    (windScore ?? 0) >= 0.45
  ) {
    score += 1;
  }
  if (
    context === "freshwater_river" &&
    (runoffLabel === "perfect_clear" || runoffLabel === "stable" ||
      runoffLabel === "slightly_elevated")
  ) {
    score += 1;
  }

  if (lightLabel === "bright" || lightLabel === "glare") score -= 1;
  if (
    metabolicContext === "cold_limited" || metabolicContext === "heat_limited"
  ) score -= 1;
  if (
    pressureLabel === "volatile" || pressureLabel === "rising_fast" ||
    pressureLabel === "falling_hard"
  ) {
    score -= 1;
  }
  if (precipLabel === "active_disruption") score -= 1;
  if (runoffLabel === "elevated" || runoffLabel === "blown_out") score -= 1;

  return score;
}

function resolveFinesseScore(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  pressureLabel: string | null,
  windLabel: string | null,
  windScore: number | null,
  lightLabel: string | null,
  clampedMood: number,
  clampedPresentation: number,
): number {
  let score = 0;
  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ??
    null;
  const precipLabel =
    analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const metabolicContext =
    analysis.condition_context.temperature_metabolic_context;

  if (lightLabel === "bright" || lightLabel === "glare") score += 1;
  if (
    (windLabel === "calm" || windLabel === "light") && (windScore ?? 0) >= 0.55
  ) score += 1;
  if (
    pressureLabel === "rising_slow" ||
    pressureLabel === "rising_fast" ||
    pressureLabel === "volatile" ||
    pressureLabel === "falling_hard"
  ) {
    score += 1;
  }
  if (analysis.scored.score <= 55) score += 1;
  if (
    metabolicContext === "cold_limited" || metabolicContext === "heat_limited"
  ) score += 1;
  if (clampedMood <= 0) score += 1;
  if (clampedPresentation <= 0) score += 1;
  if (precipLabel === "recent_rain" || precipLabel === "active_disruption") {
    score += 1;
  }
  if (
    context === "freshwater_river" &&
    (runoffLabel === "elevated" || runoffLabel === "blown_out")
  ) score += 1;

  if (lightLabel === "low_light" || lightLabel === "heavy_overcast") score -= 1;
  if (
    pressureLabel === "falling_slow" || pressureLabel === "falling_moderate"
  ) score -= 1;
  if (analysis.condition_context.temperature_trend === "warming") score -= 1;
  if (
    context === "freshwater_lake_pond" &&
    (windLabel === "moderate" || windLabel === "strong") &&
    (windScore ?? 0) >= 0.45
  ) {
    score -= 1;
  }
  if (analysis.scored.score >= 75) score -= 1;

  return score;
}

function resolvePaceBias(
  reaction_window: RecommenderV3TacticalWindow,
  finesse_window: RecommenderV3TacticalWindow,
  surface_window: RecommenderV3SurfaceWindow,
): RecommenderV3PaceBias {
  if (
    (reaction_window === "on" || reaction_window === "watch") &&
    finesse_window === "off"
  ) {
    return "fast";
  }
  if (
    (finesse_window === "on" || finesse_window === "watch") &&
    reaction_window === "off"
  ) {
    return "slow";
  }
  if (
    surface_window === "on" && reaction_window === "off" &&
    finesse_window === "off"
  ) {
    return "fast";
  }
  return "neutral";
}

function resolveSurfaceWindow(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  windLabel: string | null,
  windScore: number | null,
  lightLabel: string | null,
  clampedMood: number,
  clampedPresentation: number,
): RecommenderV3SurfaceWindow {
  const highlighted = analysis.timing.highlighted_periods ??
    [false, false, false, false];
  const [dawn, , , evening] = highlighted;
  const shoulderPeriods = dawn || evening;
  const timingStrength = analysis.timing.timing_strength;
  const strongTiming = timingStrength === "good" ||
    timingStrength === "strong" || timingStrength === "very_strong";
  const lowLight = lightLabel === "low_light" ||
    lightLabel === "heavy_overcast";
  const brightSuppression = lightLabel === "bright" || lightLabel === "glare";
  const coldLimited =
    analysis.condition_context.temperature_metabolic_context === "cold_limited";
  const strongRiverWind = context === "freshwater_river" &&
    windLabel === "strong" && (windScore ?? 0) <= -0.75;
  const extremeRiverWind = context === "freshwater_river" &&
    windLabel === "extreme" && (windScore ?? 0) <= -1.0;
  const calmSurfaceWind = windLabel === "calm" || windLabel === "light";
  const overcastExtension = !shoulderPeriods &&
    lowLight &&
    calmSurfaceWind &&
    analysis.scored.score >= 55 &&
    clampedMood >= 0 &&
    clampedPresentation >= 0;

  if (
    (!shoulderPeriods && !overcastExtension) ||
    coldLimited ||
    brightSuppression ||
    extremeRiverWind
  ) {
    return "off";
  }
  if (
    strongTiming && analysis.scored.score >= 55 && clampedMood >= 0 &&
    clampedPresentation >= 0
  ) {
    return strongRiverWind ? "watch" : "on";
  }
  if (
    analysis.scored.score >= 45 && (strongTiming || lowLight) &&
    clampedMood >= -0.5
  ) {
    return "watch";
  }
  return "off";
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
    pushUnique(
      notes,
      "Cold-limited conditions pull fish tighter, lower, and less willing.",
    );
    touched = true;
  } else if (context.temperature_metabolic_context === "heat_limited") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(
      notes,
      "Heat-limited conditions tighten fish and reduce roaming willingness.",
    );
    touched = true;
  }

  if (context.temperature_trend === "warming") {
    adjust(accumulator, { mood: 1, water: 1 });
    pushUnique(
      notes,
      "A warming trend can lift fish slightly and improve willingness.",
    );
    touched = true;
  } else if (context.temperature_trend === "cooling") {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(notes, "A cooling trend favors a lower, tighter daily lane.");
    touched = true;
  }

  if (context.temperature_shock === "sharp_warmup") {
    adjust(accumulator, { presentation: 1 });
    pushUnique(
      notes,
      "A sharp warmup can add some visibility need, but not a full aggressive move-up read.",
    );
    touched = true;
  } else if (context.temperature_shock === "sharp_cooldown") {
    adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
    pushUnique(
      notes,
      "A sharp cooldown pushes the day back toward control and patience.",
    );
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
      pushUnique(
        notes,
        "Pre-front pressure supports more willingness and a stronger look.",
      );
      touched = true;
      break;
    case "falling_hard":
    case "volatile":
    case "rising_fast":
      adjust(accumulator, { mood: -1, presentation: -1 });
      pushUnique(
        notes,
        "Unstable pressure favors a cleaner, more patient daily read.",
      );
      touched = true;
      break;
    case "rising_slow":
      adjust(accumulator, { presentation: -1 });
      pushUnique(
        notes,
        "Slowly rising pressure trims the day toward subtler presentation.",
      );
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
      pushUnique(
        notes,
        "Calmer lake water pushes the day toward subtler execution.",
      );
      touched = true;
      markTriggered(triggered, "wind_condition");
      return;
    }

    if (
      (windLabel === "moderate" || windLabel === "strong") && windScore >= 0.45
    ) {
      adjust(accumulator, { presentation: 1 });
      if (windScore >= 0.85) {
        adjust(accumulator, { mood: 1 });
      }
      pushUnique(
        notes,
        "Productive chop supports a bolder moving presentation.",
      );
      touched = true;
      markTriggered(triggered, "wind_condition");
      return;
    }

    if (
      (windLabel === "strong" || windLabel === "extreme") && windScore <= -0.75
    ) {
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(
        notes,
        "Too much wind lowers comfort and fish position, but still favors added presence.",
      );
      touched = true;
    }
    if (touched) markTriggered(triggered, "wind_condition");
    return;
  }

  if ((windLabel === "calm" || windLabel === "light") && windScore >= 0.55) {
    adjust(accumulator, { presentation: -1 });
    pushUnique(
      notes,
      "Calmer river conditions still reward a cleaner presentation.",
    );
    markTriggered(triggered, "wind_condition");
    return;
  }

  if (windLabel === "strong" && windScore <= -0.75) {
    adjust(accumulator, { mood: -1 });
    pushUnique(
      notes,
      "Strong river wind lowers willingness even if current remains the primary driver.",
    );
    touched = true;
  } else if (windLabel === "extreme" && windScore <= -1.0) {
    adjust(accumulator, { mood: -1, water: -1 });
    pushUnique(
      notes,
      "Extreme river wind tightens the daily read and lowers fish position slightly.",
    );
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
      pushUnique(
        notes,
        "Bright overhead light pushes the day toward subtler execution.",
      );
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
    const precipLabel =
      analysis.norm.normalized.precipitation_disruption?.label ?? null;
    const precipScore =
      analysis.norm.normalized.precipitation_disruption?.score ?? null;
    if (precipLabel === "active_disruption" || (precipScore ?? 0) <= -1.0) {
      adjust(accumulator, { mood: -1, water: -1, presentation: -1 });
      pushUnique(
        notes,
        "Active rain disruption should tighten and slow the lake plan.",
      );
      markTriggered(triggered, "precipitation_disruption");
    } else if (precipLabel === "recent_rain" && (precipScore ?? 0) <= -0.5) {
      adjust(accumulator, { mood: -1, water: -1 });
      pushUnique(
        notes,
        "Recent rain keeps lake fish a bit tighter even if the day stays fishable.",
      );
      markTriggered(triggered, "precipitation_disruption");
    }
    return;
  }

  const precipLabel =
    analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const precipScore =
    analysis.norm.normalized.precipitation_disruption?.score ?? null;
  if (precipLabel === "active_disruption" || (precipScore ?? 0) <= -1.0) {
    adjust(accumulator, { mood: -1, presentation: -1 });
    pushUnique(
      notes,
      "Active river rain disruption should tighten the daily plan even before full runoff change.",
    );
    markTriggered(triggered, "precipitation_disruption");
  } else if (precipLabel === "recent_rain" && (precipScore ?? 0) <= -0.6) {
    adjust(accumulator, { mood: -1 });
    pushUnique(
      notes,
      "Recent river rain trims willingness ahead of a larger flow shift.",
    );
    markTriggered(triggered, "precipitation_disruption");
  }

  const runoffLabel = analysis.norm.normalized.runoff_flow_disruption?.label ??
    null;
  const runoffScore = analysis.norm.normalized.runoff_flow_disruption?.score ??
    null;
  switch (runoffLabel) {
    case "perfect_clear":
    case "stable":
      adjust(accumulator, { mood: 1 });
      pushUnique(
        notes,
        "Stable river flow should improve fish willingness without changing the seasonal lane much.",
      );
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "slightly_elevated":
      adjust(accumulator, { water: 1, presentation: 1 });
      if ((runoffScore ?? 0) <= -0.6) {
        adjust(accumulator, { mood: -1 });
      }
      pushUnique(
        notes,
        "Slightly elevated flow can pull fish toward softer higher-visibility current edges.",
      );
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "elevated":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(
        notes,
        "Elevated flow tightens the day, but asks for more presence.",
      );
      markTriggered(triggered, "runoff_flow_disruption");
      break;
    case "blown_out":
      adjust(accumulator, { mood: -1, water: -1, presentation: 1 });
      pushUnique(
        notes,
        "Blown-out flow is a tough day that still calls for added visibility and push.",
      );
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
    pushUnique(
      notes,
      "Poor overall How's Fishing score caps the day from resolving as an upbeat move-up read.",
    );
    markTriggered(triggered, "source_score_guardrail");
  } else if (sourceScore >= 80) {
    accumulator.mood = Math.max(accumulator.mood, 0);
    accumulator.water = Math.max(accumulator.water, 0);
    pushUnique(
      notes,
      "Strong overall How's Fishing score keeps the day from collapsing into a suppressed lane.",
    );
    markTriggered(triggered, "source_score_guardrail");
  }
}

/**
 * V3 keeps the How's Fishing handoff intentionally compact:
 * - mood nudge
 * - water-column nudge
 * - presentation nudge
 * - bounded tactical windows for reaction, finesse, and pace
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
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ??
    null;
  const accumulator: Accumulator = {
    mood: 0,
    water: 0,
    presentation: 0,
  };
  const notes: string[] = [];
  const triggered: TriggerKey[] = [];

  applyTemperatureRules(accumulator, analysis, notes, triggered);
  applyPressureRules(
    accumulator,
    pressureLabel,
    pressureScore,
    notes,
    triggered,
  );
  applyWindRules(accumulator, context, windLabel, windScore, notes, triggered);
  applyLightRules(accumulator, lightLabel, notes, triggered);
  applyDisruptionRules(accumulator, analysis, context, notes, triggered);
  applySourceScoreGuardrail(
    accumulator,
    analysis.scored.score,
    notes,
    triggered,
  );

  const clampedMood = clamp(accumulator.mood, -1, 2);
  const clampedWaterColumn = clamp(accumulator.water, -1, 1);
  const clampedPresentation = clamp(accumulator.presentation, -1, 1);
  const reactionScore = resolveReactionScore(
    analysis,
    context,
    pressureLabel,
    windLabel,
    windScore,
    lightLabel,
    clampedMood,
    clampedPresentation,
  );
  const finesseScore = resolveFinesseScore(
    analysis,
    context,
    pressureLabel,
    windLabel,
    windScore,
    lightLabel,
    clampedMood,
    clampedPresentation,
  );
  const { reaction_window, finesse_window } = reconcileTacticalWindows(
    reactionScore,
    finesseScore,
  );
  const surfaceWindow = resolveSurfaceWindow(
    analysis,
    context,
    windLabel,
    windScore,
    lightLabel,
    clampedMood,
    clampedPresentation,
  );
  const paceBias = resolvePaceBias(
    reaction_window,
    finesse_window,
    surfaceWindow,
  );

  if (surfaceWindow !== "off") {
    pushUnique(
      notes,
      surfaceWindow === "on"
        ? "Timing and light support a real surface or wake window."
        : "There is at least a watch-level surface window if fish start looking up.",
    );
    markTriggered(triggered, "timing_window");
  }
  if (reaction_window !== "off") {
    pushUnique(
      notes,
      reaction_window === "on"
        ? "Daily cues support moving, search, and reaction-style presentations."
        : "There is a watch-level reaction lane if fish show willingness to chase.",
    );
    markTriggered(triggered, "reaction_window");
  }
  if (finesse_window !== "off") {
    pushUnique(
      notes,
      finesse_window === "on"
        ? "Daily cues support a slower, cleaner finesse posture."
        : "There is a watch-level finesse lane if fish stay selective.",
    );
    markTriggered(triggered, "finesse_window");
  }
  if (paceBias !== "neutral") {
    pushUnique(
      notes,
      paceBias === "fast"
        ? "The day supports a faster overall pace when the seasonal pool allows it."
        : "The day supports a slower overall pace when the seasonal pool allows it.",
    );
    markTriggered(triggered, "pace_bias");
  }

  return {
    mood_nudge: toMoodNudge(clampedMood),
    water_column_nudge: toWaterColumnNudge(clampedWaterColumn),
    presentation_nudge: toPresentationNudge(clampedPresentation),
    surface_window: surfaceWindow,
    reaction_window,
    finesse_window,
    pace_bias: paceBias,
    variables_considered: V3_SCORED_VARIABLE_KEYS_BY_CONTEXT[context],
    variables_triggered: triggered,
    notes,
    source_score: analysis.scored.score,
    source_band: analysis.scored.band,
  };
}
