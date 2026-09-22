import {
  PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
  type PierCastPentwaterCasevilleCityId,
} from "../config/pentwaterCasevilleShadow.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../providers/lmhofs.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

const HOURS_PER_CITY = 121;
const SAMPLE_COUNT = 605;
type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;
const locations = new Map(
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.map((
    profile,
  ) => [profile.cityId, profile.waterTemperatureSource?.configuredLocation]),
);

export async function archivePierCastPentwaterCasevilleLmhofsBatch(
  database: PierCastArchiveClient,
  batch: PierCastLmhofsBatch,
  engineVersion: string,
): Promise<{ issuedAt: string; cityCount: 5; sampleCount: 605 }> {
  if (
    batch.status !== "available" || !batch.fullHorizonRequested ||
    batch.requestedForecastHours.length !== HOURS_PER_CITY ||
    batch.cities.length !== 5 ||
    batch.cities.some((city) =>
      city.status !== "available" || city.samples.length !== HOURS_PER_CITY
    )
  ) {
    throw new Error(
      "Pentwater–Caseville shadow archive requires five complete 121-hour city timelines.",
    );
  }
  const samples = batch.cities.flatMap((city) => city.samples);
  validateSamples(samples, batch.issuedAt);
  const { error } = await database.rpc(
    "commit_pier_cast_pentwater_caseville_lmhofs_cycle",
    {
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
      error.message?.trim() ||
        "Pentwater–Caseville LMHOFS archive commit failed.",
    );
  }
  return { issuedAt: batch.issuedAt, cityCount: 5, sampleCount: 605 };
}

export async function readLatestFreshPierCastPentwaterCasevilleLmhofsBatch(
  database: PierCastArchiveClient,
  now: Date,
  maxAgeHours = 13,
): Promise<AvailableBatch | null> {
  if (
    !Number.isFinite(now.getTime()) || !Number.isInteger(maxAgeHours) ||
    maxAgeHours < 1 || maxAgeHours > 24
  ) {
    throw new Error("Pentwater–Caseville archive freshness is invalid.");
  }
  const { data, error } = await database.rpc(
    "read_latest_pier_cast_pentwater_caseville_lmhofs",
    {
      p_now: now.toISOString(),
      p_max_age_hours: maxAgeHours,
    },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "Pentwater–Caseville archive read failed.",
    );
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length !== SAMPLE_COUNT) {
    throw new Error("Pentwater–Caseville archive returned a partial cycle.");
  }
  const rows = data as Record<string, unknown>[];
  const samples = rows.map(parseSample);
  const issuedAt = samples[0].issuedAt;
  validateSamples(samples, issuedAt);
  const fetchedAt = timestamp(rows[0].cycle_fetched_at, "cycle_fetched_at");
  const cycleAgeHours = (now.getTime() - Date.parse(issuedAt)) / 3_600_000;
  if (cycleAgeHours < 0 || cycleAgeHours > maxAgeHours) {
    throw new Error("Pentwater–Caseville archive returned a stale cycle.");
  }
  const cities = PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.map((cityId) => {
    const citySamples = samples.filter((sample) => sample.cityId === cityId)
      .sort((a, b) => a.forecastHour - b.forecastHour);
    return {
      status: "available" as const,
      cityId,
      sourceId: citySamples[0].sourceId,
      issuedAt,
      requestedForecastHours: citySamples.map((sample) => sample.forecastHour),
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
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities,
    diagnostics: Array.isArray(rows[0].diagnostics)
      ? rows[0].diagnostics as AvailableBatch["diagnostics"]
      : [],
  };
}

function validateSamples(
  samples: readonly PierCastLmhofsSample[],
  issuedAt: string,
): void {
  if (samples.length !== SAMPLE_COUNT) {
    throw new Error(
      "Pentwater–Caseville LMHOFS archive requires exactly 605 samples.",
    );
  }
  const counts = new Map<PierCastPentwaterCasevilleCityId, Set<number>>(
    PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.map((cityId) => [cityId, new Set()]),
  );
  for (const sample of samples) {
    if (
      !PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS.includes(
        sample.cityId as PierCastPentwaterCasevilleCityId,
      )
    ) {
      throw new Error(
        "Pentwater–Caseville LMHOFS sample has an unexpected city.",
      );
    }
    const cityId = sample.cityId as PierCastPentwaterCasevilleCityId;
    const location = locations.get(cityId);
    const hours = counts.get(cityId)!;
    if (
      !location || sample.issuedAt !== issuedAt || sample.forecastHour < 0 ||
      sample.forecastHour > 120 ||
      hours.has(sample.forecastHour) ||
      sample.validAt !==
        new Date(Date.parse(issuedAt) + sample.forecastHour * 3_600_000)
          .toISOString() ||
      sample.gridRow !== location.gridRow ||
      sample.gridColumn !== location.gridColumn ||
      sample.latitude !== location.latitude ||
      sample.longitude !== location.longitude ||
      !Number.isFinite(sample.temperatureC) || sample.temperatureC < -2 ||
      sample.temperatureC > 40
    ) throw new Error("Pentwater–Caseville LMHOFS samples are inconsistent.");
    hours.add(sample.forecastHour);
  }
  if ([...counts.values()].some((hours) => hours.size !== 121)) {
    throw new Error(
      "Pentwater–Caseville archive requires 121 unique hours per city.",
    );
  }
}

function parseSample(row: Record<string, unknown>): PierCastLmhofsSample {
  const sample: PierCastLmhofsSample = {
    cityId: String(row.city_id) as PierCastPentwaterCasevilleCityId,
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
    Number(row.depth_index) !== 0 || !Number.isInteger(sample.forecastHour)
  ) {
    throw new Error("Pentwater–Caseville archive returned an invalid sample.");
  }
  return sample;
}

function timestamp(value: unknown, field: string): string {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Pentwater–Caseville archive ${field} is invalid.`);
  }
  return new Date(value).toISOString();
}
