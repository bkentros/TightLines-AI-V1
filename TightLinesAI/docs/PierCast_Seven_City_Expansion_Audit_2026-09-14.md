# PierCast Seven-City Expansion Audit

**Date:** 2026-09-14

**Status:** Phase 0 research and architecture audit; not a production admission decision

**Proposed places:** Port Washington, Milwaukee, Racine, and Kenosha, Wisconsin; Harbor Beach, Oscoda, and Port Sanilac, Michigan

## Executive decision

PierCast can support all seven proposed places, but none should be added by simply copying an existing city's curves or changing the current five-city constant. The released system is intentionally frozen at five cities, seven covered structures, and a versioned public city/species roster. Its temperature archive, database RPC, daily score snapshot, validation suite, public release policy, server types, and client contract all assume that frozen scope.

The most defensible sequence is:

1. **Port Washington** as the first expansion dossier.
2. **Racine** and **Kenosha** as the next Wisconsin dossiers.
3. **Milwaukee**, but only after selecting a specific covered structure—McKinley Pier is the leading research candidate—not as a single score for the entire city waterfront.
4. **Oscoda** as the first Lake Huron prototype and the first serious case for adding Atlantic salmon.
5. **Harbor Beach** after reconciling the public pier, harbor, and detached-breakwall references.
6. **Port Sanilac** only after the village or harbor master confirms the exact legal fishing route and segments, because the current municipal fishing description and current harbor ordinance do not cleanly resolve the same space.

This audit does **not** assign numeric year-round seasonal scores. Agency sources can establish occurrence, recurring opportunity, timing, method, access, and biology; they do not publish “PierCast scores.” The numeric knots are FinFindr calibration judgments. Michigan DNR's creel methodology specifically warns against transferring observations from one place or month to another.[^1] Assigning twelve-month values before the exact-structure evidence ledgers are complete would therefore create false precision and violate the method already used for the first five cities.

The recommended product approach is to keep the current production roster unchanged, build a versioned expansion cohort in owner review/shadow mode, and promote city/species pairs only after each pair independently clears the existing admission standard.

## 1. What PierCast actually is

PierCast is a structure-bounded, species-specific opportunity model. The city name is a navigation label; the scientific claim applies only to the explicitly covered pier, breakwater, catwalk, or other shore-access structure and the modeled water beside it. It is not a claim about a whole harbor, river, county, or offshore fishery.

The runtime flow is:

```text
NOAA LMHOFS 121-hour temperature guidance
                 |
                 v
fixed audited grid cell per city -> complete, coherent all-city cycle
                 |                            |
                 |                            +-> temperature events/context
                 v
city/species annual opportunity curve + shared species thermal curve
                 |
                 v
hourly opportunity -> duration-weighted local-day score -> species headline
                 |
                 +-> immutable daily score snapshot
                 +-> live weather/wind/access context
                 +-> public catalog/leaderboard or gated city report
```

The principal implementation surfaces are [scope.ts](../supabase/functions/_shared/pierCastEngine/config/scope.ts), [cities.ts](../supabase/functions/_shared/pierCastEngine/config/cities.ts), [species.ts](../supabase/functions/_shared/pierCastEngine/config/species.ts), [rating.ts](../supabase/functions/_shared/pierCastEngine/scoring/rating.ts), [lmhofs.ts](../supabase/functions/_shared/pierCastEngine/providers/lmhofs.ts), [dailyScoreSnapshots.ts](../supabase/functions/_shared/pierCastEngine/archive/dailyScoreSnapshots.ts), and [publicRelease.ts](../supabase/functions/_shared/pierCastEngine/config/publicRelease.ts).

### 1.1 Current scope and release gates

The engine scope is versioned as `piercast-five-city-four-species-v1`. It freezes:

- Ludington, Grand Haven, Manistee, Frankfort-Elberta, and Sheboygan;
- Chinook salmon, coho salmon, steelhead, and brown trout as the four core species;
- seven exact covered structures;
- thirteen globally known species dispositions for every city; and
- five fixed LMHOFS grid cells.

The raw research profiles remain `publicEnabled: false` and `ratingEnabled: false`. Public availability comes from a separate owner-approved, exactly versioned release roster—not from casually flipping those flags. The current public roster contains 28 admitted city/species pairs: 6 Ludington, 6 Grand Haven, 8 Manistee, 4 Frankfort-Elberta, and 4 Sheboygan.

