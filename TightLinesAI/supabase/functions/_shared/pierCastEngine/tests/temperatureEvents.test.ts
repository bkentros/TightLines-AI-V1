import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  detectPierCastTemperatureEvents,
  PIER_CAST_TEMPERATURE_EVENT_CONFIG,
} from "../index.ts";

const HOUR_MS = 60 * 60 * 1000;
const START = "2026-10-04T20:00:00.000Z";

const fahrenheitToCelsius = (temperatureF: number) =>
  (temperatureF - 32) * 5 / 9;

function timeline(
  temperaturesF: readonly number[],
  startAt = START,
  hourOffsets?: readonly number[],
) {
  return temperaturesF.map((temperatureF, index) => ({
    validAt: new Date(
      Date.parse(startAt) + (hourOffsets?.[index] ?? index) * HOUR_MS,
    ).toISOString(),
    temperatureC: fahrenheitToCelsius(temperatureF),
  }));
}

function ramp(startF: number, endF: number, hours: number): number[] {
  return Array.from(
    { length: hours + 1 },
    (_, index) => startF + (endF - startF) * index / hours,
  );
}

function appendRamp(
  temperatures: number[],
  endF: number,
  hours: number,
): number[] {
  const startF = temperatures[temperatures.length - 1]!;
  return [...temperatures, ...ramp(startF, endF, hours).slice(1)];
}

Deno.test("temperature event thresholds are explicitly versioned", () => {
  assertEquals(
    PIER_CAST_TEMPERATURE_EVENT_CONFIG.version,
    "piercast-temperature-events-v1",
  );
  assertAlmostEquals(
    PIER_CAST_TEMPERATURE_EVENT_CONFIG.major12HourChangeC,
    8 * 5 / 9,
    1e-12,
  );
  assertAlmostEquals(
    PIER_CAST_TEMPERATURE_EVENT_CONFIG.major24HourChangeC,
    10 * 5 / 9,
    1e-12,
  );
});

Deno.test("exact product boundaries classify once without threshold gaps", () => {
  const cases = [
    { changeF: 15, hours: 24, severity: "extreme", trigger: 24 },
    { changeF: 10, hours: 24, severity: "major", trigger: 24 },
    { changeF: 8, hours: 12, severity: "major", trigger: 12 },
    { changeF: 6, hours: 24, severity: "notable", trigger: 24 },
    { changeF: 3, hours: 24, severity: "minor", trigger: 24 },
  ] as const;

  for (const item of cases) {
    const events = detectPierCastTemperatureEvents(
      timeline(ramp(70, 70 - item.changeF, item.hours)),
    ).events;
    assertEquals(events.length, 1);
    assertEquals(events[0]!.severity, item.severity);
    assertEquals(events[0]!.triggerWindowHours, item.trigger);
  }

  assertEquals(
    detectPierCastTemperatureEvents(timeline(ramp(70, 67.001, 24))).events,
    [],
  );
});

Deno.test("detection is year-round and independent of calendar season", () => {
  const temperatures = ramp(70, 60, 24);
  const winter = detectPierCastTemperatureEvents(
    timeline(temperatures, "2026-01-10T00:00:00.000Z"),
  ).events[0]!;
  const summer = detectPierCastTemperatureEvents(
    timeline(temperatures, "2026-07-10T00:00:00.000Z"),
  ).events[0]!;

  assertEquals(winter.direction, summer.direction);
  assertEquals(winter.severity, summer.severity);
  assertEquals(winter.magnitudeC, summer.magnitudeC);
  assertEquals(winter.durationHours, summer.durationHours);
  assertEquals(winter.maximumChangeByWindowC, summer.maximumChangeByWindowC);
});

Deno.test("a stable complete timeline is available with no events", () => {
  const result = detectPierCastTemperatureEvents(
    timeline(Array.from({ length: 121 }, () => 60)),
  );
  assertEquals(result.status, "available");
  assertEquals(result.pointCount, 121);
  assertEquals(result.segmentCount, 1);
  assertEquals(result.events, []);
  assertEquals(result.reasonCodes, []);
});

Deno.test("one movement crossing several analysis windows produces one event", () => {
  const temperatures = [...ramp(70, 60, 24), ...Array(6).fill(60)];
  const result = detectPierCastTemperatureEvents(timeline(temperatures));

  assertEquals(result.events.length, 1);
  const event = result.events[0]!;
  assertEquals(event.direction, "cooling");
  assertEquals(event.severity, "major");
  assertEquals(event.triggerWindowHours, 24);
  assertAlmostEquals(event.changeC, -10 * 5 / 9, 1e-12);
  assertAlmostEquals(event.magnitudeC, 10 * 5 / 9, 1e-12);
  assertEquals(event.durationHours, 24);
  assertEquals(event.startsAtCoverageBoundary, true);
  assertEquals(event.endsAtCoverageBoundary, false);
  assert(event.maximumChangeByWindowC.hours6 > 0);
  assert(event.maximumChangeByWindowC.hours12 > 0);
  assertAlmostEquals(
    event.maximumChangeByWindowC.hours24,
    10 * 5 / 9,
    1e-12,
  );
});

