import type {
  PierCastReviewTemperaturePoint,
  PierCastTemperatureEvent,
  PierCastTemperatureEventDirection,
  PierCastTemperatureEventSeverity,
  PierCastTemperatureEventSummary,
} from "../types.ts";

const HOUR_MS = 60 * 60 * 1000;
const MAX_CONTIGUOUS_GAP_MS = 1.5 * HOUR_MS;
const CELSIUS_PER_FAHRENHEIT_DEGREE = 5 / 9;
const COMPARISON_EPSILON_C = 1e-9;

const fahrenheitDeltaToCelsius = (degreesF: number) =>
  degreesF * CELSIUS_PER_FAHRENHEIT_DEGREE;

/**
 * Versioned product thresholds for pier-facing modeled temperature events.
 * These are change thresholds, so the Fahrenheit-to-Celsius conversion has
 * no offset. They intentionally do not claim an observed physical cause.
 */
export const PIER_CAST_TEMPERATURE_EVENT_CONFIG = Object.freeze({
  version: "piercast-temperature-events-v1" as const,
  minimumEventChangeC: fahrenheitDeltaToCelsius(3),
  notable24HourChangeC: fahrenheitDeltaToCelsius(6),
  major12HourChangeC: fahrenheitDeltaToCelsius(8),
  major24HourChangeC: fahrenheitDeltaToCelsius(10),
  extreme24HourChangeC: fahrenheitDeltaToCelsius(15),
  reversalChangeC: fahrenheitDeltaToCelsius(3),
  flatCloseHours: 6,
  isolatedSpikeChangeC: fahrenheitDeltaToCelsius(3),
  isolatedSpikeReturnToleranceC: fahrenheitDeltaToCelsius(1),
  analysisWindowsHours: [6, 12, 24] as const,
});

type IndexedTemperaturePoint = PierCastReviewTemperaturePoint & {
  timeMs: number;
};

type DetectionState = {
  direction: PierCastTemperatureEventDirection;
  startIndex: number;
  extremeIndex: number;
};

type NormalizedTimeline = {
  points: IndexedTemperaturePoint[];
  discardedPointCount: number;
  duplicatePointCount: number;
};

type ClassifiedEvent = {
  severity: PierCastTemperatureEventSeverity;
  triggerWindowHours: 12 | 24;
  maximumChangeByWindowC: { hours6: number; hours12: number; hours24: number };
};

export function detectPierCastTemperatureEvents(
  input: readonly PierCastReviewTemperaturePoint[],
): PierCastTemperatureEventSummary {
  const normalized = normalizeTimeline(input);
  if (normalized.points.length < 2) {
    return {
      status: "unavailable",
      detectorVersion: PIER_CAST_TEMPERATURE_EVENT_CONFIG.version,
      coverageStart: normalized.points[0]?.validAt ?? null,
      coverageEnd: normalized.points[0]?.validAt ?? null,
      pointCount: normalized.points.length,
      segmentCount: normalized.points.length,
      events: [],
      reasonCodes: ["temperature_event_insufficient_data"],
    };
  }

  const segments = splitAtCoverageGaps(normalized.points);
  let filteredSpikeCount = 0;
  const events: PierCastTemperatureEvent[] = [];
  for (const segment of segments) {
    const filtered = filterIsolatedSpikes(segment);
    filteredSpikeCount += filtered.filteredCount;
    events.push(...detectEventsInSegment(filtered.points));
  }
  events.sort((left, right) =>
    left.startAt.localeCompare(right.startAt) ||
    left.endAt.localeCompare(right.endAt) ||
    left.direction.localeCompare(right.direction)
  );

  const reasonCodes: string[] = [];
  if (segments.length > 1) reasonCodes.push("temperature_event_coverage_gap");
  if (normalized.discardedPointCount > 0) {
    reasonCodes.push("temperature_event_invalid_points_discarded");
  }
  if (normalized.duplicatePointCount > 0) {
    reasonCodes.push("temperature_event_duplicate_times_deduplicated");
  }
  if (filteredSpikeCount > 0) {
    reasonCodes.push("temperature_event_isolated_spike_filtered");
  }

  return {
    status: segments.length > 1 || normalized.discardedPointCount > 0
      ? "partial"
      : "available",
    detectorVersion: PIER_CAST_TEMPERATURE_EVENT_CONFIG.version,
    coverageStart: normalized.points[0]!.validAt,
    coverageEnd: normalized.points[normalized.points.length - 1]!.validAt,
    pointCount: normalized.points.length,
    segmentCount: segments.length,
    events,
    reasonCodes,
  };
}

