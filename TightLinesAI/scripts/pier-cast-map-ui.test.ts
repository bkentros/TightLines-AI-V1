import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mapScreen = readFileSync(
  new URL("../app/pier-cast-map.tsx", import.meta.url),
  "utf8",
);
const reportScreen = readFileSync(
  new URL("../app/pier-cast-review.tsx", import.meta.url),
  "utf8",
);
const mapStore = readFileSync(
  new URL("../store/pierCastMapStore.ts", import.meta.url),
  "utf8",
);
const routeLayout = readFileSync(
  new URL("../app/_layout.tsx", import.meta.url),
  "utf8",
);

test("Pass 2 map consumes the synchronized five-lake foundation", () => {
  assert.match(mapScreen, /fetchPierCastMapFoundation/);
  assert.doesNotMatch(mapScreen, /fetchPierCastTemperatureMap/);
  assert.match(mapScreen, /buildPierCastGreatLakesTemperatureRasterFrames/);
  assert.match(mapScreen, /buildPierCastBathymetryRasterFrames/);
  assert.match(mapScreen, /buildPierCastWindArrowGeoJson/);
  assert.match(mapScreen, /temperatureRasterFrames\.map/);
  assert.match(mapScreen, /bathymetryRasterFrames\.map/);
});

test("Pass 2 exposes clean base layers, optional wind, and a true drag timeline", () => {
  assert.match(mapScreen, /setMode\("score"\)/);
  assert.match(mapScreen, /setMode\("temperature"\)/);
  assert.match(mapScreen, /setMode\("bathymetry"\)/);
  assert.match(mapScreen, /accessibilityRole="switch"/);
  assert.match(mapScreen, /pier-cast-wind-arrow-color/);
  assert.match(mapScreen, /PanResponder\.create/);
  assert.match(mapScreen, /onPanResponderMove/);
  assert.match(mapScreen, /\[0, 24, 48, 72, 96, 120\]/);
  assert.match(mapStore, /windVisible: true/);
  assert.match(mapStore, /zoom: 3\.35/);
});

test("Pass 3 adds shoreline wind intelligence without changing map scoring", () => {
  assert.match(mapScreen, /buildPierCastCityWindInsights/);
  assert.match(mapScreen, /ANGLER WIND LENS/);
  assert.match(mapScreen, /windInsight\.setupLabel/);
  assert.match(mapScreen, /rough-water caution/);
  assert.match(mapScreen, /cityWindInsights\.get/);
  assert.doesNotMatch(mapScreen, /setScore|updateScore|calculateScore/);
});

test("map and report retain the required dedicated-screen back stack", () => {
  assert.match(routeLayout, /name="pier-cast-map"/);
  assert.match(mapScreen, /pathname: "\/pier-cast-review"/);
  assert.match(mapScreen, /from: "map"/);
  assert.match(reportScreen, /returnToMap/);
  assert.match(reportScreen, /Back to PierCast visual map/);
  assert.match(reportScreen, /router\.back\(\)/);
});
