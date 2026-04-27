# FinFindr Water Reader — Master Plan

**Purpose:** This is the single active source of truth for the Water Reader feature.

**Audience:** Brandon, future developers, and AI coding agents.

**Status:** Active master plan for Water Reader V1 and near-term expansion.

**Replaces:** `WATER_READER_ARCHITECTURE.md` and `WATER_READER_BUILD_PLAN.md` as active planning documents. Those files remain in the repo only as historical reference and must not be used as the execution plan.

---

## 0. Locked decisions

These decisions are locked unless the product direction changes intentionally.

1. **Water Reader V1 species are:**
   - largemouth bass
   - smallmouth bass
   - pike

2. **Trout is excluded from Water Reader V1.**
   - In FinFindr, trout is intentionally tied to river context.
   - Water Reader remains lake/pond-only.

3. **Full national named lake/pond index is required for launch.**
   - Sample or regional data may be used during development.
   - Launch acceptance requires national named-lake/named-pond coverage.

4. **`best_available` is the default source mode.**
   - If both aerial and depth are available, the user may switch modes.
   - Switching modes changes the actual report, not just the basemap.

5. **Aerial and depth are separate evidence engines.**
   - This plan uses `aerial` as the internal term for the satellite-style public imagery mode.
   - Aerial mode identifies visible or geometry-backed characteristics.
   - Depth mode identifies underwater structure from real depth evidence.
   - Aerial mode must not infer real depth structure.

6. **Depth mode uses reviewed and approved sources only in V1.**
   - Random or unreviewed websites do not count as V1 depth intelligence.
   - Machine-readable depth is the primary depth path.
   - Approved aligned chart-image depth is a secondary fallback tier.

7. **Profiles are keyed by species x region x month.**
   - Monthly logic is preferred over coarse seasonal buckets.
   - Transition behavior may use at most one adjacent-month secondary overlay set.

8. **Transition overlays must be visually weaker and lower confidence.**
   - They exist to catch early or delayed seasonal movement.
   - They must not overwhelm the current-month primary overlays.

9. **Daily conditions are required for full V1, but added late.**
   - The core engine must work first from structure + species + region + month + access mode + source quality.
   - Daily conditions are layered in after the baseline engine is stable.

10. **Water Reader does not own `what to throw`.**
    - Recommender remains separate.
    - Any handoff is deferred beyond the core Water Reader report.

11. **Report persistence is conditional on source rights.**
    - If source rights allow persistent derived or rendered output, reports may be saved.
    - If rights are unclear or disallow storage, reports should remain on-demand only.
    - Operational detail: **§0.4** (default on-demand storage; what may or may not be stored).

---

## 0.4 Source policy — rights, scraping, storage, and availability

This section is **normative** for all Water Reader source expansion (depth, aerial, and future evidence types). It sits alongside locked decisions (especially **§0 item 11**) and **§2** core principles. If engineering choices conflict with this policy, **stop and reconcile the plan first**—do not “ship first, rights later.”

### 0.4.1 Eligibility bar

A source (or concrete `source_path`) may be used in production only if it is:

1. **Verified** — reviewed and recorded in the source registry / linkage workflow (not ad-hoc URLs in app code).
2. **Free of unacceptable legal risk** — terms of use, license, and attribution obligations are understood and acceptable to the product; when in doubt, treat as **not usable**.
3. **Legally usable for the intended operation** — including automated server-side fetch, on-demand use in a commercial app, and any storage described in **§0.4.4**; “public on the web” is **not** sufficient.
4. **Reliable enough to trust** — official or well-maintained endpoints, stable identifiers, and honest reachability; flaky or undocumented scrapes do not qualify.
5. **Free for the intended V1 use unless explicitly approved otherwise** — Water Reader V1 source expansion should use free-to-access / free-to-use sources by default. Do not add paid-license datasets, paid API plans, proprietary subscriptions, “personal use only” sources, or usage that creates hidden per-report fees unless Brandon explicitly approves a commercial data arrangement and the registry records the terms.

### 0.4.2 Scraping and scale

- **Do not scrape arbitrary websites** — no HTML parsing, headless browsing, or bulk download of third-party pages unless that pattern is **explicitly** approved under this policy **and** legal review for that provider.
- **Review before scale** — human/source review and registry approval come **before** high-volume fetching, crawling, or background ingestion. Probes (single-lake validation, smoke tests, operator scripts) are allowed **only** on already-approved paths or narrow discovery sandboxes that do **not** write durable asset caches.
- **Prefer APIs and official open data** — REST/Feature services, file downloads hosted by agencies, and documented open-data catalogs are the default discovery targets.
- **Respect provider controls** — approved automation must follow provider terms, attribution requirements, documented rate limits, robots/access restrictions, login requirements, and anti-bulk protections. Do not bypass login walls, CAPTCHA, blocked endpoints, throttling, or other access controls.

### 0.4.3 Approved source classes (examples)

Approved **classes** include, when rights and reliability checks pass:

- **Official state and federal GIS / open-data portals** (e.g. agency ArcGIS REST services, documented download pages).
- **Natural-resource / DNR bathymetry or depth products** explicitly offered for public use under known terms.
- **Official chart or bathymetry libraries** where redistribution and automated access are clearly allowed.
- **Public-domain or clearly licensed open aerial imagery** (e.g. certain government orthoimagery programs) when **license, attribution, and technical use** (including tiling and on-demand vs cache) are explicit.

Each **instance** still requires registry entry, attribution text, validation rules, and per-waterbody linkage where applicable.

### 0.4.4 Disallowed source classes (non-exhaustive)

Unless product and legal explicitly reclassify them:

- **Proprietary chart or mapping platforms** with restrictive ToS, unknown API rights, or “personal / non-commercial only” terms.
- **Random third-party fishing or map sites** with unclear ownership, no stable API, or unknown redistribution rules.
- **Any source that forbids or effectively blocks** the intended automated use (robots prohibitions, login walls, CAPTCHA-gated bulk access, rate abuse, etc.).
- **User-submitted or crowdsourced geometry** as authoritative bathymetry without a separate curation and rights model.

### 0.4.5 Default storage posture

- **Default: on-demand fetch only** — the system stores **how** to reach approved evidence (URLs, query parameters, provider keys in secrets, validation status), not necessarily the heavy payloads.
- **Store metadata and source links first** — registry rows, `waterbody_source_links`, reachability/match/usability fields, attribution strings, license pointers, and **matching evidence** (e.g. DOWLKNUM, basin IDs, reviewer notes).
- **Do not store by default** — original chart images, full-resolution satellite mosaics, bulk normalized geospatial extracts, derived structure features, vectorized “fish zones,” or rendered report tiles **unless** a written rights decision explicitly permits that storage tier for that provider.

When rights **do** allow persistence, record the allowance in registry metadata (flags + notes) so engineers and agents do not guess.

### 0.4.6 Client vs server

- **Mobile app storage stays small** — prefer identifiers, light metadata, and ephemeral render buffers; avoid shipping large static caches of imagery or depth inside the app bundle.
- **Heavy assets stay server-side** (or provider-side) and are fetched **on demand** under the same rights constraints; any server cache is also governed by **§0.4.5**.

### 0.4.7 National aerial

- **National aerial is a coverage/policy problem**, not a goal of hand-entering thousands of per-lake aerial URLs.
- Rollout must go through an **approved national (or regional) provider policy**: one or a small number of registry entries, clear attribution, rate and caching rules, and honest `best_available` behavior—not ad-hoc link rows per lake except where a **documented exception** (e.g. a pilot) is intentional and reviewed.

### 0.4.8 Depth and evidence expansion at scale

- **Provider-by-provider** — add or extend **one provider / dataset family at a time** (e.g. a state contours layer), with registry + validation + linkage patterns proven before the next provider.
- **Automated matching where safe** — deterministic joins (stable IDs, unambiguous basin keys) and scripted candidate generation are encouraged **after** the provider is approved.
- **Manual review for ambiguous cases only** — border waters, multi-basin lakes, generic names, fragment splits, and policy flags require human review and explicit `waterbody_id` linkage; do not bulk auto-insert from naive name/county joins.
- **Do not scale by tiny manual batches forever** — small reviewed batches are acceptable to prove a provider pattern, but the intended production path is provider-level automation: source review → registry entry → deterministic matcher → candidate classification → smoke validation → Edge validation → bulk insert for high-confidence matches. Human review should handle ambiguous or policy-risk rows, not every ordinary lake.
- **Lake-match correctness beats coverage count** — a lake may become `depth_available` only when the source path is reviewed, reachable, lake-matched, and technically usable for that exact waterbody. If the matcher cannot confidently separate homonyms, basin fragments, border waters, or provider naming quirks, leave the row out until reviewed.

---

## 0.5 What Has Been Done

This section summarizes the current implementation state so a new agent can quickly understand where Water Reader stands.

### 0.5.1 Planning status

- `WATER_READER_MASTER_PLAN.md` is now the active source of truth.
- **Source rights, scraping, storage, and availability** are defined in **§0.4**; treat that section as mandatory reading before new source expansion.
- Water Reader product boundaries have been clarified:
  - lake/pond only
  - species limited to largemouth bass, smallmouth bass, and pike
  - aerial and depth are separate evidence engines
  - full national named lake/pond index is required for launch
  - daily conditions are part of full V1, but added after the baseline engine works
  - Recommender stays separate from the core Water Reader report

### 0.5.2 Backbone work already created

The repo now contains the first Water Reader backbone for:

- named waterbody identity
- named lake/pond search
- duplicate-name disambiguation
- reviewed source registry
- per-waterbody source linkage
- honest source availability resolution
- internal-only source-path validation

In plain terms, the current backbone can now support:

- finding a named lake or pond
- separating lakes with the same name by state and county
- attaching a lake to a canonical identity record
- determining whether aerial and/or depth may honestly be available
- validating a specific linked source path without letting normal users mutate shared validation state

### 0.5.3 What the current backbone is intended to prove

Before Water Reader can mark fishable zones, it must first answer:

1. What exact named lake or pond is this?
2. Do we have an honest aerial path for it?
3. Do we have an honest depth path for it?
4. Is that source path actually reachable?
5. Is the source reviewed, lake-matched, and usable?

That backbone work has been started.

### 0.5.4 Important trust and legality improvements already made

The current implementation now distinguishes between:

- provider health
- source-path reachability
- lake match
- final usability

This matters because Water Reader must not treat:

- a generic reachable provider page
- an unreviewed website
- a mismatched chart
- or a merely reachable URL

as honest depth availability for a specific lake.

Also:

- source validation is no longer a normal user-triggered mutation path
- depth availability now depends on reviewed + reachable + matched + usable depth evidence
- path-specific validation is separated from provider-health concepts
- a corrective follow-up migration has been added so schema rollout can be handled safely

### 0.5.5 What is NOT built yet

The following major pieces are still not built:

- large-scale reviewed source attachment for actual U.S. lakes/ponds
- aerial characteristic identification engine
- depth characteristic identification engine
- species x region x month zone-selection logic
- deterministic `fish here` overlay logic
- rendered Water Reader map output
- full Water Reader report / marked-map **frontend flow** (see **§0.5.19** for the separate **minimal** in-app source preview that exists in the repo working tree)
- late-stage daily-condition integration

So the project is currently in:

- **foundation/backbone stage** (plus a **non-interactive aerial source preview** screen only — **§0.5.19**), not
- **user-ready full Water Reader feature stage** (structured report, zones, renderer)

