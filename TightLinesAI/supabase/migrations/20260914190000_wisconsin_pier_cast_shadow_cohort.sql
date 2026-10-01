-- Extend the isolated expansion archive from the one-city Port Washington
-- pilot to the complete four-city Wisconsin shadow cohort. Public PierCast
-- tables, release gates, reports, trials, and locked leaderboard are untouched.

alter table public.pier_cast_expansion_temperature_samples
  drop constraint if exists pier_cast_expansion_temperature_samples_city_id_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_grid_row_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_grid_column_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_latitude_check,
  drop constraint if exists pier_cast_expansion_temperature_samples_longitude_check;

alter table public.pier_cast_expansion_temperature_samples
  add constraint pier_cast_expansion_temperature_samples_city_id_check
    check (city_id in ('port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi')),
  add constraint pier_cast_expansion_temperature_samples_location_check check (
    case city_id
      when 'port_washington_wi' then grid_row = 179 and grid_column = 21
        and latitude = 43.39 and longitude = -87.85
      when 'milwaukee_wi' then grid_row = 143 and grid_column = 18
        and latitude = 43.03 and longitude = -87.88
      when 'racine_wi' then grid_row = 113 and grid_column = 29
        and latitude = 42.73 and longitude = -87.77
      when 'kenosha_wi' then grid_row = 99 and grid_column = 26
        and latitude = 42.59 and longitude = -87.80
      else false
    end
  );

alter table public.pier_cast_expansion_shadow_forecast_runs
  drop constraint if exists pier_cast_expansion_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_expansion_shadow_forecast_runs
  add constraint pier_cast_expansion_shadow_forecast_runs_forecast_count_check check (
    (scope_version = 'piercast-port-washington-shadow-v1' and forecast_count = 20)
    or (scope_version = 'piercast-wisconsin-shadow-v1' and forecast_count = 80)
  );

alter table public.pier_cast_expansion_shadow_forecasts
  drop constraint if exists pier_cast_expansion_shadow_forecasts_city_id_check;
alter table public.pier_cast_expansion_shadow_forecasts
  add constraint pier_cast_expansion_shadow_forecasts_city_id_check check (
    city_id in ('port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi')
  );

