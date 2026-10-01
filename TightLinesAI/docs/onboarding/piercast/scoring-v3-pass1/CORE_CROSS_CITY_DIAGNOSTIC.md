# PierCast Scoring v3 — Core Cross-City Diagnostic

## Decision

The four species currently configured in every PierCast city—Chinook salmon, coho salmon, steelhead, and brown trout—must be recalibrated as four lake-wide comparison sets, not as nine independent city projects. The legacy curves are useful hypotheses, but they are not v3 anchors.

This review finds two distinct legacy problems:

1. **Magnitude and duration are fused.** A city can receive a high seasonal curve because it has a short exceptional event, a long ordinary fishery, or both; the existing value does not identify which claim is being made.
2. **Different opportunity modes are blended.** Spring nearshore, summer cold-water access, and fall harbor staging can appear as one broad annual curve even though they have different evidence and different relationships to surface temperature.

Formula v3 resolves those problems by assigning each supported mode an absolute fishery strength and a separate continuous seasonal availability function. The strongest active mode is used; modes are never added together.

## Reading this diagnostic

The values below are measurements of the current private curves across all 365 days of reference year 2025. They are not observed catch rates and are not proposed v3 values. `Strong days` means days when the legacy seasonal potential is at least `6.1`; `excellent days` means at least `8.1`.

The complete generated record is in [`legacy-curve-audit.json`](legacy-curve-audit.json). Evidence grades come from [`baseline-reconciliation.json`](baseline-reconciliation.json), and their meaning is defined in the [calibration contract](calibration-contract.json).

## Chinook salmon

| Legacy order | City | Maximum | Peak date | Strong days | Excellent days | Evidence grade |
|---:|---|---:|---|---:|---:|:---:|
| 1 | Frankfort–Elberta | 9.7 | Aug 16 | 70 | 44 | A |
| 2 | Sheboygan | 9.6 | Aug 31 | 63 | 34 | B |
| 3 | Manistee | 9.5 | Aug 30 | 52 | 25 | A |
| 4 | Ludington | 8.3 | Aug 30 | 32 | 8 | A |
| 5 | Grand Haven | 7.8 | Sep 8 | 33 | 0 | A |
| 6 | Racine | 7.4 | Aug 15 | 74 | 0 | B |
| 7 | Port Washington | 7.2 | Aug 15 | 69 | 0 | B |
| 8 | Milwaukee | 7.0 | Aug 15 | 68 | 0 | B |
| 9 | Kenosha | 6.7 | Aug 15 | 60 | 0 | B |

Frankfort–Elberta and Manistee are the first reference candidates because their upper-end claims have repeated exact-city Pier/Dock evidence. Sheboygan is a potential flagship fall-staging fishery, but its `9.6` cannot become a v3 anchor from a single exceptional report plus county-level annual harvest alone. Wisconsin DNR's September 7, 2026 report documents exceptionally high local pier/shore effort and many successful salmon anglers, while also documenting unsuccessful anglers and a rapid slowdown. That is strong event evidence, not a frequency denominator.[^1]

The four southern Wisconsin curves currently share similar mid-August peaks. Pass 1 must determine whether that similarity is genuinely supported or inherited from the expansion template. Their fall harbor-staging modes will be rebuilt from city evidence first; a common regional timing prior may interpolate only where local evidence is sparse.

**Required calibration decision:** establish the recurring frequency and typical duration of the exceptional Frankfort–Elberta, Manistee, and Sheboygan staging events before assigning any `9.5+` fishery strength.

## Coho salmon

| Legacy order | City | Maximum | Peak date | Strong days | Excellent days | Evidence grade |
|---:|---|---:|---|---:|---:|:---:|
| 1 | Grand Haven | 8.8 | Sep 10 | 82 | 15 | A |
| 2 | Frankfort–Elberta | 8.6 | Sep 15 | 67 | 14 | A |
| 3 | Manistee | 8.2 | Oct 5 | 60 | 3 | A |
| 4 | Kenosha | 8.0 | Apr 20 | 77 | 0 | B |
| 5 | Port Washington | 7.8 | Apr 20 | 79 | 0 | B |
| 6 | Sheboygan | 7.7 | Apr 15 | 152 | 0 | B |
| 7 | Milwaukee | 7.6 | May 20 | 72 | 0 | B |
| 8 | Racine | 7.6 | Apr 20 | 89 | 0 | B |
| 9 | Ludington | 5.6 | Oct 20 | 0 | 0 | A |

The table exposes why magnitude and availability must be separate. Sheboygan has the longest strong window—152 days—without the highest peak. That may represent multiple valid modes, an overly wide interpolated curve, or both. It cannot be accepted as one continuous high-opportunity event without mode-level support.

Grand Haven, Frankfort–Elberta, and Manistee currently express fall peaks. Southern Wisconsin primarily expresses spring peaks. These are not contradictory: they are different coho opportunities and should be calibrated as separate modes before being compared on the absolute scale.

Ludington's lower legacy ceiling is also an important control. Excellent temperature fit must not manufacture a Prime coho score when the local fishery-strength evidence supports only an ordinary opportunity. Full use of the `1–10` scale means that a reference-class fishery can reach 10; it does not mean every city/species pairing should.

**Required calibration decision:** split spring nearshore and fall staging evidence, then compare each mode separately across cities. Re-test Sheboygan's 152-day strong window and Ludington's low ceiling rather than automatically widening one or raising the other.

## Steelhead