### 0.5.6 Current recommended next step

The real national named-waterbody identity index now exists in the target database. The next step is no longer to design, prove, or execute the national identity ingest layer; it is to begin honest source coverage work against the real national waterbody backbone.

Recommended order:

1. preserve the national identity load verification and final counts in this plan
2. keep Water Reader in foundation/backbone mode
3. continue honest **source availability** work (**CONUS-first USGS TNM** aerial policy is **live** for snapshot/`aerial_available` — not map/report UX); expand reviewed **depth** and any future aerial paths under §0.4
4. begin state-by-state discovery for machine-readable bathymetry/depth sources
5. preserve the existing trust model: sources must be reviewed, reachable, lake-matched, and usable before they count as available
6. defer extraction, scoring, overlays, renderer, frontend report screens, and daily conditions until identity and source availability are both honest

Do **not** jump into fish-zone scoring, overlays, report rendering, or daily-condition logic before **depth and any future evidence** are reviewed and product approves **§0.4.5** storage/UI work — **national `aerial_available` from USGS TNM** is **not** that approval.

### 0.5.7 National ingest backbone added

The repo now includes a national-ingest-oriented pipeline for named U.S. standing water:

- USGS 3D Hydrography Program `3DHP_all` Waterbody staging
- Census TIGERweb county boundary staging for state/county attribution
- private ingest-run and staging tables
- a promotion function that loads only named `featuretype = 3` standing-water records into `waterbody_index`
- optional GNIS All Names alias staging by GNIS ID
- operational notes in `WATER_READER_NATIONAL_INGEST.md`

This is a real scalable ingest path, and it has now been used to load the national named-waterbody identity backbone in the target Supabase project. Other environments still need their own explicit load if required.

### 0.5.8 National ingest cleanup

The ingest backbone has been tightened so staging and promotion now agree on named standing-water eligibility:

- 3DHP staging keeps the standing-water rule (`featuretype = 3`)
- staging no longer requires `gnisid` when `gnisidlabel` is present
- promotion still requires a non-empty `gnisidlabel`
- Census county fallback conversion now preserves multipart county polygons instead of flattening all rings into one polygon

This cleanup is still only part of the national named-waterbody identity backbone. It does not attach sources, extract features, score species, render reports, or create user-facing Water Reader screens.

### 0.5.9 Current evaluation of plan trajectory

The plan trajectory is still the right one:

1. establish national named-waterbody identity
2. prove search and duplicate disambiguation
3. attach reviewed source availability honestly
4. build source-specific characteristic extraction
5. build deterministic species/month/access scoring
6. render and explain the structured output
7. add daily-condition enhancement late

The important adjustment is sequencing discipline. Water Reader should not proceed to aerial/depth intelligence until the named-waterbody identity backbone is live and trustworthy in the real database. The current risk is not product concept risk; it is data-operational risk around schema application, regional promotion, search behavior, and national import scale.

### 0.5.10 Current implementation map

Current Water Reader backbone files:

- `supabase/migrations/20260424133337_water_reader_waterbody_backbone.sql`
  - public waterbody identity, aliases, source registry, source links, availability view, search RPC, and fixture rows
- `supabase/migrations/20260424142418_water_reader_validation_path_specific_cleanup.sql`
  - path-specific validation cleanup and provider-health separation
- `supabase/migrations/20260426220000_water_reader_aerial_provider_policies.sql`
  - aerial **provider policy** table + snapshot OR; first file has **no** seeded policy rows — **`20260426230100_…`** seeds USGS TNM policy in repo SQL (**`is_enabled = false`** until ops); **V1** CONUS-first enable per §0.5.17
- `supabase/migrations/20260426230100_water_reader_usgs_tnm_registry_and_aerial_policy.sql`
  - USGS TNM **USGSNAIPPlus** ImageServer `source_registry` row + national policy row seeded **`is_enabled = false`** in repo; **production (V1)** uses **`is_enabled = true`** for CONUS-first **source availability** after ops enable (see 0.5.17)
- `supabase/migrations/20260427210000_water_reader_usgs_tnm_conus_coverage_exclusions.sql`
  - CONUS-first **`coverage.exclude_state_codes`** (`AK`, `HI`, `PR`, `GU`, `MP`); SQL keeps **`is_enabled = false`** — production **`is_enabled = true`** is a **separate** ops step (applied on V1; see §0.5.17)
- `supabase/migrations/20260424145528_water_reader_national_ingest_backbone.sql`
  - private ingest-run tables, county boundary staging, 3DHP waterbody staging, optional GNIS alias staging, and promotion function
- `scripts/water-reader-ingest-3dhp.ts`
  - national-ingest-oriented SQL generator for USGS 3DHP waterbody records and Census county boundaries
- `docs/WATER_READER_NATIONAL_INGEST.md`
  - operational ingest documentation
- `supabase/functions/waterbody-search/index.ts`
  - authenticated/subscription-gated search endpoint
- `supabase/functions/waterbody-source-validation/index.ts`
  - internal-only source-path validation endpoint
- `supabase/functions/_shared/waterReader/`
  - current contracts, availability logic, fetch validation, and internal auth helpers
- `lib/waterReader.ts` and `lib/waterReaderContracts.ts`
  - app-side search client and partial contract mirror

Important status distinction:

- **In repo:** schema, functions, contracts, ingest generator, and docs
- **Proven live (target Supabase):** applied Water Reader schema, promoted regional 3DHP import, full national 3DHP named standing-water identity import, `search_waterbodies` RPC with area + centroid disambiguation (see 0.5.13–0.5.16); `waterbody-search` and `waterbody-source-validation` edge functions deployed (see 0.5.17)
- **Not built:** source attachment at scale, aerial/depth extraction, scoring, overlays, renderer, full Water Reader report flow, daily conditions
- **In repo (app working tree, not a deployment claim):** non-interactive USGS TNM NAIP Plus **source preview** — **§0.5.19**

### 0.5.11 Known cleanup and deployment notes

- There is an empty migration file named `20260424182337_water_reader_validation_path_specific_cleanup.sql`. Treat `20260424142418_water_reader_validation_path_specific_cleanup.sql` as the real validation cleanup migration unless the migration history is intentionally reconciled.
- The `waterbody-source-validation` endpoint requires `WATER_READER_INTERNAL_KEY`; normal users must not be able to mutate validation state.
- `waterbody-search` currently blocks free-tier users. Confirm whether this is desired for internal testing and launch gating before using frontend search as the only verification path.
- The app mirror `lib/waterReaderContracts.ts` is intentionally narrower than the edge-function contracts right now. Keep it aligned for public search response fields as the app uses more Water Reader APIs.
- National 3DHP import should be treated as an operational data load, not as a normal app request path.

### 0.5.12 Pre-national-load validation checklist

Before running the full national import:

- [ ] Confirm target database has PostGIS, `pgcrypto`, and `pg_trgm`.
- [ ] Apply the current Water Reader migrations in order.
- [ ] Confirm `water_reader_private` staging tables exist.
- [ ] Generate a regional SQL import with `--bbox`, `--include-counties`, and a reasonable `--limit`.
- [ ] Apply the generated regional SQL with `psql "$DATABASE_URL" -v ON_ERROR_STOP=1`.
- [ ] Confirm `water_reader_private.waterbody_ingest_runs` records staged/promoted counts.
- [ ] Query several imported lakes directly through `public.search_waterbodies`.
- [ ] Verify duplicate names return separate rows by state and county.
- [ ] Verify rivers/streams/canals do not appear in search results.
- [ ] Verify polygon-only availability is honest for newly imported rows with no source links.
- [ ] Inspect skipped missing-county count and sample any failures before national import.
- [ ] Estimate generated SQL size, apply time, and index growth before full national execution.

Only after these pass should the full national import be generated and applied.

### 0.5.13 Live regional ingest proof results

The Water Reader schema and regional 3DHP ingest path have now been applied and proven in the live target Supabase project, but the full national import has **not** been run.

Live proof sequence:

1. **Minnesota proof import**
   - bbox: `-97.5,43.4,-89.0,49.4`
   - staged: `1,000`
   - promoted: `568`
   - skipped missing-name: `0`
   - skipped missing-county: `432`
   - finding: the waterbody bbox crossed neighboring areas while county staging had been manually filtered to Minnesota only, creating avoidable missing-county skips

2. **bbox-aligned regional proof import**
   - same bbox
   - staged: `2,000`
   - promoted: `2,000`
   - skipped missing-name: `0`
   - skipped missing-county: `0`
   - finding: county staging must align to regional waterbody coverage, not to an arbitrary state-only filter

3. **larger upper-Midwest proof import**
   - same bbox
   - staged: `10,000`
   - promoted: `9,995`
   - aliases: `0`
   - skipped missing-name: `0`
   - skipped missing-county: `5`
   - promoted type breakdown: `9,818` lake, `110` pond, `67` reservoir
   - promoted state breakdown: MN `6,503`, WI `3,008`, MI `246`, SD `192`, ND `30`, IA `16`
   - finding: the 5 missing-county skips are boundary-water cases near the U.S./Canada border where the 3DHP centroid does not intersect the staged U.S. county boundary geometry

Operational hardening added:

- `scripts/water-reader-ingest-3dhp.ts` now supports `--county-bbox`.
- When `--include-counties` is used and `--county-bbox` is omitted, county staging defaults to the same bbox as waterbody staging.
- The larger proof import had to be split into smaller migration chunks because a single 120 MB migration stalled before reaching Postgres.

Search and availability verification:

- `public.search_waterbodies` continued returning only `lake`, `pond`, and `reservoir` rows.
- Searches for moving-water names such as `Mississippi River` did not return river-type rows.
- Rows with no attached source links resolved honestly as `polygon_only` / `limited`.

Duplicate-disambiguation finding:

- `name + state + county` is good enough for many duplicate names, but it is not unique enough nationally.
- In the 10k regional proof, `574` duplicate groups shared `normalized_name + state_code + county_name`, covering `1,486` rows.
- Worst examples included:
  - `Mud Lake`, MN, Crow Wing: `14` rows
  - `Mud Lake`, MN, Otter Tail: `13` rows
  - `Mud Lake`, MN, St. Louis: `11` rows
  - `Long Lake`, MN, Otter Tail: `10` rows
  - `Twin Lakes`, MN, St. Louis: `10` rows
- `surface_area_acres` and centroid latitude/longitude clearly distinguish these records. `external_id` is useful for internal debugging, but should not be the primary user-facing disambiguator.

Updated recommendation before national import:

- Keep Water Reader in the named-waterbody backbone phase.
- The search result contract now includes centroid latitude/longitude alongside the already returned `surface_area_acres`.
- Future frontend search results should display area and approximate location when needed for same-name/same-county disambiguation. A nearest-city/town label may be useful later, but should not be added until there is a reviewed low-risk source for it.
- Run one national-scale dry generation/size estimate before applying the full national load.

### 0.5.14 Search centroid contract update

The minimal pre-national search contract enhancement has been added:

- `public.search_waterbodies` now returns `centroid_lat` and `centroid_lon`.
- `waterbody-search` maps those SQL fields to `centroid: { lat, lon }`.
- Shared Water Reader contracts and the app contract mirror now include `centroid` on `WaterbodySearchResult`.
- `surface_area_acres` remains in the response.
- Public search results still do not expose source external IDs.

Live SQL RPC verification against imported regional data confirmed:

- Same-name/same-county examples such as `Mud Lake` in Minnesota now return area plus centroid coordinates.
- Multi-state examples such as `Long Lake` return area plus centroid coordinates.
- Search results remain limited to `lake`, `pond`, and `reservoir`.
- Moving-water names such as `Mississippi River` still do not return river-type records.

The `waterbody-search` edge function code typechecks with the new shape, but it is still not deployed in the target project, so live endpoint testing remains pending.

### 0.5.15 National import execution plan (OBJECTID chunks, `psql` apply)

**Status:** Planned and tooling-ready. **Do not run the full national import** until there is explicit operator approval **and** a valid `DATABASE_URL` (or another approved Postgres connection string) for the target project. Generated national SQL is operational data and must **not** be committed to the repo (see `tmp/water-reader/` in `.gitignore`).

**Outcome:** Completed for the target Supabase project. Historical execution details remain here because they explain the national-load approach and are useful for future environment refreshes.

**Source count (planning):** USGS 3DHP Waterbody layer `featuretype = 3 AND gnisidlabel IS NOT NULL` is about **`125,845`** named standing-water rows (national named lake/pond/reservoir coverage target).

**Size / time (estimates from regional proof):**

- Full generated SQL on the order of **~1.35 GB** before optional GNIS aliases.
- Generation may take on the order of **20–30+ minutes** depending on USGS service behavior.
- Chunked `psql` apply may take on the order of **25–45+ minutes** plus index maintenance; real time varies with PostGIS cost, network, and throttling.

**Why `psql` instead of huge migrations:** A single ~120 MB migration file stalled before reaching Postgres in the upper-Midwest proof. Operational national loads should be applied with `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f <file.sql>`, not checked in as schema migrations.

**Chunking:** Use **`OBJECTID` ranges** (not bbox tiles) for the first national load: deterministic paging, no overlap/dedup between chunks, ~10k rows per chunk where possible.

**OBJECTID gaps between planned ranges are normal:** consecutive chunks’ `OBJECTID` bounds can leave unused numeric spans. Those ids are occupied by layer rows that **do not** match `featuretype = 3 AND gnisidlabel IS NOT NULL` (or are otherwise absent). The manifest’s `verification.objectid_gaps_between_chunks` records each span; there must be **no overlaps** between chunk `[min,max]` pairs for the filtered set.

**Full-national `000-counties.sql`:** omit `--bbox` / `--county-bbox` so county staging covers the United States (large SQL, on the order of tens of MB from the Census fallback path). For **dry/sanity** generation only, a narrow `--county-bbox` is acceptable to keep files small; production national load should use full counties to avoid missing-county skips.

Equal-count `OBJECTID` ranges used for planning (13 waterbody files + counties init + promote):

| Chunk file (example) | `OBJECTID` range (inclusive) | Approx rows |
| --- | --- | --- |
| `001-waterbodies.sql` | 64–650687 | 10,000 |
| `002-waterbodies.sql` | 650688–1004317 | 10,000 |
| `003-waterbodies.sql` | 1004348–1558520 | 10,000 |
| `004-waterbodies.sql` | 1558764–2125707 | 10,000 |
| `005-waterbodies.sql` | 2125768–2688347 | 10,000 |
| `006-waterbodies.sql` | 2688375–3251038 | 10,000 |
| `007-waterbodies.sql` | 3251177–3799975 | 10,000 |
| `008-waterbodies.sql` | 3800008–4355141 | 10,000 |
| `009-waterbodies.sql` | 4355156–4908245 | 10,000 |
| `010-waterbodies.sql` | 4908278–5464978 | 10,000 |
| `011-waterbodies.sql` | 5465028–6024971 | 10,000 |
| `012-waterbodies.sql` | 6025204–6594005 | 10,000 |
| `013-waterbodies.sql` | 6594084–7164913 | 5,845 |

**Generator flags (national):** `scripts/water-reader-ingest-3dhp.ts` supports:

- `--ingest-run-id <uuid>` — one shared run id for all chunk files.
- `--target-scope national` — consistent `waterbody_ingest_runs.target_scope` on the **init** file.
- `--skip-waterbodies` / `--counties-only` — counties staging only (for `000-counties.sql`).
- `--skip-ingest-run-row` — omit the `waterbody_ingest_runs` insert on **follow-on** waterbody chunks so the init file’s run metadata is not overwritten each chunk.
- `--skip-promote` on all staging chunks; **`--promote-only`** for `999-promote.sql` after all chunks are applied.

**Recommended generation shape:**

```bash
export INGEST_RUN_ID="$(python3 -c 'import uuid; print(uuid.uuid4())')"

npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/national/000-counties.sql \
  --include-counties --skip-waterbodies --skip-promote \
  --ingest-run-id "$INGEST_RUN_ID" --target-scope national

npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/national/001-waterbodies.sql \
  --skip-ingest-run-row \
  --where "featuretype = 3 AND gnisidlabel IS NOT NULL AND OBJECTID >= 64 AND OBJECTID <= 650687" \
  --skip-promote --ingest-run-id "$INGEST_RUN_ID" --target-scope national

# …repeat 002–013 with each planned OBJECTID range…

npm run ingest:water-reader:3dhp -- \
  --out tmp/water-reader/national/999-promote.sql \
  --promote-only --ingest-run-id "$INGEST_RUN_ID"
```

**Recommended apply order:**

1. `000-counties.sql`
2. `001-waterbodies.sql` … `013-waterbodies.sql`
3. `999-promote.sql`

A machine-readable OBJECTID manifest (`chunk-manifest.json`) can live alongside these files under `tmp/water-reader/national/` (gitignored with other ingest scratch output).

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tmp/water-reader/national/000-counties.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tmp/water-reader/national/001-waterbodies.sql
# …
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f tmp/water-reader/national/999-promote.sql
```

**Blockers / risks:**

- **`DATABASE_URL`** (with password) must be available in the operator shell; without it, `psql` cannot run.
- USGS availability and throttling may require retries; resume discipline is per chunk file.
- Missing-county skips are expected at national edges, islands, border waters, and geometry quirks—sample, do not assume fatal.
- Same-name/same-county duplicates grow nationally; centroid + area in `search_waterbodies` mitigates ambiguity (see 0.5.13–0.5.14).
- Optional GNIS aliases are **out of scope** for the first national load unless explicitly approved later.
- `waterbody-search` may still be undeployed; verify with SQL RPC even when the edge function is not live.

**Post-load verification (replace `<INGEST_RUN_ID>`):**

```sql
select
  id,
  target_scope,
  status,
  staged_waterbody_count,
  promoted_waterbody_count,
  alias_count,
  metadata ->> 'skipped_missing_name_count' as skipped_missing_name_count,
  metadata ->> 'skipped_missing_county_count' as skipped_missing_county_count,
  completed_at
from water_reader_private.waterbody_ingest_runs
where id = '<INGEST_RUN_ID>'::uuid;
```

```sql
select
  (select count(*) from water_reader_private.usgs_3dhp_waterbody_stage where ingest_run_id = '<INGEST_RUN_ID>'::uuid) as staged_rows,
  (select count(*) from public.waterbody_index where external_source = 'usgs_3dhp_waterbody' and source_summary ->> 'ingest_run_id' = '<INGEST_RUN_ID>') as promoted_rows;
```

```sql
select state_code, waterbody_type, count(*) as count
from public.waterbody_index
where external_source = 'usgs_3dhp_waterbody'
  and source_summary ->> 'ingest_run_id' = '<INGEST_RUN_ID>'
group by state_code, waterbody_type
order by state_code, waterbody_type;
```

```sql
with duplicate_groups as (
  select normalized_name, canonical_name, state_code, county_name, count(*) as group_count
  from public.waterbody_index
  where external_source = 'usgs_3dhp_waterbody'
    and source_summary ->> 'ingest_run_id' = '<INGEST_RUN_ID>'
  group by normalized_name, canonical_name, state_code, county_name
  having count(*) > 1
)
select count(*) as duplicate_group_count,
       sum(group_count) as duplicate_row_count,
       max(group_count) as worst_group_count
