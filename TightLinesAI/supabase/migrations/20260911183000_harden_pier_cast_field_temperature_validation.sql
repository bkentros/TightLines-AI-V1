alter table public.pier_cast_field_temperature_observations
  add constraint pier_cast_field_temperature_finite_values_check check (
    original_temperature_c > '-Infinity'::double precision
    and original_temperature_c < 'Infinity'::double precision
    and instrument_accuracy_c > '-Infinity'::double precision
    and instrument_accuracy_c < 'Infinity'::double precision
    and calibration_reference_c > '-Infinity'::double precision
    and calibration_reference_c < 'Infinity'::double precision
    and calibration_observed_c > '-Infinity'::double precision
    and calibration_observed_c < 'Infinity'::double precision
    and (calibration_error_c is null or (
      calibration_error_c > '-Infinity'::double precision
      and calibration_error_c < 'Infinity'::double precision
    ))
    and (distance_from_target_m is null or (
      distance_from_target_m > '-Infinity'::double precision
      and distance_from_target_m < 'Infinity'::double precision
    ))
  ) not valid;

alter table public.pier_cast_field_temperature_observations
  add constraint pier_cast_field_temperature_usable_protocol_check check (
    record_status <> 'usable' or (
      instrument_accuracy_c <= 0.2
      and calibration_error_c is not null
      and calibration_error_c <= 0.2
      and calibration_checked_at <= observed_at
      and calibration_checked_at >= observed_at - interval '30 days'
      and depth_m between 0.25 and 0.75
      and distance_from_target_m is not null
      and distance_from_target_m <= 350
    )
  ) not valid;

alter table public.pier_cast_field_temperature_observations
  validate constraint pier_cast_field_temperature_finite_values_check;
alter table public.pier_cast_field_temperature_observations
  validate constraint pier_cast_field_temperature_usable_protocol_check;

-- Keep the established city-level RPC agency-only. Field sites are deliberately
-- paired by source below so two structures sharing one model cell cannot be
-- blended into a single evidence set.
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
    from public.pier_cast_temperature_observations candidate
    where candidate.city_id = sample.city_id
      and candidate.record_status = 'usable'
      and candidate.observed_at between
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

comment on function public.read_pier_cast_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) is 'Returns nearest strict-QC agency pairs for private PierCast temperature validation only.';

create or replace function public.read_pier_cast_field_temperature_validation_pairs(
  p_source_id text,
  p_start timestamptz,
  p_end timestamptz,
  p_tolerance_minutes integer default 30
) returns table (
  city_id text,
  structure_id text,
  source_id text,
  issued_at timestamptz,
  forecast_hour smallint,
  valid_at timestamptz,
  model_temperature_c double precision,
  observed_at timestamptz,
  observed_temperature_c double precision,
  observation_offset_minutes double precision,
  error_c double precision
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_city_id text;
  requested_structure_id text;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role required'; end if;

  select mapping.city_id, mapping.structure_id
  into requested_city_id, requested_structure_id
  from (values
    ('ludington_north_breakwater__surface_logger_v1', 'ludington_mi', 'ludington_north_breakwater'),
    ('grand_haven_south_pier__surface_logger_v1', 'grand_haven_mi', 'grand_haven_south_pier'),
    ('manistee_north_pier__surface_logger_v1', 'manistee_mi', 'manistee_north_pier'),
    ('frankfort_north_breakwater__surface_logger_v1', 'frankfort_elberta_mi', 'frankfort_north_breakwater'),
    ('elberta_south_breakwater__surface_logger_v1', 'frankfort_elberta_mi', 'elberta_south_breakwater'),
    ('sheboygan_north_pier__surface_logger_v1', 'sheboygan_wi', 'sheboygan_north_pier'),
    ('sheboygan_south_pier__surface_logger_v1', 'sheboygan_wi', 'sheboygan_south_pier')
  ) as mapping(source_id, city_id, structure_id)
  where mapping.source_id = p_source_id;

  if requested_city_id is null
     or p_start is null or p_end is null or p_end <= p_start
     or p_tolerance_minutes is null
     or p_tolerance_minutes < 0 or p_tolerance_minutes > 60 then
    raise exception 'invalid PierCast field validation-pair request';
  end if;

  return query
  select sample.city_id, requested_structure_id, p_source_id,
    sample.issued_at, sample.forecast_hour, sample.valid_at,
    sample.temperature_c, observation.observed_at, observation.temperature_c,
    (abs(extract(epoch from observation.observed_at - sample.valid_at)) / 60.0)::double precision,
    sample.temperature_c - observation.temperature_c
  from public.pier_cast_temperature_samples sample
  join lateral (
    select field.observed_at, field.temperature_c
    from public.pier_cast_field_temperature_observations field
    where field.source_id = p_source_id
      and field.record_status = 'usable'
      and field.observed_at between
        sample.valid_at - make_interval(mins => p_tolerance_minutes)
        and sample.valid_at + make_interval(mins => p_tolerance_minutes)
    order by abs(extract(epoch from field.observed_at - sample.valid_at)),
      field.observed_at
    limit 1
  ) observation on true
  where sample.city_id = requested_city_id
    and sample.valid_at >= p_start and sample.valid_at <= p_end
  order by sample.issued_at, sample.forecast_hour;
end;
$$;

revoke all on function public.read_pier_cast_field_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) from public, anon, authenticated;
grant execute on function public.read_pier_cast_field_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) to service_role;

comment on function public.read_pier_cast_field_temperature_validation_pairs(
  text, timestamptz, timestamptz, integer
) is 'Returns source-specific local logger pairs for private PierCast validation only; structures are never blended.';
