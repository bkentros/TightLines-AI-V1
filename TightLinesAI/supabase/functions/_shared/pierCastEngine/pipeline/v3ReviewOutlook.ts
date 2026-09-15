import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import { getPierCastSpeciesProfile } from "../config/species.ts";
import {
  getPierCastV3PairCalibration,
  getPierCastV3SpeciesIdsForCity,
  getPierCastV3TemperatureCurve,
  PIER_CAST_V3_CALIBRATION_SHA256,
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_FORMULA_VERSION,
  PIER_CAST_V3_MODE_SELECTION,
  PIER_CAST_V3_SOURCE_SHA256,
  type PierCastV3ModePotential,
} from "../config/v3Calibration.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../config/wisconsinShadow.ts";
import { pierCastOpenWaterNoticeApplies } from "../copy/openWater.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import { aggregateCompleteDailyScore } from "../scoring/daily.ts";
import { buildPierCastFiveDateWindows } from "../scoring/dateWindows.ts";
import { selectPierCastDailyHeadline } from "../scoring/headline.ts";
import {
  evaluatePierCastV3ModePotentials,
  pierCastV3RegulationClosureApplies,
} from "../scoring/modesV3.ts";
import { calculatePierCastV3Opportunity } from "../scoring/opportunityV3.ts";
import { evaluateTemperatureSuitability } from "../scoring/temperature.ts";
import { detectPierCastTemperatureEvents } from "../scoring/temperatureEvents.ts";
import type {
  PierCastCityId,
  PierCastCityProfile,
  PierCastCoverageRead,
  PierCastDailyAssessmentWindow,
  PierCastDailyHeadline,
  PierCastMonth,
  PierCastReviewDailyTemperature,
  PierCastScoredSegment,
  PierCastScoreRead,
  PierCastSpeciesId,
} from "../types.ts";
import {
  buildPierCastRollingTemperatureTimeline,
  buildPierCastTemperatureCoverageSegments,
  buildPierCastTemperaturePoints,
  buildPierCastThermalScoreSegments,
} from "./reviewOutlook.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export type PierCastV3ReviewSpeciesOutlook = {
  speciesId: PierCastSpeciesId;
  previewMode: "disabled_shadow_only";
  configurationRatingEnabled: false;
  publicEnabled: false;
  activeMode: PierCastV3ModePotential | null;
  evaluatedModeCount: number;
  temperatureCurveId: string;
  temperatureSuitabilityRange: readonly [number, number] | null;
  biological: PierCastScoreRead;
  coverage: PierCastCoverageRead;
  targetingEligibility: "eligible";
  promotion: {
    status: "blocked";
    reasonCodes: string[];
  };
  reasonCodes: string[];
};

export type PierCastV3ReviewOutlookResponse = {
  mode: "v3_shadow_review";
  previewOnly: true;
  ratingName: "FinFindr Opportunity Rating";
  ratingDisplayFormat: "X.X/10";
  formulaVersion: typeof PIER_CAST_V3_FORMULA_VERSION;
  formula:
    "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)";
  modeSelection: typeof PIER_CAST_V3_MODE_SELECTION;
  configVersion: typeof PIER_CAST_V3_CONFIG_VERSION;
  generatedAt: string;
  sourceHashes: {
    pass1CandidatesSha256: string;
    pass1CalibrationSha256: string;
  };
  promotion: { status: "blocked"; reasonCodes: string[] };
  source: {
    status: "fresh_archived_complete_cycle";
    productId: "NOAA_NOS_LMHOFS_REGULARGRID";
    issuedAt: string;
    fetchedAt: string;
    cycleAgeHours: number;
    cityCount: 9;
    sampleCount: 1089;
  };
  cities: Array<{
    cityId: PierCastCityId;
    displayName: string;
    timezone: "America/Detroit" | "America/Chicago";
    representationDecision: "blocked_insufficient_evidence";
    temperatureTimeline: Array<{ validAt: string; temperatureC: number }>;
    temperatureEvents: ReturnType<typeof detectPierCastTemperatureEvents>;
    dates: Array<{
      localDate: string;
      timezone: string;
      scope: "remaining_day" | "full_day";
      requestedInterval: { start: string; end: string };
      openWaterNoticeApplies: boolean;
      waterTemperature: PierCastReviewDailyTemperature;
      headline: PierCastDailyHeadline;
      species: PierCastV3ReviewSpeciesOutlook[];
    }>;
  }>;
};

