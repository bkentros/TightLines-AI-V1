# FinFindr PierCast — Agent Build Specification

> **Phase 1 seasonal research — 2026-09-12:** The [seasonal evidence report](onboarding/piercast/remaining-species/PHASE1_SEASONAL_RESEARCH.md) and [research configuration](PierCast_Remaining_Species_Seasonal_Curves.json) now evaluate all 45 additional pairings, with 15 bounded provisional seasonal proposals and explicit gaps for the rest. The [weekly review](PierCast_Remaining_Species_Weekly_Ratings.csv) contains 2,340 rows; daily and monthly projections preserve missing periods. This supersedes the older blanket statement that no additional seasonal proposal is justified, but does **not** change runtime eligibility, the four completed species or public gates. Phase 2 must preserve bounded availability and resolve thermal/structure eligibility before runtime integration; Phase 3 verifies the annual lineup together. These proposals are not high-confidence annual numerical completion.

> **Candidate-list correction — 2026-09-12:** Use the [batch research roster](onboarding/piercast/remaining-species/CANDIDATE_ROSTER.md) to select additional species for research: 25 candidate pairings, seven occurrence leads and 13 not established in the reviewed evidence. Recurring pier catches can qualify a research candidate without prior proof of major intentional targeting or score-ready calibration. The earlier strict classifications remain scoring caveats, not the research queue. Numerical and public-release gates remain unchanged.

> **Earlier strict scoring review — superseded for research planning and proposals:** The [45-pair decision register](onboarding/piercast/remaining-species/README.md) supersedes earlier candidate labels for the nine non-core species. Three narrow fishery leads remain; other pairings are historical/unresolved or excluded. No additional daily seasonal or thermal curve is justified by this review. Numerical onboarding remains unresolved, with explicit unavailable/excluded weekly rows and configuration gates. The existing four-species scores, formula, UI, daily lock, conditions pipeline and disabled public release remain unchanged.

**Version:** 2.0\
**Updated:** 2026-09-11\
**Authority:** The [Master Build Specification](PierCast_Master_Build_Spec.md)
governs where this concise execution guide is silent.

## Frozen v1 cohort

Follow [PierCast v1 Scope Freeze](PierCast_Scope_Freeze_v1.md). Product work is limited to the five frozen city IDs, four core species, and seven covered structures. The roster is enforced by `config/scope.ts`; research-only secondary species and unresolved/excluded structures must not leak into v1 UI counts or scores.

Published public routes are resolved in the [five-city onboarding dossiers](onboarding/piercast/README.md). `open_by_published_rules` never means live-open: current signs, closures, construction, waves, ice, and authority instructions control.

The [field temperature program](PierCast_Field_Temperature_Program.md) is the required evidence path where public observations are absent or spatially inadequate. Its data are validation-only and may never become runtime fallback. The code/archive portion is deployed; physical authorization, deployment, elapsed seasons, and prospective outcomes remain external evidence gates.

## Product contract

PierCast is a city-level Great Lakes pier-fishing outlook. It provides a
**FinFindr Opportunity Rating** for each supported species and date, then uses
the highest eligible species as the city headline.

Every available rating MUST be displayed to one decimal as **`X.X/10`**, such as
`7.6/10`. Internally retain the continuous score for aggregation and deterministic
ranking. The rating is FinFindr's configured estimate of relative fishing
opportunity—not detected fish presence, a fish count, catch probability, or
guarantee.

The calendar contains today plus four additional city-local dates. Today covers
only the remaining local day; future dates cover full local calendar days.

## V1 scoring model

PierCast v1 has exactly two numeric score inputs:

1. `P_rating(c,s,t)`: the city × species **Seasonal Pier Opportunity Rating**,
   continuously evaluated on the `1–10` FinFindr scale.
2. `T(s,t)`: water-temperature suitability on `[0,1]`, presented as
   **nearshore thermal fit** and resolved from the species' applicable
   temperature curve and the city's hourly surface-temperature series. It is
   a pier-reachability proxy, not the fish's experienced temperature at depth.

Use the bounded-temperature v2 formula:

```text
M(s,t) = 0.30 + 0.75 × T(s,t)
score(c,s,t) = clamp(1, 10,
  1 + (P_rating(c,s,t) - 1) × M(s,t)
)
```

Equivalent direct form:

```text
score(c,s,t) = clamp(1, 10,
  1 + (P_rating(c,s,t) - 1) × (0.30 + 0.75 × T(s,t))
)
```

This guarantees:

```text
1 ≤ score(c,s,t) ≤ 10
```

The worst supported fit retains 30% of seasonal headroom; only `T > 0.9333…`
can exceed the seasonal rating, and perfect fit supplies at most a five-percent
headroom multiplier. Favorable temperature must never create a strong rating
during a city/species period configured as weak. The prior ceiling formula is
retained only as a versioned prospective shadow comparator.

## Configuration ownership

### Species profile

Owns:

- Stable species ID, public name, aliases, and artwork reference.
- Seasonal temperature-preference curves.
- Smooth transitions where feeding, staging, spawning, or other supported
  contexts require different temperature responses.
- Temperature evidence, calibration status, and curve version.

The resolved output is one temperature-suitability value `T(s,t)` from `0–1`.
Temperature direction or trend is not a separate scoring input.

### City × species profile

Owns:

- Eligibility and covered-pier scope.
- One recurring Seasonal Pier Opportunity Rating curve on the `1–10` scale.
- Evidence and calibration status for each meaningful timing segment.
- Targeting restriction and limitation copy.

The seasonal curve owns both local fishery strength and timing. There is no
separate permanent local baseline or annual multiplier. Its yearly peak is the
reference rating under broadly supportive temperature; v2's small synergy is
the only way the final score can exceed it.

Configure the curve with sparse `MM-DD` anchors and interpolate daily across
them. Use broad flat spans when evidence supports a consistently slow period.
Use weekly or finer anchors only around evidenced arrivals, peaks, and declines.
The curve must remain continuous across December/January and behave
deterministically in leap years.

### City profile

Owns:

- Stable city ID, name, state, and IANA timezone.
- The named structures covered, excluded, or unresolved.
- One declared nearshore/port water-temperature series used by every rating
  unless an explicit later product revision says otherwise.
- Temperature source label, provider metadata, freshness, coverage, and
  fallback/unavailable behavior.

Provider depth/layer metadata may be retained for provenance, but depth is not a
score variable. Do not dynamically choose whichever source produces a more
favorable score. Clearly label modeled temperatures and disclose that localized
harbor, plume, surface, and depth conditions may differ.

## Daily calculation

Evaluate the formula over the accepted hourly temperature series using unrounded
values. The seasonal rating changes by local date; temperature suitability
changes with the temperature series.

```text
dailySpeciesScore = integral(score(c,s,t), covered intervals)
                    / duration(covered intervals)
```

Use elapsed UTC duration, including 23/25-hour daylight-saving dates. Do not
score from daily mean temperature, select the best hour, or extend the last
value beyond the provider horizon. Missing required coverage yields partial or
unavailable according to the reviewed policy.

The Overall Pier Score is the highest complete, targeting-eligible daily species
score. It is not an average of species and has no separate formula.

## Daily publication and live conditions

Precompute tomorrow's complete five-city score set from the latest complete
evening LMHOFS issue. Publish it at `00:00 America/Chicago` and treat the first
successful row for that Lake Michigan date as immutable. The snapshot owns
today's four species scores, city headline, and leaderboard inputs. Cached
fallback data must never establish or replace it. If it is missing, withhold
today's numbers rather than exposing a ranking that can move during the day.

Environmental presentation is independent: accept every new complete six-hour
LMHOFS issue for water, refresh contextual weather as available, recompute the
remaining-day timeline at read time, and refresh the focused client every 15
minutes plus on focus. Air and wind remain context only. Surface two timestamps
or statuses so users can distinguish “score locked for today” from “conditions
refreshed.” Future-day scores may change with accepted forecast inputs until
their own daily snapshot is published.

## Variables with zero score weight

Do not include these in the v1 number:

- Permanent local baseline separate from the seasonal curve
- Annual abundance multiplier
- Temperature trend
- Wind or waves
- Pressure or moon phase
- Cloud/light
- Rainfall or tributary flow
- Turbidity, currents, or dissolved oxygen
- Access, closure, hazard, or confidence state

Access, legal status, severe conditions, and confidence may qualify or suppress
recommendation placement without altering the numeric rating. Future numeric
variables require a new engine version and evidence from a held-out comparison
against this two-input baseline.

## Winter/open-water behavior

From January through March, every report MUST show:

