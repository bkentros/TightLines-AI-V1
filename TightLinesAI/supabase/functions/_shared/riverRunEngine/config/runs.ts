import type {
  AuditedObservedRiverRunProfile,
  AuditedRiverRunProfile,
} from "../types.ts";

export const PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "pere_marquette_fall_chinook",
    riverId: "pere_marquette",
    biologyProfileId: "great_lakes_chinook_v1",
    displayName: "Fall Chinook",
    species: "chinook_salmon",
    season: "fall",
    runType: "fall_spawn",
    movementEngineId: "fall_cooling",
    runStageCopyStrategy: "pere_marquette",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
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
    activity: {
      version: "pm-fall-chinook-activity-v7",
      profile: "chinook_fall_reaction",
      weights: {
        light: 0.6,
        waterTemperature: 0.15,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 45,
        preferredMinF: 50,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 70,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 59,
        ending: 49,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "09-30",
          taperingEnd: "10-18",
          endingEnd: "10-27",
        },
      },
      evidenceNotes:
        "PM Chinook Activity is a conditional responsiveness outlook, not catch probability. Actual versus clear-sky light is the dominant continuous block input, with cloud cover only as fallback context. Temperature retains three biological states while changing smoothly near their boundaries. Scottville flow position and precipitation also change continuously inside their accepted ranges. Missing inputs are omitted and reweighted, then receive one combined data-confidence reduction rather than stacked penalties so weather-only rivers can remain useful without fabricating gauges. Warm water and extreme flow reduce scores proportionally. After Peak, the complete-input floor fades continuously while a lifecycle deduction grows from 0 to 15 points through October 18; Ending then blends into the 49% residual constraint through October 27. This avoids artificial calendar cliffs while preserving genuinely low late response. Early lake-fresh fish retain partial responsiveness in tolerable warmth, while late biological deterioration still constrains favorable conditions.",
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

export const BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "big_manistee_fall_chinook",
    riverId: "big_manistee",
    biologyProfileId: "big_manistee_chinook_v1",
    displayName: "Fall Chinook",
    species: "chinook_salmon",
    season: "fall",
    runType: "fall_spawn",
    movementEngineId: "fall_cooling",
    runStageCopyStrategy: "big_manistee_tailwater",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
    runWindow: {
      preRunStart: "07-01",
      stagingStart: "08-01",
      start: "08-15",
      beginningEnd: "08-31",
      buildingEstablishedStart: "09-01",
      buildingBroadStart: "09-10",
      peakStart: "09-20",
      peak: "09-30",
      peakEnd: "10-10",
      taperingEnd: "10-20",
      end: "10-31",
      lateEnd: "11-10",
      postRunLateCopyEnd: "11-12",
    },
    historicalPresence: {
      maximum: 10,
      distributionScope: "broad",
      curveVersion: "big-manistee-fall-chinook-presence-v1",
      evidenceNotes:
        "The Big Manistee is a signature Lake Michigan Chinook river with a long, heavily used migratory corridor below Tippy Dam. This curve represents low initial river presence in mid-August, rapid broadening through September, a strong late-September/early-October seasonal maximum, meaningful late-October retention, and a sparse early-November tail. It is historical seasonal context, not a live fish count or an abundance forecast.",
      sourceNotes:
        "Michigan DNR reports Chinook upstream migration beginning in late summer and catchable river numbers by mid-August: https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon . The DNR Tippy Dam plan identifies late September through mid-October as the most popular salmon period and separates the cold tailwater from warmer water below High Bridge: https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf?hash=711FB9980B95B1D4C9FBE8F542DAAC1E&rev=f400230ab660446d8eb2234c504c56ca . The 2022-2023 DNR creel survey recorded Chinook harvest and release primarily in October across the surveyed below-Tippy reaches: https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportManisteeRiver2022-2023_est2024_12_23.pdf?hash=BAD8734AD206CEEA8313D480C7F15D25&rev=bb774710ac04492d98b8bcd8d8b795de .",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
        { dayOffsetFromStart: 7, fractionOfMaximum: 0.16 },
        { dayOffsetFromStart: 17, fractionOfMaximum: 0.3 },
        { dayOffsetFromStart: 26, fractionOfMaximum: 0.55 },
        { dayOffsetFromStart: 40, fractionOfMaximum: 0.85 },
        { dayOffsetFromStart: 46, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 56, fractionOfMaximum: 0.95 },
        { dayOffsetFromStart: 66, fractionOfMaximum: 0.72 },
        { dayOffsetFromStart: 77, fractionOfMaximum: 0.38 },
        { dayOffsetFromStart: 87, fractionOfMaximum: 0 },
      ],
    },
    activity: {
      version: "big-manistee-fall-chinook-activity-v4",
      profile: "chinook_fall_reaction",
      scopeCopy:
        "The measured conditions represent the Wellston/Tippy tailwater; water temperature, clarity, and presentation conditions can differ farther downstream.",
      earlySeasonScopeCopy:
        "This early-season score should not be applied unchanged to the lower river. If you independently verify cooler water farther downstream, Chinook responsiveness there may be higher than this Wellston-based score.",
      weights: {
        light: 0.55,
        waterTemperature: 0.2,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 46,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "10-10",
          taperingEnd: "10-20",
          endingEnd: "10-31",
        },
      },
      evidenceNotes:
        "Big Manistee Fall Chinook Activity reuses the shared Chinook responsiveness engine while calibrating its inputs to the regulated Wellston/Tippy tailwater. Effective light remains dominant because Chinook are photosensitive, measured Wellston temperature carries more weight than in the Pere Marquette calibration because Tippy creates a distinct and continuously measured tailwater regime, accepted Wellston fishability bands describe current presentation shape without duplicating Push movement credit, and precipitation remains restrained cover context. The broader 48-62F favorable response band, 68F warm constraint, and 72F barrier preserve Great Lakes Chinook biology while acknowledging that the historical Wellston record commonly remains warm during early entry. After Peak, the complete-input floor fades out and the lifecycle penalty rises continuously each day: the taper deduction moves from 0 to 15 points through October 20, then blends into the 46% ending constraint through October 31. The residual tail holds that ending constraint. This avoids artificial stage-boundary cliffs while allowing a fresher October fish to retain strong response potential and genuinely inactive deteriorating fish to remain very low. All copy explicitly limits measured conditions to the Tippy tailwater rather than claiming the full 25-mile corridor.",
    },
    push: {
      version: "big-manistee-fall-chinook-push-v1",
      hydraulic: {
        metric: "flow_cfs",
        sourceLabel: "Wellston tailwater",
        lowValue: 1200,
        highValue: 2300,
        severeHighValue: 3500,
        rising24h: {
          absolute: 50,
          percent: 3,
        },
        meaningfulRise24h: {
          absolute: 100,
          percent: 7,
        },
        sharpRise24h: {
          absolute: 180,
          percent: 12,
        },
      },
      rain: {
        meaningful48hIn: 0.35,
        strong48hIn: 0.75,
        heavy48hIn: 1.5,
      },
      temperature: {
        suitabilityLabel: "Big Manistee adult fall Chinook migration",
        coldHoldingF: 43,
        supportiveMinF: 45,
        preferredMinF: 50,
        supportiveMaxF: 64,
        tooWarmF: 68,
        migrationBarrierF: 72,
      },
      caps: {
        staleGauge: 55,
        unknownTrend: 49,
        noGaugeResponse: 69,
        tooWarm: 69,
        migrationBarrier: 49,
        severeHighFlow: 49,
        outsideExtendedWindow: 69,
        coldHolding: 49,
      },
      evidenceNotes:
        "Wellston 04125550 daily discharge from 1996-2025 gives a proper August 15-November 15 seasonal median near 1,530 CFS, p75 near 1,720, p90 near 1,950, p95 near 2,140, and p99 near 2,496. Positive daily rises in the same seasonal window have approximate absolute p50 50, p75 100, p90 175-180, with relative p50 about 3%, p75 about 6-7%, and p90 about 11-12%. Thresholds are rounded to avoid treating ordinary tailwater noise as a meaningful push. Rain remains precursor-only and cannot independently create a strong signal.",
      sourceNotes:
        "USGS 04125550 daily discharge API, 1996-2025: https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04125550&startDT=1996-10-01&endDT=2025-12-31&statCd=00003&parameterCd=00060&siteStatus=all . Michigan EGLE documents the Wellston reach as completely regulated by Tippy Dam, and Michigan DNR documents the regulated tailwater fishery. Local 2024 Big Manistee guide reports describe 1,200 CFS as low and clear with salmon still present, and 2,800-3,000 CFS as swollen or challenging: https://manisteeriverlodge.com/fishingreport/2024-archived-fishing-report/ .",
    },
    fishabilityBands: {
      version: "big-manistee-tailwater-fishability-v1",
      metric: "flow_cfs",
      sourceLabel: "Wellston tailwater",
      tooLow: { max: 1100 },
      lowFishable: { min: 1100, max: 1400 },
      ideal: { min: 1400, max: 1900 },
      highFishable: { min: 1900, max: 2500 },
      blownOut: { min: 3500 },
      caps: {
        staleGauge: 55,
        unknownTrend: 69,
        veryLow: 45,
        blownOut: 24,
        sharpRiseHigh: 40,
      },
      evidenceNotes:
        "These bands describe the fishing shape of the regulated Tippy tailwater, not safety, abundance, or the full lower river. Wellston August 15-November 15 daily discharge from 1996-2025 has p10 near 1,280 CFS, p25 near 1,370, median near 1,530, p75 near 1,720, p90 near 1,950, p95 near 2,140, and p99 near 2,496. The low band preserves the documented 1,200 CFS low-but-clear field condition; 1,400-1,900 represents the central working range; 1,900-2,500 is high but still potentially fishable; 2,500-3,500 resolves as very high/difficult; and 3,500+ is reserved for rare major-water events rather than ordinary high fall flow.",
      sourceNotes:
        "USGS 04125550 daily discharge API, 1996-2025: https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04125550&startDT=1996-10-01&endDT=2025-12-31&statCd=00003&parameterCd=00060&siteStatus=all . Michigan DNR Tippy Dam plan: https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf?hash=711FB9980B95B1D4C9FBE8F542DAAC1E&rev=f400230ab660446d8eb2234c504c56ca . Local Big Manistee guide observations: https://manisteeriverlodge.com/fishingreport/2024-archived-fishing-report/ .",
    },
    baselineCoverage: {
      metric: "flow_cfs",
      version: "big-manistee-fall-chinook-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 29,
      sourceNotes:
        "The audited baseline window covers the full fixed August 15-November 12 run lifecycle using USGS 04125550 daily discharge history from 1996-2025. Baseline generation must keep Wellston primary and must not blend Sherman or Grayling context gauges into the scored hydraulic series.",
    },
    waterTemperature: {
      sourcePriority: ["big_manistee_wellston_temperature"],
      upstreamFallbackPositiveSignalCap: 0,
      notes:
        "Use the same-gauge Wellston measured water temperature only. The 2007-2025 daily record has approximate seasonal medians of 68F for August 15-September 15, 61F for September 16-October 15, and 50F for October 16-November 15. Warm early entry is not absence; cooling through the 60s and 50s is the stronger active-movement context. Air temperature and contextual gauges cannot substitute for measured water.",
    },
    conditionsSuggest: {
      baselineVersion: "big-manistee-fall-chinook-conditions-v1",
      temperatureSourceId: "big_manistee_wellston_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 10,
      minimumCoveragePercent: 0.8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: 0.55,
      waterTemperatureWeight: 0.45,
    },
    userCopyHints: {
      stagingTip:
        "Use Lake Michigan, Manistee Lake, the harbor, and the river mouth for staging context before treating the tailwater as dependable river presence.",
      preRunTip:
        "The river calendar has not opened; nearby lake or harbor fish do not confirm broad Big Manistee river presence.",
      peakTip:
        "Use Wellston for the Tippy tailwater response, then judge lower-river clarity, access, and holding water separately.",
      endingTip:
        "Late fish can remain in deep established water, but fresh movement requires suitable cooling and a measured hydraulic response.",
    },
    researchNotes:
      "Big Manistee Fall Chinook implementation v1. The fixed seasonal calendar begins with lake and mouth staging context in August, opens dependable river presence August 15, reaches established building September 1, broadens September 10, centers the peak reference on September 30, and retains a conservative presence tail through November 10. Push and Fishability are calibrated to the Wellston Tippy tailwater, not the PM and not the full lower-river corridor. Temperature values are Big-specific and intentionally allow warm early entry while requiring stronger cooling context for active movement. This is an owner-audit beta release.",
    sourceNotes:
      "Primary sources: USGS 04125550 discharge and temperature history; Michigan DNR Chinook species profile; Michigan DNR Tippy Dam General Management Plan; Michigan DNR Manistee River below Tippy Dam fishery report; Michigan DNR 2022-2023 Manistee River creel survey; U.S. Fish and Wildlife Service Manistee recreational reach; EPA salmonid temperature literature; Manistee River Lodge local guide reports. Context gauges remain informational and are never blended. Brown trout is intentionally absent from the Big Manistee target species and run catalog.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "big-manistee-fall-chinook-research-build-v1",
      notes:
        "Research, implementation, replay, and owner-audit build are complete. Public visibility is enabled for Big Manistee Fall Chinook. Coho is now independently implemented through Activity; Steelhead Activity remains the next ordered phase.",
    },
  };

