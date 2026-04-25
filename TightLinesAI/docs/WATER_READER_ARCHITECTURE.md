# FinFindr Water Reader — Architecture & Engine Blueprint

**Status:** Superseded by `WATER_READER_MASTER_PLAN.md`.

**Use instead:** `WATER_READER_MASTER_PLAN.md` is now the single active Water Reader source of truth. This file is retained only for archive/reference context and should not be treated as the active implementation plan.

**Document purpose:** Define exactly what Water Reader is, how it should work, what data it may use, how the deterministic engine makes decisions, what AI is allowed to do, what should be cached, and what must be avoided.

**Audience:** AI coding agents, future developers, product owner.

**Product owner:** Brandon / FinFindr.

**Archive status:** Former V1 architecture blueprint. Superseded.

---

## 0. One-sentence product definition

**Water Reader helps an angler search a U.S. lake or pond, choose species and shore/boat mode, then receive a clean marked-up map showing the highest-probability zones to fish, why those zones matter, when to fish them today, and what to throw.**

---

## 1. Non-negotiable product principles

1. **Lakes and ponds only for V1.**
   - No rivers.
   - No saltwater.
   - No brackish.
   - No moving-water route in V1.

2. **Nationwide lake/pond search is required.**
   - Water Reader should not launch as a 3-state-only feature.
   - The system should support as many U.S. lakes/ponds as possible through a national waterbody index.
   - Not every lake needs the same data quality. Every lake should have a clear data tier.

3. **Deterministic engine decides. AI explains. Renderer draws.**
   - The LLM must not invent fishing spots.
   - The LLM must not draw random map overlays.
   - The deterministic engine must output structured zones and reasons.
   - A renderer must draw the final map using structured geometry.
   - AI may write the legend/explanation from structured engine output.

4. **Water Reader must reuse existing FinFindr logic.**
   - Existing How's Fishing Right Now engine provides daily conditions, score, top factors, limiting factors, broad time window, and presentation tip logic.
   - Existing Lure/Fly Recommender provides species/season/region/water clarity/lure/fly compatibility logic.
   - Water Reader adds spatial intelligence: map structure, shoreline/depth features, shore/boat mode, and zone scoring.

5. **Use legally appropriate data for analysis and caching.**
   - Do not analyze, extract, cache, or derive long-term feature data from Google Maps imagery/content.
   - Prefer public/open/government geospatial data for lake polygons, aerial imagery, and bathymetry.
   - Track source rights per provider and per asset.

6. **Data quality must be visible to the user.**
   - Each report must display a data tier/confidence badge.
   - Examples: `Full Depth + Aerial`, `Depth Only`, `Aerial Only`, `Limited Data`, `Upload Scan`.

7. **Shore mode means shoreline/nearshore scoring, not access verification.**
   - The engine should evaluate the best shoreline and castable zones around the lake/pond.
   - It should not guarantee legal/public access.
   - It should include a note: `Access not verified. Check local property and access rules.`

8. **Boat mode means full-lake scoring.**
   - Boat mode can recommend offshore structure when data supports it.
   - Boat mode should use bathymetry aggressively when available.

9. **Cache lake intelligence, not static final screenshots.**
   - Cache lake polygons, source metadata, extracted features, candidate zones, and monthly/species base scores.
   - Generate final daily report/render on demand because date, weather, species, and shore/boat mode change the result.

---

## 2. V1 product scope

### 2.1 In scope

Water Reader V1 should support:

- U.S. lake/pond search.
- Lake/pond selection by name and state.
- Species selection:
  - Largemouth bass
  - Smallmouth bass
  - Pike
  - Trout
- Access mode selection:
  - Shore
  - Boat
- Date/month context.
- Region context.
- Lake/pond water type only.
- Data-tiered report generation.
- Aerial/shoreline fallback where no bathymetry exists.
- Depth intelligence where machine-readable bathymetry exists.
- Optional user-upload analysis after named lake selection.
- Map overlay with numbered zones.
- Legend explaining each zone.
- Confidence/source badges.
- Integration with existing How's Fishing and Lure/Fly Recommender logic.

### 2.2 Out of scope for V1

Do not build these in V1:

- River support.
- Saltwater/coastal support.
- Real-time fish location claims.
- Public/private land access verification.
- Navigation/routing to spots.
- Garmin/Navionics scraping.
- Google satellite imagery analysis/caching.
- Training/fine-tuning AI models on user-uploaded chart screenshots.
- Public database enrichment from user-uploaded proprietary screenshots.
- Fully automatic contour extraction from every arbitrary uploaded depth chart.
- 12 pre-rendered final maps per lake as the main cache strategy.
- Social/community hotspot sharing.

---

## 3. Legal/data-source rules

This section is critical. Agents must not ignore it.

### 3.1 Google Maps / Google satellite imagery

