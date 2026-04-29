# FinFindr Fishing Log — Agent Build Plan

**Status:** Active. Build in progress on branch `claude/xenodochial-raman-b0cc73`.

**Document purpose:** Single source of truth for the FinFindr Fishing Log feature. Designed as a handoff doc — any agent picking this up cold should be able to execute Pass 2 onward without asking the product owner clarifying questions.

**Audience:** AI coding agents, product owner (Brandon), future developers.

**Core rule:** Don't touch Water Reader, recommender, or engine code. The Fishing Log is purely additive — new tables, new migrations, new screens, new edge functions where needed.

---

## 1. Context

### What FinFindr is
FinFindr is a deterministic fishing intelligence app for mainland USA, owned and built by Brandon (the founder/developer). The repo is named `TightLines AI V1` from older branding. The product-facing brand is **FinFindr** — wordmark renders as `FINFINDR` followed by a red period dot (the `paper.red` token from `lib/theme.ts`). The wordmark appears in `app/(tabs)/index.tsx` (line ~565) and `app/(onboarding)/step-1-welcome.tsx`.

### What the Fishing Log is
The Fishing Log is FinFindr's biggest planned consumer feature. The goal: a fishing log that feels like one tap to use, captures rich structured data quietly, and rewards the user immediately with personalized insights.

### Why it matters
Existing fishing logs (Fishbrain, ANGLR, Fishidy) all die in week 3 because the friction-to-value ratio is wrong — logging takes effort now, value arrives later. Brandon wants to invert this: instant gratification at log time + deterministic personal-pattern insights nobody else surfaces. This feature is positioned as defining for the app.

### Brand positioning: AI-free
The Fishing Log uses **zero LLMs**. Voice transcription is on-device iOS speech recognition (free, offline). The "smart parser" that extracts species/lure/size/etc. from the transcript is a deterministic dictionary fuzzy-match against the catalog tables via pg_trgm. Stats are pure SQL. Reports are templated insights. Brandon explicitly chose this for marketing positioning ("your data, your patterns, no AI guessing") and for cost.

---

## 2. Tech stack

| Layer | What |
|---|---|
| Frontend | Expo SDK 55, React Native 0.83, expo-router, TypeScript |
| Platform | **iOS only** |
| Backend | Supabase (Postgres + Storage + Auth + Edge Functions) |
| Postgres extensions enabled | `postgis`, `pgcrypto`, `pg_trgm` |
| Theme | "FinFindr paper language" — `lib/theme.ts`, `components/paper/*` |
| State | Zustand stores in `store/` |
| Routing | expo-router (file-based) under `app/` |
| Navigation tabs | `app/(tabs)/` — `index.tsx`, `log.tsx`, `settings.tsx` |
| Modules already installed | `expo-audio`, `expo-camera`, `expo-image-picker`, `expo-location`, `expo-notifications`, `expo-haptics`, `expo-sqlite`, `expo-dev-client` |
| External APIs in use | Open-Meteo (free, no key, historical weather), USGS NHD via existing `waterbody_index` |

---

## 3. Locked architectural decisions

These are settled. Don't second-guess unless Brandon explicitly reopens them.

1. **AI-free.** No LLM in the fishing log feature, period.
2. **Voice = native iOS STT** (`@react-native-voice/voice` lib, to be added in Pass 4). No Whisper.
3. **Voice parser = deterministic.** Tokenize transcript → fuzzy-match against species/lure/fly/bait + alias tables via pg_trgm RPCs. Number/regex for size/weight/time/disposition. Confidence-thresholded — low confidence leaves field blank.
4. **Direct PostgREST + RLS for log tables.** This DIVERGES from the rest of the app (recommender/water_reader use service-role edge functions). Done because the log feature has high read volume and routing through edge functions would add latency. Catalog tables: public read. User-data tables: per-row RLS via `auth.uid() = user_id`.
5. **Open-Meteo Historical Weather** for archive weather lookups (free, no key, NOAA-sourced; ~80 years of history).
6. **Local solunar / astronomy calculation** (no API). Library TBD by implementing agent — `suncalc` is a strong candidate.
7. **Waterbody resolution** via existing `public.waterbody_index` table (USGS NHD-backed, already populated nationally — see `supabase/migrations/20260424133337_water_reader_waterbody_backbone.sql`).
8. **Photos via `expo-image-picker` → Supabase Storage `catch-photos` bucket.** Path enforced as `{user_id}/{...}` by RLS on `storage.objects`. Draft uploads land at `{user_id}/draft/{tmp_id}/{photo_id}.jpg` and get reparented to `{user_id}/{catch_id}/{photo_id}.jpg` on save.
9. **Manual trip start (button).** GPS-dwell auto-trip detection deferred to v2.
10. **Exact GPS coords stored.** No fuzzing — there's no social/sharing surface where coords are exposed.
11. **Determinism over LLM everywhere possible.** Stats = SQL. Insights = pure functions. Reports = templates. The only LLM that *might* appear later is an *optional* gpt-4o-mini "tone polish" on the weekly report — post-launch, not v1.
12. **No social, no leaderboards, no feed, no friends.** v1 is a personal log. The only social surface is a one-tap share-to-Instagram/etc. share card with FINFINDR. wordmark.
13. **Skunked trips logged via `is_skunk_marker = true` rows in `fishing_catches`.** Preserves catch-rate denominator math without a separate table.
14. **Tiered catalog model.** Canonical types in `lure_catalog`/`fly_catalog`/`bait_catalog`/`species_catalog` are the source of truth. Brand names + regional slang live in the parallel `_aliases` tables. Freeform user entries that don't match anything go into `_submissions` tables (per-user upsert with `seen_count`) — these become a content pipeline.
15. **No new dependencies without flagging Brandon.** Pass 4 needs `@react-native-voice/voice`. Pass 6 needs a chart lib. Pass 8 needs `@shopify/react-native-skia`. All require explicit go before adding.

