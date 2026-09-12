import { PIER_CAST_CITY_PROFILES } from "./config/cities.ts";
import {
  PIER_CAST_FROZEN_CITY_IDS,
  PIER_CAST_FROZEN_COVERED_STRUCTURE_IDS,
} from "./config/scope.ts";
import { PIER_CAST_CORE_SPECIES_IDS } from "./config/coreCalibration.ts";
import { PIER_CAST_SPECIES_PROFILES } from "./config/species.ts";
import { validatePierCastSeasonalOpportunityCurve } from "./scoring/seasonal.ts";
import { validatePierCastTemperatureCurve } from "./scoring/temperature.ts";
import {
  PIER_CAST_MONTHS,
  type PierCastCityProfile,
  type PierCastSpeciesProfile,
  type PierCastValidationIssue,
} from "./types.ts";

function issue(
  code: string,
  field: string,
  message: string,
): PierCastValidationIssue {
  return { code, field, message };
}

function haversineDistanceM(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const toRadians = Math.PI / 180;
  const radiusM = 6_371_000;
  const deltaLatitude = (latitudeB - latitudeA) * toRadians;
  const deltaLongitude = (longitudeB - longitudeA) * toRadians;
  const a = Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA * toRadians) *
      Math.cos(latitudeB * toRadians) *
      Math.sin(deltaLongitude / 2) ** 2;
  return 2 * radiusM * Math.asin(Math.sqrt(a));
}

export function validatePierCastSpeciesProfiles(
  profiles: readonly PierCastSpeciesProfile[] = PIER_CAST_SPECIES_PROFILES,
): PierCastValidationIssue[] {
  const issues: PierCastValidationIssue[] = [];
  const ids = new Set<string>();

  if (profiles.length !== 13) {
    issues.push(issue(
      "species_roster_incomplete",
      "speciesProfiles",
      `Expected 13 retained species profiles; found ${profiles.length}.`,
    ));
  }

  for (const profile of profiles) {
    const root = `speciesProfiles.${profile.speciesId}`;
    if (ids.has(profile.speciesId)) {
      issues.push(issue(
        "duplicate_species_id",
        `${root}.speciesId`,
        `Duplicate species ID ${profile.speciesId}.`,
      ));
    }
    ids.add(profile.speciesId);

    if (!profile.displayName.trim()) {
      issues.push(
        issue(
          "species_name_missing",
          `${root}.displayName`,
          "Display name is required.",
        ),
      );
    }
    if (profile.behavioralProfileIds.length === 0) {
      issues.push(issue(
        "behavior_profiles_missing",
        `${root}.behavioralProfileIds`,
        "At least one researched behavioral profile is required.",
      ));
    }
    if (
      new Set(profile.behavioralProfileIds).size !==
        profile.behavioralProfileIds.length
    ) {
      issues.push(issue(
        "duplicate_behavior_profile",
        `${root}.behavioralProfileIds`,
        "Behavioral profile IDs must be unique within a species.",
      ));
    }
    if (profile.evidenceIds.length === 0) {
      issues.push(
        issue(
          "species_evidence_missing",
          `${root}.evidenceIds`,
          "Evidence IDs are required.",
        ),
      );
    }

    for (const month of PIER_CAST_MONTHS) {
      const context = profile.monthContexts[month];
      if (!context?.code.trim()) {
        issues.push(issue(
          "month_context_missing",
          `${root}.monthContexts.${month}`,
          `A ${month} context is required.`,
        ));
      }
    }

    if (profile.ratingEnabled) {
      issues.push(issue(
        "unapproved_species_rating_configuration",
        root,
        "Research profiles must remain disabled until calibration and accepted domains are approved.",
      ));
    }
    const coreSpecies = PIER_CAST_CORE_SPECIES_IDS.includes(
      profile.speciesId as (typeof PIER_CAST_CORE_SPECIES_IDS)[number],
    );
    if (coreSpecies) {
      if (
        profile.calibrationStatus !== "provisional" ||
        profile.seasonalTemperatureCurves?.length !== 1
      ) {
        issues.push(issue(
          "core_temperature_calibration_missing",
          `${root}.seasonalTemperatureCurves`,
          "Each core species requires exactly one disabled provisional temperature curve.",
        ));
      }
      for (const curve of profile.seasonalTemperatureCurves ?? []) {
        for (const curveIssue of validatePierCastTemperatureCurve(curve)) {
          issues.push(
            issue(curveIssue, `${root}.${curve.curveId}`, curveIssue),
          );
        }
        if (curve.calibrationStatus !== "provisional") {
          issues.push(issue(
            "temperature_curve_prematurely_approved",
            `${root}.${curve.curveId}.calibrationStatus`,
            "Core temperature curves remain provisional during private calibration.",
          ));
        }
      }
    } else if (
      profile.calibrationStatus !== "not_calibrated" ||
      profile.seasonalTemperatureCurves !== null
    ) {
      issues.push(issue(
        "secondary_species_calibration_out_of_scope",
        root,
        "Only the four core species may contain provisional calibration.",
      ));
    }
  }
  return issues;
}

