# Water Reader V1 Polygon Build Plan

## Status

This is the controlling Water Reader V1 architecture and build plan.

Water Reader V1 is now a polygon-only product. The feature should not use satellite imagery, NAIP, computer vision, Google imagery, depth charts, bathymetry, species logic, month logic, weather, daily conditions, or source-photo interpretation.

The V1 rule is:

```text
trusted public waterbody polygon -> geometry detector -> branded lake map + conservative structure zones
```

## Product Goal

Let a user search a named U.S. lake, pond, or reservoir and quickly see whether Water Reader supports that waterbody. When supported, render a beautiful branded vector map of the lake with 3-5 conservative geometry-derived structure areas.

The output should help the angler understand visible lake-shape opportunities such as points, coves, neckdowns, island edges, bends, and long banks. It should not claim fish are present, identify best spots, infer depth, or make species-specific recommendations.

## Why This Architecture

The previous satellite / NAIP / CV direction was useful as a discovery exercise, but it is not the right V1 foundation. It was sensitive to imagery seams, shallow-water color, wetlands, shadows, mosaic changes, and display-layer artifacts. Those problems made it hard to guarantee that generated zones would stay inside water or remain visually trustworthy.

The polygon-only architecture is stronger for V1 because it is deterministic, controllable, legally cleaner, faster, easier to test, easier to render beautifully, and easier to explain. It also lets the app support a clear "supported / not supported" search experience across the national index.

## Source Of Truth

Use public-domain U.S. hydrography polygon data as the source of truth.

Primary source family:

- U.S. Geological Survey / The National Map hydrography polygons.
- Prefer current 3D Hydrography Program (3DHP) waterbody polygons where available and operationally practical.
- Existing `public.waterbody_index` remains the named-waterbody backbone.

Attribution:

```text
Hydrography source: U.S. Geological Survey / The National Map.
```

State or regional public datasets may supplement the source of truth later only after an explicit source review. V1 should not depend on state bathymetry or depth products.

## Explicit Non-Goals

Do not build or reintroduce these for V1:

- satellite imagery preview
- NAIP or ImageServer fetches
- computer vision
- raster masks
- image-derived shoreline extraction
- Google imagery or proprietary map overlays
- depth charts, bathymetry, contours, humps, channels, depth breaks, basins
- species, month, season, weather, daily condition, or water clarity logic
- productivity, "best spot", "fish zone", access, high-confidence, or exact GPS claims

Applied historical migrations may still contain old aerial/depth terminology. Treat those as database history only. They are not current product architecture.

## User Experience

### Search

1. User opens Water Reader.
2. User chooses a state.
3. User searches a named lake, pond, or reservoir.
4. Search results show support status before the user tries to open a read.

Each result should include:

- waterbody name
- county and state
- waterbody type
- approximate area when available
- Water Reader support chip

### Support Chips

Every searchable row should resolve to one of these statuses:

| Status | Meaning | User behavior |
| --- | --- | --- |
| `supported` | Valid trusted polygon exists and geometry is likely usable for V1 zones. | Allow opening the map/read. |
| `limited` | Polygon exists, but the waterbody is too small, too simple, or cannot produce enough useful zones. | Allow a limited map or show "limited structure read". |
| `needs_review` | Polygon exists, but geometry is multipart, ambiguous, unusually complex, or failed an automated QA rule. | Do not present as a normal supported read; show guarded copy or hold for review. |
| `not_supported` | No trusted polygon, unsupported geography/type, invalid geometry, or outside V1 policy. | Do not allow read generation. |

Search should never imply that all 122k indexed waterbodies are supported. The product promise is honest coverage, not universal output.

### Map Output

Supported output should be a branded vector map, not a source-photo map:

- soft blue lake fill
- subtle shoreline stroke
- muted land/background
- 3-5 highlighted structure zones clipped inside the polygon
- optional small labels or cards, kept off the zone when possible
- attribution and support status in small copy

The map should look intentional and premium even when the underlying polygon is simple.

### Zone Cards

Each zone card may include:

- zone label, such as "Main-lake point", "Cove mouth", "Narrow shoreline pinch", "Island edge", or "Long bank"
- why that geometry can matter generally
- a basic "how to approach" note written as generic angling education

Allowed wording:

- "structure area"
- "shoreline shape"
- "point"
- "cove"
- "neckdown"
- "island edge"
- "long bank"
- "geometry-derived"
- "manual review required"

Avoid wording:

- fish zone
- best spot
- guaranteed
- high confidence
- productive water
- fish are here
- GPS waypoint
- depth break
- channel
- hump
- basin
- species-specific language

## Data Model

### Required Search Fields

The existing search backbone should continue to return:

- `lakeId`
- `name`
- `state`
- `county`
- `waterbodyType`
- `surfaceAreaAcres`
- `centroid`
- `previewBbox`

Add V1 support fields:

