-- Pre-launch security hardening.
--
-- Addresses Supabase advisor findings and removes app-level account
-- enumeration from the password-reset flow.

-- PostGIS installs spatial_ref_sys in public. It is reference metadata, not user
-- data, but public-schema tables should still have explicit RLS posture.
--
-- Some Supabase projects keep this table owned by the extension owner, so the
-- migration role cannot always alter it. Apply the rest of this hardening
-- migration even if PostGIS ownership blocks this advisor cleanup.
do $$
begin
  begin
    alter table if exists public.spatial_ref_sys enable row level security;
    drop policy if exists "spatial_ref_sys_read" on public.spatial_ref_sys;
    create policy "spatial_ref_sys_read"
      on public.spatial_ref_sys
      for select
      to anon, authenticated
      using (true);
    grant select on table public.spatial_ref_sys to anon, authenticated;
  exception
    when insufficient_privilege then
      raise notice 'Skipping public.spatial_ref_sys RLS cleanup: migration role is not the table owner.';
    when undefined_table then
      raise notice 'Skipping public.spatial_ref_sys RLS cleanup: table does not exist.';
  end;
end $$;

-- Views in Postgres are security definer by default. Make this Water Reader
-- availability view obey the invoking role instead of bypassing table RLS.
alter view if exists public.waterbody_availability_snapshot
  set (security_invoker = true);

-- Do not allow every signed-in user to read every profile row. Edge Functions
-- that need subscription/user metadata use the service role and are unaffected.
drop policy if exists "profiles_select_authenticated" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- This RPC confirmed whether an email existed in auth.users and was executable
-- by anon. Password reset should be non-enumerating.
do $$
begin
  if to_regprocedure('public.email_registered_for_password_reset(text)') is not null then
    revoke all on function public.email_registered_for_password_reset(text) from public;
    revoke execute on function public.email_registered_for_password_reset(text) from anon;
    revoke execute on function public.email_registered_for_password_reset(text) from authenticated;
  end if;
end $$;

drop function if exists public.email_registered_for_password_reset(text);

-- Account deletion is handled by an authenticated Edge Function instead of a
-- SECURITY DEFINER function in the exposed public schema.
do $$
begin
  if to_regprocedure('public.delete_current_user_account()') is not null then
    revoke all on function public.delete_current_user_account() from public;
    revoke execute on function public.delete_current_user_account() from anon;
    revoke execute on function public.delete_current_user_account() from authenticated;
  end if;
end $$;

drop function if exists public.delete_current_user_account();
