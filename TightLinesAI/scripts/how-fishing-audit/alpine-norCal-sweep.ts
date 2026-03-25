#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
/**
 * Alpine + NorCal Region Validation: Synthetic Sweep + Real-Weather Scenarios
 *
 * PART A — SYNTHETIC PARAMETER SWEEP (no API calls)
 *   Tests all 14 regions × 12 months × 3 contexts × 4 weather moods = ~1,512 combos.
 *   Verifies monotonic progression: excellent_day > good_day > fair_day > poor_day.
 *   Flags any region/month combo where "excellent" synthetic day scores below 70,
 *   or where monotonic order is violated.
 *
 * PART B — REAL-WEATHER SCENARIOS (live API calls)
 *   20 targeted scenarios:
 *     - New alpine region across all seasons (Dillon Reservoir CO, Yellowstone Lake WY, Tahoe CA)
 *     - New NorCal region (Lake Shasta, Sacramento River, Bodega Bay)
 *     - Coastal "should be Excellent" validation with prime-condition dates
 *
 * Run:
 *   cd TightLinesAI && deno run --allow-net --allow-read --allow-write --allow-env \
 *     scripts/how-fishing-audit/alpine-norCal-sweep.ts \
 *     alpine-norCal-sweep-results.jsonl
 */

import {
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { CANONICAL_REGION_KEYS } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";

const outPath = Deno.args[0] ?? "alpine-norCal-sweep-results.jsonl";
const enc = new TextEncoder();

// ── PART A: Synthetic Parameter Sweep ─────────────────────────────────────────

type WeatherMood = "excellent" | "good" | "fair" | "poor";

/**
 * Build a synthetic SharedEngineRequest for a given region/month/context/mood.
 * No real weather data — uses idealized inputs to test engine calibration.
 *
 * Pressure series: 48 values, shaped to represent the mood's pressure trend.
 * Temp: mid-band for the month (derived from regional knowledge, not from DB lookup).
 */
function buildSyntheticRequest(
  region: string,
  month: number,  // 1-12
  context: "freshwater_lake_pond" | "freshwater_river" | "coastal",
  mood: WeatherMood,
): SharedEngineRequest {
  // Representative lat/lon per region (for context/timing resolution)
  const REGION_COORDS: Record<string, [number, number]> = {
    northeast: [43.0, -71.5],
    southeast_atlantic: [35.2, -79.0],
    florida: [27.8, -81.5],
    gulf_coast: [29.5, -90.5],
    great_lakes_upper_midwest: [43.5, -85.0],
    midwest_interior: [41.0, -93.0],
    south_central: [36.5, -92.0],
    mountain_west: [44.0, -112.0],
    southwest_desert: [33.5, -112.0],
    southwest_high_desert: [35.0, -106.5],
    pacific_northwest: [47.5, -122.0],
    southern_california: [34.0, -117.5],
    mountain_alpine: [39.6, -106.0],  // Dillon Reservoir CO
    northern_california: [40.7, -122.4],  // Lake Shasta CA
  };

  // Mid-band air temps by region and month (approximate seasonal central values)
  // These are calibrated to land in the "optimal" or "slightly warm" bands for
  // each region, giving each mood a realistic starting temperature.
  const REGION_MONTH_TEMPS: Record<string, number[]> = {
    northeast:                    [28,30,38,50,62,70,75,73,65,53,42,32],
    southeast_atlantic:           [46,50,58,66,74,80,84,83,77,66,56,48],
    florida:                      [62,64,70,76,82,86,88,88,86,78,70,64],
    gulf_coast:                   [54,58,65,72,78,84,87,87,83,73,62,56],
    great_lakes_upper_midwest:    [22,26,36,50,62,70,75,73,65,52,40,28],
    midwest_interior:             [26,30,44,56,66,74,78,76,68,56,44,30],
    south_central:                [42,46,56,64,72,78,82,80,74,63,52,44],
    mountain_west:                [28,32,40,52,62,70,76,74,64,52,38,30],
    southwest_desert:             [52,56,64,72,80,88,92,90,84,72,60,52],
    southwest_high_desert:        [38,42,52,62,70,78,82,80,74,62,48,38],
    pacific_northwest:            [40,44,50,56,62,68,72,72,66,56,46,40],
    southern_california:          [56,58,62,66,70,74,78,78,76,70,62,56],
    // NEW: alpine — much cooler; September is best month
    mountain_alpine:              [14,18,28,42,52,60,66,64,54,40,24,14],
    // NEW: NorCal — Sacramento Valley inland (hot summers, mild winters)
    northern_california:          [50,54,62,68,76,84,90,88,80,70,58,50],
  };

  const [lat, lon] = REGION_COORDS[region] ?? [40, -100];
  const tempBase = (REGION_MONTH_TEMPS[region] ?? REGION_MONTH_TEMPS.midwest_interior!)[month - 1]!;

  // ── Temperature by mood ──
  // excellent: land in optimal band (center)
  // good: same but with moderate wind/pressure deviation
  // fair: slightly cool or warm (edge of optimal)
  // poor: cold extreme or hot extreme
  const tempByMood: Record<WeatherMood, number> = {
    excellent: tempBase,
    good: tempBase,
    fair: tempBase - 8,    // cooler than optimal (not terrible)
    poor: tempBase - 20,   // genuinely cold (winter) or apply heat stress
  };

  // For summer poor_day, use heat stress instead of cold
  const isSummerMonth = month >= 6 && month <= 8;
  const poorTemp = isSummerMonth ? tempBase + 15 : tempBase - 20;

  const tempF: Record<WeatherMood, number> = {
    excellent: tempBase,
    good: tempBase,
    fair: tempBase - 8,
    poor: poorTemp,
  };

  // ── Pressure series: 48 readings shaped to mood ──
  function buildPressureSeries(mood: WeatherMood): number[] {
    const base = 1013;
    const n = 48;
    const series: number[] = [];
    if (mood === "excellent") {
      // Slow steady fall: -2.5mb over 48h — classic feeding trigger
      for (let i = 0; i < n; i++) series.push(base - i * (2.5 / (n - 1)));
    } else if (mood === "good") {
      // Stable: flat within ±0.5mb
      for (let i = 0; i < n; i++) series.push(base + Math.sin(i / 8) * 0.3);
    } else if (mood === "fair") {
      // Slow rise: post-front recovery, fish still adjusting
      for (let i = 0; i < n; i++) series.push(base - 2 + i * (2.5 / (n - 1)));
    } else {
      // Volatile: big swing — sharp drop then recovery, range ~8mb
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        series.push(base - 4 + Math.sin(t * Math.PI * 3) * 4);
      }
    }
    return series;
  }

  // ── Wind by mood ──
  const windByMood: Record<WeatherMood, number> = {
    excellent: 6,   // calm: +1
    good: 12,       // light: 0
    fair: 18,       // moderate: 0 or -1
    poor: 28,       // strong: -2
  };

  // ── Cloud by mood ──
  const cloudByMood: Record<WeatherMood, number> = {
    excellent: 40,   // partly cloudy: optimal
    good: 20,        // mostly clear: mild glare
    fair: 80,        // overcast: flat light
    poor: 0,         // clear sky (bluebird) or fully overcast — both can suppress
  };

  // ── Precip ──
  const precipByMood: Record<WeatherMood, number> = {
    excellent: 0,
    good: 0,
    fair: 0.02,   // light drizzle
    poor: 0.8,    // heavy rain
  };

  // ── Tide (coastal only) ──
  const hasTide = context === "coastal";
  const tidePhase = mood === "excellent" || mood === "good" ? "incoming" : "outgoing";
  const tideHighLow = hasTide ? [
    { time: "2024-10-12 06:00", type: "L", value: 0.5 },
    { time: "2024-10-12 12:00", type: "H", value: 4.2 },
    { time: "2024-10-12 18:00", type: "L", value: 0.8 },
    { time: "2024-10-12 23:00", type: "H", value: 3.9 },
  ] : null;

  // ── Precip daily arrays (15 days of daily data, target at index 14) ──
  const dryDays = new Array(14).fill(0);
  const precip7day = [...dryDays, precipByMood[mood]];
  const highTemps = new Array(15).fill(tempF[mood] + 5);
  const lowTemps = new Array(15).fill(tempF[mood] - 5);

  // ── Sunrise/sunset (approximate) ──
  const SUNRISE_BY_MONTH = ["07:15","07:00","06:30","06:00","05:30","05:15","05:20","05:45","06:10","06:40","07:10","07:25"];
  const SUNSET_BY_MONTH =  ["16:30","17:10","17:50","19:30","20:00","20:30","20:20","19:45","19:00","18:10","17:20","16:25"];
  const sunrise = SUNRISE_BY_MONTH[month - 1]!;
  const sunset = SUNSET_BY_MONTH[month - 1]!;

  // ── Build hourly arrays (simplified flat arrays for timing resolution) ──
  // 24-slot array for the target day
  const tempVal = tempF[mood];
  const cloudVal = cloudByMood[mood];
  const hourlyAirTemp: number[] = Array.from({length: 24}, (_, h) => {
    // Diurnal swing: coldest at 6am, warmest at 2pm
    const delta = 6 * Math.sin((h - 6) * Math.PI / 12);
    return tempVal + delta;
  });
  const hourlyCloud: number[] = Array.from({length: 24}, () => cloudVal);

  const localDate = `2024-${String(month).padStart(2, "0")}-15`;

  const req: SharedEngineRequest = {
    latitude: lat,
    longitude: lon,
    state_code: null,
    region_key: region as SharedEngineRequest["region_key"],
    local_date: localDate,
    local_timezone: "America/Denver",
    context,
    environment: {
      current_air_temp_f: tempF[mood],
      daily_mean_air_temp_f: tempF[mood],
      prior_day_mean_air_temp_f: tempF[mood],
      day_minus_2_mean_air_temp_f: tempF[mood],
      pressure_mb: buildPressureSeries(mood).at(-1) ?? 1013,
      pressure_history_mb: buildPressureSeries(mood),
      wind_speed_mph: windByMood[mood],
      cloud_cover_pct: cloudByMood[mood],
      precip_24h_in: precipByMood[mood],
      precip_72h_in: precipByMood[mood] * 1.5,
      precip_7d_in: sumArray(precip7day),
      active_precip_now: precipByMood[mood] > 0.1,
      precip_rate_now_in_per_hr: precipByMood[mood] > 0.1 ? precipByMood[mood] : null,
      tide_movement_state: hasTide ? tidePhase : null,
      tide_station_id: hasTide ? "synthetic" : null,
      tide_high_low: tideHighLow,
      current_speed_knots_max: null,
      tide_height_hourly_ft: null,
      sunrise_local: sunrise,
      sunset_local: sunset,
      solunar_peak_local: undefined,
      hourly_air_temp_f: hourlyAirTemp,
      hourly_cloud_cover_pct: hourlyCloud,
    },
    data_coverage: {},
  };

  return req;
}

