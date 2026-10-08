import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert";
import {
  extendedFallbackArchiveTimes,
  extendedFallbackCycleAgeHours,
  forecastHorizonIncludes,
  labelDelayedForecast,
  PIER_CAST_DELAYED_FORECAST_NOTICE,
  PIER_CAST_EXPIRED_FORECAST_MESSAGE,
} from "./outageFallback.ts";

Deno.test("extended outage lookup covers both older windows with bounded 24-hour reads", () => {
  assertEquals(
    extendedFallbackArchiveTimes(new Date("2026-10-08T12:00:00Z"))
      .map((value) => value.toISOString()),
    ["2026-10-07T12:00:00.000Z", "2026-10-06T12:00:00.000Z"],
  );
});

Deno.test("fallback age boundaries preserve 13h and 24h behavior then allow through 72h", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-07T23:00:00Z"),
    null,
  );
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
    extendedFallbackCycleAgeHours(now, "2026-10-06T12:00:00Z"),
    48,
  );
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-05T12:00:00Z"),
    72,
  );
  assertEquals(
    extendedFallbackCycleAgeHours(now, "2026-10-05T11:59:59Z"),
    null,
  );
});

Deno.test("fallback is rejected when any city forecast horizon has expired", () => {
  const batch = (validAt: string) => ({
    cities: [{
      status: "available" as const,
      samples: [{ validAt }],
    }],
  });
  const now = new Date("2026-10-08T12:00:00Z");
  assertEquals(
    forecastHorizonIncludes(batch("2026-10-08T12:00:00Z"), now),
    true,
  );
  assertEquals(
    forecastHorizonIncludes(batch("2026-10-08T11:59:59Z"), now),
    false,
  );
  assertEquals(
    forecastHorizonIncludes({
      cities: [{ status: "unavailable" as const, samples: [] }],
    }, now),
    false,
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
  assertEquals(
    PIER_CAST_EXPIRED_FORECAST_MESSAGE,
    "NOAA's forecast is delayed and the latest safe PierCast forecast has expired.",
  );
});
