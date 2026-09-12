import type {
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastSpeciesId,
  PierCastSpeciesInheritance,
  PierCastStructure,
} from "../types.ts";
import {
  getPierCastCoreSeasonalCurve,
  PIER_CAST_CITY_TEMPERATURE_SOURCES,
} from "./coreCalibration.ts";

import { PIER_CAST_REMAINING_SPECIES_REVIEW } from "./remainingSpecies.generated.ts";

function species(
  speciesId: PierCastSpeciesId,
  inheritance: PierCastSpeciesInheritance,
  limitation: string | null = null,
  seasonalOpportunityCurve:
    PierCastCitySpeciesProfile["seasonalOpportunityCurve"] = null,
): PierCastCitySpeciesProfile {
  return {
    speciesId,
    inheritance,
    seasonalOpportunityCurve,
    ratingEnabled: false,
    limitation,
  };
}

const reviewedSpecies = (
  cityId: PierCastCityProfile["cityId"],
): PierCastCitySpeciesProfile[] =>
  PIER_CAST_REMAINING_SPECIES_REVIEW.filter((row) => row.cityId === cityId).map(
    (row) =>
      species(
        row.speciesId,
        row.classification === "narrow_season_structure_specific"
          ? "conditional"
          : row.classification === "historical_unresolved"
          ? "historical_lead"
          : "unresolved",
        `${row.classification}: ${row.limitation}`,
      ),
  );

const structure = (value: PierCastStructure): PierCastStructure => value;

const coreSpecies = (
  cityId: PierCastCityProfile["cityId"],
  speciesId: PierCastSpeciesId,
  inheritance: PierCastSpeciesInheritance,
  limitation: string | null = null,
) =>
  species(
    speciesId,
    inheritance,
    limitation,
    getPierCastCoreSeasonalCurve(cityId, speciesId),
  );

