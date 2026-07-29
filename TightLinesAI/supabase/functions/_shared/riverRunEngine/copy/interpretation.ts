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
      "Push says the water pattern supports fresh movement, while Fishability says the gauged stretch is difficult to work. A productive weather event can raise and destabilize the river before fishing shape improves; favor softer edges or wait for the river to settle.",
      "strong_push_low_fishability",
    ));
  }
  if (
    input.conditionsSuggestLabel === "Ahead" && input.runStage === "beginning"
  ) {
    findings.push(finding(
      "Run Timing is Ahead while the calendar is still Beginning.",
      "Run Timing compares the season so far with history, while Run Stage reports the fixed researched calendar. Together they mean the early window may be developing faster than usual—not that the calendar stage or fish count changed.",
      "beginning_ahead_conditions",
    ));
  }
  if (input.runStage === "peak" && isWeak(input.push)) {
    findings.push(finding(
      "Peak calendar timing and a weak current Push can occur together.",
      "Run Stage marks the researched peak window, while Push finds little current support for a new weather-driven entry. Fish already in the system can sustain peak-season opportunity without a fresh push today.",
      "peak_presence_weak_push",
    ));
  }
  if (isGood(input.fishability) && isLowPresence(input.fishInRiver)) {
    findings.push(finding(
      "River shape is favorable while historical presence remains low.",
      "Fishability says the gauged stretch is workable, while Fish In River says this date historically carries limited seasonal presence. Good water to fish is useful, but it does not mean many fish are present.",
      "good_fishability_low_presence",
    ));
  }
  if (input.conditionsSuggestLabel === "Delayed" && isHigh(input.push)) {
    findings.push(finding(
      "Current Push is strong while seasonal timing remains Delayed.",
      "Push describes today's movement-supporting water pattern, while Run Timing preserves the season-to-date historical comparison. A delayed run can receive a strong event now; watch whether later checkpoints absorb that change.",
      "delayed_conditions_strong_push",
    ));
  }
  if (input.runStage === "post_run" && hasResidualPresence(input.fishInRiver)) {
    findings.push(finding(
      "The main run window has ended while a limited historical tail remains.",
      "Run Stage closes the researched main window, while Fish In River preserves a separately configured late tail. Some fish may remain, but River Run does not present that tail as a fresh or continuing main run.",
      "post_run_residual_presence",
    ));
  }
  if (findings.length === 0) return undefined;
  if (findings.length === 1) return note(findings[0]);
  return {
    headline:
      "These River Run reads differ for explainable reasons.",
    detail: findings.map((item, index) =>
      `${index + 1}. ${item.detail}`
    ).join(" "),
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
