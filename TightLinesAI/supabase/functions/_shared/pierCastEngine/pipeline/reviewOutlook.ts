import {
  getPierCastCoreTemperatureCurve,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_SEASONAL_CALIBRATION_VERSION,
  PIER_CAST_TEMPERATURE_CALIBRATION_VERSION,
} from "../config/coreCalibration.ts";
import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import { getPierCastSpeciesProfile } from "../config/species.ts";
import { PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH } from "../config/additionalSeasonalResearch.generated.ts";
import { PIER_CAST_ADDITIONAL_THERMAL_RESEARCH } from "../config/additionalThermalResearch.generated.ts";
import { PIER_CAST_ADDITIONAL_ELIGIBILITY } from "../config/additionalEligibility.generated.ts";
import { PIER_CAST_RATING_DISCLOSURE } from "../copy/reasonCodes.ts";
import { pierCastOpenWaterNoticeApplies } from "../copy/openWater.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import { aggregateCompleteDailyScore } from "../scoring/daily.ts";
import {
  buildPierCastFiveDateWindows,
  buildPierCastFullDayWindow,
} from "../scoring/dateWindows.ts";
import { selectPierCastDailyHeadline } from "../scoring/headline.ts";
import {
  combinePierCastOpportunity,
  PIER_CAST_FORMULA_VERSION,
  type PierCastFormulaVersion,
} from "../scoring/opportunity.ts";
import { evaluatePierCastSeasonalOpportunity } from "../scoring/seasonal.ts";
import { evaluateTemperatureSuitability } from "../scoring/temperature.ts";
import { PIER_CAST_RUBRIC_VERSION } from "../scoring/rating.ts";
import {
  PIER_CAST_MONTHS,
  type PierCastAdditionalSpeciesResearch,
  type PierCastCoverageRead,
  type PierCastDailyAssessmentWindow,
  type PierCastDailyScoreSnapshot,
  type PierCastMonthEvidenceState,
  type PierCastReviewDailyTemperature,
  type PierCastReviewOutlookResponse,
  type PierCastReviewSpeciesOutlook,
  type PierCastScoredSegment,
  type PierCastSpeciesDailyCandidate,
  type PierCastSpeciesId,
  type PierCastTemperatureCurve,
} from "../types.ts";

type AvailableLmhofsBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

const HOUR_MS = 60 * 60 * 1000;

