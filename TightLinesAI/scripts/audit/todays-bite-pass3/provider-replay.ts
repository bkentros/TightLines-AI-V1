import { openMeteoDailyDate } from "../../../supabase/functions/_shared/openMeteo14DayFetch.ts";
/** Replay the approved captured public sample offline. Reanalysis is not a catch-outcome test. */
import { buildSharedEngineRequestFromEnvData } from "../../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import {
  runHowFishingReport,
  runHowFishingScoreOnly,
} from "../../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import { analyzeSharedConditions } from "../../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { runDailyPicksSurface } from "../../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts";
const data = JSON.parse(
  await Deno.readTextFile(
    "docs/audits/todays-bite-pass3/provider-weather.json",
  ),
);
const { runHowFishingReport: previous } = await import(
  `file://${Deno.args[0]}/howFishingEngine/runHowFishingReport.ts`
);
const { buildSharedEngineRequestFromEnvData: oldBuild } = await import(
  `file://${Deno.args[0]}/howFishingEngine/request/buildFromEnvData.ts`
);
const daily = data.daily, hourly = data.hourly;
const local = (sec: number) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(sec * 1000)).replace(" ", "T");
const series = (name: string) =>
  hourly.time.map((sec: number, i: number) => ({
    time_utc: new Date(sec * 1000).toISOString(),
    value: hourly[name][i],
  }));
const reports = [];
let recommendations = 0;
// 14 preceding days plus a seven-day target window, matching the app's indexing.
const env = {
  timezone: "America/New_York",
  fetched_at: new Date(hourly.time[14 * 24 + 12] * 1000).toISOString(),
  weather: {
    temp_7day_high: daily.temperature_2m_max.slice(0, 21),
    temp_7day_low: daily.temperature_2m_min.slice(0, 21),
    precip_7day_daily: daily.precipitation_sum.slice(0, 21).map((x: number) =>
      x / 25.4
    ),
    wind_speed_unit: "mph",
    precipitation: 0,
  },
  hourly_pressure_mb: series("pressure_msl"),
  hourly_air_temp_f: series("temperature_2m"),
  hourly_cloud_cover_pct: series("cloud_cover"),
  hourly_wind_speed: series("wind_speed_10m"),
  hourly_precipitation_in: series("precipitation").map((
    x: { time_utc: string; value: number },
  ) => ({ ...x, value: x.value / 25.4 })),
  forecast_daily: daily.time.slice(14, 21).map((sec: number, i: number) => ({
    date: openMeteoDailyDate(sec, data.utc_offset_seconds),
    sunrise_local: local(daily.sunrise[i + 14]),
    sunset_local: local(daily.sunset[i + 14]),
  })),
};
for (let offset = 0; offset < 7; offset++) {
  for (
    const context of [
      "freshwater_lake_pond",
      "freshwater_river",
      "coastal",
      "coastal_flats_estuary",
    ] as const
  ) {
    const date = env.forecast_daily[offset].date;
    const req = buildSharedEngineRequestFromEnvData(
      30.4383,
      -84.2807,
      date,
      env.timezone,
      context,
      env,
      offset,
      { useCalendarDayProfileForToday: true },
    );
    const old = oldBuild(
      30.4383,
      -84.2807,
      date,
      env.timezone,
      context,
      env,
      offset,
      { useCalendarDayProfileForToday: true },
    );
    const report = runHowFishingReport(req);
    if (report.score !== runHowFishingScoreOnly(req)) {
      throw Error("Report/forecast parity");
    }
    if (!Number.isFinite(report.score)) throw Error("Invalid score");
    const analysis = analyzeSharedConditions(req);
    const picks = [];
    if (!context.startsWith("coastal")) {
      for (const goal of ["all_purpose", "big_fish"] as const) {
        const response = runDailyPicksSurface({
          location: {
            latitude: req.latitude,
            longitude: req.longitude,
            state_code: req.state_code!,
            region_key: req.region_key,
            local_date: date,
            local_timezone: env.timezone,
            month: Number(date.slice(5, 7)),
          },
          species: "largemouth_bass",
          context,
          water_clarity: "clear",
          recommendation_goal: goal,
          env_data: req.environment,
        }, {
          seed: `provider|${date}|${context}|${goal}`,
          variant: "A",
          analysis,
        });
        if (
          response.scenario_summary.surface_daily_gate === "closed" &&
          Object.values(response.picks).some((p) => p.is_surface)
        ) {
          throw Error("Surface gate");
        }
        picks.push({
          goal,
          scenario: response.scenario_summary,
          ids: Object.values(response.picks).map((p) => p.id),
        });
        recommendations++;
      }
    }
    reports.push({
      date,
      context,
      pass1: previous(old).score,
      final: report.score,
      temperature: req.environment.daily_mean_air_temp_f,
      pressure: analysis.norm.normalized.pressure_regime,
      picks,
    });
  }
}
await Deno.writeTextFile(
  "docs/audits/todays-bite-pass3/provider-replay.json",
  JSON.stringify(
    {
      source:
        "Open-Meteo historical reanalysis; Tallahassee Oct 20-Nov 10 2025. Target dates recorded below; no catch observations or measured water/tide data.",
      cases: reports.length,
      recommendation_sets: recommendations,
      reports,
    },
    null,
    2,
  ) + "\n",
);
console.log({ cases: reports.length, recommendations });
