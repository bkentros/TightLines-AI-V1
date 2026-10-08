import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPierCastConditionsV4OutlookFromBatch,
  projectPierCastConditionsCityReportV4,
  projectPierCastConditionsLeaderboardV4,
  projectPierCastConditionsMapV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4.ts";
import { completeLmhofsBatch } from "../supabase/functions/_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
import { labelDelayedForecast } from "../supabase/functions/pier-cast/outageFallback.ts";
import {
  validatePierCastConditionsLeaderboard,
  validatePierCastConditionsMap,
  validatePierCastSavedReportEnvelope,
} from "../lib/pierCastConditionsValidation";
import { PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION } from "../lib/pierCastConditionsV4";

test("13h through 72h responses pass the shipped 1.14/1.15 validators", () => {
  // Releases 1.14 and 1.15 shipped this exact validator source (identical
  // SHA-256). Exercise all public v4 projections after applying delayed labels.
  for (const ageHours of [13, 24, 36, 48, 72]) {
    const batch = completeLmhofsBatch();
    const evaluatedAt = new Date(
      Date.parse(batch.issuedAt) + ageHours * 60 * 60 * 1000,
    );
    const builtOutlook = buildPierCastConditionsV4OutlookFromBatch({
      batch: { ...batch, cycleAgeHours: ageHours },
      evaluationTime: evaluatedAt.toISOString(),
    });
    const outlook = ageHours > 24
      ? labelDelayedForecast(builtOutlook, batch.fetchedAt, ageHours)
      : builtOutlook;
    const speciesId = "chinook_salmon" as const;
    const cityId = "grand_haven_mi";
    validatePierCastConditionsLeaderboard(
      projectPierCastConditionsLeaderboardV4(outlook, speciesId),
      speciesId,
    );
    validatePierCastConditionsMap(
      projectPierCastConditionsMapV4(outlook, speciesId),
      speciesId,
    );
    const report = projectPierCastConditionsCityReportV4(
      outlook,
      cityId,
      speciesId,
    );
    validatePierCastSavedReportEnvelope({
      envelopeVersion: PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION,
      reportKey: `${cityId}:2026-09-12`,
      generatedAt: outlook.generatedAt,
      report,
      migration: { source: "native_v4", legacyFormulaVersion: null },
    }, { cityId, speciesId });
    assert.equal(
      outlook.generatedAt,
      ageHours > 24 ? batch.fetchedAt : evaluatedAt.toISOString(),
    );
    assert.equal(outlook.source.cycleAgeHours, ageHours);
    assert.ok(
      report.temperatureTimeline.every((point) =>
        Date.parse(point.validAt) <=
          Date.parse(batch.issuedAt) + 120 * 60 * 60 * 1000
      ),
      "the report never extends temperatures beyond NOAA's archived horizon",
    );
  }
});
