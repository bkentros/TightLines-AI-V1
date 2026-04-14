import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderV3Context } from "./contracts.ts";
import {
  type DailyPaceBiasV3,
  type DailyReactionWindowV3,
  type DailySurfaceWindowV3,
  type PresentationStyleV3,
  type RecommenderV3DailyPayload,
  V3_SCORED_VARIABLE_KEYS_BY_CONTEXT,
} from "./contracts.ts";

type TriggerKey =
  | "temperature_metabolic_context"
  | "temperature_trend"
  | "temperature_shock"
  | "pressure_regime"
  | "wind_condition"
  | "light_cloud_condition"
  | "precipitation_disruption"
  | "runoff_flow_disruption";

type PostureContribution = {
  posture: number;
  note?: string;
};

type PresenceContribution = {
  subtle: number;
  balanced: number;
  bold: number;
  note?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round1(value: number): number {
  return Number(value.toFixed(1));
}

function pushUnique(list: string[], note: string | undefined) {
  if (!note) return;
  if (!list.includes(note)) list.push(note);
}

function markTriggered(list: TriggerKey[], key: TriggerKey, touched: boolean) {
  if (!touched) return;
  if (!list.includes(key)) list.push(key);
}

function normalizeLightLabel(label: string | null): string | null {
  if (label === "mixed_sky") return "mixed";
  return label;
}

const LAKE_POSTURE_WEIGHTS = {
  temperature: 3.5,
  pressure: 2.0,
  wind: 2.0,
  light: 1.5,
  disruption: 1.0,
} as const;

const RIVER_POSTURE_WEIGHTS = {
  temperature: 3.0,
  runoff: 3.0,
  light: 1.5,
  pressure: 1.5,
  wind: 1.0,
} as const;

const TEMPERATURE_METABOLIC_POSTURE: Record<string, PostureContribution> = {
  cold_limited: {
    posture: -0.9,
    note: "Cold-limited metabolism suppresses fish posture and tightens the bite lane.",
  },
  heat_limited: {
    posture: -0.8,
    note: "Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.",
  },
  neutral: {
    posture: 0.15,
    note: "Neutral temperature metabolism keeps the day open to the normal seasonal pattern.",
  },
};

const TEMPERATURE_TREND_POSTURE: Record<string, PostureContribution> = {
  warming: {
    posture: 0.45,
    note: "A warming trend nudges fish into a slightly more willing posture.",
  },
  stable: {
    posture: 0,
  },
  cooling: {
    posture: -0.45,
    note: "A cooling trend tightens fish and reduces daily willingness.",
  },
};

const TEMPERATURE_SHOCK_POSTURE: Record<string, PostureContribution> = {
  none: { posture: 0 },
  sharp_warmup: {
    posture: 0.2,
    note: "A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.",
  },
  sharp_cooldown: {
    posture: -0.65,
    note: "A sharp cooldown suppresses fish posture and lowers confidence in upward movement.",
  },
};

const PRESSURE_POSTURE: Record<string, PostureContribution> = {
  falling_slow: {
    posture: 0.45,
    note: "Slowly falling pressure supports a stronger feeding posture.",
  },
  falling_moderate: {
    posture: 0.55,
    note: "Moderately falling pressure supports an aggressive pre-front posture.",
  },
  falling_hard: {
    posture: -0.1,
    note: "Hard-falling pressure can create a short burst, but it is too unstable to treat as clean aggression.",
  },
  rising_slow: {
    posture: -0.2,
    note: "Slowly rising pressure leans fish back toward a more selective posture.",
  },
  rising_fast: {
    posture: -0.55,
    note: "Fast-rising pressure suppresses fish posture after the front.",
  },
  volatile: {
    posture: -0.75,
    note: "Volatile pressure suppresses posture and makes the day less stable.",
  },
  stable_neutral: {
    posture: 0,
  },
  recently_stabilizing: {
    posture: 0.1,
    note: "Recently stabilizing pressure keeps the day fishable without forcing aggression.",
  },
};

const WIND_POSTURE_LAKE: Record<string, PostureContribution> = {
  calm: { posture: -0.1 },
  light: { posture: 0.05 },
  moderate: {
    posture: 0.35,
    note: "Moderate chop supports a slightly more open lake posture.",
  },
  strong: {
    posture: -0.2,
    note: "Strong wind adds instability even if it can still help visibility and presence.",
  },
  extreme: {
    posture: -0.65,
    note: "Extreme wind suppresses fish posture and limits clean execution.",
  },
};

const WIND_POSTURE_RIVER: Record<string, PostureContribution> = {
  calm: { posture: 0 },
  light: { posture: 0.05 },
  moderate: { posture: 0 },
  strong: {
    posture: -0.35,
    note: "Strong river wind hurts comfort without creating a true feeding advantage.",
  },
  extreme: {
    posture: -0.7,
    note: "Extreme river wind suppresses posture and tightens the daily lane.",
  },
};

const LIGHT_POSTURE: Record<string, PostureContribution> = {
  glare: {
    posture: -0.35,
    note: "Hard glare keeps fish more cautious and selective.",
  },
  bright: {
    posture: -0.2,
    note: "Bright light trims daily willingness without fully shutting the day down.",
  },
  mixed: { posture: 0 },
  low_light: {
    posture: 0.35,
    note: "Low light opens the daily posture and supports more willingness.",
  },
  heavy_overcast: {
    posture: 0.45,
    note: "Heavy overcast supports a more open feeding posture.",
  },
};

const PRECIP_POSTURE: Record<string, PostureContribution> = {
  active_disruption: {
    posture: -0.85,
    note: "Active rain disruption suppresses fish posture and shrinks the clean bite lane.",
  },
  recent_rain: {
    posture: -0.35,
    note: "Recent rain keeps the lake bite a little more controlled and selective.",
  },
  light_mist: { posture: 0 },
  extended_dry: { posture: 0.15 },
  dry_stable: { posture: 0.1 },
};

const RUNOFF_POSTURE: Record<string, PostureContribution> = {
  perfect_clear: {
    posture: 0.35,
    note: "Perfect-clear river flow supports a stable seasonal bite posture.",
  },
  stable: {
    posture: 0.25,
    note: "Stable river flow supports a reliable seasonal posture.",
  },
  slightly_elevated: {
    posture: 0.05,
    note: "Slightly elevated flow can still fish well, but it changes where fish set up.",
  },
  elevated: {
    posture: -0.45,
    note: "Elevated flow suppresses posture and tightens fish to safer holding lanes.",
  },
  blown_out: {
    posture: -0.95,
    note: "Blown-out flow strongly suppresses posture and collapses the clean bite lane.",
  },
};

const CLARITY_PRESENCE: Record<string, PresenceContribution> = {
  clear: {
    subtle: 1.0,
    balanced: 0.45,
    bold: -0.7,
    note: "Clear water favors a cleaner, subtler presentation.",
  },
  stained: {
    subtle: 0,
    balanced: 0.7,
    bold: 0.35,
    note: "Stained water supports a balanced presentation with some extra presence.",
  },
  dirty: {
    subtle: -0.75,
    balanced: 0.35,
    bold: 1.05,
    note: "Dirty water calls for more visibility and presence.",
  },
};

const LIGHT_PRESENCE: Record<string, PresenceContribution> = {
  glare: {
    subtle: 0.9,
    balanced: 0.2,
    bold: -0.75,
    note: "Glare favors a subtler look.",
  },
  bright: {
    subtle: 0.7,
    balanced: 0.25,
    bold: -0.55,
    note: "Bright conditions favor restraint more than added commotion.",
  },
  mixed: {
    subtle: 0.15,
    balanced: 0.4,
    bold: 0.05,
  },
  low_light: {
    subtle: -0.2,
    balanced: 0.45,
    bold: 0.8,
    note: "Low light supports extra visibility and a bolder look.",
  },
  heavy_overcast: {
    subtle: -0.3,
    balanced: 0.35,
    bold: 0.9,
    note: "Heavy overcast supports a bolder profile and more visible presentation.",
  },
};

const WIND_PRESENCE_LAKE: Record<string, PresenceContribution> = {
  calm: {
    subtle: 0.7,
    balanced: 0.2,
    bold: -0.55,
    note: "Calm lake conditions reward a clean, subtle presentation.",
  },
  light: {
    subtle: 0.45,
    balanced: 0.35,
    bold: -0.15,
  },
  moderate: {
    subtle: -0.1,
    balanced: 0.45,
    bold: 0.75,
    note: "Moderate chop supports more presence and movement.",
  },
  strong: {
    subtle: -0.25,
    balanced: 0.35,
    bold: 0.95,
    note: "Strong wind often calls for added presence, even if posture is not fully aggressive.",
  },
  extreme: {
    subtle: -0.4,
    balanced: 0.2,
    bold: 1.0,
    note: "Extreme wind demands visibility and feel if the day is still fishable.",
  },
};

const WIND_PRESENCE_RIVER: Record<string, PresenceContribution> = {
  calm: {
    subtle: 0.5,
    balanced: 0.3,
    bold: -0.25,
  },
  light: {
    subtle: 0.35,
    balanced: 0.35,
    bold: -0.1,
  },
  moderate: {
    subtle: 0,
    balanced: 0.45,
    bold: 0.35,
  },
  strong: {
    subtle: -0.15,
    balanced: 0.35,
    bold: 0.55,
  },
  extreme: {
    subtle: -0.2,
    balanced: 0.25,
    bold: 0.65,
  },
};

const RUNOFF_PRESENCE: Record<string, PresenceContribution> = {
  perfect_clear: {
    subtle: 0.35,
    balanced: 0.35,
    bold: -0.1,
  },
  stable: {
    subtle: 0.2,
    balanced: 0.4,
    bold: 0,
  },
  slightly_elevated: {
    subtle: -0.15,
    balanced: 0.45,
    bold: 0.6,
    note: "Slightly elevated flow asks for some extra visibility and push.",
  },
  elevated: {
    subtle: -0.5,
    balanced: 0.2,
    bold: 1.0,
    note: "Elevated flow calls for more visible, assertive presentations.",
  },
  blown_out: {
    subtle: -0.8,
    balanced: 0.05,
    bold: 1.2,
    note: "Blown-out flow demands maximum presence if the river is still at all fishable.",
  },
};

const PRECIP_PRESENCE: Record<string, PresenceContribution> = {
  active_disruption: {
    subtle: 0.05,
    balanced: 0.45,
    bold: 0.55,
  },
  recent_rain: {
    subtle: 0,
    balanced: 0.45,
    bold: 0.3,
  },
  light_mist: {
    subtle: 0.15,
    balanced: 0.35,
    bold: 0,
  },
  extended_dry: {
    subtle: 0.2,
    balanced: 0.35,
    bold: -0.1,
  },
  dry_stable: {
    subtle: 0.1,
    balanced: 0.4,
    bold: 0,
  },
};

function getPostureContribution(
  table: Record<string, PostureContribution>,
  label: string | null,
): PostureContribution {
  if (!label) return { posture: 0 };
  return table[label] ?? { posture: 0 };
}

function addPresenceScores(
  totals: Record<PresentationStyleV3, number>,
  contribution: PresenceContribution,
) {
  totals.subtle += contribution.subtle;
  totals.balanced += contribution.balanced;
  totals.bold += contribution.bold;
}

function resolvePresentationPresence(
  totals: Record<PresentationStyleV3, number>,
): PresentationStyleV3 {
  const sorted = (Object.entries(totals) as Array<
    [PresentationStyleV3, number]
  >).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "balanced";
}

function resolvePostureBand(score10: number): RecommenderV3DailyPayload["posture_band"] {
  if (score10 <= 2.4) return "suppressed";
  if (score10 <= 4.4) return "slightly_suppressed";
  if (score10 <= 6.4) return "neutral";
  if (score10 <= 8.1) return "slightly_aggressive";
  return "aggressive";
}

function resolveColumnShiftBias(
  postureBand: RecommenderV3DailyPayload["posture_band"],
): RecommenderV3DailyPayload["column_shift_bias_half_steps"] {
  switch (postureBand) {
    case "aggressive":
      return -2;
    case "slightly_aggressive":
      return -1;
    case "neutral":
      return 0;
    case "slightly_suppressed":
      return 1;
    case "suppressed":
      return 2;
  }
}

function surfaceAllowedToday(
  context: RecommenderV3Context,
  lightLabel: string | null,
  windLabel: string | null,
  postureBand: RecommenderV3DailyPayload["posture_band"],
): boolean {
  if (postureBand === "suppressed") return false;
  if (lightLabel === "bright" || lightLabel === "glare") return false;
  if (context === "freshwater_river" && windLabel === "extreme") return false;
  if (context === "freshwater_lake_pond" && windLabel === "extreme") return false;
  return true;
}

function resolveSurfaceWindowToday(
  context: RecommenderV3Context,
  lightLabel: string | null,
  windLabel: string | null,
  postureBand: RecommenderV3DailyPayload["posture_band"],
  runoffLabel: string | null,
): DailySurfaceWindowV3 {
  if (!surfaceAllowedToday(context, lightLabel, windLabel, postureBand)) return "closed";
  if (context === "freshwater_river" && runoffLabel === "blown_out") return "closed";
  if (windLabel === "strong" || windLabel === "extreme") return "closed";
  if (lightLabel === "heavy_overcast") return "rippled";
  if (lightLabel === "mixed" && context === "freshwater_river") return "rippled";
  return windLabel === "moderate" ? "rippled" : "clean";
}

function suppressTrueTopwater(
  surfaceWindow: DailySurfaceWindowV3,
): boolean {
  return surfaceWindow === "closed";
}

function maxUpwardColumnShift(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  postureBand: RecommenderV3DailyPayload["posture_band"],
  lightLabel: string | null,
): 0 | 1 | 2 {
  const metabolic = analysis.condition_context.temperature_metabolic_context;
  const shock = analysis.condition_context.temperature_shock;
  if (metabolic === "cold_limited" || shock === "sharp_cooldown") return 0;
  if (postureBand === "aggressive") return 2;
  if (postureBand === "slightly_aggressive") {
    if (context === "freshwater_river" && lightLabel === "mixed") return 0;
    return 1;
  }
  return 0;
}

function maxDownwardColumnShift(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  postureBand: RecommenderV3DailyPayload["posture_band"],
  runoffLabel: string | null,
): 0 | 1 | 2 {
  if (context === "freshwater_river" && runoffLabel === "blown_out") return 2;
  if (postureBand === "suppressed") return 2;
  if (
    postureBand === "slightly_suppressed" ||
    analysis.condition_context.temperature_metabolic_context === "heat_limited" ||
    analysis.condition_context.temperature_metabolic_context === "cold_limited"
  ) {
    return 1;
  }
  return 0;
}

function stableHydroWindow(
  context: RecommenderV3Context,
  precipLabel: string | null,
  runoffLabel: string | null,
): boolean {
  if (context === "freshwater_lake_pond") {
    return precipLabel !== "active_disruption";
  }
  return runoffLabel === null || runoffLabel === "perfect_clear" ||
    runoffLabel === "stable" || runoffLabel === "slightly_elevated";
}

function favorableReactionStack(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  pressureLabel: string | null,
  windLabel: string | null,
  lightLabel: string | null,
  precipLabel: string | null,
  runoffLabel: string | null,
): boolean {
  const warming = analysis.condition_context.temperature_trend === "warming" &&
    analysis.condition_context.temperature_shock !== "sharp_cooldown" &&
    analysis.condition_context.temperature_metabolic_context !== "cold_limited";
  const fallingPressure = pressureLabel === "falling_slow" ||
    pressureLabel === "falling_moderate";
  const fishableWind = windLabel !== "strong" && windLabel !== "extreme";
  const supportiveLight = lightLabel === "low_light" ||
    lightLabel === "heavy_overcast" || lightLabel === "mixed";
  return warming && fallingPressure && fishableWind && supportiveLight &&
    stableHydroWindow(context, precipLabel, runoffLabel);
}

function reactionOpportunityBonus(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  pressureLabel: string | null,
  windLabel: string | null,
  lightLabel: string | null,
  precipLabel: string | null,
  runoffLabel: string | null,
): number {
  if (!favorableReactionStack(
    analysis,
    context,
    pressureLabel,
    windLabel,
    lightLabel,
    precipLabel,
    runoffLabel,
  )) {
    return 0;
  }

  if (context === "freshwater_river") return 0.8;
  if (lightLabel === "low_light" && windLabel === "moderate") return 0.35;
  return 0.2;
}

function resolveReactionWindowToday(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  postureBand: RecommenderV3DailyPayload["posture_band"],
  pressureLabel: string | null,
  windLabel: string | null,
  lightLabel: string | null,
  precipLabel: string | null,
  runoffLabel: string | null,
): DailyReactionWindowV3 {
  if (postureBand === "suppressed" || postureBand === "slightly_suppressed") {
    return "off";
  }
  if (postureBand === "aggressive" || postureBand === "slightly_aggressive") {
    return "on";
  }
  if (favorableReactionStack(
    analysis,
    context,
    pressureLabel,
    windLabel,
    lightLabel,
    precipLabel,
    runoffLabel,
  )) {
    return "on";
  }
  if (
    analysis.condition_context.temperature_trend === "warming" ||
    pressureLabel === "falling_slow" ||
    pressureLabel === "falling_moderate"
  ) {
    return "watch";
  }
  return "watch";
}

function resolvePaceBiasToday(
  context: RecommenderV3Context,
  postureBand: RecommenderV3DailyPayload["posture_band"],
  reactionWindow: DailyReactionWindowV3,
  lightLabel: string | null,
  windLabel: string | null,
): DailyPaceBiasV3 {
  if (postureBand === "suppressed" || postureBand === "slightly_suppressed") {
    return "slow";
  }
  if (
    reactionWindow === "on" &&
    (
      postureBand === "aggressive" ||
      lightLabel === "low_light" ||
      windLabel === "moderate" ||
      context === "freshwater_river"
    )
  ) {
    return "fast";
  }
  return "neutral";
}

/**
 * Deterministic daily handoff:
 * - one posture score and posture band
 * - one presentation-presence result
 * - one bounded column-shift bias
 * - explicit guardrails
 */
export function resolveDailyPayloadV3(
  analysis: SharedConditionAnalysis,
  context: RecommenderV3Context,
  clarity: "clear" | "stained" | "dirty",
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

  const notes: string[] = [];
  const triggered: TriggerKey[] = [];
  const presenceTotals: Record<PresentationStyleV3, number> = {
    subtle: 0,
    balanced: 0,
    bold: 0,
  };

  const metabolic = getPostureContribution(
    TEMPERATURE_METABOLIC_POSTURE,
    analysis.condition_context.temperature_metabolic_context,
  );
  const trend = getPostureContribution(
    TEMPERATURE_TREND_POSTURE,
    analysis.condition_context.temperature_trend,
  );
  const shock = getPostureContribution(
    TEMPERATURE_SHOCK_POSTURE,
    analysis.condition_context.temperature_shock,
  );
  const pressure = getPostureContribution(PRESSURE_POSTURE, pressureLabel);
  const wind = getPostureContribution(
    context === "freshwater_lake_pond" ? WIND_POSTURE_LAKE : WIND_POSTURE_RIVER,
    windLabel,
  );
  const light = getPostureContribution(LIGHT_POSTURE, lightLabel);
  const disruption = getPostureContribution(
    context === "freshwater_lake_pond" ? PRECIP_POSTURE : RUNOFF_POSTURE,
    context === "freshwater_lake_pond" ? precipLabel : runoffLabel,
  );

  const rawPosture = context === "freshwater_lake_pond"
    ? (
      metabolic.posture * LAKE_POSTURE_WEIGHTS.temperature +
      trend.posture * 0.75 +
      shock.posture * 0.75 +
      pressure.posture * LAKE_POSTURE_WEIGHTS.pressure +
      wind.posture * LAKE_POSTURE_WEIGHTS.wind +
      light.posture * LAKE_POSTURE_WEIGHTS.light +
      disruption.posture * LAKE_POSTURE_WEIGHTS.disruption
    )
    : (
      metabolic.posture * RIVER_POSTURE_WEIGHTS.temperature +
      trend.posture * 0.6 +
      shock.posture * 0.8 +
      pressure.posture * RIVER_POSTURE_WEIGHTS.pressure +
      wind.posture * RIVER_POSTURE_WEIGHTS.wind +
      light.posture * RIVER_POSTURE_WEIGHTS.light +
      disruption.posture * RIVER_POSTURE_WEIGHTS.runoff
    );

  const postureOpportunityBonus = reactionOpportunityBonus(
    analysis,
    context,
    pressureLabel,
    windLabel,
    lightLabel,
    precipLabel,
    runoffLabel,
  );
  const postureScore10 = round1(clamp(5 + rawPosture + postureOpportunityBonus, 0, 10));
  const postureBand = resolvePostureBand(postureScore10);

  addPresenceScores(presenceTotals, CLARITY_PRESENCE[clarity]);
  addPresenceScores(presenceTotals, LIGHT_PRESENCE[lightLabel ?? "mixed"] ?? LIGHT_PRESENCE.mixed);
  addPresenceScores(
    presenceTotals,
    (context === "freshwater_lake_pond"
      ? WIND_PRESENCE_LAKE[windLabel ?? "light"]
      : WIND_PRESENCE_RIVER[windLabel ?? "light"]) ??
      (context === "freshwater_lake_pond"
        ? WIND_PRESENCE_LAKE.light
        : WIND_PRESENCE_RIVER.light),
  );
  if (context === "freshwater_river") {
    addPresenceScores(
      presenceTotals,
      RUNOFF_PRESENCE[runoffLabel ?? "stable"] ?? RUNOFF_PRESENCE.stable,
    );
  } else {
    addPresenceScores(
      presenceTotals,
      PRECIP_PRESENCE[precipLabel ?? "dry_stable"] ?? PRECIP_PRESENCE.dry_stable,
    );
  }

  if (postureBand === "suppressed") presenceTotals.subtle += 0.5;
  if (postureBand === "slightly_suppressed") presenceTotals.subtle += 0.25;
  if (postureBand === "slightly_aggressive") presenceTotals.bold += 0.25;
  if (postureBand === "aggressive") presenceTotals.bold += 0.45;

  const presentationPresenceToday = resolvePresentationPresence(presenceTotals);
  const reactionWindow = resolveReactionWindowToday(
    analysis,
    context,
    postureBand,
    pressureLabel,
    windLabel,
    lightLabel,
    precipLabel,
    runoffLabel,
  );
  const paceBiasToday = resolvePaceBiasToday(
    context,
    postureBand,
    reactionWindow,
    lightLabel,
    windLabel,
  );
  const columnShiftBias = resolveColumnShiftBias(postureBand);
  const surfaceAllowed = surfaceAllowedToday(
    context,
    lightLabel,
    windLabel,
    postureBand,
  );
  const surfaceWindow = resolveSurfaceWindowToday(
    context,
    lightLabel,
    windLabel,
    postureBand,
    runoffLabel,
  );
  const suppressTopwater = suppressTrueTopwater(
    surfaceWindow,
  );
  const upwardCap = maxUpwardColumnShift(
    analysis,
    context,
    postureBand,
    lightLabel,
  );
  const downwardCap = maxDownwardColumnShift(
    analysis,
    context,
    postureBand,
    runoffLabel,
  );
  const suppressFast = paceBiasToday === "slow";
  const highVisibilityNeeded = presentationPresenceToday === "bold";

  pushUnique(notes, metabolic.note);
  pushUnique(notes, trend.note);
  pushUnique(notes, shock.note);
  pushUnique(notes, pressure.note);
  pushUnique(notes, wind.note);
  pushUnique(notes, light.note);
  pushUnique(notes, disruption.note);
  pushUnique(notes, CLARITY_PRESENCE[clarity].note);

  markTriggered(
    triggered,
    "temperature_metabolic_context",
    metabolic.posture !== 0,
  );
  markTriggered(
    triggered,
    "temperature_trend",
    trend.posture !== 0,
  );
  markTriggered(
    triggered,
    "temperature_shock",
    shock.posture !== 0,
  );
  markTriggered(
    triggered,
    "pressure_regime",
    pressure.posture !== 0,
  );
  markTriggered(
    triggered,
    "wind_condition",
    wind.posture !== 0 || windLabel != null,
  );
  markTriggered(
    triggered,
    "light_cloud_condition",
    light.posture !== 0 || lightLabel != null,
  );
  if (context === "freshwater_lake_pond") {
    markTriggered(
      triggered,
      "precipitation_disruption",
      precipLabel != null,
    );
  } else {
    markTriggered(
      triggered,
      "runoff_flow_disruption",
      runoffLabel != null,
    );
  }

  return {
    posture_score_10: postureScore10,
    posture_band: postureBand,
    presentation_presence_today: presentationPresenceToday,
    reaction_window_today: reactionWindow,
    pace_bias_today: paceBiasToday,
    column_shift_bias_half_steps: columnShiftBias,
    max_upward_column_shift_today: upwardCap,
    max_downward_column_shift_today: downwardCap,
    surface_allowed_today: surfaceAllowed,
    suppress_true_topwater: suppressTopwater,
    surface_window_today: surfaceWindow,
    suppress_fast_presentations: suppressFast,
    high_visibility_needed_today: highVisibilityNeeded,
    variables_considered: V3_SCORED_VARIABLE_KEYS_BY_CONTEXT[context],
    variables_triggered: triggered,
    notes,
  };
}
