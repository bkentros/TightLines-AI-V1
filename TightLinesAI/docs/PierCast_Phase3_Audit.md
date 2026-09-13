# PierCast Phase 3 annual lineup audit

> **Owner-approved public research release — 2026-09-13:** [Authoritative release policy and disclosure](PierCast_Public_Release_Readiness.md). The existing five-city, 28-pair roster is approved for public research-based estimates. Earlier public-blocked/private-only statements below describe the prior policy. Scientific validation statuses and numeric scores remain unchanged; no production app build is created.

> **Final roster reconciliation — 2026-09-13:** [Authoritative decisions and confidence limits](PierCast_Final_Roster_Reconciliation.md). All 45 additional pairings now use the recurring-covered-pier-catch standard. Eight additions are scored, including Manistee North Pier smallmouth; 37 are not admitted for explicit evidence reasons. The private lineup is 28 combinations (6/6/8/4/4), with 140 forecasts per run. Engine v0.10.0 and roster v3 preserve prior rosters and daily locks. Earlier counts below are historical. Numeric curves, formula and public gates remain unchanged.

Audit date: 2026-09-13. Baseline: `7c69499`. Corrected engine: `pier-cast-simple-model-v0.9.1`. Scope: the five frozen cities and seven covered structures; the private provisional lineup only.

**Result: the annual configuration audit is complete, with two runtime defects corrected.** All 27 configured city/species combinations have continuous annual seasonal scores and a thermal profile. All 45 additional-species decisions remain explicit: seven private admissions and 38 whole-pair deferrals. No seasonal anchor, thermal knot, scoring formula, city roster, or covered structure changed. Public ratings remain disabled. This is configuration and implementation verification, not prospective proof of forecast accuracy.

Review the [annual heatmap](PierCast_Phase3_Annual_Lineup.html), [52-week lineup CSV](PierCast_Phase3_Annual_Lineup.csv), and [machine-readable audit](PierCast_Phase3_Audit.json). The heatmap supports city selection and date/value tooltips. The existing [private weekly ratings](PierCast_Private_Lineup_Weekly_Ratings.csv) remain current and numerically unchanged.

## Findings and corrections

### 1. Winter metadata contradicted the accepted annual configuration

The full runtime path failed on January Chinook even though the seasonal evaluator returned a valid number. Older species-month metadata still marked Chinook January/February/November/December, coho January/February/December, and drum January/February/November/December as `absent_biology_evidence`. The temperature evaluator therefore withheld scores; the all-species completeness requirement then prevented a daily snapshot. This affected the core as well as additions and was missed by seasonal-only annual tests.

Those **11 shared species-month classifications** now explicitly use `proposed_regional_transfer`, consistent with the accepted private annual calibration. The uncertain `LF?`/`WD?` context codes remain unchanged. The [biology matrix](PierCast_Species_Month_Biology_Matrix.csv) labels the basis `private_annual_calibration_prior_not_direct_winter_biology` and retains the limitations concerning winter catchability and modeled water. The underlying biological references are unchanged; this correction does **not** claim newly discovered winter pier evidence. It adopts the already documented low-confidence annual prior for private evaluation. The matrix now contains 74 sourced contexts, 81 proposed transfers and one absent context; deferred round whitefish remains unsupported.

The evaluator's absent-biology, stale/missing water, unreviewed representation and provisional-public gates remain intact and tested. No biology classification was promoted to sourced evidence or scientific approval. The monthly full-pipeline regression now requires all 27 scores and a complete private snapshot at a hypothetical constant 2°C in each month. That temperature is a controlled test input, not a climatology.

### 2. Daily integration omitted the corner at the score ceiling

The instantaneous formula correctly clamps scores to 10. The daily integrator split changing water temperature at thermal knots but omitted additional corners where the formula first reaches 10. Integrating the already-clamped endpoints slightly understated the area across such a crossing.

