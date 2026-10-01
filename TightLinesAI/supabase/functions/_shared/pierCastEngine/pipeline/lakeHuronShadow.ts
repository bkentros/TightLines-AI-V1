import type { PierCastArchiveClient } from "../archive/lmhofsArchive.ts";
import {
  archivePierCastLakeHuronLmhofsBatch,
  readLatestFreshPierCastLakeHuronLmhofsBatch,
} from "../archive/lakeHuronLmhofsArchive.ts";
import {
  PIER_CAST_LAKE_HURON_CITY_IDS,
  PIER_CAST_LAKE_HURON_CITY_PROFILES,
} from "../config/lakeHuronShadow.ts";
import {
  fetchPierCastLmhofsBatch,
  type PierCastLmhofsBatch,
  type PierCastLmhofsFetch,
} from "../providers/lmhofs.ts";
import type { PierCastTemperatureIngestionOutcome } from "./temperatureIngestion.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export async function ingestPierCastLakeHuronShadowCycle(input: {
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
        cityProfiles: PIER_CAST_LAKE_HURON_CITY_PROFILES,
      });
  } catch (error) {
    diagnostics.push(`live_fetch_failed:${message(error)}`);
  }
  if (complete(live)) {
    try {
      if (input.operations?.archiveLive) {
        await input.operations.archiveLive(live);
      } else {
        await archivePierCastLakeHuronLmhofsBatch(
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
        diagnostics: live.diagnostics.map((d) => d.code),
      };
    } catch (error) {
      diagnostics.push(`live_archive_failed:${message(error)}`);
    }
  } else if (live) {
    diagnostics.push(
      `live_${live.status}`,
      ...live.diagnostics.map((d) => d.code),
    );
  }
  try {
    const cached = input.operations?.readFreshArchive
      ? await input.operations.readFreshArchive()
      : await readLatestFreshPierCastLakeHuronLmhofsBatch(input.database, now);
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
    diagnostics.push(`archive_fallback_failed:${message(error)}`);
  }
  return {
    status: "unavailable",
    source: null,
    batch: null,
    fallbackUsed: false,
    diagnostics,
  };
}

function complete(batch: PierCastLmhofsBatch | null): batch is AvailableBatch {
  return batch?.status === "available" && batch.fullHorizonRequested &&
    batch.requestedForecastHours.length === 121 && batch.cities.length === 3 &&
    PIER_CAST_LAKE_HURON_CITY_IDS.every((id) =>
      batch.cities.find((c) => c.cityId === id)?.samples.length === 121
    );
}
function message(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
