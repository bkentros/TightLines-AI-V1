import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const generatedPath = resolve(
  root,
  "supabase/functions/_shared/pierCastEngine/config/v3Calibration.generated.ts",
);
const v6Path = resolve(
  root,
  "supabase/migrations/20260917193000_pier_cast_v3_common_species_audit_v6.sql",
);
const outputPath = resolve(
  root,
  "supabase/migrations/20260918150000_pier_cast_five_city_private_pass3_v7.sql",
);

const generated = readFileSync(generatedPath, "utf8");
const match = generated.match(
  /PIER_CAST_V3_PAIR_CALIBRATIONS = ([\s\S]+) as const satisfies/,
);
if (!match) throw new Error("Formula v3 generated manifest could not be parsed.");
const pairs = JSON.parse(match[1]);
const stageCityIds = new Set([
  "ludington_mi", "grand_haven_mi", "manistee_mi",
  "frankfort_elberta_mi", "sheboygan_wi", "port_washington_wi",
  "milwaukee_wi", "racine_wi", "kenosha_wi", "harbor_beach_mi",
  "oscoda_mi", "port_sanilac_mi", "two_rivers_wi", "kewaunee_wi",
  "algoma_wi", "manitowoc_wi", "waukegan_il",
]);
const stagePairs = pairs.filter((pair) => stageCityIds.has(pair.cityId));
// Bluegill was still present in this historical manifest and was removed by a
// later product-policy migration. Reinsert only that frozen historical key.
const historicalPairs = stagePairs.flatMap((pair) =>
  pair.pairKey === "grand_haven_mi/white_bass"
    ? [pair, {
      cityId: "grand_haven_mi",
      speciesId: "bluegill",
      pairKey: "grand_haven_mi/bluegill",
    }]
    : [pair]
);
if (
  new Set(pairs.map((pair) => pair.pairKey)).size !== pairs.length ||
  historicalPairs.length !== 118 ||
  new Set(historicalPairs.map((pair) => pair.pairKey)).size !== 118
) throw new Error("Formula v3 Pass 3 pair manifest is incomplete.");

const expectedPairs = historicalPairs.map((pair) =>
  `    ('${pair.cityId}','${pair.speciesId}')`
).join(",\n");

let v3 = readFileSync(v6Path, "utf8");
v3 = v3.slice(v3.indexOf("alter table public.pier_cast_v3_shadow_forecast_runs"));
v3 = v3
  .replace(
    "      'piercast-v3-twelve-city-common-species-audit-v6'\n",
    "      'piercast-v3-twelve-city-common-species-audit-v6',\n" +
      "      'piercast-v3-seventeen-city-five-city-pass3-v7'\n",
  )
  .replaceAll(
    "piercast-v3-twelve-city-common-species-audit-v6",
    "piercast-v3-seventeen-city-five-city-pass3-v7",
  )
  .replaceAll(
    "pier-cast-opportunity-modes-v3-shadow-v1.4.0",
    "pier-cast-opportunity-modes-v3-shadow-v1.5.0",
  )
  .replaceAll("470", "590")
  .replaceAll("94", "118")
  .replaceAll("<>12", "<>17")
  .replaceAll("12-city", "17-city")
  .replaceAll("common-species-audit", "five-city-pass3")
  .replace(
    "      'piercast-v3-seventeen-city-five-city-pass3-v7',\n" +
      "      'piercast-v3-seventeen-city-five-city-pass3-v7'",
    "      'piercast-v3-twelve-city-common-species-audit-v6',\n" +
      "      'piercast-v3-seventeen-city-five-city-pass3-v7'",
  );

