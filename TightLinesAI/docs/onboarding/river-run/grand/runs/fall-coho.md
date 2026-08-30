# Grand River Fall Coho River Run Profile

## 0. Candidate capability audit

Current DNR assessment, historic Webber passage, species biology, regulations,
and alias searches were checked. They establish recurring Coho passage and a
public fishery; no contradictory exclusion was found.

**Capability decision:** `supported_public_reach_scoped` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** completed in the 2026-08-25 observed-Activity audit and 2026-08-27
Fishability reconciliation

**River ID:** `grand` **Species slug:** `coho` **Created/researched:**
2026-08-24 **Status:** `public_enabled_with_fail_closed_passage_scope`

> Coho have current DNR destination support below Moores Impoundment, but that
> does not erase unresolved intermediate passage. Public guidance remains in the
> Lower river until the Sixth/Ada/Wagar route is current; it may enter the
> Middle passage corridor only after that route is verified and may enter the
> Upper accessible corridor only after Webber, Portland, Grand Ledge, and North
> Lansing passage is verified for Coho. Foundation IDs resolve in
> `../river-foundation.md`.

## 1. Species/run truth

| Field                               | Researched value                                                                                                                                                                                                         | Evidence IDs               | Status                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------ |
| Public species name                 | Coho salmon                                                                                                                                                                                                              | H-R001                     | verified                       |
| Run type                            | Fall upstream spawning migration; Michigan DNR says Coho generally migrate later and farther than other salmon                                                                                                           | H-R001, H-R002             | verified                       |
| Migration purpose                   | Adult spawning migration; seasonal expectation cannot confirm daily entry or distribution                                                                                                                                | H-R001                     | verified                       |
| Lifecycle after spawning            | Adults die soon after spawning; late Activity must fade and no winter holding handoff is valid                                                                                                                           | H-R001                     | verified                       |
| Shared biology profile fit          | Coho fall-spawn mechanics fit directionally; exact Grand dates and numeric rules are product proposals                                                                                                                   | H-R001, H-R002             | qualified                      |
| Distribution scope                  | Broad potential destination below Moores, but publishable guidance is sectionally fail-closed by unresolved intermediate passage                                                                                         | E-003, E-004, E-006, E-007 | verified_with_passage_blockers |
| Historical opportunity tier/ceiling | **Proposed High ceiling, 8/10.** Webber counted 1,575 Coho in fall 2008 (864 September, 125 October, 586 November), far above the other two packet species there; this remains one ladder/year, not a whole-river count. | H-R002                     | owner_calibration_pending      |
| Barrier response differences        | Direct historic Webber passage and current below-Moores destination evidence exist. No current unrestricted route through every intermediate ladder exists in the packet.                                                | E-003, E-004, E-006, E-007 | fail_closed                    |

## 2. Seasonal calendar proposal

Michigan DNR places Coho spawning runs from early September through November. At
Webber in 2008, 54.9% of passage occurred September 8–29, with a substantial
November count. The dates below preserve a long Coho tail without treating one
year's flow-affected passage as a recurring second live pulse.

| Boundary                     | Date  | Meaning                                                                               | Evidence IDs   | Owner calibration? |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------- | -------------- | ------------------ |
| Pre-run monitoring start     | 08-15 | Begin data/replay collection ahead of the statewide early-September window            | H-R001         | yes                |
| Staging start                | 08-25 | Harbor staging context may be plausible; river entry is not confirmed                 | H-R001, E-002  | yes                |
| River-run start              | 09-01 | Conservative opening aligned with species and historic Webber windows                 | H-R001, H-R002 | yes                |
| Beginning end                | 09-07 | Lower river only by default                                                           | H-R002         | yes                |
| Established building start   | 09-08 | Start of the documented Webber concentration                                          | H-R002         | yes                |
| Broad building start         | 09-15 | Broader seasonal distribution can be considered only inside verified passage          | H-R002         | yes                |
| Peak start                   | 09-15 | Within the Sept. 8–29 historic concentration                                          | H-R002         | yes                |
| Peak anchor                  | 09-22 | Center of the Grand-specific September peak proposal                                  | H-R002         | yes                |
| Peak end                     | 09-29 | End of the report's concentrated September interval                                   | H-R002         | yes                |
| Tapering end                 | 11-15 | Long taper includes the substantial 2008 November passage without claiming a new wave | H-R001, H-R002 | yes                |
| Main run end                 | 11-30 | DNR's statewide Coho spawning-run window ends in November                             | H-R001         | yes                |
| Historical-presence tail end | 12-15 | Narrow residual state only; Grand-specific evidence after November is absent          | H-R001         | yes                |
| Late-copy end                | 12-31 | End fall model; no winter Coho destination is implemented                             | H-R001         | yes                |

