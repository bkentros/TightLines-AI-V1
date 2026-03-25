#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write
/**
 * How's Fishing Engine — Live Historical Audit Runner
 *
 * Fetches REAL historical weather from Open-Meteo Archive API for past dates,
 * runs the deterministic engine (no LLM), and writes JSONL output for audit.
 *
 * Each JSONL line contains:
 *   - raw_weather: exact API responses (open_meteo, usno, noaa)
 *   - env_data: mapped intermediate form sent to engine
 *   - input: engine request summary (region_key, environment fields, coverage)
 *   - report: full HowsFishingReport (score, band, drivers, timing, tip, debug)
 *
 * Run from repo root or TightLinesAI/:
 *   cd TightLinesAI && deno run --allow-net --allow-read --allow-write \
 *     scripts/how-fishing-audit/run-live-audit.ts \
 *     scripts/how-fishing-audit/scenarios-live.json \
 *     how-fishing-live-audit-results.jsonl
 *
 * Shared audit scenarios (altitude + explicit region_key, same list as alpine-norCal Part B):
 *   deno run --allow-net --allow-read --allow-write \
 *     scripts/how-fishing-audit/run-live-audit.ts --audit-bundle [out.jsonl]
 */

import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "./lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "./lib/fetchUSNOMoon.ts";
import { fetchNOAATides } from "./lib/fetchNOAATides.ts";
import { mapArchiveToEnvData } from "./lib/mapEnvData.ts";
import { AUDIT_SCENARIOS, type AuditScenario } from "./auditScenarios.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

type LiveScenario = {
  id: string;
  notes?: string;
  lat: number;
  lon: number;
  local_timezone: string;
  local_date: string;    // YYYY-MM-DD
  context: EngineContext;
  tide_station_id?: string | null;
  /** Passed through env_data for buildFromEnvData altitude / sub-region rules */
  altitude_ft?: number;
  /** Audit-only: force region after auto-resolve (matches alpine-norCal-sweep Part B) */
  region_key?: string;
  expect_band?: string;
};

function auditScenarioToLive(s: AuditScenario): LiveScenario {
  return {
    id: s.id,
    notes: s.notes,
    lat: s.latitude,
    lon: s.longitude,
    local_timezone: s.local_timezone,
    local_date: s.local_date,
    context: s.context,
    tide_station_id: s.tide_station_id ?? null,
    altitude_ft: s.altitude_ft,
    region_key: s.region_key,
    expect_band: s.expect_band,
  };
}

const CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
];

// ── CLI args ──────────────────────────────────────────────────────────────────

const auditDir = dirname(fromFileUrl(import.meta.url));
const defaultScenarios = join(auditDir, "scenarios-live.json");

const flags = Deno.args.filter((a) => a.startsWith("--"));
const pos = Deno.args.filter((a) => !a.startsWith("--"));
const useAuditBundle = flags.includes("--audit-bundle");

const scenariosPath = useAuditBundle ? null : (pos[0] ?? defaultScenarios);
const outPath = useAuditBundle
  ? (pos[0] ?? "how-fishing-live-audit-results.jsonl")
  : (pos[1] ?? "how-fishing-live-audit-results.jsonl");

// ── Load scenarios ────────────────────────────────────────────────────────────

const scenarios: LiveScenario[] = useAuditBundle
  ? AUDIT_SCENARIOS.map(auditScenarioToLive)
  : JSON.parse(await Deno.readTextFile(scenariosPath!)) as LiveScenario[];

console.log(
  useAuditBundle
    ? `Loaded ${scenarios.length} scenarios from audit bundle (auditScenarios.ts)`
    : `Loaded ${scenarios.length} scenarios from ${scenariosPath}`,
);
console.log(`Output → ${outPath}\n`);

await Deno.writeTextFile(outPath, ""); // clear/create output file

// ── Main loop ─────────────────────────────────────────────────────────────────

let okCount = 0;
let skipCount = 0;

