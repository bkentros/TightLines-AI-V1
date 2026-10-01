-- Add the isolated Lake Huron source cohort and the exact 12-city Formula v3
-- manifest. Historical 180/280-row runs remain valid and immutable. Public v2
-- tables, RPCs, release rosters, and scores are untouched.

alter table public.pier_cast_expansion_temperature_samples
  drop constraint if exists pier_cast_expansion_temperature_samples_city_id_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_location_check;
alter table public.pier_cast_expansion_temperature_samples
  add constraint pier_cast_expansion_temperature_samples_city_id_check check (city_id in (
    'port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi',
    'harbor_beach_mi','oscoda_mi','port_sanilac_mi'
  )),
  add constraint pier_cast_expansion_temperature_samples_location_check check (
    case city_id
      when 'port_washington_wi' then grid_row=179 and grid_column=21 and latitude=43.39 and longitude=-87.85
      when 'milwaukee_wi' then grid_row=143 and grid_column=18 and latitude=43.03 and longitude=-87.88
      when 'racine_wi' then grid_row=113 and grid_column=29 and latitude=42.73 and longitude=-87.77
      when 'kenosha_wi' then grid_row=99 and grid_column=26 and latitude=42.59 and longitude=-87.80
      when 'harbor_beach_mi' then grid_row=224 and grid_column=542 and latitude=43.84 and longitude=-82.64
      when 'oscoda_mi' then grid_row=281 and grid_column=475 and latitude=44.41 and longitude=-83.31
      when 'port_sanilac_mi' then grid_row=183 and grid_column=553 and latitude=43.43 and longitude=-82.53
      else false
    end
  );