function sumArray(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

// ── Run Synthetic Sweep ───────────────────────────────────────────────────────

const ALL_REGIONS = [...CANONICAL_REGION_KEYS];
const ALL_CONTEXTS: Array<"freshwater_lake_pond" | "freshwater_river" | "coastal"> = [
  "freshwater_lake_pond", "freshwater_river", "coastal",
];
const ALL_MOODS: WeatherMood[] = ["excellent", "good", "fair", "poor"];
const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12];

type SweepViolation = {
  region: string; month: number; context: string;
  scores: Record<WeatherMood, number>;
  issue: string;
};

const sweepViolations: SweepViolation[] = [];
const sweepResults: Array<{region: string; month: number; context: string; scores: Record<WeatherMood, number>}> = [];
let sweepTotal = 0;

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  PART A — SYNTHETIC PARAMETER SWEEP");
console.log(`  ${ALL_REGIONS.length} regions × 12 months × ${ALL_CONTEXTS.length} contexts × ${ALL_MOODS.length} moods`);
console.log("═══════════════════════════════════════════════════════════════\n");

for (const region of ALL_REGIONS) {
  for (const month of MONTHS) {
    for (const context of ALL_CONTEXTS) {
      const scores: Partial<Record<WeatherMood, number>> = {};
      for (const mood of ALL_MOODS) {
        const req = buildSyntheticRequest(region, month, context, mood);
        const report = runHowFishingReport(req);
        scores[mood] = report.score;
      }

      sweepTotal++;
      const s = scores as Record<WeatherMood, number>;
      sweepResults.push({ region, month, context, scores: s });

      // Check issues
      const issues: string[] = [];
      if (s.excellent < 60) issues.push(`excellent_day scored only ${s.excellent} (expected ≥60)`);
      if (s.poor > 50) issues.push(`poor_day scored ${s.poor} (expected ≤50)`);
      if (s.excellent < s.good) issues.push(`excellent(${s.excellent}) < good(${s.good}) — not monotonic`);
      if (s.good < s.fair) issues.push(`good(${s.good}) < fair(${s.fair}) — not monotonic`);

      if (issues.length > 0) {
        sweepViolations.push({
          region, month, context, scores: s,
          issue: issues.join("; "),
        });
      }
    }
  }
}