The integrator now includes those ceiling crossings. An independent 100,000-point midpoint quadrature test for Frankfort steelhead on October 16, alternating hourly between 10°C and 18°C, failed before the correction: **9.75175 calculated versus 9.768113636 expected**. It now agrees within 0.000001. The formula, thermal curve, seasonal curve and daily-lock policy are unchanged. Engine provenance advances to v0.9.1 so corrected calculations remain distinguishable from older archived runs. Existing daily snapshots are not rewritten.

## Annual lineup reviewed together

These counts use 52 reference dates, January 4 through December 27, 2025, spaced seven days apart. They are **seasonal baselines**, not predicted actual-temperature scores. “Good” means the existing displayed rubric labels a score Good or Excellent; rounding is applied before classification. An overlap week has at least two such species. Counts do not establish empirical accuracy or safe/open-water access.

| City | Configured species | Weeks with ≥1 Good/Excellent baseline | Weeks with ≥2 | Weeks when all baselines are Poor/Limited |
| --- | ---: | ---: | ---: | --- |
| Ludington | 6 | 19 | 0 | 1–2 |
| Grand Haven | 6 | 37 | 24 | 1–2 |
| Manistee | 7 | 29 | 17 | None |
| Frankfort–Elberta | 4 | 28 | 15 | None |
| Sheboygan | 4 | 32 | 22 | 46–50 |

There is no forced winner rotation, fixed annual total, or adjustment to fill weak periods. Several species can be strong together. Ludington's lack of overlapping Good baseline weeks is a result of its existing curves and threshold; it is not a rule applied to that city. A year-round feature does not imply a Good fishery every week.

### Additional species: timing, magnitude and retained limits

The evidence audit uses the retained primary-source extracts, dated reports, mode/structure distinctions and contradictions in the [45-pair seasonal report](onboarding/piercast/remaining-species/PHASE1_SEASONAL_RESEARCH.md), [thermal report](onboarding/piercast/remaining-species/PHASE2_THERMAL_RESEARCH.md), and [final admission register](onboarding/piercast/remaining-species/PHASE2_ONBOARDING_DECISIONS.md). It is a reconciliation of those sources and configurations, not a new creel survey. Source hashes and deterministic evidence exports pass their checks.

| Pairing | Annual range | Peak anchor(s) | Evidence interpretation retained |
| --- | --- | --- | --- |
| Ludington smallmouth | 1.5–4.5 | July 15 | Repeated summer North Breakwater corroboration; excluded stub-pier spring catches cannot create a spring peak. Fair ceiling reflects limited effort/catch strength. |
| Ludington perch | 1.5–6.0 | July 15 | June/July North Breakwater schooling fishery with variable recurrence and slow reports. Late-summer decline remains; not copied from Manistee. |
| Grand Haven drum | 1.5–7.0 | June 15 | Recurrent modern pier catches support a broad warm-season opportunity. High pooled catches from a single year do not create a July spike. Covered South Pier inference and retained structure limits remain explicit. |
| Grand Haven largemouth | 1.5–6.5 | August 15 | Recurrent July/August pier reports support a late-summer peak. Generic spring spawning biology does not determine the peak. Catch-and-release/harvest method constraints remain attached. |
| Manistee lake trout | 1.0–3.0 | April 15 and October 15 | Limited spring pier recurrence; autumn shoulder is a lower-confidence port/biology transfer. South-only and offshore catches cannot elevate the North Pier curve. Deep summer opportunity remains 1.0. |
| Manistee drum | 1.5–4.5 | July 15 | Recurrent pier reports conflict with weak modern aggregate creel estimates. Keep Fair rather than Grand Haven's Good. North-side naming in a reprint corroborates the agency event; it is not counted as another catch event. |
| Manistee perch | 1.5–7.0 | May 15 | Exact North Pier spring reports and recurrence support April/May strength. Sorting, slow reports and concentrated catch years limit the peak. Summer remains weak, unlike Ludington. |

All seven retain full-year numbers, including weak seasons. Those low months are explicit habitat/accessibility and seasonal-transfer judgments, not measured winter CPUE or evidence that the fish will be caught on any given date. Monthly midpoints express approximately monthly evidence resolution; daily decimals are interpolation, not independent observations.

