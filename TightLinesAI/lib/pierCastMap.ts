import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastLeaderboardResponse,
  PierCastMapFoundationResponse,
  PierCastReviewDateOutlookRead,
  PierCastTemperatureMapResponse,
} from "./pierCastContracts";
import type {
  PierCastConditionsCatalogResponseV4,
  PierCastConditionsCatalogCityV4,
  PierCastConditionsMapResponseV4,
  PierCastMapSpeciesFrameReadV4,
  PierCastThermalBandV4,
} from "./pierCastConditionsV4";
import {
  buildPierCastOfsDatasetUrl,
  PIER_CAST_GREAT_LAKES_MODELS,
  type PierCastGreatLakeId,
  type PierCastGreatLakesOfsId,
  type PierCastMapRegionCode,
} from "./pierCastGreatLakes";
import {
  PIER_CAST_WATER_SCALE_MAX_F,
  PIER_CAST_WATER_SCALE_MIN_F,
} from "./pierCastTemperatureScale";

export type PierCastMapStateCode = PierCastMapRegionCode;
export type PierCastMapFilter = "ALL" | PierCastMapStateCode;
export type PierCastMapMode = "match" | "temperature" | "bathymetry";
export type PierCastMapBounds = [
  west: number,
  south: number,
  east: number,
  north: number,
];

export type PierCastMapCity = {
  city: PierCastCatalogCityRead;
  latitude: number;
  longitude: number;
  date: Pick<PierCastReviewDateOutlookRead, "localDate" | "headline"> | null;
  score: number | null;
  rankingScore: number | null;
  rank: number | null;
};

export type PierCastTemperatureMapCity = PierCastMapCity & {
  temperatureC: number;
  temperatureF: number;
  validAt: string;
};

export type PierCastConditionsMapCity = {
  city: PierCastConditionsCatalogCityV4;
  latitude: number;
  longitude: number;
  temperatureC: number | null;
  temperatureF: number | null;
  validAt: string | null;
  speciesFrame: PierCastMapSpeciesFrameReadV4 | null;
};

/**
 * Match colors are a fishing interpretation, so they are only valid when the
 * complete species frame is eligible and rankable. A restricted, unsupported,
 * or incomplete city must stay neutral even when raw temperature is present.
 */
export function pierCastAvailableMapMatchBand(
  frame: PierCastMapSpeciesFrameReadV4 | null,
): PierCastThermalBandV4 | null {
  return frame?.rankingDisposition === "ranked" &&
      frame.targetingEligibility === "eligible" &&
      frame.thermalMatch.status === "available"
    ? frame.thermalMatch.band
    : null;
}

export type PierCastTemperatureRasterFrame = {
  forecastHour: number;
  validAt: string;
  tileUrl: string;
};

export type PierCastGreatLakesTemperatureRasterFrame =
  & PierCastTemperatureRasterFrame
  & {
    ofsId: PierCastGreatLakesOfsId;
    lakeIds: readonly PierCastGreatLakeId[];
  };

export type PierCastBathymetryRasterFrame = {
  lakeIds: readonly PierCastGreatLakeId[];
  ofsId: PierCastGreatLakesOfsId;
  rasterTileUrl: string;
  contourTileUrl: string;
};

const LMHOFS_WMS_ROOT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/wms/NOAA/LMHOFS/MODELS";
const LMHOFS_MAX_FORECAST_HOUR = 120;

/**
 * LMHOFS resolves parts of the nearshore grid down to tens of metres. Let the
 * camera and WMS source request shoreline-scale tiles instead of stopping at
 * the regional zoom used by the overview.
 */
export const PIER_CAST_MAP_MIN_ZOOM = 3.2;
export const PIER_CAST_MAP_MAX_ZOOM = 14;
export const PIER_CAST_TEMPERATURE_RASTER_MAX_ZOOM = 14;
export const PIER_CAST_MAP_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

export const PIER_CAST_GREAT_LAKES_BOUNDS: PierCastMapBounds = [
  -93.15,
  39.75,
  -74.25,
  49.25,
];

export const PIER_CAST_ACTIVE_MAP_BOUNDS: PierCastMapBounds =
  PIER_CAST_GREAT_LAKES_BOUNDS;

