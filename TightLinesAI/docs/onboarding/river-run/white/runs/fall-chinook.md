# White River Fall Chinook River Run Profile

## 0. Candidate capability audit

The 2026 DNR assessment, historic assessment, current agency observations,
biology, regulations, and king/Chinook aliases establish a strong,
self-sustaining destination run below Hesperia Dam.

**Capability decision:** `supported_public_reach_scoped` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** completed in the 2026-08-26 observed-Activity audit and 2026-08-27
Fishability reconciliation

**River ID:** `white`

**Species slug:** `chinook`

**Created / researched:** 2026-08-24

**Status:** `public_enabled_reach_scoped`

This packet uses the owner-approved White River sections and ends at the
downstream face of Hesperia Dam. Dates, curve anchors, the 7/10 ceiling, and
Fishability bands are accepted product calibrations rather than direct counts.

## 1. Species and run truth

| Field                      | Researched value                                                                                                                  | Evidence IDs        | Status                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------- |
| Public species name        | Chinook salmon                                                                                                                    | C-001, C-003        | supported                                     |
| Run type                   | Fall lake-run spawning migration through White Lake into the accessible White River                                               | C-001, C-003        | supported                                     |
| Migration purpose          | Spawning; river fish are not described as feeding fish                                                                            | C-003, C-004        | supported                                     |
| Lifecycle after spawning   | Pacific salmon die after spawning; terminal copy must not imply an overwintering Chinook experience                               | C-004               | supported                                     |
| Shared biology profile fit | Great Lakes fall Chinook biology is suitable, but White-specific dates, geography, ceiling, and copy remain local                 | C-001, C-003, C-004 | qualified                                     |
| Distribution scope         | Broad potential distribution through `Lower river`, `Forest corridor`, and `Upper accessible corridor`, always below Hesperia Dam | C-001, C-002        | supported                                     |
| Opportunity tier / ceiling | `strong_for_this_river`; proposed historical maximum **7/10**                                                                     | C-001, CAL-C-01     | owner calibration requiring replay acceptance |
| Barrier response           | Hesperia Dam has no current passage and is a hard upstream endpoint                                                               | C-001, C-002        | supported and owner-approved                  |

The 7/10 ceiling reflects the current MDNR description of a naturally
reproducing destination fishery, not the obsolete 1983 estimate and not a live
population count. The historical 1983 estimate is context only and cannot set
today's score.

## 2. Seasonal calendar

Dates are month-day values in `America/Detroit`. Direct White River enforcement
observations establish salmon presence from mid-September through late October
2025, including heavy stacking in early October. DNR's Chinook biology places
upstream migration and catchability in mid-August, so August 15 is the
conservative low-presence beginning—not merely an unscored pre-run date.

| Boundary                     | Date  | Meaning                                                                                                                | Evidence IDs           | Owner calibration? |
| ---------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------ |
| Pre-run monitoring start     | 08-01 | Begin monitoring before late-summer migration                                                                          | C-003, CAL-C-02        | yes                |
| Staging start                | 08-10 | Late-summer lake-connection context before the first modeled river presence                                            | C-003, C-004           | yes                |
| River-run start              | 08-15 | Conservative first lower-river presence based on DNR mid-August Chinook timing; not a live arrival claim               | C-003, CAL-C-02        | yes                |
| Beginning end                | 08-23 | Ends the strictly Lower-river-first phase; Forest becomes a secondary check on 08-24                                   | C-003, CAL-C-02        | yes                |
| Established building start   | 09-01 | Seasonal progression beyond sparse early entry                                                                         | C-003, CAL-C-02        | yes                |
| Broad building start         | 09-15 | Direct White enforcement observations begin supporting broader distribution                                            | C-005, CAL-C-02        | yes                |
| Peak start                   | 10-01 | White-specific report of fish stacked heavily supports an early-October peak window                                    | C-006                  | yes                |
| Peak anchor                  | 10-08 | Center of the documented 09-28 through 10-11 heavy-stacking report period                                              | C-006, CAL-C-02        | yes                |
| Peak end                     | 10-15 | Conservative transition after the direct heavy-stacking period                                                         | C-006, C-007, CAL-C-02 | yes                |
| Tapering end                 | 10-31 | Direct White River Chinook evidence continues into the 10-12 through 10-25 report period                               | C-007, CAL-C-02        | yes                |
| Main run end                 | 11-10 | Late-run calibrated boundary; not direct proof of fish absence                                                         | C-004, CAL-C-02        | yes                |
| Historical-presence tail end | 11-15 | Conservative last modeled presence day and regulation-aligned review checkpoint; regulation is not biological evidence | C-008, CAL-C-02        | yes                |
| Late-copy end                | 11-15 | Last day before terminal state                                                                                         | CAL-C-02               | yes                |