from duplicate_groups;
```

**Explicit approval gate:** No full national generate/apply should be executed from automation without Brandon’s explicit go-ahead and a confirmed database connection. A dry sample (`--limit` on one range) under `tmp/water-reader/national/` is the safe way to prove generation before the full run.

### 0.5.16 National identity load completed

The national named-waterbody identity backbone is now loaded in the target Supabase project.

National ingest run:

- ingest run ID: `8d08938b-6e70-4088-858c-dfd96de500f1`
- staged: `125,845`
- promoted: `125,802`
- aliases: `0`
- skipped missing-name: `0`
- skipped missing-county: `43`
- promotion timing after optimization: about `189s`

Promoted type breakdown:

- lake: `92,160`
- pond: `16,641`
- reservoir: `17,001`

Verification:

- `search_waterbodies` returns national lake/pond/reservoir rows with `surface_area_acres` and centroid coordinates.
- `Long Lake` returns multi-state results with acreage and centroid context.
- `Mud Lake` in Minnesota demonstrates same-name/same-county duplicates distinguishable by acreage and centroid.
- `Mississippi River` returns no disallowed river result.
- Searches for `river`, `stream`, and `canal` return only allowed `lake`, `pond`, or `reservoir` typed rows, or no rows.
- Most of the `125,802` promoted national rows still resolve as `polygon_only` / `limited` until reviewed sources are attached and validated (exceptions: MN DNR depth pilot lakes and small backbone fixtures — see 0.5.17).
- **USGS TNM CONUS-first aerial source availability** is **enabled in production (V1)** via policy **`usgs_tnm_naip_plus_national`** (**`is_enabled = true`**), with **`exclude_state_codes`**: **`AK`**, **`HI`**, **`PR`**, **`GU`**, **`MP`**. At launch, **`waterbody_availability_snapshot.aerial_available`** counted **122,314** rows (**source availability only** — not a shipped satellite map, Water Reader report UI, extraction, scoring, overlays, renderer, daily conditions, or recommender). See **0.5.17** and `WATER_READER_USGS_TNM_NATIONAL_AERIAL_APPROVAL_PACKET.md`. **National depth** coverage is not claimed beyond reviewed links; only reviewed, lake-matched, reachable, usable depth links may move a row off polygon-only for depth.

Duplicate audit:

- duplicate `normalized_name + state_code + county_name` groups: `6,738`
- rows in duplicate groups: `18,125`
- worst observed group: `Owens Lake`, CA, Inyo: `111`

Implementation note:

- The original promotion function timed out during national promotion because it ranked county matches with `ST_Area(ST_Intersection(...))`.
- Migration `20260425021500_optimize_water_reader_promotion_centroid_county.sql` replaced promotion with centroid-to-county attribution and deterministic tie-breaking by `state_code`, `county_name`, and `geoid`.
- This matches the documented ingest model and avoids national-scale polygon-intersection cost.
- Boundary centroids can still require deterministic tie-breaking; that is acceptable for the identity backbone and should be treated as a known QA edge case, not a blocker.

Current Water Reader status after national load:

- **Complete enough for next phase:** national named lake/pond/reservoir identity search backbone
- **Still not complete:** reviewed **depth** source coverage at scale, feature extraction, scoring, overlays, renderer, Water Reader UI, daily conditions (**CONUS-first USGS TNM aerial source availability** is already reflected in the snapshot; that is **not** an on-device or in-app imagery/report experience)

Next recommended phase (sequencing intent — not all steps are complete):

1. extend reviewed **depth** (and any **new** aerial providers) on the national index under §0.4 — **CONUS-first USGS TNM** aerial **source availability** is already enabled in V1 snapshot terms; **not** a shipped report/map product
2. begin state-by-state source discovery for machine-readable bathymetry/depth assets
3. keep each source path reviewed, reachable, lake-matched, and usable before it can affect availability
4. only after source coverage is credible should Water Reader move into extraction and scoring

**Execution focus (2026-04):** Step (2) is **in progress** for **Minnesota** via reviewed **MN DNR** bathymetric contour links (pilot + expansion batches). **USGS TNM** CONUS-first **aerial source availability** is **live in production (V1)**: policy **`usgs_tnm_naip_plus_national`** is **`is_enabled = true`** with **`exclude_state_codes`** **`["AK","HI","PR","GU","MP"]`**; launch **`aerial_available`** count **122,314**; **zero** `aerial_available` rows in excluded regions (audited before enable). This records **honest source-path availability** in `waterbody_availability_snapshot` only — **not** imagery extraction, persistent caches, scoring, map/report UI, daily conditions, or recommender. **Esri-hosted NAIP** is **not** the national policy source.

### 0.5.17 Current backbone state — search, Edge functions, Minnesota DNR depth pilot

**National identity and search**

- The national named lake/pond/reservoir identity load is in the target Supabase project; `search_waterbodies` supports area + centroid disambiguation as documented in 0.5.14–0.5.16.

**Edge functions (target project)**

- `waterbody-search` — deployed (authenticated / subscription-gated per product settings).
- `waterbody-source-validation` — deployed with **internal** auth via `WATER_READER_INTERNAL_KEY` (`--no-verify-jwt`); mutates per-link validation columns only for requested `lakeId` / `sourceMode`.

**Minnesota DNR depth pilot (six lakes)**

- **Matching rules:** `docs/water_reader_mn_dnr_depth_pilot_matching_spec.md`
- **Migrations (repo):** `20260425163000_water_reader_mn_dnr_depth_pilot.sql` (links), `20260425204500_water_reader_mn_dnr_pilot_usable_source_paths.sql` (usable GeoJSON `source_path` + count-only validation URLs).
- Six USGS-indexed Minnesota lakes have approved `waterbody_source_links` to the DNR bathymetric contours layer (`mn_dnr_bathymetric_contours` registry key).
- Each link stores a **usable** GeoJSON `source_path` (`f=geojson`, `returnGeometry=true`, `outSR=4326`, depth-related `outFields`) and a **light** `metadata.fetch_validation_url` (`returnCountOnly=true`) for reachability probes.
- **On-demand only:** registry storage / derived-feature caching flags remain off for this source; no extraction, scoring, overlays, or renderer consume these geometries yet.
- **Non-mutating verification:** `npm run check:water-reader:mn-dnr-pilot-geojson` (Deno) hits the public ArcGIS endpoints and is safe for routine CI.
- **Mutating verification:** `npm run ops:water-reader:mn-dnr-pilot-validate-edge` (or GitHub **Actions → Run workflow** `water-reader-mn-dnr-pilot-edge-validation`) requires `WATER_READER_INTERNAL_KEY` (+ `SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_URL`). **Do not** wire this to untrusted pull-request CI.

**Minnesota DNR depth expansion — reviewed twelve lakes (applied)**

- **Migrations:** `20260425213000_water_reader_mn_dnr_depth_expansion_12.sql` inserts twelve `waterbody_source_links` rows using **explicit `waterbody_id` values** from `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json` (not a name/county join), so USGS multi-fragment rows cannot fan out duplicates. `20260426120000_water_reader_mn_dnr_expansion_12_burntside_duplicate_cleanup.sql` deletes three erroneous Burntside links if an earlier name/county join had already run in a database.
- **Lakes (proposal `ready_for_insert` only):** Otter Tail, Minnewaska, Osakis, Miltona, Traverse, Nett, Burntside, Thief, Big Sandy, North Long (Crow Wing), West Battle, Snowbank — same DOWLKNUM-scoped GeoJSON URLs as the pilot pattern; `metadata.on_demand_only = true`; no storage or derived-caching claims.
- **North Long Lake:** insert-time homonym check — single MN `waterbody_index` row matches the proposal lake id; DNR sample for DOWLKNUM `18037200` shows `LAKE_NAME` consistent with that basin (metadata records the check).
- **Non-mutating verification:** `npm run check:water-reader:mn-dnr-proposal-geojson` (twelve proposal URLs).
- **Mutating verification (expansion only):** `npm run ops:water-reader:mn-dnr-expansion-validate-edge` with the same secrets as the pilot script (`WATER_READER_INTERNAL_KEY` + `SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL`, mirrored from Supabase Edge secrets — see `.env.example`). This POSTs `waterbody-source-validation` per expansion lake and persists `fetch_validation_*` on each link. The header must be **`x-water-reader-internal-key`** with a value that **exactly matches** the `WATER_READER_INTERNAL_KEY` secret on the deployed function; otherwise the API returns **403** (`forbidden` / “reserved for internal Water Reader infrastructure”) and nothing is updated. After rotating the Edge secret, confirm the **same Supabase project** as `SUPABASE_URL` (ref in URL), secret name **`WATER_READER_INTERNAL_KEY`**, and paste the value **verbatim** into `.env` (characters like `+` must not be altered). Optional: set **`MN_DNR_EXPANSION_LOG_JSON=1`** when running the npm script to print each successful response body (JSON) after the summary line.
- **Validated expansion (target DB, 2026-04):** All twelve expansion links have `fetch_validation_status = reachable` with **HTTP 200** on each count-only `metadata.fetch_validation_url` (same probe the Edge function uses). **`waterbody-source-validation` Edge-attested closure (2026-04-26):** ops run `MN_DNR_EXPANSION_LOG_JSON=1 npm run ops:water-reader:mn-dnr-expansion-validate-edge` completed **12/12** lakes with function HTTP **200**, each `results[].status === "reachable"`, probe `httpStatus` **200**, and `fetch_validation_checked_at` refreshed (batch window **~17:01–17:02Z** UTC on first closure; re-runs update timestamps idempotently). `waterbody_availability_snapshot` shows **`depth_only`**, **`depth_available`**, **`ready`**, and **`depth_machine_readable_available = true`** for each of the twelve lake ids. **Batch-2 (six lakes, 2026-04):** migration `20260426171211_water_reader_mn_dnr_depth_expansion_batch2_6.sql` from `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json`; Edge `npm run ops:water-reader:mn-dnr-expansion-batch2-validate-edge` (or `MN_DNR_EXPANSION_BATCH=batch2` with the expansion validate script) attested **6/6** reachable. After batch-2 closure, **MN and national** machine-readable depth-ready totals (snapshot: `data_tier = depth_only`, `availability = depth_available`, `source_status = ready`) are **25** (six pilot + twelve expansion + six batch-2 + Lake Mary Douglas fixture). Excluded proposal lakes (e.g. Rainy, Namakan, Kabetogama, Big Stone, Red, Pelican) still have **no** new `mn_dnr_bathymetric_contours` depth links; only **MN** index rows carry that provider’s depth links.
- **Excluded candidates** (ambiguous, border-policy, no-match, reject from **batch-1 and batch-2 expansion proposals**) must not receive links unless a **new** reviewed proposal and migration say so; Rainy Lake and other non-ready rows remain without new MN DNR depth attachments.

**Protected secrets (verify):**

- Supabase Edge: `WATER_READER_INTERNAL_KEY` must be set for `waterbody-source-validation` (confirm with `supabase secrets list --project-ref <ref>` — name present; value is never printed).
- Local / GitHub Actions: operators mirror `SUPABASE_URL` and `WATER_READER_INTERNAL_KEY` into `.env` (see `.env.example`) or encrypted repo secrets for manual workflows only.
- Pilot links in the target DB should show `fetch_validation_status = reachable` after a successful ops run (HTTP 200 on the count probe).

**Expansion draft (generator input):** `docs/water_reader_mn_dnr_expansion_batch_candidate.json` — regenerate with `npm run build:water-reader:mn-dnr-expansion-candidates` after editing `scripts/data/mn_dnr_expansion_seed_waterbodies.json`. Rows need human review (especially `none` / multi-basin / homonym cases) before any migration.

**Reviewed insert proposal (human-reviewed short list):** `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json` — classifications for all 40 seed lakes and the **12-lake** `ready_for_insert` list applied via `20260425213000_water_reader_mn_dnr_depth_expansion_12.sql`. GeoJSON smoke: `npm run check:water-reader:mn-dnr-proposal-geojson`. Per-lake **`reachable`** validation is required before snapshots count depth; expansion rows have completed that step in the target project. Operators should still keep `WATER_READER_INTERNAL_KEY` in local `.env` for routine `ops:water-reader:mn-dnr-expansion-validate-edge` / pilot runs (re-runs are idempotent).

**USGS TNM CONUS-first aerial — production source availability (2026-04)**

- **Policy:** `usgs_tnm_naip_plus_national` — **`is_enabled = true`** in **production (V1)** (guarded ops `UPDATE`, not a repo migration). **`approval_status` approved**, provider health **reachable** at enable. **`coverage.exclude_state_codes`**: **`["AK","HI","PR","GU","MP"]`** — excluded-region rows remain **not** policy-aerial (**0** violations at launch audit).
- **Snapshot:** **`aerial_available = true`** count at enable: **122,314** (includes **2** prior link-based aerial rows + **122,312** from policy). This is **source availability** in **`waterbody_availability_snapshot`** only.
- **Not shipped by this step:** imagery **storage**, **extraction**, **scoring**, **overlays**, **renderer**, **Water Reader report / map UI**, **daily conditions**, **recommender** — registry **`can_store_*`** / **`can_cache_rendered_output`** for TNM remain **false** per existing migrations.

**Aerial provider policy — repo schema + production state**

- Migration `20260426220000_water_reader_aerial_provider_policies.sql` adds `public.water_reader_aerial_provider_policies`. Migration **`20260426230100_water_reader_usgs_tnm_registry_and_aerial_policy.sql`** adds **`source_registry`** `usgs_tnm_naip_plus` and seeds the policy row **`is_enabled = false`**. Migration **`20260427210000_water_reader_usgs_tnm_conus_coverage_exclusions.sql`** merges **CONUS-first** **`exclude_state_codes`**: **`AK`**, **`HI`**, **`PR`**, **`GU`**, **`MP`**; that migration keeps **`is_enabled = false`** — **production enable** is a **separate** ops step (now applied on V1). Attribution/license/storage flags stay on **`source_registry`**; **`esri_naip_public` remains fixture-only**, not national policy source.
- **Internal policy health validation (`waterbody-source-validation`):** POST body `{ "validationScope": "aerial_provider_policy", "policyKey": "<policy_key>" }` with header **`x-water-reader-internal-key`** (same secret as lake-path validation). Probes only **`water_reader_aerial_provider_policies.provider_health_target_url`** or, if null, **`source_registry.provider_health_check_url`** (no `source_path` / imagery payloads). Updates **only** policy provider-health columns; **no `lakeId`**. When **`validationScope` is omitted**, existing **lake-link** validation is unchanged (default). Probing an **enabled** policy that is also **`approval_status = approved`** requires **`"allowApprovedEnabledPolicyProbe": true`** in the body. This probe **does not** set **`is_enabled`**, change **`coverage`**, or replace a **human launch decision** — it **only** refreshes provider-health fields.

**Broader Minnesota expansion**

- A 20–50 lake batch (or statewide attachment) remains **gated** on ops (rate limits, monitoring), legal/ToS review, and continued honesty checks (GeoJSON smoke + Edge validation per batch), not on identity/search gaps.
- **Batch-2 (closed, 2026-04):** Draft candidates: `docs/water_reader_mn_dnr_expansion_batch2_candidate.json` (27 lakes). Reviewed proposal: `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json` — only the **6** `ready_for_insert` rows were migrated (`20260426171211_water_reader_mn_dnr_depth_expansion_batch2_6.sql`). **2** `needs_manual_review`, **7** `ambiguous_multi_match`, **10** `no_dnr_match_found`, **2** `reject` rows were **not** linked. Non-mutating check: `MN_DNR_PROPOSAL_JSON=docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json npm run check:water-reader:mn-dnr-proposal-geojson-batch2`. Edge attestation: `npm run ops:water-reader:mn-dnr-expansion-batch2-validate-edge`. **Detroit Lake (Becker):** pre-insert SQL confirmed a **single** MN `waterbody_index` row matching the proposal `waterbody_id` for “Detroit Lake” / Becker (homonym risk cleared for the index). **Brule Lake (Cook):** single index row; metadata records **BWCA-adjacent** caution for product/legal review. Match quality in the batch-2 **candidate** slice did **not** support a 20–50 `ready_for_insert` list; larger batches still need better seeds or manual DOWLKNUM resolution.

### 0.5.18 New-agent handoff — Water Reader backbone (source availability)

Use this section **instead of chat history**. If anything here disagrees with the database, **trust an audited query on the target project** and then update this plan.

**Mode**

- Water Reader is in **foundation / source-availability backbone** mode only.
- **Do not** build or ship: extraction, scoring, overlays, renderer, full Water Reader **report** frontend flows, daily conditions, or recommender handoff until this plan explicitly moves phase (the **minimal** `/water-reader` **source preview** in **§0.5.19** is **not** that phase shift).

**Verified counts (target DB, after batch-2 Edge attestation, 2026-04)**

- **122,314** rows have **`aerial_available = true`** after **USGS TNM CONUS-first** policy enable (**source availability** only; see 0.5.17).
- **25** rows meet the snapshot filter used in ops reporting: `depth_machine_readable_available = true`, `data_tier = 'depth_only'`, `availability = 'depth_available'`, `source_status = 'ready'`.
- **Breakdown (intended composition):** 6 MN DNR **pilot** + 12 MN DNR **expansion batch-1** + 6 MN DNR **expansion batch-2** + **1** Douglas County **Lake Mary** backbone **fixture** (`external_id = lake_mary_douglas_mn` in `20260424133337_water_reader_waterbody_backbone.sql`). National and MN totals match **25** because only these rows carry honest, reviewed, reachable MN DNR machine-readable depth in the current registry posture.
- **Not counted here:** lakes that remain `polygon_only` / `limited`; excluded expansion candidates (ambiguous, border, no-match, reject); any unaudited state.

**MN DNR is the only active real-world machine-readable depth expansion**

- Registry key: `mn_dnr_bathymetric_contours`.
- All inserted MN DNR depth links: **`metadata.on_demand_only = true`**; no storage or derived-feature caching claims for these paths; rights posture is **on-demand** until product/legal says otherwise.

**Canonical files (repo)**

| Purpose | Path |
|--------|------|
| This plan (source of truth) | `docs/WATER_READER_MASTER_PLAN.md` |
| Pilot matching rules | `docs/water_reader_mn_dnr_depth_pilot_matching_spec.md` |
| Expansion batch-1 proposal | `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal.json` |
| Expansion batch-2 proposal | `docs/water_reader_mn_dnr_expansion_reviewed_insert_proposal_batch2.json` |
| Batch-1 candidate generator output (regenerate via script) | `docs/water_reader_mn_dnr_expansion_batch_candidate.json` |
| Batch-2 candidate generator output | `docs/water_reader_mn_dnr_expansion_batch2_candidate.json` |
| Batch-1 seed | `scripts/data/mn_dnr_expansion_seed_waterbodies.json` |
| Batch-2 seed | `scripts/data/mn_dnr_expansion_seed_waterbodies_batch2.json` |

**Migrations (repo filenames — aerial policy hook)**

- `20260426220000_water_reader_aerial_provider_policies.sql` — `water_reader_aerial_provider_policies` + snapshot update; **no seeded enabled policy**
- `20260426230100_water_reader_usgs_tnm_registry_and_aerial_policy.sql` — USGS TNM registry + policy row seeded **`is_enabled = false`**
- `20260427210000_water_reader_usgs_tnm_conus_coverage_exclusions.sql` — CONUS-first **`exclude_state_codes`**; seeds **`is_enabled = false`** (V1 **`is_enabled = true`** applied separately in ops)

**Migrations (repo filenames — MN DNR depth)**

- `20260425163000_water_reader_mn_dnr_depth_pilot.sql`
- `20260425204500_water_reader_mn_dnr_pilot_usable_source_paths.sql`
- `20260425213000_water_reader_mn_dnr_depth_expansion_12.sql`
- `20260426120000_water_reader_mn_dnr_expansion_12_burntside_duplicate_cleanup.sql`
- `20260426171211_water_reader_mn_dnr_depth_expansion_batch2_6.sql`

**npm scripts (run from `TightLinesAI/`)**

- Pilot GeoJSON smoke: `npm run check:water-reader:mn-dnr-pilot-geojson`
- Batch-1 proposal GeoJSON smoke: `npm run check:water-reader:mn-dnr-proposal-geojson`
- Batch-2 proposal GeoJSON smoke: `npm run check:water-reader:mn-dnr-proposal-geojson-batch2`
- Pilot Edge validation (mutating): `npm run ops:water-reader:mn-dnr-pilot-validate-edge`
- Expansion batch-1 Edge validation: `npm run ops:water-reader:mn-dnr-expansion-validate-edge`
- Expansion batch-2 Edge validation: `npm run ops:water-reader:mn-dnr-expansion-batch2-validate-edge` (or `MN_DNR_EXPANSION_BATCH=batch2` with the same expansion script)
- Regenerate batch-1 candidates: `npm run build:water-reader:mn-dnr-expansion-candidates`
- Regenerate batch-2 candidates: `npm run build:water-reader:mn-dnr-expansion-candidates-batch2`

**Ingest scratch (do not commit)**

- `tmp/water-reader/` is listed in `.gitignore`. Generated national/regional SQL chunks may exist locally; they are **operational scratch**, not part of the reviewed backbone handoff.

**Supabase CLI caveat**

- If `supabase db push` reports migration version mismatches between **remote** `schema_migrations` and **local** `supabase/migrations/` filenames, resolve with the normal repair/pull workflow — do not re-apply MN DNR insert SQL blindly.

**Next recommended step**

- **Minnesota DNR batch-3 planning:** new seed of MN `waterbody_index` rows **excluding** any lake that already has an `mn_dnr_bathymetric_contours` depth link; regenerate candidates; conservative classification; reviewed `ready_for_insert` proposal; GeoJSON smoke; **separate** explicit-`waterbody_id` migration + Edge attestation per batch. Match quality may be low; short lists are acceptable.

**Do not do next (without a new product decision)**

- Broaden aerial **beyond** the **approved CONUS-first USGS TNM** policy path (**`usgs_tnm_naip_plus` / `usgs_tnm_naip_plus_national`**) — e.g. extra national providers, MapServer basemap as policy source, or **Esri NAIP** as **national policy** **`source_id`**.
- Remove or shrink **`coverage.exclude_state_codes`** (**`AK`**, **`HI`**, **`PR`**, **`GU`**, **`MP`**) without **coverage QA** and explicit approval (snapshot would then claim policy-aerial where product has not signed off).
- Add **imagery storage**, **extraction**, **scoring**, **map overlays**, **report renderer**, **full Water Reader report UI**, **daily conditions**, or **recommender** integration without **§0.4.5** / registry-flag / product approval (**`aerial_available`** is **source availability** only today).
- Insert links for ambiguous, border-policy, no-match, or rejected proposal rows without a **new** human-reviewed proposal.

### 0.5.19 In-app USGS TNM NAIP Plus source preview (working tree)

**Status (repo evidence only — not a claim that a store/build was published):** The FinFindr app **in this repo** includes a first **non-interactive**, **on-demand** **USGS The National Map** **ortho source preview** path for Water Reader — **source availability / display only**, not a finished “map product,” zone readout, scoring output, or recommender handoff.

**What exists in the working tree**

- Home **Water Reader** card navigates to **`/water-reader`** (`app/water-reader.tsx`).
- **Waterbody search** uses the existing **`searchWaterbodies`** client (subscription-gated Edge `waterbody-search`).
- A **single** `exportImage` request to **`USGSNAIPPlus` ImageServer** runs **only after explicit tap** on a search result (not while typing, not for unselected rows).
- Helper URL/bbox logic: `lib/usgsTnmAerialSnapshot.ts` (CONUS policy exclusions; conservative state-code normalization).
- Preview is shown with **`expo-image`** and **`cachePolicy="none"`** (no disk cache policy — not a substitute for §0.4 **legal** storage review).
- Required **USGS / National Geospatial Program** attribution is shown with the snapshot area.
- **Honest fallbacks** when policy excludes the state, source flags disallow aerial, centroid/bbox is invalid, request errors, or a **~28s** client timeout elapses.

**Explicit limits (unchanged from backbone posture)**

- **Source preview only** — no feature extraction, no scoring, no fish-zone overlays, no interactive map library, no report renderer, no daily conditions, no recommender integration.
- **No persistent imagery** / mosaics / derived rasters in app storage; no product claim that **`aerial_available`** equals a **built** national map.
- **Deployment** of any app build to TestFlight, Play, or production is **out of scope** of this plan entry unless **separately** recorded as shipped.

**Next checkpoints (QA / design)**

- **Device QA** with a **subscribed** account: end-to-end search → select → USGS load latency and fallbacks.
- **Slow network / error** UX review (timeout vs error strings).
- **Platform note:** confirm **`expo-image`** + **`cachePolicy="none"`** behavior on target iOS/Android builds matches expectations (transient memory decode may still occur).
- **Product/design:** if **interactive** pan/zoom or tiled map UX is required later, treat as a **separate** approval/design pass (not implied by this preview).

---

## 1. Product definition

**Water Reader helps an angler search a named U.S. lake or pond, choose species and shore/boat mode, then receive a clean marked-up map showing the highest-probability starting zones, why those zones matter, and how confident FinFindr is in those recommendations.**

This is FinFindr's flagship feature because it combines:

- lake/pond structure
- species and season
- shore vs boat context
- source quality
- presentation logic

The result should feel like:

> Search a lake, choose species, choose shore or boat, then get a premium fishing map that tells you where to start and why.

---

## 2. Core principles

1. **Lakes and ponds only for V1.**
   - No rivers.
   - No saltwater.
   - No brackish.
   - No moving-water route in V1.

2. **National named-lake coverage is required.**
   - Water Reader should launch with a national waterbody index.
   - National coverage means named-lake search coverage first, not perfect depth parity in every state.
   - Every lake should have an honest best-available report path, even when data quality varies.

3. **Deterministic engine decides. Renderer draws. AI explains.**
   - The engine chooses zones from structured evidence.
   - The renderer draws the chosen geometry.
   - The LLM may explain the report, but may not invent structure, zones, or certainty.

4. **Baseline species-season logic is the foundation of Water Reader.**
   - Water Reader should first work as a standalone where-to-start engine.
   - The core baseline is species x region x month, not daily conditions.
   - The first meaningful output should come from structure, season, access mode, and source quality.

5. **Water Reader is lake/pond-only, so trout is excluded from V1 species support.**
   - In FinFindr, trout logic is intentionally tied to river context.
   - Water Reader should not stretch trout into lake/pond mode just for symmetry.
   - Water Reader V1 species support is largemouth bass, smallmouth bass, and pike.

6. **Lure/Fly Recommender stays separate in V1.**
   - Water Reader does not need to own `what to throw` to be successful.
   - Water Reader should not re-implement or embed the full recommender in its core report.
   - Any handoff is deferred beyond the core Water Reader V1 report.

7. **Daily conditions are a late-stage enhancement, not the baseline engine.**
   - Water Reader must produce useful reports without daily-condition input.
   - When daily conditions are added late in V1, they should adjust ranking or emphasis only.
   - Daily conditions must not become a dependency for the baseline report path.

8. **Source rights govern fetch, storage, feature extraction, and caching.**
   - Normative defaults and examples: **§0.4** (scraping, approved/disallowed classes, on-demand storage, client vs server).
   - If rights are unclear, FinFindr should not store reusable assets or derived features.
   - Google imagery/content must not be the analysis or cached-derivation foundation.
   - Unreviewed depth sources must not count as V1 reusable depth intelligence.

9. **Data quality must be visible to the user.**
   - Every report must show source mode, data tier, and confidence.
   - Water Reader should be ambitious, but never pretend certainty it does not have.

10. **Shore mode is about castable shoreline and nearshore opportunity, not verified public access.**
   - Shore reports must include an access warning.
   - Water Reader does not promise legal access in V1.

11. **Boat mode may use the full lake when the source evidence supports it.**
   - Offshore recommendations require real structure evidence.
   - Aerial-only mode must not invent underwater structure.
   - Depth mode must only use reviewed and approved depth evidence.

12. **Cache intelligence, not fixed final screenshots.**
   - Default posture: **on-demand fetch**; durable caches of heavy assets or derived features only when **§0.4** and registry flags explicitly allow it.
   - Cache the lake index, rights decisions, and—**when allowed**—normalized approved assets, extracted features, candidate zones, and reusable scoring layers.
   - Final reports stay on-demand because species, month, access mode, source mode, and source availability can change the result.

13. **Best-available is the product strategy.**
   - Not every lake will have the same intelligence level.
   - The product succeeds if it gives the user the strongest legally usable report path available for that lake, then says how strong that path is.
   - Machine-readable depth outranks chart-aligned depth when both are credible.

---

## 3. V1 scope and V2 deferrals

### 3.1 Baseline V1 scope

Water Reader V1 must support:

- named U.S. lake/pond search
- national waterbody index
- species:
  - largemouth bass
  - smallmouth bass
  - pike
- access modes:
  - shore
  - boat
- source modes:
  - `best_available`
  - `aerial`
  - `depth`
- baseline species x region x month profiles
- hybrid source strategy:
  - pre-index waterbody and source metadata nationally
  - ingest and normalize approved public assets when allowed
  - fetch approved depth/chart assets on demand when storage is not allowed or not yet worth pre-ingesting
- source availability display before report generation
- aerial mode MVP
- depth mode for approved and technically usable depth sources
- deterministic zone scoring
- rendered map overlay
- confidence and source attribution
- conditional report persistence/history when source rights allow it

### 3.2 V1 product defaults

These defaults are non-negotiable for V1:

- Water Reader is a named-lake/named-pond feature, not a freeform image-analysis feature.
- Water Reader is a `where to start` feature first, not a full-session planner.
- `best_available` is the default source mode.
- If both aerial and depth are available, the user may switch between them.
- Switching between `aerial` and `depth` is a report-mode change, not just a basemap change.
- `Depth available` only counts if FinFindr can legally and technically produce a credible aligned report from that source.
- Public aerial imagery is the default national visual layer, with graceful fallback if a fetch fails.
- Machine-readable depth is the primary depth path; chart-aligned depth is a secondary fallback tier.
- Baseline reports must stand on structure, species, season, access mode, and source confidence alone.
- Aerial reports must stay independent from depth assumptions.
- Core report output is map-first with zone legend explanations; no top-level summary is required.

### 3.3 Late-V1 completion layer

The following layer is required for full V1 completion, but should be added only after the baseline engine is stable:

- daily-condition-aware reranking using the existing How's Fishing intelligence

Rules for that enhancement:

- it must be layered on top of the baseline engine, not replace it
- the system should still be architecturally usable without it
- it must not expand Water Reader into a `what to throw` feature

### 3.4 Out of scope for V1

Do not build these into V1:

- rivers
- saltwater
- brackish
- shoreline public/private access verification
- routing/navigation
- social hotspot sharing
- Garmin/Navionics scraping
- Google imagery analysis or cached derived features
- trout for lake/pond Water Reader
- embedded lure/fly recommendations inside the core Water Reader report
- daily-condition-dependent report generation as a requirement for usefulness
- unreviewed random depth-chart websites as V1 reusable depth sources
- user-upload analysis as part of launch acceptance
- AI-generated zones without deterministic evidence

### 3.5 V2 deferrals

The following are valid next-phase expansions, but not required for V1 acceptance:

- private user upload analysis
- deeper state-by-state source enrichment after launch
- broader chart-image extraction sophistication
- richer dock/weed/object detection
- advanced upload alignment workflow
- contextual handoff from Water Reader into the Recommender
- additional public source classes beyond V1's approved launch sources

---

## 4. Source and legal rules

### 4.1 Non-negotiable legal rule

**Do not use Google imagery/content as the analysis or caching foundation for Water Reader.**

Google may be used for normal live map display only if product usage follows Google terms, but not for:

- feature extraction
- shoreline tracing
- vegetation or object detection
- long-term reusable caching
- derived fishing layers

### 4.2 Preferred source classes

Use these source classes in priority order:

1. National waterbody geometry from U.S. hydrography sources.
2. Public aerial imagery, preferably NAIP or similar approved public imagery.
3. Machine-readable depth data:
   - bathymetric DEM
   - vector contours
   - queryable GIS service layers
4. Public chart-image sources when legally usable and alignable.
5. Low-data polygon-only fallback.

Interpretation:

- machine-readable depth is the preferred depth path
- chart-image depth is a secondary fallback tier, not the primary definition of depth intelligence

### 4.3 Hybrid source strategy

V1 should not depend on every depth asset being pre-ingested, and it should not depend on scraping random third-party sites at runtime.

The V1 strategy is:

- pre-index waterbody identity nationally
- pre-index source availability and rights status
- ingest/store normalized assets when legally permitted and valuable
- fetch approved sources on demand when:
  - the source is reviewed
  - runtime access is permitted
  - the asset can produce a credible report

V1 boundary:

- arbitrary or unreviewed third-party websites do not count as approved V1 depth paths

### 4.4 Source rights model

Every source must have explicit rights metadata:

```ts
SourceRights = {
  canFetch: boolean;
  canStoreOriginal: boolean;
  canStoreNormalized: boolean;
  canStoreDerivedFeatures: boolean;
  canCacheRenderedOutput: boolean;
  canUseForAiTraining: false;
  attributionRequired: boolean;
  attributionText?: string;
  licenseUrl?: string;
  reviewStatus: "unreviewed" | "allowed" | "restricted" | "blocked";
}
```

Default rule:

- if rights are unclear, do not store reusable assets or reusable derived features
- if a source is blocked, it must not be used for extraction or caching

### 4.5 Chart-image rule

Public depth/chart images are useful only when all three are true:

- rights allow the intended usage
- the lake match is credible
- the overlay/report can be aligned with enough confidence to be honest

If any of those fail, the chart must not count as `depth available` for the user-facing report path.

Additional rule:

- chart-image depth is a secondary depth tier behind machine-readable depth
- unreviewed chart images from arbitrary websites must not count as V1 depth intelligence

---

## 5. User flows

### 5.1 Main named-lake flow

1. User opens Water Reader.
2. User searches for a named lake or pond.
3. Search results show:
   - lake or pond name
   - state
   - county when needed for disambiguation
   - waterbody type when helpful
   - source availability or data-tier badge when known
4. User selects the correct lake.
5. App shows available source modes and current best-available status.
6. User selects species.
7. User selects shore or boat.
8. App defaults to `best_available`.
9. If both aerial and depth are available, user may switch source mode.
10. App uses date to resolve month/season, plus region and location context automatically.
11. Water Reader generates the report.
12. User receives a map-first report with 3-5 zones, color-coded legend entries, confidence, and limitations.

### 5.1.1 Duplicate-name behavior

Water Reader should disambiguate duplicate names using:

- `name + state + county`

The user should see all matching named lakes/ponds and choose the intended one.

### 5.1.2 Source-mode choice behavior

If only one source mode is available:

- Water Reader uses that mode directly

If both are available:

- Water Reader defaults to `best_available`
- the user may switch between `aerial` and `depth`
- switching modes changes the actual report output and overlay content

### 5.2 Source-mode behavior

`best_available`

- chooses the strongest legally usable report mode for that lake
- usually prefers machine-readable depth when it is credible and meaningfully better than aerial-only
- may use reviewed and alignable chart-image depth when machine-readable depth is unavailable but chart depth is credible
- falls back to aerial or polygon-only when needed

`aerial`

- prioritizes shoreline geometry, visible cover, protected pockets, and wind-exposed/protected banks
- may use visible nearshore transition cues from imagery as low-confidence visual hints only
- must not claim underwater depth structure without actual depth evidence
- must not turn color changes in imagery into confirmed depth breaks or contours

`depth`

- prioritizes contour- or depth-backed structure such as breaks, flats, basins, humps, saddles, and basin edges
- may use aerial context secondarily when both are available and permitted
- must only use reviewed and approved depth evidence
- must downshift or fail cleanly if the requested depth path is not actually usable

### 5.3 Shore and boat behavior

Shore mode:

- scores shoreline and nearshore zones
- respects realistic castability
- includes `Access not verified`

Boat mode:

- may score the full lake
- may recommend offshore structure only if supported by real source evidence

---

## 6. Source availability model

Every waterbody should resolve to one clear availability record before report generation.

```ts
WaterbodyAvailability = {
  lakeId: string;
  canonicalName: string;
  state: string;
  dataTier: WaterReaderDataTier;
  aerialAvailable: boolean;
  depthMachineReadableAvailable: boolean;
  depthChartImageAvailable: boolean;
  bothAvailable: boolean;
  availableSourceModes: WaterReaderSourceMode[];
  bestAvailableMode: "aerial" | "depth";
  sourceStatus: "ready" | "partial" | "limited" | "blocked";
  confidence: "high" | "medium" | "low";
  confidenceReasons: string[];
}
```

### 6.1 Practical interpretation

- `aerialAvailable` means Water Reader has an approved public aerial path for that lake, even if it may need on-demand fetch.
- `depthMachineReadableAvailable` means Water Reader has approved machine-readable depth data or a reviewed GIS service path that can support real structure extraction.
- `depthChartImageAvailable` means Water Reader has a reviewed and alignable chart-image path that can support an honest secondary depth-style report.
- `bothAvailable` means the lake can support both aerial and depth report modes.

Additional rule:

- unreviewed depth sources do not count toward `depth available`

### 6.2 User-visible outputs

Water Reader should expose:

- availability badge
- data tier badge
- confidence note
- access note for shore mode
- source attribution

Example user-facing labels:

- `Best Available: Depth`
- `Aerial Available`
- `Depth Available`
- `Both Available`
- `Limited Data`

---

## 7. Data tiers and confidence model

### 7.1 Data tiers

| Tier | Internal name | Meaning | User-facing label |
|---|---|---|---|
| 1 | `full_depth_aerial` | Lake polygon + credible depth path + aerial path | Full Water Reader |
| 2 | `depth_only` | Lake polygon + credible depth path | Depth Intelligence |
| 3 | `aerial_only` | Lake polygon + aerial path | Aerial Structure Scan |
| 4 | `chart_aligned_depth` | Lake polygon + approved aligned depth-chart image path | Chart-Aided Depth |
| 5 | `polygon_only` | Lake polygon only | Limited Water Reader |

### 7.2 Confidence model

Every report must include a confidence level:

- `high`
- `medium`
- `low`

Confidence is determined by:

- source quality
- rights confidence
- polygon quality
- aerial quality
- depth quality
- chart alignment quality
- feature extraction confidence

### 7.3 Confidence behavior

- Polygon-only reports are always low confidence.
- Aerial-only reports can be medium confidence, but must not speak like depth is known.
- Depth-backed reports can be high confidence when source quality is strong.
- Chart-image depth reports should usually be medium unless the alignment and quality are exceptionally strong.
- Any report with weak source evidence must explain why confidence is reduced.

---

## 8. Core architecture

Water Reader should be defined by subsystem responsibility, not by implementation file list.

### 8.1 National waterbody index

Responsibilities:

- store named U.S. lakes and ponds
- normalize names, aliases, state, county, region, and geometry
- support national search and duplicate-name disambiguation
- provide the base identity for every Water Reader report

### 8.2 Source registry and rights tracker

Responsibilities:

- track every source provider and source class
- store rights and review status
- prevent blocked or unreviewed sources from being used incorrectly
- capture attribution requirements and freshness metadata

### 8.3 Lake asset availability resolver

Responsibilities:

- determine which source modes are truly available for a lake
- resolve the lake's best-available mode
- separate approved-but-not-ingested sources from genuinely unavailable ones
- support the pre-generation availability badge shown to the user

### 8.4 Public aerial path

Responsibilities:

- fetch or clip approved public aerial imagery
- derive visible or geometry-backed shoreline intelligence
- identify visible characteristics such as points, coves, protected pockets, visible vegetation, shoreline complexity, and other aerial-backed cues
- treat color or texture changes only as low-confidence visual cues, never as confirmed underwater depth structure
- support aerial-mode map rendering
- provide the national default visual and structure path

### 8.5 Depth intelligence path

Responsibilities:

- use reviewed and approved machine-readable depth sources where available
- use approved aligned chart-image sources where credible as a secondary depth tier
- identify true underwater characteristics such as depth bands, flats, breaks, basins, humps, saddles, and basin edges
- derive depth-driven structure zones
- support depth-mode scoring and rendering

### 8.6 Baseline species-season profile system

Responsibilities:

- define region x month x species baseline behavior
- define numeric soft depth ranges for depth mode only
- define preferred structure and cover types by month profile
- define shoreline vs offshore bias
- define fallback behavior when ideal structure is absent
- define lower-confidence adjacent-month transition behavior
- keep the baseline logic explicit, simple, and editable

### 8.7 Deterministic zone engine

Responsibilities:

- score zones from structured source evidence
- combine identified source-specific characteristics with species-season baseline, access mode, and confidence
- output ranked zones with reasons and limitations

### 8.8 Late-stage daily enhancement bridge

Responsibilities:

- optionally normalize How's Fishing daily context into Water Reader modifiers
- apply modest reranking or emphasis adjustments only after the baseline engine is stable
- keep Water Reader useful even when daily context is absent

### 8.9 Renderer

Responsibilities:

- draw the engine-chosen map geometry
- produce clean premium report visuals
- ensure the overlay matches the selected source mode

### 8.10 Narration layer

Responsibilities:

- explain only the structured report output
- mention confidence and limitations honestly
- never invent unsupported structure

### 8.11 Report persistence and history

Responsibilities:

- save the report input/output for future viewing or regeneration when source rights allow persistent storage
- avoid persistent storage when source rights do not allow rendered or derived output retention
- preserve source attribution and selected source mode
- keep the report consistent with the user's requested context

---

## 9. Deterministic baseline engine behavior

### 9.1 Product-level inputs

```ts
WaterReaderInput = {
  lakeId: string;
  species: "largemouth_bass" | "smallmouth_bass" | "pike";
  accessMode: "shore" | "boat";
  dateISO: string;
  sourceMode: "best_available" | "aerial" | "depth";
}
```

### 9.2 Product-level outputs

```ts
WaterReaderReport = {
  reportId: string;
  lake: {
    lakeId: string;
    name: string;
    state: string;
    county?: string;
    region: string;
  };
  selectedSourceMode: "aerial" | "depth";
  dataTier: WaterReaderDataTier;
  confidence: "high" | "medium" | "low";
  confidenceReasons: string[];
  zones: WaterReaderZone[];
  mapOutput: {
    imageUrl: string;
    overlayGeoJsonUrl?: string;
  };
  accessNote?: string;
  sourceAttribution: SourceAttribution[];
}
```

```ts
WaterReaderZone = {
  id: string;
  label: string;
  displayColor: string;
  geometry: GeoJSON.Feature;
  score: number;
  confidence: "high" | "medium" | "low";
  accessFit: "shore" | "boat" | "both";
  reasons: string[];
  limitations?: string[];
}
```

### 9.3 Engine inputs

The baseline engine should combine:

- source-backed structure evidence
- species and month profile
- access mode
- confidence and data-tier caps

Interpretation by source mode:

- `aerial` uses only visible or geometry-backed characteristics
- `aerial` may use imagery transitions only as low-confidence visual cues
- `aerial` must not use depth assumptions
- `depth` uses approved depth evidence plus numeric soft depth ranges from the species profile
- `depth` may optionally use aerial context secondarily, but only after real depth evidence exists

### 9.4 Engine rules

- Return 3-5 zones unless source evidence is too weak to support that many honestly.
- Every zone must have a reason.
- Every zone must have geometry.
- Every zone must have confidence.
- Every report must include source attribution.
- Every report must be explainable from structure plus species-season logic, even with no daily-condition enhancement.
- Every report must support a zone legend built from the returned zones themselves.

### 9.5 Scoring behavior

The baseline scoring model should preserve these components:

- structure quality
- species/month fit
- access-mode fit
- data-confidence fit

Hard caps:

- shore mode must not strongly recommend offshore-only zones
- aerial mode must not claim humps, saddles, deep breaks, or similar underwater structure without real depth evidence
- polygon-only mode must stay low confidence

Late-stage rule:

- if daily conditions are added later, they should nudge ranking and explanation only after the baseline score is computed

Transition-month rule:

- Water Reader may add at most one adjacent-month secondary overlay set
- transition overlays must be visually weaker and lower confidence than the primary current-month overlays
- transition overlays exist to capture early or delayed movement, not to double the map clutter

### 9.6 Source-mode difference rule

If a lake supports both aerial and depth:

- `aerial` and `depth` may produce different zone rankings, reasons, and report emphasis
- the change is not just visual
- both modes still share the same species, season, and access logic framework
- `aerial` and `depth` should not claim the same type of evidence unless both engines genuinely support it

---

## 10. Late-stage and cross-feature integrations

### 10.1 Daily conditions enhancement

Water Reader should later reuse existing daily intelligence for:

- daily score
- rating label
- wind
- light regime
- pressure regime
- rain/runoff regime where available
- temperature-trend regime

Rules:

- baseline Water Reader must work without this layer
- daily conditions should adjust ranking or emphasis modestly, not redefine the whole report
- daily conditions must not create unsupported structure claims
- daily conditions must not override hard caps tied to source mode or access mode
- daily conditions complete V1, but should be built after the baseline seasonal engine is proven

Expected product effect:

- windy days can boost wind-blown shoreline or points
- calm low-light days can lift shallow windows
- bright sun can lift shade and edge behavior
- high pressure or a cold front can lift slower, edge-oriented structure
- warming spring can lift protected shallows
- summer heat can lift shade, vegetation edges, and deeper refuge

### 10.2 Lure/Fly separation

Water Reader V1 should not embed a `what to throw` section in the core report.

Product rule:

- Water Reader answers `where to start and why`
- Recommender answers `what to throw`

Deferred beyond core V1:

- open the Recommender from a Water Reader report
- pass lake, species, date, and location context into that handoff

Hard boundary:

- Water Reader must not re-implement the recommender engine

---

## 11. Rendering and narration rules

### 11.1 Renderer rules

- Renderer draws engine-selected geometry only.
- The rendered map must match the selected source mode.
- Aerial reports should look like aerial reports.
- Depth reports should look like depth reports.
- The output should feel premium, simple, and uncluttered.

### 11.2 Narration rules

The narration layer may:

- explain each zone
- explain the seasonal baseline behind the zone choice
- explain confidence and limitations

The narration layer must not:

- invent zones
- invent structure
- mention depth if depth was not actually used
- mention daily-condition effects if daily conditions were not actually used
- imply Water Reader generated lure/fly recommendations when it did not
- require a top-level summary when the map and zone legend already carry the report
- overstate access certainty
- overstate confidence

### 11.3 Tone rules

Preferred language:

- `highest-probability starting zone`
- `good place to start`
- `worth checking first`
- `based on available map data`

Avoid:

- `guaranteed`
- `fish are here`
- `secret spot`
- `private access`

---

## 12. Build phases

Agents should build Water Reader one phase at a time. Do not collapse multiple late phases together just because they are related.

The first major implementation backbone is the national waterbody index and search system, because Water Reader cannot honestly attach source availability, aerial imagery, depth assets, or overlays to unnamed or unresolved lakes.

### 12.0 Current phase status

The repo did not proceed in a perfectly linear Phase 0, Phase 1, Phase 2 order. That is acceptable as long as the current state is clear.

Current status:

- **Phase 0 — Integration audit and fixture set:** partially satisfied by planning docs and fixture rows, but not a formal standalone audit artifact.
- **Phase 1 — Foundations and boundaries:** mostly satisfied by `WATER_READER_MASTER_PLAN.md`, shared contracts, source-mode vocabulary, data-tier vocabulary, and hard product boundaries.
- **Phase 2 — National waterbody index and search:** complete for the target Supabase project at the identity/search backbone level; national rows are loaded and verified.
- **Phase 3 — Source registry and rights system:** implemented as an initial backbone with reviewed status, rights fields, source links, and availability logic; not complete for launch-scale source coverage.
- **Phase 4 — Lake availability resolver:** implemented for linked sources **and** CONUS-first **USGS TNM** policy OR in the snapshot; **depth** link coverage remains thin at national scale.
- **Phase 5+ — extraction, species profiles, zone engine, renderer, frontend, daily conditions:** not started; remain blocked until product explicitly approves — **national `aerial_available` from TNM does not** mean report/map UX is built.

Near-term focus:

1. preserve national identity-load verification
2. attach reviewed **depth** source availability to real national waterbodies (CONUS-first **USGS TNM aerial source availability** is already live in the snapshot — not end-user imagery/report)
3. maintain **CONUS-first** TNM exclusions and rights posture unless QA + approval say otherwise
4. start state-by-state machine-readable depth source discovery
5. only then source-specific extraction/scoring work with explicit storage/UI approval

### Phase 0 — Integration audit and fixture set

**Goal:** Lock the baseline Water Reader scope against the real codebase before implementation starts.

**Create:**

- reuse map for existing How's Fishing and Recommender systems
- exact Water Reader report contract
- first development fixture lakes
- first species x region x month profile template

**User can do after this phase:**

- nothing user-facing yet; the baseline plan is de-risked

**Hard boundaries:**

- no UI flow
- no renderer
- no feature extraction

**Definition of done:**

- Water Reader has a clear integration map
- fixture lakes are chosen
- baseline feature boundaries are locked

### Phase 1 — Foundations and boundaries

**Goal:** Lock the feature boundary and source-of-truth rules.

**Create:**

- shared Water Reader vocabulary
- source-mode vocabulary
- rights vocabulary
- feature flags or internal gating if needed

**User can do after this phase:**

- nothing user-facing yet; the system boundary is defined

**Hard boundaries:**

- no UI flow
- no renderer
- no image analysis

**Definition of done:**

- Water Reader has one stable type and language foundation
- V1 boundaries are explicit

### Phase 2 — National waterbody index and search

**Goal:** Make named lakes and ponds searchable nationally.

**Current status:** Complete for the target Supabase project at the identity/search backbone level. The national named 3DHP standing-water rows are loaded and verified.

**Create:**

- waterbody identity store
- search endpoint
- duplicate-name disambiguation
- state/county/region resolution
- regional promoted-import validation
- full national promoted import after regional validation

**User can do after this phase:**

- search and select a named lake or pond

**Hard boundaries:**

- no fake depth claims
- no report generation yet

**Definition of done:**

- development may validate on a meaningful regional dataset first, but launch acceptance requires the full national named-lake index
- rivers do not appear in Water Reader search
- real imported records resolve correctly by `name + state + county`
- imported records with no source links honestly appear as `polygon_only` / limited data

### Phase 3 — Source registry and rights system

**Goal:** Make source review and legality enforceable.

**Current status:** Initial backbone exists. **CONUS-first USGS TNM** policy drives **aerial** `aerial_available` at national scale (snapshot only). Launch-scale **depth** and other providers still require real reviewed **link** coverage beyond fixtures.

**Create:**

- source registry
- rights-review statuses
- attribution tracking
- approved vs blocked source behavior

**User can do after this phase:**

- indirectly benefit from honest source handling

**Hard boundaries:**

- no use of unreviewed sources for reusable extraction

**Definition of done:**

- every source path is rights-aware
- blocked sources cannot be used for extraction/caching

### Phase 4 — Lake availability resolver

**Goal:** Determine which modes each lake can honestly support.

**Current status:** Initial resolver and availability snapshot exist. Launch completion still requires real per-waterbody source links and validation at scale.

**Create:**

- per-lake availability resolution
- `best_available` decision logic
- availability badge model

**User can do after this phase:**

- see whether a lake supports aerial, depth, or both

**Hard boundaries:**

- `depth available` must mean legally and technically usable

**Definition of done:**

- every searched lake resolves to an honest availability state

### Phase 5 — Source-specific characteristic identification foundation

**Goal:** Identify source-backed characteristics before the species-selection layer decides what to mark.

**Create:**

- aerial visible-characteristic extraction
- shoreline geometry and shape logic
- protected vs exposed shoreline logic
- visible vegetation and other aerial-backed cues where credible
- candidate characteristic outputs that can later be evaluated by the species-month-region engine

**User can do after this phase:**

- nothing fully user-facing yet; Water Reader can identify candidate map characteristics on supported lakes

**Hard boundaries:**

- no daily-condition dependency
- no lure/fly integration
- no underwater depth claims from aerial imagery

**Definition of done:**

- aerial-backed candidate characteristics can be identified cleanly from approved aerial sources
- the output stays source-honest and does not infer true underwater depth

### Phase 6 — Baseline species-season profile system

**Goal:** Define the selection logic that decides which identified characteristics matter for each species, month, and region.

**Create:**

- species x region x month profiles
- depth-mode numeric soft ranges
- preferred structure and cover types
- shoreline vs offshore bias
- fallback structures when ideal structure is absent
- adjacent-month transition overlay rules

**User can do after this phase:**

- nothing fully user-facing yet; the seasonal selection logic foundation exists

**Hard boundaries:**

- no daily-condition dependency
- no lure/fly integration

**Definition of done:**

- all three launch species have baseline monthly profiles
- the profile system is explicit, editable, and simple enough to maintain
- transition behavior is defined without allowing cluttered or conflicting overlays

### Phase 7 — Deterministic zone engine MVP

**Goal:** Turn identified characteristics plus monthly species logic into ranked fishing zones.

**Create:**

- core scoring engine
- zone ranking
- confidence behavior
- access-mode hard caps

**User can do after this phase:**

- receive deterministic zones from source-backed evidence

**Hard boundaries:**

- no AI-decided zones
- no daily-condition dependency

**Definition of done:**

- 3-5 deterministic zones are returned when evidence is sufficient
- zone ranking changes meaningfully by species, month, access mode, and source evidence

### Phase 8 — Renderer and report output

**Goal:** Turn the structured report into a premium visual output.

**Create:**

- map renderer
- overlay styles
- report response shape
- color-coded zone legend output
- source attribution display

**User can do after this phase:**

- view a map-first Water Reader report

**Hard boundaries:**

- the renderer draws only engine-selected geometry

**Definition of done:**

- the report is visually credible and uncluttered
- the legend is sufficient to explain the zones without requiring a top-level summary

### Phase 9 — Water Reader frontend flow

**Goal:** Build the end-to-end app experience.

**Create:**

- Water Reader entry point
- lake search flow
- species and mode selection
- source-mode toggle
- loading and report screens

**User can do after this phase:**

- complete the main Water Reader flow end to end

**Hard boundaries:**

- UI must stay simple and map-first

**Definition of done:**

- a user can search, configure, generate, and view the report

### Phase 10 — Depth mode expansion

**Goal:** Make approved and usable depth sources a true premium path through a separate depth engine.

**Create:**

- machine-readable depth feature extraction
- aligned chart-image depth support where credible as a secondary tier
- depth-mode candidate zones
- depth-mode report rendering

**User can do after this phase:**

- run depth-backed reports on lakes that support them
- switch between aerial and depth when both are available

**Hard boundaries:**

- depth mode must use reviewed and approved sources only
- machine-readable depth remains the preferred depth path
- chart-image depth should be used only when the path is reviewed and alignable

**Definition of done:**

- depth mode is live for approved/usable sources
- Water Reader can ship a credible national best-available experience

### Phase 11 — Late-stage daily conditions completion layer

**Goal:** Let Water Reader respond to the day without making daily conditions part of the baseline dependency chain.

**Create:**

- daily-context bridge
- late-stage daily scoring modifiers
- optional `today's bias` note if the structured output supports it

