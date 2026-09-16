import { getPierCastPrivateTemperatureCurve } from "./privateCalibration.ts";
import {
  PIER_CAST_MONTHS,
  type PierCastBehaviorContext,
  type PierCastMonth,
  type PierCastMonthEvidenceState,
  type PierCastSpeciesProfile,
} from "../types.ts";
import { PIER_CAST_CORE_TEMPERATURE_CURVES } from "./coreCalibration.ts";
import { PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES } from "./speciesExpansion.generated.ts";

type MonthContextTuple = readonly [
  code: string,
  evidenceState: PierCastMonthEvidenceState,
];

const SB = "sourced_biology" as const;
// Phase 3: LF?/WD? in admitted Chinook, coho and drum profiles are explicit
// low-confidence annual calibration transfers, not sourced winter pier biology.
// See docs/PierCast_Phase3_Audit.md. Unknown context codes remain visible;
// public approval and the evaluator's absent-biology gate are unchanged.
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

function expansionTemperatureCurve(
  speciesId: PierCastSpeciesProfile["speciesId"],
) {
  const candidate = PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES.find(
    (row) => row.speciesId === speciesId,
  );
  if (!candidate) {
    throw new Error(
      `PierCast expansion temperature curve missing: ${speciesId}.`,
    );
  }
  return candidate.curve;
}

export const PIER_CAST_SPECIES_PROFILES: readonly PierCastSpeciesProfile[] = [
  profile({
    speciesId: "chinook_salmon",
    displayName: "Chinook Salmon",
    aliases: ["King Salmon"],
    behavioralProfileIds: ["lake_feeding", "mature_return_staging"],
    monthContexts: monthContexts([
      ["LF?", RT],
      ["LF?", RT],
      ["LF", SB],
      ["LF/SN", SB],
      ["LF/SN", SB],
      ["LF", SB],
      ["DS/LF", SB],
      ["LF/MR", SB],
      ["MR", SB],
      ["MR/LF", SB],
      ["LF?", RT],
      ["LF?", RT],
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
      ["LF?", RT],
      ["LF?", RT],
      ["LF/SN", SB],
      ["LF/SN", SB],
      ["LF", SB],
      ["LF", RT],
      ["DS/LF", RT],
      ["LF/MR", SB],
      ["MR", SB],
      ["MR", SB],
      ["MR/LF", SB],
      ["LF?", RT],
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
      ["WD?", RT],
      ["WD?", RT],
      ["WD/TR", RT],
      ["TR", RT],
      ["SP/LF", RT],
      ["SP/LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["TR", RT],
      ["WD?", RT],
      ["WD?", RT],
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
  profile({
    speciesId: "atlantic_salmon",
    displayName: "Atlantic Salmon",
    aliases: ["Landlocked Atlantic Salmon"],
    behavioralProfileIds: ["lake_feeding", "return_migration"],
    monthContexts: monthContexts(repeatedState([
      "LF/WA",
      "LF/WA",
      "LF/SN",
      "SN/LF",
      "LF",
      "LF",
      "DS/LF",
      "DS/LF",
      "LF/RM",
      "RM/LF",
      "LF/WA",
      "LF/WA",
    ], SB)),
    evidenceIds: ["LH_THERMAL_ATLANTIC_USGS", "LH_DNR_2024_04_24"],
  }),
  profile({
    speciesId: "northern_pike",
    displayName: "Northern Pike",
    aliases: ["Pike"],
    behavioralProfileIds: [
      "spring_shallow_spawn",
      "coolwater_ambush_feeding",
      "summer_cool_refuge",
    ],
    monthContexts: monthContexts(repeatedState([
      "WA",
      "WA",
      "SN",
      "SP",
      "SP/PR",
      "LF",
      "DS/LF",
      "DS/LF",
      "LF/TR",
      "TR",
      "WA",
      "WA",
    ], SB)),
    evidenceIds: ["LH_THERMAL_PIKE_MIDNR", "LH_DNR_2024_05_08"],
  }),
  profile({
    speciesId: "burbot",
    displayName: "Burbot",
    aliases: ["Lawyer", "Eelpout"],
    behavioralProfileIds: [
      "winter_bottom_feeding",
      "winter_spawning_aggregation",
      "warm_season_deep_refuge",
    ],
    monthContexts: monthContexts([
      ["CF/SP", SB],
      ["SP/CF", SB],
      ["CF/TR", RT],
      ["TR", RT],
      ["DS", RT],
      ["DS", RT],
      ["DS", RT],
      ["DS", RT],
      ["DS/TR", RT],
      ["TR", RT],
      ["CF", RT],
      ["CF/SP", SB],
    ]),
    evidenceIds: ["THERM_BURBOT_2016", "THERM_MI_TOLERANCE"],
    seasonalTemperatureCurves: [expansionTemperatureCurve("burbot")],
  }),
  profile({
    speciesId: "white_perch",
    displayName: "White Perch",
    aliases: [],
    behavioralProfileIds: [
      "spring_spawning_transition",
      "warm_season_schooling",
      "cold_season_deep",
    ],
    monthContexts: monthContexts([
      ["WD", RT],
      ["WD", RT],
      ["TR", RT],
      ["SP", SB],
      ["SP/PR", SB],
      ["PR/LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF/TR", RT],
      ["WD", RT],
      ["WD", RT],
    ]),
    evidenceIds: ["THERM_WHITE_PERCH_GLFC", "THERM_WHITE_PERCH_USGS"],
    seasonalTemperatureCurves: [expansionTemperatureCurve("white_perch")],
  }),
  profile({
    speciesId: "white_bass",
    displayName: "White Bass",
    aliases: ["Silver Bass"],
    behavioralProfileIds: [
      "spring_spawning_migration",
      "warm_season_schooling",
      "cold_season_deep",
    ],
    monthContexts: monthContexts([
      ["WD", RT],
      ["WD", RT],
      ["RM/TR", RT],
      ["RM/SP", SB],
      ["SP/LF", SB],
      ["LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF", RT],
      ["LF/TR", RT],
      ["WD", RT],
      ["WD", RT],
    ]),
    evidenceIds: ["THERM_WHITE_BASS_FWS", "THERM_WHITE_BASS_EPA"],
    seasonalTemperatureCurves: [expansionTemperatureCurve("white_bass")],
  }),
  profile({
    speciesId: "bluegill",
    displayName: "Bluegill",
    aliases: ["Bream"],
    behavioralProfileIds: [
      "spring_shallow_spawn",
      "warm_season_cover_feeding",
      "cold_season_deep",
    ],
    monthContexts: monthContexts([
      ["WD", RT],
      ["WD", RT],
      ["WD/TR", RT],
      ["SN/TR", RT],
      ["SN/SP", SB],
      ["SP/LF", SB],
      ["LF", RT],
      ["LF", RT],
      ["LF/TR", RT],
      ["TR", RT],
      ["WD", RT],
      ["WD", RT],
    ]),
    evidenceIds: ["THERM_BLUEGILL_MI", "THERM_MI_TOLERANCE"],
    seasonalTemperatureCurves: [expansionTemperatureCurve("bluegill")],
  }),
] as const;

export function getPierCastSpeciesProfile(
  speciesId: PierCastSpeciesProfile["speciesId"],
): PierCastSpeciesProfile | null {
  return PIER_CAST_SPECIES_PROFILES.find((profile) =>
    profile.speciesId === speciesId
  ) ?? null;
}
