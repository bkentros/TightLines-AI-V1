# Umpqua River (Mainstem) River Run Onboarding Dossier

**River ID:** `umpqua_mainstem`

**State/region:** `OR` / `pacific_northwest`

**Created:** 2026-09-29

**Status:** `hidden_implementation_ready`

**Current completed pass:** Pass 4 — hidden implementation and QA complete

**Target gate:** Owner review; public enablement remains a separate authorization

**Guide:** `docs/river_run_onboarding.md`

## 1. Decisions and evidence ledger

### Pass 1 outcome

**Decision:** Proceed to Pass 2 with two fall runs: Mainstem Fall Chinook and
Mainstem Fall Coho. Keep both hidden. Pass 1 found official evidence of recurring
runs, current legal opportunity, representative live USGS hydraulics and water
temperature, long flow history, usable but split-era temperature history, and
multiple authoritative fishing-access inventories.

**Material qualification:** The 2026 wild-coho fishery is closed. The supported
coho opportunity is hatchery-only and must never be described as a general wild
coho harvest opportunity. ODFW's current report nevertheless documents
fin-clipped coho near Reedsport, and annual harvest-card estimates document a
recurring mainstem/bay coho fishery.

**Fish Counts decision:** Unavailable for the mainstem. Winchester Dam is on the
North Umpqua after the mainstem forks and cannot represent Mainstem Umpqua run
abundance. No recurring official mainstem counter, rack, trap, weir, or separator
feed was found in the ODFW statewide count index, Winchester index, hatchery
materials, annual coho assessment, or sport-catch index. Sport harvest estimates
and spawning surveys are evidence, not Fish Counts.

**Foundation approval/version/date:** Accepted under the owner's instruction to
complete Pass 2 in full / `umpqua-mainstem-foundation-v1-pass2-2026-09-28` /
2026-09-28. Machine-readable audit:
`docs/onboarding/river-run/umpqua_fall_2026_pass2_foundation_audit.json`.

**Run-truth approval/version/date:** Accepted under the owner's instruction to
complete Pass 3 in full / `umpqua-fall-run-truth-v1-pass3-2026-09-28` /
2026-09-28. Machine record:
`docs/onboarding/river-run/umpqua_fall_2026_pass3_run_truth.json`.

**Rendered owner acceptance/date:** Pending; hidden review fixtures generated and
validated 2026-09-29.

**Research cutoff:** 2026-09-28. Recheck ODFW permanent regulations, emergency
updates, wild-coho decision, weekly report, access notices, USGS series status,
and hatchery program status immediately before owner review and release.

### Pass 2 outcome

**Decision:** Foundation accepted and status advanced to `research_ready`.
The 111.5-mile jetties-to-River-Forks corridor is divided into three canonical
reaches. USGS 14321000 represents only the middle reach; it supports live flow,
stage and measured temperature plus defensible flow and split-era temperature
history. Mainstem Fish Counts remain explicitly unavailable. Three conservative
Spot Finder sections and an estuary early-approach orientation are accepted.
Run calendars, strengths, Activity/Push tuning, Fishing Shape bands and
Seasonal Zone mappings remain exclusively Pass 3 decisions.

### Pass 3 outcome

**Decision:** Both supported mainstem runs are accepted for hidden Pass 4
implementation. Fall Chinook and fall coho have independent calendars,
presence curves, strengths, lifecycle limits and Activity replays. Migration
Stage, Activity Outlook, Seasonal Presence and Push Watch are available for
both. Fishing Shape is also accepted for the Elkton reach. Fish Counts and
public Migration Timing remain unavailable.

**Material calibration change:** Mainstem Activity is
`observed_river/hydraulic-only`, not `full`. USGS 14321000 has representative
live hydraulics, but only two complete recent fall temperature seasons. Water
temperature may be shown as measured Gauge Read context and historical
date-context with its split-era disclosure, but has zero Activity and Push
weight until at least five complete seasons pass replay.

**Replay result:** The fixed 2019-2025 replay produced 854/854 usable days for
each run, four blocks per day, and zero calendar, coverage, lifecycle, cap,
severe-flow, direct-event or controlled-test failures. Fishing Shape used 4,590
daily flows from 1996-2025. Complete audit:
`docs/audits/river-run-umpqua-pass3-calibration-replay.json`.

### Pass 4 outcome

**Decision:** Hidden implementation is complete. Both mainstem runs now have
validated draft runtime profiles, all four core primitives, Seasonal Zone,
Gauge Read, Fishing Shape, and an official-source Spot Finder inventory. They
are excluded from the public registries and require authenticated owner review
plus capability `river_run_umpqua_fall_v1`. No public enablement, deployment,
mobile build, or database migration was performed.

**Implementation reconciliation:** Pass 3 calendars, presence ceilings,
presence curves, hydraulic bands, Activity weights/caps, Push thresholds, and
source isolation are locked by `umpquaPass4.test.ts`. The runtime national
Fishability safety contract requires stale-gauge and sharp-rise/high-water caps
of 55 and 40; these are more conservative than the Pass 3 candidate values 60
and 45 and do not change any calibrated flow boundary. Mainstem temperature is
still displayed as Gauge Read context but is absent from run scoring policy.

**Review result:** Generated owner-review coverage now includes both mainstem
runs. Spot Finder contains exactly one official, cautioned access site in each
of the three canonical reaches. Portfolio, review-mode, UI, visual, provider,
and dedicated Pass 4 checks pass. Machine audit:
`docs/onboarding/river-run/umpqua_fall_2026_pass4_implementation_audit.json`.

### Pass 1 delivery contract

| Field | Pass 1 decision |
| --- | --- |
| Hidden river ID | `umpqua_mainstem` |
| Hidden run IDs | `umpqua_mainstem_fall_chinook`, `umpqua_mainstem_fall_coho` |
| Owner scope | Fall only; winter steelhead deferred; South Umpqua excluded |
| Four core primitives sought | `run_stage`, `activity`, `fish_in_river`, `push` for both runs |
| Activity candidate | `observed_river/full` using co-located USGS flow and measured water temperature plus weather; subject to Pass 2 reach acceptance and Pass 3 replay |
| Additional surfaces sought | Gauge Read, Fishing Shape, Spot Finder; Fish Counts explicitly unavailable |
| Stopping gate for this pass | Evidence captured; no runtime configuration or public enablement |

### Repository preflight