That separation is valuable and should be retained. It permits research and shadow calculations without accidentally enlarging the public claim.

### 1.2 The scoring equation

For a city `c`, species `s`, local date `d`, and modeled surface-water temperature `t`, the instantaneous score is:

```text
P = recurring annual city/species opportunity, linearly interpolated from MM-DD knots (1..10)
T = shared species temperature suitability, piecewise-linear in degrees Celsius (0..1)

score = clamp(1, 10, 1 + (P - 1) * (0.30 + 0.75*T))
```

This is formula version `seasonal-opportunity-bounded-temperature-v2`. Temperature therefore modifies the opportunity above the floor; it does not invent a run where the seasonal curve says none exists. A temperature suitability of zero retains 30% of the opportunity above 1.0. Perfect temperature gives at most a 5% lift above the seasonal baseline. Suitability must exceed 0.9333 before it produces any lift at all.

The daily score is a duration-weighted integration of the hourly score trace over the complete local civil day. A missing interval, overlapping interval, incomplete horizon, invalid value, or unsupported biology fails closed. Daylight-saving days are correctly treated as 23 or 25 elapsed hours. The headline is the highest eligible complete species score, with a stable tie break.

This headline rule creates a product consideration for expansion: admitting more species gives a city more chances to produce the maximum. That is mathematically valid, but it can create a breadth advantage between cities. Public comparisons should therefore disclose the number of admitted species and support target-species filtering; cities should not be normalized to make their headlines look comparable.

### 1.3 Temperature, weather, and access

PierCast uses the NOAA Lake Michigan and Huron Operational Forecast System, or LMHOFS, for its scoring temperature. The modern product covers **both Lake Michigan and Lake Huron** in one FVCOM/CICE model domain, runs four times per day, and supplies 120-hour forecast guidance.[^2] The retired separate Lake Huron system should not be introduced as a new provider.[^3]

The existing sampler selects one lakeward wet surface cell near an authoritative outer-light reference, checks plausible temperature bounds, requires the entire 121-point forecast, and archives only a complete coherent cycle. NOAA reports that the combined unstructured grid has 90,806 nodes and variable resolution of roughly 50 metres to 2.5 kilometres, with finer nearshore resolution; the regular-grid NetCDF product used here is still a representation of that model, not a measurement at the pier.[^4]

GLOS or field observations are validation evidence only. They do not replace model values in the live score. Every current representation profile remains unapproved for scientific validation, and the release disclosure correctly says the temperatures are modeled and unverified.

Weather and wind are displayed conditions, not score inputs. Access, closures, unsafe conditions, legal restrictions, and open-water limitations are separate notices or promotion gates. A high biological score never means a structure is open, safe, or legal to fish.

### 1.4 Daily locking and account behavior

The production service commits the first complete live cycle for a Lake Michigan date into an immutable Central-time daily score snapshot. Conditions may refresh afterward, but the displayed score for that date stays fixed. Cached temperature can serve fallback conditions but cannot create a new lock.

The current implementation is explicitly five-city and Central-time. Eastern-time Michigan cities are handled at the midnight seam by temporarily applying the prior Central snapshot. Adding three Eastern-time cities makes that seam a first-class product decision. The expansion should introduce a versioned snapshot contract with an explicit scope version and either:

- per-city local-date locks; or
- documented timezone cohorts, while preserving the historical Lake Michigan snapshot behavior.

The public catalog and leaderboard are available without an account. Detailed reports are subject to authentication and the one-lifetime-free-city/day entitlement. The leaderboard currently shows only five entries; with twelve cities, the UI should explicitly say “Top 5” and provide a view-all path rather than appearing to list every supported city.

## 2. The onboarding method used by the current system

The first-five workflow can be stated as ten auditable decisions.

