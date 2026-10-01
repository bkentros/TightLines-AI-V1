# PierCast Pentwater–Caseville Pass 2 report

Reviewed 2026-09-21. Status: complete private numeric-admission and full-year Formula v3 calibration package. No runtime, migration, public manifest, deployment, or app-build change was made.

## Outcome

All 90 user-facing Pass 1 cells were reopened, including every hold and exclusion. Every salmonid was reopened after the complete stocking and exact-port reviews. The result contains:

- **36 Grade A/B private numeric pairs**;
- **26 Grade C research holds**;
- **28 Grade D exclusions**;
- **52 evidence-backed seasonal modes**;
- **13,140 pair/date rows** and **65,700 score evaluations** at T = 0, 0.25, 0.5, 0.75, and 1.

Bluegill remains five fixed product-policy exclusions in a separate audit artifact and appears in no pair decision, score, mode, ranking, or user-facing matrix. The previously identified four legacy runtime pairs remain a release blocker for Pass 3; this private pass does not change runtime.

## Calibration correction

The focused correction demotes four qualitative-only pairs from numeric to Grade C holds, revises six peaks, and corrects the Caseville product boundary. Tawas Atlantic salmon and largemouth bass, plus Caseville yellow perch and burbot, remain unscored. Caseville coho, steelhead, and lake trout now receive conservative city-condition calibrations; these report conditions around Caseville and do not claim catches from a specific pier. Tawas steelhead, lake trout, walleye, yellow perch, and lake whitefish retain their lower cross-city placements; Charlevoix smallmouth remains the strongest reviewed smallmouth fishery at a corrected 8.4.

## Formula and evidence

`seasonalPotential = 1 + (F - 1) × A`

`score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70 × T))`

F is the best recurring city-level opportunity centered around the covered structures, A contains seasonal duration, and T contains thermal suitability. A score does not assert that a particular pier is fishable or that the species is repeatedly caught from that exact structure. Evidence confidence and stocking are disclosure/corroboration only. Modes compete and never stack.

## Every species, every city

### Pentwater

| Species | Peak F | Grade | Outcome |
|---|---:|:---:|---|
| Chinook salmon | **7.5** | A | 09-10 — fall harbor staging |
| Coho salmon | **7.2** | A | 04-15 — spring nearshore |
| Steelhead / rainbow trout | **8.3** | A | 07-20 — summer skamania |
| Brown trout | **7.3** | A | 04-10 — winter spring nearshore |
| Lake trout | — | C | Research hold |
| Walleye | **4.4** | B | 07-15 — warm season low light |
| Smallmouth bass | **6.4** | A | 07-20 — warm season channel |
| Freshwater drum | **5.4** | B | 07-15 — warm season channel |
| Yellow perch | **7.8** | A | 07-20 — summer pier schooling |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | C | Research hold |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | D | Exclude |
| Northern pike | — | C | Research hold |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |

### Rogers City

| Species | Peak F | Grade | Outcome |
|---|---:|:---:|---|
| Chinook salmon | **6.0** | B | 10-05 — fall harbor staging |
| Coho salmon | — | C | Research hold |
| Steelhead / rainbow trout | **6.0** | B | 04-25 — spring harbor |
| Brown trout | **5.8** | A | 04-20 — spring harbor |
| Lake trout | **5.1** | B | 04-20 — spring coldwater harbor |
| Walleye | **5.5** | B | 07-15 — warm season low light |
| Smallmouth bass | **6.5** | B | 07-20 — warm season channel |
| Freshwater drum | — | D | Exclude |
| Yellow perch | — | C | Research hold |
| Lake whitefish | — | D | Exclude |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | D | Exclude |
| Largemouth bass | — | D | Exclude |
| Atlantic salmon | **6.8** | B | 04-20 — winter spring harbor |
| Northern pike | — | C | Research hold |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |

### Tawas City

