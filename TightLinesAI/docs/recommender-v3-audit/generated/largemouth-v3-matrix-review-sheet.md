# Largemouth V3 Matrix Review Sheet

Generated: 2026-04-13T12:23:20.831Z
Archive bundle generated: 2026-04-12T18:28:37.533Z
Scenario count: 110
Contexts: 90 lake/pond, 20 river
Priority mix: 48 core, 62 secondary
Completed engine runs: 110/110

This sheet is the scoring surface for the freshwater V3 recommender audit batch.
It supports archive-backed engine runs, real top-3 output capture, and lightweight precheck flags before manual scoring.

Scoring rubric:
- 2 = clearly right
- 1 = acceptable but not ideal
- 0 = wrong or concerning

Required score keys:
- seasonal_fit
- daily_fit
- water_column_fit
- archetype_fit
- color_fit
- top3_variety
- boundedness

## lmb_matrix_florida_lake_01

- Label: Florida shallow natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida winter largemouth should stay in a controlled lower-column lane with only mild daily openings.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
- mouse_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 60.2 F
- Noon pressure: 1024.4 mb
- Noon cloud cover: 100%
- Daily high/low: 65.4 / 58.1 F
- Daily wind max: 14.8 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 17:54

Actual output:
- Top 1 lure: Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_02

- Label: Florida shallow natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida prespawn largemouth should open moving baitfish lanes without abandoning controlled shallow cover options.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- football_jig
Disallowed lanes:
- hollow_body_frog
- mouse_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 75.3 F
- Noon pressure: 1016 mb
- Noon cloud cover: 99%
- Daily high/low: 74.6 / 62.3 F
- Daily wind max: 21.4 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:54 / 18:19

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_03

- Label: Florida shallow natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida prespawn largemouth should open moving baitfish lanes without abandoning controlled shallow cover options.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- football_jig
Disallowed lanes:
- hollow_body_frog
- mouse_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 69 F
- Noon pressure: 1018.3 mb
- Noon cloud cover: 0%
- Daily high/low: 75.2 / 65.7 F
- Daily wind max: 23 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:25 / 19:35

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_04

- Label: Florida shallow natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida spawn and immediate postspawn should stay shallow and target-oriented first, with one clean baitfish follow-up lane; hollow-body frog can join only on legitimately open aggressive spring days around shallow cover.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- woolly_bugger
- hollow_body_frog
Disallowed lanes:
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 71.7 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 17%
- Daily high/low: 79 / 67.1 F
- Daily wind max: 22.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:56 / 19:49

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Wacky-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_05

- Label: Florida shallow natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida May postspawn largemouth should still stay shallow and target-oriented, but on stained shallow-cover days a texas-rigged stick worm can absolutely outrank the cleaner finesse lanes.
Expected primary lanes:
- texas_rigged_stick_worm
- weightless_stick_worm
- wacky_rigged_stick_worm
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- woolly_bugger
- hollow_body_frog
Disallowed lanes:
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 79.1 F
- Noon pressure: 1017 mb
- Noon cloud cover: 0%
- Daily high/low: 88.2 / 76.8 F
- Daily wind max: 18.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:33 / 20:05

Actual output:
- Top 1 lure: Texas-Rigged Stick Worm `texas_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Texas-Rigged Stick Worm `texas_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Texas-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_06

- Label: Florida shallow natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Early- to midsummer Florida largemouth should lean grass, cover, and aggressive surface-adjacent lanes, but prop bait is still a supporting option until the cleaner late-summer cadence truly opens.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
- prop_bait
Disallowed lanes:
- blade_bait
- drop_shot_worm
- suspending_jerkbait
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 84.7 F
- Noon pressure: 1020.8 mb
- Noon cloud cover: 59%
- Daily high/low: 86.3 / 79.3 F
- Daily wind max: 17.7 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:28 / 20:20

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Buzzbait `buzzbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Buzzbait: bright -> white/chartreuse, chartreuse, firetiger
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_aggressive, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_07

- Label: Florida shallow natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Early- to midsummer Florida largemouth should lean grass, cover, and aggressive surface-adjacent lanes, but prop bait is still a supporting option until the cleaner late-summer cadence truly opens.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
- prop_bait
Disallowed lanes:
- blade_bait
- drop_shot_worm
- suspending_jerkbait
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 83.4 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 37%
- Daily high/low: 85.1 / 78.8 F
- Daily wind max: 19.3 mph
- Daily precip: 0.2362204724409449 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:38 / 20:20

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Buzzbait `buzzbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Buzzbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_08

- Label: Florida shallow natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Late-summer Florida largemouth should still lean grass, cover, and surface-adjacent lanes, and this archived August window is one of the cleaner prop-bait opportunities rather than a forced buzz-only read.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait
- prop_bait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- blade_bait
- drop_shot_worm
- suspending_jerkbait
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 83.5 F
- Noon pressure: 1018.7 mb
- Noon cloud cover: 82%
- Daily high/low: 88.3 / 82.2 F
- Daily wind max: 13.3 mph
- Daily precip: 0.06299212598425198 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:53 / 20:02

Actual output:
- Top 1 lure: Prop Bait `prop_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Prop Bait `prop_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Prop Bait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_09

