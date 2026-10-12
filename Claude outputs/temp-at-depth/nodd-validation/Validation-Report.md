# Temp at Depth — NODD Validation and Staging Report

Date: 2026-10-12

Branch: `feat/temp-at-depth-nodd`

Base: `origin/main` at `4d9f4ceaa41d4af497ffd9e63ec5b87cb3f0144a`

Production changes: none

Impact on live 1.14/1.15/1.16/1.17: **none**

## Result

PASS. NODD native sigma-layer temperature is a validated second source for all
four NOAA Great Lakes OFS models. Every required lake/depth combination passed
the predeclared limits across two complete cycles and f000/f024/f072/f120.

The staged producer now:

- selects THREDDS only when it is complete/readable for all four models;
- otherwise selects NODD only when every required model is on the checked-in
  validation allow-list;
- refuses mixed sources within one depth cycle;
- converts native layer centres with `-siglay * (h + zeta)`;
- uses `siglev` only to bound the valid top and bottom finite-volume cells, so
  no value extends above the surface or below the instantaneous lakebed;
- interpolates to exactly 10/20/30/40/50 ft and uses the existing production
  grid, shoreline mask, bathymetry mask, and shallow-water masking;
- uploads immutable source-specific trees and writes the mutable depth pointer
  strictly last;
- retains the previous pointer when neither coherent validated source works.

The staging proof also found and fixed a pre-launch cache issue: the Worker had
classified `runs/tdepth/latest.json` as immutable because it is below `runs/`.
The pointer now has a 60-second revalidating cache, and the page versions its
pointer request by surface run. A staging readback returned
`private, max-age=60, must-revalidate` and the final NODD pointer.

## 1. Production surface freshness (read-only)

Final check:

- production run: `20261012T06Z-10120946`
- NOAA cycle: `2026-10-12T06:00:00Z`
- generated: `2026-10-12T09:46:51Z`
- source: `NOAA_COOPS_THREDDS` for LSOFS, LMHOFS, LEOFS, and LOOFS
- each model has 121/121 hours; minimum source/grid coverage is 99.9921–100%
- newest complete NOAA cycle across all four models: `2026-10-12T12:00:00Z`
- match: **no**; production is one complete six-hour cycle behind NOAA at the
  final check

The last eight `Lake map data` runs all completed successfully at the workflow
level:

| Run | Started UTC | Outcome |
| ---: | --- | --- |
| 38244406551 | 2026-10-12 11:42 | 06Z already published; skipped before paid calls |
| 38236911173 | 2026-10-12 10:31 | 06Z already published; skipped before paid calls |
| 38231992726 | 2026-10-12 09:45 | Published `20261012T06Z-10120946` successfully |
| 38190396563 | 2026-10-12 01:03 | 00Z incomplete for all four; retained prior run |
| 38187764039 | 2026-10-12 00:22 | 00Z incomplete for all four; retained prior run |
| 38186306828 | 2026-10-11 23:59 | 00Z incomplete for all four; retained prior run |
| 38170184123 | 2026-10-11 19:57 | 18Z incomplete for all four; retained prior run |
| 38167987329 | 2026-10-11 19:25 | 18Z incomplete for all four; retained prior run |

## 2. Branch and rebase

`feat/temp-at-depth` was cleanly rebased from `bd42b317` onto the required
`origin/main` commit `4d9f4cea`, verified, and force-pushed with lease. The new
work is isolated on `feat/temp-at-depth-nodd`.

## 3–4. NODD implementation and accuracy validation

Validation cycles:

- `2026-10-12T00:00:00Z`
- `2026-10-12T06:00:00Z`

Both THREDDS and NODD were complete/readable for every model at both cycles.
Comparisons used f000, f024, f072, and f120 after independent interpolation and
regridding to the production 0.01° output grid.

PASS limits applied independently to every row:

- mean absolute difference ≤ 1.0°F
- 95th-percentile absolute difference ≤ 2.0°F
- mean bias within ±0.5°F

Bias is NODD minus THREDDS.

| Model / lake | Depth | MAE °F | P95 abs °F | Bias °F | Mask agreement | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| LSOFS / Superior | 10 ft | 0.125 | 0.482 | -0.075 | 99.14% | PASS |
| LSOFS / Superior | 20 ft | 0.071 | 0.265 | -0.001 | 98.72% | PASS |
| LSOFS / Superior | 30 ft | 0.075 | 0.261 | +0.019 | 98.70% | PASS |
| LSOFS / Superior | 40 ft | 0.090 | 0.298 | +0.037 | 98.67% | PASS |
| LSOFS / Superior | 50 ft | 0.123 | 0.385 | +0.074 | 98.64% | PASS |
| LMHOFS / Michigan–Huron | 10 ft | 0.085 | 0.239 | +0.018 | 97.26% | PASS |
| LMHOFS / Michigan–Huron | 20 ft | 0.069 | 0.243 | +0.017 | 97.32% | PASS |
| LMHOFS / Michigan–Huron | 30 ft | 0.087 | 0.306 | +0.036 | 97.45% | PASS |
| LMHOFS / Michigan–Huron | 40 ft | 0.109 | 0.373 | +0.063 | 97.31% | PASS |
| LMHOFS / Michigan–Huron | 50 ft | 0.147 | 0.484 | +0.104 | 97.31% | PASS |
| LEOFS / Erie | 10 ft | 0.035 | 0.090 | +0.009 | 97.02% | PASS |
| LEOFS / Erie | 20 ft | 0.023 | 0.077 | +0.008 | 97.30% | PASS |
| LEOFS / Erie | 30 ft | 0.029 | 0.094 | +0.014 | 98.49% | PASS |
| LEOFS / Erie | 40 ft | 0.040 | 0.159 | +0.025 | 97.71% | PASS |
| LEOFS / Erie | 50 ft | 0.141 | 0.469 | +0.133 | 98.49% | PASS |
| LOOFS / Ontario | 10 ft | 0.087 | 0.312 | +0.025 | 97.47% | PASS |
| LOOFS / Ontario | 20 ft | 0.107 | 0.349 | +0.076 | 97.69% | PASS |
| LOOFS / Ontario | 30 ft | 0.155 | 0.446 | +0.130 | 97.49% | PASS |
| LOOFS / Ontario | 40 ft | 0.221 | 0.545 | +0.206 | 98.05% | PASS |
| LOOFS / Ontario | 50 ft | 0.305 | 0.669 | +0.295 | 97.96% | PASS |

