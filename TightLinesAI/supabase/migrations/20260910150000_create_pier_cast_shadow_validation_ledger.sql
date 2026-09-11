create table if not exists public.pier_cast_shadow_forecast_runs (
  run_id uuid primary key default gen_random_uuid(),
  generated_at timestamptz not null,
  source_issued_at timestamptz not null
    references public.pier_cast_temperature_cycles(issued_at) on delete restrict,
  source_fetched_at timestamptz not null,
  ingestion_source text not null check (ingestion_source in (
    'live_lmhofs',
    'fresh_archived_complete_cycle'
  )),
  engine_version text not null check (char_length(engine_version) between 1 and 100),
  formula_version text not null check (char_length(formula_version) between 1 and 100),
  rubric_version text not null check (char_length(rubric_version) between 1 and 100),
  seasonal_calibration_version text not null
    check (char_length(seasonal_calibration_version) between 1 and 100),
  temperature_calibration_version text not null
    check (char_length(temperature_calibration_version) between 1 and 100),
  preview_only boolean not null check (preview_only = true),
  forecast_count smallint not null check (forecast_count = 100),
  created_at timestamptz not null default timezone('utc', now()),
  unique (
    source_issued_at,
    engine_version,
    formula_version,
    seasonal_calibration_version,
    temperature_calibration_version
  )
);

