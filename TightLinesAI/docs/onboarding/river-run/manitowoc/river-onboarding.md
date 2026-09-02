# Manitowoc River — River Run onboarding dossier

**River ID:** `manitowoc`
**State:** `WI`
**Research cutoff:** 2026-09-02
**Status:** `owner_review_ready`
**Target/stopping gate:** `owner_review_ready`
**Public state:** disabled; owner acceptance and public enablement have not been authorized.

## 1. Decisions and evidence ledger

Foundation/run truth `manitowoc-foundation-v2-owner-review`, reviewed 2026-09-02. Search covered Wisconsin stocking, access/barriers, run timing/regulations, City/County access, and USGS current/history. Recheck rules, access, and station funding/status before release.

| ID | Authority | URL | Facts/limitation |
| --- | --- | --- | --- |
| E-001 | WI DNR tributary access | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/TributaryAccess.html | overview names/mainstem split; map is not property proof |
| E-002 | WI DNR stocking summary | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf | recurring direct Chinook/coho/Seeforellen stocking; not adult abundance |
| E-003 | WI DNR barriers | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/VHS_vhs_lakemichigandrainage.pdf | Clarks Mills first barrier |
| E-004 | WI fishing report | https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport | species timing and steelhead strain distinctions |
| E-005 | WI fall rules | https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html | night restrictions/licenses; recheck current rules |
| E-006 | City facilities | https://www.manitowoc.org/Facilities | Schuette/Manitou amenities; park boundaries control |
| E-007 | County river access | https://manitowoccountywi.gov/departments/parks/lake-access/manitowoc-river-access/ | public bank access west of County R |
| E-008 | USGS 04085427 | https://waterdata.usgs.gov/monitoring-location/04085427/ | live flow/height, temp stopped 2022, history; provisional/discontinuance risk |
| E-009 | WI DNR Chinook life history | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_chinooksalmon.pdf | mature fish enter tributaries September-November; regional envelope, not a daily Manitowoc count |
| E-010 | WI DNR Lake Michigan Q&A | https://dnr.wisconsin.gov/topic/Fishing/questions/lakemichtroutsalmon.html | Seeforellen spawning run generally November-December |
| E-011 | Manitowoc County Lower Cato Falls | https://manitowoccountywi.gov/departments/parks/county-parks/lower-cato-falls/ | public river frontage/stair access; open April 1-October 31 only |
| E-012 | WI DNR coho life history | https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_cohosalmon.pdf | tributary entry September-December; broad regional envelope, not daily Manitowoc abundance |

### Delivery contract

Hidden IDs are `manitowoc` plus `manitowoc_fall_chinook`, `manitowoc_fall_coho`, `manitowoc_fall_brown_trout`. Capability `fall-2026-owner-review-v1` defaults deny including admins. Static config and bundled art/picker/Seasonal Zone/Spot Finder/Gauge Read are required. No migration/cron. Only hidden `river-run` function deployment is authorized; no public enable, build, store submission, or OTA.

## 2. Identity, reaches, barrier, and candidates

Lake Michigan mainstem from harbor to Clarks Mills, about 19 miles, `America/Chicago`; Branch River is excluded.

| Reach | Boundaries | Decision |
| --- | --- | --- |
| `manitowoc_lower_river` | mouth–Michigan Ave | gauge relevant; Schuette/Manitou audited |
| `manitowoc_middle_river` | Michigan Ave–Manitowoc Rapids | gauge represented; County R access |
| `manitowoc_upper_corridor` | Rapids–Clarks Mills | no gauge; Lower Cato Falls retained with Oct.31 closure |

The Rapids dam is removed; Clarks Mills is the first-barrier endpoint. Include Chinook, coho, and lake-run brown trout based on recurring direct stocking and species evidence. Exclude fall-entry steelhead: Manitowoc-specific Skamania recurrence was not established; Chambers/Lake Michigan-strain records do not prove it.

## 3. Capability audit

| Capability | Decision | Limitation |
| --- | --- | --- |
| Gauge Read | live flow CFS/height ft at 04085427 | lower/middle only |
| Water temperature | unavailable | last real value 2022-11-08; zero weight, no temp cap, never current |
| Historical temperature | available as archival context | 2,514 approved daily means, 2011-03-18–2022-11-07; calendar-date ±3-day averages only, never current and never scored |
| Fish Counts | unavailable | no adult counter/weir was found on the supported Manitowoc mainstem; stocking records are not counts |
| Fishing Shape | available | 2012-2025, 2,337 days; 39/66.3/279/693/1140 CFS |
| Activity | hydraulic-only, Limited confidence | .30 light/0 temp/.60 river/.10 weather; historical temperature cannot affect it |
| Migration Timing / Push | unavailable | no confirmed movement claim |

Positive-rise p50/p75/p90 are 11/37/99 CFS and 8.9/21.3/48.2%. Missing weather has no score; missing hydraulics invokes the measured-data ceiling. Possible station discontinuance is a release trigger.

