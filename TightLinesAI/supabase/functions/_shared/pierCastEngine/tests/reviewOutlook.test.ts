import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertThrows,
} from "jsr:@std/assert";
import {
  buildPierCastReviewOutlook,
  PIER_CAST_BASELINE_FORMULA_VERSION,
} from "../index.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";

Deno.test("owner review outlook builds five dates and four disabled-preview species for every city", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
  });

  assertEquals(outlook.mode, "review");
  assertEquals(outlook.previewOnly, true);
  assertEquals(outlook.source.status, "fresh_archived_complete_cycle");
  assertEquals(outlook.source.cityCount, 5);
  assertEquals(outlook.source.sampleCount, 605);
  assertEquals(outlook.cities.length, 5);
  for (const city of outlook.cities) {
    assertEquals(city.representationDecision, "blocked_insufficient_evidence");
    assertEquals(city.temperatureTimeline.length, 115);
    assertEquals(
      city.temperatureTimeline[0].validAt,
      "2026-09-10T00:30:00.000Z",
    );
    assertEquals(
      city.temperatureTimeline[city.temperatureTimeline.length - 1].validAt,
      "2026-09-14T18:00:00.000Z",
    );
    assertEquals(city.dates.length, 5);
    assertEquals(city.dates[0].scope, "remaining_day");
    assertEquals(
      city.dates.slice(1).every((date) => date.scope === "full_day"),
      true,
    );
    for (const date of city.dates) {
      assertEquals(date.waterTemperature.status, "complete");
      assertEquals(date.waterTemperature.minimumC, 15);
      assertEquals(date.waterTemperature.maximumC, 15);
      assert(date.waterTemperature.points.length >= 2);
      assertEquals(date.species.map(s=>s.speciesId), getPierCastPrivateSpeciesIds(city.cityId));
      assertEquals(date.headline.headlineMode, "biological_only");
      assertEquals(date.headline.promotion.status, "blocked");
      for (const species of date.species) {
        assertEquals(species.previewMode, "disabled_provisional");
        assertEquals(species.configurationRatingEnabled, false);
        assertEquals(species.promotion.status, "blocked");
        assertEquals(species.coverage.status, "complete");
      }
    }
  }
});

Deno.test("review outlook applies the bounded temperature formula under constant temperature", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
  });
  const date = outlook.cities.find((city) => city.cityId === "grand_haven_mi")!
    .dates[0];
  const chinook = date.species.find((species) =>
    species.speciesId === "chinook_salmon"
  )!;

  assertEquals(chinook.biological.status, "available");
  assertEquals(chinook.temperatureSuitabilityRange, [0.95, 0.95]);
  if (chinook.biological.status !== "available") return;
  const expected = 1 + (chinook.seasonalRating! - 1) *
      (0.3 + 0.75 * 0.95);
  assertAlmostEquals(chinook.biological.score, expected, 1e-12);
  assert(chinook.biological.displayText.endsWith("/10"));
});

Deno.test("review outlook can reproduce the frozen v1 shadow comparator", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
    formulaVersion: PIER_CAST_BASELINE_FORMULA_VERSION,
  });
  const chinook = outlook.cities.find((city) =>
    city.cityId === "grand_haven_mi"
  )!.dates[0].species.find((species) =>
    species.speciesId === "chinook_salmon"
  )!;
  assertEquals(outlook.formulaVersion, PIER_CAST_BASELINE_FORMULA_VERSION);
  assertEquals(chinook.biological.status, "available");
  if (chinook.biological.status !== "available") return;
  assertAlmostEquals(
    chinook.biological.score,
    1 + (chinook.seasonalRating! - 1) * 0.95,
    1e-12,
  );
});

Deno.test("review outlook fails the fifth date closed when the archived horizon is partial", () => {
  const outlook = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T06:30:00.000Z",
  });

  for (const city of outlook.cities) {
    const finalDate = city.dates[4];
    assertEquals(finalDate.waterTemperature.status, "partial");
    assert(finalDate.waterTemperature.coverageFraction > 0);
    assert(finalDate.waterTemperature.coverageFraction < 1);
    assertEquals(
      finalDate.species.every((species) =>
        species.biological.status === "unavailable" &&
        species.coverage.status === "partial"
      ),
      true,
    );
    assertEquals(finalDate.headline.overall.status, "unavailable");
  }
});

Deno.test("review outlook refuses an incomplete or partial all-city cycle", () => {
  const batch = completeLmhofsBatch();
  assertThrows(
    () =>
      buildPierCastReviewOutlook({
        batch: { ...batch, status: "partial" },
        evaluationTime: "2026-09-10T00:30:00.000Z",
      }),
    Error,
    "complete archived all-city cycle",
  );
});
