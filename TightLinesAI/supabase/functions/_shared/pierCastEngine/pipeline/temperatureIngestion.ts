import {
  archivePierCastLmhofsBatch,
  PIER_CAST_ARCHIVE_MAX_CYCLE_AGE_HOURS,
  type PierCastArchiveClient,
  readLatestFreshPierCastLmhofsBatch,
} from "../archive/lmhofsArchive.ts";
import {
  fetchPierCastLmhofsBatch,
  type PierCastLmhofsBatch,
  type PierCastLmhofsFetch,
} from "../providers/lmhofs.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export type PierCastTemperatureIngestionOutcome =
  | {
    status: "live_committed";
    source: "live_lmhofs";
    batch: AvailableBatch;
    fallbackUsed: false;
    diagnostics: string[];
  }
  | {
    status: "cached_fallback";
    source: "fresh_archived_complete_cycle";
    batch: AvailableBatch;
    fallbackUsed: true;
    diagnostics: string[];
  }
  | {
    status: "unavailable";
    source: null;
    batch: null;
    fallbackUsed: false;
    diagnostics: string[];
  };

export async function ingestPierCastTemperatureCycle(input: {
  database: PierCastArchiveClient;
  engineVersion: string;
  fetchImpl?: PierCastLmhofsFetch;
  now?: Date;
  operations?: {
    fetchLive?: () => Promise<PierCastLmhofsBatch>;
    archiveLive?: (batch: AvailableBatch) => Promise<void>;
    readFreshArchive?: () => Promise<AvailableBatch | null>;
  };
}): Promise<PierCastTemperatureIngestionOutcome> {
  const now = input.now ?? new Date();
  const diagnostics: string[] = [];
  let live: PierCastLmhofsBatch | null = null;
  try {
    live = input.operations?.fetchLive
      ? await input.operations.fetchLive()
      : await fetchPierCastLmhofsBatch({
        fetchImpl: input.fetchImpl,
        now: () => now,
      });
  } catch (error) {
    diagnostics.push(
      `live_fetch_failed:${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (
    live?.status === "available" &&
    live.fullHorizonRequested &&
    live.requestedForecastHours.length === 121 &&
    live.cities.length === 5 &&
    live.cities.every((city) =>
      city.status === "available" && city.samples.length === 121
    )
  ) {
    try {
      if (input.operations?.archiveLive) {
        await input.operations.archiveLive(live);
      } else {
        await archivePierCastLmhofsBatch(
          input.database,
          live,
          input.engineVersion,
        );
      }
      return {
        status: "live_committed",
        source: "live_lmhofs",
        batch: live,
        fallbackUsed: false,
        diagnostics: live.diagnostics.map((item) => item.code),
      };
    } catch (error) {
      diagnostics.push(
        `live_archive_failed:${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  } else if (live) {
    diagnostics.push(`live_${live.status}`);
    diagnostics.push(...live.diagnostics.map((item) => item.code));
  }

  try {
    const cached = input.operations?.readFreshArchive
      ? await input.operations.readFreshArchive()
      : await readLatestFreshPierCastLmhofsBatch(
        input.database,
        now,
        PIER_CAST_ARCHIVE_MAX_CYCLE_AGE_HOURS,
      );
    if (cached) {
      return {
        status: "cached_fallback",
        source: "fresh_archived_complete_cycle",
        batch: cached,
        fallbackUsed: true,
        diagnostics,
      };
    }
    diagnostics.push("fresh_complete_archive_missing");
  } catch (error) {
    diagnostics.push(
      `archive_fallback_failed:${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return {
    status: "unavailable",
    source: null,
    batch: null,
    fallbackUsed: false,
    diagnostics,
  };
}