## 4. Run records and Seasonal Zone

| Run | Dates: pre, staging, start, beginning end, established/broad, peak start/day/end, taper, end, late, post-copy | Presence/lifecycle |
| --- | --- | --- |
| Chinook | 08-15,08-25,09-05,09-18,09-19/09-28,10-01/10-10/10-20,11-01,11-10,11-18,11-28 | sectional 7; semelparous |
| Coho | 08-25,09-05,09-15,09-28,09-29/10-08,10-12/10-25/11-05,11-20,12-01,12-12,12-22 | sectional 7; semelparous |
| Brown trout | 09-10,09-25,10-01,10-15,10-16/10-28,11-01/11-20/12-05,12-20,12-31,01-15,01-31 | sectional 6; living repeat spawner |

Early approach is Lake Michigan, harbor, and mouth. Each run uses the audited lower→middle→upper geography; upper orientation never implies access. Brown-trout terminal copy retains repeat-spawner survival. Each run has independent dates, curve, hydraulic-only Activity, lifecycle semantics, and disabled public audit.

## 5. Spot Finder

Lower: Henry Schuette Park and Manitou Park. Middle: County Manitowoc River Access. Upper: Lower Cato Falls County Park, retained with a prominent April 1-October 31, dawn-to-dusk closure warning. Map-only Danmar and private/unclear Fish & Game frontage remain excluded; Branch River/Country Club are outside the modeled mainstem. Included sites were individually verified 2026-09-02.

## 6. Reconciliation and acceptance

`config/onboarding/fall2026.ts`, Seasonal Zone, Spot Finder, artwork, and picker reconcile exact IDs. Incompatible clients omit the river and cannot fetch its draft snapshot. No database change is required. Hidden rendered review is ready; acceptance/public release remain ungranted.

### Owner-review digest

Three runs with explicitly Limited hydraulic-only Activity, no current temperature, a historical-temperature average in Gauge Read, no fish counter, percentile Fishing Shape, and season-limited upper access. Review station scope/discontinuance, access exclusions, and the steelhead exclusion.

## 2. Identity and corridor
The mainstem identity, Branch exclusion, mouth, Clarks Mills endpoint, timezone, weather point, and 19-mile corridor are approved above.

## 4. Barrier and passage inventory
The removed Rapids dam is not a barrier. Clarks Mills is the conservative first-barrier endpoint; no passage beyond is claimed.

## 5. Species endpoints and passage chains
Included runs use mouth → lower → middle → upper → Clarks Mills. Opportunity is sectional and upper access is not asserted.

## 6. Regulations
Current Wisconsin tributary rules and Sept.15–first-Saturday-in-May night limits govern; recheck posted property boundaries at release.

## 7. Source and capability audit
USGS 04085427 hydraulics are primary-scored lower/middle context. The discontinued approved temperature archive supplies only a dated historical average; temperature remains absent from Activity with zero weight/no cap. Counts are unavailable.

## 8. Spot Finder
| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Lake Michigan, harbor, mouth | receiving-water approach | E-001,E-006,E-007 | harbor rules differ | approach only before migration; lower at Beginning |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | v1 | lower | middle | middle | middle+upper | all | middle+upper | middle+upper | first barrier |
| Coho | v1 | lower | middle | middle | middle+upper | all | middle+upper | middle+upper | independent calendar |
| Brown | v1 | lower | middle | middle | middle+upper | all | middle+upper | middle+upper | repeat spawner |

## 9. Candidate species/run matrix
Chinook/coho/brown are included; steelhead is affirmatively excluded after strain-level stocking and fishery review.

## 10. Species/run records
Three independent records reconcile dates, presence, lifecycle, hydraulic-only Activity, Fishing Shape, geography, and unavailable primitives.

### Activity tuning and fixed replay
Fixed 2012–2025 replay; current measured river behavior is required by the minimum input contract. Temperature is zero-weight and missing weather has no score.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| All | all blocks | replay artifact | replay artifact | artifact | artifact | artifact | artifact | artifact | artifact | artifact | hydraulic/lifecycle caps enforced |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| v1 | zero-temp hydraulic model/bands | stale temp + USGS audit | no temperature leakage | onboarding replay | hydraulics required | owner-review candidate |

## 11. Configuration reconciliation
Config, isolation, art, picker, Seasonal Zone, Spot Finder, and IDs reconcile; no migration/table/cron exists.

## 12. Acceptance and release record
Hidden rendered review only. Acceptance, public authorization, and mobile release actions are not granted.

## 13. Correction and learning ledger
Removed unsupported steelhead/current-temperature claims/Branch sites; retained Lower Cato only with its seasonal closure; added approved historical-temperature context without scoring it; did not retain the removed Rapids dam as a barrier; removed cross-river fallback copy so every stage names only Manitowoc reaches.

**Contradiction search completed by/date:** Codex / 2026-09-02
**Independent falsification review by/date:** source-class, run-calendar, counter, temperature-history, and access audit / 2026-09-02
