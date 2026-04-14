import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type {
  DailyPostureBandV3,
  DailyReactionWindowV3,
  DailySurfaceWindowV3,
  OpportunityMixModeV3,
  RecommenderV3Context,
  RecommenderV3DailyPayload,
} from "./contracts.ts";
import { V3_SCORED_VARIABLE_KEYS_BY_CONTEXT } from "./contracts.ts";

type TriggerKey =
  | "temperature_metabolic_context"
  | "temperature_trend"
  | "temperature_shock"
  | "pressure_regime"
  | "wind_condition"
  | "light_cloud_condition"
  | "precipitation_disruption"
  | "runoff_flow_disruption";

function normalizeLightLabel(label: string | null): string | null {
  if (label === "mixed_sky") return "mixed";
  return label;
}

function pushNote(notes: string[], note: string | null) {
  if (!note) return;
  if (!notes.includes(note)) notes.push(note);
}

function pushTriggered(
  list: TriggerKey[],
  key: TriggerKey,
  active: boolean,
) {
  if (!active) return;
  if (!list.includes(key)) list.push(key);
}

function resolvePostureBand(score: number): DailyPostureBandV3 {
  if (score <= -2) return "suppressed";
  if (score <= -1) return "slightly_suppressed";
  if (score >= 2) return "aggressive";
  if (score >= 1) return "slightly_aggressive";
  return "neutral";
}

function resolveReactionWindow(
  postureBand: DailyPostureBandV3,
  lightLabel: string | null,
  pressureLabel: string | null,
): DailyReactionWindowV3 {
  if (
    postureBand === "aggressive" &&
    (
      lightLabel === "low_light" ||
      lightLabel === "heavy_overcast" ||
      pressureLabel === "falling_slow" ||
      pressureLabel === "falling_moderate"
    )
  ) {
    return "on";
  }
  if (postureBand === "suppressed" || postureBand === "slightly_suppressed") {
    return "off";
  }
  return "watch";
}

function resolveSurfaceWindow(
  lightLabel: string | null,
  windLabel: string | null,
  postureBand: DailyPostureBandV3,
  runoffLabel: string | null,
): DailySurfaceWindowV3 {
  if (
    postureBand === "suppressed" ||
    windLabel === "strong" ||
    windLabel === "extreme" ||
    runoffLabel === "elevated" ||
    runoffLabel === "blown_out"
  ) {
    return "closed";
  }
  if (
    lightLabel === "bright" ||
    lightLabel === "glare" ||
    postureBand === "slightly_suppressed"
  ) {
    return "closed";
  }
  if (
    lightLabel === "low_light"
  ) {
    return windLabel === "moderate" ? "rippled" : "clean";
  }
  if (
    lightLabel === "heavy_overcast" ||
    windLabel === "moderate"
  ) {
    return "rippled";
  }
  return "rippled";
}

function resolveOpportunityMix(
  postureBand: DailyPostureBandV3,
  reactionWindow: DailyReactionWindowV3,
): OpportunityMixModeV3 {
  if (postureBand === "aggressive" || reactionWindow === "on") {
    return "aggressive";
  }
  if (postureBand === "suppressed" || postureBand === "slightly_suppressed") {
    return "conservative";
  }
  return "balanced";
}

/**
 * Deterministic daily handoff:
 * - consume normalized upstream states
 * - emit bounded tactical shifts and hard gates
 * - keep the reasoning inspectable
 */