The August 1-November 15 special-lure period is a legal boundary only. It is not
used as proof that fish arrive or leave on those dates.

## 3. Migration Stage copy matrix

Stage is a seasonal expectation. It never confirms fish, access, catch rate, or
safe conditions.

| State key              | Trigger/date        | Label             | Primary section           | Conditional secondary section | Headline intent                                                      | Why This Read                                                                                                    | Guide's Read                                                                                     | Material limitation                                                        |
| ---------------------- | ------------------- | ----------------- | ------------------------- | ----------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `offseason`            | 11-16 through 07-31 | Fall run complete | none                      | none                          | The modeled fall Chinook run is complete                             | The accepted fall experience has ended                                                                           | Use current regulations and other available species experiences                                  | Do not display a zero Fish In River score or marker                        |
| `staging`              | 08-10 through 08-14 | Staging           | Lower river               | none                          | Early staging context is beginning near the lake connection          | Great Lakes Chinook can stage in late summer; river presence begins with the next checkpoint                     | Treat the Lower river as monitoring context, not confirmation                                    | White Lake is entry context outside the scored river corridor              |
| `beginning`            | 08-15 through 08-23 | Beginning         | Lower river               | none                          | The first lower-river Chinook window is opening                      | DNR biology supports mid-August upstream migration, while this early fraction remains deliberately low           | Start with the Lower river and keep expectations narrow                                          | Expectation, not observed arrival                                          |
| `building_early`       | 08-24 through 08-31 | Building          | Lower river               | Forest corridor               | The early run is progressing beyond the first Lower-river window     | Daily presence interpolation supports gradual expansion; Forest remains a secondary check                        | Prioritize Lower river, then make a measured Forest-corridor check                               | Hesperia remains the hard upstream endpoint                                |
| `building_established` | 09-01 through 09-14 | Building          | Lower river               | Forest corridor               | The run is becoming established through more dependable water        | Seasonal progression supports a wider window before direct White observations begin                              | Compare Lower and Forest water before considering the Upper accessible corridor                  | Upper accessible water remains conditional                                 |
| `building_broad`       | 09-15 through 10-07 | Building broadly  | Forest corridor           | Upper accessible corridor     | Seasonal opportunity is broadening through the accessible corridor   | Direct White observations begin in mid-September and become strongest in early October                           | Prioritize Forest corridor; treat Upper accessible corridor as conditional until the peak anchor | No passage at Hesperia Dam                                                 |
| `peak`                 | 10-08 through 10-15 | Peak window       | Forest corridor           | Upper accessible corridor     | The modeled Chinook run is near its seasonal high                    | Fish were reported stacked heavily in the White system during the anchor period; the curve is at or near maximum | Focus on Forest corridor and water below Hesperia, while respecting posted rules                 | Seasonal estimate, not a live count                                        |
| `tapering`             | 10-16 through 10-31 | Tapering          | Upper accessible corridor | Forest corridor               | The run is tapering and older fish increasingly shape the experience | Direct White evidence continues into late October, while post-spawn deterioration becomes more relevant          | Prioritize Upper accessible corridor and adjust expectations for late-run fish                   | Chinook do not create an overwintering handoff                             |
| `ending`               | 11-01 through 11-15 | Ending            | Upper accessible corridor | none                          | The modeled fall run is ending below Hesperia Dam                    | The curve declines toward its terminal boundary; lifecycle limits dominate late copy                             | Treat any remaining opportunity as localized and late-stage                                      | Do not imply healthy feeding fish or continued presence after the boundary |
| `terminal`             | from 11-16          | Fall run complete | none                      | none                          | The modeled fall Chinook experience is complete                      | The accepted calendar has ended                                                                                  | Remove score and marker; do not recommend a section                                              | Complete is not zero and has no destination handoff                        |

## 4. Fish In River profile

- Historical maximum: **7/10** (`CAL-C-01`).
- Public opportunity tier: `strong_for_this_river`.
- Distribution: broad below Hesperia; never above the dam.
- Proposed curve version: `white_chinook_presence_v2_research`.
- Direction: rising 08-15 through 10-08; near peak 10-01 through 10-15; falling
  after 10-15; terminal from 11-16.
