-- Versioned private rosters. Historical rows and first-write daily locks are preserved.
create or replace function public.pier_cast_private_roster(p_city text, p_version text)
returns text[] language plpgsql immutable set search_path = '' as $$
declare result text[] := array['chinook_salmon','coho_salmon','steelhead','brown_trout'];
begin
  if p_city not in ('ludington_mi','grand_haven_mi','manistee_mi','frankfort_elberta_mi','sheboygan_wi') or p_city is null then raise exception 'unknown PierCast city'; end if;
  if p_version = 'piercast-five-city-four-species-v1' then return result; end if;
  if p_version is distinct from 'piercast-private-roster-v2-2026-09-12' then raise exception 'unknown PierCast roster'; end if;
  if p_city = 'ludington_mi' then result := result || array['smallmouth_bass','yellow_perch']; end if;
  if p_city = 'grand_haven_mi' then result := result || array['freshwater_drum','largemouth_bass']; end if;
  if p_city = 'manistee_mi' then result := result || array['lake_trout','freshwater_drum','yellow_perch']; end if;
  return result;
end; $$;
revoke all on function public.pier_cast_private_roster(text,text) from public,anon,authenticated;
grant execute on function public.pier_cast_private_roster(text,text) to service_role;
alter table public.pier_cast_shadow_forecasts drop constraint pier_cast_shadow_forecasts_species_id_check;
alter table public.pier_cast_shadow_forecasts add constraint pier_cast_shadow_forecasts_species_id_check check (species_id = any(public.pier_cast_private_roster(city_id, 'piercast-private-roster-v2-2026-09-12')));
alter table public.pier_cast_shadow_outcomes drop constraint pier_cast_shadow_outcomes_species_id_check;
alter table public.pier_cast_shadow_outcomes add constraint pier_cast_shadow_outcomes_species_id_check check (species_id = any(public.pier_cast_private_roster(city_id, 'piercast-private-roster-v2-2026-09-12')));
alter table public.pier_cast_shadow_forecast_runs drop constraint pier_cast_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_shadow_forecast_runs add constraint pier_cast_shadow_forecast_runs_forecast_count_check check (forecast_count in (100,135));
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
  roster_version text := coalesce(p_run->>'speciesRosterVersion', 'piercast-five-city-four-species-v1');
  expected_count integer;

begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  perform public.pier_cast_private_roster('ludington_mi', roster_version);
  expected_count := case when roster_version = 'piercast-five-city-four-species-v1' then 100 else 135 end;
  if jsonb_typeof(p_run) is distinct from 'object'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> expected_count
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

  if exists (select 1 from jsonb_array_elements(p_forecasts) item where not (item->>'speciesId' = any(public.pier_cast_private_roster(item->>'cityId', roster_version)))) then raise exception 'species outside versioned city roster'; end if;

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
    expected_count
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
    if target_run_id is null or existing_count <> expected_count then
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
    select count(*) <> expected_count
      or count(distinct city_id) <> 5
      or count(distinct (city_id, local_date)) <> 25
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id
  ) then
    raise exception 'PierCast shadow run must contain five dates and the versioned roster for all five cities';
  end if;
  if exists (
    select 1
    from public.pier_cast_shadow_forecasts forecast
    where forecast.run_id = target_run_id
    group by forecast.city_id, forecast.local_date
    having count(*) <> cardinality(public.pier_cast_private_roster(forecast.city_id, roster_version)) or count(distinct forecast.lead_day) <> 1
  ) then
    raise exception 'PierCast shadow date must contain the versioned roster at one lead day';
  end if;

  return jsonb_build_object(
    'status', 'committed',
    'runId', target_run_id,
    'forecastCount', expected_count
  );
end;
$$;

