import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastConditionsMapCities,
  closestPierCastTemperatureTime,
  pierCastAvailableMapMatchBand,
  pierCastForecastMapValidTimes,
  pierCastSynchronizedConditionsMapValidTimes,
} from "../lib/pierCastMap";
import type {
  PierCastCatalogResponse,
  PierCastMapFoundationResponse,
} from "../lib/pierCastContracts";
import {
  buildPierCastConditionsV4Outlook,
  projectPierCastConditionsMapV4,
  type PierCastConditionsV4SourceOutlook,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4";

const mapScreen = read("app/pier-cast-map.tsx");
const mapStore = read("store/pierCastMapStore.ts");
const client = read("lib/pierCast.ts");
const handler = read("supabase/functions/pier-cast/handler.ts");
const contract = read("docs/PierCast_Renovation_Pass1_Product_Contract.md");

const validTimes = Array.from({ length: 121 }, (_, index) =>
  new Date(Date.parse("2026-09-27T06:00:00.000Z") + index * 3_600_000)
    .toISOString()
);

const source: PierCastConditionsV4SourceOutlook = {
  generatedAt: "2026-09-27T12:12:00.000Z",
  source: {
    status: "fresh_archived_complete_cycle",
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt: validTimes[0]!,
    fetchedAt: "2026-09-27T12:00:00.000Z",
    cycleAgeHours: 6,
  },
  cities: [{
    cityId: "grand_haven_mi",
    dates: [{ localDate: "2026-09-27" }],
    temperatureTimeline: validTimes.map((validAt, index) => ({
      validAt,
      temperatureC: 10 + index / 100,
    })),
  }],
};

test("public map projection is useful without a target and never invents a match", () => {
  const response = projectPierCastConditionsMapV4(
    buildPierCastConditionsV4Outlook(source),
    null,
  );
  assert.equal(response.selectionRequiredForMatch, true);
  assert.equal(response.selectedSpeciesId, null);
  assert.equal(response.cities.length, 1);
  assert.equal(response.cities[0]?.temperatureTimeline.length, 121);
  assert.equal(response.cities[0]?.selectedSpecies, null);
  assert.ok(response.targetSpecies.length > 0);
});

test("selected map projection evaluates the species at every coherent model hour", () => {
  const response = projectPierCastConditionsMapV4(
    buildPierCastConditionsV4Outlook(source),
    "chinook_salmon",
  );
  const selected = response.cities[0]?.selectedSpecies;
  assert.equal(response.selectionRequiredForMatch, false);
  assert.equal(selected?.speciesId, "chinook_salmon");
  assert.equal(selected?.frames.length, 121);
  assert.deepEqual(
    selected?.frames.map((frame) => frame.validAt),
    validTimes,
  );
  assert.ok(selected?.frames.every((frame) =>
    frame.thermalMatch.status === "available" &&
    frame.seasonalOutlook.status === "available"
  ));
  assert.ok(selected?.frames.every((frame) =>
    frame.thermalMatch.sourceKind === "model"
  ));
});

test("client city markers join only the exact synchronized hour", () => {
  const response = projectPierCastConditionsMapV4(
    buildPierCastConditionsV4Outlook(source),
    "chinook_salmon",
  );
  const catalog = {
    cities: [{
      cityId: "grand_haven_mi",
      displayName: "Grand Haven",
      stateCode: "MI",
      releaseStatus: "public_research",
    }],
  } as unknown as Pick<PierCastCatalogResponse, "cities">;
  const exact = buildPierCastConditionsMapCities(catalog, response, validTimes[9]!);
  assert.equal(exact[0]?.validAt, validTimes[9]);
  assert.equal(exact[0]?.temperatureC, 10.09);
  assert.equal(exact[0]?.speciesFrame?.validAt, validTimes[9]);

  const missing = buildPierCastConditionsMapCities(
    catalog,
    response,
    "2026-09-27T06:30:00.000Z",
  );
  assert.equal(missing[0]?.temperatureC, null);
  assert.equal(missing[0]?.speciesFrame, null);
});

test("restricted or incomplete species frames never receive a Match color", () => {
  const response = projectPierCastConditionsMapV4(
    buildPierCastConditionsV4Outlook(source),
    "chinook_salmon",
  );
  const frame = response.cities[0]?.selectedSpecies?.frames[0];
  assert.ok(frame);
  assert.equal(
    pierCastAvailableMapMatchBand(frame),
    frame.rankingDisposition === "ranked" && frame.thermalMatch.status === "available"
      ? frame.thermalMatch.band
      : null,
  );
  assert.equal(pierCastAvailableMapMatchBand({
    ...frame,
    targetingEligibility: "restricted",
    rankingDisposition: "blocked",
  }), null);
  assert.equal(pierCastAvailableMapMatchBand({
    ...frame,
    rankingDisposition: "unranked",
  }), null);
  assert.match(mapScreen, /pierCastAvailableMapMatchBand/);
  assert.match(mapScreen, /TARGETING RESTRICTED/);
});

test("Now chooses one nearest coherent frame and Forecast excludes past frames", () => {
  const conditions = projectPierCastConditionsMapV4(
    buildPierCastConditionsV4Outlook(source),
    "chinook_salmon",
  );
  const foundation = {
    timeline: { frameCount: 121, validTimes },
  } as unknown as PierCastMapFoundationResponse;
  const synchronized = pierCastSynchronizedConditionsMapValidTimes(
    foundation,
    conditions,
  );
  assert.deepEqual(synchronized, validTimes);
  const now = closestPierCastTemperatureTime(
    synchronized,
    "2026-09-27T11:35:00.000Z",
  );
  assert.equal(now, "2026-09-27T12:00:00.000Z");
  const forecast = pierCastForecastMapValidTimes(synchronized, now);
  assert.equal(forecast[0], now);
  assert.equal(forecast.length, 115);
  assert.ok(forecast.every((validAt) => Date.parse(validAt) >= Date.parse(now!)));
});

test("map production path uses Match, Temp, and Depth without legacy score markers", () => {
  assert.match(mapScreen, /fetchPierCastConditionsMap/);
  assert.match(mapScreen, /buildPierCastConditionsMapCities/);
  assert.match(mapScreen, />\s*MATCH\s*</);
  assert.match(mapScreen, />\s*TEMP\s*</);
  assert.match(mapScreen, />\s*DEPTH\s*</);
  assert.match(mapScreen, /MARKER FILL = TEMPERATURE MATCH/);
  assert.match(mapScreen, /CENTER = MODELED °F/);
  assert.doesNotMatch(mapScreen, /fetchPierCastLeaderboard/);
  assert.doesNotMatch(mapScreen, /entry\.score/);
  assert.doesNotMatch(mapScreen, /out of 10/);
  assert.doesNotMatch(mapScreen, />\s*SCORE\s*</);
});

test("Now and Forecast have distinct truthful interaction contracts", () => {
  assert.match(mapStore, /timeMode: "now"/);
  assert.match(mapScreen, /CLOSEST MODEL HOUR/);
  assert.match(mapScreen, /HOURLY MODEL GUIDANCE/);
  assert.match(mapScreen, /timeMode === "forecast"/);
  assert.match(mapScreen, /SWITCH TO FORECAST TO SCRUB OR PLAY/);
  assert.doesNotMatch(mapScreen, />\s*LIVE\s*</);
  assert.match(contract, /uses \*\*Now\*\*, not \*\*Live\*\*/);
});

test("Match prompts for a target without changing the camera", () => {
  assert.match(mapScreen, /MATCH REQUIRES A TARGET/);
  assert.match(mapScreen, /What are you targeting\?/);
  assert.match(mapScreen, /The camera will not move/);
  assert.match(mapScreen, /writePierCastTargetPreference/);
  assert.match(mapScreen, /router\.setParams\(\{ speciesId \}\)/);
  const promptStart = mapScreen.indexOf("const selectTarget");
  const promptEnd = mapScreen.indexOf("const openCity", promptStart);
  const selectionBody = mapScreen.slice(promptStart, promptEnd);
  assert.doesNotMatch(selectionBody, /fitBounds|zoomTo|setSavedView/);
});

test("temperature raster and wind remain synchronized in Match and Temp", () => {
  assert.match(mapScreen, /mode !== "bathymetry"/);
  assert.match(mapScreen, /buildPierCastGreatLakesTemperatureRasterFrames/);
  assert.match(mapScreen, /pierCastWindFrame\(foundation, activeValidAt\)/);
  assert.match(mapScreen, /rasterOpacityTransition/);
  assert.match(mapScreen, /rasterResampling: "linear"/);
  assert.match(mapScreen, /Wind: Open-Meteo/);
});

test("versioned public map endpoint accepts optional species and remains anonymous", () => {
  assert.match(client, /conditions\/map/);
  assert.match(client, /fetchPierCastConditionsMap/);
  assert.match(client, /pierCastGet\(`conditions\/map\$\{query\}`, false\)/);
  assert.match(handler, /readConditionsMap/);
  assert.match(handler, /const conditionsMap = url\.pathname\.endsWith/);
  assert.match(handler, /validatedSpeciesId/);
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