- Terminal: `Fall run complete`, with no score and no marker.
- Handoff: none.

| Day offset from 08-15 | Date  | Fraction of maximum | Reason                                                |
| --------------------: | ----- | ------------------: | ----------------------------------------------------- |
|                     0 | 08-15 |                0.05 | Conservative mid-August first lower-river presence    |
|                     7 | 08-22 |                0.08 | Sparse early-entry progression                        |
|                    17 | 09-01 |                0.12 | Beginning-to-building transition                      |
|                    31 | 09-15 |                0.25 | Direct White salmon-run enforcement period begins     |
|                    47 | 10-01 |                0.70 | Broad building and peak-window start                  |
|                    54 | 10-08 |                1.00 | Center of White-specific heavy-stacking report period |
|                    61 | 10-15 |                0.95 | End of calibrated peak window                         |
|                    68 | 10-22 |                0.80 | Direct late-October White evidence remains available  |
|                    77 | 10-31 |                0.55 | Tapering boundary                                     |
|                    87 | 11-10 |                0.25 | Main-run ending calibration                           |
|                    92 | 11-15 |                0.05 | Final presence-tail day; terminal begins next day     |

Public values must use state-preserving five-point rounding and `≈`, and the
marker must match the copy. The value is a seasonal opportunity estimate, not a
live fish count. The last value must never render as `0`; terminal removes the
value instead.

## 5. Activity contract

> **Implementation update (2026-08-26):** The owner accepted the measured-input
> profile `white-fall-chinook-observed-activity-v3` after the fixed 2022–2025
> replay. See
> `docs/audits/river-run-white-observed-activity-audit-2026-08-26.md`.

**Mode:** `observed_river`.

- Flow/height: USGS 04122200 at Fruitvale Road in the Lower river.
- Water temperature: Trout Unlimited/Monitor My Watershed at Weaver Street,
  immediately below Hesperia Dam.
- Weather: Pines Point hourly weather context.
- Scope: the sources are complementary below-Hesperia corridor inputs, not
  co-located measurements; every Gauge Read remains labeled to its actual reach.
- Weights: 0.55 effective light, 0.20 measured temperature, 0.15 river behavior,
  and 0.10 same-block weather.
- Failure behavior: inputs are freshness-gated independently; missing measured
  river evidence cannot become a full-confidence positive read.

Activity describes conditional responsiveness for a fish already present. It
does not infer migration, abundance, catch probability, access, or safety, and
it must not generalize either sensor to the full White River.

## 6. Fishability calibration

The only accepted hydraulic record is USGS 04122200 discharge at Fruitvale Road.
For August-December daily means from 1957-2026 (`n=10,580`), research quantiles
are: minimum 162, p5 218, p10 239, p25 275, median 341, p75 440, p90 580, p95
712, p99 1,020, maximum 4,650 CFS.

| Band          | Proposed boundary | Calibration rationale          |
| ------------- | ----------------: | ------------------------------ |
| Too low       |        `<220 CFS` | Approximately below p5         |
| Low fishable  |     `220-274 CFS` | Low tail through p25           |
| Ideal         |     `275-440 CFS` | Interquartile historical range |
| High fishable |     `441-712 CFS` | Upper common range through p95 |
| Very high     |   `713-1,019 CFS` | Rare p95-p99 context           |
| Blown out     |     `>=1,020 CFS` | Approximately p99 and above    |

These are accepted Fruitvale presentation bands, not claims of local wading or
safety. The 1957-2025 replay covered 10,556 of 10,557 fall dates with zero
invariant violations and a selective 48.8% Excellent rate. Fishability uses
discharge only, follows the approved 2-hour fresh / 24-hour suppression
contract, and must show unknown trend rather than manufacture one.

Permanent public scope note:
`Presentation conditions reflect Fruitvale Road
flow, not the full White River, and are not a safety determination.`

Extreme guidance may say presentation is constrained at the Fruitvale gauge; it
must not say the river is safe, unsafe, clear, muddy, open, or closed.

## 7. Copy and replay acceptance

- [x] Every Stage state, Fish In River transition, Activity freshness/fallback
      state, and accepted Fishability band has a fixture.
- [ ] Exact boundaries test at one minute before, at, and one minute after in
      `America/Detroit`, including DST normalization.
- [ ] Curve replay proves monotonic rise/fall segments, the 7/10 cap, matching
      marker/copy, state-preserving rounding, and no zero at completion.
