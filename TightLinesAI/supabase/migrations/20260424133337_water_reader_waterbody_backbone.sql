create extension if not exists postgis;
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.normalize_waterbody_name(raw_name text)
returns text
language sql
immutable
as $$
  select trim(
    regexp_replace(
      regexp_replace(
        lower(coalesce(raw_name, '')),
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

create or replace function public.set_generic_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.waterbody_index (
  id uuid primary key default gen_random_uuid(),
  external_source text not null,
  external_id text,
  canonical_name text not null,
  normalized_name text generated always as (public.normalize_waterbody_name(canonical_name)) stored,
  state_code text not null check (state_code ~ '^[A-Z]{2}$'),
  county_name text,
  waterbody_type text not null check (
    waterbody_type in ('lake', 'pond', 'reservoir', 'river', 'stream', 'canal')
  ),
  is_named boolean not null default true,
  is_searchable boolean not null default true,
  region_key text,
  centroid geometry(Point, 4326) not null,
  geometry geometry(MultiPolygon, 4326) not null,
  surface_area_acres numeric,
  search_priority integer not null default 1000,
  source_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (external_source, external_id)
);

create index if not exists waterbody_index_normalized_name_trgm_idx
  on public.waterbody_index
  using gin (normalized_name gin_trgm_ops);

create index if not exists waterbody_index_type_state_idx
  on public.waterbody_index (waterbody_type, state_code, county_name);

create index if not exists waterbody_index_searchable_idx
  on public.waterbody_index (is_searchable, is_named, search_priority);

create index if not exists waterbody_index_geometry_idx
  on public.waterbody_index
  using gist (geometry);

create index if not exists waterbody_index_centroid_idx
  on public.waterbody_index
  using gist (centroid);

drop trigger if exists waterbody_index_set_updated_at on public.waterbody_index;
create trigger waterbody_index_set_updated_at
before update on public.waterbody_index
for each row
execute function public.set_generic_updated_at();

create table if not exists public.waterbody_aliases (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid not null references public.waterbody_index (id) on delete cascade,
  alias_name text not null,
  normalized_alias_name text generated always as (public.normalize_waterbody_name(alias_name)) stored,
  alias_source text not null default 'manual',
  created_at timestamptz not null default timezone('utc', now()),
  unique (waterbody_id, normalized_alias_name)
);

create index if not exists waterbody_aliases_normalized_name_trgm_idx
  on public.waterbody_aliases
  using gin (normalized_alias_name gin_trgm_ops);

create table if not exists public.source_registry (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique,
  provider_name text not null,
  state_code text,
  source_type text not null check (
    source_type in (
      'national_hydrography',
      'aerial_imagery',
      'bathymetry_vector',
      'bathymetry_dem',
      'bathymetry_pdf',
      'bathymetry_image'
    )
  ),
  source_format text not null check (
    source_format in (
      'arcgis_feature_server',
      'arcgis_image_server',
      'geojson',
      'pdf',
      'image',
      'html'
    )
  ),
  review_status text not null default 'unreviewed' check (
    review_status in ('unreviewed', 'allowed', 'restricted', 'blocked')
  ),
  can_fetch boolean not null default false,
  can_store_original boolean not null default false,
  can_store_normalized boolean not null default false,
  can_store_derived_features boolean not null default false,
  can_cache_rendered_output boolean not null default false,
  attribution_required boolean not null default false,
  attribution_text text,
  license_url text,
  validation_url text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists source_registry_set_updated_at on public.source_registry;
create trigger source_registry_set_updated_at
before update on public.source_registry
for each row
execute function public.set_generic_updated_at();

create table if not exists public.waterbody_source_links (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid not null references public.waterbody_index (id) on delete cascade,
  source_id uuid not null references public.source_registry (id) on delete cascade,
  source_mode text not null check (source_mode in ('aerial', 'depth')),
  depth_source_kind text not null default 'none' check (
    depth_source_kind in ('machine_readable', 'chart_image', 'none')
  ),
  approval_status text not null default 'pending_review' check (
    approval_status in ('approved', 'pending_review', 'rejected')
  ),
  coverage_status text not null default 'available' check (
    coverage_status in ('available', 'limited', 'blocked', 'unavailable')
  ),
  source_path text not null,
  source_path_type text not null default 'service_root' check (
    source_path_type in ('service_root', 'feature_query', 'download', 'document', 'image')
  ),
  fetch_validation_status text not null default 'unvalidated' check (
    fetch_validation_status in ('unvalidated', 'reachable', 'unreachable', 'unsupported', 'blocked')
  ),
  fetch_validation_method text not null default 'head' check (
    fetch_validation_method in ('head', 'get')
  ),
  fetch_validation_target_url text,
  fetch_validation_checked_at timestamptz,
  fetch_validation_http_status integer,
  fetch_validation_error text,
  lake_match_status text not null default 'unknown' check (
    lake_match_status in ('unknown', 'matched', 'ambiguous', 'mismatched')
  ),
  usability_status text not null default 'unknown' check (
    usability_status in ('unknown', 'usable', 'needs_review', 'not_usable')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (waterbody_id, source_id, source_mode, source_path)
);

create index if not exists waterbody_source_links_waterbody_idx
  on public.waterbody_source_links (waterbody_id, source_mode);

create index if not exists waterbody_source_links_validation_idx
  on public.waterbody_source_links (fetch_validation_status, approval_status);

create index if not exists waterbody_source_links_match_usability_idx
  on public.waterbody_source_links (lake_match_status, usability_status, source_mode);

drop trigger if exists waterbody_source_links_set_updated_at on public.waterbody_source_links;
create trigger waterbody_source_links_set_updated_at
before update on public.waterbody_source_links
for each row
execute function public.set_generic_updated_at();

alter table public.waterbody_index enable row level security;
alter table public.waterbody_aliases enable row level security;
alter table public.source_registry enable row level security;
alter table public.waterbody_source_links enable row level security;

create or replace view public.waterbody_availability_snapshot as
with link_eval as (
  select
    l.waterbody_id as lake_id,
    l.source_mode,
    l.depth_source_kind,
    l.approval_status,
    l.coverage_status,
    l.fetch_validation_status,
    l.lake_match_status,
    l.usability_status,
    s.review_status,
    s.can_fetch,
    (
      l.approval_status = 'approved'
      and s.review_status = 'allowed'
      and s.can_fetch = true
      and l.fetch_validation_status = 'reachable'
      and l.coverage_status not in ('blocked', 'unavailable')
    ) as is_fetch_ready,
    (
      l.approval_status = 'approved'
      and s.review_status = 'allowed'
      and s.can_fetch = true
      and l.fetch_validation_status = 'unvalidated'
    ) as is_pending,
    (
      l.approval_status = 'approved'
      and (
        s.review_status <> 'allowed'
        or s.can_fetch = false
        or l.fetch_validation_status in ('blocked', 'unreachable')
        or l.lake_match_status = 'mismatched'
        or l.usability_status = 'not_usable'
      )
    ) as is_blocked_candidate
  from public.waterbody_source_links l
  join public.source_registry s on s.id = l.source_id
),
metrics as (
  select
    w.id as lake_id,
    coalesce(
      bool_or(
        le.source_mode = 'aerial'
        and le.is_fetch_ready
        and le.usability_status = 'usable'
      ),
      false
    ) as aerial_available,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.depth_source_kind = 'machine_readable'
        and le.is_fetch_ready
        and le.lake_match_status = 'matched'
        and le.usability_status = 'usable'
      ),
      false
    ) as depth_machine_readable_available,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.depth_source_kind = 'chart_image'
        and le.is_fetch_ready
        and le.lake_match_status = 'matched'
        and le.usability_status = 'usable'
      ),
      false
    ) as depth_chart_image_available,
    coalesce(bool_or(le.is_pending), false) as has_pending,
    coalesce(bool_or(le.is_blocked_candidate), false) as has_blocked_candidate,
    coalesce(
      bool_or(
        le.source_mode = 'depth'
        and le.is_fetch_ready
        and (
          le.lake_match_status <> 'matched'
          or le.usability_status <> 'usable'
        )
      ),
      false
    ) as has_depth_pending_match_or_usability
  from public.waterbody_index w
  left join link_eval le on le.lake_id = w.id
  group by w.id
)
select
  m.lake_id,
  m.aerial_available,
  m.depth_machine_readable_available,
  m.depth_chart_image_available,
  case
    when m.aerial_available and m.depth_machine_readable_available then 'full_depth_aerial'
    when m.depth_machine_readable_available then 'depth_only'
    when m.depth_chart_image_available then 'chart_aligned_depth'
    when m.aerial_available then 'aerial_only'
    else 'polygon_only'
  end as data_tier,
  case
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth'
    when m.aerial_available then 'aerial'
    else null
  end as best_available_mode,
  case
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'usable'
    when m.has_depth_pending_match_or_usability then 'needs_review'
    else 'unavailable'
  end as depth_usability_status,
  case
    when m.aerial_available or m.depth_machine_readable_available or m.depth_chart_image_available then 'ready'
    when m.has_pending or m.has_depth_pending_match_or_usability then 'partial'
    when m.has_blocked_candidate then 'blocked'
    else 'limited'
  end as source_status,
  case
    when m.aerial_available and (m.depth_machine_readable_available or m.depth_chart_image_available) then 'both_available'
    when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth_available'
    when m.aerial_available then 'aerial_available'
    when m.has_blocked_candidate then 'blocked'
    else 'limited'
  end as availability,
  case
    when m.depth_machine_readable_available then 'high'
    when m.aerial_available or m.depth_chart_image_available then 'medium'
    else 'low'
  end as confidence
from metrics m;

create or replace function public.search_waterbodies(
  query_text text,
  state_filter text default null,
  result_limit integer default 10
)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  surface_area_acres numeric,
  data_tier text,
  aerial_available boolean,
  depth_available boolean,
  depth_usability_status text,
  availability text,
  source_status text,
  best_available_mode text,
  confidence text
)
language sql
stable
as $$
  with params as (
    select
      public.normalize_waterbody_name(query_text) as norm_q,
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  candidate_matches as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      case
        when w.normalized_name = p.norm_q then 0
        when w.normalized_name like p.norm_q || '%' then 10
        when w.normalized_name like '%' || p.norm_q || '%' then 20
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    cross join params p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and w.normalized_name like '%' || p.norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      case
        when a.normalized_alias_name = p.norm_q then 2
        when a.normalized_alias_name like p.norm_q || '%' then 12
        when a.normalized_alias_name like '%' || p.norm_q || '%' then 22
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    cross join params p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and a.normalized_alias_name like '%' || p.norm_q || '%'
  ),
  deduped as (
    select
      c.*,
      row_number() over (
        partition by c.id
        order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
      ) as rn
    from candidate_matches c
  )
  select
    d.id as lake_id,
    d.canonical_name as name,
    d.state_code as state,
    d.county_name as county,
    d.waterbody_type,
    d.surface_area_acres,
    coalesce(a.data_tier, 'polygon_only') as data_tier,
    coalesce(a.aerial_available, false) as aerial_available,
    coalesce(a.depth_machine_readable_available, false) or
      coalesce(a.depth_chart_image_available, false) as depth_available,
    coalesce(a.depth_usability_status, 'unavailable') as depth_usability_status,
    coalesce(a.availability, 'limited') as availability,
    coalesce(a.source_status, 'limited') as source_status,
    a.best_available_mode,
    coalesce(a.confidence, 'low') as confidence
  from deduped d
  left join public.waterbody_availability_snapshot a on a.lake_id = d.id
  cross join params p
  where d.rn = 1
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
  limit (select row_limit from params);
