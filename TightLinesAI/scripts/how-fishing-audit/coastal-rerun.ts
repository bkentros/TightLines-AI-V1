#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * Coastal Re-Run: 3 "should be Excellent" scenarios with corrected NOAA station IDs.
 *
 * Original runs used wrong station IDs → NOAA returned forbidden/no data.
 * Corrected stations:
 *   - Chesapeake Bay MD Oct  → 8574680 (Baltimore, MD — inner Bay, reliable)
 *   - Matagorda Bay TX Oct   → 8773037 (Palacios, TX — on Matagorda Bay)
 *   - Tampa Bay FL Nov       → 8726520 (St. Petersburg, FL)
 *
 * Run:
 *   cd "/Users/brandonkentros/TightLines AI V1/.claude/worktrees/nice-wing/TightLinesAI" && \
 *   deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/coastal-rerun.ts \
 *     coastal-rerun-results.jsonl
 */

import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";

const outPath = Deno.args[0] ?? "coastal-rerun-results.jsonl";
const enc = new TextEncoder();

type ScenarioDef = {
  id: string;
  notes: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal";
  region_key: string;
  state_code: string;
  tide_station_id: string;
  expect_band: string;
};

const SCENARIOS: ScenarioDef[] = [
  {
    id: "excellent-chesapeake-bay-md-oct",
    notes: "SHOULD BE EXCELLENT: prime fall rockfish Chesapeake Bay MD — Oct cold front, striper blitz conditions. Station 8574680 (Baltimore).",
    latitude: 38.72, longitude: -76.52,
    local_date: "2024-10-12", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "MD",
    tide_station_id: "8574680",
    expect_band: "Good",
  },
  {
    id: "excellent-matagorda-bay-tx-oct",
    notes: "SHOULD BE EXCELLENT: fall redfish/trout Matagorda Bay TX — Oct prime Gulf inshore. Station 8773037 (Palacios, on Matagorda Bay).",
    latitude: 28.85, longitude: -96.18,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "TX",
    tide_station_id: "8773037",
    expect_band: "Good",
  },
  {
    id: "excellent-tampa-bay-fl-nov",
    notes: "SHOULD BE EXCELLENT: fall snook/redfish Tampa Bay FL — Nov prime after cold front. Station 8726520 (St. Petersburg).",
    latitude: 27.76, longitude: -82.63,
    local_date: "2024-11-02", local_timezone: "America/New_York",
    context: "coastal", region_key: "florida", state_code: "FL",
    tide_station_id: "8726520",
    expect_band: "Good",
  },
];

// ── Open-Meteo archive fetch ─────────────────────────────────────────────────

type OMResponse = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
  };
};

async function fetchOpenMeteo(lat: number, lng: number, targetDate: string): Promise<OMResponse> {
  const startMs = new Date(targetDate + "T12:00:00Z").getTime() - 14 * 86400_000;
  const startDate = new Date(startMs).toISOString().slice(0, 10);

  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", targetDate);
  url.searchParams.set("hourly", "temperature_2m,cloud_cover,wind_speed_10m,surface_pressure,precipitation");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "UTC");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<OMResponse>;
}

// ── NOAA CO-OPS tides fetch ──────────────────────────────────────────────────

