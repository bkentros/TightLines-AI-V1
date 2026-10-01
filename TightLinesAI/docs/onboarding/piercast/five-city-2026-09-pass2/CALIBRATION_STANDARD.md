# PierCast absolute cross-city calibration standard

Reviewed September 17, 2026. This standard is mandatory for the five-city onboarding and for future city scoring audits.

## What the score means

PierCast Formula v3 is:

```text
score = 1 + (F - 1) × A × (0.30 + 0.70T)
```

- `F` is the absolute cross-city ceiling for a supported city, species, and fishing mode under its best recurring conditions.
- `A` is recurring seasonal availability on the date. It expresses when the fishery is active and how narrow the prime window is.
- `T` is nearshore thermal fit. It can reduce the realized score but cannot create or strengthen an unsupported fishery.
- Eligible modes are compared and the strongest is used. Modes are never added.

The rating describes intentional fishing opportunity from the named city's public pier or harbor-edge context. It is not a catch probability, agency rating, abundance estimate, access guarantee, river score, charter score, or offshore score.

## Frozen magnitude bands

| `F` | Meaning at full seasonal availability and ideal temperature |
|---:|---|
| 1.0–2.0 | Negligible or rare intentional main-pier opportunity |
| 2.1–4.0 | Limited or inconsistent opportunity |
| 4.1–6.0 | Real but ordinary targetable opportunity |
| 6.1–8.0 | Strong recurring fishery |
| 8.1–9.4 | Excellent recurring regional fishery |
| 9.5–10.0 | Reference-class opportunity under exceptional alignment; 10 remains rare |

## Required calibration procedure

1. **Admit the pairing first.** A numeric row needs identified species, named-city main-pier geography, pier or harbor-edge mode, recurring targetability, a defensible full-year shape, a usable thermal mode, and reviewed regulation/access metadata.
2. **Start with the same species and mode, then check the absolute species scale.** Spring nearshore coho is first compared with spring nearshore coho. Fall staging Chinook is first compared with fall staging Chinook. The result is then checked against that species' established full-lake high and low anchors. Offshore lake trout never sets a pier lake-trout value.
3. **Place `F` between established ports.** The evidence record must name the closest stronger and weaker anchors or explain an equality. `F` reflects the best recurring opportunity, rather than annual average catch or the weakest observed year.
4. **Put timing and recurrence in `A`.** A brief but genuinely elite staging event may have a high `F` and a narrow availability curve. Duration uncertainty must not be converted into a lower ceiling.
5. **Keep confidence separate.** Grade B means an important magnitude or seasonal denominator is missing. It does not multiply or discount `F`. The grade and limitation carry the uncertainty.
6. **Do not transfer fisheries across boundaries.** Boat, charter, offshore, county-total, river, stocking, electrofishing, and neighboring-port data can corroborate context but cannot independently determine a city pier ceiling.
7. **Audit the whole year.** Evaluate every date under thermal fits `0`, `0.5`, and `1`; enforce legal closures; verify `1 ≤ score ≤ seasonal potential ≤ F ≤ 10`; inspect peak date, shoulder shape, weak season, and cross-city order.

## Established anchor set used in this audit

These are the September 2026 Formula v3 ideal-temperature peaks, not new estimates.

| Species | Reference anchors used |
|---|---|
| Chinook | Frankfort–Elberta 9.7; Manistee 9.5; Sheboygan 9.4; Port Washington 8.6; Ludington 8.3; Racine 8.1; Grand Haven/Milwaukee 7.8; Kenosha 7.4 |
| Coho | Grand Haven 8.8; Frankfort–Elberta/Kenosha 8.6; Port Washington/Racine 8.5; Manistee/Milwaukee/Sheboygan 8.2; Ludington 5.6 |
| Steelhead | Manistee 10.0; Frankfort–Elberta 9.8; Grand Haven 9.2; Ludington 8.1; Sheboygan 7.8; Racine 7.7; Port Washington 6.6; Milwaukee 5.8; Kenosha 5.6 |
| Brown trout | Manistee 8.2; Port Washington 8.1; Sheboygan 7.8; Ludington/Grand Haven 7.6; Frankfort–Elberta 7.5; Milwaukee 7.4; Racine 7.3; Kenosha 6.4 |
| Lake trout | Port Sanilac 5.5; Harbor Beach 5.3; Oscoda 4.6; Manistee/Frankfort–Elberta 4.0; Ludington 3.8; Grand Haven 3.6 |
| Yellow perch | Ludington 7.6; Grand Haven/Manistee 7.2; Kenosha 5.4; Port Sanilac 5.0; Racine 4.8 |
| Smallmouth bass | Grand Haven 7.0; Ludington 5.8; Port Sanilac 5.4; Manistee 5.0 |
| Northern pike | Ludington 5.2; Port Sanilac 5.1; Oscoda/Manistee 5.0; Frankfort–Elberta 4.5 |

