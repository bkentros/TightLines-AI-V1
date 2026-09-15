import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  archivePierCastV3ShadowForecast,
  buildPierCastV3ReviewOutlook,
  buildPierCastV3ShadowForecastPayload,
  calculatePierCastV3Opportunity,
  combinePierCastV3LmhofsBatches,
  evaluatePierCastV3ModePotentials,
  getPierCastV3PairCalibration,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_FORMULA_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  PIER_CAST_V3_PUBLIC_ENABLED,
  PIER_CAST_V3_RATING_ENABLED,
  PIER_CAST_V3_SPECIES_IDS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  type PierCastCityProfile,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  validatePierCastV3OpportunityMode,
} from "../index.ts";

const ISSUED_AT = "2026-09-14T12:00:00.000Z";
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("v3 generated config is the complete disabled Pass 1 handoff", () => {
  assertEquals(PIER_CAST_V3_RATING_ENABLED, false);
  assertEquals(PIER_CAST_V3_PUBLIC_ENABLED, false);
  assertEquals(PIER_CAST_V3_PAIR_CALIBRATIONS.length, 36);
  assertEquals(
    PIER_CAST_V3_PAIR_CALIBRATIONS.reduce(
      (sum, pair) => sum + pair.modes.length,
      0,
    ),
    98,
  );
  assertEquals(
    new Set(PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => pair.pairKey)).size,
    36,
  );
  for (const cityId of PIER_CAST_V3_CITY_IDS) {
    for (const speciesId of PIER_CAST_V3_SPECIES_IDS) {
      const pair = getPierCastV3PairCalibration(cityId, speciesId);
      assert(pair, `${cityId}/${speciesId} must exist`);
      assertEquals(pair.ratingEnabled, false);
      assertEquals(pair.publicEnabled, false);
      assertEquals(pair.promotionEligible, false);
      for (const mode of pair.modes) {
        assertEquals(validatePierCastV3OpportunityMode(mode), []);
      }
    }
  }
});

Deno.test("v3 is bounded, monotonic, non-stacking, and reaches a researched 10", () => {
  let evaluated = 0;
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    for (let day = 0; day < 365; day += 1) {
      const localDate = new Date(Date.UTC(2027, 0, 1 + day)).toISOString()
        .slice(0, 10);
      const modes = evaluatePierCastV3ModePotentials({
        localDate,
        modes: pair.modes,
      });
      assertEquals(modes.length, pair.modes.length);
      let previous = 0;
      for (const temperatureSuitability of [0, 0.25, 0.5, 0.75, 1]) {
        const result = calculatePierCastV3Opportunity({
          modes,
          temperatureSuitability,
          allowDisabledConfiguration: true,
        });
        assertEquals(result.status, "available");
        if (result.status !== "available") continue;
        assert(result.score >= 1 && result.score <= 10);
        assert(result.score >= previous);
        assert(result.score <= result.activeMode.seasonalPotential + 1e-10);
        assert(
          result.activeMode.seasonalPotential <=
            result.activeMode.fisheryStrength + 1e-10,
        );
        const summedPotential = modes.reduce(
          (sum, mode) => sum + mode.seasonalPotential,
          0,
        );
        assert(result.score <= summedPotential);
        previous = result.score;
        evaluated += 1;
      }
    }
  }
  assertEquals(evaluated, 36 * 365 * 5);

  const reference = getPierCastV3PairCalibration("manistee_mi", "steelhead")!;
  const modes = evaluatePierCastV3ModePotentials({
    localDate: "2027-10-28",
    modes: reference.modes,
  });
  const ideal = calculatePierCastV3Opportunity({
    modes,
    temperatureSuitability: 1,
    allowDisabledConfiguration: true,
  });
  assertEquals(ideal.status, "available");
  if (ideal.status === "available") assertEquals(ideal.score, 10);
  assertEquals(
    calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: 1,
      allowDisabledConfiguration: false,
    }).status,
    "unavailable",
  );
});

Deno.test("v3 recurring availability is continuous across the year seam", () => {
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    const end = evaluatePierCastV3ModePotentials({
      localDate: "2026-12-31",
      modes: pair.modes,
    });
    const start = evaluatePierCastV3ModePotentials({
      localDate: "2027-01-01",
      modes: pair.modes,
    });
    assertEquals(end.length, start.length);
    for (let index = 0; index < end.length; index += 1) {
      assert(
        Math.abs(
          end[index].seasonalAvailability - start[index].seasonalAvailability,
        ) <= 0.03,
      );
    }
  }
});