Deno.test("eight degrees in twelve hours qualifies as one major event", () => {
  const temperatures = [...ramp(70, 62, 12), ...Array(6).fill(62)];
  const [event] =
    detectPierCastTemperatureEvents(timeline(temperatures)).events;
  assertEquals(event?.severity, "major");
  assertEquals(event?.triggerWindowHours, 12);
  assertAlmostEquals(event!.magnitudeC, 8 * 5 / 9, 1e-12);
});

Deno.test("fifteen degrees in twenty-four hours is extreme", () => {
  const [event] = detectPierCastTemperatureEvents(
    timeline(ramp(70, 55, 24)),
  ).events;
  assertEquals(event?.severity, "extreme");
  assertEquals(event?.triggerWindowHours, 24);
});

Deno.test("six degrees in six hours is notable", () => {
  const [event] = detectPierCastTemperatureEvents(
    timeline(ramp(70, 64, 6)),
  ).events;
  assertEquals(event?.severity, "notable");
  assertAlmostEquals(
    event!.maximumChangeByWindowC.hours6,
    6 * 5 / 9,
    1e-12,
  );
});

Deno.test("a long event uses rolling windows for severity but keeps its full excursion", () => {
  const [event] = detectPierCastTemperatureEvents(
    timeline(ramp(72, 60, 36)),
  ).events;
  assertEquals(event?.severity, "notable");
  assertEquals(event?.durationHours, 36);
  assertAlmostEquals(event!.magnitudeC, 12 * 5 / 9, 1e-12);
  assertAlmostEquals(
    event!.maximumChangeByWindowC.hours24,
    8 * 5 / 9,
    1e-12,
  );
});

Deno.test("warming followed by cooling produces two chronological events", () => {
  let temperatures = ramp(50, 60, 12);
  temperatures = appendRamp(temperatures, 48, 12);
  const events = detectPierCastTemperatureEvents(timeline(temperatures)).events;

  assertEquals(events.length, 2);
  assertEquals(events.map((event) => event.direction), ["warming", "cooling"]);
  assertEquals(events.map((event) => event.severity), ["major", "major"]);
  assertEquals(events[0]!.endAt, events[1]!.startAt);
});

Deno.test("a sub-threshold reversal stays inside one larger event", () => {
  let temperatures = ramp(70, 62, 8);
  temperatures.push(63, 64);
  temperatures = appendRamp(temperatures, 58, 6);
  const events = detectPierCastTemperatureEvents(timeline(temperatures)).events;

  assertEquals(events.length, 1);
  assertEquals(events[0]!.direction, "cooling");
  assertEquals(events[0]!.severity, "major");
  assertAlmostEquals(events[0]!.magnitudeC, 12 * 5 / 9, 1e-12);
});

Deno.test("a sustained three-degree reversal starts a distinct event", () => {
  const temperatures = [...ramp(70, 60, 10), 63, 64];
  const events = detectPierCastTemperatureEvents(timeline(temperatures)).events;

  assertEquals(events.length, 2);
  assertEquals(events[0]!.direction, "cooling");
  assertEquals(events[0]!.severity, "major");
  assertEquals(events[0]!.endsAtCoverageBoundary, false);
  assertEquals(events[1]!.direction, "warming");
  assertEquals(events[1]!.severity, "minor");
  assertEquals(events[1]!.endsAtCoverageBoundary, true);
});

Deno.test("an isolated one-hour spike is filtered", () => {
  const temperatures = [60, 60, 60, 60, 40, 60, 60, 60, 60];
  const result = detectPierCastTemperatureEvents(timeline(temperatures));

  assertEquals(result.events, []);
  assertEquals(result.status, "available");
  assertEquals(result.reasonCodes, [
    "temperature_event_isolated_spike_filtered",
  ]);
});

Deno.test("six flat hours separate two same-direction movements", () => {
  let temperatures = ramp(70, 65, 5);
  temperatures.push(...Array(6).fill(65));
  temperatures = appendRamp(temperatures, 60, 5);
  temperatures.push(...Array(6).fill(60));
  const events = detectPierCastTemperatureEvents(timeline(temperatures)).events;

  assertEquals(events.length, 2);
  assertEquals(events.map((event) => event.direction), ["cooling", "cooling"]);
  assertEquals(events.map((event) => event.severity), ["minor", "minor"]);
  assertEquals(events[0]!.endTemperatureC, events[1]!.startTemperatureC);
  assert(events[1]!.startAt > events[0]!.endAt);
});

