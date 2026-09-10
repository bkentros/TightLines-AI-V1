import type {
  PierCastCoverageRead,
  PierCastDailyAggregate,
  PierCastInterval,
  PierCastScoredSegment,
} from "../types.ts";
import { toFinFindrOpportunityRating } from "./rating.ts";

function milliseconds(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function unavailable(
  reason: string,
  coverage: PierCastCoverageRead,
): PierCastDailyAggregate {
  return {
    biological: {
      status: "unavailable",
      score: null,
      reasonCodes: [reason],
      ratingName: "FinFindr Opportunity Rating",
    },
    coverage,
  };
}

function coverageFor(
  requested: PierCastInterval,
  segments: readonly PierCastScoredSegment[],
): PierCastCoverageRead {
  const requestedStart = milliseconds(requested.start);
  const requestedEnd = milliseconds(requested.end);
  if (
    requestedStart === null || requestedEnd === null ||
    requestedStart >= requestedEnd
  ) {
    return {
      status: "none",
      coveredIntervals: [],
      fraction: 0,
      reasonCodes: ["requested_interval_invalid"],
    };
  }

  const valid = segments
    .map((segment) => ({
      start: milliseconds(segment.start),
      end: milliseconds(segment.end),
    }))
    .filter((segment): segment is { start: number; end: number } =>
      segment.start !== null && segment.end !== null &&
      segment.start < segment.end && segment.end > requestedStart &&
      segment.start < requestedEnd
    )
    .map((segment) => ({
      start: Math.max(segment.start, requestedStart),
      end: Math.min(segment.end, requestedEnd),
    }))
    .sort((a, b) => a.start - b.start);

  const merged: Array<{ start: number; end: number }> = [];
  for (const interval of valid) {
    const previous = merged.at(-1);
    if (previous && interval.start <= previous.end) {
      previous.end = Math.max(previous.end, interval.end);
    } else {
      merged.push({ ...interval });
    }
  }
  const coveredMilliseconds = merged.reduce(
    (total, interval) => total + interval.end - interval.start,
    0,
  );
  const fraction = coveredMilliseconds / (requestedEnd - requestedStart);
  return {
    status: fraction === 1 ? "complete" : fraction > 0 ? "partial" : "none",
    coveredIntervals: merged.map((interval) => ({
      start: new Date(interval.start).toISOString(),
      end: new Date(interval.end).toISOString(),
    })),
    fraction,
    reasonCodes: fraction === 1 ? [] : ["biological_coverage_incomplete"],
  };
}

export function aggregateCompleteDailyScore(input: {
  requestedInterval: PierCastInterval;
  segments: readonly PierCastScoredSegment[];
}): PierCastDailyAggregate {
  const coverage = coverageFor(input.requestedInterval, input.segments);
  if (coverage.status !== "complete") {
    return unavailable("biological_coverage_incomplete", coverage);
  }

  const requestedStart = milliseconds(input.requestedInterval.start)!;
  const requestedEnd = milliseconds(input.requestedInterval.end)!;
  const segments = [...input.segments].sort((a, b) =>
    milliseconds(a.start)! - milliseconds(b.start)!
  );
  let cursor = requestedStart;
  let integral = 0;

  for (const segment of segments) {
    const start = milliseconds(segment.start);
    const end = milliseconds(segment.end);
    if (
      start === null || end === null || start !== cursor || end <= start ||
      end > requestedEnd || !Number.isFinite(segment.scoreAtStart) ||
      !Number.isFinite(segment.scoreAtEnd) || segment.scoreAtStart < 1 ||
      segment.scoreAtStart > 10 || segment.scoreAtEnd < 1 ||
      segment.scoreAtEnd > 10
    ) {
      return unavailable("biological_interval_invalid", {
        ...coverage,
        reasonCodes: ["biological_interval_invalid"],
      });
    }
    integral += ((segment.scoreAtStart + segment.scoreAtEnd) / 2) *
      (end - start);
    cursor = end;
  }
  if (cursor !== requestedEnd) {
    return unavailable("biological_coverage_incomplete", coverage);
  }

  return {
    biological: toFinFindrOpportunityRating(
      integral / (requestedEnd - requestedStart),
    ),
    coverage,
  };
}
