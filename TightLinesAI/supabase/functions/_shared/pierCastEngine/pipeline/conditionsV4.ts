import {
  PIER_CAST_COMMON_TARGET_MINIMUM_SEASONAL_BAND,
  PIER_CAST_CONDITIONS_FORMULA_VERSION,
  PIER_CAST_CONDITIONS_SCHEMA_VERSION,
  PIER_CAST_RANKING_VERSION,
  type PierCastCityReportReadV4,
  type PierCastConditionsMapResponseV4,
  type PierCastConditionsOutlookV4,
  type PierCastConditionsShadowComparisonV4,
  type PierCastLeaderboardCityReadV4,
  type PierCastLeaderboardResponseV4,
  type PierCastSeasonalBandV4,
  type PierCastSpeciesConditionsReadV4,
  type PierCastTargetSpeciesOptionV4,
  type PierCastThermalBandV4,
  sortPierCastLeaderboardV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import {
  getPierCastV4CityDefinition,
  getPierCastV4RegionalSeasonalProfile,
  getPierCastV4ThermalProfile,
} from "../config/conditionsV4.ts";
import {
  getPierCastV3PairCalibration,
  getPierCastV3SpeciesIdsForCity,
} from "../config/v3Calibration.ts";
import { getPierCastSpeciesProfile } from "../config/species.ts";
import { pierCastV3RegulationClosureApplies } from "../scoring/modesV3.ts";
import {
  evaluatePierCastSeasonalOutlookV4,
  evaluatePierCastThermalMatchV4,
} from "../scoring/conditionsV4.ts";
import type { PierCastCityId, PierCastSpeciesId } from "../types.ts";
import type { PierCastLmhofsSample } from "../providers/lmhofs.ts";
import { buildPierCastRollingTemperatureTimeline } from "./reviewOutlook.ts";
import type { PierCastV3ReviewOutlookResponse } from "./v3ReviewOutlook.ts";

export const PIER_CAST_V4_DISCLOSURE =
  "Typical Seasonal Outlook describes recurring regional pier-target timing. Current Temperature Match uses modeled NOAA nearshore surface guidance. Neither is a fish count, catch forecast, pier thermometer, or proof fish are present.";

const COMMON_BANDS = new Set<PierCastSeasonalBandV4>([
  "excellent",
  "good",
  PIER_CAST_COMMON_TARGET_MINIMUM_SEASONAL_BAND,
]);

export type PierCastConditionsV4SourceOutlook = {
  generatedAt: string;
  source:
    & Pick<
      PierCastV3ReviewOutlookResponse["source"],
      "status" | "productId" | "issuedAt" | "fetchedAt" | "cycleAgeHours"
    >
    & { cityCount?: number; sampleCount?: number };
  cities: Array<
    Pick<
      PierCastV3ReviewOutlookResponse["cities"][number],
      "cityId" | "temperatureTimeline"
    > & {
      dates: Array<{ localDate: string }>;
    }
  >;
};

export type PierCastConditionsV4SourceBatch = {
  issuedAt: string;
  fetchedAt: string;
  cycleAgeHours: number;
  cities: ReadonlyArray<{
    cityId: PierCastCityId;
    status: "available" | "unavailable";
    samples: readonly PierCastLmhofsSample[];
  }>;
};

/**
 * Builds the v4 source projection directly from the already validated,
 * coherent NOAA cohort. V4 needs only the rolling temperature timelines and
 * today's local date; constructing the full legacy five-day scoring outlook
 * here wastes enough Edge CPU to exceed the selected-map execution budget.
 */
export function buildPierCastConditionsV4OutlookFromBatch(input: {
  batch: PierCastConditionsV4SourceBatch;
  evaluationTime: string;
}): PierCastConditionsOutlookV4 {
  const evaluatedAt = new Date(input.evaluationTime);
  if (!Number.isFinite(evaluatedAt.getTime())) {
    throw new Error("PierCast v4 evaluation time is invalid.");
  }
  return buildPierCastConditionsV4Outlook({
    generatedAt: evaluatedAt.toISOString(),
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: input.batch.issuedAt,
      fetchedAt: input.batch.fetchedAt,
      cycleAgeHours: input.batch.cycleAgeHours,
      cityCount: input.batch.cities.length,
      sampleCount: input.batch.cities.reduce(
        (total, city) => total + city.samples.length,
        0,
      ),
    },
    cities: input.batch.cities.map((timeline) => {
      if (timeline.status !== "available") {
        throw new Error(
          `PierCast v4 city input is unavailable: ${timeline.cityId}.`,
        );
      }
      const city = getPierCastV4CityDefinition(timeline.cityId);
      if (!city) {
        throw new Error(
          `PierCast v4 city is not configured: ${timeline.cityId}.`,
        );
      }
      return {
        cityId: timeline.cityId,
        temperatureTimeline: buildPierCastRollingTemperatureTimeline(
          timeline.samples,
          evaluatedAt,
        ),
        dates: [{
          localDate: localDateAt(evaluatedAt.toISOString(), city.timezone),
        }],
      };
    }),
  });
}

