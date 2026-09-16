import type {
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastCityTemperatureSource,
  PierCastSeasonalOpportunityCurve,
  PierCastSpeciesId,
  PierCastTemperatureCurve,
} from "../types.ts";
import { PIER_CAST_CORE_TEMPERATURE_CURVES } from "./coreCalibration.ts";
import { applyPierCastSpeciesExpansionDispositions } from "./speciesExpansion.ts";

export const PIER_CAST_PORT_WASHINGTON_SCOPE_VERSION =
  "piercast-port-washington-shadow-v1";
export const PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION =
  "piercast-port-washington-core-four-v1";
export const PIER_CAST_PORT_WASHINGTON_SEASONAL_VERSION =
  "piercast-port-washington-seasonal-v0.1.0";
export const PIER_CAST_PORT_WASHINGTON_THERMAL_VERSION =
  "piercast-core-temperature-v0.2.0";

export const PIER_CAST_PORT_WASHINGTON_SPECIES_IDS = [
  "coho_salmon",
  "chinook_salmon",
  "steelhead",
  "brown_trout",
] as const satisfies readonly PierCastSpeciesId[];

export type PierCastPortWashingtonSpeciesId =
  (typeof PIER_CAST_PORT_WASHINGTON_SPECIES_IDS)[number];

/**
 * FinFindr's provisional city-level temporal calibration. The shape combines
 * Wisconsin DNR statewide pier-mode monthly harvest/effort (2022–2024),
 * Ozaukee County pier-mode annual harvest, and current Port Washington
 * pier/shore reports. It is not a DNR-issued score or a structure forecast.
 */
export const PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES = {
  coho_salmon: curve("coho_salmon", [
    ["01-15", 1.0],
    ["03-01", 2.0],
    ["03-25", 7.4],
    ["04-20", 7.8],
    ["05-20", 6.8],
    ["06-20", 2.2],
    ["07-20", 4.2],
    ["08-20", 1.5],
    ["09-07", 6.8],
    ["10-15", 4.2],
    ["11-15", 1.2],
    ["12-15", 1.0],
  ]),
  chinook_salmon: curve("chinook_salmon", [
    ["01-15", 1.0],
    ["03-15", 1.0],
    ["05-15", 1.4],
    ["06-15", 1.2],
    ["07-15", 6.5],
    ["08-15", 7.2],
    ["09-07", 7.0],
    ["10-15", 4.2],
    ["11-15", 1.2],
    ["12-15", 1.0],
  ]),
  steelhead: curve("steelhead", [
    ["01-15", 1.3],
    ["03-15", 4.2],
    ["04-15", 5.2],
    ["05-15", 1.4],
    ["06-15", 2.3],
    ["07-15", 5.0],
    ["08-15", 2.5],
    ["09-15", 1.6],
    ["10-15", 1.4],
    ["11-15", 1.2],
    ["12-15", 1.2],
  ]),
  brown_trout: curve("brown_trout", [
    ["01-15", 2.0],
    ["03-01", 5.0],
    ["04-01", 7.0],
    ["05-15", 5.4],
    ["06-15", 2.3],
    ["07-15", 1.2],
    ["08-15", 2.0],
    ["09-15", 1.4],
    ["10-15", 1.3],
    ["11-15", 1.3],
    ["12-15", 1.8],
  ]),
} as const satisfies Record<
  PierCastPortWashingtonSpeciesId,
  PierCastSeasonalOpportunityCurve
>;

function curve(
  speciesId: PierCastPortWashingtonSpeciesId,
  knots: readonly (readonly [string, number])[],
): PierCastSeasonalOpportunityCurve {
  return {
    curveId: `port_washington_wi__${speciesId}__seasonal_v0_1`,
    calibrationStatus: "provisional",
    knots: knots.map(([monthDay, rating]) => ({ monthDay, rating })),
  };
}