1. **Freeze the structure.** Name the exact fishable structure or structures, coordinates, land manager, route from public access, seasonal hours, parking, construction status, and closure authority. Record what nearby water is excluded.
2. **Build the evidence ledger.** Preserve source URL, publisher, publication/report date, retrieval date, quoted or transcribed fact, geography, structure, fishing mode, species, time period, and evidence limitation.
3. **Disposition every species.** Every globally known species receives an admitted, research-only, or unavailable decision at every city. Silence is not absence.
4. **Prove recurring covered-structure catches.** Use independent dates or years, or a mode-specific creel series plus exact-location corroboration. A generic county, harbor, tributary, or boat report cannot alone prove pier opportunity.
5. **Construct a complete annual curve.** Anchor strong periods to dated local evidence. Mark weak-month values as bounded calibration judgment. Never convert missing reports or estimated zero harvest into biological absence.
6. **Map shared thermal biology.** Use agency, peer-reviewed, or university sources to define a species curve; keep local seasonal opportunity separate from shared physiological temperature suitability.
7. **Encode regulation and access validity.** Include source dates and valid-through dates. Do not automatically reopen a closed structure because a calendar date changes.
8. **Audit the model cell.** Select and freeze the nearest defensible lakeward wet cell, document distance and bathymetric/shoreline concerns, compare against independent observations where available, and retain it as candidate until reviewed.
9. **Replay and shadow.** Validate all dates, year boundaries, leap days, daily coverage, event detection, archive completeness, forecasts, and outcome capture without joining public headlines.
10. **Approve an exact public roster.** Promotion is an explicit owner decision against a versioned city/species manifest and disclosure. It is not implied by the presence of a curve.

The current [Final Roster Reconciliation](./PierCast_Final_Roster_Reconciliation.md) expresses the right biological admission standard: identified species; recurring catches at the covered structure; a complete annual curve; and an applicable thermal profile. Popularity, dominance, or being a traditional target is not required. Unidentified “bass” or “whitefish” cannot be split into a species-specific model.

## 3. Source policy for the expansion

### 3.1 Evidence hierarchy

Use sources in this order:

1. State DNR/equivalent or tribal fisheries agencies for species occurrence, creel estimates, weekly catch reports, survey design, stocking, and regulations.
2. NOAA, USGS, USFWS, and equivalent public science agencies for hydrodynamics, temperatures, charts, and biology.
3. Peer-reviewed literature, university extension, and Sea Grant for biological gaps.
4. Municipalities, counties, harbors, and land managers for access, structure identity, hours, construction, and closures.
5. Established monitoring networks for validation observations.

Commercial guides, social posts, forums, videos, and search-result snippets must not be foundational scoring evidence. They can generate a research lead, never an admission.

### 3.2 What each source can and cannot prove

- A weekly DNR report proves a recent observation in its stated place and fishing mode; it does not define an entire month or year.
- A long-term creel table can prove persistence in a county and mode; it may not distinguish two piers in the same county and measures estimated harvest rather than all catches or target success.
- A DNR “better waters” inventory can prove a species belongs to a wider waterbody; it does not prove recurring catches from the selected pier.
- A municipal page can establish public access; it cannot establish seasonal abundance.
- A regulation digest establishes rules for its effective period; it does not prove physical access or safety.
- A model forecast supplies the environmental modifier; it does not validate the biological calibration.

Wisconsin's long-term Lake Michigan tables are especially useful because they report county, fishing mode, species, and year from 1998–2024.[^5] However, the most recent annual survey has temporal limitations, including a principal May–September field period and modeled treatment for some unsampled spring activity; those limits must be attached to every calibration derived from it.[^6]

Michigan's weekly report explains that reports are assembled from DNR personnel and creel clerks and describe roughly the preceding week, while Great Lakes conditions can change daily or hourly.[^7] The creel program uses angler interviews and effort counts.[^8] These are strong inputs when used at their actual resolution—not licenses to extrapolate across place or month.

Regulation review is a separate, recurring control. Wisconsin's current fishing regulations portal is the authoritative starting point for Lake Michigan rules and updates.[^30] Michigan's 2026 digest lists the Lake Huron Great Lakes trout and salmon season as open all year, subject to its species limits and other rules; that biological season does not override a municipal harbor season, an unsafe structure, ice, construction, or a closure.[^31] Every published profile should carry a regulation version and valid-through date, with annual review and an immediate review when an agency posts a change.

## 4. Candidate-city audit

The statuses below mean:

- **Dossier first:** enough authoritative evidence exists to build the formal evidence ledger now; no numeric curve is approved yet.
- **Prototype:** useful expansion candidate that also requires a new infrastructure or species capability.
- **Blocked:** a foundational structure/access question prevents an honest scoring boundary.

