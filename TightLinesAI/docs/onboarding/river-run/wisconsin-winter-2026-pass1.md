# Wisconsin Winter Steelhead and Brown Trout — Pass 1

Historical note: this document records the Pass 1 specification at the time it
was accepted. The profiles were subsequently implemented, replayed, and accepted
in [Pass 3](./wisconsin-winter-2026-pass3.md).

**Status:** complete implementation specification; no winter run is registered,
allowlisted, deployed, or seasonally active\
**Cohort:** Milwaukee, Sheboygan, Root, Kewaunee, and Manitowoc rivers\
**Decision date:** 2026-09-28

## Outcome

Pass 1 establishes ten future winter pathways: Steelhead and lake-run Brown
Trout on each of the five Lake Michigan tributaries. Steelhead is a full
audited-corridor overwintering opportunity except where legal access narrows it.
Brown Trout is deliberately a lower-river/harbor holding and feeding
opportunity, not a second migration run. Bois Brule is excluded because its
lower-river fishing season closes after November 15 and does not reopen until
the last Saturday in March.

The executable source of truth is `config/wisconsinWinterPass1.ts`. It contains
decisions only. No `AuditedRiverRunProfile` was created for winter, so importing
or shipping Pass 1 cannot make a winter mode visible.

## Species and lifecycle decisions

### Steelhead

Wisconsin DNR evidence supports living fall-entry fish remaining in Lake
Michigan tributaries and a separate spring return/spawning period. The winter
product will therefore model retained fish already in the river. It will have
Fish in the River and Activity, but no Push or fall-style migration timing.
Every winter Steelhead pathway ends February 28, reserving March 1 for a future
spring pathway and preventing two lifecycle products from overlapping.

Kewaunee and Manitowoc lacked independent fall Steelhead foundations. Pass 1
adds conservative fall-entry profiles so their winter handoffs do not originate
from an unsupported primitive. Kewaunee is capped at 7/10 and grounded in a
bounded 279-fish fall 2024 Besadny sample plus a distinct 1,493-fish spring
sample. Manitowoc is capped at 6/10 because recurrence is supported but no
qualifying river-specific adult count exists. Neither new fall profile is in the
production release allowlist.

### Lake-run Brown Trout

DNR's year-of-fishing guidance places January Brown Trout around tributary
mouths, harbors, and warmer nearshore water. The future winter Brown Trout
product is therefore lower-river only. It will describe post-spawn fish that may
hold or feed; it will not claim that all fall fish remain, that Browns make a
discrete winter run, or that upper-river fall distribution persists uniformly.

The Brown Trout pathway also ends February 28. Pass 1 does not assert a March
spring-Brown run.

## Exact handoffs and retained presence

| River     | Species     | Fall endpoint | Winter activation |  Starting fraction | Winter end |
| --------- | ----------- | ------------- | ----------------- | -----------------: | ---------- |
| Milwaukee | Steelhead   | 12-15         | 12-16             |               0.62 | 02-28      |
| Milwaukee | Brown Trout | 01-15         | 01-16             |               0.25 | 02-28      |
| Sheboygan | Steelhead   | 12-15         | 12-16             |               0.62 | 02-28      |
| Sheboygan | Brown Trout | 01-15         | 01-16             |               0.25 | 02-28      |
| Root      | Steelhead   | 12-31         | 01-01             |               0.62 | 02-28      |
| Root      | Brown Trout | 01-15         | 01-16             |               0.25 | 02-28      |
| Kewaunee  | Steelhead   | 12-15         | 12-16             |               0.62 | 02-28      |
| Kewaunee  | Brown Trout | 12-22         | 12-23             |               0.35 | 02-28      |
| Manitowoc | Steelhead   | 12-15         | 12-16             |               0.62 | 02-28      |
| Manitowoc | Brown Trout | 12-31         | 01-01             | approximately 0.52 | 02-28      |

Each activation is exactly one calendar day after the corresponding fall model
ends. Pass 2 must preserve this invariant and must keep every winter profile
seasonally inactive before its own activation date.

## Activity and gauge contract

| River     | Steelhead mode and scope                                                                   | Brown Trout mode and scope                  | Required limitation                                                                                      |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Milwaukee | measured water + flow + weather at Estabrook; Activity applies only to Urban Greenway      | weather/air proxy, Harbor & Downtown only   | Estabrook is not harbor or North Shore water temperature                                                 |
| Sheboygan | flow plus limited multi-day air proxy; flow scope is Urban River near I-43                 | weather/air proxy, Harbor & Lower City only | no accepted live water temperature; I-43 is not harbor flow                                              |
| Root      | Limited weather/air proxy for all three supported reaches                                  | weather/air proxy, Harbor & Downtown only   | Horlick flow and 60th Street temperature are upstream of the product corridor and excluded from Activity |
| Kewaunee  | measured water + flow + weather at County F; Activity applies only to Besadny Reach        | weather/air proxy, Lower River only         | the 2026 temperature series is not a historical baseline and County F is not harbor temperature          |
| Manitowoc | flow plus limited multi-day air proxy at Michigan Avenue; Activity applies to Middle River | weather/air proxy, Lower River only         | the temperature sensor ended in 2022 and can never become current input                                  |

