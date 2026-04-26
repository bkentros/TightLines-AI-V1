-- Minnesota DNR bathymetric contours — approved 12-lake expansion (reviewed insert proposal only).
-- Inserts by explicit waterbody_id from docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json
-- so multi-fragment USGS rows (e.g. Burntside Lake) do not fan out duplicate links.
-- Mirrors pilot: GeoJSON source_path, metadata.fetch_validation_url count probe, on_demand_only.

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
      '74af9d87-8e97-4293-9f55-e12da922086f'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2756024200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2756024200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["56024200"],"dnr_lake_names":["Otter Tail"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM; DNR LAKE_NAME Otter Tail."}'::jsonb
    ),
    (
      '08861f79-5154-4225-bfd5-f754c9e511f8'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2761013000%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2761013000%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["61013000"],"dnr_lake_names":["Minnewaska"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 61013000."}'::jsonb
    ),
    (
      'bd44fd0f-e92c-4893-a307-241600ed6b95'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2777021500%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2777021500%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["77021500"],"dnr_lake_names":["Osakis"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 77021500."}'::jsonb
    ),
    (
      '49d4a4c7-6174-43d1-a239-680a8677f5d1'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2721008300%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2721008300%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["21008300"],"dnr_lake_names":["Miltona"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 21008300."}'::jsonb
    ),
    (
      '30569d9f-9e79-41b5-a9da-ef1714fe16ab'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2778002500%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2778002500%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["78002500"],"dnr_lake_names":["Traverse"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 78002500; county aligns."}'::jsonb
    ),
    (
      '04066abc-9ef3-4707-bad2-e7afe4fb8202'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2702005200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2702005200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["02005200"],"dnr_lake_names":["Nett Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 02005200."}'::jsonb
    ),
    (
      '0c8f5a80-b9bd-419e-a137-7f0a8809de56'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2769011800%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2769011800%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["69011800"],"dnr_lake_names":["Burntside Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 69011800; explicit waterbody_id (USGS splits same name/county)."}'::jsonb
    ),
    (
      '6059b6b0-6e06-4049-84a5-303105da14f3'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2745000100%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2745000100%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["45000100"],"dnr_lake_names":["Thief Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 45000100."}'::jsonb
    ),
    (
      '9fe91eb1-12b2-4353-863b-37029871509e'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2701006200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2701006200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["01006200"],"dnr_lake_names":["Big Sandy Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 01006200."}'::jsonb
    ),
    (
      '581e7d6f-0d92-41ad-b30c-6dad09598d15'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2718037200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2718037200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["18037200"],"dnr_lake_names":["North Long"],"homonym_check":"Single USGS MN waterbody_index row for North Long Lake in Crow Wing; DNR LAKE_NAME North Long for DOWLKNUM 18037200 in sample.","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal after homonym check."}'::jsonb
    ),
    (
      '5edd434d-7339-4ef2-9d12-8e432c452099'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2756023900%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2756023900%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["56023900"],"dnr_lake_names":["West Battle Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 56023900."}'::jsonb
    ),
    (
      'b9b12161-8b3e-4666-8eb3-1803651270a8'::uuid,
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2738052900%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2738052900%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["38052900"],"dnr_lake_names":["Snowbank Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 38052900; Lake County."}'::jsonb
    )
) as v (waterbody_id, source_path, metadata)
join public.waterbody_index w on w.id = v.waterbody_id
where s.provider_key = 'mn_dnr_bathymetric_contours'
on conflict (waterbody_id, source_id, source_mode, source_path) do nothing;
