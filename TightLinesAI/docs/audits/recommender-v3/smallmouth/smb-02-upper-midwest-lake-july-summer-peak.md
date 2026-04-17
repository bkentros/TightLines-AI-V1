# smb-02-upper-midwest-lake-july-summer-peak — Upper Midwest lake • July • stable summer with crayfish pattern

> **Intent:** Mid-July on a clear northern MN/WI lake. Water 72°F, sun angle high, bass on rocky summer haunts feeding on crayfish and small perch. Stable high pressure, partly cloudy mid-day, light wind. Guide read: bottom-biased crayfish or reaction jerkbait/topwater in low light. Surface is on the table but not dominant at mid-day.

## Setup

| Field | Value |
| --- | --- |
| Species | smallmouth_bass |
| Context | freshwater_lake_pond |
| Water clarity | clear |
| Condition profile | stable_high_pressure_clear |
| Region | great_lakes_upper_midwest |
| State | MN |
| Coordinates | 46.8, -93.95 |
| Date | 2026-07-14 (July) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 81°F |
| Daily mean / low / high | 76°F / 62°F / 85°F |
| Prior day mean | 75°F |
| Day minus 2 mean | 74°F |
| Measured water (now/24h/72h) | 72°F / 72°F / 71°F |
| Pressure (now) | 1019.0 mb |
| Pressure trend (48h) | rising (1018.0 → 1018.3 → 1018.5 → 1018.8 → 1019.0) |
| Wind | 6 mph |
| Cloud cover | 30% |
| Precip 24h / 72h / 7d | 0.00″ / 0.00″ / 0.20″ |
| Active precip now | no |
| Sunrise / sunset | 2026-07-14T05:34:00-05:00 / 2026-07-14T20:58:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | slightly_aggressive |
| reaction_window | watch |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | balanced |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | surface | upper → surface → mid |
| pace | medium | fast | medium → fast |
| presence | subtle | moderate | subtle → moderate → bold |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 0 |
| pace_shift | 0 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "rising_slow",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": "extended_dry",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `precipitation_disruption`

### Daily preference notes

_(none)_

## Seasonal baseline (month 7)

| Field | Value |
| --- | --- |
| source region | great_lakes_upper_midwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | crawfish |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | upper → mid → surface |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | high |
| typical seasonal location | shallow_mid |

## Lures



### 1. Paddle-Tail Swimbait — `paddle_tail_swimbait`  _(best_match)_

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
| score | 14.100 |
| tactical_fit | 12.000 |
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
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
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
    "value": 0.65,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Hair Jig — `hair_jig`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `finesse_subtle` |
| family_group | `hair_jig` |
| primary_column | upper |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.450 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.100 |

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
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Soft Plastic Jerkbait — `soft_jerkbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `soft_jerkbait` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.450 |
| tactical_fit | 12.000 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.250 |

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
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.

**Automated flags**

_(none)_

## Flies



### 1. Mouse Fly — `mouse_fly`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_surface` |
| family_group | `surface_fly` |
| primary_column | surface |
| pace | fast |
| presence | subtle |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.100 |
| tactical_fit | 10.500 |
| practicality_fit | 1.150 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.15,
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

> This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast to structure and retrieve with a steady, slow V-wake strip; vary only slightly in speed and resist the urge to twitch — mice move in straight lines. Keep it on top.

**Automated flags**

_(none)_

### 2. Game Changer — `game_changer`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `articulated_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.950 |
| tactical_fit | 10.500 |
| practicality_fit | 0.000 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.650 |

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
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Popper Fly — `popper_fly`  _(change_up)_

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
| score | 12.150 |
| tactical_fit | 9.000 |
| practicality_fit | 1.150 |
| forage_fit | 1.100 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.750 |

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
    "detail": "Its secondary column overlaps today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred medium pace."
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow. Keep it on top.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: pick 3 (popper_fly, score=12.150) has a higher raw score than pick 2 (game_changer, score=11.950). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.


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
