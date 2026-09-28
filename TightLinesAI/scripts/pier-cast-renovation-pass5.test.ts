import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contract = read("lib/pierCastConditionsV4.ts");
const archive = read(
  "supabase/functions/_shared/pierCastEngine/archive/temperatureObservations.ts",
);
const sources = read(
  "supabase/functions/_shared/pierCastEngine/config/representationCalibration.ts",
);
const migration = read(
  "supabase/migrations/20260927120000_publish_pier_cast_observed_temperature_map.sql",
);
const handler = read("supabase/functions/pier-cast/handler.ts");
const client = read("lib/pierCast.ts");
const map = read("app/pier-cast-map.tsx");
const mapStore = read("store/pierCastMapStore.ts");

test("observation response preserves the complete frozen public contract", () => {
  for (const field of [
    "readingId",
    "stationId",
    "datasetId",
    "displayName",
    "provider",
    "latitude",
    "longitude",
    "observedAt",
    "temperatureC",
    "reportedValue",
    "reportedUnit",
    "temperatureVariable",
    "measurementDepthM",
    "quality",
    "qualityFlag",
    "freshness",
    "sourceUrl",
  ]) {
    assert.match(contract, new RegExp(`${field}:`));
  }
  assert.match(contract, /piercast-observed-temperature-map-v1/);
});

test("public station inventory has explicit audited identity and coordinates", () => {
  for (const datasetId of ["obs_62", "obs_671", "obs_709"]) {
    assert.match(sources, new RegExp(`datasetId: "${datasetId}"`));
  }
  assert.match(sources, /stationId: "glos-obs-671"/);
  assert.match(sources, /displayName: "Grand Haven Spotter buoy"/);
  assert.match(sources, /latitude: 43\.002254486083984/);
  assert.match(sources, /measurementDepthM: null/);
});

test("archive admits plausible missing-QC values without calling them passed", () => {
  assert.match(archive, /aggregateQualityFlag !== null && aggregateQualityFlag !== 1/);
  assert.match(archive, /flag === 1 \? "passed" as const : "not_evaluated" as const/);
  assert.match(archive, /temperatureC < -2 \|\|[\s\S]*temperatureC > 40/);
  assert.match(archive, /flag === false/);
});

test("latest-reading RPC is bounded, service-only, and never exposes rejected rows", () => {
  assert.match(migration, /read_pier_cast_observed_temperature_map/);
  assert.match(migration, /p_not_after - p_not_before > interval '31 days'/);
  assert.match(migration, /record_status = 'usable'/);
  assert.match(migration, /temperature_c between -2 and 40/);
  assert.match(migration, /auth\.role\(\) <> 'service_role'/);
  assert.match(migration, /revoke all .*from public, anon, authenticated/s);
});

test("observation API is public, cacheable, and separate from modeled map APIs", () => {
  assert.match(client, /fetchPierCastObservedTemperatureMap/);
  assert.match(client, /pierCastGet\("observations\/temperature-map", false\)/);
  assert.match(handler, /readObservedTemperatureMap/);
  assert.match(handler, /pier_cast_observations_unavailable/);
  assert.match(handler, /observedTemperatureMap/);
});

test("map defaults observations off and renders them only in Now", () => {
  assert.match(mapStore, /observationsVisible: false/);
  assert.match(map, /observedStationsVisible = timeMode === "now" && observationsVisible/);
  assert.match(map, /OBS \{timeMode === "now"/);
  assert.match(map, /: "NOW ONLY"/);
  assert.match(map, /ObservedTemperatureMarker/);
});

test("station details distinguish points from the continuous modeled surface", () => {
  assert.match(map, /COLORED SURFACE = MODELED/);
  assert.match(map, /OUTLINED POINTS = OBSERVED STATIONS/);
  assert.match(map, /POINT READING · NOT A PIER, HARBOR, OR LAKE-WIDE TEMPERATURE/);
  assert.match(map, /QC \{selectedObservation\.quality === "passed"/);
  assert.match(map, /DEPTH NOT REPORTED/);
  assert.match(map, /VIEW GLOS \/ SEAGULL SOURCE/);
});

test("observation availability cannot alter rankings or fail the core map", () => {
  assert.match(map, /Promise\s*\.allSettled/);
  assert.match(map, /fetchPierCastObservedTemperatureMap\(\)/);
  assert.match(map, /MODELED LAYERS STILL WORK · TAP TO RETRY/);
  assert.doesNotMatch(archive, /rankingScore|sortPierCastLeaderboard|thermalMatch/);
  assert.match(map, /OBSERVATIONS NEVER AFFECT RANKING/);
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