export const PIER_CAST_STATE_MAP_BOUNDS: Record<
  PierCastMapStateCode,
  PierCastMapBounds
> = {
  MI: [-87.05, 41.55, -82.05, 45.85],
  WI: [-88.2, 42.45, -87.25, 45.2],
  IL: [-88.12, 41.65, -87.28, 42.82],
  IN: [-87.18, 41.55, -86.45, 42.15],
  MN: [-92.35, 46.55, -89.3, 48.25],
  OH: [-83.55, 41.25, -80.45, 42.25],
  PA: [-80.55, 41.75, -79.7, 42.35],
  NY: [-79.95, 42.0, -75.85, 44.25],
  ON: [-92.3, 41.55, -76.0, 49.25],
};

function displayScore(
  date: Pick<PierCastReviewDateOutlookRead, "headline"> | null,
): number | null {
  return date?.headline.overall.status === "available"
    ? date.headline.overall.displayScore
    : null;
}

function rankingScore(
  date: Pick<PierCastReviewDateOutlookRead, "headline"> | null,
): number | null {
  return date?.headline.overall.status === "available"
    ? date.headline.overall.score
    : null;
}

export function buildPierCastMapCities(
  catalog: Pick<PierCastCatalogResponse, "cities">,
  leaderboard: Pick<PierCastLeaderboardResponse, "cities">,
): PierCastMapCity[] {
  const standings = new Map(
    leaderboard.cities.map((city) => [city.cityId, city.dates[0] ?? null]),
  );
  const entries = catalog.cities
    .filter((city) => city.releaseStatus === "public_research")
    .flatMap((city) => {
      const location = city.waterTemperatureSource?.configuredLocation;
      const point = location?.referencePoint ?? location;
      if (!point) return [];
      const date = standings.get(city.cityId) ?? null;
      return [
        {
          city,
          latitude: point.latitude,
          longitude: point.longitude,
          date,
          score: displayScore(date),
          rankingScore: rankingScore(date),
          rank: null,
        } satisfies PierCastMapCity,
      ];
    });

  const ranked = entries
    .filter((entry) => entry.rankingScore !== null)
    .sort(
      (left, right) =>
        right.rankingScore! - left.rankingScore! ||
        left.city.displayName.localeCompare(right.city.displayName),
    );
  const rankByCityId = new Map(
    ranked.map((entry, index) => [entry.city.cityId, index + 1]),
  );
  return entries
    .map((entry) => ({
      ...entry,
      rank: rankByCityId.get(entry.city.cityId) ?? null,
    }))
    .sort(
      (left, right) =>
        (left.rank ?? Number.POSITIVE_INFINITY) -
          (right.rank ?? Number.POSITIVE_INFINITY) ||
        left.city.displayName.localeCompare(right.city.displayName),
    );
}

export function filterPierCastMapCities(
  cities: readonly PierCastMapCity[],
  filter: PierCastMapFilter,
): PierCastMapCity[] {
  return filter === "ALL"
    ? [...cities]
    : cities.filter((entry) => entry.city.stateCode === filter);
}

export function buildPierCastConditionsMapCities(
  catalog: Pick<PierCastConditionsCatalogResponseV4, "cities">,
  response: PierCastConditionsMapResponseV4,
  validAt: string | null,
): PierCastConditionsMapCity[] {
  const byCityId = new Map(
    response.cities.map((city) => [city.cityId, city]),
  );
  return catalog.cities
    .filter((city) => city.releaseStatus === "public_research")
    .flatMap((city) => {
      const conditions = byCityId.get(city.cityId);
      if (!conditions) return [];
      const temperature = validAt
        ? conditions.temperatureTimeline.find((point) =>
          point.validAt === validAt
        ) ?? null
        : null;
      const speciesFrame = validAt
        ? conditions.selectedSpecies?.frames.find((frame) =>
          frame.validAt === validAt
        ) ?? null
        : null;
      return [{
        city,
        latitude: conditions.latitude,
        longitude: conditions.longitude,
        temperatureC: temperature?.temperatureC ?? null,
        temperatureF: temperature
          ? celsiusToFahrenheit(temperature.temperatureC)
          : null,
        validAt: temperature?.validAt ?? null,
        speciesFrame,
      } satisfies PierCastConditionsMapCity];
    })
    .sort((left, right) =>
      left.city.displayName.localeCompare(right.city.displayName) ||
      left.city.cityId.localeCompare(right.city.cityId)
    );
}