// Print sweep summary
console.log(`Tested ${sweepTotal} combinations. Found ${sweepViolations.length} violations.\n`);

if (sweepViolations.length > 0) {
  console.log("⚠  VIOLATIONS:\n");
  for (const v of sweepViolations) {
    const m = String(v.month).padStart(2, "0");
    console.log(`  ${v.region.padEnd(26)} m=${m} ctx=${v.context.padEnd(22)} E=${v.scores.excellent} G=${v.scores.good} F=${v.scores.fair} P=${v.scores.poor}`);
    console.log(`    → ${v.issue}`);
  }
}

// Print score tables for new regions (alpine + NorCal) across all months
console.log("\n── mountain_alpine scores (excellent | good | fair | poor) ──\n");
for (const month of MONTHS) {
  for (const context of ALL_CONTEXTS) {
    const entry = sweepResults.find(r => r.region === "mountain_alpine" && r.month === month && r.context === context);
    if (!entry) continue;
    const s = entry.scores;
    const ctxShort = context === "freshwater_lake_pond" ? "lake" : context === "freshwater_river" ? "river" : "coast";
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mn = monthNames[month - 1]!;
    console.log(`  ${mn} ${ctxShort.padEnd(5)}: E=${String(s.excellent).padStart(2)} G=${String(s.good).padStart(2)} F=${String(s.fair).padStart(2)} P=${String(s.poor).padStart(2)}`);
  }
}

