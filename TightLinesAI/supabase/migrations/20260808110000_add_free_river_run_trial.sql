-- One lifetime full River Migration read for free accounts. The selected
-- report remains replayable only for the exact condition-refresh identity
-- that was originally claimed.

alter table public.profiles
  add column if not exists free_river_run_trial_used_at timestamptz,
  add column if not exists free_river_run_trial_river_id text,
  add column if not exists free_river_run_trial_run_id text,
  add column if not exists free_river_run_trial_presentation_state text,
  add column if not exists free_river_run_trial_local_date date,
  add column if not exists free_river_run_trial_refresh_slot text,
  add column if not exists free_river_run_trial_engine_version text,
  add column if not exists free_river_run_trial_config_version text;

comment on column public.profiles.free_river_run_trial_used_at is
  'Set when a free user successfully claims their one lifetime full River Migration snapshot.';
comment on column public.profiles.free_river_run_trial_refresh_slot is
  'The claimed River Migration condition slot; replay expires when the active slot changes.';

alter table public.profiles
  drop constraint if exists profiles_free_river_run_trial_complete_check;

alter table public.profiles
  add constraint profiles_free_river_run_trial_complete_check check (
    (
      free_river_run_trial_used_at is null
      and free_river_run_trial_river_id is null
      and free_river_run_trial_run_id is null
      and free_river_run_trial_presentation_state is null
      and free_river_run_trial_local_date is null
      and free_river_run_trial_refresh_slot is null
      and free_river_run_trial_engine_version is null
      and free_river_run_trial_config_version is null
    )
    or
    (
      free_river_run_trial_used_at is not null
      and free_river_run_trial_river_id is not null
      and free_river_run_trial_run_id is not null
      and free_river_run_trial_presentation_state is not null
      and free_river_run_trial_local_date is not null
      and free_river_run_trial_refresh_slot is not null
      and free_river_run_trial_engine_version is not null
      and free_river_run_trial_config_version is not null
    )
  );

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
      or new.free_river_run_trial_used_at is not null
      or new.free_river_run_trial_river_id is not null
      or new.free_river_run_trial_run_id is not null
      or new.free_river_run_trial_presentation_state is not null
      or new.free_river_run_trial_local_date is not null
      or new.free_river_run_trial_refresh_slot is not null
      or new.free_river_run_trial_engine_version is not null
      or new.free_river_run_trial_config_version is not null
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
      or new.free_river_run_trial_used_at is distinct from old.free_river_run_trial_used_at
      or new.free_river_run_trial_river_id is distinct from old.free_river_run_trial_river_id
      or new.free_river_run_trial_run_id is distinct from old.free_river_run_trial_run_id
      or new.free_river_run_trial_presentation_state is distinct from old.free_river_run_trial_presentation_state
      or new.free_river_run_trial_local_date is distinct from old.free_river_run_trial_local_date
      or new.free_river_run_trial_refresh_slot is distinct from old.free_river_run_trial_refresh_slot
      or new.free_river_run_trial_engine_version is distinct from old.free_river_run_trial_engine_version
      or new.free_river_run_trial_config_version is distinct from old.free_river_run_trial_config_version
    then
      raise exception 'free trial flags are server managed'
        using errcode = '42501';
    end if;
    return new;
  end if;

  return new;
end;
$$;
