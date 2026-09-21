import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pass1 = resolve(root, "docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass1");
const pass2 = resolve(root, "docs/onboarding/piercast/st-joseph-harrisville-2026-09-pass2");
const outputPath = resolve(root, "supabase/functions/_shared/pierCastEngine/config/stJosephHarrisvilleShadow.ts");
const boundaries = JSON.parse(readFileSync(resolve(pass1, "site-boundaries.json"), "utf8"));
const sourceLedger = JSON.parse(readFileSync(resolve(pass1, "source-ledger.json"), "utf8"));
const decisions = JSON.parse(readFileSync(resolve(pass2, "pair-decisions.json"), "utf8"));

const cityIds = ["st_joseph_mi", "south_haven_mi", "holland_mi", "lexington_mi", "harrisville_mi"];
const names = Object.fromEntries(boundaries.cities.map((city) => [city.city_id, city.display_name]));
const sources = new Map(sourceLedger.sources.map((source) => [source.id, source]));
const locations = {
  st_joseph_mi: cell(42.12, -86.50, 52, 156, 8.135563111894864, "st_joseph_south_pierhead_light", "St. Joseph South Pierhead Light", 42.115275, -86.494285, 706),
  south_haven_mi: cell(42.40, -86.29, 80, 177, 5.038883071746686, "south_haven_south_pierhead_light", "South Haven South Pierhead Light", 42.40135, -86.287964, 225),
  holland_mi: cell(42.77, -86.22, 117, 184, 7.974799442363687, "holland_north_breakwater_light", "Holland North Breakwater Light", 42.773453, -86.215814, 514),
  lexington_mi: cell(43.27, -82.52, 167, 554, 2.3938175035609333, "lexington_east_breakwater_light", "Lexington East Breakwater Light 2", 43.26662, -82.522849, 441),
  harrisville_mi: cell(44.66, -83.28, 306, 478, 3.8277593190159034, "harrisville_east_breakwater_light", "Harrisville East Breakwater Light 3", 44.661398, -83.281813, 211),
};

if (boundaries.cities.length !== 5 || boundaries.structures.length !== 16 || decisions.decisions.length !== 95) {
  throw new Error("Pass 1/2 handoff is incomplete.");
}
for (const cityId of cityIds) {
  const rows = decisions.decisions.filter((row) => row.city_id === cityId);
  if (rows.length !== 19) throw new Error(`${cityId} does not have 19 decisions.`);
}

const structures = Object.fromEntries(cityIds.map((cityId) => [cityId,
  boundaries.structures.filter((row) => row.city_id === cityId).map((row) => {
    const excluded = row.disposition.startsWith("excluded");
    const unresolved = row.disposition.includes("hold") || row.disposition.includes("prospective") && cityId === "lexington_mi";
    const reportedClosed = row.live_access_status.toLowerCase().includes("closed") || row.construction_closure.toLowerCase().includes("closure through");
    const routeMissing = row.route_address.toLowerCase().includes("no lawful") || row.route_address.toLowerCase().includes("outer harrisville harbor");
    const evidence = row.source_ids.map((id) => {
      const source = sources.get(id);
      if (!source) throw new Error(`Missing source ${id}.`);
      return { evidenceId: id, authority: source.publisher, title: source.title, url: source.url, reviewedAt: source.review_date };
    });
    return {
      structureId: row.structure_id,
      displayName: row.structure_name,
      municipality: row.municipality_owner.split(";")[0],
      disposition: excluded ? "excluded" : unresolved ? "unresolved" : "candidate",
      accessStatus: reportedClosed ? "reported_closed" : routeMissing ? "route_unverified" : row.published_access_status.toLowerCase().includes("public") || row.published_access_status.toLowerCase().includes("open") ? "open_by_published_rules" : "not_live_verified",
      accessRoute: routeMissing ? null : {
        displayName: row.structure_name,
        streetAddress: row.route_address,
        latitude: row.coordinates.latitude,
        longitude: row.coordinates.longitude,
        coordinateSource: row.coordinates.source_id,
      },
      accessEvidence: evidence,
      liveAccessStatus: reportedClosed ? "reported_closed" : "not_live_checked",
      limitation: `${row.hours_passes_fees} ${row.seasonal_restrictions} ${row.construction_closure} ${row.unresolved_limitations}`,
    };
  }),
]));

