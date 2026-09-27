export type PierCastGreatLakeId =
  | "superior"
  | "michigan"
  | "huron"
  | "erie"
  | "ontario";

export type PierCastGreatLakesOfsId =
  | "LSOFS"
  | "LMHOFS"
  | "LEOFS"
  | "LOOFS";

export type PierCastMapRegionCode =
  | "MI"
  | "WI"
  | "IL"
  | "IN"
  | "MN"
  | "OH"
  | "PA"
  | "NY"
  | "ON";

export type PierCastBathymetryCoverage =
  | "complete_grid_and_contours"
  | "incomplete_grid_only";

export type PierCastGreatLakesModel = {
  ofsId: PierCastGreatLakesOfsId;
  productId:
    | "NOAA_NOS_LSOFS_REGULARGRID"
    | "NOAA_NOS_LMHOFS_REGULARGRID"
    | "NOAA_NOS_LEOFS_REGULARGRID"
    | "NOAA_NOS_LOOFS_REGULARGRID";
  lakeIds: readonly PierCastGreatLakeId[];
  filePrefix: "lsofs" | "lmhofs" | "leofs" | "loofs";
  threddsRoot: string;
  cyclesUtc: readonly [0, 6, 12, 18];
  forecastHorizonHours: 120;
  temporalResolutionHours: 1;
};

export type PierCastGreatLake = {
  lakeId: PierCastGreatLakeId;
  displayName: string;
  modelId: PierCastGreatLakesOfsId;
  bounds: readonly [west: number, south: number, east: number, north: number];
  bathymetry: {
    provider: "NOAA NCEI";
    renderProvider: "NOAA NOS OFS";
    renderModelId: PierCastGreatLakesOfsId;
    renderLayer: "h";
    renderDepthRangeM: readonly [0, number];
    coverage: PierCastBathymetryCoverage;
    gridUrl: string;
    contourUrl: string | null;
    gridResolutionM: number | null;
    contourIntervalM: number | null;
    verticalUnit: "m";
    verticalDatum: "lake_low_water_datum";
    navigationUse: false;
    limitation: string;
  };
};

const NOAA_THREDDS_ROOT = "https://opendap.co-ops.nos.noaa.gov/thredds";

export const PIER_CAST_MAP_FORECAST_HOURS = Object.freeze(
  Array.from({ length: 121 }, (_, hour) => hour),
);

export const PIER_CAST_GREAT_LAKES_MODELS = Object.freeze(
  [
    {
      ofsId: "LSOFS",
      productId: "NOAA_NOS_LSOFS_REGULARGRID",
      lakeIds: ["superior"],
      filePrefix: "lsofs",
      threddsRoot: `${NOAA_THREDDS_ROOT}/dodsC/NOAA/LSOFS/MODELS`,
      cyclesUtc: [0, 6, 12, 18],
      forecastHorizonHours: 120,
      temporalResolutionHours: 1,
    },
    {
      ofsId: "LMHOFS",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      lakeIds: ["michigan", "huron"],
      filePrefix: "lmhofs",
      threddsRoot: `${NOAA_THREDDS_ROOT}/dodsC/NOAA/LMHOFS/MODELS`,
      cyclesUtc: [0, 6, 12, 18],
      forecastHorizonHours: 120,
      temporalResolutionHours: 1,
    },
    {
      ofsId: "LEOFS",
      productId: "NOAA_NOS_LEOFS_REGULARGRID",
      lakeIds: ["erie"],
      filePrefix: "leofs",
      threddsRoot: `${NOAA_THREDDS_ROOT}/dodsC/NOAA/LEOFS/MODELS`,
      cyclesUtc: [0, 6, 12, 18],
      forecastHorizonHours: 120,
      temporalResolutionHours: 1,
    },
    {
      ofsId: "LOOFS",
      productId: "NOAA_NOS_LOOFS_REGULARGRID",
      lakeIds: ["ontario"],
      filePrefix: "loofs",
      threddsRoot: `${NOAA_THREDDS_ROOT}/dodsC/NOAA/LOOFS/MODELS`,
      cyclesUtc: [0, 6, 12, 18],
      forecastHorizonHours: 120,
      temporalResolutionHours: 1,
    },
  ] as const satisfies readonly PierCastGreatLakesModel[],
);

