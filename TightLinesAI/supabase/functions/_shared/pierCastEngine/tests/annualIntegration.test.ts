import { assert, assertAlmostEquals } from "jsr:@std/assert";
import {
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  evaluateTemperatureSuitability,
  getPierCastPrivateTemperatureCurve,
  PIER_CAST_ENGINE_VERSION,
} from "../index.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";

Deno.test("daily peak integration agrees with independent numerical quadrature across the score ceiling", () => {
  const batch = completeLmhofsBatch();
  const issued = "2026-10-15T18:00:00.000Z";
  batch.issuedAt = issued;
  batch.fetchedAt = "2026-10-16T00:00:00.000Z";
  for (const city of batch.cities) {
    assert(city.status === "available");
    city.issuedAt = issued;
    for (const sample of city.samples) {
      sample.issuedAt = issued;
      sample.validAt = new Date(
        Date.parse(issued) + sample.forecastHour * 3600000,
      ).toISOString();
      sample.temperatureC = sample.forecastHour % 2 ? 18 : 10;
    }
    city.coverageStart = city.samples[0].validAt;
    city.coverageEnd = city.samples[120].validAt;
  }
  const outlook = buildPierCastReviewOutlook({
    batch,
    evaluationTime: batch.fetchedAt,
  });
  const date = outlook.cities.find((c) => c.cityId === "frankfort_elberta_mi")!
    .dates.find((d) => d.localDate === "2026-10-16")!;
  const fish = date.species.find((s) => s.speciesId === "steelhead")!;
  assert(fish.biological.status === "available");
  assert(fish.seasonalRating! > 9.6);
  const curve = getPierCastPrivateTemperatureCurve("steelhead")!;
  // Each complete hour traverses the same temperature range, in alternating directions.
  // Midpoint quadrature evaluates the instantaneous bounded formula, not endpoint trapezoids.
  const steps = 100000;
  let expected = 0;
  for (let i = 0; i < steps; i++) {
    const thermal = evaluateTemperatureSuitability({
      curve,
      waterTemperatureC: 10 + 8 * (i + 0.5) / steps,
      ratingEnabled: true,
      mode: "review",
      inputStatus: "valid",
      monthEvidenceState: "proposed_regional_transfer",
    });
    assert(thermal.status === "available");
    expected += Math.min(
      10,
      1 + (fish.seasonalRating! - 1) * (0.3 + 0.75 * thermal.suitability),
    ) / steps;
  }
  assertAlmostEquals(fish.biological.score, expected, 0.000001);
});

Deno.test("private annual lineup produces complete monthly snapshots including winter", () => {
  for (let month = 1; month <= 12; month++) {
    const date = `2026-${String(month).padStart(2, "0")}-15`;
    const batch = completeLmhofsBatch();
    batch.issuedAt = new Date(Date.parse(date + "T00:00:00Z") - 6 * 3600000)
      .toISOString();
    batch.fetchedAt = date + "T00:00:00.000Z";
    for (const city of batch.cities) {
      assert(city.status === "available");
      city.issuedAt = batch.issuedAt;
      for (const sample of city.samples) {
        sample.issuedAt = batch.issuedAt;
        sample.validAt = new Date(
          Date.parse(batch.issuedAt) + sample.forecastHour * 3600000,
        ).toISOString();
        sample.temperatureC = 2;
      }
      city.coverageStart = city.samples[0].validAt;
      city.coverageEnd = city.samples[120].validAt;
    }
    const snapshot = buildPierCastDailyScoreSnapshot({
      batch,
      lakeDate: date,
      generatedAt: batch.fetchedAt,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    assert(
      snapshot.cities.reduce((n, c) => n + c.date.species.length, 0) === 28,
    );
    for (const city of snapshot.cities) {
      for (const fish of city.date.species) {
        assert(fish.biological.status === "available");
        assert(fish.promotion.status === "blocked");
        assert(!fish.configurationRatingEnabled);
      }
    }
  }
});
