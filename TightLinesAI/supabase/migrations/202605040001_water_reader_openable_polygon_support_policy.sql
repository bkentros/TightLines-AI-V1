-- Water Reader: Brandon openable-polygon support policy.
-- `not_supported` means Water Reader cannot pull/use a valid lake polygon.
-- Valid lake/pond/reservoir polygons remain openable as supported/limited;
-- caution is carried by limited status plus QA flags.

create or replace function public.water_reader_polygon_support_policy(
  in_waterbody_type text,
  in_geometry geometry
)
returns table (
  type_ok boolean,
  has_geom_raw boolean,
  geom_valid boolean,
  poly_acres double precision,
  poly_components integer,
  poly_pts integer,
  poly_rings integer,
  has_polygon_geometry boolean,
  water_reader_support_status text,
  water_reader_support_reason text,
  polygon_qa_flags text[]
)
language sql
stable
as $$
  with v1poly as (
    select
      (in_waterbody_type in ('lake', 'pond', 'reservoir')) as type_ok,
      (in_geometry is not null and not ST_IsEmpty(in_geometry)) as has_geom_raw,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then false
        else coalesce(ST_IsValid(in_geometry), false)
      end as geom_valid,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then null::double precision
        when not ST_IsValid(in_geometry) then null::double precision
        else (ST_Area(in_geometry::geography) / 4046.8564224)::double precision
      end as poly_acres,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then 0
        when not ST_IsValid(in_geometry) then 0
        else ST_NumGeometries(in_geometry)
      end as poly_components,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then 0
        when not ST_IsValid(in_geometry) then 0
        else ST_NPoints(in_geometry)
      end as poly_pts,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) or not ST_IsValid(in_geometry) then 0
        else (
          select coalesce(sum(ST_NumInteriorRings(t.geom)), 0)::integer
          from (
            select (ST_Dump(in_geometry)).geom as geom
          ) as t
        )
      end as poly_rings
  ),
  v1flags as (
    select
      vp.*,
      array_remove(array[
        case when not vp.type_ok then 'wrong_waterbody_type' end,
        case when not vp.has_geom_raw then 'no_geometry' end,
        case when vp.has_geom_raw and not vp.geom_valid then 'invalid_geometry' end,
        case when vp.poly_acres is not null and vp.poly_acres < 0.5 then 'below_minimum_area' end,
        case when vp.poly_components > 1 then 'multipart_geometry' end,
        case when vp.poly_rings > 0 then 'has_interior_rings' end,
        case when vp.poly_acres is not null and vp.poly_acres >= 0.5 and vp.poly_acres < 20 then 'small_waterbody' end,
        case when vp.poly_pts > 25000 then 'high_vertex_count' end
      ], null) as polygon_qa_flags
    from v1poly vp
  )
  select
    vf.type_ok,
    vf.has_geom_raw,
    vf.geom_valid,
    vf.poly_acres,
    vf.poly_components,
    vf.poly_pts,
    vf.poly_rings,
    (vf.type_ok and vf.has_geom_raw and vf.geom_valid) as has_polygon_geometry,
    case
      when not vf.type_ok then 'not_supported'
      when not vf.has_geom_raw or not vf.geom_valid then 'not_supported'
      when vf.poly_acres is not null and vf.poly_acres < 20 then 'limited'
      when vf.poly_components > 1 or vf.poly_pts > 25000 then 'limited'
      else 'supported'
    end as water_reader_support_status,
    case
      when not vf.type_ok then 'Water Reader V1 only includes lakes, ponds, and reservoirs.'
      when not vf.has_geom_raw then 'No stored polygon for this waterbody.'
      when not vf.geom_valid then 'Stored polygon failed validity checks.'
      when vf.poly_acres is not null and vf.poly_acres < 0.5 then 'Very small waterbody; Water Reader can open the polygon with limited-read caution.'
      when vf.poly_components > 1 then 'Multipart polygon; Water Reader can open the primary geometry with limited-read caution.'
      when vf.poly_pts > 25000 then 'High-complexity polygon; Water Reader can open it with limited-read caution.'
      when vf.poly_acres is not null and vf.poly_acres < 20 then 'Small waterbody; structure read may be limited.'
      else 'Valid hydrography polygon meets baseline V1 checks.'
    end as water_reader_support_reason,
    vf.polygon_qa_flags
  from v1flags vf;
$$;

