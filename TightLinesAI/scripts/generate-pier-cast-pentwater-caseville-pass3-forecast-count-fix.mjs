import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourcePath = resolve(
  "supabase/migrations/20260921230000_pier_cast_pentwater_caseville_private_pass3_v11.sql",
);
const outputPath = resolve(
  "supabase/migrations/20260922003000_pier_cast_pentwater_caseville_v11_forecast_count_fix.sql",
);
const source = readFileSync(sourcePath, "utf8");
const start = source.indexOf(
  "create or replace function public.commit_pier_cast_v3_shadow_forecast(",
);
const endMarker = "\n$$;";
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) {
  throw new Error("V11 forecast commit function was not found.");
}

let functionSql = source.slice(start, end + endMarker.length);
const replacements = [
  ["true,'blocked',1110", "true,'blocked',1255"],
  ["existing_count<>1110", "existing_count<>1255"],
  ["select count(*)<>1110", "select count(*)<>1255"],
];
for (const [before, after] of replacements) {
  if (functionSql.split(before).length !== 2) {
    throw new Error(`Expected exactly one V11 count guard: ${before}`);
  }
  functionSql = functionSql.replace(before, after);
}
if (/1110/.test(functionSql)) {
  throw new Error("The corrected V11 commit function still contains 1110.");
}

const output = `begin;

-- Forward-only correction for the already-applied V11 migration. The first
-- private ledger attempt exposed three retained V10 count guards; PostgreSQL
-- rolled that call back, so no partial V11 run was committed.
${functionSql}

comment on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) is
  'Exact private Formula v3 32-city, 251-pair, 1255-row V11 commit gate. Historical configurations remain readable.';

commit;
`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== output) {
    throw new Error("Pentwater–Caseville V11 forecast-count fix has drifted.");
  }
  console.log("Pentwater–Caseville V11 forecast-count fix is current.");
} else {
  writeFileSync(outputPath, output);
  console.log("Generated Pentwater–Caseville V11 forecast-count fix.");
}
