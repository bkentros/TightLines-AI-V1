import {
  PIER_CAST_WISCONSIN_CITY_IDS,
  PIER_CAST_WISCONSIN_ROSTER_VERSION,
  PIER_CAST_WISCONSIN_SCOPE_VERSION,
  PIER_CAST_WISCONSIN_SEASONAL_VERSION,
  PIER_CAST_WISCONSIN_SPECIES_IDS,
  PIER_CAST_WISCONSIN_THERMAL_VERSION,
} from "../config/wisconsinShadow.ts";
import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import { PIER_CAST_RUBRIC_VERSION } from "../scoring/rating.ts";
import type { PierCastReviewOutlookResponse } from "../types.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";
import type {
  PierCastShadowForecastCommitSummary,
  PierCastShadowIngestionSource,
} from "./shadowForecasts.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

const FORECAST_COUNT = 80;

export function buildPierCastWisconsinShadowForecastPayload(input: {
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}) {
  validate(input);
  const forecasts = input.outlook.cities.flatMap((city) => {
    const timeline = input.batch.cities.find((candidate) =>
      candidate.cityId === city.cityId
    )!;
    const sourceIds = new Set(timeline.samples.map((sample) => sample.sourceId));
    if (sourceIds.size !== 1) {
      throw new Error(`${city.cityId} shadow cycle contains mixed source IDs.`);
    }
    const sourceId = timeline.samples[0].sourceId;
    return city.dates.flatMap((date, leadDay) =>
      date.species.map((species) => {
        const available = species.biological.status === "available"
          ? species.biological
          : null;
        return {
          cityId: city.cityId,
          speciesId: species.speciesId,
          leadDay,
          localDate: date.localDate,
          timezone: date.timezone,
          assessmentScope: date.scope,
          requestedStart: date.requestedInterval.start,
          requestedEnd: date.requestedInterval.end,
          openWaterNoticeApplies: date.openWaterNoticeApplies,
          representationDecision: city.representationDecision,
          sourceId,
          seasonalCurveId: species.seasonalCurveId,
          temperatureCurveId: species.temperatureCurveId,
          seasonalRating: species.seasonalRating,
          temperatureMinimumC: date.waterTemperature.minimumC,
          temperatureMaximumC: date.waterTemperature.maximumC,
          temperatureSuitabilityMinimum:
            species.temperatureSuitabilityRange?.[0] ?? null,
          temperatureSuitabilityMaximum:
            species.temperatureSuitabilityRange?.[1] ?? null,
          coverageStatus: species.coverage.status,
          coverageFraction: species.coverage.fraction,
          scoreStatus: species.biological.status,
          score: available?.score ?? null,
          displayScore: available?.displayScore ?? null,
          displayText: available?.displayText ?? null,
          ratingLabel: available?.label ?? null,
          targetingEligibility: species.targetingEligibility,
          promotionStatus: species.promotion.status,
          reasonCodes: species.reasonCodes,
        };
      })
    );
  });
  if (forecasts.length !== FORECAST_COUNT) {
    throw new Error("Wisconsin shadow payload must contain 80 forecasts.");
  }
  return {
    run: {
      scopeVersion: PIER_CAST_WISCONSIN_SCOPE_VERSION,
      speciesRosterVersion: PIER_CAST_WISCONSIN_ROSTER_VERSION,
      generatedAt: input.outlook.generatedAt,
      sourceIssuedAt: input.outlook.source.issuedAt,
      sourceFetchedAt: input.outlook.source.fetchedAt,
      ingestionSource: input.ingestionSource,
      engineVersion: input.engineVersion,
      formulaVersion: input.outlook.formulaVersion,
      rubricVersion: PIER_CAST_RUBRIC_VERSION,
      seasonalCalibrationVersion: PIER_CAST_WISCONSIN_SEASONAL_VERSION,
      temperatureCalibrationVersion: PIER_CAST_WISCONSIN_THERMAL_VERSION,
      previewOnly: true as const,
    },
    forecasts,
  };
}

export async function archivePierCastWisconsinShadowForecast(input: {
  database: PierCastArchiveClient;
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}): Promise<PierCastShadowForecastCommitSummary> {
  const payload = buildPierCastWisconsinShadowForecastPayload(input);
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_expansion_shadow_forecast",
    { p_run: payload.run, p_forecasts: payload.forecasts },
  );
  if (error) {
    throw new Error(error.message?.trim() || "Wisconsin shadow forecast commit failed.");
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    typeof result.runId !== "string" || !result.runId ||
    Number(result.forecastCount) !== FORECAST_COUNT
  ) throw new Error("Wisconsin shadow commit result is invalid.");
  return {
    status: result.status,
    runId: result.runId,
    generatedAt: payload.run.generatedAt,
    forecastCount: FORECAST_COUNT,
    formulaVersion: payload.run.formulaVersion,
  };
}

function validate(input: {
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  engineVersion: string;
}): void {
  if (
    !input.engineVersion.trim() || input.outlook.mode !== "review" ||
    !input.outlook.previewOnly ||
    input.outlook.speciesRosterVersion !== PIER_CAST_WISCONSIN_ROSTER_VERSION ||
    input.outlook.source.issuedAt !== input.batch.issuedAt ||
    input.outlook.source.fetchedAt !== input.batch.fetchedAt ||
    input.outlook.cities.length !== 4 || input.batch.status !== "available" ||
    input.batch.cities.length !== 4
  ) throw new Error("Wisconsin shadow input is incomplete.");
  for (const cityId of PIER_CAST_WISCONSIN_CITY_IDS) {
    const city = input.outlook.cities.find((candidate) => candidate.cityId === cityId);
    const timeline = input.batch.cities.find((candidate) => candidate.cityId === cityId);
    if (
      !city || city.dates.length !== 5 || !timeline ||
      timeline.status !== "available" || timeline.samples.length !== 121 ||
      city.dates.some((date, leadDay) =>
        date.species.length !== PIER_CAST_WISCONSIN_SPECIES_IDS.length ||
        date.species.some((species) =>
          !PIER_CAST_WISCONSIN_SPECIES_IDS.includes(
            species.speciesId as (typeof PIER_CAST_WISCONSIN_SPECIES_IDS)[number],
          )
        ) || date.scope !== (leadDay === 0 ? "remaining_day" : "full_day")
      )
    ) throw new Error(`Wisconsin shadow input is incomplete for ${cityId}.`);
  }
}
