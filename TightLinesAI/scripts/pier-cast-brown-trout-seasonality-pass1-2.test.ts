import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolve } from "node:path";

const auditDirectory = resolve(
  "docs/onboarding/piercast/brown-trout-seasonality-audit-2026-10",
);
const FROZEN_HASHES = {
  "audit-summary.json":
    "98db19d070153c7db87035194baa1d56cedb9b781f92113729f65efbd824a2b2",
  "city-window-summary.csv":
    "93c4fc8ec09e2c709d9cad0bf13efd77546d2d409e9abf8d1dfd6c66483ebfc3",
  "evidence-inventory.csv":
    "a82f55b09872192a4ba0b94cdead3b56638c7808c8c13184babc70185ecaf3b8",
  "full-year-daily-baseline.csv":
    "ff00a3faa492b620d97022bd111886d296921d47b27f9df6434b7a936f446006",
  "mode-knot-audit.csv":
    "75262d6ad43b3f6856aef595ab675a3c7febce55921ed5c47567171fd429c198",
} as const;

test("brown-trout Pass 1 covers every public-v3 city/day/temperature", async () => {
  const summary = JSON.parse(
    await readFile(resolve(auditDirectory, "audit-summary.json"), "utf8"),
  );

  assert.equal(summary.cityCount, 27);
  assert.equal(summary.leapYearDayCount, 366);
  assert.equal(summary.dailyRowCount, 9_882);
  assert.equal(summary.thermalScenarioCount, 3);
  assert.equal(summary.scenarioEvaluationCount, 29_646);
  assert.deepEqual(summary.invariants, {
    everyCityHasEffectiveCalibration: true,
    everyDateAndScenarioIsScoreable: true,
    temperatureDoesNotChangeSeasonPhaseOrMode: true,
    allScoresHavePublicLabels: true,
  });
});

test("brown-trout Pass 1 flags only the four nonzero Wisconsin year wraps", async () => {
  const summary = JSON.parse(
    await readFile(resolve(auditDirectory, "audit-summary.json"), "utf8"),
  );

  assert.equal(summary.structuralReview.nonzeroYearWrapModeCount, 4);
  assert.deepEqual(summary.structuralReview.citiesWithNonzeroYearWrap, [
    "algoma_wi",
    "kewaunee_wi",
    "manitowoc_wi",
    "two_rivers_wi",
  ]);
});

test("brown-trout Pass 2 contains one evidence disposition per audited city", async () => {
  const disposition = await readFile(
    resolve(auditDirectory, "city-evidence-disposition.csv"),
    "utf8",
  );
  const rows = disposition.trimEnd().split("\n");

  assert.equal(rows.length - 1, 27);
  assert.equal(
    rows.filter((row) => row.includes(",correction_required,")).length,
    8,
  );
  assert.equal(
    rows.filter((row) => row.includes(",boundary_review,")).length,
    1,
  );
  assert.match(disposition, /^sheboygan_wi,/m);
  assert.match(disposition, /^rogers_city_mi,/m);
});

test("checked-in Pass 1 baseline remains frozen after corrections", async () => {
  for (const [fileName, expected] of Object.entries(FROZEN_HASHES)) {
    const actual = await readFile(resolve(auditDirectory, fileName));
    assert.equal(
      createHash("sha256").update(actual).digest("hex"),
      expected,
      fileName,
    );
  }
});