| Priority | Place | Initial status | Best-supported research species | Principal unresolved issue |
|---:|---|---|---|---|
| 1 | Port Washington, WI | Dossier first | Coho, Chinook; then brown trout and steelhead | Exact seasonal density for all four at retained structure |
| 2 | Racine, WI | Dossier first | Coho; core-four research queue | North vs south structure scope and species/date density |
| 3 | Kenosha, WI | Dossier first | Core-four research queue | Current exact-pier seasonal corroboration |
| 4 | Milwaukee, WI | Dossier after structure decision | Core-four research queue | Multiple non-equivalent sites; no honest citywide pier score |
| 5 | Oscoda, MI | Lake Huron prototype | Atlantic, walleye, steelhead, lake trout, coho, Chinook, drum, channel catfish, smallmouth | Exact pier/catwalk identity, access dossier, Huron cell audit |
| 6 | Harbor Beach, MI | Dossier after structure reconciliation | Coho, smallmouth, northern pike; walleye research lead | Public pier vs harbor vs detached breakwall identity |
| 7 | Port Sanilac, MI | Blocked pending access confirmation | Coho and steelhead; several research leads | Municipal ordinance appears narrower than visitor-facing access copy |

### 4.1 Port Washington, Wisconsin

Wisconsin DNR lists Port Washington Harbor/Fisherman's Park as Lake Michigan shore access.[^9] Its close-to-home guide names the Port Washington breakwalls and explicitly identifies salmon, steelhead, and brown trout as pier/shore opportunities, with the entrance on the north side.[^10] The current weekly report adds exact recent evidence: at the North Pier and nearby shore, anglers reported limits containing coho and Chinook during the week ending September 7, 2026.[^11]

The Ozaukee County pier-mode series provides long-term context. In 2024 it estimated pier harvest of 418 coho, 25 Chinook, 316 brown trout, and 34 rainbow trout/steelhead.[^5] Those figures support recurrence at the county/mode level, but they do not by themselves prove that every fish came from the selected Port Washington structure or establish twelve monthly values.

**Recommendation:** retain the North Pier/breakwall as the initial structure candidate, subject to a current land-manager route and closure audit. Build coho and Chinook dossiers first because exact, current structure-level evidence exists. Build brown trout and steelhead dossiers next using archived weekly reports to connect the county/mode record to the exact structure. Do not copy Sheboygan values despite the geographic proximity.

### 4.2 Racine, Wisconsin

Wisconsin DNR lists several distinct public sites: North Pier/North Beach, Harbor/Reefpoint, South Pier, and Wooden Pier.[^9] The close-to-home guide names the north and south piers for salmon, steelhead, and brown trout.[^10] The September 7, 2026 weekly report specifically says anglers caught some coho from the South Pier.[^11]

The Racine County 2024 pier estimates were 120 coho, 60 Chinook, 75 rainbow trout/steelhead, and 44 brown trout.[^5] Historical rows make this a strong mode-specific recurrence source, but a city profile still needs a declared structure boundary.

**Recommendation:** evaluate South Pier and North Pier separately before deciding whether they can share one city profile. Admit neither merely because the county table is positive. Coho has the strongest current exact-pier observation; the other core species need archived exact-pier dates across their shoulder and peak periods.

### 4.3 Kenosha, Wisconsin

Wisconsin DNR lists Kemper Center, Harbor/Navy Pier, Simmons Island, and South Pier as separate access locations.[^9] The close-to-home guide identifies the Kenosha north and south piers for salmon, steelhead, and brown trout.[^10] The 2024 county pier estimates include 53 coho and 48 brown trout, while Chinook and rainbow trout/steelhead are estimated at zero for that survey year.[^5]

Those zeros must not be encoded as year-round absence: they are annual estimates within a survey design, and the same long-term tables include other years. Conversely, the general species guide is not enough to invent peak months.

**Recommendation:** choose a single initial structure after comparing access reliability, LMHOFS representation, and archived weekly-report specificity. Treat all four salmonids as research candidates, not automatic admissions. Require recent exact-pier corroboration and multi-year month coverage before curve construction.

### 4.4 Milwaukee, Wisconsin

Wisconsin DNR lists multiple public sites across a long, physically varied waterfront: Cupertino, Grant Park, Harbor Island, Jones Island, McKinley Marina, South Shore, and Veterans Park.[^9] The close-to-home guide specifically identifies McKinley Pier for salmon, steelhead, and brown trout.[^10] The 2024 Milwaukee County pier estimates include 192 coho, 79 Chinook, 97 brown trout, and an estimated zero rainbow trout/steelhead.[^5]

The current weekly report notes increased shore casting around the red lighthouse and Lakeshore State Park but does not identify species in that sentence; no species should be inferred from adjacent prose.[^11]

