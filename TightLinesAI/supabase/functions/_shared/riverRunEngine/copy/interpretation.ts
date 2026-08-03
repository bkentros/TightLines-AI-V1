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
      "Fresh movement looks possible, but the river may be difficult to fish.",
      "A strong weather-and-water event can encourage movement while also making the river high, fast, or unsettled. Leave the main channel alone; start at bank-side inside seams and protected current, and wait for the river to settle if the presentation will not stay controlled.",
      "strong_push_low_fishability",
    ));
  }
  if (
    input.conditionsSuggestLabel === "Ahead" && input.runStage === "beginning"
  ) {
    findings.push(finding(
      "The run is still beginning, but it appears to be developing early.",
      "The season is in its opening stage, while river rises and cooling are progressing faster than usual. Begin one accessible river section farther upstream than a normal opening-day plan and fish the first established holding water; this is still not a live fish count.",
      "beginning_ahead_conditions",
    ));
  }
  if (input.runStage === "peak" && isWeak(input.push)) {
    findings.push(finding(
      "The run is at peak, but today's water does not point to a fresh wave.",
      "Many fish may already be in the river even when rain, river level, and temperature show little support for new movement. Start in established deep holes, fish each one from head to tail, and leave lower entry lanes secondary.",
      "peak_presence_weak_push",
    ));
  }
  if (isGood(input.fishability) && isLowPresence(input.fishInRiver)) {
    findings.push(finding(
      "The river should fish well, but seasonal fish presence is still low.",
      goodFishabilityLowPresenceDetail(input.runStage),
      "good_fishability_low_presence",
    ));
  }
  if (input.conditionsSuggestLabel === "Delayed" && isHigh(input.push)) {
    findings.push(finding(
      "The season has been late, but today's water may help fresh fish move.",
      "A delayed run can still receive a strong movement event. Start on lower-river travel lanes and the first deep resting holes above them; do not jump to upper water as though the whole season has caught up.",
      "delayed_conditions_strong_push",
    ));
  }
  if (input.runStage === "post_run" && hasResidualPresence(input.fishInRiver)) {
    findings.push(finding(
      "The main run is over, but a small number of fish may remain.",
      "Late fish can linger after the dependable run has ended. If you pursue them, fish only the deepest established holding water, keep the trip short, and leave actively spawning fish undisturbed.",
      "post_run_residual_presence",
    ));
  }
  if (findings.length === 0) return undefined;
  if (findings.length === 1) return note(findings[0]);
  return {
    headline: "Today's reads are pointing to different parts of the picture.",
    detail: findings.map((item) => item.detail).join("\n\n"),
    reasonCodes: findings.map((item) => item.code),
  };
}

function goodFishabilityLowPresenceDetail(stage: RunStage): string {
  if (stage === "pre_run" || stage === "beginning") {
    return "Good flow makes presentations easier, but it does not put fish in the river. Stay low, fish the first travel lane entering deep resting water, make one complete pass, and move instead of waiting for numbers that have not developed.";
  }
  if (stage === "tapering" || stage === "ending" || stage === "post_run") {
    return "Good flow makes presentations easier, but it does not put fish in the river. Begin in the deepest established holding water and skip broad searches through fast travel lanes as seasonal presence thins.";
  }
  return "Good flow makes presentations easier, but it does not put fish in the river. Start with the best established holding hole in the current Run Stage, fish it from head to tail, and move after one complete pass.";
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
  const riverCeiling =
    (display as PrimitiveDisplay & { riverCeiling?: number }).riverCeiling;
  return typeof riverCeiling === "number" && riverCeiling > 0
    ? display.score / riverCeiling <= 0.3
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
