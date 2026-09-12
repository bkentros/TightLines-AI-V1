import {
  type PierCastFieldTemperatureInput,
  validatePierCastFieldTemperatureObservation,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";

function argument(name: string): string | null {
  const index = Deno.args.indexOf(name);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}

const filePath = argument("--file");
const commit = Deno.args.includes("--commit");
if (!filePath) {
  throw new Error(
    "Usage: deno run --allow-read scripts/import-pier-cast-field-temperature.ts --file <payload.json> [--commit]",
  );
}

const parsed: unknown = JSON.parse(await Deno.readTextFile(filePath));
if (
  !parsed || typeof parsed !== "object" ||
  !Array.isArray((parsed as { records?: unknown }).records)
) {
  throw new Error("Field import file must contain a records array.");
}
const inputs = (parsed as { records: unknown[] }).records;
if (inputs.length === 0 || inputs.length > 1000) {
  throw new Error("Field import batches must contain 1 through 1000 records.");
}

const validated = inputs.map((record) =>
  validatePierCastFieldTemperatureObservation(
    record as PierCastFieldTemperatureInput,
  )
);
const summary = {
  mode: commit ? "commit" : "dry-run",
  recordCount: validated.length,
  usableRecordCount:
    validated.filter((record) => record.recordStatus === "usable").length,
  rejectedRecordCount:
    validated.filter((record) => record.recordStatus === "rejected").length,
  rejectionReasons: Object.fromEntries(
    [...new Set(validated.flatMap((record) => record.rejectionReasons))].map(
      (reason) => [
        reason,
        validated.filter((record) => record.rejectionReasons.includes(reason))
          .length,
      ],
    ),
  ),
};
console.log(JSON.stringify(summary, null, 2));

if (!commit) {
  console.log("Dry run only. Add --commit after reviewing this summary.");
  Deno.exit(0);
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") ??
  Deno.env.get("EXPO_PUBLIC_SUPABASE_URL");
const internalKey = Deno.env.get("PIER_CAST_INTERNAL_KEY");
if (!supabaseUrl || !internalKey) {
  throw new Error(
    "Commit requires SUPABASE_URL (or EXPO_PUBLIC_SUPABASE_URL) and PIER_CAST_INTERNAL_KEY.",
  );
}

const response = await fetch(`${supabaseUrl}/functions/v1/pier-cast-ingest`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-pier-cast-internal-key": internalKey,
    "x-pier-cast-operation": "field-temperature",
  },
  body: JSON.stringify({ records: inputs }),
});
const responseText = await response.text();
if (!response.ok) {
  throw new Error(
    `Field import failed with HTTP ${response.status}: ${responseText}`,
  );
}
console.log(responseText);
