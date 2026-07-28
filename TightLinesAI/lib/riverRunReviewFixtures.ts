import type {
  RiverRunConditionsSuggest,
  RiverRunFishability,
  RiverRunFishInRiver,
  RiverRunPrimitiveDisplay,
  RiverRunPush,
  RiverRunSnapshotResponse,
  RiverRunStage,
} from "./riverRunContracts";

export type RiverRunReviewScenario = {
  id: string;
  label: string;
  note?: string;
  snapshot: RiverRunSnapshotResponse;
};

export type RiverRunReviewGroup = {
  id: string;
  label: string;
  scenarios: RiverRunReviewScenario[];
};

const stageCopy: Record<string, RiverRunStage> = {
  pre_run: primitive(
    "Pre-run",
    "The river run window has not opened yet.",
    "Maturing fish may stage in nearby lake, harbor, or river-mouth water during this configured run window staging period; this does not confirm fish in the river.",
    "Treat nearby staging as seasonal context and compare it with measured river conditions separately.",
  ),
  beginning: primitive(
    "Beginning",
    "The calendar is at the beginning of the configured window.",
    "This stage marks the early portion of the researched run calendar.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
  building: primitive(
    "Building",
    "The calendar is in the building portion of the run window.",
    "This stage sits between the beginning window and the configured peak window.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
  peak: primitive(
    "Peak",
    "The calendar is inside the configured peak window.",
    "This describes timing within the researched run calendar.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
  tapering: primitive(
    "Tapering",
    "The calendar is past the configured peak window.",
    "This stage describes the tapering portion of the researched run calendar.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
  ending: primitive(
    "Ending",
    "The calendar is near the end of the configured window.",
    "This stage describes the late portion of the researched run calendar.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
  post_run: primitive(
    "Post-run",
    "The configured run window has passed.",
    "This stage describes calendar timing after the researched run window.",
    "Compare this calendar-stage read with the other primitives separately.",
  ),
};

const conditionsCopy: Record<string, RiverRunConditionsSuggest> = {
  evaluating: {
    ...primitive(
      "Evaluating",
      "Conditions Suggest is building its first cumulative checkpoint.",
      "Measured water temperature and Scottville river response are accumulating from the configured staging start.",
      "The next locked timing checkpoint is 2026-08-15.",
    ),
    timingLabel: null,
    candidateLabel: null,
    observationStartDate: "2026-07-28",
    nextCheckpointDate: "2026-08-15",
    completedCheckpointCount: 0,
  },
  ahead: {
    ...primitive(
      "Ahead",
      "Cumulative conditions suggest earlier timing than typical.",
      "Scottville river response and measured-water temperature from staging through the pre-run checkpoint both rank on the earlier side of the historical pattern.",
      "This is a cumulative timing inference, not confirmation that fish entered the river.",
    ),
    timingLabel: "Ahead",
    candidateLabel: "Ahead",
    checkpointId: "river_start",
    checkpointDate: "2026-08-15",
    completedCheckpointCount: 1,
    historicalYears: 5,
    coveragePercent: 100,
  },
  typical: {
    ...primitive(
      "Typical",
      "Cumulative conditions suggest timing near the historical pattern.",
      "The combined river-response and measured-water pattern from staging through the beginning-stage checkpoint remains near its historical range.",
      "Use Push separately for the newest movement-trigger conditions.",
    ),
    timingLabel: "Typical",
    candidateLabel: "Typical",
    checkpointId: "building_start",
    checkpointDate: "2026-08-24",
    completedCheckpointCount: 2,
    historicalYears: 5,
    coveragePercent: 100,
  },
  delayed: {
    ...primitive(
      "Delayed",
      "Cumulative conditions suggest later timing than typical.",
      "Scottville river response and measured-water temperature from staging through the building-stage checkpoint both rank on the later side of the historical pattern.",
      "A fresh Push can improve current conditions without rewriting this locked cumulative checkpoint.",
    ),
    timingLabel: "Delayed",
    candidateLabel: "Delayed",
    checkpointId: "peak_start",
    checkpointDate: "2026-09-15",
    completedCheckpointCount: 3,
    historicalYears: 5,
    coveragePercent: 100,
  },
  insufficient: {
    ...primitive(
      "Insufficient evidence",
      "Conditions Suggest has insufficient checkpoint evidence.",
      "The completed checkpoint is missing enough matching primary-gauge, measured-water, or historical evidence to classify timing.",
      "Conditions Suggest stays unclassified rather than guessing from incomplete evidence.",
    ),
    timingLabel: "Insufficient evidence",
    candidateLabel: "Insufficient evidence",
    checkpointId: "river_start",
    checkpointDate: "2026-08-15",
    completedCheckpointCount: 1,
    historicalYears: 5,
    coveragePercent: 61,
  },
  complete_underway: {
    ...primitive(
      "Timing complete",
      "The configured Fall Chinook run is now well underway by calendar timing.",
      "The final cumulative peak-window checkpoint was Typical. That result is locked and will not reverse after peak.",
      "Conditions Suggest is complete for this run; use Push for fresh movement conditions and Fish In River for expected seasonal presence.",
    ),
    timingLabel: "Typical",
    candidateLabel: "Typical",
    checkpointId: "peak_complete",
    checkpointDate: "2026-09-26",
    completedCheckpointCount: 4,
    historicalYears: 5,
    coveragePercent: 100,
  },
  complete_post_run: {
    ...primitive(
      "Timing complete",
      "The configured Fall Chinook run window has passed.",
      "The final cumulative peak-window checkpoint was Typical. That result is locked and will not reverse after peak.",
      "Conditions Suggest and Push tracking are complete for this run; Fish In River remains historical seasonal-presence context only.",
    ),
    timingLabel: "Typical",
    candidateLabel: "Typical",
    checkpointId: "peak_complete",
    checkpointDate: "2026-09-26",
    completedCheckpointCount: 4,
    historicalYears: 5,
    coveragePercent: 100,
  },
};

const lakeEntryTip =
  "Fresh fish may enter from the lake without a textbook weather event. Cooling, rainfall, and river response more commonly support entry, but this signal cannot confirm or rule out movement.";

const pushCopy: Record<string, RiverRunPush> = {
  weak: scoredPrimitive(
    20,
    "Weak",
    "Current conditions show a weak fresh-push signal.",
    "Scottville is falling, measured water remains warm, and recent modeled rainfall is too light to add support.",
    lakeEntryTip,
  ),
  no_clear: scoredPrimitive(
    35,
    "No clear push",
    "Current conditions do not show a clear fresh-push signal.",
    "Scottville has no material river response yet. Measured water is suitable but steady, and recent modeled rainfall adds no independent support.",
    lakeEntryTip,
  ),
  possible: scoredPrimitive(
    60,
    "Possible",
    "Current conditions show a possible fresh-push signal.",
    "Scottville has an early river response, measured water is cooling inside the configured adult fall Chinook migration range, and modeled rainfall provides limited precursor context.",
    lakeEntryTip,
  ),
  strong: scoredPrimitive(
    77,
    "Strong",
    "Current conditions support a strong fresh-push signal.",
    "Scottville changed +128 cfs (+18.7%) over the matched 24-hour comparison, a sharp river response. Measured water is suitable and cooling; rainfall is treated as absorbed context.",
    lakeEntryTip,
  ),
  very_strong: scoredPrimitive(
    86,
    "Very strong",
    "Current conditions support a very strong fresh-push signal.",
    "Scottville shows a sharp measured response while suitable measured water is cooling strongly. The gauge already reflects the event, so rainfall is not counted again.",
    lakeEntryTip,
  ),
  unavailable: {
    ...primitive(
      "Unavailable",
      "Push is unavailable without current required river evidence.",
      "A current primary-gauge read and measured water temperature are required for this fall-cooling movement signal.",
      "Check again after the missing source returns and the next condition refresh completes.",
      null,
    ),
    rulesVersion: "pm-fall-chinook-push-v3",
  },
  not_started: {
    ...primitive(
      "Tracking not started",
      "Push tracking begins August 15, 2026.",
      "This is the configured river-run start date. Before then, nearby lake, harbor, and river-mouth staging is covered by Run Stage rather than a river-entry Push report.",
      "Push will begin automatically when this specific river run begins.",
      null,
    ),
    rulesVersion: "pm-fall-chinook-push-v3",
  },
  complete: {
    ...primitive(
      "Tracking complete",
      "Fresh-push tracking is complete for this run.",
      "The configured river run ended October 20, 2026. Push no longer reports current movement-trigger conditions or prior supportive-condition dates.",
      "Run Stage and Fish In River continue to describe the remaining seasonal context.",
      null,
    ),
    rulesVersion: "pm-fall-chinook-push-v3",
  },
};

const fishabilityCopy: Record<string, RiverRunFishability> = {
  poor: scoredPrimitive(
    15,
    "Poor",
    "The primary gauged reach is currently poor for consistent fishing.",
    "Scottville is 1,700 cfs, inside the configured Blown Out band, and changed +300 cfs (+21.4%) over the matched 24-hour comparison. The sharp rise substantially reduces hydraulic predictability.",
    "This primary-reach hydraulic state is rarely workable for consistent fishing. Do not treat Fishability as a safety rating.",
  ),
  tough: scoredPrimitive(
    45,
    "Tough",
    "The primary gauged reach currently presents meaningful constraints.",
    "Scottville is 1,200 cfs, inside the configured Very High band, and is relatively stable.",
    "Very high water can materially limit access and presentation. This is not a wading or boating safety determination.",
  ),
  fishable: scoredPrimitive(
    60,
    "Fishable",
    "The primary gauged reach currently remains workable.",
    "Scottville is 450 cfs, inside the configured Low band, and is relatively stable.",
    "Lower water remains workable, but reduced cover can make the river less forgiving.",
  ),
  good: scoredPrimitive(
    75,
    "Good",
    "The primary gauged reach currently supports good fishing conditions.",
    "Scottville is 500 cfs, inside the configured Normal Fishable band, and is relatively stable.",
    "This is a workable primary-reach shape with fewer hydraulic advantages than the configured ideal band.",
  ),
  excellent: scoredPrimitive(
    93,
    "Excellent",
    "The primary gauged reach is currently in an excellent working range.",
    "Scottville is 600 cfs, inside the configured Ideal band, and is relatively stable.",
    "This band offers the broadest primary-reach presentation options represented by the configured gauge.",
  ),
  unavailable: primitive(
    "Unavailable",
    "Fishability is unavailable without a current primary-gauge read.",
    "A usable Scottville discharge reading is required to describe current primary-reach shape.",
    "Check again after the next condition refresh.",
    null,
  ),
};

const baseFishInRiver = fishInRiver(5);

const BASE_SNAPSHOT: RiverRunSnapshotResponse = {
  riverId: "pere_marquette",
  runId: "pere_marquette_fall_chinook",
  localDate: "2026-09-05",
  timezone: "America/Detroit",
  progressionSnapshotAt: "2026-09-05T12:00:00.000Z",
  conditionRefreshAt: "2026-09-05T20:00:00.000Z",
  refreshSlot: "16:00",
  progressionExpiresAt: "2026-09-06T04:00:00.000Z",
  nextConditionRefreshAt: "2026-09-06T12:00:00.000Z",
  runStage: stageCopy.building,
  conditionsSuggest: conditionsCopy.typical,
  push: pushCopy.possible,
  pushHistory: {
    status: "previously_recorded",
    minimumSupportiveScore: 50,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
    throughDate: "2026-09-05",
    lastSupportiveConditions: {
      localDate: "2026-09-02",
      refreshSlot: "16:00",
      conditionRefreshAt: "2026-09-02T20:00:00.000Z",
      score: 72,
      label: "Strong",
    },
  },
  fishability: fishabilityCopy.good,
  fishInRiver: baseFishInRiver,
  gauge: {
    provider: "USGS",
    siteId: "04122500",
    primaryMetric: "flow_cfs",
    observedAt: "2026-09-05T19:45:00.000Z",
    value: 500,
    band: "normal_fishable",
    trend: "stable",
    absoluteChange24h: 4,
    percentChange24h: 0.8,
  },
  weather: {
    provider: "OPEN_METEO",
    evidenceType: "modeled_grid",
    weatherPointId: "pere_marquette_primary",
    rain24hIn: 0.18,
    rain48hIn: 0.34,
    rain72hIn: 0.41,
  },
  waterTemperature: {
    provider: "MONITOR_MY_WATERSHED",
    sourceId: "pmtu_maple_leaf",
    siteId: "PMTU-MapleLeaf",
    seriesId: "4939",
    observedAt: "2026-09-05T19:30:00.000Z",
    waterTempF: 61.4,
    trend: "cooling",
    sourceType: "same_gauge",
    attribution: "Measured water temperature",
  },
  conditionsWaterTemperature: {
    provider: "MONITOR_MY_WATERSHED",
    sourceId: "pmtu_m37",
    siteId: "PMTU-M37",
    seriesId: "3201",
    observedAt: "2026-09-05T19:30:00.000Z",
    waterTempF: 60.8,
    trend: "cooling",
    sourceType: "same_gauge",
    attribution: "Measured water temperature",
  },
  freshness: {
    gauge: "fresh",
    weather: "fresh",
    waterTemperature: "fresh",
    conditionsWaterTemperature: "fresh",
    conditionsSuggestDaysUsable: 40,
  },
  dataQuality: {
    label: "Fresh",
    reasonCodes: ["data_quality_fresh"],
  },
  safety: {
    regulationReminder:
      "Check current regulations, closures, and access rules before fishing.",
    gaugeBasis:
      "Fishability describes the primary Scottville gauged reach; conditions can differ elsewhere.",
    activityDisclaimer:
      "River Run is not a wading, boating, floating, or personal-safety rating.",
  },
  engineVersion: "river-run-v1.2.1-review-fixture",
  configVersion: "2026-07-28.3-review-fixture",
};

export const RIVER_RUN_REVIEW_GROUPS: RiverRunReviewGroup[] = [
  {
    id: "run_stage",
    label: "Run Stage",
    scenarios: [
      coherentScenario("stage_pre", "Pre-run", {
        localDate: "2026-08-01",
        runStage: stageCopy.pre_run,
        conditionsSuggest: conditionsCopy.evaluating,
        push: pushCopy.not_started,
        fishInRiver: fishInRiver(0),
        pushHistory: pushHistory("not_started"),
      }),
      coherentScenario("stage_beginning", "Beginning", {
        localDate: "2026-08-15",
        runStage: stageCopy.beginning,
        conditionsSuggest: conditionsCopy.ahead,
        fishInRiver: fishInRiver(1),
      }),
      coherentScenario("stage_building", "Building", {
        runStage: stageCopy.building,
      }),
      coherentScenario("stage_peak", "Peak", {
        localDate: "2026-09-20",
        runStage: stageCopy.peak,
        push: pushCopy.no_clear,
        fishInRiver: fishInRiver(10),
        interpretationNote: {
          headline:
            "Peak calendar timing and a weak current Push can occur together.",
          detail:
            "Run Stage marks the configured peak window, while Push finds limited current support for a fresh entry event; peak timing does not require a new push today.",
        },
      }),
      coherentScenario("stage_tapering", "Tapering", {
        localDate: "2026-10-01",
        runStage: stageCopy.tapering,
        conditionsSuggest: conditionsCopy.complete_underway,
        fishInRiver: fishInRiver(8),
      }),
      coherentScenario("stage_ending", "Ending", {
        localDate: "2026-10-15",
        runStage: stageCopy.ending,
        conditionsSuggest: conditionsCopy.complete_underway,
        push: pushCopy.weak,
        fishInRiver: fishInRiver(4),
      }),
      coherentScenario("stage_post", "Post-run", {
        localDate: "2026-10-25",
        runStage: stageCopy.post_run,
        conditionsSuggest: conditionsCopy.complete_post_run,
        push: pushCopy.complete,
        pushHistory: pushHistory("complete"),
        fishInRiver: fishInRiver(2),
        interpretationNote: {
          headline:
            "The main run window has ended while a limited historical tail remains.",
          detail:
            "Run Stage marks the configured main window complete, while Fish In River retains the separately configured late historical-presence tail; this does not mean a fresh run is still underway.",
        },
      }),
    ],
  },
  {
    id: "conditions",
    label: "Conditions",
    scenarios: [
      coherentScenario("conditions_evaluating", "Evaluating", {
        localDate: "2026-08-01",
        runStage: stageCopy.pre_run,
        conditionsSuggest: conditionsCopy.evaluating,
        push: pushCopy.not_started,
        pushHistory: pushHistory("not_started"),
        fishInRiver: fishInRiver(0),
      }),
      coherentScenario("conditions_ahead", "Ahead", {
        localDate: "2026-08-15",
        runStage: stageCopy.beginning,
        conditionsSuggest: conditionsCopy.ahead,
        fishInRiver: fishInRiver(1),
      }),
      coherentScenario("conditions_typical", "Typical", {
        conditionsSuggest: conditionsCopy.typical,
      }),
      coherentScenario("conditions_delayed", "Delayed", {
        conditionsSuggest: conditionsCopy.delayed,
      }),
      coherentScenario("conditions_insufficient", "Insufficient", {
        conditionsSuggest: conditionsCopy.insufficient,
        dataQuality: {
          label: "Limited",
          reasonCodes: ["data_quality_limited"],
        },
      }),
      coherentScenario("conditions_complete_active", "Complete · active run", {
        localDate: "2026-10-01",
        runStage: stageCopy.tapering,
        conditionsSuggest: conditionsCopy.complete_underway,
        fishInRiver: fishInRiver(8),
      }),
      coherentScenario("conditions_complete_post", "Complete · post-run", {
        localDate: "2026-10-25",
        runStage: stageCopy.post_run,
        conditionsSuggest: conditionsCopy.complete_post_run,
        push: pushCopy.complete,
        pushHistory: pushHistory("complete"),
        fishInRiver: fishInRiver(2),
      }),
    ],
  },
  {
    id: "push",
    label: "Push",
    scenarios: [
      primitiveScenario("push_weak", "Weak", "push", pushCopy.weak),
      primitiveScenario(
        "push_no_clear",
        "No clear push",
        "push",
        pushCopy.no_clear,
      ),
      primitiveScenario("push_possible", "Possible", "push", pushCopy.possible),
      primitiveScenario("push_strong", "Strong", "push", pushCopy.strong),
      primitiveScenario(
        "push_very_strong",
        "Very strong",
        "push",
        pushCopy.very_strong,
      ),
      primitiveScenario(
        "push_unavailable",
        "Unavailable",
        "push",
        pushCopy.unavailable,
      ),
      coherentScenario("push_not_started", "Tracking not started", {
        localDate: "2026-08-01",
        runStage: stageCopy.pre_run,
        conditionsSuggest: conditionsCopy.evaluating,
        push: pushCopy.not_started,
        pushHistory: pushHistory("not_started"),
        fishInRiver: fishInRiver(0),
      }),
      coherentScenario("push_complete", "Tracking complete", {
        localDate: "2026-10-25",
        runStage: stageCopy.post_run,
        conditionsSuggest: conditionsCopy.complete_post_run,
        push: pushCopy.complete,
        pushHistory: pushHistory("complete"),
        fishInRiver: fishInRiver(2),
      }),
    ],
  },
  {
    id: "fishability",
    label: "Fishability",
    scenarios: [
      primitiveScenario(
        "fishability_poor",
        "Poor",
        "fishability",
        fishabilityCopy.poor,
      ),
      primitiveScenario(
        "fishability_tough",
        "Tough",
        "fishability",
        fishabilityCopy.tough,
      ),
      primitiveScenario(
        "fishability_fishable",
        "Fishable",
        "fishability",
        fishabilityCopy.fishable,
      ),
      primitiveScenario(
        "fishability_good",
        "Good",
        "fishability",
        fishabilityCopy.good,
      ),
      primitiveScenario(
        "fishability_excellent",
        "Excellent",
        "fishability",
        fishabilityCopy.excellent,
      ),
      primitiveScenario(
        "fishability_unavailable",
        "Unavailable",
        "fishability",
        fishabilityCopy.unavailable,
      ),
    ],
  },
  {
    id: "fish_in_river",
    label: "Fish In River",
    scenarios: Array.from(
      { length: 11 },
      (_, score) =>
        coherentScenario(`fish_in_river_${score}`, `${score} / 10`, {
          fishInRiver: fishInRiver(score),
        }),
    ),
  },
  {
    id: "combined",
    label: "Combined reads",
    scenarios: [
      coherentScenario("combined_strong_tough", "Strong + Tough", {
        push: pushCopy.strong,
        fishability: fishabilityCopy.tough,
        interpretationNote: {
          headline:
            "Movement signal and river shape are pointing in different directions.",
          detail:
            "Push reflects current movement-trigger conditions, while Fishability reflects primary-reach fishing shape; a supportive event can temporarily make the reach harder to fish.",
        },
      }),
      coherentScenario("combined_peak_weak", "Peak + weak Push", {
        localDate: "2026-09-20",
        runStage: stageCopy.peak,
        push: pushCopy.weak,
        fishInRiver: fishInRiver(10),
        interpretationNote: {
          headline:
            "Peak calendar timing and a weak current Push can occur together.",
          detail:
            "Run Stage marks the configured peak window, while Push finds limited current support for a fresh entry event; peak timing does not require a new push today.",
        },
      }),
      coherentScenario("combined_good_low", "Good + low presence", {
        localDate: "2026-08-15",
        runStage: stageCopy.beginning,
        fishability: fishabilityCopy.good,
        fishInRiver: fishInRiver(1),
        interpretationNote: {
          headline:
            "River shape is favorable while seasonal presence context is low.",
          detail:
            "Fishability says the primary reach is workable, while Fish In River says historical presence for this date is low; good river shape does not imply high fish numbers.",
        },
      }),
      coherentScenario("combined_delayed_strong", "Delayed + Strong", {
        conditionsSuggest: conditionsCopy.delayed,
        push: pushCopy.strong,
        interpretationNote: {
          headline:
            "Current Push is strong while the locked timing checkpoint remains Delayed.",
          detail:
            "Push describes the current movement-trigger event, while Conditions Suggest retains its cumulative historical checkpoint; a delayed run can still receive a supportive event now.",
        },
      }),
      coherentScenario("combined_beginning_ahead", "Beginning + Ahead", {
        localDate: "2026-08-15",
        runStage: stageCopy.beginning,
        conditionsSuggest: conditionsCopy.ahead,
        fishInRiver: fishInRiver(1),
        interpretationNote: {
          headline:
            "Several River Run reads are describing different parts of the current picture.",
          detail:
            "Conditions Suggest compares cumulative checkpoint evidence with history, while Run Stage remains the configured calendar position. Fishability says the primary reach is workable, while Fish In River says historical presence for this date is low; good river shape does not imply high fish numbers.",
        },
      }),
      coherentScenario("combined_multiple", "Three-way explanation", {
        conditionsSuggest: conditionsCopy.delayed,
        push: pushCopy.strong,
        fishability: fishabilityCopy.tough,
        interpretationNote: {
          headline:
            "Several River Run reads are describing different parts of the current picture.",
          detail:
            "Push reflects current movement-trigger conditions, while Fishability reflects primary-reach fishing shape; a supportive event can temporarily make the reach harder to fish. Push describes the current movement-trigger event, while Conditions Suggest retains its cumulative historical checkpoint; a delayed run can still receive a supportive event now.",
        },
      }),
    ],
  },
  {
    id: "evidence",
    label: "Evidence quality",
    scenarios: [
      coherentScenario("evidence_fresh", "Fresh", {}),
      coherentScenario("evidence_partial", "Partial", {
        freshness: {
          ...BASE_SNAPSHOT.freshness,
          weather: "missing",
        },
        dataQuality: {
          label: "Partial",
          reasonCodes: ["data_quality_partial"],
        },
        weather: null,
      }),
      coherentScenario("evidence_stale", "Stale", {
        freshness: {
          ...BASE_SNAPSHOT.freshness,
          gauge: "stale",
        },
        dataQuality: {
          label: "Stale",
          reasonCodes: ["data_quality_stale"],
        },
      }),
      coherentScenario("evidence_limited", "Limited", {
        conditionsSuggest: conditionsCopy.insufficient,
        push: pushCopy.unavailable,
        fishability: fishabilityCopy.unavailable,
        freshness: {
          gauge: "missing",
          weather: "fresh",
          waterTemperature: "missing",
          conditionsWaterTemperature: "missing",
          conditionsSuggestDaysUsable: 0,
        },
        dataQuality: {
          label: "Limited",
          reasonCodes: ["data_quality_limited"],
        },
        gauge: null,
        waterTemperature: null,
        conditionsWaterTemperature: null,
      }),
      coherentScenario("evidence_upstream", "Upstream temp fallback", {
        freshness: {
          ...BASE_SNAPSHOT.freshness,
          waterTemperature: "fresh",
        },
        dataQuality: {
          label: "Partial",
          reasonCodes: ["data_quality_partial"],
        },
        waterTemperature: {
          ...BASE_SNAPSHOT.waterTemperature,
          sourceId: "pmtu_bowman_60th",
          siteId: "PMTU-Bowman60th",
          seriesId: "3209",
          waterTempF: 60.2,
          sourceType: "upstream",
          isUpstreamFallback: true,
          attribution: "Measured upstream water temperature",
        },
      }),
    ],
  },
];

function coherentScenario(
  id: string,
  label: string,
  overrides: Partial<RiverRunSnapshotResponse>,
): RiverRunReviewScenario {
  return {
    id,
    label,
    snapshot: {
      ...BASE_SNAPSHOT,
      ...overrides,
      engineVersion: "river-run-v1.2.1-review-fixture",
      configVersion: "2026-07-28.3-review-fixture",
    },
  };
}

function primitiveScenario<
  TKey extends "push" | "fishability",
>(
  id: string,
  label: string,
  key: TKey,
  value: RiverRunSnapshotResponse[TKey],
): RiverRunReviewScenario {
  return coherentScenario(id, label, { [key]: value });
}

function primitive<T extends RiverRunPrimitiveDisplay>(
  label: string,
  headline: string,
  detail: string,
  tip: string,
  score?: number | null,
): T {
  return {
    label,
    headline,
    detail,
    tip,
    ...(score === undefined ? {} : { score }),
    reasonCodes: ["review_fixture"],
  } as T;
}

function scoredPrimitive<T extends RiverRunPrimitiveDisplay>(
  score: number,
  label: string,
  headline: string,
  detail: string,
  tip: string,
): T {
  return primitive(label, headline, detail, tip, score);
}

function fishInRiver(score: number): RiverRunFishInRiver {
  const label = score === 0
    ? "Outside historical window"
    : score <= 2
    ? "Low historical presence"
    : score <= 4
    ? "Building historical presence"
    : score <= 6
    ? "Moderate historical presence"
    : score <= 8
    ? "High historical presence"
    : "Peak historical presence";
  return {
    ...primitive(
      label,
      score === 0
        ? "Historical river presence is outside the configured window."
        : `${label} is typical for this point in the configured run.`,
      score === 0
        ? "The configured seasonal presence curve is 0 / 10 for this date; nearby staging does not count as fish in the river."
        : `The river-specific historical seasonal presence level is ${score} / 10; it is not a fish count or a live observation.`,
      score === 0
        ? "Use Run Stage for calendar context and current-condition primitives for separate signals."
        : "Compare historical presence with Push and Fishability without treating either as proof of fish numbers.",
      score,
    ),
    maximum: 10,
    curveFraction: score / 10,
  };
}

function pushHistory(
  status: "not_started" | "complete",
): RiverRunSnapshotResponse["pushHistory"] {
  return {
    status,
    minimumSupportiveScore: 50,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
    throughDate: status === "not_started" ? "2026-08-01" : "2026-10-25",
  };
}
