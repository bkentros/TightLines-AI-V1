# Grand River Fall Steelhead River Run Profile

## 0. Candidate capability audit

Current DNR assessment, historic Webber passage, 2024 agency observations,
species biology, regulations, and rainbow/Steelhead aliases were checked. They
establish recurring fall entry; no contradictory exclusion was found.

**Capability decision:** `supported_hidden_review` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** required before public enablement

**River ID:** `grand` **Species slug:** `steelhead` **Created/researched:**
2026-08-24 **Status:** `truth_profile_researched_calibration_and_replay_blocked`

> This is a fall-entry profile, not a complete Steelhead lifecycle. Steelhead
> can overwinter and spawn in spring; the terminal state ends fall movement
> tracking without claiming the fish died or left. DNR supports Steelhead below
> Moores Impoundment, but all unresolved intermediate passage remains
> fail-closed exactly as in the Coho packet. Foundation IDs resolve in
> `../river-foundation.md`.

## 1. Species/run truth

| Field                               | Researched value                                                                                                                                                                                       | Evidence IDs               | Status                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------ |
| Public species name                 | Steelhead                                                                                                                                                                                              | S-R001                     | verified                       |
| Run type                            | Fall entry/overwintering component of a broader late-October–early-May spawning-stream migration                                                                                                       | S-R001, S-R002             | verified                       |
| Migration purpose                   | Adults enter in fall, overwinter, and generally spawn in spring; fall Stage tracks entry expectation only                                                                                              | S-R001                     | verified                       |
| Lifecycle after spawning            | Iteroparous: Steelhead do not necessarily die after spawning and may reproduce more than once                                                                                                          | S-R001                     | verified                       |
| Shared biology profile fit          | Must use Steelhead persistence logic, never salmon senescence/mortality logic; exact Grand fall calendar and numeric rules remain proposals                                                            | S-R001, S-R003             | qualified                      |
| Distribution scope                  | Potentially broad below Moores, but public routing is Lower-first and may advance only across a fully current species-specific passage chain                                                           | E-003, E-004, E-006, E-007 | verified_with_passage_blockers |
| Historical opportunity tier/ceiling | **Proposed Moderate ceiling, 5/10 for fall entry.** Webber counted 164 fall Steelhead in 2008: 16 September, 29 October, 119 November. This does not measure the larger spring run.                    | S-R002                     | owner_calibration_pending      |
| Barrier response differences        | Historic Webber passage is direct; North Lansing is described as inefficient but targeted for Coho/Steelhead improvement. Portland/Grand Ledge current operation and complete route remain unresolved. | E-004, E-006, E-007        | fail_closed                    |

## 2. Seasonal calendar proposal

DNR places lake Steelhead entry from late October through early May. Grand-
specific 2008 Webber fall passage was strongly November-weighted, while DNR's
Oct. 9, 2024 advisory minutes noted some fall fish beginning to enter. Exact
boundaries below are fall-model calibration proposals.

| Boundary                     | Date  | Meaning                                                                                    | Evidence IDs   | Owner calibration? |
| ---------------------------- | ----- | ------------------------------------------------------------------------------------------ | -------------- | ------------------ |
| Pre-run monitoring start     | 09-15 | Begin observing ahead of the main late-October window                                      | S-R001, S-R002 | yes                |
| Staging start                | 09-25 | Early fall Steelhead may be nearby; do not infer strain identity or dependable river entry | S-R003         | yes                |
| River-run start              | 10-01 | Conservative early-entry opening                                                           | S-R002, S-R003 | yes                |
| Beginning end                | 10-14 | Lower river remains primary                                                                | S-R001, S-R003 | yes                |
| Established building start   | 10-15 | Transition toward DNR's late-October statewide entry window                                | S-R001         | yes                |
| Broad building start         | 10-25 | Wider distribution only where current passage supports it                                  | S-R001, S-R002 | yes                |
| Peak start                   | 11-01 | Start of the dominant 2008 Webber fall month                                               | S-R002         | yes                |
| Peak anchor                  | 11-15 | Center of the November-weighted proposal                                                   | S-R002         | yes                |
| Peak end                     | 11-30 | November held 119 of 164 observed fall passages                                            | S-R002         | yes                |
| Tapering end                 | 12-15 | Fall entry can continue while the model narrows                                            | S-R001         | yes                |
| Main run end                 | 12-31 | End of fall-entry scope, not biological departure                                          | S-R001         | yes                |
| Historical-presence tail end | 01-15 | Holding/overwintering context only; no active fall-entry score                             | S-R001         | yes                |
| Late-copy end                | 01-31 | End fall profile and return to fall-tracking message                                       | S-R001         | yes                |