function normalizeTimeline(
  input: readonly PierCastReviewTemperaturePoint[],
): NormalizedTimeline {
  const byTime = new Map<number, IndexedTemperaturePoint>();
  let discardedPointCount = 0;
  let duplicatePointCount = 0;

  for (const point of input) {
    const timeMs = Date.parse(point.validAt);
    if (!Number.isFinite(timeMs) || !Number.isFinite(point.temperatureC)) {
      discardedPointCount += 1;
      continue;
    }
    if (byTime.has(timeMs)) duplicatePointCount += 1;
    byTime.set(timeMs, {
      validAt: new Date(timeMs).toISOString(),
      temperatureC: point.temperatureC,
      timeMs,
    });
  }

  return {
    points: [...byTime.values()].sort((left, right) =>
      left.timeMs - right.timeMs
    ),
    discardedPointCount,
    duplicatePointCount,
  };
}

function splitAtCoverageGaps(
  points: readonly IndexedTemperaturePoint[],
): IndexedTemperaturePoint[][] {
  const segments: IndexedTemperaturePoint[][] = [];
  let current: IndexedTemperaturePoint[] = [];
  for (const point of points) {
    const previous = current[current.length - 1];
    if (previous && point.timeMs - previous.timeMs > MAX_CONTIGUOUS_GAP_MS) {
      if (current.length > 0) segments.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length > 0) segments.push(current);
  return segments;
}

function filterIsolatedSpikes(
  points: readonly IndexedTemperaturePoint[],
): { points: IndexedTemperaturePoint[]; filteredCount: number } {
  if (points.length < 3) return { points: [...points], filteredCount: 0 };
  const result = points.map((point) => ({ ...point }));
  let filteredCount = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const next = points[index + 1]!;
    if (
      current.timeMs - previous.timeMs > MAX_CONTIGUOUS_GAP_MS ||
      next.timeMs - current.timeMs > MAX_CONTIGUOUS_GAP_MS
    ) continue;
    if (
      Math.abs(previous.temperatureC - next.temperatureC) >
        PIER_CAST_TEMPERATURE_EVENT_CONFIG.isolatedSpikeReturnToleranceC
    ) continue;
    const outsideNeighborRange = current.temperatureC <
        Math.min(previous.temperatureC, next.temperatureC) ||
      current.temperatureC > Math.max(previous.temperatureC, next.temperatureC);
    if (
      !outsideNeighborRange ||
      Math.abs(current.temperatureC - previous.temperatureC) +
            COMPARISON_EPSILON_C <
        PIER_CAST_TEMPERATURE_EVENT_CONFIG.isolatedSpikeChangeC ||
      Math.abs(current.temperatureC - next.temperatureC) +
            COMPARISON_EPSILON_C <
        PIER_CAST_TEMPERATURE_EVENT_CONFIG.isolatedSpikeChangeC
    ) continue;

    const progress = (current.timeMs - previous.timeMs) /
      (next.timeMs - previous.timeMs);
    result[index] = {
      ...current,
      temperatureC: previous.temperatureC +
        progress * (next.temperatureC - previous.temperatureC),
    };
    filteredCount += 1;
  }
  return { points: result, filteredCount };
}

