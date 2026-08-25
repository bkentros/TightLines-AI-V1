# White River Fall Steelhead River Run Profile

## 0. Candidate capability audit

The 2026 DNR assessment, stocking history, current species biology, historic
assessment, regulations, and rainbow/Steelhead aliases establish a recurring,
extremely popular destination fishery and substantial fall entry.

**Capability decision:** `supported_hidden_review` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** required before public enablement

**River ID:** `white`

**Species slug:** `steelhead`

**Created / researched:** 2026-08-24

**Status:** `phase_c_research_complete_replay_blocked`

This is a fall-entry experience, not a complete annual Steelhead-presence model.
It uses the owner-approved corridor and stops at the downstream face of Hesperia
Dam. Exact dates, curve anchors, the 7/10 ceiling, and Fishability bands are
owner-calibrated proposals requiring replay and owner acceptance.

## 1. Species and run truth

| Field                      | Researched value                                                                                                          | Evidence IDs    | Status                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------- |
| Public species name        | Steelhead                                                                                                                 | S-001, S-002    | supported                                     |
| Run type                   | Fall entry from White Lake/Lake Michigan into the accessible White River; some fish overwinter before spring spawning     | S-001, S-002    | supported                                     |
| Migration purpose          | Spawning migration, with substantial fall entry and winter holding before spring spawning                                 | S-002           | supported                                     |
| Lifecycle after spawning   | Steelhead can survive spawning and may spawn more than once; salmon mortality copy is prohibited                          | S-002           | supported                                     |
| Shared biology profile fit | Great Lakes fall-entry Steelhead biology is suitable, but White-specific dates, ceiling, geography, and copy remain local | S-001, S-002    | qualified                                     |
| Distribution scope         | Broad below-dam potential through Lower river, Forest corridor, and Upper accessible corridor                             | S-001, S-003    | supported                                     |
| Opportunity tier / ceiling | `strong_for_this_river`; proposed fall-entry maximum **7/10**                                                             | S-001, CAL-S-01 | owner calibration requiring replay acceptance |
| Barrier response           | No current passage at Hesperia Dam; it is the hard upstream endpoint                                                      | S-001, S-003    | supported and owner-approved                  |

The proposed ceiling reflects MDNR's current description of an extremely popular
destination fishery supported by stocked and naturally reproduced fish. It does
not claim a live count or convert stocking numbers directly into score.

## 2. Seasonal calendar

Dates are month-day values in `America/Detroit`. MDNR states that Great Lakes
Steelhead enter streams from late October through early May and that many enter
in fall and remain through winter. No White-specific daily run count was found,
so every exact boundary is calibration rather than a claimed observation.

| Boundary                     | Date  | Meaning                                                                 | Evidence IDs           | Owner calibration? |
| ---------------------------- | ----- | ----------------------------------------------------------------------- | ---------------------- | ------------------ |
| Pre-run monitoring start     | 09-15 | Early monitoring context; no dependable entry claim                     | S-002, CAL-S-02        | yes                |
| Staging start                | 10-01 | Lake-mouth staging context before the general late-October entry window | S-002, CAL-S-02        | yes                |
| River-run start              | 10-20 | Opens the fall-entry curve near the statewide late-October boundary     | S-002, CAL-S-02        | yes                |
| Beginning end                | 10-31 | Ends the modeled opening phase                                          | S-002, CAL-S-02        | yes                |
| Established building start   | 11-01 | Begins established fall entry                                           | S-002, CAL-S-02        | yes                |
| Broad building start         | 11-15 | Broadens expected below-dam distribution                                | S-001, S-002, CAL-S-02 | yes                |
| Peak start                   | 11-20 | Opens the calibrated late-fall high window                              | S-002, CAL-S-02        | yes                |
| Peak anchor                  | 11-25 | Proposed center of late-fall entry experience                           | S-002, CAL-S-02        | yes                |
| Peak end                     | 12-10 | Ends modeled peak entry; does not mean fish leave                       | S-002, CAL-S-02        | yes                |
| Tapering end                 | 12-20 | Entry rate tapers while holding fish may remain                         | S-002, CAL-S-02        | yes                |
| Main run end                 | 12-28 | Ends main fall-entry curve                                              | S-002, CAL-S-02        | yes                |
| Historical-presence tail end | 12-30 | Last modeled fall-entry presence day                                    | S-002, CAL-S-02        | yes                |
| Late-copy end                | 12-31 | Terminal transition follows; no winter handoff is implemented           | CAL-S-02               | yes                |