$$;

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
values
  (
    'fixture_regional_sample',
    'lake_mary_douglas_mn',
    'Lake Mary',
    'MN',
    'Douglas',
    'lake',
    true,
    true,
    'great_lakes_upper_midwest',
    ST_SetSRID(ST_MakePoint(-95.3950, 45.9060), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-95.4100 45.9140,-95.3790 45.9140,-95.3790 45.8980,-95.4100 45.8980,-95.4100 45.9140))',
      4326
    )),
    2450,
    10,
    jsonb_build_object('fixture', true, 'notes', 'MN duplicate-name sample with both sources')
  ),
  (
    'fixture_regional_sample',
    'lake_mary_kandiyohi_mn',
    'Lake Mary',
    'MN',
    'Kandiyohi',
    'lake',
    true,
    true,
    'great_lakes_upper_midwest',
    ST_SetSRID(ST_MakePoint(-94.9470, 45.2010), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-94.9610 45.2080,-94.9330 45.2080,-94.9330 45.1940,-94.9610 45.1940,-94.9610 45.2080))',
      4326
    )),
    975,
    10,
    jsonb_build_object('fixture', true, 'notes', 'MN duplicate-name sample with aerial only')
  ),
  (
    'fixture_regional_sample',
    'long_pond_plymouth_ma',
    'Long Pond',
    'MA',
    'Plymouth',
    'pond',
    true,
    true,
    'northeast',
    ST_SetSRID(ST_MakePoint(-70.6410, 41.8320), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-70.6560 41.8400,-70.6250 41.8400,-70.6250 41.8240,-70.6560 41.8240,-70.6560 41.8400))',
      4326
    )),
    1721,
    20,
    jsonb_build_object('fixture', true, 'notes', 'MA duplicate-name sample with aerial only')
  ),
  (
    'fixture_regional_sample',
    'long_pond_barnstable_ma',
    'Long Pond',
    'MA',
    'Barnstable',
    'pond',
    true,
    true,
    'northeast',
    ST_SetSRID(ST_MakePoint(-70.0270, 41.6770), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-70.0410 41.6840,-70.0130 41.6840,-70.0130 41.6700,-70.0410 41.6700,-70.0410 41.6840))',
      4326
    )),
    762,
    20,
    jsonb_build_object('fixture', true, 'notes', 'MA duplicate-name sample with chart-depth candidate still awaiting lake-match/usability review')
  ),
  (
    'fixture_regional_sample',
    'lake_nokomis_hennepin_mn',
    'Lake Nokomis',
    'MN',
    'Hennepin',
    'lake',
    true,
    true,
    'great_lakes_upper_midwest',
    ST_SetSRID(ST_MakePoint(-93.2420, 44.9060), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-93.2550 44.9120,-93.2290 44.9120,-93.2290 44.9000,-93.2550 44.9000,-93.2550 44.9120))',
      4326
    )),
    204,
    30,
    jsonb_build_object('fixture', true, 'notes', 'Limited polygon-only sample')
  ),
  (
    'fixture_regional_sample',
    'mississippi_river_hennepin_mn',
    'Mississippi River',
    'MN',
    'Hennepin',
    'river',
    true,
    true,
    'great_lakes_upper_midwest',
    ST_SetSRID(ST_MakePoint(-93.2480, 44.9800), 4326),
    ST_Multi(ST_GeomFromText(
      'POLYGON((-93.2580 44.9860,-93.2380 44.9860,-93.2380 44.9740,-93.2580 44.9740,-93.2580 44.9860))',
      4326
    )),
    null,
    5,
    jsonb_build_object('fixture', true, 'notes', 'Should not appear in Water Reader search')
  )
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
  updated_at = timezone('utc', now());

