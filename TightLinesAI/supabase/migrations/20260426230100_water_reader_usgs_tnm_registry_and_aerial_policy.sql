-- USGS The National Map — NAIP Plus ImageServer: registry + national aerial policy (disabled).
-- Official REST directory (USGS): https://imagery.nationalmap.gov/arcgis/rest/services?f=pjson
-- Service metadata: https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer?f=pjson
-- USGS imagery FAQ: https://www.usgs.gov/faqs/what-are-urls-imagery-services-national-map-and-are-they-cached-or-dynamic
-- Brandon approval + gating: docs/WATER_READER_USGS_TNM_NATIONAL_AERIAL_APPROVAL_PACKET.md §8
-- Do not set water_reader_aerial_provider_policies.is_enabled = true until explicit launch.
-- Apply on staging/local first; production only when ops approves.

insert into public.source_registry (
  provider_key,
  provider_name,
  state_code,
  source_type,
  source_format,
  review_status,
  can_fetch,
  can_store_original,
  can_store_normalized,
  can_store_derived_features,
  can_cache_rendered_output,
  attribution_required,
  attribution_text,
  license_url,
  provider_health_check_url,
  notes
)
values (
  'usgs_tnm_naip_plus',
  'USGS The National Map — NAIP Plus (ImageServer)',
  null,
  'aerial_imagery',
  'arcgis_image_server',
  'allowed',
  true,
  false,
  false,
  false,
  false,
  true,
  'Map services and data available from U.S. Geological Survey, National Geospatial Program. Imagery credit: USGS, USDA, The National Map orthoimagery (per USGS service metadata).',
  'https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map',
  'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer?f=pjson',
  'USGS-hosted TNM dynamic ImageServer (NAIP + HRO mosaic per USGS service description). Service root: https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer — on-demand, conservative rates; no bulk download. Not Esri NAIP; not national default until policy enabled.'
)
on conflict (provider_key) do update
set
  provider_name = excluded.provider_name,
  state_code = excluded.state_code,
  source_type = excluded.source_type,
  source_format = excluded.source_format,
  review_status = excluded.review_status,
  can_fetch = excluded.can_fetch,
  can_store_original = excluded.can_store_original,
  can_store_normalized = excluded.can_store_normalized,
  can_store_derived_features = excluded.can_store_derived_features,
  can_cache_rendered_output = excluded.can_cache_rendered_output,
  attribution_required = excluded.attribution_required,
  attribution_text = excluded.attribution_text,
  license_url = excluded.license_url,
  provider_health_check_url = excluded.provider_health_check_url,
  notes = excluded.notes,
  updated_at = timezone('utc', now());

insert into public.water_reader_aerial_provider_policies (
  source_id,
  policy_key,
  display_name,
  is_enabled,
  approval_status,
  provider_health_target_url,
  coverage,
  notes
)
select
  s.id,
  'usgs_tnm_naip_plus_national',
  'USGS TNM — NAIP Plus (national policy, disabled)',
  false,
  'approved',
  'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer?f=pjson',
  jsonb_build_object(
    'service_root', 'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer',
    'official_rest_directory', 'https://imagery.nationalmap.gov/arcgis/rest/services?f=pjson',
    'usgs_imagery_faq_url', 'https://www.usgs.gov/faqs/what-are-urls-imagery-services-national-map-and-are-they-cached-or-dynamic',
    'usgs_services_catalog_url', 'https://apps.nationalmap.gov/services/',
    'resolution_note', 'Per USGS service description: NAIP and HRO orthoimagery mosaic; digital orthoimage resolution may vary from 6 inches to 1 meter by location.',
    'exclude_state_codes', '[]'::jsonb,
    'territory_caveat', 'AK, HI, and US territories: verify coverage and vintage from service/catalog metadata; do not assume conterminous-US quality.',
    'national_default_esri_naip', false
  ),
  'Brandon-approved on-demand scope (TNM packet §8). is_enabled remains false until national aerial launch. No persistent imagery storage per registry flags.'
from public.source_registry s
where s.provider_key = 'usgs_tnm_naip_plus'
on conflict (policy_key) do update
set
  source_id = excluded.source_id,
  display_name = excluded.display_name,
  is_enabled = excluded.is_enabled,
  approval_status = excluded.approval_status,
  provider_health_target_url = excluded.provider_health_target_url,
  coverage = excluded.coverage,
  notes = excluded.notes,
  updated_at = timezone('utc', now());