export const BIG_MANISTEE_FALL_COHO_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "big_manistee_fall_coho",
    riverId: "big_manistee",
    biologyProfileId: "great_lakes_coho_v1",
    displayName: "Fall Coho",
    species: "coho_salmon",
    season: "fall",
    runType: "fall_spawn",
    movementEngineId: "fall_cooling",
    runStageCopyStrategy: "big_manistee_tailwater",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
    runWindow: {
      preRunStart: "08-20",
      stagingStart: "09-01",
      start: "09-10",
      beginningEnd: "09-30",
      buildingEstablishedStart: "10-01",
      buildingBroadStart: "10-10",
      peakStart: "10-15",
      peak: "10-20",
      peakEnd: "10-31",
      taperingEnd: "11-10",
      end: "11-30",
      lateEnd: "12-10",
      postRunLateCopyEnd: "12-12",
    },
    historicalPresence: {
      maximum: 5,
      distributionScope: "sectional",
      curveVersion: "big-manistee-fall-coho-presence-v1",
      evidenceNotes:
        "The Big Manistee supports a recognizable, later Coho fishery, but available surveys consistently place it well below the river's signature Chinook abundance. The 5/10 ceiling represents moderate, sectional opportunity rather than a fish count: sparse September entry, a steady October build, a late-October maximum, and a declining November tail. Daily values interpolate between anchors so the meter and color progress every calendar day without forcing copy to change daily.",
      sourceNotes:
        "Michigan DNR identifies a notable late-October Manistee River Coho fishery and describes tributary runs from early September through November: https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon . DNR Status Report 2004-4 describes a much weaker Coho run than Chinook, limited mainstem natural reproduction because of warm juvenile habitat, historic High Bridge stocking, and meaningful Bear and Pine Creek reproduction: https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder4/StatusReport_ManisteeRiverTippyDam_04-4.pdf . The 2022-2023 DNR creel survey likewise records a small modern Coho component relative to Chinook: https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportManisteeRiver2022-2023_est2024_12_23.pdf . The exact 5/10 ceiling and October 20 reference are researched product calibration, not an adult-count forecast.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: 0.1 },
        { dayOffsetFromStart: 10, fractionOfMaximum: 0.2 },
        { dayOffsetFromStart: 21, fractionOfMaximum: 0.4 },
        { dayOffsetFromStart: 30, fractionOfMaximum: 0.65 },
        { dayOffsetFromStart: 35, fractionOfMaximum: 0.9 },
        { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 51, fractionOfMaximum: 0.9 },
        { dayOffsetFromStart: 61, fractionOfMaximum: 0.6 },
        { dayOffsetFromStart: 71, fractionOfMaximum: 0.4 },
        { dayOffsetFromStart: 81, fractionOfMaximum: 0.2 },
        { dayOffsetFromStart: 91, fractionOfMaximum: 0 },
      ],
    },
    activity: {
      version: "big-manistee-fall-coho-activity-v2",
      profile: "coho_fall_reaction",
      scopeCopy:
        "The measured conditions represent the Wellston/Tippy tailwater; water temperature, clarity, and presentation conditions can differ through the middle and lower migratory river.",
      weights: {
        light: 0.5,
        waterTemperature: 0.25,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 42,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "10-31",
          taperingEnd: "11-10",
          endingEnd: "11-30",
        },
      },
      evidenceNotes:
        "Big Manistee Coho Activity is a conditional responsiveness outlook for a Coho already present, not abundance or catch probability. The evidence-supported adult Coho response band remains 45-60F because species physiology does not change by river, while every live input is independently bound to the regulated Wellston/Tippy tailwater: measured USGS 04125550 temperature, accepted Big Manistee flow-shape bands, and the Wellston weather point. Effective light remains the leading block input, measured water temperature carries 25%, river behavior 15%, and precipitation 10%. After the October 31 Peak shoulder, the complete-input 15-25 floor fades continuously while the lifecycle deduction grows from 0 to 15 points through November 10. Ending then blends into the 42% residual constraint through November 30. This preserves fresher-fish response without calendar cliffs and permits genuinely low activity as semelparous fish deteriorate. Copy explicitly limits the measurement claim to the Tippy tailwater and separates response from the run's lower, sectional abundance.",
    },
    push: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push,
      version: "big-manistee-fall-coho-push-v1",
      hydraulic: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic },
      rain: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.rain },
      temperature: {
        suitabilityLabel: "Big Manistee adult fall Coho migration",
        supportiveMinF: 50,
        supportiveMaxF: 62,
        tooWarmF: 68,
        migrationBarrierF: 70,
      },
      caps: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.caps },
      evidenceNotes:
        "Coho reuses the audited Wellston hydraulic response because the gauge measures the same regulated river reach regardless of salmon species. Rain remains precursor-only and cannot independently produce strong movement language. The species-specific measured-water band is supportive from 50-62F, transitional above 62F, too warm at 68F, and migration-limiting at 70F.",
      sourceNotes:
        "Hydraulics use USGS 04125550 daily discharge history from 1996-2025 and the accepted Big Manistee tailwater thresholds. Temperature uses measured USGS 04125550 water temperature and the Great Lakes Coho biology profile. No air-temperature or upstream-gauge substitute is permitted.",
    },
    fishabilityBands: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      evidenceNotes:
        "The accepted Wellston bands are shared across fall migratory species because they describe the regulated Tippy-tailwater fishing shape, not salmon abundance. They remain explicitly limited to the gauged tailwater: below 1,100 unusually low, 1,100-1,400 low but fishable, 1,400-1,900 ideal, 1,900-2,500 high but fishable, 2,500-3,500 very high/difficult, and 3,500+ blown out.",
    },
    baselineCoverage: {
      metric: "flow_cfs",
      version: "big-manistee-fall-coho-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 29,
      sourceNotes:
        "The shared Wellston daily-flow history covers the complete September 10-December 12 Coho lifecycle. Baseline generation keeps USGS 04125550 primary and never blends Sherman or Grayling context gauges into the scored series.",
    },
    waterTemperature: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
      notes:
        "Use only same-gauge Wellston measured water temperature. The later Coho calendar normally overlaps stronger fall cooling than early Chinook entry; 50-62F is supportive migration context. Air temperature and contextual upstream gauges cannot substitute for measured water.",
    },
    conditionsSuggest: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest,
      baselineVersion: "big-manistee-fall-coho-conditions-v1",
    },
    userCopyHints: {
      stagingTip:
        "Start with Manistee Lake, the river mouth, and the lower migratory river; use a Tippy-tailwater check only as reconnaissance before dependable inland presence develops.",
      preRunTip:
        "Lake and harbor Coho do not prove the 25-mile migratory corridor has filled in.",
      peakTip:
        "Compare the Tippy tailwater, High Bridge-Bear Creek middle corridor, and lower migratory river; sectional opportunity does not mean every good-looking hole holds fish.",
      endingTip:
        "Concentrate on select deep holding areas, seek genuinely fresh fish, and leave spawning or deteriorated fish alone.",
    },
    researchNotes:
      "Big Manistee Fall Coho research build. Monitoring begins August 20, staging context begins September 1, sparse river presence begins September 10, the opportunity builds through October, reaches a moderate 50/100 sectional maximum on October 20, tapers through November, and reaches zero December 10. The calendar is later and lower than Chinook but uses the same validated river hydraulics and daily interpolation engine.",
    sourceNotes:
      "Primary evidence: Michigan DNR Coho species profile; DNR Manistee River below Tippy Status Report 2004-4; DNR 2022-2023 below-Tippy creel survey; DNR Tippy Dam plan; USGS 04125550 discharge and measured-water-temperature histories; U.S. Fish and Wildlife Service Manistee recreational corridor. The profile uses named migratory reaches so novice anglers are never directed ambiguously above Tippy Dam.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "big-manistee-fall-coho-activity-audit-v1",
      notes:
        "Research, river-specific Activity implementation, 2007-2025 replay, and owner acceptance coverage are complete. Public visibility supports direct app review of the 50-point presence ceiling, October 20 peak, sectional reach copy, shared hydraulics, Coho-specific timing, and continuously interpolated late Activity lifecycle.",
    },
  };

