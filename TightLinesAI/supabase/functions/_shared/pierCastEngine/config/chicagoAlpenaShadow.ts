import type {
  PierCastCityId,
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastCityTemperatureSource,
  PierCastSpeciesId,
  PierCastStructure,
} from "../types.ts";
import { PIER_CAST_SPECIES_PROFILES } from "./species.ts";

export const PIER_CAST_CHICAGO_ALPENA_SCOPE_VERSION =
  "piercast-chicago-alpena-shadow-v1" as const;

export const PIER_CAST_CHICAGO_ALPENA_CITY_IDS = [
  "chicago_il",
  "michigan_city_in",
  "muskegon_mi",
  "whitehall_mi",
  "alpena_mi",
] as const satisfies readonly PierCastCityId[];

export type PierCastChicagoAlpenaCityId =
  (typeof PIER_CAST_CHICAGO_ALPENA_CITY_IDS)[number];

const numeric: Record<
  PierCastChicagoAlpenaCityId,
  readonly PierCastSpeciesId[]
> = {
  chicago_il: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "smallmouth_bass",
    "freshwater_drum",
    "yellow_perch",
    "northern_pike",
  ],
  michigan_city_in: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "smallmouth_bass",
    "yellow_perch",
    "largemouth_bass",
    "bluegill",
  ],
  muskegon_mi: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "walleye",
    "smallmouth_bass",
    "freshwater_drum",
    "yellow_perch",
    "lake_whitefish",
    "channel_catfish",
    "largemouth_bass",
    "northern_pike",
    "white_perch",
    "bluegill",
  ],
  whitehall_mi: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "walleye",
    "smallmouth_bass",
    "freshwater_drum",
    "yellow_perch",
    "lake_whitefish",
    "channel_catfish",
    "largemouth_bass",
    "northern_pike",
    "bluegill",
  ],
  alpena_mi: [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "brown_trout",
    "lake_trout",
    "walleye",
    "smallmouth_bass",
    "freshwater_drum",
    "yellow_perch",
    "northern_pike",
    "atlantic_salmon",
  ],
};

const holds: Record<
  PierCastChicagoAlpenaCityId,
  readonly PierCastSpeciesId[]
> = {
  chicago_il: [
    "lake_whitefish",
    "channel_catfish",
    "largemouth_bass",
    "burbot",
    "white_bass",
    "bluegill",
  ],
  michigan_city_in: [
    "lake_trout",
    "walleye",
    "freshwater_drum",
    "lake_whitefish",
    "channel_catfish",
  ],
  muskegon_mi: ["lake_trout", "round_whitefish", "white_bass"],
  whitehall_mi: [
    "lake_trout",
    "round_whitefish",
    "atlantic_salmon",
    "white_perch",
    "white_bass",
  ],
  alpena_mi: [
    "lake_whitefish",
    "channel_catfish",
    "largemouth_bass",
    "bluegill",
  ],
};

function species(
  cityId: PierCastChicagoAlpenaCityId,
): PierCastCitySpeciesProfile[] {
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
      ? "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      : holds[cityId].includes(speciesId)
      ? "Research hold. Local occurrence is plausible or documented, but covered-structure recurrence does not support a numeric estimate."
      : "No credible covered-structure lead was admitted in the reviewed evidence set; this does not assert biological absence.",
  }));
}

const ENDPOINT =
  "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc";

function source(
  cityId: PierCastChicagoAlpenaCityId,
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
      "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, depth, river plumes, waves, ice, or access.",
  };
}

function evidence(
  evidenceId: string,
  authority: string,
  title: string,
  url: string,
) {
  return { evidenceId, authority, title, url, reviewedAt: "2026-09-19" };
}

const structures: Record<
  PierCastChicagoAlpenaCityId,
  PierCastStructure[]
