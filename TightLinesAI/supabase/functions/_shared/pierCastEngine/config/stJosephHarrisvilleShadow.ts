/* eslint-disable */
/** GENERATED FILE — DO NOT HAND EDIT.
 * Sources: St. Joseph–Harrisville Pass 1 site boundaries and Pass 2 decisions.
 * Regenerate with npm run generate:pier-cast:st-joseph-harrisville-pass3-config.
 */
import type { PierCastCityId, PierCastCityProfile } from "../types.ts";

export const PIER_CAST_ST_JOSEPH_HARRISVILLE_SCOPE_VERSION =
  "piercast-st-joseph-harrisville-shadow-v1" as const;
export const PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS = [
  "st_joseph_mi",
  "south_haven_mi",
  "holland_mi",
  "lexington_mi",
  "harrisville_mi"
] as const satisfies readonly PierCastCityId[];
export type PierCastStJosephHarrisvilleCityId = (typeof PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS)[number];
export const PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES = [
  {
    "cityId": "st_joseph_mi",
    "displayName": "St. Joseph",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "st_joseph_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 42.12,
        "longitude": -86.5,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 52,
        "gridColumn": 156,
        "modelBathymetryM": 8.135563111894864,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "st_joseph_south_pierhead_light",
          "displayName": "St. Joseph South Pierhead Light",
          "latitude": 42.115275,
          "longitude": -86.494285,
          "distanceM": 706,
          "coordinateSource": "U.S. Coast Guard Light List"
        },
        "gridCellStatus": "candidate"
      },
      "issueCyclesUtc": [
        0,
        6,
        12,
        18
      ],
      "forecastHorizonHours": 120,
      "freshnessLimitHours": 13,
      "fallbackPolicy": "unavailable",
      "validationObservation": null,
      "limitation": "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "south_pier_silver_beach",
        "displayName": "South Pier via Silver Beach",
        "municipality": "City of St. Joseph",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "South Pier via Silver Beach",
          "streetAddress": "Silver Beach County Park north lot, 101 Broad Street, St. Joseph, MI 49085",
          "latitude": 42.115275,
          "longitude": -86.494285,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "STJ_BERRIEN_FISH",
            "authority": "Berrien County Parks",
            "title": "Fishing Access",
            "url": "https://www.berriencounty.org/444/Fishing-Access",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "STJ_SILVER_BEACH",
            "authority": "Berrien County Parks",
            "title": "Silver Beach County Park",
            "url": "https://www.berriencounty.org/1295/Silver-Beach-County-Park",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Approach park dawn-dusk daily, year-round; no overnight parking; May-September vehicle fee $8 county resident/$15 nonresident; $40 annual county permit; walk-in free. Restrooms early May-mid-October; stay off during ice, storms, or high seas. No current construction closure found in reviewed operator sources. USACE pier is outside county park property and has no lifeguards; live barricade status must be checked."
      },
      {
        "structureId": "north_pier_tiscornia",
        "displayName": "North Pier and lighthouse walkway via Tiscornia Beach",
        "municipality": "City of St. Joseph approach",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "North Pier and lighthouse walkway via Tiscornia Beach",
          "streetAddress": "Tiscornia Beach, 80 Ridgeway Street, St. Joseph, MI 49085",
          "latitude": 42.116416,
          "longitude": -86.494542,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "STJ_TISCORNIA",
            "authority": "City of St. Joseph Parks and Recreation",
            "title": "Tiscornia Beach facility details",
            "url": "https://stjosephmi.myrec.com/info/facilities/details.aspx?FacilityID=14703",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "STJ_SILVER_BEACH",
            "authority": "Berrien County Parks",
            "title": "Silver Beach County Park",
            "url": "https://www.berriencounty.org/1295/Silver-Beach-County-Park",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Parking terms are published by the city facility; exact park operating hours were not established from the reviewed page. Restroom and parking operations can be seasonal; dangerous wave and ice conditions supersede access. No current construction closure found in reviewed operator sources. Confirm current parking fee/hours and posted pier status before release."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "walleye",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Connected-river and port-level leads remain insufficient to establish recurring intentional fishing at either covered pierhead. No placeholder score is permitted."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Connected-water occurrence remains separated from the pierheads; no recurring exact-pier magnitude or annual shape was found. No placeholder score is permitted."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The port roadmap creates a seasonal lead, but no resolved St. Joseph Pier/Dock series or exact-pier magnitude supports admission. No placeholder score is permitted."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Generic county 'whitefish' language cannot be converted to round whitefish, and no exact-pier recurring record was found. No placeholder score is permitted."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Generic county 'catfish' and connected-river evidence do not identify channel catfish as a recurring pierhead target. No placeholder score is permitted."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Plausible connected-harbor occurrence remains unallocated to the two covered pierheads. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      }
    ]
  },
  {
    "cityId": "south_haven_mi",
    "displayName": "South Haven",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "south_haven_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 42.4,
        "longitude": -86.29,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 80,
        "gridColumn": 177,
        "modelBathymetryM": 5.038883071746686,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "south_haven_south_pierhead_light",
          "displayName": "South Haven South Pierhead Light",
          "latitude": 42.40135,
          "longitude": -86.287964,
          "distanceM": 225,
          "coordinateSource": "U.S. Coast Guard Light List"
        },
        "gridCellStatus": "candidate"
      },
      "issueCyclesUtc": [
        0,
        6,
        12,
        18
      ],
      "forecastHorizonHours": 120,
      "freshnessLimitHours": 13,
      "fallbackPolicy": "unavailable",
      "validationObservation": null,
      "limitation": "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "south_pier",
        "displayName": "South Pier and lighthouse",
        "municipality": "Federal navigation structure with City of South Haven public approach/control",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "South Pier and lighthouse",
          "streetAddress": "South Beach, 60 Water Street, South Haven, MI 49090",
          "latitude": 42.40135,
          "longitude": -86.287964,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "SOUTH_HAVEN_SAFETY",
            "authority": "South Haven Area Emergency Services Authority",
            "title": "South Haven Beach Safety",
            "url": "https://shaes.org/south-haven-beach-safety/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "SOUTH_HAVEN_FISHING",
            "authority": "South Haven/Van Buren County Convention & Visitors Bureau",
            "title": "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers",
            "url": "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Paid beach parking is reported by local visitor sources; a current authoritative all-season hour schedule was not established. Flag program May 15-September 15; red flag closes beach water and piers; year-round waves/ice can close access. No current construction closure found in reviewed sources. Obtain current city parking/hours page and same-day closure status before release."
      },
      {
        "structureId": "north_pier",
        "displayName": "North Pier",
        "municipality": "Federal navigation structure with City of South Haven public approach/control",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "North Pier",
          "streetAddress": "North Beach, 45 Lakeshore Drive, South Haven, MI 49090",
          "latitude": 42.401897,
          "longitude": -86.288203,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "SOUTH_HAVEN_SAFETY",
            "authority": "South Haven Area Emergency Services Authority",
            "title": "South Haven Beach Safety",
            "url": "https://shaes.org/south-haven-beach-safety/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "SOUTH_HAVEN_FISHING",
            "authority": "South Haven/Van Buren County Convention & Visitors Bureau",
            "title": "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers",
            "url": "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Paid beach parking is reported by local visitor sources; a current authoritative all-season hour schedule was not established. Flag program May 15-September 15; red flag closes beach water and piers; year-round waves/ice can close access. No current construction closure found in reviewed sources. Obtain current city parking/hours page and same-day closure status before release."
      },
      {
        "structureId": "lower_harborwalk",
        "displayName": "Lower Harborwalk channel seawalls",
        "municipality": "City of South Haven public waterfront route",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Lower Harborwalk channel seawalls",
          "streetAddress": "Pier-to-pier Harborwalk; only lower-channel legal seawalls are in scope",
          "latitude": 42.40315,
          "longitude": -86.27618,
          "coordinateSource": "SOUTH_HAVEN_WATER_TRAILS"
        },
        "accessEvidence": [
          {
            "evidenceId": "SOUTH_HAVEN_WATER_TRAILS",
            "authority": "Michigan Water Trails",
            "title": "Harborwalk — City of South Haven",
            "url": "https://www.michiganwatertrails.org/location.asp?aid=1325&ait=av",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "SOUTH_HAVEN_FISHING",
            "authority": "South Haven/Van Buren County Convention & Visitors Bureau",
            "title": "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers",
            "url": "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "No unified fee established for walking route; adjacent parking rules vary. Obey barricades, vessel operations, and posted no-fishing segments. No current systemwide closure found. Pass 3 must map the exact western seawall segments where casting is lawful; do not merge upstream Black River evidence."
      },
      {
        "structureId": "black_river_park_platform",
        "displayName": "Black River Park fishing platform/seawall",
        "municipality": "City of South Haven",
        "disposition": "excluded",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Black River Park fishing platform/seawall",
          "streetAddress": "132 Dunkley Avenue, South Haven, MI 49090",
          "latitude": 42.40888,
          "longitude": -86.2719,
          "coordinateSource": "BLACK_RIVER_PARK"
        },
        "accessEvidence": [
          {
            "evidenceId": "BLACK_RIVER_PARK",
            "authority": "Michigan Water Trails",
            "title": "Black River Park Marina — City of South Haven",
            "url": "https://www.michiganwatertrails.org/trail.asp?aid=199&ait=av",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "SOUTH_HAVEN_FISHING",
            "authority": "South Haven/Van Buren County Convention & Visitors Bureau",
            "title": "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers",
            "url": "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "$7 parking inside launch gate; free parking outside gate; public facilities described by operator source. Marina/restrooms can be seasonal. No current closure identified. About one mile upstream; retained as a separate River structure and cannot supply PierCast pier magnitude."
      },
      {
        "structureId": "shout_park_platform",
        "displayName": "SHOUT Park fishing platform",
        "municipality": "City of South Haven public park",
        "disposition": "excluded",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "SHOUT Park fishing platform",
          "streetAddress": "625 Dunkley Avenue, South Haven, MI 49090",
          "latitude": 42.4097,
          "longitude": -86.272,
          "coordinateSource": "SOUTH_HAVEN_FISHING"
        },
        "accessEvidence": [
          {
            "evidenceId": "SOUTH_HAVEN_FISHING",
            "authority": "South Haven/Van Buren County Convention & Visitors Bureau",
            "title": "Where to Fish in South Haven: 5 Easy-Access Spots for Shore Anglers",
            "url": "https://www.southhaven.org/blog/where-to-fish-in-south-haven-5-easy-access-spots-for-shore-anglers/",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "No current fee or hour restriction found in reviewed source. Posted park rules control. No current closure identified. Upstream Black River setting; not part of the pier report."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Only two positive Pier/Dock catch years, one modern, do not establish a stable recurring annual shape despite the broader agency lead. No placeholder score is permitted."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical positive year and zero modern rows are inadequate for numeric admission. No placeholder score is permitted."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical positive year and zero modern rows are inadequate for numeric admission. No placeholder score is permitted."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      }
    ]
  },
  {
    "cityId": "holland_mi",
    "displayName": "Holland",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "holland_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 42.77,
        "longitude": -86.22,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 117,
        "gridColumn": 184,
        "modelBathymetryM": 7.974799442363687,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "holland_north_breakwater_light",
          "displayName": "Holland North Breakwater Light",
          "latitude": 42.773453,
          "longitude": -86.215814,
          "distanceM": 514,
          "coordinateSource": "U.S. Coast Guard Light List"
        },
        "gridCellStatus": "candidate"
      },
      "issueCyclesUtc": [
        0,
        6,
        12,
        18
      ],
      "forecastHorizonHours": 120,
      "freshnessLimitHours": 13,
      "fallbackPolicy": "unavailable",
      "validationObservation": null,
      "limitation": "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "north_pier",
        "displayName": "Holland Harbor North Pier/breakwater",
        "municipality": "USACE navigation structure",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Holland Harbor North Pier/breakwater",
          "streetAddress": "Holland State Park, 2459 Ottawa Beach Road, Holland, MI 49424",
          "latitude": 42.773453,
          "longitude": -86.215814,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "HOLLAND_DNR_PARK",
            "authority": "Michigan Department of Natural Resources",
            "title": "Holland State Park",
            "url": "https://www.michigan.gov/recsearch/parks/holland",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HOLLAND_TOURISM_FISH",
            "authority": "Holland Area Convention & Visitors Bureau",
            "title": "Boat Launches + Fishing Piers",
            "url": "https://www.holland.org/things-to-do/outdoors/fishing/boat-launches-fishing-piers/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "MI_STATE_PARK_RULES",
            "authority": "Michigan Department of Natural Resources",
            "title": "State parks general rules",
            "url": "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/state-parks-general-rules",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "State-park day-use baseline 8 a.m.-10 p.m.; Recreation Passport required for vehicle entry. Weather, waves, ice, park closures, and posted barricades control. No current closure found in reviewed sources. Confirm same-day pier gate and any park-specific hour change."
      },
      {
        "structureId": "north_channel_walkway",
        "displayName": "North channel walkway",
        "municipality": "Michigan DNR Holland State Park / federal channel edge",
        "disposition": "candidate",
        "accessStatus": "not_live_verified",
        "accessRoute": {
          "displayName": "North channel walkway",
          "streetAddress": "Channel-side walkway from Holland State Park to North Pier",
          "latitude": 42.7733,
          "longitude": -86.212718,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "HOLLAND_DNR_PARK",
            "authority": "Michigan Department of Natural Resources",
            "title": "Holland State Park",
            "url": "https://www.michigan.gov/recsearch/parks/holland",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "MI_STATE_PARK_RULES",
            "authority": "Michigan Department of Natural Resources",
            "title": "State parks general rules",
            "url": "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/state-parks-general-rules",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "State-park day-use baseline 8 a.m.-10 p.m.; Recreation Passport required for vehicle entry. Park/weather/ice restrictions apply. No current closure found. Keep Lake Macatawa boardwalk fishing separate from this Lake Michigan channel subarea."
      },
      {
        "structureId": "south_pier_big_red",
        "displayName": "South Pier / Big Red route",
        "municipality": "Federal navigation/light structure",
        "disposition": "excluded",
        "accessStatus": "route_unverified",
        "accessRoute": null,
        "accessEvidence": [
          {
            "evidenceId": "HOLLAND_BIG_RED",
            "authority": "Holland Harbor Lighthouse Historical Commission",
            "title": "Big Red Lighthouse",
            "url": "https://bigredlighthouse.com/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Not applicable because no lawful public pedestrian route was established. Not applicable. No access pending a formally published public route. A future official route may change this disposition; reverify independently before any inclusion."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Two isolated positive years do not establish current recurrence or a defensible annual shape. No placeholder score is permitted."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One positive Catch year and Lake Macatawa context cannot establish a recurring north-pier/channel target. No placeholder score is permitted."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Sparse port rows and Lake Macatawa targeting remain insufficiently allocated to the covered north-pier/channel boundary. No placeholder score is permitted."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The reviewed Pier/Dock strata are zero and the credible lead belongs primarily to Lake Macatawa rather than the covered Lake Michigan structure. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: A single high 2020 event is preserved, but one year cannot support recurrence or a complete annual shape. No placeholder score is permitted."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One positive Catch year is insufficient for numeric admission. No placeholder score is permitted."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      }
    ]
  },
  {
    "cityId": "lexington_mi",
    "displayName": "Lexington",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "lexington_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 43.27,
        "longitude": -82.52,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 167,
        "gridColumn": 554,
        "modelBathymetryM": 2.3938175035609333,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "lexington_east_breakwater_light",
          "displayName": "Lexington East Breakwater Light 2",
          "latitude": 43.26662,
          "longitude": -82.522849,
          "distanceM": 441,
          "coordinateSource": "U.S. Coast Guard Light List"
        },
        "gridCellStatus": "candidate"
      },
      "issueCyclesUtc": [
        0,
        6,
        12,
        18
      ],
      "forecastHorizonHours": 120,
      "freshnessLimitHours": 13,
      "fallbackPolicy": "unavailable",
      "validationObservation": null,
      "limitation": "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "east_breakwater",
        "displayName": "Lexington Harbor East Breakwater",
        "municipality": "USACE/Michigan DNR state-harbor project",
        "disposition": "unresolved",
        "accessStatus": "reported_closed",
        "accessRoute": {
          "displayName": "Lexington Harbor East Breakwater",
          "streetAddress": "Lexington State Harbor, 7411 Huron Bay Boulevard, Lexington, MI 48450",
          "latitude": 43.26662,
          "longitude": -82.522849,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "LEX_STATE_HARBOR",
            "authority": "Michigan Economic Development Corporation / Michigan DNR listing",
            "title": "Lexington State Harbor",
            "url": "https://www.michigan.org/property/lexington-state-harbor",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "LEX_CLOSURE_2026",
            "authority": "Michigan Department of Natural Resources",
            "title": "Planned upgrades and closures at Lexington State Harbor",
            "url": "https://content.govdelivery.com/accounts/MIDNR/bulletins/400b750",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "LEX_VILLAGE",
            "authority": "Village of Lexington",
            "title": "Beach Access & Marina",
            "url": "https://villageoflexington.com/visit/things-to-do/beach-access-marina/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "MI_HARBOR_RULES",
            "authority": "Michigan Department of Natural Resources",
            "title": "Harbors — general rules",
            "url": "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/harbor-general-rules",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "reported_closed",
        "limitation": "Normal harbor season/hours are superseded by construction closure. Active construction; state-harbor fishing prohibited unless otherwise posted. In-water replacement closure through 2027-05-28; later intermittent 2027 work expected. Direct DNR confirmation and post-construction signage inspection required."
      },
      {
        "structureId": "west_breakwater",
        "displayName": "Lexington Harbor West Breakwater",
        "municipality": "USACE/Michigan DNR state-harbor project",
        "disposition": "unresolved",
        "accessStatus": "reported_closed",
        "accessRoute": {
          "displayName": "Lexington Harbor West Breakwater",
          "streetAddress": "Lexington State Harbor/Tierney Park waterfront",
          "latitude": 43.267459,
          "longitude": -82.523549,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "LEX_CLOSURE_2026",
            "authority": "Michigan Department of Natural Resources",
            "title": "Planned upgrades and closures at Lexington State Harbor",
            "url": "https://content.govdelivery.com/accounts/MIDNR/bulletins/400b750",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "LEX_VILLAGE",
            "authority": "Village of Lexington",
            "title": "Beach Access & Marina",
            "url": "https://villageoflexington.com/visit/things-to-do/beach-access-marina/",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "MI_HARBOR_RULES",
            "authority": "Michigan Department of Natural Resources",
            "title": "Harbors — general rules",
            "url": "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/harbor-general-rules",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "reported_closed",
        "limitation": "Normal harbor season/hours are superseded by construction closure. Active construction; state-harbor fishing prohibited unless otherwise posted. In-water replacement closure through 2027-05-28; later intermittent 2027 work expected. Confirm whether Tierney Park supplies a lawful route and which breakwater surface permits fishing."
      },
      {
        "structureId": "marina_edges_docks",
        "displayName": "State-harbor marina edges and docks",
        "municipality": "Michigan DNR state harbor",
        "disposition": "excluded",
        "accessStatus": "reported_closed",
        "accessRoute": {
          "displayName": "State-harbor marina edges and docks",
          "streetAddress": "7411 Huron Bay Boulevard, Lexington, MI 48450",
          "latitude": 43.263889,
          "longitude": -82.516667,
          "coordinateSource": "LEX_STATE_HARBOR"
        },
        "accessEvidence": [
          {
            "evidenceId": "LEX_STATE_HARBOR",
            "authority": "Michigan Economic Development Corporation / Michigan DNR listing",
            "title": "Lexington State Harbor",
            "url": "https://www.michigan.org/property/lexington-state-harbor",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "LEX_CLOSURE_2026",
            "authority": "Michigan Department of Natural Resources",
            "title": "Planned upgrades and closures at Lexington State Harbor",
            "url": "https://content.govdelivery.com/accounts/MIDNR/bulletins/400b750",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "MI_HARBOR_RULES",
            "authority": "Michigan Department of Natural Resources",
            "title": "Harbors — general rules",
            "url": "https://www.michigan.gov/dnr/faqs/state-parks-and-camping/harbor-general-rules",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "reported_closed",
        "limitation": "Closed during project period. Construction and normal marina operations. Full marina closure through 2027-05-28. Do not infer fishing permission from creel rows, fish-cleaning infrastructure, or historical angling."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current roadmap does not establish a Lexington lake-whitefish target and all 42 enumerated Pier/Dock Catch strata are zero. No placeholder score is permitted."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One positive year followed by recent zeros is insufficient for recurring intentional opportunity. No placeholder score is permitted."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      }
    ]
  },
  {
    "cityId": "harrisville_mi",
    "displayName": "Harrisville",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "harrisville_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 44.66,
        "longitude": -83.28,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 306,
        "gridColumn": 478,
        "modelBathymetryM": 3.8277593190159034,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "harrisville_east_breakwater_light",
          "displayName": "Harrisville East Breakwater Light 3",
          "latitude": 44.661398,
          "longitude": -83.281813,
          "distanceM": 211,
          "coordinateSource": "U.S. Coast Guard Light List"
        },
        "gridCellStatus": "candidate"
      },
      "issueCyclesUtc": [
        0,
        6,
        12,
        18
      ],
      "forecastHorizonHours": 120,
      "freshnessLimitHours": 13,
      "fallbackPolicy": "unavailable",
      "validationObservation": null,
      "limitation": "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "unoccupied_marina_docks",
        "displayName": "Designated unoccupied marina docks",
        "municipality": "City of Harrisville municipal marina",
        "disposition": "candidate",
        "accessStatus": "not_live_verified",
        "accessRoute": {
          "displayName": "Designated unoccupied marina docks",
          "streetAddress": "Harrisville Harbor, 1 E Harbor Lane, Harrisville, MI 48740",
          "latitude": 44.661944,
          "longitude": -83.280556,
          "coordinateSource": "HARRISVILLE_HARBOR_GUIDE"
        },
        "accessEvidence": [
          {
            "evidenceId": "HARRISVILLE_LHCFAC_2025",
            "authority": "Michigan Department of Natural Resources, Lake Huron Citizens Fishery Advisory Committee",
            "title": "Minutes — October 7, 2025",
            "url": "https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/Minutes/minutes-oct-7-2025.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_REC_PLAN",
            "authority": "City of Harrisville",
            "title": "2024-2028 Recreation Plan",
            "url": "https://harrisvillemi.org/wp-content/uploads/2025/11/2024-2028-City-of-Harrisville-Recreation-Plan.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_HARBOR_RULES",
            "authority": "Harrisville Harbor",
            "title": "Harbor Rules and Regulations — 2023",
            "url": "https://static1.squarespace.com/static/65a7feef98027526cf6a1aea/t/6647759ea8d23a77608e1620/1715959198588/HARBOR-RULES-2023.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_HARBOR_GUIDE",
            "authority": "Michigan Department of Natural Resources",
            "title": "Michigan State Harbors Guide — Harrisville Municipal Marina",
            "url": "https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/PRD/Waterways/HarborGuidePDF.pdf?rev=021f6269262f4455b29cb5ace0871b41",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Normal marina operation mid-May to mid-October; no source established year-round dock access or an angler fee. Occupied slips, vessel movements, ice, and off-season dock configuration control access. No current project closure found. Obtain current designated-area map and off-season policy; marina season is not proof of year-round dock access."
      },
      {
        "structureId": "east_breakwater",
        "displayName": "Harrisville East Breakwater",
        "municipality": "Federal/municipal harbor structure",
        "disposition": "unresolved",
        "accessStatus": "route_unverified",
        "accessRoute": null,
        "accessEvidence": [
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_HARBOR_RULES",
            "authority": "Harrisville Harbor",
            "title": "Harbor Rules and Regulations — 2023",
            "url": "https://static1.squarespace.com/static/65a7feef98027526cf6a1aea/t/6647759ea8d23a77608e1620/1715959198588/HARBOR-RULES-2023.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_REC_PLAN",
            "authority": "City of Harrisville",
            "title": "2024-2028 Recreation Plan",
            "url": "https://harrisvillemi.org/wp-content/uploads/2025/11/2024-2028-City-of-Harrisville-Recreation-Plan.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Unknown for pedestrian fishing. Navigation and weather hazards apply. No current closure found, but absence of a closure is not proof of access. Direct municipal/USACE route and surface permission required."
      },
      {
        "structureId": "west_breakwater_and_harbor_edge",
        "displayName": "Harrisville West Breakwater and other harbor-edge fishing areas",
        "municipality": "Federal/City of Harrisville harbor property",
        "disposition": "unresolved",
        "accessStatus": "not_live_verified",
        "accessRoute": {
          "displayName": "Harrisville West Breakwater and other harbor-edge fishing areas",
          "streetAddress": "Outer and inner Harrisville Harbor",
          "latitude": 44.660787,
          "longitude": -83.283258,
          "coordinateSource": "USCG_LIGHT_LIST_2025"
        },
        "accessEvidence": [
          {
            "evidenceId": "USCG_LIGHT_LIST_2025",
            "authority": "United States Coast Guard Navigation Center",
            "title": "Light List Volume VII, Great Lakes",
            "url": "https://www.navcen.uscg.gov/sites/default/files/pdf/lightLists/LightList_V7_2025.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_REC_PLAN",
            "authority": "City of Harrisville",
            "title": "2024-2028 Recreation Plan",
            "url": "https://harrisvillemi.org/wp-content/uploads/2025/11/2024-2028-City-of-Harrisville-Recreation-Plan.pdf",
            "reviewedAt": "2026-09-19"
          },
          {
            "evidenceId": "HARRISVILLE_HARBOR_RULES",
            "authority": "Harrisville Harbor",
            "title": "Harbor Rules and Regulations — 2023",
            "url": "https://static1.squarespace.com/static/65a7feef98027526cf6a1aea/t/6647759ea8d23a77608e1620/1715959198588/HARBOR-RULES-2023.pdf",
            "reviewedAt": "2026-09-19"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Unknown outside normal marina operations. Navigation, weather, ice, occupancy, and posted restrictions apply. No current closure found. Map the designated harbor-edge segments independently; do not transfer dock permission to the breakwater."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current advisory calls the broader summer/boat fishery very good, but neither the roadmap nor advisory allocates recurring lake-trout catch to the covered docks or harbor edge. No placeholder score is permitted."
      },
      {
        "speciesId": "walleye",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical Pier/Dock positive and mixed-mode current port evidence are not enough to allocate recurring magnitude to covered dock fishing. No placeholder score is permitted."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical positive Pier/Dock year provides a lead but not recurrence or a defensible seasonal shape. No placeholder score is permitted."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: Pass 2 reopened this cell and found no new covered-structure evidence sufficient to change the Pass 1 exclusion. The reviewed record did not establish recurring intentional opportunity at the covered structure. This is an evidence disposition, not biological absence."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      }
    ]
  }
] as const satisfies readonly PierCastCityProfile[];
