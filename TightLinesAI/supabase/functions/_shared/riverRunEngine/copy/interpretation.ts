import type {
  InterpretationNote,
  PrimitiveDisplay,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import type { ConditionsSuggestLabel } from "../scoring/conditionsSuggest.ts";

export type InterpretationInput = {
  runStage: RunStage;
  conditionsSuggestLabel: ConditionsSuggestLabel;
  push: PrimitiveDisplay;
  fishability: PrimitiveDisplay;
  fishInRiver: PrimitiveDisplay;
};

export function resolveInterpretationNote(
  input: InterpretationInput,
): InterpretationNote | undefined {
  const findings: InterpretationFinding[] = [];
  if (isHigh(input.push) && isLow(input.fishability)) {
    findings.push(finding(
      "Movement signal and river shape are pointing in different directions.",
      "Push reflects current movement-trigger conditions, while Fishability reflects primary-reach fishing shape; a supportive event can temporarily make the reach harder to fish.",
      "strong_push_low_fishability",
    ));
  }
  if (
    input.conditionsSuggestLabel === "Ahead" && input.runStage === "beginning"
  ) {
    findings.push(finding(
      "Cumulative conditions suggest earlier timing while Run Stage is Beginning.",
      "Conditions Suggest compares cumulative checkpoint evidence with history, while Run Stage remains the configured calendar position.",
      "beginning_ahead_conditions",
    ));
  }
  if (input.runStage === "peak" && isWeak(input.push)) {
    findings.push(finding(
      "Peak calendar timing and a weak current Push can occur together.",
      "Run Stage marks the configured peak window, while Push finds limited current support for a fresh entry event; peak timing does not require a new push today.",
      "peak_presence_weak_push",
    ));
  }
  if (isGood(input.fishability) && isLowPresence(input.fishInRiver)) {
    findings.push(finding(
      "River shape is favorable while seasonal presence context is low.",
      "Fishability says the primary reach is workable, while Fish In River says historical presence for this date is low; good river shape does not imply high fish numbers.",
      "good_fishability_low_presence",
    ));
  }
  if (input.conditionsSuggestLabel === "Delayed" && isHigh(input.push)) {
    findings.push(finding(
      "Current Push is strong while the locked timing checkpoint remains Delayed.",
      "Push describes the current movement-trigger event, while Conditions Suggest retains its cumulative historical checkpoint; a delayed run can still receive a supportive event now.",
      "delayed_conditions_strong_push",
    ));
  }
  if (input.runStage === "post_run" && hasResidualPresence(input.fishInRiver)) {
    findings.push(finding(
      "The main run window has ended while a limited historical tail remains.",
      "Run Stage marks the configured main window complete, while Fish In River retains the separately configured late historical-presence tail; this does not mean a fresh run is still underway.",
      "post_run_residual_presence",
    ));
  }
  if (findings.length === 0) return undefined;
  if (findings.length === 1) return note(findings[0]);
  return {
    headline:
      "Several River Run reads are describing different parts of the current picture.",
    detail: findings.map((item) => item.detail).join(" "),
    reasonCodes: findings.map((item) => item.code),
  };
}

type InterpretationFinding = {
  headline: string;
  detail: string;
  code: RiverRunReasonCode;
};

function isHigh(display: PrimitiveDisplay): boolean {
  return typeof display.score === "number" && display.score >= 70;
}

function isGood(display: PrimitiveDisplay): boolean {
  return typeof display.score === "number" && display.score >= 70;
}

function isLow(display: PrimitiveDisplay): boolean {
  return typeof display.score === "number" && display.score <= 49;
}

function isWeak(display: PrimitiveDisplay): boolean {
  return typeof display.score === "number" && display.score <= 49;
}

function isLowPresence(display: PrimitiveDisplay): boolean {
  if (typeof display.score !== "number") return false;
  const maximum = (display as PrimitiveDisplay & { maximum?: number }).maximum;
  return typeof maximum === "number" && maximum > 0
    ? display.score / maximum <= 0.3
    : display.score <= 30;
}

function hasResidualPresence(display: PrimitiveDisplay): boolean {
  return typeof display.score === "number" && display.score > 0;
}

function finding(
  headline: string,
  detail: string,
  code: RiverRunReasonCode,
): InterpretationFinding {
  return { headline, detail, code };
}

function note(
  finding: InterpretationFinding,
): InterpretationNote {
  return {
    headline: finding.headline,
    detail: finding.detail,
    reasonCodes: [finding.code],
  };
}
