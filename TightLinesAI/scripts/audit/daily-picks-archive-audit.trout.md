# FinFindr Trout Daily-Picks Archive Audit
Generated: 2026-05-18T13:40:29.487Z

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
| breezy_windy_stained_reaction | 32 |
| dirty_vibration | 120 |
| cold_slow_or_front | 288 |
| warming_search | 96 |
| heat_limited_finesse | 120 |
| stable_pleasant_high_confidence | 132 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 324 |
| medium_confidence_archive | 0 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-20 -> 2025-09-21 | changed | 2.5 | 3.7 | dirty_vibration|runoff_streamer|current_swing -> low_light_surface|dirty_vibration|runoff_streamer|current_swing |
| Au Sable / Upper Midwest trout river<br>2025-10-19 -> 2025-10-20 | changed | 3.7 | 0.5 | wind_reaction|dirty_vibration|runoff_streamer|current_swing|open_water_search -> dirty_vibration|runoff_streamer|current_swing |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 4 | BIG_FISH_NOT_FAVORING_UPSIDE (4) |
| calm_bright_clear_subtle | 4 | BIG_FISH_NOT_FAVORING_UPSIDE (2), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |
| calm_low_light_surface | 5 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), BIG_FISH_NOT_FAVORING_UPSIDE (2) |
| cold_slow_or_front | 28 | BIG_FISH_NOT_FAVORING_UPSIDE (22), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (6), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| dirty_vibration | 9 | BIG_FISH_NOT_FAVORING_UPSIDE (8), WIND_NOT_ELEVATING_REACTION (1) |
| heat_limited_finesse | 10 | BIG_FISH_NOT_FAVORING_UPSIDE (10) |
| river_elevated_runoff_current | 31 | BIG_FISH_NOT_FAVORING_UPSIDE (24), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (4), WIND_NOT_ELEVATING_REACTION (3) |
| stable_pleasant_high_confidence | 17 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (9), BIG_FISH_NOT_FAVORING_UPSIDE (6), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1), WIND_NOT_ELEVATING_REACTION (1) |
| unclassified | 4 | BIG_FISH_NOT_FAVORING_UPSIDE (4) |
| warming_search | 18 | BIG_FISH_NOT_FAVORING_UPSIDE (16), WIND_NOT_ELEVATING_REACTION (2) |

- BIG_FISH_NOT_FAVORING_UPSIDE: 62
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 15
- WIND_NOT_ELEVATING_REACTION: 3
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 2

