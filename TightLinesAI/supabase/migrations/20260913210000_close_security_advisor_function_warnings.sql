-- Keep SECURITY DEFINER helpers out of the exposed public schema. Public RPCs
-- remain invoker functions while private helpers retain the narrowly scoped
-- access needed to enforce creator and username rules behind RLS.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function public.is_finfindr_creator_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) in (
      'brandonkentros@icloud.com',
      'finfindr@hotmail.com'
    );
$$;

revoke all on function public.is_finfindr_creator_admin() from public, anon;
grant execute on function public.is_finfindr_creator_admin() to authenticated;

create or replace function private.auth_creator_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.id
  from public.creators c
  where c.status in ('active', 'paused')
    and (
      c.owner_user_id = auth.uid()
      or (
        c.email is not null
        and lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    );
$$;

revoke all on function private.auth_creator_ids() from public, anon;
grant execute on function private.auth_creator_ids() to authenticated;

drop policy if exists "creators_portal_read" on public.creators;
create policy "creators_portal_read"
  on public.creators for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or id in (select private.auth_creator_ids())
  );

drop policy if exists "creator_codes_portal_read" on public.creator_codes;
create policy "creator_codes_portal_read"
  on public.creator_codes for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or creator_id in (select private.auth_creator_ids())
  );

drop policy if exists "referral_clicks_portal_read" on public.referral_clicks;
create policy "referral_clicks_portal_read"
  on public.referral_clicks for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or creator_id in (select private.auth_creator_ids())
  );

drop policy if exists "user_attributions_portal_read" on public.user_attributions;
create policy "user_attributions_portal_read"
  on public.user_attributions for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or creator_id in (select private.auth_creator_ids())
  );

drop policy if exists "creator_commission_ledger_portal_read"
  on public.creator_commission_ledger;
create policy "creator_commission_ledger_portal_read"
  on public.creator_commission_ledger for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or creator_id in (select private.auth_creator_ids())
  );

drop policy if exists "referral_funnel_events_portal_read"
  on public.referral_funnel_events;
create policy "referral_funnel_events_portal_read"
  on public.referral_funnel_events for select to authenticated
  using (
    (select public.is_finfindr_creator_admin())
    or creator_id in (select private.auth_creator_ids())
  );

drop function public.auth_creator_ids();

create or replace function private.is_username_available(
  check_username text,
  exclude_user_id uuid default null
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  normalized text := lower(btrim(check_username));
begin
  if auth.uid() is null then
    return false;
  end if;

  if normalized is null or length(normalized) < 3 then
    return false;
  end if;

  if normalized !~ '^[a-z0-9_]+$' then
    return false;
  end if;

  if exclude_user_id is not null and exclude_user_id <> auth.uid() then
    raise exception 'exclude_user_id must match the authenticated user';
  end if;

  return not exists (
    select 1
    from public.profiles p
    where lower(p.username) = normalized
      and (exclude_user_id is null or p.id <> exclude_user_id)
  );
end;
$$;

revoke all on function private.is_username_available(text, uuid)
  from public, anon;
grant execute on function private.is_username_available(text, uuid)
  to authenticated;

create or replace function public.is_username_available(
  check_username text,
  exclude_user_id uuid default null
)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_username_available(check_username, exclude_user_id);
$$;

revoke all on function public.is_username_available(text, uuid)
  from public, anon;
grant execute on function public.is_username_available(text, uuid)
  to authenticated;

-- These tables are intentionally unavailable to client roles. Explicit
-- service-role policies document that boundary and keep the advisor from
-- reporting policy-less RLS tables. The service role bypasses RLS, but naming
-- the policy makes the intended access model auditable.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'catches',
    'feature_report_trials',
    'recommender_daily_sessions',
    'recommender_recent_history',
    'sessions',
    'source_registry',
    'water_reader_aerial_provider_policies',
    'waterbody_aliases',
    'waterbody_index',
    'waterbody_search_miss_events',
    'waterbody_shared_states',
    'waterbody_source_links'
  ]
  loop
    execute format('drop policy if exists "service_role_only" on public.%I', table_name);
    execute format(
      'create policy "service_role_only" on public.%I for all to service_role using (true) with check (true)',
      table_name
    );
  end loop;
end;
$$;

notify pgrst, 'reload schema';