## 3. Migration Stage copy matrix

The conditional section columns are requirements for a future release state, not
authority to route around today's unresolved barriers.

| State key      | Trigger/date | Label             | Primary section                               | Conditional secondary section                                 | Novice-facing headline/Why intent                                                                                                          | Guide action                                                                              | Limitation                                                            |
| -------------- | ------------ | ----------------- | --------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| offseason      | 01-01–08-14  | Fall run complete | none                                          | none                                                          | `The fall Coho run is complete.` Why: adults die after spawning; staging typically returns in late August.                                 | `Check back in late August when staging typically begins.`                                | Does not define a legal fishing season.                               |
| before_staging | 08-15–08-24  | Not staging yet   | none                                          | none                                                          | `Dependable river entry is not expected yet.` Why: monitoring has begun, but the staging checkpoint has not arrived.                       | `Wait for the staging window before using this fall outlook.`                             | Monitoring is not evidence of fish.                                   |
| staging        | 08-25–08-31  | Staging           | Grand Haven harbor and pierheads context only | none                                                          | `Coho may be staging near the river mouth.` Why: nearby-water staging is plausible before dependable river entry.                          | `Use harbor context only and wait for the river-entry phase before using river sections.` | No live-presence claim.                                               |
| beginning      | 09-01–09-07  | Beginning         | Lower river                                   | none                                                          | `The first lower-river Coho window is opening.` Why: seasonal timing supports early entry, not confirmed numbers.                          | `Begin in the Lower river and keep the plan narrow.`                                      | No route above unresolved passage.                                    |
| building_early | 09-08–09-14  | Building          | Lower river                                   | Middle passage corridor only after current route verification | `The Coho window is building from the Lower river.` Why: historic Webber passage strengthened in this interval.                            | `Keep Lower first; add Middle only when current passage information confirms the route.`  | Historical ladder use is not current operation.                       |
| building_broad | 09-15–09-21  | Building          | Lower river                                   | verified Middle passage corridor                              | `Seasonal timing supports a broader Coho window.` Why: September held the strongest historic concentration.                                | `Start Lower, then compare verified Middle water.`                                        | Upper remains unavailable until every intermediate route is verified. |
| peak           | 09-22–09-29  | Peak              | Lower river                                   | verified Middle passage corridor                              | `This is the strongest seasonal Coho window.` Why: the conclusion is historical expectation, not proof of fish throughout the corridor.    | `Compare Lower and verified Middle water in that order.`                                  | Do not infer whole-river distribution.                                |
| tapering       | 09-30–11-15  | Tapering          | Lower river                                   | verified Middle passage corridor                              | `The main Coho window is tapering but remains seasonally relevant.` Why: the Grand's historic record retained meaningful November passage. | `Favor established Lower holding water; use Middle only with current passage support.`    | Never call November passage a fresh live wave.                        |
| ending         | 11-16–12-15  | Ending            | Lower river, narrowly                         | none                                                          | `The dependable Coho window is ending.` Why: the statewide spawning window closes in November and post-spawn decline matters.              | `Narrow the plan and avoid broad upstream assumptions.`                                   | Lifecycle caps apply.                                                 |
| terminal       | 12-16–12-31  | Fall run complete | none                                          | none                                                          | `The broad fall Coho run is complete.` Why: residual fish are exceptional and adults do not persist after spawning.                        | `Do not use this fall model to infer dependable winter opportunity.`                      | No handoff.                                                           |

Permanent Stage scope note:
`Coho may be shown farther upstream only where
current species-specific passage supports the complete route; the product
boundary remains below Moores Park Dam.`

## 4. Fish In River proposal

- Historical maximum: **8/10 proposal**; subject to owner/replay review.
- Public opportunity tier: `High` proposal, not an abundance claim.
- Distribution: Lower-first; verified Middle conditional; Upper withheld until
  the entire intermediate route is species-verified.
- Curve candidate: `grand-coho-presence-v1-proposed`.
- Direction: rising 09-01–09-21; peak 09-22; long falling shoulder 09-23–12-15;
  complete from 12-16.
- Terminal: fade smoothly after spawning; completed display is not numeric zero.
- Handoff: none.