export const BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "big_manistee_fall_steelhead",
    riverId: "big_manistee",
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    displayName: "Fall Steelhead",
    species: "steelhead",
    season: "fall",
    runType: "fall_entry",
    movementEngineId: "fall_entry_cooling",
    runStageCopyStrategy: "big_manistee_tailwater",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
    runWindow: {
      preRunStart: "08-15",
      stagingStart: "09-01",
      start: "09-15",
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
    historicalPresence: {
      maximum: 8,
      distributionScope: "broad",
      curveVersion: "big-manistee-fall-steelhead-presence-v1",
      evidenceNotes:
        "The Big Manistee supports a strong, broadly distributed fall Steelhead fishery sustained by winter-run and Skamania stocking, natural reproduction, and a long below-Tippy corridor. This fall-entry curve opens with a restrained September 15 scouting phase, builds through October, reaches an 8/10 seasonal ceiling on November 15, remains high through early December, and retains 70/100 on December 22 before handing off to winter holding. It is seasonal opportunity context, not a live fish count.",
      sourceNotes:
        "Michigan DNR Status Report 2004-4 documents historic annual targets of approximately 50,000 Little Manistee winter-run and 34,000 Skamania summer-run yearlings, 24-41.5% naturally reproduced fish in sampled catches, and 1999-2003 harvest estimates of 12,204-22,091 Steelhead annually (18,610 average): https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0088_2004_ManisteeRiver.pdf . The 2022-2023 creel survey recorded the strongest fall Rainbow Trout harvest and release in November, with meaningful December retention: https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportManisteeRiver2022-2023_est2024_12_23.pdf . Federal and DNR sources characterize the below-Tippy Steelhead fishery as superior or world-class. The exact 8/10 ceiling is researched product calibration rather than an adult-count forecast.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
        { dayOffsetFromStart: 5, fractionOfMaximum: 0.1 },
        { dayOffsetFromStart: 16, fractionOfMaximum: 0.2 },
        { dayOffsetFromStart: 25, fractionOfMaximum: 0.35 },
        { dayOffsetFromStart: 30, fractionOfMaximum: 0.45 },
        { dayOffsetFromStart: 40, fractionOfMaximum: 0.6 },
        { dayOffsetFromStart: 47, fractionOfMaximum: 0.75 },
        { dayOffsetFromStart: 56, fractionOfMaximum: 0.9 },
        { dayOffsetFromStart: 61, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 80, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 86, fractionOfMaximum: 0.96 },
        { dayOffsetFromStart: 95, fractionOfMaximum: 0.9 },
        { dayOffsetFromStart: 98, fractionOfMaximum: 0.875 },
      ],
    },
    activity: {
      version: "big-manistee-fall-steelhead-activity-v1",
      profile: "steelhead_feeding",
      weights: {
        light: 0.25,
        waterTemperature: 0.5,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 39,
        preferredMinF: 44,
        preferredMaxF: 56,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 100,
      },
      scopeCopy:
        "River measurements describe the Wellston/Tippy tailwater; conditions can differ farther downstream through the long migratory corridor.",
      evidenceNotes:
        "Big Manistee Fall Steelhead Activity describes feeding and aggressive responsiveness for fish already present, not migration, abundance, or catch probability. It reuses the audited Steelhead response model while binding every river input to the Big Manistee: same-gauge USGS 04125550 measured water temperature, accepted Wellston flow-shape bands, and the Wellston weather point. Measured temperature leads at 50%, with 44-56F favorable and 48-54F the apex; light carries 25%, river behavior 15%, and weather 10%. This regulated tailwater can retain favorable thermal conditions differently from the Pere Marquette, but the adult Steelhead biological response thresholds remain species-specific rather than invented per river. Steelhead receive no salmon conditional floor, lifecycle deduction, late ceiling, or ending constraint. Late-fall and holding-transition scores respond only to measured temperature, hydraulics, light, weather, and data confidence because these fish remain alive and overwinter in the river.",
    },
    push: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push,
      version: "big-manistee-fall-steelhead-push-v1",
      hydraulic: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic },
      rain: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.rain },
      temperature: {
        suitabilityLabel: "Big Manistee adult fall Steelhead entry",
        coldHoldingF: 39,
        supportiveMinF: 40,
        preferredMinF: 46,
        supportiveMaxF: 52,
        tooWarmF: 60,
        migrationBarrierF: 70,
      },
      caps: {
        ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.caps,
        coldHolding: 49,
      },
      evidenceNotes:
        "Steelhead reuses the accepted Wellston hydraulic response because USGS 04125550 measures the same regulated tailwater regardless of species. Its temperature branch is distinct: 46-52F is core fall-entry water, 40-45F remains movement-capable while increasingly favoring holding, and approximately 39F or colder caps active-movement confidence without erasing fish already in the river. Rain remains precursor-only and is absorbed once the measured gauge responds.",
      sourceNotes:
        "Hydraulics use USGS 04125550 daily discharge history and the accepted Big Manistee thresholds. Temperature uses measured USGS 04125550 water and the Great Lakes Steelhead fall-entry biology profile. Michigan DNR life-history guidance and Great Lakes telemetry support temperature-dominant fall entry and cold-water transition into winter holding. No air-temperature or upstream-gauge substitute is permitted.",
    },
    fishabilityBands: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      evidenceNotes:
        "The accepted Wellston bands are shared because they classify the regulated Tippy-tailwater fishing shape rather than species abundance: below 1,100 unusually low, 1,100-1,400 low but fishable, 1,400-1,900 ideal, 1,900-2,500 high but fishable, 2,500-3,500 very high/difficult, and 3,500+ blown out. They do not certify downstream conditions or personal safety.",
    },
    baselineCoverage: {
      metric: "flow_cfs",
      version: "big-manistee-fall-steelhead-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 29,
      sourceNotes:
        "The Wellston daily-flow archive covers the complete September 15-December 24 fall-entry lifecycle. Baseline generation keeps USGS 04125550 primary and never blends Sherman or Grayling context gauges into the scored series.",
    },
    waterTemperature: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
      notes:
        "Use only same-gauge Wellston measured water temperature. Fall Steelhead entry is strongest around 46-52F, remains plausible at 40-45F, and transitions toward holding around 39F or colder. Air temperature and contextual upstream gauges cannot substitute for measured water.",
    },
    conditionsSuggest: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest,
      baselineVersion: "big-manistee-fall-steelhead-conditions-v1",
      gaugeWeight: 0.4,
      waterTemperatureWeight: 0.6,
    },
    userCopyHints: {
      stagingTip:
        "Early Steelhead may enter in September. Begin with Manistee Lake, the river entrance, and the Lower river when evaluating fresh fall entry.",
      preRunTip:
        "An early Steelhead is real, but one fish does not prove the broader fall-entry build is ahead of schedule.",
      peakTip:
        "Start in the Upper river (High Bridge–Tippy Dam), emphasizing the Tippy Dam area. Compare the Middle river for fresher fish.",
      endingTip:
        "Use deep, speed-controlled Upper-river holding water while recognizing that the fall-entry model ends after December 22.",
    },
    researchNotes:
      "Big Manistee Fall Steelhead research build. Pre-run context begins August 15, with early Steelhead possible before dependable entry. The scored fall-entry phase starts September 15, reaches 8/100 September 20, becomes established October 15, broadens November 1, reaches 80/100 on November 15, and remains high through December 22. December 23 closes this fall-entry experience without implying that Steelhead left the river.",
    sourceNotes:
      "Primary evidence: Michigan DNR Manistee River below Tippy Status Report 2004-4; DNR 2022-2023 creel survey; DNR Steelhead profile; DNR Tippy Dam plan; USFWS Manistee River profile; USGS 04125550 discharge and measured-water-temperature history. Historical strain evidence remains research context; public copy describes September fish as early Steelhead unless direct evidence establishes strain identity.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "big-manistee-fall-steelhead-copy-audit-v2",
      notes:
        "Owner-approved copy renovation uses early-Steelhead language, the three approved public sections, Upper-river Wellston scope, and a scoreless Fall entry complete terminal state. Underlying calendars, thresholds, and the 80-point November 15 presence ceiling remain unchanged.",
    },
  };

const MUSKEGON_SHARED_FISHABILITY = {
  version: "muskegon-croton-tailwater-fishability-v1",
  metric: "flow_cfs" as const,
  sourceLabel: "Croton tailwater",
  tooLow: { max: 900 },
  lowFishable: { min: 900, max: 1200 },
  ideal: { min: 1200, max: 2000 },
  highFishable: { min: 2000, max: 3000 },
  blownOut: { min: 5000 },
  caps: {
    staleGauge: 55,
    unknownTrend: 69,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "These bands describe the regulated Croton tailwater only. In 2007–2025 Aug 15–Dec 24 daily values, approximate percentiles were p5 927, p10 1,010, p25 1,160, median 1,410, p75 1,850, p90 2,310, p95 3,010, and p99 3,990 CFS. The 3,000–5,000 interval is very high/difficult; 5,000+ is reserved for exceptional water. A gauge label never certifies downstream conditions or safety.",
  sourceNotes:
    "USGS 04121970 daily discharge, 2007–2025; USGS station metadata identifying completely regulated flow; Michigan DNR description of the large, swift Croton-to-Newaygo reach.",
};

const MUSKEGON_SHARED_PUSH = {
  version: "muskegon-croton-push-v1",
  hydraulic: {
    metric: "flow_cfs" as const,
    sourceLabel: "Croton tailwater",
    lowValue: 900,
    highValue: 3000,
    severeHighValue: 5000,
    rising24h: { absolute: 70, percent: 5 },
    meaningfulRise24h: { absolute: 150, percent: 10 },
    sharpRise24h: { absolute: 310, percent: 20 },
  },
  rain: { meaningful48hIn: 0.35, strong48hIn: 0.75, heavy48hIn: 1.5 },
  temperature: {
    suitabilityLabel: "Muskegon fall migration",
    coldHoldingF: 43,
    supportiveMinF: 45,
    preferredMinF: 50,
    supportiveMaxF: 64,
    tooWarmF: 68,
    migrationBarrierF: 72,
  },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    noGaugeResponse: 69,
    tooWarm: 69,
    migrationBarrier: 49,
    severeHighFlow: 49,
    outsideExtendedWindow: 69,
    coldHolding: 49,
  },
  evidenceNotes:
    "Croton positive daily rises during the 2007–2025 Aug 15–Dec 24 audit were approximately p50 70 CFS/4.7%, p75 150/10.7%, and p90 310/20.4%. Rain remains precursor-only: Strong requires a meaningful measured rise and Very Strong requires a sharp measured rise.",
  sourceNotes:
    "USGS 04121970 daily discharge and measured water temperature. No upstream gauge, reservoir series, or air temperature is blended into the scored signal.",
};

export const MUSKEGON_FALL_CHINOOK_RUN_PROFILE: AuditedObservedRiverRunProfile =
  {
    ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
    runId: "muskegon_fall_chinook",
    riverId: "muskegon",
    biologyProfileId: "muskegon_chinook_v1",
    runStageCopyStrategy: "muskegon_croton_tailwater",
    runWindow: {
      preRunStart: "07-15",
      stagingStart: "08-10",
      start: "08-20",
      beginningEnd: "09-04",
      buildingEstablishedStart: "09-05",
      buildingBroadStart: "09-15",
      peakStart: "09-25",
      peak: "10-01",
      peakEnd: "10-12",
      taperingEnd: "10-25",
      end: "11-05",
      lateEnd: "11-12",
      postRunLateCopyEnd: "11-14",
    },
    historicalPresence: {
      maximum: 9,
      distributionScope: "broad",
      curveVersion: "muskegon-fall-chinook-presence-v1",
      evidenceNotes:
        "The DNR describes very good September–October Chinook fishing from Muskegon Lake to Croton Dam. This 9/10 curve models a major broad opportunity without equating seasonal context to abundance.",
      sourceNotes:
        "Michigan DNR Central Lake Michigan Management Unit; DNR Muskegon River Angler Survey 1985–2005; current DNR stocking and species material.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
        { dayOffsetFromStart: 7, fractionOfMaximum: .14 },
        { dayOffsetFromStart: 16, fractionOfMaximum: .3 },
        { dayOffsetFromStart: 26, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 36, fractionOfMaximum: .82 },
        { dayOffsetFromStart: 42, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 53, fractionOfMaximum: .92 },
        { dayOffsetFromStart: 66, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 77, fractionOfMaximum: .2 },
        { dayOffsetFromStart: 84, fractionOfMaximum: 0 },
      ],
    },
    activity: {
      version: "muskegon-fall-chinook-activity-v2",
      profile: "chinook_fall_reaction",
      scopeCopy:
        "The measured conditions represent the Croton Dam area within the Upper river (Newaygo–Croton Dam). Conditions can differ elsewhere in the Upper river, Middle river, Lower river, Muskegon Lake, and channel.",
      weights: {
        light: .55,
        waterTemperature: .2,
        riverBehavior: .15,
        weather: .1,
      },
      temperature: {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 46,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "10-12",
          taperingEnd: "10-25",
          endingEnd: "11-05",
        },
      },
      evidenceNotes:
        "Muskegon Fall Chinook Activity is a conditional responsiveness outlook for a Chinook already present, never abundance, catch probability, or fresh movement. Effective light leads the model, while same-station measured Croton water temperature receives 20% because Croton Dam creates a regulated thermal and hydraulic regime with a continuous 2007-2025 common record. The 55/20/15/10 component balance and 48-62F favorable response band share defensible adult Chinook response assumptions with the other large regulated Lake Michigan tailwater; Muskegon remains independent through its Croton observations, hydraulic bands, calendar, scope, and replay. Croton flow position describes presentation shape only and precipitation remains restrained cover context. The 68F warm constraint and 72F barrier avoid treating warm early entry as absence without calling thermally stressed fish broadly responsive. After the October 12 Peak shoulder, the complete-input response floor fades continuously while a 15-point lifecycle deduction grows through October 25. Ending then blends continuously into a 46% residual constraint through November 5, which remains through the sparse November 12 tail. This permits an individual living fish to outperform the expected read while preventing favorable weather from overstating the typical responsiveness of spawning, deteriorating, or spent salmon. Every measurement claim is limited to the Croton tailwater and must not be extrapolated as direct measurement of the 42-mile corridor.",
    },
    push: {
      ...MUSKEGON_SHARED_PUSH,
      temperature: {
        suitabilityLabel: "Muskegon adult fall Chinook migration",
        coldHoldingF: 43,
        supportiveMinF: 45,
        preferredMinF: 50,
        supportiveMaxF: 64,
        tooWarmF: 68,
        migrationBarrierF: 72,
      },
    },
    fishabilityBands: MUSKEGON_SHARED_FISHABILITY,
    baselineCoverage: {
      metric: "flow_cfs",
      version: "muskegon-fall-chinook-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 19,
      sourceNotes:
        "USGS 04121970 provides the complete fixed lifecycle and a 2007–2025 common discharge/temperature replay.",
    },
    waterTemperature: {
      sourcePriority: ["muskegon_croton_temperature"],
      upstreamFallbackPositiveSignalCap: 0,
      notes:
        "Use only same-gauge measured Croton-tailwater water temperature. Air temperature and upstream readings cannot substitute.",
    },
    conditionsSuggest: {
      baselineVersion: "muskegon-fall-chinook-conditions-v1",
      temperatureSourceId: "muskegon_croton_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 10,
      minimumCoveragePercent: .8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: .55,
      waterTemperatureWeight: .45,
    },
    userCopyHints: {
      stagingTip:
        "Check Muskegon Lake, the Lake Michigan channel, and the river entrance before dependable river entry.",
      preRunTip: "Lake staging does not prove inland occupation.",
      peakTip:
        "Start in the Upper river (Newaygo–Croton Dam), emphasizing the Croton Dam area. Compare the Middle river for fresher fish.",
      endingTip:
        "Use deep established water and require measured response before inferring fresh movement.",
    },
    researchNotes:
      "Muskegon Fall Chinook v1: lakeward staging precedes an August 20 river opening, broad September build, October 1 reference maximum, and conservative November tail.",
    sourceNotes:
      "USGS 04121970; Michigan DNR Central Lake Michigan Management Unit; DNR Muskegon River Angler Survey; DNR Chinook profile. Croton Dam is an absolute upstream boundary.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "muskegon-fall-chinook-build-v1",
      notes: "Enabled for owner audit after configuration and source review.",
    },
  };