export const PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION = {
  latitude: 43.39,
  longitude: -87.85,
  verticalSelection: "surface",
  depthIndex: 0,
  gridRow: 179,
  gridColumn: 21,
  modelBathymetryM: 11.358911302807531,
  selectionMethod: "nearest_wet_lakeward_regular_grid_center",
  referencePoint: {
    referenceId: "port_washington_breakwater_light",
    displayName: "Port Washington Breakwater Light",
    latitude: 43.3852777778,
    longitude: -87.8597222222,
    distanceM: 945,
    coordinateSource: "NOAA Coast Pilot 6",
  },
  gridCellStatus: "candidate",
} as const;

export const PIER_CAST_PORT_WASHINGTON_TEMPERATURE_SOURCE = {
  sourceId: "port_washington_wi__lmhofs_nearshore_surface__v0_1",
  productId: "NOAA_NOS_LMHOFS_REGULARGRID",
  displayName: "NOAA LMHOFS nearshore surface temperature (candidate)",
  kind: "model",
  canonicalUnit: "C",
  calibrationStatus: "provisional",
  endpoint:
    "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
  variable: "temp",
  configuredLocation: PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION,
  issueCyclesUtc: [0, 6, 12, 18],
  forecastHorizonHours: 120,
  freshnessLimitHours: 13,
  fallbackPolicy: "unavailable",
  validationObservation: null,
  limitation:
    "This is one lakeward LMHOFS surface cell for a general Port Washington harbor reading. It is not a thermometer at either access area and cannot resolve harbor mixing, shoreline, depth, plume, wave, ice, or temporary access conditions. No pier-local GLOS validation series was found; representation remains blocked pending prospective comparison.",
} as const satisfies PierCastCityTemperatureSource;

const speciesProfile = (
  speciesId: PierCastSpeciesId,
  inheritance: PierCastCitySpeciesProfile["inheritance"],
  seasonalOpportunityCurve: PierCastSeasonalOpportunityCurve | null,
  limitation: string | null,
): PierCastCitySpeciesProfile => ({
  speciesId,
  inheritance,
  seasonalOpportunityCurve,
  ratingEnabled: false,
  limitation,
});

const core = (speciesId: PierCastPortWashingtonSpeciesId) =>
  speciesProfile(
    speciesId,
    "candidate",
    PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES[speciesId],
    "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
  );