## 3. Migration Stage copy matrix

Do not call early fish Skamania, summer-run, or winter-run. The 2024 advisory
minutes mention summer-run and fall fish, but this engine does not identify an
individual's strain. Conditional section guidance remains unavailable until the
complete current passage chain is established.

| State key      | Trigger/date | Label               | Primary section                               | Conditional secondary section                                 | Novice-facing headline/Why intent                                                                                                               | Guide action                                                                              | Limitation                                                     |
| -------------- | ------------ | ------------------- | --------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| offseason      | 02-01–09-14  | Fall entry complete | none                                          | none                                                          | `Fall Steelhead entry tracking is complete.` Why: this profile resumes in late September; Steelhead may still persist or move in other seasons. | `Check back in late September when fall movement tracking resumes.`                       | Does not say fish left or died; no unavailable spring handoff. |
| before_staging | 09-15–09-24  | Not staging yet     | none                                          | none                                                          | `Dependable fall entry is not expected yet.` Why: monitoring has begun, but the staging checkpoint has not arrived.                             | `Wait for the staging window before using this fall-entry outlook.`                       | Monitoring is not evidence of fish.                            |
| staging        | 09-25–09-30  | Staging             | Grand Haven harbor and pierheads context only | none                                                          | `Early Steelhead may be staging near the river mouth.` Why: early fish are exceptions before dependable fall entry.                             | `Keep expectations narrow and wait for the fall-entry phase before using river sections.` | No strain inference.                                           |
| beginning      | 10-01–10-14  | Beginning           | Lower river                                   | none                                                          | `The first lower-river Steelhead window is opening.` Why: early fall movement is possible, but the main statewide entry window is later.        | `Begin in the Lower river and keep the plan narrow.`                                      | No confirmed live entry.                                       |
| building_early | 10-15–10-24  | Building            | Lower river                                   | Middle passage corridor only after current route verification | `The fall Steelhead window is building.` Why: timing is approaching the normal late-October entry period.                                       | `Keep Lower first; add Middle only when current passage information confirms the route.`  | Historic passage is not current route proof.                   |
| building_broad | 10-25–10-31  | Building            | Lower river                                   | verified Middle passage corridor                              | `Seasonal timing supports a broader Steelhead window.` Why: late October begins the established statewide migration period.                     | `Start Lower, then compare verified Middle water.`                                        | Upper remains withheld pending the full passage chain.         |
| peak           | 11-01–11-30  | Peak fall entry     | Lower river                                   | verified Middle passage corridor                              | `This is the strongest seasonal fall-entry window.` Why: November dominated the Grand's historic fall Webber count.                             | `Compare Lower and verified Middle water in that order.`                                  | Does not claim live abundance or every-reach presence.         |
| tapering       | 12-01–12-15  | Tapering            | Lower river                                   | verified Middle passage corridor                              | `Fall entry is tapering, while Steelhead may remain in the river.` Why: entry and presence are different questions.                             | `Favor established holding water within currently supported sections.`                    | No salmon-style mortality fade.                                |
| ending         | 12-16–01-15  | Holding transition  | Lower river, narrow                           | none                                                          | `The dependable fall-entry window is ending.` Why: Steelhead may overwinter, but this model no longer supports broad movement guidance.         | `Use the outlook as a narrow holding read, not a fresh-entry signal.`                     | No spring destination is named.                                |
| terminal       | 01-16–01-31  | Fall entry complete | none                                          | none                                                          | `Fall Steelhead entry tracking is complete.` Why: this calendar has ended, not the fish's lifecycle.                                            | `Do not use the fall model to infer departure or inactivity.`                             | Fish In River completes without numeric zero.                  |

Permanent Stage scope note:
`Steelhead may be shown farther upstream only
where current species-specific passage supports the complete route; the
product boundary remains below Moores Park Dam.`

## 4. Fish In River proposal

- Historical maximum: **5/10 proposal for fall entry only**.
- Public opportunity tier: `Moderate` proposal.
- Distribution: Lower-first; verified Middle conditional; Upper withheld until
  the full passage route is current.
- Curve candidate: `grand-steelhead-fall-presence-v1-proposed`.
- Direction: rising 10-01–11-14; peak 11-15; falling entry signal 11-16–12-31;
  holding plateau through 01-15; profile complete after that.
- Terminal: do not drop because of death. Complete state hides active fall
  estimate and says tracking ended; it never displays `0 fish`.
- Handoff: none; a spring experience is not established by this packet.

