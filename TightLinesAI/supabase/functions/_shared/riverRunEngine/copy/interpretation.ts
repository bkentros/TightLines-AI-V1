import type {
  InterpretationNote,
  PrimitiveDisplay,
  RiverRunReasonCode,
  RunStage,
} from "../types.ts";
import type { ScheduleLabel } from "../scoring/schedule.ts";

export type InterpretationInput = {
  runStage: RunStage;
  scheduleLabel: ScheduleLabel;
  push: PrimitiveDisplay;
  fishability: PrimitiveDisplay;
  fishInRiver: PrimitiveDisplay;
};

export function resolveInterpretationNote(
  input: InterpretationInput,
): InterpretationNote | undefined {
  if (isHigh(input.push) && isLow(input.fishability)) {
    return note(
      "Movement signal and river shape are pointing in different directions.",
      "Push is strong while Fishability is low, so read movement separately from river shape.",
      "strong_push_low_fishability",
    );
  }
  if (input.scheduleLabel === "Ahead" && input.runStage === "pre_run") {
    return note(
      "Broader progression is early while the calendar stage remains pre-run.",
      "Schedule can be ahead before the configured run window opens; Run Stage still describes calendar timing only.",
      "pre_run_ahead_schedule",
    );
  }
  if (input.runStage === "peak" && isWeak(input.push)) {
    return note(
      "Peak calendar timing and weak movement signal can occur together.",
      "Run Stage describes calendar timing while Push describes current movement signal.",
      "peak_presence_weak_push",
    );
  }
  if (isGood(input.fishability) && isLow(input.fishInRiver)) {
    return note(
      "River shape is favorable while seasonal presence context is low.",
      "Fishability describes current river shape; Fish In River describes seasonal presence context.",
      "good_fishability_low_presence",
    );
  }
  if (input.scheduleLabel === "Behind" && isHigh(input.push)) {
    return note(
      "Current movement signal is strong while broader progression remains behind.",
      "Push describes current movement signal; Schedule describes completed-day progression.",
      "behind_schedule_strong_push",
    );
  }
  return undefined;
}

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

function note(
  headline: string,
  detail: string,
  code: RiverRunReasonCode,
): InterpretationNote {
  return {
    headline,
    detail,
    reasonCodes: [code],
  };
}
