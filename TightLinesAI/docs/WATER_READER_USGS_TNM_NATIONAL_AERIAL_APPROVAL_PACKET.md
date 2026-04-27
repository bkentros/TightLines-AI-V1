# Water Reader — USGS The National Map (TNM) national aerial — approval packet

**Audience:** Brandon, legal, product.  
**Status:** **Brandon-approved** conservative on-demand use of **USGS-hosted** TNM orthoimagery (see §8). **Launch (source availability):** In **production (V1)**, policy **`usgs_tnm_naip_plus_national`** is **`is_enabled = true`** (**CONUS-first**); **`coverage.exclude_state_codes`** = **`["AK","HI","PR","GU","MP"]`**. At enable, **`waterbody_availability_snapshot.aerial_available`** = **122,314**; **0** excluded-region policy-aerial violations. This documents **honest aerial source-path availability** in the snapshot — **not** a built satellite map, Water Reader report flow, extraction, scoring, overlays, renderer, daily conditions, or recommender. **Esri-hosted NAIP** (`esri_naip_public`) is **not** the national policy source.  
**Product source of truth:** `WATER_READER_MASTER_PLAN.md` (§0.4, §0.4.7, §0.5.17).  
**Current production:** registry + **enabled** CONUS-first policy (ops `UPDATE` after migrations); storage/cache flags on **`source_registry`** unchanged (**no** new persistence tier).

---

## 1. Candidate provider and endpoints (under consideration)

| Role | USGS-documented pattern | Example REST root (technical) |
|------|-------------------------|--------------------------------|
| Cached orthoimagery basemap | **USGS Imagery Only** — tile cache; sources vary by scale | `https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer` |
| NAIP-oriented overlay (dynamic) | **NAIP Plus** — per USGS, includes **1 m NAIP** | Listed under Theme Overlays via **National Map Services** directory |

