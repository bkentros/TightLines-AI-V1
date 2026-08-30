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
    "historicalPresence" | "seasonalZoneReachIds"
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
  const migratoryReaches = orderedMigratoryReaches(
    input.river.foundation?.reaches ?? [],
  ).filter((reach) =>
    (runIds.size === 0 || runIds.has(reach.reachId)) &&
    (presentationIds.size === 0 || presentationIds.has(reach.reachId))
  );
  if (input.stage.stage === "post_run") {
    return zone("complete", "No active seasonal zone", []);
  }
  if (input.stage.stage === "pre_run") {
    return input.stage.stagingContext
      ? zone("not_started", "Mouth and staging-water context", [])
      : zone("not_started", "No dependable in-river zone yet", []);
  }
  if (migratoryReaches.length === 0) {
    return zone("active", "Accessible migration corridor", []);
  }

  const first = migratoryReaches.slice(0, 1);
  const firstTwo = migratoryReaches.slice(0, 2);
  switch (input.stage.stage) {
    case "beginning":
      return reachZone(first);
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
      if (!established) return reachZone(first);
      if (broad && input.run.historicalPresence.distributionScope === "broad") {
        return reachZone(migratoryReaches);
      }
      return reachZone(firstTwo);
    }
    case "peak":
      return input.run.historicalPresence.distributionScope === "concentrated"
        ? zone(
          "active",
          "Core accessible migration corridor",
          migratoryReaches.map((reach) => reach.reachId),
        )
        : reachZone(migratoryReaches);
    case "tapering":
    case "ending":
      return zone(
        "active",
        "Established accessible sections",
        migratoryReaches.map((reach) => reach.reachId),
      );
  }
}

function orderedMigratoryReaches(
  reaches: RiverFoundationReach[],
): RiverFoundationReach[] {
  return reaches
    .filter((reach) => reach.role !== "mouth_context" && reach.role !== "harbor")
    .toSorted((a, b) =>
      migrationOrder(a.role) - migrationOrder(b.role) || a.order - b.order
    );
}

function migrationOrder(role: RiverFoundationReach["role"]): number {
  switch (role) {
    case "lower":
    case "downstream":
      return 1;
    case "middle":
      return 2;
    case "upper":
    case "terminal":
    case "tailwater":
      return 3;
    case "harbor":
    case "mouth_context":
      return 0;
  }
}

function reachZone(reaches: RiverFoundationReach[]): RiverRunSeasonalZone {
  if (reaches.length === 0) {
    return zone("active", "Accessible migration corridor", []);
  }
  const labels = reaches.map(reachLabel);
  const label = labels.length === 1
    ? labels[0]
    : `${labels[0]} → ${labels.at(-1)}`;
  return zone("active", label, reaches.map((reach) => reach.reachId));
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
): RiverRunSeasonalZone {
  return {
    status,
    label,
    foundationReachIds,
    basis: "seasonal_calendar",
    orientationOnly: true,
  };
}