## 3. Migration Stage copy matrix

Stage describes expected seasonal entry, never verified fish, catch likelihood,
access, or safety.

| State key        | Trigger/date        | Label               | Primary section           | Conditional secondary section | Headline intent                                                 | Why This Read                                                                                        | Guide's Read                                                        | Material limitation                                                 |
| ---------------- | ------------------- | ------------------- | ------------------------- | ----------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `offseason`      | 01-01 through 09-14 | Fall entry complete | none                      | none                          | The modeled fall-entry experience is complete                   | This packet does not model winter holding, spring spawning, or summer conditions                     | Use another accepted experience if available                        | Do not imply Steelhead have left the river                          |
| `pre_run`        | 09-15 through 09-30 | Monitoring          | Lower river               | none                          | Fall-entry monitoring has begun                                 | General Steelhead timing does not support dependable White River entry yet                           | Treat the Lower river as monitoring context only                    | White Lake is outside the scored corridor                           |
| `staging`        | 10-01 through 10-19 | Staging             | Lower river               | none                          | Seasonal staging context is developing near the lake connection | Late October is the general start of stream entry; this earlier period is intentionally conservative | Watch Lower river context without claiming arrival                  | Seasonal expectation only                                           |
| `beginning`      | 10-20 through 10-31 | Beginning           | Lower river               | Forest corridor               | The modeled fall entry is beginning in the Lower river          | The calendar has reached the supported late-October entry window                                     | Prioritize Lower river; expand upstream only as the window develops | No live arrival claim                                               |
| `building_early` | 11-01 through 11-14 | Building            | Lower river               | Forest corridor               | Fall entry is building through the lower corridor               | Many Great Lakes Steelhead enter streams in fall; White is a current destination fishery             | Start Lower river and add Forest corridor context                   | Distribution is modeled, not tracked fish                           |
| `building_broad` | 11-15 through 11-19 | Building broadly    | Forest corridor           | Upper accessible corridor     | The fall-entry window is broadening below Hesperia              | The curve is approaching its calibrated high and the accessible corridor is connected below the dam  | Prioritize Forest corridor, then Upper accessible corridor          | Hesperia Dam is the hard endpoint                                   |
| `peak`           | 11-20 through 12-10 | Peak entry window   | Forest corridor           | Upper accessible corridor     | The modeled fall entry is near its seasonal high                | The curve is at its accepted high-window proposal; fish may continue to move or hold                 | Focus on Forest corridor and below-dam water                        | A peak entry score is not a live abundance count                    |
| `tapering`       | 12-11 through 12-20 | Tapering entry      | Upper accessible corridor | Forest corridor               | New fall entry is tapering while holding fish may remain        | Steelhead can overwinter; falling entry does not equal falling total presence                        | Prioritize holding-water context below Hesperia                     | Do not use salmon mortality language                                |
| `ending`         | 12-21 through 12-31 | Fall entry ending   | Upper accessible corridor | none                          | The modeled fall-entry window is ending                         | The product calendar is ending, though Steelhead may remain through winter                           | Treat the read as the end of entry, not the end of fish presence    | No winter experience or handoff is implemented                      |
| `terminal`       | from 01-01          | Fall entry complete | none                      | none                          | The modeled fall-entry experience is complete                   | Winter holding and spring spawning are outside this packet                                           | Remove score and marker                                             | Complete is not zero; do not claim fish departed or became inactive |

## 4. Fish In River profile

- Historical maximum: **7/10** (`CAL-S-01`).
- Public opportunity tier: `strong_for_this_river`.
- Distribution: broad below Hesperia; never above the dam.
- Proposed curve version: `white_steelhead_fall_entry_v1_research`.
- Direction: rising 10-20 through 11-25; high/near-flat through 12-10; gently
  falling through 12-31.
