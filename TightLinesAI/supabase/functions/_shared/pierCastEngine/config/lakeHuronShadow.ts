import type {
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastCityTemperatureSource,
  PierCastSpeciesId,
  PierCastTemperatureCurve,
} from "../types.ts";

export const PIER_CAST_LAKE_HURON_SCOPE_VERSION =
  "piercast-lake-huron-shadow-v1";

export const PIER_CAST_LAKE_HURON_CITY_IDS = [
  "harbor_beach_mi",
  "oscoda_mi",
  "port_sanilac_mi",
] as const;

export type PierCastLakeHuronCityId =
  (typeof PIER_CAST_LAKE_HURON_CITY_IDS)[number];

export const PIER_CAST_LAKE_HURON_TEMPERATURE_CURVES = {
  atlantic_salmon: {
    curveId: "atlantic_salmon__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [-0.5, 27.8],
    knots: [
      { temperatureC: -0.5, suitability: 0.35 },
      { temperatureC: 4, suitability: 1 },
      { temperatureC: 12, suitability: 1 },
      { temperatureC: 15, suitability: 0.84 },
      { temperatureC: 18, suitability: 0.58 },
      { temperatureC: 21, suitability: 0.3 },
      { temperatureC: 24, suitability: 0.12 },
      { temperatureC: 27.8, suitability: 0.03 },
    ],
  },
  northern_pike: {
    curveId: "northern_pike__shared_temperature__v0_1",
    calibrationStatus: "provisional",
    acceptedDomainC: [0, 29],
    knots: [
      { temperatureC: 0, suitability: 0.42 },
      { temperatureC: 4, suitability: 0.58 },
      { temperatureC: 10, suitability: 0.8 },
      { temperatureC: 16, suitability: 1 },
      { temperatureC: 21, suitability: 1 },
      { temperatureC: 24, suitability: 0.75 },
      { temperatureC: 25, suitability: 0.55 },
      { temperatureC: 29, suitability: 0.1 },
    ],
  },
} as const satisfies Partial<
  Record<PierCastSpeciesId, PierCastTemperatureCurve>
>;

const ENDPOINT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc";

function source(
  cityId: PierCastLakeHuronCityId,
  location: NonNullable<PierCastCityTemperatureSource["configuredLocation"]>,
  limitation: string,
): PierCastCityTemperatureSource {
  return {
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
    validationObservation: null,
    limitation,
  };
}

const allSpecies: readonly PierCastSpeciesId[] = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "walleye",
  "smallmouth_bass",
  "freshwater_drum",
  "yellow_perch",
  "lake_whitefish",
  "round_whitefish",
  "channel_catfish",
  "largemouth_bass",
  "atlantic_salmon",
  "northern_pike",
];

const admittedByCity: Record<
  PierCastLakeHuronCityId,
  readonly PierCastSpeciesId[]
> = {
  harbor_beach_mi: ["coho_salmon", "smallmouth_bass"],
  oscoda_mi: [
    "atlantic_salmon",
    "steelhead",
    "walleye",
    "lake_trout",
    "coho_salmon",
    "chinook_salmon",
    "smallmouth_bass",
    "channel_catfish",
    "freshwater_drum",
  ],
  port_sanilac_mi: ["coho_salmon", "steelhead", "northern_pike"],
};

function species(
  cityId: PierCastLakeHuronCityId,
): PierCastCitySpeciesProfile[] {
  const admitted = new Set(admittedByCity[cityId]);
  return allSpecies.map((speciesId) => ({
    speciesId,
    inheritance: admitted.has(speciesId) ? "candidate" : "unresolved",
    seasonalOpportunityCurve: null,
    ratingEnabled: false,
    limitation: admitted.has(speciesId)
      ? "Evidence-admitted Formula v3 Lake Huron private-shadow candidate; numeric scoring remains disabled and promotion-blocked."
      : "Explicitly deferred or excluded by the Lake Huron candidate decision matrix; no numeric city-pier score is configured.",
  }));
}

const harborBeachAccess = [{
  evidenceId: "LH_ACCESS_HARBOR_BEACH_CITY",
  authority: "City of Harbor Beach",
  title: "Judge James H. Lincoln Memorial Park",
  url: "https://www.harborbeach.com/judge-james-h-lincoln-memorial-park",
  reviewedAt: "2026-09-15",
}] as const;

const oscodaAccess = [{
  evidenceId: "LH_ACCESS_OSCODA_COAST_PILOT",
  authority: "NOAA",
  title: "United States Coast Pilot 6, 2026 edition",
  url:
    "https://nauticalcharts.noaa.gov/publications/coast-pilot/files/cp6/CPB6_WEB.pdf",
  reviewedAt: "2026-09-15",
}] as const;

const portSanilacAccess = [{
  evidenceId: "LH_ACCESS_PORT_SANILAC_CITY",
  authority: "Village of Port Sanilac",
  title: "Things to do — boatless breakwall fishing",
  url: "https://www.portsanilac.net/things-to-do",
  reviewedAt: "2026-09-15",
}, {
  evidenceId: "LH_ACCESS_PORT_SANILAC_ORDINANCE",
  authority: "Village of Port Sanilac",
  title: "Harbor ordinance, updated July 1, 2025",
  url:
    "https://www.portsanilac.net/_files/ugd/94aae1_2c58f2abda5d496b965ecb771f9f6f25.pdf",
  reviewedAt: "2026-09-15",
}] as const;

