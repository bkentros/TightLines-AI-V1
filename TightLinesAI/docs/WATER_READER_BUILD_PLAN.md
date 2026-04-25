# FinFindr Water Reader — Agent Build Plan

**Status:** Superseded by `WATER_READER_MASTER_PLAN.md`.

**Use instead:** `WATER_READER_MASTER_PLAN.md` is now the single active Water Reader source of truth. This file is retained only for archive/reference context and should not be treated as the active implementation plan.

**Document purpose:** Define the exact order an AI coding agent should follow to build Water Reader without creating a messy, over-engineered, legally risky, or half-integrated feature.

**Archived companion file:** `WATER_READER_ARCHITECTURE.md`

**Audience:** AI coding agents, product owner, future developers.

**Core rule:** Do not start with AI image analysis. Start with the national lake/pond index, source registry, deterministic engine, and renderer pipeline.

---

## 0. Build strategy summary

Water Reader should be built in layers:

```txt
National lake/pond index
→ source registry
→ data adapters
→ feature extraction
→ deterministic zone engine
→ map renderer
→ AI-written legend
→ UI/report experience
→ upload mode
→ depth expansion
```

The goal is national lake/pond availability with data-tiered intelligence:

- Full depth + aerial where available.
- Aerial/shoreline intelligence where depth is not available.
- Limited polygon-only fallback where imagery/depth is weak.
- Private upload mode as a fallback/power-user path.

---

## 1. How agents must use this plan

Agents must work in passes.

Each pass must:

1. Read `WATER_READER_ARCHITECTURE.md` first.
2. Identify existing app files before editing.
3. Make the smallest coherent implementation for the current phase.
4. Add tests/fixtures where possible.
5. Report what was built, what was skipped, and what remains.
6. Not jump ahead to future phases unless explicitly instructed.

Do not allow the agent to build everything at once.

---

## 2. Current app assumptions

Assume FinFindr already has:

- Expo / React Native frontend.
- Supabase backend.
- Supabase Edge Functions.
- Existing How's Fishing Right Now engine.
- Existing Lure/Fly Recommender engine.
- Existing location/date/month/region logic.
- Existing species support:
  - LMB
  - SMB
  - Pike
  - Trout
- Existing water type support in other features, but Water Reader V1 is lake/pond only.

The agent must verify these assumptions during Pass 0.

---

## 3. Critical implementation boundaries

### 3.1 Do not do these unless explicitly approved

- Do not use Google satellite imagery for analysis or cached derived features.
- Do not scrape Garmin/Navionics.
- Do not train/fine-tune AI models on user-uploaded map/chart screenshots.
- Do not build river support.
- Do not build saltwater support.
- Do not verify public/private shoreline access in V1.
- Do not let an LLM choose/draw fishing zones.
- Do not create 12 static final map renders per lake as the core cache.
- Do not make Water Reader depend on perfect depth coverage.

### 3.2 Must do

- Build a source-rights system.
- Build data tiers.
- Build deterministic zone scoring.
- Build shore/boat mode.
- Use lake/pond only.
- Make reports confidence-aware.
- Keep user upload private and one-time by default.
- Use structured geometry for overlays.
- Use AI only for narration/legend.

---

## 4. Recommended build phases

## Phase 0 — Codebase audit and integration map

### Goal

Understand the current app and create a precise integration plan before modifying major code.

### Tasks

The agent should inspect:

- Supabase functions.
- Existing How's Fishing engine files.
- Existing Lure/Fly Recommender files.
- Existing shared types.
- Existing location/date/region utilities.
- Existing storage setup.
- Existing UI navigation.
- Existing report card design patterns.
- Existing API call patterns.
- Existing test setup.

### Required output

Agent should produce an audit note with:

```txt
1. Existing reusable modules
2. Existing engine outputs available to Water Reader
3. Required new tables/migrations
4. Required new Edge Functions
5. Required frontend screens/components
6. Risks or blockers
7. Proposed file paths
```

### Acceptance criteria

- No major Water Reader implementation yet.
- Agent identifies exact files to reuse.
- Agent identifies where Water Reader should live in the repo.

### Do not proceed until

- Product owner understands where Water Reader will be integrated.

