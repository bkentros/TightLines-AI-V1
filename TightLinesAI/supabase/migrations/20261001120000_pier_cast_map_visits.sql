-- Live Lake Map: two free visits per account (lifetime), then the paywall.
-- A visit is one opening of the map screen; the app sends the same visit id
-- for retries and pass renewals during that visit, so those never count twice.
create table public.pier_cast_map_visits (
  user_id uuid not null references auth.users(id) on delete cascade,
  visit_id uuid not null,
  started_at timestamptz not null default now(),
  primary key (user_id, visit_id)
);
alter table public.pier_cast_map_visits enable row level security;
revoke all on public.pier_cast_map_visits from anon, authenticated;
grant all on public.pier_cast_map_visits to service_role;

-- Returns the number of free visits used including this one; raises
-- 'subscription_required' when a new visit would exceed the allowance.
create function public.claim_pier_cast_map_visit(p_user_id uuid, p_visit_id uuid, p_allowed integer default 2)
returns integer language plpgsql security definer set search_path = '' as $$
declare used_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':pier_cast_map', 0));
  select count(*) into used_count from public.pier_cast_map_visits where user_id = p_user_id;
  if exists (
    select 1 from public.pier_cast_map_visits where user_id = p_user_id and visit_id = p_visit_id
  ) then
    return used_count;
  end if;
  if used_count >= p_allowed then
    raise exception 'subscription_required';
  end if;
  insert into public.pier_cast_map_visits (user_id, visit_id) values (p_user_id, p_visit_id);
  return used_count + 1;
end;
$$;
revoke all on function public.claim_pier_cast_map_visit(uuid, uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_pier_cast_map_visit(uuid, uuid, integer) to service_role;
