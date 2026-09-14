import { assertEquals } from "jsr:@std/assert";
import { rankPierCastTemperatureEvents } from "../../../../../lib/pierCastTemperatureEventPresentation.ts";

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

Deno.test("every event is retained from most significant to least", () => {
  const ranked = rankPierCastTemperatureEvents({
    events: [
      event("day-four", 8, "extreme"),
      event("tomorrow", 5, "major"),
      event("notable", 5, "notable"),
      event("minor", 4, "minor"),
      event("following-day", 6, "major"),
    ],
  });

  assertEquals(ranked.map((item) => item.id), [
    "day-four",
    "tomorrow",
    "following-day",
    "notable",
    "minor",
  ]);
});

Deno.test("larger changes rank first inside one severity, then time breaks ties", () => {
  const events = rankPierCastTemperatureEvents({
    events: [
      event("earlier-equal", 5, "notable", 4),
      event("largest", 8, "notable", 5),
      event("later-equal", 6, "notable", 4),
    ],
  });

  assertEquals(events.map((item) => item.id), [
    "largest",
    "earlier-equal",
    "later-equal",
  ]);
  assertEquals(rankPierCastTemperatureEvents(undefined), []);
});