Deno.test("coverage gaps are partial and never bridged into an event", () => {
  const result = detectPierCastTemperatureEvents(
    timeline([70, 69, 60, 59], START, [0, 1, 4, 5]),
  );

  assertEquals(result.status, "partial");
  assertEquals(result.segmentCount, 2);
  assertEquals(result.events, []);
  assertEquals(result.reasonCodes, ["temperature_event_coverage_gap"]);
});

Deno.test("real events on both sides of a coverage gap are both retained", () => {
  const result = detectPierCastTemperatureEvents(
    timeline([70, 66, 50, 54], START, [0, 1, 4, 5]),
  );

  assertEquals(result.status, "partial");
  assertEquals(result.events.length, 2);
  assertEquals(result.events.map((event) => event.direction), [
    "cooling",
    "warming",
  ]);
  assertEquals(
    result.events.every((event) =>
      event.startsAtCoverageBoundary && event.endsAtCoverageBoundary
    ),
    true,
  );
});

Deno.test("events cross midnight without being split by calendar date", () => {
  const startAt = "2026-10-05T22:00:00.000Z";
  const [event] = detectPierCastTemperatureEvents(
    timeline(ramp(70, 60, 10), startAt),
  ).events;

  assertEquals(event?.startAt, startAt);
  assertEquals(event?.endAt, "2026-10-06T08:00:00.000Z");
  assertEquals(event?.severity, "major");
});

Deno.test("an unfinished event carries both forecast-boundary flags", () => {
  const [event] = detectPierCastTemperatureEvents(
    timeline(ramp(70, 60, 12)),
  ).events;

  assertEquals(event?.startsAtCoverageBoundary, true);
  assertEquals(event?.endsAtCoverageBoundary, true);
});

Deno.test("a major event ending at hour 120 is retained at the five-day boundary", () => {
  const temperatures = [
    ...Array(111).fill(60),
    ...ramp(60, 45, 10).slice(1),
  ];
  const result = detectPierCastTemperatureEvents(timeline(temperatures));

  assertEquals(result.pointCount, 121);
  assertEquals(result.events.length, 1);
  assertEquals(result.events[0]!.severity, "extreme");
  assertEquals(result.events[0]!.endAt, result.coverageEnd);
  assertEquals(result.events[0]!.startsAtCoverageBoundary, false);
  assertEquals(result.events[0]!.endsAtCoverageBoundary, true);
});

Deno.test("invalid points and duplicate times are handled deterministically", () => {
  const points = timeline([70, 68, 66, 64]);
  const result = detectPierCastTemperatureEvents([
    points[2]!,
    { validAt: "invalid", temperatureC: 10 },
    points[0]!,
    points[1]!,
    { ...points[1]!, temperatureC: fahrenheitToCelsius(67) },
    points[3]!,
  ]);

  assertEquals(result.status, "partial");
  assertEquals(result.pointCount, 4);
  assertEquals(result.reasonCodes, [
    "temperature_event_invalid_points_discarded",
    "temperature_event_duplicate_times_deduplicated",
  ]);
  assertEquals(result.events[0]?.direction, "cooling");
});

Deno.test("fewer than two usable points is unavailable", () => {
  const result = detectPierCastTemperatureEvents([
    { validAt: "invalid", temperatureC: 10 },
  ]);
  assertEquals(result.status, "unavailable");
  assertEquals(result.events, []);
  assertEquals(result.reasonCodes, ["temperature_event_insufficient_data"]);
});

Deno.test("seeded irregular five-day forecasts preserve event invariants", () => {
  let seed = 0x5eed1234;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  for (let run = 0; run < 200; run += 1) {
    const temperatures = [35 + random() * 40];
    for (let hour = 1; hour <= 120; hour += 1) {
      const ordinaryChange = (random() - 0.5) * 2;
      const eventChange = random() < 0.04 ? (random() - 0.5) * 16 : 0;
      temperatures.push(
        Math.max(
          30,
          Math.min(85, temperatures[hour - 1]! + ordinaryChange + eventChange),
        ),
      );
    }
    const result = detectPierCastTemperatureEvents(timeline(temperatures));
    const ids = new Set<string>();
    for (let index = 0; index < result.events.length; index += 1) {
      const event = result.events[index]!;
      assert(Date.parse(event.startAt) < Date.parse(event.endAt));
      assertAlmostEquals(event.magnitudeC, Math.abs(event.changeC), 1e-12);
      assert(
        event.direction === "cooling" ? event.changeC < 0 : event.changeC > 0,
      );
      assert(
        event.maximumChangeByWindowC.hours6 <=
          event.maximumChangeByWindowC.hours12 + 1e-9,
      );
      assert(
        event.maximumChangeByWindowC.hours12 <=
          event.maximumChangeByWindowC.hours24 + 1e-9,
      );
      assert(!ids.has(event.eventId));
      ids.add(event.eventId);
      const previous = result.events[index - 1];
      if (previous) assert(previous.endAt <= event.startAt);
    }
  }
});
