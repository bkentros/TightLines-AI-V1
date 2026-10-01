/* eslint-disable */
/** GENERATED FILE — DO NOT HAND EDIT.
 * Sources: Pentwater–Caseville Pass 1 boundaries and corrected Pass 2 decisions.
 * Regenerate with npm run generate:pier-cast:pentwater-caseville-pass3-config.
 */
import type { PierCastCityId, PierCastCityProfile } from "../types.ts";

export const PIER_CAST_PENTWATER_CASEVILLE_SCOPE_VERSION =
  "piercast-pentwater-caseville-shadow-v1" as const;
export const PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS = [
  "pentwater_mi",
  "rogers_city_mi",
  "tawas_city_mi",
  "charlevoix_mi",
  "caseville_mi"
] as const satisfies readonly PierCastCityId[];
export type PierCastPentwaterCasevilleCityId = (typeof PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS)[number];
export const PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES = [
  {
    "cityId": "pentwater_mi",
    "displayName": "Pentwater",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "pentwater_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 43.78,
        "longitude": -86.45,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 218,
        "gridColumn": 161,
        "modelBathymetryM": 6.438171178218563,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "north_navigation_pier",
          "displayName": "Pentwater north navigation pier",
          "latitude": 43.782329,
          "longitude": -86.443616,
          "distanceM": 574,
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
      "limitation": "One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. Pentwater Lake, channel exchange, river-plume mixing, protected water, and open Lake Michigan can differ materially. The model does not establish depth-specific temperature, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "mears_accessible_fishing_pier",
        "displayName": "Charles Mears State Park accessible fishing pier",
        "municipality": "Village of Pentwater",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Charles Mears State Park accessible fishing pier",
          "streetAddress": "400 W Lowell Street, Pentwater, MI 49449",
          "latitude": 43.7823,
          "longitude": -86.4432,
          "coordinateSource": "MEARS_PARK"
        },
        "accessEvidence": [
          {
            "evidenceId": "MEARS_PARK",
            "authority": "Michigan DNR",
            "title": "Charles Mears State Park",
            "url": "https://www.michigan.gov/recsearch/parks/mears",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "PENTWATER_PARKS",
            "authority": "Village of Pentwater",
            "title": "Parks and Trails",
            "url": "https://pentwatervillage.org/parks-and-trails.php",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Public accessible fishing pier; DNR programs explicitly use it for fishing. Published access only; verify same-day waves, ice, gates, and barricades. Hours: Park day-use and posted hours control. Fees: Recreation Passport required for motor-vehicle entry; walk-in terms may differ. Lake Michigan waves, ice, structural currents, seasonal services, and closures. No current project closure found; 2026 USCG aid notice did not establish a pedestrian closure. Retained as a separate facility record because the reviewed DNR page does not prove that every part is coextensive with the federal north pier."
      },
      {
        "structureId": "north_navigation_pier",
        "displayName": "Pentwater north navigation pier",
        "municipality": "Village of Pentwater",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Pentwater north navigation pier",
          "streetAddress": "200 Channel Lane, Pentwater, MI 49449",
          "latitude": 43.782329,
          "longitude": -86.443616,
          "coordinateSource": "USCG_LIGHT_LIST"
        },
        "accessEvidence": [
          {
            "evidenceId": "PENTWATER_PARKS",
            "authority": "Village of Pentwater",
            "title": "Parks and Trails",
            "url": "https://pentwatervillage.org/parks-and-trails.php",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "PENTWATER_USACE",
            "authority": "U.S. Army Corps of Engineers Detroit District",
            "title": "Pentwater Harbor, Michigan",
            "url": "https://www.lrd.usace.army.mil/Missions/Projects/Article/3643348/pentwater-harbor-michigan/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Village sources document handicap-accessible north-pier walkway approaches. Published route only; verify current barriers and surface condition. Hours: Posted village/park rules control. Fees: No walking fee identified; state-park vehicle route requires a Recreation Passport. Weather, waves, ice, structural currents, and barricades. No current pedestrian closure found; 2026 notice concerned the light/sound signal. Confirm the current connection between the Mears accessible facility and the full federal pier surface."
      },
      {
        "structureId": "south_navigation_pier",
        "displayName": "Pentwater south navigation pier",
        "municipality": "Village of Pentwater",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Pentwater south navigation pier",
          "streetAddress": "Chester Street at the Pentwater channel, Pentwater, MI 49449",
          "latitude": 43.781548,
          "longitude": -86.444145,
          "coordinateSource": "USCG_LIGHT_LIST"
        },
        "accessEvidence": [
          {
            "evidenceId": "PENTWATER_PARKS",
            "authority": "Village of Pentwater",
            "title": "Parks and Trails",
            "url": "https://pentwatervillage.org/parks-and-trails.php",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "PENTWATER_USACE",
            "authority": "U.S. Army Corps of Engineers Detroit District",
            "title": "Pentwater Harbor, Michigan",
            "url": "https://www.lrd.usace.army.mil/Missions/Projects/Article/3643348/pentwater-harbor-michigan/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Village source says Chester Street Park provides full access to the south-pier walkway. Published route only; verify current barriers and surface condition. Hours: Posted village/park rules control. Fees: No pedestrian fee identified. Weather, waves, ice, structural currents, and barricades. No current project closure found. Same-day physical condition and the exact legal casting surface still require confirmation."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Ten positive Pier/Dock catch years, including modern positives, establish recurring spring and staging opportunity. The measured record places Pentwater above Michigan City/Kenosha but below Grand Haven."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Nine positive catch years and five modern positive strata establish recurring spring and fall opportunity. Magnitude supports the Manitowoc-to-Whitehall range rather than the elite southern spring cohort."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Fourteen positive catch years across spring, summer, and fall establish a strong multi-window fishery between Ludington and Michigan City."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Twelve positive catch years with modern recurrence establish a strong cold-season and harbor fishery at the Racine/Kewaunee tier."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Only one positive catch year was resolved; stocking and one measured occurrence do not establish recurrence. No placeholder score is permitted."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Three positive years establish limited recurring opportunity. Low measured magnitude keeps the peak between South Haven and the Frankfort/Holland tier; county stocking does not raise it."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Eight positive years and very strong modern matched-effort magnitude establish a strong channel fishery above Whitehall and below Muskegon."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Four positive years plus exact-channel reports establish recurring warm-season targeting. Episodic magnitude supports a middle placement below Chicago/Whitehall."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Seven positive years and exceptionally high measured catch magnitude establish an excellent recurring fishery above the 7.6 cohort but below Whitehall."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One high 2012 catch stratum is exact but does not establish recurring annual opportunity. No placeholder score is permitted."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical positive year does not establish recurrence or a full-year shape. No placeholder score is permitted."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Exact-channel reporting creates a lead, but the reviewed Pier/Dock catch series contains no positive catch row. No placeholder score is permitted."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Two low positive years are insufficient to establish recurring intentional targeting. No placeholder score is permitted."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The positive Pier/Dock record is confined to one year and regional stocking cannot fill the recurrence gap. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: Bluegill is explicitly outside the user-facing PierCast catalog. Biological records were not converted into a target."
      }
    ]
  },
  {
    "cityId": "rogers_city_mi",
    "displayName": "Rogers City",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "rogers_city_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 45.42,
        "longitude": -83.8,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 382,
        "gridColumn": 426,
        "modelBathymetryM": 3.2471046795913714,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "outer_breakwall_light_8_side",
          "displayName": "Rogers City outer breakwall ending at Harbor Channel Light 8",
          "latitude": 45.422917,
          "longitude": -83.809222,
          "distanceM": 789,
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
      "limitation": "One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. The selected lakeward cell does not resolve municipal-harbor protection or breakwall-scale mixing. The model does not establish depth-specific temperature, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "outer_breakwall_light_8_side",
        "displayName": "Rogers City outer breakwall ending at Harbor Channel Light 8",
        "municipality": "City of Rogers City",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Rogers City outer breakwall ending at Harbor Channel Light 8",
          "streetAddress": "Rogers City Marina, 270 N Lake Street, Rogers City, MI 49779",
          "latitude": 45.422917,
          "longitude": -83.809222,
          "coordinateSource": "USCG_LIGHT_LIST"
        },
        "accessEvidence": [
          {
            "evidenceId": "ROGERS_ORD",
            "authority": "City of Rogers City",
            "title": "Code of Ordinances, section 8-36",
            "url": "https://www.rogerscity.com/uploads/5/3/7/7/53772309/rogers_city_code_of_ordinances__2014__final.pdf",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Fishing permitted on outer breakwalls at any time of year by ordinance. Subject to weather, events, construction, and posted harbormaster controls. Hours: Ordinance states any time of year; live signs still control. Fees: No angler fee identified. Unsafe wave/ice conditions and temporary closure authority. No current project closure found. Confirm same-day wall/gate status and current route."
      },
      {
        "structureId": "outer_breakwall_light_9_side",
        "displayName": "Rogers City outer breakwall ending at Harbor Channel Light 9",
        "municipality": "City of Rogers City",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Rogers City outer breakwall ending at Harbor Channel Light 9",
          "streetAddress": "Rogers City Marina, 270 N Lake Street, Rogers City, MI 49779",
          "latitude": 45.422472,
          "longitude": -83.809722,
          "coordinateSource": "USCG_LIGHT_LIST"
        },
        "accessEvidence": [
          {
            "evidenceId": "ROGERS_ORD",
            "authority": "City of Rogers City",
            "title": "Code of Ordinances, section 8-36",
            "url": "https://www.rogerscity.com/uploads/5/3/7/7/53772309/rogers_city_code_of_ordinances__2014__final.pdf",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Fishing permitted on outer breakwalls at any time of year by ordinance. Subject to weather, events, construction, and posted harbormaster controls. Hours: Ordinance states any time of year; live signs still control. Fees: No angler fee identified. Unsafe wave/ice conditions and temporary closure authority. No current project closure found. Confirm same-day wall/gate status and current route."
      },
      {
        "structureId": "marina_basin_designated_areas",
        "displayName": "Rogers City marina basin designated fishing areas",
        "municipality": "City of Rogers City",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Rogers City marina basin designated fishing areas",
          "streetAddress": "270 N Lake Street, Rogers City, MI 49779",
          "latitude": 45.4215,
          "longitude": -83.817,
          "coordinateSource": "ROGERS_ORD"
        },
        "accessEvidence": [
          {
            "evidenceId": "ROGERS_ORD",
            "authority": "City of Rogers City",
            "title": "Code of Ordinances, section 8-36",
            "url": "https://www.rogerscity.com/uploads/5/3/7/7/53772309/rogers_city_code_of_ordinances__2014__final.pdf",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Fishing allowed before June 1 and after September 1 in designated areas; June-August prohibited unless a designated area is posted. Current signs and slip/event conditions control. Hours: Follow posted harbor hours. Fees: No angler fee identified. June 1-August 31 basin prohibition except posted designated areas. No current project closure found. Pass 3 must not generalize breakwall permission to occupied docks."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Four exact-port catch years plus current agency harbor guidance establish a real fall fishery above Lexington but below Harrisville. Historical sampling limits confidence, not F."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Current records remain primarily boat/offshore and no positive Pier/Dock catch row resolves the covered-structure fishery. No placeholder score is permitted."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Four exact-port catch years, current agency targeting guidance, and exact/neighboring stocking pathways establish a recurring fishery above Harrisville and below Chicago."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Seven positive catch years with strong measured magnitude establish recurring spring and fall harbor opportunity above Alpena but below Michigan City."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Four positive spring catch years plus current local guidance establish modest recurring nearshore opportunity between Alpena and Harbor Beach."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Three positive catch years with meaningful measured magnitude establish an ordinary harbor fishery below Lexington and above the Lake Michigan low tier."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Current DNR exact-harbor targeting guidance establishes an intentional local fishery. Missing port-specific quantitative rows keep Grade B while the peak is bracketed by Pentwater and Chicago/Muskegon."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One positive year, despite high episodic magnitude, cannot establish recurring opportunity. No placeholder score is permitted."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. All 5 target-county stocking records (1979-2020) are classified regional-only and do not establish the target-city structure fishery."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR directs anglers to cast from the breakwall, a 2008 Pier/Dock positive establishes exact-mode catch, and 2026 advisory evidence confirms current recurrence. The result sits above Port Sanilac and below Alpena."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Two positive years remain too sparse for a defensible recurring full-year calibration. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: Bluegill is explicitly outside the user-facing PierCast catalog. Biological records were not converted into a target."
      }
    ]
  },
  {
    "cityId": "tawas_city_mi",
    "displayName": "Tawas City",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "tawas_city_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 44.27,
        "longitude": -83.5,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 267,
        "gridColumn": 456,
        "modelBathymetryM": 3.254482711748127,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "shoreline_park_pier",
          "displayName": "Shoreline Park L-shaped fishing pier",
          "latitude": 44.2794,
          "longitude": -83.4865,
          "distanceM": 1499,
          "coordinateSource": "City of Tawas City master plan"
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
      "limitation": "One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. Tawas Bay is shallow; wind-driven mixing, river influence, seiches, and nearshore heating can make pier water differ materially. The model does not establish depth-specific temperature, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "gateway_park_pier",
        "displayName": "Gateway Park fishing pier",
        "municipality": "City of Tawas City",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Gateway Park fishing pier",
          "streetAddress": "815 W Lake Street, Tawas City, MI 48763",
          "latitude": 44.2691,
          "longitude": -83.5199,
          "coordinateSource": "TAWAS_GATEWAY"
        },
        "accessEvidence": [
          {
            "evidenceId": "TAWAS_GATEWAY",
            "authority": "City of Tawas City",
            "title": "Gateway Park",
            "url": "https://tawascity.org/places/gateway-park/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "TAWAS_PLAN",
            "authority": "City of Tawas City",
            "title": "Parks and Recreation Plan",
            "url": "https://tawascity.org/wp-content/uploads/2023/09/City-of-Tawas-Recreation-Plan-Final-2022-12-19.pdf",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Public 300-foot lighted ADA fishing pier. Published access; verify same-day ice, surface condition, and signs. Hours: Open park/pier areas are not reservable; posted rules control. Fees: No angler entry fee found. River-mouth current, ice, weather, and maintenance. No current closure found. Confirm live condition before public release."
      },
      {
        "structureId": "gateway_river_edge_boardwalk",
        "displayName": "Gateway Park Tawas River-edge walkway/boardwalk",
        "municipality": "City of Tawas City",
        "disposition": "unresolved",
        "accessStatus": "route_unverified",
        "accessRoute": null,
        "accessEvidence": [
          {
            "evidenceId": "TAWAS_GATEWAY",
            "authority": "City of Tawas City",
            "title": "Gateway Park",
            "url": "https://tawascity.org/places/gateway-park/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "TAWAS_PLAN",
            "authority": "City of Tawas City",
            "title": "Parks and Recreation Plan",
            "url": "https://tawascity.org/wp-content/uploads/2023/09/City-of-Tawas-Recreation-Plan-Final-2022-12-19.pdf",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "The park is public, but no reviewed primary source separately designates every river-edge walkway segment as a fishing structure. Do not generalize pier permission to the full river edge. Hours: Posted park rules control. Fees: No angler entry fee found. River current, ice, maintenance, and posted restrictions. No current closure found. A current site map/sign inspection is required before treating this as an independent fishing subarea."
      },
      {
        "structureId": "shoreline_park_pier",
        "displayName": "Shoreline Park L-shaped fishing pier",
        "municipality": "City of Tawas City",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Shoreline Park L-shaped fishing pier",
          "streetAddress": "429 W Lake Street, Tawas City, MI 48763",
          "latitude": 44.2794,
          "longitude": -83.4865,
          "coordinateSource": "TAWAS_PLAN"
        },
        "accessEvidence": [
          {
            "evidenceId": "TAWAS_PLAN",
            "authority": "City of Tawas City",
            "title": "Parks and Recreation Plan",
            "url": "https://tawascity.org/wp-content/uploads/2023/09/City-of-Tawas-Recreation-Plan-Final-2022-12-19.pdf",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Public lighted pier, approximately 550 feet after 2021 extension, with benches and day slips. Published access only. Hours: Posted park/pier rules control. Fees: No angler entry fee found. Day-slip traffic, ice, waves, and maintenance. No current closure found. Keep fishing surfaces separate from occupied day slips."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Historical stocking and mixed current occurrence do not resolve present recurring covered-structure targeting. No placeholder score is permitted."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Current DNR exact-city/bay guidance supports intentional local shore opportunity. With no resolved dashboard allocation, the peak matches Harbor Beach and remains below Harrisville."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR exact-city guidance establishes the local fishery, but reviewed weekly records are predominantly boat/offshore or incidental. The corrected peak matches the lower established Huron harbor tier rather than exceeding measured Rogers City evidence."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Historical exact-area stocking ended and current exact-pier recurrence remains unresolved. No placeholder score is permitted."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Current exact-city/bay guidance establishes cold-water local opportunity. With no resolved structure-level magnitude, the corrected peak matches Rogers City and remains below Harbor Beach; stocking only corroborates occurrence."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR identifies Tawas City/Bay as a good walleye location and recurring bay reports establish strength, but most measured reports are boat-oriented. The corrected peak remains above Port Sanilac and below Oscoda."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Current DNR exact-city/harbor targeting guidance supports a strong warm-season fishery above Lexington and below Pentwater."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: A connected-river report establishes occurrence but not recurring intentional pier targeting. No placeholder score is permitted."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR exact-city/bay guidance establishes a real perch opportunity, while reviewed weekly evidence includes small fish and lacks a structure-level magnitude series. The corrected peak sits above Michigan City and below Grand Haven/Manistee."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR weekly reports explicitly document late-fall targeting from the Tawas wall/state dock. Exact method and season support admission, while the unresolved magnitude supports equality with the established 4.0 lawful pier cohort rather than a new high."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. All 7 target-county stocking records (1997-2016) are classified regional-only and do not establish the target-city structure fishery."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current agency location inventory creates a credible city lead, but no species-resolved recurring covered-shore record supports a numeric magnitude or annual shape. No placeholder score is permitted."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current agency location inventory and regional program establish local occurrence, but the reviewed records remain mode-mixed or offshore and do not establish recurring covered-structure targeting. No placeholder score is permitted."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR exact-city/connected-harbor targeting guidance establishes recurring opportunity at the Ludington tier. A single historical exact stocking record does not affect F."
      },
      {
        "speciesId": "burbot",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR reports anglers taking burbot from the exact state dock and retains the local fishery in its guidance. Exact cold-season targeting supports a limited peak below Manistee/Ludington."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: Bluegill is explicitly outside the user-facing PierCast catalog. Biological records were not converted into a target."
      }
    ]
  },
  {
    "cityId": "charlevoix_mi",
    "displayName": "Charlevoix",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "charlevoix_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 45.32,
        "longitude": -85.28,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 372,
        "gridColumn": 278,
        "modelBathymetryM": 13.46508358810818,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "south_navigation_pier",
          "displayName": "Charlevoix south navigation pier and lighthouse",
          "latitude": 45.3228,
          "longitude": -85.2697,
          "distanceM": 863,
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
      "limitation": "One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. The lakeward cell deliberately avoids treating Pine River, Round Lake, and protected marina water as open Lake Michigan. The model does not establish depth-specific temperature, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "pine_river_channel_walkway",
        "displayName": "Bridge Park and Pine River Channel fishing walkway",
        "municipality": "City of Charlevoix",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Bridge Park and Pine River Channel fishing walkway",
          "streetAddress": "100 Bridge Street, Charlevoix, MI 49720",
          "latitude": 45.3198,
          "longitude": -85.2588,
          "coordinateSource": "CHARLEVOIX_PLAN"
        },
        "accessEvidence": [
          {
            "evidenceId": "CHARLEVOIX_PLAN",
            "authority": "City of Charlevoix",
            "title": "2022-2026 Parks and Recreation Plan",
            "url": "https://charlevoixmi.gov/DocumentCenter/View/2406/2022-2026-City-of-Charlevoix-Master-Plan-Final-Version-PDF",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "CHARLEVOIX_RULES",
            "authority": "City of Charlevoix",
            "title": "Municipal marina rules",
            "url": "https://www.charlevoixmi.gov/DocumentCenter/View/3136/Marina-Rules-and-Regualtions-PDF",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "City plan identifies Bridge Park as mainly used for fishing/viewing; pedestrian guidance expects people fishing. Published access; follow bridge, rail, and posted restrictions. Hours: Posted park/municipal rules control. Fees: No angler fee found. Vessel traffic, drawbridge operations, ice, and maintenance. No current closure found. Pass 3 should map only lawful railing segments."
      },
      {
        "structureId": "municipal_marina_designated_areas",
        "displayName": "Charlevoix municipal marina designated fishing areas",
        "municipality": "City of Charlevoix",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Charlevoix municipal marina designated fishing areas",
          "streetAddress": "100 Round Lake Drive, Charlevoix, MI 49720",
          "latitude": 45.3186,
          "longitude": -85.258,
          "coordinateSource": "CHARLEVOIX_RULES"
        },
        "accessEvidence": [
          {
            "evidenceId": "CHARLEVOIX_RULES",
            "authority": "City of Charlevoix",
            "title": "Municipal marina rules",
            "url": "https://www.charlevoixmi.gov/DocumentCenter/View/3136/Marina-Rules-and-Regualtions-PDF",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Fishing only in designated areas; prohibited where vessels are docked. Current signs/occupancy control. Hours: Marina/posted hours control. Fees: No angler fee established. Occupied slips and vessel operations. No current closure found. Obtain the current designated-area map before release."
      },
      {
        "structureId": "south_navigation_pier",
        "displayName": "Charlevoix south navigation pier and lighthouse",
        "municipality": "City of Charlevoix",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Charlevoix south navigation pier and lighthouse",
          "streetAddress": "Lake Michigan Beach Park, Park Avenue, Charlevoix, MI 49720",
          "latitude": 45.3228,
          "longitude": -85.2697,
          "coordinateSource": "USCG_LIGHT_LIST"
        },
        "accessEvidence": [
          {
            "evidenceId": "CHARLEVOIX_PLAN",
            "authority": "City of Charlevoix",
            "title": "2022-2026 Parks and Recreation Plan",
            "url": "https://charlevoixmi.gov/DocumentCenter/View/2406/2022-2026-City-of-Charlevoix-Master-Plan-Final-Version-PDF",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "CHARLEVOIX_PIERS",
            "authority": "City of Charlevoix",
            "title": "North and South Piers / Lighthouse recreation inventory",
            "url": "https://www.charlevoixmi.gov/DocumentCenter/View/131/Chapter-4-Recreation-Inventory-PDF",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "CHARLEVOIX_USACE",
            "authority": "U.S. Army Corps of Engineers Detroit District",
            "title": "Charlevoix Harbor, Michigan",
            "url": "https://www.lrd.usace.army.mil/Missions/Projects/Article/3642404/charlevoix-harbor-michigan/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "City records identify the south pier as a fishing/viewing location with safety railing and a public park approach. Published access; verify current wave conditions, rail, and barriers. Hours: Posted beach/park rules control. Fees: No pedestrian fee identified; parking rules control. Large waves, ice, currents, and navigation operations. The unsafe ancillary walkway was removed in 2022 while the adjacent access walkway was retained; no current closure found. Confirm current rail continuity and same-day gate status."
      },
      {
        "structureId": "north_navigation_pier",
        "displayName": "Charlevoix north navigation pier",
        "municipality": "City of Charlevoix",
        "disposition": "unresolved",
        "accessStatus": "route_unverified",
        "accessRoute": null,
        "accessEvidence": [
          {
            "evidenceId": "CHARLEVOIX_PIERS",
            "authority": "City of Charlevoix",
            "title": "North and South Piers / Lighthouse recreation inventory",
            "url": "https://www.charlevoixmi.gov/DocumentCenter/View/131/Chapter-4-Recreation-Inventory-PDF",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "CHARLEVOIX_USACE",
            "authority": "U.S. Army Corps of Engineers Detroit District",
            "title": "Charlevoix Harbor, Michigan",
            "url": "https://www.lrd.usace.army.mil/Missions/Projects/Article/3642404/charlevoix-harbor-michigan/",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "USCG_LIGHT_LIST",
            "authority": "U.S. Coast Guard Navigation Center",
            "title": "Light List Volume VII / live Great Lakes data",
            "url": "https://www.navcen.uscg.gov/light-list-annual-publication",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "MI_BEACH_SAFETY",
            "authority": "Michigan DNR",
            "title": "Beach safety",
            "url": "https://www.michigan.gov/dnr/places/state-parks/beach-safety",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "Older city inventory describes both piers as fishing locations, but current route details were not resolved. Do not present as currently open until the approach and barriers are confirmed. Hours: Unknown for the full pier. Fees: Unknown. Large waves, ice, currents, navigation operations, and possible route restrictions. No current project closure found; absence of a notice is not proof of access. Direct City/USACE route and surface confirmation required."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Nine positive catch years including modern positives establish recurring channel opportunity. Low measured magnitude keeps the peak at the Manitowoc tier below Pentwater."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Recent connected-water stocking is not exact-channel catch evidence; the Pier/Dock series has no positive catch row. No placeholder score is permitted."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Eleven positive catch years across six months and continued modern occurrence establish a strong multi-window fishery between Holland/Two Rivers and the 7.7 cohort."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One positive catch year plus connected-water stocking is inadequate for recurring numeric admission. No placeholder score is permitted."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Six positive years, all measured catch occurring in the modern period, establish the strongest reviewed Lake Michigan onboarding peak below Rogers City and above Lexington."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Thirteen positive catch years establish recurring channel opportunity. Modest recent magnitude places it below Lexington and above the Lake Michigan 4.5 tier."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Twenty-five positive catch years, exceptional measured magnitude, and repeated exact-channel reports establish the strongest reviewed smallmouth channel fishery. The corrected 8.4 remains above Alpena while avoiding an unsupported four-tenths expansion within the excellent band."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Twelve positive years with persistent modern catches and exact-channel reports establish recurring ordinary-to-strong opportunity below Chicago/Whitehall."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade A private city-pier estimate: Eight positive years with strong modern recurrence establish a solid channel fishery above Michigan City and below Grand Haven."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One historical positive catch year does not establish current recurrence. No placeholder score is permitted."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: A single harvest-only lead does not establish recurring targeted channel opportunity. No placeholder score is permitted."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: A single harvest-only lead and regional stocking do not establish recurrence. No placeholder score is permitted."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: One 1986 connected-water stocking record and offshore reports do not establish an exact-pier fishery. No placeholder score is permitted."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Archived channel occurrence remains insufficient to resolve recurrence, magnitude, and annual shape. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: Bluegill is explicitly outside the user-facing PierCast catalog. Biological records were not converted into a target."
      }
    ]
  },
  {
    "cityId": "caseville_mi",
    "displayName": "Caseville",
    "stateCode": "MI",
    "timezone": "America/Detroit",
    "tentative": true,
    "publicEnabled": false,
    "waterTemperatureSource": {
      "sourceId": "caseville_mi__lmhofs_nearshore_surface__v0_1",
      "productId": "NOAA_NOS_LMHOFS_REGULARGRID",
      "displayName": "NOAA LMHOFS nearshore surface temperature (candidate)",
      "kind": "model",
      "canonicalUnit": "C",
      "calibrationStatus": "provisional",
      "endpoint": "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
      "variable": "temp",
      "configuredLocation": {
        "latitude": 43.95,
        "longitude": -83.28,
        "verticalSelection": "surface",
        "depthIndex": 0,
        "gridRow": 235,
        "gridColumn": 478,
        "modelBathymetryM": 1.7294217870130457,
        "selectionMethod": "nearest_wet_lakeward_regular_grid_center",
        "referencePoint": {
          "referenceId": "pointe_park_breakwall",
          "displayName": "Pointe Park boardwalk and breakwall fishing pier",
          "latitude": 43.9456,
          "longitude": -83.2718,
          "distanceM": 819,
          "coordinateSource": "City of Caseville recreation plan"
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
      "limitation": "One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. Saginaw Bay is shallow; the selected wet bay cell does not resolve the Pigeon River plume, harbor protection, or breakwall-scale water. The model does not establish depth-specific temperature, waves, ice, construction, or access."
    },
    "structures": [
      {
        "structureId": "pointe_park_breakwall",
        "displayName": "Pointe Park boardwalk and breakwall fishing pier",
        "municipality": "City of Caseville",
        "disposition": "candidate",
        "accessStatus": "open_by_published_rules",
        "accessRoute": {
          "displayName": "Pointe Park boardwalk and breakwall fishing pier",
          "streetAddress": "Harbor Street, Caseville, MI 48725",
          "latitude": 43.9456,
          "longitude": -83.2718,
          "coordinateSource": "CASEVILLE_PLAN"
        },
        "accessEvidence": [
          {
            "evidenceId": "CASEVILLE_PLAN",
            "authority": "City of Caseville",
            "title": "2023 Master Plan",
            "url": "https://www.cityofcaseville.com/images/Master_Plan_2023.pdf",
            "reviewedAt": "2026-09-21"
          },
          {
            "evidenceId": "CASEVILLE_EDC",
            "authority": "Huron County Economic Development Corporation",
            "title": "Pointe Park",
            "url": "https://www.huroncounty.com/beaches-parks-and-trails-in-huron-county-michigan/pointe-park-caseville",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "City and county sources document boardwalk/breakwall shore fishing and accessible fishing. Published access only; verify current signs, ice, water levels, and construction. Hours: Posted park/harbor rules control. Fees: No angler fee found; public parking documented. Harbor traffic, ice, water level, and weather. No current closure found. Confirm exact outer endpoint and current surface condition before release."
      },
      {
        "structureId": "municipal_harbor_designated_areas",
        "displayName": "Caseville municipal harbor designated fishing areas",
        "municipality": "City of Caseville",
        "disposition": "unresolved",
        "accessStatus": "route_unverified",
        "accessRoute": null,
        "accessEvidence": [
          {
            "evidenceId": "CASEVILLE_PLAN",
            "authority": "City of Caseville",
            "title": "2023 Master Plan",
            "url": "https://www.cityofcaseville.com/images/Master_Plan_2023.pdf",
            "reviewedAt": "2026-09-21"
          }
        ],
        "liveAccessStatus": "not_live_checked",
        "limitation": "City plan confirms harbor fishing generally, but no reviewed rule or map identifies the currently designated dock/basin surfaces. Do not represent marina docks or basin edges as open without current signs/harbormaster confirmation. Hours: Unknown for fishing surfaces. Fees: No angler fee established; boating fees are not angler access evidence. Dock installation, occupied slips, vessel movements, ice, festivals, and posted restrictions. No current project closure found. Obtain current harbor rules, designated-area map, hours, and seasonal dock configuration before release."
      }
    ],
    "species": [
      {
        "speciesId": "chinook_salmon",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Neighboring-port stocking and regional occurrence do not establish exact Caseville pier recurrence. No placeholder score is permitted."
      },
      {
        "speciesId": "coho_salmon",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: An exact DNR Caseville-pier catch report, official spring salmon guidance for Caseville, and current Huron County stocking corroboration establish a real but modest city-centered fishery. The conservative peak remains below Harbor Beach and Ludington."
      },
      {
        "speciesId": "steelhead",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Exact connected Pigeon River/Caseville rainbow-trout stocking through 2022 and official spring trout guidance establish a modest city-centered steelhead pathway. The conservative peak matches Port Sanilac and remains below the measured Lake Huron harbor cohort."
      },
      {
        "speciesId": "brown_trout",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Historical exact-area stocking ended in 1999 and no current exact-pier recurrence was resolved. No placeholder score is permitted."
      },
      {
        "speciesId": "lake_trout",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: Michigan DNR's exact Caseville fishery inventory names lake trout and the Lake Huron roadmap identifies spring trout opportunity. With no quantitative Caseville series, the conservative peak matches Oscoda and remains below Lexington."
      },
      {
        "speciesId": "walleye",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR exact-city guidance and an exact-pier weekly report establish recurring intentional targeting. The peak matches Port Sanilac below Tawas/Oscoda."
      },
      {
        "speciesId": "smallmouth_bass",
        "inheritance": "candidate",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Pass 2 Grade B private city-pier estimate: DNR exact-city guidance and an exact-pier weekly report establish ordinary warm-season opportunity between Port Sanilac and Michigan City."
      },
      {
        "speciesId": "freshwater_drum",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "yellow_perch",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current agency location inventory establishes a meaningful city lead, but no recurring exact pier/shore catch record supports the previously assigned strong numeric peak. No placeholder score is permitted."
      },
      {
        "speciesId": "lake_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "round_whitefish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "channel_catfish",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "largemouth_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "atlantic_salmon",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "northern_pike",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: Neighboring-port stocking alone cannot establish the covered Caseville fishery. No placeholder score is permitted."
      },
      {
        "speciesId": "burbot",
        "inheritance": "conditional",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade C research hold: The current agency location inventory establishes a cold-season lead, but no exact recurring Pointe Park or harbor-edge record resolves targetability, magnitude, and annual shape. No placeholder score is permitted."
      },
      {
        "speciesId": "white_perch",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "white_bass",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Grade D exclusion: The cell was reopened against exact-port, connected-water, stocking, weekly-report, management, historical, and seasonal evidence. No new covered-structure basis changed the Pass 1 exclusion. No credible recurring covered-structure lead was resolved after exact port, connected water, stocking, weekly-report, alternate-name, historical, and seasonal review."
      },
      {
        "speciesId": "bluegill",
        "inheritance": "unresolved",
        "seasonalOpportunityCurve": null,
        "ratingEnabled": false,
        "limitation": "Product-policy exclusion: Bluegill is explicitly outside the user-facing PierCast catalog. Biological records were not converted into a target."
      }
    ]
  }
] as const satisfies readonly PierCastCityProfile[];
