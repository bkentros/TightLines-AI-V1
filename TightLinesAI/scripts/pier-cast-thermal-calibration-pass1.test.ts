import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
  pierCastThermalBandV4,
} from "../lib/pierCastConditionsV4.ts";
import {
  PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
  PIER_CAST_V4_THERMAL_PROFILES,
} from "../supabase/functions/_shared/pierCastEngine/config/conditionsV4.ts";
import {
  getPierCastV3TemperatureCurve,
  PIER_CAST_V3_SPECIES_IDS,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import {
  evaluatePierCastThermalMatchV4,
  validatePierCastV4ThermalProfile,
} from "../supabase/functions/_shared/pierCastEngine/scoring/conditionsV4.ts";

const LEGACY_V3_THERMAL_SHA256 =
  "0136bba810b5a58ab2df4daf54ee5b2b945658f39b533dc2a3a212640832fc25";

test("the scientific calibration is explicit, complete, and isolated from legacy v3", () => {
  assert.equal(
    PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
    "piercast-v4-thermal-calibration-2026-09-v1",
  );
  assert.equal(
    PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
    "piercast-thermal-profile-v2",
  );
  assert.equal(PIER_CAST_V4_THERMAL_PROFILES.length, 18);
  assert.deepEqual(
    PIER_CAST_V4_THERMAL_PROFILES.map((profile) => profile.speciesId).sort(),
    [...PIER_CAST_V3_SPECIES_IDS].sort(),
  );

  const legacyHash = createHash("sha256").update(JSON.stringify(
    PIER_CAST_V3_SPECIES_IDS.map((speciesId) =>
      getPierCastV3TemperatureCurve(speciesId)
    ),
  )).digest("hex");
  assert.equal(legacyHash, LEGACY_V3_THERMAL_SHA256);
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    assert.equal(
      profile.calibrationVersion,
      PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
    );
    assert.equal(profile.calibrationStatus, "approved_for_pilot");
    assert.equal(
      profile.interpretation,
      "surface_temperature_compatibility_not_fish_presence",
    );
    assert.match(profile.curveId, /__modeled_nearshore_surface__2026_09_v1$/);
    assert.notEqual(
      profile.curveId,
      getPierCastV3TemperatureCurve(profile.speciesId)?.curveId,
    );
  }
});

test("every curve is traceable to preserved evidence", () => {
  const coreLedger = JSON.parse(readFileSync(
    new URL("../docs/PierCast_Thermal_Evidence.json", import.meta.url),
    "utf8",
  )) as { records: Array<{ evidenceId: string }> };
  const expansionLedger = JSON.parse(readFileSync(
    new URL(
      "../docs/onboarding/piercast/species-expansion-pass1/source-ledger.json",
      import.meta.url,
    ),
    "utf8",
  )) as { sources: Array<{ evidenceId: string }> };
  const knownEvidence = new Set([
    ...coreLedger.records.map((record) => record.evidenceId),
    ...expansionLedger.sources.map((record) => record.evidenceId),
  ]);
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    assert.ok(profile.evidenceIds.length >= 2, profile.speciesId);
    for (const evidenceId of profile.evidenceIds) {
      assert.ok(
        knownEvidence.has(evidenceId),
        `${profile.speciesId}/${evidenceId}`,
      );
    }
  }
});

test("profiles have valid single-peaked response geometry and all four labels", () => {
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    assert.deepEqual(validatePierCastV4ThermalProfile(profile), []);
    assert.deepEqual(profile.acceptedDomainC, [0, 38]);
    const observedBands = new Set<string>();
    for (let tenth = 0; tenth <= 380; tenth += 1) {
      const temperatureC = tenth / 10;
      const result = evaluatePierCastThermalMatchV4({
        profile,
        temperatureC,
        validAt: "2026-09-28T12:00:00Z",
        inputStatus: "valid",
      });
      assert.equal(result.status, "available", profile.speciesId);
      if (result.status !== "available") continue;
      observedBands.add(result.band);
      assert.ok(result.value >= 0 && result.value <= 1);
      const insideOptimum = temperatureC >= profile.optimumRangeC[0] &&
        temperatureC <= profile.optimumRangeC[1];
      assert.equal(result.distanceFromOptimumC === 0, insideOptimum);
      if (insideOptimum) assert.equal(result.value, 1);
    }
    assert.deepEqual(
      [...observedBands].sort(),
      ["excellent", "fair", "good", "poor"],
      profile.speciesId,
    );
  }
});

test("thermal label boundaries remain inclusive and exact", () => {
  assert.equal(pierCastThermalBandV4(0.85), "excellent");
  assert.equal(pierCastThermalBandV4(0.8499), "good");
  assert.equal(pierCastThermalBandV4(0.65), "good");
  assert.equal(pierCastThermalBandV4(0.6499), "fair");
  assert.equal(pierCastThermalBandV4(0.35), "fair");
  assert.equal(pierCastThermalBandV4(0.3499), "poor");

  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    for (
      const knot of profile.knots.filter((candidate) =>
        [0.35, 0.65, 0.85, 1].includes(candidate.suitability)
      )
    ) {
      const result = evaluatePierCastThermalMatchV4({
        profile,
        temperatureC: knot.temperatureC,
        validAt: "2026-09-28T12:00:00Z",
        inputStatus: "valid",
      });
      assert.equal(result.status, "available");
      if (result.status === "available") {
        assert.equal(result.band, pierCastThermalBandV4(knot.suitability));
      }
    }
  }
});

test("valid extremes are Poor while invalid provider values stay unavailable", () => {
  for (const profile of PIER_CAST_V4_THERMAL_PROFILES) {
    const warmExtreme = evaluatePierCastThermalMatchV4({
      profile,
      temperatureC: 38,
      validAt: "2026-09-28T12:00:00Z",
      inputStatus: "valid",
    });
    assert.equal(warmExtreme.status, "available");
    if (warmExtreme.status === "available") {
      assert.equal(warmExtreme.band, "poor", profile.speciesId);
    }
    for (const temperatureC of [-0.01, 38.01]) {
      const outside = evaluatePierCastThermalMatchV4({
        profile,
        temperatureC,
        validAt: "2026-09-28T12:00:00Z",
        inputStatus: "valid",
      });
      assert.equal(outside.status, "unavailable");
      assert.deepEqual(outside.reasonCodes, ["temperature_out_of_domain"]);
      assert.equal(outside.band, null);
    }
  }
});
