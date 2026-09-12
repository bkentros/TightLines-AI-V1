create table if not exists public.pier_cast_field_temperature_observations (
  source_id text not null,
  city_id text not null check (city_id in (
    'ludington_mi', 'grand_haven_mi', 'manistee_mi',
    'frankfort_elberta_mi', 'sheboygan_wi'
  )),
  structure_id text not null check (structure_id in (
    'ludington_north_breakwater', 'grand_haven_south_pier',
    'manistee_north_pier', 'frankfort_north_breakwater',
    'elberta_south_breakwater', 'sheboygan_north_pier',
    'sheboygan_south_pier'
  )),
  observed_at timestamptz not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  depth_m double precision not null check (depth_m between 0 and 10),
  original_temperature_c double precision not null,
  temperature_c double precision check (temperature_c between -2 and 40),
  instrument_id text not null check (length(trim(instrument_id)) > 0),
  instrument_model text not null check (length(trim(instrument_model)) > 0),
  instrument_accuracy_c double precision not null check (instrument_accuracy_c between 0 and 10),
  calibration_checked_at timestamptz not null,
  calibration_reference_c double precision not null,
  calibration_observed_c double precision not null,
  calibration_error_c double precision,
  source_quality_flag text not null check (source_quality_flag in ('good', 'suspect', 'bad')),
  field_session_id text not null check (length(trim(field_session_id)) > 0),
  distance_from_target_m double precision check (distance_from_target_m >= 0),
  protocol_version text not null check (protocol_version = 'piercast-field-temperature-v1'),
  record_status text not null check (record_status in ('usable', 'rejected')),
  rejection_reasons text[] not null default '{}',
  validated_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (source_id, observed_at),
  check (
    (source_id = 'ludington_north_breakwater__surface_logger_v1' and city_id = 'ludington_mi' and structure_id = 'ludington_north_breakwater') or
    (source_id = 'grand_haven_south_pier__surface_logger_v1' and city_id = 'grand_haven_mi' and structure_id = 'grand_haven_south_pier') or
    (source_id = 'manistee_north_pier__surface_logger_v1' and city_id = 'manistee_mi' and structure_id = 'manistee_north_pier') or
    (source_id = 'frankfort_north_breakwater__surface_logger_v1' and city_id = 'frankfort_elberta_mi' and structure_id = 'frankfort_north_breakwater') or
    (source_id = 'elberta_south_breakwater__surface_logger_v1' and city_id = 'frankfort_elberta_mi' and structure_id = 'elberta_south_breakwater') or
    (source_id = 'sheboygan_north_pier__surface_logger_v1' and city_id = 'sheboygan_wi' and structure_id = 'sheboygan_north_pier') or
    (source_id = 'sheboygan_south_pier__surface_logger_v1' and city_id = 'sheboygan_wi' and structure_id = 'sheboygan_south_pier')
  ),
  check (
    (record_status = 'usable' and temperature_c is not null and source_quality_flag = 'good' and cardinality(rejection_reasons) = 0) or
    (record_status = 'rejected' and temperature_c is null and cardinality(rejection_reasons) > 0)
  )
);

create index if not exists pier_cast_field_temperature_city_time_idx
  on public.pier_cast_field_temperature_observations(city_id, observed_at desc)
  where record_status = 'usable';

alter table public.pier_cast_field_temperature_observations enable row level security;

drop policy if exists "pier_cast_field_temperature_service_role_all"
  on public.pier_cast_field_temperature_observations;
create policy "pier_cast_field_temperature_service_role_all"
  on public.pier_cast_field_temperature_observations
  for all to service_role using (true) with check (true);

revoke all on table public.pier_cast_field_temperature_observations
  from public, anon, authenticated;
grant select, insert, update, delete
  on table public.pier_cast_field_temperature_observations to service_role;

