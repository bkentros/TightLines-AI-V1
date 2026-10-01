-- Formula v3 remains private, disabled, append-only shadow evidence. It is
-- deliberately isolated from v2 forecasts, daily snapshots, and leaderboards.
create table if not exists public.pier_cast_v3_shadow_forecast_runs (
  run_id uuid primary key default gen_random_uuid(),
  config_version text not null check (config_version = 'piercast-v3-nine-city-core-four-pass2-v1'),
  generated_at timestamptz not null,
  source_issued_at timestamptz not null,
  source_fetched_at timestamptz not null,
  ingestion_source text not null check (ingestion_source in ('live_lmhofs','fresh_archived_complete_cycle')),
  engine_version text not null check (char_length(engine_version) between 1 and 120),
  formula_version text not null check (formula_version = 'piercast-opportunity-modes-bounded-temperature-v3'),
  pass1_candidates_sha256 text not null check (pass1_candidates_sha256 ~ '^[a-f0-9]{64}$'),
  pass1_calibration_sha256 text not null check (pass1_calibration_sha256 ~ '^[a-f0-9]{64}$'),
  preview_only boolean not null check (preview_only = true),
  promotion_status text not null check (promotion_status = 'blocked'),
  forecast_count smallint not null check (forecast_count = 180),
  created_at timestamptz not null default timezone('utc', now()),
  unique (config_version, source_issued_at, engine_version, formula_version,
    pass1_candidates_sha256, pass1_calibration_sha256)
);

