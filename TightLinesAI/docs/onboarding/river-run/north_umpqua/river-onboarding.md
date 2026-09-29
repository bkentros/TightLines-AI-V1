# North Umpqua River Run Onboarding Dossier

**River ID:** `north_umpqua`

**State/region:** `OR` / `pacific_northwest`

**Created:** 2026-09-29

**Status:** `hidden_implementation_ready`

**Current completed pass:** Pass 4 — hidden implementation and QA complete

**Target gate:** Owner review; public enablement remains a separate authorization

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

### Pass 1 outcome

**Decision:** Proceed to Pass 2 with one fall run: North Umpqua Fall Coho. Keep
it hidden. The biological run is recurring and well documented: ODFW's 2024
assessment estimated 2,925 wild adult coho for the North Umpqua population, and
the Winchester series recorded 7,426 total coho in 2023-24, 3,446 in 2024-25,
and 2,778 in 2025-26.

**Material qualification:** This is not a broad harvest-strength story. The
2026 fishery is hatchery-coho only, the historical North Umpqua hatchery coho
program ended with the last release in 2006, and the recent Winchester returns
are overwhelmingly wild. Official harvest-card estimates show a small but
recurring marked-fish harvest. Product copy must distinguish a strong biological
migration from sparse legal harvest opportunity.

**Fish Counts decision:** Winchester Dam is a legitimate North Umpqua coho
ladder-passage counter and a candidate Fish Counts source. It is a recurring
in-season/final-season report, not a near-real-time feed. ODFW says video review
can lag one to two months, the post-2015 count is estimated from 200 counting
days per year, and staff are unsure how often future reports will be posted.
Enablement therefore requires a new ODFW provider/parser, observation-through
date parsing, preliminary/final semantics, category isolation, duplicate and
revision tests, and a fail-closed freshness contract. The existing runtime has
no ODFW fish-count provider.

**Foundation approval/version/date:** Accepted under the owner's instruction to
complete Pass 2 in full / `north-umpqua-foundation-v1-pass2-2026-09-28` /
2026-09-28. Machine-readable audit:
`docs/onboarding/river-run/umpqua_fall_2026_pass2_foundation_audit.json`.

**Run-truth approval/version/date:** Accepted under the owner's instruction to
complete Pass 3 in full / `umpqua-fall-run-truth-v1-pass3-2026-09-28` /
2026-09-28. Machine record:
`docs/onboarding/river-run/umpqua_fall_2026_pass3_run_truth.json`.

**Rendered owner acceptance/date:** Pending; hidden review fixtures generated and
validated 2026-09-29.

**Research cutoff:** 2026-09-28. Recheck ODFW regulations/closures, wild-coho
decision, Winchester index and newest report, PacifiCorp operations, public-land
alerts, USGS series status, and hatchery program status before owner review and
release.

### Pass 2 outcome

**Decision:** Foundation accepted and status advanced to `research_ready`.
The mouth-to-Soda-marker corridor is divided into three canonical reaches with
Winchester and Rock Creek/Deadline legal gaps explicit. USGS 14319500 is
correctly located at North Umpqua RM 1.8 and represents the lower reach only.
The Winchester coho count contract is accepted but must show
`unavailable/not_reported` at the 2026 cutoff and remains unimplemented. Three
conservative Spot Finder sections and a River Forks early-approach orientation
are accepted. Coho calendar, strength, Activity/Push tuning, Fishing Shape bands
and Seasonal Zone mapping remain exclusively Pass 3 decisions.

### Pass 3 outcome

**Decision:** North Umpqua fall coho is accepted for hidden Pass 4
implementation with an independent calendar and broad biological distribution.
Migration Stage, full observed-river Activity, Seasonal Presence, Push Watch
and lower-reach Fishing Shape are available. Winchester Fish Counts remain an
accepted optional surface, but are unavailable until the Pass 4 parser is built
and a report passes the observation-through freshness contract. Public
Migration Timing remains unavailable.

**Replay result:** The fixed 2019-2025 replay produced 952/952 usable days with
same-gauge measured flow and water temperature, four blocks per day, and zero
calendar, coverage, lifecycle, cap, severe-flow, direct-event or controlled-test
failures. Fishing Shape used 4,080 daily flows from 1996-2025. Complete audit:
`docs/audits/river-run-umpqua-pass3-calibration-replay.json`.

### Pass 4 outcome

**Decision:** Hidden implementation is complete. North Umpqua Fall Coho now has
a validated draft runtime profile, all four core primitives, Seasonal Zone,
Gauge Read, Fishing Shape, Winchester Fish Counts, and an official-source Spot
Finder inventory. It is excluded from the public registries and requires
authenticated owner review plus capability `river_run_umpqua_fall_v1`. No
public enablement, deployment, mobile build, or database migration was
performed.

**Winchester provider result:** A dedicated ODFW parser now reads strata and
final historical PDFs, preserves wild/hatchery origins, treats jacks as already
included in ODFW totals, enforces 240-hour freshness, and has zero primitive
score influence. A live 2026-09-29 audit returns
`unavailable/not_reported` for the active 2026-27 season. The audit initially
exposed a prior-season carry-forward bug; season selection now uses Pacific
request time, and a regression test prevents a previous final from becoming
the current read.

**Implementation reconciliation:** Pass 3 calendar, presence ceiling/curve,
hydraulic bands, full Activity weights/caps, Push thresholds, and Winchester
source isolation are locked by `umpquaPass4.test.ts`. The runtime national
Fishability safety contract tightens stale-gauge and sharp-rise/high-water caps
from candidate 60/45 to 55/40 without changing calibrated flow boundaries.
Machine audit:
`docs/onboarding/river-run/umpqua_fall_2026_pass4_implementation_audit.json`.

### Pass 1 delivery contract

| Field | Pass 1 decision |
| --- | --- |
| Hidden river ID | `north_umpqua` |
| Hidden run ID | `north_umpqua_fall_coho` |
| Owner scope | Fall coho only; winter steelhead deferred; fall Chinook excluded; South Umpqua excluded |
| Four core primitives sought | `run_stage`, `activity`, `fish_in_river`, `push` |
| Activity candidate | `observed_river/full` using co-located USGS Winchester flow and measured water temperature plus weather, subject to Pass 2 reach acceptance and Pass 3 replay |
| Additional surfaces sought | Gauge Read, Fishing Shape, Spot Finder, and Winchester Fish Counts after adapter/freshness QA |
| Stopping gate for this pass | Evidence captured; no runtime configuration or public enablement |

### Repository preflight

| Check | Result | Evidence |
| --- | --- | --- |
| Branch / commit | `develop/cross-platform-next` / `d05e1d50f56c6445ee4c4b5e130c438c104fd58d` | E-020 |
| Initial worktree | Clean before the two dossiers were scaffolded | E-020 |
| Existing catalog | Validator reported 25 configured rivers, 100 runs, 0 errors, 0 warnings | E-020 |
| ID collision | No pre-existing `north_umpqua` or `north_umpqua_fall_coho` | E-020 |
| State/schema | `OR` is supported; `pacific_northwest` is established | E-020 |
| Species/engine | `coho_salmon` and `fall_cooling` are implemented | E-020 |
| Reusable biology | `pacific_fall_coho_v1` | E-020 |
| Gauge/weather providers | USGS and existing weather path are reusable | E-010, E-020 |
| Fish-count provider | Provider union/parser dispatch lacks ODFW/Winchester | E-006, E-020 |

