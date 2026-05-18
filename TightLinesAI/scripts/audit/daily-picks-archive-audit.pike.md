# FinFindr Pike Daily-Picks Archive Audit
Generated: 2026-05-18T13:34:42.971Z

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
| breezy_windy_stained_reaction | 104 |
| dirty_vibration | 112 |
| cold_slow_or_front | 444 |
| warming_search | 120 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 216 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 36 |
| medium_confidence_archive | 0 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 1 |
| adjacent_day_change | 1 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Green Bay / Door County pike water<br>2025-10-19 -> 2025-10-20 | changed | 2.9 | 2.8 | wind_reaction|dirty_vibration -> wind_reaction|dirty_vibration|open_water_search |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-20 -> 2025-09-21 | similar | 2.9 | 1.1 | none -> none |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 18 | WIND_NOT_ELEVATING_REACTION (18) |
| calm_bright_clear_subtle | 3 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (5) |
| calm_low_light_surface | 1 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| cold_slow_or_front | 6 | WIND_NOT_ELEVATING_REACTION (5), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| dirty_vibration | 16 | WIND_NOT_ELEVATING_REACTION (16) |
| stable_pleasant_high_confidence | 28 | WIND_NOT_ELEVATING_REACTION (23), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (7) |
| warming_search | 8 | WIND_NOT_ELEVATING_REACTION (8) |

- WIND_NOT_ELEVATING_REACTION: 36
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 7
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 1

- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Blade Bait (lure); Deceiver (fly); Baitfish Slider (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Paddle-Tail Swimbait (lure); Weedless Spoon (lure); Game Changer (fly); Flash Fly (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Blade Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-04-12__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- sd_oahe_pike__2025-04-12__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- wi_green_bay_pike__2025-05-23__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- me_belgrade_pike__2025-06-07__freshwater_lake_pond__clear__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Casting Spoon (lure); Large Walking Bait (lure); Bass Popper (fly); Unweighted Baitfish (fly)
- wi_green_bay_pike__2025-06-21__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- wi_green_bay_pike__2025-06-21__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_mille_lacs_pike__2025-07-16__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Weedless Spoon (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Weedless Spoon (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-07-19__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Shallow Twitchbait (lure); Flash Fly (fly); Game Changer (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Large Bucktail Spinner (lure); Shallow Twitchbait (lure); Big Articulated Streamer (fly); Unweighted Baitfish (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- vt_champlain_pike__2025-08-12__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Baitfish Slider (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_lake_of_woods_pike__2025-08-14__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Baitfish Slider (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Weedless Spoon (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Weedless Spoon (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-08-21__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-09-15__freshwater_lake_pond__clear__all_purpose__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Shallow Twitchbait (lure); Casting Spoon (lure); Unweighted Baitfish (fly); Rabbit-Strip Leech (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Game Changer (fly); Baitfish Slider (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Large Tube Jig (lure); Game Changer (fly); Articulated Baitfish (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-11-11__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Large Paddle-Tail Swimbait (lure); Large Tube Jig (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_ID_OVERLAP_AVOIDABLE: 127
- ADJACENT_DAY_EXACT_REPEAT: 17
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 15
- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 10

- mn_mille_lacs_pike__2025-07-16__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Big Articulated Streamer (fly); Flash Fly (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Oversized Spinnerbait (lure); Weedless Spoon (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs_pike__2025-05-15__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Jerkbait (lure); Weedless Spoon (lure); Game Changer (fly); Flash Fly (fly)
- nd_devils_lake_pike__2025-07-12__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-07-12__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-08-16__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Weedless Spoon (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-08-23__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Weedless Spoon (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Large Paddle-Tail Swimbait (lure); Heavy Paddle-Tail Swimbait (lure); Articulated Baitfish (fly); Flash Fly (fly)
- mn_mille_lacs_pike__2025-09-21__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Large Glide Bait (lure); Weedless Spoon (lure); Bunny Streamer (fly); Flash Fly (fly)
- vt_champlain_pike__2025-09-27__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Weedless Spoon (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- nd_missouri_backwater_pike__2025-09-29__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Casting Spoon (lure); Shallow Twitchbait (lure); Deceiver (fly); Baitfish Slider (fly)
- mn_lake_of_woods_pike__2025-10-05__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Oversized Spinnerbait (lure); Bunny Streamer (fly); Flash Fly (fly)
- wi_green_bay_pike__2025-10-19__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Oversized Spinnerbait (lure); Big Articulated Streamer (fly); Flash Fly (fly)
- wi_green_bay_pike__2025-10-20__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Casting Spoon (lure); Shallow Twitchbait (lure); Deceiver (fly); Unweighted Baitfish (fly)
- ny_st_lawrence_pike__2025-11-11__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- ny_st_lawrence_pike__2025-11-11__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Heavy Paddle-Tail Swimbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Jerkbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Large Tube Jig (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-01-26__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-02-11__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-02-11__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Casting Spoon (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-02-11__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Blade Bait (lure); Large Jerkbait (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-02-11__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Casting Spoon (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-02-15__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-02-15__freshwater_lake_pond__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Blade Bait (lure); Large Bucktail Spinner (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-02-15__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Bucktail Spinner (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- sd_oahe_pike__2025-02-15__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Large Jerkbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-02-20__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Tube Jig (lure); Large Paddle-Tail Swimbait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-02-20__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Casting Spoon (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-02-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Blade Bait (lure); Large Jerkbait (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Heavy Paddle-Tail Swimbait (lure); Casting Spoon (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-03-18__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Paddle-Tail Swimbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- nd_devils_lake_pike__2025-03-18__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs_pike__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Shallow Twitchbait (lure); Deceiver (fly); Unweighted Baitfish (fly)
- nd_missouri_backwater_pike__2025-03-26__freshwater_river__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- nd_missouri_backwater_pike__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- nd_missouri_backwater_pike__2025-03-26__freshwater_river__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Jerkbait (lure); Blade Bait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- wi_green_bay_pike__2025-03-28__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Shallow Twitchbait (lure); Articulated Baitfish (fly); Baitfish Slider (fly)
- me_belgrade_pike__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- me_belgrade_pike__2025-03-30__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Jerkbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-03-26__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Oversized Spinnerbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_pike__2025-03-26__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Jerkbait (lure); Blade Bait (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)
- ny_st_lawrence_pike__2025-04-04__freshwater_river__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Bucktail Streamer (fly); Flash Fly (fly)
- sd_oahe_pike__2025-04-12__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Shallow Twitchbait (lure); Flash Fly (fly); Deceiver (fly)
- wi_green_bay_pike__2025-04-18__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Shallow Twitchbait (lure); Game Changer (fly); Flash Fly (fly)
- mn_lake_of_woods_pike__2025-04-24__freshwater_lake_pond__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Shallow Twitchbait (lure); Baitfish Slider (fly); Bunny Streamer (fly)
- mn_lake_of_woods_pike__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Big Articulated Streamer (fly); Rabbit-Strip Leech (fly)
- mn_lake_of_woods_pike__2025-04-24__freshwater_lake_pond__dirty__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Shallow Twitchbait (lure); Bunny Streamer (fly); Flash Fly (fly)
- me_belgrade_pike__2025-04-30__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Casting Spoon (lure); Shallow Twitchbait (lure); Flash Fly (fly); Game Changer (fly)
- ny_st_lawrence_pike__2025-05-06__freshwater_river__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Heavy Paddle-Tail Swimbait (lure); Bucktail Streamer (fly); Flash Fly (fly)
- nd_devils_lake_pike__2025-05-10__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Large Bucktail Spinner (lure); Weedless Spoon (lure); Bunny Streamer (fly); Rabbit-Strip Leech (fly)

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
| May | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
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
| Nov | northeast | cold_slow:2 |
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
| Jul | great_lakes_upper_midwest | caution | low_light | all_purpose | 3 | 69.4-81.7F | 8.1 |
| Jul | great_lakes_upper_midwest | caution | low_light | big_fish | 6 | 69.4-81.7F | 8.1 |
| Jul | northeast | open | mixed | all_purpose | 10 | 67.7-89.0F | 5.5 |
| Jul | northeast | open | mixed | big_fish | 10 | 67.7-89.0F | 5.4 |
| Jun | great_lakes_upper_midwest | open | mixed | all_purpose | 4 | 63.5-78.9F | 5.2 |
| Jun | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 63.5-78.9F | 5.2 |
| Jun | midwest_interior | caution | mixed | big_fish | 1 | 52.0-70.4F | 8 |
| Jun | midwest_interior | open | mixed | all_purpose | 4 | 62.7-81.0F | 3.4 |
| Jun | midwest_interior | open | mixed | big_fish | 6 | 62.7-81.0F | 3.4 |
| Jun | northeast | caution | low_light | all_purpose | 3 | 63.2-76.1F | 8.4 |
| Jun | northeast | caution | low_light | big_fish | 3 | 63.2-76.1F | 8.4 |
| Jun | northeast | open | low_light | all_purpose | 4 | 61.2-69.8F | 3.7 |
| Jun | northeast | open | low_light | big_fish | 6 | 61.2-69.8F | 3.7 |
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
| lure | 12 | 12 | 0 |
| fly | 10 | 10 | 0 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 72 | - |
| open-surface rows with 2+ surface picks | 14 | 14 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 11 | 11 |
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
| true clear-calm/glare control | 4 | 2 | Weedless Spoon (2) | Large Jerkbait (1), Large Paddle-Tail Swimbait (1) |
| clear breezy/wind-reaction | 4 | 5 | Flash Fly (2), Weedless Spoon (2), Large Bucktail Spinner (1) | Large Jerkbait (2), Articulated Baitfish (1), Baitfish Slider (1), Shallow Twitchbait (1) |

### Clear/Bright Watch Rows

| Split | Scenario | Context | Selected | Close controlled/natural alternative |
| --- | --- | --- | --- | --- |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 all_purpose A | clear, glare, breezy, gate closed | Weedless Spoon (lure, 188) | Shallow Twitchbait (176) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 all_purpose B | clear, glare, breezy, gate closed | Flash Fly (fly, 174) | Baitfish Slider (164) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 big_fish A | clear, glare, breezy, gate closed | Weedless Spoon (lure, 190) | Large Jerkbait (210) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 big_fish A | clear, glare, breezy, gate closed | Flash Fly (fly, 182) | Articulated Baitfish (182) |
| clear breezy/wind-reaction | Lake Champlain pike water<br>2025-08-12 big_fish B | clear, glare, breezy, gate closed | Large Bucktail Spinner (lure, 218) | Large Jerkbait (210) |
| true clear-calm/glare control | Maine Belgrade Lakes pike water<br>2025-09-15 big_fish A | clear, glare, calm, gate closed | Weedless Spoon (lure, 156) | Large Paddle-Tail Swimbait (182) |
| true clear-calm/glare control | Maine Belgrade Lakes pike water<br>2025-09-15 big_fish B | clear, glare, calm, gate closed | Weedless Spoon (lure, 156) | Large Jerkbait (178) |

## Pike Heat-Limited Diagnostics

### Heat-Limited Pike Summary

| Context | Controlled/deeper/slower | Reckless surface/fast/high-risk | Surface pick rows | Surface picks | Non-surface high-risk rows | Non-surface high-risk picks | Mixed watch | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| true_heat_limited | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| warm_adjacent | 54 | 55 | 39 | 45 | 15 | 15 | 47 | 156 |

### Heat-Limited Pike Rows

| Context | Split | Scenario | Weather/thermal | Selected picks | Heat risk split |
| --- | --- | --- | --- | --- | --- |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose A | 58.8-77.4F, stable | Casting Spoon (medium/mid); Shallow Twitchbait (medium/upper); Game Changer (medium/mid); Unweighted Baitfish (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear all_purpose B | 58.8-77.4F, stable | Inline Spinner (medium/mid); Blade Bait (slow/bottom); Deceiver (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish A | 58.8-77.4F, stable | Large Glide Bait (slow/mid); Weedless Spoon (medium/upper); Game Changer (medium/mid); Unweighted Baitfish (medium/upper) | surface: None<br>non-surface high-risk: Large Glide Bait |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 clear big_fish B | 58.8-77.4F, stable | Large Paddle-Tail Swimbait (medium/mid); Weedless Spoon (medium/upper); Bunny Streamer (slow/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose A | 58.8-77.4F, stable | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Flash Fly (medium/upper); Deceiver (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty all_purpose B | 58.8-77.4F, stable | Shallow Twitchbait (medium/upper); Inline Spinner (medium/mid); Baitfish Slider (medium/upper); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 dirty big_fish A | 58.8-77.4F, stable | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Articulated Baitfish (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 dirty big_fish B | 58.8-77.4F, stable | Large Paddle-Tail Swimbait (medium/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Bunny Streamer (slow/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Maine Belgrade Lakes pike water<br>2025-08-02 stained all_purpose A | 58.8-77.4F, stable | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Deceiver (medium/mid); Baitfish Slider (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 stained all_purpose B | 58.8-77.4F, stable | Inline Spinner (medium/mid); Shallow Twitchbait (medium/upper); Bunny Streamer (slow/mid); Unweighted Baitfish (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Maine Belgrade Lakes pike water<br>2025-08-02 stained big_fish A | 58.8-77.4F, stable | Large Glide Bait (slow/mid); Weedless Spoon (medium/upper); Game Changer (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: Large Glide Bait |
| warm_adjacent | controlled_deeper_slower_acceptable | Maine Belgrade Lakes pike water<br>2025-08-02 stained big_fish B | 58.8-77.4F, stable | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Bunny Streamer (slow/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear all_purpose A | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Weedless Spoon (medium/upper); Deceiver (medium/mid); Unweighted Baitfish (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear all_purpose B | 57.1-64.2F, cooling_or_shock | Inline Spinner (medium/mid); Shallow Twitchbait (medium/upper); Deceiver (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear big_fish A | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Weedless Spoon (medium/upper); Flash Fly (medium/upper); Bunny Streamer (slow/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear big_fish B | 57.1-64.2F, cooling_or_shock | Large Jerkbait (medium/mid); Weedless Spoon (medium/upper); Big Articulated Streamer (slow/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty all_purpose A | 57.1-64.2F, cooling_or_shock | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Deceiver (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty all_purpose B | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Bunny Streamer (slow/mid); Baitfish Slider (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty big_fish A | 57.1-64.2F, cooling_or_shock | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Articulated Baitfish (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty big_fish B | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Bunny Streamer (slow/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose A | 57.1-64.2F, cooling_or_shock | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Deceiver (medium/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained all_purpose B | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Bunny Streamer (slow/mid); Baitfish Slider (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | mixed_watch | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained big_fish A | 57.1-64.2F, cooling_or_shock | Oversized Spinnerbait (medium/mid); Weedless Spoon (medium/upper); Bunny Streamer (slow/mid); Flash Fly (medium/upper) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained big_fish B | 57.1-64.2F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Articulated Baitfish (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 clear all_purpose A | 58.7-77F, cooling_or_shock | Shallow Twitchbait (medium/upper); Casting Spoon (medium/mid); Articulated Baitfish (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 clear all_purpose B | 58.7-77F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Blade Bait (slow/bottom); Deceiver (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 clear big_fish A | 58.7-77F, cooling_or_shock | Large Bucktail Spinner (medium/mid); Weedless Spoon (medium/upper); Big Articulated Streamer (slow/mid); Game Changer (medium/mid) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | reckless_surface_fast_high_risk | Devils Lake prairie pike water<br>2025-07-12 clear big_fish B | 58.7-77F, cooling_or_shock | Large Glide Bait (slow/mid); Heavy Paddle-Tail Swimbait (slow/bottom); Articulated Baitfish (medium/mid); Bunny Streamer (slow/mid) | surface: None<br>non-surface high-risk: Large Glide Bait |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 dirty all_purpose A | 58.7-77F, cooling_or_shock | Shallow Twitchbait (medium/upper); Large Bucktail Spinner (medium/mid); Articulated Baitfish (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |
| warm_adjacent | controlled_deeper_slower_acceptable | Devils Lake prairie pike water<br>2025-07-12 dirty all_purpose B | 58.7-77F, cooling_or_shock | Weedless Spoon (medium/upper); Oversized Spinnerbait (medium/mid); Deceiver (medium/mid); Rabbit-Strip Leech (slow/bottom) | surface: None<br>non-surface high-risk: None |

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | truly_avoidable | 30 | 97 | 127 |
| exact_id | unavoidable_due_score_band | 9 | 29 | 38 |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 9 | 23 | 32 |
| same_family_same_presentation | truly_avoidable | 8 | 2 | 10 |
| same_family_same_presentation | unavoidable_due_score_band | 4 | 1 | 5 |
| same_family_different_presentation | truly_avoidable | 0 | 15 | 15 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 9 | 9 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| St. Lawrence River pike backwater<br>2025-06-17 clear big_fish | lure honorable: exact_id | Large Paddle-Tail Swimbait (182); Heavy Paddle-Tail Swimbait (100) | Large Bucktail Spinner (166); Heavy Paddle-Tail Swimbait (100) | Large Jerkbait (160, alt edge 60) |
| Devils Lake prairie pike water<br>2025-08-21 clear all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (124) | Deceiver (198); Rabbit-Strip Leech (124) | Game Changer (168, alt edge 44) |
| Devils Lake prairie pike water<br>2025-08-21 dirty big_fish | fly honorable: exact_id | Articulated Baitfish (190); Rabbit-Strip Leech (134) | Game Changer (190); Rabbit-Strip Leech (134) | Bunny Streamer (178, alt edge 44) |
| Devils Lake prairie pike water<br>2025-08-21 stained big_fish | fly honorable: exact_id | Articulated Baitfish (190); Rabbit-Strip Leech (134) | Game Changer (190); Rabbit-Strip Leech (134) | Bunny Streamer (178, alt edge 44) |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 clear all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (124) | Deceiver (198); Rabbit-Strip Leech (124) | Game Changer (168, alt edge 44) |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 dirty big_fish | fly honorable: exact_id | Articulated Baitfish (190); Rabbit-Strip Leech (134) | Game Changer (190); Rabbit-Strip Leech (134) | Bunny Streamer (178, alt edge 44) |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained big_fish | fly honorable: exact_id | Articulated Baitfish (190); Rabbit-Strip Leech (134) | Game Changer (190); Rabbit-Strip Leech (134) | Bunny Streamer (178, alt edge 44) |
| Devils Lake prairie pike water<br>2025-08-21 dirty all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (132) | Deceiver (198); Rabbit-Strip Leech (132) | Articulated Baitfish (168, alt edge 36) |
| Devils Lake prairie pike water<br>2025-08-21 stained all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (132) | Deceiver (198); Rabbit-Strip Leech (132) | Articulated Baitfish (168, alt edge 36) |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 dirty all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (132) | Deceiver (198); Rabbit-Strip Leech (132) | Articulated Baitfish (168, alt edge 36) |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained all_purpose | fly honorable: exact_id | Deceiver (198); Rabbit-Strip Leech (132) | Deceiver (198); Rabbit-Strip Leech (132) | Articulated Baitfish (168, alt edge 36) |
| Devils Lake prairie pike water<br>2025-07-12 clear all_purpose | fly honorable: exact_id | Articulated Baitfish (144); Rabbit-Strip Leech (124) | Deceiver (152); Rabbit-Strip Leech (124) | Game Changer (152, alt edge 28) |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 dirty big_fish | fly honorable: exact_id | Big Articulated Streamer (156); Rabbit-Strip Leech (134) | Articulated Baitfish (160); Rabbit-Strip Leech (134) | Bunny Streamer (162, alt edge 28) |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 stained big_fish | fly honorable: exact_id | Game Changer (160); Rabbit-Strip Leech (134) | Big Articulated Streamer (156); Rabbit-Strip Leech (134) | Bunny Streamer (162, alt edge 28) |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear all_purpose | lure honorable: exact_id | Large Bucktail Spinner (210); Shallow Twitchbait (176) | Casting Spoon (202); Shallow Twitchbait (176) | Inline Spinner (202, alt edge 26) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 dirty | B | 3/4 | Large Tube Jig; Large Jerkbait; Dungeon Streamer; Rabbit-Strip Leech | Large Tube Jig; Large Paddle-Tail Swimbait; Dungeon Streamer; Rabbit-Strip Leech |
| Lake Champlain pike water<br>2025-01-18 stained | A | 3/4 | Large Tube Jig; Casting Spoon; Rabbit-Strip Leech; Bunny Streamer | Large Tube Jig; Large Jerkbait; Bunny Streamer; Rabbit-Strip Leech |
| Lake Champlain pike water<br>2025-01-18 stained | B | 3/4 | Heavy Paddle-Tail Swimbait; Large Bucktail Spinner; Deceiver; Rabbit-Strip Leech | Heavy Paddle-Tail Swimbait; Large Bucktail Spinner; Articulated Baitfish; Rabbit-Strip Leech |
| Devils Lake prairie pike water<br>2025-01-26 clear | A | 3/4 | Large Tube Jig; Casting Spoon; Rabbit-Strip Leech; Game Changer | Large Tube Jig; Large Paddle-Tail Swimbait; Rabbit-Strip Leech; Game Changer |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty | A | 3/4 | Large Tube Jig; Casting Spoon; Rabbit-Strip Leech; Bunny Streamer | Large Tube Jig; Large Jerkbait; Rabbit-Strip Leech; Bunny Streamer |
| Devils Lake prairie pike water<br>2025-03-18 dirty | B | 3/4 | Blade Bait; Oversized Spinnerbait; Bunny Streamer; Baitfish Slider | Oversized Spinnerbait; Blade Bait; Bunny Streamer; Rabbit-Strip Leech |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 dirty | B | 3/4 | Oversized Spinnerbait; Blade Bait; Deceiver; Baitfish Slider | Oversized Spinnerbait; Blade Bait; Game Changer; Baitfish Slider |
| Green Bay / Door County pike water<br>2025-04-18 dirty | B | 3/4 | Casting Spoon; Heavy Paddle-Tail Swimbait; Game Changer; Flash Fly | Oversized Spinnerbait; Heavy Paddle-Tail Swimbait; Game Changer; Flash Fly |
| Maine Belgrade Lakes pike water<br>2025-04-30 dirty | B | 3/4 | Oversized Spinnerbait; Blade Bait; Deceiver; Baitfish Slider | Oversized Spinnerbait; Blade Bait; Game Changer; Baitfish Slider |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear | A | 3/4 | Large Bucktail Spinner; Weedless Spoon; Deceiver; Flash Fly | Large Bucktail Spinner; Weedless Spoon; Flash Fly; Bunny Streamer |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 stained | A | 3/4 | Oversized Spinnerbait; Weedless Spoon; Deceiver; Flash Fly | Oversized Spinnerbait; Weedless Spoon; Bunny Streamer; Flash Fly |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 dirty | A | 3/4 | Oversized Spinnerbait; Weedless Spoon; Deceiver; Flash Fly | Oversized Spinnerbait; Weedless Spoon; Articulated Baitfish; Flash Fly |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 dirty | B | 3/4 | Large Bucktail Spinner; Heavy Paddle-Tail Swimbait; Bunny Streamer; Baitfish Slider | Large Bucktail Spinner; Heavy Paddle-Tail Swimbait; Bunny Streamer; Rabbit-Strip Leech |
| Fort Peck prairie pike reservoir<br>2025-05-19 dirty | A | 3/4 | Oversized Spinnerbait; Blade Bait; Rabbit-Strip Leech; Bunny Streamer | Oversized Spinnerbait; Heavy Paddle-Tail Swimbait; Bunny Streamer; Rabbit-Strip Leech |
| Green Bay / Door County pike water<br>2025-05-23 clear | A | 3/4 | Large Bucktail Spinner; Weedless Spoon; Deceiver; Flash Fly | Large Bucktail Spinner; Weedless Spoon; Game Changer; Flash Fly |
| Lake Champlain pike water<br>2025-05-23 clear | A | 3/4 | Casting Spoon; Blade Bait; Rabbit-Strip Leech; Bunny Streamer | Large Glide Bait; Blade Bait; Bunny Streamer; Rabbit-Strip Leech |
| Devils Lake prairie pike water<br>2025-06-14 dirty | A | 3/4 | Oversized Spinnerbait; Weedless Spoon; Game Changer; Flash Fly | Oversized Spinnerbait; Weedless Spoon; Flash Fly; Bunny Streamer |
| Green Bay / Door County pike water<br>2025-06-21 clear | A | 3/4 | Large Bucktail Spinner; Weedless Spoon; Deceiver; Flash Fly | Large Bucktail Spinner; Weedless Spoon; Game Changer; Flash Fly |
| Green Bay / Door County pike water<br>2025-06-21 stained | A | 3/4 | Large Bucktail Spinner; Weedless Spoon; Deceiver; Flash Fly | Large Bucktail Spinner; Weedless Spoon; Articulated Baitfish; Flash Fly |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained | A | 3/4 | Oversized Spinnerbait; Weedless Spoon; Deceiver; Flash Fly | Oversized Spinnerbait; Weedless Spoon; Bunny Streamer; Flash Fly |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 dirty | A | 3/4 | Oversized Spinnerbait; Weedless Spoon; Deceiver; Flash Fly | Oversized Spinnerbait; Weedless Spoon; Articulated Baitfish; Flash Fly |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

None.

## Big Fish No-Upside Diagnostics

None.

## Pike Big Fish Upside Split Diagnostics

### Pike Big Fish Upside Split Summary

| Class | Picks | Share | Common profiles |
| --- | --- | --- | --- |
| controlled_upside | 1426 | 84.9% | Rabbit-Strip Leech [fly] (188), Heavy Paddle-Tail Swimbait [lure] (164), Bunny Streamer [fly] (138), Flash Fly [fly] (127), Articulated Baitfish [fly] (121) |
| high_risk_or_reckless_upside | 107 | 6.4% | Large Glide Bait [lure] (45), Frog Popper [fly] (17), Deer Hair Slider [fly] (15), Dungeon Streamer [fly] (15), Large Walking Bait [lure] (15) |
| no_explicit_upside | 147 | 8.8% | Blade Bait [lure] (65), Baitfish Slider [fly] (40), Shallow Twitchbait [lure] (19), Unweighted Baitfish [fly] (15), Casting Spoon [lure] (4) |

### High-Risk/Reckless Pike Big Fish Upside Rows

| Scenario | Pick | Class | Reasons |
| --- | --- | --- | --- |
| Lake of the Woods pike water<br>2025-01-16 clear B | Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 stained A | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake of the Woods pike water<br>2025-01-16 dirty B | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 stained B | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-01-26 dirty A | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 clear A | Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 stained A | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Green Bay / Door County pike water<br>2025-02-11 dirty A | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 clear A | Dungeon Streamer (fly, 160) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 stained A | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty B | Dungeon Streamer (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-05-08 clear B | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-05-08 stained B | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 clear B | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Fort Peck prairie pike reservoir<br>2025-05-19 stained B | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 clear A | Large Glide Bait (lure, 208) | high_risk_or_reckless_upside | high_risk_high_reward |
| Lake Champlain pike water<br>2025-05-23 stained B | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 clear A | Large Glide Bait (lure, 208) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 clear A | Large Walking Bait (lure, 178) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 clear A | Frog Popper (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 stained A | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 stained A | Large Walking Bait (lure, 178) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 stained B | Frog Popper (fly, 168) | high_risk_or_reckless_upside | high_risk_high_reward |
| Maine Belgrade Lakes pike water<br>2025-06-07 dirty A | Large Walking Bait (lure, 170) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-06-14 clear A | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| Devils Lake prairie pike water<br>2025-06-14 clear B | Frog Popper (fly, 128) | high_risk_or_reckless_upside | high_risk_high_reward, surface_without_strong_window |
| Devils Lake prairie pike water<br>2025-06-14 stained A | Large Glide Bait (lure, 192) | high_risk_or_reckless_upside | high_risk_high_reward |
| St. Lawrence River pike backwater<br>2025-06-17 clear A | Deer Hair Slider (fly, 142) | high_risk_or_reckless_upside | surface_without_strong_window |
| St. Lawrence River pike backwater<br>2025-06-17 stained A | Deer Hair Slider (fly, 142) | high_risk_or_reckless_upside | surface_without_strong_window |
| St. Lawrence River pike backwater<br>2025-06-17 dirty A | Deer Hair Slider (fly, 142) | high_risk_or_reckless_upside | surface_without_strong_window |

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-03-20 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:warming_search:+16, condition_tag:open_water_search:+0) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:warming_search:+16, condition_tag:open_water_search:+0) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-04-30 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Maine Belgrade Lakes pike water<br>2025-04-30 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (174; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Bunny Streamer (178, alt edge 4) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-05-23 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-05-23 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-06-21 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Green Bay / Door County pike water<br>2025-06-21 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (174; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Bunny Streamer (178, alt edge 4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear all_purpose B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Flash Fly (174; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Unweighted Baitfish (180, alt edge 6) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 clear big_fish B | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (lure) | Large Bucktail Spinner (218; condition_tag:wind_reaction:+16, condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Shallow Twitchbait (146; condition_tag:open_water_search:+16) | Large Glide Bait (224, alt edge 6) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake Champlain pike water<br>2025-08-12 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-08-14 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |
| Lake of the Woods pike water<br>2025-08-14 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (190; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Baitfish Slider (152; condition_tag:open_water_search:+16) | Deceiver (186, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| dirty_vibration_acceptable | 28 |
| current_open_water_acceptable | 6 |
| clear_subtle_wind_watch | 2 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 big_fish clear A | stable_pleasant_high_confidence<br>neutral | Large Bucktail Spinner 218<br>Blade Bait 142 |
| clear_subtle_wind_watch | Lake Oahe prairie reservoir pike water<br>2025-11-11 big_fish clear A | warming_search<br>neutral | Large Bucktail Spinner 198<br>Large Tube Jig 182 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Large Bucktail Spinner 218<br>Heavy Paddle-Tail Swimbait 168 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 big_fish dirty A | dirty_vibration<br>neutral | Large Bucktail Spinner 210<br>Heavy Paddle-Tail Swimbait 168 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 big_fish dirty B | dirty_vibration<br>neutral | Oversized Spinnerbait 202<br>Blade Bait 142 |
| dirty_vibration_acceptable | Lake Oahe prairie reservoir pike water<br>2025-04-12 big_fish dirty B | dirty_vibration<br>neutral | Oversized Spinnerbait 202<br>Blade Bait 142 |
| dirty_vibration_acceptable | Maine Belgrade Lakes pike water<br>2025-04-30 big_fish dirty B | dirty_vibration<br>neutral | Oversized Spinnerbait 202<br>Blade Bait 142 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest pike lake<br>2025-03-20 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 210<br>Blade Bait 142 |
| current_open_water_acceptable | Lake Oahe prairie reservoir pike water<br>2025-04-12 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 210<br>Blade Bait 142 |
| current_open_water_acceptable | Maine Belgrade Lakes pike water<br>2025-04-30 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 210<br>Blade Bait 142 |
| current_open_water_acceptable | Missouri River backwater pike context<br>2025-09-29 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 210<br>Blade Bait 142 |
| current_open_water_acceptable | Green Bay / Door County pike water<br>2025-10-20 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Large Jerkbait 210<br>Blade Bait 142 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 450 |
| acceptable_fit | 1208 |
| strong_fit | 1702 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | B | lure | cold_slow_or_front | 59 |
| watch | all_purpose | A | fly | cold_slow_or_front | 48 |
| watch | big_fish | A | fly | cold_slow_or_front | 44 |
| watch | big_fish | B | fly | cold_slow_or_front | 35 |
| watch | all_purpose | A | lure | cold_slow_or_front | 27 |
| watch | big_fish | B | fly | stable_pleasant_high_confidence | 25 |
| watch | all_purpose | B | fly | cold_slow_or_front | 24 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 23 |
| watch | big_fish | B | fly | dirty_vibration | 21 |
| watch | big_fish | B | lure | warming_search | 18 |
| watch | all_purpose | B | lure | cold_slow_or_front | 17 |
| watch | big_fish | A | fly | stable_pleasant_high_confidence | 17 |
| watch | big_fish | A | fly | warming_search | 17 |
| watch | big_fish | A | lure | cold_slow_or_front | 15 |
| watch | all_purpose | A | lure | stable_pleasant_high_confidence | 12 |
| watch | big_fish | A | fly | dirty_vibration | 12 |
| watch | big_fish | B | lure | stable_pleasant_high_confidence | 12 |
| watch | big_fish | B | fly | warming_search | 10 |
| watch | all_purpose | A | fly | stable_pleasant_high_confidence | 9 |
| watch | all_purpose | B | fly | dirty_vibration | 8 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 8 |
| watch | big_fish | B | lure | dirty_vibration | 8 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 7 |
| watch | big_fish | A | lure | warming_search | 7 |
| watch | all_purpose | A | fly | dirty_vibration | 6 |
| watch | all_purpose | B | lure | stable_pleasant_high_confidence | 6 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 6 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | A | fly | warming_search | 5 |
| watch | all_purpose | B | fly | stable_pleasant_high_confidence | 5 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 5 |
| watch | all_purpose | A | fly | river_elevated_runoff_current | 4 |
| watch | all_purpose | B | fly | river_elevated_runoff_current | 4 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 4 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | A | lure | warming_search | 3 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | B | lure | warming_search | 3 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 2 |
| watch | all_purpose | A | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | all_purpose | B | lure | dirty_vibration | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | big_fish | A | lure | stable_pleasant_high_confidence | 2 |
| watch | all_purpose | A | lure | dirty_vibration | 1 |
| watch | all_purpose | B | lure | calm_bright_clear_subtle | 1 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | B | fly | calm_low_light_surface | 1 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 120 |
| acceptable_fit | all_purpose | B | lure | cold_slow_or_front | 96 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_high_confidence | 60 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_high_confidence | 55 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_high_confidence | 54 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 53 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_high_confidence | 51 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_high_confidence | 48 |
| acceptable_fit | big_fish | A | lure | stable_pleasant_high_confidence | 48 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_high_confidence | 44 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 44 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_high_confidence | 41 |
| acceptable_fit | big_fish | B | fly | warming_search | 38 |
| acceptable_fit | all_purpose | B | lure | warming_search | 36 |
| acceptable_fit | all_purpose | A | fly | cold_slow_or_front | 34 |
| acceptable_fit | all_purpose | B | fly | warming_search | 32 |
| acceptable_fit | big_fish | B | lure | warming_search | 31 |
| acceptable_fit | all_purpose | A | fly | warming_search | 26 |
| acceptable_fit | all_purpose | A | lure | cold_slow_or_front | 25 |
| acceptable_fit | big_fish | A | fly | warming_search | 24 |
| acceptable_fit | all_purpose | A | lure | warming_search | 23 |
| acceptable_fit | big_fish | A | lure | cold_slow_or_front | 23 |
| acceptable_fit | all_purpose | A | fly | unclassified | 18 |
| acceptable_fit | all_purpose | A | lure | unclassified | 18 |
| acceptable_fit | all_purpose | B | fly | unclassified | 18 |
| acceptable_fit | all_purpose | B | lure | unclassified | 18 |
| acceptable_fit | big_fish | A | fly | cold_slow_or_front | 18 |
| acceptable_fit | big_fish | A | fly | unclassified | 18 |
| acceptable_fit | big_fish | A | lure | unclassified | 18 |
| acceptable_fit | big_fish | B | fly | unclassified | 18 |
| acceptable_fit | big_fish | B | lure | unclassified | 18 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 1 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 4 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| St. Lawrence River pike backwater<br>2025-11-11 stained all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 dirty big_fish A | Large Tube Jig (lure_of_the_day, lure, score 214) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 stained all_purpose A | Bucktail Streamer (fly_of_the_day, fly, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 dirty all_purpose A | Bucktail Streamer (fly_of_the_day, fly, score 192) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-09-18 stained big_fish A | Large Jerkbait (lure_of_the_day, lure, score 226) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| St. Lawrence River pike backwater<br>2025-11-11 clear all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 222) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+current_swing+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 stained big_fish A | Large Bucktail Spinner (lure_of_the_day, lure, score 218) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-09-29 dirty big_fish A | Large Bucktail Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 dirty big_fish A | Large Bucktail Spinner (lure_of_the_day, lure, score 210) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake of the Woods pike water<br>2025-12-12 stained all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Devils Lake prairie pike water<br>2025-11-15 stained all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 stained all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-02-15 stained big_fish A | Large Jerkbait (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-11-08 stained all_purpose A | Large Tube Jig (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain pike water<br>2025-11-08 stained big_fish A | Large Jerkbait (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-09-29 dirty all_purpose A | Large Bucktail Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-09-29 dirty big_fish B | Oversized Spinnerbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Missouri River backwater pike context<br>2025-09-29 stained all_purpose B | Casting Spoon (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 dirty all_purpose A | Large Bucktail Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Oahe prairie reservoir pike water<br>2025-04-12 dirty big_fish B | Oversized Spinnerbait (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+warming_search+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1248 | 689 | 55% |
| clear_subtle | 384 | 48 | 13% |
| dirty_vibration | 896 | 245 | 27% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 1344 | 887 | 66% |
| low_light_surface | 168 | 28 | 17% |
| calm_surface | 288 | 74 | 26% |
| Big Fish upside | 1680 | 1533 | 91% |
| All Purpose reliable/versatile | 1680 | 1495 | 89% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Rabbit-Strip Leech [fly] (350), Bunny Streamer [fly] (234), Heavy Paddle-Tail Swimbait [lure] (221), Flash Fly [fly] (209), Oversized Spinnerbait [lure] (196), Large Bucktail Spinner [lure] (186), Blade Bait [lure] (181), Weedless Spoon [lure] (165), Game Changer [fly] (164), Deceiver [fly] (162), Articulated Baitfish [fly] (160), Shallow Twitchbait [lure] (160) |
| All-purpose | Rabbit-Strip Leech [fly] (162), Deceiver [fly] (161), Shallow Twitchbait [lure] (141), Casting Spoon [lure] (127), Baitfish Slider [fly] (119), Blade Bait [lure] (116), Oversized Spinnerbait [lure] (100), Bunny Streamer [fly] (96) |
| Big-fish | Rabbit-Strip Leech [fly] (188), Heavy Paddle-Tail Swimbait [lure] (164), Bunny Streamer [fly] (138), Flash Fly [fly] (127), Articulated Baitfish [fly] (121), Game Changer [fly] (109), Large Jerkbait [lure] (108), Large Bucktail Spinner [lure] (101) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 14 | 13 | 1 | 0 | 4 |
| fly | 16 | 16 | 0 | 0 | 4 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350/840 | 41.7% | big_fish:188, all_purpose:162 | B:176, A:174 | honorable:298, top:52 | stained:129, dirty:124, clear:97 | freshwater_lake_pond:319, freshwater_river:31 | cold_slow:253, wind_reaction:140, dirty_vibration:105, open_water_search:96 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234/840 | 27.9% | big_fish:138, all_purpose:96 | B:147, A:87 | top:194, honorable:40 | stained:84, clear:75, dirty:75 | freshwater_lake_pond:218, freshwater_river:16 | cold_slow:149, wind_reaction:85, dirty_vibration:52, open_water_search:43 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221/840 | 26.3% | big_fish:164, all_purpose:57 | B:140, A:81 | honorable:190, top:31 | dirty:96, stained:82, clear:43 | freshwater_lake_pond:182, freshwater_river:39 | cold_slow:112, dirty_vibration:76, wind_reaction:75, open_water_search:41 |
| Flash Fly<br>pike_flash_fly | fly | 209/540 | 38.7% | big_fish:127, all_purpose:82 | A:121, B:88 | honorable:182, top:27 | clear:71, dirty:71, stained:67 | freshwater_lake_pond:176, freshwater_river:33 | wind_reaction:94, dirty_vibration:68, open_water_search:54, cold_slow:46 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196/732 | 26.8% | all_purpose:100, big_fish:96 | A:114, B:82 | top:185, honorable:11 | dirty:111, stained:81, clear:4 | freshwater_lake_pond:166, freshwater_river:30 | dirty_vibration:61, wind_reaction:55, cold_slow:53, none:42 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186/840 | 22.1% | big_fish:101, all_purpose:85 | A:101, B:85 | top:150, honorable:36 | clear:68, dirty:60, stained:58 | freshwater_lake_pond:158, freshwater_river:28 | wind_reaction:152, dirty_vibration:108, open_water_search:108, cold_slow:65 |
| Blade Bait<br>blade_bait | lure | 181/840 | 21.5% | all_purpose:116, big_fish:65 | B:120, A:61 | honorable:145, top:36 | clear:78, stained:52, dirty:51 | freshwater_lake_pond:146, freshwater_river:35 | cold_slow:117, wind_reaction:58, open_water_search:50, dirty_vibration:44 |
| Weedless Spoon<br>weedless_spoon | lure | 165/360 | 45.8% | big_fish:99, all_purpose:66 | A:119, B:46 | honorable:163, top:2 | stained:63, dirty:54, clear:48 | freshwater_lake_pond:165 | wind_reaction:68, none:53, dirty_vibration:44, open_water_search:42 |
| Game Changer<br>game_changer | fly | 164/840 | 19.5% | big_fish:109, all_purpose:55 | A:88, B:76 | top:138, honorable:26 | clear:67, dirty:49, stained:48 | freshwater_lake_pond:142, freshwater_river:22 | wind_reaction:46, cold_slow:45, open_water_search:44, warming_search:38 |
| Deceiver<br>deceiver | fly | 162/840 | 19.3% | all_purpose:161, big_fish:1 | A:109, B:53 | top:126, honorable:36 | clear:59, stained:52, dirty:51 | freshwater_lake_pond:152, freshwater_river:10 | wind_reaction:104, open_water_search:78, dirty_vibration:68, cold_slow:43 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 160/840 | 19% | big_fish:121, all_purpose:39 | A:91, B:69 | top:131, honorable:29 | dirty:67, stained:58, clear:35 | freshwater_lake_pond:143, freshwater_river:17 | dirty_vibration:52, wind_reaction:52, cold_slow:51, open_water_search:39 |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 160/732 | 21.9% | all_purpose:141, big_fish:19 | B:94, A:66 | honorable:144, top:16 | clear:68, stained:48, dirty:44 | freshwater_lake_pond:137, freshwater_river:23 | wind_reaction:57, warming_search:48, open_water_search:47, dirty_vibration:28 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159/624 | 25.5% | all_purpose:119, big_fish:40 | B:103, A:56 | honorable:123, top:36 | dirty:57, stained:53, clear:49 | freshwater_lake_pond:135, freshwater_river:24 | wind_reaction:60, open_water_search:49, dirty_vibration:46, warming_search:46 |
| Casting Spoon<br>casting_spoon | lure | 131/840 | 15.6% | all_purpose:127, big_fish:4 | A:77, B:54 | top:83, honorable:48 | clear:61, dirty:35, stained:35 | freshwater_lake_pond:112, freshwater_river:19 | cold_slow:82, wind_reaction:40, open_water_search:29, clear_subtle:23 |
| Large Jerkbait<br>pike_jerkbait | lure | 126/840 | 15% | big_fish:108, all_purpose:18 | B:66, A:60 | top:78, honorable:48 | clear:50, stained:44, dirty:32 | freshwater_lake_pond:111, freshwater_river:15 | cold_slow:92, wind_reaction:52, open_water_search:38, dirty_vibration:27 |
| Large Tube Jig<br>large_pike_tube | lure | 88/168 | 52.4% | big_fish:46, all_purpose:42 | A:68, B:20 | top:73, honorable:15 | clear:32, dirty:28, stained:28 | freshwater_lake_pond:82, freshwater_river:6 | cold_slow:82, wind_reaction:50, open_water_search:36, dirty_vibration:32 |
| Inline Spinner<br>inline_spinner | lure | 85/624 | 13.6% | all_purpose:85 | B:75, A:10 | top:76, honorable:9 | clear:42, stained:28, dirty:15 | freshwater_lake_pond:75, freshwater_river:10 | clear_subtle:20, none:20, calm_surface:17, cold_slow:15 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 80/840 | 9.5% | big_fish:78, all_purpose:2 | B:45, A:35 | top:65, honorable:15 | clear:37, dirty:29, stained:14 | freshwater_lake_pond:69, freshwater_river:11 | warming_search:24, clear_subtle:19, cold_slow:16, none:15 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 69/624 | 11.1% | all_purpose:54, big_fish:15 | A:38, B:31 | honorable:47, top:22 | clear:43, stained:16, dirty:10 | freshwater_lake_pond:64, freshwater_river:5 | clear_subtle:34, cold_slow:19, warming_search:14, wind_reaction:12 |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 45/840 | 5.4% | big_fish:42, all_purpose:3 | B:29, A:16 | top:39, honorable:6 | clear:20, dirty:14, stained:11 | freshwater_lake_pond:39, freshwater_river:6 | wind_reaction:20, none:13, cold_slow:10, open_water_search:9 |
| Large Glide Bait<br>pike_glidebait | lure | 45/432 | 10.4% | big_fish:45 | A:32, B:13 | top:45 | clear:23, stained:22 | freshwater_lake_pond:45 | clear_subtle:14, none:14, calm_surface:10, cold_slow:10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 29/126 | 23% | big_fish:24, all_purpose:5 | A:16, B:13 | honorable:17, top:12 | dirty:12, stained:9, clear:8 | freshwater_lake_pond:23, freshwater_river:6 | calm_surface:23, low_light_surface:10, warming_search:7, clear_subtle:5 |
| Bass Popper<br>popper_fly | fly | 22/126 | 17.5% | all_purpose:22 | A:13, B:9 | honorable:12, top:10 | stained:8, clear:7, dirty:7 | freshwater_lake_pond:18, freshwater_river:4 | calm_surface:18, low_light_surface:7, warming_search:6, clear_subtle:5 |
| Clouser Minnow<br>clouser_minnow | fly | 20/108 | 18.5% | all_purpose:20 | B:15, A:5 | top:16, honorable:4 | clear:8, stained:8, dirty:4 | freshwater_river:20 | current_swing:9, cold_slow:7, dirty_vibration:6, clear_subtle:3 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 18/108 | 16.7% | big_fish:15, all_purpose:3 | B:10, A:8 | top:18 | stained:7, dirty:6, clear:5 | freshwater_lake_pond:18 | cold_slow:18, clear_subtle:2, wind_reaction:2, dirty_vibration:1 |
| Frog Popper<br>frog_fly | fly | 17/102 | 16.7% | big_fish:17 | A:9, B:8 | honorable:16, top:1 | clear:7, dirty:5, stained:5 | freshwater_lake_pond:17 | calm_surface:13, warming_search:6, low_light_surface:5, clear_subtle:4 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 16/108 | 14.8% | all_purpose:14, big_fish:2 | A:8, B:8 | top:15, honorable:1 | clear:7, dirty:5, stained:4 | freshwater_river:16 | current_swing:11, dirty_vibration:8, open_water_search:6, wind_reaction:6 |
| Large Walking Bait<br>large_pike_topwater | lure | 16/102 | 15.7% | big_fish:15, all_purpose:1 | A:16 | honorable:16 | clear:6, dirty:5, stained:5 | freshwater_lake_pond:16 | calm_surface:16, clear_subtle:5, low_light_surface:4, warming_search:3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 6/24 | 25% | all_purpose:5, big_fish:1 | B:5, A:1 | honorable:3, top:3 | dirty:3, clear:2, stained:1 | freshwater_river:6 | calm_surface:4, low_light_surface:2, clear_subtle:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0/108 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350/3360 (10.4%) | 52/1680 (3.1%) | 298/1680 (17.7%) | - | 350/1680 (20.8%) | fly side actual >20% |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234/3360 (7%) | 194/1680 (11.5%) | 40/1680 (2.4%) | - | 234/1680 (13.9%) |  |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221/3360 (6.6%) | 31/1680 (1.8%) | 190/1680 (11.3%) | 221/1680 (13.2%) | - |  |
| Flash Fly<br>pike_flash_fly | fly | 209/3360 (6.2%) | 27/1680 (1.6%) | 182/1680 (10.8%) | - | 209/1680 (12.4%) |  |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196/3360 (5.8%) | 185/1680 (11%) | 11/1680 (0.7%) | 196/1680 (11.7%) | - |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186/3360 (5.5%) | 150/1680 (8.9%) | 36/1680 (2.1%) | 186/1680 (11.1%) | - |  |
| Blade Bait<br>blade_bait | lure | 181/3360 (5.4%) | 36/1680 (2.1%) | 145/1680 (8.6%) | 181/1680 (10.8%) | - |  |
| Weedless Spoon<br>weedless_spoon | lure | 165/3360 (4.9%) | 2/1680 (0.1%) | 163/1680 (9.7%) | 165/1680 (9.8%) | - |  |
| Game Changer<br>game_changer | fly | 164/3360 (4.9%) | 138/1680 (8.2%) | 26/1680 (1.5%) | - | 164/1680 (9.8%) |  |
| Deceiver<br>deceiver | fly | 162/3360 (4.8%) | 126/1680 (7.5%) | 36/1680 (2.1%) | - | 162/1680 (9.6%) |  |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 160/3360 (4.8%) | 131/1680 (7.8%) | 29/1680 (1.7%) | - | 160/1680 (9.5%) |  |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 160/3360 (4.8%) | 16/1680 (1%) | 144/1680 (8.6%) | 160/1680 (9.5%) | - |  |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159/3360 (4.7%) | 36/1680 (2.1%) | 123/1680 (7.3%) | - | 159/1680 (9.5%) |  |
| Casting Spoon<br>casting_spoon | lure | 131/3360 (3.9%) | 83/1680 (4.9%) | 48/1680 (2.9%) | 131/1680 (7.8%) | - |  |
| Large Jerkbait<br>pike_jerkbait | lure | 126/3360 (3.8%) | 78/1680 (4.6%) | 48/1680 (2.9%) | 126/1680 (7.5%) | - |  |
| Large Tube Jig<br>large_pike_tube | lure | 88/3360 (2.6%) | 73/1680 (4.3%) | 15/1680 (0.9%) | 88/1680 (5.2%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 85/3360 (2.5%) | 76/1680 (4.5%) | 9/1680 (0.5%) | 85/1680 (5.1%) | - |  |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 80/3360 (2.4%) | 65/1680 (3.9%) | 15/1680 (0.9%) | 80/1680 (4.8%) | - |  |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 69/3360 (2.1%) | 22/1680 (1.3%) | 47/1680 (2.8%) | - | 69/1680 (4.1%) |  |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 45/3360 (1.3%) | 39/1680 (2.3%) | 6/1680 (0.4%) | - | 45/1680 (2.7%) |  |
| Large Glide Bait<br>pike_glidebait | lure | 45/3360 (1.3%) | 45/1680 (2.7%) | 0/1680 (0%) | 45/1680 (2.7%) | - |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 29/3360 (0.9%) | 12/1680 (0.7%) | 17/1680 (1%) | - | 29/1680 (1.7%) |  |
| Bass Popper<br>popper_fly | fly | 22/3360 (0.7%) | 10/1680 (0.6%) | 12/1680 (0.7%) | - | 22/1680 (1.3%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 20/3360 (0.6%) | 16/1680 (1%) | 4/1680 (0.2%) | - | 20/1680 (1.2%) |  |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 18/3360 (0.5%) | 18/1680 (1.1%) | 0/1680 (0%) | - | 18/1680 (1.1%) |  |
| Frog Popper<br>frog_fly | fly | 17/3360 (0.5%) | 1/1680 (0.1%) | 16/1680 (1%) | - | 17/1680 (1%) |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 16/3360 (0.5%) | 15/1680 (0.9%) | 1/1680 (0.1%) | - | 16/1680 (1%) |  |
| Large Walking Bait<br>large_pike_topwater | lure | 16/3360 (0.5%) | 0/1680 (0%) | 16/1680 (1%) | 16/1680 (1%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 6/3360 (0.2%) | 3/1680 (0.2%) | 3/1680 (0.2%) | - | 6/1680 (0.4%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0/3360 (0%) | 0/1680 (0%) | 0/1680 (0%) | 0/1680 (0%) | - |  |

## Per-Profile Usage Audit

| Profile | Gear | Selected | All-slot share | Side-slot share | All-purpose side share | Big-fish side share | Top/HM | Available rows | Finalist/repair opp | Selected/opportunity | Goal | Surface gate | Activity | Wind | Bucket | Clarity | Month/season | Condition tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350 | 350/3360 (10.4%) | 350/1680 (20.8%) | 162/840 (19.3%) | 188/840 (22.4%) | 52/298 | 840/840 (100%) | 417 | 83.9% | big_fish:188, all_purpose:162 | closed:346, caution:4 | neutral:261, suppressed:84, active:5 | breezy:138, calm:84, slight:66, windy:62 | cold_slow_or_front:206, dirty_vibration:52, breezy_windy_stained_reaction:51, stable_pleasant_high_confidence:23, warming_search:10 | stained:129, dirty:124, clear:97 | Nov:58, Mar:41, Dec:36, Feb:36<br>winter:108, spring:100, fall:93, summer:49 | cold_slow:253, wind_reaction:140, dirty_vibration:105, open_water_search:96, none:40, clear_subtle:26 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234 | 234/3360 (7%) | 234/1680 (13.9%) | 96/840 (11.4%) | 138/840 (16.4%) | 194/40 | 840/840 (100%) | 858 | 27.3% | big_fish:138, all_purpose:96 | closed:212, open:13, caution:9 | neutral:175, suppressed:48, active:11 | calm:74, breezy:65, windy:54, slight:41 | cold_slow_or_front:128, stable_pleasant_high_confidence:36, breezy_windy_stained_reaction:27, dirty_vibration:25, unclassified:10 | stained:84, clear:75, dirty:75 | May:34, Nov:25, Apr:22, Sep:21<br>spring:74, fall:66, winter:53, summer:41 | cold_slow:149, wind_reaction:85, dirty_vibration:52, open_water_search:43, none:33, clear_subtle:21 |
| Flash Fly<br>pike_flash_fly | fly | 209 | 209/3360 (6.2%) | 209/1680 (12.4%) | 82/840 (9.8%) | 127/840 (15.1%) | 27/182 | 540/840 (64.3%) | 483 | 43.3% | big_fish:127, all_purpose:82 | closed:182, caution:19, open:8 | neutral:185, active:13, suppressed:11 | breezy:58, calm:55, slight:53, windy:43 | cold_slow_or_front:51, stable_pleasant_high_confidence:49, dirty_vibration:34, breezy_windy_stained_reaction:30, warming_search:19 | clear:71, dirty:71, stained:67 | May:43, Apr:39, Sep:39, Oct:36<br>spring:82, fall:75, summer:52 | wind_reaction:94, dirty_vibration:68, open_water_search:54, cold_slow:46, none:39, warming_search:27 |
| Game Changer<br>game_changer | fly | 164 | 164/3360 (4.9%) | 164/1680 (9.8%) | 55/840 (6.5%) | 109/840 (13%) | 138/26 | 840/840 (100%) | 929 | 17.7% | big_fish:109, all_purpose:55 | closed:134, caution:15, open:15 | neutral:139, suppressed:19, active:6 | breezy:53, calm:53, slight:51, windy:7 | cold_slow_or_front:51, stable_pleasant_high_confidence:37, warming_search:34, dirty_vibration:15, breezy_windy_stained_reaction:12 | clear:67, dirty:49, stained:48 | Apr:30, Mar:20, Aug:19, Jun:19<br>spring:68, summer:54, fall:36, winter:6 | wind_reaction:46, cold_slow:45, open_water_search:44, warming_search:38, dirty_vibration:29, clear_subtle:27 |
| Deceiver<br>deceiver | fly | 162 | 162/3360 (4.8%) | 162/1680 (9.6%) | 161/840 (19.2%) | 1/840 (0.1%) | 126/36 | 840/840 (100%) | 685 | 23.6% | all_purpose:161, big_fish:1 | closed:141, caution:12, open:9 | neutral:150, suppressed:7, active:5 | breezy:81, calm:31, windy:27, slight:23 | cold_slow_or_front:40, breezy_windy_stained_reaction:34, dirty_vibration:34, stable_pleasant_high_confidence:27, warming_search:19 | clear:59, stained:52, dirty:51 | Aug:23, Jun:17, Jul:16, Mar:16<br>summer:56, spring:46, fall:42, winter:18 | wind_reaction:104, open_water_search:78, dirty_vibration:68, cold_slow:43, warming_search:26, none:14 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 160 | 160/3360 (4.8%) | 160/1680 (9.5%) | 39/840 (4.6%) | 121/840 (14.4%) | 131/29 | 840/840 (100%) | 858 | 18.6% | big_fish:121, all_purpose:39 | closed:133, open:15, caution:12 | neutral:133, suppressed:17, active:10 | calm:58, slight:43, breezy:42, windy:17 | cold_slow_or_front:43, warming_search:29, dirty_vibration:26, stable_pleasant_high_confidence:26, breezy_windy_stained_reaction:24 | dirty:67, stained:58, clear:35 | Mar:22, Oct:21, Sep:19, Jun:17<br>spring:52, fall:50, summer:48, winter:10 | dirty_vibration:52, wind_reaction:52, cold_slow:51, open_water_search:39, warming_search:36, none:24 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159 | 159/3360 (4.7%) | 159/1680 (9.5%) | 119/840 (14.2%) | 40/840 (4.8%) | 36/123 | 624/840 (74.3%) | 440 | 36.1% | all_purpose:119, big_fish:40 | closed:132, open:14, caution:13 | neutral:145, suppressed:9, active:5 | breezy:51, calm:49, slight:45, windy:14 | warming_search:39, cold_slow_or_front:33, stable_pleasant_high_confidence:30, dirty_vibration:24, breezy_windy_stained_reaction:20 | dirty:57, stained:53, clear:49 | Apr:28, Mar:27, Oct:23, Jun:21<br>spring:73, summer:44, fall:42 | wind_reaction:60, open_water_search:49, dirty_vibration:46, warming_search:46, cold_slow:27, none:17 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 69 | 69/3360 (2.1%) | 69/1680 (4.1%) | 54/840 (6.4%) | 15/840 (1.8%) | 22/47 | 624/840 (74.3%) | 314 | 22% | all_purpose:54, big_fish:15 | closed:61, open:5, caution:3 | neutral:60, suppressed:5, active:4 | calm:43, slight:14, breezy:11, windy:1 | cold_slow_or_front:22, stable_pleasant_high_confidence:19, warming_search:13, unclassified:6, breezy_windy_stained_reaction:3 | clear:43, stained:16, dirty:10 | Mar:20, Oct:11, Sep:11, Jun:8<br>spring:31, fall:22, summer:16 | clear_subtle:34, cold_slow:19, warming_search:14, wind_reaction:12, open_water_search:11, none:7 |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 45 | 45/3360 (1.3%) | 45/1680 (2.7%) | 3/840 (0.4%) | 42/840 (5%) | 39/6 | 840/840 (100%) | 472 | 9.5% | big_fish:42, all_purpose:3 | closed:38, open:4, caution:3 | neutral:36, suppressed:6, active:3 | calm:14, breezy:12, windy:11, slight:8 | cold_slow_or_front:17, stable_pleasant_high_confidence:16, dirty_vibration:5, breezy_windy_stained_reaction:3, unclassified:2 | clear:20, dirty:14, stained:11 | Jul:7, Sep:7, Aug:6, Nov:6<br>fall:18, summer:17, spring:7, winter:3 | wind_reaction:20, none:13, cold_slow:10, open_water_search:9, dirty_vibration:8, calm_surface:4 |
| Deer Hair Slider<br>deer_hair_slider | fly | 29 | 29/3360 (0.9%) | 29/1680 (1.7%) | 5/840 (0.6%) | 24/840 (2.9%) | 12/17 | 126/840 (15%) | 80 | 36.3% | big_fish:24, all_purpose:5 | open:23, caution:6 | neutral:25, active:4 | calm:23, slight:6 | stable_pleasant_high_confidence:11, warming_search:7, calm_low_light_surface:4, cold_slow_or_front:4, unclassified:3 | dirty:12, stained:9, clear:8 | Jun:19, Jul:10<br>summer:29 | calm_surface:23, low_light_surface:10, warming_search:7, clear_subtle:5 |
| Bass Popper<br>popper_fly | fly | 22 | 22/3360 (0.7%) | 22/1680 (1.3%) | 22/840 (2.6%) | 0/840 (0%) | 10/12 | 126/840 (15%) | 51 | 43.1% | all_purpose:22 | open:18, caution:4 | neutral:19, active:3 | calm:18, slight:4 | stable_pleasant_high_confidence:9, warming_search:6, calm_low_light_surface:3, cold_slow_or_front:3, unclassified:1 | stained:8, clear:7, dirty:7 | Jun:13, Jul:9<br>summer:22 | calm_surface:18, low_light_surface:7, warming_search:6, clear_subtle:5 |
| Clouser Minnow<br>clouser_minnow | fly | 20 | 20/3360 (0.6%) | 20/1680 (1.2%) | 20/840 (2.4%) | 0/840 (0%) | 16/4 | 108/840 (12.9%) | 88 | 22.7% | all_purpose:20 | closed:16, caution:2, open:2 | neutral:20 | slight:15, breezy:3, calm:2 | cold_slow_or_front:5, river_elevated_runoff_current:4, dirty_vibration:3, warming_search:3, stable_pleasant_high_confidence:2 | clear:8, stained:8, dirty:4 | Apr:5, May:3, Nov:3, Oct:3<br>spring:10, fall:6, summer:4 | current_swing:9, cold_slow:7, dirty_vibration:6, clear_subtle:3, open_water_search:3, warming_search:3 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 18 | 18/3360 (0.5%) | 18/1680 (1.1%) | 3/840 (0.4%) | 15/840 (1.8%) | 18/0 | 108/840 (12.9%) | 72 | 25% | big_fish:15, all_purpose:3 | closed:18 | suppressed:10, neutral:8 | breezy:8, calm:6, windy:4 | cold_slow_or_front:17, breezy_windy_stained_reaction:1 | stained:7, dirty:6, clear:5 | Jan:7, Feb:6, Dec:5<br>winter:18 | cold_slow:18, clear_subtle:2, wind_reaction:2, dirty_vibration:1 |
| Frog Popper<br>frog_fly | fly | 17 | 17/3360 (0.5%) | 17/1680 (1%) | 0/840 (0%) | 17/840 (2%) | 1/16 | 102/840 (12.1%) | 51 | 33.3% | big_fish:17 | open:13, caution:4 | neutral:14, active:3 | calm:13, slight:4 | stable_pleasant_high_confidence:6, warming_search:6, calm_low_light_surface:2, cold_slow_or_front:2, unclassified:1 | clear:7, dirty:5, stained:5 | Jun:11, Jul:6<br>summer:17 | calm_surface:13, warming_search:6, low_light_surface:5, clear_subtle:4, none:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 16 | 16/3360 (0.5%) | 16/1680 (1%) | 14/840 (1.7%) | 2/840 (0.2%) | 15/1 | 108/840 (12.9%) | 84 | 19% | all_purpose:14, big_fish:2 | closed:15, open:1 | neutral:16 | slight:9, breezy:6, calm:1 | river_elevated_runoff_current:6, dirty_vibration:4, breezy_windy_stained_reaction:2, cold_slow_or_front:2, stable_pleasant_high_confidence:1 | clear:7, dirty:5, stained:4 | Apr:4, May:4, Nov:3, Sep:3<br>spring:9, fall:6, summer:1 | current_swing:11, dirty_vibration:8, open_water_search:6, wind_reaction:6, cold_slow:4, warming_search:3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 6 | 6/3360 (0.2%) | 6/1680 (0.4%) | 5/840 (0.6%) | 1/840 (0.1%) | 3/3 | 24/840 (2.9%) | 22 | 27.3% | all_purpose:5, big_fish:1 | open:4, caution:2 | neutral:6 | calm:4, slight:2 | stable_pleasant_high_confidence:4, unclassified:2 | dirty:3, clear:2, stained:1 | Jul:4, Jun:2<br>summer:6 | calm_surface:4, low_light_surface:2, clear_subtle:1 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221 | 221/3360 (6.6%) | 221/1680 (13.2%) | 57/840 (6.8%) | 164/840 (19.5%) | 31/190 | 840/840 (100%) | 358 | 61.7% | big_fish:164, all_purpose:57 | closed:206, caution:12, open:3 | neutral:182, suppressed:35, active:4 | slight:70, breezy:55, calm:54, windy:42 | cold_slow_or_front:92, dirty_vibration:38, breezy_windy_stained_reaction:34, warming_search:30, stable_pleasant_high_confidence:13 | dirty:96, stained:82, clear:43 | Oct:36, Mar:35, May:34, Apr:32<br>spring:101, fall:62, summer:31, winter:27 | cold_slow:112, dirty_vibration:76, wind_reaction:75, open_water_search:41, warming_search:36, none:17 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196 | 196/3360 (5.8%) | 196/1680 (11.7%) | 100/840 (11.9%) | 96/840 (11.4%) | 185/11 | 732/840 (87.1%) | 678 | 28.9% | all_purpose:100, big_fish:96 | closed:158, open:23, caution:15 | neutral:169, suppressed:15, active:12 | calm:77, slight:56, breezy:34, windy:29 | cold_slow_or_front:54, dirty_vibration:41, stable_pleasant_high_confidence:40, warming_search:25, breezy_windy_stained_reaction:16 | dirty:111, stained:81, clear:4 | Apr:27, Mar:27, May:27, Jun:25<br>spring:81, summer:66, fall:49 | dirty_vibration:61, wind_reaction:55, cold_slow:53, none:42, open_water_search:29, warming_search:29 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186 | 186/3360 (5.5%) | 186/1680 (11.1%) | 85/840 (10.1%) | 101/840 (12%) | 150/36 | 840/840 (100%) | 648 | 28.7% | big_fish:101, all_purpose:85 | closed:173, caution:11, open:2 | neutral:173, suppressed:13 | breezy:111, windy:48, slight:23, calm:4 | dirty_vibration:56, breezy_windy_stained_reaction:48, cold_slow_or_front:46, stable_pleasant_high_confidence:20, warming_search:8 | clear:68, dirty:60, stained:58 | Nov:26, May:25, Apr:24, Jul:20<br>spring:57, fall:56, summer:47, winter:26 | wind_reaction:152, dirty_vibration:108, open_water_search:108, cold_slow:65, warming_search:20, current_swing:16 |
| Blade Bait<br>blade_bait | lure | 181 | 181/3360 (5.4%) | 181/1680 (10.8%) | 116/840 (13.8%) | 65/840 (7.7%) | 36/145 | 840/840 (100%) | 319 | 56.7% | all_purpose:116, big_fish:65 | closed:173, open:5, caution:3 | neutral:142, suppressed:36, active:3 | breezy:64, calm:51, slight:49, windy:17 | cold_slow_or_front:105, dirty_vibration:22, breezy_windy_stained_reaction:18, stable_pleasant_high_confidence:16, river_elevated_runoff_current:8 | clear:78, stained:52, dirty:51 | Apr:35, Mar:31, May:31, Oct:20<br>spring:97, fall:46, winter:23, summer:15 | cold_slow:117, wind_reaction:58, open_water_search:50, dirty_vibration:44, clear_subtle:29, warming_search:16 |
| Weedless Spoon<br>weedless_spoon | lure | 165 | 165/3360 (4.9%) | 165/1680 (9.8%) | 66/840 (7.9%) | 99/840 (11.8%) | 2/163 | 360/840 (42.9%) | 275 | 60% | big_fish:99, all_purpose:66 | closed:118, open:25, caution:22 | neutral:143, active:17, suppressed:5 | calm:67, breezy:42, slight:30, windy:26 | stable_pleasant_high_confidence:61, cold_slow_or_front:30, breezy_windy_stained_reaction:22, dirty_vibration:22, unclassified:12 | stained:63, dirty:54, clear:48 | Aug:39, Sep:39, Jun:32, Jul:29<br>summer:100, fall:39, spring:26 | wind_reaction:68, none:53, dirty_vibration:44, open_water_search:42, calm_surface:25, clear_subtle:19 |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 160 | 160/3360 (4.8%) | 160/1680 (9.5%) | 141/840 (16.8%) | 19/840 (2.3%) | 16/144 | 732/840 (87.1%) | 289 | 55.4% | all_purpose:141, big_fish:19 | closed:125, open:20, caution:15 | neutral:140, suppressed:11, active:9 | calm:56, breezy:52, slight:41, windy:11 | stable_pleasant_high_confidence:46, warming_search:42, cold_slow_or_front:27, breezy_windy_stained_reaction:14, dirty_vibration:14 | clear:68, stained:48, dirty:44 | Apr:27, Oct:24, Jun:23, Sep:20<br>summer:61, spring:50, fall:49 | wind_reaction:57, warming_search:48, open_water_search:47, dirty_vibration:28, none:28, clear_subtle:22 |
| Casting Spoon<br>casting_spoon | lure | 131 | 131/3360 (3.9%) | 131/1680 (7.8%) | 127/840 (15.1%) | 4/840 (0.5%) | 83/48 | 840/840 (100%) | 482 | 27.2% | all_purpose:127, big_fish:4 | closed:120, open:7, caution:4 | neutral:107, suppressed:21, active:3 | calm:43, breezy:40, slight:32, windy:16 | cold_slow_or_front:71, stable_pleasant_high_confidence:15, warming_search:15, breezy_windy_stained_reaction:13, dirty_vibration:9 | clear:61, dirty:35, stained:35 | Mar:17, Nov:15, Apr:14, May:14<br>spring:45, fall:36, winter:31, summer:19 | cold_slow:82, wind_reaction:40, open_water_search:29, clear_subtle:23, dirty_vibration:22, warming_search:18 |
| Large Jerkbait<br>pike_jerkbait | lure | 126 | 126/3360 (3.8%) | 126/1680 (7.5%) | 18/840 (2.1%) | 108/840 (12.9%) | 78/48 | 840/840 (100%) | 409 | 30.8% | big_fish:108, all_purpose:18 | closed:120, caution:4, open:2 | neutral:95, suppressed:31 | breezy:56, calm:32, windy:22, slight:16 | cold_slow_or_front:82, breezy_windy_stained_reaction:22, stable_pleasant_high_confidence:11, dirty_vibration:5, warming_search:5 | clear:50, stained:44, dirty:32 | May:16, Feb:15, Mar:15, Apr:14<br>spring:45, winter:41, fall:27, summer:13 | cold_slow:92, wind_reaction:52, open_water_search:38, dirty_vibration:27, clear_subtle:15, warming_search:8 |
| Large Tube Jig<br>large_pike_tube | lure | 88 | 88/3360 (2.6%) | 88/1680 (5.2%) | 42/840 (5%) | 46/840 (5.5%) | 73/15 | 168/840 (20%) | 139 | 63.3% | big_fish:46, all_purpose:42 | closed:88 | neutral:64, suppressed:24 | breezy:54, windy:20, calm:14 | cold_slow_or_front:54, breezy_windy_stained_reaction:16, dirty_vibration:16, warming_search:2 | clear:32, dirty:28, stained:28 | Nov:30, Feb:20, Dec:19, Jan:19<br>winter:58, fall:30 | cold_slow:82, wind_reaction:50, open_water_search:36, dirty_vibration:32, clear_subtle:6, current_swing:6 |
| Inline Spinner<br>inline_spinner | lure | 85 | 85/3360 (2.5%) | 85/1680 (5.1%) | 85/840 (10.1%) | 0/840 (0%) | 76/9 | 624/840 (74.3%) | 456 | 18.6% | all_purpose:85 | closed:59, open:17, caution:9 | neutral:69, active:9, suppressed:7 | calm:45, slight:24, breezy:12, windy:4 | stable_pleasant_high_confidence:31, cold_slow_or_front:21, warming_search:14, unclassified:8, breezy_windy_stained_reaction:5 | clear:42, stained:28, dirty:15 | Jun:19, Sep:15, Apr:11, Oct:9<br>summer:35, spring:26, fall:24 | clear_subtle:20, none:20, calm_surface:17, cold_slow:15, warming_search:15, wind_reaction:13 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 80 | 80/3360 (2.4%) | 80/1680 (4.8%) | 2/840 (0.2%) | 78/840 (9.3%) | 65/15 | 840/840 (100%) | 431 | 18.6% | big_fish:78, all_purpose:2 | closed:57, open:14, caution:9 | neutral:60, suppressed:14, active:6 | calm:41, slight:27, breezy:7, windy:5 | cold_slow_or_front:23, warming_search:23, stable_pleasant_high_confidence:21, unclassified:7, calm_low_light_surface:2 | clear:37, dirty:29, stained:14 | Jun:14, Oct:11, Jul:10, Sep:10<br>summer:30, fall:22, spring:18, winter:10 | warming_search:24, clear_subtle:19, cold_slow:16, none:15, calm_surface:14, low_light_surface:9 |
| Large Glide Bait<br>pike_glidebait | lure | 45 | 45/3360 (1.3%) | 45/1680 (2.7%) | 0/840 (0%) | 45/840 (5.4%) | 45/0 | 432/840 (51.4%) | 210 | 21.4% | big_fish:45 | closed:31, open:10, caution:4 | neutral:35, active:6, suppressed:4 | calm:28, slight:16, breezy:1 | cold_slow_or_front:16, stable_pleasant_high_confidence:16, warming_search:6, unclassified:4, calm_low_light_surface:2 | clear:23, stained:22 | Jun:10, Sep:10, Aug:7, Jul:6<br>summer:23, fall:16, spring:6 | clear_subtle:14, none:14, calm_surface:10, cold_slow:10, warming_search:6, low_light_surface:4 |
| Large Walking Bait<br>large_pike_topwater | lure | 16 | 16/3360 (0.5%) | 16/1680 (1%) | 1/840 (0.1%) | 15/840 (1.8%) | 0/16 | 102/840 (12.1%) | 28 | 57.1% | big_fish:15, all_purpose:1 | open:16 | neutral:13, active:3 | calm:16 | stable_pleasant_high_confidence:6, calm_low_light_surface:4, cold_slow_or_front:3, warming_search:3 | clear:6, dirty:5, stained:5 | Jun:13, Jul:3<br>summer:16 | calm_surface:16, clear_subtle:5, low_light_surface:4, warming_search:3 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 0 | 0/3360 (0%) | 0/1680 (0%) | 0/840 (0%) | 0/840 (0%) | 0/0 | 108/840 (12.9%) | 29 | 0% |  |  |  |  |  |  |  |  |

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
| Topwater flies | Bass Popper<br>popper_fly | 0 | 0/42 (0%) |
| Topwater flies | Deer Hair Slider<br>deer_hair_slider | 24 | 24/42 (57.1%) |
| Topwater flies | Foam Gurgler<br>foam_gurgler_fly | 1 | 1/42 (2.4%) |
| Topwater flies | Frog Popper<br>frog_fly | 17 | 17/42 (40.5%) |
| Topwater flies | Mouse Pattern<br>mouse_fly | 0 | 0/42 (0%) |

## Topwater Context Audit

| Species | Goal | Gear | Activity | Surface gate | Wind bucket | Rows | Topwater selections | Side-share in context | Scenario tags | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pike_musky | all_purpose | lure | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | all_purpose | lure | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | all_purpose | lure | neutral | closed | calm | 84 | 0 | 0/168 (0%) | cold_slow:36, clear_subtle:28 |  |
| pike_musky | all_purpose | lure | neutral | closed | slight | 60 | 0 | 0/120 (0%) | cold_slow:24, dirty_vibration:8, clear_subtle:6 |  |
| pike_musky | all_purpose | lure | neutral | closed | breezy | 102 | 0 | 0/204 (0%) | wind_reaction:102, dirty_vibration:68, cold_slow:36, clear_subtle:2 |  |
| pike_musky | all_purpose | lure | neutral | closed | windy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24 |  |
| pike_musky | all_purpose | lure | neutral | open | calm | 30 | 1 | 1/60 (1.7%) | calm_surface:30, clear_subtle:10, low_light_surface:6 | large_pike_topwater:1 |
| pike_musky | all_purpose | lure | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, clear_subtle:2 |  |
| pike_musky | all_purpose | lure | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | cold_slow:6 |  |
| pike_musky | all_purpose | lure | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24 |  |
| pike_musky | all_purpose | lure | suppressed | closed | windy | 12 | 0 | 0/24 (0%) | cold_slow:12 |  |
| pike_musky | all_purpose | fly | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | all_purpose | fly | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | all_purpose | fly | active | open | calm | 6 | 4 | 4/12 (33.3%) | calm_surface:6 | popper_fly:3, deer_hair_slider:1 |
| pike_musky | all_purpose | fly | neutral | closed | calm | 84 | 0 | 0/168 (0%) | cold_slow:36, clear_subtle:28 |  |
| pike_musky | all_purpose | fly | neutral | closed | slight | 60 | 0 | 0/120 (0%) | cold_slow:24, dirty_vibration:8, clear_subtle:6 |  |
| pike_musky | all_purpose | fly | neutral | closed | breezy | 102 | 0 | 0/204 (0%) | wind_reaction:102, dirty_vibration:68, cold_slow:36, clear_subtle:2 |  |
| pike_musky | all_purpose | fly | neutral | closed | windy | 48 | 0 | 0/96 (0%) | wind_reaction:48, dirty_vibration:32, cold_slow:24 |  |
| pike_musky | all_purpose | fly | neutral | caution | slight | 18 | 6 | 6/36 (16.7%) | low_light_surface:12 | popper_fly:4, foam_gurgler_fly:2 |
| pike_musky | all_purpose | fly | neutral | open | calm | 30 | 22 | 22/60 (36.7%) | calm_surface:30, clear_subtle:10, low_light_surface:6 | popper_fly:15, deer_hair_slider:4, foam_gurgler_fly:3 |
| pike_musky | all_purpose | fly | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, clear_subtle:2 |  |
| pike_musky | all_purpose | fly | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | cold_slow:6 |  |
| pike_musky | all_purpose | fly | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24 |  |
| pike_musky | all_purpose | fly | suppressed | closed | windy | 12 | 0 | 0/24 (0%) | cold_slow:12 |  |
| pike_musky | big_fish | lure | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | big_fish | lure | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | big_fish | lure | active | open | calm | 6 | 3 | 3/12 (25%) | calm_surface:6 | large_pike_topwater:3 |
| pike_musky | big_fish | lure | neutral | closed | calm | 84 | 0 | 0/168 (0%) | cold_slow:36, clear_subtle:28 |  |
| pike_musky | big_fish | lure | neutral | closed | slight | 60 | 0 | 0/120 (0%) | cold_slow:24, dirty_vibration:8, clear_subtle:6 |  |
| pike_musky | big_fish | lure | neutral | closed | breezy | 102 | 0 | 0/204 (0%) | wind_reaction:102, dirty_vibration:68, cold_slow:36, clear_subtle:2 |  |
| pike_musky | big_fish | lure | neutral | closed | windy | 42 | 0 | 0/84 (0%) | wind_reaction:42, dirty_vibration:28, cold_slow:24 |  |
| pike_musky | big_fish | lure | neutral | open | calm | 30 | 12 | 12/60 (20%) | calm_surface:30, clear_subtle:10, low_light_surface:6 | large_pike_topwater:12 |
| pike_musky | big_fish | lure | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, clear_subtle:2 |  |
| pike_musky | big_fish | lure | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | cold_slow:6 |  |
| pike_musky | big_fish | lure | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24 |  |
| pike_musky | big_fish | lure | suppressed | closed | windy | 12 | 0 | 0/24 (0%) | cold_slow:12 |  |
| pike_musky | big_fish | fly | active | closed | calm | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | big_fish | fly | active | closed | slight | 6 | 0 | 0/12 (0%) |  |  |
| pike_musky | big_fish | fly | active | open | calm | 6 | 6 | 6/12 (50%) | calm_surface:6 | deer_hair_slider:3, frog_fly:3 |
| pike_musky | big_fish | fly | neutral | closed | calm | 84 | 0 | 0/168 (0%) | cold_slow:36, clear_subtle:28 |  |
| pike_musky | big_fish | fly | neutral | closed | slight | 60 | 0 | 0/120 (0%) | cold_slow:24, dirty_vibration:8, clear_subtle:6 |  |
| pike_musky | big_fish | fly | neutral | closed | breezy | 102 | 0 | 0/204 (0%) | wind_reaction:102, dirty_vibration:68, cold_slow:36, clear_subtle:2 |  |
| pike_musky | big_fish | fly | neutral | closed | windy | 42 | 0 | 0/84 (0%) | wind_reaction:42, dirty_vibration:28, cold_slow:24 |  |
| pike_musky | big_fish | fly | neutral | caution | slight | 18 | 10 | 10/36 (27.8%) | low_light_surface:12 | deer_hair_slider:6, frog_fly:4 |
| pike_musky | big_fish | fly | neutral | open | calm | 30 | 26 | 26/60 (43.3%) | calm_surface:30, clear_subtle:10, low_light_surface:6 | deer_hair_slider:15, frog_fly:10, foam_gurgler_fly:1 |
| pike_musky | big_fish | fly | suppressed | closed | calm | 6 | 0 | 0/12 (0%) | cold_slow:6, clear_subtle:2 |  |
| pike_musky | big_fish | fly | suppressed | closed | slight | 12 | 0 | 0/24 (0%) | cold_slow:6 |  |
| pike_musky | big_fish | fly | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24 |  |
| pike_musky | big_fish | fly | suppressed | closed | windy | 12 | 0 | 0/24 (0%) | cold_slow:12 |  |

## Topwater Eligibility Rate Audit

| Species | Goal | Slice | Rows | Eligible rows | Global topwater all-slot share | Eligible topwater all-slot share | Eligible lure-side topwater share | Eligible fly-side topwater share | Closed surface | Suppressed surface | High-wind surface | Heat/no-light surface | Slight wind-reaction score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pike_musky | all_purpose | all | 420 | 60 | 33/1680 (2%) | 33/240 (13.8%) | 1/120 (0.8%) | 32/120 (26.7%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | activity:active | 18 | 6 | 4/72 (5.6%) | 4/24 (16.7%) | 0/12 (0%) | 4/12 (33.3%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | activity:neutral | 348 | 54 | 29/1392 (2.1%) | 29/216 (13.4%) | 1/108 (0.9%) | 28/108 (25.9%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | activity:suppressed | 54 | 0 | 0/216 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | surface_gate:open | 36 | 36 | 27/144 (18.8%) | 27/144 (18.8%) | 1/72 (1.4%) | 26/72 (36.1%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | surface_gate:caution | 24 | 24 | 6/96 (6.3%) | 6/96 (6.3%) | 0/48 (0%) | 6/48 (12.5%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | surface_gate:closed | 360 | 0 | 0/1440 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | wind:calm | 132 | 36 | 27/528 (5.1%) | 27/144 (18.8%) | 1/72 (1.4%) | 26/72 (36.1%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | wind:slight | 96 | 18 | 6/384 (1.6%) | 6/72 (8.3%) | 0/36 (0%) | 6/36 (16.7%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | wind:breezy | 132 | 6 | 0/528 (0%) | 0/24 (0%) | 0/12 (0%) | 0/12 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | all_purpose | wind:windy | 60 | 0 | 0/240 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | all | 420 | 66 | 57/1680 (3.4%) | 57/264 (21.6%) | 15/132 (11.4%) | 42/132 (31.8%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | activity:active | 18 | 6 | 9/72 (12.5%) | 9/24 (37.5%) | 3/12 (25%) | 6/12 (50%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | activity:neutral | 348 | 60 | 48/1392 (3.4%) | 48/240 (20%) | 12/120 (10%) | 36/120 (30%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | activity:suppressed | 54 | 0 | 0/216 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | surface_gate:open | 36 | 36 | 47/144 (32.6%) | 47/144 (32.6%) | 15/72 (20.8%) | 32/72 (44.4%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | surface_gate:caution | 30 | 30 | 10/120 (8.3%) | 10/120 (8.3%) | 0/60 (0%) | 10/60 (16.7%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | surface_gate:closed | 354 | 0 | 0/1416 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | wind:calm | 132 | 36 | 47/528 (8.9%) | 47/144 (32.6%) | 15/72 (20.8%) | 32/72 (44.4%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | wind:slight | 96 | 18 | 10/384 (2.6%) | 10/72 (13.9%) | 0/36 (0%) | 10/36 (27.8%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | wind:breezy | 132 | 6 | 0/528 (0%) | 0/24 (0%) | 0/12 (0%) | 0/12 (0%) | 0 | 0 | 0 | 0 | 0 |
| pike_musky | big_fish | wind:windy | 60 | 6 | 0/240 (0%) | 0/24 (0%) | 0/12 (0%) | 0/12 (0%) | 0 | 0 | 0 | 0 | 0 |

## Wind-Reaction Tag Audit

Selected rows with condition_tag:wind_reaction scoring in slight wind: 0.

| Profile | Gear | Selected | Calm | Slight | Breezy | Windy | Selected with wind score | Slight wind-score rows | Questionable? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 45 | 14 | 8 | 12 | 11 | 20 | 0 |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 16 | 1 | 9 | 6 | 0 | 6 | 0 | watch: context-sensitive fly wind tag |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234 | 74 | 41 | 65 | 54 | 85 | 0 |  |
| Conehead Streamer<br>conehead_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Deceiver<br>deceiver | fly | 162 | 31 | 23 | 81 | 27 | 104 | 0 |  |
| Flash Fly<br>pike_flash_fly | fly | 209 | 55 | 53 | 58 | 43 | 94 | 0 |  |
| Zonker Streamer<br>zonker_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Bladed Jig<br>bladed_jig | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Buzzbait<br>buzzbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Casting Spoon<br>casting_spoon | lure | 131 | 43 | 32 | 40 | 16 | 40 | 0 |  |
| Inline Spinner<br>inline_spinner | lure | 85 | 45 | 24 | 12 | 4 | 13 | 0 |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186 | 4 | 23 | 111 | 48 | 152 | 0 |  |
| Large Jerkbait<br>pike_jerkbait | lure | 126 | 32 | 16 | 56 | 22 | 52 | 0 |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196 | 77 | 56 | 34 | 29 | 55 | 0 |  |
| Spinnerbait<br>spinnerbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Weedless Spoon<br>weedless_spoon | lure | 165 | 67 | 30 | 42 | 26 | 68 | 0 |  |

## Bass Staple Watch List

Not applicable.

## Bass Macro-Family Utilization Diagnostics

Not applicable.

## Wind Bucket Diagnostics

| Wind bucket | Goal | Rows | Share | Surface picks | Wind-reaction rows |
| --- | --- | --- | --- | --- | --- |
| calm | all | 264 | 31.4% | 74 | 0 |
| calm | all_purpose | 132 | 15.7% | 27 | 0 |
| calm | big_fish | 132 | 15.7% | 47 | 0 |
| slight | all | 192 | 22.9% | 16 | 0 |
| slight | all_purpose | 96 | 11.4% | 6 | 0 |
| slight | big_fish | 96 | 11.4% | 10 | 0 |
| breezy | all | 264 | 31.4% | 0 | 216 |
| breezy | all_purpose | 132 | 15.7% | 0 | 108 |
| breezy | big_fish | 132 | 15.7% | 0 | 108 |
| windy | all | 120 | 14.3% | 0 | 96 |
| windy | all_purpose | 60 | 7.1% | 0 | 48 |
| windy | big_fish | 60 | 7.1% | 0 | 48 |
| unknown | all | 0 | 0% | 0 | 0 |
| unknown | all_purpose | 0 | 0% | 0 | 0 |
| unknown | big_fish | 0 | 0% | 0 | 0 |

## Surface Gate by Goal and Wind Bucket

| Goal | Wind bucket | Surface gate | Rows | Selected surface picks |
| --- | --- | --- | --- | --- |
| all_purpose | calm | closed | 96 | 0 |
| all_purpose | calm | open | 36 | 27 |
| all_purpose | slight | closed | 78 | 0 |
| all_purpose | slight | caution | 18 | 6 |
| all_purpose | breezy | closed | 126 | 0 |
| all_purpose | breezy | caution | 6 | 0 |
| all_purpose | windy | closed | 60 | 0 |
| big_fish | calm | closed | 96 | 0 |
| big_fish | calm | open | 36 | 47 |
| big_fish | slight | closed | 78 | 0 |
| big_fish | slight | caution | 18 | 10 |
| big_fish | breezy | closed | 126 | 0 |
| big_fish | breezy | caution | 6 | 0 |
| big_fish | windy | closed | 54 | 0 |
| big_fish | windy | caution | 6 | 0 |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 108 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:18, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:18, all_purpose / dirty / freshwater_lake_pond / cold_slow_or_front:10, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:10 | Large Tube Jig (top), Casting Spoon (honorable):20, Large Tube Jig (top), Large Jerkbait (honorable):17, Blade Bait (top), Large Jerkbait (honorable):12, Heavy Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):10 |

## Low-Use Eligible Profiles

None.

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Large Tube Jig<br>large_pike_tube | lure | 88/168 | 52.4% | big_fish:46, all_purpose:42 | cold_slow:82, wind_reaction:50, open_water_search:36, dirty_vibration:32, clear_subtle:6 |
| Weedless Spoon<br>weedless_spoon | lure | 165/360 | 45.8% | big_fish:99, all_purpose:66 | wind_reaction:68, none:53, dirty_vibration:44, open_water_search:42, calm_surface:25 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350/840 | 41.7% | big_fish:188, all_purpose:162 | cold_slow:253, wind_reaction:140, dirty_vibration:105, open_water_search:96, none:40 |
| Flash Fly<br>pike_flash_fly | fly | 209/540 | 38.7% | big_fish:127, all_purpose:82 | wind_reaction:94, dirty_vibration:68, open_water_search:54, cold_slow:46, none:39 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234/840 | 27.9% | big_fish:138, all_purpose:96 | cold_slow:149, wind_reaction:85, dirty_vibration:52, open_water_search:43, none:33 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196/732 | 26.8% | all_purpose:100, big_fish:96 | dirty_vibration:61, wind_reaction:55, cold_slow:53, none:42, open_water_search:29 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221/840 | 26.3% | big_fish:164, all_purpose:57 | cold_slow:112, dirty_vibration:76, wind_reaction:75, open_water_search:41, warming_search:36 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159/624 | 25.5% | all_purpose:119, big_fish:40 | wind_reaction:60, open_water_search:49, dirty_vibration:46, warming_search:46, cold_slow:27 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Large Tube Jig<br>large_pike_tube | lure | home-window >30% severe | 88/168 | 52.4% | selector_filtering_variety_jitter:73 | AP/BF 42/84, 46/84<br>clarity clear:56, dirty:56, stained:56<br>bucket cold_slow_or_front:100, breezy_windy_stained_reaction:32, dirty_vibration:32 |
| Weedless Spoon<br>weedless_spoon | lure | home-window >30% severe | 165/360 | 45.8% | seasonal_baseline:74 | AP/BF 66/180, 99/180<br>clarity clear:120, dirty:120, stained:120<br>bucket stable_pleasant_high_confidence:116, cold_slow_or_front:92, breezy_windy_stained_reaction:44 |
| Flash Fly<br>pike_flash_fly | fly | home-window >30% severe | 199/508 | 39.2% | seasonal_baseline:160 | AP/BF 80/254, 119/254<br>clarity dirty:180, clear:164, stained:164<br>bucket stable_pleasant_high_confidence:128, cold_slow_or_front:116, dirty_vibration:68 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | home-window >30% severe | 137/352 | 38.9% | daily_condition_tags:105 | AP/BF 69/176, 68/176<br>clarity dirty:244, stained:108<br>bucket dirty_vibration:96, breezy_windy_stained_reaction:88, cold_slow_or_front:64 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >30% severe | 266/728 | 36.5% | daily_condition_tags:210 | AP/BF 122/364, 144/364<br>clarity dirty:280, clear:224, stained:224<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 |
| Large Glide Bait<br>pike_glidebait | lure | home-window >25% overdominant | 33/110 | 30% | daily_condition_tags:37 | AP/BF 0/0, 33/110<br>clarity clear:52, stained:34, dirty:24<br>bucket cold_slow_or_front:40, stable_pleasant_high_confidence:30, warming_search:14 |
| Bunny Streamer<br>pike_bunny_streamer | fly | home-window >25% overdominant | 229/788 | 29.1% | goal_tags:245 | AP/BF 91/368, 138/420<br>clarity dirty:280, clear:254, stained:254<br>bucket cold_slow_or_front:312, stable_pleasant_high_confidence:122, dirty_vibration:112 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | home-window >25% overdominant | 209/736 | 28.4% | goal_tags:335 | AP/BF 55/368, 154/368<br>clarity dirty:280, clear:228, stained:228<br>bucket cold_slow_or_front:312, dirty_vibration:112, breezy_windy_stained_reaction:104 |
| Baitfish Slider<br>baitfish_slider_fly | fly | home-window >25% overdominant | 150/560 | 26.8% | goal_tags:261 | AP/BF 110/280, 40/280<br>clarity dirty:208, clear:176, stained:176<br>bucket cold_slow_or_front:132, stable_pleasant_high_confidence:132, warming_search:92 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | home-window >20% watch | 176/728 | 24.2% | goal_tags:226 | AP/BF 84/364, 92/364<br>clarity dirty:280, clear:224, stained:224<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 |
| Deceiver<br>deceiver | fly | home-window >20% watch | 154/728 | 21.2% | goal_tags:383 | AP/BF 153/364, 1/364<br>clarity dirty:280, clear:224, stained:224<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350/3360 (10.4%) | 52/1680 (3.1%) | 298/1680 (17.7%) | 350/1680 (20.8%) | 266/728 (36.5%) | 26/728 (3.6%) / 240/728 (33%) | fly side actual>20%<br>home>20%<br>home>25%<br>home>30% |
| Large Tube Jig<br>large_pike_tube | lure | 88/3360 (2.6%) | 73/1680 (4.3%) | 15/1680 (0.9%) | 88/1680 (5.2%) | 88/168 (52.4%) | 73/168 (43.5%) / 15/168 (8.9%) | home>20%<br>home>25%<br>home>30% |
| Weedless Spoon<br>weedless_spoon | lure | 165/3360 (4.9%) | 2/1680 (0.1%) | 163/1680 (9.7%) | 165/1680 (9.8%) | 165/360 (45.8%) | 2/360 (0.6%) / 163/360 (45.3%) | home>20%<br>home>25%<br>home>30% |
| Flash Fly<br>pike_flash_fly | fly | 209/3360 (6.2%) | 27/1680 (1.6%) | 182/1680 (10.8%) | 209/1680 (12.4%) | 199/508 (39.2%) | 25/508 (4.9%) / 174/508 (34.3%) | home>20%<br>home>25%<br>home>30% |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196/3360 (5.8%) | 185/1680 (11%) | 11/1680 (0.7%) | 196/1680 (11.7%) | 137/352 (38.9%) | 132/352 (37.5%) / 5/352 (1.4%) | home>20%<br>home>25%<br>home>30% |
| Large Glide Bait<br>pike_glidebait | lure | 45/3360 (1.3%) | 45/1680 (2.7%) | 0/1680 (0%) | 45/1680 (2.7%) | 33/110 (30%) | 33/110 (30%) / 0/110 (0%) | home>20%<br>home>25% |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234/3360 (7%) | 194/1680 (11.5%) | 40/1680 (2.4%) | 234/1680 (13.9%) | 229/788 (29.1%) | 191/788 (24.2%) / 38/788 (4.8%) | home>20%<br>home>25% |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221/3360 (6.6%) | 31/1680 (1.8%) | 190/1680 (11.3%) | 221/1680 (13.2%) | 209/736 (28.4%) | 31/736 (4.2%) / 178/736 (24.2%) | home>20%<br>home>25% |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159/3360 (4.7%) | 36/1680 (2.1%) | 123/1680 (7.3%) | 159/1680 (9.5%) | 150/560 (26.8%) | 32/560 (5.7%) / 118/560 (21.1%) | home>20%<br>home>25% |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186/3360 (5.5%) | 150/1680 (8.9%) | 36/1680 (2.1%) | 186/1680 (11.1%) | 176/728 (24.2%) | 144/728 (19.8%) / 32/728 (4.4%) | home>20% |
| Deceiver<br>deceiver | fly | 162/3360 (4.8%) | 126/1680 (7.5%) | 36/1680 (2.1%) | 162/1680 (9.6%) | 154/728 (21.2%) | 125/728 (17.2%) / 29/728 (4%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 2.14.
Average expanded finalist pool size: 2.94.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 1418.
Rows/slots with expanded finalist pool size 1: 756.
Selected-tier singleton slots expanded above 1: 662.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.32 | 3.52 | 1 | 1 | 326 | 87 |
| fly/top | 2.04 | 3.11 | 1 | 1 | 405 | 191 |
| lure/honorable | 2.11 | 2.64 | 1 | 1 | 380 | 256 |
| lure/top | 2.11 | 2.49 | 1 | 1 | 307 | 222 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1702 |
| goal_or_priority_condition | 1657 |
| credible_fallback | 1 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 2631 |
| goal_and_priority_condition | 1702 |
| credible_fallback | 142 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 390 |
| family_diversity_scarcity | 320 |
| surface_safety_scarcity | 46 |

Representative expanded singleton finalist pools:
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__A lure/honorable: blade_bait (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__A fly/top: rabbit_strip_leech (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B lure/top: blade_bait (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__all_purpose__B lure/honorable: deep_diving_crankbait (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__A lure/top: large_pike_tube (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__clear__big_fish__B fly/honorable: pike_bunny_streamer (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__A fly/top: rabbit_strip_leech (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B lure/top: blade_bait (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__all_purpose__B fly/top: pike_bunny_streamer (goal_or_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__A lure/honorable: large_pike_tube (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B lure/top: large_pike_tube (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B fly/top: pike_bunny_streamer (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__all_purpose__B lure/top: large_pike_tube (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__A lure/honorable: large_pike_tube (goal_and_priority_condition; family_diversity_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B lure/top: large_pike_tube (goal_and_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- mn_lake_of_woods_pike__2025-01-16__freshwater_lake_pond__dirty__big_fish__B fly/honorable: large_articulated_pike_streamer (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__B lure/honorable: casting_spoon (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_pike__2025-01-18__freshwater_lake_pond__clear__all_purpose__B fly/top: pike_bunny_streamer (goal_or_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 2.79 |
| Different-presentation close candidates | 1.30 |
| Different-family close candidates | 2.01 |
| Final expanded Set B pool | 1.90 |
| Same-family/same-presentation reintroduced | 50/1680 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 224 |
| Coverage pool used | 33 |
| Average used coverage pool size | 3.24 |
| Singleton used coverage pools | 0 |
| Broad pool larger than narrowed pool | 11 |
| Broad pool same as narrowed pool | 22 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 0 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 191 |
| broad | 33 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| large_bucktail_spinner | 31 |
| pike_jig_and_plastic | 28 |
| casting_spoon | 17 |
| pike_jerkbait | 17 |
| pike_spinnerbait | 14 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| casting_spoon | 14 |
| large_bucktail_spinner | 14 |
| pike_jerkbait | 4 |
| large_pike_tube | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

None.

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 2856 | 0 | 0 |
| caution | 216 | 16 | 27 |

Caution-gate selected surface examples:
- nd_devils_lake_pike__2025-06-14__freshwater_lake_pond__clear__big_fish__B: honorable_fly:frog_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__all_purpose__A: honorable_fly:foam_gurgler_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__big_fish__A: honorable_fly:deer_hair_slider
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__all_purpose__B: honorable_fly:popper_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__big_fish__A: honorable_fly:deer_hair_slider
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__all_purpose__B: honorable_fly:foam_gurgler_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__dirty__big_fish__A: honorable_fly:deer_hair_slider
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__clear__all_purpose__A: honorable_fly:popper_fly
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__clear__big_fish__A: honorable_fly:frog_fly
- wi_green_bay_pike__2025-07-24__freshwater_lake_pond__clear__big_fish__B: honorable_fly:deer_hair_slider

Caution-gate surface finalist examples:
- nd_devils_lake_pike__2025-06-14__freshwater_lake_pond__clear__all_purpose__A fly/honorable: popper_fly
- nd_devils_lake_pike__2025-06-14__freshwater_lake_pond__stained__all_purpose__A fly/honorable: popper_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__all_purpose__A fly/top: foam_gurgler_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__all_purpose__A fly/honorable: foam_gurgler_fly, popper_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__all_purpose__B fly/honorable: popper_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__big_fish__A fly/top: deer_hair_slider
- ny_st_lawrence_pike__2025-06-17__freshwater_river__clear__big_fish__A fly/honorable: deer_hair_slider
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__all_purpose__A fly/top: foam_gurgler_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__all_purpose__A fly/honorable: foam_gurgler_fly, popper_fly
- ny_st_lawrence_pike__2025-06-17__freshwater_river__stained__all_purpose__B fly/honorable: foam_gurgler_fly, popper_fly

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frog Popper<br>frog_fly | fly | largemouth_bass, northern_pike | fly_frog | surface_fly_frog_mouse | surface<br>slow/medium | 2: surface_prey, bluegill_perch | 3: clear, stained, dirty | 3: calm_surface, low_light_surface, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 10 |
| Large Tube Jig<br>large_pike_tube | lure | northern_pike | pike_tube | pike_tube | bottom<br>slow/medium | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: cold_slow, current_swing, cover_ambush | 2: big_fish_upside, reliable_action | freshwater_lake_pond, freshwater_river | false | 10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | northern_pike | large_spinner | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: clear, stained | 3: wind_reaction, dirty_vibration, open_water_search | 2: big_fish_upside, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | northern_pike | pike_swimbait | swimbait | mid<br>medium/slow | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: open_water_search, cover_ambush, warming_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 9 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | northern_pike | pike_spinnerbait | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 9 |
| Weedless Spoon<br>weedless_spoon | lure | northern_pike | spoon | blade_spoon | upper<br>medium/slow | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: cover_ambush, wind_reaction | 2: reliable_action, big_fish_upside | freshwater_lake_pond | false | 9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Bass Popper<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Bunny Streamer<br>pike_bunny_streamer | fly | northern_pike | streamer_pike_large | pike_bunny_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, cover_ambush, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Flash Fly<br>pike_flash_fly | fly | northern_pike | pike_flash_fly | pike_flash_fly | upper<br>medium/fast | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 2: big_fish_upside, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 3: cold_slow, open_water_search, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Casting Spoon<br>casting_spoon | lure | northern_pike, trout | spoon | blade_spoon | mid<br>medium | 1: baitfish | 2: clear, stained | 4: open_water_search, wind_reaction, cold_slow, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Large Glide Bait<br>pike_glidebait | lure | northern_pike | pike_glidebait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 2: open_water_search, clear_subtle | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Large Walking Bait<br>large_pike_topwater | lure | northern_pike | large_pike_surface | topwater_open | surface<br>medium/slow | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | northern_pike | pike_jig | pike_jig | bottom<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: cold_slow, dirty_vibration | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Large Jerkbait<br>pike_jerkbait | lure | northern_pike | pike_jerkbait | jerkbait | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Shallow Twitchbait<br>shallow_minnowbait | lure | northern_pike | pike_minnowbait | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: open_water_search, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | northern_pike | streamer_pike_large | big_articulated_streamer | mid<br>slow/medium | 1: baitfish | 2: stained, dirty | 2: wind_reaction, cover_ambush | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 6 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 160/840 | 144/728 | goal_tags>1<br>versatile_search+big_fish_upside |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 159/624 | 150/560 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Bass Popper<br>popper_fly | fly | 8 | 22/126 | 18/72 | goal_tags>1 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 8 | 234/840 | 229/788 | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 20/108 | 4/20 | goal_tags>1 |
| Deceiver<br>deceiver | fly | 7 | 162/840 | 154/728 | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 29/126 | 23/72 | clear+stained+dirty clarity |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 18/108 | 18/108 | goal_tags>1 |
| Flash Fly<br>pike_flash_fly | fly | 8 | 209/540 | 199/508 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 6/24 | 4/12 | clear+stained+dirty clarity<br>goal_tags>1 |
| Frog Popper<br>frog_fly | fly | 10 | 17/102 | 13/60 | clear+stained+dirty clarity<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Game Changer<br>game_changer | fly | 7 | 164/840 | 145/728 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 350/840 | 266/728 | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Blade Bait<br>blade_bait | lure | 8 | 181/840 | 0/0 | clear+stained+dirty clarity |
| Casting Spoon<br>casting_spoon | lure | 8 | 131/840 | 123/776 | condition_tags>3 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 0/108 | 0/32 | clear+stained+dirty clarity |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 7 | 221/840 | 209/736 | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Inline Spinner<br>inline_spinner | lure | 8 | 85/624 | 47/432 | goal_tags>1 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 186/840 | 176/728 | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>home-window share>20% |
| Large Glide Bait<br>pike_glidebait | lure | 8 | 45/432 | 33/110 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 9 | 80/840 | 80/784 | clear+stained+dirty clarity |
| Large Tube Jig<br>large_pike_tube | lure | 10 | 88/168 | 88/168 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Walking Bait<br>large_pike_topwater | lure | 8 | 16/102 | 16/60 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 9 | 196/732 | 137/352 | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 7 | 160/732 | 0/0 | goal_tags>1<br>open_water+warming+versatile |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 165/360 | 165/360 | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 350/840 (41.7%) | 266/728 (36.5%) | big_fish:188, all_purpose:162 | honorable:298, top:52 | cold_slow:253, wind_reaction:140, dirty_vibration:105, open_water_search:96, none:40 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 8 | 234/840 (27.9%) | 229/788 (29.1%) | big_fish:138, all_purpose:96 | top:194, honorable:40 | cold_slow:149, wind_reaction:85, dirty_vibration:52, open_water_search:43, none:33 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 7 | 221/840 (26.3%) | 209/736 (28.4%) | big_fish:164, all_purpose:57 | honorable:190, top:31 | cold_slow:112, dirty_vibration:76, wind_reaction:75, open_water_search:41, warming_search:36 |
| Flash Fly<br>pike_flash_fly | fly | 8 | 209/540 (38.7%) | 199/508 (39.2%) | big_fish:127, all_purpose:82 | honorable:182, top:27 | wind_reaction:94, dirty_vibration:68, open_water_search:54, cold_slow:46, none:39 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 9 | 196/732 (26.8%) | 137/352 (38.9%) | all_purpose:100, big_fish:96 | top:185, honorable:11 | dirty_vibration:61, wind_reaction:55, cold_slow:53, none:42, open_water_search:29 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 9 | 186/840 (22.1%) | 176/728 (24.2%) | big_fish:101, all_purpose:85 | top:150, honorable:36 | wind_reaction:152, dirty_vibration:108, open_water_search:108, cold_slow:65, warming_search:20 |
| Blade Bait<br>blade_bait | lure | 8 | 181/840 (21.5%) | 0/0 | all_purpose:116, big_fish:65 | honorable:145, top:36 | cold_slow:117, wind_reaction:58, open_water_search:50, dirty_vibration:44, clear_subtle:29 |
| Weedless Spoon<br>weedless_spoon | lure | 9 | 165/360 (45.8%) | 165/360 (45.8%) | big_fish:99, all_purpose:66 | honorable:163, top:2 | wind_reaction:68, none:53, dirty_vibration:44, open_water_search:42, calm_surface:25 |
| Game Changer<br>game_changer | fly | 7 | 164/840 (19.5%) | 145/728 (19.9%) | big_fish:109, all_purpose:55 | top:138, honorable:26 | wind_reaction:46, cold_slow:45, open_water_search:44, warming_search:38, dirty_vibration:29 |
| Deceiver<br>deceiver | fly | 7 | 162/840 (19.3%) | 154/728 (21.2%) | all_purpose:161, big_fish:1 | top:126, honorable:36 | wind_reaction:104, open_water_search:78, dirty_vibration:68, cold_slow:43, warming_search:26 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 160/840 (19%) | 144/728 (19.8%) | big_fish:121, all_purpose:39 | top:131, honorable:29 | dirty_vibration:52, wind_reaction:52, cold_slow:51, open_water_search:39, warming_search:36 |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 7 | 160/732 (21.9%) | 0/0 | all_purpose:141, big_fish:19 | honorable:144, top:16 | wind_reaction:57, warming_search:48, open_water_search:47, dirty_vibration:28, none:28 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 159/624 (25.5%) | 150/560 (26.8%) | all_purpose:119, big_fish:40 | honorable:123, top:36 | wind_reaction:60, open_water_search:49, dirty_vibration:46, warming_search:46, cold_slow:27 |
| Casting Spoon<br>casting_spoon | lure | 8 | 131/840 (15.6%) | 123/776 (15.9%) | all_purpose:127, big_fish:4 | top:83, honorable:48 | cold_slow:82, wind_reaction:40, open_water_search:29, clear_subtle:23, dirty_vibration:22 |
| Large Jerkbait<br>pike_jerkbait | lure | 7 | 126/840 (15%) | 125/804 (15.5%) | big_fish:108, all_purpose:18 | top:78, honorable:48 | cold_slow:92, wind_reaction:52, open_water_search:38, dirty_vibration:27, clear_subtle:15 |
| Large Tube Jig<br>large_pike_tube | lure | 10 | 88/168 (52.4%) | 88/168 (52.4%) | big_fish:46, all_purpose:42 | top:73, honorable:15 | cold_slow:82, wind_reaction:50, open_water_search:36, dirty_vibration:32, clear_subtle:6 |
| Inline Spinner<br>inline_spinner | lure | 8 | 85/624 (13.6%) | 47/432 (10.9%) | all_purpose:85 | top:76, honorable:9 | clear_subtle:20, none:20, calm_surface:17, cold_slow:15, warming_search:15 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 9 | 80/840 (9.5%) | 80/784 (10.2%) | big_fish:78, all_purpose:2 | top:65, honorable:15 | warming_search:24, clear_subtle:19, cold_slow:16, none:15, calm_surface:14 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 7 | 69/624 (11.1%) | 57/560 (10.2%) | all_purpose:54, big_fish:15 | honorable:47, top:22 | clear_subtle:34, cold_slow:19, warming_search:14, wind_reaction:12, open_water_search:11 |
| Large Glide Bait<br>pike_glidebait | lure | 8 | 45/432 (10.4%) | 33/110 (30%) | big_fish:45 | top:45 | clear_subtle:14, none:14, calm_surface:10, cold_slow:10, warming_search:6 |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 6 | 45/840 (5.4%) | 45/788 (5.7%) | big_fish:42, all_purpose:3 | top:39, honorable:6 | wind_reaction:20, none:13, cold_slow:10, open_water_search:9, dirty_vibration:8 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 29/126 (23%) | 23/72 (31.9%) | big_fish:24, all_purpose:5 | honorable:17, top:12 | calm_surface:23, low_light_surface:10, warming_search:7, clear_subtle:5 |
| Bass Popper<br>popper_fly | fly | 8 | 22/126 (17.5%) | 18/72 (25%) | all_purpose:22 | honorable:12, top:10 | calm_surface:18, low_light_surface:7, warming_search:6, clear_subtle:5 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 20/108 (18.5%) | 4/20 (20%) | all_purpose:20 | top:16, honorable:4 | current_swing:9, cold_slow:7, dirty_vibration:6, clear_subtle:3, open_water_search:3 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 18/108 (16.7%) | 18/108 (16.7%) | big_fish:15, all_purpose:3 | top:18 | cold_slow:18, clear_subtle:2, wind_reaction:2, dirty_vibration:1 |
| Frog Popper<br>frog_fly | fly | 10 | 17/102 (16.7%) | 13/60 (21.7%) | big_fish:17 | honorable:16, top:1 | calm_surface:13, warming_search:6, low_light_surface:5, clear_subtle:4, none:1 |
| Large Walking Bait<br>large_pike_topwater | lure | 8 | 16/102 (15.7%) | 16/60 (26.7%) | big_fish:15, all_purpose:1 | honorable:16 | calm_surface:16, clear_subtle:5, low_light_surface:4, warming_search:3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 16/108 (14.8%) | 16/92 (17.4%) | all_purpose:14, big_fish:2 | top:15, honorable:1 | current_swing:11, dirty_vibration:8, open_water_search:6, wind_reaction:6, cold_slow:4 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 6/24 (25%) | 4/12 (33.3%) | all_purpose:5, big_fish:1 | honorable:3, top:3 | calm_surface:4, low_light_surface:2, clear_subtle:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 0/108 (0%) | 0/32 (0%) |  |  |  |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 350/840 (41.7%) | 266/728 (36.5%) | catalog_tag_stack<br>goal_tag_pressure | goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Bunny Streamer<br>pike_bunny_streamer | fly | 234/840 (27.9%) | 229/788 (29.1%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 221/840 (26.3%) | 209/736 (28.4%) | catalog_tag_stack<br>goal_tag_pressure | combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant |
| Flash Fly<br>pike_flash_fly | fly | 209/540 (38.7%) | 199/508 (39.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 196/732 (26.8%) | 137/352 (38.9%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 186/840 (22.1%) | 176/728 (24.2%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>wind+dirty+big_fish_upside<br>wind+dirty+versatile_search<br>home-window share>20% |
| Blade Bait<br>blade_bait | lure | 181/840 (21.5%) | 0/0 | catalog_tag_stack<br>condition_tag_stack | clear+stained+dirty clarity |
| Weedless Spoon<br>weedless_spoon | lure | 165/360 (45.8%) | 165/360 (45.8%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Deceiver<br>deceiver | fly | 162/840 (19.3%) | 154/728 (21.2%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Shallow Twitchbait<br>shallow_minnowbait | lure | 160/732 (21.9%) | 0/0 | catalog_tag_stack | goal_tags>1<br>open_water+warming+versatile |
| Baitfish Slider<br>baitfish_slider_fly | fly | 159/624 (25.5%) | 150/560 (26.8%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Large Tube Jig<br>large_pike_tube | lure | 88/168 (52.4%) | 88/168 (52.4%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>reliable_action+big_fish_upside<br>combined all-slot share>25%<br>broad per-slot share>20%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Large Glide Bait<br>pike_glidebait | lure | 45/432 (10.4%) | 33/110 (30%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Casting Spoon<br>casting_spoon | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 4: open_water_search, wind_reaction, cold_slow, current_swing<br>goal 1: versatile_search | 776 | 123/776 (15.9%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):57, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):47, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):46 | healthy / not underused |
| Weedless Spoon<br>weedless_spoon | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 2: cover_ambush, wind_reaction<br>goal 2: reliable_action, big_fish_upside | 360 | 165/360 (45.8%) | Inline Spinner (top), Shallow Twitchbait (honorable):32, Casting Spoon (top), Blade Bait (honorable):16, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):16, Casting Spoon (top), Shallow Twitchbait (honorable):13 | healthy / not underused |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 432 | 47/432 (10.9%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):45, Large Bucktail Spinner (top), Weedless Spoon (honorable):35, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):34, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):33 | selector/direct-score or overpowered competitors |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 3: wind_reaction, dirty_vibration, open_water_search<br>goal 2: big_fish_upside, versatile_search | 728 | 176/728 (24.2%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):67, Inline Spinner (top), Shallow Twitchbait (honorable):41, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):39, Oversized Spinnerbait (top), Shallow Twitchbait (honorable):30 | healthy / not underused |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, dirty_vibration, cover_ambush<br>goal 2: reliable_action, big_fish_upside | 352 | 137/352 (38.9%) | Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):34, Large Bucktail Spinner (top), Weedless Spoon (honorable):29, Large Bucktail Spinner (top), Shallow Twitchbait (honorable):15, Large Jerkbait (top), Blade Bait (honorable):15 | healthy / not underused |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: open_water_search, cover_ambush, warming_search<br>goal 1: big_fish_upside | 784 | 80/784 (10.2%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):67, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):49, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):42 | selector/direct-score or overpowered competitors |
| Large Jerkbait<br>pike_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, cold_slow<br>goal 1: big_fish_upside | 804 | 125/804 (15.5%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):59, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):47, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):46 | healthy / not underused |
| Large Glide Bait<br>pike_glidebait | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: clear, stained<br>condition 2: open_water_search, clear_subtle<br>goal 2: big_fish_upside, high_risk_high_reward | 110 | 33/110 (30%) | Large Paddle-Tail Swimbait (top), Weedless Spoon (honorable):12, Large Paddle-Tail Swimbait (top), Heavy Paddle-Tail Swimbait (honorable):10, Oversized Spinnerbait (top), Weedless Spoon (honorable):10, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):9 | healthy / not underused |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 2: cold_slow, dirty_vibration<br>goal 1: big_fish_upside | 736 | 209/736 (28.4%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):51, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Oversized Spinnerbait (top), Blade Bait (honorable):31, Casting Spoon (top), Blade Bait (honorable):29 | healthy / not underused |
| Large Tube Jig<br>large_pike_tube | lure | forage 2: baitfish, bluegill_perch<br>clarity 3: clear, stained, dirty<br>condition 3: cold_slow, current_swing, cover_ambush<br>goal 2: big_fish_upside, reliable_action | 168 | 88/168 (52.4%) | Blade Bait (top), Large Jerkbait (honorable):12, Heavy Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):12, Blade Bait (top), Casting Spoon (honorable):10, Heavy Paddle-Tail Swimbait (top), Large Jerkbait (honorable):9 | healthy / not underused |
| Large Walking Bait<br>large_pike_topwater | lure | forage 2: surface_prey, baitfish<br>clarity 2: clear, stained<br>condition 2: calm_surface, low_light_surface<br>goal 2: big_fish_upside, high_risk_high_reward | 60 | 16/60 (26.7%) | Oversized Spinnerbait (top), Weedless Spoon (honorable):15, Large Paddle-Tail Swimbait (top), Weedless Spoon (honorable):9, Inline Spinner (top), Shallow Twitchbait (honorable):8, Shallow Twitchbait (top), Inline Spinner (honorable):4 | healthy / not underused |
| Bunny Streamer<br>pike_bunny_streamer | fly | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 3: wind_reaction, cover_ambush, cold_slow<br>goal 1: big_fish_upside | 788 | 229/788 (29.1%) | Articulated Baitfish (top), Rabbit-Strip Leech (honorable):57, Game Changer (top), Flash Fly (honorable):42, Deceiver (top), Rabbit-Strip Leech (honorable):41, Articulated Baitfish (top), Flash Fly (honorable):39 | healthy / not underused |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, cover_ambush<br>goal 1: big_fish_upside | 788 | 45/788 (5.7%) | Bunny Streamer (top), Rabbit-Strip Leech (honorable):109, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):57, Bunny Streamer (top), Flash Fly (honorable):44, Game Changer (top), Flash Fly (honorable):42 | selector/direct-score or overpowered competitors |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: open_water_search, runoff_streamer<br>goal 2: versatile_search, big_fish_upside | 728 | 144/728 (19.8%) | Bunny Streamer (top), Rabbit-Strip Leech (honorable):76, Bunny Streamer (top), Flash Fly (honorable):41, Deceiver (top), Rabbit-Strip Leech (honorable):40, Game Changer (top), Flash Fly (honorable):40 | healthy / not underused |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: current_swing, open_water_search, wind_reaction<br>goal 1: versatile_search | 92 | 16/92 (17.4%) | Articulated Baitfish (top), Flash Fly (honorable):8, Game Changer (top), Flash Fly (honorable):7, Clouser Minnow (top), Baitfish Slider (honorable):5, Game Changer (top), Rabbit-Strip Leech (honorable):5 | healthy / not underused |
| Deceiver<br>deceiver | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 728 | 154/728 (21.2%) | Bunny Streamer (top), Rabbit-Strip Leech (honorable):76, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):50, Bunny Streamer (top), Flash Fly (honorable):41, Game Changer (top), Flash Fly (honorable):40 | healthy / not underused |
| Flash Fly<br>pike_flash_fly | fly | forage 1: baitfish<br>clarity 3: clear, stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 2: big_fish_upside, versatile_search | 508 | 199/508 (39.2%) | Deceiver (top), Baitfish Slider (honorable):26, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):22, Bunny Streamer (top), Baitfish Slider (honorable):21, Game Changer (top), Baitfish Slider (honorable):21 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Flash Fly (pike_flash_fly), Large Bucktail Spinner (large_bucktail_spinner), Large Glide Bait (pike_glidebait), Large Tube Jig (large_pike_tube), Oversized Spinnerbait (pike_spinnerbait), Rabbit-Strip Leech (rabbit_strip_leech), Shallow Twitchbait (shallow_minnowbait), Weedless Spoon (weedless_spoon)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Baitfish Slider (baitfish_slider_fly), Blade Bait (blade_bait), Bunny Streamer (pike_bunny_streamer), Deceiver (deceiver), Flash Fly (pike_flash_fly), Heavy Paddle-Tail Swimbait (pike_jig_and_plastic), Large Bucktail Spinner (large_bucktail_spinner), Large Glide Bait (pike_glidebait), Large Tube Jig (large_pike_tube), Oversized Spinnerbait (pike_spinnerbait), Rabbit-Strip Leech (rabbit_strip_leech), Shallow Twitchbait (shallow_minnowbait), Weedless Spoon (weedless_spoon)

### Probably selector problem, not catalog problem
Big Articulated Streamer (large_articulated_pike_streamer), Inline Spinner (inline_spinner), Large Paddle-Tail Swimbait (large_profile_pike_swimbait)

## Utilization Notes / Coverage Gaps

- 1 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.
- 8 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish, Deceiver, Game Changer, Unweighted Baitfish, Dungeon Streamer, Bucktail Streamer, Bass Popper, Deer Hair Slider, Frog Popper, Foam Gurgler, Large Jerkbait, Large Paddle-Tail Swimbait, Casting Spoon, Large Bucktail Spinner, Inline Spinner, Large Walking Bait |
| underused_home_window | Big Articulated Streamer |
| no_home_window_coverage | None |
| over-dominant | Bunny Streamer, Rabbit-Strip Leech, Baitfish Slider, Flash Fly, Heavy Paddle-Tail Swimbait, Weedless Spoon, Oversized Spinnerbait, Large Tube Jig, Large Glide Bait |
| probably okay niche profile | None |

## Pike Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 2.7% | 45/840 | 45/788 | 45 | 45 | 5.7% | 3/368 | 42/420 | 188 | underused_home_window | activity neutral:644, suppressed:108, active:36<br>clarity dirty:280, clear:254, stained:254<br>water freshwater_lake_pond:692, freshwater_river:96<br>bucket cold_slow_or_front:312, stable_pleasant_high_confidence:122, dirty_vibration:112 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):85, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):53, Bunny Streamer (top), Flash Fly (honorable):43 |
| Bunny Streamer<br>pike_bunny_streamer | fly | 13.9% | 234/840 | 229/788 | 234 | 229 | 29.1% | 91/368 | 138/420 | 373 | over-dominant | activity neutral:644, suppressed:108, active:36<br>clarity dirty:280, clear:254, stained:254<br>water freshwater_lake_pond:692, freshwater_river:96<br>bucket cold_slow_or_front:312, stable_pleasant_high_confidence:122, dirty_vibration:112 | Articulated Baitfish (top), Rabbit-Strip Leech (honorable):53, Game Changer (top), Flash Fly (honorable):41, Articulated Baitfish (top), Flash Fly (honorable):39 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 9.5% | 160/840 | 144/728 | 160 | 144 | 19.8% | 33/364 | 111/364 | 324 | healthy | activity neutral:640, suppressed:52, active:36<br>clarity dirty:280, clear:224, stained:224<br>water freshwater_lake_pond:636, freshwater_river:92<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):61, Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39 |
| Deceiver<br>deceiver | fly | 9.6% | 162/840 | 154/728 | 162 | 154 | 21.2% | 153/364 | 1/364 | 311 | healthy | activity neutral:640, suppressed:52, active:36<br>clarity dirty:280, clear:224, stained:224<br>water freshwater_lake_pond:636, freshwater_river:92<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):61, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):47, Bunny Streamer (top), Flash Fly (honorable):40 |
| Game Changer<br>game_changer | fly | 9.8% | 164/840 | 145/728 | 164 | 145 | 19.9% | 44/364 | 101/364 | 352 | healthy | activity neutral:640, suppressed:52, active:36<br>clarity dirty:280, clear:224, stained:224<br>water freshwater_lake_pond:636, freshwater_river:92<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):61, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):47, Bunny Streamer (top), Flash Fly (honorable):40 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 20.8% | 350/840 | 266/728 | 350 | 266 | 36.5% | 122/364 | 144/364 | 29 | over-dominant | activity neutral:640, suppressed:52, active:36<br>clarity dirty:280, clear:224, stained:224<br>water freshwater_lake_pond:636, freshwater_river:92<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 | Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39, Articulated Baitfish (top), Flash Fly (honorable):38 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 9.5% | 159/624 | 150/560 | 159 | 150 | 26.8% | 110/280 | 40/280 | 89 | over-dominant | activity neutral:500, active:36, suppressed:24<br>clarity dirty:208, clear:176, stained:176<br>water freshwater_lake_pond:480, freshwater_river:80<br>bucket cold_slow_or_front:132, stable_pleasant_high_confidence:132, warming_search:92 | Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39, Articulated Baitfish (top), Flash Fly (honorable):38 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 4.1% | 69/624 | 57/560 | 69 | 57 | 10.2% | 46/280 | 11/280 | 115 | healthy | activity neutral:500, active:36, suppressed:24<br>clarity dirty:208, clear:176, stained:176<br>water freshwater_lake_pond:480, freshwater_river:80<br>bucket cold_slow_or_front:132, stable_pleasant_high_confidence:132, warming_search:92 | Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39, Articulated Baitfish (top), Flash Fly (honorable):38 |
| Flash Fly<br>pike_flash_fly | fly | 12.4% | 209/540 | 199/508 | 209 | 199 | 39.2% | 80/254 | 119/254 | 159 | over-dominant | activity neutral:452, active:36, suppressed:20<br>clarity dirty:180, clear:164, stained:164<br>water freshwater_lake_pond:432, freshwater_river:76<br>bucket stable_pleasant_high_confidence:128, cold_slow_or_front:116, dirty_vibration:68 | Deceiver (top), Baitfish Slider (honorable):25, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):22, Bunny Streamer (top), Rabbit-Strip Leech (honorable):20 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 1.1% | 18/108 | 18/108 | 18 | 18 | 16.7% | 3/54 | 15/54 | 27 | healthy | activity neutral:72, suppressed:36<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:108<br>bucket cold_slow_or_front:76, breezy_windy_stained_reaction:16, dirty_vibration:16 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):27, Rabbit-Strip Leech (honorable), Bunny Streamer (top):18, Deceiver (top), Rabbit-Strip Leech (honorable):7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 1% | 16/108 | 16/92 | 16 | 16 | 17.4% | 14/46 | 2/46 | 42 | healthy | activity neutral:92<br>clarity dirty:36, clear:28, stained:28<br>water freshwater_river:92<br>bucket dirty_vibration:16, river_elevated_runoff_current:16, warming_search:16 | Articulated Baitfish (top), Flash Fly (honorable):8, Game Changer (top), Flash Fly (honorable):7, Clouser Minnow (top), Baitfish Slider (honorable):5 |
| Bass Popper<br>popper_fly | fly | 1.3% | 22/126 | 18/72 | 22 | 18 | 25% | 18/36 | 0/36 | 17 | healthy | activity neutral:60, active:12<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:60, freshwater_river:12<br>bucket stable_pleasant_high_confidence:36, calm_low_light_surface:12, cold_slow_or_front:12 | Deer Hair Slider (top), Bunny Streamer (honorable):4, Frog Popper (honorable), Bunny Streamer (top):4, Articulated Baitfish (top), Flash Fly (honorable):3 |
| Deer Hair Slider<br>deer_hair_slider | fly | 1.7% | 29/126 | 23/72 | 29 | 23 | 31.9% | 5/36 | 18/36 | 25 | healthy | activity neutral:60, active:12<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_lake_pond:60, freshwater_river:12<br>bucket stable_pleasant_high_confidence:36, calm_low_light_surface:12, cold_slow_or_front:12 | Frog Popper (honorable), Bunny Streamer (top):4, Articulated Baitfish (top), Flash Fly (honorable):3, Frog Popper (honorable), Game Changer (top):3 |
| Frog Popper<br>frog_fly | fly | 1% | 17/102 | 13/60 | 17 | 13 | 21.7% | 0/30 | 13/30 | 18 | healthy | activity neutral:48, active:12<br>clarity clear:20, dirty:20, stained:20<br>water freshwater_lake_pond:60<br>bucket stable_pleasant_high_confidence:24, calm_low_light_surface:12, cold_slow_or_front:12 | Deer Hair Slider (top), Bunny Streamer (honorable):4, Articulated Baitfish (honorable), Deer Hair Slider (top):2, Articulated Baitfish (top), Flash Fly (honorable):2 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 0.4% | 6/24 | 4/12 | 6 | 4 | 33.3% | 3/6 | 1/6 | 4 | healthy | activity neutral:12<br>clarity clear:4, dirty:4, stained:4<br>water freshwater_river:12<br>bucket stable_pleasant_high_confidence:12 | Articulated Baitfish (top), Flash Fly (honorable):1, Bass Popper (top), Bucktail Streamer (honorable):1, Bass Popper (top), Game Changer (honorable):1 |
| Large Jerkbait<br>pike_jerkbait | lure | 7.5% | 126/840 | 125/804 | 126 | 125 | 15.5% | 18/402 | 107/402 | 124 | healthy | activity neutral:660, suppressed:108, active:36<br>clarity dirty:280, clear:268, stained:256<br>water freshwater_lake_pond:712, freshwater_river:92<br>bucket cold_slow_or_front:312, stable_pleasant_high_confidence:132, dirty_vibration:112 | Oversized Spinnerbait (top), Weedless Spoon (honorable):59, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):46 |
| Large Paddle-Tail Swimbait<br>large_profile_pike_swimbait | lure | 4.8% | 80/840 | 80/784 | 80 | 80 | 10.2% | 2/364 | 78/420 | 185 | healthy | activity neutral:668, suppressed:80, active:36<br>clarity dirty:280, clear:252, stained:252<br>water freshwater_lake_pond:684, freshwater_river:100<br>bucket cold_slow_or_front:260, stable_pleasant_high_confidence:144, dirty_vibration:112 | Oversized Spinnerbait (top), Weedless Spoon (honorable):67, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):48, Large Bucktail Spinner (top), Weedless Spoon (honorable):48 |
| Casting Spoon<br>casting_spoon | lure | 7.8% | 131/840 | 123/776 | 131 | 123 | 15.9% | 119/388 | 4/388 | 215 | healthy | activity neutral:632, suppressed:108, active:36<br>clarity dirty:280, clear:248, stained:248<br>water freshwater_lake_pond:684, freshwater_river:92<br>bucket cold_slow_or_front:312, stable_pleasant_high_confidence:116, dirty_vibration:112 | Oversized Spinnerbait (top), Weedless Spoon (honorable):57, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):46 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 13.2% | 221/840 | 209/736 | 221 | 209 | 28.4% | 55/368 | 154/368 | 54 | over-dominant | activity neutral:592, suppressed:108, active:36<br>clarity dirty:280, clear:228, stained:228<br>water freshwater_lake_pond:652, freshwater_river:84<br>bucket cold_slow_or_front:312, dirty_vibration:112, breezy_windy_stained_reaction:104 | Oversized Spinnerbait (top), Weedless Spoon (honorable):51, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Oversized Spinnerbait (top), Blade Bait (honorable):31 |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 11.1% | 186/840 | 176/728 | 186 | 176 | 24.2% | 84/364 | 92/364 | 255 | healthy | activity neutral:640, suppressed:52, active:36<br>clarity dirty:280, clear:224, stained:224<br>water freshwater_lake_pond:636, freshwater_river:92<br>bucket cold_slow_or_front:208, stable_pleasant_high_confidence:140, dirty_vibration:112 | Oversized Spinnerbait (top), Weedless Spoon (honorable):67, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):39, Inline Spinner (top), Shallow Twitchbait (honorable):36 |
| Inline Spinner<br>inline_spinner | lure | 5.1% | 85/624 | 47/432 | 85 | 47 | 10.9% | 47/216 | 0/216 | 100 | healthy | activity neutral:380, active:36, suppressed:16<br>clarity dirty:208, clear:112, stained:112<br>water freshwater_lake_pond:368, freshwater_river:64<br>bucket warming_search:92, cold_slow_or_front:84, stable_pleasant_high_confidence:80 | Oversized Spinnerbait (top), Weedless Spoon (honorable):45, Large Bucktail Spinner (top), Weedless Spoon (honorable):35, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):33 |
| Weedless Spoon<br>weedless_spoon | lure | 9.8% | 165/360 | 165/360 | 165 | 165 | 45.8% | 66/180 | 99/180 | 74 | over-dominant | activity neutral:312, active:36, suppressed:12<br>clarity clear:120, dirty:120, stained:120<br>water freshwater_lake_pond:360<br>bucket stable_pleasant_high_confidence:116, cold_slow_or_front:92, breezy_windy_stained_reaction:44 | Inline Spinner (top), Shallow Twitchbait (honorable):29, Casting Spoon (top), Blade Bait (honorable):16, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):16 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 11.7% | 196/732 | 137/352 | 196 | 137 | 38.9% | 69/176 | 68/176 | 177 | over-dominant | activity neutral:304, active:24, suppressed:24<br>clarity dirty:244, stained:108<br>water freshwater_lake_pond:300, freshwater_river:52<br>bucket dirty_vibration:96, breezy_windy_stained_reaction:88, cold_slow_or_front:64 | Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):33, Large Bucktail Spinner (top), Weedless Spoon (honorable):29, Large Bucktail Spinner (top), Shallow Twitchbait (honorable):15 |
| Large Tube Jig<br>large_pike_tube | lure | 5.2% | 88/168 | 88/168 | 88 | 88 | 52.4% | 42/84 | 46/84 | 79 | over-dominant | activity neutral:120, suppressed:48<br>clarity clear:56, dirty:56, stained:56<br>water freshwater_lake_pond:156, freshwater_river:12<br>bucket cold_slow_or_front:100, breezy_windy_stained_reaction:32, dirty_vibration:32 | Blade Bait (top), Large Jerkbait (honorable):12, Blade Bait (top), Casting Spoon (honorable):10, Heavy Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):9 |
| Large Glide Bait<br>pike_glidebait | lure | 2.7% | 45/432 | 33/110 | 45 | 33 | 30% | 0/0 | 33/110 | 41 | over-dominant | activity neutral:92, active:12, suppressed:6<br>clarity clear:52, stained:34, dirty:24<br>water freshwater_lake_pond:110<br>bucket cold_slow_or_front:40, stable_pleasant_high_confidence:30, warming_search:14 | Large Paddle-Tail Swimbait (top), Weedless Spoon (honorable):12, Large Paddle-Tail Swimbait (top), Heavy Paddle-Tail Swimbait (honorable):10, Oversized Spinnerbait (top), Weedless Spoon (honorable):10 |
| Large Walking Bait<br>large_pike_topwater | lure | 1% | 16/102 | 16/60 | 16 | 16 | 26.7% | 1/30 | 15/30 | 12 | healthy | activity neutral:48, active:12<br>clarity clear:20, dirty:20, stained:20<br>water freshwater_lake_pond:60<br>bucket stable_pleasant_high_confidence:24, calm_low_light_surface:12, cold_slow_or_front:12 | Oversized Spinnerbait (top), Weedless Spoon (honorable):15, Large Paddle-Tail Swimbait (top), Weedless Spoon (honorable):9, Inline Spinner (top), Shallow Twitchbait (honorable):6 |

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
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 45/788 | 5.7% | 188 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:66, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:66, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | goal_tags:336, seasonal_baseline:163, daily_condition_tags:135, forage_clarity_stack:96 | Bunny Streamer (top), Rabbit-Strip Leech (honorable):85, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):53, Bunny Streamer (top), Flash Fly (honorable):43, Game Changer (top), Flash Fly (honorable):41 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bunny Streamer<br>pike_bunny_streamer | fly | 229/788 | 29.1% | 373 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:66, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:66, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | goal_tags:245, selector_filtering_variety_jitter:187, seasonal_baseline:89, forage_clarity_stack:26 | Articulated Baitfish (top), Rabbit-Strip Leech (honorable):53, Game Changer (top), Flash Fly (honorable):41, Articulated Baitfish (top), Flash Fly (honorable):39, Deceiver (top), Rabbit-Strip Leech (honorable):38 |
| Heavy Paddle-Tail Swimbait<br>pike_jig_and_plastic | lure | 209/736 | 28.4% | 54 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:66, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:66, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | goal_tags:335, daily_condition_tags:63, seasonal_baseline:57, forage_clarity_stack:34 | Oversized Spinnerbait (top), Weedless Spoon (honorable):51, Large Bucktail Spinner (top), Weedless Spoon (honorable):48, Oversized Spinnerbait (top), Blade Bait (honorable):31, Casting Spoon (top), Blade Bait (honorable):28 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 266/728 | 36.5% | 29 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48, big_fish / dirty / freshwater_lake_pond / dirty_vibration:48, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:48 | daily_condition_tags:210, forage_clarity_stack:202, goal_tags:41, selector_filtering_variety_jitter:9 | Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39, Articulated Baitfish (top), Flash Fly (honorable):38, Deceiver (top), Flash Fly (honorable):33 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 150/560 | 26.8% | 89 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:30, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:30, big_fish / dirty / freshwater_lake_pond / dirty_vibration:30, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:30 | goal_tags:261, daily_condition_tags:86, seasonal_baseline:35, selector_filtering_variety_jitter:28 | Bunny Streamer (top), Flash Fly (honorable):40, Game Changer (top), Flash Fly (honorable):39, Articulated Baitfish (top), Flash Fly (honorable):38, Deceiver (top), Flash Fly (honorable):33 |
| Flash Fly<br>pike_flash_fly | fly | 199/508 | 39.2% | 159 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:28, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28 | seasonal_baseline:160, daily_condition_tags:60, goal_tags:43, forage_clarity_stack:24 | Deceiver (top), Baitfish Slider (honorable):25, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):22, Bunny Streamer (top), Rabbit-Strip Leech (honorable):20, Game Changer (top), Baitfish Slider (honorable):20 |
| Weedless Spoon<br>weedless_spoon | lure | 165/360 | 45.8% | 74 | all_purpose / clear / freshwater_lake_pond / stable_pleasant_high_confidence:26, big_fish / clear / freshwater_lake_pond / stable_pleasant_high_confidence:26, all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:22, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:22 | seasonal_baseline:74, goal_tags:46, daily_condition_tags:44, selector_filtering_variety_jitter:31 | Inline Spinner (top), Shallow Twitchbait (honorable):29, Casting Spoon (top), Blade Bait (honorable):16, Oversized Spinnerbait (top), Heavy Paddle-Tail Swimbait (honorable):16, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):13 |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 137/352 | 38.9% | 177 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | daily_condition_tags:105, selector_filtering_variety_jitter:95, goal_tags:8, seasonal_baseline:7 | Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):33, Large Bucktail Spinner (top), Weedless Spoon (honorable):29, Large Bucktail Spinner (top), Shallow Twitchbait (honorable):15, Large Paddle-Tail Swimbait (top), Heavy Paddle-Tail Swimbait (honorable):15 |
| Large Tube Jig<br>large_pike_tube | lure | 88/168 | 52.4% | 79 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:24, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:24, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:14, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:14 | selector_filtering_variety_jitter:73, daily_condition_tags:7 | Blade Bait (top), Large Jerkbait (honorable):12, Blade Bait (top), Casting Spoon (honorable):10, Heavy Paddle-Tail Swimbait (top), Large Bucktail Spinner (honorable):9, Heavy Paddle-Tail Swimbait (top), Large Jerkbait (honorable):9 |
| Large Glide Bait<br>pike_glidebait | lure | 33/110 | 30% | 41 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:26, big_fish / clear / freshwater_lake_pond / stable_pleasant_high_confidence:14, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:10, big_fish / dirty / freshwater_lake_pond / dirty_vibration:8 | daily_condition_tags:37, selector_filtering_variety_jitter:24, forage_clarity_stack:14, seasonal_baseline:2 | Large Paddle-Tail Swimbait (top), Weedless Spoon (honorable):12, Large Paddle-Tail Swimbait (top), Heavy Paddle-Tail Swimbait (honorable):10, Oversized Spinnerbait (top), Weedless Spoon (honorable):10, Large Bucktail Spinner (top), Heavy Paddle-Tail Swimbait (honorable):9 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Inline Spinner [lure] (13), Oversized Spinnerbait [lure] (12), Bass Popper [fly] (10), Casting Spoon [lure] (7), Baitfish Slider [fly] (5) | Shallow Twitchbait [lure] (20), Bass Popper [fly] (18), Inline Spinner [lure] (17), Baitfish Slider [fly] (14), Oversized Spinnerbait [lure] (12) |
| calm_surface | big_fish | Large Paddle-Tail Swimbait [lure] (12), Oversized Spinnerbait [lure] (11), Large Glide Bait [lure] (10), Deer Hair Slider [fly] (9), Bunny Streamer [fly] (8) | Deer Hair Slider [fly] (18), Large Walking Bait [lure] (15), Weedless Spoon [lure] (15), Large Paddle-Tail Swimbait [lure] (14), Bunny Streamer [fly] (13) |
| low_light_surface | all_purpose | Oversized Spinnerbait [lure] (6), Deceiver [fly] (5), Game Changer [fly] (5), Casting Spoon [lure] (4), Inline Spinner [lure] (4) | Shallow Twitchbait [lure] (11), Baitfish Slider [fly] (7), Bass Popper [fly] (7), Inline Spinner [lure] (7), Deceiver [fly] (6) |
| low_light_surface | big_fish | Articulated Baitfish [fly] (9), Oversized Spinnerbait [lure] (7), Large Paddle-Tail Swimbait [lure] (6), Large Bucktail Spinner [lure] (5), Bunny Streamer [fly] (4) | Articulated Baitfish [fly] (10), Weedless Spoon [lure] (10), Deer Hair Slider [fly] (9), Flash Fly [fly] (8), Heavy Paddle-Tail Swimbait [lure] (8) |
| wind_reaction | all_purpose | Deceiver [fly] (96), Large Bucktail Spinner [lure] (58), Bunny Streamer [fly] (35), Oversized Spinnerbait [lure] (27), Large Tube Jig [lure] (21) | Deceiver [fly] (103), Large Bucktail Spinner [lure] (76), Rabbit-Strip Leech [fly] (67), Shallow Twitchbait [lure] (51), Flash Fly [fly] (45) |
| wind_reaction | big_fish | Large Bucktail Spinner [lure] (64), Articulated Baitfish [fly] (48), Bunny Streamer [fly] (44), Game Changer [fly] (42), Large Jerkbait [lure] (39) | Large Bucktail Spinner [lure] (76), Rabbit-Strip Leech [fly] (73), Heavy Paddle-Tail Swimbait [lure] (63), Large Jerkbait [lure] (52), Articulated Baitfish [fly] (51) |
| dirty_vibration | all_purpose | Deceiver [fly] (64), Large Bucktail Spinner [lure] (43), Oversized Spinnerbait [lure] (31), Bunny Streamer [fly] (24), Large Tube Jig [lure] (14) | Deceiver [fly] (68), Large Bucktail Spinner [lure] (54), Rabbit-Strip Leech [fly] (45), Flash Fly [fly] (34), Oversized Spinnerbait [lure] (31) |
| dirty_vibration | big_fish | Articulated Baitfish [fly] (51), Large Bucktail Spinner [lure] (42), Game Changer [fly] (28), Oversized Spinnerbait [lure] (28), Bunny Streamer [fly] (26) | Heavy Paddle-Tail Swimbait [lure] (60), Rabbit-Strip Leech [fly] (60), Large Bucktail Spinner [lure] (54), Articulated Baitfish [fly] (51), Flash Fly [fly] (34) |
| clear_subtle | all_purpose | Casting Spoon [lure] (20), Inline Spinner [lure] (19), Unweighted Baitfish [fly] (12), Game Changer [fly] (10), Deceiver [fly] (9) | Casting Spoon [lure] (23), Blade Bait [lure] (22), Inline Spinner [lure] (20), Unweighted Baitfish [fly] (20), Shallow Twitchbait [lure] (17) |
| clear_subtle | big_fish | Large Paddle-Tail Swimbait [lure] (17), Large Glide Bait [lure] (14), Bunny Streamer [fly] (13), Game Changer [fly] (12), Articulated Baitfish [fly] (9) | Large Paddle-Tail Swimbait [lure] (19), Weedless Spoon [lure] (18), Bunny Streamer [fly] (15), Flash Fly [fly] (14), Game Changer [fly] (14) |
| cold_slow | all_purpose | Bunny Streamer [fly] (54), Rabbit-Strip Leech [fly] (41), Large Tube Jig [lure] (39), Casting Spoon [lure] (38), Blade Bait [lure] (36) | Rabbit-Strip Leech [fly] (121), Blade Bait [lure] (79), Casting Spoon [lure] (78), Bunny Streamer [fly] (70), Deceiver [fly] (43) |
| cold_slow | big_fish | Bunny Streamer [fly] (74), Large Jerkbait [lure] (47), Articulated Baitfish [fly] (37), Large Tube Jig [lure] (34), Heavy Paddle-Tail Swimbait [lure] (26) | Rabbit-Strip Leech [fly] (132), Bunny Streamer [fly] (79), Heavy Paddle-Tail Swimbait [lure] (77), Large Jerkbait [lure] (74), Large Tube Jig [lure] (43) |
| warming_search | all_purpose | Deceiver [fly] (18), Casting Spoon [lure] (17), Oversized Spinnerbait [lure] (16), Baitfish Slider [fly] (15), Inline Spinner [lure] (13) | Shallow Twitchbait [lure] (33), Baitfish Slider [fly] (26), Deceiver [fly] (25), Casting Spoon [lure] (18), Oversized Spinnerbait [lure] (16) |
| warming_search | big_fish | Game Changer [fly] (28), Articulated Baitfish [fly] (26), Large Paddle-Tail Swimbait [lure] (22), Oversized Spinnerbait [lure] (13), Large Bucktail Spinner [lure] (11) | Articulated Baitfish [fly] (28), Game Changer [fly] (28), Heavy Paddle-Tail Swimbait [lure] (26), Large Paddle-Tail Swimbait [lure] (22), Baitfish Slider [fly] (20) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Bucktail Streamer [fly] (9), Clouser Minnow [fly] (9), Large Bucktail Spinner [lure] (4), Oversized Spinnerbait [lure] (4), Blade Bait [lure] (3) | Blade Bait [lure] (9), Bucktail Streamer [fly] (9), Clouser Minnow [fly] (9), Large Bucktail Spinner [lure] (7), Baitfish Slider [fly] (6) |
| current_swing | big_fish | Large Bucktail Spinner [lure] (7), Game Changer [fly] (6), Articulated Baitfish [fly] (5), Oversized Spinnerbait [lure] (4), Big Articulated Streamer [fly] (3) | Rabbit-Strip Leech [fly] (10), Heavy Paddle-Tail Swimbait [lure] (9), Large Bucktail Spinner [lure] (9), Flash Fly [fly] (8), Blade Bait [lure] (6) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Mille Lacs / Upper Midwest pike lake<br>2025-07-16 clear big_fish B | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, caution, low_light_surface+wind_reaction, high | Large Jerkbait (194); Weedless Spoon (190); Big Articulated Streamer (164); Flash Fly (166) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-21 stained big_fish B | 60.7-71.1F, 5.3 mph wind, 61.9% cloud, 0.1 in precip | active, closed, no tags, high | Oversized Spinnerbait (186); Weedless Spoon (174); Articulated Baitfish (160); Rabbit-Strip Leech (134) | SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear all_purpose B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, high | Inline Spinner (170); Blade Bait (98); Deceiver (152); Baitfish Slider (148) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Maine Belgrade Lakes pike water<br>2025-09-15 clear big_fish B | 54-72.2F, 3.1 mph wind, 0% cloud, 0 in precip | neutral, closed, clear_subtle, high | Large Paddle-Tail Swimbait (182); Weedless Spoon (156); Game Changer (160); Flash Fly (150) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake of the Woods pike water<br>2025-10-05 clear big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction, high | Large Paddle-Tail Swimbait (182); Oversized Spinnerbait (174); Bunny Streamer (170); Flash Fly (166) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake of the Woods pike water<br>2025-10-05 stained big_fish B | 47.9-72.9F, 14.7 mph wind, 84.5% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Oversized Spinnerbait (202); Heavy Paddle-Tail Swimbait (168); Articulated Baitfish (174); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-05-15 clear big_fish B | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | neutral, closed, wind_reaction, high | Large Jerkbait (194); Weedless Spoon (172); Game Changer (160); Flash Fly (166) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-21 clear big_fish B | 60.7-71.1F, 5.3 mph wind, 61.9% cloud, 0.1 in precip | active, closed, no tags, high | Large Paddle-Tail Swimbait (182); Heavy Paddle-Tail Swimbait (100); Articulated Baitfish (152); Flash Fly (150) | SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Mille Lacs / Upper Midwest pike lake<br>2025-09-21 stained big_fish A | 60.7-71.1F, 5.3 mph wind, 61.9% cloud, 0.1 in precip | active, closed, no tags, high | Large Glide Bait (192); Weedless Spoon (174); Bunny Streamer (162); Flash Fly (150) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Devils Lake prairie pike water<br>2025-07-12 dirty big_fish B | 58.7-77F, 8 mph wind, 41.8% cloud, 0 in precip | suppressed, closed, no tags, high | Large Bucktail Spinner (158); Heavy Paddle-Tail Swimbait (108); Big Articulated Streamer (156); Rabbit-Strip Leech (134) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Devils Lake prairie pike water<br>2025-07-12 stained big_fish B | 58.7-77F, 8 mph wind, 41.8% cloud, 0 in precip | suppressed, closed, no tags, high | Large Bucktail Spinner (166); Heavy Paddle-Tail Swimbait (108); Bunny Streamer (162); Rabbit-Strip Leech (134) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Devils Lake prairie pike water<br>2025-08-21 dirty big_fish B | 68.2-79.2F, 9.7 mph wind, 47.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Oversized Spinnerbait (202); Heavy Paddle-Tail Swimbait (168); Game Changer (190); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Devils Lake prairie pike water<br>2025-08-21 stained big_fish B | 68.2-79.2F, 9.7 mph wind, 47.8% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Large Jerkbait (210); Heavy Paddle-Tail Swimbait (168); Game Changer (190); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Missouri River backwater pike context<br>2025-09-29 clear all_purpose B | 53.4-78.6F, 11.4 mph wind, 35.3% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search+open_water_search, high | Casting Spoon (202); Shallow Twitchbait (176); Deceiver (198); Baitfish Slider (164) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| St. Lawrence River pike backwater<br>2025-11-11 dirty big_fish B | 34.1-40.1F, 12.3 mph wind, 96.2% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search, high | Heavy Paddle-Tail Swimbait (198); Large Jerkbait (180); Big Articulated Streamer (166); Rabbit-Strip Leech (164) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| St. Lawrence River pike backwater<br>2025-11-11 stained big_fish B | 34.1-40.1F, 12.3 mph wind, 96.2% cloud, 0.5 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+current_swing+open_water_search, high | Heavy Paddle-Tail Swimbait (198); Large Bucktail Spinner (198); Big Articulated Streamer (166); Rabbit-Strip Leech (164) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 dirty big_fish B | 66-77.8F, 9.1 mph wind, 67.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Oversized Spinnerbait (202); Heavy Paddle-Tail Swimbait (168); Game Changer (190); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-07-19 stained big_fish B | 66-77.8F, 9.1 mph wind, 67.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Large Jerkbait (210); Heavy Paddle-Tail Swimbait (168); Game Changer (190); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-08-23 stained big_fish B | 59.5-73.1F, 8.9 mph wind, 1.9% cloud, 0 in precip | neutral, closed, no tags, high | Oversized Spinnerbait (186); Weedless Spoon (174); Big Articulated Streamer (156); Rabbit-Strip Leech (134) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Oahe prairie reservoir pike water<br>2025-11-11 dirty big_fish B | 34.2-54.5F, 9.9 mph wind, 11.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search+open_water_search, high | Large Paddle-Tail Swimbait (184); Large Tube Jig (182); Big Articulated Streamer (166); Rabbit-Strip Leech (148) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Champlain pike water<br>2025-09-27 stained big_fish B | 61.1-69.1F, 4.9 mph wind, 83.9% cloud, 0 in precip | neutral, closed, no tags, high | Oversized Spinnerbait (186); Weedless Spoon (174); Big Articulated Streamer (156); Rabbit-Strip Leech (134) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Green Bay / Door County pike water<br>2025-08-16 stained big_fish B | 70.1-79.1F, 5.8 mph wind, 94.1% cloud, 0.5 in precip | neutral, closed, no tags, high | Oversized Spinnerbait (186); Weedless Spoon (174); Big Articulated Streamer (156); Rabbit-Strip Leech (134) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Green Bay / Door County pike water<br>2025-10-19 clear big_fish B | 47.6-57.1F, 15.4 mph wind, 74.2% cloud, 0.4 in precip | neutral, closed, wind_reaction, high | Large Paddle-Tail Swimbait (182); Oversized Spinnerbait (174); Big Articulated Streamer (164); Flash Fly (166) | SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Green Bay / Door County pike water<br>2025-10-20 clear all_purpose B | 41.5-58.5F, 12.5 mph wind, 50.9% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, high | Casting Spoon (202); Shallow Twitchbait (176); Deceiver (198); Unweighted Baitfish (164) | SET_B_ID_OVERLAP_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Maine Belgrade Lakes pike water<br>2025-02-20 clear big_fish B | 17.1-26.3F, 4.4 mph wind, 67.1% cloud, 0 in precip | neutral, closed, clear_subtle+cold_slow, high | Large Tube Jig (198); Large Paddle-Tail Swimbait (152); Bunny Streamer (164); Rabbit-Strip Leech (156) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty all_purpose B | 17.1-26.3F, 4.4 mph wind, 67.1% cloud, 0 in precip | neutral, closed, cold_slow, high | Blade Bait (174); Large Jerkbait (128); Deceiver (132); Rabbit-Strip Leech (162) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-02-20 dirty big_fish B | 17.1-26.3F, 4.4 mph wind, 67.1% cloud, 0 in precip | neutral, closed, cold_slow, high | Heavy Paddle-Tail Swimbait (182); Casting Spoon (128); Dungeon Streamer (168); Rabbit-Strip Leech (164) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-02-20 stained big_fish B | 17.1-26.3F, 4.4 mph wind, 67.1% cloud, 0 in precip | neutral, closed, cold_slow, high | Heavy Paddle-Tail Swimbait (182); Casting Spoon (136); Bunny Streamer (172); Rabbit-Strip Leech (164) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-03-30 dirty big_fish B | 24.9-33.8F, 4.7 mph wind, 100% cloud, 0.3 in precip | neutral, closed, cold_slow, high | Large Jerkbait (168); Blade Bait (142); Bunny Streamer (178); Rabbit-Strip Leech (150) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-03-30 stained big_fish B | 24.9-33.8F, 4.7 mph wind, 100% cloud, 0.3 in precip | neutral, closed, cold_slow, high | Oversized Spinnerbait (186); Blade Bait (142); Bunny Streamer (178); Rabbit-Strip Leech (150) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 clear all_purpose B | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+open_water_search, high | Casting Spoon (202); Shallow Twitchbait (176); Flash Fly (174); Game Changer (168) | SET_B_ID_OVERLAP_AVOIDABLE |
| Maine Belgrade Lakes pike water<br>2025-04-30 dirty big_fish B | 43.2-64.8F, 12.3 mph wind, 19.8% cloud, 0.1 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Oversized Spinnerbait (202); Blade Bait (142); Game Changer (190); Baitfish Slider (152) | WIND_NOT_ELEVATING_REACTION |

## Known Coverage Gaps

- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
