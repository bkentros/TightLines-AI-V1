-- Water Reader V1: read-only polygon payload for a selected waterbody id.
-- Source: public.waterbody_index.geometry (USGS / National Map hydrography family via ingest).
-- Edge Function enforces auth + subscription; RPC is not granted to anon/authenticated.

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
  g geometry;
  ga geography;
  env geometry;
  valid_geom boolean;
  vdetail text;
  comps integer;
  rings integer;
  pts integer;
  acres double precision;
  sqm double precision;
  per_m double precision;
  min_lon double precision;
  min_lat double precision;
  max_lon double precision;
  max_lat double precision;
  flags text[];
  support_status text;
  support_reason text;
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

  flags := array[]::text[];

  if wb.waterbody_type not in ('lake', 'pond', 'reservoir') then
    flags := array_append(flags, 'wrong_waterbody_type');
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
      'Unsupported waterbody type for V1.'::text,
      0,
      0,
      'not_supported'::text,
      'Water Reader V1 only includes lakes, ponds, and reservoirs.'::text,
      flags;
    return;
  end if;

  g := wb.geometry;
  if g is null or ST_IsEmpty(g) then
    flags := array_append(flags, 'no_geometry');
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
      'Empty or null geometry.'::text,
      0,
      0,
      'not_supported'::text,
      'No stored polygon for this waterbody.'::text,
      flags;
    return;
  end if;

  valid_geom := ST_IsValid(g);
  if valid_geom then
    vdetail := 'Valid Geometry';
  else
    vdetail := ST_IsValidReason(g);
  end if;

  if not valid_geom then
    flags := array_append(flags, 'invalid_geometry');
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
      vdetail,
      0,
      0,
      'not_supported'::text,
      'Stored polygon failed validity checks.'::text,
      flags;
    return;
  end if;

  ga := g::geography;
  sqm := ST_Area(ga);
  acres := sqm / 4046.8564224;
  per_m := ST_Perimeter(ga);
  comps := ST_NumGeometries(g);
  select coalesce(sum(ST_NumInteriorRings(t.geom)), 0)::integer into rings
  from (
    select (ST_Dump(g)).geom as geom
  ) as t;
  pts := ST_NPoints(g);

  env := ST_Envelope(g);
  min_lon := ST_XMin(env);
  min_lat := ST_YMin(env);
  max_lon := ST_XMax(env);
  max_lat := ST_YMax(env);

  gj := ST_AsGeoJSON(g)::jsonb;

  if comps > 1 then
    flags := array_append(flags, 'multipart_geometry');
  end if;
  if rings > 0 then
    flags := array_append(flags, 'has_interior_rings');
  end if;
  if acres < 0.5 then
    flags := array_append(flags, 'below_minimum_area');
  elsif acres < 20 then
    flags := array_append(flags, 'small_waterbody');
  end if;
  if pts > 25000 then
    flags := array_append(flags, 'high_vertex_count');
  end if;

  if acres < 0.5 then
    support_status := 'not_supported';
    support_reason := 'Polygon area is below the minimum threshold for Water Reader V1.';
  elsif comps > 1 then
    support_status := 'needs_review';
    support_reason := 'Multi-part polygon may require review before a normal read.';
  elsif pts > 25000 then
    support_status := 'needs_review';
    support_reason := 'Polygon complexity is high; geometry may need review.';
  elsif acres < 20 then
    support_status := 'limited';
    support_reason := 'Small waterbody; structure read may be limited.';
  else
    support_status := 'supported';
    support_reason := 'Valid hydrography polygon meets baseline V1 checks.';
  end if;

  if support_status = 'not_supported' then
    gj := null;
  end if;

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
    gj,
    wb.external_source,
    wb.external_id,
    wb.source_summary,
    true,
    vdetail,
    comps,
    rings,
    support_status,
    support_reason,
    flags;
end;
$$;

comment on function public.get_waterbody_polygon_for_reader(uuid) is
  'Water Reader V1: GeoJSON polygon + conservative support metadata from waterbody_index (read-only).';

revoke all on function public.get_waterbody_polygon_for_reader(uuid) from public;
grant execute on function public.get_waterbody_polygon_for_reader(uuid) to service_role;
