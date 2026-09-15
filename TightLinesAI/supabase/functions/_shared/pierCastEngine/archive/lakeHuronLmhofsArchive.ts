import {
  PIER_CAST_LAKE_HURON_CITY_IDS,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
  PIER_CAST_LAKE_HURON_SCOPE_VERSION,
  type PierCastLakeHuronCityId,
} from "../config/lakeHuronShadow.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

const HOURS = 121;
const COUNT = 363;
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;
const locations = new Map(
  PIER_CAST_LAKE_HURON_CITY_PROFILES.map((
    p,
  ) => [p.cityId, p.waterTemperatureSource!.configuredLocation!]),
);

export async function archivePierCastLakeHuronLmhofsBatch(
  database: PierCastArchiveClient,
  batch: PierCastLmhofsBatch,
  engineVersion: string,
): Promise<{ issuedAt: string; cityCount: 3; sampleCount: 363 }> {
  if (
    batch.status !== "available" || !batch.fullHorizonRequested ||
    batch.requestedForecastHours.length !== HOURS ||
    batch.cities.length !== 3 ||
    batch.cities.some((c) =>
      c.status !== "available" || c.samples.length !== HOURS
    )
  ) {
    throw new Error(
      "Lake Huron archive requires three complete 121-hour city timelines.",
    );
  }
  const samples = batch.cities.flatMap((c) => c.samples);
  validate(samples, batch.issuedAt);
  const { error } = await database.rpc(
    "commit_pier_cast_expansion_lmhofs_cycle",
    {
      p_scope_version: PIER_CAST_LAKE_HURON_SCOPE_VERSION,
      p_cycle: {
        status: batch.status,
        issuedAt: batch.issuedAt,
        fetchedAt: batch.fetchedAt,
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        engineVersion,
        fullHorizonRequested: true,
        diagnostics: batch.diagnostics,
      },
      p_samples: samples,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "Lake Huron archive commit failed.",
    );
  }
  return { issuedAt: batch.issuedAt, cityCount: 3, sampleCount: 363 };
}

export async function readLatestFreshPierCastLakeHuronLmhofsBatch(
  database: PierCastArchiveClient,
  now: Date,
  maxAgeHours = 13,
): Promise<AvailableBatch | null> {
  if (
    !Number.isFinite(now.getTime()) || !Number.isInteger(maxAgeHours) ||
    maxAgeHours < 1 || maxAgeHours > 24
  ) throw new Error("Lake Huron archive freshness is invalid.");
  const { data, error } = await database.rpc(
    "read_latest_fresh_pier_cast_expansion_lmhofs_samples",
    {
      p_scope_version: PIER_CAST_LAKE_HURON_SCOPE_VERSION,
      p_now: now.toISOString(),
      p_max_age_hours: maxAgeHours,
    },
  );
  if (error) {
    throw new Error(error.message?.trim() || "Lake Huron archive read failed.");
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length !== COUNT) {
    throw new Error("Lake Huron archive returned a partial cycle.");
  }
  const rows = data as Record<string, unknown>[];
  const samples = rows.map(parseSample);
  const issuedAt = samples[0].issuedAt;
  validate(samples, issuedAt);
  const fetchedAt = timestamp(rows[0].cycle_fetched_at, "cycle_fetched_at");
  const cycleAgeHours = (now.getTime() - Date.parse(issuedAt)) / 3_600_000;
  if (cycleAgeHours < 0 || cycleAgeHours > maxAgeHours) {
    throw new Error("Lake Huron archive returned a stale cycle.");
  }
  const cities = PIER_CAST_LAKE_HURON_CITY_IDS.map((cityId) => {
    const citySamples = samples.filter((s) => s.cityId === cityId).sort((
      a,
      b,
    ) => a.forecastHour - b.forecastHour);
    return {
      status: "available" as const,
      cityId,
      sourceId: citySamples[0].sourceId,
      issuedAt,
      requestedForecastHours: citySamples.map((s) => s.forecastHour),
      coverageStart: citySamples[0].validAt,
      coverageEnd: citySamples[120].validAt,
      samples: citySamples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt,
    fetchedAt,
    cycleAgeHours,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: HOURS }, (_, h) => h),
    cities,
    diagnostics: Array.isArray(rows[0].diagnostics)
      ? rows[0].diagnostics as AvailableBatch["diagnostics"]
      : [],
  };
}

function validate(samples: readonly PierCastLmhofsSample[], issuedAt: string) {
  if (samples.length !== COUNT) {
    throw new Error("Lake Huron archive requires exactly 363 samples.");
  }
  const counts = new Map<PierCastLakeHuronCityId, Set<number>>(
    PIER_CAST_LAKE_HURON_CITY_IDS.map((id) => [id, new Set()]),
  );
  for (const sample of samples) {
    if (
      !PIER_CAST_LAKE_HURON_CITY_IDS.includes(
        sample.cityId as PierCastLakeHuronCityId,
      )
    ) throw new Error("Unexpected Lake Huron city.");
    const id = sample.cityId as PierCastLakeHuronCityId;
    const location = locations.get(id)!;
    const hours = counts.get(id)!;
    if (
      sample.issuedAt !== issuedAt || sample.forecastHour < 0 ||
      sample.forecastHour > 120 || hours.has(sample.forecastHour) ||
      sample.validAt !==
        new Date(Date.parse(issuedAt) + sample.forecastHour * 3_600_000)
          .toISOString() ||
      sample.gridRow !== location.gridRow ||
      sample.gridColumn !== location.gridColumn ||
      sample.latitude !== location.latitude ||
      sample.longitude !== location.longitude
    ) throw new Error("Lake Huron samples are inconsistent.");
    hours.add(sample.forecastHour);
  }
  if ([...counts.values()].some((x) => x.size !== HOURS)) {
    throw new Error("Lake Huron archive requires 121 unique hours per city.");
  }
}

function parseSample(row: Record<string, unknown>): PierCastLmhofsSample {
  const sample: PierCastLmhofsSample = {
    cityId: String(row.city_id) as PierCastLakeHuronCityId,
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
  ) throw new Error("Lake Huron archive returned an invalid sample.");
  return sample;
}
function timestamp(value: unknown, field: string) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Lake Huron archive ${field} is invalid.`);
  }
  return new Date(value).toISOString();
}