Pass 2 must build separate winter scoring rather than reuse fall Activity
unchanged. Measured water temperature should lead where it is genuinely
representative. Where it is absent, a stable multi-day mild-air pattern or
gradual warm-up can improve the score, stable deep cold should suppress it, and
abrupt oscillations should be penalized. Cloud cover can improve the best time
blocks. Precipitation must not receive independent positive credit, and an air
proxy must never be displayed as measured water temperature. Flow may qualify
fishable presentation only where the gauge represents the Activity reach.

The intended output is conservative: typical winter days should score below
productive open-water periods, while genuine stable warmth or a modest warm-up
can still produce useful days and windows. Pass 2 historical replay must tune
the magnitude and caps rather than treating these qualitative rules as already
calibrated.

## Spot Finder contract

| River     | Steelhead winter corridor                      | Preferred starting sections    | Brown Trout winter corridor |
| --------- | ---------------------------------------------- | ------------------------------ | --------------------------- |
| Milwaukee | Harbor & Downtown, Urban Greenway, North Shore | Urban Greenway and North Shore | Harbor & Downtown           |
| Sheboygan | Harbor & Lower City, Urban River, Kohler       | Urban River and Kohler         | Harbor & Lower City         |
| Root      | Harbor & Downtown, City Parks, Lincoln Park    | City Parks and Lincoln Park    | Harbor & Downtown           |
| Kewaunee  | Lower River, Besadny Reach, Upper Access       | Besadny Reach and Upper Access | Lower River                 |
| Manitowoc | Lower River and Middle River                   | Middle River                   | Lower River                 |

All listed Steelhead sections remain viable; preferred sections are starting
suggestions based on holding habitat and/or the best accepted condition
coverage, not exclusions. Manitowoc Upper Corridor is excluded in winter because
Lower Cato Falls—the only independently verified public access there—closes
October 31. Milwaukee's signed Kletzsch refuge and Kewaunee's posted Besadny
refuge/facility boundaries remain hard cautions.

## Legal and release gates

- Lake Michigan tributary trout and salmon seasons are continuous unless a
  water-specific exception applies.
- From September 15 through the first Saturday in May, fishing is prohibited
  from one-half hour after sunset to one-half hour before sunrise.
- Current regulations, emergency orders, posted refuges, facility operations,
  property rights, and ice/wading safety always override product guidance.
- Bois Brule receives no winter pathway. Biological overwintering does not
  overcome its legal closure.
- Pass 1 creates no winter run registration and changes no production allowlist.
  Pass 2 implements and calibrates hidden profiles. Pass 3 performs acceptance,
  rendered review, migration/reconciliation, and explicit release authorization.

## Authoritative source ledger

- Wisconsin DNR,
  [Inland trout and salmon seasons](https://dnr.wisconsin.gov/topic/Fishing/seasons/trout)
  — Lake Michigan tributary season framework.
- Wisconsin DNR,
  [Lake Michigan fall fishing](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html)
  — night restriction and tributary rules.
- Wisconsin DNR,
  [A year of fishing](https://dnr.wisconsin.gov/topic/Fishing/outreach/yearoffishing.html)
  — January Brown Trout at tributary mouths, harbors, and warmer nearshore
  water.
- Wisconsin DNR,
  [Root River report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/rootriverreport)
  and
  [Root River Steelhead Facility](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ROOTRIVER)
  — distinct fall and March-May operations.
- Wisconsin DNR,
  [2025 Lake Michigan GLFC report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf)
  — Kewaunee and Root facility evidence, including separated fall and spring
  Steelhead samples.
- Wisconsin DNR,
  [Rainbow Trout and Steelhead profile](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf)
  — strains, fall-through-spring timing, and named tributaries.
- Wisconsin DNR,
  [2024 Lake Michigan stocking summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_StockingSummary2025.pdf)
  — recurring Steelhead and Brown Trout stocking context; stocking is not adult
  abundance.
- Wisconsin DNR,
  [Besadny facility report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/BesadnyFacilityReport)
  — operated Kewaunee collection and passage context.
- Wisconsin DNR,
  [Fishing the Bois Brule](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing)
  and
  [Lake Superior tributary seasons](https://dnr.wisconsin.gov/topic/Fishing/seasons/lakesuptribs.html)
  — November 15 closure and spring reopening.

## Pass 2 implementation gates

Pass 2 is not complete until all ten hidden profiles validate; fall/winter dates
are mechanically checked; winter Fish in the River never rises without
independent evidence; Steelhead and Brown Trout use species-correct copy; Push
and migration timing remain unavailable; measured and proxy Activity inputs fail
closed; historical weather/gauge replay verifies cold, warmth, warm-up, cloud,
swing, stale-data, and high-flow behavior; Spot Finder renders only the approved
corridors; and no candidate is publicly visible without an explicit allowlist
decision.
