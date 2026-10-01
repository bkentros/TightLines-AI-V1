# Surge rule replay (piercast-surge-v1) — 2021–2025 buoy seasons

**Question:** does the cold-water surge / warm-water push rule
(`src/engine/signals.js`) fire at a useful rate on real water? It should catch
real upwellings and not go off on sensor noise or small wobbles.

**Data:** NOAA NDBC standard-meteorological history for 41 Great Lakes buoys.
That gives 159 usable station-seasons (May 1 – Nov 15, at least a month of
readings). Readings are averaged to hourly values. Values that can't be real
and single-reading spikes (more than 6 °F off the ±3 h median) are dropped.
Gaps longer than 3 h split a season.

**Reproduce:**

    python3 job/replay/fetch_buoys.py                      # downloads to job/replay/data/
    python3 job/replay/series.py > /tmp/seasons.json
    node job/replay/replay.mjs /tmp/seasons.json > /tmp/replay.json

## Result: the thresholds were kept as they are

| Rule variant | Cold surges / season | Warm pushes / season |
|---|---|---|
| **Current: 10 °F in 24 h (or 8 °F in 12 h), ends ≤ 60 °F, holds 6 h** | **1.0 (all buoys)** | **0.9** |
| Looser: 8 °F / 24 h (or 6 °F / 12 h) | 1.8 | 1.9 |
| Stricter: 12 °F / 24 h (or 10 °F / 12 h) | 0.6 | 0.5 |
| Hold 3 h instead of 6 | 1.6 | 1.3 |
| Hold 12 h instead of 6 | 0.5 | 0.7 |
| Raw 10 °F swings (no end or hold rule), cold only | 2.2 | — |

**Near the piers the current rule fires 2 to 4 times a season. Out in open
water it almost never fires.** That is how upwelling behaves:

| Buoy | Cold surges / season | Warm pushes / season |
|---|---|---|
| 45029 Holland | 3.6 | 3.2 |
| 45161 Muskegon | 2.7 | 1.7 |
| 45026 St. Joseph | 2.6 | 1.6 |
| 45168 South Haven | 2.6 | 2.0 |
| 45187 Winthrop Harbor | 2.4 | 3.0 |
| 45024 Ludington | 2.0 | 3.2 |
| 45013 Milwaukee | 1.2 | 3.6 |
| 45186 Waukegan | 1.2 | 2.6 |
| 45002 / 45007 offshore Lake Michigan | 0.2–0.4 | 0 |
| 45003 / 45008 offshore Lake Huron | 0 | 0 |

**The surges it catches are real ones.** A typical surge drops 12 °F, from
about 63 °F to about 50 °F. It reaches its low in about a day and stays within
3 °F of that low for about 10 hours. Examples:

- Ludington 2023-08-30: 65 → 41 °F
- Ludington 2023-10-07: 66 → 41 °F, held 3 days
- Holland 2021-09-22: 70 → 43 °F

Surges happen all season: 22 in May, 45 in June, 30 in July, 22 in August,
14 in September and 27 in October.

**Why the thresholds stay:**

- **Looser (8 °F) almost doubles the alerts.** Most of the extra ones are
  ordinary daily wobbles, which would make the banner feel like noise.
- **Stricter (12 °F) misses about 40 % of the surges.** Those include 8–11 °F
  drops to the low 50s, which anglers do notice.
- **The 6-hour hold removes pulses that bounce back within a few hours.** Those
  are too short to plan a trip around.
- **The ≤ 60 °F ending keeps the alert about trout and salmon water.**

## Limits

- **This replay uses buoy readings, but the app runs the rule on the NOAA
  forecast model.** The model is smoother than a buoy, so it may call fewer or
  slightly smaller events. Checking the model directly needs an archive of the
  model forecasts (not kept yet). The best way to get one is to save each run's
  pier forecasts and compare them with the buoys after a season.
- **Lake Huron's shore buoys (Saginaw Bay, Alpena area) rarely trigger.** That
  matches the lake, which upwells less along those shores, but it also means
  Huron piers will see this alert less often.
