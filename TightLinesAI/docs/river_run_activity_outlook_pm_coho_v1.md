# Activity Outlook v1 — Pere Marquette Fall Coho

Activity Outlook estimates the environmental responsiveness of Coho already
present in the river. It is not fish abundance, catch probability, migration
timing, fishability, or a safety rating.

## Evidence and calibration decisions

Michigan DNR places Great Lakes tributary Coho runs from early September through
November, notes a late-October fishery, and confirms that both sexes die soon
after spawning. NOAA describes the broader adult return from September through
December. USDA Forest Service research found adult mainstem migration closely
linked to temperature, with movement beginning below about 64°F, the largest
daily shares at 45–54°F, and spawning associated with 45–60°F water plus
sufficient discharge. NOAA's reviewed thermal table describes 50–62°F as
optimal for adult migration and holding, 63–70°F as suboptimal, and temperatures
above roughly 70°F as potentially lethal depending on exposure.

Those sources support the temperature and lifecycle shape, but they do not
directly measure lure reaction or prove a Coho-specific light percentage.
Effective light therefore remains a guide/product calibration input rather than
a claimed biological constant. The v1 weights are:

| Component                  | Weight |
| -------------------------- | -----: |
| Effective light            |    50% |
| Measured water temperature |    25% |
| River behavior             |    15% |
| Precipitation context      |    10% |

The preferred Activity band is 45–60°F. Response declines above 60°F, receives
a strong warm constraint at 64°F, and a stronger barrier reduction at 68°F.
These thresholds are deliberately conservative product calibration around the
published ranges, not claims of instantaneous mortality.

Rain has a restrained independent role as presentation cover. Scottville flow
position and trend remain separate measured river context; precipitation does
not stand in for a later gauge response or inferred clarity. No pressure, moon,
wind, air temperature, or inferred clarity inputs are included.

## Lifecycle and lower tail

Coho copy is routed independently from Chinook for staging, beginning, building,
peak, tapering, ending, and post-run states. From November 6–20, the lifecycle
deduction increases continuously from 0 to 15 points. From November 21–30, that
deduction blends daily into the proportional 42% residual constraint. December
holds the 42% constraint. This represents increasingly inconsistent freshness,
spawning, and semelparous deterioration without a calendar-boundary cliff.
Favorable weather cannot reverse an individual fish's decline.

Through Peak, with complete weather, measured-temperature, and river inputs,
underlying Coho scores below 25 are smoothly compressed into 15–25. This is
lower than the Chinook 20–30 floor and is applied only to the Coho profile. It
preserves ordering while fish condition is not yet lifecycle-limited. From
November 6–20, the floor fades continuously to zero as the lifecycle deduction
increases. Ending and residual output receive no floor, when very low activity
can be realistic for deteriorating fish. Limited-data output also receives no
floor.

Late output is not a prediction for a specifically fresh fish. It represents
lifecycle-adjusted expected responsiveness for a Coho of unknown condition at
that point in the run. A newly arrived or fresher fish may be more active than
the score, while a spawning, spent, or deteriorating fish may be less active or
unresponsive.

## 2021–2025 replay

The dedicated replay covers the configured August 25–December 31 window:

- 645 expected days; 567 complete usable days
- Daily min/p10/median/p90/max: 19/32/72/88/93
- Block min/p10/median/p90/max: 18/32/69/88/95
- 70 unique daily scores and 78 unique block scores
- 29 days and 140 blocks reached 90+
- Best block: 5–9 AM 295 days, 9 AM–1 PM 82, 1–5 PM 73, 5–9 PM 117
- Median block spread 10; maximum 30; 304 days reached 10+ and 80 reached 20+
- One day and nine blocks fell below 20; no single-digit complete-input result
- Missing coverage: flow 24 days, prior flow 23, temperature 44,
  temperature history 48, weather 0
- Controlled isolated-cloud test improved only 9 AM–1 PM by 22 points and made
  it the best block
- Tapering: 44 Active, 24 Highly active, and 7 Moderate days
- Ending: 7 Active, 29 Moderate, and 12 Reserved days; no Highly active days
- Residual: all 88 days Reserved
- Zero block, rollup, lifecycle, copy, unavailable-input, or weather-leakage
  invariant failures

The 90+ tail is 5.1% of usable days: genuinely uncommon and concentrated in complete,
pre-late-run combinations of favorable temperature, river shape, and genuinely
dark blocks. Peak-stage high scores remain conditional on a responsive fish;
tapering and ending biology progressively constrain late-run output.

## Sources

- Michigan DNR, Coho salmon species profile:
  https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon
- NOAA Fisheries, salmon lifecycle and seasonal planning:
  https://www.fisheries.noaa.gov/west-coast/sustainable-fisheries/salmon-life-cycle-and-seasonal-fishery-planning
- LovellFord et al. (2020), *Transactions of the American Fisheries Society*,
  river discharge and temperature during adult Coho migration and spawning:
  https://www.fs.usda.gov/pnw/pubs/journals/pnw_2020_lovellFord001.pdf
- USDA Forest Service science findings summary:
  https://www.fs.usda.gov/pnw/sciencef/scifi254.pdf
- NOAA-hosted review, *Maximum Temperature Limits in Pacific Northwest
  Streams*:
  https://www.noaa.gov/sites/default/files/legacy/document/2020/Oct/07354626288.pdf
