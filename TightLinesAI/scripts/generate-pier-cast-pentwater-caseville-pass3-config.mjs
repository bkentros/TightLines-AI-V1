import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pass1 = resolve(root, "docs/onboarding/piercast/pentwater-caseville-2026-09-pass1");
const pass2 = resolve(root, "docs/onboarding/piercast/pentwater-caseville-2026-09-pass2");
const outputPath = resolve(root, "supabase/functions/_shared/pierCastEngine/config/pentwaterCasevilleShadow.ts");
const boundaries = JSON.parse(readFileSync(resolve(pass1, "site-boundaries.json"), "utf8"));
const sourceLedger = JSON.parse(readFileSync(resolve(pass1, "source-ledger.json"), "utf8"));
const decisions = JSON.parse(readFileSync(resolve(pass2, "pair-decisions.json"), "utf8"));
const bluegill = JSON.parse(readFileSync(resolve(pass2, "bluegill-policy-exclusions.json"), "utf8"));

const cityIds = ["pentwater_mi", "rogers_city_mi", "tawas_city_mi", "charlevoix_mi", "caseville_mi"];
const cities = new Map(boundaries.cities.map((city) => [city.id, city]));
const sources = new Map(sourceLedger.sources.map((source) => [source.id, source]));
const locations = {
  pentwater_mi: cell(43.78, -86.45, 218, 161, 6.438171178218563, "north_navigation_pier", "Pentwater north navigation pier", 43.782329, -86.443616, 574, "U.S. Coast Guard Light List"),
  rogers_city_mi: cell(45.42, -83.80, 382, 426, 3.2471046795913714, "outer_breakwall_light_8_side", "Rogers City outer breakwall ending at Harbor Channel Light 8", 45.422917, -83.809222, 789, "U.S. Coast Guard Light List"),
  tawas_city_mi: cell(44.27, -83.50, 267, 456, 3.254482711748127, "shoreline_park_pier", "Shoreline Park L-shaped fishing pier", 44.2794, -83.4865, 1499, "City of Tawas City master plan"),
  charlevoix_mi: cell(45.32, -85.28, 372, 278, 13.46508358810818, "south_navigation_pier", "Charlevoix south navigation pier and lighthouse", 45.3228, -85.2697, 863, "U.S. Coast Guard Light List"),
  caseville_mi: cell(43.95, -83.28, 235, 478, 1.7294217870130457, "pointe_park_breakwall", "Pointe Park boardwalk and breakwall fishing pier", 43.9456, -83.2718, 819, "City of Caseville recreation plan"),
};

if (boundaries.schema_version !== "piercast-pass1-site-boundaries-v1" || cities.size !== 5) {
  throw new Error("Pentwater–Caseville Pass 1 site boundary handoff is incomplete.");
}
if (
  decisions.schema_version !== "piercast-pentwater-caseville-pass2-pair-decisions-v1" ||
  decisions.decisions.length !== 90 || decisions.disposition_counts.numeric_private !== 36 ||
  decisions.disposition_counts.research_hold_unscored !== 26 || decisions.disposition_counts.exclude_unscored !== 28
) throw new Error("Pentwater–Caseville Pass 2 decision handoff is incomplete.");
if (bluegill.records.length !== 5 || bluegill.records.some((row) => row.disposition !== "product_policy_exclusion")) {
  throw new Error("Pentwater–Caseville bluegill exclusions are incomplete.");
}

const structures = Object.fromEntries(cityIds.map((cityId) => {
  const city = cities.get(cityId);
  if (!city) throw new Error(`Missing city boundary ${cityId}.`);
  return [cityId, city.structures.map((row) => {
    const admitted = row.disposition === "covered" || row.disposition === "covered_conditionally";
    const evidence = row.source_ids.map((id) => {
      const source = sources.get(id);
      if (!source) throw new Error(`Missing access source ${id}.`);
      return { evidenceId: id, authority: source.publisher, title: source.title, url: source.url, reviewedAt: source.review_date };
    });
    return {
      structureId: row.structure_id,
      displayName: row.display_name,
      municipality: row.municipality,
      disposition: admitted ? "candidate" : "unresolved",
      accessStatus: admitted ? "open_by_published_rules" : "route_unverified",
      accessRoute: admitted ? {
        displayName: row.display_name,
        streetAddress: row.street_address,
        latitude: row.coordinates.latitude,
        longitude: row.coordinates.longitude,
        coordinateSource: row.coordinates.source_id,
      } : null,
      accessEvidence: evidence,
      liveAccessStatus: "not_live_checked",
      limitation: `${row.published_access_status} ${row.live_access_status} Hours: ${row.hours} Fees: ${row.passes_fees} ${row.seasonal_limitations} ${row.construction_closure} ${row.unresolved_limitations}`,
    };
  })];
}));

