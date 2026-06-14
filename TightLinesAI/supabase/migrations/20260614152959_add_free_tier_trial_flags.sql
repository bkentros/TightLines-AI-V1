-- One-time free-tier taste allowances (server-managed; not client writable).

alter table public.profiles
  add column if not exists free_recommender_trial_used_at timestamptz,
  add column if not exists free_water_read_trial_used_at timestamptz,
  add column if not exists free_today_bite_full_used_at timestamptz;

comment on column public.profiles.free_recommender_trial_used_at is
  'Set when a free user consumes their one Tackle Box daily-picks session (includes changeup on that read).';
comment on column public.profiles.free_water_read_trial_used_at is
  'Set when a free user completes their one Water Read lake generation.';
comment on column public.profiles.free_today_bite_full_used_at is
  'Set after a free user receives their one full Today''s Bite report; later today reads are limited.';

create or replace function public.protect_profile_subscription_tier()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  request_role text := coalesce(auth.role(), '');
begin
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
    if new.free_recommender_trial_used_at is not null
      or new.free_water_read_trial_used_at is not null
      or new.free_today_bite_full_used_at is not null
    then
      raise exception 'free trial flags are server managed'
        using errcode = '42501';
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.subscription_tier is distinct from old.subscription_tier then
      raise exception 'subscription_tier is server managed'
        using errcode = '42501';
    end if;
    if new.free_recommender_trial_used_at is distinct from old.free_recommender_trial_used_at
      or new.free_water_read_trial_used_at is distinct from old.free_water_read_trial_used_at
      or new.free_today_bite_full_used_at is distinct from old.free_today_bite_full_used_at
    then
      raise exception 'free trial flags are server managed'
        using errcode = '42501';
    end if;
    return new;
  end if;

  return new;
end;
$$;