export const PIER_CAST_HARBOR_BEACH_PROFILE: PierCastCityProfile = {
  cityId: "harbor_beach_mi",
  displayName: "Harbor Beach",
  stateCode: "MI",
  timezone: "America/Detroit",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "harbor_beach_mi",
    {
      latitude: 43.84,
      longitude: -82.64,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 224,
      gridColumn: 542,
      modelBathymetryM: 0.850409492620949,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "trescott_street_memorial_pier",
        displayName: "Trescott Street / Judge James H. Lincoln Memorial Pier",
        latitude: 43.84132,
        longitude: -82.64677,
        distanceM: 562,
        coordinateSource: "Michigan Water Trails",
      },
      gridCellStatus: "candidate",
    },
    "One lakeward surface cell represents the general public-pier fishery, not an in-harbor thermometer. NOAA CO-OPS station 9075014 is a nearby independent observation lead, but representation approval remains blocked pending prospective comparison.",
  ),
  structures: [{
    structureId: "harbor_beach_trescott_memorial_pier",
    displayName: "Trescott Street / Judge James H. Lincoln Memorial Pier",
    municipality: "Harbor Beach",
    disposition: "candidate",
    accessStatus: "open_by_published_rules",
    accessRoute: {
      displayName: "Judge James H. Lincoln Memorial Park",
      streetAddress: "Harbor Beach, MI 48441",
      latitude: 43.84132,
      longitude: -82.64677,
      coordinateSource: "Michigan Water Trails public access listing",
    },
    accessEvidence: harborBeachAccess,
    liveAccessStatus: "not_live_checked",
    limitation:
      "The city publishes the Trescott pier as a fishing pier. Current signs, weather, waves, ice, construction, and emergency closures always control.",
  }],
  species: species("harbor_beach_mi"),
};

export const PIER_CAST_OSCODA_PROFILE: PierCastCityProfile = {
  cityId: "oscoda_mi",
  displayName: "Oscoda",
  stateCode: "MI",
  timezone: "America/Detroit",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "oscoda_mi",
    {
      latitude: 44.41,
      longitude: -83.31,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 281,
      gridColumn: 475,
      modelBathymetryM: 5.151933949879942,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "au_sable_north_pierhead_light",
        displayName: "Au Sable north pierhead light",
        latitude: 44.4066394,
        longitude: -83.3165022,
        distanceM: 638,
        coordinateSource: "NOAA Aids to Navigation",
      },
      gridCellStatus: "candidate",
    },
    "The deliberately lakeward cell avoids the shallower landward neighbor. It represents the general Au Sable mouth/pier fishery; no defensible pier-local independent surface series was found, so representation approval remains blocked.",
  ),
  structures: [{
    structureId: "oscoda_au_sable_pier_catwalk",
    displayName: "Au Sable river-mouth pier / catwalk",
    municipality: "Oscoda",
    disposition: "candidate",
    accessStatus: "not_live_verified",
    accessRoute: {
      displayName: "Au Sable River mouth public shore approach",
      streetAddress: "Oscoda, MI 48750",
      latitude: 44.4066394,
      longitude: -83.3165022,
      coordinateSource: "NOAA Aids to Navigation reference point",
    },
    accessEvidence: oscodaAccess,
    liveAccessStatus: "not_live_checked",
    limitation:
      "DNR reports repeatedly identify anglers on the Oscoda pier/catwalk and NOAA documents the river-mouth piers. The exact municipal land route is not represented as live-verified; obey posted access and closures.",
  }],
  species: species("oscoda_mi"),
};

export const PIER_CAST_PORT_SANILAC_PROFILE: PierCastCityProfile = {
  cityId: "port_sanilac_mi",
  displayName: "Port Sanilac",
  stateCode: "MI",
  timezone: "America/Detroit",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: source(
    "port_sanilac_mi",
    {
      latitude: 43.43,
      longitude: -82.53,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: 183,
      gridColumn: 553,
      modelBathymetryM: 6.844249508910049,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        referenceId: "port_sanilac_north_breakwater_light",
        displayName: "Port Sanilac north breakwater light",
        latitude: 43.4302836,
        longitude: -82.5348128,
        distanceM: 390,
        coordinateSource: "NOAA Aids to Navigation",
      },
      gridCellStatus: "candidate",
    },
    "One lakeward surface cell represents the general legal public-breakwall fishery. No defensible pier-local independent observation series was found, so representation approval remains blocked.",
  ),
  structures: [{
    structureId: "port_sanilac_public_breakwall",
    displayName: "Public harbor breakwall fishing area",
    municipality: "Port Sanilac",
    disposition: "candidate",
    accessStatus: "open_by_published_rules",
    accessRoute: {
      displayName: "Port Sanilac municipal harbor",
      streetAddress: "4 S Lake St, Port Sanilac, MI 48469",
      latitude: 43.4302836,
      longitude: -82.5348128,
      coordinateSource: "NOAA Aids to Navigation reference point",
    },
    accessEvidence: portSanilacAccess,
    liveAccessStatus: "not_live_checked",
    limitation:
      "The village invites boatless fishing from the breakwall, while its ordinance prohibits fishing in the south basin, channels/fairways, municipal docks, harbor-front sidewalks, dock/ramp areas, and certain privately controlled shoreline. Only posted legal public areas are in scope; Harbor Master closures control.",
  }],
  species: species("port_sanilac_mi"),
};

export const PIER_CAST_LAKE_HURON_CITY_PROFILES = [
  PIER_CAST_HARBOR_BEACH_PROFILE,
  PIER_CAST_OSCODA_PROFILE,
  PIER_CAST_PORT_SANILAC_PROFILE,
] as const satisfies readonly PierCastCityProfile[];

export function getPierCastLakeHuronTemperatureCurve(
  speciesId: PierCastSpeciesId,
): PierCastTemperatureCurve | null {
  return PIER_CAST_LAKE_HURON_TEMPERATURE_CURVES[
    speciesId as keyof typeof PIER_CAST_LAKE_HURON_TEMPERATURE_CURVES
  ] ?? null;
}
