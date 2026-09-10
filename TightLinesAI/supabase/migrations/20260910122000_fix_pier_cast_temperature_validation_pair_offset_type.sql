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
     or p_city_id not in ('ludington_mi', 'grand_haven_mi', 'sheboygan_wi')
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
      and candidate.observed_at between sample.valid_at - make_interval(mins => p_tolerance_minutes)
        and sample.valid_at + make_interval(mins => p_tolerance_minutes)
    order by abs(extract(epoch from candidate.observed_at - sample.valid_at)), candidate.observed_at
    limit 1
  ) observation on true
  where sample.city_id = p_city_id
    and sample.valid_at >= p_start and sample.valid_at <= p_end
  order by sample.issued_at, sample.forecast_hour;
end;
$$;

revoke all on function public.read_pier_cast_temperature_validation_pairs(text, timestamptz, timestamptz, integer)
  from public, anon, authenticated;
grant execute on function public.read_pier_cast_temperature_validation_pairs(text, timestamptz, timestamptz, integer)
  to service_role;

comment on function public.read_pier_cast_temperature_validation_pairs(text, timestamptz, timestamptz, integer) is
  'Returns nearest strict-QC observation pairs for private PierCast temperature validation only.';