| Check | Result | Evidence |
| --- | --- | --- |
| Branch / commit | `develop/cross-platform-next` / `d05e1d50f56c6445ee4c4b5e130c438c104fd58d` | E-018 |
| Initial worktree | Clean before the two dossiers were scaffolded | E-018 |
| Existing catalog | Validator reported 25 configured rivers, 100 runs, 0 errors, 0 warnings | E-018 |
| ID collision | No pre-existing `umpqua_mainstem`, `north_umpqua`, or proposed run IDs | E-018 |
| State/schema | `OR` is supported; `RiverRunRegion` is open; `pacific_northwest` is already used for Oregon | E-018 |
| Species/engine | `chinook_salmon`, `coho_salmon`, and `fall_cooling` are implemented | E-018 |
| Reusable biology | `pacific_fall_chinook_v1`, `pacific_fall_coho_v1` | E-018 |
| Gauge/weather providers | USGS and the existing weather path are reusable | E-010, E-018 |
| Fish-count adapter | No ODFW/Winchester provider or parser exists; irrelevant to mainstem because Winchester is out of scope | E-009, E-018 |

### Evidence ledger

| ID | Authority/title | Direct URL/path | Published/updated | Data years/page | Accessed | Facts supported | Scope/limitations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E-001 | ODFW, 2026 Oregon Sport Fishing Regulations — Southwest Zone | https://prod.eregulations.com/oregon/fishing/southwest-zone | Updated 2026-07-24 | Umpqua Mainstem exception | 2026-09-28 | Official identity and legal corridor from visible jetty tips to North/South confluence; hatchery coho open all year; Chinook Feb 1-Jun 30 and Jul 1-Nov 30; bait allowed; tributary-mouth closures Scottsburg Bridge to River Forks Jun 1-Sep 30 | Permanent rules; must be paired with in-season updates |
| E-002 | ODFW, Fishing regulation updates | https://myodfw.com/articles/regulation-updates | Current 2026 page | Umpqua Mainstem, effective 2026-07-01 through 2026-11-30 | 2026-09-28 | One wild adult Chinook per day and five per season in aggregate with Smith/North Fork Smith | Time-sensitive; recheck before release |
| E-003 | ODFW, Fall coastal salmon management | https://myodfw.com/articles/fall-coastal-salmon-management | 2026 decision | Umpqua rows | 2026-09-28 | Umpqua fall Chinook 7/1-11/30, 1/5; wild coho not opened because forecast is below full-seeding criteria; hatchery program statement | Basin-scale; legal details still come from E-001/E-002 |
| E-004 | ODFW, Southwest Zone recreation report | https://myodfw.com/recreation-report/fishing-report/southwest-zone | Updated 2026-09-16 | Current report | 2026-09-28 | Mainstem target labels Fall Chinook/bass; anglers finding a few Chinook and fin-clipped coho near Reedsport | Snapshot and qualitative; not run calibration by itself |
| E-005 | ODFW, Western Oregon Adult Coho Salmon, 2024 Spawning Survey Data Report | https://nrimp.dfw.state.or.us/DataClearinghouse/default.aspx?att=ODFW/ODFW_42838_2_2024CohoAnnualReport.pdf&pn=ViewFile | 2025-09 | Tables B-3/B-4, pp. 27-31; 1990-2024 | 2026-09-28 | Separate Lower, Middle, North, and South Umpqua populations; 2024 wild estimates Lower 6,438, Middle 3,394, North 2,925, South 3,466; Winchester methodology | Spawner abundance, not current fish counts or catch probability |
| E-006 | ODFW, Umpqua Hatchery Infrastructure Proposal | https://www.dfw.state.or.us/fish/hatchery/docs/Umpqua%20Hatchery%20Infrastructure%20Proposal.pdf | 2025 | p. 2 | 2026-09-28 | Current lower-Umpqua fall Chinook production 170,000; South Umpqua coho 60,000; no North Umpqua coho production row | Production/release evidence only; not adult abundance |
| E-007 | ODFW, Sport Catch Statistics and annual Chinook/Coho CSVs | https://www.dfw.state.or.us/resources/fishing/sportcatch.asp | Annual, through 2025 | Waterbody code 102, 2019-2025 | 2026-09-28 | Expanded harvest estimates confirm recurring mainstem/bay Chinook and coho harvest; see harvest extract below | Self-reported expanded estimates with known response/estimation limitations; not exact counts or passage timing |
| E-008 | ODFW, Commission adopts limited 2025 Umpqua fall Chinook season | https://www.dfw.state.or.us/news/2025/06_Jun/061325.asp | 2025-06-13 | 2024 return/2025 action | 2026-09-28 | 2024 return was the lowest since 1980 and below the conservation-plan critical abundance threshold | Prior-year conservation context; 2026 rules supersede the 2025 fishery action |
| E-009 | ODFW, Winchester Dam Fish Counts | https://myodfw.com/winchester-dam-fish-counts | Current through 2026 | Historical and strata indexes | 2026-09-28 | Winchester is on North Umpqua about 118 river miles from ocean; small fall Chinook pass but most spawn in South/mainstem | Negative scope proof: cannot be used as a Mainstem Umpqua count |
| E-010 | USGS 14321000, Umpqua River near Elkton, and live/metadata probes | https://waterdata.usgs.gov/monitoring-location/USGS-14321000/ ; `docs/onboarding/river-run/umpqua_fall_2026_pass1_provider_probes.json` | Probe 2026-09-28 | Flow daily 1905-current; live flow 1988-current; live temp 2023-current; split-era daily temp | 2026-09-28 | Station identity, coordinates, drainage area, live flow/stage/temp values, provisional semantics, series extents | Pass 2 accepts only the middle Elkton reach; tidal/lower and upper reaches remain unrepresented |
| E-011 | Oregon State Marine Board, Opportunities and Access | https://www.oregon.gov/osmb/boater-info/pages/opportunities-and-access.aspx | Current | Umpqua entries | 2026-09-28 | Current operational status for Salmon Harbor, River Forks, Bumble Bee, Rainbow Plaza, Scottsburg, Umpqua Landing | Boating access is not automatically verified fishing access |
| E-012 | Douglas County, Day Use Parks | https://www.douglascountyor.gov/810/Day-Use-Parks | Current | Umpqua entries | 2026-09-28 | Mainstem candidates Cleveland Rapids, James Wood, River Forks, Scott Creek, Scottsburg, Yellow Creek | Inventory fields require facility-page and coordinate reconciliation |
| E-013 | Douglas County, OSMB grant boat-ramp repairs | https://www.douglascountyor.gov/DocumentCenter/View/27722/07-25-25-OSMB-Grant-Helps-Douglas-County-Complete-Repairs-at-Eight-County-Boat-Ramps | 2025-07-25 | pp. 1-2 | 2026-09-28 | Explicit fishing/river access at Yellow Creek, James Wood, Cleveland Rapids and other repaired ramps | Project snapshot; current access status still needs recheck |
| E-014 | BLM, Tyee Campground — Umpqua River | https://www.blm.gov/visit/tyee-campground-umpqua-river | Current | Recreation/coordinates | 2026-09-28 | Official fishing access and coordinates 43.485025, -123.4842667 | Site status and seasonality must be rechecked |
| E-015 | ODFW, Coastal Multi-Species Conservation and Management Plan index | https://www.dfw.state.or.us/fish/crp/coastal_multispecies.asp | Current index | Chinook/steelhead/cutthroat plan | 2026-09-28 | Management framework and distinct fall/spring Chinook and steelhead life histories | Plan is management context; river-specific dates require dedicated evidence |
| E-016 | ODFW/Pacific Salmon Treaty fall Chinook research report | https://www.dfw.state.or.us/MRP/publications/docs/salmon_1.pdf | Historical study | Umpqua tagging, 2001-2002 | 2026-09-28 | Preliminary estimates suggested roughly 80% entered South Umpqua/Cow Creek, with substantial mainstem spawning | Old limited study; useful distribution caution, not current strength or calendar |
| E-017 | ODFW, Fish Counts at Major Dams and Fish Traps | https://myodfw.com/fish-counts-major-dams-and-fish-traps | Current index | Statewide facilities | 2026-09-28 | Only Winchester is listed for the Umpqua system; no mainstem facility feed found | Negative search, not proof that no temporary research project ever exists |
| E-018 | Repository preflight | `supabase/functions/_shared/riverRunEngine/`, `lib/`, onboarding CLI output, and shared probe artifact | Commit above | Current code | 2026-09-28 | ID availability, public catalog baseline, supported types, engines, profiles, and provider gap | Repository fact only |
| E-019 | Confederated Tribes of Coos, Lower Umpqua and Siuslaw Indians, Harvest Program | https://ctclusi.org/harvestprogram/ | Current 2026 program | Five-county agreement area | 2026-09-28 | Separate member-only ceremonial/subsistence framework, tribal fishing IDs/tags, and 2024 ODFW agreement | Not public recreational authority; do not expose tribal opportunity as an app-wide public season |
| E-020 | Oregon DSL, Umpqua River navigability notice | https://www.oregon.gov/dsl/waterways/Documents/UmpquaRiver_Notice.pdf | Official notice | RM 0-111.5 | 2026-09-28 | Mouth, head of tide near Scottsburg, and fork-confluence river miles | Navigability source, not a fishery rule |
| E-021 | ODFW, Fish Passage Barriers GIS layer | https://gis.odf.oregon.gov/odfags/rest/services/Hydrography/Hydrography/MapServer/14 | Current service | Exact Umpqua-name query | 2026-09-28 | No dam/weir/falls result on scoped mainstem; Winchester/Soda/Slide structure identities on North | Dataset explicitly warns it is not comprehensive/current everywhere; triangulated with other official classes |
| E-022 | USGS, Water Data Report Oregon 2002, station 14321000 | https://pubs.usgs.gov/wdr/WDR-OR-02/pdf/WDR-OR-02_4.pdf | 2002 | Station history and schematic | 2026-09-28 | RM 56.9, 1972 move at same datum, stable bedrock control, mainstem/fork mileage | Historical station documentation; current API remains live authority |
| E-023 | Pass 2 foundation audit | `docs/onboarding/river-run/umpqua_fall_2026_pass2_foundation_audit.json` | 2026-09-28 | Exact history/weather probes, reaches, barriers and access | 2026-09-28 | Locked foundation contracts and observed data counts | Research artifact; no runtime/public mutation |
| E-024 | ODFW, Southwest Zone seasonal fishing overview | https://myodfw.com/fishing/southwest-zone | Current | Fall Chinook and hatchery coho timing | 2026-09-28 | Fall Chinook and hatchery coho return from August through October/November | Regional timing envelope, not exact mainstem phase boundaries |
| E-025 | ODFW, Watch for spawning salmon | https://www.dfw.state.or.us/news/2017/10_Oct/102717b.asp | 2017-10-27 | Umpqua fall spawning observations | 2026-09-28 | Umpqua fall Chinook spawning peaks late October/early November; coho spawning is late November/early December | Spawning timing is a terminal/peak constraint, not river-entry timing |
| E-026 | NOAA Fisheries, Salmon life cycle and seasonal fishery planning | https://www.fisheries.noaa.gov/west-coast/sustainable-fisheries/salmon-life-cycle-and-seasonal-fishery-planning | Current | West Coast coho | 2026-09-28 | General adult coho return envelope of September-December | Regional biological cross-check only; ODFW Umpqua sources control local calibration |
| E-027 | ODFW, Southwest Zone recreation report | https://myodfw.com/recreation-report/fishing-report/southwest-zone | Updated 2026-09-16 | Umpqua current report | 2026-09-28 | A few Chinook and fin-clipped coho reported near Reedsport | One current observation; supports lower-river onset/orientation, not exact peak |
| E-028 | Pass 3 run-truth record | `docs/onboarding/river-run/umpqua_fall_2026_pass3_run_truth.json` | 2026-09-28 | All three accepted runs | 2026-09-28 | Exact calendars, strengths, presence anchors, zones, capabilities and delivery contract | Accepted research/configuration intent; runtime still absent |
| E-029 | Pass 3 calibration replay | `docs/audits/river-run-umpqua-pass3-calibration-replay.json` and `scripts/river-run-umpqua-pass3-replay.ts` | Generated 2026-09-29 UTC | Activity 2019-2025; Fishing Shape 1996-2025 | 2026-09-28 | Fixed replay coverage, distributions, thresholds, controlled tests and zero failed invariants | Daily archives calibrate the live four-hour model; they do not claim historical intraday events or catches |

