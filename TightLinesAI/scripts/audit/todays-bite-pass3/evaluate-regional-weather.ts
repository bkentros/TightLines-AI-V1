import { materializeForecastEnvForDate } from "../../../lib/forecastSnapshot.ts";
/** Offline three-generation evaluation of frozen public reanalysis. No catch-accuracy inference. */
import { openMeteoDailyDate } from "../../../supabase/functions/_shared/openMeteo14DayFetch.ts";
const dir = "docs/audits/todays-bite-pass3";
const outputDir = Deno.args[2] ?? dir;
await Deno.mkdir(outputDir, { recursive: true });
const bytes = await Deno.readFile(`${dir}/regional-weather.json.gz`);
const manifest = JSON.parse(
  await Deno.readTextFile(`${dir}/regional-weather.manifest.json`),
);
const sha = Array.from(
  new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
).map((x) => x.toString(16).padStart(2, "0")).join("");
if (sha !== manifest.sha256) throw Error("Weather checksum mismatch");
const capture = JSON.parse(
  await new Response(
    new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip")),
  ).text(),
);
const paths = [
  Deno.args[0],
  Deno.args[1],
  new URL("../../../supabase/functions/_shared/", import.meta.url).pathname,
];
if (paths.some((p) => !p)) {
  throw Error("Provide original and Pass 1 _shared paths");
}
const engines = await Promise.all(paths.map(async (root) => ({
  build: (await import(
    `file://${root}/howFishingEngine/request/buildFromEnvData.ts`
  )).buildSharedEngineRequestFromEnvData,
  report:
    (await import(`file://${root}/howFishingEngine/runHowFishingReport.ts`))
      .runHowFishingReport,
  score:
    (await import(`file://${root}/howFishingEngine/runHowFishingReport.ts`))
      .runHowFishingScoreOnly,
  analysis:
    (await import(`file://${root}/howFishingEngine/analyzeSharedConditions.ts`))
      .analyzeSharedConditions,
  rec: (await import(
    `file://${root}/recommenderEngine/dailyPicks/runDailyPicksSurface.ts`
  )).runDailyPicksSurface,
})));
const reports: any[] = [];
const picks: any[] = [];
const violations: any[] = [];
const check = (ok: boolean, id: string, rule: string) => {
  if (!ok) violations.push({ id, rule });
};
for (const row of capture.rows) {
  const { data, timezone } = row;
  const { daily, hourly } = data;
  const local = (sec: number) =>
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(new Date(sec * 1000)).replace(" ", "T");
  const series = (name: string, scale = 1) =>
    hourly.time.map((sec: number, i: number) => ({
      time_utc: new Date(sec * 1000).toISOString(),
      value: hourly[name][i] == null ? null : hourly[name][i] * scale,
    }));
  const env = {
    timezone,
    fetched_at: new Date(hourly.time[14 * 24 + 12] * 1000).toISOString(),
    weather: {
      temp_7day_high: daily.temperature_2m_max,
      temp_7day_low: daily.temperature_2m_min,
      precip_7day_daily: daily.precipitation_sum.map((x: number | null) =>
        x == null ? null : x / 25.4
      ),
      wind_speed_unit: "mph",
    },
    hourly_pressure_mb: series("pressure_msl"),
    hourly_air_temp_f: series("temperature_2m"),
    hourly_cloud_cover_pct: series("cloud_cover"),
    hourly_wind_speed: series("wind_speed_10m"),
    hourly_precipitation_in: series("precipitation", 1 / 25.4),
    forecast_daily: daily.time.slice(14).map((sec: number, i: number) => ({
      date: openMeteoDailyDate(sec, data.utc_offset_seconds),
      sunrise_local: local(daily.sunrise[14 + i]),
      sunset_local: local(daily.sunset[14 + i]),
    })),
  };
  const dayKeys = hourly.time.map((sec: number) => local(sec).slice(0, 10));
  for (let offset = 0; offset < 7; offset++) {
    const date = env.forecast_daily[offset].date;
    const dayEnv: any = materializeForecastEnvForDate(env, date, {
      allowMeasuredWaterTemp: offset === 0,
    });
    // These series are consumed only for the target local day. Keep pressure's
    // complete history, and prove this optimization against full inputs below.
    const reduced: any = { ...dayEnv };
    for (
      const key of [
        "hourly_air_temp_f",
        "hourly_cloud_cover_pct",
        "hourly_wind_speed",
        "hourly_precipitation_in",
      ]
    ) {
      reduced[key] = dayEnv[key].filter((_: unknown, i: number) =>
        dayKeys[i] === date
      );
    }
    const baseRequests = engines.map((engine) =>
      engine.build(
        row.latitude,
        row.longitude,
        date,
        timezone,
        "freshwater_lake_pond",
        reduced,
        offset,
        { useCalendarDayProfileForToday: true },
      )
    );
    if (offset === 0) {
      for (let i = 0; i < engines.length; i++) {
        const full = engines[i].build(
          row.latitude,
          row.longitude,
          date,
          timezone,
          "freshwater_lake_pond",
          dayEnv,
          offset,
          { useCalendarDayProfileForToday: true },
        );
        if (
          JSON.stringify(full) !== JSON.stringify(baseRequests[i])
        ) throw Error("Hourly pruning changed normalized request");
      }
    }

    for (
      const context of [
        "freshwater_lake_pond",
        "freshwater_river",
        "coastal",
        "coastal_flats_estuary",
      ]
    ) {
      const date = env.forecast_daily[offset].date;
      const id = `${row.city}|${date}|${context}`;
      const versions = engines.map((engine, i) => {
        const req = { ...baseRequests[i], context };
        const report = engine.report(req);
        const analysis = engine.analysis(req);
        return { req, report, analysis };
      });
      const final = versions[2];
      const norm = final.analysis.norm;
      const t = norm.normalized.temperature;
      check(
        final.report.score === engines[2].score(final.req),
        id,
        "score/report parity",
      );
      check(
        Number.isInteger(final.report.score) && final.report.score >= 0 &&
          final.report.score <= 100,
        id,
        "finite score",
      );
      if (norm.reliability !== "high") {
        check(final.report.score <= 72, id, "confidence cap");
      }
      if (norm.missing_variables.length || norm.data_gaps.length) {
        check(final.report.score <= 64, id, "missing cap");
      }
      if (t?.shock_label !== "none") {
        check(
          t?.regional_calibration_adjustment === 0,
          id,
          "shock has no regional relief",
        );
      }
      // Same daily temperatures on the next calendar day: isolates model calendar sensitivity.
      const nextDate = new Date(Date.parse(date + "T12:00:00Z") + 86400000)
        .toISOString().slice(0, 10);
      const calendar = versions.map((v, i) => {
        const req = structuredClone(v.req);
        req.local_date = nextDate;
        for (const key of ["sunrise_local", "sunset_local"]) {
          if (typeof req.environment[key] === "string") {
            req.environment[key] = req.environment[key].replace(date, nextDate);
          }
        }
        return Math.abs(engines[i].report(req).score - v.report.score);
      });
      reports.push({
        id,
        city: row.city,
        season: row.season,
        date,
        context,
        offset,
        air_mean_f: final.req.environment.daily_mean_air_temp_f,
        prior_air_mean_f: final.req.environment.prior_day_mean_air_temp_f,
        calendar_delta: calendar,
        versions: versions.map((v) => ({
          score: v.report.score,
          band: v.report.band,
          region: v.req.region_key,
          state: v.req.state_code,
          reliability: v.report.reliability,
          temperature: v.analysis.norm.normalized.temperature,
          pressure: v.analysis.norm.normalized.pressure_regime,
          timing: v.report.daypart_preset,
          missing: v.analysis.norm.missing_variables,
        })),
      });
      if (context.startsWith("coastal")) {
        continue;
      }
      for (
        const species of [
          "largemouth_bass",
          "smallmouth_bass",
          "pike_musky",
          "river_trout",
        ]
      ) {
        if (
          species === "river_trout" && context !== "freshwater_river"
        ) continue;
        for (const goal of ["all_purpose", "big_fish"]) {
          const results = versions.map((v, i) => {
            const req = v.req;
            try {
              const response = engines[i].rec({
                location: {
                  latitude: req.latitude,
                  longitude: req.longitude,
                  state_code: req.state_code,
                  region_key: req.region_key,
                  local_date: date,
                  local_timezone: timezone,
                  month: Number(date.slice(5, 7)),
                },
                species,
                context,
                water_clarity: goal === "all_purpose" ? "clear" : "stained",
                recommendation_goal: goal,
                env_data: req.environment,
              }, {
                seed: `regional|${id}|${species}|${goal}`,
                variant: "A",
                analysis: v.analysis,
              });
              return {
                scenario: response.scenario_summary,
                picks: Object.values(response.picks).map((p: any) => ({
                  id: p.id,
                  surface: p.is_surface,
                  column: p.column,
                  pace: p.primary_pace,
                })),
                pools: response.diagnostics.hard_gated_lure_candidate_count,
              };
            } catch (e) {
              if (
                e instanceof Error &&
                e.name === "DailyPicksSeasonalRowMissingError"
              ) return null;
              throw e;
            }
          });
          const result = results[2];
          check(
            !results[0] || !!result,
            id + "|" + species,
            "no original coverage lost",
          );
          check(
            !results[1] || !!result,
            id + "|" + species,
            "no Pass 1 coverage lost",
          );
          if (!result) continue;
          check(
            result.picks.length === 4 &&
              new Set(result.picks.map((p) => p.id)).size === 4,
            id,
            "four distinct picks",
          );
          if (result.scenario.surface_daily_gate === "closed") {
            check(!result.picks.some((p) => p.surface), id, "surface gate");
          }
          if (
            species !== "river_trout" && t?.band_label === "very_warm" &&
            t.final_score > .5
          ) {
            check(
              !result.scenario.scenario_tags.includes("heat_finesse"),
              id,
              "favorable warmth not heat",
            );
          }
          picks.push({ id, species, goal, versions: results });
        }
      }
    }
  }
  console.log(
    `Evaluated ${row.city}/${row.season}: ${reports.length} reports, ${picks.length} recommendation sets`,
  );
}
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
function compare(index: number, rows = reports) {
  const deltas = rows.map((r) => r.versions[2].score - r.versions[index].score);
  return {
    cases: rows.length,
    changed_scores: deltas.filter((d) => d !== 0).length,
    mean_delta: deltas.reduce((a, b) => a + b, 0) / rows.length,
    max_increase: Math.max(...deltas),
    max_decrease: Math.min(...deltas),
    changed_bands:
      rows.filter((r) => r.versions[index].band !== r.versions[2].band).length,
  };
}
function recCompare(index: number) {
  const matched = picks.filter((p) => p.versions[index]);
  return {
    matched: matched.length,
    added: picks.length - matched.length,
    changed_picks: matched.filter((p) =>
      !same(
        p.versions[index].picks.map((x: any) => x.id),
        p.versions[2].picks.map((x: any) => x.id),
      )
    ).length,
    changed_activity:
      matched.filter((p) =>
        p.versions[index].scenario.activity_level !==
          p.versions[2].scenario.activity_level
      ).length,
    changed_surface:
      matched.filter((p) =>
        p.versions[index].scenario.surface_daily_gate !==
          p.versions[2].scenario.surface_daily_gate
      ).length,
    changed_colors:
      matched.filter((p) =>
        p.versions[index].scenario.color_palette_theme !==
          p.versions[2].scenario.color_palette_theme
      ).length,
  };
}
const calendar = engines.map((_, i) => {
  const values = reports.map((r) => r.calendar_delta[i]).sort((a, b) => a - b);
  return {
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    max: values.at(-1),
    p95: values[Math.floor(values.length * .95)],
    over10: values.filter((v) => v > 10).length,
  };
});
const summary = {
  version_order: ["original", "pass1", "final"],
  provider_snapshots: capture.rows.length,
  cases: reports.length,
  recommendation_sets: picks.length,
  original_to_final: compare(0),
  pass1_to_final: compare(1),
  original_recommendations: recCompare(0),
  pass1_recommendations: recCompare(1),
  calendar_counterfactual: calendar,
  by_city: Object.fromEntries(
    [...new Set(reports.map((r) => r.city))].map(
      (city) => [city, compare(0, reports.filter((r) => r.city === city))],
    ),
  ),
  by_season: Object.fromEntries(
    [...new Set(reports.map((r) => r.season))].map(
      (season) => [
        season,
        compare(0, reports.filter((r) => r.season === season)),
      ],
    ),
  ),
  violations,
  largest_changes: [...reports].sort((a, b) =>
    Math.abs(b.versions[2].score - b.versions[0].score) -
    Math.abs(a.versions[2].score - a.versions[0].score)
  ).slice(0, 15),
  calendar_worse: reports.filter((r) =>
    r.calendar_delta[2] > r.calendar_delta[0] + 3
  ),
};
await Deno.writeTextFile(
  `${outputDir}/regional-evaluation.json`,
  JSON.stringify(summary, null, 2) + "\n",
);
const zipped = new Blob([JSON.stringify({ reports, recommendations: picks })])
  .stream().pipeThrough(new CompressionStream("gzip"));
await Deno.writeFile(
  `${outputDir}/regional-evaluation-detail.json.gz`,
  new Uint8Array(await new Response(zipped).arrayBuffer()),
);
console.log(
  JSON.stringify({
    ...summary,
    largest_changes: undefined,
    calendar_worse: summary.calendar_worse.length,
  }),
);
if (violations.length) {
  throw Error(`${violations.length} contract violations; review results`);
}