---

## Phase 1 — Core types, constants, and feature flags

### Goal

Create the Water Reader type system and feature boundary before database or UI work.

### Tasks

Create shared types:

```txt
supabase/functions/_shared/waterReader/types.ts
supabase/functions/_shared/waterReader/dataTiers.ts
supabase/functions/_shared/waterReader/sourceRights.ts
supabase/functions/_shared/waterReader/constants.ts
```

Required types:

- `WaterReaderInput`
- `WaterReaderReport`
- `WaterReaderZone`
- `WaterReaderDataTier`
- `SourceRegistryRecord`
- `SourceRights`
- `WaterbodySummary`
- `AccessMode`
- `WaterReaderSpecies`

Required constants:

```ts
SUPPORTED_SPECIES = ["largemouth_bass", "smallmouth_bass", "pike", "trout"];
SUPPORTED_ACCESS_MODES = ["shore", "boat"];
SUPPORTED_WATER_READER_WATER_TYPES = ["lake_pond"];
DEFAULT_ZONE_COUNT = 3;
MAX_ZONE_COUNT = 5;
```

### Acceptance criteria

- Types compile.
- No UI/API implementation yet.
- No river/coastal types are included in V1 Water Reader public input.

---

## Phase 2 — Supabase/PostGIS schema

### Goal

Create the database foundation.

### Tasks

Create migration for:

- PostGIS extension if not already enabled.
- `waterbody_index`
- `waterbody_aliases`
- `source_registry`
- `waterbody_assets`
- `waterbody_features`
- `water_reader_candidate_zones`
- `water_reader_reports`
- `water_reader_uploads`

Use the schema from `WATER_READER_ARCHITECTURE.md` as the starting point.

### Tests/checks

- Migration runs locally.
- Tables exist.
- PostGIS indexes exist.
- Basic insert/select works.
- RLS policies are intentionally defined or intentionally deferred with admin-only access.

### Acceptance criteria

- Schema exists and is documented.
- No public endpoint exposes unprotected admin ingestion.
- Report records can be stored.

### Do not proceed until

- Tables are created successfully.

---

## Phase 3 — National lake/pond index foundation

### Goal

Make Water Reader nationally searchable before advanced intelligence exists.

### Strategy

Use USGS 3DHP / legacy NHD/NHDPlus hydrography products as the national lake/pond geometry foundation.

Important source notes:

- NHD includes lakes and ponds, but was retired as of October 1, 2023.
- 3DHP is the newer/current direction.
- Legacy products remain available as downloads/services.

Official sources:

- https://www.usgs.gov/national-hydrography/national-hydrography-dataset
- https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products

### Tasks

Build ingestion tooling that can:

1. Download/import a national or state-level hydrography dataset.
2. Filter to lakes/ponds/reservoirs.
3. Exclude rivers/streams/canals for Water Reader V1.
4. Normalize names.
5. Store polygons/centroids.
6. Add state/county where available.
7. Estimate acreage if absent.
8. Assign region using existing FinFindr state/region mapping.
9. Default every lake to `polygon_only` until enriched.

### Recommended files

```txt
supabase/functions/_shared/waterReader/indexing/buildWaterbodyIndex.ts
supabase/functions/_shared/waterReader/indexing/normalizeWaterbodyName.ts
supabase/functions/_shared/waterReader/indexing/assignWaterReaderRegion.ts
supabase/functions/_shared/waterReader/indexing/filterLakePondFeatures.ts
scripts/waterReader/importWaterbodies.ts
```

### Search endpoint

Create `waterbody-search` Edge Function.

Input:

```ts
{
  query: string;
  state?: string;
  limit?: number;
}
```

Output:

```ts
{
  results: WaterbodySearchResult[];
}
```

Result fields:

```ts
{
  lakeId: string;
  name: string;
  state: string;
  county?: string;
  waterbodyType: "lake" | "pond" | "reservoir";
  surfaceAreaAcres?: number;
  dataTier: string;
  hasDepth: boolean;
  hasAerial: boolean;
  confidence: "high" | "medium" | "low";
}
```

### Acceptance criteria

