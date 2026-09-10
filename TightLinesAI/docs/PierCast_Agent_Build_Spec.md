# FinFindr PierCast — Agent Build Specification

**Version:** 2.0\
**Updated:** 2026-09-09\
**Authority:** The [Master Build Specification](PierCast_Master_Build_Spec.md)
governs where this concise execution guide is silent.

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

1. `P_rating(c,s,t)`: the city × species **Seasonal Pier Opportunity Ceiling**,
   continuously evaluated on the `1–10` FinFindr scale.
2. `T(s,t)`: water-temperature suitability on `[0,1]`, resolved from the
   species' applicable seasonal temperature curve and the city's hourly
   water-temperature series.

Use the multiplicative formula:

```text
P(c,s,t) = (P_rating(c,s,t) - 1) / 9
O(c,s,t) = P(c,s,t) × T(s,t)
score(c,s,t) = 1 + 9 × O(c,s,t)
```

Equivalent direct form:

```text
score(c,s,t) = 1 + (P_rating(c,s,t) - 1) × T(s,t)
```

This guarantees:

```text
1 ≤ score(c,s,t) ≤ P_rating(c,s,t) ≤ 10
```

Do not replace this with an additive percentage formula. Favorable temperature
must never create a strong rating during a city/species period configured as
weak.

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
- One recurring Seasonal Pier Opportunity Ceiling curve on the `1–10` scale.
- Evidence and calibration status for each meaningful timing segment.
- Targeting restriction and limitation copy.

The seasonal curve owns both local fishery strength and timing. There is no
separate permanent local baseline or annual multiplier. Its yearly peak is the
maximum rating that city/species pairing can reach.

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
values. The seasonal ceiling changes by local date; temperature suitability
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
trout only. The other nine species remain nonnumeric. Continue calibrating the
core city × species timing curves from dated, pier-specific evidence:

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
2. Seasonal curve multiplied by temperature suitability.

Evaluate false excellent days, missed good days, score distribution, source
coverage, stability around curve knots, and target-specific user feedback. Do
not add another variable unless it materially improves held-out results.

## Required implementation invariants

- Perfect temperature returns exactly the configured seasonal rating.
- Any lower temperature suitability returns a score no higher than the seasonal
  rating.
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

1. Complete detailed city × species timing research, prioritizing the strongest
   pilot fisheries and high-change weeks.
2. Create reviewed seasonal opportunity knots and seasonal temperature curves;
   keep unsupported pairings disabled.
3. Connect one declared city water-temperature feed and normalized fixture.
4. Produce replayable hourly and daily owner-review ratings with component
   traces.
5. Render the five-date city experience, species ratings, `X.X/10` labels, source
   time, and winter notice.
6. Review representative annual dates and tune configurations before any public
   enablement.

The engine remains configuration-driven: onboarding another city or species
should add evidence and curves, not another scoring formula.
