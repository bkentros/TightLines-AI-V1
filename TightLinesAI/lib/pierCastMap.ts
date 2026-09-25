import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastLeaderboardResponse,
  PierCastReviewDateOutlookRead,
  PierCastTemperatureMapResponse,
} from "./pierCastContracts";
import {
  PIER_CAST_WATER_SCALE_MAX_F,
  PIER_CAST_WATER_SCALE_MIN_F,
} from "./pierCastTemperatureScale";

export type PierCastMapStateCode = PierCastCatalogCityRead["stateCode"];
export type PierCastMapFilter = "ALL" | PierCastMapStateCode;
export type PierCastMapMode = "score" | "temperature";
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

export type PierCastTemperatureRasterFrame = {
  forecastHour: number;
  validAt: string;
  tileUrl: string;
};

const LMHOFS_WMS_ROOT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/wms/NOAA/LMHOFS/MODELS";
const LMHOFS_MAX_FORECAST_HOUR = 120;

export const PIER_CAST_ACTIVE_MAP_BOUNDS: PierCastMapBounds = [
  -88.45,
  41.35,
  -82.05,
  45.82,
];

export const PIER_CAST_GREAT_LAKES_BOUNDS: PierCastMapBounds = [
  -93.15,
  39.75,
  -74.25,
  49.25,
];

export const PIER_CAST_STATE_MAP_BOUNDS: Record<
  PierCastMapStateCode,
  PierCastMapBounds
> = {
  MI: [-87.05, 41.55, -82.05, 45.85],
  WI: [-88.2, 42.45, -87.25, 45.2],
  IL: [-88.12, 41.65, -87.28, 42.82],
  IN: [-87.18, 41.55, -86.45, 42.15],
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
      return [{
        city,
        latitude: point.latitude,
        longitude: point.longitude,
        date,
        score: displayScore(date),
        rankingScore: rankingScore(date),
        rank: null,
      } satisfies PierCastMapCity];
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

export function pierCastMapBoundsForFilter(
  filter: PierCastMapFilter,
): PierCastMapBounds {
  return filter === "ALL"
    ? PIER_CAST_ACTIVE_MAP_BOUNDS
    : PIER_CAST_STATE_MAP_BOUNDS[filter];
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
  const datasetUrl =
    `${LMHOFS_WMS_ROOT}/${year}/${month}/${day}/` +
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
    `colorscalerange=${fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MIN_F)},${fahrenheitToCelsius(PIER_CAST_WATER_SCALE_MAX_F)}`,
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
    return [{
      ...city,
      temperatureC: point.temperatureC,
      temperatureF: celsiusToFahrenheit(point.temperatureC),
      validAt: point.validAt,
    } satisfies PierCastTemperatureMapCity];
  });
}
