
-- ─── profiles ───────────────────────────────────────────────────────────────
-- One row per auth user. Created during onboarding (step 3 completion).
create table public.profiles (
  id                  uuid references auth.users on delete cascade primary key,
  username            text unique not null,
  display_name        text,
  home_region         text,           -- human-readable e.g. "Tampa Bay, FL"
  home_state          text,           -- e.g. "FL"
  home_city           text,           -- e.g. "Tampa"
  fishing_mode        text not null default 'both'
                        check (fishing_mode in ('conventional', 'fly', 'both')),
  preferred_units     text not null default 'imperial'
                        check (preferred_units in ('imperial', 'metric')),
  target_species      text[] not null default '{}',
  subscription_tier   text not null default 'free'
                        check (subscription_tier in ('free', 'angler', 'master_angler')),
  onboarding_complete boolean not null default false,
  avatar_url          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at on any row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.profiles enable row level security;

-- Any authenticated user can read any profile (community feed needs usernames)
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only insert/update/delete their own profile
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_delete_own"
  on public.profiles for delete
  to authenticated
  using (id = auth.uid());
;
