# Water Reader National Waterbody Ingest

This document describes the backbone ingest path for the Water Reader named U.S. lake/pond/reservoir index.

The active product source of truth remains `docs/WATER_READER_MASTER_PLAN.md`. This file is operational detail for the national identity ingest step only.

## Source Choice

Primary waterbody source:

- **USGS 3D Hydrography Program `3DHP_all` Waterbody layer**
- Service: `https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60`
- Staging filter: `featuretype = 3 AND gnisidlabel IS NOT NULL`

Why this source:

- It is the current USGS national hydrography path replacing the retired NHD maintenance path.
- The `Waterbody` layer is polygonal and national.
- The `featuretype = 3` domain is **Lake**, defined by USGS as standing water surrounded by land, including natural and manmade lakes, ponds, and reservoirs.
- The layer carries `gnisidlabel`, `areasqkm`, geometry, and source identifiers needed for named-waterbody identity. `gnisid` is kept when present, but it is not required for staging because promotion accepts named standing-water records by `gnisidlabel`.

Boundary attribution source:

- **U.S. Census TIGERweb State/County counties layer**
- Service: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/25`

Why this source:

- 3DHP waterbody polygons do not guarantee state and county names directly.
- Water Reader disambiguation requires `name + state + county`.
- The ingest pipeline uses centroid-to-county spatial attribution, then stores state and county on the canonical `waterbody_index` record.

Optional alias source:

- **GNIS All Names** pipe-delimited download.
- The script can stage variant names by GNIS ID when a local GNIS All Names file is supplied.

## Pipeline

The ingest is intentionally two-step:

1. Stage raw national source features in private tables.
2. Promote only eligible named standing-water records into `public.waterbody_index`.

The private schema is `water_reader_private`. It contains:

- `waterbody_ingest_runs`
- `us_county_boundaries`
- `usgs_3dhp_waterbody_stage`
- `gnis_alias_stage`
- promotion helpers and `promote_usgs_3dhp_waterbodies(...)`

Promotion rules:

- Only 3DHP `featuretype = 3` records are eligible.
- Records must have a non-empty `gnisidlabel`.
- Records must spatially resolve to a county boundary.
- Public search remains protected by the existing `search_waterbodies` RPC filter: `lake`, `pond`, and `reservoir` only.
- Duplicate-name disambiguation remains `name + state + county`.
- Waterbody type is normalized from the name:
  - names containing `reservoir` or `res` become `reservoir`
  - names containing `pond` become `pond`
  - remaining standing-water features become `lake`

## Usage

Generate a meaningful subset SQL file:

```bash
npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/3dhp-mn-subset.sql \
  --include-counties \
  --bbox -97.5,43.4,-89.0,49.4 \
  --limit 5000
```

The script first tries TIGERweb for county boundaries. If TIGERweb rejects automated GeoJSON access, it falls back to the Census 2024 cartographic county boundary ZIP and converts the shapefile locally.

The fallback converter preserves multipart counties as GeoJSON `MultiPolygon` features. It does not flatten all shapefile rings into a single polygon. Rings are grouped by containment so disjoint county parts remain separate polygons and holes remain holes before PostGIS stores them as `MultiPolygon` geometry for county attribution.

Generate the national SQL file:

```bash
npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/3dhp-national.sql \
  --include-counties
```

**Chunked national load (recommended):** Do not rely on a single multi-gigabyte file. Use one shared `--ingest-run-id`, `--target-scope national`, OBJECTID `WHERE` ranges (~10k rows each), and `psql` per chunk. See **`WATER_READER_MASTER_PLAN.md` §0.5.15** for counts, ranges, verification SQL, and the explicit approval / `DATABASE_URL` gate.

A local `tmp/water-reader/national/chunk-manifest.json` (gitignored) can list each chunk’s `objectid_min` / `objectid_max`, `apply_order`, and a `verification` block: sum of `approx_rows` should equal ~`125,845`, **`objectid_overlaps` must be empty**, and **`objectid_gaps_between_chunks`** records expected unused OBJECTID spans between ranges (non-matching layer rows), not missing waterbodies.

Summary of generator flags used nationally:

| Flag | Role |
| --- | --- |
| `--ingest-run-id` | Same UUID on every chunk |
| `--target-scope national` | Stable scope on the init SQL |
| `--include-counties` / `--skip-waterbodies` | `000-counties.sql` only |
| `--skip-ingest-run-row` | Waterbody chunks `001+` so the ingest run row is not re-upserted |
| `--skip-promote` | All staging chunks |
| `--promote-only` | `999-promote.sql` |

Apply generated SQL:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tmp/water-reader/3dhp-national.sql
```

Optional aliases:

```bash
npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/3dhp-national-with-aliases.sql \
  --include-counties \
  --gnis-all-names-file path/to/GNIS_AllNames.txt
```

## What This Does Not Do

This ingest does not:

- attach aerial or depth source links
- claim depth availability
- build species scoring
- extract aerial features
- extract depth features
- render maps or report screens
- build daily-condition logic

It only moves Water Reader from fixture/sample named-waterbody identity toward a real national named lake/pond/reservoir index.
