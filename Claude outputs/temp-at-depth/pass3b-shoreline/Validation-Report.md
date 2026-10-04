# Temp at Depth Pass 3b — Shoreline Mask Validation

Date: 2026-10-04

Branch: `feat/temp-at-depth`

Target: staging only (`piercast-lake-map-staging` through `piercast-map-gate-staging`)

## Result

The hard, cell-aligned depth-frame validity edge was replaced with a rendered
mask derived from the surface run's bathymetry texture. The GPU bilinear-filters
that field and applies a smooth threshold with a 1.5 ft minimum feather (expanded
to 1.5 screen-space derivatives when needed). Too-shallow water now receives a
28% neutral wash; map detail remains visible through it and deeper water fades
smoothly into the temperature colors.

Surface Temp and Temp at depth remain below the same `land` and antialiased
`land-hd` layers. The result therefore uses the same precise shoreline cover for
both fields. Point readouts retain the source depth frame's authoritative mask.

## Tests

- Lake-map Node suite: 86 passed, 0 failed.
- Lake-map job Python suite: 78 passed, 0 failed.
- Repository Deno suite (`--no-check`): 1,529 passed, 0 failed.
- TypeScript (`npx tsc --noEmit`): passed.
- Page build (`npm run build:page`): passed.
- Automated staging browser capture: 77 images completed (35 before, 35 after,
  7 after/surface references) without a load or render failure.

The new renderer regression samples a bilinear bathymetry transect, requires a
multi-sample soft transition, rejects cell-sized opacity jumps, and verifies
that both custom fields use the same shoreline cover layers.

## Visual Matrix

Every location was captured at 10, 20, 30, 40 and 50 ft with identical cameras
before and after. A Surface Temp reference was also captured at each camera.

| View | Center | Zoom |
| --- | --- | ---: |
| Grand Haven | -86.255, 43.035 | 10.2 |
| Muskegon | -86.355, 43.235 | 10.0 |
| Ludington | -86.475, 43.955 | 10.0 |
| Saginaw Bay | -83.72, 43.98 | 8.0 |
| Western Erie | -83.05, 41.72 | 8.2 |
| Superior | -87.48, 46.86 | 7.6 |
| Ontario | -77.88, 43.67 | 7.8 |

- Before: `screenshots/before/`
- After: `screenshots/after/`
- Surface references: `screenshots/after/*-surface.png`

Visual review confirmed that the original rectangular stair steps are absent,
the shallow field is a translucent neutral wash, roads/basemap/shoreline remain
visible through it, and the visible land-water boundary matches Surface Temp.

## Staging Publish

Published successfully to `piercast-lake-map-staging`. The existing
`static/depth-v1.pmtiles` and `static/lakes-v2.pmtiles` objects were unchanged.
Only the staging map page assets and `map/capabilities.json` were uploaded.

Pass-required staging endpoint:
`https://piercast-map-gate-staging.finfindr.workers.dev/`

No production resource, workflow, app code, Supabase resource, or app contract
was changed.

## Impact

1. Live app users (1.14) right now: none.
2. App 1.15 live on Android / in iOS review: none; its production map URL and bundled app code are unchanged.
3. Production systems (R2, Worker, map page, Supabase, workflows on main): none.