export function filterPierCastConditionsMapCities(
  cities: readonly PierCastConditionsMapCity[],
  filter: PierCastMapFilter,
): PierCastConditionsMapCity[] {
  return filter === "ALL"
    ? [...cities]
    : cities.filter((entry) => entry.city.stateCode === filter);
}

export function pierCastMapBoundsForFilter(
  filter: PierCastMapFilter,
): PierCastMapBounds {
  return filter === "ALL"
    ? PIER_CAST_ACTIVE_MAP_BOUNDS
    : PIER_CAST_STATE_MAP_BOUNDS[filter];
}

export function pierCastMapRegionFeatureCode(
  region: PierCastMapStateCode,
): string {
  return region === "ON" ? "CA-ON" : `US-${region}`;
}

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * 9 / 5 + 32;
}

export function pierCastTemperatureValidTimes(
  response: PierCastTemperatureMapResponse | null,
): string[] {
  return response?.cities[0]?.points.map((point) => point.validAt) ?? [];
}

/**
 * NOAA publishes one LMHOFS regular-grid file per whole forecast hour. The
 * point feed may prepend a current-time interpolation, so the visual map only
 * offers timestamps with an exact lake-wide raster companion.
 */
export function pierCastTemperatureRasterValidTimes(
  response: PierCastTemperatureMapResponse | null,
): string[] {
  if (!response) return [];
  const issuedAtMs = Date.parse(response.source.issuedAt);
  if (!Number.isFinite(issuedAtMs)) return [];
  return pierCastTemperatureValidTimes(response).filter((validAt) => {
    const leadHours = (Date.parse(validAt) - issuedAtMs) / 3_600_000;
    return Number.isFinite(leadHours) &&
      leadHours >= 0 &&
      leadHours <= LMHOFS_MAX_FORECAST_HOUR &&
      Math.abs(leadHours - Math.round(leadHours)) < 1e-6;
  });
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5 / 9;
}

/** Build the MapLibre WMS template for one exact NOAA LMHOFS surface frame. */
export function buildPierCastTemperatureRasterFrame(
  response: Pick<PierCastTemperatureMapResponse, "source">,
  validAt: string,
): PierCastTemperatureRasterFrame | null {
  const issuedAt = new Date(response.source.issuedAt);
  const issuedAtMs = issuedAt.getTime();
  const validAtMs = Date.parse(validAt);
  if (!Number.isFinite(issuedAtMs) || !Number.isFinite(validAtMs)) return null;
  const rawLeadHours = (validAtMs - issuedAtMs) / 3_600_000;
  const forecastHour = Math.round(rawLeadHours);
  if (
    forecastHour < 0 ||
    forecastHour > LMHOFS_MAX_FORECAST_HOUR ||
    Math.abs(rawLeadHours - forecastHour) >= 1e-6
  ) {
    return null;
  }

  const year = issuedAt.getUTCFullYear();
  const month = pad2(issuedAt.getUTCMonth() + 1);
  const day = pad2(issuedAt.getUTCDate());
  const cycle = pad2(issuedAt.getUTCHours());
  const dateStamp = `${year}${month}${day}`;
  const forecastStamp = String(forecastHour).padStart(3, "0");
  const datasetUrl = `${LMHOFS_WMS_ROOT}/${year}/${month}/${day}/` +
    `lmhofs.t${cycle}z.${dateStamp}.regulargrid.f${forecastStamp}.nc`;
  const parameters = [
    "service=WMS",
    "version=1.1.1",
    "request=GetMap",
    "layers=temp",
    "styles=default-scalar/x-Sst",
    "format=image/png",
    "transparent=true",
    "srs=EPSG:3857",
    "bbox={bbox-epsg-3857}",
    "width=256",
    "height=256",
    "elevation=0",
    `colorscalerange=${fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MIN_F)},${
      fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MAX_F)
    }`,
    "numcolorbands=250",
    "belowmincolor=extend",
    "abovemaxcolor=extend",
  ];
  return {
    forecastHour,
    validAt,
    tileUrl: `${datasetUrl}?${parameters.join("&")}`,
  };
}

