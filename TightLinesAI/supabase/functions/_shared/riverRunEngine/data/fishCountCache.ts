import type {
  FishCountSourceConfig,
  RiverProfile,
  RiverRunFishCountRead,
  RiverRunFishCountReport,
  RiverRunFishCountSpecies,
  RiverRunSpecies,
} from "../types.ts";
import {
  archiveFishCountReport,
  getFishCountSourceCache,
  type StoredFishCountSourceCache,
  type SupabaseLikeClient,
  upsertFishCountSourceCache,
} from "../storage/index.ts";
import type { RiverRunFetch } from "./usgs.ts";
import {
  fetchRiverRunFishCount,
  fetchRiverRunFishCountReport,
  fishCountReadFromReport,
} from "./fishCounts.ts";

export const FISH_COUNT_SOURCE_CHECK_INTERVAL_MS = 60 * 60 * 1_000;

export async function readOrRefreshRiverRunFishCount(input: {
  client: SupabaseLikeClient;
  river: RiverProfile;
  species: RiverRunSpecies;
  fetchFn: RiverRunFetch;
  now?: Date;
  forceRefresh?: boolean;
}): Promise<RiverRunFishCountRead | undefined> {
  const source = input.river.fishCountSources?.find((candidate) =>
    candidate.eligibleSpecies.includes(
      input.species as RiverRunFishCountSpecies,
    )
  );
  if (!source || !isFishCountSpecies(input.species)) return undefined;
  let report: RiverRunFishCountReport;
  try {
    report = await readOrRefreshFishCountSource({
      client: input.client,
      riverId: input.river.riverId,
      source,
      fetchFn: input.fetchFn,
      now: input.now,
      forceRefresh: input.forceRefresh,
    });
  } catch (error) {
    console.error("[river-run] fish-count cache unavailable", {
      riverId: input.river.riverId,
      sourceId: source.sourceId,
      message: error instanceof Error ? error.message : String(error),
    });
    return await fetchRiverRunFishCount({
      river: input.river,
      species: input.species,
      fetchFn: input.fetchFn,
      now: input.now,
    });
  }
  return fishCountReadFromReport(
    report,
    source,
    input.species,
    input.now ?? new Date(),
  );
}

export async function readOrRefreshFishCountSource(input: {
  client: SupabaseLikeClient;
  riverId: string;
  source: FishCountSourceConfig;
  fetchFn: RiverRunFetch;
  now?: Date;
  forceRefresh?: boolean;
}): Promise<RiverRunFishCountReport> {
  const now = input.now ?? new Date();
  const cached = await getFishCountSourceCache(
    input.client,
    input.riverId,
    input.source.sourceId,
  );
  if (cached.error) {
    throw new Error(`read fish-count source cache: ${cached.error.message}`);
  }
  if (
    cached.data && !input.forceRefresh &&
    isCurrentCheck(cached.data.checkedAt, now)
  ) {
    return cached.data.report;
  }

  const fetched = await fetchRiverRunFishCountReport({
    source: input.source,
    fetchFn: input.fetchFn,
    now,
  });
  const successful = fetched.fetchStatus === "success";
  const report = successful ? fetched : cached.data
    ? {
      ...cached.data.report,
      fetchedAt: fetched.fetchedAt,
      fetchStatus: "failed" as const,
      failureReason: fetched.failureReason,
    }
    : fetched;
  const next: StoredFishCountSourceCache = {
    riverId: input.riverId,
    sourceId: input.source.sourceId,
    checkedAt: now.toISOString(),
    lastSuccessAt: successful ? now.toISOString() : cached.data?.lastSuccessAt,
    report,
  };
  const stored = await upsertFishCountSourceCache(input.client, next);
  if (stored.error) {
    throw new Error(`store fish-count source cache: ${stored.error.message}`);
  }
  if (successful) {
    const archived = await archiveFishCountReport(input.client, next);
    if (archived.error) {
      console.error("[river-run] fish-count report archive failed", {
        riverId: input.riverId,
        sourceId: input.source.sourceId,
        message: archived.error.message,
      });
    }
  }
  return report;
}

function isCurrentCheck(checkedAt: string, now: Date): boolean {
  const age = now.getTime() - Date.parse(checkedAt);
  return Number.isFinite(age) && age >= 0 &&
    age < FISH_COUNT_SOURCE_CHECK_INTERVAL_MS;
}

function isFishCountSpecies(
  species: RiverRunSpecies,
): species is RiverRunFishCountSpecies {
  return species === "chinook_salmon" || species === "coho_salmon" ||
    species === "steelhead" || species === "lake_run_brown_trout";
}
