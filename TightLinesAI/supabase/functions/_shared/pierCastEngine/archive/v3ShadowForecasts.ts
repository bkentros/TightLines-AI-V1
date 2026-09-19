import {
  getPierCastV3SpeciesIdsForCity,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_FORECAST_COUNT,
  PIER_CAST_V3_FORMULA_VERSION,
} from "../config/v3Calibration.ts";
import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import type { PierCastV3ReviewOutlookResponse } from "../pipeline/v3ReviewOutlook.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";
import type { PierCastShadowIngestionSource } from "./shadowForecasts.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;
const FORECAST_COUNT = PIER_CAST_V3_FORECAST_COUNT;

export type PierCastV3ShadowCommitSummary = {
  status: "committed" | "already_committed";
  runId: string;
  generatedAt: string;
  forecastCount: number;
  formulaVersion: typeof PIER_CAST_V3_FORMULA_VERSION;
};

export function buildPierCastV3ShadowForecastPayload(input: {
  outlook: PierCastV3ReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}) {
  validate(input);
  const forecasts = input.outlook.cities.flatMap((city) => {
    const timeline = input.batch.cities.find((candidate) =>
      candidate.cityId === city.cityId
    )!;
    const sourceIds = new Set(
      timeline.samples.map((sample) => sample.sourceId),
    );
    if (sourceIds.size !== 1) {
      throw new Error(`${city.cityId} v3 cycle contains mixed source IDs.`);
    }
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
          sourceId: timeline.samples[0].sourceId,
          modeCalibrationId: species.activeMode?.modeCalibrationId ?? null,
          modeId: species.activeMode?.modeId ?? null,
          fisheryStrength: species.activeMode?.fisheryStrength ?? null,
          seasonalAvailability: species.activeMode?.seasonalAvailability ??
            null,
          seasonalPotential: species.activeMode?.seasonalPotential ?? null,
          temperatureCurveId: species.temperatureCurveId,
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
    throw new Error(
      `Formula v3 shadow payload must contain ${FORECAST_COUNT} forecasts.`,
    );
  }
  return {
    run: {
      configVersion: PIER_CAST_V3_CONFIG_VERSION,
      generatedAt: input.outlook.generatedAt,
      sourceIssuedAt: input.outlook.source.issuedAt,
      sourceFetchedAt: input.outlook.source.fetchedAt,
      ingestionSource: input.ingestionSource,
      engineVersion: input.engineVersion,
      formulaVersion: input.outlook.formulaVersion,
      pass1CandidatesSha256: input.outlook.sourceHashes.pass1CandidatesSha256,
      pass1CalibrationSha256: input.outlook.sourceHashes.pass1CalibrationSha256,
      previewOnly: true as const,
      promotionStatus: "blocked" as const,
    },
    forecasts,
  };
}

export async function archivePierCastV3ShadowForecast(input: {
  database: PierCastArchiveClient;
  outlook: PierCastV3ReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}): Promise<PierCastV3ShadowCommitSummary> {
  const payload = buildPierCastV3ShadowForecastPayload(input);
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_v3_shadow_forecast",
    {
      p_run: payload.run,
      p_forecasts: payload.forecasts,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "Formula v3 shadow commit failed.",
    );
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    typeof result.runId !== "string" || !result.runId ||
    Number(result.forecastCount) !== FORECAST_COUNT
  ) throw new Error("Formula v3 shadow commit result is invalid.");
  return {
    status: result.status,
    runId: result.runId,
    generatedAt: payload.run.generatedAt,
    forecastCount: FORECAST_COUNT,
    formulaVersion: PIER_CAST_V3_FORMULA_VERSION,
  };
}

function validate(input: {
  outlook: PierCastV3ReviewOutlookResponse;
  batch: AvailableBatch;
  engineVersion: string;
}): void {
  if (
    !input.engineVersion.trim() || input.outlook.mode !== "v3_shadow_review" ||
    !input.outlook.previewOnly ||
    input.outlook.formulaVersion !== PIER_CAST_V3_FORMULA_VERSION ||
    input.outlook.configVersion !== PIER_CAST_V3_CONFIG_VERSION ||
    input.outlook.promotion.status !== "blocked" ||
    input.outlook.cities.length !== 22 ||
    input.batch.status !== "available" || input.batch.cities.length !== 22 ||
    input.outlook.source.issuedAt !== input.batch.issuedAt
  ) throw new Error("Formula v3 shadow input is incomplete.");
  for (const city of input.outlook.cities) {
    const speciesIds = getPierCastV3SpeciesIdsForCity(city.cityId);
    if (
      city.dates.length !== 5 ||
      city.dates.some((date, leadDay) =>
        date.species.length !== speciesIds.length ||
        date.scope !== (leadDay === 0 ? "remaining_day" : "full_day") ||
        date.species.some((species) =>
          !speciesIds.includes(species.speciesId) ||
          species.configurationRatingEnabled || species.publicEnabled ||
          species.promotion.status !== "blocked"
        )
      )
    ) {
      throw new Error(
        `Formula v3 shadow input is incomplete for ${city.cityId}.`,
      );
    }
  }
}