insert into public.waterbody_aliases (waterbody_id, alias_name, alias_source)
select id, 'Mary Lake', 'fixture_alias'
from public.waterbody_index
where external_source = 'fixture_regional_sample' and external_id in ('lake_mary_douglas_mn', 'lake_mary_kandiyohi_mn')
on conflict (waterbody_id, normalized_alias_name) do nothing;

insert into public.waterbody_aliases (waterbody_id, alias_name, alias_source)
select id, 'Nokomis', 'fixture_alias'
from public.waterbody_index
where external_source = 'fixture_regional_sample' and external_id = 'lake_nokomis_hennepin_mn'
on conflict (waterbody_id, normalized_alias_name) do nothing;

insert into public.source_registry (
  provider_key,
  provider_name,
  state_code,
  source_type,
  source_format,
  review_status,
  can_fetch,
  can_store_original,
  can_store_normalized,
  can_store_derived_features,
  can_cache_rendered_output,
  attribution_required,
  attribution_text,
  license_url,
  validation_url,
  notes
)
values
  (
    'usgs_3dhp',
    'USGS 3D Hydrography Program',
    null,
    'national_hydrography',
    'geojson',
    'allowed',
    true,
    true,
    true,
    true,
    true,
    true,
    'USGS 3D Hydrography Program',
    'https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products',
    'https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products',
    'National named-waterbody identity backbone source.'
  ),
  (
    'esri_naip_public',
    'NAIP ImageServer',
    null,
    'aerial_imagery',
    'arcgis_image_server',
    'allowed',
    true,
    false,
    false,
    false,
    false,
    true,
    'Esri, USDA Farm Service Agency, Microsoft',
    'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer',
    'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
    'Approved aerial fallback for this backbone pass. Do not treat this as analysis/caching authorization beyond explicit rights review.'
  ),
  (
    'mn_dnr_bathymetric_contours',
    'Minnesota DNR Bathymetric Contours',
    'MN',
    'bathymetry_vector',
    'arcgis_feature_server',
    'allowed',
    true,
    false,
    false,
    false,
    false,
    true,
    'Minnesota DNR bathymetric contours',
    'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0',
    'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0?f=pjson',
    'Reviewed machine-readable sample source for Minnesota depth coverage.'
  ),
  (
    'mn_dnr_lakefinder',
    'Minnesota DNR LakeFinder',
    'MN',
    'bathymetry_pdf',
    'html',
    'restricted',
    false,
    false,
    false,
    false,
    false,
    true,
    'Minnesota DNR LakeFinder',
    'https://www.dnr.state.mn.us/lakefind/index.html',
    'https://www.dnr.state.mn.us/lakefind/index.html',
    'Known source reference only; not approved for V1 depth availability in this migration.'
  ),
  (
    'ma_sample_chart',
    'Massachusetts Chart Sample',
    'MA',
    'bathymetry_image',
    'html',
    'allowed',
    true,
    false,
    false,
    false,
    false,
    true,
    'Public chart sample',
    'https://www.mass.gov/',
    'https://www.mass.gov/',
    'Placeholder reviewed chart-image sample to exercise chart-aligned depth logic in fixtures. Provider root reachability is not link proof.'
  )