### Source-class completion audit

| Required Pass 1 class | Authorities/classes checked | Result |
| --- | --- | --- |
| Current assessment/management | ODFW 2024 coho assessment, coastal coho page, Coastal Multi-Species Plan | Recurring fall Chinook/coho supported; conservation variability logged |
| Permanent/emergency/co-manager regulations | ODFW 2026 permanent and in-season pages; CTCLUSI current harvest-program index | Public recreational rules captured; separate tribal framework identified and excluded from public-rule copy |
| Stocking/hatchery/egg-take | ODFW infrastructure proposal, hatchery index, Winchester materials | Lower Umpqua fall Chinook program found; South coho program distinguished; no recurring mainstem adult/egg-take feed found |
| Creel/harvest | ODFW annual sport-catch CSVs and weekly report | Recurring opportunity supported; administrative-unit and estimation limitations logged |
| Weir/ladder/trap/counter | ODFW statewide count index, Winchester index, annual assessment | Winchester rejected for mainstem scope; no representative mainstem feed found |
| Passage/barrier/removal | ODFW plans/facility sources, regulations, USGS/BLM/county/Marine Board material | No mainstem structure found; negative result reserved for Pass 2 falsification |
| Gauge live/history | USGS station, continuous API, time-series metadata API | Real values, units, timestamps, provisional state, cadence, extents, gaps and absent turbidity captured |
| Public fishing access | Douglas County, Oregon State Marine Board, BLM | Source universe captured; fishing-vs-boating and receiving-water conflicts logged |