### Evidence ledger

| ID | Authority/title | Direct URL/path | Published/updated | Data years/page | Accessed | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 | ODFW, 2026 Oregon Sport Fishing Regulations — Southwest Zone | https://prod.eregulations.com/oregon/fishing/southwest-zone | Updated 2026-07-24 | North Umpqua exception | 2026-09-28 | Mouth-to-below-Soda-Springs legal scope; hatchery coho open all year in open sections; Winchester and upper closures; gear/floating-device restrictions | Permanent rules; pair with in-season updates |
| E-002 | ODFW, Fishing regulation updates | https://myodfw.com/articles/regulation-updates | Current 2026 page | North Umpqua, effective 2026-08-10 through 2026-11-30 | 2026-09-28 | Steelhead fishing/retention closed; all other permanent rules remain | Confirms coho rule remains, but not an endorsement of fish abundance |
| E-003 | ODFW, Fall coastal salmon management | https://myodfw.com/articles/fall-coastal-salmon-management | 2026 decision | Wild coho section | 2026-09-28 | Umpqua wild-coho retention closed because projected returns are below full-seeding criteria | Basin-scale and time-sensitive |
| E-004 | ODFW, Southwest Zone recreation report | https://myodfw.com/recreation-report/fishing-report/southwest-zone | Updated 2026-09-16 | North Umpqua section | 2026-09-28 | Current report headlines steelhead/trout and explains fall steelhead closure; does not promote North coho | Negative current-marketing signal, not proof coho are absent |
| E-005 | ODFW, Western Oregon Adult Coho Salmon, 2024 Spawning Survey Data Report | https://nrimp.dfw.state.or.us/DataClearinghouse/default.aspx?att=ODFW/ODFW_42838_2_2024CohoAnnualReport.pdf&pn=ViewFile | 2025-09 | pp. 5, 15, 27-31; Tables B-3/B-4 | 2026-09-28 | Winchester plus below-dam surveys/harvest method; 2024 adjusted wild population 2,925; Winchester 2,977 total/2,950 wild/27 hatchery; 35 estimated harvested above dam | Annual assessment; not current feed; Table B-3 adult counts differ from seasonal total PDFs by defined adjustments/time basis |
| E-006 | ODFW, Winchester Dam Fish Counts | https://myodfw.com/winchester-dam-fish-counts | Current through 2026 | Count index | 2026-09-28 | Dam about 118 river miles from ocean; ladder/video count since 1991; species/size/fin-clip recorded; 1-2 month lag; recurring strata and historical reports | Facility passage only; not total river abundance or catch probability |
| E-007 | ODFW, Coho at Winchester Dam 1946-2025 | https://myodfw.com/sites/default/files/2026-02/Coho%201946-2025.pdf | 2026-02 | One-page series, Sep 1-Jan 30 | 2026-09-28 | 2023-24 7,348 wild/78 hatchery/7,426 total; 2024-25 3,409/37/3,446; 2025-26 2,640/138/2,778; recent ten-year average 3,651; program end notes | Counts estimated since 2015; seasonal series, not fresh daily data |
| E-008 | ODFW, Winchester November 2025 Strata Report | https://myodfw.com/sites/default/files/2025-12/Strata%20Reports%20.pdf | Observation through 2025-11-20 | One page | 2026-09-28 | In-season coho estimate 2,203 through Nov 20; 200 count days/year gives at least 90% accuracy; future posting cadence uncertain | Preliminary and later revised to final 2,778; illustrates revision and freshness risks |
| E-009 | ODFW, 2014 Oregon Coast Coho Conservation Plan annual report | https://www.dfw.state.or.us/fish/CRP/docs/coastal_coho/economic_reports/OCCCP_Annual_Report-2014.pdf | 2014 report | pp. 3-4 | 2026-09-28 | Last hatchery coho releases into North Umpqua occurred May 2006 | Historical program fact corroborated by E-007 and current production sources |
| E-010 | USGS 14319500 and 14317450 station/live/metadata probes | https://waterdata.usgs.gov/monitoring-location/USGS-14319500/ ; `docs/onboarding/river-run/umpqua_fall_2026_pass1_provider_probes.json` | Probe 2026-09-28 | Flow daily 1908-current; Winchester live temp 2016-current; Idleyld temp/turbidity 2007-current | 2026-09-28 | Names, coordinates, drainage areas, live values/units/cadence/provisional state, parameter-specific extents | Winchester candidate is scored; Idleyld has no discharge and is context-only |
| E-011 | ODFW, Sport Catch Statistics and annual Coho CSVs | https://www.dfw.state.or.us/resources/fishing/sportcatch.asp | Annual through 2025 | Codes 103, 201, 219; 2019-2025 | 2026-09-28 | Small recurring North Umpqua coho harvest; see extract | Expanded self-reported harvest estimates, not passage counts |
| E-012 | ODFW, Umpqua Hatchery Infrastructure Proposal | https://www.dfw.state.or.us/fish/hatchery/docs/Umpqua%20Hatchery%20Infrastructure%20Proposal.pdf | 2025 | p. 2 | 2026-09-28 | Current North program is spring Chinook; current coho production is South Umpqua | Current program topology; production totals are not adult abundance |
| E-013 | ODFW, Rock Creek Hatchery proposal news | https://www.dfw.state.or.us/news/2025/03_Mar/030525.asp | 2025-03-05 | Proposal summary | 2026-09-28 | Proposed North investment retains spring Chinook while coho/winter steelhead work is South Umpqua | Proposal, not final implementation record |
| E-014 | BLM, North Umpqua Wild and Scenic River | https://www.blm.gov/programs/national-conservation-lands/oregon-washington/north-umpqua-wsr | Current | 33.8-mile WSR, access/fishing sections | 2026-09-28 | Coho/fall and spring Chinook/steelhead/cutthroat occur; numerous access points; entire WSR fly fishing only and no fishing from watercraft | WSR is an upper subset, not entire product river; ODFW rules control |
| E-015 | BLM, Swiftwater Day-Use Area | https://www.blm.gov/visit/swiftwater-day-use-area | Current | Site page | 2026-09-28 | Bank fishing, salmon/steelhead, accessible platform; fly-only boundary a few hundred yards upstream | Site-specific; current closures still require recheck |
| E-016 | BLM, Susan Creek Campground | https://www.blm.gov/visit/susan-creek-campground | Current | Site page | 2026-09-28 | Salmon/steelhead fishing access; fly-only limitation | Site-specific; seasonal operating status varies |
| E-017 | Douglas County, Day Use Parks and ramp-repair report | https://www.douglascountyor.gov/810/Day-Use-Parks ; https://www.douglascountyor.gov/DocumentCenter/View/27722/07-25-25-OSMB-Grant-Helps-Douglas-County-Complete-Repairs-at-Eight-County-Boat-Ramps | Current / 2025-07-25 | North Umpqua entries | 2026-09-28 | Candidate access inventory and fishing/river access descriptions | Facility labels need receiving-water and coordinate reconciliation |
| E-018 | PacifiCorp, North Umpqua settlement explanatory statement | https://www.pacificorp.com/content/dam/pcorp/documents/en/pacificorp/energy/hydro/north-umpqua-river/settlement-agreement-documents/North_Umpqua_Settlement_Agreement_Explanatory_Statement.pdf | Settlement-era | pp. 12-13 | 2026-09-28 | Soda Springs barrier history; ladder/video counter/downstream bypass design; 6.6 additional miles; spring Chinook/steelhead expected greatest benefit | Historical design/obligation; current operation corroborated by E-019 |
| E-019 | PacifiCorp, Soda Springs fish-passage improvements | https://www.pacificorp.com/about/newsroom/news-releases/visit-soda-springs-dam.html | 2025-09-22 | Current facility release | 2026-09-28 | Passage facilities and habitat improvements are operating; wild Chinook observed above/below | Operator release; not coho-specific passage efficiency |
| E-020 | Repository preflight | `supabase/functions/_shared/riverRunEngine/`, `lib/`, onboarding CLI output, shared probe artifact | Commit above | Current code | 2026-09-28 | ID availability, catalog baseline, types, engine/profile support, absent ODFW count provider | Repository fact only |
| E-021 | PacifiCorp, North Umpqua River Flows | https://www.pacificorp.com/community/recreation/water-release/north-umpqua-river.html | Current 2026 operations | Project notices | 2026-09-28 | Planned flow/outage context for the regulated upper basin | Operational context only; cannot replace USGS observed flow |
| E-022 | Cow Creek Band of Umpqua Tribe of Indians, Tribe and ODFW Talk Rock Creek | https://www.cowcreek-nsn.gov/tribe-and-odfw-talk-rock-creek-at-town-hall/ | 2025 | Co-management proposal | 2026-09-28 | Tribal/ODFW partnership context; future spring Chinook at Rock Creek, coho/winter steelhead centered at Canyonville, fall Chinook at Elk River | Proposal contingent on funding; corroborates that North is not the current coho production center |
| E-023 | ODFW, Fish Passage Barriers GIS layer | https://gis.odf.oregon.gov/odfags/rest/services/Hydrography/Hydrography/MapServer/14 | Current service | Exact Umpqua-name query | 2026-09-28 | Winchester feature 18305 partial; Soda Springs 18436 passable; Slide Creek 18541 upstream | Dataset explicitly warns it is not comprehensive/current everywhere; triangulated with facility and regulatory sources |
| E-024 | Oregon OAH, Winchester Dam proposed order | https://myodfw.com/sites/default/files/2026-02/ALJ%20Schmidt%20Proposed%20Order%2012-18-2025%20.pdf | 2025-12-18 | Passage findings | 2026-09-28 | Ladder use year-round; possible inadequate ladder flow and false-attraction-flow limitations | Legal/administrative findings; does not quantify complete capture efficiency |
| E-025 | USGS, Water Data Report Oregon 2002, station 14319500 | https://pubs.usgs.gov/wdr/WDR-OR-02/pdf/WDR-OR-02.pdf | 2002 | Station history | 2026-09-28 | Gauge at North RM 1.8; early records 4.8 miles upstream at different datums; modern site begins 1954 | Historical station documentation; current API remains live authority |
| E-026 | USFS, Deadline Falls Watchable Wildlife | https://www.fs.usda.gov/Internet/FSE_DOCUMENTS/stelprdb5315012.pdf | Official site sheet | Deadline Falls | 2026-09-28 | Salmon and steelhead observed jumping the falls May-Oct | Observation/visitor source, not passage-efficiency estimate |
| E-027 | Pass 2 foundation audit | `docs/onboarding/river-run/umpqua_fall_2026_pass2_foundation_audit.json` | 2026-09-28 | Exact history/weather probes, reaches, barriers, count semantics and access | 2026-09-28 | Locked foundation contracts and observed data counts | Research artifact; no runtime/public mutation |
| E-028 | ODFW, Winchester Dam repairs/background | https://www.dfw.state.or.us/fish/passage/winchester_dam_repair.asp | Current background | Coho timing | 2026-09-28 | Earliest coho passage can begin in late August; warm water may delay passage | Supports staging/start envelope, not every year's peak |
| E-029 | ODFW, September 2023 Winchester report | https://www.dfw.state.or.us/fish/fish_counts/winchester/2023/Sep_2023.pdf | 2023 | Historical percentage through Sep. 30, 2014-2023 | 2026-09-28 | Only 0-10.5% of the seasonal coho run had passed by Sep. 30 in comparison years | Passage distribution at Winchester only; preliminary strata context |
| E-030 | ODFW, November 2023 Winchester report | https://www.dfw.state.or.us/fish/fish_counts/winchester/2023/Nov_2023.pdf | 2023 | Historical percentage through Nov. 20, 2014-2023 | 2026-09-28 | 46.3-98.3% of the seasonal run had passed by Nov. 20; 2023 count through that date was 7,243 | Passage at Winchester only; supports a broad October-November build/peak |
| E-031 | ODFW, Winchester historical coho totals | https://www.dfw.state.or.us/fish/fish_counts/winchester/historical/coho.pdf | Final historical series | Sep. 1-Jan. 30 operating/report window | 2026-09-28 | Long recurring coho passage series and full terminal window | Final seasonal facility totals, not whole-corridor abundance or harvestable fish |
| E-032 | ODFW, Watch for spawning salmon | https://www.dfw.state.or.us/news/2017/10_Oct/102717b.asp | 2017-10-27 | Umpqua coho spawning observations | 2026-09-28 | Coho spawning occurs mainly late November/early December in Umpqua tributaries | Terminal timing constraint, not entry timing |
| E-033 | Pass 3 run-truth record | `docs/onboarding/river-run/umpqua_fall_2026_pass3_run_truth.json` | 2026-09-28 | North Umpqua fall coho | 2026-09-28 | Exact calendar, strength, presence anchors, zones, capabilities and delivery contract | Accepted research/configuration intent; runtime still absent |
| E-034 | Pass 3 calibration replay | `docs/audits/river-run-umpqua-pass3-calibration-replay.json` and `scripts/river-run-umpqua-pass3-replay.ts` | Generated 2026-09-29 UTC | Activity 2019-2025; Fishing Shape 1996-2025 | 2026-09-28 | Fixed replay coverage, distributions, thresholds, controlled tests and zero failed invariants | Daily archives calibrate the live four-hour model; they do not claim historical intraday events or catches |

