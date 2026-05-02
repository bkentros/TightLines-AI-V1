# FinFindr Water Reader — Specification

## Overview

The Water Reader analyzes a lake polygon, identifies physical shoreline structures via geometric analysis, and places shoreline-hugging oval zones marking seasonally relevant structure areas for anglers. Inputs are pure geometry + calendar + state. Fully deterministic — no LLM calls, no CV, no satellite imagery, no depth data, no species selection, no bank/boat mode.

The product promise is controlled geometry, not certainty about fish presence. The engine must never imply that fish are guaranteed to be present, that a zone is the single best spot on the lake, or that depth/bathymetry was used. Seasonal/regional logic is allowed in v1, but it must be framed as deterministic seasonal structure guidance.

**Trust rule:** questionable geometry must fall to `limited`, `needs_review`, or fewer visible zones. The engine should prefer a sparse trustworthy read over a full map containing weak, floating, mislabeled, or crowded zones.

---

## Implementation Status — 2026-05-01

This section is the current handoff status. Future agents must treat checked items as implemented and verified in the local codebase, not merely planned. Unchecked items are still open.

### Implemented Core Files

- [x] New engine root: `lib/water-reader-engine/`
- [x] Foundation: `contracts.ts`, `ingest.ts`, `projection.ts`, `metrics.ts`, `shoreline.ts`, `seasons.ts`, `index.ts`
- [x] Feature detection: `features/types.ts`, `points.ts`, `coves.ts`, `necks.ts`, `islands.ts`, `dams.ts`, `conflicts.ts`, `validation.ts`, `index.ts`
- [x] Feature debug cues: `debug/cues.ts`
- [x] Zone placement: `zones/types.ts`, `priority.ts`, `invariants.ts`, `placement.ts`, `index.ts`
- [x] QA harnesses: `scripts/water-reader-engine-foundation-smoke.ts`, `scripts/water-reader-engine-feature-smoke.ts`, `scripts/water-reader-engine-feature-review.ts`, `scripts/water-reader-engine-zone-smoke.ts`, `scripts/water-reader-engine-zone-review.ts`

### Completed Chunks

- [x] **Chunk 1 — Foundation:** deterministic contracts, local meter projection/unprojection, projected polygon metrics, shoreline resampling/simplification/smoothing helpers, regional season lookup, and conservative GeoJSON ingest/preprocess foundation.
- [x] **Chunk 2 — Feature detection:** discriminated feature contracts, island detection from interior holes, point detection, cove chord-scan detection, neck/saddle width-field detection, conservative metadata-gated dam detection, conflict resolution, feature debug cues, and 9-lake feature review artifacts.
- [x] **Chunk 3A-3J — Zone placement core:** deterministic shoreline-hugging oval drafts, seasonal placement by feature class, strict placement invariants, selected-vs-suppressed feature diagnostics, filtered zone review artifacts, point-tip summer recovery, constriction shoulder recovery, zone-placement performance controls, winter cove/secondary-point transition placement, structure-confluence grouping for overlapping valid zones, island-edge zone recovery, and review-render padding fixes.

### Chunk 3 Acceptance — Completed 2026-05-01

Chunk 3 is accepted as the structural zone-placement baseline. Future agents should treat these checks as completed unless code changes invalidate them.

- [x] Ran and visually reviewed the 9-lake x 4-season zone matrix after the final Chunk 3 pass.
- [x] Confirmed no full-matrix row has zero zones, open-water blobs, zero-shoreline-contact zones, center-throat neck/saddle blobs, universal fallback zones, or visible-fraction violations.
- [x] Confirmed every detected selected physical feature has at least one standalone zone or participates in a `structure_confluence` group for every season.
- [x] Confirmed Higgins Lake's interior-ring island receives a valid island-edge zone in spring, summer, fall, and winter rather than being suppressed or represented by a broad open-water blob.
- [x] Re-checked visually dense rows, especially Mullett, Charlevoix, and rows with `zone_cap_exceeded_for_structure_coverage`. Dense confluence rows are structurally valid, but production rendering must polish them before user-facing integration.
- [x] Added/froze product-renderer requirements for confluence color, confluence legend entries, and visually polished merged areas before app integration.
- [x] Froze Chunk 3 acceptance commands and artifact paths for the next agents.

Final verified matrix state:

- 36/36 lake-season rows have visible zones.
- 0 zero-zone rows.
- 0 selected features without zones.
- 0 suppressed selected features.
- 0 universal fallback zones in primary review.
- 0 visible-fraction violations.
- Higgins island zoned in all four seasons.
- Torch winter cove-mouth zones visible and not cropped.
- Elk summer/winter neck confluence recovered with cove zones present.
- Glen neck shoulder zones remain visible with no center-throat zone.
- Charlevoix and Mullett remain dense in debug review, but valid overlap is assigned to confluence groups.

### Remaining Chunks

- [ ] **Chunk 4 — Legend and educational copy:** deterministic template table keyed by feature class, season, and placement variant; transition warnings; conservative language with no fish-presence or "best spot" claims.
- [ ] **Chunk 5 — Production renderer:** app-ready structured output and final SVG/React Native rendering with branded styling, zone numbering, legend block, and no debug-only cue clutter.
- [ ] **Chunk 6 — App integration:** wire the new engine into Water Reader UI/API flow while preserving search support chips, polygon retrieval, support statuses, and current app navigation.
- [ ] **Chunk 7 — 50-lake tuning loop:** expanded multi-region test set, agent + founder visual review, CSV/SVG/PNG/JSON artifacts, threshold tuning, and final v1 launch acceptance.
- [ ] **Cleanup after new engine integration:** delete or fully retire old V1 detector/layout paths only after the new engine is integrated and validated. Do not remove old files during Chunk 3 unless explicitly requested.

### Current QA Commands

