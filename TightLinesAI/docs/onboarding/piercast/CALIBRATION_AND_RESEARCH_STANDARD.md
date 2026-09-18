# PierCast calibration and research standard

**Status:** mandatory for every future city, species, recalibration and release pass
**Adopted:** September 18, 2026
**Current comparison baseline:** [all-city common-species audit](all-city-common-species-audit-2026-09/AUDIT_REPORT.md)

**Michigan full-roster verification:** [72 scored pairs and 133 roster cells](michigan-all-scored-species-audit-2026-09/AUDIT_REPORT.md)

This document records how PierCast species and scores must be researched and calibrated. Read it before editing a city roster, a seasonal curve or a score. The purpose is to keep the scale consistent across cities and prevent missing data from becoming a hidden score penalty.

## Non-negotiable rules

1. Research the named city's public main-pier, breakwall or harbor-edge fishery. Do not substitute a charter, offshore, river, boat-ramp or neighboring-port fishery.
2. Reconsider the full catalog for every city. A short initial species list is a research queue, not a final roster.
3. Admit only species with recurring, intentional local pier opportunity and enough evidence to describe a defensible year-round shape.
4. Once a pair is admitted, determine its strength from the complete fishery record and same-species cross-city anchors. Missing effort, precision or a denominator belongs in the evidence grade and limitations. It must never lower the score.
5. If evidence cannot support admission or a seasonal shape, leave the pair unscored as an evidence hold. Do not invent a low number.
6. Keep peak magnitude, seasonal duration and confidence separate.
7. Scores must satisfy `1 ≤ score ≤ seasonalPotential ≤ F ≤ 10`. A displayed or stored score can never exceed 10.0.

## 1. Freeze the geographic and fishing-mode boundary

For each city, identify the public structures and contiguous harbor-edge water that the report represents. Record construction, closure, ownership and access limits as current context. Access limits do not erase biological opportunity, but the product must not imply access where none exists.

The evidence ledger must label every source's geography and mode. County pier evidence can support recurrence and relative magnitude when one port dominates or the limitation is disclosed. It cannot silently become exact-structure effort. Boat and offshore evidence can provide regional context but cannot set a pier score.

## 2. Build the complete species inventory

Review every catalog species against at least:

- agency creel or harvest data by site, port and fishing mode;
- agency weekly fishing reports and archives naming the city, pier, harbor or breakwall;
- agency access guides, management reports, stocking records and regulations;
- reputable local or specialist reports when primary sources do not resolve exact-pier timing.

Search historical and current records. Lake trout, whitefish, smelt, perch, pike, bass and drum require the same deliberate review as salmonids. Historical exact-pier evidence can establish a real fishery when current surveys miss its season, but the resulting limitation must be explicit.

Classify every city/species cell:

- **Numeric:** recurring intentional local pier opportunity, defensible magnitude, full-year seasonal modes, thermal curve and legal/access treatment.
- **Research hold:** meaningful lead or occurrence, but the local targetability, magnitude or annual shape is unresolved.
- **Exclude:** the reviewed record supports only another mode or geography, incidental presence, or no credible local pier fishery.

An unsupported cell receives no score. A no-score hold is not a suppressed rating.

## 3. Grade evidence without changing the score

- **Grade A:** direct site or port effort and catch/harvest across enough seasons to establish recurrence and relative magnitude.
- **Grade B:** recurring local or matched county pier evidence plus exact-city target evidence, with one important magnitude, allocation or seasonal denominator missing.
- **Grade C:** credible lead that remains inadequate for a numeric calibration.
- **Grade D:** excluded or mismatched evidence.

Grades A and B may receive numeric Formula v3 calibrations. Grade B is a confidence disclosure only. Never multiply `F`, `A` or the final score by a confidence factor.

Zero estimates need interpretation. A sampled zero can constrain magnitude when it covers the target fishery's actual place, mode and season. It cannot prove biological absence, and a warm-season zero cannot suppress a cold-season peak that the survey did not observe.

## 4. Calibrate the absolute peak `F`

`F` is the city/species/mode ceiling under the best recurring conditions. It is an absolute cross-city value, not the annual mean and not the weakest year.

Use this order:

1. Compare the same species and same mode, such as spring nearshore coho or fall harbor-staging Chinook.
2. Identify the closest supported stronger and weaker cities on the current scale. Name those anchors in the calibration record.
3. Compare direct magnitude, effort-normalized catch where available, positive-season recurrence, qualitative agency wording and exact-pier targeting.
4. Place the new value between the anchors or document why it is equal to one.
5. Check the result against the species-wide Great Lakes order. A genuinely elite recurring pier fishery may score in the 8s or 9s even when its prime window is brief.

