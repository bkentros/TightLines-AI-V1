# Milwaukee River Fall Steelhead River Run Profile

**River ID:** `milwaukee` **Species slug:** `steelhead` **Created:** 2026-08-25\
**Status:** `gate_4b_activity_owner_review`

> Hidden fall-entry Activity candidate. This is not a winter-holding or
> spring-spawning score; public enablement and release remain unauthorized.

## 0. Candidate capability audit

| Question/source class   | Finding                                                                                                      | Evidence                 | Outcome                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------ |
| Occurs and recurs?      | Current stocking, DNR access listings, and Kletzsch passage detections support recurrence                    | S-001, S-002, S-003      | supported                            |
| Good fall opportunity?  | Owner/local 7/10 with an exact Oct. 8 peak supplied by a Wisconsin angler                                     | S-004, S-005             | supported, medium ceiling confidence |
| Multi-strain lifecycle? | This product models the locally calibrated fall run; winter holding and spring spawning remain separate      | S-006                    | mandatory phase separation           |
| Post-fall behavior?     | Steelhead may overwinter, spawn in spring, survive, and return to the lake                                   | shared Steelhead biology | nonterminal                          |
| Distribution?           | Sectional below Bridge Street; facility existence does not prove equal abundance                             | S-002, S-003             | sectional                            |
| Regulations?            | Refuge and tributary night restriction require front-loaded warning                                          | S-003, S-007             | locked                               |
| Contradiction search    | Spring-run evidence is not used as fall abundance; fall local knowledge and DNR strain timing are compatible | all                      | passed 2026-08-26                    |

**Capability decision:** `supported_hidden_fall_entry`

## 1. Locked truth and field reconciliation

| Field/config path    | Implemented value                                                              | Basis/status                                                                                       |
| -------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| identity/biology     | `milwaukee_fall_steelhead`; `great_lakes_steelhead_fall_entry_v1`              | reconciled                                                                                         |
| run type/engine      | `fall_entry`; `fall_entry_cooling`                                             | separate from fall-spawn salmon                                                                    |
| maximum/distribution | **7/10**, `sectional`                                                          | owner/local; medium exact ceiling confidence                                                       |
| endpoint             | downstream face of Bridge Street Dam                                           | approved foundation                                                                                |
| capabilities         | Stage, Activity, Fish In River, Fishability available; Timing/Push unavailable | gate contract                                                                                      |
| run window           | `08-01` monitoring through `01-15` completion copy                             | local-peak fall calendar                                                                           |
| handoff              | none                                                                           | no separately implemented winter experience; terminal returns `null` rather than fabricating score |
| presence             | `milwaukee-steelhead-fall-presence-v1-draft`                                   | reconciled                                                                                         |
| Fishability          | shared Estabrook/post-removal bands                                            | S-008                                                                                              |
| copy                 | Milwaukee corridor with nonterminal fall-entry completion                      | reconciled                                                                                         |
| visibility           | draft; `publicAudit=false`                                                     | hidden                                                                                             |

**Passage chain:** Harbor & Downtown → Urban Greenway → legal North Shore below
Bridge Street. Kletzsch/Mequon passage is conditional; refuge excluded.\
**Code reconciliation:** completed 2026-08-26.

### Portfolio comparison

The 7/10 owner/local calibration replaces the 4/10 research prior and represents
fall opportunity—not a spring count imported into fall. It remains below the
Bois Brule 9/10 count-backed reference. Exact fall ceiling confidence remains
medium, while recurrence and lifecycle confidence are high.

## 2. Seasonal calendar

| Boundary                     | Date                  | Meaning/basis                                  | Confidence                     |
| ---------------------------- | --------------------- | ---------------------------------------------- | ------------------------------ |
| Pre-run / staging            | 08-01 / 08-15         | monitoring context before confirmed entry      | medium                         |
| Start / beginning end        | 09-01 / 09-15         | first locally calibrated fall-entry phase      | medium                         |
| Established / broad building | 09-16 / 09-25         | September expansion toward the field peak      | medium                         |
| Peak start / anchor / end    | 10-01 / **10-08** / 10-25 | owner-supplied exact peak; conservative shoulders | high anchor; medium shoulders  |
| Tapering end                 | 11-20                 | fewer new entrants; established fish may hold  | medium                         |
| Fall-entry end / tail        | 12-15 / 12-31         | model boundary shoulder                        | medium                         |
| Completion copy              | 01-15                 | fall-entry model inactive                      | high semantic confidence       |

The Oct. 8 anchor is locked owner/local field calibration. The surrounding
boundaries are conservative interpolations, not separately observed exact days.

## 3. Migration Stage and corridor copy

| Phase           | Where to start                                       | Lifecycle/section constraint                               |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Before/staging  | harbor/entrance                                      | early fish do not prove broad entry                        |
| Beginning       | Harbor & Downtown                                    | inland distribution conditional                            |
| Building        | Harbor & Downtown → Urban Greenway                   | passage is not abundance                                   |
| Broad/peak      | Urban Greenway; legal North Shore selectively        | refuge excluded                                            |
| Tapering/ending | established Urban Greenway/North Shore holding water | fewer arrivals do not mean fish left                       |
| Complete        | no active fall-entry starting section                | Steelhead may remain through winter before spring spawning |

