import type { AuditedRiverRunProfile } from "../types.ts";

export const PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "pere_marquette_fall_chinook",
  riverId: "pere_marquette",
  biologyProfileId: "great_lakes_chinook_v1",
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
    buildingBroadStart: "09-10",
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
    distributionScope: "broad",
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
    gaugeWeight: 0.6,
    waterTemperatureWeight: 0.4,
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
    "Beta launch hypothesis for PM Fall Chinook. Run Stage begins its pre-run watch July 1, adds nearby-water staging context July 28, starts the river window August 15, distinguishes early established distribution beginning September 1 from broadly established distribution beginning September 10, reaches the September 20 peak reference, and continues through an October 27 main-run end. It retains a November 8 historical-presence tail and uses late post-run copy through November 10 before switching to true-offseason guidance November 11. The location transition does not alter the historical-presence curve or Run Timing checkpoints. Run Timing retains its separately audited final checkpoint five days after the peak reference.",
  sourceNotes:
    "Sources: Michigan DNR Chinook species profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon ; Michigan DNR 2011 Pere Marquette River Angler Survey https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/PereMarquetteRiver-CreelReport-2011.pdf ; Michigan DNR marked/tagged fish staging context https://www.michigan.gov/dnr/things-to-do/fishing/marked-and-tagged-fish ; USGS 04122500 https://waterdata.usgs.gov/monitoring-location/USGS-04122500/ ; PMTU stations https://www.pmtu.org/ . Public visibility remains runtime-gated pending PM calibration acceptance.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "pm-fall-chinook-launch-audit-v1",
    notes:
      "Launch slice passed repository-level config, baseline, provider normalization, storage, endpoint, auth/rate-limit, copy, and app checks. Runtime release remains environment-gated pending target deployment acceptance.",
  },
};

export const PERE_MARQUETTE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "pere_marquette_fall_coho",
  riverId: "pere_marquette",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-01",
    beginningEnd: "09-20",
    buildingEstablishedStart: "10-01",
    peakStart: "10-10",
    peak: "10-20",
    peakEnd: "11-05",
    taperingEnd: "11-20",
    end: "11-30",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-02",
  },
  historicalPresence: {
    maximum: 6,
    distributionScope: "broad",
    curveVersion: "pm-fall-coho-presence-v1",
    evidenceNotes:
      "The PM supports a dependable but smaller Coho opportunity than its signature Chinook run. The curve represents early September entry, a steady build into October, a broad late-October seasonal high, meaningful November presence, and a sparse December tail. Its 6-of-10 ceiling is relative opportunity context, not a fish count.",
    sourceNotes:
      "Michigan DNR documents tributary Coho runs from early September through November, a notable late-October Manistee fishery, and migrating fish as late as Christmas in the St. Joseph. The PM angler survey places adult Chinook and Coho migration primarily from August through November and says Coho arrive later and at much lower abundance. Those sources support the September-November main window. The sparse December tail is a conservative local-product hypothesis informed by late Great Lakes exceptions and owner PM field experience, not a PM abundance survey. The 6-of-10 ceiling is likewise an accepted relative opportunity setting rather than a measured population index.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 14, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 49, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 65, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 80, fractionOfMaximum: 0.6 },
      { dayOffsetFromStart: 90, fractionOfMaximum: 0.4 },
      { dayOffsetFromStart: 105, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 117, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 121, fractionOfMaximum: 0 },
    ],
  },
  push: {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push,
    version: "pm-fall-coho-push-v1",
    hydraulic: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
    },
    rain: { ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.rain },
    temperature: {
      suitabilityLabel: "adult fall Coho migration",
      supportiveMinF: 50,
      supportiveMaxF: 62,
      tooWarmF: 68,
      migrationBarrierF: 70,
    },
    caps: { ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.caps },
    evidenceNotes:
      "Coho uses the audited PM hydraulic and precipitation response because Scottville, not species identity, measures the river response. The species-specific migration band is fully supportive from 50-62F, transitional above 62F, too warm at 68F, and migration-limiting at 70F. Rain remains precursor-only and strong positive movement language still requires a measured Scottville response.",
    sourceNotes:
      "PM hydraulics: USGS 04122500 daily means, 2016-2025. Rain: Open-Meteo archive at the audited Baldwin watershed point, 2016-2025. Temperature: PMTU measured water, prioritized Maple Leaf then Bowman and M-37. Coho biology: Michigan DNR Coho profile and Great Lakes/peer-reviewed migration-temperature literature recorded in great_lakes_coho_v1. The 2021-2025 Coho replay produced 446 usable dates with zero safety or copy violations; values remain hidden pending owner acceptance.",
  },
  fishabilityBands: {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
    evidenceNotes:
      "Scottville Fishability is a PM reach-level hydraulic calibration shared across fall migratory species. Modern September 1-November 30 daily means from 2016-2025 preserve the audited absolute bands: below 400 unusually low, 400-500 low but fishable, 500-525 transitional, 525-750 ideal, 750-1000 high but fishable, 1000-1600 very high/difficult, and 1600+ blown out. Coho acceptance replay covered all 910 dates with no band, cap, or copy violations. These are fishing-shape classifications for this gauge reach, not abundance or safety thresholds.",
    sourceNotes:
      "Hydraulics: USGS 04122500 approved daily discharge, 2016-2025. Reach context: Pere Marquette Comprehensive River Management Plan. The same Scottville reach and absolute flow behavior apply to PM Coho; species identity does not change the measured hydraulic shape. Reuse was separately verified across the complete PM Coho September-November window.",
  },
  baselineCoverage: {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.baselineCoverage,
    sourceNotes:
      "Audited PM Scottville flow_cfs baselines cover all 365 canonical calendar days for baseline version 2026-07-27 using 2016-2025 USGS daily means. The shared river baseline therefore covers the complete PM Coho staging-through-December-tail window.",
  },
  waterTemperature: {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
    sourcePriority: [
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature
        .sourcePriority,
    ],
  },
  conditionsSuggest: {
    baselineVersion: "pm-fall-coho-conditions-v1",
    temperatureSourceId: "pm_m37_temperature",
    finalCheckpointDaysAfterPeak: 5,
    minimumUsableYears: 5,
    minimumCoveragePercent: 0.8,
    aheadPercentile: 75,
    delayedPercentile: 25,
    coolEnoughPercentileCap: 75,
    gaugeWeight: 0.6,
    waterTemperatureWeight: 0.4,
  },
  researchNotes:
    "PM Fall Coho acceptance configuration. The pre-run watch begins August 15, staging context begins August 25, the river window begins September 1, the run builds through September, peaks from October 10 through November 5 around an October 20 reference, tapers through November 20, ends November 30, and retains a sparse historical-presence tail through December 31. January 1-2 uses late post-run copy before true offseason guidance. The 6-of-10 ceiling represents a dependable moderate PM opportunity and passed the full local mechanical acceptance replay; final in-app owner acceptance remains required.",
  sourceNotes:
    "Sources include the Michigan DNR Coho salmon species profile, Michigan DNR Pere Marquette fishery and angler-survey material, Great Lakes Coho stocking and life-history context, USGS 04122500 Scottville, and PMTU measured-water stations. River sources, Fishability, and provider priority are deliberately shared with PM Chinook; timing, presence, biology, migration temperature, and Run Timing baselines are Coho-specific. Local acceptance passed; public visibility remains disabled pending device-level release acceptance and explicit owner approval.",
  publicAudit: {
    isEnabled: false,
    notes:
      "Local acceptance audit passed: 446 Push dates, 910 Fishability dates, 645 integrated snapshots, five timing baselines, and 104 Coho review scenarios produced zero safety, copy, boundary, or cross-primitive violations. Public visibility remains disabled pending live hidden-production observation, release-device small-screen/accessibility acceptance, and explicit owner approval.",
  },
};

