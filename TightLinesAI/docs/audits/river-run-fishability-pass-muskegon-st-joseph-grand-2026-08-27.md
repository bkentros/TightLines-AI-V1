# Fishability calibration pass: Muskegon, St. Joseph, and Grand

**Date:** 2026-08-27\
**Scope:** Fishability and Gauge Read reconciliation only. Migration Stage,
Activity, Fish In River, Push, and Migration Timing calibrations were not
changed by this pass.

## Decision summary

| River      | Source and scored reach                               | Decision                                                                                                                                                        |
| ---------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Muskegon   | USGS 04121970; Croton Dam area inside the Upper river | Retain the accepted 900 / 1,200 / 2,000 / 3,000 / 5,000 CFS boundaries. Add explicit date-average-versus-reach-band copy.                                       |
| St. Joseph | USGS 04101500; Niles mainstem reach                   | Retain the accepted 1,300 / 1,800 / 3,200 / 5,100 / 7,000 CFS boundaries. Add explicit date-average-versus-reach-band copy.                                     |
| Grand      | USGS 04119000; Fulton Street reach                    | Replace the three species-dependent draft sets with one shared 1,200 / 1,600 / 4,000 / 6,400 CFS calibration. Add explicit date-average-versus-reach-band copy. |

The boundary values above separate, in order, very low, low fishable, ideal,
high fishable, and either very high/blown-out water according to each profile's
configured bands. They are presentation thresholds, not flood, boating, wading,
access, or safety thresholds.

## Muskegon

The fixed 2007–2025 Aug. 15–Dec. 24 audit contains 2,470 usable days. Its
discharge percentiles are p5 927, p10 1,010, p25 1,160, median 1,410, p75 1,850,
p90 2,310, p95 3,010, and p99 3,990 CFS. The accepted ideal range of 1,200–2,000
CFS therefore spans approximately p25 through slightly above p75, not most of
the record. The existing replay returns Excellent on 1,175 days (47.6%), Good on
325, Fishable on 715, Tough on 229, and Poor on 26. No numeric change is
justified.

Gauge Read compares the current Croton flow with the historical distribution for
the displayed date. Fishability compares the same current flow with fixed
presentation bands for the Croton Dam area. Public copy now states both the
comparison difference and the narrow source reach.

## St. Joseph

The fixed 2012–2025 Aug. 15–Dec. 24 audit places the accepted 1,800–3,200 CFS
ideal range almost exactly at the seasonal p25–p75 interval (p25 1,818; median
2,300; p75 3,160 CFS). The p10, p90, and p95 values are 1,520, 4,473, and 5,090
CFS. These boundaries are selective and coherent with the Niles distribution, so
no numeric change is justified.

Gauge Read remains date-relative. Fishability remains a fixed Niles presentation
assessment and cannot be extrapolated to the harbor, individual tailwaters, or
the interstate corridor. Public copy now makes the two comparisons explicit.

## Grand

The prior public configuration used separate draft Fishability ranges for
Chinook, Coho, and Steelhead. That allowed an identical Fulton flow and trend to
produce a different physical-river assessment after only changing species.
Fishability owns presentation shape, so this was a primitive contradiction.

All three runs now share these Fulton Street bands:

| State                                 |             CFS |
| ------------------------------------- | --------------: |
| Very low                              |     below 1,200 |
| Low fishable                          |     1,200–1,599 |
| Ideal                                 |     1,600–4,000 |
| High fishable                         |     4,001–6,399 |
| Blown out for dependable presentation | 6,400 and above |

The shared range retains the broad Aug.–Nov. calibration as the common basis:
approximately a fall p25 lower ideal boundary, an upper ideal boundary near the
combined p80 corridor, and a blown-out presentation boundary near the upper
seasonal tail. It does not claim that 6,400 CFS is a flood or safety threshold.
The 100-water-year USGS date statistics remain separately visible in Gauge Read.

The Fulton gauge represents only the downtown station reach. Active channel or
construction changes require a rating/source recheck; they do not authorize
silent expansion to Grand Haven or the full Lower river.

## Regression contract

- A species change cannot alter Grand Fishability when flow, trend, and
  freshness are identical.
- Freshness and unknown-trend caps remain unchanged on all three rivers.
- Gauge Read labels remain date-relative and Fishability labels remain absolute,
  reach-scoped presentation assessments.
- Every result keeps its station/reach limitation in public copy.