- Terminal: `Fall entry complete`, no score and no marker from 01-01.
- Handoff: none. Winter fish may remain, but no accepted winter destination
  experience exists.

| Day offset from 10-20 | Date  | Fraction of maximum | Reason                                             |
| --------------------: | ----- | ------------------: | -------------------------------------------------- |
|                     0 | 10-20 |                0.05 | Calibrated opening near general late-October entry |
|                     7 | 10-27 |                0.12 | Early entry progression                            |
|                    12 | 11-01 |                0.22 | Established building boundary                      |
|                    22 | 11-11 |                0.40 | Continued fall-entry build                         |
|                    26 | 11-15 |                0.55 | Broad building boundary                            |
|                    31 | 11-20 |                0.75 | Peak-window start                                  |
|                    36 | 11-25 |                1.00 | Calibrated peak anchor                             |
|                    51 | 12-10 |                0.95 | End of high entry window                           |
|                    61 | 12-20 |                0.88 | Tapering entry, with holding fish possible         |
|                    69 | 12-28 |                0.82 | Main fall-entry end                                |
|                    72 | 12-31 |                0.78 | Final fall-entry copy day; not fish absence        |

The terminal intentionally does not drive the curve to zero. Public values use
state-preserving five-point rounding and `≈`; copy and marker must agree. This
is a seasonal fall-entry opportunity estimate, never a live fish count.

## 5. Activity contract

> **Implementation update (2026-08-24):** The split-reach unavailable contract
> below remains the correct rejection of an observed-river composite, but its
> rejection of weather-only mode is superseded. The current hidden candidate is
> `white-fall-steelhead-weather-activity-v1-draft`: 0.70 effective light / 0.30
> same-block precipitation, a 0.80 missing-primary-evidence scale, Limited
> confidence, no salmon mortality logic, below-Hesperia Pines Point weather
> scope, and no Fruitvale/Weaver scoring inputs. See
> `docs/audits/river-run-grand-platte-white-activity-calibration-2026-08-24.md`.

**Mode:** `unavailable_split_reach`.

- Flow/height: USGS 04122200 at Fruitvale Road in the Lower river.
- Water temperature: Trout Unlimited/Monitor My Watershed at Weaver Street,
  immediately below Hesperia Dam in the Upper accessible corridor.
- Weather: NWS point at Pines Point, context only.
- Decision: no observed Activity score may combine measurements from these two
  reaches. Weather-only fallback is not accepted.
- Component weights, lifecycle temperature rules, flow response, and Activity
  caps: **not applicable while unavailable**.

Public headline:
`Activity is unavailable because flow and water temperature
come from different White River reaches.`

Why This Read:
`Fruitvale Road flow and water temperature below Hesperia Dam
remain useful as separately labeled Gauge Read measurements, but they do not
describe one shared reach.`

Guide's Read:
`Use each Gauge Read only for its named reach; do not infer a
combined river response.`

Fixtures must prove the unavailable state across fresh, partial, delayed, stale,
and missing combinations, with no score, label, time block, fallback, or hidden
cross-reach blend. Any future conservative model requires an explicit owner
decision, coherent claim scope, predeclared multi-year replay, coverage and
missingness counts, lifecycle and isolated-variable tests, distribution review,
and new copy acceptance.

## 6. Fishability proposal

Fishability can use only USGS 04122200 discharge at Fruitvale Road. August-
December daily means for 1957-2026 (`n=10,580`) have minimum 162, p5 218, p10
239, p25 275, median 341, p75 440, p90 580, p95 712, p99 1,020, and maximum
4,650 CFS.

| Band          | Proposed boundary | Calibration rationale                |
| ------------- | ----------------: | ------------------------------------ |
| Too low       |        `<220 CFS` | Approximately below p5               |
| Low fishable  |     `220-274 CFS` | Low tail through p25                 |
| Ideal         |     `275-439 CFS` | Interquartile historical range       |
| High fishable |     `440-709 CFS` | Upper common range through about p95 |
| Very high     |   `710-1,019 CFS` | Rare high-flow context               |
| Blown out     |     `>=1,020 CFS` | Approximately p99 and above          |

