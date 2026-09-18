import type {
  PierCastCityId,
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastCityTemperatureSource,
  PierCastSpeciesId,
  PierCastStructure,
} from "../types.ts";
import { PIER_CAST_SPECIES_PROFILES } from "./species.ts";

export const PIER_CAST_FIVE_CITY_SCOPE_VERSION =
  "piercast-five-city-shadow-v1" as const;

export const PIER_CAST_FIVE_CITY_IDS = [
  "two_rivers_wi",
  "kewaunee_wi",
  "algoma_wi",
  "manitowoc_wi",
  "waukegan_il",
] as const satisfies readonly PierCastCityId[];

export type PierCastFiveCityId = (typeof PIER_CAST_FIVE_CITY_IDS)[number];

const numeric: Record<PierCastFiveCityId, readonly PierCastSpeciesId[]> = {
  two_rivers_wi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout"],
  kewaunee_wi: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
  ],
  algoma_wi: ["chinook_salmon", "coho_salmon", "steelhead", "brown_trout"],
  manitowoc_wi: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "smallmouth_bass",
    "northern_pike",
  ],
  waukegan_il: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "yellow_perch",
  ],
};

const holds: Record<PierCastFiveCityId, readonly PierCastSpeciesId[]> = {
  two_rivers_wi: [
    "lake_trout",
    "smallmouth_bass",
    "yellow_perch",
    "northern_pike",
  ],
  kewaunee_wi: ["smallmouth_bass", "yellow_perch", "northern_pike"],
  algoma_wi: ["lake_trout", "smallmouth_bass", "yellow_perch", "northern_pike"],
  manitowoc_wi: ["lake_trout", "yellow_perch"],
  waukegan_il: [
    "lake_trout",
    "smallmouth_bass",
    "freshwater_drum",
    "lake_whitefish",
    "round_whitefish",
    "largemouth_bass",
    "bluegill",
  ],
};

function species(cityId: PierCastFiveCityId): PierCastCitySpeciesProfile[] {
  return PIER_CAST_SPECIES_PROFILES.map(({ speciesId }) => ({
    speciesId,
    inheritance: numeric[cityId].includes(speciesId)
      ? "candidate"
      : holds[cityId].includes(speciesId)
      ? "conditional"
      : "unresolved",
    seasonalOpportunityCurve: null,
    ratingEnabled: false,
    limitation: numeric[cityId].includes(speciesId)
      ? "Pass 2 Grade B city-harbor estimate. Available only in the owner Formula v3 review; it is not a catch probability or a public rating."
      : holds[cityId].includes(speciesId)
      ? "Research hold. Local occurrence is plausible or documented, but the evidence does not support a numeric city-pier estimate."
      : "No credible local pier lead was admitted in the reviewed evidence set; this does not assert biological absence.",
  }));
}

const ENDPOINT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc";

function source(
  cityId: PierCastFiveCityId,
  location: NonNullable<PierCastCityTemperatureSource["configuredLocation"]>,
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
    limitation:
      "One wet lakeward LMHOFS surface cell supplies a general city-harbor reading. It is not a pier thermometer and cannot resolve harbor mixing, depth, river plumes, waves, ice, construction, or access.",
  };
}

function access(
  evidenceId: string,
  authority: string,
  title: string,
  url: string,
) {
  return { evidenceId, authority, title, url, reviewedAt: "2026-09-18" };
}

const TWO_RIVERS_STRUCTURES: PierCastStructure[] = [{
  structureId: "two_rivers_north_pier",
  displayName: "North Pier / New Beach harbor approach",
  municipality: "Two Rivers",
  disposition: "candidate",
  accessStatus: "not_live_verified",
  accessRoute: {
    displayName: "New Beach gravel lot beside Coast Guard Park",
    streetAddress: "Two Rivers, WI 54241",
    latitude: 44.1451,
    longitude: -87.5666,
    coordinateSource: "City of Two Rivers parks plan map",
  },
  accessEvidence: [access(
    "FIVE_ACCESS_TWO_RIVERS_CITY_PLAN",
    "City of Two Rivers",
    "Parks and Open Space Plan",
    "https://www.two-rivers.org/sites/default/files/fileattachments/parks_and_recreation/page/5034/parks_and_open_space_plan_adopted_9_3_24.pdf",
  )],
  liveAccessStatus: "not_live_checked",
  limitation:
    "The public land approach is documented. Current signs, temporary closures, construction, waves, weather, and ice control access.",
}];

