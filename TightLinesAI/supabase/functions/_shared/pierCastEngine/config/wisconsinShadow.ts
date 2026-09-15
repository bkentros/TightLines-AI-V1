import type {
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastCityTemperatureSource,
  PierCastSeasonalOpportunityCurve,
  PierCastSpeciesId,
  PierCastTemperatureCurve,
} from "../types.ts";
import { PIER_CAST_CORE_TEMPERATURE_CURVES } from "./coreCalibration.ts";
import { PIER_CAST_PORT_WASHINGTON_PROFILE } from "./portWashingtonShadow.ts";

export const PIER_CAST_WISCONSIN_SCOPE_VERSION = "piercast-wisconsin-shadow-v1";
export const PIER_CAST_WISCONSIN_ROSTER_VERSION =
  "piercast-wisconsin-core-four-v1";
export const PIER_CAST_WISCONSIN_SEASONAL_VERSION =
  "piercast-wisconsin-seasonal-v0.1.0";
export const PIER_CAST_WISCONSIN_THERMAL_VERSION =
  "piercast-core-temperature-v0.2.0";

export const PIER_CAST_WISCONSIN_CITY_IDS = [
  "port_washington_wi",
  "milwaukee_wi",
  "racine_wi",
  "kenosha_wi",
] as const;

export type PierCastWisconsinCityId =
  (typeof PIER_CAST_WISCONSIN_CITY_IDS)[number];

export const PIER_CAST_WISCONSIN_SPECIES_IDS = [
  "coho_salmon",
  "chinook_salmon",
  "steelhead",
  "brown_trout",
] as const satisfies readonly PierCastSpeciesId[];

export type PierCastWisconsinSpeciesId =
  (typeof PIER_CAST_WISCONSIN_SPECIES_IDS)[number];

/**
 * Provisional FinFindr city-harbor calibrations, not DNR scores. Temporal
 * shape comes from pooled 2022–2024 Wisconsin pier-mode harvest and effort;
 * relative city magnitude is conservatively bounded by county pier-mode
 * recurrence plus exact-city weekly reports. Winter knots are low-confidence
 * floors because the open-water creel survey does not observe those months.
 */
