# Fishability calibration pass: remaining Michigan rivers

**Date:** 2026-08-27\
**Rivers:** Betsie, Platte, and White\
**Scope:** Fishability source validity, absolute bands, trend/freshness
behavior, Gauge Read reconciliation, fixed historical replay, and public scope
copy.

## Decisions

| River  | Decision                                                     | Reason                                                                                                              |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Betsie | Retain Fishability unavailable                               | No dependable continuous hydraulic source represents the Betsie Lake–US-31 and US-31–Homestead fishing corridor.    |
| Platte | Retain Fishability unavailable                               | The live Honor gauge is upstream of Platte Lake; lower-weir and M-22 inventories have no continuous hydraulic data. |
| White  | Retain Fishability and accept the reconciled Fruitvale bands | USGS 04122200 directly represents the free-flowing lower mainstem and has a near-complete 1957–2025 daily record.   |

Unavailable is an intentional fail-closed result, not missing implementation.
Neither weather, a citizen staff gauge, a historic field measurement, nor an
upstream station separated by a lake may be converted into current Fishability.

## Betsie source audit

The audit checked USGS 04126600 at US-31, 04126601 at River Road, 04126596 at
M-115, and 04126550 near Karlin. Official current-data probes returned no
continuous discharge, height, or temperature for the corridor. The River Road
page title exposes a generic continuous-graphs route, but the official API
returns zero observations; its existence is not proof of a live sensor.

The Benzie Conservation District describes citizen-read staff gauges. Those
observations can help local watershed work but do not provide a freshness-
controlled, automatically retrievable, discharge-calibrated production source.
The existing Betsie weather-only Activity and unavailable Fishability remain the
honest behavior.

## Platte source audit

USGS 04126740 at Honor has a long discharge record but sits upstream of Platte
Lake. The public fishing corridor begins below Platte Lake and ends below the
seasonal Lower Platte River Weir. The lake breaks direct reach representation;
an Honor reading cannot be silently transformed into lower-corridor depth,
current, or presentation quality.

Official probes of the lower M-22 and weir-area USGS inventories returned zero
continuous discharge, height, or temperature observations. Honor remains a
clearly labeled Gauge Read context card. Fishability remains unavailable for all
three Platte species, independent of whether the Honor equipment is currently
healthy or faulted.

## White calibration

White Fishability uses only USGS 04122200 discharge at Fruitvale Road. The
accepted shared bands are:

| State                                 |             CFS |
| ------------------------------------- | --------------: |
| Very low                              |       below 220 |
| Low fishable                          |         220–274 |
| Ideal                                 |         275–440 |
| High fishable                         |         441–712 |
| Very high                             |       713–1,019 |
| Blown out for dependable presentation | 1,020 and above |

These correspond approximately to p5, p25, p75, p95, and p99 in the
August–December distribution. The endpoint correction removes the previous
440/710 overlaps and makes the configured p75/p95 interpretation exact.

### Fixed replay

- Years: 1957–2025
- Window: August 1–December 31
- Expected dates: 10,557
- Usable dates: 10,556 (99.99%)
- Missing dates: 1
- Invariant violations: 0

| Label     |  Days | Share |
| --------- | ----: | ----: |
| Excellent | 5,150 | 48.8% |
| Good      | 1,781 | 16.9% |
| Fishable  | 2,473 | 23.4% |
| Tough     | 1,004 |  9.5% |
| Poor      |   148 |  1.4% |

The distribution is selective: Excellent is neither rare nor the default for
most historical days. At the 2026-08-27 current flow near 241 CFS, Gauge Read
places the river near the lower side of that date's long-term distribution;
Fishability independently calls the stable low band Fishable. Those two cards
are aligned while still answering different questions.

Public copy now states that Gauge Read is date-relative while Fishability is a
fixed presentation assessment near Fruitvale Road, not the full White River. It
makes no access, clarity, wading, boating, or safety claim.

## Regression contract

- Betsie and Platte cannot acquire a Fishability score through a provider
  recovery, weather input, species change, or upstream substitution.
- White uses identical Fishability bands for Chinook, Coho, and Steelhead.
- White boundary values are deterministic and non-overlapping.
- Missing or older-than-24-hour hydraulics remain unavailable; stale and
  unknown-trend caps remain conservative.
- Fishability never changes Migration Stage, Activity, Fish In River, Push, or
  Migration Timing.
