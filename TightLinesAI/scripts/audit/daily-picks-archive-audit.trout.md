# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-12T14:41:51.091Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 57 |
| Expanded recommendation runs | 684 |
| Months | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Regions | 7 |
| Fisheries | 7 |
| Water types | freshwater_river |
| Clarity split | clear:228, stained:228, dirty:228 |
| Goal split | all_purpose:342, big_fish:342 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.trout.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 36 |
| calm_bright_clear_subtle | 32 |
| breezy_windy_stained_reaction | 64 |
| dirty_vibration | 128 |
| cold_slow_or_front | 300 |
| warming_search | 168 |
| heat_limited_finesse | 24 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 192 |
| river_elevated_runoff_current | 324 |
| medium_confidence_archive | 684 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-20 -> 2025-09-21 | changed | 2.5 | 3.7 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> low_light_surface|dirty_vibration|runoff_streamer|current_swing |
| Au Sable / Upper Midwest trout river<br>2025-10-19 -> 2025-10-20 | changed | 3.7 | 0.5 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> dirty_vibration|runoff_streamer|current_swing |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 10 | WIND_NOT_ELEVATING_REACTION (10), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| calm_bright_clear_subtle | 7 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (6), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| calm_low_light_surface | 1 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| cold_slow_or_front | 24 | WIND_NOT_ELEVATING_REACTION (16), BIG_FISH_NOT_FAVORING_UPSIDE (4), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (3), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| dirty_vibration | 18 | WIND_NOT_ELEVATING_REACTION (15), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3), BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| heat_limited_finesse | 6 | BIG_FISH_NOT_FAVORING_UPSIDE (6) |
| medium_confidence_archive | 79 | WIND_NOT_ELEVATING_REACTION (46), BIG_FISH_NOT_FAVORING_UPSIDE (19), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (8), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3) |
| river_elevated_runoff_current | 33 | WIND_NOT_ELEVATING_REACTION (32), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3) |
| stable_pleasant_medium_confidence_archive | 20 | WIND_NOT_ELEVATING_REACTION (10), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), BIG_FISH_NOT_FAVORING_UPSIDE (3), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| warming_search | 29 | WIND_NOT_ELEVATING_REACTION (20), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |

- WIND_NOT_ELEVATING_REACTION: 46
- BIG_FISH_NOT_FAVORING_UPSIDE: 19
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 8
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 8
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 3