- [ ] Geography uses only Lower river, Forest corridor, and Upper accessible
      corridor; Hesperia Dam is the hard endpoint.
- [x] Activity tests prove independent source labeling, freshness gating, and
      the accepted below-Hesperia complementary-input scope.
- [x] Fishability replay reports daily and seasonal label distributions,
      transition counts, missing/prior-flow counts, and extreme-day samples.
- [ ] Copy contains no internal scores, thresholds, reason codes, provider IDs,
      live-arrival claims, catch probability, access promise, or safety claim.
- [ ] Foreign river, landmark, dam, gauge, and species denylist passes.
- [ ] Narrow-screen, stale, partial, and terminal visual QA passes.

## 8. Evidence ledger

| ID       | Authority / title                                                                                                                                                                       | Published / accessed              | Facts supported                                                                                         | Limitations                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| C-001    | Michigan DNR, [Lower White River Status Report 0460](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0460_2026_Lower_White_River.pdf)   | 2026 / 2026-08-24                 | Annual Chinook migration, natural reproduction, destination fishery, 33-mile corridor, Hesperia barrier | Fishery assessment, not a daily count or exact run calendar                 |
| C-002    | Michigan DNR, [White River Status Report 2012-121](https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2012-121.pdf)                               | 2012 / 2026-08-24                 | Self-sustaining Chinook and Hesperia barrier context                                                    | Older supporting source                                                     |
| C-003    | Michigan DNR, [Chinook salmon](https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon)                                                                     | current / 2026-08-24              | Late-summer upstream migration and general Great Lakes biology                                          | Statewide species timing, not a White-specific calendar                     |
| C-004    | Michigan DNR, [Salmon in the Classroom Teacher Guide](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Education/SIC/SIC-Teacher-Guide-2024.pdf)                     | 2024 / 2026-08-24                 | Late-August staging, spawning lifecycle, post-spawn mortality, non-feeding river behavior               | Educational statewide biology                                               |
| C-005    | Michigan DNR, [Conservation officer report: 09-14 to 09-27-2025](https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2025/9-14-2025-9-27-2025)                      | 2025 / 2026-08-24                 | Active White River salmon-run enforcement and attempted netting                                         | Observational enforcement report; not abundance sampling                    |
| C-006    | Michigan DNR, [Conservation officer report: 09-28 to 10-11-2025](https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2025/9-28-2025-10-11-2025)                     | 2025 / 2026-08-24                 | Salmon stacked heavily in the North Branch White River                                                  | One season and tributary observation; supports timing, not a corridor count |
| C-007    | Michigan DNR, [Conservation officer report: 10-12 to 10-25-2025](https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2025/10-12-2025-10-25-2025)                    | 2025 / 2026-08-24                 | White River king salmon enforcement evidence in late October                                            | One season; no quantitative abundance                                       |
| C-008    | Michigan DNR, [2026 Michigan Fishing Regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf) | effective 2026-04-01 / 2026-08-24 | Type 4 and Aug 1-Nov 15 special-lure regulation                                                         | Legal boundary, not biological timing                                       |
| C-009    | USGS, [White River near Whitehall, MI 04122200](https://waterdata.usgs.gov/monitoring-location/USGS-04122200/)                                                                          | live / 2026-08-24                 | Fruitvale discharge record and reach                                                                    | Provisional; does not represent the entire corridor                         |
| CAL-C-01 | Owner calibration proposal: ceiling/tier                                                                                                                                                | 2026-08-24                        | 7/10 ceiling and public tier                                                                            | Requires replay and owner acceptance                                        |
| CAL-C-02 | Owner calibration proposal: exact calendar/curve                                                                                                                                        | 2026-08-24                        | Exact boundaries and interpolated anchors                                                               | Requires replay and owner acceptance                                        |

## 9. Run gate

**Run decision:** `public_enabled_reach_scoped`

**Configuration version:** `2026-08-27-white-fishability-reconciliation.4`

**Activity rules version:** `white-fall-chinook-observed-activity-v3`

**Presence curve version:** `white-chinook-presence-v2-draft`

**Copy strategy:** `onboarding_corridor`

**Replay artifact:** `docs/audits/river-run-white-chinook-activity-replay.json`

**Owner acceptance/date:**
`public observed-input release accepted / 2026-08-26; Fruitvale Fishability
reconciled / 2026-08-27`

Public scope remains below Hesperia Dam. Fruitvale hydraulics and Weaver Street
temperature stay separately labeled, and neither may be generalized to the full
White River.