---

## 4. Don't touch

- **Water Reader** code (active dev on the same branch). Files: `app/water-reader.tsx`, `lib/waterReader*.ts`, `lib/usgsTnmAerialSnapshot.ts`, `supabase/migrations/*water_reader*`, `supabase/functions/get-water-reader*` if it exists.
- **Recommender / engine** code. Files: `lib/recommender*.ts`, `lib/howFishing*.ts`, `app/recommender.tsx`, `app/how-fishing*.tsx`, `supabase/functions/recommender/*`, `supabase/functions/_shared/recommenderEngine/*`, `supabase/functions/_shared/howFishingEngine/*`.
- **How's Fishing** flow.
- **Engine canonical species list:** `largemouth_bass`, `smallmouth_bass`, `northern_pike`, `trout`. Referenced by `engine_canonical_id` columns in our catalogs but **owned by the engine**. Don't add to or rename them.
- **Engine canonical lure list:** see `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts` for the full set. Referenced by `lure_catalog.engine_canonical_id`. Read-only.

The fishing log is purely additive. New files, new tables, new migrations.

---

## 5. Working conventions

### Commit style
Match Brandon's existing history (`git log --oneline main..HEAD` shows the pattern):
- Single-purpose commits — one observable change per commit
- Imperative mood, ~50 char subject line max ("Add fishing log schema backbone", "Seed lure_catalog with 105 canonical lure types", "Wire Water Reader mock result to aerial contract")
- Body explains the why and the what landed (multi-line OK)
- No emoji
- Always include `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` trailer

### Migration filename convention
`YYYYMMDDHHMMSS_short_description.sql` in `TightLinesAI/supabase/migrations/`. The most recent fishing-log migration on disk is `20260428090000_seed_bait_aliases.sql`. **The next migration must use a timestamp later than the most recent migration on disk** (check with `ls TightLinesAI/supabase/migrations/ | tail -5`). When in doubt about ordering vs concurrent Water Reader migrations on the same branch, bump the hour or rebase.

### SQL style
- Lowercase keywords (`create table`, `if not exists`, `references`, etc.)
- Idempotent: always `create table if not exists`, `create index if not exists`, `drop policy if exists ... ; create policy ...`, `drop trigger if exists ... ; create trigger ...`
- `timestamptz` columns default `timezone('utc', now())`
- Reuse existing helpers: `public.set_generic_updated_at()` (in `20260424133337_water_reader_waterbody_backbone.sql`), `public.normalize_alias_text()` (in our Pass 0 migration)
- RLS: enable + define explicit per-table policies for fishing log tables (DIVERGES from engine pattern — intentional)
- Storage policies: enforce `{user_id}/...` path via `storage.foldername(name))[1] = auth.uid()::text`

### File organization
```
TightLinesAI/
  supabase/migrations/   ← all SQL migrations
  supabase/functions/    ← edge functions (one folder per fn)
  app/                   ← expo-router screens (file-based)
  components/paper/      ← FinFindr paper-theme primitives
  components/            ← other shared components
  lib/                   ← utilities, types, supabase client, theme
  store/                 ← Zustand stores
  docs/                  ← this file lives here
```

### One commit ≈ one observable change
Don't bundle. Each Pass below typically maps to multiple sub-commits.

### Validation expectations
- After writing any migration, the agent runs `supabase migration up` (NOT `supabase db reset` — Brandon has local data he wants to preserve).
- Don't run `supabase db push` to remote; Brandon does that himself.
- Visually verify in Supabase Studio (`http://localhost:54323`) for new tables / RLS / data.

---

## 6. Repo map

```
TightLinesAI/
├── app/                     # expo-router screens
│   ├── (auth)/
│   ├── (onboarding)/
│   │   ├── step-1-welcome.tsx     # FINFINDR wordmark reference
│   │   ├── step-2-preferences.tsx
│   │   └── step-3-location.tsx
│   ├── (tabs)/
│   │   ├── index.tsx              # Home — Water Reader / How's Fishing entry
│   │   ├── log.tsx                # Log tab — currently mock arrays, Pass 3 wiring
│   │   └── settings.tsx
│   ├── new-entry.tsx              # Catch entry form — currently mock, Pass 2 builds fresh
│   ├── log-detail.tsx             # Single catch view — currently mock, Pass 3
│   ├── personal-bests.tsx         # PR view — currently mock
│   ├── recommender.tsx            # DON'T TOUCH (Pass 7 may add a tiny additive call after the engine call returns)
│   ├── water-reader.tsx           # DON'T TOUCH
│   └── how-fishing*.tsx           # DON'T TOUCH (Pass 7 may add a tiny additive call)
├── components/
│   └── paper/                     # FinFindr paper-theme primitives
│       — PaperCard, PaperBackground, SectionEyebrow, TierPill, MedalBadge,
│         LurePopper, TopographicLines, LiveConditionsPaperCard, etc.
├── lib/
│   ├── theme.ts                   # paper, paperFonts, paperRadius, paperShadows, paperSpacing, paper.red
│   ├── supabase.ts                # supabase client (anon key for auth, edge fns for engine reads)
│   ├── auth.ts
│   ├── waterReader*.ts            # DON'T TOUCH
│   └── recommender*.ts            # DON'T TOUCH
├── store/                         # Zustand stores
└── supabase/
    ├── migrations/
    │   — 11 fishing_log migrations (see Pass 0/1 below) +
    │     dozens of water_reader migrations (DON'T TOUCH)
    └── functions/
        ├── recommender/           # DON'T TOUCH
        ├── get-environment/       # DON'T TOUCH
        └── _shared/               # DON'T TOUCH
```

