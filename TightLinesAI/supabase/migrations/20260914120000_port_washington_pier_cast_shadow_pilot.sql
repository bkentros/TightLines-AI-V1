-- Port Washington is an isolated shadow cohort. These tables and RPCs do not
-- modify the frozen five-city temperature or forecast archives.
create table if not exists public.pier_cast_expansion_temperature_cycles (
  scope_version text not null check (char_length(scope_version) between 1 and 100),
  issued_at timestamptz not null,
  fetched_at timestamptz not null,
  product_id text not null check (product_id = 'NOAA_NOS_LMHOFS_REGULARGRID'),
  engine_version text not null check (char_length(engine_version) between 1 and 100),
  source_status text not null check (source_status = 'complete'),
  diagnostics jsonb not null default '[]'::jsonb check (jsonb_typeof(diagnostics) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (scope_version, issued_at)
);

create table if not exists public.pier_cast_expansion_temperature_samples (
  scope_version text not null,
  city_id text not null check (city_id = 'port_washington_wi'),
  source_id text not null,
  issued_at timestamptz not null,
  forecast_hour smallint not null check (forecast_hour between 0 and 120),
  valid_at timestamptz not null,
  temperature_c double precision not null check (temperature_c between -2 and 40),
  raw_unit text not null check (raw_unit = 'C'),
  vertical_selection text not null check (vertical_selection = 'surface'),
  depth_index smallint not null check (depth_index = 0),
  grid_row integer not null check (grid_row = 179),
  grid_column integer not null check (grid_column = 21),
  latitude double precision not null check (latitude = 43.39),
  longitude double precision not null check (longitude = -87.85),
  source_url text not null,
  fetched_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (scope_version, city_id, issued_at, forecast_hour),
  foreign key (scope_version, issued_at)
    references public.pier_cast_expansion_temperature_cycles(scope_version, issued_at)
    on delete cascade,
  check (valid_at = issued_at + make_interval(hours => forecast_hour))
);

create index if not exists pier_cast_expansion_temperature_samples_lookup_idx
  on public.pier_cast_expansion_temperature_samples(scope_version, city_id, valid_at desc);

create table if not exists public.pier_cast_expansion_shadow_forecast_runs (
  run_id uuid primary key default gen_random_uuid(),
  scope_version text not null,
  species_roster_version text not null,
  generated_at timestamptz not null,
  source_issued_at timestamptz not null,
  source_fetched_at timestamptz not null,
  ingestion_source text not null check (ingestion_source in (
    'live_lmhofs', 'fresh_archived_complete_cycle'
  )),
  engine_version text not null,
  formula_version text not null,
  rubric_version text not null,
  seasonal_calibration_version text not null,
  temperature_calibration_version text not null,
  preview_only boolean not null check (preview_only = true),
  forecast_count smallint not null check (forecast_count = 20),
  created_at timestamptz not null default timezone('utc', now()),
  foreign key (scope_version, source_issued_at)
    references public.pier_cast_expansion_temperature_cycles(scope_version, issued_at)
    on delete restrict,
  unique (
    scope_version, source_issued_at, engine_version, formula_version,
    seasonal_calibration_version, temperature_calibration_version
  )
);

create table if not exists public.pier_cast_expansion_shadow_forecasts (
  run_id uuid not null references public.pier_cast_expansion_shadow_forecast_runs(run_id) on delete restrict,
  city_id text not null check (city_id = 'port_washington_wi'),
  species_id text not null check (species_id in (
    'coho_salmon', 'chinook_salmon', 'steelhead', 'brown_trout'
  )),
  lead_day smallint not null check (lead_day between 0 and 4),
  local_date date not null,
  timezone text not null check (timezone = 'America/Chicago'),
  assessment_scope text not null check (assessment_scope in ('remaining_day', 'full_day')),
  requested_start timestamptz not null,
  requested_end timestamptz not null check (requested_end > requested_start),
  open_water_notice_applies boolean not null,
  representation_decision text not null check (representation_decision = 'blocked_insufficient_evidence'),
  source_id text not null,
  seasonal_curve_id text,
  temperature_curve_id text,
  seasonal_rating double precision check (seasonal_rating between 1 and 10),
  temperature_minimum_c double precision check (temperature_minimum_c between -2 and 40),
  temperature_maximum_c double precision check (temperature_maximum_c between -2 and 40),
  temperature_suitability_minimum double precision check (temperature_suitability_minimum between 0 and 1),
  temperature_suitability_maximum double precision check (temperature_suitability_maximum between 0 and 1),
  coverage_status text not null check (coverage_status in ('complete', 'partial', 'none')),
  coverage_fraction double precision not null check (coverage_fraction between 0 and 1),
  score_status text not null check (score_status in ('available', 'unavailable')),
  score double precision check (score between 1 and 10),
  display_score double precision check (display_score between 1 and 10),
  display_text text,
  rating_label text check (rating_label in ('Poor', 'Limited', 'Fair', 'Good', 'Excellent')),
  targeting_eligibility text not null check (targeting_eligibility in ('eligible', 'restricted', 'unknown')),
  promotion_status text not null check (promotion_status in ('eligible', 'limited', 'blocked', 'unknown')),
  reason_codes jsonb not null default '[]'::jsonb check (jsonb_typeof(reason_codes) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (run_id, city_id, local_date, species_id),
  check (
    (temperature_minimum_c is null and temperature_maximum_c is null)
    or (temperature_minimum_c is not null and temperature_maximum_c is not null
      and temperature_minimum_c <= temperature_maximum_c)
  ),
  check (
    (temperature_suitability_minimum is null and temperature_suitability_maximum is null)
    or (temperature_suitability_minimum is not null and temperature_suitability_maximum is not null
      and temperature_suitability_minimum <= temperature_suitability_maximum)
  ),
  check (
    (score_status = 'available' and score is not null and display_score is not null
      and display_text is not null and rating_label is not null)
    or (score_status = 'unavailable' and score is null and display_score is null
      and display_text is null and rating_label is null)
  )
);

create index if not exists pier_cast_expansion_shadow_forecasts_lookup_idx
  on public.pier_cast_expansion_shadow_forecasts(city_id, local_date, species_id, lead_day);

alter table public.pier_cast_expansion_temperature_cycles enable row level security;
alter table public.pier_cast_expansion_temperature_samples enable row level security;
alter table public.pier_cast_expansion_shadow_forecast_runs enable row level security;
alter table public.pier_cast_expansion_shadow_forecasts enable row level security;

create policy "pier_cast_expansion_temperature_cycles_service_role_all"
  on public.pier_cast_expansion_temperature_cycles for all to service_role
  using (true) with check (true);
create policy "pier_cast_expansion_temperature_samples_service_role_all"
  on public.pier_cast_expansion_temperature_samples for all to service_role
  using (true) with check (true);
create policy "pier_cast_expansion_shadow_runs_service_role_all"
  on public.pier_cast_expansion_shadow_forecast_runs for all to service_role
  using (true) with check (true);
create policy "pier_cast_expansion_shadow_forecasts_service_role_all"
  on public.pier_cast_expansion_shadow_forecasts for all to service_role
  using (true) with check (true);

revoke all on table public.pier_cast_expansion_temperature_cycles from public, anon, authenticated;
revoke all on table public.pier_cast_expansion_temperature_samples from public, anon, authenticated;
revoke all on table public.pier_cast_expansion_shadow_forecast_runs from public, anon, authenticated;
revoke all on table public.pier_cast_expansion_shadow_forecasts from public, anon, authenticated;
grant select, insert, update, delete on table public.pier_cast_expansion_temperature_cycles to service_role;
grant select, insert, update, delete on table public.pier_cast_expansion_temperature_samples to service_role;
grant select, insert on table public.pier_cast_expansion_shadow_forecast_runs to service_role;
grant select, insert on table public.pier_cast_expansion_shadow_forecasts to service_role;

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
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version <> 'piercast-port-washington-shadow-v1'
     or p_cycle->>'status' <> 'available'
     or p_cycle->>'productId' <> 'NOAA_NOS_LMHOFS_REGULARGRID'
     or (p_cycle->>'fullHorizonRequested')::boolean is distinct from true
     or jsonb_typeof(p_samples) is distinct from 'array'
     or jsonb_array_length(p_samples) <> 121
     or (select count(distinct (item->>'forecastHour')::integer)
         from jsonb_array_elements(p_samples) item) <> 121
     or exists (
       select 1 from jsonb_array_elements(p_samples) item
       where item->>'cityId' <> 'port_washington_wi'
          or (item->>'forecastHour')::integer not between 0 and 120
          or (item->>'issuedAt')::timestamptz <> cycle_issue
          or (item->>'validAt')::timestamptz <> cycle_issue
             + make_interval(hours => (item->>'forecastHour')::integer)
          or item->>'productId' <> 'NOAA_NOS_LMHOFS_REGULARGRID'
          or item->>'rawUnit' <> 'C'
          or item->>'verticalSelection' <> 'surface'
          or (item->>'depthIndex')::integer <> 0
          or (item->>'gridRow')::integer <> 179
          or (item->>'gridColumn')::integer <> 21
          or (item->>'latitude')::double precision <> 43.39
          or (item->>'longitude')::double precision <> -87.85
     ) then raise exception 'invalid Port Washington LMHOFS shadow cycle';
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
    'cityCount', 1, 'sampleCount', 121);
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
declare target_issue timestamptz;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_scope_version <> 'piercast-port-washington-shadow-v1'
     or p_max_age_hours not between 1 and 24 then
    raise exception 'invalid expansion archive request';
  end if;
  select cycle.issued_at into target_issue
  from public.pier_cast_expansion_temperature_cycles cycle
  where cycle.scope_version = p_scope_version and cycle.source_status = 'complete'
    and cycle.issued_at <= p_now
    and cycle.issued_at >= p_now - make_interval(hours => p_max_age_hours)
    and (select count(*) from public.pier_cast_expansion_temperature_samples sample
      where sample.scope_version = cycle.scope_version
        and sample.issued_at = cycle.issued_at) = 121
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
  order by sample.forecast_hour;
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
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_run->>'scopeVersion' <> 'piercast-port-washington-shadow-v1'
     or p_run->>'speciesRosterVersion' <> 'piercast-port-washington-core-four-v1'
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'ingestionSource' not in ('live_lmhofs', 'fresh_archived_complete_cycle')
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> 20
     or exists (
       select 1 from jsonb_array_elements(p_forecasts) item
       where item->>'cityId' <> 'port_washington_wi'
          or item->>'speciesId' not in ('coho_salmon','chinook_salmon','steelhead','brown_trout')
          or (item->>'leadDay')::integer not between 0 and 4
     ) then raise exception 'invalid Port Washington shadow forecast payload';
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
    true, 20
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
    if target_run is null or existing_count <> 20 then
      raise exception 'existing Port Washington shadow run is incomplete';
    end if;
    return jsonb_build_object('status','already_committed','runId',target_run,'forecastCount',20);
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

  if (select count(*) <> 20 or count(distinct local_date) <> 5
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
      from public.pier_cast_expansion_shadow_forecasts where run_id = target_run)
  then raise exception 'Port Washington shadow run must contain five dates by four species'; end if;
  if exists (select 1 from public.pier_cast_expansion_shadow_forecasts
    where run_id = target_run group by local_date
    having count(*) <> 4 or count(distinct lead_day) <> 1)
  then raise exception 'Port Washington shadow date is incomplete'; end if;
  return jsonb_build_object('status','committed','runId',target_run,'forecastCount',20);
end;
$$;

revoke all on function public.commit_pier_cast_expansion_lmhofs_cycle(text,jsonb,jsonb) from public, anon, authenticated;
revoke all on function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(text,timestamptz,integer) from public, anon, authenticated;
revoke all on function public.commit_pier_cast_expansion_shadow_forecast(jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.commit_pier_cast_expansion_lmhofs_cycle(text,jsonb,jsonb) to service_role;
grant execute on function public.read_latest_fresh_pier_cast_expansion_lmhofs_samples(text,timestamptz,integer) to service_role;
grant execute on function public.commit_pier_cast_expansion_shadow_forecast(jsonb,jsonb) to service_role;

-- Outcomes share the append-only evidence ledger, but admission is explicit.
alter table public.pier_cast_shadow_outcomes
  drop constraint pier_cast_shadow_outcomes_city_id_check,
  add constraint pier_cast_shadow_outcomes_city_id_check check (city_id in (
    'ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi',
    'sheboygan_wi','port_washington_wi'
  ));
alter table public.pier_cast_shadow_outcomes
  drop constraint pier_cast_shadow_outcomes_species_id_check,
  add constraint pier_cast_shadow_outcomes_species_id_check check (
    case
      when city_id = 'port_washington_wi' then species_id in (
        'coho_salmon','chinook_salmon','steelhead','brown_trout'
      )
      else species_id = any(public.pier_cast_private_roster(
        city_id, 'piercast-private-roster-v3-2026-09-13'
      ))
    end
  );

-- Pair expansion outcomes with the isolated forecast ledger as well as v1.
create or replace view public.pier_cast_shadow_validation_pairs
with (security_invoker = true)
as
select outcome.outcome_id, outcome.city_id, outcome.species_id,
  outcome.local_date, outcome.structure_name, outcome.assessment_status,
  outcome.result, outcome.effort_minutes, outcome.catch_count,
  outcome.source_type, outcome.evidence_quality, forecast.run_id,
  forecast.lead_day, forecast.seasonal_rating,
  forecast.temperature_suitability_minimum,
  forecast.temperature_suitability_maximum, forecast.score,
  forecast.display_score, run.generated_at, run.engine_version,
  run.formula_version, run.seasonal_calibration_version,
  run.temperature_calibration_version, run.source_issued_at
from public.pier_cast_shadow_outcomes outcome
join public.pier_cast_shadow_forecasts forecast
  on forecast.city_id = outcome.city_id and forecast.species_id = outcome.species_id
  and forecast.local_date = outcome.local_date
join public.pier_cast_shadow_forecast_runs run on run.run_id = forecast.run_id
union all
select outcome.outcome_id, outcome.city_id, outcome.species_id,
  outcome.local_date, outcome.structure_name, outcome.assessment_status,
  outcome.result, outcome.effort_minutes, outcome.catch_count,
  outcome.source_type, outcome.evidence_quality, forecast.run_id,
  forecast.lead_day, forecast.seasonal_rating,
  forecast.temperature_suitability_minimum,
  forecast.temperature_suitability_maximum, forecast.score,
  forecast.display_score, run.generated_at, run.engine_version,
  run.formula_version, run.seasonal_calibration_version,
  run.temperature_calibration_version, run.source_issued_at
from public.pier_cast_shadow_outcomes outcome
join public.pier_cast_expansion_shadow_forecasts forecast
  on forecast.city_id = outcome.city_id and forecast.species_id = outcome.species_id
  and forecast.local_date = outcome.local_date
join public.pier_cast_expansion_shadow_forecast_runs run on run.run_id = forecast.run_id;

revoke all on table public.pier_cast_shadow_validation_pairs from public, anon, authenticated;
grant select on table public.pier_cast_shadow_validation_pairs to service_role;

create or replace function public.invoke_pier_cast_port_washington_shadow_ingestion()
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
    raise warning 'Port Washington PierCast shadow ingest skipped: Vault secrets missing';
    return null;
  end if;
  select net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/pier-cast-ingest',
    headers := jsonb_build_object('Content-Type','application/json','apikey',anon_key,
      'Authorization','Bearer ' || anon_key,'x-pier-cast-internal-key',internal_key,
      'x-pier-cast-operation','port-washington-shadow'),
    body := jsonb_build_object('scheduledAt', timezone('utc', now())),
    timeout_milliseconds := 55000
  ) into request_id;
  return request_id;
end;
$$;

revoke all on function public.invoke_pier_cast_port_washington_shadow_ingestion() from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_port_washington_shadow_ingestion() to service_role;

do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job
    where jobname = 'pier-cast-port-washington-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-port-washington-shadow-ingestion',
    '45 0,6,12,18 * * *',
    'select public.invoke_pier_cast_port_washington_shadow_ingestion();');
end;
$$;

comment on table public.pier_cast_expansion_temperature_cycles is
  'Private, versioned shadow-cohort LMHOFS cycles; never consumed by public PierCast.';
comment on table public.pier_cast_expansion_shadow_forecasts is
  'Private Port Washington disabled-preview forecasts for prospective validation.';
