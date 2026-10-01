# PierCast modeled temperature-event detector

**Detector version:** `piercast-temperature-events-v1`

**Scope:** Shared engine, response contract, and PierCast presentation
**Product role:** Year-round, standalone modeled temperature context. It does not alter species scores, city headlines, daily score snapshots, or leaderboard order.

## Output meaning

The detector analyzes the complete continuous hourly surface-temperature timeline returned for a PierCast city. It identifies modeled directional temperature shifts. Temperature alone does not establish the physical cause, so the engine does not label an event as observed upwelling or downwelling and does not return a probability.

Each result is one directional excursion between a meaningful high and low. The 6-, 12-, and 24-hour calculations measure the excursion and classify its severity; they never create independent duplicate events.

## Versioned rules

All temperature-change thresholds are configured in Celsius as exact conversions of the following Fahrenheit product thresholds:

| Severity | Rule |
|---|---|
| Minor | At least 3°F within 24 hours |
| Notable | At least 6°F within 24 hours without reaching major |
| Major | At least 8°F within 12 hours or 10°F within 24 hours |
| Extreme | At least 15°F within 24 hours |

The engine records maximum directional movement within rolling 6-, 12-, and 24-hour windows. An event can satisfy several thresholds but receives one highest severity. When both major rules qualify, the 24-hour rule is retained as the trigger window. The full event still retains its actual peak-to-trough or trough-to-peak duration and magnitude.

## Event boundaries

- A direction begins after a modeled movement reaches 3°F.
- A reversal below 3°F remains part of the existing event.
- A reversal of at least 3°F must remain beyond that threshold for two consecutive forecast samples before it starts an opposite-direction event.
- Six hours without a new extreme closes an event and permits a later same-direction movement to become a separate event.
- An isolated one-hour excursion of at least 3°F is filtered when the immediately adjacent values return to within 1°F of one another.
- Gaps longer than 90 minutes split coverage. The detector never measures across a gap.
- Boundary flags identify an event whose beginning or completion may lie outside the available forecast coverage.

## Integration and presentation

`buildPierCastReviewOutlook` computes one `temperatureEvents` summary beside each city's `temperatureTimeline`. Public city reports preserve it; the conditions-free leaderboard does not expose it. The app contract keeps the field optional so a saved report created before this detector remains readable.

The Water Temperature Shifts section is the detector's single presentation surface. It always lists every detected event—`extreme`, `major`, `notable`, and `minor`—without a display limit. Events are ranked first by severity, then by total modeled temperature-change magnitude, with chronological order breaking any remaining tie. The tracker also distinguishes no-event, unavailable, and partial-coverage states.

Dates and times are rendered in the selected city's timezone. Event titles use the neutral, factual labels “Water temperature drop” and “Water temperature rise”; severity, magnitude, and duration communicate intensity. The UI shows the actual full excursion magnitude and start-to-extreme duration; it does not turn the 6-, 12-, and 24-hour diagnostic windows into separate notices. No banners or probabilities are shown. Only a strong modeled drop is described as a possible lake-flip or upwelling signal, and warming as warmer water returning, without claiming that temperature alone proves the physical cause.
