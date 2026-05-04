-- Water Reader: runtime-safe polygon payload for on-demand read generation.
-- Support labels and QA flags are computed from the original stored polygon.
-- High-complexity valid polygons may return a topology-preserving simplified
-- GeoJSON for runtime generation only, with diagnostics exposed to callers.

create or replace function public.get_waterbody_polygon_runtime_for_reader(in_lake_id uuid)
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
  polygon_qa_flags text[],
  original_vertex_count integer,
  runtime_vertex_count integer,
  runtime_component_count integer,
  runtime_interior_ring_count integer,
  runtime_simplified boolean,
  runtime_simplification_tolerance double precision
)
language plpgsql
stable
security definer
set search_path = public
set statement_timeout = '30s'
as $$
declare
  wb record;
  g geometry;
  runtime_g geometry;
  candidate_g geometry;
  env geometry;
  vdetail text;
  sqm double precision;
  acres double precision;
  per_m double precision;
  min_lon double precision;
  min_lat double precision;
  max_lon double precision;
  max_lat double precision;
  policy record;
  original_pts integer := 0;
  runtime_pts integer := 0;
  runtime_components integer := 0;
  runtime_rings integer := 0;
  tolerance double precision := 0.0;
  simplified boolean := false;
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
  select *
  into policy
  from public.water_reader_polygon_support_policy(wb.waterbody_type, g);

  if g is null or ST_IsEmpty(g) or not coalesce(policy.geom_valid, false) then
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
        when g is null or ST_IsEmpty(g) then 'Empty or null geometry.'
        else ST_IsValidReason(g)
      end,
      0,
      0,
      coalesce(policy.water_reader_support_status, 'not_supported')::text,
      coalesce(policy.water_reader_support_reason, 'No usable polygon geometry.')::text,
      coalesce(policy.polygon_qa_flags, array[]::text[]),
      0,
      0,
      0,
      0,
      false,
      0.0::double precision;
    return;
  end if;

  original_pts := coalesce(policy.poly_pts, ST_NPoints(g));
  runtime_g := g;

  if original_pts > 50000 then
    tolerance := 0.00015;
  elsif original_pts > 25000 then
    tolerance := 0.00008;
  end if;

  if tolerance > 0 then
    candidate_g := ST_SimplifyPreserveTopology(g, tolerance);
    if candidate_g is not null
      and not ST_IsEmpty(candidate_g)
      and ST_IsValid(candidate_g)
      and ST_NPoints(candidate_g) < original_pts
    then
      runtime_g := candidate_g;
      simplified := true;
    else
      tolerance := 0.0;
    end if;
  end if;

  sqm := ST_Area(g::geography);
  acres := sqm / 4046.8564224;
  per_m := ST_Perimeter(g::geography);
  env := ST_Envelope(g);
  min_lon := ST_XMin(env);
  min_lat := ST_YMin(env);
  max_lon := ST_XMax(env);
  max_lat := ST_YMax(env);
  vdetail := 'Valid Geometry';
  runtime_pts := ST_NPoints(runtime_g);
  runtime_components := ST_NumGeometries(runtime_g);
  select coalesce(sum(ST_NumInteriorRings(t.geom)), 0)::integer
  into runtime_rings
  from (
    select (ST_Dump(runtime_g)).geom as geom
  ) as t;

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
    acres,
    per_m,
    case
      when policy.water_reader_support_status = 'not_supported' then null::jsonb
      else ST_AsGeoJSON(runtime_g)::jsonb
    end,
    wb.external_source,
    wb.external_id,
    wb.source_summary,
    true,
    vdetail,
    policy.poly_components,
    policy.poly_rings,
    policy.water_reader_support_status,
    policy.water_reader_support_reason,
    policy.polygon_qa_flags,
    original_pts,
    runtime_pts,
    runtime_components,
    runtime_rings,
    simplified,
    tolerance;
end;
$$;
