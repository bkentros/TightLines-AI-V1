-- Admin-only helper for edge functions (service role) to resolve auth user id by email.

create or replace function public.admin_lookup_user_id_by_email(target_email text)
returns uuid
language sql
security definer
set search_path = public, auth
as $$
  select u.id
  from auth.users u
  where lower(trim(u.email)) = lower(trim(target_email))
  limit 1;
$$;

revoke all on function public.admin_lookup_user_id_by_email(text) from public;
grant execute on function public.admin_lookup_user_id_by_email(text) to service_role;
