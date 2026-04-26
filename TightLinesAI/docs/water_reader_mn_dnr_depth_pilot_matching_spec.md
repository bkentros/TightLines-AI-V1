# Minnesota DNR bathymetry — pilot matching spec

**Status:** Operational spec for the MN-only depth attachment pilot.  
**Product source of truth:** `WATER_READER_MASTER_PLAN.md`

## Source

- **Registry key:** `mn_dnr_bathymetric_contours`
- **Layer:** Minnesota DNR `DNR_water_lake_bathymetric_contours` (ArcGIS FeatureServer layer 0), polyline contours stored in **EPSG:26915 (NAD83 / UTM 15N)**.
- **Authoritative lake identifier in this layer:** **`DOWLKNUM`** (string, DNR lake / basin number). **`LAKE_NAME`** is display text and may omit leading “Lake”, use basin suffixes (e.g. `Minnetonka-Grays Bay`), or differ from GNIS preferred names (e.g. `Calhoun` vs `Bde Maka Ska`).

## Three URL roles (do not conflate)

| Role | Where stored | Purpose |
|------|----------------|---------|
| **Usable fetch URL** | `waterbody_source_links.source_path` | **On-demand** GET that returns **contour geometry** plus **depth-related attributes** for the matched lake (`f=geojson`, `returnGeometry=true`, `outSR=4326`, explicit `outFields`, lake-specific `where` on `DOWLKNUM`, `resultRecordCount` with paging). This is what a future extraction client would call (still subject to `can_fetch` / storage flags). |
| **Reachability / existence probe** | `metadata.fetch_validation_url` | **Light** ArcGIS query (`f=pjson`, `returnCountOnly=true`, `returnGeometry=false`, same lake `where`). Used by `waterbody-source-validation` for HEAD/GET reachability so validation does not download full GeoJSON. |
| **Future extraction / adapter URL** | *Not separate today* | Same as **`source_path`**, plus paging via `resultOffset` when `exceededTransferLimit` is true. Any normalized “tile” or export URL would be a **new** reviewed link row if introduced later. |

**Important:** Depth availability must **not** be asserted from **count-only** URLs alone. Count probes are **supporting** evidence that features exist; **honest** depth mode presumes callers can retrieve **vector geometry + depth fields** via `source_path`.

## How `waterbody_index` maps to DNR

| Step | Rule |
|------|------|
| 1 | Restrict to **`state_code = 'MN'`** and **`waterbody_type` in (`lake`,`pond`,`reservoir`)**. |
| 2 | For each candidate lake, query the DNR layer for **distinct `DOWLKNUM` / `LAKE_NAME`** using ArcGIS `query` with `returnDistinctValues=true` (and `f=pjson`). |
| 3 | **Accept a match** only when: **(a)** DNR returns at least one contour row for the chosen `where` clause, and **(b)** the match is justified under one of the evidence patterns below. |
| 4 | **Do not** attach using only the FeatureServer root (`.../FeatureServer/0?f=pjson`). The stored **`source_path`** must be a **lake-specific** `.../query?...` URL that returns **GeoJSON features** (see table above). |

### Evidence patterns for `lake_match_status = matched`

1. **Single-basin DOW** — One `DOWLKNUM` uniquely identifies the lake in DNR (e.g. Mille Lacs `48000200`, Waconia `10005900`, Lake of the Isles `27004000`, Bde Maka Ska `27003100`). **Evidence:** DNR distinct query + agreement with **`canonical_name` + `county_name`** on `waterbody_index` (disambiguate homonyms). Optional: **`gnisid`** in `source_summary` for audit.  
2. **Multi-basin aggregate** — USGS 3DHP uses one polygon for a lake that DNR splits (e.g. Lake Minnetonka: many `270133xx` basins; Leech Lake: main + Kabekona `11020301`/`11020302`). **Evidence:** enumerated **`DOWLKNUM` list** from DNR whose names are all basins of the same named system, and **`waterbody_index` county + name** correspond to that system (no conflicting homonym in same county).  
3. **GNIS / legacy name mismatch** — DNR may retain a prior name (e.g. `Calhoun` vs `Bde Maka Ska`). **Evidence:** distinct DNR query shows one `DOWLKNUM` and **spatial/county/name** alignment with the 3DHP row (and optional GNIS cross-check from state data). *Pilot used DNR `LAKE_NAME = 'Bde Maka Ska'` with DOW `27003100`.*

### Technical usability (`usability_status = usable`)

For this pilot, a link is **usable** when:

- **`source_path`** is a valid **HTTPS** ArcGIS **GET** that returns **`FeatureCollection`** GeoJSON with **`LineString`** (or MultiLineString) geometries and properties including **`DEPTH`**, **`abs_depth`**, **`DOWLKNUM`**, **`LAKE_NAME`**, **`OBJECTID`** (see layer schema). **`outSR=4326`** is required on the fetch URL so output coordinates are **WGS84**.  
- **`metadata.fetch_validation_url`** is the **count-only** twin (same `where`) for Edge reachability checks.  
- **Paging:** layer `maxRecordCount` is **4000**; large lakes may set `properties.exceededTransferLimit` / `exceededTransferLimit` on the collection. Clients must repeat with **`resultOffset`** until complete (documented in `metadata.paging`).  
- **`depth_source_kind`** remains **`machine_readable`**. **Extraction** and **caching of derived features** are **out of scope** until registry `can_store_*` flags allow it (`on_demand_only` in metadata restates this).

### Review and rights

- **`source_registry`** row must remain **`review_status = allowed`**, **`can_fetch = true`**, with **`approval_status = approved`** on the link before counting toward availability.  
- Storage flags on the registry (`can_store_*`) remain **false** for this source until a separate rights review explicitly allows derived persistence.

## Pilot scope

- **Batch size:** six Minnesota lakes (see migrations `20260425163000` / `20260425204500`).  
- **Non-pilot rows:** no `waterbody_source_links` for non-pilot `waterbody_id` values.