create or replace function public.commit_pier_cast_expansion_lmhofs_cycle(
  p_scope_version text, p_cycle jsonb, p_samples jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  cycle_issue timestamptz := (p_cycle->>'issuedAt')::timestamptz;
  cycle_fetch timestamptz := (p_cycle->>'fetchedAt')::timestamptz;
  expected_count integer; expected_city_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version = 'piercast-port-washington-shadow-v1' then expected_count:=121; expected_city_count:=1;
  elsif p_scope_version = 'piercast-wisconsin-shadow-v1' then expected_count:=484; expected_city_count:=4;
  elsif p_scope_version = 'piercast-lake-huron-shadow-v1' then expected_count:=363; expected_city_count:=3;
  else raise exception 'invalid expansion scope'; end if;
  if p_cycle->>'status' <> 'available' or p_cycle->>'productId' <> 'NOAA_NOS_LMHOFS_REGULARGRID'
     or (p_cycle->>'fullHorizonRequested')::boolean is distinct from true
     or jsonb_typeof(p_samples) is distinct from 'array' or jsonb_array_length(p_samples) <> expected_count
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_samples) item) <> expected_city_count
     or exists (select 1 from jsonb_array_elements(p_samples) item where
       (p_scope_version='piercast-port-washington-shadow-v1' and item->>'cityId'<>'port_washington_wi')
       or (p_scope_version='piercast-wisconsin-shadow-v1' and item->>'cityId' not in ('port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi'))
       or (p_scope_version='piercast-lake-huron-shadow-v1' and item->>'cityId' not in ('harbor_beach_mi','oscoda_mi','port_sanilac_mi'))
       or (item->>'forecastHour')::integer not between 0 and 120
       or (item->>'issuedAt')::timestamptz <> cycle_issue
       or (item->>'validAt')::timestamptz <> cycle_issue + make_interval(hours => (item->>'forecastHour')::integer)
       or item->>'productId'<>'NOAA_NOS_LMHOFS_REGULARGRID' or item->>'rawUnit'<>'C'
       or item->>'verticalSelection'<>'surface' or (item->>'depthIndex')::integer<>0
       or not case item->>'cityId'
         when 'port_washington_wi' then (item->>'gridRow')::integer=179 and (item->>'gridColumn')::integer=21 and (item->>'latitude')::double precision=43.39 and (item->>'longitude')::double precision=-87.85
         when 'milwaukee_wi' then (item->>'gridRow')::integer=143 and (item->>'gridColumn')::integer=18 and (item->>'latitude')::double precision=43.03 and (item->>'longitude')::double precision=-87.88
         when 'racine_wi' then (item->>'gridRow')::integer=113 and (item->>'gridColumn')::integer=29 and (item->>'latitude')::double precision=42.73 and (item->>'longitude')::double precision=-87.77
         when 'kenosha_wi' then (item->>'gridRow')::integer=99 and (item->>'gridColumn')::integer=26 and (item->>'latitude')::double precision=42.59 and (item->>'longitude')::double precision=-87.80
         when 'harbor_beach_mi' then (item->>'gridRow')::integer=224 and (item->>'gridColumn')::integer=542 and (item->>'latitude')::double precision=43.84 and (item->>'longitude')::double precision=-82.64
         when 'oscoda_mi' then (item->>'gridRow')::integer=281 and (item->>'gridColumn')::integer=475 and (item->>'latitude')::double precision=44.41 and (item->>'longitude')::double precision=-83.31
         when 'port_sanilac_mi' then (item->>'gridRow')::integer=183 and (item->>'gridColumn')::integer=553 and (item->>'latitude')::double precision=43.43 and (item->>'longitude')::double precision=-82.53
         else false end)
     or exists (select 1 from jsonb_array_elements(p_samples) item group by item->>'cityId'
       having count(*)<>121 or count(distinct (item->>'forecastHour')::integer)<>121)
  then raise exception 'invalid expansion LMHOFS shadow cycle'; end if;
  insert into public.pier_cast_expansion_temperature_cycles(scope_version,issued_at,fetched_at,product_id,engine_version,source_status,diagnostics,updated_at)
    values(p_scope_version,cycle_issue,cycle_fetch,'NOAA_NOS_LMHOFS_REGULARGRID',p_cycle->>'engineVersion','complete',coalesce(p_cycle->'diagnostics','[]'::jsonb),timezone('utc',now()))
    on conflict(scope_version,issued_at) do update set fetched_at=excluded.fetched_at,engine_version=excluded.engine_version,diagnostics=excluded.diagnostics,updated_at=timezone('utc',now());
  insert into public.pier_cast_expansion_temperature_samples(scope_version,city_id,source_id,issued_at,forecast_hour,valid_at,temperature_c,raw_unit,vertical_selection,depth_index,grid_row,grid_column,latitude,longitude,source_url,fetched_at,updated_at)
    select p_scope_version,item->>'cityId',item->>'sourceId',(item->>'issuedAt')::timestamptz,(item->>'forecastHour')::smallint,(item->>'validAt')::timestamptz,(item->>'temperatureC')::double precision,item->>'rawUnit',item->>'verticalSelection',(item->>'depthIndex')::smallint,(item->>'gridRow')::integer,(item->>'gridColumn')::integer,(item->>'latitude')::double precision,(item->>'longitude')::double precision,item->>'sourceUrl',cycle_fetch,timezone('utc',now()) from jsonb_array_elements(p_samples) item
    on conflict(scope_version,city_id,issued_at,forecast_hour) do update set source_id=excluded.source_id,valid_at=excluded.valid_at,temperature_c=excluded.temperature_c,source_url=excluded.source_url,fetched_at=excluded.fetched_at,updated_at=timezone('utc',now());
  return jsonb_build_object('status','committed','issuedAt',cycle_issue,'cityCount',expected_city_count,'sampleCount',expected_count);
end; $$;

create or replace function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(
  p_scope_version text, p_now timestamptz, p_max_age_hours integer default 13
) returns table(city_id text,source_id text,issued_at timestamptz,forecast_hour smallint,valid_at timestamptz,temperature_c double precision,raw_unit text,vertical_selection text,depth_index smallint,grid_row integer,grid_column integer,latitude double precision,longitude double precision,source_url text,cycle_fetched_at timestamptz,diagnostics jsonb)
language plpgsql security definer set search_path = '' as $$
declare target_issue timestamptz; expected_count integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version='piercast-port-washington-shadow-v1' then expected_count:=121;
  elsif p_scope_version='piercast-wisconsin-shadow-v1' then expected_count:=484;
  elsif p_scope_version='piercast-lake-huron-shadow-v1' then expected_count:=363;
  else raise exception 'invalid expansion archive request'; end if;
  if p_max_age_hours not between 1 and 24 then raise exception 'invalid expansion archive request'; end if;
  select cycle.issued_at into target_issue from public.pier_cast_expansion_temperature_cycles cycle
    where cycle.scope_version=p_scope_version and cycle.source_status='complete' and cycle.issued_at<=p_now
      and cycle.issued_at>=p_now-make_interval(hours=>p_max_age_hours)
      and (select count(*) from public.pier_cast_expansion_temperature_samples sample where sample.scope_version=cycle.scope_version and sample.issued_at=cycle.issued_at)=expected_count
    order by cycle.issued_at desc limit 1;
  if target_issue is null then return; end if;
  return query select sample.city_id,sample.source_id,sample.issued_at,sample.forecast_hour,sample.valid_at,sample.temperature_c,sample.raw_unit,sample.vertical_selection,sample.depth_index,sample.grid_row,sample.grid_column,sample.latitude,sample.longitude,sample.source_url,cycle.fetched_at,cycle.diagnostics
    from public.pier_cast_expansion_temperature_samples sample join public.pier_cast_expansion_temperature_cycles cycle on cycle.scope_version=sample.scope_version and cycle.issued_at=sample.issued_at
    where sample.scope_version=p_scope_version and sample.issued_at=target_issue order by sample.city_id,sample.forecast_hour;
