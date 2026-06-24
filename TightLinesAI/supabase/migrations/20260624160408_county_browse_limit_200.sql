-- Raise county browse cap so users can scroll all lakes in a county (sorted by acres).

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
      greatest(1, least(coalesce(result_limit, 25), 200)) as row_limit
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

alter function public.browse_waterbodies_by_county(text, text, integer)
  set search_path = public;

notify pgrst, 'reload schema';
