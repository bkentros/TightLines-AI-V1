# Michigan DNR inland lake contours - approval packet and matching audit

**Status:** Draft approval packet. Do not ingest or attach links yet.
**Recommendation:** `needs_legal_signoff` before analytical, derived-feature, storage, or cached-output use.

## Official source

- **Candidate registry key:** `mi_dnr_inland_lake_contours`
- **Owner / authoritative publisher:** Michigan Department of Natural Resources, Institute for Fisheries Research (`MichiganDNR` ArcGIS owner; State of Michigan ArcGIS organization).
- **Official item:** `https://www.arcgis.com/home/item.html?id=d49160d2e5af4123b15d48c2e9c70160`
- **Item metadata JSON:** `https://www.arcgis.com/sharing/rest/content/items/d49160d2e5af4123b15d48c2e9c70160?f=json`
- **Feature layer:** `https://services3.arcgis.com/Jdnp1TjADvSDxMAX/arcgis/rest/services/DNRHydrologyOPENDATA/FeatureServer/1`
- **Query endpoint:** `https://services3.arcgis.com/Jdnp1TjADvSDxMAX/arcgis/rest/services/DNRHydrologyOPENDATA/FeatureServer/1/query`
- **Format:** ArcGIS Feature Layer, polyline contours; supported query formats include JSON, GeoJSON, and PBF; native spatial reference is EPSG:3078 (`latestWkid` 3078, layer `wkid` 102123); `outSR=4326` should be required for Water Reader source paths.
- **Fields observed:** `OBJECTID`, `GlobalID`, `NewKey` ("New Key"), `Name`, `GNISName`, `MDNRID`, `PermanentIdentifier`, `NHDPlusID`, `MinDepth`, `MaxDepth`, `Shape__Length`, edit metadata. No county field was observed in the contour layer; county must come from `waterbody_index` and geometry/centroid review.
- **Layer count / paging posture:** layer `maxRecordCount` 2000; use lake-key-scoped queries and page with `resultOffset` if `exceededTransferLimit` appears.

## Source rights posture

The item license says the dataset is a public record with "no restrictions on the use, reproduction, or distribution" of the dataset. It also says public release is not a representation that any use is legally permissible; the user is solely responsible for determining fitness for purpose. The State provides the dataset "AS IS" and "AS AVAILABLE," disclaims warranties including accuracy, continued quality/currency after download, analyses, and re-use, reserves the right to modify or remove the dataset without notice, and requires release, defense, indemnification, and hold-harmless obligations for access or use.

**Approval recommendation:** treat as technically eligible but legally gated.

- **Display permission assumption:** likely acceptable for showing source availability and attribution after legal approval, but do not imply accuracy or navigational/safety suitability.
- **Analytical / derived-use permission:** needs Brandon/legal signoff because the terms disclaim analyses/re-use and require indemnity even though reproduction/distribution are unrestricted.
- **Storage/cache implication:** keep on-demand only until legal explicitly approves storing originals, normalized contours, derived structures, rendered output, or caches.
- **Attribution text:** `Michigan Department of Natural Resources; Institute for Fisheries Research. Inland Lake Contours. Breck, J. 2004. Compilation of Databases of Michigan Lakes. Humphrys, C. R., and R. F. Green. 1962. Michigan lake inventory bulletins 1-83.`
- **Risks:** no warranty of accuracy/currency, possible source removal without notice, indemnity/hold-harmless obligation, no county field in the contour layer, and stale-waterbody risk for changed reservoirs or impoundments.
- **Registry flags recommendation before signoff:** `review_status = 'restricted'`, `can_fetch = false`, all `can_store_* = false`, `can_cache_rendered_output = false`, `attribution_required = true`.
- **Registry flags recommendation after signoff for an on-demand pilot:** `review_status = 'allowed'`, `can_fetch = true`, all storage/cache flags still `false`, `source_type = 'bathymetry_vector'`, `source_format = 'arcgis_feature_server'`.

## Matching rules for a future pilot

Do not match by `Name` alone. Accept a `waterbody_source_links` row only when all of these are true:

1. The source query is scoped by `NewKey` (or a reviewed explicit `NewKey IN (...)` aggregate), not a broad name search.
2. Michigan source identity fields are recorded in link metadata: `NewKey`, `Name`, `GNISName`, `MDNRID`, `PermanentIdentifier`, `NHDPlusID`, sampled min/max depth range, and query count.
3. `waterbody_index` has a single credible MI row for the target lake after comparing normalized name, county, centroid/geometry overlap, and area/shape plausibility. `Name` is weak evidence only.
4. Homonyms such as `Long Lake`, `Mud Lake`, `Crystal Lake`, and `Orchard Lake` are manually resolved by source keys plus geometry/county, or left unlinked.
5. The stored `source_path` must be a lake-key-scoped GeoJSON query returning contour geometry plus `MinDepth`, `MaxDepth`, `NewKey`, `Name`, `GNISName`, `MDNRID`, `PermanentIdentifier`, `NHDPlusID`, and `OBJECTID`. The `metadata.fetch_validation_url` must be the count-only twin.

