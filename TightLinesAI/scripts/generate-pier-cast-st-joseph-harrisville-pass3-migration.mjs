import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const generatedPath = resolve(root, "supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts");
const v9Path = resolve(root, "supabase/migrations/20260919190000_pier_cast_alpena_species_correction_v9.sql");
const outputPath = resolve(root, "supabase/migrations/20260919230000_pier_cast_st_joseph_harrisville_private_pass3_v10.sql");
const scheduleFixPath = resolve(root, "supabase/migrations/20260920220000_pier_cast_st_joseph_harrisville_schedule_fix.sql");

const generated = readFileSync(generatedPath, "utf8");
const match = generated.match(/PIER_CAST_V3_PAIR_CALIBRATIONS = ([\s\S]+) as const satisfies/);
if (!match) throw new Error("Formula v3 generated manifest could not be parsed.");
const pairs = JSON.parse(match[1]);
if (pairs.length !== 222 || new Set(pairs.map((pair) => pair.pairKey)).size !== 222) {
  throw new Error("Formula v3 Pass 3 pair manifest is incomplete.");
}
const expectedPairs = pairs.map((pair) => `    ('${pair.cityId}','${pair.speciesId}')`).join(",\n");

const source = readFileSync(v9Path, "utf8");
const start = source.indexOf(`alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_config_version_check;`);
const end = source.indexOf(`revoke all on function public.commit_pier_cast_five_city_lmhofs_cycle`, start);
if (start < 0 || end < 0) throw new Error("Formula v3 migration template anchors were not found.");
let v3 = source.slice(start, end)
  .replaceAll("piercast-v3-twenty-two-city-chicago-alpena-pass3-v9", "piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10")
  .replaceAll("pier-cast-opportunity-modes-v3-shadow-v1.7.0", "pier-cast-opportunity-modes-v3-shadow-v1.8.0")
  .replaceAll("865", "1110")
  .replaceAll("<>22", "<>27")
  .replaceAll("<>173", "<>222")
  .replaceAll("invalid Formula v3 five-city-pass3 shadow payload", "invalid Formula v3 st-joseph-harrisville-pass3 shadow payload")
  .replaceAll("existing Formula v3 five-city-pass3 run is incomplete", "existing Formula v3 st-joseph-harrisville-pass3 run is incomplete")
  .replaceAll("Formula v3 five-city-pass3 run manifest is incomplete", "Formula v3 st-joseph-harrisville-pass3 run manifest is incomplete");
v3 = v3.replace(
  "      'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10'",
  "      'piercast-v3-twenty-two-city-chicago-alpena-pass3-v9',\n" +
    "      'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10'",
);

const cityCases = [
  ["port_washington_wi", 179, 21, 43.39, -87.85], ["milwaukee_wi", 143, 18, 43.03, -87.88],
  ["racine_wi", 113, 29, 42.73, -87.77], ["kenosha_wi", 99, 26, 42.59, -87.80],
  ["harbor_beach_mi", 224, 542, 43.84, -82.64], ["oscoda_mi", 281, 475, 44.41, -83.31],
  ["port_sanilac_mi", 183, 553, 43.43, -82.53], ["two_rivers_wi", 254, 50, 44.14, -87.56],
  ["kewaunee_wi", 286, 58, 44.46, -87.48], ["algoma_wi", 301, 64, 44.61, -87.42],
  ["manitowoc_wi", 249, 42, 44.09, -87.64], ["waukegan_il", 76, 26, 42.36, -87.80],
  ["chicago_il", 36, 44, 41.96, -87.62], ["michigan_city_in", 13, 115, 41.73, -86.91],
  ["muskegon_mi", 162, 172, 43.22, -86.34], ["whitehall_mi", 178, 163, 43.38, -86.43],
  ["alpena_mi", 346, 464, 45.06, -83.42], ["st_joseph_mi", 52, 156, 42.12, -86.50],
  ["south_haven_mi", 80, 177, 42.40, -86.29], ["holland_mi", 117, 184, 42.77, -86.22],
  ["lexington_mi", 167, 554, 43.27, -82.52], ["harrisville_mi", 306, 478, 44.66, -83.28],
];
const cityIdsSql = cityCases.map(([id]) => `'${id}'`).join(",");
const locationCasesSql = cityCases.map(([id, row, column, latitude, longitude]) =>
  `      when '${id}' then grid_row=${row} and grid_column=${column} and latitude=${latitude} and longitude=${longitude}`
).join("\n");
const newCityCasesSql = cityCases.slice(-5).map(([id, row, column, latitude, longitude]) =>
  `            when '${id}' then (item->>'gridRow')::integer=${row} and (item->>'gridColumn')::integer=${column} and (item->>'latitude')::double precision=${latitude} and (item->>'longitude')::double precision=${longitude}`
).join("\n");

