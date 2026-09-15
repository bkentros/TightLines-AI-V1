import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import {
  type PierCastArchiveClient,
  readLatestFreshPierCastLmhofsBatch,
} from "./lmhofsArchive.ts";
import { readLatestFreshPierCastWisconsinLmhofsBatch } from "./wisconsinLmhofsArchive.ts";
import { readLatestFreshPierCastLakeHuronLmhofsBatch } from "./lakeHuronLmhofsArchive.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

type CohortReader = (
  database: PierCastArchiveClient,
  now: Date,
) => Promise<AvailableBatch | null>;

export type PierCastV3SourceCohorts = {
  primary: AvailableBatch;
  expansion: AvailableBatch;
  lakeHuron: AvailableBatch;
  issuedAt: string;
  usedCommonCycleFallback: boolean;
};

/**
 * Select the newest cycle that is fresh and complete in all three archives.
 *
 * The primary and expansion jobs intentionally run a few minutes apart. During
 * that window their individually newest cycles can differ. We first require
 * all newest cycles to be fresh against the real clock, then pin only the
 * newer archives back to the oldest issue. This keeps owner review continuously
 * available without ever combining different model issues or reviving a stale
 * cohort.
 */
export async function readLatestCoherentPierCastV3SourceCohorts(input: {
  database: PierCastArchiveClient;
  now: Date;
  readPrimary?: CohortReader;
  readExpansion?: CohortReader;
  readLakeHuron?: CohortReader;
}): Promise<PierCastV3SourceCohorts | null> {
  if (!Number.isFinite(input.now.getTime())) {
    throw new Error("Formula v3 source time is invalid.");
  }
  const readPrimary = input.readPrimary ?? readLatestFreshPierCastLmhofsBatch;
  const readExpansion = input.readExpansion ??
    readLatestFreshPierCastWisconsinLmhofsBatch;
  const readLakeHuron = input.readLakeHuron ??
    readLatestFreshPierCastLakeHuronLmhofsBatch;
  let [primary, expansion, lakeHuron] = await Promise.all([
    readPrimary(input.database, input.now),
    readExpansion(input.database, input.now),
    readLakeHuron(input.database, input.now),
  ]);
  if (!primary || !expansion || !lakeHuron) return null;
  if (
    primary.issuedAt === expansion.issuedAt &&
    primary.issuedAt === lakeHuron.issuedAt
  ) {
    return {
      primary,
      expansion,
      lakeHuron,
      issuedAt: primary.issuedAt,
      usedCommonCycleFallback: false,
    };
  }

  const issues = [primary, expansion, lakeHuron].map((batch) =>
    Date.parse(batch.issuedAt)
  );
  if (issues.some((issue) => !Number.isFinite(issue))) {
    throw new Error("Formula v3 source issue is invalid.");
  }
  const commonIssue = new Date(Math.min(...issues));
  if (issues[0] > commonIssue.getTime()) {
    primary = await readPrimary(input.database, commonIssue);
  }
  if (issues[1] > commonIssue.getTime()) {
    expansion = await readExpansion(input.database, commonIssue);
  }
  if (issues[2] > commonIssue.getTime()) {
    lakeHuron = await readLakeHuron(input.database, commonIssue);
  }
  if (
    !primary || !expansion || !lakeHuron ||
    primary.issuedAt !== expansion.issuedAt ||
    primary.issuedAt !== lakeHuron.issuedAt
  ) {
    return null;
  }
  return {
    primary,
    expansion,
    lakeHuron,
    issuedAt: primary.issuedAt,
    usedCommonCycleFallback: true,
  };
}
