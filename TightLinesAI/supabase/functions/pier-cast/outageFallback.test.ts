import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert";
import {
  extendedFallbackArchiveTime,
  extendedFallbackCycleAgeHours,
  labelDelayedForecast,
  PIER_CAST_DELAYED_FORECAST_NOTICE,
} from "./outageFallback.ts";

Deno.test("extended outage lookup reuses the database's bounded 24-hour read", () => {
  assertEquals(
    extendedFallbackArchiveTime(new Date("2026-10-08T12:00:00Z"))
      .toISOString(),
    "2026-10-08T00:00:00.000Z",
  );
});

Deno.test("extended outage fallback is available only after 24h through 36h", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-07T12:00:00Z"),
    null,
  );
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-07T11:59:59Z"),
    24 + 1 / 3600,
  );
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-07T00:00:00Z"),
    36,
  );
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-06T23:59:59Z"),
    null,
  );
});

Deno.test("delayed forecast metadata stays inside the existing response contract", () => {
  const result = labelDelayedForecast(
    {
      generatedAt: "2026-10-08T12:00:00Z",
      disclosure: "Modeled guidance.",
      source: { cycleAgeHours: 1 },
      cities: [{ cityId: "ludington_mi" }],
    },
    "2026-10-07T06:05:00Z",
    30,
  );
  assertEquals(result.generatedAt, "2026-10-07T06:05:00Z");
  assertEquals(result.source.cycleAgeHours, 30);
  assertStringIncludes(result.disclosure, PIER_CAST_DELAYED_FORECAST_NOTICE);
  assert(result.cities.length === 1);
});