const prefix = `-- Add Two Rivers, Kewaunee, Algoma, Manitowoc, and Waukegan to the
-- private owner Formula v3 review. The frozen public release manifest is code
-- controlled and remains the existing twelve cities.

alter table public.pier_cast_expansion_temperature_samples
  drop constraint if exists pier_cast_expansion_temperature_samples_city_id_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_location_check;

alter table public.pier_cast_expansion_temperature_samples
  add constraint pier_cast_expansion_temperature_samples_city_id_check check (
    city_id in (
      'port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi',
      'harbor_beach_mi','oscoda_mi','port_sanilac_mi',
      'two_rivers_wi','kewaunee_wi','algoma_wi','manitowoc_wi','waukegan_il'
    )
  ),
  add constraint pier_cast_expansion_temperature_samples_location_check check (
    case city_id
      when 'port_washington_wi' then grid_row=179 and grid_column=21 and latitude=43.39 and longitude=-87.85
      when 'milwaukee_wi' then grid_row=143 and grid_column=18 and latitude=43.03 and longitude=-87.88
      when 'racine_wi' then grid_row=113 and grid_column=29 and latitude=42.73 and longitude=-87.77
      when 'kenosha_wi' then grid_row=99 and grid_column=26 and latitude=42.59 and longitude=-87.80
      when 'harbor_beach_mi' then grid_row=224 and grid_column=542 and latitude=43.84 and longitude=-82.64
      when 'oscoda_mi' then grid_row=281 and grid_column=475 and latitude=44.41 and longitude=-83.31
      when 'port_sanilac_mi' then grid_row=183 and grid_column=553 and latitude=43.43 and longitude=-82.53
      when 'two_rivers_wi' then grid_row=254 and grid_column=50 and latitude=44.14 and longitude=-87.56
      when 'kewaunee_wi' then grid_row=286 and grid_column=58 and latitude=44.46 and longitude=-87.48
      when 'algoma_wi' then grid_row=301 and grid_column=64 and latitude=44.61 and longitude=-87.42
      when 'manitowoc_wi' then grid_row=249 and grid_column=42 and latitude=44.09 and longitude=-87.64
      when 'waukegan_il' then grid_row=76 and grid_column=26 and latitude=42.36 and longitude=-87.80
      else false
    end
  );

create or replace function public.commit_pier_cast_five_city_lmhofs_cycle(
  p_cycle jsonb,
  p_samples jsonb
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
  scope constant text := 'piercast-five-city-shadow-v1';
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
       where item->>'cityId' not in ('two_rivers_wi','kewaunee_wi','algoma_wi','manitowoc_wi','waukegan_il')
          or (item->>'forecastHour')::integer not between 0 and 120
          or (item->>'issuedAt')::timestamptz<>cycle_issue
          or (item->>'validAt')::timestamptz<>cycle_issue+make_interval(hours=>(item->>'forecastHour')::integer)
          or item->>'productId'<>'NOAA_NOS_LMHOFS_REGULARGRID'
          or item->>'rawUnit'<>'C' or item->>'verticalSelection'<>'surface'
          or (item->>'depthIndex')::integer<>0
          or not case item->>'cityId'
            when 'two_rivers_wi' then (item->>'gridRow')::integer=254 and (item->>'gridColumn')::integer=50 and (item->>'latitude')::double precision=44.14 and (item->>'longitude')::double precision=-87.56
            when 'kewaunee_wi' then (item->>'gridRow')::integer=286 and (item->>'gridColumn')::integer=58 and (item->>'latitude')::double precision=44.46 and (item->>'longitude')::double precision=-87.48
            when 'algoma_wi' then (item->>'gridRow')::integer=301 and (item->>'gridColumn')::integer=64 and (item->>'latitude')::double precision=44.61 and (item->>'longitude')::double precision=-87.42
            when 'manitowoc_wi' then (item->>'gridRow')::integer=249 and (item->>'gridColumn')::integer=42 and (item->>'latitude')::double precision=44.09 and (item->>'longitude')::double precision=-87.64
            when 'waukegan_il' then (item->>'gridRow')::integer=76 and (item->>'gridColumn')::integer=26 and (item->>'latitude')::double precision=42.36 and (item->>'longitude')::double precision=-87.80
            else false end
     )
     or exists(
       select 1 from jsonb_array_elements(p_samples)item
       group by item->>'cityId'
       having count(*)<>121 or count(distinct (item->>'forecastHour')::integer)<>121
     )
  then raise exception 'invalid five-city LMHOFS shadow cycle'; end if;

  insert into public.pier_cast_expansion_temperature_cycles(
    scope_version,issued_at,fetched_at,product_id,engine_version,
    source_status,diagnostics,updated_at
  ) values (
    scope,cycle_issue,cycle_fetch,'NOAA_NOS_LMHOFS_REGULARGRID',
    p_cycle->>'engineVersion','complete',coalesce(p_cycle->'diagnostics','[]'::jsonb),
    timezone('utc',now())
  ) on conflict(scope_version,issued_at) do update set
    fetched_at=excluded.fetched_at,engine_version=excluded.engine_version,
    diagnostics=excluded.diagnostics,updated_at=timezone('utc',now());

  insert into public.pier_cast_expansion_temperature_samples(
    scope_version,city_id,source_id,issued_at,forecast_hour,valid_at,
    temperature_c,raw_unit,vertical_selection,depth_index,grid_row,
    grid_column,latitude,longitude,source_url,fetched_at,updated_at
  ) select
    scope,item->>'cityId',item->>'sourceId',(item->>'issuedAt')::timestamptz,
    (item->>'forecastHour')::smallint,(item->>'validAt')::timestamptz,
    (item->>'temperatureC')::double precision,item->>'rawUnit',
    item->>'verticalSelection',(item->>'depthIndex')::smallint,
    (item->>'gridRow')::integer,(item->>'gridColumn')::integer,
    (item->>'latitude')::double precision,(item->>'longitude')::double precision,
    item->>'sourceUrl',cycle_fetch,timezone('utc',now())
  from jsonb_array_elements(p_samples)item
  on conflict(scope_version,city_id,issued_at,forecast_hour) do update set
    source_id=excluded.source_id,valid_at=excluded.valid_at,
    temperature_c=excluded.temperature_c,source_url=excluded.source_url,
    fetched_at=excluded.fetched_at,updated_at=timezone('utc',now());
  return jsonb_build_object('status','committed','issuedAt',cycle_issue,'cityCount',5,'sampleCount',605);
end;
$$;

create or replace function public.read_latest_fresh_pier_cast_five_city_lmhofs_samples(
  p_now timestamptz,
  p_max_age_hours integer default 13
) returns table(
  city_id text,source_id text,issued_at timestamptz,forecast_hour smallint,
  valid_at timestamptz,temperature_c double precision,raw_unit text,
  vertical_selection text,depth_index smallint,grid_row integer,
  grid_column integer,latitude double precision,longitude double precision,
  source_url text,cycle_fetched_at timestamptz,diagnostics jsonb
)
language plpgsql security definer set search_path=''
as $$
declare target_issue timestamptz; scope constant text := 'piercast-five-city-shadow-v1';
begin
  if auth.role()<>'service_role' or p_max_age_hours not between 1 and 24 then
    raise exception 'invalid five-city archive request';
  end if;
  select cycle.issued_at into target_issue
  from public.pier_cast_expansion_temperature_cycles cycle
  where cycle.scope_version=scope and cycle.source_status='complete'
    and cycle.issued_at<=p_now
    and cycle.issued_at>=p_now-make_interval(hours=>p_max_age_hours)
    and (select count(*) from public.pier_cast_expansion_temperature_samples sample
      where sample.scope_version=scope and sample.issued_at=cycle.issued_at)=605
  order by cycle.issued_at desc limit 1;
  if target_issue is null then return; end if;
  return query select sample.city_id,sample.source_id,sample.issued_at,
    sample.forecast_hour,sample.valid_at,sample.temperature_c,sample.raw_unit,
    sample.vertical_selection,sample.depth_index,sample.grid_row,
    sample.grid_column,sample.latitude,sample.longitude,sample.source_url,
    cycle.fetched_at,cycle.diagnostics
  from public.pier_cast_expansion_temperature_samples sample
  join public.pier_cast_expansion_temperature_cycles cycle
    on cycle.scope_version=sample.scope_version and cycle.issued_at=sample.issued_at
  where sample.scope_version=scope and sample.issued_at=target_issue
  order by sample.city_id,sample.forecast_hour;
end;
$$;

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check
    check(forecast_count in (180,280,350,470,590));

alter table public.pier_cast_v3_shadow_forecasts
  drop constraint if exists pier_cast_v3_shadow_forecasts_city_id_check;
alter table public.pier_cast_v3_shadow_forecasts
  add constraint pier_cast_v3_shadow_forecasts_city_id_check check(city_id in (
    'ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi',
    'sheboygan_wi','port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi',
    'harbor_beach_mi','oscoda_mi','port_sanilac_mi','two_rivers_wi','kewaunee_wi',
    'algoma_wi','manitowoc_wi','waukegan_il'
  ));

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text,species_id text)
language sql immutable set search_path=''
as $$
  select * from (values
${expectedPairs}
  ) expected(city_id,species_id);
$$;

`;