create or replace function public.commit_pier_cast_daily_score_snapshot(
  p_snapshot jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  incoming_lake_date date;
  incoming_set_at timestamptz;
  incoming_publish_at timestamptz;
  incoming_source_issued_at timestamptz;
  incoming_source_fetched_at timestamptz;
  roster_version text := coalesce(p_snapshot->>'speciesRosterVersion','piercast-five-city-four-species-v1');
  valid_city_count integer;
  unique_city_count integer;
  inserted_lake_date date;
  stored public.pier_cast_daily_score_snapshots%rowtype;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if jsonb_typeof(p_snapshot) is distinct from 'object'
     or p_snapshot->>'status' is distinct from 'locked_daily_snapshot'
     or p_snapshot->>'scoreTimezone' is distinct from 'America/Chicago'
     or jsonb_typeof(p_snapshot->'cities') is distinct from 'array'
     or jsonb_array_length(p_snapshot->'cities') <> 5 then
    raise exception 'invalid PierCast daily score snapshot';
  end if;

  incoming_lake_date := (p_snapshot->>'lakeDate')::date;
  incoming_set_at := (p_snapshot->>'setAt')::timestamptz;
  incoming_publish_at := (p_snapshot->>'publishAt')::timestamptz;
  incoming_source_issued_at := (p_snapshot->'source'->>'issuedAt')::timestamptz;
  incoming_source_fetched_at := (p_snapshot->'source'->>'fetchedAt')::timestamptz;

  if incoming_publish_at <> (
       incoming_lake_date::timestamp at time zone 'America/Chicago'
     )
     or incoming_source_fetched_at < incoming_source_issued_at
     or nullif(btrim(p_snapshot->>'engineVersion'), '') is null
     or nullif(btrim(p_snapshot->>'formulaVersion'), '') is null
     or nullif(btrim(p_snapshot->>'rubricVersion'), '') is null
     or nullif(btrim(p_snapshot->>'seasonalCalibrationVersion'), '') is null
     or nullif(btrim(p_snapshot->>'temperatureCalibrationVersion'), '') is null then
    raise exception 'invalid PierCast daily score snapshot metadata';
  end if;

  if not exists (
    select 1
    from public.pier_cast_temperature_cycles cycle
    where cycle.issued_at = incoming_source_issued_at
      and cycle.source_status = 'complete'
  ) then
    raise exception 'PierCast daily score snapshot requires a complete archived cycle';
  end if;

  select
    count(*) filter (
      where item->>'cityId' in (
        'ludington_mi',
        'grand_haven_mi',
        'manistee_mi',
        'frankfort_elberta_mi',
        'sheboygan_wi'
      )
      and item->'date'->>'localDate' = incoming_lake_date::text
      and item->'date'->>'scope' = 'full_day'
      and item->'date'->'headline'->'overall'->>'status' = 'available'
      and jsonb_typeof(item->'date'->'species') = 'array'
      and (select array_agg(s->>'speciesId' order by s->>'speciesId') from jsonb_array_elements(item->'date'->'species') s) = (select array_agg(id order by id) from unnest(public.pier_cast_private_roster(item->>'cityId', roster_version)) id)
      and not exists (select 1 from jsonb_array_elements(item->'date'->'species') s where s->'biological'->>'status' is distinct from 'available' or s->'coverage'->>'status' is distinct from 'complete')
    ),
    count(distinct item->>'cityId')
  into valid_city_count, unique_city_count
  from jsonb_array_elements(p_snapshot->'cities') item;

  if valid_city_count <> 5 or unique_city_count <> 5 then
    raise exception 'PierCast daily score snapshot requires five complete unique cities';
  end if;

  insert into public.pier_cast_daily_score_snapshots (
    lake_date,
    set_at,
    publish_at,
    source_issued_at,
    source_fetched_at,
    engine_version,
    formula_version,
    rubric_version,
    seasonal_calibration_version,
    temperature_calibration_version,
    snapshot
  ) values (
    incoming_lake_date,
    incoming_set_at,
    incoming_publish_at,
    incoming_source_issued_at,
    incoming_source_fetched_at,
    p_snapshot->>'engineVersion',
    p_snapshot->>'formulaVersion',
    p_snapshot->>'rubricVersion',
    p_snapshot->>'seasonalCalibrationVersion',
    p_snapshot->>'temperatureCalibrationVersion',
    p_snapshot
  )
  on conflict (lake_date) do nothing
  returning lake_date into inserted_lake_date;

  select * into stored
  from public.pier_cast_daily_score_snapshots
  where lake_date = incoming_lake_date;

  if stored.lake_date is null then
    raise exception 'PierCast daily score snapshot commit failed';
  end if;

  return jsonb_build_object(
    'status', case when inserted_lake_date is null
      then 'already_committed' else 'committed' end,
    'lakeDate', stored.lake_date,
    'setAt', stored.set_at,
    'publishAt', stored.publish_at,
    'cityCount', jsonb_array_length(stored.snapshot->'cities')
  );
end;
$$;