**Recommendation:** do not create a “Milwaukee” score that blends every listed site. Start a McKinley Pier-only dossier, or create separately named structure profiles if the product is meant to cover more than one hydrographic setting. The display label should say what the score covers. The core four remain research candidates; the historical/mode evidence and exact weekly archives must be reconciled at the chosen structure.

### 4.5 Oscoda, Michigan

Michigan DNR's broad Lake Huron inventory for Oscoda lists Atlantic salmon, channel catfish, coho, lake trout, lake whitefish, rock bass, smallmouth bass, steelhead, and walleye.[^12] That inventory is a lead list, not a pier roster.

The stronger evidence is a sequence of exact DNR weekly reports referring to the Oscoda pier/catwalk:

- March 25, 2026: lake trout and occasional steelhead.[^13]
- April 1, 2026: steelhead, Atlantic salmon, and walleye.[^14]
- May 8, 2024: Atlantic salmon off the end of the pier and walleye from the pier.[^15]
- September 24, 2025: coho, Chinook, and Atlantic salmon from the pier/catwalk.[^16]
- October 22, 2025: walleye, Atlantic salmon, and steelhead.[^17]
- July 15, 2026: freshwater drum and channel catfish.[^18]
- July 30, 2025: smallmouth bass, freshwater drum, and channel catfish.[^19]

This is the deepest exact-mode species lead set among the seven proposed places. It justifies evidence-ledger work for nine species: Atlantic salmon, walleye, steelhead, lake trout, coho, Chinook, freshwater drum, channel catfish, and smallmouth bass. It does not yet approve nine curves.

NOAA Coast Pilot describes parallel piers at the mouth of the Au Sable River with lights at their outer ends.[^20] Local planning material also refers to an Oscoda Beach Park fishing/observation pier. Those references must be mapped before they are treated as one structure; “pier/catwalk” in a DNR report cannot be silently reassigned to a nearby observation pier.

**Recommendation:** make Oscoda the first Huron shadow prototype after (1) freezing the exact DNR-referenced structure and legal route, and (2) selecting and auditing a new LMHOFS Huron grid cell. Add Atlantic salmon to the global schema only when its shared thermal dossier and all-city dispositions are ready. Do not add lake whitefish or rock bass solely from the broad-water inventory.

### 4.6 Harbor Beach, Michigan

Michigan DNR's broad Harbor Beach inventory lists coho, lake trout, smallmouth bass, steelhead, and walleye.[^12] Exact reports add useful but narrower evidence. On September 24, 2025, anglers at the Harbor Beach breakwall reported northern pike and smallmouth bass, with occasional coho; October 15 reported coho at the breakwall.[^16][^21] October 9, 2024 also reported coho from the pier/harbor, and an April 2022 report included coho, steelhead, and occasional lake trout across Harbor Beach and Port Sanilac.[^22][^23] Older DNR reports supply exact leads for walleye outside the breakwalls and coho/brown trout from the breakwall.[^24][^25]

The physical boundary is not yet clean. NOAA Coast Pilot describes Harbor Beach as an artificial refuge protected by detached breakwaters and separately describes an approximately 850-foot public dock.[^20] The city describes the Judge James H. Lincoln Memorial/Trescott Street Pier as public fishing access.[^26] A DNR “breakwall” report cannot be assumed to describe the city pier, and a detached breakwater may not be publicly reachable.

**Recommendation:** reconcile the Trescott Street public pier, the 850-foot dock, and every DNR “pier/breakwall” reference on a map with the city/harbor authority. Coho, smallmouth bass, and northern pike are the first exact-location research dossiers. Walleye is an older exact lead. Lake trout and steelhead need stronger exact-structure recurrence; brown trout needs current corroboration.

### 4.7 Port Sanilac, Michigan

Michigan DNR's broad inventory lists coho, lake trout, steelhead, walleye, and yellow perch.[^12] Exact weekly evidence is strongest for coho and steelhead: both north and south areas produced occasional coho and steelhead in September 2025; coho and steelhead were reported from the pier in October 2025; and both were reported from the breakwall in April 2025.[^16][^21][^27] Additional reports provide exact leads for northern pike, Atlantic salmon, smallmouth bass, walleye, and occasional lake trout, but not yet enough recurring, season-spanning evidence to admit all of them.[^15][^23][^24]

Access is the gating issue. The village visitor page says fishing is available from the breakwall and gives the harbor season as May 1–October 31.[^28] The current harbor ordinance prohibits fishing in the south basin, boat channels and fairways, municipal docks, harborfront sidewalks, the dock/ramp basin, and certain areas north of the village docks without permission; it also allows temporary closures by the harbor master.[^29] These statements may be reconcilable through an exact legal segment, but the code must not guess which segment that is.

