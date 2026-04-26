# Water Reader — USGS The National Map (TNM) national aerial — approval packet

**Audience:** Brandon, legal, product.  
**Status:** Review only — **no** national/default aerial is approved by this document.  
**Product source of truth:** `WATER_READER_MASTER_PLAN.md` (§0.4, §0.4.7).  
**Current production:** `water_reader_aerial_provider_policies` exists; **0** rows; **Esri `esri_naip_public` remains fixture-only**, not the national default.

---

## 1. Candidate provider and endpoints (under consideration)

| Role | USGS-documented pattern | Example REST root (technical) |
|------|-------------------------|--------------------------------|
| Cached orthoimagery basemap | **USGS Imagery Only** — tile cache; sources vary by scale | `https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer` |
| NAIP-oriented overlay (dynamic) | **NAIP Plus** — per USGS, includes **1 m NAIP** | Listed under Theme Overlays via **National Map Services** directory |

**Service directory (official):** [The National Map Services](https://apps.nationalmap.gov/services/)  
**ImageServer family (operational; NAIP + HRO mix per USGS service metadata):** e.g. `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer` — **confirm exact production URL and layer metadata in USGS directory before binding.**

**Not in scope for this packet:** Esri-hosted NAIP mirrors (separate third-party terms).

---

## 2. Official license / terms / credits (source-backed)

| Topic | URL |
|--------|-----|
| **TNM map services & data — terms** | [What are the Terms of Use/Licensing for map services and data from The National Map?](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map) |
| **USGS copyrights & credits** | [Copyrights and Credits](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits) |
| **Imagery services (cached vs dynamic, NAIP mention)** | [URLs for imagery services in The National Map](https://www.usgs.gov/faqs/what-are-urls-imagery-services-national-map-and-are-they-cached-or-dynamic) |
| **Base map URLs (USGS Imagery Only, etc.)** | [Base map services used in The National Map](https://www.usgs.gov/faqs/what-are-base-map-services-or-urls-used-national-map) |
| **NAIP program (context)** | [USGS EROS — NAIP](https://www.usgs.gov/centers/eros/science/usgs-eros-archive-aerial-photography-national-agriculture-imagery-program-naip); [FSA NAIP](https://www.fsa.usda.gov/programs-and-services/aerial-photography/imagery-programs/naip-imagery) |

**USGS TNM FAQ (paraphrase for review):** Map services and data from The National Map are described as **free and in the public domain**, with **no restrictions stated**; USGS **requests** acknowledgment when citing/copying/reprinting (exact wording in §5 below). **Counsel should confirm** this language covers **FinFindr’s intended commercial, server-side, automated, on-demand** use and any **future** analysis/storage tier.

---

## 3. Intended use (if approved)

- **V1 posture:** **On-demand** access to **documented** TNM endpoints only (e.g. ImageServer/MapServer **metadata** and **small** map/image requests aligned to a lake viewport — **no** bulk mosaic download, **no** scraping of arbitrary pages).
- **Analysis:** Any **feature extraction, persistent caches, or report tiles** only after a **written** storage/derivation decision per **§0.4.5** of the master plan.

---

## 4. Storage posture (default; aligns with master plan §0.4.5)

Until explicitly approved in writing for a given tier:

- **Do not store:** original imagery, full mosaics, normalized rasters, derived structure features, rendered report tiles.
- **Do store:** registry metadata, policy row, attribution text, license pointers, provider health, operational notes.

---

## 5. Attribution

**USGS-requested acknowledgment (from TNM terms FAQ):**

> Map services and data available from U.S. Geological Survey, National Geospatial Program.

**Also follow:** [Copyrights and Credits](https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits) for product-specific credit lines.

**Product copy:** User-facing text should **not** imply “every pixel is NAIP” if **USGS Imagery Only** or composite services are used (see §6).

---

## 6. Coverage caveats (officially documented themes)

- **USGS Imagery Only:** “**Combines imagery from the U.S.**; resolution **may vary** from **6 inches to 1 meter**.” ([base map FAQ](https://www.usgs.gov/faqs/what-are-base-map-services-or-urls-used-national-map))
- **Scale / source mix:** Imagery FAQ states services use **different sources depending on view scale**; **NAIP Plus** is cited as including **1 m NAIP** ([imagery services FAQ](https://www.usgs.gov/faqs/what-are-urls-imagery-services-national-map-and-are-they-cached-or-dynamic)).
- **AK / HI / territories:** Treat coverage, vintage, and source mix as **not assumed uniform** until confirmed from **service metadata** and USGS/USDA product documentation for each region.

---

## 7. Rate limits / operational caveats

- USGS publicly documents **service behavior** (cached vs dynamic, tile size, compression for USGSImageryOnly) in the FAQs above; **FinFindr did not rely on a single consolidated public “API rate limit” page** for this packet.
- **Operational:** conservative request rates, **no** tile harvesting at national scale, monitor **HTTP errors** / throttling, contact **USGS National Map** support if sustained production volume: [tnm_help@usgs.gov](mailto:tnm_help@usgs.gov) (referenced from USGS TNM bulk-vector FAQ pattern).

---

## 8. Legal / product decision (record outcome here)

| Option | When to use |
|--------|-------------|
| **Approved** | Counsel + product agree TNM FAQ and credits support **intended commercial on-demand use** and **default no-persistence** posture; endpoints and attribution finalized. |
| **Not approved** | Material disagreement with product goals or unacceptable risk. |
| **Needs counsel** | **Default** until **explicit** sign-off on **automated server-side** use at expected scale and any **future** storage/analysis tier. |

---

## 9. Production activation steps (**only after** written approval)

**No step below is authorized until §8 is “Approved.”**

1. Add **`source_registry`** row (migration or controlled ops): `source_type = aerial_imagery`. **If the chosen USGS endpoint is an ArcGIS ImageServer** (e.g. TNM NAIP-oriented ImageServer), set **`source_format = arcgis_image_server`** (this value exists in the current schema). **`provider_health_check_url`** = service `?f=pjson` (or USGS-documented health target), **`attribution_text`**, **`license_url`** = TNM terms FAQ URL, **`can_store_*` = false** until a separate storage decision. **If product/legal instead chooses the USGSImageryOnly MapServer (tiled basemap),** today’s `source_registry.source_format` **has no MapServer enum** — engineering must **add and review** a schema-compatible `source_format` (via migration) **or** pick another **explicit** registry representation; **do not** use a generic `arcgis` / MapServer placeholder that the schema does not support.
2. Insert **`water_reader_aerial_provider_policies`** row: **`is_enabled = false`**, **`approval_status = pending_review`**, **`policy_key`** stable, **`coverage`** JSON (e.g. `exclude_state_codes` for any region excluded until verified).
3. Run internal **`waterbody-source-validation`** policy probe; set **`approval_status = approved`** only after legal/product.
4. **`is_enabled = true`** only after explicit launch decision; monitor availability view and Edge health.
5. **Do not** use **`esri_naip_public`** as the national policy **`source_id`** unless Esri path is separately approved.

---

## 10. Risks and rollback

| Risk | Mitigation / rollback |
|------|------------------------|
| **Misleading “NAIP” labeling** | Use **USGS / TNM** naming; disclose **composite / scale-dependent** sources. |
| **Throttling or blocking** | On-demand only; backoff; reduce concurrency; contact USGS support. |
| **AK/HI/territory gaps** | Use **`coverage.exclude_state_codes`** or equivalent until verified. |
| **Rollback** | Set **`is_enabled = false`**; optionally **`approval_status = pending_review`**; **`DELETE` policy row** if abandoning TNM path. **Registry row** may remain **blocked** or **restricted** if product retires the path. |

---

## 11. Recommendation (non-legal)

- **Treat as “needs counsel”** until counsel confirms the **TNM public-domain FAQ** fully covers **FinFindr’s commercial, automated, on-demand** pattern and any **future** persistence.
- **Technically prefer USGS-hosted TNM** endpoints over Esri mirrors for a **single federal license story**, unless Esri is explicitly approved.

---

## 12. Open legal / product questions

1. Does **public-domain** language in the TNM FAQ extend to **all** contemplated **server-side** uses (including **ML/feature extraction** if ever proposed)?  
2. Any **additional** USGS or USDA **attribution** beyond the requested acknowledgment?  
3. **Volume / fairness** — any **unwritten** operational expectations from USGS for **sustained** production traffic?  
4. **Product truth:** Basemap **vs** NAIP-only narrative for anglers?

---

## 13. Next step

- **Brandon/legal:** Mark §8 **Approved / Not approved / Needs counsel** and date.  
- **Engineering (only after approval):** Execute §9 using **migrations + internal validation**; keep **`water_reader_aerial_provider_policies`** rows **disabled** until sign-off.