on conflict (provider_key) do update
set
  provider_name = excluded.provider_name,
  state_code = excluded.state_code,
  source_type = excluded.source_type,
  source_format = excluded.source_format,
  review_status = excluded.review_status,
  can_fetch = excluded.can_fetch,
  can_store_original = excluded.can_store_original,
  can_store_normalized = excluded.can_store_normalized,
  can_store_derived_features = excluded.can_store_derived_features,
  can_cache_rendered_output = excluded.can_cache_rendered_output,
  attribution_required = excluded.attribution_required,
  attribution_text = excluded.attribution_text,
  license_url = excluded.license_url,
  validation_url = excluded.validation_url,
  notes = excluded.notes,
  updated_at = timezone('utc', now());

insert into public.waterbody_source_links (
  waterbody_id,
  source_id,
  source_mode,
  depth_source_kind,
  approval_status,
  coverage_status,
  source_path,
  source_path_type,
  fetch_validation_status,
  fetch_validation_method,
  fetch_validation_target_url,
  fetch_validation_checked_at,
  fetch_validation_http_status,
  lake_match_status,
  usability_status,
  metadata
)
select
  w.id,
  s.id,
  v.source_mode,
  v.depth_source_kind,
  v.approval_status,
  v.coverage_status,
  v.source_path,
  v.source_path_type,
  v.fetch_validation_status,
  v.fetch_validation_method,
  v.fetch_validation_target_url,
  timezone('utc', now()),
  v.fetch_validation_http_status,
  v.lake_match_status,
  v.usability_status,
  v.metadata
