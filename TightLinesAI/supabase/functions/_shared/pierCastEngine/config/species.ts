import { getPierCastPrivateTemperatureCurve } from "./privateCalibration.ts";
import {
  PIER_CAST_MONTHS,
  type PierCastBehaviorContext,
  type PierCastMonth,
  type PierCastMonthEvidenceState,
  type PierCastSpeciesProfile,
} from "../types.ts";
import { PIER_CAST_CORE_TEMPERATURE_CURVES } from "./coreCalibration.ts";

type MonthContextTuple = readonly [
  code: string,
  evidenceState: PierCastMonthEvidenceState,
];

const SB = "sourced_biology" as const;
const RT = "proposed_regional_transfer" as const;
const AE = "absent_biology_evidence" as const;

function monthContexts(
  values: readonly MonthContextTuple[],
): Record<PierCastMonth, PierCastBehaviorContext> {
  if (values.length !== PIER_CAST_MONTHS.length) {
    throw new Error("PierCast species profiles require exactly twelve months.");
  }
  return Object.fromEntries(
    PIER_CAST_MONTHS.map((month, index) => [
      month,
      { code: values[index][0], evidenceState: values[index][1] },
    ]),
  ) as Record<PierCastMonth, PierCastBehaviorContext>;
}

function repeatedState(
  codes: readonly string[],
  evidenceState: PierCastMonthEvidenceState,
): MonthContextTuple[] {
  return codes.map((code) => [code, evidenceState]);
}

function profile(
  input:
    & Omit<
      PierCastSpeciesProfile,
      | "calibrationStatus"
      | "seasonalTemperatureCurves"
      | "ratingEnabled"
    >
    & Partial<Pick<PierCastSpeciesProfile, "seasonalTemperatureCurves">>,
): PierCastSpeciesProfile {
  const privateCurve = getPierCastPrivateTemperatureCurve(input.speciesId);
  const seasonalTemperatureCurves = input.seasonalTemperatureCurves ??
    (privateCurve ? [privateCurve] : null);
  return {
    ...input,
    calibrationStatus: seasonalTemperatureCurves
      ? "provisional"
      : "not_calibrated",
    seasonalTemperatureCurves,
    ratingEnabled: false,
  };
}