### Source-class completion audit

| Required Pass 1 class | Authorities/classes checked | Result |
| --- | --- | --- |
| Current assessment/management | ODFW 2024 coho assessment and coastal coho management | Recurring North coho population supported; current wild-retention constraint logged |
| Permanent/emergency/co-manager regulations | ODFW 2026 permanent and in-season pages; Cow Creek tribal/ODFW program source | Public recreational rules captured; tribal co-management context separated from public angling rules |
| Stocking/hatchery/egg-take | ODFW infrastructure proposal, Rock Creek proposal, conservation annual report, Winchester final PDF, tribal proposal | North releases ended in 2006; current/future program topology recorded; no egg-take total treated as passage or abundance |
| Creel/harvest | ODFW annual sport-catch CSVs and weekly report | Small recurring marked-fish harvest captured; negative current promotion signal recorded |
| Weir/ladder/trap/counter | Winchester index, historical final PDF, newest strata report, statewide facility index, Soda Springs material | Winchester classified; Soda Springs lacks a recurring public report and is rejected for Fish Counts |
| Passage/barrier/removal | ODFW rules/count station, PacifiCorp settlement/current improvements/operations, BLM | Winchester/Soda Springs/Slide Creek chain discovered; final efficiency/closure chain reserved for Pass 2 |
| Gauge live/history | USGS Winchester and Idleyld station/API probes | Real values, timestamps, units, cadence, extents, absent metrics and source roles captured |
| Public fishing access | BLM WSR/Swiftwater/Susan Creek, Douglas County | Strong inventory found; boundaries, current status and fishing suitability still require reconciliation |

