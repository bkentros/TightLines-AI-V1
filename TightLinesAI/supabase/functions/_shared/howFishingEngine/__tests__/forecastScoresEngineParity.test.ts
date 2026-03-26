/**
 * forecast-scores calls buildSharedEngineRequestFromEnvData with the same envRecord
 * shape as get-environment / how-fishing server merge. This test locks minimal wiring.
 */
import { assertEquals } from "jsr:@std/assert";
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
    for (const context of ["freshwater_lake_pond", "freshwater_river", "coastal"] as const) {
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
    for (const context of ["freshwater_lake_pond", "freshwater_river", "coastal"] as const) {
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
