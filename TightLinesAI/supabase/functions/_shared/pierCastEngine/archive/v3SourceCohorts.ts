import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import {
  type PierCastArchiveClient,
  readLatestFreshPierCastLmhofsBatch,
} from "./lmhofsArchive.ts";
import { readLatestFreshPierCastWisconsinLmhofsBatch } from "./wisconsinLmhofsArchive.ts";

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
  issuedAt: string;
  usedCommonCycleFallback: boolean;
};

/**
 * Select the newest cycle that is fresh and complete in both archives.
 *
 * The primary and expansion jobs intentionally run a few minutes apart. During
 * that window their individually newest cycles can differ. We first require
 * both newest cycles to be fresh against the real clock, then pin only the
 * newer archive back to the older issue. This keeps owner review continuously
 * available without ever combining different model issues or reviving a stale
 * cohort.
 */
export async function readLatestCoherentPierCastV3SourceCohorts(input: {
  database: PierCastArchiveClient;
  now: Date;
  readPrimary?: CohortReader;
  readExpansion?: CohortReader;
}): Promise<PierCastV3SourceCohorts | null> {
  if (!Number.isFinite(input.now.getTime())) {
    throw new Error("Formula v3 source time is invalid.");
  }
  const readPrimary = input.readPrimary ?? readLatestFreshPierCastLmhofsBatch;
  const readExpansion = input.readExpansion ??
    readLatestFreshPierCastWisconsinLmhofsBatch;
  let [primary, expansion] = await Promise.all([
    readPrimary(input.database, input.now),
    readExpansion(input.database, input.now),
  ]);
  if (!primary || !expansion) return null;
  if (primary.issuedAt === expansion.issuedAt) {
    return {
      primary,
      expansion,
      issuedAt: primary.issuedAt,
      usedCommonCycleFallback: false,
    };
  }

  const primaryIssue = Date.parse(primary.issuedAt);
  const expansionIssue = Date.parse(expansion.issuedAt);
  if (!Number.isFinite(primaryIssue) || !Number.isFinite(expansionIssue)) {
    throw new Error("Formula v3 source issue is invalid.");
  }
  const commonIssue = new Date(Math.min(primaryIssue, expansionIssue));
  if (primaryIssue > expansionIssue) {
    primary = await readPrimary(input.database, commonIssue);
  } else {
    expansion = await readExpansion(input.database, commonIssue);
  }
  if (!primary || !expansion || primary.issuedAt !== expansion.issuedAt) {
    return null;
  }
  return {
    primary,
    expansion,
    issuedAt: primary.issuedAt,
    usedCommonCycleFallback: true,
  };
}