> = {
  chicago_il: [
    {
      structureId: "chicago_montrose_harbor_pier",
      displayName: "Montrose Harbor fishing pier and Horseshoe",
      municipality: "Chicago",
      disposition: "candidate",
      accessStatus: "not_live_verified",
      accessRoute: {
        displayName: "Montrose Harbor fishing pier west of the boat launch",
        streetAddress: "601 W Montrose Ave, Chicago, IL 60613",
        latitude: 41.963,
        longitude: -87.634,
        coordinateSource: "Chicago Park District fishing-area materials",
      },
      accessEvidence: [evidence(
        "CHI_CPD_MONTROSE_PIER",
        "Chicago Park District",
        "Family Fishing at Montrose Harbor",
        "https://www.chicagoparkdistrict.com/events/family-fishing-montrose-harbor-1",
      )],
      liveAccessStatus: "not_live_checked",
      limitation:
        "Use only legal public walls and the fishing pier. Posted hours, winter-pass rules, construction, weather, waves, and ice control access.",
    },
    {
      structureId: "chicago_navy_pier_north_fishing_area",
      displayName: "Navy Pier north-side and Marina fishing area",
      municipality: "Chicago",
      disposition: "candidate",
      accessStatus: "not_live_verified",
      accessRoute: {
        displayName: "Posted north-side Navy Pier fishing entrance",
        streetAddress: "600 E Grand Ave, Chicago, IL 60611",
        latitude: 41.8917,
        longitude: -87.6043,
        coordinateSource: "Chicago Park District and Navy Pier Marina rules",
      },
      accessEvidence: [
        evidence(
          "CHI_CPD_FISHING_AREAS",
          "Chicago Park District",
          "Fishing Areas",
          "https://www.chicagoparkdistrict.com/facilities/fishing-areas",
        ),
        evidence(
          "CHI_NAVY_PASS",
          "Navy Pier Marina",
          "Fishing Pass Application",
          "https://navypiermarina.com/fishing-pass-application/",
        ),
      ],
      liveAccessStatus: "not_live_checked",
      limitation:
        "Only the legal north-side/pass-controlled area is covered. Marina hours, pass rules, construction, security, events, weather, waves, and ice control access.",
    },
  ],
  michigan_city_in: [
    {
      structureId: "michigan_city_washington_park_east_pier",
      displayName: "Washington Park East Pier and immediate basin edge",
      municipality: "Michigan City",
      disposition: "candidate",
      accessStatus: "not_live_verified",
      accessRoute: {
        displayName: "Washington Park lakefront approach",
        streetAddress: "6 On the Lake, Michigan City, IN 46360",
        latitude: 41.728,
        longitude: -86.9126,
        coordinateSource: "Michigan City Parks and Indiana DNR",
      },
      accessEvidence: [
        evidence(
          "MC_CITY_WASHINGTON_PARK",
          "Michigan City Parks and Recreation",
          "Washington Park",
          "https://parks.michigancityin.gov/parks-and-facilities/washington-park/",
        ),
        evidence(
          "IN_DNR_LAKE_MICHIGAN",
          "Indiana DNR",
          "Lake Michigan Fishing",
          "https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/",
        ),
      ],
      liveAccessStatus: "not_live_checked",
      limitation:
        "Trail Creek upstream, NIPSCO, Port of Indiana, boats, and unrelated beach shore are outside this report. Park fees, repairs, signs, waves, weather, and ice control access.",
    },
    {
      structureId: "michigan_city_dnr_inner_harbor_edge",
      displayName: "DNR/Coast Guard inner-harbor public edge",
      municipality: "Michigan City",
      disposition: "candidate",
      accessStatus: "route_unverified",
      accessRoute: null,
      accessEvidence: [evidence(
        "IN_DNR_COHO_GUIDE",
        "Indiana DNR",
        "Spring Coho Shore Fishing 101",
        "https://www.in.gov/dA/66b33fee6d/fw-Spring_Coho_Shore_Fishing_101.pdf?language_id=1",
      )],
      liveAccessStatus: "not_live_checked",
      limitation:
        "This subarea is separate from East Pier. The precise current legal route and posted Coast Guard restrictions require live confirmation.",
    },
  ],
  muskegon_mi: [
    {
      structureId: "muskegon_south_channel_pier",
      displayName: "South channel wall and pier approach",
      municipality: "Muskegon",
      disposition: "candidate",
      accessStatus: "not_live_verified",
      accessRoute: {
        displayName: "Public south-side channel approach",
        streetAddress: "Muskegon, MI 49441",
        latitude: 43.226771,
        longitude: -86.337539,
        coordinateSource: "Michigan DNR Central Lake Michigan Unit",
      },
      accessEvidence: [evidence(
        "MI_DNR_CENTRAL_UNIT",
        "Michigan DNR",
        "Central Lake Michigan Management Unit",
        "https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan",
      )],
      liveAccessStatus: "not_live_checked",
      limitation:
        "Only the public Lake Michigan outlet-channel frontage is covered. Posted closures, weather, waves, and ice control access.",
    },
    {
      structureId: "muskegon_north_channel_platforms",
      displayName: "North channel fishing decks and walkway",
      municipality: "Muskegon",
      disposition: "candidate",
      accessStatus: "not_live_verified",
      accessRoute: {
        displayName: "Muskegon State Park channel approach",
        streetAddress: "Muskegon State Park, North Muskegon, MI 49445",
        latitude: 43.231649,
        longitude: -86.333334,
        coordinateSource: "Michigan DNR Central Lake Michigan Unit",
      },
      accessEvidence: [evidence(
        "MUSKEGON_STATE_PARK",
        "Michigan DNR",
        "Muskegon State Park",
        "https://www.michigan.gov/recsearch/parks/muskegon",
      )],
      liveAccessStatus: "not_live_checked",
      limitation:
        "The published construction notice anticipated reopening after August 2026 but did not confirm it. Treat this segment as unverified until the land manager or current signs confirm access.",
    },
  ],
  whitehall_mi: [{
    structureId: "whitehall_medbery_park_channel_edge",
    displayName: "Medbery Park White Lake outlet-channel edge",
    municipality: "White River Township",
    disposition: "candidate",
    accessStatus: "open_by_published_rules",
    accessRoute: {
      displayName: "Medbery Park",
      streetAddress: "7340 Life Guard Rd, Montague, MI 49437",
      latitude: 43.379,
      longitude: -86.425,
      coordinateSource: "White Lake Area Chamber site listing",
    },
    accessEvidence: [evidence(
      "MEDBERY_ACCESS",
      "White Lake Area Chamber and CVB",
      "Medbery Park",
      "https://www.whitelake.org/business/medbery-park/",
    )],
    liveAccessStatus: "not_live_checked",
    limitation:
      "The discovery label is Whitehall, but this City of Montague property is in White River Township. Published hours are 6 a.m.–11 p.m.; current signs, weather, waves, and ice control access.",
  }],
  alpena_mi: [{
    structureId: "alpena_bay_view_breakwall_platform",
    displayName: "Bay View Park breakwall and fishing platform",
    municipality: "Alpena",
    disposition: "candidate",
    accessStatus: "not_live_verified",
    accessRoute: {
      displayName: "Bay View Park breakwall approach",
      streetAddress: "S Harbor Dr at Prentiss St, Alpena, MI 49707",
      latitude: 45.060342,
      longitude: -83.422999,
      coordinateSource: "City of Alpena and lighthouse preservation society",
    },
    accessEvidence: [
      evidence(
        "ALPENA_BREAKWALL_ACCESS",
        "Thunder Bay Island Lighthouse Preservation Society",
        "Visit Alpena Light",
        "https://www.alpenalighthouse.org/visit-alpena-light/",
      ),
      evidence(
        "ALPENA_CITY_PLAN",
        "City of Alpena",
        "Planning Commission packet, 2024-01-09",
        "https://www.alpena.mi.us/departments/planning/Planning_Commission/Packet_01_09_2024.pdf",
      ),
    ],
    liveAccessStatus: "not_live_checked",
    limitation:
      "The lighthouse tower, open-water Thunder Bay, boats, other shore parks, and Thunder Bay River are excluded. Posted marina, security, weather, wave, and ice restrictions control access.",
  }],
};