for (const s of scenarios) {
  // Validate context
  if (!CONTEXTS.includes(s.context)) {
    console.error(`SKIP ${s.id}: invalid context "${s.context}"`);
    skipCount++;
    continue;
  }

  try {
    // 1. Fetch Open-Meteo Archive (required — skip on failure)
    const archive = await fetchArchiveWeather(s.lat, s.lon, s.local_date);
    if (!archive) {
      console.error(`SKIP ${s.id}: archive weather fetch failed`);
      skipCount++;
      continue;
    }

    const tzOffsetHours = archive.tz_offset_seconds / 3600;

    // 2. Fetch auxiliary data (optional — engine degrades gracefully on failure)
    const [sun, moon, tides] = await Promise.all([
      fetchSunriseSunset(s.lat, s.lon, s.local_date, archive.timezone),
      fetchUSNOMoon(s.lat, s.lon, s.local_date, tzOffsetHours),
      s.context === "coastal" && s.tide_station_id
        ? fetchNOAATides(s.tide_station_id, s.local_date, tzOffsetHours)
        : Promise.resolve(null),
    ]);

    if (!sun) console.warn(`  warn: sunrise-sunset failed for ${s.id}`);
    if (!moon) console.warn(`  warn: USNO moon failed for ${s.id}`);
    if (s.context === "coastal" && s.tide_station_id && !tides) {
      console.warn(`  warn: NOAA tides failed for ${s.id} (station ${s.tide_station_id})`);
    }

    // 3. Map to env_data shape
    let env_data: Record<string, unknown> = mapArchiveToEnvData(
      archive,
      s.local_date,
      archive.timezone,
      sun,
      moon,
      tides ?? null,
    );
    if (s.altitude_ft != null) {
      env_data = { ...env_data, altitude_ft: s.altitude_ft };
    }

    // 4. Run engine (deterministic — no LLM)
    const reqAuto = buildSharedEngineRequestFromEnvData(
      s.lat,
      s.lon,
      s.local_date,
      s.local_timezone,
      s.context,
      env_data,
      0,
    );
    const req: SharedEngineRequest = s.region_key
      ? {
        ...reqAuto,
        region_key: s.region_key as SharedEngineRequest["region_key"],
      }
      : reqAuto;
    const report = runHowFishingReport(req);

    // 5. Write JSONL line
    const line = JSON.stringify({
      id: s.id,
      notes: s.notes ?? null,
      expect_band: s.expect_band ?? null,
      input: {
        latitude: s.lat,
        longitude: s.lon,
        local_date: s.local_date,
        local_timezone: s.local_timezone,
        context: s.context,
        region_key: req.region_key,
        auto_region_key: reqAuto.region_key,
        explicit_region_key: s.region_key ?? null,
        state_code: req.state_code,
        environment: req.environment,
        data_coverage: req.data_coverage,
      },
      raw_weather: {
        open_meteo_timezone: archive.timezone,
        open_meteo_tz_offset_seconds: archive.tz_offset_seconds,
        // Include key scalars for quick audit without parsing full archive
        noon_temp_f: archive.hourly_temp_f[
          // approximate noon index
          Math.round(archive.hourly_times_unix.length * (14 * 24 + 12) / (21 * 24))
        ],
        daily_precip_in_at_target: archive.daily_precip_in[14],
        daily_wind_max_mph_at_target: archive.daily_wind_max_mph[14],
        daily_temp_max_f_at_target: archive.daily_temp_max_f[14],
        daily_temp_min_f_at_target: archive.daily_temp_min_f[14],
        usno_moon_phase: moon?.phase ?? null,
        usno_moon_illumination: moon?.illumination ?? null,
        usno_upper_transit: moon?.upper_transit ?? null,
        noaa_tide_phase: tides?.phase ?? null,
        noaa_high_low: tides?.high_low ?? null,
      },
      env_data,
      report,
    });

    await Deno.writeTextFile(outPath, line + "\n", { append: true });

    console.log(
      `ok  [${String(okCount + 1).padStart(3)}] ${s.id.padEnd(50)} ${report.band.padEnd(9)} score=${report.score}  reliability=${report.reliability}`,
    );
    okCount++;
  } catch (err) {
    console.error(
      `ERROR ${s.id}:`,
      err instanceof Error ? err.message : String(err),
    );
    skipCount++;
  }

  // Rate-limit friendly pause between scenarios
  await new Promise((r) => setTimeout(r, 150));
}

console.log(`\nDone. ${okCount} ok, ${skipCount} skipped. Results → ${outPath}`);