| Day offset from 09-01 | Fraction of maximum | Reason                                                                | Evidence IDs   |
| --------------------: | ------------------: | --------------------------------------------------------------------- | -------------- |
|                     0 |                0.10 | Conservative river opening                                            | H-R001, H-R002 |
|                     7 |                0.40 | Webber concentration begins                                           | H-R002         |
|                    14 |                0.78 | Strong September build                                                | H-R002         |
|                    21 |                1.00 | Proposed peak anchor                                                  | H-R002         |
|                    29 |                0.88 | End of concentrated September passage                                 | H-R002         |
|                    45 |                0.68 | October taper; not forced low because later passage remained material | H-R002         |
|                    67 |                0.58 | November shoulder without an inferred live pulse                      | H-R002         |
|                    90 |                0.24 | End of documented statewide spawning-run window                       | H-R001         |
|                   105 |                0.06 | Residual/post-spawn tail                                              | H-R001         |
|                   121 |                0.00 | Fall model complete, not `0 fish`                                     | H-R001         |

Public rendering must use state-preserving five-point rounding with `≈` where
required; marker and copy must share the same value. It is a seasonal estimate,
never a live fish count, and the completed state must not display numeric zero.

## 5. Activity capability and proposed calibration

> **Implementation update (2026-08-25):** The current public profile is
> `grand-fall-coho-observed-activity-v3-draft`. It combines Fulton flow, North
> Park measured temperature, and Grand Rapids hourly weather only for the
> downtown Grand Rapids mainstem. See
> `docs/audits/river-run-grand-observed-activity-2026-08-25.md`. The accepted v3
> stage means are Pre-run 22.76, Beginning 29.21, Building 33.65, Peak 44.02,
> Tapering 40.00, Ending 36.90, and Post-run 26.18. The bounded stage-response
> adjustment retains warm/barrier/blown-out caps and a true 96-point maximum.

- Mode: `observed_river`, publicly enabled with the documented reach limits.
- Measured temperature: North Park Street/Middle Grand Rapids reach only.
- Hydraulics: Fulton Street/downtown Lower reach only.
- Weather: proposed Grand Rapids point only; not basin-wide.
- Biology: Coho migrate later/longer and die after spawning. No Grand-specific
  adult responsiveness study establishes exact temperature or light weights.

| Component                  | Proposed weight | Rationale                                                       | IDs                    |
| -------------------------- | --------------: | --------------------------------------------------------------- | ---------------------- |
| Effective light            |            0.25 | block separator; exact effect owner-calibrated                  | H-CAL01                |
| Measured water temperature |            0.40 | strongest direct biological constraint candidate; reach-limited | E-010, H-R003, H-CAL01 |
| River behavior             |            0.30 | local presentation context, never migration credit              | E-009, H-CAL01         |
| In-block precipitation     |            0.05 | minor bounded context; no clarity inference                     | H-CAL01                |

| Control              | Proposed value/cap                            | Rationale/status                                                                                    |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Cold-side transition | fade below 42 °F; cold cap 59 below 38 °F     | proposal; external Coho spawning observations include colder water but do not define responsiveness |
| Preferred band       | 45–58 °F                                      | owner/replay candidate, not a Grand biological constant                                             |
| Warm constraint      | begin fade above 62 °F; cap 69 at/above 66 °F | conservative proposal                                                                               |
| Thermal barrier      | cap 39 at/above 68 °F                         | owner proposal pending controlled/replay evidence                                                   |
| Missing temperature  | cap 64/Limited                                | missing data cannot become credit                                                                   |
| Missing hydraulics   | cap 64/Limited                                | observed-river requirement                                                                          |
| Missing both         | unavailable                                   | no silent weather-only switch                                                                       |
| Tapering lifecycle   | cap fades from 79 on 09-30 to 59 on 11-15     | retains long run while constraining senescence                                                      |
| Ending lifecycle     | cap fades from 49 on 11-16 to 24 on 12-15     | post-spawn decline                                                                                  |
| Terminal             | unavailable/complete after 12-15              | no winter handoff                                                                                   |

Public scope note:
`Responsiveness if Coho are present—not abundance or catch
probability. Grand Rapids inputs describe the Fulton Street and North Park
reaches, not the full Grand River.`

The 2020–2025 replay has 641/678 complete dates and zero scoring/copy/cap
invariants. Automated Full/Moderate/Unavailable, block, lifecycle, and generated
fixture gates pass. Rendered device review and owner acceptance remain required.

## 6. Fishability capability and proposed bands

Only the Fulton Street/downtown Lower reach has accepted hydraulics. The shared
Grand bands use the combined 1990–2025 fall distribution, are identical for all
three public species, and do not apply to Middle/Upper water.