export const MUSKEGON_FALL_COHO_RUN_PROFILE: AuditedObservedRiverRunProfile = {
  ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
  runId: "muskegon_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  primitiveCapabilities: {
    ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE.primitiveCapabilities,
    activity: { status: "available" },
  },
  activity: {
    version: "muskegon-fall-coho-activity-v1",
    profile: "coho_fall_reaction",
    scopeCopy:
      "The measured conditions represent the Croton Dam area within the Upper river (Newaygo–Croton Dam). Conditions can differ elsewhere in the Upper river, Middle river, Lower river, Muskegon Lake, and channel.",
    weights: {
      light: 0.5,
      waterTemperature: 0.25,
      riverBehavior: 0.15,
      weather: 0.1,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 64,
      barrierF: 68,
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      tomorrow: 79,
      lateRun: 100,
      ending: 42,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: "11-05",
        taperingEnd: "11-15",
        endingEnd: "11-30",
      },
    },
    evidenceNotes:
      "Muskegon Fall Coho Activity describes how responsive a Coho already in the river may be; it does not estimate abundance, fresh movement, or catch probability. The adult Coho response model remains species-specific at 50% effective light, 25% measured water temperature, 15% Croton river behavior, and 10% precipitation context. The 45-60F preferred response band, 64F warm constraint, and 68F barrier follow the accepted Great Lakes Coho biology used on other rivers, while all observations and hydraulic bands are independently bound to USGS 04121970 at Croton. After the November 5 Peak shoulder, the complete-input response floor fades and a 15-point lifecycle deduction grows continuously through November 15. Ending then blends into a 42% ceiling through November 30 and keeps that constraint through the sparse December 7 tail. This allows a later bright fish to respond well without letting favorable weather overstate the typical activity of spawning, deteriorating, or spent Coho. The Croton reading must not be treated as a measurement of the full river to Muskegon Lake.",
  },
  runWindow: {
    preRunStart: "08-20",
    stagingStart: "09-05",
    start: "09-15",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-12",
    peakStart: "10-20",
    peak: "10-25",
    peakEnd: "11-05",
    taperingEnd: "11-15",
    end: "11-30",
    lateEnd: "12-07",
    postRunLateCopyEnd: "12-09",
  },
  historicalPresence: {
    maximum: 3,
    distributionScope: "sectional",
    curveVersion: "muskegon-fall-coho-presence-v1",
    evidenceNotes:
      "Coho support a recognizable but limited and sectional Muskegon opportunity. The 3/10 ceiling prevents nearby Lake Michigan strength or Chinook prominence from being misrepresented as a strong river-wide Coho run.",
    sourceNotes:
      "Michigan DNR Coho profile, Muskegon creel archives, stocking records, and Central Lake Michigan Management Unit context.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 27, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 35, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 61, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 76, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 83, fractionOfMaximum: 0 },
    ],
  },
  push: {
    ...MUSKEGON_SHARED_PUSH,
    version: "muskegon-fall-coho-push-v1",
    temperature: {
      suitabilityLabel: "Muskegon adult fall Coho migration",
      supportiveMinF: 50,
      supportiveMaxF: 62,
      tooWarmF: 68,
      migrationBarrierF: 70,
    },
  },
  baselineCoverage: {
    metric: "flow_cfs",
    version: "muskegon-fall-coho-flow-baseline-v1",
    hasPercentileBaselines: true,
    coveredWindowPercent: 1,
    minimumHistoryYears: 19,
    sourceNotes:
      "USGS 04121970 common measured discharge/temperature history, 2007–2025.",
  },
  conditionsSuggest: {
    ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest,
    baselineVersion: "muskegon-fall-coho-conditions-v1",
  },
  researchNotes:
    "Muskegon Coho is deliberately later, weaker, and more sectional than Chinook; October 25 is a moderate seasonal reference, not a count forecast.",
  sourceNotes:
    "Michigan DNR Coho profile, Muskegon creel archive and stocking context; USGS 04121970. Evidence supports inclusion but with substantial strength uncertainty.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "muskegon-fall-coho-build-v1",
    notes:
      "Enabled for owner audit with a deliberately conservative 3/10 ceiling.",
  },
};

export const MUSKEGON_FALL_STEELHEAD_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
    runId: "muskegon_fall_steelhead",
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    displayName: "Fall Steelhead",
    species: "steelhead",
    runType: "fall_entry",
    movementEngineId: "fall_entry_cooling",
    primitiveCapabilities: {
      ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE.primitiveCapabilities,
      activity: { status: "available" },
    },
    activity: {
      version: "muskegon-fall-steelhead-activity-v1",
      profile: "steelhead_feeding",
      scopeCopy:
        "The measured conditions represent the Croton Dam area within the Upper river (Newaygo–Croton Dam). Conditions can differ elsewhere in the Upper river, Middle river, Lower river, Muskegon Lake, and channel.",
      weights: {
        light: .25,
        waterTemperature: .5,
        riverBehavior: .15,
        weather: .1,
      },
      temperature: {
        coldF: 39,
        preferredMinF: 44,
        preferredMaxF: 56,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 100,
      },
      evidenceNotes:
        "Muskegon Fall Steelhead Activity describes feeding and aggressive responsiveness for a living Steelhead already in the river, not abundance, fresh movement, or catch probability. Measured Croton water temperature leads at 50%, effective light carries 25%, Croton river behavior 15%, and precipitation context 10%. The 44-56F favorable response range, with the strongest response centered near 48-54F, follows the accepted Great Lakes Steelhead feeding model; 39F marks a shift toward slower cold-water holding rather than fish leaving the river. Every river observation is independently bound to USGS 04121970 and the accepted Croton flow-shape bands. Steelhead receive no salmon response floor, spawning deterioration penalty, lifecycle ramp, late ceiling, or ending constraint. The same environmental inputs produce the same responsiveness at Peak, Tapering, Ending, and the December winter-holding handoff because these fish remain alive, can feed through winter, and may spawn in spring. The Croton reading must not be treated as a measurement of the full river to Muskegon Lake.",
    },
    runWindow: {
      preRunStart: "08-20",
      stagingStart: "09-10",
      start: "09-25",
      beginningEnd: "10-10",
      buildingEstablishedStart: "10-15",
      buildingBroadStart: "11-01",
      peakStart: "11-10",
      peak: "11-15",
      peakEnd: "12-05",
      taperingEnd: "12-19",
      end: "12-22",
      lateEnd: "12-23",
      postRunLateCopyEnd: "12-24",
    },
    historicalPresence: {
      maximum: 9,
      distributionScope: "broad",
      curveVersion: "muskegon-fall-steelhead-presence-v1",
      evidenceNotes:
        "DNR calls the lower Muskegon one of Michigan's best and most consistent steelhead fisheries, with excellent fishing from late October through June. Fall entry reaches 9/10 and retains 80/100 at the winter handoff rather than erasing fish below Croton.",
      sourceNotes:
        "Michigan DNR Muskegon River Angler Survey 1985–2005; Central Lake Michigan Management Unit; 2022–2023 creel survey; DNR Steelhead profile.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
        { dayOffsetFromStart: 10, fractionOfMaximum: .15 },
        { dayOffsetFromStart: 20, fractionOfMaximum: .35 },
        { dayOffsetFromStart: 37, fractionOfMaximum: .65 },
        { dayOffsetFromStart: 47, fractionOfMaximum: .85 },
        { dayOffsetFromStart: 51, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 71, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 81, fractionOfMaximum: .94 },
        { dayOffsetFromStart: 88, fractionOfMaximum: .89 },
      ],
    },
    push: {
      ...MUSKEGON_SHARED_PUSH,
      version: "muskegon-fall-steelhead-push-v1",
      temperature: {
        suitabilityLabel: "Muskegon adult fall Steelhead entry",
        coldHoldingF: 39,
        supportiveMinF: 40,
        preferredMinF: 46,
        supportiveMaxF: 52,
        tooWarmF: 60,
        migrationBarrierF: 70,
      },
    },
    baselineCoverage: {
      metric: "flow_cfs",
      version: "muskegon-fall-steelhead-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 19,
      sourceNotes:
        "USGS 04121970 common measured discharge/temperature history, 2007–2025.",
    },
    conditionsSuggest: {
      ...MUSKEGON_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest,
      baselineVersion: "muskegon-fall-steelhead-conditions-v1",
      gaugeWeight: .4,
      waterTemperatureWeight: .6,
    },
    userCopyHints: {
      stagingTip:
        "Early Steelhead may enter in September. Check Muskegon Lake, the river entrance, and the Lower river when evaluating fresh fall entry.",
      preRunTip: "An isolated early fish does not prove the fall run is ahead.",
      peakTip:
        "Start in the Upper river (Newaygo–Croton Dam), emphasizing the Croton Dam area. Compare the Middle river for fresher fish.",
      endingTip:
        "Use established Upper-river holding water while recognizing that this fall-entry model ends after December 22.",
    },
    researchNotes:
      "Muskegon Fall Steelhead v1 models early September context, a strong late-October/November build, and a December 23 endpoint for this fall-entry experience without implying that Steelhead left the river.",
    sourceNotes:
      "Michigan DNR Muskegon River Angler Survey; 2022–2023 creel survey; DNR Steelhead profile; USGS 04121970. Public copy calls September fish early Steelhead and does not infer strain identity from timing.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "muskegon-fall-steelhead-copy-audit-v2",
      notes:
        "Owner-approved renovation uses early-Steelhead language, three approved public sections, Croton-area source scope, and a scoreless Fall entry complete terminal state.",
    },
  };