- User can search lake/pond names nationwide or in a large imported test region.
- Search returns data tier and source availability.
- Rivers do not appear in Water Reader search.
- Duplicate names are disambiguated by state/county.

### Do not proceed until

- Search works on a meaningful test dataset.

---

## Phase 4 — Source registry and rights system

### Goal

Create a scalable way to track all imagery/depth providers without hardcoding random URLs.

### Tasks

Create source registry helpers:

```txt
supabase/functions/_shared/waterReader/sources/sourceRegistry.ts
supabase/functions/_shared/waterReader/sources/sourceRights.ts
supabase/functions/_shared/waterReader/sources/sourceStatus.ts
```

Build admin utilities to add/update sources.

Required source types:

- `national_hydrography`
- `aerial_imagery`
- `bathymetry_vector`
- `bathymetry_dem`
- `bathymetry_pdf`
- `bathymetry_image`
- `aquatic_vegetation`
- `fish_survey`
- `user_upload`

Required formats:

- `arcgis_feature_server`
- `arcgis_map_server`
- `arcgis_image_server`
- `geojson`
- `shapefile`
- `file_geodatabase`
- `geopackage`
- `raster_dem`
- `cog`
- `pdf`
- `image`
- `html`

### Initial seed sources

Seed at minimum:

1. USGS/3DHP/NHD national waterbody source.
2. NAIP aerial imagery source.
3. Michigan inland lake contours source.
4. Minnesota bathymetry source.

These are not the only states for launch; they are initial adapter test fixtures.

### Acceptance criteria

- Source registry can store source rights.
- Each source has `can_store_derived_features` and related fields.
- Restricted/blocked sources cannot be used for cached derived features.
- Google is either absent or marked display-only / blocked for analysis.

---

## Phase 5 — Provider adapter framework

### Goal

Create a clean adapter system before building specific source integrations.

### Tasks

Create adapter interface:

```txt
supabase/functions/_shared/waterReader/adapters/WaterReaderSourceAdapter.ts
```

Create scaffolds:

```txt
naipAerialAdapter.ts
arcgisFeatureServerAdapter.ts
geoJsonAdapter.ts
shapefileAdapter.ts
pdfChartAdapter.ts
userUploadAdapter.ts
```

### Required adapter methods

```ts
interface WaterReaderSourceAdapter {
  adapterName: string;
  sourceType: string;
  validateSource(source): SourceRightsDecision;
  discoverAssets?(input): Promise<DiscoveredAsset[]>;
  fetchAsset(asset): Promise<FetchedAsset>;
  normalizeAsset(asset): Promise<NormalizedAsset>;
  extractFeatures(asset, waterbody): Promise<WaterbodyFeature[]>;
}
```

### Acceptance criteria

- Adapters compile.
- Mock adapter can fetch/normalize/extract a sample fixture.
- Rights validation is called before storage/extraction.

---

## Phase 6 — Aerial/shoreline fallback pipeline

### Goal

Give Water Reader broad nationwide value even where no depth chart exists.

### Why this phase is early

Depth coverage is uneven. Aerial/shoreline intelligence is the national fallback that makes Water Reader usable for most lakes/ponds.

### Data source

Prefer NAIP/public aerial imagery.

Official source:

- https://www.usgs.gov/centers/eros/science/usgs-eros-archive-aerial-photography-national-agriculture-imagery-program-naip

### Tasks

Build:

```txt
supabase/functions/_shared/waterReader/extraction/shorelineFeatures.ts
supabase/functions/_shared/waterReader/extraction/aerialFeatures.ts
supabase/functions/_shared/waterReader/extraction/nearshoreZones.ts
```

Minimum V1 feature extraction:

- lake boundary from polygon
- shoreline segments
- shoreline curvature
- shoreline points
- coves/pockets
- nearshore/castable water buffer
- wind-blown shoreline calculation using wind direction if available
- protected shoreline calculation
- visible vegetation if NAIP/NIR path is available

Optional if feasible:

- color clustering for shallow/vegetation/sand transitions
- dock clusters
- lily pads/emergent vegetation
- shade lines

### Shore mode behavior

- Evaluate entire shoreline.
- Identify best castable shoreline/nearshore zones.
- Do not verify legal access.
- Include `Access not verified` note.

