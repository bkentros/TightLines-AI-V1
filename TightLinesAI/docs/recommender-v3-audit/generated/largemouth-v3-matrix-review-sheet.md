# Largemouth V3 Matrix Review Sheet

Generated: 2026-04-14T21:04:59.074Z
Archive bundle generated: 2026-04-12T18:28:37.533Z
Scenario count: 126
Contexts: 104 lake/pond, 22 river
Priority mix: 48 core, 78 secondary
Completed engine runs: 110/126

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Football Jig `football_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid/upper, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays in the middle band where the seasonal setup is most stable today. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Articulated Dungeon Streamer: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Wacky-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Wacky-Rigged Stick Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different finesse subtle look without leaving today's window.
- Wacky-Rigged Stick Worm how: Pin the hook through the center and pitch it in; give it complete slack on the fall, then barely move it — the ends flutter with zero effort on a dead-stick. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Bright light trims the day back toward cleaner looks. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

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
- Florida May postspawn largemouth should still stay shallow and target-oriented, but in the current seasonal pool that means texas-rigged stick worm, swim jig, compact jig, and paddle-tail style follow-ups rather than the older stick-worm-only finesse spread.
Expected primary lanes:
- texas_rigged_stick_worm
- swim_jig
- compact_flipping_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Stick Worm `texas_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Texas-Rigged Stick Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Stick Worm how: Cast to cover and give it slack on the fall; if nothing bites, drag it along the bottom in slow sweeps and pause any time you feel resistance. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.

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
- Top 1 lure: Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog `hollow_body_frog` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Topwater Popper `popping_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Mouse Fly `mouse_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Topwater Popper: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Mouse Fly: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Swim Jig: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Hollow-Body Frog: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Hollow-Body Frog how: Twitch it just enough to make the legs kick; pause over every opening in the cover and count to three before moving — strikes on mats come after the pause. Keep it on top.
- Topwater Popper: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Topwater Popper how: Use rhythmic 1-2 pops followed by a pause; target the shadow of any surface feature and let the bait sit still in the ring for a count of three. Keep it on top.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Frog Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Mouse Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Mouse Fly how: Swim it on a constant slow retrieve just fast enough to leave a wake; target near-shore edges and structure where big fish expect food to cross. Keep it on top.

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
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Bladed Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Keep it high in the zone.
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Frog Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Clouser Minnow: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Bladed Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Keep it high in the zone.
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Frog Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Clouser Minnow: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_suppressed
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Bladed Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Woolly Bugger tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.

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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Slow down and lengthen the pause.
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Slow down and lengthen the pause.

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
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Bladed Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Slow down and lengthen the pause.

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
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays low in the zone where this day still wants fish to hold.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's bottom column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Crawfish Streamer: It fits today's bottom column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

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
- Top 1 lure: Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Shaky-Head Worm: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Lure reasoning:
- Shaky-Head Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Bladed Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

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
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Football Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.

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
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Keep it high in the zone.
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

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
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Slow down and lengthen the pause.
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Woolly Bugger tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.

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
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools, and texas-rigged craw remains a legitimate core brush-control answer on the hotter archived July/August windows.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
- texas_rigged_soft_plastic_craw
Acceptable secondary lanes:
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
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Football Jig: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=bottom/mid, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Compact Flipping Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Deep-Diving Crankbait: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Deep-Diving Crankbait how: Run it along drop-offs and ledges, keeping the line angle shallow so the lip catches bottom occasionally; pause on contact and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Crawfish Streamer: It fits today's bottom column preference. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

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
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools, and texas-rigged craw remains a legitimate core brush-control answer on the hotter archived July/August windows.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
- texas_rigged_soft_plastic_craw
Acceptable secondary lanes:
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
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=bottom/mid, paces=medium/slow/fast, presence=bold/moderate/subtle
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy.
- Deep-Diving Crankbait: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Deep-Diving Crankbait how: Make a long cast to reach depth, crank down hard, then keep a slow but steady pace so the bait stays near the bottom; feel for any change in resistance.
- Football Jig: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. That keeps a crawfish-first look in the water for the month. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.
- Clouser Minnow: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Crawfish Streamer: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Keep it low in the strike zone.

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
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools, and texas-rigged craw remains a legitimate core brush-control answer on the hotter archived July/August windows.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
- texas_rigged_soft_plastic_craw
Acceptable secondary lanes:
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
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Football Jig: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=bottom/mid, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Deep-Diving Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Deep-Diving Crankbait how: Make a long cast to reach depth, crank down hard, then keep a slow but steady pace so the bait stays near the bottom; feel for any change in resistance. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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
- Hot early-fall south-central reservoir largemouth can still let spinnerbait lead the schooling-shad story on suppressive stained-water days, with paddle tail, squarebill, and suspending jerkbait rotating behind it rather than forcing a squarebill-only read.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- bladed_jig
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Squarebill Crankbait how: Bang it directly into wood, rock, or stumps so the squared bill deflects the bait sideways — reaction strikes happen on that ricochet. Slow down and lengthen the pause.
- Bladed Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Woolly Bugger tracks well when leech_worm is a realistic meal.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Bladed Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Spinnerbait: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Late-fall south-central reservoir largemouth can collapse back into football-jig and shaky-head control on bright post-front reservoir days, while still keeping one baitfish-following option nearby.
Expected primary lanes:
- football_jig
- shaky_head_worm
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
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
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Shaky-Head Worm: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Shaky-Head Worm: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

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
- Top 1 lure: Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches today's moderate presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

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
- Top 1 lure: Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Shaky-Head Worm: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid/upper, paces=slow/medium, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Shaky-Head Worm: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. That keeps a crawfish-first look in the water for the month.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Compact Flipping Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Spinnerbait: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. Spinnerbait stays in play when baitfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

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
- Late-winter Alabama river largemouth can still stay controlled on cold, cooling prespawn days, but one current-seam moving lane should remain present.
Expected primary lanes:
- compact_flipping_jig
- spinnerbait
- woolly_bugger
Acceptable secondary lanes:
- soft_jerkbait
- swim_jig
- rabbit_strip_leech
- squarebill_crankbait
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_suppressed
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Compact Flipping Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Spinnerbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Bang it directly into wood, rock, or stumps so the squared bill deflects the bait sideways — reaction strikes happen on that ricochet. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Woolly Bugger tracks well when leech_worm is a realistic meal. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Spring Alabama river largemouth can let a soft jerkbait lead on cleaner, more open seam days, but spinnerbait and swim jig should stay in the core story.
Expected primary lanes:
- soft_jerkbait
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- squarebill_crankbait
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Spring Alabama river largemouth can let a soft jerkbait lead on cleaner, more open seam days, but spinnerbait and swim jig should stay in the core story.
Expected primary lanes:
- soft_jerkbait
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- squarebill_crankbait
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
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Squarebill Crankbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.

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
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Bladed Jig: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Keep it high in the zone.
- Squarebill Crankbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Crawfish Streamer: It lines up with today's medium pace preference. Slightly elevated runoff supports a more visible river presentation. Crawfish Streamer fits a fly bottom window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Keep it low in the strike zone.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: runoff_flow_disruption
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Keep it high in the zone.
- Bladed Jig: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Keep it high in the zone.
- Paddle-Tail Swimbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's moderate presence lane. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=upper, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Compact Flipping Jig: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It stays high enough in the zone to match the day's more open positioning.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. It stays practical in current seams and river lanes when flow still matters. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It matches today's moderate presence lane. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Late-fall Alabama river largemouth can let soft jerkbait or clouser-style baitfish presentations lead on clear, glare-heavy current-edge days without losing the horizontal river story.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- soft_jerkbait
- clouser_minnow
Acceptable secondary lanes:
- squarebill_crankbait
- bladed_jig
- game_changer
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom/upper, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Compact Flipping Jig stays in play when crawfish is relevant.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches today's moderate presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It matches today's moderate presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It matches today's moderate presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Late-fall Alabama river largemouth can let soft jerkbait or clouser-style baitfish presentations lead on clear, glare-heavy current-edge days without losing the horizontal river story.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- soft_jerkbait
- clouser_minnow
Acceptable secondary lanes:
- squarebill_crankbait
- bladed_jig
- game_changer
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_shock, light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Shaky-Head Worm: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid/upper, paces=slow/medium, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's mid column preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Shaky-Head Worm: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. That keeps a crawfish-first look in the water for the month. It is the cleaner change-up if the lead look does not convert.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Football Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Suspending Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Keep it high in the zone.
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Football Jig: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Crawfish Streamer: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Keep it low in the strike zone.
- Woolly Bugger: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.

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
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Wacky-Rigged Stick Worm: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Lure reasoning:
- Weightless Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Slow down and lengthen the pause.
- Compact Flipping Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Wacky-Rigged Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Wacky-Rigged Stick Worm how: Hook through the midsection, let it sink with a slow wobble, then lift and dead-stick with long pauses so both ends flutter. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Weightless Stick Worm: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/fast/slow, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. This window is still built around bluegill-and-perch feeding lanes.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. This window is still built around bluegill-and-perch feeding lanes. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. Clouser Minnow tracks well when baitfish is a realistic meal. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.
- Woolly Bugger: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/fast/slow, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. This window is still built around bluegill-and-perch feeding lanes.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. This window is still built around bluegill-and-perch feeding lanes. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. Clouser Minnow tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

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
- Northern GLUM-zone late-summer largemouth on the current northeast seasonal row is a cleaner worm-and-soft-jerkbait story: wacky rig, texas-rigged stick worm, drop-shot, and soft jerkbait should do the heavy lifting, without forcing swim jig or paddle-tail lanes that are no longer in the eligible pool.
Expected primary lanes:
- soft_jerkbait
- wacky_rigged_stick_worm
- texas_rigged_stick_worm
- drop_shot_worm
Acceptable secondary lanes:
- weightless_stick_worm
- shaky_head_worm
- carolina_rigged_stick_worm
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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Drop-Shot Worm: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It fits today's bottom column preference. Bright light trims the day back toward cleaner looks. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Walking Topwater: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=surface, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Walking Topwater: It fits today's surface column preference. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Paddle-Tail Swimbait: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Suspending Jerkbait: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Deceiver: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Medium-Diving Crankbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Medium-Diving Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Medium-Diving Crankbait how: Crank it to depth and keep a steady grind-and-stop retrieve; let it tick bottom intermittently to kick up sediment and trigger strikes. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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
- Northern late-fall natural-lake largemouth can let suspending jerkbait and squarebill lead the baitfish story once November stays open but cool, while paddle-tail, spinnerbait, and swim jig remain valid follow-up lanes.
Expected primary lanes:
- suspending_jerkbait
- squarebill_crankbait
- paddle_tail_swimbait
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- walking_topwater
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Swim Jig: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.

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
- Top 1 lure: Finesse Jig `finesse_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Finesse Jig `finesse_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Finesse Jig: dark -> black, black/blue, black/purple
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Finesse Jig: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today.
- Finesse Jig how: Crawl it slowly along bottom with short drags and tiny hops; the smaller profile should stay in the fish's face longer than a bulkier jig. Slow down and lengthen the pause.
- Drop-Shot Worm: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It stays in the middle band where the seasonal setup is most stable today. It gives you a different finesse subtle look without leaving today's window.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Conehead Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Conehead Streamer tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Let the cone dig and dart on each strip — medium pulls with pauses so the fly hunts just off the rocks or wood. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
- TOP3_PRIMARY_MISSING
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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Sculpin Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Weightless Stick Worm: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different finesse subtle look without leaving today's window.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Frog Fly `frog_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Frog Fly: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Soft Plastic Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Frog Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Woolly Bugger: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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

