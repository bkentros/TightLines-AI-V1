import { assertEquals } from "jsr:@std/assert";
import {
  buildEnvironmentSnapshotKey,
  hasSufficientHourlyWeather,
  localDateFromUtcIso,
  mergeEnvironmentWithSnapshot,
} from "./cache.ts";

Deno.test("cache: snapshot key rounds to stable 2-decimal buckets", () => {
  const key = buildEnvironmentSnapshotKey(27.9349, -82.4931, "imperial", "2026-03-30");
  assertEquals(key, "27.93:-82.49:imperial:2026-03-30");
});

Deno.test("cache: local date respects timezone offset", () => {
  assertEquals(localDateFromUtcIso("2026-03-30T02:30:00.000Z", -4), "2026-03-29");
  assertEquals(localDateFromUtcIso("2026-03-30T23:30:00.000Z", 9), "2026-03-31");
});

Deno.test("cache: sufficient hourly weather requires both temp and cloud", () => {
  const mk = (n: number) => Array.from({ length: n }, (_, i) => ({ time_utc: `t${i}`, value: i }));
  assertEquals(hasSufficientHourlyWeather({
    weather_available: false,
    tides_available: false,
    moon_available: false,
    sun_available: false,
    fetched_at: "2026-03-30T00:00:00.000Z",
    hourly_air_temp_f: mk(12),
    hourly_cloud_cover_pct: mk(12),
  }), true);
  assertEquals(hasSufficientHourlyWeather({
    weather_available: false,
    tides_available: false,
    moon_available: false,
    sun_available: false,
    fetched_at: "2026-03-30T00:00:00.000Z",
    hourly_air_temp_f: mk(11),
    hourly_cloud_cover_pct: mk(12),
  }), false);
});

Deno.test("cache: merge only fills live holes from snapshot", () => {
  const cached = {
    weather_available: true,
    tides_available: true,
    moon_available: true,
    sun_available: true,
    weather: { temperature: 70 },
    tides: { station_id: "abc" },
    moon: { phase: "Full Moon" },
    sun: { sunrise: "07:00", sunset: "19:00" },
    solunar: { major_periods: [{ start: "06:00", end: "08:00" }] },
    fetched_at: "2026-03-30T00:00:00.000Z",
    timezone: "America/New_York",
    tz_offset_hours: -4,
    hourly_air_temp_f: Array.from({ length: 24 }, (_, i) => ({ time_utc: `t${i}`, value: 60 + i })),
    hourly_cloud_cover_pct: Array.from({ length: 24 }, (_, i) => ({ time_utc: `t${i}`, value: 40 })),
    tide_predictions_30day: [{ date: "2026-03-30", high_ft: 1.2, low_ft: 0.2 }],
    measured_water_temp_f: 68,
    measured_water_temp_source: "noaa_coops",
    measured_water_temp_24h_ago_f: 67,
    measured_water_temp_72h_ago_f: 66,
    coastal: true,
    nearest_tide_station_id: "abc",
  };
  const live = {
    weather_available: true,
    tides_available: false,
    moon_available: false,
    sun_available: false,
    weather: { temperature: 72 },
    fetched_at: "2026-03-30T01:00:00.000Z",
    hourly_air_temp_f: [],
    hourly_cloud_cover_pct: [],
  };

  const merged = mergeEnvironmentWithSnapshot(live, cached);
  assertEquals(merged.weather, { temperature: 72 });
  assertEquals(merged.tides_available, true);
  assertEquals(merged.measured_water_temp_f, 68);
  assertEquals(merged.hourly_air_temp_f?.length, 24);
  assertEquals(merged.sun_available, true);
  assertEquals(merged.source_notes, [
    "snapshot_fallback:hourly_weather",
    "snapshot_fallback:sun",
    "snapshot_fallback:moon_solunar",
    "snapshot_fallback:tides",
    "snapshot_fallback:water_temp",
  ]);
});
