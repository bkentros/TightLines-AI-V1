# Betsie Fall Coho — Owner Build Audit

**Status:** implementation and local verification complete; public audit gate
disabled\
**Engine version:** `river-run-v1.5.3`\
**Configuration version:** `2026-08-05-betsie.6`\
**Copy version:** `river-run-copy-v26`\
**Movement branch:** `fall_cooling` / seasonal progression only

## Accepted product calibration

Betsie Fall Coho is implemented as a **Limited 3/10** historical opportunity
with a public **30/100 river ceiling** and **Sectional** distribution. Every
calendar boundary and presence anchor is exactly five days ahead of the accepted
Pere Marquette Coho configuration.

The PM relationship supplies seasonal shape only. Betsie does not inherit PM
hydraulics, temperature sources, condition baselines, Push, Fishability, or
Migration Timing.

## Evidence judgment

The 3/10 ceiling is supported as a conservative product calibration:

- Michigan DNR Fisheries Report 24 describes large Betsie Chinook runs with
  smaller numbers of Coho. Its 2010 creel estimate recorded 63 harvested Coho,
  all in October and in the middle survey section containing Homestead, versus
  13,620 Chinook. Coho represented less than 1% of total harvest. The estimate
  had substantial uncertainty and is not treated as a literal population ratio.
- Michigan DNR Betsie Survey 2004-3 records some migratory Coho, no direct Coho
  stocking, primarily wild-or-stray returns, and Coho spawning in the mainstem
  and tributaries.
- Michigan DNR's current Better Fishing Waters list names the Betsie for Chinook
  and steelhead but not Coho, while identifying nearby Platte and Pere Marquette
  waters for Coho.

These sources establish a recurring Coho migration but do not support a Moderate
or Broad dependable fishery. Sectional distribution recognizes that fish can use
multiple parts of the watershed without implying that limited adult numbers
occupy every good-looking hole.

The exact five-day PM lead and 3/10 ceiling remain explicit owner calibration,
not the result of paired adult counts.

## Primitive availability

| Primitive        | Status      | Basis                                                          |
| ---------------- | ----------- | -------------------------------------------------------------- |
| Migration Stage  | Available   | Deterministic Betsie calendar and Coho-specific Homestead copy |
| Fish In River    | Available   | Accepted 30-point seasonal-presence curve                      |
| Migration Timing | Unavailable | No accepted historical hydraulic and measured-water baseline   |
| Push             | Unavailable | No representative live gauge or measured water temperature     |
| Fishability      | Unavailable | No representative live gauge or defensible Betsie bands        |

Air temperature is never substituted for measured water temperature. The runtime
does not call live gauge, weather, or temperature providers for this run.

## Calendar

| Boundary                      |         Date |
| ----------------------------- | -----------: |
| Early watch                   |    August 10 |
| Staging context               |    August 20 |
| River presence begins         |    August 27 |
| Beginning ends                | September 15 |
| Established build             | September 26 |
| Peak stage begins             |    October 5 |
| Peak reference                |   October 15 |
| Peak stage ends               |   October 31 |
| Taper ends                    |  November 15 |
| Main migration ends           |  November 25 |
| Sparse historical tail ends   |  December 26 |
| Late post-migration copy ends |  December 28 |

## Presence anchors

| Date         | Public index |
| ------------ | -----------: |
| August 26    |        0/100 |
| August 27    |        3/100 |
| September 10 |        6/100 |
| September 26 |       15/100 |
| October 15   |       30/100 |
| October 31   |       27/100 |
| November 15  |       18/100 |
| November 25  |       12/100 |
| December 10  |        6/100 |
| December 22  |        2/100 |
| December 26  |        0/100 |

## Copy contract

- No Coho state contains Chinook language.
- No state translates PM-scale lower, middle, and upper geography onto the
  Betsie.
- Staging begins in Lake Michigan, Frankfort harbor, Betsie Lake, the river
  mouth, and one deliberate check of the first deep corridor hole.
- Late September identifies Homestead arrival as realistic without promising
  concentrations.
- Peak is explicitly the strongest part of a **limited** opportunity.
- Peak starts anglers in select substantial holes across the short corridor and
  requires direct fish activity before committing time.
- Every state stays outside the signed Homestead closure and avoids shallow
  spawning fish.
- No Guide's Read recommends Migration Timing, Push, or Fishability.

## Mechanical acceptance

- 222 River Run engine and endpoint tests passed.
- 23 production-derived Betsie Coho scenarios: ten Migration Stage states, three
  unavailable sensor-driven primitives, and ten exact presence anchors.
- Dedicated engine tests prove every calendar boundary is five days ahead of PM
  Coho, every score remains at or below 30, and the strength is Limited.
- Endpoint proof verifies a Betsie Coho snapshot never calls a live provider.
- Chinook regression fixtures remain unchanged in meaning and continue to pass.
- The generated audit selector uses the Coho artwork and Coho fixture catalog.

Run the deterministic acceptance check:

```bash
npm run qa:river-run:betsie-coho-acceptance
```

For device review:

```bash
npm run dev:river-run
```

Select Michigan → Fall → Coho Salmon → Betsie River. Review August 27, September
26, October 15, October 31, November 15, November 25, December 10, and December
26, plus each unavailable primitive.

Public visibility remains disabled under `betsie-fall-coho-owner-audit-v1`. No
deployment or database publication is performed by this build.