---

## 7. Schema reference (already migrated)

### 14 fishing-log tables in scope

User-data tables (per-row RLS via `auth.uid() = user_id`):
- `fishing_trips`
- `fishing_catches`
- `catch_photos`
- `lure_submissions`, `fly_submissions`, `bait_submissions`
- `report_history`

Catalog tables (public read; service-role write):
- `species_catalog`, `lure_catalog`, `fly_catalog`, `bait_catalog`
- `species_aliases`, `lure_aliases`, `fly_aliases`, `bait_aliases`

### `fishing_trips`
| col | type | notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `user_id` | `uuid` | FK `profiles(id)` cascade |
| `started_at` | `timestamptz` | default utc now |
| `ended_at` | `timestamptz` | null until trip closed |
| `waterbody_id` | `uuid` | FK `waterbody_index(id)` (existing table) |
| `waterbody_freeform` | `text` | when no NHD match |
| `start_point` | `geometry(Point, 4326)` | PostGIS, nullable |
| `angling_method` | `text` | freeform: `boat`, `kayak`, `wade`, `shore`, `ice`, `float_tube`, `pontoon`, etc. |
| `notes` | `text` | |
| `created_at`, `updated_at` | `timestamptz` | |

Indexes: `(user_id, started_at desc)`, GIST on `start_point`, partial on `waterbody_id`.

### `fishing_catches`
The big one. Full column list:

**Identity / FK**
- `id uuid PK`, `user_id uuid → profiles(id)`, `trip_id uuid → fishing_trips(id) ON DELETE CASCADE`

**Time / location**
- `caught_at timestamptz NOT NULL`
- `caught_at_point geometry(Point, 4326) NOT NULL`

**Skunk marker**
- `is_skunk_marker boolean DEFAULT false`

**Gear**
- `gear_mode text NOT NULL CHECK ('lure', 'fly', 'bait')`

**Species**
- `species_id text → species_catalog(id) ON DELETE SET NULL`
- `species_freeform text`

**Lure**
- `lure_id uuid → lure_catalog(id)`, `lure_freeform text`, `lure_color text`, `lure_size text`

**Fly**
- `fly_id uuid → fly_catalog(id)`, `fly_freeform text`, `fly_size text`

**Bait**
- `bait_id uuid → bait_catalog(id)`, `bait_freeform text`, `bait_size text`

**Presentation**
- `technique text` (motion vocab — see Pass 2)
- `speed text` (pace vocab — see Pass 2)
- `strike_quality text` (no CHECK; freeform: `clean`, `follow_then_strike`, `deep_hook`, `foul`, `short_strike`)
- `structure_tags text[] DEFAULT '{}'` (chips: `rocks`, `weeds`, `dock`, `brush`, `drop_off`, `point`, `flat`, `channel`, `submerged_timber`, `lily_pads`, `current_seam`, `bridge_piling`, `bluff_wall`, `mid_water_suspended`)

**Measurements**
- `length_in numeric`, `weight_lb numeric`, `depth_ft numeric`

**Water (user-entered)**
- `water_temp_f numeric`
- `water_clarity text CHECK ('clear', 'stained', 'dirty')`
- `water_level_state text CHECK ('low', 'normal', 'high', 'rising', 'falling')`

**Disposition**
- `disposition text NOT NULL DEFAULT 'released' CHECK ('kept', 'released', 'lost')`

**Auto-derived weather (filled by Pass 2 hook):**
- `air_temp_f`, `cloud_cover_pct`, `wind_speed_mph`, `wind_dir_deg`, `precip_in`
- `pressure_hpa`, `pressure_24h_delta`, `pressure_48h_delta`

**Auto-derived solunar / astronomy:**
- `sunrise_at timestamptz`, `sunset_at timestamptz`
- `minutes_from_sunrise int`, `minutes_from_sunset int`
- `moon_phase numeric`, `moon_illumination_pct numeric`
- `solunar_period text CHECK ('major', 'minor', 'off')`

**Auto-fill metadata**
- `weather_source text` (e.g., `'open_meteo'`)
- `weather_filled_at timestamptz`

**Optional report attach**
- `report_id uuid → report_history(id) ON DELETE SET NULL`

- `notes text`, `created_at`, `updated_at`

Indexes: `(user_id, caught_at desc)`, `(trip_id)`, partial on `(species_id)`, `(lure_id)`, `(fly_id)`, `(bait_id)`, `(report_id)`, GIST on `caught_at_point`.

### `catch_photos`
- `id uuid PK`, `catch_id uuid → fishing_catches(id) ON DELETE CASCADE`, `user_id uuid → profiles`
- `storage_path text NOT NULL` (path inside `catch-photos` bucket)
- `position int DEFAULT 0` — for ordering; unique on `(catch_id, position)`
- `width int`, `height int`, `taken_at_exif timestamptz`
- `caption text`
- `created_at`

### Catalog tables (4 — species/lure/fly/bait)
Each has `canonical_name text` (unique index for idempotent upserts), a family-style column (`family` for lure/bait, `fly_type` for fly, `family` for species), `sub_type text`, `default_colors text[]`, `default_sizes text[]`, `image_url text`, `is_active boolean`, `search_priority integer DEFAULT 1000`, `created_at`, `updated_at`.

`lure_catalog` and `fly_catalog` additionally have `engine_canonical_id text`.
`species_catalog.id` is `text` (matches engine canonical IDs); also has `engine_canonical_id text`.

