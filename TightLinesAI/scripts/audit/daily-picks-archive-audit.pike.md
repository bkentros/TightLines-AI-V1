# FinFindr Pike Daily-Picks Archive Audit
Generated: 2026-05-12T12:57:31.878Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 70 |
| Expanded recommendation runs | 840 |
| Months | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Regions | 3 |
| Fisheries | 11 |
| Water types | freshwater_lake_pond, freshwater_river |
| Clarity split | clear:280, stained:280, dirty:280 |
| Goal split | all_purpose:420, big_fish:420 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.pike.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 12 |
| calm_bright_clear_subtle | 4 |
| breezy_windy_stained_reaction | 184 |
| dirty_vibration | 192 |
| cold_slow_or_front | 408 |
| warming_search | 156 |
| heat_limited_finesse | 24 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 240 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 840 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Green Bay / Door County pike water<br>2025-10-19 -> 2025-10-20 | changed | 2.9 | 2.8 | wind_reaction|dirty_vibration -> wind_reaction|dirty_vibration|open_water_search |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 -> 2025-09-21 | changed | 2.9 | 1.1 | wind_reaction|dirty_vibration|open_water_search -> none |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 9 | WIND_NOT_ELEVATING_REACTION (9) |
| calm_bright_clear_subtle | 3 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (5) |
| cold_slow_or_front | 10 | WIND_NOT_ELEVATING_REACTION (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| dirty_vibration | 14 | WIND_NOT_ELEVATING_REACTION (14) |
| medium_confidence_archive | 47 | WIND_NOT_ELEVATING_REACTION (34), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (13), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3) |
| stable_pleasant_medium_confidence_archive | 23 | WIND_NOT_ELEVATING_REACTION (17), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| warming_search | 13 | WIND_NOT_ELEVATING_REACTION (8), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (7) |

- WIND_NOT_ELEVATING_REACTION: 34
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 13
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 3