async function fetchNOAATides(
  stationId: string,
  date: string,
): Promise<{ phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null> {
  const d = date.replace(/-/g, "");
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions` +
    `&begin_date=${d}&end_date=${d}` +
    `&datum=MLLW&station=${stationId}&time_zone=gmt` +
    `&interval=hilo&units=english&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  NOAA ${res.status} for station ${stationId}`);
      return null;
    }
    const data = await res.json() as { predictions?: Array<{ t: string; v: string; type?: string }>; message?: string };
    if (!data.predictions?.length) {
      console.error(`  NOAA no predictions: ${JSON.stringify(data).slice(0, 100)}`);
      return null;
    }

    const high_low = data.predictions.map((p) => ({
      time: p.t,
      type: p.type === "H" ? "H" : "L",
      value: parseFloat(p.v),
    }));

    // Determine phase at noon: last hi/lo event before 12:00
    let phase = "incoming";
    for (const hl of high_low) {
      const timeStr = hl.time.split(" ")[1] ?? "00:00";
      const [hh, mm] = timeStr.split(":").map(Number);
      const minutesFromMidnight = (hh ?? 0) * 60 + (mm ?? 0);
      if (minutesFromMidnight <= 720) {
        phase = hl.type === "H" ? "outgoing" : "incoming";
      }
    }
    return { phase, high_low };
  } catch (err) {
    console.error(`  NOAA fetch error: ${(err as Error).message}`);
    return null;
  }
}

// ── UTC ISO → local HH:MM ────────────────────────────────────────────────────

function utcToLocalHHMM(utcIso: string, timeZone: string): string {
  const d = new Date(utcIso.endsWith("Z") ? utcIso : utcIso + "Z");
  if (Number.isNaN(d.getTime())) return "06:00";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d).replace(/^24:/, "00:");
  } catch {
    return "06:00";
  }
}

// ── Build env_data ────────────────────────────────────────────────────────────

function buildEnvData(
  om: OMResponse,
  targetDate: string,
  localTimezone: string,
  tides: { phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null,
): Record<string, unknown> {
  const { hourly, daily } = om;
  const dailyIdx = 14;

  const noonApproxIdx = Math.min(dailyIdx * 24 + 17, hourly.time.length - 1);

  const currentTemp = hourly.temperature_2m[noonApproxIdx]
    ?? ((daily.temperature_2m_max[dailyIdx] ?? 60) + (daily.temperature_2m_min[dailyIdx] ?? 45)) / 2;
  const currentPressure = hourly.surface_pressure[noonApproxIdx] ?? 1013;

  const windMax = Math.max(
    ...hourly.wind_speed_10m.slice(dailyIdx * 24, (dailyIdx + 1) * 24).map((v) => v ?? 0),
    0,
  );

  const daySlice = hourly.cloud_cover.slice(dailyIdx * 24 + 6, dailyIdx * 24 + 20);
  const cloudMean = daySlice.length
    ? Math.round(daySlice.reduce((a, b) => a + (b ?? 0), 0) / daySlice.length)
    : 50;

  const p48End = noonApproxIdx;
  const p48Start = Math.max(0, p48End - 47);
  const pressure48hr = hourly.surface_pressure.slice(p48Start, p48End + 1);

  const hourlyAirTempPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z",
    value: hourly.temperature_2m[i] ?? 0,
  }));
  const hourlyCloudPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z",
    value: hourly.cloud_cover[i] ?? 0,
  }));

  const sunriseLocal = utcToLocalHHMM(daily.sunrise[dailyIdx] ?? "", localTimezone);
  const sunsetLocal = utcToLocalHHMM(daily.sunset[dailyIdx] ?? "", localTimezone);

  return {
    timezone: localTimezone,
    weather: {
      temperature: currentTemp,
      pressure: currentPressure,
      wind_speed: windMax,
      cloud_cover: cloudMean,
      precipitation: (hourly.precipitation[noonApproxIdx] ?? 0) * 25.4,
      pressure_48hr: pressure48hr,
      temp_7day_high: daily.temperature_2m_max,
      temp_7day_low: daily.temperature_2m_min,
      precip_7day_daily: daily.precipitation_sum,
    },
    sun: { sunrise: sunriseLocal, sunset: sunsetLocal },
    solunar: null,
    tides: tides
      ? { station_id: "", phase: tides.phase, high_low: tides.high_low }
      : null,
    hourly_air_temp_f: hourlyAirTempPoints,
    hourly_cloud_cover_pct: hourlyCloudPoints,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

const results: string[] = [];
console.log("\n=== Coastal Re-Run: 3 scenarios with corrected NOAA station IDs ===\n");

for (let i = 0; i < SCENARIOS.length; i++) {
  const sc = SCENARIOS[i]!;
  const tag = `[${i + 1}/${SCENARIOS.length}]`;

  await Deno.stdout.write(enc.encode(`${tag} ${sc.id.padEnd(40)} `));

  try {
    const om = await fetchOpenMeteo(sc.latitude, sc.longitude, sc.local_date);

    const tides = await fetchNOAATides(sc.tide_station_id, sc.local_date);

    const envData = buildEnvData(om, sc.local_date, sc.local_timezone, tides);

    const req = buildSharedEngineRequestFromEnvData(
      sc.latitude, sc.longitude,
      sc.local_date, sc.local_timezone,
      sc.context, envData,
    );
    const reqWithRegion = { ...req, region_key: sc.region_key as typeof req.region_key };

    const report = runHowFishingReport(reqWithRegion);
    const { score, band } = report;

    const tideNote = tides ? `[tide:OK phase=${tides.phase}]` : "[tide:MISSING]";
    const pressureNote = `p48=${(envData.weather as Record<string, unknown[]>).pressure_48hr?.length ?? 0}pts`;
    const tempF = (req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f ?? 0).toFixed(1);

    const met = band === sc.expect_band ||
      (sc.expect_band === "Good" && (band === "Good" || band === "Excellent"));
    const expectNote = met ? "  ✓ expect met" : `  ✗ expected ${sc.expect_band}, got ${band}`;

    console.log(`${score} ${band.padEnd(9)} t=${tempF}F ${tideNote} ${pressureNote}${expectNote}`);

    // Detailed pressure/driver dump
    const norm = report.normalized_debug as Record<string, unknown> | undefined;
    if (norm) {
      const pressure = norm.pressure_regime as Record<string, unknown> | undefined;
      const tide = norm.tide_current_movement as Record<string, unknown> | undefined;
      const temp = norm.temperature_condition as Record<string, unknown> | undefined;
      const wind = norm.wind_condition as Record<string, unknown> | undefined;
      console.log(`      pressure: ${JSON.stringify(pressure)}`);
      console.log(`      tide:     ${JSON.stringify(tide)}`);
      console.log(`      temp:     ${JSON.stringify(temp)}`);
      console.log(`      wind:     ${JSON.stringify(wind)}`);
    }
    console.log(`      drivers: ${JSON.stringify(report.drivers?.map((d: Record<string, unknown>) => d.variable))}`);
    console.log(`      suppressors: ${JSON.stringify(report.suppressors?.map((s: Record<string, unknown>) => s.variable))}`);
    console.log(`      reliability: ${JSON.stringify(report.reliability)}`);

    results.push(JSON.stringify({
      id: sc.id,
      notes: sc.notes,
      expect_band: sc.expect_band,
      result: { score, band },
      tide_status: tides ? { phase: tides.phase, count: tides.high_low.length } : null,
      input: {
        latitude: sc.latitude, longitude: sc.longitude,
        local_date: sc.local_date, context: sc.context, region_key: sc.region_key,
        environment: req.environment,
      },
      env_data: envData,
      report,
    }));
  } catch (err) {
    console.log(`ERROR: ${(err as Error).message}`);
  }

  if (i < SCENARIOS.length - 1) await new Promise((r) => setTimeout(r, 500));
}

await Deno.writeTextFile(outPath, results.join("\n") + "\n");
console.log(`\nWrote ${results.length} results to ${outPath}`);
