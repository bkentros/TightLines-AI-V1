-- Planning-only aerial close-tile metadata for Water Reader.
-- Returns only WGS84 bboxes and prototype labels. Does not return polygon geometry,
-- fetch imagery, store imagery, score fish zones, use depth, or create overlays.

create or replace function public.plan_waterbody_aerial_tiles(
  lake_id uuid,
  requested_max_close_tiles integer default 3
)
returns table (
  tile_kind text,
  tile_id integer,
  priority integer,
  label text,
  min_lon double precision,
  min_lat double precision,
  max_lon double precision,
  max_lat double precision,
  water_fraction double precision,
  shoreline_score double precision,
  max_close_tiles integer,
  prototype_only boolean
)
language sql
stable
as $$
with params as (
  select least(12, greatest(1, coalesce(requested_max_close_tiles, 3))) as tile_limit
),
target as (
  select
    w.id,
    w.geometry,
    w.centroid,
    w.surface_area_acres
  from public.waterbody_index w
  where w.id = lake_id
    and w.waterbody_type in ('lake', 'pond', 'reservoir')
    and w.geometry is not null
    and not ST_IsEmpty(w.geometry)
  limit 1
),
raw_bounds as (
  select
    ST_XMin(ST_Envelope(geometry))::double precision as min_lon,
    ST_YMin(ST_Envelope(geometry))::double precision as min_lat,
    ST_XMax(ST_Envelope(geometry))::double precision as max_lon,
    ST_YMax(ST_Envelope(geometry))::double precision as max_lat,
    ST_X(centroid)::double precision as center_lon,
    ST_Y(centroid)::double precision as center_lat,
    geometry
  from target
),
context_padded as (
  select
    greatest(-180.0, ((min_lon + max_lon) / 2.0) - least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as min_lon,
    greatest(-90.0, ((min_lat + max_lat) / 2.0) - least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as min_lat,
    least(180.0, ((min_lon + max_lon) / 2.0) + least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as max_lon,
    least(90.0, ((min_lat + max_lat) / 2.0) + least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as max_lat,
    center_lon,
    center_lat,
    geometry
  from raw_bounds
  where min_lon < max_lon
    and min_lat < max_lat
),
tile_dimensions as (
  select
    c.*,
    -- Close tiles are intentionally smaller than the context bbox. They are candidate
    -- views around water/shoreline geometry, not exhaustive coverage.
    least(0.035, greatest(0.0018, (c.max_lat - c.min_lat) * 0.18)) as half_lat,
    least(
      0.035 / greatest(0.25, abs(cos(radians(c.center_lat)))),
      greatest(0.0018 / greatest(0.25, abs(cos(radians(c.center_lat)))), (c.max_lon - c.min_lon) * 0.18)
    ) as half_lon
  from context_padded c
),
candidate_centers as (
  select
    row_number() over () as candidate_id,
    ST_SetSRID(ST_MakePoint(
      d.min_lon + ((d.max_lon - d.min_lon) * gx / 6.0),
      d.min_lat + ((d.max_lat - d.min_lat) * gy / 6.0)
    ), 4326) as center_point,
    d.*
  from tile_dimensions d
  cross join generate_series(0, 6) gx
  cross join generate_series(0, 6) gy
  union all
  select
    10000,
    ST_SetSRID(ST_MakePoint(center_lon, center_lat), 4326),
    d.*
  from tile_dimensions d
),
candidate_tiles as (
  select
    candidate_id,
    ST_MakeEnvelope(
      greatest(-180.0, ST_X(center_point) - half_lon),
      greatest(-90.0, ST_Y(center_point) - half_lat),
      least(180.0, ST_X(center_point) + half_lon),
      least(90.0, ST_Y(center_point) + half_lat),
      4326
    ) as tile_geom,
    geometry
  from candidate_centers
),
candidate_scores as (
  select
    candidate_id,
    tile_geom,
    ST_Area(ST_CollectionExtract(ST_Intersection(tile_geom, geometry), 3)::geography)
      / nullif(ST_Area(tile_geom::geography), 0) as water_fraction,
    ST_Length(ST_CollectionExtract(ST_Intersection(ST_Boundary(geometry), tile_geom), 2)::geography)
      / greatest(ST_Perimeter(tile_geom::geography), 1) as shoreline_score
  from candidate_tiles
  where ST_Intersects(tile_geom, geometry)
),
ranked as (
  select
    *,
    row_number() over (
      order by
        (
          least(coalesce(water_fraction, 0), 0.85) * 100.0
          + least(coalesce(shoreline_score, 0), 1.25) * 160.0
          + case
              when coalesce(water_fraction, 0) between 0.12 and 0.70 then 35.0
              when coalesce(water_fraction, 0) > 0.92 then -20.0
              else 0.0
            end
        ) desc,
        candidate_id
    ) as rn
  from candidate_scores
  where coalesce(water_fraction, 0) >= 0.08
),
context_row as (
  select
    'context'::text as tile_kind,
    0::integer as tile_id,
    0::integer as priority,
    'open_water_context'::text as label,
    min_lon,
    min_lat,
    max_lon,
    max_lat,
    null::double precision as water_fraction,
    null::double precision as shoreline_score,
    (select tile_limit from params)::integer as max_close_tiles,
    true as prototype_only
  from context_padded
  where min_lon < max_lon and min_lat < max_lat
),
close_rows as (
  select
    'close'::text as tile_kind,
    rn::integer as tile_id,
    rn::integer as priority,
    case
      when water_fraction between 0.08 and 0.45 and shoreline_score >= 0.15 then 'narrow_arm_candidate'
      when shoreline_score >= 0.08 then 'shoreline_candidate'
      else 'open_water_context'
    end::text as label,
    ST_XMin(tile_geom)::double precision as min_lon,
    ST_YMin(tile_geom)::double precision as min_lat,
    ST_XMax(tile_geom)::double precision as max_lon,
    ST_YMax(tile_geom)::double precision as max_lat,
    water_fraction::double precision,
    shoreline_score::double precision,
    (select tile_limit from params)::integer as max_close_tiles,
    true as prototype_only
  from ranked
  where rn <= (select tile_limit from params)
)
select *
from (
  select * from context_row
  union all
  select * from close_rows
) planned_tiles
order by case when tile_kind = 'context' then 0 else 1 end, priority;
$$;

comment on function public.plan_waterbody_aerial_tiles(uuid, integer)
  is 'Planning-only Water Reader aerial tile metadata. Returns context and close-tile WGS84 bboxes from server-side waterbody geometry; does not return polygon geometry or imagery.';

select pg_notify('pgrst', 'reload schema');