end; $$;

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_config_version_check,
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_config_version_check check(config_version in ('piercast-v3-nine-city-core-four-pass2-v1','piercast-v3-nine-city-secondary-complete-v2','piercast-v3-twelve-city-lake-huron-v3')),
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check check(forecast_count in (180,280,350));

alter table public.pier_cast_v3_shadow_forecasts
  drop constraint if exists pier_cast_v3_shadow_forecasts_city_id_check,
  drop constraint if exists pier_cast_v3_shadow_forecasts_species_id_check;
alter table public.pier_cast_v3_shadow_forecasts
  add constraint pier_cast_v3_shadow_forecasts_city_id_check check(city_id in ('ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi','sheboygan_wi','port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi','harbor_beach_mi','oscoda_mi','port_sanilac_mi')),
  add constraint pier_cast_v3_shadow_forecasts_species_id_check check(species_id in ('chinook_salmon','coho_salmon','steelhead','brown_trout','lake_trout','walleye','smallmouth_bass','freshwater_drum','yellow_perch','lake_whitefish','round_whitefish','channel_catfish','largemouth_bass','atlantic_salmon','northern_pike'));

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text,species_id text) language sql immutable set search_path='' as $$
  select * from (values
    ('ludington_mi','chinook_salmon'),('ludington_mi','coho_salmon'),('ludington_mi','steelhead'),('ludington_mi','brown_trout'),('ludington_mi','lake_trout'),('ludington_mi','smallmouth_bass'),('ludington_mi','freshwater_drum'),('ludington_mi','yellow_perch'),
    ('grand_haven_mi','chinook_salmon'),('grand_haven_mi','coho_salmon'),('grand_haven_mi','steelhead'),('grand_haven_mi','brown_trout'),('grand_haven_mi','lake_trout'),('grand_haven_mi','smallmouth_bass'),('grand_haven_mi','freshwater_drum'),('grand_haven_mi','yellow_perch'),('grand_haven_mi','round_whitefish'),('grand_haven_mi','channel_catfish'),('grand_haven_mi','largemouth_bass'),
    ('manistee_mi','chinook_salmon'),('manistee_mi','coho_salmon'),('manistee_mi','steelhead'),('manistee_mi','brown_trout'),('manistee_mi','lake_trout'),('manistee_mi','walleye'),('manistee_mi','smallmouth_bass'),('manistee_mi','freshwater_drum'),('manistee_mi','yellow_perch'),('manistee_mi','round_whitefish'),
    ('frankfort_elberta_mi','chinook_salmon'),('frankfort_elberta_mi','coho_salmon'),('frankfort_elberta_mi','steelhead'),('frankfort_elberta_mi','brown_trout'),('frankfort_elberta_mi','lake_trout'),
    ('sheboygan_wi','chinook_salmon'),('sheboygan_wi','coho_salmon'),('sheboygan_wi','steelhead'),('sheboygan_wi','brown_trout'),
    ('port_washington_wi','chinook_salmon'),('port_washington_wi','coho_salmon'),('port_washington_wi','steelhead'),('port_washington_wi','brown_trout'),
    ('milwaukee_wi','chinook_salmon'),('milwaukee_wi','coho_salmon'),('milwaukee_wi','steelhead'),('milwaukee_wi','brown_trout'),
    ('racine_wi','chinook_salmon'),('racine_wi','coho_salmon'),('racine_wi','steelhead'),('racine_wi','brown_trout'),('racine_wi','yellow_perch'),
    ('kenosha_wi','chinook_salmon'),('kenosha_wi','coho_salmon'),('kenosha_wi','steelhead'),('kenosha_wi','brown_trout'),('kenosha_wi','yellow_perch'),
    ('harbor_beach_mi','coho_salmon'),('harbor_beach_mi','smallmouth_bass'),
    ('oscoda_mi','atlantic_salmon'),('oscoda_mi','steelhead'),('oscoda_mi','walleye'),('oscoda_mi','lake_trout'),('oscoda_mi','coho_salmon'),('oscoda_mi','chinook_salmon'),('oscoda_mi','smallmouth_bass'),('oscoda_mi','channel_catfish'),('oscoda_mi','freshwater_drum'),
    ('port_sanilac_mi','coho_salmon'),('port_sanilac_mi','steelhead'),('port_sanilac_mi','northern_pike')
  ) expected(city_id,species_id);