### Alias tables (4 — species/lure/fly/bait)
Each has: `id uuid PK`, FK to its catalog (text for species, uuid for the rest), `alias_text text NOT NULL`, `normalized_alias text GENERATED ALWAYS AS (public.normalize_alias_text(alias_text)) STORED`, `weight integer DEFAULT 100`, `created_at`. Unique on `(target_id, normalized_alias)`. Trigram GIN index on `normalized_alias` powers fuzzy match for voice parsing and typeahead.

### Submission tables (3 — lure/fly/bait)
- `id uuid PK`, `user_id uuid → profiles`, `raw_text text`, `normalized_text` (generated), `seen_count int DEFAULT 1`, `suggested_*_id` (FK back to canonical, nullable), `reviewed_at timestamptz`, `created_at`, `updated_at`. Unique on `(user_id, normalized_text)` — same user typing same thing increments `seen_count` via UPSERT.

### `report_history`
- `id uuid PK`, `user_id uuid → profiles`
- `kind text CHECK ('recommender', 'how_fishing')`
- `run_at timestamptz`, `run_point geometry(Point, 4326)`, `waterbody_id uuid → waterbody_index`
- `species_id text → species_catalog`, `gear_mode text CHECK ('lure', 'fly')`
- `conditions_json jsonb`, `top_picks_json jsonb`, `raw_response_json jsonb`
- `created_at`

### Storage bucket: `catch-photos`
Private bucket. RLS policies on `storage.objects` enforce: `bucket_id = 'catch-photos' AND auth.uid()::text = (storage.foldername(name))[1]`. Every path must start with the user's UUID.

---

## 8. Catalog reference (already seeded)

| Catalog | Rows | Aliases | Families |
|---|---|---|---|
| `species_catalog` | 145 | 349 | 16 |
| `lure_catalog` | 105 | 348 | 10 |
| `fly_catalog` | 123 | 176 | 7 |
| `bait_catalog` | 54 | 96 | 4 |

### Species families (16)
`bass`, `panfish`, `crappie`, `walleye_perch`, `pike_muskie`, `catfish`, `striped_white_bass`, `gar_bowfin`, `cichlid`, `trout_char`, `salmon`, `carp_roughfish`, `saltwater_inshore`, `sturgeon_paddlefish`, `shad_herring`, `other_freshwater`.

### Lure families (10)
`soft_plastic`, `crankbait`, `jerkbait_glide`, `topwater`, `jig`, `spinnerbait_blade`, `spoon`, `hard_swimbait`, `specialty_rig`, `musky_pike_specific`.

### Fly types (7)
`dry_fly`, `nymph`, `streamer`, `wet_fly`, `warmwater_bass_fly`, `saltwater_fly`, `egg_attractor`.

### Bait families (4)
`live`, `cut`, `prepared`, `natural_other`.

**Catalogs are tiered:** canonical types are the source of truth, brand names + regional slang resolve up via the alias tables. Aliases cover the 80% common usage. When a user types something not in aliases, the freeform field captures it AND inserts/upserts a row into the relevant `_submissions` table. The submissions table is a content pipeline for future alias enrichment.

---

## 9. Engine canonical IDs (read-only reference)

These are the engine's species and lure canonicals that the catalog `engine_canonical_id` columns reference. **Owned by the engine, do not add to or rename.**

### Species canonicals (4)
`largemouth_bass`, `smallmouth_bass`, `northern_pike`, `trout`.

The engine's `trout` rolls up species like `rainbow_trout`, `brown_trout`, `brook_trout`, `steelhead`, `cutthroat_trout` (catalog rows where `engine_canonical_id = 'trout'`).

### Lure canonicals (selected — see `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts` for the full list)
`swim_jig`, `walking_topwater`, `popping_topwater`, `hollow_body_frog`, `squarebill_crankbait`, `lipless_crankbait`, `deep_diving_crankbait`, `flat_sided_crankbait`, `suspending_jerkbait`, `paddle_tail_swimbait`, `soft_jerkbait`, `wacky_rigged_stick_worm`, `finesse_stick_worm`, `tube_jig`, `ned_rig`, `drop_shot_worm_minnow`, `compact_flipping_jig`, `bladed_jig`, `spinnerbait`, `football_jig`, `blade_bait`, `buzzbait_prop_bait`, `large_profile_pike_swimbait`, `pike_jerkbait`.

---

## 10. Pass-by-pass build plan

### Pass 0 — Schema backbone ✅ DONE

**Commit:** `3934238` — "Add fishing log schema backbone"
**Migration:** `20260427230000_create_fishing_log_schema.sql` (738 lines)

**What landed:**
- 14 tables created
- All RLS enabled with explicit policies (catalog public-read, user-data CRUD-own-rows)
- `catch-photos` storage bucket with per-user folder policies
- Reused helpers: `public.set_generic_updated_at`, `public.profiles(id)`, `public.waterbody_index(id)`
- New helper: `public.normalize_alias_text(text)`

### Pass 0.5 — engine_canonical_id on species_catalog ✅ DONE

**Commit:** `c8b1eb9` — "Add engine_canonical_id to species_catalog"
**Migration:** `20260428000000_species_catalog_engine_canonical_id.sql`

**What landed:** ALTER TABLE adding `engine_canonical_id text` + partial index. Lets multiple user-facing species (rainbow_trout, brown_trout, etc.) roll up to a single engine canonical (`trout`).

### Pass 1 — Catalog seed ✅ DONE

**9 commits:** `1a88cfc` through `1598a13`
**Migrations:** `20260428010000_seed_species_catalog.sql` through `20260428090000_seed_bait_aliases.sql`

