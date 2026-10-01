do $$
declare
  constraint_name text;
begin
  select catalog_constraint.conname into constraint_name
  from pg_constraint catalog_constraint
  where catalog_constraint.conrelid = 'public.pier_cast_temperature_observations'::regclass
    and catalog_constraint.contype = 'c'
    and pg_get_constraintdef(catalog_constraint.oid) like '%record_status%'
    and pg_get_constraintdef(catalog_constraint.oid) like '%aggregate_quality_flag%'
  limit 1;
  if constraint_name is not null then
    execute format(
      'alter table public.pier_cast_temperature_observations drop constraint %I',
      constraint_name
    );
  end if;
end;
$$;

alter table public.pier_cast_temperature_observations
  add constraint pier_cast_temperature_observations_status_quality_check
  check (
    (
      record_status = 'usable'
      and (aggregate_quality_flag = 1 or aggregate_quality_flag is null)
      and temperature_c is not null
      and rejection_reason is null
    ) or (
      record_status = 'rejected'
      and temperature_c is null
      and rejection_reason is not null
    )
  );

create or replace function public.read_pier_cast_observed_temperature_map(
  p_not_before timestamptz,
  p_not_after timestamptz
) returns table (
  dataset_id text,
  observed_at timestamptz,
  original_value double precision,
  original_unit text,
  aggregate_quality_flag smallint,
  temperature_c double precision,
  temperature_variable text,
  source_url text,
  fetched_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if p_not_before is null
     or p_not_after is null
     or p_not_after <= p_not_before
     or p_not_after - p_not_before > interval '31 days' then
    raise exception 'invalid PierCast observed-temperature request';
  end if;

  return query
  select distinct on (observation.dataset_id)
    observation.dataset_id,
    observation.observed_at,
    observation.original_value,
    observation.original_unit,
    observation.aggregate_quality_flag,
    observation.temperature_c,
    observation.temperature_variable,
    observation.source_url,
    observation.fetched_at
  from public.pier_cast_temperature_observations observation
  where observation.record_status = 'usable'
    and observation.temperature_c between -2 and 40
    and (
      observation.aggregate_quality_flag = 1
      or observation.aggregate_quality_flag is null
    )
    and observation.observed_at >= p_not_before
    and observation.observed_at <= p_not_after
  order by observation.dataset_id, observation.observed_at desc;
end;
$$;

revoke all on function public.read_pier_cast_observed_temperature_map(timestamptz, timestamptz)
  from public, anon, authenticated;
grant execute on function public.read_pier_cast_observed_temperature_map(timestamptz, timestamptz)
  to service_role;
