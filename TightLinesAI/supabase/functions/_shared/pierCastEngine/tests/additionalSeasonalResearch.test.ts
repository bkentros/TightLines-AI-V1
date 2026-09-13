import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import { assert, assertEquals } from "jsr:@std/assert";
import { PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH } from "../config/additionalSeasonalResearch.generated.ts";
import { evaluatePierCastSeasonalOpportunity } from "../scoring/seasonal.ts";
import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
// Exercise the research generator against the production calendar implementation.
// @ts-ignore JavaScript research utility intentionally has no declaration file.
import { evaluate } from "../../../../../scripts/generate-pier-cast-remaining-seasonal.mjs";

Deno.test("annual research curves match runtime interpolation on every date across leap and normal years", () => {
  assertEquals(PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH.length, 16);
  for (const curve of PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH) {
    for (const year of [2024, 2025, 2026]) {
      for (let time = Date.UTC(year, 0, 1); time < Date.UTC(year + 1, 0, 1); time += 86400000) {
        const date = new Date(time);
        const result = evaluatePierCastSeasonalOpportunity({
          curve, localDate: date.toISOString().slice(0, 10), ratingEnabled: true, mode: "review",
        });
        assertEquals(result.status, "available");
        assert(result.rating !== null);
        assert(Math.abs(result.rating - evaluate(curve, date)) < 1e-12);
      }
    }
  }
});

Deno.test("annual research does not activate city species or bypass public calibration approval", () => {
  for (const curve of PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH) {
    const city = PIER_CAST_CITY_PROFILES.find(c => c.cityId === curve.cityId)!;
    const species = city.species.find(s => s.speciesId === curve.speciesId)!;
    assertEquals(species.ratingEnabled, false);
    assertEquals(species.seasonalOpportunityCurve !== null, !!getPierCastPrivateAdmission(city.cityId, curve.speciesId));
    assertEquals(evaluatePierCastSeasonalOpportunity({
      curve, localDate: "2025-07-15", ratingEnabled: true, mode: "public",
    }).status, "unavailable");
  }
});