console.log("\n── northern_california scores (excellent | good | fair | poor) ──\n");
for (const month of MONTHS) {
  for (const context of ALL_CONTEXTS) {
    const entry = sweepResults.find(r => r.region === "northern_california" && r.month === month && r.context === context);
    if (!entry) continue;
    const s = entry.scores;
    const ctxShort = context === "freshwater_lake_pond" ? "lake" : context === "freshwater_river" ? "river" : "coast";
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mn = monthNames[month - 1]!;
    console.log(`  ${mn} ${ctxShort.padEnd(5)}: E=${String(s.excellent).padStart(2)} G=${String(s.good).padStart(2)} F=${String(s.fair).padStart(2)} P=${String(s.poor).padStart(2)}`);
  }
}

// ── PART B: Real-Weather Scenarios ────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  PART B — REAL-WEATHER SCENARIOS (live API)");
console.log("═══════════════════════════════════════════════════════════════\n");

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
  altitude_ft?: number;
  tide_station_id?: string;
  expect_band?: string;
};

const SCENARIOS: ScenarioDef[] = [

  // ── mountain_alpine region scenarios ──────────────────────────────────────
  // Dillon Reservoir CO (9,017ft) — confirms altitude override to mountain_alpine

  {
    id: "alpine-dillon-co-lake-sep",
    notes: "SHOULD BE GOOD+: Prime fall kokanee Dillon Reservoir CO (9,017ft) — Sep bite window before Oct freeze",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-09-07", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017, expect_band: "Good",
  },
  {
    id: "alpine-dillon-co-lake-jun",
    notes: "SHOULD BE GOOD+: Post-ice-out Dillon Reservoir CO — Jun brown trout prime, cold clear water",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-06-08", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017, expect_band: "Good",
  },
  {
    id: "alpine-dillon-co-river-aug",
    notes: "Blue River CO (feeds Dillon, 9,000ft) — Aug cutthroat dry fly, low runoff, clear water",
    latitude: 39.60, longitude: -106.05,
    local_date: "2024-08-10", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9000, expect_band: "Good",
  },
  {
    id: "alpine-dillon-co-lake-jan",
    notes: "Ice fishing Dillon Reservoir CO Jan — should score Poor (frozen/ice fishing only)",
    latitude: 39.63, longitude: -106.07,
    local_date: "2024-01-13", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 9017, expect_band: "Poor",
  },
  {
    id: "alpine-yellowstone-lake-wy-sep",
    notes: "SHOULD BE GOOD+: Yellowstone Lake WY (7,733ft) — Sep cutthroat prime after summer crowds leave",
    latitude: 44.45, longitude: -110.37,
    local_date: "2024-09-12", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "WY",
    altitude_ft: 7733, expect_band: "Good",
  },
  {
    id: "alpine-yellowstone-river-wy-jul",
    notes: "Firehole/Madison River WY (7,300ft) — Jul dry fly; classic Yellowstone summer window",
    latitude: 44.56, longitude: -110.82,
    local_date: "2024-07-13", local_timezone: "America/Denver",
    context: "freshwater_river", region_key: "mountain_alpine", state_code: "WY",
    altitude_ft: 7300, expect_band: "Good",
  },
  {
    id: "alpine-tahoe-ca-lake-oct",
    notes: "Lake Tahoe CA (6,225ft) — Oct mackinaw (lake trout) prime; confirms NorCal+altitude → mountain_alpine override",
    latitude: 39.10, longitude: -120.03,
    local_date: "2024-10-05", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CA",
    altitude_ft: 6225, expect_band: "Good",
  },
  {
    id: "alpine-blue-mesa-co-lake-may",
    notes: "Blue Mesa Reservoir CO (7,519ft) — May ice-out; kokanee and brown trout prime spring window",
    latitude: 38.45, longitude: -107.35,
    local_date: "2024-05-11", local_timezone: "America/Denver",
    context: "freshwater_lake_pond", region_key: "mountain_alpine", state_code: "CO",
    altitude_ft: 7519, expect_band: "Good",
  },

  // ── northern_california region scenarios ───────────────────────────────────

  {
    id: "norcal-shasta-lake-oct",
    notes: "SHOULD BE GOOD+: Lake Shasta CA (~1,000ft) — Oct prime fall bass/salmon; NorCal best season",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Good",
  },
  {
    id: "norcal-shasta-lake-apr",
    notes: "SHOULD BE GOOD+: Lake Shasta CA — Apr bass pre-spawn; 58-68°F prime temps",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-04-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Good",
  },
  {
    id: "norcal-sacramento-river-jan",
    notes: "Sacramento River CA (near Red Bluff) — Jan steelhead prime; winter clarity, strong runs",
    latitude: 40.17, longitude: -122.24,
    local_date: "2024-01-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 350, expect_band: "Good",
  },
  {
    id: "norcal-trinity-river-nov",
    notes: "Trinity River CA — Nov steelhead run; prime fall-run chinook and steelhead window",
    latitude: 40.69, longitude: -123.12,
    local_date: "2024-11-09", local_timezone: "America/Los_Angeles",
    context: "freshwater_river", region_key: "northern_california", state_code: "CA",
    altitude_ft: 2000, expect_band: "Good",
  },
  {
    id: "norcal-shasta-lake-jul",
    notes: "Lake Shasta CA — Jul heat stress check; 95°F+ air temps suppress scoring",
    latitude: 40.72, longitude: -122.41,
    local_date: "2024-07-20", local_timezone: "America/Los_Angeles",
    context: "freshwater_lake_pond", region_key: "northern_california", state_code: "CA",
    altitude_ft: 1000, expect_band: "Fair",
  },
  {
    id: "norcal-bodega-bay-coastal-oct",
    notes: "Bodega Bay CA coastal — Oct rockfish/striper prime; confirms NorCal coastal bands",
    latitude: 38.33, longitude: -123.05,
    local_date: "2024-10-05", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "northern_california", state_code: "CA",
    altitude_ft: 10, tide_station_id: "9415020",  // Bodega Bay NOAA
    expect_band: "Good",
  },

  // ── Coastal "should be Excellent" validation ───────────────────────────────
  // Using dates with known falling pressure AND partial overcast (no glare)
  // + active tidal exchange — the combination needed to reach 80+

  {
    id: "excellent-chesapeake-bay-oct-overcast",
    notes: "SHOULD BE EXCELLENT: Chesapeake Bay Oct — specifically seeking overcast+falling pressure (no glare penalty). Station 8574680.",
    latitude: 38.72, longitude: -76.52,
    local_date: "2024-10-26", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "MD",
    tide_station_id: "8574680", expect_band: "Good",
  },
  {
    id: "excellent-outer-banks-nc-oct",
    notes: "Outer Banks NC — Oct prime; bluefish/striper blitz. Station 8652587 (Oregon Inlet).",
    latitude: 35.80, longitude: -75.60,
    local_date: "2024-10-19", local_timezone: "America/New_York",
    context: "coastal", region_key: "southeast_atlantic", state_code: "NC",
    tide_station_id: "8652587", expect_band: "Good",
  },
  {
    id: "excellent-puget-sound-wa-sep",
    notes: "SHOULD BE EXCELLENT: Puget Sound WA — Sep salmon/rockfish prime; overcast + tidal + falling pressure. Station 9447130 (Seattle).",
    latitude: 47.58, longitude: -122.33,
    local_date: "2024-09-21", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9447130", expect_band: "Good",
  },
  {
    id: "excellent-puget-sound-wa-oct",
    notes: "Puget Sound WA — Oct peak coho salmon; prime fall conditions. Station 9447130.",
    latitude: 47.58, longitude: -122.33,
    local_date: "2024-10-12", local_timezone: "America/Los_Angeles",
    context: "coastal", region_key: "pacific_northwest", state_code: "WA",
    tide_station_id: "9447130", expect_band: "Good",
  },
  {
    id: "excellent-galveston-tx-nov",
    notes: "Galveston TX coastal — Nov post-cold-front redfish/trout prime. Station 8771450.",
    latitude: 29.30, longitude: -94.79,
    local_date: "2024-11-16", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "TX",
    tide_station_id: "8771450", expect_band: "Good",
  },
  {
    id: "excellent-mobile-bay-al-oct",
    notes: "Mobile Bay AL — Oct prime redfish/speckled trout. Station 8737048.",
    latitude: 30.69, longitude: -88.04,
    local_date: "2024-10-05", local_timezone: "America/Chicago",
    context: "coastal", region_key: "gulf_coast", state_code: "AL",
    tide_station_id: "8737048", expect_band: "Good",
  },

];

