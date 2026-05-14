import type {
  ActionableTipTag,
  EngineContext,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { pickDeterministic } from "../copy/deterministicPick.ts";
import type { ActiveVariableScore } from "../score/types.ts";

/**
 * Field strategy result.
 *
 * Kept on the legacy `actionable_tip` wire field for compatibility, but the
 * copy now explains how to use the condition read. Tackle Box owns tackle
 * specifics.
 */
export type EngineActionableTipBundle = {
  actionable_tip: string;
  actionable_tip_tag: ActionableTipTag;
};

function pick<T>(arr: readonly T[], seed: string, salt: string): T {
  return pickDeterministic(arr, seed, `strategy:${salt}`);
}

function normalizeTipText(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
  if (!clean) return "";
  const withCapital = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

const MOVEMENT_STRATEGY = [
  "Let water movement set the plan today; be ready during the moving-water windows and stay selective outside them.",
  "Use the moving-water windows as the main clock today, then tighten up when the water slows.",
  "The best plan is to work around the water movement first and treat everything else as secondary.",
  "When the water starts moving, be ready. The quieter stretches deserve a more selective approach.",
] as const;

const CONTROL_STRATEGY = [
  "Keep the plan compact today. Wind makes scattered searching less efficient than controlled, repeatable choices.",
  "Wind is the condition to respect. Pick water you can read cleanly and avoid forcing low-percentage areas.",
  "Make fewer, cleaner decisions today; wind will punish a loose plan faster than usual.",
  "Use protected water or cleaner angles when you can. The day rewards control more than wandering.",
] as const;

const VISIBILITY_STRATEGY = [
  "Visibility is the thing to manage today, so favor water where fish can find and commit without extra guesswork.",
  "Treat visibility as the main filter. Cleaner lanes and obvious ambush spots should get priority.",
  "Do not spread out too much when visibility is limited. Stay with water that gives fish a clear reason to feed.",
  "The read says to simplify your water choices around visibility first, then adjust only if the window opens.",
] as const;

const PATIENT_STRATEGY = [
  "This is a patience-first read. Give the best areas time before assuming the day has no bite.",
  "Expect shorter windows and fewer easy clues. Stay precise and avoid chasing every small change.",
  "The cleaner move is to slow the decision-making down and make the best window count.",
  "This setup rewards discipline. Pick the best window, stay organized, and do not overreact early.",
] as const;

const ACTIVE_STRATEGY = [
  "The read supports a more assertive plan during the best window, especially if the first signs confirm it.",
  "You can be more proactive today, but keep the plan tied to the strongest condition window.",
  "Start with the highest-percentage water and move when the read gives you a reason, not just from impatience.",
  "Conditions give you room to be proactive. Use the best window first, then adjust with purpose.",
] as const;

const HEAT_STRATEGY = [
  "Be strict with timing today. Low-light and cooler windows matter more than grinding through the warmest stretch.",
  "Heat makes the middle of the day less forgiving. Use the cooler windows and avoid forcing the slow stretch.",
  "The safest plan is to front-load the day and return when the heat loosens its grip.",
  "Treat heat as the main constraint: fish the comfortable windows and keep expectations lower outside them.",
] as const;

const COLD_STRATEGY = [
  "Let the day warm before judging it. Cold starts can look worse than the better window later on.",
  "The warmest part of the day deserves the most attention; early cold may not tell the full story.",
  "Stay patient through the cold start and make the better warmth window count.",
  "Cold is setting the pace today, so use the warmest window instead of forcing the earliest one.",
] as const;

const DATA_STRATEGY = [
  "Treat this as a directional read. Key inputs are thinner than usual, so leave room to adjust on the water.",
  "Use the main signal, but do not over-trust fine detail today. The read is broader than normal.",
  "The day still has a useful direction, but local signs should have more influence because data is limited.",
  "Keep the plan flexible today. The condition read is helpful, just not as precise as a full-data day.",
] as const;

const GENERAL_STRATEGY = [
  "Use the strongest window first and keep the rest of the day flexible.",
  "Pick the best condition window, commit to it, and adjust only when the water gives a clear reason.",
  "The best plan is simple: respect the main limiter and do not let weaker signals distract you.",
  "Let the condition read set priorities today; timing and water choice matter more than extra guessing.",
] as const;

export function listTipCopyForAudit(): string[] {
  return [
    ...MOVEMENT_STRATEGY,
    ...CONTROL_STRATEGY,
    ...VISIBILITY_STRATEGY,
    ...PATIENT_STRATEGY,
    ...ACTIVE_STRATEGY,
    ...HEAT_STRATEGY,
    ...COLD_STRATEGY,
    ...DATA_STRATEGY,
    ...GENERAL_STRATEGY,
  ];
}

export function buildActionableTip(
  context: EngineContext,
  topDriver: ActiveVariableScore | undefined,
  topSuppressor: ActiveVariableScore | undefined,
  norm: SharedNormalizedOutput["normalized"],
  seed: string,
): EngineActionableTipBundle {
  let actionable_tip: string = pick(GENERAL_STRATEGY, seed, "general");
  let actionable_tip_tag: ActionableTipTag = "strategy_field_plan";

  const tempBand = norm.temperature?.band_label ?? null;
  const tempScore = norm.temperature?.final_score ?? null;
  const pressureLabel = norm.pressure_regime?.label ?? null;

  if (topSuppressor?.key === "wind_condition") {
    actionable_tip = pick(CONTROL_STRATEGY, seed, "wind_control");
    actionable_tip_tag = "strategy_control";
  } else if (
    topSuppressor?.key === "precipitation_disruption" ||
    topSuppressor?.key === "runoff_flow_disruption"
  ) {
    actionable_tip = pick(VISIBILITY_STRATEGY, seed, "visibility");
    actionable_tip_tag = "strategy_visibility";
  } else if (topSuppressor?.key === "light_cloud_condition") {
    actionable_tip = pick(PATIENT_STRATEGY, seed, "light_patient");
    actionable_tip_tag = "strategy_patient_plan";
  } else if (topSuppressor?.key === "pressure_regime") {
    actionable_tip = pick(PATIENT_STRATEGY, seed, "pressure_patient");
    actionable_tip_tag = "strategy_patient_plan";
  } else if (topSuppressor?.key === "temperature_condition") {
    if (tempBand === "very_warm" || tempBand === "warm") {
      actionable_tip = pick(HEAT_STRATEGY, seed, "heat");
    } else if (tempBand === "near_optimal") {
      actionable_tip = pick(PATIENT_STRATEGY, seed, "temperature_edge");
    } else {
      actionable_tip = pick(COLD_STRATEGY, seed, "cold");
    }
    actionable_tip_tag = "strategy_patient_plan";
  } else if (
    isCoastalFamilyContext(context) &&
    (norm.tide_current_movement?.score ?? 0) >= 1
  ) {
    actionable_tip = pick(MOVEMENT_STRATEGY, seed, "movement");
    actionable_tip_tag = "strategy_water_movement";
  } else if (topDriver?.key === "tide_current_movement") {
    actionable_tip = pick(MOVEMENT_STRATEGY, seed, "movement_driver");
    actionable_tip_tag = "strategy_water_movement";
  } else if (topDriver?.key === "temperature_condition") {
    if (tempScore != null && tempScore < 0.9) {
      actionable_tip = pick(GENERAL_STRATEGY, seed, "temp_general");
      actionable_tip_tag = "strategy_field_plan";
    } else {
      actionable_tip = pick(ACTIVE_STRATEGY, seed, "temp_active");
      actionable_tip_tag = "strategy_push_windows";
    }
  } else if (topDriver?.key === "pressure_regime") {
    if (
      pressureLabel === "falling_slow" || pressureLabel === "falling_moderate"
    ) {
      actionable_tip = pick(ACTIVE_STRATEGY, seed, "pressure_active");
      actionable_tip_tag = "strategy_push_windows";
    } else {
      actionable_tip = pick(
        PATIENT_STRATEGY,
        seed,
        "pressure_patient_positive",
      );
      actionable_tip_tag = "strategy_patient_plan";
    }
  } else if (
    topDriver?.key === "light_cloud_condition" ||
    topDriver?.key === "wind_condition"
  ) {
    actionable_tip = pick(ACTIVE_STRATEGY, seed, "active_window");
    actionable_tip_tag = "strategy_push_windows";
  } else if (topDriver?.key === "precipitation_disruption") {
    actionable_tip = pick(GENERAL_STRATEGY, seed, "dry_general");
    actionable_tip_tag = "strategy_field_plan";
  }

  const lowInformation = Object.values(norm).filter(Boolean).length <= 3;
  if (lowInformation) {
    actionable_tip = pick(DATA_STRATEGY, seed, "data_limited");
    actionable_tip_tag = "strategy_data_limited";
  }

  return {
    actionable_tip: normalizeTipText(actionable_tip),
    actionable_tip_tag,
  };
}
