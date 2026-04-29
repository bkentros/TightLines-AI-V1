# Water Reader geometry audit (Phase 1, offline)

Dev-only tooling to **read** lake polygons from `public.waterbody_index`, isolate the intended basin locally, extract/score shoreline arc candidates, build basin-clipped water-side ribbon callouts, and write **local** GeoJSON + HTML for visual QA.

Controlled product direction: `docs/WATER_READER_CURRENT_ENGINE_PLAN.md`.

## What this is not

- No **app UI**, Edge functions, migrations, or **database writes**.
- No **imagery** fetches (including USGS / NAIP / tiles). Vector-only.
- No rectangles as product output, no fish zones, depth, access, or high-confidence claims.
- Outputs are **low confidence** (`dev_only_low`) geometry heuristics for Brandon’s audit.

## Rough V1 visual baseline (offline, approved)

Frozen **Apr 2026** for vector-only QA before any app wiring:

- **Primary overlay:** `focus_area_polygon_display` (what `review.html` draws by default). Raw `focus_area_polygon`, arcs, and ribbons are QA layers, not the hero visual.
- **Long / simple basins** (`lakeShapeMode: long_simple_basin`): **`focus_scale_mode: shoreline_corridor`** — broad **generalized** shoreline corridor zones (`broad_shoreline_focus`), not pretending weak bumps are major structure.
- **Complex / mixed shoreline basins**: **`focus_scale_mode: local_lobe`** — pocket / protrusion / bend style lobes at local scale.
- **Styling:** distinct **per-candidate** visible colors for selected display areas; **feature-type legend** stays **separate** from those overlay colors; **no anchor circles**; rank labels use **leader lines** only.
- **Claims:** geometry-derived heuristics only — **manual-review required**, **`dev_only_low`**. No fish marks, productivity, best spots, depth, access, or high-confidence language.

Example approved corridor artifact: `outputs/visual-qa-torch-final-broad-001/review.html`.

## Continuity handoff / next phase

This audit pipeline reached the rough V1 visual baseline Brandon approved. New agents should **not** keep tuning individual lakes unless Brandon reports a concrete visual failure. The next phase is to move cautiously toward a **dev-only app fixture preview**, not live generation.

Recommended sequence:

1. Export a tiny reviewed fixture bundle from approved offline outputs for 2-5 lakes.
2. Keep fixture data vector-only: `focus_area_polygon_display` plus QA roles/properties.
3. Build a dev-only app renderer behind a flag such as `EXPO_PUBLIC_WR_OFFLINE_OVERLAY_FIXTURE=1`.
4. Keep normal Water Reader UI unchanged when the flag is off.
5. Do not call the old rectangle RPC path.
6. Do not persist overlays to Supabase yet.
7. Do not generate overlays live in Edge yet; recent batch runtime is still minutes for 12 lakes.

Expected app fixture contract shape:

- top-level: `schemaVersion`, `generatedAt`, `source: "vector_shoreline_only"`, `engine: "offline_water_reader_geometry_audit"`, `reviewStatus`, `manualReviewRequired`, `lakes[]`.
- lake: `lakeId`, `lakeName`, `state`, `county`, `lakeShapeMode`, `focus_scale_mode`, `candidates[]`.
- candidate: `candidateId`, `rank`, `featureClass`, `featureLabel`, `focus_scale_mode`, `confidence: "dev_only_low"`, `style`, `metrics`, `qaFlags`, and geometry roles including `focus_area_polygon_display`, `focus_area_polygon`, `shoreline_arc`, `anchor_point`, optional `water_side_ribbon`.

Safety copy / claims:

- Use “geometry focus area preview (dev)” or equivalent.
- Do **not** say fish zone, best spot, productive water, access, depth, species, or high confidence.
- Treat all output as manually reviewed, low-confidence, geometry-derived guidance for QA.

Mastermind workflow reminder:

- The continuity/mastermind agent should not implement by default.
- It should give Brandon exact copy/paste prompts for either a fast builder or an advanced/specialized builder, and specify which one to use.
- It should verify builder claims with concrete files, summaries, grep/search, and generated artifacts where possible.
- It should keep prompts narrow, include repo/source/legal context, demand compact reports, and require builders to stop if scope/legal/technical risk appears.