**Service directory (official):** [The National Map Services](https://apps.nationalmap.gov/services/)  
**ImageServer family (operational; NAIP + HRO mix per USGS service metadata):** `https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer` — **bound in V1** as registry `usgs_tnm_naip_plus` / policy `usgs_tnm_naip_plus_national` (**CONUS-first** source availability; not report/map UX).

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

### 6.1 CONUS-first launch posture (product)

- **Decision:** Policy-driven footprint is **CONUS-oriented**: **`coverage.exclude_state_codes`** = **`["AK","HI","PR","GU","MP"]`** until coverage QA may clear them.
- **Mechanism:** Migration **`20260427210000_water_reader_usgs_tnm_conus_coverage_exclusions.sql`** merges exclusions into **`coverage`** and keeps **`is_enabled = false`**; **production enable** (**`is_enabled = true`**) was a **separate** guarded ops step after health probe — **source availability only**.
- **After QA:** Shrink or clear exclusions via follow-up migration/ops update when product/legal agree TNM claims are honest for excluded regions.

---

## 7. Rate limits / operational caveats

- USGS publicly documents **service behavior** (cached vs dynamic, tile size, compression for USGSImageryOnly) in the FAQs above; **FinFindr did not rely on a single consolidated public “API rate limit” page** for this packet.
- **Operational:** conservative request rates, **no** tile harvesting at national scale, monitor **HTTP errors** / throttling, contact **USGS National Map** support if sustained production volume: [tnm_help@usgs.gov](mailto:tnm_help@usgs.gov) (referenced from USGS TNM bulk-vector FAQ pattern).

---

## 8. Legal / product decision (record outcome here)

| Decision | Detail |
|----------|--------|
| **Recorded approval** | **Brandon** approved **conservative Water Reader V1** use of **USGS-hosted** The National Map **aerial/orthoimagery** services as an **on-demand** aerial provider, with **required attribution**, **conservative request rates**, **no bulk download/scraping**, and **no persistent storage** of original imagery, mosaics, normalized rasters, derived features, rendered report tiles, or fish-zone outputs **unless separately approved**. |
| **Date** | **2026-04-26** |
| **Explicitly not approved** | **Esri-hosted NAIP** as national/default aerial (`esri_naip_public` remains **fixture-only** for this product story). |
| **Source availability launch** | **Brandon approved** enabling **`is_enabled = true`** for **`usgs_tnm_naip_plus_national`** in **V1** for **CONUS-first** availability only (**122,314** `aerial_available` at launch). **Not authorized:** storage, extraction, scoring, overlays, renderer, frontend report, daily conditions, recommender (see §14). |
| **Outside counsel / scale** | May still refine automated scale or future **storage** tiers; engineering pauses if that conflicts with §3–§4. |
| **CONUS-first exclusions** | **`exclude_state_codes`** = **`["AK","HI","PR","GU","MP"]`** until QA clears them (see §6.1). |

**Prior template (superseded for Brandon scope above):**

| Option | When to use |
|--------|-------------|
| **Approved** | Counsel + product agree TNM FAQ and credits support **intended commercial on-demand use** and **default no-persistence** posture; endpoints and attribution finalized. |
| **Not approved** | Material disagreement with product goals or unacceptable risk. |
| **Needs counsel** | **Default** until **explicit** sign-off on **automated server-side** use at expected scale and any **future** storage/analysis tier. |

---

## 9. Production activation steps (**only after** written approval)

**Repo:** Migrations seed **`source_registry`** (`usgs_tnm_naip_plus`) and policy **`usgs_tnm_naip_plus_national`** (**`is_enabled = false`** in SQL files); **CONUS exclusions** merged by **`20260427210000_…sql`**.

1. Add/update **`source_registry`** row: `source_type = aerial_imagery`, **`source_format = arcgis_image_server`** for USGS **`USGSNAIPPlus`** ImageServer on **`imagery.nationalmap.gov`** (see §1 and official REST directory). **`provider_health_check_url`** = `.../ImageServer?f=pjson`, **`license_url`** = TNM terms FAQ, **`can_store_*` = false**, **`can_cache_rendered_output` = false**. **MapServer basemaps** still require a **separate** `source_format` migration if ever chosen.
2. Insert/update **`water_reader_aerial_provider_policies`** row; **`approval_status`** reflects product sign-off (**`approved`** per §8).
3. Run internal **`waterbody-source-validation`** policy probe (`aerial_provider_policy`); confirm **`provider_health_status = reachable`** before enable.
4. **`is_enabled = true`** only after **explicit** launch approval — **done for V1 CONUS-first source availability** (§8). **Does not** ship report/map product behavior. Monitor availability view, USGS health, and Edge.
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

- **Brandon scope (§8) is recorded** for **USGS-hosted TNM** on-demand use; **outside counsel** may still refine scale or storage tiers.
- **Technically prefer USGS-hosted TNM** endpoints over Esri mirrors for the **national** story unless Esri is explicitly approved.

---

## 12. Open legal / product questions

1. Does **public-domain** language in the TNM FAQ extend to **all** contemplated **server-side** uses (including **ML/feature extraction** if ever proposed)?  
2. Any **additional** USGS or USDA **attribution** beyond the requested acknowledgment?  
3. **Volume / fairness** — any **unwritten** operational expectations from USGS for **sustained** production traffic?  
4. **Product truth:** Basemap **vs** NAIP-only narrative for anglers?

---

## 13. Next step

- **Engineering / ops:** Monitor **USGS** reachability and **`waterbody_availability_snapshot`**; policy probes on **enabled** approved policies require **`allowApprovedEnabledPolicyProbe: true`** in the validation body. **Rollback:** set **`is_enabled = false`** if needed (see §10).  
- **Legal/ops:** Optional counsel pass on sustained scale; contact USGS TNM support if production volume warrants.

---

## 14. Launch outcome — source availability only (record)

| Item | Record |
|------|--------|
| **What shipped** | **`waterbody_availability_snapshot`** reflects **CONUS-first** USGS TNM **aerial source availability** for policy-eligible rows; policy **`usgs_tnm_naip_plus_national`** **`is_enabled = true`** (V1). |
| **Launch metric** | **`aerial_available` true:** **122,314** (with exclusions **AK, HI, PR, GU, MP**; **0** policy-aerial rows in excluded regions at audit). |
| **What did not ship** | **No** imagery **storage** tier, **extraction**, **scoring**, **overlays**, **renderer**, **Water Reader frontend report**, **daily conditions**, or **recommender** handoff — unchanged by this launch. |
| **Wording** | Prefer **“source availability”** / **“availability snapshot”** — avoid implying a **finished satellite view** or **report UX** exists solely because **`aerial_available`** is true. |