const prefix = `-- Add St. Joseph, South Haven, Holland, Lexington, and Harrisville to
-- private owner Formula v3 review. The frozen public release remains 22 cities.

alter table public.pier_cast_expansion_temperature_samples
  drop constraint if exists pier_cast_expansion_temperature_samples_city_id_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_location_check;
alter table public.pier_cast_expansion_temperature_samples
  add constraint pier_cast_expansion_temperature_samples_city_id_check check(city_id in (${cityIdsSql})),
  add constraint pier_cast_expansion_temperature_samples_location_check check(
    case city_id
${locationCasesSql}
      else false
    end
  );

create or replace function public.commit_pier_cast_st_joseph_harrisville_lmhofs_cycle(
  p_cycle jsonb, p_samples jsonb
) returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  scope constant text := 'piercast-st-joseph-harrisville-shadow-v1';
  cycle_issue timestamptz := (p_cycle->>'issuedAt')::timestamptz;
  cycle_fetch timestamptz := (p_cycle->>'fetchedAt')::timestamptz;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  if p_cycle->>'status'<>'available'
     or p_cycle->>'productId'<>'NOAA_NOS_LMHOFS_REGULARGRID'
     or (p_cycle->>'fullHorizonRequested')::boolean is distinct from true
     or jsonb_typeof(p_samples) is distinct from 'array'
     or jsonb_array_length(p_samples)<>605
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_samples)item)<>5
     or exists(
       select 1 from jsonb_array_elements(p_samples)item
       where item->>'cityId' not in ('st_joseph_mi','south_haven_mi','holland_mi','lexington_mi','harrisville_mi')
          or (item->>'forecastHour')::integer not between 0 and 120
          or (item->>'issuedAt')::timestamptz<>cycle_issue
          or (item->>'validAt')::timestamptz<>cycle_issue+make_interval(hours=>(item->>'forecastHour')::integer)
          or item->>'productId'<>'NOAA_NOS_LMHOFS_REGULARGRID'
          or item->>'rawUnit'<>'C' or item->>'verticalSelection'<>'surface'
          or (item->>'depthIndex')::integer<>0
          or not case item->>'cityId'
${newCityCasesSql}
            else false end
     )
     or exists(select 1 from jsonb_array_elements(p_samples)item group by item->>'cityId'
       having count(*)<>121 or count(distinct (item->>'forecastHour')::integer)<>121)
  then raise exception 'invalid St. Joseph-Harrisville LMHOFS shadow cycle'; end if;

  insert into public.pier_cast_expansion_temperature_cycles(
    scope_version,issued_at,fetched_at,product_id,engine_version,source_status,diagnostics,updated_at
  ) values (scope,cycle_issue,cycle_fetch,'NOAA_NOS_LMHOFS_REGULARGRID',p_cycle->>'engineVersion',
    'complete',coalesce(p_cycle->'diagnostics','[]'::jsonb),timezone('utc',now()))
  on conflict(scope_version,issued_at) do update set fetched_at=excluded.fetched_at,
    engine_version=excluded.engine_version,diagnostics=excluded.diagnostics,updated_at=timezone('utc',now());

  insert into public.pier_cast_expansion_temperature_samples(
    scope_version,city_id,source_id,issued_at,forecast_hour,valid_at,temperature_c,raw_unit,
    vertical_selection,depth_index,grid_row,grid_column,latitude,longitude,source_url,fetched_at,updated_at
  ) select scope,item->>'cityId',item->>'sourceId',(item->>'issuedAt')::timestamptz,
    (item->>'forecastHour')::smallint,(item->>'validAt')::timestamptz,(item->>'temperatureC')::double precision,
    item->>'rawUnit',item->>'verticalSelection',(item->>'depthIndex')::smallint,(item->>'gridRow')::integer,
    (item->>'gridColumn')::integer,(item->>'latitude')::double precision,(item->>'longitude')::double precision,
    item->>'sourceUrl',cycle_fetch,timezone('utc',now()) from jsonb_array_elements(p_samples)item
  on conflict(scope_version,city_id,issued_at,forecast_hour) do update set source_id=excluded.source_id,
    valid_at=excluded.valid_at,temperature_c=excluded.temperature_c,source_url=excluded.source_url,
    fetched_at=excluded.fetched_at,updated_at=timezone('utc',now());
  return jsonb_build_object('status','committed','issuedAt',cycle_issue,'cityCount',5,'sampleCount',605);
end;
$$;

create or replace function public.read_latest_pier_cast_stj_harrisville_lmhofs(
  p_now timestamptz, p_max_age_hours integer default 13
) returns table(city_id text,source_id text,issued_at timestamptz,forecast_hour smallint,
  valid_at timestamptz,temperature_c double precision,raw_unit text,vertical_selection text,
  depth_index smallint,grid_row integer,grid_column integer,latitude double precision,longitude double precision,
  source_url text,cycle_fetched_at timestamptz,diagnostics jsonb)
language plpgsql security definer set search_path=''
as $$
declare target_issue timestamptz; scope constant text := 'piercast-st-joseph-harrisville-shadow-v1';
begin
  if auth.role()<>'service_role' or p_max_age_hours not between 1 and 24 then
    raise exception 'invalid St. Joseph-Harrisville archive request';
  end if;
  select cycle.issued_at into target_issue from public.pier_cast_expansion_temperature_cycles cycle
  where cycle.scope_version=scope and cycle.source_status='complete' and cycle.issued_at<=p_now
    and cycle.issued_at>=p_now-make_interval(hours=>p_max_age_hours)
    and (select count(*) from public.pier_cast_expansion_temperature_samples sample
      where sample.scope_version=scope and sample.issued_at=cycle.issued_at)=605
  order by cycle.issued_at desc limit 1;
  if target_issue is null then return; end if;
  return query select sample.city_id,sample.source_id,sample.issued_at,sample.forecast_hour,
    sample.valid_at,sample.temperature_c,sample.raw_unit,sample.vertical_selection,sample.depth_index,
    sample.grid_row,sample.grid_column,sample.latitude,sample.longitude,sample.source_url,
    cycle.fetched_at,cycle.diagnostics from public.pier_cast_expansion_temperature_samples sample
  join public.pier_cast_expansion_temperature_cycles cycle
    on cycle.scope_version=sample.scope_version and cycle.issued_at=sample.issued_at
  where sample.scope_version=scope and sample.issued_at=target_issue order by sample.city_id,sample.forecast_hour;
end;
$$;

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check
    check(forecast_count in (180,280,350,470,590,845,865,1110));
alter table public.pier_cast_v3_shadow_forecasts
  drop constraint if exists pier_cast_v3_shadow_forecasts_city_id_check;
alter table public.pier_cast_v3_shadow_forecasts
  add constraint pier_cast_v3_shadow_forecasts_city_id_check check(city_id in (
    'ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi','sheboygan_wi',
    ${cityIdsSql}
  ));

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text,species_id text) language sql immutable set search_path=''
as $$ select * from (values
${expectedPairs}
  ) expected(city_id,species_id); $$;

`;

