-- Complete the disabled Formula v3 shadow manifest with evidence-admitted
-- secondary species. Production v2, public reads, and leaderboards are not
-- changed. The exact 56-pair manifest remains service-role only and blocked.

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_config_version_check,
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_config_version_check
    check (config_version in (
      'piercast-v3-nine-city-core-four-pass2-v1',
      'piercast-v3-nine-city-secondary-complete-v2'
    )),
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check
    check (forecast_count in (180, 280));

alter table public.pier_cast_v3_shadow_forecasts
  drop constraint if exists pier_cast_v3_shadow_forecasts_species_id_check;
alter table public.pier_cast_v3_shadow_forecasts
  add constraint pier_cast_v3_shadow_forecasts_species_id_check check (species_id in (
    'chinook_salmon','coho_salmon','steelhead','brown_trout','lake_trout','walleye',
    'smallmouth_bass','freshwater_drum','yellow_perch','round_whitefish',
    'channel_catfish','largemouth_bass'
  ));

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text, species_id text)
language sql immutable set search_path = ''
as $$
  select * from (values
    ('ludington_mi','chinook_salmon'),('ludington_mi','coho_salmon'),
    ('ludington_mi','steelhead'),('ludington_mi','brown_trout'),
    ('ludington_mi','lake_trout'),('ludington_mi','smallmouth_bass'),
    ('ludington_mi','freshwater_drum'),('ludington_mi','yellow_perch'),
    ('grand_haven_mi','chinook_salmon'),('grand_haven_mi','coho_salmon'),
    ('grand_haven_mi','steelhead'),('grand_haven_mi','brown_trout'),
    ('grand_haven_mi','lake_trout'),('grand_haven_mi','smallmouth_bass'),
    ('grand_haven_mi','freshwater_drum'),('grand_haven_mi','yellow_perch'),
    ('grand_haven_mi','round_whitefish'),('grand_haven_mi','channel_catfish'),
    ('grand_haven_mi','largemouth_bass'),
    ('manistee_mi','chinook_salmon'),('manistee_mi','coho_salmon'),
    ('manistee_mi','steelhead'),('manistee_mi','brown_trout'),
    ('manistee_mi','lake_trout'),('manistee_mi','walleye'),
    ('manistee_mi','smallmouth_bass'),('manistee_mi','freshwater_drum'),
    ('manistee_mi','yellow_perch'),('manistee_mi','round_whitefish'),
    ('frankfort_elberta_mi','chinook_salmon'),('frankfort_elberta_mi','coho_salmon'),
    ('frankfort_elberta_mi','steelhead'),('frankfort_elberta_mi','brown_trout'),
    ('frankfort_elberta_mi','lake_trout'),
    ('sheboygan_wi','chinook_salmon'),('sheboygan_wi','coho_salmon'),
    ('sheboygan_wi','steelhead'),('sheboygan_wi','brown_trout'),
    ('port_washington_wi','chinook_salmon'),('port_washington_wi','coho_salmon'),
    ('port_washington_wi','steelhead'),('port_washington_wi','brown_trout'),
    ('milwaukee_wi','chinook_salmon'),('milwaukee_wi','coho_salmon'),
    ('milwaukee_wi','steelhead'),('milwaukee_wi','brown_trout'),
    ('racine_wi','chinook_salmon'),('racine_wi','coho_salmon'),
    ('racine_wi','steelhead'),('racine_wi','brown_trout'),
    ('racine_wi','yellow_perch'),
    ('kenosha_wi','chinook_salmon'),('kenosha_wi','coho_salmon'),
    ('kenosha_wi','steelhead'),('kenosha_wi','brown_trout'),
    ('kenosha_wi','yellow_perch')
  ) as expected(city_id, species_id);
$$;
revoke all on function public.piercast_v3_expected_pairs() from public, anon, authenticated;
grant execute on function public.piercast_v3_expected_pairs() to service_role;

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
  if p_run->>'configVersion' <> 'piercast-v3-nine-city-secondary-complete-v2'
     or p_run->>'formulaVersion' <> 'piercast-opportunity-modes-bounded-temperature-v3'
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'promotionStatus' <> 'blocked'
     or p_run->>'pass1CandidatesSha256' !~ '^[a-f0-9]{64}$'
     or p_run->>'pass1CalibrationSha256' !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts) <> 280
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts) item) <> 9
     or (select count(distinct (item->>'cityId', item->>'speciesId'))
           from jsonb_array_elements(p_forecasts) item) <> 56
     or exists (
       select 1 from jsonb_array_elements(p_forecasts) item
       where not exists (
         select 1 from public.piercast_v3_expected_pairs() expected
         where expected.city_id = item->>'cityId'
           and expected.species_id = item->>'speciesId'
       )
       or (item->>'leadDay')::integer not between 0 and 4
       or item->>'promotionStatus' <> 'blocked'
       or nullif(item->>'modeCalibrationId','') is null
       or nullif(item->>'modeId','') is null
     )
  then raise exception 'invalid Formula v3 secondary shadow payload'; end if;

  insert into public.pier_cast_v3_shadow_forecast_runs (
    config_version, generated_at, source_issued_at, source_fetched_at, ingestion_source,
    engine_version, formula_version, pass1_candidates_sha256, pass1_calibration_sha256,
    preview_only, promotion_status, forecast_count
  ) values (
    p_run->>'configVersion', (p_run->>'generatedAt')::timestamptz, issue,
    (p_run->>'sourceFetchedAt')::timestamptz, p_run->>'ingestionSource',
    p_run->>'engineVersion', p_run->>'formulaVersion', p_run->>'pass1CandidatesSha256',
    p_run->>'pass1CalibrationSha256', true, 'blocked', 280
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
    if target_run is null or existing_count <> 280 then raise exception 'existing Formula v3 secondary run is incomplete'; end if;
    return jsonb_build_object('status','already_committed','runId',target_run,'forecastCount',280);
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

  if (select count(*) <> 280 or count(distinct city_id) <> 9 or count(distinct local_date) <> 5
      or count(distinct (city_id, species_id)) <> 56
      or count(*) filter (where lead_day = 0 and assessment_scope <> 'remaining_day') > 0
      or count(*) filter (where lead_day > 0 and assessment_scope <> 'full_day') > 0
      from public.pier_cast_v3_shadow_forecasts where run_id = target_run)
  then raise exception 'Formula v3 secondary run manifest is incomplete'; end if;
  if exists (
    select 1 from public.piercast_v3_expected_pairs() expected
    left join public.pier_cast_v3_shadow_forecasts forecast
      on forecast.run_id = target_run
     and forecast.city_id = expected.city_id
     and forecast.species_id = expected.species_id
    group by expected.city_id, expected.species_id
    having count(forecast.run_id) <> 5 or count(distinct forecast.lead_day) <> 5
  ) then raise exception 'Formula v3 expected pair manifest is incomplete'; end if;
  return jsonb_build_object('status','committed','runId',target_run,'forecastCount',280);
end;
$$;

revoke all on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) to service_role;

comment on function public.piercast_v3_expected_pairs() is
  'Exact private Formula v3 core-plus-secondary calibration manifest; absence is not biological absence.';