**Do not use Google imagery/content as the analysis or caching foundation for Water Reader.**

Reasoning:

- Google Maps Platform Terms prohibit scraping/exporting/extracting Google Maps Content outside the services, caching except where expressly allowed, and creating content based on Google Maps Content. The terms give examples such as tracing/digitizing features from satellite base maps and using Google Maps Content to improve ML/AI models. Source: https://cloud.google.com/maps-platform/terms
- Google Map Tiles API policies state that the API is for map visualization and may not be used for non-visualization use cases such as image analysis, machine interpretation, object detection/identification, geodata extraction/resale, or offline uses. Source: https://developers.google.com/maps/documentation/tile/policies

Permitted/possible use case:

- Google may be used only for normal live map display if attribution and terms are followed.
- Do not use it to detect vegetation, trace shorelines, identify docks, cache lake images, or build derived fishing structure layers.

### 3.2 Preferred national aerial imagery source

Default U.S. aerial imagery source should be **NAIP** where practical.

Why:

- NAIP is aerial imagery acquired by USDA during agricultural growing seasons in the conterminous U.S.
- USGS lists NAIP as public domain.
- USGS states NAIP imagery was historically 1-meter ground sample distance, with 0.6-meter standard after 2018 and optional 0.3-meter data in some contexts.
- NAIP imagery is orthorectified, making it suitable for GIS workflows.

Sources:

- https://www.usgs.gov/centers/eros/science/usgs-eros-archive-aerial-photography-national-agriculture-imagery-program-naip
- https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer

### 3.3 National lake/pond index source

Default national lake/pond geometry source should be **USGS hydrography data**.

Use 3D Hydrography Program / legacy NHD/NHDPlus products as the starting point for lake/pond polygons.

Important notes:

- The National Hydrography Dataset represents U.S. surface water features including lakes and ponds.
- NHD was retired as of October 1, 2023; legacy data remains available but is no longer maintained.
- More current work is shifting to the 3D Hydrography Program.
- 3DHP and legacy hydrography products are available as downloads and web-based map/data services.

Sources:

- https://www.usgs.gov/national-hydrography/national-hydrography-dataset
- https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products

### 3.4 Depth/bathymetry sources

Depth data should come from state/federal/open sources where licensing permits analysis and derived-feature storage.

Prioritize these formats, in order:

1. Bathymetric DEM / raster depth surface.
2. Vector depth contours.
3. ArcGIS FeatureServer / MapServer queryable layers.
4. GeoJSON / shapefile / file geodatabase.
5. Public PDF depth chart.
6. Public scanned chart image.
7. User-uploaded screenshot/private chart.

Examples of valuable sources:

- Michigan has an inland lake contour GIS layer described as a digital copy of Michigan DNR hand-drawn lake contour maps. Source: https://gis-michigan.opendata.arcgis.com/datasets/midnr::inland-lake-contours
- Minnesota has lake bathymetric contours, DEM, outlines, and aquatic vegetation data; Minnesota geospatial metadata says bathymetry data exists for almost 1,900 lakes. Source: https://www.mngeo.state.mn.us/chouse/water_lakes.html

### 3.5 User-uploaded screenshots/charts

User uploads are allowed as a private, one-time analysis path, with strict boundaries.

Rules:

- User must select the named lake/pond first whenever possible.
- Uploaded images/charts should be processed for that user's report only.
- Do not use user-uploaded proprietary screenshots to enrich the global FinFindr lake index.
- Do not train, fine-tune, validate, or benchmark models on uploaded proprietary chart screenshots.
- Do not cache third-party chart screenshots as public/reusable base maps.
- It is acceptable to save the generated report to the user's account if product terms allow it.
- Include a user-facing note: `Uploaded map/chart accuracy depends on image quality and source rights. FinFindr does not verify chart ownership or access rights.`

### 3.6 Source rights tracking

Every source and asset must have explicit rights metadata.

Required fields:

```ts
source_rights = {
  can_fetch: boolean;
  can_store_original: boolean;
  can_store_normalized: boolean;
  can_store_derived_features: boolean;
  can_cache_rendered_output: boolean;
  can_use_for_ai_training: false; // default false
  attribution_required: boolean;
  attribution_text?: string;
  license_url?: string;
  review_status: "unreviewed" | "allowed" | "restricted" | "blocked";
}
```

Default rule: if rights are unclear, do not store originals or derived reusable data until reviewed.

---

## 4. Data tiers and user-facing labels

Each lake/pond must have a data tier. The tier controls engine behavior and user messaging.