function detectEventsInSegment(
  points: readonly IndexedTemperaturePoint[],
): PierCastTemperatureEvent[] {
  if (points.length < 2) return [];
  const events: PierCastTemperatureEvent[] = [];
  let state: DetectionState | null = null;
  let highIndex = 0;
  let lowIndex = 0;
  let index = 1;

  while (index < points.length) {
    if (!state) {
      if (points[index]!.temperatureC >= points[highIndex]!.temperatureC) {
        highIndex = index;
      }
      if (points[index]!.temperatureC <= points[lowIndex]!.temperatureC) {
        lowIndex = index;
      }
      const coolingChange = points[highIndex]!.temperatureC -
        points[index]!.temperatureC;
      const warmingChange = points[index]!.temperatureC -
        points[lowIndex]!.temperatureC;
      if (
        highIndex < index &&
        meets(
          coolingChange,
          PIER_CAST_TEMPERATURE_EVENT_CONFIG.minimumEventChangeC,
        )
      ) {
        state = {
          direction: "cooling",
          startIndex: highIndex,
          extremeIndex: index,
        };
      } else if (
        lowIndex < index &&
        meets(
          warmingChange,
          PIER_CAST_TEMPERATURE_EVENT_CONFIG.minimumEventChangeC,
        )
      ) {
        state = {
          direction: "warming",
          startIndex: lowIndex,
          extremeIndex: index,
        };
      }
      index += 1;
      continue;
    }

    const current = points[index]!;
    const extreme = points[state.extremeIndex]!;
    const makesNewExtreme = state.direction === "cooling"
      ? current.temperatureC < extreme.temperatureC
      : current.temperatureC > extreme.temperatureC;
    if (makesNewExtreme) {
      state.extremeIndex = index;
      index += 1;
      continue;
    }

    if (isSustainedReversal(points, index, state)) {
      const completed = buildEvent({
        points,
        state,
        startsAtCoverageBoundary: state.startIndex === 0,
        endsAtCoverageBoundary: false,
      });
      if (completed) events.push(completed);
      const previousExtremeIndex = state.extremeIndex;
      const newDirection = state.direction === "cooling"
        ? "warming"
        : "cooling";
      state = {
        direction: newDirection,
        startIndex: previousExtremeIndex,
        extremeIndex: findDirectionalExtreme(
          points,
          previousExtremeIndex,
          index,
          newDirection,
        ),
      };
      index += 1;
      continue;
    }

    const hoursSinceExtreme = (current.timeMs - extreme.timeMs) / HOUR_MS;
    if (
      hoursSinceExtreme >= PIER_CAST_TEMPERATURE_EVENT_CONFIG.flatCloseHours
    ) {
      const completed = buildEvent({
        points,
        state,
        startsAtCoverageBoundary: state.startIndex === 0,
        endsAtCoverageBoundary: false,
      });
      if (completed) events.push(completed);
      const restartIndex = state.extremeIndex;
      state = null;
      highIndex = restartIndex;
      lowIndex = restartIndex;
      index = restartIndex + 1;
      continue;
    }

    index += 1;
  }

  if (state) {
    const completed = buildEvent({
      points,
      state,
      startsAtCoverageBoundary: state.startIndex === 0,
      endsAtCoverageBoundary: true,
    });
    if (completed) events.push(completed);
  }
  return events;
}

function isSustainedReversal(
  points: readonly IndexedTemperaturePoint[],
  index: number,
  state: DetectionState,
): boolean {
  const next = points[index + 1];
  if (!next || next.timeMs - points[index]!.timeMs > MAX_CONTIGUOUS_GAP_MS) {
    return false;
  }
  const extremeTemperature = points[state.extremeIndex]!.temperatureC;
  const reversalAt = (point: IndexedTemperaturePoint) =>
    state.direction === "cooling"
      ? point.temperatureC - extremeTemperature
      : extremeTemperature - point.temperatureC;
  return meets(
    reversalAt(points[index]!),
    PIER_CAST_TEMPERATURE_EVENT_CONFIG.reversalChangeC,
  ) && meets(
    reversalAt(next),
    PIER_CAST_TEMPERATURE_EVENT_CONFIG.reversalChangeC,
  );
}

function findDirectionalExtreme(
  points: readonly IndexedTemperaturePoint[],
  startIndex: number,
  endIndex: number,
  direction: PierCastTemperatureEventDirection,
): number {
  let extremeIndex = startIndex;
  for (let index = startIndex + 1; index <= endIndex; index += 1) {
    const isMoreExtreme = direction === "cooling"
      ? points[index]!.temperatureC < points[extremeIndex]!.temperatureC
      : points[index]!.temperatureC > points[extremeIndex]!.temperatureC;
    if (isMoreExtreme) extremeIndex = index;
  }
  return extremeIndex;
}