const ST_JOSEPH_SHARED_FISHABILITY = {
  version: "st-joseph-niles-fishability-v1",
  metric: "flow_cfs" as const,
  sourceLabel: "Niles mainstem reach",
  tooLow: { max: 1300 },
  lowFishable: { min: 1300, max: 1800 },
  ideal: { min: 1800, max: 3200 },
  highFishable: { min: 3200, max: 5100 },
  blownOut: { min: 7000 },
  caps: {
    staleGauge: 55,
    unknownTrend: 69,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "These absolute bands describe the large mainstem at USGS 04101500 in the Niles reach only. For August 15-December 24 in the fixed 2012-2025 audit, daily discharge was approximately p5 1,330, p10 1,520, p25 1,818, median 2,300, p75 3,160, p90 4,473, p95 5,090, and p99 6,633 CFS. The 5,100-7,000 interval remains very high/difficult; 7,000+ is an exceptional mainstem state. Bands describe fishing shape, never wading, boating, dam-tailwater safety, or conditions in another reach.",
  sourceNotes:
    "USGS 04101500 approved/provisional daily mean discharge, fixed 2012-2025 audit window. Niles is not extrapolated as a direct measurement of the harbor, lower Michigan river, individual dam tailwaters, South Bend, Mishawaka, or Twin Branch.",
};

const ST_JOSEPH_SHARED_PUSH = {
  version: "st-joseph-niles-push-v1",
  hydraulic: {
    metric: "flow_cfs" as const,
    sourceLabel: "Niles mainstem reach",
    lowValue: 1300,
    highValue: 5100,
    severeHighValue: 7000,
    rising24h: { absolute: 120, percent: 5 },
    meaningfulRise24h: { absolute: 240, percent: 11 },
    sharpRise24h: { absolute: 450, percent: 19 },
  },
  rain: { meaningful48hIn: .35, strong48hIn: .75, heavy48hIn: 1.5 },
  temperature: {
    suitabilityLabel: "St. Joseph adult fall Steelhead entry",
    coldHoldingF: 39,
    supportiveMinF: 40,
    preferredMinF: 46,
    supportiveMaxF: 52,
    tooWarmF: 60,
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
    coldHolding: 49,
  },
  evidenceNotes:
    "In the fixed 2012-2025 August 15-December 24 Niles audit, positive daily changes were approximately p50 130 CFS/5.4%, p75 230/11.1%, and p90 430/18.7%. Rounded production thresholds require both absolute and relative response. Rain is precursor context only: Strong requires a measured meaningful mainstem rise and Very Strong requires a sharp measured rise. Steelhead temperature remains species-specific; cold holding limits new-movement confidence without deleting fish already present.",
  sourceNotes:
    "USGS 04101500 daily discharge and same-station measured water temperature; Indiana DNR summer-run Skamania and winter-run Steelhead timing. No Mottville value, reservoir series, air temperature, or ladder count is blended into the live score.",
};

export const ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "st_joseph_fall_chinook",
    riverId: "st_joseph",
    biologyProfileId: "st_joseph_chinook_v1",
    displayName: "Fall Chinook",
    species: "chinook_salmon",
    season: "fall",
    runType: "fall_spawn",
    movementEngineId: "fall_cooling",
    runStageCopyStrategy: "st_joseph_corridor",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
    runWindow: {
      preRunStart: "08-01",
      stagingStart: "08-15",
      start: "09-01",
      beginningEnd: "09-10",
      buildingEstablishedStart: "09-15",
      buildingBroadStart: "09-20",
      peakStart: "09-22",
      peak: "09-25",
      peakEnd: "10-05",
      taperingEnd: "10-20",
      end: "11-01",
      lateEnd: "11-08",
      postRunLateCopyEnd: "11-10",
    },
    historicalPresence: {
      maximum: 3,
      distributionScope: "sectional",
      curveVersion: "st-joseph-fall-chinook-presence-v1",
      evidenceNotes:
        "The St. Joseph supports a real but comparatively small Chinook return. The 3/10 ceiling represents selective lower-river and ladder-corridor opportunity rather than a broadly abundant signature run: late-August entry, a September build, a late-September reference high, and a fading October tail. It is a relative opportunity reference, not a passage forecast.",
      sourceNotes:
        "Indiana DNR places Chinook and Coho tributary spawning from late August to early November. Federal 2008-2018 records document 3,028 Chinook passing all five St. Joseph ladders to South Bend, compared with 19,136 Coho and 108,210 Steelhead. The roughly 275-Chinook annual passage average supports a limited 3/10 sectional calibration and requires copy that never implies equal occupation across the interstate corridor.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .1 },
        { dayOffsetFromStart: 4, fractionOfMaximum: .25 },
        { dayOffsetFromStart: 14, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 24, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 34, fractionOfMaximum: .9 },
        { dayOffsetFromStart: 49, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 61, fractionOfMaximum: .2 },
        { dayOffsetFromStart: 68, fractionOfMaximum: 0 },
      ],
    },
    activity: {
      version: "st-joseph-fall-chinook-activity-v1",
      profile: "chinook_fall_reaction",
      scopeCopy:
        "Measured river conditions describe the St. Joseph mainstem at Niles. Water temperature, clarity, hydraulic shape, and presentation conditions can differ in the harbor and lower Michigan river, at individual ladder tailwaters, and through South Bend, Mishawaka, and the Twin Branch reach.",
      earlySeasonScopeCopy:
        "This smaller Chinook return is often sectional; a favorable Niles response window does not prove equal fish presence through the five-ladder corridor.",
      weights: {
        light: .6,
        waterTemperature: .15,
        riverBehavior: .15,
        weather: .1,
      },
      temperature: {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 72,
        barrierF: 76,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 49,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "10-05",
          taperingEnd: "10-20",
          endingEnd: "11-01",
        },
      },
      evidenceNotes:
        "St. Joseph Chinook Activity describes conditional responsiveness for a Chinook already present, never abundance, fresh entry, ladder passage, or catch probability. Effective light leads at 60%, same-station measured Niles water temperature carries 15%, Niles river behavior 15%, and local weather 10%. The preferred response band remains 48-62F. The St. Joseph is officially classified as a warmwater system, and historical ladder monitoring documented September as Niles' highest Chinook-passage month. Its fish-present response model therefore uses a river-specific 72F strong constraint and 76F response barrier while retaining a steep warm-side penalty. This is deliberately distinct from Push's stricter 68F warm constraint and 72F fresh-migration barrier: water can limit new upstream movement without proving a holding adult is nearly nonresponsive. Niles flow position describes presentation shape only, and a rising flow receives no duplicated fresh-movement bonus because that belongs to Push. After the October 5 Peak shoulder, the complete-input response floor fades continuously while a 15-point lifecycle deduction grows through October 20. Ending then blends continuously into a 49% residual constraint through November 1 and retains that constraint through the sparse November 8 tail. Every measurement claim is limited to Niles and cannot be extrapolated as direct measurement of the interstate corridor.",
    },
    push: {
      ...ST_JOSEPH_SHARED_PUSH,
      version: "st-joseph-fall-chinook-push-v1",
      temperature: {
        suitabilityLabel: "St. Joseph adult fall Chinook migration",
        coldHoldingF: 43,
        supportiveMinF: 45,
        preferredMinF: 50,
        supportiveMaxF: 64,
        tooWarmF: 68,
        migrationBarrierF: 72,
      },
      evidenceNotes:
        "Chinook reuses the audited Niles hydraulic response because USGS 04101500 measures the same mainstem reach independent of species. Its migration-temperature calibration remains Chinook-specific: 45-49F is cold but active, 50-64F is preferred/supportive, 68F is too warm, and 72F is migration-limiting. Rain remains precursor-only; strong movement language requires a measured Niles rise.",
      sourceNotes:
        "USGS 04101500 daily discharge and same-station measured water temperature; Indiana DNR Lake Michigan Chinook timing; Michigan DNR Great Lakes Chinook biology. Mottville, reservoir levels, air temperature, and ladder counts are excluded from the live score.",
    },
    fishabilityBands: ST_JOSEPH_SHARED_FISHABILITY,
    baselineCoverage: {
      metric: "flow_cfs",
      version: "st-joseph-fall-chinook-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 13,
      sourceNotes:
        "USGS 04101500 supplies complete discharge coverage for the fixed 2012-2025 Chinook lifecycle audit. Same-station temperature remains missing when not observed and is never imputed.",
    },
    waterTemperature: {
      sourcePriority: ["st_joseph_niles_temperature"],
      upstreamFallbackPositiveSignalCap: 0,
      notes:
        "Use only same-station measured Niles water temperature. Chinook migration remains plausible in warm early-entry water but is constrained at 68F and migration-limiting at 72F. Air temperature and Mottville cannot substitute.",
    },
    conditionsSuggest: {
      baselineVersion: "st-joseph-fall-chinook-conditions-v1",
      temperatureSourceId: "st_joseph_niles_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 10,
      minimumCoveragePercent: .8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: .55,
      waterTemperatureWeight: .45,
    },
    userCopyHints: {
      stagingTip:
        "Start with Lake Michigan, the harbor, river mouth, and deep lower Michigan water; staging does not prove passage through the ladder corridor.",
      preRunTip:
        "An isolated August Chinook does not mean this smaller St. Joseph run is established inland.",
      peakTip:
        "Prioritize lower Michigan and Niles holding water, then use South Bend and Mishawaka as selective passage checks rather than assuming broad corridor occupation.",
      endingTip:
        "Concentrate on established holding water, seek genuinely fresh fish, and leave spawning or deteriorated fish alone.",
    },
    researchNotes:
      "St. Joseph Fall Chinook starts staging monitoring August 15 and opens conservative Niles-scoped river presence September 1, three days before the first Niles Chinook recorded in the 1993 ladder study. It builds through September, centers a limited 3/10 sectional reference on September 25, ends the main migration November 1, and reaches zero November 8. Activity uses Niles-specific observations, warm-mainstem Chinook response biology, sectional early-season copy, and a continuously interpolated late lifecycle.",
    sourceNotes:
      "Primary evidence: Indiana DNR Lake Michigan fall guidance; FERC St. Joseph five-ladder passage records; Michigan DNR St. Joseph ladder research and Chinook biology; USGS 04101500 discharge and same-station temperature. Niles hydraulics are shared by reach; Chinook timing, presence, temperature response, Migration Timing, and copy are independently calibrated.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "st-joseph-fall-chinook-activity-audit-v1",
      notes:
        "Released after the complete six-primitives implementation, Niles-specific Chinook Activity calibration, 2021-2025 replay of 413 usable days and 1,652 four-hour blocks, thermal and hydraulic boundary coverage, continuous lifecycle decay, Push-isolation checks, staging/sectional copy, corridor audit, and current Michigan and Indiana regulation review completed with zero invariant violations. The accepted warm-mainstem calibration starts Niles-scoped presence September 1 and produces a 65/61 official-window median, 29/29 Beginning, 68/61 Building, 77/73 Peak, 74/72 Tapering, and 52/49 Ending. Beginning remains thermally conservative when Niles exceeds the 76F fish-present response barrier.",
    },
  };