export const PIER_CAST_PORT_WASHINGTON_PROFILE: PierCastCityProfile = {
  cityId: "port_washington_wi",
  displayName: "Port Washington",
  stateCode: "WI",
  timezone: "America/Chicago",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: PIER_CAST_PORT_WASHINGTON_TEMPERATURE_SOURCE,
  structures: [
    {
      structureId: "port_washington_harbor_breakwalls_north_pier",
      displayName: "Harbor Breakwalls / North Pier",
      municipality: "Port Washington",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "Fisherman's Park",
        streetAddress: "138 S Wisconsin St, Port Washington, WI 53074",
        latitude: 43.386926091242,
        longitude: -87.870784411123,
        coordinateSource: "U.S. Census Geocoder address match",
      },
      accessEvidence: [
        {
          evidenceId: "wi_dnr_port_washington_harbor_access_2026_09_14",
          authority: "Wisconsin Department of Natural Resources",
          title: "Lake Michigan fishing access",
          url:
            "https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan",
          reviewedAt: "2026-09-14",
        },
        {
          evidenceId: "wi_dnr_port_washington_breakwalls_2026_09_14",
          authority: "Wisconsin Department of Natural Resources",
          title: "Close to Home fishing opportunities",
          url:
            "https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf",
          reviewedAt: "2026-09-14",
        },
      ],
      liveAccessStatus: "not_live_checked",
      limitation:
        "Published sources establish general pier/breakwall fishing access through the harbor area. On-site signs, park hours, construction, temporary closures, waves, ice, and weather always control.",
    },
    {
      structureId: "port_washington_coal_dock_promenade",
      displayName: "Coal Dock Park Promenade",
      municipality: "Port Washington",
      disposition: "candidate",
      accessStatus: "open_by_published_rules",
      accessRoute: {
        displayName: "Coal Dock Park",
        streetAddress: "146 S Wisconsin St, Port Washington, WI 53074",
        latitude: 43.3849,
        longitude: -87.8689,
        coordinateSource:
          "Approximate land-side park point derived from the City of Port Washington park map; route by the published street address and on-site signs",
      },
      accessEvidence: [
        {
          evidenceId: "port_washington_coal_dock_inventory_2026_09_14",
          authority: "City of Port Washington",
          title: "Parks, Open Space and Forestry Plan inventory",
          url:
            "https://www.portwashingtonwi.gov/home/showpublisheddocument/132/637793020063700000",
          reviewedAt: "2026-09-14",
        },
        {
          evidenceId: "port_washington_park_hours_2026_09_14",
          authority: "City of Port Washington",
          title: "Park rental information and hours",
          url:
            "https://www.portwashingtonwi.gov/departments/parks-recreation/parks-facilities/rental-information",
          reviewedAt: "2026-09-14",
        },
      ],
      liveAccessStatus: "not_live_checked",
      limitation:
        "The city identifies fishing along the Coal Dock promenade. The city-level reading does not claim that conditions match every point on the promenade; on-site restrictions and current conditions control.",
    },
  ],
  species: applyPierCastSpeciesExpansionDispositions("port_washington_wi", [
    core("coho_salmon"),
    core("chinook_salmon"),
    core("steelhead"),
    core("brown_trout"),
    speciesProfile(
      "yellow_perch",
      "conditional",
      null,
      "A nearshore research lead only; no Port Washington city-pier seasonal curve has been admitted.",
    ),
    speciesProfile(
      "lake_trout",
      "historical_lead",
      null,
      "County or regional occurrence does not establish a repeatable city-pier seasonal opportunity.",
    ),
    speciesProfile(
      "walleye",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "smallmouth_bass",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "freshwater_drum",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "lake_whitefish",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "round_whitefish",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "channel_catfish",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "largemouth_bass",
      "unresolved",
      null,
      "No city-pier seasonal admission.",
    ),
    speciesProfile(
      "atlantic_salmon",
      "unresolved",
      null,
      "Explicit Lake Huron schema review found no evidence supporting a roster change for Port Washington.",
    ),
    speciesProfile(
      "northern_pike",
      "unresolved",
      null,
      "Explicit Lake Huron schema review found no evidence supporting a roster change for Port Washington.",
    ),
  ]),
};

export type PierCastPortWashingtonAdmission = {
  methodConstraint: string;
  structureId: string;
  regulationValidThrough: string;
};

export function getPierCastPortWashingtonTemperatureCurve(
  speciesId: PierCastSpeciesId,
): PierCastTemperatureCurve | null {
  return PIER_CAST_PORT_WASHINGTON_SPECIES_IDS.includes(
      speciesId as PierCastPortWashingtonSpeciesId,
    )
    ? PIER_CAST_CORE_TEMPERATURE_CURVES[
      speciesId as PierCastPortWashingtonSpeciesId
    ]
    : null;
}

export function getPierCastPortWashingtonAdmission(
  speciesId: PierCastSpeciesId,
): PierCastPortWashingtonAdmission | undefined {
  if (
    !PIER_CAST_PORT_WASHINGTON_SPECIES_IDS.includes(
      speciesId as PierCastPortWashingtonSpeciesId,
    )
  ) return undefined;
  return {
    methodConstraint:
      "General Wisconsin Lake Michigan hook-and-line regulations; verify current species, season, size, and bag rules before fishing.",
    structureId: "port_washington_city_harbor",
    regulationValidThrough: "2027-03-31",
  };
}