export const PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile =
  {
    runId: "pere_marquette_fall_steelhead",
    riverId: "pere_marquette",
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    displayName: "Fall Steelhead",
    species: "steelhead",
    season: "fall",
    runType: "fall_entry",
    movementEngineId: "fall_entry_cooling",
    runWindow: {
      preRunStart: "08-15",
      stagingStart: "09-01",
      start: "09-20",
      beginningEnd: "10-10",
      buildingEstablishedStart: "10-15",
      buildingBroadStart: "11-01",
      peakStart: "11-15",
      peak: "11-15",
      peakEnd: "12-04",
      taperingEnd: "12-19",
      end: "12-22",
      lateEnd: "12-23",
      postRunLateCopyEnd: "12-24",
    },
    handoff: {
      type: "winter_holding",
      start: "12-23",
      destinationRunType: "holding",
      retainedPresenceFraction: 0.875,
    },
    historicalPresence: {
      maximum: 8,
      distributionScope: "broad",
      curveVersion: "pm-fall-steelhead-presence-v2",
      evidenceNotes:
        "The PM supports a strong wild steelhead fishery. The curve allows occasional late-September entry, establishes a meaningful and increasingly broad presence by mid-October, reaches its 8-of-10 fall opportunity ceiling on November 15, and deliberately retains 70-of-100 presence on December 22. It then hands off to winter holding rather than treating those fish as having left the river. This is seasonal opportunity context, not a live fish count.",
      sourceNotes:
        "Michigan DNR describes Great Lakes steelhead tributary entry from late October into spring, with many fish entering in fall and overwintering. Pere Marquette creel and telemetry work supports a strong, largely wild fishery, meaningful December opportunity, and temperature-led movement. Occasional late-September fish are represented conservatively from accepted local field experience rather than as dependable early abundance.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
        { dayOffsetFromStart: 11, fractionOfMaximum: 0.2 },
        { dayOffsetFromStart: 20, fractionOfMaximum: 0.35 },
        { dayOffsetFromStart: 25, fractionOfMaximum: 0.45 },
        { dayOffsetFromStart: 42, fractionOfMaximum: 0.75 },
        { dayOffsetFromStart: 56, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 75, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 76, fractionOfMaximum: 0.99 },
        { dayOffsetFromStart: 90, fractionOfMaximum: 0.9 },
        { dayOffsetFromStart: 93, fractionOfMaximum: 0.875 },
      ],
    },
    push: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push,
      version: "pm-fall-steelhead-push-v1",
      hydraulic: {
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
      },
      rain: { ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.rain },
      temperature: {
        suitabilityLabel: "adult fall steelhead entry",
        coldHoldingF: 39,
        supportiveMinF: 40,
        preferredMinF: 46,
        supportiveMaxF: 52,
        tooWarmF: 60,
        migrationBarrierF: 70,
      },
      caps: {
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.caps,
        coldHolding: 49,
      },
      evidenceNotes:
        "Steelhead uses the audited PM hydraulic and rainfall response because Scottville measures the same river. The species branch weights temperature differently: 46-52F is the core fall-entry band, 40-45F remains movement-capable but increasingly favors holding, and approximately 39F or colder caps active-movement confidence while retaining in-river presence. Rain remains precursor-only and strong language still requires a measured Scottville response.",
      sourceNotes:
        "PM hydraulics: USGS 04122500 daily means, 2016-2025. Rain: Open-Meteo archive at the audited Baldwin watershed point. Temperature: prioritized PMTU measured-water stations. Species response: Michigan DNR steelhead life-history guidance and Pere Marquette/Great Lakes steelhead telemetry documenting temperature-dominant movement and a movement slowdown near 4C/39F. Thresholds are launch calibration values pending hidden acceptance replay and owner review.",
    },
    fishabilityBands: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      evidenceNotes:
        "Scottville Fishability is a PM reach-level hydraulic calibration shared across fall migratory species. The same absolute bands describe presentation control and river shape for steelhead: below 400 unusually low, 400-500 low but fishable, 500-525 transitional, 525-750 ideal, 750-1000 high but fishable, 1000-1600 very high/difficult, and 1600+ blown out. Species identity does not change the measured hydraulic shape; these are not abundance or safety thresholds.",
      sourceNotes:
        "Hydraulics: USGS 04122500 approved daily discharge, 2016-2025. Reach context: Pere Marquette Comprehensive River Management Plan. The audited Scottville reach and absolute fishing-shape thresholds are deliberately reused; the steelhead-specific differences belong to biology, timing, presence, temperature response, and winter handoff.",
    },
    baselineCoverage: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.baselineCoverage,
      sourceNotes:
        "Audited PM Scottville flow_cfs baselines cover all 365 canonical calendar days for baseline version 2026-07-27 using 2016-2025 USGS daily means, including the complete fall steelhead window.",
    },
    waterTemperature: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
      sourcePriority: [
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature
          .sourcePriority,
      ],
      notes:
        "Use Maple Leaf measured water first, then Bowman and M-37 as labeled upstream fallbacks. All sources enforce steelhead absolute thermal constraints; upstream fallbacks cannot add positive cooling credit. At approximately 39F or colder, the fall-entry Push is capped because active upstream movement slows even though fish remain in the river.",
    },
    conditionsSuggest: {
      baselineVersion: "pm-fall-steelhead-conditions-v2",
      temperatureSourceId: "pm_m37_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 5,
      minimumCoveragePercent: 0.8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: 0.4,
      waterTemperatureWeight: 0.6,
    },
    researchNotes:
      "PM fall steelhead launch configuration. Early monitoring begins August 15, condition tracking begins September 1, and the river-entry window begins September 20 so occasional late-September fish are represented without overstating dependability. Meaningful presence and broadening distribution develop by mid-October, the 8-of-10 ceiling begins November 15, tapering begins December 5, the holding transition begins December 20, and presence remains 70-of-100 on December 22. December 23 is an explicit handoff to a future winter-holding experience with different activity-focused primitives; the fall migration primitives stop rather than fabricating winter scores.",
    sourceNotes:
      "Sources include Michigan DNR steelhead biology and Great Lakes tributary timing, Michigan DNR Pere Marquette fishery/angler-survey material, Pere Marquette and broader Great Lakes telemetry, USGS 04122500 Scottville, and PMTU measured-water stations. PM hydraulics and providers are shared; biology, timing, retained presence, temperature response, condition weights, and winter handoff are steelhead-specific. Public visibility remains disabled pending the full acceptance pass and explicit owner approval.",
    publicAudit: {
      isEnabled: false,
      notes:
        "Local build audit passed: 419 Push dates, 921 Fishability dates, 570 integrated snapshots, five timing baselines, and 103 Steelhead review scenarios produced zero safety, copy, boundary, meter, or cross-primitive violations. Public visibility remains disabled pending owner acceptance, release-device small-screen/accessibility review, hidden production observation, and explicit owner approval.",
    },
  };

export const RIVER_RUN_RUN_PROFILES: AuditedRiverRunProfile[] = [
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
];
