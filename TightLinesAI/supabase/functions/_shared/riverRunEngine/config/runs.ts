import type { AuditedRiverRunProfile } from "../types.ts";

export const PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "pere_marquette_fall_chinook",
  riverId: "pere_marquette",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  behaviorProfile: "fall_cooling_rain_pulse",
  runWindow: {
    start: "08-25",
    peak: "09-20",
    end: "10-20",
    earlyWindowDays: 14,
    lateWindowDays: 14,
    peakWindowDays: 5,
  },
  runStrength: 5,
  baselineCoverage: {
    metric: "flow_cfs",
    hasPercentileBaselines: true,
    coveredWindowPercent: 0.9,
    minimumHistoryYears: 2,
    sourceNotes:
      "Audited PM Fall Chinook percentile baselines for flow_cfs are seeded by migration for baseline version 2026-07-08.",
  },
  waterTemperatureSource: {
    type: "air_temp_proxy",
    provider: "OpenMeteo",
    notes:
      "Launch fallback uses overnight air temperature proxy until an audited measured-water source is configured.",
  },
  temperatureRules: {
    tooWarmF: 68,
  },
  userCopyHints: {
    preRunTip: "Watch for the first cool rain and a noticeable river bump.",
    peakTip:
      "Let fishability and fresh movement signals decide how aggressive to be.",
    endingTip:
      "Late-window fish can remain, but fresh movement usually depends on conditions.",
  },
  researchNotes:
    "Launch slice for PM Fall Chinook. Dates, run strength, behavior profile, gauge basis, temperature fallback, baseline decision, and copy hints are versioned here for audit before public exposure.",
  sourceNotes:
    "USGS 04122500 is the selected official gauge. Public visibility remains validation-gated and should be promoted only after launch-slice audit acceptance.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "pm-fall-chinook-launch-audit-v1",
    notes:
      "Launch slice passed baseline, live provider, storage, endpoint, auth/rate-limit, and app integration acceptance.",
  },
};

export const RIVER_RUN_RUN_PROFILES: AuditedRiverRunProfile[] = [
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
];