export function resolveDailyPayloadV3(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  clarity: WaterClarity,
): RecommenderV3DailyPayload {
  const pressureLabel = analysis.norm.normalized.pressure_regime?.label ?? null;
  const windLabel = analysis.norm.normalized.wind_condition?.label ?? null;
  const lightLabel = normalizeLightLabel(
    analysis.norm.normalized.light_cloud_condition?.label ?? null,
  );
  const precipLabel =
    analysis.norm.normalized.precipitation_disruption?.label ?? null;
  const runoffLabel =
    analysis.norm.normalized.runoff_flow_disruption?.label ?? null;

  let postureScore = 0;
  let columnShift: -1 | 0 | 1 = 0;
  let paceShift: -1 | 0 | 1 = 0;
  let presenceShift: -1 | 0 | 1 = 0;

  const notes: string[] = [];
  const triggered: TriggerKey[] = [];

  const metabolic = analysis.condition_context.temperature_metabolic_context;
  if (metabolic === "cold_limited" || metabolic === "heat_limited") {
    postureScore -= 2;
    paceShift = -1;
    columnShift = -1;
    pushNote(
      notes,
      "Temperature metabolism suppresses the day and favors slower execution.",
    );
    pushTriggered(triggered, "temperature_metabolic_context", true);
  } else {
    postureScore += 1;
  }

  if (analysis.condition_context.temperature_trend === "warming") {
    postureScore += 1;
    columnShift = 1;
    pushNote(
      notes,
      "A warming trend nudges fish slightly higher in the allowed range.",
    );
    pushTriggered(triggered, "temperature_trend", true);
  } else if (analysis.condition_context.temperature_trend === "cooling") {
    postureScore -= 1;
    columnShift = -1;
    paceShift = -1;
    pushNote(
      notes,
      "A cooling trend tightens fish and shifts preference lower and slower.",
    );
    pushTriggered(triggered, "temperature_trend", true);
  }

  if (analysis.condition_context.temperature_shock === "sharp_cooldown") {
    postureScore -= 1;
    columnShift = -1;
    pushNote(notes, "A sharp cooldown reinforces a lower daily lane.");
    pushTriggered(triggered, "temperature_shock", true);
  } else if (analysis.condition_context.temperature_shock === "sharp_warmup") {
    postureScore += 1;
    columnShift = 1;
    pushTriggered(triggered, "temperature_shock", true);
  }

  if (pressureLabel === "falling_slow" || pressureLabel === "falling_moderate") {
    postureScore += 1;
    paceShift = 1;
    pushNote(notes, "Falling pressure supports a more willing feeding window.");
    pushTriggered(triggered, "pressure_regime", true);
  } else if (pressureLabel === "rising_fast" || pressureLabel === "volatile") {
    postureScore -= 1;
    paceShift = -1;
    pushNote(notes, "Rising or volatile pressure tightens the daily window.");
    pushTriggered(triggered, "pressure_regime", true);
  }

  if (lightLabel === "low_light" || lightLabel === "heavy_overcast") {
    postureScore += 1;
    if (columnShift < 1) columnShift = 1;
    if (clarity !== "clear") presenceShift = 1;
    pushNote(notes, "Lower light supports a slightly higher, more open lane.");
    pushTriggered(triggered, "light_cloud_condition", true);
  } else if (lightLabel === "bright" || lightLabel === "glare") {
    postureScore -= 1;
    if (columnShift > -1) columnShift = -1;
    if (paceShift > -1) paceShift = -1;
    if (clarity === "clear") presenceShift = -1;
    pushNote(notes, "Bright light trims the day back toward cleaner looks.");
    pushTriggered(triggered, "light_cloud_condition", true);
  }

  if (windLabel === "moderate") {
    if (context === "freshwater_lake_pond") {
      postureScore += 1;
      if (clarity !== "clear") presenceShift = 1;
      pushNote(
        notes,
        "Moderate chop improves fishability and supports a stronger moving look.",
      );
    }
    pushTriggered(triggered, "wind_condition", true);
  } else if (windLabel === "strong" || windLabel === "extreme") {
    postureScore -= 1;
    pushNote(notes, "Strong wind reduces clean execution.");
    pushTriggered(triggered, "wind_condition", true);
  }

  if (context === "freshwater_river") {
    if (runoffLabel === "slightly_elevated") {
      presenceShift = 1;
      pushNote(
        notes,
        "Slightly elevated runoff supports a more visible river presentation.",
      );
      pushTriggered(triggered, "runoff_flow_disruption", true);
    } else if (runoffLabel === "elevated" || runoffLabel === "blown_out") {
      postureScore -= 2;
      columnShift = -1;
      paceShift = -1;
      presenceShift = 1;
      pushNote(
        notes,
        "Elevated runoff tightens fish and pulls the day lower and slower.",
      );
      pushTriggered(triggered, "runoff_flow_disruption", true);
    } else if (runoffLabel === "perfect_clear" || runoffLabel === "stable") {
      postureScore += 1;
      pushTriggered(triggered, "runoff_flow_disruption", true);
    }
  } else if (precipLabel) {
    pushTriggered(triggered, "precipitation_disruption", true);
    if (precipLabel === "active_disruption") {
      postureScore -= 2;
      paceShift = -1;
      pushNote(
        notes,
        "Active precipitation disruption narrows the clean bite window.",
      );
    } else if (precipLabel === "recent_rain") {
      postureScore -= 1;
      if (clarity !== "clear") presenceShift = 1;
    }
  }

  if (clarity === "dirty") {
    presenceShift = 1;
    pushNote(notes, "Dirty water demands more visibility.");
  } else if (clarity === "clear" && presenceShift === 0) {
    presenceShift = -1;
  }

  const postureBand = resolvePostureBand(postureScore);
  const reactionWindow = resolveReactionWindow(postureBand, lightLabel, pressureLabel);
  const surfaceWindow = resolveSurfaceWindow(
    lightLabel,
    windLabel,
    postureBand,
    runoffLabel,
  );
  const opportunityMix = resolveOpportunityMix(postureBand, reactionWindow);

  return {
    normalized_states: {
      temperature_metabolic_context: analysis.condition_context.temperature_metabolic_context,
      temperature_trend: analysis.condition_context.temperature_trend,
      temperature_shock: analysis.condition_context.temperature_shock,
      pressure_regime: pressureLabel,
      wind_condition: windLabel,
      light_cloud_condition: lightLabel,
      precipitation_disruption: precipLabel,
      runoff_flow_disruption: runoffLabel,
    },
    posture_band: postureBand,
    reaction_window: reactionWindow,
    surface_window: surfaceWindow,
    opportunity_mix: opportunityMix,
    column_shift: columnShift,
    pace_shift: paceShift,
    presence_shift: presenceShift,
    surface_allowed_today: surfaceWindow !== "closed",
    suppress_true_surface: surfaceWindow === "closed",
    suppress_fast_presentations:
      postureBand === "suppressed" || postureBand === "slightly_suppressed",
    high_visibility_needed: clarity === "dirty" || presenceShift === 1,
    variables_considered: V3_SCORED_VARIABLE_KEYS_BY_CONTEXT[context],
    variables_triggered: triggered,
    notes,
  };
}