export const PIER_CAST_CITY_PROFILES: readonly PierCastCityProfile[] = [
  {
    cityId: "ludington_mi",
    displayName: "Ludington",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.ludington_mi,
    structures: [
      structure({
        structureId: "ludington_north_breakwater",
        displayName: "North Breakwater",
        municipality: "Ludington",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Stearns Park public beach path",
          streetAddress: "950 W Ludington Ave, Ludington, MI 49431",
          latitude: 43.9554914532683,
          longitude: -86.4602797427137,
          coordinateSource: "City of Ludington facility-map pin",
        },
        accessEvidence: [
          {
            evidenceId: "access_ludington_stearns_facility_2026_09_11",
            authority: "City of Ludington",
            title: "Stearns Park facility page",
            url:
              "https://www.ludington.mi.us/facilities/facility/details/Stearns-Park-West-End-of-Ludington-Ave-15",
            reviewedAt: "2026-09-11",
          },
          {
            evidenceId: "access_ludington_north_breakwall_fishing_plan",
            authority: "City of Ludington",
            title: "Greater Ludington Area Waterfront Master Plan",
            url: "https://www.ludington.mi.us/DocumentCenter/View/187",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "Published city materials establish the Stearns Park route and fishing access; temporary closures, weather, ice, waves, and on-site restrictions still control.",
      }),
      structure({
        structureId: "ludington_stub_pier",
        displayName: "Stub Pier",
        municipality: "Ludington",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        accessRoute: null,
        accessEvidence: [],
        liveAccessStatus: "not_live_checked",
        limitation:
          "The DNR alias has not been mapped to a verified structure and route.",
      }),
      structure({
        structureId: "ludington_south_breakwater",
        displayName: "South Breakwater",
        municipality: "Ludington",
        disposition: "excluded",
        accessStatus: "route_unverified",
        accessRoute: null,
        accessEvidence: [],
        liveAccessStatus: "not_live_checked",
        limitation: "Public route and fishing access remain unverified.",
      }),
    ],
    species: [
      coreSpecies("ludington_mi", "chinook_salmon", "candidate"),
      coreSpecies("ludington_mi", "coho_salmon", "candidate"),
      coreSpecies("ludington_mi", "steelhead", "candidate"),
      coreSpecies("ludington_mi", "brown_trout", "candidate"),
      ...reviewedSpecies("ludington_mi"),
    ],
  },
  {
    cityId: "grand_haven_mi",
    displayName: "Grand Haven",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.grand_haven_mi,
    structures: [
      structure({
        structureId: "grand_haven_south_pier",
        displayName: "South Pier",
        municipality: "Grand Haven",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Grand Haven State Park",
          streetAddress: "1001 S Harbor Dr, Grand Haven, MI 49417",
          latitude: 43.05618,
          longitude: -86.24778,
          coordinateSource: "Michigan Water Trails state-park access record",
        },
        accessEvidence: [
          {
            evidenceId: "access_grand_haven_state_park_2026_09_11",
            authority: "Michigan Department of Natural Resources",
            title: "Grand Haven State Park",
            url: "https://www.michigan.gov/recsearch/parks/grandhaven",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "The state park identifies the adjacent South Pier and boardwalk as an angling destination; park hours, construction, waves, ice, and on-site restrictions still control.",
      }),
      structure({
        structureId: "grand_haven_north_pier",
        displayName: "North Pier / Fisherman's Pier",
        municipality: "Grand Haven",
        disposition: "excluded",
        accessStatus: "reported_closed",
        accessRoute: null,
        accessEvidence: [
          {
            evidenceId: "access_grand_haven_north_closure_2026_07",
            authority: "Grand Haven Area Convention & Visitors Bureau",
            title: "North Pier closure update",
            url: "https://visitgrandhaven.com/listings/north-pier/",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "reported_closed",
        limitation:
          "Reported closed during major construction; no automatic 2028 activation.",
      }),
    ],
    species: [
      coreSpecies("grand_haven_mi", "chinook_salmon", "candidate"),
      coreSpecies("grand_haven_mi", "coho_salmon", "candidate"),
      coreSpecies("grand_haven_mi", "steelhead", "candidate"),
      coreSpecies("grand_haven_mi", "brown_trout", "candidate"),
      ...reviewedSpecies("grand_haven_mi"),
    ],
  },
  {
    cityId: "manistee_mi",
    displayName: "Manistee",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.manistee_mi,
    structures: [
      structure({
        structureId: "manistee_north_pier",
        displayName: "North Pier",
        municipality: "Manistee",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Fifth Avenue Beach",
          streetAddress: "108 Lakeshore Dr, Manistee, MI 49660",
          latitude: 44.2511033726207,
          longitude: -86.3400998006586,
          coordinateSource: "City of Manistee facility-map pin",
        },
        accessEvidence: [
          {
            evidenceId: "access_manistee_fifth_avenue_2026_09_11",
            authority: "City of Manistee",
            title: "Fifth Avenue Beach facility page",
            url:
              "https://www.manisteemi.gov/facilities/facility/details/Fifth-Avenue-Beach-4",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "The city explicitly permits pedestrian traffic and fishing on the North Pier; construction, temporary closures, waves, ice, and on-site restrictions still control.",
      }),
      structure({
        structureId: "manistee_south_breakwater",
        displayName: "South Breakwater",
        municipality: "Manistee",
        disposition: "excluded",
        accessStatus: "reported_closed",
        accessRoute: null,
        accessEvidence: [
          {
            evidenceId: "access_manistee_south_connector_closure_2026_04_17",
            authority: "U.S. Army Corps of Engineers, Detroit District",
            title: "Manistee channel improvements notice",
            url:
              "https://www.lrd.usace.army.mil/News/News-Releases/Article/4462972/corps-of-engineers-begins-channel-improvements-in-manistee/",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "reported_closed",
        limitation:
          "Connector closure has no authoritative reopening confirmation.",
      }),
      structure({
        structureId: "manistee_stub_pier",
        displayName: "South-side Stub Pier",
        municipality: "Manistee",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        accessRoute: null,
        accessEvidence: [],
        liveAccessStatus: "not_live_checked",
        limitation: "Alias, entrance, and fishing boundary require mapping.",
      }),
    ],
    species: [
      coreSpecies("manistee_mi", "chinook_salmon", "candidate"),
      coreSpecies("manistee_mi", "coho_salmon", "candidate"),
      coreSpecies("manistee_mi", "steelhead", "candidate"),
      coreSpecies("manistee_mi", "brown_trout", "candidate"),
      ...reviewedSpecies("manistee_mi"),
    ],
  },
  {
    cityId: "frankfort_elberta_mi",
    displayName: "Frankfort",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource:
      PIER_CAST_CITY_TEMPERATURE_SOURCES.frankfort_elberta_mi,
    structures: [
      structure({
        structureId: "frankfort_north_breakwater",
        displayName: "Frankfort North Breakwater",
        municipality: "Frankfort",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Lake Michigan Beach at Father Marquette Circle",
          streetAddress: "End of Main St, Frankfort, MI 49635",
          latitude: 44.63204547,
          longitude: -86.24476064,
          coordinateSource: "M-22 Pure Michigan Byway destination record",
        },
        accessEvidence: [
          {
            evidenceId: "access_frankfort_public_beach_pier_sidewalk",
            authority: "City of Frankfort",
            title: "Lake Michigan Beach public beachfront packet",
            url:
              "https://cms3.revize.com/revize/frankfortmi/9-27-21%20Lake%20MI%20Beach%20Packet.pdf",
            reviewedAt: "2026-09-11",
          },
          {
            evidenceId: "access_frankfort_m22_byway_2026_09_11",
            authority: "M-22 Pure Michigan Byway",
            title: "Lake Michigan Beach in Frankfort",
            url: "https://www.m22byway.org/lake-michigan-beach-frankfort",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "Municipal and state-byway materials establish the public beachfront, pier sidewalk, fishing use, and dawn-to-dusk route; temporary closures and on-site restrictions still control.",
      }),
      structure({
        structureId: "elberta_south_breakwater",
        displayName: "Elberta South Breakwater",
        municipality: "Elberta",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Elberta Beach parking area via Bye Road",
          streetAddress: "Bye Road, Elberta, MI 49628",
          latitude: 44.62625025,
          longitude: -86.24244564,
          coordinateSource: "M-22 Pure Michigan Byway destination record",
        },
        accessEvidence: [
          {
            evidenceId: "access_elberta_beach_2026_09_11",
            authority: "Village of Elberta",
            title: "Elberta Beach and Betsie Bay Waterfront",
            url:
              "https://villageofelberta.com/parks-and-recreation-elberta-beach-and-waterfront/",
            reviewedAt: "2026-09-11",
          },
          {
            evidenceId: "access_elberta_m22_byway_2026_09_11",
            authority: "M-22 Pure Michigan Byway",
            title: "Elberta Beach at Lake Michigan",
            url: "https://www.m22byway.org/elberta-beach-lake-michigan",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "The Village publishes the Bye Road public route and says pier access is at the visitor's own risk; the byway record identifies pier fishing and dawn-to-dusk hours. Temporary closures and on-site restrictions still control.",
      }),
    ],
    species: [
      coreSpecies(
        "frankfort_elberta_mi",
        "chinook_salmon",
        "candidate",
        "Michigan DNR Pier/Dock estimates and direct breakwall reports establish shore reachability; the provisional magnitude remains subject to outcome validation.",
      ),
      coreSpecies("frankfort_elberta_mi", "coho_salmon", "candidate"),
      coreSpecies("frankfort_elberta_mi", "steelhead", "candidate"),
      coreSpecies("frankfort_elberta_mi", "brown_trout", "candidate"),
      ...reviewedSpecies("frankfort_elberta_mi"),
    ],
  },
  {
    cityId: "sheboygan_wi",
    displayName: "Sheboygan",
    stateCode: "WI",
    timezone: "America/Chicago",
    tentative: true,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.sheboygan_wi,
    structures: [
      structure({
        structureId: "sheboygan_north_pier",
        displayName: "North Pier",
        municipality: "Sheboygan",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "Deland Park",
          streetAddress: "715 Broughton Dr, Sheboygan, WI 53081",
          latitude: 43.7521094427185,
          longitude: -87.7037831990455,
          coordinateSource: "City of Sheboygan facility-map pin",
        },
        accessEvidence: [
          {
            evidenceId: "access_sheboygan_north_deland_2026_09_11",
            authority: "City of Sheboygan",
            title: "Deland Park facility page",
            url:
              "https://www.sheboyganwi.gov/Facilities/Facility/Details/Deland-Park-8",
            reviewedAt: "2026-09-11",
          },
          {
            evidenceId: "access_sheboygan_piers_wdnr_2026_09_11",
            authority: "Wisconsin Department of Natural Resources",
            title: "Accessible fishing on Lake Michigan and its tributaries",
            url:
              "https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "City and Wisconsin DNR materials establish the Deland Park route and fishing use; temporary closures, waves, ice, and on-site restrictions still control.",
      }),
      structure({
        structureId: "sheboygan_south_pier",
        displayName: "South Pier",
        municipality: "Sheboygan",
        disposition: "candidate",
        accessStatus: "open_by_published_rules",
        accessRoute: {
          displayName: "South Pier Turnaround",
          streetAddress: "226 South Pier Dr, Sheboygan, WI 53081",
          latitude: 43.7482052405373,
          longitude: -87.7040245790135,
          coordinateSource: "City of Sheboygan facility-map pin",
        },
        accessEvidence: [
          {
            evidenceId: "access_sheboygan_south_turnaround_2026_09_11",
            authority: "City of Sheboygan",
            title: "South Pier Turnaround facility page",
            url:
              "https://www.sheboyganwi.gov/Facilities/Facility/Details/South-Pier-Turnaround-62",
            reviewedAt: "2026-09-11",
          },
          {
            evidenceId: "access_sheboygan_piers_wdnr_2026_09_11",
            authority: "Wisconsin Department of Natural Resources",
            title: "Accessible fishing on Lake Michigan and its tributaries",
            url:
              "https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan",
            reviewedAt: "2026-09-11",
          },
        ],
        liveAccessStatus: "not_live_checked",
        limitation:
          "The city explicitly identifies the public turnaround as access for pier walking and fishing; temporary closures, waves, ice, and on-site restrictions still control.",
      }),
    ],
    species: [
      coreSpecies("sheboygan_wi", "chinook_salmon", "candidate"),
      coreSpecies(
        "sheboygan_wi",
        "coho_salmon",
        "candidate",
        "Current local relevance plus repeated structure-specific historical records support the frozen provisional curve; contemporary Sheboygan-only monthly effort remains unavailable and is handled by the validation confidence gate.",
      ),
      coreSpecies("sheboygan_wi", "steelhead", "candidate"),
      coreSpecies("sheboygan_wi", "brown_trout", "candidate"),
      ...reviewedSpecies("sheboygan_wi"),
    ],
  },
] as const;

export function getPierCastCityProfile(
  cityId: PierCastCityProfile["cityId"],
): PierCastCityProfile | null {
  return PIER_CAST_CITY_PROFILES.find((city) => city.cityId === cityId) ?? null;
}
