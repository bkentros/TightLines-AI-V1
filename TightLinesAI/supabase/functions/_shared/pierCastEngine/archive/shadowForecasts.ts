import {
  PIER_CAST_PRIVATE_SEASONAL_VERSION,
  PIER_CAST_PRIVATE_THERMAL_VERSION,
} from "../config/privateCalibration.ts";
import {
  PIER_CAST_PRIVATE_FORECAST_COUNT,
  PIER_CAST_PRIVATE_ROSTER_VERSION,
  pierCastRosterMatches,
} from "../config/privateCalibration.ts";
import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import {
  PIER_CAST_BASELINE_FORMULA_VERSION,
  PIER_CAST_FORMULA_VERSION,
} from "../scoring/opportunity.ts";
import { PIER_CAST_RUBRIC_VERSION } from "../scoring/rating.ts";
import type {
  PierCastCityId,
  PierCastReviewOutlookResponse,
} from "../types.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export type PierCastShadowIngestionSource =
  | "live_lmhofs"
  | "fresh_archived_complete_cycle";

export type PierCastShadowForecastCommitSummary = {
  status: "committed" | "already_committed";
  runId: string;
  generatedAt: string;
  forecastCount: number;
  formulaVersion: string;
  comparator?: PierCastShadowForecastCommitSummary;
};

export type PierCastShadowForecastPayload = {
  run: {
    speciesRosterVersion: string;
    generatedAt: string;
    sourceIssuedAt: string;
    sourceFetchedAt: string;
    ingestionSource: PierCastShadowIngestionSource;
    engineVersion: string;
    formulaVersion: string;
    rubricVersion: string;
    seasonalCalibrationVersion: string;
    temperatureCalibrationVersion: string;
    previewOnly: true;
  };
  forecasts: Record<string, unknown>[];
};

export function buildPierCastShadowForecastPayload(input: {
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}): PierCastShadowForecastPayload {
  validateSnapshotInput(input.outlook, input.batch, input.engineVersion);
  const sourceIdByCity = new Map<PierCastCityId, string>();
  for (const city of input.batch.cities) {
    if (city.status !== "available" || city.samples.length !== 121) {
      throw new Error(
        "PierCast shadow snapshot requires complete city timelines.",
      );
    }
    const sourceIds = new Set(city.samples.map((sample) => sample.sourceId));
    if (sourceIds.size !== 1) {
      throw new Error("PierCast shadow snapshot found mixed city source IDs.");
    }
    sourceIdByCity.set(city.cityId, city.samples[0].sourceId);
  }

  const forecasts = input.outlook.cities.flatMap((city) => {
    const sourceId = sourceIdByCity.get(city.cityId);
    if (!sourceId) {
      throw new Error(`PierCast shadow source missing for ${city.cityId}.`);
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
  if (forecasts.length !== PIER_CAST_PRIVATE_FORECAST_COUNT) {
    throw new Error(
      "PierCast shadow snapshot requires the complete private roster for five dates.",
    );
  }

  return {
    run: {
      speciesRosterVersion: PIER_CAST_PRIVATE_ROSTER_VERSION,
      generatedAt: input.outlook.generatedAt,
      sourceIssuedAt: input.outlook.source.issuedAt,
      sourceFetchedAt: input.outlook.source.fetchedAt,
      ingestionSource: input.ingestionSource,
      engineVersion: input.engineVersion,
      formulaVersion: input.outlook.formulaVersion,
      rubricVersion: PIER_CAST_RUBRIC_VERSION,
      seasonalCalibrationVersion: PIER_CAST_PRIVATE_SEASONAL_VERSION,
      temperatureCalibrationVersion: PIER_CAST_PRIVATE_THERMAL_VERSION,
      previewOnly: true,
    },
    forecasts,
  };
}

export async function archivePierCastShadowForecast(input: {
  database: PierCastArchiveClient;
  outlook: PierCastReviewOutlookResponse;
  batch: AvailableBatch;
  ingestionSource: PierCastShadowIngestionSource;
  engineVersion: string;
}): Promise<PierCastShadowForecastCommitSummary> {
  const payload = buildPierCastShadowForecastPayload(input);
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_shadow_forecast",
    {
      p_run: payload.run,
      p_forecasts: payload.forecasts,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast shadow forecast commit failed.",
    );
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    typeof result.runId !== "string" ||
    result.runId.length === 0 ||
    Number(result.forecastCount) !== PIER_CAST_PRIVATE_FORECAST_COUNT
  ) {
    throw new Error(
      "PierCast shadow forecast commit returned an invalid result.",
    );
  }
  return {
    status: result.status,
    runId: result.runId,
    generatedAt: payload.run.generatedAt,
    forecastCount: PIER_CAST_PRIVATE_FORECAST_COUNT,
    formulaVersion: payload.run.formulaVersion,
  };
}

function validateSnapshotInput(
  outlook: PierCastReviewOutlookResponse,
  batch: AvailableBatch,
  engineVersion: string,
): void {
  if (
    !engineVersion.trim() ||
    outlook.mode !== "review" ||
    !outlook.previewOnly ||
    outlook.speciesRosterVersion !== PIER_CAST_PRIVATE_ROSTER_VERSION ||
    ![
      PIER_CAST_FORMULA_VERSION,
      PIER_CAST_BASELINE_FORMULA_VERSION,
    ].includes(outlook.formulaVersion) ||
    outlook.source.issuedAt !== batch.issuedAt ||
    outlook.source.fetchedAt !== batch.fetchedAt ||
    outlook.cities.length !== 5 ||
    batch.status !== "available" ||
    batch.cities.length !== 5 ||
    outlook.cities.some((city) =>
      city.representationDecision !== "blocked_insufficient_evidence" ||
      city.dates.length !== 5 ||
      city.dates.some((date, leadDay) =>
        !pierCastRosterMatches(
          city.cityId,
          date.species.map((s) => s.speciesId),
        ) ||
        date.scope !== (leadDay === 0 ? "remaining_day" : "full_day")
      )
    )
  ) {
    throw new Error(
      "PierCast shadow snapshot input is incomplete or inconsistent.",
    );
  }
}