**User can do after this phase:**

- see subtle zone ranking or emphasis shifts with real daily conditions

**Hard boundaries:**

- Water Reader must still function without this layer
- Water Reader should not duplicate How's Fishing logic unnecessarily
- daily logic must not overpower the baseline species-season engine

**Definition of done:**

- daily conditions can enhance the report cleanly
- the baseline report identity remains intact

### Phase 12 — State-by-state source expansion

**Goal:** Expand approved source coverage after launch.

**Create:**

- source discovery workflow
- state-by-state ingestion backlog
- priority expansion process

**User can do after this phase:**

- benefit from broader depth coverage over time

**Hard boundaries:**

- do not lower rights standards to grow coverage

**Definition of done:**

- Water Reader has a repeatable state-by-state enrichment pipeline

### Phase 13 — V2 upload mode

**Goal:** Add private one-time image/chart analysis after the named-lake system is stable.

**Create:**

- upload intake
- private processing path
- upload-specific confidence handling

**User can do after this phase:**

- attach an image/chart to a selected lake for a private report path

**Hard boundaries:**

- uploads do not enrich the global lake index by default

**Definition of done:**

- upload reports are private, confidence-aware, and clearly separated from named-lake intelligence

### V1 finish line

Water Reader full V1 is complete after **Phase 11** if:

