import {
  PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
  type PierCastThermalBandV4,
  type PierCastThermalProfileV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "../types.ts";

/**
 * Evidence-reviewed Great Lakes pier-fishing temperature fit for 1.18.
 *
 * These are adult, modeled-nearshore-surface compatibility curves. They are
 * not lethal limits, fish-presence claims, or guarantees of a bite. Cold-side
 * shoulders remain deliberately broad for species with documented winter
 * fisheries; warm-side penalties become steeper when warming normally moves
 * fish away from pier-accessible water.
 */
export const PIER_CAST_V4_THERMAL_CALIBRATION_VERSION =
  "piercast-v4-temperature-fit-1.18-v1" as const;

const GREAT_LAKES_SURFACE_DOMAIN_C = [0, 38] as const;
const GREAT_LAKES_SURFACE_MAX_F = 100.4;

type FahrenheitSegment = {
  /** Inclusive product-facing whole-degree range (except the 100.4°F domain cap). */
  fromF: number;
  toF: number;
  band: PierCastThermalBandV4;
};

type ThermalProfileInput = {
  speciesId: Exclude<PierCastSpeciesId, "bluegill">;
  segmentsF: readonly FahrenheitSegment[];
  evidenceIds: readonly string[];
};

function celsius(fahrenheit: number): number {
  if (fahrenheit === 32) return 0;
  if (fahrenheit === GREAT_LAKES_SURFACE_MAX_F) return 38;
  return (fahrenheit - 32) * 5 / 9;
}

const ASCENDING_VALUES: Record<PierCastThermalBandV4, readonly [number, number]> = {
  poor: [0.1, 0.3499],
  fair: [0.4, 0.6499],
  good: [0.7, 0.8499],
  excellent: [1, 1],
};

const DESCENDING_VALUES: Record<PierCastThermalBandV4, readonly [number, number]> = {
  poor: [0.3499, 0.01],
  fair: [0.6499, 0.35],
  good: [0.8499, 0.65],
  excellent: [1, 1],
};

/**
 * Build a continuous score curve whose threshold bands closely follow the
 * approved whole-degree ranges. Adjacent ranges interpolate across one degree
 * instead of introducing biologically false score cliffs.
 */
function knotsFromSegments(
  segments: readonly FahrenheitSegment[],
): PierCastThermalProfileV4["knots"] {
  const excellentIndex = segments.findIndex((segment) =>
    segment.band === "excellent"
  );
  if (excellentIndex < 0) return [];
  return segments.flatMap((segment, index) => {
    const values = index < excellentIndex
      ? ASCENDING_VALUES[segment.band]
      : index > excellentIndex
      ? DESCENDING_VALUES[segment.band]
      : ASCENDING_VALUES.excellent;
    const start = {
      temperatureC: celsius(segment.fromF),
      suitability: values[0],
    };
    if (segment.fromF === segment.toF) return [start];
    return [
      start,
      {
        temperatureC: celsius(segment.toF),
        suitability: values[1],
      },
    ];
  });
}

function profile(input: ThermalProfileInput): PierCastThermalProfileV4 {
  const excellent = input.segmentsF.find((segment) =>
    segment.band === "excellent"
  );
  if (!excellent) {
    throw new Error(`PierCast temperature profile has no excellent range: ${input.speciesId}`);
  }
  return {
    schemaVersion: PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
    calibrationVersion: PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
    curveId: `${input.speciesId}__modeled_nearshore_surface__1_18_v1`,
    speciesId: input.speciesId,
    context: "modeled_nearshore_surface",
    interpretation: "surface_temperature_compatibility_not_fish_presence",
    acceptedDomainC: GREAT_LAKES_SURFACE_DOMAIN_C,
    optimumRangeC: [celsius(excellent.fromF), celsius(excellent.toF)],
    knots: knotsFromSegments(input.segmentsF),
    evidenceIds: input.evidenceIds,
    calibrationStatus: "approved_for_pilot",
  };
}

export const PIER_CAST_V4_THERMAL_PROFILES:
  readonly PierCastThermalProfileV4[] = [
    profile({
      speciesId: "chinook_salmon",
      segmentsF: [
        { fromF: 32, toF: 41, band: "fair" },
        { fromF: 42, toF: 47, band: "good" },
        { fromF: 48, toF: 57, band: "excellent" },
        { fromF: 58, toF: 63, band: "good" },
        { fromF: 64, toF: 68, band: "fair" },
        { fromF: 69, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T001", "T006", "T011", "T013"],
    }),
    profile({
      speciesId: "coho_salmon",
      segmentsF: [
        { fromF: 32, toF: 41, band: "fair" },
        { fromF: 42, toF: 49, band: "good" },
        { fromF: 50, toF: 57, band: "excellent" },
        { fromF: 58, toF: 63, band: "good" },
        { fromF: 64, toF: 68, band: "fair" },
        { fromF: 69, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T002", "T008", "T013"],
    }),
    profile({
      speciesId: "steelhead",
      segmentsF: [
        { fromF: 32, toF: 35, band: "fair" },
        { fromF: 36, toF: 41, band: "good" },
        { fromF: 42, toF: 58, band: "excellent" },
        { fromF: 59, toF: 63, band: "good" },
        { fromF: 64, toF: 68, band: "fair" },
        { fromF: 69, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T003", "T007", "T013", "T032"],
    }),
    profile({
      speciesId: "brown_trout",
      segmentsF: [
        { fromF: 32, toF: 37, band: "fair" },
        { fromF: 38, toF: 44, band: "good" },
        { fromF: 45, toF: 61, band: "excellent" },
        { fromF: 62, toF: 65, band: "good" },
        { fromF: 66, toF: 70, band: "fair" },
        { fromF: 71, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T014", "T015"],
    }),
    profile({
      speciesId: "lake_trout",
      segmentsF: [
        { fromF: 32, toF: 34, band: "fair" },
        { fromF: 35, toF: 38, band: "good" },
        { fromF: 39, toF: 54, band: "excellent" },
        { fromF: 55, toF: 58, band: "good" },
        { fromF: 59, toF: 62, band: "fair" },
        { fromF: 63, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T005", "T011", "T012", "T013", "T016"],
    }),
    profile({
      speciesId: "smallmouth_bass",
      segmentsF: [
        { fromF: 32, toF: 39, band: "poor" },
        { fromF: 40, toF: 49, band: "fair" },
        { fromF: 50, toF: 59, band: "good" },
        { fromF: 60, toF: 78, band: "excellent" },
        { fromF: 79, toF: 84, band: "good" },
        { fromF: 85, toF: 88, band: "fair" },
        { fromF: 89, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T022", "T023", "T024"],
    }),
    profile({
      speciesId: "freshwater_drum",
      segmentsF: [
        { fromF: 32, toF: 39, band: "poor" },
        { fromF: 40, toF: 49, band: "fair" },
        { fromF: 50, toF: 56, band: "good" },
        { fromF: 57, toF: 75, band: "excellent" },
        { fromF: 76, toF: 79, band: "good" },
        { fromF: 80, toF: 83, band: "fair" },
        { fromF: 84, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T025", "T026"],
    }),
    profile({
      speciesId: "yellow_perch",
      segmentsF: [
        { fromF: 32, toF: 49, band: "fair" },
        { fromF: 50, toF: 63, band: "good" },
        { fromF: 64, toF: 70, band: "excellent" },
        { fromF: 71, toF: 76, band: "good" },
        { fromF: 77, toF: 82, band: "fair" },
        { fromF: 83, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T027", "T028"],
    }),
    profile({
      speciesId: "round_whitefish",
      segmentsF: [
        { fromF: 32, toF: 33, band: "good" },
        { fromF: 34, toF: 46, band: "excellent" },
        { fromF: 47, toF: 52, band: "good" },
        { fromF: 53, toF: 59, band: "fair" },
        { fromF: 60, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T019"],
    }),
    profile({
      speciesId: "channel_catfish",
      segmentsF: [
        { fromF: 32, toF: 49, band: "poor" },
        { fromF: 50, toF: 69, band: "fair" },
        { fromF: 70, toF: 78, band: "good" },
        { fromF: 79, toF: 84, band: "excellent" },
        { fromF: 85, toF: 88, band: "good" },
        { fromF: 89, toF: 92, band: "fair" },
        { fromF: 93, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T029"],
    }),
    profile({
      speciesId: "largemouth_bass",
      segmentsF: [
        { fromF: 32, toF: 44, band: "poor" },
        { fromF: 45, toF: 59, band: "fair" },
        { fromF: 60, toF: 69, band: "good" },
        { fromF: 70, toF: 82, band: "excellent" },
        { fromF: 83, toF: 86, band: "good" },
        { fromF: 87, toF: 90, band: "fair" },
        { fromF: 91, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T022", "T030"],
    }),
    profile({
      speciesId: "walleye",
      segmentsF: [
        { fromF: 32, toF: 42, band: "fair" },
        { fromF: 43, toF: 54, band: "good" },
        { fromF: 55, toF: 72, band: "excellent" },
        { fromF: 73, toF: 78, band: "good" },
        { fromF: 79, toF: 82, band: "fair" },
        { fromF: 83, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T020", "T021", "T031"],
    }),
    profile({
      speciesId: "atlantic_salmon",
      segmentsF: [
        { fromF: 32, toF: 34, band: "fair" },
        { fromF: 35, toF: 38, band: "good" },
        { fromF: 39, toF: 54, band: "excellent" },
        { fromF: 55, toF: 59, band: "good" },
        { fromF: 60, toF: 64, band: "fair" },
        { fromF: 65, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["LH_THERMAL_ATLANTIC_USGS", "T013"],
    }),
    profile({
      speciesId: "northern_pike",
      segmentsF: [
        { fromF: 32, toF: 39, band: "fair" },
        { fromF: 40, toF: 49, band: "good" },
        { fromF: 50, toF: 68, band: "excellent" },
        { fromF: 69, toF: 74, band: "good" },
        { fromF: 75, toF: 79, band: "fair" },
        { fromF: 80, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["LH_THERMAL_PIKE_MIDNR", "T013"],
    }),
    profile({
      speciesId: "white_bass",
      segmentsF: [
        { fromF: 32, toF: 39, band: "poor" },
        { fromF: 40, toF: 49, band: "fair" },
        { fromF: 50, toF: 57, band: "good" },
        { fromF: 58, toF: 82, band: "excellent" },
        { fromF: 83, toF: 86, band: "good" },
        { fromF: 87, toF: 90, band: "fair" },
        { fromF: 91, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["THERM_WHITE_BASS_FWS", "THERM_WHITE_BASS_EPA", "T013"],
    }),
    profile({
      speciesId: "burbot",
      segmentsF: [
        { fromF: 32, toF: 50, band: "excellent" },
        { fromF: 51, toF: 57, band: "good" },
        { fromF: 58, toF: 63, band: "fair" },
        { fromF: 64, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["THERM_BURBOT_2016", "THERM_MI_TOLERANCE", "T013"],
    }),
    profile({
      speciesId: "white_perch",
      segmentsF: [
        { fromF: 32, toF: 39, band: "poor" },
        { fromF: 40, toF: 51, band: "fair" },
        { fromF: 52, toF: 63, band: "good" },
        { fromF: 64, toF: 82, band: "excellent" },
        { fromF: 83, toF: 86, band: "good" },
        { fromF: 87, toF: 90, band: "fair" },
        { fromF: 91, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["THERM_WHITE_PERCH_GLFC", "THERM_WHITE_PERCH_USGS", "T013"],
    }),
    profile({
      speciesId: "lake_whitefish",
      segmentsF: [
        { fromF: 32, toF: 33, band: "good" },
        { fromF: 34, toF: 50, band: "excellent" },
        { fromF: 51, toF: 57, band: "good" },
        { fromF: 58, toF: 63, band: "fair" },
        { fromF: 64, toF: GREAT_LAKES_SURFACE_MAX_F, band: "poor" },
      ],
      evidenceIds: ["T013", "T017", "T018"],
    }),
  ];
