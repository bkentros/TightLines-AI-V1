# PierCast five-city onboarding — Pass 2 scoring audit

Reviewed and recalibrated September 17, 2026. Scope: Two Rivers, Kewaunee, Algoma, and Manitowoc, Wisconsin; Waukegan, Illinois.

## Decision

Pass 2 is complete as a **private Formula v3 research package**. No city, species, score, or report was made visible in the application. Public release remains blocked until the owner explicitly approves “go live.”

The initial scoring draft was rejected during review because it improperly compressed evidence uncertainty into the fishery-strength ceiling. The correction applies the frozen cross-city rubric, keeps Grade B uncertainty separate, and compares each new pairing with established Great Lakes ports. The mandatory standard and correction record are in `CALIBRATION_STANDARD.md`.

The complete 95 city × catalog-species screen now contains:

- **24 numeric private-shadow pairings**, all evidence grade B;
- **20 investigated occurrence leads held without a score**, evidence grade C;
- **51 rows excluded from the roster**, evidence grade D;
- **60 seasonal opportunity modes**;
- **8,760 daily audit rows**: 365 dates for every numeric pairing at thermal fits 0, 0.5, and 1;
- **46 legally closed Waukegan perch dates**, May 1 through June 15.

Grade B means recurring local or county pier-mode evidence plus exact-city target evidence exists, while one important magnitude, city allocation, or seasonal denominator remains missing. It does not lower the score. The decimals are bounded PierCast calibration judgments, not agency ratings, abundance estimates, or catch probabilities.

## Recalibrated private score ceilings

`F` is the maximum Formula v3 score when the supported mode reaches full recurring availability and thermal fit is ideal. A high `F` may describe a short prime window; it does not claim that the score stays high for a month.

| City | Species | Previous | Revised `F` | Primary peak | Cross-city placement |
|---|---|---:|---:|---|---|
| Two Rivers | Chinook salmon | 5.8 | **8.4** | Sep 5 | Above Ludington 8.3; below Manitowoc 8.5 and elite Kewaunee/Algoma/Sheboygan ports. |
| Two Rivers | Coho salmon | 4.5 | **7.1** | Oct 5 | Strong; below corrected southern-Wisconsin 8.2–8.6 spring ports. |
| Two Rivers | Steelhead | 5.2 | **7.3** | Oct 25 | Below corrected Sheboygan/Kewaunee 7.8 and Algoma/Racine 7.7. |
| Two Rivers | Brown trout | 5.1 | **7.2** | Apr 10 | Below corrected Port Washington 8.1 and Sheboygan 7.8. |
| Kewaunee | Chinook salmon | 6.4 | **9.1** | Sep 5 | Elite regional; below Sheboygan 9.4 and the 9.5+ reference class. |
| Kewaunee | Coho salmon | 4.8 | **6.8** | Oct 5 | Strong but below the southern-Wisconsin spring-coho anchors. |
| Kewaunee | Steelhead | 5.1 | **7.8** | Oct 25 | Excellent; equal to corrected Sheboygan 7.8 and below Ludington 8.1. |
| Kewaunee | Brown trout | 5.2 | **7.4** | Apr 10 | Below corrected Port Washington 8.1 and Sheboygan 7.8. |
| Kewaunee | Lake trout | 3.2 | **4.2** | Oct 25 | Real ordinary pier opportunity; above western-Michigan 3.6–4.0 modes but below Lake Huron 4.6–5.5. |
| Algoma | Chinook salmon | 6.0 | **9.0** | Sep 5 | Elite regional; just below Kewaunee 9.1 and Sheboygan 9.4. |
| Algoma | Coho salmon | 4.7 | **7.0** | Oct 5 | Strong; below southern-Wisconsin spring-coho anchors. |
| Algoma | Steelhead | 5.1 | **7.7** | Oct 25 | Excellent; equal to corrected Racine 7.7 and just below Sheboygan/Kewaunee 7.8. |
| Algoma | Brown trout | 4.4 | **7.6** | Apr 10 | Equal to Ludington/Grand Haven; below Sheboygan 7.8. |
| Manitowoc | Chinook salmon | 6.2 | **8.5** | Sep 5 | Excellent; above Ludington 8.3 and below Kewaunee/Algoma. |
| Manitowoc | Coho salmon | 5.0 | **7.2** | Oct 5 | Strong; above Two Rivers 7.1 and below the southern-Wisconsin anchors. |
| Manitowoc | Steelhead | 5.1 | **7.2** | Oct 25 | Below corrected Sheboygan 7.8. |
| Manitowoc | Brown trout | 5.0 | **7.2** | Apr 10 | Below corrected Port Washington 8.1 and Sheboygan 7.8. |
| Manitowoc | Smallmouth bass | 4.6 | **5.8** | Jun 20 | Equal to Ludington; below Grand Haven 7.0. |
| Manitowoc | Northern pike | 4.2 | **5.2** | Sep 20 | Equal to Ludington and near Port Sanilac 5.1. |
| Waukegan | Chinook salmon | 6.1 | **7.6** | Sep 5 | Strong; above corrected Kenosha 7.4 and below the central-Wisconsin excellent ports. |
| Waukegan | Coho salmon | 8.0 | **8.8** | Apr 20 | Excellent; equal to Grand Haven and above corrected Kenosha 8.6. |
| Waukegan | Steelhead | 5.2 | **6.8** | Oct 25 | Strong; above corrected Port Washington 6.6 and below Oscoda 7.4/Racine 7.7. |
| Waukegan | Brown trout | 4.7 | **7.0** | Nov 20 | Strong; below corrected Port Washington 8.1 and Sheboygan 7.8. |
| Waukegan | Yellow perch | 4.3 | **5.4** | Apr 15 | Equal to Kenosha; below the stronger Michigan perch ports. |