- `waterReaderSupportStatus`
- `waterReaderSupportReason`
- `hasPolygonGeometry`
- `polygonAreaAcres`
- `polygonQaFlags`

### Required Polygon Fields

A selected-polygon endpoint or RPC should return:

- `lakeId`
- `name`
- `state`
- `county`
- `waterbodyType`
- polygon or multipolygon GeoJSON
- centroid
- bbox
- area
- perimeter
- source dataset
- source feature id
- source version or update date when available
- geometry validity status
- island/hole count
- component count
- support status and reason
- QA flags

### Derived Structure Fields

The detector should emit:

- `candidateId`
- `rank`
- `featureClass`
- `featureLabel`
- source geometry role
- display geometry clipped inside polygon
- shoreline arc or source geometry for QA
- anchor point for cards/labels
- score
- metrics
- QA flags
- confidence: `dev_only_low`, `low`, or `medium`
- `manualReviewRequired` when appropriate

## Support Status Rules

Initial status can be conservative and deterministic.

### `not_supported`

Use when:

- no polygon geometry is available
- geometry is null or invalid and cannot be repaired
- type is not lake, pond, or reservoir
- waterbody is outside V1 geography
- polygon area is below an absolute minimum
- polygon cannot be projected or measured safely

### `limited`

Use when:

- polygon is valid but too small for 3 useful zones
- shoreline is too simple
- detector cannot produce at least 3 safe display zones
- polygon is a tiny pond where the best output is a simple silhouette

### `needs_review`

Use when:

- multipart geometry has ambiguous components
- selected component is uncertain
- polygon has unusual holes or topology
- geometry is too complex for automatic confidence
- area/perimeter/shape metrics are outliers
- detector output clusters badly or fails diversity rules

### `supported`

Use when:

- polygon is valid
- standing-water type is supported
- area is above minimum
- geometry is topologically clear
- detector can produce 3-5 display zones inside the polygon
- QA flags are not severe

## Geometry Pipeline

### 1. Normalize

- Load selected polygon by `lakeId`.
- Repair geometry when safe.
- Drop sliver components below a threshold.
- Select primary component when multipart.
- Preserve meaningful holes/islands.
- Project to an appropriate local metric CRS.

### 2. Measure

Compute:

- area
- perimeter
- compactness
- shoreline development
- elongation
- component count
- hole/island count
- minimum rotated rectangle
- bbox and centroid

### 3. Classify Shape Mode

Suggested shape modes:

- `small_simple`
- `long_simple_basin`
- `mixed`
- `complex_shoreline`
- `multipart_needs_review`

Shape mode should influence detector thresholds and expected output count.

### 4. Extract Shoreline Features

Use polygon geometry only.

Feature classes:

- `convex_point_protrusion`
- `concave_cove_pocket`
- `shoreline_bend`
- `neckdown_candidate`
- `island_edge_candidate`
- `long_bank`
- `inlet_outlet_context` only when supported by trusted hydrography line/point data, not guessed from shape alone

Detector methods:

- densify exterior ring in metric space
- smooth enough to remove vertex noise without erasing real shoreline
- compute local signed turn / curvature over multiple windows
- detect protrusions and pockets by signed curvature and local prominence
- detect neckdowns by opposite-shore proximity and connecting-water width
- detect island edges from interior rings
- detect long banks by low-curvature shoreline arcs with useful length

### 5. Rank

Rank by:

- geometric prominence
- arc length / useful size
- clarity of feature class
- spacing from other candidates
- diversity of feature types
- display-zone quality
- absence of severe QA flags

Do not rank by species, month, season, depth, weather, water clarity, access, or productivity in V1.

### 6. Clip Display Zones

Display geometry must never leave the selected polygon.

Rules:

- derive display zones from detector features
- inset or clip zones inside polygon
- reject zones that touch land after clipping
- reject tiny or line-like display zones
- prefer fewer safe zones over more noisy zones
- output 3-5 product zones when possible

### 7. Validate

Per-lake validation should record:

- detector candidate count
- product candidate count
- rejected candidate reasons
- all display zones inside polygon
- minimum zone area
- minimum spacing
- feature-class distribution
- support status

## Renderer Architecture

V1 renderer should be vector-only.

Inputs:

- selected waterbody polygon
- product zone display polygons
- optional anchor points
- selected support status

Renderer responsibilities:

- fit polygon to available viewport
- preserve aspect ratio
- draw muted land background
- draw lake fill and shoreline stroke
- draw 3-5 translucent zones
- keep labels/cards legible
- avoid labels that obscure the zones
- show unsupported/limited states clearly

Renderer non-responsibilities:

- no source imagery
- no map tiles
- no depth visualization
- no species/weather/month decisions

## API / Runtime Architecture

Recommended runtime path:

1. `waterbody-search`
   - returns searchable rows and support status