- national named-lake search is live
- source availability is honest
- the full national named lake/pond index is live
- baseline species-season profiles are live
- aerial mode is live
- depth mode is live for approved/usable paths
- best-available works
- the report is deterministic, rendered, and confidence-aware
- daily conditions are layered in without breaking the baseline engine
- Water Reader stands on its own as a clean `where to start` feature

---

## 13. Testing and acceptance

### 13.1 Required scenario families

- national lake search and duplicate-name disambiguation
- aerial-only lake
- depth-only lake
- lake with both aerial and depth where source-mode switch changes report output
- shore vs boat differences
- low-data polygon-only fallback
- blocked or restricted source rights
- on-demand approved depth fetch
- failed depth fetch with aerial fallback
- transition-month secondary overlays behaving as lower-confidence overlays
- species/month baseline changing zone ranking
- narration never inventing unsupported structure
- daily conditions modestly reranking baseline output without breaking hard caps

### 13.2 Engine invariants

- every report has a selected source mode
- every report has a data tier
- every report has confidence
- every report has source attribution
- every zone has geometry
- every zone has a reason
- unsupported structures never appear for the active source mode
- Water Reader can generate a useful report without daily-condition integration
- Water Reader does not depend on lure/fly integration to complete its core job
- aerial mode never claims underwater structure from imagery alone
- depth mode never uses unreviewed sources
- transition overlays never exceed one adjacent-month secondary overlay set