export function buildPierCastConditionsV4Outlook(
  legacy: PierCastConditionsV4SourceOutlook,
): PierCastConditionsOutlookV4 {
  if (legacy.cities.length === 0) {
    throw new Error("PierCast v4 requires at least one coherent city.");
  }
  const cities = legacy.cities.map((legacyCity) => {
    const city = getPierCastV4CityDefinition(legacyCity.cityId);
    if (!city) {
      throw new Error(
        `PierCast v4 city is not configured: ${legacyCity.cityId}.`,
      );
    }
    const current = closestTemperaturePoint(
      legacyCity.temperatureTimeline,
      legacy.generatedAt,
    );
    const localDate = legacyCity.dates[0]?.localDate ?? localDateAt(
      legacy.generatedAt,
      city.timezone,
    );
    const species = getPierCastV3SpeciesIdsForCity(city.cityId).map(
      (speciesId) =>
        buildSpeciesConditions({
          city,
          speciesId,
          localDate,
          temperatureC: current?.temperatureC ?? null,
          validAt: current?.validAt ?? null,
          sourceStatus: current ? "valid" : "missing",
        }),
    );
    return {
      cityId: city.cityId,
      displayName: city.displayName,
      stateCode: city.stateCode,
      lakeId: city.lakeId,
      basinId: city.basinId,
      timezone: city.timezone,
      latitude: city.latitude,
      longitude: city.longitude,
      currentTemperature: current
        ? { ...current, sourceKind: "model" as const }
        : null,
      temperatureTimeline: legacyCity.temperatureTimeline.map((point) => ({
        ...point,
        sourceKind: "model" as const,
      })),
      species,
    };
  });
  return {
    schemaVersion: PIER_CAST_CONDITIONS_SCHEMA_VERSION,
    formulaVersion: PIER_CAST_CONDITIONS_FORMULA_VERSION,
    rankingVersion: PIER_CAST_RANKING_VERSION,
    generatedAt: legacy.generatedAt,
    source: {
      status: legacy.source.status,
      productId: legacy.source.productId,
      issuedAt: legacy.source.issuedAt,
      fetchedAt: legacy.source.fetchedAt,
      cycleAgeHours: legacy.source.cycleAgeHours,
    },
    cities,
    disclosure: PIER_CAST_V4_DISCLOSURE,
  };
}

export function projectPierCastConditionsLeaderboardV4(
  outlook: PierCastConditionsOutlookV4,
  selectedSpeciesId: PierCastSpeciesId | null,
): PierCastLeaderboardResponseV4 {
  const targetSpecies = buildTargetSpecies(outlook);
  if (!selectedSpeciesId) {
    return {
      schemaVersion: PIER_CAST_CONDITIONS_SCHEMA_VERSION,
      formulaVersion: PIER_CAST_CONDITIONS_FORMULA_VERSION,
      rankingVersion: PIER_CAST_RANKING_VERSION,
      generatedAt: outlook.generatedAt,
      selectedSpeciesId: null,
      selectionRequired: true,
      targetSpecies,
      cities: [],
      disclosure: outlook.disclosure,
    };
  }
  if (
    !targetSpecies.some((species) => species.speciesId === selectedSpeciesId)
  ) {
    throw new RangeError(`Unknown PierCast species: ${selectedSpeciesId}.`);
  }
  const candidates = outlook.cities.flatMap((city) => {
    const conditions = city.species.find((species) =>
      species.speciesId === selectedSpeciesId
    );
    return conditions
      ? [
        {
          ...conditions,
          cityId: city.cityId,
          displayName: city.displayName,
          lakeId: city.lakeId,
          stateCode: city.stateCode,
          timezone: city.timezone,
          rank: null,
        } satisfies PierCastLeaderboardCityReadV4,
      ]
      : [];
  });
  let rank = 0;
  const cities = sortPierCastLeaderboardV4(selectedSpeciesId, candidates).map(
    (candidate) => ({
      ...candidate,
      rank: candidate.rankingDisposition === "ranked" ? ++rank : null,
    }),
  );
  return {
    schemaVersion: PIER_CAST_CONDITIONS_SCHEMA_VERSION,
    formulaVersion: PIER_CAST_CONDITIONS_FORMULA_VERSION,
    rankingVersion: PIER_CAST_RANKING_VERSION,
    generatedAt: outlook.generatedAt,
    selectedSpeciesId,
    selectionRequired: false,
    targetSpecies,
    cities,
    disclosure: outlook.disclosure,
  };
}

