import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { PierCastThermalBandV4 } from "../lib/pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "../lib/pierCastContracts.ts";
import {
  pierCastTemperatureProfileV18,
  pierCastTemperatureSuitabilityV18,
  pierCastWaterFitLabelV18,
  projectPierCastThermalMatchV18,
} from "../lib/pierCastTemperatureFitV18.ts";
import { pierCastThermalBandV4 } from "../lib/pierCastConditionsV4.ts";
import { PIER_CAST_V18_THERMAL_CALIBRATION_VERSION, PIER_CAST_V18_THERMAL_PROFILES } from "../lib/pierCastTemperatureProfilesV18.ts";
import { PIER_CAST_V4_THERMAL_CALIBRATION_VERSION, PIER_CAST_V4_THERMAL_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/conditionsV4.ts";

const fToC = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9;

type ExpectedProfile = {
  excellent: readonly [number, number];
  bands: readonly [fromF: number, toF: number, band: PierCastThermalBandV4][];
};

const EXPECTED: Record<Exclude<PierCastSpeciesId, "bluegill">, ExpectedProfile> = {
  chinook_salmon: { excellent: [48, 57], bands: [[32, 41, "fair"], [42, 47, "good"], [48, 57, "excellent"], [58, 63, "good"], [64, 68, "fair"], [69, 100, "poor"]] },
  coho_salmon: { excellent: [50, 57], bands: [[32, 41, "fair"], [42, 49, "good"], [50, 57, "excellent"], [58, 63, "good"], [64, 68, "fair"], [69, 100, "poor"]] },
  steelhead: { excellent: [42, 58], bands: [[32, 35, "fair"], [36, 41, "good"], [42, 58, "excellent"], [59, 63, "good"], [64, 68, "fair"], [69, 100, "poor"]] },
  brown_trout: { excellent: [45, 61], bands: [[32, 37, "fair"], [38, 44, "good"], [45, 61, "excellent"], [62, 65, "good"], [66, 70, "fair"], [71, 100, "poor"]] },
  lake_trout: { excellent: [39, 54], bands: [[32, 34, "fair"], [35, 38, "good"], [39, 54, "excellent"], [55, 58, "good"], [59, 62, "fair"], [63, 100, "poor"]] },
  walleye: { excellent: [55, 72], bands: [[32, 42, "fair"], [43, 54, "good"], [55, 72, "excellent"], [73, 78, "good"], [79, 82, "fair"], [83, 100, "poor"]] },
  smallmouth_bass: { excellent: [60, 78], bands: [[32, 39, "poor"], [40, 49, "fair"], [50, 59, "good"], [60, 78, "excellent"], [79, 84, "good"], [85, 88, "fair"], [89, 100, "poor"]] },
  freshwater_drum: { excellent: [57, 75], bands: [[32, 39, "poor"], [40, 49, "fair"], [50, 56, "good"], [57, 75, "excellent"], [76, 79, "good"], [80, 83, "fair"], [84, 100, "poor"]] },
  yellow_perch: { excellent: [64, 70], bands: [[32, 49, "fair"], [50, 63, "good"], [64, 70, "excellent"], [71, 76, "good"], [77, 82, "fair"], [83, 100, "poor"]] },
  lake_whitefish: { excellent: [34, 50], bands: [[32, 33, "good"], [34, 50, "excellent"], [51, 57, "good"], [58, 63, "fair"], [64, 100, "poor"]] },
  round_whitefish: { excellent: [34, 46], bands: [[32, 33, "good"], [34, 46, "excellent"], [47, 52, "good"], [53, 59, "fair"], [60, 100, "poor"]] },
  channel_catfish: { excellent: [79, 84], bands: [[32, 49, "poor"], [50, 69, "fair"], [70, 78, "good"], [79, 84, "excellent"], [85, 88, "good"], [89, 92, "fair"], [93, 100, "poor"]] },
  largemouth_bass: { excellent: [70, 82], bands: [[32, 44, "poor"], [45, 59, "fair"], [60, 69, "good"], [70, 82, "excellent"], [83, 86, "good"], [87, 90, "fair"], [91, 100, "poor"]] },
  atlantic_salmon: { excellent: [39, 54], bands: [[32, 34, "fair"], [35, 38, "good"], [39, 54, "excellent"], [55, 59, "good"], [60, 64, "fair"], [65, 100, "poor"]] },
  northern_pike: { excellent: [50, 68], bands: [[32, 39, "fair"], [40, 49, "good"], [50, 68, "excellent"], [69, 74, "good"], [75, 79, "fair"], [80, 100, "poor"]] },
  burbot: { excellent: [32, 50], bands: [[32, 50, "excellent"], [51, 57, "good"], [58, 63, "fair"], [64, 100, "poor"]] },
  white_perch: { excellent: [64, 82], bands: [[32, 39, "poor"], [40, 51, "fair"], [52, 63, "good"], [64, 82, "excellent"], [83, 86, "good"], [87, 90, "fair"], [91, 100, "poor"]] },
  white_bass: { excellent: [58, 82], bands: [[32, 39, "poor"], [40, 49, "fair"], [50, 57, "good"], [58, 82, "excellent"], [83, 86, "good"], [87, 90, "fair"], [91, 100, "poor"]] },
};

test("1.18 temperature profiles are app-local and leave the server calibration frozen", () => {
  const projectionSource = readFileSync(
    new URL("../lib/pierCastTemperatureFitV18.ts", import.meta.url),
    "utf8",
  );
  assert.equal(
    PIER_CAST_V18_THERMAL_CALIBRATION_VERSION,
    "piercast-v4-temperature-fit-1.18-v1",
  );
  assert.equal(
    PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
    "piercast-v4-thermal-calibration-2026-09-v1",
  );
  assert.notDeepEqual(
    PIER_CAST_V18_THERMAL_PROFILES,
    PIER_CAST_V4_THERMAL_PROFILES,
  );
  assert.match(projectionSource, /\.\/pierCastTemperatureProfilesV18\.ts/);
  assert.doesNotMatch(projectionSource, /supabase\/functions/);
});

test("1.18 defines the approved bands for all 18 supported species", () => {
  assert.equal(PIER_CAST_V18_THERMAL_PROFILES.length, 18);
  assert.equal(pierCastTemperatureProfileV18("bluegill"), null);
  for (const [speciesId, expected] of Object.entries(EXPECTED) as [Exclude<PierCastSpeciesId, "bluegill">, ExpectedProfile][]) {
    const profile = pierCastTemperatureProfileV18(speciesId);
    assert.ok(profile, speciesId);
    assert.deepEqual(
      profile.optimumRangeC.map((temperatureC) =>
        Math.round((temperatureC * 9 / 5 + 32) * 10) / 10
      ),
      expected.excellent,
      `${speciesId} Excellent range`,
    );
    for (const [fromF, toF, expectedBand] of expected.bands) {
      for (let fahrenheit = fromF; fahrenheit <= toF; fahrenheit += 1) {
        const value = pierCastTemperatureSuitabilityV18(
          speciesId,
          fToC(fahrenheit),
        );
        assert.notEqual(value, null, `${speciesId} ${fahrenheit}F value`);
        assert.equal(
          pierCastThermalBandV4(value!),
          expectedBand,
          `${speciesId} ${fahrenheit}F`,
        );
      }
    }
  }
});

test("1.18 reprojects an older server thermal read without changing the contract", () => {
  const projected = projectPierCastThermalMatchV18("lake_trout", {
    status: "available",
    value: 0.85,
    band: "excellent",
    temperatureC: fToC(60),
    optimumRangeC: [9, 12],
    distanceFromOptimumC: 0,
    curveId: "old-server-curve",
    validAt: "2026-10-19T12:00:00Z",
    sourceKind: "model",
    reasonCodes: [],
  });
  assert.equal(projected.status, "available");
  if (projected.status !== "available") return;
  assert.equal(projected.band, "fair");
  assert.equal(pierCastWaterFitLabelV18(projected), "Fair fit");
  assert.deepEqual(
    projected.optimumRangeC.map((temperatureC) => Math.round(temperatureC * 9 / 5 + 32)),
    [39, 54],
  );
  assert.match(projected.curveId, /1_18_v1$/);
});

test("shipping PierCast copy uses explicit fit labels and keeps the gauge", () => {
  const cityUi = readFileSync(
    new URL("../components/pier-cast/PierCastConditionsUI.tsx", import.meta.url),
    "utf8",
  );
  const landing = readFileSync(
    new URL("../components/pier-cast/PierCastLanding.tsx", import.meta.url),
    "utf8",
  );
  const source = cityUi + landing;
  assert.match(source, /Best range/);
  assert.match(source, /PierCastWaterGauge|WaterFitBar/);
  assert.match(source, /pierCastWaterFitLabelV18|card\.waterLine/);
  assert.doesNotMatch(source, /a touch (?:cool|warm)|running (?:cool|warm)|too (?:cool|warm)|right in range/i);
});