### Boat mode behavior with aerial only

- Still generate a report.
- Favor visible structure and shoreline/nearshore features.
- Downshift confidence because offshore depth is unknown.

### Acceptance criteria

- A lake with only polygon + aerial can produce 3 zones.
- Shore mode zones are near shoreline.
- Boat mode does not invent offshore humps without bathymetry.
- Report is medium/low confidence if aerial-only.

---

## Phase 7 — Deterministic Water Reader engine V1

### Goal

Score candidate zones using species, month, region, access mode, daily conditions, and data confidence.

### Tasks

Create:

```txt
supabase/functions/_shared/waterReader/engine/waterReaderEngine.ts
supabase/functions/_shared/waterReader/engine/zoneScoring.ts
supabase/functions/_shared/waterReader/engine/speciesSeasonProfiles.ts
supabase/functions/_shared/waterReader/engine/accessModeScoring.ts
supabase/functions/_shared/waterReader/engine/confidenceScoring.ts
supabase/functions/_shared/waterReader/engine/selectFinalZones.ts
```

### Formula

Use:

```ts
zoneScore =
  structureScore * 0.30 +
  speciesMonthScore * 0.25 +
  dailyConditionsScore * 0.20 +
  accessModeScore * 0.15 +
  dataConfidenceScore * 0.10;
```

### Required hard caps

Implement hard caps:

- Shore mode cannot strongly recommend offshore-only zones.
- Aerial-only mode cannot recommend humps/saddles/deep breaks unless derived from actual depth data.
- Polygon-only reports must be low confidence.
- Trout reports without depth/thermal context must be downshifted.
- User-upload reports must be private and confidence-aware.

### Required outputs

Engine must return:

- 3-5 ranked zones
- score per zone
- confidence per zone
- reason strings per zone
- data limitation strings where needed
- source attribution list

### Acceptance criteria

- Engine produces deterministic repeatable results for same inputs.
- No LLM is required to choose zones.
- All output is structured JSON.
- Golden tests pass.

---

## Phase 8 — Bridge existing How's Fishing engine

### Goal

Make Water Reader respond to daily conditions.

### Tasks

Create:

```txt
supabase/functions/_shared/waterReader/engine/dailyConditionsBridge.ts
```

This bridge should call or import the existing How's Fishing logic and normalize output into:

```ts
WaterReaderDailyContext
```

Required fields:

- daily score
- rating label
- best time window
- top factors
- limiting factors
- wind mean 5am-9pm
- wind direction if available
- pressure regime
- light regime
- precip/runoff regime
- temperature trend regime
- confidence

### Daily scoring effects

Implement at least:

- wind > 12 mph boosts wind-blown banks/points
- calm + low light boosts shallow/topwater shoreline zones
- bright sun boosts shade/deeper edges
- high pressure/cold front boosts first breaks/deeper edges
- spring warming trend boosts protected shallow flats
- summer heat boosts shade/deeper/vegetation edges

### Acceptance criteria

- Water Reader changes zone ranking when daily conditions change.
- Top/limiting factors appear in report context.
- Best time window is available to narration.

---

## Phase 9 — Bridge existing Lure/Fly Recommender

### Goal

Water Reader should tell users what to throw in the selected zones.

### Tasks

Create:

```txt
supabase/functions/_shared/waterReader/engine/lureFlyBridge.ts
```

The bridge should reuse existing recommender output or logic, then map recommendations to zone types.

Required output:

- 3 lures
- 3 flies
- reason for each
- zone fit tags
- column/pace when available

### Acceptance criteria

- Report includes what-to-throw section.
- Recommendations match species/month/water clarity/daily conditions.
- Zone explanations can mention relevant lures/flies.

---

## Phase 10 — Map renderer V1

### Goal

Render a beautiful marked-up map from structured engine output.

### Important rule

The renderer draws engine-chosen geometry. AI does not draw spots.

### Tasks

Create:

```txt
supabase/functions/_shared/waterReader/rendering/renderWaterReaderMap.ts
supabase/functions/_shared/waterReader/rendering/overlayStyles.ts
supabase/functions/_shared/waterReader/rendering/geoJsonToSvg.ts
```

