/**
 * Targeted coverage: HI/AK, alpine altitude, PNW strips, sparse env, marginal coastal tide.
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/edgeCoverageAudit.test.ts
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";
import { resolveRegionForCoordinates } from "../context/resolveRegion.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";
import { CANONICAL_REGION_KEYS } from "../contracts/region.ts";

function pad2(m: number): string {
  return m < 10 ? `0${m}` : `${m}`;
}

Deno.test("resolveRegion: Hawaii and Alaska use dedicated region keys", () => {
  const honolulu = resolveRegionForCoordinates(21.3, -157.85);
  assertEquals(honolulu.state_code, "HI");
  assertEquals(honolulu.region_key, "hawaii");

  const anchorage = resolveRegionForCoordinates(61.2, -149.9);
  assertEquals(anchorage.state_code, "AK");
  assertEquals(anchorage.region_key, "alaska");
});

Deno.test("buildFromEnvData: Dillon with altitude_ft → mountain_alpine; without → not alpine", () => {
  const baseEnv = {
    timezone: "America/Denver",
    weather: {
      temperature: 55,
      pressure: 1012,
      wind_speed: 8,
      cloud_cover: 40,
      temp_7day_high: Array(15).fill(58),
      temp_7day_low: Array(15).fill(40),
      precip_7day_daily: Array(15).fill(0),
      pressure_48hr: Array(24).fill(1012),
    },
  };
  const withAlt = buildSharedEngineRequestFromEnvData(
    39.63,
    -106.07,
    "2024-09-20",
    "America/Denver",
    "freshwater_lake_pond",
    { ...baseEnv, altitude_ft: 9017 },
  );
  assertEquals(withAlt.region_key, "mountain_alpine");

  const noAlt = buildSharedEngineRequestFromEnvData(
    39.63,
    -106.07,
    "2024-09-20",
    "America/Denver",
    "freshwater_lake_pond",
    { ...baseEnv },
  );
  assert(noAlt.region_key === "mountain_west" || noAlt.region_key === "mountain_alpine");
  assertEquals(noAlt.region_key, "mountain_west");
});

Deno.test("buildFromEnvData: Baker City OR (east of -118.2°) → inland_northwest; Seattle → pacific_northwest", () => {
  const env = {
    timezone: "America/Los_Angeles",
    weather: {
      temperature: 52,
      pressure: 1013,
      wind_speed: 7,
      cloud_cover: 50,
      temp_7day_high: Array(15).fill(55),
      temp_7day_low: Array(15).fill(38),
      precip_7day_daily: Array(15).fill(0.05),
      pressure_48hr: Array(24).fill(1013),
    },
  };
  const baker = buildSharedEngineRequestFromEnvData(
    44.77,
    -117.83,
    "2024-04-18",
    "America/Los_Angeles",
    "freshwater_river",
    env,
  );
  assertEquals(baker.region_key, "inland_northwest");

  const seattle = buildSharedEngineRequestFromEnvData(
    47.61,
    -122.33,
    "2024-03-22",
    "America/Los_Angeles",
    "freshwater_lake_pond",
    env,
  );
  assertEquals(seattle.region_key, "pacific_northwest");
});

Deno.test("sparse env: wind + cloud only — engine runs all months; reliability often low", () => {
  for (let month = 1; month <= 12; month++) {
    const req = buildSharedEngineRequestFromEnvData(
      41.5,
      -86.2,
      `2026-${pad2(month)}-12`,
      "America/Chicago",
      "freshwater_lake_pond",
      { timezone: "America/Chicago", weather: { wind_speed: 8, cloud_cover: 45 } },
    );
    const report = runHowFishingReport(req);
    assert(["Poor", "Fair", "Good", "Excellent"].includes(report.band));
    assertEquals(typeof report.score, "number");
    if (report.reliability === "low") {
      assert(
        report.normalized_debug?.missing_variables.length! >= 1,
        `month ${month}: low reliability should list gaps`,
      );
    }
  }
});

Deno.test("coastal marginal tide payload — weak current, stage only, empty high/low", () => {
  const report = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2024-05-10",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 78,
      prior_day_mean_air_temp_f: 76,
      pressure_history_mb: [1012, 1011.5],
      wind_speed_mph: 14,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.15,
      tide_movement_state: "incoming",
      tide_station_id: "8771341",
      current_speed_knots_max: 0.15,
      tide_high_low: [],
    },
    data_coverage: {},
  });
  assertEquals(report.context, "coastal");
  assert(["Poor", "Fair", "Good", "Excellent"].includes(report.band));
});

Deno.test("CANONICAL_REGION_KEYS includes alaska and hawaii (18 total)", () => {
  assertEquals(CANONICAL_REGION_KEYS.includes("alaska"), true);
  assertEquals(CANONICAL_REGION_KEYS.includes("hawaii"), true);
  assertEquals(CANONICAL_REGION_KEYS.length, 18);
});
