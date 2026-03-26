/**
 * Same env + date + context → identical score/band (regression guard for engine purity).
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/scoreDeterminism.test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";
import { runHowFishingReport, runHowFishingScoreOnly } from "../runHowFishingReport.ts";

const fixtureEnv = {
  weather: {
    temperature: 72,
    pressure: 1013,
    wind_speed: 10,
    cloud_cover: 40,
    temp_7day_high: Array.from({ length: 21 }, () => 70),
    temp_7day_low: Array.from({ length: 21 }, () => 55),
    precip_7day_daily: Array.from({ length: 21 }, () => 0),
    precip_7day_inches: 0,
  },
};

Deno.test("runHowFishingReport: duplicate calls same score and band", () => {
  const req = buildSharedEngineRequestFromEnvData(
    32.7767,
    -79.9309,
    "2026-06-01",
    "America/New_York",
    "freshwater_lake_pond",
    fixtureEnv,
    0,
  );
  const a = runHowFishingReport(req);
  const b = runHowFishingReport(req);
  assertEquals(a.score, b.score);
  assertEquals(a.band, b.band);
});

Deno.test("runHowFishingScoreOnly matches runHowFishingReport.score", () => {
  const req = buildSharedEngineRequestFromEnvData(
    32.7767,
    -79.9309,
    "2026-06-01",
    "America/New_York",
    "freshwater_lake_pond",
    fixtureEnv,
    0,
  );
  assertEquals(runHowFishingScoreOnly(req), runHowFishingReport(req).score);
});