create or replace function public.search_waterbodies_enrich_row(
  in_id uuid,
  in_canonical_name text,
  in_state_code text,
  in_county_name text,
  in_waterbody_type text,
  in_surface_area_acres numeric,
  in_centroid geometry,
  in_geometry geometry
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
  with v1status as (
    select *
    from public.water_reader_polygon_support_policy(in_waterbody_type, in_geometry)
  ),
  lm as (
    select
      coalesce(bool_or(l.source_mode = 'aerial' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.usability_status = 'usable'), false) as aerial_from_links,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'machine_readable' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_machine_readable_available,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'chart_image' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_chart_image_available,
      coalesce(bool_or(l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'unvalidated'), false) as has_pending,
      coalesce(bool_or(l.approval_status = 'approved' and (s.review_status <> 'allowed' or s.can_fetch = false or l.fetch_validation_status in ('blocked', 'unreachable') or l.lake_match_status = 'mismatched' or l.usability_status = 'not_usable')), false) as has_blocked_candidate,
      coalesce(bool_or(l.source_mode = 'depth' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and (l.lake_match_status <> 'matched' or l.usability_status <> 'usable')), false) as has_depth_pending_match_or_usability
    from public.waterbody_source_links l
    join public.source_registry s on s.id = l.source_id
    where l.waterbody_id = in_id
  ),
  pm as (
    select exists (
      select 1
      from public.water_reader_aerial_provider_policies p
      join public.source_registry s on s.id = p.source_id
      where p.is_enabled = true
        and p.approval_status = 'approved'
        and s.review_status = 'allowed'
        and s.can_fetch = true
        and s.source_type = 'aerial_imagery'
        and p.provider_health_status = 'reachable'
        and not (coalesce(p.coverage -> 'exclude_state_codes', '[]'::jsonb) @> to_jsonb(in_state_code))
    ) as aerial_from_policy
  ),
  bbox_raw as (
    select
      ST_XMin(env)::double precision as min_lon,
      ST_YMin(env)::double precision as min_lat,
      ST_XMax(env)::double precision as max_lon,
      ST_YMax(env)::double precision as max_lat
    from (
      select ST_Envelope(in_geometry) as env
      where in_geometry is not null and not ST_IsEmpty(in_geometry)
    ) e
  ),
  bbox_padded as (
    select
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
      greatest(-180.0, center_lon - half_lon) as min_lon,
      greatest(-90.0, center_lat - half_lat) as min_lat,
      least(180.0, center_lon + half_lon) as max_lon,
      least(90.0, center_lat + half_lat) as max_lat
    from bbox_padded
  ),
  m as (
    select
      lm.aerial_from_links or pm.aerial_from_policy as aerial_available,
      lm.depth_machine_readable_available,
      lm.depth_chart_image_available,
      lm.has_pending,
      lm.has_blocked_candidate,
      lm.has_depth_pending_match_or_usability
    from lm cross join pm
  )
  select
    in_id as lake_id,
    in_canonical_name as name,
    in_state_code as state,
    in_county_name as county,
    in_waterbody_type as waterbody_type,
    in_surface_area_acres as surface_area_acres,
    ST_Y(in_centroid) as centroid_lat,
    ST_X(in_centroid) as centroid_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lon else null end as preview_bbox_min_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lat else null end as preview_bbox_min_lat,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lon else null end as preview_bbox_max_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lat else null end as preview_bbox_max_lat,
    case
      when m.aerial_available and m.depth_machine_readable_available then 'full_depth_aerial'
      when m.depth_machine_readable_available then 'depth_only'
      when m.depth_chart_image_available then 'chart_aligned_depth'
      when m.aerial_available then 'aerial_only'
      else 'polygon_only'
    end as data_tier,
    m.aerial_available,
    m.depth_machine_readable_available or m.depth_chart_image_available as depth_available,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'usable' when m.has_depth_pending_match_or_usability then 'needs_review' else 'unavailable' end as depth_usability_status,
    case when m.aerial_available and (m.depth_machine_readable_available or m.depth_chart_image_available) then 'both_available' when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth_available' when m.aerial_available then 'aerial_available' when m.has_blocked_candidate then 'blocked' else 'limited' end as availability,
    case when m.aerial_available or m.depth_machine_readable_available or m.depth_chart_image_available then 'ready' when m.has_pending or m.has_depth_pending_match_or_usability then 'partial' when m.has_blocked_candidate then 'blocked' else 'limited' end as source_status,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth' when m.aerial_available then 'aerial' else null end as best_available_mode,
    case when m.depth_machine_readable_available then 'high' when m.aerial_available or m.depth_chart_image_available then 'medium' else 'low' end as confidence,
    vs.water_reader_support_status,
    vs.water_reader_support_reason,
    vs.has_polygon_geometry,
    vs.poly_acres,
    vs.polygon_qa_flags
  from m
  cross join v1status vs
  left join bbox b on true;
$$;

create or replace function public.get_waterbody_polygon_for_reader(in_lake_id uuid)
returns table (
  lake_id uuid,
  name text,
  state text,
  county text,
  waterbody_type text,
  centroid_lat double precision,
  centroid_lon double precision,
  bbox_min_lon double precision,
  bbox_min_lat double precision,
  bbox_max_lon double precision,
  bbox_max_lat double precision,
  area_sq_m double precision,
  area_acres double precision,
  perimeter_m double precision,
  geojson jsonb,
  source_dataset text,
  source_feature_id text,
  source_summary jsonb,
  geometry_is_valid boolean,
  geometry_validity_detail text,
  component_count integer,
  interior_ring_count integer,
  water_reader_support_status text,
  water_reader_support_reason text,
  polygon_qa_flags text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  wb record;
  policy record;
  g geometry;
  ga geography;
  env geometry;
  vdetail text;
  sqm double precision;
  per_m double precision;
  min_lon double precision;
  min_lat double precision;
  max_lon double precision;
  max_lat double precision;
  gj jsonb;
begin
  select
    wi.id,
    wi.canonical_name,
    wi.state_code,
    wi.county_name,
    wi.waterbody_type,
    wi.centroid,
    wi.geometry,
    wi.external_source,
    wi.external_id,
    wi.source_summary
  into wb
  from public.waterbody_index wi
  where wi.id = in_lake_id;

  if not found then
    return;
  end if;

  g := wb.geometry;
  select * into policy
  from public.water_reader_polygon_support_policy(wb.waterbody_type, g);

  if not policy.type_ok or not policy.has_geom_raw or not policy.geom_valid then
    return query select
      wb.id,
      wb.canonical_name,
      wb.state_code,
      wb.county_name,
      wb.waterbody_type,
      ST_Y(wb.centroid)::double precision,
      ST_X(wb.centroid)::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::jsonb,
      wb.external_source,
      wb.external_id,
      wb.source_summary,
      false,
      case
        when not policy.type_ok then 'Unsupported waterbody type for V1.'
        when not policy.has_geom_raw then 'Empty or null geometry.'
        else ST_IsValidReason(g)
      end::text,
      0,
      0,
      policy.water_reader_support_status,
      policy.water_reader_support_reason,
      policy.polygon_qa_flags;
    return;
  end if;

  vdetail := 'Valid Geometry';
  ga := g::geography;
  sqm := ST_Area(ga);
  per_m := ST_Perimeter(ga);
  env := ST_Envelope(g);
  min_lon := ST_XMin(env);
  min_lat := ST_YMin(env);
  max_lon := ST_XMax(env);
  max_lat := ST_YMax(env);
  gj := ST_AsGeoJSON(g)::jsonb;

  return query select
    wb.id,
    wb.canonical_name,
    wb.state_code,
    wb.county_name,
    wb.waterbody_type,
    ST_Y(wb.centroid)::double precision,
    ST_X(wb.centroid)::double precision,
    min_lon,
    min_lat,
    max_lon,
    max_lat,
    sqm,
    policy.poly_acres,
    per_m,
    gj,
    wb.external_source,
    wb.external_id,
    wb.source_summary,
    true,
    vdetail,
    policy.poly_components,
    policy.poly_rings,
    policy.water_reader_support_status,
    policy.water_reader_support_reason,
    policy.polygon_qa_flags;
end;
$$;

comment on function public.water_reader_polygon_support_policy(text, geometry) is
  'Water Reader V1 support policy: only wrong type or missing/invalid geometry is not_supported; valid polygons are supported or limited with QA flags.';

comment on function public.get_waterbody_polygon_for_reader(uuid) is
  'Water Reader V1: GeoJSON polygon + Brandon openable support metadata from waterbody_index (read-only).';

revoke all on function public.get_waterbody_polygon_for_reader(uuid) from public;
grant execute on function public.get_waterbody_polygon_for_reader(uuid) to service_role;

select pg_notify('pgrst', 'reload schema');