### Official harvest evidence extract

ODFW waterbody code 102 (`Umpqua R & Bay`) is not a pure in-river passage
series, but it is strong recurring-opportunity evidence. Totals are expanded
angler-harvest estimates, not observed fish counts.

| Year | Chinook total | Coho total | Material monthly concentration |
| ---: | ---: | ---: | --- |
| 2019 | 1,413 | 711 | Chinook Aug-Oct; coho Sep-Oct |
| 2020 | 2,247 | 242 | Chinook Aug-Oct; coho Sep-Oct |
| 2021 | 2,193 | 1,015 | Chinook Jul-Oct; coho Jul-Oct |
| 2022 | 2,743 | 1,522 | Chinook Jul-Oct; coho Jul-Oct |
| 2023 | Source file unavailable at the expected Chinook URL | 493 | Coho Jul-Oct |
| 2024 | 2,455 | 5,307 | Chinook Jul-Oct; coho Aug-Oct |
| 2025 | 1,187 | 490 | Chinook Apr-Sep in the annual estimate; coho Jul-Sep |

The 2025 Chinook month pattern conflicts with a simplistic “all fall harvest”
interpretation because code 102 aggregates the bay/mainstem and multiple legal
windows. Pass 3 must not turn these monthly harvest estimates directly into
Migration Stage boundaries.

## 2. Identity and corridor — foundation accepted

| Field | Locked decision | Evidence/qualification |
| --- | --- | --- | --- |
| Public identity | `Umpqua River (Mainstem)`; aliases `Umpqua River`, `Mainstem Umpqua`, and source-only `Umpqua River and Bay` | ODFW E-001 and administrative harvest source E-007 |
| Jurisdiction/region | Oregon; Douglas County; `pacific_northwest` runtime region | `OR` and this region already exist in the engine; no cross-state presentation context |
| Product corridor | Visible jetty tips at Winchester Bay to the North/South Umpqua confluence at River Forks | ODFW E-001; Oregon DSL places the mouth at RM 0, head of tide near Scottsburg at about RM 28, and fork confluence at RM 111.5 |
| Approximate length | 111.5 river miles | Oregon DSL notice; USGS schematic independently places the fork near RM 111.7 |
| Receiving water/timezone | Pacific Ocean / `America/Los_Angeles` | Mouth entry approximately `43.669, -124.204` from NOAA; coordinate is an orientation point, not a navigation pin |
| Explicit exclusions | North Umpqua, South Umpqua, Smith River and North Fork Smith River | The Smith aggregate is a regulation accounting rule, not product geometry |
| Weather anchor | Exact USGS 14321000 coordinate in the accepted middle reach | Open-Meteo live and seven-day archive probes succeeded; modeled point never represents the estuary or entire basin |
| Support/version | `beta`; `umpqua-mainstem-foundation-v1-pass2-2026-09-28` | Active UTC refresh slots `00:00, 04:00, 08:00, 12:00, 16:00, 20:00, 21:00`; inactive `00:00` |

## 3. Canonical reaches — foundation accepted

| Reach ID | Public name | Locked boundaries | Role | Gauge represented |
| --- | --- | --- | --- | --- |
| `umpqua_mainstem_estuary_lower` | Umpqua Estuary & Lower River — jetties to Scottsburg | Visible jetty tips to Scottsburg Bridge/head of tide near RM 28 | Downstream/entry | No; tidal and lower-river conditions must not inherit Elkton hydraulics |
| `umpqua_mainstem_middle_elkton` | Middle Umpqua — Scottsburg to Elkton | Scottsburg Bridge/head of tide to USGS 14321000 at RM 56.9 | Middle | Yes; this is the only hydraulically represented reach |
| `umpqua_mainstem_upper_forks` | Upper Mainstem — Elkton to River Forks | USGS 14321000 to the fork confluence near RM 111.5 | Terminal | No; the gauge is a boundary/context point, not an upper-reach proxy |

Closed tributary-mouth bands remain rule overlays rather than invented reach
breaks. Machine-readable geometry and source decisions are in the shared Pass 2
foundation audit.

## 4. Barrier and passage inventory — foundation accepted

The mouth-to-forks audit is complete at the foundation level. An exact query of
Oregon's official Fish Passage Barrier layer for Umpqua-named features returned
bridges, but no dam, weir, or falls on the 111.5-mile mainstem corridor. That
result was triangulated against ODFW regulations/count indexes, the USGS river
schematic, and facility sources. The state GIS warns that its inventory is not
comprehensive everywhere, so the product claim is deliberately narrow: **no
named in-channel passage structure was found in the scoped mainstem**, not
“unrestricted passage is guaranteed.”

| Structure/facility | Locked treatment | Evidence/status |
| --- | --- | --- |
| Winchester Dam | Excluded; on North Umpqua above the fork and never a mainstem Fish Counts source | E-009 plus ODFW barrier feature 18305 |
| Mainstem dams/weirs/falls | None found in the scoped corridor after official GIS and source-class reconciliation | Foundation negative-search complete; release-time contradiction checks remain |

## 5. Species endpoints and passage chains — foundation accepted

| Run | Locked physical chain | Opportunity/biology guardrail |
| --- | --- | --- |
| Fall Chinook | Pacific/estuary through the mainstem to River Forks | Mainstem fishery and spawning corridor; product ends at the forks and does not claim South/Cow Creek or North distribution |
| Fall Coho | Pacific/estuary through the mainstem to River Forks | Biological migration includes wild fish and Lower/Middle populations; 2026 public retention is hatchery-only and cannot be presented as general coho harvest |

These are physical product endpoints, not Pass 3 run dates or zone timing.

## 6. Regulations — foundation accepted

| Authority/version | Locked coverage | Required public reminder | Recheck contract |
| --- | --- | --- | --- |
| ODFW 2026 permanent Southwest Zone + 2026 in-season updates | Mainstem from visible jetty tips to forks; Chinook Jul 1-Nov 30 for the fall window; hatchery coho open; wild-coho retention closed; affected tributary mouths closed within 200 feet from Scottsburg Bridge to River Forks Jun 1-Sep 30 | “Mainstem Umpqua salmon rules and tributary-mouth closures vary by reach and can change in season. Wild coho retention is closed in 2026. Check current ODFW regulations and updates before fishing.” | Recheck permanent rules, emergency updates, wild-coho decision, health advisory and site notices before owner review and release |

