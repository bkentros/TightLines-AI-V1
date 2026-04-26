-- Minnesota DNR bathymetric contours — depth pilot (6 lakes).
-- See docs/water_reader_mn_dnr_depth_pilot_matching_spec.md for matching rules.
-- Superseded for usable contour URLs by 20260425204500_water_reader_mn_dnr_pilot_usable_source_paths.sql
-- (GeoJSON source_path + metadata.fetch_validation_url count probes).

insert into public.waterbody_source_links (
  waterbody_id,
  source_id,
  source_mode,
  depth_source_kind,
  approval_status,
  coverage_status,
  source_path,
  source_path_type,
  fetch_validation_status,
  fetch_validation_method,
  lake_match_status,
  usability_status,
  metadata
)
select
  w.id,
  s.id,
  'depth',
  'machine_readable',
  'approved',
  'available',
  v.source_path,
  'feature_query',
  'unvalidated',
  'head',
  'matched',
  'usable',
  v.metadata::jsonb
from public.source_registry s
cross join (
  values
    (
      'Lake Minnetonka',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2727013300%27%2C%2727013301%27%2C%2727013302%27%2C%2727013303%27%2C%2727013304%27%2C%2727013305%27%2C%2727013306%27%2C%2727013307%27%2C%2727013308%27%2C%2727013309%27%2C%2727013310%27%2C%2727013311%27%2C%2727013312%27%2C%2727013313%27%2C%2727013314%27%2C%2727013315%27)',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["27013300","27013301","27013302","27013303","27013304","27013305","27013306","27013307","27013308","27013309","27013310","27013311","27013312","27013313","27013314","27013315"],"evidence":"DNR lists sixteen Minnetonka basin DOWLKNUM 27013300–27013315; matches single USGS 3DHP Hennepin Lake Minnetonka polygon."}'
    ),
    (
      'Mille Lacs Lake',
      'Mille Lacs',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2748000200%27',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["48000200"],"dnr_lake_names":["Mille Lacs"],"evidence":"Single DOWLKNUM 48000200 for DNR LAKE_NAME Mille Lacs; matches USGS Mille Lacs Lake in Mille Lacs County."}'
    ),
    (
      'Lake Waconia',
      'Carver',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2710005900%27',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["10005900"],"dnr_lake_names":["Waconia"],"evidence":"DOWLKNUM 10005900 DNR LAKE_NAME Waconia; matches USGS Lake Waconia Carver County."}'
    ),
    (
      'Bde Maka Ska',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727003100%27',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["27003100"],"dnr_lake_names":["Bde Maka Ska"],"evidence":"DOWLKNUM 27003100 DNR LAKE_NAME Bde Maka Ska; matches USGS Bde Maka Ska Hennepin."}'
    ),
    (
      'Lake of the Isles',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727004000%27',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["27004000"],"dnr_lake_names":["Lake of the Isles"],"evidence":"DOWLKNUM 27004000 DNR LAKE_NAME Lake of the Isles; matches USGS Lake of the Isles Hennepin."}'
    ),
    (
      'Leech Lake',
      'Cass',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2711020301%27%2C%2711020302%27)',
      '{"pilot":"mn_dnr_depth_2026_04","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["11020301","11020302"],"dnr_lake_names":["Leech (Main Basin)","Leech (Kabekona Bay)"],"evidence":"DNR splits Leech into main and Kabekona basins; both DOWLKNUMs attached to USGS Leech Lake Cass County polygon, excluding Chisago homonym."}'
    )
) as v (canonical_name, county_name, source_path, metadata)
join public.waterbody_index w
  on w.external_source = 'usgs_3dhp_waterbody'
  and w.state_code = 'MN'
  and w.canonical_name = v.canonical_name
  and w.county_name = v.county_name
where s.provider_key = 'mn_dnr_bathymetric_contours'
on conflict (waterbody_id, source_id, source_mode, source_path) do nothing;