### Coho counter and harvest evidence extract

| Run year | Winchester wild | Winchester hatchery | Winchester total | Source/class |
| --- | ---: | ---: | ---: | --- |
| 2023-24 | 7,348 | 78 | 7,426 | Final seasonal passage total, E-007 |
| 2024-25 | 3,409 | 37 | 3,446 | Final seasonal passage total, E-007 |
| 2025-26 | 2,640 | 138 | 2,778 | Final seasonal passage total, E-007 |
| Last 10 years | 3,449 average | 202 average | 3,651 average | Historical average, E-007 |

| Harvest year | Below Winchester code 103 | Winchester-Rock Creek code 201 | Rock Creek-Soda Springs code 219 | Combined estimate |
| ---: | ---: | ---: | ---: | ---: |
| 2019 | 10 | 6 | 0 | 16 |
| 2020 | 16 | 0 | 3 | 19 |
| 2021 | 21 | 9 | 2 | 32 |
| 2022 | 13 | 4 | 4 | 21 |
| 2023 | 11 | 6 | 2 | 19 |
| 2024 | 51 | 33 | 2 | 86 |
| 2025 | 4 | 21 | 0 | 25 |

The large difference between passage and harvested marked fish is the central
product truth: coho presence is meaningful, but harvest opportunity is narrow.

## 2. Identity and corridor — foundation accepted

| Field | Locked decision | Evidence/qualification |
| --- | --- | --- | --- |
| Public identity | `North Umpqua River`; alias `North Umpqua` | ODFW E-001 and USGS E-010 |
| Jurisdiction/region | Oregon; Douglas County; `pacific_northwest` runtime region | `OR` and this region already exist in the engine; no cross-state presentation context |
| Product corridor | North/South confluence at River Forks to the ODFW marker just below Soda Springs Dam, with legal closures retained as explicit gaps | ODFW E-001; USGS/DEQ river-mile references place Soda Springs near RM 69 |
| Approximate length | 69 river miles | Mainstem fork RM 111.5 reconciled with the ODFW Winchester description and USGS/DEQ North Umpqua mileage |
| Receiving water/timezone | Umpqua River (Mainstem) / `America/Los_Angeles` | River Forks official county identity; mouth landmark `43.2712649, -123.4436747` is not an access pin |
| Explicit exclusions | Mainstem Umpqua, South Umpqua, tributaries, Soda Springs Reservoir, Slide Creek reach and river above the product endpoint | Physical passage above Soda Springs does not expand the selected product corridor |
| Weather anchor | Exact USGS 14319500 coordinate at North Umpqua RM 1.8 | Open-Meteo live and seven-day archive probes succeeded; this is lower-reach context only |
| Support/version | `beta`; `north-umpqua-foundation-v1-pass2-2026-09-28` | Active UTC refresh slots `00:00, 04:00, 08:00, 12:00, 16:00, 20:00, 21:00`; inactive `00:00` |

## 3. Canonical reaches — foundation accepted

| Reach ID | Public name | Locked boundaries | Role | Gauge represented |
| --- | --- | --- | --- | --- |
| `north_umpqua_lower_winchester` | Lower North Umpqua — mouth to Winchester | North Umpqua mouth to Old Highway 99/Winchester closure near RM 6.5 | Downstream/entry | Yes. USGS 14319500 is at RM 1.8, not at Winchester Dam |
| `north_umpqua_middle_rock_creek` | Middle North Umpqua — Winchester to Rock Creek | 200 feet above Winchester Dam through Lone Rock to painted lines above Rock Creek near RM 35.7; legal closures remain explicit gaps | Middle | No |
| `north_umpqua_upper_wsr` | Upper North Umpqua — Fly Area to Soda Springs | Deadline Falls Fly Area boundary to marker just below Soda Springs Dam near RM 69 | Terminal | No; Idleyld temperature/turbidity may be separately labeled context only |

The Old Highway 99-to-200-feet-above-dam closure and the painted-lines-above-
Rock-Creek-to-Deadline-Falls closure remain biological corridor, never public
fishable geography.

## 4. Barrier and passage inventory — foundation accepted

| Barrier/location | Locked passage finding | Product treatment |
| --- | --- | --- |
| Winchester Dam, ODFW feature 18305, `43.28393794, -123.3539244` | Permanent dam classified partial passage. Fish use the ladder year-round, but an official 2025 proceeding identifies possible inadequate ladder flow and false-attraction-flow limitations | Biological passage/count landmark; never claim 100% capture or passage; adjacent closure is an explicit Spot Finder/zone gap |
| Deadline Falls | Natural hydraulic barrier, but USFS documents salmon and steelhead jumping it May-Oct | Fly-area landmark, not an impassable endpoint |
| Soda Springs Dam, ODFW feature 18436, `43.302789, -122.49497129` | Classified passable; ladder, video, downstream bypass/screens and tailrace barrier have operated since 2012 | Physical passage exists, but the product ends at the legal marker below the dam |
| Slide Creek and upstream project dams | Upstream of selected endpoint | Explicitly excluded; not a hidden gap in this corridor |
| Hydroelectric operations | PacifiCorp posts current flow/outage notices | Volatile upper context only; never replace observed USGS flow |

The ODFW barrier inventory warns that it is not comprehensive everywhere. Its
results were reconciled with current regulations, PacifiCorp passage documents,
USFS/BLM material, USGS mileage and the ODFW count program.

## 5. Species endpoint and passage chain — foundation accepted

| Run | Locked physical chain | Physical endpoint vs opportunity |
| --- | --- | --- |
| Fall Coho | Umpqua mainstem -> North Umpqua mouth -> Winchester ladder -> middle/upper corridor -> marker below Soda Springs Dam | Coho passage is biologically supported throughout the corridor; 2026 harvest is hatchery-only in open sections, with closure and fly/no-watercraft gaps kept explicit |

This endpoint does not imply a uniform fishery or set Pass 3 run timing.

## 6. Regulations — foundation accepted