> **Open-water outlook only.** This rating applies only when the covered pier is
> open, legally accessible, and adjacent water is fishable. PierCast does not
> assess ice thickness, pier icing, or whether walking onto ice is safe. Verify
> current access and conditions before going.

A known closure blocks recommendation. Unknown winter access retains the
warning. Neither silently lowers the species rating. PierCast must never imply
that ice is safe.

## Missing and unsupported states

Return a nonnumeric state when:

- The city/species seasonal curve is absent or not approved for the current
  mode.
- The applicable temperature curve is absent or not approved.
- Water temperature is missing, stale, incomplete, invalid, or outside the
  accepted curve domain.
- The city/species pairing is unsupported or materially unresolved.

Never serialize zero as a substitute for missing data. Never expose a
provisional curve through a public endpoint. All available reads include
`score`, one-decimal `displayScore`, and `displayText: "X.X/10"`.

## Research and calibration

The monthly matrices remain an inventory rather than scoring curves. The
disabled [core seasonal calibration](PierCast_Core_Species_Seasonal_Calibration.md)
and [core temperature/source calibration](PierCast_Core_Temperature_and_Source_Calibration.md)
now provide private provisional curves for Chinook, coho, steelhead, and brown
trout only. The [v0.4 full-scale audit](PierCast_Full_Scale_Seasonal_Recalibration_v0.4.md)
anchors all four Michigan ports to official 1997–2022 `Pier/Dock` creel data,
checks current Michigan aggregate seasonality, and uses the strongest available
Wisconsin mode-specific and direct Sheboygan evidence. The other nine species
remain nonnumeric. The [v0.4 seasonal replay](PierCast_Seasonal_Calibration_Replay_v0.4.md)
finds strong retrospective consistency across 120 Michigan monthly cells but is
in-sample, excludes Sheboygan from quantitative claims, and does not authorize
release. Continue validating the core city × species timing curves from dated,
pier-specific evidence:

- Recurring arrival and first-catch periods
- Ramp-up and peak timing
- Decline and late-season tail
- Multiple years where available
- Successful and unsuccessful effort where reported
- Clear separation of pier, shore, boat, and upstream evidence

Do not force 52 independent weekly values. Use only the knots needed to
represent the supported pattern. More date precision without evidence is false
accuracy.

Temperature endpoints must distinguish applicable life stage and behavior where
possible. Exact suitability values and seasonal ratings are FinFindr
configuration choices informed by evidence; they are not automatically
agency-validated biological measurements.

Before public enablement, compare:

1. Seasonal curve alone.
2. The archived direct-temperature v1 comparator.
3. The active bounded-temperature v2 score.

Evaluate false excellent days, missed good days, score distribution, source
coverage, stability around curve knots, and target-specific user feedback. Do
not add another variable unless it materially improves held-out results.

## Required implementation invariants

- Perfect temperature can add no more than five percent of the seasonal
  opportunity above the 1.0 floor.
- Temperature cannot remove more than 70% of the configured seasonal
  opportunity above the 1.0 floor.
- A low/offseason seasonal rating cannot become strong because of temperature.
- Seasonal and temperature knots interpolate continuously.
- Calendar curves remain continuous across year-end and leap years.
- Same city, species, date, and water temperature always produce the same
  numeric score regardless of wind, trend, or other context.
- Daily calculation uses duration-weighted hourly scores.
- Available public UI always displays `X.X/10`.
- Overall score equals the named driving species score.
- Missing or unapproved required inputs fail closed.
- January–March reports contain the open-water warning.

## Immediate build order

1. Preserve the completed v0.4 seasonal curves and retrospective replay as the
   current private cohort; do not tune against the same aggregate archive again.
2. Continue the deployed [prospective shadow ledger](PierCast_Shadow_Validation_Ledger.md)
   for all five cities and four core species. Forecast capture, the append-only
   outcome contract, and the private owner outcome-entry/review interface are
   operational. Collect outcomes under the frozen
   [prospective evaluation protocol](PierCast_Prospective_Evaluation_Protocol_v2.md).
3. Continue the temperature-representation evidence collection; do not approve
   a city whose representation gates remain blocked.
4. Review false-high examples by preregistered score band after a complete
   season or minimum sample, then version any justified curve changes.
5. Keep the public catalog empty until both seasonal outcome and temperature
   representation gates pass.

The engine remains configuration-driven: onboarding another city or species
should add evidence and curves, not another scoring formula.
