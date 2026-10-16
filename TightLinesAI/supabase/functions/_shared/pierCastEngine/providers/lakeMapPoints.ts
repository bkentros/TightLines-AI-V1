import type { PierCastCityProfile } from "../types.ts";
import {
  fetchPierCastLmhofsBatch,
  type PierCastLmhofsBatch,
  type PierCastLmhofsFetch,
  type PierCastLmhofsSample,
} from "./lmhofs.ts";

const DEFAULT_MAP_URL = "https://map.finfindr.app";

type PointFile = {
  formatVersion: 1;
  productId: "NOAA_NOS_LMHOFS_REGULARGRID";
  units: "C";
  run: string;
  cycle: string;
  generatedAt: string;
  source: "thredds" | "nodd";
  sourceDistribution: "NOAA_COOPS_THREDDS" | "NOAA_NODD_AWS";
  sampleMethod:
    | "exact_lmhofs_regular_grid_cell"
    | "nodd_interpolated_to_exact_lmhofs_regular_grid_cell";
  cityCount: number;
  forecastHours: number;
  points: Array<{
    cityId: string;
    gridRow: number;
    gridColumn: number;
    latitude: number;
    longitude: number;
    depthIndex: number;
    samples: Array<
      { forecastHour: number; validAt: string; temperatureC: number }
    >;
  }>;
};

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(
    /=+$/,
    "",
  );
}