## Phase 1 limitations

- Exterior shoreline ring only for candidate generation (no coves, island candidates, neckdowns, bathymetry, or species logic).
- Arc scoring is a **development** heuristic (bearing change, sinuosity, turn density, length, NMS separation)—not calibrated product logic.
- Candidate output is a bundle keyed by `candidateId`: source-truth **`shoreline_arc`**, optional **`water_side_ribbon`** (narrow QA/debug strip), the **visual hero `focus_area_polygon_display`** (a display-only widened + simplified version of the raw focus, capped by basin clearance and interior-ring keepout), raw QA **`focus_area_polygon`**, and **`anchor_point`** (label/leader placement). The display polygon is built by buffering the raw lobe outward toward a target effective width and then clipping by a slightly inset basin (`displayBasinInsetM`) and an island keepout (`displayIslandKeepoutM`), so its outline never sits exactly on a shoreline or interior ring even though the raw focus polygon stays conservative. `effectiveDisplayWidthM`, `displayExpandM`, `displayPostClipOutsideBasinM2`, and `displayIslandOverlapM2` are reported per candidate. **NMS only accepts arcs whose raw focus polygon passes thickness / area / depth / fragment checks**, so trace-like shoreline strips are not promoted; `summary.json` **`audit_metrics.focusSelectionRejectedCount`** tallies arcs skipped for failing those gates. Ribbons are **shoreline-following offset strips** with **flat ends**, plus **ribbon-aware NMS**: midpoint separation, **minimum surface gap between ribbons**, and buffered overlap rejection so selected callouts do not glue together.
- Basin-scale mode is computed per lake as **`lakeShapeMode`** (`complex_shoreline`, `mixed`, or `long_simple_basin`) from metric basin elongation, compactness, shoreline development, and rotated-rectangle fill. Long/simple basins use **`focus_scale_mode: shoreline_corridor`**: fewer selected candidates, larger midpoint/gap separation, much broader display target widths, a corridor-specific depth cap, a longer-arc eligibility gate (`corridorMinLengthM` / `corridorTargetLengthM`), and `featureClass: broad_shoreline_focus` instead of pretending weak bumps are major points. Complex lakes keep **`focus_scale_mode: local_lobe`** and normal point/bend/pocket classes.
- Each scored arc otherwise gets a deterministic geometry-only **`featureClass`**: `concave_pocket_cove`, `convex_point_protrusion`, `shoreline_bend`, or `mixed_complexity` (from signed shoreline bend + sinuosity / turn rate, with uncertainty folded into `mixed` when weak). A **diversity swap** may replace a weak cove pick with a qualifying protrusion class candidate on complex/mixed lakes; long/simple basins skip that swap.
- Seed JSON must not assume UUIDs work across Supabase projects; validate IDs in your project first.
- **Manual review:** Phase 1 always requires Brandon sign-off; `summary.json` sets `needs_brandon_review: true` for every lake.

## Install

From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Keep `.venv/` local only; do not commit it. The repo keeps **`outputs/.gitignore`** so generated GeoJSON/HTML under `outputs/` stays out of git (no extra repo-wide ignores for this tool).

For CLI runs, `PYTHONDONTWRITEBYTECODE=1` avoids import-time `.pyc` files. `python -m py_compile` may still write `__pycache__/` next to the script—delete that folder if you want a clean tree; the monorepo root `.gitignore` ignores Python cache patterns.

## Environment

One of these must be set to a **read-only-capable** Postgres URL (same project you are auditing):

- `DATABASE_URL`
- `V1_DATABASE_URL`

## CLI

```bash
python audit_shoreline_features.py --seed lake_set_seed.json --limit 10
python audit_shoreline_features.py --seed lake_set_seed.json --state MI --search-name "Lake" --limit 5
python audit_shoreline_features.py --run-id my-run --limit 3 --debug-full-polygon
python audit_shoreline_features.py --state MI --limit 12 --run-id visual-qa-mi-001 --densify-step-m 30 --stride-m 60
python audit_shoreline_features.py --state MI --search-name "Pontiac" --limit 5 --run-id visual-qa-pontiac-001 --ribbon-width-m 42
```