from (
  values
    (
      'lake_mary_douglas_mn',
      'esri_naip_public',
      'aerial',
      'none',
      'approved',
      'available',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      'service_root',
      'reachable',
      'head',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      200,
      'matched',
      'usable',
      jsonb_build_object('fixture', true, 'notes', 'Approved aerial source-path fixture for Lake Mary (Douglas).')
    ),
    (
      'lake_mary_douglas_mn',
      'mn_dnr_bathymetric_contours',
      'depth',
      'machine_readable',
      'approved',
      'available',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0?f=pjson',
      'service_root',
      'reachable',
      'head',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0?f=pjson',
      200,
      'matched',
      'usable',
      jsonb_build_object('fixture', true, 'notes', 'Reviewed machine-readable depth source-path fixture for Minnesota sample.')
    ),
    (
      'lake_mary_kandiyohi_mn',
      'esri_naip_public',
      'aerial',
      'none',
      'approved',
      'available',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      'service_root',
      'reachable',
      'head',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      200,
      'matched',
      'usable',
      jsonb_build_object('fixture', true, 'notes', 'Aerial-only sample for duplicate-name handling.')
    ),
    (
      'long_pond_plymouth_ma',
      'esri_naip_public',
      'aerial',
      'none',
      'approved',
      'available',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      'service_root',
      'reachable',
      'head',
      'https://naip.imagery1.arcgis.com/arcgis/rest/services/NAIP/ImageServer?f=pjson',
      200,
      'matched',
      'usable',
      jsonb_build_object('fixture', true, 'notes', 'Aerial-only sample in Massachusetts.')
    ),
    (
      'long_pond_barnstable_ma',
      'ma_sample_chart',
      'depth',
      'chart_image',
      'approved',
      'available',
      'https://www.mass.gov/',
      'document',
      'reachable',
      'head',
      'https://www.mass.gov/',
      200,
      'unknown',
      'needs_review',
      jsonb_build_object('fixture', true, 'notes', 'Reachable reviewed chart candidate, but not yet lake-matched or marked usable for honest depth availability.')
    ),
    (
      'lake_nokomis_hennepin_mn',
      'mn_dnr_lakefinder',
      'depth',
      'chart_image',
      'approved',
      'limited',
      'https://www.dnr.state.mn.us/lakefind/index.html',
      'document',
      'blocked',
      'head',
      'https://www.dnr.state.mn.us/lakefind/index.html',
      200,
      'unknown',
      'not_usable',
      jsonb_build_object('fixture', true, 'notes', 'Restricted source should not count toward depth availability.')
    )
) as v (
  waterbody_external_id,
  provider_key,
  source_mode,
  depth_source_kind,
  approval_status,
  coverage_status,
  source_path,
  source_path_type,
  fetch_validation_status,
  fetch_validation_method,
  fetch_validation_target_url,
  fetch_validation_http_status,
  lake_match_status,
  usability_status,
  metadata
)
join public.waterbody_index w
  on w.external_source = 'fixture_regional_sample'
  and w.external_id = v.waterbody_external_id
join public.source_registry s
  on s.provider_key = v.provider_key
on conflict (waterbody_id, source_id, source_mode, source_path) do update
set
  depth_source_kind = excluded.depth_source_kind,
  approval_status = excluded.approval_status,
  coverage_status = excluded.coverage_status,
  source_path_type = excluded.source_path_type,
  fetch_validation_status = excluded.fetch_validation_status,
  fetch_validation_method = excluded.fetch_validation_method,
  fetch_validation_target_url = excluded.fetch_validation_target_url,
  fetch_validation_checked_at = excluded.fetch_validation_checked_at,
  fetch_validation_http_status = excluded.fetch_validation_http_status,
  lake_match_status = excluded.lake_match_status,
  usability_status = excluded.usability_status,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());