| Authority/version | Locked coverage | Required public reminder | Recheck contract |
| --- | --- | --- | --- |
| ODFW 2026 permanent Southwest Zone + 2026 in-season updates | Mouth to marker below Soda Springs, open sections only; hatchery coho open; wild-coho retention closed; steelhead closed Aug 10-Nov 30; Winchester, Rock Creek/Deadline and Soda Springs gaps; fly/no-watercraft rules upstream | “North Umpqua rules change by section. Only hatchery coho may be retained in open sections in 2026; closures and fly/no-watercraft restrictions apply. Check current ODFW updates and posted boundaries before fishing.” | Recheck permanent rules, emergency updates, wild-coho decision, hydro/site notices and posted boundary markers before owner review and release |

Fall Chinook remains excluded: the North Umpqua Chinook opening is Feb 1-Jun
30, not the owner's fall cohort.

## 7. Source and capability audit — foundation accepted

| Source/metric | Locked role | Reach and history decision |
| --- | --- | --- |
| USGS 14319500 discharge `00060` | `primary_scored` and displayed; single hydraulic input | Lower reach at RM 1.8. Displayed daily normal uses only modern-site 1954-10-01 through 2025: 26,025 rows, 72 years, normally 71-72 qualifying fall years |
| USGS 14319500 gage height `00065` | Display-only | Same station; **No average** because stage is datum-sensitive |
| USGS 14319500 temperature `00010` | Primary measured temperature | Split-era 1985-1991 and 2016-2025: 5,359 daily rows and normally 14-16 qualifying fall years; disclose the 1992-2015 gap |
| USGS 14317450 temperature/turbidity | Separately labeled `context_only`; zero scoring | Upper river near Idleyld Park; never average with or substitute for Winchester and never pair its optical reading with Winchester discharge |
| Open-Meteo at 14319500 coordinate | Weather/Activity context | Lower reach only; live and 168-hour archive probes passed; zero independent hydraulic influence |
| Winchester coho counts | Eligible for a dedicated `ODFW_WINCHESTER` adapter | Ladder passage at Winchester only; irregular/delayed reports; details locked below |
| Soda Springs monitoring | Not a product Fish Counts source | No recurring public report located; operational video existence is insufficient |

Early 1908-1913 and 1923-1929 discharge records were collected roughly 4.8
miles upstream at different datums and are excluded from the displayed normal.
Flow/temperature context otherwise follows the shared ±3-day, sample-count,
two-hour freshness and measured-temperature QA contracts in the audit.

| Capability | Pass 2 decision | Next requirement |
| --- | --- | --- |
| Gauge Read | Accepted | Pass 4 adapter/UI failure-state verification |
| Historical flow/temperature | Accepted with modern/split-era qualifications | Generate immutable normal artifact; no gage-height normal |
| Fish Counts | Semantics/source accepted, not implemented | Pass 4 provider/parser, report discovery and stale/unavailable isolation QA |
| Fishing Shape | Source/reach eligible, not enabled | Pass 3 lower-reach absolute bands/replay and disclosure that turbidity, debris and upper-project-release effects are not represented |
| Activity | Eligible for `observed_river/full`, not enabled | Pass 3 run-specific tuning and fixed replay |
| Push Watch | Inputs eligible, not enabled | Pass 3 coho-specific rise/cooling/severe-flow rules |

### Winchester Fish Counts semantics locked for implementation

| Field | Pass 2 classification |
| --- | --- |
| Facility | Winchester Dam Counting Station, North Umpqua |
| Observation type | `ladder_passage` |
| Eligible species for this cohort | `coho_salmon` only |
| Observation process | 24-hour video; technician classifies species, size, fin clips, predator marks |
| Publication class | Recurring in-season strata reports plus finalized seasonal totals |
| Source publication cadence | Irregular; historically several strata reports/year; ODFW says future cadence uncertain |
| App fetch cadence | May check on a normal schedule, but must not relabel an old report as current |
| Freshness | Must be based on observation-through date, not app fetch time or PDF upload time |
| Maximum age | 240 hours; an older observation is stale/unavailable, not “current” |
| Preliminary/final | Strata estimate is preliminary; historical annual PDF is finalized seasonal data |
| Categories | Wild, hatchery, total, jacks; jacks included in wild/hatchery/total per final PDF footnote |
| Count method limitation | Estimated since 2015 from 200 days/year; ODFW states at least 90% accuracy |
| Geography limitation | Passage at Winchester only; fish below dam and non-passing fish are outside the count |
| 2026 cutoff behavior | Newest 2026 report at the research cutoff did not yet contain coho; return `unavailable/not_reported`, never the 2025-26 final 2,778 as a current value |
| Scoring | Always zero influence on Stage, Activity, Presence, Push, Zone, or Fishing Shape |

## 8. Spot Finder — foundation accepted

Only fishing-oriented public access with an authoritative source and reconciled
coordinate is accepted. Access does not guarantee productive fishing, legal use
on every nearby bank, safe wading, or current road/campground availability.

| Section | Accepted site | Coordinate/source | Conservative suitability and restrictions |
| --- | --- | --- | --- |
| Lower: mouth to Winchester closure | Hestness Landing County Park | `43.2845602, -123.3914653`; Douglas County fishing/river-access page + USGS GNIS | Boat access verified; bank extent and wading not verified; not marked beginner-suitable |
| Middle: above Winchester to Rock Creek | Swiftwater Day Use Area | `43.33314, -123.00476`; BLM | Bank fishing and accessible platform verified; no boat/wading claim; fly-only boundary begins a few hundred yards upriver; never route into the painted-lines-to-Deadline closure |
| Upper: Fly Area to Soda marker | Susan Creek Campground | `43.2966667, -122.8933333`; BLM | Fishing access verified; fly-only and no angling from watercraft; exact entry conditions and seasonal status require recheck; not marked beginner-suitable |

Explicit exclusions are part of the foundation: John Amacher is adjacent to the
Winchester closure and its source does not prove a legal coho fishing point;
`Umpqua Landing` is at the Calapooya/Umpqua confluence, not North Umpqua;
generic turnouts and boating-only sites are not filler. Wildfire, road,
campground, hydro-operation, ramp status and posted boundary markers must be
rechecked before release.

### Authoritative access-universe reconciliation

| Source universe | Named entries | Included | Excluded/reason |
| --- | --- | --- | --- |
| Douglas County Day Use Parks and individual facility pages | Colliding Rivers, Hestness Landing, John Amacher, Mack Brown, The Narrows, Umpqua Landing, Whistler's Bend | Hestness Landing | John Amacher is closure-adjacent; Umpqua Landing is not on North Umpqua; the other entries remain fail-closed because a precise accepted coordinate plus complete fishing/rule record was not reconciled |
| Douglas County/OSMB ramp-repair release | Colliding Rivers, Whistler's Bend, John Amacher and other repaired ramps | None independently; repair evidence is corroboration only | Repair completion does not override closure, coordinate, receiving-water or fishing-source requirements |
| BLM North Umpqua WSR and site pages | Swiftwater, Baker Wayside, Susan Creek, numerous turnouts/trails/campgrounds | Swiftwater; Susan Creek | Baker Wayside and unnamed/general access remain fail-closed without the complete coordinate/fishing/suitability record required for a product spot |

