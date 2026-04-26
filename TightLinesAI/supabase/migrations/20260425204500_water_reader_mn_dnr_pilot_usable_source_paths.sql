-- MN DNR pilot: replace count-only source_path with GeoJSON contour fetch URLs (WGS84).
-- Light reachability probes live in metadata.fetch_validation_url; Edge function uses those for HEAD/GET.

update public.waterbody_source_links l
set
  source_path = v.data_url,
  metadata = l.metadata || v.meta_patch,
  fetch_validation_status = 'unvalidated',
  fetch_validation_method = 'head',
  fetch_validation_http_status = null,
  fetch_validation_error = null,
  fetch_validation_checked_at = null,
  source_path_validation_target_url = null,
  updated_at = timezone('utc', now())
from public.waterbody_index w
join (
  values
    (
      'Lake Minnetonka',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%20IN%20(%2727013300%27%2C%2727013301%27%2C%2727013302%27%2C%2727013303%27%2C%2727013304%27%2C%2727013305%27%2C%2727013306%27%2C%2727013307%27%2C%2727013308%27%2C%2727013309%27%2C%2727013310%27%2C%2727013311%27%2C%2727013312%27%2C%2727013313%27%2C%2727013314%27%2C%2727013315%27)',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2727013300%27%2C%2727013301%27%2C%2727013302%27%2C%2727013303%27%2C%2727013304%27%2C%2727013305%27%2C%2727013306%27%2C%2727013307%27%2C%2727013308%27%2C%2727013309%27%2C%2727013310%27%2C%2727013311%27%2C%2727013312%27%2C%2727013313%27%2C%2727013314%27%2C%2727013315%27)","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset","note":"When properties.exceededTransferLimit is true, repeat with resultOffset until false."},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    ),
    (
      'Mille Lacs Lake',
      'Mille Lacs',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2748000200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2748000200%27","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    ),
    (
      'Lake Waconia',
      'Carver',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2710005900%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2710005900%27","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    ),
    (
      'Bde Maka Ska',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2727003100%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727003100%27","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    ),
    (
      'Lake of the Isles',
      'Hennepin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2727004000%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2727004000%27","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    ),
    (
      'Leech Lake',
      'Cass',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%20IN%20(%2711020301%27%2C%2711020302%27)',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%20IN%20(%2711020301%27%2C%2711020302%27)","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":"Registry can_store_* flags remain false; no cached derived features in this pilot."}'::jsonb
    )
) as v (canonical_name, county_name, data_url, meta_patch)
  on w.external_source = 'usgs_3dhp_waterbody'
  and w.state_code = 'MN'
  and w.canonical_name = v.canonical_name
  and w.county_name = v.county_name
where l.waterbody_id = w.id
  and l.metadata->>'pilot' = 'mn_dnr_depth_2026_04';