**Recommendation:** block public onboarding until the village or harbor master confirms, in writing or an authoritative map, the legal route and fishable segment corresponding to the DNR reports. Once resolved, coho and steelhead are the first dossiers. Keep northern pike, smallmouth, Atlantic salmon, walleye, lake trout, and yellow perch in research until each clears exact-structure recurrence.

## 5. Species expansion decision

### 5.1 Atlantic salmon: prepare for schema admission

Atlantic salmon is the strongest genuinely new species case. Oscoda has exact pier/catwalk reports in multiple years and seasons, including spring and fall.[^14][^15][^16][^17] The app already has an Atlantic salmon artwork route in the River Run image map, reducing—but not eliminating—the client work.

Adding it still requires:

- a server and client species ID/label;
- a shared, evidence-backed Atlantic salmon thermal curve;
- a complete twelve-month evidence state for each candidate city curve;
- explicit admitted/research-only/unavailable dispositions in **all twelve** cities;
- regulation and identification review; and
- dedicated scoring, serialization, archive, UI, and compatibility tests.

Atlantic salmon should not be represented by a coho or Chinook thermal curve merely because all are salmonids.

### 5.2 Northern pike: retain as research-only for now

Northern pike is an important Harbor Beach and Port Sanilac lead, and exact DNR reports support its presence.[^15][^16] Current evidence is not yet dense enough to justify a twelve-month pier-specific calibration. Adding a global species imposes a full disposition burden everywhere, so northern pike should remain research-only until archived reports establish recurring exact-structure opportunity and seasonal shape. A generic pike/musky image is not an ideal final species asset.

### 5.3 Do not expand the taxonomy speculatively

Pink salmon, rock bass, and other locally possible species should not be added because they appear in a general waterbody inventory or isolated report. Each new global species multiplies validation, research, UI, and maintenance work. With Atlantic salmon and northern pike, the global set would grow from 13 to 15. Across 12 cities that means 180 explicit dispositions. Relative to today's 5 × 13 matrix, that is 115 new decisions: 105 for the seven new cities and 10 retroactive decisions for the two new species in the existing five.

## 6. How to create year-round scores without fabricating them

No agency provides the final 1–10 PierCast curve. The curve must be a transparent synthesis with four layers kept separate:

1. **Direct observation:** dated, exact covered-structure DNR reports.
2. **Recurrence context:** multi-year pier-mode creel data or repeated exact reports.
3. **Biological constraint:** agency or scientific migration, spawning, and thermal information.
4. **FinFindr calibration judgment:** the chosen knot dates and numeric values, clearly labeled and versioned.

For every city/species pair:

1. Assemble all qualifying observations by exact date, year, structure, fishing mode, and outcome.
2. Mark months as direct, corroborated, inferred, or unsupported. Never treat no report as a zero catch.
3. Propose the fewest knots that explain supported changes; interpolate daily using the existing circular annual method.
4. Write a rationale for every knot, especially winter and shoulder months. Keep minimum opportunity nonzero only when evidence supports possible open-water fishing; a biological score never promises safe ice or open access.
5. Apply the shared species temperature curve only after the annual opportunity curve exists. Temperature must not repair a missing seasonal evidence case.
6. Replay every day in normal and leap years, compare cities on the same absolute rubric, and inspect discontinuities and headline changes.
7. Keep all new pairs private/provisional until prospective outcomes exist and owner approval names the exact version.

The next research pass should produce evidence matrices and proposed knots—not immediately merge them into production. Where evidence is sparse, the correct result is `unavailable`, not a smooth-looking guessed number.

## 7. Required architecture work

The present hard stops are useful safety rails, but must become version-aware rather than be removed.