**Performance:** Arc candidates are **bounded**: for each start vertex (spaced by `--stride-m` / `--densify-step-m`), the script builds **one** polyline per target length in `--arc-lengths-m` (each capped to ~**20%** of perimeter by default). It does **not** enumerate every growing sub-arc. Tune densify/step/lengths to trade coverage vs speed. `summary.json` includes **`runElapsedSec`** (whole run) and per-lake **`audit_metrics.elapsed_sec`**.

Options:

| Flag | Meaning |
|------|--------|
| `--seed` | Path to JSON filters / optional ids |
| `--limit` | Max rows from `waterbody_index` |
| `--search-name` | `canonical_name ILIKE` (overrides seed `name_contains`) |
| `--state` | `state_code` filter (overrides seed) |
| `--run-id` | Output subdirectory name (default UTC timestamp) |
| `--debug-full-polygon` | Adds raw DB geometry to per-lake GeoJSON `debug` feature |
| `--densify-step-m` | Spacing along exterior when densifying (meters, default 22) |
| `--stride-m` | Spacing between arc starts along ring (meters, mapped to vertex stride; default **56**) |
| `--arc-lengths-m` | Comma-separated target arc lengths in meters (default `240,400,600,900,1200,1500`; each capped vs perimeter) |
| `--ribbon-width-m` | Nominal water-side ribbon width (meters, default **48**; capped vs perimeter and interior-ring clearance) |

Queries **`public.waterbody_index` only**, with the columns listed in `audit_shoreline_features.py`. There is **no `is_searchable` (or other product-search) filter** — use seed filters, `--state`, `--search-name`, and/or explicit `ids` to narrow rows.

## Outputs (git-ignored)

Under `outputs/<run-id>/`:

- `candidates.geojson` — merged candidate geometry-role features (`shoreline_arc`, `focus_area_polygon`, `focus_area_polygon_display`, `water_side_ribbon`, `anchor_point`) keyed by shared `candidateId`. Each role sets `geometryRole`. Focus polygons carry basin-clipped **`focusAreaM2`**, **`effectiveFocusWidthM`**, **`corridorLengthM`**, **`corridorDepthM`**, **`displayCorridorLengthM`**, **`displayCorridorDepthM`**, depth/clearance/cap metadata, display simplification metadata, clip/fragment QA fields, and the same low-confidence ribbon arc metadata where applicable. **`focus_area_polygon_display`** is what `review.html` draws by default; raw focus polygons and ribbons remain for QA.
- `summary.json` — **`audit_metrics`** adds **`lakeShapeMode`**, **`focus_scale_mode`**, basin-shape metrics, **`minRibbonAreaM2`**, **`ribbonOverlapRejectedCount`**, midpoint/min-area rejection tallies, **`selectedFeatureClassCounts`**, pairwise gap **`selectedRibbonPairwiseGapMinM`** / **`Mean`**, and **`arcsWithUncertainFeatureClass`**.
- `review.html` — basin vs island holes drawn as a quiet support layer, hero **focus polygons** (display geometry) with translucent **rank-based** fill/outline colors so same-class corridors remain visually distinct, feature type labels in a separate legend/table field, numbered rank labels with calm leader lines and no dot markers, **shoreline arcs and water-side ribbons hidden by default** as QA-only layers, lake shape / focus scale mode stats, layer toggles, a polished map key + selected-area color legend + feature-type legend, and an expanded per-candidate table that includes readable feature labels, focus scale mode, corridor metrics, shape family, raw vs display focus metrics, expand/inset, clip statuses, fragments, probe rate, and QA flags.
- `per-lake/<lake-id>.geojson` — selected basin + candidates (+ optional debug geometry).

## Seed file

Edit `lake_set_seed.json`: optional `filters.state_code`, `filters.name_contains`, `filters.waterbody_types`, and optional `ids` (UUID strings validated in **your** DB).
