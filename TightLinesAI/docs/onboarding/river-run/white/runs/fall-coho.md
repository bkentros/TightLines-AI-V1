# White River Fall Coho River Run Profile

**River ID:** `white`

**Species slug:** `coho`

**Created / researched:** 2026-08-24

**Status:** `visible_disabled_owner_decision`

## 1. Owner decision

Coho remains visible in the White River species catalog but disabled for this
pass. The owner approved this treatment on 2026-08-24.

Public label: `Not available`

Public reason: `White River Coho are documented only occasionally, so a
dependable fall run profile is not available.`

This is not a claim that Coho are absent. Current MDNR evidence documents annual
migration and wild fish in accessible tributaries, but says Coho are only
occasionally caught. MDNR's current Better Fishing Waters list names White
River Chinook and Steelhead but not Coho. That evidence is insufficient for a
defensible public calendar, curve, opportunity ceiling, or section progression.

## 2. Disabled capability contract

| Capability | Decision | Public/runtime requirement |
| --- | --- | --- |
| Species catalog row | visible-disabled | Show the public label and reason; do not route into a River Run detail surface |
| Seasonal calendar | not applicable | No inferred dates or states |
| Migration Stage | not applicable | No label, section recommendation, score, or marker |
| Fish In River | not applicable | No ceiling, curve, value, direction, or marker |
| Activity | not applicable | No score or time-block recommendation; do not reuse Chinook or Steelhead rules |
| Fishability | not applicable for this disabled run | Do not expose a run-specific primitive |
| Gauge Read | river-level capability only | If shown elsewhere, retain separate Fruitvale flow and below-Hesperia temperature attribution; never imply a Coho Activity score |
| Barrier | hard endpoint | Any future run remains below the downstream face of Hesperia Dam |
| Handoff | none | No destination experience exists |

No foreign dates, rules, copy, curves, weights, caps, or thresholds may be
borrowed to make the disabled row appear complete.

## 3. Required disabled-state acceptance

- [ ] White River species selection shows Coho as visible and disabled.
- [ ] The exact public reason fits supported narrow-screen layouts.
- [ ] Disabled control cannot be selected by tap, keyboard, deep link, saved
      state, notification, or stale cache.
- [ ] No Stage, Activity, Fish In River, Fishability, score, marker, section,
      or best-time block is rendered.
- [ ] No analytics event records a Coho run as enabled or viewed.
- [ ] Public copy does not say Coho are absent, extinct, closed, unsafe, or
      prohibited.
- [ ] Hesperia Dam remains the hard upstream endpoint in any internal metadata.
- [ ] Fresh, partial, delayed, stale, and missing Gauge Read states cannot
      accidentally enable Coho or produce an Activity score.
- [ ] Foreign river/species denylist and enabled-species registry tests pass.

No historical Activity or Fishability replay is required for a disabled run.
The acceptance artifact must instead prove the disabled contract above.

## 4. Evidence ledger

| ID | Authority / title | Published / accessed | Facts supported | Limitations |
| --- | --- | --- | --- | --- |
| CO-001 | Michigan DNR, [Lower White River Status Report 0460](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0460_2026_Lower_White_River.pdf) | 2026 / 2026-08-24 | Annual Coho migration, wild tributary fish, occasional catch, desire for a larger run, corridor and Hesperia barrier | Presence evidence does not establish a dependable public opportunity profile |
| CO-002 | Michigan DNR, [Better Fishing Waters](https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters) | current / 2026-08-24 | White River list includes Chinook and Steelhead but omits Coho | Curated list; omission is corroboration of sparse status, not proof of absence |
| CO-003 | Michigan DNR, [White Lake Status Report](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Status/2024/White-Lake-Muskegon-County-2024-360.pdf) | 2024 / 2026-08-24 | Migratory Coho use White Lake/White River system; Hesperia limits migration | System-level presence, no White River opportunity curve |

## 5. Run gate

**Run decision:** `disabled_for_this_pass`

**Configuration version:** `not_implemented`

**Activity rules version:** `not_applicable`

**Presence curve version:** `not_applicable`

**Copy version:** `white_coho_visible_disabled_v1_research`

**Replay artifact:** `disabled_contract_fixture_not_generated`

**Owner acceptance/date:** `approved_visible_disabled / 2026-08-24`

Reconsideration requires new White-specific evidence, a defensible calendar and
ceiling, full Phase C replay/copy acceptance, and a new explicit owner decision.
