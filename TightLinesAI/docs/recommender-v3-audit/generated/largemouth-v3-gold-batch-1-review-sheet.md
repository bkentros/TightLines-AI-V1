# Largemouth V3 Gold Batch 1 Review Sheet

Generated: 2026-04-14T00:53:28.803Z
Archive bundle generated: 2026-04-04T01:40:13.529Z
Scenario count: 10
Contexts: 8 lake/pond, 2 river
Priority mix: 8 core, 2 secondary
Completed engine runs: 10/10

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

## lmb_florida_jan_pond_postfront

- Label: Florida pond largemouth, winter post-front control day
- Priority: core
- Date: 2025-01-23
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 28.0614, -82.3026
- Engine status: complete

Expected seasonal story:
- Winter Florida bass should stay in a controlled bottom-to-lower-mid lane, not a surface lane.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- hollow_body_frog
- walking_topwater
- mouse_fly
Expected color themes:
- natural
- natural
- dark
Expectation notes:
- Daily warming may raise pace slightly, but should not create a drastic surface jump.

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 47.4 F
- Noon pressure: 1025.4 mb
- Noon cloud cover: 100%
- Daily high/low: 55.8 / 39 F
- Daily wind max: 10.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:18 / 18:03

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Shaky-Head Worm `shaky_head_worm` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Shaky-Head Worm: bright -> white/chartreuse, chartreuse, firetiger
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
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

## lmb_florida_mar_lake_prespawn

- Label: Florida natural lake largemouth, prespawn opening window
- Priority: core
- Date: 2025-03-20
- State: FL
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 28.5383, -81.3792
- Engine status: complete

Expected seasonal story:
- Prespawn Florida largemouth should allow moving bait and jerkbait lanes without abandoning bottom-control options.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- compact_flipping_jig
Acceptable secondary lanes:
- spinnerbait
- weightless_stick_worm
- swim_jig
Disallowed lanes:
- blade_bait
- mouse_fly
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 76.7 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 0%
- Daily high/low: 82.6 / 55.8 F
- Daily wind max: 18.2 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:27 / 19:38

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
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

## lmb_texas_feb_reservoir_wind

- Label: Texas reservoir largemouth, late-winter windy baitfish day
- Priority: core
- Date: 2025-02-19
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Southern reservoir bass can lean baitfish and wind-reactive, but truly harsh late-winter cold snaps can still collapse the day back toward a football jig while keeping one moving-lane backup alive.
Expected primary lanes:
- football_jig
- spinnerbait
- bladed_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- texas_rigged_soft_plastic_craw
- swim_jig
Disallowed lanes:
- hollow_body_frog
- popper_fly
Expected color themes:
- natural
- bright
- dark

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
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
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

## lmb_georgia_apr_highland_clear

- Label: Highland reservoir largemouth, clear-water spring setup
- Priority: core
- Date: 2025-04-16
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Clear highland largemouth in spring can still tighten into target cover and shallow finesse on cold, bright days even when baitfish lanes remain seasonally relevant.
Expected primary lanes:
- weightless_stick_worm
- compact_flipping_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- swim_jig
- soft_jerkbait
- clouser_minnow
- woolly_bugger
Disallowed lanes:
- hollow_body_frog
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
- Top 1 lure: Wacky-Rigged Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Compact Flipping Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
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

## lmb_alabama_may_river_current

- Label: Alabama river largemouth, spring current seam pattern
- Priority: core
- Date: 2025-05-12
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- River largemouth should still reflect bass current positioning instead of generic lake behavior.
Expected primary lanes:
- spinnerbait
- swim_jig
- soft_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 73.3 F
- Noon pressure: 1012.4 mb
- Noon cloud cover: 90%
- Daily high/low: 74.2 / 61.7 F
- Daily wind max: 11.1 mph
- Daily precip: 0.6614173228346457 in
- Moon phase: Full Moon
- Sunrise/sunset: 05:47 / 19:46

Actual output:
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=top, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
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

## lmb_mississippi_jun_backwater_dirty

- Label: Mississippi backwater largemouth, warm stained summer cover day
- Priority: secondary
- Date: 2025-06-18
- State: TN
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 35.143, -90.052
- Engine status: complete

Expected seasonal story:
- Warm dirty river largemouth should favor visible cover-oriented lanes first; cleaner baitfish flies can exist only as a low-priority fallback rather than the core story.
Expected primary lanes:
- compact_flipping_jig
- texas_rigged_soft_plastic_craw
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- frog_fly
- swim_jig
- clouser_minnow
Disallowed lanes:
- drop_shot_worm
Expected color themes:
- dark
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 83.5 F
- Noon pressure: 1014.7 mb
- Noon cloud cover: 39%
- Daily high/low: 86 / 72.9 F
- Daily wind max: 13.5 mph
- Daily precip: 0.7086614173228347 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:44 / 20:18

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral (4.9/10)
- Presentation presence today: bold
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=true, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
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

## lmb_newyork_aug_natural_lake_bluebird

- Label: Northeast largemouth, clear natural lake under bluebird conditions
- Priority: secondary
- Date: 2025-08-09
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Bluebird summer largemouth should tighten into cleaner, more controlled options.
Expected primary lanes:
- weightless_stick_worm
- weightless_stick_worm
- drop_shot_worm
Acceptable secondary lanes:
- shaky_head_worm
- rabbit_strip_leech
- soft_jerkbait
Disallowed lanes:
- buzzbait
- prop_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 78.9 F
- Noon pressure: 1022.8 mb
- Noon cloud cover: 0%
- Daily high/low: 82.9 / 64.2 F
- Daily wind max: 7.1 mph
- Daily precip: 0 in
- Moon phase: Full Moon
- Sunrise/sunset: 06:06 / 20:18

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
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

## lmb_louisiana_sep_shallow_grass

- Label: Louisiana largemouth, early-fall stained grass pattern
- Priority: core
- Date: 2025-09-17
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Early-fall southern largemouth should open surface and horizontal cover lanes more freely than summer bluebird windows.
Expected primary lanes:
- walking_topwater
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- hollow_body_frog
- bladed_jig
- popper_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- natural
- bright

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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
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

## lmb_ozarks_oct_shad_transition

- Label: Ozarks largemouth, fall shad transition reservoir day
- Priority: core
- Date: 2025-10-11
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Fall largemouth should strongly respect baitfish transition lanes, and on calm mixed-light shad days a suspending jerkbait can lead without breaking the transition story.
Expected primary lanes:
- squarebill_crankbait
- spinnerbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- flat_sided_crankbait
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
- Noon air temp: 70.2 F
- Noon pressure: 1018.4 mb
- Noon cloud cover: 40%
- Daily high/low: 76.1 / 55.5 F
- Daily wind max: 6.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:15 / 18:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.8/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
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

## lmb_texas_dec_pond_cold_clear

- Label: Texas pond largemouth, early-winter clear slowdown
- Priority: core
- Date: 2025-12-14
- State: TX
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 32.7767, -96.797
- Engine status: complete

Expected seasonal story:
- Early-winter largemouth should tighten to slower lower-column lanes with only mild daily openings.
Expected primary lanes:
- football_jig
- shaky_head_worm
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 34 F
- Noon pressure: 1038.7 mb
- Noon cloud cover: 100%
- Daily high/low: 49.3 / 27.6 F
- Daily wind max: 7.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:20 / 17:23

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Shaky-Head Worm `shaky_head_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Football Jig: natural -> green pumpkin, olive, smoke
- Shaky-Head Worm: natural -> green pumpkin, olive, smoke
- Texas-Rigged Soft-Plastic Craw: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=deep, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, precipitation_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
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