Deno.test("v3 nine-city outlook requires one coherent issue and stays blocked", () => {
  const primary = batch(PIER_CAST_CITY_PROFILES);
  const expansion = batch(PIER_CAST_WISCONSIN_CITY_PROFILES);
  const combined = combinePierCastV3LmhofsBatches(primary, expansion);
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combined,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  assertEquals(outlook.formulaVersion, PIER_CAST_V3_FORMULA_VERSION);
  assertEquals(outlook.mode, "v3_shadow_review");
  assertEquals(outlook.source.cityCount, 9);
  assertEquals(outlook.source.sampleCount, 1089);
  assertEquals(outlook.cities.length, 9);
  assertEquals(outlook.promotion.status, "blocked");
  assertEquals(outlook.cities.every((city) => city.dates.length === 5), true);
  assertEquals(
    outlook.cities.every((city) =>
      city.dates.every((date) =>
        date.species.length === 4 &&
        date.species.every((species) =>
          species.biological.status === "available" &&
          species.previewMode === "disabled_shadow_only" &&
          species.configurationRatingEnabled === false &&
          species.publicEnabled === false &&
          species.promotion.status === "blocked"
        )
      )
    ),
    true,
  );

  const mismatched = structuredClone(expansion);
  mismatched.issuedAt = "2026-09-14T06:00:00.000Z";
  assertThrows(
    () => combinePierCastV3LmhofsBatches(primary, mismatched),
    Error,
    "same-issue",
  );
});

Deno.test("v3 archive freezes exactly 180 mode-aware forecasts", async () => {
  const combined = combinePierCastV3LmhofsBatches(
    batch(PIER_CAST_CITY_PROFILES),
    batch(PIER_CAST_WISCONSIN_CITY_PROFILES),
  );
  const outlook = buildPierCastV3ReviewOutlook({
    batch: combined,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  const payload = buildPierCastV3ShadowForecastPayload({
    outlook,
    batch: combined,
    ingestionSource: "fresh_archived_complete_cycle",
    engineVersion: "v3-test-engine",
  });
  assertEquals(payload.forecasts.length, 180);
  assertEquals(new Set(payload.forecasts.map((row) => row.cityId)).size, 9);
  assertEquals(
    payload.forecasts.every((row) =>
      row.modeCalibrationId !== null && row.seasonalPotential !== null &&
      row.fisheryStrength !== null &&
      row.seasonalPotential <= row.fisheryStrength
    ),
    true,
  );
  let called = "";
  const result = await archivePierCastV3ShadowForecast({
    database: {
      rpc: (name) => {
        called = name;
        return Promise.resolve({
          data: {
            status: "committed",
            runId: crypto.randomUUID(),
            forecastCount: 180,
          },
          error: null,
        });
      },
    },
    outlook,
    batch: combined,
    ingestionSource: "fresh_archived_complete_cycle",
    engineVersion: "v3-test-engine",
  });
  assertEquals(called, "commit_pier_cast_v3_shadow_forecast");
  assertEquals(result.forecastCount, 180);
});

Deno.test("v3 migration enforces a private exact manifest and delayed schedule", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260914233000_pier_cast_v3_shadow_ledger.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("jsonb_array_length(p_forecasts) <> 180"));
  assert(sql.includes("count(distinct item->>'cityId')"));
  assert(sql.includes("count(distinct item->>'speciesId')"));
  assert(
    sql.includes(
      "promotion_status text not null check (promotion_status = 'blocked')",
    ),
  );
  assert(sql.includes("x-pier-cast-operation','v3-shadow'"));
  assert(sql.includes("'50 0,6,12,18 * * *'"));
  assert(
    sql.includes(
      "revoke all on table public.pier_cast_v3_shadow_forecasts from public, anon, authenticated",
    ),
  );
  assert(sql.includes("view public.pier_cast_v3_shadow_validation_pairs"));
  assert(sql.includes("forecast.mode_calibration_id"));
});

function batch(profiles: readonly PierCastCityProfile[]): AvailableBatch {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const cities = profiles.map((profile, cityIndex) => {
    const source = profile.waterTemperatureSource!;
    const location = source.configuredLocation!;
    const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
      cityId: profile.cityId,
      sourceId: source.sourceId,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: ISSUED_AT,
      forecastHour,
      validAt: new Date(Date.parse(ISSUED_AT) + forecastHour * 3_600_000)
        .toISOString(),
      temperatureC: 12 + cityIndex * 0.2 + forecastHour / 500,
      rawUnit: "C",
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: location.gridRow,
      gridColumn: location.gridColumn,
      latitude: location.latitude,
      longitude: location.longitude,
      sourceUrl: `https://example.test/${profile.cityId}/${forecastHour}`,
    }));
    return {
      status: "available" as const,
      cityId: profile.cityId,
      sourceId: source.sourceId,
      issuedAt: ISSUED_AT,
      requestedForecastHours: hours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt: ISSUED_AT,
    fetchedAt: "2026-09-14T12:05:00.000Z",
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities,
    diagnostics: [],
  };
}