| Species | Peak F | Grade | Outcome |
|---|---:|:---:|---|
| Chinook salmon | — | C | Research hold |
| Coho salmon | **5.8** | B | 04-25 — spring harbor |
| Steelhead / rainbow trout | **5.8** | B | 04-25 — spring harbor |
| Brown trout | — | C | Research hold |
| Lake trout | **5.1** | B | 04-20 — spring coldwater harbor |
| Walleye | **6.5** | B | 07-15 — warm season low light |
| Smallmouth bass | **6.2** | B | 07-20 — warm season channel |
| Freshwater drum | — | C | Research hold |
| Yellow perch | **6.8** | B | 07-20 — summer pier schooling |
| Lake whitefish | **4.0** | B | 11-25 — late fall winter pier |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | D | Exclude |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | C | Research hold |
| Northern pike | **5.2** | B | 05-10 — spring fall harbor |
| Burbot | **4.3** | B | 02-15 — cold season night |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |

### Charlevoix

| Species | Peak F | Grade | Outcome |
|---|---:|:---:|---|
| Chinook salmon | **7.2** | A | 09-10 — fall harbor staging |
| Coho salmon | — | C | Research hold |
| Steelhead / rainbow trout | **7.5** | A | 07-20 — summer skamania |
| Brown trout | — | C | Research hold |
| Lake trout | **5.0** | A | 03-15 — winter spring pier |
| Walleye | **5.5** | A | 07-15 — warm season low light |
| Smallmouth bass | **8.4** | A | 07-20 — warm season channel |
| Freshwater drum | **5.4** | A | 07-15 — warm season channel |
| Yellow perch | **6.5** | A | 07-20 — summer pier schooling |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | C | Research hold |
| Northern pike | — | C | Research hold |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |

### Caseville

| Species | Peak F | Grade | Outcome |
|---|---:|:---:|---|
| Chinook salmon | — | C | Research hold |
| Coho salmon | **5.0** | B | 04-25 — spring harbor |
| Steelhead / rainbow trout | **4.5** | B | 04-25 — spring harbor |
| Brown trout | — | C | Research hold |
| Lake trout | **4.6** | B | 04-20 — spring coldwater harbor |
| Walleye | **6.2** | B | 07-15 — warm season low light |
| Smallmouth bass | **5.5** | B | 07-20 — warm season channel |
| Freshwater drum | — | D | Exclude |
| Yellow perch | — | C | Research hold |
| Lake whitefish | — | D | Exclude |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | D | Exclude |
| Largemouth bass | — | D | Exclude |
| Atlantic salmon | — | D | Exclude |
| Northern pike | — | C | Research hold |
| Burbot | — | C | Research hold |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |

## Major findings

- Pentwater admits eight numeric pairs. Steelhead leads at 8.3, perch at 7.8, and Chinook at 7.5. Lake trout, whitefish, round whitefish, catfish, largemouth bass, and pike remain holds rather than uncertainty scores.
- Rogers City admits seven pairs. Atlantic salmon is Grade B at 6.8 from exact breakwall guidance, historical Pier/Dock catch, and current recurrence; coho remains a hold because its evidence is still mainly offshore.
- Tawas City admits nine pairs. Walleye leads at a corrected 6.5; lake whitefish is 4.0 and burbot 4.3. Atlantic salmon and largemouth bass join Chinook and brown trout as Grade C holds because occurrence evidence did not resolve recurring covered-structure magnitude.
- Charlevoix admits seven pairs. Smallmouth bass remains the strongest reviewed smallmouth channel fishery at a corrected 8.4 from 25 positive catch years and exceptional measured magnitude. Cisco/lake herring remains a high-priority out-of-catalog contract review and receives no score.
- Caseville admits five pairs: walleye 6.2, smallmouth bass 5.5, coho 5.0, lake trout 4.6, and steelhead 4.5. The three salmonids are intentionally conservative city-condition calibrations. Chinook and brown trout remain holds, Atlantic remains excluded, and drum remains excluded because the reviewed evidence does not resolve a species-specific Caseville basis.

## Full-year and private boundary

Every numeric pair was audited for all 365 dates at all five required thermal fits. Bounds, monotonicity, mode non-stacking, peak magnitude, shoulders, off-season floors, December/January continuity, current regulation handling, and access separation pass. Scores remain research-only; Pass 3 has not begun.