create table if not exists public.pier_cast_v3_shadow_forecasts (
  run_id uuid not null references public.pier_cast_v3_shadow_forecast_runs(run_id) on delete restrict,
  city_id text not null check (city_id in (
    'ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi','sheboygan_wi',
    'port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi'
  )),
  species_id text not null check (species_id in ('chinook_salmon','coho_salmon','steelhead','brown_trout')),
  lead_day smallint not null check (lead_day between 0 and 4),
  local_date date not null,
  timezone text not null check (timezone in ('America/Detroit','America/Chicago')),
  assessment_scope text not null check (assessment_scope in ('remaining_day','full_day')),
  requested_start timestamptz not null,
  requested_end timestamptz not null check (requested_end > requested_start),
  source_id text not null,
  mode_calibration_id text not null,
  mode_id text not null,
  fishery_strength double precision not null check (fishery_strength between 1 and 10),
  seasonal_availability double precision not null check (seasonal_availability between 0 and 1),
  seasonal_potential double precision not null check (
    seasonal_potential between 1 and 10 and seasonal_potential <= fishery_strength
  ),
  temperature_curve_id text not null,
  temperature_minimum_c double precision check (temperature_minimum_c between -2 and 40),
  temperature_maximum_c double precision check (temperature_maximum_c between -2 and 40),
  temperature_suitability_minimum double precision check (temperature_suitability_minimum between 0 and 1),
  temperature_suitability_maximum double precision check (temperature_suitability_maximum between 0 and 1),
  coverage_status text not null check (coverage_status in ('complete','partial','none')),
  coverage_fraction double precision not null check (coverage_fraction between 0 and 1),
  score_status text not null check (score_status in ('available','unavailable')),
  score double precision check (score between 1 and 10),
  display_score double precision check (display_score between 1 and 10),
  display_text text,
  rating_label text check (rating_label in ('Poor','Limited','Fair','Good','Excellent')),
  targeting_eligibility text not null check (targeting_eligibility = 'eligible'),
  promotion_status text not null check (promotion_status = 'blocked'),
  reason_codes jsonb not null check (jsonb_typeof(reason_codes) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (run_id, city_id, local_date, species_id),
  check ((temperature_minimum_c is null and temperature_maximum_c is null) or
    (temperature_minimum_c is not null and temperature_maximum_c is not null and
     temperature_minimum_c <= temperature_maximum_c)),
  check ((temperature_suitability_minimum is null and temperature_suitability_maximum is null) or
    (temperature_suitability_minimum is not null and temperature_suitability_maximum is not null and
     temperature_suitability_minimum <= temperature_suitability_maximum)),
  check ((score_status = 'available' and score is not null and display_score is not null and
          display_text is not null and rating_label is not null) or
         (score_status = 'unavailable' and score is null and display_score is null and
          display_text is null and rating_label is null))
);

create index if not exists pier_cast_v3_shadow_forecasts_lookup_idx
  on public.pier_cast_v3_shadow_forecasts(city_id, local_date, species_id, lead_day);

alter table public.pier_cast_v3_shadow_forecast_runs enable row level security;
alter table public.pier_cast_v3_shadow_forecasts enable row level security;
revoke all on table public.pier_cast_v3_shadow_forecast_runs from public, anon, authenticated;
revoke all on table public.pier_cast_v3_shadow_forecasts from public, anon, authenticated;
grant select, insert on table public.pier_cast_v3_shadow_forecast_runs to service_role;
grant select, insert on table public.pier_cast_v3_shadow_forecasts to service_role;

create or replace function public.commit_pier_cast_v3_shadow_forecast(
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
  if p_run->>'configVersion' <> 'piercast-v3-nine-city-core-four-pass2-v1'
     or p_run->>'formulaVersion' <> 'piercast-opportunity-modes-bounded-temperature-v3'
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'promotionStatus' <> 'blocked'
     or p_run->>'pass1CandidatesSha256' !~ '^[a-f0-9]{64}$'
     or p_run->>'pass1CalibrationSha256' !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> 180
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts) item) <> 9
     or (select count(distinct item->>'speciesId') from jsonb_array_elements(p_forecasts) item) <> 4
     or exists (select 1 from jsonb_array_elements(p_forecasts) item where
       item->>'cityId' not in ('ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi',
         'sheboygan_wi','port_washington_wi','milwaukee_wi','racine_wi','kenosha_wi')
       or item->>'speciesId' not in ('chinook_salmon','coho_salmon','steelhead','brown_trout')
       or (item->>'leadDay')::integer not between 0 and 4
       or item->>'promotionStatus' <> 'blocked'
       or nullif(item->>'modeCalibrationId','') is null
       or nullif(item->>'modeId','') is null)
  then raise exception 'invalid Formula v3 shadow payload'; end if;

  insert into public.pier_cast_v3_shadow_forecast_runs (
    config_version, generated_at, source_issued_at, source_fetched_at, ingestion_source,
    engine_version, formula_version, pass1_candidates_sha256, pass1_calibration_sha256,
    preview_only, promotion_status, forecast_count
  ) values (
    p_run->>'configVersion', (p_run->>'generatedAt')::timestamptz, issue,
    (p_run->>'sourceFetchedAt')::timestamptz, p_run->>'ingestionSource',
    p_run->>'engineVersion', p_run->>'formulaVersion', p_run->>'pass1CandidatesSha256',
    p_run->>'pass1CalibrationSha256', true, 'blocked', 180
  ) on conflict (config_version, source_issued_at, engine_version, formula_version,
    pass1_candidates_sha256, pass1_calibration_sha256) do nothing
  returning run_id into inserted_run;

  if inserted_run is null then
    select run_id into target_run from public.pier_cast_v3_shadow_forecast_runs
      where config_version = p_run->>'configVersion' and source_issued_at = issue
        and engine_version = p_run->>'engineVersion' and formula_version = p_run->>'formulaVersion'
        and pass1_candidates_sha256 = p_run->>'pass1CandidatesSha256'
        and pass1_calibration_sha256 = p_run->>'pass1CalibrationSha256';
    select count(*) into existing_count from public.pier_cast_v3_shadow_forecasts where run_id = target_run;
    if target_run is null or existing_count <> 180 then raise exception 'existing Formula v3 run is incomplete'; end if;
    return jsonb_build_object('status','already_committed','runId',target_run,'forecastCount',180);
  end if;
  target_run := inserted_run;

  insert into public.pier_cast_v3_shadow_forecasts (
    run_id,city_id,species_id,lead_day,local_date,timezone,assessment_scope,requested_start,
    requested_end,source_id,mode_calibration_id,mode_id,fishery_strength,seasonal_availability,
    seasonal_potential,temperature_curve_id,temperature_minimum_c,temperature_maximum_c,
    temperature_suitability_minimum,temperature_suitability_maximum,coverage_status,
    coverage_fraction,score_status,score,display_score,display_text,rating_label,
    targeting_eligibility,promotion_status,reason_codes
  ) select target_run,item->>'cityId',item->>'speciesId',(item->>'leadDay')::smallint,
    (item->>'localDate')::date,item->>'timezone',item->>'assessmentScope',
    (item->>'requestedStart')::timestamptz,(item->>'requestedEnd')::timestamptz,item->>'sourceId',
    item->>'modeCalibrationId',item->>'modeId',(item->>'fisheryStrength')::double precision,
    (item->>'seasonalAvailability')::double precision,(item->>'seasonalPotential')::double precision,
    item->>'temperatureCurveId',(item->>'temperatureMinimumC')::double precision,
    (item->>'temperatureMaximumC')::double precision,(item->>'temperatureSuitabilityMinimum')::double precision,
    (item->>'temperatureSuitabilityMaximum')::double precision,item->>'coverageStatus',
    (item->>'coverageFraction')::double precision,item->>'scoreStatus',(item->>'score')::double precision,
    (item->>'displayScore')::double precision,nullif(item->>'displayText',''),nullif(item->>'ratingLabel',''),
    item->>'targetingEligibility',item->>'promotionStatus',coalesce(item->'reasonCodes','[]'::jsonb)
  from jsonb_array_elements(p_forecasts) item;

  if (select count(*) <> 180 or count(distinct city_id) <> 9 or count(distinct local_date) <> 5
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
      from public.pier_cast_v3_shadow_forecasts where run_id = target_run)
  then raise exception 'Formula v3 run manifest is incomplete'; end if;
  if exists (select 1 from public.pier_cast_v3_shadow_forecasts where run_id = target_run
    group by city_id, local_date having count(*) <> 4 or count(distinct species_id) <> 4
      or count(distinct lead_day) <> 1)
  then raise exception 'Formula v3 city/date manifest is incomplete'; end if;
  return jsonb_build_object('status','committed','runId',target_run,'forecastCount',180);