| Legacy order | City | Maximum | Peak date | Strong days | Excellent days | Evidence grade |
|---:|---|---:|---|---:|---:|:---:|
| 1 | Manistee | 10.0 | Oct 28 | 102 | 39 | A |
| 2 | Frankfort–Elberta | 9.8 | Oct 16 | 81 | 23 | A |
| 3 | Grand Haven | 9.2 | Oct 30 | 149 | 63 | A |
| 4 | Ludington | 8.1 | Oct 20 | 42 | 1 | A |
| 5 | Sheboygan | 7.3 | Jul 15 | 106 | 0 | B |
| 6 | Racine | 5.7 | Jul 15 | 0 | 0 | B |
| 7 | Port Washington | 5.2 | Apr 15 | 0 | 0 | B |
| 8 | Milwaukee | 4.6 | Apr 15 | 0 | 0 | B |
| 9 | Kenosha | 4.3 | Apr 15 | 0 | 0 | B |

Manistee and Frankfort–Elberta are the first upper-end reference candidates. Grand Haven's 149 strong days and 63 excellent days are the largest duration claim in this species set, so it needs an explicit mode decomposition rather than automatic preservation. A spring thermal-front fishery, summer upwelling opportunity, and fall staging fishery may all be real while still not supporting a single broad excellent curve.

Michigan Sea Grant describes those seasonal thermal mechanisms and notes that temperature becomes less important as fish stage near river mouths in fall.[^2] That supports separate mode testing; it does not determine any city's strength. Local DNR pier evidence remains necessary for city magnitude.

Sheboygan's 106 strong days paired with a `7.3` maximum is another duration anomaly. The remaining Wisconsin cities currently do not enter the strong band at all. Pass 1 must determine whether this ordering reflects real city differences, incomplete exact-city evidence, or differing templates—not force the cities into a cosmetically even ladder.

**Required calibration decision:** construct and compare spring-front, summer-upwelling, and fall-staging modes independently. Retain a `10` only if Manistee remains reference-class after recurrence, effort, and duration are compared on the same basis.

## Brown trout

| Legacy order | City | Maximum | Peak date | Strong days | Excellent days | Evidence grade |
|---:|---|---:|---|---:|---:|:---:|
| 1 | Manistee | 8.2 | Apr 10 | 68 | 7 | A |
| 2 | Sheboygan | 7.8 | Apr 15 | 97 | 0 | B |
| 3 | Ludington | 7.6 | Apr 5 | 57 | 0 | A |
| 4 | Grand Haven | 7.6 | Apr 15 | 54 | 0 | A |
| 5 | Frankfort–Elberta | 7.5 | Apr 5 | 76 | 0 | A |
| 6 | Port Washington | 7.0 | Apr 1 | 38 | 0 | B |
| 7 | Racine | 6.7 | Apr 1 | 32 | 0 | B |
| 8 | Milwaukee | 6.6 | Apr 1 | 36 | 0 | B |
| 9 | Kenosha | 5.8 | Apr 1 | 0 | 0 | B |

Brown trout is the tightest legacy comparison set: eight cities peak within 1.6 points, and every city peaks in early or mid-April. Manistee is the provisional upper reference, but the evidence review must test whether spring is the only meaningful mode. Winter open-water harbor and fall harbor opportunities cannot be inferred merely by extending the April curve.

Sheboygan's 97 strong days is substantially longer than other current curves at a similar peak. That may be valid, but the duration needs recurring seasonal evidence. Kenosha's `5.8` ceiling keeps it outside the strong band and should remain below stronger fisheries if equivalent evidence supports that order; favorable water temperature alone should not erase the difference.

**Required calibration decision:** establish whether winter open-water, spring nearshore, and fall harbor modes are independently recurring at each city, then compare each mode's magnitude and duration on identical evidence standards.

## Cross-species calibration controls

The next research/calibration work must obey these controls:

1. **No legacy decimal survives by inertia.** A legacy value may be retained only after the v3 evidence packet independently arrives at it.
2. **Availability cannot substitute for strength.** A long season does not prove an excellent fishery, and a brief event does not prove a weak one.
3. **Temperature cannot create presence.** Thermal fit modifies a supported active mode; it cannot activate a locally unsupported fishery or month.
4. **Modes use a maximum, never a sum.** Overlapping modes cannot stack into an artificial 10.
5. **Confidence is not a multiplier.** Grade C claims are withheld from promotion instead of being displayed as mysteriously discounted ratings.
6. **The upper scale is evidence-gated.** `9.5–10.0` requires reference-class recurring opportunity, not a desire for every city to reach Prime.
7. **Each city may reach Prime through its best legitimate species.** There is no requirement that every species at every city can reach 10.
8. **Comparisons use equivalent modes.** Spring coho is compared with spring coho before it is compared with a fall staging mode.

## Outcome of this diagnostic

No final v3 number is approved here. The diagnostic nominates provisional reference candidates and identifies the legacy duration claims that must be disproved or supported first:

- **Reference candidates:** Frankfort–Elberta and Manistee Chinook; Grand Haven, Frankfort–Elberta, and Manistee coho; Manistee and Frankfort–Elberta steelhead; Manistee brown trout.
- **High-priority duration audits:** Sheboygan coho (152 strong days), Grand Haven steelhead (149), Sheboygan steelhead (106), Manistee steelhead (102), and Sheboygan brown trout (97).
- **Upper-end evidence audit:** Sheboygan Chinook's Grade B `9.6` comparator.
- **Low-ceiling controls:** Ludington coho and the four lower Wisconsin steelhead curves, which prevent favorable temperatures from being treated as evidence of a stronger local fishery.

These are the first comparison sets for the claim-level evidence normalization and mode construction stage. The production v2 configuration remains unchanged.

## Sources

[^1]: Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report: September 7, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” September 7, 2026.
[^2]: Michigan Sea Grant. “[Searching for Steelhead](https://www.michiganseagrant.org/lessons/lessons/by-broad-concept/life-science/searching-for-steelhead/).” Accessed September 14, 2026.
