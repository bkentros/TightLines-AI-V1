/**
 * Adapter mapping tests for live get-environment payloads.
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";

Deno.test("buildFromEnvData: daily temp and precip use current historical index", () => {
  const highs = Array.from({ length: 21 }, (_, i) => 50 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 30 + i);
  const precip = Array.from({ length: 21 }, (_, i) => Number((i / 10).toFixed(2)));
  const req = buildSharedEngineRequestFromEnvData(
    41.0,
    -73.0,
    "2026-03-19",
    "America/New_York",
    "freshwater_lake_pond",
    {
      weather: {
        temperature: 64,
        pressure: 1013,
        wind_speed: 8,
        cloud_cover: 50,
        temp_7day_high: highs,
        temp_7day_low: lows,
        precip_7day_daily: precip,
        precip_7day_inches: 3.2,
      },
    },
  );

  assertEquals(req.environment.daily_mean_air_temp_f, (highs[14]! + lows[14]!) / 2);
  assertEquals(req.environment.prior_day_mean_air_temp_f, (highs[13]! + lows[13]!) / 2);
  assertEquals(req.environment.day_minus_2_mean_air_temp_f, (highs[12]! + lows[12]!) / 2);
  assertEquals(req.environment.precip_24h_in, precip[14]);
  assertEquals(req.environment.precip_72h_in, Number((precip[12]! + precip[13]! + precip[14]!).toFixed(2)));
});

Deno.test("buildFromEnvData: pressure prefers provider 48hr slice over oversized hourly history", () => {
  const req = buildSharedEngineRequestFromEnvData(
    29.0,
    -90.0,
    "2026-03-19",
    "America/Chicago",
    "coastal",
    {
      weather: {
        pressure: 1015,
        pressure_48hr: [1011, 1012, 1013],
        temperature: 72,
        wind_speed: 10,
        cloud_cover: 40,
      },
      hourly_pressure_mb: Array.from({ length: 200 }, (_, i) => ({ time_utc: `t${i}`, value: 900 + i })),
    },
  );

  assertEquals(req.environment.pressure_history_mb, [1011, 1012, 1013]);
});

Deno.test("buildFromEnvData: hourly pressure fallback trims to the most recent 48 readings", () => {
  const req = buildSharedEngineRequestFromEnvData(
    35.0,
    -97.0,
    "2026-03-19",
    "America/Chicago",
    "freshwater_river",
    {
      weather: {
        pressure: 1008,
        temperature: 61,
        wind_speed: 12,
        cloud_cover: 60,
      },
      hourly_pressure_mb: Array.from({ length: 60 }, (_, i) => ({ time_utc: `t${i}`, value: 1000 + i })),
    },
  );

  assertEquals(req.environment.pressure_history_mb?.length, 48);
  assertEquals(req.environment.pressure_history_mb?.[0], 1012);
  assertEquals(req.environment.pressure_history_mb?.[47], 1059);
});

Deno.test("buildFromEnvData: maps hourly temp and cloud to 24 local slots", () => {
  const hourly_air_temp_f: Array<{ time_utc: string; value: number }> = [];
  const hourly_cloud_cover_pct: Array<{ time_utc: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const iso = new Date(
      `2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString();
    hourly_air_temp_f.push({ time_utc: iso, value: 50 + h });
    hourly_cloud_cover_pct.push({ time_utc: iso, value: h * 2 });
  }
  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    "2026-06-15",
    "America/New_York",
    "freshwater_lake_pond",
    {
      timezone: "America/New_York",
      weather: {
        temperature: 62,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
      },
      hourly_air_temp_f,
      hourly_cloud_cover_pct,
    },
  );
  assertEquals(req.environment.hourly_air_temp_f?.length, 24);
  assertEquals(req.environment.hourly_air_temp_f?.[0], 50);
  assertEquals(req.environment.hourly_air_temp_f?.[23], 73);
  assertEquals(req.environment.hourly_cloud_cover_pct?.length, 24);
  assertEquals(req.environment.hourly_cloud_cover_pct?.[10], 20);
});

Deno.test("buildFromEnvData: sparse hourly temp adds data_coverage source_note", () => {
  const iso = new Date("2026-06-15T12:00:00-04:00").toISOString();
  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    "2026-06-15",
    "America/New_York",
    "freshwater_lake_pond",
    {
      timezone: "America/New_York",
      weather: {
        temperature: 62,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
      },
      hourly_air_temp_f: [{ time_utc: iso, value: 60 }],
      hourly_cloud_cover_pct: [{ time_utc: iso, value: 50 }],
    },
  );
  assertEquals(req.environment.hourly_air_temp_f, null);
  assertEquals(req.environment.hourly_cloud_cover_pct, null);
  assert(req.data_coverage.source_notes?.some((s) => s.includes("hourly_air_temp_f")));
  assert(req.data_coverage.source_notes?.some((s) => s.includes("hourly_cloud_cover_pct")));
});

Deno.test("buildFromEnvData: env vs request timezone mismatch is noted", () => {
  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    "2026-06-15",
    "America/Los_Angeles",
    "freshwater_lake_pond",
    {
      timezone: "America/New_York",
      weather: {
        temperature: 62,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
      },
    },
  );
  assert(
    req.data_coverage.source_notes?.some((s) => s.includes("hourly_series_timezone_mismatch")),
  );
});
