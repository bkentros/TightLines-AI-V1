# PierCast Core Salmonid Temperature-Response Audit

**Status:** Decision implemented as private v0.2 candidate; v0.1 retained for comparison<br>
**Scope:** Adult/lake-phase Chinook salmon, coho salmon, steelhead, and brown trout as targets of Lake Michigan pier and harbor-mouth anglers<br>
**Product question:** How should one forecast surface-water temperature modify a city-and-species seasonal opportunity ceiling without pretending to measure fish body temperature, abundance, or catch probability?

> **Formula-v2 follow-up:** The temperature curves recommended here remain unchanged. Bounded-temperature formula v2 now softens their score penalty and permits only a five-percent near-optimal synergy; the original direct multiplier is archived as the same-issue shadow comparator. “Ceiling” below describes the formula-v1 context in which this audit was performed.

## 1. Decision summary

The existing four curves were not invented without research. Their high-suitability bands were constrained by Wisconsin DNR species summaries and Great Lakes field literature. However, only the high regions have relatively strong support. The exact `0–1` shoulder values are FinFindr calibration judgments, not published biological response functions, and they have not been validated against prospective pier catches.

The evidence supports five conclusions:

1. **Warm surface water in the upper 60s and low 70s Fahrenheit is generally more adverse to pier accessibility than moderately cold water.** During stratification, salmonids can remain in the lake by moving deeper or offshore into cooler water. That preserves fish survival and boat catchability while reducing the amount of suitable water reachable from a pier. Lake Michigan Chinook moved deeper and offshore in July–August as surface water warmed; the authors specifically warned that rapid warming could rapidly reduce fishery catch rates.^1
2. **A catch in 62 °F water is biologically unsurprising.** `62 °F = 16.7 °C`, above the central preferred range for Chinook, coho, and steelhead but within documented adult occupancy or a reasonable warm shoulder. It should reduce, not destroy, a strong seasonal opportunity. It remains near the broad high-use range for adult Great Lakes brown trout.^1,2
3. **Below 50 °F is not automatically “better.”** Metabolic and feeding rates generally slow as water becomes very cold, and spring salmon movements track both warming and prey. But cold mixed water can make suitable thermal habitat shallow and nearshore. A pier-accessibility curve should therefore use a broad, nonzero cold shoulder, not treat near-freezing water as either optimal or nearly impossible.^3,4
4. **Surface temperature is a reachability proxy, not the fish’s experienced temperature.** A 2026 Wisconsin DNR report described approximately 68 °F surface water while salmon were being caught 40–50 feet down in 47–50 °F water. The same report documented some Chinook pier catch and strong Sheboygan pier catch during the broader warm-water period. This is event evidence, not a controlled response curve, but it clearly demonstrates vertical decoupling.^5
5. **One asymmetric curve per species remains the smallest defensible v1 design.** A curve that rises from very cold water toward a broad optimum and falls more sharply on the warm side can reproduce the strongest seasonal pattern without adding another live variable. The seasonal ceiling already encodes spring arrival, summer distribution, and mature fall return. Behavior-specific temperature profiles should be added only if held-out pier outcomes show that the same measured temperature has a repeatably different effect by behavioral context.

The recommended next configuration is therefore a **v0.2 private calibration candidate**, not a biological truth claim: moderately relax only the cold penalty and retain the v0.1 curve from 50 °F upward. Do not expand the optimum through 65 °F merely because colder water may exist below the surface, and do not steepen the existing 68–72 °F decline without pier-outcome evidence. The current warm shoulder already leaves 62–65 °F useful, makes 68–72 °F progressively adverse rather than impossible, and keeps brown trout broader and warmer-tolerant.

## 2. What temperature can and cannot represent

PierCast predicts relative opportunity from a fixed structure. The relevant temperature question is not merely:

> Is this temperature physiologically preferred by the fish?

It is:

> Given that the local seasonal curve says this fishery is plausible today, does the represented nearshore surface temperature make the species more or less likely to occupy water reachable from the pier?

Those questions diverge in a deep, stratified lake. A salmon may occupy ideal 50 °F water well below a 70 °F surface, but that does not make the fish accessible to a shore angler. Conversely, nearly uniform 40–45 °F water is below a laboratory growth optimum but can leave no warm surface layer forcing the fish deep.

This distinction is directly supported by the available Great Lakes evidence:

- NOAA describes LMHOFS output as model-generated forecast guidance for water temperature, not an observation of fish depth or body temperature.^6
- Lake Michigan nearshore and estuarine temperatures can change rapidly with upwelling and downwelling. A Milwaukee estuary sensor network observed changes as large as 15 °C in less than 24 hours, with cold hypolimnetic water periodically entering the estuary.^7
- Historical Lake Michigan guidance states that upwellings materially alter salmon depth and that summer salmon are generally not close to shore except when cold water is brought nearshore.^3
- Lake Michigan steelhead catch was associated not only with absolute surface temperature but with areas of high temperature variation and thermal fronts.^8

Therefore, the internal term `temperatureSuitability` should be interpreted in product documentation as **surface-temperature compatibility with pier-reachable opportunity**. The code name can remain stable; the user-facing and scientific meaning must not imply direct measurement of the fish’s preferred depth.

## 3. Evidence hierarchy

| Evidence type | What it supports | What it does not support |
| --- | --- | --- |
| Lake Michigan angler CPUE related to surface temperature | Direct relationship between a surface input and a fishery outcome at broad spatial/monthly scales | Exact pilot-pier probabilities or modern city-specific response slopes |
| Great Lakes telemetry, tag recovery, and assessment catch | Adult distribution, occupied temperatures, seasonal movement, nearshore/offshore response | Bite probability or exact pier-accessibility suitability |
| Agency species summaries | Plausible preferred bands and seasonal fishery context | Methods, uncertainty, response slopes, or universal adult optima |
| Laboratory growth, swimming, or lethal limits | Physiology and safety boundaries for a stated life stage | Adult Lake Michigan pier catchability |
| Weekly creel reports | Real local catches, methods, effort, and contemporaneous context | Controlled causal temperature effects unless temperatures and effort align precisely |

No reviewed source provides a complete adult pier-catch function from 32–79 °F for any of the four species. Exact suitability ordinates must remain explicitly labeled product calibration.

## 4. Species findings

### 4.1 Chinook salmon

The strongest applicable evidence is Lake Michigan-specific. Adlerstein et al. analyzed recreational tag recoveries and gill-net assessments and found seasonal northward, offshore, and deeper movement. Chinook were commonly associated with approximately 10–12 °C, could occupy water up to approximately 20 °C during summer, and had the highest assessment-net catches around 9 °C. Surface water above 20 °C was associated with deeper/offshore distribution rather than a conclusion that the fish could not survive.^1

Historical Lake Michigan outreach guidance gives a summer preferred range around 50–54 °F and says upwelling changes the depth at which salmon occur. It places most summer/early-fall concentrations away from immediate shore except during cold-water upwelling.^3 Wisconsin DNR’s general fact sheet gives 50–57 °F.^9 These values overlap sufficiently to support a high region around 9–14 °C, but none supplies exact product slopes.

Biological interpretation:

- **35–45 °F:** Not intrinsically “best.” Feeding and prey aggregation can be limited, and much of the northern lake’s winter Chinook abundance is low. However, local seasonal presence already carries that limitation; the temperature multiplier should not impose a second severe absence penalty.
- **50–57 °F:** Strongest supported high-suitability region.
- **60–65 °F:** Plausible occupancy and pier catch, especially around changing water, prey, or staging. Apply a moderate shoulder.
- **68–72 °F:** Strong evidence for reduced nearshore accessibility during lake-feeding periods. Penalize sharply, but do not force zero because mature return behavior and short-lived upwelling/plume structure can still create catches.

### 4.2 Coho salmon

Wisconsin DNR gives a general 54–57 °F preferred band.^10 Historical Lake Michigan guidance gives approximately 53–55 °F during summer and describes coho as slightly closer to shore than Chinook when suitable water is available.^3 A Great Lakes temperature compilation includes an adult Lake Michigan observation at 16.6 °C, but its method and seasonal context do not justify treating that value as a second optimum.^11

Lake Michigan management literature describes a strong seasonal migration: an early southern-basin fishery, northward movement as the lake warms, and late-summer concentration near parent streams.^12 USGS’s Great Lakes species account similarly states that warming pushes feeding coho toward deeper, cooler water.^13

Biological interpretation:

- **35–45 °F:** Spring coho fisheries occur while water is still cold and warming. The cold shoulder should be more permissive than the current v0.1 curve, while remaining below the central optimum.
- **50–59 °F:** Strong high-suitability region.
- **60–65 °F:** Still credible and useful; a moderate reduction is appropriate.
- **68–72 °F:** Strongly adverse to shallow lake-feeding availability, but not proof of absence during mature return or localized cold-water events.