create or replace function public.commit_pier_cast_field_temperature_observations(p_records jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  committed_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if jsonb_typeof(p_records) is distinct from 'array'
     or jsonb_array_length(p_records) > 1000 then
    raise exception 'invalid PierCast field observation batch';
  end if;

  insert into public.pier_cast_field_temperature_observations (
    source_id, city_id, structure_id, observed_at, latitude, longitude,
    depth_m, original_temperature_c, temperature_c, instrument_id,
    instrument_model, instrument_accuracy_c, calibration_checked_at,
    calibration_reference_c, calibration_observed_c, calibration_error_c,
    source_quality_flag, field_session_id, distance_from_target_m,
    protocol_version, record_status, rejection_reasons, validated_at, updated_at
  )
  select
    record->>'sourceId', record->>'cityId', record->>'structureId',
    (record->>'observedAt')::timestamptz,
    (record->>'latitude')::double precision,
    (record->>'longitude')::double precision,
    (record->>'depthM')::double precision,
    (record->>'temperatureC')::double precision,
    case when record->'normalizedTemperatureC' = 'null'::jsonb then null
      else (record->>'normalizedTemperatureC')::double precision end,
    record->>'instrumentId', record->>'instrumentModel',
    (record->>'instrumentAccuracyC')::double precision,
    (record->>'calibrationCheckedAt')::timestamptz,
    (record->>'calibrationReferenceC')::double precision,
    (record->>'calibrationObservedC')::double precision,
    case when record->'calibrationErrorC' = 'null'::jsonb then null
      else (record->>'calibrationErrorC')::double precision end,
    record->>'qualityFlag', record->>'fieldSessionId',
    case when record->'distanceFromTargetM' = 'null'::jsonb then null
      else (record->>'distanceFromTargetM')::double precision end,
    record->>'protocolVersion', record->>'recordStatus',
    array(select jsonb_array_elements_text(record->'rejectionReasons')),
    (record->>'validatedAt')::timestamptz, timezone('utc', now())
  from jsonb_array_elements(p_records) record
  on conflict (source_id, observed_at) do update set
    city_id = excluded.city_id,
    structure_id = excluded.structure_id,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    depth_m = excluded.depth_m,
    original_temperature_c = excluded.original_temperature_c,
    temperature_c = excluded.temperature_c,
    instrument_id = excluded.instrument_id,
    instrument_model = excluded.instrument_model,
    instrument_accuracy_c = excluded.instrument_accuracy_c,
    calibration_checked_at = excluded.calibration_checked_at,
    calibration_reference_c = excluded.calibration_reference_c,
    calibration_observed_c = excluded.calibration_observed_c,
    calibration_error_c = excluded.calibration_error_c,
    source_quality_flag = excluded.source_quality_flag,
    field_session_id = excluded.field_session_id,
    distance_from_target_m = excluded.distance_from_target_m,
    protocol_version = excluded.protocol_version,
    record_status = excluded.record_status,
    rejection_reasons = excluded.rejection_reasons,
    validated_at = excluded.validated_at,
    updated_at = timezone('utc', now());

  get diagnostics committed_count = row_count;
  return jsonb_build_object('status', 'committed', 'recordCount', committed_count);
end;
$$;

revoke all on function public.commit_pier_cast_field_temperature_observations(jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_field_temperature_observations(jsonb)
  to service_role;

create or replace function public.read_pier_cast_temperature_validation_pairs(
  p_city_id text,
  p_start timestamptz,
  p_end timestamptz,
  p_tolerance_minutes integer default 30
) returns table (
  city_id text,
  issued_at timestamptz,
  forecast_hour smallint,
  valid_at timestamptz,
  model_temperature_c double precision,
  dataset_id text,
  observed_at timestamptz,
  observed_temperature_c double precision,
  observation_offset_minutes double precision,
  error_c double precision
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;
  if p_city_id is null
     or p_city_id not in (
       'ludington_mi', 'grand_haven_mi', 'manistee_mi',
       'frankfort_elberta_mi', 'sheboygan_wi'
     )
     or p_start is null or p_end is null or p_end <= p_start
     or p_tolerance_minutes is null
     or p_tolerance_minutes < 0 or p_tolerance_minutes > 60 then
    raise exception 'invalid PierCast validation-pair request';
  end if;
  return query
  select sample.city_id, sample.issued_at, sample.forecast_hour, sample.valid_at,
    sample.temperature_c, observation.dataset_id, observation.observed_at,
    observation.temperature_c,
    (abs(extract(epoch from observation.observed_at - sample.valid_at)) / 60.0)::double precision,
    sample.temperature_c - observation.temperature_c
  from public.pier_cast_temperature_samples sample
  join lateral (
    select candidate.dataset_id, candidate.observed_at, candidate.temperature_c
    from (
      select agency.dataset_id, agency.observed_at, agency.temperature_c
      from public.pier_cast_temperature_observations agency
      where agency.city_id = sample.city_id and agency.record_status = 'usable'
      union all
      select 'field:' || field.source_id, field.observed_at, field.temperature_c
      from public.pier_cast_field_temperature_observations field
      where field.city_id = sample.city_id and field.record_status = 'usable'
    ) candidate
    where candidate.observed_at between
      sample.valid_at - make_interval(mins => p_tolerance_minutes)
      and sample.valid_at + make_interval(mins => p_tolerance_minutes)
    order by abs(extract(epoch from candidate.observed_at - sample.valid_at)),
      candidate.observed_at, candidate.dataset_id
    limit 1
  ) observation on true
  where sample.city_id = p_city_id
    and sample.valid_at >= p_start and sample.valid_at <= p_end
  order by sample.issued_at, sample.forecast_hour;
end;
$$;

revoke all on function public.read_pier_cast_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) from public, anon, authenticated;
grant execute on function public.read_pier_cast_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) to service_role;

comment on table public.pier_cast_field_temperature_observations is
  'Private validation-only local logger evidence; never a PierCast runtime fallback.';
comment on function public.read_pier_cast_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) is 'Returns nearest strict-QC agency or field pairs for private PierCast temperature validation only.';
