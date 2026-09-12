import type { PierCastArchiveClient } from "./lmhofsArchive.ts";
import type { PierCastFieldTemperatureRecord } from "../validation/fieldTemperature.ts";

const COMMIT_CHUNK_SIZE = 1000;

export async function archivePierCastFieldTemperatureObservations(
  database: PierCastArchiveClient,
  records: readonly PierCastFieldTemperatureRecord[],
): Promise<number> {
  const keys = new Set<string>();
  for (const record of records) {
    const key = `${record.sourceId}\u0000${record.observedAt}`;
    if (keys.has(key)) {
      throw new Error(
        "Field observation batch contains a duplicate source timestamp.",
      );
    }
    keys.add(key);
  }
  let committed = 0;
  for (let index = 0; index < records.length; index += COMMIT_CHUNK_SIZE) {
    const chunk = records.slice(index, index + COMMIT_CHUNK_SIZE);
    const { data, error } = await database.rpc(
      "commit_pier_cast_field_temperature_observations",
      { p_records: chunk },
    );
    if (error) {
      throw new Error(
        error.message?.trim() || "field observation archive commit failed",
      );
    }
    if (
      !data || typeof data !== "object" ||
      (data as { status?: unknown }).status !== "committed" ||
      (data as { recordCount?: unknown }).recordCount !== chunk.length
    ) {
      throw new Error(
        "Field observation archive returned an invalid commit result.",
      );
    }
    committed += chunk.length;
  }
  return committed;
}
