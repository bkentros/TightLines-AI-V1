-- Allows the password-reset screen to avoid sending recovery emails for
-- addresses that are not registered in this Supabase project.
create or replace function public.email_registered_for_password_reset(raw_email text)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users u
    where lower(u.email) = lower(trim(raw_email))
      and u.email_confirmed_at is not null
  );
$$;

revoke all on function public.email_registered_for_password_reset(text) from public;
grant execute on function public.email_registered_for_password_reset(text) to anon, authenticated;;
