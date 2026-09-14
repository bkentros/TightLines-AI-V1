import {
  PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION,
  PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION,
} from "../config/portWashingtonShadow.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

const CITY_ID = "port_washington_wi" as const;
const SAMPLE_COUNT = 121;

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export async function archivePierCastPortWashingtonLmhofsBatch(
  database: PierCastArchiveClient,
  batch: PierCastLmhofsBatch,
  engineVersion: string,
): Promise<{ issuedAt: string; cityCount: 1; sampleCount: 121 }> {
  if (
    batch.status !== "available" || !batch.fullHorizonRequested ||
    batch.requestedForecastHours.length !== SAMPLE_COUNT ||
    batch.cities.length !== 1 ||
    batch.cities[0]?.cityId !== CITY_ID ||
    batch.cities[0].status !== "available" ||
    batch.cities[0].samples.length !== SAMPLE_COUNT
  ) {
    throw new Error(
      "Port Washington shadow archive requires one complete 121-hour cycle.",
    );
  }
  validateSamples(batch.cities[0].samples, batch.issuedAt);
  const { error } = await database.rpc(
    "commit_pier_cast_expansion_lmhofs_cycle",
    {
      p_scope_version: PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION,
      p_cycle: {
        status: batch.status,
        issuedAt: batch.issuedAt,
        fetchedAt: batch.fetchedAt,
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        engineVersion,
        fullHorizonRequested: batch.fullHorizonRequested,
        diagnostics: batch.diagnostics,
      },
      p_samples: batch.cities[0].samples,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() ||
        "Port Washington shadow LMHOFS archive commit failed.",
    );
  }
  return { issuedAt: batch.issuedAt, cityCount: 1, sampleCount: SAMPLE_COUNT };
}

export async function readLatestFreshPierCastPortWashingtonLmhofsBatch(
  database: PierCastArchiveClient,
  now: Date,
  maxAgeHours = 13,
): Promise<AvailableBatch | null> {
  if (
    !Number.isFinite(now.getTime()) || !Number.isInteger(maxAgeHours) ||
    maxAgeHours < 1 || maxAgeHours > 24
  ) throw new Error("Port Washington archive freshness is invalid.");
  const { data, error } = await database.rpc(
    "read_latest_fresh_pier_cast_expansion_lmhofs_samples",
    {
      p_scope_version: PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION,
      p_now: now.toISOString(),
      p_max_age_hours: maxAgeHours,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "Port Washington shadow archive read failed.",
    );
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length !== SAMPLE_COUNT) {
    throw new Error("Port Washington shadow archive returned a partial cycle.");
  }
  const rows = data as Record<string, unknown>[];
  const samples = rows.map(parseSample).sort((a, b) =>
    a.forecastHour - b.forecastHour
  );
  const issuedAt = samples[0].issuedAt;
  validateSamples(samples, issuedAt);
  const fetchedAt = timestamp(rows[0].cycle_fetched_at, "cycle_fetched_at");
  const cycleAgeHours = (now.getTime() - Date.parse(issuedAt)) / 3_600_000;
  if (cycleAgeHours < 0 || cycleAgeHours > maxAgeHours) {
    throw new Error("Port Washington shadow archive returned a stale cycle.");
  }
  return {
    status: "available",
    issuedAt,
    fetchedAt,
    cycleAgeHours,
    fullHorizonRequested: true,
    requestedForecastHours: samples.map((sample) => sample.forecastHour),
    cities: [{
      status: "available",
      cityId: CITY_ID,
      sourceId: samples[0].sourceId,
      issuedAt,
      requestedForecastHours: samples.map((sample) => sample.forecastHour),
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [],
    }],
    diagnostics: Array.isArray(rows[0].diagnostics)
      ? rows[0].diagnostics as AvailableBatch["diagnostics"]
      : [],
  };
}

function validateSamples(
  samples: readonly PierCastLmhofsSample[],
  issuedAt: string,
): void {
  const hours = new Set<number>();
  for (const sample of samples) {
    if (
      sample.cityId !== CITY_ID || sample.issuedAt !== issuedAt ||
      sample.forecastHour < 0 || sample.forecastHour > 120 ||
      hours.has(sample.forecastHour) ||
      sample.validAt !== new Date(
          Date.parse(issuedAt) + sample.forecastHour * 3_600_000,
        ).toISOString() ||
      sample.gridRow !== PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.gridRow ||
      sample.gridColumn !==
        PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.gridColumn ||
      sample.latitude !== PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.latitude ||
      sample.longitude !== PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.longitude
    ) throw new Error("Port Washington LMHOFS samples are inconsistent.");
    hours.add(sample.forecastHour);
  }
  if (hours.size !== SAMPLE_COUNT) {
    throw new Error(
      "Port Washington LMHOFS archive requires 121 unique hours.",
    );
  }
}

function parseSample(row: Record<string, unknown>): PierCastLmhofsSample {
  const sample: PierCastLmhofsSample = {
    cityId: String(row.city_id) as "port_washington_wi",
    sourceId: String(row.source_id),
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt: timestamp(row.issued_at, "issued_at"),
    forecastHour: Number(row.forecast_hour),
    validAt: timestamp(row.valid_at, "valid_at"),
    temperatureC: Number(row.temperature_c),
    rawUnit: "C",
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: Number(row.grid_row),
    gridColumn: Number(row.grid_column),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    sourceUrl: String(row.source_url),
  };
  if (
    row.raw_unit !== "C" || row.vertical_selection !== "surface" ||
    Number(row.depth_index) !== 0 || !Number.isInteger(sample.forecastHour) ||
    !Number.isFinite(sample.temperatureC) || sample.temperatureC < -2 ||
    sample.temperatureC > 40
  ) throw new Error("Port Washington archive returned an invalid sample.");
  return sample;
}

function timestamp(value: unknown, field: string): string {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Port Washington archive ${field} is invalid.`);
  }
  return new Date(value).toISOString();
}
