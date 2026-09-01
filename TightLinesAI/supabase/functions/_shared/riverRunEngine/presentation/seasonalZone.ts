import type {
  RiverFoundationReach,
  RiverProfile,
  RiverRunProfile,
} from "../types.ts";
import { compareLocalDates } from "../metrics/dateWindow.ts";
import type { RunStageResult } from "../scoring/runStage.ts";

export type RiverRunSeasonalZone = {
  status: "not_started" | "active" | "complete";
  label: string;
  foundationReachIds: string[];
  earlyApproach?: {
    label: string;
    phase: "before_migration" | "beginning";
    accessRecommendation: false;
  };
  basis: "seasonal_calendar";
  orientationOnly: true;
};

/**
 * Produces a small seasonal geography cue without recommending an access,
 * claiming live fish distribution, or requiring authored state copy.
 */
export function resolveSeasonalZone(input: {
  river: Pick<RiverProfile, "foundation">;
  run: Pick<
    RiverRunProfile,
    "historicalPresence" | "seasonalZoneReachIds" | "seasonalZonePlan"
  >;
  stage: Pick<
    RunStageResult,
    "stage" | "stagingContext" | "window"
  >;
  localDate: string;
  presentationReachIds?: string[];
}): RiverRunSeasonalZone {
  const runIds = new Set(input.run.seasonalZoneReachIds ?? []);
  const presentationIds = new Set(input.presentationReachIds ?? []);
  const foundationReaches = input.river.foundation?.reaches ?? [];
  const allowedReaches = foundationReaches.filter((reach) =>
    (runIds.size === 0 || runIds.has(reach.reachId)) &&
    (presentationIds.size === 0 || presentationIds.has(reach.reachId))
  );
  if (input.stage.stage === "post_run") {
    return zone("complete", "No active seasonal zone", []);
  }
  if (input.stage.stage === "pre_run") {
    return input.run.seasonalZonePlan?.earlyApproach
      ? zone(
        "not_started",
        "Early-season approach area",
        [],
        {
          label: input.run.seasonalZonePlan.earlyApproach.label,
          phase: "before_migration",
          accessRecommendation: false,
        },
      )
      : zone("not_started", "No dependable in-river zone yet", []);
  }
  if (!input.run.seasonalZonePlan) {
    return zone("active", "Accessible migration corridor", []);
  }
  const plannedReachIds = plannedPhaseReachIds(input);
  const plannedReaches = plannedReachIds
    .map((reachId) => allowedReaches.find((reach) => reach.reachId === reachId))
    .filter((reach): reach is RiverFoundationReach => !!reach);
  const approach = input.stage.stage === "beginning" &&
      input.run.seasonalZonePlan.earlyApproach
    ? {
      label: input.run.seasonalZonePlan.earlyApproach.label,
      phase: "beginning" as const,
      accessRecommendation: false as const,
    }
    : undefined;
  if (plannedReaches.length === 0) {
    return zone("active", "No audited phase reach in this view", [], approach);
  }
  return reachZone(plannedReaches, approach);
}

function plannedPhaseReachIds(input: {
  run: Pick<RiverRunProfile, "seasonalZonePlan">;
  stage: Pick<RunStageResult, "stage" | "window">;
  localDate: string;
}): string[] {
  const phases = input.run.seasonalZonePlan!.phases;
  switch (input.stage.stage) {
    case "beginning":
      return phases.beginning;
    case "building": {
      const established = compareLocalDates(
        input.localDate,
        input.stage.window.buildingEstablishedStartDate,
      ) >= 0;
      const broad = !!input.stage.window.buildingBroadStartDate &&
        compareLocalDates(
            input.localDate,
            input.stage.window.buildingBroadStartDate,
          ) >= 0;
      if (!established) return phases.buildingEarly;
      if (broad) return phases.buildingBroad;
      return phases.buildingEstablished;
    }
    case "peak":
      return phases.peak;
    case "tapering":
      return phases.tapering;
    case "ending":
      return phases.ending;
    default:
      return [];
  }
}

function reachZone(
  reaches: RiverFoundationReach[],
  earlyApproach?: RiverRunSeasonalZone["earlyApproach"],
): RiverRunSeasonalZone {
  if (reaches.length === 0) {
    return zone("active", "Accessible migration corridor", []);
  }
  const labels = reaches.map(reachLabel);
  const label = labels.length === 1
    ? labels[0]
    : `${labels[0]} → ${labels.at(-1)}`;
  return zone(
    "active",
    label,
    reaches.map((reach) => reach.reachId),
    earlyApproach,
  );
}

function reachLabel(reach: RiverFoundationReach): string {
  return reach.displayName
    .split(" — ")[0]
    .replace(/\s+\([^)]*\)$/, "")
    .trim();
}

function zone(
  status: RiverRunSeasonalZone["status"],
  label: string,
  foundationReachIds: string[],
  earlyApproach?: RiverRunSeasonalZone["earlyApproach"],
): RiverRunSeasonalZone {
  return {
    status,
    label,
    foundationReachIds,
    ...(earlyApproach ? { earlyApproach } : {}),
    basis: "seasonal_calendar",
    orientationOnly: true,
  };
}