| Boundary          | Proposed discharge | Rationale                                                 |
| ----------------- | -----------------: | --------------------------------------------------------- |
| Too low maximum   |          1,200 CFS | near the broad fall lower tail; Fulton presentation only  |
| Low fishable      |          1,600 CFS | near the broad fall 25th-percentile corridor              |
| Ideal             |    1,600–4,000 CFS | shared fall presentation range                            |
| High fishable     |    4,001–6,399 CFS | upper fall presentation range                             |
| Blown out minimum |          6,400 CFS | presentation threshold only; not a safety/flood threshold |

- Source/reach: USGS discharge at Fulton Street; no gauge-height score.
- Trend: 24-hour trend may affect presentation only.
- Freshness/caps: ≤2 h normal; >2–24 h Limited/no trend upgrade; >24 h
  unavailable; unknown trend max `Good`.
- Scope note:
  `Fishability describes the Fulton Street reach only; it does not
  rate the full river, access, or safety.`
- Extreme guidance:
  `Treat an extreme station reading as poor local
  presentation and verify current river and access information.`
- The 2026-08-27 cross-river audit reconciled all boundaries, trend/freshness
  behavior, source scope, and review fixtures. Material construction or channel
  change still requires a Fulton rating/source recheck.

## 7. Four-primitive acceptance

- [x] Draft Stage copy preserves all route and endpoint distinctions.
- [x] Draft copy uses expectation language and a novice-readable action.
- [x] Activity/Fishability reach limits and lifecycle behavior are explicit.
- [ ] Exact calendar, ceiling, curve, weights, caps, and bands are
      owner-accepted.
- [ ] Intermediate passage is current for every section that could be shown.
- [x] Activity replay and controlled tests pass.
- [x] Shared Fishability calibration and automated boundary/reconciliation
      review pass.
- [ ] Complete intended-state fixtures, automated gates, and device review pass.

## 8. Research evidence ledger

| ID      | Authority/title                                                                           | URL/path                                                                                                                                | Published/updated  | Accessed                                                                                          | Facts supported                                                                   | Limitations                   |
| ------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------- |
| H-R001  | Michigan DNR, _Coho salmon_                                                               | https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon                                                        | current            | 2026-08-24                                                                                        | early-Sept.–Nov. spawning runs; later/longer migration; adults die after spawning | statewide, tributary-variable |
| H-R002  | Michigan DNR, _Grand River, Ionia County — Status of the Fishery Resource Report 2009-78_ | https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2009-78.pdf                                    | 2009               | 1,575 Webber Coho; Sept./Oct./Nov. counts; Sept. 8–29 concentration                               | one historic year; no current abundance/operation proof                           |                               |
| H-R003  | Bowlby & Roff, _Salmonid Spawning Runs and Estimated Ova Production in Normandale Creek_  | https://doi.org/10.1016/S0380-1330(81)72041-0                                                                                           | 1981               | observed Coho spawning at 1–10 °C and flow association                                            | Lake Erie creek; not Grand responsiveness or exact thresholds                     |                               |
| H-R004  | USGS 04119000 daily discharge endpoint                                                    | https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04119000&parameterCd=00060&startDT=1990-01-01&endDT=2025-12-31&siteStatus=all | queried 2026-08-24 | 4,428 seasonal observations and percentile scaffolding                                            | hydrology does not establish fishability                                          |                               |
| H-CAL01 | FinFindr Grand Coho Phase C proposal                                                      | this file                                                                                                                               | 2026-08-24         | dates, curve, ceiling, weights, thresholds, caps, copy intent                                     | owner/replay/QA pending                                                           |                               |
| H-ACT01 | FinFindr Grand observed Activity audit                                                    | `docs/audits/river-run-grand-observed-activity-2026-08-25.md`                                                                           | 2026-08-25         | Downtown proxy validation, 641/678-date replay, source failure states, downstream source decision | not catch-rate validation or whole-river evidence                                 |                               |

Foundation evidence used: E-002, E-003, E-004, E-006, E-007, E-009, E-010,
E-018.

## 9. Run gate

**Run decision:** `public_enabled_reach_scoped` **Configuration version:**
`2026-08-27-grand-fishability-reconciliation.2` **Activity rules version:**
`grand-fall-coho-observed-activity-v3-draft` **Presence curve version:**
`grand-coho-presence-v1-proposed` **Copy version:** `onboarding_corridor`
**Replay artifact:** `docs/audits/river-run-grand-coho-activity-replay.json`
**Owner acceptance/date:** public release accepted / 2026-08-25; shared Fulton
Fishability reconciled / 2026-08-27

Remaining limitations are fail-closed rather than release blockers: do not
display an upstream section without current passage support, and re-audit the
source/station pair after material construction or channel changes.
