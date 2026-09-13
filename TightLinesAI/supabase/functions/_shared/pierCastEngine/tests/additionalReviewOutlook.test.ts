import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  PIER_CAST_ENGINE_VERSION,
} from "../index.ts";
import { PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH } from "../config/additionalSeasonalResearch.generated.ts";
import { PIER_CAST_ADDITIONAL_THERMAL_RESEARCH } from "../config/additionalThermalResearch.generated.ts";
import { evaluateTemperatureSuitability } from "../scoring/temperature.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";

Deno.test("additional private research uses only the sixteen annual pairings and never joins headlines", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
  });
  const expected = new Set(
    PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH.filter(p=>!getPierCastPrivateAdmission(p.cityId,p.speciesId)).map((p) =>
      `${p.cityId}/${p.speciesId}`
    ),
  );
  let hypothetical = 0, deferred = 0;
  for (const city of outlook.cities) {
    for (const row of city.additionalSpeciesResearch ?? []) {
      assert(expected.delete(`${city.cityId}/${row.speciesId}`));
      assertEquals(row.runtimeEligible, false);
      assertEquals(row.publicEnabled, false);
      assertEquals(
        row.interpretation,
        "surface_temperature_sensitivity_not_validated_forecast",
      );
      assert(
        row.blockingReasons.includes(
          "surface_to_fishing_zone_transfer_not_approved",
        ),
      );
      assertEquals(row.dates.length, 5);
      for (const date of row.dates) {
        assert(date.seasonalRating !== null);
        if (row.speciesId === "round_whitefish") {
          assertEquals(date.hypotheticalOutlook, null);
          assertEquals(row.thermalDecision, "deferred_adult_response");
          deferred++;
        } else {
          const result = date.hypotheticalOutlook!;
          assertEquals(result.promotion.status, "blocked");
          assertEquals(result.targetingEligibility, "unknown");
          assertEquals(result.configurationRatingEnabled, false);
          assertEquals(result.coverage.status, "complete");
          assert(result.biological.status === "available");
          const curve = PIER_CAST_ADDITIONAL_THERMAL_RESEARCH.find((p) =>
            p.speciesId === row.speciesId
          )!.curve;
          const fit = evaluateTemperatureSuitability({
            curve,
            waterTemperatureC: 15,
            inputStatus: "valid",
            ratingEnabled: true,
            mode: "review",
            monthEvidenceState: "proposed_regional_transfer",
          });
          assert(fit.status === "available");
          assertAlmostEquals(
            result.biological.score,
            1 + (date.seasonalRating - 1) * (.3 + .75 * fit.suitability),
            1e-10,
          );
          hypothetical++;
        }
      }
    }
    for (const date of city.dates) {
      assertEquals(date.species.map(s=>s.speciesId), getPierCastPrivateSpeciesIds(city.cityId));
      assert(
        !city.additionalSpeciesResearch?.some((r) =>
          r.speciesId === date.headline.drivingSpeciesId
        ),
      );
    }
  }
  assertEquals(expected.size, 0);
  assertEquals(hypothetical, 35);
  assertEquals(deferred, 10);
});

Deno.test("additional thermal hypotheses fail closed outside their domains and incomplete horizons", () => {
  const batch = completeLmhofsBatch();
  for (const city of batch.cities) {
    for (const sample of city.samples) sample.temperatureC = 33;
  }
  const outlook = buildPierCastReviewOutlook({
    batch,
    evaluationTime: "2026-09-10T06:30:00.000Z",
  });
  for (const city of outlook.cities) {
    for (const row of city.additionalSpeciesResearch ?? []) {
      for (const date of row.dates) {
        if (date.hypotheticalOutlook) {
          assertEquals(
            date.hypotheticalOutlook.biological.status,
            "unavailable",
          );
          assertEquals(date.hypotheticalOutlook.promotion.status, "blocked");
        }
      }
    }
  }
});

Deno.test("additional research is absent from the immutable daily snapshot contract", () => {
  const snapshot = buildPierCastDailyScoreSnapshot({
    batch: completeLmhofsBatch(),
    lakeDate: "2026-09-10",
    generatedAt: "2026-09-10T00:36:00.000Z",
    engineVersion: PIER_CAST_ENGINE_VERSION,
  });
  assert(!JSON.stringify(snapshot).includes("additionalSpeciesResearch"));
  for (const city of snapshot.cities) assertEquals(city.date.species.map(s=>s.speciesId), getPierCastPrivateSpeciesIds(city.cityId));
});

Deno.test("accepted additional research retains cold-water calculations in every month and flags regulation expiry", () => {
  for (let month = 1; month <= 12; month++) {
    const evaluationTime = `2027-${
      String(month).padStart(2, "0")
    }-10T00:30:00.000Z`;
    const offset = Date.parse(evaluationTime) -
      Date.parse("2026-09-10T00:30:00.000Z");
    const batch = JSON.parse(
      JSON.stringify(
        completeLmhofsBatch(),
        (_key, value) =>
          typeof value === "string" && /^2026-09-\d\dT/.test(value)
            ? new Date(Date.parse(value) + offset).toISOString()
            : value,
      ),
    );
    for (const city of batch.cities) {
      for (const sample of city.samples) sample.temperatureC = 2;
    }
    const outlook = buildPierCastReviewOutlook({ batch, evaluationTime });
    for (const city of outlook.cities) {
      for (const row of city.additionalSpeciesResearch ?? []) {
        for (const date of row.dates) {
          assert(date.seasonalRating !== null && date.seasonalRating >= 1);
          assertEquals(
            date.regulationReviewStatus,
            month <= 3 ? "within_review_period" : "requires_refresh",
          );
          if (row.speciesId !== "round_whitefish") {
            assertEquals(
              date.hypotheticalOutlook!.biological.status,
              "available",
            );
          }
        }
      }
    }
  }
});

Deno.test("additional hypotheses require full daily coverage even at in-domain temperatures", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T06:30:00.000Z",
  });
  for (const city of outlook.cities) {
    for (const row of city.additionalSpeciesResearch ?? []) {
      if (row.speciesId === "round_whitefish") {
        continue;
      }
      const last = row.dates.at(-1)!.hypotheticalOutlook!;
      assertEquals(last.biological.status, "unavailable");
    }
  }
});
