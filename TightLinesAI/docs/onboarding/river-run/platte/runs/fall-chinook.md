# Platte River Fall Chinook River Run Profile

**River ID:** `platte` **Species slug:** `chinook` **Created/researched:**
2026-08-24 **Status:** `supported_hidden_review_correction`

## 0. Candidate capability audit

The prior search relied too heavily on omission from a current curated fishing
list. Michigan DNR Technical Report 91-1 directly records annual lower-Platte
Chinook returns from 1979 through 1990, a 1990 run of 1,761 fish spanning late
September through November, and identifies the fish as strays, hatchery
escapees, or natural reproduction. A 2024 DNR conservation-officer report also
documents an 18-pound king salmon retained from the Platte. This establishes a
real recurring run even though Chinook are not the river's principal stocked
salmon and current strength is lower-confidence than Coho.

**Capability decision:** `supported_hidden_review` **Contradiction search
completed by/date:** Codex / 2026-08-24 **Independent falsification review
by/date:** required before public enablement

## Truth decision

| Field                    | Decision                                                                                                                                                              | Evidence IDs        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Public catalog behavior  | Include in private review; do not publicly enable until corrected review gates pass                                                                                   | C-007, C-008        |
| Species occurrence       | Historic Lower Platte collections exist, including records from 1991–2007; a 2022 record is only Benzie/HUC scoped                                                    | C-002               |
| Current fall-run support | Supported hidden-review calibration: recurring DNR lower-weir history plus a current-era Platte king observation; current strength remains lower-confidence than Coho | C-003, C-007, C-008 |
| Hatchery inference       | Platte Hatchery producing Chinook does not prove those fish are stocked into or support a current Platte river run                                                    | C-004               |
| Barrier response         | Lower-weir Chinook handling/passage is unresolved; guidance may not cross the signed closure                                                                          | C-005, C-006        |
| Seasonal calendar        | Direct 1990 peak Sep. 23 and dominant Sep. 23–Oct. 17 interval support the corrected local calendar                                                                   | C-007               |
| Presence ceiling/curve   | Conservative 4/10 concentrated profile; exact anchors are documented product calibration                                                                              | C-007               |
| Activity                 | Hidden weather-only candidate implemented and replayed; pending fixtures, owner review, and enablement                                                                | C-007               |
| Fishability              | Unavailable; lower corridor has no accepted local hydraulics, independent of species support                                                                          | C-001               |
| Terminal/handoff         | Semelparous ending with no destination handoff                                                                                                                        | C-007               |

## Corrected hidden-review truth

- Run window: monitor August 15; stage August 20; sparse beginning September 15;
  direct peak September 23 and strongest interval through October 17; tail
  through November 30.
- Presence ceiling: conservative `4/10`, concentrated below the seasonal lower
  weir closure; this expresses relative opportunity, not a fish count.
- Why points: this is a recurring secondary run, not the Platte's signature Coho
  return; current DNR guidance omission and no direct stocking keep the ceiling
  conservative; lower-weir handling is unresolved.
- Guide's Read:
  `Choose a supported Platte species and check current Michigan
  DNR information.`
- Scope: show the hidden-review Stage and Fish In River states only below the
  signed closure. Activity and Fishability remain unavailable. Do not expose
  internal research/approval wording in production.

## Evidence ledger

| ID    | Authority/title                                                                                         | URL/path                                                                                                                             | Published/updated               | Accessed   | Facts/limitations                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| C-001 | Corrected Platte foundation                                                                             | ../river-foundation.md                                                                                                               | 2026-08-24                      | 2026-08-24 | Corrected Chinook support decision; exact sections/capability limits                                                  |
| C-002 | USGS NAS/GLANSIS — Chinook collections, HUC 04060104                                                    | https://nas.er.usgs.gov/queries/CollectionInfo.aspx?HUCNumber=04060104&SpeciesID=920&State=MI                                        | Records through 2022            | 2026-08-24 | Proves occurrence only; records do not establish current abundance/run/calendar; 2022 locality is not Platte-specific |
| C-003 | Michigan DNR — Better Fishing Waters                                                                    | https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters                                                        | Current 2026 page               | 2026-08-24 | Platte lists Coho/Steelhead, not Chinook; omission is conservative evidence, not proof of absence                     |
| C-004 | Michigan DNR — Platte River Hatchery & Weir                                                             | https://www.michigan.gov/dnr/managing-resources/fisheries/hatcheries/platte                                                          | Current 2026 page               | 2026-08-24 | Hatchery produces Chinook, but page does not establish a Platte Chinook run/stocking destination                      |
| C-005 | National Park Service — Platte River Point Water Access                                                 | https://www.nps.gov/places/000/platte-river-point-water-access.htm                                                                   | Updated 2025-08-28              | 2026-08-24 | Lower weir can stop migrating salmon; no species handling detail                                                      |
| C-006 | Michigan DNR — 2026 Michigan Fishing Regulations                                                        | https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf | Effective 2026-04-01–2027-03-31 | 2026-08-24 | Signed 300-ft weir closure rule; regulation coverage does not prove run support                                       |
| C-007 | Michigan DNR — _Platte River Harvest Weir and Coho Salmon Egg-Take Report, 1990_, Technical Report 91-1 | https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/TechnicalReports/TR91-1.pdf                                             | 1991                            | 2026-08-24 | Recurring 1979-90 Chinook returns; 1990 run timing, total, peak, passage, and origin explanation                      |
| C-008 | Michigan DNR — Conservation officer report, 9/15-9/28/2024                                              | https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2024/9-15-2024-9-28-2024                                     | 2024                            | 2026-08-24 | Direct current-era Platte king salmon occurrence                                                                      |

**Run decision:** `supported_hidden_review`; the earlier unsupported decision is
withdrawn. **Configuration version:** `platte-phase-c-draft.3` **Presence
version:** `platte-fall-chinook-presence-v3-draft` **Activity:**
`platte-fall-chinook-weather-activity-v1-draft`, Limited weather-only lower
corridor candidate. Final replay:
`docs/audits/river-run-platte-chinook-weather-activity-replay.json`. Calibration
decision record:
`docs/audits/river-run-grand-platte-white-activity-calibration-2026-08-24.md`.
pending local calibration **Owner acceptance:** corrected profile available for
renewed hidden review 2026-08-24.
