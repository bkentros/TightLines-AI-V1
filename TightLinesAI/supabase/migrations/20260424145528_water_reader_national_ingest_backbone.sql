-- Water Reader national named-waterbody ingest backbone.
--
-- This migration does not claim national data is already loaded. It adds the
-- private staging tables and promotion function used to move USGS 3DHP named
-- standing-water polygons into the existing public Water Reader identity index.

create schema if not exists water_reader_private;

create extension if not exists postgis;
create extension if not exists pgcrypto;

create table if not exists water_reader_private.waterbody_ingest_runs (
  id uuid primary key default gen_random_uuid(),
  source_key text not null,
  source_name text not null,
  source_url text not null,
  source_revision text,
  target_scope text not null default 'national',
  status text not null default 'staged' check (
    status in ('staged', 'promoted', 'failed')
  ),
  staged_waterbody_count integer not null default 0,
  promoted_waterbody_count integer not null default 0,
  alias_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists water_reader_private.us_county_boundaries (
  geoid text primary key,
  state_fips text not null,
  state_code text not null check (state_code ~ '^[A-Z]{2}$'),
  county_fips text not null,
  county_name text not null,
  source_key text not null,
  source_revision text,
  geom geometry(MultiPolygon, 4326) not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists us_county_boundaries_geom_idx
  on water_reader_private.us_county_boundaries
  using gist (geom);

create index if not exists us_county_boundaries_state_county_idx
  on water_reader_private.us_county_boundaries (state_code, county_name);

create table if not exists water_reader_private.usgs_3dhp_waterbody_stage (
  ingest_run_id uuid not null references water_reader_private.waterbody_ingest_runs (id) on delete cascade,
  objectid bigint,
  id3dhp text,
  gnisid text,
  gnisidlabel text,
  featuretype integer,
  featuretypelabel text,
  areasqkm numeric,
  source_properties jsonb not null default '{}'::jsonb,
  source_geometry geometry(MultiPolygon, 4326) not null,
  source_centroid geometry(Point, 4326) not null,
  imported_at timestamptz not null default timezone('utc', now()),
  primary key (ingest_run_id, id3dhp)
);

create index if not exists usgs_3dhp_waterbody_stage_run_idx
  on water_reader_private.usgs_3dhp_waterbody_stage (ingest_run_id, featuretype);

create index if not exists usgs_3dhp_waterbody_stage_gnis_idx
  on water_reader_private.usgs_3dhp_waterbody_stage (gnisid);

create index if not exists usgs_3dhp_waterbody_stage_centroid_idx
  on water_reader_private.usgs_3dhp_waterbody_stage
  using gist (source_centroid);

create table if not exists water_reader_private.gnis_alias_stage (
  ingest_run_id uuid not null references water_reader_private.waterbody_ingest_runs (id) on delete cascade,
  gnisid text not null,
  alias_name text not null,
  alias_kind text not null default 'variant',
  source_properties jsonb not null default '{}'::jsonb,
  imported_at timestamptz not null default timezone('utc', now()),
  primary key (ingest_run_id, gnisid, alias_name)
);

create index if not exists gnis_alias_stage_gnis_idx
  on water_reader_private.gnis_alias_stage (gnisid);

create or replace function water_reader_private.region_key_for_state(state_code text)
returns text
language sql
immutable
as $$
  select case upper(state_code)
    when 'AK' then 'alaska'
    when 'HI' then 'hawaii'
    when 'CT' then 'northeast'
    when 'ME' then 'northeast'
    when 'MA' then 'northeast'
    when 'NH' then 'northeast'
    when 'NJ' then 'northeast'
    when 'NY' then 'northeast'
    when 'PA' then 'northeast'
    when 'RI' then 'northeast'
    when 'VT' then 'northeast'
    when 'IL' then 'great_lakes_upper_midwest'
    when 'IN' then 'great_lakes_upper_midwest'
    when 'IA' then 'great_lakes_upper_midwest'
    when 'MI' then 'great_lakes_upper_midwest'
    when 'MN' then 'great_lakes_upper_midwest'
    when 'MO' then 'great_lakes_upper_midwest'
    when 'OH' then 'great_lakes_upper_midwest'
    when 'WI' then 'great_lakes_upper_midwest'
    when 'AL' then 'southeast'
    when 'AR' then 'southeast'
    when 'DE' then 'southeast'
    when 'FL' then 'southeast'
    when 'GA' then 'southeast'
    when 'KY' then 'southeast'
    when 'LA' then 'southeast'
    when 'MD' then 'southeast'
    when 'MS' then 'southeast'
    when 'NC' then 'southeast'
    when 'SC' then 'southeast'
    when 'TN' then 'southeast'
    when 'VA' then 'southeast'
    when 'WV' then 'southeast'
    when 'KS' then 'plains'
    when 'ND' then 'plains'
    when 'NE' then 'plains'
    when 'OK' then 'plains'
    when 'SD' then 'plains'
    when 'TX' then 'plains'
    when 'AZ' then 'mountain_west'
    when 'CO' then 'mountain_west'
    when 'ID' then 'mountain_west'
    when 'MT' then 'mountain_west'
    when 'NM' then 'mountain_west'
    when 'NV' then 'mountain_west'
    when 'UT' then 'mountain_west'
    when 'WY' then 'mountain_west'
    when 'CA' then 'pacific_west'
    when 'OR' then 'pacific_west'
    when 'WA' then 'pacific_west'
    else 'other_us'
  end;
$$;

create or replace function water_reader_private.classify_standing_waterbody(raw_name text)
returns text
language sql
immutable
as $$
  select case
    when public.normalize_waterbody_name(raw_name) ~ '(^| )(reservoir|res)( |$)' then 'reservoir'
    when public.normalize_waterbody_name(raw_name) ~ '(^| )pond( |$)' then 'pond'
    else 'lake'
  end;
$$;

create or replace function water_reader_private.search_priority_for_area(surface_area_acres numeric)
returns integer
language sql
immutable
as $$
  select case
    when surface_area_acres is null then 900
    when surface_area_acres >= 10000 then 25
    when surface_area_acres >= 1000 then 75
    when surface_area_acres >= 100 then 150
    else 300
  end;
$$;

create or replace function water_reader_private.promote_usgs_3dhp_waterbodies(
  target_ingest_run_id uuid,
  min_area_sqkm numeric default 0
)
returns table (
  staged_count integer,
  promoted_count integer,
  alias_count integer,
  skipped_missing_name_count integer,
  skipped_missing_county_count integer
)
language plpgsql
as $$
declare
  v_staged_count integer := 0;
  v_promoted_count integer := 0;
  v_alias_count integer := 0;
  v_skipped_missing_name_count integer := 0;
  v_skipped_missing_county_count integer := 0;
begin
  select count(*)
  into v_staged_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id;

  select count(*)
  into v_skipped_missing_name_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id
    and s.featuretype = 3
    and coalesce(nullif(trim(s.gnisidlabel), ''), '') = '';

  with named_standing_water as (
    select
      s.*,
      nullif(trim(s.gnisidlabel), '') as canonical_name,
      s.areasqkm * 247.10538146717 as surface_area_acres
    from water_reader_private.usgs_3dhp_waterbody_stage s
    where s.ingest_run_id = target_ingest_run_id
      and s.featuretype = 3
      and nullif(trim(s.gnisidlabel), '') is not null
      and coalesce(s.areasqkm, 0) >= min_area_sqkm
  ),
  county_ranked as (
    select
      n.*,
      c.state_code,
      c.county_name,
      row_number() over (
        partition by n.ingest_run_id, n.id3dhp
        order by ST_Area(ST_Intersection(n.source_geometry, c.geom)::geography) desc nulls last
      ) as rn
    from named_standing_water n
    join water_reader_private.us_county_boundaries c
      on ST_Intersects(n.source_centroid, c.geom)
  ),
  candidates as (
    select *
    from county_ranked
    where rn = 1
  ),
  upserted as (
    insert into public.waterbody_index (
      external_source,
      external_id,
      canonical_name,
      state_code,
      county_name,
      waterbody_type,
      is_named,
      is_searchable,
      region_key,
      centroid,
      geometry,
      surface_area_acres,
      search_priority,
      source_summary
    )
    select
      'usgs_3dhp_waterbody',
      '3dhp:' || c.id3dhp,
      c.canonical_name,
      c.state_code,
      c.county_name,
      water_reader_private.classify_standing_waterbody(c.canonical_name),
      true,
      true,
      water_reader_private.region_key_for_state(c.state_code),
      c.source_centroid,
      c.source_geometry,
      c.surface_area_acres,
      water_reader_private.search_priority_for_area(c.surface_area_acres),
      jsonb_build_object(
        'source', 'USGS 3D Hydrography Program 3DHP_all Waterbody',
        'source_key', 'usgs_3dhp',
        'source_layer_url', 'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60',
        'featuretype', c.featuretype,
        'featuretypelabel', coalesce(c.featuretypelabel, 'Lake'),
        'id3dhp', c.id3dhp,
        'id3dhp_persistent', false,
        'gnisid', c.gnisid,
        'workunitid', c.source_properties ->> 'workunitid',
        'ingest_run_id', target_ingest_run_id,
        'standing_water_only', true
      )
    from candidates c
    on conflict (external_source, external_id) do update
    set
      canonical_name = excluded.canonical_name,
      state_code = excluded.state_code,
      county_name = excluded.county_name,
      waterbody_type = excluded.waterbody_type,
      is_named = excluded.is_named,
      is_searchable = excluded.is_searchable,
      region_key = excluded.region_key,
      centroid = excluded.centroid,
      geometry = excluded.geometry,
      surface_area_acres = excluded.surface_area_acres,
      search_priority = excluded.search_priority,
      source_summary = excluded.source_summary,
      updated_at = timezone('utc', now())
    returning id
  )
  select count(*)
  into v_promoted_count
  from upserted;

  select count(*)
  into v_skipped_missing_county_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id
    and s.featuretype = 3
    and nullif(trim(s.gnisidlabel), '') is not null
    and coalesce(s.areasqkm, 0) >= min_area_sqkm
    and not exists (
      select 1
      from water_reader_private.us_county_boundaries c
      where ST_Intersects(s.source_centroid, c.geom)
    );

  with alias_candidates as (
    select
      w.id as waterbody_id,
      a.alias_name
    from water_reader_private.gnis_alias_stage a
    join water_reader_private.usgs_3dhp_waterbody_stage s
      on s.ingest_run_id = a.ingest_run_id
      and s.gnisid = a.gnisid
    join public.waterbody_index w
      on w.external_source = 'usgs_3dhp_waterbody'
      and w.external_id = '3dhp:' || s.id3dhp
    where a.ingest_run_id = target_ingest_run_id
      and public.normalize_waterbody_name(a.alias_name) <> public.normalize_waterbody_name(w.canonical_name)
  ),
  inserted_aliases as (
    insert into public.waterbody_aliases (waterbody_id, alias_name, alias_source)
    select distinct
      waterbody_id,
      alias_name,
      'gnis_all_names'
    from alias_candidates
    on conflict (waterbody_id, normalized_alias_name) do nothing
    returning id
  )
  select count(*)
  into v_alias_count
  from inserted_aliases;

  update water_reader_private.waterbody_ingest_runs
  set
    status = 'promoted',
    staged_waterbody_count = v_staged_count,
    promoted_waterbody_count = v_promoted_count,
    alias_count = v_alias_count,
    completed_at = timezone('utc', now()),
    metadata = metadata || jsonb_build_object(
      'skipped_missing_name_count', v_skipped_missing_name_count,
      'skipped_missing_county_count', v_skipped_missing_county_count,
      'min_area_sqkm', min_area_sqkm
    )
  where id = target_ingest_run_id;

  return query select
    v_staged_count,
    v_promoted_count,
    v_alias_count,
    v_skipped_missing_name_count,
    v_skipped_missing_county_count;
end;
$$;
