# River Run Activity Outlook — Ungauged Foundation v1

## Purpose

The ungauged Activity mode supports rivers with dependable hourly weather but
without an accepted live hydraulic gauge or measured-water-temperature source.
It estimates weather-supported responsiveness only. It does not infer flow,
clarity, water temperature, migration movement, fishability, or catch
probability.

No Betsie species is enabled by this foundation alone. Chinook, Coho, and
Steelhead require separate configuration, replay, copy, and acceptance audits.

## Scoring contract

- `dataMode: weather_only` is explicit and versioned.
- Water-temperature and river-behavior weights must both equal zero.
- Effective light and weather must both carry positive weight and the complete
  weight set must total one.
- Missing river and temperature inputs are intentional, not silently treated as
  neutral observations.
- Results remain `Limited` confidence and cannot exceed the configured true
  weather-only maximum. Missing river inputs do not proportionally shrink the
  score because the score ranks only the variables this model evaluates.
- Copy states that river level, clarity, and measured water temperature are
  unknown.
- Headline, interpretation, and Guide's Read attribute the result only to the
  evaluated weather and require users to verify actual river conditions.
- A weather-only reason code is emitted for audit and UI inspection.

## Four-hour precipitation

Each Activity block uses only the hourly precipitation occurring inside that
same block: 5–9 AM, 9 AM–1 PM, 1–5 PM, or 5–9 PM. Rain from a preceding block
does not receive hydraulic or water-clarity credit because no live river
measurement confirms the response.

Total precipitation and the count of wet hours are evaluated together. Trace or
light sustained rain can add cover; moderate and heavy precipitation provide no
unbounded benefit and eventually reduce the weather component. A wet block
cannot independently create a high-confidence or uncapped outlook.

## Species lifecycle contract

The shared engine can apply the existing continuous Chinook and Coho floor fade,
lifecycle deduction, and ending constraint once their Betsie configurations are
audited. Weather availability is the complete-input requirement in this mode.
Steelhead remains eligible for the same weather-only engine without a conditional
floor, lifecycle deduction, or mortality taper.

Air temperature is excluded. Introducing a modeled water-temperature estimate
would require its own validated source, lag model, uncertainty contract, and
product labeling rather than being folded into this weather-only primitive.