export function buildPierCastReviewOutlook(input: {
  batch: AvailableLmhofsBatch;
  evaluationTime: string;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastReviewOutlookResponse {
  const evaluatedAt = new Date(input.evaluationTime);
  if (!Number.isFinite(evaluatedAt.getTime())) {
    throw new Error("PierCast review evaluation time is invalid.");
  }
  validateReviewBatch(input.batch);

  const cities = PIER_CAST_CITY_PROFILES.map((city) => {
    const timeline = input.batch.cities.find((candidate) =>
      candidate.cityId === city.cityId
    );
    if (!timeline || timeline.status !== "available") {
      throw new Error(`PierCast review timeline missing for ${city.cityId}.`);
    }
    const windows = buildPierCastFiveDateWindows({
      evaluationTime: evaluatedAt.toISOString(),
      timezone: city.timezone,
    });
    return {
      cityId: city.cityId,
      displayName: city.displayName,
      timezone: city.timezone,
      representationDecision: "blocked_insufficient_evidence" as const,
      temperatureTimeline: buildRollingTemperatureTimeline(
        timeline.samples,
        evaluatedAt,
      ),
      dates: windows.map((window) =>
        buildDateOutlook({
          city,
          samples: timeline.samples,
          window,
          formulaVersion: input.formulaVersion ?? PIER_CAST_FORMULA_VERSION,
        })
      ),
      additionalSpeciesResearch: buildAdditionalSpeciesResearch({
        cityId: city.cityId,
        samples: timeline.samples,
        windows,
        formulaVersion: input.formulaVersion ?? PIER_CAST_FORMULA_VERSION,
      }),
    };
  });

  return {
    mode: "review",
    previewOnly: true,
    generatedAt: evaluatedAt.toISOString(),
    ratingName: "FinFindr Opportunity Rating",
    ratingDisplayFormat: "X.X/10",
    formulaVersion: input.formulaVersion ?? PIER_CAST_FORMULA_VERSION,
    disclosure: PIER_CAST_RATING_DISCLOSURE,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: input.batch.issuedAt,
      fetchedAt: input.batch.fetchedAt,
      cycleAgeHours: input.batch.cycleAgeHours,
      cityCount: 5,
      sampleCount: 605,
    },
    cities,
  };
}

export function buildPierCastDailyScoreSnapshot(input: {
  batch: AvailableLmhofsBatch;
  lakeDate: string;
  generatedAt: string;
  engineVersion: string;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastDailyScoreSnapshot {
  const generatedAt = new Date(input.generatedAt);
  if (!Number.isFinite(generatedAt.getTime()) || !input.engineVersion.trim()) {
    throw new Error("PierCast daily score snapshot metadata is invalid.");
  }
  validateReviewBatch(input.batch);
  const formulaVersion = input.formulaVersion ?? PIER_CAST_FORMULA_VERSION;
  const centralWindow = buildPierCastFullDayWindow({
    localDate: input.lakeDate,
    timezone: "America/Chicago",
  });
  const cities = PIER_CAST_CITY_PROFILES.map((city) => {
    const timeline = input.batch.cities.find((candidate) =>
      candidate.cityId === city.cityId
    );
    if (!timeline || timeline.status !== "available") {
      throw new Error(
        `PierCast daily score timeline missing for ${city.cityId}.`,
      );
    }
    const window = buildPierCastFullDayWindow({
      localDate: input.lakeDate,
      timezone: city.timezone,
    });
    return {
      cityId: city.cityId,
      date: buildDateOutlook({
        city,
        samples: timeline.samples,
        window,
        formulaVersion,
      }),
    };
  });
  if (
    cities.some(
      (city) =>
        city.date.headline.overall.status !== "available" ||
        city.date.species.some(
          (species) => species.biological.status !== "available",
        ),
    )
  ) {
    throw new Error(
      "PierCast daily score snapshot requires complete full-day scores.",
    );
  }
  return {
    status: "locked_daily_snapshot",
    lakeDate: input.lakeDate,
    scoreTimezone: "America/Chicago",
    setAt: generatedAt.toISOString(),
    publishAt: centralWindow.requestedInterval.start,
    engineVersion: input.engineVersion,
    formulaVersion,
    rubricVersion: PIER_CAST_RUBRIC_VERSION,
    seasonalCalibrationVersion: PIER_CAST_SEASONAL_CALIBRATION_VERSION,
    temperatureCalibrationVersion: PIER_CAST_TEMPERATURE_CALIBRATION_VERSION,
    source: {
      issuedAt: input.batch.issuedAt,
      fetchedAt: input.batch.fetchedAt,
    },
    cities,
  };
}

export function applyPierCastDailyScoreSnapshot(
  liveOutlook: PierCastReviewOutlookResponse,
  snapshot: PierCastDailyScoreSnapshot,
): PierCastReviewOutlookResponse {
  if (
    snapshot.status !== "locked_daily_snapshot" ||
    snapshot.formulaVersion !== liveOutlook.formulaVersion ||
    snapshot.cities.length !== 5
  ) {
    throw new Error("PierCast daily score snapshot is incompatible.");
  }
  let lockedCityCount = 0;
  const cities = liveOutlook.cities.map((city) => {
    const locked = snapshot.cities.find(
      (candidate) => candidate.cityId === city.cityId,
    );
    if (!locked) return city;
    const exactDateIndex = city.dates.findIndex((date) =>
      date.localDate === snapshot.lakeDate
    );
    const easternMidnightSeam = exactDateIndex < 0 &&
      city.timezone === "America/Detroit" &&
      city.dates[0]?.localDate === addIsoDate(snapshot.lakeDate, 1);
    const lockedDateIndex = exactDateIndex >= 0
      ? exactDateIndex
      : easternMidnightSeam
      ? 0
      : -1;
    const dates = city.dates.map((date, index) => {
      if (index !== lockedDateIndex) return date;
      lockedCityCount += 1;
      return {
        ...date,
        headline: locked.date.headline,
        species: locked.date.species,
      };
    });
    return { ...city, dates };
  });
  if (lockedCityCount !== 5) {
    throw new Error(
      "PierCast daily score snapshot does not match the live forecast date.",
    );
  }
  return { ...liveOutlook, dailyScoreSnapshot: snapshot, cities };
}

export function withholdPierCastCurrentDayScores(
  liveOutlook: PierCastReviewOutlookResponse,
): PierCastReviewOutlookResponse {
  const reasonCode = "daily_score_snapshot_missing";
  const unavailableScore = {
    status: "unavailable" as const,
    score: null,
    reasonCodes: [reasonCode],
    ratingName: "FinFindr Opportunity Rating" as const,
  };
  return {
    ...liveOutlook,
    cities: liveOutlook.cities.map((city) => ({
      ...city,
      dates: city.dates.map((date, index) =>
        index === 0
          ? {
            ...date,
            headline: {
              overall: unavailableScore,
              drivingSpeciesId: null,
              headlineMode: "unavailable" as const,
              promotion: {
                status: "blocked" as const,
                reasonCodes: [reasonCode],
              },
              reasonCodes: [reasonCode],
            },
            species: date.species.map((species) => ({
              ...species,
              biological: unavailableScore,
              promotion: {
                status: "blocked" as const,
                reasonCodes: [reasonCode],
              },
              reasonCodes: [
                ...new Set([...species.reasonCodes, reasonCode]),
              ],
            })),
          }
          : date
      ),
    })),
  };
}

function addIsoDate(localDate: string, days: number): string {
  const [year, month, day] = localDate.split("-").map(Number);
  if (![year, month, day].every(Number.isInteger)) return "";
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function buildRollingTemperatureTimeline(
  samples: readonly PierCastLmhofsSample[],
  evaluatedAt: Date,
): Array<{ validAt: string; temperatureC: number }> {
  const startTime = evaluatedAt.getTime();
  const ordered = [...samples].sort((left, right) =>
    Date.parse(left.validAt) - Date.parse(right.validAt)
  );
  const timeline = ordered
    .filter((sample) => Date.parse(sample.validAt) >= startTime)
    .map((sample) => ({
      validAt: sample.validAt,
      temperatureC: sample.temperatureC,
    }));
  const exactStart = timeline[0]?.validAt === evaluatedAt.toISOString();
  if (exactStart) return timeline;

  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index]!;
    const right = ordered[index + 1]!;
    const leftTime = Date.parse(left.validAt);
    const rightTime = Date.parse(right.validAt);
    if (startTime <= leftTime || startTime >= rightTime) continue;
    if (rightTime - leftTime !== HOUR_MS) return timeline;
    timeline.unshift({
      validAt: evaluatedAt.toISOString(),
      temperatureC: interpolate(
        left.temperatureC,
        right.temperatureC,
        (startTime - leftTime) / (rightTime - leftTime),
      ),
    });
    break;
  }
  return timeline;
}

function buildDateOutlook(input: {
  city: (typeof PIER_CAST_CITY_PROFILES)[number];
  samples: readonly PierCastLmhofsSample[];
  window: PierCastDailyAssessmentWindow;
  formulaVersion: PierCastFormulaVersion;
}) {
  const temperatureSegments = buildTemperatureCoverageSegments(
    input.samples,
    input.window,
  );
  const temperatureCoverage = aggregateCompleteDailyScore({
    requestedInterval: input.window.requestedInterval,
    segments: temperatureSegments.map((segment) => ({
      ...segment,
      scoreAtStart: 1,
      scoreAtEnd: 1,
    })),
  }).coverage;
  const temperaturePoints = buildTemperaturePoints(
    input.samples,
    input.window,
  );
  const temperatures = temperaturePoints.map((point) => point.temperatureC);
  const waterTemperature: PierCastReviewDailyTemperature = {
    status: temperatureCoverage.status,
    minimumC: temperatures.length > 0 ? Math.min(...temperatures) : null,
    maximumC: temperatures.length > 0 ? Math.max(...temperatures) : null,
    coverageFraction: temperatureCoverage.fraction,
    points: temperaturePoints,
  };

  const species = PIER_CAST_CORE_SPECIES_IDS.map((speciesId) => {
    const citySpecies = input.city.species.find((candidate) =>
      candidate.speciesId === speciesId
    );
    if (!citySpecies) {
      throw new Error(
        `PierCast core species ${speciesId} missing for ${input.city.cityId}.`,
      );
    }
    return buildSpeciesOutlook({
      speciesId,
      inheritance: citySpecies.inheritance,
      configurationRatingEnabled: citySpecies.ratingEnabled,
      seasonalCurve: citySpecies.seasonalOpportunityCurve,
      samples: input.samples,
      window: input.window,
      formulaVersion: input.formulaVersion,
    });
  });
  const headlineCandidates: PierCastSpeciesDailyCandidate[] = species.map(
    (candidate) => ({
      speciesId: candidate.speciesId,
      biological: candidate.biological,
      coverage: candidate.coverage,
      targetingEligibility: candidate.targetingEligibility,
      promotion: candidate.promotion,
    }),
  );

  return {
    localDate: input.window.localDate,
    timezone: input.window.timezone,
    scope: input.window.scope,
    requestedInterval: input.window.requestedInterval,
    openWaterNoticeApplies: pierCastOpenWaterNoticeApplies(
      input.window.localDate,
    ),
    waterTemperature,
    headline: selectPierCastDailyHeadline(headlineCandidates),
    species,
  };
}

function buildSpeciesOutlook(input: {
  speciesId: PierCastSpeciesId;
  researchTemperatureCurve?: PierCastTemperatureCurve;
  researchMonthEvidenceState?: PierCastMonthEvidenceState;
  inheritance: "candidate" | "conditional" | "historical_lead" | "unresolved";
  configurationRatingEnabled: boolean;
  seasonalCurve: Parameters<
    typeof evaluatePierCastSeasonalOpportunity
  >[0]["curve"];
  samples: readonly PierCastLmhofsSample[];
  window: PierCastDailyAssessmentWindow;
  formulaVersion: PierCastFormulaVersion;
}): PierCastReviewSpeciesOutlook {
  if (input.configurationRatingEnabled) {
    throw new Error("PierCast review preview expected disabled configuration.");
  }
  const speciesProfile = getPierCastSpeciesProfile(input.speciesId);
  const temperatureCurve = input.researchTemperatureCurve ??
    getPierCastCoreTemperatureCurve(input.speciesId);
  if (!speciesProfile || !temperatureCurve) {
    throw new Error(
      `PierCast core calibration missing for ${input.speciesId}.`,
    );
  }
  const monthIndex = Number(input.window.localDate.slice(5, 7)) - 1;
  const month = PIER_CAST_MONTHS[monthIndex];
  if (!month) throw new Error("PierCast review local month is invalid.");
  const monthEvidenceState = input.researchMonthEvidenceState ??
    speciesProfile.monthContexts[month].evidenceState;
  const seasonal = evaluatePierCastSeasonalOpportunity({
    ratingEnabled: true,
    mode: "review",
    localDate: input.window.localDate,
    curve: input.seasonalCurve,
  });

  const reasons = new Set<string>(seasonal.reasonCodes);
  const scoredSegments: PierCastScoredSegment[] = [];
  const suitabilityValues: number[] = [];
  if (seasonal.status === "available") {
    for (
      const segment of buildTemperatureScoreSegments(
        input.samples,
        input.window,
        temperatureCurve,
      )
    ) {
      const startTemperature = evaluateTemperatureSuitability({
        ratingEnabled: true,
        mode: "review",
        monthEvidenceState,
        inputStatus: "valid",
        waterTemperatureC: segment.temperatureAtStart,
        curve: temperatureCurve,
      });
      const endTemperature = evaluateTemperatureSuitability({
        ratingEnabled: true,
        mode: "review",
        monthEvidenceState,
        inputStatus: "valid",
        waterTemperatureC: segment.temperatureAtEnd,
        curve: temperatureCurve,
      });
      const start = combinePierCastOpportunity({
        seasonal,
        temperature: startTemperature,
        formulaVersion: input.formulaVersion,
      });
      const end = combinePierCastOpportunity({
        seasonal,
        temperature: endTemperature,
        formulaVersion: input.formulaVersion,
      });
      for (const reason of [...start.reasonCodes, ...end.reasonCodes]) {
        reasons.add(reason);
      }
      if (
        start.status === "available" && end.status === "available" &&
        startTemperature.status === "available" &&
        endTemperature.status === "available"
      ) {
        suitabilityValues.push(
          startTemperature.suitability,
          endTemperature.suitability,
        );
        scoredSegments.push({
          start: segment.start,
          end: segment.end,
          scoreAtStart: start.rating.score,
          scoreAtEnd: end.rating.score,
        });
      }
    }
  }

  const aggregate = aggregateCompleteDailyScore({
    requestedInterval: input.window.requestedInterval,
    segments: scoredSegments,
  });
  for (
    const reason of aggregate.biological.status === "available"
      ? []
      : aggregate.biological.reasonCodes
  ) reasons.add(reason);
  const targetingEligibility = input.inheritance === "candidate"
    ? "eligible" as const
    : input.inheritance === "conditional"
    ? "unknown" as const
    : "restricted" as const;
  const promotion = {
    status: "blocked" as const,
    reasonCodes: [
      "configuration_rating_disabled",
      "temperature_representation_not_approved",
    ],
  };

  return {
    speciesId: input.speciesId,
    previewMode: "disabled_provisional",
    configurationRatingEnabled: false,
    seasonalRating: seasonal.rating,
    seasonalCurveId: seasonal.status === "available"
      ? seasonal.curveId
      : input.seasonalCurve?.curveId ?? null,
    temperatureCurveId: temperatureCurve.curveId,
    temperatureSuitabilityRange: suitabilityValues.length > 0
      ? [Math.min(...suitabilityValues), Math.max(...suitabilityValues)]
      : null,
    biological: aggregate.biological,
    coverage: aggregate.coverage,
    targetingEligibility,
    promotion,
    reasonCodes: [...reasons],
  };
}

/**
 * Owner-only research output. These hypotheses never enter headline selection,
 * immutable daily snapshots, the shadow forecast ledger, or public catalogs.
 * Surface temperature is deliberately labeled an unvalidated scenario proxy.
 */
function buildAdditionalSpeciesResearch(input: {
  cityId: (typeof PIER_CAST_CITY_PROFILES)[number]["cityId"];
  samples: readonly PierCastLmhofsSample[];
  windows: readonly PierCastDailyAssessmentWindow[];
  formulaVersion: PierCastFormulaVersion;
}): PierCastAdditionalSpeciesResearch[] {
  return PIER_CAST_ADDITIONAL_ELIGIBILITY.filter((row) =>
    row.cityId === input.cityId
  ).map((row) => {
    const seasonalCurve = PIER_CAST_ADDITIONAL_SEASONAL_RESEARCH.find((curve) =>
      curve.cityId === row.cityId && curve.speciesId === row.speciesId
    );
    const thermal = PIER_CAST_ADDITIONAL_THERMAL_RESEARCH.find((profile) =>
      profile.speciesId === row.speciesId
    );
    if (!seasonalCurve || !thermal) {
      throw new Error("Incomplete additional-species research configuration.");
    }
    const deferred = row.speciesId === "round_whitefish";
    return {
      speciesId: row.speciesId,
      evaluatedStructureId: row.evaluatedStructureId,
      structureStatus: row.structureStatus,
      attribution: row.attribution,
      fishingMode: row.fishingMode,
      methodConstraint: row.methodConstraint,
      regulationValidThrough: row.regulationReview.validThrough,
      evidenceIds: [...row.evidenceIds],
      runtimeEligible: false,
      publicEnabled: false,
      interpretation: "surface_temperature_sensitivity_not_validated_forecast",
      thermalDecision: deferred
        ? "deferred_adult_response"
        : "provisional_sensitivity_only",
      blockingReasons: [...row.blockingReasons],
      dates: input.windows.map((window) => {
        const seasonal = evaluatePierCastSeasonalOpportunity({
          curve: seasonalCurve,
          localDate: window.localDate,
          ratingEnabled: true,
          mode: "review",
        });
        const hypotheticalOutlook = deferred ? null : buildSpeciesOutlook({
          speciesId: row.speciesId,
          inheritance: "conditional",
          configurationRatingEnabled: false,
          seasonalCurve,
          researchTemperatureCurve: thermal.curve,
          // Full-year product hypothesis, not a promotion of biological evidence.
          researchMonthEvidenceState: "proposed_regional_transfer",
          samples: input.samples,
          window,
          formulaVersion: input.formulaVersion,
        });
        if (hypotheticalOutlook) {
          hypotheticalOutlook.reasonCodes.push(
            "additional_species_sensitivity_only",
            ...row.blockingReasons,
          );
          hypotheticalOutlook.promotion = {
            status: "blocked",
            reasonCodes: [
              ...row.blockingReasons,
              "configuration_rating_disabled",
            ],
          };
        }
        return {
          localDate: window.localDate,
          regulationReviewStatus: window.localDate >= "2026-04-01" &&
              window.localDate <= row.regulationReview.validThrough
            ? "within_review_period"
            : "requires_refresh",
          seasonalRating: seasonal.rating,
          hypotheticalOutlook,
        };
      }),
    };
  });
}

type TemperatureSegment = {
  start: string;
  end: string;
  temperatureAtStart: number;
  temperatureAtEnd: number;
};

function buildTemperatureCoverageSegments(
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
): TemperatureSegment[] {
  return buildTemperatureSegments(samples, window, null);
}

function buildTemperatureScoreSegments(
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
  curve: PierCastTemperatureCurve,
): TemperatureSegment[] {
  return buildTemperatureSegments(samples, window, curve);
}

function buildTemperatureSegments(
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
  curve: PierCastTemperatureCurve | null,
): TemperatureSegment[] {
  const requestedStart = Date.parse(window.requestedInterval.start);
  const requestedEnd = Date.parse(window.requestedInterval.end);
  const ordered = [...samples].sort((left, right) =>
    Date.parse(left.validAt) - Date.parse(right.validAt)
  );
  const result: TemperatureSegment[] = [];

  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    const leftTime = Date.parse(left.validAt);
    const rightTime = Date.parse(right.validAt);
    if (rightTime - leftTime !== HOUR_MS) continue;
    const start = Math.max(requestedStart, leftTime);
    const end = Math.min(requestedEnd, rightTime);
    if (start >= end) continue;
    const startTemperature = interpolate(
      left.temperatureC,
      right.temperatureC,
      (start - leftTime) / (rightTime - leftTime),
    );
    const endTemperature = interpolate(
      left.temperatureC,
      right.temperatureC,
      (end - leftTime) / (rightTime - leftTime),
    );
    const splitPoints = [{ time: start, temperatureC: startTemperature }];
    if (curve && endTemperature !== startTemperature) {
      for (const knot of curve.knots) {
        const progress = (knot.temperatureC - startTemperature) /
          (endTemperature - startTemperature);
        if (progress > 0 && progress < 1) {
          splitPoints.push({
            time: start + progress * (end - start),
            temperatureC: knot.temperatureC,
          });
        }
      }
    }
    splitPoints.push({ time: end, temperatureC: endTemperature });
    splitPoints.sort((leftPoint, rightPoint) =>
      leftPoint.time - rightPoint.time
    );
    for (
      let pointIndex = 0;
      pointIndex < splitPoints.length - 1;
      pointIndex++
    ) {
      const from = splitPoints[pointIndex];
      const to = splitPoints[pointIndex + 1];
      result.push({
        start: new Date(from.time).toISOString(),
        end: new Date(to.time).toISOString(),
        temperatureAtStart: from.temperatureC,
        temperatureAtEnd: to.temperatureC,
      });
    }
  }
  return result;
}

function buildTemperaturePoints(
  samples: readonly PierCastLmhofsSample[],
  window: PierCastDailyAssessmentWindow,
) {
  const segments = buildTemperatureCoverageSegments(samples, window);
  const points = new Map<string, number>();
  for (const segment of segments) {
    points.set(segment.start, segment.temperatureAtStart);
    points.set(segment.end, segment.temperatureAtEnd);
  }
  return [...points.entries()]
    .sort((left, right) => Date.parse(left[0]) - Date.parse(right[0]))
    .map(([validAt, temperatureC]) => ({ validAt, temperatureC }));
}

function interpolate(left: number, right: number, progress: number): number {
  return left + (right - left) * progress;
}

function validateReviewBatch(batch: AvailableLmhofsBatch): void {
  if (
    batch.status !== "available" || batch.cities.length !== 5 ||
    batch.cities.some((city) =>
      city.status !== "available" || city.samples.length !== 121
    ) ||
    batch.cities.reduce((sum, city) => sum + city.samples.length, 0) !== 605
  ) {
    throw new Error(
      "PierCast review requires one complete archived all-city cycle.",
    );
  }
}
