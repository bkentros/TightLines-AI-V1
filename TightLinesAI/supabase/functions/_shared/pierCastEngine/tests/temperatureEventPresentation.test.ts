import { assertEquals } from "jsr:@std/assert";
import {
  orderPierCastTemperatureEvents,
  pierCastTemperatureEventTimingLabel,
} from "../../../../../lib/pierCastTemperatureEventPresentation.ts";

type FixtureEvent = {
  id: string;
  startAt: string;
  endAt: string;
  severity: "minor" | "notable" | "major" | "extreme";
  magnitudeC: number;
};

function event(
  id: string,
  day: number,
  severity: FixtureEvent["severity"],
  magnitudeC = 2,
): FixtureEvent {
  const startAt = new Date(Date.UTC(2026, 9, day, 12)).toISOString();
  const endAt = new Date(Date.UTC(2026, 9, day, 20)).toISOString();
  return { id, startAt, endAt, severity, magnitudeC };
}

Deno.test("every upcoming event is retained from soonest to latest", () => {
  const ordered = orderPierCastTemperatureEvents({
    events: [
      event("day-four", 8, "extreme"),
      event("tomorrow", 5, "major"),
      event("notable", 5, "notable"),
      event("minor", 4, "minor"),
      event("following-day", 6, "major"),
    ],
  }, Date.UTC(2026, 9, 3, 12));

  assertEquals(ordered.map((item) => item.id), [
    "minor",
    "tomorrow",
    "notable",
    "following-day",
    "day-four",
  ]);
});

Deno.test("significance breaks simultaneous-event ties without overriding time", () => {
  const events = orderPierCastTemperatureEvents({
    events: [
      event("earlier-equal", 5, "notable", 4),
      event("largest", 8, "notable", 5),
      event("same-time-major", 5, "major", 4),
    ],
  }, Date.UTC(2026, 9, 3, 12));

  assertEquals(events.map((item) => item.id), [
    "same-time-major",
    "earlier-equal",
    "largest",
  ]);
  assertEquals(orderPierCastTemperatureEvents(undefined), []);
});

Deno.test("active events lead upcoming events while completed events remain visible", () => {
  const referenceAt = Date.UTC(2026, 9, 5, 14);
  const completed = event("completed", 4, "extreme");
  const active = event("active", 5, "minor");
  const upcoming = event("upcoming", 6, "major");

  const events = orderPierCastTemperatureEvents({
    events: [completed, upcoming, active],
  }, referenceAt);

  assertEquals(events.map((item) => item.id), [
    "active",
    "upcoming",
    "completed",
  ]);
});

Deno.test("relative timing labels use the pier's local calendar", () => {
  const timezone = "America/Detroit";
  const referenceAt = "2026-10-04T14:00:00.000Z";
  const fixture = (startAt: string, endAt: string) => ({ startAt, endAt });

  assertEquals(
    pierCastTemperatureEventTimingLabel(
      fixture("2026-10-04T13:00:00.000Z", "2026-10-04T16:00:00.000Z"),
      referenceAt,
      timezone,
    ),
    "IN PROGRESS",
  );
  assertEquals(
    pierCastTemperatureEventTimingLabel(
      fixture("2026-10-04T22:00:00.000Z", "2026-10-05T02:00:00.000Z"),
      referenceAt,
      timezone,
    ),
    "STARTS TONIGHT",
  );
  assertEquals(
    pierCastTemperatureEventTimingLabel(
      fixture("2026-10-05T15:00:00.000Z", "2026-10-05T18:00:00.000Z"),
      referenceAt,
      timezone,
    ),
    "STARTS TOMORROW",
  );
  assertEquals(
    pierCastTemperatureEventTimingLabel(
      fixture("2026-10-07T15:00:00.000Z", "2026-10-07T18:00:00.000Z"),
      referenceAt,
      timezone,
    ),
    "STARTS IN 3 DAYS",
  );
  assertEquals(
    pierCastTemperatureEventTimingLabel(
      fixture("2026-10-04T11:00:00.000Z", "2026-10-04T13:00:00.000Z"),
      referenceAt,
      timezone,
    ),
    "ENDED TODAY",
  );
});
