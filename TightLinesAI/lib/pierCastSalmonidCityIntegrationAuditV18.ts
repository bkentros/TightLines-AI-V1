import {
  buildPierCastCitySpeciesCards,
} from "./pierCastCityReportPresentation.ts";
import {
  type PierCastSpeciesConditionsReadV4,
  pierCastThermalBandV4,
} from "./pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "./pierCastContracts.ts";
import {
  evaluatePierCastOpportunityV5,
  PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION,
  projectPierCastSpeciesConditionsV5,
} from "./pierCastOpportunityV5.ts";
import {
  pierCastOpportunityLabelV5,
  pierCastSeasonTimingLabelV5,
} from "./pierCastOpportunityPresentationV5.ts";
import {
  PIER_CAST_SALMONID_AUDIT_SPECIES,
} from "./pierCastSalmonidCalibrationAuditV18.ts";
import {
  pierCastTemperatureProfileV18,
  pierCastWaterFitLabelV18,
} from "./pierCastTemperatureFitV18.ts";
import { PIER_CAST_STANDINGS_BANDS } from "./pierCastStandingsPresentation.ts";
import {
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
} from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts";
import {
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";

export const PIER_CAST_SALMONID_CITY_INTEGRATION_AUDIT_VERSION =
  "piercast-salmonid-city-integration-1.18-pass5-v1" as const;

export const PIER_CAST_SALMONID_CITY_INTEGRATION_DATES = [
  "2028-01-01",
  "2028-01-15",
  "2028-02-29",
  "2028-03-15",
  "2028-04-15",
  "2028-05-15",
  "2028-06-15",
  "2028-07-15",
  "2028-08-15",
  "2028-09-01",
  "2028-09-15",
  "2028-10-01",
  "2028-10-15",
  "2028-10-19",
  "2028-11-01",
  "2028-11-15",
  "2028-12-01",
  "2028-12-15",
  "2028-12-31",
] as const;

type AuditSpeciesId = typeof PIER_CAST_SALMONID_AUDIT_SPECIES[number];

type PairDescriptor = Readonly<{
  pairKey: string;
  cityId: string;
  speciesId: AuditSpeciesId;
  researchHold: boolean;
}>;

export type PierCastSalmonidCityIntegrationFindingV18 = Readonly<{
  code: string;
  pairKey: string;
  localDate: string;
  temperatureC: number | null;
  detail: string;
}>;

export type PierCastSalmonidCityIntegrationCitySummaryV18 = Readonly<{
  cityId: string;
  pairCount: number;
  scoredPairCount: number;
  researchHoldPairCount: number;
  auditedRowCount: number;
  errorCount: number;
}>;

export type PierCastSalmonidCityIntegrationAuditReportV18 = Readonly<{
  schemaVersion: typeof PIER_CAST_SALMONID_CITY_INTEGRATION_AUDIT_VERSION;
  coverage: Readonly<{
    cityCount: number;
    speciesCount: number;
    pairCount: number;
    scoredPairCount: number;
    researchHoldPairCount: number;
    dateCount: number;
    temperatureSampleCountBySpecies: Readonly<
      Record<AuditSpeciesId, number>
    >;
    expectedRowCount: number;
    auditedRowCount: number;
    scoredRowCount: number;
    closedRowCount: number;
    researchHoldRowCount: number;
    unavailableTemperatureRowCount: number;
  }>;
  errorCount: number;
  findings: readonly PierCastSalmonidCityIntegrationFindingV18[];
  cities: readonly PierCastSalmonidCityIntegrationCitySummaryV18[];
  limitations: readonly string[];
}>;

function descriptors(): PairDescriptor[] {
  const species = new Set<string>(PIER_CAST_SALMONID_AUDIT_SPECIES);
  const nonLake = PIER_CAST_V3_PAIR_CALIBRATIONS
    .filter((pair) =>
      pair.speciesId !== "lake_trout" && species.has(pair.speciesId)
    )
    .map((pair) => ({
      pairKey: pair.pairKey,
      cityId: pair.cityId,
      speciesId: pair.speciesId as AuditSpeciesId,
      researchHold: false,
    }));
  const lakeTrout = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.map((candidate) => ({
    pairKey: `${candidate.cityId}/lake_trout`,
    cityId: candidate.cityId,
    speciesId: "lake_trout" as const,
    researchHold: candidate.decision === "research_hold",
  }));
  return [...nonLake, ...lakeTrout].sort((left, right) =>
    left.cityId.localeCompare(right.cityId) ||
    left.speciesId.localeCompare(right.speciesId)
  );
}

function baseSpecies(input: {
  speciesId: PierCastSpeciesId;
  localDate: string;
  temperatureC: number | null;
  researchHold: boolean;
}): PierCastSpeciesConditionsReadV4 {
  const unavailable = input.temperatureC === null;
  const reasonCodes = input.researchHold
    ? ["lake_trout_research_hold", "targeting_unknown"]
    : [];
  return {
    speciesId: input.speciesId,
    seasonalOutlook: {
      status: "available",
      value: 0.5,
      band: "fair",
      stage: "active",
      trend: "steady",
      profileId: "frozen-server-v4-fixture",
      basis: "regional",
      localDate: input.localDate,
      reasonCodes: [],
    },
    thermalMatch: unavailable
      ? {
        status: "unavailable",
        value: null,
        band: null,
        temperatureC: null,
        optimumRangeC: null,
        distanceFromOptimumC: null,
        curveId: null,
        validAt: null,
        sourceKind: "model",
        reasonCodes: ["temperature_missing"],
      }
      : {
        status: "available",
        value: 0.5,
        band: "fair",
        temperatureC: input.temperatureC!,
        optimumRangeC: [0, 1],
        distanceFromOptimumC: 0,
        curveId: "frozen-server-v4-fixture",
        validAt: `${input.localDate}T12:00:00.000Z`,
        sourceKind: "model",
        reasonCodes: [],
      },
    targetingEligibility: input.researchHold ? "unknown" : "eligible",
    rankingDisposition: input.researchHold ? "unranked" : "ranked",
    localFisheryContext: null,
    reasonCodes,
  };
}

/**
 * Replays every supported city/species integration at the seasonal boundary
 * dates and at every real 1.18 temperature knot. This is deterministic,
 * offline, read-only, and intentionally exercises the frozen-v4-to-1.18 app
 * projection rather than the server runtime.
 */
export function buildPierCastSalmonidCityIntegrationAuditV18(): PierCastSalmonidCityIntegrationAuditReportV18 {
  const pairs = descriptors();
  const findings: PierCastSalmonidCityIntegrationFindingV18[] = [];
  const cityState = new Map<string, {
    pairs: Set<string>;
    scoredPairs: Set<string>;
    holds: Set<string>;
    rows: number;
    errors: number;
  }>();
  const samplesBySpecies = Object.fromEntries(
    PIER_CAST_SALMONID_AUDIT_SPECIES.map((speciesId) => {
      const profile = pierCastTemperatureProfileV18(speciesId);
      return [speciesId, profile?.knots.length ?? 0];
    }),
  ) as Record<AuditSpeciesId, number>;
  let auditedRowCount = 0;
  let scoredRowCount = 0;
  let closedRowCount = 0;
  let researchHoldRowCount = 0;
  let unavailableTemperatureRowCount = 0;

  const fail = (
    descriptor: PairDescriptor,
    localDate: string,
    temperatureC: number | null,
    code: string,
    detail: string,
  ) => {
    findings.push({
      code,
      pairKey: descriptor.pairKey,
      localDate,
      temperatureC,
      detail,
    });
    cityState.get(descriptor.cityId)!.errors += 1;
  };

  for (const descriptor of pairs) {
    const city = cityState.get(descriptor.cityId) ?? {
      pairs: new Set<string>(),
      scoredPairs: new Set<string>(),
      holds: new Set<string>(),
      rows: 0,
      errors: 0,
    };
    city.pairs.add(descriptor.pairKey);
    (descriptor.researchHold ? city.holds : city.scoredPairs).add(
      descriptor.pairKey,
    );
    cityState.set(descriptor.cityId, city);

    const profile = pierCastTemperatureProfileV18(descriptor.speciesId);
    if (!profile) {
      fail(
        descriptor,
        PIER_CAST_SALMONID_CITY_INTEGRATION_DATES[0],
        null,
        "temperature_profile_missing",
        "No 1.18 temperature profile exists.",
      );
      continue;
    }
    const temperatures: Array<number | null> = [
      ...profile.knots.map((knot) => knot.temperatureC),
      null,
    ];
    for (const localDate of PIER_CAST_SALMONID_CITY_INTEGRATION_DATES) {
      for (const temperatureC of temperatures) {
        auditedRowCount += 1;
        city.rows += 1;
        if (temperatureC === null) unavailableTemperatureRowCount += 1;
        const source = baseSpecies({
          speciesId: descriptor.speciesId,
          localDate,
          temperatureC,
          researchHold: descriptor.researchHold,
        });
        const projected = projectPierCastSpeciesConditionsV5({
          cityId: descriptor.cityId,
          species: source,
        });
        const card = buildPierCastCitySpeciesCards({
          species: [projected.species],
        })[0];
        if (!card) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "card_missing",
            "The projected species did not produce a city-report card.",
          );
          continue;
        }
        if (
          "score" in card || "standing" in card || "rank" in card ||
          "rankLabel" in card
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "ranking_field_exposed",
            "A city-report card exposed a hidden score or relative rank field.",
          );
        }

        if (descriptor.researchHold) {
          researchHoldRowCount += 1;
          if (projected.evaluation !== null || card.rated) {
            fail(
              descriptor,
              localDate,
              temperatureC,
              "research_hold_scored",
              "A lake-trout research hold became rated.",
            );
          }
          if (card.seasonLine !== "Local pier evidence still under review") {
            fail(
              descriptor,
              localDate,
              temperatureC,
              "research_hold_copy_mismatch",
              `Card reason was ${JSON.stringify(card.seasonLine)}.`,
            );
          }
          continue;
        }

        const thermalValue = temperatureC === null
          ? null
          : profile.knots.find((knot) => knot.temperatureC === temperatureC)!
            .suitability;
        const expected = evaluatePierCastOpportunityV5({
          cityId: descriptor.cityId,
          speciesId: descriptor.speciesId,
          localDate,
          thermalValue,
        });
        if (!expected || !projected.evaluation) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "projection_missing",
            "A supported pair did not produce an evaluation and projection.",
          );
          continue;
        }
        if (
          expected.score !== projected.evaluation.score ||
          expected.band !== projected.evaluation.band ||
          expected.timing !== projected.evaluation.timing
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "projection_evaluator_mismatch",
            "The projected row diverged from the canonical 1.18 evaluator.",
          );
        }

        if (expected.closed) {
          closedRowCount += 1;
          if (
            projected.species.targetingEligibility !== "restricted" ||
            projected.species.rankingDisposition !== "blocked" || card.rated ||
            card.seasonLine !== "State season closed here"
          ) {
            fail(
              descriptor,
              localDate,
              temperatureC,
              "closure_projection_mismatch",
              "A legal closure was not blocked with the approved city-report copy.",
            );
          }
          continue;
        }

        if (temperatureC === null) {
          if (
            expected.score !== null || card.rated ||
            card.seasonLine !== "Water temp updating"
          ) {
            fail(
              descriptor,
              localDate,
              temperatureC,
              "missing_temperature_mismatch",
              "Unavailable water did not fail closed with updating copy.",
            );
          }
          continue;
        }

        scoredRowCount += 1;
        const projectedThermal = projected.species.thermalMatch;
        const expectedThermalBand = pierCastThermalBandV4(thermalValue!);
        const expectedToday = pierCastOpportunityLabelV5(expected.score!);
        const expectedSeason = pierCastSeasonTimingLabelV5({
          availability: expected.phaseAvailability,
          trend: expected.trend,
          regulationOpen: true,
          accessOpen: true,
        });
        if (
          projectedThermal.status !== "available" ||
          projectedThermal.value !== thermalValue ||
          projectedThermal.band !== expectedThermalBand ||
          projectedThermal.curveId !== profile.curveId
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "thermal_projection_mismatch",
            "The app did not replace the frozen server thermal fields with the 1.18 profile.",
          );
        }
        if (
          projected.species.seasonalOutlook.status !== "available" ||
          projected.species.seasonalOutlook.profileId !==
            PIER_CAST_OPPORTUNITY_V5_CANDIDATE_VERSION ||
          projected.species.seasonalOutlook.value !==
            Math.round(expected.availability * 10_000) / 10_000
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "season_projection_mismatch",
            "The city-report season projection did not retain the approved compatibility value/version.",
          );
        }
        if (
          !card.rated || card.band !== expected.band ||
          PIER_CAST_STANDINGS_BANDS[card.band!].label !== expectedToday
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "today_label_mismatch",
            `Expected ${expectedToday}; received ${card.band}.`,
          );
        }
        if (card.seasonLine !== expectedSeason) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "season_label_mismatch",
            `Expected ${expectedSeason}; received ${card.seasonLine}.`,
          );
        }
        const expectedWater = projectedThermal.status === "available"
          ? pierCastWaterFitLabelV18(projectedThermal)
          : null;
        if (
          card.waterLine !== expectedWater || !card.fit ||
          card.bestRangeLine !==
            `${Math.round(profile.optimumRangeC[0] * 9 / 5 + 32)}–${
              Math.round(profile.optimumRangeC[1] * 9 / 5 + 32)
            }°F`
        ) {
          fail(
            descriptor,
            localDate,
            temperatureC,
            "water_presentation_mismatch",
            "The card water label, gauge, or best range diverged from the 1.18 profile.",
          );
        }
      }
    }
  }

  const expectedRowCount = pairs.reduce((total, pair) =>
    total +
    PIER_CAST_SALMONID_CITY_INTEGRATION_DATES.length *
      (samplesBySpecies[pair.speciesId] + 1), 0);
  const cities = [...cityState.entries()].map(([cityId, city]) => ({
    cityId,
    pairCount: city.pairs.size,
    scoredPairCount: city.scoredPairs.size,
    researchHoldPairCount: city.holds.size,
    auditedRowCount: city.rows,
    errorCount: city.errors,
  })).sort((left, right) => left.cityId.localeCompare(right.cityId));

  return {
    schemaVersion: PIER_CAST_SALMONID_CITY_INTEGRATION_AUDIT_VERSION,
    coverage: {
      cityCount: PIER_CAST_V3_CITY_IDS.length,
      speciesCount: PIER_CAST_SALMONID_AUDIT_SPECIES.length,
      pairCount: pairs.length,
      scoredPairCount: pairs.filter((pair) => !pair.researchHold).length,
      researchHoldPairCount: pairs.filter((pair) => pair.researchHold).length,
      dateCount: PIER_CAST_SALMONID_CITY_INTEGRATION_DATES.length,
      temperatureSampleCountBySpecies: samplesBySpecies,
      expectedRowCount,
      auditedRowCount,
      scoredRowCount,
      closedRowCount,
      researchHoldRowCount,
      unavailableTemperatureRowCount,
    },
    errorCount: findings.length,
    findings,
    cities,
    limitations: [
      "This deterministic audit validates bundled 1.18 app projection and presentation; it does not query live forecasts or measure catch rates.",
      "Representative seasonal dates include every month, leap day, the calibrated fall shoulders, and the year seam; Pass 3 remains the exhaustive daily audit.",
      "Legal closures and explicit research holds are validated as blocked or unscored, never inferred as poor fishing.",
    ],
  };
}