export const PIER_CAST_GREAT_LAKES = Object.freeze(
  [
    {
      lakeId: "superior",
      displayName: "Lake Superior",
      modelId: "LSOFS",
      bounds: [-92.3, 46.35, -84.25, 49.1],
      bathymetry: {
        provider: "NOAA NCEI",
        renderProvider: "NOAA NOS OFS",
        renderModelId: "LSOFS",
        renderLayer: "h",
        renderDepthRangeM: [0, 406],
        coverage: "incomplete_grid_only",
        gridUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/superior/data/geotiff/superior_lld.geotiff.tar.gz",
        contourUrl: null,
        gridResolutionM: 90,
        contourIntervalM: null,
        verticalUnit: "m",
        verticalDatum: "lake_low_water_datum",
        navigationUse: false,
        limitation:
          "NOAA identifies Lake Superior contours as incomplete; the available 3 arc-second grid is suitable for regional fishing context, not navigation.",
      },
    },
    {
      lakeId: "michigan",
      displayName: "Lake Michigan",
      modelId: "LMHOFS",
      bounds: [-88.2, 41.55, -84.7, 46.15],
      bathymetry: {
        provider: "NOAA NCEI",
        renderProvider: "NOAA NOS OFS",
        renderModelId: "LMHOFS",
        renderLayer: "h",
        renderDepthRangeM: [0, 281],
        coverage: "complete_grid_and_contours",
        gridUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/michigan/data/geotiff/michigan_lld.geotiff.tar.gz",
        contourUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/michigan/data/shapefiles/Lake_Michigan_Contours.zip",
        gridResolutionM: null,
        contourIntervalM: 5,
        verticalUnit: "m",
        verticalDatum: "lake_low_water_datum",
        navigationUse: false,
        limitation:
          "Historic compiled soundings and five-metre contours provide regional depth context; they are not a substitute for current nautical charts.",
      },
    },
    {
      lakeId: "huron",
      displayName: "Lake Huron",
      modelId: "LMHOFS",
      bounds: [-84.85, 43.0, -79.7, 46.4],
      bathymetry: {
        provider: "NOAA NCEI",
        renderProvider: "NOAA NOS OFS",
        renderModelId: "LMHOFS",
        renderLayer: "h",
        renderDepthRangeM: [0, 229],
        coverage: "complete_grid_and_contours",
        gridUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/huron/data/geotiff/huron_lld.geotiff.tar.gz",
        contourUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/huron/data/shapefiles/Lake_Huron_Contours.zip",
        gridResolutionM: null,
        contourIntervalM: null,
        verticalUnit: "m",
        verticalDatum: "lake_low_water_datum",
        navigationUse: false,
        limitation:
          "Compiled lake-floor topography provides regional fishing context and must not be used for navigation.",
      },
    },
    {
      lakeId: "erie",
      displayName: "Lake Erie",
      modelId: "LEOFS",
      bounds: [-83.55, 41.25, -78.75, 42.95],
      bathymetry: {
        provider: "NOAA NCEI",
        renderProvider: "NOAA NOS OFS",
        renderModelId: "LEOFS",
        renderLayer: "h",
        renderDepthRangeM: [0, 64],
        coverage: "complete_grid_and_contours",
        gridUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/erie/data/geotiff/erie_lld.geotiff.tar.gz",
        contourUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/erie/data/shapefiles/Lake_Erie_Contours.zip",
        gridResolutionM: null,
        contourIntervalM: null,
        verticalUnit: "m",
        verticalDatum: "lake_low_water_datum",
        navigationUse: false,
        limitation:
          "Historic compiled soundings are denser near shore but remain a regional context layer, not a navigation product.",
      },
    },
    {
      lakeId: "ontario",
      displayName: "Lake Ontario",
      modelId: "LOOFS",
      bounds: [-79.95, 43.05, -76.0, 44.35],
      bathymetry: {
        provider: "NOAA NCEI",
        renderProvider: "NOAA NOS OFS",
        renderModelId: "LOOFS",
        renderLayer: "h",
        renderDepthRangeM: [0, 244],
        coverage: "complete_grid_and_contours",
        gridUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/ontario/data/geotiff/ontario_lld.geotiff.tar.gz",
        contourUrl:
          "https://www.ngdc.noaa.gov/mgg/greatlakes/ontario/data/shapefiles/Lake_Ontario_Contours.zip",
        gridResolutionM: null,
        contourIntervalM: null,
        verticalUnit: "m",
        verticalDatum: "lake_low_water_datum",
        navigationUse: false,
        limitation:
          "Compiled historic and multibeam bathymetry provides fishing context and must not be used for navigation.",
      },
    },
  ] as const satisfies readonly PierCastGreatLake[],
);

