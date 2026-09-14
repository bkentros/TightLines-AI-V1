import type { PierCastArchiveClient } from "../archive/lmhofsArchive.ts";
import {
  archivePierCastWisconsinLmhofsBatch,
  readLatestFreshPierCastWisconsinLmhofsBatch,
} from "../archive/wisconsinLmhofsArchive.ts";
import {
  getPierCastWisconsinAdmission,
  getPierCastWisconsinTemperatureCurve,
  PIER_CAST_WISCONSIN_CITY_IDS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  PIER_CAST_WISCONSIN_ROSTER_VERSION,
  PIER_CAST_WISCONSIN_SPECIES_IDS,
  type PierCastWisconsinCityId,
} from "../config/wisconsinShadow.ts";
import {
  fetchPierCastLmhofsBatch,
  type PierCastLmhofsBatch,
  type PierCastLmhofsFetch,
} from "../providers/lmhofs.ts";
import type { PierCastFormulaVersion } from "../scoring/opportunity.ts";
import type {
  PierCastReviewOutlookResponse,
  PierCastSpeciesId,
} from "../types.ts";
import { buildPierCastCohortReviewOutlook } from "./reviewOutlook.ts";
import type { PierCastTemperatureIngestionOutcome } from "./temperatureIngestion.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export function buildPierCastWisconsinReviewOutlook(input: {
  batch: AvailableBatch;
  evaluationTime: string;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastReviewOutlookResponse {
  return buildPierCastCohortReviewOutlook({
    ...input,
    cohort: {
      cityProfiles: PIER_CAST_WISCONSIN_CITY_PROFILES,
      speciesRosterVersion: PIER_CAST_WISCONSIN_ROSTER_VERSION,
      speciesIdsForCity: () => PIER_CAST_WISCONSIN_SPECIES_IDS,
      temperatureCurveForSpecies: getPierCastWisconsinTemperatureCurve,
      admissionForCitySpecies: (cityId, speciesId) =>
        getPierCastWisconsinAdmission(
          cityId as PierCastWisconsinCityId,
          speciesId as PierCastSpeciesId,
        ),
      includeAdditionalSpeciesResearch: false,
    },
  });
}

export async function ingestPierCastWisconsinShadowCycle(input: {
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
        cityProfiles: PIER_CAST_WISCONSIN_CITY_PROFILES,
      });
  } catch (error) {
    diagnostics.push(`live_fetch_failed:${message(error)}`);
  }
  if (complete(live)) {
    try {
      if (input.operations?.archiveLive) await input.operations.archiveLive(live);
      else {
        await archivePierCastWisconsinLmhofsBatch(
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
      diagnostics.push(`live_archive_failed:${message(error)}`);
    }
  } else if (live) {
    diagnostics.push(`live_${live.status}`);
    diagnostics.push(...live.diagnostics.map((item) => item.code));
  }
  try {
    const cached = input.operations?.readFreshArchive
      ? await input.operations.readFreshArchive()
      : await readLatestFreshPierCastWisconsinLmhofsBatch(
        input.database,
        now,
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
    batch.requestedForecastHours.length === 121 && batch.cities.length === 4 &&
    PIER_CAST_WISCONSIN_CITY_IDS.every((cityId) => {
      const city = batch.cities.find((candidate) => candidate.cityId === cityId);
      return city?.status === "available" && city.samples.length === 121;
    });
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