**What landed:**
- 145 species in `species_catalog`
- 105 lures in `lure_catalog`
- 123 flies in `fly_catalog`
- 54 baits in `bait_catalog`
- ~969 alias rows total (349 species, 348 lure, 176 fly, 96 bait)
- New `species_aliases` table created in `20260428050000_create_species_aliases.sql`
- All seed migrations are idempotent (UPSERT on canonical_name / on FK + alias)

**Note on alias coverage:** Aliases cover the 80% common usage. Future enrichment via additive seed migrations is fine.

---

### Pass 2 — Manual entry form + auto-fill on save ⬜ TODO

**Goal:** A working catch logger. User opens new-entry, fills the form, taps save, the row lands in `fishing_catches` with auto-derived weather/solunar/waterbody resolved server-side. No voice yet, no photo grid yet — just the form working end-to-end.

**Sub-commits (suggested order):**

1. **Replace `app/new-entry.tsx`.** Currently mock arrays. Build fresh with the FinFindr paper theme. Hero row always visible; expandable detail sections per Brandon's UI preference.
2. **Create `lib/fishingLog.ts`.** Types, queries, insert helpers, search wrappers (typeahead).
3. **Trip lifecycle.** Add a "Start Trip" button on `app/(tabs)/log.tsx`. When pressed, `insert into fishing_trips` with current GPS as `start_point`. Trip stays open across multiple catch logs. "End Trip" button closes it (sets `ended_at`). Persist active-trip id in a Zustand store.
4. **Wire form save.** `supabase.from('fishing_catches').insert(...)` with active trip id, current GPS, user-entered fields. After insert, fire the auto-fill call (sub-commit 5).
5. **Build auto-fill edge function** (`supabase/functions/fishing-log-autofill/`). Called from the app post-insert with `(catch_id, lat, lng, caught_at)`. Function pulls Open-Meteo Historical, computes solunar locally, populates 8 weather columns + 7 solunar columns, sets `weather_source = 'open_meteo'` and `weather_filled_at = now()`. Use service-role client inside the function.
6. **Waterbody resolution on trip start.** Reverse-geocode `start_point` against `public.waterbody_index` using PostGIS distance/contains. Populate `waterbody_id`; if no match within reasonable radius, leave null and use `waterbody_freeform` from user input.
7. **Photo upload (single-photo MVP).** User picks/snaps via `expo-image-picker`. Upload to draft path `{user_id}/draft/{tmp_id}/{uuid}.jpg`. On catch save, copy/move to `{user_id}/{catch_id}/{uuid}.jpg` and insert `catch_photos` row. Multi-photo support is fine if straightforward.

**Form fields (draft layout):**

Hero row (always visible):
- Species typeahead (queries `species_catalog` + `species_aliases` via pg_trgm RPC — see Pass 4 RPC sketch)
- Length / weight (slider or quick numpad)
- Gear mode toggle (Lure / Fly / Bait)
- Lure / Fly / Bait typeahead (depending on gear mode)
- Photo (snap / pick)

Expandable "More details":
- Color, size (lure/fly/bait-specific)
- Technique + Speed (vocab below)
- Structure tags (multi-select chips)
- Strike quality (chip row)
- Water temp, water clarity, water level state
- Depth
- Disposition (kept / released / lost — default released)
- Notes
- Attach a Report (optional — populates `report_id` from recent `report_history` runs; not implemented until Pass 7)

**Vocab per gear mode:**

Technique (motion):
- Lure: `slow_roll`, `burn`, `twitch_pause`, `dead_stick`, `drop_shot_hop`, `swimming`, `ripping`, `popping`, `walking`, `lift_drop`
- Fly: `dead_drift`, `swing`, `strip_strip_pause`, `dropper`, `indicator`, `dry_drift`, `skating`
- Bait: `slip_bobber`, `fixed_bobber`, `drop_shot`, `carolina_rig`, `three_way`, `free_line`, `bottom_rig`, `jig_minnow_combo`

Speed (pace):
- All modes: `dead_stick`, `slow`, `medium`, `fast`, `burn`

**Auto-fill: Open-Meteo URL pattern**
```
https://archive-api.open-meteo.com/v1/archive
  ?latitude=42.5&longitude=-76.5
  &start_date=2026-04-28&end_date=2026-04-28
  &hourly=temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl
  &temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch
```
Pull the hour matching `caught_at`. For pressure trend, also pull the previous day's hour and previous-day-1 hour. Compute `pressure_24h_delta = current - 24h_ago` and `pressure_48h_delta = current - 48h_ago`. Open-Meteo allows ~80 years of history. Free, no API key.

**Auto-fill: solunar / astronomy**
- Use `suncalc` or equivalent (no API). Compute `sunrise_at`, `sunset_at`, `moon_phase` (0–1), `moon_illumination_pct`.
- `solunar_period` = `'major'` if `caught_at` falls within ±1 hour of moon overhead/underfoot; `'minor'` for moonrise/moonset windows; `'off'` otherwise.
- Compute `minutes_from_sunrise` (negative if before, positive if after) and `minutes_from_sunset` similarly.

**Validation expectations:**
- `supabase migration up` clean
- Manually log a test catch, confirm row lands with weather/solunar populated, photo uploads cleanly
- Test edit flow: user updates a weather field via app, schema accepts it (no NOT NULL on auto-fill cols)

**File touchpoints:**
- `TightLinesAI/app/new-entry.tsx` (replace)
- `TightLinesAI/app/(tabs)/log.tsx` (Start/End Trip controls)
- `TightLinesAI/lib/fishingLog.ts` (new)
- `TightLinesAI/store/activeTripStore.ts` (new — Zustand)
- `TightLinesAI/supabase/functions/fishing-log-autofill/` (new)
- Possible: `TightLinesAI/supabase/migrations/<timestamp>_search_typeahead_rpcs.sql` (catalog typeahead RPCs — could also defer to Pass 4)

