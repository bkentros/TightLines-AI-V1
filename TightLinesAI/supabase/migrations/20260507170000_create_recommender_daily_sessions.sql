create table if not exists public.recommender_daily_sessions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  local_date date not null,
  lat_key text not null,
  lon_key text not null,
  state_code text not null,
  region_key text not null,
  species text not null,
  water_type text not null,
  water_clarity text not null,
  engine_version text not null,
  active_variant text not null check (active_variant in ('A', 'B')),
  refreshes_used integer not null default 0 check (refreshes_used between 0 and 1),
  variant_a_response jsonb not null,
  variant_b_response jsonb null,
  cache_expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (
    user_id,
    local_date,
    lat_key,
    lon_key,
    state_code,
    species,
    region_key,
    water_type,
    water_clarity,
    engine_version
  )
);

create index if not exists recommender_daily_sessions_user_lookup_idx
  on public.recommender_daily_sessions (
    user_id,
    local_date desc,
    species,
    region_key,
    water_type
  );

alter table public.recommender_daily_sessions enable row level security;