end;
$$;

revoke all on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) to service_role;

create or replace view public.pier_cast_v3_shadow_validation_pairs
with (security_invoker = true)
as
select outcome.outcome_id, outcome.city_id, outcome.species_id,
  outcome.local_date, outcome.structure_name, outcome.assessment_status,
  outcome.result, outcome.effort_minutes, outcome.catch_count,
  outcome.source_type, outcome.evidence_quality, forecast.run_id,
  forecast.lead_day, forecast.mode_calibration_id, forecast.mode_id,
  forecast.fishery_strength, forecast.seasonal_availability,
  forecast.seasonal_potential, forecast.temperature_suitability_minimum,
  forecast.temperature_suitability_maximum, forecast.score,
  forecast.display_score, run.generated_at, run.engine_version,
  run.formula_version, run.config_version, run.source_issued_at,
  run.pass1_candidates_sha256, run.pass1_calibration_sha256
from public.pier_cast_shadow_outcomes outcome
join public.pier_cast_v3_shadow_forecasts forecast
  on forecast.city_id = outcome.city_id
 and forecast.species_id = outcome.species_id
 and forecast.local_date = outcome.local_date
join public.pier_cast_v3_shadow_forecast_runs run on run.run_id = forecast.run_id;

revoke all on table public.pier_cast_v3_shadow_validation_pairs
  from public, anon, authenticated;
grant select on table public.pier_cast_v3_shadow_validation_pairs to service_role;

create or replace function public.invoke_pier_cast_v3_shadow_ingestion()
returns bigint
language plpgsql security definer set search_path = public, extensions, vault
as $$
declare project_url text; anon_key text; internal_key text; request_id bigint;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'pier_cast_project_url' limit 1;
  select decrypted_secret into anon_key from vault.decrypted_secrets where name = 'pier_cast_anon_key' limit 1;
  select decrypted_secret into internal_key from vault.decrypted_secrets where name = 'pier_cast_internal_key' limit 1;
  if project_url is null or anon_key is null or internal_key is null then
    raise warning 'Formula v3 shadow ingest skipped: Vault secrets missing'; return null;
  end if;
  select net.http_post(
    url := rtrim(project_url, '/') || '/functions/v1/pier-cast-ingest',
    headers := jsonb_build_object('Content-Type','application/json','apikey',anon_key,
      'Authorization','Bearer ' || anon_key,'x-pier-cast-internal-key',internal_key,
      'x-pier-cast-operation','v3-shadow'),
    body := jsonb_build_object('scheduledAt', timezone('utc', now())), timeout_milliseconds := 55000
  ) into request_id;
  return request_id;
end;
$$;
revoke all on function public.invoke_pier_cast_v3_shadow_ingestion() from public, anon, authenticated;
grant execute on function public.invoke_pier_cast_v3_shadow_ingestion() to service_role;

do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job where jobname = 'pier-cast-v3-shadow-ingestion' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
  perform cron.schedule('pier-cast-v3-shadow-ingestion','50 0,6,12,18 * * *',
    'select public.invoke_pier_cast_v3_shadow_ingestion();');
end;
$$;

comment on table public.pier_cast_v3_shadow_forecast_runs is
  'Private disabled Formula v3 nine-city run ledger; never a production release source.';
comment on table public.pier_cast_v3_shadow_forecasts is
  'Append-only Formula v3 forecasts preserving mode inputs and blocked promotion state.';