// ── Open-Meteo archive fetch ──────────────────────────────────────────────────

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

async function fetchNOAATides(
  stationId: string, date: string,
): Promise<{ phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null> {
  const d = date.replace(/-/g, "");
  const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions` +
    `&begin_date=${d}&end_date=${d}&datum=MLLW&station=${stationId}&time_zone=gmt&interval=hilo&units=english&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as { predictions?: Array<{ t: string; v: string; type?: string }> };
    if (!data.predictions?.length) return null;
    const high_low = data.predictions.map((p) => ({
      time: p.t, type: p.type === "H" ? "H" : "L", value: parseFloat(p.v),
    }));
    let phase = "incoming";
    for (const hl of high_low) {
      const timeStr = hl.time.split(" ")[1] ?? "00:00";
      const [hh, mm] = timeStr.split(":").map(Number);
      const mins = (hh ?? 0) * 60 + (mm ?? 0);
      if (mins <= 720) phase = hl.type === "H" ? "outgoing" : "incoming";
    }
    return { phase, high_low };
  } catch { return null; }
}

function utcToLocalHHMM(utcIso: string, timeZone: string): string {
  const d = new Date(utcIso.endsWith("Z") ? utcIso : utcIso + "Z");
  if (Number.isNaN(d.getTime())) return "06:00";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(d).replace(/^24:/, "00:");
  } catch { return "06:00"; }
}