export const ST_JOSEPH_FALL_COHO_RUN_PROFILE: AuditedObservedRiverRunProfile = {
  runId: "st_joseph_fall_coho",
  riverId: "st_joseph",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runStageCopyStrategy: "st_joseph_corridor",
  primitiveCapabilities: {
    migrationTiming: { status: "available" },
    push: { status: "available" },
    fishability: { status: "available" },
    activity: { status: "available" },
  },
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-20",
    start: "09-01",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-02",
    peakStart: "10-10",
    peak: "10-10",
    peakEnd: "10-31",
    taperingEnd: "11-15",
    end: "11-25",
    lateEnd: "12-05",
    postRunLateCopyEnd: "12-07",
  },
  historicalPresence: {
    maximum: 7,
    distributionScope: "broad",
    curveVersion: "st-joseph-fall-coho-presence-v1",
    evidenceNotes:
      "The St. Joseph supports a strong, hatchery-supported Coho run across a five-ladder interstate corridor. The 7/10 ceiling represents dependable but uneven sectional-to-broad opportunity: first September entry, establishment around the October transition, an October high, and a declining November tail. It is a relative opportunity reference, not a ladder-count forecast.",
    sourceNotes:
      "Indiana DNR places St. Joseph Coho migration from September through November with an October peak and supports the run through Bodine Hatchery stocking. Federal passage records document at least 19,136 Coho passing all five ladders to South Bend from 2008-2018, while historical ladder work found roughly one-third of Berrien-passing Coho reached South Bend. These records support a broad but nonuniform 7/10 opportunity rather than treating every reach as equally occupied.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .1 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 19, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 30, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 39, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 60, fractionOfMaximum: .88 },
      { dayOffsetFromStart: 75, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 85, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 95, fractionOfMaximum: 0 },
    ],
  },
  activity: {
    version: "st-joseph-fall-coho-activity-v1",
    profile: "coho_fall_reaction",
    scopeCopy:
      "Measured river conditions describe the St. Joseph mainstem at Niles. Water temperature, clarity, hydraulic shape, and presentation conditions can differ in the harbor and lower Michigan river, at individual ladder tailwaters, and through South Bend, Mishawaka, and the Twin Branch reach.",
    weights: {
      light: .5,
      waterTemperature: .25,
      riverBehavior: .15,
      weather: .1,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 68,
      barrierF: 72,
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      tomorrow: 79,
      lateRun: 100,
      ending: 42,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: "10-31",
        taperingEnd: "11-15",
        endingEnd: "11-25",
      },
    },
    evidenceNotes:
      "St. Joseph Coho Activity describes the conditional responsiveness of a Coho already present, never abundance, fresh entry, ladder passage, or catch probability. The accepted Great Lakes Coho biological model is retained: effective light leads at 50%, same-station measured water temperature carries 25%, Niles river behavior 15%, and local weather 10%. The preferred adult response band remains 45-60F. The large, warm St. Joseph mainstem uses a river-specific 68F strong warm constraint and 72F response barrier for responsiveness of fish already present. This is deliberately distinct from Push's stricter 70F fresh-migration barrier: water can limit new upstream movement without proving an adult Coho already holding in the river is nearly nonresponsive. Every river input is independently bound to the Niles reach. After the October 31 Peak shoulder, the complete-input lower-tail floor fades continuously and a 0-15 point lifecycle deduction grows through November 15; Ending then blends continuously into the 42% residual constraint through November 25. This permits genuinely low late-season response without a calendar cliff and separates Activity from the run's 7/10 abundance ceiling. A rising Niles flow changes presentation modestly but earns no fresh-movement bonus in Activity because that belongs to Push.",
  },
  push: {
    ...ST_JOSEPH_SHARED_PUSH,
    version: "st-joseph-fall-coho-push-v1",
    temperature: {
      suitabilityLabel: "St. Joseph adult fall Coho migration",
      supportiveMinF: 50,
      supportiveMaxF: 62,
      tooWarmF: 68,
      migrationBarrierF: 70,
    },
    evidenceNotes:
      "Coho reuses the audited Niles hydraulic response because the gauge measures the same mainstem reach regardless of species. Its migration temperature is independently calibrated: 50-62F is supportive, 68F is too warm, and 70F is migration-limiting. Rain is precursor context only; strong movement language still requires a measured Niles rise.",
    sourceNotes:
      "USGS 04101500 daily discharge and same-station measured water temperature; Indiana DNR Coho timing and Bodine stocking; Michigan DNR Great Lakes Coho biology. Mottville, reservoir levels, air temperature, and ladder counts are not blended into the live score.",
  },
  fishabilityBands: ST_JOSEPH_SHARED_FISHABILITY,
  baselineCoverage: {
    metric: "flow_cfs",
    version: "st-joseph-fall-coho-flow-baseline-v1",
    hasPercentileBaselines: true,
    coveredWindowPercent: 1,
    minimumHistoryYears: 13,
    sourceNotes:
      "USGS 04101500 supplies complete discharge coverage for the fixed 2012-2025 Coho lifecycle audit. Same-station temperature remains missing when not observed and is never imputed from air temperature or another station.",
  },
  waterTemperature: {
    sourcePriority: ["st_joseph_niles_temperature"],
    upstreamFallbackPositiveSignalCap: 0,
    notes:
      "Use only same-station measured Niles water temperature. Adult Coho migration is supported from 50-62F, constrained near 68F, and migration-limiting at 70F. Air temperature and Mottville cannot substitute.",
  },
  conditionsSuggest: {
    baselineVersion: "st-joseph-fall-coho-conditions-v1",
    temperatureSourceId: "st_joseph_niles_temperature",
    finalCheckpointDaysAfterPeak: 5,
    minimumUsableYears: 10,
    minimumCoveragePercent: .8,
    aheadPercentile: 75,
    delayedPercentile: 25,
    coolEnoughPercentileCap: 75,
    gaugeWeight: .55,
    waterTemperatureWeight: .45,
  },
  userCopyHints: {
    stagingTip:
      "Start with Lake Michigan, the harbor, and the lower river; staging fish do not prove broad passage through the ladder corridor.",
    preRunTip:
      "An isolated August Coho does not mean the September river migration is established.",
    peakTip:
      "Compare the lower Michigan river, Niles, South Bend, and Mishawaka reaches without treating the Niles gauge as a corridor-wide observation.",
    endingTip:
      "Late Coho can remain in established holding and spawning water, but fresh entry becomes progressively less dependable through November.",
  },
  researchNotes:
    "St. Joseph Fall Coho foundation v1 begins the pre-run watch August 10 and staging monitoring August 20. Dependable but early river presence starts September 1; September remains Beginning because the Niles archive is overwhelmingly warm and variable despite real passage. The run becomes established and broadens October 1, then Peak begins and centers on October 10. The researched 7/10 ceiling and December 5 zero point are conservative relative-opportunity calibration. Activity uses shared Great Lakes Coho response biology with Niles-specific warm-side constraints, observations, and an independently dated lifecycle ramp.",
  sourceNotes:
    "Primary evidence: Indiana DNR South Bend Fish Ladder, Bodine State Fish Hatchery, and Lake Michigan Coho guidance; FERC St. Joseph passage records; Michigan DNR St. Joseph ladder research and Coho biology; USGS 04101500 discharge and same-station temperature. Hydraulics are river/reach-specific and shared with Steelhead; timing, presence, temperature response, and Migration Timing are Coho-specific.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "st-joseph-fall-coho-activity-audit-v1",
    notes:
      "Released after the complete six-primitives implementation, Niles-specific Coho Activity calibration, 2021-2025 replay of 523 usable days and 2,092 four-hour blocks, thermal and hydraulic boundary coverage, continuous lifecycle decay, Push-isolation checks, corridor-copy audit, and current Michigan and Indiana regulation review completed with zero invariant violations. The accepted Activity replay produces a 64/59 official-window median, 69/64 Building median, and 79/78 Peak median. Staging monitoring begins August 20; September is Beginning rather than established Building.",
  },
};

export const ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "st_joseph_fall_steelhead",
    riverId: "st_joseph",
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    displayName: "Fall Steelhead",
    species: "steelhead",
    season: "fall",
    runType: "fall_entry",
    movementEngineId: "fall_entry_cooling",
    runStageCopyStrategy: "st_joseph_corridor",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
    runWindow: {
      preRunStart: "08-01",
      stagingStart: "09-10",
      start: "09-25",
      beginningEnd: "10-10",
      buildingEstablishedStart: "10-15",
      buildingBroadStart: "11-01",
      peakStart: "11-10",
      peak: "11-15",
      peakEnd: "12-05",
      taperingEnd: "12-19",
      end: "12-22",
      lateEnd: "12-23",
      postRunLateCopyEnd: "12-24",
    },
    historicalPresence: {
      maximum: 9,
      distributionScope: "broad",
      curveVersion: "st-joseph-fall-steelhead-presence-v1",
      evidenceNotes:
        "The St. Joseph is a major interstate, hatchery-supported Steelhead fishery with five passage facilities and 63 accessible miles. The curve acknowledges summer-run Skamania already present by mid-August, then models the added fall-entry build beginning in October. It reaches a conservative 9/10 fall opportunity reference November 15, retains 81/100 through December 22, and then closes fall scoring; this is not a ladder-count forecast or live abundance estimate.",
      sourceNotes:
        "Indiana DNR Bodine State Fish Hatchery and Lake Michigan fishing guidance; Indiana DNR South Bend ladder program and historical counts since 2011; Michigan DNR St. Joseph River Assessment and Steelhead management material. Annual passage varies, so evidence supports 9/10 rather than an automatic 10/10.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
        { dayOffsetFromStart: 10, fractionOfMaximum: .18 },
        { dayOffsetFromStart: 20, fractionOfMaximum: .38 },
        { dayOffsetFromStart: 37, fractionOfMaximum: .68 },
        { dayOffsetFromStart: 47, fractionOfMaximum: .88 },
        { dayOffsetFromStart: 51, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 71, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 81, fractionOfMaximum: .96 },
        { dayOffsetFromStart: 88, fractionOfMaximum: .9 },
      ],
    },
    activity: {
      version: "st-joseph-fall-steelhead-activity-v1",
      profile: "steelhead_feeding",
      scopeCopy:
        "Measured river conditions describe the St. Joseph mainstem at Niles. Water temperature, clarity, hydraulic shape, access, and fishing conditions can differ in the harbor and lower Michigan river, at individual dam tailwaters, and through South Bend, Mishawaka, and the Twin Branch reach.",
      weights: {
        light: .25,
        waterTemperature: .5,
        riverBehavior: .15,
        weather: .1,
      },
      temperature: {
        coldF: 39,
        preferredMinF: 44,
        preferredMaxF: 56,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 100,
      },
      evidenceNotes:
        "St. Joseph Fall Steelhead Activity describes feeding and aggressive responsiveness for a living Steelhead already present, never abundance, fresh entry, ladder passage, or catch probability. It reuses the accepted Great Lakes Steelhead biological response model: same-station measured water temperature leads at 50%, effective light carries 25%, Niles river behavior 15%, and local weather context 10%. The favorable response range is 44-56F with the strongest thermal response centered near 48-54F; 39F marks slower cold-water holding rather than fish leaving the river. River behavior is independently bound to USGS 04101500 and the accepted Niles flow-shape bands. Steelhead receive no salmon response floor, spawning deterioration penalty, lifecycle ramp, late ceiling, or ending cap. Identical observed conditions therefore retain identical responsiveness across Peak, Tapering, Ending, and the December winter-holding handoff. Activity must not duplicate Push: a rising Niles flow can change presentation shape modestly, but receives no fresh-migration bonus here. Every measurement claim is limited to the Niles mainstem reach and cannot be extrapolated as direct measurement of the interstate corridor.",
    },
    push: ST_JOSEPH_SHARED_PUSH,
    fishabilityBands: ST_JOSEPH_SHARED_FISHABILITY,
    baselineCoverage: {
      metric: "flow_cfs",
      version: "st-joseph-fall-steelhead-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 13,
      sourceNotes:
        "USGS 04101500 supplies complete discharge coverage for the fixed 2012-2025 lifecycle audit. Same-station temperature supplies 13-14 usable seasons across the five checkpoints; incomplete days remain missing rather than imputed.",
    },
    waterTemperature: {
      sourcePriority: ["st_joseph_niles_temperature"],
      upstreamFallbackPositiveSignalCap: 0,
      notes:
        "Use only same-station measured Niles water temperature. Fall entry is strongest around 46-52F, remains plausible at 40-45F, and shifts toward holding around 39F or colder. Air temperature and Mottville cannot substitute.",
    },
    conditionsSuggest: {
      baselineVersion: "st-joseph-fall-steelhead-conditions-v1",
      temperatureSourceId: "st_joseph_niles_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 10,
      minimumCoveragePercent: .8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: .4,
      waterTemperatureWeight: .6,
    },
    userCopyHints: {
      stagingTip:
        "Treat summer-run Skamania already in the river separately from the later fall-entry build.",
      preRunTip:
        "An August or early-September Skamania is real, but does not prove the later fall-entry build is early.",
      peakTip:
        "Compare the approved Middle and Upper river sections without treating Niles measurements as river-wide observations.",
      endingTip:
        "Treat December 22 as the endpoint of fall-entry scoring without claiming Steelhead have left the river.",
    },
    researchNotes:
      "St. Joseph Fall Steelhead v1 explicitly treats established summer-run Skamania as pre-run context rather than counting them as the later fall-entry build. Scored entry begins September 25, becomes established in October, broadens through the accessible corridor in November, reaches a 90/100 seasonal reference November 15, retains 81/100 through December 22, and then ends fall scoring.",
    sourceNotes:
      "Primary evidence: Indiana DNR South Bend Fish Ladder, Bodine State Fish Hatchery, and Lake Michigan fishing guidance; Michigan DNR St. Joseph River Assessment and Steelhead management presentations; USGS 04101500 discharge and same-station water temperature. Steelhead response biology is shared with accepted Great Lakes profiles while Activity observations, hydraulic bands, weather point, scope, and replay remain Niles-specific.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "st-joseph-fall-steelhead-activity-audit-v1",
      notes:
        "Released after research, Niles-specific Activity implementation, 2021-2025 historical replay, thermal and hydraulic boundary coverage, lifecycle invariance, Push-isolation checks, copy-safety tests, and current Michigan and Indiana regulation review completed successfully.",
    },
  };

