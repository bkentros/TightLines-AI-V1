begin;

-- Forward-only correction for the already-applied V11 migration. The first
-- private ledger attempt exposed three retained V10 count guards; PostgreSQL
-- rolled that call back, so no partial V11 run was committed.
create or replace function public.commit_pier_cast_v3_shadow_forecast(
  p_run jsonb,
  p_forecasts jsonb
) returns jsonb
language plpgsql
security definer
set search_path=''
as $$
declare
  target_run uuid;
  inserted_run uuid;
  issue timestamptz := (p_run->>'sourceIssuedAt')::timestamptz;
  existing_count integer;
begin
  if auth.role()<>'service_role' then
    raise exception 'service_role required';
  end if;
  if p_run->>'configVersion'<>'piercast-v3-thirty-two-city-pentwater-caseville-pass3-v11'
     or p_run->>'engineVersion'<>'pier-cast-opportunity-modes-v3-shadow-v1.9.0'
     or p_run->>'formulaVersion'<>'piercast-opportunity-modes-bounded-temperature-v3'
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'promotionStatus'<>'blocked'
     or p_run->>'pass1CandidatesSha256' !~ '^[a-f0-9]{64}$'
     or p_run->>'pass1CalibrationSha256' !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts)<>1255
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts)item)<>32
     or (select count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>251
     or exists(
       select 1 from jsonb_array_elements(p_forecasts)item
       where not exists(
         select 1 from public.piercast_v3_expected_pairs() expected
         where expected.city_id=item->>'cityId'
           and expected.species_id=item->>'speciesId'
       )
       or (item->>'leadDay')::integer not between 0 and 4
       or item->>'promotionStatus'<>'blocked'
       or nullif(item->>'modeCalibrationId','') is null
       or nullif(item->>'modeId','') is null
     )
  then
    raise exception 'invalid Formula v3 pentwater-caseville-pass3 shadow payload';
  end if;

  insert into public.pier_cast_v3_shadow_forecast_runs(
    config_version,generated_at,source_issued_at,source_fetched_at,
    ingestion_source,engine_version,formula_version,pass1_candidates_sha256,
    pass1_calibration_sha256,preview_only,promotion_status,forecast_count
  ) values (
    p_run->>'configVersion',(p_run->>'generatedAt')::timestamptz,issue,
    (p_run->>'sourceFetchedAt')::timestamptz,p_run->>'ingestionSource',
    p_run->>'engineVersion',p_run->>'formulaVersion',
    p_run->>'pass1CandidatesSha256',p_run->>'pass1CalibrationSha256',
    true,'blocked',1255
  )
  on conflict(
    config_version,source_issued_at,engine_version,formula_version,
    pass1_candidates_sha256,pass1_calibration_sha256
  ) do nothing returning run_id into inserted_run;

  if inserted_run is null then
    select run_id into target_run
    from public.pier_cast_v3_shadow_forecast_runs
    where config_version=p_run->>'configVersion'
      and source_issued_at=issue
      and engine_version=p_run->>'engineVersion'
      and formula_version=p_run->>'formulaVersion'
      and pass1_candidates_sha256=p_run->>'pass1CandidatesSha256'
      and pass1_calibration_sha256=p_run->>'pass1CalibrationSha256';
    select count(*) into existing_count
    from public.pier_cast_v3_shadow_forecasts
    where run_id=target_run;
    if target_run is null or existing_count<>1255 then
      raise exception 'existing Formula v3 pentwater-caseville-pass3 run is incomplete';
    end if;
    return jsonb_build_object(
      'status','already_committed','runId',target_run,'forecastCount',1255
    );
  end if;

  target_run:=inserted_run;
  insert into public.pier_cast_v3_shadow_forecasts(
    run_id,city_id,species_id,lead_day,local_date,timezone,assessment_scope,
    requested_start,requested_end,source_id,mode_calibration_id,mode_id,
    fishery_strength,seasonal_availability,seasonal_potential,
    temperature_curve_id,temperature_minimum_c,temperature_maximum_c,
    temperature_suitability_minimum,temperature_suitability_maximum,
    coverage_status,coverage_fraction,score_status,score,display_score,
    display_text,rating_label,targeting_eligibility,promotion_status,reason_codes
  )
  select
    target_run,item->>'cityId',item->>'speciesId',
    (item->>'leadDay')::smallint,(item->>'localDate')::date,item->>'timezone',
    item->>'assessmentScope',(item->>'requestedStart')::timestamptz,
    (item->>'requestedEnd')::timestamptz,item->>'sourceId',
    item->>'modeCalibrationId',item->>'modeId',
    (item->>'fisheryStrength')::double precision,
    (item->>'seasonalAvailability')::double precision,
    (item->>'seasonalPotential')::double precision,item->>'temperatureCurveId',
    (item->>'temperatureMinimumC')::double precision,
    (item->>'temperatureMaximumC')::double precision,
    (item->>'temperatureSuitabilityMinimum')::double precision,
    (item->>'temperatureSuitabilityMaximum')::double precision,
    item->>'coverageStatus',(item->>'coverageFraction')::double precision,
    item->>'scoreStatus',(item->>'score')::double precision,
    (item->>'displayScore')::double precision,nullif(item->>'displayText',''),
    nullif(item->>'ratingLabel',''),item->>'targetingEligibility',
    item->>'promotionStatus',coalesce(item->'reasonCodes','[]'::jsonb)
  from jsonb_array_elements(p_forecasts)item;

  if (
    select count(*)<>1255
      or count(distinct city_id)<>32
      or count(distinct local_date)<>5
      or count(distinct(city_id,species_id))<>251
      or count(*) filter(where lead_day=0 and assessment_scope<>'remaining_day')>0
      or count(*) filter(where lead_day>0 and assessment_scope<>'full_day')>0
    from public.pier_cast_v3_shadow_forecasts
    where run_id=target_run
  ) then
    raise exception 'Formula v3 pentwater-caseville-pass3 run manifest is incomplete';
  end if;

  if exists(
    select 1
    from public.piercast_v3_expected_pairs() expected
    left join public.pier_cast_v3_shadow_forecasts forecast
      on forecast.run_id=target_run
      and forecast.city_id=expected.city_id
      and forecast.species_id=expected.species_id
    group by expected.city_id,expected.species_id
    having count(forecast.run_id)<>5 or count(distinct forecast.lead_day)<>5
  ) then
    raise exception 'Formula v3 expected pair manifest is incomplete';
  end if;

  return jsonb_build_object(
    'status','committed','runId',target_run,'forecastCount',1255
  );
end;
$$;

comment on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) is
  'Exact private Formula v3 32-city, 251-pair, 1255-row V11 commit gate. Historical configurations remain readable.';

commit;
