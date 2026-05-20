-- Self-service account deletion for iOS account-management requirements.
-- Deleting auth.users cascades to public.profiles and profile-owned app rows.
create or replace function public.delete_current_user_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users
  where id = current_user_id;
end;
$$;

revoke all on function public.delete_current_user_account() from public;
grant execute on function public.delete_current_user_account() to authenticated;;
