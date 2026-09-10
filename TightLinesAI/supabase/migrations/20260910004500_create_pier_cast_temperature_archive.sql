create table if not exists public.pier_cast_temperature_cycles (
  issued_at timestamptz primary key,
  fetched_at timestamptz not null,
  product_id text not null check (product_id = 'NOAA_NOS_LMHOFS_REGULARGRID'),
  engine_version text not null,
  source_status text not null check (source_status = 'complete'),
  diagnostics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pier_cast_temperature_samples (
  city_id text not null check (city_id in (
    'ludington_mi',
    'grand_haven_mi',
    'manistee_mi',
    'frankfort_elberta_mi',
    'sheboygan_wi'
  )),
  source_id text not null,
  issued_at timestamptz not null references public.pier_cast_temperature_cycles(issued_at) on delete cascade,
  forecast_hour smallint not null check (forecast_hour between 0 and 120),
  valid_at timestamptz not null,
  temperature_c double precision not null check (temperature_c between -2 and 40),
  raw_unit text not null check (raw_unit = 'C'),
  vertical_selection text not null check (vertical_selection = 'surface'),
  depth_index smallint not null check (depth_index = 0),
  grid_row integer not null check (grid_row between 0 and 477),
  grid_column integer not null check (grid_column between 0 and 836),
  latitude double precision not null check (latitude between 41.6 and 46.37),
  longitude double precision not null check (longitude between -88.06 and -79.7),
  source_url text not null,
  fetched_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (city_id, issued_at, forecast_hour),
  check (valid_at = issued_at + make_interval(hours => forecast_hour))
);

create index if not exists pier_cast_temperature_samples_city_valid_idx
  on public.pier_cast_temperature_samples(city_id, valid_at desc);

alter table public.pier_cast_temperature_cycles enable row level security;
alter table public.pier_cast_temperature_samples enable row level security;

drop policy if exists "pier_cast_temperature_cycles_service_role_all"
  on public.pier_cast_temperature_cycles;
create policy "pier_cast_temperature_cycles_service_role_all"
  on public.pier_cast_temperature_cycles
  for all to service_role using (true) with check (true);

drop policy if exists "pier_cast_temperature_samples_service_role_all"
  on public.pier_cast_temperature_samples;
create policy "pier_cast_temperature_samples_service_role_all"
  on public.pier_cast_temperature_samples
  for all to service_role using (true) with check (true);

revoke all on table public.pier_cast_temperature_cycles
  from public, anon, authenticated;
revoke all on table public.pier_cast_temperature_samples
  from public, anon, authenticated;
grant select, insert, update, delete
  on table public.pier_cast_temperature_cycles to service_role;
grant select, insert, update, delete
  on table public.pier_cast_temperature_samples to service_role;

create or replace function public.commit_pier_cast_lmhofs_cycle(
  p_cycle jsonb,
  p_samples jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  cycle_issued_at timestamptz := (p_cycle->>'issuedAt')::timestamptz;
  cycle_fetched_at timestamptz := (p_cycle->>'fetchedAt')::timestamptz;
  sample_count integer;
  complete_city_count integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if p_cycle->>'status' is distinct from 'available'
     or p_cycle->>'productId' is distinct from 'NOAA_NOS_LMHOFS_REGULARGRID'
     or (p_cycle->>'fullHorizonRequested')::boolean is distinct from true
     or jsonb_typeof(p_samples) is distinct from 'array'
     or jsonb_array_length(p_samples) <> 605 then
    raise exception 'invalid complete PierCast LMHOFS cycle';
  end if;

  select count(*) into sample_count
  from (
    select distinct
      sample->>'cityId' as city_id,
      (sample->>'forecastHour')::integer as forecast_hour
    from jsonb_array_elements(p_samples) sample
  ) unique_samples;

  select count(*) into complete_city_count
  from (
    select sample->>'cityId' as city_id
    from jsonb_array_elements(p_samples) sample
    where sample->>'cityId' in (
      'ludington_mi',
      'grand_haven_mi',
      'manistee_mi',
      'frankfort_elberta_mi',
      'sheboygan_wi'
    )
      and (sample->>'forecastHour')::integer between 0 and 120
      and (sample->>'issuedAt')::timestamptz = cycle_issued_at
      and (sample->>'validAt')::timestamptz = cycle_issued_at
        + make_interval(hours => (sample->>'forecastHour')::integer)
      and sample->>'productId' = 'NOAA_NOS_LMHOFS_REGULARGRID'
      and sample->>'rawUnit' = 'C'
      and sample->>'verticalSelection' = 'surface'
      and (sample->>'depthIndex')::integer = 0
      and (
        (
          sample->>'cityId' = 'ludington_mi'
          and (sample->>'gridRow')::integer = 235
          and (sample->>'gridColumn')::integer = 159
          and (sample->>'latitude')::double precision = 43.95
          and (sample->>'longitude')::double precision = -86.47
        ) or (
          sample->>'cityId' = 'grand_haven_mi'
          and (sample->>'gridRow')::integer = 146
          and (sample->>'gridColumn')::integer = 180
          and (sample->>'latitude')::double precision = 43.06
          and (sample->>'longitude')::double precision = -86.26
        ) or (
          sample->>'cityId' = 'manistee_mi'
          and (sample->>'gridRow')::integer = 265
          and (sample->>'gridColumn')::integer = 171
          and (sample->>'latitude')::double precision = 44.25
          and (sample->>'longitude')::double precision = -86.35
        ) or (
          sample->>'cityId' = 'frankfort_elberta_mi'
          and (sample->>'gridRow')::integer = 303
          and (sample->>'gridColumn')::integer = 180
          and (sample->>'latitude')::double precision = 44.63
          and (sample->>'longitude')::double precision = -86.26
        ) or (
          sample->>'cityId' = 'sheboygan_wi'
          and (sample->>'gridRow')::integer = 215
          and (sample->>'gridColumn')::integer = 37
          and (sample->>'latitude')::double precision = 43.75
          and (sample->>'longitude')::double precision = -87.69
        )
      )
    group by sample->>'cityId'
    having count(*) = 121
       and count(distinct (sample->>'forecastHour')::integer) = 121
  ) complete_cities;

  if sample_count <> 605 or complete_city_count <> 5 then
    raise exception 'PierCast LMHOFS archive requires 121 unique hours for all five cities';
  end if;

  insert into public.pier_cast_temperature_cycles (
    issued_at,
    fetched_at,
    product_id,
    engine_version,
    source_status,
    diagnostics,
    updated_at
  ) values (
    cycle_issued_at,
    cycle_fetched_at,
    'NOAA_NOS_LMHOFS_REGULARGRID',
    p_cycle->>'engineVersion',
    'complete',
    coalesce(p_cycle->'diagnostics', '[]'::jsonb),
    timezone('utc', now())
  )
  on conflict (issued_at) do update set
    fetched_at = excluded.fetched_at,
    engine_version = excluded.engine_version,
    source_status = excluded.source_status,
    diagnostics = excluded.diagnostics,
    updated_at = timezone('utc', now());

  insert into public.pier_cast_temperature_samples (
    city_id,
    source_id,
    issued_at,
    forecast_hour,
    valid_at,
    temperature_c,
    raw_unit,
    vertical_selection,
    depth_index,
    grid_row,
    grid_column,
    latitude,
    longitude,
    source_url,
    fetched_at,
    updated_at
  )
  select
    sample->>'cityId',
    sample->>'sourceId',
    (sample->>'issuedAt')::timestamptz,
    (sample->>'forecastHour')::smallint,
    (sample->>'validAt')::timestamptz,
    (sample->>'temperatureC')::double precision,
    sample->>'rawUnit',
    sample->>'verticalSelection',
    (sample->>'depthIndex')::smallint,
    (sample->>'gridRow')::integer,
    (sample->>'gridColumn')::integer,
    (sample->>'latitude')::double precision,
    (sample->>'longitude')::double precision,
    sample->>'sourceUrl',
    cycle_fetched_at,
    timezone('utc', now())
  from jsonb_array_elements(p_samples) sample
  on conflict (city_id, issued_at, forecast_hour) do update set
    source_id = excluded.source_id,
    valid_at = excluded.valid_at,
    temperature_c = excluded.temperature_c,
    raw_unit = excluded.raw_unit,
    vertical_selection = excluded.vertical_selection,
    depth_index = excluded.depth_index,
    grid_row = excluded.grid_row,
    grid_column = excluded.grid_column,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    source_url = excluded.source_url,
    fetched_at = excluded.fetched_at,
    updated_at = timezone('utc', now());

  return jsonb_build_object(
    'issuedAt', cycle_issued_at,
    'cityCount', 5,
    'sampleCount', 605,
    'status', 'committed'
  );
end;
$$;

revoke all on function public.commit_pier_cast_lmhofs_cycle(jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_lmhofs_cycle(jsonb, jsonb)
  to service_role;

create or replace function public.read_latest_fresh_pier_cast_lmhofs_samples(
  p_now timestamptz,
  p_max_age_hours integer default 13
) returns table (
  city_id text,
  source_id text,
  issued_at timestamptz,
  forecast_hour smallint,
  valid_at timestamptz,
  temperature_c double precision,
  raw_unit text,
  vertical_selection text,
  depth_index smallint,
  grid_row integer,
  grid_column integer,
  latitude double precision,
  longitude double precision,
  source_url text,
  cycle_fetched_at timestamptz,
  diagnostics jsonb
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if p_now is null or p_max_age_hours < 1 or p_max_age_hours > 24 then
    raise exception 'invalid PierCast archive freshness request';
  end if;

  return query
  with latest_cycle as (
    select cycle.issued_at, cycle.fetched_at, cycle.diagnostics
    from public.pier_cast_temperature_cycles cycle
    where cycle.source_status = 'complete'
      and cycle.issued_at <= p_now
      and cycle.issued_at >= p_now - make_interval(hours => p_max_age_hours)
      and (
        select count(*)
        from public.pier_cast_temperature_samples sample_count
        where sample_count.issued_at = cycle.issued_at
      ) = 605
    order by cycle.issued_at desc
    limit 1
  )
  select
    sample.city_id,
    sample.source_id,
    sample.issued_at,
    sample.forecast_hour,
    sample.valid_at,
    sample.temperature_c,
    sample.raw_unit,
    sample.vertical_selection,
    sample.depth_index,
    sample.grid_row,
    sample.grid_column,
    sample.latitude,
    sample.longitude,
    sample.source_url,
    latest.fetched_at,
    latest.diagnostics
  from latest_cycle latest
  join public.pier_cast_temperature_samples sample
    on sample.issued_at = latest.issued_at
  order by sample.city_id, sample.forecast_hour;
end;
$$;

revoke all on function public.read_latest_fresh_pier_cast_lmhofs_samples(
  timestamptz,
  integer
) from public, anon, authenticated;
grant execute on function public.read_latest_fresh_pier_cast_lmhofs_samples(
  timestamptz,
  integer
) to service_role;
