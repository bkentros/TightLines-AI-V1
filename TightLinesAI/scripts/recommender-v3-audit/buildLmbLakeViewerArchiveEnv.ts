#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

/**
 * buildLmbLakeViewerArchiveEnv.ts
 *
 * Fetches and caches archived weather data for each LMB lake viewer scenario.
 * Scenarios that share the same coordinates + `local_date` + timezone reuse one fetch
 * (July 8 clarity sweep: three clarities, one archive pull per region).
 * Run this once (or re-run to refresh). Output is read by runLmbLakeViewer.ts.
 *
 * Usage:
 *   deno run --allow-net --allow-read --allow-write \
 *     scripts/recommender-v3-audit/buildLmbLakeViewerArchiveEnv.ts
 *
 * Output:
 *   docs/recommender-v3-audit/generated/lmb-lake-viewer-archive-env.json
 */

import { resolveRegionForCoordinates } from "../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import { fetchArchiveWeather } from "../audit/lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "../audit/lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "../audit/lib/fetchUSNOMoon.ts";
import { findDailyIndex, findNoonHourIndex } from "../audit/lib/dateUtils.ts";
import { mapArchiveToEnvData } from "../audit/lib/mapArchiveToEnvData.ts";
import type { ArchiveBatchBundle, ArchiveScenarioBundle } from "./archiveBundle.ts";
import {
  LMB_LAKE_VIEWER_SCENARIOS,
  lmbLakeViewerArchiveDedupeKey,
  type LmbLakeViewerScenario,
} from "./lmbLakeViewerScenarios.ts";

const OUTPUT_PATH = "docs/recommender-v3-audit/generated/lmb-lake-viewer-archive-env.json";

async function buildScenarioBundle(
  scenario: LmbLakeViewerScenario,
): Promise<ArchiveScenarioBundle> {
  const region = resolveRegionForCoordinates(scenario.latitude, scenario.longitude);
  const month = Number.parseInt(scenario.local_date.slice(5, 7), 10) || 1;

  const failed = (error: string): ArchiveScenarioBundle => ({
    scenario_id: scenario.id,
    label: `${scenario.region_label} · ${scenario.local_date}`,
    status: "archive_fetch_failed",
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      timezone: scenario.timezone,
      local_date: scenario.local_date,
      region_key: region.region_key,
      month,
    },
    archive_summary: {
      archive_timezone: null,
      noon_air_temp_f: null,
      pressure_noon_mb: null,
      cloud_cover_noon_pct: null,
      daily_high_air_temp_f: null,
      daily_low_air_temp_f: null,
      daily_precip_in: null,
      daily_wind_max_mph: null,
      moon_phase: null,
      sunrise_local: null,
      sunset_local: null,
    },
    env_data: null,
    shared_environment: null,
    data_coverage: {},
    error,
  });

  const archive = await fetchArchiveWeather(
    scenario.latitude,
    scenario.longitude,
    scenario.local_date,
  );
  if (!archive) return failed("archive_weather_unavailable");

  const [sun, moon] = await Promise.all([
    fetchSunriseSunset(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
      scenario.timezone,
    ),
    fetchUSNOMoon(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
      archive.tz_offset_seconds / 3600,
    ),
  ]);

  const envData = mapArchiveToEnvData(
    archive,
    scenario.local_date,
    scenario.timezone,
    sun,
    moon,
    null,
  );
  if (sun) {
    envData.sun = { sunrise: sun.sunrise, sunset: sun.sunset };
  }

  const sharedReq = buildSharedEngineRequestFromEnvData(
    scenario.latitude,
    scenario.longitude,
    scenario.local_date,
    scenario.timezone,
    scenario.context,
    envData,
    0,
    { useCalendarDayProfileForToday: true },
  );

  const noonIndex = findNoonHourIndex(
    archive.hourly_times_unix,
    scenario.local_date,
    scenario.timezone,
  );
  const dailyIndex = findDailyIndex(
    archive.daily_times_unix,
    scenario.local_date,
    scenario.timezone,
  );

  return {
    scenario_id: scenario.id,
    label: `${scenario.region_label} · ${scenario.local_date}`,
    status: "ready",
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      timezone: scenario.timezone,
      local_date: scenario.local_date,
      region_key: region.region_key,
      month,
    },
    archive_summary: {
      archive_timezone: archive.timezone,
      noon_air_temp_f: noonIndex >= 0 ? (archive.hourly_temp_f[noonIndex] ?? null) : null,
      pressure_noon_mb: noonIndex >= 0 ? (archive.hourly_pressure_msl[noonIndex] ?? null) : null,
      cloud_cover_noon_pct: noonIndex >= 0 ? (archive.hourly_cloud_cover[noonIndex] ?? null) : null,
      daily_high_air_temp_f: dailyIndex >= 0 ? (archive.daily_temp_max_f[dailyIndex] ?? null) : null,
      daily_low_air_temp_f: dailyIndex >= 0 ? (archive.daily_temp_min_f[dailyIndex] ?? null) : null,
      daily_precip_in: dailyIndex >= 0 ? (archive.daily_precip_in[dailyIndex] ?? null) : null,
      daily_wind_max_mph: dailyIndex >= 0 ? (archive.daily_wind_max_mph[dailyIndex] ?? null) : null,
      moon_phase: moon?.phase ?? null,
      sunrise_local: sun?.sunrise ?? moon?.sun_rise ?? null,
      sunset_local: sun?.sunset ?? moon?.sun_set ?? null,
    },
    env_data: envData,
    shared_environment: sharedReq.environment,
    data_coverage: sharedReq.data_coverage,
    error: null,
  };
}

if (import.meta.main) {
  const builtScenarios: ArchiveScenarioBundle[] = [];
  const archiveTemplateByKey = new Map<string, ArchiveScenarioBundle>();

  for (const [i, scenario] of LMB_LAKE_VIEWER_SCENARIOS.entries()) {
    const dedupeKey = lmbLakeViewerArchiveDedupeKey(scenario);
    let template = archiveTemplateByKey.get(dedupeKey);

    if (!template) {
      console.log(
        `[${i + 1}/${LMB_LAKE_VIEWER_SCENARIOS.length}] ${scenario.id} (${scenario.local_date}) — fetch archive`,
      );
      template = await buildScenarioBundle(scenario);
      archiveTemplateByKey.set(dedupeKey, template);
    } else {
      console.log(
        `[${i + 1}/${LMB_LAKE_VIEWER_SCENARIOS.length}] ${scenario.id} (${scenario.local_date}) — reuse archive`,
      );
    }

    const clarityNote = scenario.water_clarity ? ` · ${scenario.water_clarity}` : "";
    builtScenarios.push({
      ...template,
      scenario_id: scenario.id,
      label: `${scenario.region_label} · ${scenario.local_date}${clarityNote}`,
    });
  }

  const bundle: ArchiveBatchBundle = {
    batch_id: "lmb_lake_viewer",
    generated_at: new Date().toISOString(),
    scenario_count: builtScenarios.length,
    scenarios: builtScenarios,
  };

  await Deno.writeTextFile(OUTPUT_PATH, `${JSON.stringify(bundle, null, 2)}\n`);

  const readyCount = builtScenarios.filter((s) => s.status === "ready").length;
  const failCount = builtScenarios.length - readyCount;
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log(`Ready: ${readyCount}/${builtScenarios.length}`);
  if (failCount > 0) console.warn(`Failed: ${failCount}`);
}
