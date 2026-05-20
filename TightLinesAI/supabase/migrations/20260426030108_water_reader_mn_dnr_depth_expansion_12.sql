-- Minnesota DNR bathymetric contours — approved 12-lake expansion (reviewed insert proposal only).
-- Mirrors pilot: GeoJSON source_path, metadata.fetch_validation_url count probe, on_demand_only.
-- Does not attach excluded candidates (border, ambiguous, no-match, reject).

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
  v.metadata
from public.source_registry s
cross join (
  values
    (
      'Otter Tail Lake',
      'Otter Tail',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2756024200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2756024200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["56024200"],"dnr_lake_names":["Otter Tail"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM; DNR LAKE_NAME Otter Tail."}'::jsonb
    ),
    (
      'Lake Minnewaska',
      'Pope',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2761013000%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2761013000%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["61013000"],"dnr_lake_names":["Minnewaska"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 61013000."}'::jsonb
    ),
    (
      'Lake Osakis',
      'Todd',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2777021500%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2777021500%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["77021500"],"dnr_lake_names":["Osakis"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 77021500."}'::jsonb
    ),
    (
      'Lake Miltona',
      'Douglas',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2721008300%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2721008300%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["21008300"],"dnr_lake_names":["Miltona"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 21008300."}'::jsonb
    ),
    (
      'Lake Traverse',
      'Traverse',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2778002500%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2778002500%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["78002500"],"dnr_lake_names":["Traverse"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 78002500; county aligns."}'::jsonb
    ),
    (
      'Nett Lake',
      'Koochiching',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2702005200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2702005200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["02005200"],"dnr_lake_names":["Nett Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 02005200."}'::jsonb
    ),
    (
      'Burntside Lake',
      'St. Louis',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2769011800%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2769011800%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["69011800"],"dnr_lake_names":["Burntside Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 69011800."}'::jsonb
    ),
    (
      'Thief Lake',
      'Marshall',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2745000100%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2745000100%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["45000100"],"dnr_lake_names":["Thief Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 45000100."}'::jsonb
    ),
    (
      'Big Sandy Lake',
      'Aitkin',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2701006200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2701006200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["01006200"],"dnr_lake_names":["Big Sandy Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 01006200."}'::jsonb
    ),
    (
      'North Long Lake',
      'Crow Wing',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2718037200%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2718037200%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["18037200"],"dnr_lake_names":["North Long"],"homonym_check":"Single USGS MN waterbody_index row for North Long Lake; DNR LAKE_NAME North Long only for this DOWLKNUM in sample.","usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal after homonym check."}'::jsonb
    ),
    (
      'West Battle Lake',
      'Otter Tail',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2756023900%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2756023900%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["56023900"],"dnr_lake_names":["West Battle Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 56023900."}'::jsonb
    ),
    (
      'Snowbank Lake',
      'Lake',
      'https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=geojson&returnGeometry=true&returnNullGeometry=false&outFields=DEPTH%2CDOWLKNUM%2CLAKE_NAME%2COBJECTID%2Cabs_depth&outSR=4326&resultRecordCount=4000&where=DOWLKNUM%3D%2738052900%27',
      '{"fetch_validation_url":"https://arcgis.metc.state.mn.us/server/rest/services/GDRS/DNR_water_lake_bathymetric_contours/FeatureServer/0/query?f=pjson&returnGeometry=false&returnCountOnly=true&outFields=OBJECTID&where=DOWLKNUM%3D%2738052900%27","batch":"mn_dnr_depth_expansion_approved_12","match_method":"dowlkinum_arcgis_query","dnr_dowlknums":["38052900"],"dnr_lake_names":["Snowbank Lake"],"usable_response_format":"geojson","native_storage_crs":"EPSG:26915","response_crs_requested":"EPSG:4326","depth_fields":["DEPTH","abs_depth"],"geometry_geojson_types":["LineString","MultiLineString"],"paging":{"resultRecordCount":4000,"resultOffset_param":"resultOffset"},"on_demand_only":true,"review_ref":"water_reader_mn_dnr_expansion_reviewed_insert_proposal.json","evidence":"Approved 12-lake proposal; unique DOWLKNUM 38052900; Lake County."}'::jsonb
    )
) as v (canonical_name, county_name, source_path, metadata)
join public.waterbody_index w
  on w.external_source = 'usgs_3dhp_waterbody'
  and w.state_code = 'MN'
  and w.canonical_name = v.canonical_name
  and w.county_name = v.county_name
where s.provider_key = 'mn_dnr_bathymetric_contours'
on conflict (waterbody_id, source_id, source_mode, source_path) do nothing;;