export function combinePierCastV3LmhofsBatches(
  primary: AvailableBatch,
  expansion: AvailableBatch,
): AvailableBatch {
  if (
    primary.status !== "available" || expansion.status !== "available" ||
    primary.issuedAt !== expansion.issuedAt ||
    primary.requestedForecastHours.length !== 121 ||
    expansion.requestedForecastHours.length !== 121 ||
    primary.requestedForecastHours.some((hour, index) =>
      hour !== expansion.requestedForecastHours[index]
    )
  ) {
    throw new Error(
      "Formula v3 requires coherent complete same-issue LMHOFS cohorts.",
    );
  }
  const cities = [...primary.cities, ...expansion.cities];
  const actual = new Set(cities.map((city) => city.cityId));
  if (
    cities.length !== 9 || actual.size !== 9 ||
    PIER_CAST_V3_CITY_IDS.some((cityId) => !actual.has(cityId)) ||
    cities.some((city) =>
      city.status !== "available" || city.samples.length !== 121
    )
  ) throw new Error("Formula v3 requires all nine complete city timelines.");
  const fetchedAt =
    Date.parse(primary.fetchedAt) >= Date.parse(expansion.fetchedAt)
      ? primary.fetchedAt
      : expansion.fetchedAt;
  return {
    status: "available",
    issuedAt: primary.issuedAt,
    fetchedAt,
    cycleAgeHours: Math.max(primary.cycleAgeHours, expansion.cycleAgeHours),
    fullHorizonRequested: true,
    requestedForecastHours: [...primary.requestedForecastHours],
    cities,
    diagnostics: [...primary.diagnostics, ...expansion.diagnostics],
  };
}

export function buildPierCastV3ReviewOutlook(input: {
  batch: AvailableBatch;
  evaluationTime: string;
}): PierCastV3ReviewOutlookResponse {
  const evaluatedAt = new Date(input.evaluationTime);
  if (!Number.isFinite(evaluatedAt.getTime())) {
    throw new Error("Formula v3 evaluation time is invalid.");
  }
  validateBatch(input.batch);
  const profiles = [
    ...PIER_CAST_CITY_PROFILES,
    ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ];
  const byId = new Map(profiles.map((city) => [city.cityId, city]));
  const cities = PIER_CAST_V3_CITY_IDS.map((cityId) => {
    const city = byId.get(cityId);
    const timeline = input.batch.cities.find((candidate) =>
      candidate.cityId === cityId
    );
    if (!city || !timeline || timeline.status !== "available") {
      throw new Error(`Formula v3 city input missing: ${cityId}.`);
    }
    const windows = buildPierCastFiveDateWindows({
      evaluationTime: evaluatedAt.toISOString(),
      timezone: city.timezone,
    });
    const temperatureTimeline = buildPierCastRollingTemperatureTimeline(
      timeline.samples,
      evaluatedAt,
    );
    return {
      cityId,
      displayName: city.displayName,
      timezone: city.timezone,
      representationDecision: "blocked_insufficient_evidence" as const,
      temperatureTimeline,
      temperatureEvents: detectPierCastTemperatureEvents(temperatureTimeline),
      dates: windows.map((window) => buildDate(city, timeline.samples, window)),
    };
  });
  return {
    mode: "v3_shadow_review",
    previewOnly: true,
    ratingName: "FinFindr Opportunity Rating",
    ratingDisplayFormat: "X.X/10",
    formulaVersion: PIER_CAST_V3_FORMULA_VERSION,
    formula:
      "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)",
    modeSelection: PIER_CAST_V3_MODE_SELECTION,
    configVersion: PIER_CAST_V3_CONFIG_VERSION,
    generatedAt: evaluatedAt.toISOString(),
    sourceHashes: {
      pass1CandidatesSha256: PIER_CAST_V3_SOURCE_SHA256,
      pass1CalibrationSha256: PIER_CAST_V3_CALIBRATION_SHA256,
    },
    promotion: {
      status: "blocked",
      reasonCodes: [
        "v3_configuration_disabled",
        "specialist_review_pending",
        "temperature_representation_not_approved",
        "prospective_validation_pending",
      ],
    },
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: input.batch.issuedAt,
      fetchedAt: input.batch.fetchedAt,
      cycleAgeHours: input.batch.cycleAgeHours,
      cityCount: 9,
      sampleCount: 1089,
    },
    cities,
  };
}

function buildDate(
  city: PierCastCityProfile,
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
) {
  const points = buildPierCastTemperaturePoints(samples, window);
  const temperatures = points.map((point) => point.temperatureC);
  const temperatureCoverage = aggregateCompleteDailyScore({
    requestedInterval: window.requestedInterval,
    segments: buildPierCastTemperatureCoverageSegments(samples, window).map((
      segment,
    ) => ({
      ...segment,
      scoreAtStart: 1,
      scoreAtEnd: 1,
    })),
  }).coverage;
  const species = getPierCastV3SpeciesIdsForCity(city.cityId).map((speciesId) =>
    buildSpecies(city.cityId, speciesId, samples, window)
  );
  const headline = selectPierCastDailyHeadline(species.map((candidate) => ({
    speciesId: candidate.speciesId,
    biological: candidate.biological,
    coverage: candidate.coverage,
    targetingEligibility: candidate.targetingEligibility,
    promotion: candidate.promotion,
  })));
  return {
    localDate: window.localDate,
    timezone: window.timezone,
    scope: window.scope,
    requestedInterval: window.requestedInterval,
    openWaterNoticeApplies: pierCastOpenWaterNoticeApplies(window.localDate),
    waterTemperature: {
      status: temperatureCoverage.status,
      minimumC: temperatures.length ? Math.min(...temperatures) : null,
      maximumC: temperatures.length ? Math.max(...temperatures) : null,
      coverageFraction: temperatureCoverage.fraction,
      points,
    } as PierCastReviewDailyTemperature,
    headline,
    species,
  };
}