Minimum V1 renderer:

- base lake image/map
- lake boundary
- selected zones A/B/C/D/E
- translucent polygons/lines
- numbered markers
- title/badges optional
- source attribution
- output PNG/JPEG path

### Rendering options

Choose one for V1:

1. Custom server-side renderer using public imagery and SVG/canvas composition.
2. Mapbox Static Images API with GeoJSON overlays, if terms/caching are acceptable.
3. MapLibre/custom tile renderer.

Mapbox docs support GeoJSON overlay usage in static images: https://docs.mapbox.com/api/maps/static-images/

### Visual acceptance criteria

- Map is clean and not cluttered.
- Zones are obvious.
- Legend references match map markers.
- Attribution is present.
- Data tier badge is visible somewhere in report UI, if not directly on map.

---

## Phase 11 — LLM narration / legend builder

### Goal

Generate premium, clear explanations from structured engine output.

### Tasks

Create:

```txt
supabase/functions/_shared/waterReader/narration/buildNarrationPayload.ts
supabase/functions/_shared/waterReader/narration/waterReaderNarrationPrompt.ts
supabase/functions/_shared/waterReader/narration/validateNarration.ts
```

### Prompt requirements

The prompt must tell the LLM:

- Do not invent map features.
- Do not invent depth if depth unavailable.
- Do not claim fish are guaranteed.
- Do not claim legal/public access.
- Use concise fishing language.
- Mention confidence/data limitations.
- Use only supplied zones/reasons.

### Output format

LLM should return structured JSON, not freeform only:

```ts
{
  summary: string;
  zoneLegend: {
    zoneId: string;
    title: string;
    whyItMatters: string;
    howToFishIt: string;
    bestWindow?: string;
  }[];
  confidenceNote: string;
  accessNote?: string;
}
```

### Validation

Validate that:

- All zone IDs exist.
- No unsupported structures are mentioned.
- No forbidden phrases like `guaranteed` are used.
- Access note is present for shore mode.

---

## Phase 12 — Water Reader API endpoint

### Goal

Create the main report-generation endpoint.

### Endpoint

```txt
supabase/functions/water-reader/index.ts
```

### Input

```ts
WaterReaderInput
```

### Flow

```txt
validate input
→ fetch waterbody
→ resolve data tier
→ fetch/generate candidate zones
→ get daily conditions
→ get lure/fly context
→ score zones
→ select final zones
→ render map
→ generate narration
→ save report
→ return report
```

### Acceptance criteria

- Endpoint returns full report JSON.
- Handles aerial-only lake.
- Handles polygon-only lake.
- Handles depth lake if fixture exists.
- Stores report in `water_reader_reports`.
- Does not call unsupported Google analysis.

---

## Phase 13 — Frontend V1 screens

### Goal

Create the user-facing Water Reader flow.

### Screens/components

Recommended:

```txt
WaterReaderHomeScreen
WaterbodySearchScreen
WaterReaderSetupScreen
WaterReaderLoadingScreen
WaterReaderReportScreen
WaterReaderMapView
WaterReaderLegendCards
WaterReaderDataBadge
WaterReaderModeToggle
WaterReaderSpeciesSelector
```

### User flow

1. Open Water Reader.
2. Search/select lake.
3. See data availability.
4. Select species.
5. Select Shore or Boat.
6. Generate report.
7. View marked map and legend.

### UX requirements

- Soft/minimal FinFindr style.
- Clear badge for data tier.
- Clear `Shore` vs `Boat` toggle.
- Clear note for shore access not verified.
- Avoid dense GIS language.
- Map first, legend second.
- Save/share later optional.

### Acceptance criteria

- User can complete report generation end-to-end.
- Loading state explains what is happening.
- Errors are clear and non-technical.

---

## Phase 14 — Depth intelligence expansion

### Goal

Add high-value depth intelligence where machine-readable bathymetry exists.

### Build priority

Prioritize machine-readable data before PDFs.

Order:

1. ArcGIS FeatureServer / MapServer contours.
2. File geodatabase / shapefile / GeoJSON.
3. Bathymetric DEM.
4. PDFs/scanned charts later.

