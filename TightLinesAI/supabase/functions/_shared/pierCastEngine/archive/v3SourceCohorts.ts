import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import {
  type PierCastArchiveClient,
  readLatestFreshPierCastLmhofsBatch,
} from "./lmhofsArchive.ts";
import { readLatestFreshPierCastWisconsinLmhofsBatch } from "./wisconsinLmhofsArchive.ts";
import { readLatestFreshPierCastLakeHuronLmhofsBatch } from "./lakeHuronLmhofsArchive.ts";
import { readLatestFreshPierCastFiveCityLmhofsBatch } from "./fiveCityLmhofsArchive.ts";
import { readLatestFreshPierCastChicagoAlpenaLmhofsBatch } from "./chicagoAlpenaLmhofsArchive.ts";

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
  fiveCity: AvailableBatch;
  chicagoAlpena: AvailableBatch;
  issuedAt: string;
  usedCommonCycleFallback: boolean;
};

/**
 * Select the newest cycle that is fresh and complete in all five archives.
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
  maxAgeHours?: number;
  readPrimary?: CohortReader;
  readExpansion?: CohortReader;
  readLakeHuron?: CohortReader;
  readFiveCity?: CohortReader;
  readChicagoAlpena?: CohortReader;
}): Promise<PierCastV3SourceCohorts | null> {
  if (!Number.isFinite(input.now.getTime())) {
    throw new Error("Formula v3 source time is invalid.");
  }
  const maxAgeHours = input.maxAgeHours ?? 13;
  if (!Number.isInteger(maxAgeHours) || maxAgeHours < 1 || maxAgeHours > 24) {
    throw new Error("Formula v3 source freshness must be 1 through 24 hours.");
  }
  const readPrimary = input.readPrimary ??
    ((database, now) =>
      readLatestFreshPierCastLmhofsBatch(database, now, maxAgeHours));
  const readExpansion = input.readExpansion ??
    ((database, now) =>
      readLatestFreshPierCastWisconsinLmhofsBatch(database, now, maxAgeHours));
  const readLakeHuron = input.readLakeHuron ??
    ((database, now) =>
      readLatestFreshPierCastLakeHuronLmhofsBatch(database, now, maxAgeHours));
  const readFiveCity = input.readFiveCity ??
    ((database, now) =>
      readLatestFreshPierCastFiveCityLmhofsBatch(database, now, maxAgeHours));
  const readChicagoAlpena = input.readChicagoAlpena ??
    ((database, now) =>
      readLatestFreshPierCastChicagoAlpenaLmhofsBatch(
        database,
        now,
        maxAgeHours,
      ));
  let [primary, expansion, lakeHuron, fiveCity, chicagoAlpena] = await Promise
    .all([
      readPrimary(input.database, input.now),
      readExpansion(input.database, input.now),
      readLakeHuron(input.database, input.now),
      readFiveCity(input.database, input.now),
      readChicagoAlpena(input.database, input.now),
    ]);
  if (!primary || !expansion || !lakeHuron || !fiveCity || !chicagoAlpena) {
    return null;
  }
  if (
    primary.issuedAt === expansion.issuedAt &&
    primary.issuedAt === lakeHuron.issuedAt &&
    primary.issuedAt === fiveCity.issuedAt &&
    primary.issuedAt === chicagoAlpena.issuedAt
  ) {
    return {
      primary,
      expansion,
      lakeHuron,
      fiveCity,
      chicagoAlpena,
      issuedAt: primary.issuedAt,
      usedCommonCycleFallback: false,
    };
  }

  const issues = [primary, expansion, lakeHuron, fiveCity, chicagoAlpena].map((
    batch,
  ) => Date.parse(batch.issuedAt));
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
  if (issues[3] > commonIssue.getTime()) {
    fiveCity = await readFiveCity(input.database, commonIssue);
  }
  if (issues[4] > commonIssue.getTime()) {
    chicagoAlpena = await readChicagoAlpena(input.database, commonIssue);
  }
  if (
    !primary || !expansion || !lakeHuron || !fiveCity || !chicagoAlpena ||
    primary.issuedAt !== expansion.issuedAt ||
    primary.issuedAt !== lakeHuron.issuedAt ||
    primary.issuedAt !== fiveCity.issuedAt ||
    primary.issuedAt !== chicagoAlpena.issuedAt
  ) {
    return null;
  }
  return {
    primary,
    expansion,
    lakeHuron,
    fiveCity,
    chicagoAlpena,
    issuedAt: primary.issuedAt,
    usedCommonCycleFallback: true,
  };
}