```bash
npm run qa:water-reader-engine-foundation
npm run qa:water-reader-engine-features
npm run qa:water-reader-engine-feature-review
npm run qa:water-reader-engine-zone-smoke
npm run qa:water-reader-engine-zone-review
npx tsc --noEmit
```

For fast iteration, use filtered zone review rows before running the full matrix:

```bash
npm run qa:water-reader-engine-zone-review -- --lake "Lake Charlevoix" --season summer --timings
npm run qa:water-reader-engine-zone-review -- --lake "Mullett" --season summer --timings
npm run qa:water-reader-engine-zone-review -- --lake "Glen" --season summer --timings
npm run qa:water-reader-engine-zone-review -- --lake "Higgins" --season spring --timings
npm run qa:water-reader-engine-zone-review -- --lake "Burt" --season fall --timings
npm run qa:water-reader-engine-zone-review -- --lake "Elk" --season spring --timings
```

Filtered artifacts are written under `tmp/water-reader-engine-zone-review/filtered/`. Full review artifacts are written under `tmp/water-reader-engine-zone-review/`.

---

## Architecture

**Inputs:** lake polygon (lat/lng coordinate array), lake's state (2-letter code), lake acreage, current date.

**Pipeline:**

1. **Ingest polygon** for the selected lake. Polygon coordinates arrive as lat/lng (WGS84 / GeoJSON convention). At ingestion, project the polygon to local meter coordinates centered on the polygon's centroid. All detection, spacing, sizing, overlap, and visible-fraction math must use projected meters, never raw lat/lng and never SVG/display pixels. Normalize polygon winding to GeoJSON convention: exterior rings counterclockwise, interior rings (islands embedded in source data) clockwise — reverse during ingestion if source data differs.
2. **Compute lake metrics** — calculate two scale references used throughout:
   - **Longest dimension:** the longest straight-line distance between any two points on the polygon's exterior.
   - **Average lake width:** polygon area ÷ longest dimension.
3. **Detect features** — geometric analysis identifies the 7 physical features below using detection thresholds.
4. **Resolve conflicts** — apply deduplication and priority rules so a single shoreline segment is not labeled as two features.
5. **Determine season** — look up the state's regional group, apply that group's seasonal date boundaries to the current date.
6. **Place zones** — apply the seasonal zone placement rules per feature, then enforce the per-lake zone cap using the priority order. The primary map is feature-first: do not force filler zones when trustworthy structure is sparse. Universal fallback zones are optional and may be enabled only through an explicit placement option (see Featureless and Sparse Lakes section).
7. **Generate legend** — assign a deterministic legend template per zone keyed by (feature type, season, position variant). Append transition warning if applicable.
8. **Render** — output SVG containing the polygon, color-coded zones, numbered legend, and FinFindr branding. See SVG Rendering section for SVG-specific rules.

---

## The 7 Physical Features

Each feature has a detection rule based on shoreline polygon geometry. All thresholds are starting values — tune during testing.

### 1. Main Lake Points
**Definition:** A shoreline segment that protrudes outward into the main body, where the shoreline turns at least 60° and the protrusion length is at least 5% of the lake's longest dimension.
**Required attributes:** tip coordinate, two side-slope coordinates, orientation vector.