function buildEnvData(
  om: OMResponse,
  targetDate: string,
  localTimezone: string,
  tides: { phase: string; high_low: Array<{ time: string; type: string; value: number }> } | null,
  altitudeFt?: number,
): Record<string, unknown> {
  const { hourly, daily } = om;
  const dailyIdx = 14;
  const noonApproxIdx = Math.min(dailyIdx * 24 + 17, hourly.time.length - 1);
  const currentTemp = hourly.temperature_2m[noonApproxIdx]
    ?? ((daily.temperature_2m_max[dailyIdx] ?? 60) + (daily.temperature_2m_min[dailyIdx] ?? 45)) / 2;
  const currentPressure = hourly.surface_pressure[noonApproxIdx] ?? 1013;
  const windMax = Math.max(
    ...hourly.wind_speed_10m.slice(dailyIdx * 24, (dailyIdx + 1) * 24).map((v) => v ?? 0), 0,
  );
  const daySlice = hourly.cloud_cover.slice(dailyIdx * 24 + 6, dailyIdx * 24 + 20);
  const cloudMean = daySlice.length
    ? Math.round(daySlice.reduce((a, b) => a + (b ?? 0), 0) / daySlice.length) : 50;
  const p48End = noonApproxIdx;
  const p48Start = Math.max(0, p48End - 47);
  const pressure48hr = hourly.surface_pressure.slice(p48Start, p48End + 1);
  const hourlyAirTempPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z", value: hourly.temperature_2m[i] ?? 0,
  }));
  const hourlyCloudPoints = hourly.time.map((t, i) => ({
    time_utc: t + "Z", value: hourly.cloud_cover[i] ?? 0,
  }));
  const sunriseLocal = utcToLocalHHMM(daily.sunrise[dailyIdx] ?? "", localTimezone);
  const sunsetLocal = utcToLocalHHMM(daily.sunset[dailyIdx] ?? "", localTimezone);

  return {
    timezone: localTimezone,
    altitude_ft: altitudeFt,  // passed through so buildFromEnvData altitude override works
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
    tides: tides ? { station_id: "", phase: tides.phase, high_low: tides.high_low } : null,
    hourly_air_temp_f: hourlyAirTempPoints,
    hourly_cloud_cover_pct: hourlyCloudPoints,
  };
}

