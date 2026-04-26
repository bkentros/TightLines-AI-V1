create table if not exists public.recommender_recent_history (
  user_id uuid not null references public.profiles (id) on delete cascade,
  local_date date not null,
  species text not null,
  region_key text not null,
  water_type text not null,
  gear_mode text not null check (gear_mode in ('lure', 'fly')),
  archetype_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (
    user_id,
    local_date,
    species,
    region_key,
    water_type,
    gear_mode,
    archetype_id
  )
);

create index if not exists recommender_recent_history_lookup_idx
  on public.recommender_recent_history (
    user_id,
    species,
    region_key,
    water_type,
    local_date desc
  );

alter table public.recommender_recent_history enable row level security;;