The 2026 wild adult Chinook limit is one per day and five per season in
aggregate with Smith River and North Fork Smith River. The app must link the
rule rather than attempting to track an angler's aggregate bag.

## 7. Source and capability audit — foundation accepted

| Source/metric | Locked role | Reach and history decision |
| --- | --- | --- |
| USGS 14321000 discharge `00060` | `primary_scored` and displayed; single hydraulic input | Middle Elkton reach only. Daily 1905-2025 audit: 43,922 approved values, 288 estimated, no internal daily gaps; typical fall date has 120-121 qualifying prior years |
| USGS 14321000 gage height `00065` | Display-only | Same station; **No average** because stage is datum/rating sensitive |
| USGS 14321000 water temperature `00010` | Primary measured temperature; displayed, never replaced with air temperature | Split-era daily history 1985-1992 and 2023-2025: 3,164 values and typically 8-10 qualifying fall years; UI must disclose the long gap |
| USGS 14321000 turbidity `63680` | Unavailable | No live series; never synthesize |
| Open-Meteo at station coordinate | Weather/Activity context | Single modeled point for the middle reach; live and 168-hour archive probes passed; zero independent hydraulic influence |
| Mainstem Fish Counts | Unavailable | No representative recurring facility feed; Winchester is explicitly out of scope |

Flow and temperature historical context may use daily means within ±3 calendar
days across prior qualifying years and must expose year/sample counts. Live USGS
values have a two-hour maximum age and preserve provisional status. Temperature
uses the shared three-hour plausibility/smoothing contract in the audit.

| Capability | Pass 2 decision | Next requirement |
| --- | --- | --- |
| Gauge Read | Accepted | Pass 4 adapter/UI failure-state verification |
| Historical flow/temperature | Accepted with the periods and disclosure above | Generate immutable normal artifact in implementation; no gage-height normal |
| Fish Counts | Explicitly unavailable | Render honest unavailable state only |
| Fishing Shape | Source/reach eligible, not enabled | Pass 3 must establish absolute middle-reach bands, replay multiple years, and disclose unmeasured turbidity/visibility and debris; it must not describe tidal lower-river shape |
| Activity | Eligible for `observed_river/full`, not enabled | Pass 3 run-specific tuning and fixed replay |
| Push Watch | Inputs eligible, not enabled | Pass 3 run-specific rise/cooling/severe-flow rules |

## 8. Spot Finder — foundation accepted

Only sites with an authoritative fishing-access statement and a reconciled
coordinate are accepted. These records establish access, not good fishing,
safe wading, safe launching, or shoreline-wide public rights.

| Section | Accepted site | Coordinate/source | Conservative suitability and restrictions |
| --- | --- | --- | --- |
| Lower: jetties to Scottsburg | Scottsburg County Park | `43.6496619, -123.8390207`; Douglas County fishing/ramp page + USGS GNIS | Boat access verified; bank extent limited/unspecified; wading unverified; tidal influence; not marked beginner-suitable |
| Middle: Scottsburg to Elkton | Scott Creek County Park | `43.6735992, -123.6878898`; Douglas County fishing/ramp page + USGS GNIS | Boat access verified; bank extent limited/unspecified; wading unverified; not marked beginner-suitable |
| Upper: Elkton to River Forks | Tyee Campground — Umpqua River | `43.485025, -123.4842667`; BLM | Fishing and stair access verified; no boat-access claim; conditions vary; reservation/site status must be rechecked; not marked beginner-suitable |

The permanent Umpqua cyanobacteria advisory and the June-September
tributary-mouth closure must accompany relevant access results. Salmon Harbor
and generic boating entries are not promoted merely because they launch boats.
Other county sites remain a research reserve inventory, not unverified filler.
`Umpqua Landing` is reconciled to the Calapooya/Umpqua confluence and is not a
North Umpqua site.

### Authoritative access-universe reconciliation

| Source universe | Named entries | Included | Excluded/reason |
| --- | --- | --- | --- |
| Douglas County Day Use Parks and individual facility pages | Cleveland Rapids, James Wood, River Forks, Scott Creek, Scottsburg, Yellow Creek | Scott Creek; Scottsburg | Cleveland Rapids, James Wood, River Forks and Yellow Creek remain fail-closed because a precise navigation coordinate and complete site-specific rule/suitability record were not reconciled in this pass |
| Douglas County/OSMB 2025 ramp-repair release | Yellow Creek, James Wood, Cleveland Rapids and other repaired ramps | Corroborates fishing kind only for accepted entries where applicable | Repair completion does not by itself prove current operation, safe entry or a navigation coordinate |
| Oregon State Marine Board opportunities/status | Salmon Harbor, River Forks, Bumble Bee, Rainbow Plaza, Scottsburg, Umpqua Landing | Scottsburg as current-status corroboration | Remaining entries are boating/status evidence without a separately accepted fishing record and coordinate; Umpqua Landing receiving water is reconciled but not otherwise needed |
| BLM Umpqua facilities | Tyee Campground — Umpqua River | Tyee | No other BLM mainstem fishing site entered the declared universe |

**Foundation early-approach orientation:** `Umpqua Estuary / Winchester Bay`.
ODFW expressly includes the visible-jetty-tip-to-forks mainstem and reports
fall salmon near Reedsport; the estuary is the river's direct receiving-water
entry, not a promise of access or a substitute regulation. Per-run Beginning
and Building reach mappings remain Pass 3 work.

## 9. Candidate species/run matrix

| Candidate run | Occurs/recurs | Dependable fall opportunity | Pass 1 decision | Evidence/rationale |
| --- | --- | --- | --- | --- |
| Fall Chinook | Yes / yes | Yes, conservation-sensitive and variable | Include | E-001-E-004, E-006-E-008, E-016 |
| Fall Coho | Yes / yes | Yes for hatchery-marked fish; wild retention closed in 2026 | Include with explicit hatchery-only opportunity language | E-001, E-003-E-007 |
| Spring Chinook | Yes | Outside owner fall scope | Defer to a future cohort; never merge with fall Chinook | E-001, E-015 |
| Winter steelhead | Yes | Outside owner fall scope | Defer as explicitly requested | E-001, E-015 |
| Summer steelhead | Transit/occurrence in basin | Not requested; fall overlap does not justify merging | Exclude from this cohort | E-001, E-015 |
| Sea-run cutthroat | Occurs in basin | Not a supported River Run species and not a priority target | Exclude | E-009, E-015 |
| Striped bass/smallmouth bass | Targeted on mainstem | Not an anadromous salmonid run modeled by this product | Exclude | E-004 |