| Day offset from 10-01 | Fraction of maximum | Reason                                                            | Evidence IDs   |
| --------------------: | ------------------: | ----------------------------------------------------------------- | -------------- |
|                     0 |                0.10 | Conservative early-entry opening                                  | S-R002, S-R003 |
|                    14 |                0.25 | Build toward late October                                         | S-R001         |
|                    24 |                0.48 | Established statewide entry window begins                         | S-R001         |
|                    31 |                0.72 | November-weighted Grand passage begins                            | S-R002         |
|                    45 |                1.00 | Proposed November peak anchor                                     | S-R002         |
|                    60 |                0.88 | End of dominant historic month                                    | S-R002         |
|                    76 |                0.72 | Entry taper with persistence                                      | S-R001         |
|                    91 |                0.62 | Fall-entry end; overwintering fish may remain                     | S-R001         |
|                   106 |                0.58 | Holding plateau, not active movement                              | S-R001         |
|                   122 |                0.00 | Profile complete; public output must not imply biological absence | S-R001         |

Public rendering must use state-preserving five-point rounding with `≈` where
required; marker and copy must share the same value. It is a seasonal estimate,
never a live fish count, and the completed state must not display numeric zero.

## 5. Activity capability and proposed calibration

- Mode candidate: `observed_river`, **blocked** by unresolved clear-sky weather
  input and replay.
- Temperature: North Park Street/Middle Grand Rapids reach only.
- Hydraulics: Fulton Street/downtown Lower reach only.
- Weather: one Grand Rapids point, not corridor-wide.
- Biology: Lake Michigan tributary research supports temperature-dependent
  upstream movement with an approximately 4 °C cold threshold, but Activity is
  responsiveness—not movement—and requires separate calibration.
- Steelhead remain alive across the late model; calendar may cap confidence in
  fresh-entry interpretation but must not impose salmon senescence.

| Component                  | Proposed weight | Rationale                                               | IDs                    |
| -------------------------- | --------------: | ------------------------------------------------------- | ---------------------- |
| Effective light            |            0.20 | block separation; no exact Grand coefficient exists     | S-CAL01                |
| Measured water temperature |            0.40 | direct reach-limited biological context                 | E-010, S-R004, S-CAL01 |
| River behavior             |            0.35 | presentation shape is material, but no migration credit | E-009, S-R004, S-CAL01 |
| In-block precipitation     |            0.05 | bounded same-block context only                         | S-CAL01                |

| Control              | Proposed value/cap                                                                              | Rationale/status                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Cold-side transition | fade below 40 °F; cold cap 49 below 36 °F                                                       | Lake Michigan movement literature supports a ~4 °C threshold; responsiveness mapping remains proposed |
| Preferred band       | 42–55 °F                                                                                        | owner/replay candidate, not a Grand optimum                                                           |
| Warm constraint      | begin fade above 60 °F; cap 69 at/above 64 °F                                                   | conservative fall proposal                                                                            |
| Thermal barrier      | cap 39 at/above 68 °F                                                                           | high-temperature constraint proposal; external telemetry is not Grand calibration                     |
| Missing temperature  | cap 64/Limited                                                                                  | missing is not neutral                                                                                |
| Missing hydraulics   | cap 64/Limited                                                                                  | observed-river input requirement                                                                      |
| Missing both         | unavailable                                                                                     | no implicit weather-only result                                                                       |
| Late fall-entry      | no mortality cap; after 12-15 copy cannot call responsiveness fresh movement                    | preserves primitive ownership and Steelhead persistence                                               |
| Holding transition   | maximum label `Moderate` after 12-31 unless a future winter profile is implemented and accepted | owner/product scope cap, not senescence                                                               |
| Terminal             | Activity unavailable when fall profile completes                                                | does not say fish are inactive or absent                                                              |

Public scope note:
`Responsiveness if Steelhead are present—not abundance,
fresh entry, or catch probability. Grand Rapids inputs describe the Fulton
Street and North Park reaches, not the full Grand River.`

Acceptance requires weather-input resolution, fixed five-plus-year replay,
coverage/distribution/subset reporting, isolated block tests, missing/extreme
caps, distinct Steelhead terminal tests, Today/Tomorrow/DST/block-freeze tests,
complete intended-state copy fixtures, and owner acceptance.

## 6. Fishability capability and proposed bands

Fishability is possible only for the Fulton Street/downtown Lower reach. Bands
use 1990–2025 Sept. 15–Dec. 31 seasonal percentiles as scaffolding.

