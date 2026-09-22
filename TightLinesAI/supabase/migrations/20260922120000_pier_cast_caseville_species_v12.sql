begin;

-- Forward-only Caseville species correction. V11 remains immutable and
-- readable; V12 adds three conservatively calibrated Caseville salmonids.
alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_forecast_count_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_forecast_count_check
    check(forecast_count in (180,280,350,470,590,845,865,1110,1255,1270));

alter table public.pier_cast_v3_shadow_forecast_runs
  drop constraint if exists pier_cast_v3_shadow_forecast_runs_config_version_check;
alter table public.pier_cast_v3_shadow_forecast_runs
  add constraint pier_cast_v3_shadow_forecast_runs_config_version_check check (
    config_version in (
      'piercast-v3-nine-city-core-four-pass2-v1',
      'piercast-v3-nine-city-secondary-complete-v2',
      'piercast-v3-twelve-city-lake-huron-v3',
      'piercast-v3-twelve-city-species-expansion-v4',
      'piercast-v3-twelve-city-seasonal-research-v5',
      'piercast-v3-twelve-city-common-species-audit-v6',
      'piercast-v3-seventeen-city-five-city-pass3-v7',
      'piercast-v3-twenty-two-city-chicago-alpena-pass3-v8',
      'piercast-v3-twenty-two-city-chicago-alpena-pass3-v9',
      'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10',
      'piercast-v3-thirty-two-city-pentwater-caseville-pass3-v11',
      'piercast-v3-thirty-two-city-caseville-species-v12'
    )
  );