**Negative-search completion:** For excluded or deferred candidates, Pass 1
checked current permanent and emergency regulations, current weekly report,
ODFW conservation-plan indexes, hatchery production, sport-catch tables,
Winchester/facility count indexes, barrier/passage material, and public-land
fishery descriptions. No additional frequently targeted fall anadromous run
within the supported River Run species set was found that belongs in this owner
scope.

## 10. Species/run records — Pass 1 evidence seeds

### Run: Mainstem Fall Chinook

**Capability hypothesis:** Four core primitives viable; `observed_river/full`
Activity and Push Watch are technically possible; Fish Counts unavailable.

| Research field | Pass 1 evidence | Pass 3 rule |
| --- | --- | --- |
| Identity | `chinook_salmon`, fall spawning migration, proposed `pacific_fall_chinook_v1` + `fall_cooling` | Reconcile independently; do not copy another river's calendar or ceiling |
| Legal window | Jul 1-Nov 30 in 2026 with 1/day, 5/season aggregate wild limit | Legal dates do not automatically equal biological Stage dates |
| Recurrence | Six available annual harvest files show 1,187-2,743 expanded code-102 Chinook harvest | Use assessment, passage/spawn, harvest, and management evidence together |
| Conservation variability | 2024 return described as lowest since 1980; 2026 limit increased and quota removed | Strength must represent durable opportunity, not a single strong/weak year |
| Distribution | Mainstem is fishery/spawning corridor, but historical tagging suggested most basin fall Chinook entered South/Cow | Product endpoint stops at forks; never imply whole-basin abundance |

### Run: Mainstem Fall Coho

**Capability hypothesis:** Four core primitives viable; `observed_river/full`
Activity and Push Watch are technically possible; Fish Counts unavailable.

| Research field | Pass 1 evidence | Pass 3 rule |
| --- | --- | --- |
| Identity | `coho_salmon`, fall spawning migration, proposed `pacific_fall_coho_v1` + `fall_cooling` | Calibrate separately from Chinook |
| Legal opportunity | Hatchery coho open all year in open sections; wild coho retention closed in 2026 | All opportunity copy must distinguish biological wild migration from legal hatchery harvest |
| Recurrence | Code-102 expanded coho harvest recorded every year 2019-2025 (242-5,307); current report notes fin-clipped coho near Reedsport | Do not let exceptional 2024 harvest set the run ceiling |
| Basin biology | ODFW estimates distinct Lower and Middle Umpqua wild spawning populations in addition to North/South | Mainstem is migration corridor and includes Lower/Middle population geography; do not collapse all basin fish into one count |

### Pass 3 accepted run truth

| Field | Mainstem Fall Chinook | Mainstem Fall Coho |
| --- | --- | --- |
| Run ID/display | `umpqua_mainstem_fall_chinook` / Mainstem Fall Chinook | `umpqua_mainstem_fall_coho` / Mainstem Fall Coho |
| Species/season/type | `chinook_salmon` / `fall` / `fall_spawn` | `coho_salmon` / `fall` / `fall_spawn` |
| Engine/biology | `fall_cooling` / `pacific_fall_chinook_v1` | `fall_cooling` / `pacific_fall_coho_v1` |
| Purpose/lifecycle | spawning / semelparous | spawning / semelparous |
| Terminal semantics | Terminal spawning tail; presence reaches zero; no winter handoff | Terminal spawning tail; presence reaches zero; no winter handoff |
| Migration Stage | available | available |
| Activity Outlook | available; `observed_river/hydraulic-only`; `Limited` | available; `observed_river/hydraulic-only`; `Limited` |
| Seasonal Presence | available | available |
| Push Watch | available; direct hydraulic event | available; direct hydraulic event |
| Fishing Shape | available; Elkton reach only | available; Elkton reach only |
| Migration Timing | unavailable; no qualifying observed timing feed | unavailable; no qualifying observed timing feed |
| Fish Counts | unavailable; no representative mainstem facility | unavailable; no representative mainstem facility |

Both runs use biological presence, not harvestability. Coho copy must state that
2026 retention is hatchery-only. Neither run may imply that code-102 harvest is
a passage count or that Elkton conditions describe the estuary/upper river.

#### Complete calendars

| Boundary | Fall Chinook | Fall Coho | Calibration basis |
| --- | --- | --- | --- |
| `preRunStart` | 07-15 | 08-15 | Early seasonal context before dependable entry |
| `stagingStart` | 08-01 | 09-01 | ODFW August fall-salmon envelope; September coho return envelope |
| `start` | 08-15 | 09-10 | Dependable beginning after sparse lower-river arrivals |
| `beginningEnd` | 08-31 | 09-25 | Separates dependable onset from broad build |
| `buildingEstablishedStart` | 09-01 | 09-26 | September recurring harvest/observation support |
| `buildingBroadStart` | 09-15 | 10-10 | Calibrated mainstem expansion, not a legal-season proxy |
| `peakStart` | 09-20 | 10-20 | Entry/harvest evidence reconciled with later spawning |
| `peak` | 10-05 | 11-05 | Product calibration inside direct ODFW seasonal/spawning envelopes |
| `peakEnd` | 10-20 | 11-20 | Transition toward documented late-Oct/Nov Chinook and late-Nov coho spawning |
| `taperingEnd` | 11-05 | 12-05 | Spawning/late passage transition |
| `end` | 11-15 | 12-15 | End of primary migration experience |
| `lateEnd` | 11-30 | 12-31 | Biological/legal terminal tail; not a current abundance claim |
| `postRunLateCopyEnd` | 12-15 | 01-10 | Shared terminal copy only; presence is zero at its final anchor |

ODFW's seasonal page, current Reedsport observation, spawning-timing page and
annual harvest distribution bound these dates. Exact phase boundaries are
product calibration dates; they are not represented as agency-published dates.

#### Strength and Seasonal Presence

