# Pere Marquette River Run Copy Foundation

> **Accepted river research record.** Geography, sources, barriers, species
> evidence, and owner decisions remain useful. Its six-primitive implementation
> sections are historical; future onboarding follows only
> `docs/river_run_onboarding.md`.

**Status:** Copy complete and owner accepted; public release not performed
**Version:** `pere-marquette-copy-v3`
**Researched:** 2026-08-09
**Final verification and owner acceptance:** 2026-08-10
**Applies to:** Pere Marquette Fall Chinook, Fall Coho, and Fall Steelhead
**Controlling standard:** [`river_run_onboarding.md`](./river_run_onboarding.md)

## 1. Purpose

This document records the Phase 1 foundation and Phase 2 implementation for
every public River Run copy state on the Pere Marquette River. It locks the
river geography, barrier truth, live-source reach limits, species/run truth,
copy decisions, known non-copy defects, and the verified implementation result.

## 2. Executive decision lock

The Pere Marquette will use three public mainstem sections:

1. **Lower river (Pere Marquette Lake–Scottville)**
2. **Middle river (Scottville–Maple Leaf)**
3. **Upper river (Maple Leaf–M-37)**

These are orientation sections, not promises of public access, legal fishing
methods, safe wading, safe boating, or uniform conditions.

The approved public upstream orientation point is **M-37**, a recognizable
upper-river landmark. Geographically, the Middle Branch and Little South Branch
form the Pere Marquette mainstem at the Forks roughly one-half mile upstream.
That technical origin remains in the research record but is not used as a
public section endpoint. The approved downstream entry is the mainstem mouth at
the east end of Pere Marquette Lake. Pere Marquette Lake, Ludington harbor, and
Lake Michigan may be named as staging context, but they are not inland-mainstem
sections.

Barrier conclusion:

- There is **no active dam or weir on the researched Pere Marquette mainstem
  corridor** that limits Chinook, Coho, or Steelhead access between Pere
  Marquette Lake and the Forks.
- The former Custer electrical sea-lamprey barrier was operated from 2000
  through 2009 and was subsequently removed. It is not a present migration
  boundary.
- The deteriorating Baldwin River Dam is on the **Baldwin River tributary**. It
  is not a Pere Marquette mainstem dam and does not define the mainstem's upper
  accessible limit.
- A proposed seasonal sea-lamprey barrier is part of the Baldwin River
  restoration project. It is not a current mainstem structure.

Source conclusion:

- Scottville discharge directly supports **Lower river Fishability**, not a
  whole-river Fishability claim.
- Maple Leaf measured temperature is at the approved Middle/Upper orientation
  boundary. Bowman and M-37 are Upper river fallbacks.
- The Baldwin weather point is modeled upper-watershed context, not an
  observed rain gauge and not a measurement of every section.
- Push, Activity, and Migration Timing combine evidence from different PM
  reaches. Their copy must disclose that scope without pretending one reach
  was measured end to end.

## 3. River identity and corridor

| Field | Locked value |
| --- | --- |
| River ID | `pere_marquette` |
| Public name | Pere Marquette River |
| State | Michigan |
| Timezone | `America/Detroit` |
| Mouth waterbody | Pere Marquette Lake, connecting through Ludington harbor to Lake Michigan |
| Mainstem direction | West from the Forks to Pere Marquette Lake |
| Mainstem length | Approximately 67 miles |
| Drainage area | Approximately 740 square miles |
| Downstream River Run boundary | Mainstem mouth at the east end of Pere Marquette Lake |
| Public upstream orientation | M-37 |
| Researched mainstem origin | The Forks, approximately one-half mile upstream of M-37 |
| Supported runs in this pass | Fall Chinook, Fall Coho, Fall Steelhead |

Michigan DNR states that the mainstem begins at the confluence of the Middle
Branch and Little South Branch, known as the Forks, and flows west for
approximately 67 miles to Pere Marquette Lake. The 2011 DNR angler survey
examined 63.8 miles using the M-37–Gleason's, Gleason's–Rainbow Rapids,
Rainbow Rapids–Reek Road, and Reek Road–Old US-31 segments. Those scientific
and regulatory segments inform this foundation but are too granular to become
the app's everyday Stage language.

Primary geography sources:

- [Michigan DNR Natural Rivers — Pere Marquette description](https://www.michigan.gov/dnr/managing-resources/fisheries/natural-rivers)
- [Michigan DNR Pere Marquette Natural River Plan](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/NaturalRivers/Archive/Pere_Marquette_River_Plan.pdf?rev=be31e031ffd4468e9eac9f90eec6e0aa)
- [Michigan DNR 2011 Pere Marquette River Angler Survey](https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/PereMarquetteRiver-CreelReport-2011.pdf?rev=a86f900fab964df8af0b9c0ae083e99a)
- [Michigan DNR Wild and Scenic River Corridor boating-access map](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PublicLands/LandUse/PereMarquette_WandSCorr_BAS.pdf?hash=4F1D43C353C8E249D19F389D1FC74530&rev=9044aea6d0d547cb9ec1c4cb02c22e77)
- [National Wild and Scenic Rivers — Pere Marquette](https://www.rivers.gov/river/pere-marquette)

## 4. Approved public sections

### 4.1 Lake and harbor staging context

| Field | Value |
| --- | --- |
| Internal ID | `pm_lake_harbor_context` |
| Public role | Staging context; not an inland river section |
| Included orientation | Lake Michigan off Ludington, Ludington harbor, Pere Marquette Lake, mainstem mouth |
| Migration access | Yes, as the lake-to-river approach |
| Live source coverage | No accepted River Run hydraulic or water-temperature source for this staging zone |
| Copy rule | May appear only when Stage is pre-run/staging or when explicitly distinguishing nearby-water opportunity from in-river presence |

Do not let `Pere Marquette Lake` silently mean `Lower river`. The Lower river
begins where the mainstem enters the lake. Stage may say fish are staging in
the lake while Fish In River remains zero.

### 4.2 Lower river

| Field | Value |
| --- | --- |
| Internal ID | `pm_lower_mainstem` |
| Public label | `Lower river` |
| Required first-use form | `Lower river (Pere Marquette Lake–Scottville)` |
| Downstream boundary | Mainstem mouth at the east end of Pere Marquette Lake |
| Upstream boundary | Scottville Bridge / Scottville gauge area |
| Approved anchors | Pere Marquette Lake, Old US-31, Scottville |
| Migration access | Yes for all three supported species |
| Direct live coverage | USGS 04122500 Scottville discharge for the lower-mainstem hydraulic shape |
| Important limitation | The Scottville reading does not directly measure Middle or Upper river Fishability, clarity, depth, access, or local temperature |

The Lower river is the correct initial mainstem section during early entry. It
is also the only section for which the current Fishability primitive has a
directly accepted flow calibration.

### 4.3 Middle river

| Field | Value |
| --- | --- |
| Internal ID | `pm_middle_mainstem` |
| Public label | `Middle river` |
| Required first-use form | `Middle river (Scottville–Maple Leaf)` |
| Downstream boundary | Scottville Bridge / gauge area |
| Upstream boundary | Maple Leaf access and temperature station |
| Approved anchors | Scottville, Custer, Indian Bridge/Reek Road, Walhalla, Maple Leaf |
| Migration access | Yes for all three supported species |
| Direct live coverage | Maple Leaf temperature only at the upstream boundary; no accepted middle-section hydraulic gauge |
| Important limitation | Scottville flow is downstream context; Maple Leaf temperature must not be generalized to every Middle river location |

The former Custer barrier location falls inside this section. The structure is
removed, so it is an historical fact rather than a current section boundary.

### 4.4 Upper river

| Field | Value |
| --- | --- |
| Internal ID | `pm_upper_mainstem` |
| Public label | `Upper river` |
| Required first-use form | `Upper river (Maple Leaf–M-37)` |
| Downstream boundary | Maple Leaf access and temperature station |
| Public upstream boundary | M-37 |
| Approved public anchors | Maple Leaf, Bowman/60th Street, M-37 |
| Migration access | Yes for all three supported species on the researched mainstem |
| Direct live coverage | Maple Leaf primary temperature; Bowman and M-37 temperature fallbacks |
| Important limitation | No accepted Upper river flow gauge; Scottville Fishability must not be applied as a direct local Upper river measurement |

`Upper river` means the upper **mainstem** oriented from Maple Leaf to M-37. It
does not automatically include the Middle Branch, Little South Branch, Big
South Branch, Baldwin River, or any other tributary. A tributary may be named
only after separate passage, access, regulation, source, and species research.

### 4.5 Landmark wording rules

- Do not use bare `Branch`. It can be read as the Village of Branch, Branch
  Road, an access name, or a tributary.
- Do not use `toward Baldwin` as the definition of the Upper river. It is
  imprecise and risks confusing the Pere Marquette mainstem with the Baldwin
  River and Baldwin River Dam.
- Use `M-37` as the recognizable public Upper river endpoint. Keep the Forks as
  technical geography in research records, not ordinary public Stage copy.
- Use `Maple Leaf` only as an access/station orientation boundary. It is not a
  promise that the adjacent property is public or that a user may enter the
  water there.
- A report's first geographic recommendation must include the named range in
  parentheses. Later references in the same report may use only `Lower river`,
  `Middle river`, or `Upper river` when the meaning remains clear.

## 5. Dam and barrier inventory

### 5.1 Former Custer electrical sea-lamprey barrier

| Field | Finding |
| --- | --- |
| Internal ID | `pm_custer_electric_barrier_historic` |
| Names researched | Custer barrier, Custer electrical weir, Custer sea-lamprey barrier, Custer fishway |
| River | Pere Marquette mainstem |
| Section | Middle river |
| Type | Electrical weir and fishway |
| Status | Removed; not an active migration barrier |
| Operation | Great Lakes Fishery Commission operation from 2000 through 2009 |
| Historical passage | The fishway passed Rainbow Trout/Steelhead while the electric weir attempted to block adult sea lamprey; do not infer unrestricted historical Chinook or Coho passage |
| Current passage conclusion | The defunct barrier was removed; it does not set a current species upstream limit |
| Public upstream limit | No |
| Closure conclusion | No current structure-specific Custer closure was identified for River Run copy |
| Copy instruction | Omit generic `except above dams/barriers` language. Mention Custer only if historical context is directly useful |
| Confidence | Confirmed |

The 2020 USGS review says the electrical barrier and fishway operated from 2000
through 2009. The Great Lakes Fishery Trust's completed Custer Barrier Free
Fishing Access record explicitly ties the access project to removal of the
defunct sea-lamprey barrier. Older USFS management plans still describe the
weir and portage; that wording is historical and must not be treated as current
operating truth.

Sources:

- [USGS review of the Pere Marquette electric weir and fishway](https://www.usgs.gov/publications/a-review-electric-weir-and-fishway-a-great-lakes-tributary-conception-termination)
- [Great Lakes Fishery Trust — completed Custer barrier/access project](https://portal.glft.org/projects?page=6)
- [Historical Pere Marquette Comprehensive River Management Plan](https://www.rivers.gov/sites/rivers/files/documents/plans/pere-marquette-plan.pdf)

### 5.2 Baldwin River Dam

| Field | Finding |
| --- | --- |
| Internal ID | `baldwin_river_dam_tributary` |
| Names researched | Baldwin River Dam, Baldwin Dam, former fish-farm dam |
| River | Baldwin River tributary, not the Pere Marquette mainstem |
| Mainstem section relationship | Tributary enters the Upper river corridor |
| Type | Deteriorating dam/water-control complex and former fish farm |
| Status | Existing project site; removal/restoration remains in the 2025–2027 work plan |
| Passage conclusion | The current structure restricts the Baldwin River. Species-specific passage is not accepted for River Run tributary recommendations |
| Public PM upstream limit | No; it does not block the Pere Marquette mainstem |
| Copy instruction | Never call it `the Pere Marquette dam`. Do not recommend Baldwin River water in this pass |
| Confidence | Confirmed as a tributary structure; tributary passage remains outside this mainstem pass |

Michigan DNR grant records identify the Baldwin River as a significant Pere
Marquette tributary. Conservation Resource Alliance describes the current dam
and water-control structures, the selected restoration alternative, and a
planned seasonal sea-lamprey barrier. The 2025–2027 work plan still lists the
removal, lamprey barrier, and restoration project. This is precisely why PM
copy should use `M-37` rather than vague `Baldwin` geography.

Sources:

- [Michigan DNR Fisheries Habitat Grant history](https://www.michigan.gov/dnr/buy-and-apply/grants/aq-wl/fish-hab/grant-history)
- [Conservation Resource Alliance — Baldwin River Dam project](https://www.rivercare.org/project/pere-marquette-river/dam-removal-poised-to-enhance-the-pere-marquette-river/)
- [Conservation Resource Alliance 2025–2027 work plan](https://www.rivercare.org/wp-content/uploads/2026/02/2026-River-Care-Work-Plan-Map-2025-27.pdf)
- [Great Lakes Fishery Trust — Baldwin Dam design and permitting](https://portal.glft.org/projects/2065)

### 5.3 Proposed Baldwin River seasonal sea-lamprey barrier

| Field | Finding |
| --- | --- |
| Internal ID | `baldwin_river_seasonal_lamprey_barrier_proposed` |
| River | Baldwin River tributary |
| Type | Proposed seasonal barrier associated with the dam-removal design |
| Status | Planned/design and permitting; not accepted as an operating 2026 structure |
| Mainstem effect | None established |
| Copy instruction | Do not describe it as present or use it as a current PM section boundary |
| Confidence | Confirmed project proposal; future operation must be reverified |

### 5.4 Other structures reviewed

- North Cole Creek perched culverts are tributary restoration work and are not
  part of the public PM mainstem section model.
- No authoritative source reviewed for this pass identified a natural falls,
  active dam, active weir, or seasonal gate blocking the researched mainstem
  between Pere Marquette Lake and the Forks.
- No mainstem structure-specific distance closure was added. Current Michigan
  regulations and posted boundaries still control every trip.

Barrier research must be repeated before a future release if a new structure,
sea-lamprey control operation, emergency closure, or tributary recommendation
is introduced.

## 6. Live-source reach coverage

| Source | Location | Public section | Accepted use | Prohibited implication |
| --- | --- | --- | --- | --- |
| USGS 04122500 discharge | Scottville | Lower river, at its upstream orientation boundary | Primary hydraulic response; lower-mainstem Fishability; Scottville component of Push, Activity, and Timing | Whole-river Fishability, local Upper river flow, visibility, safe access, or temperature |
| USGS 04122500 gage height | Scottville | Lower river | Context only | Scored substitute for discharge or safety threshold |
| PMTU Maple Leaf, result 4939 | 43.933523, -86.077460 | Middle/Upper boundary | Primary measured-water temperature for live species response | Lower river temperature or uniform whole-river temperature |
| PMTU60-1 Bowman/60th, result 3209 | 43.884689, -85.935906 | Upper river | Labeled measured-water fallback; absolute warm/cold constraints | Positive cooling credit or silent lower/middle temperature claim |
| PMTU37-1 M-37, result 3201 | 43.857530, -85.850880 | Upper river | Validation/final fallback; historical Timing baseline temperature | Lower/middle temperature; unqualified continuity across the 2023 sensor move |
| Open-Meteo Baldwin point | 43.8619566, -85.8814513 | Upper-watershed weather context | Modeled precipitation/light/cloud precursor and Activity weather input | Observed rain gauge, whole-basin rainfall, measured river response, or section-specific water condition |

Source pages:

- [USGS 04122500 — Pere Marquette River at Scottville](https://waterdata.usgs.gov/monitoring-location/USGS-04122500/)
- [Monitor My Watershed — Maple Leaf](https://monitormywatershed.org/sites/Maple%20Leaf/)
- [Monitor My Watershed — PMTU60-1](https://monitormywatershed.org/sites/PMTU60-1/)
- [Monitor My Watershed — PMTU37-1](https://monitormywatershed.org/sites/PMTU37-1/)

### 6.1 Primitive-specific source truth

| Primitive | PM evidence scope that copy must preserve |
| --- | --- |
| Migration Stage | Fixed river/species calendar plus approved three-section distribution model; not a live observation |
| Migration Timing | Cumulative historical comparison using Scottville flow and M-37 temperature checkpoints; no exact fish location and no live proof of fish |
| Push | Measured Scottville response, prioritized Maple Leaf/Upper river measured temperature, and modeled Baldwin-area rain precursor; movement signal only |
| Fishability | Directly calibrated to Scottville discharge and the Lower river hydraulic shape; not a whole-river conclusion |
| Activity | Four-hour responsiveness model combining light/weather, measured temperature, and Scottville river behavior; fish-present condition and mixed reach scope must stay explicit |
| Fish In River | Historical seasonal presence relative to a river/species ceiling; no live source and no pool recommendation |

### 6.2 Required permanent scope notes

Phase 2 should centralize these as concise static/scope text rather than repeat
them as a `WHY THIS READ` bullet in every state:

- **Flow/Fishability:** `Based on the Lower river gauge at Scottville; Middle
  and Upper river conditions can differ.`
- **Temperature:** dynamically name `Maple Leaf`, `Bowman`, or `M-37` and say
  `Upper river fallback` whenever the primary is unavailable.
- **Weather:** `Modeled weather near Baldwin; rain is a precursor, not a
  measured river response.`
- **Stage:** `Seasonal expectation—not confirmation that fish are present.`
- **Activity:** `Responsiveness if fish are present—not abundance or catch
  probability.`
- **Fish In River:** `Seasonal estimate—not a live fish count or today's
  conditions.`

## 7. Current regulations and access scope

The 2026 Michigan Fishing Regulations are in effect through March 31, 2027 and
divide the Pere Marquette into multiple legal reaches. The digest includes,
among other PM segments:

- M-37 to Gleason's Landing.
- Gleason's Landing to Rainbow Rapids.
- Rainbow Rapids to Reek Road/Indian Bridge.
- Reek Road/Indian Bridge downstream toward Old US-31.

Water type, possession limits, and special artificial-lure rules vary by
segment. Several relevant reaches carry August 1–November 15 special
artificial-lure provisions, and the current digest includes a one-Rainbow-Trout
limit on identified reaches. River Run section names deliberately do not
replace these legal boundaries.

Phase 2 rules:

- Do not say a public section is uniformly open to one method.
- Do not imply that a named bridge or access guarantees public entry.
- Do not publish a structure-distance closure that was not verified.
- Keep a short current-regulations reminder outside state-specific biological
  bullets.
- Reverify the digest and Fisheries Order immediately before release.

Sources:

- [Michigan DNR 2026 Fishing Regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf?rev=b8a345e6033d4f5e9ddfc8610dec6e1d)
- [Michigan DNR current fishing-regulations page](https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations)
- [Michigan DNR Fisheries Orders](https://www.michigan.gov/dnr/managing-resources/laws/orders/fisheries-orders)

## 8. Species and run truth profiles

### 8.1 Shared biological facts

- Chinook and Coho are fall spawning Pacific salmon. Adults die after spawning,
  so late-run Activity and Stage may appropriately describe biological
  deterioration without claiming every remaining fish is unresponsive.
- Steelhead are migratory Rainbow Trout. Fall entrants may overwinter, spawn in
  spring, survive spawning, and return in later years. Steelhead copy must not
  borrow terminal-salmon mortality language.
- Michigan DNR's PM survey says adult Chinook and Coho migrate primarily from
  August through November, with Coho generally later and much less abundant.
- The same survey says adult Rainbow Trout/Steelhead migrate primarily from
  October through May.
- The 2011 survey ended September 30. It is useful for corridor, habitat, and
  early-fall catch context but cannot directly validate a complete October,
  November, or December abundance curve.

### 8.2 Fall Chinook

| Field | Accepted PM determination |
| --- | --- |
| Run type | Fall spawning migration |
| Seasonal strength | Strong/signature PM opportunity |
| Fish In River ceiling | 100/100 internal public ceiling |
| Distribution scope | Broad at the established/peak part of the run, not uniform |
| Pre-run watch | July 1 |
| Nearby-water staging context | July 28 |
| River-entry start | August 15 |
| Beginning | August 15–23 |
| Building | August 24–September 19; established context September 1; broad context September 10 |
| Peak state actually rendered | September 20–30 |
| Tapering | October 1–18 |
| Ending | October 19–27 |
| Presence tail | Declines to zero November 8 |
| Late post-run wording | Through November 10 |

Evidence lock:

- Michigan DNR says Chinook begin upstream migration in late summer and are
  usually present in catchable numbers by mid-August.
- The PM survey confirms Chinook as the dominant surveyed migratory salmon and
  places adult salmon migration mainly in August–November.
- The exact PM curve, peak reference, and stage transitions remain accepted
  product calibration, not measured daily abundance.
- Current Stage code renders Peak beginning on the configured `peak` date,
  September 20, because the PM Chinook run has a broad-building transition.
  Copy and review fixtures must use the actual rendered state, not assume
  `peakStart` September 15 is the public Peak boundary.

Phase 2 geographic intent:

- Beginning: Lower river.
- Early Building: Lower first, Middle secondary.
- Established Building: Middle first, Upper secondary.
- Broad Building and Peak: compare all three sections without claiming equal
  numbers everywhere.
- Tapering/Ending: established Middle and Upper holding water; Lower becomes a
  conditional check only when Push supports a genuinely fresh movement signal.

### 8.3 Fall Coho

| Field | Accepted PM determination |
| --- | --- |
| Run type | Fall spawning migration |
| Seasonal strength | Moderate and materially smaller than PM Chinook |
| Fish In River ceiling | 60/100 |
| Distribution scope | Can become broad, but concentrations remain less dependable than Chinook |
| Pre-run watch | August 15 |
| Nearby-water staging context | August 25 |
| River-entry start | September 1 |
| Beginning | September 1–20 |
| Building | September 21–October 9; established context October 1 |
| Peak | October 10–November 5, around an October 20 reference |
| Tapering | November 6–20 |
| Ending | November 21–30 |
| Presence tail | Sparse owner-calibrated tail declining to zero December 31 |
| Late post-run wording | January 1–2 |

Evidence lock:

- Michigan DNR says Coho spawning runs vary by tributary from early September
  through November and that Coho typically migrate later than other salmon.
- The PM survey specifically says Coho arrive later than Chinook and at much
  lower abundance.
- The PM September–November window and 60/100 ceiling are accepted relative
  product determinations.
- The December tail is **not** validated by a PM abundance survey. It is an
  owner-calibrated local hypothesis informed by PM experience and later Great
  Lakes exceptions. Copy must call it sparse/residual and must not convert it
  into a broad, dependable December PM opportunity.

Phase 2 geographic intent follows the same section progression as Chinook but
with lower certainty and narrower language. `Broad` means plausible across
multiple sections, not common in every section or every good-looking hole.

### 8.4 Fall Steelhead

| Field | Accepted PM determination |
| --- | --- |
| Run type | Fall entry and pre-spawn overwintering, not fall spawning |
| Seasonal strength | Strong PM opportunity |
| Fish In River ceiling | 80/100 |
| Distribution scope | Broad after the run becomes established |
| Pre-run watch | August 15 |
| Condition/staging tracking | September 1 |
| River-entry start | September 20 |
| Beginning | September 20–October 10 |
| Building | October 11–November 14; established October 15; broad November 1 |
| Peak | November 15–December 4 |
| Late fall | December 5–19 |
| Holding transition | December 20–22 |
| Accepted end-of-fall reference | 70/100 on December 22 |
| Configured handoff | December 23 |

Evidence lock:

- Michigan DNR says many Steelhead enter tributaries in fall, overwinter, and
  spawn in spring; the general entry window runs from late October to early
  May.
- The PM's September 20 start represents occasional accepted local early entry
  and must not be written as broadly dependable September abundance.
- PM telemetry supports water temperature as the dominant movement correlate;
  flow did not materially improve the cited movement model. The accepted
  approximately 39°F transition therefore caps active fall-entry confidence
  without saying fish left the river.
- The end-of-fall 70/100 reference is a retained-presence handoff, not a live
  winter Activity score.

Primary species sources:

- [Michigan DNR Chinook profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon)
- [Michigan DNR Coho profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon)
- [Michigan DNR Steelhead profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)
- [Workman et al. — Steelhead movement and water temperature](https://academic.oup.com/tafs/article-pdf/131/3/463/61133607/tafs0463.pdf)
- [Michigan DNR 2011 Pere Marquette River Angler Survey](https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/PereMarquetteRiver-CreelReport-2011.pdf?rev=a86f900fab964df8af0b9c0ae083e99a)

## 9. Current copy audit findings carried into Phase 2

### 9.1 Migration Stage

1. Current PM `Where to Start` text is too long and repeatedly lists several
   municipalities, bridges, habitat types, and conditional actions.
2. `Scottville through Walhalla and Branch toward Baldwin/M-37` is not a stable
   section model. `Branch` and `Baldwin` are ambiguous.
3. `Upper river toward Baldwin` risks conflating the mainstem with the Baldwin
   River tributary and its dam.
4. Some headlines use calendar certainty as if live presence were confirmed.
5. Stage sometimes tells users to compare almost the entire river rather than
   naming one primary section and one conditional secondary section.
6. Generic barrier filler is unnecessary and wrong for the current PM
   mainstem.

Required solution: every state must use the three locked public sections,
expectation language, one primary section, and at most one conditional
secondary section.

### 9.2 Migration Timing

1. Copy can sound like it measures fish timing directly; it actually compares
   cumulative Scottville flow and M-37 temperature history.
2. Some guides repeat Migration Stage geography instead of explaining early,
   typical, or delayed seasonal development.
3. Missing or incomplete evidence needs a clear neutral state rather than
   implied certainty.
4. Review fixture names and intended labels do not always match the actual
   rendered determination, including Typical/Delayed and reversal scenarios.

Required solution: explain the historical pace call in no more than three
points, keep location in Stage, and make generated fixture labels assert the
actual production state.

### 9.3 Push

1. Several explanations contain too many clauses about rain, flow, trend,
   temperature, confidence, and fishability.
2. Rain precursor language is repeated even when Scottville has already shown
   the measured response.
3. The mixed reach scope is easy to miss: Scottville flow and Maple/Upper river
   temperature are not one local observation.
4. Guidance sometimes drifts into section selection owned by Stage.

Required solution: one movement conclusion, one main driver, and one limiting
factor. Push may say whether lower travel lanes deserve extra attention, but
Stage remains the location owner.

### 9.4 Fishability

1. The current score is calibrated to Scottville but much of the copy reads as
   if it describes the entire PM.
2. Low, very high, and blown-out guidance can be overly tactical and can imply
   a safe alternative location.
3. Copy sometimes mixes presentation difficulty with abundance or movement.
4. Permanent gauge limitations consume state explanation space.

Required solution: label the conclusion `Lower river at Scottville`, move the
source limitation to a stable scope note, and keep extreme states
non-prescriptive about entry, wading, or boating.

### 9.5 Activity

1. Current details often contain five or six sentence-like points where the
   model permits no more than three `WHY THIS READ` bullets.
2. Bullet-equivalent sentences are long and combine unrelated claims.
3. Missing-weather or tied-window states can still default to 5–9 AM, call it
   strongest, or mention a forecast that did not distinguish the blocks.
4. Inactive states still say `Start with 5–9 AM`, which overstates a weak
   result.
5. Staging caveats can be buried below an assertive Activity label.
6. Steelhead late copy references a Winter Holding read that is not
   implemented.
7. Activity scope combines light/weather near Baldwin, Maple/Upper river
   temperature, and Scottville flow; `the river` can overstate local coverage.

Required solution: three points maximum—responsiveness, strongest block or no
clear block, and the material limitation. `Inactive` must say no block is
broadly favorable. Missing inputs cannot create specificity.

### 9.6 Fish In River

1. Exact integers imply more precision than a historical seasonal curve can
   support.
2. Some copy can turn `broad distribution` into `fish are broadly present`
   even when the current score is Low or falling.
3. Coho late-tail copy can overstate the weak December evidence.
4. Fish In River sometimes provides location guidance owned by Stage.
5. Steelhead's retained handoff is displayed as a continuing current 70/100
   winter state rather than an end-of-fall reference.

Required solution: display approximate five-point increments, preserve the raw
internal value, keep the rounded value in its determined state band, and remove
pool/section prescriptions.

### 9.7 Cross-cutting defects

- Repeated filler phrases and disclaimers make key determinations harder to
  scan.
- Some sentences are grammatically awkward, including singular/plural
  agreement in low-presence Chinook copy.
- State names, fixture names, reason codes, and rendered labels can disagree.
- Older PM audit material describes five primitives and is stale; River Run
  now has six.
- The existing PM review corpus currently shows no known foreign-river name
  leakage, but Phase 2 must add a denylist for all other rivers, dams, gauges,
  and landmarks.
- Permanent scope facts are repeated in state prose instead of being rendered
  once in a concise primitive note.

## 10. Separate scoring and capability defects

These are not ordinary copy edits and must not be hidden by rewriting words.

### 10.1 Fall Steelhead handoff exceeds the available feature

Observed production behavior:

- December 23 enters `Winter holding` at 70/100.
- The fall profile can continue to show the same 70/100 winter-holding result
  into the following spring; an April 15 check still rendered Winter holding.
- Stage and Fish In River tell the user to open a dedicated Winter Holding read.
- No such public PM winter experience exists.

Why this is wrong:

- A retained end-of-fall reference is not a validated current winter or spring
  presence score.
- By spring, Steelhead behavior has shifted from winter holding toward active
  spawning migration; a frozen fall value cannot represent that phase.
- Copy cannot repair a missing destination capability.

Recommended Phase 2 product fix:

1. Preserve 70/100 as the accepted **December 22 end-of-fall reference**.
2. On and after December 23, render `Fall entry complete` rather than a current
   numeric Fish In River score until a researched winter/spring experience
   exists.
3. Say `Steelhead may remain in the river; this fall model no longer scores
   their current presence or activity.`
4. Remove every instruction to open a Winter Holding read.
5. Add an explicit handoff capability gate so a destination may be named only
   when that run is implemented and enabled.

This changes post-window behavior, so it requires an explicit product change
rather than a silent copy substitution.

### 10.2 Review fixtures must be state-derived

Some PM review scenarios have human-authored intended labels that do not match
the state actually returned by production scoring. Phase 2 must derive or
assert the actual label/state before presenting a fixture for copy review.
Copy should never be changed to match a mislabeled fixture.

### 10.3 Fish In River display precision

The engine's raw curve remains valid. Only public display precision changes:

- Preserve raw integer/fraction values for calculations and tests.
- Publicly quantize to the nearest state-preserving five points.
- Prefix with `≈`.
- Never round across a Low/Limited/Moderate/High/Peak state boundary.
- Keep zero and the configured ceiling exact.

This is the recommended answer to the proposed nearest-0.5 idea: **yes**. On
the current 0–100 UI, a 0.5 step on the original 0–10 scale is a five-point
step. It is materially more honest than displaying arbitrary integers while
remaining useful to users.

## 11. Locked copy decisions for Phase 2

1. Use exactly three public mainstem sections.
2. Use the parenthetical named range on first geographic recommendation.
3. Never use bare `upper`, `middle`, `lower`, `Branch`, or `Baldwin` as PM
   section definitions.
4. Do not add dam/barrier filler to PM mainstem copy.
5. Stage owns the starting section. Other primitives may change effort or
   interpretation, not independently relocate the user.
6. `Where to Start` gets one primary section and at most one conditional
   secondary section, targeted to 30 words or fewer.
7. `WHY THIS READ` gets one to three complete bullets, targeted to 20 words
   each and capped at 26.
8. Permanent source limitations belong in a stable scope note, not every
   state's bullet list.
9. Seasonal calendar copy uses `expected`, `typically`, `can`, or `may`; it
   does not claim live fish were observed.
10. Fish In River uses approximate five-point display increments while
    preserving internal raw values.
11. Missing weather or tied blocks produce `No clear strongest window`, not a
    default 5–9 AM recommendation.
12. Inactive Activity does not tell users to start in a named block.
13. Coho December copy must say sparse/residual and owner-calibrated.
14. Steelhead copy never uses salmon death/deterioration logic.
15. No primitive may name an unimplemented winter feature.
16. Add PM foreign-geography denylist tests.
17. All copy versions advance together for the bundled PM pass.

## 12. Phase 2 implementation attack plan

Phase 2 remains one bundled implementation for all three PM species and all
six primitives.

### Workstream A — shared PM geography and structure

- Add stable section identifiers to the Stage copy strategy.
- Replace the existing free-form PM landmark chains with section-plan data.
- Add concise stable source/scope notes.
- Add public Fish In River quantization without changing raw scoring.
- Add capability-aware destination/handoff rendering.

### Workstream B — all reachable copy states

Rewrite in this internal order while shipping as one pass:

1. Migration Stage for Chinook, Coho, and Steelhead.
2. Fish In River because its strength/direction must agree with Stage.
3. Migration Timing and Push.
4. Fishability with strict Scottville/Lower river scope.
5. Activity, including today/tomorrow, confidence, lifecycle, missing-data,
   tied-window, staging, and extreme-condition variants.

Every state must preserve its existing determination unless it is explicitly
listed in Section 10 as a scoring/capability correction.

### Workstream C — generated review and automated gates

- Regenerate production-derived PM review fixtures.
- Assert intended state equals rendered state.
- Assert no `WHY THIS READ` has more than three points.
- Enforce bullet and `Where to Start` length limits.
- Enforce first-use section ranges and prohibit naked geography.
- Denylist all foreign river names, dams, gauges, and landmarks.
- Assert Fishability names Scottville/Lower river scope.
- Assert missing inputs cannot name a strongest time block.
- Assert no unavailable Winter Holding link or instruction exists.
- Assert approximate Fish In River rounding preserves the determined band.
- Run the full River Run engine, endpoint, UI, and review-mode suites.

## 13. Phase 3 acceptance focus

Owner review should be one consolidated gallery/device pass covering:

- All three species side by side.
- Every Stage transition and section recommendation.
- Every Fish In River state and direction.
- Timing Ahead/Typical/Delayed/Unavailable states.
- Push strength, warmth, cold-holding, extreme flow, and missing-input states.
- Every Fishability band with Scottville scope visible.
- Activity today/tomorrow, all confidence levels, all five labels, ties,
  missing weather, missing temperature, and lifecycle transitions.
- Coho's weak December tail.
- Steelhead's end-of-fall completion behavior.

One consolidated correction pass should follow, then the complete automated
suite, final audit, owner acceptance, and separately authorized release.

## 14. Phase 1 gate result

| Gate | Result |
| --- | --- |
| Existing PM code, copy, fixtures, and audits inspected | Pass |
| Mainstem geography researched and section model locked | Pass |
| Active, historic, removed, tributary, and proposed barriers recorded | Pass |
| Current mainstem upstream access boundary explicit | Pass |
| Gauge, temperature, and weather reach scope explicit | Pass |
| Chinook, Coho, and Steelhead truth profiles verified together | Pass |
| Owner-calibrated assumptions identified | Pass |
| Copy defects separated from scoring/capability defects | Pass |
| Public numeric precision decision recorded | Pass |
| Phase 2 bundled implementation plan ready | Pass |

Phase 1 is complete. Production state copy should not be renovated from older
PM wording or audit files; it should be rebuilt from this foundation and the
River Run Copy Model.

## 15. Phase 2 implementation and verification result

Phase 2 is implemented for PM Fall Chinook, Fall Coho, and Fall Steelhead
across all six primitives under copy version `river-run-copy-v29`.

Implemented decisions:

- Migration Stage uses only the three locked PM sections and supplies the
  named range in `Where to Start` whenever it recommends a section.
- `Where to Start` remains exclusive to Migration Stage, with one primary and
  at most one conditional secondary section.
- Migration Timing explains cumulative Scottville river-rise and M-37 cooling
  evidence, while section changes remain bounded by the locked PM corridor.
- Push uses no more than three source-accurate reasons and states that it is
  support for movement, not proof of new arrivals.
- Fishability explicitly applies the Scottville reading to the Lower river
  (Pere Marquette Lake–Scottville), not the full PM, and does not imply safety.
- Activity is conditional on fish being present, names a strongest block only
  when the inputs materially separate one, names both leading blocks when they
  are effectively tied, and gives no favorable starting block in an Inactive
  state.
- Fish In River preserves the raw engine score while displaying a
  state-preserving five-point estimate with `≈` for intermediate values. The
  visible meter uses the same public value.
- Chinook returns to monitoring in late July, Coho in late August, and
  Steelhead in early September. Copy says when tracking resumes and does not
  imply a regulatory fishing-season opening.
- PM Steelhead keeps the December 22 fall estimate, then renders `Fall entry
  complete` from December 23 with no current presence score, Activity score,
  winter link, or winter claim. Steelhead may remain in the river.
- Terminal fall states render no meter marker and use `COMPLETE` on the compact
  tab rail.
- Public PM copy no longer exposes `curve`, `modeled`, thresholds, reason-code
  machinery, foreign geography, or an unavailable seasonal feature.

Production-derived review coverage:

| Species | Scenarios |
| --- | ---: |
| Fall Chinook | 121 |
| Fall Coho | 120 |
| Fall Steelhead | 118 |
| **Total** | **359** |

The PM-specific audit covered 1,843 primitive renders and 206 unique primitive
copy states. It passed headline, guide, Why-point, geography, foreign-river,
source-scope, lifecycle, terminal-state, and state-preserving rounding gates.

Verification completed on 2026-08-10:

- River Run engine tests: 282 passed, 0 failed.
- PM production fixture checks: 121 Chinook, 120 Coho, and 118 Steelhead
  scenarios matched production output.
- PM copy QA: 359 scenarios, 1,843 primitive renders, 206 unique copy states;
  passed.
- River Run UI QA: passed.
- River Run visual QA: 85 generated primitive states; passed.

Phase 2 verification was followed by the Phase 3 owner audit and corrections
recorded below. Public release remains a separate action and was not performed.

## 16. Phase 3 owner-audit corrections

Corrections accepted during the 2026-08-10 owner audit:

- Replaced the technically correct but unfamiliar public endpoint `the Forks`
  with the recognizable `M-37`. Public Upper river copy is now `Upper river
  (Maple Leaf–M-37)`. The Forks remain only in the research record as the
  mainstem's geographic origin roughly one-half mile upstream.
- Corrected Activity near-tie wording. When the two leading blocks are within
  the accepted three-point separation tolerance, copy now names both leaders
  and states that neither has a clear advantage. Missing-weather copy remains
  separate and names no leader.
- Removed the season-request card from the setup wizard because additional
  seasons are already planned. State, species, and river requests remain.
- Added a mandatory owner-approval gate for all future public river-section
  definitions before state copy implementation begins.

## 17. PM completion record

The product owner accepted the corrected PM copy on 2026-08-10 and declined a
second full gallery pass. Pere Marquette copy is complete for all six
primitives, all three supported fall species, and the production-derived state
matrix documented above.

Final state:

- Copy version: `river-run-copy-v29`.
- River foundation version: `pere-marquette-foundation-v2`.
- Owner acceptance: 2026-08-10.
- Public release/deployment: not performed.
- Next river: Betsie, beginning with a new Phase 1 foundation review and
  explicit owner approval of its public section definitions before copy work.

Future agents must not reopen PM research or rewrite PM copy from older fixture
language unless the product owner requests a new PM change, source capability
changes, or time-sensitive geography/barrier/regulation evidence changes.
