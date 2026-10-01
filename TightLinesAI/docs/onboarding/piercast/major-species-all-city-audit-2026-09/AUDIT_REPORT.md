# PierCast major-species all-city score calibration

Completed September 22, 2026 against configuration
`piercast-v3-thirty-two-city-caseville-species-v12`.

## Decision

Retain all **156 current numeric calibrations** across the seven requested
species families. This pass makes **zero numerical score changes**.

That is an affirmative calibration decision, not an assumption that the old
numbers were correct. Every numeric pair was reconciled against its existing
primary-source lineage, the complete same-species city order, its full annual
shape, and the no-confidence-penalty rule. The current values already include
the September 2026 corrections that removed confidence-based compression from
Wisconsin salmonids and the later due-diligence corrections for the 15 newest
cities. This pass found no remaining evidence-backed change that cleared the
standard for modifying a score.

The pass did find and fix one non-numeric defect: species-expansion admissions
could inherit stale catalog text saying no numeric calibration existed. The
review catalog now says that the private-shadow numeric calibration exists
while user-facing rating and promotion remain disabled.

## Complete scope

| Measure | Result |
|---|---:|
| Cities | 32 |
| Requested species | 7 |
| City × species cells reviewed | 224 |
| Numeric pairs | 156 |
| Seasonal modes | 329 |
| Full-year pair/date evaluations | 56,940 |
| Month × pair calendar rows | 1,872 |
| Annual window summaries | 156 |
| Scores checked at `T = 0, 0.5, 1` | 170,820 |
| Numeric pairs retained | 156 |
| Numeric pairs revised | 0 |
| Explicit holds/exclusions without a score | 68 |
| Confidence multipliers found | 0 |

An unscored cell is not a low rating and is not included as a zero in a city
comparison. The complete 224-cell disposition is preserved in
`full-cell-disposition-audit.csv`.

## How the score was audited

Formula v3 separates three questions:

```text
seasonalPotential = 1 + (F - 1) × A
score = 1 + (seasonalPotential - 1) × (0.30 + 0.70T)
```

- `F` is the recurring best-condition strength of the named city-pier fishery.
- `A` is the evidence-supported annual availability curve.
- `T` is the bounded nearshore temperature fit.
- Multiple seasonal modes compete by maximum; they never add.

Evidence grade is not in the equation. The runtime has no confidence
coefficient, and this audit verifies that no mode contains one. For every
numeric pair and date, it also verifies:

```text
1 ≤ score(T=0) ≤ score(T=0.5) ≤ score(T=1)
  ≤ seasonalPotential ≤ active-mode F ≤ pair peak F ≤ 10
```

The audit did not force every species in every city into the Good band. Doing
so would erase measured differences between an excellent recurring pier
fishery, an ordinary but targetable one, and a fish that is generally offshore
or only episodically reachable. Twenty-nine of 32 cities nevertheless have at
least one requested species with a prime-condition ceiling above 6.

## Year-round seasonality result

The complete 365-day evaluation was also reduced into an explicit monthly
calendar for every scored pair. This is important because the annual ceiling
alone cannot show whether a city is spring-led, summer-led, fall-led, or has
several separate runs. No pair uses a flat annual score, and no generic fall
curve is applied across all ports.

For each city/species/month, `monthly-seasonality-audit.csv` records the
ideal-temperature potential on the 15th, the monthly minimum, mean, maximum,
date of the monthly maximum, and the active opportunity mode. The companion
`annual-window-summary.csv` classifies each month relative to that pair's own
peak:

- `peak`: monthly maximum reaches at least 85% of the pair's peak opportunity;
- `strong`: 60% to less than 85%;
- `shoulder`: 25% to less than 60%;
- `off_season`: less than 25%.

Those labels describe the configured seasonal phase, not catch probability or
a promise that access, weather, regulations, or temperature will cooperate.

The calendar-level reconciliation retained all existing curves:

- **Chinook:** central and northern Lake Michigan ports are principally
  late-summer/fall fisheries, while southern-port spring/summer windows remain
  separate and city-specific. Lake Huron fall windows are narrower and weaker
  where the port record warrants it.
- **Coho:** Chicago, Waukegan, Michigan City, St. Joseph, and the southern
  Wisconsin ports retain their major spring nearshore opportunity. Fall return
  modes exist only at the locally supported magnitude and timing; they do not
  replace the spring peak everywhere.
- **Steelhead:** winter/spring, summer Skamania or thermal-break, and fall
  return modes remain distinct. A city can have one, two, or three meaningful
  windows depending on stocking pathway and observed pier timing.
- **Brown trout:** the dominant pattern remains winter/open-water and spring
  nearshore access, with a separate fall harbor shoulder where supported.
- **Lake trout:** cold-season nearshore and occasional summer cold-water modes
  remain port-specific. Offshore abundance was not converted into a pier
  rating, and applicable closure windows remain independent score gates.
- **Freshwater drum:** every scored curve is warm-season centered; no winter
  availability was invented.
- **Atlantic salmon:** the scored Lake Huron ports retain materially different
  winter/spring and fall-return balances instead of sharing one lakewide curve.

The cross-check uses Michigan DNR's port-by-season Lake Michigan and Lake Huron
roadmaps, Michigan Pier/Dock creel timing, Wisconsin DNR monthly pier-mode
tables and exact-port reports, Indiana DNR's explicit shore/pier calendar, and
Illinois pedestrian-creel timing. These sources support the current ordering
of windows and do not provide solid ground for moving a peak, widening a
season, or changing a monthly magnitude in this pass.

## Species-wide result