/** Build the four synchronized NOAA temperature rasters used by the five-lake map. */
export function buildPierCastGreatLakesTemperatureRasterFrames(
  response: Pick<PierCastMapFoundationResponse, "timeline" | "temperature">,
  validAt: string,
): PierCastGreatLakesTemperatureRasterFrame[] {
  if (!response.timeline.validTimes.includes(validAt)) return [];
  return response.temperature.models.flatMap((source) => {
    const model = PIER_CAST_GREAT_LAKES_MODELS.find((entry) =>
      entry.ofsId === source.ofsId && entry.productId === source.productId
    );
    if (!model) return [];
    const issuedAt = new Date(source.issuedAt);
    const validAtMs = Date.parse(validAt);
    const rawLeadHours = (validAtMs - issuedAt.getTime()) / 3_600_000;
    const forecastHour = Math.round(rawLeadHours);
    if (
      !Number.isFinite(issuedAt.getTime()) ||
      !Number.isFinite(validAtMs) ||
      forecastHour < 0 ||
      forecastHour > model.forecastHorizonHours ||
      Math.abs(rawLeadHours - forecastHour) >= 1e-6
    ) {
      return [];
    }
    const datasetUrl = buildPierCastOfsDatasetUrl(
      model,
      issuedAt,
      forecastHour,
      "wms",
    );
    const parameters = [
      "service=WMS",
      "version=1.1.1",
      "request=GetMap",
      "layers=temp",
      "styles=default-scalar/x-Sst",
      "format=image/png",
      "transparent=true",
      "srs=EPSG:3857",
      "bbox={bbox-epsg-3857}",
      "width=256",
      "height=256",
      "elevation=0",
      `colorscalerange=${fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MIN_F)},${
        fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MAX_F)
      }`,
      "numcolorbands=250",
      "belowmincolor=extend",
      "abovemaxcolor=extend",
    ];
    return [
      {
        ofsId: source.ofsId,
        lakeIds: source.lakeIds,
        forecastHour,
        validAt,
        tileUrl: `${datasetUrl}?${parameters.join("&")}`,
      } satisfies PierCastGreatLakesTemperatureRasterFrame,
    ];
  });
}

export function pierCastMapFoundationValidTimes(
  response: PierCastMapFoundationResponse | null,
): string[] {
  if (!response || response.timeline.frameCount !== 121) return [];
  return response.timeline.validTimes.length === 121
    ? [...response.timeline.validTimes]
    : [];
}

export function pierCastSynchronizedConditionsMapValidTimes(
  foundation: PierCastMapFoundationResponse | null,
  conditions: PierCastConditionsMapResponseV4 | null,
): string[] {
  const foundationTimes = pierCastMapFoundationValidTimes(foundation);
  if (!conditions || conditions.cities.length === 0) return foundationTimes;
  const cityTimes = conditions.cities.map((city) =>
    new Set(city.temperatureTimeline.map((point) => point.validAt))
  );
  return foundationTimes.filter((validAt) =>
    cityTimes.every((times) => times.has(validAt))
  );
}

export function pierCastForecastMapValidTimes(
  synchronizedValidTimes: readonly string[],
  nowValidAt: string | null,
): string[] {
  if (!nowValidAt) return [];
  const nowMs = Date.parse(nowValidAt);
  if (!Number.isFinite(nowMs)) return [];
  return synchronizedValidTimes.filter((validAt) => {
    const validAtMs = Date.parse(validAt);
    return Number.isFinite(validAtMs) && validAtMs >= nowMs;
  });
}