const suffix = `
revoke all on function public.commit_pier_cast_st_joseph_harrisville_lmhofs_cycle(jsonb,jsonb)
  from public,anon,authenticated;
revoke all on function public.read_latest_pier_cast_stj_harrisville_lmhofs(timestamptz,integer)
  from public,anon,authenticated;
grant execute on function public.commit_pier_cast_st_joseph_harrisville_lmhofs_cycle(jsonb,jsonb) to service_role;
grant execute on function public.read_latest_pier_cast_stj_harrisville_lmhofs(timestamptz,integer) to service_role;

create or replace function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion()
returns bigint language plpgsql security definer set search_path=public,extensions,vault
as $$
declare project_url text; anon_key text; internal_key text; request_id bigint;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name='pier_cast_project_url' limit 1;
  select decrypted_secret into anon_key from vault.decrypted_secrets where name='pier_cast_anon_key' limit 1;
  select decrypted_secret into internal_key from vault.decrypted_secrets where name='pier_cast_internal_key' limit 1;
  if project_url is null or anon_key is null or internal_key is null then
    raise warning 'St. Joseph-Harrisville PierCast shadow ingest skipped: Vault secrets missing'; return null;
  end if;
  select net.http_post(url:=rtrim(project_url,'/')||'/functions/v1/pier-cast-ingest',
    headers:=jsonb_build_object('Content-Type','application/json','apikey',anon_key,
      'Authorization','Bearer '||anon_key,'x-pier-cast-internal-key',internal_key,
      'x-pier-cast-operation','st-joseph-harrisville-shadow'),
    body:=jsonb_build_object('scheduledAt',timezone('utc',now())),timeout_milliseconds:=55000) into request_id;
  return request_id;
end;
$$;
revoke all on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion() from public,anon,authenticated;
grant execute on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion() to service_role;

do $$ declare existing_job_id bigint; begin
  select jobid into existing_job_id from cron.job where jobname='pier-cast-st-joseph-harrisville-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-st-joseph-harrisville-shadow-ingestion','58 0,6,12,18 * * *',
    'select public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();');
end; $$;

comment on function public.piercast_v3_expected_pairs() is
  'Exact private Formula v3 27-city, 222-pair manifest. Absence is not biological absence.';
comment on function public.commit_pier_cast_st_joseph_harrisville_lmhofs_cycle(jsonb,jsonb) is
  'Service-only five-city LMHOFS archive gate for private owner review.';
`;

const output = prefix + v3 + suffix;
const scheduleFix = `-- Keep the private source-cohort ingest ahead of the aggregate Formula v3 job.
-- The v3 archive runs at minute 58, so sharing that minute creates a race.
do $$ declare existing_job_id bigint; begin
  select jobid into existing_job_id from cron.job
    where jobname='pier-cast-st-joseph-harrisville-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-st-joseph-harrisville-shadow-ingestion','55 0,6,12,18 * * *',
    'select public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion();');
end; $$;

comment on function public.invoke_pier_cast_st_joseph_harrisville_shadow_ingestion() is
  'Private five-city source ingest scheduled three minutes before aggregate Formula v3 archival.';
`;
if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== output) throw new Error("St. Joseph-Harrisville Pass 3 migration has drifted.");
  if (readFileSync(scheduleFixPath, "utf8") !== scheduleFix) throw new Error("St. Joseph-Harrisville schedule fix has drifted.");
  console.log("St. Joseph-Harrisville Pass 3 migrations are current.");
} else {
  writeFileSync(outputPath, output);
  writeFileSync(scheduleFixPath, scheduleFix);
  console.log(`Generated Pass 3 migrations with ${pairs.length} expected pairs.`);
}