## Why the new upper scores are warranted

- The Wisconsin DNR's September 2026 creel report records active pier trout/salmon targeting at Algoma and Kewaunee and roughly ten pier Chinook in Manitowoc County during that report period.
- The November 2025 exact-pier report records Chinook, coho, and rainbow trout at Algoma and Chinook, brown trout, and steelhead at Kewaunee.
- A historical DNR fisheries-team report provides comparative event strength: Two Rivers/Manitowoc pier fishing ranged from one or two fish to six-to-eight salmon plus brown trout in a morning; Algoma began the week with many anglers catching Chinook, coho, and brown trout; Sheboygan produced fair numbers. It is event evidence rather than an annual rate, but it establishes that these piers can produce excellent prime conditions.
- Wisconsin's 2024 report says Chinook harvest was the strongest since 2012 and rainbow harvest was above its ten-year average. Kewaunee County, which combines Algoma and Kewaunee, led Wisconsin in total Chinook and rainbow catch. Total harvest does not transfer directly to piers, but it corroborates the local fishery after exact-pier admission.
- Illinois Natural History Survey estimates show Waukegan Harbor pedestrians harvested 2,493 coho in 2023 and 1,893 in 2024 with heavy salmon-directed effort. That supports the 8.8 spring coho placement. Chinook, steelhead, brown trout, and perch remain lower because their direct magnitude records are smaller or seasonally incomplete.

## Full-year and bounds audit

Every numeric pairing was evaluated on all 365 dates with thermal fit `T = 0`, `0.5`, and `1`. The generator verifies:

```text
1 ≤ score(T=0) ≤ score(T=0.5) ≤ score(T=1) ≤ F ≤ 10
```

Seasonal modes are selected by maximum and never added. Waukegan perch is unavailable on all 46 closure dates. The recalibrated ideal-temperature results include:

- Kewaunee and Algoma Chinook peak at 9.1 and 9.0, with 16 dates at or above 8 under ideal thermal fit;
- Manitowoc and Two Rivers Chinook peak at 8.5 and 8.4, with 8 and 6 dates at or above 8;
- Waukegan coho peaks at 8.8, with 18 dates at or above 8;
- lake trout, smallmouth, pike, and perch retain ordinary ceilings where the pier evidence supports a real fishery but not an excellent one.

The generated daily file provides the entire annual trace. A peak is not extrapolated into an unsupported year-round rating.