| Boundary          | Proposed discharge | Rationale                                               |
| ----------------- | -----------------: | ------------------------------------------------------- |
| Too low maximum   |          1,400 CFS | near seasonal 10th percentile; local validation pending |
| Low fishable      |          1,900 CFS | near seasonal 25th percentile                           |
| Ideal             |    1,900–4,800 CFS | approximately seasonal 25th–80th percentile             |
| High fishable     |    4,800–8,000 CFS | approximately seasonal 80th–95th percentile             |
| Blown out minimum |          8,000 CFS | presentation proposal only; not safety/flood threshold  |

- Source/reach: Fulton Street discharge only; no gauge-height score.
- Trend: 24-hour trend changes presentation only, never proves movement.
- Freshness/caps: ≤2 h normal; >2–24 h Limited/no trend upgrade; >24 h
  unavailable; unknown trend max `Good`.
- Scope note:
  `Fishability describes the Fulton Street reach only; it does not
  rate the full river, access, or safety.`
- Extreme guidance:
  `Treat an extreme station reading as poor local
  presentation and verify current river and access information.`
- Acceptance: local expert review, historical/lifecycle replay, all band and
  trend fixtures, and post-construction rating/source re-audit.

## 7. Four-primitive acceptance

- [x] Draft Stage copy preserves the Lower/Middle/Upper route constraints.
- [x] Early fish are not assigned a strain.
- [x] Terminal copy distinguishes ended fall tracking from death/departure.
- [x] Activity and Fishability state their real source reaches.
- [ ] Exact calendar, ceiling, curve, weights, caps, and bands are
      owner-accepted.
- [ ] Every displayed upstream route has current passage support.
- [ ] Activity/Fishability replays, controlled tests, fixtures, automated gates,
      and device review pass.

## 8. Research evidence ledger

| ID      | Authority/title                                                                                                          | URL/path                                                                                                                                | Published/updated  | Accessed                                                                                              | Facts supported                                                                           | Limitations                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------- |
| S-R001  | Michigan DNR, _Steelhead_                                                                                                | https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead                                                          | current            | 2026-08-24                                                                                            | late-Oct.–early-May entry; fall fish overwinter/spawn in spring; repeat spawning possible | statewide, not exact Grand timing |
| S-R002  | Michigan DNR, _Grand River, Ionia County — Status of the Fishery Resource Report 2009-78_                                | https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2009-78.pdf                                    | 2009               | 164 fall Webber passages; monthly distribution; most total Steelhead passage historically March–April | one historic year; no current abundance/operation proof                                   |                                   |
| S-R003  | Michigan DNR, Lake Michigan Citizens Fishery Advisory Committee minutes                                                  | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Boards/LMCFAC/Minutes/minutes-oct-9-2024.pdf                        | 2024-10-09         | Grand report of some fall fish beginning; low water stalled salmon ladder movement                    | advisory minutes/observation, not a quantitative calendar                                 |                                   |
| S-R004  | Workman, Hayes & Coon, _A Model of Steelhead Movement in Relation to Water Temperature in Two Lake Michigan Tributaries_ | https://doi.org/10.1577/1548-8659(2002)131%3C0463:AMOSMI%3E2.0.CO;2                                                                     | 2002               | Lake Michigan tributary adult movement was temperature-dependent; ~4 °C movement threshold reported   | Pere Marquette/St. Joseph; movement is not Activity responsiveness                        |                                   |
| S-R005  | USGS 04119000 daily discharge endpoint                                                                                   | https://waterservices.usgs.gov/nwis/dv/?format=json&sites=04119000&parameterCd=00060&startDT=1990-01-01&endDT=2025-12-31&siteStatus=all | queried 2026-08-24 | 3,888 seasonal observations and percentile scaffolding                                                | hydrology does not establish fishability                                                  |                                   |
| S-CAL01 | FinFindr Grand Steelhead Phase C proposal                                                                                | this file                                                                                                                               | 2026-08-24         | dates, curve, ceiling, weights, thresholds, caps, copy intent                                         | owner/replay/QA pending                                                                   |                                   |

Foundation evidence used: E-002, E-003, E-004, E-006, E-007, E-009, E-010,
E-018.

## 9. Run gate

**Run decision:** `truth_profile_complete_configuration_blocked` **Configuration
version:** `grand-steelhead-fall-config-v1-proposed` **Activity rules version:**
`grand-steelhead-fall-activity-v1-proposed` **Presence curve version:**
`grand-steelhead-fall-presence-v1-proposed` **Copy version:**
`grand-steelhead-fall-copy-v1-proposed` **Replay artifact:** pending **Owner
acceptance/date:** numeric/research candidate approved for hidden app review /
2026-08-24

Blocking items: current passage through every displayed section; weather
clear-sky capability; numeric owner decisions; replays, controlled tests,
fixtures/gates/device review; construction-era source re-audit; no implemented
spring destination for a handoff.
