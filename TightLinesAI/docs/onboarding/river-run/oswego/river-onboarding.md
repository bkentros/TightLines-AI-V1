# Oswego River — River Run onboarding dossier

**River ID:** `oswego`
**State:** `NY`
**Research cutoff:** 2026-09-02
**Status:** `owner_review_ready`
**Target/stopping gate:** `owner_review_ready`
**Public state:** disabled; owner acceptance and public enablement have not been authorized.

## 1. Decisions and evidence ledger

Foundation/run truth `oswego-foundation-v2-owner-review`, reviewed 2026-09-02. Search covered DEC river/species/regulation/access and USGS current/history/remarks. Recheck emergency rules, Brookfield postings, PFD requirement, and gauge/canal operations before release.

| ID | Authority | URL | Facts/limitation |
| --- | --- | --- | --- |
| E-001 | NY DEC Oswego River | https://dec.ny.gov/places/oswego-river | Varick endpoint, four species, stocking, access, PFD/Leto limits |
| E-002 | DEC Pacific salmon | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/pacific-salmon-fishing | Oswego hydropower-river timing; regional calibration |
| E-003 | DEC steelhead | https://dec.ny.gov/things-to-do/freshwater-fishing/places-to-fish/great-lakes-niagara-river-st-lawrence-river/steelhead-fishing-lake-ontario-tributaries | fall entry/winter holding; no spring product |
| E-004 | DEC tributary rules | https://dec.ny.gov/things-to-do/freshwater-fishing/regulations/great-lakes-tributaries | Utica–Varick special rules; recheck emergencies |
| E-005 | DEC launches | https://dec.ny.gov/things-to-do/boating/launch-sites/oswego-county | Wright's Landing and Oswego launch; no blanket shore access |
| E-006 | USGS 04249000 | https://waterdata.usgs.gov/monitoring-location/04249000/ | flow/height/history; canal/power/backwater limitations |

### Delivery contract

Hidden IDs are `oswego` plus `oswego_fall_chinook`, `oswego_fall_coho`, `oswego_fall_steelhead`, `oswego_fall_brown_trout`. Capability `fall-2026-owner-review-v1` defaults deny including admins. Static config and bundled picker/art/Spot Finder/Seasonal Zone are required; no migration/cron. Only hidden `river-run` deployment is authorized; no public enable, build, store submission, or OTA.

## 2. Identity, corridor, reaches, barrier, and candidates

Only Lake Ontario mouth to downstream Varick Street Dam is modeled, about 1.2 miles, `America/New_York`; the upstream 23-mile navigation system is excluded.

| Reach | Boundaries | Decision |
| --- | --- | --- |
| `oswego_lower_harbor` | mouth–Utica Street | entry/lower; Lock 7 context |
| `oswego_terminal_tailwater` | Utica–Varick Dam | terminal; special rules/hydropower safety |

Lock 7 is the station name; Varick Dam is the endpoint, not a synonym. Include Chinook, coho, fall-entry steelhead, and lake-run brown based on direct DEC evidence. Leto Island is never represented as dam access.

## 3. Capability audit

| Capability | Decision | Limitation |
| --- | --- | --- |
| Gauge Read | live flow CFS/height ft at 04249000 | canal excluded; power operations/backwater |
| Water temperature | unavailable | invalid sentinel after 2024; zero weight/no temp cap |
| Historical temperature | available as archival context | 5,002 approved daily means, 2010-12-17–2024-10-06; invalid sentinel excluded; calendar-date ±3-day averages only, never current/scored |
| Fish Counts | unavailable | no adult counter was found below Varick; annual stocking totals are releases, not returning-adult counts |
| Fishing Shape | available, Limited | 2012-2025, 2,337 days; 1090/1880/10000/13100/15100 CFS |
| Activity | hydraulic-only, Limited confidence | .30 light/0 temp/.60 river/.10 weather; historical temperature cannot affect it |
| Migration Timing / Push | unavailable | no passage/movement claim |

Positive-rise p50/p75/p90 are 470/1160/2130 CFS and 10.8/30.5/68.6%. Missing weather has no score. Omitted canal flow and operations appear in all scope copy; Fishing Shape is not total flow or safety.

## 4. Run records and Seasonal Zone

| Run | Dates: pre, staging, start, beginning end, established/broad, peak start/day/end, taper, end, late, post-copy | Presence/lifecycle |
| --- | --- | --- |
| Chinook | 08-10,08-20,09-01,09-12,09-13/09-20,09-22/10-01/10-15,10-25,11-01,11-10,11-20 | sectional 8; semelparous |
| Coho | 08-15,08-25,09-05,09-15,09-16/09-24,09-25/10-05/10-15,10-25,11-01,11-10,11-20 | sectional 6; semelparous; DEC hydropower-river salmon window |
| Steelhead | 09-01,09-10,09-20,10-05,10-06/10-18,10-25/11-10/11-30,12-20,01-10,01-31,02-15 | sectional 7; living fall entry/holding |
| Brown trout | 09-15,10-01,10-15,10-31,11-01/11-10,11-15/11-25/12-10,12-20,12-31,01-15,01-31 | sectional 6; repeat spawner; DEC says entry follows salmon |