---

### Pass 3 — Photo grid log view + catch detail screen ⬜ TODO

**Goal:** Replace the mock-data log tab with a beautiful photo-first grid of the user's catches, plus a detail screen that surfaces all the auto-derived conditions.

**Sub-commits:**

1. **Photo grid feed.** Replace `app/(tabs)/log.tsx` body — Pinterest-style grid of catch photos. Each tile shows photo + species name + weight overlay. Tap → catch detail. Use `<FlashList>` (already a sibling-app convention) or `<FlatList>` with 2–3 columns.
2. **Empty state.** When user has no catches, show a quiet illustrated empty state with a "Log first catch" CTA → navigates to new-entry.
3. **Catch detail screen.** Replace `app/log-detail.tsx`. Header = full-screen photo carousel. Below: species, weight/length, water/lure/fly/bait, full conditions (pressure trend chip, wind, moon phase, solunar period, sunrise/sunset relative time), structure tags, technique + speed, notes. Edit button → reuses the new-entry form pre-filled.
4. **List/grid toggle.** Top-right of log tab — switch between photo grid and date-grouped list view.

**Design principles:**
- Photo-centric (catches with no photo: subtle generic species icon)
- Earth-tone palette (paper theme already does this)
- Big numbers, tiny labels on stats sub-cards
- Serif for content, sans for chrome (paper theme already)
- Restraint — no badges, no XP, no "you're on fire!" pop-ups

**File touchpoints:**
- `TightLinesAI/app/(tabs)/log.tsx`
- `TightLinesAI/app/log-detail.tsx`
- `TightLinesAI/components/log/CatchTile.tsx` (new)
- `TightLinesAI/components/log/ConditionsCard.tsx` (new)
- `TightLinesAI/lib/fishingLog.ts` (extend with read queries)

---

### Pass 4 — Voice entry ⬜ TODO

**Goal:** The "smart log" moment. User taps mic, speaks naturally, fields auto-fill. Deterministic — zero LLM calls.

**Sub-commits:**

1. **Add `@react-native-voice/voice` dep** (flag to Brandon before adding).
2. **Mic button on new-entry.** Big, low-on-screen, tap-and-hold (or tap-to-toggle). Shows live transcription as user speaks.
3. **Build the parser** (`lib/voiceParser.ts`):
   - Tokenize transcript (lowercase, split on whitespace + punctuation)
   - Number extraction: `(\d+(\.\d+)?)\s*(lb|lbs|pound|pounds|oz|ounce|ounces|in|inch|inches)` → length/weight
   - Time extraction: `at (\d+)(am|pm)`, "this morning" / "this afternoon" / "this evening", etc.
   - Disposition extraction: regex for "released", "let go", "kept", "lost", "dropped"
   - Species fuzzy-match: RPC against `species_catalog` + `species_aliases` (see RPC sketch below)
   - Lure / fly / bait fuzzy-match: same approach against the relevant catalog + alias table based on inferred or current `gear_mode`
4. **Confidence threshold.** Each extracted field has a similarity score from pg_trgm. Below threshold (e.g., 0.5) → leave field blank, don't auto-fill. User reviews and confirms or fills manually.
5. **Submission writeback.** When parser fuzzy-matches below confidence (or no match), the freeform string lands in `lure_freeform` / `fly_freeform` / `bait_freeform` AND inserts/upserts a row into the relevant `_submissions` table for content pipeline review.

**Recommended Postgres RPC for fuzzy match (deterministic, no LLM):**
```sql
create or replace function public.search_lures(query text, max_results int default 10)
returns table(lure_id uuid, canonical_name text, score real)
language sql stable as $$
  select lc.id as lure_id, lc.canonical_name,
         similarity(lc.canonical_name, query) as score
  from public.lure_catalog lc
  where similarity(lc.canonical_name, query) > 0.3
  union
  select la.lure_id, lc.canonical_name,
         similarity(la.normalized_alias, public.normalize_alias_text(query)) as score
  from public.lure_aliases la
  join public.lure_catalog lc on lc.id = la.lure_id
  where similarity(la.normalized_alias, public.normalize_alias_text(query)) > 0.3
  order by score desc
  limit max_results;
$$;
```
Build similar `search_species`, `search_flies`, `search_baits` RPCs in a new migration.

**File touchpoints:**
- `TightLinesAI/lib/voiceParser.ts` (new)
- `TightLinesAI/lib/fishingLog.ts` (extend with RPC wrappers)
- `TightLinesAI/app/new-entry.tsx` (add mic button + live transcript UI)
- `TightLinesAI/supabase/migrations/<timestamp>_search_rpcs.sql` (new)
- `TightLinesAI/package.json` (+ `@react-native-voice/voice`)

---

### Pass 5 — Insights + milestones engine ⬜ TODO

**Goal:** The stickiness lever. Detector framework + on-save toast + a milestones surface in the log tab.

**Architecture:**

Detector signature (pure function):
```ts
type Detector = (catch_: Catch, history: CatchHistory) => InsightFact | null;

type InsightFact = {
  detector_id: string;
  copy: string;          // templated sentence
  salience: number;      // 0-1, higher = more interesting
  surface: 'on_save' | 'milestone_view' | 'weekly_report';
  payload?: Record<string, unknown>;  // for share-card rendering in Pass 8
};
```

**Run-on-save flow:**
1. After catch insert, fetch user's relevant history (e.g., last 365 days of catches).
2. Run all detectors. Each returns `null` or an `InsightFact`.
3. Sort by salience. Pick top 1 for the on-save toast.
4. Persist all generated facts to a new `catch_insights` table for milestone view + weekly report reuse.

