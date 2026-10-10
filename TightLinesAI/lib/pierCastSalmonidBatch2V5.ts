import type {
  PierCastV3OpportunityMode,
  PierCastV3PairCalibration,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration";

export const PIER_CAST_SALMONID_BATCH2_V5_CANDIDATE_VERSION =
  "piercast-salmonid-batch2-2026-10-v1" as const;

const CHARLEVOIX_CHINOOK_SUMMER_MODE = {
  modeCalibrationId:
    "charlevoix_mi__chinook_salmon__summer_channel__batch2_2026_10_v1",
  modeId: "summer_channel",
  modeName: "Summer Channel",
  evidenceGrade: "A",
  fisheryStrength: 4.84,
  availabilityKnots: [
    { monthDay: "01-01", availability: 0 },
    { monthDay: "05-31", availability: 0 },
    { monthDay: "06-15", availability: 0.7 },
    { monthDay: "07-15", availability: 1 },
    { monthDay: "08-15", availability: 0.35 },
    { monthDay: "09-01", availability: 0 },
    { monthDay: "12-31", availability: 0 },
  ],
  thermalCurveId: "chinook_salmon__shared_temperature__v0_2",
  fisheryEvidenceIds: [
    "MI_CREEL_DASHBOARD",
    "MI_ROADMAP_LM",
  ],
  limitations: [
    "F is an ordinal prime-condition ceiling, not a catch probability.",
    "The evidence supports a modest June-through-August channel opportunity, not the prior May peak.",
    "The separate fall staging mode preserves Charlevoix's 7.2 annual Chinook ceiling.",
  ],
  promotionEligible: false,
} as const satisfies PierCastV3OpportunityMode;

const ROGERS_CITY_CHINOOK_FALL_MODE = {
  modeCalibrationId:
    "rogers_city_mi__chinook_salmon__fall_harbor_staging__batch2_2026_10_v1",
  modeId: "fall_harbor_staging",
  modeName: "Fall Harbor Staging",
  evidenceGrade: "B",
  fisheryStrength: 6,
  availabilityKnots: [
    { monthDay: "01-01", availability: 0 },
    { monthDay: "08-01", availability: 0 },
    { monthDay: "08-20", availability: 0.5 },
    { monthDay: "09-10", availability: 1 },
    { monthDay: "09-24", availability: 0.75 },
    { monthDay: "10-05", availability: 0.4 },
    { monthDay: "10-20", availability: 0.1 },
    { monthDay: "11-01", availability: 0 },
    { monthDay: "12-31", availability: 0 },
  ],
  thermalCurveId: "chinook_salmon__shared_temperature__v0_2",
  fisheryEvidenceIds: [
    "MI_CREEL_DASHBOARD",
    "MI_WEEKLY_ARCHIVE",
    "MI_ROADMAP_LH",
    "MI_DNR_WEEKLY_2024_09_11",
    "MI_DNR_WEEKLY_2025_09_10",
    "MI_DNR_WEEKLY_2026_09_16",
  ],
  limitations: [
    "F is an ordinal prime-condition ceiling, not a catch probability.",
    "Recent reports support early-to-mid-September staging, with October treated as the declining portion of the run.",
    "Temperature, weather and same-day fish movement can materially reduce the displayed opportunity.",
  ],
  promotionEligible: false,
} as const satisfies PierCastV3OpportunityMode;

const ROGERS_CITY_ATLANTIC_SPRING_MODE = {
  modeCalibrationId:
    "rogers_city_mi__atlantic_salmon__spring_early_summer_harbor__batch2_2026_10_v1",
  modeId: "spring_early_summer_harbor",
  modeName: "Spring and Early Summer Harbor",
  evidenceGrade: "B",
  fisheryStrength: 6.8,
  availabilityKnots: [
    { monthDay: "01-01", availability: 0 },
    { monthDay: "04-15", availability: 0 },
    { monthDay: "04-29", availability: 0.45 },
    { monthDay: "05-15", availability: 1 },
    { monthDay: "06-15", availability: 0.65 },
    { monthDay: "07-15", availability: 0.25 },
    { monthDay: "08-20", availability: 0 },
    { monthDay: "12-31", availability: 0 },
  ],
  thermalCurveId: "atlantic_salmon__shared_temperature__v0_1",
  fisheryEvidenceIds: [
    "MI_CREEL_DASHBOARD",
    "MI_WEEKLY_ARCHIVE",
    "MI_ROADMAP_LH",
    "LHCFAC_2026",
    "ATLANTIC_PROGRAM",
    "MI_DNR_WEEKLY_2026_05_13",
    "MI_DNR_WEEKLY_2026_05_27",
  ],
  limitations: [
    "F is an ordinal prime-condition ceiling, not a catch probability.",
    "The evidence supports a May-centered harbor opportunity continuing into early summer, not a January-through-April peak.",
    "The smaller fall mode remains independent and modes never stack.",
  ],
  promotionEligible: false,
} as const satisfies PierCastV3OpportunityMode;

const ROGERS_CITY_ATLANTIC_FALL_MODE = {
  modeCalibrationId:
    "rogers_city_mi__atlantic_salmon__fall_breakwall__batch2_2026_10_v1",
  modeId: "fall_breakwall",
  modeName: "Fall Breakwall",
  evidenceGrade: "B",
  fisheryStrength: 5.99,
  availabilityKnots: [
    { monthDay: "01-01", availability: 0 },
    { monthDay: "08-20", availability: 0 },
    { monthDay: "09-20", availability: 0.55 },
    { monthDay: "10-20", availability: 1 },
    { monthDay: "11-25", availability: 0.35 },
    { monthDay: "12-15", availability: 0 },
    { monthDay: "12-31", availability: 0 },
  ],
  thermalCurveId: "atlantic_salmon__shared_temperature__v0_1",
  fisheryEvidenceIds: [
    "MI_CREEL_DASHBOARD",
    "MI_WEEKLY_ARCHIVE",
    "MI_ROADMAP_LH",
    "LHCFAC_2026",
    "ATLANTIC_PROGRAM",
  ],
  limitations: [
    "F is an ordinal prime-condition ceiling, not a catch probability.",
    "The fall breakwall opportunity tapers to off-season by December 15 and does not imply winter availability.",
    "The stronger May-centered mode preserves Rogers City's 6.8 annual Atlantic salmon ceiling.",
  ],
  promotionEligible: false,
} as const satisfies PierCastV3OpportunityMode;

function replaceMode(
  pair: PierCastV3PairCalibration,
  existingModeId: string,
  replacement: PierCastV3OpportunityMode,
): PierCastV3PairCalibration {
  return {
    ...pair,
    modes: pair.modes.map((mode) =>
      mode.modeId === existingModeId ? replacement : mode
    ),
  };
}

/**
 * Applies owner-approved Batch 2 salmonid timing corrections to the 1.17 app
 * projection. Access remains informational and does not alter these scores.
 */
export function applyPierCastSalmonidBatch2V5(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.pairKey === "charlevoix_mi/chinook_salmon") {
    return replaceMode(
      pair,
      "spring_nearshore",
      CHARLEVOIX_CHINOOK_SUMMER_MODE,
    );
  }
  if (pair.pairKey === "rogers_city_mi/chinook_salmon") {
    return replaceMode(
      pair,
      "fall_harbor_staging",
      ROGERS_CITY_CHINOOK_FALL_MODE,
    );
  }
  if (pair.pairKey === "rogers_city_mi/atlantic_salmon") {
    return replaceMode(
      replaceMode(
        pair,
        "winter_spring_harbor",
        ROGERS_CITY_ATLANTIC_SPRING_MODE,
      ),
      "fall_breakwall",
      ROGERS_CITY_ATLANTIC_FALL_MODE,
    );
  }
  return pair;
}