/** Static depth rasters and contours, sourced from each synchronized NOAA model grid. */
export function buildPierCastBathymetryRasterFrames(
  response: Pick<PierCastMapFoundationResponse, "temperature" | "bathymetry">,
): PierCastBathymetryRasterFrame[] {
  const issuedAt = new Date(response.temperature.cycleIssuedAt);
  if (!Number.isFinite(issuedAt.getTime())) return [];
  return PIER_CAST_GREAT_LAKES_MODELS.flatMap((model) => {
    const sources = response.bathymetry.sources.filter((source) =>
      source.renderModelId === model.ofsId
    );
    if (sources.length === 0) return [];
    const depthMaximumM = Math.max(
      ...sources.map((source) => source.renderDepthRangeM[1]),
    );
    const source = sources[0]!;
    const datasetUrl = buildPierCastOfsDatasetUrl(model, issuedAt, 0, "wms");
    const common = [
      "service=WMS",
      "version=1.1.1",
      "request=GetMap",
      `layers=${source.renderLayer}`,
      "format=image/png",
      "transparent=true",
      "srs=EPSG:3857",
      "bbox={bbox-epsg-3857}",
      "width=256",
      "height=256",
      `colorscalerange=0,${depthMaximumM}`,
      "numcolorbands=120",
    ];
    return [
      {
        lakeIds: sources.map((entry) => entry.lakeId),
        ofsId: source.renderModelId,
        rasterTileUrl: `${datasetUrl}?${
          [
            ...common,
            "styles=default-scalar/default",
          ].join("&")
        }`,
        contourTileUrl: `${datasetUrl}?${
          [
            ...common,
            "styles=contours",
          ].join("&")
        }`,
      } satisfies PierCastBathymetryRasterFrame,
    ];
  });
}

export function pierCastWindFrame(
  response: PierCastMapFoundationResponse | null,
  validAt: string,
) {
  if (!response?.timeline.validTimes.includes(validAt)) return [];
  const index = response.timeline.validTimes.indexOf(validAt);
  if (index < 0) return [];
  return response.wind.nodes.flatMap((node) => {
    const speedMph = node.speedMph[index];
    const directionDegrees = node.directionDegrees[index];
    const gustMph = node.gustMph[index];
    return Number.isFinite(speedMph) &&
        Number.isFinite(directionDegrees) &&
        Number.isFinite(gustMph)
      ? [{
        nodeId: node.nodeId,
        lakeId: node.lakeId,
        latitude: node.latitude,
        longitude: node.longitude,
        validAt,
        speedMph: speedMph!,
        directionDegrees: directionDegrees!,
        gustMph: gustMph!,
      }]
      : [];
  });
}

export function closestPierCastTemperatureTime(
  validTimes: readonly string[],
  target: string | number | Date,
): string | null {
  if (validTimes.length === 0) return null;
  const targetMs = target instanceof Date
    ? target.getTime()
    : typeof target === "number"
    ? target
    : Date.parse(target);
  if (!Number.isFinite(targetMs)) return validTimes[0] ?? null;
  return validTimes.reduce((closest, candidate) =>
    Math.abs(Date.parse(candidate) - targetMs) <
        Math.abs(Date.parse(closest) - targetMs)
      ? candidate
      : closest
  );
}

export function pierCastTemperatureHorizonLabel(
  validTimes: readonly string[],
): string {
  if (validTimes.length < 2) return "END";
  const first = Date.parse(validTimes[0]!);
  const last = Date.parse(validTimes.at(-1)!);
  const hours = Math.max(0, Math.round((last - first) / 3_600_000));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days === 0) return `+${hours}H`;
  return remainingHours === 0
    ? `+${days} ${days === 1 ? "DAY" : "DAYS"}`
    : `+${days}D ${remainingHours}H`;
}

export function buildPierCastTemperatureMapCities(
  cities: readonly PierCastMapCity[],
  response: PierCastTemperatureMapResponse,
  validAt: string,
): PierCastTemperatureMapCity[] {
  const temperatureByCityId = new Map(
    response.cities.map((city) => [
      city.cityId,
      city.points.find((point) => point.validAt === validAt) ?? null,
    ]),
  );
  return cities.flatMap((city) => {
    const point = temperatureByCityId.get(city.city.cityId);
    if (!point || !Number.isFinite(point.temperatureC)) return [];
    return [
      {
        ...city,
        temperatureC: point.temperatureC,
        temperatureF: celsiusToFahrenheit(point.temperatureC),
        validAt: point.validAt,
      } satisfies PierCastTemperatureMapCity,
    ];
  });
}