export function projectPierCastConditionsCityReportV4(
  outlook: PierCastConditionsOutlookV4,
  cityId: string,
  selectedSpeciesId: PierCastSpeciesId,
): PierCastCityReportReadV4 {
  const city = outlook.cities.find((candidate) => candidate.cityId === cityId);
  if (!city) throw new RangeError(`Unknown PierCast city: ${cityId}.`);
  if (
    !city.species.some((species) => species.speciesId === selectedSpeciesId)
  ) {
    throw new RangeError(
      `${selectedSpeciesId} is not configured for PierCast city ${cityId}.`,
    );
  }
  return {
    schemaVersion: outlook.schemaVersion,
    formulaVersion: outlook.formulaVersion,
    generatedAt: outlook.generatedAt,
    cityId: city.cityId,
    displayName: city.displayName,
    stateCode: city.stateCode,
    lakeId: city.lakeId,
    basinId: city.basinId,
    timezone: city.timezone,
    selectedSpeciesId,
    species: [...city.species].sort((left, right) =>
      Number(right.speciesId === selectedSpeciesId) -
        Number(left.speciesId === selectedSpeciesId) ||
      speciesName(left.speciesId).localeCompare(speciesName(right.speciesId))
    ),
    currentTemperature: city.currentTemperature,
    temperatureTimeline: city.temperatureTimeline,
    source: outlook.source,
    disclosure: outlook.disclosure,
  };
}

export function projectPierCastConditionsMapV4(
  outlook: PierCastConditionsOutlookV4,
  selectedSpeciesId: PierCastSpeciesId | null,
): PierCastConditionsMapResponseV4 {
  const targetSpecies = buildTargetSpecies(outlook);
  if (
    selectedSpeciesId &&
    !targetSpecies.some((species) => species.speciesId === selectedSpeciesId)
  ) {
    throw new RangeError(`Unknown PierCast species: ${selectedSpeciesId}.`);
  }
  return {
    schemaVersion: outlook.schemaVersion,
    formulaVersion: outlook.formulaVersion,
    generatedAt: outlook.generatedAt,
    selectedSpeciesId,
    selectionRequiredForMatch: selectedSpeciesId === null,
    targetSpecies,
    cities: outlook.cities.map((city) => {
      const configuredCity = getPierCastV4CityDefinition(city.cityId);
      if (!configuredCity) {
        throw new Error(`PierCast v4 city is not configured: ${city.cityId}.`);
      }
      const currentConditions = selectedSpeciesId
        ? city.species.find((species) =>
          species.speciesId === selectedSpeciesId
        ) ?? null
        : null;
      const selectedSpecies = selectedSpeciesId && currentConditions
        ? {
          speciesId: selectedSpeciesId,
          localFisheryContext: currentConditions.localFisheryContext,
          frames: city.temperatureTimeline.map((point) => {
            const conditions = buildSpeciesConditions({
              city: configuredCity,
              speciesId: selectedSpeciesId,
              localDate: localDateAt(point.validAt, city.timezone),
              temperatureC: point.temperatureC,
              validAt: point.validAt,
              sourceStatus: "valid",
            });
            return {
              validAt: point.validAt,
              temperatureC: point.temperatureC,
              seasonalOutlook: conditions.seasonalOutlook,
              thermalMatch: conditions.thermalMatch,
              targetingEligibility: conditions.targetingEligibility,
              rankingDisposition: conditions.rankingDisposition,
              reasonCodes: conditions.reasonCodes,
            };
          }),
        }
        : null;
      return {
        cityId: city.cityId,
        displayName: city.displayName,
        stateCode: city.stateCode,
        lakeId: city.lakeId,
        basinId: city.basinId,
        timezone: city.timezone,
        latitude: city.latitude,
        longitude: city.longitude,
        temperatureTimeline: city.temperatureTimeline,
        selectedSpecies,
      };
    }),
    source: outlook.source,
    disclosure: outlook.disclosure,
  };
}

