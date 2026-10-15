import type { PierCastConditionsOutlookV4 } from "../../../../../lib/pierCastConditionsV4.ts";
import type { PierCastReviewOutlookResponse } from "../types.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

export const PIER_CAST_OUTLOOK_SNAPSHOT_VERSION = "piercast-public-outlook-v1";

export type PierCastOutlookSnapshot = {
  sourceIssuedAt: string;
  snapshotVersion: string;
  generatedAt: string;
  publicOutlook: PierCastReviewOutlookResponse;
  conditionsOutlook: PierCastConditionsOutlookV4;
};

export async function commitPierCastOutlookSnapshot(input: {
  database: PierCastArchiveClient;
  sourceIssuedAt: string;
  generatedAt: string;
  publicOutlook: PierCastReviewOutlookResponse;
  conditionsOutlook: PierCastConditionsOutlookV4;
}): Promise<PierCastOutlookSnapshot> {
  const { data, error } = await input.database.rpc(
    "commit_pier_cast_outlook_snapshot",
    {
      p_source_issued_at: input.sourceIssuedAt,
      p_snapshot_version: PIER_CAST_OUTLOOK_SNAPSHOT_VERSION,
      p_generated_at: input.generatedAt,
      p_public_outlook: input.publicOutlook,
      p_conditions_outlook: input.conditionsOutlook,
    },
  );
  if (error) throw new Error(error.message);
  return parseSnapshot(data);
}

export async function readPierCastOutlookSnapshot(input: {
  database: PierCastArchiveClient;
  now: Date;
  maxAgeHours: number;
}): Promise<PierCastOutlookSnapshot | null> {
  const { data, error } = await input.database.rpc(
    "read_pier_cast_outlook_snapshot",
    {
      p_snapshot_version: PIER_CAST_OUTLOOK_SNAPSHOT_VERSION,
      p_now: input.now.toISOString(),
      p_max_age_hours: input.maxAgeHours,
    },
  );
  if (error) throw new Error(error.message);
  return data == null ? null : parseSnapshot(data);
}

function parseSnapshot(value: unknown): PierCastOutlookSnapshot {
  if (!value || typeof value !== "object") {
    throw new Error("PierCast outlook snapshot is invalid.");
  }
  const row = value as Record<string, unknown>;
  if (
    typeof row.sourceIssuedAt !== "string" ||
    typeof row.snapshotVersion !== "string" ||
    typeof row.generatedAt !== "string" ||
    !row.publicOutlook || typeof row.publicOutlook !== "object" ||
    !row.conditionsOutlook || typeof row.conditionsOutlook !== "object"
  ) throw new Error("PierCast outlook snapshot is invalid.");
  return row as PierCastOutlookSnapshot;
}