## lmb_matrix_michigan_clear_natural_lake_08

- Label: Michigan clear natural lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's mid column preference. A cooling trend tightens fish and shifts preference lower and slower. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

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

## lmb_matrix_michigan_clear_natural_lake_11

- Label: Michigan clear natural lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 44.9747, -85.2278
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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

## lmb_matrix_wisconsin_clear_weed_lake_04

- Label: Wisconsin clear weed lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Compact Flipping Jig: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Weightless Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Slow down and lengthen the pause.
- Wacky-Rigged Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. That fits the slower worm-and-leech food profile this window still allows. It gives you a different finesse subtle look without leaving today's window.
- Wacky-Rigged Stick Worm how: Hook through the midsection, let it sink with a slow wobble, then lift and dead-stick with long pauses so both ends flutter. Slow down and lengthen the pause.
- Compact Flipping Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. That fits the slower worm-and-leech food profile this window still allows. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

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
- Wisconsin clear weed-lake summer largemouth can still rotate between swim jig, weightless/wacky finesse, and one clean surface lane, but suppressed bluebird days should let the finesse worm take over instead of forcing topwater.
Expected primary lanes:
- swim_jig
- weightless_stick_worm
- wacky_rigged_stick_worm
- walking_topwater
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
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
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Active precipitation disruption narrows the clean bite window.
- Lure reasoning:
- Weightless Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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