const locations: Record<
  PierCastChicagoAlpenaCityId,
  NonNullable<PierCastCityTemperatureSource["configuredLocation"]>
> = {
  chicago_il: {
    latitude: 41.96,
    longitude: -87.62,
    gridRow: 36,
    gridColumn: 44,
    modelBathymetryM: 6.240518811142804,
    verticalSelection: "surface",
    depthIndex: 0,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "montrose_harbor_entrance",
      displayName: "Montrose Harbor entrance",
      latitude: 41.963,
      longitude: -87.634,
      distanceM: 1210,
      coordinateSource: "U.S. Coast Guard Light List",
    },
    gridCellStatus: "candidate",
  },
  michigan_city_in: {
    latitude: 41.73,
    longitude: -86.91,
    gridRow: 13,
    gridColumn: 115,
    modelBathymetryM: 7.934386401701683,
    verticalSelection: "surface",
    depthIndex: 0,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "michigan_city_east_pier_light",
      displayName: "Michigan City East Pierhead Light",
      latitude: 41.728,
      longitude: -86.9126,
      distanceM: 310,
      coordinateSource: "U.S. Coast Guard Light List",
    },
    gridCellStatus: "candidate",
  },
  muskegon_mi: {
    latitude: 43.22,
    longitude: -86.34,
    gridRow: 162,
    gridColumn: 172,
    modelBathymetryM: 5.344793646368055,
    verticalSelection: "surface",
    depthIndex: 0,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "muskegon_south_pierhead",
      displayName: "Muskegon South Pierhead Light",
      latitude: 43.226771,
      longitude: -86.337539,
      distanceM: 780,
      coordinateSource: "U.S. Coast Guard Light List",
    },
    gridCellStatus: "candidate",
  },
  whitehall_mi: {
    latitude: 43.38,
    longitude: -86.43,
    gridRow: 178,
    gridColumn: 163,
    modelBathymetryM: 3.292929960135789,
    verticalSelection: "surface",
    depthIndex: 0,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "white_lake_channel_medbery",
      displayName: "White Lake channel at Medbery Park",
      latitude: 43.379,
      longitude: -86.425,
      distanceM: 420,
      coordinateSource: "Michigan Water Trails",
    },
    gridCellStatus: "candidate",
  },
  alpena_mi: {
    latitude: 45.06,
    longitude: -83.42,
    gridRow: 346,
    gridColumn: 464,
    modelBathymetryM: 2.5854971595624217,
    verticalSelection: "surface",
    depthIndex: 0,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: {
      referenceId: "alpena_harbor_light",
      displayName: "Alpena Harbor Light",
      latitude: 45.060342,
      longitude: -83.422999,
      distanceM: 240,
      coordinateSource: "U.S. Coast Guard Light List",
    },
    gridCellStatus: "candidate",
  },
};

const names: Record<PierCastChicagoAlpenaCityId, string> = {
  chicago_il: "Chicago",
  michigan_city_in: "Michigan City",
  muskegon_mi: "Muskegon",
  whitehall_mi: "Whitehall",
  alpena_mi: "Alpena",
};

export const PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES =
  PIER_CAST_CHICAGO_ALPENA_CITY_IDS.map((cityId): PierCastCityProfile => ({
    cityId,
    displayName: names[cityId],
    stateCode: cityId === "chicago_il"
      ? "IL"
      : cityId === "michigan_city_in"
      ? "IN"
      : "MI",
    timezone: cityId === "chicago_il" || cityId === "michigan_city_in"
      ? "America/Chicago"
      : "America/Detroit",
    tentative: true,
    publicEnabled: false,
    waterTemperatureSource: source(cityId, locations[cityId]),
    structures: structures[cityId],
    species: species(cityId),
  }));
