alter table public.pier_cast_shadow_forecast_runs
  add constraint pier_cast_shadow_run_generation_window_check
  check (
    source_fetched_at >= source_issued_at
    and generated_at >= source_issued_at
    and generated_at <= source_issued_at + interval '24 hours'
  );

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
    group by forecast.city_id
    having count(*) <> 20
       or count(distinct forecast.local_date) <> 5
       or count(distinct forecast.lead_day) <> 5
  ) then
    raise exception 'PierCast shadow city must contain five unique lead dates';
  end if;
  if exists (
    select 1
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id
      and forecast.local_date <> (
        select min(city_forecast.local_date) + forecast.lead_day
        from public.pier_cast_shadow_forecasts city_forecast
        where city_forecast.run_id = target_run_id
          and city_forecast.city_id = forecast.city_id
      )
  ) then
    raise exception 'PierCast shadow local dates must be consecutive and match lead day';
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
  incoming_observed_at timestamptz := nullif(p_outcome->>'observedAt', '')::timestamptz;
  incoming_effort_minutes integer := nullif(p_outcome->>'effortMinutes', '')::integer;
  incoming_catch_count integer := nullif(p_outcome->>'catchCount', '')::integer;
  incoming_source_reference text := nullif(p_outcome->>'sourceReference', '');
  incoming_notes text := nullif(p_outcome->>'notes', '');
  existing_outcome public.pier_cast_shadow_outcomes%rowtype;
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
    incoming_observed_at,
    p_outcome->>'assessmentStatus',
    p_outcome->>'result',
    incoming_effort_minutes,
    incoming_catch_count,
    p_outcome->>'sourceType',
    p_outcome->>'evidenceQuality',
    incoming_source_reference,
    incoming_notes
  )
  on conflict (dedupe_key) do nothing
  returning outcome_id into target_outcome_id;

  if target_outcome_id is not null then
    was_inserted := true;
  else
    select * into existing_outcome
    from public.pier_cast_shadow_outcomes
    where dedupe_key = p_outcome->>'dedupeKey';
    if existing_outcome.outcome_id is null
       or existing_outcome.city_id is distinct from p_outcome->>'cityId'
       or existing_outcome.species_id is distinct from p_outcome->>'speciesId'
       or existing_outcome.local_date is distinct from (p_outcome->>'localDate')::date
       or existing_outcome.structure_name is distinct from p_outcome->>'structureName'
       or existing_outcome.observed_at is distinct from incoming_observed_at
       or existing_outcome.assessment_status is distinct from p_outcome->>'assessmentStatus'
       or existing_outcome.result is distinct from p_outcome->>'result'
       or existing_outcome.effort_minutes is distinct from incoming_effort_minutes
       or existing_outcome.catch_count is distinct from incoming_catch_count
       or existing_outcome.source_type is distinct from p_outcome->>'sourceType'
       or existing_outcome.evidence_quality is distinct from p_outcome->>'evidenceQuality'
       or existing_outcome.source_reference is distinct from incoming_source_reference
       or existing_outcome.notes is distinct from incoming_notes then
      raise exception 'PierCast shadow outcome dedupe key conflicts with existing content';
    end if;
    target_outcome_id := existing_outcome.outcome_id;
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