export function validatePierCastCityProfiles(
  cities: readonly PierCastCityProfile[] = PIER_CAST_CITY_PROFILES,
): PierCastValidationIssue[] {
  const issues: PierCastValidationIssue[] = [];
  const cityIds = new Set<string>();
  const configuredGridCells = new Set<string>();
  const retainedSpecies = new Set(
    PIER_CAST_SPECIES_PROFILES.map((profile) => profile.speciesId),
  );

  if (cities.length !== 5) {
    issues.push(issue(
      "city_roster_incomplete",
      "cityProfiles",
      `Expected five candidate cities; found ${cities.length}.`,
    ));
  }
  const expectedCityIds = new Set<string>(PIER_CAST_FROZEN_CITY_IDS);
  const actualCityIds = new Set<string>(cities.map((city) => city.cityId));
  if (
    actualCityIds.size !== expectedCityIds.size ||
    [...expectedCityIds].some((cityId) => !actualCityIds.has(cityId))
  ) {
    issues.push(issue(
      "city_roster_outside_frozen_scope",
      "cityProfiles",
      "PierCast v1 is frozen to its five versioned city IDs.",
    ));
  }

  for (const city of cities) {
    const root = `cityProfiles.${city.cityId}`;
    if (cityIds.has(city.cityId)) {
      issues.push(
        issue(
          "duplicate_city_id",
          `${root}.cityId`,
          `Duplicate city ID ${city.cityId}.`,
        ),
      );
    }
    cityIds.add(city.cityId);

    if (city.publicEnabled) {
      issues.push(issue(
        "unapproved_public_city",
        `${root}.publicEnabled`,
        "No PierCast city is approved for public release.",
      ));
    }
    if (!city.waterTemperatureSource) {
      issues.push(issue(
        "city_temperature_source_plan_missing",
        `${root}.waterTemperatureSource`,
        "Each pilot city requires a provisional primary temperature-source plan.",
      ));
    } else {
      const source = city.waterTemperatureSource;
      if (
        source.calibrationStatus !== "provisional" ||
        source.fallbackPolicy !== "unavailable" ||
        source.forecastHorizonHours !== 120 ||
        source.variable !== "temp"
      ) {
        issues.push(issue(
          "city_temperature_source_not_private_provisional",
          `${root}.waterTemperatureSource`,
          "The source plan must remain provisional and fail closed during representation validation.",
        ));
      }

      const location = source.configuredLocation;
      if (!location) {
        issues.push(issue(
          "city_temperature_candidate_grid_cell_missing",
          `${root}.waterTemperatureSource.configuredLocation`,
          "Each city requires a frozen candidate grid cell before representation validation.",
        ));
      } else {
        const cellKey = `${location.gridRow}:${location.gridColumn}`;
        if (configuredGridCells.has(cellKey)) {
          issues.push(issue(
            "duplicate_city_temperature_grid_cell",
            `${root}.waterTemperatureSource.configuredLocation`,
            `LMHOFS grid cell ${cellKey} is assigned to more than one city.`,
          ));
        }
        configuredGridCells.add(cellKey);

        const expectedLatitude = 41.6 + 0.01 * location.gridRow;
        const expectedLongitude = -88.06 + 0.01 * location.gridColumn;
        const reference = location.referencePoint;
        const calculatedDistanceM = haversineDistanceM(
          location.latitude,
          location.longitude,
          reference.latitude,
          reference.longitude,
        );
        const isLakeward = city.stateCode === "WI"
          ? location.longitude >= reference.longitude
          : location.longitude <= reference.longitude;
        if (
          location.gridCellStatus !== "candidate" ||
          location.verticalSelection !== "surface" ||
          location.depthIndex !== 0 ||
          location.selectionMethod !==
            "nearest_wet_lakeward_regular_grid_center" ||
          !Number.isInteger(location.gridRow) ||
          location.gridRow < 0 ||
          location.gridRow >= 478 ||
          !Number.isInteger(location.gridColumn) ||
          location.gridColumn < 0 ||
          location.gridColumn >= 837 ||
          Math.abs(location.latitude - expectedLatitude) > 1e-9 ||
          Math.abs(location.longitude - expectedLongitude) > 1e-9 ||
          !Number.isFinite(location.modelBathymetryM) ||
          location.modelBathymetryM <= 0 ||
          !Number.isFinite(reference.latitude) ||
          !Number.isFinite(reference.longitude) ||
          !Number.isFinite(reference.distanceM) ||
          reference.distanceM <= 0 ||
          reference.distanceM > 1500 ||
          Math.abs(calculatedDistanceM - reference.distanceM) > 1 ||
          !isLakeward
        ) {
          issues.push(issue(
            "city_temperature_candidate_grid_cell_invalid",
            `${root}.waterTemperatureSource.configuredLocation`,
            "The LMHOFS location must remain a valid, surface-only, lakeward candidate on the documented regular grid and within 1.5 km of its reference structure.",
          ));
        }
      }
    }
    if (city.structures.length === 0) {
      issues.push(
        issue(
          "city_structures_missing",
          `${root}.structures`,
          "At least one structure record is required.",
        ),
      );
    }

    const structureIds = new Set<string>();
    for (const structure of city.structures) {
      if (structureIds.has(structure.structureId)) {
        issues.push(issue(
          "duplicate_structure_id",
          `${root}.structures.${structure.structureId}`,
          `Duplicate structure ID ${structure.structureId}.`,
        ));
      }
      structureIds.add(structure.structureId);
      if (!structure.limitation.trim()) {
        issues.push(issue(
          "structure_limitation_missing",
          `${root}.structures.${structure.structureId}.limitation`,
          "Every research-stage structure requires an explicit limitation.",
        ));
      }
      if (structure.disposition === "candidate") {
        if (
          structure.accessStatus !== "open_by_published_rules" ||
          structure.liveAccessStatus !== "not_live_checked" ||
          !structure.accessRoute ||
          !Number.isFinite(structure.accessRoute.latitude) ||
          !Number.isFinite(structure.accessRoute.longitude) ||
          !structure.accessRoute.streetAddress.trim() ||
          structure.accessEvidence.length === 0
        ) {
          issues.push(issue(
            "candidate_structure_access_dossier_incomplete",
            `${root}.structures.${structure.structureId}`,
            "Every covered structure requires a published public route, coordinates, evidence, and an explicit non-live status.",
          ));
        }
      }
      for (const evidence of structure.accessEvidence) {
        if (
          !evidence.evidenceId.trim() || !evidence.authority.trim() ||
          !evidence.title.trim() ||
          !/^https:\/\//.test(evidence.url) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewedAt)
        ) {
          issues.push(issue(
            "structure_access_evidence_invalid",
            `${root}.structures.${structure.structureId}.accessEvidence`,
            "Access evidence must retain an ID, authority, title, HTTPS URL, and review date.",
          ));
        }
      }
    }

    const speciesIds = new Set<string>();
    for (const citySpecies of city.species) {
      if (!retainedSpecies.has(citySpecies.speciesId)) {
        issues.push(issue(
          "unknown_city_species",
          `${root}.species.${citySpecies.speciesId}`,
          "City species must reference the retained shared roster.",
        ));
      }
      if (speciesIds.has(citySpecies.speciesId)) {
        issues.push(issue(
          "duplicate_city_species",
          `${root}.species.${citySpecies.speciesId}`,
          `Duplicate city/species profile ${citySpecies.speciesId}.`,
        ));
      }
      speciesIds.add(citySpecies.speciesId);
      if (citySpecies.ratingEnabled) {
        issues.push(issue(
          "unapproved_city_species_rating",
          `${root}.species.${citySpecies.speciesId}.ratingEnabled`,
          "No city/species rating is approved for activation.",
        ));
      }
      if (citySpecies.seasonalOpportunityCurve !== null) {
        const curve = citySpecies.seasonalOpportunityCurve;
        for (
          const curveIssue of validatePierCastSeasonalOpportunityCurve(
            curve,
          )
        ) {
          issues.push(issue(
            curveIssue,
            `${root}.species.${citySpecies.speciesId}.${curve.curveId}`,
            curveIssue,
          ));
        }
        if (
          !PIER_CAST_CORE_SPECIES_IDS.includes(
            citySpecies
              .speciesId as (typeof PIER_CAST_CORE_SPECIES_IDS)[number],
          ) || curve.calibrationStatus !== "provisional"
        ) {
          issues.push(issue(
            "seasonal_curve_outside_private_core_scope",
            `${root}.species.${citySpecies.speciesId}.seasonalOpportunityCurve`,
            "Only disabled provisional curves for the four core species are allowed.",
          ));
        }
      } else if (
        PIER_CAST_CORE_SPECIES_IDS.includes(
          citySpecies.speciesId as (typeof PIER_CAST_CORE_SPECIES_IDS)[number],
        )
      ) {
        issues.push(issue(
          "core_seasonal_curve_missing",
          `${root}.species.${citySpecies.speciesId}.seasonalOpportunityCurve`,
          "Each core city/species pairing requires its disabled provisional seasonal curve.",
        ));
      }
      if (
        PIER_CAST_CORE_SPECIES_IDS.includes(
          citySpecies.speciesId as (typeof PIER_CAST_CORE_SPECIES_IDS)[number],
        ) && citySpecies.inheritance !== "candidate"
      ) {
        issues.push(issue(
          "core_city_species_not_in_frozen_candidate_scope",
          `${root}.species.${citySpecies.speciesId}.inheritance`,
          "Every frozen v1 city/species pairing must be a candidate; evidence limitations belong in validation gates, not unresolved scope.",
        ));
      }
    }
    if (speciesIds.size !== retainedSpecies.size) {
      issues.push(issue(
        "city_species_disposition_incomplete",
        `${root}.species`,
        `Every city must disposition all ${retainedSpecies.size} retained species.`,
      ));
    }
  }
  const actualCoveredStructureIds = cities.flatMap((city) =>
    city.structures.filter((structure) => structure.disposition === "candidate")
      .map((structure) => structure.structureId)
  );
  const expectedCoveredStructureIds = new Set<string>(
    PIER_CAST_FROZEN_COVERED_STRUCTURE_IDS,
  );
  if (
    actualCoveredStructureIds.length !== expectedCoveredStructureIds.size ||
    actualCoveredStructureIds.some((structureId) =>
      !expectedCoveredStructureIds.has(structureId)
    )
  ) {
    issues.push(issue(
      "covered_structure_roster_outside_frozen_scope",
      "cityProfiles.structures",
      "PierCast v1 covered structures must match the versioned seven-structure roster.",
    ));
  }
  return issues;
}

export function validatePierCastFoundation(): PierCastValidationIssue[] {
  return [
    ...validatePierCastSpeciesProfiles(),
    ...validatePierCastCityProfiles(),
  ];
}
