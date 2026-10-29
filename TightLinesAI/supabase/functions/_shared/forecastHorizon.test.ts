import { assertEquals, assertFalse } from "jsr:@std/assert";
import {
  buildFutureForecastSlots,
  hasCompleteForecastHorizon,
  hasCompleteSnapshotHorizon,
} from "./forecastHorizon.ts";

function scoredRows(count = 7) {
  return Array.from({ length: count }, (_, day_offset) => {
    const date = new Date(Date.UTC(2026, 9, 29 + day_offset));
    return { date: date.toISOString().slice(0, 10), day_offset };
  });
}

Deno.test("complete six-day scored horizon requires today plus offsets 1..6", () => {
  const rows = [
    { date: "2026-10-29", day_offset: 0 },
    { date: "2026-10-30", day_offset: 1 },
    { date: "2026-10-31", day_offset: 2 },
    { date: "2026-11-01", day_offset: 3 },
    { date: "2026-11-02", day_offset: 4 },
    { date: "2026-11-03", day_offset: 5 },
    { date: "2026-11-04", day_offset: 6 },
  ];
  assertEquals(hasCompleteForecastHorizon(rows, 6), true);
  assertFalse(hasCompleteForecastHorizon(rows.slice(0, 5), 6));
});

Deno.test("duplicate offsets and date gaps fail the horizon contract", () => {
  const duplicate = [...scoredRows(), { date: "2026-11-04", day_offset: 6 }];
  assertFalse(hasCompleteForecastHorizon(duplicate, 6));
  const gap = scoredRows();
  gap[4] = { date: "2026-11-03", day_offset: 4 };
  assertFalse(hasCompleteForecastHorizon(gap, 6));
});

Deno.test("rebased stale snapshot with only four future days is incomplete", () => {
  const fullDaily = [
    "2026-10-27",
    "2026-10-28",
    "2026-10-29",
    "2026-10-30",
    "2026-10-31",
    "2026-11-01",
    "2026-11-02",
  ].map((date) => ({ date }));
  assertEquals(
    hasCompleteSnapshotHorizon({ forecast_daily: fullDaily }, 6),
    true,
  );
  assertFalse(
    hasCompleteSnapshotHorizon({ forecast_daily: fullDaily.slice(2) }, 6),
  );
});

Deno.test("Home presentation remains six slots when an upstream response is partial", () => {
  const slots = buildFutureForecastSlots(scoredRows(5), 6);
  assertEquals(slots.length, 6);
  assertEquals(slots.map((row) => row?.day_offset ?? null), [
    1,
    2,
    3,
    4,
    null,
    null,
  ]);
});
