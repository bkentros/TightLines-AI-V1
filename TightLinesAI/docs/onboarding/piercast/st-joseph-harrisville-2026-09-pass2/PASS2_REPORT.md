# PierCast St. Joseph–Harrisville Pass 2 report

Reviewed 2026-09-19. Status: complete private research calibration package. No runtime, migration, public-manifest, deployment, or app-build change was made.

## Decision

All 95 Pass 1 catalog cells were reopened. The final private research roster contains:

- **49 numeric Grade A/B pairs**;
- **20 Grade C research holds**;
- **26 Grade D/policy exclusions**;
- **81 seasonal opportunity modes**;
- **17,885 full-year pair/date rows** at five thermal-fit values.

Bluegill remains in the 95-cell audit only for traceability. Per product direction, it is excluded from user-facing PierCast in all five cities and has no score or mode.

## Formula

`seasonalPotential = 1 + (F - 1) × A`

`score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70 × T))`

F is prime recurring strength, A contains seasonal timing, T contains thermal suitability, and evidence confidence is disclosure only. Modes compete by maximum seasonal potential and never stack.

## Every species, every city

### St. Joseph

| Species | Peak F | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **6.8** | B | 07-20 — summer pier |
| Coho salmon | **8.6** | B | 04-15 — spring nearshore |
| Steelhead | **7.8** | B | 07-20 — summer skamania pier |
| Brown trout | **6.5** | B | 04-10 — winter spring nearshore |
| Lake trout | **4.1** | B | 03-15 — winter spring pier |
| Walleye | — | C | Research hold |
| Smallmouth bass | — | C | Research hold |
| Freshwater drum | — | C | Research hold |
| Yellow perch | **6.0** | B | 07-20 — summer pier schooling |
| Lake whitefish | **4.0** | B | 11-20 — late fall pier |
| Round whitefish | — | C | Research hold |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | D | Exclude |
| Atlantic salmon | — | D | Exclude |
| Northern pike | — | C | Research hold |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |
| Bluegill | — | D | Product-policy exclude |

### South Haven

| Species | Peak F | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **7.0** | A | 09-10 — fall harbor staging |
| Coho salmon | **7.8** | A | 04-15 — spring nearshore |
| Steelhead | **8.8** | A | 07-15 — summer skamania pier |
| Brown trout | **6.5** | A | 04-10 — winter spring nearshore |
| Lake trout | **3.8** | A | 10-20 — fall nearshore |
| Walleye | **4.3** | A | 05-15 — spring low light |
| Smallmouth bass | **5.2** | A | 07-20 — warm season harbor |
| Freshwater drum | **6.5** | A | 07-15 — warm season harbor |
| Yellow perch | **5.4** | A | 07-20 — summer pier schooling |
| Lake whitefish | **4.0** | B | 11-20 — late fall pier |
| Round whitefish | **3.7** | B | 10-20 — fall channel |
| Channel catfish | **5.2** | A | 08-20 — warm season channel |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | D | Exclude |
| Northern pike | **4.8** | A | 05-01 — spring harbor |
| Burbot | — | D | Exclude |
| White perch | — | C | Research hold |
| White bass | — | C | Research hold |
| Bluegill | — | D | Product-policy exclude |

### Holland

| Species | Peak F | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **7.8** | A | 09-10 — fall harbor staging |
| Coho salmon | **7.0** | B | 04-15 — spring nearshore |
| Steelhead | **7.3** | A | 07-20 — summer pier |
| Brown trout | **7.2** | A | 04-10 — winter spring nearshore |
| Lake trout | **3.8** | B | 03-15 — winter spring pier |
| Walleye | **4.5** | B | 08-15 — summer low light |
| Smallmouth bass | **5.2** | B | 07-20 — warm season harbor |
| Freshwater drum | **5.8** | B | 07-15 — warm season harbor |
| Yellow perch | **7.6** | A | 07-20 — summer pier schooling |
| Lake whitefish | **4.0** | B | 11-20 — late fall pier |
| Round whitefish | — | C | Research hold |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | D | Exclude |
| Northern pike | — | C | Research hold |
| Burbot | — | D | Exclude |
| White perch | — | C | Research hold |
| White bass | — | C | Research hold |
| Bluegill | — | D | Product-policy exclude |

### Lexington

| Species | Peak F | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **5.6** | A | 10-05 — fall harbor staging |
| Coho salmon | **6.8** | A | 04-20 — spring harbor |
| Steelhead | **8.8** | A | 04-25 — spring harbor |
| Brown trout | **5.0** | A | 04-20 — spring harbor |
| Lake trout | **4.8** | B | 04-20 — spring coldwater harbor |
| Walleye | **5.8** | A | 08-15 — summer low light |
| Smallmouth bass | **6.0** | A | 07-20 — warm season harbor |
| Freshwater drum | **4.8** | A | 07-15 — warm season harbor |
| Yellow perch | **8.5** | A | 11-10 — fall harbor schooling |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | C | Research hold |
| Channel catfish | **4.3** | B | 08-20 — warm season channel |
| Largemouth bass | **5.6** | A | 08-15 — warm season harbor |
| Atlantic salmon | **8.0** | A | 10-20 — fall harbor return |
| Northern pike | **6.0** | A | 05-01 — spring harbor |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | **5.5** | B | 06-20 — warm season schooling |
| Bluegill | — | D | Product-policy exclude |

### Harrisville

| Species | Peak F | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **6.6** | A | 10-05 — fall harbor staging |
| Coho salmon | **6.2** | B | 10-10 — fall docks |
| Steelhead | **5.7** | B | 04-25 — spring harbor |
| Brown trout | **5.0** | B | 11-25 — late fall winter harbor |
| Lake trout | — | C | Research hold |
| Walleye | — | C | Research hold |
| Smallmouth bass | — | D | Exclude |
| Freshwater drum | — | D | Exclude |
| Yellow perch | — | D | Exclude |
| Lake whitefish | — | D | Exclude |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | D | Exclude |
| Atlantic salmon | **5.8** | B | 02-15 — winter harbor |
| Northern pike | — | D | Exclude |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |
| Bluegill | — | D | Product-policy exclude |

## Major findings

- St. Joseph admits the seven species explicitly identified by DNR at the pier. Coho is strongest at 8.6; the unresolved dashboard label keeps evidence Grade B but does not suppress admitted strength.
- South Haven admits 13 species. Steelhead leads at 8.8, followed by coho 7.8; drum remains strong at 6.5. Largemouth bass is demoted to a hold because two positive years do not establish recurrence.
- Holland admits 10 species. Chinook 7.8 and perch 7.6 lead. Lake Macatawa warmwater evidence was not transferred to the covered north pier/channel.
- Lexington admits 14 species biologically. Steelhead 8.8, perch 8.5, and Atlantic salmon 8.0 are the strongest, but the active marina closure independently blocks current access.
- Harrisville admits five Grade A/B biological pairs: Chinook 6.6, coho 6.2, Atlantic 5.8, steelhead 5.7, and brown trout 5.0. Lake trout and walleye remain unscored because recent strength is not allocated to covered dock/shore fishing.

## Full-year audit

Every numeric pair was evaluated on all 365 dates at T = 0, 0.25, 0.5, 0.75, and 1. The audit verifies monotonic thermal response, formula bounds, non-stacking modes, peak F, annual shoulders, access gates, and the December/January seam. Lexington construction-closure dates are labeled unavailable and never receive a user-facing score.

## Private boundary

The package creates research artifacts only. It does not alter the current 22-city public catalog, add runtime calibrations, create migrations or archives, approve NOAA cells, deploy functions, or build the app. Pass 3 has not begun.