The full machine-readable comparison is in `calibration-comparison.csv`.

## Five-city ordering decisions

| Species | Five-city order and reason |
|---|---|
| Chinook | Kewaunee 9.1, Algoma 9.0, Manitowoc 8.5, Two Rivers 8.4, Waukegan 7.6. Kewaunee/Algoma receive elite but sub-Sheboygan peaks because current exact-pier reports recur inside Wisconsin's leading 2024 Chinook county. Manitowoc/Two Rivers have documented strong pier events but less exact current allocation. Waukegan is strong and remains below the central-Wisconsin staging ports. |
| Coho | Waukegan 8.8, Manitowoc 7.2, Two Rivers 7.1, Algoma 7.0, Kewaunee 6.8. Waukegan has two current site-level pedestrian surveys with 2,493 and 1,893 estimated coho harvest. The Wisconsin ports remain below the established southern-Wisconsin spring-coho anchors because their direct magnitude record is thinner. |
| Steelhead | Kewaunee 7.8, Algoma 7.7, Two Rivers 7.3, Manitowoc 7.2, Waukegan 6.8. Exact target evidence and county-pier recurrence place Kewaunee with corrected Sheboygan 7.8, Algoma with corrected Racine 7.7, and the remaining ports below those anchors. Waukegan's survey coverage gap remains a Grade B limitation rather than a score multiplier. |
| Brown trout | Algoma 7.6, Kewaunee 7.4, Two Rivers/Manitowoc 7.2, Waukegan 7.0. The order follows exact pier reporting and the corrected Port Washington 8.1/Sheboygan 7.8 anchors. |
| Lake trout | Kewaunee 4.2. This is above the existing 3.6–4.0 western-Michigan pier modes because local historical exact-pier targeting is documented. Recent county pier estimates of zero prevent a strong score. Offshore abundance is excluded. |
| Smallmouth/pike | Manitowoc smallmouth 5.8 equals Ludington; Manitowoc pike 5.2 equals Ludington. Exact marina-pier association and current county-pier catch support real ordinary fisheries, while no record supports an excellent ceiling. |
| Yellow perch | Waukegan 5.4 equals Kenosha. The 2023 harbor pedestrian estimate supports a real fishery; the 2024 zero estimate preserves variability, and May 1–June 15 is legally unavailable. |

## Audit correction and future guardrail

The first Pass 2 draft incorrectly capped most new peaks at 4.2–6.4. It used missing exact-city effort denominators as a hidden score penalty even after the pairings had passed the Grade B numeric gate. That contradicted the frozen calibration contract and made credible prime fisheries look ordinary.

Future agents must never lower `F` merely because a row is Grade B. They must decide strength from the complete local record and cross-city anchors, express a brief or irregular season through `A`, and preserve uncertainty in the evidence grade and limitation. A high value still requires local pier evidence; this guardrail is not permission to inherit boat or regional reputation.

The September 17 all-city audit subsequently corrected 18 established-Wisconsin peaks and refreshed the anchor set above. The complete 17-city, six-species review is in `../all-city-common-species-audit-2026-09/`.

## Primary evidence boundary

The audit relies chiefly on Wisconsin DNR county/mode harvest tables and weekly creel reporting, Illinois Natural History Survey Waukegan pedestrian surveys, Illinois DNR regulations and fishery guidance, and the frozen PierCast baseline. Specialist reports are used only for exact-pier timing or corroboration when primary data lack city resolution. Every source, locator, allowed use, and limitation is recorded in `source-addendum.json` and the Pass 1 source ledger.
