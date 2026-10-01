# Today's Bite — Pass 2 completion

Completed locally on 2026-09-23. Pass 2 implements and evaluates seasonal calibration and shared-condition consistency. It does not deploy the model or establish improved catch prediction. Original, Pass 1, and Pass 2 results are preserved for Pass 3.

## Completed scope and decisions

| Review area | Final implementation / decision |
| --- | --- |
| Seasonal temperature | Blend neighboring monthly suitability curves by actual calendar date, centered on the 15th. Blend suitability at the same temperature, not a fabricated moving optimum. Historical temperatures use the same day's curve, so calendar movement cannot invent a warming/cooling trend. |
| Monthly weights and elite-score envelopes | Interpolate these too; smoothing temperature alone left other month-boundary score jumps. Available contribution weights always sum to 100. |
| Regional temperature repair | Replace the eight-region, weather-gated repair and hidden weight multipliers with an explicit monotone thermal adjustment. Rain no longer rewrites normalized temperature. The correction has no flat +0.45 plateau, no relief for shock/hot-side inputs, and no relief for coastal air or current-air fallback. Its anchors are compatibility choices, not empirically fitted catch coefficients. |
| Southern measured-water bands | Bound very-cold/cool/optimal anchors at 60/70/80°F in mapped Gulf Coast, Florida and Southeast Atlantic water rows. This removes severe-cold interpretations of moderate 75–80°F water in summer. Retain cooler winter anchors, existing hot tails and separate air tables. These bounds are model guardrails, not universal species physiology. |
| Air versus water | Preserve existing source units and selection; add explicit measured-water/daily-air/current-air provenance. Current-air fallback lowers confidence. Air history is 48 hours; coastal water history is 72 hours and rate-normalized to 48 hours for trend and sustained-shock comparisons. No unvalidated freshwater water-temperature estimator was introduced. |
| Winter light | Apply continuous cold relief to negative freshwater light contributions. Join cloud curves at 25/85/90% and the flats 20% boundary; taper the high-cloud wind interaction from 14–18 mph. Preserve physical sky labels and heavy-cloud restraint. |
| Score calibration | Smooth numeric score lifts and remove the discontinuous middle-band spread. Apply final data-quality/weather/suppressor caps after the legacy floor, so the floor cannot undo them. Correct diagnostic contribution percentages that were multiplied by 100 twice. |
| Pressure | Evaluate a 25% base-weight reduction in shadow; retain production weights because changed scores/picks alone do not establish better predictions. Pass 1's corrected pressure history remains intact. |
| Score-to-activity thresholds | Retain suppressed ≤35, neutral 36–69, active ≥70. Existing boundary tests and the joint replay exercise these transitions. Do not invent species coefficients without outcome data. |
| Recommendation rules | Preserve species, water type, seasonal rows, surface gates, catalogs, ranking and deterministic seed rules. Seasonal catalog rows still switch by month; continuous scoring does not interpolate lure/fly IDs. |
| Geography / finer southern regions | Evaluate Panhandle, central and South Florida; inland, upper-coast and lower-coast Texas; Alabama and Mississippi. Retain existing canonical regions and seasonal-row coverage. Additional thermal subregions need source-specific observations before their coefficients can be justified. |
| Other factors | Pressure, wind, rain, runoff and tide normalization are unchanged from Pass 1; verified row by row. Better measured river flow remains a separate provider/model project, not a speculative change to the existing rainfall proxy. |

## Evidence

**580 tests passed, zero failed**, including both engines, recommender endpoint tests and daily-session tests. The 14 new Pass 2 tests cover seasonal anchors/leap years, monotone regional correction, rain independence, heat/shock protection, provenance/confidence, history intervals, light continuity, weight normalization, month boundaries, final caps, cross-feature thermal semantics, southern measured-water suitability and reported percentages. One existing expectation changed deliberately: 6°F over 72 hours is 4°F per 48 hours, below the 5°F trend threshold.

### Calendar continuity

[continuity.json](./continuity.json) compares 22,464 pairs: 18 regions × four water contexts × 12 real month boundaries × 26 temperatures. Weather and temperature are held constant between the last and first days of adjacent months.

