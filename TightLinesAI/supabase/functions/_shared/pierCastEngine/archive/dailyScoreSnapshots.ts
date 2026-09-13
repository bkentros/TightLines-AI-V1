import {
  PIER_CAST_LEGACY_ROSTER_VERSION,
  pierCastRosterMatches,
} from "../config/privateCalibration.ts";
import type { PierCastCityId } from "../types.ts";
import type {
  PierCastDailyScoreSnapshot,
  PierCastReviewDateOutlook,
} from "../types.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

export type PierCastDailyScoreSnapshotCommitSummary = {
  status: "committed" | "already_committed";
  lakeDate: string;
  setAt: string;
  publishAt: string;
  cityCount: 5;
};

export function pierCastDailyScoreLakeDateForCycle(issuedAt: string): string {
  const cycle = new Date(issuedAt);
  if (!Number.isFinite(cycle.getTime())) {
    throw new Error("PierCast daily score cycle timestamp is invalid.");
  }
  if (![0, 6, 12, 18].includes(cycle.getUTCHours())) {
    throw new Error("PierCast daily score requires a six-hour model cycle.");
  }
  if (cycle.getUTCHours() === 0) return cycle.toISOString().slice(0, 10);
  const centralDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Chicago",
  }).format(cycle);
  if (cycle.getUTCHours() !== 18) return centralDate;
  const [year, month, day] = centralDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1))
    .toISOString()
    .slice(0, 10);
}

export async function archivePierCastDailyScoreSnapshot(input: {
  database: PierCastArchiveClient;
  snapshot: PierCastDailyScoreSnapshot;
}): Promise<PierCastDailyScoreSnapshotCommitSummary> {
  validateSnapshot(input.snapshot);
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_daily_score_snapshot",
    { p_snapshot: input.snapshot },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast daily score snapshot commit failed.",
    );
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    result.lakeDate !== input.snapshot.lakeDate ||
    Date.parse(String(result.publishAt)) !==
      Date.parse(input.snapshot.publishAt) ||
    Number(result.cityCount) !== 5
  ) {
    throw new Error(
      "PierCast daily score snapshot commit returned an invalid result.",
    );
  }
  return {
    status: result.status,
    lakeDate: String(result.lakeDate),
    setAt: String(result.setAt),
    publishAt: String(result.publishAt),
    cityCount: 5,
  };
}

export async function readPublishedPierCastDailyScoreSnapshot(
  database: PierCastArchiveClient,
  now: Date,
): Promise<PierCastDailyScoreSnapshot | null> {
  if (!Number.isFinite(now.getTime())) {
    throw new Error("PierCast daily score read time is invalid.");
  }
  const { data, error } = await database.rpc(
    "read_published_pier_cast_daily_score_snapshot",
    { p_now: now.toISOString() },
  );
  if (error) {
    throw new Error(
      error.message?.trim() || "PierCast daily score snapshot read failed.",
    );
  }
  if (data === null) return null;
  const snapshot = data as PierCastDailyScoreSnapshot;
  validateSnapshot(snapshot);
  if (Date.parse(snapshot.publishAt) > now.getTime()) {
    throw new Error("PierCast daily score snapshot is not published yet.");
  }
  return snapshot;
}

function validateSnapshot(snapshot: PierCastDailyScoreSnapshot): void {
  if (
    !snapshot ||
    snapshot.status !== "locked_daily_snapshot" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(snapshot.lakeDate) ||
    snapshot.scoreTimezone !== "America/Chicago" ||
    !Number.isFinite(Date.parse(snapshot.setAt)) ||
    !Number.isFinite(Date.parse(snapshot.publishAt)) ||
    !snapshot.engineVersion?.trim() ||
    !snapshot.formulaVersion?.trim() ||
    !snapshot.rubricVersion?.trim() ||
    !snapshot.seasonalCalibrationVersion?.trim() ||
    !snapshot.temperatureCalibrationVersion?.trim() ||
    !Number.isFinite(Date.parse(snapshot.source?.issuedAt)) ||
    !Number.isFinite(Date.parse(snapshot.source?.fetchedAt)) ||
    !Array.isArray(snapshot.cities) ||
    snapshot.cities.length !== 5 ||
    new Set(snapshot.cities.map((city) => city.cityId)).size !== 5 ||
    snapshot.cities.some(
      (city) =>
        city.date?.localDate !== snapshot.lakeDate ||
        city.date?.scope !== "full_day" ||
        !isCompleteDate(
          city.cityId,
          city.date,
          snapshot.speciesRosterVersion ?? PIER_CAST_LEGACY_ROSTER_VERSION,
        ),
    )
  ) {
    throw new Error("PierCast daily score snapshot is invalid.");
  }
}

function isCompleteDate(
  cityId: PierCastCityId,
  date: PierCastReviewDateOutlook,
  version: string,
): boolean {
  return (
    date.headline.overall.status === "available" &&
    pierCastRosterMatches(
      cityId,
      date.species.map((s) => s.speciesId),
      version,
    ) &&
    date.species.every(
      (species) =>
        species.biological.status === "available" &&
        species.coverage.status === "complete",
    )
  );
}
