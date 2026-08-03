import type { AuditedRiverRunProfile } from "../types.ts";

export const PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "pere_marquette_fall_chinook",
  riverId: "pere_marquette",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "07-01",
    stagingStart: "07-28",
    start: "08-15",
    beginningEnd: "08-23",
    buildingEstablishedStart: "09-01",
    peakStart: "09-15",
    peak: "09-20",
    peakEnd: "09-30",
    taperingEnd: "10-18",
    end: "10-27",
    lateEnd: "11-08",
    postRunLateCopyEnd: "11-10",
  },
  historicalPresence: {
    maximum: 10,
    curveVersion: "pm-fall-chinook-presence-v2",
    evidenceNotes:
      "The PM is a signature Great Lakes Chinook river. The revised curve represents low river presence beginning in mid-August, building through September, holding near its seasonal maximum through the end of September, remaining meaningful deeper into October, and reaching zero on November 8. It is seasonal context, not a live abundance estimate.",
    sourceNotes:
      "Michigan DNR reports Chinook upstream migration beginning in late summer, catchable river numbers by mid-August, and PM adult migration primarily from August through November. Curve anchors remain subject to PM replay and live-season acceptance.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 7, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 20, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 36, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 0.95 },
      { dayOffsetFromStart: 55, fractionOfMaximum: 0.7 },
      { dayOffsetFromStart: 71, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 85, fractionOfMaximum: 0 },
    ],
  },
  push: {
    version: "pm-fall-chinook-push-v5",
    hydraulic: {
      metric: "flow_cfs",
      sourceLabel: "Scottville",
      lowValue: 425,
      highValue: 825,
      severeHighValue: 1100,
      rising24h: {
        absolute: 15,
        percent: 2,
      },
      meaningfulRise24h: {
        absolute: 45,
        percent: 7,
      },
      sharpRise24h: {
        absolute: 85,
        percent: 13,
      },
    },
    rain: {
      meaningful48hIn: 0.35,
      strong48hIn: 0.75,
      heavy48hIn: 1.5,
    },
    temperature: {
      suitabilityLabel: "adult fall Chinook migration",
      supportiveMinF: 51,
      supportiveMaxF: 63,
      tooWarmF: 68,
      migrationBarrierF: 70,
    },
    caps: {
      staleGauge: 55,
      unknownTrend: 49,
      noGaugeResponse: 69,
      tooWarm: 69,
      migrationBarrier: 49,
      severeHighFlow: 49,
      outsideExtendedWindow: 69,
    },
    evidenceNotes:
      "Scottville 2016-2025 staging-through-late-window daily means place positive daily rises near 23/3.8% at the median, 47/7.6% at p75, and 83/13.3% at p90; rounded paired absolute/relative thresholds prevent small-base percentage spikes. PM Maple 2021-2025 daily medians show 72-hour cooling near -2.5F at p25 and -5.5F at p05. The fully supportive temperature band ends at 63F so water in the mid-to-upper 60s remains usable but receives the more conservative transitional-warm treatment. Rain is precursor-only and loses independent credit once Scottville shows a meaningful response.",
    sourceNotes:
      "Hydraulics: USGS 04122500 daily means, 2016-2025. Rain calibration: Open-Meteo archive at the audited Baldwin watershed point, 2016-2025. Temperature: PMTU Maple measured water, 2021-2025. Adult fall-Chinook migration range and warm constraints: EPA temperature issue paper https://www.epa.gov/sites/default/files/2018-01/documents/r10-water-quality-temperature-issue-paper5-2001.pdf ; Michigan timing context https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon . Thresholds are PM launch calibration values subject to in-app owner review.",
  },
  fishabilityBands: {
    version: "pm-scottville-fishability-v2",
    metric: "flow_cfs",
    sourceLabel: "Scottville",
    tooLow: { max: 400 },
    lowFishable: { min: 400, max: 500 },
    ideal: { min: 525, max: 750 },
    highFishable: { min: 750, max: 1000 },
    blownOut: { min: 1600 },
    caps: {
      staleGauge: 55,
      unknownTrend: 69,
      veryLow: 45,
      blownOut: 24,
      sharpRiseHigh: 40,
    },
    evidenceNotes:
      "PM Fall Chinook launch calibration for the lower mainstem represented by Scottville. Modern August 15-October 20 daily means from 2016-2025 (670 days) were approximately p10 416, p25 468, median 536, p75 627, p90 802, p95 1066, and p99 1458 cfs. Configured bands therefore treat below 400 as unusually low, 400-500 as low but fishable, 500-525 as the workable transition, 525-750 as ideal, 750-1000 as high but fishable, 1000-1600 as very high/difficult, and 1600+ as blown out. The 500 cfs transition prevents a below-normal Scottville reading such as 480 cfs from being overstated as Good. These are fishing-shape classifications for this gauge reach, not wading or boating safety thresholds.",
    sourceNotes:
      "Hydraulics: USGS 04122500 approved daily discharge, 2016-2025, with an 86-water-year site record. Reach context: Pere Marquette Comprehensive River Management Plan reports a stable spring-fed system, 713 cfs mean annual flow, and 497-1030 cfs mean monthly range for 1939-2006. Local high-water corroboration: April 15, 2026 reporting from Pere Marquette River Lodge and Baldwin Bait & Tackle described minimal visibility, over-bank water, and trip cancellations while Scottville daily mean discharge was about 2310 cfs. Final thresholds remain subject to in-app owner and live-season review.",
  },
  baselineCoverage: {
    metric: "flow_cfs",
    version: "2026-07-27",
    hasPercentileBaselines: true,
    coveredWindowPercent: 0.9,
    minimumHistoryYears: 10,
    sourceNotes:
      "Audited PM Fall Chinook percentile baselines for flow_cfs are seeded by migration for baseline version 2026-07-27.",
  },
  waterTemperature: {
    sourcePriority: [
      "pm_maple_leaf_temperature",
      "pm_bowman_temperature",
      "pm_m37_temperature",
    ],
    upstreamFallbackPositiveSignalCap: 0,
    notes:
      "Use Maple Leaf measured water first. Bowman and M-37 are explicitly labeled upstream measured-water fallbacks: they still enforce absolute warm-water constraints but cannot add a positive cooling contribution. If no configured measured-water source is current, temperature-dependent output is unavailable.",
  },
  conditionsSuggest: {
    baselineVersion: "pm-fall-chinook-conditions-v3",
    temperatureSourceId: "pm_m37_temperature",
    finalCheckpointDaysAfterPeak: 5,
    minimumUsableYears: 5,
    minimumCoveragePercent: 0.8,
    aheadPercentile: 75,
    delayedPercentile: 25,
    coolEnoughPercentileCap: 75,
  },
  userCopyHints: {
    stagingTip:
      "Maturing Chinook may stage in nearby Lake Michigan water, Pere Marquette Lake, or the harbor before larger numbers enter the river.",
    preRunTip:
      "The river window has not opened; nearby staging context does not confirm fish in the river.",
    peakTip:
      "Let fishability and fresh movement signals decide how aggressive to be.",
    endingTip:
      "Late-window fish can remain, but fresh movement usually depends on conditions.",
  },
  researchNotes:
    "Beta launch hypothesis for PM Fall Chinook. Run Stage begins its pre-run watch July 1, adds nearby-water staging context July 28, starts the river window August 15, uses explicit stage boundaries through an October 27 main-run end, retains a November 8 historical-presence tail, and uses late post-run copy through November 10 before switching to true-offseason guidance November 11. The September 20 peak reference, expanded peak stage, later main-run end, late post-run copy boundary, and presence curve require PM replay and live-season acceptance before runtime public release. Run Timing retains its separately audited final checkpoint five days after the peak reference.",
  sourceNotes:
    "Sources: Michigan DNR Chinook species profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon ; Michigan DNR 2011 Pere Marquette River Angler Survey https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/PereMarquetteRiver-CreelReport-2011.pdf ; Michigan DNR marked/tagged fish staging context https://www.michigan.gov/dnr/things-to-do/fishing/marked-and-tagged-fish ; USGS 04122500 https://waterdata.usgs.gov/monitoring-location/USGS-04122500/ ; PMTU stations https://www.pmtu.org/ . Public visibility remains runtime-gated pending PM calibration acceptance.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "pm-fall-chinook-launch-audit-v1",
    notes:
      "Launch slice passed repository-level config, baseline, provider normalization, storage, endpoint, auth/rate-limit, copy, and app checks. Runtime release remains environment-gated pending target deployment acceptance.",
  },
};

export const RIVER_RUN_RUN_PROFILES: AuditedRiverRunProfile[] = [
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
];