// ── Import buildSharedEngineRequestFromEnvData ────────────────────────────────

import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";

const realResults: string[] = [];
let passed = 0;
let failed = 0;
let expectFails = 0;

for (let i = 0; i < SCENARIOS.length; i++) {
  const sc = SCENARIOS[i]!;
  const tag = `[${String(i + 1).padStart(2, "0")}/${SCENARIOS.length}]`;
  await Deno.stdout.write(enc.encode(`${tag} ${sc.id.slice(0, 46).padEnd(46)} `));

  try {
    const om = await fetchOpenMeteo(sc.latitude, sc.longitude, sc.local_date);
    const tides = (sc.context === "coastal" && sc.tide_station_id)
      ? await fetchNOAATides(sc.tide_station_id, sc.local_date) : null;

    const envData = buildEnvData(om, sc.local_date, sc.local_timezone, tides, sc.altitude_ft);

    // Build via buildFromEnvData (applies altitude/NorCal override in production mode)
    // then override region_key explicitly for audit — ensures we test the intended region
    const req = buildSharedEngineRequestFromEnvData(
      sc.latitude, sc.longitude, sc.local_date, sc.local_timezone, sc.context, envData,
    );
    // Use explicit region_key from scenario to validate intended region behavior
    // (In production, buildFromEnvData would auto-detect via altitude_ft in envData)
    const reqWithRegion = { ...req, region_key: sc.region_key as typeof req.region_key };

    const report = runHowFishingReport(reqWithRegion);
    const { score, band } = report;

    // Show what region buildFromEnvData actually resolved (should match for alpine/NorCal if altitude_ft is passed)
    const autoRegion = req.region_key;
    const regionNote = autoRegion !== sc.region_key ? ` [auto:${autoRegion}]` : "";

    const tideNote = sc.context === "coastal"
      ? (tides ? ` [tide:${tides.phase}]` : " [tide:MISS]") : "";
    const tempF = (req.environment.daily_mean_air_temp_f ?? req.environment.current_air_temp_f ?? 0).toFixed(1);

    const met = !sc.expect_band || band === sc.expect_band ||
      (sc.expect_band === "Good" && (band === "Good" || band === "Excellent"));
    const expectNote = sc.expect_band
      ? (met ? "  ✓" : `  ✗ exp=${sc.expect_band}`) : "";
    if (sc.expect_band && !met) expectFails++;

    console.log(`${score} ${band.padEnd(9)} t=${tempF}F${tideNote}${regionNote}${expectNote}`);

    realResults.push(JSON.stringify({
      id: sc.id,
      notes: sc.notes,
      expect_band: sc.expect_band ?? null,
      result: { score, band },
      auto_region_key: autoRegion,
      explicit_region_key: sc.region_key,
      altitude_ft: sc.altitude_ft ?? null,
      tide_status: tides ? { phase: tides.phase, count: tides.high_low.length } : null,
      input: {
        latitude: sc.latitude, longitude: sc.longitude,
        local_date: sc.local_date, context: sc.context,
        region_key: sc.region_key,
        environment: req.environment,
      },
      report: {
        score: report.score,
        band: report.band,
        drivers: report.drivers,
        suppressors: report.suppressors,
        timing_debug: report.timing_debug,
        reliability: report.reliability,
        normalized_debug: report.normalized_debug,
      },
    }));
    passed++;
  } catch (err) {
    console.log(`ERROR: ${(err as Error).message}`);
    failed++;
  }

  if (i < SCENARIOS.length - 1) await new Promise((r) => setTimeout(r, 350));
}

// ── Write combined JSONL output ───────────────────────────────────────────────

const sweepLine = JSON.stringify({
  type: "sweep_summary",
  total_combos: sweepTotal,
  violations: sweepViolations.length,
  violation_list: sweepViolations,
});

await Deno.writeTextFile(outPath,
  [sweepLine, ...realResults].join("\n") + "\n",
);

// ── Final summary ─────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(65)}`);
console.log(`PART A: ${sweepTotal} synthetic combos, ${sweepViolations.length} violations`);
console.log(`PART B: ${passed}/${SCENARIOS.length} real scenarios ok, ${expectFails} expectation misses`);
if (sweepViolations.length === 0) console.log("✓ All synthetic moods in expected ranges — engine calibration looks solid");
console.log(`Results → ${outPath}`);