export const PIER_CAST_SPECIES_PROFILES: readonly PierCastSpeciesProfile[] = [
  profile({
    speciesId: "chinook_salmon",
    displayName: "Chinook Salmon",
    aliases: ["King Salmon"],
    behavioralProfileIds: ["lake_feeding", "mature_return_staging"],
    monthContexts: monthContexts([
      ["LF?", AE],
      ["LF?", AE],
      ["LF", SB],
      ["LF/SN", SB],
      ["LF/SN", SB],
      ["LF", SB],
      ["DS/LF", SB],
      ["LF/MR", SB],
      ["MR", SB],
      ["MR/LF", SB],
      ["LF?", AE],
      ["LF?", AE],
    ]),
    evidenceIds: ["T001", "T006"],
    seasonalTemperatureCurves: [
      PIER_CAST_CORE_TEMPERATURE_CURVES.chinook_salmon,
    ],
  }),
  profile({
    speciesId: "coho_salmon",
    displayName: "Coho Salmon",
    aliases: [],
    behavioralProfileIds: ["lake_feeding", "mature_return_staging"],
    monthContexts: monthContexts([
      ["LF?", AE],
      ["LF?", AE],
      ["LF/SN", SB],
      ["LF/SN", SB],
      ["LF", SB],
      ["LF", RT],
      ["DS/LF", RT],
      ["LF/MR", SB],
      ["MR", SB],
      ["MR", SB],
      ["MR/LF", SB],
      ["LF?", AE],
    ]),
    evidenceIds: ["T002", "T008", "T013"],
    seasonalTemperatureCurves: [
      PIER_CAST_CORE_TEMPERATURE_CURVES.coho_salmon,
    ],
  }),
  profile({
    speciesId: "steelhead",
    displayName: "Steelhead",
    aliases: ["Lake-run Rainbow Trout"],
    behavioralProfileIds: [
      "lake_feeding",
      "return_migration",
      "post_spawn_return",
    ],
    monthContexts: monthContexts(repeatedState([
      "RM/WA",
      "RM/WA",
      "RM/SP",
      "SP/PR",
      "PR/LF",
      "LF",
      "LF",
      "LF/RM",
      "RM",
      "RM",
      "RM/WA",
      "RM/WA",
    ], SB)),
    evidenceIds: ["T003", "T007", "T009", "T010", "T032"],
    seasonalTemperatureCurves: [PIER_CAST_CORE_TEMPERATURE_CURVES.steelhead],
  }),
  profile({
    speciesId: "brown_trout",
    displayName: "Brown Trout",
    aliases: ["Lake-run Brown Trout"],
    behavioralProfileIds: ["lake_feeding", "return_staging"],
    monthContexts: monthContexts(repeatedState([
      "CF",
      "CF",
      "SN/LF",
      "SN/LF",
      "LF",
      "DS/LF",
      "DS/LF",
      "DS/MR",
      "MR/SP",
      "SP",
      "PR/CF",
      "CF",
    ], RT)),
    evidenceIds: ["T004", "T014", "T015"],
    seasonalTemperatureCurves: [PIER_CAST_CORE_TEMPERATURE_CURVES.brown_trout],
  }),
  profile({
    speciesId: "lake_trout",
    displayName: "Lake Trout",
    aliases: [],
    behavioralProfileIds: [
      "reachable_cold_water",
      "deep_summer",
      "fall_spawning_shoal",
    ],
    monthContexts: monthContexts(repeatedState([
      "CF/SN",
      "CF/SN",
      "CF/SN",
      "CF/SN",
      "TR",
      "DS",
      "DS",
      "DS",
      "DS/SP",
      "SP",
      "SP/CF",
      "CF/SN",
    ], SB)),
    evidenceIds: ["T005", "T011", "T012", "T016"],
  }),
  profile({
    speciesId: "walleye",
    displayName: "Walleye",
    aliases: [],
    behavioralProfileIds: [
      "nearshore_low_light",
      "spawning_transition",
      "offshore_or_deep",
    ],
    monthContexts: monthContexts(repeatedState([
      "WA/WD",
      "WA/WD",
      "SP/TR",
      "SP",
      "PR",
      "LF",
      "LF",
      "LF",
      "LF",
      "LF/TR",
      "WA/WD",
      "WA/WD",
    ], RT)),
    evidenceIds: ["T013", "T020", "T021", "T031"],
  }),
  profile({
    speciesId: "smallmouth_bass",
    displayName: "Smallmouth Bass",
    aliases: [],
    behavioralProfileIds: [
      "spring_harbor_spawn",
      "warm_season_feeding",
      "winter_deep",
    ],
    monthContexts: monthContexts(repeatedState([
      "WD",
      "WD",
      "WD/TR",
      "SN",
      "SP",
      "SP/PR",
      "LF",
      "LF",
      "LF/TR",
      "DS",
      "WD",
      "WD",
    ], RT)),
    evidenceIds: ["T022", "T023", "T024"],
  }),
  profile({
    speciesId: "freshwater_drum",
    displayName: "Freshwater Drum",
    aliases: ["Sheepshead"],
    behavioralProfileIds: [
      "warm_season_bottom_feeding",
      "cold_season_deep",
    ],
    monthContexts: monthContexts([
      ["WD?", AE],
      ["WD?", AE],
      ["WD/TR", RT],
      ["TR", RT],
      ["SP/LF", RT],
      ["SP/LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["TR", RT],
      ["WD?", AE],
      ["WD?", AE],
    ]),
    evidenceIds: ["T025", "T026"],
  }),
  profile({
    speciesId: "yellow_perch",
    displayName: "Yellow Perch",
    aliases: [],
    behavioralProfileIds: [
      "spring_shallow",
      "warm_season_nearshore",
      "winter_active",
    ],
    monthContexts: monthContexts(repeatedState([
      "WA",
      "WA",
      "SN/SP",
      "SP",
      "PR/LF",
      "LF",
      "LF",
      "LF",
      "SN/LF",
      "SN/LF",
      "WA",
      "WA",
    ], SB)),
    evidenceIds: ["T027", "T028"],
  }),
  profile({
    speciesId: "lake_whitefish",
    displayName: "Lake Whitefish",
    aliases: [],
    behavioralProfileIds: [
      "cold_season_feeding",
      "deep_summer",
      "fall_spawning_shoal",
    ],
    monthContexts: monthContexts(repeatedState([
      "CF",
      "CF",
      "CF",
      "CF/TR",
      "TR",
      "DS",
      "DS",
      "DS",
      "DS/TR",
      "SN/SP",
      "SP",
      "SP/CF",
    ], SB)),
    evidenceIds: ["T017", "T018"],
  }),
  profile({
    speciesId: "round_whitefish",
    displayName: "Round Whitefish",
    aliases: ["Menominee"],
    behavioralProfileIds: [
      "spring_shallow",
      "deep_summer",
      "fall_spawning_shoal",
    ],
    monthContexts: monthContexts([
      ["WD", SB],
      ["WD", SB],
      ["WD", SB],
      ["SN", SB],
      ["SN/TR", SB],
      ["DS", SB],
      ["DS", SB],
      ["DS", SB],
      ["DS/TR", SB],
      ["SN/SP", SB],
      ["SP", SB],
      ["WD/CF?", AE],
    ]),
    evidenceIds: ["T019"],
  }),
  profile({
    speciesId: "channel_catfish",
    displayName: "Channel Catfish",
    aliases: [],
    behavioralProfileIds: [
      "warm_season_nocturnal_shallow",
      "cold_season_deep",
    ],
    monthContexts: monthContexts(repeatedState([
      "WD",
      "WD",
      "WD/TR",
      "TR",
      "SP",
      "SP/LF",
      "LF",
      "LF",
      "LF",
      "TR",
      "WD",
      "WD",
    ], RT)),
    evidenceIds: ["T013", "T029"],
  }),
  profile({
    speciesId: "largemouth_bass",
    displayName: "Largemouth Bass",
    aliases: [],
    behavioralProfileIds: [
      "spring_harbor_spawn",
      "warm_shallow_feeding",
      "winter_deep",
    ],
    monthContexts: monthContexts(repeatedState([
      "WD",
      "WD",
      "WD/TR",
      "SN",
      "SP",
      "SP/PR",
      "LF",
      "LF",
      "LF/TR",
      "TR/WD",
      "WD",
      "WD",
    ], RT)),
    evidenceIds: ["T022", "T030"],
  }),
] as const;

export function getPierCastSpeciesProfile(
  speciesId: PierCastSpeciesProfile["speciesId"],
): PierCastSpeciesProfile | null {
  return PIER_CAST_SPECIES_PROFILES.find((profile) =>
    profile.speciesId === speciesId
  ) ?? null;
}
