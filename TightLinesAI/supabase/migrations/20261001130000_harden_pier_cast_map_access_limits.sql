-- Bound Live Lake Map pass minting per account and stop an accepted free-visit
-- UUID from being replayed forever. The app legitimately reuses a visit UUID
-- for retries and pass renewal only while that screen session is still fresh.

create table public.pier_cast_map_pass_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  passes_issued integer not null default 0 check (passes_issued >= 0),
  updated_at timestamptz not null default now()
);

alter table public.pier_cast_map_pass_limits enable row level security;
revoke all on public.pier_cast_map_pass_limits from public, anon, authenticated;
grant all on public.pier_cast_map_pass_limits to service_role;

create function public.claim_pier_cast_map_pass_issue(
  p_user_id uuid,
  p_allowed integer default 20,
  p_window_seconds integer default 600
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  current_window timestamptz;
  current_count integer;
begin
  if p_allowed < 1 or p_window_seconds < 1 then
    raise exception 'invalid_map_access_limit';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':pier_cast_map_pass', 0));
  insert into public.pier_cast_map_pass_limits (user_id, passes_issued)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select window_started_at, passes_issued
    into current_window, current_count
    from public.pier_cast_map_pass_limits
    where user_id = p_user_id;

  if current_window <= now() - make_interval(secs => p_window_seconds) then
    update public.pier_cast_map_pass_limits
      set window_started_at = now(), passes_issued = 1, updated_at = now()
      where user_id = p_user_id;
    return;
  end if;

  if current_count >= p_allowed then
    raise exception 'map_access_rate_limited';
  end if;

  update public.pier_cast_map_pass_limits
    set passes_issued = passes_issued + 1, updated_at = now()
    where user_id = p_user_id;
end;
$$;

revoke all on function public.claim_pier_cast_map_pass_issue(uuid, integer, integer)
  from public, anon, authenticated;
grant execute on function public.claim_pier_cast_map_pass_issue(uuid, integer, integer)
  to service_role;

create or replace function public.claim_pier_cast_map_visit(
  p_user_id uuid,
  p_visit_id uuid,
  p_allowed integer default 2
)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  used_count integer;
  existing_started_at timestamptz;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':pier_cast_map', 0));
  select count(*), max(started_at) filter (where visit_id = p_visit_id)
    into used_count, existing_started_at
    from public.pier_cast_map_visits
    where user_id = p_user_id;

  if existing_started_at is not null then
    if existing_started_at >= now() - interval '6 hours' then
      return used_count;
    end if;
    raise exception 'map_visit_expired';
  end if;

  if used_count >= p_allowed then
    raise exception 'subscription_required';
  end if;

  insert into public.pier_cast_map_visits (user_id, visit_id)
  values (p_user_id, p_visit_id);
  return used_count + 1;
end;
$$;

revoke all on function public.claim_pier_cast_map_visit(uuid, uuid, integer)
  from public, anon, authenticated;
grant execute on function public.claim_pier_cast_map_visit(uuid, uuid, integer)
  to service_role;
