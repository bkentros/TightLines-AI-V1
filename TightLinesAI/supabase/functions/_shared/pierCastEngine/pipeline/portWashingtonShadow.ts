import type { PierCastArchiveClient } from "../archive/lmhofsArchive.ts";
import {
  archivePierCastPortWashingtonLmhofsBatch,
  readLatestFreshPierCastPortWashingtonLmhofsBatch,
} from "../archive/portWashingtonLmhofsArchive.ts";
import {
  getPierCastPortWashingtonAdmission,
  getPierCastPortWashingtonTemperatureCurve,
  PIER_CAST_PORT_WASHINGTON_PROFILE,
  PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
  PIER_CAST_PORT_WASHINGTON_SPECIES_IDS,
} from "../config/portWashingtonShadow.ts";
import {
  fetchPierCastLmhofsBatch,
  type PierCastLmhofsBatch,
  type PierCastLmhofsFetch,
} from "../providers/lmhofs.ts";
import type { PierCastTemperatureIngestionOutcome } from "./temperatureIngestion.ts";
import { buildPierCastCohortReviewOutlook } from "./reviewOutlook.ts";
import type { PierCastReviewOutlookResponse } from "../types.ts";
import type { PierCastFormulaVersion } from "../scoring/opportunity.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export function buildPierCastPortWashingtonReviewOutlook(input: {
  batch: AvailableBatch;
  evaluationTime: string;
  formulaVersion?: PierCastFormulaVersion;
}): PierCastReviewOutlookResponse {
  return buildPierCastCohortReviewOutlook({
    ...input,
    cohort: {
      cityProfiles: [PIER_CAST_PORT_WASHINGTON_PROFILE],
      speciesRosterVersion: PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
      speciesIdsForCity: () => PIER_CAST_PORT_WASHINGTON_SPECIES_IDS,
      temperatureCurveForSpecies: getPierCastPortWashingtonTemperatureCurve,
      admissionForCitySpecies: (_cityId, speciesId) =>
        getPierCastPortWashingtonAdmission(speciesId),
      includeAdditionalSpeciesResearch: false,
    },
  });
}

export async function ingestPierCastPortWashingtonShadowCycle(input: {
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
        cityProfiles: [PIER_CAST_PORT_WASHINGTON_PROFILE],
      });
  } catch (error) {
    diagnostics.push(`live_fetch_failed:${message(error)}`);
  }
  if (complete(live)) {
    try {
      if (input.operations?.archiveLive) {
        await input.operations.archiveLive(live);
      } else {
        await archivePierCastPortWashingtonLmhofsBatch(
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
      : await readLatestFreshPierCastPortWashingtonLmhofsBatch(
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

function complete(
  batch: PierCastLmhofsBatch | null,
): batch is AvailableBatch {
  return batch?.status === "available" && batch.fullHorizonRequested &&
    batch.requestedForecastHours.length === 121 && batch.cities.length === 1 &&
    batch.cities[0]?.cityId === "port_washington_wi" &&
    batch.cities[0].status === "available" &&
    batch.cities[0].samples.length === 121;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
