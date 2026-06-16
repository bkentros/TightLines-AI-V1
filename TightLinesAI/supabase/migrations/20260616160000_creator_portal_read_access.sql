-- Creator portal: read-only access for linked creators + FinFindr admin.
-- Enables finfindr.app/creators with Supabase Auth + Realtime.

create or replace function public.is_finfindr_creator_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'brandonkentros@icloud.com';
$$;

create or replace function public.auth_creator_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
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

revoke all on function public.is_finfindr_creator_admin() from public;
revoke all on function public.auth_creator_ids() from public;
grant execute on function public.is_finfindr_creator_admin() to authenticated;
grant execute on function public.auth_creator_ids() to authenticated;

grant select on table public.creators to authenticated;
grant select on table public.creator_codes to authenticated;
grant select on table public.referral_clicks to authenticated;
grant select on table public.user_attributions to authenticated;
grant select on table public.creator_commission_ledger to authenticated;

create policy "creators_portal_read"
  on public.creators for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or id in (select public.auth_creator_ids())
  );

create policy "creator_codes_portal_read"
  on public.creator_codes for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or creator_id in (select public.auth_creator_ids())
  );

create policy "referral_clicks_portal_read"
  on public.referral_clicks for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or creator_id in (select public.auth_creator_ids())
  );

create policy "user_attributions_portal_read"
  on public.user_attributions for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or creator_id in (select public.auth_creator_ids())
  );

create policy "creator_commission_ledger_portal_read"
  on public.creator_commission_ledger for select
  to authenticated
  using (
    public.is_finfindr_creator_admin()
    or creator_id in (select public.auth_creator_ids())
  );

-- Realtime updates on the creator portal.
do $$
begin
  alter publication supabase_realtime add table public.referral_clicks;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.user_attributions;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.creator_commission_ledger;
exception
  when duplicate_object then null;
end $$;
