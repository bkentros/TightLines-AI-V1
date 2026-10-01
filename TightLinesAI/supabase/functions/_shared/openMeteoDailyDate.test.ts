import { assertEquals } from "jsr:@std/assert";
import { openMeteoDailyDate } from "./openMeteo14DayFetch.ts";
Deno.test("Open-Meteo daily axis retains November dates across DST (captured provider sample)", () => {
  const sample = JSON.parse(
    Deno.readTextFileSync(
      new URL(
        "../../../docs/audits/todays-bite-pass3/provider-weather.json",
        import.meta.url,
      ),
    ),
  );
  const dates = sample.daily.time.map((sec: number) =>
    openMeteoDailyDate(sec, sample.utc_offset_seconds)
  );
  assertEquals(dates.length, 22);
  for (let i = 0; i < dates.length; i++) {
    assertEquals(
      dates[i],
      new Date(Date.UTC(2025, 9, 20 + i)).toISOString().slice(0, 10),
    );
  }
});
Deno.test("Open-Meteo daily axis supports winter western and eastern offsets", () => {
  assertEquals(
    openMeteoDailyDate(Date.parse("2026-01-15T05:00:00Z") / 1000, -18000),
    "2026-01-15",
  );
  assertEquals(
    openMeteoDailyDate(Date.parse("2026-01-14T15:00:00Z") / 1000, 32400),
    "2026-01-15",
  );
});

Deno.test("Open-Meteo adapter preserves captured daily labels and hourly instants", async () => {
  const { fetchOpenMeteo14Day } = await import("./openMeteo14DayFetch.ts");
  const sample = JSON.parse(
    Deno.readTextFileSync(
      new URL(
        "../../../docs/audits/todays-bite-pass3/provider-weather.json",
        import.meta.url,
      ),
    ),
  );
  const originalFetch = globalThis.fetch;
  sample.current = {
    time: sample.hourly.time[14 * 24 + 12],
    temperature_2m: sample.hourly.temperature_2m[14 * 24 + 12],
    pressure_msl: sample.hourly.pressure_msl[14 * 24 + 12],
    wind_speed_10m: sample.hourly.wind_speed_10m[14 * 24 + 12],
    cloud_cover: sample.hourly.cloud_cover[14 * 24 + 12],
  };
  globalThis.fetch = () =>
    Promise.resolve(new Response(JSON.stringify(sample), { status: 200 }));
  try {
    const result = await fetchOpenMeteo14Day(30.4383, -84.2807, "imperial");
    assertEquals(result?.forecast_daily?.map((day) => day.date), [
      "2025-11-03",
      "2025-11-04",
      "2025-11-05",
      "2025-11-06",
      "2025-11-07",
      "2025-11-08",
      "2025-11-09",
    ]);
    assertEquals(
      result?.hourly_pressure_mb?.[0]?.time_utc,
      new Date(sample.hourly.time[0] * 1000).toISOString(),
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
