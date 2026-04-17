# pike-03-upper-midwest-river-june-early-summer — Upper Midwest river • June • early summer weed-edge window

> **Intent:** Mid-June on a WI/MN pike river. Water 66°F, weeds up, pike on deep weed edges ambushing baitfish. Partly cloudy, moderate wind, stable pressure. Guide read: big spinnerbaits, mid-column reaction baits, weightless jerkbaits, streamer flies — bold presence, medium pace. Surface open.

## Setup

| Field | Value |
| --- | --- |
| Species | pike_musky |
| Context | freshwater_river |
| Water clarity | stained |
| Condition profile | stable_high_pressure_clear |
| Region | great_lakes_upper_midwest |
| State | WI |
| Coordinates | 45.85, -89.65 |
| Date | 2026-06-22 (June) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 74°F |
| Daily mean / low / high | 70°F / 58°F / 80°F |
| Prior day mean | 69°F |
| Day minus 2 mean | 70°F |
| Measured water (now/24h/72h) | 66°F / 66°F / 65°F |
| Pressure (now) | 1017.0 mb |
| Pressure trend (48h) | rising (1016.0 → 1016.3 → 1016.5 → 1016.8 → 1017.0) |
| Wind | 9 mph |
| Cloud cover | 45% |
| Precip 24h / 72h / 7d | 0.00″ / 0.20″ / 0.50″ |
| Active precip now | no |
| Sunrise / sunset | 2026-06-22T05:11:00-05:00 / 2026-06-22T21:05:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | watch |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | surface | upper → surface → mid |
| pace | medium | slow | medium → slow |
| presence | moderate | bold | moderate → bold → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 0 |
| pace_shift | 0 |
| presence_shift | 0 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "rising_slow",
  "wind_condition": "moderate",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "stable"
}
```

### Variables triggered

- `wind_condition`
- `runoff_flow_disruption`

### Daily preference notes

_(none)_

## Seasonal baseline (month 6)

| Field | Value |
| --- | --- |
| source region | great_lakes_upper_midwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | bluegill_perch |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | upper → mid → surface |
| monthly allowed paces | slow, medium |
| monthly pace order | medium → slow |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → bold → subtle |
| typical seasonal water column | high |
| typical seasonal location | shallow |

## Lures



### 1. Spinnerbait — `spinnerbait`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `spinnerbait` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.350 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Walking Topwater — `walking_topwater`  _(strong_alternate)_

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
| score | 13.200 |
| tactical_fit | 10.500 |
| practicality_fit | 1.450 |
| forage_fit | 0.900 |
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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.45,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different surface look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.

**Automated flags**

_(none)_

### 3. Large Jerkbait — `pike_jerkbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_jerkbait` |
| primary_column | upper |
| pace | fast |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.830 |
| tactical_fit | 12.000 |
| practicality_fit | -0.150 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.950 |

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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.73,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it erratically with big pulls and deadstops; the key is the pause after the dash, so hold still for at least two seconds before triggering again. Keep it high in the zone.

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
| score | 13.840 |
| tactical_fit | 12.000 |
| practicality_fit | -0.150 |
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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.73,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Long sweeping strips with full pauses; the articulated body coils on the stop and then springs on the next strip — give it the full beat. Keep it high in the zone.

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
| score | 13.050 |
| tactical_fit | 10.500 |
| practicality_fit | 1.300 |
| forage_fit | 0.900 |
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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.3,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.

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
| score | 13.800 |
| tactical_fit | 12.000 |
| practicality_fit | -0.150 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -1.300 |

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
    "detail": "It leads on today's preferred moderate presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
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
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it on medium strips with deliberate pauses; the oversized rabbit profile holds fish attention — give it time to be seen before the next strip. Keep it high in the zone.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (3)
- [trio] lure trio: pick 3 (pike_jerkbait, score=13.830) has a higher raw score than pick 2 (walking_topwater, score=13.200). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: pick 3 (pike_bunny_streamer, score=13.800) has a higher raw score than pick 2 (popper_fly, score=13.050). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.


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