### Initial source examples for adapter testing

- Michigan inland lake contours: https://gis-michigan.opendata.arcgis.com/datasets/midnr::inland-lake-contours
- Minnesota bathymetric data: https://www.mngeo.state.mn.us/chouse/water_lakes.html

### Tasks

Build:

```txt
supabase/functions/_shared/waterReader/extraction/depthFeatures.ts
supabase/functions/_shared/waterReader/extraction/depthContoursToZones.ts
supabase/functions/_shared/waterReader/extraction/depthDemToZones.ts
```

Extract:

- flats
- breaks
- first breaks
- steep banks
- humps
- saddles
- basins
- basin edges
- shallow flats near depth
- offshore structure

### Acceptance criteria

- Depth lake produces richer boat-mode zones than aerial-only.
- Shore mode uses depth only within castable shoreline buffer.
- Aerial-only limitations no longer apply when depth exists.
- Confidence increases when depth + aerial both exist.

---

## Phase 15 — State-by-state source discovery pipeline

### Goal

Create the system to discover, classify, and ingest whatever is actually available per state.

### Important

This is not runtime user-search scraping. This is an admin/indexing pipeline.

### Tasks

Create:

```txt
scripts/waterReader/discoverStateSources.ts
scripts/waterReader/updateSourceRegistry.ts
WATER_READER_SOURCE_REGISTRY.md // optional generated/manual tracking file
```

### Discovery targets

For each state, search/inspect:

- State GIS portal.
- State DNR/fish/wildlife lake maps.
- ArcGIS Hub.
- Data.gov.
- University/public lake map repositories.
- County GIS only if valuable.

### Source classification

For each discovered source, classify:

- provider
- state
- source type
- endpoint URL
- format
- license/terms
- can fetch
- can store original
- can store derived features
- can cache render
- attribution requirement
- adapter needed
- priority
- status

### Required statuses

```txt
candidate
needs_legal_review
adapter_needed
ready_for_ingestion
ingested
blocked
deprecated
```

### Acceptance criteria

- Source registry can track all 50 states.
- Missing depth data does not block aerial reports.
- Sources with unclear terms are not used for cached derived features.

---

## Phase 16 — User upload mode

### Goal

Allow users to upload a satellite/aerial screenshot or depth chart screenshot for private one-time analysis.

### Build timing

Build after named-lake flow works.

### Required V1 rules

- User should select a lake first.
- Upload is private to user/report.
- Do not enrich global lake index.
- Do not train/fine-tune models on uploads.
- Do not promise full contour extraction.
- Confidence depends on image quality.

### Tasks

Create:

```txt
supabase/functions/water-reader-upload/index.ts
supabase/functions/_shared/waterReader/adapters/userUploadAdapter.ts
supabase/functions/_shared/waterReader/upload/validateUpload.ts
supabase/functions/_shared/waterReader/upload/alignUploadToLake.ts
supabase/functions/_shared/waterReader/upload/extractUploadFeatures.ts
```

### Upload V1 feature extraction

For aerial/satellite screenshot:

- detect visible shoreline/cover if possible
- require/confirm lake match if possible
- generate visible-structure zones

For depth chart screenshot:

- treat as chart scan
- identify obvious points/flats/breaks if visible
- use OCR/contour extraction only if reliable
- otherwise downshift confidence

### Acceptance criteria

- User can upload image and receive report.
- Report is marked `Upload Scan`.
- Report confidence reflects image quality.
- Uploaded image does not become global index data.

---

## Phase 17 — Testing and QA

### Required test categories

1. Type tests / compile checks.
2. Database migration tests.
3. Source rights tests.
4. Waterbody search tests.
5. Feature extraction fixture tests.
6. Zone scoring tests.
7. Shore vs boat mode tests.
8. Data-tier behavior tests.
9. LLM narration validation tests.
10. End-to-end report generation tests.

### Golden test scenarios

Create fixtures for:

#### Scenario 1 — LMB summer boat depth lake

Expected:

- vegetation/deep weedline/points rank high
- boat mode may include offshore/deeper zones
- confidence high if depth + aerial available

#### Scenario 2 — LMB summer shore aerial pond

Expected:

- shoreline vegetation/points/coves rank high
- no offshore humps
- confidence medium
- access note present

#### Scenario 3 — SMB late spring boat depth lake

Expected:

- gravel/rock flats, points, first breaks rank high
- depth-adjacent spawning/staging zones appear

#### Scenario 4 — SMB late spring shore mode

Expected:

- castable rocky shoreline/points rank high
- offshore-only structure capped

#### Scenario 5 — Pike spring aerial lake

Expected:

- shallow weedy bays and vegetation edges rank high

#### Scenario 6 — Trout summer depth lake

Expected:

- deeper/cooler basins/steep breaks rank high
- if no depth, confidence downshifted

#### Scenario 7 — Google source blocked

Expected:

- source rights prevent use for extraction/caching

#### Scenario 8 — User upload private

Expected:

- uploaded features not stored in global candidate zone table

### Acceptance criteria

- Tests cover data-tier differences.
- Shore/boat differences are obvious in snapshots.
- No unsupported structures appear in narration.

---

## 5. State-by-state index philosophy

This feature should feel national from launch, but honest.

### Correct mindset

Do:

- Build national lake/pond index first.
- Make every lake searchable if data exists in national hydrography.
- Give every lake a best-available Water Reader report.
- Enrich depth state by state.
- Display data tier honestly.

Do not:

- Wait for perfect state depth coverage.
- Pretend aerial-only reports have depth knowledge.
- Scrape random PDFs live during user requests.
- Mix unreviewed data into cached intelligence.

### Source discovery order

For each state:

1. Check if state has official bathymetry GIS layers.
2. Check if state has official lake map PDFs.
3. Check if state has aquatic vegetation layers.
4. Check if state has fish survey/species data.
5. Check source rights.
6. Add to source registry.
7. Build adapter if high-value.
8. Ingest and match to `waterbody_index`.

---

## 6. Recommended agent prompt sequence

Use these as separate tasks, not one giant task.

### Prompt 1 — Audit only

```txt
You are reviewing my FinFindr codebase to prepare for the Water Reader feature. Read WATER_READER_ARCHITECTURE.md and WATER_READER_BUILD_PLAN.md. Do not implement the feature yet. Audit the existing app and produce a detailed integration map: existing files/modules to reuse, new files needed, database migrations needed, frontend screens needed, and risks/blockers. Do not edit code except for a short audit note if necessary.
```

### Prompt 2 — Types/schema foundation

```txt
Using WATER_READER_ARCHITECTURE.md and WATER_READER_BUILD_PLAN.md, implement only Phase 1 and Phase 2: shared Water Reader types/constants/source-rights helpers and Supabase/PostGIS database migrations. Do not build UI, image analysis, map rendering, or AI narration yet. Add compile checks and basic migration validation. Return a summary of files changed and any issues.
```

### Prompt 3 — Waterbody search/index

```txt
Implement Phase 3: the national lake/pond index foundation and waterbody search endpoint. Use a fixture/small imported hydrography sample first if full national import is too large for this pass. The endpoint must search lake/pond names, return state/county/data tier/availability, and exclude rivers/streams. Do not build Water Reader report generation yet.
```

### Prompt 4 — Source registry/adapters

```txt
Implement Phase 4 and Phase 5: source registry helpers, source-rights enforcement, and adapter scaffolds. Seed initial source records for USGS hydrography, NAIP, Michigan inland lake contours, and Minnesota bathymetry. Do not perform full state-by-state ingestion yet. Add tests proving blocked/restricted sources cannot be used for cached extraction.
```

### Prompt 5 — Aerial/shoreline MVP engine

```txt
Implement Phase 6 and Phase 7 for aerial/shoreline MVP. For lakes with polygon/aerial or fixture data, extract shoreline candidate zones, score them deterministically by species/month/access mode/data confidence, and return 3-5 ranked zones. Shore mode should evaluate nearshore/castable zones and must not verify public access. Boat mode can evaluate whole-lake visible structure but cannot invent offshore depth features without bathymetry.
```

### Prompt 6 — Daily/recommender integration