const suffix = `
revoke all on function public.commit_pier_cast_five_city_lmhofs_cycle(jsonb,jsonb)
  from public,anon,authenticated;
revoke all on function public.read_latest_fresh_pier_cast_five_city_lmhofs_samples(timestamptz,integer)
  from public,anon,authenticated;
grant execute on function public.commit_pier_cast_five_city_lmhofs_cycle(jsonb,jsonb)
  to service_role;
grant execute on function public.read_latest_fresh_pier_cast_five_city_lmhofs_samples(timestamptz,integer)
  to service_role;

create or replace function public.invoke_pier_cast_five_city_shadow_ingestion()
returns bigint language plpgsql security definer set search_path=public,extensions,vault
as $$
declare project_url text; anon_key text; internal_key text; request_id bigint;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name='pier_cast_project_url' limit 1;
  select decrypted_secret into anon_key from vault.decrypted_secrets where name='pier_cast_anon_key' limit 1;
  select decrypted_secret into internal_key from vault.decrypted_secrets where name='pier_cast_internal_key' limit 1;
  if project_url is null or anon_key is null or internal_key is null then
    raise warning 'Five-city PierCast shadow ingest skipped: Vault secrets missing'; return null;
  end if;
  select net.http_post(
    url:=rtrim(project_url,'/')||'/functions/v1/pier-cast-ingest',
    headers:=jsonb_build_object('Content-Type','application/json','apikey',anon_key,
      'Authorization','Bearer '||anon_key,'x-pier-cast-internal-key',internal_key,
      'x-pier-cast-operation','five-city-shadow'),
    body:=jsonb_build_object('scheduledAt',timezone('utc',now())),
    timeout_milliseconds:=55000
  ) into request_id;
  return request_id;
end;
$$;
revoke all on function public.invoke_pier_cast_five_city_shadow_ingestion()
  from public,anon,authenticated;
grant execute on function public.invoke_pier_cast_five_city_shadow_ingestion()
  to service_role;

do $$ declare existing_job_id bigint; begin
  select jobid into existing_job_id from cron.job
    where jobname='pier-cast-five-city-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-five-city-shadow-ingestion','54 0,6,12,18 * * *',
    'select public.invoke_pier_cast_five_city_shadow_ingestion();');
end; $$;

comment on function public.piercast_v3_expected_pairs() is
  'Exact private Formula v3 17-city, 118-pair manifest. Absence is not biological absence.';
comment on function public.commit_pier_cast_five_city_lmhofs_cycle(jsonb,jsonb) is
  'Service-only five-city LMHOFS archive gate for private owner review.';
`;

const output = prefix + v3 + suffix;
if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== output) {
    throw new Error("Five-city Pass 3 migration has drifted.");
  }
  console.log("Five-city Pass 3 migration is current.");
} else {
  writeFileSync(outputPath, output);
  console.log(`Generated ${outputPath} with ${historicalPairs.length} expected pairs.`);
}