| Surface | Current assumption | Expansion change |
|---|---|---|
| Server types | Five city IDs; 13 species IDs | Add versioned city/species registries; add Atlantic only after dossier |
| Scope validation | Exactly five cities and seven structures | Validate an exact manifest per scope version |
| City config | 13 dispositions per city | Generate/validate every disposition from the versioned species registry |
| LMHOFS config | Five fixed cells | Add seven independently audited wet surface cells |
| Live provider/archive | Exactly 5 × 121 = 605 rows | Derive expected rows from immutable cohort manifest |
| Database RPC | Exact five IDs/cells and 605 rows | Version/checksum-aware atomic commits; preserve v1 reads |
| Daily snapshot | Five cities, Central lake date | Add scope version and local-date/timezone-cohort semantics |
| Shadow forecast | Fixed payload size | Derive from admitted private roster and scope version |
| Public release | Exact 28-pair roster | New owner-approved roster version; retain old snapshots |
| Client contract | Duplicated city/species unions and labels | Update from one generated contract or enforce parity tests |
| Leaderboard | `slice(0, 5)` | Label Top 5 and add full supported-city discovery |
| Artwork | Core species routed; partial additional coverage | Explicit exact-species artwork fallback and accessibility review |

### 7.1 Do not let one experimental city take down production

Today, one failed city-hour makes the all-five live cycle unavailable. If that rule is expanded naïvely, one questionable new Huron cell could withhold conditions for all twelve places. Use immutable ingestion cohorts, for example:

- existing five-city production cohort;
- Wisconsin expansion shadow cohort; and
- Lake Huron shadow cohort.

Each cohort should remain internally atomic. Promotion can later consolidate cohorts only after equivalent reliability is demonstrated. A manifest should include scope version, city IDs, grid coordinates, expected horizons, checksum, and activation state. The database must validate the manifest rather than accept arbitrary partial input.

### 7.2 Preserve old snapshots and contracts

Never reinterpret a historical five-city snapshot using a new roster. New rows should carry their scope/roster/formula versions, while readers retain exact compatibility with prior releases. Schema expansion must be additive. The public release policy should continue to serialize only owner-approved city/species pairs and strip private curves.

## 8. Rollout plan and definition of done

### Wave A — evidence and boundary closure

- Produce one structure/access dossier for each proposed place.
- Resolve Milwaukee to one or more explicitly named structures.
- Obtain authoritative Harbor Beach structure mapping.
- Obtain authoritative Port Sanilac legal access confirmation.
- Build source ledgers and species disposition matrices without numeric scores.

### Wave B — Wisconsin shadow cohort

- Select/audit Port Washington, Racine, Kenosha, and Milwaukee LMHOFS cells.
- Draft only evidence-supported core-species annual curves.
- Add versioned dynamic manifests and database migrations.
- Run annual, five-day, archive-failure, DST, and cross-city headline replays.
- Operate privately until outcome and temperature-representation evidence is sufficient.

### Wave C — Lake Huron prototype

- Freeze Oscoda's exact structure.
- Audit Oscoda's LMHOFS cell and independent observation source.
- Complete Atlantic salmon taxonomy, thermal, regulation, artwork, and all-city disposition work.
- Run Huron as an isolated shadow cohort before Harbor Beach or Port Sanilac.

### Wave D — Huron completion and public approval

- Resolve Harbor Beach and Port Sanilac access boundaries.
- Add only city/species pairs that independently pass admission.
- Review headline breadth effects and UI discovery with twelve cities.
- Issue a new disclosure and exact owner-approved public roster.

A city/species pair is done only when it has:

- exact structure and access evidence with current closure authority;
- recurring identified catches at that structure or a documented bounded inference;
- complete, versioned annual curve with source-to-knot rationale;
- an applicable, evidence-backed shared thermal curve;
- current regulations and valid-through dates;
- audited model cell and representation limitations;
- passing schema, integration, annual replay, archive, snapshot, and compatibility tests;
- private shadow forecasts and outcome capture; and
- explicit owner approval in the public roster.

## 9. Baseline verification

On 2026-09-14, `npm run qa:pier-cast:foundation` passed **172 tests with 0 failures**. The suite confirms the five-city/four-core-species freeze, the five-cell LMHOFS contract, 605-row complete-cycle archive, Central daily lock, public/private roster separation, yearly interpolation, failure-closed behavior, and backward-compatible snapshot handling.

This is a strong starting point. Expansion work should change those assertions deliberately under a new scope version, not weaken or delete them.

## Conclusion

The seven-city plan is feasible and well aligned with PierCast, but the safe unit of expansion is an **exact structure × identified species × versioned evidence record**, not a city name. Wisconsin is operationally closest because it shares the existing LMHOFS basin workflow and offers long-term pier-mode creel data. Oscoda is scientifically compelling and should lead Lake Huron because DNR reports name many species directly at the pier/catwalk. Harbor Beach and especially Port Sanilac need access-boundary resolution before scores are defensible.