### 13.3 V1 user acceptance

V1 is successful if a user can:

1. search a named lake or pond
2. see which source modes are available
3. run `best_available` or choose `aerial`/`depth` when supported
4. get 3-5 deterministic zones with a clean overlay and honest confidence
5. see the report change meaningfully by species, access mode, month/season, and source evidence
6. see the report shift modestly with daily conditions without changing the baseline identity of the feature

---

## 14. Launch checklist

- [ ] National waterbody search is live.
- [ ] Full national named lake/pond index is live.
- [ ] Lakes show honest source availability.
- [ ] `best_available` is the default mode.
- [ ] Baseline species-season profiles are live for all supported species.
- [ ] Water Reader works as a standalone `where to start` engine.
- [ ] Aerial mode is usable nationally where public aerial is available.
- [ ] Aerial mode uses visible/geometry-backed cues only and does not infer true depth structure.
- [ ] Depth mode works for approved and usable sources.
- [ ] Depth mode uses reviewed/approved sources only.
- [ ] Machine-readable depth is preferred over chart-aligned depth when both are credible.
- [ ] Shore reports include `Access not verified`.
- [ ] Aerial mode never invents underwater structure.
- [ ] Blocked or unreviewed sources do not drive reusable extraction.
- [ ] Reports include data tier, confidence, and attribution.
- [ ] Renderer output looks premium and uncluttered.
- [ ] Zone legend is color-coded and sufficient without a required top-level summary.
- [ ] Narration is validated against structured report data.
- [ ] Water Reader does not embed a full `what to throw` section in the core report.
- [ ] Transition overlays, when shown, are weaker and lower confidence than current-month overlays.
- [ ] Report persistence follows source-rights rules.
- [ ] The feature feels national through best-available coverage, not fake completeness.
- [ ] Daily-condition adjustments are additive and do not overpower the baseline engine.

---

## 15. Architecture mantra

> **The baseline deterministic engine decides. The renderer draws. AI explains. Source rights control what can be fetched, stored, derived, and cached.**