$$;

create or replace function public.commit_pier_cast_v3_shadow_forecast(p_run jsonb,p_forecasts jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare target_run uuid; inserted_run uuid; issue timestamptz:=(p_run->>'sourceIssuedAt')::timestamptz; existing_count integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  if p_run->>'configVersion'<>'piercast-v3-twelve-city-lake-huron-v3'
     or p_run->>'engineVersion'<>'pier-cast-opportunity-modes-v3-shadow-v1.2.0'
     or p_run->>'formulaVersion'<>'piercast-opportunity-modes-bounded-temperature-v3'
     or (p_run->>'previewOnly')::boolean is distinct from true or p_run->>'promotionStatus'<>'blocked'
     or p_run->>'pass1CandidatesSha256' !~ '^[a-f0-9]{64}$' or p_run->>'pass1CalibrationSha256' !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_forecasts) is distinct from 'array' or jsonb_array_length(p_forecasts)<>350
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts)item)<>12
     or (select count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>70
     or exists(select 1 from jsonb_array_elements(p_forecasts)item where not exists(select 1 from public.piercast_v3_expected_pairs()e where e.city_id=item->>'cityId' and e.species_id=item->>'speciesId') or (item->>'leadDay')::integer not between 0 and 4 or item->>'promotionStatus'<>'blocked' or nullif(item->>'modeCalibrationId','') is null or nullif(item->>'modeId','') is null)
  then raise exception 'invalid Formula v3 Lake Huron shadow payload'; end if;
  insert into public.pier_cast_v3_shadow_forecast_runs(config_version,generated_at,source_issued_at,source_fetched_at,ingestion_source,engine_version,formula_version,pass1_candidates_sha256,pass1_calibration_sha256,preview_only,promotion_status,forecast_count)
    values(p_run->>'configVersion',(p_run->>'generatedAt')::timestamptz,issue,(p_run->>'sourceFetchedAt')::timestamptz,p_run->>'ingestionSource',p_run->>'engineVersion',p_run->>'formulaVersion',p_run->>'pass1CandidatesSha256',p_run->>'pass1CalibrationSha256',true,'blocked',350)
    on conflict(config_version,source_issued_at,engine_version,formula_version,pass1_candidates_sha256,pass1_calibration_sha256) do nothing returning run_id into inserted_run;
  if inserted_run is null then
    select run_id into target_run from public.pier_cast_v3_shadow_forecast_runs where config_version=p_run->>'configVersion' and source_issued_at=issue and engine_version=p_run->>'engineVersion' and formula_version=p_run->>'formulaVersion' and pass1_candidates_sha256=p_run->>'pass1CandidatesSha256' and pass1_calibration_sha256=p_run->>'pass1CalibrationSha256';
    select count(*) into existing_count from public.pier_cast_v3_shadow_forecasts where run_id=target_run;
    if target_run is null or existing_count<>350 then raise exception 'existing Formula v3 Lake Huron run is incomplete'; end if;
    return jsonb_build_object('status','already_committed','runId',target_run,'forecastCount',350);
  end if;
  target_run:=inserted_run;
  insert into public.pier_cast_v3_shadow_forecasts(run_id,city_id,species_id,lead_day,local_date,timezone,assessment_scope,requested_start,requested_end,source_id,mode_calibration_id,mode_id,fishery_strength,seasonal_availability,seasonal_potential,temperature_curve_id,temperature_minimum_c,temperature_maximum_c,temperature_suitability_minimum,temperature_suitability_maximum,coverage_status,coverage_fraction,score_status,score,display_score,display_text,rating_label,targeting_eligibility,promotion_status,reason_codes)
    select target_run,item->>'cityId',item->>'speciesId',(item->>'leadDay')::smallint,(item->>'localDate')::date,item->>'timezone',item->>'assessmentScope',(item->>'requestedStart')::timestamptz,(item->>'requestedEnd')::timestamptz,item->>'sourceId',item->>'modeCalibrationId',item->>'modeId',(item->>'fisheryStrength')::double precision,(item->>'seasonalAvailability')::double precision,(item->>'seasonalPotential')::double precision,item->>'temperatureCurveId',(item->>'temperatureMinimumC')::double precision,(item->>'temperatureMaximumC')::double precision,(item->>'temperatureSuitabilityMinimum')::double precision,(item->>'temperatureSuitabilityMaximum')::double precision,item->>'coverageStatus',(item->>'coverageFraction')::double precision,item->>'scoreStatus',(item->>'score')::double precision,(item->>'displayScore')::double precision,nullif(item->>'displayText',''),nullif(item->>'ratingLabel',''),item->>'targetingEligibility',item->>'promotionStatus',coalesce(item->'reasonCodes','[]'::jsonb) from jsonb_array_elements(p_forecasts)item;
  if (select count(*)<>350 or count(distinct city_id)<>12 or count(distinct local_date)<>5 or count(distinct(city_id,species_id))<>70 or count(*)filter(where lead_day=0 and assessment_scope<>'remaining_day')>0 or count(*)filter(where lead_day>0 and assessment_scope<>'full_day')>0 from public.pier_cast_v3_shadow_forecasts where run_id=target_run)
  then raise exception 'Formula v3 Lake Huron run manifest is incomplete'; end if;
  if exists(select 1 from public.piercast_v3_expected_pairs()e left join public.pier_cast_v3_shadow_forecasts f on f.run_id=target_run and f.city_id=e.city_id and f.species_id=e.species_id group by e.city_id,e.species_id having count(f.run_id)<>5 or count(distinct f.lead_day)<>5)
  then raise exception 'Formula v3 expected pair manifest is incomplete'; end if;
  return jsonb_build_object('status','committed','runId',target_run,'forecastCount',350);
end; $$;

revoke all on function public.commit_pier_cast_expansion_lmhofs_cycle(text,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(text,timestamptz,integer) from public,anon,authenticated;
revoke all on function public.piercast_v3_expected_pairs() from public,anon,authenticated;
revoke all on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.commit_pier_cast_expansion_lmhofs_cycle(text,jsonb,jsonb) to service_role;
grant execute on function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(text,timestamptz,integer) to service_role;
grant execute on function public.piercast_v3_expected_pairs() to service_role;
grant execute on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) to service_role;

create or replace function public.invoke_pier_cast_lake_huron_shadow_ingestion()
returns bigint language plpgsql security definer set search_path=public,extensions,vault as $$
declare project_url text; anon_key text; internal_key text; request_id bigint;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name='pier_cast_project_url' limit 1;
  select decrypted_secret into anon_key from vault.decrypted_secrets where name='pier_cast_anon_key' limit 1;
  select decrypted_secret into internal_key from vault.decrypted_secrets where name='pier_cast_internal_key' limit 1;
  if project_url is null or anon_key is null or internal_key is null then raise warning 'Lake Huron shadow ingest skipped: Vault secrets missing'; return null; end if;
  select net.http_post(url:=rtrim(project_url,'/')||'/functions/v1/pier-cast-ingest',headers:=jsonb_build_object('Content-Type','application/json','apikey',anon_key,'Authorization','Bearer '||anon_key,'x-pier-cast-internal-key',internal_key,'x-pier-cast-operation','lake-huron-shadow'),body:=jsonb_build_object('scheduledAt',timezone('utc',now())),timeout_milliseconds:=55000) into request_id;
  return request_id;
end; $$;
revoke all on function public.invoke_pier_cast_lake_huron_shadow_ingestion() from public,anon,authenticated;
grant execute on function public.invoke_pier_cast_lake_huron_shadow_ingestion() to service_role;

do $$ declare existing_job_id bigint; begin
  select jobid into existing_job_id from cron.job where jobname='pier-cast-lake-huron-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-lake-huron-shadow-ingestion','50 0,6,12,18 * * *','select public.invoke_pier_cast_lake_huron_shadow_ingestion();');
  select jobid into existing_job_id from cron.job where jobname='pier-cast-v3-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-v3-shadow-ingestion','58 0,6,12,18 * * *','select public.invoke_pier_cast_v3_shadow_ingestion();');
end; $$;

comment on table public.pier_cast_v3_shadow_forecast_runs is 'Private disabled Formula v3 ledger preserving historical 9-city manifests and new 12-city Lake Huron runs; never a public release source.';
comment on function public.piercast_v3_expected_pairs() is 'Exact private Formula v3 12-city, 70-pair calibration manifest; absence is not biological absence.';