const profiles = cityIds.map((cityId) => {
  const city = cities.get(cityId);
  const cityDecisions = decisions.decisions.filter((row) => row.city_id === cityId);
  const hidden = bluegill.records.find((row) => row.city_id === cityId);
  if (!city || cityDecisions.length !== 18 || !hidden) throw new Error(`${cityId} species handoff is incomplete.`);
  return {
    cityId,
    displayName: city.name,
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
      limitation: temperatureLimitation(cityId),
    },
    structures: structures[cityId],
    species: [
      ...cityDecisions.map((row) => ({
        speciesId: row.species_id,
        inheritance: row.pass2_disposition === "numeric_private" ? "candidate" : row.pass2_disposition === "research_hold_unscored" ? "conditional" : "unresolved",
        seasonalOpportunityCurve: null,
        ratingEnabled: false,
        limitation: row.pass2_disposition === "numeric_private"
          ? `Pass 2 Grade ${row.evidence_grade} private city-pier estimate: ${row.calibration_rationale}`
          : row.pass2_disposition === "research_hold_unscored"
          ? `Grade C research hold: ${row.calibration_rationale}`
          : `Grade D exclusion: ${row.calibration_rationale}`,
      })),
      {
        speciesId: "bluegill",
        inheritance: "unresolved",
        seasonalOpportunityCurve: null,
        ratingEnabled: false,
        limitation: `Product-policy exclusion: ${hidden.reason}`,
      },
    ],
  };
});

const generated = `/* eslint-disable */
/** GENERATED FILE — DO NOT HAND EDIT.
 * Sources: Pentwater–Caseville Pass 1 boundaries and corrected Pass 2 decisions.
 * Regenerate with npm run generate:pier-cast:pentwater-caseville-pass3-config.
 */
import type { PierCastCityId, PierCastCityProfile } from "../types.ts";

export const PIER_CAST_PENTWATER_CASEVILLE_SCOPE_VERSION =
  "piercast-pentwater-caseville-shadow-v1" as const;
export const PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS = ${JSON.stringify(cityIds, null, 2)} as const satisfies readonly PierCastCityId[];
export type PierCastPentwaterCasevilleCityId = (typeof PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS)[number];
export const PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES = ${JSON.stringify(profiles, null, 2)} as const satisfies readonly PierCastCityProfile[];
`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== generated) throw new Error("Pentwater–Caseville Pass 3 config has drifted.");
  console.log("Pentwater–Caseville Pass 3 config is current.");
} else {
  writeFileSync(outputPath, generated);
  console.log(`Generated ${outputPath}.`);
}

function cell(latitude, longitude, gridRow, gridColumn, modelBathymetryM, referenceId, displayName, referenceLatitude, referenceLongitude, distanceM, coordinateSource) {
  return {
    latitude, longitude, verticalSelection: "surface", depthIndex: 0, gridRow, gridColumn, modelBathymetryM,
    selectionMethod: "nearest_wet_lakeward_regular_grid_center",
    referencePoint: { referenceId, displayName, latitude: referenceLatitude, longitude: referenceLongitude, distanceM, coordinateSource },
    gridCellStatus: "candidate",
  };
}

function temperatureLimitation(cityId) {
  const specific = {
    pentwater_mi: "Pentwater Lake, channel exchange, river-plume mixing, protected water, and open Lake Michigan can differ materially.",
    rogers_city_mi: "The selected lakeward cell does not resolve municipal-harbor protection or breakwall-scale mixing.",
    tawas_city_mi: "Tawas Bay is shallow; wind-driven mixing, river influence, seiches, and nearshore heating can make pier water differ materially.",
    charlevoix_mi: "The lakeward cell deliberately avoids treating Pine River, Round Lake, and protected marina water as open Lake Michigan.",
    caseville_mi: "Saginaw Bay is shallow; the selected wet bay cell does not resolve the Pigeon River plume, harbor protection, or breakwall-scale water.",
  }[cityId];
  return `One audited wet LMHOFS surface cell supplies general city conditions. It is not a pier thermometer. ${specific} The model does not establish depth-specific temperature, waves, ice, construction, or access.`;
}
