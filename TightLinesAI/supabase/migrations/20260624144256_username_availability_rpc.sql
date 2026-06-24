-- Live username availability checks need to see other profiles, but
-- profiles_select_own (post security hardening) only exposes the caller's row.
-- This RPC returns a boolean only — no profile data leakage.

create or replace function public.is_username_available(
  check_username text,
  exclude_user_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := lower(btrim(check_username));
begin
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

revoke all on function public.is_username_available(text, uuid) from public;

grant execute on function public.is_username_available(text, uuid)
  to authenticated;

notify pgrst, 'reload schema';
