-- Transient geometry-derived aerial candidate hints for Water Reader (RPC output only).
-- Does NOT fetch imagery, persist candidates, return full polygons, score fish presence,
-- assess depth/bathymetry/access, or imply exact fish coordinates.
--
-- Anchors and overlays are deterministic summaries from lake geometry intersections with a close-tile grid,
-- aligned with public.plan_waterbody_aerial_tiles eligibility/ranking patterns where practical.

-- Args: in_lake_id, in_requested_month (echoed as output requested_month), in_requested_max_zones (clamped [3,5]).
-- Input names avoid collisions with RETURNS TABLE output columns (lake_id, requested_month).

create or replace function public.plan_waterbody_aerial_geometry_candidates(
  in_lake_id uuid,
  in_requested_month integer default null,
  in_requested_max_zones integer default 5
)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  context_min_lon double precision,
  context_min_lat double precision,
  context_max_lon double precision,
  context_max_lat double precision,
  candidate_id integer,
  feature_tag text,
  candidate_source text,
  reason_code text,
  anchor_lon double precision,
  anchor_lat double precision,
  normalized_anchor_x double precision,
  normalized_anchor_y double precision,
  overlay_x double precision,
  overlay_y double precision,
  overlay_w double precision,
  overlay_h double precision,
  base_score double precision,
  geometry_qa jsonb,
  requested_month integer
)
language sql
stable
as $$
with params as (
  select
    in_lake_id as pid,
    in_requested_month as p_month,
    least(5, greatest(3, coalesce(in_requested_max_zones, 5)))::integer as zone_limit
),
eligibility as (
  select
    w.id as wid,
    (
      exists (
        select 1
        from public.water_reader_aerial_provider_policies p
        join public.source_registry s on s.id = p.source_id
        where p.is_enabled = true
          and p.approval_status = 'approved'
          and s.review_status = 'allowed'
          and s.can_fetch = true
          and s.source_type = 'aerial_imagery'
          and p.provider_health_status = 'reachable'
          and not (coalesce(p.coverage -> 'exclude_state_codes', '[]'::jsonb) @> to_jsonb(w.state_code))
      )
      or coalesce(
        (
          select bool_or(
            l.source_mode = 'aerial'
            and l.approval_status = 'approved'
            and s.review_status = 'allowed'
            and s.can_fetch = true
            and l.fetch_validation_status = 'reachable'
            and l.coverage_status not in ('blocked', 'unavailable')
            and l.usability_status = 'usable'
          )
          from public.waterbody_source_links l
          join public.source_registry s on s.id = l.source_id
          where l.waterbody_id = w.id
        ),
        false
      )
    ) as aerial_ok
  from public.waterbody_index w
  cross join params p
  where w.id = p.pid
    and w.waterbody_type in ('lake', 'pond', 'reservoir')
    and w.state_code not in ('AK', 'HI', 'PR', 'GU', 'MP')
),
target as (
  select
    w.id as lake_row_id,
    w.canonical_name,
    w.state_code,
    w.county_name,
    w.waterbody_type as wb_type,
    ST_SetSRID(
      ST_Multi(ST_CollectionExtract(ST_MakeValid(ST_Force2D(w.geometry)), 3)),
      4326
    )::geometry(MultiPolygon, 4326) as geom,
    w.geometry as geom_orig,
    ST_IsValid(w.geometry) as geom_was_valid,
    e.aerial_ok
  from public.waterbody_index w
  join eligibility e on e.wid = w.id and e.aerial_ok = true
  where w.id = (select pid from params)
    and w.geometry is not null
    and not ST_IsEmpty(w.geometry)
    and not ST_IsEmpty(
      ST_Multi(ST_CollectionExtract(ST_MakeValid(ST_Force2D(w.geometry)), 3))
    )
),
raw_bounds as (
  select
    ST_XMin(ST_Envelope(geom))::double precision as min_lon,
    ST_YMin(ST_Envelope(geom))::double precision as min_lat,
    ST_XMax(ST_Envelope(geom))::double precision as max_lon,
    ST_YMax(ST_Envelope(geom))::double precision as max_lat,
    geom,
    geom_orig,
    geom_was_valid,
    lake_row_id,
    canonical_name,
    state_code,
    county_name,
    wb_type
  from target
),
context_padded as (
  select
    greatest(-180.0, ((min_lon + max_lon) / 2.0) - least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as ctx_min_lon,
    greatest(-90.0, ((min_lat + max_lat) / 2.0) - least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as ctx_min_lat,
    least(180.0, ((min_lon + max_lon) / 2.0) + least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as ctx_max_lon,
    least(90.0, ((min_lat + max_lat) / 2.0) + least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as ctx_max_lat,
    geom,
    geom_orig,
    geom_was_valid,
    lake_row_id,
    canonical_name,
    state_code,
    county_name,
    wb_type
  from raw_bounds
  where min_lon < max_lon
    and min_lat < max_lat
),
tile_dimensions as (
  select
    c.*,
    least(0.035, greatest(0.0018, (c.ctx_max_lat - c.ctx_min_lat) * 0.18)) as half_lat,
    least(
      0.035 / greatest(0.25, abs(cos(radians((c.ctx_min_lat + c.ctx_max_lat) / 2.0)))),
      greatest(
        0.0018 / greatest(0.25, abs(cos(radians((c.ctx_min_lat + c.ctx_max_lat) / 2.0)))),
        (c.ctx_max_lon - c.ctx_min_lon) * 0.18
      )
    ) as half_lon
  from context_padded c
),
candidate_centers as (
  select
    row_number() over ()::integer as cand_id,
    ST_SetSRID(
      ST_MakePoint(
        d.ctx_min_lon + ((d.ctx_max_lon - d.ctx_min_lon) * gx / 6.0),
        d.ctx_min_lat + ((d.ctx_max_lat - d.ctx_min_lat) * gy / 6.0)
      ),
      4326
    ) as center_point,
    d.*
  from tile_dimensions d
  cross join generate_series(0, 6) gx
  cross join generate_series(0, 6) gy
),
candidate_tiles as (
  select
    cand_id,
    ST_MakeEnvelope(
      greatest(-180.0, ST_X(center_point) - half_lon),
      greatest(-90.0, ST_Y(center_point) - half_lat),
      least(180.0, ST_X(center_point) + half_lon),
      least(90.0, ST_Y(center_point) + half_lat),
      4326
    ) as tile_geom,
    geom,
    geom_orig,
    geom_was_valid,
    lake_row_id,
    canonical_name,
    state_code,
    county_name,
    wb_type,
    ctx_min_lon,
    ctx_min_lat,
    ctx_max_lon,
    ctx_max_lat
  from candidate_centers
),
candidate_scores as (
  select
    cand_id,
    tile_geom,
    geom,
    geom_orig,
    geom_was_valid,
    lake_row_id,
    canonical_name,
    state_code,
    county_name,
    wb_type,
    ctx_min_lon,
    ctx_min_lat,
    ctx_max_lon,
    ctx_max_lat,
    ST_Area(ST_CollectionExtract(ST_Intersection(tile_geom, geom), 3)::geography)
      / nullif(ST_Area(tile_geom::geography), 0) as water_fraction,
    ST_Length(ST_CollectionExtract(ST_Intersection(ST_Boundary(geom), tile_geom), 2)::geography)
      / greatest(ST_Perimeter(tile_geom::geography), 1) as shoreline_score
  from candidate_tiles
  where ST_Intersects(tile_geom, geom)
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
        cand_id asc
    ) as rn
  from candidate_scores
  where coalesce(water_fraction, 0) >= 0.08
),
geom_qa as (
  select
    t.lake_row_id,
    t.geom,
    t.geom_orig,
    t.geom_was_valid,
    jsonb_build_object(
      'geometry_valid', t.geom_was_valid,
      'make_valid_applied', not t.geom_was_valid,
      'multipolygon_component_count', ST_NumGeometries(t.geom),
      'approx_interior_ring_count', coalesce(
        (
          select sum(ST_NumInteriorRings(d.geom))::bigint
          from ST_Dump(t.geom) as d
          where ST_GeometryType(d.geom) = 'ST_Polygon'
        ),
        0::bigint
      ),
      'bbox_fallback', false
    ) as qa
  from target t
),
ctx_merc as (
  select
    r.*,
    ST_Transform(
      ST_MakeEnvelope(r.ctx_min_lon, r.ctx_min_lat, r.ctx_max_lon, r.ctx_max_lat, 4326),
      3857
    ) as context_env3857,
    g.qa as geometry_qa
  from ranked r
  cross join geom_qa g
  where r.rn <= (select zone_limit from params)
),
merc_norm as (
  select
    c.cand_id,
    c.rn,
    c.lake_row_id,
    c.canonical_name,
    c.state_code,
    c.county_name,
    c.wb_type,
    c.ctx_min_lon,
    c.ctx_min_lat,
    c.ctx_max_lon,
    c.ctx_max_lat,
    c.water_fraction,
    c.shoreline_score,
    c.tile_geom,
    c.geom,
    c.geometry_qa,
    greatest(1e-12, ST_XMax(c.context_env3857) - ST_XMin(c.context_env3857)) as denom_x,
    greatest(1e-12, ST_YMax(c.context_env3857) - ST_YMin(c.context_env3857)) as denom_y,
    ST_XMin(c.context_env3857) as ctx_min_mx,
    ST_XMax(c.context_env3857) as ctx_max_mx,
    ST_YMin(c.context_env3857) as ctx_min_my,
    ST_YMax(c.context_env3857) as ctx_max_my,
    case
      when not ST_IsEmpty(ST_Intersection(c.geom, c.tile_geom))
      then ST_Centroid(ST_Intersection(c.geom, c.tile_geom))
      else ST_ClosestPoint(c.geom, ST_Centroid(c.tile_geom))
    end as anchor_geom
  from ctx_merc c
),
final_norm as (
  select
    m.*,
    ST_Transform(m.anchor_geom, 3857) as anchor3857,
    ST_Envelope(ST_Transform(m.tile_geom, 3857)) as tile_env3857
  from merc_norm m
),
computed as (
  select
    f.lake_row_id,
    f.canonical_name,
    f.state_code,
    f.county_name,
    f.wb_type,
    f.ctx_min_lon,
    f.ctx_min_lat,
    f.ctx_max_lon,
    f.ctx_max_lat,
    f.cand_id,
    case
      when coalesce(f.shoreline_score, 0) >= 0.10 then 'shoreline_complexity'
      else 'coverage_distribution'
    end as feature_tag,
    'geometry_candidate'::text as candidate_source,
    case
      when coalesce(f.shoreline_score, 0) >= 0.10 then 'shoreline_area_geometry_context'
      else 'map_region_callout'
    end as reason_code,
    ST_X(f.anchor_geom)::double precision as anchor_lon,
    ST_Y(f.anchor_geom)::double precision as anchor_lat,
    ((ST_X(ST_Transform(f.anchor_geom, 3857)) - f.ctx_min_mx) / f.denom_x)::double precision as normalized_anchor_x,
    ((f.ctx_max_my - ST_Y(ST_Transform(f.anchor_geom, 3857))) / f.denom_y)::double precision as normalized_anchor_y,
    greatest(0.0, least(1.0,
      ((ST_XMin(f.tile_env3857) - f.ctx_min_mx) / f.denom_x)::double precision
    )) as overlay_x,
    greatest(0.0, least(1.0,
      ((f.ctx_max_my - ST_YMax(f.tile_env3857)) / f.denom_y)::double precision
    )) as overlay_y,
    greatest(0.0, least(1.0,
      ((ST_XMax(f.tile_env3857) - ST_XMin(f.tile_env3857)) / f.denom_x)::double precision
    )) as overlay_w,
    greatest(0.0, least(1.0,
      ((ST_YMax(f.tile_env3857) - ST_YMin(f.tile_env3857)) / f.denom_y)::double precision
    )) as overlay_h,
    least(
      1.0::double precision,
      greatest(
        0.0::double precision,
        0.18::double precision
        + least(coalesce(f.water_fraction, 0), 1.0) * 0.42::double precision
        + least(coalesce(f.shoreline_score, 0), 1.2) * 0.32::double precision
      )
    ) as base_score,
    f.geometry_qa
  from final_norm f
)
select
  c.lake_row_id as lake_id,
  c.canonical_name as name,
  c.state_code as state,
  c.county_name as county,
  c.wb_type as waterbody_type,
  c.ctx_min_lon as context_min_lon,
  c.ctx_min_lat as context_min_lat,
  c.ctx_max_lon as context_max_lon,
  c.ctx_max_lat as context_max_lat,
  c.cand_id as candidate_id,
  c.feature_tag,
  c.candidate_source,
  c.reason_code,
  c.anchor_lon,
  c.anchor_lat,
  c.normalized_anchor_x,
  c.normalized_anchor_y,
  c.overlay_x,
  c.overlay_y,
  c.overlay_w,
  c.overlay_h,
  c.base_score,
  c.geometry_qa,
  (select p_month from params) as requested_month
from computed c
order by c.cand_id;
$$;

comment on function public.plan_waterbody_aerial_geometry_candidates(uuid, integer, integer) is
  'Transient server-side geometry hints for Water Reader: close-tile anchors from lake polygon; no imagery, no persistence, no polygon payload, no fish/depth/access claims. Args: in_lake_id, in_requested_month (echoed), in_requested_max_zones (clamped [3,5]).';

select pg_notify('pgrst', 'reload schema');

-- Smoke (commented — run manually after deploy; replace in_lake_id with a real waterbody_index.id):
-- select * from public.plan_waterbody_aerial_geometry_candidates(
--   in_lake_id := '00000000-0000-0000-0000-000000000000'::uuid,
--   in_requested_month := 6,
--   in_requested_max_zones := 5
-- );