- mi_au_sable_trout__2025-03-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Game Changer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Inline Spinner (lure); Sculpzilla (fly); Rabbit-Strip Leech (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Unweighted Baitfish Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Sculpin Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Hair Jig (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Ned Rig (lure); Articulated Dungeon Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__all_purpose__B: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Woolly Bugger (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Conehead Streamer (fly); Zonker Streamer (fly)
- wa_skagit_trout__2025-06-14__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Game Changer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Casting Spoon (lure); Clouser Minnow (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Inline Spinner (lure); Hair Jig (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Zonker Streamer (fly); Baitfish Slider Fly (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-07-12__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Clouser Minnow (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Feather Jig Leech (fly); Clouser Minnow (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Conehead Streamer (fly); Feather Jig Leech (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Small Floating Trout Plug (lure); Feather Jig Leech (fly); Baitfish Slider Fly (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Ned Rig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-08-21__freshwater_river__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-08-21__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Articulated Baitfish Streamer (fly); Slim Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__clear__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Casting Spoon (lure); Small Floating Trout Plug (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Small Floating Trout Plug (lure); Game Changer (fly); Zonker Streamer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Hair Jig (lure); Casting Spoon (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 40
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 36
- SET_B_ID_OVERLAP_AVOIDABLE: 4
- ADJACENT_DAY_EXACT_REPEAT: 3

- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Clouser Minnow (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- ny_upper_delaware_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-12-12__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpin Streamer (fly); Zonker Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Blade Bait (lure); Lead-Eye Leech (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Sculpin Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Suspending Jerkbait (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Articulated Baitfish Streamer (fly); Clouser Minnow (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Baitfish Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Conehead Streamer (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Soft Plastic Jerkbait (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Sculpin Streamer (fly)
- mi_au_sable_trout__2025-05-23__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Casting Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Soft Plastic Jerkbait (lure); Slim Baitfish Streamer (fly); Bucktail Streamer (fly)
- mt_madison_trout__2025-06-07__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Bucktail Streamer (fly); Conehead Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_elk_river_trout__2025-06-17__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Inline Spinner (lure); Bucktail Streamer (fly); Clouser Minnow (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Casting Spoon (lure); Clouser Minnow (fly); Baitfish Slider Fly (fly)
- mi_au_sable_trout__2025-07-16__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mt_madison_trout__2025-08-23__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Suspending Jerkbait (lure); Mouse Fly (fly); Articulated Dungeon Streamer (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Hair Jig (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-09-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Conehead Streamer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Hair Jig (lure); Clouser Minnow (fly); Sculpin Streamer (fly)
- mt_madison_trout__2025-09-27__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Small Floating Trout Plug (lure); Casting Spoon (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mt_madison_trout__2025-09-27__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Small Floating Trout Plug (lure); Mouse Fly (fly); Articulated Baitfish Streamer (fly)
- ar_white_river_trout__2025-09-18__freshwater_river__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Soft Plastic Jerkbait (lure); Ned Rig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-09-18__freshwater_river__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | northeast | cold_slow:1 |
| Jan | south_central | warming:1 |
| Feb | appalachian | cold_slow:1 |
| Feb | great_lakes_upper_midwest | cold_slow:1 |
| Mar | appalachian | cold_slow:1 |
| Mar | great_lakes_upper_midwest | warming:1 |
| Mar | northeast | warming:1 |
| Mar | south_central | cooling_or_shock:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | cooling_or_shock:1 |
| Apr | northeast | cold_slow:1 |
| Apr | northern_california | cold_slow:1 |
| Apr | south_central | stable:1 |
| May | great_lakes_upper_midwest | cold_slow:1 |
| May | mountain_west | cold_slow:1 |
| May | northeast | warming:1 |
| May | northern_california | stable:1 |
| May | pacific_northwest | cold_slow:1 |
| May | south_central | stable:1 |
| Jun | appalachian | stable:1 |
| Jun | mountain_west | cooling_or_shock:1 |
| Jun | northeast | cooling_or_shock:1 |
| Jun | northern_california | cooling_or_shock:1 |
| Jun | pacific_northwest | stable:1 |
| Jun | south_central | stable:1 |
| Jul | great_lakes_upper_midwest | warming:1 |
| Jul | mountain_west | stable:1 |
| Jul | northeast | stable:1 |
| Jul | northern_california | warming:1 |
| Jul | south_central | warming:1 |
| Aug | great_lakes_upper_midwest | stable:1 |
| Aug | mountain_west | cooling_or_shock:1 |
| Aug | northeast | heat_limited:1 |
| Aug | northern_california | stable:1 |
| Aug | pacific_northwest | stable:1 |
| Aug | south_central | stable:1 |
| Sep | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
| Sep | mountain_west | warming:1 |
| Sep | northeast | cooling_or_shock:1 |
| Sep | northern_california | cooling_or_shock:1 |
| Sep | pacific_northwest | stable:1 |
| Sep | south_central | heat_limited:1 |
| Oct | great_lakes_upper_midwest | stable:1, cooling_or_shock:1 |
| Oct | mountain_west | cold_slow:1 |
| Oct | northeast | cooling_or_shock:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | pacific_northwest | cold_slow:1 |
| Oct | south_central | warming:1 |
| Nov | mountain_west | warming:1 |
| Nov | northeast | warming:1 |
| Nov | northern_california | warming:1 |
| Nov | pacific_northwest | stable:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |
| Dec | south_central | warming:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Upper Delaware trout river<br>2025-08-12 clear all_purpose A | 60.1-88.8F | Soft Plastic Jerkbait (medium) |
| Upper Delaware trout river<br>2025-08-12 clear all_purpose B | 60.1-88.8F | Slim Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 clear big_fish A | 60.1-88.8F | Unweighted Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 clear big_fish B | 60.1-88.8F | Articulated Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 stained all_purpose A | 60.1-88.8F | Soft Plastic Jerkbait (medium) |
| Upper Delaware trout river<br>2025-08-12 stained all_purpose B | 60.1-88.8F | Clouser Minnow (medium) |
| Upper Delaware trout river<br>2025-08-12 stained big_fish A | 60.1-88.8F | Game Changer (medium) |
| Upper Delaware trout river<br>2025-08-12 stained big_fish B | 60.1-88.8F | Suspending Jerkbait (medium); Articulated Baitfish Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty all_purpose A | 60.1-88.8F | Bucktail Streamer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty all_purpose B | 60.1-88.8F | Suspending Jerkbait (medium); Game Changer (medium) |
| Upper Delaware trout river<br>2025-08-12 dirty big_fish B | 60.1-88.8F | Inline Spinner (medium); Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear all_purpose A | 67.2-94.5F | Suspending Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear all_purpose B | 67.2-94.5F | Clouser Minnow (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear big_fish A | 67.2-94.5F | Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 clear big_fish B | 67.2-94.5F | Suspending Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained all_purpose A | 67.2-94.5F | Inline Spinner (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained all_purpose B | 67.2-94.5F | Clouser Minnow (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish A | 67.2-94.5F | Game Changer (medium) |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish B | 67.2-94.5F | Soft Plastic Jerkbait (medium) |
| White River Ozark trout tailwater<br>2025-09-18 dirty all_purpose A | 67.2-94.5F | Casting Spoon (medium); Clouser Minnow (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | bright | big_fish | 5 | 56.3-78.6F | 3.1 |
| Aug | mountain_west | open | mixed | big_fish | 6 | 43.3-76.4F | 3.3 |
| Aug | northern_california | open | mixed | big_fish | 6 | 70.7-89.2F | 5.2 |
| Aug | pacific_northwest | open | mixed | big_fish | 5 | 57.1-79.6F | 4.2 |
| Aug | south_central | open | bright | all_purpose | 1 | 71.7-88.4F | 4.9 |
| Aug | south_central | open | bright | big_fish | 5 | 71.7-88.4F | 4.9 |
| Jul | great_lakes_upper_midwest | open | mixed | big_fish | 4 | 67.2-85.6F | 5.5 |
| Jul | mountain_west | caution | mixed | big_fish | 3 | 47.8-73.0F | 6.7 |
| Jul | northeast | open | mixed | all_purpose | 1 | 66.4-85.7F | 5.5 |
| Jul | northeast | open | mixed | big_fish | 5 | 66.4-85.7F | 5.5 |
| Jul | northern_california | open | mixed | all_purpose | 1 | 67.5-93.9F | 5.1 |
| Jul | northern_california | open | mixed | big_fish | 6 | 67.5-93.9F | 5.1 |
| Jul | south_central | open | mixed | all_purpose | 2 | 78.8-96.4F | 4.5 |
| Jul | south_central | open | mixed | big_fish | 6 | 78.8-96.4F | 4.5 |
| Jun | mountain_west | open | mixed | big_fish | 5 | 39.2-65.3F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 3 | 58.2-80.4F | 4.4 |
| Jun | pacific_northwest | open | low_light | all_purpose | 1 | 51.5-63.4F | 3.8 |
| Jun | pacific_northwest | open | low_light | big_fish | 5 | 51.5-63.4F | 3.8 |
| Jun | south_central | open | low_light | big_fish | 3 | 73.6-84.9F | 3.8 |
| May | northern_california | open | glare | big_fish | 5 | 56.1-85.7F | 3.7 |
| May | south_central | open | low_light | all_purpose | 2 | 62.6-80.4F | 6.5 |
| May | south_central | open | low_light | big_fish | 3 | 62.6-80.4F | 6.5 |
| Sep | great_lakes_upper_midwest | open | low_light | all_purpose | 1 | 55.3-73.0F | 6.4 |
| Sep | great_lakes_upper_midwest | open | low_light | big_fish | 4 | 55.3-73.0F | 6.4 |
| Sep | mountain_west | open | glare | big_fish | 5 | 36.3-64.9F | 5 |
| Sep | northeast | open | mixed | all_purpose | 2 | 51.9-74.6F | 3.6 |
| Sep | northeast | open | mixed | big_fish | 6 | 51.9-74.6F | 3.6 |
| Sep | northern_california | caution | glare | big_fish | 2 | 67.6-95.9F | 6.5 |
| Sep | pacific_northwest | open | low_light | big_fish | 5 | 57.8-61.6F | 1.4 |

### Shoulder-Season Topwater Selections

None.

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

None.

### Remaining Same-Side Surface/Surface Examples

None.

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 216 | 216 | 165 |
| fly | 279 | 279 | 245 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 228 | - |
| open-surface rows with 2+ surface picks | 27 | 27 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 10 | 10 |
| lure surface/surface plus fly surface/upper | 0 | 0 |

### Surface/Upper Watch Examples

None.

## Pike Cold/Open Surface Diagnostics

Not applicable.

## Pike Clear/Bright Diagnostics

Not applicable.

## Pike Heat-Limited Diagnostics

Not applicable.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | truly_avoidable | 4 | 0 | 4 |
| exact_id | unavoidable_due_score_band | 45 | 0 | 45 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 5 | 0 | 5 |
| same_family_same_presentation | truly_avoidable | 0 | 40 | 40 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 14 | 14 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 10 | 10 |
| same_family_different_presentation | truly_avoidable | 0 | 36 | 36 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 44 | 44 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 9 | 9 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 1 | 1 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (168); Articulated Dungeon Streamer (164) | Sculpzilla (178); Articulated Baitfish Streamer (148) | Sculpin Streamer (182, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (182, alt edge 26) |
| Elk River Appalachian trout water<br>2025-02-20 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (176); Articulated Dungeon Streamer (172) | Sculpzilla (186); Articulated Baitfish Streamer (156) | Sculpin Streamer (182, alt edge 26) |
| Upper Delaware trout river<br>2025-01-18 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (164); Sculpzilla (178) | Rabbit-Strip Leech (168); Articulated Baitfish Streamer (148) | Jighead Marabou Leech (172, alt edge 24) |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (180); Bucktail Streamer (190) | Clouser Minnow (192); Sculpzilla (168) | Conehead Streamer (190, alt edge 22) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Elk River Appalachian trout water<br>2025-02-20 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Articulated Dungeon Streamer (172) | Rabbit-Strip Leech (176); Articulated Baitfish Streamer (156) | Jighead Marabou Leech (172, alt edge 16) |
| Upper Delaware trout river<br>2025-12-12 dirty all_purpose | fly honorable: same_family_same_presentation | Sculpin Streamer (168); Woolly Bugger (164) | Rabbit-Strip Leech (174); Muddler Minnow (160) | Jighead Marabou Leech (174, alt edge 14) |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish | lure honorable: exact_id | Ned Rig (130); Hair Jig (144) | Soft Plastic Jerkbait (130); Ned Rig (130) | Casting Spoon (140, alt edge 10) |
| Madison River mountain-west trout water<br>2025-09-27 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (160); Sculpzilla (138) | Game Changer (160); Articulated Baitfish Streamer (152) | Mouse Fly (162, alt edge 10) |
| Madison River mountain-west trout water<br>2025-10-05 dirty all_purpose | fly top: same_family_same_presentation | Muddler Minnow (146); Clouser Minnow (162) | Sculpin Streamer (154); Jighead Marabou Leech (154) | Woolly Bugger (164, alt edge 10) |
| Upper Delaware trout river<br>2025-08-12 stained big_fish | lure honorable: exact_id | Ned Rig (130); Hair Jig (144) | Suspending Jerkbait (140); Ned Rig (130) | Casting Spoon (140, alt edge 10) |
| Lower Sacramento northern California trout tailwater<br>2025-11-08 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (180); Articulated Dungeon Streamer (166) | Game Changer (150); Articulated Baitfish Streamer (158) | Feather Jig Leech (166, alt edge 8) |
| Upper Delaware trout river<br>2025-11-08 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (166); Sculpzilla (180) | Game Changer (150); Articulated Baitfish Streamer (158) | Feather Jig Leech (166, alt edge 8) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 dirty | B | 3/4 | Inline Spinner; Blade Bait; Sculpin Streamer; Articulated Baitfish Streamer | Blade Bait; Inline Spinner; Sculpzilla; Articulated Baitfish Streamer |
| White River Ozark trout tailwater<br>2025-03-18 stained | B | 3/4 | Suspending Jerkbait; Soft Plastic Jerkbait; Game Changer; Articulated Baitfish Streamer | Inline Spinner; Soft Plastic Jerkbait; Game Changer; Articulated Baitfish Streamer |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty | A | 4/4 | Casting Spoon; Suspending Jerkbait; Articulated Baitfish Streamer; Game Changer | Suspending Jerkbait; Casting Spoon; Game Changer; Articulated Baitfish Streamer |
| White River Ozark trout tailwater<br>2025-04-12 dirty | B | 3/4 | Inline Spinner; Hair Jig; Game Changer; Articulated Baitfish Streamer | Inline Spinner; Hair Jig; Articulated Baitfish Streamer; Sculpzilla |
| White River Ozark trout tailwater<br>2025-07-28 dirty | B | 3/4 | Soft Plastic Jerkbait; Inline Spinner; Articulated Baitfish Streamer; Game Changer | Soft Plastic Jerkbait; Small Floating Trout Plug; Game Changer; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear B | lure | Inline Spinner; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained B | lure | Inline Spinner; Blade Bait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty B | lure | Blade Bait; Inline Spinner |
| White River Ozark trout tailwater<br>2025-04-12 stained A | lure | Blade Bait; Suspending Jerkbait |
| White River Ozark trout tailwater<br>2025-04-12 stained B | lure | Inline Spinner; Soft Plastic Jerkbait |
| White River Ozark trout tailwater<br>2025-04-12 dirty A | lure | Soft Plastic Jerkbait; Casting Spoon |
| White River Ozark trout tailwater<br>2025-04-12 dirty B | lure | Inline Spinner; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 clear A | lure | Hair Jig; Casting Spoon |
| Au Sable / Upper Midwest trout river<br>2025-04-24 clear B | lure | Suspending Jerkbait; Inline Spinner |
| Au Sable / Upper Midwest trout river<br>2025-04-24 stained A | lure | Blade Bait; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 stained B | lure | Suspending Jerkbait; Soft Plastic Jerkbait |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty A | lure | Suspending Jerkbait; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty B | lure | Blade Bait; Inline Spinner |
| Skagit River Pacific Northwest trout water<br>2025-05-08 stained B | lure | Inline Spinner; Ned Rig |
| Skagit River Pacific Northwest trout water<br>2025-05-08 dirty B | lure | Casting Spoon; Ned Rig |
| Madison River mountain-west trout water<br>2025-07-19 clear B | lure | Hair Jig; Suspending Jerkbait |
| Madison River mountain-west trout water<br>2025-07-19 stained B | lure | Inline Spinner; Soft Plastic Jerkbait |
| Madison River mountain-west trout water<br>2025-07-19 dirty B | lure | Casting Spoon; Inline Spinner |
| Upper Delaware trout river<br>2025-08-12 clear B | lure | Ned Rig; Soft Plastic Jerkbait |
| Upper Delaware trout river<br>2025-08-12 stained B | lure | Suspending Jerkbait; Ned Rig |
| Upper Delaware trout river<br>2025-08-12 dirty B | lure | Inline Spinner; Ned Rig |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 stained B | lure | Inline Spinner; Hair Jig |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 dirty B | lure | Inline Spinner; Casting Spoon |
| White River Ozark trout tailwater<br>2025-09-18 clear B | lure | Suspending Jerkbait; Soft Plastic Jerkbait |
| White River Ozark trout tailwater<br>2025-09-18 stained B | lure | Soft Plastic Jerkbait; Ned Rig |
| White River Ozark trout tailwater<br>2025-09-18 dirty B | lure | Inline Spinner; Ned Rig |
| Upper Delaware trout river<br>2025-10-04 stained A | lure | Suspending Jerkbait; Hair Jig |
| Upper Delaware trout river<br>2025-10-04 stained B | lure | Inline Spinner; Soft Plastic Jerkbait |
| Upper Delaware trout river<br>2025-10-04 dirty A | lure | Hair Jig; Inline Spinner |
| Upper Delaware trout river<br>2025-10-04 dirty B | lure | Suspending Jerkbait; Casting Spoon |
| White River Ozark trout tailwater<br>2025-10-14 stained B | lure | Suspending Jerkbait; Inline Spinner |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Inline Spinner [lure] | 12 | Casting Spoon (5), Small Floating Trout Plug (4), Hair Jig (2), Suspending Jerkbait (1) | 7.3 |
| Ned Rig [lure] | 8 | Hair Jig (5), Suspending Jerkbait (2), Casting Spoon (1) | 15 |
| Blade Bait [lure] | 4 | Casting Spoon (4) | 12.5 |
| Soft Plastic Jerkbait [lure] | 4 | Hair Jig (3), Small Floating Trout Plug (1) | 12.5 |
| Suspending Jerkbait [lure] | 4 | Hair Jig (2), Casting Spoon (1), Small Floating Trout Plug (1) | 4.5 |
| Casting Spoon [lure] | 3 | Small Floating Trout Plug (2), Suspending Jerkbait (1) | 8 |
| Hair Jig [lure] | 3 | Small Floating Trout Plug (2), Casting Spoon (1) | 10.7 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (192; condition_tag:current_swing:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Sculpzilla (168; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16) | Bucktail Streamer (190, alt edge -2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -10) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (182, alt edge 2) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (172, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (184, alt edge 16) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (172, alt edge -4) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (176, alt edge 8) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-03-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (164, alt edge -12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -2) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (166; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (178, alt edge 12) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpin Streamer (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (190, alt edge 10) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (178, alt edge -4) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (174; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (170, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (150; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (156; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (162, alt edge -4) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (158; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (166, alt edge 8) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (154, alt edge -12) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (156; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (150; goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (154, alt edge -2) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (176; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Sculpzilla (170; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 12) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (178; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (184; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (188, alt edge 4) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (184; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Clouser Minnow (194; condition_tag:current_swing:+16, condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Bucktail Streamer (192, alt edge -2) | goal fit likely competed |
| Elk River Appalachian trout water<br>2025-04-04 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (178; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (192; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (180, alt edge -12) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| current_open_water_acceptable | 25 |
| clear_subtle_wind_watch | 18 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear A | warming_search<br>neutral | Hair Jig 186<br>Casting Spoon 174 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-01-16 big_fish clear B | warming_search<br>neutral | Suspending Jerkbait 174<br>Blade Bait 164 |
| clear_subtle_wind_watch | White River Ozark trout tailwater<br>2025-03-18 big_fish clear A | cold_slow_or_front<br>active | Suspending Jerkbait 168<br>Casting Spoon 184 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear A | warming_search<br>active | Suspending Jerkbait 158<br>Blade Bait 164 |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear B | warming_search<br>active | Casting Spoon 174<br>Hair Jig 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Hair Jig 176<br>Suspending Jerkbait 176 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Casting Spoon 174<br>Hair Jig 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-01-16 all_purpose dirty B | dirty_vibration<br>neutral | Inline Spinner 200<br>Blade Bait 170 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-03-18 all_purpose stained B | breezy_windy_stained_reaction<br>active | Suspending Jerkbait 186<br>Soft Plastic Jerkbait 176 |
| current_open_water_acceptable | White River Ozark trout tailwater<br>2025-03-18 big_fish stained B | breezy_windy_stained_reaction<br>active | Inline Spinner 172<br>Soft Plastic Jerkbait 158 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 245 |
| acceptable_fit | 877 |
| strong_fit | 1614 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | medium_confidence_archive | 58 |
| watch | big_fish | B | lure | medium_confidence_archive | 49 |
| watch | big_fish | A | fly | medium_confidence_archive | 47 |
| watch | all_purpose | A | lure | medium_confidence_archive | 32 |
| watch | big_fish | B | fly | cold_slow_or_front | 25 |
| watch | big_fish | A | fly | cold_slow_or_front | 23 |
| watch | big_fish | A | lure | medium_confidence_archive | 22 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 22 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 19 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 18 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 18 |
| watch | all_purpose | A | fly | medium_confidence_archive | 17 |
| watch | big_fish | B | lure | cold_slow_or_front | 17 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 15 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 14 |
| watch | big_fish | A | fly | dirty_vibration | 14 |
| watch | big_fish | B | lure | warming_search | 13 |
| watch | big_fish | A | fly | warming_search | 12 |
| watch | big_fish | B | fly | dirty_vibration | 12 |
| watch | big_fish | B | fly | warming_search | 12 |
| watch | all_purpose | B | lure | medium_confidence_archive | 11 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 11 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 11 |
| watch | all_purpose | A | lure | warming_search | 10 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 10 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 9 |
| watch | all_purpose | B | fly | medium_confidence_archive | 9 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 9 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 8 |
| watch | big_fish | A | lure | cold_slow_or_front | 8 |
| watch | all_purpose | B | fly | cold_slow_or_front | 7 |
| watch | all_purpose | B | lure | cold_slow_or_front | 7 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 7 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 7 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 6 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 6 |
| watch | all_purpose | A | fly | cold_slow_or_front | 5 |
| watch | all_purpose | A | lure | dirty_vibration | 5 |
| watch | big_fish | A | lure | warming_search | 5 |
| watch | big_fish | B | fly | calm_low_light_surface | 5 |
| watch | all_purpose | A | lure | cold_slow_or_front | 4 |
| watch | all_purpose | A | lure | heat_limited_finesse | 4 |
| watch | big_fish | B | lure | heat_limited_finesse | 4 |
| watch | all_purpose | A | fly | warming_search | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 3 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 3 |
| watch | big_fish | A | fly | calm_low_light_surface | 3 |
| watch | big_fish | B | fly | heat_limited_finesse | 3 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 2 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 2 |
| watch | all_purpose | B | lure | dirty_vibration | 2 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 2 |
| watch | all_purpose | B | lure | warming_search | 2 |
| watch | big_fish | A | fly | heat_limited_finesse | 2 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | heat_limited_finesse | 1 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | lure | calm_low_light_surface | 1 |
| watch | big_fish | A | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 1 |
| watch | big_fish | B | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 147 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 136 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 126 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 110 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 108 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 92 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 91 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 67 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 62 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 58 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 51 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 42 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 40 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 40 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 39 |
| acceptable_fit | all_purpose | B | lure | warming_search | 39 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 39 |
| acceptable_fit | big_fish | B | lure | warming_search | 39 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 8 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 11 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Hair Jig (honorable_lure, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose A | Hair Jig (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose B | Soft Plastic Jerkbait (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 768 | 344 | 45% |
| clear_subtle | 528 | 260 | 49% |
| dirty_vibration | 1024 | 0 | 0% |
| heat_finesse | 96 | 16 | 17% |
| cold_slow | 672 | 403 | 60% |
| low_light_surface | 240 | 27 | 11% |
| calm_surface | 816 | 118 | 14% |
| Trout dirty/runoff/current fit | 1456 | 1298 | 89% |
| Big Fish upside | 1368 | 1145 | 84% |
| All Purpose reliable/versatile | 1368 | 1356 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Hair Jig [lure] (274), Suspending Jerkbait [lure] (256), Inline Spinner [lure] (233), Articulated Baitfish Streamer [fly] (202), Casting Spoon [lure] (189), Game Changer [fly] (161), Soft Plastic Jerkbait [lure] (154), Sculpzilla [fly] (143), Articulated Dungeon Streamer [fly] (125), Clouser Minnow [fly] (118), Blade Bait [lure] (104), Small Floating Trout Plug [lure] (98) |
| All-purpose | Inline Spinner [lure] (168), Suspending Jerkbait [lure] (148), Hair Jig [lure] (128), Clouser Minnow [fly] (118), Soft Plastic Jerkbait [lure] (87), Sculpin Streamer [fly] (86), Woolly Bugger [fly] (83), Casting Spoon [lure] (71) |
| Big-fish | Hair Jig [lure] (146), Articulated Baitfish Streamer [fly] (143), Sculpzilla [fly] (142), Game Changer [fly] (128), Articulated Dungeon Streamer [fly] (125), Casting Spoon [lure] (118), Suspending Jerkbait [lure] (108), Small Floating Trout Plug [lure] (87) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 8 | 8 | 0 | 0 | 7 |
| fly | 20 | 19 | 1 | 0 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 274/684 | 40.1% | big_fish:146, all_purpose:128 | A:172, B:102 | top:144, honorable:130 | clear:110, stained:83, dirty:81 | freshwater_river:274 | current_swing:159, runoff_streamer:159, dirty_vibration:111, cold_slow:90 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 256/684 | 37.4% | all_purpose:148, big_fish:108 | B:134, A:122 | top:149, honorable:107 | clear:104, stained:85, dirty:67 | freshwater_river:256 | current_swing:110, runoff_streamer:110, wind_reaction:84, dirty_vibration:82 |
| Inline Spinner<br>inline_spinner | lure | 233/684 | 34.1% | all_purpose:168, big_fish:65 | B:138, A:95 | top:131, honorable:102 | stained:88, dirty:86, clear:59 | freshwater_river:233 | current_swing:125, runoff_streamer:125, dirty_vibration:108, wind_reaction:75 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/684 | 29.5% | big_fish:143, all_purpose:59 | B:120, A:82 | top:114, honorable:88 | dirty:82, stained:72, clear:48 | freshwater_river:202 | current_swing:100, runoff_streamer:100, dirty_vibration:86, calm_surface:67 |
| Casting Spoon<br>casting_spoon | lure | 189/684 | 27.6% | big_fish:118, all_purpose:71 | B:97, A:92 | honorable:114, top:75 | dirty:82, stained:67, clear:40 | freshwater_river:189 | current_swing:104, runoff_streamer:104, dirty_vibration:97, wind_reaction:81 |
| Game Changer<br>game_changer | fly | 161/684 | 23.5% | big_fish:128, all_purpose:33 | B:90, A:71 | honorable:82, top:79 | dirty:63, clear:55, stained:43 | freshwater_river:161 | calm_surface:57, current_swing:43, runoff_streamer:43, wind_reaction:40 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 154/528 | 29.2% | all_purpose:87, big_fish:67 | B:83, A:71 | honorable:88, top:66 | clear:69, stained:45, dirty:40 | freshwater_river:154 | calm_surface:65, clear_subtle:55, current_swing:47, runoff_streamer:47 |
| Sculpzilla<br>sculpzilla | fly | 143/684 | 20.9% | big_fish:142, all_purpose:1 | A:92, B:51 | honorable:97, top:46 | dirty:52, clear:46, stained:45 | freshwater_river:143 | current_swing:79, runoff_streamer:79, dirty_vibration:57, calm_surface:41 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 125/552 | 22.6% | big_fish:125 | A:64, B:61 | top:76, honorable:49 | stained:45, clear:40, dirty:40 | freshwater_river:125 | current_swing:69, runoff_streamer:69, dirty_vibration:53, cold_slow:39 |
| Clouser Minnow<br>clouser_minnow | fly | 118/684 | 17.3% | all_purpose:118 | B:79, A:39 | top:66, honorable:52 | stained:44, clear:42, dirty:32 | freshwater_river:118 | current_swing:54, runoff_streamer:54, calm_surface:43, dirty_vibration:38 |
| Blade Bait<br>blade_bait | lure | 104/324 | 32.1% | big_fish:63, all_purpose:41 | B:58, A:46 | honorable:66, top:38 | dirty:41, stained:34, clear:29 | freshwater_river:104 | current_swing:66, runoff_streamer:66, dirty_vibration:57, cold_slow:52 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 98/288 | 34% | big_fish:87, all_purpose:11 | A:62, B:36 | top:61, honorable:37 | stained:38, dirty:36, clear:24 | freshwater_river:98 | calm_surface:84, current_swing:24, runoff_streamer:24, low_light_surface:21 |
| Sculpin Streamer<br>sculpin_streamer | fly | 89/684 | 13% | all_purpose:86, big_fish:3 | A:63, B:26 | top:53, honorable:36 | clear:33, dirty:31, stained:25 | freshwater_river:89 | current_swing:66, runoff_streamer:66, dirty_vibration:45, cold_slow:38 |
| Woolly Bugger<br>woolly_bugger | fly | 83/684 | 12.1% | all_purpose:83 | B:47, A:36 | honorable:63, top:20 | stained:31, clear:30, dirty:22 | freshwater_river:83 | current_swing:41, runoff_streamer:41, cold_slow:35, dirty_vibration:30 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 73/684 | 10.7% | big_fish:66, all_purpose:7 | B:43, A:30 | honorable:52, top:21 | dirty:30, stained:28, clear:15 | freshwater_river:73 | cold_slow:35, current_swing:29, dirty_vibration:29, runoff_streamer:29 |
| Ned Rig<br>ned_rig | lure | 60/684 | 8.8% | all_purpose:30, big_fish:30 | B:36, A:24 | honorable:40, top:20 | dirty:23, clear:21, stained:16 | freshwater_river:60 | cold_slow:27, heat_finesse:16, current_swing:13, runoff_streamer:13 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 57/684 | 8.3% | all_purpose:48, big_fish:9 | A:32, B:25 | top:36, honorable:21 | dirty:22, stained:19, clear:16 | freshwater_river:57 | current_swing:32, runoff_streamer:32, open_water_search:30, wind_reaction:30 |
| Conehead Streamer<br>conehead_streamer | fly | 56/684 | 8.2% | all_purpose:45, big_fish:11 | A:38, B:18 | top:34, honorable:22 | stained:26, dirty:16, clear:14 | freshwater_river:56 | open_water_search:40, wind_reaction:40, current_swing:38, runoff_streamer:38 |
| Zonker Streamer<br>zonker_streamer | fly | 56/684 | 8.2% | all_purpose:49, big_fish:7 | A:41, B:15 | top:38, honorable:18 | stained:27, clear:15, dirty:14 | freshwater_river:56 | current_swing:34, runoff_streamer:34, open_water_search:31, wind_reaction:31 |
| Mouse Fly<br>mouse_fly | fly | 37/192 | 19.3% | big_fish:37 | A:23, B:14 | top:20, honorable:17 | stained:13, clear:12, dirty:12 | freshwater_river:37 | calm_surface:34, current_swing:12, runoff_streamer:12, warming_search:11 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 32/528 | 6.1% | all_purpose:30, big_fish:2 | B:22, A:10 | honorable:17, top:15 | clear:27, dirty:5 | freshwater_river:32 | clear_subtle:24, calm_surface:15, current_swing:11, runoff_streamer:11 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 30/684 | 4.4% | all_purpose:29, big_fish:1 | A:17, B:13 | honorable:19, top:11 | clear:11, stained:10, dirty:9 | freshwater_river:30 | cold_slow:22, current_swing:17, runoff_streamer:17, dirty_vibration:13 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 28/684 | 4.1% | all_purpose:28 | A:18, B:10 | top:19, honorable:9 | clear:22, dirty:3, stained:3 | freshwater_river:28 | clear_subtle:20, calm_surface:10, cold_slow:10, warming_search:5 |
| Muddler Minnow<br>muddler_sculpin | fly | 27/684 | 3.9% | all_purpose:25, big_fish:2 | B:22, A:5 | honorable:15, top:12 | clear:10, stained:10, dirty:7 | freshwater_river:27 | cold_slow:21, current_swing:9, dirty_vibration:9, runoff_streamer:9 |
| Feather Jig Leech<br>feather_jig_leech | fly | 23/684 | 3.4% | all_purpose:23 | B:12, A:11 | top:13, honorable:10 | stained:11, dirty:9, clear:3 | freshwater_river:23 | warming_search:19, current_swing:10, runoff_streamer:10, calm_surface:9 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 15/528 | 2.8% | big_fish:8, all_purpose:7 | A:9, B:6 | top:8, honorable:7 | clear:14, stained:1 | freshwater_river:15 | clear_subtle:14, calm_surface:9, warming_search:3, open_water_search:2 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 13/312 | 4.2% | all_purpose:13 | B:10, A:3 | honorable:10, top:3 | dirty:7, clear:3, stained:3 | freshwater_river:13 | calm_surface:9, warming_search:5, open_water_search:3, wind_reaction:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/84 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 274/2736 (10%) | 144/1368 (10.5%) | 130/1368 (9.5%) | 274/1368 (20%) | - | lure side actual >20% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 256/2736 (9.4%) | 149/1368 (10.9%) | 107/1368 (7.8%) | 256/1368 (18.7%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 233/2736 (8.5%) | 131/1368 (9.6%) | 102/1368 (7.5%) | 233/1368 (17%) | - |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/2736 (7.4%) | 114/1368 (8.3%) | 88/1368 (6.4%) | - | 202/1368 (14.8%) |  |
| Casting Spoon<br>casting_spoon | lure | 189/2736 (6.9%) | 75/1368 (5.5%) | 114/1368 (8.3%) | 189/1368 (13.8%) | - |  |
| Game Changer<br>game_changer | fly | 161/2736 (5.9%) | 79/1368 (5.8%) | 82/1368 (6%) | - | 161/1368 (11.8%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 154/2736 (5.6%) | 66/1368 (4.8%) | 88/1368 (6.4%) | 154/1368 (11.3%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 143/2736 (5.2%) | 46/1368 (3.4%) | 97/1368 (7.1%) | - | 143/1368 (10.5%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 125/2736 (4.6%) | 76/1368 (5.6%) | 49/1368 (3.6%) | - | 125/1368 (9.1%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 118/2736 (4.3%) | 66/1368 (4.8%) | 52/1368 (3.8%) | - | 118/1368 (8.6%) |  |
| Blade Bait<br>blade_bait | lure | 104/2736 (3.8%) | 38/1368 (2.8%) | 66/1368 (4.8%) | 104/1368 (7.6%) | - |  |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 98/2736 (3.6%) | 61/1368 (4.5%) | 37/1368 (2.7%) | 98/1368 (7.2%) | - |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 89/2736 (3.3%) | 53/1368 (3.9%) | 36/1368 (2.6%) | - | 89/1368 (6.5%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 83/2736 (3%) | 20/1368 (1.5%) | 63/1368 (4.6%) | - | 83/1368 (6.1%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 73/2736 (2.7%) | 21/1368 (1.5%) | 52/1368 (3.8%) | - | 73/1368 (5.3%) |  |
| Ned Rig<br>ned_rig | lure | 60/2736 (2.2%) | 20/1368 (1.5%) | 40/1368 (2.9%) | 60/1368 (4.4%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 57/2736 (2.1%) | 36/1368 (2.6%) | 21/1368 (1.5%) | - | 57/1368 (4.2%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 56/2736 (2%) | 34/1368 (2.5%) | 22/1368 (1.6%) | - | 56/1368 (4.1%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 56/2736 (2%) | 38/1368 (2.8%) | 18/1368 (1.3%) | - | 56/1368 (4.1%) |  |
| Mouse Fly<br>mouse_fly | fly | 37/2736 (1.4%) | 20/1368 (1.5%) | 17/1368 (1.2%) | - | 37/1368 (2.7%) |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 32/2736 (1.2%) | 15/1368 (1.1%) | 17/1368 (1.2%) | - | 32/1368 (2.3%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 30/2736 (1.1%) | 11/1368 (0.8%) | 19/1368 (1.4%) | - | 30/1368 (2.2%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 28/2736 (1%) | 19/1368 (1.4%) | 9/1368 (0.7%) | - | 28/1368 (2%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 27/2736 (1%) | 12/1368 (0.9%) | 15/1368 (1.1%) | - | 27/1368 (2%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 23/2736 (0.8%) | 13/1368 (1%) | 10/1368 (0.7%) | - | 23/1368 (1.7%) |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 15/2736 (0.5%) | 8/1368 (0.6%) | 7/1368 (0.5%) | - | 15/1368 (1.1%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 13/2736 (0.5%) | 3/1368 (0.2%) | 10/1368 (0.7%) | - | 13/1368 (1%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/2736 (0%) | 0/1368 (0%) | 0/1368 (0%) | - | 0/1368 (0%) |  |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Crawfish Streamer<br>crawfish_streamer | fly | 84 | all_purpose / clear / freshwater_river / cold_slow_or_front:10, all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / dirty / freshwater_river / dirty_vibration:10 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):7, Jighead Marabou Leech (top), Sculpin Streamer (honorable):5, Muddler Minnow (top), Woolly Bugger (honorable):5 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 274/684 | 40.1% | big_fish:146, all_purpose:128 | current_swing:159, runoff_streamer:159, dirty_vibration:111, cold_slow:90, clear_subtle:70 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 256/684 | 37.4% | all_purpose:148, big_fish:108 | current_swing:110, runoff_streamer:110, wind_reaction:84, dirty_vibration:82, calm_surface:73 |
| Inline Spinner<br>inline_spinner | lure | 233/684 | 34.1% | all_purpose:168, big_fish:65 | current_swing:125, runoff_streamer:125, dirty_vibration:108, wind_reaction:75, open_water_search:69 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 98/288 | 34% | big_fish:87, all_purpose:11 | calm_surface:84, current_swing:24, runoff_streamer:24, low_light_surface:21, warming_search:21 |
| Blade Bait<br>blade_bait | lure | 104/324 | 32.1% | big_fish:63, all_purpose:41 | current_swing:66, runoff_streamer:66, dirty_vibration:57, cold_slow:52, warming_search:41 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/684 | 29.5% | big_fish:143, all_purpose:59 | current_swing:100, runoff_streamer:100, dirty_vibration:86, calm_surface:67, wind_reaction:60 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 154/528 | 29.2% | all_purpose:87, big_fish:67 | calm_surface:65, clear_subtle:55, current_swing:47, runoff_streamer:47, warming_search:34 |
| Casting Spoon<br>casting_spoon | lure | 189/684 | 27.6% | big_fish:118, all_purpose:71 | current_swing:104, runoff_streamer:104, dirty_vibration:97, wind_reaction:81, open_water_search:69 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | home-window >30% severe | 238/508 | 46.9% | goal_tags:123 | AP/BF 109/254, 129/254<br>clarity clear:212, stained:160, dirty:136<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | home-window >30% severe | 83/204 | 40.7% | goal_tags:93 | AP/BF 9/102, 74/102<br>clarity clear:68, dirty:68, stained:68<br>bucket stable_pleasant_medium_confidence_archive:56, cold_slow_or_front:44, warming_search:40 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >30% severe | 162/456 | 35.5% | daily_condition_tags:148 | AP/BF 94/228, 68/228<br>clarity clear:152, dirty:152, stained:152<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 |
| Inline Spinner<br>inline_spinner | lure | home-window >30% severe | 161/456 | 35.3% | goal_tags:121 | AP/BF 117/228, 44/228<br>clarity clear:152, dirty:152, stained:152<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 |
| Casting Spoon<br>casting_spoon | lure | home-window >30% severe | 151/456 | 33.1% | goal_tags:204 | AP/BF 50/228, 101/228<br>clarity clear:152, dirty:152, stained:152<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 |
| Blade Bait<br>blade_bait | lure | home-window >30% severe | 84/256 | 32.8% | goal_tags:64 | AP/BF 32/128, 52/128<br>clarity clear:96, stained:84, dirty:76<br>bucket cold_slow_or_front:100, dirty_vibration:68, breezy_windy_stained_reaction:36 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >30% severe | 150/492 | 30.5% | goal_tags:187 | AP/BF 38/228, 112/264<br>clarity clear:164, dirty:164, stained:164<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | home-window >25% overdominant | 81/300 | 27% | daily_condition_tags:133 | AP/BF 40/150, 41/150<br>clarity clear:100, dirty:100, stained:100<br>bucket dirty_vibration:76, cold_slow_or_front:60, warming_search:60 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >20% watch | 108/444 | 24.3% | goal_tags:204 | AP/BF 0/204, 108/240<br>clarity clear:148, dirty:148, stained:148<br>bucket dirty_vibration:112, cold_slow_or_front:110, warming_search:80 |
| Mouse Fly<br>mouse_fly | fly | home-window >20% watch | 37/156 | 23.7% | goal_tags:78 | AP/BF 0/78, 37/78<br>clarity clear:52, dirty:52, stained:52<br>bucket stable_pleasant_medium_confidence_archive:56, warming_search:40, cold_slow_or_front:24 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 114/492 | 23.2% | goal_tags:278 | AP/BF 1/228, 113/264<br>clarity clear:164, dirty:164, stained:164<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 |
| Game Changer<br>game_changer | fly | home-window >20% watch | 99/492 | 20.1% | goal_tags:189 | AP/BF 10/228, 89/264<br>clarity clear:164, dirty:164, stained:164<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 274/2736 (10%) | 144/1368 (10.5%) | 130/1368 (9.5%) | 274/1368 (20%) | 238/508 (46.9%) | 133/508 (26.2%) / 105/508 (20.7%) | lure side actual>20%<br>home>20%<br>home>25%<br>home>30% |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 98/2736 (3.6%) | 61/1368 (4.5%) | 37/1368 (2.7%) | 98/1368 (7.2%) | 83/204 (40.7%) | 55/204 (27%) / 28/204 (13.7%) | home>20%<br>home>25%<br>home>30% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 256/2736 (9.4%) | 149/1368 (10.9%) | 107/1368 (7.8%) | 256/1368 (18.7%) | 162/456 (35.5%) | 88/456 (19.3%) / 74/456 (16.2%) | home>20%<br>home>25%<br>home>30% |
| Inline Spinner<br>inline_spinner | lure | 233/2736 (8.5%) | 131/1368 (9.6%) | 102/1368 (7.5%) | 233/1368 (17%) | 161/456 (35.3%) | 100/456 (21.9%) / 61/456 (13.4%) | home>20%<br>home>25%<br>home>30% |
| Casting Spoon<br>casting_spoon | lure | 189/2736 (6.9%) | 75/1368 (5.5%) | 114/1368 (8.3%) | 189/1368 (13.8%) | 151/456 (33.1%) | 64/456 (14%) / 87/456 (19.1%) | home>20%<br>home>25%<br>home>30% |
| Blade Bait<br>blade_bait | lure | 104/2736 (3.8%) | 38/1368 (2.8%) | 66/1368 (4.8%) | 104/1368 (7.6%) | 84/256 (32.8%) | 31/256 (12.1%) / 53/256 (20.7%) | home>20%<br>home>25%<br>home>30% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/2736 (7.4%) | 114/1368 (8.3%) | 88/1368 (6.4%) | 202/1368 (14.8%) | 150/492 (30.5%) | 82/492 (16.7%) / 68/492 (13.8%) | home>20%<br>home>25%<br>home>30% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 154/2736 (5.6%) | 66/1368 (4.8%) | 88/1368 (6.4%) | 154/1368 (11.3%) | 81/300 (27%) | 31/300 (10.3%) / 50/300 (16.7%) | home>20%<br>home>25% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 125/2736 (4.6%) | 76/1368 (5.6%) | 49/1368 (3.6%) | 125/1368 (9.1%) | 108/444 (24.3%) | 60/444 (13.5%) / 48/444 (10.8%) | home>20% |
| Mouse Fly<br>mouse_fly | fly | 37/2736 (1.4%) | 20/1368 (1.5%) | 17/1368 (1.2%) | 37/1368 (2.7%) | 37/156 (23.7%) | 20/156 (12.8%) / 17/156 (10.9%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 143/2736 (5.2%) | 46/1368 (3.4%) | 97/1368 (7.1%) | 143/1368 (10.5%) | 114/492 (23.2%) | 41/492 (8.3%) / 73/492 (14.8%) | home>20% |
| Game Changer<br>game_changer | fly | 161/2736 (5.9%) | 79/1368 (5.8%) | 82/1368 (6%) | 161/1368 (11.8%) | 99/492 (20.1%) | 40/492 (8.1%) / 59/492 (12%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.60.
Average expanded finalist pool size: 3.31.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1027.
Rows/slots with expanded finalist pool size 1: 637.
Selected-tier singleton slots expanded above 1: 390.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 3.08 | 4.19 | 1 | 1 | 214 | 115 |
| fly/top | 3.16 | 4.02 | 1 | 1 | 182 | 97 |
| lure/honorable | 2.10 | 2.68 | 1 | 1 | 305 | 188 |
| lure/top | 2.04 | 2.34 | 1 | 1 | 326 | 237 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1623 |
| goal_or_priority_condition | 990 |
| credible_fallback | 123 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1677 |
| goal_and_priority_condition | 1623 |
| credible_fallback | 220 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 304 |
| family_diversity_scarcity | 276 |
| surface_safety_scarcity | 57 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B fly/top: sculpin_streamer (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__A lure/top: inline_spinner (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B fly/top: jighead_marabou_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B lure/honorable: inline_spinner (goal_or_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: muddler_sculpin (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: hair_jig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B lure/top: ned_rig (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/top: jighead_marabou_leech (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.46 |
| Different-presentation close candidates | 1.19 |
| Different-family close candidates | 1.83 |
| Final expanded Set B pool | 2.04 |
| Same-family/same-presentation reintroduced | 154/1368 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 256 |
| Coverage pool used | 40 |
| Average used coverage pool size | 1.88 |
| Singleton used coverage pools | 12 |
| Broad pool larger than narrowed pool | 13 |
| Broad pool same as narrowed pool | 27 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 216 |
| broad | 40 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| inline_spinner | 32 |
| suspending_jerkbait | 22 |
| casting_spoon | 21 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| casting_spoon | 15 |
| suspending_jerkbait | 15 |
| inline_spinner | 8 |
| blade_bait | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1584 | 0 | 0 |
| caution | 240 | 5 | 5 |

Caution-gate selected surface examples:
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A: honorable_lure:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A: honorable_lure:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__A: honorable_lure:small_floating_trout_plug
- ca_lower_sac_trout__2025-09-15__freshwater_river__stained__big_fish__A: honorable_lure:small_floating_trout_plug
- ca_lower_sac_trout__2025-09-15__freshwater_river__dirty__big_fish__A: honorable_lure:small_floating_trout_plug

Caution-gate surface finalist examples:
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A lure/honorable: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A lure/honorable: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__A lure/honorable: small_floating_trout_plug
- ca_lower_sac_trout__2025-09-15__freshwater_river__stained__big_fish__A lure/honorable: small_floating_trout_plug
- ca_lower_sac_trout__2025-09-15__freshwater_river__dirty__big_fish__A lure/honorable: small_floating_trout_plug

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | trout | trout_plug | trout_surface_plug | surface<br>medium/slow | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_river | true | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: current_swing, clear_subtle | 1: reliable_action | freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Fly<br>mouse_fly | fly | largemouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 202/684 | 150/492 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 125/552 | 108/444 | goal_tags>1<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 13/312 | 8/156 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 118/684 | 69/456 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/84 | 0/60 | clear+stained+dirty clarity |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 23/684 | 21/568 | clear+stained+dirty clarity |
| Game Changer<br>game_changer | fly | 7 | 161/684 | 99/492 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 30/684 | 26/508 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 28/684 | 27/508 | clear+stained+dirty clarity |
| Mouse Fly<br>mouse_fly | fly | 7 | 37/192 | 37/156 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 73/684 | 61/568 | goal_tags>1<br>reliable_action+big_fish_upside |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 89/684 | 82/508 | clear+stained+dirty clarity |
| Sculpzilla<br>sculpzilla | fly | 7 | 143/684 | 114/492 | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 83/684 | 71/568 | clear+stained+dirty clarity |
| Blade Bait<br>blade_bait | lure | 7 | 104/324 | 84/256 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 6 | 189/684 | 151/456 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 8 | 274/684 | 238/508 | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 8 | 233/684 | 161/456 | goal_tags>1<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 9 | 60/684 | 48/508 | clear+stained+dirty clarity |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 98/288 | 83/204 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 154/528 | 81/300 | goal_tags>1<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 256/684 | 162/456 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 8 | 274/684 (40.1%) | 238/508 (46.9%) | big_fish:146, all_purpose:128 | top:144, honorable:130 | current_swing:159, runoff_streamer:159, dirty_vibration:111, cold_slow:90, clear_subtle:70 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 256/684 (37.4%) | 162/456 (35.5%) | all_purpose:148, big_fish:108 | top:149, honorable:107 | current_swing:110, runoff_streamer:110, wind_reaction:84, dirty_vibration:82, calm_surface:73 |
| Inline Spinner<br>inline_spinner | lure | 8 | 233/684 (34.1%) | 161/456 (35.3%) | all_purpose:168, big_fish:65 | top:131, honorable:102 | current_swing:125, runoff_streamer:125, dirty_vibration:108, wind_reaction:75, open_water_search:69 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 202/684 (29.5%) | 150/492 (30.5%) | big_fish:143, all_purpose:59 | top:114, honorable:88 | current_swing:100, runoff_streamer:100, dirty_vibration:86, calm_surface:67, wind_reaction:60 |
| Casting Spoon<br>casting_spoon | lure | 6 | 189/684 (27.6%) | 151/456 (33.1%) | big_fish:118, all_purpose:71 | honorable:114, top:75 | current_swing:104, runoff_streamer:104, dirty_vibration:97, wind_reaction:81, open_water_search:69 |
| Game Changer<br>game_changer | fly | 7 | 161/684 (23.5%) | 99/492 (20.1%) | big_fish:128, all_purpose:33 | honorable:82, top:79 | calm_surface:57, current_swing:43, runoff_streamer:43, wind_reaction:40, dirty_vibration:36 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 154/528 (29.2%) | 81/300 (27%) | all_purpose:87, big_fish:67 | honorable:88, top:66 | calm_surface:65, clear_subtle:55, current_swing:47, runoff_streamer:47, warming_search:34 |
| Sculpzilla<br>sculpzilla | fly | 7 | 143/684 (20.9%) | 114/492 (23.2%) | big_fish:142, all_purpose:1 | honorable:97, top:46 | current_swing:79, runoff_streamer:79, dirty_vibration:57, calm_surface:41, warming_search:41 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 125/552 (22.6%) | 108/444 (24.3%) | big_fish:125 | top:76, honorable:49 | current_swing:69, runoff_streamer:69, dirty_vibration:53, cold_slow:39, wind_reaction:39 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 118/684 (17.3%) | 69/456 (15.1%) | all_purpose:118 | top:66, honorable:52 | current_swing:54, runoff_streamer:54, calm_surface:43, dirty_vibration:38, warming_search:31 |
| Blade Bait<br>blade_bait | lure | 7 | 104/324 (32.1%) | 84/256 (32.8%) | big_fish:63, all_purpose:41 | honorable:66, top:38 | current_swing:66, runoff_streamer:66, dirty_vibration:57, cold_slow:52, warming_search:41 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 98/288 (34%) | 83/204 (40.7%) | big_fish:87, all_purpose:11 | top:61, honorable:37 | calm_surface:84, current_swing:24, runoff_streamer:24, low_light_surface:21, warming_search:21 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 89/684 (13%) | 82/508 (16.1%) | all_purpose:86, big_fish:3 | top:53, honorable:36 | current_swing:66, runoff_streamer:66, dirty_vibration:45, cold_slow:38, wind_reaction:27 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 83/684 (12.1%) | 71/568 (12.5%) | all_purpose:83 | honorable:63, top:20 | current_swing:41, runoff_streamer:41, cold_slow:35, dirty_vibration:30, calm_surface:29 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 73/684 (10.7%) | 61/568 (10.7%) | big_fish:66, all_purpose:7 | honorable:52, top:21 | cold_slow:35, current_swing:29, dirty_vibration:29, runoff_streamer:29, warming_search:15 |
| Ned Rig<br>ned_rig | lure | 9 | 60/684 (8.8%) | 48/508 (9.4%) | all_purpose:30, big_fish:30 | honorable:40, top:20 | cold_slow:27, heat_finesse:16, current_swing:13, runoff_streamer:13, clear_subtle:12 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 57/684 (8.3%) | 44/456 (9.6%) | all_purpose:48, big_fish:9 | top:36, honorable:21 | current_swing:32, runoff_streamer:32, open_water_search:30, wind_reaction:30, dirty_vibration:28 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 56/684 (8.2%) | 51/492 (10.4%) | all_purpose:45, big_fish:11 | top:34, honorable:22 | open_water_search:40, wind_reaction:40, current_swing:38, runoff_streamer:38, dirty_vibration:34 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 56/684 (8.2%) | 45/492 (9.1%) | all_purpose:49, big_fish:7 | top:38, honorable:18 | current_swing:34, runoff_streamer:34, open_water_search:31, wind_reaction:31, dirty_vibration:30 |
| Mouse Fly<br>mouse_fly | fly | 7 | 37/192 (19.3%) | 37/156 (23.7%) | big_fish:37 | top:20, honorable:17 | calm_surface:34, current_swing:12, runoff_streamer:12, warming_search:11, clear_subtle:10 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 32/528 (6.1%) | 15/300 (5%) | all_purpose:30, big_fish:2 | honorable:17, top:15 | clear_subtle:24, calm_surface:15, current_swing:11, runoff_streamer:11, low_light_surface:6 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 30/684 (4.4%) | 26/508 (5.1%) | all_purpose:29, big_fish:1 | honorable:19, top:11 | cold_slow:22, current_swing:17, runoff_streamer:17, dirty_vibration:13, wind_reaction:8 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 28/684 (4.1%) | 27/508 (5.3%) | all_purpose:28 | top:19, honorable:9 | clear_subtle:20, calm_surface:10, cold_slow:10, warming_search:5, wind_reaction:5 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 27/684 (3.9%) | 24/508 (4.7%) | all_purpose:25, big_fish:2 | honorable:15, top:12 | cold_slow:21, current_swing:9, dirty_vibration:9, runoff_streamer:9, wind_reaction:9 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 23/684 (3.4%) | 21/568 (3.7%) | all_purpose:23 | top:13, honorable:10 | warming_search:19, current_swing:10, runoff_streamer:10, calm_surface:9, dirty_vibration:9 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 15/528 (2.8%) | 5/300 (1.7%) | big_fish:8, all_purpose:7 | top:8, honorable:7 | clear_subtle:14, calm_surface:9, warming_search:3, open_water_search:2, wind_reaction:2 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 13/312 (4.2%) | 8/156 (5.1%) | all_purpose:13 | honorable:10, top:3 | calm_surface:9, warming_search:5, open_water_search:3, wind_reaction:3, clear_subtle:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 0/84 (0%) | 0/60 (0%) |  |  |  |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 274/684 (40.1%) | 238/508 (46.9%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 256/684 (37.4%) | 162/456 (35.5%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Inline Spinner<br>inline_spinner | lure | 233/684 (34.1%) | 161/456 (35.3%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 202/684 (29.5%) | 150/492 (30.5%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 189/684 (27.6%) | 151/456 (33.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Game Changer<br>game_changer | fly | 161/684 (23.5%) | 99/492 (20.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 154/528 (29.2%) | 81/300 (27%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Sculpzilla<br>sculpzilla | fly | 143/684 (20.9%) | 114/492 (23.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 125/552 (22.6%) | 108/444 (24.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Blade Bait<br>blade_bait | lure | 104/324 (32.1%) | 84/256 (32.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 98/288 (34%) | 83/204 (40.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>acceptable_niche_concentration | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Mouse Fly<br>mouse_fly | fly | 37/192 (19.3%) | 37/156 (23.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 508 | 48/508 (9.4%) | Suspending Jerkbait (top), Hair Jig (honorable):34, Suspending Jerkbait (top), Inline Spinner (honorable):34, Hair Jig (top), Suspending Jerkbait (honorable):31, Hair Jig (top), Blade Bait (honorable):24 | selector/direct-score or overpowered competitors |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 508 | 238/508 (46.9%) | Suspending Jerkbait (top), Inline Spinner (honorable):34, Inline Spinner (top), Casting Spoon (honorable):24, Inline Spinner (top), Soft Plastic Jerkbait (honorable):22, Suspending Jerkbait (top), Casting Spoon (honorable):17 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 456 | 161/456 (35.3%) | Hair Jig (top), Suspending Jerkbait (honorable):26, Hair Jig (top), Blade Bait (honorable):25, Hair Jig (top), Casting Spoon (honorable):21, Suspending Jerkbait (top), Casting Spoon (honorable):21 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 456 | 151/456 (33.1%) | Hair Jig (top), Suspending Jerkbait (honorable):26, Hair Jig (top), Blade Bait (honorable):25, Suspending Jerkbait (top), Inline Spinner (honorable):23, Inline Spinner (top), Hair Jig (honorable):21 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, open_water_search<br>goal 1: reliable_action | 256 | 84/256 (32.8%) | Hair Jig (top), Suspending Jerkbait (honorable):21, Hair Jig (top), Casting Spoon (honorable):16, Suspending Jerkbait (top), Inline Spinner (honorable):15, Suspending Jerkbait (top), Hair Jig (honorable):14 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 456 | 162/456 (35.5%) | Hair Jig (top), Blade Bait (honorable):25, Inline Spinner (top), Casting Spoon (honorable):23, Hair Jig (top), Casting Spoon (honorable):21, Inline Spinner (top), Hair Jig (honorable):21 | healthy / not underused |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 300 | 81/300 (27%) | Inline Spinner (top), Casting Spoon (honorable):18, Suspending Jerkbait (top), Hair Jig (honorable):18, Suspending Jerkbait (top), Inline Spinner (honorable):18, Inline Spinner (top), Hair Jig (honorable):17 | healthy / not underused |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 204 | 83/204 (40.7%) | Inline Spinner (top), Casting Spoon (honorable):12, Suspending Jerkbait (top), Inline Spinner (honorable):12, Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):11 | healthy / not underused |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 568 | 71/568 (12.5%) | Articulated Dungeon Streamer (top), Sculpzilla (honorable):28, Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):16 | healthy / not underused |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 568 | 61/568 (10.7%) | Articulated Dungeon Streamer (top), Sculpzilla (honorable):28, Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Dungeon Streamer (top), Game Changer (honorable):16 | selector/direct-score or overpowered competitors |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 508 | 26/508 (5.1%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 508 | 27/508 (5.3%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Feather Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 568 | 21/568 (3.7%) | Articulated Dungeon Streamer (top), Sculpzilla (honorable):28, Articulated Baitfish Streamer (top), Sculpzilla (honorable):27, Articulated Baitfish Streamer (top), Game Changer (honorable):26, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):16 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 508 | 82/508 (16.1%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Sculpzilla (top), Articulated Baitfish Streamer (honorable):15 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 492 | 114/492 (23.2%) | Articulated Baitfish Streamer (top), Game Changer (honorable):27, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Dungeon Streamer (top), Game Changer (honorable):15, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):14 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 508 | 24/508 (4.7%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):25, Articulated Dungeon Streamer (top), Sculpzilla (honorable):25, Articulated Baitfish Streamer (top), Game Changer (honorable):23, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 2: current_swing, clear_subtle<br>goal 1: reliable_action | 60 | 0/60 (0%) | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5, Jighead Marabou Leech (top), Sculpin Streamer (honorable):4 | selector/direct-score or overpowered competitors |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 456 | 69/456 (15.1%) | Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):23, Articulated Baitfish Streamer (top), Sculpzilla (honorable):20, Sculpin Streamer (top), Woolly Bugger (honorable):16 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 456 | 44/456 (9.6%) | Articulated Baitfish Streamer (top), Game Changer (honorable):23, Articulated Dungeon Streamer (top), Sculpzilla (honorable):23, Articulated Baitfish Streamer (top), Sculpzilla (honorable):20, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 300 | 15/300 (5%) | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Baitfish Streamer (top), Sculpzilla (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 | selector/direct-score or overpowered competitors |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 492 | 150/492 (30.5%) | Articulated Dungeon Streamer (top), Sculpzilla (honorable):26, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Dungeon Streamer (top), Game Changer (honorable):15, Sculpzilla (top), Articulated Dungeon Streamer (honorable):14 | healthy / not underused |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 444 | 108/444 (24.3%) | Articulated Baitfish Streamer (top), Game Changer (honorable):25, Articulated Baitfish Streamer (top), Sculpzilla (honorable):24, Sculpzilla (top), Articulated Baitfish Streamer (honorable):15, Sculpin Streamer (top), Woolly Bugger (honorable):14 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 492 | 99/492 (20.1%) | Articulated Baitfish Streamer (top), Sculpzilla (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):26, Sculpin Streamer (top), Woolly Bugger (honorable):16, Sculpzilla (top), Articulated Baitfish Streamer (honorable):15 | healthy / not underused |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 492 | 51/492 (10.4%) | Articulated Baitfish Streamer (top), Game Changer (honorable):27, Articulated Baitfish Streamer (top), Sculpzilla (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):26, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 492 | 45/492 (9.1%) | Articulated Baitfish Streamer (top), Game Changer (honorable):27, Articulated Baitfish Streamer (top), Sculpzilla (honorable):26, Articulated Dungeon Streamer (top), Sculpzilla (honorable):26, Sculpin Streamer (top), Woolly Bugger (honorable):16 | selector/direct-score or overpowered competitors |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 1: versatile_search | 300 | 5/300 (1.7%) | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Baitfish Streamer (top), Sculpzilla (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 | selector/direct-score or overpowered competitors |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: wind_reaction, open_water_search, warming_search<br>goal 1: versatile_search | 156 | 8/156 (5.1%) | Articulated Baitfish Streamer (top), Game Changer (honorable):8, Articulated Baitfish Streamer (top), Sculpzilla (honorable):8, Articulated Dungeon Streamer (top), Sculpzilla (honorable):7, Game Changer (top), Sculpzilla (honorable):6 | selector/direct-score or overpowered competitors |
| Popper Fly<br>popper_fly | fly | forage 2: surface_prey, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Deer Hair Slider<br>deer_hair_slider | fly | forage 2: surface_prey, baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: calm_surface, low_light_surface<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Mouse Fly<br>mouse_fly | fly | forage 1: surface_prey<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 156 | 37/156 (23.7%) | Game Changer (top), Articulated Baitfish Streamer (honorable):8, Game Changer (top), Sculpzilla (honorable):8, Articulated Baitfish Streamer (top), Game Changer (honorable):7, Articulated Baitfish Streamer (top), Sculpzilla (honorable):5 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Game Changer (game_changer), Inline Spinner (inline_spinner), Mouse Fly (mouse_fly), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Blade Bait (blade_bait), Casting Spoon (casting_spoon), Deer Hair Slider (deer_hair_slider), Game Changer (game_changer), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Mouse Fly (mouse_fly), Popper Fly (popper_fly), Sculpzilla (sculpzilla), Small Floating Trout Plug (small_floating_trout_plug), Soft Plastic Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait)

### Probably selector problem, not catalog problem
Baitfish Slider Fly (baitfish_slider_fly), Bucktail Streamer (bucktail_baitfish_streamer), Conehead Streamer (conehead_streamer), Crawfish Streamer (crawfish_streamer), Feather Jig Leech (feather_jig_leech), Jighead Marabou Leech (jighead_marabou_leech), Lead-Eye Leech (lead_eye_leech), Muddler Minnow (muddler_sculpin), Ned Rig (ned_rig), Rabbit-Strip Leech (rabbit_strip_leech), Slim Baitfish Streamer (slim_minnow_streamer), Unweighted Baitfish Streamer (unweighted_baitfish_streamer), Zonker Streamer (zonker_streamer)

## Utilization Notes / Coverage Gaps

- 1 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.
- 8 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Woolly Bugger, Sculpin Streamer, Conehead Streamer, Game Changer, Sculpzilla, Zonker Streamer, Bucktail Streamer, Clouser Minnow, Articulated Dungeon Streamer, Mouse Fly, Ned Rig |
| underused_home_window | Feather Jig Leech, Jighead Marabou Leech, Lead-Eye Leech, Muddler Minnow, Slim Baitfish Streamer, Unweighted Baitfish Streamer, Baitfish Slider Fly, Crawfish Streamer |
| no_home_window_coverage | None |
| over-dominant | Articulated Baitfish Streamer, Hair Jig, Casting Spoon, Inline Spinner, Suspending Jerkbait, Soft Plastic Jerkbait, Blade Bait, Small Floating Trout Plug |
| probably okay niche profile | Deer Hair Slider, Popper Fly |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 1.7% | 23/684 | 21/568 | 23 | 21 | 3.7% | 21/284 | 0/284 | 73 | underused_home_window | activity neutral:456, active:76, suppressed:36<br>clarity clear:224, stained:188, dirty:156<br>water freshwater_river:568<br>bucket cold_slow_or_front:168, dirty_vibration:112, warming_search:112 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Articulated Baitfish Streamer (top), Sculpzilla (honorable):16 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 5.3% | 73/684 | 61/568 | 73 | 61 | 10.7% | 5/284 | 56/284 | 69 | healthy | activity neutral:456, active:76, suppressed:36<br>clarity clear:224, stained:188, dirty:156<br>water freshwater_river:568<br>bucket cold_slow_or_front:168, dirty_vibration:112, warming_search:112 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Articulated Baitfish Streamer (top), Sculpzilla (honorable):16 |
| Woolly Bugger<br>woolly_bugger | fly | 6.1% | 83/684 | 71/568 | 83 | 71 | 12.5% | 71/284 | 0/284 | 127 | healthy | activity neutral:456, active:76, suppressed:36<br>clarity clear:224, stained:188, dirty:156<br>water freshwater_river:568<br>bucket cold_slow_or_front:168, dirty_vibration:112, warming_search:112 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Articulated Baitfish Streamer (top), Sculpzilla (honorable):16 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 2.2% | 30/684 | 26/508 | 30 | 26 | 5.1% | 25/254 | 1/254 | 76 | underused_home_window | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 2% | 28/684 | 27/508 | 28 | 27 | 5.3% | 27/254 | 0/254 | 55 | underused_home_window | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Muddler Minnow<br>muddler_sculpin | fly | 2% | 27/684 | 24/508 | 27 | 24 | 4.7% | 22/254 | 2/254 | 52 | underused_home_window | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Sculpin Streamer<br>sculpin_streamer | fly | 6.5% | 89/684 | 82/508 | 89 | 82 | 16.1% | 79/254 | 3/254 | 152 | healthy | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Articulated Baitfish Streamer (top), Sculpzilla (honorable):15 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 14.8% | 202/684 | 150/492 | 202 | 150 | 30.5% | 38/228 | 112/264 | 163 | over-dominant | activity neutral:378, active:78, suppressed:36<br>clarity clear:164, dirty:164, stained:164<br>water freshwater_river:492<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 | Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Dungeon Streamer (top), Game Changer (honorable):14 |
| Conehead Streamer<br>conehead_streamer | fly | 4.1% | 56/684 | 51/492 | 56 | 51 | 10.4% | 40/228 | 11/264 | 164 | healthy | activity neutral:378, active:78, suppressed:36<br>clarity clear:164, dirty:164, stained:164<br>water freshwater_river:492<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Game Changer<br>game_changer | fly | 11.8% | 161/684 | 99/492 | 161 | 99 | 20.1% | 10/228 | 89/264 | 96 | healthy | activity neutral:378, active:78, suppressed:36<br>clarity clear:164, dirty:164, stained:164<br>water freshwater_river:492<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 | Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Baitfish Streamer (top), Sculpzilla (honorable):15 |
| Sculpzilla<br>sculpzilla | fly | 10.5% | 143/684 | 114/492 | 143 | 114 | 23.2% | 1/228 | 113/264 | 120 | healthy | activity neutral:378, active:78, suppressed:36<br>clarity clear:164, dirty:164, stained:164<br>water freshwater_river:492<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Dungeon Streamer (top), Game Changer (honorable):14 |
| Zonker Streamer<br>zonker_streamer | fly | 4.1% | 56/684 | 45/492 | 56 | 45 | 9.1% | 38/228 | 7/264 | 176 | healthy | activity neutral:378, active:78, suppressed:36<br>clarity clear:164, dirty:164, stained:164<br>water freshwater_river:492<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:110 | Articulated Baitfish Streamer (top), Game Changer (honorable):24, Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4.2% | 57/684 | 44/456 | 57 | 44 | 9.6% | 35/228 | 9/228 | 177 | healthy | activity neutral:348, active:72, suppressed:36<br>clarity clear:152, dirty:152, stained:152<br>water freshwater_river:456<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 | Articulated Baitfish Streamer (top), Game Changer (honorable):21, Articulated Dungeon Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Clouser Minnow<br>clouser_minnow | fly | 8.6% | 118/684 | 69/456 | 118 | 69 | 15.1% | 69/228 | 0/228 | 158 | healthy | activity neutral:348, active:72, suppressed:36<br>clarity clear:152, dirty:152, stained:152<br>water freshwater_river:456<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 | Articulated Baitfish Streamer (top), Game Changer (honorable):21, Articulated Dungeon Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 9.1% | 125/552 | 108/444 | 125 | 108 | 24.3% | 0/204 | 108/240 | 119 | healthy | activity neutral:330, active:78, suppressed:36<br>clarity clear:148, dirty:148, stained:148<br>water freshwater_river:444<br>bucket dirty_vibration:112, cold_slow_or_front:110, warming_search:80 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Baitfish Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):14 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 2.3% | 32/528 | 15/300 | 32 | 15 | 5% | 15/150 | 0/150 | 46 | underused_home_window | activity neutral:252, active:24, suppressed:24<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_river:300<br>bucket dirty_vibration:76, cold_slow_or_front:60, warming_search:60 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 1.1% | 15/528 | 5/300 | 15 | 5 | 1.7% | 3/150 | 2/150 | 17 | underused_home_window | activity neutral:252, active:24, suppressed:24<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_river:300<br>bucket dirty_vibration:76, cold_slow_or_front:60, warming_search:60 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 1% | 13/312 | 8/156 | 13 | 8 | 5.1% | 8/78 | 0/78 | 23 | underused_home_window | activity neutral:156<br>clarity clear:52, dirty:52, stained:52<br>water freshwater_river:156<br>bucket warming_search:40, dirty_vibration:32, calm_low_light_surface:24 | Articulated Baitfish Streamer (top), Game Changer (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):7, Sculpzilla (honorable), Articulated Baitfish Streamer (top):6 |
| Mouse Fly<br>mouse_fly | fly | 2.7% | 37/192 | 37/156 | 37 | 37 | 23.7% | 0/78 | 37/78 | 31 | healthy | activity neutral:144, active:12<br>clarity clear:52, dirty:52, stained:52<br>water freshwater_river:156<br>bucket stable_pleasant_medium_confidence_archive:56, warming_search:40, cold_slow_or_front:24 | Articulated Baitfish Streamer (honorable), Game Changer (top):7, Articulated Baitfish Streamer (top), Game Changer (honorable):6, Game Changer (top), Sculpzilla (honorable):6 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0% | 0/84 | 0/60 | 0 | 0 | 0% | 0/30 | 0/30 | 4 | underused_home_window | activity neutral:48, suppressed:12<br>clarity clear:20, dirty:20, stained:20<br>water freshwater_river:60<br>bucket cold_slow_or_front:28, dirty_vibration:20, breezy_windy_stained_reaction:12 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Popper Fly<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Hair Jig<br>hair_jig | lure | 20% | 274/684 | 238/508 | 274 | 238 | 46.9% | 109/254 | 129/254 | 166 | over-dominant | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Inline Spinner (top), Casting Spoon (honorable):24, Inline Spinner (honorable), Suspending Jerkbait (top):21, Inline Spinner (top), Soft Plastic Jerkbait (honorable):21 |
| Ned Rig<br>ned_rig | lure | 4.4% | 60/684 | 48/508 | 60 | 48 | 9.4% | 26/254 | 22/254 | 36 | healthy | activity neutral:440, suppressed:36, active:32<br>clarity clear:212, stained:160, dirty:136<br>water freshwater_river:508<br>bucket cold_slow_or_front:168, dirty_vibration:108, breezy_windy_stained_reaction:52 | Suspending Jerkbait (top), Hair Jig (honorable):26, Inline Spinner (top), Casting Spoon (honorable):24, Hair Jig (top), Blade Bait (honorable):23 |
| Casting Spoon<br>casting_spoon | lure | 13.8% | 189/684 | 151/456 | 189 | 151 | 33.1% | 50/228 | 101/228 | 59 | over-dominant | activity neutral:348, active:72, suppressed:36<br>clarity clear:152, dirty:152, stained:152<br>water freshwater_river:456<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 | Hair Jig (top), Blade Bait (honorable):24, Hair Jig (top), Suspending Jerkbait (honorable):23, Inline Spinner (top), Soft Plastic Jerkbait (honorable):20 |
| Inline Spinner<br>inline_spinner | lure | 17% | 233/684 | 161/456 | 233 | 161 | 35.3% | 117/228 | 44/228 | 156 | over-dominant | activity neutral:348, active:72, suppressed:36<br>clarity clear:152, dirty:152, stained:152<br>water freshwater_river:456<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 | Hair Jig (top), Blade Bait (honorable):24, Hair Jig (top), Suspending Jerkbait (honorable):23, Hair Jig (top), Casting Spoon (honorable):16 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 18.7% | 256/684 | 162/456 | 256 | 162 | 35.5% | 94/228 | 68/228 | 96 | over-dominant | activity neutral:348, active:72, suppressed:36<br>clarity clear:152, dirty:152, stained:152<br>water freshwater_river:456<br>bucket dirty_vibration:120, warming_search:112, cold_slow_or_front:88 | Hair Jig (top), Blade Bait (honorable):24, Inline Spinner (top), Casting Spoon (honorable):23, Inline Spinner (top), Soft Plastic Jerkbait (honorable):20 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 11.3% | 154/528 | 81/300 | 154 | 81 | 27% | 40/150 | 41/150 | 53 | over-dominant | activity neutral:252, active:24, suppressed:24<br>clarity clear:100, dirty:100, stained:100<br>water freshwater_river:300<br>bucket dirty_vibration:76, cold_slow_or_front:60, warming_search:60 | Inline Spinner (top), Casting Spoon (honorable):18, Inline Spinner (top), Hair Jig (honorable):17, Inline Spinner (honorable), Suspending Jerkbait (top):15 |
| Blade Bait<br>blade_bait | lure | 7.6% | 104/324 | 84/256 | 104 | 84 | 32.8% | 32/128 | 52/128 | 45 | over-dominant | activity neutral:200, suppressed:36, active:20<br>clarity clear:96, stained:84, dirty:76<br>water freshwater_river:256<br>bucket cold_slow_or_front:100, dirty_vibration:68, breezy_windy_stained_reaction:36 | Hair Jig (top), Suspending Jerkbait (honorable):17, Hair Jig (top), Casting Spoon (honorable):12, Hair Jig (top), Ned Rig (honorable):11 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 7.2% | 98/288 | 83/204 | 98 | 83 | 40.7% | 9/102 | 74/102 | 30 | over-dominant | activity neutral:192, active:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_river:204<br>bucket stable_pleasant_medium_confidence_archive:56, cold_slow_or_front:44, warming_search:40 | Inline Spinner (top), Casting Spoon (honorable):12, Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):9 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 26/254 | 22/254 | goal_tags:357, daily_condition_tags:75, forage_clarity_stack:20, selector_filtering_variety_jitter:8 | Upper Delaware trout river 2025-01-18 all_purpose clear: lost to Blade Bait by -6 (selector_filtering_variety_jitter)<br>Upper Delaware trout river 2025-01-18 big_fish stained: lost to Suspending Jerkbait by 2 (goal_tags)<br>Upper Delaware trout river 2025-01-18 big_fish clear: lost to Blade Bait by 6 (goal_tags) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>all_purpose clear cold_slow_or_front | 184 | Blade Bait<br>178 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish stained breezy_windy_stained_reaction | 156 | Suspending Jerkbait<br>158 | 2 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish clear cold_slow_or_front | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish dirty dirty_vibration | 156 | Blade Bait<br>162 | 6 | goal_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:dirty:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:trout_trophy_lure:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 3 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Delaware trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Au Sable / Upper Midwest trout river<br>2025-12-12 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>178 | Ned Rig<br>184 | -6 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Feather Jig Leech<br>feather_jig_leech | fly | 21/568 | 3.7% | 73 | all_purpose / dirty / freshwater_river / dirty_vibration:56, big_fish / dirty / freshwater_river / dirty_vibration:56, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:433, daily_condition_tags:61, selector_filtering_variety_jitter:28, forage_clarity_stack:24 | Articulated Baitfish Streamer (top), Game Changer (honorable):22, Articulated Dungeon Streamer (top), Sculpzilla (honorable):21, Articulated Baitfish Streamer (top), Sculpzilla (honorable):16, Sculpin Streamer (top), Woolly Bugger (honorable):16 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 26/508 | 5.1% | 76 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:311, daily_condition_tags:113, selector_filtering_variety_jitter:25, forage_clarity_stack:21 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Baitfish Streamer (top), Sculpzilla (honorable):15 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 27/508 | 5.3% | 55 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:309, daily_condition_tags:124, forage_clarity_stack:19, selector_filtering_variety_jitter:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Baitfish Streamer (top), Sculpzilla (honorable):15 |
| Muddler Minnow<br>muddler_sculpin | fly | 24/508 | 4.7% | 52 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:309, daily_condition_tags:121, seasonal_baseline:29, forage_clarity_stack:22 | Articulated Baitfish Streamer (top), Game Changer (honorable):19, Articulated Dungeon Streamer (top), Sculpzilla (honorable):18, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Baitfish Streamer (top), Sculpzilla (honorable):15 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 15/300 | 5% | 46 | all_purpose / dirty / freshwater_river / dirty_vibration:38, big_fish / dirty / freshwater_river / dirty_vibration:38, all_purpose / clear / freshwater_river / cold_slow_or_front:22, big_fish / clear / freshwater_river / cold_slow_or_front:22 | goal_tags:180, daily_condition_tags:79, forage_clarity_stack:17, selector_filtering_variety_jitter:8 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12, Articulated Baitfish Streamer (top), Sculpzilla (honorable):9 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 5/300 | 1.7% | 17 | all_purpose / dirty / freshwater_river / dirty_vibration:38, big_fish / dirty / freshwater_river / dirty_vibration:38, all_purpose / clear / freshwater_river / cold_slow_or_front:22, big_fish / clear / freshwater_river / cold_slow_or_front:22 | goal_tags:214, daily_condition_tags:68, seasonal_baseline:9, forage_clarity_stack:2 | Articulated Baitfish Streamer (top), Game Changer (honorable):17, Articulated Dungeon Streamer (top), Sculpzilla (honorable):14, Sculpin Streamer (top), Woolly Bugger (honorable):12, Articulated Baitfish Streamer (top), Sculpzilla (honorable):9 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 8/156 | 5.1% | 23 | all_purpose / dirty / freshwater_river / dirty_vibration:16, big_fish / dirty / freshwater_river / dirty_vibration:16, all_purpose / stained / freshwater_river / warming_search:8, big_fish / stained / freshwater_river / warming_search:8 | goal_tags:117, daily_condition_tags:20, selector_filtering_variety_jitter:6, seasonal_baseline:5 | Articulated Baitfish Streamer (top), Game Changer (honorable):7, Articulated Dungeon Streamer (top), Sculpzilla (honorable):7, Sculpzilla (honorable), Articulated Baitfish Streamer (top):6, Sculpin Streamer (top), Woolly Bugger (honorable):5 |
| Crawfish Streamer<br>crawfish_streamer | fly | 0/60 | 0% | 4 | all_purpose / clear / freshwater_river / cold_slow_or_front:10, all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / dirty / freshwater_river / dirty_vibration:10 | daily_condition_tags:32, goal_tags:27, forage_clarity_stack:1 | Rabbit-Strip Leech (top), Articulated Dungeon Streamer (honorable):7, Sculpin Streamer (top), Jighead Marabou Leech (honorable):6, Muddler Minnow (top), Woolly Bugger (honorable):5, Lead-Eye Leech (top), Muddler Minnow (honorable):4 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 238/508 | 46.9% | 166 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:48, big_fish / clear / freshwater_river / cold_slow_or_front:48 | goal_tags:123, selector_filtering_variety_jitter:101, seasonal_baseline:24, daily_condition_tags:16 | Inline Spinner (top), Casting Spoon (honorable):24, Inline Spinner (honorable), Suspending Jerkbait (top):21, Inline Spinner (top), Soft Plastic Jerkbait (honorable):21, Inline Spinner (honorable), Casting Spoon (top):14 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 150/492 | 30.5% | 163 | all_purpose / dirty / freshwater_river / dirty_vibration:60, big_fish / dirty / freshwater_river / dirty_vibration:60, big_fish / clear / freshwater_river / cold_slow_or_front:38, all_purpose / clear / freshwater_river / cold_slow_or_front:32 | goal_tags:187, daily_condition_tags:80, selector_filtering_variety_jitter:58, forage_clarity_stack:10 | Articulated Dungeon Streamer (top), Sculpzilla (honorable):19, Sculpin Streamer (top), Woolly Bugger (honorable):16, Articulated Dungeon Streamer (top), Game Changer (honorable):14, Articulated Dungeon Streamer (honorable), Game Changer (top):12 |
| Inline Spinner<br>inline_spinner | lure | 161/456 | 35.3% | 156 | all_purpose / dirty / freshwater_river / dirty_vibration:60, big_fish / dirty / freshwater_river / dirty_vibration:60, all_purpose / clear / freshwater_river / cold_slow_or_front:32, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:32 | goal_tags:121, selector_filtering_variety_jitter:115, forage_clarity_stack:27, daily_condition_tags:25 | Hair Jig (top), Blade Bait (honorable):24, Hair Jig (top), Suspending Jerkbait (honorable):23, Hair Jig (top), Casting Spoon (honorable):16, Suspending Jerkbait (top), Casting Spoon (honorable):13 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 162/456 | 35.5% | 96 | all_purpose / dirty / freshwater_river / dirty_vibration:60, big_fish / dirty / freshwater_river / dirty_vibration:60, all_purpose / clear / freshwater_river / cold_slow_or_front:32, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:32 | daily_condition_tags:148, goal_tags:49, selector_filtering_variety_jitter:46, forage_clarity_stack:36 | Hair Jig (top), Blade Bait (honorable):24, Inline Spinner (top), Casting Spoon (honorable):23, Inline Spinner (top), Soft Plastic Jerkbait (honorable):20, Inline Spinner (top), Hair Jig (honorable):19 |
| Casting Spoon<br>casting_spoon | lure | 151/456 | 33.1% | 59 | all_purpose / dirty / freshwater_river / dirty_vibration:60, big_fish / dirty / freshwater_river / dirty_vibration:60, all_purpose / clear / freshwater_river / cold_slow_or_front:32, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:32 | goal_tags:204, daily_condition_tags:55, selector_filtering_variety_jitter:32, forage_clarity_stack:9 | Hair Jig (top), Blade Bait (honorable):24, Hair Jig (top), Suspending Jerkbait (honorable):23, Inline Spinner (top), Soft Plastic Jerkbait (honorable):20, Inline Spinner (honorable), Suspending Jerkbait (top):19 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 81/300 | 27% | 53 | all_purpose / dirty / freshwater_river / dirty_vibration:38, big_fish / dirty / freshwater_river / dirty_vibration:38, all_purpose / clear / freshwater_river / cold_slow_or_front:22, big_fish / clear / freshwater_river / cold_slow_or_front:22 | daily_condition_tags:133, goal_tags:44, seasonal_baseline:29, selector_filtering_variety_jitter:13 | Inline Spinner (top), Casting Spoon (honorable):18, Inline Spinner (top), Hair Jig (honorable):17, Inline Spinner (honorable), Suspending Jerkbait (top):15, Inline Spinner (top), Suspending Jerkbait (honorable):13 |
| Blade Bait<br>blade_bait | lure | 84/256 | 32.8% | 45 | all_purpose / dirty / freshwater_river / dirty_vibration:34, big_fish / dirty / freshwater_river / dirty_vibration:34, all_purpose / clear / freshwater_river / cold_slow_or_front:28, big_fish / clear / freshwater_river / cold_slow_or_front:28 | goal_tags:64, daily_condition_tags:55, forage_clarity_stack:20, seasonal_baseline:19 | Hair Jig (top), Suspending Jerkbait (honorable):17, Hair Jig (top), Casting Spoon (honorable):12, Hair Jig (top), Ned Rig (honorable):11, Inline Spinner (honorable), Suspending Jerkbait (top):10 |
| Small Floating Trout Plug<br>small_floating_trout_plug | lure | 83/204 | 40.7% | 30 | all_purpose / stained / freshwater_river / stable_pleasant_medium_confidence_archive:12, big_fish / stained / freshwater_river / stable_pleasant_medium_confidence_archive:12, all_purpose / clear / freshwater_river / cold_slow_or_front:8, all_purpose / clear / freshwater_river / stable_pleasant_medium_confidence_archive:8 | goal_tags:93, selector_filtering_variety_jitter:28 | Inline Spinner (top), Casting Spoon (honorable):12, Hair Jig (top), Soft Plastic Jerkbait (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):9, Soft Plastic Jerkbait (top), Hair Jig (honorable):8 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Suspending Jerkbait [lure] (34), Inline Spinner [lure] (27), Clouser Minnow [fly] (22), Soft Plastic Jerkbait [lure] (20), Articulated Baitfish Streamer [fly] (13) | Inline Spinner [lure] (51), Suspending Jerkbait [lure] (47), Clouser Minnow [fly] (43), Soft Plastic Jerkbait [lure] (39), Hair Jig [lure] (35) |
| calm_surface | big_fish | Small Floating Trout Plug [lure] (59), Articulated Baitfish Streamer [fly] (27), Game Changer [fly] (24), Articulated Dungeon Streamer [fly] (19), Mouse Fly [fly] (19) | Small Floating Trout Plug [lure] (76), Game Changer [fly] (46), Articulated Baitfish Streamer [fly] (45), Sculpzilla [fly] (41), Mouse Fly [fly] (34) |
| low_light_surface | all_purpose | Inline Spinner [lure] (11), Suspending Jerkbait [lure] (11), Clouser Minnow [fly] (7), Zonker Streamer [fly] (6), Articulated Baitfish Streamer [fly] (4) | Inline Spinner [lure] (15), Suspending Jerkbait [lure] (14), Hair Jig [lure] (13), Clouser Minnow [fly] (12), Soft Plastic Jerkbait [lure] (10) |
| low_light_surface | big_fish | Small Floating Trout Plug [lure] (11), Articulated Baitfish Streamer [fly] (10), Articulated Dungeon Streamer [fly] (9), Hair Jig [lure] (9), Sculpzilla [fly] (6) | Small Floating Trout Plug [lure] (17), Sculpzilla [fly] (14), Articulated Baitfish Streamer [fly] (13), Articulated Dungeon Streamer [fly] (13), Casting Spoon [lure] (13) |
| wind_reaction | all_purpose | Inline Spinner [lure] (36), Sculpin Streamer [fly] (19), Casting Spoon [lure] (18), Suspending Jerkbait [lure] (18), Zonker Streamer [fly] (16) | Inline Spinner [lure] (59), Suspending Jerkbait [lure] (40), Casting Spoon [lure] (33), Conehead Streamer [fly] (29), Hair Jig [lure] (27) |
| wind_reaction | big_fish | Casting Spoon [lure] (21), Hair Jig [lure] (21), Suspending Jerkbait [lure] (21), Articulated Baitfish Streamer [fly] (19), Articulated Dungeon Streamer [fly] (13) | Casting Spoon [lure] (48), Suspending Jerkbait [lure] (44), Articulated Baitfish Streamer [fly] (40), Articulated Dungeon Streamer [fly] (39), Hair Jig [lure] (39) |
| dirty_vibration | all_purpose | Inline Spinner [lure] (48), Sculpin Streamer [fly] (29), Suspending Jerkbait [lure] (26), Clouser Minnow [fly] (22), Hair Jig [lure] (22) | Inline Spinner [lure] (71), Hair Jig [lure] (51), Suspending Jerkbait [lure] (48), Sculpin Streamer [fly] (45), Clouser Minnow [fly] (38) |
| dirty_vibration | big_fish | Hair Jig [lure] (37), Articulated Baitfish Streamer [fly] (34), Articulated Dungeon Streamer [fly] (26), Inline Spinner [lure] (26), Sculpzilla [fly] (26) | Casting Spoon [lure] (60), Hair Jig [lure] (60), Articulated Baitfish Streamer [fly] (56), Sculpzilla [fly] (56), Articulated Dungeon Streamer [fly] (53) |
| clear_subtle | all_purpose | Suspending Jerkbait [lure] (24), Hair Jig [lure] (19), Soft Plastic Jerkbait [lure] (16), Lead-Eye Leech [fly] (14), Slim Baitfish Streamer [fly] (14) | Hair Jig [lure] (33), Suspending Jerkbait [lure] (32), Soft Plastic Jerkbait [lure] (29), Inline Spinner [lure] (28), Clouser Minnow [fly] (26) |
| clear_subtle | big_fish | Hair Jig [lure] (26), Suspending Jerkbait [lure] (22), Articulated Baitfish Streamer [fly] (19), Game Changer [fly] (18), Articulated Dungeon Streamer [fly] (12) | Hair Jig [lure] (37), Suspending Jerkbait [lure] (33), Game Changer [fly] (32), Articulated Baitfish Streamer [fly] (26), Sculpzilla [fly] (26) |
| cold_slow | all_purpose | Sculpin Streamer [fly] (28), Hair Jig [lure] (27), Suspending Jerkbait [lure] (21), Inline Spinner [lure] (16), Blade Bait [lure] (10) | Hair Jig [lure] (43), Inline Spinner [lure] (37), Sculpin Streamer [fly] (36), Woolly Bugger [fly] (35), Suspending Jerkbait [lure] (33) |
| cold_slow | big_fish | Hair Jig [lure] (29), Suspending Jerkbait [lure] (22), Articulated Dungeon Streamer [fly] (18), Articulated Baitfish Streamer [fly] (17), Blade Bait [lure] (16) | Hair Jig [lure] (47), Suspending Jerkbait [lure] (40), Articulated Dungeon Streamer [fly] (39), Blade Bait [lure] (33), Sculpzilla [fly] (32) |
| warming_search | all_purpose | Inline Spinner [lure] (28), Suspending Jerkbait [lure] (21), Clouser Minnow [fly] (18), Sculpin Streamer [fly] (15), Hair Jig [lure] (14) | Inline Spinner [lure] (41), Suspending Jerkbait [lure] (36), Clouser Minnow [fly] (31), Hair Jig [lure] (30), Sculpin Streamer [fly] (21) |
| warming_search | big_fish | Hair Jig [lure] (22), Articulated Baitfish Streamer [fly] (20), Casting Spoon [lure] (19), Articulated Dungeon Streamer [fly] (18), Game Changer [fly] (15) | Sculpzilla [fly] (40), Casting Spoon [lure] (37), Articulated Baitfish Streamer [fly] (36), Hair Jig [lure] (33), Articulated Dungeon Streamer [fly] (29) |
| heat_finesse | all_purpose | Clouser Minnow [fly] (4), Hair Jig [lure] (3), Suspending Jerkbait [lure] (3), Bucktail Streamer [fly] (2), Lead-Eye Leech [fly] (2) | Ned Rig [lure] (6), Clouser Minnow [fly] (5), Soft Plastic Jerkbait [lure] (5), Suspending Jerkbait [lure] (5), Hair Jig [lure] (4) |
| heat_finesse | big_fish | Game Changer [fly] (5), Ned Rig [lure] (5), Articulated Dungeon Streamer [fly] (3), Articulated Baitfish Streamer [fly] (2), Hair Jig [lure] (2) | Ned Rig [lure] (10), Game Changer [fly] (6), Hair Jig [lure] (6), Sculpzilla [fly] (5), Articulated Baitfish Streamer [fly] (4) |
| current_swing | all_purpose | Inline Spinner [lure] (59), Sculpin Streamer [fly] (47), Hair Jig [lure] (37), Suspending Jerkbait [lure] (36), Clouser Minnow [fly] (31) | Inline Spinner [lure] (91), Hair Jig [lure] (73), Sculpin Streamer [fly] (64), Suspending Jerkbait [lure] (62), Clouser Minnow [fly] (54) |
| current_swing | big_fish | Hair Jig [lure] (56), Articulated Baitfish Streamer [fly] (43), Sculpzilla [fly] (37), Articulated Dungeon Streamer [fly] (36), Casting Spoon [lure] (26) | Hair Jig [lure] (86), Sculpzilla [fly] (78), Articulated Baitfish Streamer [fly] (72), Casting Spoon [lure] (70), Articulated Dungeon Streamer [fly] (69) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Elk River Appalachian trout water<br>2025-06-17 clear big_fish B | 64.8-77.5F, 8.2 mph wind, 61.9% cloud, 0.3 in precip | neutral, caution, wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Hair Jig (160); Game Changer (176); Articulated Baitfish Streamer (184) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (174); Blade Bait (164); Game Changer (166); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 stained all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Clouser Minnow (192); Sculpzilla (168) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-03-18 stained big_fish B | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Inline Spinner (172); Soft Plastic Jerkbait (158); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-09-18 dirty big_fish B | 67.2-94.5F, 4.2 mph wind, 54.6% cloud, 0 in precip | neutral, closed, heat_finesse, medium | Inline Spinner (132); Ned Rig (130); Articulated Dungeon Streamer (168); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-09-18 stained big_fish B | 67.2-94.5F, 4.2 mph wind, 54.6% cloud, 0 in precip | neutral, closed, heat_finesse, medium | Soft Plastic Jerkbait (130); Ned Rig (130); Articulated Dungeon Streamer (168); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish B | 59.5-87.5F, 9.2 mph wind, 19.1% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Hair Jig (160); Soft Plastic Jerkbait (174); Unweighted Baitfish Streamer (162); Sculpzilla (138) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+warming_search+open_water_search, medium | Inline Spinner (162); Blade Bait (152); Bucktail Streamer (162); Articulated Baitfish Streamer (158) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Blade Bait (152); Inline Spinner (154); Sculpzilla (156); Rabbit-Strip Leech (150) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained big_fish B | 27-50.9F, 8.1 mph wind, 99.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Inline Spinner (162); Blade Bait (152); Game Changer (166); Sculpzilla (156) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-09-20 clear big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Hair Jig (160); Articulated Dungeon Streamer (176); Sculpzilla (170) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Au Sable / Upper Midwest trout river<br>2025-09-20 dirty big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (150); Suspending Jerkbait (148); Articulated Baitfish Streamer (192); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-09-20 stained big_fish B | 50.5-70.2F, 8.9 mph wind, 74.9% cloud, 0.6 in precip | neutral, caution, wind_reaction+dirty_vibration+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (188); Hair Jig (160); Articulated Baitfish Streamer (192); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-12-12 clear all_purpose B | 1.7-22.9F, 7.9 mph wind, 99.6% cloud, 0.1 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (184); Muddler Minnow (178) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Madison River mountain-west trout water<br>2025-11-11 clear big_fish B | 28.2-45.8F, 4.1 mph wind, 64.1% cloud, 0 in precip | active, closed, warming_search, medium | Ned Rig (134); Blade Bait (140); Sculpzilla (152); Articulated Baitfish Streamer (138) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 clear all_purpose B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (176); Suspending Jerkbait (176); Bucktail Streamer (190); Clouser Minnow (192) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-03-30 clear big_fish B | 38.3-62.8F, 11.8 mph wind, 80.6% cloud, 0 in precip | active, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Hair Jig (170); Game Changer (166); Articulated Dungeon Streamer (166) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-06-21 stained all_purpose B | 58.2-80.4F, 4.4 mph wind, 50.2% cloud, 0 in precip | neutral, open, calm_surface+dirty_vibration+runoff_streamer+current_swing, medium | Suspending Jerkbait (170); Casting Spoon (152); Bucktail Streamer (168); Clouser Minnow (186) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-08-12 dirty big_fish B | 60.1-88.8F, 2.7 mph wind, 11.7% cloud, 0 in precip | neutral, closed, heat_finesse, medium | Inline Spinner (132); Ned Rig (130); Game Changer (160); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Upper Delaware trout river<br>2025-08-12 stained big_fish B | 60.1-88.8F, 2.7 mph wind, 11.7% cloud, 0 in precip | neutral, closed, heat_finesse, medium | Suspending Jerkbait (140); Ned Rig (130); Articulated Baitfish Streamer (160); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Upper Delaware trout river<br>2025-12-12 clear all_purpose B | 12.2-29.4F, 9.8 mph wind, 66.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Blade Bait (178); Suspending Jerkbait (176); Lead-Eye Leech (184); Muddler Minnow (178) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 clear big_fish B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+warming_search+runoff_streamer+current_swing+open_water_search, medium | Soft Plastic Jerkbait (158); Casting Spoon (184); Articulated Baitfish Streamer (184); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 dirty all_purpose B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (176); Inline Spinner (210); Articulated Baitfish Streamer (184); Clouser Minnow (194) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 dirty big_fish B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (180); Hair Jig (152); Sculpzilla (178); Articulated Baitfish Streamer (192) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Elk River Appalachian trout water<br>2025-04-04 stained all_purpose B | 57.2-69.3F, 8.6 mph wind, 100% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (186); Casting Spoon (184); Clouser Minnow (202); Bucktail Streamer (200) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Suspending Jerkbait (192); Blade Bait (180); Sculpin Streamer (190); Zonker Streamer (190) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-01-16 clear big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+clear_subtle+warming_search+runoff_streamer+current_swing+open_water_search, medium | Hair Jig (186); Casting Spoon (174); Sculpzilla (180); Articulated Baitfish Streamer (174) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 dirty all_purpose B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Inline Spinner (200); Blade Bait (170); Sculpin Streamer (180); Articulated Baitfish Streamer (174) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish A | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Casting Spoon (174); Hair Jig (170); Articulated Dungeon Streamer (174); Sculpzilla (188) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search, medium | Blade Bait (164); Suspending Jerkbait (158); Bucktail Streamer (178); Articulated Baitfish Streamer (182) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-03-18 clear big_fish A | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+open_water_search, medium | Suspending Jerkbait (168); Casting Spoon (184); Articulated Baitfish Streamer (168); Game Changer (176) | WIND_NOT_ELEVATING_REACTION |
| White River Ozark trout tailwater<br>2025-03-18 dirty all_purpose B | 57.4-75.4F, 14 mph wind, 85.9% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Inline Spinner (194); Soft Plastic Jerkbait (168); Articulated Baitfish Streamer (168); Game Changer (168) | WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
