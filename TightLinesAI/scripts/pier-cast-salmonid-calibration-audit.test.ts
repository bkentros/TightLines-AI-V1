import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPierCastSalmonidCalibrationAuditV18,
  PIER_CAST_SALMONID_AUDIT_SPECIES,
  type PierCastSalmonidCalibrationAuditRowV18,
} from "../lib/pierCastSalmonidCalibrationAuditV18.ts";
import { pierCastSalmonidCalibrationAuditFingerprint } from "./pier-cast-salmonid-calibration-audit.ts";

let visitedRowCount = 0;
let visitedLeapDay = false;
let scoredRowSample: PierCastSalmonidCalibrationAuditRowV18 | null = null;
const report = buildPierCastSalmonidCalibrationAuditV18({
  onRow: (row) => {
    visitedRowCount += 1;
    if (row.localDate === "2028-02-29") visitedLeapDay = true;
    if (
      row.cityId === "caseville_mi" && row.speciesId === "lake_trout" &&
      row.localDate === "2028-10-19" && row.thermalScenario === "excellent"
    ) {
      scoredRowSample = row;
    }
  },
});

test("salmonid calibration audit covers every supported pair, leap day, and thermal scenario", () => {
  assert.deepEqual(report.coverage.pairCountBySpecies, {
    chinook_salmon: 29,
    coho_salmon: 30,
    steelhead: 32,
    brown_trout: 27,
    lake_trout: 32,
    atlantic_salmon: 7,
  });
  assert.equal(report.coverage.cityCount, 32);
  assert.equal(
    report.coverage.speciesCount,
    PIER_CAST_SALMONID_AUDIT_SPECIES.length,
  );
  assert.equal(report.coverage.pairCount, 125 + 32);
  assert.equal(report.coverage.scoredPairCount, 151);
  assert.equal(report.coverage.researchHoldPairCount, 6);
  assert.equal(report.coverage.dayCount, 366);
  assert.equal(report.coverage.scenarioCount, 4);
  assert.equal(report.coverage.expectedRowCount, 229_848);
  assert.equal(
    report.coverage.auditedRowCount,
    report.coverage.expectedRowCount,
  );
  assert.equal(visitedRowCount, report.coverage.expectedRowCount);
  assert.equal(visitedLeapDay, true);
  assert.equal(
    report.coverage.scoredRowCount + report.coverage.closedRowCount +
      report.coverage.researchHoldRowCount,
    report.coverage.expectedRowCount,
  );
});

test("row diagnostics expose every factor used by the rating and phase", () => {
  assert.ok(scoredRowSample);
  assert.equal(scoredRowSample.status, "scored");
  assert.equal(scoredRowSample.fisheryStrengthCeiling, 6.8);
  assert.equal(scoredRowSample.activeFisheryStrength, 6.8);
  assert.equal(scoredRowSample.temperatureModifier, 1);
  assert.equal(scoredRowSample.todayLabel, "Fair");
  assert.equal(scoredRowSample.seasonPhase, "Peak window");
  assert.ok(scoredRowSample.seasonalAvailability !== null);
  assert.ok(scoredRowSample.score !== null);
  assert.ok(scoredRowSample.activeModeId);
  assert.ok(scoredRowSample.activeModeCalibrationId);
});

test("salmonid calibration audit has no structural or presentation errors", () => {
  assert.equal(report.errorCount, 0);
  assert.deepEqual(
    report.findings.filter((finding) => finding.severity === "error"),
    [],
  );
  for (
    const pair of report.pairs.filter((candidate) =>
      candidate.status === "scored"
    )
  ) {
    assert.ok(pair.maximumExcellentScore !== null);
    assert.ok(pair.maximumExcellentLabel !== null);
    assert.ok(pair.modeCount > 0);
  }
});

test("lake-trout research holds remain visible and deliberately unscored", () => {
  assert.deepEqual(
    report.pairs
      .filter((pair) => pair.status === "research_hold")
      .map((pair) => pair.cityId),
    [
      "algoma_wi",
      "kenosha_wi",
      "manitowoc_wi",
      "michigan_city_in",
      "two_rivers_wi",
      "waukegan_il",
    ],
  );
  for (
    const pair of report.pairs.filter((candidate) =>
      candidate.status === "research_hold"
    )
  ) {
    assert.equal(pair.speciesId, "lake_trout");
    assert.equal(pair.fisheryStrengthCeiling, null);
    assert.equal(pair.maximumExcellentScore, null);
    assert.equal(pair.maximumExcellentLabel, null);
    assert.equal(pair.modeCount, 0);
  }
});

test("audit output is stably ordered and matches the reviewed Pass 3 baseline", () => {
  const sortedPairKeys = [...report.pairs]
    .sort((left, right) =>
      left.speciesId.localeCompare(right.speciesId) ||
      left.cityId.localeCompare(right.cityId)
    )
    .map((pair) => pair.pairKey);
  assert.deepEqual(report.pairs.map((pair) => pair.pairKey), sortedPairKeys);
  assert.equal(
    pierCastSalmonidCalibrationAuditFingerprint(report),
    "6c532b997f5485d1441db4f9a6751e30654fa4d172dd17c4de49634b0e0562b0",
  );
});