Magnitude bands:

| `F` | Meaning under best recurring conditions |
|---:|---|
| 2.1–4.0 | Limited or inconsistent targetable opportunity |
| 4.1–6.0 | Real but ordinary targetable opportunity |
| 6.1–8.0 | Strong recurring fishery |
| 8.1–9.4 | Excellent recurring regional fishery |
| 9.5–10.0 | Reference-class opportunity; 10.0 is rare and evidence earned |

The current audited six-species order is machine-readable in [cross-city-rankings.csv](all-city-common-species-audit-2026-09/cross-city-rankings.csv). It covers Chinook, coho, steelhead, brown trout, lake trout and freshwater drum across all 17 established and onboarding cities. Use that file before adding or moving a value.

### Recalibrating an existing pair

When the pair peak changes but its researched seasonal modes remain valid, preserve each mode's relative distance from the Formula v3 floor:

```text
newModeF = 1 + (newPairPeak - 1) × (oldModeF - 1) / (oldPairPeak - 1)
```

Round only at the stored calibration precision, validate every mode in `2.1–10.0`, and rerun the full-year audit. This is how the September 2026 correction changed 18 Wisconsin salmonid peaks without flattening their spring, summer and fall relationships.

## 5. Put seasonal timing in `A`

`A` is recurring availability from 0 to 1. Build separate evidence-backed modes when a species has distinct spring, summer, fall or winter opportunities. The strongest mode wins; modes are never added.

A short elite run receives a high `F` and a narrow high-`A` window. An irregular shoulder receives lower `A`. Duration uncertainty is documented and, where justified, represented by a narrower curve. It is never converted into an across-the-board reduction of `F`.

Inspect all 365 dates, the December/January seam, peak date, ramp-in, ramp-out and off-season floor. Hard legal closures return unavailable rather than a biological score.

## 6. Apply temperature only as `T`

Formula v3 uses:

```text
seasonalPotential = 1 + (F - 1) × A
score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70T))
```

`T` is nearshore thermal suitability from 0 to 1. It modifies an admitted seasonal opportunity. It cannot create a fishery, increase the score above `seasonalPotential`, or increase the score above `F`.

The runtime rejects non-finite inputs, `F > 10`, `F < 2.1`, `A` outside 0–1, `T` outside 0–1, and `seasonalPotential > F`. The final calculation also clamps to 1–10. The rating formatter rejects any value outside the same range.

## 7. Required evidence record

Every numeric pair must preserve:

- source URL, publisher, title, date and locator;
- geography and fishing mode represented;
- exact claim used and permitted use;
- limitation and evidence grade;
- stronger and weaker cross-city anchors;
- chosen `F` and the reason for that placement;
- seasonal modes and knot dates;
- thermal curve source or inherited-species policy;
- regulation, closure and access handling;
- reason every plausible but unscored species was held or excluded.

Primary agency evidence controls when sources conflict. Reputable secondary evidence may resolve exact-pier timing but must not be presented as agency measurement.

## 8. Required audit before release

For every changed or new pair:

1. Generate all 365 dates at `T = 0`, `0.5` and `1`.
2. Assert `1 ≤ score(T=0) ≤ score(T=0.5) ≤ score(T=1) ≤ seasonalPotential ≤ F ≤ 10`.
3. Assert every mode has `2.1 ≤ F ≤ 10` and every knot has `0 ≤ A ≤ 1`.
4. Compare peaks and annual shapes with every established same-species city, not just the nearest city.
5. Verify closures, mode non-stacking, year-seam continuity and the intended peak date.
6. Regenerate the cross-city ranking and inspect every order change.
7. Run the PierCast v3 QA suite and a live/private manifest check appropriate to the release state.
8. Verify catalog visibility separately. A calibration artifact must never make an onboarding city public by accident.

The September 2026 baseline passed 171,550 invariant score checks. The five-city Pass 2 package separately audits 24 numeric pairs, 60 modes and 8,760 daily rows. Future work must meet or exceed those checks.

## 9. September 2026 correction to remember

The prior error lowered credible Wisconsin salmonid peaks because exact city effort denominators were missing. That treated Grade B confidence as a numeric penalty. The all-city audit found and corrected 18 established pairs. It retained lower lake-trout and drum values only where direct pier catch rates, recurrence or explicit agency magnitude supported those lower positions.

The durable rule is simple: **missing confidence information never suppresses an admitted score. Observed fishery weakness can lower a score. Insufficient admission evidence produces no score.**