**Initial detector set (build at least these):**
- `personal_record_species` — "Biggest [species] you've logged"
- `personal_record_lure_species` — "Biggest [species] on a [lure]"
- `nth_catch_overall` — "100th catch! / 500th! / 1000th!"
- `nth_catch_species` — "10th rainbow trout this year"
- `first_of_species_year` — "First [species] of the year"
- `first_on_lure_season` — "First catch on [lure] this season"
- `streak_started` — "Caught at least one fish 3 trips in a row"
- `pressure_pattern_match` — "5 of your last 10 catches came on falling pressure"
- `time_window_pattern` — "Half your big bass come in the first hour after sunrise"
- `monthly_milestone` — "14 catches this month — your best month ever"

**New table: `catch_insights`**
```sql
create table public.catch_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  catch_id uuid references public.fishing_catches(id) on delete cascade,
  detector_id text not null,
  copy text not null,
  salience numeric not null,
  payload jsonb,
  surface text check (surface in ('on_save','milestone_view','weekly_report')),
  generated_at timestamptz default timezone('utc', now())
);
-- RLS, partial index on (user_id, generated_at desc)
```

**File touchpoints:**
- `TightLinesAI/lib/insights/detectors/*.ts` (one file per detector)
- `TightLinesAI/lib/insights/runDetectors.ts` (orchestrator)
- `TightLinesAI/components/InsightToast.tsx` (on-save surface)
- `TightLinesAI/app/milestones.tsx` (milestone log view) — link from log tab
- `TightLinesAI/supabase/migrations/<timestamp>_create_catch_insights.sql`

---

### Pass 6 — Stats screen ⬜ TODO

**Goal:** A stats tab the user can open whenever, with a filter strip + drill-downs by lure/species/water/conditions. Pure SQL, no LLM.

**Layout:**
- Top filter strip: date range picker, species filter, gear mode filter, water clarity filter, pressure trend filter, time-of-day window
- Hero card: total catches in range, total weight, biggest fish (link to detail)
- Charts row 1: catches by species (bar), catches by lure (bar)
- Charts row 2: catches by hour-of-day (bar), catches by moon phase (donut)
- Charts row 3: catches by pressure trend (rising/falling/stable bar), catches by water clarity
- Drill-down: tap any chart segment → filtered list of catches

**Implementation notes:**
- All queries are `SELECT ... FROM fishing_catches` with filters and `GROUP BY`.
- Add Postgres helper functions or views if any single query gets gnarly.
- Use a chart lib like `victory-native`, `react-native-chart-kit`, or custom Skia (flag to Brandon before adding).
- Persist filter state in a Zustand store so the user's filters survive tab switches.

**File touchpoints:**
- `TightLinesAI/app/stats.tsx` (new) or add a `stats` route under `(tabs)/`
- `TightLinesAI/components/stats/*.tsx`
- `TightLinesAI/store/statsFilterStore.ts`

---

### Pass 7 — Recommendation history archive + attach-to-catch ⬜ TODO

**Goal:** Every recommender / How's Fishing run silently lands in `report_history`. User can attach one to any catch via a picker.

**Sub-commits:**

1. **Wire archive on the recommender side.** This is the only place we touch existing engine code — and it's additive: a tiny call after the recommender or how_fishing endpoint returns a result, inserting into `report_history`. Hooks live in the relevant screen, NOT in the engine internals. **Confirm with Brandon before editing any recommender file.** Show him the exact diff first.
2. **Picker UI on new-entry / log-detail.** "Attach a report" button shows the user's last 30 days of `report_history` rows (or last 25, whichever yields a scannable list). User picks one → set `fishing_catches.report_id`.
3. **Catch detail surfaces attached report.** Read-only mini-card showing the conditions and top picks from the attached report's JSONB blobs.

**File touchpoints:**
- `TightLinesAI/app/recommender.tsx` (minimal additive call after the result lands; flag Brandon)
- `TightLinesAI/app/how-fishing*.tsx` (same — flag Brandon)
- `TightLinesAI/app/new-entry.tsx` (attach picker)
- `TightLinesAI/app/log-detail.tsx` (attached report mini-card)
- `TightLinesAI/components/AttachReportPicker.tsx` (new)

---

### Pass 8 — Weekly report + share cards ⬜ TODO

**Goal:** Sunday-morning push notification + in-app popup with a weekly recap. Plus a share-to-social button on key insights with the FINFINDR. wordmark.

**Sub-commits:**

1. **Add `@shopify/react-native-skia` dep** (flag to Brandon).
2. **Build share card renderer** (`lib/shareCards/*`). Templates:
   - **Catch hero** — photo + species + weight + waterbody + date + small FINFINDR. wordmark
   - **Personal record** — bold number, species, "PR" stamp, FINFINDR. wordmark
   - **Weekly recap** — top 3 stats stacked, week date range
   - **Streak** — "12 trips, 9 species" achievement card
   - **Pattern reveal** — "I catch my biggest bass on falling pressure" with a small data viz
   - All cards use `paper.red` accent for the period dot on FINFINDR.
3. **Weekly report generator.** Cron-style edge function (Supabase scheduled fn or `pg_cron`) runs Sunday 8am user-local. Reuses Pass 5 detectors with `surface = 'weekly_report'`. Picks top 4–6 facts by salience. Renders a sequence of card-style summary screens.
4. **In-app weekly modal.** When user opens the app on/after Sunday 8am their local time, show the modal with the week's report. Dismiss → keeps the report accessible from a "Past Reports" view in the log tab.
5. **Push notification.** `expo-notifications` schedules a local push for Sunday 8am with deep-link to the modal. (User can opt out in settings.)
6. **Share button.** On any insight or catch detail, "Share" → renders the appropriate template via Skia → exports to camera roll or shows native share sheet.