const profiles = cityIds.map((cityId) => ({
  cityId,
  displayName: names[cityId],
  stateCode: "MI",
  timezone: "America/Detroit",
  tentative: true,
  publicEnabled: false,
  waterTemperatureSource: {
    sourceId: `${cityId}__lmhofs_nearshore_surface__v0_1`,
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    displayName: "NOAA LMHOFS nearshore surface temperature (candidate)",
    kind: "model",
    canonicalUnit: "C",
    calibrationStatus: "provisional",
    endpoint: "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/{YYYY}/{MM}/{DD}/lmhofs.t{CC}z.{YYYYMMDD}.regulargrid.f{HHH}.nc",
    variable: "temp",
    configuredLocation: locations[cityId],
    issueCyclesUtc: [0, 6, 12, 18],
    forecastHorizonHours: 120,
    freshnessLimitHours: 13,
    fallbackPolicy: "unavailable",
    validationObservation: null,
    limitation: "One audited wet lakeward LMHOFS surface cell supplies general city-harbor context. It is not a pier thermometer and cannot resolve harbor mixing, river plumes, depth, waves, ice, construction, or access.",
  },
  structures: structures[cityId],
  species: decisions.decisions.filter((row) => row.city_id === cityId).map((row) => ({
    speciesId: row.species_id,
    inheritance: row.pass2_disposition === "numeric_private" ? "candidate" : row.pass2_disposition === "research_hold_unscored" ? "conditional" : "unresolved",
    seasonalOpportunityCurve: null,
    ratingEnabled: false,
    limitation: row.pass2_disposition === "numeric_private"
      ? `Pass 2 Grade ${row.evidence_grade} city-pier estimate. Available only in owner Formula v3 review; it is not catch probability or a public rating.`
      : row.species_id === "bluegill"
      ? "Product-policy exclusion: bluegill is not a user-facing PierCast fish and receives no score or mode."
      : row.pass2_disposition === "research_hold_unscored"
      ? `Grade C research hold: ${row.calibration_rationale}`
      : `Grade D exclusion: ${row.calibration_rationale}`,
  })),
}));

const generated = `/* eslint-disable */
/** GENERATED FILE — DO NOT HAND EDIT.
 * Sources: St. Joseph–Harrisville Pass 1 site boundaries and Pass 2 decisions.
 * Regenerate with npm run generate:pier-cast:st-joseph-harrisville-pass3-config.
 */
import type { PierCastCityId, PierCastCityProfile } from "../types.ts";

export const PIER_CAST_ST_JOSEPH_HARRISVILLE_SCOPE_VERSION =
  "piercast-st-joseph-harrisville-shadow-v1" as const;
export const PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS = ${JSON.stringify(cityIds, null, 2)} as const satisfies readonly PierCastCityId[];
export type PierCastStJosephHarrisvilleCityId = (typeof PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_IDS)[number];
export const PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES = ${JSON.stringify(profiles, null, 2)} as const satisfies readonly PierCastCityProfile[];
`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== generated) throw new Error("St. Joseph–Harrisville Pass 3 config has drifted.");
  console.log("St. Joseph–Harrisville Pass 3 config is current.");
} else {
  writeFileSync(outputPath, generated);
  console.log(`Generated ${outputPath}.`);
}

function cell(latitude, longitude, gridRow, gridColumn, modelBathymetryM, referenceId, displayName, referenceLatitude, referenceLongitude, distanceM) {
  return {
    latitude, longitude, verticalSelection: "surface", depthIndex: 0, gridRow, gridColumn, modelBathymetryM,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: { referenceId, displayName, latitude: referenceLatitude, longitude: referenceLongitude, distanceM, coordinateSource: "U.S. Coast Guard Light List" },
    gridCellStatus: "candidate",
  };
}
