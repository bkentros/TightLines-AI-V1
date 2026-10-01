import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import { buildPierCastFullDayWindow, buildPierCastSixHourIntervals } from "../scoring/dateWindows.ts";
import { buildPierCastSixHourScores } from "../scoring/timeWindows.ts";

Deno.test("six-hour blocks follow local wall time across both daylight-saving changes", () => {
  const spring = buildPierCastSixHourIntervals({
    localDate: "2026-03-08",
    timezone: "America/Detroit",
  });
  const fall = buildPierCastSixHourIntervals({
    localDate: "2026-11-01",
    timezone: "America/Chicago",
  });
  assertEquals(spring.length, 4);
  assertEquals(fall.length, 4);
  assertEquals((Date.parse(spring[0].end) - Date.parse(spring[0].start)) / 3600000, 5);
  assertEquals((Date.parse(fall[0].end) - Date.parse(fall[0].start)) / 3600000, 7);
  for (const slots of [spring, fall]) {
    for (let index = 1; index < 4; index += 1) {
      assertEquals(slots[index - 1].end, slots[index].start);
    }
  }
});

Deno.test("current block scores only remaining hours with interpolated endpoints", () => {
  const window = buildPierCastFullDayWindow({
    localDate: "2026-09-16",
    timezone: "America/Chicago",
  });
  const scores = buildPierCastSixHourScores({
    window,
    evaluatedAt: "2026-09-16T13:00:00.000Z", // 8 AM Central
    segments: [
      {
        start: "2026-09-16T11:00:00.000Z",
        end: "2026-09-16T14:00:00.000Z",
        scoreAtStart: 4,
        scoreAtEnd: 8,
      },
      {
        start: "2026-09-16T14:00:00.000Z",
        end: "2026-09-16T17:00:00.000Z",
        scoreAtStart: 8,
        scoreAtEnd: 8,
      },
    ],
  });
  assertEquals(scores.map((score) => score.phase), ["past", "current", "upcoming", "upcoming"]);
  assertEquals(scores[0].biological.status, "unavailable");
  assertEquals(scores[1].assessedInterval?.start, "2026-09-16T13:00:00.000Z");
  assertEquals(scores[1].biological.status, "available");
  assertAlmostEquals(scores[1].biological.score!, 47 / 6, 0.000001);
  assertEquals(scores[2].biological.status, "unavailable");
  assertEquals(scores[2].coverage?.status, "none");
});

Deno.test("a missing hour makes only its affected block unavailable", () => {
  const window = buildPierCastFullDayWindow({
    localDate: "2026-09-17",
    timezone: "America/Chicago",
  });
  const scores = buildPierCastSixHourScores({
    window,
    evaluatedAt: "2026-09-16T20:00:00.000Z",
    segments: [
      { start: "2026-09-17T05:00:00.000Z", end: "2026-09-17T11:00:00.000Z", scoreAtStart: 6, scoreAtEnd: 6 },
      { start: "2026-09-17T11:00:00.000Z", end: "2026-09-17T14:00:00.000Z", scoreAtStart: 7, scoreAtEnd: 7 },
      { start: "2026-09-17T15:00:00.000Z", end: "2026-09-17T17:00:00.000Z", scoreAtStart: 7, scoreAtEnd: 7 },
    ],
  });
  assertEquals(scores[0].biological.status, "available");
  assertEquals(scores[1].biological.status, "unavailable");
  assertEquals(scores[1].coverage?.status, "partial");
});