**File touchpoints:**
- `TightLinesAI/lib/shareCards/templates/*.tsx`
- `TightLinesAI/lib/shareCards/render.ts`
- `TightLinesAI/components/WeeklyReportModal.tsx`
- `TightLinesAI/app/past-reports.tsx`
- `TightLinesAI/supabase/functions/weekly-report-generate/`
- `TightLinesAI/package.json` (+ Skia)

---

## 11. Open questions still requiring Brandon's input

Don't proceed past the relevant Pass without answers.

1. **Pass 4 dep:** confirm `@react-native-voice/voice` is OK to add. (Brandon's decisions so far suggest yes — native iOS STT is the agreed approach — but new deps need explicit go.)
2. **Pass 6 chart lib:** which charting lib (`victory-native` vs `react-native-chart-kit` vs custom Skia)? Brandon should pick before any chart lands.
3. **Pass 7 hook placement:** confirm we can add a small additive `report_history` insert call inside the existing recommender / how_fishing screens. Brandon said "don't touch other features" — this is borderline. **Show him the exact diff before committing.**
4. **Pass 8 cron mechanism:** Supabase scheduled function vs `pg_cron` vs client-side scheduling. Each has tradeoffs. Brandon to pick.
5. **Pass 8 push notification copy.** Default proposed: "Your week of fishing — tap to see your recap." Brandon may want voice/personality direction.
6. **Pass 8 share card visual direction:** Brandon described FINFINDR. wordmark with red dot. Need final color palette + typography commitment for each template variant.
7. **`@react-native-voice/voice` vs newer alternatives** — confirm the lib hasn't gone stale by Pass 4 time.

---

## 12. Brandon's preferences (carry forward)

- **Straightforward UI with expandable detail sections.** Don't overload the primary view — collapse advanced fields.
- **Scientific rigor on the engine side.** Brandon thinks like a fish biologist. Doesn't apply directly to log code, but if any decision touches species behavior, defer to him.
- **Cost-conscious.** Determinism over LLM. Free APIs (Open-Meteo) over paid (Tomorrow.io). Native STT over Whisper.
- **Trust agent instinct on content.** When proposing the catalog, Brandon explicitly said "trust your instinct, don't skip anything." Same applies to alias enrichment and detector copy. Show confidence; he reacts to corrections.
- **Wants every advanced angler to find their lure/fly/species.** Comprehensive coverage is a feature, not bloat.
- **No emoji in code or commits unless explicitly asked.**
- **One commit ≈ one observable change.** Don't bundle.
- **Migrations idempotent.** Safe to re-run.
- **iOS only (for now).** Don't waste cycles on web/Android polyfills.

---

## 13. How to start a new session as the picking-up agent

1. **Read this entire plan file.** Don't skip sections.
2. **Verify branch state:**
   ```
   cd "/Users/brandonkentros/TightLines AI V1/.claude/worktrees/xenodochial-raman-b0cc73"
   git log --oneline main..HEAD
   ```
   Should show 11 fishing-log commits ending at `1598a13` for Pass 1 finished, plus any Water Reader commits that may have landed since.
3. **Check disk migrations:**
   ```
   ls TightLinesAI/supabase/migrations/ | grep "20260427\|20260428"
   ```
   Should show 11 fishing-log migrations from `20260427230000_create_fishing_log_schema.sql` through `20260428090000_seed_bait_aliases.sql`.
4. **Read the latest auto-memory** at `~/.claude/projects/-Users-brandonkentros-TightLines-AI-V1/memory/MEMORY.md` and the linked `project_fishing_log_design.md`.
5. **Confirm with Brandon which Pass to tackle next.** Default is Pass 2.
6. **Before touching code,** restate the Pass 2 (or whichever) plan back to Brandon and get the green light. Match his single-purpose commit rhythm.
7. **For each sub-commit within a Pass:** show Brandon what you're about to change, get a yes, write the change, commit, run `git status` to verify, move on.
8. **Don't run `supabase db push`** — Brandon does that when ready.
9. **If you need to add a new dep,** flag it before adding (`package.json` edits need explicit OK).
10. **Update memory at end of each Pass.** Edit `~/.claude/projects/-Users-brandonkentros-TightLines-AI-V1/memory/project_fishing_log_design.md` to reflect what landed.

---

## 14. Glossary

- **Canonical** — the source-of-truth row in a catalog (e.g., `Senko / Stick Worm` in `lure_catalog`). Brand variants and slang resolve up to canonicals via `_aliases`.
- **Engine canonical** — the engine's own ID for a species or lure (`largemouth_bass`, `swim_jig`, etc.). Lives in TS code under `supabase/functions/_shared/recommenderEngine/`. Catalog rows reference these via `engine_canonical_id` columns.
- **Skunk marker** — a `fishing_catches` row with `is_skunk_marker = true` representing a no-fish trip-end. Preserves catch-rate denominator math.
- **Detector** — a pure function that scans a catch + history and returns an `InsightFact` or null. Pass 5 framework.
- **Salience** — 0–1 score representing how interesting an insight is. Higher salience wins for the on-save toast.
- **Surface** — where an insight is shown: `on_save` (toast immediately after logging), `milestone_view` (the in-app milestones list), `weekly_report` (Sunday recap).
- **Trip** — a fishing session at one waterbody/timeframe. Catches belong to a trip. Trips give stats a denominator (catch rate per hour).
- **Paper theme** — FinFindr's visual language. Tokens in `lib/theme.ts` (`paper`, `paperFonts`, `paperRadius`, `paperShadows`, `paperSpacing`). Components in `components/paper/`.