Every direction begins with the Kletzsch-refuge and seasonal night warning.

## 4. Fish In River

**Maximum:** 7/10 (`70/100`) **Scope:** sectional

| Offset from 09-01 | Fraction | Meaning                     |
| ----------------: | -------: | --------------------------- |
|                 0 |      .12 | first fall entry            |
|                15 |      .35 | established September build |
|                24 |      .65 | broad build                 |
|                37 |     1.00 | **Oct. 8 peak anchor**      |
|                54 |      .90 | late-October shoulder       |
|                80 |      .75 | November holding/entry mix  |
|               105 |      .62 | late-fall retained presence |

After Dec. 15 the fall model returns `null` with “Fall entry complete.” It says
fish may remain; it does not display zero, death, lake return, or a fabricated
winter/spring score.

## 5. Activity

**Decision:** `observed_river_hidden_owner_review`\
**Version:** `milwaukee-fall-steelhead-observed-activity-v4-local-calendar-draft`

The Estabrook-only model weights effective light 20%, measured temperature 45%,
river presentation 30%, and same-block precipitation 5%. It has no salmon floor,
mortality ramp, taper penalty, ending cap, or fresh-movement bonus.

The corrected thermal curve grades stress upward through 64–66°F, strongly
constrains 66–70°F, and reserves the hard barrier for 70°F. The corrected
calendar made the old stage boosts excessive, so support is now only
5/7/9/9 points for Pre-run/Beginning/Building/Peak. Tapering, Ending, and
Post-run receive zero adjustment and no lifecycle penalty.

The corrected-calendar 2024–2025 primary replay covers 236/278 dates (84.89%).
Daily scores were min 6, p10 15, median 62, mean 51.94, p90 89, max 96. Stage
means were Pre-run 15.29, Beginning 31.77, Building 26.98, Peak 77.58,
Tapering 81.16, Ending 70.37, and residual 58.88. Tapering can slightly exceed
Peak Activity because Activity describes the responsiveness of fish already
present under cooler conditions—not run abundance. Every lifecycle,
mortality-language, cap, block, copy, stage-adjustment, and scope invariant
passes. The 2007–2025 sensitivity replay covers only 306/2,641 dates (11.59%),
so the measured-temperature record remains an explicit release limitation.

## 6. Fishability and Gauge Read

USGS `04087000` independently supplies five-minute flow, height, and measured
temperature near Estabrook. Fishability uses the fixed 2019–2025 post-removal
bands (`<170`, `170–236`, `237–593`, `594–1519`, `>=1520 CFS`) and is scoped
only to the Urban Greenway. It does not describe fish activity, abundance,
harbor/North Shore water, access, or safety. Historical temperature average is
suppressed because the daily series is discontinuous.

## 7. Evidence ledger

| ID    | Primary source                                                                                                                                                                                                                                         | Supports / limitation                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| S-001 | Wisconsin DNR, [2024 stocking summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)                                                                                                                         | recurring Milwaukee Steelhead stocking; not returns                          |
| S-002 | Wisconsin DNR, [Milwaukee fall access material](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                                                                                                                 | direct river/access opportunity; older/general                               |
| S-003 | Wisconsin DNR, [2025 GLFC report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf) and [Kletzsch refuge rule](https://dnr.wisconsin.gov/sites/default/files/topic/Rules/FH1022DraftRule.pdf)                                | current passage detections, passage/refuge scope; detections not abundance   |
| S-004 | Owner-relayed Wisconsin local calibration, 2026-08-26                                                                                                                                                                                                  | 7/10 fall opportunity; experiential                                          |
| S-005 | Wisconsin DNR, [Milwaukee fall calendar](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)                                                                                                                                        | September peak context; no daily curve                                       |
| S-006 | Wisconsin DNR, [2026 Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport) and [Root strain observations](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf) | Steelhead lifecycle and recurrence context only; Skamania timing is excluded from the implemented calendar |
| S-007 | Wisconsin DNR, [2026–2027 regulations](https://dnr.wisconsin.gov/topic/fishing/regulations)                                                                                                                                                            | night/refuge rule authority; release recheck                                 |
| S-008 | USGS, [`04087000`](https://waterdata.usgs.gov/monitoring-location/USGS-04087000/) APIs                                                                                                                                                                 | baseline/live measurements; Estabrook reach only                             |

## 8. Gate status

- [x] Fall opportunity separated from spring evidence.
- [x] Multi-strain calendar, endpoint, presence, and nonterminal completion
      implemented.
- [x] Stage, Fish In River, Fishability, Gauge Read, restrictions, and hidden
      registry implemented.
- [x] Observed Activity replay and private fixtures complete; public audit
      disabled.
- [x] Owner accepts the hidden Activity behavior and two-season limitation.

**Run decision:** `hidden_activity_owner_accepted`\
**Configuration:** `2026-08-27-milwaukee-steelhead-local-peak.6`
