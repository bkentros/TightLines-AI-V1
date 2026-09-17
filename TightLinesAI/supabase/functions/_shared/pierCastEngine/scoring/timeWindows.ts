import type {
  PierCastDailyAssessmentWindow,
  PierCastScoredSegment,
  PierCastSixHourScore,
} from "../types.ts";
import { aggregateCompleteDailyScore } from "./daily.ts";
import { buildPierCastSixHourIntervals } from "./dateWindows.ts";

function clippedSegment(
  segment: PierCastScoredSegment,
  start: number,
  end: number,
): PierCastScoredSegment | null {
  const segmentStart = Date.parse(segment.start);
  const segmentEnd = Date.parse(segment.end);
  const clippedStart = Math.max(segmentStart, start);
  const clippedEnd = Math.min(segmentEnd, end);
  if (clippedStart >= clippedEnd) return null;
  const fraction = (instant: number) =>
    (instant - segmentStart) / (segmentEnd - segmentStart);
  const score = (instant: number) =>
    segment.scoreAtStart +
    (segment.scoreAtEnd - segment.scoreAtStart) * fraction(instant);
  return {
    start: new Date(clippedStart).toISOString(),
    end: new Date(clippedEnd).toISOString(),
    scoreAtStart: score(clippedStart),
    scoreAtEnd: score(clippedEnd),
  };
}

/** Reuses the daily integral for each local six-hour block, requiring full coverage. */
export function buildPierCastSixHourScores(input: {
  window: PierCastDailyAssessmentWindow;
  evaluatedAt: string;
  segments: readonly PierCastScoredSegment[];
}): PierCastSixHourScore[] {
  const now = Date.parse(input.evaluatedAt);
  if (!Number.isFinite(now)) throw new Error("Invalid time-window evaluation time.");
  const forecastStart = Date.parse(input.window.requestedInterval.start);
  const forecastEnd = Date.parse(input.window.requestedInterval.end);
  return buildPierCastSixHourIntervals(input.window).map((slot) => {
    const slotStart = Date.parse(slot.start);
    const slotEnd = Date.parse(slot.end);
    const phase = slotEnd <= now ? "past" as const
      : slotStart <= now ? "current" as const
      : "upcoming" as const;
    const start = Math.max(slotStart, forecastStart, now);
    const end = Math.min(slotEnd, forecastEnd);
    if (phase === "past" || start >= end) {
      return {
        slotIndex: slot.slotIndex,
        startAt: slot.start,
        endAt: slot.end,
        phase,
        assessedInterval: null,
        biological: {
          status: "unavailable" as const,
          score: null,
          reasonCodes: [phase === "past" ? "time_window_past" : "time_window_outside_forecast"],
          ratingName: "FinFindr Opportunity Rating" as const,
        },
        coverage: null,
      };
    }
    const assessedInterval = {
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    };
    const segments = input.segments.flatMap((segment) => {
      const clipped = clippedSegment(segment, start, end);
      return clipped ? [clipped] : [];
    });
    const aggregate = aggregateCompleteDailyScore({
      requestedInterval: assessedInterval,
      segments,
    });
    return {
      slotIndex: slot.slotIndex,
      startAt: slot.start,
      endAt: slot.end,
      phase,
      assessedInterval,
      biological: aggregate.biological,
      coverage: aggregate.coverage,
    };
  });
}