Early approach is Lake Ontario/harbor/mouth. Salmon and brown use a two-reach spawner plan; living steelhead retains both reaches late. Every run has independent timing, curve, Activity version, lifecycle semantics, and disabled public audit.

## 5. Spot Finder

Lower: Wright's Landing municipal boat launch only—no shore-fishing permission is inferred. Terminal: Linear Park shore/platform access and the municipal hard-surface Oswego launch near Lock O8 listed in DEC's inventory. Government sources were verified 2026-09-02. Records preserve launch/fee, mandatory-PFD, hydropower, Leto Island, navigation, and non-blanket-access cautions. Informal/east-bank locations without clear government access proof were excluded.

## 6. Reconciliation and acceptance

`config/onboarding/fall2026.ts`, Seasonal Zone, Spot Finder, artwork, and picker reconcile exact IDs. Incompatible clients omit Oswego and cannot fetch its draft snapshot. No database change is required. Hidden rendered review is ready; acceptance/public release remain ungranted.

### Owner-review digest

Four independently timed runs. Activity is explicitly Limited and hydraulic-only; Fishing Shape is deliberately Limited. Gauge Read now shows historical-temperature context but no live temperature; no fish counter exists below Varick. Review the short corridor, Varick endpoint, Lock 7/canal exclusion, operational fluctuations, special-rule reach, and PFD/access copy.

## 2. Identity and corridor
The short mouth-to-Varick corridor, upstream-system exclusion, timezone, weather point, and two reaches are approved above.

## 4. Barrier and passage inventory
Varick Dam is impassable and the endpoint. Lock 7 is the gauge name, not a substituted barrier name; Brookfield postings control safety/access.

## 5. Species endpoints and passage chains
All four species use mouth → lower harbor → terminal tailwater → downstream Varick face. No upstream passage is claimed.

## 6. Regulations
Current New York tributary rules, Utica-to-Varick seasonal restrictions, emergency changes, mandatory PFD, and hydropower postings govern.

## 7. Source and capability audit
USGS 04249000 hydraulics are primary-scored but Limited. The discontinued approved temperature archive supplies only a dated historical average; invalid sentinels are rejected and temperature remains zero-weight/no-cap in Activity. Counts are unavailable.

## 8. Spot Finder
| Early approach label | Receiving-water relationship | Source/evidence IDs | Separate-rule limitation | Before Migration + Beginning decision |
| --- | --- | --- | --- | --- |
| Lake Ontario, Oswego Harbor, mouth | receiving-water approach | E-001,E-005 | lake/navigation rules differ | approach only before migration; lower at Beginning |

| Run | Plan version | Beginning | Building early | Building established | Building broad | Peak | Tapering | Ending | Evidence rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinook | v1 | lower | terminal | terminal | terminal | both | terminal | terminal | Varick endpoint |
| Coho | v1 | lower | terminal | terminal | terminal | both | terminal | terminal | independent calendar |
| Steelhead | v1 | lower | terminal | terminal | terminal | both | both | both | living entry/holding |
| Brown | v1 | lower | terminal | terminal | terminal | both | terminal | terminal | repeat spawner |

## 9. Candidate species/run matrix
All four are directly supported by DEC evidence and kept distinct by independent calendars and lifecycle semantics.

## 10. Species/run records
Four records reconcile dates, presence, lifecycle, hydraulic-only Activity, Limited Fishing Shape, geography, and unavailable fields.

### Activity tuning and fixed replay
Fixed 2012–2025 replay. Current measured hydraulics are required by the minimum input contract; temperature is zero-weight and missing weather has no score.

| Stage | Block | Usable days | Samples | Min | p10 | Mean | Median | p90 | Max | Label shares | Cap/confidence notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| All | all blocks | replay artifact | replay artifact | artifact | artifact | artifact | artifact | artifact | artifact | artifact | Limited/lifecycle caps enforced |

| Iteration | Fields changed | Evidence/product reason | Predicted effect | Full replay artifact | Actual delta/invariants | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| v1 | zero-temp hydraulics, scope, bands | USGS audit/remarks | prevent total-flow inference | onboarding replay | no temp/movement leakage | owner-review candidate |

## 11. Configuration reconciliation
Config, isolation, art, picker, Seasonal Zone, Spot Finder, and IDs reconcile; no database work exists.

## 12. Acceptance and release record
Hidden rendered review only. Acceptance, public authorization, and mobile release actions are not granted.

## 13. Correction and learning ledger
Shortened corridor; separated Lock 7/Varick; excluded invalid live temperature while adding approved historical context; aligned coho to DEC's hydropower salmon window and moved brown entry earlier behind salmon; exposed canal/backwater/power limits; removed Leto Island access; removed cross-river fallback copy so every stage names only Oswego reaches.

**Contradiction search completed by/date:** Codex / 2026-09-02
**Independent falsification review by/date:** source-class, run-calendar, counter, temperature-history, and access audit / 2026-09-02
