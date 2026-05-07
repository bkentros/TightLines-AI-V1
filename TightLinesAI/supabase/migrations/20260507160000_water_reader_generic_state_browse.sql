-- Water Reader: fast state browse fallback for generic searches like "lake".
--
-- The app normally searches specific lake names. Users still type broad
-- generic terms while composing a query, and those should return quickly
-- instead of running the full fuzzy name-search path.

create index if not exists waterbody_index_browse_state_type_idx
  on public.waterbody_index (
    state_code,
    waterbody_type,
    search_priority,
    surface_area_acres desc,
    canonical_name,
    county_name
  )
  where
    is_named = true
    and is_searchable = true
    and county_name is not null
    and waterbody_type in ('lake', 'pond', 'reservoir');

create or replace function public.browse_waterbodies_by_state(
  state_filter text default null,
  waterbody_type_filter text default null,
  result_limit integer default 10
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
  polygon_qa_flags text[]
)
language sql
stable
as $$
  with params as (
    select
      upper(nullif(trim(state_filter), '')) as state_q,
      lower(nullif(trim(waterbody_type_filter), '')) as type_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  limited_ids as materialized (
    select
      w.id,
      w.surface_area_acres,
      w.search_priority,
      w.canonical_name,
      w.state_code,
      w.county_name
    from public.waterbody_index w
    cross join params p
    where
      w.is_named = true
      and w.is_searchable = true
      and w.county_name is not null
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (p.type_q is null or w.waterbody_type = p.type_q)
    order by
      w.search_priority,
      w.surface_area_acres desc nulls last,
      w.canonical_name,
      w.state_code,
      coalesce(w.county_name, '')
    limit (select row_limit from params)
  ),
  limited as materialized (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      w.search_priority,
      ST_NumGeometries(w.geometry) as poly_components,
      ST_NPoints(w.geometry) as poly_pts,
      case
        when w.geometry is null or ST_IsEmpty(w.geometry) then false
        else coalesce(ST_IsValid(w.geometry), false)
      end as geom_valid
    from limited_ids i
    join public.waterbody_index w on w.id = i.id
  ),
  bbox_raw as (
    select
      d.id,
      ST_XMin(env)::double precision as min_lon,
      ST_YMin(env)::double precision as min_lat,
      ST_XMax(env)::double precision as max_lon,
      ST_YMax(env)::double precision as max_lat
    from limited d
    cross join lateral (select ST_Envelope(d.geometry) as env) e
  ),
  bbox_padded as (
    select
      id,
      (min_lon + max_lon) / 2.0 as center_lon,
      (min_lat + max_lat) / 2.0 as center_lat,
      least(
        0.18,
        greatest(0.002, ((max_lat - min_lat) / 2.0) * 1.08)
      ) as half_lat,
      least(
        0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
        greatest(
          0.002 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
          ((max_lon - min_lon) / 2.0) * 1.08
        )
      ) as half_lon
    from bbox_raw
    where min_lon < max_lon and min_lat < max_lat
  ),
  bbox as (
    select
      id,
      greatest(-180.0, center_lon - half_lon) as min_lon,
      greatest(-90.0, center_lat - half_lat) as min_lat,
      least(180.0, center_lon + half_lon) as max_lon,
      least(90.0, center_lat + half_lat) as max_lat
    from bbox_padded
  )
  select
    d.id as lake_id,
    d.canonical_name as name,
    d.state_code as state,
    d.county_name as county,
    d.waterbody_type,
    d.surface_area_acres,
    ST_Y(d.centroid) as centroid_lat,
    ST_X(d.centroid) as centroid_lon,
    b.min_lon as preview_bbox_min_lon,
    b.min_lat as preview_bbox_min_lat,
    b.max_lon as preview_bbox_max_lon,
    b.max_lat as preview_bbox_max_lat,
    'polygon_only'::text as data_tier,
    false as aerial_available,
    false as depth_available,
    'unavailable'::text as depth_usability_status,
    'limited'::text as availability,
    'limited'::text as source_status,
    null::text as best_available_mode,
    'low'::text as confidence,
    case
      when not d.geom_valid then 'not_supported'
      when d.surface_area_acres is not null and d.surface_area_acres < 20 then 'limited'
      when d.poly_components > 1 or d.poly_pts > 25000 then 'limited'
      else 'supported'
    end as water_reader_support_status,
    case
      when not d.geom_valid then 'Stored polygon failed validity checks.'
      when d.poly_components > 1 then 'Multipart polygon; Water Reader can open the primary geometry with limited-read caution.'
      when d.poly_pts > 25000 then 'High-complexity polygon; Water Reader can open it with limited-read caution.'
      when d.surface_area_acres is not null and d.surface_area_acres < 20 then 'Small waterbody; structure read may be limited.'
      else 'Valid hydrography polygon meets baseline V1 checks.'
    end as water_reader_support_reason,
    d.geom_valid as has_polygon_geometry,
    d.surface_area_acres::double precision as polygon_area_acres,
    array_remove(array[
      case when not d.geom_valid then 'invalid_geometry' end,
      case when d.poly_components > 1 then 'multipart_geometry' end,
      case when d.surface_area_acres is not null and d.surface_area_acres >= 0.5 and d.surface_area_acres < 20 then 'small_waterbody' end,
      case when d.poly_pts > 25000 then 'high_vertex_count' end
    ], null) as polygon_qa_flags
  from limited d
  left join bbox b on b.id = d.id
  order by
    d.search_priority,
    d.surface_area_acres desc nulls last,
    d.canonical_name,
    d.state_code,
    coalesce(d.county_name, '');
$$;

select pg_notify('pgrst', 'reload schema');
