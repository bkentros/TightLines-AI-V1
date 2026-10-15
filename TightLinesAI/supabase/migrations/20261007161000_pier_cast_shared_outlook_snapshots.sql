create table if not exists public.pier_cast_outlook_snapshots (
  source_issued_at timestamptz not null,
  snapshot_version text not null,
  generated_at timestamptz not null,
  public_outlook jsonb not null,
  conditions_outlook jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (source_issued_at, snapshot_version),
  constraint pier_cast_outlook_snapshots_version_check
    check (char_length(snapshot_version) between 1 and 80),
  constraint pier_cast_outlook_snapshots_public_object_check
    check (jsonb_typeof(public_outlook) = 'object'),
  constraint pier_cast_outlook_snapshots_conditions_object_check
    check (jsonb_typeof(conditions_outlook) = 'object')
);

create index if not exists pier_cast_outlook_snapshots_version_issue_idx
  on public.pier_cast_outlook_snapshots
    (snapshot_version, source_issued_at desc);

alter table public.pier_cast_outlook_snapshots enable row level security;

revoke all on table public.pier_cast_outlook_snapshots
  from public, anon, authenticated;
grant select, insert on table public.pier_cast_outlook_snapshots
  to service_role;

create or replace function public.commit_pier_cast_outlook_snapshot(
  p_source_issued_at timestamptz,
  p_snapshot_version text,
  p_generated_at timestamptz,
  p_public_outlook jsonb,
  p_conditions_outlook jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  stored public.pier_cast_outlook_snapshots%rowtype;
begin
  if p_source_issued_at is null
     or p_generated_at is null
     or nullif(btrim(p_snapshot_version), '') is null
     or jsonb_typeof(p_public_outlook) <> 'object'
     or jsonb_typeof(p_conditions_outlook) <> 'object'
     or (p_public_outlook #>> '{source,issuedAt}')::timestamptz is distinct from
       p_source_issued_at
     or (p_conditions_outlook #>> '{source,issuedAt}')::timestamptz is distinct from
       p_source_issued_at
     or jsonb_array_length(coalesce(p_public_outlook->'cities', '[]'::jsonb)) <> 32
     or jsonb_array_length(coalesce(p_conditions_outlook->'cities', '[]'::jsonb)) <> 32 then
    raise exception 'invalid_pier_cast_outlook_snapshot';
  end if;

  insert into public.pier_cast_outlook_snapshots (
    source_issued_at,
    snapshot_version,
    generated_at,
    public_outlook,
    conditions_outlook
  ) values (
    p_source_issued_at,
    left(btrim(p_snapshot_version), 80),
    p_generated_at,
    p_public_outlook,
    p_conditions_outlook
  )
  on conflict (source_issued_at, snapshot_version) do nothing;

  select * into strict stored
    from public.pier_cast_outlook_snapshots
   where source_issued_at = p_source_issued_at
     and snapshot_version = left(btrim(p_snapshot_version), 80);

  return jsonb_build_object(
    'sourceIssuedAt', stored.source_issued_at,
    'snapshotVersion', stored.snapshot_version,
    'generatedAt', stored.generated_at,
    'publicOutlook', stored.public_outlook,
    'conditionsOutlook', stored.conditions_outlook
  );
end;
$$;

create or replace function public.read_pier_cast_outlook_snapshot(
  p_snapshot_version text,
  p_now timestamptz default now(),
  p_max_age_hours integer default 13
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'sourceIssuedAt', row.source_issued_at,
    'snapshotVersion', row.snapshot_version,
    'generatedAt', row.generated_at,
    'publicOutlook', row.public_outlook,
    'conditionsOutlook', row.conditions_outlook
  )
  from public.pier_cast_outlook_snapshots row
  where row.snapshot_version = left(btrim(p_snapshot_version), 80)
    and row.source_issued_at <= p_now
    and row.source_issued_at >= p_now - make_interval(
      hours => greatest(1, least(coalesce(p_max_age_hours, 13), 24))
    )
  order by row.source_issued_at desc
  limit 1;
$$;

revoke all on function public.commit_pier_cast_outlook_snapshot(
  timestamptz, text, timestamptz, jsonb, jsonb
) from public, anon, authenticated;
revoke all on function public.read_pier_cast_outlook_snapshot(
  text, timestamptz, integer
) from public, anon, authenticated;
grant execute on function public.commit_pier_cast_outlook_snapshot(
  timestamptz, text, timestamptz, jsonb, jsonb
) to service_role;
grant execute on function public.read_pier_cast_outlook_snapshot(
  text, timestamptz, integer
) to service_role;

comment on table public.pier_cast_outlook_snapshots is
  'One immutable shared 32-city PierCast outlook per NOAA issue and runtime snapshot version.';

notify pgrst, 'reload schema';