**Foundation early-approach orientation:** `River Forks / lower North Umpqua
entry`. Douglas County identifies River Forks as the North/South confluence and
Hestness verifies fishing access on the lower North Umpqua. This is orientation,
not a River Forks navigation pin; per-run Beginning and Building reach mappings
remain Pass 3 work.

## 9. Candidate species/run matrix

| Candidate run | Occurs/recurs | Dependable fall opportunity | Pass 1 decision | Evidence/rationale |
| --- | --- | --- | --- | --- |
| Fall Coho | Yes / yes; thousands pass Winchester in many years | Biological opportunity strong; harvest opportunity sparse and hatchery-only | Include with conservative strength and explicit legal limitation | E-001, E-003, E-005-E-012, E-014 |
| Fall Chinook | Small numbers pass Winchester | No fall Chinook season on North; permanent Chinook opening is Feb 1-Jun 30 | Exclude from fall cohort | E-001, E-006-E-007 |
| Spring Chinook | Major North Umpqua run | Outside fall owner scope | Defer; never merge with fall Chinook | E-001, E-006, E-012-E-013 |
| Summer steelhead | Major run with fall overlap | Explicitly outside owner scope and closed Aug 10-Nov 30 in 2026 | Exclude from this cohort | E-002, E-004, E-006, E-014 |
| Winter steelhead | Major run | Owner explicitly deferred | Future cohort | E-001, E-006, E-014 |
| Sea-run cutthroat | Small numbers pass Winchester | Not a supported River Run species and not priority target | Exclude | E-006, E-014 |

**Negative-search completion:** Pass 1 checked permanent and in-season rules,
weekly report, annual coho assessment, conservation-plan/hatchery records,
harvest-card tables, Winchester historical and current count indexes, PacifiCorp
passage/operations material, USGS stations, and BLM/county access sources. No
other frequently targeted fall run in the supported species set belongs in this
owner scope.

## 10. Species/run record — Pass 1 evidence seed

### Run: North Umpqua Fall Coho

**Capability hypothesis:** Four core primitives viable; `observed_river/full`
Activity and Push Watch technically possible; Winchester Fish Counts possible
only after a dedicated provider/freshness contract.

| Research field | Pass 1 evidence | Pass 3 rule |
| --- | --- | --- |
| Identity | `coho_salmon`, fall spawning migration, proposed `pacific_fall_coho_v1` + `fall_cooling` | River-specific calendar/strength/replay; do not copy mainstem coho |
| Recurrence | Long Winchester series and 2023-26 totals; ODFW 2024 adjusted wild population 2,925 | Use finalized count/spawner data to calibrate recurrence, not daily catch probability |
| Origin composition | Recent final returns overwhelmingly wild; North hatchery releases ended May 2006 | Opportunity copy must never imply thousands of retainable coho |
| Harvest | Combined North harvest-card estimates 16-86 annually in 2019-2025 | Low marked-harvest record should constrain opportunity strength/confidence |
| Geography | Winchester passage supports upstream distribution; BLM identifies coho throughout WSR habitat; Soda Springs is conservative endpoint candidate | Closed/special-rule reaches require explicit handling |
| Counter | Valid facility source but delayed/irregular and not implemented in runtime | Must fail unavailable when stale and remain isolated from all scores |

### Pass 3 accepted run truth

| Field | Accepted value |
| --- | --- |
| Run ID/display | `north_umpqua_fall_coho` / North Umpqua Fall Coho |
| Species/season/type | `coho_salmon` / `fall` / `fall_spawn` |
| Engine/biology | `fall_cooling` / `pacific_fall_coho_v1` |
| Purpose/lifecycle | spawning / semelparous |
| Terminal semantics | Terminal spawning tail; presence reaches zero; no winter handoff |
| Migration Stage | available |
| Activity Outlook | available; `observed_river/full` |
| Seasonal Presence | available |
| Push Watch | available; direct hydraulic plus measured-temperature event |
| Fishing Shape | available; lower reach only |
| Migration Timing | unavailable; no qualifying live timing feed |
| Fish Counts | source accepted; available only after Pass 4 parser/freshness QA |

The run's biological ceiling includes predominantly wild passage. Opportunity
copy must continue to say that 2026 retention is hatchery-only in open sections
and that marked harvest is sparse. Winchester totals are neither retainable
fish counts nor a whole-corridor census.

#### Complete calendar

| Boundary | Date | Calibration basis |
| --- | --- | --- |
| `preRunStart` | 08-20 | Context before earliest regular ladder passage |
| `stagingStart` | 08-28 | ODFW says earliest coho passage can begin late August |
| `start` | 09-01 | Historical Winchester reporting window begins; dependable onset remains sparse |
| `beginningEnd` | 09-20 | Separates onset from established build |
| `buildingEstablishedStart` | 09-21 | September ladder passage is present but historically only 0-10.5% complete by Sep. 30 |
| `buildingBroadStart` | 10-10 | Calibrated broad expansion before the passage peak |
| `peakStart` | 10-20 | Late-October peak approach |
| `peak` | 11-05 | Product calibration inside the direct October-November Winchester distribution |
| `peakEnd` | 11-20 | Historical runs are usually substantially complete by this date, but not always |
| `taperingEnd` | 12-05 | Reconciles late passage with ODFW late-Nov/early-Dec spawning |
| `end` | 12-20 | End of primary migration experience |
| `lateEnd` | 01-10 | Terminal biological tail |
| `postRunLateCopyEnd` | 01-30 | Matches the finalized Winchester seasonal reporting tail; presence anchor is zero |

E-028 through E-032 directly bound the passage and spawning envelope. Exact
phase boundaries are product calibration dates and are not represented as
agency-published boundaries.

#### Strength and Seasonal Presence

Maximum is **7/10**, distribution is `broad`, and calibration confidence is
Medium. A 6 would understate the long Winchester series, recent finalized
returns of roughly 1,700-7,400 and broad habitat distribution. An 8 would
overstate public opportunity and coverage because Winchester does not census
the full corridor and hatchery-retention opportunity is sparse; accepted Green
fall coho at 8 is the closest higher portfolio comparator.

Curve `north-umpqua-fall-coho-presence-v1-pass3-2026-09-28` uses anchors
`0:.02, 20:.10, 39:.35, 49:.65, 65:1, 80:.82, 95:.50, 110:.24,
131:.05, 151:0`. They represent earliest September passage, a slow September
build, October expansion, an early-November maximum, late-November transition,
December taper and the January terminal tail. Weather, gauges, Fish Counts,
Activity and Fishing Shape never alter this historical curve.

#### Seasonal Zone and Spot Finder plan

Version `north-umpqua-fall-coho-zone-v1-pass3-2026-09-28`:

| Phase | Exact foundation reach IDs |
| --- | --- |
| Early approach, Before Migration and Beginning | `River Forks / lower North Umpqua entry`; non-expandable orientation only |
| Beginning | `north_umpqua_lower_winchester` |
| Early Building | `north_umpqua_middle_rock_creek` |
| Established Building | `north_umpqua_middle_rock_creek` |
| Broad Building | `north_umpqua_middle_rock_creek`, `north_umpqua_upper_wsr` |
| Peak | `north_umpqua_lower_winchester`, `north_umpqua_middle_rock_creek`, `north_umpqua_upper_wsr` |
| Tapering | `north_umpqua_middle_rock_creek`, `north_umpqua_upper_wsr` |
| Ending | `north_umpqua_upper_wsr` |

Early Building does not reuse the Beginning reach. The Winchester closure,
Rock Creek/Deadline closure, and fly/no-watercraft rules remain explicit gaps;
phase geography never implies uniform fishing legality or access.

#### Activity contract and replay

Version `north-umpqua-fall-coho-full-activity-v1-pass3-2026-09-28` requires
hourly weather plus fresh measured river evidence from the lower reach. Weights
are light `.25`, same-gauge water temperature `.35`, river behavior `.30`, and
same-block weather `.10`. Temperature thresholds are cold 40 F, preferred
45-60 F, warm 64 F and barrier 68 F. Caps are no measured river `60`, missing
water temperature `60`, late run `75`, Ending `42`, and a 15-point Tapering
penalty. No stage-response bonus was added. Idleyld temperature/turbidity is
context-only and can never substitute for or average with Winchester inputs.

| Stage | Mean Activity |
| --- | ---: |
| Pre-run | 18.61 |
| Beginning | 32.48 |
| Building | 76.84 |
| Peak | 80.75 |
| Tapering | 66.99 |
| Ending | 55.26 |
| Post-run | 34.25 |

The fixed 2019-2025 replay covered 952/952 expected days (100%) with all four
blocks; Peak is highest and both shoulders are within 20 points. Controlled
cases passed for missing weather, missing required river input, block-isolated
light/rain, rollup, monotonic temperature shoulders, warm/barrier caps,
lifecycle continuity, Today/Tomorrow labeling, scope, direct-signal/severe-flow
behavior and provider recovery. The permanent public scope is conditional
responsiveness **only if fish are present** in the lower represented reach—not
presence, abundance, exact location or catch probability.

#### Fishing Shape and Push Watch

Fishing Shape version `north_umpqua-fishability-v1-pass3-2026-09-28` uses
4,080 approved daily flows from the fixed 1996-2025 Aug. 28-Jan. 10 window:
too low through 815 CFS; low-fishable 815-925; ideal 925-3,170;
high-fishable 3,170-6,830; very-high transition 6,830-11,000; blown out at
11,000+. Replay violations: zero. It describes only lower-reach hydraulic
workability if fish are present; turbidity, debris, project-release effects,
safety, access and the middle/upper river are unmeasured.

Push uses the exact Sep. 1-Dec. 5 window: 672 usable 2019-2025 dates and 266
consecutive-day positive rises. Both sides of each pair must pass: Possible
`39 CFS + 4.4%`, Elevated `170 CFS + 14.1%`, Strong `640 CFS + 44.7%`.
Same-gauge cooling is a trigger
and constraint: below `.75 F` remains Neutral; `1.5 F` and `3 F` are the
initial Elevated/Strong cooling thresholds subject to 45-60 F supportive,
64 F warm and 68 F barrier constraints. The live model must use trailing
four-hour medians and matched 12/24-hour windows, freeze the onset baseline,
retain no more than 48 hours at `.65/.35` fractions, lose a level when stale,
fail Unavailable without a trigger, and prevent 11,000+ CFS from producing a
favorable read. Precipitation is unscored. Version:
`north_umpqua_fall_coho-direct-push-v1-pass3-2026-09-28`.

#### Winchester Fish Counts boundary

Pass 3 does not change the accepted Pass 2 source semantics. At the research
cutoff the current state is `unavailable/not_reported`; an older finalized total
must not appear current. Pass 4 must implement the dedicated parser, report
identity/revision fixtures, observation-through date, 240-hour freshness,
preliminary/final and wild/hatchery/jack categories, one-fetch-per-source cache,
and fail-closed recovery. Its influence on every scored primitive remains zero.

#### Pass 3 calibration ledger

| Baseline/finding | Accepted change | Predicted effect | Complete replay delta | Decision |
| --- | --- | --- | --- | --- |
| Full Activity was eligible from co-located Winchester flow/temperature | Keep predeclared `.25/.35/.30/.10` weights and biological/cap thresholds; no post-hoc stage bonus | Preserve direct thermal/hydraulic response and honest lifecycle shape | First complete accepted replay equals final means above: 952/952 days, Peak highest, zero failures | accepted without tuning change |
| Calendar and Presence curve were predeclared from Winchester/ODFW timing | No change after viewing Activity label shares | Keep Stage/Presence independent from attractive scores | Every stage/year retains environmental variation; Building/Tapering are within 20 points of Peak | accepted without tuning change |
| Initial Push audit used the wider Fishing Shape season and omitted direct-event series | Restrict calibration to the exact Sep. 1-Dec. 5 start-through-taper window and project each daily pair into a seven-sample four-hour step solely to exercise production event-state code | Paired hydraulic and measured-cooling events use the required window while severe-flow/temperature suppression remains intact | Before: 952-day wider window/all-Neutral invalid audit. After: 672 days/266 rises; 132 Possible/93 Elevated/21 Strong; outage, stale, retention, expiry, temperature and severe tests pass | accepted calibration/audit correction |
| Initial audit reported daily/stage means only | Add all-day, per-stage, per-year and per-block distributions, labels, confidence/cap, leader/tie and spread | Meet complete reporting contract without changing scores | Original daily/stage means unchanged; required reporting and variation invariants added | accepted reporting-only change |

The daily-pair Push projection validates thresholds and the event-state machine;
it is not represented as a historical intraday observation. Pass 4 must still
prove trailing four-hour medians from live high-cadence values.

## 11. Configuration reconciliation

The hidden configuration is implemented in
`supabase/functions/_shared/riverRunEngine/config/onboarding/umpqua.ts`. It is
registered only in the draft owner-review registry. Public runtime registries
remain unchanged.

| Runtime object | ID | Pass 4 state |
| --- | --- | --- |
| River profile | `north_umpqua` | implemented, valid, hidden |
| Fall Coho | `north_umpqua_fall_coho` | implemented, valid, hidden |
| USGS hydraulic source | `north_umpqua_winchester_usgs` | implemented for the lower represented reach |
| USGS temperature source | `north_umpqua_winchester_temperature` | implemented and scored only with co-located lower-reach flow |
| Idleyld context | USGS `14317450` | retained as foundation context only; no runtime score source |
| Winchester count source | `north_umpqua_winchester_coho` | implemented with active-season fail-closed behavior |
| Spot Finder | `north_umpqua` | three audited sections and three official access sites |
| Review fixtures | `north_umpqua_fall_coho` | generated and QA-validated |

### Pass 4 delivery contract

