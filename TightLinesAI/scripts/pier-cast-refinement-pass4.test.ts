import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PierCastContractError,
  validatePierCastConditionsCatalog,
  validatePierCastConditionsLeaderboard,
  validatePierCastConditionsMap,
  validatePierCastMapFoundation,
  validatePierCastObservedTemperatureMap,
  validatePierCastSavedReportEnvelope,
  validatePierCastSavedReportRead,
} from "../lib/pierCastConditionsValidation";
import {
  PIER_CAST_WIND_FLOW_DETAIL_INTERVAL_MS,
  buildPierCastWindFlowGeoJson,
  filterPierCastWindPointsForView,
  pierCastWindFlowIntervalMs,
} from "../lib/pierCastWind";
import { PIER_CAST_WIND_GRID } from "../lib/pierCastWindGrid.generated";

const map = read("legacy/pier-cast-map-v1.tsx") /* retired first map */;
const report = read("app/pier-cast-review.tsx");
const client = read("lib/pierCast.ts");
const appConfig = JSON.parse(read("app.json"));
const easConfig = JSON.parse(read("eas.json"));
const packageLock = JSON.parse(read("package-lock.json"));
const audit = read("docs/PierCast_Refinement_Passes1-4_Audit.md");
const readiness = JSON.parse(
  read("docs/PierCast_Refinement_Pass4_Release_Evidence.json"),
);

test("all renovated responses fail closed on incompatible contracts", () => {
  const invalid = { schemaVersion: "retired" };
  for (const validate of [
    validatePierCastConditionsCatalog,
    validatePierCastConditionsLeaderboard,
    validatePierCastConditionsMap,
    validatePierCastMapFoundation,
    validatePierCastObservedTemperatureMap,
    validatePierCastSavedReportEnvelope,
    validatePierCastSavedReportRead,
  ]) {
    assert.throws(() => validate(invalid as never), PierCastContractError);
  }
  assert.match(client, /validatePierCastConditionsCatalog/);
  assert.match(client, /validatePierCastConditionsLeaderboard/);
  assert.match(client, /validatePierCastConditionsMap/);
  assert.match(client, /validatePierCastMapFoundation/);
  assert.match(client, /validatePierCastObservedTemperatureMap/);
  assert.match(client, /validatePierCastSavedReportEnvelope/);
  assert.match(client, /validatePierCastSavedReportRead/);
});

test("catalog validation requires the v2 supported-target roster", () => {
  const valid = {
    schemaVersion: "piercast-conditions-catalog-v2",
    disclosure: "test",
    cities: [{
      cityId: "test_city",
      displayName: "Test City",
      supportedSpeciesIds: ["chinook_salmon"],
    }],
  };
  assert.equal(validatePierCastConditionsCatalog(valid).cities.length, 1);
  assert.throws(
    () => validatePierCastConditionsCatalog({
      ...valid,
      cities: [{ cityId: "test_city", displayName: "Test City" }],
    }),
    PierCastContractError,
  );
  assert.match(report, /citySupportsSpecies/);
  assert.match(
    report,
    /Array\.isArray\(city\.supportedSpeciesIds\)[\s\S]*city\.supportedSpeciesIds\.includes/,
  );
});

test("species-specific responses reject cross-target or stale payloads", () => {
  const shared = {
    schemaVersion: "piercast-conditions-v4",
    formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
    generatedAt: "2026-09-28T12:00:00.000Z",
    selectedSpeciesId: "chinook_salmon",
    targetSpecies: [],
    cities: [],
    disclosure: "test",
  };
  const leaderboard = {
    ...shared,
    rankingVersion: "species-seasonal-band-then-thermal-v1",
    selectionRequired: false,
  };
  assert.equal(
    validatePierCastConditionsLeaderboard(
      leaderboard,
      "chinook_salmon",
    ).selectedSpeciesId,
    "chinook_salmon",
  );
  assert.throws(
    () => validatePierCastConditionsLeaderboard(leaderboard, "coho_salmon"),
    PierCastContractError,
  );
  assert.throws(
    () => validatePierCastConditionsLeaderboard({
      ...leaderboard,
      cities: [{ speciesId: "coho_salmon" }],
    }, "chinook_salmon"),
    PierCastContractError,
  );
  assert.throws(
    () => validatePierCastConditionsMap({
      ...shared,
      selectionRequiredForMatch: false,
      source: {},
    }, "coho_salmon"),
    PierCastContractError,
  );
  assert.throws(
    () => validatePierCastConditionsMap({
      ...shared,
      selectionRequiredForMatch: false,
      source: {},
      cities: [{ selectedSpecies: { speciesId: "coho_salmon" } }],
    }, "chinook_salmon"),
    PierCastContractError,
  );
});