### 2. Secondary Points
**Definition:** Same geometric rule as a main lake point, but located inside a detected cove (the protrusion's base is within the cove polygon).
**Required attributes:** tip coordinate, two side-slope coordinates, parent cove ID.

### 3. Coves and Pockets
**Definition:** A recessed shoreline area where the depth of recess is at least 2× the width of the opening, and the opening width is at least 3% of the lake's longest dimension.
**Required attributes:** mouth coordinates (left and right), back-of-cove coordinate, irregularity score for each side.

### 4. Necks / Pinch Points
**Definition:** A constriction in the polygon where the across-water width is less than 25% of the average lake width AND less than 50% of the widths immediately on either side of the constriction.
**Required attributes:** narrowest segment coordinates (both shorelines).

### 5. Islands
**Definition:** Any closed polygon contained entirely within the lake polygon. If the source data has multiple polygons, the largest is the lake; the rest are islands.
**Required attributes:** island polygon, two end-point coordinates, distance to nearest mainland shore.

### 6. Saddles
**Definition:** A constriction like a neck, but the narrowest width is 25%–50% of the average lake width.
**Required attributes:** narrowest segment coordinates (both shorelines).

### 7. Dam Structures
**Definition:** A shoreline segment of at least 3% of total shoreline length where consecutive points deviate from a straight line by less than 5°. Up to **two** such segments may be detected per lake (the two longest qualifying segments) — most lakes have one dam; large reservoirs may have a primary plus a saddle dam.
**Required attributes:** two corner coordinates per dam (where the dam meets natural shoreline).

---

## Detection Implementation

This section specifies *how* to detect the features defined above. The detection rules in the previous section are the targets; this section is the methodology for hitting them reliably on noisy real-world polygons.

### Projection and Geometry Units

The implementation must project lake coordinates once at ingestion and keep a reversible transform between WGS84 lat/lng and lake-space meters.

Use this deterministic local tangent-plane projection unless a more precise local projection is explicitly approved:

```text
lat0 = polygon centroid latitude in degrees
lon0 = polygon centroid longitude in degrees
xMeters = (lon - lon0) * cos(lat0 * PI / 180) * 111320
yMeters = (lat - lat0) * 110540
```

Required rules:

- All feature detection, thresholds, distances, areas, zone sizing, visible-fraction sampling, collision checks, and cluster checks run in projected meters.
- SVG rendering may transform projected meters into viewBox coordinates after geometry decisions are complete.
- The renderer must not change zone placement decisions. A map rendered at phone size and tablet size must contain the same zones in the same lake-space positions.
- If projection fails, the waterbody must be marked `not_supported`.

### Preprocessing

Before any detection runs, preprocess the raw GeoJSON and projected polygon in this exact order:

1. **Repair geometry** if possible using the geometry library's standard polygon repair operation. If the polygon remains invalid, mark `not_supported`.
2. **Choose the primary water component.** For multipolygons, the largest component is the primary lake. Secondary water components are not islands. If any secondary water component has area greater than 8% of the primary component, mark `needs_review` unless multipart support has been explicitly implemented.
3. **Project to meters** using the Projection and Geometry Units section above.
4. **Resample the exterior shoreline by arc length** at a spacing of `clamp(longestDimension * 0.003, 5m, 60m)`. Detection must not depend on raw source vertex density.
5. **Simplify** the resampled shoreline using Douglas-Peucker with tolerance `clamp(longestDimension * 0.0015, 2m, 35m)`.
6. **Smooth by arc length, not point count,** using a Gaussian equivalent sigma of `clamp(longestDimension * 0.002, 6m, 70m)`.
7. **Run detection on the smoothed/resampled shoreline.**

Use the original projected polygon for area calculations, point-in-water checks, visible-fraction checks, and final rendering. Use the smoothed polygon only to identify feature candidates and feature attributes.

### Adaptive Thresholds by Lake Size

Detection thresholds scale with lake acreage so that small ponds get appropriate sensitivity without flooding large lakes with marginal features.

| Lake Size | Point Protrusion | Cove Opening | Min Zone Size |
|---|---|---|---|
| < 100 acres | 3% | 2% | 3% |
| 100–1000 acres | 4% | 2.5% | 3.5% |
| > 1000 acres | 5% | 3% | 4% |

All percentages are relative to the lake's longest dimension. These adaptive thresholds replace the fixed thresholds in the feature definitions when the lake's acreage falls in the corresponding band.

### Per-Feature Detection Algorithms

**Main Lake Points and Secondary Points (curvature-based, multi-scale):**
1. Compute turn angle at each resampled shoreline point using neighbors by arc-length distance, not by vertex count:
   - small scale = `2.5%` of longest dimension
   - medium scale = `5%` of longest dimension
   - large scale = `8%` of longest dimension
2. A candidate point is a shoreline point where turn angle exceeds the point threshold at at least two of the three scales.
3. Build a base chord between the two side-slope coordinates around the candidate. Measure protrusion length as the perpendicular distance from the tip coordinate to that base chord.
4. A candidate must pass all point gates:
   - protrusion length meets the adaptive point protrusion threshold
   - water exists on both side-slope directions inside the polygon
   - both side slopes return toward the surrounding lake or cove body rather than forming a one-sided shoreline bend
   - the candidate is outside higher-priority conflict buffers for dams, necks, saddle endpoints, and retained cove mouths
5. Assign a confidence score (0-1) based on turn angle magnitude, consistency across scales, protrusion length, and side-slope symmetry.
6. Keep candidates with confidence >= `0.6`.
7. Classify as secondary point if the candidate's base lies inside a retained cove polygon; otherwise classify as main lake point.

**Coves and Pockets (hybrid chord scan; convex hull may only seed candidates):**
1. Scan shoreline point pairs `A/B` whose straight-line distance falls within the valid cove mouth-width range:
   - minimum mouth width = adaptive cove opening threshold
   - maximum mouth width = `22%` of longest dimension
2. For each pair, choose the shorter shoreline path between `A` and `B` as the candidate cove shoreline. Form a closed candidate polygon from that shoreline path plus the mouth chord `A-B`.
3. Compute:
   - `mouthWidth = distance(A, B)`
   - `shorePathLength`
   - `pathRatio = shorePathLength / mouthWidth`
   - `coveDepth = max perpendicular distance from the shoreline path to mouth chord A-B`
   - `depthRatio = coveDepth / mouthWidth`
   - `coveArea`
   - `backOfCove = shoreline point with max perpendicular distance from the mouth chord`
4. Keep a pocket/cove candidate only if all gates pass:
   - `mouthWidth >= adaptive cove opening threshold`
   - `pathRatio >= 1.35`
   - `depthRatio >= 0.55` for a shallow pocket, or `depthRatio >= 0.90` for a strong cove
   - `coveArea >= 0.15%` of lake area
   - mouth shoulders are not inside higher-priority dam, neck, or saddle conflict buffers
5. If convex hull difference is available, use it only to seed or prioritize scan pairs. Do not rely on convex hull difference alone.
6. Compute irregularity score (0-1) separately for the left and right cove shorelines based on curvature variance along each side from mouth to back-of-cove. Use this score only after the cove itself passes the gates above.

**Necks and Pinch Points (rasterized width field / skeleton):**
1. Rasterize the projected primary lake polygon into a water mask.
2. Grid cell size = `clamp(longestDimension / 650, 2m, 25m)`. The raster should not exceed roughly `900 x 900` cells; if it would, increase cell size until it fits.
3. Compute distance-to-shore for every water cell.
4. Extract a medial-axis-like centerline from the water mask using skeletonization or an equivalent graph of locally maximum distance-to-shore cells.
5. At each skeleton cell, compute `width = 2 * distanceToShore`.
6. A neck candidate is a local minimum of width along the skeleton graph.
7. Find the two nearest opposing shoreline points from the local minimum. These are the narrowest segment coordinates.
8. Keep a neck only if all gates pass:
   - `width < 25%` of average lake width
   - width expands to at least `2.0x` the candidate width on both sides of the constriction within a search distance of `clamp(longestDimension * 0.12, 60m, 800m)`
   - the two shoreline endpoints are on opposing shores, not adjacent points on the same shoreline bend
   - the surrounding water bodies on both sides have meaningful area; drop if the entire local region remains uniformly narrow
9. The feature is the physical constriction, but the rendered fishing zones are two shoreline-shoulder zones: one at each narrowest-segment shoreline coordinate. Never render a single center-throat oval for a neck.

**Saddles (medial axis, wider threshold):**
Same width-field/skeleton algorithm as necks, but with width between `25-50%` of average lake width and side expansion of at least `1.5x` on both sides. Saddles also render as two shoreline-shoulder zones, one per opposing shoreline endpoint.

**Islands:**
Interior rings/holes inside the primary lake polygon are islands. Multipolygon secondary components are disconnected water components, not islands. If islands are represented as separate land polygons by the source in a later data version, they may be used only after source-specific handling is explicitly implemented.

**Dam Structures (sliding linearity scan):**
1. Dam detection is conservative. Geometry alone must not label a natural straight shoreline as a dam.
2. A dam may be detected only if all gates pass:
   - the waterbody type or source/name metadata indicates reservoir/dam context, OR a manually approved source flag exists
   - sliding shoreline window length is between `3-10%` of total shoreline
   - linear regression for the window has `R² >= 0.98`
   - both ends show abrupt transition from straight segment to natural shoreline, with corner angles at or above `35°`
   - the straight segment faces open water by the Open Water Side algorithm
3. Keep up to the two longest qualifying segments.
4. If metadata support is absent or gates are borderline, do not label a dam. Either skip the feature or classify it internally as a generic straight shoreline, with no dam legend.

### Validation

After detection, run sanity checks before zone placement:

- **Points:** verify shoreline on both sides slopes back toward the main lake body. If water doesn't extend into the lake on both sides, drop the candidate.
- **Coves:** verify meaningful interior depth, path ratio, cove area, and distinct mouth shoulders using the hybrid chord-scan metrics.
- **Necks and saddles:** verify water on both sides expands significantly beyond the constriction. Drop candidates where the surrounding water is also narrow.
- **Dams:** verify metadata support and strict straight-segment/corner gates. If metadata is missing, do not label a dam.
- **Islands:** verify the island is an interior ring/hole of the primary water polygon, not a detached water component.

Apply Conflict Resolution rules (next section) only after all candidates have been detected and validated.

### Recommended Libraries

Implementation language may be TypeScript or Python, but the engine must expose deterministic structured output to the app.

Recommended Python stack if implemented as an offline/server geometry service:

- **Shapely** — polygon operations, geometric primitives, repair, buffers
- **scipy.signal** — smoothing and local extrema detection
- **scikit-image** — raster skeletonization and distance transforms
- **networkx** — skeleton graph traversal and local minimum detection
- **numpy** — vectorized math throughout

Recommended TypeScript stack if implemented in-app/serverless:

- **Turf.js** for basic GeoJSON helpers only
- **martinez-polygon-clipping** or equivalent for robust polygon boolean operations
- a dedicated raster distance-transform/skeleton helper for necks and saddles

Do not hand-roll polygon boolean operations if a tested library is available.

---

## Open Water Side (Algorithm)

For any feature where rules reference the "open water side":

1. Draw a line through the feature dividing it into two sides.
2. For each side, compute the area of lake polygon within a search radius equal to 20% of the lake's longest dimension.
3. The side with greater area is the **open water side**.

Geometric proxy for which side faces the main basin. No depth data needed.

---

## Position Definitions

Concrete geometric definitions for position references used in zone placement rules.

**Cove-relative side (for secondary points):**
1. Compute the cove's central axis: a line from the midpoint of the cove mouth (between left and right mouth coordinates) to the back-of-cove coordinate.
2. The "back-facing side" of the secondary point is the side whose side-slope coordinate is closer to the back-of-cove coordinate. The "mouth-facing side" is the other side.

**Mainland-facing side (for islands):**
1. Find the closest point on the mainland shoreline to the island's centroid.
2. Draw a line from the island's centroid to that closest mainland point.
3. The "mainland-facing side" is the side of the island that line passes through first when traveling from the centroid outward.

**Island end-points (for fall island zones):**
The two points on the island's exterior with the longest straight-line distance between them — the same algorithm used for the lake's longest dimension, applied to the island polygon.

**Tip extension (for main lake points in summer):**
The zone is centered on the tip coordinate itself, oriented perpendicular to the point's orientation vector. The standard 25% inset applies, with the inset measured along the orientation vector toward the shoreline base of the point. The visible portion of the oval extends out toward the tip and slightly past it.

**Cove fall midpoint:**
For the fall cove zone, the placement coordinate is the midpoint of the chosen shoreline measured along the shoreline path from the mouth coordinate to the back-of-cove coordinate (50% of the path length).

---

## Conflict Resolution

- **Necks override saddles.** If a constriction qualifies as both, label it a neck.
- **Dams override necks, saddles, and main lake points.** If a detected dam segment overlaps with any of these, the segment is labeled a dam only.
- **Coves contain secondary points.** Detect coves first, then look for secondary points inside them.
- **Secondary points are linked to their parent cove.** Secondary points use their parent cove to determine back-facing vs mouth-facing seasonal placement. Winter is no longer an automatic drop. If the parent cove is invalid/weak and no valid secondary-point zone can be placed, suppress the secondary point with a dependency reason. Do not drop a valid secondary point solely because of nominal zone cap pressure.
- **Minimum spacing between same-type features:** 5% of lake's longest dimension. If two same-type features are closer than this, keep the larger one.
- **Islands are detected independently** of all shoreline-based features.

---

## Regional Season Groups

Five groups. Each US state (excluding Alaska and Hawaii — out of scope for v1) assigned to exactly one, based on where heaviest fishing pressure occurs in that state.

| Group | Spring | Summer | Fall | Winter |
|---|---|---|---|---|
| **Deep South** | Jan 15 – Mar 31 | Apr 1 – Sep 30 | Oct 1 – Nov 30 | Dec 1 – Jan 14 |
| **South** | Feb 15 – May 14 | May 15 – Sep 14 | Sep 15 – Nov 30 | Dec 1 – Feb 14 |
| **Baseline** | Mar 1 – May 31 | Jun 1 – Aug 31 | Sep 1 – Nov 30 | Dec 1 – Feb 28/29 |
| **North** | Mar 21 – Jun 21 | Jun 22 – Sep 21 | Sep 22 – Dec 14 | Dec 15 – Mar 20 |
| **Mild Coastal / Desert** | Feb 1 – May 31 | Jun 1 – Aug 31 | Sep 1 – Dec 14 | Dec 15 – Jan 31 |

### State-to-Group Lookup

| Group | States |
|---|---|
| **Deep South** | FL, LA |
| **South** | TX, AL, GA, MS, SC, AR, OK, NM |
| **Baseline** | NC, VA, TN, KY, MO, KS, WV, MD, DE, NJ, PA, CT, RI, MA, IN, IL, OH, NE |
| **North** | MN, WI, MI, IA, SD, ND, NY, VT, NH, ME, CO, WY, MT, ID, UT |
| **Mild Coastal / Desert** | CA, AZ, NV, OR, WA |

**Border lakes:** Lakes that span two or more states are assigned to whichever state appears in the index entry for that lake. Border lakes may use a regional season group that's slightly off for users on the other side of the state line — accepted as a v1 limitation.

---

## Zone Placement Rules

### Main Lake Points
- **Spring:** one zone on each side of the point along the slope toward the tip.
- **Summer:** one zone at the tip extension (see Position Definitions) + one on the open-water side.
- **Fall:** one zone on each side of the point.
- **Winter:** one zone on the open-water side only.

### Secondary Points (inside coves)
- **Spring:** one zone on the back-facing side of the secondary point (see Position Definitions).
- **Summer:** one zone on the mouth-facing side.
- **Fall:** one zone on the mouth-facing side.
- **Winter:** skip — too unreliable without depth data.

### Coves and Pockets
- **Spring:** one zone at the back of the cove against the back shoreline.
- **Summer:** one zone at each point of the cove mouth. If a cove's mouth has only one geometrically distinct point (one side gradual with irregularity score below 0.3 on the 0–1 scale), place only one summer zone at the distinct mouth point.
- **Fall:** one zone on whichever cove shoreline (left or right) has the higher irregularity score, anchored at the cove fall midpoint (see Position Definitions).
- **Winter:** skip — unreliable without depth data and seasonal fish-position certainty.

### Necks / Pinch Points
- **All seasons:** one shoreline-shoulder zone on each shoreline endpoint of the narrowest segment. Do not place a center oval in the throat of the neck.

### Islands
- **Spring:** one zone on the side facing the nearest mainland shoreline (mainland-facing side — see Position Definitions).
- **Summer:** one zone on the open-water side.
- **Fall:** one zone at each of the island's two end-points (see Position Definitions).
- **Winter:** one zone on the open-water side only.

### Saddles
- **All seasons:** one shoreline-shoulder zone on each shoreline endpoint of the saddle. Do not place a center oval in the middle of the saddle.

### Dam Structures
- **All seasons:** one zone at each corner where the dam meets natural shoreline.

---

## Zone Sizing

Zone size is computed in **lake-space units relative to the lake polygon's longest dimension** (defined in pipeline step 2), not in rendered display units. This decouples zone math from rendering and guarantees consistent zone sizing regardless of how the map is scaled, cropped, or padded in the UI.

- **Standard zone:** oval longest axis = **8% of lake's longest dimension**.
- **Large-feature zone:** starting longest axis = **10% of lake's longest dimension**. Applied to: dam corners, neck shorelines, and saddle shorelines (linear features that benefit from slightly larger ovals).
- **Constriction shoulder adaptation:** neck and saddle shoulder zones may shrink below the 10% large-feature starting value when the constriction itself is narrow. Size must be derived from both lake longest dimension and the detected constriction width, capped so the shoulder zone does not become a center-throat blob or bridge the passage. The current TypeScript engine uses width-scaled constriction shoulder sizing with fallback size factors rather than a single fixed 10% oval for every neck/saddle.
- **Minimum zone size:** longest axis must be at least **4% of lake's longest dimension**.
- **Sub-minimum recovery rule:** if a feature's natural zone(s) would fall below the 4% minimum, first try that feature's conservative fallback placement for the same season. Suppress only if no hard-invariant-valid zone can be produced without creating an unsupported center-water/floating zone.
- **Aspect ratio:** ovals are 1.6:1 (longest axis : shortest axis).
- **Overlap handling:** overlap is not a reason to hide a valid physical feature. Overlapping valid zones are grouped as `structure_confluence` when they pass hard invariants individually. Accidental or invalid overlap should be fixed by fallback placement; otherwise the feature is suppressed only after all valid placements fail.

---

## Zone Anchoring (Shoreline Placement)

Each zone is anchored to the shoreline at the placement coordinate from the rules above.

- **Anchor rule:** the oval's center sits **inside the polygon at a distance equal to 25% of the oval's longest axis** from the shoreline placement coordinate, perpendicular to the shoreline at that point.
- This causes approximately **60–70% of the oval to be visible inside the polygon**, with the remainder extending outside and hidden by the polygon mask.
- **Orientation:** the oval's longest axis is parallel to the shoreline tangent at the placement coordinate.
- **Orientation fallbacks:** if the shoreline tangent at the placement coordinate is undefined (sharp angle) or unstable (curvature radius less than the oval's longest axis), use the perpendicular bisector of the two nearest feature attribute coordinates instead. For a point's tip, use the bisector of the two side-slope coordinates. For a neck or saddle shoreline placement, use the line connecting the two narrowest-segment shoreline coordinates.

### Zone Acceptance Invariants

Every rendered zone must pass these invariants after placement and before numbering. A failed invariant drops the entire feature unit unless a valid fallback placement exists for that same feature.

- **Shoreline anchor:** zone anchor is on the primary lake shoreline or on an island shoreline for island zones.
- **Center inside water:** oval center is inside the water polygon.
- **Visible shoreline merge:** the unclipped oval crosses the shoreline. The clipped visible oval must visibly touch or merge with land/shoreline; zero-contact zones are forbidden.
- **Visible fraction target:** visible water fraction target is `0.60-0.70`. Allowed range is `0.50-0.75`. A zone with more than `75%` of its oval visible inside water is rejected as an open-water blob.
- **Minimum contact:** for shoreline features, at least 25% of the oval boundary samples on the bank-facing side must fall outside the water polygon before clipping. This confirms the zone is genuinely merged into shoreline, not barely touching by one pixel.
- **No local-width bridging:** non-neck zones may not span more than `55%` of the local perpendicular water width. For long banks, the cap is `42%`.
- **Overlap becomes confluence:** visible zones may overlap only when each zone individually passes all hard invariants and the overlap is assigned to a deterministic `structure_confluence` group. Do not drop a valid physical feature solely because its zone overlaps another valid structure zone.
- **Crowding becomes confluence or renderer grouping:** clustered valid zones should be grouped as confluence rather than hidden. If the cluster cannot be represented legibly, flag it for renderer polish or `needs_review`; do not silently suppress real structure solely to make the debug map sparse.
- **Semantic match:** the zone class must match the detected feature. Do not render a point zone for a cove mouth unless the point detector independently detected and retained a point there.
- **Useful real structure beats blank output:** if a lake has valid detected structure, render the strongest hard-invariant-valid zone for each selected physical feature in every season. Zero-zone output is acceptable only when no detected feature can produce even one hard-invariant-valid placement.

---

## Zone Cap and Priority

**Visible zone cap (counted as individual zones, based on acreage from the index):**

- **< 50 acres (small pond):** 2-4 visible zones
- **50-500 acres (medium lake):** 3-5 visible zones
- **> 500 acres (large lake/reservoir):** 4-6 visible zones

The engine may detect more internal feature candidates than it displays. The visible output should feel curated and premium, not crowded. Additional internal candidates may be retained for diagnostics, QA, or later product surfaces, but they must not be rendered on the primary map unless they fit the visible cap and all Zone Acceptance Invariants.

**Priority order.** Zones from higher-priority features still sort first in diagnostics, legend ordering, and renderer emphasis, but priority must not hide valid lower-priority physical structure. **Paired structural features are all-or-nothing as feature units:** necks, saddles, and dams should render both shoulders/corners when selected. If their paired zones overlap, preserve the pair and assign a `structure_confluence` group rather than suppressing the feature. Main lake points prefer the full seasonal rule, but may degrade to one valid point-adjacent zone when the full pair/tip-plus-side set fails hard invariants.

1. Dam corners (both corners as a unit, per dam — up to 2 dams)
2. Neck shorelines (both shorelines as a unit, per neck)
3. Main lake points (per point as a unit; ranked by protrusion length, longest first)
4. Saddle shorelines (both shorelines as a unit, per saddle)
5. Island zones (all zones for an island as a unit; ranked by island size, largest first)
6. Coves (all zones for a cove as a unit; ranked by cove area, largest first)
7. Secondary points (only retained if parent cove is retained)

When the nominal cap is reached, the engine may exceed the cap to preserve one hard-invariant-valid zone for each selected physical feature. Add `zone_cap_exceeded_for_structure_coverage` when this happens. The production renderer may visually merge or group confluence areas so the final map remains premium rather than cluttered.

Do not use cap pressure alone to suppress real structure. Suppression after feature detection is allowed only for invalid/weak geometry, hard-invariant failure after all fallback placements fail, or dependency failure that cannot produce a standalone valid zone.

---

## Structure Confluence

`structure_confluence` is a first-class output concept, not a fallback error state.

**Definition:** two or more hard-invariant-valid zones overlap enough that the area should be presented as one multi-structure region instead of hiding one of the contributing features.

Rules:

- Every contributing feature remains represented in structured output.
- Each contributing zone must individually pass all hard invariants before entering a confluence group.
- Confluence can include zones from different feature classes or paired same-feature zones such as neck shoulders.
- Confluence groups must preserve member feature IDs, feature classes, placement kinds, and zone IDs for legend/copy.
- Confluence groups should use their own visual treatment and color in the production renderer.
- User-facing copy must explain the included physical structures without implying guaranteed fish presence or "best spot" certainty.

Confluence diagnostics must include:

- `structureConfluenceGroupId`
- `structureConfluenceStrength`
- `structureConfluenceMemberCount`
- top-level `confluenceGroups` with member zone IDs, source feature IDs, classes, and placement kinds

The debug renderer may show individual overlapping ovals to aid review, but the production renderer should make the confluence look intentional and visually polished.

---

## Featureless and Sparse Lakes

When detection (with adaptive thresholds applied) returns few or no trustworthy features, the primary Water Reader map may show fewer zones. Sparse trustworthy output is preferred over fake confidence. The engine contains optional **universal pond strategy zones**, but they are disabled in the primary 9-lake review flow and must not appear unless `allowUniversalFallback` is explicitly enabled.

### Triggering condition
Universal zones are added only when the caller explicitly enables universal fallback and no detected physical feature can produce a hard-invariant-valid zone. Detected feature zones always take priority. The default primary map must not silently add universal fallback zones.

### Universal Zone Placement

**Universal Zone A — Longest Unbroken Shoreline:**
1. Identify the longest continuous shoreline segment without significant curvature deviations (using the same smoothed polygon).
2. Place a zone at the midpoint of that segment.
3. **Rationale:** long uniform shorelines are simple, repeatable structure areas on featureless ponds and can provide an intentional fallback when stronger geometry is absent.

**Universal Zone B — Centroid-Nearest Shoreline:**
1. Compute the polygon's geometric centroid.
2. If the centroid lies outside the polygon (rare on simple ponds, possible on highly irregular shapes), use the **pole of inaccessibility** instead — the interior point furthest from any shoreline. Most geometry libraries provide this directly.
3. Find the shoreline point closest to the centroid (or pole of inaccessibility).
4. Place a zone at that shoreline point.
5. **Rationale:** on simple ponds, the shoreline closest to the interior center is a defensible geometry-only fallback because it connects shore access to central open water without claiming depth.

**Constraint:** the two universal zones must be at least 30% of the lake's longest dimension apart. If they would be closer (rare on small ponds), keep only Universal Zone B.

### Color and Legend Treatment

Universal zones use a distinct color from feature-based zones to signal their different basis (see Color Coding section for the hex value). If universal fallback is disabled, no universal color or legend entry should render.

Legend entries for universal zones explicitly note their basis:
- *Universal Zone A:* "No major structural features were detected on this water. This zone marks the longest uniform shoreline, a simple structure edge that can be worth checking on featureless ponds."
- *Universal Zone B:* "No major structural features were detected on this water. This zone marks the shoreline closest to the pond's interior center, a geometry-only fallback for simple ponds."

### Seasonal Variation for Universal Zones
Universal zones do not change placement by season (they're geometric defaults), but their legend descriptions can be lightly seasonally adjusted via the same template lookup system used elsewhere — keyed on (universal_zone_type, season). This remains optional until the final product decision on universal fallback is made.

---

## Color Coding

Each feature type has a consistent color used for both the zone on the map and the legend entry. Consistency lets users glance at a zone and instantly identify its feature type. Hex values may be tuned during design polish but should be locked at these starting values.

| Feature | Color | Hex |
|---|---|---|
| Main Lake Points | Bold blue | #1E5FBF |
| Secondary Points | Light blue | #6FA8DC |
| Coves and Pockets | Green | #2E8B57 |
| Necks / Pinch Points | Orange | #E67E22 |
| Islands | Purple | #8E44AD |
| Saddles | Teal | #1ABC9C |
| Dam Structures | Red | #C0392B |
| Structure Confluence | Confluence magenta | #D946EF |
| Universal Pond Zones | Soft gold | #D4A017 |

---

## Legend Format

Each numbered zone gets a numbered legend entry:

1. **Color swatch + structure type** (e.g., a red square + "Dam Corner — South Side")
2. **Seasonal fishing approach** — pulled from the deterministic template table keyed by (feature_type, season, position_variant). No generation, no LLM call.
3. **Transition warning** — appended only if applicable (see below).

For a `structure_confluence` group, the legend entry uses the confluence color and lists every contributing physical structure by class and position variant, for example "Neck Shoulder + Cove Mouth" or "Point Side + Cove Irregular Side". The copy must explain that multiple geometry features converge in the same general area, using conservative language such as "multiple structure cues overlap here" or "logical area to check." Do not use "high-confidence", "best", "guaranteed", or fish-presence claims.

### Legend Template Table

The template table is keyed by (feature_type, season, position_variant) and returns a static description string. Total entries: 7 features × 4 seasons × position variants = approximately 40 templates plus 4 transition warnings.

Template language must stay educational and conditional. Use phrases such as "logical area to check", "seasonally relevant structure", "can be worth checking", and "general approach". Do not use "best", "guaranteed", "fish are here", "fish hold here", "highest confidence", "most productive", "GPS waypoint", "depth break", "channel", "hump", or "deepest water".

Examples:
- (Main Lake Point, Spring, side-facing-cove): "In spring, this point side is a logical area to check because it connects main-lake shoreline with protected water. Work from the bank edge outward along the point slope."
- (Dam Corner, Winter, any): "In winter, this dam corner is a seasonally relevant hard-edge structure area. Work the corner where the straight bank transitions into natural shoreline."
- (Cove, Summer, mouth-point): "In summer, this cove-mouth point is a logical area to check because it connects protected water with the main lake."

The full template table is built once during implementation. Once written, the same string is returned every time for the same key.

---

## Transition Warnings

If current date is within 14 days of the **regional** season boundary, append the appropriate transition warning to the legend entry of any zone whose placement changes between the two adjacent seasons:

- *Entering Spring:* "Seasonal patterns may still resemble winter in some conditions; compare this with main-lake structure zones."
- *Entering Summer:* "Seasonal patterns may still resemble spring in some conditions; protected shoreline structure can remain relevant."
- *Entering Fall:* "Summer patterns may persist on warmer days; open-water-side structure can remain relevant."
- *Entering Winter:* "Fall transitional patterns may persist along cove and shoreline structure."

Skip warnings on zones that don't change across the transition (e.g., dam corners, neck shorelines).

**Note:** zone placement snaps on the boundary date rather than easing gradually. The 14-day warning window before each boundary prepares the user for the upcoming shift.

---

## SVG Rendering

The Water Reader output is generated as SVG. The following rules prevent common SVG-specific bugs.

### Coordinate System
- SVG's Y axis points **down**; the projected polygon's Y axis points **up**. Flip Y when generating SVG output, or all lakes will render upside down.
- Use `viewBox` to define the coordinate space (scaled to the lake's bounding box with a small padding margin). Do **not** hardcode pixel `width` and `height` — let the consumer set display size.

### Layering (Z-Order)
Render in this order, bottom to top:
1. Background fill (optional light backdrop)
2. Lake polygon (filled water color)
3. Non-confluence zone ovals (semi-transparent fill, stroked outline)
4. Confluence regions using the dedicated confluence color and a polished merged/group treatment
5. Zone/confluence numbers (centered inside the visible region)
6. Legend block
7. FinFindr branding

### Hiding the Outside Portion of Ovals
The 25% inset rule means roughly 30–40% of each oval extends outside the polygon. Hide it using an SVG `clip-path` defined from the lake polygon — do **not** mathematically clip the oval geometry. The clip-path approach is one element and bulletproof.

### Rendering Confluence

Confluence should not look like accidental stacked debug ovals. The production renderer should draw a single visually pleasing confluence treatment while preserving the member zones in structured data. Acceptable approaches include a shared translucent merged hull, a confluence-colored outline around the union area, or a confluence fill with subtle internal member indicators. Avoid heavy crossed outlines, unreadable stacked labels, or color mud.

### Text Rendering
- Zone numbers must be centered inside ovals: use `text-anchor="middle"` and `dominant-baseline="central"`.
- Use a safe cross-platform font stack to avoid silent fallback to default fonts: `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"` — or embed a specific font if brand consistency requires it.

### Output Pipeline
- Engine produces a structured output object (polygon coordinates, zone list with positions/colors/numbers, legend entries, metadata).
- Renderer is a pure function: same input always produces same SVG output.
- Use `svgwrite` library or direct string templating; either is fine.
- For PNG output (social sharing, App Store screenshots), convert SVG to PNG via `cairosvg`.

---

## Post-Build Tuning Loop

The detection thresholds, confidence cutoffs, and zone placement parameters in this spec are starting values. Once the engine is built, run this tuning loop before launch to bring real-world output quality up to the level the spec promises.

### Tuning Process

1. **Select a test set of 50 lakes** with deliberate variety:
   - Size mix: 10 small ponds (< 100 acres), 25 medium lakes (100–1000 acres), 15 large reservoirs (> 1000 acres).
   - Region mix: at least 5 lakes from each of the 5 regional season groups.
   - Complexity mix: simple round ponds, multi-armed reservoirs, lakes with islands, lakes with obvious dams, lakes that are mostly featureless.
   - Include at least 10 lakes that the founder personally knows well (ground-truth reference).

2. **Build a repeatable review artifact command** that produces, for every test lake:
   - a CSV review matrix with one row per lake and columns for detected feature counts, visible zone counts, visible feature classes, suppressed feature classes, warnings, support status, and pass/fail review notes
   - an SVG review sheet showing the lake polygon, detected feature cues, shoreline anchors, unclipped oval outlines, clipped visible zones, zone numbers, and legend text
   - PNG thumbnails rendered from the SVGs so the agent and founder can visually inspect the same map output side by side
   - a JSON artifact containing raw candidates, feature attributes, placement metrics, zone acceptance invariant results, and suppression reasons

3. **Build a review tool or script output** that displays each test lake with:
   - The lake polygon.
   - All detected features overlaid (color-coded by type).
   - Feature cue geometry overlaid, including point tips and side slopes, cove mouths and backs, neck/saddle opposing shoreline endpoints, island endpoints, and dam corners.
   - All placed zones overlaid.
   - Unclipped oval outlines or debug outlines so reviewers can confirm that every zone visibly merges into shoreline before clipping.
   - The current legend output.

4. **Agent + founder visual review.** The agent must open the actual rendered SVG/PNG artifacts and inspect them visually. The founder reviews the same artifacts side by side. The agent must not rely only on script pass/fail output or builder summaries.
   For each lake, the agent must answer:
   - Are the detected physical features semantically correct?
   - Are any important obvious features missed?
   - Does every visible zone touch/merge into shoreline and show no more than 75% of the oval?
   - Are necks and saddles represented as shoreline-shoulder zones instead of center-throat blobs?
   - Are there any three-zone non-neck clusters or crowded same-shore outputs?
   - Does the seasonal placement make sense for the detected feature without making fish-presence claims?
   - Would this map feel trustworthy if shown to a real angler unfamiliar with the implementation?

5. **Manually mark each lake** in the CSV/review matrix:
   - False positives (engine labeled a feature that isn't really there).
   - False negatives (engine missed a feature that should have been detected).
   - Misplaced zones (zone is in the wrong location for the feature/season).
   - Borderline calls (technically correct but aesthetically off).
   - Shoreline-contact failures.
   - Feature-class semantic failures.
   - Cluster/crowding failures.
   - Copy/legend language failures.

6. **Adjust thresholds based on patterns:**
   - If false positives cluster at certain confidence scores, raise the confidence threshold.
   - If false negatives cluster at certain protrusion lengths, lower the protrusion threshold for the relevant lake size band.
   - If zone placements consistently look wrong on a feature type, revisit that feature's placement rule.
   - If zones pass numerically but look visually wrong, add or tighten a geometry invariant. Do not solve recurring visual issues with lake-specific exceptions unless the lake is explicitly moved to a fixture override list for QA only.

7. **Re-run the engine and repeat** until at least 80% of test lakes pass review without significant issues.

Each tuning pass must include a short changelog identifying:

- changed thresholds
- changed placement rules
- lakes improved
- lakes regressed
- remaining blockers
- whether strict no-floating-zone and no-three-zone-cluster rules still pass

### What "Done Tuning" Looks Like

Tuning is complete when:
- 80%+ of test lakes produce output the founder would confidently show in marketing.
- No test lake produces output that would embarrass the brand if a fisherman recorded it for TikTok.
- If universal pond strategy is enabled for the final product, it reliably triggers on featureless ponds and produces zones that look intentional, not apologetic. If it remains disabled, featureless ponds produce sparse/limited output without fake filler zones.
- Detection confidence and threshold values are documented and frozen for v1 launch.
- The agent and founder have jointly reviewed the rendered artifacts, not just logs, for the final 50-lake tuning set.
- Every final visible zone passes the Zone Acceptance Invariants.

### Post-Launch Iteration

After launch, capture user feedback on individual lake outputs (a "this map looks wrong" reporting button on each Water Reader render). Review reports weekly for the first 90 days. Patterns in user complaints become the input for v1.1 threshold adjustments.

---

## Out of Scope (v1)

Species-specific logic, bank/boat mode, satellite/CV analysis, depth-based placement, creek arm detection, weather/wind/time-of-day integration, sub-state regional variation, LLM-generated content of any kind, lakes in Alaska and Hawaii.