function buildEvent(input: {
  points: readonly IndexedTemperaturePoint[];
  state: DetectionState;
  startsAtCoverageBoundary: boolean;
  endsAtCoverageBoundary: boolean;
}): PierCastTemperatureEvent | null {
  const start = input.points[input.state.startIndex]!;
  const end = input.points[input.state.extremeIndex]!;
  const classified = classifyEvent(
    input.points.slice(input.state.startIndex, input.state.extremeIndex + 1),
    input.state.direction,
  );
  if (!classified) return null;
  const changeC = end.temperatureC - start.temperatureC;
  return {
    eventId: `${input.state.direction}:${start.validAt}:${end.validAt}`,
    direction: input.state.direction,
    severity: classified.severity,
    startAt: start.validAt,
    endAt: end.validAt,
    startTemperatureC: start.temperatureC,
    endTemperatureC: end.temperatureC,
    changeC,
    magnitudeC: Math.abs(changeC),
    durationHours: (end.timeMs - start.timeMs) / HOUR_MS,
    triggerWindowHours: classified.triggerWindowHours,
    maximumChangeByWindowC: classified.maximumChangeByWindowC,
    startsAtCoverageBoundary: input.startsAtCoverageBoundary,
    endsAtCoverageBoundary: input.endsAtCoverageBoundary,
  };
}

function classifyEvent(
  points: readonly IndexedTemperaturePoint[],
  direction: PierCastTemperatureEventDirection,
): ClassifiedEvent | null {
  const maximumChangeByWindowC = {
    hours6: maximumDirectionalChange(points, direction, 6),
    hours12: maximumDirectionalChange(points, direction, 12),
    hours24: maximumDirectionalChange(points, direction, 24),
  };
  const change12 = maximumChangeByWindowC.hours12;
  const change24 = maximumChangeByWindowC.hours24;

  if (
    meets(
      change24,
      PIER_CAST_TEMPERATURE_EVENT_CONFIG.extreme24HourChangeC,
    )
  ) {
    return {
      severity: "extreme",
      triggerWindowHours: 24,
      maximumChangeByWindowC,
    };
  }
  if (
    meets(change24, PIER_CAST_TEMPERATURE_EVENT_CONFIG.major24HourChangeC) ||
    meets(change12, PIER_CAST_TEMPERATURE_EVENT_CONFIG.major12HourChangeC)
  ) {
    return {
      severity: "major",
      triggerWindowHours: meets(
          change24,
          PIER_CAST_TEMPERATURE_EVENT_CONFIG.major24HourChangeC,
        )
        ? 24
        : 12,
      maximumChangeByWindowC,
    };
  }
  if (
    meets(change24, PIER_CAST_TEMPERATURE_EVENT_CONFIG.notable24HourChangeC)
  ) {
    return {
      severity: "notable",
      triggerWindowHours: 24,
      maximumChangeByWindowC,
    };
  }
  if (
    meets(change24, PIER_CAST_TEMPERATURE_EVENT_CONFIG.minimumEventChangeC)
  ) {
    return {
      severity: "minor",
      triggerWindowHours: 24,
      maximumChangeByWindowC,
    };
  }
  return null;
}

function maximumDirectionalChange(
  points: readonly IndexedTemperaturePoint[],
  direction: PierCastTemperatureEventDirection,
  windowHours: number,
): number {
  const maximumDurationMs = windowHours * HOUR_MS;
  let maximum = 0;
  for (let from = 0; from < points.length - 1; from += 1) {
    for (let to = from + 1; to < points.length; to += 1) {
      const duration = points[to]!.timeMs - points[from]!.timeMs;
      if (duration > maximumDurationMs) break;
      const change = direction === "cooling"
        ? points[from]!.temperatureC - points[to]!.temperatureC
        : points[to]!.temperatureC - points[from]!.temperatureC;
      maximum = Math.max(maximum, change);
    }
  }
  return maximum;
}

function meets(actual: number, threshold: number): boolean {
  return actual + COMPARISON_EPSILON_C >= threshold;
}