create or replace function public.commit_pier_cast_expansion_lmhofs_cycle(
  p_scope_version text,
  p_cycle jsonb,
  p_samples jsonb
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  cycle_issue timestamptz := (p_cycle->>'issuedAt')::timestamptz;
  cycle_fetch timestamptz := (p_cycle->>'fetchedAt')::timestamptz;
  expected_count integer;
  expected_city_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version = 'piercast-port-washington-shadow-v1' then
    expected_count := 121; expected_city_count := 1;
  elsif p_scope_version = 'piercast-wisconsin-shadow-v1' then
    expected_count := 484; expected_city_count := 4;
  else
    raise exception 'invalid expansion scope';
  end if;

  if p_cycle->>'status' <> 'available'
     or p_cycle->>'productId' <> 'NOAA_NOS_LMHOFS_REGULARGRID'
     or (p_cycle->>'fullHorizonRequested')::boolean is distinct from true
     or jsonb_typeof(p_samples) is distinct from 'array'
     or jsonb_array_length(p_samples) <> expected_count
     or (select count(distinct item->>'cityId')
         from jsonb_array_elements(p_samples) item) <> expected_city_count
     or exists (
       select 1 from jsonb_array_elements(p_samples) item
       where (p_scope_version = 'piercast-port-washington-shadow-v1'
              and item->>'cityId' <> 'port_washington_wi')
          or (p_scope_version = 'piercast-wisconsin-shadow-v1'
              and item->>'cityId' not in (
                'port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi'
              ))
          or (item->>'forecastHour')::integer not between 0 and 120
          or (item->>'issuedAt')::timestamptz <> cycle_issue
          or (item->>'validAt')::timestamptz <> cycle_issue
             + make_interval(hours => (item->>'forecastHour')::integer)
          or item->>'productId' <> 'NOAA_NOS_LMHOFS_REGULARGRID'
          or item->>'rawUnit' <> 'C'
          or item->>'verticalSelection' <> 'surface'
          or (item->>'depthIndex')::integer <> 0
          or not case item->>'cityId'
            when 'port_washington_wi' then
              (item->>'gridRow')::integer = 179
              and (item->>'gridColumn')::integer = 21
              and (item->>'latitude')::double precision = 43.39
              and (item->>'longitude')::double precision = -87.85
            when 'milwaukee_wi' then
              (item->>'gridRow')::integer = 143
              and (item->>'gridColumn')::integer = 18
              and (item->>'latitude')::double precision = 43.03
              and (item->>'longitude')::double precision = -87.88
            when 'racine_wi' then
              (item->>'gridRow')::integer = 113
              and (item->>'gridColumn')::integer = 29
              and (item->>'latitude')::double precision = 42.73
              and (item->>'longitude')::double precision = -87.77
            when 'kenosha_wi' then
              (item->>'gridRow')::integer = 99
              and (item->>'gridColumn')::integer = 26
              and (item->>'latitude')::double precision = 42.59
              and (item->>'longitude')::double precision = -87.80
            else false
          end
     )
     or exists (
       select 1 from jsonb_array_elements(p_samples) item
       group by item->>'cityId'
       having count(*) <> 121
          or count(distinct (item->>'forecastHour')::integer) <> 121
     ) then raise exception 'invalid expansion LMHOFS shadow cycle';
  end if;

  insert into public.pier_cast_expansion_temperature_cycles (
    scope_version, issued_at, fetched_at, product_id, engine_version,
    source_status, diagnostics, updated_at
  ) values (
    p_scope_version, cycle_issue, cycle_fetch, 'NOAA_NOS_LMHOFS_REGULARGRID',
    p_cycle->>'engineVersion', 'complete', coalesce(p_cycle->'diagnostics', '[]'::jsonb),
    timezone('utc', now())
  ) on conflict (scope_version, issued_at) do update set
    fetched_at = excluded.fetched_at,
    engine_version = excluded.engine_version,
    diagnostics = excluded.diagnostics,
    updated_at = timezone('utc', now());

  insert into public.pier_cast_expansion_temperature_samples (
    scope_version, city_id, source_id, issued_at, forecast_hour, valid_at,
    temperature_c, raw_unit, vertical_selection, depth_index, grid_row,
    grid_column, latitude, longitude, source_url, fetched_at, updated_at
  ) select
    p_scope_version, item->>'cityId', item->>'sourceId',
    (item->>'issuedAt')::timestamptz, (item->>'forecastHour')::smallint,
    (item->>'validAt')::timestamptz, (item->>'temperatureC')::double precision,
    item->>'rawUnit', item->>'verticalSelection', (item->>'depthIndex')::smallint,
    (item->>'gridRow')::integer, (item->>'gridColumn')::integer,
    (item->>'latitude')::double precision, (item->>'longitude')::double precision,
    item->>'sourceUrl', cycle_fetch, timezone('utc', now())
  from jsonb_array_elements(p_samples) item
  on conflict (scope_version, city_id, issued_at, forecast_hour) do update set
    source_id = excluded.source_id, valid_at = excluded.valid_at,
    temperature_c = excluded.temperature_c, source_url = excluded.source_url,
    fetched_at = excluded.fetched_at, updated_at = timezone('utc', now());
  return jsonb_build_object('status', 'committed', 'issuedAt', cycle_issue,
    'cityCount', expected_city_count, 'sampleCount', expected_count);
end;
$$;

create or replace function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(
  p_scope_version text,
  p_now timestamptz,
  p_max_age_hours integer default 13
) returns table (
  city_id text, source_id text, issued_at timestamptz, forecast_hour smallint,
  valid_at timestamptz, temperature_c double precision, raw_unit text,
  vertical_selection text, depth_index smallint, grid_row integer,
  grid_column integer, latitude double precision, longitude double precision,
  source_url text, cycle_fetched_at timestamptz, diagnostics jsonb
)
language plpgsql security definer set search_path = ''
as $$
declare target_issue timestamptz; expected_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version = 'piercast-port-washington-shadow-v1' then
    expected_count := 121;
  elsif p_scope_version = 'piercast-wisconsin-shadow-v1' then
    expected_count := 484;
  else
    raise exception 'invalid expansion archive request';
  end if;
  if p_max_age_hours not between 1 and 24 then
    raise exception 'invalid expansion archive request';
  end if;
  select cycle.issued_at into target_issue
  from public.pier_cast_expansion_temperature_cycles cycle
  where cycle.scope_version = p_scope_version and cycle.source_status = 'complete'
    and cycle.issued_at <= p_now
    and cycle.issued_at >= p_now - make_interval(hours => p_max_age_hours)
    and (select count(*) from public.pier_cast_expansion_temperature_samples sample
      where sample.scope_version = cycle.scope_version
        and sample.issued_at = cycle.issued_at) = expected_count
  order by cycle.issued_at desc limit 1;
  if target_issue is null then return; end if;
  return query select sample.city_id, sample.source_id, sample.issued_at,
    sample.forecast_hour, sample.valid_at, sample.temperature_c, sample.raw_unit,
    sample.vertical_selection, sample.depth_index, sample.grid_row,
    sample.grid_column, sample.latitude, sample.longitude, sample.source_url,
    cycle.fetched_at, cycle.diagnostics
  from public.pier_cast_expansion_temperature_samples sample
  join public.pier_cast_expansion_temperature_cycles cycle
    on cycle.scope_version = sample.scope_version and cycle.issued_at = sample.issued_at
  where sample.scope_version = p_scope_version and sample.issued_at = target_issue
  order by sample.city_id, sample.forecast_hour;
end;
$$;

create or replace function public.commit_pier_cast_expansion_shadow_forecast(
  p_run jsonb,
  p_forecasts jsonb
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  target_run uuid;
  inserted_run uuid;
  issue timestamptz := (p_run->>'sourceIssuedAt')::timestamptz;
  existing_count integer;
  expected_count integer;
  expected_city_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_run->>'scopeVersion' = 'piercast-port-washington-shadow-v1'
     and p_run->>'speciesRosterVersion' = 'piercast-port-washington-core-four-v1' then
    expected_count := 20; expected_city_count := 1;
  elsif p_run->>'scopeVersion' = 'piercast-wisconsin-shadow-v1'
     and p_run->>'speciesRosterVersion' = 'piercast-wisconsin-core-four-v1' then
    expected_count := 80; expected_city_count := 4;
  else
    raise exception 'invalid expansion forecast scope';
  end if;

  if (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'ingestionSource' not in ('live_lmhofs', 'fresh_archived_complete_cycle')
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> expected_count
     or (select count(distinct item->>'cityId')
         from jsonb_array_elements(p_forecasts) item) <> expected_city_count
     or exists (
       select 1 from jsonb_array_elements(p_forecasts) item
       where (p_run->>'scopeVersion' = 'piercast-port-washington-shadow-v1'
              and item->>'cityId' <> 'port_washington_wi')
          or (p_run->>'scopeVersion' = 'piercast-wisconsin-shadow-v1'
              and item->>'cityId' not in (
                'port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi'
              ))
          or item->>'speciesId' not in (
            'coho_salmon','chinook_salmon','steelhead','brown_trout'
          )
          or (item->>'leadDay')::integer not between 0 and 4
     ) then raise exception 'invalid expansion shadow forecast payload';
  end if;

  insert into public.pier_cast_expansion_shadow_forecast_runs (
    scope_version, species_roster_version, generated_at, source_issued_at,
    source_fetched_at, ingestion_source, engine_version, formula_version,
    rubric_version, seasonal_calibration_version, temperature_calibration_version,
    preview_only, forecast_count
  ) values (
    p_run->>'scopeVersion', p_run->>'speciesRosterVersion',
    (p_run->>'generatedAt')::timestamptz, issue,
    (p_run->>'sourceFetchedAt')::timestamptz, p_run->>'ingestionSource',
    p_run->>'engineVersion', p_run->>'formulaVersion', p_run->>'rubricVersion',
    p_run->>'seasonalCalibrationVersion', p_run->>'temperatureCalibrationVersion',
    true, expected_count
  ) on conflict (scope_version, source_issued_at, engine_version, formula_version,
    seasonal_calibration_version, temperature_calibration_version) do nothing
  returning run_id into inserted_run;

  if inserted_run is null then
    select run_id into target_run from public.pier_cast_expansion_shadow_forecast_runs
    where scope_version = p_run->>'scopeVersion' and source_issued_at = issue
      and engine_version = p_run->>'engineVersion'
      and formula_version = p_run->>'formulaVersion'
      and seasonal_calibration_version = p_run->>'seasonalCalibrationVersion'
      and temperature_calibration_version = p_run->>'temperatureCalibrationVersion';
    select count(*) into existing_count from public.pier_cast_expansion_shadow_forecasts
      where run_id = target_run;
    if target_run is null or existing_count <> expected_count then
      raise exception 'existing expansion shadow run is incomplete';
    end if;
    return jsonb_build_object('status','already_committed','runId',target_run,
      'forecastCount',expected_count);
  end if;
  target_run := inserted_run;

  insert into public.pier_cast_expansion_shadow_forecasts (
    run_id, city_id, species_id, lead_day, local_date, timezone, assessment_scope,
    requested_start, requested_end, open_water_notice_applies,
    representation_decision, source_id, seasonal_curve_id, temperature_curve_id,
    seasonal_rating, temperature_minimum_c, temperature_maximum_c,
    temperature_suitability_minimum, temperature_suitability_maximum,
    coverage_status, coverage_fraction, score_status, score, display_score,
    display_text, rating_label, targeting_eligibility, promotion_status, reason_codes
  ) select target_run, item->>'cityId', item->>'speciesId',
    (item->>'leadDay')::smallint, (item->>'localDate')::date, item->>'timezone',
    item->>'assessmentScope', (item->>'requestedStart')::timestamptz,
    (item->>'requestedEnd')::timestamptz, (item->>'openWaterNoticeApplies')::boolean,
    item->>'representationDecision', item->>'sourceId',
    nullif(item->>'seasonalCurveId',''), nullif(item->>'temperatureCurveId',''),
    (item->>'seasonalRating')::double precision,
    (item->>'temperatureMinimumC')::double precision,
    (item->>'temperatureMaximumC')::double precision,
    (item->>'temperatureSuitabilityMinimum')::double precision,
    (item->>'temperatureSuitabilityMaximum')::double precision,
    item->>'coverageStatus', (item->>'coverageFraction')::double precision,
    item->>'scoreStatus', (item->>'score')::double precision,
    (item->>'displayScore')::double precision, nullif(item->>'displayText',''),
    nullif(item->>'ratingLabel',''), item->>'targetingEligibility',
    item->>'promotionStatus', coalesce(item->'reasonCodes','[]'::jsonb)
  from jsonb_array_elements(p_forecasts) item;

  if (select count(*) <> expected_count or count(distinct local_date) <> 5
      or count(distinct city_id) <> expected_city_count
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
      from public.pier_cast_expansion_shadow_forecasts where run_id = target_run)
  then raise exception 'expansion shadow run has an incomplete manifest'; end if;
  if exists (select 1 from public.pier_cast_expansion_shadow_forecasts
    where run_id = target_run group by city_id, local_date
    having count(*) <> 4 or count(distinct species_id) <> 4
      or count(distinct lead_day) <> 1)
  then raise exception 'expansion shadow city/date is incomplete'; end if;
  return jsonb_build_object('status','committed','runId',target_run,
    'forecastCount',expected_count);
end;
$$;

alter table public.pier_cast_shadow_outcomes
  drop constraint pier_cast_shadow_outcomes_city_id_check,
  add constraint pier_cast_shadow_outcomes_city_id_check check (city_id in (
    'ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi',
    'sheboygan_wi','port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi'
  ));
alter table public.pier_cast_shadow_outcomes
  drop constraint pier_cast_shadow_outcomes_species_id_check,
  add constraint pier_cast_shadow_outcomes_species_id_check check (
    case
      when city_id in ('port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi')
        then species_id in ('coho_salmon','chinook_salmon','steelhead','brown_trout')
      else species_id = any(public.pier_cast_private_roster(
        city_id, 'piercast-private-roster-v3-2026-09-13'
      ))
    end
  );

create or replace function public.invoke_pier_cast_wisconsin_shadow_ingestion()
returns bigint
language plpgsql security definer set search_path = public, extensions, vault
as $$
declare project_url text; anon_key text; internal_key text; request_id bigint;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets
    where name = 'pier_cast_project_url' limit 1;
  select decrypted_secret into anon_key from vault.decrypted_secrets
    where name = 'pier_cast_anon_key' limit 1;
  select decrypted_secret into internal_key from vault.decrypted_secrets
    where name = 'pier_cast_internal_key' limit 1;
  if project_url is null or anon_key is null or internal_key is null then
    raise warning 'Wisconsin PierCast shadow ingest skipped: Vault secrets missing';
    return null;
  end if;
  select net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/pier-cast-ingest',
    headers := jsonb_build_object('Content-Type','application/json','apikey',anon_key,
      'Authorization','Bearer ' || anon_key,'x-pier-cast-internal-key',internal_key,
      'x-pier-cast-operation','wisconsin-shadow'),
    body := jsonb_build_object('scheduledAt', timezone('utc', now())),
    timeout_milliseconds := 55000
  ) into request_id;
  return request_id;
end;
$$;

revoke all on function public.invoke_pier_cast_wisconsin_shadow_ingestion()
  from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_wisconsin_shadow_ingestion()
  to service_role;

do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job
    where jobname = 'pier-cast-port-washington-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  select jobid into existing_job_id from cron.job
    where jobname = 'pier-cast-wisconsin-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-wisconsin-shadow-ingestion',
    '45 0,6,12,18 * * *',
    'select public.invoke_pier_cast_wisconsin_shadow_ingestion();');
end;
$$;

comment on table public.pier_cast_expansion_temperature_cycles is
  'Private, versioned expansion-cohort LMHOFS cycles; never consumed by public PierCast.';
comment on table public.pier_cast_expansion_shadow_forecasts is
  'Private disabled-preview forecasts for Port Washington, Milwaukee, Racine, and Kenosha.';
