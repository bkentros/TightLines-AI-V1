/**
 * forecast-scores calls buildSharedEngineRequestFromEnvData with the same envRecord
 * shape as get-environment / how-fishing server merge. This test locks minimal wiring.
 */
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";
import { runHowFishingScoreOnly } from "../runHowFishingReport.ts";

Deno.test("forecast-scores envRecord shape: engine runs for day_offset 0 and 1", () => {
  const baseWeather = {
    temperature: 72,
    humidity: 55,
    cloud_cover: 40,
    pressure: 1012,
    wind_speed: 8,
    wind_direction: 200,
    precipitation: 0,
    gust_speed: null as number | null,
    temp_unit: "°F",
    wind_speed_unit: "mph",
    temp_7day_high: Array.from({ length: 21 }, () => 75),
    temp_7day_low: Array.from({ length: 21 }, () => 55),
    precip_7day_daily: Array.from({ length: 21 }, () => 0),
    wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 12),
  };

  const envRecord: Record<string, unknown> = {
    timezone: "America/Chicago",
    tz_offset_hours: -6,
    weather: baseWeather,
    hourly_pressure_mb: [],
    hourly_air_temp_f: [],
    hourly_cloud_cover_pct: [],
    hourly_wind_speed: [],
  };

  for (const dayOffset of [0, 1] as const) {
    for (const context of [
      "freshwater_lake_pond",
      "freshwater_river",
      "coastal",
      "coastal_flats_estuary",
    ] as const) {
      const req = buildSharedEngineRequestFromEnvData(
        41.88,
        -87.63,
        "2026-07-01",
        "America/Chicago",
        context,
        envRecord,
        dayOffset,
      );
      const score = runHowFishingScoreOnly(req);
      assertEquals(typeof score, "number");
      assertEquals(score >= 0 && score <= 100, true);
    }
  }
});

Deno.test("forecast-scores: clone baseReq + context matches full build per context", () => {
  const baseWeather = {
    temperature: 72,
    humidity: 55,
    cloud_cover: 40,
    pressure: 1012,
    wind_speed: 8,
    wind_direction: 200,
    precipitation: 0,
    gust_speed: null as number | null,
    temp_unit: "°F",
    wind_speed_unit: "mph",
    temp_7day_high: Array.from({ length: 21 }, () => 75),
    temp_7day_low: Array.from({ length: 21 }, () => 55),
    precip_7day_daily: Array.from({ length: 21 }, () => 0.1),
    wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 12),
  };

  const envRecord: Record<string, unknown> = {
    timezone: "America/Chicago",
    tz_offset_hours: -6,
    weather: baseWeather,
    hourly_pressure_mb: [],
    hourly_air_temp_f: [],
    hourly_cloud_cover_pct: [],
    hourly_wind_speed: [],
  };

  const lat = 41.88;
  const lon = -87.63;
  const localDate = "2026-07-01";
  const tz = "America/Chicago";

  for (const dayOffset of [0, 1] as const) {
    const baseReq = buildSharedEngineRequestFromEnvData(
      lat,
      lon,
      localDate,
      tz,
      "freshwater_lake_pond",
      envRecord,
      dayOffset,
    );
    for (const context of [
      "freshwater_lake_pond",
      "freshwater_river",
      "coastal",
      "coastal_flats_estuary",
    ] as const) {
      const cloned =
        context === "freshwater_lake_pond" ? baseReq : { ...baseReq, context };
      const full = buildSharedEngineRequestFromEnvData(
        lat,
        lon,
        localDate,
        tz,
        context,
        envRecord,
        dayOffset,
      );
      assertEquals(runHowFishingScoreOnly(cloned), runHowFishingScoreOnly(full));
    }
  }
});

Deno.test("forecast-scores day 0 matches live report path instead of calendar-day fallback", () => {
  const localDate = "2026-06-15";
  const hourlyAirTempF: Array<{ time_utc: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const iso = new Date(
      `2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString();
    hourlyAirTempF.push({ time_utc: iso, value: 50 + h });
  }
  const targetNoonIdx = 14 * 24 + 12;
  const hourlyPressureMb: Array<{ time_utc: string; value: number }> = [];
  for (let i = 0; i <= targetNoonIdx; i++) {
    hourlyPressureMb.push({
      time_utc: new Date(Date.UTC(2026, 5, 1, 0, 0, 0) + i * 3600 * 1000).toISOString(),
      value: 1000 + i,
    });
  }

  const envRecord: Record<string, unknown> = {
    timezone: "America/Detroit",
    tz_offset_hours: -4,
    weather: {
      temperature: 47,
      humidity: 70,
      cloud_cover: 100,
      pressure: 1008,
      wind_speed: 6,
      wind_direction: 120,
      precipitation: 0,
      gust_speed: null as number | null,
      temp_unit: "°F",
      wind_speed_unit: "mph",
      pressure_48hr: Array.from({ length: 48 }, () => 1008),
      temp_7day_high: Array.from({ length: 21 }, (_, i) => 60 + i),
      temp_7day_low: Array.from({ length: 21 }, (_, i) => 40 + i),
      precip_7day_daily: Array.from({ length: 21 }, () => 0),
      wind_speed_10m_max_daily: Array.from({ length: 21 }, () => 10),
    },
    hourly_pressure_mb: hourlyPressureMb,
    hourly_air_temp_f: hourlyAirTempF,
    hourly_cloud_cover_pct: [],
    hourly_wind_speed: [],
  };

  const liveReq = buildSharedEngineRequestFromEnvData(
    44.3,
    -84.67,
    localDate,
    "America/Detroit",
    "freshwater_lake_pond",
    envRecord,
    0,
  );
  const legacyCalendarReq = buildSharedEngineRequestFromEnvData(
    44.3,
    -84.67,
    localDate,
    "America/Detroit",
    "freshwater_lake_pond",
    envRecord,
    0,
    { useCalendarDayProfileForToday: true },
  );

  assertEquals(liveReq.environment.current_air_temp_f, 47);
  assertEquals(legacyCalendarReq.environment.current_air_temp_f, 62);
  assertNotEquals(
    runHowFishingScoreOnly(legacyCalendarReq),
    runHowFishingScoreOnly(liveReq),
  );
});