## Lake-trout audit

| City | Result | Evidence boundary |
|---|---|---|
| Two Rivers | Grade C, no score | Older Manitowoc County pier positives cannot be divided between Two Rivers and Manitowoc; county estimates were zero in 2022–24. |
| Kewaunee | Grade B, **F 4.2** | Historic exact-pier targeting and older county recurrence support a real cold-season fishery. Recent county pier zeros prevent a strong score; offshore abundance is excluded. |
| Algoma | Grade C, no score | The historical source says nearshore rather than assigning lake trout to the pier, and the county combines Algoma with Kewaunee. |
| Manitowoc | Grade C, no score | Older county pier positives establish plausible occurrence but cannot separate Manitowoc from Two Rivers; 2022–24 are zero. |
| Waukegan | Grade C, no score | Illinois DNR describes lake trout as usually offshore with occasional winter shore access; the 2023/24 Waukegan pedestrian estimates are zero and omit most of winter. |

Lake trout was evaluated separately for every city. The no-score decisions preserve genuine research leads rather than declaring the species absent.

## Perch, whitefish, and smelt

Wisconsin DNR county pier perch estimates were 0/0/0 for Kewaunee County and 0/0/3 for Manitowoc County in 2022–24. Because each county combines two target cities, perch remains Grade C at the four Wisconsin ports. Manitowoc's historical exact-pier report remains recorded as a lead.

Waukegan perch qualifies at **F 5.4**. Its 460 estimated pedestrian harvest in 2023 and zero estimate in 2024 establish a real but variable fishery. May 1–June 15 is legally unavailable.

Waukegan lake whitefish and round whitefish remain Grade C. Presence, advisories, and regulations do not establish recurring Government Pier targeting. Rainbow smelt remains a valid March–April Waukegan-area net fishery outside the current 19-species rod-and-line catalog; it should appear as a legal-method note rather than receive an invented rod score.

## Held leads

All 20 Grade C leads remain visible in `research-holds.csv` and `pair-decisions.json`, including lake trout at four cities, Wisconsin perch at all four ports, Two Rivers/Kewaunee/Algoma smallmouth and pike leads, and Waukegan whitefish, smallmouth, drum, largemouth, and bluegill. A future exact-pier dataset can promote a row without repeating the full 95-pair screen.

## Access and privacy

- Algoma remains fully modeled. Construction or closure status is separate access metadata; no report may imply that a closed segment is fishable.
- Pass 3 must perform a current segment/signage check for all five cities before access recommendations are approved.
- No runtime configuration, database seed, public city list, or production deployment changed in Pass 2.
- Pass 3 must use the owner-only review path for `brandonkentros@icloud` and verify that normal users cannot discover any of the five cities before explicit go-live approval.

## Artifacts

- `CALIBRATION_STANDARD.md`: mandatory cross-city rubric, anchors, correction, and guardrails.
- `calibration-comparison.csv`: every relevant established comparator plus all 24 new private rows.
- `pair-decisions.json`: all 95 dispositions, grades, source IDs, and reasons.
- `private-mode-calibrations.json`: 60 private Formula v3 modes.
- `full-year-daily-audit.csv`: 365 dates × 24 pairs under three thermal scenarios.
- `monthly-checkpoints.csv`: compact January–December review points for all 24 pairs and all three thermal scenarios.
- `score-summary.csv`: previous/revised ceilings, deltas, dates, and threshold-day counts.
- `measured-anchors.json`: published values kept separate from PierCast estimates.
- `source-addendum.json`: normalized sources and permitted-use limits.
- `cross-city-audit.json`: invariants, summaries, and established comparators.
- `research-holds.csv`: every nonnumeric lead and reason.
- `generate-audit.mjs`: deterministic regeneration and invariant checks.

## Pass 3 readiness

The corrected evidence and scoring package is ready for Pass 3. Pass 3 can import these 24 rows into the private owner-review configuration, build all five full reports, generate representative-date outputs, and run owner-versus-normal-user acceptance checks. No Grade C row may receive an invented score, and none of the cities may be published before explicit owner go-live approval.
