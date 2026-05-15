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
  "Let moving water set the schedule. Start near the first clean current edge or tide turn, then reset when movement fades.",
  "Use tide or current as the clock today. Give the strongest moving-water window the first look, then simplify during slack periods.",
  "Start where movement gathers food: current breaks, points, drains, or places where fast and slow water meet.",
  "Let water movement choose your order. Pick one high-confidence area for the moving window instead of spreading effort evenly.",
  "Plan around the cleanest movement. Fish the area with the best current or tide cue first, then compare similar water nearby.",
  "Stay close to the movement that is easiest to read. If it slows down, reset and wait for the next useful change.",
] as const;

const CONTROL_STRATEGY = [
  "Keep the plan compact. Choose water you can control cleanly, then make deliberate moves instead of chasing every option.",
  "Let wind narrow the map for you. Start with protected water, readable banks, or cleaner angles before testing exposed areas.",
  "Control matters today. Pick fewer spots, fish them carefully, and leave the rougher wind angles as backup water.",
  "Use wind as a filter. If boat or bank position feels messy, move to water you can read more clearly.",
  "Start where you can keep the approach clean. Readable water matters more today than covering every available option.",
  "Use the most manageable wind angle first. If an area feels difficult to read, move to a calmer or more organized section.",
  "Keep decisions practical. Protected water, cleaner approaches, and steady positioning should come before exposed options.",
] as const;

const VISIBILITY_STRATEGY = [
  "Use visibility as the first filter. Start where fish can locate food easily: edges, lanes, inflows, or cleaner pockets.",
  "Keep the plan simple when visibility is changing. Pick obvious travel lanes and high-percentage edges before subtle water.",
  "Prioritize water with a clear reason for fish to be there. If one area looks confused or dirty, move to the cleaner option.",
  "Keep the route organized. In a visibility-driven read, choose easy-to-read water and make each stop intentional.",
  "Start with water that gives fish a simple path to feed. Cleaner pockets, inflows, edges, and lanes are easier to interpret.",
  "Make visibility decide the first move. If the water looks inconsistent, choose the area with the cleanest read.",
  "Favor water where the conditions make sense together. Clarity, cover, and food movement should point to the same area.",
] as const;

const PATIENT_STRATEGY = [
  "Use a patient plan. Pick your best window, start with the most reliable water, and avoid changing areas too quickly.",
  "Expect fewer obvious clues. Give high-confidence water enough time before deciding the read is wrong.",
  "Make the day smaller. Choose one best window and one backup area, then stay organized instead of reacting to every slow stretch.",
  "Patience is the advantage today. Give the best part of the read the first look, then adjust from clear local evidence.",
  "Stay measured early. Start with dependable water, give it a fair look, and move only when the signs point elsewhere.",
  "Use fewer decisions, not more. Let the strongest window and most reliable water carry the first part of the plan.",
  "Keep expectations realistic. A slower start does not automatically mean the read is wrong, especially on a narrow day.",
] as const;

const ACTIVE_STRATEGY = [
  "You can fish with more intent today. Start on your best water during the strongest window and move if the first signs support it.",
  "Use the strongest window deliberately. Begin with high-percentage water, then rotate to similar areas if the read holds up.",
  "The read supports a proactive plan. Put the most attention into the strongest window instead of saving it for later.",
  "Start with your highest-confidence water. If the first area gives you signs, expand the plan; if not, narrow back down.",
  "Let the helpful conditions guide the first move. Start where the read is strongest, then build only from what you observe.",
  "Use the better window with purpose. Choose the first area before you start, then compare similar water if it produces signs.",
] as const;

const DATA_STRATEGY = [
  "Treat this as a directional read. Start with the strongest available signal, then let local water conditions confirm or challenge it.",
  "Use the report as a starting map, not a script. Make one clear first choice and be ready to adjust from what you see.",
  "Keep the first plan simple because the data is thinner. Pick dependable water first, then refine from local signs.",
  "The read still gives direction, but stay flexible. If the water tells a different story, adjust from local evidence quickly.",
  "Leave room for local truth today. Choose one clear starting area, then refine the plan as the conditions show themselves.",
  "Use the available signals without overfitting them. Start simple, watch the water closely, and make one adjustment at a time.",
  "Keep the plan easy to update. With fewer inputs, the first choice matters less than how cleanly you adjust from it.",
] as const;

const GENERAL_STRATEGY = [
  "Start with the strongest window and your most reliable water. Keep one backup plan ready, but do not overcomplicate the day.",
  "Use the report to set priorities: best window first, best water first, then adjust only from clear local evidence.",
  "Make one clean plan before you start. Choose the main window, choose the first area, and give it a fair chance.",
  "Let the strongest condition set the order of operations. Timing and water choice matter more than adding extra guesses.",
  "Start with the cleanest overlap of timing and water choice. Give that plan a fair look before making a larger change.",
  "Choose the first move before you arrive. A clear starting area and one backup option can keep the day easier to read.",
  "Use the conditions to rank your options. Strongest window first, most reliable water first, then adjust from what you see.",
] as const;

export function listTipCopyForAudit(): string[] {
  return [
    ...MOVEMENT_STRATEGY,
    ...CONTROL_STRATEGY,
    ...VISIBILITY_STRATEGY,
    ...PATIENT_STRATEGY,
    ...ACTIVE_STRATEGY,
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
    actionable_tip = pick(PATIENT_STRATEGY, seed, "temperature_patient");
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