The seven additions peak between 3.0 and 7.0, below the strongest established core fisheries. Core maxima range from 5.6 to 10.0 across the 20 city/species curves. This preserves the intended relative magnitude; it is not evidence that all core fisheries are always better than every addition. No numerical correction was justified merely to make the annual chart look more balanced.

### Deferred pairings and thermal interpretation

All 38 deferrals remain unavailable as entire city/species pairings. Nine retain annual research curves outside the scored lineup; 29 lack accepted annual curves. A deferral is not biological absence. The audit retains unresolved covered-side evidence, unidentified “bass,” historical whitefish/snaring context, boat catches and upstream fisheries as limitations rather than admitting them through broad city presence. Frankfort and Sheboygan retain four scored species each; no blanket additions were made.

Nine unique thermal profiles serve the current roster: the four core species plus lake trout, smallmouth, drum, perch and largemouth. The model uses one species thermal profile together with city-specific seasonal opportunity. Thermal preference, growth, spawning and occupancy evidence remains distinct from adult pier bite probability. Cold water does not automatically erase an admitted annual prior. Conversely, favorable surface temperature cannot lift a seasonal rating of 1.0 or make an excluded structure eligible. Temperatures outside a curve's reviewed domain return unavailable, not a mortality or zero-catch prediction.

Surface-to-fishing-depth representation remains unapproved. The temperature modifier remains bounded at 0.30 + 0.75 × fit; there is no second spawning, depth, temperature-trend or weather multiplier. Some biological processes inform both seasonal timing and thermal compatibility, so empirical double-counting cannot be ruled out from code alone. Prospective paired outcomes remain necessary to evaluate that modeling assumption.

## Verification and operational closure

- **39,447 daily seasonal evaluations:** all 27 curves across 2024–2027, including leap day and year wrap; finite scores bounded 1–10 throughout.
- **1,404 weekly rows:** all configured species side by side; original core/private weekly artifacts match generated values.
- **11,232 temperature scenarios:** 27 pairings × 52 weeks × eight fixed temperatures; valid results obey the unchanged modifier bounds; out-of-domain inputs remain unavailable.
- **2,889 thermal grid checks and 63 failure-gate checks:** nine profiles across 0–32°C at 0.1°C intervals, plus public, disabled, missing, stale, unreviewed, absent-biology and nonfinite cases.
- **2,430 full-pipeline species-days plus 18 snapshots:** twelve months, leap day, both DST transitions, year-end/year-start, and post-regulation-review expiry. These test completeness; eligibility still expires separately from the biological score.
- Maximum observed daily seasonal movement is about **0.2632 points/day**, in the existing Frankfort Chinook curve. The fastest addition changes about **0.1333/day**. These are finite linear ramps between retained anchors; neither an arbitrary smoothness cap nor fabricated finer evidence was imposed.
- **136 PierCast tests and `npx tsc --noEmit` pass.** Source/evidence checks, Phase 2 artifacts, private roster/weekly artifacts and frozen core seasonal replay pass. Run `npm run check:pier-cast:phase3` to reproduce this audit.

The roster migration remains the deployed 20260912180000 version; no schema change is required. Both edge functions were deployed with v0.9.1: `pier-cast` deployment 19 and `pier-cast-ingest` deployment 14 are ACTIVE with JWT verification enabled. Linked local/remote migration histories match. Production read-only smoke checks return HTTP 200 with zero public catalog cities and HTTP 403 for anonymous private outlook access. No authenticated owner-session production smoke was performed; private behavior is covered by the engine/handler tests. First-write daily locks and legacy four-species snapshot reads remain tested; historical records are not migrated to new scores. New shadow records carry the corrected engine version. The frozen earlier validation cohort must not silently pool the new roster or corrected-engine calculations.

Remaining scientific work is prospective validation and field temperature representation, not unfinished configuration. Regulatory review for additions remains valid only through 2027-03-31 and carries method restrictions. Public release needs its own explicit instruction and satisfied scientific gates. Separate UI/marketing edits belong to the other workstream and are excluded from this audit commit.