| Field | Fall Chinook | Fall Coho |
| --- | --- | --- |
| Maximum/scope | 6/10, `broad` | 7/10, `broad` |
| Confidence | Medium | Medium |
| Lower-rating test | 5 understates a recurring established fishery and six available annual estimates of 1,187-2,743 harvested fish | 6 understates distinct Lower/Middle populations and recurring harvest, including 5,307 in 2024 |
| Higher-rating test | 7 would overstate certainty after the 2024 critical-abundance result and without a representative counter; accepted Green fall Chinook 7 is the closest higher comparator | 8 would overstate a variable administrative harvest series without a counter; accepted Green fall coho 8 is the closest higher comparator |
| Curve version | `umpqua-mainstem-fall-chinook-presence-v1-pass3-2026-09-28` | `umpqua-mainstem-fall-coho-presence-v1-pass3-2026-09-28` |
| Anchors `(day:fraction)` | `0:.06, 17:.20, 36:.60, 51:1, 66:.78, 82:.38, 92:.15, 107:.03, 122:0` | `0:.05, 16:.18, 40:.55, 56:1, 71:.82, 86:.48, 96:.22, 112:.05, 122:0` |

Presence is a fixed historical seasonal curve relative to each run's own
ceiling. Weather, flow, temperature, Fish Counts, Activity and Fishing Shape do
not alter it.

#### Seasonal Zone and Spot Finder plan

Both runs independently reconcile to the same phase geometry; the shared shape
is accepted because each run's evidence supports the estuary-to-forks
progression, not because one species was copied onto the other.

| Phase | Exact foundation reach IDs |
| --- | --- |
| Early approach, Before Migration and Beginning | `Umpqua Estuary / Winchester Bay`; non-expandable orientation only |
| Beginning | `umpqua_mainstem_estuary_lower` |
| Early Building | `umpqua_mainstem_middle_elkton` |
| Established Building | `umpqua_mainstem_middle_elkton` |
| Broad Building | `umpqua_mainstem_middle_elkton`, `umpqua_mainstem_upper_forks` |
| Peak | `umpqua_mainstem_estuary_lower`, `umpqua_mainstem_middle_elkton`, `umpqua_mainstem_upper_forks` |
| Tapering | `umpqua_mainstem_middle_elkton`, `umpqua_mainstem_upper_forks` |
| Ending | `umpqua_mainstem_upper_forks` |

Versions are `umpqua-mainstem-fall-chinook-zone-v1-pass3-2026-09-28` and
`umpqua-mainstem-fall-coho-zone-v1-pass3-2026-09-28`. Early Building does not
reuse the Beginning reach. Access remains limited to the accepted Pass 2
inventory, and tributary-mouth closures remain explicit legal gaps.

#### Activity contracts and replay

Both runs require hourly weather plus fresh measured Elkton hydraulics. Missing
weather or hydraulics returns Unavailable. Temperature has zero weight and no
cap effect. The four component weights are light `.30`, measured water
temperature `0`, river behavior `.60`, and same-block weather `.10`. Caps are
no measured river `60` before fail-closed presentation, late run `75`, Ending
`42`, and a 15-point Tapering penalty. No stage-response bonus was added.

| Run/version | Pre-run | Beginning | Building | Peak | Tapering | Ending | Post-run | Coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Chinook / `umpqua-mainstem-fall-chinook-hydraulic-activity-v1-pass3-2026-09-28` | 38.44 | 36.76 | 46.92 | 52.35 | 50.15 | 37.30 | 27.30 | 854/854 days, 100% |
| Coho / `umpqua-mainstem-fall-coho-hydraulic-activity-v1-pass3-2026-09-28` | 37.51 | 49.88 | 54.10 | 55.91 | 46.72 | 36.26 | 21.88 | 854/854 days, 100% |

Peak is highest and both shoulders remain within 20 points. All usable days have
four scored blocks. Controlled cases passed for missing weather, missing
hydraulics, block-isolated light/rain, daily rollup, disabled-temperature
invariance, lifecycle continuity, Today/Tomorrow labeling, scope, severe flow,
direct-signal requirement and provider recovery. The permanent public scope is
that Activity estimates conditional responsiveness **only if fish are present**
in the represented middle reach; it does not establish fish presence,
abundance, location or catch probability.

#### Fishing Shape and Push Watch

Fishing Shape version `umpqua_mainstem-fishability-v1-pass3-2026-09-28`
uses 4,590 approved daily flows from the fixed 1996-2025 Aug. 1-Dec. 31 window:
too low through 960 CFS; low-fishable 960-1,110; ideal 1,110-3,240;
high-fishable 3,240-10,500; very-high transition 10,500-17,500; blown out at
17,500+. Replay violations: zero. It describes only workability at Elkton if
fish are present; tide, turbidity, debris, safety, access and other reaches are
unmeasured.

Push uses the exact Aug. 15-Dec. 5 union: 791 usable 2019-2025 dates and 328
consecutive-day positive rises. Both sides of each pair must pass: Possible
`30 CFS + 2.9%`, Elevated `140 CFS + 9.4%`, Strong `765 CFS + 34.0%`. The live implementation must
use trailing four-hour medians, matched 12/24-hour windows, freeze the onset
baseline, retain no longer than 48 hours at `.65/.35` fractions, make stale
data lose a level, fail Unavailable without the trigger, and prevent severe
flow at 17,500+ from producing a favorable read. Precipitation is unscored;
temperature is disabled. Versions are run-specific and recorded in E-028.

#### Historical temperature decision

`umpqua_mainstem_elkton_temperature` remains first-priority measured Gauge Read
temperature. Its split-era daily archive may support honest target-date ±3-day
historical context with year count and gap disclosure. It is not replay-eligible
for scored Activity/Push because 2019-2025 contains fewer than five complete
fall seasons. Air temperature and another reach are never substituted.

#### Pass 3 calibration ledger

| Baseline/finding | Accepted change | Predicted effect | Complete replay delta | Decision |
| --- | --- | --- | --- | --- |
| Pass 1 hypothesized full Activity; only two complete recent Elkton temperature seasons met the fall window | Switch both runs to hydraulic-only, temperature weight/caps zero, `Limited` | Preserve a seven-season observed-river replay without inventing thermal evidence | Before: full candidate ineligible and rejected before scoring. After: 854/854 days per run, Peak highest, zero failures | accepted |
| Calendars, weights, thresholds, caps and lifecycle were predeclared before replay | No score-shaping change after viewing results | Preserve independent evidence-led calendars and real environmental variation | First complete accepted replay equals final stage means above; every stage/year varies and all shoulders pass | accepted without tuning change |
| Initial Push audit used the wider Fishing Shape season and omitted direct-event series | Restrict calibration to the exact Aug. 15-Dec. 5 start-through-taper union and project each consecutive daily pair into a seven-sample four-hour step solely to exercise production event-state code | Paired thresholds reflect the required window; positive labels require direct events; severe water remains Neutral | Before: 1,071-day wider window/all-Neutral invalid audit. After: 791 days/328 rises; Chinook 66 Possible/35 Elevated/6 Strong; coho 62 Possible/53 Elevated/20 Strong; all tests pass | accepted calibration/audit correction |
| Initial audit reported daily/stage means only | Add all-day, per-stage, per-year and per-block distributions, labels, confidence/cap, leader/tie and spread | Meet the complete replay reporting contract without changing scores | Original daily/stage means unchanged; required reporting and variation invariants added | accepted reporting-only change |

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
| River profile | `umpqua_mainstem` | implemented, valid, hidden |
| Fall Chinook | `umpqua_mainstem_fall_chinook` | implemented, valid, hidden |
| Fall Coho | `umpqua_mainstem_fall_coho` | implemented, valid, hidden |
| USGS source | `umpqua_mainstem_elkton_usgs` | implemented for flow/height in the Elkton reach |
| Temperature source | `umpqua_mainstem_elkton_temperature` | implemented as display context; zero Activity/Push influence |
| Spot Finder | `umpqua_mainstem` | three audited sections and three official access sites |
| Review fixtures | both run IDs | generated and QA-validated |

