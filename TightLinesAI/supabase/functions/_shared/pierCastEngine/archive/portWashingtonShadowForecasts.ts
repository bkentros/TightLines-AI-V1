import {
  PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
  PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION,
  PIER_CAST_PORT_WASHINGTON_SEASONAL_VERSION,
  PIER_CAST_PORT_WASHINGTON_SPECIES_IDS,
  PIER_CAST_PORT_WASHINGTON_THERMAL_VERSION,
} from "../config/portWashingtonShadow.ts";
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

const FORECAST_COUNT = 20;

export function buildPierCastPortWashingtonShadowForecastPayload(input: {
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}) {
  validate(input);
  const timeline = input.batch.cities[0];
  const city = input.outlook.cities[0];
  const sourceIds = new Set(timeline.samples.map((sample) => sample.sourceId));
  if (sourceIds.size !== 1) {
    throw new Error("Port Washington shadow cycle contains mixed source IDs.");
  }
  const sourceId = timeline.samples[0].sourceId;
  const forecasts = city.dates.flatMap((date, leadDay) =>
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
  if (forecasts.length !== FORECAST_COUNT) {
    throw new Error(
      "Port Washington shadow payload must contain 20 forecasts.",
    );
  }
  return {
    run: {
      scopeVersion: PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION,
      speciesRosterVersion: PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
      generatedAt: input.outlook.generatedAt,
      sourceIssuedAt: input.outlook.source.issuedAt,
      sourceFetchedAt: input.outlook.source.fetchedAt,
      ingestionSource: input.ingestionSource,
      engineVersion: input.engineVersion,
      formulaVersion: input.outlook.formulaVersion,
      rubricVersion: PIER_CAST_RUBRIC_VERSION,
      seasonalCalibrationVersion: PIER_CAST_PORT_WASHINGTON_SEASONAL_VERSION,
      temperatureCalibrationVersion: PIER_CAST_PORT_WASHINGTON_THERMAL_VERSION,
      previewOnly: true as const,
    },
    forecasts,
  };
}

export async function archivePierCastPortWashingtonShadowForecast(input: {
  database: PierCastArchiveClient;
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}): Promise<PierCastShadowForecastCommitSummary> {
  const payload = buildPierCastPortWashingtonShadowForecastPayload(input);
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_expansion_shadow_forecast",
    { p_run: payload.run, p_forecasts: payload.forecasts },
  );
  if (error) {
    throw new Error(
      error.message?.trim() ||
        "Port Washington shadow forecast commit failed.",
    );
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    typeof result.runId !== "string" || !result.runId ||
    Number(result.forecastCount) !== FORECAST_COUNT
  ) throw new Error("Port Washington shadow commit result is invalid.");
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
  const city = input.outlook.cities[0];
  if (
    !input.engineVersion.trim() || input.outlook.mode !== "review" ||
    !input.outlook.previewOnly ||
    input.outlook.speciesRosterVersion !==
      PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION ||
    input.outlook.source.issuedAt !== input.batch.issuedAt ||
    input.outlook.source.fetchedAt !== input.batch.fetchedAt ||
    input.outlook.cities.length !== 1 ||
    city?.cityId !== "port_washington_wi" || city.dates.length !== 5 ||
    input.batch.status !== "available" || input.batch.cities.length !== 1 ||
    input.batch.cities[0]?.cityId !== "port_washington_wi" ||
    input.batch.cities[0].status !== "available" ||
    input.batch.cities[0].samples.length !== 121 ||
    city.dates.some((date, leadDay) =>
      date.species.length !== PIER_CAST_PORT_WASHINGTON_SPECIES_IDS.length ||
      date.species.some((species) =>
        !PIER_CAST_PORT_WASHINGTON_SPECIES_IDS.includes(
          species
            .speciesId as (typeof PIER_CAST_PORT_WASHINGTON_SPECIES_IDS)[
              number
            ],
        )
      ) || date.scope !== (leadDay === 0 ? "remaining_day" : "full_day")
    )
  ) throw new Error("Port Washington shadow input is incomplete.");
}