```txt
Implement Phase 8 and Phase 9: bridge Water Reader to the existing How's Fishing Right Now engine and Lure/Fly Recommender. Water Reader should use daily wind/light/pressure/temperature/rain context to adjust zone rankings and include what-to-throw recommendations for each report. Keep all outputs structured.
```

### Prompt 7 — Renderer/report endpoint

```txt
Implement Phase 10, Phase 11, and Phase 12: map renderer, narration payload/prompt/validation, and main water-reader report endpoint. The engine must output GeoJSON zones; the renderer draws the map; the LLM only writes the legend from structured data. Store reports in water_reader_reports.
```

### Prompt 8 — Frontend

```txt
Implement Phase 13: Water Reader frontend flow. User should search/select lake, choose species, choose shore/boat, generate report, and view marked map + legend + data/confidence badge. Match the existing FinFindr visual theme and avoid clutter.
```

### Prompt 9 — Depth intelligence

```txt
Implement Phase 14 using one or two machine-readable bathymetry fixture sources first. Extract depth features such as flats, first breaks, steep breaks, humps, saddles, basins, and basin edges. Update the Water Reader engine so depth lakes produce stronger boat-mode reports and depth-aware shore-mode reports.
```

### Prompt 10 — Upload mode

```txt
Implement Phase 16: private user upload mode. User must select a lake first, then upload a map/chart image. Process the upload for one-time report generation only. Do not add uploaded proprietary chart features to the global lake index. Include confidence limits and image-quality fallback behavior.
```

---

## 7. Definition of done for V1

Water Reader V1 is done when:

1. User can search a lake/pond.
2. User can select LMB/SMB/pike/trout.
3. User can select shore/boat mode.
4. App displays data tier before or during generation.
5. Backend generates 3-5 deterministic zones.
6. Shore mode focuses on shoreline/nearshore zones.
7. Boat mode can use full-lake zones.
8. Aerial-only reports do not invent underwater structure.
9. Depth reports use depth features when available.
10. Existing daily conditions modify zone rankings.
11. Existing lure/fly logic contributes what-to-throw recommendations.
12. Renderer creates a clean marked map.
13. LLM writes legend only from structured data.
14. Report includes confidence/source badges.
15. User upload mode, if included in V1, is private and confidence-aware.
16. Tests prove source rights, shore/boat behavior, data-tier behavior, and deterministic scoring.

---

## 8. Launch-quality checklist

Before release, verify:

- [ ] Google imagery is not used for analysis/cached derived features.
- [ ] NAIP/public imagery source is attributed correctly where required.
- [ ] Source registry has rights metadata.
- [ ] Every report has data tier.
- [ ] Every report has confidence.
- [ ] Every report has source attribution.
- [ ] Shore reports include access-not-verified note.
- [ ] Aerial-only reports do not mention offshore depth structure.
- [ ] Upload reports are not used to enrich global index.
- [ ] LLM output is validated against structured zone data.
- [ ] Report map looks premium and uncluttered.
- [ ] App handles lakes with duplicate names.
- [ ] App handles missing depth gracefully.
- [ ] App handles missing aerial gracefully.
- [ ] App can save or regenerate reports without breaking.

---

## 9. Product success criteria

The feature is successful if users feel:

1. `This app showed me where to start on a lake.`
2. `The map is simple and useful, not overwhelming.`
3. `The recommendations change based on species, season, conditions, and shore/boat mode.`
4. `Even when depth is unavailable, the aerial/shoreline scan still gives me useful starting points.`
5. `When depth is available, it feels premium and smarter than a normal fishing app.`

The flagship promise:

> **FinFindr turns lake structure, season, species, daily conditions, and presentation logic into a simple marked fishing map.**

---

## 10. Final instruction to agents

Do not make this an AI gimmick.

Build it as a deterministic fishing intelligence system.

The correct system is:

```txt
Lake/pond index
+ source registry
+ legal/public data
+ feature extraction
+ deterministic fishing logic
+ clean renderer
+ AI-written explanation
```

The wrong system is:

```txt
Random screenshot
+ AI guesses spots
+ no source rights
+ no repeatability
+ no confidence
```

When in doubt, follow the mantra:

> **The deterministic engine decides. AI explains. The renderer draws. Data rights control what can be used and cached.**