| Tier | Internal name | Data available | User-facing label | Engine behavior |
|---|---|---|---|---|
| 1 | `full_depth_aerial` | Lake polygon + machine-readable bathymetry + aerial imagery | Full Water Reader | Highest confidence; use depth + visible cover |
| 2 | `depth_only` | Lake polygon + machine-readable bathymetry | Depth Intelligence | High confidence for structure; limited visible-cover logic |
| 3 | `aerial_only` | Lake polygon + aerial imagery | Aerial Structure Scan | Shoreline/visible-cover intelligence only |
| 4 | `chart_image` | Public chart/PDF/scanned chart | Chart Scan | Medium confidence; depends on chart quality |
| 5 | `polygon_only` | Lake polygon only | Limited Water Reader | Low confidence; generic shoreline geometry only |
| 6 | `user_upload` | User image/chart | Upload Scan | Private, one-time analysis; confidence depends on image quality |

Reports must clearly say what was used.

Example badges:

- `Depth + Aerial Available`
- `Aerial Only`
- `Limited Data`
- `Upload Scan`
- `Access Not Verified`

---

## 5. User flows

### 5.1 Main named-lake flow

1. User opens Water Reader.
2. User searches for a lake/pond by name.
3. User selects lake from results.
4. App displays available data tier.
5. User selects species:
   - LMB
   - SMB
   - Pike
   - Trout
6. User selects mode:
   - Shore
   - Boat
7. App uses date/location/month/region automatically.
8. App calls existing How's Fishing engine for daily context.
9. App calls/uses Lure/Fly Recommender logic for presentation/lure/fly context.
10. Water Reader engine scores zones.
11. Renderer produces marked map.
12. LLM generates clean legend from structured output.
13. User receives final report.

### 5.2 Upload flow

1. User selects a lake/pond first.
2. User chooses `Upload Map or Chart`.
3. User selects upload type:
   - Aerial/satellite screenshot
   - Depth chart screenshot
   - Other lake map
4. User uploads image.
5. Optional V1 controls:
   - crop
   - rotate
   - confirm north-up if known
   - confirm map roughly matches selected lake
6. Engine processes image privately.
7. Engine generates one-time report.
8. Report is saved to user's history if product rules permit.

Important: Uploaded image should not become part of the global lake index unless source rights are explicitly verified.

---

## 6. Core inputs and outputs

### 6.1 Water Reader input

```ts
export type WaterReaderInput = {
  userId: string;
  lakeId: string;
  species: "largemouth_bass" | "smallmouth_bass" | "pike" | "trout";
  accessMode: "shore" | "boat";
  dateISO: string;
  userLat?: number;
  userLng?: number;
  waterClarity?: "clear" | "stained" | "murky" | "unknown";
  sourcePreference?: "best_available" | "depth" | "aerial" | "upload";
  uploadedImageId?: string;
};
```

### 6.2 Water Reader report output

```ts
export type WaterReaderReport = {
  reportId: string;
  lake: WaterbodySummary;
  species: string;
  accessMode: "shore" | "boat";
  dateISO: string;
  month: number;
  region: string;
  dataTier: WaterReaderDataTier;
  confidence: "high" | "medium" | "low";
  confidenceReasons: string[];
  mapImageUrl: string;
  overlayGeoJsonUrl?: string;
  zones: WaterReaderZone[];
  bestTimeWindow?: string;
  whatToThrow: WaterReaderThrowRecommendation[];
  dailyContext: WaterReaderDailyContext;
  summary: string;
  accessNote?: string;
  sourceAttribution: SourceAttribution[];
  createdAt: string;
};
```

### 6.3 Zone object

```ts
export type WaterReaderZone = {
  id: "A" | "B" | "C" | "D" | "E" | string;
  rank: number;
  label: string;
  zoneType:
    | "shoreline_point"
    | "windblown_bank"
    | "protected_cove"
    | "weed_edge"
    | "dock_line"
    | "flat"
    | "first_break"
    | "deep_break"
    | "hump"
    | "saddle"
    | "basin_edge"
    | "inlet_outlet"
    | "rock_gravel_transition"
    | "unknown_visible_structure";
  geometry: GeoJSON.Feature;
  center: { lat: number; lng: number };
  score: number; // 0-100
  confidence: "high" | "medium" | "low";
  accessFit: "shore" | "boat" | "both";
  structureFeatures: string[];
  seasonalReason: string;
  dailyConditionsReason: string;
  recommendedWindow?: string;
  recommendedApproach: string;
  lureFlyAlignment: string[];
  limitations?: string[];
};
```

---

## 7. Database architecture

Use Supabase Postgres with PostGIS enabled.

### 7.1 Required tables

#### `waterbody_index`

Master lake/pond index.

