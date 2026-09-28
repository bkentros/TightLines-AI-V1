import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastConditionsMapCities,
  pierCastAvailableMapMatchBand,
} from "../lib/pierCastMap";
import { buildPierCastWindFlowGeoJson } from "../lib/pierCastWind";
import type {
  PierCastConditionsCatalogResponseV4,
  PierCastConditionsMapResponseV4,
} from "../lib/pierCastConditionsV4";

const map = read("app/pier-cast-map.tsx");
const store = read("store/pierCastMapStore.ts");
const decision = read("docs/PierCast_Refinement_Pass3_Map.md");
const matrix = JSON.parse(read("docs/PierCast_Refinement_Pass3_Visual_Matrix.json"));

test("persistent map target control opens in place without changing camera or forecast hour", () => {
  assert.match(map, /MATCH TARGET/);
  assert.match(map, /styles\.targetControlChip/);
  assert.match(map, /Open species selector without moving the map or forecast hour/);
  assert.match(map, /PIER_CAST_SPECIES_LABELS\[selectedSpeciesId\]\.toUpperCase/);
  assert.match(map, /setTargetPromptVisible\(true\)/);
  const selection = map.slice(map.indexOf("const selectTarget"), map.indexOf("const toggleWindPresentation"));
  assert.match(selection, /writePierCastTargetPreference/);
  assert.match(selection, /router\.setParams\(\{ speciesId \}\)/);
  assert.doesNotMatch(selection, /fitBounds|zoomTo|setSelectedValidAt|setSavedView/);
});

test("unsupported city markers offer only that city's targets instead of opening a dead end", () => {
  assert.match(map, /mapCitySupportedSpeciesIds/);
  assert.match(map, /setPendingReportCityId\(entry\.city\.cityId\)/);
  assert.match(map, /CHOOSE A SUPPORTED TARGET/);
  assert.match(map, /mapCitySupportedSpeciesIds\(city\)\.includes\(option\.speciesId\)/);
  assert.match(map, /TARGET OPTIONS ARE TEMPORARILY UNAVAILABLE/);
  assert.match(map, /cityId: reportCityId[\s\S]*speciesId/);
});

test("forecast frame changes city temperature and selected-species marker color inputs together", () => {
  const times = ["2026-09-28T12:00:00.000Z", "2026-09-29T12:00:00.000Z"];
  const catalog = {
    cities: [{
      cityId: "test_city",
      displayName: "Test City",
      stateCode: "MI",
      releaseStatus: "public_research",
      supportedSpeciesIds: ["chinook_salmon"],
    }],
  } as unknown as PierCastConditionsCatalogResponseV4;
  const response = {
    cities: [{
      cityId: "test_city",
      latitude: 43,
      longitude: -86,
      temperatureTimeline: [
        { validAt: times[0], temperatureC: 5, sourceKind: "model" },
        { validAt: times[1], temperatureC: 13, sourceKind: "model" },
      ],
      selectedSpecies: {
        speciesId: "chinook_salmon",
        frames: [
          frame(times[0]!, 5, "poor"),
          frame(times[1]!, 13, "excellent"),
        ],
      },
    }],
  } as unknown as PierCastConditionsMapResponseV4;
  const first = buildPierCastConditionsMapCities(catalog, response, times[0]!)[0]!;
  const second = buildPierCastConditionsMapCities(catalog, response, times[1]!)[0]!;
  assert.equal(first.validAt, times[0]);
  assert.equal(second.validAt, times[1]);
  assert.notEqual(first.temperatureF, second.temperatureF);
  assert.equal(pierCastAvailableMapMatchBand(first.speciesFrame), "poor");
  assert.equal(pierCastAvailableMapMatchBand(second.speciesFrame), "excellent");
});