Adult coho-specific Lake Michigan surface-temperature/shore-catch data are weaker than the corresponding Chinook and steelhead evidence. That uncertainty argues for conservative shoulders and private validation, not false precision.

### 4.3 Steelhead

Steelhead has the best direct evidence linking Lake Michigan surface temperature to an angling outcome. Höök et al. related 1992–1997 charter CPUE to satellite surface temperature. Monthly lakewide CPUE followed a quadratic relationship peaking around 12.3 °C, though temperature and month were difficult to separate. Within months, catches tended to occur in warmer cells during cold May conditions and cooler cells during warmer months. Catch was also associated with high temperature variation and fronts.^8

This pattern is important because a single peaked, asymmetric curve can express it without a trend bonus: below the optimum, warming increases suitability; above it, cooling increases suitability. Michigan DNR also documents lake-phase steelhead near thermal bars in early summer and tributary entry from late October through early May.^4 Wisconsin DNR’s general range is 53–57 °F.^14

Biological interpretation:

- **35–45 °F:** Steelhead remain a credible cold-season target. Cold should be a moderate penalty, not a collapse.
- **50–59 °F:** Best-supported high region, centered close to the observed 12.3 °C Lake Michigan CPUE maximum.
- **60–65 °F:** Still useful, especially around fronts; gradual decline.
- **68–72 °F:** Cooler layers/fronts become increasingly important, so a fixed-pier surface score should decline strongly.

Temperature variation is real, but PierCast should not add a separate trend/front multiplier yet. Doing so would add a third score input without a validated port-scale coefficient. The hourly forecast already allows rapid changes to affect the duration-weighted daily temperature result.

### 4.4 Brown trout

Brown trout is materially warmer-tolerant and more nearshore-oriented than the three Oncorhynchus species. Michigan DNR describes outstanding early-spring Great Lakes pier fishing, shallow rocky spring habitat, and a preferred range of 50–65 °F.^2 Lake Ontario telemetry and vertical-netting found 81% of tracked temperatures and 78% of summer net catches between 8 and 18 °C, with seasonal means around 10–13 °C and strong nearshore/thermocline association.^15 This is a regional Great Lakes transfer, but it is adult field evidence.

Lake Michigan thermal-plume research reported an annual modal selected temperature around 12 °C and an estimated upper preferred temperature of 16 °C, with substantial seasonal and individual variation.^16 That evidence is more applicable to the current product than a Wisconsin fact-sheet range of 65–75 °F whose endpoint, life stage, and method are unspecified.^17

Biological interpretation:

- **35–45 °F:** A valid cold-season/early-spring pier context. Suitability should be meaningfully higher than current v0.1 at the coldest temperatures, but not equal to the 50–65 °F high region.
- **50–65 °F:** Broad high-suitability region supported by Michigan agency context and adult Great Lakes field use.
- **68–70 °F:** Moderate, not catastrophic, reduction. Brown trout can use warmer water than the other three species.
- **72–79 °F:** Increasingly adverse; the warm Wisconsin summary should not be interpreted as proof that 75 °F surface water is optimal for adult Lake Michigan pier opportunity.

## 5. Audit of the current v0.1 curves

The table below evaluates the exact implemented piecewise-linear curves. These are suitability multipliers, not final `X/10` ratings.

| Surface °F | °C | Chinook | Coho | Steelhead | Brown trout |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 35 | 1.7 | 0.38 | 0.38 | 0.58 | 0.43 |
| 40 | 4.4 | 0.54 | 0.53 | 0.72 | 0.60 |
| 45 | 7.2 | 0.80 | 0.70 | 0.86 | 0.79 |
| 50 | 10.0 | 1.00 | 0.90 | 0.97 | 1.00 |
| 55 | 12.8 | 1.00 | 1.00 | 1.00 | 1.00 |
| 60 | 15.6 | 0.92 | 0.94 | 0.94 | 1.00 |
| 62 | 16.7 | 0.83 | 0.88 | 0.86 | 0.97 |
| 65 | 18.3 | 0.66 | 0.72 | 0.71 | 0.87 |
| 68 | 20.0 | 0.45 | 0.50 | 0.50 | 0.70 |
| 70 | 21.1 | 0.31 | 0.34 | 0.36 | 0.56 |
| 72 | 22.2 | 0.19 | 0.23 | 0.24 | 0.43 |
| 75 | 23.9 | 0.13 | 0.12 | 0.16 | 0.26 |