export const PIER_CAST_MAP_REGIONS = Object.freeze(
  [
    { code: "MI", displayName: "Michigan" },
    { code: "WI", displayName: "Wisconsin" },
    { code: "IL", displayName: "Illinois" },
    { code: "IN", displayName: "Indiana" },
    { code: "MN", displayName: "Minnesota" },
    { code: "OH", displayName: "Ohio" },
    { code: "PA", displayName: "Pennsylvania" },
    { code: "NY", displayName: "New York" },
    { code: "ON", displayName: "Ontario" },
  ] as const satisfies readonly {
    code: PierCastMapRegionCode;
    displayName: string;
  }[],
);

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function buildPierCastOfsDatasetUrl(
  model: PierCastGreatLakesModel,
  issuedAt: Date,
  forecastHour: number,
  service: "dodsC" | "wms" = "dodsC",
): string {
  if (
    !Number.isFinite(issuedAt.getTime()) ||
    !Number.isInteger(forecastHour) ||
    forecastHour < 0 ||
    forecastHour > model.forecastHorizonHours
  ) {
    throw new Error(
      "Great Lakes forecast hour must be an integer from 0 through 120.",
    );
  }
  const year = String(issuedAt.getUTCFullYear());
  const month = pad2(issuedAt.getUTCMonth() + 1);
  const day = pad2(issuedAt.getUTCDate());
  const cycle = pad2(issuedAt.getUTCHours());
  const dateStamp = `${year}${month}${day}`;
  const hour = String(forecastHour).padStart(3, "0");
  const serviceRoot = service === "dodsC"
    ? model.threddsRoot
    : model.threddsRoot.replace("/dodsC/", "/wms/");
  return `${serviceRoot}/${year}/${month}/${day}/${model.filePrefix}.t${cycle}z.${dateStamp}.regulargrid.f${hour}.nc`;
}

export function listPierCastCommonCycleCandidates(
  now: Date,
  lookbackHours = 18,
): Date[] {
  if (!Number.isFinite(now.getTime()) || lookbackHours < 0) return [];
  const latest = new Date(now);
  latest.setUTCMinutes(0, 0, 0);
  latest.setUTCHours(Math.floor(latest.getUTCHours() / 6) * 6);
  const candidates: Date[] = [];
  for (let offset = 0; offset <= lookbackHours; offset += 6) {
    candidates.push(new Date(latest.getTime() - offset * 3_600_000));
  }
  return candidates;
}

export function buildPierCastHourlyTimeline(
  startsAt: string | Date,
  hours = 120,
): string[] {
  const start = startsAt instanceof Date ? startsAt : new Date(startsAt);
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isInteger(hours) ||
    hours < 0 ||
    hours > 120
  ) {
    throw new Error(
      "PierCast map timeline requires a valid start and 0-120 hours.",
    );
  }
  return Array.from(
    { length: hours + 1 },
    (_, hour) => new Date(start.getTime() + hour * 3_600_000).toISOString(),
  );
}