export const BETSIE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "betsie_fall_chinook",
  riverId: "betsie",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: {
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted at-or-below-Homestead hydraulic and measured-water-temperature history exists for a cumulative early, typical, or delayed comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_or_water_temperature_source",
      notes:
        "Push requires both a representative live river response and measured water temperature. Neither is accepted for the below-Homestead corridor, and air temperature is not substituted.",
    },
    fishability: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_source",
      notes:
        "No accepted live gauge represents the short below-Homestead fishing corridor, so Betsie hydraulic bands cannot be responsibly calibrated.",
    },
    activity: { status: "available" },
  },
  runStageCopyStrategy: "betsie_homestead",
  runWindow: {
    preRunStart: "07-01",
    stagingStart: "07-28",
    start: "08-10",
    beginningEnd: "08-18",
    buildingEstablishedStart: "08-27",
    buildingBroadStart: "09-05",
    peakStart: "09-10",
    peak: "09-15",
    peakEnd: "09-25",
    taperingEnd: "10-13",
    end: "10-22",
    lateEnd: "11-03",
    postRunLateCopyEnd: "11-05",
  },
  historicalPresence: {
    maximum: 10,
    distributionScope: "broad",
    curveVersion: "betsie-fall-chinook-presence-v1",
    evidenceNotes:
      "The Betsie supports a world-class wild Chinook fishery and extensive mainstem natural reproduction. The 10/10 ceiling represents historical opportunity, not a fish count. Broad distribution refers only to the two approved River Run reaches between Betsie Lake and the signed Homestead closure. The calendar is an owner-calibrated, evidence-consistent five-day lead over the accepted PM river-presence curve.",
    sourceNotes:
      "Michigan DNR Betsie River Survey 2004-3 documents primarily wild Chinook, extensive natural reproduction, an adult observed at Kurick Road on August 12, 2003, and historical migratory effort concentrated from Betsie Lake to Homestead Dam: https://www2.dnr.state.mi.us/publications/pdfs/ifr/ifrlibra/Status/Waterbody/2004-3Betsie.pdf . Michigan DNR describes the current wild Chinook population as a world-class fishery: https://content.govdelivery.com/accounts/MIDNR/bulletins/29f9c97 . Great Lakes Fishery Trust/USGS work at Homestead supports a mid-September-centered run with effort diminishing by the end of October: https://portal.glft.org/documents/653-rogers_chinook_final_report_v2-pdf . Exact five-day PM lead is owner field calibration rather than a paired-count estimate.",
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
  activity: {
    version: "betsie-fall-chinook-weather-activity-v1",
    profile: "chinook_fall_reaction",
    dataMode: "weather_only",
    scopeCopy:
      "This weather context applies to the two Betsie River Run reaches; it does not measure river level, clarity, or water temperature.",
    weights: {
      light: 0.75,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.25,
    },
    temperature: {
      coldF: 45,
      preferredMinF: 50,
      preferredMaxF: 62,
      warmF: 68,
      barrierF: 70,
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      tomorrow: 90,
      lateRun: 59,
      ending: 49,
      weatherOnlyMaximum: 95,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: "09-25",
        taperingEnd: "10-13",
        endingEnd: "11-03",
      },
    },
    evidenceNotes:
      "Betsie Fall Chinook Activity is an explicitly weather-only responsiveness outlook for a fish already present, not a river-condition, movement, abundance, fishability, or catch-probability estimate. Each fixed four-hour block uses its own actual-versus-clear-sky light, cloud fallback, total precipitation, and wet-hour duration from the Homestead weather point. Effective light carries 75% and precipitation context 25%; measured water temperature and river behavior carry zero because no accepted sources represent the corridor. The score retains the native range of the variables the model actually evaluates, with a true upper bound of 95 rather than a proportional missing-data reduction; tomorrow is bounded at 90. Confidence remains Limited and copy states exactly which river variables are unknown. The salmon opportunity floor is permitted only from complete hourly weather and fades continuously after the September 25 Peak shoulder; a 15-point lifecycle deduction grows through October 13, then blends continuously into the 49% residual constraint across Ending and the sparse tail through November 3. Air temperature and preceding-block rain are excluded, and precipitation never implies that the river rose or changed clarity.",
  },
  userCopyHints: {
    stagingTip:
      "Use Betsie Lake and the lake-to-river transition; an early fish in either river reach remains exceptional.",
    preRunTip:
      "Use the approved Betsie Lake–US-31 and US-31–Homestead reaches; do not create lower, middle, or upper Betsie sections.",
    peakTip:
      "Compare the two approved reaches and keep all guidance below the current signed Homestead closure.",
    endingTip:
      "Prioritize deep established holes and leave actively spawning or visibly deteriorated fish alone.",
  },
  researchNotes:
    "Betsie Fall Chinook owner-audit configuration. River presence begins August 10 at a deliberately low 10/100 index. Late August supports earlier arrivals using the US-31–Homestead reach while newer fish may remain in the Betsie Lake–US-31 reach. The run reaches a September 15 peak reference, ends October 22, and retains a sparse tail through November 3. April 2026 flooding is a field-acceptance concern for changed holes, sand, access, and passage—not a reason to move the fixed seasonal calendar.",
  sourceNotes:
    "River-specific evidence includes Michigan DNR Betsie fishery surveys and regulations, DNR Homestead infrastructure and access material, Betsie Lake staging documentation, the Great Lakes Fishery Trust/USGS naturalized Chinook study at Homestead, current DNR fishing reports, and explicit owner field experience. The 2026 regulations close fishing within 300 feet of Homestead from August 1 through November 15; public copy must never direct anglers into that closure. Push, Fishability, and Migration Timing intentionally have no calibration blocks because their required sources are unavailable.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "betsie-fall-chinook-copy-audit-v2",
    notes:
      "The accepted calendar and 100-point ceiling remain public while renovated two-reach copy, Activity leader handling, public score rounding, and Fall run complete behavior enter owner review.",
  },
};

export const BETSIE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "betsie_fall_coho",
  riverId: "betsie",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: {
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted at-or-below-Homestead hydraulic and measured-water-temperature history exists for a cumulative early, typical, or delayed comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_or_water_temperature_source",
      notes:
        "Push requires both a representative live river response and measured water temperature. Neither is accepted for the below-Homestead corridor, and air temperature is not substituted.",
    },
    fishability: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_source",
      notes:
        "No accepted live gauge represents the short below-Homestead fishing corridor, so Betsie hydraulic bands cannot be responsibly calibrated.",
    },
    activity: { status: "available" },
  },
  runStageCopyStrategy: "betsie_homestead",
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-20",
    start: "08-27",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-26",
    peakStart: "10-05",
    peak: "10-15",
    peakEnd: "10-31",
    taperingEnd: "11-15",
    end: "11-25",
    lateEnd: "12-26",
    postRunLateCopyEnd: "12-28",
  },
  historicalPresence: {
    maximum: 3,
    distributionScope: "sectional",
    curveVersion: "betsie-fall-coho-presence-v1",
    evidenceNotes:
      "The Betsie supports a real but small, primarily wild-or-stray Coho migration. The 3/10 ceiling places it at the upper edge of Limited opportunity and is not a fish count. Sectional distribution describes select water within the two approved River Run reaches and avoids claiming dependable opportunity throughout the corridor. The calendar is an owner-accepted five-day lead over the separately accepted PM Coho curve.",
    sourceNotes:
      "Michigan DNR Fisheries Report 24 describes large Betsie Chinook runs with smaller Coho numbers; its 2010 creel estimate recorded 63 harvested Coho, all in October and within the middle survey section containing Homestead, versus 13,620 Chinook, with Coho under 1% of total harvest: https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/FisheriesReports/FR024.pdf . Michigan DNR Betsie Survey 2004-3 documents some migratory Coho, no direct Coho stocking, primarily wild-or-stray returns, and spawning in the mainstem and tributaries: https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0087_2004_BetsieRiver.pdf . Current DNR Better Fishing Waters omits Coho from the Betsie while listing Coho for nearby Platte and Pere Marquette waters: https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters . Exact strength and five-day PM lead remain owner calibration rather than a paired adult-count estimate.",
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
  activity: {
    version: "betsie-fall-coho-weather-activity-v1",
    profile: "coho_fall_reaction",
    dataMode: "weather_only",
    scopeCopy:
      "This weather context applies to the two Betsie River Run reaches; it does not measure river level, clarity, or water temperature, and Coho opportunity remains sectional.",
    weights: {
      light: 0.7,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.3,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 64,
      barrierF: 68,
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      tomorrow: 90,
      lateRun: 59,
      ending: 42,
      weatherOnlyMaximum: 95,
      taperingPenalty: 15,
      lifecycleRamp: {
        peakEnd: "10-31",
        taperingEnd: "11-15",
        endingEnd: "12-26",
      },
    },
    evidenceNotes:
      "Betsie Fall Coho Activity is an explicitly weather-only responsiveness outlook for a Coho already present, not a river-condition, movement, abundance, fishability, or catch-probability estimate. Each fixed four-hour block uses its own actual-versus-clear-sky light, cloud fallback, total precipitation, and wet-hour duration from the Homestead weather point. Effective light carries 70% and precipitation context 30%, giving Coho slightly more weather-cover influence than Betsie Chinook while keeping light dominant; measured water temperature and river behavior carry zero. The evaluated weather variables retain their native range with a true upper bound of 95 and tomorrow bounded at 90. Confidence is always Limited, and copy states that the already-limited Betsie Coho opportunity remains sectional. The Coho floor fades continuously after October 31 while a 15-point lifecycle deduction grows through November 15; Ending and the sparse tail then blend continuously into the 42% residual constraint through December 26. Air temperature and preceding-block rain are excluded, and precipitation never implies a river rise or clarity change.",
  },
  userCopyHints: {
    stagingTip:
      "Use Lake Michigan, Frankfort harbor, Betsie Lake, and one deliberate early-fish check in the Betsie Lake–US-31 reach.",
    preRunTip:
      "Treat the Betsie as a Limited Coho river and use only its two approved River Run reaches.",
    peakTip:
      "Compare select water in both approved reaches, stay outside the signed Homestead closure, and require direct fish activity before committing time.",
    endingTip:
      "Prioritize the deepest established holes and leave actively spawning or visibly deteriorated fish alone.",
  },
  researchNotes:
    "Betsie Fall Coho owner-audit configuration. The deterministic calendar is five days ahead of accepted PM Coho: river presence begins August 27, reaches a limited 30/100 seasonal high on October 15, ends November 25, and retains a sparse tail through December 26. The October-centered high is consistent with the only quantified 2010 Betsie Coho harvest occurring in October, but the exact lead and 3/10 ceiling remain accepted product calibration because no modern paired Betsie adult-count series exists.",
  sourceNotes:
    "River-specific evidence includes Michigan DNR Betsie fishery surveys, the 2010 full-river creel estimate, current DNR fishing-water listings, Homestead access and regulation material, and explicit owner acceptance of the 3/10 ceiling and five-day PM lead. The 2026 regulations close fishing within 300 feet of Homestead from August 1 through November 15 and within 100 feet for the rest of the year. Push, Fishability, and Migration Timing intentionally have no calibration blocks because their required sources remain unavailable.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "betsie-fall-coho-copy-audit-v2",
    notes:
      "The accepted calendar and 30-point Limited/Sectional ceiling remain public while renovated two-reach copy, Activity leader handling, public score rounding, and Fall run complete behavior enter owner review.",
  },
};

