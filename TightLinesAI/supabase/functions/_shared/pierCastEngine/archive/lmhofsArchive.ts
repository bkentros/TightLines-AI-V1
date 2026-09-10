import type {
  PierCastLmhofsBatch,
  PierCastLmhofsCityTimeline,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import { PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS } from "../config/coreCalibration.ts";
import type { PierCastCityId } from "../types.ts";

// Two six-hour model cycles plus publication/scheduler tolerance. This keeps
// exactly one previously archived cycle usable at the :35 scheduled run.
export const PIER_CAST_ARCHIVE_MAX_CYCLE_AGE_HOURS = 13;

export type PierCastArchiveClient = {
  rpc: (
    functionName: string,
    arguments_: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

export async function archivePierCastLmhofsBatch(
  database: PierCastArchiveClient,
  batch: PierCastLmhofsBatch,
  engineVersion: string,
): Promise<{ issuedAt: string; cityCount: 5; sampleCount: 605 }> {
  if (
    batch.status !== "available" ||
    !batch.fullHorizonRequested ||
    batch.requestedForecastHours.length !== 121 ||
    batch.cities.length !== 5 ||
    batch.cities.some((city) =>
      city.status !== "available" || city.samples.length !== 121
    )
  ) {
    throw new Error(
      "Only a complete 121-hour LMHOFS batch for all five cities may be archived.",
    );
  }
  const samples = batch.cities.flatMap((city) => city.samples);
  validateArchiveSamples(samples, batch.issuedAt);

  const { error } = await database.rpc("commit_pier_cast_lmhofs_cycle", {
    p_cycle: {
      status: batch.status,
      issuedAt: batch.issuedAt,
      fetchedAt: batch.fetchedAt,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      engineVersion,
      fullHorizonRequested: batch.fullHorizonRequested,
      diagnostics: batch.diagnostics,
    },
    p_samples: samples,
  });
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast LMHOFS archive commit failed.",
    );
  }
  return {
    issuedAt: batch.issuedAt,
    cityCount: 5,
    sampleCount: 605,
  };
}

export async function readLatestFreshPierCastLmhofsBatch(
  database: PierCastArchiveClient,
  now: Date,
  maxAgeHours = PIER_CAST_ARCHIVE_MAX_CYCLE_AGE_HOURS,
): Promise<
  Extract<
    PierCastLmhofsBatch,
    { status: "available" | "partial" }
  > | null
> {
  if (
    !Number.isFinite(now.getTime()) ||
    !Number.isInteger(maxAgeHours) ||
    maxAgeHours < 1 ||
    maxAgeHours > 24
  ) {
    throw new Error("PierCast archive freshness must be 1 through 24 hours.");
  }
  const { data, error } = await database.rpc(
    "read_latest_fresh_pier_cast_lmhofs_samples",
    {
      p_now: now.toISOString(),
      p_max_age_hours: maxAgeHours,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast LMHOFS archive read failed.",
    );
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length !== 605) {
    throw new Error("PierCast archive returned an incomplete LMHOFS cycle.");
  }

  const rows = data as Record<string, unknown>[];
  const samples = rows.map(parseArchivedSample);
  const issuedAt = samples[0].issuedAt;
  validateArchiveSamples(samples, issuedAt);
  const fetchedAt = parseTimestamp(
    rows[0].cycle_fetched_at,
    "cycle_fetched_at",
  );
  const cycleAgeHours = (now.getTime() - Date.parse(issuedAt)) /
    (60 * 60 * 1000);
  if (cycleAgeHours < 0 || cycleAgeHours > maxAgeHours) {
    throw new Error(
      "PierCast archive returned a stale or future LMHOFS cycle.",
    );
  }

  const cities = Object.keys(PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS).map(
    (cityId): PierCastLmhofsCityTimeline => {
      const citySamples = samples
        .filter((sample) => sample.cityId === cityId)
        .sort((a, b) => a.forecastHour - b.forecastHour);
      if (
        citySamples.length !== 121 ||
        citySamples.some((sample, forecastHour) =>
          sample.forecastHour !== forecastHour
        )
      ) {
        throw new Error(
          `PierCast archive returned an incomplete ${cityId} timeline.`,
        );
      }
      return {
        status: "available",
        cityId: cityId as PierCastCityId,
        sourceId: citySamples[0].sourceId,
        issuedAt,
        requestedForecastHours: citySamples.map((sample) =>
          sample.forecastHour
        ),
        coverageStart: citySamples[0].validAt,
        coverageEnd: citySamples[120].validAt,
        samples: citySamples,
        reasonCodes: [],
      };
    },
  );

  return {
    status: "available",
    issuedAt,
    fetchedAt,
    cycleAgeHours,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities,
    diagnostics: Array.isArray(rows[0].diagnostics)
      ? rows[0].diagnostics as Extract<
        PierCastLmhofsBatch,
        { status: "available" | "partial" }
      >["diagnostics"]
      : [],
  };
}

function validateArchiveSamples(
  samples: readonly PierCastLmhofsSample[],
  issuedAt: string,
): void {
  const keys = new Set<string>();
  for (const sample of samples) {
    const key = `${sample.cityId}:${sample.forecastHour}`;
    if (
      keys.has(key) ||
      sample.issuedAt !== issuedAt ||
      sample.validAt !== new Date(
          Date.parse(issuedAt) + sample.forecastHour * 60 * 60 * 1000,
        ).toISOString()
    ) {
      throw new Error("LMHOFS archive samples are duplicated or inconsistent.");
    }
    keys.add(key);
  }
  if (keys.size !== 605) {
    throw new Error("LMHOFS archive requires exactly 605 unique samples.");
  }
}

function parseArchivedSample(
  row: Record<string, unknown>,
): PierCastLmhofsSample {
  const cityId = String(row.city_id) as PierCastCityId;
  const configured = PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS[cityId];
  const issuedAt = parseTimestamp(row.issued_at, "issued_at");
  const validAt = parseTimestamp(row.valid_at, "valid_at");
  const forecastHour = Number(row.forecast_hour);
  const temperatureC = Number(row.temperature_c);
  const gridRow = Number(row.grid_row);
  const gridColumn = Number(row.grid_column);
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  if (
    !configured ||
    !Number.isInteger(forecastHour) ||
    forecastHour < 0 ||
    forecastHour > 120 ||
    !Number.isFinite(temperatureC) ||
    temperatureC < -2 ||
    temperatureC > 40 ||
    row.raw_unit !== "C" ||
    row.vertical_selection !== "surface" ||
    Number(row.depth_index) !== 0 ||
    gridRow !== configured.gridRow ||
    gridColumn !== configured.gridColumn ||
    latitude !== configured.latitude ||
    longitude !== configured.longitude ||
    typeof row.source_id !== "string" ||
    typeof row.source_url !== "string"
  ) {
    throw new Error("PierCast archive returned an invalid LMHOFS sample.");
  }
  return {
    cityId,
    sourceId: row.source_id,
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt,
    forecastHour,
    validAt,
    temperatureC,
    rawUnit: "C",
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow,
    gridColumn,
    latitude,
    longitude,
    sourceUrl: row.source_url,
  };
}

function parseTimestamp(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`PierCast archive ${field} is not a timestamp.`);
  }
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) {
    throw new Error(`PierCast archive ${field} is not a timestamp.`);
  }
  return parsed.toISOString();
}
