import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const generatedPath = resolve(
  "supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts",
);
const v11FixPath = resolve(
  "supabase/migrations/20260922003000_pier_cast_pentwater_caseville_v11_forecast_count_fix.sql",
);
const outputPath = resolve(
  "supabase/migrations/20260922120000_pier_cast_caseville_species_v12.sql",
);

const generated = readFileSync(generatedPath, "utf8");
const match = generated.match(
  /PIER_CAST_V3_PAIR_CALIBRATIONS = ([\s\S]+) as const satisfies/,
);
if (!match) throw new Error("Formula v3 generated manifest could not be parsed.");
const pairs = JSON.parse(match[1]);
const modeCount = pairs.reduce((sum, pair) => sum + pair.modes.length, 0);
if (
  pairs.length !== 254 || modeCount !== 451 ||
  new Set(pairs.map((pair) => pair.pairKey)).size !== 254 ||
  pairs.some((pair) => pair.speciesId === "bluegill")
) throw new Error("Formula v3 V12 manifest is incomplete or exposes bluegill.");

const expectedPairs = pairs.map((pair) =>
  `    ('${pair.cityId}','${pair.speciesId}')`
).join(",\n");
const v11Fix = readFileSync(v11FixPath, "utf8");
const functionStart = v11Fix.indexOf(
  "create or replace function public.commit_pier_cast_v3_shadow_forecast(",
);
const functionEnd = v11Fix.indexOf("\n$$;", functionStart);
if (functionStart < 0 || functionEnd < 0) {
  throw new Error("V11 forecast commit function was not found.");
}
let functionSql = v11Fix.slice(functionStart, functionEnd + 4)
  .replaceAll(
    "piercast-v3-thirty-two-city-pentwater-caseville-pass3-v11",
    "piercast-v3-thirty-two-city-caseville-species-v12",
  )
  .replaceAll("1255", "1270")
  .replaceAll("251", "254");
if (/1255|<>251|,251/.test(functionSql)) {
  throw new Error("The V12 commit function retains a V11 count guard.");
}

const output = `begin;

-- Forward-only Caseville species correction. V11 remains immutable and
-- readable; V12 adds three conservatively calibrated Caseville salmonids.
alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check
    check(forecast_count in (180,280,350,470,590,845,865,1110,1255,1270));

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_config_version_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_config_version_check check (
    config_version in (
      'piercast-v3-nine-city-core-four-pass2-v1',
      'piercast-v3-nine-city-secondary-complete-v2',
      'piercast-v3-twelve-city-lake-huron-v3',
      'piercast-v3-twelve-city-species-expansion-v4',
      'piercast-v3-twelve-city-seasonal-research-v5',
      'piercast-v3-twelve-city-common-species-audit-v6',
      'piercast-v3-seventeen-city-five-city-pass3-v7',
      'piercast-v3-twenty-two-city-chicago-alpena-pass3-v8',
      'piercast-v3-twenty-two-city-chicago-alpena-pass3-v9',
      'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10',
      'piercast-v3-thirty-two-city-pentwater-caseville-pass3-v11',
      'piercast-v3-thirty-two-city-caseville-species-v12'
    )
  );

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text,species_id text) language sql immutable set search_path=''
as $$ select * from (values
${expectedPairs}
  ) expected(city_id,species_id); $$;

${functionSql}

comment on function public.piercast_v3_expected_pairs() is
  'Exact private Formula v3 32-city, 254-pair V12 manifest. Bluegill is intentionally absent; absence otherwise is not biological absence.';
comment on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) is
  'Exact private Formula v3 32-city, 254-pair, 1270-row V12 commit gate. Historical configurations remain readable.';

commit;
`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== output) {
    throw new Error("Caseville species V12 migration has drifted.");
  }
  console.log("Caseville species V12 migration is current.");
} else {
  writeFileSync(outputPath, output);
  console.log(`Generated Caseville species V12 migration with ${pairs.length} pairs, ${modeCount} modes, and 1270 forecast rows.`);
}
