# Wisconsin River Run Fishability Reconciliation — 2026-08-27

## Scope and decision rule

This pass re-audits Milwaukee, Sheboygan, Root, and Bois Brule using the same
contract applied in the Michigan reconciliation:

1. a current gauge must be dependable;
2. it must represent a named section inside the modeled fishing corridor;
3. fixed Fishability bands must be distinct from the Gauge Read's
   date-relative comparison;
4. high-flow tails must not receive an ordinary or excellent presentation
   grade merely because the flow is historically possible; and
5. missing, stale, out-of-corridor, or invalid data must fail closed.

Fishability describes presentation shape if migratory fish are present. It is
not fish abundance, legal access, wading/boating safety, or a substitute for
direct observation.

## Final river decisions

| River | Accepted source and scope | Fishability | Final bands / reason |
| --- | --- | --- | --- |
| Milwaukee | USGS `04087000`, Estabrook Park portion of the Urban Greenway | available | `<170` very low; `170–236` low; `237–594` ideal; `595–1110` high; `1111–1519` very high; `>=1520` blown out |
| Sheboygan | USGS `04086000`, Urban River near I-43 | available while source remains operational | `<87` very low; `87–117` low; `118–338` ideal; `339–674` high; `675–874` very high; `>=875` blown out |
| Root | USGS `04087240` is 350 ft below Horlick Dam and 5.2 mi above the mouth, upstream of the product endpoint below the Steelhead Facility | unavailable | Gauge Read context retained; no corridor-representative hydraulic source |
| Bois Brule | USGS `04025500` is upstream of Highway 2 and outside the modeled lower fall corridor | unavailable | Gauge Read context retained; no corridor-representative hydraulic source |

The Milwaukee and Sheboygan v1 bands incorrectly allowed the p90–p95 tail to
remain `high_fishable`. V2 ends ordinary high-fishable water at p90, leaves the
p90–p95 interval to the engine's `very_high` classification, and retains p95 as
the blown-out boundary. This is the same deliberate separation between
date-relative normality and fixed presentation shape used elsewhere.

## Historical mechanical replay

The replay uses official USGS daily mean discharge, each configured fixed
seasonal window, runtime trend handling, and the shared Fishability scorer.

### Milwaukee — 2019–2025 seasons, Aug. 1–Jan. 15

- Expected days: 1,176
- Usable paired days: 1,126 (95.75%)
- Missing paired days: 50
- Excellent: 573 (50.89%)
- Good: 138 (12.26%)
- Fishable: 214 (19.01%)
- Tough: 140 (12.43%)
- Poor: 61 (5.42%)
- Contract/copy/cap violations: 0

### Sheboygan — 2019–2025 seasons, Aug. 1–Jan. 31

- Expected days: 1,288
- Usable paired days: 1,224 (95.03%)
- Missing paired days: 64
- Excellent: 586 (47.88%)
- Good: 149 (12.17%)
- Fishable: 227 (18.55%)
- Tough: 200 (16.34%)
- Poor: 62 (5.07%)
- Contract/copy/cap violations: 0

Root and Bois Brule are intentionally not band-replayed: producing a stable
score distribution from a nonrepresentative gauge would validate mechanics
while preserving the product's underlying geographic error.

## Gauge Read reconciliation

- Milwaukee and Sheboygan public Fishability copy now explicitly distinguishes
  the live flow card's date-relative comparison from fixed presentation bands.
- Root and Bois Brule retain their live flow/height cards with explicit upstream
  limitations; the existence of those readings no longer implies a Fishability
  result.
- Fixed Wisconsin date-relative flow normals now cover Aug. 1–Feb. 15 so the
  lake-run Brown Trout report tail does not lose historical context early.
- The generator now rejects negative USGS missing-value sentinels. It also
  correctly treats February as part of the next calendar year; the prior
  February extension attempt would otherwise have emitted empty maps.
- Sheboygan retains the official possible-discontinuation warning for Oct. 1,
  2026 and existing stale/missing failure behavior.

## Primary evidence

- USGS `04087000`, Milwaukee River at Milwaukee: station at Estabrook Park,
  6.6 mi above the mouth, discharge record and post-2018 regulation note.
- USGS `04086000`, Sheboygan River at Sheboygan: station near I-43, 3.9 mi above
  the mouth, discharge record, powerplant fluctuation note, and possible
  Oct. 1, 2026 discontinuation warning.
- USGS `04087240`, Root River at Racine: station 350 ft below Horlick Dam and
  5.2 mi above the mouth.
- USGS `04025500`, Bois Brule River at Brule: long-running discharge station
  upstream of the Highway 2 product endpoint; winter ice limitation retained.
- Wisconsin DNR river-foundation, regulations, facility, refuge, and corridor
  sources already recorded in each river's evidence packet.

## Verification contract

- `npm run replay:river-run:wisconsin-fishability`
- focused Milwaukee, Sheboygan, Root, Bois Brule, and USGS parser tests
- onboarding fixture regeneration and review-mode QA
- full River Run engine and Edge Function test suites
- TypeScript and `git diff --check`

No deployment or public enablement is authorized by this audit.