export function buildPierCastConditionsShadowComparisonV4(
  legacy: PierCastV3ReviewOutlookResponse,
  outlook: PierCastConditionsOutlookV4,
): PierCastConditionsShadowComparisonV4 {
  const speciesIds = [
    ...new Set(
      outlook.cities.flatMap((city) =>
        city.species.map((species) => species.speciesId)
      ),
    ),
  ].sort();
  let comparablePairCount = 0;
  let materialRankMovementCount = 0;
  const species = speciesIds.map((speciesId) => {
    const conditionsLeaderboard = projectPierCastConditionsLeaderboardV4(
      outlook,
      speciesId,
    );
    const conditionsRanks = new Map(
      conditionsLeaderboard.cities.map((city) => [city.cityId, city.rank]),
    );
    const legacyRows = legacy.cities.flatMap((city) => {
      const row = city.dates[0]?.species.find((candidate) =>
        candidate.speciesId === speciesId
      );
      return row
        ? [{
          cityId: city.cityId,
          score: row.biological.status === "available"
            ? row.biological.score
            : null,
        }]
        : [];
    }).sort((left, right) =>
      (right.score ?? -1) - (left.score ?? -1) ||
      left.cityId.localeCompare(right.cityId)
    );
    const legacyRanks = new Map<string, number | null>();
    let nextLegacyRank = 0;
    for (const row of legacyRows) {
      legacyRanks.set(row.cityId, row.score === null ? null : ++nextLegacyRank);
    }
    const pairs = conditionsLeaderboard.cities.map((city) => {
      const legacyScore = legacyRows.find((row) => row.cityId === city.cityId)
        ?.score ?? null;
      const legacyRank = legacyRanks.get(city.cityId) ?? null;
      const conditionsRank = conditionsRanks.get(city.cityId) ?? null;
      const rankDelta = legacyRank !== null && conditionsRank !== null
        ? conditionsRank - legacyRank
        : null;
      if (rankDelta !== null) comparablePairCount += 1;
      if (rankDelta !== null && Math.abs(rankDelta) >= 5) {
        materialRankMovementCount += 1;
      }
      return {
        cityId: city.cityId,
        speciesId,
        legacyScore,
        legacyRank,
        conditionsRank,
        rankDelta,
        seasonalValue: city.seasonalOutlook.status === "available"
          ? city.seasonalOutlook.value
          : null,
        seasonalBand: city.seasonalOutlook.status === "available"
          ? city.seasonalOutlook.band
          : null,
        thermalValue: city.thermalMatch.status === "available"
          ? city.thermalMatch.value
          : null,
        thermalBand: city.thermalMatch.status === "available"
          ? city.thermalMatch.band
          : null,
      };
    });
    const deltas = pairs.flatMap((pair) =>
      pair.rankDelta === null ? [] : [Math.abs(pair.rankDelta)]
    );
    return {
      speciesId,
      candidateCount: pairs.length,
      meanAbsoluteRankDelta: deltas.length
        ? round(
          deltas.reduce((sum, value) => sum + value, 0) / deltas.length,
          3,
        )
        : null,
      pairs,
    };
  });
  return {
    generatedAt: outlook.generatedAt,
    formulaVersion: PIER_CAST_CONDITIONS_FORMULA_VERSION,
    comparedPairCount: outlook.cities.reduce(
      (sum, city) => sum + city.species.length,
      0,
    ),
    comparablePairCount,
    materialRankMovementCount,
    species,
  };
}

function buildSpeciesConditions(input: {
  city: NonNullable<ReturnType<typeof getPierCastV4CityDefinition>>;
  speciesId: PierCastSpeciesId;
  localDate: string;
  temperatureC: number | null;
  validAt: string | null;
  sourceStatus: "valid" | "missing" | "stale" | "partial_horizon";
}): PierCastSpeciesConditionsReadV4 {
  const pair = getPierCastV3PairCalibration(input.city.cityId, input.speciesId);
  const context = pair ? localFisheryContext(pair) : null;
  const seasonalOutlook = evaluatePierCastSeasonalOutlookV4({
    profile: getPierCastV4RegionalSeasonalProfile({
      speciesId: input.speciesId,
      lakeId: input.city.lakeId,
      basinId: input.city.basinId,
    }),
    localDate: input.localDate,
    latitude: input.city.latitude,
    hasLocalContext: context?.status === "available",
  });
  const thermalMatch = evaluatePierCastThermalMatchV4({
    profile: getPierCastV4ThermalProfile(input.speciesId),
    temperatureC: input.temperatureC,
    validAt: input.validAt,
    inputStatus: input.sourceStatus,
  });
  const targetingEligibility = !pair
    ? "unknown" as const
    : pierCastV3RegulationClosureApplies({ localDate: input.localDate, pair })
    ? "restricted" as const
    : "eligible" as const;
  const rankingDisposition = targetingEligibility === "restricted"
    ? "blocked" as const
    : targetingEligibility !== "eligible" ||
        seasonalOutlook.status !== "available" ||
        thermalMatch.status !== "available"
    ? "unranked" as const
    : "ranked" as const;
  return {
    speciesId: input.speciesId,
    seasonalOutlook,
    thermalMatch,
    targetingEligibility,
    rankingDisposition,
    localFisheryContext: context,
    reasonCodes: [
      ...seasonalOutlook.reasonCodes,
      ...thermalMatch.reasonCodes,
      ...(targetingEligibility === "restricted"
        ? ["targeting_restricted"]
        : []),
      ...(targetingEligibility === "unknown" ? ["targeting_unknown"] : []),
    ],
  };
}