| Absolute score change | Pass 1 | Pass 2 |
| --- | ---: | ---: |
| Mean | 3.535 | 0.103 |
| 95th percentile | 17 | 1 |
| Maximum | 35 | 3 |
| Pairs changing more than 10 points | 3,671 | 0 |

No pair became worse by more than the explicit three-point tolerance. Some individual pairs that previously had zero movement now change by 1–2 points as the seasonal curve advances; this is not a claim that every pair is unchanged or improved. These probes use stable inputs from 35–85°F and do not exhaust all possible weather/shock combinations.

### Original → Pass 1 → Pass 2 replay

[comparison.json](./comparison.json) includes both comparisons, grouped by region, context and Sep–Mar versus Apr–Aug, plus the largest increases and decreases.

| Compared with Pass 1 | Main matrix | Raw adapter / forecast matrix | Combined |
| --- | ---: | ---: | ---: |
| Condition cases | 21,880 | 2,352 | 24,232 |
| Changed scores | 10,283 | 1,672 | 11,955 |
| Changed score bands | 3,298 | 360 | 3,658 |
| Changed timing outputs | 282 | 146 | 428 |
| Recommendation sets | 9,252 | 882 | 10,134 |
| Sets with changed selected picks | 409 | 112 | 521 |
| Sets with changed lure selections | 357 | 101 | 458 |
| Sets with changed fly selections | 276 | 78 | 354 |
| Changed activity levels | 470 | 70 | 540 |
| Changed surface gates | 26 | 0 | 26 |
| Changed embedded color themes | 0 | 0 | 0 |
| Lost recommendation coverage | 0 | 0 | 0 |
| Checked contract violations | 0 | 0 | 0 |

Lure and fly change counts overlap. Pace or depth changed in 461 sets. Thermal tags changed in 302 sets. Mean score change versus Pass 1 is −0.594 points overall; versus the original it is +0.991. Higher scores are not the success criterion.

Every candidate has the same request and recommendation eligibility coverage as its Pass 1 counterpart. Checks validate score bounds/bands, contribution totals, missing-data and confidence caps, four distinct picks, closed-surface exclusion, favorable-winter-warmth semantics, and unchanged unrelated normalized factors. The capture also checks full-report/score-only parity on every case. Main-matrix missing seasonal rows remain 1,744 and boundary-matrix missing rows remain 147; those existing unsupported combinations were not silently converted to recommendations.

[recommender-parity.json](./recommender-parity.json) additionally verifies all **10,134 complete responses** against the preserved Pass 1 recommender supplied with Pass 2 shared analysis. They match exactly. This attributes recommendation changes to shared conditions; it does not establish that every changed pick catches more fish.

Representative material changes:

- Florida coastal flats, August, favorable-pressure fixture: **69 → 93**, because moderate measured water previously received a severe-cold score. This is a substantial model change, made visible rather than hidden in an average.
- Pacific Northwest coastal flats, August, favorable-pressure fixture: **90 → 69**, because the former regional repair was neutralizing an adverse hot-side thermal input. The new cool-side-only correction preserves that suppressor.
- Montgomery lake forecast crossing into November under a warming profile: **86 → 70**, as seasonal interpolation replaces the abrupt November table jump. That reduction is an intended correction to the calendar artifact.
- Florida freshwater lake Sep–Mar main fixtures average **−3.21 points** versus Pass 1; South Central averages **−0.50**. There is no blanket southern-winter boost.

### Regional and pressure review

[regional-review.json](./regional-review.json) records all **648 region/month/source rows**, **52,488 bounded thermal probes**, and **1,008 city/context/season/profile cases**. The nine city probes include Tallahassee, Tampa, Miami, Dallas, Houston, Brownsville, Montgomery, Jackson and Mobile, with steady conditions, gradual cooling, cold fronts and warm spells in September–March. Cold fronts retain shock classification and receive no regional relief. The cities use controlled synthetic inputs, not observed local weather or fish catches.