test("wind particles preserve exact frame metadata and travel direction", () => {
  const point = {
    nodeId: "michigan_flow_001",
    lakeId: "michigan" as const,
    latitude: 43,
    longitude: -87,
    validAt: "2026-09-28T18:00:00.000Z",
    speedMph: 18,
    directionDegrees: 270,
    gustMph: 27,
  };
  const first = buildPierCastWindFlowGeoJson([point], 5, 0.1);
  const second = buildPierCastWindFlowGeoJson([point], 5, 0.4);
  assert.equal(first.features.length, 1);
  assert.equal(first.features[0]?.properties.validAt, point.validAt);
  assert.equal(first.features[0]?.properties.travelDirectionDegrees, 90);
  assert.equal(first.features[0]?.properties.particleCount, 2);
  assert.ok(first.features[0]!.geometry.coordinates.length >= 2);
  for (const segment of first.features[0]!.geometry.coordinates) {
    assert.ok(segment[1]![0] >= segment[0]![0], "west wind particles must travel east");
  }
  assert.notDeepEqual(first.features[0]?.geometry, second.features[0]?.geometry);
  assert.equal(buildPierCastWindFlowGeoJson([{ ...point, speedMph: Number.NaN }], 5, 0).features.length, 0);
});

test("animated wind is isolated, synchronized, and has accessibility and power fallbacks", () => {
  assert.match(map, /function WindFlowLayer/);
  assert.match(map, /buildPierCastWindFlowGeoJson\(points, zoom, phase\)/);
  assert.match(map, /setInterval[\s\S]*64/);
  assert.match(map, /pierCastWindFrame\(foundation, activeValidAt\)/);
  assert.match(map, /pier-cast-wind-flow-particles/);
  assert.match(map, /pier-cast-wind-arrow-color/);
  assert.match(map, /AccessibilityInfo\.isReduceMotionEnabled/);
  assert.match(map, /reduceMotionChanged/);
  assert.match(map, /windPresentation === "flow" && !reduceMotion &&[\s\S]*mapIsActive && mapFocused/);
  assert.match(map, /FLOW[\s\S]*ARROWS · REDUCED MOTION/);
  assert.match(store, /windPresentation: "flow"/);
  assert.match(decision, /does not interpolate wind speed, direction, gusts/i);
});

test("Now, Forecast, observations, model layers, and map disclosures remain truthful", () => {
  assert.match(map, /CLOSEST MODEL HOUR/);
  assert.match(map, /HOURLY MODEL GUIDANCE/);
  assert.match(map, /timeMode === "now" && observationsVisible/);
  assert.match(map, /COLORED SURFACE = MODELED/);
  assert.match(map, /OBSERVATIONS NEVER AFFECT RANKING/);
  assert.match(map, /NOAA MODELED SURFACE WATER/);
  assert.match(map, /NOT FOR NAVIGATION/);
  assert.match(map, /SWITCH TO FORECAST TO SCRUB OR PLAY/);
  assert.match(decision, /No live deployment/i);
});

test("Pass 4 visual matrix covers map permutations and synchronization acceptance", () => {
  assert.equal(matrix.schemaVersion, "piercast-refinement-pass3-visual-matrix-v1");
  assert.deepEqual(matrix.viewports.map((entry: { id: string }) => entry.id), ["small", "standard", "large"]);
  for (const key of ["timeModes", "layers", "targetStates", "windStates", "observationStates", "mapStates", "zoomLevels"]) {
    assert.ok(matrix.requiredPermutations[key].length >= 3, `${key} lacks coverage`);
  }
  assert.ok(matrix.synchronizationChecks.length >= 5);
  assert.ok(matrix.visualChecks.length >= 6);
  assert.ok(matrix.performanceChecks.length >= 5);
  assert.match(matrix.releaseBoundary, /does not authorize deployment/i);
});

function frame(validAt: string, temperatureC: number, band: "poor" | "excellent") {
  return {
    validAt,
    targetingEligibility: "eligible",
    rankingDisposition: "ranked",
    seasonalOutlook: {
      status: "available",
      band: "good",
      stage: "active",
      trend: "steady",
      value: 0.6,
    },
    thermalMatch: {
      status: "available",
      band,
      value: band === "excellent" ? 0.9 : 0.1,
      temperatureC,
      distanceFromOptimumC: band === "excellent" ? 0 : 8,
      optimumRangeC: [10, 14],
      sourceKind: "model",
    },
    localFisheryContext: { status: "unavailable" },
  };
}

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