All rows passed, so no failure comparison maps were required. Machine-readable
results are in `depth-source-validation.json` and
`depth-source-validation.csv` beside this report.

## 5. Safety and fallback coverage

Tests cover:

- NODD output at all five launch depths;
- strict shallow-water/lakebed masking;
- use of top/bottom layer values only inside their `siglev` cell bounds;
- THREDDS preference when all four models are ready;
- coherent fallback from THREDDS to validated NODD;
- unavailable state when neither source works or a NODD model is unvalidated;
- rejection of mixed THREDDS/NODD source sets;
- staging-only forced source selection and production refusal;
- source-specific immutable run bases;
- depth pointer written last;
- depth pointer surface-run match and client rejection of mismatches;
- mutable pointer cache classification and surface-versioned pointer requests.

## 6. Staging proof

Staging only:

- Worker: `piercast-map-gate-staging`
- Worker version: `bb7f32de-cc71-449e-94f3-549b1afb4168`
- R2: `piercast-lake-map-staging`
- feature: `tempDepth=on`
- capabilities: `u8`, `rgb16`, `tempDepth`
- staging surface run: `20261012T06Z-10120946`
- staging cycle: `2026-10-12T06:00:00Z`

THREDDS proof:

- depth run/surface match: `20261012T06Z-10120946`
- immutable base: `runs/tdepth-20261012T06Z-10120946-thredds/`
- generated at: `2026-10-12T17:56:49Z`
- 212 objects; five manifests × 41 frames; 205 PNGs
- minimum model/depth coverage: 99.9–100.0%
- complete build/upload: 1,487 seconds

NODD proof:

- depth run/surface match: `20261012T06Z-10120946`
- immutable base: `runs/tdepth-20261012T06Z-10120946-nodd/`
- generated at: `2026-10-12T18:06:34Z`
- 212 objects; five manifests × 41 frames; 205 PNGs
- minimum model/depth coverage: 99.9–100.0%
- complete build/upload: 467 seconds
- final staging pointer: NODD

Frame plausibility over f000/f024/f072/f120:

| Source | Model | Full range °F | Median 10 ft | Median 50 ft | 50 ft at/below 10 ft |
| --- | --- | ---: | ---: | ---: | ---: |
| THREDDS | LSOFS | 42.70–62.55 | 52.90 | 51.80 | 87.37% |
| THREDDS | LMHOFS | 42.75–67.10 | 58.10 | 57.35 | 86.12% |
| THREDDS | LEOFS | 56.05–67.10 | 64.50 | 64.20 | 77.75% |
| THREDDS | LOOFS | 45.80–64.65 | 59.80 | 57.45 | 93.45% |
| NODD | LSOFS | 42.50–62.65 | 52.80 | 51.85 | 84.33% |
| NODD | LMHOFS | 42.75–67.10 | 58.10 | 57.40 | 82.37% |
| NODD | LEOFS | 56.10–67.10 | 64.50 | 64.35 | 68.45% |
| NODD | LOOFS | 45.25–64.70 | 59.80 | 57.70 | 94.05% |

Every range is plausible, and deeper water is colder where expected in the
aggregate. The smallest gradient is Erie, where the fall water column is
largely mixed; its 50-ft median is still not warmer than its 10-ft median.

The browser returned HTTP 200 at every requested size/location. Temp at Depth
was visible, enabled, selected, and labeled `at 30 ft` for both sources.

Screenshot paths:

- `screenshots/thredds/393x852-superior.png`
- `screenshots/thredds/393x852-ontario.png`
- `screenshots/thredds/320x568-superior.png`
- `screenshots/thredds/320x568-ontario.png`
- `screenshots/nodd/393x852-superior.png`
- `screenshots/nodd/393x852-ontario.png`
- `screenshots/nodd/320x568-superior.png`
- `screenshots/nodd/320x568-ontario.png`

Browser metadata is in `browser-results-thredds.json` and
`browser-results-nodd.json`; frame audits are in
`staging-frame-audit-thredds.json` and `staging-frame-audit-nodd.json`.

## 7. Final tests

- lake-map Python: 143 passed, 0 failed
- lake-map Node: 88 passed, 0 failed
- page build: passed
- TypeScript `npx tsc --noEmit`: passed
- app scripts: 200 passed, 0 failed
- two-cycle live accuracy matrix: 20/20 lake-depth rows passed
- forced THREDDS staging build/upload: passed
- forced NODD staging build/upload: passed
- phone browser matrix: 8/8 passed

## Pull request

PR: #70 — `feat/temp-at-depth-nodd` → `main`

The PR is not merged. Production `features.json`, `capabilities.json`, map page,
R2 objects, workflow, database, Edge Functions, app release policy, EAS, legal
site, and historical backfill were not changed.

Impact on live 1.14/1.15/1.16/1.17: **none**.