2. `waterbody-polygon`
   - read-only endpoint/RPC for selected polygon geometry and metadata
3. `waterbody-polygon-structure`
   - deterministic detector endpoint or client-side module depending on performance
4. app renderer
   - draws vector map and cards

For V1, server-side detector is preferred if geometry size or device performance becomes a problem. Client-side rendering is still fine for display.

## Coverage Audit

Before product integration, run a national coverage audit over `public.waterbody_index`.

Report:

- total indexed lake/pond/reservoir rows
- rows with valid polygon geometry
- rows with invalid or missing geometry
- rows by state
- rows by type
- area distribution
- component count distribution
- holes/islands distribution
- too-small count
- support status counts
- detector can-produce-3-zones count
- top failure reasons

Acceptance target should not be 100 percent. The target should be honest status coverage for all search results and strong support for the majority of named mainland U.S. standing water.

## Database / Migration Notes

Preserve historical migrations. Do not rewrite applied migrations to erase old terms.

New migrations should:

- add polygon V1 support-status fields if needed
- add selected-polygon retrieval RPC if needed
- add structure-output storage only if the product intentionally decides to persist derived outputs

Default V1 should compute derived zones on demand until persistence rules are explicitly chosen.

## Legal / Source Posture

USGS / The National Map hydrography data is the intended source family for V1 because it is public-domain federal data. Keep attribution in-app and in docs.

If future state or regional polygon sources are added:

- record provider
- record license/terms
- record attribution
- record whether fetch/use/storage is allowed
- do not mix them into production until reviewed

Do not use source-photo imagery or proprietary map overlays in V1.

## Build Sequence

### Slice 1: Clean Search + Support Status

- Add support status to search contracts.
- Compute conservative status from existing geometry signals.
- Render status chips in search results.
- Block unsupported reads.

Acceptance:

- every result shows supported / limited / needs review / not supported
- unsupported rows cannot open a read
- no satellite/aerial/CV references in active Water Reader UI

### Slice 2: Selected Polygon API

- Add read-only selected-polygon endpoint/RPC by `lakeId`.
- Return polygon GeoJSON and QA metadata.
- Keep payload bounded with reasonable simplification if needed.

Acceptance:

- selected lake returns valid polygon
- missing/invalid polygon returns supported error state
- no DB writes

### Slice 3: Coverage Audit

- Build script to audit all indexed rows.
- Compute support status counts.
- Produce state/type breakdown.
- Produce failure reason samples.

Acceptance:

- know how many of 122k are supported, limited, needs review, not supported
- no guessing about coverage

### Slice 4: Polygon Detector

- Build deterministic geometry detector.
- Emit QA candidates and product candidates separately.
- Product candidates must be clipped inside polygon.

Acceptance:

- fixture lakes generate plausible 3-5 zones
- no zone leaves polygon
- output can be explained from metrics

### Slice 5: Branded Renderer

- Draw vector lake map in app.
- Add zone cards.
- Add support/limited/needs-review UI states.

Acceptance:

- app has no dependency on source imagery
- zones are readable and branded
- labels do not obscure zones

### Slice 6: QA Set And Regression

Initial fixture set:

- Torch Lake
- Houghton Lake
- Burt Lake
- Lake Charlevoix
- Higgins Lake
- small simple pond
- complex cove-heavy lake
- island-heavy lake
- multipart/ambiguous lake
- reservoir shape edge case

Acceptance:

- detector outputs stable snapshots
- support status is explainable
- failure cases degrade gracefully

## File Ownership

Expected active files:

- `app/water-reader.tsx`
- `lib/waterReader.ts`
- `lib/waterReaderContracts.ts`
- `supabase/functions/waterbody-search/index.ts`
- `supabase/functions/_shared/waterReader/contracts.ts`
- future `supabase/functions/waterbody-polygon/index.ts`
- future polygon detector module/script
- future coverage audit script

Obsolete paths should not be revived:

- NAIP audit scripts
- aerial tile plan functions
- aerial geometry candidate functions
- imagery quality proof helpers
- source-photo preview helpers
- depth pilot docs as V1 implementation guidance

## Open Decisions

1. Whether polygon detector runs in Edge, PostGIS SQL, app client, or offline-generated fixtures for first dev preview.
2. Minimum supported lake/pond size.
3. Maximum polygon payload size for mobile.
4. Whether derived zones are computed on demand or cached.
5. Final UX copy for `limited` and `needs_review`.
6. Exact attribution placement.

## Definition Of Done For V1

Water Reader V1 is ready when:

- search results expose honest support status
- supported lakes retrieve trusted polygons
- unsupported lakes are clearly blocked
- detector produces 3-5 safe geometry zones for supported lakes
- renderer displays a beautiful vector lake map
- every zone stays inside the selected polygon
- copy stays within V1 claim limits
- coverage audit is understood
- regression fixture set passes
- no satellite/NAIP/CV/depth product path is active
