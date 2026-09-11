create table if not exists public.pier_cast_daily_score_snapshots (
  lake_date date primary key,
  set_at timestamptz not null,
  publish_at timestamptz not null,
  source_issued_at timestamptz not null
    references public.pier_cast_temperature_cycles(issued_at) on delete restrict,
  source_fetched_at timestamptz not null,
  engine_version text not null check (char_length(engine_version) between 1 and 100),
  formula_version text not null check (char_length(formula_version) between 1 and 100),
  rubric_version text not null check (char_length(rubric_version) between 1 and 100),
  seasonal_calibration_version text not null
    check (char_length(seasonal_calibration_version) between 1 and 100),
  temperature_calibration_version text not null
    check (char_length(temperature_calibration_version) between 1 and 100),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  check (source_fetched_at >= source_issued_at),
  check (set_at >= source_issued_at),
  check (snapshot->>'status' = 'locked_daily_snapshot'),
  check (snapshot->>'lakeDate' = lake_date::text),
  check (snapshot->>'scoreTimezone' = 'America/Chicago'),
  check (jsonb_typeof(snapshot->'cities') = 'array'),
  check (jsonb_array_length(snapshot->'cities') = 5)
);

alter table public.pier_cast_daily_score_snapshots enable row level security;

drop policy if exists "pier_cast_daily_score_snapshots_service_role_select"
  on public.pier_cast_daily_score_snapshots;
create policy "pier_cast_daily_score_snapshots_service_role_select"
  on public.pier_cast_daily_score_snapshots for select to service_role using (true);

revoke all on table public.pier_cast_daily_score_snapshots
  from public, anon, authenticated;
grant select on table public.pier_cast_daily_score_snapshots to service_role;

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
      and jsonb_array_length(item->'date'->'species') = 4
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

revoke all on function public.commit_pier_cast_daily_score_snapshot(jsonb)
  from public, anon, authenticated;
grant execute on function public.commit_pier_cast_daily_score_snapshot(jsonb)
  to service_role;

create or replace function public.read_published_pier_cast_daily_score_snapshot(
  p_now timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service_role required';
  end if;
  if p_now is null then
    raise exception 'PierCast daily score read time is required';
  end if;

  select row.snapshot into result
  from public.pier_cast_daily_score_snapshots row
  where row.lake_date = (p_now at time zone 'America/Chicago')::date
    and row.publish_at <= p_now
  limit 1;

  return result;
end;
$$;

revoke all on function public.read_published_pier_cast_daily_score_snapshot(timestamptz)
  from public, anon, authenticated;
grant execute on function public.read_published_pier_cast_daily_score_snapshot(timestamptz)
  to service_role;

comment on table public.pier_cast_daily_score_snapshots is
  'Immutable Lake Michigan daily score and leaderboard inputs. Environmental conditions remain live and are not stored here.';