| Field | Exact routing decision |
| --- | --- |
| River/run IDs | `north_umpqua`; `north_umpqua_fall_coho` |
| Activity | `observed_river/full`; co-located lower-reach flow + measured temperature + weather |
| Client capability | `river_run_umpqua_fall_v1` |
| First compatible client | Capability is implemented in app version `1.14`; no binary was built. Remote iOS/Android versions must be re-read immediately before any later authorized build, so 41/23 remain planning values rather than release claims |
| Server work | Hidden river/run/source/zone profiles, Winchester parser/cache/freshness path, capability filtering, replays, audits and catalog wiring |
| Mobile-binary work | North Umpqua picker artwork/size mapping, static Spot Finder inventory, Fish Counts presentation compatibility, capability advertisement and review fixtures |
| Database/migration | None; Pass 4 changed or added no migration file |
| Deployment/public action | Not authorized |
| Stopping gate | Hidden review only; owner acceptance and release remain separate |

## 12. Acceptance and next gate

### Pass 1 completeness gate

| Requirement | Result |
| --- | --- |
| Branch/worktree/catalog/IDs preflight | complete |
| Supported state/region/species/engine/providers/biology | complete |
| One authoritative dossier per canonical river | complete |
| Current assessments and management plans | complete |
| Permanent and in-season regulations | complete |
| Stocking/hatchery records | complete |
| Harvest/creel material | complete |
| Weir/ladder/trap/count search | complete; Winchester candidate fully classified at Pass 1 level |
| Barrier/passage discovery | complete for Pass 1; final chain belongs to Pass 2 |
| Real station metadata/live/history probes | complete |
| Public fishing-access source discovery | complete |
| Contradictions and negative evidence | recorded |
| Runtime configuration/public mutation | intentionally not started |

**Pass 1 gate result:** `complete`.

### Pass 2 completeness gate

| Requirement | Result |
| --- | --- |
| Identity, aliases, corridor, endpoint and exclusions | locked |
| Canonical reaches, legal gaps and gauge-representation limits | locked |
| Winchester/Deadline/Soda Springs passage chain and upstream exclusions | locked with official-source limitations disclosed |
| Fall coho physical endpoint | locked |
| Current regulation coverage and reminder copy | locked; release-time recheck required |
| Primary hydraulic, measured temperature and context sources | accepted with exact parameters, reach and freshness contracts |
| Historical flow/temperature eligibility and gap/datum audit | complete; modern-site/split-era disclosures and `No average` stage decision locked |
| Weather point/archive probe | accepted for lower-reach context |
| Winchester Fish Counts semantics/freshness/categories | locked; adapter remains a Pass 4 implementation task |
| Fishing Shape eligibility | accepted; bands/replay deferred to Pass 3 as required |
| Spot Finder section plan, coordinates, suitability, legal notes and exclusions | accepted |
| Runtime/public mutation | intentionally absent |

**Pass 2 gate result:** `complete — research_ready; proceed to Pass 3`.

### Pass 3 completeness gate

| Requirement | Result |
| --- | --- |
| Candidate matrix and bounded negative search | complete; fall coho supported, fall Chinook excluded, other frequent targets deferred/excluded with reasons |
| Independent identity, lifecycle and terminal semantics | locked |
| Every run-window boundary | locked from direct Winchester/ODFW envelopes plus explicit product calibration |
| Strength, scope, confidence, adjacent comparator test | locked at 7/10 broad, Medium confidence |
| Versioned full-run Presence anchors | locked through Jan. 30 zero terminal tail |
| Early approach and every Seasonal Zone phase | locked; Building never reuses Beginning; legal gaps preserved |
| All four core primitive capability decisions | available |
| Migration Timing | explicitly unavailable |
| Activity mode/source/weight/temperature/cap/scope contract | locked as `observed_river/full` |
| Fixed Activity replay and controlled tests | 2019-2025; 952/952 days; zero invariant/test failures |
| Push direct-source audit/calibration | complete; exact Sep. 1-Dec. 5 window, 672 usable dates, 266 positive rises, paired p50/p75/p90 thresholds |
| Fishing Shape bands/replay/disclosures | complete; 4,080 days, zero violations, lower-reach-only scope |
| Temperature priority and context-source exclusion | complete; Winchester scores, Idleyld remains context-only |
| Fish Counts current-state/implementation boundary | complete; source accepted, current state unavailable, parser remains Pass 4 |
| Pass 4 delivery contract and compatibility boundary | complete |
| Runtime/public mutation | intentionally absent |

**Pass 3 gate result:** `complete — implementation-ready research; proceed to
Pass 4 hidden implementation`. Dossier status remains the normative
`research_ready` until hidden implementation and QA earn
`hidden_implementation_ready`.

### Pass 4 completeness gate

| Requirement | Result |
| --- | --- |
| Hidden river/run/source/zone configuration | complete and valid |
| Public registry isolation and capability gate | complete; public remains unchanged |
| Four core primitives | complete |
| Gauge Read/Fishing Shape lower-reach limits | complete |
| Winchester Fish Counts | parser, freshness, origins, jacks, cache, fail-closed state complete |
| Static Spot Finder inventory | three sections / three official sites; reconciled to foundation |
| Owner-review fixtures | generated; review-mode QA passes |
| Mobile contract | capability advertisement, picker size, and origin display complete |
| Database migration | none; no migration file changed or added |
| Deployment/build/public enablement | intentionally not performed |

**Pass 4 gate result:** `complete — hidden_implementation_ready`. The next
step is owner review, followed by a separate release decision.

## 13. Correction and learning ledger

| Finding | Root cause/risk | Required safeguard | Status |
| --- | --- | --- | --- |
| North coho run is not absent | Prior reasoning conflated a hatchery-only fishery with biological presence | Keep biology, legal retention, and opportunity strength separate | corrected in Pass 1 |
| Thousands of coho do not mean thousands retainable | Recent passage is overwhelmingly wild; North releases ended in 2006 | Prominent hatchery-only limitation, 7/10 biological ceiling and Medium confidence | resolved in Pass 3 |
| Winchester reports are delayed/irregular | Video review staffing and strata publication process | Observation-through freshness, preliminary/final state, automatic unavailable state | implemented and live-audited in Pass 4 |
| Winchester final and annual adjusted estimates differ | Final passage totals and population estimates use different adjustments/time bases | Label metric/class precisely; never blend series | recorded |
| Idleyld is cooler and has turbidity but no flow | It is an upper context station, not co-located with Winchester hydraulics | No averaging/substitution; zero scoring unless separately normalized and approved | recorded |
| USGS 14319500 is not at Winchester Dam | Station name caused a false location assumption; it is at North RM 1.8 | Treat only the lower reach as hydraulically represented | corrected in Pass 2 |
| Upper river has discontinuous legal sections | Dam/marker/fly-area closures and gear restrictions | Spot Finder and Seasonal Zone must not imply uniform fishability/access | implemented and QA-verified in Pass 4 |
| Soda Springs passage exists but upper extension is unnecessary | Physical passage and product/legal endpoint are different | Stop at marker below dam unless a later scope independently justifies expansion | resolved in Pass 2 |
| Daily archives cannot prove historical four-hour Push events | Daily calibration and live detection have different resolution | Use daily data only for paired thresholds; direct-event controlled series must verify four-hour onset/persistence behavior | verified in Pass 4 QA |
