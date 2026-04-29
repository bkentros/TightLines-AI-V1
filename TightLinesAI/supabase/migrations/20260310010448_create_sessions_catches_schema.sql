
-- ─── sessions ────────────────────────────────────────────────────────────────
-- A fishing session (trip). Catches are children of sessions.
-- All condition data is captured at the session level.
create table public.sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,

  -- Timing
  date                date not null,
  start_time          timestamptz,
  end_time            timestamptz,

  -- Location
  location            geography(Point, 4326),       -- PostGIS: exact GPS (never shared publicly)
  region_name         text,                          -- e.g. "Tampa Bay Inshore"
  body_of_water       text,                          -- e.g. "Hillsborough River"
  water_type          text check (water_type in ('freshwater','saltwater','brackish')),
  body_of_water_type  text check (body_of_water_type in (
                        'river','lake','pond','surf_beach','inshore_flats',
                        'offshore','creek','reservoir','other')),
  privacy_level       text not null default 'regional'
                        check (privacy_level in ('exact','regional','hidden')),

  -- Conditions (captured at session level — not duplicated per catch)
  air_temp_f          numeric(5,1),
  water_temp_f        numeric(5,1),
  wind_speed_mph      numeric(5,1),
  wind_direction      text,
  barometric_pressure numeric(6,2),
  cloud_cover_pct     integer check (cloud_cover_pct between 0 and 100),
  precipitation       text,
  tide_phase          text,
  tide_time           timestamptz,
  moon_phase          text,
  solunar_period      text,
  water_clarity       text check (water_clarity in ('clear','stained','murky','muddy')),
  bottom_composition  text,

  -- AI context
  ai_session_id       uuid,                          -- FK added after ai_sessions table created

  -- Metadata
  shared_to_feed      boolean not null default false,
  notes               text,
  voice_transcript    text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute procedure public.handle_updated_at();

create index sessions_user_id_idx on public.sessions(user_id);
create index sessions_date_idx on public.sessions(date desc);
create index sessions_location_idx on public.sessions using gist(location);

alter table public.sessions enable row level security;

create policy "sessions_select_own"
  on public.sessions for select
  to authenticated
  using (user_id = auth.uid());

create policy "sessions_insert_own"
  on public.sessions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "sessions_update_own"
  on public.sessions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "sessions_delete_own"
  on public.sessions for delete
  to authenticated
  using (user_id = auth.uid());


-- ─── catches ─────────────────────────────────────────────────────────────────
-- Each discrete fish caught. Conservation-grade richness per record.
create table public.catches (
  id                  uuid primary key default gen_random_uuid(),
  session_id          uuid not null references public.sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,

  -- Species & size (conservation value: species + size + location + conditions)
  species             text not null,
  length_in           numeric(6,2),                  -- inches
  weight_lbs          numeric(6,3),                  -- lbs
  quantity            integer not null default 1,
  release_status      text not null default 'released'
                        check (release_status in ('released','kept','unknown')),

  -- Timing
  caught_at           timestamptz,

  -- Tackle
  lure_name           text,
  lure_color          text,
  lure_size           text,
  lure_type           text,                           -- e.g. "soft plastic", "crankbait", "dry fly"
  retrieval_method    text,                           -- e.g. "slow roll", "dead drift"

  -- Location detail within session
  depth_ft            numeric(6,1),

  -- Photo
  photo_url           text,

  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger catches_updated_at
  before update on public.catches
  for each row execute procedure public.handle_updated_at();

create index catches_session_id_idx on public.catches(session_id);
create index catches_user_id_idx on public.catches(user_id);
create index catches_species_idx on public.catches(species);

alter table public.catches enable row level security;

create policy "catches_select_own"
  on public.catches for select
  to authenticated
  using (user_id = auth.uid());

create policy "catches_insert_own"
  on public.catches for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "catches_update_own"
  on public.catches for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "catches_delete_own"
  on public.catches for delete
  to authenticated
  using (user_id = auth.uid());
;