| Species | Numeric cities | Peak range | Cities above 6 at peak | Decision |
|---|---:|---:|---:|---|
| Chinook salmon | 29 | 5.0–9.7 | 24 | Retain |
| Coho salmon | 30 | 5.0–8.8 | 26 | Retain |
| Steelhead | 32 | 4.5–10.0 | 23 | Retain |
| Brown trout | 27 | 4.8–8.2 | 21 | Retain |
| Lake trout | 18 | 3.6–5.5 | 0 | Retain |
| Freshwater drum | 13 | 3.9–7.2 | 3 | Retain |
| Atlantic salmon | 7 | 5.2–8.4 | 5 | Retain |

The lower lake-trout range is intentional. The reviewed product is a public
pier/harbor-edge forecast, not an offshore or charter forecast. Michigan port
Pier/Dock estimates, Wisconsin pier-mode tables, Indiana mode guidance, and
exact Lake Huron reports consistently show that lake trout can be real and
targetable from shore while still being much less reliable there than offshore.
The values are constrained by that observed mode difference, not by missing
confidence.

Freshwater drum is strong where direct warm-season Pier/Dock recurrence is
large (especially Grand Haven, South Haven, and Muskegon) and remains ordinary
where exact harbor reports describe lower recurrence. No lakewide abundance or
boat catch was transferred to an individual pier.

## Caseville finding

Caseville's low September salmonid result is supported by the source record.
It is not a confidence penalty.

Michigan DNR's Lake Huron roadmap places Caseville's generic salmon/trout
opportunity in **April–May**. Its **September–October** Caseville row lists
smallmouth bass and yellow perch instead. Michigan DNR's current Better Fishing
Waters inventory names lake trout, smallmouth bass, walleye, yellow perch, and
burbot for Caseville; it does not list coho or steelhead as the city's better
fisheries. An archived exact-pier coho catch and the connected Pigeon River
steelhead pathway are enough to retain modest numeric pairs, but not enough to
turn Caseville into a strong fall salmonid port.

At ideal temperature on September 22, before any temperature reduction:

| Species | Pair peak `F` | September 22 seasonal potential |
|---|---:|---:|
| Coho salmon | 5.0 | 2.902 |
| Steelhead | 4.5 | 2.786 |
| Lake trout | 4.6 | 1.553 |

This shows that the low value originates in the researched seasonal prior, not
in warm water or low model confidence. Caseville's salmon/trout peak is spring.
Forum reports of winter lake trout and occasional steelhead are consistent with
the existing winter shoulder, but isolated trips are not solid ground for
raising the annual ceiling or inventing a September peak against the agency
calendar.

## Other cities below a 6 peak

Harbor Beach and Tawas City, along with Caseville, are the only cities without
a requested-species ceiling above 6.

- **Harbor Beach:** repeated exact pier/breakwall reports establish coho and
  other salmonids, but the observed language and recurrence remain in the
  ordinary/occasional tier. Offshore Lake Huron fishing was kept separate.
- **Tawas City:** the agency inventory establishes several cold-water species,
  while the reviewed exact shore record is materially weaker than the nearby
  quantified or repeatedly reported ports. Its 5.8 coho/steelhead peaks reflect
  the observed city-pier tier, not a confidence multiplier.
- **Caseville:** the agency season table itself puts the salmon/trout window in
  spring and identifies different fall targets.

These three are watch items for new exact-pier outcome data. They were not
raised merely to make every city pass a distribution target.

## Evidence basis

Primary evidence controlled every conflict:

- [Michigan DNR creel surveys and Great Lakes data](https://www.michigan.gov/dnr/managing-resources/fisheries/creel), including preserved port/month Pier/Dock extracts and the 2025 whole-lake mode supplement.
- [Michigan DNR Better Fishing Waters](https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters) for agency-curated city/water species inventories.
- [Michigan DNR Roadmap to Fishing Lake Huron](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/RoadmapLake_Huron-accessible.pdf) for port-specific seasonal context.
- [Wisconsin DNR Lake Michigan management reports](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/ManagementReports), county/mode harvest tables, and dated exact-pier reports.
- [Wisconsin's 2024 open-water sportfishing report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf) for separated pier effort and broad seasonal context.
- [Indiana DNR Lake Michigan fishing guidance](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/) for explicit pier/shore modes and seasonal windows.
- Illinois Natural History Survey 2023 and 2024 Lake Michigan creel reports for Waukegan and Chicago pedestrian fishing, with city/site attribution retained.

Reputable local and specialist reports were used only to resolve exact-pier
timing or to challenge an agency-derived hypothesis. Forums were treated as
anecdotal contradiction checks, never as catch-rate measurements or a reason
to override primary evidence on their own.

## Artifacts

- `scored-pair-audit.csv`: all 156 numeric pairs, peak, peak date, annual band
  duration, September 22 ideal potential, grade, and decision.
- `full-cell-disposition-audit.csv`: all 224 cells, including the 68 explicit
  no-score decisions.
- `cross-city-rankings.csv`: complete same-species order for all numeric pairs.
- `city-peak-summary.csv`: strongest requested species for each city.
- `monthly-seasonality-audit.csv`: every scored pair at all 12 calendar
  months, including within-month minimum, mean, maximum, peak date, and active
  mode.
- `annual-window-summary.csv`: compact peak/strong/shoulder/off-season month
  groups for every scored pair.
- `audit-summary.json`: deterministic counts and Caseville diagnostic.
- `generate-audit.ts`: repeatable 365-day, three-temperature invariant audit.

The report validates research calibration and formula integrity. It does not
claim that tenths of a point are measured catch probabilities or that the
nearshore model cell is a thermometer at a particular casting position.