export async function createLakeMapPass(
  secret: string,
  now: Date,
): Promise<string> {
  if (secret.trim().length < 16) {
    throw new Error("lake_map_pass_secret_invalid");
  }
  const random = new Uint8Array(12);
  crypto.getRandomValues(random);
  const payload = `v1.${Math.floor(now.getTime() / 1000) + 600}.${
    base64url(random)
  }`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${base64url(new Uint8Array(signature))}`;
}

async function responseJson(
  response: Response,
  label: string,
): Promise<unknown> {
  if (!response.ok) throw new Error(`${label}_http_${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label}_malformed_json`);
  }
}

function safeRun(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,120}$/.test(value);
}

function validatePointFile(
  raw: unknown,
  profiles: readonly PierCastCityProfile[],
): PointFile {
  if (!raw || typeof raw !== "object") {
    throw new Error("lake_map_point_file_invalid");
  }
  const file = raw as Partial<PointFile>;
  if (
    file.formatVersion !== 1 ||
    file.productId !== "NOAA_NOS_LMHOFS_REGULARGRID" || file.units !== "C" ||
    !safeRun(file.run) ||
    !Number.isFinite(Date.parse(file.cycle ?? "")) ||
    !Number.isFinite(Date.parse(file.generatedAt ?? "")) ||
    !["thredds", "nodd"].includes(file.source ?? "") ||
    file.cityCount !== 32 || file.forecastHours !== 121 ||
    !Array.isArray(file.points) ||
    file.points.length !== 32 ||
    new Set(file.points.map((point) => point.cityId)).size !== 32
  ) {
    throw new Error("lake_map_point_file_metadata_invalid");
  }
  const byId = new Map(file.points.map((point) => [point.cityId, point]));
  const coherentSource = file.source === "thredds"
    ? file.sourceDistribution === "NOAA_COOPS_THREDDS" &&
      file.sampleMethod === "exact_lmhofs_regular_grid_cell"
    : file.sourceDistribution === "NOAA_NODD_AWS" &&
      file.sampleMethod ===
        "nodd_interpolated_to_exact_lmhofs_regular_grid_cell";
  if (!coherentSource) throw new Error("lake_map_point_file_source_invalid");
  for (const profile of profiles) {
    const expected = profile.waterTemperatureSource?.configuredLocation;
    const point = byId.get(profile.cityId);
    if (
      !expected || !point || point.gridRow !== expected.gridRow ||
      point.gridColumn !== expected.gridColumn || point.depthIndex !== 0 ||
      point.latitude !== expected.latitude ||
      point.longitude !== expected.longitude ||
      !Array.isArray(point.samples) || point.samples.length !== 121
    ) {
      throw new Error(`lake_map_point_mapping_invalid:${profile.cityId}`);
    }
    for (let hour = 0; hour < 121; hour += 1) {
      const sample = point.samples[hour];
      const expectedValidAt = Date.parse(file.cycle!) + hour * 3_600_000;
      if (
        sample?.forecastHour !== hour ||
        Date.parse(sample?.validAt ?? "") !== expectedValidAt ||
        !Number.isFinite(sample.temperatureC) || sample.temperatureC < -2 ||
        sample.temperatureC > 40
      ) {
        throw new Error(
          `lake_map_point_sample_invalid:${profile.cityId}:f${
            String(hour).padStart(3, "0")
          }`,
        );
      }
    }
  }
  return file as PointFile;
}

export async function fetchPierCastLakeMapBatch(options: {
  mapPassSecret: string;
  cityProfiles: readonly PierCastCityProfile[];
  fetchImpl?: PierCastLmhofsFetch;
  now?: () => Date;
  mapUrl?: string;
}): Promise<PierCastLmhofsBatch> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now?.() ?? new Date();
  const base = (options.mapUrl ?? DEFAULT_MAP_URL).replace(/\/$/, "");
  const pass = await createLakeMapPass(options.mapPassSecret, now);
  const auth = `t=${encodeURIComponent(pass)}`;
  // Minute-scoped versioning shares one edge-cache entry across each cohort
  // while bypassing any pointer response cached under an obsolete policy.
  const pointerVersion = Math.floor(now.getTime() / 60_000).toString(16)
    .padStart(8, "0");
  const pointerUrl =
    `${base}/runs/piercast/latest.json?v=${pointerVersion}&${auth}`;
  const pointer = await responseJson(
    await fetchImpl(pointerUrl, {
      headers: { accept: "application/json" },
      cache: "no-store",
    }),
    "lake_map_point_pointer",
  ) as Record<string, unknown>;
  if (
    !safeRun(pointer?.run) || pointer?.object !== "piercast-points.json" ||
    pointer?.base !== `runs/${pointer.run}/`
  ) {
    throw new Error("lake_map_point_pointer_invalid");
  }
  const filePath = `${pointer.base}${pointer.object}`;
  const file = validatePointFile(
    await responseJson(
      await fetchImpl(`${base}/${filePath}?${auth}`, {
        headers: { accept: "application/json" },
        cache: "no-store",
      }),
      "lake_map_point_file",
    ),
    options.cityProfiles,
  );
  if (
    file.run !== pointer.run || file.cycle !== pointer.cycle ||
    file.source !== pointer.source
  ) {
    throw new Error("lake_map_point_pointer_mismatch");
  }
  const cycleAgeHours = (now.getTime() - Date.parse(file.cycle)) / 3_600_000;
  const freshnessLimit = Math.min(
    ...options.cityProfiles.map((profile) =>
      profile.waterTemperatureSource?.freshnessLimitHours ?? 0
    ),
  );
  if (
    !Number.isFinite(cycleAgeHours) || cycleAgeHours < -1 ||
    cycleAgeHours > freshnessLimit
  ) {
    throw new Error("lake_map_point_cycle_stale");
  }
  const points = new Map(file.points.map((point) => [point.cityId, point]));
  const sourceUrl = `${base}/${filePath}`;
  const cities = options.cityProfiles.map((profile) => {
    const point = points.get(profile.cityId)!;
    const source = profile.waterTemperatureSource!;
    const samples: PierCastLmhofsSample[] = point.samples.map((sample) => ({
      cityId: profile.cityId,
      sourceId: source.sourceId,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: file.cycle,
      forecastHour: sample.forecastHour,
      validAt: sample.validAt,
      temperatureC: sample.temperatureC,
      rawUnit: "C",
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: point.gridRow,
      gridColumn: point.gridColumn,
      latitude: point.latitude,
      longitude: point.longitude,
      sourceUrl,
    }));
    return {
      status: "available" as const,
      cityId: profile.cityId,
      sourceId: source.sourceId,
      issuedAt: file.cycle,
      requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt: file.cycle,
    fetchedAt: now.toISOString(),
    cycleAgeHours,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities,
    diagnostics: [{
      code: "lake_map_surface",
      message:
        `Loaded coherent ${file.source.toUpperCase()} point feed for surface run ${file.run}.`,
      sourceUrl,
    }],
  };
}

export async function fetchConfiguredPierCastTemperatureBatch(options: {
  mode?: string | null;
  mapPassSecret?: string | null;
  cityProfiles: readonly PierCastCityProfile[];
  fetchImpl?: PierCastLmhofsFetch;
  now?: () => Date;
  mapUrl?: string;
  fetchLmhofs?: () => Promise<PierCastLmhofsBatch>;
}): Promise<PierCastLmhofsBatch> {
  const fallback = options.fetchLmhofs ?? (() =>
    fetchPierCastLmhofsBatch({
      fetchImpl: options.fetchImpl,
      now: options.now,
      cityProfiles: options.cityProfiles,
    }));
  if (options.mode !== "lake_map") return fallback();
  try {
    if (!options.mapPassSecret) throw new Error("lake_map_pass_secret_missing");
    return await fetchPierCastLakeMapBatch({
      mapPassSecret: options.mapPassSecret,
      cityProfiles: options.cityProfiles,
      fetchImpl: options.fetchImpl,
      now: options.now,
      mapUrl: options.mapUrl,
    });
  } catch (error) {
    const batch = await fallback();
    if (batch.status === "unavailable") return batch;
    return {
      ...batch,
      diagnostics: [{
        code: "source_failover",
        message: `Lake-map point feed failed; used direct THREDDS backup (${
          error instanceof Error ? error.message : String(error)
        }).`,
      }, ...batch.diagnostics],
    };
  }
}