function localFisheryContext(
  pair: NonNullable<ReturnType<typeof getPierCastV3PairCalibration>>,
): NonNullable<PierCastSpeciesConditionsReadV4["localFisheryContext"]> {
  const evidenceIds = [
    ...new Set(pair.modes.flatMap((mode) => mode.fisheryEvidenceIds)),
  ].sort();
  if (evidenceIds.length === 0) {
    return {
      status: "unavailable",
      label: null,
      evidenceIds: [],
      affectsRanking: false,
    };
  }
  const maximumStrength = Math.max(
    ...pair.modes.map((mode) => mode.fisheryStrength),
  );
  return {
    status: "available",
    label: maximumStrength >= 7.5
      ? "established"
      : maximumStrength >= 5
      ? "documented"
      : "limited_evidence",
    evidenceIds,
    affectsRanking: false,
  };
}

function buildTargetSpecies(
  outlook: PierCastConditionsOutlookV4,
): PierCastTargetSpeciesOptionV4[] {
  const speciesIds = [
    ...new Set(
      outlook.cities.flatMap((city) =>
        city.species.map((species) => species.speciesId)
      ),
    ),
  ];
  return speciesIds.map((speciesId) => {
    const rows = outlook.cities.flatMap((city) => {
      const row = city.species.find((species) =>
        species.speciesId === speciesId
      );
      return row ? [row] : [];
    });
    const bands = rows.flatMap((row) =>
      row.seasonalOutlook.status === "available"
        ? [row.seasonalOutlook.band]
        : []
    );
    const bestSeasonalBand = bestBand(bands);
    return {
      speciesId,
      displayName: speciesName(speciesId),
      placement: bestSeasonalBand && COMMON_BANDS.has(bestSeasonalBand)
        ? "commonly_targeted_now"
        : "all_species",
      bestSeasonalBand,
      availableCityCount: rows.filter((row) =>
        row.seasonalOutlook.status === "available"
      ).length,
    } satisfies PierCastTargetSpeciesOptionV4;
  }).sort((left, right) =>
    Number(right.placement === "commonly_targeted_now") -
      Number(left.placement === "commonly_targeted_now") ||
    left.displayName.localeCompare(right.displayName)
  );
}

const BAND_ORDER: Record<PierCastSeasonalBandV4, number> = {
  excellent: 5,
  good: 4,
  fair: 3,
  poor: 2,
  usually_off: 1,
};

function bestBand(
  bands: readonly PierCastSeasonalBandV4[],
): PierCastSeasonalBandV4 | null {
  return [...bands].sort((left, right) =>
    BAND_ORDER[right] - BAND_ORDER[left]
  )[0] ?? null;
}

function closestTemperaturePoint(
  points: readonly { validAt: string; temperatureC: number }[],
  target: string,
): { validAt: string; temperatureC: number } | null {
  const targetTime = Date.parse(target);
  if (!Number.isFinite(targetTime)) return null;
  const point =
    [...points].filter((candidate) =>
      Number.isFinite(Date.parse(candidate.validAt)) &&
      Number.isFinite(candidate.temperatureC)
    ).sort((left, right) =>
      Math.abs(Date.parse(left.validAt) - targetTime) -
      Math.abs(Date.parse(right.validAt) - targetTime)
    )[0];
  return point &&
      Math.abs(Date.parse(point.validAt) - targetTime) <= 2 * 60 * 60 * 1000
    ? point
    : null;
}

function localDateAt(instant: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(instant));
}

function speciesName(speciesId: PierCastSpeciesId): string {
  return getPierCastSpeciesProfile(speciesId)?.displayName ?? speciesId;
}

function round(value: number, places: number): number {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

// Keeps imported public contract types part of this module's checked surface.
export type PierCastConditionsV4PublicBands = {
  seasonal: PierCastSeasonalBandV4;
  thermal: PierCastThermalBandV4;
};
