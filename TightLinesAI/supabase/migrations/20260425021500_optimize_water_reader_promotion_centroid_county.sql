-- Optimize Water Reader national 3DHP promotion.
--
-- The original county attribution ranked candidate counties by polygon
-- intersection area. At national scale, that forces expensive geometry
-- intersections during promotion. The ingest model is centroid-to-county
-- attribution, so keep the same centroid intersect join and use a stable,
-- cheap county metadata tie-breaker when a centroid touches multiple counties.

create or replace function water_reader_private.promote_usgs_3dhp_waterbodies(
  target_ingest_run_id uuid,
  min_area_sqkm numeric default 0
)
returns table (
  staged_count integer,
  promoted_count integer,
  alias_count integer,
  skipped_missing_name_count integer,
  skipped_missing_county_count integer
)
language plpgsql
as $$
declare
  v_staged_count integer := 0;
  v_promoted_count integer := 0;
  v_alias_count integer := 0;
  v_skipped_missing_name_count integer := 0;
  v_skipped_missing_county_count integer := 0;
begin
  select count(*)
  into v_staged_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id;

  select count(*)
  into v_skipped_missing_name_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id
    and s.featuretype = 3
    and coalesce(nullif(trim(s.gnisidlabel), ''), '') = '';

  with named_standing_water as (
    select
      s.*,
      nullif(trim(s.gnisidlabel), '') as canonical_name,
      s.areasqkm * 247.10538146717 as surface_area_acres
    from water_reader_private.usgs_3dhp_waterbody_stage s
    where s.ingest_run_id = target_ingest_run_id
      and s.featuretype = 3
      and nullif(trim(s.gnisidlabel), '') is not null
      and coalesce(s.areasqkm, 0) >= min_area_sqkm
  ),
  county_ranked as (
    select
      n.*,
      c.state_code,
      c.county_name,
      row_number() over (
        partition by n.ingest_run_id, n.id3dhp
        order by c.state_code, c.county_name, c.geoid
      ) as rn
    from named_standing_water n
    join water_reader_private.us_county_boundaries c
      on ST_Intersects(n.source_centroid, c.geom)
  ),
  candidates as (
    select *
    from county_ranked
    where rn = 1
  ),
  upserted as (
    insert into public.waterbody_index (
      external_source,
      external_id,
      canonical_name,
      state_code,
      county_name,
      waterbody_type,
      is_named,
      is_searchable,
      region_key,
      centroid,
      geometry,
      surface_area_acres,
      search_priority,
      source_summary
    )
    select
      'usgs_3dhp_waterbody',
      '3dhp:' || c.id3dhp,
      c.canonical_name,
      c.state_code,
      c.county_name,
      water_reader_private.classify_standing_waterbody(c.canonical_name),
      true,
      true,
      water_reader_private.region_key_for_state(c.state_code),
      c.source_centroid,
      c.source_geometry,
      c.surface_area_acres,
      water_reader_private.search_priority_for_area(c.surface_area_acres),
      jsonb_build_object(
        'source', 'USGS 3D Hydrography Program 3DHP_all Waterbody',
        'source_key', 'usgs_3dhp',
        'source_layer_url', 'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60',
        'featuretype', c.featuretype,
        'featuretypelabel', coalesce(c.featuretypelabel, 'Lake'),
        'id3dhp', c.id3dhp,
        'id3dhp_persistent', false,
        'gnisid', c.gnisid,
        'workunitid', c.source_properties ->> 'workunitid',
        'ingest_run_id', target_ingest_run_id,
        'standing_water_only', true
      )
    from candidates c
    on conflict (external_source, external_id) do update
    set
      canonical_name = excluded.canonical_name,
      state_code = excluded.state_code,
      county_name = excluded.county_name,
      waterbody_type = excluded.waterbody_type,
      is_named = excluded.is_named,
      is_searchable = excluded.is_searchable,
      region_key = excluded.region_key,
      centroid = excluded.centroid,
      geometry = excluded.geometry,
      surface_area_acres = excluded.surface_area_acres,
      search_priority = excluded.search_priority,
      source_summary = excluded.source_summary,
      updated_at = timezone('utc', now())
    returning id
  )
  select count(*)
  into v_promoted_count
  from upserted;

  select count(*)
  into v_skipped_missing_county_count
  from water_reader_private.usgs_3dhp_waterbody_stage s
  where s.ingest_run_id = target_ingest_run_id
    and s.featuretype = 3
    and nullif(trim(s.gnisidlabel), '') is not null
    and coalesce(s.areasqkm, 0) >= min_area_sqkm
    and not exists (
      select 1
      from water_reader_private.us_county_boundaries c
      where ST_Intersects(s.source_centroid, c.geom)
    );

  with alias_candidates as (
    select
      w.id as waterbody_id,
      a.alias_name
    from water_reader_private.gnis_alias_stage a
    join water_reader_private.usgs_3dhp_waterbody_stage s
      on s.ingest_run_id = a.ingest_run_id
      and s.gnisid = a.gnisid
    join public.waterbody_index w
      on w.external_source = 'usgs_3dhp_waterbody'
      and w.external_id = '3dhp:' || s.id3dhp
    where a.ingest_run_id = target_ingest_run_id
      and public.normalize_waterbody_name(a.alias_name) <> public.normalize_waterbody_name(w.canonical_name)
  ),
  inserted_aliases as (
    insert into public.waterbody_aliases (waterbody_id, alias_name, alias_source)
    select distinct
      waterbody_id,
      alias_name,
      'gnis_all_names'
    from alias_candidates
    on conflict (waterbody_id, normalized_alias_name) do nothing
    returning id
  )
  select count(*)
  into v_alias_count
  from inserted_aliases;

  update water_reader_private.waterbody_ingest_runs
  set
    status = 'promoted',
    staged_waterbody_count = v_staged_count,
    promoted_waterbody_count = v_promoted_count,
    alias_count = v_alias_count,
    completed_at = timezone('utc', now()),
    metadata = metadata || jsonb_build_object(
      'skipped_missing_name_count', v_skipped_missing_name_count,
      'skipped_missing_county_count', v_skipped_missing_county_count,
      'min_area_sqkm', min_area_sqkm
    )
  where id = target_ingest_run_id;

  return query select
    v_staged_count,
    v_promoted_count,
    v_alias_count,
    v_skipped_missing_name_count,
    v_skipped_missing_county_count;
end;
$$;
