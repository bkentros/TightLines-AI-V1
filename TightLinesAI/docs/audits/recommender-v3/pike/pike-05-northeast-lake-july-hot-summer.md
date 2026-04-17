# pike-05-northeast-lake-july-hot-summer — Northeast lake • July • hot summer, deep water suspended

> **Intent:** Mid-July on a Northeast lake (Lake George / Oneida). Surface 78°F, pike suspended off deep weed lines and points chasing ciscos. Stable high pressure, warm, light wind. Guide read: trolling-style presentations or big suspending jerkbaits worked over deeper structure. Column should skew mid (not bottom, pike are rarely true bottom). Pace medium, presence moderate-bold.

## Setup

| Field | Value |
| --- | --- |
| Species | pike_musky |
| Context | freshwater_lake_pond |
| Water clarity | clear |
| Condition profile | summer_peak_hot |
| Region | northeast |
| State | NY |
| Coordinates | 43.6, -75.8 |
| Date | 2026-07-28 (July) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 84°F |
| Daily mean / low / high | 80°F / 68°F / 90°F |
| Prior day mean | 79°F |
| Day minus 2 mean | 78°F |
| Measured water (now/24h/72h) | 78°F / 77°F / 76°F |
| Pressure (now) | 1019.0 mb |
| Pressure trend (48h) | rising (1018.0 → 1018.3 → 1018.5 → 1018.8 → 1019.0) |
| Wind | 7 mph |
| Cloud cover | 40% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.30″ |
| Active precip now | no |
| Sunrise / sunset | 2026-07-28T05:45:00-04:00 / 2026-07-28T20:30:00-04:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | slightly_suppressed |
| reaction_window | off |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | balanced |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | mid | surface | mid → surface → upper |
| pace | slow | medium | slow → medium |
| presence | subtle | moderate | subtle → moderate |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | -1 |
| pace_shift | -1 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "heat_limited",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "rising_slow",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": "dry_stable",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `temperature_metabolic_context`
- `precipitation_disruption`

### Daily preference notes

- Heat stress moves fish to cooler, deeper water and narrows the feeding window.

## Seasonal baseline (month 7)

| Field | Value |
| --- | --- |
| source region | northeast |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | bluegill_perch |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | upper → mid → surface |
| monthly allowed paces | slow, medium |
| monthly pace order | medium → slow |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | high |
| typical seasonal location | shallow_mid |

## Lures



### 1. Suspending Jerkbait — `suspending_jerkbait`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `reaction_mid_column` |
| family_group | `jerkbait` |
| primary_column | upper |
| pace | fast |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.580 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.63,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Paddle-Tail Swimbait — `paddle_tail_swimbait`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `swimbait` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.940 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.350 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Walking Topwater — `walking_topwater`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `surface` |
| family_group | `open_topwater` |
| primary_column | surface |
| pace | fast |
| presence | moderate |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 10.140 |
| tactical_fit | 7.500 |
| practicality_fit | 0.700 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.800 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.7,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.49,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with consistent wrist flicks over open water or above grass; keep the cadence smooth and only slow down if you see fish following. Work it with longer pauses.

**Automated flags**

_(none)_

## Flies



### 1. Articulated Pike Streamer — `large_articulated_pike_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.040 |
| tactical_fit | 9.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.59,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Popper Fly — `popper_fly`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_surface` |
| family_group | `surface_fly` |
| primary_column | surface |
| pace | fast |
| presence | moderate |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 10.630 |
| tactical_fit | 7.500 |
| practicality_fit | 1.150 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.850 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.15,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.53,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Work it with longer pauses.

**Automated flags**

_(none)_

### 3. Large Rabbit Strip Streamer — `pike_bunny_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.000 |
| tactical_fit | 9.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | -1.050 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred mid column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.55,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 1.1,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it on medium strips with deliberate pauses; the oversized rabbit profile holds fish attention — give it time to be seen before the next strip. Slow down and lengthen the pause.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: pick 3 (pike_bunny_streamer, score=11.000) has a higher raw score than pick 2 (popper_fly, score=10.630). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.


## Auditor checklist

Work top-to-bottom. Record findings in the "Auditor notes" section below,
citing specific recommendation ids and quoted copy. Tag each finding with
`[BLOCKER]`, `[BUG]`, `[POLISH]`, or `[FYI]`.

- [ ] 1. **Day read** — do posture_band / opportunity_mix / surface_window / daily preference (column/pace/presence) match what a guide would deduce from the environment above?
- [ ] 2. **Primary forage** — does `seasonal_row.primary_forage` make biological sense for species + region + month?
- [ ] 3. **Lure selections** — are the 3 lures reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 4. **Fly selections** — are the 3 flies reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 5. **Per-rec authored dimensions** — do `primary_column`, `pace`, `presence`, `is_surface` match what this lure/fly is known for? Flag any authored ranges that look wrong.
- [ ] 6. **Why-chosen accuracy** — does each `why_chosen` cite drivers that actually match this lure + this day? Flag generic fluff, hallucinated reasons, or claims that contradict the day read.
- [ ] 7. **How-to-fish accuracy** — does each `how_to_fish` describe the CORRECT technique for this archetype, consistent with its column/pace/presence? Flag anything technically wrong.
- [ ] 8. **Trio coherence** — do the 3 lures (and 3 flies) form a sensible diverse-but-compatible set? Any pair that should not coexist given today's gates?
- [ ] 9. **Cross-check auto-flags** — for each auto-flag above, confirm or dismiss with reasoning.

## Auditor notes

_(fill in findings here — be specific, cite ids + quotes, tag severity, recommend fix with file path / function name when possible)_
