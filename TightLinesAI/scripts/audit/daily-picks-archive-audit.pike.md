# FinFindr Pike Daily-Picks Archive Audit
Generated: 2026-05-12T20:23:34.174Z

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
| breezy_windy_stained_reaction | 160 |
| dirty_vibration | 168 |
| cold_slow_or_front | 444 |
| warming_search | 120 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 276 |
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
| breezy_windy_stained_reaction | 5 | WIND_NOT_ELEVATING_REACTION (5) |
| calm_bright_clear_subtle | 4 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (5) |
| cold_slow_or_front | 6 | WIND_NOT_ELEVATING_REACTION (5), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |
| dirty_vibration | 13 | WIND_NOT_ELEVATING_REACTION (13) |
| medium_confidence_archive | 38 | WIND_NOT_ELEVATING_REACTION (25), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (14), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| river_elevated_runoff_current | 2 | WIND_NOT_ELEVATING_REACTION (2) |
| stable_pleasant_medium_confidence_archive | 22 | WIND_NOT_ELEVATING_REACTION (13), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (9), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| warming_search | 10 | WIND_NOT_ELEVATING_REACTION (7), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (3) |

- WIND_NOT_ELEVATING_REACTION: 25
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 14
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 1

- sd_oahe_pike__2025-08-23__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Blade Bait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Shallow Minnowbait (lure); Game Changer (fly); Unweighted Baitfish Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-04-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Casting Spoon (lure); Game Changer (fly); Unweighted Baitfish Streamer (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Deer Hair Slider (fly); Game Changer (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Pike Spinnerbait (lure); Clouser Minnow (fly); Foam Gurgler (fly)
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Pike Flash Fly (fly); Deer Hair Slider (fly)
- sd_oahe_pike__2025-06-18__freshwater_lake_pond__stained__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Shallow Minnowbait (lure); Large Pike Topwater (lure); Game Changer (fly); Popper Fly (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Casting Spoon (lure); Shallow Minnowbait (lure); Articulated Baitfish Streamer (fly); Popper Fly (fly)
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
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Unweighted Baitfish Streamer (fly); Baitfish Slider Fly (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Pike Glide Bait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Pike Flash Fly (fly); Unweighted Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Shallow Minnowbait (lure); Game Changer (fly); Baitfish Slider Fly (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-10-04__freshwater_river__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Pike Flash Fly (fly); Game Changer (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__dirty__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Shallow Minnowbait (lure); Pike Flash Fly (fly); Deceiver (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Pike Glide Bait (lure); Paddle Tail Pike Jig (lure); Game Changer (fly); Pike Flash Fly (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__stained__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Shallow Minnowbait (lure); Paddle Tail Pike Jig (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Casting Spoon (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- ny_st_lawrence_pike__2025-11-11__freshwater_river__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Shallow Minnowbait (lure); Bucktail Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-11-11__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle Tail Pike Jig (lure); Large Pike Tube (lure); Rabbit-Strip Leech (fly); Articulated Pike Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 60
- ADJACENT_DAY_EXACT_REPEAT: 4
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 1

- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Paddle Tail Pike Jig (lure); Large Jerkbait (lure); Articulated Dungeon Streamer (fly); Articulated Pike Streamer (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Articulated Pike Streamer (fly); Articulated Dungeon Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Large Rabbit Strip Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- ny_st_lawrence_pike__2025-04-04__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- nd_missouri_backwater_pike__2025-04-05__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- sd_oahe_pike__2025-04-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_lake_of_woods_pike__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- ny_st_lawrence_pike__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- me_belgrade_pike__2025-05-08__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Spinnerbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- nd_devils_lake_pike__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Deceiver (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- mt_fort_peck_pike__2025-05-19__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- mt_fort_peck_pike__2025-05-19__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Pike Spinnerbait (lure); Large Rabbit Strip Streamer (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Bucktail Spinner (lure); Game Changer (fly); Articulated Pike Streamer (fly)
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
- me_belgrade_pike__2025-08-02__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Bucktail Spinner (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Weedless Spoon (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Shallow Minnowbait (lure); Weedless Spoon (lure); Pike Flash Fly (fly); Baitfish Slider Fly (fly)
- wi_green_bay_pike__2025-08-16__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-08-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Glide Bait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- mn_mille_lacs_pike__2025-09-20__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Weedless Spoon (lure); Large Jerkbait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Weedless Spoon (lure); Large Bucktail Spinner (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-09-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-09-27__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Pike Glide Bait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Large Paddle-Tail Swimbait (lure); Articulated Pike Streamer (fly); Articulated Baitfish Streamer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Paddle Tail Pike Jig (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Game Changer (fly); Articulated Pike Streamer (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Spinnerbait (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Large Rabbit Strip Streamer (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_pike__2025-10-12__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Paddle Tail Pike Jig (lure); Game Changer (fly); Large Rabbit Strip Streamer (fly)
- vt_champlain_pike__2025-10-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Articulated Pike Streamer (fly)
- wi_green_bay_pike__2025-10-19__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Pike Glide Bait (lure); Large Rabbit Strip Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-10-19__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Pike Spinnerbait (lure); Large Jerkbait (lure); Articulated Pike Streamer (fly); Game Changer (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__clear__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Shallow Minnowbait (lure); Casting Spoon (lure); Baitfish Slider Fly (fly); Pike Flash Fly (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Large Jerkbait (lure); Pike Glide Bait (lure); Articulated Baitfish Streamer (fly); Large Rabbit Strip Streamer (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | cold_slow:1 |
| Jan | midwest_interior | cold_slow:1 |
| Jan | northeast | cold_slow:1 |
| Feb | great_lakes_upper_midwest | cold_slow:1 |
| Feb | midwest_interior | cold_slow:1 |
| Feb | northeast | cold_slow:1 |
| Mar | great_lakes_upper_midwest | stable:1, warming:1 |
| Mar | midwest_interior | cold_slow:2, warming:1 |
| Mar | northeast | cold_slow:2 |
| Apr | great_lakes_upper_midwest | warming:1, stable:1 |
| Apr | midwest_interior | cold_slow:2, warming:1 |
| Apr | northeast | stable:2, cold_slow:1 |
| May | great_lakes_upper_midwest | cooling_or_shock:1, cold_slow:1 |
| May | midwest_interior | cold_slow:3 |
| May | northeast | stable:1, cold_slow:2 |
| Jun | great_lakes_upper_midwest | warming:1, stable:1 |
| Jun | midwest_interior | stable:2 |
| Jun | northeast | cooling_or_shock:2, stable:1 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1, warming:1 |
| Jul | midwest_interior | stable:1, cooling_or_shock:1 |
| Jul | northeast | stable:2 |
| Aug | great_lakes_upper_midwest | stable:2 |
| Aug | midwest_interior | stable:1, cooling_or_shock:1 |
| Aug | northeast | stable:2 |
| Sep | great_lakes_upper_midwest | stable:3 |
| Sep | midwest_interior | cold_slow:1, warming:1 |
| Sep | northeast | stable:2 |
| Oct | great_lakes_upper_midwest | cooling_or_shock:3 |
| Oct | midwest_interior | cold_slow:1 |
| Oct | northeast | warming:2, cold_slow:1 |
| Nov | great_lakes_upper_midwest | cold_slow:1 |
| Nov | midwest_interior | warming:1, cold_slow:1 |
| Nov | northeast | cold_slow:1, stable:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | midwest_interior | cold_slow:1 |
| Dec | northeast | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Jul | great_lakes_upper_midwest | open | low_light | all_purpose | 3 | 69.4-81.7F | 8.1 |
| Jul | great_lakes_upper_midwest | open | low_light | big_fish | 3 | 69.4-81.7F | 8.1 |
| Jul | northeast | open | mixed | all_purpose | 10 | 67.7-89.0F | 5.5 |
| Jul | northeast | open | mixed | big_fish | 9 | 67.7-89.0F | 5.4 |
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
| lure | 599 | 599 | 403 |
| fly | 411 | 411 | 344 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 96 | - |
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
| clear breezy/wind-reaction | 16 | 10 | Pike Spinnerbait (3), Pike Flash Fly (2), Weedless Spoon (2), Blade Bait (1) | Shallow Minnowbait (5), Game Changer (2), Large Jerkbait (2), Pike Glide Bait (1) |

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
| clear breezy/wind-reaction | St. Lawrence River pike backwater<br>2025-10-04 big_fish A | clear, bright, breezy, gate closed | Pike Spinnerbait (lure, 158) | Large Jerkbait (160) |

## Pike Heat-Limited Diagnostics

### Heat-Limited Pike Summary

| Context | Controlled/deeper/slower | Reckless surface/fast/high-risk | Surface pick rows | Surface picks | Non-surface high-risk rows | Non-surface high-risk picks | Mixed watch | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| true_heat_limited | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| warm_adjacent | 43 | 80 | 33 | 38 | 28 | 28 | 33 | 156 |

### Heat-Limited Pike Rows

| Context | Split | Scenario | Weather/thermal | Selected picks | Heat risk split |
| --- | --- | --- | --- | --- | --- |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose A | 58.8-77.4F, stable | Blade Bait (slow/bottom); Large Bucktail Spinner (medium/mid); Game Changer (medium/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose B | 58.8-77.4F, stable | Shallow Minnowbait (medium/mid); Weedless Spoon (medium/mid); Unweighted Baitfish Streamer (medium/upper); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish A | 58.8-77.4F, stable | Pike Glide Bait (slow/mid); Weedless Spoon (medium/mid); Game Changer (medium/mid); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish B | 58.8-77.4F, stable | Large Paddle-Tail Swimbait (medium/mid); Large Bucktail Spinner (medium/mid); Pike Flash Fly (medium/upper); Unweighted Baitfish Streamer (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose A | 58.8-77.4F, stable | Shallow Minnowbait (medium/mid); Weedless Spoon (medium/mid); Pike Flash Fly (medium/upper); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose B | 58.8-77.4F, stable | Inline Spinner (medium/mid); Pike Spinnerbait (medium/mid); Baitfish Slider Fly (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 dirty big_fish A | 58.8-77.4F, stable | Large Jerkbait (medium/mid); Large Bucktail Spinner (medium/mid); Articulated Baitfish Streamer (medium/mid); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 dirty big_fish B | 58.8-77.4F, stable | Weedless Spoon (medium/mid); Pike Glide Bait (slow/mid); Large Rabbit Strip Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 stained all_purpose A | 58.8-77.4F, stable | Casting Spoon (medium/mid); Shallow Minnowbait (medium/mid); Deceiver (medium/mid); Baitfish Slider Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 stained all_purpose B | 58.8-77.4F, stable | Inline Spinner (medium/mid); Pike Spinnerbait (medium/mid); Large Rabbit Strip Streamer (slow/mid); Unweighted Baitfish Streamer (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 stained big_fish A | 58.8-77.4F, stable | Large Paddle-Tail Swimbait (medium/mid); Weedless Spoon (medium/mid); Game Changer (medium/mid); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 stained big_fish B | 58.8-77.4F, stable | Pike Glide Bait (slow/mid); Large Bucktail Spinner (medium/mid); Large Rabbit Strip Streamer (slow/mid); Articulated Baitfish Streamer (medium/mid) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear all_purpose A | 57.1-64.2F, cooling_or_shock | Casting Spoon (medium/mid); Large Bucktail Spinner (medium/mid); Large Rabbit Strip Streamer (slow/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear all_purpose B | 57.1-64.2F, cooling_or_shock | Inline Spinner (medium/mid); Pike Spinnerbait (medium/mid); Pike Flash Fly (medium/upper); Baitfish Slider Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear big_fish A | 57.1-64.2F, cooling_or_shock | Pike Spinnerbait (medium/mid); Large Bucktail Spinner (medium/mid); Articulated Baitfish Streamer (medium/mid); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear big_fish B | 57.1-64.2F, cooling_or_shock | Weedless Spoon (medium/mid); Large Jerkbait (medium/mid); Pike Flash Fly (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty all_purpose A | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Casting Spoon (medium/mid); Baitfish Slider Fly (medium/upper); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty all_purpose B | 57.1-64.2F, cooling_or_shock | Pike Spinnerbait (medium/mid); Inline Spinner (medium/mid); Pike Flash Fly (medium/upper); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty big_fish A | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Paddle Tail Pike Jig (slow/bottom); Articulated Baitfish Streamer (medium/mid); Large Rabbit Strip Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty big_fish B | 57.1-64.2F, cooling_or_shock | Pike Spinnerbait (medium/mid); Weedless Spoon (medium/mid); Pike Flash Fly (medium/upper); Articulated Pike Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose A | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Paddle Tail Pike Jig (slow/bottom); Articulated Pike Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose B | 57.1-64.2F, cooling_or_shock | Weedless Spoon (medium/mid); Inline Spinner (medium/mid); Large Rabbit Strip Streamer (slow/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained big_fish A | 57.1-64.2F, cooling_or_shock | Pike Spinnerbait (medium/mid); Large Bucktail Spinner (medium/mid); Articulated Pike Streamer (slow/mid); Articulated Baitfish Streamer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained big_fish B | 57.1-64.2F, cooling_or_shock | Weedless Spoon (medium/mid); Pike Glide Bait (slow/mid); Large Rabbit Strip Streamer (slow/mid); Pike Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 clear all_purpose A | 58.7-77F, cooling_or_shock | Shallow Minnowbait (medium/mid); Weedless Spoon (medium/mid); Articulated Baitfish Streamer (medium/mid); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Devils Lake prairie pike water<br>2025-07-12 clear all_purpose B | 58.7-77F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Large Paddle-Tail Swimbait (medium/mid); Deceiver (medium/mid); Large Rabbit Strip Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 clear big_fish A | 58.7-77F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Large Paddle-Tail Swimbait (medium/mid); Articulated Pike Streamer (slow/mid); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Devils Lake prairie pike water<br>2025-07-12 clear big_fish B | 58.7-77F, cooling_or_shock | Pike Glide Bait (slow/mid); Large Jerkbait (medium/mid); Articulated Baitfish Streamer (medium/mid); Large Rabbit Strip Streamer (slow/mid) | surface: None<br>non-surface high-risk: Pike Glide Bait |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 dirty all_purpose A | 58.7-77F, cooling_or_shock | Shallow Minnowbait (medium/mid); Weedless Spoon (medium/mid); Articulated Baitfish Streamer (medium/mid); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 dirty all_purpose B | 58.7-77F, cooling_or_shock | Pike Spinnerbait (medium/mid); Paddle Tail Pike Jig (slow/bottom); Game Changer (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_due_score_band | 24 | 0 | 24 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 4 | 1 | 5 |
| same_family_same_presentation | truly_avoidable | 1 | 0 | 1 |
| same_family_same_presentation | unavoidable_due_score_band | 0 | 3 | 3 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 5 | 5 |
| same_family_different_presentation | truly_avoidable | 0 | 60 | 60 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 56 | 56 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 22 | 22 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 9 | 9 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Missouri River backwater pike context<br>2025-04-05 clear big_fish | fly top: same_family_different_presentation | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (186) | Articulated Pike Streamer (164); Game Changer (176) | Pike Flash Fly (182, alt edge 18) |
| Lake of the Woods pike water<br>2025-08-14 clear big_fish | fly honorable: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (170) | Articulated Baitfish Streamer (168); Articulated Pike Streamer (164) | Game Changer (176, alt edge 12) |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear big_fish | fly top: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (186) | Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | Game Changer (176, alt edge 12) |
| Missouri River backwater pike context<br>2025-09-29 clear big_fish | fly top: same_family_different_presentation | Large Rabbit Strip Streamer (170); Pike Flash Fly (182) | Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | Game Changer (176, alt edge 12) |
| Lake of the Woods pike water<br>2025-08-14 stained all_purpose | lure honorable: same_family_same_presentation | Inline Spinner (202); Casting Spoon (184) | Shallow Minnowbait (186); Weedless Spoon (180) | Large Bucktail Spinner (190, alt edge 10) |
| Missouri River backwater pike context<br>2025-04-05 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (194) | Game Changer (176); Articulated Pike Streamer (172) | Pike Flash Fly (182, alt edge 10) |
| Missouri River backwater pike context<br>2025-04-05 stained big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (194); Articulated Baitfish Streamer (176) | Game Changer (176); Articulated Pike Streamer (172) | Pike Flash Fly (182, alt edge 10) |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear big_fish | fly honorable: same_family_different_presentation | Articulated Pike Streamer (164); Pike Flash Fly (182) | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | Game Changer (176, alt edge 6) |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose | fly top: same_family_different_presentation | Articulated Pike Streamer (152); Pike Flash Fly (158) | Large Rabbit Strip Streamer (158); Deceiver (168) | Baitfish Slider Fly (164, alt edge 6) |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 clear big_fish | fly honorable: same_family_different_presentation | Articulated Pike Streamer (164); Pike Flash Fly (182) | Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | Game Changer (176, alt edge 6) |
| Maine Belgrade Lakes pike water<br>2025-05-08 dirty big_fish | fly honorable: same_family_different_presentation | Large Rabbit Strip Streamer (178); Pike Flash Fly (150) | Game Changer (160); Articulated Pike Streamer (156) | Articulated Baitfish Streamer (160, alt edge 4) |
| Missouri River backwater pike context<br>2025-09-29 dirty big_fish | fly honorable: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (178) | Game Changer (176); Articulated Pike Streamer (172) | Articulated Baitfish Streamer (176, alt edge 4) |
| Missouri River backwater pike context<br>2025-09-29 stained big_fish | fly honorable: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (178) | Articulated Baitfish Streamer (176); Articulated Pike Streamer (172) | Game Changer (176, alt edge 4) |
| St. Lawrence River pike backwater<br>2025-06-17 stained big_fish | fly top: same_family_different_presentation | Large Rabbit Strip Streamer (178); Pike Flash Fly (182) | Articulated Pike Streamer (172); Deer Hair Slider (166) | Articulated Baitfish Streamer (176, alt edge 4) |
| Lake Champlain pike water<br>2025-08-12 clear big_fish | fly top: same_family_different_presentation | Pike Flash Fly (182); Large Rabbit Strip Streamer (170) | Articulated Pike Streamer (164); Game Changer (176) | Articulated Baitfish Streamer (168, alt edge 4) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Devils Lake prairie pike water<br>2025-01-26 clear | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Jerkbait; Large Rabbit Strip Streamer; Rabbit-Strip Leech |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty | A | 3/4 | Blade Bait; Paddle Tail Pike Jig; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Bucktail Spinner; Rabbit-Strip Leech; Large Rabbit Strip Streamer |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained | A | 3/4 | Pike Spinnerbait; Paddle Tail Pike Jig; Articulated Pike Streamer; Articulated Baitfish Streamer | Pike Spinnerbait; Pike Glide Bait; Articulated Pike Streamer; Articulated Baitfish Streamer |
| Mille Lacs / Upper Midwest pike lake<br>2025-11-08 stained | A | 3/4 | Paddle Tail Pike Jig; Blade Bait; Rabbit-Strip Leech; Large Rabbit Strip Streamer | Paddle Tail Pike Jig; Large Bucktail Spinner; Large Rabbit Strip Streamer; Rabbit-Strip Leech |
| Lake Oahe prairie reservoir pike water<br>2025-11-11 clear | B | 3/4 | Large Bucktail Spinner; Blade Bait; Articulated Baitfish Streamer; Large Rabbit Strip Streamer | Large Paddle-Tail Swimbait; Large Bucktail Spinner; Large Rabbit Strip Streamer; Articulated Baitfish Streamer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Pike Big Fish Upside Split Diagnostics

### Pike Big Fish Upside Split Summary

| Class | Picks | Share | Common profiles |
| --- | --- | --- | --- |
| controlled_upside | 1530 | 91.1% | Large Rabbit Strip Streamer [fly] (188), Large Bucktail Spinner [lure] (167), Articulated Pike Streamer [fly] (154), Large Paddle-Tail Swimbait [lure] (152), Articulated Baitfish Streamer [fly] (146) |
| high_risk_or_reckless_upside | 139 | 8.3% | Pike Glide Bait [lure] (78), Articulated Dungeon Streamer [fly] (24), Large Pike Topwater [lure] (15), Frog Fly [fly] (12), Deer Hair Slider [fly] (10) |
| no_explicit_upside | 11 | 0.7% | Unweighted Baitfish Streamer [fly] (4), Blade Bait [lure] (2), Clouser Minnow [fly] (2), Deep-Diving Crankbait [lure] (2), Deceiver [fly] (1) |

### High-Risk/Reckless Pike Big Fish Upside Rows

| Scenario | Pick | Class | Reasons |
| --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear A | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 dirty B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 clear B | Articulated Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 stained B | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-01-18 dirty A | Articulated Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
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
| Maine Belgrade Lakes pike water<br>2025-05-08 clear B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-05-08 stained B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-05-08 dirty A | Pike Glide Bait (lure, 166) | high_risk_or_reckless_upside | high_risk_high_reward |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 stained B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Oahe prairie reservoir pike water<br>2025-05-18 clear B | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 stained B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-05-23 clear B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-05-23 stained B | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 clear A | Pike Glide Bait (lure, 190) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 stained A | Pike Glide Bait (lure, 174) | high_risk_or_reckless_upside | high_risk_high_reward |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-03-28 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Shallow Minnowbait (178; condition_tag:warming_search:+16, condition_tag:open_water_search:+0, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Paddle Tail Pike Jig (166; condition_tag:dirty_vibration:+16, goal:all_purpose:reliable_action:+18) | Inline Spinner (194, alt edge 16) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-04-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Unweighted Baitfish Streamer (164; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-04-30 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Pike Flash Fly (182, alt edge 6) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Pike Glide Bait (174; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Large Paddle-Tail Swimbait (166; goal:big_fish:big_fish_upside:+20) | Large Bucktail Spinner (182, alt edge 8) | goal fit likely competed |
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
| Lake Oahe prairie reservoir pike water<br>2025-08-23 clear all_purpose A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Weedless Spoon (180; condition_tag:wind_reaction:+16, goal:all_purpose:reliable_action:+18); Pike Spinnerbait (172; condition_tag:wind_reaction:+16, goal:all_purpose:reliable_action:+18) | Pike Glide Bait (174, alt edge -6) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Large Jerkbait (192; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Weedless Spoon (182; condition_tag:wind_reaction:+16, goal:big_fish:big_fish_upside:+20) | Pike Glide Bait (206, alt edge 14) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Deceiver (172, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Articulated Baitfish Streamer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge 16) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (176; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Pike Flash Fly (182, alt edge 6) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 dirty all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Shallow Minnowbait (178; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Paddle Tail Pike Jig (166; condition_tag:dirty_vibration:+16, goal:all_purpose:reliable_action:+18) | Inline Spinner (194, alt edge 16) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Shallow Minnowbait (170; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Paddle Tail Pike Jig (152; goal:all_purpose:reliable_action:+18) | Pike Glide Bait (158, alt edge -12) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Inline Spinner (170; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Blade Bait (154; goal:all_purpose:reliable_action:+18) | Pike Glide Bait (158, alt edge -12) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 16 |
| clear_subtle_wind_watch | 7 |
| surface_low_light_acceptable | 1 |
| current_open_water_acceptable | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>neutral | Large Bucktail Spinner 190<br>Shallow Minnowbait 186 |
| clear_subtle_wind_watch | Green Bay / Door County pike water<br>2025-04-18 all_purpose clear A | warming_search<br>active | Shallow Minnowbait 186<br>Casting Spoon 184 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest pike lake<br>2025-05-15 big_fish clear B | cold_slow_or_front<br>active | Pike Glide Bait 174<br>Large Paddle-Tail Swimbait 166 |
| clear_subtle_wind_watch | St. Lawrence River pike backwater<br>2025-06-17 big_fish clear B | stable_pleasant_medium_confidence_archive<br>active | Large Bucktail Spinner 198<br>Pike Spinnerbait 174 |
| clear_subtle_wind_watch | Lake Oahe prairie reservoir pike water<br>2025-07-19 big_fish clear B | stable_pleasant_medium_confidence_archive<br>neutral | Large Paddle-Tail Swimbait 182<br>Pike Glide Bait 190 |
| dirty_vibration_acceptable | Green Bay / Door County pike water<br>2025-03-28 all_purpose dirty B | dirty_vibration<br>active | Shallow Minnowbait 178<br>Paddle Tail Pike Jig 166 |
| dirty_vibration_acceptable | Maine Belgrade Lakes pike water<br>2025-04-30 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Large Bucktail Spinner 198<br>Pike Spinnerbait 182 |
| dirty_vibration_acceptable | St. Lawrence River pike backwater<br>2025-06-17 all_purpose dirty B | dirty_vibration<br>active | Shallow Minnowbait 178<br>Pike Spinnerbait 180 |
| dirty_vibration_acceptable | St. Lawrence River pike backwater<br>2025-06-17 big_fish dirty B | dirty_vibration<br>active | Large Paddle-Tail Swimbait 182<br>Paddle Tail Pike Jig 168 |
| dirty_vibration_acceptable | Lake Champlain pike water<br>2025-08-12 big_fish dirty B | dirty_vibration<br>neutral | Pike Glide Bait 182<br>Paddle Tail Pike Jig 168 |
| surface_low_light_acceptable | Green Bay / Door County pike water<br>2025-07-24 all_purpose dirty A | dirty_vibration<br>active | Casting Spoon 176<br>Shallow Minnowbait 178 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-09-20 big_fish stained B | breezy_windy_stained_reaction<br>active | Pike Glide Bait 190<br>Large Jerkbait 192 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 334 |
| acceptable_fit | 937 |
| strong_fit | 2089 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 82 |
| watch | big_fish | A | fly | cold_slow_or_front | 56 |
| watch | all_purpose | A | fly | medium_confidence_archive | 55 |
| watch | big_fish | B | fly | medium_confidence_archive | 46 |
| watch | all_purpose | A | fly | cold_slow_or_front | 45 |
| watch | big_fish | A | lure | medium_confidence_archive | 44 |
| watch | big_fish | A | lure | cold_slow_or_front | 40 |
| watch | big_fish | B | lure | cold_slow_or_front | 39 |
| watch | big_fish | B | lure | medium_confidence_archive | 39 |
| watch | all_purpose | A | lure | medium_confidence_archive | 31 |
| watch | big_fish | B | fly | cold_slow_or_front | 24 |
| watch | all_purpose | B | fly | medium_confidence_archive | 22 |
| watch | all_purpose | B | fly | cold_slow_or_front | 19 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 19 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 19 |
| watch | all_purpose | A | lure | cold_slow_or_front | 18 |
| watch | all_purpose | B | lure | medium_confidence_archive | 15 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 11 |
| watch | all_purpose | B | lure | cold_slow_or_front | 11 |
| watch | big_fish | B | fly | dirty_vibration | 11 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 11 |
| watch | big_fish | A | fly | dirty_vibration | 9 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 8 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 8 |
| watch | big_fish | A | fly | warming_search | 7 |
| watch | all_purpose | A | fly | dirty_vibration | 6 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 5 |
| watch | all_purpose | A | fly | warming_search | 5 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 5 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | B | fly | dirty_vibration | 3 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 3 |
| watch | big_fish | A | lure | dirty_vibration | 3 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 3 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 3 |
| watch | big_fish | B | fly | warming_search | 3 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 2 |
| watch | all_purpose | A | lure | calm_low_light_surface | 2 |
| watch | all_purpose | A | lure | warming_search | 2 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | B | lure | dirty_vibration | 2 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 2 |
| watch | all_purpose | B | lure | warming_search | 2 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 2 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | A | fly | river_elevated_runoff_current | 1 |
| watch | all_purpose | B | lure | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | A | lure | warming_search | 1 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 1 |
| watch | big_fish | B | fly | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | dirty_vibration | 1 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 154 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 140 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 134 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 127 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 119 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 99 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 92 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 81 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 72 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 65 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 62 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 61 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 60 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 60 |
| acceptable_fit | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 56 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 55 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 53 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 50 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 48 |
| acceptable_fit | all_purpose | A | fly | cold_slow_or_front | 47 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 47 |
| acceptable_fit | big_fish | A | lure | warming_search | 22 |
| acceptable_fit | big_fish | B | lure | warming_search | 22 |
| acceptable_fit | all_purpose | A | fly | dirty_vibration | 21 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 1 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 1 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Green Bay / Door County pike water<br>2025-07-24 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 dirty all_purpose B | Inline Spinner (lure_of_the_day, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 dirty all_purpose B | Deceiver (honorable_fly, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-07-24 stained all_purpose A | Deceiver (honorable_fly, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-01-16 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-12-12 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Mille Lacs / Upper Midwest pike lake<br>2025-11-08 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-11-08 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-12-12 stained all_purpose A | Paddle Tail Pike Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Fort Peck prairie pike reservoir<br>2025-05-19 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-10-14 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-04-05 clear all_purpose A | Inline Spinner (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-04-05 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-09-29 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-06-17 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-09-18 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-04-27 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Green Bay / Door County pike water<br>2025-03-28 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1920 | 1198 | 62% |
| clear_subtle | 336 | 34 | 10% |
| dirty_vibration | 1344 | 325 | 24% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 1344 | 516 | 38% |
| low_light_surface | 144 | 23 | 16% |
| calm_surface | 288 | 68 | 24% |
| Big Fish upside | 1680 | 1669 | 99% |
| All Purpose reliable/versatile | 1680 | 1546 | 92% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Large Rabbit Strip Streamer [fly] (274), Large Bucktail Spinner [lure] (255), Articulated Baitfish Streamer [fly] (233), Paddle Tail Pike Jig [lure] (230), Game Changer [fly] (227), Pike Spinnerbait [lure] (212), Pike Flash Fly [fly] (197), Articulated Pike Streamer [fly] (176), Large Jerkbait [lure] (154), Large Paddle-Tail Swimbait [lure] (153), Deceiver [fly] (146), Inline Spinner [lure] (143) |
| All-purpose | Deceiver [fly] (145), Inline Spinner [lure] (143), Shallow Minnowbait [lure] (136), Baitfish Slider Fly [fly] (135), Paddle Tail Pike Jig [lure] (118), Pike Spinnerbait [lure] (102), Game Changer [fly] (99), Blade Bait [lure] (92) |
| Big-fish | Large Rabbit Strip Streamer [fly] (188), Large Bucktail Spinner [lure] (167), Articulated Pike Streamer [fly] (154), Large Paddle-Tail Swimbait [lure] (152), Articulated Baitfish Streamer [fly] (146), Large Jerkbait [lure] (133), Game Changer [fly] (128), Paddle Tail Pike Jig [lure] (112) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 14 | 14 | 0 | 0 | 4 |
| fly | 16 | 16 | 0 | 0 | 4 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 274/840 | 32.6% | big_fish:188, all_purpose:86 | A:155, B:119 | top:181, honorable:93 | stained:99, dirty:90, clear:85 | freshwater_lake_pond:250, freshwater_river:24 | wind_reaction:170, cold_slow:142, open_water_search:127, dirty_vibration:117 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 255/840 | 30.4% | big_fish:167, all_purpose:88 | B:133, A:122 | honorable:146, top:109 | clear:99, stained:84, dirty:72 | freshwater_lake_pond:217, freshwater_river:38 | wind_reaction:176, open_water_search:135, dirty_vibration:115, cold_slow:97 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 233/840 | 27.7% | big_fish:146, all_purpose:87 | A:123, B:110 | honorable:139, top:94 | dirty:89, stained:82, clear:62 | freshwater_lake_pond:208, freshwater_river:25 | wind_reaction:129, open_water_search:110, dirty_vibration:101, cold_slow:88 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 230/840 | 27.4% | all_purpose:118, big_fish:112 | A:160, B:70 | top:124, honorable:106 | dirty:93, stained:92, clear:45 | freshwater_lake_pond:198, freshwater_river:32 | cold_slow:163, wind_reaction:133, dirty_vibration:120, open_water_search:92 |
| Game Changer<br>game_changer | fly | 227/840 | 27% | big_fish:128, all_purpose:99 | A:126, B:101 | honorable:126, top:101 | clear:94, dirty:71, stained:62 | freshwater_lake_pond:199, freshwater_river:28 | wind_reaction:121, open_water_search:105, dirty_vibration:77, cold_slow:76 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 212/732 | 29% | big_fish:110, all_purpose:102 | A:110, B:102 | honorable:117, top:95 | dirty:91, stained:73, clear:48 | freshwater_lake_pond:174, freshwater_river:38 | wind_reaction:107, dirty_vibration:90, open_water_search:76, cold_slow:53 |
| Pike Flash Fly<br>pike_flash_fly | fly | 197/540 | 36.5% | big_fish:109, all_purpose:88 | B:99, A:98 | honorable:107, top:90 | clear:72, stained:63, dirty:62 | freshwater_lake_pond:172, freshwater_river:25 | wind_reaction:132, open_water_search:93, dirty_vibration:90, cold_slow:52 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 176/840 | 21% | big_fish:154, all_purpose:22 | B:107, A:69 | top:97, honorable:79 | dirty:69, stained:63, clear:44 | freshwater_lake_pond:155, freshwater_river:21 | wind_reaction:119, dirty_vibration:90, open_water_search:84, cold_slow:65 |
| Large Jerkbait<br>pike_jerkbait | lure | 154/840 | 18.3% | big_fish:133, all_purpose:21 | B:82, A:72 | top:80, honorable:74 | clear:60, stained:52, dirty:42 | freshwater_lake_pond:133, freshwater_river:21 | wind_reaction:115, open_water_search:99, dirty_vibration:73, cold_slow:59 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 153/840 | 18.2% | big_fish:152, all_purpose:1 | B:84, A:69 | honorable:84, top:69 | clear:56, dirty:53, stained:44 | freshwater_lake_pond:129, freshwater_river:24 | wind_reaction:75, open_water_search:64, cold_slow:62, dirty_vibration:50 |
| Deceiver<br>deceiver | fly | 146/840 | 17.4% | all_purpose:145, big_fish:1 | A:73, B:73 | honorable:78, top:68 | clear:50, stained:49, dirty:47 | freshwater_lake_pond:134, freshwater_river:12 | wind_reaction:106, open_water_search:82, dirty_vibration:69, cold_slow:55 |
| Inline Spinner<br>inline_spinner | lure | 143/624 | 22.9% | all_purpose:143 | B:88, A:55 | top:98, honorable:45 | clear:50, stained:47, dirty:46 | freshwater_lake_pond:120, freshwater_river:23 | wind_reaction:78, open_water_search:60, dirty_vibration:55, cold_slow:42 |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 136/732 | 18.6% | all_purpose:136 | B:96, A:40 | top:80, honorable:56 | clear:50, dirty:43, stained:43 | freshwater_lake_pond:114, freshwater_river:22 | wind_reaction:62, open_water_search:54, dirty_vibration:40, cold_slow:35 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 135/624 | 21.6% | all_purpose:135 | B:94, A:41 | top:71, honorable:64 | dirty:48, stained:44, clear:43 | freshwater_lake_pond:116, freshwater_river:19 | wind_reaction:77, open_water_search:59, dirty_vibration:53, cold_slow:41 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 120/840 | 14.3% | all_purpose:70, big_fish:50 | A:76, B:44 | honorable:65, top:55 | stained:44, clear:39, dirty:37 | freshwater_lake_pond:115, freshwater_river:5 | cold_slow:107, wind_reaction:55, open_water_search:41, dirty_vibration:37 |
| Weedless Spoon<br>weedless_spoon | lure | 114/360 | 31.7% | big_fish:67, all_purpose:47 | A:60, B:54 | honorable:61, top:53 | clear:39, stained:39, dirty:36 | freshwater_lake_pond:114 | wind_reaction:57, dirty_vibration:37, open_water_search:37, cold_slow:26 |
| Blade Bait<br>blade_bait | lure | 94/840 | 11.2% | all_purpose:92, big_fish:2 | A:71, B:23 | honorable:48, top:46 | clear:43, stained:26, dirty:25 | freshwater_lake_pond:88, freshwater_river:6 | cold_slow:80, wind_reaction:44, open_water_search:34, dirty_vibration:25 |
| Pike Glide Bait<br>pike_glidebait | lure | 78/432 | 18.1% | big_fish:78 | B:48, A:30 | honorable:41, top:37 | clear:28, stained:26, dirty:24 | freshwater_lake_pond:78 | wind_reaction:41, open_water_search:34, dirty_vibration:25, cold_slow:18 |
| Casting Spoon<br>casting_spoon | lure | 68/840 | 8.1% | all_purpose:68 | A:37, B:31 | honorable:44, top:24 | clear:29, stained:21, dirty:18 | freshwater_lake_pond:59, freshwater_river:9 | wind_reaction:55, open_water_search:45, dirty_vibration:30, warming_search:16 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 46/624 | 7.4% | all_purpose:42, big_fish:4 | A:23, B:23 | honorable:28, top:18 | clear:29, stained:12, dirty:5 | freshwater_lake_pond:42, freshwater_river:4 | clear_subtle:22, cold_slow:15, wind_reaction:10, warming_search:9 |
| Clouser Minnow<br>clouser_minnow | fly | 26/108 | 24.1% | all_purpose:24, big_fish:2 | B:17, A:9 | top:15, honorable:11 | clear:10, stained:9, dirty:7 | freshwater_river:26 | current_swing:11, dirty_vibration:11, open_water_search:10, wind_reaction:10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 25/120 | 20.8% | big_fish:22, all_purpose:3 | A:14, B:11 | honorable:16, top:9 | dirty:10, stained:8, clear:7 | freshwater_lake_pond:19, freshwater_river:6 | calm_surface:21, low_light_surface:7, warming_search:5, open_water_search:4 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 24/108 | 22.2% | big_fish:24 | B:15, A:9 | honorable:13, top:11 | clear:8, dirty:8, stained:8 | freshwater_lake_pond:24 | cold_slow:24, wind_reaction:15, dirty_vibration:10, open_water_search:9 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 24/108 | 22.2% | all_purpose:22, big_fish:2 | B:21, A:3 | top:16, honorable:8 | dirty:11, stained:7, clear:6 | freshwater_lake_pond:24 | cold_slow:24, wind_reaction:13, dirty_vibration:10, open_water_search:10 |
| Popper Fly<br>popper_fly | fly | 21/120 | 17.5% | all_purpose:21 | A:13, B:8 | top:13, honorable:8 | clear:7, dirty:7, stained:7 | freshwater_lake_pond:18, freshwater_river:3 | calm_surface:18, low_light_surface:6, warming_search:6, clear_subtle:3 |
| Large Pike Topwater<br>large_pike_topwater | lure | 16/96 | 16.7% | big_fish:15, all_purpose:1 | A:10, B:6 | honorable:9, top:7 | clear:6, stained:6, dirty:4 | freshwater_lake_pond:16 | calm_surface:15, low_light_surface:4, warming_search:4, clear_subtle:3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 13/108 | 12% | all_purpose:13 | A:8, B:5 | top:9, honorable:4 | stained:5, clear:4, dirty:4 | freshwater_river:13 | current_swing:9, dirty_vibration:8, open_water_search:6, wind_reaction:6 |
| Frog Fly<br>frog_fly | fly | 12/96 | 12.5% | big_fish:12 | B:9, A:3 | honorable:7, top:5 | clear:4, dirty:4, stained:4 | freshwater_lake_pond:12 | calm_surface:11, low_light_surface:4, warming_search:4, clear_subtle:2 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 5/24 | 20.8% | all_purpose:5 | B:5 | top:3, honorable:2 | clear:2, dirty:2, stained:1 | freshwater_river:5 | calm_surface:3, low_light_surface:2, open_water_search:2, wind_reaction:2 |
| Large Pike Tube<br>large_pike_tube | lure | 3/12 | 25% | big_fish:2, all_purpose:1 | B:2, A:1 | top:2, honorable:1 | dirty:2, clear:1 | freshwater_river:3 | current_swing:3, open_water_search:3, wind_reaction:3, dirty_vibration:2 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 274/3360 (8.2%) | 181/1680 (10.8%) | 93/1680 (5.5%) | - | 274/1680 (16.3%) |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 255/3360 (7.6%) | 109/1680 (6.5%) | 146/1680 (8.7%) | 255/1680 (15.2%) | - |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 233/3360 (6.9%) | 94/1680 (5.6%) | 139/1680 (8.3%) | - | 233/1680 (13.9%) |  |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 230/3360 (6.8%) | 124/1680 (7.4%) | 106/1680 (6.3%) | 230/1680 (13.7%) | - |  |
| Game Changer<br>game_changer | fly | 227/3360 (6.8%) | 101/1680 (6%) | 126/1680 (7.5%) | - | 227/1680 (13.5%) |  |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 212/3360 (6.3%) | 95/1680 (5.7%) | 117/1680 (7%) | 212/1680 (12.6%) | - |  |
| Pike Flash Fly<br>pike_flash_fly | fly | 197/3360 (5.9%) | 90/1680 (5.4%) | 107/1680 (6.4%) | - | 197/1680 (11.7%) |  |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 176/3360 (5.2%) | 97/1680 (5.8%) | 79/1680 (4.7%) | - | 176/1680 (10.5%) |  |
| Large Jerkbait<br>pike_jerkbait | lure | 154/3360 (4.6%) | 80/1680 (4.8%) | 74/1680 (4.4%) | 154/1680 (9.2%) | - |  |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 153/3360 (4.6%) | 69/1680 (4.1%) | 84/1680 (5%) | 153/1680 (9.1%) | - |  |
| Deceiver<br>deceiver | fly | 146/3360 (4.3%) | 68/1680 (4%) | 78/1680 (4.6%) | - | 146/1680 (8.7%) |  |
| Inline Spinner<br>inline_spinner | lure | 143/3360 (4.3%) | 98/1680 (5.8%) | 45/1680 (2.7%) | 143/1680 (8.5%) | - |  |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 136/3360 (4%) | 80/1680 (4.8%) | 56/1680 (3.3%) | 136/1680 (8.1%) | - |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 135/3360 (4%) | 71/1680 (4.2%) | 64/1680 (3.8%) | - | 135/1680 (8%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 120/3360 (3.6%) | 55/1680 (3.3%) | 65/1680 (3.9%) | - | 120/1680 (7.1%) |  |
| Weedless Spoon<br>weedless_spoon | lure | 114/3360 (3.4%) | 53/1680 (3.2%) | 61/1680 (3.6%) | 114/1680 (6.8%) | - |  |
| Blade Bait<br>blade_bait | lure | 94/3360 (2.8%) | 46/1680 (2.7%) | 48/1680 (2.9%) | 94/1680 (5.6%) | - |  |
| Pike Glide Bait<br>pike_glidebait | lure | 78/3360 (2.3%) | 37/1680 (2.2%) | 41/1680 (2.4%) | 78/1680 (4.6%) | - |  |
| Casting Spoon<br>casting_spoon | lure | 68/3360 (2%) | 24/1680 (1.4%) | 44/1680 (2.6%) | 68/1680 (4%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 46/3360 (1.4%) | 18/1680 (1.1%) | 28/1680 (1.7%) | - | 46/1680 (2.7%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 26/3360 (0.8%) | 15/1680 (0.9%) | 11/1680 (0.7%) | - | 26/1680 (1.5%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 25/3360 (0.7%) | 9/1680 (0.5%) | 16/1680 (1%) | - | 25/1680 (1.5%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 24/3360 (0.7%) | 11/1680 (0.7%) | 13/1680 (0.8%) | - | 24/1680 (1.4%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 24/3360 (0.7%) | 16/1680 (1%) | 8/1680 (0.5%) | 24/1680 (1.4%) | - |  |
| Popper Fly<br>popper_fly | fly | 21/3360 (0.6%) | 13/1680 (0.8%) | 8/1680 (0.5%) | - | 21/1680 (1.3%) |  |
| Large Pike Topwater<br>large_pike_topwater | lure | 16/3360 (0.5%) | 7/1680 (0.4%) | 9/1680 (0.5%) | 16/1680 (1%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 13/3360 (0.4%) | 9/1680 (0.5%) | 4/1680 (0.2%) | - | 13/1680 (0.8%) |  |
| Frog Fly<br>frog_fly | fly | 12/3360 (0.4%) | 5/1680 (0.3%) | 7/1680 (0.4%) | - | 12/1680 (0.7%) |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 5/3360 (0.1%) | 3/1680 (0.2%) | 2/1680 (0.1%) | - | 5/1680 (0.3%) |  |
| Large Pike Tube<br>large_pike_tube | lure | 3/3360 (0.1%) | 2/1680 (0.1%) | 1/1680 (0.1%) | 3/1680 (0.2%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Pike Flash Fly<br>pike_flash_fly | fly | 197/540 | 36.5% | big_fish:109, all_purpose:88 | wind_reaction:132, open_water_search:93, dirty_vibration:90, cold_slow:52, warming_search:33 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 274/840 | 32.6% | big_fish:188, all_purpose:86 | wind_reaction:170, cold_slow:142, open_water_search:127, dirty_vibration:117, warming_search:29 |
| Weedless Spoon<br>weedless_spoon | lure | 114/360 | 31.7% | big_fish:67, all_purpose:47 | wind_reaction:57, dirty_vibration:37, open_water_search:37, cold_slow:26, calm_surface:24 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 255/840 | 30.4% | big_fish:167, all_purpose:88 | wind_reaction:176, open_water_search:135, dirty_vibration:115, cold_slow:97, warming_search:39 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 212/732 | 29% | big_fish:110, all_purpose:102 | wind_reaction:107, dirty_vibration:90, open_water_search:76, cold_slow:53, warming_search:38 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 233/840 | 27.7% | big_fish:146, all_purpose:87 | wind_reaction:129, open_water_search:110, dirty_vibration:101, cold_slow:88, warming_search:33 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 230/840 | 27.4% | all_purpose:118, big_fish:112 | cold_slow:163, wind_reaction:133, dirty_vibration:120, open_water_search:92, warming_search:20 |
| Game Changer<br>game_changer | fly | 227/840 | 27% | big_fish:128, all_purpose:99 | wind_reaction:121, open_water_search:105, dirty_vibration:77, cold_slow:76, warming_search:35 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Pike Glide Bait<br>pike_glidebait | lure | home-window >30% severe | 42/106 | 39.6% | selector_filtering_variety_jitter:37 | AP/BF 0/0, 42/106<br>clarity clear:52, stained:30, dirty:24<br>bucket cold_slow_or_front:36, stable_pleasant_medium_confidence_archive:30, breezy_windy_stained_reaction:12 |
| Pike Flash Fly<br>pike_flash_fly | fly | home-window >30% severe | 194/532 | 36.5% | seasonal_baseline:122 | AP/BF 86/266, 108/266<br>clarity dirty:180, clear:176, stained:176<br>bucket stable_pleasant_medium_confidence_archive:152, dirty_vibration:108, cold_slow_or_front:104 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | home-window >30% severe | 139/412 | 33.7% | daily_condition_tags:116 | AP/BF 71/206, 68/206<br>clarity dirty:244, stained:168<br>bucket dirty_vibration:144, breezy_windy_stained_reaction:136, stable_pleasant_medium_confidence_archive:64 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | home-window >30% severe | 272/816 | 33.3% | goal_tags:260 | AP/BF 84/396, 188/420<br>clarity dirty:280, clear:268, stained:268<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 |
| Weedless Spoon<br>weedless_spoon | lure | home-window >30% severe | 114/360 | 31.7% | goal_tags:96 | AP/BF 47/180, 67/180<br>clarity clear:120, dirty:120, stained:120<br>bucket stable_pleasant_medium_confidence_archive:120, cold_slow_or_front:80, breezy_windy_stained_reaction:64 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | home-window >30% severe | 242/768 | 31.5% | goal_tags:269 | AP/BF 88/384, 154/384<br>clarity dirty:280, clear:244, stained:244<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | home-window >25% overdominant | 227/792 | 28.7% | goal_tags:175 | AP/BF 117/396, 110/396<br>clarity dirty:280, clear:256, stained:256<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >25% overdominant | 209/768 | 27.2% | daily_condition_tags:308 | AP/BF 77/384, 132/384<br>clarity dirty:280, clear:244, stained:244<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 |
| Game Changer<br>game_changer | fly | home-window >25% overdominant | 206/768 | 26.8% | daily_condition_tags:311 | AP/BF 90/384, 116/384<br>clarity dirty:280, clear:244, stained:244<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >25% overdominant | 25/96 | 26% | goal_tags:45 | AP/BF 3/48, 22/48<br>clarity clear:32, dirty:32, stained:32<br>bucket stable_pleasant_medium_confidence_archive:40, warming_search:16, calm_low_light_surface:12 |
| Inline Spinner<br>inline_spinner | lure | home-window >20% watch | 117/504 | 23.2% | goal_tags:252 | AP/BF 117/252, 0/252<br>clarity dirty:208, clear:148, stained:148<br>bucket stable_pleasant_medium_confidence_archive:120, dirty_vibration:116, breezy_windy_stained_reaction:108 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | home-window >20% watch | 130/584 | 22.3% | goal_tags:313 | AP/BF 130/292, 0/292<br>clarity dirty:208, clear:188, stained:188<br>bucket stable_pleasant_medium_confidence_archive:156, cold_slow_or_front:120, dirty_vibration:116 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | home-window >20% watch | 24/108 | 22.2% | daily_condition_tags:43 | AP/BF 0/54, 24/54<br>clarity clear:36, dirty:36, stained:36<br>bucket cold_slow_or_front:60, breezy_windy_stained_reaction:24, dirty_vibration:24 |
| Popper Fly<br>popper_fly | fly | home-window >20% watch | 21/96 | 21.9% | goal_tags:48 | AP/BF 21/48, 0/48<br>clarity clear:32, dirty:32, stained:32<br>bucket stable_pleasant_medium_confidence_archive:40, warming_search:16, calm_low_light_surface:12 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | home-window >20% watch | 176/816 | 21.6% | goal_tags:349 | AP/BF 22/396, 154/420<br>clarity dirty:280, clear:268, stained:268<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pike Glide Bait<br>pike_glidebait | lure | 78/3360 (2.3%) | 37/1680 (2.2%) | 41/1680 (2.4%) | 78/1680 (4.6%) | 42/106 (39.6%) | 21/106 (19.8%) / 21/106 (19.8%) | home>20%<br>home>25%<br>home>30% |
| Pike Flash Fly<br>pike_flash_fly | fly | 197/3360 (5.9%) | 90/1680 (5.4%) | 107/1680 (6.4%) | 197/1680 (11.7%) | 194/532 (36.5%) | 89/532 (16.7%) / 105/532 (19.7%) | home>20%<br>home>25%<br>home>30% |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 212/3360 (6.3%) | 95/1680 (5.7%) | 117/1680 (7%) | 212/1680 (12.6%) | 139/412 (33.7%) | 76/412 (18.4%) / 63/412 (15.3%) | home>20%<br>home>25%<br>home>30% |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 274/3360 (8.2%) | 181/1680 (10.8%) | 93/1680 (5.5%) | 274/1680 (16.3%) | 272/816 (33.3%) | 179/816 (21.9%) / 93/816 (11.4%) | home>20%<br>home>25%<br>home>30% |
| Weedless Spoon<br>weedless_spoon | lure | 114/3360 (3.4%) | 53/1680 (3.2%) | 61/1680 (3.6%) | 114/1680 (6.8%) | 114/360 (31.7%) | 53/360 (14.7%) / 61/360 (16.9%) | home>20%<br>home>25%<br>home>30% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 255/3360 (7.6%) | 109/1680 (6.5%) | 146/1680 (8.7%) | 255/1680 (15.2%) | 242/768 (31.5%) | 105/768 (13.7%) / 137/768 (17.8%) | home>20%<br>home>25%<br>home>30% |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 230/3360 (6.8%) | 124/1680 (7.4%) | 106/1680 (6.3%) | 230/1680 (13.7%) | 227/792 (28.7%) | 124/792 (15.7%) / 103/792 (13%) | home>20%<br>home>25% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 233/3360 (6.9%) | 94/1680 (5.6%) | 139/1680 (8.3%) | 233/1680 (13.9%) | 209/768 (27.2%) | 87/768 (11.3%) / 122/768 (15.9%) | home>20%<br>home>25% |
| Game Changer<br>game_changer | fly | 227/3360 (6.8%) | 101/1680 (6%) | 126/1680 (7.5%) | 227/1680 (13.5%) | 206/768 (26.8%) | 94/768 (12.2%) / 112/768 (14.6%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 25/3360 (0.7%) | 9/1680 (0.5%) | 16/1680 (1%) | 25/1680 (1.5%) | 25/96 (26%) | 9/96 (9.4%) / 16/96 (16.7%) | home>20%<br>home>25% |
| Inline Spinner<br>inline_spinner | lure | 143/3360 (4.3%) | 98/1680 (5.8%) | 45/1680 (2.7%) | 143/1680 (8.5%) | 117/504 (23.2%) | 85/504 (16.9%) / 32/504 (6.3%) | home>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 135/3360 (4%) | 71/1680 (4.2%) | 64/1680 (3.8%) | 135/1680 (8%) | 130/584 (22.3%) | 69/584 (11.8%) / 61/584 (10.4%) | home>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 24/3360 (0.7%) | 11/1680 (0.7%) | 13/1680 (0.8%) | 24/1680 (1.4%) | 24/108 (22.2%) | 11/108 (10.2%) / 13/108 (12%) | home>20% |
| Popper Fly<br>popper_fly | fly | 21/3360 (0.6%) | 13/1680 (0.8%) | 8/1680 (0.5%) | 21/1680 (1.3%) | 21/96 (21.9%) | 13/96 (13.5%) / 8/96 (8.3%) | home>20% |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 176/3360 (5.2%) | 97/1680 (5.8%) | 79/1680 (4.7%) | 176/1680 (10.5%) | 176/816 (21.6%) | 97/816 (11.9%) / 79/816 (9.7%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.31.
Average expanded finalist pool size: 3.42.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1278.
Rows/slots with expanded finalist pool size 1: 499.
Selected-tier singleton slots expanded above 1: 779.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.09 | 3.56 | 1 | 1 | 375 | 103 |
| fly/top | 2.10 | 3.54 | 1 | 1 | 347 | 138 |
| lure/honorable | 2.52 | 3.25 | 1 | 1 | 274 | 117 |
| lure/top | 2.55 | 3.31 | 1 | 1 | 282 | 141 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 2260 |
| goal_or_priority_condition | 1097 |
| credible_fallback | 3 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2550 |
| goal_and_priority_condition | 2260 |
| credible_fallback | 112 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 274 |
| family_diversity_scarcity | 215 |
| surface_safety_scarcity | 10 |

Representative expanded singleton finalist pools:
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B fly/top: pike_bunny_streamer (goal_or_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__A fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__A lure/honorable: blade_bait (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/honorable: deep_diving_crankbait (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__A fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__A lure/honorable: pike_jig_and_plastic (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: deep_diving_crankbait (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: pike_bunny_streamer (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__A fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B lure/honorable: large_bucktail_spinner (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__B fly/top: pike_bunny_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__B fly/honorable: deceiver (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__A fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__A lure/honorable: blade_bait (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__all_purpose__B lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__A lure/top: pike_jig_and_plastic (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__A fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 3.63 |
| Different-presentation close candidates | 1.71 |
| Different-family close candidates | 2.30 |
| Final expanded Set B pool | 2.22 |
| Same-family/same-presentation reintroduced | 31/1680 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 336 |
| Coverage pool used | 63 |
| Average used coverage pool size | 3.41 |
| Singleton used coverage pools | 9 |
| Broad pool larger than narrowed pool | 43 |
| Broad pool same as narrowed pool | 20 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 273 |
| broad | 63 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| large_bucktail_spinner | 45 |
| pike_jerkbait | 41 |
| casting_spoon | 40 |
| pike_spinnerbait | 34 |
| pike_jig_and_plastic | 30 |
| weedless_spoon | 15 |
| inline_spinner | 10 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| pike_jig_and_plastic | 15 |
| large_bucktail_spinner | 14 |
| pike_jerkbait | 13 |
| pike_spinnerbait | 9 |
| weedless_spoon | 6 |
| casting_spoon | 5 |
| inline_spinner | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 2880 | 0 | 0 |
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
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
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
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 233/840 | 209/768 | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 24/108 | 24/108 | goal_tags>1<br>home-window share>20% |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 176/840 | 176/816 | home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 135/624 | 130/584 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 26/108 | 6/28 | goal_tags>1 |
| Deceiver<br>deceiver | fly | 7 | 146/840 | 139/768 | clear+stained+dirty clarity |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 25/120 | 25/96 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 5/24 | 5/24 | clear+stained+dirty clarity<br>goal_tags>1 |
| Frog Fly<br>frog_fly | fly | 9 | 12/96 | 12/72 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 227/840 | 206/768 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 274/840 | 272/816 | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Flash Fly<br>pike_flash_fly | fly | 8 | 197/540 | 194/532 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Popper Fly<br>popper_fly | fly | 8 | 21/120 | 21/96 | goal_tags>1<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 120/840 | 89/768 | goal_tags>1<br>reliable_action+big_fish_upside |
| Blade Bait<br>blade_bait | lure | 7 | 94/840 | 0/0 | clear+stained+dirty clarity |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 24/108 | 10/48 | clear+stained+dirty clarity |
| Inline Spinner<br>inline_spinner | lure | 8 | 143/624 | 117/504 | goal_tags>1<br>home-window share>20% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 255/840 | 242/768 | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 153/840 | 153/804 | clear+stained+dirty clarity |
| Large Pike Topwater<br>large_pike_topwater | lure | 8 | 16/96 | 16/72 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Large Pike Tube<br>large_pike_tube | lure | 10 | 3/12 | 3/12 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 230/840 | 227/792 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Pike Glide Bait<br>pike_glidebait | lure | 8 | 78/432 | 42/106 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 9 | 212/732 | 139/412 | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 7 | 136/732 | 0/0 | goal_tags>1<br>open_water+warming+versatile |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 114/360 | 114/360 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 8 | 274/840 (32.6%) | 272/816 (33.3%) | big_fish:188, all_purpose:86 | top:181, honorable:93 | wind_reaction:170, cold_slow:142, open_water_search:127, dirty_vibration:117, warming_search:29 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 255/840 (30.4%) | 242/768 (31.5%) | big_fish:167, all_purpose:88 | honorable:146, top:109 | wind_reaction:176, open_water_search:135, dirty_vibration:115, cold_slow:97, warming_search:39 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 233/840 (27.7%) | 209/768 (27.2%) | big_fish:146, all_purpose:87 | honorable:139, top:94 | wind_reaction:129, open_water_search:110, dirty_vibration:101, cold_slow:88, warming_search:33 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 8 | 230/840 (27.4%) | 227/792 (28.7%) | all_purpose:118, big_fish:112 | top:124, honorable:106 | cold_slow:163, wind_reaction:133, dirty_vibration:120, open_water_search:92, warming_search:20 |
| Game Changer<br>game_changer | fly | 7 | 227/840 (27%) | 206/768 (26.8%) | big_fish:128, all_purpose:99 | honorable:126, top:101 | wind_reaction:121, open_water_search:105, dirty_vibration:77, cold_slow:76, warming_search:35 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 9 | 212/732 (29%) | 139/412 (33.7%) | big_fish:110, all_purpose:102 | honorable:117, top:95 | wind_reaction:107, dirty_vibration:90, open_water_search:76, cold_slow:53, warming_search:38 |
| Pike Flash Fly<br>pike_flash_fly | fly | 8 | 197/540 (36.5%) | 194/532 (36.5%) | big_fish:109, all_purpose:88 | honorable:107, top:90 | wind_reaction:132, open_water_search:93, dirty_vibration:90, cold_slow:52, warming_search:33 |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 6 | 176/840 (21%) | 176/816 (21.6%) | big_fish:154, all_purpose:22 | top:97, honorable:79 | wind_reaction:119, dirty_vibration:90, open_water_search:84, cold_slow:65, warming_search:25 |
| Large Jerkbait<br>pike_jerkbait | lure | 6 | 154/840 (18.3%) | 153/828 (18.5%) | big_fish:133, all_purpose:21 | top:80, honorable:74 | wind_reaction:115, open_water_search:99, dirty_vibration:73, cold_slow:59, warming_search:24 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 8 | 153/840 (18.2%) | 153/804 (19%) | big_fish:152, all_purpose:1 | honorable:84, top:69 | wind_reaction:75, open_water_search:64, cold_slow:62, dirty_vibration:50, warming_search:26 |
| Deceiver<br>deceiver | fly | 7 | 146/840 (17.4%) | 139/768 (18.1%) | all_purpose:145, big_fish:1 | honorable:78, top:68 | wind_reaction:106, open_water_search:82, dirty_vibration:69, cold_slow:55, warming_search:24 |
| Inline Spinner<br>inline_spinner | lure | 8 | 143/624 (22.9%) | 117/504 (23.2%) | all_purpose:143 | top:98, honorable:45 | wind_reaction:78, open_water_search:60, dirty_vibration:55, cold_slow:42, warming_search:27 |
| Shallow Minnowbait<br>shallow_minnowbait | lure | 7 | 136/732 (18.6%) | 0/0 | all_purpose:136 | top:80, honorable:56 | wind_reaction:62, open_water_search:54, dirty_vibration:40, cold_slow:35, warming_search:27 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 135/624 (21.6%) | 130/584 (22.3%) | all_purpose:135 | top:71, honorable:64 | wind_reaction:77, open_water_search:59, dirty_vibration:53, cold_slow:41, warming_search:26 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 120/840 (14.3%) | 89/768 (11.6%) | all_purpose:70, big_fish:50 | honorable:65, top:55 | cold_slow:107, wind_reaction:55, open_water_search:41, dirty_vibration:37, clear_subtle:14 |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 114/360 (31.7%) | 114/360 (31.7%) | big_fish:67, all_purpose:47 | honorable:61, top:53 | wind_reaction:57, dirty_vibration:37, open_water_search:37, cold_slow:26, calm_surface:24 |
| Blade Bait<br>blade_bait | lure | 7 | 94/840 (11.2%) | 0/0 | all_purpose:92, big_fish:2 | honorable:48, top:46 | cold_slow:80, wind_reaction:44, open_water_search:34, dirty_vibration:25, clear_subtle:19 |
| Pike Glide Bait<br>pike_glidebait | lure | 8 | 78/432 (18.1%) | 42/106 (39.6%) | big_fish:78 | honorable:41, top:37 | wind_reaction:41, open_water_search:34, dirty_vibration:25, cold_slow:18, clear_subtle:12 |
| Casting Spoon<br>casting_spoon | lure | 6 | 68/840 (8.1%) | 67/824 (8.1%) | all_purpose:68 | honorable:44, top:24 | wind_reaction:55, open_water_search:45, dirty_vibration:30, warming_search:16, cold_slow:13 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 46/624 (7.4%) | 39/584 (6.7%) | all_purpose:42, big_fish:4 | honorable:28, top:18 | clear_subtle:22, cold_slow:15, wind_reaction:10, warming_search:9, open_water_search:8 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 26/108 (24.1%) | 6/28 (21.4%) | all_purpose:24, big_fish:2 | top:15, honorable:11 | current_swing:11, dirty_vibration:11, open_water_search:10, wind_reaction:10, warming_search:6 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 25/120 (20.8%) | 25/96 (26%) | big_fish:22, all_purpose:3 | honorable:16, top:9 | calm_surface:21, low_light_surface:7, warming_search:5, open_water_search:4, wind_reaction:4 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 24/108 (22.2%) | 24/108 (22.2%) | big_fish:24 | honorable:13, top:11 | cold_slow:24, wind_reaction:15, dirty_vibration:10, open_water_search:9, clear_subtle:2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 24/108 (22.2%) | 10/48 (20.8%) | all_purpose:22, big_fish:2 | top:16, honorable:8 | cold_slow:24, wind_reaction:13, dirty_vibration:10, open_water_search:10, clear_subtle:2 |
| Popper Fly<br>popper_fly | fly | 8 | 21/120 (17.5%) | 21/96 (21.9%) | all_purpose:21 | top:13, honorable:8 | calm_surface:18, low_light_surface:6, warming_search:6, clear_subtle:3, open_water_search:3 |
| Large Pike Topwater<br>large_pike_topwater | lure | 8 | 16/96 (16.7%) | 16/72 (22.2%) | big_fish:15, all_purpose:1 | honorable:9, top:7 | calm_surface:15, low_light_surface:4, warming_search:4, clear_subtle:3, open_water_search:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 13/108 (12%) | 13/100 (13%) | all_purpose:13 | top:9, honorable:4 | current_swing:9, dirty_vibration:8, open_water_search:6, wind_reaction:6, cold_slow:2 |
| Frog Fly<br>frog_fly | fly | 9 | 12/96 (12.5%) | 12/72 (16.7%) | big_fish:12 | honorable:7, top:5 | calm_surface:11, low_light_surface:4, warming_search:4, clear_subtle:2, open_water_search:1 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 5/24 (20.8%) | 5/24 (20.8%) | all_purpose:5 | top:3, honorable:2 | calm_surface:3, low_light_surface:2, open_water_search:2, wind_reaction:2, dirty_vibration:1 |
| Large Pike Tube<br>large_pike_tube | lure | 10 | 3/12 (25%) | 3/12 (25%) | big_fish:2, all_purpose:1 | top:2, honorable:1 | current_swing:3, open_water_search:3, wind_reaction:3, dirty_vibration:2 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 274/840 (32.6%) | 272/816 (33.3%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 255/840 (30.4%) | 242/768 (31.5%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 233/840 (27.7%) | 209/768 (27.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 230/840 (27.4%) | 227/792 (28.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Game Changer<br>game_changer | fly | 227/840 (27%) | 206/768 (26.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 212/732 (29%) | 139/412 (33.7%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Flash Fly<br>pike_flash_fly | fly | 197/540 (36.5%) | 194/532 (36.5%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 176/840 (21%) | 176/816 (21.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Inline Spinner<br>inline_spinner | lure | 143/624 (22.9%) | 117/504 (23.2%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 135/624 (21.6%) | 130/584 (22.3%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20% |
| Weedless Spoon<br>weedless_spoon | lure | 114/360 (31.7%) | 114/360 (31.7%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Pike Glide Bait<br>pike_glidebait | lure | 78/432 (18.1%) | 42/106 (39.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Deer Hair Slider<br>deer_hair_slider | fly | 25/120 (20.8%) | 25/96 (26%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 24/108 (22.2%) | 24/108 (22.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Popper Fly<br>popper_fly | fly | 21/120 (17.5%) | 21/96 (21.9%) | catalog_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: open_water_search, wind_reaction<br>goal 1: versatile_search | 824 | 67/824 (8.1%) | Inline Spinner (top), Pike Spinnerbait (honorable):26, Inline Spinner (top), Shallow Minnowbait (honorable):26, Paddle Tail Pike Jig (top), Blade Bait (honorable):26, Blade Bait (top), Paddle Tail Pike Jig (honorable):25 | selector/direct-score or overpowered competitors |
| Weedless Spoon<br>weedless_spoon | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: cover_ambush, wind_reaction<br>goal 2: reliable_action, big_fish_upside | 360 | 114/360 (31.7%) | Inline Spinner (top), Pike Spinnerbait (honorable):20, Inline Spinner (top), Shallow Minnowbait (honorable):11, Large Bucktail Spinner (top), Pike Glide Bait (honorable):9, Pike Glide Bait (top), Large Jerkbait (honorable):8 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 504 | 117/504 (23.2%) | Large Bucktail Spinner (top), Pike Spinnerbait (honorable):18, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):17, Pike Spinnerbait (top), Large Bucktail Spinner (honorable):16, Large Jerkbait (top), Large Bucktail Spinner (honorable):13 | healthy / not underused |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 3: wind_reaction, dirty_vibration, open_water_search<br>goal 2: big_fish_upside, versatile_search | 768 | 242/768 (31.5%) | Inline Spinner (top), Pike Spinnerbait (honorable):27, Inline Spinner (top), Shallow Minnowbait (honorable):24, Blade Bait (top), Paddle Tail Pike Jig (honorable):20, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):20 | healthy / not underused |
| Pike Spinnerbait<br>pike_spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 412 | 139/412 (33.7%) | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):15, Shallow Minnowbait (top), Weedless Spoon (honorable):13, Large Bucktail Spinner (top), Paddle Tail Pike Jig (honorable):12, Large Jerkbait (top), Large Bucktail Spinner (honorable):12 | healthy / not underused |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: open_water_search, cover_ambush<br>goal 1: big_fish_upside | 804 | 153/804 (19%) | Inline Spinner (top), Pike Spinnerbait (honorable):27, Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):25, Inline Spinner (top), Shallow Minnowbait (honorable):24, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):21 | healthy / not underused |
| Large Jerkbait<br>pike_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 2: wind_reaction, open_water_search<br>goal 1: big_fish_upside | 828 | 153/828 (18.5%) | Inline Spinner (top), Shallow Minnowbait (honorable):27, Paddle Tail Pike Jig (top), Blade Bait (honorable):26, Blade Bait (top), Paddle Tail Pike Jig (honorable):25, Inline Spinner (top), Pike Spinnerbait (honorable):25 | healthy / not underused |
| Pike Glide Bait<br>pike_glidebait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: open_water_search, clear_subtle<br>goal 2: big_fish_upside, high_risk_high_reward | 106 | 42/106 (39.6%) | Large Jerkbait (top), Weedless Spoon (honorable):6, Large Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):6, Weedless Spoon (top), Large Bucktail Spinner (honorable):4, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):3 | healthy / not underused |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: cold_slow, dirty_vibration<br>goal 2: big_fish_upside, reliable_action | 792 | 227/792 (28.7%) | Inline Spinner (top), Pike Spinnerbait (honorable):24, Inline Spinner (top), Shallow Minnowbait (honorable):24, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):22, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):21 | healthy / not underused |
| Large Pike Tube<br>large_pike_tube | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: cold_slow, current_swing, cover_ambush<br>goal 2: big_fish_upside, reliable_action | 12 | 3/12 (25%) | Large Jerkbait (top), Large Bucktail Spinner (honorable):2, Blade Bait (top), Shallow Minnowbait (honorable):1, Large Bucktail Spinner (top), Pike Spinnerbait (honorable):1, Large Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):1 | healthy / not underused |
| Large Pike Topwater<br>large_pike_topwater | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 72 | 16/72 (22.2%) | Shallow Minnowbait (top), Weedless Spoon (honorable):5, Inline Spinner (top), Pike Spinnerbait (honorable):4, Inline Spinner (top), Shallow Minnowbait (honorable):4, Pike Spinnerbait (top), Weedless Spoon (honorable):3 | healthy / not underused |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, cover_ambush, cold_slow<br>goal 1: big_fish_upside | 816 | 272/816 (33.3%) | Game Changer (top), Articulated Pike Streamer (honorable):28, Articulated Pike Streamer (top), Game Changer (honorable):27, Articulated Pike Streamer (top), Articulated Baitfish Streamer (honorable):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 | healthy / not underused |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, cover_ambush<br>goal 1: big_fish_upside | 816 | 176/816 (21.6%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):50, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):35, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):32, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):30 | healthy / not underused |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 768 | 209/768 (27.2%) | Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):32, Articulated Pike Streamer (top), Game Changer (honorable):27, Game Changer (top), Articulated Pike Streamer (honorable):25, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):24 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 100 | 13/100 (13%) | Large Rabbit Strip Streamer (top), Game Changer (honorable):5, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):5, Baitfish Slider Fly (top), Clouser Minnow (honorable):4, Clouser Minnow (top), Deceiver (honorable):4 | healthy / not underused |
| Deceiver<br>deceiver | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 768 | 139/768 (18.1%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):42, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):33, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):32, Articulated Pike Streamer (top), Game Changer (honorable):27 | healthy / not underused |
| Pike Flash Fly<br>pike_flash_fly | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 2: big_fish_upside, versatile_search | 532 | 194/532 (36.5%) | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):22, Articulated Baitfish Streamer (top), Large Rabbit Strip Streamer (honorable):21, Game Changer (top), Articulated Pike Streamer (honorable):16, Articulated Pike Streamer (top), Game Changer (honorable):15 | healthy / not underused |

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
| healthy | Articulated Pike Streamer, Deceiver, Rabbit-Strip Leech, Baitfish Slider Fly, Articulated Dungeon Streamer, Bucktail Streamer, Deer Hair Slider, Popper Fly, Frog Fly, Foam Gurgler, Large Jerkbait, Casting Spoon, Large Paddle-Tail Swimbait, Inline Spinner, Large Pike Topwater, Large Pike Tube |
| underused_home_window | Unweighted Baitfish Streamer |
| no_home_window_coverage | None |
| over-dominant | Large Rabbit Strip Streamer, Articulated Baitfish Streamer, Game Changer, Pike Flash Fly, Paddle Tail Pike Jig, Large Bucktail Spinner, Pike Spinnerbait, Weedless Spoon, Pike Glide Bait |
| probably okay niche profile | None |

## Pike Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Pike Streamer<br>large_articulated_pike_streamer | fly | 10.5% | 176/840 | 176/816 | 176 | 176 | 21.6% | 22/396 | 154/420 | 187 | healthy | activity neutral:612, active:156, suppressed:48<br>clarity dirty:280, clear:268, stained:268<br>water freshwater_lake_pond:708, freshwater_river:108<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):49, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):30, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):28 |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 16.3% | 274/840 | 272/816 | 274 | 272 | 33.3% | 84/396 | 188/420 | 382 | over-dominant | activity neutral:612, active:156, suppressed:48<br>clarity dirty:280, clear:268, stained:268<br>water freshwater_lake_pond:708, freshwater_river:108<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 | Game Changer (top), Articulated Pike Streamer (honorable):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 13.9% | 233/840 | 209/768 | 233 | 209 | 27.2% | 77/384 | 132/384 | 293 | over-dominant | activity neutral:588, active:156, suppressed:24<br>clarity dirty:280, clear:244, stained:244<br>water freshwater_lake_pond:668, freshwater_river:100<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 | Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):23, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22 |
| Deceiver<br>deceiver | fly | 8.7% | 146/840 | 139/768 | 146 | 139 | 18.1% | 138/384 | 1/384 | 357 | healthy | activity neutral:588, active:156, suppressed:24<br>clarity dirty:280, clear:244, stained:244<br>water freshwater_lake_pond:668, freshwater_river:100<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):41, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):28, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):23 |
| Game Changer<br>game_changer | fly | 13.5% | 227/840 | 206/768 | 227 | 206 | 26.8% | 90/384 | 116/384 | 353 | over-dominant | activity neutral:588, active:156, suppressed:24<br>clarity dirty:280, clear:244, stained:244<br>water freshwater_lake_pond:668, freshwater_river:100<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):41, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):28, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):23 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7.1% | 120/840 | 89/768 | 120 | 89 | 11.6% | 52/384 | 37/384 | 76 | healthy | activity neutral:588, active:156, suppressed:24<br>clarity dirty:280, clear:244, stained:244<br>water freshwater_lake_pond:668, freshwater_river:100<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):41, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):28, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 8% | 135/624 | 130/584 | 135 | 130 | 22.3% | 130/292 | 0/292 | 221 | healthy | activity neutral:428, active:156<br>clarity dirty:208, clear:188, stained:188<br>water freshwater_lake_pond:496, freshwater_river:88<br>bucket stable_pleasant_medium_confidence_archive:156, cold_slow_or_front:120, dirty_vibration:116 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):24, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):22, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):22 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 2.7% | 46/624 | 39/584 | 46 | 39 | 6.7% | 35/292 | 4/292 | 113 | underused_home_window | activity neutral:428, active:156<br>clarity dirty:208, clear:188, stained:188<br>water freshwater_lake_pond:496, freshwater_river:88<br>bucket stable_pleasant_medium_confidence_archive:156, cold_slow_or_front:120, dirty_vibration:116 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):24, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):22 |
| Pike Flash Fly<br>pike_flash_fly | fly | 11.7% | 197/540 | 194/532 | 197 | 194 | 36.5% | 86/266 | 108/266 | 259 | over-dominant | activity neutral:388, active:144<br>clarity dirty:180, clear:176, stained:176<br>water freshwater_lake_pond:448, freshwater_river:84<br>bucket stable_pleasant_medium_confidence_archive:152, dirty_vibration:108, cold_slow_or_front:104 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):21, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):19, Game Changer (top), Articulated Pike Streamer (honorable):14 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 1.4% | 24/108 | 24/108 | 24 | 24 | 22.2% | 0/54 | 24/54 | 18 | healthy | activity neutral:84, suppressed:24<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:108<br>bucket cold_slow_or_front:60, breezy_windy_stained_reaction:24, dirty_vibration:24 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):14, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):13, Large Rabbit Strip Streamer (top), Deceiver (honorable):7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.8% | 13/108 | 13/100 | 13 | 13 | 13% | 13/50 | 0/50 | 53 | healthy | activity neutral:64, active:36<br>clarity dirty:36, clear:32, stained:32<br>water freshwater_river:100<br>bucket stable_pleasant_medium_confidence_archive:36, dirty_vibration:24, breezy_windy_stained_reaction:16 | Large Rabbit Strip Streamer (top), Game Changer (honorable):5, Clouser Minnow (top), Deceiver (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3 |
| Deer Hair Slider<br>deer_hair_slider | fly | 1.5% | 25/120 | 25/96 | 25 | 25 | 26% | 3/48 | 22/48 | 30 | healthy | activity active:60, neutral:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:72, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:40, warming_search:16, calm_low_light_surface:12 | Frog Fly (top), Articulated Baitfish Streamer (honorable):3, Popper Fly (honorable), Game Changer (top):3, Popper Fly (top), Baitfish Slider Fly (honorable):3 |
| Popper Fly<br>popper_fly | fly | 1.3% | 21/120 | 21/96 | 21 | 21 | 21.9% | 21/48 | 0/48 | 20 | healthy | activity active:60, neutral:36<br>clarity clear:32, dirty:32, stained:32<br>water freshwater_lake_pond:72, freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:40, warming_search:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Articulated Pike Streamer (top):4, Deer Hair Slider (honorable), Game Changer (top):3, Deer Hair Slider (honorable), Large Rabbit Strip Streamer (top):3 |
| Frog Fly<br>frog_fly | fly | 0.7% | 12/96 | 12/72 | 12 | 12 | 16.7% | 0/36 | 12/36 | 20 | healthy | activity active:36, neutral:36<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket stable_pleasant_medium_confidence_archive:24, warming_search:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Articulated Pike Streamer (top):4, Deer Hair Slider (top), Large Rabbit Strip Streamer (honorable):3, Popper Fly (honorable), Game Changer (top):3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 0.3% | 5/24 | 5/24 | 5 | 5 | 20.8% | 5/12 | 0/12 | 8 | healthy | activity active:24<br>clarity clear:8, dirty:8, stained:8<br>water freshwater_river:24<br>bucket stable_pleasant_medium_confidence_archive:16, breezy_windy_stained_reaction:4, dirty_vibration:4 | Popper Fly (top), Game Changer (honorable):2, Articulated Baitfish Streamer (top), Pike Flash Fly (honorable):1, Articulated Pike Streamer (top), Deer Hair Slider (honorable):1 |
| Large Jerkbait<br>pike_jerkbait | lure | 9.2% | 154/840 | 153/828 | 154 | 153 | 18.5% | 21/414 | 132/414 | 169 | healthy | activity neutral:624, active:156, suppressed:48<br>clarity dirty:280, clear:276, stained:272<br>water freshwater_lake_pond:724, freshwater_river:104<br>bucket cold_slow_or_front:248, dirty_vibration:168, stable_pleasant_medium_confidence_archive:164 | Paddle Tail Pike Jig (top), Blade Bait (honorable):26, Inline Spinner (top), Shallow Minnowbait (honorable):22, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):22 |
| Casting Spoon<br>casting_spoon | lure | 4% | 68/840 | 67/824 | 68 | 67 | 8.1% | 67/412 | 0/412 | 99 | healthy | activity neutral:620, active:156, suppressed:48<br>clarity dirty:280, clear:272, stained:272<br>water freshwater_lake_pond:716, freshwater_river:108<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 | Paddle Tail Pike Jig (top), Blade Bait (honorable):26, Paddle Tail Pike Jig (top), Large Paddle-Tail Swimbait (honorable):22, Inline Spinner (top), Shallow Minnowbait (honorable):21 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 9.1% | 153/840 | 153/804 | 153 | 153 | 19% | 1/384 | 152/420 | 169 | healthy | activity neutral:612, active:156, suppressed:36<br>clarity dirty:280, clear:262, stained:262<br>water freshwater_lake_pond:700, freshwater_river:104<br>bucket cold_slow_or_front:216, stable_pleasant_medium_confidence_archive:172, dirty_vibration:168 | Inline Spinner (top), Pike Spinnerbait (honorable):21, Large Bucktail Spinner (honorable), Large Jerkbait (top):21, Paddle Tail Pike Jig (top), Large Bucktail Spinner (honorable):20 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 13.7% | 230/840 | 227/792 | 230 | 227 | 28.7% | 117/396 | 110/396 | 161 | over-dominant | activity neutral:588, active:156, suppressed:48<br>clarity dirty:280, clear:256, stained:256<br>water freshwater_lake_pond:684, freshwater_river:108<br>bucket cold_slow_or_front:248, dirty_vibration:168, breezy_windy_stained_reaction:160 | Large Bucktail Spinner (honorable), Large Jerkbait (top):21, Inline Spinner (top), Shallow Minnowbait (honorable):20, Inline Spinner (top), Pike Spinnerbait (honorable):18 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 15.2% | 255/840 | 242/768 | 255 | 242 | 31.5% | 88/384 | 154/384 | 404 | over-dominant | activity neutral:588, active:156, suppressed:24<br>clarity dirty:280, clear:244, stained:244<br>water freshwater_lake_pond:668, freshwater_river:100<br>bucket cold_slow_or_front:184, dirty_vibration:168, stable_pleasant_medium_confidence_archive:168 | Inline Spinner (top), Pike Spinnerbait (honorable):21, Inline Spinner (top), Shallow Minnowbait (honorable):19, Paddle Tail Pike Jig (top), Blade Bait (honorable):19 |
| Inline Spinner<br>inline_spinner | lure | 8.5% | 143/624 | 117/504 | 143 | 117 | 23.2% | 117/252 | 0/252 | 148 | healthy | activity neutral:348, active:156<br>clarity dirty:208, clear:148, stained:148<br>water freshwater_lake_pond:416, freshwater_river:88<br>bucket stable_pleasant_medium_confidence_archive:120, dirty_vibration:116, breezy_windy_stained_reaction:108 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):15, Large Bucktail Spinner (honorable), Large Jerkbait (top):13, Large Bucktail Spinner (honorable), Pike Spinnerbait (top):13 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 12.6% | 212/732 | 139/412 | 212 | 139 | 33.7% | 71/206 | 68/206 | 197 | over-dominant | activity neutral:300, active:104, suppressed:8<br>clarity dirty:244, stained:168<br>water freshwater_lake_pond:344, freshwater_river:68<br>bucket dirty_vibration:144, breezy_windy_stained_reaction:136, stable_pleasant_medium_confidence_archive:64 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):13, Large Bucktail Spinner (honorable), Large Jerkbait (top):12, Weedless Spoon (honorable), Shallow Minnowbait (top):10 |
| Weedless Spoon<br>weedless_spoon | lure | 6.8% | 114/360 | 114/360 | 114 | 114 | 31.7% | 47/180 | 67/180 | 195 | over-dominant | activity neutral:264, active:84, suppressed:12<br>clarity clear:120, dirty:120, stained:120<br>water freshwater_lake_pond:360<br>bucket stable_pleasant_medium_confidence_archive:120, cold_slow_or_front:80, breezy_windy_stained_reaction:64 | Inline Spinner (top), Pike Spinnerbait (honorable):15, Inline Spinner (top), Shallow Minnowbait (honorable):10, Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):7 |
| Pike Glide Bait<br>pike_glidebait | lure | 4.6% | 78/432 | 42/106 | 78 | 42 | 39.6% | 0/0 | 42/106 | 62 | over-dominant | activity neutral:88, active:18<br>clarity clear:52, stained:30, dirty:24<br>water freshwater_lake_pond:106<br>bucket cold_slow_or_front:36, stable_pleasant_medium_confidence_archive:30, breezy_windy_stained_reaction:12 | Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):5, Large Bucktail Spinner (honorable), Weedless Spoon (top):4, Weedless Spoon (honorable), Large Jerkbait (top):4 |
| Large Pike Topwater<br>large_pike_topwater | lure | 1% | 16/96 | 16/72 | 16 | 16 | 22.2% | 1/36 | 15/36 | 19 | healthy | activity active:36, neutral:36<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:72<br>bucket stable_pleasant_medium_confidence_archive:24, warming_search:16, calm_low_light_surface:12 | Inline Spinner (honorable), Weedless Spoon (top):3, Inline Spinner (top), Pike Spinnerbait (honorable):3, Inline Spinner (top), Shallow Minnowbait (honorable):3 |
| Large Pike Tube<br>large_pike_tube | lure | 0.2% | 3/12 | 3/12 | 3 | 3 | 25% | 1/6 | 2/6 | 9 | healthy | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket breezy_windy_stained_reaction:4, dirty_vibration:4, stable_pleasant_medium_confidence_archive:4 | Large Bucktail Spinner (honorable), Large Jerkbait (top):2, Blade Bait (top), Shallow Minnowbait (honorable):1, Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):1 |

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
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 39/584 | 6.7% | 113 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48, big_fish / dirty / freshwater_lake_pond / dirty_vibration:48, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | goal_tags:317, daily_condition_tags:149, forage_clarity_stack:38, selector_filtering_variety_jitter:23 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):24, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):22, Large Rabbit Strip Streamer (top), Pike Flash Fly (honorable):22 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large Rabbit Strip Streamer<br>pike_bunny_streamer | fly | 272/816 | 33.3% | 382 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:72, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / dirty / freshwater_lake_pond / dirty_vibration:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | goal_tags:260, selector_filtering_variety_jitter:231, daily_condition_tags:34, forage_clarity_stack:19 | Game Changer (top), Articulated Pike Streamer (honorable):25, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22, Articulated Baitfish Streamer (honorable), Articulated Pike Streamer (top):18 |
| Paddle Tail Pike Jig<br>pike_jig_and_plastic | lure | 227/792 | 28.7% | 161 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:72, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / dirty / freshwater_lake_pond / dirty_vibration:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | goal_tags:175, daily_condition_tags:142, seasonal_baseline:105, selector_filtering_variety_jitter:100 | Large Bucktail Spinner (honorable), Large Jerkbait (top):21, Inline Spinner (top), Shallow Minnowbait (honorable):20, Inline Spinner (top), Pike Spinnerbait (honorable):18, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):18 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 242/768 | 31.5% | 404 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:72, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / dirty / freshwater_lake_pond / dirty_vibration:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | goal_tags:269, selector_filtering_variety_jitter:187, forage_clarity_stack:43, daily_condition_tags:17 | Inline Spinner (top), Pike Spinnerbait (honorable):21, Inline Spinner (top), Shallow Minnowbait (honorable):19, Paddle Tail Pike Jig (top), Blade Bait (honorable):19, Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):18 |
| Game Changer<br>game_changer | fly | 206/768 | 26.8% | 353 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:72, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / dirty / freshwater_lake_pond / dirty_vibration:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | daily_condition_tags:311, selector_filtering_variety_jitter:129, goal_tags:76, forage_clarity_stack:31 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):41, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):28, Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):23, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 209/768 | 27.2% | 293 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:72, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72, big_fish / dirty / freshwater_lake_pond / dirty_vibration:72, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:72 | daily_condition_tags:308, selector_filtering_variety_jitter:94, goal_tags:83, forage_clarity_stack:65 | Large Rabbit Strip Streamer (top), Rabbit-Strip Leech (honorable):23, Baitfish Slider Fly (top), Pike Flash Fly (honorable):22, Game Changer (honorable), Articulated Pike Streamer (top):22, Game Changer (top), Articulated Pike Streamer (honorable):22 |
| Pike Flash Fly<br>pike_flash_fly | fly | 194/532 | 36.5% | 259 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:44, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:44, big_fish / dirty / freshwater_lake_pond / dirty_vibration:44, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:44 | seasonal_baseline:122, selector_filtering_variety_jitter:65, daily_condition_tags:54, forage_clarity_stack:54 | Large Rabbit Strip Streamer (top), Articulated Baitfish Streamer (honorable):21, Large Rabbit Strip Streamer (honorable), Articulated Baitfish Streamer (top):19, Game Changer (top), Articulated Pike Streamer (honorable):14, Game Changer (honorable), Articulated Pike Streamer (top):13 |
| Pike Spinnerbait<br>pike_spinnerbait | lure | 139/412 | 33.7% | 197 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:60, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:60, big_fish / dirty / freshwater_lake_pond / dirty_vibration:60, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:60 | daily_condition_tags:116, selector_filtering_variety_jitter:89, goal_tags:60, seasonal_baseline:8 | Large Jerkbait (top), Large Paddle-Tail Swimbait (honorable):13, Large Bucktail Spinner (honorable), Large Jerkbait (top):12, Weedless Spoon (honorable), Shallow Minnowbait (top):10, Paddle Tail Pike Jig (top), Blade Bait (honorable):9 |
| Weedless Spoon<br>weedless_spoon | lure | 114/360 | 31.7% | 195 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:32, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:32, big_fish / dirty / freshwater_lake_pond / dirty_vibration:32, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:32 | goal_tags:96, selector_filtering_variety_jitter:83, daily_condition_tags:67 | Inline Spinner (top), Pike Spinnerbait (honorable):15, Inline Spinner (top), Shallow Minnowbait (honorable):10, Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):7, Large Bucktail Spinner (honorable), Casting Spoon (top):6 |
| Pike Glide Bait<br>pike_glidebait | lure | 42/106 | 39.6% | 62 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:14, big_fish / dirty / freshwater_lake_pond / dirty_vibration:12, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:12 | selector_filtering_variety_jitter:37, daily_condition_tags:27 | Large Bucktail Spinner (honorable), Large Paddle-Tail Swimbait (top):5, Large Bucktail Spinner (honorable), Weedless Spoon (top):4, Weedless Spoon (honorable), Large Jerkbait (top):4, Large Bucktail Spinner (honorable), Paddle Tail Pike Jig (top):3 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Popper Fly [fly] (12), Pike Spinnerbait [lure] (9), Shallow Minnowbait [lure] (9), Inline Spinner [lure] (8), Game Changer [fly] (6) | Popper Fly [fly] (18), Shallow Minnowbait [lure] (18), Inline Spinner [lure] (14), Pike Spinnerbait [lure] (14), Baitfish Slider Fly [fly] (13) |
| calm_surface | big_fish | Large Rabbit Strip Streamer [fly] (8), Large Paddle-Tail Swimbait [lure] (7), Large Pike Topwater [lure] (7), Pike Spinnerbait [lure] (7), Articulated Pike Streamer [fly] (6) | Deer Hair Slider [fly] (18), Large Paddle-Tail Swimbait [lure] (14), Large Pike Topwater [lure] (14), Large Rabbit Strip Streamer [fly] (13), Weedless Spoon [lure] (12) |
| low_light_surface | all_purpose | Inline Spinner [lure] (6), Baitfish Slider Fly [fly] (5), Shallow Minnowbait [lure] (5), Pike Flash Fly [fly] (3), Popper Fly [fly] (3) | Shallow Minnowbait [lure] (9), Baitfish Slider Fly [fly] (8), Inline Spinner [lure] (8), Popper Fly [fly] (6), Pike Flash Fly [fly] (5) |
| low_light_surface | big_fish | Articulated Pike Streamer [fly] (6), Large Paddle-Tail Swimbait [lure] (4), Pike Flash Fly [fly] (4), Frog Fly [fly] (3), Large Bucktail Spinner [lure] (3) | Deer Hair Slider [fly] (7), Articulated Pike Streamer [fly] (6), Large Bucktail Spinner [lure] (6), Large Paddle-Tail Swimbait [lure] (6), Large Rabbit Strip Streamer [fly] (6) |
| wind_reaction | all_purpose | Inline Spinner [lure] (62), Deceiver [fly] (55), Baitfish Slider Fly [fly] (45), Large Rabbit Strip Streamer [fly] (36), Shallow Minnowbait [lure] (35) | Deceiver [fly] (105), Inline Spinner [lure] (78), Baitfish Slider Fly [fly] (77), Large Bucktail Spinner [lure] (69), Paddle Tail Pike Jig [lure] (67) |
| wind_reaction | big_fish | Large Rabbit Strip Streamer [fly] (72), Articulated Pike Streamer [fly] (60), Large Bucktail Spinner [lure] (53), Large Jerkbait [lure] (48), Paddle Tail Pike Jig [lure] (44) | Large Rabbit Strip Streamer [fly] (113), Large Bucktail Spinner [lure] (107), Articulated Pike Streamer [fly] (97), Large Jerkbait [lure] (94), Articulated Baitfish Streamer [fly] (83) |
| dirty_vibration | all_purpose | Inline Spinner [lure] (41), Paddle Tail Pike Jig [lure] (33), Deceiver [fly] (32), Baitfish Slider Fly [fly] (28), Large Rabbit Strip Streamer [fly] (27) | Deceiver [fly] (69), Paddle Tail Pike Jig [lure] (60), Inline Spinner [lure] (55), Baitfish Slider Fly [fly] (53), Pike Spinnerbait [lure] (45) |
| dirty_vibration | big_fish | Large Rabbit Strip Streamer [fly] (52), Paddle Tail Pike Jig [lure] (41), Articulated Pike Streamer [fly] (40), Large Jerkbait [lure] (33), Large Bucktail Spinner [lure] (32) | Large Rabbit Strip Streamer [fly] (77), Large Bucktail Spinner [lure] (71), Articulated Pike Streamer [fly] (70), Articulated Baitfish Streamer [fly] (62), Large Jerkbait [lure] (61) |
| clear_subtle | all_purpose | Unweighted Baitfish Streamer [fly] (13), Inline Spinner [lure] (12), Blade Bait [lure] (11), Game Changer [fly] (10), Shallow Minnowbait [lure] (8) | Blade Bait [lure] (19), Shallow Minnowbait [lure] (18), Unweighted Baitfish Streamer [fly] (18), Inline Spinner [lure] (16), Game Changer [fly] (13) |
| clear_subtle | big_fish | Large Paddle-Tail Swimbait [lure] (10), Large Rabbit Strip Streamer [fly] (10), Pike Glide Bait [lure] (10), Large Jerkbait [lure] (9), Articulated Pike Streamer [fly] (8) | Large Paddle-Tail Swimbait [lure] (17), Game Changer [fly] (16), Articulated Baitfish Streamer [fly] (15), Large Bucktail Spinner [lure] (15), Large Rabbit Strip Streamer [fly] (15) |
| cold_slow | all_purpose | Paddle Tail Pike Jig [lure] (43), Large Rabbit Strip Streamer [fly] (42), Rabbit-Strip Leech [fly] (42), Blade Bait [lure] (38), Inline Spinner [lure] (29) | Paddle Tail Pike Jig [lure] (85), Blade Bait [lure] (78), Rabbit-Strip Leech [fly] (62), Large Rabbit Strip Streamer [fly] (58), Deceiver [fly] (55) |
| cold_slow | big_fish | Large Rabbit Strip Streamer [fly] (64), Paddle Tail Pike Jig [lure] (56), Large Bucktail Spinner [lure] (30), Large Jerkbait [lure] (28), Large Paddle-Tail Swimbait [lure] (26) | Large Rabbit Strip Streamer [fly] (84), Paddle Tail Pike Jig [lure] (78), Large Bucktail Spinner [lure] (72), Large Paddle-Tail Swimbait [lure] (62), Articulated Pike Streamer [fly] (58) |
| warming_search | all_purpose | Inline Spinner [lure] (21), Baitfish Slider Fly [fly] (20), Shallow Minnowbait [lure] (18), Deceiver [fly] (13), Game Changer [fly] (8) | Inline Spinner [lure] (27), Shallow Minnowbait [lure] (27), Baitfish Slider Fly [fly] (26), Deceiver [fly] (24), Pike Spinnerbait [lure] (18) |
| warming_search | big_fish | Articulated Pike Streamer [fly] (14), Large Jerkbait [lure] (13), Large Paddle-Tail Swimbait [lure] (13), Large Bucktail Spinner [lure] (12), Pike Flash Fly [fly] (12) | Large Paddle-Tail Swimbait [lure] (26), Large Bucktail Spinner [lure] (25), Large Rabbit Strip Streamer [fly] (24), Articulated Pike Streamer [fly] (23), Large Jerkbait [lure] (22) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Clouser Minnow [fly] (9), Bucktail Streamer [fly] (6), Inline Spinner [lure] (4), Pike Spinnerbait [lure] (4), Shallow Minnowbait [lure] (4) | Bucktail Streamer [fly] (9), Clouser Minnow [fly] (9), Large Bucktail Spinner [lure] (7), Inline Spinner [lure] (6), Paddle Tail Pike Jig [lure] (6) |
| current_swing | big_fish | Large Rabbit Strip Streamer [fly] (6), Articulated Pike Streamer [fly] (5), Paddle Tail Pike Jig [lure] (5), Large Bucktail Spinner [lure] (4), Pike Spinnerbait [lure] (4) | Pike Spinnerbait [lure] (9), Game Changer [fly] (8), Large Bucktail Spinner [lure] (8), Articulated Pike Streamer [fly] (7), Paddle Tail Pike Jig [lure] (7) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Inline Spinner (170); Blade Bait (154); Game Changer (152); Rabbit-Strip Leech (134) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear big_fish B | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | active, closed, wind_reaction, medium | Pike Glide Bait (174); Large Paddle-Tail Swimbait (166); Game Changer (160); Articulated Pike Streamer (164) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 clear big_fish A | 59.5-73.1F, 8.9 mph wind, 1.9% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Large Jerkbait (192); Weedless Spoon (182); Articulated Baitfish Streamer (168); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain pike water<br>2025-08-12 clear big_fish B | 67.4-89.1F, 9.7 mph wind, 4.9% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+open_water_search, medium | Pike Glide Bait (206); Large Bucktail Spinner (198); Articulated Pike Streamer (164); Game Changer (176) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake Champlain pike water<br>2025-08-12 dirty big_fish B | 67.4-89.1F, 9.7 mph wind, 4.9% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Pike Glide Bait (182); Paddle Tail Pike Jig (168); Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (178) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear big_fish B | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (174); Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 stained big_fish A | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (182); Articulated Baitfish Streamer (176); Game Changer (176) | WIND_NOT_ELEVATING_REACTION |
| Maine Belgrade Lakes pike water<br>2025-05-08 dirty big_fish B | 48.9-63.3F, 6 mph wind, 78.9% cloud, 0 in precip | neutral, closed, cold_slow, medium | Large Paddle-Tail Swimbait (166); Pike Spinnerbait (166); Game Changer (160); Articulated Pike Streamer (156) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-08-02 stained big_fish B | 58.8-77.4F, 4.9 mph wind, 46.5% cloud, 0 in precip | neutral, closed, no tags, medium | Pike Glide Bait (174); Large Bucktail Spinner (166); Large Rabbit Strip Streamer (162); Articulated Baitfish Streamer (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose A | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Shallow Minnowbait (170); Paddle Tail Pike Jig (152); Unweighted Baitfish Streamer (164); Baitfish Slider Fly (148) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear big_fish A | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Pike Glide Bait (190); Large Jerkbait (160); Articulated Pike Streamer (148); Game Changer (160) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear big_fish B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, medium | Large Paddle-Tail Swimbait (166); Large Bucktail Spinner (166); Pike Flash Fly (150); Unweighted Baitfish Streamer (152) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake of the Woods pike water<br>2025-01-16 stained big_fish B | 0.5-34.8F, 9 mph wind, 100% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Large Jerkbait (172); Large Paddle-Tail Swimbait (168); Articulated Pike Streamer (166); Articulated Dungeon Streamer (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-04-24 stained big_fish B | 29.8-53F, 4.3 mph wind, 66.6% cloud, 0 in precip | neutral, closed, no tags, medium | Pike Spinnerbait (166); Large Jerkbait (160); Articulated Pike Streamer (156); Articulated Baitfish Streamer (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-08-14 clear big_fish B | 57.1-77.8F, 12 mph wind, 40.1% cloud, 1 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Glide Bait (190); Articulated Baitfish Streamer (168); Articulated Pike Streamer (164) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-08-14 stained all_purpose B | 57.1-77.8F, 12 mph wind, 40.1% cloud, 1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Shallow Minnowbait (186); Weedless Spoon (180); Pike Flash Fly (174); Baitfish Slider Fly (180) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-10-05 clear big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction, medium | Large Bucktail Spinner (182); Pike Spinnerbait (174); Game Changer (160); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-10-05 dirty all_purpose B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Paddle Tail Pike Jig (166); Shallow Minnowbait (162); Pike Flash Fly (158); Deceiver (168) | WIND_NOT_ELEVATING_REACTION |
| Lake of the Woods pike water<br>2025-10-05 dirty big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Pike Spinnerbait (182); Large Jerkbait (168); Large Rabbit Strip Streamer (178); Articulated Baitfish Streamer (160) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Lake of the Woods pike water<br>2025-12-12 dirty big_fish B | -17--6.1F, 12.9 mph wind, 98.5% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+open_water_search, medium | Large Bucktail Spinner (170); Large Jerkbait (164); Articulated Baitfish Streamer (162); Articulated Pike Streamer (166) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear all_purpose A | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (190); Shallow Minnowbait (186); Game Changer (168); Unweighted Baitfish Streamer (164) | WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Large Bucktail Spinner (198); Pike Spinnerbait (174); Large Rabbit Strip Streamer (170); Articulated Baitfish Streamer (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 dirty big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (184); Large Bucktail Spinner (190); Articulated Pike Streamer (172); Articulated Baitfish Streamer (176) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 stained big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, medium | Large Jerkbait (192); Large Bucktail Spinner (198); Articulated Baitfish Streamer (176); Large Rabbit Strip Streamer (178) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose B | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Weedless Spoon (180); Inline Spinner (186); Large Rabbit Strip Streamer (158); Deceiver (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 clear big_fish B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+open_water_search, medium | Weedless Spoon (182); Large Jerkbait (192); Articulated Baitfish Streamer (168); Large Rabbit Strip Streamer (170) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 dirty all_purpose B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Shallow Minnowbait (178); Paddle Tail Pike Jig (166); Baitfish Slider Fly (180); Articulated Baitfish Streamer (168) | WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 stained big_fish B | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, closed, wind_reaction+dirty_vibration+open_water_search, medium | Pike Glide Bait (190); Large Jerkbait (192); Game Changer (176); Articulated Baitfish Streamer (176) | WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-21 dirty big_fish B | 60.7-71.1F, 5.3 mph wind, 61.9% cloud, 0.1 in precip | active, closed, no tags, medium | Pike Spinnerbait (166); Pike Glide Bait (166); Articulated Baitfish Streamer (160); Large Rabbit Strip Streamer (162) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-21 stained big_fish A | 60.7-71.1F, 5.3 mph wind, 61.9% cloud, 0.1 in precip | active, closed, no tags, medium | Weedless Spoon (166); Large Bucktail Spinner (166); Large Rabbit Strip Streamer (162); Articulated Baitfish Streamer (160) | ADJACENT_DAY_EXACT_REPEAT |
| Mille Lacs / Upper Midwest pike lake<br>2025-11-08 clear big_fish B | 22.2-28.2F, 10.1 mph wind, 94.8% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow+open_water_search, medium | Paddle Tail Pike Jig (174); Large Jerkbait (172); Articulated Baitfish Streamer (154); Articulated Pike Streamer (158) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear big_fish B | 41.7-47.7F, 8.9 mph wind, 100% cloud, 0.3 in precip | neutral, closed, wind_reaction+cold_slow+open_water_search, medium | Large Jerkbait (192); Pike Glide Bait (190); Articulated Pike Streamer (164); Articulated Baitfish Streamer (168) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
