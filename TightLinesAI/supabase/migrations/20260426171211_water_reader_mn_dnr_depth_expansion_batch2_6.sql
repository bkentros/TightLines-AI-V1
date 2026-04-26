-- Minnesota DNR bathymetric contours — batch-2 approved six lakes (reviewed proposal only).
-- Explicit waterbody_id from docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json
-- (no name/county join). Mirrors expansion-12: GeoJSON source_path, count-only
-- metadata.fetch_validation_url, on_demand_only, batch metadata.

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
  v.waterbody_id,
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
  v.metadata
from public.source_registry s
cross join (
  values
    (
      '5de66090-5d70-40e9-abb3-a3ee4116ae49'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2716034800%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2716034800%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["16034800"],"dnr_lake_names":["Brule"],"bwca_adjacent_caution":"Single DOWLKNUM; Cook County interior; BWCA-adjacent context — confirm product/legal use before relying on on-demand fetches.","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 16034800; DNR LAKE_NAME Brule."}'::jsonb
    ),
    (
      'ab3a96ea-b9d4-4f71-a394-9da5ef8820b7'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2703019500%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2703019500%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["03019500"],"dnr_lake_names":["Height of Land"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 03019500; distinctive DNR name."}'::jsonb
    ),
    (
      '5bf05147-529b-4fde-ba82-fe87b7e2e0ef'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2703057600%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2703057600%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["03057600"],"dnr_lake_names":["Big Cormorant"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 03057600; DNR Big Cormorant; Becker."}'::jsonb
    ),
    (
      '72df57ba-e259-4e94-aa73-aa95a87524cb'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2761007800%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2761007800%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["61007800"],"dnr_lake_names":["Reno"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 61007800; DNR Reno; Pope."}'::jsonb
    ),
    (
      '55ef075c-5547-44e8-9dc8-3cb739c0c0f0'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2751004600%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2751004600%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["51004600"],"dnr_lake_names":["Shetek"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 51004600; DNR Shetek; Murray."}'::jsonb
    ),
    (
      '6c3f03f2-d62c-4464-9f02-50a3c4b1b6cc'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2703038100%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2703038100%27","batch":"mn_dnr_depth_expansion_batch2_approved_6","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["03038100"],"dnr_lake_names":["Detroit"],"homonym_check":"Pre-insert: single MN waterbody_index row for Detroit Lake in Becker County matches proposal waterbody_id; unique DOWLKNUM 03038100 isolates this basin from other Detroits.","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json","evidence":"Batch-2 approved six; unique DOWLKNUM 03038100; DNR Detroit; Becker."}'::jsonb
    )
) as v (waterbody_id, source_path, metadata)
join public.waterbody_index w on w.id = v.waterbody_id
where s.provider_key = 'mn_dnr_bathymetric_contours'
on conflict (waterbody_id, source_id, source_mode, source_path) do nothing;