test("city report and saved report validators preserve exact target identity", () => {
  const envelope = {
    envelopeVersion: "piercast-saved-report-v4",
    reportKey: "test_city:2026-09-28",
    generatedAt: "2026-09-28T12:00:00.000Z",
    report: {
      schemaVersion: "piercast-conditions-v4",
      formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
      cityId: "test_city",
      selectedSpeciesId: "chinook_salmon",
      species: [{ speciesId: "chinook_salmon" }],
    },
    migration: { source: "native_v4", legacyFormulaVersion: null },
  };
  assert.equal(
    validatePierCastSavedReportEnvelope(envelope, {
      cityId: "test_city",
      speciesId: "chinook_salmon",
    }).report.cityId,
    "test_city",
  );
  assert.throws(
    () => validatePierCastSavedReportEnvelope(envelope, {
      cityId: "another_city",
      speciesId: "chinook_salmon",
    }),
    PierCastContractError,
  );
  assert.equal(
    validatePierCastSavedReportRead({ status: "available", envelope }, "chinook_salmon").status,
    "available",
  );
});

test("map foundation validation rejects partial synchronized wind arrays", () => {
  const validTimes = Array.from(
    { length: 121 },
    (_, index) => new Date(Date.UTC(2026, 8, 28, index)).toISOString(),
  );
  const foundation = {
    mode: "great_lakes_map_foundation",
    schemaVersion: "pier-cast-map-foundation-v1",
    timeline: {
      stepHours: 1,
      frameCount: 121,
      validTimes,
    },
    wind: {
      nodes: [{
        speedMph: validTimes.map(() => 10),
        directionDegrees: validTimes.map(() => 270),
        gustMph: validTimes.map(() => 15),
      }],
    },
  };
  assert.equal(validatePierCastMapFoundation(foundation).timeline.frameCount, 121);
  assert.throws(
    () => validatePierCastMapFoundation({
      ...foundation,
      wind: {
        nodes: [{
          speedMph: [10],
          directionDegrees: validTimes.map(() => 270),
          gustMph: validTimes.map(() => 15),
        }],
      },
    }),
    PierCastContractError,
  );
});

test("shoreline wind rendering culls off-screen nodes and stays bounded for ten simulated minutes", () => {
  const points = PIER_CAST_WIND_GRID.map((node) => ({
    ...node,
    validAt: "2026-09-28T12:00:00.000Z",
    speedMph: 14,
    directionDegrees: 245,
    gustMph: 20,
  }));
  const overview = filterPierCastWindPointsForView(points, [-84, 44.5], 4);
  const shoreline = filterPierCastWindPointsForView(points, [-86.25, 43], 9);
  assert.equal(overview.length, points.length);
  assert.ok(shoreline.length > 0);
  assert.ok(shoreline.length < points.length / 4);
  const frameCount = Math.ceil(10 * 60 * 1000 / PIER_CAST_WIND_FLOW_DETAIL_INTERVAL_MS);
  let maximumFeatureCount = 0;
  for (let frame = 0; frame < frameCount; frame += 1) {
    const rendered = buildPierCastWindFlowGeoJson(
      shoreline,
      9,
      frame / frameCount,
    );
    maximumFeatureCount = Math.max(maximumFeatureCount, rendered.features.length);
  }
  assert.equal(maximumFeatureCount, shoreline.length);
  assert.equal(pierCastWindFlowIntervalMs(4), 96);
  assert.equal(pierCastWindFlowIntervalMs(9), 64);
});

test("map controls use measured insets and animation lifecycle guards", () => {
  assert.match(map, /setTopControlInset/);
  assert.match(map, /setMeasuredBottomHeight/);
  assert.match(map, /padding: \{ top: topControlInset \+ 10/);
  assert.match(map, /scaleBar={!usingOfflineBaseMap && !targetPromptVisible}/);
  assert.match(map, /filterPierCastWindPointsForView/);
  assert.match(map, /mapIsActive && mapFocused/);
  assert.match(map, /AccessibilityInfo\.isReduceMotionEnabled/);
});

test("native build configuration contains and locks the required MapLibre module", () => {
  assert.ok(appConfig.expo.plugins.includes("@maplibre/maplibre-react-native"));
  assert.equal(
    packageLock.packages["node_modules/@maplibre/maplibre-react-native"].version,
    "11.4.0",
  );
  assert.equal(easConfig.cli.requireCommit, true);
  assert.equal(easConfig.build["ios-simulator"].ios.simulator, true);
});

test("Passes 1 through 4 have explicit evidence and an honest release hold", () => {
  assert.equal(readiness.schemaVersion, "piercast-refinement-pass4-release-evidence-v1");
  assert.equal(readiness.automated.typecheck, "passed");
  assert.equal(readiness.automated.iosBundle, "passed");
  assert.equal(readiness.releaseDecision, "hold_pending_native_device_evidence");
  assert.ok(readiness.externalGates.length >= 2);
  for (const pass of ["Pass 1", "Pass 2", "Pass 3", "Pass 4"]) {
    assert.match(audit, new RegExp(`## ${pass}`));
  }
  assert.match(audit, /No OTA update, native production build/i);
  assert.match(audit, /MapLibre-capable development client/i);
});

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}