export const BETSIE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "betsie_fall_steelhead",
  riverId: "betsie",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  season: "fall",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  primitiveCapabilities: {
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted at-or-below-Homestead hydraulic and measured-water-temperature history exists for a cumulative early, typical, or delayed comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_or_water_temperature_source",
      notes:
        "Push requires both a representative live river response and measured water temperature. Neither is accepted for the below-Homestead corridor, and air temperature is not substituted.",
    },
    fishability: {
      status: "unavailable",
      reason: "no_accepted_hydraulic_source",
      notes:
        "No accepted live gauge represents the short below-Homestead fishing corridor, so Betsie hydraulic bands cannot be responsibly calibrated.",
    },
    activity: { status: "available" },
  },
  runStageCopyStrategy: "betsie_homestead",
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-27",
    start: "09-15",
    beginningEnd: "10-05",
    buildingEstablishedStart: "10-10",
    buildingBroadStart: "10-27",
    peakStart: "11-10",
    peak: "11-10",
    peakEnd: "11-29",
    taperingEnd: "12-14",
    end: "12-17",
    lateEnd: "12-18",
    postRunLateCopyEnd: "12-19",
  },
  historicalPresence: {
    maximum: 7,
    distributionScope: "broad",
    curveVersion: "betsie-fall-steelhead-presence-v1",
    evidenceNotes:
      "The Betsie supports a strong and well-recognized Steelhead fishery. The owner-accepted 7/10 ceiling produces a 70/100 seasonal high and is not a fish count. Broad distribution refers only to the two approved River Run reaches between Betsie Lake and the signed Homestead closure. The calendar is exactly five days ahead of the accepted PM fall-entry curve, and the public estimate ends after December 17 without implying that Steelhead left the river.",
    sourceNotes:
      "Michigan DNR lists both the Betsie River and Betsie Lake as Better Fishing Waters for Steelhead and identifies Homestead as a popular Steelhead access. DNR Betsie Survey 2004-3 documents a substantial stocked and naturalized fishery. Michigan DNR describes fall-entering Steelhead as overwintering before spring spawning. Product guidance follows the accepted operational fact that Homestead is the upstream limit for this migratory fishery. The exact 7/10 ceiling and five-day PM lead are owner calibration rather than a paired adult-count estimate.",
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
  activity: {
    version: "betsie-fall-steelhead-weather-activity-v1",
    profile: "steelhead_feeding",
    dataMode: "weather_only",
    scopeCopy:
      "This weather context applies to the two Betsie River Run reaches; it does not measure river level, clarity, or water temperature.",
    weights: {
      light: 0.7,
      waterTemperature: 0,
      riverBehavior: 0,
      weather: 0.3,
    },
    temperature: {
      coldF: 39,
      preferredMinF: 44,
      preferredMaxF: 56,
      warmF: 64,
      barrierF: 68,
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      tomorrow: 90,
      lateRun: 100,
      ending: 100,
      weatherOnlyMaximum: 95,
    },
    evidenceNotes:
      "Betsie Fall Steelhead Activity is an explicitly weather-only feeding and aggressive-responsiveness outlook for a Steelhead already present, not a river-condition, movement, abundance, fishability, or catch-probability estimate. Each fixed four-hour block uses its own actual-versus-clear-sky light, cloud fallback, total precipitation, and wet-hour duration from the Homestead weather point. Effective light carries 70% and precipitation context 30%, matching the natural reweighting of the shared Steelhead model's observable weather components while measured water temperature and river behavior remain zero. The evaluated weather variables retain their native range with a true upper bound of 95 and tomorrow bounded at 90. Confidence is always Limited. Steelhead receive no salmon floor, lifecycle deduction, tapering ceiling, ending constraint, or mortality copy; identical weather produces identical Activity scores through the final fall-entry day. After December 17, Activity returns Fall entry complete with no score. Air temperature and preceding-block rain are excluded, and precipitation never implies a river rise or clarity change.",
  },
  userCopyHints: {
    stagingTip:
      "Use Frankfort harbor, Betsie Lake, and one deliberate early-fish check in the Betsie Lake–US-31 reach.",
    preRunTip:
      "Use only the approved Betsie Lake–US-31 and US-31–Homestead reaches.",
    peakTip:
      "Compare substantial holding water in both approved reaches and end all guidance at the signed Homestead closure.",
    endingTip:
      "Treat the endpoint as Fall entry complete, not as Steelhead leaving the river or as a winter read.",
  },
  researchNotes:
    "Betsie Fall Steelhead owner-audit configuration. Every boundary is exactly five days ahead of the accepted PM fall-entry profile: early monitoring starts August 10, staging starts August 27, river presence starts September 15, the 70/100 ceiling begins November 10, and the final fall-entry value is 61/100 on December 17. Beginning December 18, the public state is Fall entry complete: Fish In River and Activity stop scoring, no winter experience is referenced, and staging tracking resumes in late August.",
  sourceNotes:
    "River-specific evidence includes Michigan DNR Betsie Survey 2004-3, current DNR Better Fishing Waters, DNR Homestead access material, the DNR Steelhead species profile, current Homestead closure regulations, and explicit owner calibration. Fishing is closed within 300 feet of Homestead from August 1 through November 15 and within 100 feet from November 16 through July 31. Push, Fishability, and Migration Timing intentionally have no calibration blocks because their required sources remain unavailable.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "betsie-fall-steelhead-copy-audit-v2",
    notes:
      "The accepted calendar and 70-point fall ceiling remain public while renovated two-reach copy and Fall entry complete behavior enter owner review.",
  },
};

export const PERE_MARQUETTE_FALL_COHO_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "pere_marquette_fall_coho",
    riverId: "pere_marquette",
    biologyProfileId: "great_lakes_coho_v1",
    displayName: "Fall Coho",
    species: "coho_salmon",
    season: "fall",
    runType: "fall_spawn",
    movementEngineId: "fall_cooling",
    runStageCopyStrategy: "pere_marquette",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
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
    activity: {
      version: "pm-fall-coho-activity-v4",
      profile: "coho_fall_reaction",
      weights: {
        light: 0.5,
        waterTemperature: 0.25,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 56,
        ending: 42,
        taperingPenalty: 15,
        lifecycleRamp: {
          peakEnd: "11-05",
          taperingEnd: "11-20",
          endingEnd: "11-30",
        },
      },
      evidenceNotes:
        "PM Coho Activity is a conditional responsiveness outlook for fish already present. Effective light remains the leading block-level input, but measured water temperature carries more influence than in the Chinook profile because adult Coho migration and spawning behavior are strongly temperature-linked. Favorable Coho temperature tops out below a perfect component score so seasonally suitable water cannot make exceptional reads routine by itself. The preferred 45-60F band covers authoritative adult spawning guidance; response declines above 60F, with 64F marking a strong warm constraint and 68F a conservative barrier for favorable Activity language. Scottville flow position describes current river shape, while a restrained precipitation component adds cover without standing in for a later measured flow response. Through Peak, a Coho-specific 15-25 lower-tail compression applies only with complete inputs. From November 6-20 that floor fades continuously while a lifecycle deduction grows from 0 to 15 points. From November 21-30 the deduction blends into the 42% residual constraint, preventing stage-boundary cliffs while preserving genuinely low response for deteriorating semelparous fish.",
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
        "PM hydraulics: USGS 04122500 daily means, 2016-2025. Rain: Open-Meteo archive at the audited Baldwin watershed point, 2016-2025. Temperature: PMTU measured water, prioritized Maple Leaf then Bowman and M-37. Coho biology: Michigan DNR Coho profile and Great Lakes/peer-reviewed migration-temperature literature recorded in great_lakes_coho_v1. The 2021-2025 Coho replay produced 446 usable dates with zero safety or copy violations; the owner accepted these values for public release.",
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
      "PM Fall Coho accepted release configuration. The pre-run watch begins August 15, staging context begins August 25, the river window begins September 1, the migration builds through September, peaks from October 10 through November 5 around an October 20 reference, tapers through November 20, ends November 30, and retains a sparse historical-presence tail through December 31. January 1-2 uses late post-migration copy before true offseason guidance. The 6-of-10 ceiling represents a dependable moderate PM opportunity and passed the full local mechanical acceptance replay and explicit owner acceptance.",
    sourceNotes:
      "Sources include the Michigan DNR Coho salmon species profile, Michigan DNR Pere Marquette fishery and angler-survey material, Great Lakes Coho stocking and life-history context, USGS 04122500 Scottville, and PMTU measured-water stations. River sources, Fishability, and provider priority are deliberately shared with PM Chinook; timing, presence, biology, migration temperature, and Migration Timing baselines are Coho-specific. Local acceptance and explicit owner release approval passed.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "pm-fall-coho-acceptance-v1",
      notes:
        "Local acceptance audit passed: 446 Push dates, 910 Fishability dates, 645 integrated snapshots, five timing baselines, and 104 Coho review scenarios produced zero safety, copy, boundary, or cross-primitive violations. The owner explicitly approved public visibility after device review.",
    },
  };

export const PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "pere_marquette_fall_steelhead",
    riverId: "pere_marquette",
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    displayName: "Fall Steelhead",
    species: "steelhead",
    season: "fall",
    runType: "fall_entry",
    movementEngineId: "fall_entry_cooling",
    runStageCopyStrategy: "pere_marquette",
    primitiveCapabilities: {
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
      activity: { status: "available" },
    },
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
    historicalPresence: {
      maximum: 8,
      distributionScope: "broad",
      curveVersion: "pm-fall-steelhead-presence-v2",
      evidenceNotes:
        "The PM supports a strong wild steelhead fishery. The curve allows occasional late-September entry, establishes a meaningful and increasingly broad presence by mid-October, reaches its 8-of-10 fall opportunity ceiling on November 15, and deliberately retains 70-of-100 presence on December 22. The fall-entry estimate ends after that date without implying that Steelhead have left the river. This is seasonal opportunity context, not a live fish count.",
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
    activity: {
      version: "pm-fall-steelhead-activity-v2",
      profile: "steelhead_feeding",
      weights: {
        light: 0.25,
        waterTemperature: 0.5,
        riverBehavior: 0.15,
        weather: 0.1,
      },
      temperature: {
        coldF: 39,
        preferredMinF: 44,
        preferredMaxF: 56,
        warmF: 64,
        barrierF: 68,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        tomorrow: 79,
        lateRun: 100,
        ending: 100,
      },
      evidenceNotes:
        "PM Fall Steelhead Activity describes feeding and aggressive responsiveness for fish already present, not migration, abundance, catch probability, or post-fall behavior. Measured temperature leads the profile because rainbow-trout feeding intensity changes strongly with temperature and PM adult Steelhead telemetry independently shows temperature-led behavior. Effective light remains meaningful for choosing among four-hour windows but is deliberately much lower than either salmon profile, so dark skies cannot erase cold-water metabolic restraint. Scottville flow position describes presentation shape without re-awarding a measured migration response, and precipitation remains restrained cover context. The 44-56F preferred band represents favorable fall feeding calibration, with a narrower 48-54F apex that can support an exceptional result only when river, light, and weather conditions also align. Responsiveness declines continuously and more sharply below 44F toward approximately 39F, and also declines above 56F toward unusually warm fall water. Steelhead receive no salmon mortality reduction. After December 22, this fall model stops scoring Activity rather than extending into an unimplemented winter experience.",
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
        "PM hydraulics: USGS 04122500 daily means, 2016-2025. Rain: Open-Meteo archive at the audited Baldwin watershed point. Temperature: prioritized PMTU measured-water stations. Species response: Michigan DNR steelhead life-history guidance and Pere Marquette/Great Lakes steelhead telemetry documenting temperature-dominant movement and a movement slowdown near 4C/39F. The launch calibration values passed the acceptance replay and explicit owner review.",
    },
    fishabilityBands: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      evidenceNotes:
        "Scottville Fishability is a Lower-river hydraulic calibration shared across fall migratory species. The same absolute bands describe presentation control for Steelhead: below 400 unusually low, 400-500 low but fishable, 500-525 transitional, 525-750 ideal, 750-1000 high but fishable, 1000-1600 very high/difficult, and 1600+ blown out. Species identity does not change the measured hydraulic shape; these are not abundance or safety thresholds and do not describe the full PM.",
      sourceNotes:
        "Hydraulics: USGS 04122500 approved daily discharge, 2016-2025. Reach context: Pere Marquette Comprehensive River Management Plan. The audited Scottville reach and absolute fishing-shape thresholds are deliberately reused; the Steelhead-specific differences belong to biology, timing, presence, temperature response, and the December 22 fall-model endpoint.",
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
      "PM fall steelhead launch configuration. Early monitoring begins August 15, condition tracking begins September 1, and the river-entry window begins September 20 so occasional late-September fish are represented without overstating dependability. Meaningful presence and broadening distribution develop by mid-October, the 8-of-10 ceiling begins November 15, tapering begins December 5, and the final fall-entry phase begins December 20. Presence remains 70-of-100 on December 22. Beginning December 23, the public state is Fall entry complete: Push, Activity, and Fish In River stop scoring, no winter experience is referenced, and fall movement tracking resumes in early September.",
    sourceNotes:
      "Sources include Michigan DNR steelhead biology and Great Lakes tributary timing, Michigan DNR Pere Marquette fishery/angler-survey material, Pere Marquette and broader Great Lakes telemetry, USGS 04122500 Scottville, and PMTU measured-water stations. PM hydraulics and providers are shared; biology, timing, retained fall presence, temperature response, condition weights, and the December 22 endpoint are Steelhead-specific. The renovated copy requires a new owner acceptance pass.",
    publicAudit: {
      isEnabled: true,
      auditVersion: "pm-fall-steelhead-activity-audit-v1",
      notes:
        "The accepted fall-entry foundation remains public while renovated copy enters owner review. The prior Activity audit covered 515 historical days, 2,060 four-hour blocks, 118 review scenarios, every lifecycle and confidence state, copy safety, and visual contracts. Phase 2 replaces the former winter handoff with an explicit Fall entry complete boundary after December 22.",
    },
  };

export const RIVER_RUN_RUN_PROFILES: AuditedRiverRunProfile[] = [
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
  MUSKEGON_FALL_COHO_RUN_PROFILE,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
];
