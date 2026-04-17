# smb-04-appalachian-river-september-fall-feed — Appalachian river • September • fall feed, cool clear water

> **Intent:** Mid-September on the New River (WV/VA) or similar Appalachian smallmouth river. Water cooling into the upper-60s, fish keying on baitfish before the cold-dormant window. Stable pressure, cool mornings, clear water. Guide read: baitfish imitators (jerkbaits, tubes, streamers), moderate pace, moderate presence.

## Setup

| Field | Value |
| --- | --- |
| Species | smallmouth_bass |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | fall_feed_cooling |
| Region | appalachian |
| State | WV |
| Coordinates | 37.65, -80.85 |
| Date | 2026-09-18 (September) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 68°F |
| Daily mean / low / high | 64°F / 52°F / 74°F |
| Prior day mean | 66°F |
| Day minus 2 mean | 68°F |
| Measured water (now/24h/72h) | 67°F / 68°F / 70°F |
| Pressure (now) | 1020.0 mb |
| Pressure trend (48h) | rising (1018.0 → 1018.5 → 1019.0 → 1019.5 → 1020.0) |
| Wind | 5 mph |
| Cloud cover | 35% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.30″ |
| Active precip now | no |
| Sunrise / sunset | 2026-09-18T07:04:00-04:00 / 2026-09-18T19:18:00-04:00 |

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
| column | mid | bottom | mid → bottom → upper |
| pace | medium | slow | medium → slow |
| presence | subtle | moderate | subtle → moderate |

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
  "precipitation_disruption": null,
  "runoff_flow_disruption": "stable"
}
```

### Variables triggered

- `runoff_flow_disruption`

### Daily preference notes

_(none)_

## Seasonal baseline (month 9)

| Field | Value |
| --- | --- |
| source region | appalachian |
| region fallback used | false |
| state-scoped row | false |
| primary forage | crawfish |
| secondary forage | baitfish |
| surface seasonally possible | false |
| monthly allowed columns | upper, mid, bottom |
| monthly column order | mid → bottom → upper |
| monthly allowed paces | slow, medium |
| monthly pace order | medium → slow |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | mid |
| typical seasonal location | shallow_mid |

## Lures



### 1. Tube Jig — `tube_jig`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `tube` |
| primary_column | upper |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.750 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": -0.15,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred mid column. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.

**Automated flags**

_(none)_

### 2. Inline Spinner — `inline_spinner`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `spinner` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.440 |
| tactical_fit | 10.500 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.450 |

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
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears.

**Automated flags**

_(none)_

### 3. Suspending Jerkbait — `suspending_jerkbait`  _(change_up)_

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
| score | 13.250 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight.

**Automated flags**

_(none)_

## Flies



### 1. Crawfish Streamer — `crawfish_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bottom_streamer` |
| primary_column | bottom |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.750 |
| tactical_fit | 10.500 |
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
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred mid column."
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
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root.

**Automated flags**

_(none)_

### 2. Clouser Minnow — `clouser_minnow`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | mid |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.440 |
| tactical_fit | 10.500 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

**Automated flags**

_(none)_

### 3. Zonker Streamer — `zonker_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `bugger_leech` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.750 |
| tactical_fit | 10.500 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred mid column."
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
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (1)
- [trio] lure trio: pick 3 (suspending_jerkbait, score=13.250) has a higher raw score than pick 2 (inline_spinner, score=12.440). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.


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