This confirms that the current implementation already reflects the central intuition:

- 62 °F is not treated as bad.
- 70 °F is substantially worse than 62 °F for all four species.
- 70 °F is worse than 40 °F for Chinook, coho, and steelhead.
- Brown trout receives the broadest warm shoulder.

The main concern is the opposite side. At 35–40 °F, the current Chinook, coho, and brown-trout multipliers can cut a strong seasonal ceiling nearly in half. That is a large assertion not supported by an adult pier-catch response study and risks double-penalizing cold-season opportunities already encoded in the city/species seasonal curve.

For example, with a seasonal ceiling of `9.0`, the current formula produces:

| Species | At 62 °F | At 70 °F |
| --- | ---: | ---: |
| Chinook | 7.6/10 | 3.5/10 |
| Coho | 8.0/10 | 3.7/10 |
| Steelhead | 7.9/10 | 3.9/10 |
| Brown trout | 8.8/10 | 5.5/10 |

Those results are directionally reasonable. The report does not recommend replacing them with a rule that all sub-50 °F readings are optimal.

## 6. Final recommended v0.2 calibration constraints

The implemented private candidate is deliberately modest. It keeps the same formula, hourly integration, one surface series per city, and one default curve per species. It changes only the **cold-side knots below 50 °F** and preserves every v0.1 value at 50 °F and above. It remains provisional until reference-day and outcome comparisons are complete.

This decision follows directly from the surface-versus-depth distinction. A 65 °F surface can coexist with excellent salmonid water deeper in the column. That is why 65 °F must not be treated as biological exclusion. But PierCast rates fixed-pier opportunity: if the best water has moved 40–50 feet down or offshore, its existence does not justify making a warm surface reading optimal. The Wisconsin DNR event record—68 °F at the surface, 47–50 °F at 50 feet, productive boat fishing at depth, and only a few Chinook from the local pier—is a useful illustration, though not a fitted causal study.^5

The following are **calibration targets**, not source-measured values:

| Region | Chinook | Coho | Steelhead | Brown trout |
| --- | --- | --- | --- | --- |
| 32–40 °F | Raise from low/strong penalty to moderate penalty | Raise; spring fishery makes current penalty too strong | Raise most; cold-season opportunity is well established | Raise; early-spring pier fishery is explicit |
| 45–50 °F | High and rising | High and rising | High and rising | High |
| 50–57 °F | Plateau/highest | Plateau/highest | Plateau/highest around 12–14 °C | Plateau/high |
| 58–62 °F | High to moderately high | High to moderately high | High to moderately high | High |
| 63–65 °F | Moderate | Moderate | Moderate | High to moderately high |
| 68–70 °F | Retain current strong, nonzero penalty | Retain current strong, nonzero penalty | Retain current strong, nonzero penalty | Retain current moderate penalty |
| 72 °F+ | Retain current severe but nonzero tail | Retain current severe but nonzero tail | Retain current severe but nonzero tail | Retain current stronger, gradual decline |

The implemented v0.2 candidate produces approximately:

| Surface °F | Chinook | Coho | Steelhead | Brown trout |
| ---: | ---: | ---: | ---: | ---: |
| 35 | 0.51 | 0.56 | 0.69 | 0.66 |
| 40 | 0.63 | 0.68 | 0.80 | 0.76 |
| 45 | 0.83 | 0.83 | 0.90 | 0.88 |
| 50 | 1.00 | 0.90 | 0.97 | 1.00 |
| 55 | 1.00 | 1.00 | 1.00 | 1.00 |
| 60 | 0.92 | 0.94 | 0.94 | 1.00 |
| 62 | 0.83 | 0.88 | 0.86 | 0.97 |
| 65 | 0.66 | 0.72 | 0.71 | 0.87 |
| 68 | 0.45 | 0.50 | 0.50 | 0.70 |
| 70 | 0.31 | 0.34 | 0.36 | 0.56 |
| 72 | 0.19 | 0.23 | 0.24 | 0.43 |
| 75 | 0.13 | 0.12 | 0.16 | 0.26 |

The candidate's exact revised cold knots are:

- Chinook: `(0 °C, 0.45)`, `(4 °C, 0.60)`, `(7 °C, 0.82)`, `(9 °C, 0.95)`; retain v0.1 from 10 °C upward.
- Coho: `(0 °C, 0.50)`, `(4 °C, 0.65)`, `(7 °C, 0.82)`; retain the v0.1 `(10 °C, 0.90)` knot and every warmer knot.
- Steelhead: `(0 °C, 0.65)`, `(2 °C, 0.70)`, `(5 °C, 0.82)`, `(8 °C, 0.93)`; retain the v0.1 `(10 °C, 0.97)` knot and every warmer knot.
- Brown trout: `(0 °C, 0.60)`, `(3 °C, 0.70)`, `(6 °C, 0.82)`, `(8 °C, 0.92)`; retain v0.1 from 10 °C upward.

These targets keep 62–65 °F productive and preserve the existing nonzero warm tail. They also preserve brown trout's broader thermal use. Exact ordinates remain FinFindr judgments to be evaluated as a new version; the table must never be described as agency-issued biological ratings.

## 7. Why not add twelve monthly temperature bands

Twelve independent profiles per species would create 48 curves and hundreds of unsupported ordinates. The evidence does not support that precision. The current architecture can already capture the principal seasonal interaction:

- The **seasonal ceiling** answers whether a given city/species/date is historically worthwhile and captures the timing of spring movement, summer absence, and fall return.
- The **asymmetric thermal curve** answers whether today’s represented surface water is compatible with pier reachability.
- Below the peak, warming can improve the score; above the peak, cooling can improve it. This mirrors the steelhead result that warmer cells were favored in cold May but cooler cells in warmer months.^8

If prospective outcomes later show a systematic residual—for example, 70 °F has much less negative effect on mature August–September Chinook than on feeding June–July Chinook—the master specification already supports multiple behavioral profiles and smooth transitions. Add that complexity only after the residual is demonstrated. Until then, the seasonal ceiling plus an asymmetric curve is more defensible and easier to calibrate.

Spring warming is already represented without a new variable. The city/species seasonal ceiling rises on the researched local calendar, while each hourly surface-temperature forecast moves along the cold side of the species curve. Thus, warming from 40 °F toward 50–57 °F improves thermal fit automatically; the same curve makes cooling beneficial once the surface is above the preferred region. This is consistent with the Lake Michigan steelhead finding that warmer areas were favored under cold May conditions while cooler areas were favored during warmer months.^8 A separate warming-rate bonus would risk counting the same seasonal transition twice and is not supported by a validated pier-scale coefficient.

## 8. Validation required before public use

The curves should remain private while the following dataset accumulates:

1. City, covered structure, local date, and assessment interval.
2. Species and whether the dominant context was lake feeding, mature staging/return, migration, or cold-season feeding.
3. LMHOFS issue time, lead, surface temperature series, and daily curve result.
4. Observed pier effort, catches, unsuccessful trips, and method where available.
5. Evidence of upwelling/front conditions when independently observable; retain it as context, not a score factor initially.
6. Open-water/access state and any event that invalidated the trip.

Evaluate v0.1 and v0.2 on the same held-out dated outcomes. Compare rank ordering and discrimination within each city/species season rather than trying to interpret the output as a calibrated catch probability. Specifically test `≤40`, `41–49`, `50–57`, `58–62`, `63–67`, `68–71`, and `≥72 °F` bins. Do not approve a tail that has only attractive model behavior but no observations.

## 9. Final disposition

| Question | Finding |
| --- | --- |
| Were reputable sources used originally? | Yes. The peak bands came from agency and Great Lakes sources. |
| Are all exact current ordinates biologically established? | No. Shoulder values are provisional FinFindr calibration. |
| Is 62 °F bad? | No. It should generally retain moderate-high suitability, with brown trout highest. |
| Is 70+ °F worse for pier salmonids? | Usually yes for pier reachability during stratification, because preferred water is commonly deeper/offshore. It is not proof of zero fish. |
| Is below 50 °F always better? | No. It can improve reachability while reducing metabolism; season, prey, and species matter. Use a moderate broad shoulder. |
| Does the formula need another variable? | No. Preserve the two-input formula. |
| Are monthly temperature curves necessary now? | No. Use the smallest asymmetric species curves; add behavioral profiles only if prospective residuals require them. |
| Implemented code action | The active private v0.2 candidate changes only the sub-50 °F cold shoulder, retains the entire v0.1 warm side, and keeps v0.1 exported for comparison. Public ratings remain disabled. |

## Sources

