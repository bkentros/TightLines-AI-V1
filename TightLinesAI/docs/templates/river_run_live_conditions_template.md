# {{RIVER_NAME}} Live Conditions Audit

**River ID:** `{{RIVER_ID}}` **Created:** {{CREATED_ON}} **Status:**
`research_incomplete`

Read `docs/river_run_live_conditions_onboarding_standard.md` before completing
this audit. Live Conditions is a measurement surface, not a fifth scored
primitive.

## 1. Capability decision

| Metric                     | Candidate source | Accepted source | Live available | Historical available | Public unit/precision    | Decision reason |
| -------------------------- | ---------------- | --------------- | -------------- | -------------------- | ------------------------ | --------------- |
| Discharge                  |                  |                 | no             | no                   | CFS / source-appropriate |                 |
| Gauge height               |                  |                 | no             | no                   | ft / 0.01 when supported |                 |
| Measured water temperature |                  |                 | no             | no                   | °F / 0.1 when supported  |                 |

Do not add turbidity, dissolved oxygen, conductivity, lake level, or another
metric until the app has an explicit public interpretation, stable provider
support, units, freshness behavior, and QA coverage.

## 2. Source verification

For every accepted source record:

- Provider, site ID, series/parameter ID, and public station name.
- Exact physical location and public section.
- Units returned by live and historical endpoints.
- Observation cadence and maximum accepted age.
- Provisional/revised flags.
- First/last usable historical year and meaningful gaps.
- Attribution/license.
- Reach represented and reaches not represented.
- Fallback priority and positive-credit limitations.
- Probe date and captured verification result.
- Returned observation timestamp, numeric sample, null/sentinel behavior, and
  provider timezone.
- Provider-fault behavior and proof that a later valid observation restores the
  metric automatically.
- Latest usable observation resolved independently for every metric.
- Provider `observedAt`, FinFindr `refreshedAt`, and public timestamp/timezone
  presentation.
- Hourly Gauge Read retrieval proof, independent from scored primitive slots.
- Last-readable timestamp retention and numeric-value suppression during a
  multi-day outage.

## 3. Date-average contract

- Comparison target: same calendar date across prior years.
- Required search window: target date ±3 calendar days.
- Current year is excluded.
- Discharge and measured temperature may show a date average when history is
  sufficient.
- Gauge height shows `No average` until datum-consistent historical support is
  explicitly implemented and audited.
- Details disclose record length, window dates, record kind, and gaps.
- Insufficient history returns unavailable; it is never replaced by a broad
  seasonal average.

## 4. Twenty-four-hour trend contract

| Metric            | Prior-read tolerance                    | Stable tolerance | Missing behavior |
| ----------------- | --------------------------------------- | ---------------- | ---------------- |
| Discharge         | Closest accepted observation near 24h   | Engine contract  | Unknown trend    |
| Gauge height      | Closest accepted observation near 24h   | Engine contract  | Unknown trend    |
| Water temperature | Same smoothing contract as current read | Engine contract  | Unknown trend    |

Trend describes the station measurement only. It does not claim migration, fish
movement, clarity, safety, or a whole-river change.

## 5. Public copy lock

- Gauge Read limitation sentence:
- Discharge public station label:
- Temperature public station label:
- Gauge-height public station label:
- Reach explanation:
- No-gauge/partial-data message:
- Configured-source unreadable message:
- Last-readable observation message:
- Public provider labels:
- Attribution text:
- Internal names that must never appear publicly:

## 6. Test matrix

- [ ] All accepted metrics fresh.
- [ ] Partial metric availability.
- [ ] Delayed reading.
- [ ] Older-than-24-hours suppression.
- [ ] Missing reading.
- [ ] Provider malfunction fails closed.
- [ ] `Eqp`/`EQUIP`, null, nonnumeric, and wrong-unit values show Unreadable—not
      zero, Stable, Live, or No Gauge.
- [ ] Last readable provider timestamp remains visible while the stale value is
      suppressed.
- [ ] Observation age appears on the collapsed tile, not only in details.
- [ ] Gauge Read refreshes hourly independently of primitive scoring cadence.
- [ ] Recovered valid numeric reading automatically restores accurate display.
- [ ] Rising/falling/stable or warming/cooling/stable trend.
- [ ] Date average normal/high/low or warmer/colder.
- [ ] Insufficient historical context.
- [ ] Fallback temperature station selected and labeled.
- [ ] Long station names wrap at narrow iOS and Android widths.
- [ ] Source details contain no internal terminology.
- [ ] Limitation describes the actual represented reach.

**Live Conditions decision:** `blocked` **Audit version:** **Owner
acceptance/date:**