```sql
create table waterbody_index (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  canonical_name text not null,
  state text not null,
  county text,
  waterbody_type text check (waterbody_type in ('lake','pond','reservoir')),
  centroid geography(Point, 4326),
  geometry geometry(MultiPolygon, 4326),
  surface_area_acres numeric,
  max_depth_ft numeric,
  mean_depth_ft numeric,
  region text,
  data_tier text not null default 'polygon_only',
  has_aerial boolean default false,
  has_depth_vector boolean default false,
  has_depth_dem boolean default false,
  has_depth_pdf boolean default false,
  has_user_uploads boolean default false,
  status text default 'active',
  source_summary jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Indexes:

```sql
create index waterbody_index_name_idx on waterbody_index using gin (to_tsvector('english', canonical_name));
create index waterbody_index_geom_idx on waterbody_index using gist (geometry);
create index waterbody_index_centroid_idx on waterbody_index using gist (centroid);
create index waterbody_index_state_idx on waterbody_index (state);
```

#### `waterbody_aliases`

```sql
create table waterbody_aliases (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid references waterbody_index(id) on delete cascade,
  alias text not null,
  source text,
  created_at timestamptz default now()
);
```

#### `source_registry`

Known state/federal/provider sources.

```sql
create table source_registry (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,
  state text,
  source_type text not null,
  endpoint_url text,
  format text,
  adapter_name text,
  license_status text default 'unreviewed',
  can_fetch boolean default false,
  can_store_original boolean default false,
  can_store_normalized boolean default false,
  can_store_derived_features boolean default false,
  can_cache_rendered_output boolean default false,
  attribution_required boolean default false,
  attribution_text text,
  license_url text,
  status text default 'candidate',
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `waterbody_assets`

Assets linked to a lake.

```sql
create table waterbody_assets (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid references waterbody_index(id) on delete cascade,
  source_id uuid references source_registry(id),
  asset_type text not null,
  storage_path text,
  source_url text,
  format text,
  bbox geometry(Polygon, 4326),
  rights jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  status text default 'available',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `waterbody_features`

Extracted reusable lake features.

```sql
create table waterbody_features (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid references waterbody_index(id) on delete cascade,
  source_asset_id uuid references waterbody_assets(id),
  feature_type text not null,
  geometry geometry(Geometry, 4326),
  properties jsonb default '{}'::jsonb,
  confidence numeric,
  extraction_version text,
  created_at timestamptz default now()
);
```

Feature examples:

- `shoreline_point`
- `cove`
- `shoreline_complexity_segment`
- `weed_bed_visible`
- `dock_cluster`
- `inlet_outlet`
- `flat`
- `first_break`
- `deep_break`
- `hump`
- `saddle`
- `basin`
- `steep_bank`
- `rock_gravel_transition`

#### `water_reader_candidate_zones`

Reusable candidate fishing zones before daily scoring.

```sql
create table water_reader_candidate_zones (
  id uuid primary key default gen_random_uuid(),
  waterbody_id uuid references waterbody_index(id) on delete cascade,
  zone_type text not null,
  geometry geometry(Geometry, 4326),
  center geography(Point, 4326),
  base_structure_score numeric,
  access_fit text,
  source_feature_ids uuid[],
  properties jsonb default '{}'::jsonb,
  confidence numeric,
  extraction_version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `water_reader_reports`

Generated report records.

```sql
create table water_reader_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  waterbody_id uuid references waterbody_index(id),
  species text not null,
  access_mode text not null,
  date_iso date not null,
  data_tier text not null,
  confidence text,
  map_image_path text,
  overlay_geojson_path text,
  input jsonb not null,
  output jsonb not null,
  source_attribution jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
```

#### `water_reader_uploads`

```sql
create table water_reader_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  waterbody_id uuid references waterbody_index(id),
  upload_type text check (upload_type in ('aerial_image','depth_chart','other_map')),
  storage_path text not null,
  original_filename text,
  image_metadata jsonb default '{}'::jsonb,
  processing_status text default 'pending',
  generated_report_id uuid references water_reader_reports(id),
  created_at timestamptz default now()
);
```

---

## 8. Service architecture

Recommended backend modules/functions:

```txt
supabase/functions/
  water-reader/
    index.ts                       # public endpoint for report generation
  waterbody-search/
    index.ts                       # lake/pond search endpoint
  waterbody-ingest/
    index.ts                       # admin-only ingestion endpoint or job trigger
  water-reader-upload/
    index.ts                       # upload processing endpoint

supabase/functions/_shared/waterReader/
  types.ts
  dataTiers.ts
  sourceRights.ts
  adapters/
    naipAerialAdapter.ts
    arcgisFeatureServerAdapter.ts
    geoJsonAdapter.ts
    shapefileAdapter.ts
    pdfChartAdapter.ts
    userUploadAdapter.ts
  indexing/
    buildWaterbodyIndex.ts
    matchSourceAssetsToWaterbodies.ts
    sourceDiscovery.ts
  extraction/
    shorelineFeatures.ts
    aerialFeatures.ts
    depthFeatures.ts
    candidateZones.ts
  engine/
    waterReaderEngine.ts
    zoneScoring.ts
    speciesSeasonProfiles.ts
    accessModeScoring.ts
    confidenceScoring.ts
    dailyConditionsBridge.ts
    lureFlyBridge.ts
  rendering/
    renderWaterReaderMap.ts
    overlayStyles.ts
    geoJsonToSvg.ts
  narration/
    buildNarrationPayload.ts
    waterReaderNarrationPrompt.ts
  tests/
    fixtures/
    goldenScenarios.test.ts
```

---

## 9. Source adapters

Use adapters so every source type is normalized into the same internal objects.

### 9.1 Adapter interface

```ts
export interface WaterReaderSourceAdapter {
  adapterName: string;
  sourceType: string;

  discoverAssets?(params: DiscoverAssetsInput): Promise<DiscoveredAsset[]>;
  fetchAsset(asset: DiscoveredAsset): Promise<FetchedAsset>;
  normalizeAsset(asset: FetchedAsset): Promise<NormalizedAsset>;
  extractFeatures(asset: NormalizedAsset, waterbody: Waterbody): Promise<WaterbodyFeature[]>;
  validateRights(source: SourceRegistryRecord): SourceRightsDecision;
}
```

### 9.2 Required adapters

#### `NaipAerialAdapter`

Purpose:

- Fetch/clip aerial imagery for a selected lake/pond.
- Prefer NAIP/public imagery.
- Support NDVI/near-infrared when available.

Outputs:

- clipped image asset
- visible vegetation features
- shoreline color transitions
- shoreline complexity segments
- shallow/nearshore visual cues

#### `ArcGISFeatureServerAdapter`

Purpose:

- Query state/federal GIS layers.
- Normalize FeatureServer/MapServer responses to GeoJSON/PostGIS.

Use for:

- bathymetry contours
- lake outlines
- aquatic vegetation layers
- public GIS data portals

#### `GeoJsonAdapter`

Purpose:

- Import already normalized GeoJSON.

#### `ShapefileAdapter`

Purpose:

- Import shapefiles/file geodatabases through preprocessing pipeline.

#### `PdfChartAdapter`

Purpose:

- V1 scaffold only unless source PDFs are clean.
- Extract preview image, metadata, possible lake match.
- Full contour extraction should be V2 unless feasible.

#### `UserUploadAdapter`

Purpose:

- Private one-time processing.
- Do not enrich global index unless explicitly allowed.

---

## 10. Feature extraction

### 10.1 Depth feature extraction

When bathymetry exists, derive:

- depth bands
- flats
- first breaks
- steep breaks
- deep breaks
- humps
- saddles
- basins
- basin edges
- steep banks
- shallow flats near deep water
- offshore structure
- likely staging areas
- depth-adjacent spawning flats

Depth inputs may include:

- DEM/raster depth surface
- vector contours with depth values
- depth polygons

Suggested calculations:

```txt
Depth band classification:
  shallow: 0-6 ft
  mid_shallow: 6-12 ft
  mid: 12-20 ft
  deep: 20+ ft

Break detection:
  identify areas where depth changes rapidly over short horizontal distance

Flat detection:
  shallow or mid-depth areas with low slope

Hump detection:
  shallower area surrounded by deeper water

Saddle detection:
  low/deeper connector between two shallower structures or two high points

First break:
  first significant slope change outside shallow shoreline/flat zone
```

These thresholds must be configurable by region/species/month.

### 10.2 Aerial/shoreline feature extraction

When aerial imagery exists, derive:

- shoreline points
- coves
- inside corners
- outside corners
- shoreline complexity
- visible weed beds
- emergent vegetation
- lily pads if detectable
- docks/dock clusters if detectable
- laydowns/wood if detectable
- shade/shadow lines if detectable
- sand/rock/muck color transitions
- inlets/outlets
- wind-blown shoreline segments
- protected pockets

Start with deterministic GIS and simple CV:

- Use lake polygon for water/land boundary.
- Analyze shoreline curvature to find points/coves.
- Use NAIP NIR/NDVI where available for vegetation.
- Use color clustering for shallow/vegetation/sand transitions.
- Add object detection later for docks/wood.

### 10.3 Shoreline candidate zone generation

For shore mode, generate candidate zones within a castable shoreline buffer.

Recommended starting values:

```ts
const SHORE_CAST_BUFFER_FT = {
  small_pond: 150,
  pond: 120,
  small_lake: 100,
  large_lake: 80,
};
```

Rules:

- Score the whole shoreline.
- Do not verify legal/public access in V1.
- Penalize offshore features outside realistic casting distance.
- Boost shoreline features that overlap with visible cover or depth breaks.

### 10.4 Boat candidate zone generation

For boat mode, generate zones across the full lake.

Rules:

- Use bathymetry if available.
- Allow offshore humps/saddles/breaks/basins.
- Do not over-promote offshore features if only aerial data exists.
- If aerial-only, boat mode should still work but with lower confidence and mostly visible/nearshore structure.

---

## 11. Species-season profiles

Water Reader needs simple, configurable species-season profiles by species × region × month × lake/pond.

### 11.1 Profile schema

```ts
export type SpeciesSeasonWaterProfile = {
  species: "largemouth_bass" | "smallmouth_bass" | "pike" | "trout";
  region: string;
  month: number;
  waterType: "lake_pond";
  seasonalStage: string;
  preferredDepthBands: DepthBandPreference[];
  preferredStructureTypes: WeightedPreference[];
  preferredCoverTypes: WeightedPreference[];
  shorelineBias: number; // 0-1
  offshoreBias: number; // 0-1
  vegetationImportance: number; // 0-1
  rockImportance: number; // 0-1
  shadeImportance: number; // 0-1
  windImportance: number; // 0-1
  fallbackStructures: string[];
  avoidOrDownrank: string[];
};
```

### 11.2 Largemouth bass examples

Spring:

- protected bays
- shallow flats
- warming banks
- vegetation/pads if present
- docks/wood
- pockets near deeper water

Summer:

- vegetation edges
- docks/shade
- deeper weedlines
- points with cover
- low-light shallow windows
- heat/high-sun fallback to shade/deeper edges

Fall:

- baitfish-related banks
- wind-blown points
- remaining green vegetation
- flats near channels/depth

Winter/cold-water regions:

- deeper edges
- slow presentations
- sun-warmed banks only during favorable windows

### 11.3 Smallmouth bass examples

Spring:

- rock/gravel flats
- points near spawning pockets
- sand-to-rock transitions
- first break near shallow flats
- wind-blown rocky banks

Summer:

- offshore humps
- rock piles
- main-lake points
- deep weed edges if relevant
- flats adjacent to deeper water

Fall:

- baitfish flats
- wind-blown rock
- main-lake points
- mid-depth breaks

Cold periods:

- deeper holes/basin edges
- slow bottom-oriented zones

### 11.4 Pike examples

Spring:

- shallow weedy bays
- protected warming flats
- inlets/outlets
- ambush lanes near vegetation

Summer:

- weed edges
- deeper weedlines
- cooler water near inlets
- points adjacent to vegetation

Fall:

- baitfish movement routes
- weed edges
- points and saddles near feeding flats

### 11.5 Trout examples

Spring/fall:

- inlets/outlets
- shallow feeding shelves near depth
- wind-blown shorelines if oxygen/food benefit

Summer:

- deeper/cooler basin areas
- steep breaks
- thermally suitable depth bands if available
- inlets/oxygenated water

Winter/cold periods:

- stable depth zones
- basin edges
- slow presentations

---

## 12. Daily conditions integration

Water Reader should use existing How's Fishing output as modifiers.

### 12.1 Required daily context

```ts
export type WaterReaderDailyContext = {
  dailyScore?: number;
  ratingLabel?: string;
  bestTimeWindow?: string;
  topFactors: string[];
  limitingFactors: string[];
  windMean5am9pm?: number;
  windDirection?: number;
  pressureRegime?: "supportive" | "neutral" | "suppressive" | "highly_suppressive";
  lightRegime?: "low_light" | "mixed" | "bright" | "cloudy";
  precipRunoffRegime?: string;
  temperatureTrendRegime?: string;
  confidence?: "high" | "medium" | "low";
};
```

### 12.2 Daily modifiers

Examples:

- Wind above 12 mph:
  - boost wind-blown points/banks
  - boost baitfish-oriented shorelines
  - boost spinnerbait/bladed jig/swimbait-compatible zones
- Calm + low light:
  - boost topwater banks, pads, shallow flats, protected pockets
- Bright sun:
  - boost shade, docks, vegetation edges, deeper breaks
- High pressure/cold front:
  - boost first breaks, deeper edges, slow zones
  - downrank shallow roaming zones unless seasonal/warming context supports them
- Warming trend in spring:
  - boost protected shallow flats and north/west-facing warming banks
- Heat/extreme summer:
  - boost shade, deeper weedlines, basin-adjacent zones, evening/night windows
- Recent rain/runoff:
  - boost inlets/outlets only if lake/pond context supports it
  - avoid overclaiming in ponds without true inflow/outflow data

---

## 13. Lure/Fly Recommender integration

Water Reader should not duplicate the full lure/fly engine. It should request or import structured lure/fly context.

### 13.1 Required recommender context

```ts
export type WaterReaderThrowRecommendation = {
  category: "lure" | "fly";
  name: string;
  archetype: string;
  reason: string;
  bestZoneTypes: string[];
  column: "top" | "upper" | "middle" | "bottom" | "variable";
  pace: "slow" | "moderate" | "fast" | "variable";
};
```

### 13.2 Zone-to-presentation examples

- Weed edge + LMB + summer:
  - spinnerbait, chatterbait, swim jig, frog/topwater in low light, baitfish streamer
- Rock/gravel point + SMB + spring:
  - craw, clouser, ned-style profile, small swimbait, crayfish fly
- Deep break + cold front:
  - slower bottom-oriented options, jig/craw, leech/sculpin style fly
- Wind-blown shoreline:
  - spinnerbait, swimbait, bladed jig, streamer
- Calm low light:
  - topwater, popper, gurgler, frog, subtle wake profile

---

## 14. Zone scoring engine

### 14.1 Score formula

Recommended V1 formula:

```ts
zoneScore =
  structureScore * 0.30 +
  speciesMonthScore * 0.25 +
  dailyConditionsScore * 0.20 +
  accessModeScore * 0.15 +
  dataConfidenceScore * 0.10;
```

Each subscore is 0-100.

### 14.2 Structure score

With depth data, score:

- break quality
- flat-to-depth proximity
- point quality
- hump/saddle quality
- basin edge proximity
- vegetation/depth overlap
- depth band fit
- transition quality

With aerial only, score:

- shoreline complexity
- visible vegetation
- points/coves
- dock/wood presence if detected
- inlets/outlets
- visible shallow transitions
- wind exposure/protection

### 14.3 Species/month score

Use species-season profiles.

Examples:

- SMB in spring: boost rock/gravel flats, points near shallow bays, first breaks.
- LMB in summer: boost weeds, shade, docks, deeper weedlines.
- Pike in spring: boost shallow weedy bays.
- Trout in summer: boost deeper/cooler refuge zones if bathymetry exists.

### 14.4 Daily conditions score

Use How's Fishing variables.

Examples:

- Windy: boost wind-blown structure.
- Bright/high pressure: boost shade/deeper/edge zones.
- Calm/low light: boost shallow/topwater zones.
- Warming spring trend: boost protected warming flats.

### 14.5 Access mode score

Shore mode:

- high score for shoreline/nearshore zones
- high score for features within casting buffer
- penalize offshore-only features
- no public-access verification

Boat mode:

- allow full lake
- high score for best total structure, including offshore
- do not require shore proximity

### 14.6 Data confidence score

Suggested values:

| Data condition | Score |
|---|---:|
| Bathymetric DEM + aerial + good lake polygon | 95 |
| Vector contours + aerial | 90 |
| Vector contours only | 80 |
| Public PDF chart, clean | 65 |
| Aerial only with good imagery | 60 |
| Polygon only | 35 |
| User upload high quality and lake-aligned | 60 |
| User upload low quality/unmatched | 30 |

### 14.7 Hard caps and penalties

Use caps to prevent bad recommendations.

Examples:

```ts
if (accessMode === "shore" && zone.distanceFromShoreFt > shoreCastBufferFt) {
  zoneScore = Math.min(zoneScore, 45);
}

if (dataTier === "aerial_only" && zone.zoneType in ["hump", "saddle", "deep_break"]) {
  zoneScore = Math.min(zoneScore, 40);
}

if (species === "trout" && noDepthOrThermalDataAvailable) {
  confidence = downshift(confidence);
}

if (sourceRights.reviewStatus !== "allowed") {
  blockReusableCaching();
}
```

### 14.8 Number of zones returned

Return 3-5 zones.

Default:

- 3 primary zones
- up to 2 secondary zones if clearly useful

Avoid clutter. Flagship quality is more important than quantity.

---

## 15. Rendering architecture

### 15.1 Renderer responsibility

The renderer takes structured geometry and draws the map.

Input:

- base image/map
- lake polygon
- selected zone GeoJSON
- labels A/B/C/D/E
- overlay styles
- attribution/source text

Output:

- final PNG/JPEG for app display
- optional SVG or GeoJSON overlay for debugging/history

### 15.2 Rendering options

Possible rendering approaches:

1. **Custom server-side renderer**
   - Best control.
   - Use GDAL/Rasterio/Python or Node canvas/SVG.
   - Good for NAIP/public imagery and custom overlays.

2. **Mapbox Static Images API**
   - Supports GeoJSON overlay use cases.
   - Must follow Mapbox terms/attribution/caching requirements.
   - Mapbox docs show GeoJSON overlays and marker/path support. Source: https://docs.mapbox.com/api/maps/static-images/

3. **MapLibre client/server rendering**
   - Good if you host tiles or render from open sources.

Recommendation:

- V1 should start with the simplest reliable renderer.
- Long-term, use a custom renderer for maximum control and legal clarity.

### 15.3 Visual style

Map output should feel premium, clear, and app-ready.

Style principles:

- Clean soft overlay, not cluttered.
- 3-5 numbered zones.
- Subtle translucent polygons/lines.
- Clear callout labels.
- Simple legend cards.
- Source/data badge.
- Shore/boat badge.
- Confidence badge.
- Avoid tactical military/GIS look.
- Avoid too many technical contour labels on final view.

---

## 16. AI/LLM narration rules

The LLM receives only structured report data.

### 16.1 LLM may do

- Write a 1-2 sentence summary.
- Explain each zone in plain fishing language.
- Explain timing.
- Explain what to throw and why.
- Mention limitations/confidence.
- Make the report sound premium and useful.

### 16.2 LLM must not do

- Invent zones.
- Invent structure not present in engine output.
- Claim fish are definitely present.
- Claim private/legal access.
- Mention depth if depth data was not available.
- Overstate confidence on aerial-only or low-quality upload reports.
- Recommend river/current logic in V1.

### 16.3 Narration style

Preferred language:

- `highest-probability zone`
- `good place to start`
- `likely to concentrate fish`
- `worth checking first`
- `best visible structure`
- `based on available map data`

Avoid:

- `fish are here`
- `guaranteed`
- `always`
- `secret spot`
- `private access`

---

## 17. Caching strategy

### 17.1 Cache long-term

Cache these:

- national waterbody index
- lake polygons
- source registry
- rights decisions
- normalized public/open bathymetry when allowed
- extracted lake features
- candidate zones
- species/month base scoring layers
- generated user reports if product wants history

### 17.2 Generate on demand

Generate these per request:

- daily adjusted zone ranking
- final map render
- LLM legend
- weather/date-specific explanation

### 17.3 Do not cache/reuse globally

Do not globally cache/reuse:

- Google Maps imagery/content
- proprietary chart screenshots
- user-uploaded third-party chart content
- unreviewed source-derived features

---

## 18. Confidence system

Every report should have a confidence level.

### 18.1 Confidence inputs

- source quality
- bathymetry availability
- aerial quality
- lake polygon quality
- image/upload quality
- feature extraction confidence
- species fit confidence
- daily condition confidence

### 18.2 User-facing examples

High confidence:

> Depth contours and aerial structure were both available for this lake, so FinFindr could evaluate underwater structure and visible shoreline cover.

Medium confidence:

> This report is based mainly on aerial shoreline structure. It is useful for visible cover and bank features, but it cannot confirm offshore depth changes.

Low confidence:

> Limited map data was available. FinFindr is using lake shape, shoreline geometry, and seasonal context only.

---

## 19. Error and fallback behavior

### 19.1 If no lake found

Show:

- search suggestions
- state filter
- upload option
- manual lake request option for future indexing

### 19.2 If lake polygon exists but no aerial/depth

Use polygon-only limited mode.

Return:

- shoreline geometry-based zones
- low confidence
- upload recommendation

### 19.3 If depth ingestion fails

Fallback to aerial mode.

### 19.4 If aerial fetch fails

Fallback to depth-only if available.

### 19.5 If upload processing fails

Show:

- ask user to crop/rotate/reupload
- state that image could not be confidently aligned

---

## 20. Testing requirements

### 20.1 Golden scenarios

Create golden tests for:

1. LMB, summer, boat mode, lake with depth + aerial.
2. LMB, summer, shore mode, aerial-only pond.
3. SMB, late spring, boat mode, depth lake.
4. SMB, late spring, shore mode, shoreline/rocky lake.
5. Pike, spring, aerial lake with visible vegetation.
6. Trout, summer, depth lake.
7. Aerial-only lake should not recommend offshore humps.
8. Shore mode should not return offshore-only zones.
9. Boat mode may return offshore zones.
10. Google source must never be used for extraction/caching.
11. User upload must not enrich global candidate zones.
12. Low data must downshift confidence.

### 20.2 Engine invariants

Tests must enforce:

- Every report has 3-5 zones unless data is too weak.
- Every zone has a reason.
- Every zone has confidence.
- Every zone has geometry.
- Every report has source attribution.
- No unsupported zone types appear for data tier.
- AI narration cannot introduce structures absent from structured data.

---

## 21. Final V1 target experience

The finished V1 should feel like this:

> Search lake → choose species → choose shore/boat → generate report → receive a beautiful marked-up map with 3-5 numbered zones, a clear legend, confidence/data badge, best time window, and what to throw.

The flagship value is not simply a marked image.

The flagship value is:

**FinFindr combines lake structure, season, species, daily conditions, and presentation logic into a simple fishing map that tells the user where to start and why.**

---

## 22. Architecture mantra

Repeat this whenever implementation choices get messy:

> **The deterministic engine decides. AI explains. The renderer draws. Data rights control what can be used and cached.**