### Pass 4 delivery contract

| Field | Exact routing decision |
| --- | --- |
| River/run IDs | `umpqua_mainstem`; `umpqua_mainstem_fall_chinook`, `umpqua_mainstem_fall_coho` |
| Activity | Both `observed_river/hydraulic-only`, `Limited`; Elkton flow + weather required; temperature zero weight |
| Client capability | `river_run_umpqua_fall_v1` |
| First compatible client | Capability is implemented in app version `1.14`; no binary was built. Remote iOS/Android versions must be re-read immediately before any later authorized build, so 41/23 remain planning values rather than release claims |
| Server work | Hidden river/run/source/zone profiles, capability filtering, replays, audits and catalog wiring |
| Mobile-binary work | Mainstem picker artwork/size mapping, static Spot Finder inventory, capability advertisement and review fixtures |
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
| Weir/ladder/trap/count search | complete; no representative mainstem feed |
| Barrier/passage discovery | complete for Pass 1; final inventory belongs to Pass 2 |
| Real station metadata/live/history probes | complete |
| Public fishing-access source discovery | complete |
| Contradictions and negative evidence | recorded |
| Runtime configuration/public mutation | intentionally not started |

**Pass 1 gate result:** `complete`.

### Pass 2 completeness gate

| Requirement | Result |
| --- | --- |
| Identity, aliases, corridor, endpoint and exclusions | locked |
| Canonical reaches and gauge-representation limits | locked |
| Mouth-to-endpoint barrier/passage inventory | locked with official-layer limitation disclosed |
| Species physical endpoints | locked for fall Chinook and fall coho |
| Current regulation coverage and reminder copy | locked; release-time recheck required |
| Primary hydraulic and measured temperature sources | accepted with exact parameters, reach and freshness contracts |
| Historical flow/temperature eligibility and gap audit | complete; split-era disclosure and `No average` stage decision locked |
| Weather point/archive probe | accepted for middle-reach context |
| Fish Counts | explicitly unavailable for mainstem |
| Fishing Shape eligibility | accepted; bands/replay deferred to Pass 3 as required |
| Spot Finder section plan, coordinates, suitability and exclusions | accepted |
| Runtime/public mutation | intentionally absent |

**Pass 2 gate result:** `complete — research_ready; proceed to Pass 3`.

### Pass 3 completeness gate

| Requirement | Result |
| --- | --- |
| Candidate matrix and bounded negative search | complete; two supported fall runs, other frequent targets deferred/excluded with reasons |
| Independent identity, lifecycle and terminal semantics | locked for Chinook and coho |
| Every run-window boundary | locked independently |
| Strength, scope, confidence, adjacent comparator test | locked independently |
| Versioned full-run Presence anchors | locked independently through zero terminal tail |
| Early approach and every Seasonal Zone phase | locked; Building never reuses Beginning |
| All four core primitive capability decisions | available for both runs |
| Migration Timing and Fish Counts | explicitly unavailable |
| Activity mode/source/weight/cap/scope contract | locked as hydraulic-only `Limited` for both runs |
| Fixed Activity replay and controlled tests | 2019-2025; 854/854 days per run; zero invariant/test failures |
| Push direct-source audit/calibration | complete; exact Aug. 15-Dec. 5 union, 791 usable dates, 328 positive rises, paired p50/p75/p90 thresholds |
| Fishing Shape bands/replay/disclosures | complete; 4,590 days, zero violations, Elkton-only scope |
| Temperature priority/history/zero-scoring decision | complete; no short-record scoring |
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
| Four core primitives | complete for both runs |
| Gauge Read/Fishing Shape reach limits | complete |
| Static Spot Finder inventory | three sections / three official sites; reconciled to foundation |
| Owner-review fixtures | generated; review-mode QA passes |
| Mobile contract | capability advertisement and picker size mapping complete |
| Database migration | none; no migration file changed or added |
| Deployment/build/public enablement | intentionally not performed |

**Pass 4 gate result:** `complete — hidden_implementation_ready`. The next
step is owner review, followed by a separate release decision.

## 13. Correction and learning ledger

| Finding | Root cause/risk | Required safeguard | Status |
| --- | --- | --- | --- |
| Mainstem coho is real but 2026 harvest is hatchery-only | Biological abundance and legal retention are different questions | Keep presence/stage biological; label opportunity hatchery-only; recheck annually | recorded |
| Winchester cannot serve Mainstem Fish Counts | Counter is above the fork on North Umpqua | Per-river/species scope isolation test; explicit unavailability | recorded |
| Elkton cannot stand for the estuary | Long legal corridor includes tidal/lower water | Exact represented-reach copy and no whole-river claim | resolved in Pass 2 |
| Temperature archive has split eras | Metadata begin/end can hide long gaps | Actual date-window/year-count extraction; no implied continuous normal | resolved in Pass 2 |
| Harvest code 102 includes river and bay and multiple season windows | Administrative reporting unit is broader than one biological run | Use only as corroborating recurrence/timing evidence | recorded |
| 2024/2025 Chinook evidence conflicts with a stable-strength narrative | Run strength and regulations vary materially year to year | Conservative 6/10 ceiling, Medium confidence, adjacent-comparator test; never use one year as baseline | resolved in Pass 3 |
| Recent Elkton temperature cannot support a seven-season scored replay | Live availability is newer than the flow record | Hydraulic-only Activity; measured temperature remains Gauge context with zero Activity/Push influence | resolved in Pass 3 |
| Daily archives cannot prove historical four-hour Push events | Daily calibration and live detection have different resolution | Use daily data only for paired thresholds; direct-event controlled series must verify four-hour onset/persistence behavior | verified in Pass 4 QA |
