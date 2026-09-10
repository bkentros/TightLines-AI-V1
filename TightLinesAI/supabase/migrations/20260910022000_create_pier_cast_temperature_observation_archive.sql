create table if not exists public.pier_cast_temperature_observations (
  city_id text not null check (city_id in ('ludington_mi', 'grand_haven_mi', 'sheboygan_wi')),
  dataset_id text not null check (dataset_id in ('obs_62', 'obs_671', 'obs_709')),
  temperature_variable text not null,
  observed_at timestamptz not null,
  original_value double precision,
  original_unit text not null check (original_unit = 'K'),
  aggregate_quality_flag smallint check (aggregate_quality_flag in (1, 2, 3, 4, 9)),
  temperature_c double precision check (temperature_c between -2 and 40),
  record_status text not null check (record_status in ('usable', 'rejected')),
  rejection_reason text check (rejection_reason in ('quality_not_good', 'missing_value', 'temperature_out_of_range')),
  source_url text not null,
  fetched_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (dataset_id, temperature_variable, observed_at),
  check (
    (city_id = 'ludington_mi' and dataset_id = 'obs_62' and temperature_variable = 'sea_surface_temperature') or
    (city_id = 'grand_haven_mi' and dataset_id = 'obs_671' and temperature_variable = 'sea_water_temperature_1') or
    (city_id = 'sheboygan_wi' and dataset_id = 'obs_709' and temperature_variable = 'Temp0')
  ),
  check (
    (record_status = 'usable' and aggregate_quality_flag = 1 and temperature_c is not null and rejection_reason is null) or
    (record_status = 'rejected' and temperature_c is null and rejection_reason is not null)
  )
);

create index if not exists pier_cast_temperature_observations_city_time_idx
  on public.pier_cast_temperature_observations(city_id, observed_at desc)
  where record_status = 'usable';

alter table public.pier_cast_temperature_observations enable row level security;

drop policy if exists "pier_cast_temperature_observations_service_role_all"
  on public.pier_cast_temperature_observations;
create policy "pier_cast_temperature_observations_service_role_all"
  on public.pier_cast_temperature_observations
  for all to service_role using (true) with check (true);

revoke all on table public.pier_cast_temperature_observations from public, anon, authenticated;
grant select, insert, update, delete on table public.pier_cast_temperature_observations to service_role;

create or replace function public.commit_pier_cast_temperature_observations(p_records jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  committed_count integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if jsonb_typeof(p_records) is distinct from 'array' or jsonb_array_length(p_records) > 1000 then
    raise exception 'invalid PierCast observation batch';
  end if;

  insert into public.pier_cast_temperature_observations (
    city_id, dataset_id, temperature_variable, observed_at, original_value,
    original_unit, aggregate_quality_flag, temperature_c, record_status,
    rejection_reason, source_url, fetched_at, updated_at
  )
  select
    record->>'cityId', record->>'datasetId', record->>'temperatureVariable',
    (record->>'observedAt')::timestamptz,
    case when record->'originalValue' = 'null'::jsonb then null else (record->>'originalValue')::double precision end,
    record->>'originalUnit',
    case when record->'aggregateQualityFlag' = 'null'::jsonb then null else (record->>'aggregateQualityFlag')::smallint end,
    case when record->'temperatureC' = 'null'::jsonb then null else (record->>'temperatureC')::double precision end,
    record->>'recordStatus',
    case when record->'rejectionReason' = 'null'::jsonb then null else record->>'rejectionReason' end,
    record->>'sourceUrl', (record->>'fetchedAt')::timestamptz, timezone('utc', now())
  from jsonb_array_elements(p_records) record
  on conflict (dataset_id, temperature_variable, observed_at) do update set
    city_id = excluded.city_id,
    original_value = excluded.original_value,
    original_unit = excluded.original_unit,
    aggregate_quality_flag = excluded.aggregate_quality_flag,
    temperature_c = excluded.temperature_c,
    record_status = excluded.record_status,
    rejection_reason = excluded.rejection_reason,
    source_url = excluded.source_url,
    fetched_at = excluded.fetched_at,
    updated_at = timezone('utc', now());

  get diagnostics committed_count = row_count;
  return jsonb_build_object('status', 'committed', 'recordCount', committed_count);
end;
$$;

revoke all on function public.commit_pier_cast_temperature_observations(jsonb) from public, anon, authenticated;
grant execute on function public.commit_pier_cast_temperature_observations(jsonb) to service_role;

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
    abs(extract(epoch from observation.observed_at - sample.valid_at)) / 60.0,
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