The immediate next deliverable should be the Port Washington evidence ledger and structure dossier, followed by Racine and Kenosha. In parallel at the design level, PierCast needs versioned dynamic manifests, cohort-based ingestion, and explicit snapshot timezone semantics. Numeric curve calibration should begin only after those city-specific evidence ledgers exist.

## Sources

[^1]: Michigan DNR, Lake Huron Citizens Fishery Advisory Committee meeting material describing creel estimation limits: [place and month estimates are not transferred](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LHCFAC/LHCFAC-Archive/Minutes/minutes-oct-4-2022.pdf).
[^2]: NOAA Tides & Currents, [Lake Michigan and Huron Operational Forecast System](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html).
[^3]: NOAA Tides & Currents, [retired Lake Huron Operational Forecast System](https://tidesandcurrents.noaa.gov/ofs/lhofs/lhofs.html).
[^4]: NOAA Tides & Currents, [LMHOFS detailed information and grid/output description](https://tidesandcurrents.noaa.gov/ofs/dev/lmhofs/lmhofs_info.html).
[^5]: Wisconsin DNR, [Lake Michigan creel harvest by county, mode, species, and year, 1998–2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables1998-2024.pdf).
[^6]: Wisconsin DNR, [2024 Lake Michigan creel survey annual report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf).
[^7]: Michigan DNR, [Weekly fishing report methodology and limitations](https://www.michigan.gov/dnr/things-to-do/fishing/weekly).
[^8]: Michigan DNR, [Statewide creel and angler survey program](https://www.michigan.gov/dnr/managing-resources/fisheries/creel).
[^9]: Wisconsin DNR, [Lake Michigan shore and fishing access locations](https://dnr.wisconsin.gov/topic/OpenOutdoors/AccessFishlakeMichigan).
[^10]: Wisconsin DNR, [Close-to-home Lake Michigan fishing locations](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf).
[^11]: Wisconsin DNR, [Lake Michigan Outdoor Report, September 7, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).
[^12]: Michigan DNR, [Better Fishing Waters: Lake Huron](https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters).
[^13]: Michigan DNR weekly report, [March 25, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/40fe68d).
[^14]: Michigan DNR weekly report, [April 1, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/410fc16).
[^15]: Michigan DNR weekly report, [May 8, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/39b4ba0).
[^16]: Michigan DNR weekly report, [September 24, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3f41b68).
[^17]: Michigan DNR weekly report, [October 22, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3f82f6f).
[^18]: Michigan DNR weekly report, [July 15, 2026](https://content.govdelivery.com/accounts/MIDNR/bulletins/420a592).
[^19]: Michigan DNR weekly report, [July 30, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3ebb776).
[^20]: NOAA, [United States Coast Pilot 6, Great Lakes](https://www.nauticalcharts.noaa.gov/publications/coast-pilot/files/cp6/CPB6_WEB.pdf).
[^21]: Michigan DNR weekly report, [October 15, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3f7335a).
[^22]: Michigan DNR weekly report, [October 9, 2024](https://content.govdelivery.com/accounts/MIDNR/bulletins/3baf097).
[^23]: Michigan DNR weekly report, [April 13, 2022](https://content.govdelivery.com/accounts/MIDNR/bulletins/31352ef).
[^24]: Michigan DNR weekly report, [October 18, 2018](https://content.govdelivery.com/accounts/MIDNR/bulletins/214fd57).
[^25]: Michigan DNR weekly report, [April 25, 2013](https://content.govdelivery.com/accounts/MIDNR/bulletins/7812e8).
[^26]: City of Harbor Beach, [Judge James H. Lincoln Memorial Park / Trescott Street Pier](https://www.harborbeach.com/judge-james-h-lincoln-memorial-park).
[^27]: Michigan DNR weekly report, [April 9, 2025](https://content.govdelivery.com/accounts/MIDNR/bulletins/3db1e39).
[^28]: Village of Port Sanilac, [Things to do and harbor season](https://www.portsanilac.net/things-to-do).
[^29]: Village of Port Sanilac, [Harbor ordinance](https://www.portsanilac.net/_files/ugd/94aae1_09b56b8a56fa41679d16fc3a649f35ca.pdf).
[^30]: Wisconsin DNR, [Fishing regulations](https://dnr.wisconsin.gov/topic/fishing/regulations).
[^31]: Michigan DNR, [2026 Michigan Fishing Regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf?hash=5F3D292F6093BCD440D70CBEF1A4524F&rev=da96a24fed3241ef9bc8aba6496983fa).
