-- Fishing Log — Pass 0: schema backbone, RLS, storage bucket.
--
-- Tables created:
--   species_catalog, lure_catalog, fly_catalog, bait_catalog
--   lure_aliases, fly_aliases, bait_aliases
--   lure_submissions, fly_submissions, bait_submissions
--   report_history
--   fishing_trips, fishing_catches, catch_photos
--
-- All catalog tables are seeded in a later migration (Pass 1). RLS is enabled
-- on every new table; user-data tables get explicit policies (mobile app reads
-- direct via PostgREST), catalog tables get a public-read policy. Storage
-- bucket `catch-photos` is created with per-user folder policies.
--
-- Reuses existing helpers from the water_reader backbone:
--   public.set_generic_updated_at() trigger function
--   pgcrypto, pg_trgm, postgis extensions
-- Defines a new helper:
--   public.normalize_alias_text(text)

-- =====================================================================
-- 1. Helpers
-- =====================================================================

create or replace function public.normalize_alias_text(raw_text text)
returns text
language sql
immutable
as $$
  select trim(
    regexp_replace(
      regexp_replace(
        lower(coalesce(raw_text, '')),
        '[^a-z0-9]+',
        ' ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  );
$$;

-- =====================================================================
-- 2. species_catalog (id is text to match engine canonical IDs)
-- =====================================================================

create table if not exists public.species_catalog (
  id text primary key,
  display_name text not null,
  family text not null,
  image_url text,
  is_active boolean not null default true,
  search_priority integer not null default 1000,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists species_catalog_family_idx
  on public.species_catalog (family)
  where is_active = true;

-- =====================================================================
-- 3. lure_catalog
-- =====================================================================

create table if not exists public.lure_catalog (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  family text not null,
  sub_type text,
  engine_canonical_id text,
  default_colors text[] not null default '{}'::text[],
  default_sizes text[] not null default '{}'::text[],
  image_url text,
  is_active boolean not null default true,
  search_priority integer not null default 1000,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists lure_catalog_canonical_name_trgm_idx
  on public.lure_catalog using gin (canonical_name gin_trgm_ops);

create index if not exists lure_catalog_family_idx
  on public.lure_catalog (family)
  where is_active = true;

-- =====================================================================
-- 4. fly_catalog
-- =====================================================================

create table if not exists public.fly_catalog (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  fly_type text not null,
  sub_type text,
  engine_canonical_id text,
  default_sizes text[] not null default '{}'::text[],
  default_colors text[] not null default '{}'::text[],
  image_url text,
  is_active boolean not null default true,
  search_priority integer not null default 1000,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists fly_catalog_canonical_name_trgm_idx
  on public.fly_catalog using gin (canonical_name gin_trgm_ops);

create index if not exists fly_catalog_type_idx
  on public.fly_catalog (fly_type)
  where is_active = true;

-- =====================================================================
-- 5. bait_catalog
-- =====================================================================

create table if not exists public.bait_catalog (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  family text not null check (family in ('live', 'cut', 'prepared', 'natural_other')),
  sub_type text,
  default_sizes text[] not null default '{}'::text[],
  image_url text,
  is_active boolean not null default true,
  search_priority integer not null default 1000,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists bait_catalog_canonical_name_trgm_idx
  on public.bait_catalog using gin (canonical_name gin_trgm_ops);

create index if not exists bait_catalog_family_idx
  on public.bait_catalog (family)
  where is_active = true;

-- =====================================================================
-- 6. lure_aliases
-- =====================================================================

create table if not exists public.lure_aliases (
  id uuid primary key default gen_random_uuid(),
  lure_id uuid not null references public.lure_catalog (id) on delete cascade,
  alias_text text not null,
  normalized_alias text generated always as (public.normalize_alias_text(alias_text)) stored,
  weight integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  unique (lure_id, normalized_alias)
);

create index if not exists lure_aliases_normalized_trgm_idx
  on public.lure_aliases using gin (normalized_alias gin_trgm_ops);

create index if not exists lure_aliases_lure_id_idx
  on public.lure_aliases (lure_id);

-- =====================================================================
-- 7. fly_aliases
-- =====================================================================

create table if not exists public.fly_aliases (
  id uuid primary key default gen_random_uuid(),
  fly_id uuid not null references public.fly_catalog (id) on delete cascade,
  alias_text text not null,
  normalized_alias text generated always as (public.normalize_alias_text(alias_text)) stored,
  weight integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  unique (fly_id, normalized_alias)
);

create index if not exists fly_aliases_normalized_trgm_idx
  on public.fly_aliases using gin (normalized_alias gin_trgm_ops);

create index if not exists fly_aliases_fly_id_idx
  on public.fly_aliases (fly_id);

-- =====================================================================
-- 8. bait_aliases
-- =====================================================================

create table if not exists public.bait_aliases (
  id uuid primary key default gen_random_uuid(),
  bait_id uuid not null references public.bait_catalog (id) on delete cascade,
  alias_text text not null,
  normalized_alias text generated always as (public.normalize_alias_text(alias_text)) stored,
  weight integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  unique (bait_id, normalized_alias)
);

create index if not exists bait_aliases_normalized_trgm_idx
  on public.bait_aliases using gin (normalized_alias gin_trgm_ops);

create index if not exists bait_aliases_bait_id_idx
  on public.bait_aliases (bait_id);

-- =====================================================================
-- 9. lure_submissions (freeform user entries that didn't match catalog)
-- =====================================================================

create table if not exists public.lure_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  raw_text text not null,
  normalized_text text generated always as (public.normalize_alias_text(raw_text)) stored,
  seen_count integer not null default 1,
  suggested_lure_id uuid references public.lure_catalog (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, normalized_text)
);

create index if not exists lure_submissions_unreviewed_idx
  on public.lure_submissions (created_at desc)
  where reviewed_at is null;

-- =====================================================================
-- 10. fly_submissions
-- =====================================================================

create table if not exists public.fly_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  raw_text text not null,
  normalized_text text generated always as (public.normalize_alias_text(raw_text)) stored,
  seen_count integer not null default 1,
  suggested_fly_id uuid references public.fly_catalog (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, normalized_text)
);

create index if not exists fly_submissions_unreviewed_idx
  on public.fly_submissions (created_at desc)
  where reviewed_at is null;

-- =====================================================================
-- 11. bait_submissions
-- =====================================================================

create table if not exists public.bait_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  raw_text text not null,
  normalized_text text generated always as (public.normalize_alias_text(raw_text)) stored,
  seen_count integer not null default 1,
  suggested_bait_id uuid references public.bait_catalog (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, normalized_text)
);

create index if not exists bait_submissions_unreviewed_idx
  on public.bait_submissions (created_at desc)
  where reviewed_at is null;

-- =====================================================================
-- 12. report_history (every recommender / how_fishing run, archived)
-- =====================================================================

create table if not exists public.report_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('recommender', 'how_fishing')),
  run_at timestamptz not null default timezone('utc', now()),
  run_point geometry(Point, 4326),
  waterbody_id uuid references public.waterbody_index (id) on delete set null,
  species_id text references public.species_catalog (id) on delete set null,
  gear_mode text check (gear_mode in ('lure', 'fly')),
  conditions_json jsonb not null default '{}'::jsonb,
  top_picks_json jsonb not null default '[]'::jsonb,
  raw_response_json jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists report_history_user_run_at_idx
  on public.report_history (user_id, run_at desc);

create index if not exists report_history_run_point_idx
  on public.report_history using gist (run_point);

-- =====================================================================
-- 13. fishing_trips
-- =====================================================================

create table if not exists public.fishing_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  waterbody_id uuid references public.waterbody_index (id) on delete set null,
  waterbody_freeform text,
  start_point geometry(Point, 4326),
  angling_method text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists fishing_trips_user_started_at_idx
  on public.fishing_trips (user_id, started_at desc);

create index if not exists fishing_trips_start_point_idx
  on public.fishing_trips using gist (start_point);

create index if not exists fishing_trips_waterbody_idx
  on public.fishing_trips (waterbody_id)
  where waterbody_id is not null;

-- =====================================================================
-- 14. fishing_catches
-- =====================================================================

create table if not exists public.fishing_catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  trip_id uuid not null references public.fishing_trips (id) on delete cascade,
  caught_at timestamptz not null,
  caught_at_point geometry(Point, 4326) not null,

  -- "no fish" trip-end record (preserves catch-rate denominator math)
  is_skunk_marker boolean not null default false,

  -- gear
  gear_mode text not null check (gear_mode in ('lure', 'fly', 'bait')),

  -- species
  species_id text references public.species_catalog (id) on delete set null,
  species_freeform text,

  -- lure
  lure_id uuid references public.lure_catalog (id) on delete set null,
  lure_freeform text,
  lure_color text,
  lure_size text,

  -- fly
  fly_id uuid references public.fly_catalog (id) on delete set null,
  fly_freeform text,
  fly_size text,

  -- bait
  bait_id uuid references public.bait_catalog (id) on delete set null,
  bait_freeform text,
  bait_size text,

  -- presentation (technique = motion vocab; speed = pace vocab; both nullable)
  technique text,
  speed text,
  strike_quality text,
  structure_tags text[] not null default '{}'::text[],

  -- measurements
  length_in numeric,
  weight_lb numeric,
  depth_ft numeric,

  -- water conditions (user-entered)
  water_temp_f numeric,
  water_clarity text check (water_clarity in ('clear', 'stained', 'dirty')),
  water_level_state text check (water_level_state in ('low', 'normal', 'high', 'rising', 'falling')),

  -- disposition
  disposition text not null default 'released' check (disposition in ('kept', 'released', 'lost')),

  -- auto-derived weather (filled by Pass 2 hook)
  air_temp_f numeric,
  cloud_cover_pct numeric,
  wind_speed_mph numeric,
  wind_dir_deg numeric,
  precip_in numeric,
  pressure_hpa numeric,
  pressure_24h_delta numeric,
  pressure_48h_delta numeric,

  -- auto-derived astronomy / solunar
  sunrise_at timestamptz,
  sunset_at timestamptz,
  minutes_from_sunrise integer,
  minutes_from_sunset integer,
  moon_phase numeric,
  moon_illumination_pct numeric,
  solunar_period text check (solunar_period in ('major', 'minor', 'off')),

  -- auto-fill metadata
  weather_source text,
  weather_filled_at timestamptz,

  -- optional attached recommender / how_fishing report
  report_id uuid references public.report_history (id) on delete set null,

  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists fishing_catches_user_caught_at_idx
  on public.fishing_catches (user_id, caught_at desc);

create index if not exists fishing_catches_trip_idx
  on public.fishing_catches (trip_id);

create index if not exists fishing_catches_species_idx
  on public.fishing_catches (species_id)
  where species_id is not null;

create index if not exists fishing_catches_lure_idx
  on public.fishing_catches (lure_id)
  where lure_id is not null;

create index if not exists fishing_catches_fly_idx
  on public.fishing_catches (fly_id)
  where fly_id is not null;

create index if not exists fishing_catches_bait_idx
  on public.fishing_catches (bait_id)
  where bait_id is not null;

create index if not exists fishing_catches_report_idx
  on public.fishing_catches (report_id)
  where report_id is not null;

create index if not exists fishing_catches_caught_at_point_idx
  on public.fishing_catches using gist (caught_at_point);

-- =====================================================================
-- 15. catch_photos
-- =====================================================================

create table if not exists public.catch_photos (
  id uuid primary key default gen_random_uuid(),
  catch_id uuid not null references public.fishing_catches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  position integer not null default 0,
  width integer,
  height integer,
  taken_at_exif timestamptz,
  caption text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (catch_id, position)
);

create index if not exists catch_photos_catch_idx
  on public.catch_photos (catch_id, position);

create index if not exists catch_photos_user_idx
  on public.catch_photos (user_id);

-- =====================================================================
-- 16. updated_at triggers (reuse existing public.set_generic_updated_at)
-- =====================================================================

drop trigger if exists species_catalog_set_updated_at on public.species_catalog;
create trigger species_catalog_set_updated_at
  before update on public.species_catalog
  for each row execute function public.set_generic_updated_at();

drop trigger if exists lure_catalog_set_updated_at on public.lure_catalog;
create trigger lure_catalog_set_updated_at
  before update on public.lure_catalog
  for each row execute function public.set_generic_updated_at();

drop trigger if exists fly_catalog_set_updated_at on public.fly_catalog;
create trigger fly_catalog_set_updated_at
  before update on public.fly_catalog
  for each row execute function public.set_generic_updated_at();

drop trigger if exists bait_catalog_set_updated_at on public.bait_catalog;
create trigger bait_catalog_set_updated_at
  before update on public.bait_catalog
  for each row execute function public.set_generic_updated_at();

drop trigger if exists lure_submissions_set_updated_at on public.lure_submissions;
create trigger lure_submissions_set_updated_at
  before update on public.lure_submissions
  for each row execute function public.set_generic_updated_at();

drop trigger if exists fly_submissions_set_updated_at on public.fly_submissions;
create trigger fly_submissions_set_updated_at
  before update on public.fly_submissions
  for each row execute function public.set_generic_updated_at();

drop trigger if exists bait_submissions_set_updated_at on public.bait_submissions;
create trigger bait_submissions_set_updated_at
  before update on public.bait_submissions
  for each row execute function public.set_generic_updated_at();

drop trigger if exists fishing_trips_set_updated_at on public.fishing_trips;
create trigger fishing_trips_set_updated_at
  before update on public.fishing_trips
  for each row execute function public.set_generic_updated_at();

drop trigger if exists fishing_catches_set_updated_at on public.fishing_catches;
create trigger fishing_catches_set_updated_at
  before update on public.fishing_catches
  for each row execute function public.set_generic_updated_at();

-- =====================================================================
-- 17. Enable RLS on all new tables
-- =====================================================================

alter table public.species_catalog    enable row level security;
alter table public.lure_catalog       enable row level security;
alter table public.fly_catalog        enable row level security;
alter table public.bait_catalog       enable row level security;
alter table public.lure_aliases       enable row level security;
alter table public.fly_aliases        enable row level security;
alter table public.bait_aliases       enable row level security;
alter table public.lure_submissions   enable row level security;
alter table public.fly_submissions    enable row level security;
alter table public.bait_submissions   enable row level security;
alter table public.report_history     enable row level security;
alter table public.fishing_trips      enable row level security;
alter table public.fishing_catches    enable row level security;
alter table public.catch_photos       enable row level security;

-- =====================================================================
-- 18. RLS policies — catalog tables (public read; writes via service role)
-- =====================================================================

drop policy if exists "species_catalog_public_read" on public.species_catalog;
create policy "species_catalog_public_read"
  on public.species_catalog for select
  using (true);

drop policy if exists "lure_catalog_public_read" on public.lure_catalog;
create policy "lure_catalog_public_read"
  on public.lure_catalog for select
  using (true);

drop policy if exists "fly_catalog_public_read" on public.fly_catalog;
create policy "fly_catalog_public_read"
  on public.fly_catalog for select
  using (true);

drop policy if exists "bait_catalog_public_read" on public.bait_catalog;
create policy "bait_catalog_public_read"
  on public.bait_catalog for select
  using (true);

drop policy if exists "lure_aliases_public_read" on public.lure_aliases;
create policy "lure_aliases_public_read"
  on public.lure_aliases for select
  using (true);

drop policy if exists "fly_aliases_public_read" on public.fly_aliases;
create policy "fly_aliases_public_read"
  on public.fly_aliases for select
  using (true);

drop policy if exists "bait_aliases_public_read" on public.bait_aliases;
create policy "bait_aliases_public_read"
  on public.bait_aliases for select
  using (true);

-- =====================================================================
-- 19. RLS policies — user-data tables (CRUD on own rows only)
-- =====================================================================

-- fishing_trips
drop policy if exists "fishing_trips_select_own" on public.fishing_trips;
create policy "fishing_trips_select_own"
  on public.fishing_trips for select
  using (auth.uid() = user_id);

drop policy if exists "fishing_trips_insert_own" on public.fishing_trips;
create policy "fishing_trips_insert_own"
  on public.fishing_trips for insert
  with check (auth.uid() = user_id);

drop policy if exists "fishing_trips_update_own" on public.fishing_trips;
create policy "fishing_trips_update_own"
  on public.fishing_trips for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "fishing_trips_delete_own" on public.fishing_trips;
create policy "fishing_trips_delete_own"
  on public.fishing_trips for delete
  using (auth.uid() = user_id);

-- fishing_catches
drop policy if exists "fishing_catches_select_own" on public.fishing_catches;
create policy "fishing_catches_select_own"
  on public.fishing_catches for select
  using (auth.uid() = user_id);

drop policy if exists "fishing_catches_insert_own" on public.fishing_catches;
create policy "fishing_catches_insert_own"
  on public.fishing_catches for insert
  with check (auth.uid() = user_id);

drop policy if exists "fishing_catches_update_own" on public.fishing_catches;
create policy "fishing_catches_update_own"
  on public.fishing_catches for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "fishing_catches_delete_own" on public.fishing_catches;
create policy "fishing_catches_delete_own"
  on public.fishing_catches for delete
  using (auth.uid() = user_id);

-- catch_photos
drop policy if exists "catch_photos_select_own" on public.catch_photos;
create policy "catch_photos_select_own"
  on public.catch_photos for select
  using (auth.uid() = user_id);

drop policy if exists "catch_photos_insert_own" on public.catch_photos;
create policy "catch_photos_insert_own"
  on public.catch_photos for insert
  with check (auth.uid() = user_id);

drop policy if exists "catch_photos_update_own" on public.catch_photos;
create policy "catch_photos_update_own"
  on public.catch_photos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "catch_photos_delete_own" on public.catch_photos;
create policy "catch_photos_delete_own"
  on public.catch_photos for delete
  using (auth.uid() = user_id);

-- lure_submissions
drop policy if exists "lure_submissions_select_own" on public.lure_submissions;
create policy "lure_submissions_select_own"
  on public.lure_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "lure_submissions_insert_own" on public.lure_submissions;
create policy "lure_submissions_insert_own"
  on public.lure_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "lure_submissions_update_own" on public.lure_submissions;
create policy "lure_submissions_update_own"
  on public.lure_submissions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- fly_submissions
drop policy if exists "fly_submissions_select_own" on public.fly_submissions;
create policy "fly_submissions_select_own"
  on public.fly_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "fly_submissions_insert_own" on public.fly_submissions;
create policy "fly_submissions_insert_own"
  on public.fly_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "fly_submissions_update_own" on public.fly_submissions;
create policy "fly_submissions_update_own"
  on public.fly_submissions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- bait_submissions
drop policy if exists "bait_submissions_select_own" on public.bait_submissions;
create policy "bait_submissions_select_own"
  on public.bait_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "bait_submissions_insert_own" on public.bait_submissions;
create policy "bait_submissions_insert_own"
  on public.bait_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "bait_submissions_update_own" on public.bait_submissions;
create policy "bait_submissions_update_own"
  on public.bait_submissions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- report_history
drop policy if exists "report_history_select_own" on public.report_history;
create policy "report_history_select_own"
  on public.report_history for select
  using (auth.uid() = user_id);

drop policy if exists "report_history_insert_own" on public.report_history;
create policy "report_history_insert_own"
  on public.report_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "report_history_delete_own" on public.report_history;
create policy "report_history_delete_own"
  on public.report_history for delete
  using (auth.uid() = user_id);

-- =====================================================================
-- 20. Storage bucket — catch-photos (private; first folder segment = user_id)
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('catch-photos', 'catch-photos', false)
on conflict (id) do nothing;

drop policy if exists "catch_photos_storage_select_own" on storage.objects;
create policy "catch_photos_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'catch-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "catch_photos_storage_insert_own" on storage.objects;
create policy "catch_photos_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'catch-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "catch_photos_storage_update_own" on storage.objects;
create policy "catch_photos_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'catch-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "catch_photos_storage_delete_own" on storage.objects;
create policy "catch_photos_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'catch-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
