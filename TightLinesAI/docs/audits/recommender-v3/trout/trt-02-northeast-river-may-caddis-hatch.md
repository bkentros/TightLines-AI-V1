# trt-02-northeast-river-may-caddis-hatch — Northeast river • May • caddis hatch, overcast warm

> **Intent:** Mid-May on a NY Catskills / PA limestone trout river. Water 55°F, caddis and Hendricksons coming off. Overcast, warm, light wind — classic hatch window. Guide read: dry-fly and emerger focus (subtle, slow, upper column), nymphs for non-risers (subtle, slow, mid-bottom). Surface OPEN is key.

## Setup

| Field | Value |
| --- | --- |
| Species | river_trout |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | overcast_windy_warm |
| Region | northeast |
| State | NY |
| Coordinates | 41.95, -74.8 |
| Date | 2026-05-16 (May) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 68°F |
| Daily mean / low / high | 62°F / 50°F / 74°F |
| Prior day mean | 60°F |
| Day minus 2 mean | 58°F |
| Measured water (now/24h/72h) | 55°F / 54°F / 52°F |
| Pressure (now) | 1014.0 mb |
| Pressure trend (48h) | falling (1016.0 → 1015.5 → 1015.0 → 1014.5 → 1014.0) |
| Wind | 6 mph |
| Cloud cover | 80% |
| Precip 24h / 72h / 7d | 0.05″ / 0.20″ / 0.70″ |
| Active precip now | no |
| Sunrise / sunset | 2026-05-16T05:36:00-04:00 / 2026-05-16T20:15:00-04:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | on |
| surface_window | clean |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | surface | upper | surface → upper → mid |
| pace | fast | medium | fast → medium |
| presence | subtle | moderate | subtle → moderate → bold |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | 1 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "falling_slow",
  "wind_condition": "light",
  "light_cloud_condition": "low_light",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "stable"
}
```

### Variables triggered

- `pressure_regime`
- `light_cloud_condition`
- `runoff_flow_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.
- Lower light supports a slightly higher, more open lane.

## Seasonal baseline (month 5)

| Field | Value |
| --- | --- |
| source region | northeast |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | leech_worm |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | upper → mid → surface |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | high |
| typical seasonal location | shallow |

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
| score | 14.330 |
| tactical_fit | 10.500 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
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
    "detail": "Its secondary column overlaps today's preferred surface column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.58,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Fish it with a more active cadence.

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
| score | 13.750 |
| tactical_fit | 10.500 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred surface column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Casting Spoon — `casting_spoon`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `reaction_mid_column` |
| family_group | `spoon` |
| primary_column | mid |
| pace | fast |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.550 |
| tactical_fit | 7.750 |
| practicality_fit | 2.000 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.800 |

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
    "value": 1.25,
    "detail": "It touches today's surface column as a tertiary look rather than a lead."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 2,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.55,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with a wobbly, wandering cadence by mixing speed; bump into cover and let it flutter down beside structure on the pause. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Flies



### 1. Slim Baitfish Streamer — `slim_minnow_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.900 |
| tactical_fit | 9.000 |
| practicality_fit | 1.150 |
| forage_fit | 0.900 |
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
    "detail": "Its secondary column overlaps today's preferred surface column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.5,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Bucktail Streamer — `bucktail_baitfish_streamer`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.400 |
| tactical_fit | 9.000 |
| practicality_fit | 1.150 |
| forage_fit | 0.900 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred surface column."
  },
  {
    "code": "pace_fit",
    "value": 2.5,
    "detail": "Its secondary pace overlaps today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast across or down and retrieve with consistent strips; add a pause every 4-5 strips so the bucktail flares and collapses like a stunned baitfish. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Woolly Bugger — `woolly_bugger`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bugger_leech` |
| primary_column | mid |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 4.900 |
| tactical_fit | 2.750 |
| practicality_fit | 0.450 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.300 |

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
    "value": 1.25,
    "detail": "It touches today's surface column as a tertiary look rather than a lead."
  },
  {
    "code": "pace_fit",
    "value": -2.5,
    "detail": "Its pace profile pulls against today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.45,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
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

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Clear water + low light — a darker profile reads best. _(code: `clear_low_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Keep it moving just enough to stay lively.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (1)
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.


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
