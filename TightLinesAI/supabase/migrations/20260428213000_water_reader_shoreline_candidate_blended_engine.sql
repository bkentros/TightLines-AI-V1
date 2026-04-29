-- Water Reader shoreline candidate blended engine (geometry-only).
-- Replaces the coarse/threshold-sensitive candidate internals while preserving the
-- RPC signature and output shape used by the existing Edge/client adapters.
--
-- Deterministic inputs only: waterbody_index.geometry + approved aerial policy eligibility.
-- No imagery fetch/cache/storage/export, no CV/pixel analysis, no depth/bathymetry/contours,
-- no access claims, no exact fish-location assertions, and no persisted candidate outputs.

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
    )::geometry(multipolygon, 4326) as geom,
    w.geometry as geom_orig,
    ST_IsValid(w.geometry) as geom_was_valid
  from public.waterbody_index w
  join eligibility e on e.wid = w.id and e.aerial_ok = true
  where w.id = (select pid from params)
    and w.geometry is not null
    and not ST_IsEmpty(w.geometry)
    and ST_GeometryType(ST_MakeValid(ST_Force2D(w.geometry))) in ('ST_MultiPolygon', 'ST_Polygon')
),
raw_bounds as (
  select
    ST_XMin(ST_Envelope(geom))::double precision as min_lon,
    ST_YMin(ST_Envelope(geom))::double precision as min_lat,
    ST_XMax(ST_Envelope(geom))::double precision as max_lon,
    ST_YMax(ST_Envelope(geom))::double precision as max_lat,
    *
  from target
  where not ST_IsEmpty(geom)
),
context_padded as (
  select
    greatest(-180.0, ((min_lon + max_lon) / 2.0) - least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as ctx_min_lon,
    greatest(-90.0, ((min_lat + max_lat) / 2.0) - least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as ctx_min_lat,
    least(180.0, ((min_lon + max_lon) / 2.0) + least(0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), greatest(0.003 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))), ((max_lon - min_lon) / 2.0) * 1.08))) as ctx_max_lon,
    least(90.0, ((min_lat + max_lat) / 2.0) + least(0.18, greatest(0.003, ((max_lat - min_lat) / 2.0) * 1.08))) as ctx_max_lat,
    *
  from raw_bounds
  where min_lon < max_lon
    and min_lat < max_lat
),
lake_parts as (
  select
    c.*,
    d.geom::geometry(polygon, 4326) as poly_geom,
    d.path[1] as part_idx
  from context_padded c
  cross join lateral ST_Dump(c.geom) as d
  where ST_GeometryType(d.geom) = 'ST_Polygon'
),
filtered_parts as (
  select
    *,
    ST_Area(poly_geom::geography)::double precision as poly_area_m2,
    ST_Length(ST_Boundary(poly_geom)::geography)::double precision as poly_perimeter_m,
    row_number() over (order by ST_Area(poly_geom::geography) desc, part_idx asc)::integer as part_area_rank
  from lake_parts
  where ST_Area(poly_geom::geography) >= 1200::double precision
    and ST_Length(ST_Boundary(poly_geom)::geography) >= 80::double precision
),
outer_rings as (
  select
    lake_row_id,
    canonical_name,
    state_code,
    county_name,
    wb_type,
    geom as lake_geom_all,
    geom_orig,
    geom_was_valid,
    ctx_min_lon,
    ctx_min_lat,
    ctx_max_lon,
    ctx_max_lat,
    part_idx,
    part_area_rank,
    poly_geom,
    poly_area_m2,
    poly_perimeter_m,
    'exterior'::text as ring_kind,
    0::integer as ring_idx,
    ST_LineMerge(ST_ExteriorRing(poly_geom))::geometry(linestring, 4326) as ring_line
  from filtered_parts
),
inner_rings as (
  select
    fp.lake_row_id,
    fp.canonical_name,
    fp.state_code,
    fp.county_name,
    fp.wb_type,
    fp.geom as lake_geom_all,
    fp.geom_orig,
    fp.geom_was_valid,
    fp.ctx_min_lon,
    fp.ctx_min_lat,
    fp.ctx_max_lon,
    fp.ctx_max_lat,
    fp.part_idx,
    fp.part_area_rank,
    fp.poly_geom,
    fp.poly_area_m2,
    fp.poly_perimeter_m,
    'interior'::text as ring_kind,
    gs.ring_idx::integer,
    ST_LineMerge(ST_InteriorRingN(fp.poly_geom, gs.ring_idx))::geometry(linestring, 4326) as ring_line
  from filtered_parts fp
  cross join lateral generate_series(1, ST_NumInteriorRings(fp.poly_geom)) as gs(ring_idx)
  where ST_NumInteriorRings(fp.poly_geom) > 0
),
rings as (
  select
    r.*,
    ST_Transform(r.poly_geom, 3857) as poly3857,
    ST_Length(r.ring_line::geography)::double precision as ring_len_m,
    greatest(
      32,
      least(
        case when r.ring_kind = 'interior' then 140 else 240 end,
        ceil(ST_Length(r.ring_line::geography) / case when r.ring_kind = 'interior' then 18.0 else 22.0 end)::integer
      )
    )::integer as n_samples,
    case
      when r.poly_area_m2 < 50000::double precision then 45::double precision
      when r.poly_area_m2 < 1000000::double precision then 75::double precision
      when r.poly_area_m2 < 10000000::double precision then 115::double precision
      else 155::double precision
    end as local_radius_m
  from (
    select * from outer_rings
    union all
    select * from inner_rings
  ) r
  where ST_Length(r.ring_line::geography) >= 40::double precision
),
samples as (
  select
    r.*,
    gs.i::integer as samp_idx,
    ST_LineInterpolatePoint(
      r.ring_line,
      greatest(1e-9, least(1.0 - 1e-9, gs.i::double precision / nullif(r.n_samples, 0)::double precision))
    )::geometry(point, 4326) as pt_ring
  from rings r
  cross join lateral generate_series(0, r.n_samples - 1) as gs(i)
),
samples_turn as (
  select
    s.*,
    lag(s.pt_ring, 1) over (partition by s.part_idx, s.ring_kind, s.ring_idx order by s.samp_idx) as pt_prev,
    lead(s.pt_ring, 1) over (partition by s.part_idx, s.ring_kind, s.ring_idx order by s.samp_idx) as pt_next
  from samples s
),
samples_closed as (
  select
    s.*,
    coalesce(
      s.pt_prev,
      first_value(s.pt_ring) over (
        partition by s.part_idx, s.ring_kind, s.ring_idx
        order by s.samp_idx desc
        rows between unbounded preceding and unbounded following
      )
    ) as pt_prev_cl,
    coalesce(
      s.pt_next,
      first_value(s.pt_ring) over (
        partition by s.part_idx, s.ring_kind, s.ring_idx
        order by s.samp_idx asc
        rows between unbounded preceding and unbounded following
      )
    ) as pt_next_cl
  from samples_turn s
),
turn_scores as (
  select
    sc.*,
    case
      when sc.pt_prev_cl is null or sc.pt_next_cl is null then 0::double precision
      else greatest(
        0::double precision,
        least(
          180::double precision,
          abs(
            180::double precision
            - coalesce(
              degrees(
                ST_Angle(
                  ST_Transform(sc.pt_prev_cl, 3857),
                  ST_Transform(sc.pt_ring, 3857),
                  ST_Transform(sc.pt_next_cl, 3857)
                )
              ),
              180::double precision
            )
          )
        )
      )
    end as turn_deg,
    ST_Distance(ST_Transform(sc.pt_prev_cl, 3857), ST_Transform(sc.pt_next_cl, 3857))::double precision as chord_m,
    ST_Distance(ST_Transform(sc.pt_prev_cl, 3857), ST_Transform(sc.pt_ring, 3857))
      + ST_Distance(ST_Transform(sc.pt_ring, 3857), ST_Transform(sc.pt_next_cl, 3857)) as arc_proxy_m
  from samples_closed sc
),
anchor_options as (
  select
    t.*,
    rm.radius_mult,
    greatest(30::double precision, least(220::double precision, t.local_radius_m * rm.radius_mult)) as patch_radius_m,
    ST_Transform(t.pt_ring, 3857) as pt3857
  from turn_scores t
  cross join (values (0.85::double precision), (1.2::double precision)) as rm(radius_mult)
),
local_water_patches as (
  select
    a.*,
    ST_CollectionExtract(
      ST_Intersection(
        a.poly3857,
        ST_Buffer(a.pt3857, a.patch_radius_m, 'quad_segs=8')
      ),
      3
    ) as local_patch3857
  from anchor_options a
),
anchors as (
  select
    p.*,
    ST_PointOnSurface(p.local_patch3857)::geometry(point, 3857) as anchor3857,
    ST_Area(p.local_patch3857)::double precision as local_patch_area_m2,
    greatest(
      42::double precision,
      least(180::double precision, p.patch_radius_m * 1.15)
    ) as overlay_half_m
  from local_water_patches p
  where not ST_IsEmpty(p.local_patch3857)
    and ST_Area(p.local_patch3857) >= 20::double precision
),
ctx_ready as (
  select
    a.*,
    ST_Transform(ST_MakeEnvelope(a.ctx_min_lon, a.ctx_min_lat, a.ctx_max_lon, a.ctx_max_lat, 4326), 3857) as context_env3857,
    ST_Transform(a.anchor3857, 4326)::geometry(point, 4326) as anchor_geom,
    ST_MakeEnvelope(
      ST_X(a.anchor3857) - a.overlay_half_m,
      ST_Y(a.anchor3857) - a.overlay_half_m,
      ST_X(a.anchor3857) + a.overlay_half_m,
      ST_Y(a.anchor3857) + a.overlay_half_m,
      3857
    ) as overlay3857
  from anchors a
),
qa_metrics as (
  select
    c.*,
    greatest(1e-12, ST_XMax(c.context_env3857) - ST_XMin(c.context_env3857)) as denom_x,
    greatest(1e-12, ST_YMax(c.context_env3857) - ST_YMin(c.context_env3857)) as denom_y,
    ST_XMin(c.context_env3857) as ctx_min_mx,
    ST_XMax(c.context_env3857) as ctx_max_mx,
    ST_YMin(c.context_env3857) as ctx_min_my,
    ST_YMax(c.context_env3857) as ctx_max_my,
    ST_Distance(c.anchor3857, ST_Boundary(c.poly3857))::double precision as dist_shore_m,
    (
      ST_Area(ST_CollectionExtract(ST_Intersection(c.overlay3857, c.poly3857), 3))
      / greatest(ST_Area(c.overlay3857), 1e-9)
    )::double precision as water_frac_overlay,
    (
      (coalesce(c.arc_proxy_m, 0::double precision) / greatest(coalesce(c.chord_m, 0::double precision), 1::double precision))
    )::double precision as sinuosity_proxy
  from ctx_ready c
),
valid_anchors as (
  select
    q.*,
    ((ST_X(q.anchor3857) - q.ctx_min_mx) / q.denom_x)::double precision as nx,
    ((q.ctx_max_my - ST_Y(q.anchor3857)) / q.denom_y)::double precision as ny
  from qa_metrics q
  where ST_Contains(q.poly3857, q.anchor3857)
    and q.dist_shore_m <= q.patch_radius_m * 1.35
    and q.water_frac_overlay >= 0.18::double precision
),
scored_pool as (
  select
    v.*,
    case
      when v.turn_deg >= case when v.poly_area_m2 < 50000::double precision then 18::double precision else 24::double precision end
        then 'primary_shoreline_turn_v2'::text
      else 'supplemental_shoreline_coverage_v2'::text
    end as candidate_pipeline,
    case
      when v.turn_deg >= case when v.poly_area_m2 < 50000::double precision then 28::double precision else 35::double precision end
        then 'shoreline_complexity'::text
      else 'coverage_distribution'::text
    end as feature_tag,
    case
      when v.turn_deg >= case when v.poly_area_m2 < 50000::double precision then 28::double precision else 35::double precision end
        then 'shoreline_area_geometry_context'::text
      else 'map_region_callout'::text
    end as reason_code,
    least(
      case
        when v.turn_deg >= case when v.poly_area_m2 < 50000::double precision then 18::double precision else 24::double precision end
          then 0.72::double precision
        else 0.38::double precision
      end,
      greatest(
        0::double precision,
        0.16::double precision
        + least(coalesce(v.turn_deg, 0::double precision) / 140::double precision, 1::double precision) * 0.34::double precision
        + least(coalesce(v.water_frac_overlay, 0::double precision), 1::double precision) * 0.28::double precision
        + least(greatest(coalesce(v.sinuosity_proxy, 1::double precision) - 1::double precision, 0::double precision), 1::double precision) * 0.10::double precision
      )
    ) as base_score_raw,
    case
      when v.turn_deg >= case when v.poly_area_m2 < 50000::double precision then 18::double precision else 24::double precision end
        then 0
      else 1
    end as pipeline_rank
  from valid_anchors v
),
nms_pre as (
  select
    s.*,
    floor(s.nx / 0.075)::bigint as bx,
    floor(s.ny / 0.075)::bigint as by,
    row_number() over (
      partition by floor(s.nx / 0.075)::bigint, floor(s.ny / 0.075)::bigint
      order by
        s.pipeline_rank asc,
        s.base_score_raw desc,
        s.water_frac_overlay desc,
        s.turn_deg desc,
        s.part_area_rank asc,
        s.ring_kind asc,
        s.ring_idx asc,
        s.samp_idx asc,
        s.radius_mult asc
    ) as rn_bin
  from scored_pool s
),
nms_pick as (
  select *
  from nms_pre
  where rn_bin = 1
  order by
    pipeline_rank asc,
    base_score_raw desc,
    water_frac_overlay desc,
    turn_deg desc,
    part_area_rank asc,
    ring_kind asc,
    ring_idx asc,
    samp_idx asc,
    radius_mult asc
  limit (select zone_limit from params)
),
final_rows as (
  select
    row_number() over (
      order by
        n.pipeline_rank asc,
        n.base_score_raw desc,
        n.water_frac_overlay desc,
        n.turn_deg desc,
        n.part_area_rank asc,
        n.ring_kind asc,
        n.ring_idx asc,
        n.samp_idx asc,
        n.radius_mult asc
    )::integer as cand_id,
    n.*
  from nms_pick n
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
    f.feature_tag,
    'geometry_candidate'::text as candidate_source,
    f.reason_code,
    ST_X(f.anchor_geom)::double precision as anchor_lon,
    ST_Y(f.anchor_geom)::double precision as anchor_lat,
    greatest(0::double precision, least(1::double precision, f.nx)) as normalized_anchor_x,
    greatest(0::double precision, least(1::double precision, f.ny)) as normalized_anchor_y,
    greatest(0::double precision, least(1::double precision, ((ST_XMin(f.overlay3857) - f.ctx_min_mx) / f.denom_x)::double precision)) as overlay_x,
    greatest(0::double precision, least(1::double precision, ((f.ctx_max_my - ST_YMax(f.overlay3857)) / f.denom_y)::double precision)) as overlay_y,
    greatest(0::double precision, least(1::double precision, ((ST_XMax(f.overlay3857) - ST_XMin(f.overlay3857)) / f.denom_x)::double precision)) as overlay_w,
    greatest(0::double precision, least(1::double precision, ((ST_YMax(f.overlay3857) - ST_YMin(f.overlay3857)) / f.denom_y)::double precision)) as overlay_h,
    least(1::double precision, greatest(0::double precision, f.base_score_raw)) as base_score,
    jsonb_build_object(
      'geometry_valid', f.geom_was_valid,
      'make_valid_applied', not f.geom_was_valid,
      'detector', 'shoreline_blended_candidate_v2',
      'candidate_pipeline', f.candidate_pipeline,
      'multipolygon_component_count', ST_NumGeometries(f.lake_geom_all),
      'bbox_fallback', false,
      'part_idx', f.part_idx,
      'part_area_rank', f.part_area_rank,
      'ring_kind', f.ring_kind,
      'ring_idx', f.ring_idx,
      'shoreline_turn_deg_sample', round(coalesce(f.turn_deg, 0)::numeric, 4),
      'sinuosity_proxy', round(coalesce(f.sinuosity_proxy, 0)::numeric, 4),
      'overlay_water_fraction', round(coalesce(f.water_frac_overlay, 0)::numeric, 4),
      'shore_distance_m', round(coalesce(f.dist_shore_m, 0)::numeric, 2),
      'local_patch_area_m2', round(coalesce(f.local_patch_area_m2, 0)::numeric, 2),
      'patch_radius_m', round(coalesce(f.patch_radius_m, 0)::numeric, 2)
    ) as geometry_qa
  from final_rows f
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
  'Blended shoreline geometry candidates: boundary turn/curvature samples plus QA-passing shoreline coverage supplements. Geometry-only; no imagery/depth/fish/access claims. Signature/output unchanged.';

select pg_notify('pgrst', 'reload schema');