[pressure-sensitivity.json](./pressure-sensitivity.json): reducing base pressure weights by 25% changes 6,141 of 21,880 scores, by at most eight points; 246 cross the activity-70 boundary and 167 cross Prime-80. Among 9,252 recommendation sets, 77 change picks and 178 change activity. **Retain current weights** until catch-outcome evidence supports an alternative. Temperature remains a key factor, but tide dominates coastal opportunities and runoff can dominate rivers; forcing temperature to be the largest weight everywhere would erase those context differences.

## Scientific interpretation and limits

[FWC's freshwater temperature guidance](https://myfwc.com/fishing/freshwater/fishing-tips/temperatures/) distinguishes species preferences and feeding ranges. These are water temperatures, so applying those numbers directly to daily air inputs would be a units/source error. [FWC's bass guidance](https://myfwc.com/fishing/freshwater/sites-forecasts/black-bass/) describes substantial spawning-season variation within Florida; that supports separate regional evaluation, not invented coefficients for new region keys.

[TPWD's seatrout guidance](https://tpwd.texas.gov/faq/fishboat/fish/) associates moderate 75–80°F water with peak seasonal periods and describes a much broader feeding range. This supports correcting severe-cold treatment of that interval in southern coastal rows. It does **not** validate the exact 60/70/80 guardrails for every coastal species or prove the scores' probability calibration.

The score remains a general opportunity index, not a catch probability or species-specific physiological model. Synthetic regression tests establish software contracts and smoother, more consistent behavior. They cannot guarantee zero real-world regression. Source-specific field/catch validation, within-region waterbody differences, species-aware feeding activity and absolute physiological stress modeling remain evidence requirements for subsequent model work. Seasonal warm labels alone must not be interpreted as biological heat stress.

## Preserved artifacts and reproduction

- Original frozen files: [Pass 1 directory](../todays-bite-pass1/README.md), `baseline.jsonl.gz` and `boundaries-baseline.jsonl.gz`.
- Frozen Pass 1 results here: `pass1.jsonl.gz`, `boundaries-pass1.jsonl.gz`, matching manifests.
- Frozen Pass 1 source: `pass1-shared-source.tar.gz` and SHA-256 manifest, allowing attribution without relying on a temporary directory or an uncommitted historical checkout.
- Pass 2 results: `candidate.jsonl.gz`, `boundaries-candidate.jsonl.gz`, matching manifests.
- Verification scripts: `scripts/audit/todays-bite-pass2/`. The Python verifier checks each replay archive's checksum before comparing it.

Run from `TightLinesAI` with Deno and Python 3 installed. No provider calls, environment secrets or production writes are required:

```sh
mkdir -p /tmp/todays-bite-pass2-pass1
# Verify the source tarball's SHA-256 against its manifest before extraction.
tar -xzf docs/audits/todays-bite-pass2/pass1-shared-source.tar.gz -C /tmp/todays-bite-pass2-pass1

deno test --no-lock --node-modules-dir=none --allow-read --allow-env supabase/functions/_shared/howFishingEngine supabase/functions/_shared/recommenderEngine supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/recommender/index.test.ts

deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --output-dir=docs/audits/todays-bite-pass2
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts compare --boundaries --output-dir=docs/audits/todays-bite-pass2
python3 scripts/audit/todays-bite-pass2/verify.py

deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass2/continuity.ts /tmp/todays-bite-pass2-pass1/_shared
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass2/regional-review.ts /tmp/todays-bite-pass2-pass1/_shared
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass2/recommender-parity.ts /tmp/todays-bite-pass2-pass1/_shared
deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass2/sensitivity.ts
```

Audit TypeScript typechecking and `git diff --check` also passed. No dependency/lockfile, environment, deployment or cache-version changes were made for Pass 2.

## Pass 3 handoff

Pass 2 implementation, sensitivity review and local comparisons are complete. Carry all three generations of results into Pass 3. Validate representative real provider snapshots and review the material score/pick changes before a coordinated release of Today's Bite, forecast-scores and recommender. Coordinate client caches, forecast snapshots and daily-session engine versions; preserve refresh entitlements and test retained as well as fresh sessions. Field outcomes are needed before describing the recalibration as improved catch prediction.
