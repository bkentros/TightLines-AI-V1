import type {
  PierCastV3OpportunityMode,
  PierCastV3PairCalibration,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration";

export const PIER_CAST_SALMONID_BATCH1_V5_CANDIDATE_VERSION =
  "piercast-salmonid-batch1-2026-10-v1" as const;

const ST_JOSEPH_CHINOOK_FALL_MODE = {
  modeCalibrationId:
    "st_joseph_mi__chinook_salmon__fall_harbor_staging__batch1_2026_10_v1",
  modeId: "fall_harbor_staging",
  modeName: "Fall Harbor Staging",
  evidenceGrade: "B",
  fisheryStrength: 5.8,
  availabilityKnots: [
    { monthDay: "08-25", availability: 0 },
    { monthDay: "09-01", availability: 0.35 },
    { monthDay: "09-10", availability: 0.75 },
    { monthDay: "09-16", availability: 1 },
    { monthDay: "09-30", availability: 0.7 },
    { monthDay: "10-15", availability: 0.25 },
    { monthDay: "11-01", availability: 0 },
  ],
  thermalCurveId: "chinook_salmon__shared_temperature__v0_2",
  fisheryEvidenceIds: [
    "MI_BETTER_WATERS",
    "MI_ROADMAP_LM",
    "STJ_BERRIEN_FISH",
    "MI_DNR_WEEKLY_2026_09_16",
    "MI_DNR_WEEKLY_2026_09_30",
  ],
  limitations: [
    "F is an ordinal prime-condition ceiling, not a catch probability.",
    "Current exact-pier reports support a recurring but inconsistent fall window; they do not support raising St. Joseph's 6.8 annual Chinook ceiling.",
    "Temperature, access, weather and same-day fish movement can materially reduce the displayed opportunity.",
  ],
  promotionEligible: false,
} as const satisfies PierCastV3OpportunityMode;

/**
 * Applies owner-approved Batch 1 salmonid corrections to the 1.17 app
 * projection without changing the shared server calibration used by live apps.
 */
export function applyPierCastSalmonidBatch1V5(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.pairKey !== "st_joseph_mi/chinook_salmon") return pair;
  if (
    pair.modes.some((mode) =>
      mode.modeCalibrationId === ST_JOSEPH_CHINOOK_FALL_MODE.modeCalibrationId
    )
  ) {
    return pair;
  }
  return {
    ...pair,
    modes: [...pair.modes, ST_JOSEPH_CHINOOK_FALL_MODE],
  };
}