create table if not exists public.pier_cast_shadow_forecasts (
  run_id uuid not null
    references public.pier_cast_shadow_forecast_runs(run_id) on delete restrict,
  city_id text not null check (city_id in (
    'ludington_mi',
    'grand_haven_mi',
    'manistee_mi',
    'frankfort_elberta_mi',
    'sheboygan_wi'
  )),
  species_id text not null check (species_id in (
    'chinook_salmon',
    'coho_salmon',
    'steelhead',
    'brown_trout'
  )),
  lead_day smallint not null check (lead_day between 0 and 4),
  local_date date not null,
  timezone text not null check (timezone in ('America/Detroit', 'America/Chicago')),
  assessment_scope text not null check (assessment_scope in ('remaining_day', 'full_day')),
  requested_start timestamptz not null,
  requested_end timestamptz not null,
  open_water_notice_applies boolean not null,
  representation_decision text not null
    check (representation_decision = 'blocked_insufficient_evidence'),
  source_id text not null,
  seasonal_curve_id text,
  temperature_curve_id text,
  seasonal_rating double precision check (seasonal_rating between 1 and 10),
  temperature_minimum_c double precision check (temperature_minimum_c between -2 and 40),
  temperature_maximum_c double precision check (temperature_maximum_c between -2 and 40),
  temperature_suitability_minimum double precision
    check (temperature_suitability_minimum between 0 and 1),
  temperature_suitability_maximum double precision
    check (temperature_suitability_maximum between 0 and 1),
  coverage_status text not null check (coverage_status in ('complete', 'partial', 'none')),
  coverage_fraction double precision not null check (coverage_fraction between 0 and 1),
  score_status text not null check (score_status in ('available', 'unavailable')),
  score double precision check (score between 1 and 10),
  display_score double precision check (display_score between 1 and 10),
  display_text text,
  rating_label text check (rating_label in ('Poor', 'Limited', 'Fair', 'Good', 'Excellent')),
  targeting_eligibility text not null
    check (targeting_eligibility in ('eligible', 'restricted', 'unknown')),
  promotion_status text not null
    check (promotion_status in ('eligible', 'limited', 'blocked', 'unknown')),
  reason_codes jsonb not null default '[]'::jsonb check (jsonb_typeof(reason_codes) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (run_id, city_id, local_date, species_id),
  check (requested_end > requested_start),
  check (
    (temperature_minimum_c is null and temperature_maximum_c is null)
    or (
      temperature_minimum_c is not null
      and temperature_maximum_c is not null
      and temperature_minimum_c <= temperature_maximum_c
    )
  ),
  check (
    (temperature_suitability_minimum is null and temperature_suitability_maximum is null)
    or (
      temperature_suitability_minimum is not null
      and temperature_suitability_maximum is not null
      and temperature_suitability_minimum <= temperature_suitability_maximum
    )
  ),
  check (
    (score_status = 'available'
      and score is not null
      and display_score is not null
      and display_text is not null
      and rating_label is not null)
    or
    (score_status = 'unavailable'
      and score is null
      and display_score is null
      and display_text is null
      and rating_label is null)
  )
);

create index if not exists pier_cast_shadow_forecasts_lookup_idx
  on public.pier_cast_shadow_forecasts(city_id, local_date, species_id, lead_day);

create table if not exists public.pier_cast_shadow_outcomes (
  outcome_id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique check (char_length(dedupe_key) between 8 and 200),
  city_id text not null check (city_id in (
    'ludington_mi',
    'grand_haven_mi',
    'manistee_mi',
    'frankfort_elberta_mi',
    'sheboygan_wi'
  )),
  species_id text not null check (species_id in (
    'chinook_salmon',
    'coho_salmon',
    'steelhead',
    'brown_trout'
  )),
  local_date date not null,
  structure_name text not null check (char_length(structure_name) between 1 and 200),
  observed_at timestamptz,
  assessment_status text not null check (assessment_status in (
    'assessable',
    'not_assessable_access',
    'not_assessable_conditions',
    'insufficient_evidence'
  )),
  result text not null check (result in ('positive', 'zero_catch', 'unknown')),
  effort_minutes integer check (effort_minutes between 1 and 1440),
  catch_count integer check (catch_count between 0 and 1000),
  source_type text not null check (source_type in (
    'owner_trip',
    'verified_pier_report',
    'agency_creel',
    'other_documented'
  )),
  evidence_quality text not null check (evidence_quality in (
    'direct_effort',
    'verified_quantitative',
    'verified_qualitative'
  )),
  source_reference text check (source_reference is null or char_length(source_reference) <= 1000),
  notes text check (notes is null or char_length(notes) <= 2000),
  created_at timestamptz not null default timezone('utc', now()),
  check (
    (assessment_status = 'assessable' and result in ('positive', 'zero_catch'))
    or (assessment_status <> 'assessable' and result = 'unknown')
  ),
  check (
    (result = 'positive' and catch_count is not null and catch_count >= 1)
    or (result = 'zero_catch' and catch_count = 0 and effort_minutes is not null)
    or (result = 'unknown' and catch_count is null)
  ),
  check (
    source_type = 'owner_trip'
    or (source_reference is not null and char_length(btrim(source_reference)) > 0)
  )
);

create index if not exists pier_cast_shadow_outcomes_lookup_idx
  on public.pier_cast_shadow_outcomes(city_id, local_date, species_id);

alter table public.pier_cast_shadow_forecast_runs enable row level security;
alter table public.pier_cast_shadow_forecasts enable row level security;
alter table public.pier_cast_shadow_outcomes enable row level security;

drop policy if exists "pier_cast_shadow_forecast_runs_service_role_select"
  on public.pier_cast_shadow_forecast_runs;
create policy "pier_cast_shadow_forecast_runs_service_role_select"
  on public.pier_cast_shadow_forecast_runs for select to service_role using (true);

drop policy if exists "pier_cast_shadow_forecasts_service_role_select"
  on public.pier_cast_shadow_forecasts;
create policy "pier_cast_shadow_forecasts_service_role_select"
  on public.pier_cast_shadow_forecasts for select to service_role using (true);

drop policy if exists "pier_cast_shadow_outcomes_service_role_select"
  on public.pier_cast_shadow_outcomes;
create policy "pier_cast_shadow_outcomes_service_role_select"
  on public.pier_cast_shadow_outcomes for select to service_role using (true);

revoke all on table public.pier_cast_shadow_forecast_runs from public, anon, authenticated;
revoke all on table public.pier_cast_shadow_forecasts from public, anon, authenticated;
revoke all on table public.pier_cast_shadow_outcomes from public, anon, authenticated;
grant select on table public.pier_cast_shadow_forecast_runs to service_role;
grant select on table public.pier_cast_shadow_forecasts to service_role;
grant select on table public.pier_cast_shadow_outcomes to service_role;

create or replace function public.commit_pier_cast_shadow_forecast(
  p_run jsonb,
  p_forecasts jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_run_id uuid;
  inserted_run_id uuid;
  source_issue timestamptz := (p_run->>'sourceIssuedAt')::timestamptz;
  existing_count integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if jsonb_typeof(p_run) is distinct from 'object'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> 100
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'ingestionSource' not in ('live_lmhofs', 'fresh_archived_complete_cycle') then
    raise exception 'invalid PierCast shadow forecast payload';
  end if;
  if not exists (
    select 1 from public.pier_cast_temperature_cycles cycle
    where cycle.issued_at = source_issue and cycle.source_status = 'complete'
  ) then
    raise exception 'PierCast shadow forecast requires an archived complete temperature cycle';
  end if;

  insert into public.pier_cast_shadow_forecast_runs (
    generated_at,
    source_issued_at,
    source_fetched_at,
    ingestion_source,
    engine_version,
    formula_version,
    rubric_version,
    seasonal_calibration_version,
    temperature_calibration_version,
    preview_only,
    forecast_count
  ) values (
    (p_run->>'generatedAt')::timestamptz,
    source_issue,
    (p_run->>'sourceFetchedAt')::timestamptz,
    p_run->>'ingestionSource',
    p_run->>'engineVersion',
    p_run->>'formulaVersion',
    p_run->>'rubricVersion',
    p_run->>'seasonalCalibrationVersion',
    p_run->>'temperatureCalibrationVersion',
    true,
    100
  )
  on conflict (
    source_issued_at,
    engine_version,
    formula_version,
    seasonal_calibration_version,
    temperature_calibration_version
  ) do nothing
  returning run_id into inserted_run_id;

  if inserted_run_id is null then
    select run_id into target_run_id
    from public.pier_cast_shadow_forecast_runs
    where source_issued_at = source_issue
      and engine_version = p_run->>'engineVersion'
      and formula_version = p_run->>'formulaVersion'
      and seasonal_calibration_version = p_run->>'seasonalCalibrationVersion'
      and temperature_calibration_version = p_run->>'temperatureCalibrationVersion';

    select count(*) into existing_count
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id;
    if target_run_id is null or existing_count <> 100 then
      raise exception 'existing PierCast shadow run is incomplete';
    end if;
    return jsonb_build_object(
      'status', 'already_committed',
      'runId', target_run_id,
      'forecastCount', existing_count
    );
  end if;
  target_run_id := inserted_run_id;

  insert into public.pier_cast_shadow_forecasts (
    run_id,
    city_id,
    species_id,
    lead_day,
    local_date,
    timezone,
    assessment_scope,
    requested_start,
    requested_end,
    open_water_notice_applies,
    representation_decision,
    source_id,
    seasonal_curve_id,
    temperature_curve_id,
    seasonal_rating,
    temperature_minimum_c,
    temperature_maximum_c,
    temperature_suitability_minimum,
    temperature_suitability_maximum,
    coverage_status,
    coverage_fraction,
    score_status,
    score,
    display_score,
    display_text,
    rating_label,
    targeting_eligibility,
    promotion_status,
    reason_codes
  )
  select
    target_run_id,
    item->>'cityId',
    item->>'speciesId',
    (item->>'leadDay')::smallint,
    (item->>'localDate')::date,
    item->>'timezone',
    item->>'assessmentScope',
    (item->>'requestedStart')::timestamptz,
    (item->>'requestedEnd')::timestamptz,
    (item->>'openWaterNoticeApplies')::boolean,
    item->>'representationDecision',
    item->>'sourceId',
    nullif(item->>'seasonalCurveId', ''),
    nullif(item->>'temperatureCurveId', ''),
    (item->>'seasonalRating')::double precision,
    (item->>'temperatureMinimumC')::double precision,
    (item->>'temperatureMaximumC')::double precision,
    (item->>'temperatureSuitabilityMinimum')::double precision,
    (item->>'temperatureSuitabilityMaximum')::double precision,
    item->>'coverageStatus',
    (item->>'coverageFraction')::double precision,
    item->>'scoreStatus',
    (item->>'score')::double precision,
    (item->>'displayScore')::double precision,
    nullif(item->>'displayText', ''),
    nullif(item->>'ratingLabel', ''),
    item->>'targetingEligibility',
    item->>'promotionStatus',
    coalesce(item->'reasonCodes', '[]'::jsonb)
  from jsonb_array_elements(p_forecasts) item;

  if (
    select count(*) <> 100
      or count(distinct city_id) <> 5
      or count(distinct (city_id, local_date)) <> 25
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id
  ) then
    raise exception 'PierCast shadow run must contain five dates and four species for all five cities';
  end if;
  if exists (
    select 1
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id
    group by forecast.city_id, forecast.local_date
    having count(*) <> 4 or count(distinct forecast.lead_day) <> 1
  ) then
    raise exception 'PierCast shadow date must contain exactly four species at one lead day';
  end if;

  return jsonb_build_object(
    'status', 'committed',
    'runId', target_run_id,
    'forecastCount', 100
  );
end;
$$;

revoke all on function public.commit_pier_cast_shadow_forecast(jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_shadow_forecast(jsonb, jsonb)
  to service_role;

create or replace function public.record_pier_cast_shadow_outcome(
  p_outcome jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_outcome_id uuid;
  was_inserted boolean := false;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if jsonb_typeof(p_outcome) is distinct from 'object' then
    raise exception 'invalid PierCast shadow outcome payload';
  end if;

  insert into public.pier_cast_shadow_outcomes (
    dedupe_key,
    city_id,
    species_id,
    local_date,
    structure_name,
    observed_at,
    assessment_status,
    result,
    effort_minutes,
    catch_count,
    source_type,
    evidence_quality,
    source_reference,
    notes
  ) values (
    p_outcome->>'dedupeKey',
    p_outcome->>'cityId',
    p_outcome->>'speciesId',
    (p_outcome->>'localDate')::date,
    p_outcome->>'structureName',
    (p_outcome->>'observedAt')::timestamptz,
    p_outcome->>'assessmentStatus',
    p_outcome->>'result',
    (p_outcome->>'effortMinutes')::integer,
    (p_outcome->>'catchCount')::integer,
    p_outcome->>'sourceType',
    p_outcome->>'evidenceQuality',
    nullif(p_outcome->>'sourceReference', ''),
    nullif(p_outcome->>'notes', '')
  )
  on conflict (dedupe_key) do nothing
  returning outcome_id into target_outcome_id;

  if target_outcome_id is not null then
    was_inserted := true;
  else
    select outcome_id into target_outcome_id
    from public.pier_cast_shadow_outcomes
    where dedupe_key = p_outcome->>'dedupeKey';
  end if;

  return jsonb_build_object(
    'status', case when was_inserted then 'committed' else 'already_committed' end,
    'outcomeId', target_outcome_id
  );
end;
$$;

revoke all on function public.record_pier_cast_shadow_outcome(jsonb)
  from public, anon, authenticated;
grant execute on function public.record_pier_cast_shadow_outcome(jsonb)
  to service_role;

create or replace view public.pier_cast_shadow_validation_pairs
with (security_invoker = true)
as
select
  outcome.outcome_id,
  outcome.city_id,
  outcome.species_id,
  outcome.local_date,
  outcome.structure_name,
  outcome.assessment_status,
  outcome.result,
  outcome.effort_minutes,
  outcome.catch_count,
  outcome.source_type,
  outcome.evidence_quality,
  forecast.run_id,
  forecast.lead_day,
  forecast.seasonal_rating,
  forecast.temperature_suitability_minimum,
  forecast.temperature_suitability_maximum,
  forecast.score,
  forecast.display_score,
  run.generated_at,
  run.engine_version,
  run.formula_version,
  run.seasonal_calibration_version,
  run.temperature_calibration_version,
  run.source_issued_at
from public.pier_cast_shadow_outcomes outcome
join public.pier_cast_shadow_forecasts forecast
  on forecast.city_id = outcome.city_id
 and forecast.species_id = outcome.species_id
 and forecast.local_date = outcome.local_date
join public.pier_cast_shadow_forecast_runs run on run.run_id = forecast.run_id;

revoke all on table public.pier_cast_shadow_validation_pairs
  from public, anon, authenticated;
grant select on table public.pier_cast_shadow_validation_pairs to service_role;

comment on table public.pier_cast_shadow_forecast_runs is
  'Private immutable PierCast forecast-run ledger for prospective validation; never a public rating source.';
comment on table public.pier_cast_shadow_forecasts is
  'Private disabled-preview forecasts linked to an archived LMHOFS cycle for exact retrospective reconstruction.';
comment on table public.pier_cast_shadow_outcomes is
  'Private append-only structured outcomes; zero-catch records require explicit effort and inaccessible days remain unknown.';
