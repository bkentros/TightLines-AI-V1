import {
  PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
  type PierCastThermalProfileV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "../types.ts";

/**
 * Species-level calibration for the next-build conditions product.
 *
 * These profiles are intentionally independent of the legacy v3 temperature
 * curves. The input domain is the plausible range of modeled Great Lakes
 * nearshore surface water, not a species' lethal-tolerance range. A low match
 * means the represented surface temperature is a poor match; it never means
 * the species is absent, and it says nothing about colder water at depth.
 */
export const PIER_CAST_V4_THERMAL_CALIBRATION_VERSION =
  "piercast-v4-thermal-calibration-2026-09-v1" as const;

const GREAT_LAKES_SURFACE_DOMAIN_C = [0, 38] as const;

type ThermalProfileInput = {
  speciesId: PierCastSpeciesId;
  optimumRangeC: readonly [number, number];
  knots: PierCastThermalProfileV4["knots"];
  evidenceIds: readonly string[];
};

function profile(input: ThermalProfileInput): PierCastThermalProfileV4 {
  return {
    schemaVersion: PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
    calibrationVersion: PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
    curveId: `${input.speciesId}__modeled_nearshore_surface__2026_09_v1`,
    speciesId: input.speciesId,
    context: "modeled_nearshore_surface",
    interpretation: "surface_temperature_compatibility_not_fish_presence",
    acceptedDomainC: GREAT_LAKES_SURFACE_DOMAIN_C,
    optimumRangeC: input.optimumRangeC,
    knots: input.knots,
    evidenceIds: input.evidenceIds,
    calibrationStatus: "approved_for_pilot",
  };
}

export const PIER_CAST_V4_THERMAL_PROFILES:
  readonly PierCastThermalProfileV4[] = [
    profile({
      speciesId: "chinook_salmon",
      optimumRangeC: [10, 14],
      knots: [
        { temperatureC: 0, suitability: 0.45 },
        { temperatureC: 4, suitability: 0.65 },
        { temperatureC: 7, suitability: 0.85 },
        { temperatureC: 10, suitability: 1 },
        { temperatureC: 14, suitability: 1 },
        { temperatureC: 16, suitability: 0.85 },
        { temperatureC: 18.5, suitability: 0.65 },
        { temperatureC: 21, suitability: 0.35 },
        { temperatureC: 26, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T001", "T006", "T011", "T013"],
    }),
    profile({
      speciesId: "coho_salmon",
      optimumRangeC: [12, 14],
      knots: [
        { temperatureC: 0, suitability: 0.5 },
        { temperatureC: 4, suitability: 0.65 },
        { temperatureC: 8, suitability: 0.85 },
        { temperatureC: 12, suitability: 1 },
        { temperatureC: 14, suitability: 1 },
        { temperatureC: 16.5, suitability: 0.85 },
        { temperatureC: 19, suitability: 0.65 },
        { temperatureC: 21.5, suitability: 0.35 },
        { temperatureC: 26, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T002", "T008", "T013"],
    }),
    profile({
      speciesId: "steelhead",
      optimumRangeC: [11, 14],
      knots: [
        { temperatureC: 0, suitability: 0.65 },
        { temperatureC: 6, suitability: 0.85 },
        { temperatureC: 11, suitability: 1 },
        { temperatureC: 14, suitability: 1 },
        { temperatureC: 16.5, suitability: 0.85 },
        { temperatureC: 19, suitability: 0.65 },
        { temperatureC: 21.5, suitability: 0.35 },
        { temperatureC: 26, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T003", "T007", "T013", "T032"],
    }),
    profile({
      speciesId: "brown_trout",
      optimumRangeC: [10, 16],
      knots: [
        { temperatureC: 0, suitability: 0.6 },
        { temperatureC: 6, suitability: 0.85 },
        { temperatureC: 10, suitability: 1 },
        { temperatureC: 16, suitability: 1 },
        { temperatureC: 18, suitability: 0.85 },
        { temperatureC: 20.5, suitability: 0.65 },
        { temperatureC: 23, suitability: 0.35 },
        { temperatureC: 27, suitability: 0.08 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T013", "T014", "T015"],
    }),
    profile({
      speciesId: "lake_trout",
      optimumRangeC: [9, 12],
      knots: [
        { temperatureC: 0, suitability: 0.65 },
        { temperatureC: 4, suitability: 0.85 },
        { temperatureC: 9, suitability: 1 },
        { temperatureC: 12, suitability: 1 },
        { temperatureC: 14, suitability: 0.85 },
        { temperatureC: 16, suitability: 0.65 },
        { temperatureC: 18.5, suitability: 0.35 },
        { temperatureC: 24, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T005", "T011", "T012", "T013", "T016"],
    }),
    profile({
      speciesId: "smallmouth_bass",
      optimumRangeC: [22, 28],
      knots: [
        { temperatureC: 0, suitability: 0.2 },
        { temperatureC: 8, suitability: 0.35 },
        { temperatureC: 14, suitability: 0.65 },
        { temperatureC: 18, suitability: 0.85 },
        { temperatureC: 22, suitability: 1 },
        { temperatureC: 28, suitability: 1 },
        { temperatureC: 30.5, suitability: 0.85 },
        { temperatureC: 33, suitability: 0.65 },
        { temperatureC: 35, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.1 },
      ],
      evidenceIds: ["T013", "T022", "T023", "T024"],
    }),
    profile({
      speciesId: "freshwater_drum",
      optimumRangeC: [22, 27],
      knots: [
        { temperatureC: 0, suitability: 0.2 },
        { temperatureC: 6, suitability: 0.35 },
        { temperatureC: 12, suitability: 0.65 },
        { temperatureC: 18, suitability: 0.85 },
        { temperatureC: 22, suitability: 1 },
        { temperatureC: 27, suitability: 1 },
        { temperatureC: 29.5, suitability: 0.85 },
        { temperatureC: 31.5, suitability: 0.65 },
        { temperatureC: 34, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.08 },
      ],
      evidenceIds: ["T013", "T025", "T026"],
    }),
    profile({
      speciesId: "yellow_perch",
      optimumRangeC: [19, 22],
      knots: [
        { temperatureC: 0, suitability: 0.55 },
        { temperatureC: 8, suitability: 0.65 },
        { temperatureC: 14, suitability: 0.85 },
        { temperatureC: 19, suitability: 1 },
        { temperatureC: 22, suitability: 1 },
        { temperatureC: 24, suitability: 0.85 },
        { temperatureC: 27, suitability: 0.65 },
        { temperatureC: 30, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.05 },
      ],
      evidenceIds: ["T013", "T027", "T028"],
    }),
    profile({
      speciesId: "round_whitefish",
      optimumRangeC: [3, 8],
      knots: [
        { temperatureC: 0, suitability: 0.8 },
        { temperatureC: 3, suitability: 1 },
        { temperatureC: 8, suitability: 1 },
        { temperatureC: 10, suitability: 0.85 },
        { temperatureC: 14, suitability: 0.65 },
        { temperatureC: 18, suitability: 0.35 },
        { temperatureC: 24, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T013", "T019"],
    }),
    profile({
      speciesId: "channel_catfish",
      optimumRangeC: [25, 30],
      knots: [
        { temperatureC: 0, suitability: 0.15 },
        { temperatureC: 8, suitability: 0.35 },
        { temperatureC: 16, suitability: 0.65 },
        { temperatureC: 22, suitability: 0.85 },
        { temperatureC: 25, suitability: 1 },
        { temperatureC: 30, suitability: 1 },
        { temperatureC: 32, suitability: 0.85 },
        { temperatureC: 34, suitability: 0.65 },
        { temperatureC: 36, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.1 },
      ],
      evidenceIds: ["T013", "T029"],
    }),
    profile({
      speciesId: "largemouth_bass",
      optimumRangeC: [26, 30],
      knots: [
        { temperatureC: 0, suitability: 0.15 },
        { temperatureC: 8, suitability: 0.35 },
        { temperatureC: 16, suitability: 0.65 },
        { temperatureC: 22, suitability: 0.85 },
        { temperatureC: 26, suitability: 1 },
        { temperatureC: 30, suitability: 1 },
        { temperatureC: 32, suitability: 0.85 },
        { temperatureC: 34, suitability: 0.65 },
        { temperatureC: 36, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.1 },
      ],
      evidenceIds: ["T013", "T022", "T030"],
    }),
    profile({
      speciesId: "walleye",
      optimumRangeC: [20, 23],
      knots: [
        { temperatureC: 0, suitability: 0.45 },
        { temperatureC: 6, suitability: 0.65 },
        { temperatureC: 14, suitability: 0.85 },
        { temperatureC: 20, suitability: 1 },
        { temperatureC: 23, suitability: 1 },
        { temperatureC: 25, suitability: 0.85 },
        { temperatureC: 27.5, suitability: 0.65 },
        { temperatureC: 30, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.05 },
      ],
      evidenceIds: ["T013", "T020", "T021", "T031"],
    }),
    profile({
      speciesId: "atlantic_salmon",
      optimumRangeC: [4, 10],
      knots: [
        { temperatureC: 0, suitability: 0.55 },
        { temperatureC: 1, suitability: 0.65 },
        { temperatureC: 3, suitability: 0.85 },
        { temperatureC: 4, suitability: 1 },
        { temperatureC: 10, suitability: 1 },
        { temperatureC: 12, suitability: 0.85 },
        { temperatureC: 15, suitability: 0.65 },
        { temperatureC: 19, suitability: 0.35 },
        { temperatureC: 27.8, suitability: 0.03 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["LH_THERMAL_ATLANTIC_USGS", "T013"],
    }),
    profile({
      speciesId: "northern_pike",
      optimumRangeC: [18, 21],
      knots: [
        { temperatureC: 0, suitability: 0.45 },
        { temperatureC: 6, suitability: 0.65 },
        { temperatureC: 13, suitability: 0.85 },
        { temperatureC: 18, suitability: 1 },
        { temperatureC: 21, suitability: 1 },
        { temperatureC: 23, suitability: 0.85 },
        { temperatureC: 25, suitability: 0.65 },
        { temperatureC: 27.5, suitability: 0.35 },
        { temperatureC: 31, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["LH_THERMAL_PIKE_MIDNR", "T013"],
    }),
    profile({
      speciesId: "white_bass",
      optimumRangeC: [24, 29],
      knots: [
        { temperatureC: 0, suitability: 0.15 },
        { temperatureC: 8, suitability: 0.35 },
        { temperatureC: 14, suitability: 0.65 },
        { temperatureC: 19, suitability: 0.85 },
        { temperatureC: 24, suitability: 1 },
        { temperatureC: 29, suitability: 1 },
        { temperatureC: 31, suitability: 0.85 },
        { temperatureC: 33, suitability: 0.65 },
        { temperatureC: 35, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.1 },
      ],
      evidenceIds: ["THERM_WHITE_BASS_FWS", "THERM_WHITE_BASS_EPA", "T013"],
    }),
    profile({
      speciesId: "burbot",
      optimumRangeC: [1, 14],
      knots: [
        { temperatureC: 0, suitability: 0.95 },
        { temperatureC: 1, suitability: 1 },
        { temperatureC: 14, suitability: 1 },
        { temperatureC: 16, suitability: 0.85 },
        { temperatureC: 18, suitability: 0.65 },
        { temperatureC: 20, suitability: 0.35 },
        { temperatureC: 24, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["THERM_BURBOT_2016", "THERM_MI_TOLERANCE", "T013"],
    }),
    profile({
      speciesId: "white_perch",
      optimumRangeC: [27, 29],
      knots: [
        { temperatureC: 0, suitability: 0.12 },
        { temperatureC: 10, suitability: 0.35 },
        { temperatureC: 18, suitability: 0.65 },
        { temperatureC: 23, suitability: 0.85 },
        { temperatureC: 27, suitability: 1 },
        { temperatureC: 29, suitability: 1 },
        { temperatureC: 31, suitability: 0.85 },
        { temperatureC: 33, suitability: 0.65 },
        { temperatureC: 35, suitability: 0.35 },
        { temperatureC: 38, suitability: 0.1 },
      ],
      evidenceIds: ["THERM_WHITE_PERCH_GLFC", "THERM_WHITE_PERCH_USGS", "T013"],
    }),
    profile({
      speciesId: "lake_whitefish",
      optimumRangeC: [10, 14],
      knots: [
        { temperatureC: 0, suitability: 0.7 },
        { temperatureC: 4, suitability: 0.85 },
        { temperatureC: 8, suitability: 0.95 },
        { temperatureC: 10, suitability: 1 },
        { temperatureC: 14, suitability: 1 },
        { temperatureC: 16.5, suitability: 0.85 },
        { temperatureC: 19, suitability: 0.65 },
        { temperatureC: 21.5, suitability: 0.35 },
        { temperatureC: 26, suitability: 0.05 },
        { temperatureC: 38, suitability: 0.01 },
      ],
      evidenceIds: ["T013", "T017", "T018"],
    }),
  ];