## lmb_matrix_wisconsin_clear_weed_lake_08

- Label: Wisconsin clear weed lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: pending_archived_env_data

Expected seasonal story:
- Wisconsin clear weed-lake summer largemouth can still rotate between swim jig, weightless/wacky finesse, and one clean surface lane, but suppressed bluebird days should let the finesse worm take over instead of forcing topwater.
Expected primary lanes:
- swim_jig
- weightless_stick_worm
- wacky_rigged_stick_worm
- walking_topwater
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Wisconsin fall weed-lake largemouth should still center on horizontal edge lanes, but cooler or subtler archived days can let paddle-tail or suspending jerkbait edge ahead of spinnerbait while swim jig stays in the core story.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- walking_topwater
- hollow_body_frog
- squarebill_crankbait
- bladed_jig
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Spinnerbait `spinnerbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: suppressed
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Spinnerbait: natural -> green pumpkin, olive, smoke
- Squarebill Crankbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Bang it directly into wood, rock, or stumps so the squared bill deflects the bait sideways — reaction strikes happen on that ricochet. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Woolly Bugger tracks well when leech_worm is a realistic meal.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

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
- Wisconsin fall weed-lake largemouth should still center on horizontal edge lanes, but cooler or subtler archived days can let paddle-tail or suspending jerkbait edge ahead of spinnerbait while swim jig stays in the core story.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- walking_topwater
- hollow_body_frog
- squarebill_crankbait
- bladed_jig
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Deceiver `deceiver` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Deceiver: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Swim Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

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
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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

## lmb_matrix_illinois_backwater_river_04

- Label: Illinois backwater river, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: IL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 40.3, -90.04
- Engine status: pending_archived_env_data

Expected seasonal story:
- Spring Illinois river-backwater largemouth should still fish around wood, eddies, and soft current with moving seam lanes and one controlled backup.
Expected primary lanes:
- swim_jig
- spinnerbait
- compact_flipping_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- texas_rigged_stick_worm
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Swim Jig `swim_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Texas-Rigged Stick Worm `texas_rigged_stick_worm` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Stick Worm: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Slow down and lengthen the pause.
- Texas-Rigged Stick Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Stick Worm how: Cast to cover and give it slack on the fall; if nothing bites, drag it along the bottom in slow sweeps and pause any time you feel resistance. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Deceiver: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=upper, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, runoff_flow_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Lure reasoning:
- Compact Flipping Jig: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Suspending Jerkbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Spinnerbait: It fits today's upper column preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. It stays practical in current seams and river lanes when flow still matters. Woolly Bugger tracks well when leech_worm is a realistic meal.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Deceiver: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Strip in long, smooth pulls so the saddle feathers breathe; add a pause every few strips for followers to close the gap. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Conehead Streamer `conehead_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Flat-Sided Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Conehead Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Football Jig: It fits today's mid column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast. Slow down and lengthen the pause.
- Flat-Sided Crankbait: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Flat-Sided Crankbait how: Use a steady retrieve with subtle rod-tip pumps to vary the bait's depth and roll; works along transitional depths and current seams. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: It lines up with today's slow pace preference. Reduced visibility supports a stronger profile fish can find more easily. Conehead Streamer tracks well when baitfish is a realistic meal. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Sculpin Streamer tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

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
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. That keeps a crawfish-first look in the water for the month. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Lipless Crankbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. Lipless Crankbait stays in play when baitfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

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