- Label: Florida shallow natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows, but these archived fall days still read more swim-jig and spinnerbait than true walking-topwater windows.
Expected primary lanes:
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 77.5 F
- Noon pressure: 1017.4 mb
- Noon cloud cover: 100%
- Daily high/low: 80.1 / 77.4 F
- Daily wind max: 17.2 mph
- Daily precip: 0.3346456692913386 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:08 / 19:26

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (2.9/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_10

- Label: Florida shallow natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows, but these archived fall days still read more swim-jig and spinnerbait than true walking-topwater windows.
Expected primary lanes:
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 75.8 F
- Noon pressure: 1014.1 mb
- Noon cloud cover: 0%
- Daily high/low: 81.3 / 72.1 F
- Daily wind max: 19.8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:21 / 18:55

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_11

- Label: Florida shallow natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows, but these archived fall days still read more swim-jig and spinnerbait than true walking-topwater windows.
Expected primary lanes:
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 61.5 F
- Noon pressure: 1025.7 mb
- Noon cloud cover: 98%
- Daily high/low: 67.1 / 57.2 F
- Daily wind max: 12.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:39 / 17:34

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_florida_lake_12

- Label: Florida shallow natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida winter largemouth should stay in a controlled lower-column lane with only mild daily openings.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
- mouse_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 66.6 F
- Noon pressure: 1015 mb
- Noon cloud cover: 31%
- Daily high/low: 70.2 / 59.1 F
- Daily wind max: 18.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:00 / 17:31

Actual output:
- Top 1 lure: Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_01

- Label: Texas reservoir, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- texas_rigged_soft_plastic_craw
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 57 F
- Noon pressure: 1029.1 mb
- Noon cloud cover: 100%
- Daily high/low: 60.3 / 42.6 F
- Daily wind max: 12.3 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:19 / 17:44

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_02

- Label: Texas reservoir, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central prespawn reservoirs should open baitfish lanes when conditions allow, but cold-front days can still pull the lead back to football jig and other bottom-control reads.
Expected primary lanes:
- spinnerbait
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- bladed_jig
- swim_jig
Disallowed lanes:
- hollow_body_frog
- popper_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 34.1 F
- Noon pressure: 1031.2 mb
- Noon cloud cover: 100%
- Daily high/low: 37.3 / 20 F
- Daily wind max: 12.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 18:14

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=mid, posture=suppressed, presentation=bold
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_03

- Label: Texas reservoir, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central prespawn reservoirs should open baitfish lanes when conditions allow, but cold-front days can still pull the lead back to football jig and other bottom-control reads.
Expected primary lanes:
- spinnerbait
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- bladed_jig
- swim_jig
Disallowed lanes:
- hollow_body_frog
- popper_fly
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 57.2 F
- Noon pressure: 1028.6 mb
- Noon cloud cover: 0%
- Daily high/low: 62.6 / 44.2 F
- Daily wind max: 14.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:24 / 19:35

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_04

- Label: Texas reservoir, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- weightless_stick_worm
- paddle_tail_swimbait
- soft_jerkbait
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 78.9 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 0%
- Daily high/low: 85.3 / 60.1 F
- Daily wind max: 13.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:51 / 19:52

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_05

- Label: Texas reservoir, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- weightless_stick_worm
- paddle_tail_swimbait
- soft_jerkbait
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 89.8 F
- Noon pressure: 1009.1 mb
- Noon cloud cover: 69%
- Daily high/low: 93.8 / 72.1 F
- Daily wind max: 15.7 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:12

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (4.1/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_06

- Label: Texas reservoir, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm
- weightless_stick_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 88.3 F
- Noon pressure: 1015.1 mb
- Noon cloud cover: 11%
- Daily high/low: 89.1 / 74.9 F
- Daily wind max: 13.1 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:17 / 20:29

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_07

- Label: Texas reservoir, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm
- weightless_stick_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 89.5 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 22%
- Daily high/low: 95.9 / 75.2 F
- Daily wind max: 9.5 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:28 / 20:28

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_08

- Label: Texas reservoir, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm
- weightless_stick_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 90.6 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 10%
- Daily high/low: 95.3 / 77.4 F
- Daily wind max: 8.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 20:07

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_09

- Label: Texas reservoir, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 90.1 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 18%
- Daily high/low: 93.5 / 73.8 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 19:26

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_10

- Label: Texas reservoir, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 81.5 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 0%
- Daily high/low: 87.5 / 62.3 F
- Daily wind max: 6.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:24 / 18:51

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_11

- Label: Texas reservoir, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 78.1 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 22%
- Daily high/low: 81.9 / 57.7 F
- Daily wind max: 11.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:45 / 17:27

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_texas_reservoir_12

- Label: Texas reservoir, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- texas_rigged_soft_plastic_craw
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 66.7 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 0%
- Daily high/low: 66.9 / 37.9 F
- Daily wind max: 9.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:08 / 17:21

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_01

- Label: Alabama river current system, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.
Expected primary lanes:
- compact_flipping_jig
- suspending_jerkbait
- shaky_head_worm
Acceptable secondary lanes:
- tube_jig
- squarebill_crankbait
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 52.4 F
- Noon pressure: 1021.5 mb
- Noon cloud cover: 0%
- Daily high/low: 56.8 / 28.6 F
- Daily wind max: 11.4 mph
- Daily precip: 0.12598425196850396 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:55 / 17:05

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_02

- Label: Alabama river current system, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.
Expected primary lanes:
- spinnerbait
- swim_jig
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_soft_plastic_craw
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 32.2 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 79%
- Daily high/low: 26.5 / 17.1 F
- Daily wind max: 13.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:29 / 17:38

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_03

- Label: Alabama river current system, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.
Expected primary lanes:
- spinnerbait
- swim_jig
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_soft_plastic_craw
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 44.8 F
- Noon pressure: 1017.9 mb
- Noon cloud cover: 100%
- Daily high/low: 56.1 / 39.5 F
- Daily wind max: 20.3 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:52 / 19:03

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (0.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_04

- Label: Alabama river current system, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Spring river largemouth should still fish like river bass, with moving seam lanes and one controlled backup.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 63.1 F
- Noon pressure: 1022.1 mb
- Noon cloud cover: 0%
- Daily high/low: 65.8 / 44.2 F
- Daily wind max: 4.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:15 / 19:25

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.7/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_05

- Label: Alabama river current system, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Spring river largemouth should still fish like river bass, with moving seam lanes and one controlled backup.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 80.9 F
- Noon pressure: 1010.2 mb
- Noon cloud cover: 50%
- Daily high/low: 84 / 66 F
- Daily wind max: 14.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:45 / 19:48

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_06

- Label: Alabama river current system, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 79.8 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 100%
- Daily high/low: 84.3 / 70.8 F
- Daily wind max: 13 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:35 / 20:08

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_07

- Label: Alabama river current system, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 85.8 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 26%
- Daily high/low: 90.6 / 75.7 F
- Daily wind max: 4.4 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:48 / 20:05

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_08

- Label: Alabama river current system, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 85.8 F
- Noon pressure: 1016.4 mb
- Noon cloud cover: 65%
- Daily high/low: 88.8 / 72.7 F
- Daily wind max: 7.4 mph
- Daily precip: 0.20078740157480315 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 19:41

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_09

- Label: Alabama river current system, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 86.6 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 7%
- Daily high/low: 89 / 68.7 F
- Daily wind max: 8.9 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:34 / 18:55

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_10

- Label: Alabama river current system, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 75.3 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 0%
- Daily high/low: 83.1 / 55 F
- Daily wind max: 8.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:55 / 18:17

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_11

- Label: Alabama river current system, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 63.1 F
- Noon pressure: 1021.7 mb
- Noon cloud cover: 0%
- Daily high/low: 69.7 / 38.7 F
- Daily wind max: 4.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:20 / 16:48

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_alabama_river_12

- Label: Alabama river current system, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.
Expected primary lanes:
- compact_flipping_jig
- suspending_jerkbait
- shaky_head_worm
Acceptable secondary lanes:
- tube_jig
- squarebill_crankbait
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 52.4 F
- Noon pressure: 1009.6 mb
- Noon cloud cover: 85%
- Daily high/low: 49.5 / 29.8 F
- Daily wind max: 8.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 16:41

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_01

- Label: New York natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 15.2 F
- Noon pressure: 1011.6 mb
- Noon cloud cover: 100%
- Daily high/low: 29.9 / 15.5 F
- Daily wind max: 14.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:27 / 16:57

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_02

- Label: New York natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- flat_sided_crankbait
- drop_shot_worm
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 13.2 F
- Noon pressure: 1028.2 mb
- Noon cloud cover: 100%
- Daily high/low: 14.1 / 10 F
- Daily wind max: 12.7 mph
- Daily precip: 0.05511811023622047 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:51 / 17:41

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_03

- Label: New York natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- flat_sided_crankbait
- drop_shot_worm
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 55.8 F
- Noon pressure: 1001.9 mb
- Noon cloud cover: 52%
- Daily high/low: 61.1 / 37 F
- Daily wind max: 17.7 mph
- Daily precip: 0.11811023622047245 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:03 / 19:16

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Lipless Crankbait `lipless_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Football Jig: natural -> green pumpkin, olive, smoke
- Lipless Crankbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_04

- Label: New York natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing first, with swim jig and finesse worms in the core set; compact jig is allowed to lead on cold, windy April days or when crawfish-and-structure scoring favors a tighter cover read over roaming finesse.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 32 F
- Noon pressure: 1009 mb
- Noon cloud cover: 100%
- Daily high/low: 33.4 / 29.1 F
- Daily wind max: 20.9 mph
- Daily precip: 0.11023622047244094 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:17 / 19:47

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Strong wind adds instability even if it can still help visibility and presence.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_05

- Label: New York natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing first, with swim jig and finesse worms in the core set; compact jig is allowed to lead on cold, windy April days or when crawfish-and-structure scoring favors a tighter cover read over roaming finesse.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 64.2 F
- Noon pressure: 1011.9 mb
- Noon cloud cover: 99%
- Daily high/low: 71.8 / 55.6 F
- Daily wind max: 9.1 mph
- Daily precip: 0.3582677165354331 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:38 / 20:20

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_06

- Label: New York natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone early-summer largemouth can absolutely let walking topwater jump forward when the surface is truly open, but it still has to coexist with paddle-tail and finesse lanes.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- swim_jig
- wacky_rigged_stick_worm
- walking_topwater
Acceptable secondary lanes:
- hollow_body_frog
- woolly_bugger
- soft_jerkbait
Disallowed lanes:
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 71.7 F
- Noon pressure: 1012.2 mb
- Noon cloud cover: 100%
- Daily high/low: 76.1 / 62.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0.40944881889763785 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:23 / 20:45

Actual output:
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Walking Topwater: dark -> black, black/blue, black/purple
- Wacky-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_07

- Label: New York natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone midsummer largemouth should stay on paddle-tail, finesse, and swim-jig lanes unless the surface window is exceptionally clean and warming; these archived midsummer windows do not require walking topwater.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- swim_jig
- wacky_rigged_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- woolly_bugger
- soft_jerkbait
Disallowed lanes:
- walking_topwater
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 81 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 19%
- Daily high/low: 82.8 / 63.7 F
- Daily wind max: 7.6 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:38 / 20:39

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_08

- Label: New York natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone midsummer largemouth should stay on paddle-tail, finesse, and swim-jig lanes unless the surface window is exceptionally clean and warming; these archived midsummer windows do not require walking topwater.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- swim_jig
- wacky_rigged_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- woolly_bugger
- soft_jerkbait
Disallowed lanes:
- walking_topwater
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 75.7 F
- Noon pressure: 1015.7 mb
- Noon cloud cover: 43%
- Daily high/low: 76.8 / 61.1 F
- Daily wind max: 9.4 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 20:07

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Carolina-Rigged Stick Worm `carolina_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Carolina-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_09

- Label: New York natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should center on spinnerbait-led baitfish transition lanes, with swim jig and paddle tail staying close behind along edges and remaining grass.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- squarebill_crankbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 64 F
- Noon pressure: 1020.7 mb
- Noon cloud cover: 100%
- Daily high/low: 68.8 / 49.2 F
- Daily wind max: 5.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:43 / 19:10

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_10

- Label: New York natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should center on spinnerbait-led baitfish transition lanes, with swim jig and paddle tail staying close behind along edges and remaining grass.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- squarebill_crankbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 46.4 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 100%
- Daily high/low: 49.2 / 39.9 F
- Daily wind max: 12.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:15 / 18:21

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bladed Jig `bladed_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Bladed Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_11

- Label: New York natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should center on spinnerbait-led baitfish transition lanes, with swim jig and paddle tail staying close behind along edges and remaining grass.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- squarebill_crankbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 33.9 F
- Noon pressure: 1004.5 mb
- Noon cloud cover: 100%
- Daily high/low: 36.4 / 29.4 F
- Daily wind max: 15 mph
- Daily precip: 0.11811023622047245 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:49 / 16:44

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_new_york_natural_lake_12

- Label: New York natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -75.72
- Engine status: complete

Expected seasonal story:
- Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 29.1 F
- Noon pressure: 996.2 mb
- Noon cloud cover: 100%
- Daily high/low: 29.1 / 12.7 F
- Daily wind max: 17 mph
- Daily precip: 0.08661417322834647 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:20 / 16:30

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_michigan_clear_natural_lake_02

- Label: Michigan clear natural lake, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: complete

Expected seasonal story:
- Clear Michigan largemouth in winter should stay disciplined around jerkbait, flat-side, and football-jig lanes, with no fake warm-season surface behavior.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 18 F
- Noon pressure: 1031.4 mb
- Noon cloud cover: 100%
- Daily high/low: 22.9 / 12.3 F
- Daily wind max: 13.8 mph
- Daily precip: 0.05905511811023623 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:32 / 18:16

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_michigan_clear_natural_lake_05

- Label: Michigan clear natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: complete

Expected seasonal story:
- Michigan spawn and immediate postspawn largemouth should stay shallow and target-oriented first, with one clean baitfish follow-up lane.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 73.7 F
- Noon pressure: 1004.6 mb
- Noon cloud cover: 15%
- Daily high/low: 77.9 / 59.4 F
- Daily wind max: 14.6 mph
- Daily precip: 0.13385826771653545 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 21:05

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_michigan_clear_natural_lake_07

- Label: Michigan clear natural lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: complete

Expected seasonal story:
- Clear Michigan summer largemouth should favor weed-edge swim-jig, paddle-tail, and finesse lanes first; on this archived subtle clear-water window, true surface baits should not be required.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- wacky_rigged_stick_worm
- drop_shot_worm
Acceptable secondary lanes:
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- walking_topwater
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 79.8 F
- Noon pressure: 1010.4 mb
- Noon cloud cover: 42%
- Daily high/low: 80.2 / 68.9 F
- Daily wind max: 8.8 mph
- Daily precip: 0.08661417322834647 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:08 / 21:25

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hollow-Body Frog `hollow_body_frog` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Swim Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hollow-Body Frog: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_michigan_clear_natural_lake_10

- Label: Michigan clear natural lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: complete

Expected seasonal story:
- Michigan fall largemouth should tighten around baitfish transition lanes with swim jig, spinnerbait, and paddle tail leading the edge game.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- squarebill_crankbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 54.2 F
- Noon pressure: 1027 mb
- Noon cloud cover: 9%
- Daily high/low: 56.9 / 45.9 F
- Daily wind max: 9 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:55 / 18:57

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_wisconsin_clear_weed_lake_05

- Label: Wisconsin clear weed lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin postspawn largemouth should still stay shallow and weed-edge oriented, with finesse and swim-jig lanes ahead of offshore or cold-water tools.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 75.6 F
- Noon pressure: 1000.2 mb
- Noon cloud cover: 16%
- Daily high/low: 81.1 / 56.2 F
- Daily wind max: 19.4 mph
- Daily precip: 0.4921259842519685 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:23 / 20:25

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_wisconsin_clear_weed_lake_07

- Label: Wisconsin clear weed lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin clear weed-lake largemouth should open walking topwater and swim-jig lanes naturally, but still keep weightless stick worms and paddle tails very much alive.
Expected primary lanes:
- swim_jig
- walking_topwater
- weightless_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
- wacky_rigged_stick_worm
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 55 F
- Noon pressure: 1013.8 mb
- Noon cloud cover: 100%
- Daily high/low: 66.5 / 50.6 F
- Daily wind max: 12 mph
- Daily precip: 0.6181102362204725 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:21 / 20:46

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Active rain disruption suppresses fish posture and shrinks the clean bite lane.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_wisconsin_clear_weed_lake_09

- Label: Wisconsin clear weed lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin early-fall weed-lake largemouth should move to horizontal edge lanes first, with spinnerbait and swim jig in front and topwater still viable on the warm side of fall.
Expected primary lanes:
- spinnerbait
- swim_jig
- walking_topwater
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- squarebill_crankbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 77.4 F
- Noon pressure: 1017.8 mb
- Noon cloud cover: 5%
- Daily high/low: 80.3 / 61.1 F
- Daily wind max: 7.6 mph
- Daily precip: 0.27165354330708663 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:37 / 19:06

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bladed Jig `bladed_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Bladed Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_wisconsin_clear_weed_lake_11

- Label: Wisconsin clear weed lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin early-fall weed-lake largemouth should move to horizontal edge lanes first, with spinnerbait and swim jig in front and topwater still viable on the warm side of fall.
Expected primary lanes:
- spinnerbait
- swim_jig
- walking_topwater
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- squarebill_crankbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 40.5 F
- Noon pressure: 1009.1 mb
- Noon cloud cover: 0%
- Daily high/low: 46.6 / 26.8 F
- Daily wind max: 10.7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:53 / 16:30

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_illinois_backwater_river_03

- Label: Illinois backwater river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: IL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Prespawn Illinois backwater largemouth should open spinnerbait, bladed-jig, and compact cover lanes as the river warms without drifting into offshore finesse.
Expected primary lanes:
- spinnerbait
- bladed_jig
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- squarebill_crankbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 40.4 F
- Noon pressure: 1018.1 mb
- Noon cloud cover: 0%
- Daily high/low: 44.4 / 32.7 F
- Daily wind max: 22.1 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:01 / 19:13

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_illinois_backwater_river_06

- Label: Illinois backwater river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: IL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Summer Illinois backwater largemouth should absolutely allow slop and ambush tools like frog, swim jig, and spinnerbait before trying to get cute with clean-water finesse.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- buzzbait
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- drop_shot_worm
- blade_bait
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 75 F
- Noon pressure: 1006.9 mb
- Noon cloud cover: 100%
- Daily high/low: 76.4 / 67.6 F
- Daily wind max: 15.4 mph
- Daily precip: 0.6259842519685039 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:28 / 20:34

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Topwater Popper `popping_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Buzzbait `buzzbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Mouse Fly `mouse_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Topwater Popper: bright -> white/chartreuse, chartreuse, firetiger
- Buzzbait: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Mouse Fly: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (4.8/10)
- Presentation presence today: bold
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_illinois_backwater_river_09

- Label: Illinois backwater river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: IL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Fall Illinois backwater largemouth should open baitfish and current-break lanes with spinnerbait, bladed jig, and squarebill on top.
Expected primary lanes:
- spinnerbait
- bladed_jig
- squarebill_crankbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- swim_jig
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
Expected color themes:
- natural
- bright
- dark

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 82.1 F
- Noon pressure: 1018.7 mb
- Noon cloud cover: 31%
- Daily high/low: 85.3 / 62.3 F
- Daily wind max: 5.2 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:42 / 19:06

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_illinois_backwater_river_11

- Label: Illinois backwater river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: IL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Late-fall Illinois backwater largemouth should tighten into slower wood, eddy, and current-break lanes, with compact jig control back in front of broad fall roaming.
Expected primary lanes:
- compact_flipping_jig
- suspending_jerkbait
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- squarebill_crankbait
- woolly_bugger
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 58.4 F
- Noon pressure: 1018.7 mb
- Noon cloud cover: 18%
- Daily high/low: 62.3 / 34.9 F
- Daily wind max: 7.8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:41 / 16:47

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ohio_reservoir_02

- Label: Ohio inland reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: OH
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Ohio prespawn reservoir largemouth should open with jerkbait, spinnerbait, and football-jig lanes before broad summer search behavior.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- flat_sided_crankbait
- swim_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 15.5 F
- Noon pressure: 1033 mb
- Noon cloud cover: 100%
- Daily high/low: 19.9 / 12.9 F
- Daily wind max: 13.7 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:17 / 18:13

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Balanced Leech `balanced_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Balanced Leech: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ohio_reservoir_04

- Label: Ohio inland reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: OH
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Cold April Ohio reservoir largemouth can still fish like a late-prespawn transition day, with football jig and one tighter baitfish search lane ahead of true shallow target finesse.
Expected primary lanes:
- football_jig
- lipless_crankbait
- texas_rigged_soft_plastic_craw
Acceptable secondary lanes:
- spinnerbait
- compact_flipping_jig
- crawfish_streamer
Disallowed lanes:
- walking_topwater
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 47.4 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 47%
- Daily high/low: 51.6 / 33.9 F
- Daily wind max: 12.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:49 / 20:13

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ohio_reservoir_08

- Label: Ohio inland reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: OH
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Ohio summer reservoir largemouth should lean structure, edge, and mid-depth baitfish lanes over southern-style pure slop and mat fishing.
Expected primary lanes:
- swim_jig
- football_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- deep_diving_crankbait
- texas_rigged_stick_worm
- game_changer
- hollow_body_frog
Disallowed lanes:
- buzzbait
- prop_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 79.9 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 31%
- Daily high/low: 83.1 / 65.6 F
- Daily wind max: 5.7 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:41 / 20:32

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ohio_reservoir_11

- Label: Ohio inland reservoir, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: OH
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Ohio late-fall reservoir largemouth should stay on disciplined lower-column baitfish and jig lanes once true cold arrives, with jerkbait and football jig back in front.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- paddle_tail_swimbait
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 46 F
- Noon pressure: 1012.5 mb
- Noon cloud cover: 22%
- Daily high/low: 52.9 / 34 F
- Daily wind max: 11.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:13 / 17:18

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pennsylvania_natural_lake_01

- Label: Pennsylvania natural lake, winter control month 1
- Priority: secondary
- Date: 2025-01-16
- State: PA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 41.35, -75.6
- Engine status: complete

Expected seasonal story:
- Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 20.9 F
- Noon pressure: 1012.6 mb
- Noon cloud cover: 100%
- Daily high/low: 33.8 / 18.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:23 / 17:00

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Flat-Sided Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pennsylvania_natural_lake_05

- Label: Pennsylvania natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: PA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 41.35, -75.6
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing first, with swim jig and finesse worms in the core set; compact jig is allowed to lead on cold, windy April days or when crawfish-and-structure scoring favors a tighter cover read over roaming finesse.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 71 F
- Noon pressure: 1011.5 mb
- Noon cloud cover: 33%
- Daily high/low: 73.2 / 58.1 F
- Daily wind max: 7.2 mph
- Daily precip: 0.17716535433070868 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:41 / 20:16

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pennsylvania_natural_lake_08

- Label: Pennsylvania natural lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: PA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 41.35, -75.6
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone midsummer largemouth should stay on paddle-tail, finesse, and swim-jig lanes unless the surface window is exceptionally clean and warming; these archived midsummer windows do not require walking topwater.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- swim_jig
- wacky_rigged_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- woolly_bugger
- soft_jerkbait
Disallowed lanes:
- walking_topwater
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 80.2 F
- Noon pressure: 1014.9 mb
- Noon cloud cover: 19%
- Daily high/low: 83.5 / 66.5 F
- Daily wind max: 6.7 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 20:04

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Carolina-Rigged Stick Worm `carolina_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Carolina-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pennsylvania_natural_lake_11

- Label: Pennsylvania natural lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: PA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 41.35, -75.6
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should center on spinnerbait-led baitfish transition lanes, with swim jig and paddle tail staying close behind along edges and remaining grass.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- squarebill_crankbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 39.4 F
- Noon pressure: 1006.7 mb
- Noon cloud cover: 100%
- Daily high/low: 42.5 / 35.2 F
- Daily wind max: 17.1 mph
- Daily precip: 0.07480314960629922 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:46 / 16:46

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (7.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_georgia_highland_02

- Label: Georgia highland reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Clear highland prespawn largemouth should favor baitfish and jerkbait lanes, but true cold-front conditions can still let football jig take the lead without breaking the seasonal story.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 41.4 F
- Noon pressure: 1022.7 mb
- Noon cloud cover: 100%
- Daily high/low: 36.9 / 21.4 F
- Daily wind max: 15.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 18:22

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_georgia_highland_04

- Label: Georgia highland reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Georgia highland spawn/postspawn largemouth should lean on target cover with compact jigs and shallow finesse.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- hollow_body_frog
- squarebill_crankbait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 59.7 F
- Noon pressure: 1020.2 mb
- Noon cloud cover: 0%
- Daily high/low: 65.5 / 41.3 F
- Daily wind max: 10.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:59 / 20:08

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Compact Flipping Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_georgia_highland_06

- Label: Georgia highland reservoir, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Clear highland summer largemouth should lean toward deeper structure and cover fishing with finesse backup options.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- soft_jerkbait
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- buzzbait
- prop_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 79.3 F
- Noon pressure: 1020.1 mb
- Noon cloud cover: 11%
- Daily high/low: 82.2 / 66.7 F
- Daily wind max: 11.6 mph
- Daily precip: 0.043307086614173235 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:19 / 20:51

Actual output:
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_georgia_highland_10

- Label: Georgia highland reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Highland fall largemouth should center on shad-oriented moving lanes with a clean backup option.
Expected primary lanes:
- squarebill_crankbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 70.3 F
- Noon pressure: 1019.8 mb
- Noon cloud cover: 0%
- Daily high/low: 82.2 / 55 F
- Daily wind max: 7.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:38 / 19:00

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bladed Jig `bladed_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Squarebill Crankbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Bladed Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_louisiana_grass_lake_03

- Label: Louisiana grass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Dirty-to-stained southern prespawn grass bass should open visible grass and baitfish lanes without turning into winter bottom dragging; lipless can legitimately steal the lead on colder windy grass days.
Expected primary lanes:
- spinnerbait
- bladed_jig
- compact_flipping_jig
- lipless_crankbait
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- drop_shot_worm
- walking_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 58.6 F
- Noon pressure: 1025 mb
- Noon cloud cover: 0%
- Daily high/low: 64.4 / 47.8 F
- Daily wind max: 19.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:11 / 19:22

Actual output:
- Top 1 lure: Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_louisiana_grass_lake_06

- Label: Louisiana grass lake, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Warm southern grass largemouth should lean frog, swim-jig, and other cover/surface-adjacent lanes, but prop bait is still a supporting lane rather than a must-hit primary on this archived neutral window.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
- prop_bait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 86.9 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 25%
- Daily high/low: 87.4 / 75.8 F
- Daily wind max: 9.9 mph
- Daily precip: 0.13385826771653545 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:06 / 20:14

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Drop-Shot Minnow: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_louisiana_grass_lake_09

- Label: Louisiana grass lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, while allowing walking topwater to steal the lead on the hottest active early-fall windows.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
- walking_topwater
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
- rabbit_strip_leech
- popper_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- dark
- bright
- natural

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 88.2 F
- Noon pressure: 1017.4 mb
- Noon cloud cover: 2%
- Daily high/low: 90.6 / 72.4 F
- Daily wind max: 7.5 mph
- Daily precip: 0.03543307086614173 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:54 / 19:13

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_louisiana_grass_lake_11

- Label: Louisiana grass lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, while allowing walking topwater to steal the lead on the hottest active early-fall windows.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
- walking_topwater
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
- rabbit_strip_leech
- popper_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- dark
- bright
- natural

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 75.9 F
- Noon pressure: 1023.7 mb
- Noon cloud cover: 20%
- Daily high/low: 78.5 / 55.3 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:31 / 17:15

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ozarks_reservoir_02

- Label: Ozarks reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Clear Ozarks prespawn largemouth should still be disciplined, with jerkbait and flat-side leading the lane.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 11.2 F
- Noon pressure: 1039.3 mb
- Noon cloud cover: 99%
- Daily high/low: 14.5 / -1.9 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:54 / 17:59

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=mid, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ozarks_reservoir_05

- Label: Ozarks reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Postspawn Ozarks largemouth should allow cleaner shad-following lanes with one controlled backup.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- wacky_rigged_stick_worm
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 83.8 F
- Noon pressure: 1004 mb
- Noon cloud cover: 92%
- Daily high/low: 85.2 / 66.7 F
- Daily wind max: 13 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:03 / 20:14

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (7.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ozarks_reservoir_10

- Label: Ozarks reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Fall Ozarks largemouth should strongly respect shad-transition lanes without collapsing into one moving bait only.
Expected primary lanes:
- squarebill_crankbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 75.5 F
- Noon pressure: 1021.6 mb
- Noon cloud cover: 0%
- Daily high/low: 81.1 / 60.3 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:19 / 18:37

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bladed Jig `bladed_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Squarebill Crankbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Bladed Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_ozarks_reservoir_12

- Label: Ozarks reservoir, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Cold clear inland-reservoir largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 50.5 F
- Noon pressure: 1015.4 mb
- Noon cloud cover: 0%
- Daily high/low: 58.3 / 34.4 F
- Daily wind max: 11.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 16:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Football Jig: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=mid_low, seasonal_location=deep, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_minnesota_weed_lake_05

- Label: Minnesota weed lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline largemouth around spawn/postspawn should stay shallow and target-oriented first.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 73.9 F
- Noon pressure: 990.3 mb
- Noon cloud cover: 76%
- Daily high/low: 78.7 / 53.1 F
- Daily wind max: 23.7 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:41 / 20:48

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_minnesota_weed_lake_07

- Label: Minnesota weed lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline summer largemouth should stay weed-edge and bluegill-oriented first, with swim jig and weightless worm leading; these archived July and August windows do not need walking topwater to validate the pattern.
Expected primary lanes:
- swim_jig
- weightless_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- mouse_fly
- paddle_tail_swimbait
- wacky_rigged_stick_worm
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 59.5 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 100%
- Daily high/low: 63.3 / 55.3 F
- Daily wind max: 11.3 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:39 / 21:09

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_minnesota_weed_lake_08

- Label: Minnesota weed lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline summer largemouth should stay weed-edge and bluegill-oriented first, with swim jig and weightless worm leading; these archived July and August windows do not need walking topwater to validate the pattern.
Expected primary lanes:
- swim_jig
- weightless_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- mouse_fly
- paddle_tail_swimbait
- wacky_rigged_stick_worm
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 71.8 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 96%
- Daily high/low: 80.1 / 63.9 F
- Daily wind max: 15.7 mph
- Daily precip: 0.10629921259842522 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:14 / 20:32

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hollow-Body Frog `hollow_body_frog` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Swim Jig: natural -> green pumpkin, olive, smoke
- Hollow-Body Frog: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_minnesota_weed_lake_10

- Label: Minnesota weed lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern early-fall weedline largemouth should open horizontal edge lanes through a cooler seasonal posture, with spinnerbait and swim jig ahead of true walking-topwater demand on this archived October window.
Expected primary lanes:
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- mouse_fly
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 52.3 F
- Noon pressure: 1025.4 mb
- Noon cloud cover: 84%
- Daily high/low: 52.3 / 41.9 F
- Daily wind max: 9.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:35 / 18:33

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (7.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_california_delta_03

- Label: California Delta freshwater reach, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Prespawn Delta largemouth should still respect current and cover, but with cleaner baitfish and target lanes than the stained late-fall version.
Expected primary lanes:
- soft_jerkbait
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- walking_topwater
- blade_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56 F
- Noon pressure: 1026.3 mb
- Noon cloud cover: 49%
- Daily high/low: 61.3 / 45 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:07 / 19:20

Actual output:
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_california_delta_06

- Label: California Delta freshwater reach, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Summer Delta largemouth should favor grass/current ambush lanes and visible cover tools, not cold-water finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- hollow_body_frog
Acceptable secondary lanes:
- bladed_jig
- compact_flipping_jig
- game_changer
Disallowed lanes:
- drop_shot_worm
- blade_bait
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 83.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 0%
- Daily high/low: 94 / 58.4 F
- Daily wind max: 11.5 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:42 / 20:33

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_california_delta_09

- Label: California Delta freshwater reach, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.
Expected primary lanes:
- bladed_jig
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- rabbit_strip_leech
- game_changer
Disallowed lanes:
- walking_topwater
Expected color themes:
- dark
- bright
- natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 87.4 F
- Noon pressure: 1013.1 mb
- Noon cloud cover: 0%
- Daily high/low: 97.2 / 63.9 F
- Daily wind max: 11.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:49 / 19:12

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_california_delta_11

- Label: California Delta freshwater reach, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.
Expected primary lanes:
- bladed_jig
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- rabbit_strip_leech
- game_changer
Disallowed lanes:
- walking_topwater
Expected color themes:
- dark
- bright
- natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 65.4 F
- Noon pressure: 1015.9 mb
- Noon cloud cover: 77%
- Daily high/low: 64.2 / 58.4 F
- Daily wind max: 18.5 mph
- Daily precip: 1.4448818897637796 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:43 / 16:58

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Balanced Leech: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_socal_reservoir_01

- Label: Southern California reservoir, winter control month 1
- Priority: secondary
- Date: 2025-01-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- Mild-winter Southern California reservoir largemouth should stay lower-column and controlled; football jig leads active cold days, drop-shot wins when presentation locks fully subtle on the coldest archive days.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- drop_shot_worm
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 62.8 F
- Noon pressure: 1019.8 mb
- Noon cloud cover: 78%
- Daily high/low: 59 / 38.4 F
- Daily wind max: 9.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:50 / 17:05

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_socal_reservoir_04

- Label: Southern California reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- April Southern California reservoir largemouth is still building toward spawn; WESTERN_WARM prespawn rows put football jig at the top with craw-first color reads and moving search lanes as backup.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 58.3 F
- Noon pressure: 1015.2 mb
- Noon cloud cover: 100%
- Daily high/low: 62.1 / 47.8 F
- Daily wind max: 14.4 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:14 / 19:21

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_socal_reservoir_07

- Label: Southern California reservoir, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- SoCal summer reservoir largemouth should stay shallow-cover and baitfish-oriented; swim jig and frog remain core, while walking topwater only truly leads when the daily surface window is open.
Expected primary lanes:
- swim_jig
- hollow_body_frog
- walking_topwater
Acceptable secondary lanes:
- buzzbait
- prop_bait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 83.9 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 0%
- Daily high/low: 88.2 / 60 F
- Daily wind max: 14.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:48 / 20:00

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Swim Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_socal_reservoir_10

- Label: Southern California reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- Fall Southern California reservoir largemouth should open baitfish-chasing lanes with spinnerbait and swim jig leading the horizontal search.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- bladed_jig
- walking_topwater
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 61.5 F
- Noon pressure: 1016.2 mb
- Noon cloud cover: 96%
- Daily high/low: 64.8 / 51.4 F
- Daily wind max: 7.5 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 18:15

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pnw_bass_lake_03

- Label: Pacific Northwest bass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- March Pacific Northwest bass lake is deep prespawn; WESTERN_INLAND prespawn row puts football jig on top with crawfish-first color reads and spinnerbait as the open search lane.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 44.5 F
- Noon pressure: 1019.9 mb
- Noon cloud cover: 100%
- Daily high/low: 46 / 37.2 F
- Daily wind max: 13.7 mph
- Daily precip: 0.6181102362204725 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 19:27

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive (6.6/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pnw_bass_lake_05

- Label: Pacific Northwest bass lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- May Pacific Northwest bass lake is late prespawn — WESTERN_INLAND fish don't spawn until June; football jig still leads with craw-first posture, but spinnerbait and swim jig build as activating pre-spawn search lanes.
Expected primary lanes:
- football_jig
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- compact_flipping_jig
- paddle_tail_swimbait
- suspending_jerkbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 54.3 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 100%
- Daily high/low: 55.4 / 45.4 F
- Daily wind max: 5 mph
- Daily precip: 0.13385826771653545 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:39 / 20:38

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pnw_bass_lake_08

- Label: Pacific Northwest bass lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- Summer PNW bass lake should be in active shallow mode, but this archived Oregon window still reads more frog-and-swim-jig than true walking- or prop-bait surface cadence.
Expected primary lanes:
- swim_jig
- hollow_body_frog
Acceptable secondary lanes:
- buzzbait
- paddle_tail_swimbait
- bladed_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm
- walking_topwater
- prop_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 74.7 F
- Noon pressure: 1016.8 mb
- Noon cloud cover: 25%
- Daily high/low: 79.9 / 60.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:11 / 20:23

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_pnw_bass_lake_11

- Label: Pacific Northwest bass lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- November Pacific Northwest bass lake is already in winter posture — WESTERN_INLAND drops into WINTER_LAKE rows at month 11; football jig and jerkbait lead, but blade bait surfaces on neutral-mood overcast days when pressure drops and fish stay slightly active.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- blade_bait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 57.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 100%
- Daily high/low: 59 / 50 F
- Daily wind max: 4.9 mph
- Daily precip: 0.6181102362204725 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 16:47

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Balanced Leech `balanced_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Balanced Leech: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_colorado_bass_lake_02

- Label: Colorado highland reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- February Colorado highland reservoir largemouth is fully in winter posture — football jig leads most days, but drop-shot wins on the coldest extreme-bottom days when subtle presentation locks in and finesse edges out the jig.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- drop_shot_worm
Acceptable secondary lanes:
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 7 F
- Noon pressure: 1039.1 mb
- Noon cloud cover: 100%
- Daily high/low: 21.6 / 3.7 F
- Daily wind max: 4.1 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 17:42

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_colorado_bass_lake_05

- Label: Colorado highland reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- May Colorado highland reservoir is late prespawn — mountain_west fish don't spawn until June; football jig leads most days, but texas-rigged craw can edge it out when low-pressure bottoms out presentation and bottom-column focus shifts to a slow-drag finesse.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- paddle_tail_swimbait
- swim_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 61.8 F
- Noon pressure: 1002.6 mb
- Noon cloud cover: 3%
- Daily high/low: 63.8 / 42.4 F
- Daily wind max: 11.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:41 / 20:12

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Football Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_colorado_bass_lake_08

- Label: Colorado highland reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- Colorado highland reservoir summer largemouth should still be active, but this archived clear-water mountain window is not a true walking- or prop-bait surface setup; swim jig and paddle-tail should lead instead.
Expected primary lanes:
- swim_jig
- hollow_body_frog
- paddle_tail_swimbait
Acceptable secondary lanes:
- compact_flipping_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm
- walking_topwater
- buzzbait
- prop_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 90.8 F
- Noon pressure: 1007.6 mb
- Noon cloud cover: 58%
- Daily high/low: 90.8 / 56.3 F
- Daily wind max: 16.7 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 20:01

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Hollow-Body Frog: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_colorado_bass_lake_10

- Label: Colorado highland reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- October Colorado highland reservoir fall largemouth should open spinnerbait and baitfish-following lanes with clean natural colors.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- bladed_jig
- squarebill_crankbait
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 59.3 F
- Noon pressure: 1012.1 mb
- Noon cloud cover: 5%
- Daily high/low: 66 / 44.8 F
- Daily wind max: 7.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 18:21

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bladed Jig `bladed_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Bladed Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.8/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_northeast_maine_lake_01

- Label: Maine clear natural lake, winter control month 1
- Priority: secondary
- Date: 2025-01-16
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake winter largemouth should open with jerkbait and flat-side in front — NORTHERN_CLEAR_WINTER_LAKE puts suspending jerkbait at position 0, not football jig.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- shaky_head_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 25.4 F
- Noon pressure: 1012.4 mb
- Noon cloud cover: 100%
- Daily high/low: 31.7 / 14.4 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:10 / 16:33

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Football Jig: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_northeast_maine_lake_05

- Label: Maine clear natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake spawn and postspawn largemouth should open with finesse stick-worm lanes first; compact jig surfaces when crawfish-primary forage scoring edges it ahead of stick worms on pre-spawn structure days.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- hollow_body_frog
- blade_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 70.3 F
- Noon pressure: 1014.2 mb
- Noon cloud cover: 94%
- Daily high/low: 70.3 / 51.7 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:14 / 20:02

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Compact Flipping Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=top, likely_column_today=top, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_northeast_maine_lake_07

- Label: Maine clear natural lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake summer largemouth: wacky rig and stick worm lead on subtle days; swim jig with perch/bluegill colors takes over on hot bluebird days when active mood and bluegill_perch forage scoring push horizontal presentations ahead of finesse.
Expected primary lanes:
- wacky_rigged_stick_worm
- weightless_stick_worm
- drop_shot_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
- blade_bait
Expected color themes:
- natural
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 85.7 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 3%
- Daily high/low: 87.5 / 71.5 F
- Daily wind max: 10.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:13 / 20:23

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_northeast_maine_lake_11

- Label: Maine clear natural lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast November clear-lake largemouth stays in active fall posture — NORTHERN_CLEAR_FALL_LAKE fires at month 11 with spinnerbait and swim jig leading a mid/active baitfish window, not the locked-down winter posture that GLUM enters in November.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- blade_bait
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 40.7 F
- Noon pressure: 1004.1 mb
- Noon cloud cover: 98%
- Daily high/low: 43.6 / 34.7 F
- Daily wind max: 7.7 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:32 / 16:20

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_gulf_dirty_grass_lake_03

- Label: Gulf Coast dirty grass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty prespawn grass lake fires the GULF_DIRTY_PRESPAWN pool: all lures are dirty-friendly so position dominates, and lipless can take over on the coldest windy prespawn grass days.
Expected primary lanes:
- spinnerbait
- bladed_jig
- compact_flipping_jig
- swim_jig
- lipless_crankbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- football_jig
- hollow_body_frog
Expected color themes:
- bright
- natural
- dark

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 57.7 F
- Noon pressure: 1024.5 mb
- Noon cloud cover: 0%
- Daily high/low: 62.6 / 47.6 F
- Daily wind max: 18.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:09 / 19:20

Actual output:
- Top 1 lure: Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.9/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_gulf_dirty_grass_lake_09

- Label: Gulf Coast dirty grass lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty fall grass lake should still favor dirty-friendly grass tools first, but walking topwater can remain a shallow-active supporting option in early fall and suspending jerkbait can linger as a restrained backup when October conditions knock fish lower.
Expected primary lanes:
- buzzbait
- prop_bait
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
Acceptable secondary lanes:
- paddle_tail_swimbait
- lipless_crankbait
- game_changer
- walking_topwater
- suspending_jerkbait
Disallowed lanes:
- squarebill_crankbait
Expected color themes:
- bright
- natural
- dark

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 87.2 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 20%
- Daily high/low: 91.3 / 71.1 F
- Daily wind max: 7.5 mph
- Daily precip: 0.07086614173228346 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:51 / 19:11

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_gulf_dirty_grass_lake_10

- Label: Gulf Coast dirty grass lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty fall grass lake should still favor dirty-friendly grass tools first, but walking topwater can remain a shallow-active supporting option in early fall and suspending jerkbait can linger as a restrained backup when October conditions knock fish lower.
Expected primary lanes:
- buzzbait
- prop_bait
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
Acceptable secondary lanes:
- paddle_tail_swimbait
- lipless_crankbait
- game_changer
- walking_topwater
- suspending_jerkbait
Disallowed lanes:
- squarebill_crankbait
Expected color themes:
- bright
- natural
- dark

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 84.1 F
- Noon pressure: 1016.5 mb
- Noon cloud cover: 0%
- Daily high/low: 88.4 / 59.7 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:08 / 18:37

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.1/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_midwest_dirty_backwater_03

- Label: Midwest dirty backwater lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater prespawn: football jig holds at position 0 via crawfish forage match plus dirty bonus; spinnerbait and bladed jig surface with dirty clarity boost but lack the forage alignment; suspending jerkbait can still linger as a lower-ranked control backup on nasty transition days.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- spinnerbait
- bladed_jig
Acceptable secondary lanes:
- lipless_crankbait
- compact_flipping_jig
- woolly_bugger
- suspending_jerkbait
Disallowed lanes:
- squarebill_crankbait
- walking_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 40.4 F
- Noon pressure: 1018.1 mb
- Noon cloud cover: 0%
- Daily high/low: 44.4 / 32.7 F
- Daily wind max: 22.1 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:01 / 19:13

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed (1.7/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=bold
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A sharp cooldown suppresses fish posture and lowers confidence in upward movement.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_midwest_dirty_backwater_07

- Label: Midwest dirty backwater lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater summer: walking topwater and prop bait both drop off in dirty water; popping topwater, buzzbait, hollow body frog, and swim jig carry the real dirty-water surface and cover bonuses.
Expected primary lanes:
- popping_topwater
- buzzbait
- hollow_body_frog
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- walking_topwater
- prop_bait
- deep_diving_crankbait
- blade_bait
Expected color themes:
- bright
- dark
- natural
- natural

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 88.1 F
- Noon pressure: 1010.4 mb
- Noon cloud cover: 5%
- Daily high/low: 89.2 / 72.1 F
- Daily wind max: 15.2 mph
- Daily precip: 0.6377952755905512 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:42 / 20:29

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Buzzbait `buzzbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Buzzbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Moderate chop supports a slightly more open lake posture.
- Daily note: Recent rain keeps the lake bite a little more controlled and selective.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## lmb_matrix_midwest_dirty_backwater_10

- Label: Midwest dirty backwater lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater fall: spinnerbait at position 0 with dirty clarity bonus dominates the FALL_LAKE pool; bladed jig and lipless crankbait round out the dirty-water baitfish set; clear-water lures are suppressed.
Expected primary lanes:
- spinnerbait
- bladed_jig
- lipless_crankbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- swim_jig
- compact_flipping_jig
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
- walking_topwater
Expected color themes:
- natural
- bright
- dark

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 73.1 F
- Noon pressure: 1022.2 mb
- Noon cloud cover: 39%
- Daily high/low: 73.8 / 57.5 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 18:21

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (5.7/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Dirty water calls for more visibility and presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