## Source-side matching audit

This audit queried only the official Michigan DNR ArcGIS layer. Live `waterbody_index` comparison was intentionally not run because this task disallowed touching the live DB; exact `waterbody_id` selection remains blocked until an approved read-only SQL/export step.

| Lake probe | MI source result | Source-side classification | Waterbody-index action before insert |
| --- | --- | --- | --- |
| Lake Oakland | `NewKey=63-846`, `PermanentIdentifier=146646930`, `MDNRID=L8455`, `NHDPlusID=60001500040116`, 24 features, max depth 64 | Ready for DB comparison | Confirm single MI `waterbody_index` row around Oakland County by geometry/county/centroid; candidate first pilot lake |
| Houghton Lake | `72-78`, 72 features, max depth 21 | Ready for DB comparison | Confirm one large Roscommon-area row; watch county attribution near boundaries |
| Higgins Lake | `72-117`, 46 features, max depth 130 | Ready for DB comparison | Confirm one Roscommon/Crawford-area row; county/border review |
| Torch Lake | `5-51`, 7 features, max depth 250 | Ready for DB comparison | Confirm long Antrim-area geometry and avoid same-name fragments |
| Burt Lake | `16-193`, 12 features, max depth 73 | Ready for DB comparison | Confirm Cheboygan-area row |
| Mullett Lake | `16-192`, 37 features, max depth 120 | Ready for DB comparison | Confirm Cheboygan-area row |
| Gull Lake | `39-13`, 34 features, max depth 110 | Ready for DB comparison | Confirm Kalamazoo/Barry-area row |
| Wamplers Lake | `46-49`, 14 features, max depth 39 | Ready for DB comparison | Confirm Lenawee-area row |
| Wixom Lake | `26-3`, 7 features, max depth 40 | Needs product review | Reservoir/dam-status context may make user-facing depth claims stale |
| Cass Lake | `63-1337`, 95 features, max depth 123 | Ready for DB comparison | Confirm Oakland County row; note same county as Lake Oakland |
| Walloon Lake | `15-25`, 49 features, max depth 100 | Ready for DB comparison | Confirm Charlevoix/Emmet-area row |
| Whitmore Lake | `47-153`, 24 features, max depth 69 | Ready for DB comparison | Confirm Livingston/Washtenaw boundary handling |
| Orchard Lake | two keys: `43-87`, `63-344`; 44 features total, max depth 111 | Ambiguous source name | Resolve by geometry/county; do not use name-only |
| Long Lake | 30 distinct `NewKey` values, 475 features, max depth 105 | Ambiguous homonym | Manual target list required before any link |
| Mud Lake | 23 distinct `NewKey` values, 168 features, max depth 51 | Ambiguous homonym | Manual target list required before any link |
| Crystal Lake | seven distinct `NewKey` values, 99 features, max depth 175 | Ambiguous homonym | Manual target list required before any link |

## First implementation slice if approved

1. Add a migration that inserts only the `source_registry` row for `mi_dnr_inland_lake_contours` with post-legal flags (`allowed`, `can_fetch=true`, storage/cache false). Do not add lake links in the registry migration.
2. Add a reviewed proposal JSON for 5-10 pilot lakes, starting with Lake Oakland plus large unique-key lakes after DB comparison. Store explicit `waterbody_id`, `NewKey`, source fields, count probe URL, GeoJSON source URL, match evidence, and legal review reference.
3. Add a separate explicit-`waterbody_id` migration for approved links only, following the MN DNR pattern. `source_path_type='feature_query'`, `depth_source_kind='machine_readable'`, `approval_status='approved'`, `lake_match_status='matched'`, `usability_status='usable'` only after source and DB checks pass.
4. Keep contours on-demand only. Do not normalize, cache, render, score, overlay, or analyze contours in this slice.
5. App behavior should only show "machine-readable depth source available" after the link is approved, reachable, matched, and usable in `waterbody_availability_snapshot`; no depth map or read/report should appear yet.

## Read-only DB comparison SQL for the next approved step

```sql
select
  id,
  canonical_name,
  county_name,
  surface_area_acres,
  ST_Y(centroid) as centroid_lat,
  ST_X(centroid) as centroid_lon,
  source_summary ->> 'gnisid' as gnisid,
  source_summary ->> 'id3dhp' as id3dhp
from public.waterbody_index
where state_code = 'MI'
  and waterbody_type in ('lake', 'pond', 'reservoir')
  and normalized_name = public.normalize_waterbody_name('<candidate lake name>')
order by surface_area_acres desc nulls last;
```

For ambiguous names, pair that query with a geometry/centroid comparison against the Michigan contour envelope for a specific `NewKey`; do not choose a row by name alone.
