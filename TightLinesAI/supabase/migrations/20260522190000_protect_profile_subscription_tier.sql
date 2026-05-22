-- Protect paid entitlement state from client-side profile writes.
--
-- Authenticated users may still edit normal profile fields through the app,
-- but subscription_tier can only be changed by service-role/server paths.

create or replace function public.protect_profile_subscription_tier()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  request_role text := coalesce(auth.role(), '');
begin
  -- Supabase service-role calls, migrations, and admin maintenance may manage
  -- entitlement state. Normal authenticated/anon API requests may not.
  if request_role = 'service_role'
    or current_user in ('postgres', 'service_role', 'supabase_admin')
  then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.subscription_tier is distinct from 'free' then
      raise exception 'subscription_tier is server managed'
        using errcode = '42501';
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.subscription_tier is distinct from old.subscription_tier then
      raise exception 'subscription_tier is server managed'
        using errcode = '42501';
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_subscription_tier
  on public.profiles;

create trigger protect_profile_subscription_tier
  before insert or update on public.profiles
  for each row
  execute function public.protect_profile_subscription_tier();