create or replace function public.piercast_v3_expected_pairs()
returns table(city_id text,species_id text) language sql immutable set search_path=''
as $$ select * from (values
    ('ludington_mi','chinook_salmon'),
    ('ludington_mi','coho_salmon'),
    ('ludington_mi','steelhead'),
    ('ludington_mi','brown_trout'),
    ('grand_haven_mi','chinook_salmon'),
    ('grand_haven_mi','coho_salmon'),
    ('grand_haven_mi','steelhead'),
    ('grand_haven_mi','brown_trout'),
    ('manistee_mi','chinook_salmon'),
    ('manistee_mi','coho_salmon'),
    ('manistee_mi','steelhead'),
    ('manistee_mi','brown_trout'),
    ('frankfort_elberta_mi','chinook_salmon'),
    ('frankfort_elberta_mi','coho_salmon'),
    ('frankfort_elberta_mi','steelhead'),
    ('frankfort_elberta_mi','brown_trout'),
    ('sheboygan_wi','chinook_salmon'),
    ('sheboygan_wi','coho_salmon'),
    ('sheboygan_wi','steelhead'),
    ('sheboygan_wi','brown_trout'),
    ('port_washington_wi','chinook_salmon'),
    ('port_washington_wi','coho_salmon'),
    ('port_washington_wi','steelhead'),
    ('port_washington_wi','brown_trout'),
    ('milwaukee_wi','chinook_salmon'),
    ('milwaukee_wi','coho_salmon'),
    ('milwaukee_wi','steelhead'),
    ('milwaukee_wi','brown_trout'),
    ('racine_wi','chinook_salmon'),
    ('racine_wi','coho_salmon'),
    ('racine_wi','steelhead'),
    ('racine_wi','brown_trout'),
    ('kenosha_wi','chinook_salmon'),
    ('kenosha_wi','coho_salmon'),
    ('kenosha_wi','steelhead'),
    ('kenosha_wi','brown_trout'),
    ('ludington_mi','lake_trout'),
    ('ludington_mi','smallmouth_bass'),
    ('ludington_mi','freshwater_drum'),
    ('ludington_mi','yellow_perch'),
    ('grand_haven_mi','lake_trout'),
    ('grand_haven_mi','smallmouth_bass'),
    ('grand_haven_mi','freshwater_drum'),
    ('grand_haven_mi','yellow_perch'),
    ('grand_haven_mi','round_whitefish'),
    ('grand_haven_mi','channel_catfish'),
    ('grand_haven_mi','largemouth_bass'),
    ('manistee_mi','lake_trout'),
    ('manistee_mi','walleye'),
    ('manistee_mi','smallmouth_bass'),
    ('manistee_mi','freshwater_drum'),
    ('manistee_mi','yellow_perch'),
    ('manistee_mi','round_whitefish'),
    ('frankfort_elberta_mi','lake_trout'),
    ('racine_wi','yellow_perch'),
    ('kenosha_wi','yellow_perch'),
    ('harbor_beach_mi','coho_salmon'),
    ('harbor_beach_mi','smallmouth_bass'),
    ('oscoda_mi','atlantic_salmon'),
    ('oscoda_mi','steelhead'),
    ('oscoda_mi','walleye'),
    ('oscoda_mi','lake_trout'),
    ('oscoda_mi','coho_salmon'),
    ('oscoda_mi','chinook_salmon'),
    ('oscoda_mi','smallmouth_bass'),
    ('oscoda_mi','channel_catfish'),
    ('oscoda_mi','freshwater_drum'),
    ('port_sanilac_mi','coho_salmon'),
    ('port_sanilac_mi','steelhead'),
    ('port_sanilac_mi','northern_pike'),
    ('harbor_beach_mi','atlantic_salmon'),
    ('harbor_beach_mi','steelhead'),
    ('harbor_beach_mi','lake_trout'),
    ('harbor_beach_mi','walleye'),
    ('harbor_beach_mi','northern_pike'),
    ('oscoda_mi','northern_pike'),
    ('port_sanilac_mi','atlantic_salmon'),
    ('port_sanilac_mi','chinook_salmon'),
    ('port_sanilac_mi','brown_trout'),
    ('port_sanilac_mi','lake_trout'),
    ('port_sanilac_mi','yellow_perch'),
    ('port_sanilac_mi','walleye'),
    ('port_sanilac_mi','smallmouth_bass'),
    ('port_sanilac_mi','white_bass'),
    ('ludington_mi','northern_pike'),
    ('ludington_mi','burbot'),
    ('grand_haven_mi','white_perch'),
    ('grand_haven_mi','white_bass'),
    ('grand_haven_mi','lake_whitefish'),
    ('manistee_mi','northern_pike'),
    ('manistee_mi','burbot'),
    ('frankfort_elberta_mi','northern_pike'),
    ('frankfort_elberta_mi','walleye'),
    ('two_rivers_wi','chinook_salmon'),
    ('two_rivers_wi','coho_salmon'),
    ('two_rivers_wi','steelhead'),
    ('two_rivers_wi','brown_trout'),
    ('kewaunee_wi','chinook_salmon'),
    ('kewaunee_wi','coho_salmon'),
    ('kewaunee_wi','steelhead'),
    ('kewaunee_wi','brown_trout'),
    ('kewaunee_wi','lake_trout'),
    ('algoma_wi','chinook_salmon'),
    ('algoma_wi','coho_salmon'),
    ('algoma_wi','steelhead'),
    ('algoma_wi','brown_trout'),
    ('manitowoc_wi','chinook_salmon'),
    ('manitowoc_wi','coho_salmon'),
    ('manitowoc_wi','steelhead'),
    ('manitowoc_wi','brown_trout'),
    ('manitowoc_wi','smallmouth_bass'),
    ('manitowoc_wi','northern_pike'),
    ('waukegan_il','chinook_salmon'),
    ('waukegan_il','coho_salmon'),
    ('waukegan_il','steelhead'),
    ('waukegan_il','brown_trout'),
    ('waukegan_il','yellow_perch'),
    ('chicago_il','chinook_salmon'),
    ('chicago_il','coho_salmon'),
    ('chicago_il','steelhead'),
    ('chicago_il','brown_trout'),
    ('chicago_il','lake_trout'),
    ('chicago_il','smallmouth_bass'),
    ('chicago_il','freshwater_drum'),
    ('chicago_il','yellow_perch'),
    ('chicago_il','northern_pike'),
    ('michigan_city_in','chinook_salmon'),
    ('michigan_city_in','coho_salmon'),
    ('michigan_city_in','steelhead'),
    ('michigan_city_in','brown_trout'),
    ('michigan_city_in','smallmouth_bass'),
    ('michigan_city_in','yellow_perch'),
    ('michigan_city_in','largemouth_bass'),
    ('muskegon_mi','chinook_salmon'),
    ('muskegon_mi','coho_salmon'),
    ('muskegon_mi','steelhead'),
    ('muskegon_mi','brown_trout'),
    ('muskegon_mi','walleye'),
    ('muskegon_mi','smallmouth_bass'),
    ('muskegon_mi','freshwater_drum'),
    ('muskegon_mi','yellow_perch'),
    ('muskegon_mi','lake_whitefish'),
    ('muskegon_mi','channel_catfish'),
    ('muskegon_mi','largemouth_bass'),
    ('muskegon_mi','northern_pike'),
    ('muskegon_mi','white_perch'),
    ('whitehall_mi','chinook_salmon'),
    ('whitehall_mi','coho_salmon'),
    ('whitehall_mi','steelhead'),
    ('whitehall_mi','brown_trout'),
    ('whitehall_mi','walleye'),
    ('whitehall_mi','smallmouth_bass'),
    ('whitehall_mi','freshwater_drum'),
    ('whitehall_mi','yellow_perch'),
    ('whitehall_mi','lake_whitefish'),
    ('whitehall_mi','channel_catfish'),
    ('whitehall_mi','largemouth_bass'),
    ('whitehall_mi','northern_pike'),
    ('alpena_mi','chinook_salmon'),
    ('alpena_mi','coho_salmon'),
    ('alpena_mi','steelhead'),
    ('alpena_mi','brown_trout'),
    ('alpena_mi','lake_trout'),
    ('alpena_mi','walleye'),
    ('alpena_mi','smallmouth_bass'),
    ('alpena_mi','freshwater_drum'),
    ('alpena_mi','yellow_perch'),
    ('alpena_mi','atlantic_salmon'),
    ('alpena_mi','northern_pike'),
    ('st_joseph_mi','chinook_salmon'),
    ('st_joseph_mi','coho_salmon'),
    ('st_joseph_mi','steelhead'),
    ('st_joseph_mi','brown_trout'),
    ('st_joseph_mi','lake_trout'),
    ('st_joseph_mi','yellow_perch'),
    ('st_joseph_mi','lake_whitefish'),
    ('south_haven_mi','chinook_salmon'),
    ('south_haven_mi','coho_salmon'),
    ('south_haven_mi','steelhead'),
    ('south_haven_mi','brown_trout'),
    ('south_haven_mi','lake_trout'),
    ('south_haven_mi','walleye'),
    ('south_haven_mi','smallmouth_bass'),
    ('south_haven_mi','freshwater_drum'),
    ('south_haven_mi','yellow_perch'),
    ('south_haven_mi','lake_whitefish'),
    ('south_haven_mi','round_whitefish'),
    ('south_haven_mi','channel_catfish'),
    ('south_haven_mi','northern_pike'),
    ('holland_mi','chinook_salmon'),
    ('holland_mi','coho_salmon'),
    ('holland_mi','steelhead'),
    ('holland_mi','brown_trout'),
    ('holland_mi','lake_trout'),
    ('holland_mi','walleye'),
    ('holland_mi','smallmouth_bass'),
    ('holland_mi','freshwater_drum'),
    ('holland_mi','yellow_perch'),
    ('holland_mi','lake_whitefish'),
    ('lexington_mi','chinook_salmon'),
    ('lexington_mi','coho_salmon'),
    ('lexington_mi','steelhead'),
    ('lexington_mi','brown_trout'),
    ('lexington_mi','lake_trout'),
    ('lexington_mi','walleye'),
    ('lexington_mi','smallmouth_bass'),
    ('lexington_mi','freshwater_drum'),
    ('lexington_mi','yellow_perch'),
    ('lexington_mi','channel_catfish'),
    ('lexington_mi','largemouth_bass'),
    ('lexington_mi','atlantic_salmon'),
    ('lexington_mi','northern_pike'),
    ('lexington_mi','white_bass'),
    ('harrisville_mi','chinook_salmon'),
    ('harrisville_mi','coho_salmon'),
    ('harrisville_mi','steelhead'),
    ('harrisville_mi','brown_trout'),
    ('harrisville_mi','atlantic_salmon'),
    ('pentwater_mi','chinook_salmon'),
    ('pentwater_mi','coho_salmon'),
    ('pentwater_mi','steelhead'),
    ('pentwater_mi','brown_trout'),
    ('pentwater_mi','walleye'),
    ('pentwater_mi','smallmouth_bass'),
    ('pentwater_mi','freshwater_drum'),
    ('pentwater_mi','yellow_perch'),
    ('rogers_city_mi','chinook_salmon'),
    ('rogers_city_mi','steelhead'),
    ('rogers_city_mi','brown_trout'),
    ('rogers_city_mi','lake_trout'),
    ('rogers_city_mi','walleye'),
    ('rogers_city_mi','smallmouth_bass'),
    ('rogers_city_mi','atlantic_salmon'),
    ('tawas_city_mi','coho_salmon'),
    ('tawas_city_mi','steelhead'),
    ('tawas_city_mi','lake_trout'),
    ('tawas_city_mi','walleye'),
    ('tawas_city_mi','smallmouth_bass'),
    ('tawas_city_mi','yellow_perch'),
    ('tawas_city_mi','lake_whitefish'),
    ('tawas_city_mi','northern_pike'),
    ('tawas_city_mi','burbot'),
    ('charlevoix_mi','chinook_salmon'),
    ('charlevoix_mi','steelhead'),
    ('charlevoix_mi','lake_trout'),
    ('charlevoix_mi','walleye'),
    ('charlevoix_mi','smallmouth_bass'),
    ('charlevoix_mi','freshwater_drum'),
    ('charlevoix_mi','yellow_perch'),
    ('caseville_mi','coho_salmon'),
    ('caseville_mi','steelhead'),
    ('caseville_mi','lake_trout'),
    ('caseville_mi','walleye'),
    ('caseville_mi','smallmouth_bass')
  ) expected(city_id,species_id); $$;

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
  if p_run->>'configVersion'<>'piercast-v3-thirty-two-city-caseville-species-v12'
     or p_run->>'engineVersion'<>'pier-cast-opportunity-modes-v3-shadow-v1.9.0'
     or p_run->>'formulaVersion'<>'piercast-opportunity-modes-bounded-temperature-v3'
     or (p_run->>'previewOnly')::boolean is distinct from true
     or p_run->>'promotionStatus'<>'blocked'
     or p_run->>'pass1CandidatesSha256' !~ '^[a-f0-9]{64}$'
     or p_run->>'pass1CalibrationSha256' !~ '^[a-f0-9]{64}$'
     or jsonb_typeof(p_forecasts) is distinct from 'array'
     or jsonb_array_length(p_forecasts)<>1270
     or (select count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts)item)<>32
     or (select count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>254
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
    true,'blocked',1270
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
    if target_run is null or existing_count<>1270 then
      raise exception 'existing Formula v3 pentwater-caseville-pass3 run is incomplete';
    end if;
    return jsonb_build_object(
      'status','already_committed','runId',target_run,'forecastCount',1270
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
    select count(*)<>1270
      or count(distinct city_id)<>32
      or count(distinct local_date)<>5
      or count(distinct(city_id,species_id))<>254
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
    'status','committed','runId',target_run,'forecastCount',1270
  );
end;
$$;

comment on function public.piercast_v3_expected_pairs() is
  'Exact private Formula v3 32-city, 254-pair V12 manifest. Bluegill is intentionally absent; absence otherwise is not biological absence.';
comment on function public.commit_pier_cast_v3_shadow_forecast(jsonb,jsonb) is
  'Exact private Formula v3 32-city, 254-pair, 1270-row V12 commit gate. Historical configurations remain readable.';

commit;
