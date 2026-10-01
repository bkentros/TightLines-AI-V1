import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mapScreen = readFileSync(
  new URL("../legacy/pier-cast-map-v1.tsx", import.meta.url) /* retired first map; the live screen is app/pier-cast-map.tsx */,
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

test("map exposes v4 condition layers, optional wind, and a true drag timeline", () => {
  assert.match(mapScreen, /setMode\("match"\)/);
  assert.match(mapScreen, /setMode\("temperature"\)/);
  assert.match(mapScreen, /setMode\("bathymetry"\)/);
  assert.match(mapScreen, /chooseTimeMode/);
  assert.match(mapScreen, /"now", "forecast"/);
  assert.match(mapScreen, /accessibilityRole="switch"/);
  assert.match(mapScreen, /pier-cast-wind-arrow-color/);
  assert.match(mapScreen, /PanResponder\.create/);
  assert.match(mapScreen, /onPanResponderMove/);
  assert.match(mapScreen, /\[0, 24, 48, 72, 96\]/);
  assert.match(mapStore, /windVisible: true/);
  assert.match(mapStore, /mode: "temperature"/);
  assert.match(mapStore, /timeMode: "now"/);
  assert.match(mapStore, /zoom: 3\.35/);
});

test("shoreline wind intelligence remains independent of map conditions", () => {
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
  assert.match(reportScreen, /Back to PierCast conditions map/);
  assert.match(reportScreen, /router\.back\(\)/);
});