function buildSpecies(
  cityId: PierCastCityId,
  speciesId: PierCastSpeciesId,
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
): PierCastV3ReviewSpeciesOutlook {
  const pair = getPierCastV3PairCalibration(cityId, speciesId);
  const curve = getPierCastV3TemperatureCurve(speciesId);
  const profile = getPierCastSpeciesProfile(speciesId);
  const monthIndex = Number(window.localDate.slice(5, 7)) - 1;
  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ][monthIndex] as PierCastMonth | undefined;
  if (!pair || !curve || !profile || !month) {
    throw new Error(`Formula v3 calibration missing: ${cityId}/${speciesId}.`);
  }
  const curveIds = new Set(pair.modes.map((mode) => mode.thermalCurveId));
  if (curveIds.size !== 1 || !curveIds.has(curve.curveId)) {
    throw new Error(
      `Formula v3 mode thermal response is not integrable: ${pair.pairKey}.`,
    );
  }
  const modes = evaluatePierCastV3ModePotentials({
    localDate: window.localDate,
    modes: pair.modes,
  });
  if (modes.length !== pair.modes.length) {
    throw new Error(`Formula v3 mode evaluation failed: ${pair.pairKey}.`);
  }
  const scoredSegments: PierCastScoredSegment[] = [];
  const suitability: number[] = [];
  for (
    const segment of buildPierCastThermalScoreSegments(samples, window, curve)
  ) {
    const startFit = evaluateTemperatureSuitability({
      ratingEnabled: true,
      mode: "review",
      monthEvidenceState: profile.monthContexts[month].evidenceState,
      inputStatus: "valid",
      waterTemperatureC: segment.temperatureAtStart,
      curve,
    });
    const endFit = evaluateTemperatureSuitability({
      ratingEnabled: true,
      mode: "review",
      monthEvidenceState: profile.monthContexts[month].evidenceState,
      inputStatus: "valid",
      waterTemperatureC: segment.temperatureAtEnd,
      curve,
    });
    if (startFit.status !== "available" || endFit.status !== "available") {
      continue;
    }
    const start = calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: startFit.suitability,
      allowDisabledConfiguration: true,
    });
    const end = calculatePierCastV3Opportunity({
      modes,
      temperatureSuitability: endFit.suitability,
      allowDisabledConfiguration: true,
    });
    if (start.status !== "available" || end.status !== "available") continue;
    suitability.push(startFit.suitability, endFit.suitability);
    scoredSegments.push({
      start: segment.start,
      end: segment.end,
      scoreAtStart: start.score,
      scoreAtEnd: end.score,
    });
  }
  const aggregate = aggregateCompleteDailyScore({
    requestedInterval: window.requestedInterval,
    segments: scoredSegments,
  });
  const activeMode =
    [...modes].sort((left, right) =>
      right.seasonalPotential - left.seasonalPotential ||
      left.modeCalibrationId.localeCompare(right.modeCalibrationId)
    )[0] ?? null;
  const promotion = {
    status: "blocked" as const,
    reasonCodes: [
      "v3_configuration_disabled",
      "specialist_review_pending",
      "temperature_representation_not_approved",
      "prospective_validation_pending",
    ],
  };
  const regulationClosed = pierCastV3RegulationClosureApplies({
    localDate: window.localDate,
    pair,
  });
  const biological = regulationClosed
    ? {
      status: "unavailable" as const,
      score: null,
      reasonCodes: ["species_regulation_closed"],
      ratingName: "FinFindr Opportunity Rating" as const,
    }
    : aggregate.biological;
  return {
    speciesId,
    previewMode: "disabled_shadow_only",
    configurationRatingEnabled: false,
    publicEnabled: false,
    activeMode,
    evaluatedModeCount: modes.length,
    temperatureCurveId: curve.curveId,
    temperatureSuitabilityRange: suitability.length
      ? [Math.min(...suitability), Math.max(...suitability)]
      : null,
    biological,
    coverage: aggregate.coverage,
    targetingEligibility: "eligible",
    promotion,
    reasonCodes: [
      ...(biological.status === "unavailable" ? biological.reasonCodes : []),
      ...promotion.reasonCodes,
      "v3_shadow_evaluation_override",
    ],
  };
}

function validateBatch(batch: AvailableBatch): void {
  const actual = new Set(batch.cities.map((city) => city.cityId));
  if (
    batch.status !== "available" || batch.cities.length !== 9 ||
    actual.size !== 9 ||
    PIER_CAST_V3_CITY_IDS.some((cityId) => !actual.has(cityId)) ||
    batch.cities.some((city) =>
      city.status !== "available" || city.samples.length !== 121
    )
  ) throw new Error("Formula v3 review requires a complete nine-city cycle.");
}