These bands are replay inputs, not accepted local-usability or safety claims.
Fishability remains blocked until historical replay and owner review. It uses
the approved 2-hour fresh / 24-hour suppression contract and preserves unknown
trend when no acceptable prior observation exists.

Permanent public scope note:
`Presentation conditions reflect Fruitvale Road
flow, not the full White River, and are not a safety determination.`

## 7. Copy and replay acceptance

- [ ] Every Stage state, curve transition, Activity unavailable data state, and
      proposed Fishability band has a fixture.
- [ ] Boundary fixtures run one minute before, at, and after each timestamp in
      `America/Detroit`, including year rollover and DST normalization.
- [ ] Curve replay proves the 7/10 cap, monotonic rise, accepted high window,
      gentle fall, matching marker/copy, and no zero at terminal.
- [ ] Terminal copy says fall entry is complete without claiming fish absence,
      inactivity, mortality, or a winter handoff.
- [ ] All geography remains below Hesperia and uses only approved labels.
- [ ] Activity tests prove no cross-reach blend and no weather-only fallback.
- [ ] Fishability replay reports seasonal label distribution, transitions,
      missing/prior-flow counts, and extreme-day samples.
- [ ] No internal scores, thresholds, reason codes, provider IDs, catch
      probability, access promise, or safety language leaks publicly.
- [ ] Foreign river, landmark, dam, gauge, and species denylist passes.
- [ ] Narrow-screen, partial, stale, missing, and terminal visual QA passes.

## 8. Evidence ledger

| ID       | Authority / title                                                                                                                                                                     | Published / accessed | Facts supported                                                                                                         | Limitations                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| S-001    | Michigan DNR, [Lower White River Status Report 0460](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0460_2026_Lower_White_River.pdf) | 2026 / 2026-08-24    | Extremely popular destination Steelhead fishery, stocked and natural fish, annual migration, corridor, Hesperia barrier | Fishery assessment; no exact daily fall-entry curve                        |
| S-002    | Michigan DNR, [Steelhead](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)                                                                             | current / 2026-08-24 | Late October-early May stream entry, fall entry/overwintering, spring spawning, repeat spawning                         | Statewide Great Lakes biology, not White-specific exact dates              |
| S-003    | Michigan DNR, [White River Status Report 2012-121](https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2012-121.pdf)                             | 2012 / 2026-08-24    | Steelhead presence and Hesperia barrier context                                                                         | Older supporting source                                                    |
| S-004    | USGS, [White River near Whitehall, MI 04122200](https://waterdata.usgs.gov/monitoring-location/USGS-04122200/)                                                                        | live / 2026-08-24    | Fruitvale discharge record and represented reach                                                                        | Provisional; not whole-corridor hydraulics                                 |
| CAL-S-01 | Owner calibration proposal: ceiling/tier                                                                                                                                              | 2026-08-24           | 7/10 ceiling and public tier                                                                                            | Requires replay and owner acceptance                                       |
| CAL-S-02 | Owner calibration proposal: exact fall-entry calendar/curve                                                                                                                           | 2026-08-24           | Exact boundaries and anchors                                                                                            | Requires replay and owner acceptance; no White-specific daily count exists |

## 9. Run gate

**Run decision:** `blocked_pending_replay_fixtures_and_owner_acceptance`

**Configuration version:** `2026-08-24-white-phase-c-draft.1` (hidden review
only)

**Activity rules version:** `white_activity_unavailable_split_reach_v1_research`

**Presence curve version:** `white_steelhead_fall_entry_v1_research`

**Copy version:** `white_steelhead_copy_v1_research`

**Replay artifact:** `not_generated`

**Owner acceptance/date:**
`numeric/research candidate approved for hidden app review / 2026-08-24`

Research is complete enough for fixture implementation. It does not authorize
runtime registration, deployment, or public enablement.