export const PIER_CAST_WISCONSIN_SEASONAL_CURVES = {
  milwaukee_wi: {
    coho_salmon: seasonal("milwaukee_wi", "coho_salmon", [
      ["01-15", 1.0],
      ["03-01", 1.8],
      ["03-25", 6.8],
      ["04-20", 7.4],
      ["05-20", 7.6],
      ["06-20", 3.0],
      ["07-20", 4.4],
      ["08-20", 1.8],
      ["09-07", 6.2],
      ["10-15", 4.0],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    chinook_salmon: seasonal("milwaukee_wi", "chinook_salmon", [
      ["01-15", 1.0],
      ["03-15", 1.0],
      ["05-15", 1.4],
      ["06-15", 1.8],
      ["07-15", 6.8],
      ["08-15", 7.0],
      ["09-07", 6.8],
      ["10-15", 4.0],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    steelhead: seasonal("milwaukee_wi", "steelhead", [
      ["01-15", 1.2],
      ["03-15", 3.8],
      ["04-15", 4.6],
      ["05-15", 2.0],
      ["06-15", 3.2],
      ["07-15", 4.4],
      ["08-15", 2.4],
      ["09-15", 1.6],
      ["10-15", 1.4],
      ["11-15", 1.2],
      ["12-15", 1.2],
    ]),
    brown_trout: seasonal("milwaukee_wi", "brown_trout", [
      ["01-15", 2.0],
      ["03-01", 4.8],
      ["04-01", 6.6],
      ["05-15", 5.8],
      ["06-15", 2.8],
      ["07-15", 1.3],
      ["08-15", 1.9],
      ["09-15", 1.5],
      ["10-15", 1.4],
      ["11-15", 1.4],
      ["12-15", 1.8],
    ]),
  },
  racine_wi: {
    coho_salmon: seasonal("racine_wi", "coho_salmon", [
      ["01-15", 1.0],
      ["03-01", 1.9],
      ["03-25", 7.0],
      ["04-20", 7.6],
      ["05-20", 7.4],
      ["06-20", 2.8],
      ["07-20", 4.8],
      ["08-20", 2.2],
      ["09-07", 7.3],
      ["10-15", 4.4],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    chinook_salmon: seasonal("racine_wi", "chinook_salmon", [
      ["01-15", 1.0],
      ["03-15", 1.0],
      ["05-15", 1.4],
      ["06-15", 1.7],
      ["07-15", 7.0],
      ["08-15", 7.4],
      ["09-07", 7.2],
      ["10-15", 4.4],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    steelhead: seasonal("racine_wi", "steelhead", [
      ["01-15", 1.3],
      ["03-15", 4.4],
      ["04-15", 5.3],
      ["05-15", 1.8],
      ["06-15", 2.8],
      ["07-15", 5.7],
      ["08-15", 3.4],
      ["09-15", 1.8],
      ["10-15", 1.5],
      ["11-15", 1.3],
      ["12-15", 1.2],
    ]),
    brown_trout: seasonal("racine_wi", "brown_trout", [
      ["01-15", 2.0],
      ["03-01", 4.8],
      ["04-01", 6.7],
      ["05-15", 5.5],
      ["06-15", 2.4],
      ["07-15", 1.3],
      ["08-15", 1.8],
      ["09-15", 1.5],
      ["10-15", 1.4],
      ["11-15", 1.4],
      ["12-15", 1.8],
    ]),
  },
  kenosha_wi: {
    coho_salmon: seasonal("kenosha_wi", "coho_salmon", [
      ["01-15", 1.0],
      ["03-01", 2.0],
      ["03-25", 7.4],
      ["04-20", 8.0],
      ["05-20", 7.5],
      ["06-20", 2.8],
      ["07-20", 4.5],
      ["08-20", 1.8],
      ["09-07", 6.4],
      ["10-15", 4.0],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    chinook_salmon: seasonal("kenosha_wi", "chinook_salmon", [
      ["01-15", 1.0],
      ["03-15", 1.0],
      ["05-15", 1.3],
      ["06-15", 1.6],
      ["07-15", 6.3],
      ["08-15", 6.7],
      ["09-07", 6.4],
      ["10-15", 3.8],
      ["11-15", 1.2],
      ["12-15", 1.0],
    ]),
    steelhead: seasonal("kenosha_wi", "steelhead", [
      ["01-15", 1.2],
      ["03-15", 3.7],
      ["04-15", 4.3],
      ["05-15", 1.6],
      ["06-15", 2.3],
      ["07-15", 4.2],
      ["08-15", 2.7],
      ["09-15", 1.6],
      ["10-15", 1.4],
      ["11-15", 1.2],
      ["12-15", 1.2],
    ]),
    brown_trout: seasonal("kenosha_wi", "brown_trout", [
      ["01-15", 1.8],
      ["03-01", 4.2],
      ["04-01", 5.8],
      ["05-15", 4.8],
      ["06-15", 2.1],
      ["07-15", 1.2],
      ["08-15", 1.6],
      ["09-15", 1.4],
      ["10-15", 1.3],
      ["11-15", 1.3],
      ["12-15", 1.7],
    ]),
  },
} as const satisfies Record<
  Exclude<PierCastWisconsinCityId, "port_washington_wi">,
  Record<PierCastWisconsinSpeciesId, PierCastSeasonalOpportunityCurve>
>;

function seasonal(
  cityId: Exclude<PierCastWisconsinCityId, "port_washington_wi">,
  speciesId: PierCastWisconsinSpeciesId,
  knots: readonly (readonly [string, number])[],
): PierCastSeasonalOpportunityCurve {
  return {
    curveId: `${cityId}__${speciesId}__seasonal_v0_1`,
    calibrationStatus: "provisional",
    knots: knots.map(([monthDay, rating]) => ({ monthDay, rating })),
  };
}

const ENDPOINT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc";

const source = (
  cityId: Exclude<PierCastWisconsinCityId, "port_washington_wi">,
  location: NonNullable<PierCastCityTemperatureSource["configuredLocation"]>,
  validationObservation: PierCastCityTemperatureSource["validationObservation"],
  limitation: string,
): PierCastCityTemperatureSource => ({
  sourceId: `${cityId}__lmhofs_nearshore_surface__v0_1`,
  productId: "NOAA_NOS_LMHOFS_REGULARGRID",
  displayName: "NOAA LMHOFS nearshore surface temperature (candidate)",
  kind: "model",
  canonicalUnit: "C",
  calibrationStatus: "provisional",
  endpoint: ENDPOINT,
  variable: "temp",
  configuredLocation: location,
  issueCyclesUtc: [0, 6, 12, 18],
  forecastHorizonHours: 120,
  freshnessLimitHours: 13,
  fallbackPolicy: "unavailable",
  validationObservation,
  limitation,
});

const evidence = (
  evidenceId: string,
  authority: string,
  title: string,
  url: string,
) => ({ evidenceId, authority, title, url, reviewedAt: "2026-09-14" });

const dnrAccess = (city: string) =>
  evidence(
    `wi_dnr_${city}_lake_michigan_access_2026_09_14`,
    "Wisconsin Department of Natural Resources",
    "Lake Michigan fishing access",
    "https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan",
  );

const dnrSpecies = (city: string) =>
  evidence(
    `wi_dnr_${city}_close_to_home_species_2026_09_14`,
    "Wisconsin Department of Natural Resources",
    "Close to Home fishing opportunities",
    "https://dnr.wisconsin.gov/sites/default/files/topic/ClosetoHomeFishing.pdf",
  );

const citySpecies = (
  cityId: Exclude<PierCastWisconsinCityId, "port_washington_wi">,
  speciesId: PierCastWisconsinSpeciesId,
): PierCastCitySpeciesProfile => ({
  speciesId,
  inheritance: "candidate",
  seasonalOpportunityCurve:
    PIER_CAST_WISCONSIN_SEASONAL_CURVES[cityId][speciesId],
  ratingEnabled: false,
  limitation:
    "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
});

const researchSpecies = (
  speciesId: Exclude<PierCastSpeciesId, PierCastWisconsinSpeciesId>,
  inheritance: PierCastCitySpeciesProfile["inheritance"],
  limitation: string,
): PierCastCitySpeciesProfile => ({
  speciesId,
  inheritance,
  seasonalOpportunityCurve: null,
  ratingEnabled: false,
  limitation,
});

const remaining = (
  perch: "conditional" | "unresolved",
): PierCastCitySpeciesProfile[] => [
  researchSpecies(
    "yellow_perch",
    perch,
    perch === "conditional"
      ? "Exact DNR pier/shore reports establish a summer fishery lead, but local multi-year monthly evidence is insufficient for a defensible year-round rating curve."
      : "No exact recurring city-pier seasonal evidence supports a year-round rating curve.",
  ),
  researchSpecies(
    "lake_trout",
    "historical_lead",
    "Regional and boat occurrence does not establish repeatable city-pier opportunity.",
  ),
  researchSpecies("walleye", "unresolved", "No city-pier seasonal admission."),
  researchSpecies(
    "smallmouth_bass",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "freshwater_drum",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "lake_whitefish",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "round_whitefish",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "channel_catfish",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "largemouth_bass",
    "unresolved",
    "No city-pier seasonal admission.",
  ),
  researchSpecies(
    "atlantic_salmon",
    "unresolved",
    "Explicit Lake Huron schema review found no evidence supporting a roster change for this existing Wisconsin city.",
  ),
  researchSpecies(
    "northern_pike",
    "unresolved",
    "Explicit Lake Huron schema review found no evidence supporting a roster change for this existing Wisconsin city.",
  ),
];

export const PIER_CAST_MILWAUKEE_PROFILE: PierCastCityProfile = {
  cityId: "milwaukee_wi",
  displayName: "Milwaukee",
  stateCode: "WI",
  timezone: "America/Chicago",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "milwaukee_wi",
    {
      latitude: 43.03,
      longitude: -87.88,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 143,
      gridColumn: 18,
      modelBathymetryM: 10.608443700734247,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "milwaukee_breakwater_light",
        displayName: "Milwaukee Breakwater Light",
        latitude: 43.0269444444,
        longitude: -87.8819444444,
        distanceM: 375,
        coordinateSource: "NOAA Coast Pilot 6",
      },
      gridCellStatus: "candidate",
    },
    {
      provider: "GLOS Seagull ERDDAP",
      datasetId: "obs_194",
      seasonal: true,
      availabilityStatus: "active_seasonal",
      temperatureVariable: "Temp1",
      aggregateQualityVariable: "Temp1_aggregate_test",
      reportedUnit: "K",
      nominalDepthM: null,
    },
    "One lakeward surface cell supplies a general Milwaukee harbor reading. It is not a McKinley or Cupertino thermometer and cannot resolve breakwall/lagoon mixing, depth, plume, waves, ice, or access. The seasonal Discovery World Panther buoy is a validation comparator, not a score input.",
  ),
  structures: [
    {
      structureId: "milwaukee_mckinley_pier",
      displayName: "McKinley Pier",
      municipality: "Milwaukee",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "McKinley Marina public access",
        streetAddress: "1750 N Lincoln Memorial Dr, Milwaukee, WI 53202",
        latitude: 43.053592609548,
        longitude: -87.884066827713,
        coordinateSource: "U.S. Census Geocoder address match",
      },
      accessEvidence: [dnrAccess("milwaukee"), dnrSpecies("milwaukee")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies public pier fishing access through McKinley Marina. Marina docks, finger piers, ramps, and signed restricted areas are not included; current on-site rules, closures, parking, waves, and ice control.",
    },
    {
      structureId: "milwaukee_cupertino_pier",
      displayName: "Cupertino Pier",
      municipality: "Milwaukee",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "Cupertino Park / Russell Avenue",
        streetAddress:
          "S Lincoln Memorial Dr & E Russell Ave, Milwaukee, WI 53207",
        latitude: 43.005901136576,
        longitude: -87.89147250902,
        coordinateSource:
          "U.S. Census Geocoder match for 1200 S Lincoln Memorial Dr",
      },
      accessEvidence: [dnrAccess("milwaukee"), dnrSpecies("milwaukee")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies Cupertino Pier at Cupertino Park. The city reading is not point-specific; current signs, temporary closures, waves, ice, and weather control.",
    },
  ],
  species: [
    ...PIER_CAST_WISCONSIN_SPECIES_IDS.map((id) =>
      citySpecies("milwaukee_wi", id)
    ),
    ...remaining("unresolved"),
  ],
};

export const PIER_CAST_RACINE_PROFILE: PierCastCityProfile = {
  cityId: "racine_wi",
  displayName: "Racine",
  stateCode: "WI",
  timezone: "America/Chicago",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "racine_wi",
    {
      latitude: 42.73,
      longitude: -87.77,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 113,
      gridColumn: 29,
      modelBathymetryM: 5.330829941698761,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "racine_east_harbor_entrance_light_2",
        displayName: "Racine East Harbor Entrance Light 2",
        latitude: 42.7336111111,
        longitude: -87.7705555556,
        distanceM: 404,
        coordinateSource: "NOAA Aids to Navigation",
      },
      gridCellStatus: "candidate",
    },
    null,
    "One lakeward surface cell supplies a general Racine harbor reading. It is not a North or South Pier thermometer and cannot resolve Root River/harbor mixing, depth, waves, ice, or access. No suitably pier-local active GLOS series was found.",
  ),
  structures: [
    {
      structureId: "racine_north_pier",
      displayName: "North Pier",
      municipality: "Racine",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "North Beach Park",
        streetAddress: "1501 Michigan Blvd, Racine, WI 53402",
        latitude: 42.73942080766,
        longitude: -87.782699295339,
        coordinateSource: "U.S. Census Geocoder address match",
      },
      accessEvidence: [dnrAccess("racine"), dnrSpecies("racine")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies North Pier access through North Beach Park. Current on-site signs, closures, waves, ice, and weather control.",
    },
    {
      structureId: "racine_south_pier",
      displayName: "South Pier",
      municipality: "Racine",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "Racine harbor / Christopher Columbus Causeway",
        streetAddress: "2 Christopher Columbus Causeway, Racine, WI 53403",
        latitude: 42.729582059433,
        longitude: -87.781608345236,
        coordinateSource: "U.S. Census Geocoder address match",
      },
      accessEvidence: [dnrAccess("racine"), dnrSpecies("racine")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies South Pier fishing access from the harbor/causeway. Marina tenant docks are outside scope; current signs, closures, waves, ice, and weather control.",
    },
  ],
  species: [
    ...PIER_CAST_WISCONSIN_SPECIES_IDS.map((id) =>
      citySpecies("racine_wi", id)
    ),
    ...remaining("conditional"),
  ],
};

export const PIER_CAST_KENOSHA_PROFILE: PierCastCityProfile = {
  cityId: "kenosha_wi",
  displayName: "Kenosha",
  stateCode: "WI",
  timezone: "America/Chicago",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "kenosha_wi",
    {
      latitude: 42.59,
      longitude: -87.80,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 99,
      gridColumn: 26,
      modelBathymetryM: 6.414282373473611,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "kenosha_light",
        displayName: "Kenosha Light",
        latitude: 42.5888888889,
        longitude: -87.8086111111,
        distanceM: 716,
        coordinateSource: "NOAA Coast Pilot 6",
      },
      gridCellStatus: "candidate",
    },
    null,
    "One lakeward surface cell supplies a general Kenosha harbor reading. It is not a North or South Pier thermometer and cannot resolve harbor mixing, depth, waves, ice, or access. No pier-local active GLOS validation series was found.",
  ),
  structures: [
    {
      structureId: "kenosha_north_pier",
      displayName: "North Pier / Simmons Island",
      municipality: "Kenosha",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "Simmons Island Park",
        streetAddress: "5001 Simmons Island Rd, Kenosha, WI 53140",
        latitude: 42.590994336165,
        longitude: -87.816225895478,
        coordinateSource:
          "Approximate land-side entry using U.S. Census Geocoder match at 5000 4th Ave",
      },
      accessEvidence: [dnrAccess("kenosha"), dnrSpecies("kenosha")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies North Pier near Simmons Island Park. Marina docks are outside scope; current signs, closures, waves, ice, and weather control.",
    },
    {
      structureId: "kenosha_south_pier",
      displayName: "South Pier",
      municipality: "Kenosha",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "57th Street lakefront access",
        streetAddress: "5700 4th Ave, Kenosha, WI 53140",
        latitude: 42.584405696648,
        longitude: -87.8161259955,
        coordinateSource: "U.S. Census Geocoder address match",
      },
      accessEvidence: [dnrAccess("kenosha"), dnrSpecies("kenosha")],
      liveAccessStatus: "not_live_checked",
      limitation:
        "DNR identifies South Pier access and parking off 57th Street. Current signs, closures, waves, ice, and weather control.",
    },
  ],
  species: [
    ...PIER_CAST_WISCONSIN_SPECIES_IDS.map((id) =>
      citySpecies("kenosha_wi", id)
    ),
    ...remaining("conditional"),
  ],
};

export const PIER_CAST_WISCONSIN_CITY_PROFILES = [
  PIER_CAST_PORT_WASHINGTON_PROFILE,
  PIER_CAST_MILWAUKEE_PROFILE,
  PIER_CAST_RACINE_PROFILE,
  PIER_CAST_KENOSHA_PROFILE,
] as const satisfies readonly PierCastCityProfile[];

export function getPierCastWisconsinTemperatureCurve(
  speciesId: PierCastSpeciesId,
): PierCastTemperatureCurve | null {
  return PIER_CAST_WISCONSIN_SPECIES_IDS.includes(
      speciesId as PierCastWisconsinSpeciesId,
    )
    ? PIER_CAST_CORE_TEMPERATURE_CURVES[speciesId as PierCastWisconsinSpeciesId]
    : null;
}

export function getPierCastWisconsinAdmission(
  cityId: PierCastWisconsinCityId,
  speciesId: PierCastSpeciesId,
): {
  methodConstraint: string;
  structureId: string;
  regulationValidThrough: string;
} | undefined {
  if (
    !PIER_CAST_WISCONSIN_CITY_IDS.includes(cityId) ||
    !PIER_CAST_WISCONSIN_SPECIES_IDS.includes(
      speciesId as PierCastWisconsinSpeciesId,
    )
  ) return undefined;
  return {
    methodConstraint:
      "General Wisconsin Lake Michigan hook-and-line regulations; verify current species, season, size, bag, license, and Great Lakes stamp rules before fishing.",
    structureId: `${cityId.replace(/_wi$/, "")}_city_harbor`,
    regulationValidThrough: "2027-03-31",
  };
}