const KEWAUNEE_STRUCTURES: PierCastStructure[] = [
  {
    structureId: "kewaunee_south_lighthouse_pier",
    displayName: "South lighthouse pier",
    municipality: "Kewaunee",
    disposition: "candidate",
    accessStatus: "not_live_verified",
    accessRoute: {
      displayName: "Donald and Jane Smith Lighthouse Park / Ellis Street",
      streetAddress: "Ellis St, Kewaunee, WI 54216",
      latitude: 44.4577,
      longitude: -87.5002,
      coordinateSource: "City park plan and lighthouse operator route",
    },
    accessEvidence: [access(
      "FIVE_ACCESS_KEWAUNEE_CITY_PLAN",
      "City of Kewaunee",
      "2025 park plan and lighthouse access materials",
      "https://cityofkewauneewi.gov/wp-content/uploads/2025/08/2025.08.11-City-Council-Agenda-Packet-8.pdf",
    )],
    liveAccessStatus: "not_live_checked",
    limitation:
      "Published materials support a pedestrian route. Current signs, construction, temporary closures, waves, weather, and ice control access.",
  },
  {
    structureId: "kewaunee_harbor_point_fishing_piers",
    displayName: "Harbor Point Park inner-harbor fishing piers",
    municipality: "Kewaunee",
    disposition: "candidate",
    accessStatus: "open_by_published_rules",
    accessRoute: {
      displayName: "Harbor Point Park",
      streetAddress: "Kewaunee, WI 54216",
      latitude: 44.4594,
      longitude: -87.507,
      coordinateSource: "City of Kewaunee park plan map",
    },
    accessEvidence: [access(
      "FIVE_ACCESS_KEWAUNEE_HARBOR_POINT",
      "City of Kewaunee",
      "Harbor Point Park fishing-pier plan",
      "https://cityofkewauneewi.gov/wp-content/uploads/2025/08/2025.08.11-City-Council-Agenda-Packet-8.pdf",
    )],
    liveAccessStatus: "not_live_checked",
    limitation:
      "This is an inner-harbor subarea and must not be described as interchangeable with the exposed lighthouse pier. Current posted rules control.",
  },
];

const ALGOMA_STRUCTURES: PierCastStructure[] = [
  {
    structureId: "algoma_south_breakwater",
    displayName: "South breakwater",
    municipality: "Algoma",
    disposition: "candidate",
    accessStatus: "reported_closed",
    accessRoute: null,
    accessEvidence: [access(
      "FIVE_ACCESS_ALGOMA_USACE_2026",
      "U.S. Army Corps of Engineers",
      "Algoma Harbor project status",
      "https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638113/algoma-harbor/",
    )],
    liveAccessStatus: "reported_closed",
    limitation:
      "USACE reports south-breakwater construction with tentative completion in April 2027, and project materials prohibit breakwater fishing during construction. The forecast describes the fishery and is not an access recommendation.",
  },
  {
    structureId: "algoma_north_pier",
    displayName: "North pier / adjacent harbor shore",
    municipality: "Algoma",
    disposition: "unresolved",
    accessStatus: "route_unverified",
    accessRoute: null,
    accessEvidence: [access(
      "FIVE_ACCESS_ALGOMA_USACE_NORTH",
      "U.S. Army Corps of Engineers",
      "Algoma Harbor north-breakwater planning status",
      "https://www.lrd.usace.army.mil/Missions/Projects/Display/Article/3638113/algoma-harbor/",
    )],
    liveAccessStatus: "not_live_checked",
    limitation:
      "North-breakwater work is in planning and the currently legal public segment has not been mapped. Do not infer access from the report.",
  },
];

const MANITOWOC_STRUCTURES: PierCastStructure[] = [{
  structureId: "manitowoc_lighthouse_park_pier",
  displayName: "Lighthouse Park harbor pier / shore",
  municipality: "Manitowoc",
  disposition: "candidate",
  accessStatus: "open_by_published_rules",
  accessRoute: {
    displayName: "Lighthouse Park",
    streetAddress: "475 Maritime Dr, Manitowoc, WI 54220",
    latitude: 44.0921,
    longitude: -87.653,
    coordinateSource: "City of Manitowoc facility page",
  },
  accessEvidence: [access(
    "FIVE_ACCESS_MANITOWOC_LIGHTHOUSE_PARK",
    "City of Manitowoc",
    "Lighthouse Park facility page",
    "https://www.manitowoc.org/facilities/facility/details/Lighthouse-Park-53",
  )],
  liveAccessStatus: "not_live_checked",
  limitation:
    "The city lists fishing, parking, and 6 a.m.–11 p.m. park hours. Current signs, temporary closures, waves, weather, and ice control access.",
}];

