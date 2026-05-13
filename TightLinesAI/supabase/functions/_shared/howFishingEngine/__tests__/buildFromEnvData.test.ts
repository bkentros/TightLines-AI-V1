/**
 * Adapter mapping tests for live get-environment payloads.
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { buildSharedNormalizedOutput } from "../normalize/buildNormalized.ts";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";
import {
  materializeForecastEnvForDate,
  MEASURED_WATER_TEMP_KEYS,
  nextMidnightInTimeZoneMs,
  shouldUseMeasuredWaterTempForForecastReport,
} from "../../../../../lib/forecastSnapshot.ts";

Deno.test("buildFromEnvData: daily temp and precip use current historical index", () => {
  const highs = Array.from({ length: 21 }, (_, i) => 50 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 30 + i);
  const precip = Array.from(
    { length: 21 },
    (_, i) => Number((i / 10).toFixed(2)),
  );
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

  assertEquals(
    req.environment.daily_mean_air_temp_f,
    (highs[14]! + lows[14]!) / 2,
  );
  assertEquals(req.environment.daily_low_air_temp_f, lows[14]);
  assertEquals(req.environment.daily_high_air_temp_f, highs[14]);
  assertEquals(
    req.environment.prior_day_mean_air_temp_f,
    (highs[13]! + lows[13]!) / 2,
  );
  assertEquals(
    req.environment.day_minus_2_mean_air_temp_f,
    (highs[12]! + lows[12]!) / 2,
  );
  assertEquals(req.environment.precip_24h_in, precip[14]);
  assertEquals(
    req.environment.precip_72h_in,
    Number((precip[12]! + precip[13]! + precip[14]!).toFixed(2)),
  );
  const sum7 = precip.slice(8, 15).reduce((a, b) => a + b, 0);
  assertEquals(req.environment.precip_7d_in, sum7);
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
      hourly_pressure_mb: Array.from(
        { length: 200 },
        (_, i) => ({ time_utc: `t${i}`, value: 900 + i }),
      ),
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
      hourly_pressure_mb: Array.from(
        { length: 60 },
        (_, i) => ({ time_utc: `t${i}`, value: 1000 + i }),
      ),
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
  assert(
    req.data_coverage.source_notes?.some((s) =>
      s.includes("hourly_air_temp_f")
    ),
  );
  assert(
    req.data_coverage.source_notes?.some((s) =>
      s.includes("hourly_cloud_cover_pct")
    ),
  );
});

Deno.test("buildFromEnvData: daily total precipitation matches 24h — no fake rate or active flag", () => {
  const req = buildSharedEngineRequestFromEnvData(
    40.72,
    -122.41,
    "2024-10-12",
    "America/Los_Angeles",
    "freshwater_lake_pond",
    {
      weather: {
        temperature: 65,
        pressure: 1013,
        wind_speed: 8,
        cloud_cover: 40,
        precipitation: 0.05905511811023623 * 25.4, // mm = same as 0.059 in daily
        temp_7day_high: Array.from({ length: 21 }, () => 70),
        temp_7day_low: Array.from({ length: 21 }, () => 50),
        precip_7day_daily: Array.from({ length: 21 }, () => 0.06),
      },
    },
  );
  assertEquals(req.environment.precip_24h_in, 0.06);
  assertEquals(req.environment.precip_rate_now_in_per_hr, null);
  assertEquals(req.environment.active_precip_now, false);
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
    req.data_coverage.source_notes?.some((s) =>
      s.includes("hourly_series_timezone_mismatch")
    ),
  );
});

Deno.test("buildFromEnvData: calendar-day profile for today (opt) matches forecast-day scalars", () => {
  const localDate = "2026-06-15";
  const tz = "America/New_York";
  const hourly_air_temp_f: Array<{ time_utc: string; value: number }> = [];
  const hourly_cloud_cover_pct: Array<{ time_utc: string; value: number }> = [];
  const hourly_wind_speed: Array<{ time_utc: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const iso = new Date(
      `2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString();
    hourly_air_temp_f.push({ time_utc: iso, value: 50 + h });
    hourly_cloud_cover_pct.push({ time_utc: iso, value: h * 3 });
    hourly_wind_speed.push({ time_utc: iso, value: 4 });
  }

  const targetNoonIdx = (14 + 0) * 24 + 12;
  const hourly_pressure_mb: Array<{ time_utc: string; value: number }> = [];
  for (let i = 0; i <= targetNoonIdx; i++) {
    hourly_pressure_mb.push({
      time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
        .toISOString(),
      value: 1000 + i,
    });
  }

  const highs = Array.from({ length: 21 }, (_, i) => 60 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 40 + i);
  const precip = Array.from(
    { length: 21 },
    (_, i) => Number((i * 0.01).toFixed(3)),
  );

  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    localDate,
    tz,
    "freshwater_lake_pond",
    {
      timezone: tz,
      weather: {
        temperature: 999,
        pressure: 888,
        wind_speed: 777,
        cloud_cover: 666,
        pressure_48hr: [1, 2, 3],
        wind_speed_unit: "mph",
        temp_7day_high: highs,
        temp_7day_low: lows,
        precip_7day_daily: precip,
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 99),
      },
      hourly_air_temp_f,
      hourly_cloud_cover_pct,
      hourly_wind_speed,
      hourly_pressure_mb,
    },
    0,
    { useCalendarDayProfileForToday: true },
  );

  assertEquals(req.environment.current_air_temp_f, 62);
  assertEquals(
    req.environment.daily_mean_air_temp_f,
    (highs[14]! + lows[14]!) / 2,
  );
  assertEquals(
    req.environment.prior_day_mean_air_temp_f,
    (highs[13]! + lows[13]!) / 2,
  );
  assertEquals(
    req.environment.day_minus_2_mean_air_temp_f,
    (highs[12]! + lows[12]!) / 2,
  );
  assertEquals(req.environment.pressure_mb, 1000 + targetNoonIdx);
  assertEquals(req.environment.wind_speed_mph, 4);
  const cloudMean = hourly_cloud_cover_pct.reduce((s, p) => s + p.value, 0) /
    24;
  assertEquals(req.environment.cloud_cover_pct, cloudMean);
  assertEquals(req.environment.active_precip_now, false);
  assertEquals(req.environment.pressure_history_mb?.length, 48);
  assertEquals(req.environment.pressure_history_mb?.[47], 1000 + targetNoonIdx);
});

Deno.test("buildFromEnvData: dayOffset>0 uses target-day hourly aggregates, not live weather.*", () => {
  const localDate = "2026-06-17";
  const tz = "America/New_York";
  const hourly_air_temp_f: Array<{ time_utc: string; value: number }> = [];
  const hourly_cloud_cover_pct: Array<{ time_utc: string; value: number }> = [];
  const hourly_wind_speed: Array<{ time_utc: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const iso = new Date(
      `2026-06-17T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString();
    hourly_air_temp_f.push({ time_utc: iso, value: 50 + h });
    hourly_cloud_cover_pct.push({ time_utc: iso, value: h * 3 });
    hourly_wind_speed.push({ time_utc: iso, value: 4 });
  }

  const targetNoonIdx = (14 + 1) * 24 + 12;
  const hourly_pressure_mb: Array<{ time_utc: string; value: number }> = [];
  for (let i = 0; i <= targetNoonIdx; i++) {
    hourly_pressure_mb.push({
      time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
        .toISOString(),
      value: 1000 + i,
    });
  }

  const highs = Array.from({ length: 21 }, (_, i) => 60 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 40 + i);
  const precip = Array.from(
    { length: 21 },
    (_, i) => Number((i * 0.01).toFixed(3)),
  );

  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    localDate,
    tz,
    "freshwater_lake_pond",
    {
      timezone: tz,
      weather: {
        temperature: 999,
        pressure: 888,
        wind_speed: 777,
        cloud_cover: 666,
        wind_speed_unit: "mph",
        temp_7day_high: highs,
        temp_7day_low: lows,
        precip_7day_daily: precip,
        wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 99),
      },
      hourly_air_temp_f,
      hourly_cloud_cover_pct,
      hourly_wind_speed,
      hourly_pressure_mb,
    },
    1,
  );

  assertEquals(req.environment.current_air_temp_f, 62);
  assertEquals(
    req.environment.daily_mean_air_temp_f,
    (highs[15]! + lows[15]!) / 2,
  );
  assertEquals(
    req.environment.prior_day_mean_air_temp_f,
    (highs[14]! + lows[14]!) / 2,
  );
  assertEquals(
    req.environment.day_minus_2_mean_air_temp_f,
    (highs[13]! + lows[13]!) / 2,
  );
  assertEquals(req.environment.pressure_mb, 1000 + targetNoonIdx);
  assertEquals(req.environment.wind_speed_mph, 4);
  const cloudMean = hourly_cloud_cover_pct.reduce((s, p) => s + p.value, 0) /
    24;
  assertEquals(req.environment.cloud_cover_pct, cloudMean);
  assertEquals(req.environment.active_precip_now, false);
  assertEquals(req.environment.precip_rate_now_in_per_hr, null);
  assert(
    !req.data_coverage.source_notes?.some((s) =>
      s.includes("forecast_day_cloud_scalar_fallback")
    ),
  );
});

Deno.test("buildFromEnvData: calendar profile keeps noon/current separate from daily mean", () => {
  const localDate = "2026-07-10";
  const tz = "America/New_York";
  const hourly_air_temp_f = Array.from({ length: 24 }, (_, h) => ({
    time_utc: new Date(
      `2026-07-10T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString(),
    value: h === 12 ? 91 : 70,
  }));
  const highs = Array.from({ length: 21 }, () => 82);
  const lows = Array.from({ length: 21 }, () => 62);

  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    localDate,
    tz,
    "freshwater_lake_pond",
    {
      timezone: tz,
      weather: {
        temperature: 55,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
        temp_7day_high: highs,
        temp_7day_low: lows,
      },
      hourly_air_temp_f,
    },
    0,
    { useCalendarDayProfileForToday: true },
  );

  assertEquals(req.environment.current_air_temp_f, 91);
  assertEquals(req.environment.daily_mean_air_temp_f, 72);
  assertEquals(req.environment.prior_day_mean_air_temp_f, 72);
  assertEquals(req.environment.day_minus_2_mean_air_temp_f, 72);
});

Deno.test("buildFromEnvData: forecast profile daily means use same-source prior days", () => {
  const localDate = "2026-07-12";
  const tz = "America/New_York";
  const highs = Array.from({ length: 21 }, (_, i) => 70 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 50 + i);

  const req = buildSharedEngineRequestFromEnvData(
    40.7,
    -74.0,
    localDate,
    tz,
    "freshwater_lake_pond",
    {
      timezone: tz,
      weather: {
        temperature: 999,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
        temp_7day_high: highs,
        temp_7day_low: lows,
      },
    },
    2,
  );

  assertEquals(
    req.environment.daily_mean_air_temp_f,
    (highs[16]! + lows[16]!) / 2,
  );
  assertEquals(
    req.environment.prior_day_mean_air_temp_f,
    (highs[15]! + lows[15]!) / 2,
  );
  assertEquals(
    req.environment.day_minus_2_mean_air_temp_f,
    (highs[14]! + lows[14]!) / 2,
  );
  assertEquals(
    req.environment.current_air_temp_f,
    req.environment.daily_mean_air_temp_f,
  );
});

Deno.test("buildFromEnvData: coastal measured water temp is preserved and normalized as water source", () => {
  const req = buildSharedEngineRequestFromEnvData(
    29.95,
    -90.0,
    "2026-05-15",
    "America/Chicago",
    "coastal_flats_estuary",
    {
      measured_water_temp_f: 72,
      measured_water_temp_24h_ago_f: 70,
      measured_water_temp_72h_ago_f: 67,
      measured_water_temp_source: "noaa_coops",
      weather: {
        temperature: 88,
        pressure: 1013,
        wind_speed: 5,
        cloud_cover: 40,
        temp_7day_high: Array.from({ length: 21 }, () => 92),
        temp_7day_low: Array.from({ length: 21 }, () => 74),
      },
      tides: {
        phase: "incoming",
        high_low: [
          { time: "2026-05-15 03:00", type: "L", value: 0.2 },
          { time: "2026-05-15 09:00", type: "H", value: 1.8 },
        ],
      },
    },
  );

  assertEquals(req.environment.measured_water_temp_f, 72);
  assertEquals(req.environment.measured_water_temp_24h_ago_f, 70);
  assertEquals(req.environment.measured_water_temp_72h_ago_f, 67);
  assertEquals(req.environment.measured_water_temp_source, "noaa_coops");

  const normalized = buildSharedNormalizedOutput(req);
  assertEquals(
    normalized.normalized.temperature?.measurement_source,
    "coastal_water_temp",
  );
  assertEquals(normalized.normalized.temperature?.measurement_value_f, 72);
});

Deno.test("forecast snapshot cache expires at the fishing location's next local midnight", () => {
  const from = Date.parse("2026-06-15T23:30:00.000Z"); // 6:30pm in Honolulu
  const expires = nextMidnightInTimeZoneMs("Pacific/Honolulu", from);
  assertEquals(new Date(expires).toISOString(), "2026-06-16T10:00:00.000Z");

  const afterExpiry = expires + 1;
  const next = nextMidnightInTimeZoneMs("Pacific/Honolulu", afterExpiry);
  assertEquals(new Date(next).toISOString(), "2026-06-17T10:00:00.000Z");
});

Deno.test("forecast snapshot materializes target-date tides and sun without future measured water", () => {
  const env = materializeForecastEnvForDate(
    {
      coastal: true,
      nearest_tide_station_id: "base",
      measured_water_temp_f: 63,
      measured_water_temp_24h_ago_f: 62,
      measured_water_temp_72h_ago_f: 61,
      measured_water_temp_source: "noaa_coops",
      sun: { sunrise: "05:00", sunset: "20:00" },
      forecast_daily: [
        {
          date: "2026-06-15",
          sunrise_local: "05:10",
          sunset_local: "20:30",
        },
        {
          date: "2026-06-18",
          sunrise_local: "05:12",
          sunset_local: "20:32",
        },
      ],
      forecast_tides_by_date: [
        {
          date: "2026-06-18",
          station_id: "9414290",
          station_name: "San Francisco",
          unit: "ft",
          phase: "incoming",
          high_low: [
            { time: "2026-06-18 05:00", type: "L", value: 0.4 },
            { time: "2026-06-18 11:00", type: "H", value: 5.3 },
          ],
        },
      ],
    },
    "2026-06-18",
    { allowMeasuredWaterTemp: false },
  );

  assertEquals(env?.tides_available, true);
  assertEquals(
    (env?.tides as { station_id?: string } | null)?.station_id,
    "9414290",
  );
  assertEquals(
    (env?.sun as { sunrise?: string; sunset?: string } | null)?.sunrise,
    "05:12",
  );
  assertEquals(
    (env?.sun as { sunrise?: string; sunset?: string } | null)?.sunset,
    "20:32",
  );
  assertEquals(
    shouldUseMeasuredWaterTempForForecastReport({
      isForecastDay: true,
      snapshotDateForReport: "2026-06-18",
      todaySnapshotDate: "2026-06-15",
    }),
    false,
  );
  for (const key of MEASURED_WATER_TEMP_KEYS) {
    assertEquals(Object.prototype.hasOwnProperty.call(env, key), false);
  }
});

Deno.test("forecast snapshot materialization can preserve day-0 measured water when allowed", () => {
  const env = materializeForecastEnvForDate(
    {
      coastal: true,
      measured_water_temp_f: 63,
      measured_water_temp_24h_ago_f: 62,
      measured_water_temp_72h_ago_f: 61,
      measured_water_temp_source: "noaa_coops",
      forecast_daily: [
        {
          date: "2026-06-15",
          sunrise_local: "05:10",
          sunset_local: "20:30",
        },
      ],
    },
    "2026-06-15",
    { allowMeasuredWaterTemp: true },
  );

  assertEquals(
    shouldUseMeasuredWaterTempForForecastReport({
      isForecastDay: true,
      snapshotDateForReport: "2026-06-15",
      todaySnapshotDate: "2026-06-15",
    }),
    true,
  );
  assertEquals(env?.measured_water_temp_f, 63);
  assertEquals(env?.measured_water_temp_24h_ago_f, 62);
  assertEquals(env?.measured_water_temp_72h_ago_f, 61);
  assertEquals(env?.measured_water_temp_source, "noaa_coops");
});

Deno.test("buildFromEnvData: dayOffset 0..6 uses forecast snapshot daily and hourly windows", () => {
  const tz = "UTC";
  const highs = Array.from({ length: 21 }, (_, i) => 80 + i);
  const lows = Array.from({ length: 21 }, (_, i) => 40 + i);
  const precip = Array.from(
    { length: 21 },
    (_, i) => Number((i / 100).toFixed(2)),
  );
  const hourly_pressure_mb = Array.from({ length: 21 * 24 }, (_, i) => ({
    time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
      .toISOString(),
    value: 900 + i,
  }));
  const hourly_air_temp_f = Array.from({ length: 21 * 24 }, (_, i) => ({
    time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
      .toISOString(),
    value: i,
  }));
  const hourly_cloud_cover_pct = Array.from({ length: 21 * 24 }, (_, i) => ({
    time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
      .toISOString(),
    value: i % 100,
  }));
  const hourly_wind_speed = Array.from({ length: 21 * 24 }, (_, i) => ({
    time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000)
      .toISOString(),
    value: 5 + (i % 4),
  }));

  for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
    const idx = 14 + dayOffset;
    const localDate = `2026-06-${String(15 + dayOffset).padStart(2, "0")}`;
    const req = buildSharedEngineRequestFromEnvData(
      41.0,
      -73.0,
      localDate,
      tz,
      "freshwater_river",
      {
        timezone: tz,
        weather: {
          temperature: -999,
          pressure: 1013,
          wind_speed: 3,
          wind_speed_unit: "mph",
          cloud_cover: 10,
          temp_7day_high: highs,
          temp_7day_low: lows,
          precip_7day_daily: precip,
          wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 12),
        },
        hourly_pressure_mb,
        hourly_air_temp_f,
        hourly_cloud_cover_pct,
        hourly_wind_speed,
      },
      dayOffset,
      dayOffset === 0 ? { useCalendarDayProfileForToday: true } : undefined,
    );

    assertEquals(
      req.environment.daily_mean_air_temp_f,
      (highs[idx]! + lows[idx]!) / 2,
    );
    assertEquals(
      req.environment.prior_day_mean_air_temp_f,
      (highs[idx - 1]! + lows[idx - 1]!) / 2,
    );
    assertEquals(
      req.environment.day_minus_2_mean_air_temp_f,
      (highs[idx - 2]! + lows[idx - 2]!) / 2,
    );
    assertEquals(req.environment.precip_24h_in, precip[idx]);
    assertEquals(
      req.environment.precip_72h_in,
      precip.slice(idx - 2, idx + 1).reduce((a, b) => a + b, 0),
    );
    assertEquals(
      req.environment.precip_7d_in,
      precip.slice(idx - 6, idx + 1).reduce((a, b) => a + b, 0),
    );
    const targetNoonIdx = idx * 24 + 12;
    assertEquals(req.environment.pressure_history_mb?.length, 48);
    assertEquals(
      req.environment.pressure_history_mb?.[47],
      900 + targetNoonIdx,
    );
    assertEquals(req.environment.hourly_cloud_cover_pct?.length, 24);
    assertEquals(req.environment.hourly_air_temp_f?.length, 24);
    assert(
      !req.data_coverage.source_notes?.some((note) =>
        note.includes("forecast_day_cloud_scalar_fallback") ||
        note.includes("forecast_day_wind_scalar_fallback")
      ),
    );
  }
});