- mi_au_sable_trout__2025-12-12__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Casting Spoon (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Articulated Baitfish (fly); Sculpzilla (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Marabou Jig Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Zonker Streamer (fly); Marabou Jig Leech (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Blade Bait (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-03-30__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Marabou Jig Leech (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Hair Jig (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Dungeon Streamer (fly); Sculpzilla (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Drop-Shot Minnow (lure); Articulated Baitfish (fly); Sculpzilla (fly)
- ca_lower_sac_trout__2025-04-27__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Hair Jig (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- mt_madison_trout__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Ned Rig (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Baitfish (fly); Sculpzilla (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- ca_lower_sac_trout__2025-05-23__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Floating Trout Plug (lure); Drop-Shot Minnow (lure); Zonker Streamer (fly); Unweighted Baitfish (fly)
- mt_madison_trout__2025-06-07__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Floating Trout Plug (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- mt_madison_trout__2025-06-07__freshwater_river__dirty__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Baitfish Slider (fly); Sculpin Streamer (fly)
- wa_skagit_trout__2025-06-14__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Bucktail Streamer (fly); Baitfish Slider (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- ny_upper_delaware_trout__2025-06-21__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ca_lower_sac_trout__2025-06-22__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Conehead Streamer (fly); Baitfish Slider (fly)
- ar_white_river_trout__2025-06-28__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- ar_white_river_trout__2025-06-28__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-07-12__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-07-16__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Mouse Pattern (fly)
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Mouse Pattern (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Inline Spinner (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mt_madison_trout__2025-07-19__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Suspending Jerkbait (lure); Sculpzilla (fly); Baitfish Slider (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish (fly); Articulated Baitfish (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Unweighted Baitfish (fly); Sculpzilla (fly)
- wa_skagit_trout__2025-08-02__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Floating Trout Plug (lure); Inline Spinner (lure); Baitfish Slider (fly); Bucktail Streamer (fly)
- wa_skagit_trout__2025-08-02__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Floating Trout Plug (lure); Conehead Streamer (fly); Baitfish Slider (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-08-14__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Woolly Bugger (fly); Slim Baitfish Streamer (fly)
- mi_au_sable_trout__2025-08-14__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Sculpzilla (fly); Woolly Bugger (fly)
- ca_lower_sac_trout__2025-08-16__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Unweighted Baitfish (fly); Articulated Baitfish (fly)
- ar_white_river_trout__2025-08-21__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Ned Rig (lure); Unweighted Baitfish (fly); Sculpzilla (fly)
- mt_madison_trout__2025-08-23__freshwater_river__clear__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Lead-Eye Leech (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-08-23__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Floating Trout Plug (lure); Casting Spoon (lure); Slim Baitfish Streamer (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-08-23__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Clouser Minnow (fly); Sculpin Streamer (fly)
- ny_upper_delaware_trout__2025-09-13__freshwater_river__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Floating Trout Plug (lure); Inline Spinner (lure); Marabou Jig Leech (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- mt_madison_trout__2025-09-27__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Floating Trout Plug (lure); Inline Spinner (lure); Sculpin Streamer (fly); Bucktail Streamer (fly)
- mt_madison_trout__2025-09-27__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Casting Spoon (lure); Hair Jig (lure); Articulated Baitfish (fly); Sculpzilla (fly)
- wa_skagit_trout__2025-09-29__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Suspending Jerkbait (lure); Floating Trout Plug (lure); Bucktail Streamer (fly); Jigged Marabou Leech (fly)
- wa_skagit_trout__2025-09-29__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish (fly); Sculpzilla (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_ID_OVERLAP_AVOIDABLE: 67
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 59
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 36
- ADJACENT_DAY_EXACT_REPEAT: 20

- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpin Streamer (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Muddler Minnow (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Bucktail Streamer (fly); Muddler Minnow (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Clouser Minnow (fly); Marabou Jig Leech (fly)
- wa_skagit_trout__2025-05-08__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Muddler Minnow (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-05-15__freshwater_river__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-07-12__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Jigged Marabou Leech (fly); Bucktail Streamer (fly)
- ca_lower_sac_trout__2025-07-24__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ar_white_river_trout__2025-07-28__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-08-12__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ca_lower_sac_trout__2025-08-16__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ar_white_river_trout__2025-08-21__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Jigged Marabou Leech (fly); Bucktail Streamer (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Hair Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-09-21__freshwater_river__dirty__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Casting Spoon (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- mt_madison_trout__2025-09-27__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Hair Jig (lure); Muddler Minnow (fly); Bucktail Streamer (fly)
- ca_lower_sac_trout__2025-09-15__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ar_white_river_trout__2025-09-18__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Rabbit-Strip Leech (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-10-04__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Marabou Jig Leech (fly)
- ny_upper_delaware_trout__2025-10-04__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Zonker Streamer (fly); Marabou Jig Leech (fly)
- mi_au_sable_trout__2025-10-20__freshwater_river__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Inline Spinner (lure); Blade Bait (lure); Sculpin Streamer (fly); Bucktail Streamer (fly)
- mi_au_sable_trout__2025-10-20__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- mi_au_sable_trout__2025-10-20__freshwater_river__dirty__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Casting Spoon (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- ar_white_river_trout__2025-12-12__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Blade Bait (lure); Casting Spoon (lure); Muddler Minnow (fly); Woolly Bugger (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Marabou Jig Leech (fly); Conehead Streamer (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Ned Rig (lure); Casting Spoon (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Hair Jig (lure); Casting Spoon (lure); Sculpzilla (fly); Articulated Baitfish (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Ned Rig (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- mi_au_sable_trout__2025-02-11__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Ned Rig (lure); Casting Spoon (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-02-20__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Bucktail Streamer (fly); Slim Baitfish Streamer (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- ar_white_river_trout__2025-03-18__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- wv_elk_river_trout__2025-03-26__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mi_au_sable_trout__2025-03-28__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Marabou Jig Leech (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Marabou Jig Leech (fly); Conehead Streamer (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Blade Bait (lure); Marabou Jig Leech (fly); Woolly Bugger (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Hair Jig (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- wv_elk_river_trout__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Inline Spinner (lure); Muddler Minnow (fly); Bucktail Streamer (fly)
- ar_white_river_trout__2025-04-12__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Hair Jig (lure); Muddler Minnow (fly); Bucktail Streamer (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Blade Bait (lure); Conehead Streamer (fly); Jigged Marabou Leech (fly)
- ny_upper_delaware_trout__2025-04-17__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- mi_au_sable_trout__2025-04-24__freshwater_river__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Suspending Jerkbait (lure); Blade Bait (lure); Clouser Minnow (fly); Slim Baitfish Streamer (fly)

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
| Apr | great_lakes_upper_midwest | warming:1 |
| Apr | northeast | cold_slow:1 |
| Apr | northern_california | cold_slow:1 |
| Apr | south_central | cold_slow:1 |
| May | great_lakes_upper_midwest | cold_slow:1 |
| May | mountain_west | cold_slow:1 |
| May | northeast | warming:1 |
| May | northern_california | cooling_or_shock:1 |
| May | pacific_northwest | cold_slow:1 |
| May | south_central | stable:1 |
| Jun | appalachian | stable:1 |
| Jun | mountain_west | stable:1 |
| Jun | northeast | stable:1 |
| Jun | northern_california | heat_limited:1 |
| Jun | pacific_northwest | stable:1 |
| Jun | south_central | stable:1 |
| Jul | great_lakes_upper_midwest | heat_limited:1 |
| Jul | mountain_west | stable:1 |
| Jul | northeast | heat_limited:1 |
| Jul | northern_california | heat_limited:1 |
| Jul | south_central | heat_limited:1 |
| Aug | great_lakes_upper_midwest | cooling_or_shock:1 |
| Aug | mountain_west | stable:1 |
| Aug | northeast | heat_limited:1 |
| Aug | northern_california | heat_limited:1 |
| Aug | pacific_northwest | cooling_or_shock:1 |
| Aug | south_central | heat_limited:1 |
| Sep | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
| Sep | mountain_west | cold_slow:1 |
| Sep | northeast | stable:1 |
| Sep | northern_california | heat_limited:1 |
| Sep | pacific_northwest | cooling_or_shock:1 |
| Sep | south_central | heat_limited:1 |
| Oct | great_lakes_upper_midwest | stable:1, cooling_or_shock:1 |
| Oct | mountain_west | cold_slow:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | pacific_northwest | cold_slow:1 |
| Oct | south_central | stable:1 |
| Nov | mountain_west | stable:1 |
| Nov | northeast | warming:1 |
| Nov | northern_california | stable:1 |
| Nov | pacific_northwest | stable:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |
| Dec | south_central | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear all_purpose A | 59.5-87.5F | Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear all_purpose B | 59.5-87.5F | Inline Spinner (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish A | 59.5-87.5F | Casting Spoon (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear big_fish B | 59.5-87.5F | Inline Spinner (medium); Bucktail Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained all_purpose A | 59.5-87.5F | Inline Spinner (medium); Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained all_purpose B | 59.5-87.5F | Suspending Jerkbait (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained big_fish A | 59.5-87.5F | Inline Spinner (medium); Bucktail Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained big_fish B | 59.5-87.5F | Suspending Jerkbait (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty all_purpose A | 59.5-87.5F | Inline Spinner (medium); Conehead Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty all_purpose B | 59.5-87.5F | Casting Spoon (medium); Zonker Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty big_fish A | 59.5-87.5F | Casting Spoon (medium); Bucktail Streamer (medium) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty big_fish B | 59.5-87.5F | Suspending Jerkbait (medium); Conehead Streamer (medium) |
| Upper Delaware trout river<br>2025-07-12 clear all_purpose B | 66.4-85.7F | Suspending Jerkbait (medium) |
| Upper Delaware trout river<br>2025-07-12 clear big_fish A | 66.4-85.7F | Suspending Jerkbait (medium) |
| Upper Delaware trout river<br>2025-07-12 clear big_fish B | 66.4-85.7F | Unweighted Baitfish (medium) |
| Upper Delaware trout river<br>2025-07-12 stained all_purpose B | 66.4-85.7F | Inline Spinner (medium) |
| Upper Delaware trout river<br>2025-07-12 stained big_fish B | 66.4-85.7F | Suspending Jerkbait (medium) |
| Upper Delaware trout river<br>2025-07-12 dirty all_purpose A | 66.4-85.7F | Casting Spoon (medium) |
| Upper Delaware trout river<br>2025-07-12 dirty all_purpose B | 66.4-85.7F | Inline Spinner (medium); Conehead Streamer (medium) |
| Upper Delaware trout river<br>2025-07-12 dirty big_fish B | 66.4-85.7F | Inline Spinner (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | bright | all_purpose | 1 | 56.3-78.6F | 3.1 |
| Aug | great_lakes_upper_midwest | open | bright | big_fish | 4 | 56.3-78.6F | 3.1 |
| Aug | mountain_west | open | mixed | all_purpose | 3 | 43.3-76.4F | 3.3 |
| Aug | mountain_west | open | mixed | big_fish | 5 | 43.3-76.4F | 3.3 |
| Aug | pacific_northwest | open | mixed | all_purpose | 2 | 57.1-79.6F | 4.2 |
| Aug | pacific_northwest | open | mixed | big_fish | 6 | 57.1-79.6F | 4.2 |
| Jul | mountain_west | caution | mixed | big_fish | 4 | 47.8-73.0F | 6.7 |
| Jun | mountain_west | open | mixed | all_purpose | 2 | 39.2-65.3F | 5.2 |
| Jun | mountain_west | open | mixed | big_fish | 5 | 39.2-65.3F | 5.2 |
| Jun | northeast | open | mixed | all_purpose | 1 | 58.2-80.4F | 4.4 |
| Jun | northeast | open | mixed | big_fish | 4 | 58.2-80.4F | 4.4 |
| Jun | pacific_northwest | open | low_light | all_purpose | 1 | 51.5-63.4F | 3.8 |
| Jun | pacific_northwest | open | low_light | big_fish | 6 | 51.5-63.4F | 3.8 |
| Jun | south_central | open | low_light | all_purpose | 1 | 73.6-84.9F | 3.8 |
| Jun | south_central | open | low_light | big_fish | 4 | 73.6-84.9F | 3.8 |
| May | northern_california | open | glare | all_purpose | 1 | 56.1-85.7F | 3.7 |
| May | northern_california | open | glare | big_fish | 5 | 56.1-85.7F | 3.7 |
| May | south_central | caution | low_light | big_fish | 4 | 62.6-80.4F | 6.5 |
| Sep | great_lakes_upper_midwest | caution | low_light | big_fish | 4 | 55.3-73.0F | 6.4 |
| Sep | mountain_west | open | bright | all_purpose | 1 | 36.3-64.9F | 5 |
| Sep | mountain_west | open | bright | big_fish | 3 | 36.3-64.9F | 5 |
| Sep | northeast | open | mixed | all_purpose | 1 | 51.9-74.6F | 3.6 |
| Sep | northeast | open | mixed | big_fish | 6 | 51.9-74.6F | 3.6 |
| Sep | pacific_northwest | open | low_light | all_purpose | 1 | 57.8-61.6F | 1.4 |
| Sep | pacific_northwest | open | low_light | big_fish | 4 | 57.8-61.6F | 1.4 |

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
| lure | 136 | 136 | 32 |
| fly | 0 | 0 | 0 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 132 | - |
| open-surface rows with 2+ surface picks | 18 | 18 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 1 | 1 |
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
| exact_id | truly_avoidable | 49 | 18 | 67 |
| exact_id | unavoidable_due_score_band | 41 | 0 | 41 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 59 | 0 | 59 |
| exact_id | unavoidable_due_goal_condition_fit | 12 | 0 | 12 |
| same_family_same_presentation | truly_avoidable | 0 | 36 | 36 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 19 | 19 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_different_presentation | truly_avoidable | 0 | 59 | 59 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 20 | 20 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 13 | 13 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear big_fish | fly honorable: same_family_different_presentation | Crawfish Streamer (210); Dungeon Streamer (164) | Sculpzilla (178); Articulated Baitfish (148) | Sculpin Streamer (206, alt edge 58) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained all_purpose | lure honorable: exact_id | Inline Spinner (216); Ned Rig (152) | Suspending Jerkbait (200); Ned Rig (152) | Casting Spoon (198, alt edge 46) |
| Madison River mountain-west trout water<br>2025-05-06 clear all_purpose | lure honorable: exact_id | Casting Spoon (184); Ned Rig (146) | Suspending Jerkbait (186); Ned Rig (146) | Inline Spinner (186, alt edge 40) |
| Madison River mountain-west trout water<br>2025-05-06 stained all_purpose | lure honorable: exact_id | Suspending Jerkbait (186); Ned Rig (146) | Casting Spoon (184); Ned Rig (146) | Inline Spinner (186, alt edge 40) |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear all_purpose | lure honorable: exact_id | Drop-Shot Minnow (204); Ned Rig (168) | Inline Spinner (202); Ned Rig (168) | Suspending Jerkbait (202, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Upper Delaware trout river<br>2025-01-18 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (178); Dungeon Streamer (164) | Sculpin Streamer (206); Articulated Baitfish (148) | Rabbit-Strip Leech (182, alt edge 34) |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Upper Delaware trout river<br>2025-01-18 stained big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Elk River Appalachian trout water<br>2025-02-20 clear big_fish | fly honorable: same_family_different_presentation | Sculpzilla (178); Dungeon Streamer (164) | Sculpin Streamer (206); Articulated Baitfish (148) | Rabbit-Strip Leech (182, alt edge 34) |
| Elk River Appalachian trout water<br>2025-02-20 dirty big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Elk River Appalachian trout water<br>2025-02-20 stained big_fish | fly honorable: same_family_different_presentation | Sculpzilla (186); Dungeon Streamer (172) | Sculpin Streamer (206); Articulated Baitfish (156) | Rabbit-Strip Leech (190, alt edge 34) |
| Au Sable / Upper Midwest trout river<br>2025-07-16 clear all_purpose | lure honorable: exact_id | Drop-Shot Minnow (204); Ned Rig (168) | Suspending Jerkbait (200); Ned Rig (168) | Inline Spinner (200, alt edge 32) |
| Au Sable / Upper Midwest trout river<br>2025-07-16 stained all_purpose | lure honorable: exact_id | Inline Spinner (200); Ned Rig (152) | Drop-Shot Minnow (188); Ned Rig (152) | Casting Spoon (182, alt edge 30) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-02-11 clear | A | 3/4 | Blade Bait; Suspending Jerkbait; Crawfish Streamer; Woolly Bugger | Blade Bait; Suspending Jerkbait; Crawfish Streamer; Dungeon Streamer |
| Elk River Appalachian trout water<br>2025-03-26 stained | B | 3/4 | Inline Spinner; Blade Bait; Conehead Streamer; Jigged Marabou Leech | Inline Spinner; Blade Bait; Conehead Streamer; Rabbit-Strip Leech |
| Upper Delaware trout river<br>2025-04-17 stained | A | 3/4 | Casting Spoon; Blade Bait; Sculpin Streamer; Bucktail Streamer | Casting Spoon; Blade Bait; Bucktail Streamer; Sculpzilla |
| Upper Delaware trout river<br>2025-04-17 stained | B | 3/4 | Inline Spinner; Blade Bait; Conehead Streamer; Jigged Marabou Leech | Inline Spinner; Blade Bait; Conehead Streamer; Rabbit-Strip Leech |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear | B | 3/4 | Inline Spinner; Ned Rig; Conehead Streamer; Unweighted Baitfish | Inline Spinner; Ned Rig; Bucktail Streamer; Unweighted Baitfish |
| Upper Delaware trout river<br>2025-07-12 stained | A | 3/4 | Drop-Shot Minnow; Ned Rig; Woolly Bugger; Rabbit-Strip Leech | Drop-Shot Minnow; Ned Rig; Rabbit-Strip Leech; Articulated Baitfish |
| White River Ozark trout tailwater<br>2025-08-21 stained | A | 3/4 | Drop-Shot Minnow; Ned Rig; Woolly Bugger; Rabbit-Strip Leech | Drop-Shot Minnow; Ned Rig; Rabbit-Strip Leech; Articulated Baitfish |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 clear | A | 3/4 | Drop-Shot Minnow; Ned Rig; Lead-Eye Leech; Slim Baitfish Streamer | Ned Rig; Drop-Shot Minnow; Rabbit-Strip Leech; Slim Baitfish Streamer |
| Madison River mountain-west trout water<br>2025-11-11 clear | A | 3/4 | Hair Jig; Suspending Jerkbait; Crawfish Streamer; Woolly Bugger | Hair Jig; Suspending Jerkbait; Crawfish Streamer; Articulated Baitfish |
| White River Ozark trout tailwater<br>2025-12-12 clear | A | 4/4 | Hair Jig; Suspending Jerkbait; Crawfish Streamer; Woolly Bugger | Hair Jig; Suspending Jerkbait; Crawfish Streamer; Woolly Bugger |
| White River Ozark trout tailwater<br>2025-12-12 stained | B | 3/4 | Blade Bait; Casting Spoon; Muddler Minnow; Woolly Bugger | Blade Bait; Casting Spoon; Sculpzilla; Woolly Bugger |
| Au Sable / Upper Midwest trout river<br>2025-12-12 clear | A | 3/4 | Hair Jig; Suspending Jerkbait; Crawfish Streamer; Woolly Bugger | Hair Jig; Suspending Jerkbait; Rabbit-Strip Leech; Woolly Bugger |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| White River Ozark trout tailwater<br>2025-01-16 stained B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-03-18 clear B | lure | Inline Spinner; Blade Bait |
| White River Ozark trout tailwater<br>2025-03-18 stained B | lure | Inline Spinner; Blade Bait |
| White River Ozark trout tailwater<br>2025-03-18 dirty B | lure | Inline Spinner; Blade Bait |
| Upper Delaware trout river<br>2025-03-30 clear B | fly | Bucktail Streamer; Marabou Jig Leech |
| Upper Delaware trout river<br>2025-03-30 stained B | fly | Zonker Streamer; Marabou Jig Leech |
| Upper Delaware trout river<br>2025-03-30 dirty B | fly | Bucktail Streamer; Marabou Jig Leech |
| Au Sable / Upper Midwest trout river<br>2025-03-28 clear B | lure | Inline Spinner; Suspending Jerkbait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 stained B | lure | Hair Jig; Suspending Jerkbait |
| Au Sable / Upper Midwest trout river<br>2025-03-28 dirty B | lure | Blade Bait; Inline Spinner |
| Elk River Appalachian trout water<br>2025-04-04 clear B | lure | Inline Spinner; Hair Jig |
| Elk River Appalachian trout water<br>2025-04-04 stained B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-04-12 dirty B | lure | Casting Spoon; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 clear B | lure | Inline Spinner; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 stained B | lure | Suspending Jerkbait; Hair Jig |
| Au Sable / Upper Midwest trout river<br>2025-04-24 dirty B | lure | Suspending Jerkbait; Drop-Shot Minnow |
| Lower Sacramento northern California trout tailwater<br>2025-04-27 dirty B | lure | Casting Spoon; Hair Jig |
| Madison River mountain-west trout water<br>2025-05-06 dirty B | lure | Inline Spinner; Hair Jig |
| Skagit River Pacific Northwest trout water<br>2025-05-08 stained B | lure | Casting Spoon; Ned Rig |
| Skagit River Pacific Northwest trout water<br>2025-05-08 dirty B | lure | Casting Spoon; Hair Jig |
| White River Ozark trout tailwater<br>2025-05-18 clear B | lure | Inline Spinner; Hair Jig |
| White River Ozark trout tailwater<br>2025-05-18 stained B | lure | Inline Spinner; Hair Jig |
| Upper Delaware trout river<br>2025-06-21 stained B | lure | Inline Spinner; Hair Jig |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear A | lure | Casting Spoon; Hair Jig |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear A | fly | Conehead Streamer; Lead-Eye Leech |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear B | lure | Inline Spinner; Ned Rig |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 clear B | fly | Bucktail Streamer; Unweighted Baitfish |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained A | lure | Inline Spinner; Casting Spoon |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained B | lure | Suspending Jerkbait; Inline Spinner |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 stained B | fly | Conehead Streamer; Baitfish Slider |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 dirty A | lure | Casting Spoon; Inline Spinner |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Hair Jig [lure] | 30 | Casting Spoon (16), Blade Bait (7), Suspending Jerkbait (4), Floating Trout Plug (3) | 36.1 |
| Inline Spinner [lure] | 26 | Casting Spoon (20), Blade Bait (5), Floating Trout Plug (1) | 13.2 |
| Casting Spoon [lure] | 12 | Suspending Jerkbait (5), Floating Trout Plug (4), Blade Bait (2), Hair Jig (1) | 16.7 |
| Ned Rig [lure] | 10 | Hair Jig (9), Suspending Jerkbait (1) | 16.8 |
| Drop-Shot Minnow [lure] | 9 | Hair Jig (6), Casting Spoon (2), Floating Trout Plug (1) | 4.4 |
| Suspending Jerkbait [lure] | 9 | Casting Spoon (6), Hair Jig (2), Floating Trout Plug (1) | 8.7 |
| Crawfish Streamer [fly] | 5 | Rabbit-Strip Leech (5) | 10.4 |
| Marabou Jig Leech [fly] | 5 | Sculpzilla (3), Articulated Baitfish (2) | 18.4 |
| Blade Bait [lure] | 4 | Casting Spoon (4) | 29 |
| Bucktail Streamer [fly] | 4 | Rabbit-Strip Leech (2), Sculpzilla (2) | 24 |
| Woolly Bugger [fly] | 4 | Rabbit-Strip Leech (3), Sculpzilla (1) | 25 |
| Conehead Streamer [fly] | 3 | Articulated Baitfish (3) | -4.7 |
| Baitfish Slider [fly] | 1 | Articulated Baitfish (1) | 18 |
| Sculpin Streamer [fly] | 1 | Sculpzilla (1) | 2 |
| Zonker Streamer [fly] | 1 | Sculpzilla (1) | 0 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-03-30 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (174; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Sculpzilla (180; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (188, alt edge 8) | goal fit likely competed |
| Upper Delaware trout river<br>2025-03-30 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (188; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish (182; condition_tag:runoff_streamer:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Bucktail Streamer (180, alt edge -8) | goal fit likely competed |
| Lower Sacramento northern California trout tailwater<br>2025-05-23 clear all_purpose B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Sculpin Streamer (172; goal:all_purpose:reliable_action:+18); Woolly Bugger (172; goal:all_purpose:reliable_action:+18) | Lead-Eye Leech (172, alt edge 0) | goal fit likely competed |
| Au Sable / Upper Midwest trout river<br>2025-10-19 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Sculpzilla (170; condition_tag:runoff_streamer:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Dungeon Streamer (176; condition_tag:runoff_streamer:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Bucktail Streamer (198, alt edge 22) | goal fit likely competed |
| White River Ozark trout tailwater<br>2025-10-14 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Articulated Baitfish (152; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (146; goal:big_fish:big_fish_upside:+20) | Slim Baitfish Streamer (146, alt edge -6) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 2 |
| current_open_water_acceptable | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Upper Delaware trout river<br>2025-03-30 big_fish clear A | warming_search<br>neutral | Casting Spoon 204<br>Blade Bait 194 |
| clear_subtle_wind_watch | Au Sable / Upper Midwest trout river<br>2025-10-19 big_fish clear A | stable_pleasant_high_confidence<br>neutral | Casting Spoon 214<br>Blade Bait 184 |
| current_open_water_acceptable | Upper Delaware trout river<br>2025-03-30 big_fish dirty A | dirty_vibration<br>neutral | Casting Spoon 196<br>Blade Bait 194 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 269 |
| acceptable_fit | 892 |
| strong_fit | 1575 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | fly | cold_slow_or_front | 38 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 37 |
| watch | big_fish | A | fly | cold_slow_or_front | 33 |
| watch | big_fish | A | fly | heat_limited_finesse | 20 |
| watch | big_fish | B | fly | dirty_vibration | 20 |
| watch | big_fish | B | fly | stable_pleasant_high_confidence | 19 |
| watch | big_fish | B | lure | warming_search | 16 |
| watch | all_purpose | B | fly | cold_slow_or_front | 13 |
| watch | big_fish | B | fly | heat_limited_finesse | 12 |
| watch | big_fish | B | lure | cold_slow_or_front | 12 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 11 |
| watch | big_fish | A | fly | stable_pleasant_high_confidence | 11 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 10 |
| watch | big_fish | B | fly | warming_search | 10 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 9 |
| watch | all_purpose | A | lure | heat_limited_finesse | 8 |
| watch | all_purpose | B | lure | cold_slow_or_front | 8 |
| watch | big_fish | B | lure | heat_limited_finesse | 8 |
| watch | big_fish | A | fly | dirty_vibration | 7 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 7 |
| watch | big_fish | A | lure | stable_pleasant_high_confidence | 7 |
| watch | big_fish | B | lure | stable_pleasant_high_confidence | 7 |
| watch | big_fish | A | lure | cold_slow_or_front | 6 |
| watch | big_fish | B | lure | unclassified | 6 |
| watch | all_purpose | A | lure | stable_pleasant_high_confidence | 5 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 5 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 5 |
| watch | all_purpose | A | fly | stable_pleasant_high_confidence | 4 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 4 |
| watch | big_fish | B | fly | calm_low_light_surface | 4 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 3 |
| watch | all_purpose | A | lure | cold_slow_or_front | 3 |
| watch | all_purpose | B | lure | stable_pleasant_high_confidence | 3 |
| watch | big_fish | A | fly | warming_search | 3 |
| watch | all_purpose | A | fly | heat_limited_finesse | 2 |
| watch | all_purpose | B | fly | stable_pleasant_high_confidence | 2 |
| watch | big_fish | A | lure | dirty_vibration | 2 |
| watch | big_fish | A | lure | heat_limited_finesse | 2 |
| watch | big_fish | A | lure | unclassified | 2 |
| watch | big_fish | A | lure | warming_search | 2 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 2 |
| watch | big_fish | B | lure | dirty_vibration | 2 |
| watch | all_purpose | A | fly | warming_search | 1 |
| watch | all_purpose | A | lure | calm_low_light_surface | 1 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | B | fly | dirty_vibration | 1 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | A | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | calm_low_light_surface | 1 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 94 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 68 |
| acceptable_fit | big_fish | A | lure | heat_limited_finesse | 51 |
| acceptable_fit | big_fish | B | lure | heat_limited_finesse | 51 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 48 |
| acceptable_fit | big_fish | B | fly | heat_limited_finesse | 48 |
| acceptable_fit | all_purpose | B | fly | heat_limited_finesse | 46 |
| acceptable_fit | big_fish | B | fly | river_elevated_runoff_current | 36 |
| acceptable_fit | big_fish | A | fly | heat_limited_finesse | 34 |
| acceptable_fit | all_purpose | A | fly | heat_limited_finesse | 32 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_high_confidence | 32 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_high_confidence | 32 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_high_confidence | 31 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_high_confidence | 31 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 29 |
| acceptable_fit | all_purpose | B | lure | river_elevated_runoff_current | 27 |
| acceptable_fit | big_fish | B | fly | warming_search | 26 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_high_confidence | 24 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_high_confidence | 24 |
| acceptable_fit | all_purpose | B | lure | heat_limited_finesse | 21 |
| acceptable_fit | big_fish | B | lure | warming_search | 21 |
| acceptable_fit | big_fish | A | lure | river_elevated_runoff_current | 20 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_high_confidence | 19 |
| acceptable_fit | all_purpose | B | lure | warming_search | 19 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 17 |
| acceptable_fit | big_fish | A | lure | warming_search | 17 |
| acceptable_fit | all_purpose | A | lure | warming_search | 16 |
| acceptable_fit | big_fish | A | fly | warming_search | 16 |
| acceptable_fit | all_purpose | A | fly | warming_search | 14 |
| acceptable_fit | big_fish | A | fly | cold_slow_or_front | 14 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 15 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 10 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Casting Spoon (lure_of_the_day, lure, score 240) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Casting Spoon (lure_of_the_day, lure, score 240) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Casting Spoon (lure_of_the_day, lure, score 240) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Casting Spoon (lure_of_the_day, lure, score 240) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 dirty all_purpose A | Casting Spoon (lure_of_the_day, lure, score 232) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 dirty all_purpose A | Casting Spoon (lure_of_the_day, lure, score 232) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 dirty all_purpose A | Casting Spoon (lure_of_the_day, lure, score 232) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-03-30 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 220) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 220) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 220) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Sculpin Streamer (fly_of_the_day, fly, score 220) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Au Sable / Upper Midwest trout river<br>2025-05-23 stained all_purpose B | Suspending Jerkbait (lure_of_the_day, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose A | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 clear all_purpose B | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose A | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-04-17 stained all_purpose B | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose A | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Elk River Appalachian trout water<br>2025-03-26 stained all_purpose B | Blade Bait (honorable_lure, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Upper Delaware trout river<br>2025-03-30 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+runoff_streamer+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 384 | 190 | 49% |
| clear_subtle | 576 | 291 | 51% |
| dirty_vibration | 960 | 0 | 0% |
| heat_finesse | 480 | 123 | 26% |
| cold_slow | 816 | 593 | 73% |
| low_light_surface | 240 | 28 | 12% |
| calm_surface | 528 | 85 | 16% |
| Trout dirty/runoff/current fit | 1392 | 1278 | 92% |
| Big Fish upside | 1368 | 911 | 67% |
| All Purpose reliable/versatile | 1368 | 1353 | 99% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Casting Spoon [lure] (260), Suspending Jerkbait [lure] (228), Inline Spinner [lure] (223), Blade Bait [lure] (215), Hair Jig [lure] (177), Rabbit-Strip Leech [fly] (157), Articulated Baitfish [fly] (148), Woolly Bugger [fly] (144), Sculpin Streamer [fly] (143), Sculpzilla [fly] (139), Dungeon Streamer [fly] (115), Drop-Shot Minnow [lure] (99) |
| All-purpose | Inline Spinner [lure] (144), Woolly Bugger [fly] (134), Sculpin Streamer [fly] (130), Suspending Jerkbait [lure] (127), Blade Bait [lure] (121), Casting Spoon [lure] (115), Bucktail Streamer [fly] (83), Hair Jig [lure] (58) |
| Big-fish | Rabbit-Strip Leech [fly] (146), Casting Spoon [lure] (145), Articulated Baitfish [fly] (142), Sculpzilla [fly] (139), Hair Jig [lure] (119), Dungeon Streamer [fly] (115), Suspending Jerkbait [lure] (101), Blade Bait [lure] (94) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 8 | 8 | 0 | 0 | 6 |
| fly | 19 | 19 | 0 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | 260/684 | 38% | big_fish:145, all_purpose:115 | A:148, B:112 | top:151, honorable:109 | dirty:103, stained:88, clear:69 | freshwater_river:260 | current_swing:164, runoff_streamer:164, dirty_vibration:125, cold_slow:90 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228/684 | 33.3% | all_purpose:127, big_fish:101 | B:131, A:97 | top:150, honorable:78 | clear:95, dirty:72, stained:61 | freshwater_river:228 | cold_slow:87, current_swing:82, runoff_streamer:82, clear_subtle:70 |
| Inline Spinner<br>inline_spinner | lure | 223/684 | 32.6% | all_purpose:144, big_fish:79 | B:132, A:91 | top:161, honorable:62 | dirty:90, stained:86, clear:47 | freshwater_river:223 | current_swing:141, runoff_streamer:141, dirty_vibration:117, calm_surface:41 |
| Blade Bait<br>blade_bait | lure | 215/324 | 66.4% | all_purpose:121, big_fish:94 | A:123, B:92 | honorable:142, top:73 | dirty:86, stained:68, clear:61 | freshwater_river:215 | current_swing:139, runoff_streamer:139, dirty_vibration:112, cold_slow:95 |
| Hair Jig<br>hair_jig | lure | 177/684 | 25.9% | big_fish:119, all_purpose:58 | B:95, A:82 | honorable:131, top:46 | clear:91, stained:55, dirty:31 | freshwater_river:177 | clear_subtle:70, cold_slow:68, current_swing:61, runoff_streamer:61 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 157/684 | 23% | big_fish:146, all_purpose:11 | A:96, B:61 | top:89, honorable:68 | stained:59, dirty:52, clear:46 | freshwater_river:157 | current_swing:58, runoff_streamer:58, dirty_vibration:46, cold_slow:41 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 148/684 | 21.6% | big_fish:142, all_purpose:6 | B:92, A:56 | honorable:92, top:56 | dirty:53, stained:51, clear:44 | freshwater_river:148 | current_swing:71, runoff_streamer:71, dirty_vibration:48, cold_slow:36 |
| Woolly Bugger<br>woolly_bugger | fly | 144/684 | 21.1% | all_purpose:134, big_fish:10 | A:84, B:60 | honorable:117, top:27 | clear:54, dirty:45, stained:45 | freshwater_river:144 | current_swing:65, runoff_streamer:65, cold_slow:63, dirty_vibration:44 |
| Sculpin Streamer<br>sculpin_streamer | fly | 143/684 | 20.9% | all_purpose:130, big_fish:13 | A:101, B:42 | top:125, honorable:18 | dirty:53, clear:50, stained:40 | freshwater_river:143 | current_swing:90, runoff_streamer:90, dirty_vibration:63, cold_slow:60 |
| Sculpzilla<br>sculpzilla | fly | 139/684 | 20.3% | big_fish:139 | B:70, A:69 | top:98, honorable:41 | dirty:54, stained:52, clear:33 | freshwater_river:139 | current_swing:81, runoff_streamer:81, dirty_vibration:56, cold_slow:39 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/552 | 20.8% | big_fish:115 | A:85, B:30 | honorable:84, top:31 | dirty:41, stained:38, clear:36 | freshwater_river:115 | current_swing:67, runoff_streamer:67, dirty_vibration:45, cold_slow:42 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 99/528 | 18.8% | all_purpose:52, big_fish:47 | A:57, B:42 | top:60, honorable:39 | clear:41, dirty:36, stained:22 | freshwater_river:99 | heat_finesse:60, clear_subtle:41, calm_surface:23, current_swing:10 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 96/684 | 14% | all_purpose:83, big_fish:13 | B:50, A:46 | honorable:67, top:29 | stained:42, dirty:32, clear:22 | freshwater_river:96 | current_swing:52, runoff_streamer:52, dirty_vibration:45, cold_slow:32 |
| Ned Rig<br>ned_rig | lure | 89/684 | 13% | all_purpose:52, big_fish:37 | B:50, A:39 | honorable:80, top:9 | stained:45, clear:34, dirty:10 | freshwater_river:89 | heat_finesse:63, clear_subtle:26, cold_slow:25, current_swing:23 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77/192 | 40.1% | big_fish:62, all_purpose:15 | A:47, B:30 | honorable:43, top:34 | stained:31, dirty:28, clear:18 | freshwater_river:77 | calm_surface:67, current_swing:28, runoff_streamer:28, low_light_surface:25 |
| Conehead Streamer<br>conehead_streamer | fly | 67/684 | 9.8% | all_purpose:52, big_fish:15 | B:54, A:13 | top:49, honorable:18 | dirty:26, stained:24, clear:17 | freshwater_river:67 | current_swing:44, runoff_streamer:44, dirty_vibration:40, open_water_search:35 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 52/684 | 7.6% | all_purpose:52 | B:39, A:13 | honorable:39, top:13 | dirty:25, stained:21, clear:6 | freshwater_river:52 | current_swing:34, runoff_streamer:34, dirty_vibration:32, open_water_search:11 |
| Muddler Minnow<br>muddler_sculpin | fly | 51/684 | 7.5% | all_purpose:49, big_fish:2 | B:44, A:7 | top:46, honorable:5 | clear:31, stained:14, dirty:6 | freshwater_river:51 | cold_slow:28, clear_subtle:25, current_swing:22, runoff_streamer:22 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 51/528 | 9.7% | all_purpose:35, big_fish:16 | A:33, B:18 | honorable:41, top:10 | clear:45, dirty:3, stained:3 | freshwater_river:51 | clear_subtle:43, calm_surface:17, heat_finesse:16, current_swing:10 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 40/312 | 12.8% | all_purpose:25, big_fish:15 | B:26, A:14 | honorable:34, top:6 | dirty:24, stained:15, clear:1 | freshwater_river:40 | heat_finesse:24, calm_surface:12, dirty_vibration:4, none:4 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 31/684 | 4.5% | all_purpose:23, big_fish:8 | B:26, A:5 | top:16, honorable:15 | stained:13, dirty:10, clear:8 | freshwater_river:31 | warming_search:25, current_swing:21, runoff_streamer:21, dirty_vibration:14 |
| Zonker Streamer<br>zonker_streamer | fly | 30/684 | 4.4% | all_purpose:23, big_fish:7 | B:16, A:14 | top:22, honorable:8 | dirty:12, stained:11, clear:7 | freshwater_river:30 | current_swing:17, dirty_vibration:17, open_water_search:17, runoff_streamer:17 |
| Crawfish Streamer<br>crawfish_streamer | fly | 27/84 | 32.1% | all_purpose:18, big_fish:9 | B:15, A:12 | top:27 | clear:12, dirty:8, stained:7 | freshwater_river:27 | cold_slow:25, current_swing:10, dirty_vibration:10, runoff_streamer:10 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 24/528 | 4.5% | big_fish:13, all_purpose:11 | B:20, A:4 | honorable:14, top:10 | clear:16, stained:6, dirty:2 | freshwater_river:24 | clear_subtle:15, heat_finesse:11, calm_surface:7, open_water_search:7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 22/684 | 3.2% | all_purpose:21, big_fish:1 | A:15, B:7 | top:17, honorable:5 | clear:20, dirty:1, stained:1 | freshwater_river:22 | clear_subtle:20, heat_finesse:10, calm_surface:6, warming_search:3 |
| Mouse Pattern<br>mouse_fly | fly | 20/108 | 18.5% | big_fish:20 | A:12, B:8 | honorable:13, top:7 | stained:8, clear:7, dirty:5 | freshwater_river:20 | calm_surface:18, clear_subtle:6, current_swing:6, runoff_streamer:6 |
| Clouser Minnow<br>clouser_minnow | fly | 11/684 | 1.6% | all_purpose:11 | B:6, A:5 | top:6, honorable:5 | stained:6, dirty:4, clear:1 | freshwater_river:11 | calm_surface:5, warming_search:4, low_light_surface:2, none:2 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | 260/2736 (9.5%) | 151/1368 (11%) | 109/1368 (8%) | 260/1368 (19%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228/2736 (8.3%) | 150/1368 (11%) | 78/1368 (5.7%) | 228/1368 (16.7%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 223/2736 (8.2%) | 161/1368 (11.8%) | 62/1368 (4.5%) | 223/1368 (16.3%) | - |  |
| Blade Bait<br>blade_bait | lure | 215/2736 (7.9%) | 73/1368 (5.3%) | 142/1368 (10.4%) | 215/1368 (15.7%) | - |  |
| Hair Jig<br>hair_jig | lure | 177/2736 (6.5%) | 46/1368 (3.4%) | 131/1368 (9.6%) | 177/1368 (12.9%) | - |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 157/2736 (5.7%) | 89/1368 (6.5%) | 68/1368 (5%) | - | 157/1368 (11.5%) |  |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 148/2736 (5.4%) | 56/1368 (4.1%) | 92/1368 (6.7%) | - | 148/1368 (10.8%) |  |
| Woolly Bugger<br>woolly_bugger | fly | 144/2736 (5.3%) | 27/1368 (2%) | 117/1368 (8.6%) | - | 144/1368 (10.5%) |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 143/2736 (5.2%) | 125/1368 (9.1%) | 18/1368 (1.3%) | - | 143/1368 (10.5%) |  |
| Sculpzilla<br>sculpzilla | fly | 139/2736 (5.1%) | 98/1368 (7.2%) | 41/1368 (3%) | - | 139/1368 (10.2%) |  |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/2736 (4.2%) | 31/1368 (2.3%) | 84/1368 (6.1%) | - | 115/1368 (8.4%) |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 99/2736 (3.6%) | 60/1368 (4.4%) | 39/1368 (2.9%) | 99/1368 (7.2%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 96/2736 (3.5%) | 29/1368 (2.1%) | 67/1368 (4.9%) | - | 96/1368 (7%) |  |
| Ned Rig<br>ned_rig | lure | 89/2736 (3.3%) | 9/1368 (0.7%) | 80/1368 (5.8%) | 89/1368 (6.5%) | - |  |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77/2736 (2.8%) | 34/1368 (2.5%) | 43/1368 (3.1%) | 77/1368 (5.6%) | - |  |
| Conehead Streamer<br>conehead_streamer | fly | 67/2736 (2.4%) | 49/1368 (3.6%) | 18/1368 (1.3%) | - | 67/1368 (4.9%) |  |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 52/2736 (1.9%) | 13/1368 (1%) | 39/1368 (2.9%) | - | 52/1368 (3.8%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 51/2736 (1.9%) | 46/1368 (3.4%) | 5/1368 (0.4%) | - | 51/1368 (3.7%) |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 51/2736 (1.9%) | 10/1368 (0.7%) | 41/1368 (3%) | - | 51/1368 (3.7%) |  |
| Baitfish Slider<br>baitfish_slider_fly | fly | 40/2736 (1.5%) | 6/1368 (0.4%) | 34/1368 (2.5%) | - | 40/1368 (2.9%) |  |
| Marabou Jig Leech<br>feather_jig_leech | fly | 31/2736 (1.1%) | 16/1368 (1.2%) | 15/1368 (1.1%) | - | 31/1368 (2.3%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 30/2736 (1.1%) | 22/1368 (1.6%) | 8/1368 (0.6%) | - | 30/1368 (2.2%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 27/2736 (1%) | 27/1368 (2%) | 0/1368 (0%) | - | 27/1368 (2%) |  |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 24/2736 (0.9%) | 10/1368 (0.7%) | 14/1368 (1%) | - | 24/1368 (1.8%) |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 22/2736 (0.8%) | 17/1368 (1.2%) | 5/1368 (0.4%) | - | 22/1368 (1.6%) |  |
| Mouse Pattern<br>mouse_fly | fly | 20/2736 (0.7%) | 7/1368 (0.5%) | 13/1368 (1%) | - | 20/1368 (1.5%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 11/2736 (0.4%) | 6/1368 (0.4%) | 5/1368 (0.4%) | - | 11/1368 (0.8%) |  |

## Per-Profile Usage Audit

| Profile | Gear | Selected | All-slot share | Side-slot share | All-purpose side share | Big-fish side share | Top/HM | Available rows | Finalist/repair opp | Selected/opportunity | Goal | Surface gate | Activity | Wind | Bucket | Clarity | Month/season | Condition tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 157 | 157/2736 (5.7%) | 157/1368 (11.5%) | 11/684 (1.6%) | 146/684 (21.3%) | 89/68 | 684/684 (100%) | 405 | 38.8% | big_fish:146, all_purpose:11 | closed:113, open:29, caution:15 | neutral:142, suppressed:12, active:3 | calm:93, slight:44, breezy:20 | cold_slow_or_front:38, heat_limited_finesse:32, stable_pleasant_high_confidence:23, dirty_vibration:22, warming_search:14 | stained:59, dirty:52, clear:46 | Sep:21, Oct:20, Aug:19, May:18<br>summer:53, fall:52, spring:42, winter:10 | current_swing:58, runoff_streamer:58, dirty_vibration:46, cold_slow:41, heat_finesse:36, clear_subtle:30 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 148 | 148/2736 (5.4%) | 148/1368 (10.8%) | 6/684 (0.9%) | 142/684 (20.8%) | 56/92 | 684/684 (100%) | 446 | 33.2% | big_fish:142, all_purpose:6 | closed:100, open:32, caution:16 | neutral:129, suppressed:15, active:4 | calm:89, slight:48, breezy:11 | cold_slow_or_front:38, dirty_vibration:24, heat_limited_finesse:22, stable_pleasant_high_confidence:22, warming_search:19 | dirty:53, stained:51, clear:44 | Sep:20, Oct:19, Aug:18, Jul:15<br>fall:52, summer:47, spring:35, winter:14 | current_swing:71, runoff_streamer:71, dirty_vibration:48, cold_slow:36, calm_surface:32, clear_subtle:28 |
| Woolly Bugger<br>woolly_bugger | fly | 144 | 144/2736 (5.3%) | 144/1368 (10.5%) | 134/684 (19.6%) | 10/684 (1.5%) | 27/117 | 684/684 (100%) | 589 | 24.4% | all_purpose:134, big_fish:10 | closed:108, open:27, caution:9 | neutral:126, suppressed:17, active:1 | calm:92, slight:39, breezy:13 | cold_slow_or_front:57, heat_limited_finesse:24, dirty_vibration:21, stable_pleasant_high_confidence:16, calm_bright_clear_subtle:9 | clear:54, dirty:45, stained:45 | Dec:22, Aug:19, Sep:18, Oct:14<br>summer:41, winter:41, fall:40, spring:22 | current_swing:65, runoff_streamer:65, cold_slow:63, dirty_vibration:44, clear_subtle:38, heat_finesse:28 |
| Sculpin Streamer<br>sculpin_streamer | fly | 143 | 143/2736 (5.2%) | 143/1368 (10.5%) | 130/684 (19%) | 13/684 (1.9%) | 125/18 | 684/684 (100%) | 560 | 25.5% | all_purpose:130, big_fish:13 | closed:106, open:25, caution:12 | neutral:124, suppressed:18, active:1 | calm:72, slight:44, breezy:27 | cold_slow_or_front:48, dirty_vibration:30, stable_pleasant_high_confidence:15, heat_limited_finesse:14, warming_search:12 | dirty:53, clear:50, stained:40 | Sep:18, Oct:17, May:16, Apr:13<br>fall:46, spring:37, summer:32, winter:28 | current_swing:90, runoff_streamer:90, dirty_vibration:63, cold_slow:60, clear_subtle:29, calm_surface:25 |
| Sculpzilla<br>sculpzilla | fly | 139 | 139/2736 (5.1%) | 139/1368 (10.2%) | 0/684 (0%) | 139/684 (20.3%) | 98/41 | 684/684 (100%) | 300 | 46.3% | big_fish:139 | closed:100, open:24, caution:15 | neutral:121, suppressed:15, active:3 | calm:72, slight:43, breezy:24 | cold_slow_or_front:37, dirty_vibration:26, heat_limited_finesse:19, warming_search:17, stable_pleasant_high_confidence:15 | dirty:54, stained:52, clear:33 | Oct:18, May:16, Sep:16, Apr:13<br>fall:45, spring:41, summer:39, winter:14 | current_swing:81, runoff_streamer:81, dirty_vibration:56, cold_slow:39, calm_surface:24, warming_search:23 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115 | 115/2736 (4.2%) | 115/1368 (8.4%) | 0/684 (0%) | 115/684 (16.8%) | 31/84 | 552/684 (80.7%) | 267 | 43.1% | big_fish:115 | closed:82, open:21, caution:12 | neutral:97, suppressed:15, active:3 | calm:56, slight:44, breezy:15 | cold_slow_or_front:35, dirty_vibration:22, stable_pleasant_high_confidence:16, warming_search:16, calm_low_light_surface:9 | dirty:41, stained:38, clear:36 | Oct:18, Sep:18, May:17, Jun:15<br>fall:47, spring:35, winter:18, summer:15 | current_swing:67, runoff_streamer:67, dirty_vibration:45, cold_slow:42, calm_surface:21, clear_subtle:20 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 96 | 96/2736 (3.5%) | 96/1368 (7%) | 83/684 (12.1%) | 13/684 (1.9%) | 29/67 | 684/684 (100%) | 464 | 20.7% | all_purpose:83, big_fish:13 | closed:81, open:8, caution:7 | neutral:86, suppressed:9, active:1 | calm:39, breezy:29, slight:28 | cold_slow_or_front:24, dirty_vibration:20, heat_limited_finesse:14, warming_search:13, breezy_windy_stained_reaction:10 | stained:42, dirty:32, clear:22 | Oct:14, Apr:11, Mar:11, Nov:11<br>fall:35, spring:32, summer:20, winter:9 | current_swing:52, runoff_streamer:52, dirty_vibration:45, cold_slow:32, wind_reaction:26, open_water_search:20 |
| Conehead Streamer<br>conehead_streamer | fly | 67 | 67/2736 (2.4%) | 67/1368 (4.9%) | 52/684 (7.6%) | 15/684 (2.2%) | 49/18 | 684/684 (100%) | 479 | 14% | all_purpose:52, big_fish:15 | closed:56, caution:6, open:5 | neutral:65, suppressed:2 | breezy:35, calm:16, slight:16 | dirty_vibration:17, breezy_windy_stained_reaction:14, cold_slow_or_front:13, heat_limited_finesse:9, warming_search:7 | dirty:26, stained:24, clear:17 | Mar:15, Jun:9, Oct:9, May:7<br>spring:28, fall:20, summer:17, winter:2 | current_swing:44, runoff_streamer:44, dirty_vibration:40, open_water_search:35, wind_reaction:35, cold_slow:14 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 52 | 52/2736 (1.9%) | 52/1368 (3.8%) | 52/684 (7.6%) | 0/684 (0%) | 13/39 | 684/684 (100%) | 350 | 14.9% | all_purpose:52 | closed:30, caution:12, open:10 | neutral:46, suppressed:5, active:1 | calm:22, slight:18, breezy:12 | dirty_vibration:18, heat_limited_finesse:8, breezy_windy_stained_reaction:5, calm_low_light_surface:5, river_elevated_runoff_current:5 | dirty:25, stained:21, clear:6 | Jun:9, Sep:8, May:7, Oct:7<br>summer:19, fall:18, spring:15 | current_swing:34, runoff_streamer:34, dirty_vibration:32, open_water_search:11, wind_reaction:11, calm_surface:10 |
| Muddler Minnow<br>muddler_sculpin | fly | 51 | 51/2736 (1.9%) | 51/1368 (3.7%) | 49/684 (7.2%) | 2/684 (0.3%) | 46/5 | 684/684 (100%) | 453 | 11.3% | all_purpose:49, big_fish:2 | closed:42, open:9 | neutral:44, suppressed:7 | calm:37, slight:9, breezy:5 | cold_slow_or_front:26, stable_pleasant_high_confidence:8, calm_bright_clear_subtle:7, heat_limited_finesse:4, calm_low_light_surface:3 | clear:31, stained:14, dirty:6 | Oct:11, Apr:8, May:7, Nov:5<br>fall:20, spring:17, summer:10, winter:4 | cold_slow:28, clear_subtle:25, current_swing:22, runoff_streamer:22, calm_surface:9, dirty_vibration:6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 51 | 51/2736 (1.9%) | 51/1368 (3.7%) | 35/684 (5.1%) | 16/684 (2.3%) | 10/41 | 528/684 (77.2%) | 150 | 34% | all_purpose:35, big_fish:16 | closed:31, open:17, caution:3 | neutral:48, suppressed:2, active:1 | calm:43, slight:7, breezy:1 | calm_bright_clear_subtle:14, heat_limited_finesse:12, cold_slow_or_front:10, stable_pleasant_high_confidence:8, calm_low_light_surface:3 | clear:45, dirty:3, stained:3 | Aug:13, Sep:9, Jul:7, Oct:7<br>summer:25, fall:16, spring:10 | clear_subtle:43, calm_surface:17, heat_finesse:16, current_swing:10, runoff_streamer:10, cold_slow:7 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 40 | 40/2736 (1.5%) | 40/1368 (2.9%) | 25/684 (3.7%) | 15/684 (2.2%) | 6/34 | 312/684 (45.6%) | 82 | 48.8% | all_purpose:25, big_fish:15 | closed:24, open:12, caution:4 | neutral:40 | calm:31, slight:5, breezy:4 | heat_limited_finesse:20, stable_pleasant_high_confidence:6, cold_slow_or_front:4, unclassified:4, breezy_windy_stained_reaction:2 | dirty:24, stained:15, clear:1 | Aug:13, Jul:13, Jun:8, Sep:4<br>summer:34, fall:4, spring:2 | heat_finesse:24, calm_surface:12, dirty_vibration:4, none:4, open_water_search:4, wind_reaction:4 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 31 | 31/2736 (1.1%) | 31/1368 (2.3%) | 23/684 (3.4%) | 8/684 (1.2%) | 16/15 | 684/684 (100%) | 211 | 14.7% | all_purpose:23, big_fish:8 | closed:29, caution:1, open:1 | neutral:28, active:3 | slight:16, breezy:9, calm:6 | warming_search:17, dirty_vibration:7, breezy_windy_stained_reaction:3, stable_pleasant_high_confidence:3, unclassified:1 | stained:13, dirty:10, clear:8 | Mar:8, Apr:6, Nov:5, Oct:5<br>spring:16, fall:11, winter:3, summer:1 | warming_search:25, current_swing:21, runoff_streamer:21, dirty_vibration:14, open_water_search:9, wind_reaction:9 |
| Zonker Streamer<br>zonker_streamer | fly | 30 | 30/2736 (1.1%) | 30/1368 (2.2%) | 23/684 (3.4%) | 7/684 (1%) | 22/8 | 684/684 (100%) | 432 | 6.9% | all_purpose:23, big_fish:7 | closed:18, open:8, caution:4 | neutral:30 | breezy:17, calm:9, slight:4 | dirty_vibration:7, breezy_windy_stained_reaction:6, cold_slow_or_front:5, stable_pleasant_high_confidence:4, calm_low_light_surface:2 | dirty:12, stained:11, clear:7 | Jun:9, Mar:9, May:5, Oct:3<br>spring:15, summer:11, fall:4 | current_swing:17, dirty_vibration:17, open_water_search:17, runoff_streamer:17, wind_reaction:17, calm_surface:8 |
| Crawfish Streamer<br>crawfish_streamer | fly | 27 | 27/2736 (1%) | 27/1368 (2%) | 18/684 (2.6%) | 9/684 (1.3%) | 27/0 | 84/684 (12.3%) | 107 | 25.2% | all_purpose:18, big_fish:9 | closed:27 | neutral:24, suppressed:3 | breezy:9, calm:9, slight:9 | cold_slow_or_front:18, dirty_vibration:5, breezy_windy_stained_reaction:2, stable_pleasant_high_confidence:2 | clear:12, dirty:8, stained:7 | Dec:15, Feb:7, Jan:3, Nov:2<br>winter:25, fall:2 | cold_slow:25, current_swing:10, dirty_vibration:10, runoff_streamer:10, clear_subtle:6, wind_reaction:6 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 24 | 24/2736 (0.9%) | 24/1368 (1.8%) | 11/684 (1.6%) | 13/684 (1.9%) | 10/14 | 528/684 (77.2%) | 136 | 17.6% | big_fish:13, all_purpose:11 | closed:17, open:7 | neutral:23, active:1 | calm:15, breezy:7, slight:2 | heat_limited_finesse:7, calm_bright_clear_subtle:4, cold_slow_or_front:4, breezy_windy_stained_reaction:2, calm_low_light_surface:2 | clear:16, stained:6, dirty:2 | Jun:7, Aug:4, Jul:3, Mar:3<br>summer:14, spring:7, fall:3 | clear_subtle:15, heat_finesse:11, calm_surface:7, open_water_search:7, wind_reaction:7, dirty_vibration:4 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 22 | 22/2736 (0.8%) | 22/1368 (1.6%) | 21/684 (3.1%) | 1/684 (0.1%) | 17/5 | 684/684 (100%) | 256 | 8.6% | all_purpose:21, big_fish:1 | closed:16, open:6 | neutral:22 | calm:19, breezy:2, slight:1 | heat_limited_finesse:8, calm_bright_clear_subtle:6, stable_pleasant_high_confidence:3, cold_slow_or_front:2, warming_search:2 | clear:20, dirty:1, stained:1 | Aug:5, Jun:4, Oct:4, Jul:3<br>summer:12, fall:7, spring:3 | clear_subtle:20, heat_finesse:10, calm_surface:6, warming_search:3, cold_slow:2, open_water_search:2 |
| Mouse Pattern<br>mouse_fly | fly | 20 | 20/2736 (0.7%) | 20/1368 (1.5%) | 0/684 (0%) | 20/684 (2.9%) | 7/13 | 108/684 (15.8%) | 41 | 48.8% | big_fish:20 | open:18, caution:2 | neutral:20 | calm:18, slight:2 | cold_slow_or_front:6, stable_pleasant_high_confidence:6, calm_low_light_surface:3, calm_bright_clear_subtle:2, unclassified:2 | stained:8, clear:7, dirty:5 | Aug:10, Sep:8, Jul:2<br>summer:12, fall:8 | calm_surface:18, clear_subtle:6, current_swing:6, runoff_streamer:6, dirty_vibration:4, cold_slow:3 |
| Clouser Minnow<br>clouser_minnow | fly | 11 | 11/2736 (0.4%) | 11/1368 (0.8%) | 11/684 (1.6%) | 0/684 (0%) | 6/5 | 684/684 (100%) | 151 | 7.3% | all_purpose:11 | open:5, closed:4, caution:2 | neutral:9, active:2 | calm:6, slight:5 | warming_search:4, stable_pleasant_high_confidence:3, calm_low_light_surface:2, unclassified:2 | stained:6, dirty:4, clear:1 | Jun:3, Apr:2, Jul:2, Aug:1<br>summer:6, spring:3, fall:2 | calm_surface:5, warming_search:4, low_light_surface:2, none:2 |
| Casting Spoon<br>casting_spoon | lure | 260 | 260/2736 (9.5%) | 260/1368 (19%) | 115/684 (16.8%) | 145/684 (21.2%) | 151/109 | 684/684 (100%) | 701 | 37.1% | big_fish:145, all_purpose:115 | closed:184, open:40, caution:36 | neutral:231, suppressed:23, active:6 | calm:109, slight:91, breezy:60 | cold_slow_or_front:73, dirty_vibration:60, warming_search:32, stable_pleasant_high_confidence:20, heat_limited_finesse:18 | dirty:103, stained:88, clear:69 | May:38, Jun:30, Sep:30, Oct:29<br>spring:87, fall:75, summer:61, winter:37 | current_swing:164, runoff_streamer:164, dirty_vibration:125, cold_slow:90, wind_reaction:51, open_water_search:46 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228 | 228/2736 (8.3%) | 228/1368 (16.7%) | 127/684 (18.6%) | 101/684 (14.8%) | 150/78 | 684/684 (100%) | 756 | 30.2% | all_purpose:127, big_fish:101 | closed:158, open:54, caution:16 | neutral:200, suppressed:23, active:5 | calm:143, slight:55, breezy:30 | cold_slow_or_front:78, stable_pleasant_high_confidence:35, heat_limited_finesse:29, dirty_vibration:24, warming_search:18 | clear:95, dirty:72, stained:61 | Oct:30, Sep:30, May:29, Aug:26<br>fall:71, summer:70, spring:55, winter:32 | cold_slow:87, current_swing:82, runoff_streamer:82, clear_subtle:70, calm_surface:54, dirty_vibration:51 |
| Inline Spinner<br>inline_spinner | lure | 223 | 223/2736 (8.2%) | 223/1368 (16.3%) | 144/684 (21.1%) | 79/684 (11.5%) | 161/62 | 684/684 (100%) | 724 | 30.8% | all_purpose:144, big_fish:79 | closed:140, caution:42, open:41 | neutral:206, suppressed:14, active:3 | calm:95, slight:82, breezy:46 | dirty_vibration:55, cold_slow_or_front:37, warming_search:28, stable_pleasant_high_confidence:26, heat_limited_finesse:22 | dirty:90, stained:86, clear:47 | Jun:35, Sep:32, May:28, Mar:22<br>fall:74, summer:70, spring:64, winter:15 | current_swing:141, runoff_streamer:141, dirty_vibration:117, calm_surface:41, warming_search:41, wind_reaction:41 |
| Blade Bait<br>blade_bait | lure | 215 | 215/2736 (7.9%) | 215/1368 (15.7%) | 121/684 (17.7%) | 94/684 (13.7%) | 73/142 | 324/684 (47.4%) | 319 | 67.4% | all_purpose:121, big_fish:94 | closed:215 | neutral:180, suppressed:29, active:6 | breezy:79, calm:68, slight:68 | cold_slow_or_front:66, dirty_vibration:62, warming_search:37, stable_pleasant_high_confidence:24, breezy_windy_stained_reaction:22 | dirty:86, stained:68, clear:61 | Oct:52, Mar:41, Apr:39, Nov:34<br>fall:86, spring:80, winter:49 | current_swing:139, runoff_streamer:139, dirty_vibration:112, cold_slow:95, wind_reaction:66, open_water_search:59 |
| Hair Jig<br>hair_jig | lure | 177 | 177/2736 (6.5%) | 177/1368 (12.9%) | 58/684 (8.5%) | 119/684 (17.4%) | 46/131 | 684/684 (100%) | 307 | 57.7% | big_fish:119, all_purpose:58 | closed:126, open:37, caution:14 | neutral:157, suppressed:17, active:3 | calm:114, slight:50, breezy:13 | cold_slow_or_front:66, stable_pleasant_high_confidence:25, heat_limited_finesse:19, calm_bright_clear_subtle:18, warming_search:17 | clear:91, stained:55, dirty:31 | May:24, Oct:23, Sep:23, Apr:18<br>fall:59, summer:47, spring:46, winter:25 | clear_subtle:70, cold_slow:68, current_swing:61, runoff_streamer:61, calm_surface:37, dirty_vibration:36 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 99 | 99/2736 (3.6%) | 99/1368 (7.2%) | 52/684 (7.6%) | 47/684 (6.9%) | 60/39 | 528/684 (77.2%) | 243 | 40.7% | all_purpose:52, big_fish:47 | closed:74, open:23, caution:2 | neutral:96, suppressed:2, active:1 | calm:87, slight:11, breezy:1 | heat_limited_finesse:55, calm_bright_clear_subtle:12, stable_pleasant_high_confidence:12, cold_slow_or_front:8, calm_low_light_surface:5 | clear:41, dirty:36, stained:22 | Aug:27, Jul:26, Sep:18, Jun:10<br>summer:63, fall:27, spring:9 | heat_finesse:60, clear_subtle:41, calm_surface:23, current_swing:10, runoff_streamer:10, cold_slow:5 |
| Ned Rig<br>ned_rig | lure | 89 | 89/2736 (3.3%) | 89/1368 (6.5%) | 52/684 (7.6%) | 37/684 (5.4%) | 9/80 | 684/684 (100%) | 185 | 48.1% | all_purpose:52, big_fish:37 | closed:87, open:2 | neutral:77, suppressed:12 | calm:61, slight:17, breezy:11 | heat_limited_finesse:57, cold_slow_or_front:22, calm_bright_clear_subtle:5, breezy_windy_stained_reaction:3, dirty_vibration:1 | stained:45, clear:34, dirty:10 | Jul:27, Aug:18, Sep:15, May:9<br>summer:50, fall:20, winter:10, spring:9 | heat_finesse:63, clear_subtle:26, cold_slow:25, current_swing:23, runoff_streamer:23, dirty_vibration:15 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77 | 77/2736 (2.8%) | 77/1368 (5.6%) | 15/684 (2.2%) | 62/684 (9.1%) | 34/43 | 192/684 (28.1%) | 134 | 57.5% | big_fish:62, all_purpose:15 | open:67, caution:10 | neutral:77 | calm:67, slight:10 | stable_pleasant_high_confidence:25, cold_slow_or_front:18, calm_low_light_surface:17, dirty_vibration:8, river_elevated_runoff_current:4 | stained:31, dirty:28, clear:18 | Jun:24, Aug:21, Sep:20, May:10<br>summer:47, fall:20, spring:10 | calm_surface:67, current_swing:28, runoff_streamer:28, low_light_surface:25, dirty_vibration:22, clear_subtle:15 |

## PB Sensibility Audit

Not applicable.

## PB Topwater Composition

| Group | Profile | BF selections | Share of BF topwater |
| --- | --- | --- | --- |
| Topwater lures | Walking Bait<br>walking_topwater | 0 | 0/0 (0%) |
| Topwater lures | Buzzbait<br>buzzbait | 0 | 0/0 (0%) |
| Topwater lures | Hollow-Body Frog<br>hollow_body_frog | 0 | 0/0 (0%) |
| Topwater lures | Wake Bait<br>wake_bait | 0 | 0/0 (0%) |
| Topwater lures | Topwater Popper<br>popping_topwater | 0 | 0/0 (0%) |
| Topwater flies | Bass Popper<br>popper_fly | 0 | 0/20 (0%) |
| Topwater flies | Deer Hair Slider<br>deer_hair_slider | 0 | 0/20 (0%) |
| Topwater flies | Foam Gurgler<br>foam_gurgler_fly | 0 | 0/20 (0%) |
| Topwater flies | Frog Popper<br>frog_fly | 0 | 0/20 (0%) |
| Topwater flies | Mouse Pattern<br>mouse_fly | 20 | 20/20 (100%) |

## Topwater Context Audit

| Species | Goal | Gear | Activity | Surface gate | Wind bucket | Rows | Topwater selections | Side-share in context | Scenario tags | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| river_trout | all_purpose | lure | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| river_trout | all_purpose | lure | neutral | closed | calm | 114 | 0 | 0/228 (0%) | heat_finesse:48, clear_subtle:38, cold_slow:30, dirty_vibration:20 |  |
| river_trout | all_purpose | lure | neutral | closed | slight | 48 | 0 | 0/96 (0%) | cold_slow:18, dirty_vibration:16, heat_finesse:6, clear_subtle:4 |  |
| river_trout | all_purpose | lure | neutral | closed | breezy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24, heat_finesse:6, clear_subtle:4 |  |
| river_trout | all_purpose | lure | neutral | open | calm | 66 | 15 | 15/132 (11.4%) | calm_surface:66, clear_subtle:22, low_light_surface:18, dirty_vibration:16, cold_slow:6 | small_floating_trout_plug:15 |
| river_trout | all_purpose | lure | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, dirty_vibration:4, clear_subtle:2 |  |
| river_trout | all_purpose | lure | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | dirty_vibration:8, cold_slow:6, clear_subtle:2 |  |
| river_trout | all_purpose | lure | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, dirty_vibration:8 |  |
| river_trout | all_purpose | fly | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| river_trout | all_purpose | fly | neutral | closed | calm | 114 | 0 | 0/228 (0%) | heat_finesse:48, clear_subtle:38, cold_slow:30, dirty_vibration:20 |  |
| river_trout | all_purpose | fly | neutral | closed | slight | 48 | 0 | 0/96 (0%) | cold_slow:18, dirty_vibration:16, heat_finesse:6, clear_subtle:4 |  |
| river_trout | all_purpose | fly | neutral | closed | breezy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24, heat_finesse:6, clear_subtle:4 |  |
| river_trout | all_purpose | fly | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, dirty_vibration:4, clear_subtle:2 |  |
| river_trout | all_purpose | fly | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | dirty_vibration:8, cold_slow:6, clear_subtle:2 |  |
| river_trout | all_purpose | fly | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, dirty_vibration:8 |  |
| river_trout | big_fish | lure | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| river_trout | big_fish | lure | neutral | closed | calm | 114 | 0 | 0/228 (0%) | heat_finesse:48, clear_subtle:38, cold_slow:30, dirty_vibration:20 |  |
| river_trout | big_fish | lure | neutral | closed | slight | 48 | 0 | 0/96 (0%) | cold_slow:18, dirty_vibration:16, heat_finesse:6, clear_subtle:4 |  |
| river_trout | big_fish | lure | neutral | closed | breezy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24, heat_finesse:6, clear_subtle:4 |  |
| river_trout | big_fish | lure | neutral | caution | slight | 30 | 10 | 10/60 (16.7%) | dirty_vibration:16, low_light_surface:12 | small_floating_trout_plug:10 |
| river_trout | big_fish | lure | neutral | open | calm | 66 | 52 | 52/132 (39.4%) | calm_surface:66, clear_subtle:22, low_light_surface:18, dirty_vibration:16, cold_slow:6 | small_floating_trout_plug:52 |
| river_trout | big_fish | lure | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, dirty_vibration:4, clear_subtle:2 |  |
| river_trout | big_fish | lure | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | dirty_vibration:8, cold_slow:6, clear_subtle:2 |  |
| river_trout | big_fish | lure | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, dirty_vibration:8 |  |
| river_trout | big_fish | fly | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| river_trout | big_fish | fly | neutral | closed | calm | 114 | 0 | 0/228 (0%) | heat_finesse:48, clear_subtle:38, cold_slow:30, dirty_vibration:20 |  |
| river_trout | big_fish | fly | neutral | closed | slight | 48 | 0 | 0/96 (0%) | cold_slow:18, dirty_vibration:16, heat_finesse:6, clear_subtle:4 |  |
| river_trout | big_fish | fly | neutral | closed | breezy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24, heat_finesse:6, clear_subtle:4 |  |
| river_trout | big_fish | fly | neutral | caution | slight | 30 | 2 | 2/60 (3.3%) | dirty_vibration:16, low_light_surface:12 | mouse_fly:2 |
| river_trout | big_fish | fly | neutral | open | calm | 66 | 18 | 18/132 (13.6%) | calm_surface:66, clear_subtle:22, low_light_surface:18, dirty_vibration:16, cold_slow:6 | mouse_fly:18 |
| river_trout | big_fish | fly | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, dirty_vibration:4, clear_subtle:2 |  |
| river_trout | big_fish | fly | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | dirty_vibration:8, cold_slow:6, clear_subtle:2 |  |
| river_trout | big_fish | fly | suppressed | closed | breezy | 12 | 0 | 0/24 (0%) | cold_slow:12, dirty_vibration:8 |  |

## Topwater Eligibility Rate Audit

| Species | Goal | Slice | Rows | Eligible rows | Global topwater all-slot share | Eligible topwater all-slot share | Eligible lure-side topwater share | Eligible fly-side topwater share | Closed surface | Suppressed surface | High-wind surface | Heat/no-light surface | Slight wind-reaction score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| river_trout | all_purpose | all | 342 | 96 | 15/1368 (1.1%) | 15/384 (3.9%) | 15/192 (7.8%) | 0/192 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | activity:active | 6 | 0 | 0/24 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | activity:neutral | 306 | 96 | 15/1224 (1.2%) | 15/384 (3.9%) | 15/192 (7.8%) | 0/192 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | activity:suppressed | 30 | 0 | 0/120 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | surface_gate:open | 66 | 66 | 15/264 (5.7%) | 15/264 (5.7%) | 15/132 (11.4%) | 0/132 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | surface_gate:caution | 30 | 30 | 0/120 (0%) | 0/120 (0%) | 0/60 (0%) | 0/60 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | surface_gate:closed | 246 | 0 | 0/984 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | wind:calm | 186 | 66 | 15/744 (2%) | 15/264 (5.7%) | 15/132 (11.4%) | 0/132 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | wind:slight | 96 | 30 | 0/384 (0%) | 0/120 (0%) | 0/60 (0%) | 0/60 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | all_purpose | wind:breezy | 60 | 0 | 0/240 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | all | 342 | 96 | 82/1368 (6%) | 82/384 (21.4%) | 62/192 (32.3%) | 20/192 (10.4%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | activity:active | 6 | 0 | 0/24 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | activity:neutral | 306 | 96 | 82/1224 (6.7%) | 82/384 (21.4%) | 62/192 (32.3%) | 20/192 (10.4%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | activity:suppressed | 30 | 0 | 0/120 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | surface_gate:open | 66 | 66 | 70/264 (26.5%) | 70/264 (26.5%) | 52/132 (39.4%) | 18/132 (13.6%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | surface_gate:caution | 30 | 30 | 12/120 (10%) | 12/120 (10%) | 10/60 (16.7%) | 2/60 (3.3%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | surface_gate:closed | 246 | 0 | 0/984 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | wind:calm | 186 | 66 | 70/744 (9.4%) | 70/264 (26.5%) | 52/132 (39.4%) | 18/132 (13.6%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | wind:slight | 96 | 30 | 12/384 (3.1%) | 12/120 (10%) | 10/60 (16.7%) | 2/60 (3.3%) | 0 | 0 | 0 | 0 | 0 |
| river_trout | big_fish | wind:breezy | 60 | 0 | 0/240 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |

## Wind-Reaction Tag Audit

Selected rows with condition_tag:wind_reaction scoring in slight wind: 0.

| Profile | Gear | Selected | Calm | Slight | Breezy | Windy | Selected with wind score | Slight wind-score rows | Questionable? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 96 | 39 | 28 | 29 | 0 | 26 | 0 | watch: context-sensitive fly wind tag |
| Bunny Streamer<br>pike_bunny_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Conehead Streamer<br>conehead_streamer | fly | 67 | 16 | 16 | 35 | 0 | 35 | 0 | watch: context-sensitive fly wind tag |
| Deceiver<br>deceiver | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Flash Fly<br>pike_flash_fly | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Zonker Streamer<br>zonker_streamer | fly | 30 | 9 | 4 | 17 | 0 | 17 | 0 | watch: context-sensitive fly wind tag |
| Bladed Jig<br>bladed_jig | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Buzzbait<br>buzzbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Casting Spoon<br>casting_spoon | lure | 260 | 109 | 91 | 60 | 0 | 51 | 0 |  |
| Inline Spinner<br>inline_spinner | lure | 223 | 95 | 82 | 46 | 0 | 41 | 0 |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Large Jerkbait<br>pike_jerkbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Spinnerbait<br>spinnerbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228 | 143 | 55 | 30 | 0 | 20 | 0 |  |
| Weedless Spoon<br>weedless_spoon | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## Bass Staple Watch List

Not applicable.

## Bass Macro-Family Utilization Diagnostics

Not applicable.

## Wind Bucket Diagnostics

| Wind bucket | Goal | Rows | Share | Surface picks | Wind-reaction rows |
| --- | --- | --- | --- | --- | --- |
| calm | all | 372 | 54.4% | 85 | 0 |
| calm | all_purpose | 186 | 27.2% | 15 | 0 |
| calm | big_fish | 186 | 27.2% | 70 | 0 |
| slight | all | 192 | 28.1% | 12 | 0 |
| slight | all_purpose | 96 | 14% | 0 | 0 |
| slight | big_fish | 96 | 14% | 12 | 0 |
| breezy | all | 120 | 17.5% | 0 | 96 |
| breezy | all_purpose | 60 | 8.8% | 0 | 48 |
| breezy | big_fish | 60 | 8.8% | 0 | 48 |
| windy | all | 0 | 0% | 0 | 0 |
| windy | all_purpose | 0 | 0% | 0 | 0 |
| windy | big_fish | 0 | 0% | 0 | 0 |
| unknown | all | 0 | 0% | 0 | 0 |
| unknown | all_purpose | 0 | 0% | 0 | 0 |
| unknown | big_fish | 0 | 0% | 0 | 0 |

## Surface Gate by Goal and Wind Bucket

| Goal | Wind bucket | Surface gate | Rows | Selected surface picks |
| --- | --- | --- | --- | --- |
| all_purpose | calm | closed | 120 | 0 |
| all_purpose | calm | open | 66 | 15 |
| all_purpose | slight | closed | 66 | 0 |
| all_purpose | slight | caution | 30 | 0 |
| all_purpose | breezy | closed | 60 | 0 |
| big_fish | calm | closed | 120 | 0 |
| big_fish | calm | open | 66 | 70 |
| big_fish | slight | closed | 66 | 0 |
| big_fish | slight | caution | 30 | 12 |
| big_fish | breezy | closed | 60 | 0 |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Blade Bait<br>blade_bait | lure | 215/324 | 66.4% | all_purpose:121, big_fish:94 | current_swing:139, runoff_streamer:139, dirty_vibration:112, cold_slow:95, wind_reaction:66 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77/192 | 40.1% | big_fish:62, all_purpose:15 | calm_surface:67, current_swing:28, runoff_streamer:28, low_light_surface:25, dirty_vibration:22 |
| Casting Spoon<br>casting_spoon | lure | 260/684 | 38% | big_fish:145, all_purpose:115 | current_swing:164, runoff_streamer:164, dirty_vibration:125, cold_slow:90, wind_reaction:51 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228/684 | 33.3% | all_purpose:127, big_fish:101 | cold_slow:87, current_swing:82, runoff_streamer:82, clear_subtle:70, calm_surface:54 |
| Inline Spinner<br>inline_spinner | lure | 223/684 | 32.6% | all_purpose:144, big_fish:79 | current_swing:141, runoff_streamer:141, dirty_vibration:117, calm_surface:41, warming_search:41 |
| Hair Jig<br>hair_jig | lure | 177/684 | 25.9% | big_fish:119, all_purpose:58 | clear_subtle:70, cold_slow:68, current_swing:61, runoff_streamer:61, calm_surface:37 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Blade Bait<br>blade_bait | lure | home-window >30% severe | 183/268 | 68.3% | selector_filtering_variety_jitter:45 | AP/BF 99/134, 84/134<br>clarity clear:100, dirty:84, stained:84<br>bucket cold_slow_or_front:120, dirty_vibration:64, warming_search:28 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | home-window >30% severe | 57/108 | 52.8% | goal_tags:36 | AP/BF 13/54, 44/54<br>clarity clear:36, dirty:36, stained:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, cold_slow_or_front:16 |
| Casting Spoon<br>casting_spoon | lure | home-window >30% severe | 186/372 | 50% | goal_tags:91 | AP/BF 81/186, 105/186<br>clarity clear:124, dirty:124, stained:124<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 |
| Inline Spinner<br>inline_spinner | lure | home-window >30% severe | 155/372 | 41.7% | goal_tags:117 | AP/BF 98/186, 57/186<br>clarity clear:124, dirty:124, stained:124<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 |
| Hair Jig<br>hair_jig | lure | home-window >25% overdominant | 158/576 | 27.4% | goal_tags:235 | AP/BF 50/288, 108/288<br>clarity clear:216, stained:184, dirty:176<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >25% overdominant | 100/372 | 26.9% | daily_condition_tags:145 | AP/BF 57/186, 43/186<br>clarity clear:124, dirty:124, stained:124<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 107/432 | 24.8% | goal_tags:219 | AP/BF 0/192, 107/240<br>clarity clear:144, dirty:144, stained:144<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | home-window >20% watch | 105/432 | 24.3% | goal_tags:190 | AP/BF 2/192, 103/240<br>clarity clear:144, dirty:144, stained:144<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >20% watch | 97/408 | 23.8% | goal_tags:180 | AP/BF 0/180, 97/228<br>clarity clear:136, dirty:136, stained:136<br>bucket dirty_vibration:100, cold_slow_or_front:94, warming_search:68 |
| Sculpin Streamer<br>sculpin_streamer | fly | home-window >20% watch | 133/576 | 23.1% | selector_filtering_variety_jitter:227 | AP/BF 120/288, 13/288<br>clarity clear:216, stained:184, dirty:176<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 |
| Woolly Bugger<br>woolly_bugger | fly | home-window >20% watch | 129/568 | 22.7% | goal_tags:201 | AP/BF 119/284, 10/284<br>clarity clear:224, stained:192, dirty:152<br>bucket cold_slow_or_front:176, dirty_vibration:104, heat_limited_finesse:68 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 125/568 | 22% | daily_condition_tags:254 | AP/BF 8/284, 117/284<br>clarity clear:224, stained:192, dirty:152<br>bucket cold_slow_or_front:176, dirty_vibration:104, heat_limited_finesse:68 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Blade Bait<br>blade_bait | lure | 215/2736 (7.9%) | 73/1368 (5.3%) | 142/1368 (10.4%) | 215/1368 (15.7%) | 183/268 (68.3%) | 70/268 (26.1%) / 113/268 (42.2%) | home>20%<br>home>25%<br>home>30% |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77/2736 (2.8%) | 34/1368 (2.5%) | 43/1368 (3.1%) | 77/1368 (5.6%) | 57/108 (52.8%) | 26/108 (24.1%) / 31/108 (28.7%) | home>20%<br>home>25%<br>home>30% |
| Casting Spoon<br>casting_spoon | lure | 260/2736 (9.5%) | 151/1368 (11%) | 109/1368 (8%) | 260/1368 (19%) | 186/372 (50%) | 120/372 (32.3%) / 66/372 (17.7%) | home>20%<br>home>25%<br>home>30% |
| Inline Spinner<br>inline_spinner | lure | 223/2736 (8.2%) | 161/1368 (11.8%) | 62/1368 (4.5%) | 223/1368 (16.3%) | 155/372 (41.7%) | 120/372 (32.3%) / 35/372 (9.4%) | home>20%<br>home>25%<br>home>30% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 99/2736 (3.6%) | 60/1368 (4.4%) | 39/1368 (2.9%) | 99/1368 (7.2%) | 41/120 (34.2%) | 30/120 (25%) / 11/120 (9.2%) | home>20%<br>home>25%<br>home>30% |
| Hair Jig<br>hair_jig | lure | 177/2736 (6.5%) | 46/1368 (3.4%) | 131/1368 (9.6%) | 177/1368 (12.9%) | 158/576 (27.4%) | 42/576 (7.3%) / 116/576 (20.1%) | home>20%<br>home>25% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228/2736 (8.3%) | 150/1368 (11%) | 78/1368 (5.7%) | 228/1368 (16.7%) | 100/372 (26.9%) | 66/372 (17.7%) / 34/372 (9.1%) | home>20%<br>home>25% |
| Sculpzilla<br>sculpzilla | fly | 139/2736 (5.1%) | 98/1368 (7.2%) | 41/1368 (3%) | 139/1368 (10.2%) | 107/432 (24.8%) | 76/432 (17.6%) / 31/432 (7.2%) | home>20% |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 148/2736 (5.4%) | 56/1368 (4.1%) | 92/1368 (6.7%) | 148/1368 (10.8%) | 105/432 (24.3%) | 41/432 (9.5%) / 64/432 (14.8%) | home>20% |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/2736 (4.2%) | 31/1368 (2.3%) | 84/1368 (6.1%) | 115/1368 (8.4%) | 97/408 (23.8%) | 25/408 (6.1%) / 72/408 (17.6%) | home>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 143/2736 (5.2%) | 125/1368 (9.1%) | 18/1368 (1.3%) | 143/1368 (10.5%) | 133/576 (23.1%) | 120/576 (20.8%) / 13/576 (2.3%) | home>20% |
| Woolly Bugger<br>woolly_bugger | fly | 144/2736 (5.3%) | 27/1368 (2%) | 117/1368 (8.6%) | 144/1368 (10.5%) | 129/568 (22.7%) | 16/568 (2.8%) / 113/568 (19.9%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 157/2736 (5.7%) | 89/1368 (6.5%) | 68/1368 (5%) | 157/1368 (11.5%) | 125/568 (22%) | 74/568 (13%) / 51/568 (9%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.43.
Average expanded finalist pool size: 3.20.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1094.
Rows/slots with expanded finalist pool size 1: 633.
Selected-tier singleton slots expanded above 1: 461.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.93 | 3.97 | 1 | 1 | 224 | 115 |
| fly/top | 3.15 | 4.22 | 1 | 1 | 191 | 73 |
| lure/honorable | 1.83 | 2.34 | 1 | 1 | 332 | 188 |
| lure/top | 1.83 | 2.28 | 1 | 1 | 347 | 257 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1618 |
| goal_or_priority_condition | 967 |
| credible_fallback | 122 |
| daily_lane_specialist | 29 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1653 |
| goal_and_priority_condition | 1618 |
| credible_fallback | 235 |
| daily_lane_specialist | 120 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 297 |
| family_diversity_scarcity | 277 |
| surface_safety_scarcity | 59 |

Representative expanded singleton finalist pools:
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B lure/honorable: casting_spoon (goal_and_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__all_purpose__B fly/honorable: feather_jig_leech (goal_and_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B lure/top: suspending_jerkbait (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__clear__big_fish__B fly/top: feather_jig_leech (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B fly/top: feather_jig_leech (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__stained__big_fish__B fly/top: feather_jig_leech (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B lure/top: casting_spoon (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B lure/honorable: suspending_jerkbait (goal_or_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B fly/top: feather_jig_leech (goal_and_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__all_purpose__B fly/honorable: muddler_sculpin (goal_and_priority_condition; family_diversity_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B lure/top: inline_spinner (goal_or_priority_condition; hard_gated_scarcity)
- ar_white_river_trout__2025-01-16__freshwater_river__dirty__big_fish__B fly/top: feather_jig_leech (goal_or_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__clear__big_fish__A lure/top: blade_bait (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__A lure/top: blade_bait (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/top: crawfish_streamer (goal_and_priority_condition; hard_gated_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__all_purpose__B fly/honorable: jighead_marabou_leech (goal_and_priority_condition; family_diversity_scarcity)
- ny_upper_delaware_trout__2025-01-18__freshwater_river__stained__big_fish__A lure/top: blade_bait (goal_and_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.37 |
| Different-presentation close candidates | 1.35 |
| Different-family close candidates | 1.96 |
| Final expanded Set B pool | 2.08 |
| Same-family/same-presentation reintroduced | 197/1368 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 240 |
| Coverage pool used | 4 |
| Average used coverage pool size | 2.50 |
| Singleton used coverage pools | 0 |
| Broad pool larger than narrowed pool | 0 |
| Broad pool same as narrowed pool | 4 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 236 |
| broad | 4 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| casting_spoon | 4 |
| suspending_jerkbait | 4 |
| inline_spinner | 2 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| suspending_jerkbait | 4 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1968 | 0 | 0 |
| caution | 240 | 12 | 8 |

Caution-gate selected surface examples:
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__A: honorable_lure:small_floating_trout_plug
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__A: honorable_lure:small_floating_trout_plug
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__big_fish__A: honorable_lure:small_floating_trout_plug
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__big_fish__B: honorable_lure:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A: lure_of_the_day:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__B: honorable_fly:mouse_fly
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A: lure_of_the_day:small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__B: honorable_fly:mouse_fly
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__A: honorable_lure:small_floating_trout_plug
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__big_fish__A: honorable_lure:small_floating_trout_plug

Caution-gate surface finalist examples:
- ar_white_river_trout__2025-05-18__freshwater_river__clear__big_fish__A lure/honorable: small_floating_trout_plug
- ar_white_river_trout__2025-05-18__freshwater_river__stained__big_fish__A lure/honorable: small_floating_trout_plug
- ar_white_river_trout__2025-05-18__freshwater_river__dirty__big_fish__A lure/honorable: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__clear__big_fish__A lure/top: small_floating_trout_plug
- mt_madison_trout__2025-07-19__freshwater_river__stained__big_fish__A lure/top: small_floating_trout_plug
- mi_au_sable_trout__2025-09-21__freshwater_river__clear__big_fish__A lure/honorable: small_floating_trout_plug
- mi_au_sable_trout__2025-09-21__freshwater_river__stained__big_fish__A lure/honorable: small_floating_trout_plug
- mi_au_sable_trout__2025-09-21__freshwater_river__dirty__big_fish__A lure/honorable: small_floating_trout_plug

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 3: current_swing, clear_subtle, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 3: cold_slow, open_water_search, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 4: open_water_search, wind_reaction, cold_slow, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | trout | trout_plug | trout_surface_plug | surface<br>medium/slow | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_river | true | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Marabou Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Pattern<br>mouse_fly | fly | largemouth_bass, smallmouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 148/684 | 105/432 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 40/312 | 0/108 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 11/684 | 4/384 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 8 | 27/84 | 27/76 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 115/552 | 97/408 | goal_tags>1<br>home-window share>20% |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 52/684 | 42/576 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 22/684 | 20/576 | clear+stained+dirty clarity |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 31/684 | 28/568 | clear+stained+dirty clarity |
| Mouse Pattern<br>mouse_fly | fly | 7 | 20/108 | 15/60 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 157/684 | 125/568 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 143/684 | 133/576 | clear+stained+dirty clarity<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 7 | 139/684 | 107/432 | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 144/684 | 129/568 | clear+stained+dirty clarity<br>home-window share>20% |
| Blade Bait<br>blade_bait | lure | 8 | 215/324 | 183/268 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Casting Spoon<br>casting_spoon | lure | 8 | 260/684 | 186/372 | condition_tags>3<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 99/528 | 41/120 | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 77/192 | 57/108 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 8 | 177/684 | 158/576 | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Inline Spinner<br>inline_spinner | lure | 8 | 223/684 | 155/372 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 9 | 89/684 | 88/576 | clear+stained+dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 228/684 | 100/372 | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | 8 | 260/684 (38%) | 186/372 (50%) | big_fish:145, all_purpose:115 | top:151, honorable:109 | current_swing:164, runoff_streamer:164, dirty_vibration:125, cold_slow:90, wind_reaction:51 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 228/684 (33.3%) | 100/372 (26.9%) | all_purpose:127, big_fish:101 | top:150, honorable:78 | cold_slow:87, current_swing:82, runoff_streamer:82, clear_subtle:70, calm_surface:54 |
| Inline Spinner<br>inline_spinner | lure | 8 | 223/684 (32.6%) | 155/372 (41.7%) | all_purpose:144, big_fish:79 | top:161, honorable:62 | current_swing:141, runoff_streamer:141, dirty_vibration:117, calm_surface:41, warming_search:41 |
| Blade Bait<br>blade_bait | lure | 8 | 215/324 (66.4%) | 183/268 (68.3%) | all_purpose:121, big_fish:94 | honorable:142, top:73 | current_swing:139, runoff_streamer:139, dirty_vibration:112, cold_slow:95, wind_reaction:66 |
| Hair Jig<br>hair_jig | lure | 8 | 177/684 (25.9%) | 158/576 (27.4%) | big_fish:119, all_purpose:58 | honorable:131, top:46 | clear_subtle:70, cold_slow:68, current_swing:61, runoff_streamer:61, calm_surface:37 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 157/684 (23%) | 125/568 (22%) | big_fish:146, all_purpose:11 | top:89, honorable:68 | current_swing:58, runoff_streamer:58, dirty_vibration:46, cold_slow:41, heat_finesse:36 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 148/684 (21.6%) | 105/432 (24.3%) | big_fish:142, all_purpose:6 | honorable:92, top:56 | current_swing:71, runoff_streamer:71, dirty_vibration:48, cold_slow:36, calm_surface:32 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 144/684 (21.1%) | 129/568 (22.7%) | all_purpose:134, big_fish:10 | honorable:117, top:27 | current_swing:65, runoff_streamer:65, cold_slow:63, dirty_vibration:44, clear_subtle:38 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 143/684 (20.9%) | 133/576 (23.1%) | all_purpose:130, big_fish:13 | top:125, honorable:18 | current_swing:90, runoff_streamer:90, dirty_vibration:63, cold_slow:60, clear_subtle:29 |
| Sculpzilla<br>sculpzilla | fly | 7 | 139/684 (20.3%) | 107/432 (24.8%) | big_fish:139 | top:98, honorable:41 | current_swing:81, runoff_streamer:81, dirty_vibration:56, cold_slow:39, calm_surface:24 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 115/552 (20.8%) | 97/408 (23.8%) | big_fish:115 | honorable:84, top:31 | current_swing:67, runoff_streamer:67, dirty_vibration:45, cold_slow:42, calm_surface:21 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 99/528 (18.8%) | 41/120 (34.2%) | all_purpose:52, big_fish:47 | top:60, honorable:39 | heat_finesse:60, clear_subtle:41, calm_surface:23, current_swing:10, runoff_streamer:10 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 96/684 (14%) | 65/384 (16.9%) | all_purpose:83, big_fish:13 | honorable:67, top:29 | current_swing:52, runoff_streamer:52, dirty_vibration:45, cold_slow:32, wind_reaction:26 |
| Ned Rig<br>ned_rig | lure | 9 | 89/684 (13%) | 88/576 (15.3%) | all_purpose:52, big_fish:37 | honorable:80, top:9 | heat_finesse:63, clear_subtle:26, cold_slow:25, current_swing:23, runoff_streamer:23 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 8 | 77/192 (40.1%) | 57/108 (52.8%) | big_fish:62, all_purpose:15 | honorable:43, top:34 | calm_surface:67, current_swing:28, runoff_streamer:28, low_light_surface:25, dirty_vibration:22 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 67/684 (9.8%) | 52/432 (12%) | all_purpose:52, big_fish:15 | top:49, honorable:18 | current_swing:44, runoff_streamer:44, dirty_vibration:40, open_water_search:35, wind_reaction:35 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 52/684 (7.6%) | 42/576 (7.3%) | all_purpose:52 | honorable:39, top:13 | current_swing:34, runoff_streamer:34, dirty_vibration:32, open_water_search:11, wind_reaction:11 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 51/684 (7.5%) | 48/576 (8.3%) | all_purpose:49, big_fish:2 | top:46, honorable:5 | cold_slow:28, clear_subtle:25, current_swing:22, runoff_streamer:22, calm_surface:9 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 51/528 (9.7%) | 14/264 (5.3%) | all_purpose:35, big_fish:16 | honorable:41, top:10 | clear_subtle:43, calm_surface:17, heat_finesse:16, current_swing:10, runoff_streamer:10 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 40/312 (12.8%) | 0/108 (0%) | all_purpose:25, big_fish:15 | honorable:34, top:6 | heat_finesse:24, calm_surface:12, dirty_vibration:4, none:4, open_water_search:4 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 31/684 (4.5%) | 28/568 (4.9%) | all_purpose:23, big_fish:8 | top:16, honorable:15 | warming_search:25, current_swing:21, runoff_streamer:21, dirty_vibration:14, open_water_search:9 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 30/684 (4.4%) | 22/432 (5.1%) | all_purpose:23, big_fish:7 | top:22, honorable:8 | current_swing:17, dirty_vibration:17, open_water_search:17, runoff_streamer:17, wind_reaction:17 |
| Crawfish Streamer<br>crawfish_streamer | fly | 8 | 27/84 (32.1%) | 27/76 (35.5%) | all_purpose:18, big_fish:9 | top:27 | cold_slow:25, current_swing:10, dirty_vibration:10, runoff_streamer:10, clear_subtle:6 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 7 | 24/528 (4.5%) | 5/264 (1.9%) | big_fish:13, all_purpose:11 | honorable:14, top:10 | clear_subtle:15, heat_finesse:11, calm_surface:7, open_water_search:7, wind_reaction:7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 22/684 (3.2%) | 20/576 (3.5%) | all_purpose:21, big_fish:1 | top:17, honorable:5 | clear_subtle:20, heat_finesse:10, calm_surface:6, warming_search:3, cold_slow:2 |
| Mouse Pattern<br>mouse_fly | fly | 7 | 20/108 (18.5%) | 15/60 (25%) | big_fish:20 | honorable:13, top:7 | calm_surface:18, clear_subtle:6, current_swing:6, runoff_streamer:6, dirty_vibration:4 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 11/684 (1.6%) | 4/384 (1%) | all_purpose:11 | top:6, honorable:5 | calm_surface:5, warming_search:4, low_light_surface:2, none:2 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | 260/684 (38%) | 186/372 (50%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | condition_tags>3<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 228/684 (33.3%) | 100/372 (26.9%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Inline Spinner<br>inline_spinner | lure | 223/684 (32.6%) | 155/372 (41.7%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Blade Bait<br>blade_bait | lure | 215/324 (66.4%) | 183/268 (68.3%) | catalog_tag_stack<br>condition_tag_stack | clear+stained+dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Hair Jig<br>hair_jig | lure | 177/684 (25.9%) | 158/576 (27.4%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack | combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 157/684 (23%) | 125/568 (22%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 148/684 (21.6%) | 105/432 (24.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 144/684 (21.1%) | 129/568 (22.7%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 143/684 (20.9%) | 133/576 (23.1%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 139/684 (20.3%) | 107/432 (24.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 115/552 (20.8%) | 97/408 (23.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 99/528 (18.8%) | 41/120 (34.2%) | catalog_tag_stack<br>selector_direct_score_bias | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 77/192 (40.1%) | 57/108 (52.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias<br>acceptable_niche_concentration | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 576 | 88/576 (15.3%) | Casting Spoon (top), Blade Bait (honorable):49, Inline Spinner (top), Blade Bait (honorable):44, Suspending Jerkbait (top), Hair Jig (honorable):44, Casting Spoon (top), Hair Jig (honorable):38 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 576 | 158/576 (27.4%) | Casting Spoon (top), Blade Bait (honorable):49, Inline Spinner (top), Blade Bait (honorable):44, Drop-Shot Minnow (top), Ned Rig (honorable):40, Inline Spinner (top), Casting Spoon (honorable):36 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 372 | 155/372 (41.7%) | Casting Spoon (top), Blade Bait (honorable):58, Blade Bait (top), Casting Spoon (honorable):26, Casting Spoon (top), Hair Jig (honorable):23, Casting Spoon (top), Floating Trout Plug (honorable):18 | healthy / not underused |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 4: open_water_search, wind_reaction, cold_slow, current_swing<br>goal 1: versatile_search | 372 | 186/372 (50%) | Inline Spinner (top), Blade Bait (honorable):50, Inline Spinner (top), Hair Jig (honorable):22, Suspending Jerkbait (top), Inline Spinner (honorable):18, Suspending Jerkbait (top), Hair Jig (honorable):16 | healthy / not underused |
| Blade Bait<br>blade_bait | lure | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 3: cold_slow, open_water_search, current_swing<br>goal 1: reliable_action | 268 | 183/268 (68.3%) | Hair Jig (top), Suspending Jerkbait (honorable):23, Casting Spoon (top), Hair Jig (honorable):16, Suspending Jerkbait (top), Hair Jig (honorable):13, Inline Spinner (top), Hair Jig (honorable):10 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 372 | 100/372 (26.9%) | Casting Spoon (top), Blade Bait (honorable):58, Inline Spinner (top), Blade Bait (honorable):50, Inline Spinner (top), Casting Spoon (honorable):32, Blade Bait (top), Casting Spoon (honorable):26 | healthy / not underused |
| Soft Jerkbait<br>soft_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Floating Trout Plug<br>small_floating_trout_plug | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 108 | 57/108 (52.8%) | Inline Spinner (top), Casting Spoon (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):9, Drop-Shot Minnow (top), Hair Jig (honorable):5, Inline Spinner (top), Hair Jig (honorable):5 | healthy / not underused |
| Woolly Bugger<br>woolly_bugger | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 568 | 129/568 (22.7%) | Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):24 | healthy / not underused |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | forage 1: leech_worm<br>clarity 2: stained, dirty<br>condition 2: cold_slow, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 568 | 125/568 (22%) | Sculpin Streamer (top), Woolly Bugger (honorable):62, Sculpzilla (top), Dungeon Streamer (honorable):53, Sculpin Streamer (top), Bucktail Streamer (honorable):33, Crawfish Streamer (top), Woolly Bugger (honorable):22 | healthy / not underused |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, current_swing<br>goal 1: reliable_action | 576 | 42/576 (7.3%) | Sculpin Streamer (top), Woolly Bugger (honorable):62, Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):39, Sculpin Streamer (top), Bucktail Streamer (honorable):32 | selector/direct-score or overpowered competitors |
| Lead-Eye Leech<br>lead_eye_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: cold_slow, clear_subtle<br>goal 1: reliable_action | 576 | 20/576 (3.5%) | Sculpin Streamer (top), Woolly Bugger (honorable):62, Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):39, Sculpin Streamer (top), Bucktail Streamer (honorable):32 | selector/direct-score or overpowered competitors |
| Marabou Jig Leech<br>feather_jig_leech | fly | forage 1: leech_worm<br>clarity 3: clear, stained, dirty<br>condition 2: warming_search, current_swing<br>goal 1: versatile_search | 568 | 28/568 (4.9%) | Sculpin Streamer (top), Woolly Bugger (honorable):62, Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33 | selector/direct-score or overpowered competitors |
| Sculpin Streamer<br>sculpin_streamer | fly | forage 2: baitfish, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, cold_slow, runoff_streamer<br>goal 1: reliable_action | 576 | 133/576 (23.1%) | Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):39, Crawfish Streamer (top), Woolly Bugger (honorable):22, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):21 | healthy / not underused |
| Sculpzilla<br>sculpzilla | fly | forage 2: baitfish, crawfish<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, current_swing<br>goal 1: big_fish_upside | 432 | 107/432 (24.8%) | Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):27, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):23 | healthy / not underused |
| Muddler Minnow<br>muddler_sculpin | fly | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: current_swing, cold_slow<br>goal 1: reliable_action | 576 | 48/576 (8.3%) | Sculpin Streamer (top), Woolly Bugger (honorable):62, Sculpzilla (top), Dungeon Streamer (honorable):53, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):39, Sculpin Streamer (top), Bucktail Streamer (honorable):32 | selector/direct-score or overpowered competitors |
| Crawfish Streamer<br>crawfish_streamer | fly | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: current_swing, clear_subtle, cold_slow<br>goal 1: reliable_action | 76 | 27/76 (35.5%) | Sculpin Streamer (top), Woolly Bugger (honorable):14, Sculpin Streamer (top), Articulated Baitfish (honorable):9, Sculpzilla (top), Dungeon Streamer (honorable):8, Rabbit-Strip Leech (top), Dungeon Streamer (honorable):6 | healthy / not underused |
| Clouser Minnow<br>clouser_minnow | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: current_swing, open_water_search<br>goal 2: reliable_action, versatile_search | 384 | 4/384 (1%) | Sculpzilla (top), Dungeon Streamer (honorable):50, Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):23 | selector/direct-score or overpowered competitors |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 384 | 65/384 (16.9%) | Sculpzilla (top), Dungeon Streamer (honorable):50, Sculpin Streamer (top), Woolly Bugger (honorable):42, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):23, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):21 | healthy / not underused |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | forage 1: baitfish<br>clarity 1: clear<br>condition 2: clear_subtle, current_swing<br>goal 1: reliable_action | 264 | 14/264 (5.3%) | Sculpin Streamer (top), Woolly Bugger (honorable):33, Sculpzilla (top), Dungeon Streamer (honorable):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20, Conehead Streamer (top), Jigged Marabou Leech (honorable):17 | selector/direct-score or overpowered competitors |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 432 | 105/432 (24.3%) | Sculpzilla (top), Dungeon Streamer (honorable):51, Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Conehead Streamer (top), Jigged Marabou Leech (honorable):17 | healthy / not underused |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: runoff_streamer, cover_ambush<br>goal 2: big_fish_upside, high_risk_high_reward | 408 | 97/408 (23.8%) | Sculpin Streamer (top), Woolly Bugger (honorable):36, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):27, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):23 | healthy / not underused |
| Game Changer<br>game_changer | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 1: open_water_search<br>goal 2: versatile_search, big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Conehead Streamer<br>conehead_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 432 | 52/432 (12%) | Sculpzilla (top), Dungeon Streamer (honorable):51, Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):27 | healthy / not underused |
| Zonker Streamer<br>zonker_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 1: versatile_search | 432 | 22/432 (5.1%) | Sculpzilla (top), Dungeon Streamer (honorable):51, Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):27 | selector/direct-score or overpowered competitors |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: clear_subtle, open_water_search<br>goal 1: versatile_search | 264 | 5/264 (1.9%) | Sculpin Streamer (top), Woolly Bugger (honorable):33, Sculpzilla (top), Dungeon Streamer (honorable):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20, Conehead Streamer (top), Jigged Marabou Leech (honorable):17 | selector/direct-score or overpowered competitors |
| Baitfish Slider<br>baitfish_slider_fly | fly | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: open_water_search, warming_search<br>goal 1: versatile_search | 108 | 0/108 (0%) | Sculpin Streamer (top), Woolly Bugger (honorable):21, Sculpzilla (top), Dungeon Streamer (honorable):11, Rabbit-Strip Leech (top), Articulated Baitfish (honorable):9, Sculpzilla (top), Articulated Baitfish (honorable):8 | scenario coverage or narrow home window |
| Bass Popper<br>popper_fly | fly | forage 2: surface_prey, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: reliable_action, versatile_search | 0 | 0/0 |  | scenario coverage |
| Deer Hair Slider<br>deer_hair_slider | fly | forage 2: surface_prey, baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: calm_surface, low_light_surface<br>goal 1: big_fish_upside | 0 | 0/0 |  | scenario coverage |
| Mouse Pattern<br>mouse_fly | fly | forage 1: surface_prey<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 60 | 15/60 (25%) | Sculpin Streamer (top), Woolly Bugger (honorable):7, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Bucktail Streamer (top), Jigged Marabou Leech (honorable):3, Sculpzilla (top), Articulated Baitfish (honorable):3 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish (articulated_baitfish_streamer), Dungeon Streamer (articulated_dungeon_streamer), Floating Trout Plug (small_floating_trout_plug), Inline Spinner (inline_spinner), Rabbit-Strip Leech (rabbit_strip_leech), Suspending Jerkbait (suspending_jerkbait)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish (articulated_baitfish_streamer), Baitfish Slider (baitfish_slider_fly), Bass Popper (popper_fly), Blade Bait (blade_bait), Casting Spoon (casting_spoon), Deer Hair Slider (deer_hair_slider), Drop-Shot Minnow (drop_shot_minnow), Dungeon Streamer (articulated_dungeon_streamer), Floating Trout Plug (small_floating_trout_plug), Game Changer (game_changer), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Rabbit-Strip Leech (rabbit_strip_leech), Sculpin Streamer (sculpin_streamer), Sculpzilla (sculpzilla), Soft Jerkbait (soft_jerkbait), Suspending Jerkbait (suspending_jerkbait), Woolly Bugger (woolly_bugger)

### Probably selector problem, not catalog problem
Clouser Minnow (clouser_minnow), Jigged Marabou Leech (jighead_marabou_leech), Lead-Eye Leech (lead_eye_leech), Marabou Jig Leech (feather_jig_leech), Muddler Minnow (muddler_sculpin), Slim Baitfish Streamer (slim_minnow_streamer), Unweighted Baitfish (unweighted_baitfish_streamer), Zonker Streamer (zonker_streamer)

## Utilization Notes / Coverage Gaps

- 6 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Muddler Minnow, Sculpin Streamer, Rabbit-Strip Leech, Woolly Bugger, Articulated Baitfish, Conehead Streamer, Sculpzilla, Dungeon Streamer, Bucktail Streamer, Crawfish Streamer, Mouse Pattern, Ned Rig |
| underused_home_window | Jigged Marabou Leech, Lead-Eye Leech, Marabou Jig Leech, Zonker Streamer, Clouser Minnow, Slim Baitfish Streamer, Unweighted Baitfish, Baitfish Slider |
| no_home_window_coverage | None |
| over-dominant | Hair Jig, Casting Spoon, Inline Spinner, Suspending Jerkbait, Blade Bait, Floating Trout Plug |
| probably okay niche profile | Bass Popper, Deer Hair Slider, Game Changer, Soft Jerkbait |

## Trout Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 3.8% | 52/684 | 42/576 | 52 | 42 | 7.3% | 42/288 | 0/288 | 221 | underused_home_window | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):32 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 1.6% | 22/684 | 20/576 | 22 | 20 | 3.5% | 19/288 | 1/288 | 117 | underused_home_window | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):32 |
| Muddler Minnow<br>muddler_sculpin | fly | 3.7% | 51/684 | 48/576 | 51 | 48 | 8.3% | 46/288 | 2/288 | 231 | healthy | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):32 |
| Sculpin Streamer<br>sculpin_streamer | fly | 10.5% | 143/684 | 133/576 | 143 | 133 | 23.1% | 120/288 | 13/288 | 343 | healthy | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Dungeon Streamer (honorable), Sculpzilla (top):34, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):22, Crawfish Streamer (top), Woolly Bugger (honorable):22 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 2.3% | 31/684 | 28/568 | 31 | 28 | 4.9% | 20/284 | 8/284 | 120 | underused_home_window | activity neutral:496, suppressed:60, active:12<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:176, dirty_vibration:104, heat_limited_finesse:68 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 11.5% | 157/684 | 125/568 | 157 | 125 | 22% | 8/284 | 117/284 | 109 | healthy | activity neutral:496, suppressed:60, active:12<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:176, dirty_vibration:104, heat_limited_finesse:68 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33 |
| Woolly Bugger<br>woolly_bugger | fly | 10.5% | 144/684 | 129/568 | 144 | 129 | 22.7% | 119/284 | 10/284 | 226 | healthy | activity neutral:496, suppressed:60, active:12<br>clarity clear:224, stained:192, dirty:152<br>water freshwater_river:568<br>bucket cold_slow_or_front:176, dirty_vibration:104, heat_limited_finesse:68 | Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):24 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 10.8% | 148/684 | 105/432 | 148 | 105 | 24.3% | 2/192 | 103/240 | 115 | healthy | activity neutral:360, suppressed:60, active:12<br>clarity clear:144, dirty:144, stained:144<br>water freshwater_river:432<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):32, Sculpin Streamer (top), Bucktail Streamer (honorable):30 |
| Conehead Streamer<br>conehead_streamer | fly | 4.9% | 67/684 | 52/432 | 67 | 52 | 12% | 40/192 | 12/240 | 143 | healthy | activity neutral:360, suppressed:60, active:12<br>clarity clear:144, dirty:144, stained:144<br>water freshwater_river:432<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):32, Sculpin Streamer (top), Bucktail Streamer (honorable):30 |
| Sculpzilla<br>sculpzilla | fly | 10.2% | 139/684 | 107/432 | 139 | 107 | 24.8% | 0/192 | 107/240 | 90 | healthy | activity neutral:360, suppressed:60, active:12<br>clarity clear:144, dirty:144, stained:144<br>water freshwater_river:432<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):24 |
| Zonker Streamer<br>zonker_streamer | fly | 2.2% | 30/684 | 22/432 | 30 | 22 | 5.1% | 15/192 | 7/240 | 162 | underused_home_window | activity neutral:360, suppressed:60, active:12<br>clarity clear:144, dirty:144, stained:144<br>water freshwater_river:432<br>bucket dirty_vibration:108, cold_slow_or_front:98, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):32, Sculpin Streamer (top), Bucktail Streamer (honorable):30 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8.4% | 115/552 | 97/408 | 115 | 97 | 23.8% | 0/180 | 97/228 | 96 | healthy | activity neutral:336, suppressed:60, active:12<br>clarity clear:136, dirty:136, stained:136<br>water freshwater_river:408<br>bucket dirty_vibration:100, cold_slow_or_front:94, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):36, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):24 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7% | 96/684 | 65/384 | 96 | 65 | 16.9% | 55/192 | 10/192 | 147 | healthy | activity neutral:312, suppressed:60, active:12<br>clarity clear:128, dirty:128, stained:128<br>water freshwater_river:384<br>bucket dirty_vibration:108, cold_slow_or_front:88, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):31, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):23 |
| Clouser Minnow<br>clouser_minnow | fly | 0.8% | 11/684 | 4/384 | 11 | 4 | 1% | 4/192 | 0/192 | 55 | underused_home_window | activity neutral:312, suppressed:60, active:12<br>clarity clear:128, dirty:128, stained:128<br>water freshwater_river:384<br>bucket dirty_vibration:108, cold_slow_or_front:88, warming_search:68 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):31, Sculpin Streamer (top), Bucktail Streamer (honorable):30 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 3.7% | 51/528 | 14/264 | 51 | 14 | 5.3% | 13/132 | 1/132 | 21 | underused_home_window | activity neutral:204, suppressed:48, active:12<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_river:264<br>bucket dirty_vibration:72, cold_slow_or_front:60, warming_search:36 | Sculpin Streamer (top), Woolly Bugger (honorable):33, Dungeon Streamer (honorable), Sculpzilla (top):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 1.8% | 24/528 | 5/264 | 24 | 5 | 1.9% | 4/132 | 1/132 | 8 | underused_home_window | activity neutral:204, suppressed:48, active:12<br>clarity clear:88, dirty:88, stained:88<br>water freshwater_river:264<br>bucket dirty_vibration:72, cold_slow_or_front:60, warming_search:36 | Sculpin Streamer (top), Woolly Bugger (honorable):33, Dungeon Streamer (honorable), Sculpzilla (top):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 2.9% | 40/312 | 0/108 | 40 | 0 | 0% | 0/54 | 0/54 | 0 | underused_home_window | activity neutral:108<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_river:108<br>bucket dirty_vibration:28, calm_low_light_surface:24, river_elevated_runoff_current:24 | Sculpin Streamer (top), Woolly Bugger (honorable):21, Dungeon Streamer (honorable), Sculpzilla (top):11, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):9 |
| Crawfish Streamer<br>crawfish_streamer | fly | 2% | 27/84 | 27/76 | 27 | 27 | 35.5% | 18/38 | 9/38 | 49 | healthy | activity neutral:64, suppressed:12<br>clarity clear:28, dirty:24, stained:24<br>water freshwater_river:76<br>bucket cold_slow_or_front:52, dirty_vibration:16, breezy_windy_stained_reaction:4 | Sculpin Streamer (top), Woolly Bugger (honorable):14, Sculpin Streamer (top), Articulated Baitfish (honorable):9, Sculpzilla (top), Dungeon Streamer (honorable):8 |
| Mouse Pattern<br>mouse_fly | fly | 1.5% | 20/108 | 15/60 | 20 | 15 | 25% | 0/30 | 15/30 | 12 | healthy | activity neutral:60<br>clarity clear:20, dirty:20, stained:20<br>water freshwater_river:60<br>bucket stable_pleasant_high_confidence:24, cold_slow_or_front:16, calm_low_light_surface:12 | Sculpin Streamer (top), Woolly Bugger (honorable):7, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Bucktail Streamer (top), Jigged Marabou Leech (honorable):3 |
| Bass Popper<br>popper_fly | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Game Changer<br>game_changer | fly | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |
| Hair Jig<br>hair_jig | lure | 12.9% | 177/684 | 158/576 | 177 | 158 | 27.4% | 50/288 | 108/288 | 48 | over-dominant | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Drop-Shot Minnow (top), Ned Rig (honorable):40, Casting Spoon (top), Blade Bait (honorable):37, Blade Bait (top), Casting Spoon (honorable):32 |
| Ned Rig<br>ned_rig | lure | 6.5% | 89/684 | 88/576 | 89 | 88 | 15.3% | 51/288 | 37/288 | 18 | healthy | activity neutral:516, suppressed:60<br>clarity clear:216, stained:184, dirty:176<br>water freshwater_river:576<br>bucket cold_slow_or_front:176, dirty_vibration:108, heat_limited_finesse:100 | Casting Spoon (top), Blade Bait (honorable):37, Suspending Jerkbait (top), Hair Jig (honorable):36, Casting Spoon (top), Hair Jig (honorable):34 |
| Casting Spoon<br>casting_spoon | lure | 19% | 260/684 | 186/372 | 260 | 186 | 50% | 81/186 | 105/186 | 162 | over-dominant | activity neutral:300, suppressed:60, active:12<br>clarity clear:124, dirty:124, stained:124<br>water freshwater_river:372<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 | Inline Spinner (top), Blade Bait (honorable):38, Inline Spinner (top), Hair Jig (honorable):22, Inline Spinner (honorable), Suspending Jerkbait (top):18 |
| Inline Spinner<br>inline_spinner | lure | 16.3% | 223/684 | 155/372 | 223 | 155 | 41.7% | 98/186 | 57/186 | 143 | over-dominant | activity neutral:300, suppressed:60, active:12<br>clarity clear:124, dirty:124, stained:124<br>water freshwater_river:372<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 | Casting Spoon (top), Blade Bait (honorable):44, Blade Bait (top), Casting Spoon (honorable):25, Casting Spoon (top), Hair Jig (honorable):22 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 16.7% | 228/684 | 100/372 | 228 | 100 | 26.9% | 57/186 | 43/186 | 77 | over-dominant | activity neutral:300, suppressed:60, active:12<br>clarity clear:124, dirty:124, stained:124<br>water freshwater_river:372<br>bucket dirty_vibration:104, cold_slow_or_front:88, warming_search:68 | Casting Spoon (top), Blade Bait (honorable):44, Inline Spinner (top), Blade Bait (honorable):38, Blade Bait (top), Casting Spoon (honorable):25 |
| Blade Bait<br>blade_bait | lure | 15.7% | 215/324 | 183/268 | 215 | 183 | 68.3% | 99/134 | 84/134 | 58 | over-dominant | activity neutral:220, suppressed:48<br>clarity clear:100, dirty:84, stained:84<br>water freshwater_river:268<br>bucket cold_slow_or_front:120, dirty_vibration:64, warming_search:28 | Casting Spoon (top), Hair Jig (honorable):13, Hair Jig (top), Suspending Jerkbait (honorable):13, Inline Spinner (top), Hair Jig (honorable):10 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 5.6% | 77/192 | 57/108 | 77 | 57 | 52.8% | 13/54 | 44/54 | 15 | over-dominant | activity neutral:108<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_river:108<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, cold_slow_or_front:16 | Inline Spinner (top), Casting Spoon (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):9, Drop-Shot Minnow (top), Hair Jig (honorable):5 |
| Soft Jerkbait<br>soft_jerkbait | lure | 0% | 0/0 | 0/0 | 0 | 0 | 0% | 0/0 | 0/0 | 0 | probably okay niche profile | activity <br>clarity <br>water <br>bucket  |  |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | 51/288 | 37/288 | goal_tags:317, daily_condition_tags:88, forage_clarity_stack:48, seasonal_baseline:26, raw_score:9 | Upper Delaware trout river 2025-01-18 big_fish stained: lost to Hair Jig by 6 (daily_condition_tags)<br>Au Sable / Upper Midwest trout river 2025-02-11 big_fish clear: lost to Hair Jig by 6 (daily_condition_tags)<br>Au Sable / Upper Midwest trout river 2025-02-11 all_purpose clear: lost to Blade Bait by 20 (raw_score) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Delaware trout river 2025-01-18<br>big_fish stained cold_slow_or_front | 156 | Hair Jig<br>162 | 6 | daily_condition_tags | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>condition_tag:current_swing:+16<br>clarity_strength:stained:+8<br>primary_forage:leech_worm:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10<br>trout_hair_jig_dirty_current_mismatch:-16 |
| Ned Rig<br>Au Sable / Upper Midwest trout river 2025-02-11<br>big_fish clear cold_slow_or_front | 172 | Hair Jig<br>178 | 6 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>condition_tag:current_swing:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10<br>trout_hair_jig_dirty_current_mismatch:-16 |
| Ned Rig<br>Au Sable / Upper Midwest trout river 2025-02-11<br>all_purpose clear cold_slow_or_front | 188 | Blade Bait<br>208 | 20 | raw_score | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>trout_ned_rig_all_purpose_restraint:-12<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_dirty_current_lure_alternative:+14<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Au Sable / Upper Midwest trout river 2025-02-11<br>big_fish clear cold_slow_or_front | 172 | Blade Bait<br>192 | 20 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:leech_worm:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>condition_tag:current_swing:+16<br>goal:big_fish:trout_trophy_lure:+12<br>daily_lane:trout_dirty_current_lure_alternative:+14<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 27 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Delaware trout river<br>2025-07-12 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-07-12 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-07-24 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-07-24 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-07-28 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-07-28 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-08-12 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-08-12 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-08-21 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-08-21 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-09-18 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>204 | -18 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-09-18 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>170 | Drop-Shot Minnow<br>188 | -18 | avoidIds | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Au Sable / Upper Midwest trout river<br>2025-07-16 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Suspending Jerkbait<br>200 | Drop-Shot Minnow<br>204 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:trout_dirty_current_lure_alternative:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-05-23 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Madison River mountain-west trout water<br>2025-06-07 all_purpose clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Skagit River Pacific Northwest trout water<br>2025-06-14 all_purpose clear<br>calm_low_light_surface | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lower Sacramento northern California trout tailwater<br>2025-06-22 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Inline Spinner<br>202 | Drop-Shot Minnow<br>204 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:open_water_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Skagit River Pacific Northwest trout water<br>2025-08-02 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Madison River mountain-west trout water<br>2025-08-23 all_purpose clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-09-13 all_purpose clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Upper Delaware trout river<br>2025-10-04 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| White River Ozark trout tailwater<br>2025-10-14 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Suspending Jerkbait<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Au Sable / Upper Midwest trout river<br>2025-10-20 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Inline Spinner<br>186 | Drop-Shot Minnow<br>188 | -2 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:trout_finesse_minnow_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10 | base:+100<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 42/576 | 7.3% | 221 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:216, daily_condition_tags:173, forage_clarity_stack:72, raw_score:32 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):32, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):22 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 20/576 | 3.5% | 117 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:223, daily_condition_tags:196, forage_clarity_stack:43, selector_filtering_variety_jitter:41 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):32, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):22 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 28/568 | 4.9% | 120 | all_purpose / dirty / freshwater_river / dirty_vibration:52, big_fish / dirty / freshwater_river / dirty_vibration:52, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:427, daily_condition_tags:64, selector_filtering_variety_jitter:24, forage_clarity_stack:15 | Sculpin Streamer (top), Woolly Bugger (honorable):62, Dungeon Streamer (honorable), Sculpzilla (top):34, Sculpin Streamer (top), Bucktail Streamer (honorable):33, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):24 |
| Zonker Streamer<br>zonker_streamer | fly | 22/432 | 5.1% | 162 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, big_fish / clear / freshwater_river / cold_slow_or_front:28, all_purpose / clear / freshwater_river / cold_slow_or_front:26 | goal_tags:305, selector_filtering_variety_jitter:74, daily_condition_tags:28, seasonal_baseline:2 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):32, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):24 |
| Clouser Minnow<br>clouser_minnow | fly | 4/384 | 1% | 55 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:26, big_fish / clear / freshwater_river / cold_slow_or_front:26 | daily_condition_tags:178, goal_tags:151, raw_score:45, forage_clarity_stack:4 | Sculpin Streamer (top), Woolly Bugger (honorable):42, Dungeon Streamer (honorable), Sculpzilla (top):31, Sculpin Streamer (top), Bucktail Streamer (honorable):30, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):23 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 14/264 | 5.3% | 21 | all_purpose / dirty / freshwater_river / dirty_vibration:36, big_fish / dirty / freshwater_river / dirty_vibration:36, all_purpose / clear / freshwater_river / cold_slow_or_front:18, big_fish / clear / freshwater_river / cold_slow_or_front:18 | goal_tags:109, daily_condition_tags:105, seasonal_baseline:16, forage_clarity_stack:11 | Sculpin Streamer (top), Woolly Bugger (honorable):33, Dungeon Streamer (honorable), Sculpzilla (top):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20, Conehead Streamer (top), Jigged Marabou Leech (honorable):17 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 5/264 | 1.9% | 8 | all_purpose / dirty / freshwater_river / dirty_vibration:36, big_fish / dirty / freshwater_river / dirty_vibration:36, all_purpose / clear / freshwater_river / cold_slow_or_front:18, big_fish / clear / freshwater_river / cold_slow_or_front:18 | goal_tags:185, daily_condition_tags:69, seasonal_baseline:4, selector_filtering_variety_jitter:1 | Sculpin Streamer (top), Woolly Bugger (honorable):33, Dungeon Streamer (honorable), Sculpzilla (top):31, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):20, Conehead Streamer (top), Jigged Marabou Leech (honorable):17 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 0/108 | 0% | 0 | all_purpose / dirty / freshwater_river / dirty_vibration:14, big_fish / dirty / freshwater_river / dirty_vibration:14, all_purpose / clear / freshwater_river / river_elevated_runoff_current:6, all_purpose / stained / freshwater_river / river_elevated_runoff_current:6 | goal_tags:87, daily_condition_tags:21 | Sculpin Streamer (top), Woolly Bugger (honorable):21, Dungeon Streamer (honorable), Sculpzilla (top):11, Articulated Baitfish (honorable), Rabbit-Strip Leech (top):9, Sculpzilla (top), Articulated Baitfish (honorable):8 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hair Jig<br>hair_jig | lure | 158/576 | 27.4% | 48 | all_purpose / dirty / freshwater_river / dirty_vibration:54, big_fish / dirty / freshwater_river / dirty_vibration:54, all_purpose / clear / freshwater_river / cold_slow_or_front:38, big_fish / clear / freshwater_river / cold_slow_or_front:38 | goal_tags:235, daily_condition_tags:86, raw_score:29, selector_filtering_variety_jitter:29 | Drop-Shot Minnow (top), Ned Rig (honorable):40, Casting Spoon (top), Blade Bait (honorable):37, Blade Bait (top), Casting Spoon (honorable):32, Inline Spinner (top), Blade Bait (honorable):31 |
| Casting Spoon<br>casting_spoon | lure | 186/372 | 50% | 162 | all_purpose / dirty / freshwater_river / dirty_vibration:52, big_fish / dirty / freshwater_river / dirty_vibration:52, all_purpose / clear / freshwater_river / cold_slow_or_front:26, big_fish / clear / freshwater_river / cold_slow_or_front:26 | goal_tags:91, selector_filtering_variety_jitter:80, forage_clarity_stack:11, seasonal_baseline:3 | Inline Spinner (top), Blade Bait (honorable):38, Inline Spinner (top), Hair Jig (honorable):22, Inline Spinner (honorable), Suspending Jerkbait (top):18, Suspending Jerkbait (top), Hair Jig (honorable):14 |
| Inline Spinner<br>inline_spinner | lure | 155/372 | 41.7% | 143 | all_purpose / dirty / freshwater_river / dirty_vibration:52, big_fish / dirty / freshwater_river / dirty_vibration:52, all_purpose / clear / freshwater_river / cold_slow_or_front:26, big_fish / clear / freshwater_river / cold_slow_or_front:26 | goal_tags:117, selector_filtering_variety_jitter:57, daily_condition_tags:28, forage_clarity_stack:12 | Casting Spoon (top), Blade Bait (honorable):44, Blade Bait (top), Casting Spoon (honorable):25, Casting Spoon (top), Hair Jig (honorable):22, Casting Spoon (top), Floating Trout Plug (honorable):18 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 100/372 | 26.9% | 77 | all_purpose / dirty / freshwater_river / dirty_vibration:52, big_fish / dirty / freshwater_river / dirty_vibration:52, all_purpose / clear / freshwater_river / cold_slow_or_front:26, big_fish / clear / freshwater_river / cold_slow_or_front:26 | daily_condition_tags:145, goal_tags:71, selector_filtering_variety_jitter:40, seasonal_baseline:7 | Casting Spoon (top), Blade Bait (honorable):44, Inline Spinner (top), Blade Bait (honorable):38, Blade Bait (top), Casting Spoon (honorable):25, Casting Spoon (top), Hair Jig (honorable):22 |
| Blade Bait<br>blade_bait | lure | 183/268 | 68.3% | 58 | all_purpose / dirty / freshwater_river / dirty_vibration:32, big_fish / dirty / freshwater_river / dirty_vibration:32, all_purpose / clear / freshwater_river / cold_slow_or_front:28, big_fish / clear / freshwater_river / cold_slow_or_front:28 | selector_filtering_variety_jitter:45, goal_tags:11, seasonal_baseline:11, forage_clarity_stack:10 | Casting Spoon (top), Hair Jig (honorable):13, Hair Jig (top), Suspending Jerkbait (honorable):13, Inline Spinner (top), Hair Jig (honorable):10, Suspending Jerkbait (honorable), Hair Jig (top):10 |
| Floating Trout Plug<br>small_floating_trout_plug | lure | 57/108 | 52.8% | 15 | all_purpose / clear / freshwater_river / stable_pleasant_high_confidence:8, all_purpose / stained / freshwater_river / stable_pleasant_high_confidence:8, big_fish / clear / freshwater_river / stable_pleasant_high_confidence:8, big_fish / stained / freshwater_river / stable_pleasant_high_confidence:8 | goal_tags:36, selector_filtering_variety_jitter:11, seasonal_baseline:4 | Inline Spinner (top), Casting Spoon (honorable):11, Suspending Jerkbait (top), Hair Jig (honorable):9, Drop-Shot Minnow (top), Hair Jig (honorable):5, Inline Spinner (honorable), Suspending Jerkbait (top):5 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Suspending Jerkbait [lure] (29), Inline Spinner [lure] (20), Sculpin Streamer [fly] (20), Muddler Minnow [fly] (8), Drop-Shot Minnow [lure] (7) | Suspending Jerkbait [lure] (33), Inline Spinner [lure] (29), Woolly Bugger [fly] (25), Sculpin Streamer [fly] (24), Casting Spoon [lure] (23) |
| calm_surface | big_fish | Floating Trout Plug [lure] (27), Articulated Baitfish [fly] (20), Dungeon Streamer [fly] (14), Casting Spoon [lure] (13), Suspending Jerkbait [lure] (13) | Floating Trout Plug [lure] (52), Articulated Baitfish [fly] (30), Rabbit-Strip Leech [fly] (28), Sculpzilla [fly] (24), Dungeon Streamer [fly] (21) |
| low_light_surface | all_purpose | Inline Spinner [lure] (14), Sculpin Streamer [fly] (13), Suspending Jerkbait [lure] (13), Bucktail Streamer [fly] (6), Muddler Minnow [fly] (3) | Inline Spinner [lure] (22), Suspending Jerkbait [lure] (15), Casting Spoon [lure] (13), Sculpin Streamer [fly] (13), Woolly Bugger [fly] (13) |
| low_light_surface | big_fish | Casting Spoon [lure] (12), Inline Spinner [lure] (10), Articulated Baitfish [fly] (8), Dungeon Streamer [fly] (7), Sculpzilla [fly] (7) | Floating Trout Plug [lure] (22), Articulated Baitfish [fly] (15), Dungeon Streamer [fly] (15), Casting Spoon [lure] (14), Sculpzilla [fly] (14) |
| wind_reaction | all_purpose | Casting Spoon [lure] (21), Conehead Streamer [fly] (19), Inline Spinner [lure] (17), Sculpin Streamer [fly] (15), Zonker Streamer [fly] (6) | Blade Bait [lure] (33), Casting Spoon [lure] (24), Inline Spinner [lure] (22), Conehead Streamer [fly] (21), Sculpin Streamer [fly] (18) |
| wind_reaction | big_fish | Casting Spoon [lure] (23), Inline Spinner [lure] (16), Conehead Streamer [fly] (14), Bucktail Streamer [fly] (9), Sculpzilla [fly] (8) | Blade Bait [lure] (33), Casting Spoon [lure] (27), Inline Spinner [lure] (19), Sculpzilla [fly] (18), Rabbit-Strip Leech [fly] (17) |
| dirty_vibration | all_purpose | Sculpin Streamer [fly] (54), Inline Spinner [lure] (48), Casting Spoon [lure] (29), Suspending Jerkbait [lure] (27), Conehead Streamer [fly] (20) | Inline Spinner [lure] (71), Blade Bait [lure] (60), Casting Spoon [lure] (56), Sculpin Streamer [fly] (56), Woolly Bugger [fly] (42) |
| dirty_vibration | big_fish | Casting Spoon [lure] (44), Inline Spinner [lure] (43), Sculpzilla [fly] (40), Articulated Baitfish [fly] (21), Blade Bait [lure] (20) | Casting Spoon [lure] (69), Sculpzilla [fly] (56), Blade Bait [lure] (52), Articulated Baitfish [fly] (48), Inline Spinner [lure] (46) |
| clear_subtle | all_purpose | Sculpin Streamer [fly] (26), Suspending Jerkbait [lure] (25), Drop-Shot Minnow [lure] (23), Muddler Minnow [fly] (22), Lead-Eye Leech [fly] (17) | Woolly Bugger [fly] (36), Suspending Jerkbait [lure] (34), Hair Jig [lure] (30), Drop-Shot Minnow [lure] (29), Slim Baitfish Streamer [fly] (27) |
| clear_subtle | big_fish | Suspending Jerkbait [lure] (23), Rabbit-Strip Leech [fly] (17), Casting Spoon [lure] (13), Hair Jig [lure] (13), Sculpzilla [fly] (13) | Hair Jig [lure] (40), Suspending Jerkbait [lure] (36), Rabbit-Strip Leech [fly] (30), Articulated Baitfish [fly] (28), Casting Spoon [lure] (20) |
| cold_slow | all_purpose | Sculpin Streamer [fly] (47), Blade Bait [lure] (23), Suspending Jerkbait [lure] (23), Muddler Minnow [fly] (22), Casting Spoon [lure] (20) | Woolly Bugger [fly] (56), Blade Bait [lure] (49), Sculpin Streamer [fly] (48), Suspending Jerkbait [lure] (41), Casting Spoon [lure] (36) |
| cold_slow | big_fish | Sculpzilla [fly] (32), Casting Spoon [lure] (31), Rabbit-Strip Leech [fly] (27), Blade Bait [lure] (25), Suspending Jerkbait [lure] (20) | Casting Spoon [lure] (54), Blade Bait [lure] (46), Suspending Jerkbait [lure] (46), Hair Jig [lure] (43), Dungeon Streamer [fly] (42) |
| warming_search | all_purpose | Casting Spoon [lure] (18), Inline Spinner [lure] (17), Sculpin Streamer [fly] (17), Marabou Jig Leech [fly] (12), Suspending Jerkbait [lure] (9) | Blade Bait [lure] (37), Inline Spinner [lure] (22), Casting Spoon [lure] (20), Marabou Jig Leech [fly] (20), Bucktail Streamer [fly] (18) |
| warming_search | big_fish | Casting Spoon [lure] (18), Inline Spinner [lure] (16), Sculpzilla [fly] (14), Articulated Baitfish [fly] (10), Rabbit-Strip Leech [fly] (10) | Casting Spoon [lure] (26), Articulated Baitfish [fly] (23), Sculpzilla [fly] (23), Blade Bait [lure] (21), Dungeon Streamer [fly] (20) |
| heat_finesse | all_purpose | Drop-Shot Minnow [lure] (24), Suspending Jerkbait [lure] (18), Woolly Bugger [fly] (16), Inline Spinner [lure] (15), Conehead Streamer [fly] (9) | Ned Rig [lure] (32), Drop-Shot Minnow [lure] (28), Woolly Bugger [fly] (27), Suspending Jerkbait [lure] (23), Inline Spinner [lure] (19) |
| heat_finesse | big_fish | Drop-Shot Minnow [lure] (20), Rabbit-Strip Leech [fly] (20), Sculpzilla [fly] (19), Suspending Jerkbait [lure] (13), Inline Spinner [lure] (9) | Drop-Shot Minnow [lure] (32), Ned Rig [lure] (31), Rabbit-Strip Leech [fly] (28), Articulated Baitfish [fly] (24), Sculpzilla [fly] (21) |
| current_swing | all_purpose | Sculpin Streamer [fly] (78), Inline Spinner [lure] (60), Suspending Jerkbait [lure] (40), Casting Spoon [lure] (37), Conehead Streamer [fly] (20) | Inline Spinner [lure] (91), Sculpin Streamer [fly] (81), Blade Bait [lure] (76), Casting Spoon [lure] (71), Woolly Bugger [fly] (62) |
| current_swing | big_fish | Sculpzilla [fly] (65), Casting Spoon [lure] (60), Inline Spinner [lure] (50), Blade Bait [lure] (27), Articulated Baitfish [fly] (26) | Casting Spoon [lure] (93), Sculpzilla [fly] (81), Articulated Baitfish [fly] (71), Dungeon Streamer [fly] (67), Blade Bait [lure] (63) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Au Sable / Upper Midwest trout river<br>2025-09-21 clear big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, caution, low_light_surface+runoff_streamer+current_swing, high | Inline Spinner (170); Hair Jig (132); Articulated Baitfish (168); Rabbit-Strip Leech (146) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-09-21 stained big_fish B | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, caution, low_light_surface+dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (170); Hair Jig (132); Rabbit-Strip Leech (154); Articulated Baitfish (176) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| White River Ozark trout tailwater<br>2025-01-16 stained big_fish B | 31.5-55.6F, 7.6 mph wind, 0% cloud, 0.3 in precip | neutral, closed, dirty_vibration+warming_search+runoff_streamer+current_swing, high | Inline Spinner (160); Hair Jig (142); Rabbit-Strip Leech (164); Articulated Baitfish (166) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-05-18 clear big_fish B | 62.6-80.4F, 6.5 mph wind, 99.9% cloud, 0.4 in precip | neutral, caution, low_light_surface+runoff_streamer+current_swing, high | Inline Spinner (170); Hair Jig (132); Rabbit-Strip Leech (146); Articulated Baitfish (168) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-05-18 stained big_fish B | 62.6-80.4F, 6.5 mph wind, 99.9% cloud, 0.4 in precip | neutral, caution, low_light_surface+dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (170); Hair Jig (132); Rabbit-Strip Leech (154); Articulated Baitfish (176) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-06-28 stained big_fish B | 73.6-84.9F, 3.8 mph wind, 97.3% cloud, 0.4 in precip | neutral, open, calm_surface+low_light_surface+dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (170); Hair Jig (132); Rabbit-Strip Leech (154); Articulated Baitfish (176) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-07-28 stained all_purpose B | 78.8-96.4F, 4.5 mph wind, 45.7% cloud, 0 in precip | neutral, closed, heat_finesse, high | Inline Spinner (170); Ned Rig (152); Rabbit-Strip Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-08-21 stained all_purpose B | 71.7-88.4F, 4.9 mph wind, 24.2% cloud, 0.1 in precip | neutral, closed, heat_finesse, high | Inline Spinner (170); Ned Rig (152); Jigged Marabou Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-09-18 clear big_fish B | 67.2-94.5F, 4.2 mph wind, 54.6% cloud, 0 in precip | neutral, closed, clear_subtle+heat_finesse, high | Drop-Shot Minnow (162); Ned Rig (146); Slim Baitfish Streamer (146); Articulated Baitfish (140) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-09-18 stained all_purpose B | 67.2-94.5F, 4.2 mph wind, 54.6% cloud, 0 in precip | neutral, closed, heat_finesse, high | Suspending Jerkbait (170); Ned Rig (152); Rabbit-Strip Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| White River Ozark trout tailwater<br>2025-12-12 stained all_purpose B | 29-45.6F, 5.6 mph wind, 78.3% cloud, 0 in precip | neutral, closed, cold_slow, high | Blade Bait (184); Casting Spoon (148); Muddler Minnow (208); Woolly Bugger (182) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-05-23 clear all_purpose B | 56.1-85.7F, 3.7 mph wind, 0.5% cloud, 0 in precip | neutral, open, calm_surface+clear_subtle, high | Suspending Jerkbait (186); Hair Jig (176); Sculpin Streamer (172); Woolly Bugger (172) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-07-24 stained all_purpose B | 67.5-93.9F, 5.1 mph wind, 38% cloud, 0 in precip | neutral, closed, heat_finesse, high | Inline Spinner (170); Ned Rig (152); Rabbit-Strip Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-08-16 stained all_purpose B | 70.7-89.2F, 5.2 mph wind, 60.8% cloud, 0.1 in precip | neutral, closed, heat_finesse, high | Suspending Jerkbait (170); Ned Rig (152); Rabbit-Strip Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-09-15 stained all_purpose B | 67.6-95.9F, 6.5 mph wind, 0% cloud, 0 in precip | neutral, closed, heat_finesse, high | Suspending Jerkbait (170); Ned Rig (152); Rabbit-Strip Leech (168); Bucktail Streamer (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lower Sacramento northern California trout tailwater<br>2025-11-08 stained big_fish B | 51.2-77.6F, 5 mph wind, 42.5% cloud, 0 in precip | neutral, closed, dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (160); Hair Jig (142); Rabbit-Strip Leech (164); Articulated Baitfish (166) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 dirty big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, high | Blade Bait (192); Suspending Jerkbait (136); Sculpin Streamer (206); Articulated Baitfish (156) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-02-11 stained big_fish B | -5.1-20.4F, 5 mph wind, 95.1% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, high | Hair Jig (162); Suspending Jerkbait (156); Sculpin Streamer (206); Articulated Baitfish (156) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-04-24 stained all_purpose B | 46.5-69F, 6.2 mph wind, 84.7% cloud, 0 in precip | active, closed, warming_search, high | Inline Spinner (170); Blade Bait (144); Clouser Minnow (150); Marabou Jig Leech (152) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-07-16 dirty big_fish B | 67.2-85.6F, 5.5 mph wind, 65% cloud, 0.3 in precip | neutral, closed, dirty_vibration+heat_finesse+runoff_streamer+current_swing, high | Inline Spinner (162); Hair Jig (124); Sculpin Streamer (176); Woolly Bugger (160) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-09-21 dirty all_purpose A | 55.3-73F, 6.4 mph wind, 93.5% cloud, 0.4 in precip | neutral, caution, low_light_surface+dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (192); Casting Spoon (184); Sculpin Streamer (194); Woolly Bugger (178) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 dirty all_purpose B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | suppressed, closed, dirty_vibration+runoff_streamer+current_swing, high | Casting Spoon (160); Blade Bait (160); Conehead Streamer (170); Jigged Marabou Leech (168) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 stained all_purpose A | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | suppressed, closed, dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (186); Blade Bait (160); Sculpin Streamer (194); Bucktail Streamer (178) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 stained all_purpose B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | suppressed, closed, dirty_vibration+runoff_streamer+current_swing, high | Suspending Jerkbait (170); Blade Bait (160); Conehead Streamer (178); Jigged Marabou Leech (168) | SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Au Sable / Upper Midwest trout river<br>2025-10-20 stained big_fish B | 38.7-57.7F, 6.9 mph wind, 18.8% cloud, 0 in precip | suppressed, closed, dirty_vibration+runoff_streamer+current_swing, high | Inline Spinner (156); Hair Jig (132); Articulated Baitfish (176); Rabbit-Strip Leech (154) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Au Sable / Upper Midwest trout river<br>2025-12-12 dirty big_fish B | 1.7-22.9F, 7.9 mph wind, 99.6% cloud, 0.1 in precip | neutral, closed, cold_slow, high | Hair Jig (138); Casting Spoon (122); Crawfish Streamer (178); Woolly Bugger (160) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Madison River mountain-west trout water<br>2025-05-06 dirty big_fish B | 24-38.2F, 7.5 mph wind, 70.2% cloud, 0.1 in precip | suppressed, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, high | Inline Spinner (148); Hair Jig (140); Sculpzilla (178); Dungeon Streamer (184) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Madison River mountain-west trout water<br>2025-09-27 dirty all_purpose B | 36.3-64.9F, 5 mph wind, 1.6% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, high | Suspending Jerkbait (178); Hair Jig (142); Muddler Minnow (170); Bucktail Streamer (144) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Madison River mountain-west trout water<br>2025-09-27 stained all_purpose B | 36.3-64.9F, 5 mph wind, 1.6% cloud, 0 in precip | neutral, open, calm_surface+cold_slow, high | Floating Trout Plug (170); Inline Spinner (170); Sculpin Streamer (188); Bucktail Streamer (152) | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 clear big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, cold_slow+runoff_streamer+current_swing, high | Ned Rig (156); Suspending Jerkbait (156); Sculpin Streamer (206); Articulated Baitfish (148) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 dirty big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, high | Blade Bait (192); Suspending Jerkbait (136); Sculpin Streamer (206); Articulated Baitfish (156) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Upper Delaware trout river<br>2025-01-18 stained big_fish B | 12.1-31.9F, 8.2 mph wind, 94.8% cloud, 0.2 in precip | neutral, closed, dirty_vibration+cold_slow+runoff_streamer+current_swing, high | Suspending Jerkbait (156); Hair Jig (162); Sculpin Streamer (206); Articulated Baitfish (156) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