const WAUKEGAN_STRUCTURES: PierCastStructure[] = [{
  structureId: "waukegan_government_pier",
  displayName: "Government Pier / south pier",
  municipality: "Waukegan",
  disposition: "candidate",
  accessStatus: "not_live_verified",
  accessRoute: {
    displayName: "Waukegan Harbor boat-launch side",
    streetAddress: "55 S Harbor Pl, Waukegan, IL 60085",
    latitude: 42.3558,
    longitude: -87.824,
    coordinateSource: "City of Waukegan Government Pier reopening notice",
  },
  accessEvidence: [access(
    "FIVE_ACCESS_WAUKEGAN_GOVERNMENT_PIER",
    "City of Waukegan",
    "Government Pier reopening notice",
    "https://www.waukeganil.gov/Calendar.aspx?EID=5041",
  )],
  liveAccessStatus: "not_live_checked",
  limitation:
    "The city documented the south pier reopening and continued public event use. Current fishing signs, parking rules, temporary closures, waves, weather, and ice control access.",
}];

export const PIER_CAST_FIVE_CITY_PROFILES = [
  profile(
    "two_rivers_wi",
    "Two Rivers",
    "WI",
    44.14,
    -87.56,
    254,
    50,
    5.099305719331879,
    {
      referenceId: "two_rivers_north_pierhead_light",
      displayName: "Two Rivers North Pierhead Light",
      latitude: 44.1426916667,
      longitude: -87.5607033333,
      distanceM: 305,
    },
    TWO_RIVERS_STRUCTURES,
  ),
  profile(
    "kewaunee_wi",
    "Kewaunee",
    "WI",
    44.46,
    -87.48,
    286,
    58,
    6.7387495742286205,
    {
      referenceId: "kewaunee_pierhead_light",
      displayName: "Kewaunee Pierhead Light",
      latitude: 44.4572833333,
      longitude: -87.4931333333,
      distanceM: 1085,
    },
    KEWAUNEE_STRUCTURES,
  ),
  profile(
    "algoma_wi",
    "Algoma",
    "WI",
    44.61,
    -87.42,
    301,
    64,
    5.288545265058365,
    {
      referenceId: "algoma_light",
      displayName: "Algoma Light",
      latitude: 44.606855,
      longitude: -87.4296633333,
      distanceM: 841,
    },
    ALGOMA_STRUCTURES,
  ),
  profile(
    "manitowoc_wi",
    "Manitowoc",
    "WI",
    44.09,
    -87.64,
    249,
    42,
    5.146118553032811,
    {
      referenceId: "manitowoc_harbor_of_refuge_pierhead_light_8",
      displayName: "Manitowoc Harbor of Refuge Pierhead Light 8",
      latitude: 44.0924111111,
      longitude: -87.6515533333,
      distanceM: 961,
    },
    MANITOWOC_STRUCTURES,
  ),
  profile(
    "waukegan_il",
    "Waukegan",
    "IL",
    42.36,
    -87.8,
    76,
    26,
    7.4552234441381815,
    {
      referenceId: "waukegan_harbor_light",
      displayName: "Waukegan Harbor Light",
      latitude: 42.3606525,
      longitude: -87.8134086111,
      distanceM: 1104,
    },
    WAUKEGAN_STRUCTURES,
  ),
] as const satisfies readonly PierCastCityProfile[];

function profile(
  cityId: PierCastFiveCityId,
  displayName: string,
  stateCode: "WI" | "IL",
  latitude: number,
  longitude: number,
  gridRow: number,
  gridColumn: number,
  modelBathymetryM: number,
  reference: {
    referenceId: string;
    displayName: string;
    latitude: number;
    longitude: number;
    distanceM: number;
  },
  structures: PierCastStructure[],
): PierCastCityProfile {
  return {
    cityId,
    displayName,
    stateCode,
    timezone: "America/Chicago",
    tentative: true,
    publicEnabled: false,
    waterTemperatureSource: source(cityId, {
      latitude,
      longitude,
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow,
      gridColumn,
      modelBathymetryM,
      selectionMethod: "nearest_wet_lakeward_regular_grid_center",
      referencePoint: {
        ...reference,
        coordinateSource: "U.S. Coast Guard Light List",
      },
      gridCellStatus: "candidate",
    }),
    structures,
    species: species(cityId),
  };
}
