# Water Reader Current Engine Plan

**Status:** Active controlling plan for current Water Reader engine work.

**Supersedes for implementation:** The geometry-grid, rectangle-overlay, and live SQL-only detector path described in older notes. `docs/WATER_READER_MASTER_PLAN.md` remains historical/source/legal context, but this file controls the current engine rebuild.

**Audience:** Brandon, future builders, and AI agents.

---

## Current Goal

Water Reader should let Brandon select a named U.S. lake, pond, or reservoir and eventually see tight, credible visual callouts around real lake geometry characteristics.

The current engine goal is not long-form output. It is:

1. isolate the selected basin correctly,
2. identify real shoreline characteristics,
3. produce visually reviewable focus areas derived from vector lake geometry,
4. prove quality in local audit artifacts before anything becomes user-facing.

The product should not present “Best Starting Areas” until the geometry engine passes visual QA.

---

## Current Implementation Status

Working foundation:

- Search/select exists.
- USGS TNM NAIP Plus whole-lake preview exists.
- Aerial source policy and attribution path are established.
- Geometry-candidate SQL/Edge/client experiments exist.
- Current UI hides geometry rectangle output in normal use and keeps it dev-gated.
- The app is not live; Brandon is the only tester, but repo discipline still matters.

Important pivot:

- The SQL grid/rectangle path was visually rejected.
- The shoreline-sampled SQL detector improved numeric audits but still failed visual trust in-app.
- Current user-facing Water Reader should stay at preview/prototype level until the rebuilt engine passes visual audit.

**Offline overlay baseline (rough V1, frozen Apr 2026):** Brandon approved the current **offline** audit map: `focus_area_polygon_display` as the primary visual; **`shoreline_corridor`** for long/simple basins and **`local_lobe`** for complex basins; distinct selected-area colors with a **separate** feature legend; no anchor circles; dev-only / manual-review, no fish or productivity claims. See `scripts/water-reader-geometry-audit/README.md` (section *Rough V1 visual baseline*) and example `scripts/water-reader-geometry-audit/outputs/visual-qa-torch-final-broad-001/review.html`. App UI and Edge remain unchanged until product wiring.

**Current architecture recommendation:** do **not** generate overlays live in the app or Edge yet. Runtime is still offline-audit scale (recent 12-lake MI run took several minutes). The next phase should begin with a **dev-only bundled JSON fixture renderer** for a few reviewed lakes, behind a dev flag, with normal Water Reader UI unchanged when the flag is off.

---

## Superseded Work

The following are engineering proof/prototype paths only:

- Coarse grid/window candidates from `plan_waterbody_aerial_geometry_candidates`.
- Rectangle overlays as the primary visual output.
- Labels implying grid or rectangle candidates are final “Best Starting Areas.”
- SQL-only detector tuning as the main product-quality path.

Do not delete already-applied migrations only because they are superseded. Treat them as historical DB evolution. Future agents must not treat them as the active product engine.

Relevant superseded/prototype files may remain useful for plumbing tests:

- `lib/waterReaderAerialEngine.ts`
- `lib/__tests__/waterReaderAerialEngine.test.ts`
- `supabase/functions/waterbody-aerial-geometry-candidates/index.ts`
- geometry-candidate SQL migrations from `20260427233000`, `20260428204500`, `20260428171734`, and `20260428213000`

---

## Active Next Step

Move from the approved offline audit artifact toward a **dev-only app fixture preview**.

Do **not** start with live Edge generation or DB persistence. The recommended next sequence is:

1. Export a tiny reviewed JSON fixture bundle for 2-5 approved lakes from existing offline audit outputs.
2. Define an app-consumable contract around `focus_area_polygon_display` plus QA roles.
3. Build a dev-only renderer behind a flag such as `EXPO_PUBLIC_WR_OFFLINE_OVERLAY_FIXTURE=1`.
4. Keep normal Water Reader UI unchanged when the flag is off.
5. Render the fixture only as “Geometry focus area preview (dev)” with the same safety copy: no fish, productivity, access, depth, or high-confidence claims.
6. Continue generation/scoring/review offline until performance, legal/source policy, and QA are ready for persistence or server generation.

The app renderer must **not** call the old rectangle RPC path or display legacy rectangle overlays.

---

## Phase 1 Engine Scope

Phase 1 is vector-only and dev/audit-only.

Implemented in the offline audit pipeline:

- selected-basin isolation,
- sliver removal,
- component ranking by centroid containment, area, and proximity,
- exterior shoreline arc extraction,
- shoreline arc scoring from turn density, sinuosity, and separation,
- anchor point generation for label placement,
- QA flags that explain failures or ambiguity,
- water-side ribbon QA geometry,
- raw focus area polygons,
- display focus area polygons,
- lake-shape mode classification,
- long/simple-basin broad shoreline corridor mode,
- complex-shoreline local-lobe mode,
- distinct selected-area colors and separate feature legends,
- static visual audit artifacts.

