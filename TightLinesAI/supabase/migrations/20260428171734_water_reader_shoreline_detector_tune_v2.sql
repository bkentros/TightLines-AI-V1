-- Tune shoreline-sampled geometry candidates (v2): smaller polygons eligible, denser sampling,
-- modest QA relaxation + fallback pipeline for valid small lakes that yield zero primary candidates.
-- Adds opaque geometry_qa keys: shore_distance_m, candidate_pipeline (primary vs fallback_even_spacing_v1).
-- RPC signature/output columns unchanged.

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
    ST_IsValid(w.geometry) as geom_was_valid,
    e.aerial_ok
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
lake_parts as (
  select
    c.*,
    (ST_Dump(c.geom)).geom as poly_geom,
    (ST_Dump(c.geom)).path[1] as part_idx
  from context_padded c
),
filtered_parts as (
  select
    *,
    ST_Area(poly_geom::geography) as poly_area_m2,
    ST_Length(ST_Boundary(poly_geom)::geography) as ring_len_m
  from lake_parts
  where ST_GeometryType(poly_geom) = 'ST_Polygon'
    and ST_Area(poly_geom::geography) >= 1200::double precision
),
rings as (
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
    poly_geom,
    poly_area_m2,
    ST_LineMerge(ST_ExteriorRing(poly_geom)) as ring_line,
    greatest(
      36,
      least(
        168,
        ceil(ST_Length(ST_Boundary(poly_geom)::geography) / 26.0)::integer
      )
    )::integer as n_samples
  from filtered_parts
  where ST_Length(ST_Boundary(poly_geom)::geography) >= 80::double precision
),
samples as (
  select
    r.*,
    gs.i as samp_idx,
    ST_LineInterpolatePoint(
      r.ring_line,
      greatest(1e-9, least(1.0 - 1e-9, gs.i::double precision / nullif(r.n_samples + 1, 0)::double precision))
    )::geometry(point, 4326) as pt_ring,
    ST_PointOnSurface(r.poly_geom)::geometry(point, 4326) as centroid_pt
  from rings r
  cross join lateral generate_series(1, r.n_samples) as gs(i)
),
samples_turn as (
  select
    s.*,
    lag(s.pt_ring, 1) over (partition by s.part_idx order by s.samp_idx) as pt_prev,
    lead(s.pt_ring, 1) over (partition by s.part_idx order by s.samp_idx) as pt_next,
    count(*) over (partition by s.part_idx) as cnt_ring
  from samples s
),
samples_closed as (
  select
    s.*,
    coalesce(s.pt_prev, (select st.pt_ring from samples_turn st where st.part_idx = s.part_idx order by st.samp_idx desc limit 1)) as pt_prev_cl,
    coalesce(s.pt_next, (select st.pt_ring from samples_turn st where st.part_idx = s.part_idx order by st.samp_idx asc limit 1)) as pt_next_cl
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
    ST_LineInterpolatePoint(
      ST_MakeLine(sc.pt_ring, sc.centroid_pt),
      0.14::double precision
    )::geometry(point, 4326) as anchor_candidate
  from samples_closed sc
),
anchors_filtered as (
  select
    t.*,
    case
      when ST_Contains(t.poly_geom, t.anchor_candidate) then t.anchor_candidate
      else ST_ClosestPoint(t.poly_geom, t.pt_ring)::geometry(point, 4326)
    end as anchor_geom
  from turn_scores t
  where coalesce(t.turn_deg, 0::double precision)
    >= case
         when t.poly_area_m2 < 50000::double precision then 8::double precision
         else 12::double precision
       end
),
fb_anchors as (
  select
    t.*,
    case
      when ST_Contains(t.poly_geom, t.anchor_candidate) then t.anchor_candidate
      else ST_ClosestPoint(t.poly_geom, t.pt_ring)::geometry(point, 4326)
    end as anchor_geom
  from turn_scores t
),
ctx_env as (
  select
    c.lake_row_id,
    c.ctx_min_lon,
    c.ctx_min_lat,
    c.ctx_max_lon,
    c.ctx_max_lat,
    ST_Transform(ST_MakeEnvelope(c.ctx_min_lon, c.ctx_min_lat, c.ctx_max_lon, c.ctx_max_lat, 4326), 3857) as context_env3857,
    c.geom_was_valid,
    c.geom_orig,
    c.lake_geom_all,
    c.canonical_name,
    c.state_code,
    c.county_name,
    c.wb_type,
    c.poly_area_m2,
    c.part_idx,
    c.samp_idx,
    c.turn_deg,
    c.anchor_geom,
    c.poly_geom,
    jsonb_build_object(
      'geometry_valid', c.geom_was_valid,
      'make_valid_applied', not c.geom_was_valid,
      'detector', 'shoreline_angle_sample_v1',
      'multipolygon_component_count', ST_NumGeometries(c.lake_geom_all),
      'bbox_fallback', false
    ) as qa_base
  from anchors_filtered c
),
fb_ctx_env as (
  select
    c.lake_row_id,
    c.ctx_min_lon,
    c.ctx_min_lat,
    c.ctx_max_lon,
    c.ctx_max_lat,
    ST_Transform(ST_MakeEnvelope(c.ctx_min_lon, c.ctx_min_lat, c.ctx_max_lon, c.ctx_max_lat, 4326), 3857) as context_env3857,
    c.geom_was_valid,
    c.geom_orig,
    c.lake_geom_all,
    c.canonical_name,
    c.state_code,
    c.county_name,
    c.wb_type,
    c.poly_area_m2,
    c.part_idx,
    c.samp_idx,
    c.turn_deg,
    c.anchor_geom,
    c.poly_geom,
    jsonb_build_object(
      'geometry_valid', c.geom_was_valid,
      'make_valid_applied', not c.geom_was_valid,
      'detector', 'shoreline_fallback_even_v1',
      'multipolygon_component_count', ST_NumGeometries(c.lake_geom_all),
      'bbox_fallback', false
    ) as qa_base
  from fb_anchors c
),
merc_ready as (
  select
    e.*,
    greatest(1e-12, ST_XMax(e.context_env3857) - ST_XMin(e.context_env3857)) as denom_x,
    greatest(1e-12, ST_YMax(e.context_env3857) - ST_YMin(e.context_env3857)) as denom_y,
    ST_XMin(e.context_env3857) as ctx_min_mx,
    ST_XMax(e.context_env3857) as ctx_max_mx,
    ST_YMin(e.context_env3857) as ctx_min_my,
    ST_YMax(e.context_env3857) as ctx_max_my,
    ST_Transform(e.anchor_geom, 3857) as anchor3857,
    ST_X(ST_Transform(e.anchor_geom, 3857)) as anchor_mx,
    ST_Y(ST_Transform(e.anchor_geom, 3857)) as anchor_my
  from ctx_env e
),
fb_merc_ready as (
  select
    e.*,
    greatest(1e-12, ST_XMax(e.context_env3857) - ST_XMin(e.context_env3857)) as denom_x,
    greatest(1e-12, ST_YMax(e.context_env3857) - ST_YMin(e.context_env3857)) as denom_y,
    ST_XMin(e.context_env3857) as ctx_min_mx,
    ST_XMax(e.context_env3857) as ctx_max_mx,
    ST_YMin(e.context_env3857) as ctx_min_my,
    ST_YMax(e.context_env3857) as ctx_max_my,
    ST_Transform(e.anchor_geom, 3857) as anchor3857,
    ST_X(ST_Transform(e.anchor_geom, 3857)) as anchor_mx,
    ST_Y(ST_Transform(e.anchor_geom, 3857)) as anchor_my
  from fb_ctx_env e
),
norm_xy as (
  select
    m.*,
    ((ST_X(m.anchor3857) - m.ctx_min_mx) / m.denom_x)::double precision as nx,
    ((m.ctx_max_my - ST_Y(m.anchor3857)) / m.denom_y)::double precision as ny
  from merc_ready m
),
fb_norm_xy as (
  select
    m.*,
    ((ST_X(m.anchor3857) - m.ctx_min_mx) / m.denom_x)::double precision as nx,
    ((m.ctx_max_my - ST_Y(m.anchor3857)) / m.denom_y)::double precision as ny
  from fb_merc_ready m
),
overlay_rect as (
  select
    n.*,
    greatest(0.08::double precision, least(0.12::double precision, 0.09::double precision)) as ov_frac,
    ST_MakeEnvelope(
      ST_X(n.anchor3857) - (n.denom_x * 0.045),
      ST_Y(n.anchor3857) - (n.denom_y * 0.045),
      ST_X(n.anchor3857) + (n.denom_x * 0.045),
      ST_Y(n.anchor3857) + (n.denom_y * 0.045),
      3857
    ) as overlay3857
  from norm_xy n
),
fb_overlay_rect as (
  select
    n.*,
    greatest(0.08::double precision, least(0.12::double precision, 0.09::double precision)) as ov_frac,
    ST_MakeEnvelope(
      ST_X(n.anchor3857) - (n.denom_x * 0.045),
      ST_Y(n.anchor3857) - (n.denom_y * 0.045),
      ST_X(n.anchor3857) + (n.denom_x * 0.045),
      ST_Y(n.anchor3857) + (n.denom_y * 0.045),
      3857
    ) as overlay3857
  from fb_norm_xy n
),
water_cut as (
  select
    o.*,
    (
      ST_Area(ST_Intersection(ST_Transform(o.overlay3857, 4326), o.poly_geom)::geography)
      / greatest(ST_Area(ST_Transform(o.overlay3857, 4326)::geography), 1e-9)
    )::double precision as water_frac_overlay,
    ST_Distance(o.anchor_geom::geography, ST_Boundary(o.poly_geom)::geography) as dist_shore_m
  from overlay_rect o
),
fb_water_cut as (
  select
    o.*,
    (
      ST_Area(ST_Intersection(ST_Transform(o.overlay3857, 4326), o.poly_geom)::geography)
      / greatest(ST_Area(ST_Transform(o.overlay3857, 4326)::geography), 1e-9)
    )::double precision as water_frac_overlay,
    ST_Distance(o.anchor_geom::geography, ST_Boundary(o.poly_geom)::geography) as dist_shore_m
  from fb_overlay_rect o
),
scored as (
  select
    w.*,
    least(
      1::double precision,
      greatest(
        0::double precision,
        0.18::double precision
        + least(coalesce(w.turn_deg, 0::double precision) / 120::double precision, 1::double precision) * 0.52::double precision
        + least(coalesce(w.water_frac_overlay, 0::double precision), 1::double precision) * 0.28::double precision
      )
    ) as base_score_raw,
    case
      when coalesce(w.turn_deg, 0::double precision)
        >= case
             when w.poly_area_m2 < 50000::double precision then 28::double precision
             else 35::double precision
           end
        then 'shoreline_complexity'::text
      else 'coverage_distribution'::text
    end as feature_tag,
    case
      when coalesce(w.turn_deg, 0::double precision)
        >= case
             when w.poly_area_m2 < 50000::double precision then 28::double precision
             else 35::double precision
           end
        then 'shoreline_area_geometry_context'::text
      else 'map_region_callout'::text
    end as reason_code
  from water_cut w
  where ST_Contains(w.poly_geom, w.anchor_geom)
    and coalesce(w.dist_shore_m, 999999::double precision)
      <= case
           when w.poly_area_m2 < 50000::double precision then 245::double precision
           else 235::double precision
         end
    and coalesce(w.water_frac_overlay, 0::double precision) >= 0.19::double precision
),
fb_scored as (
  select
    w.*,
    least(
      0.38::double precision,
      greatest(
        0::double precision,
        0.15::double precision
        + least(coalesce(w.turn_deg, 0::double precision) / 160::double precision, 1::double precision) * 0.15::double precision
        + least(coalesce(w.water_frac_overlay, 0::double precision), 1::double precision) * 0.23::double precision
      )
    ) as base_score_raw,
    'coverage_distribution'::text as feature_tag,
    'map_region_callout'::text as reason_code
  from fb_water_cut w
  where ST_Contains(w.poly_geom, w.anchor_geom)
    and coalesce(w.dist_shore_m, 999999::double precision)
      <= case
           when w.poly_area_m2 < 50000::double precision then 245::double precision
           else 235::double precision
         end
    and coalesce(w.water_frac_overlay, 0::double precision) >= 0.19::double precision
),
ranked_all as (
  select
    s.*,
    row_number() over (
      order by
        coalesce(s.turn_deg, 0::double precision) desc,
        coalesce(s.base_score_raw, 0::double precision) desc,
        s.part_idx asc,
        s.samp_idx asc
    ) as rk
  from scored s
),
fb_ranked_all as (
  select
    s.*,
    row_number() over (
      order by
        coalesce(s.water_frac_overlay, 0::double precision) desc,
        coalesce(s.turn_deg, 0::double precision) desc,
        coalesce(s.base_score_raw, 0::double precision) desc,
        s.part_idx asc,
        s.samp_idx asc
    ) as rk
  from fb_scored s
),
nms_bins as (
  select
    r.*,
    floor(r.nx / 0.085)::bigint as bx,
    floor(r.ny / 0.085)::bigint as by,
    row_number() over (
      partition by floor(r.nx / 0.085)::bigint, floor(r.ny / 0.085)::bigint
      order by coalesce(r.turn_deg, 0::double precision) desc, r.part_idx asc, r.samp_idx asc
    ) as rn_bin
  from ranked_all r
),
fb_nms_bins as (
  select
    r.*,
    floor(r.nx / 0.085)::bigint as bx,
    floor(r.ny / 0.085)::bigint as by,
    row_number() over (
      partition by floor(r.nx / 0.085)::bigint, floor(r.ny / 0.085)::bigint
      order by coalesce(r.water_frac_overlay, 0::double precision) desc, coalesce(r.turn_deg, 0::double precision) desc, r.part_idx asc, r.samp_idx asc
    ) as rn_bin
  from fb_ranked_all r
),
nms_pick as (
  select *
  from nms_bins
  where rn_bin = 1
  order by coalesce(turn_deg, 0::double precision) desc, base_score_raw desc, part_idx asc, samp_idx asc
  limit (select zone_limit from params)
),
fb_nms_pick as (
  select *
  from fb_nms_bins
  where rn_bin = 1
  order by water_frac_overlay desc, base_score_raw desc, part_idx asc, samp_idx asc
  limit (select zone_limit from params)
),
primary_final_rows as (
  select
    row_number() over (
      order by coalesce(n.turn_deg, 0::double precision) desc, n.base_score_raw desc, n.part_idx asc, n.samp_idx asc
    )::integer as cand_id,
    n.lake_row_id,
    n.canonical_name,
    n.state_code,
    n.county_name,
    n.wb_type,
    n.ctx_min_lon,
    n.ctx_min_lat,
    n.ctx_max_lon,
    n.ctx_max_lat,
    n.anchor_geom,
    n.ctx_min_mx,
    n.ctx_max_mx,
    n.ctx_min_my,
    n.ctx_max_my,
    n.denom_x,
    n.denom_y,
    n.overlay3857,
    n.poly_geom,
    n.qa_base,
    n.feature_tag,
    n.reason_code,
    n.base_score_raw,
    n.turn_deg,
    n.water_frac_overlay,
    n.dist_shore_m,
    false::boolean as is_fallback
  from nms_pick n
),
fallback_final_rows as (
  select
    row_number() over (
      order by coalesce(n.water_frac_overlay, 0::double precision) desc, coalesce(n.turn_deg, 0::double precision) desc, n.base_score_raw desc, n.part_idx asc, n.samp_idx asc
    )::integer as cand_id,
    n.lake_row_id,
    n.canonical_name,
    n.state_code,
    n.county_name,
    n.wb_type,
    n.ctx_min_lon,
    n.ctx_min_lat,
    n.ctx_max_lon,
    n.ctx_max_lat,
    n.anchor_geom,
    n.ctx_min_mx,
    n.ctx_max_mx,
    n.ctx_min_my,
    n.ctx_max_my,
    n.denom_x,
    n.denom_y,
    n.overlay3857,
    n.poly_geom,
    n.qa_base,
    n.feature_tag,
    n.reason_code,
    n.base_score_raw,
    n.turn_deg,
    n.water_frac_overlay,
    n.dist_shore_m,
    true::boolean as is_fallback
  from fb_nms_pick n
),
eligible_fallback as (
  select ff.*
  from fallback_final_rows ff
  where (select count(*)::bigint from primary_final_rows) = 0
    and (select ST_Area(t.geom::geography)::double precision from target t limit 1) < 10000000::double precision
),
combined_final_rows as (
  select * from primary_final_rows
  union all
  select * from eligible_fallback
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
    greatest(0::double precision, least(1::double precision, ((ST_X(ST_Transform(f.anchor_geom, 3857)) - f.ctx_min_mx) / f.denom_x)::double precision)) as normalized_anchor_x,
    greatest(0::double precision, least(1::double precision, ((f.ctx_max_my - ST_Y(ST_Transform(f.anchor_geom, 3857))) / f.denom_y)::double precision)) as normalized_anchor_y,
    greatest(0::double precision, least(1::double precision, ((ST_XMin(f.overlay3857) - f.ctx_min_mx) / f.denom_x)::double precision)) as overlay_x,
    greatest(0::double precision, least(1::double precision, ((f.ctx_max_my - ST_YMax(f.overlay3857)) / f.denom_y)::double precision)) as overlay_y,
    greatest(0::double precision, least(1::double precision, ((ST_XMax(f.overlay3857) - ST_XMin(f.overlay3857)) / f.denom_x)::double precision)) as overlay_w,
    greatest(0::double precision, least(1::double precision, ((ST_YMax(f.overlay3857) - ST_YMin(f.overlay3857)) / f.denom_y)::double precision)) as overlay_h,
    least(1::double precision, greatest(0::double precision, f.base_score_raw)) as base_score,
    case
      when f.is_fallback then
        f.qa_base || jsonb_build_object(
          'shoreline_turn_deg_sample', round(f.turn_deg::numeric, 4),
          'overlay_water_fraction', round(coalesce(f.water_frac_overlay, 0)::numeric, 4),
          'shore_distance_m', round(coalesce(f.dist_shore_m, 0)::numeric, 2),
          'candidate_pipeline', 'fallback_even_spacing_v1'::text
        )
      else
        f.qa_base || jsonb_build_object(
          'shoreline_turn_deg_sample', round(f.turn_deg::numeric, 4),
          'overlay_water_fraction', round(coalesce(f.water_frac_overlay, 0)::numeric, 4),
          'shore_distance_m', round(coalesce(f.dist_shore_m, 0)::numeric, 2),
          'candidate_pipeline', 'primary_shoreline_v1'::text
        )
    end as geometry_qa
  from combined_final_rows f
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
  'Shoreline-sampled geometry anchors from polygon boundaries (turn-angle heuristic); tuned small-lake sampling + conservative fallback when primary yields none; opaque geometry_qa adds shore_distance_m and candidate_pipeline; Args unchanged.';

select pg_notify('pgrst', 'reload schema');
