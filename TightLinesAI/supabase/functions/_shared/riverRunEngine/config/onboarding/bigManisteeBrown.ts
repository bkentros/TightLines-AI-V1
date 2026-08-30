import type {
  AuditedObservedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import { BIG_MANISTEE_RIVER_PROFILE } from "../rivers.ts";
import { BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE } from "../runs.ts";
import { GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE } from "../speciesBiology.ts";

/** Hidden river-foundation view for Brown review; never replace the public profile with this object. */
export const BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE: RiverProfile = {
  ...BIG_MANISTEE_RIVER_PROFILE,
  foundation: {
    ...BIG_MANISTEE_RIVER_PROFILE.foundation!,
    targetSpecies: ["lake_run_brown_trout"],
    locations: BIG_MANISTEE_RIVER_PROFILE.foundation!.locations?.map(
      (location) =>
        location.locationId === "big_manistee_tippy_dam"
          ? {
            ...location,
            restrictionNotes:
              "Tippy Dam blocks upstream passage for migratory Brown Trout. River Run recommendations end below the dam. Follow current signs, booms, closures, and dam-safety notices.",
          }
          : location,
    ),
    evidenceNotes:
      "The approved public Big Manistee foundation is reused without changing its public target portfolio. This hidden review view adds only migratory Brown Trout, retains the Lower/Middle/Upper sections, and treats Tippy Dam as the impassable upstream endpoint. Species timing and strength remain run-level decisions.",
  },
};

/** Hidden owner-review profile; never add this run to the public run registry. */
export const BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
    runId: "big_manistee_fall_brown_trout",
    biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
    displayName: "Fall Migratory Brown Trout",
    species: "lake_run_brown_trout",
    season: "fall",
    runType: "fall_repeat_spawn",
    movementEngineId: "fall_repeat_spawner_cooling",
    runStageCopyStrategy: "big_manistee_tailwater",
    runWindow: {
      preRunStart: "08-15",
      stagingStart: "08-25",
      start: "09-05",
      beginningEnd: "09-15",
      buildingEstablishedStart: "09-16",
      buildingBroadStart: "09-23",
      peakStart: "09-25",
      peak: "10-01",
      peakEnd: "10-15",
      taperingEnd: "10-31",
      end: "11-30",
      lateEnd: "12-01",
      postRunLateCopyEnd: "12-15",
    },
    historicalPresence: {
      maximum: 5,
      distributionScope: "sectional",
      curveVersion: "big-manistee-migratory-brown-presence-v1-draft",
      evidenceNotes:
        "The Big Manistee supports a documented trophy Brown Trout fishery and direct Lake Michigan access below Tippy Dam, including Michigan's 41.45-pound state-record Brown Trout. Michigan DNR identifies lake-run Browns, late-summer and early-fall tributary entry, September-October spawning, Brown Trout below Tippy, and a small recurring migratory Brown component in the connected Manistee system. The 5/10 ceiling deliberately represents a real but moderate sectional migration with exceptional fish potential without treating resident Brown Trout catches, stocking, or a record fish as proof of a strong migratory run.",
      sourceNotes:
        "Michigan DNR Brown Trout species profile; Little Manistee River 1984 weir periodicity and 1968-present counts; Tippy Dam Recreation Area General Management Plan; Manistee River below Tippy Dam Status Report 2004-4; 2016 and 2022-2023 Manistee River creel surveys; and Michigan DNR state-record fish table. The nearby measured run peaked in September and lingered into November. The October 1 Big Manistee reference peak and 5/10 ceiling remain conservative analog calibration because no direct Big Manistee migratory count series separates lake-run from resident Browns.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
        { dayOffsetFromStart: 10, fractionOfMaximum: .22 },
        { dayOffsetFromStart: 18, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 20, fractionOfMaximum: .75 },
        { dayOffsetFromStart: 26, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 40, fractionOfMaximum: .9 },
        { dayOffsetFromStart: 56, fractionOfMaximum: .65 },
        { dayOffsetFromStart: 71, fractionOfMaximum: .3 },
        { dayOffsetFromStart: 86, fractionOfMaximum: .12 },
      ],
    },
    activity: {
      version: "big-manistee-fall-brown-activity-v1-draft",
      profile: "brown_trout_fall_reaction",
      dataMode: "observed_river",
      minimumInputContract: "weather_and_one_measured_river_input",
      inputReach: {
        reachIds: ["big_manistee_tippy_tailwater"],
        hydraulicSourceIds: ["big_manistee_wellston_usgs"],
        waterTemperatureSourceIds: ["big_manistee_wellston_temperature"],
        weatherPointIds: ["big_manistee_wellston_weather"],
        notes:
          "Observed Activity is limited to the Wellston/Tippy tailwater reach. Lower-river conditions require independent observation.",
      },
      scopeCopy:
        "The measured conditions represent the Wellston/Tippy tailwater in the Upper river. Migratory Brown Trout can be distributed elsewhere below Tippy Dam, where temperature, clarity, and presentation conditions can differ.",
      earlySeasonScopeCopy:
        "Early migratory Brown Trout may still be lakeward or in the Lower and Middle river. Do not apply this Wellston-based score unchanged to those sections.",
      weights: {
        light: .25,
        waterTemperature: .45,
        riverBehavior: .2,
        weather: .1,
      },
      hydraulicTrend: {
        rising24h: {
          ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic.rising24h,
        },
        meaningfulRise24h: {
          ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic
            .meaningfulRise24h,
        },
        sharpRise24h: {
          ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic.sharpRise24h,
        },
      },
      temperature: {
        coldF: 38,
        preferredMinF: 44,
        preferredMaxF: 58,
        warmF: 64,
        barrierF: 70,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        lateRun: 100,
        ending: 100,
      },
      evidenceNotes:
        "Observed-river Activity for a living migratory Brown Trout already present near Wellston. Measured water temperature leads, effective light and tailwater presentation are secondary, and precipitation remains restrained cover context. Brown Trout are repeat spawners, so no salmon mortality ramp, taper penalty, ending ceiling, or automatic post-spawn departure is applied. The model is intentionally scoped to the Tippy tailwater and does not infer lower-river conditions.",
    },
    push: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push,
      version: "big-manistee-fall-brown-push-v1-draft",
      hydraulic: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic },
      rain: { ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.rain },
      temperature: {
        suitabilityLabel: "Big Manistee migratory Brown Trout spawning entry",
        coldHoldingF: 38,
        supportiveMinF: 40,
        preferredMinF: 44,
        supportiveMaxF: 58,
        tooWarmF: 64,
        migrationBarrierF: 70,
      },
      caps: {
        ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.push.caps,
        coldHolding: 49,
      },
      evidenceNotes:
        "The run reuses the accepted Wellston hydraulic response because it is the same regulated migratory corridor, while Brown Trout retain their own repeat-spawner temperature branch. Rain remains precursor-only and Strong movement language still requires measured gauge response.",
      sourceNotes:
        "USGS 04125550 discharge and measured water temperature; Michigan DNR Brown Trout fall-entry and spawning biology. Thresholds are conservative Great Lakes migratory-Brown defaults pending the fixed Big Manistee replay and owner review.",
    },
    fishabilityBands: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      evidenceNotes:
        "The accepted Wellston bands classify presentation shape in the same regulated Upper-river reach for every migratory species. They do not estimate Brown Trout abundance, certify downstream conditions, or determine access or safety.",
    },
    baselineCoverage: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.baselineCoverage,
      version: "big-manistee-fall-brown-flow-baseline-v1-draft",
      sourceNotes:
        "USGS 04125550 daily discharge covers the complete hidden fall migratory-Brown lifecycle. Sherman and other contextual stations are never blended into scoring.",
    },
    waterTemperature: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
      sourcePriority: ["big_manistee_wellston_temperature"],
      notes:
        "Use only same-gauge Wellston measured water temperature. Air temperature and upstream context cannot substitute. The read is limited to the Upper river near Tippy Dam.",
    },
    conditionsSuggest: {
      ...BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest,
      baselineVersion: "big-manistee-fall-brown-conditions-v1-draft",
      gaugeWeight: .4,
      waterTemperatureWeight: .6,
    },
    userCopyHints: {
      stagingTip:
        "Begin with Manistee Lake, the harbor, river entrance, and Lower river when evaluating early migratory Brown Trout entry.",
      preRunTip:
        "A trophy Brown Trout can occur outside the core calendar; one fish does not prove a strong or broadly distributed migration.",
      peakTip:
        "Compare the Upper river below Tippy with the Middle river, avoid active spawning fish, and keep Wellston measurements in their actual reach.",
      endingTip:
        "Surviving Brown Trout may hold in the river or return lakeward after spawning; this fall model does not assert which path an individual fish takes.",
    },
    researchNotes:
      "Hidden Big Manistee migratory Brown Trout owner-review candidate. The calendar follows DNR late-summer/early-fall tributary residence, September-October spawning evidence, and the nearby Little Manistee weir record of a September peak lingering into November. October 1 is an analog reference rather than a direct Big Manistee count peak. Resident and migratory Browns can overlap; the product never labels an individual fish's origin from appearance, location, or date alone.",
    sourceNotes:
      "docs/onboarding/river-run/big_manistee/runs/fall-migratory-brown-trout.md",
    publicAudit: {
      isEnabled: false,
      auditVersion: "big-manistee-fall-brown-owner-review-v1",
      notes:
        "Hidden owner-review only. Public release requires owner acceptance, promotion into the public static configuration, production compatibility checks, and an explicitly authorized deployment.",
    },
  };

export const BIG_MANISTEE_BROWN_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-27-big-manistee-brown-fishability.4",
    movementEngineVersion: getMovementEngineDefinition(
      "fall_repeat_spawner_cooling",
    ).version,
    river: BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE,
    biologyProfiles: [GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE],
    runs: [BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE],
  };