- sd_oahe_pike__2025-08-23__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Weedless Spoon (lure); Game Changer (fly); Deceiver (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Pike Flash Fly (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Shallow Minnowbait (lure); Game Changer (fly); Unweighted Baitfish Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-04-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Casting Spoon (lure); Game Changer (fly); Unweighted Baitfish Streamer (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Deer Hair Slider (fly); Game Changer (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Pike Spinnerbait (lure); Clouser Minnow (fly); Foam Gurgler (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Pike Flash Fly (fly); Deer Hair Slider (fly)
- sd_oahe_pike__2025-06-18__freshwater_lake_pond__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Shallow Minnowbait (lure); Large Pike Topwater (lure); Game Changer (fly); Popper Fly (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Shallow Minnowbait (lure); Articulated Baitfish Streamer (fly); Popper Fly (fly)
- nd_devils_lake_pike__2025-07-12__freshwater_lake_pond__clear__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Shallow Minnowbait (lure); Pike Glide Bait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Casting Spoon (lure); Large Jerkbait (lure); Deceiver (fly); Unweighted Baitfish Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Large Bucktail Spinner (lure); Baitfish Slider Fly (fly); Pike Flash Fly (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Pike Flash Fly (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__stained__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- sd_oahe_pike__2025-08-23__freshwater_lake_pond__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Weedless Spoon (lure); Pike Spinnerbait (lure); Game Changer (fly); Deceiver (fly)
- sd_oahe_pike__2025-08-23__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Pike Spinnerbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-09-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Large Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-09-20__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Pike Glide Bait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Casting Spoon (lure); Clouser Minnow (fly); Baitfish Slider Fly (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Jerkbait (lure); Pike Spinnerbait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Paddle Tail Pike Jig (lure); Game Changer (fly); Pike Flash Fly (fly)
- me_belgrade_pike__2025-10-25__freshwater_lake_pond__clear__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Inline Spinner (lure); Pike Glide Bait (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-11-08__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-11-08__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-11-08__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 67
- ADJACENT_DAY_EXACT_REPEAT: 4
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 2

- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Paddle Tail Pike Jig (lure); Large Jerkbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Paddle Tail Pike Jig (lure); Articulated Dungeon Streamer (fly); Articulated Pike Streamer (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- mt_fort_peck_pike__2025-03-25__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mt_fort_peck_pike__2025-03-25__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- sd_oahe_pike__2025-04-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- ny_st_lawrence_pike__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_devils_lake_pike__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Deceiver (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- mt_fort_peck_pike__2025-05-19__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- mt_fort_peck_pike__2025-05-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_devils_lake_pike__2025-06-14__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Large Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- nd_devils_lake_pike__2025-06-14__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Pike Glide Bait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Deer Hair Slider (fly)
- sd_oahe_pike__2025-06-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Pike Topwater (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Deer Hair Slider (fly)
- wi_green_bay_pike__2025-06-21__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- vt_champlain_pike__2025-06-21__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Weedless Spoon (lure); Large Rabbit Strip Streamer (fly); Frog Fly (fly)
- ny_st_lawrence_pike__2025-07-12__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Large Rabbit Strip Streamer (fly); Game Changer (fly)
- mn_mille_lacs_pike__2025-07-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Inline Spinner (lure); Large Rabbit Strip Streamer (fly); Deceiver (fly)
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Pike Spinnerbait (lure); Pike Flash Fly (fly); Large Rabbit Strip Streamer (fly)
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Deer Hair Slider (fly)
- vt_champlain_pike__2025-07-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Large Pike Topwater (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Weedless Spoon (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Shallow Minnowbait (lure); Weedless Spoon (lure); Pike Flash Fly (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-08-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-08-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- mn_mille_lacs_pike__2025-09-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Large Jerkbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Weedless Spoon (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-09-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-09-27__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-10-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-10-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | stable:1 |
| Jan | midwest_interior | cold_slow:1 |
| Jan | northeast | warming:1 |
| Feb | great_lakes_upper_midwest | cold_slow:1 |
| Feb | midwest_interior | cold_slow:1 |
| Feb | northeast | cold_slow:1 |
| Mar | great_lakes_upper_midwest | stable:1, warming:1 |
| Mar | midwest_interior | cold_slow:2, warming:1 |
| Mar | northeast | cold_slow:1, stable:1 |
| Apr | great_lakes_upper_midwest | cooling_or_shock:2 |
| Apr | midwest_interior | cold_slow:2, cooling_or_shock:1 |
| Apr | northeast | stable:2, cold_slow:1 |
| May | great_lakes_upper_midwest | stable:2 |
| May | midwest_interior | cold_slow:3 |
| May | northeast | warming:1, stable:1, cold_slow:1 |
| Jun | great_lakes_upper_midwest | warming:1, cooling_or_shock:1 |
| Jun | midwest_interior | stable:2 |
| Jun | northeast | stable:2, warming:1 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1, warming:1 |
| Jul | midwest_interior | stable:1, cooling_or_shock:1 |
| Jul | northeast | heat_limited:1, stable:1 |
| Aug | great_lakes_upper_midwest | cooling_or_shock:1, warming:1 |
| Aug | midwest_interior | stable:1, cooling_or_shock:1 |
| Aug | northeast | warming:1, stable:1 |
| Sep | great_lakes_upper_midwest | stable:2, cooling_or_shock:1 |
| Sep | midwest_interior | cold_slow:1, warming:1 |
| Sep | northeast | warming:1, stable:1 |
| Oct | great_lakes_upper_midwest | heat_limited:1, cooling_or_shock:2 |
| Oct | midwest_interior | cold_slow:1 |
| Oct | northeast | warming:2, stable:1 |
| Nov | great_lakes_upper_midwest | cold_slow:1 |
| Nov | midwest_interior | cooling_or_shock:1, cold_slow:1 |
| Nov | northeast | stable:1, cold_slow:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | midwest_interior | cold_slow:1 |
| Dec | northeast | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| St. Lawrence River pike backwater<br>2025-07-12 clear all_purpose A | 67.7-89F | Shallow Minnowbait (medium); Deceiver (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 clear all_purpose B | 67.7-89F | Inline Spinner (medium); Clouser Minnow (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 clear big_fish A | 67.7-89F | Large Jerkbait (medium); Game Changer (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 clear big_fish B | 67.7-89F | Large Bucktail Spinner (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 stained all_purpose A | 67.7-89F | Articulated Baitfish Streamer (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 stained all_purpose B | 67.7-89F | Clouser Minnow (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 stained big_fish A | 67.7-89F | Pike Spinnerbait (medium); Game Changer (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 stained big_fish B | 67.7-89F | Large Paddle-Tail Swimbait (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 dirty all_purpose A | 67.7-89F | Inline Spinner (medium); Baitfish Slider Fly (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 dirty all_purpose B | 67.7-89F | Pike Spinnerbait (medium); Clouser Minnow (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 dirty big_fish A | 67.7-89F | Pike Spinnerbait (medium); Pike Flash Fly (medium) |
| St. Lawrence River pike backwater<br>2025-07-12 dirty big_fish B | 67.7-89F | Large Paddle-Tail Swimbait (medium) |
| Lake of the Woods pike water<br>2025-10-05 clear all_purpose A | 47.9-72.9F | Large Bucktail Spinner (medium) |
| Lake of the Woods pike water<br>2025-10-05 clear all_purpose B | 47.9-72.9F | Inline Spinner (medium); Baitfish Slider Fly (medium) |
| Lake of the Woods pike water<br>2025-10-05 clear big_fish A | 47.9-72.9F | Large Jerkbait (medium) |
| Lake of the Woods pike water<br>2025-10-05 clear big_fish B | 47.9-72.9F | Large Bucktail Spinner (medium); Game Changer (medium) |
| Lake of the Woods pike water<br>2025-10-05 stained all_purpose A | 47.9-72.9F | Baitfish Slider Fly (medium) |
| Lake of the Woods pike water<br>2025-10-05 stained all_purpose B | 47.9-72.9F | Pike Spinnerbait (medium) |
| Lake of the Woods pike water<br>2025-10-05 stained big_fish A | 47.9-72.9F | Pike Spinnerbait (medium) |
| Lake of the Woods pike water<br>2025-10-05 stained big_fish B | 47.9-72.9F | Large Jerkbait (medium); Pike Flash Fly (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jul | great_lakes_upper_midwest | open | low_light | all_purpose | 3 | 69.4-81.7F | 8.1 |
| Jul | great_lakes_upper_midwest | open | low_light | big_fish | 3 | 69.4-81.7F | 8.1 |
| Jul | northeast | open | mixed | all_purpose | 4 | 69.5-83.9F | 5.4 |
| Jul | northeast | open | mixed | big_fish | 6 | 69.5-83.9F | 5.4 |
| Jun | great_lakes_upper_midwest | open | mixed | all_purpose | 4 | 63.5-78.9F | 5.2 |
| Jun | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 63.5-78.9F | 5.2 |
| Jun | midwest_interior | open | mixed | all_purpose | 3 | 62.7-81.0F | 3.4 |
| Jun | midwest_interior | open | mixed | big_fish | 5 | 62.7-81.0F | 3.4 |
| Jun | northeast | open | low_light | all_purpose | 5 | 61.2-76.1F | 5.6 |
| Jun | northeast | open | low_light | big_fish | 9 | 61.2-76.1F | 5.3 |
| Jun | northeast | open | mixed | all_purpose | 4 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |

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
| lure | 607 | 607 | 378 |
| fly | 406 | 406 | 351 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 84 | - |
| open-surface rows with 2+ surface picks | 12 | 12 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 0 | 0 |
| lure surface/surface plus fly surface/upper | 0 | 0 |

### Surface/Upper Watch Examples

None.

## Pike Cold/Open Surface Diagnostics

### Cold/Open Surface Summary

| Split | Runs |
| --- | --- |
| cold/open rows with surface picks | 0 |
| May cold/open rows | 0 |
| May rows at or below 50F high | 0 |

### Cold/Open Surface Rows

None.

## Pike Clear/Bright Diagnostics

### Clear/Bright Summary

| Split | Rows checked | Watch picks | Common selected | Common alternatives |
| --- | --- | --- | --- | --- |
| true clear-calm/glare control | 4 | 0 | None | None |
| clear breezy/wind-reaction | 16 | 11 | Pike Flash Fly (3), Large Bucktail Spinner (2), Pike Spinnerbait (2), Weedless Spoon (2) | Shallow Minnowbait (5), Game Changer (3), Large Jerkbait (2), Pike Glide Bait (1) |

### Clear/Bright Watch Rows

| Split | Scenario | Context | Selected | Close controlled/natural alternative |
| --- | --- | --- | --- | --- |
| clear breezy/wind-reaction | Missouri River backwater pike context<br>2025-04-05 all_purpose A | clear, bright, breezy, gate closed | Blade Bait (lure, 186) | Shallow Minnowbait (186) |
| clear breezy/wind-reaction | Missouri River backwater pike context<br>2025-04-05 big_fish A | clear, bright, breezy, gate closed | Pike Spinnerbait (lure, 174) | Large Jerkbait (192) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 all_purpose A | clear, glare, breezy, gate closed | Casting Spoon (lure, 184) | Shallow Minnowbait (186) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 all_purpose B | clear, glare, breezy, gate closed | Large Bucktail Spinner (lure, 190) | Shallow Minnowbait (186) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 all_purpose B | clear, glare, breezy, gate closed | Pike Flash Fly (fly, 174) | Game Changer (168) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 big_fish A | clear, glare, breezy, gate closed | Pike Flash Fly (fly, 182) | Game Changer (176) |
| clear breezy/wind-reaction | Lake Oahe prairie reservoir pike water<br>2025-08-23 all_purpose A | clear, bright, breezy, gate closed | Weedless Spoon (lure, 180) | Shallow Minnowbait (186) |
| clear breezy/wind-reaction | Lake Oahe prairie reservoir pike water<br>2025-08-23 all_purpose A | clear, bright, breezy, gate closed | Pike Spinnerbait (lure, 172) | Shallow Minnowbait (186) |
| clear breezy/wind-reaction | Lake Oahe prairie reservoir pike water<br>2025-08-23 big_fish A | clear, bright, breezy, gate closed | Weedless Spoon (lure, 182) | Pike Glide Bait (206) |
| clear breezy/wind-reaction | St. Lawrence River pike backwater<br>2025-10-04 big_fish A | clear, bright, breezy, gate closed | Large Bucktail Spinner (lure, 198) | Large Jerkbait (192) |
| clear breezy/wind-reaction | St. Lawrence River pike backwater<br>2025-10-04 big_fish A | clear, bright, breezy, gate closed | Pike Flash Fly (fly, 182) | Game Changer (176) |

## Pike Heat-Limited Diagnostics

### Heat-Limited Pike Summary

| Context | Controlled/deeper/slower | Reckless surface/fast/high-risk | Surface pick rows | Surface picks | Non-surface high-risk rows | Non-surface high-risk picks | Mixed watch | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| true_heat_limited | 8 | 2 | 0 | 0 | 0 | 0 | 14 | 24 |
| warm_adjacent | 44 | 68 | 24 | 29 | 29 | 29 | 32 | 144 |

### Heat-Limited Pike Rows

| Context | Split | Scenario | Weather/thermal | Selected picks | Heat risk split |
| --- | --- | --- | --- | --- | --- |
| true_heat_limited | reckless_surface_fast_high_risk | Lake of the Woods pike water<br>2025-10-05 clear all_purpose A | 47.9-72.9F, heat_limited | Large Bucktail Spinner (medium/mid); Pike Spinnerbait (medium/mid); Large Rabbit Strip Streamer (slow/mid); Unweighted Baitfish Streamer (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 clear all_purpose B | 47.9-72.9F, heat_limited | Inline Spinner (medium/mid); Shallow Minnowbait (medium/mid); Baitfish Slider Fly (medium/upper); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 clear big_fish A | 47.9-72.9F, heat_limited | Large Jerkbait (medium/mid); Large Paddle-Tail Swimbait (medium/mid); Articulated Pike Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | Lake of the Woods pike water<br>2025-10-05 clear big_fish B | 47.9-72.9F, heat_limited | Large Bucktail Spinner (medium/mid); Pike Spinnerbait (medium/mid); Game Changer (medium/mid); Large Rabbit Strip Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 dirty all_purpose A | 47.9-72.9F, heat_limited | Inline Spinner (medium/mid); Pike Spinnerbait (medium/mid); Game Changer (medium/mid); Baitfish Slider Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 dirty all_purpose B | 47.9-72.9F, heat_limited | Paddle Tail Pike Jig (slow/bottom); Shallow Minnowbait (medium/mid); Pike Flash Fly (medium/upper); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 dirty big_fish A | 47.9-72.9F, heat_limited | Paddle Tail Pike Jig (slow/bottom); Large Bucktail Spinner (medium/mid); Articulated Pike Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | Lake of the Woods pike water<br>2025-10-05 dirty big_fish B | 47.9-72.9F, heat_limited | Pike Spinnerbait (medium/mid); Large Jerkbait (medium/mid); Large Rabbit Strip Streamer (slow/mid); Articulated Baitfish Streamer (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 stained all_purpose A | 47.9-72.9F, heat_limited | Paddle Tail Pike Jig (slow/bottom); Casting Spoon (medium/mid); Baitfish Slider Fly (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | reckless_surface_fast_high_risk | Lake of the Woods pike water<br>2025-10-05 stained all_purpose B | 47.9-72.9F, heat_limited | Pike Spinnerbait (medium/mid); Inline Spinner (medium/mid); Large Rabbit Strip Streamer (slow/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | Lake of the Woods pike water<br>2025-10-05 stained big_fish A | 47.9-72.9F, heat_limited | Pike Spinnerbait (medium/mid); Large Paddle-Tail Swimbait (medium/mid); Large Rabbit Strip Streamer (slow/mid); Articulated Baitfish Streamer (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | Lake of the Woods pike water<br>2025-10-05 stained big_fish B | 47.9-72.9F, heat_limited | Large Jerkbait (medium/mid); Large Bucktail Spinner (medium/mid); Pike Flash Fly (medium/upper); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | St. Lawrence River pike backwater<br>2025-07-12 clear all_purpose A | 67.7-89F, heat_limited | Shallow Minnowbait (medium/mid); Blade Bait (slow/bottom); Deceiver (medium/mid); Unweighted Baitfish Streamer (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 clear all_purpose B | 67.7-89F, heat_limited | Inline Spinner (medium/mid); Paddle Tail Pike Jig (slow/bottom); Clouser Minnow (medium/mid); Baitfish Slider Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 clear big_fish A | 67.7-89F, heat_limited | Large Jerkbait (medium/mid); Pike Spinnerbait (medium/mid); Game Changer (medium/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | St. Lawrence River pike backwater<br>2025-07-12 clear big_fish B | 67.7-89F, heat_limited | Large Bucktail Spinner (medium/mid); Large Paddle-Tail Swimbait (medium/mid); Articulated Pike Streamer (slow/mid); Unweighted Baitfish Streamer (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 dirty all_purpose A | 67.7-89F, heat_limited | Inline Spinner (medium/mid); Blade Bait (slow/bottom); Baitfish Slider Fly (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 dirty all_purpose B | 67.7-89F, heat_limited | Pike Spinnerbait (medium/mid); Shallow Minnowbait (medium/mid); Clouser Minnow (medium/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 dirty big_fish A | 67.7-89F, heat_limited | Pike Spinnerbait (medium/mid); Paddle Tail Pike Jig (slow/bottom); Pike Flash Fly (medium/upper); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | St. Lawrence River pike backwater<br>2025-07-12 dirty big_fish B | 67.7-89F, heat_limited | Large Paddle-Tail Swimbait (medium/mid); Large Jerkbait (medium/mid); Large Rabbit Strip Streamer (slow/mid); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 stained all_purpose A | 67.7-89F, heat_limited | Paddle Tail Pike Jig (slow/bottom); Pike Spinnerbait (medium/mid); Articulated Baitfish Streamer (medium/mid); Baitfish Slider Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | St. Lawrence River pike backwater<br>2025-07-12 stained all_purpose B | 67.7-89F, heat_limited | Blade Bait (slow/bottom); Shallow Minnowbait (medium/mid); Clouser Minnow (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | controlled_deeper_slower_acceptable | St. Lawrence River pike backwater<br>2025-07-12 stained big_fish A | 67.7-89F, heat_limited | Pike Spinnerbait (medium/mid); Paddle Tail Pike Jig (slow/bottom); Game Changer (medium/mid); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| true_heat_limited | mixed_watch | St. Lawrence River pike backwater<br>2025-07-12 stained big_fish B | 67.7-89F, heat_limited | Large Paddle-Tail Swimbait (medium/mid); Large Bucktail Spinner (medium/mid); Large Rabbit Strip Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose A | 58.8-77.4F, warming | Inline Spinner (medium/mid); Shallow Minnowbait (medium/mid); Game Changer (medium/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose B | 58.8-77.4F, warming | Pike Spinnerbait (medium/mid); Weedless Spoon (medium/mid); Baitfish Slider Fly (medium/upper); Articulated Baitfish Streamer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish A | 58.8-77.4F, warming | Pike Glide Bait (slow/mid); Weedless Spoon (medium/mid); Game Changer (medium/mid); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish B | 58.8-77.4F, warming | Large Paddle-Tail Swimbait (medium/mid); Large Bucktail Spinner (medium/mid); Pike Flash Fly (medium/upper); Large Rabbit Strip Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose A | 58.8-77.4F, warming | Inline Spinner (medium/mid); Shallow Minnowbait (medium/mid); Baitfish Slider Fly (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose B | 58.8-77.4F, warming | Pike Spinnerbait (medium/mid); Weedless Spoon (medium/mid); Deceiver (medium/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 28 | 0 | 28 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 2 | 0 | 2 |
| same_family_same_presentation | truly_avoidable | 1 | 1 | 2 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 4 | 4 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 4 | 4 |
| same_family_different_presentation | truly_avoidable | 0 | 67 | 67 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 47 | 47 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 19 | 19 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 17 | 17 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Missouri River backwater pike context<br>2025-04-05 clear big_fish | fly top: same_family_different_presentation | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (186) | Articulated Pike Streamer (164); Game Changer (176) | Pike Flash Fly (182, alt edge 18) |
| Lake of the Woods pike water<br>2025-08-14 clear big_fish | fly honorable: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (170) | Articulated Baitfish Streamer (168); Articulated Pike Streamer (164) | Game Changer (176, alt edge 12) |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear big_fish | fly top: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (186) | Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | Game Changer (176, alt edge 12) |
| Missouri River backwater pike context<br>2025-09-29 clear big_fish | fly top: same_family_different_presentation | Large Rabbit Strip Streamer (170); Pike Flash Fly (182) | Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | Game Changer (176, alt edge 12) |
| St. Lawrence River pike backwater<br>2025-04-04 clear big_fish | fly top: same_family_different_presentation | Large Rabbit Strip Streamer (170); Pike Flash Fly (182) | Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | Game Changer (176, alt edge 12) |
| Lake of the Woods pike water<br>2025-08-14 stained all_purpose | lure honorable: same_family_same_presentation | Inline Spinner (202); Casting Spoon (184) | Shallow Minnowbait (186); Weedless Spoon (180) | Large Bucktail Spinner (190, alt edge 10) |
| Missouri River backwater pike context<br>2025-04-05 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (194) | Game Changer (176); Articulated Pike Streamer (172) | Pike Flash Fly (182, alt edge 10) |
| Missouri River backwater pike context<br>2025-04-05 stained big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (194); Articulated Baitfish Streamer (176) | Game Changer (176); Articulated Pike Streamer (172) | Pike Flash Fly (182, alt edge 10) |
| St. Lawrence River pike backwater<br>2025-11-11 stained big_fish | fly honorable: same_family_different_presentation | Rabbit-Strip Leech (164); Large Rabbit Strip Streamer (188) | Game Changer (156); Articulated Pike Streamer (166) | Bucktail Streamer (174, alt edge 8) |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear big_fish | fly honorable: same_family_different_presentation | Articulated Pike Streamer (164); Pike Flash Fly (182) | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | Game Changer (176, alt edge 6) |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose | fly top: same_family_different_presentation | Articulated Pike Streamer (152); Pike Flash Fly (158) | Large Rabbit Strip Streamer (158); Deceiver (168) | Baitfish Slider Fly (164, alt edge 6) |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 clear big_fish | fly honorable: same_family_different_presentation | Articulated Pike Streamer (164); Pike Flash Fly (182) | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | Game Changer (176, alt edge 6) |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish | fly honorable: same_family_different_presentation | Game Changer (156); Articulated Baitfish Streamer (162) | Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | Large Rabbit Strip Streamer (172, alt edge 4) |
| Missouri River backwater pike context<br>2025-03-26 stained big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (194); Rabbit-Strip Leech (150) | Game Changer (176); Articulated Pike Streamer (172) | Articulated Baitfish Streamer (176, alt edge 4) |
| Missouri River backwater pike context<br>2025-09-29 dirty big_fish | fly honorable: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (178) | Game Changer (176); Articulated Pike Streamer (172) | Articulated Baitfish Streamer (176, alt edge 4) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Devils Lake prairie pike water<br>2025-01-26 clear | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Jerkbait; Large Rabbit Strip Streamer; Rabbit-Strip Leech |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Bucktail Spinner; Rabbit-Strip Leech; Large Rabbit Strip Streamer |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained | A | 3/4 | Pike Spinnerbait; Paddle Tail Pike Jig; Articulated Pike Streamer; Articulated Baitfish Streamer | Pike Spinnerbait; Pike Glide Bait; Articulated Pike Streamer; Articulated Baitfish Streamer |
| Mille Lacs / Upper Midwest pike lake<br>2025-11-08 stained | A | 3/4 | Paddle Tail Pike Jig; Blade Bait; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Bucktail Spinner; Large Rabbit Strip Streamer; Rabbit-Strip Leech |
| Lake Oahe prairie reservoir pike water<br>2025-11-11 clear | B | 3/4 | Large Bucktail Spinner; Blade Bait; Articulated Baitfish Streamer; Large Rabbit Strip Streamer | Large Paddle-Tail Swimbait; Large Bucktail Spinner; Large Rabbit Strip Streamer; Articulated Baitfish Streamer |
| St. Lawrence River pike backwater<br>2025-11-11 dirty | A | 3/4 | Large Pike Tube; Paddle Tail Pike Jig; Deceiver; Rabbit-Strip Leech | Large Pike Tube; Paddle Tail Pike Jig; Large Rabbit Strip Streamer; Rabbit-Strip Leech |
| Devils Lake prairie pike water<br>2025-11-15 dirty | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Game Changer | Paddle Tail Pike Jig; Large Bucktail Spinner; Game Changer; Rabbit-Strip Leech |
| Devils Lake prairie pike water<br>2025-12-12 dirty | A | 3/4 | Paddle Tail Pike Jig; Blade Bait; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Paddle-Tail Swimbait; Large Rabbit Strip Streamer; Rabbit-Strip Leech |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Pike Big Fish Upside Split Diagnostics

### Pike Big Fish Upside Split Summary

| Class | Picks | Share | Common profiles |
| --- | --- | --- | --- |
| controlled_upside | 1541 | 91.7% | Large Rabbit Strip Streamer [fly] (193), Large Bucktail Spinner [lure] (170), Articulated Pike Streamer [fly] (155), Large Paddle-Tail Swimbait [lure] (152), Articulated Baitfish Streamer [fly] (140) |
| high_risk_or_reckless_upside | 133 | 7.9% | Pike Glide Bait [lure] (76), Articulated Dungeon Streamer [fly] (23), Large Pike Topwater [lure] (15), Frog Fly [fly] (12), Deer Hair Slider [fly] (7) |
| no_explicit_upside | 6 | 0.4% | Unweighted Baitfish Streamer [fly] (3), Blade Bait [lure] (1), Deceiver [fly] (1), Deep-Diving Crankbait [lure] (1) |

### High-Risk/Reckless Pike Big Fish Upside Rows

| Scenario | Pick | Class | Reasons |
| --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 dirty A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 clear B | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 stained A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 dirty A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 clear B | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 stained A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-05-08 stained B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 stained B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Oahe prairie reservoir pike water<br>2025-05-18 clear B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 stained B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-05-23 clear B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-05-23 dirty A | Pike Glide Bait (lure, 182) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 clear A | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 stained A | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 dirty A | Pike Glide Bait (lure, 166) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 clear A | Large Pike Topwater (lure, 178) | high_risk_or_reckless_upside | high_risk_high_reward |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Rabbit Strip Streamer (164, alt edge 8) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge 10) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Rabbit Strip Streamer (172, alt edge 10) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Paddle Tail Pike Jig (182; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20); Large Paddle-Tail Swimbait (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (178, alt edge -4) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (164, alt edge 10) | goal fit likely competed |
| Lake Champlain pike water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (132; goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (130; goal:all_purpose:versatile_search:+12) | Deceiver (148, alt edge 16) | goal fit likely competed |
| Lake Champlain pike water<br>2025-01-18 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Rabbit-Strip Leech (146; goal:all_purpose:reliable_action:+18); Articulated Baitfish Streamer (138; goal:all_purpose:versatile_search:+12) | Large Rabbit Strip Streamer (152, alt edge 6) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-03-28 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Shallow Minnowbait (178; condition_tag:warming_search:+16, condition_tag:open_water_search:+0, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Paddle Tail Pike Jig (166; condition_tag:dirty_vibration:+16, goal:all_purpose:reliable_action:+18) | Inline Spinner (194, alt edge 16) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-04-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-04-30 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Pike Flash Fly (182, alt edge 6) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Pike Glide Bait (174; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Large Paddle-Tail Swimbait (166; goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (182, alt edge 8) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-05-23 stained big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Large Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Paddle Tail Pike Jig (168; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (198, alt edge 16) | goal fit likely competed |
| St. Lawrence River pike backwater<br>2025-06-17 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Deer Hair Slider (166; condition_tag:low_light_surface:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Pike Flash Fly (182, alt edge 6) | goal fit likely competed |
| St. Lawrence River pike backwater<br>2025-06-17 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (178; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Foam Gurgler (176; condition_tag:low_light_surface:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 6) | goal fit likely competed |
| St. Lawrence River pike backwater<br>2025-06-17 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Large Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Paddle Tail Pike Jig (168; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (190, alt edge 8) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Large Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Pike Glide Bait (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Large Bucktail Spinner (198, alt edge 8) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-07-24 dirty all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Popper Fly (162; condition_tag:low_light_surface:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear all_purpose A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Casting Spoon (184; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Large Jerkbait (172; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16) | Pike Glide Bait (174, alt edge -10) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear all_purpose B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Baitfish Slider Fly (180; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Pike Flash Fly (174; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Unweighted Baitfish Streamer (180, alt edge 0) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Large Jerkbait (192; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Large Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Pike Glide Bait (206, alt edge 14) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear big_fish B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Articulated Pike Streamer (164; condition_tag:wind_reaction:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Unweighted Baitfish Streamer (168, alt edge -8) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Pike Glide Bait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Paddle Tail Pike Jig (168; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (190, alt edge 8) | goal fit likely competed |
| Devils Lake prairie pike water<br>2025-08-21 stained all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Devils Lake prairie pike water<br>2025-08-21 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Large Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Paddle Tail Pike Jig (168; condition_tag:dirty_vibration:+16, goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (190, alt edge 8) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 21 |
| clear_subtle_wind_watch | 11 |
| surface_low_light_acceptable | 1 |
| current_open_water_acceptable | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Lake of the Woods pike water<br>2025-01-16 big_fish clear B | stable_pleasant_medium_confidence_archive<br>neutral | Large Paddle-Tail Swimbait 168<br>Large Bucktail Spinner 178 |
| clear_subtle_wind_watch | Lake Champlain pike water<br>2025-01-18 all_purpose clear A | warming_search<br>neutral | Paddle Tail Pike Jig 156<br>Large Jerkbait 136 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>neutral | Large Bucktail Spinner 190<br>Shallow Minnowbait 186 |
| clear_subtle_wind_watch | Green Bay / Door County pike water<br>2025-04-18 all_purpose clear A | cold_slow_or_front<br>active | Shallow Minnowbait 186<br>Casting Spoon 184 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest pike lake<br>2025-05-15 big_fish clear B | medium_confidence_archive<br>neutral | Pike Glide Bait 174<br>Large Paddle-Tail Swimbait 166 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 all_purpose stained B | breezy_windy_stained_reaction<br>neutral | Large Bucktail Spinner 170<br>Paddle Tail Pike Jig 180 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 172<br>Large Bucktail Spinner 178 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Paddle Tail Pike Jig 182<br>Large Paddle-Tail Swimbait 168 |
| dirty_vibration_acceptable | Lake of the Woods pike water<br>2025-01-16 all_purpose dirty B | dirty_vibration<br>neutral | Paddle Tail Pike Jig 180<br>Casting Spoon 156 |
| dirty_vibration_acceptable | Lake Champlain pike water<br>2025-01-18 all_purpose dirty A | dirty_vibration<br>neutral | Paddle Tail Pike Jig 180<br>Casting Spoon 140 |
| surface_low_light_acceptable | Green Bay / Door County pike water<br>2025-07-24 all_purpose dirty A | dirty_vibration<br>active | Casting Spoon 176<br>Shallow Minnowbait 178 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-09-20 big_fish stained B | breezy_windy_stained_reaction<br>active | Pike Glide Bait 190<br>Large Jerkbait 192 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 226 |
| acceptable_fit | 847 |
| strong_fit | 2287 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 61 |
| watch | big_fish | A | fly | cold_slow_or_front | 39 |
| watch | all_purpose | A | fly | medium_confidence_archive | 38 |
| watch | big_fish | B | fly | medium_confidence_archive | 30 |
| watch | big_fish | A | lure | medium_confidence_archive | 25 |
| watch | big_fish | B | lure | medium_confidence_archive | 25 |
| watch | all_purpose | A | lure | medium_confidence_archive | 23 |
| watch | all_purpose | A | fly | cold_slow_or_front | 22 |
| watch | big_fish | B | lure | cold_slow_or_front | 21 |
| watch | big_fish | A | lure | cold_slow_or_front | 20 |
| watch | big_fish | B | fly | cold_slow_or_front | 19 |
| watch | all_purpose | B | fly | medium_confidence_archive | 16 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 13 |
| watch | all_purpose | A | lure | cold_slow_or_front | 10 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 10 |
| watch | all_purpose | B | fly | cold_slow_or_front | 10 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 9 |
| watch | all_purpose | A | fly | dirty_vibration | 8 |
| watch | all_purpose | B | lure | medium_confidence_archive | 8 |
| watch | big_fish | A | fly | dirty_vibration | 7 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 7 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 6 |
| watch | big_fish | B | fly | dirty_vibration | 6 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 5 |
| watch | all_purpose | A | fly | warming_search | 5 |
| watch | all_purpose | B | lure | cold_slow_or_front | 5 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 4 |
| watch | big_fish | A | fly | warming_search | 4 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 4 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | A | fly | heat_limited_finesse | 3 |
| watch | all_purpose | A | lure | warming_search | 3 |
| watch | big_fish | A | fly | heat_limited_finesse | 3 |
| watch | big_fish | A | lure | dirty_vibration | 3 |
| watch | all_purpose | A | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | fly | dirty_vibration | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | B | lure | heat_limited_finesse | 2 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 2 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 2 |
| watch | big_fish | A | lure | heat_limited_finesse | 2 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 2 |
| watch | big_fish | B | fly | heat_limited_finesse | 2 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | lure | dirty_vibration | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | A | lure | warming_search | 1 |
| watch | big_fish | B | fly | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| watch | big_fish | B | lure | warming_search | 1 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 132 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 127 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 120 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 112 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 100 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 91 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 91 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 74 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 55 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 50 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 49 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 46 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 44 |
| acceptable_fit | all_purpose | A | fly | cold_slow_or_front | 43 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 43 |
| acceptable_fit | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 36 |
| acceptable_fit | big_fish | B | fly | warming_search | 36 |
| acceptable_fit | all_purpose | B | lure | warming_search | 35 |
| acceptable_fit | big_fish | B | lure | warming_search | 35 |
| acceptable_fit | big_fish | A | lure | warming_search | 34 |
| acceptable_fit | big_fish | A | fly | warming_search | 32 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 31 |
| acceptable_fit | all_purpose | A | fly | warming_search | 29 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 29 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 28 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 27 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 27 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 3 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 3 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| St. Lawrence River pike backwater<br>2025-05-06 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 stained all_purpose A | Large Pike Tube (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 stained all_purpose A | Clouser Minnow (honorable_fly, fly, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-06-17 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 dirty big_fish A | Large Pike Tube (lure_of_the_day, lure, score 198) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 dirty all_purpose A | Clouser Minnow (fly_of_the_day, fly, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-06-17 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 dirty all_purpose B | Inline Spinner (lure_of_the_day, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 dirty big_fish A | Large Rabbit Strip Streamer (fly_of_the_day, fly, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 stained big_fish A | Large Rabbit Strip Streamer (honorable_fly, fly, score 188) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-06-17 stained all_purpose A | Clouser Minnow (honorable_fly, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-06-17 stained all_purpose B | Shallow Minnowbait (honorable_lure, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 stained all_purpose B | Bucktail Streamer (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 stained all_purpose B | Shallow Minnowbait (honorable_lure, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 dirty all_purpose A | Deceiver (honorable_fly, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 dirty big_fish A | Large Jerkbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 stained all_purpose B | Casting Spoon (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-05-06 stained all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 2208 | 1387 | 63% |
| clear_subtle | 304 | 31 | 10% |
| dirty_vibration | 1536 | 364 | 24% |
| heat_finesse | 96 | 0 | 0% |
| cold_slow | 1056 | 412 | 39% |
| low_light_surface | 144 | 23 | 16% |
| calm_surface | 240 | 59 | 25% |
| Big Fish upside | 1680 | 1674 | 100% |
| All Purpose reliable/versatile | 1680 | 1550 | 92% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Large Bucktail Spinner [lure] (268), Large Rabbit Strip Streamer [fly] (266), Game Changer [fly] (231), Articulated Baitfish Streamer [fly] (226), Paddle Tail Pike Jig [lure] (211), Pike Spinnerbait [lure] (206), Pike Flash Fly [fly] (203), Articulated Pike Streamer [fly] (179), Large Jerkbait [lure] (164), Deceiver [fly] (160), Large Paddle-Tail Swimbait [lure] (154), Inline Spinner [lure] (151) |
| All-purpose | Deceiver [fly] (159), Inline Spinner [lure] (151), Baitfish Slider Fly [fly] (143), Shallow Minnowbait [lure] (128), Paddle Tail Pike Jig [lure] (104), Game Changer [fly] (101), Large Bucktail Spinner [lure] (98), Pike Spinnerbait [lure] (96) |
| Big-fish | Large Rabbit Strip Streamer [fly] (193), Large Bucktail Spinner [lure] (170), Articulated Pike Streamer [fly] (155), Large Paddle-Tail Swimbait [lure] (152), Articulated Baitfish Streamer [fly] (140), Large Jerkbait [lure] (140), Game Changer [fly] (130), Pike Flash Fly [fly] (114) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 14 | 14 | 0 | 0 | 4 |
| fly | 16 | 16 | 0 | 0 | 4 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 268/840 | 31.9% | big_fish:170, all_purpose:98 | A:135, B:133 | honorable:146, top:122 | clear:106, stained:86, dirty:76 | freshwater_lake_pond:229, freshwater_river:39 | wind_reaction:207, open_water_search:170, dirty_vibration:132, cold_slow:79 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/840 | 31.7% | big_fish:193, all_purpose:73 | A:144, B:122 | top:171, honorable:95 | stained:92, dirty:88, clear:86 | freshwater_lake_pond:238, freshwater_river:28 | wind_reaction:187, open_water_search:147, dirty_vibration:130, cold_slow:108 |
| Game Changer<br>game_changer | fly | 231/840 | 27.5% | big_fish:130, all_purpose:101 | A:135, B:96 | honorable:122, top:109 | clear:93, dirty:69, stained:69 | freshwater_lake_pond:208, freshwater_river:23 | wind_reaction:142, open_water_search:135, dirty_vibration:93, cold_slow:61 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 226/840 | 26.9% | big_fish:140, all_purpose:86 | A:114, B:112 | honorable:140, top:86 | dirty:89, stained:78, clear:59 | freshwater_lake_pond:212, freshwater_river:14 | wind_reaction:140, open_water_search:130, dirty_vibration:114, cold_slow:63 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 211/840 | 25.1% | big_fish:107, all_purpose:104 | A:134, B:77 | top:113, honorable:98 | dirty:89, stained:84, clear:38 | freshwater_lake_pond:185, freshwater_river:26 | wind_reaction:148, dirty_vibration:134, cold_slow:133, open_water_search:108 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 206/732 | 28.1% | big_fish:110, all_purpose:96 | A:112, B:94 | honorable:119, top:87 | dirty:89, stained:71, clear:46 | freshwater_lake_pond:176, freshwater_river:30 | wind_reaction:122, dirty_vibration:98, open_water_search:96, warming_search:46 |
| Pike Flash Fly<br>pike_flash_fly | fly | 203/540 | 37.6% | big_fish:114, all_purpose:89 | A:102, B:101 | honorable:110, top:93 | clear:69, stained:68, dirty:66 | freshwater_lake_pond:176, freshwater_river:27 | wind_reaction:149, open_water_search:111, dirty_vibration:97, warming_search:46 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 179/840 | 21.3% | big_fish:155, all_purpose:24 | B:104, A:75 | top:100, honorable:79 | dirty:69, stained:63, clear:47 | freshwater_lake_pond:155, freshwater_river:24 | wind_reaction:133, dirty_vibration:99, open_water_search:97, cold_slow:49 |
| Large Jerkbait<br>pike_jerkbait | lure | 164/840 | 19.5% | big_fish:140, all_purpose:24 | A:82, B:82 | top:84, honorable:80 | clear:66, stained:53, dirty:45 | freshwater_lake_pond:140, freshwater_river:24 | wind_reaction:135, open_water_search:118, dirty_vibration:83, cold_slow:46 |
| Deceiver<br>deceiver | fly | 160/840 | 19% | all_purpose:159, big_fish:1 | B:83, A:77 | honorable:81, top:79 | clear:59, dirty:52, stained:49 | freshwater_lake_pond:145, freshwater_river:15 | wind_reaction:118, open_water_search:97, dirty_vibration:78, cold_slow:47 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 154/840 | 18.3% | big_fish:152, all_purpose:2 | B:84, A:70 | honorable:80, top:74 | dirty:55, clear:54, stained:45 | freshwater_lake_pond:130, freshwater_river:24 | wind_reaction:91, open_water_search:83, dirty_vibration:61, cold_slow:47 |
| Inline Spinner<br>inline_spinner | lure | 151/624 | 24.2% | all_purpose:151 | B:93, A:58 | top:109, honorable:42 | clear:52, dirty:51, stained:48 | freshwater_lake_pond:125, freshwater_river:26 | wind_reaction:96, open_water_search:78, dirty_vibration:63, warming_search:38 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 143/624 | 22.9% | all_purpose:143 | B:94, A:49 | top:78, honorable:65 | dirty:49, clear:48, stained:46 | freshwater_lake_pond:119, freshwater_river:24 | wind_reaction:92, open_water_search:74, dirty_vibration:61, warming_search:35 |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 128/732 | 17.5% | all_purpose:128 | B:84, A:44 | top:70, honorable:58 | clear:48, stained:43, dirty:37 | freshwater_lake_pond:114, freshwater_river:14 | wind_reaction:63, open_water_search:61, dirty_vibration:41, warming_search:32 |
| Weedless Spoon<br>weedless_spoon | lure | 115/360 | 31.9% | big_fish:65, all_purpose:50 | B:59, A:56 | honorable:64, top:51 | clear:41, stained:39, dirty:35 | freshwater_lake_pond:115 | wind_reaction:61, open_water_search:41, dirty_vibration:39, calm_surface:24 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 111/840 | 13.2% | all_purpose:61, big_fish:50 | A:66, B:45 | honorable:65, top:46 | stained:42, clear:35, dirty:34 | freshwater_lake_pond:101, freshwater_river:10 | cold_slow:86, wind_reaction:66, open_water_search:54, dirty_vibration:49 |
| Casting Spoon<br>casting_spoon | lure | 82/840 | 9.8% | all_purpose:82 | A:44, B:38 | honorable:55, top:27 | clear:30, stained:28, dirty:24 | freshwater_lake_pond:66, freshwater_river:16 | wind_reaction:72, open_water_search:63, dirty_vibration:45, warming_search:22 |
| Blade Bait<br>blade_bait | lure | 81/840 | 9.6% | all_purpose:80, big_fish:1 | A:59, B:22 | top:42, honorable:39 | clear:36, stained:24, dirty:21 | freshwater_lake_pond:70, freshwater_river:11 | cold_slow:60, wind_reaction:48, open_water_search:40, dirty_vibration:31 |
| Pike Glide Bait<br>pike_glidebait | lure | 79/432 | 18.3% | big_fish:76, all_purpose:3 | B:49, A:30 | honorable:43, top:36 | clear:30, stained:25, dirty:24 | freshwater_lake_pond:79 | wind_reaction:42, open_water_search:39, dirty_vibration:28, warming_search:15 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 45/624 | 7.2% | all_purpose:42, big_fish:3 | A:27, B:18 | honorable:29, top:16 | clear:28, stained:12, dirty:5 | freshwater_lake_pond:38, freshwater_river:7 | clear_subtle:19, wind_reaction:14, cold_slow:13, open_water_search:12 |
| Clouser Minnow<br>clouser_minnow | fly | 24/108 | 22.2% | all_purpose:24 | B:15, A:9 | top:14, honorable:10 | stained:9, clear:8, dirty:7 | freshwater_river:24 | open_water_search:21, wind_reaction:21, dirty_vibration:14, warming_search:11 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 23/108 | 21.3% | big_fish:23 | B:15, A:8 | top:14, honorable:9 | dirty:8, stained:8, clear:7 | freshwater_lake_pond:23 | cold_slow:17, wind_reaction:17, dirty_vibration:12, open_water_search:9 |
| Deer Hair Slider<br>deer_hair_slider | fly | 22/108 | 20.4% | big_fish:19, all_purpose:3 | A:12, B:10 | honorable:14, top:8 | dirty:9, stained:7, clear:6 | freshwater_lake_pond:19, freshwater_river:3 | calm_surface:18, warming_search:8, low_light_surface:7, open_water_search:4 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 19/108 | 17.6% | all_purpose:18, big_fish:1 | B:18, A:1 | top:12, honorable:7 | dirty:8, stained:6, clear:5 | freshwater_lake_pond:19 | cold_slow:19, wind_reaction:12, dirty_vibration:9, open_water_search:8 |
| Popper Fly<br>popper_fly | fly | 18/108 | 16.7% | all_purpose:18 | A:10, B:8 | top:10, honorable:8 | clear:6, dirty:6, stained:6 | freshwater_lake_pond:18 | calm_surface:15, low_light_surface:6, warming_search:6, clear_subtle:3 |
| Large Pike Topwater<br>large_pike_topwater | lure | 16/96 | 16.7% | big_fish:15, all_purpose:1 | A:10, B:6 | honorable:9, top:7 | clear:6, stained:6, dirty:4 | freshwater_lake_pond:16 | calm_surface:15, low_light_surface:4, warming_search:4, clear_subtle:3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 15/108 | 13.9% | all_purpose:15 | A:9, B:6 | top:11, honorable:4 | stained:7, clear:4, dirty:4 | freshwater_river:15 | open_water_search:15, wind_reaction:15, dirty_vibration:11, current_swing:8 |
| Frog Fly<br>frog_fly | fly | 12/96 | 12.5% | big_fish:12 | B:9, A:3 | honorable:7, top:5 | clear:4, dirty:4, stained:4 | freshwater_lake_pond:12 | calm_surface:11, low_light_surface:4, warming_search:4, clear_subtle:2 |
| Large Pike Tube<br>large_pike_tube | lure | 6/12 | 50% | all_purpose:3, big_fish:3 | A:5, B:1 | top:6 | clear:2, dirty:2, stained:2 | freshwater_river:6 | cold_slow:6, current_swing:6, open_water_search:6, wind_reaction:6 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2/12 | 16.7% | all_purpose:2 | B:2 | honorable:2 | clear:1, dirty:1 | freshwater_river:2 | low_light_surface:2, open_water_search:2, warming_search:2, wind_reaction:2 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 268/3360 (8%) | 122/1680 (7.3%) | 146/1680 (8.7%) | 268/1680 (16%) | - |  |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/3360 (7.9%) | 171/1680 (10.2%) | 95/1680 (5.7%) | - | 266/1680 (15.8%) |  |
| Game Changer<br>game_changer | fly | 231/3360 (6.9%) | 109/1680 (6.5%) | 122/1680 (7.3%) | - | 231/1680 (13.8%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 226/3360 (6.7%) | 86/1680 (5.1%) | 140/1680 (8.3%) | - | 226/1680 (13.5%) |  |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 211/3360 (6.3%) | 113/1680 (6.7%) | 98/1680 (5.8%) | 211/1680 (12.6%) | - |  |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 206/3360 (6.1%) | 87/1680 (5.2%) | 119/1680 (7.1%) | 206/1680 (12.3%) | - |  |
| Pike Flash Fly<br>pike_flash_fly | fly | 203/3360 (6%) | 93/1680 (5.5%) | 110/1680 (6.5%) | - | 203/1680 (12.1%) |  |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 179/3360 (5.3%) | 100/1680 (6%) | 79/1680 (4.7%) | - | 179/1680 (10.7%) |  |
| Large Jerkbait<br>pike_jerkbait | lure | 164/3360 (4.9%) | 84/1680 (5%) | 80/1680 (4.8%) | 164/1680 (9.8%) | - |  |
| Deceiver<br>deceiver | fly | 160/3360 (4.8%) | 79/1680 (4.7%) | 81/1680 (4.8%) | - | 160/1680 (9.5%) |  |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 154/3360 (4.6%) | 74/1680 (4.4%) | 80/1680 (4.8%) | 154/1680 (9.2%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 151/3360 (4.5%) | 109/1680 (6.5%) | 42/1680 (2.5%) | 151/1680 (9%) | - |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 143/3360 (4.3%) | 78/1680 (4.6%) | 65/1680 (3.9%) | - | 143/1680 (8.5%) |  |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 128/3360 (3.8%) | 70/1680 (4.2%) | 58/1680 (3.5%) | 128/1680 (7.6%) | - |  |
| Weedless Spoon<br>weedless_spoon | lure | 115/3360 (3.4%) | 51/1680 (3%) | 64/1680 (3.8%) | 115/1680 (6.8%) | - |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 111/3360 (3.3%) | 46/1680 (2.7%) | 65/1680 (3.9%) | - | 111/1680 (6.6%) |  |
| Casting Spoon<br>casting_spoon | lure | 82/3360 (2.4%) | 27/1680 (1.6%) | 55/1680 (3.3%) | 82/1680 (4.9%) | - |  |
| Blade Bait<br>blade_bait | lure | 81/3360 (2.4%) | 42/1680 (2.5%) | 39/1680 (2.3%) | 81/1680 (4.8%) | - |  |
| Pike Glide Bait<br>pike_glidebait | lure | 79/3360 (2.4%) | 36/1680 (2.1%) | 43/1680 (2.6%) | 79/1680 (4.7%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 45/3360 (1.3%) | 16/1680 (1%) | 29/1680 (1.7%) | - | 45/1680 (2.7%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 24/3360 (0.7%) | 14/1680 (0.8%) | 10/1680 (0.6%) | - | 24/1680 (1.4%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 23/3360 (0.7%) | 14/1680 (0.8%) | 9/1680 (0.5%) | - | 23/1680 (1.4%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 22/3360 (0.7%) | 8/1680 (0.5%) | 14/1680 (0.8%) | - | 22/1680 (1.3%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 19/3360 (0.6%) | 12/1680 (0.7%) | 7/1680 (0.4%) | 19/1680 (1.1%) | - |  |
| Popper Fly<br>popper_fly | fly | 18/3360 (0.5%) | 10/1680 (0.6%) | 8/1680 (0.5%) | - | 18/1680 (1.1%) |  |
| Large Pike Topwater<br>large_pike_topwater | lure | 16/3360 (0.5%) | 7/1680 (0.4%) | 9/1680 (0.5%) | 16/1680 (1%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 15/3360 (0.4%) | 11/1680 (0.7%) | 4/1680 (0.2%) | - | 15/1680 (0.9%) |  |
| Frog Fly<br>frog_fly | fly | 12/3360 (0.4%) | 5/1680 (0.3%) | 7/1680 (0.4%) | - | 12/1680 (0.7%) |  |
| Large Pike Tube<br>large_pike_tube | lure | 6/3360 (0.2%) | 6/1680 (0.4%) | 0/1680 (0%) | 6/1680 (0.4%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 2/3360 (0.1%) | 0/1680 (0%) | 2/1680 (0.1%) | - | 2/1680 (0.1%) |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Pike Flash Fly<br>pike_flash_fly | fly | 203/540 | 37.6% | big_fish:114, all_purpose:89 | wind_reaction:149, open_water_search:111, dirty_vibration:97, warming_search:46, cold_slow:40 |
| Weedless Spoon<br>weedless_spoon | lure | 115/360 | 31.9% | big_fish:65, all_purpose:50 | wind_reaction:61, open_water_search:41, dirty_vibration:39, calm_surface:24, warming_search:22 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 268/840 | 31.9% | big_fish:170, all_purpose:98 | wind_reaction:207, open_water_search:170, dirty_vibration:132, cold_slow:79, warming_search:47 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/840 | 31.7% | big_fish:193, all_purpose:73 | wind_reaction:187, open_water_search:147, dirty_vibration:130, cold_slow:108, warming_search:37 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 206/732 | 28.1% | big_fish:110, all_purpose:96 | wind_reaction:122, dirty_vibration:98, open_water_search:96, warming_search:46, cold_slow:41 |
| Game Changer<br>game_changer | fly | 231/840 | 27.5% | big_fish:130, all_purpose:101 | wind_reaction:142, open_water_search:135, dirty_vibration:93, cold_slow:61, warming_search:39 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 226/840 | 26.9% | big_fish:140, all_purpose:86 | wind_reaction:140, open_water_search:130, dirty_vibration:114, cold_slow:63, warming_search:33 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 211/840 | 25.1% | big_fish:107, all_purpose:104 | wind_reaction:148, dirty_vibration:134, cold_slow:133, open_water_search:108, warming_search:22 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Pike Glide Bait<br>pike_glidebait | lure | home-window >30% severe | 41/106 | 38.7% | selector_filtering_variety_jitter:39 | AP/BF 0/0, 41/106<br>clarity clear:50, stained:32, dirty:24<br>bucket cold_slow_or_front:26, stable_pleasant_medium_confidence_archive:26, warming_search:24 |
| Pike Flash Fly<br>pike_flash_fly | fly | home-window >30% severe | 200/532 | 37.6% | seasonal_baseline:120 | AP/BF 87/266, 113/266<br>clarity dirty:180, clear:176, stained:176<br>bucket breezy_windy_stained_reaction:116, dirty_vibration:116, stable_pleasant_medium_confidence_archive:100 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | home-window >30% severe | 266/816 | 32.6% | goal_tags:281 | AP/BF 73/396, 193/420<br>clarity dirty:280, clear:268, stained:268<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | home-window >30% severe | 258/792 | 32.6% | goal_tags:267 | AP/BF 97/396, 161/396<br>clarity dirty:280, clear:256, stained:256<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | home-window >30% severe | 142/440 | 32.3% | daily_condition_tags:132 | AP/BF 71/220, 71/220<br>clarity dirty:244, stained:196<br>bucket dirty_vibration:164, breezy_windy_stained_reaction:156, warming_search:48 |
| Weedless Spoon<br>weedless_spoon | lure | home-window >30% severe | 115/360 | 31.9% | goal_tags:95 | AP/BF 50/180, 65/180<br>clarity clear:120, dirty:120, stained:120<br>bucket stable_pleasant_medium_confidence_archive:88, dirty_vibration:72, breezy_windy_stained_reaction:68 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >25% overdominant | 213/792 | 26.9% | daily_condition_tags:338 | AP/BF 81/396, 132/396<br>clarity dirty:280, clear:256, stained:256<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 |
| Game Changer<br>game_changer | fly | home-window >25% overdominant | 213/792 | 26.9% | daily_condition_tags:327 | AP/BF 92/396, 121/396<br>clarity dirty:280, clear:256, stained:256<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >25% overdominant | 22/84 | 26.2% | goal_tags:39 | AP/BF 3/42, 19/42<br>clarity clear:28, dirty:28, stained:28<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:20, calm_low_light_surface:12 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | home-window >25% overdominant | 209/800 | 26.1% | goal_tags:191 | AP/BF 102/400, 107/400<br>clarity dirty:280, clear:260, stained:260<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 |
| Inline Spinner<br>inline_spinner | lure | home-window >20% watch | 131/528 | 24.8% | goal_tags:262 | AP/BF 131/264, 0/264<br>clarity dirty:208, clear:160, stained:160<br>bucket breezy_windy_stained_reaction:128, dirty_vibration:128, warming_search:92 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | home-window >20% watch | 139/592 | 23.5% | goal_tags:312 | AP/BF 139/296, 0/296<br>clarity dirty:208, clear:192, stained:192<br>bucket breezy_windy_stained_reaction:128, dirty_vibration:128, stable_pleasant_medium_confidence_archive:108 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | home-window >20% watch | 179/816 | 21.9% | goal_tags:355 | AP/BF 24/396, 155/420<br>clarity dirty:280, clear:268, stained:268<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 |
| Popper Fly<br>popper_fly | fly | home-window >20% watch | 18/84 | 21.4% | goal_tags:42 | AP/BF 18/42, 0/42<br>clarity clear:28, dirty:28, stained:28<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:20, calm_low_light_surface:12 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >20% watch | 23/108 | 21.3% | daily_condition_tags:38 | AP/BF 0/54, 23/54<br>clarity clear:36, dirty:36, stained:36<br>bucket cold_slow_or_front:44, breezy_windy_stained_reaction:28, dirty_vibration:28 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pike Glide Bait<br>pike_glidebait | lure | 79/3360 (2.4%) | 36/1680 (2.1%) | 43/1680 (2.6%) | 79/1680 (4.7%) | 41/106 (38.7%) | 20/106 (18.9%) / 21/106 (19.8%) | home>20%<br>home>25%<br>home>30% |
| Pike Flash Fly<br>pike_flash_fly | fly | 203/3360 (6%) | 93/1680 (5.5%) | 110/1680 (6.5%) | 203/1680 (12.1%) | 200/532 (37.6%) | 92/532 (17.3%) / 108/532 (20.3%) | home>20%<br>home>25%<br>home>30% |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/3360 (7.9%) | 171/1680 (10.2%) | 95/1680 (5.7%) | 266/1680 (15.8%) | 266/816 (32.6%) | 171/816 (21%) / 95/816 (11.6%) | home>20%<br>home>25%<br>home>30% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 268/3360 (8%) | 122/1680 (7.3%) | 146/1680 (8.7%) | 268/1680 (16%) | 258/792 (32.6%) | 118/792 (14.9%) / 140/792 (17.7%) | home>20%<br>home>25%<br>home>30% |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 206/3360 (6.1%) | 87/1680 (5.2%) | 119/1680 (7.1%) | 206/1680 (12.3%) | 142/440 (32.3%) | 69/440 (15.7%) / 73/440 (16.6%) | home>20%<br>home>25%<br>home>30% |
| Weedless Spoon<br>weedless_spoon | lure | 115/3360 (3.4%) | 51/1680 (3%) | 64/1680 (3.8%) | 115/1680 (6.8%) | 115/360 (31.9%) | 51/360 (14.2%) / 64/360 (17.8%) | home>20%<br>home>25%<br>home>30% |
| Game Changer<br>game_changer | fly | 231/3360 (6.9%) | 109/1680 (6.5%) | 122/1680 (7.3%) | 231/1680 (13.8%) | 213/792 (26.9%) | 105/792 (13.3%) / 108/792 (13.6%) | home>20%<br>home>25% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 226/3360 (6.7%) | 86/1680 (5.1%) | 140/1680 (8.3%) | 226/1680 (13.5%) | 213/792 (26.9%) | 82/792 (10.4%) / 131/792 (16.5%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 22/3360 (0.7%) | 8/1680 (0.5%) | 14/1680 (0.8%) | 22/1680 (1.3%) | 22/84 (26.2%) | 8/84 (9.5%) / 14/84 (16.7%) | home>20%<br>home>25% |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 211/3360 (6.3%) | 113/1680 (6.7%) | 98/1680 (5.8%) | 211/1680 (12.6%) | 209/800 (26.1%) | 113/800 (14.1%) / 96/800 (12%) | home>20%<br>home>25% |
| Inline Spinner<br>inline_spinner | lure | 151/3360 (4.5%) | 109/1680 (6.5%) | 42/1680 (2.5%) | 151/1680 (9%) | 131/528 (24.8%) | 98/528 (18.6%) / 33/528 (6.3%) | home>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 143/3360 (4.3%) | 78/1680 (4.6%) | 65/1680 (3.9%) | 143/1680 (8.5%) | 139/592 (23.5%) | 76/592 (12.8%) / 63/592 (10.6%) | home>20% |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 179/3360 (5.3%) | 100/1680 (6%) | 79/1680 (4.7%) | 179/1680 (10.7%) | 179/816 (21.9%) | 100/816 (12.3%) / 79/816 (9.7%) | home>20% |
| Popper Fly<br>popper_fly | fly | 18/3360 (0.5%) | 10/1680 (0.6%) | 8/1680 (0.5%) | 18/1680 (1.1%) | 18/84 (21.4%) | 10/84 (11.9%) / 8/84 (9.5%) | home>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 23/3360 (0.7%) | 14/1680 (0.8%) | 9/1680 (0.5%) | 23/1680 (1.4%) | 23/108 (21.3%) | 14/108 (13%) / 9/108 (8.3%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.32.
Average expanded finalist pool size: 3.40.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1229.
Rows/slots with expanded finalist pool size 1: 501.
Selected-tier singleton slots expanded above 1: 728.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.10 | 3.53 | 1 | 1 | 348 | 98 |
| fly/top | 2.14 | 3.62 | 1 | 1 | 322 | 121 |
| lure/honorable | 2.52 | 3.24 | 1 | 1 | 274 | 123 |
| lure/top | 2.53 | 3.21 | 1 | 1 | 285 | 159 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 2299 |
| goal_or_priority_condition | 1058 |
| credible_fallback | 3 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2529 |
| goal_and_priority_condition | 2299 |
| credible_fallback | 129 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 275 |
| family_diversity_scarcity | 216 |
| surface_safety_scarcity | 10 |

Representative expanded singleton finalist pools:
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B lure/top: blade_bait (goal_or_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B fly/top: deceiver (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B lure/honorable: large_bucktail_spinner (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/honorable: pike_jig_and_plastic (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B lure/honorable: large_profile_pike_swimbait (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B fly/honorable: pike_bunny_streamer (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B lure/honorable: large_bucktail_spinner (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B fly/top: large_articulated_pike_streamer (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__B lure/honorable: casting_spoon (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B lure/honorable: large_profile_pike_swimbait (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/honorable: large_articulated_pike_streamer (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B lure/top: blade_bait (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: deceiver (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.61 |
| Different-presentation close candidates | 1.69 |
| Different-family close candidates | 2.27 |
| Final expanded Set B pool | 2.21 |
| Same-family/same-presentation reintroduced | 29/1680 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 384 |
| Coverage pool used | 73 |
| Average used coverage pool size | 3.34 |
| Singleton used coverage pools | 9 |
| Broad pool larger than narrowed pool | 49 |
| Broad pool same as narrowed pool | 24 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 311 |
| broad | 73 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| large_bucktail_spinner | 46 |
| pike_spinnerbait | 44 |
| casting_spoon | 42 |
| pike_jerkbait | 42 |
| pike_jig_and_plastic | 39 |
| weedless_spoon | 16 |
| inline_spinner | 15 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| pike_jig_and_plastic | 21 |
| large_bucktail_spinner | 13 |
| pike_jerkbait | 13 |
| pike_spinnerbait | 13 |
| weedless_spoon | 7 |
| casting_spoon | 5 |
| inline_spinner | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 2928 | 0 | 0 |
| caution | 96 | 0 | 0 |

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Pike Tube<br>large_pike_tube | lure | northern_pike | pike_tube | pike_tube | bottom<br>slow/medium | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: cold_slow, current_swing, cover_ambush | 2: big_fish_upside, reliable_action | freshwater_lake_pond, freshwater_river | false | 10 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Frog Fly<br>frog_fly | fly | largemouth_bass, northern_pike | fly_frog | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | northern_pike | large_spinner | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: clear, stained | 3: wind_reaction, dirty_vibration, open_water_search | 2: big_fish_upside, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | northern_pike | pike_spinnerbait | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 9 |
| Weedless Spoon<br>weedless_spoon | lure | northern_pike | spoon | blade_spoon | mid<br>medium/slow | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: cover_ambush, wind_reaction | 2: reliable_action, big_fish_upside | freshwater_lake_pond | false | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | northern_pike | streamer_pike_large | pike_bunny_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, cover_ambush, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Pike Flash Fly<br>pike_flash_fly | fly | northern_pike | pike_flash_fly | pike_flash_fly | upper<br>medium/fast | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 2: big_fish_upside, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | northern_pike | pike_swimbait | swimbait | mid<br>medium/slow | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, cover_ambush | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Large Pike Topwater<br>large_pike_topwater | lure | northern_pike | large_pike_surface | topwater_open | surface<br>medium/slow | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | northern_pike | pike_jig | pike_jig | bottom<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: cold_slow, dirty_vibration | 2: big_fish_upside, reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Pike Glide Bait<br>pike_glidebait | lure | northern_pike | pike_glidebait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 2: open_water_search, clear_subtle | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Shallow Minnowbait<br>shallow_minnowbait | lure | northern_pike | pike_minnowbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 2: open_water_search, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | northern_pike | streamer_pike_large | big_articulated_streamer | mid<br>slow/medium | 1: baitfish | 2: stained, dirty | 2: wind_reaction, cover_ambush | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 6 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 2: open_water_search, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Large Jerkbait<br>pike_jerkbait | lure | northern_pike | pike_jerkbait | jerkbait | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: wind_reaction, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 226/840 | 213/792 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 23/108 | 23/108 | goal_tags>1<br>home-window share>20% |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 179/840 | 179/816 | home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 143/624 | 139/592 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 24/108 | 7/32 | goal_tags>1 |
| Deceiver<br>deceiver | fly | 7 | 160/840 | 155/792 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 22/108 | 22/84 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 2/12 | 2/12 | clear+stained+dirty clarity<br>goal_tags>1 |
| Frog Fly<br>frog_fly | fly | 9 | 12/96 | 12/72 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 231/840 | 213/792 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 266/840 | 266/816 | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Flash Fly<br>pike_flash_fly | fly | 8 | 203/540 | 200/532 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Popper Fly<br>popper_fly | fly | 8 | 18/108 | 18/84 | goal_tags>1<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 111/840 | 93/792 | goal_tags>1<br>reliable_action+big_fish_upside |
| Blade Bait<br>blade_bait | lure | 7 | 81/840 | 0/0 | clear+stained+dirty clarity |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 19/108 | 9/56 | clear+stained+dirty clarity |
| Inline Spinner<br>inline_spinner | lure | 8 | 151/624 | 131/528 | goal_tags>1<br>home-window share>20% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 268/840 | 258/792 | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 154/840 | 154/816 | clear+stained+dirty clarity |
| Large Pike Topwater<br>large_pike_topwater | lure | 8 | 16/96 | 16/72 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Large Pike Tube<br>large_pike_tube | lure | 10 | 6/12 | 6/12 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20% |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 211/840 | 209/800 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Pike Glide Bait<br>pike_glidebait | lure | 8 | 79/432 | 41/106 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 9 | 206/732 | 142/440 | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 7 | 128/732 | 0/0 | goal_tags>1<br>open_water+warming+versatile |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 115/360 | 115/360 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 268/840 (31.9%) | 258/792 (32.6%) | big_fish:170, all_purpose:98 | honorable:146, top:122 | wind_reaction:207, open_water_search:170, dirty_vibration:132, cold_slow:79, warming_search:47 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 266/840 (31.7%) | 266/816 (32.6%) | big_fish:193, all_purpose:73 | top:171, honorable:95 | wind_reaction:187, open_water_search:147, dirty_vibration:130, cold_slow:108, warming_search:37 |
| Game Changer<br>game_changer | fly | 7 | 231/840 (27.5%) | 213/792 (26.9%) | big_fish:130, all_purpose:101 | honorable:122, top:109 | wind_reaction:142, open_water_search:135, dirty_vibration:93, cold_slow:61, warming_search:39 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 226/840 (26.9%) | 213/792 (26.9%) | big_fish:140, all_purpose:86 | honorable:140, top:86 | wind_reaction:140, open_water_search:130, dirty_vibration:114, cold_slow:63, warming_search:33 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 211/840 (25.1%) | 209/800 (26.1%) | big_fish:107, all_purpose:104 | top:113, honorable:98 | wind_reaction:148, dirty_vibration:134, cold_slow:133, open_water_search:108, warming_search:22 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 9 | 206/732 (28.1%) | 142/440 (32.3%) | big_fish:110, all_purpose:96 | honorable:119, top:87 | wind_reaction:122, dirty_vibration:98, open_water_search:96, warming_search:46, cold_slow:41 |
| Pike Flash Fly<br>pike_flash_fly | fly | 8 | 203/540 (37.6%) | 200/532 (37.6%) | big_fish:114, all_purpose:89 | honorable:110, top:93 | wind_reaction:149, open_water_search:111, dirty_vibration:97, warming_search:46, cold_slow:40 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 179/840 (21.3%) | 179/816 (21.9%) | big_fish:155, all_purpose:24 | top:100, honorable:79 | wind_reaction:133, dirty_vibration:99, open_water_search:97, cold_slow:49, warming_search:35 |
| Large Jerkbait<br>pike_jerkbait | lure | 6 | 164/840 (19.5%) | 164/824 (19.9%) | big_fish:140, all_purpose:24 | top:84, honorable:80 | wind_reaction:135, open_water_search:118, dirty_vibration:83, cold_slow:46, warming_search:28 |
| Deceiver<br>deceiver | fly | 7 | 160/840 (19%) | 155/792 (19.6%) | all_purpose:159, big_fish:1 | honorable:81, top:79 | wind_reaction:118, open_water_search:97, dirty_vibration:78, cold_slow:47, warming_search:28 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 154/840 (18.3%) | 154/816 (18.9%) | big_fish:152, all_purpose:2 | honorable:80, top:74 | wind_reaction:91, open_water_search:83, dirty_vibration:61, cold_slow:47, warming_search:33 |
| Inline Spinner<br>inline_spinner | lure | 8 | 151/624 (24.2%) | 131/528 (24.8%) | all_purpose:151 | top:109, honorable:42 | wind_reaction:96, open_water_search:78, dirty_vibration:63, warming_search:38, cold_slow:33 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 143/624 (22.9%) | 139/592 (23.5%) | all_purpose:143 | top:78, honorable:65 | wind_reaction:92, open_water_search:74, dirty_vibration:61, warming_search:35, cold_slow:31 |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 7 | 128/732 (17.5%) | 0/0 | all_purpose:128 | top:70, honorable:58 | wind_reaction:63, open_water_search:61, dirty_vibration:41, warming_search:32, cold_slow:24 |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 115/360 (31.9%) | 115/360 (31.9%) | big_fish:65, all_purpose:50 | honorable:64, top:51 | wind_reaction:61, open_water_search:41, dirty_vibration:39, calm_surface:24, warming_search:22 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 111/840 (13.2%) | 93/792 (11.7%) | all_purpose:61, big_fish:50 | honorable:65, top:46 | cold_slow:86, wind_reaction:66, open_water_search:54, dirty_vibration:49, warming_search:10 |
| Casting Spoon<br>casting_spoon | lure | 6 | 82/840 (9.8%) | 81/808 (10%) | all_purpose:82 | honorable:55, top:27 | wind_reaction:72, open_water_search:63, dirty_vibration:45, warming_search:22, cold_slow:10 |
| Blade Bait<br>blade_bait | lure | 7 | 81/840 (9.6%) | 0/0 | all_purpose:80, big_fish:1 | top:42, honorable:39 | cold_slow:60, wind_reaction:48, open_water_search:40, dirty_vibration:31, clear_subtle:16 |
| Pike Glide Bait<br>pike_glidebait | lure | 8 | 79/432 (18.3%) | 41/106 (38.7%) | big_fish:76, all_purpose:3 | honorable:43, top:36 | wind_reaction:42, open_water_search:39, dirty_vibration:28, warming_search:15, clear_subtle:12 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 45/624 (7.2%) | 38/592 (6.4%) | all_purpose:42, big_fish:3 | honorable:29, top:16 | clear_subtle:19, wind_reaction:14, cold_slow:13, open_water_search:12, warming_search:9 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 24/108 (22.2%) | 7/32 (21.9%) | all_purpose:24 | top:14, honorable:10 | open_water_search:21, wind_reaction:21, dirty_vibration:14, warming_search:11, current_swing:9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 23/108 (21.3%) | 23/108 (21.3%) | big_fish:23 | top:14, honorable:9 | cold_slow:17, wind_reaction:17, dirty_vibration:12, open_water_search:9, warming_search:3 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 22/108 (20.4%) | 22/84 (26.2%) | big_fish:19, all_purpose:3 | honorable:14, top:8 | calm_surface:18, warming_search:8, low_light_surface:7, open_water_search:4, wind_reaction:4 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 19/108 (17.6%) | 9/56 (16.1%) | all_purpose:18, big_fish:1 | top:12, honorable:7 | cold_slow:19, wind_reaction:12, dirty_vibration:9, open_water_search:8, clear_subtle:2 |
| Popper Fly<br>popper_fly | fly | 8 | 18/108 (16.7%) | 18/84 (21.4%) | all_purpose:18 | top:10, honorable:8 | calm_surface:15, low_light_surface:6, warming_search:6, clear_subtle:3, open_water_search:3 |
| Large Pike Topwater<br>large_pike_topwater | lure | 8 | 16/96 (16.7%) | 16/72 (22.2%) | big_fish:15, all_purpose:1 | honorable:9, top:7 | calm_surface:15, low_light_surface:4, warming_search:4, clear_subtle:3, open_water_search:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 15/108 (13.9%) | 15/108 (13.9%) | all_purpose:15 | top:11, honorable:4 | open_water_search:15, wind_reaction:15, dirty_vibration:11, current_swing:8, cold_slow:6 |
| Frog Fly<br>frog_fly | fly | 9 | 12/96 (12.5%) | 12/72 (16.7%) | big_fish:12 | honorable:7, top:5 | calm_surface:11, low_light_surface:4, warming_search:4, clear_subtle:2, open_water_search:1 |
| Large Pike Tube<br>large_pike_tube | lure | 10 | 6/12 (50%) | 6/12 (50%) | all_purpose:3, big_fish:3 | top:6 | cold_slow:6, current_swing:6, open_water_search:6, wind_reaction:6, dirty_vibration:4 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 2/12 (16.7%) | 2/12 (16.7%) | all_purpose:2 | honorable:2 | low_light_surface:2, open_water_search:2, warming_search:2, wind_reaction:2, dirty_vibration:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 268/840 (31.9%) | 258/792 (32.6%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/840 (31.7%) | 266/816 (32.6%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Game Changer<br>game_changer | fly | 231/840 (27.5%) | 213/792 (26.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 226/840 (26.9%) | 213/792 (26.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 211/840 (25.1%) | 209/800 (26.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 206/732 (28.1%) | 142/440 (32.3%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Flash Fly<br>pike_flash_fly | fly | 203/540 (37.6%) | 200/532 (37.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 179/840 (21.3%) | 179/816 (21.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Inline Spinner<br>inline_spinner | lure | 151/624 (24.2%) | 131/528 (24.8%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 143/624 (22.9%) | 139/592 (23.5%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Weedless Spoon<br>weedless_spoon | lure | 115/360 (31.9%) | 115/360 (31.9%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Glide Bait<br>pike_glidebait | lure | 79/432 (18.3%) | 41/106 (38.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 23/108 (21.3%) | 23/108 (21.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 22/108 (20.4%) | 22/84 (26.2%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Popper Fly<br>popper_fly | fly | 18/108 (16.7%) | 18/84 (21.4%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 808 | 81/808 (10%) | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):28, Inline Spinner (top), Pike Spinnerbait (honorable):27, Inline Spinner (top), Shallow Minnowbait (honorable):27, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):23 | selector/direct-score or overpowered competitors |
| Weedless Spoon<br>weedless_spoon | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: cover_ambush, wind_reaction<br>goal 2: reliable_action, big_fish_upside | 360 | 115/360 (31.9%) | Inline Spinner (top), Pike Spinnerbait (honorable):20, Inline Spinner (top), Shallow Minnowbait (honorable):13, Large Bucktail Spinner (top), Pike Glide Bait (honorable):8, Pike Spinnerbait (top), Inline Spinner (honorable):8 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 528 | 131/528 (24.8%) | Large Bucktail Spinner (top), Pike Spinnerbait (honorable):19, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):19, Pike Spinnerbait (top), Large Bucktail Spinner (honorable):16, Large Bucktail Spinner (top), Large Jerkbait (honorable):12 | healthy / not underused |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 3: wind_reaction, dirty_vibration, open_water_search<br>goal 2: big_fish_upside, versatile_search | 792 | 258/792 (32.6%) | Inline Spinner (top), Shallow Minnowbait (honorable):28, Inline Spinner (top), Pike Spinnerbait (honorable):27, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):20, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):18 | healthy / not underused |
| Pike Spinnerbait<br>pike_spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 440 | 142/440 (32.3%) | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):17, Large Bucktail Spinner (top), Paddle Tail Pike Jig (honorable):13, Inline Spinner (top), Shallow Minnowbait (honorable):12, Inline Spinner (top), Paddle Tail Pike Jig (honorable):11 | healthy / not underused |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: open_water_search, cover_ambush<br>goal 1: big_fish_upside | 816 | 154/816 (18.9%) | Inline Spinner (top), Shallow Minnowbait (honorable):28, Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):28, Inline Spinner (top), Pike Spinnerbait (honorable):27, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):23 | healthy / not underused |
| Large Jerkbait<br>pike_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: wind_reaction, open_water_search<br>goal 1: big_fish_upside | 824 | 164/824 (19.9%) | Inline Spinner (top), Shallow Minnowbait (honorable):28, Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):28, Inline Spinner (top), Pike Spinnerbait (honorable):27, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):23 | healthy / not underused |
| Pike Glide Bait<br>pike_glidebait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: open_water_search, clear_subtle<br>goal 2: big_fish_upside, high_risk_high_reward | 106 | 41/106 (38.7%) | Large Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):7, Large Jerkbait (top), Weedless Spoon (honorable):6, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):4, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):4 | healthy / not underused |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: cold_slow, dirty_vibration<br>goal 2: big_fish_upside, reliable_action | 800 | 209/800 (26.1%) | Inline Spinner (top), Pike Spinnerbait (honorable):26, Inline Spinner (top), Shallow Minnowbait (honorable):26, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):22, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):21 | healthy / not underused |
| Large Pike Tube<br>large_pike_tube | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: cold_slow, current_swing, cover_ambush<br>goal 2: big_fish_upside, reliable_action | 12 | 6/12 (50%) | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):2, Blade Bait (top), Casting Spoon (honorable):1, Blade Bait (top), Large Bucktail Spinner (honorable):1, Large Jerkbait (top), Paddle Tail Pike Jig (honorable):1 | healthy / not underused |
| Large Pike Topwater<br>large_pike_topwater | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 72 | 16/72 (22.2%) | Shallow Minnowbait (top), Weedless Spoon (honorable):5, Inline Spinner (top), Pike Spinnerbait (honorable):4, Inline Spinner (top), Shallow Minnowbait (honorable):4, Pike Spinnerbait (top), Weedless Spoon (honorable):3 | healthy / not underused |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, cover_ambush, cold_slow<br>goal 1: big_fish_upside | 816 | 266/816 (32.6%) | Articulated Pike Streamer (top), Articulated Baitfish Streamer (honorable):28, Articulated Pike Streamer (top), Game Changer (honorable):27, Game Changer (top), Articulated Pike Streamer (honorable):26, Baitfish Slider Fly (top), Pike Flash Fly (honorable):23 | healthy / not underused |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, cover_ambush<br>goal 1: big_fish_upside | 816 | 179/816 (21.9%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):47, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):35, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):32, Large Rabbit Strip Streamer (top), Game Changer (honorable):28 | healthy / not underused |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 792 | 213/792 (26.9%) | Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):35, Articulated Pike Streamer (top), Game Changer (honorable):27, Game Changer (top), Articulated Pike Streamer (honorable):26, Large Rabbit Strip Streamer (top), Game Changer (honorable):23 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 108 | 15/108 (13.9%) | Game Changer (top), Articulated Pike Streamer (honorable):8, Large Rabbit Strip Streamer (top), Game Changer (honorable):6, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):6, Baitfish Slider Fly (top), Clouser Minnow (honorable):4 | healthy / not underused |
| Deceiver<br>deceiver | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 792 | 155/792 (19.6%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):45, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):35, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):31, Articulated Pike Streamer (top), Game Changer (honorable):27 | healthy / not underused |
| Pike Flash Fly<br>pike_flash_fly | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 2: big_fish_upside, versatile_search | 532 | 200/532 (37.6%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):24, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):18, Articulated Pike Streamer (top), Articulated Baitfish Streamer (honorable):18, Articulated Pike Streamer (top), Game Changer (honorable):15 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Game Changer (game_changer), Inline Spinner (inline_spinner), Large Bucktail Spinner (large_bucktail_spinner), Paddle Tail Pike Jig (pike_jig_and_plastic), Pike Flash Fly (pike_flash_fly), Pike Glide Bait (pike_glidebait), Pike Spinnerbait (pike_spinnerbait), Popper Fly (popper_fly), Weedless Spoon (weedless_spoon)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Articulated Dungeon Streamer (articulated_dungeon_streamer), Articulated Pike Streamer (large_articulated_pike_streamer), Baitfish Slider Fly (baitfish_slider_fly), Deer Hair Slider (deer_hair_slider), Game Changer (game_changer), Inline Spinner (inline_spinner), Large Bucktail Spinner (large_bucktail_spinner), Large Rabbit Strip Streamer (pike_bunny_streamer), Paddle Tail Pike Jig (pike_jig_and_plastic), Pike Flash Fly (pike_flash_fly), Pike Glide Bait (pike_glidebait), Pike Spinnerbait (pike_spinnerbait), Popper Fly (popper_fly), Weedless Spoon (weedless_spoon)

### Probably selector problem, not catalog problem
Casting Spoon (casting_spoon)

## Utilization Notes / Coverage Gaps

- 8 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Pike Streamer, Deceiver, Rabbit-Strip Leech, Baitfish Slider Fly, Articulated Dungeon Streamer, Bucktail Streamer, Deer Hair Slider, Popper Fly, Frog Fly, Foam Gurgler, Large Jerkbait, Large Paddle-Tail Swimbait, Casting Spoon, Inline Spinner, Large Pike Topwater, Large Pike Tube |
| underused_home_window | Unweighted Baitfish Streamer |
| no_home_window_coverage | None |
| over-dominant | Large Rabbit Strip Streamer, Articulated Baitfish Streamer, Game Changer, Pike Flash Fly, Paddle Tail Pike Jig, Large Bucktail Spinner, Pike Spinnerbait, Weedless Spoon, Pike Glide Bait |
| probably okay niche profile | None |

## Pike Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 10.7% | 179/840 | 179/816 | 179 | 179 | 21.9% | 24/396 | 155/420 | 201 | healthy | activity neutral:564, active:192, suppressed:60<br>clarity dirty:280, clear:268, stained:268<br>water freshwater_lake_pond:712, freshwater_river:104<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):44, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):26, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):26 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 15.8% | 266/840 | 266/816 | 266 | 266 | 32.6% | 73/396 | 193/420 | 367 | over-dominant | activity neutral:564, active:192, suppressed:60<br>clarity dirty:280, clear:268, stained:268<br>water freshwater_lake_pond:712, freshwater_river:104<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 | Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):23, Baitfish Slider Fly (top), Pike Flash Fly (honorable):23, Game Changer (honorable), Articulated Pike Streamer (top):22 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 13.5% | 226/840 | 213/792 | 226 | 213 | 26.9% | 81/396 | 132/396 | 309 | over-dominant | activity neutral:548, active:192, suppressed:52<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 | Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):22 |
| Deceiver<br>deceiver | fly | 9.5% | 160/840 | 155/792 | 160 | 155 | 19.6% | 154/396 | 1/396 | 390 | healthy | activity neutral:548, active:192, suppressed:52<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):42, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 |
| Game Changer<br>game_changer | fly | 13.8% | 231/840 | 213/792 | 231 | 213 | 26.9% | 92/396 | 121/396 | 362 | over-dominant | activity neutral:548, active:192, suppressed:52<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):42, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 6.6% | 111/840 | 93/792 | 111 | 93 | 11.7% | 51/396 | 42/396 | 65 | healthy | activity neutral:548, active:192, suppressed:52<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):42, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 8.5% | 143/624 | 139/592 | 143 | 139 | 23.5% | 139/296 | 0/296 | 248 | healthy | activity neutral:400, active:192<br>clarity dirty:208, clear:192, stained:192<br>water freshwater_lake_pond:496, freshwater_river:96<br>bucket breezy_windy_stained_reaction:128, dirty_vibration:128, stable_pleasant_medium_confidence_archive:108 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):27, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):20, Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):18 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 2.7% | 45/624 | 38/592 | 45 | 38 | 6.4% | 36/296 | 2/296 | 99 | underused_home_window | activity neutral:400, active:192<br>clarity dirty:208, clear:192, stained:192<br>water freshwater_lake_pond:496, freshwater_river:96<br>bucket breezy_windy_stained_reaction:128, dirty_vibration:128, stable_pleasant_medium_confidence_archive:108 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):27, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):20 |
| Pike Flash Fly<br>pike_flash_fly | fly | 12.1% | 203/540 | 200/532 | 203 | 200 | 37.6% | 87/266 | 113/266 | 266 | over-dominant | activity neutral:364, active:168<br>clarity dirty:180, clear:176, stained:176<br>water freshwater_lake_pond:448, freshwater_river:84<br>bucket breezy_windy_stained_reaction:116, dirty_vibration:116, stable_pleasant_medium_confidence_archive:100 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):23, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):16, Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):14 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 1.4% | 23/108 | 23/108 | 23 | 23 | 21.3% | 0/54 | 23/54 | 24 | healthy | activity neutral:72, suppressed:36<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:108<br>bucket cold_slow_or_front:44, breezy_windy_stained_reaction:28, dirty_vibration:28 | Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):13, Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):9, Large Rabbit Strip Streamer (top), Game Changer (honorable):6 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.9% | 15/108 | 15/108 | 15 | 15 | 13.9% | 15/54 | 0/54 | 73 | healthy | activity neutral:72, active:36<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_river:108<br>bucket breezy_windy_stained_reaction:32, dirty_vibration:32, warming_search:16 | Game Changer (top), Articulated Pike Streamer (honorable):6, Large Rabbit Strip Streamer (top), Game Changer (honorable):6, Pike Flash Fly (honorable), Large Rabbit Strip Streamer (top):5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 1.3% | 22/108 | 22/84 | 22 | 22 | 26.2% | 3/42 | 19/42 | 27 | healthy | activity active:48, neutral:36<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_lake_pond:72, freshwater_river:12<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:20, calm_low_light_surface:12 | Frog Fly (top), Articulated Baitfish Streamer (honorable):3, Popper Fly (honorable), Game Changer (top):3, Popper Fly (top), Baitfish Slider Fly (honorable):3 |
| Popper Fly<br>popper_fly | fly | 1.1% | 18/108 | 18/84 | 18 | 18 | 21.4% | 18/42 | 0/42 | 18 | healthy | activity active:48, neutral:36<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_lake_pond:72, freshwater_river:12<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:20, calm_low_light_surface:12 | Deer Hair Slider (honorable), Articulated Pike Streamer (top):4, Deer Hair Slider (top), Large Rabbit Strip Streamer (honorable):4, Frog Fly (top), Articulated Baitfish Streamer (honorable):3 |
| Frog Fly<br>frog_fly | fly | 0.7% | 12/96 | 12/72 | 12 | 12 | 16.7% | 0/36 | 12/36 | 20 | healthy | activity active:36, neutral:36<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Articulated Pike Streamer (top):4, Deer Hair Slider (top), Large Rabbit Strip Streamer (honorable):4, Popper Fly (honorable), Game Changer (top):3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 0.1% | 2/12 | 2/12 | 2 | 2 | 16.7% | 2/6 | 0/6 | 4 | healthy | activity active:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, dirty_vibration:4, warming_search:4 | Articulated Pike Streamer (top), Deer Hair Slider (honorable):1, Baitfish Slider Fly (top), Pike Flash Fly (honorable):1, Bucktail Streamer (honorable), Pike Flash Fly (top):1 |
| Large Jerkbait<br>pike_jerkbait | lure | 9.8% | 164/840 | 164/824 | 164 | 164 | 19.9% | 24/412 | 140/412 | 169 | healthy | activity neutral:572, active:192, suppressed:60<br>clarity clear:280, dirty:280, stained:264<br>water freshwater_lake_pond:720, freshwater_river:104<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):23, Inline Spinner (top), Pike Spinnerbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):22 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 9.2% | 154/840 | 154/816 | 154 | 154 | 18.9% | 2/396 | 152/420 | 165 | healthy | activity neutral:568, active:192, suppressed:56<br>clarity dirty:280, clear:268, stained:268<br>water freshwater_lake_pond:708, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:180 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):23, Inline Spinner (top), Pike Spinnerbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):22 |
| Casting Spoon<br>casting_spoon | lure | 4.9% | 82/840 | 81/808 | 82 | 81 | 10% | 81/404 | 0/404 | 106 | healthy | activity neutral:556, active:192, suppressed:60<br>clarity dirty:280, clear:264, stained:264<br>water freshwater_lake_pond:708, freshwater_river:100<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):23, Inline Spinner (top), Pike Spinnerbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):21 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 12.6% | 211/840 | 209/800 | 211 | 209 | 26.1% | 102/400 | 107/400 | 128 | over-dominant | activity neutral:548, active:192, suppressed:60<br>clarity dirty:280, clear:260, stained:260<br>water freshwater_lake_pond:692, freshwater_river:108<br>bucket cold_slow_or_front:200, dirty_vibration:192, breezy_windy_stained_reaction:184 | Inline Spinner (top), Pike Spinnerbait (honorable):21, Inline Spinner (top), Shallow Minnowbait (honorable):20, Large Bucktail Spinner (honorable), Large Jerkbait (top):20 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 16% | 268/840 | 258/792 | 268 | 258 | 32.6% | 97/396 | 161/396 | 410 | over-dominant | activity neutral:548, active:192, suppressed:52<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket dirty_vibration:192, breezy_windy_stained_reaction:184, cold_slow_or_front:160 | Inline Spinner (top), Pike Spinnerbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):22, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):18 |
| Inline Spinner<br>inline_spinner | lure | 9% | 151/624 | 131/528 | 151 | 131 | 24.8% | 131/264 | 0/264 | 150 | healthy | activity neutral:336, active:192<br>clarity dirty:208, clear:160, stained:160<br>water freshwater_lake_pond:440, freshwater_river:88<br>bucket breezy_windy_stained_reaction:128, dirty_vibration:128, warming_search:92 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):17, Large Bucktail Spinner (honorable), Pike Spinnerbait (top):14, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):14 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 12.3% | 206/732 | 142/440 | 206 | 142 | 32.3% | 71/220 | 71/220 | 198 | over-dominant | activity neutral:296, active:128, suppressed:16<br>clarity dirty:244, stained:196<br>water freshwater_lake_pond:372, freshwater_river:68<br>bucket dirty_vibration:164, breezy_windy_stained_reaction:156, warming_search:48 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):15, Large Bucktail Spinner (honorable), Large Jerkbait (top):11, Inline Spinner (top), Casting Spoon (honorable):10 |
| Weedless Spoon<br>weedless_spoon | lure | 6.8% | 115/360 | 115/360 | 115 | 115 | 31.9% | 50/180 | 65/180 | 172 | over-dominant | activity neutral:252, active:96, suppressed:12<br>clarity clear:120, dirty:120, stained:120<br>water freshwater_lake_pond:360<br>bucket stable_pleasant_medium_confidence_archive:88, dirty_vibration:72, breezy_windy_stained_reaction:68 | Inline Spinner (top), Pike Spinnerbait (honorable):16, Inline Spinner (top), Shallow Minnowbait (honorable):10, Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):7 |
| Pike Glide Bait<br>pike_glidebait | lure | 4.7% | 79/432 | 41/106 | 79 | 41 | 38.7% | 0/0 | 41/106 | 63 | over-dominant | activity neutral:68, active:38<br>clarity clear:50, stained:32, dirty:24<br>water freshwater_lake_pond:106<br>bucket cold_slow_or_front:26, stable_pleasant_medium_confidence_archive:26, warming_search:24 | Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):6, Large Bucktail Spinner (honorable), Weedless Spoon (top):4, Weedless Spoon (honorable), Large Jerkbait (top):4 |
| Large Pike Topwater<br>large_pike_topwater | lure | 1% | 16/96 | 16/72 | 16 | 16 | 22.2% | 1/36 | 15/36 | 19 | healthy | activity active:36, neutral:36<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket stable_pleasant_medium_confidence_archive:36, warming_search:16, calm_low_light_surface:12 | Inline Spinner (honorable), Weedless Spoon (top):3, Inline Spinner (top), Pike Spinnerbait (honorable):3, Inline Spinner (top), Shallow Minnowbait (honorable):3 |
| Large Pike Tube<br>large_pike_tube | lure | 0.4% | 6/12 | 6/12 | 6 | 6 | 50% | 3/6 | 3/6 | 6 | healthy | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, cold_slow_or_front:4, dirty_vibration:4 | Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):2, Blade Bait (top), Casting Spoon (honorable):1, Blade Bait (top), Large Bucktail Spinner (honorable):1 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |

## Equal-Or-Better Underused Signature Losses

None.

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 38/592 | 6.4% | 99 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:50, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:50, big_fish / dirty / freshwater_lake_pond / dirty_vibration:50, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:50 | goal_tags:323, daily_condition_tags:166, forage_clarity_stack:33, seasonal_baseline:19 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):27, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):20, Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):18 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 266/816 | 32.6% | 367 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:80, big_fish / dirty / freshwater_lake_pond / dirty_vibration:80, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76 | goal_tags:281, selector_filtering_variety_jitter:209, daily_condition_tags:42, forage_clarity_stack:18 | Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):23, Baitfish Slider Fly (top), Pike Flash Fly (honorable):23, Game Changer (honorable), Articulated Pike Streamer (top):22, Game Changer (top), Articulated Pike Streamer (honorable):21 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 209/800 | 26.1% | 128 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:80, big_fish / dirty / freshwater_lake_pond / dirty_vibration:80, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76 | goal_tags:191, daily_condition_tags:184, seasonal_baseline:99, selector_filtering_variety_jitter:83 | Inline Spinner (top), Pike Spinnerbait (honorable):21, Inline Spinner (top), Shallow Minnowbait (honorable):20, Large Bucktail Spinner (honorable), Large Jerkbait (top):20, Large Bucktail Spinner (top), Large Jerkbait (honorable):19 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 258/792 | 32.6% | 410 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:80, big_fish / dirty / freshwater_lake_pond / dirty_vibration:80, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76 | goal_tags:267, selector_filtering_variety_jitter:207, forage_clarity_stack:36, daily_condition_tags:12 | Inline Spinner (top), Pike Spinnerbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):22, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):18, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):17 |
| Game Changer<br>game_changer | fly | 213/792 | 26.9% | 362 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:80, big_fish / dirty / freshwater_lake_pond / dirty_vibration:80, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76 | daily_condition_tags:327, selector_filtering_variety_jitter:126, goal_tags:71, forage_clarity_stack:37 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):42, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):22 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 213/792 | 26.9% | 309 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:80, big_fish / dirty / freshwater_lake_pond / dirty_vibration:80, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:76 | daily_condition_tags:338, selector_filtering_variety_jitter:84, goal_tags:77, forage_clarity_stack:69 | Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):22, Game Changer (top), Articulated Pike Streamer (honorable):21 |
| Pike Flash Fly<br>pike_flash_fly | fly | 200/532 | 37.6% | 266 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:46, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46, big_fish / dirty / freshwater_lake_pond / dirty_vibration:46, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46 | seasonal_baseline:120, selector_filtering_variety_jitter:77, daily_condition_tags:49, forage_clarity_stack:48 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):23, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):16, Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):14, Game Changer (honorable), Articulated Pike Streamer (top):13 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 142/440 | 32.3% | 198 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:66, big_fish / dirty / freshwater_lake_pond / dirty_vibration:66, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:62, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:62 | daily_condition_tags:132, selector_filtering_variety_jitter:81, goal_tags:74, seasonal_baseline:10 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):15, Large Bucktail Spinner (honorable), Large Jerkbait (top):11, Inline Spinner (top), Casting Spoon (honorable):10, Large Bucktail Spinner (top), Paddle Tail Pike Jig (honorable):10 |
| Weedless Spoon<br>weedless_spoon | lure | 115/360 | 31.9% | 172 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:36, big_fish / dirty / freshwater_lake_pond / dirty_vibration:36, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:34, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:34 | goal_tags:95, daily_condition_tags:78, selector_filtering_variety_jitter:72 | Inline Spinner (top), Pike Spinnerbait (honorable):16, Inline Spinner (top), Shallow Minnowbait (honorable):10, Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):7, Large Bucktail Spinner (honorable), Casting Spoon (top):6 |
| Pike Glide Bait<br>pike_glidebait | lure | 41/106 | 38.7% | 63 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:14, big_fish / dirty / freshwater_lake_pond / dirty_vibration:12, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:12 | selector_filtering_variety_jitter:39, daily_condition_tags:26 | Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):6, Large Bucktail Spinner (honorable), Weedless Spoon (top):4, Weedless Spoon (honorable), Large Jerkbait (top):4, Large Bucktail Spinner (honorable), Paddle Tail Pike Jig (top):3 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (9), Shallow Minnowbait [lure] (9), Pike Spinnerbait [lure] (7), Game Changer [fly] (6), Inline Spinner [lure] (6) | Popper Fly [fly] (15), Shallow Minnowbait [lure] (15), Baitfish Slider Fly [fly] (12), Inline Spinner [lure] (12), Pike Spinnerbait [lure] (12) |
| calm_surface | big_fish | Large Pike Topwater [lure] (7), Articulated Pike Streamer [fly] (6), Deer Hair Slider [fly] (5), Large Paddle-Tail Swimbait [lure] (5), Large Rabbit Strip Streamer [fly] (5) | Deer Hair Slider [fly] (15), Large Pike Topwater [lure] (14), Weedless Spoon [lure] (12), Frog Fly [fly] (11), Large Paddle-Tail Swimbait [lure] (11) |
| low_light_surface | all_purpose | Inline Spinner [lure] (6), Baitfish Slider Fly [fly] (5), Shallow Minnowbait [lure] (5), Pike Flash Fly [fly] (3), Popper Fly [fly] (3) | Shallow Minnowbait [lure] (9), Baitfish Slider Fly [fly] (8), Inline Spinner [lure] (8), Popper Fly [fly] (6), Pike Flash Fly [fly] (5) |
| low_light_surface | big_fish | Articulated Pike Streamer [fly] (6), Large Paddle-Tail Swimbait [lure] (4), Pike Flash Fly [fly] (4), Frog Fly [fly] (3), Large Bucktail Spinner [lure] (3) | Deer Hair Slider [fly] (7), Articulated Pike Streamer [fly] (6), Large Bucktail Spinner [lure] (6), Large Paddle-Tail Swimbait [lure] (6), Large Rabbit Strip Streamer [fly] (6) |
| wind_reaction | all_purpose | Inline Spinner [lure] (76), Deceiver [fly] (59), Baitfish Slider Fly [fly] (50), Large Bucktail Spinner [lure] (36), Paddle Tail Pike Jig [lure] (36) | Deceiver [fly] (117), Inline Spinner [lure] (96), Baitfish Slider Fly [fly] (92), Large Bucktail Spinner [lure] (85), Casting Spoon [lure] (72) |
| wind_reaction | big_fish | Large Rabbit Strip Streamer [fly] (83), Articulated Pike Streamer [fly] (65), Large Bucktail Spinner [lure] (60), Large Jerkbait [lure] (58), Paddle Tail Pike Jig [lure] (46) | Large Rabbit Strip Streamer [fly] (130), Large Bucktail Spinner [lure] (122), Large Jerkbait [lure] (111), Articulated Pike Streamer [fly] (109), Large Paddle-Tail Swimbait [lure] (91) |
| dirty_vibration | all_purpose | Inline Spinner [lure] (49), Deceiver [fly] (36), Paddle Tail Pike Jig [lure] (36), Baitfish Slider Fly [fly] (31), Large Rabbit Strip Streamer [fly] (28) | Deceiver [fly] (78), Paddle Tail Pike Jig [lure] (66), Inline Spinner [lure] (63), Baitfish Slider Fly [fly] (61), Large Bucktail Spinner [lure] (53) |
| dirty_vibration | big_fish | Large Rabbit Strip Streamer [fly] (59), Articulated Pike Streamer [fly] (43), Paddle Tail Pike Jig [lure] (42), Large Jerkbait [lure] (40), Large Bucktail Spinner [lure] (37) | Large Rabbit Strip Streamer [fly] (89), Large Bucktail Spinner [lure] (79), Articulated Pike Streamer [fly] (78), Large Jerkbait [lure] (71), Articulated Baitfish Streamer [fly] (69) |
| clear_subtle | all_purpose | Inline Spinner [lure] (11), Unweighted Baitfish Streamer [fly] (10), Shallow Minnowbait [lure] (9), Blade Bait [lure] (8), Deceiver [fly] (7) | Blade Bait [lure] (16), Shallow Minnowbait [lure] (16), Unweighted Baitfish Streamer [fly] (16), Inline Spinner [lure] (15), Baitfish Slider Fly [fly] (13) |
| clear_subtle | big_fish | Large Jerkbait [lure] (9), Large Rabbit Strip Streamer [fly] (9), Articulated Baitfish Streamer [fly] (8), Pike Glide Bait [lure] (8), Articulated Pike Streamer [fly] (7) | Game Changer [fly] (15), Large Bucktail Spinner [lure] (15), Large Paddle-Tail Swimbait [lure] (15), Large Rabbit Strip Streamer [fly] (15), Articulated Baitfish Streamer [fly] (14) |
| cold_slow | all_purpose | Paddle Tail Pike Jig [lure] (35), Blade Bait [lure] (32), Rabbit-Strip Leech [fly] (32), Large Rabbit Strip Streamer [fly] (29), Inline Spinner [lure] (25) | Paddle Tail Pike Jig [lure] (69), Blade Bait [lure] (59), Deceiver [fly] (47), Rabbit-Strip Leech [fly] (44), Large Rabbit Strip Streamer [fly] (42) |
| cold_slow | big_fish | Large Rabbit Strip Streamer [fly] (53), Paddle Tail Pike Jig [lure] (47), Large Bucktail Spinner [lure] (22), Large Jerkbait [lure] (21), Large Paddle-Tail Swimbait [lure] (21) | Large Rabbit Strip Streamer [fly] (66), Paddle Tail Pike Jig [lure] (64), Large Bucktail Spinner [lure] (58), Large Paddle-Tail Swimbait [lure] (47), Articulated Pike Streamer [fly] (43) |
| warming_search | all_purpose | Inline Spinner [lure] (29), Baitfish Slider Fly [fly] (26), Shallow Minnowbait [lure] (22), Deceiver [fly] (13), Pike Spinnerbait [lure] (9) | Inline Spinner [lure] (38), Baitfish Slider Fly [fly] (35), Shallow Minnowbait [lure] (32), Deceiver [fly] (28), Casting Spoon [lure] (22) |
| warming_search | big_fish | Large Paddle-Tail Swimbait [lure] (19), Articulated Pike Streamer [fly] (18), Large Rabbit Strip Streamer [fly] (16), Pike Flash Fly [fly] (15), Large Bucktail Spinner [lure] (13) | Large Rabbit Strip Streamer [fly] (35), Large Paddle-Tail Swimbait [lure] (33), Articulated Pike Streamer [fly] (32), Large Bucktail Spinner [lure] (30), Pike Flash Fly [fly] (28) |
| heat_finesse | all_purpose | Inline Spinner [lure] (4), Baitfish Slider Fly [fly] (3), Clouser Minnow [fly] (3), Paddle Tail Pike Jig [lure] (3), Large Rabbit Strip Streamer [fly] (2) | Baitfish Slider Fly [fly] (6), Inline Spinner [lure] (5), Pike Spinnerbait [lure] (5), Shallow Minnowbait [lure] (5), Paddle Tail Pike Jig [lure] (4) |
| heat_finesse | big_fish | Large Rabbit Strip Streamer [fly] (4), Pike Spinnerbait [lure] (4), Articulated Pike Streamer [fly] (3), Game Changer [fly] (3), Large Jerkbait [lure] (3) | Articulated Pike Streamer [fly] (6), Pike Flash Fly [fly] (6), Pike Spinnerbait [lure] (6), Large Bucktail Spinner [lure] (5), Large Jerkbait [lure] (5) |
| current_swing | all_purpose | Clouser Minnow [fly] (7), Inline Spinner [lure] (7), Bucktail Streamer [fly] (6), Deceiver [fly] (4), Casting Spoon [lure] (3) | Clouser Minnow [fly] (9), Inline Spinner [lure] (9), Bucktail Streamer [fly] (8), Large Bucktail Spinner [lure] (8), Casting Spoon [lure] (7) |
| current_swing | big_fish | Large Rabbit Strip Streamer [fly] (6), Large Bucktail Spinner [lure] (5), Game Changer [fly] (4), Large Paddle-Tail Swimbait [lure] (4), Articulated Pike Streamer [fly] (3) | Articulated Pike Streamer [fly] (9), Large Rabbit Strip Streamer [fly] (9), Large Bucktail Spinner [lure] (8), Large Jerkbait [lure] (8), Game Changer [fly] (7) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | active, closed, clear_subtle+warming_search, medium | Inline Spinner (170); Weedless Spoon (164); Game Changer (152); Deceiver (152) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear big_fish B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | active, closed, clear_subtle+warming_search, medium | Large Paddle-Tail Swimbait (166); Large Bucktail Spinner (166); Pike Flash Fly (150); Large Rabbit Strip Streamer (154) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake of the Woods pike water<br>2025-01-16 dirty big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (182); Large Jerkbait (164); Articulated Baitfish Streamer (162); Large Rabbit Strip Streamer (172) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (182); Large Paddle-Tail Swimbait (168); Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear big_fish B | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | neutral, closed, wind_reaction, medium | Pike Glide Bait (174); Large Paddle-Tail Swimbait (166); Game Changer (160); Articulated Pike Streamer (164) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| St. Lawrence River pike backwater<br>2025-10-04 dirty big_fish B | 57.7-72.9F, 6.7 mph wind, 12.2% cloud, 0 in precip | active, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, medium | Large Paddle-Tail Swimbait (182); Paddle Tail Pike Jig (168); Large Rabbit Strip Streamer (178); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 clear big_fish A | 59.5-73.1F, 8.9 mph wind, 1.9% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Large Jerkbait (192); Weedless Spoon (182); Articulated Baitfish Streamer (168); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain pike water<br>2025-08-12 clear big_fish B | 67.4-89.1F, 9.7 mph wind, 4.9% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Pike Glide Bait (206); Large Bucktail Spinner (198); Articulated Pike Streamer (164); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Champlain pike water<br>2025-08-12 dirty big_fish B | 67.4-89.1F, 9.7 mph wind, 4.9% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Pike Glide Bait (182); Paddle Tail Pike Jig (168); Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (178) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Green Bay / Door County pike water<br>2025-05-23 stained big_fish B | 42.9-55.9F, 9.9 mph wind, 80.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Paddle-Tail Swimbait (182); Paddle Tail Pike Jig (168); Articulated Pike Streamer (172); Game Changer (176) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear big_fish B | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (174); Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 stained big_fish A | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (182); Articulated Baitfish Streamer (176); Game Changer (176) | WIND_NOT_ELEVATING_REACTION |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear big_fish A | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | active, closed, clear_subtle+warming_search, medium | Pike Glide Bait (190); Large Jerkbait (160); Articulated Pike Streamer (148); Game Changer (160) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Maine Belgrade Lakes pike water<br>2025-10-25 clear all_purpose A | 40.4-53.2F, 4 mph wind, 82.2% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Inline Spinner (170); Pike Glide Bait (158); Baitfish Slider Fly (148); Articulated Baitfish Streamer (144) | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK |
| Lake of the Woods pike water<br>2025-01-16 clear big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Paddle-Tail Swimbait (168); Large Bucktail Spinner (178); Game Changer (156); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 dirty all_purpose B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Paddle Tail Pike Jig (180); Casting Spoon (156); Rabbit-Strip Leech (146); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (170); Paddle Tail Pike Jig (180); Rabbit-Strip Leech (146); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish A | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (172); Large Bucktail Spinner (178); Game Changer (156); Articulated Baitfish Streamer (162) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-04-24 stained big_fish B | 29.8-53F, 4.3 mph wind, 66.6% cloud, 0 in precip | neutral, closed, no tags, medium | Pike Spinnerbait (166); Large Jerkbait (160); Articulated Pike Streamer (156); Articulated Baitfish Streamer (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-08-14 clear big_fish B | 57.1-77.8F, 12 mph wind, 40.1% cloud, 1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Glide Bait (190); Articulated Baitfish Streamer (168); Articulated Pike Streamer (164) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-08-14 stained all_purpose B | 57.1-77.8F, 12 mph wind, 40.1% cloud, 1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Shallow Minnowbait (186); Weedless Spoon (180); Pike Flash Fly (174); Baitfish Slider Fly (180) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-10-05 clear big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction+heat_finesse, medium | Large Bucktail Spinner (182); Pike Spinnerbait (174); Game Changer (160); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-10-05 dirty big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration+heat_finesse, medium | Pike Spinnerbait (182); Large Jerkbait (168); Large Rabbit Strip Streamer (178); Articulated Baitfish Streamer (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-12-12 dirty big_fish B | -17--6.1F, 12.9 mph wind, 98.5% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Large Bucktail Spinner (170); Large Jerkbait (164); Articulated Baitfish Streamer (162); Articulated Pike Streamer (166) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear all_purpose A | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (190); Shallow Minnowbait (186); Game Changer (168); Unweighted Baitfish Streamer (164) | WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (174); Large Rabbit Strip Streamer (170); Articulated Baitfish Streamer (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 dirty big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (184); Large Bucktail Spinner (190); Articulated Pike Streamer (172); Articulated Baitfish Streamer (176) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 stained big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (192); Large Bucktail Spinner (198); Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (178) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose B | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Weedless Spoon (180); Inline Spinner (186); Large Rabbit Strip Streamer (158); Deceiver (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 clear big_fish B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+open_water_search, medium | Weedless Spoon (182); Large Jerkbait (192); Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 dirty all_purpose B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Shallow Minnowbait (178); Paddle Tail Pike Jig (166); Baitfish Slider Fly (180); Articulated Baitfish Streamer (168) | WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 stained big_fish B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Pike Glide Bait (190); Large Jerkbait (192); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