1. Adlerstein, S.A., Rutherford, E.S., Claramunt, R.M., Clapp, D.F., and Clevenger, J.A. “[Seasonal Movements of Chinook Salmon in Lake Michigan Based on Tag Recoveries from Recreational Fisheries and Catch Rates in Gill-Net Assessments](https://academic.oup.com/tafs/article/137/3/736/7888693).” *Transactions of the American Fisheries Society* 137, 2008, pp. 736–750. DOI 10.1577/T07-122.1.
2. Michigan Department of Natural Resources. “[Brown trout](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout).” Species and Great Lakes angling account, accessed 2026-09-10.
3. Sommers, L.M., Thompson, C., Tainter, S., Lin, L., and Lipsey, J.M.; Michigan Sea Grant. “[Fish in Lake Michigan: Distribution of Selected Species](https://repository.library.noaa.gov/view/noaa/38961/noaa_38961_DS1.pdf).” MICHU-SG-81-600, 1981, pp. 21–22; historical Lake Michigan outreach synthesis.
4. Michigan Department of Natural Resources. “[Steelhead](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead).” Lake-phase and migration account, accessed 2026-09-10.
5. Wisconsin Department of Natural Resources. “[Lake Michigan Outdoor Fishing Report — August 31, 2026](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport).” Creel-clerk fishing report; event evidence only.
6. NOAA Center for Operational Oceanographic Products and Services. “[Lake Michigan and Huron Operational Forecast System](https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html).” Operational model description, accessed 2026-09-10.
7. Stefaniak, O.M., Fitzpatrick, F., Dow, B.A., Blount, J.D., Sullivan, D.J., and Reneau, P. “[Influences of meteorological conditions, runoff, and bathymetry on summer thermal regime of a Great Lakes estuary](https://www.usgs.gov/publications/influences-meteorological-conditions-runoff-and-bathymetry-summer-thermal-regime-a).” *Journal of Great Lakes Research*, 2024. DOI 10.1016/j.jglr.2024.102416.
8. Höök, T.O., Rutherford, E.S., Brines, S.J., Schwab, D.J., and McCormick, M.J. “[Relationship between Surface Water Temperature and Steelhead Distributions in Lake Michigan](https://onlinelibrary.wiley.com/doi/abs/10.1577/m02-159).” *North American Journal of Fisheries Management* 24, 2004, pp. 211–221. DOI 10.1577/M02-159.
9. Wisconsin Department of Natural Resources. “[Chinook salmon fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_chinooksalmon.pdf).” 2008, p. 1.
10. Wisconsin Department of Natural Resources. “[Coho salmon fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_cohosalmon.pdf).” 2008, p. 1.
11. Great Lakes Fishery Commission. “[Temperature Relationships of Great Lakes Fishes: A Data Compilation](https://www.sealamprey.org/pubs/SpecialPubs/Sp87_3.pdf).” Special Publication 87-3, 1987; coho tables.
12. Dexter, J.L., Jr., and O’Neal, R.P., eds. “[Michigan Fish Stocking Guidelines II](https://www.canr.msu.edu/michiganlakes/uploads/files/Dexter%20et%20al.%202004.pdf).” Michigan Department of Natural Resources Fisheries Special Report 32, 2004; coho program and Lake Michigan migration account.
13. U.S. Geological Survey Nonindigenous Aquatic Species Program. “[Coho Salmon (*Oncorhynchus kisutch*) Species Profile](https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=908).” Great Lakes ecology account, accessed 2026-09-10.
14. Wisconsin Department of Natural Resources. “[Rainbow trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf).” 2008, p. 1.
15. Nettles, D.C., Haynes, J.M., Olson, R.A., and Winter, J.D. “[Seasonal Movements and Habitats of Brown Trout in Southcentral Lake Ontario](https://www.sciencedirect.com/science/article/pii/S0380133087716402).” *Journal of Great Lakes Research* 13, 1987, pp. 168–177. DOI 10.1016/S0380-1330(87)71640-2.
16. Spigarelli, S.A., Thommes, M.M., Prepejchal, W., and Goldstein, R.M. “[Selected temperatures and thermal experience of brown trout, *Salmo trutta*, in a steep thermal gradient in nature](https://www.osti.gov/servlets/purl/8505095).” *Environmental Biology of Fishes* 8, 1983, pp. 137–149; Lake Michigan thermal-plume field research.
17. Wisconsin Department of Natural Resources. “[Brown trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_browntrout.pdf).” 2008, p. 1; broad printed range retained as conflicting summary evidence.
