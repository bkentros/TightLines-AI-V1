-- Water Reader discovery: county browse, near-me, and county directory.

create index if not exists waterbody_index_centroid_geog_idx
  on public.waterbody_index using gist ((centroid::geography))
  where
    is_named = true
    and is_searchable = true
    and county_name is not null;

create index if not exists waterbody_index_state_county_browse_idx
  on public.waterbody_index (state_code, county_name, search_priority, surface_area_acres desc)
  where
    is_named = true
    and is_searchable = true
    and county_name is not null
    and waterbody_type in ('lake', 'pond', 'reservoir');

create or replace function public.browse_waterbodies_by_county(
  state_filter text,
  county_filter text,
  result_limit integer default 25
)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  surface_area_acres numeric,
  centroid_lat double precision,
  centroid_lon double precision,
  preview_bbox_min_lon double precision,
  preview_bbox_min_lat double precision,
  preview_bbox_max_lon double precision,
  preview_bbox_max_lat double precision,
  data_tier text,
  aerial_available boolean,
  depth_available boolean,
  depth_usability_status text,
  availability text,
  source_status text,
  best_available_mode text,
  confidence text,
  water_reader_support_status text,
  water_reader_support_reason text,
  has_polygon_geometry boolean,
  polygon_area_acres double precision,
  polygon_qa_flags text[],
  distance_miles double precision
)
language sql
stable
as $$
  with params as (
    select
      upper(nullif(trim(state_filter), '')) as state_q,
      initcap(nullif(trim(county_filter), '')) as county_q,
      greatest(1, least(coalesce(result_limit, 25), 25)) as row_limit
  ),
  limited as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      w.search_priority
    from public.waterbody_index w
    cross join params p
    where
      p.state_q is not null
      and p.county_q is not null
      and w.is_named = true
      and w.is_searchable = true
      and w.county_name is not null
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and w.state_code = p.state_q
      and w.county_name = p.county_q
    order by
      w.search_priority,
      w.surface_area_acres desc nulls last,
      w.canonical_name
    limit (select row_limit from params)
  )
  select
    e.*,
    null::double precision as distance_miles
  from limited d
  cross join lateral public.search_waterbodies_enrich_row(
    d.id,
    d.canonical_name,
    d.state_code,
    d.county_name,
    d.waterbody_type,
    d.surface_area_acres,
    d.centroid,
    d.geometry
  ) e;
$$;

create or replace function public.browse_waterbodies_near_point(
  lat double precision,
  lon double precision,
  radius_miles double precision default 40,
  state_filter text default null,
  result_limit integer default 25
)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  surface_area_acres numeric,
  centroid_lat double precision,
  centroid_lon double precision,
  preview_bbox_min_lon double precision,
  preview_bbox_min_lat double precision,
  preview_bbox_max_lon double precision,
  preview_bbox_max_lat double precision,
  data_tier text,
  aerial_available boolean,
  depth_available boolean,
  depth_usability_status text,
  availability text,
  source_status text,
  best_available_mode text,
  confidence text,
  water_reader_support_status text,
  water_reader_support_reason text,
  has_polygon_geometry boolean,
  polygon_area_acres double precision,
  polygon_qa_flags text[],
  distance_miles double precision
)
language sql
stable
as $$
  with params as (
    select
      lat as lat_q,
      lon as lon_q,
      greatest(1.0, least(coalesce(radius_miles, 40.0), 120.0)) as radius_q,
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 25), 25)) as row_limit,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography as origin
  ),
  limited as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      ST_Distance(w.centroid::geography, p.origin) / 1609.344 as distance_miles
    from public.waterbody_index w
    cross join params p
    where
      p.lat_q between -90 and 90
      and p.lon_q between -180 and 180
      and w.is_named = true
      and w.is_searchable = true
      and w.county_name is not null
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and ST_DWithin(w.centroid::geography, p.origin, p.radius_q * 1609.344)
    order by
      distance_miles,
      w.search_priority,
      w.surface_area_acres desc nulls last,
      w.canonical_name
    limit (select row_limit from params)
  )
  select
    e.lake_id,
    e.name,
    e.state,
    e.county,
    e.waterbody_type,
    e.surface_area_acres,
    e.centroid_lat,
    e.centroid_lon,
    e.preview_bbox_min_lon,
    e.preview_bbox_min_lat,
    e.preview_bbox_max_lon,
    e.preview_bbox_max_lat,
    e.data_tier,
    e.aerial_available,
    e.depth_available,
    e.depth_usability_status,
    e.availability,
    e.source_status,
    e.best_available_mode,
    e.confidence,
    e.water_reader_support_status,
    e.water_reader_support_reason,
    e.has_polygon_geometry,
    e.polygon_area_acres,
    e.polygon_qa_flags,
    d.distance_miles
  from limited d
  cross join lateral public.search_waterbodies_enrich_row(
    d.id,
    d.canonical_name,
    d.state_code,
    d.county_name,
    d.waterbody_type,
    d.surface_area_acres,
    d.centroid,
    d.geometry
  ) e
  order by d.distance_miles, e.name;
$$;

create or replace function public.list_waterbody_counties_for_state(
  state_filter text,
  result_limit integer default 120
)
returns table (
  county text,
  waterbody_count bigint
)
language sql
stable
as $$
  with params as (
    select
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 120), 200)) as row_limit
  )
  select
    w.county_name as county,
    count(*)::bigint as waterbody_count
  from public.waterbody_index w
  cross join params p
  where
    p.state_q is not null
    and w.state_code = p.state_q
    and w.is_named = true
    and w.is_searchable = true
    and w.county_name is not null
    and w.waterbody_type in ('lake', 'pond', 'reservoir')
  group by w.county_name
  order by waterbody_count desc, county
  limit (select row_limit from params);
$$;

alter function public.browse_waterbodies_by_county(text, text, integer)
  set search_path = public;
alter function public.browse_waterbodies_near_point(double precision, double precision, double precision, text, integer)
  set search_path = public;
alter function public.list_waterbody_counties_for_state(text, integer)
  set search_path = public;

grant execute on function public.browse_waterbodies_by_county(text, text, integer)
  to authenticated, service_role;
grant execute on function public.browse_waterbodies_near_point(double precision, double precision, double precision, text, integer)
  to authenticated, service_role;
grant execute on function public.list_waterbody_counties_for_state(text, integer)
  to authenticated, service_role;

notify pgrst, 'reload schema';