## lmb_matrix_ohio_reservoir_06

- Label: Ohio inland reservoir, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: OH
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 40.367, -82.9962
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Minnow: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Drop-Shot Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Minnow how: Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Deep-Diving Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deep-Diving Crankbait how: Make a long cast to reach depth, crank down hard, then keep a slow but steady pace so the bait stays near the bottom; feel for any change in resistance. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Ohio late-fall reservoir largemouth should stay on disciplined lower-column baitfish and jig lanes once true cold arrives, with football jig, finesse jig, and jerkbait all valid leaders depending on how subtle the archived day gets.
Expected primary lanes:
- football_jig
- finesse_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- drop_shot_worm
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
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast. Slow down and lengthen the pause.
- Blade Bait: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Conehead Streamer: It fits today's bottom column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.

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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Sculpin Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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

## lmb_matrix_pennsylvania_natural_lake_04

- Label: Pennsylvania natural lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: PA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 41.35, -75.6
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Weightless Stick Worm: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Northern GLUM-zone late-summer largemouth on the current northeast seasonal row is a cleaner worm-and-soft-jerkbait story: wacky rig, texas-rigged stick worm, drop-shot, and soft jerkbait should do the heavy lifting, without forcing swim jig or paddle-tail lanes that are no longer in the eligible pool.
Expected primary lanes:
- soft_jerkbait
- wacky_rigged_stick_worm
- texas_rigged_stick_worm
- drop_shot_worm
Acceptable secondary lanes:
- weightless_stick_worm
- shaky_head_worm
- carolina_rigged_stick_worm
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
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: precipitation_disruption
- Lure reasoning:
- Soft Plastic Jerkbait: It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches.
- Paddle-Tail Swimbait: It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.
- Suspending Jerkbait: It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.
- Woolly Bugger: It fits today's mid column preference. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It fits today's mid column preference. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

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
- Northern late-fall natural-lake largemouth can let suspending jerkbait and squarebill lead the baitfish story once November stays open but cool, while paddle-tail, spinnerbait, and swim jig remain valid follow-up lanes.
Expected primary lanes:
- suspending_jerkbait
- squarebill_crankbait
- paddle_tail_swimbait
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- walking_topwater
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Run it parallel to grass edges or fallen timber; keep the pace consistent so the skirt breathes, and pause briefly when it reaches the target zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping. Keep it high in the zone.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Football Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Texas-Rigged Soft-Plastic Craw stays in play when crawfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Georgia highland April-to-May largemouth should stay target-oriented first, but this is one of the southern spring windows where a frog can still be seasonally viable when low light and shallow cover line up.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
- hollow_body_frog
Disallowed lanes:
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
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Compact Flipping Jig `compact_flipping_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: suppressed
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Compact Flipping Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Wacky-Rigged Stick Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Wacky-Rigged Stick Worm how: Hook through the midsection, let it sink with a slow wobble, then lift and dead-stick with long pauses so both ends flutter. Slow down and lengthen the pause.
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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

## lmb_matrix_georgia_highland_05

- Label: Georgia highland reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: pending_archived_env_data

Expected seasonal story:
- Georgia highland April-to-May largemouth should stay target-oriented first, but this is one of the southern spring windows where a frog can still be seasonally viable when low light and shallow cover line up.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
- hollow_body_frog
Disallowed lanes:
- squarebill_crankbait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's mid column preference. Lower light supports a slightly higher, more open lane. It stays in the middle band where the seasonal setup is most stable today.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.
- Soft Plastic Jerkbait: It fits today's mid column preference. Lower light supports a slightly higher, more open lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length.
- Football Jig: It fits today's mid column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.
- Game Changer: It fits today's mid column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve.
- Crawfish Streamer: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. Crawfish Streamer tracks well when crawfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Keep it low in the strike zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Flat-Sided Crankbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Flat-Sided Crankbait how: Reel at a slow-to-medium pace; the tight wobble transmits through the line — slow down when you feel the bait tick structure. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.

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

## lmb_matrix_louisiana_grass_lake_05

- Label: Louisiana grass lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: pending_archived_env_data

Expected seasonal story:
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, but suppressed late-fall windows can pull the lead back toward compact jig or paddle-tail control instead of forcing a surface-first read.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
- compact_flipping_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- walking_topwater
- hollow_body_frog
- rabbit_strip_leech
- popper_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- dark
- bright
- natural

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Warm southern grass largemouth should still favor visible shallow-cover and baitfish lanes, but the current seasonal pool on this archived neutral June window is more soft-jerkbait, spinnerbait, swim-jig, and medium-crank than true frog-only surface behavior.
Expected primary lanes:
- soft_jerkbait
- spinnerbait
- swim_jig
- medium_diving_crankbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- wacky_rigged_stick_worm
- squarebill_crankbait
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
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Swim Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Swim Jig: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Spinnerbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Squarebill Crankbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

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
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, but suppressed late-fall windows can pull the lead back toward compact jig or paddle-tail control instead of forcing a surface-first read.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
- compact_flipping_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- walking_topwater
- hollow_body_frog
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
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.

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
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior, but suppressed late-fall windows can pull the lead back toward compact jig or paddle-tail control instead of forcing a surface-first read.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
- compact_flipping_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- walking_topwater
- hollow_body_frog
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Compact Flipping Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Compact Flipping Jig stays in play when crawfish is relevant. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Bladed Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Fly reasoning:
- Rabbit-Strip Leech: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Football Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Texas-Rigged Soft-Plastic Craw stays in play when crawfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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

## lmb_matrix_ozarks_reservoir_04

- Label: Ozarks reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Run it parallel to grass edges or fallen timber; keep the pace consistent so the skirt breathes, and pause briefly when it reaches the target zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Balanced Leech: It matches today's subtle presence lane. A warming trend nudges fish slightly higher in the allowed range. Balanced Leech tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Flat-Sided Crankbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Flat-Sided Crankbait how: Reel at a slow-to-medium pace; the tight wobble transmits through the line — slow down when you feel the bait tick structure. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Top 1 lure: Shaky-Head Worm `shaky_head_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Shaky-Head Worm `shaky_head_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Shaky-Head Worm: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Texas-Rigged Soft-Plastic Craw: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Shaky-Head Worm: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. A warming trend nudges fish slightly higher in the allowed range. Texas-Rigged Soft-Plastic Craw stays in play when crawfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
- TOP3_PRIMARY_MISSING
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Weightless Stick Worm: It fits today's upper column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It gives you a different finesse subtle look without leaving today's window.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Weightless Stick Worm: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Weightless Stick Worm: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.
- Soft Plastic Jerkbait: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches.
- Swim Jig: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.
- Woolly Bugger: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It fits today's mid column preference. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Northern early-fall weedline largemouth should open horizontal edge lanes through a cooler seasonal posture, with spinnerbait and swim jig ahead of the core story, but a walking topwater can still tag along as a warm-open secondary lane on this archived October window.
Expected primary lanes:
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- mouse_fly
- walking_topwater
Disallowed lanes:
- blade_bait
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Run it parallel to grass edges or fallen timber; keep the pace consistent so the skirt breathes, and pause briefly when it reaches the target zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Compact Flipping Jig: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Keep it high in the zone.
- Squarebill Crankbait: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Clouser Minnow: It lines up with today's medium pace preference. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

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

## lmb_matrix_california_delta_04

- Label: California Delta freshwater reach, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Summer Delta largemouth should favor grass/current ambush lanes and visible cover tools, and on surface-closed archived river days a soft jerkbait can legitimately outrank the frog while spinnerbait and swim jig stay in the core story.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Compact Flipping Jig: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Compact Flipping Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Compact Flipping Jig stays in play when crawfish is relevant.
- Compact Flipping Jig how: Get the bait right into the cover before moving it — thumb the spool on the drop, and if you don't feel a strike, give it one or two hops then move on. Slow down and lengthen the pause.
- Bladed Jig: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Slow down and lengthen the pause.
- Spinnerbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.

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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Rabbit-Strip Leech tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

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
- Southern California spring largemouth should still read prespawn-to-spawn first, but shallow cover and warming water can leave a real frog lane seasonally possible by late April into May even if it should not dominate every day.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
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
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Football Jig: It lines up with today's slow pace preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Lipless Crankbait how: Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Reduced visibility supports a stronger profile fish can find more easily. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

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

## lmb_matrix_socal_reservoir_05

- Label: Southern California reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: pending_archived_env_data

Expected seasonal story:
- Southern California spring largemouth should still read prespawn-to-spawn first, but shallow cover and warming water can leave a real frog lane seasonally possible by late April into May even if it should not dominate every day.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
- hollow_body_frog
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Top 1 lure: Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Drop-Shot Minnow: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Deep-Diving Crankbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Drop-Shot Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Minnow how: Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Deep-Diving Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deep-Diving Crankbait how: Make a long cast to reach depth, crank down hard, then keep a slow but steady pace so the bait stays near the bottom; feel for any change in resistance. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Lure reasoning:
- Spinnerbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Bladed Jig: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Lipless Crankbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- March Pacific Northwest bass lake is deep prespawn, but stained, bolder archived days can let squarebill jump out front while football jig, spinnerbait, and suspending jerkbait still define the core prespawn story.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
- squarebill_crankbait
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
- Top 1 lure: Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Bladed Jig `bladed_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Lipless Crankbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Lipless Crankbait how: Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top. Keep it high in the zone.
- Squarebill Crankbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Bladed Jig: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Dungeon Streamer: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. Articulated Dungeon Streamer tracks well when baitfish is a realistic meal. It gives you a different fly baitfish look without leaving today's window.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.
- Clouser Minnow: It lines up with today's medium pace preference. Lower light supports a slightly higher, more open lane. Clouser Minnow tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=upper, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Football Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Squarebill Crankbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Squarebill Crankbait how: Bang it directly into wood, rock, or stumps so the squared bill deflects the bait sideways — reaction strikes happen on that ricochet. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

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
- Top 1 lure: Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Drop-Shot Minnow `drop_shot_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Hollow-Body Frog `hollow_body_frog` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Frog Fly `frog_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Drop-Shot Minnow: dark -> black, black/blue, black/purple
- Hollow-Body Frog: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Frog Fly: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Lure reasoning:
- Drop-Shot Minnow: It fits today's bottom column preference. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold.
- Drop-Shot Minnow how: Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone. Slow down and lengthen the pause.
- Hollow-Body Frog: It matches today's moderate presence lane. Even with a little ripple, the surface lane is still open enough to matter. Hollow-Body Frog stays in play when bluegill_perch is relevant. It gives you a different cover weedless look without leaving today's window.
- Hollow-Body Frog how: Twitch it just enough to make the legs kick; pause over every opening in the cover and count to three before moving — strikes on mats come after the pause. Work it with longer pauses.
- Paddle-Tail Swimbait: It matches today's moderate presence lane. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Frog Fly: It matches today's moderate presence lane. Even with a little ripple, the surface lane is still open enough to matter. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Work it with longer pauses.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Conehead Streamer `conehead_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Flat-Sided Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Conehead Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Football Jig: It fits today's mid column preference. Reduced visibility supports a stronger profile fish can find more easily. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Flat-Sided Crankbait: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Flat-Sided Crankbait how: Use a steady retrieve with subtle rod-tip pumps to vary the bait's depth and roll; works along transitional depths and current seams. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Drop it into cover or along grass edges and count it down; short one-inch hops with a pause mimics a crawfish on the bottom — don't rush the next cast. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: It lines up with today's slow pace preference. Reduced visibility supports a stronger profile fish can find more easily. Conehead Streamer tracks well when baitfish is a realistic meal. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: It lines up with today's slow pace preference. A warming trend nudges fish slightly higher in the allowed range. Sculpin Streamer tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

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
- Top 1 lure: Finesse Jig `finesse_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Finesse Jig `finesse_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Shaky-Head Worm `shaky_head_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Finesse Jig: dark -> black, black/blue, black/purple
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Shaky-Head Worm: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Finesse Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Finesse Jig how: Crawl it slowly along bottom with short drags and tiny hops; the smaller profile should stay in the fish's face longer than a bulkier jig. Slow down and lengthen the pause.
- Drop-Shot Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different finesse subtle look without leaving today's window.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Shaky-Head Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It is the cleaner change-up if the lead look does not convert.
- Shaky-Head Worm how: Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Conehead Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. Conehead Streamer tracks well when baitfish is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Let the cone dig and dart on each strip — medium pulls with pauses so the fly hunts just off the rocks or wood. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Football Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Texas-Rigged Soft-Plastic Craw: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Football Jig: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. That keeps a crawfish-first look in the water for the month. It is the cleaner change-up if the lead look does not convert.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Colorado highland reservoir summer largemouth should still be active, but this archived clear-water mountain window is not a true walking- or prop-bait surface setup; swim jig, hollow frog, and paddle-tail should lead, while a drop-shot can still linger only as a lower-ranked subtle backup when the high-elevation midsummer day tightens up.
Expected primary lanes:
- swim_jig
- hollow_body_frog
- paddle_tail_swimbait
Acceptable secondary lanes:
- compact_flipping_jig
- drop_shot_worm
Disallowed lanes:
- blade_bait
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
- Top 1 lure: Drop-Shot Minnow `drop_shot_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Drop-Shot Minnow `drop_shot_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Swim Jig `swim_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Minnow: natural -> green pumpkin, olive, smoke
- Swim Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Lure reasoning:
- Drop-Shot Minnow: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Drop-Shot Minnow stays in play when baitfish is relevant.
- Drop-Shot Minnow how: Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone. Slow down and lengthen the pause.
- Swim Jig: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. Woolly Bugger tracks well when leech_worm is a realistic meal.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's upper column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- October Colorado highland reservoir fall largemouth should open spinnerbait and baitfish-following lanes with clean natural colors, but subtle clear-water days can still let suspending jerkbait nosedive to the top of the same shad-following story.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
- suspending_jerkbait
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Medium-Diving Crankbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Suspending Jerkbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Medium-Diving Crankbait: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Medium-Diving Crankbait how: Crank it to depth and keep a steady grind-and-stop retrieve; let it tick bottom intermittently to kick up sediment and trigger strikes. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Game Changer: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Football Jig `football_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Football Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Drop-Shot Worm: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Football Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Sculpin Streamer: It lines up with today's slow pace preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Northeast clear-lake spawn and postspawn largemouth should open with finesse stick-worm lanes first; compact jig surfaces when crawfish-primary forage scoring edges it ahead of stick worms, and soft jerkbait can steal the lead on cleaner warming days that pull fish higher.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
- soft_jerkbait
Acceptable secondary lanes:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Weightless Stick Worm `weightless_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Weightless Stick Worm: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, precipitation_disruption
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. It stays high enough in the zone to match the day's more open positioning.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Soft Plastic Jerkbait: It fits today's upper column preference. It stays high enough in the zone to match the day's more open positioning. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Weightless Stick Worm: It fits today's upper column preference. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Weightless Stick Worm how: Cast weightless and let it sink on a slack line; the natural fall is the whole presentation — barely move it and dead-stick with long pauses. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: It matches today's subtle presence lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull.
- Clouser Minnow: It lines up with today's medium pace preference. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
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
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: suppressed
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Wacky-Rigged Stick Worm: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom/upper, paces=medium/fast/slow, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Drop-Shot Worm: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Wacky-Rigged Stick Worm: It lines up with today's slow pace preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different finesse subtle look without leaving today's window.
- Wacky-Rigged Stick Worm how: Hook through the midsection, let it sink with a slow wobble, then lift and dead-stick with long pauses so both ends flutter. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: It matches today's subtle presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. This window is still built around bluegill-and-perch feeding lanes. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Rabbit-Strip Leech: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Rabbit-Strip Leech how: Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

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

## lmb_matrix_northeast_maine_lake_08

- Label: Maine clear natural lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Northeast November clear-lake largemouth stays in active fall posture, but clear-water late-fall days can still let suspending jerkbait and squarebill edge ahead while spinnerbait, swim jig, and paddle-tail remain part of the same baitfish story.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
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
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Swim Jig `swim_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Deceiver `deceiver` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Deceiver: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Paddle-Tail Swimbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Keep it high in the zone.
- Suspending Jerkbait: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Swim Jig: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Run it parallel to grass edges or fallen timber; keep the pace consistent so the skirt breathes, and pause briefly when it reaches the target zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Deceiver how: Work it with a steady baitfish swim at medium cadence; slow down near structure and let it breathe on a semi-tight line between strips. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Cover water at mid-depth with steady strips; add a hard single rip followed by a full pause to imitate an injured baitfish fleeing and then stopping. Keep it high in the zone.

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
- Top 1 lure: Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Compact Flipping Jig `compact_flipping_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Compact Flipping Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=medium/slow/fast, presence=bold/moderate/subtle
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Compact Flipping Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today.
- Compact Flipping Jig how: Pendulum flip or pitch into heavy cover; let it free-fall on a semi-slack line, then hold and lift if the line jumps or goes heavy. Slow down and lengthen the pause.
- Lipless Crankbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different horizontal search look without leaving today's window.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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

## lmb_matrix_gulf_dirty_grass_lake_04

- Label: Gulf Coast dirty grass lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: pending_archived_env_data

Expected seasonal story:
- Gulf Coast spring grass largemouth should still be shallow-cover and baitfish-friendly first, but by April and especially May a frog can be seasonally viable around emergent grass when the same-day surface gate stays open.
Expected primary lanes:
- compact_flipping_jig
- swim_jig
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- hollow_body_frog
- frog_fly
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- bright
- natural
- dark

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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

## lmb_matrix_gulf_dirty_grass_lake_05

- Label: Gulf Coast dirty grass lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: pending_archived_env_data

Expected seasonal story:
- Gulf Coast spring grass largemouth should still be shallow-cover and baitfish-friendly first, but by April and especially May a frog can be seasonally viable around emergent grass when the same-day surface gate stays open.
Expected primary lanes:
- compact_flipping_jig
- swim_jig
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- hollow_body_frog
- frog_fly
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- bright
- natural
- dark

Archived env summary:
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Gulf Coast dirty fall grass lake should still favor dirty-friendly grass tools first, but once October knocks fish lower the core story can tighten around paddle-tail, spinnerbait, bladed jig, and swim-jig control instead of forcing a surface-first grass read.
Expected primary lanes:
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
- buzzbait
- prop_bait
- paddle_tail_swimbait
Acceptable secondary lanes:
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
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Bladed Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Swim Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Bladed Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Spinnerbait: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Swim Jig: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Swim Jig how: Reel at a steady medium pace just above cover, letting the trailer kick; vary depth by angling the rod up or down to keep it in the strike zone. Slow down and lengthen the pause.
- Fly reasoning:
- Game Changer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.
- Clouser Minnow: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Articulated Baitfish Streamer: It fits today's mid column preference. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Strip with moderate pulls so the articulated body pulses; mix fast strips with full stops where the fly sinks and the sections hinge naturally. Slow down and lengthen the pause.

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
- Gulf Coast dirty fall grass lake should still favor dirty-friendly grass tools first, but once October knocks fish lower the core story can tighten around paddle-tail, spinnerbait, bladed jig, and swim-jig control instead of forcing a surface-first grass read.
Expected primary lanes:
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
- buzzbait
- prop_bait
- paddle_tail_swimbait
Acceptable secondary lanes:
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
- Bladed Jig `bladed_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Lipless Crankbait `lipless_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Spinnerbait: dark -> black, black/blue, black/purple
- Bladed Jig: dark -> black, black/blue, black/purple
- Lipless Crankbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=mid/upper/bottom/surface, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Bladed Jig: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Yo-yo the blade: snap the rod so the head kicks and vibrates, then let it pendulum back with a controlled semi-slack fall. Slow down and lengthen the pause.
- Lipless Crankbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Slow down and lengthen the pause.

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
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Football Jig: bright -> white/chartreuse, chartreuse, firetiger
- Texas-Rigged Soft-Plastic Craw: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=mid/bottom/upper, paces=medium/slow/fast, presence=moderate/subtle/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, precipitation_disruption
- Daily note: Temperature metabolism suppresses the day and favors slower execution.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Football Jig: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Texas-Rigged Soft-Plastic Craw: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. That keeps a crawfish-first look in the water for the month. It gives you a different cover weedless look without leaving today's window.
- Texas-Rigged Soft-Plastic Craw how: Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.
- Lipless Crankbait: It matches today's bold presence lane. With true surface suppressed, this keeps you just under the cleaner active lane. Lipless Crankbait stays in play when baitfish is relevant. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Yo-yo it through open water: rip up sharply, let it flutter and sink on a semi-slack line, then rip again; vary fall depth by watching the line angle. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Woolly Bugger: It fits today's bottom column preference. With true surface suppressed, this keeps you just under the cleaner active lane. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: It fits today's bottom column preference. Temperature metabolism suppresses the day and favors slower execution. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

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

## lmb_matrix_midwest_dirty_backwater_04

- Label: Midwest dirty backwater lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: pending_archived_env_data

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
- Archived env bundle has not been built yet.

Actual output:
- Top 1 lure: 
- Top 3 lures:
- Top 1 fly: 
- Top 3 flies:
- Color notes:
- Daily profile notes:
- Lure reasoning:
- Fly reasoning:

Review:
- Precheck flags:
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
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Frog Fly `frog_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Swim Jig: bright -> white/chartreuse, chartreuse, firetiger
- Hollow-Body Frog: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Frog Fly: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Dungeon Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=bold/moderate/subtle
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Swim Jig: It fits today's upper column preference. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window.
- Swim Jig how: Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Keep it high in the zone.
- Hollow-Body Frog: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different cover weedless look without leaving today's window.
- Hollow-Body Frog how: Twitch it just enough to make the legs kick; pause over every opening in the cover and count to three before moving — strikes on mats come after the pause. Keep it on top.
- Paddle-Tail Swimbait: It fits today's upper column preference. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Frog Fly: It lines up with today's medium pace preference. Even with a little ripple, the surface lane is still open enough to matter. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly surface look without leaving today's window.
- Frog Fly how: Walk it across the surface with alternating rod twitches; slow to a crawl near pad edges and let it rest fully before the next move. Keep it on top.
- Articulated Dungeon Streamer: It lines up with today's medium pace preference. Dirty water demands more visibility. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Articulated Dungeon Streamer how: Use varied strip lengths with hard pauses after each burst; the fly should surge, then stall and hover like a wounded meal.

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
- Lipless Crankbait `lipless_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Deceiver `deceiver` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Bladed Jig: bright -> white/chartreuse, chartreuse, firetiger
- Lipless Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Deceiver: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/surface/bottom, paces=medium/fast/slow, presence=moderate/subtle/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: precipitation_disruption
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: It fits today's upper column preference. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Bladed Jig: It fits today's upper column preference. Dirty water demands more visibility. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different horizontal search look without leaving today's window.
- Bladed Jig how: Work it with a lift-fall cadence; pop the rod to make the blade kick and clack, then let it fall on a controlled line — fish typically strike on the fall. Keep it high in the zone.
- Lipless Crankbait: It fits today's upper column preference. Dirty water demands more visibility. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Lipless Crankbait how: Burn it at mid-speed and occasionally pop the rod tip to make the bait jump; over vegetation, rip it free when it ticks the top. Keep it high in the zone.
- Fly reasoning:
- Game Changer: It fits today's upper column preference. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: It fits today's upper column preference. Dirty water demands more visibility. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Deceiver: It fits today's upper column preference. Dirty water demands more visibility. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Deceiver how: Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Keep it high in the zone.

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