Do not implement yet:

- app-facing production overlay output,
- live on-demand Edge generation,
- DB persistence of reviewed overlays,
- unreviewed product output,
- full feature-family coverage beyond current vector heuristics,
- depth or bathymetry,
- species-specific scoring,
- CV/visible cue inference,
- access claims,
- public production “Best Starting Areas.”

Still incomplete / future engine work:

- richer cove/neckdown/island-inside-turn detectors,
- bathymetry/depth/contour evidence,
- species or mode-specific weighting,
- performance optimization for server/app runtime,
- reviewed-derived-geometry persistence policy.

Do not implement yet:

- neckdowns,
- islands/inside turns,
- app-normal user-facing output.

---

## Output Geometry Direction

Rectangles are rejected as product output.

The approved rough V1 offline candidate bundle is keyed by `candidateId` and includes these roles:

- `focus_area_polygon_display`: primary visual overlay for review and future dev-only app fixture rendering.
- `focus_area_polygon`: raw conservative focus polygon for QA.
- `shoreline_arc`: source/provenance line for the identified shoreline characteristic.
- `water_side_ribbon`: QA proof of water-side detection, hidden by default in review.
- `anchor_point`: data/label reference point; rendered without anchor circles.

The renderer should draw custom polygons, rank labels, leader lines, and feature legends. It must not draw generic boxes or circular target markers as if they are detected zones.

Current visual mode behavior:

- `lakeShapeMode: long_simple_basin` uses `focus_scale_mode: shoreline_corridor`, fewer candidates, and broad generalized shoreline corridors.
- complex/mixed basins use `focus_scale_mode: local_lobe`, with local point/protrusion, cove/pocket, or shoreline-bend lobes.
- selected-area colors distinguish candidates; feature type is explained separately in the legend/table.

---

## V1 Source And Legal Constraints

Locked for current V1 work:

- Approved aerial source path: USGS TNM NAIP Plus.
- Registry: `usgs_tnm_naip_plus`.
- Policy: `usgs_tnm_naip_plus_national`.
- Endpoint: `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer`.
- Use ImageServer `exportImage`, not XYZ tiles.
- Excluded states/regions: AK, HI, PR, GU, MP.
- Required attribution: `Map services and data available from U.S. Geological Survey, National Geospatial Program.`

Do not:

- use Google imagery,
- add alternate imagery providers,
- cache/store/export source imagery,
- persist derived fish-zone outputs,
- infer depth/bathymetry/contours,
- make exact fish-location claims,
- make public/private access claims,
- allow aerial-only confidence to become high.

---

## Deferred To V2 Or Later

Deferred until the Phase 1 vector audit passes:

- depth/bathymetry/contour evidence,
- species-specific weighting,
- boat/shore mode,
- daily conditions,
- CV/visible cue assist,
- vegetation/dock/cover inference,
- server-side precomputed feature tables,
- production renderer with reviewed overlays,
- saved reports,
- access-related claims,
- recommender handoff.

CV may become useful later, but it is not the first fix for bad vector geometry or selected-basin isolation.

---

## Agent Rules

Future agents must follow these rules:

- Use this file as the controlling plan for current engine work.
- Use `scripts/water-reader-geometry-audit/README.md` for the current offline audit contract and visual baseline.
- Do not use cross-project `waterbody_index` UUIDs as constants.
- Validate IDs against the same Supabase project being tested.
- Do not show geometry rectangles as product output.
- Do not call grid/SQL rectangle candidates “Best Starting Areas.”
- Do not treat numeric SQL audits as product-quality proof without visual review.
- Do not add imagery providers.
- Do not write to the DB in the audit phase.
- Do not fetch imagery in Phase 1 audit.
- Do not delete already-applied migrations just because they are superseded.
- Keep generated audit artifacts ignored unless Brandon explicitly asks to preserve a sample.
- Keep hygiene clean: no repo `.venv`, no `__pycache__`, no `.pyc`, no generated output accidentally staged.
- Load `.env` DB URLs safely; do not shell-source a password-containing URL where `$` can expand.
- Do not print DB passwords or full connection strings.
- Always verify builder claims with files, summaries, grep/search, and generated artifacts when practical.
- Normal app UI should remain preview/rebuild-placeholder only until Brandon explicitly approves dev-only fixture rendering.

---

## Next Build Prompt

The next builder should **not** tune geometry again by default. The baseline is frozen unless visual QA reveals a concrete failure.

Next likely implementation slice:

1. Export a small reviewed JSON fixture bundle from approved offline outputs.
2. Keep it dev-only and small.
3. Define a stable app contract for `focus_area_polygon_display` and related roles.
4. Prepare for a later dev-only app renderer behind `EXPO_PUBLIC_WR_OFFLINE_OVERLAY_FIXTURE=1`.

Before app rendering, a builder should inspect the current audit output shape and propose the exact fixture schema.
