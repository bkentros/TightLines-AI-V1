# Smallmouth V3 Matrix Review Sheet

Generated: 2026-04-17T18:35:19.527Z
Archive bundle generated: 2026-04-15T20:07:40.957Z
Scenario count: 83
Contexts: 36 lake/pond, 47 river
Priority mix: 48 core, 35 secondary
Completed engine runs: 83/83

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

## smb_matrix_great_lakes_clear_lake_01

- Label: Great Lakes clear natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear Great Lakes smallmouth winter should stay disciplined with tubes, hair, and jerkbait lanes in front.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- frog_fly
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 27.8 F
- Noon pressure: 1005.3 mb
- Noon cloud cover: 100%
- Daily high/low: 36.2 / 19.3 F
- Daily wind max: 21.2 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 08:10 / 17:26

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_02

- Label: Great Lakes clear natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear prespawn Great Lakes smallmouth should open jerkbait and tube lanes without drifting too aggressive too early.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- football_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 13.8 F
- Noon pressure: 1031.8 mb
- Noon cloud cover: 100%
- Daily high/low: 18.2 / 5.1 F
- Daily wind max: 13.8 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:30 / 18:13

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Ned Rig `ned_rig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Ned Rig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Ned Rig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Ned Rig how: Inch it along with small rod pops and long pauses; the mushroom head keeps it nose-down and upright — let it sit longer than you think is necessary. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Balanced Leech: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays in the middle band where the seasonal setup is most stable today. It gives you a different fly bottom look without leaving today's window.
- Balanced Leech how: Let it suspend just off bottom or under cover and move it only with tiny strips; the balanced posture is the trigger, not speed. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Pinch the fly to the bottom and move it in erratic 1-2 inch hops with long pauses; the slower and lower, the better — crawfish don't sprint. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_03

- Label: Great Lakes clear natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear prespawn Great Lakes smallmouth should open jerkbait and tube lanes without drifting too aggressive too early.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- football_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 29.3 F
- Noon pressure: 1006 mb
- Noon cloud cover: 100%
- Daily high/low: 31.5 / 21.8 F
- Daily wind max: 17.5 mph
- Daily precip: 0.26377952755905515 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:39 / 19:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Ned Rig `ned_rig` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Ned Rig: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Drag and shake the small head along bottom like a tiny craw — short pulls, let it settle, repeat instead of big hops. Slow down and lengthen the pause.
- Football Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Football Jig how: Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Balanced Leech: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_04

- Label: Great Lakes clear natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn clear-lake smallmouth should mix tube, drop-shot, and baitfish lanes with one clean surface option only when supported.
Expected primary lanes:
- tube_jig
- drop_shot_worm
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 39 F
- Noon pressure: 1019.3 mb
- Noon cloud cover: 0%
- Daily high/low: 41.1 / 27.6 F
- Daily wind max: 15.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:49 / 20:27

Actual output:
- Top 1 lure: Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Drop-Shot Minnow `drop_shot_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: suppressed
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Drop-Shot Minnow: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Drop-Shot Worm: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Drop-Shot Worm how: Hold the weight on the bottom and gently shake the rod tip so the worm quivers in place; move it only a foot or two before letting it settle again. Slow down and lengthen the pause.
- Drop-Shot Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It gives you a different finesse subtle look without leaving today's window.
- Drop-Shot Minnow how: Keep the bait just off bottom with tiny shakes and short glides so the minnow hovers naturally in the strike zone. Slow down and lengthen the pause.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Balanced Leech: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_05

- Label: Great Lakes clear natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn clear-lake smallmouth should mix tube, drop-shot, and baitfish lanes with one clean surface option only when supported.
Expected primary lanes:
- tube_jig
- drop_shot_worm
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 73.1 F
- Noon pressure: 1005.4 mb
- Noon cloud cover: 15%
- Daily high/low: 78.1 / 56.6 F
- Daily wind max: 13.9 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 21:03

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Tube Jig: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Flat-Sided Crankbait: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.
- Suspending Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Flat-Sided Crankbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Flat-Sided Crankbait how: Work it across hard bottom or rock piles with a consistent slow crank, letting the tight shimmy attract finicky fish holding close to structure. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Woolly Bugger tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_06

- Label: Great Lakes clear natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Early-summer clear Great Lakes smallmouth can legitimately open with a soft jerkbait or swimbait around a postspawn baitfish shift, while still keeping drop-shot and hair support in play.
Expected primary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- drop_shot_worm
Acceptable secondary lanes:
- hair_jig
- tube_jig
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 66.7 F
- Noon pressure: 1011 mb
- Noon cloud cover: 100%
- Daily high/low: 70.1 / 59.9 F
- Daily wind max: 7.1 mph
- Daily precip: 0.5511811023622047 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:49 / 21:30

Actual output:
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Soft Plastic Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. Hair Jig stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Mouse Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Mouse Fly how: Work it with a slow, uninterrupted retrieve across open water; the V-wake is the trigger, so keep it moving at a steady pace and stay alert. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Popper Fly: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Popper Fly how: Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow. Keep it on top.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_07

- Label: Great Lakes clear natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Summer clear-lake smallmouth should rotate between baitfish and finesse lanes, with topwater able to take the lead on strong active-surface days without becoming the default every day.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- hair_jig
- walking_topwater
Acceptable secondary lanes:
- tube_jig
- game_changer
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 81.9 F
- Noon pressure: 1010.7 mb
- Noon cloud cover: 19%
- Daily high/low: 84.3 / 67.8 F
- Daily wind max: 10.1 mph
- Daily precip: 1.1377952755905512 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 21:23

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Popper Fly `popper_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Popper Fly: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Active precipitation disruption narrows the clean bite window.
- Lure reasoning:
- Paddle-Tail Swimbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Active precipitation disruption narrows the clean bite window. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Keep it high in the zone.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Active precipitation disruption narrows the clean bite window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Fly reasoning:
- Mouse Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane.
- Mouse Fly how: Cast to structure and retrieve with a steady, slow V-wake strip; vary only slightly in speed and resist the urge to twitch — mice move in straight lines. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Active precipitation disruption narrows the clean bite window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Popper Fly: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Popper Fly how: Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow. Keep it on top.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_08

- Label: Great Lakes clear natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Summer clear-lake smallmouth should rotate between baitfish and finesse lanes, with topwater able to take the lead on strong active-surface days without becoming the default every day.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm
- hair_jig
- walking_topwater
Acceptable secondary lanes:
- tube_jig
- game_changer
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 72.6 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 0%
- Daily high/low: 76.6 / 55 F
- Daily wind max: 8.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:38 / 20:48

Actual output:
- Top 1 lure: Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Drop-Shot Worm `drop_shot_worm` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Hair Jig: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Drop-Shot Worm: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Hair Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses. Slow down and lengthen the pause.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Drop-Shot Worm: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Drop-Shot Worm how: Shake in place with light tension, then pause completely and let the worm hang still; most bites come when the bait barely moves at all. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Balanced Leech: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Balanced Leech how: Let it suspend just off bottom or under cover and move it only with tiny strips; the balanced posture is the trigger, not speed. Slow down and lengthen the pause.
- Slim Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. Slim Baitfish Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_09

- Label: Great Lakes clear natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, hair, blade, and controlled baitfish lanes with clean baitfish colors; on colder November days the late-fall finesse-jig lane can still legitimately surface.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- finesse_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 74 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 36%
- Daily high/low: 78 / 57.9 F
- Daily wind max: 7.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:18 / 19:47

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_10

- Label: Great Lakes clear natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, hair, blade, and controlled baitfish lanes with clean baitfish colors; on colder November days the late-fall finesse-jig lane can still legitimately surface.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- finesse_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 51.6 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 5%
- Daily high/low: 56.6 / 41.5 F
- Daily wind max: 7.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:53 / 18:55

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_11

- Label: Great Lakes clear natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, hair, blade, and controlled baitfish lanes with clean baitfish colors; on colder November days the late-fall finesse-jig lane can still legitimately surface.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- finesse_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 38.9 F
- Noon pressure: 1004.3 mb
- Noon cloud cover: 100%
- Daily high/low: 44.5 / 34.7 F
- Daily wind max: 18.8 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:31 / 17:14

Actual output:
- Top 1 lure: Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Hair Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Hair Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses. Slow down and lengthen the pause.
- Suspending Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Slow down and lengthen the pause.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Sculpin Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Inch it along the bottom with tight-line strips; sculpin barely swim, so keep the fly close to the substrate and use current for most of the motion. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_great_lakes_clear_lake_12

- Label: Great Lakes clear natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear Great Lakes smallmouth winter should stay disciplined with tubes, hair, and jerkbait lanes in front.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- frog_fly
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 24.4 F
- Noon pressure: 1000.8 mb
- Noon cloud cover: 100%
- Daily high/low: 22.9 / 9.3 F
- Daily wind max: 13.6 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 08:04 / 16:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Football Jig `football_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Football Jig: dark -> black, black/blue, black/purple
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Football Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Football Jig how: Work it with slow rod sweeps across rocky bottom, letting it tick and grind the structure rather than hop above it. Slow down and lengthen the pause.
- Drop-Shot Worm: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Drop-Shot Worm how: Shake in place with light tension, then pause completely and let the worm hang still; most bites come when the bait barely moves at all. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_01

- Label: Kentucky highland lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland winter smallmouth should stay lower-column and disciplined, but still allow jerkbait and hair-jig lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 45.8 F
- Noon pressure: 1017.9 mb
- Noon cloud cover: 0%
- Daily high/low: 54.3 / 27.4 F
- Daily wind max: 16.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:55 / 16:55

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Tube Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_02

- Label: Kentucky highland lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Windy stained prespawn smallmouth lakes should keep tube, jerkbait, and swimbait lanes in front.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- flat_sided_crankbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 22.2 F
- Noon pressure: 1029.7 mb
- Noon cloud cover: 100%
- Daily high/low: 18.7 / 9.8 F
- Daily wind max: 13.4 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:27 / 17:31

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hair Jig `hair_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: neutral
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Hair Jig: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Medium-Diving Crankbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. Medium-Diving Crankbait stays in play when baitfish is relevant. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Medium-Diving Crankbait how: Retrieve at a medium pace along depth contours, pausing after any bottom contact so the bait rises before diving back when you resume. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It can still drop into today's lower zone when the moment calls for it. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_03

- Label: Kentucky highland lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Windy stained prespawn smallmouth lakes should keep tube, jerkbait, and swimbait lanes in front.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- flat_sided_crankbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 42.2 F
- Noon pressure: 1014.5 mb
- Noon cloud cover: 100%
- Daily high/low: 56.2 / 36.4 F
- Daily wind max: 18.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 18:58

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Ned Rig `ned_rig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Ned Rig: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It can still drop into today's lower zone when the moment calls for it. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses. Slow down and lengthen the pause.
- Ned Rig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Ned Rig how: Drag and shake the small head along bottom like a tiny craw — short pulls, let it settle, repeat instead of big hops. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A sharp cooldown reinforces a lower daily lane. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A sharp cooldown reinforces a lower daily lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_04

- Label: Kentucky highland lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Late-spring stained smallmouth lakes should let tube, swimbait, and spinnerbait lanes work without turning into generic largemouth cover fishing.
Expected primary lanes:
- tube_jig
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- soft_jerkbait
- flat_sided_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 62.2 F
- Noon pressure: 1021.4 mb
- Noon cloud cover: 0%
- Daily high/low: 64.5 / 40.8 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 19:22

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Medium-Diving Crankbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Medium-Diving Crankbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Medium-Diving Crankbait how: Work it through mid-column structure at steady speed, varying rod angle to bump the lip on rock ledges or submerged debris. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_05

- Label: Kentucky highland lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Late-spring stained smallmouth lakes should let tube, swimbait, and spinnerbait lanes work without turning into generic largemouth cover fishing.
Expected primary lanes:
- tube_jig
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- soft_jerkbait
- flat_sided_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 79.5 F
- Noon pressure: 1007.4 mb
- Noon cloud cover: 75%
- Daily high/low: 86.1 / 68.4 F
- Daily wind max: 15.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:35 / 19:48

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Crawfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Keep it low in the strike zone.
- Woolly Bugger: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. Woolly Bugger tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_06

- Label: Kentucky highland lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior, while allowing walking topwater to lead on the better active windows you wanted preserved.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 80.2 F
- Noon pressure: 1014.9 mb
- Noon cloud cover: 100%
- Daily high/low: 84.8 / 71.3 F
- Daily wind max: 16.2 mph
- Daily precip: 0.2795275590551181 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:24 / 20:09

Actual output:
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Popper Fly `popper_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Mouse Fly `mouse_fly` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Walking Topwater: bright -> white/chartreuse, chartreuse, firetiger
- Soft Plastic Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Popper Fly: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Mouse Fly: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Walking Topwater: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Soft Plastic Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.
- Spinnerbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Mouse Fly: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Mouse Fly how: Swim it on a constant slow retrieve just fast enough to leave a wake; target near-shore edges and structure where big fish expect food to cross. Keep it on top.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_07

- Label: Kentucky highland lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior, while allowing walking topwater to lead on the better active windows you wanted preserved.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 88.2 F
- Noon pressure: 1015.5 mb
- Noon cloud cover: 26%
- Daily high/low: 92 / 73.5 F
- Daily wind max: 10.4 mph
- Daily precip: 0.1968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:37 / 20:05

Actual output:
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Topwater Popper `popping_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Walking Topwater: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Topwater Popper: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Walking Topwater: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Topwater Popper: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Topwater Popper how: Use rhythmic 1-2 pops followed by a pause; target the shadow of any surface feature and let the bait sit still in the ring for a count of three. Keep it on top.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_08

- Label: Kentucky highland lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior, while allowing walking topwater to lead on the better active windows you wanted preserved.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 87.7 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 23%
- Daily high/low: 90 / 72.7 F
- Daily wind max: 4.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:00 / 19:39

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Topwater Popper `popping_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Topwater Popper: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Walking Topwater: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different surface look without leaving today's window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Topwater Popper: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Topwater Popper how: Use rhythmic 1-2 pops followed by a pause; target the shadow of any surface feature and let the bait sit still in the ring for a count of three. Keep it on top.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_09

- Label: Kentucky highland lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 84.7 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 10%
- Daily high/low: 87.9 / 65.7 F
- Daily wind max: 7.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:28 / 18:51

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Slim Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Slim Baitfish Streamer how: Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_10

- Label: Kentucky highland lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 72.2 F
- Noon pressure: 1021.4 mb
- Noon cloud cover: 0%
- Daily high/low: 77.9 / 53.7 F
- Daily wind max: 7.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 18:10

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow. Keep it high in the zone.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_11

- Label: Kentucky highland lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 61.5 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 0%
- Daily high/low: 63.3 / 38 F
- Daily wind max: 6.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:19 / 16:39

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Bright light trims the day back toward cleaner looks. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_kentucky_highland_lake_12

- Label: Kentucky highland lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland winter smallmouth should stay lower-column and disciplined, but still allow jerkbait and hair-jig lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 45.3 F
- Noon pressure: 1005.1 mb
- Noon cloud cover: 36%
- Daily high/low: 39.3 / 25.8 F
- Daily wind max: 10.8 mph
- Daily precip: 0.09448818897637795 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 16:30

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hair Jig `hair_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Conehead Streamer `conehead_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Hair Jig: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Conehead Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_01

- Label: Tennessee current river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Winter Tennessee smallmouth should stay current-aware and controlled with tube, hair, and Ned lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- ned_rig
Acceptable secondary lanes:
- blade_bait
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- buzzbait
- prop_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 46.8 F
- Noon pressure: 1020.5 mb
- Noon cloud cover: 14%
- Daily high/low: 51.9 / 24.9 F
- Daily wind max: 11.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:45 / 17:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Blade Bait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Blade Bait how: Cast and hop it off bottom with quick wrist snaps, counting the flutter back down; strikes usually come on the fall, so stay in contact with semi-tight line. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_02

- Label: Tennessee current river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Prespawn stained river smallmouth should open spinnerbait and soft-minnow lanes while staying seam- and rock-aware.
Expected primary lanes:
- spinnerbait
- tube_jig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 37.9 F
- Noon pressure: 1024.5 mb
- Noon cloud cover: 100%
- Daily high/low: 26.4 / 19.5 F
- Daily wind max: 13.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:18 / 18:26

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_suppressed
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. Inline Spinner stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_03

- Label: Tennessee current river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Prespawn stained river smallmouth should open spinnerbait and soft-minnow lanes while staying seam- and rock-aware.
Expected primary lanes:
- spinnerbait
- tube_jig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 48.7 F
- Noon pressure: 1012.8 mb
- Noon cloud cover: 100%
- Daily high/low: 67.6 / 40.6 F
- Daily wind max: 21.2 mph
- Daily precip: 0.1220472440944882 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:40 / 19:51

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Ned Rig `ned_rig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Ned Rig: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A sharp cooldown reinforces a lower daily lane.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Drag and shake the small head along bottom like a tiny craw — short pulls, let it settle, repeat instead of big hops. Slow down and lengthen the pause.
- Spinnerbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A sharp cooldown reinforces a lower daily lane. It stays low in the zone where this day still wants fish to hold.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A sharp cooldown reinforces a lower daily lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_04

- Label: Tennessee current river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Late-spring river smallmouth should carry tube control plus clean seam-search lanes like soft jerkbait and inline spinner.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- squarebill_crankbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 59.5 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 0%
- Daily high/low: 65.7 / 40 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:02 / 20:13

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.
- Soft Plastic Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_05

- Label: Tennessee current river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Late-spring river smallmouth should carry tube control plus clean seam-search lanes like soft jerkbait and inline spinner.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- squarebill_crankbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 75 F
- Noon pressure: 1011.7 mb
- Noon cloud cover: 100%
- Daily high/low: 81.8 / 64.7 F
- Daily wind max: 14.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:32 / 20:37

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Zonker Streamer `zonker_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Squarebill Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Zonker Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Inline Spinner: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Squarebill Crankbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Spinnerbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_06

- Label: Tennessee current river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 79.9 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 55%
- Daily high/low: 83 / 68.6 F
- Daily wind max: 14.2 mph
- Daily precip: 0.047244094488188976 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:22 / 20:57

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Inline Spinner: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Inline Spinner: This is today's top overall read. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Walking Topwater: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_07

- Label: Tennessee current river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 86.4 F
- Noon pressure: 1018.2 mb
- Noon cloud cover: 24%
- Daily high/low: 91.8 / 73.7 F
- Daily wind max: 9.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:34 / 20:54

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Inline Spinner: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: runoff_flow_disruption
- Lure reasoning:
- Inline Spinner: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Inline Spinner how: Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone. Keep it high in the zone.
- Walking Topwater: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different surface look without leaving today's window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Zonker Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane.
- Zonker Streamer how: Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change. Keep it high in the zone.
- Popper Fly: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_08

- Label: Tennessee current river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 80.4 F
- Noon pressure: 1017 mb
- Noon cloud cover: 85%
- Daily high/low: 87.2 / 71.7 F
- Daily wind max: 6.3 mph
- Daily precip: 0.03149606299212599 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:56 / 20:30

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Inline Spinner: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: runoff_flow_disruption
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Inline Spinner: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Articulated Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_09

- Label: Tennessee current river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 77.4 F
- Noon pressure: 1018.4 mb
- Noon cloud cover: 12%
- Daily high/low: 83.4 / 63.8 F
- Daily wind max: 6 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:22 / 19:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink.
- Slim Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_10

- Label: Tennessee current river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 72.1 F
- Noon pressure: 1020.3 mb
- Noon cloud cover: 0%
- Daily high/low: 82.2 / 55.3 F
- Daily wind max: 12.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:44 / 19:04

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Slim Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Slim Baitfish Streamer how: Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_11

- Label: Tennessee current river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 55.1 F
- Noon pressure: 1022.2 mb
- Noon cloud cover: 0%
- Daily high/low: 65.9 / 35.4 F
- Daily wind max: 5.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 17:35

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything. Slow down and lengthen the pause.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Slim Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Slim Baitfish Streamer how: Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Sculpin Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Inch it along the bottom with tight-line strips; sculpin barely swim, so keep the fly close to the substrate and use current for most of the motion. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_tennessee_river_12

- Label: Tennessee current river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Winter Tennessee smallmouth should stay current-aware and controlled with tube, hair, and Ned lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- ned_rig
Acceptable secondary lanes:
- blade_bait
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- buzzbait
- prop_bait
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 48.1 F
- Noon pressure: 1007.5 mb
- Noon cloud cover: 5%
- Daily high/low: 46.2 / 33.9 F
- Daily wind max: 10.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:35 / 17:27

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hair Jig `hair_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Conehead Streamer `conehead_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Hair Jig: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Conehead Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=south_central, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Reduced visibility supports a stronger profile fish can find more easily. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_01

- Label: Pennsylvania clear river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear northern river smallmouth winter should stay lower-column and subtle with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 18.4 F
- Noon pressure: 1010.2 mb
- Noon cloud cover: 100%
- Daily high/low: 31.2 / 21.4 F
- Daily wind max: 14.5 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:33 / 17:06

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Drop-Shot Worm `drop_shot_worm` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Drop-Shot Worm: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Drop-Shot Worm: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Drop-Shot Worm how: Shake in place with light tension, then pause completely and let the worm hang still; most bites come when the bait barely moves at all. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_02

- Label: Pennsylvania clear river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear prespawn river smallmouth should open tube, Ned, and soft-minnow lanes while staying current-correct.
Expected primary lanes:
- tube_jig
- ned_rig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 13.6 F
- Noon pressure: 1030.2 mb
- Noon cloud cover: 100%
- Daily high/low: 15.9 / 7 F
- Daily wind max: 18 mph
- Daily precip: 0.08661417322834647 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:58 / 17:49

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: neutral
- Tube Jig: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Slow down and lengthen the pause.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_03

- Label: Pennsylvania clear river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear prespawn river smallmouth should open tube, Ned, and soft-minnow lanes while staying current-correct.
Expected primary lanes:
- tube_jig
- ned_rig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait
- prop_bait
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 52.7 F
- Noon pressure: 1001.4 mb
- Noon cloud cover: 100%
- Daily high/low: 53.8 / 32.6 F
- Daily wind max: 20.5 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:11 / 19:23

Actual output:
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Soft Plastic Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches. Keep it high in the zone.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Zonker Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays high enough in the zone to match the day's more open positioning.
- Zonker Streamer how: Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change. Keep it high in the zone.
- Crawfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Keep it low in the strike zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_04

- Label: Pennsylvania clear river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-spring clear river smallmouth should keep seam and rock behavior in front, not generic lake power.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 33.7 F
- Noon pressure: 1012.2 mb
- Noon cloud cover: 100%
- Daily high/low: 36 / 30 F
- Daily wind max: 22.3 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:25 / 19:54

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Twitch it with slack in the line so the bait darts and glides erratically; pause and let it sink a few inches between twitches.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_05

- Label: Pennsylvania clear river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-spring clear river smallmouth should keep seam and rock behavior in front, not generic lake power.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 66.6 F
- Noon pressure: 1011.2 mb
- Noon cloud cover: 48%
- Daily high/low: 71.6 / 55.5 F
- Daily wind max: 8.8 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:47 / 20:25

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Inline Spinner: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Inline Spinner: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Blade Bait stays in play when baitfish is relevant. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_06

- Label: Pennsylvania clear river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 75.7 F
- Noon pressure: 1012.1 mb
- Noon cloud cover: 98%
- Daily high/low: 78.6 / 64.9 F
- Daily wind max: 9.8 mph
- Daily precip: 0.2283464566929134 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:32 / 20:50

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `dark` | colors: black, black/blue, black/purple
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Squarebill Crankbait: dark -> black, black/blue, black/purple
- Walking Topwater: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_shock, light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Squarebill Crankbait: This is today's top overall read. It fishes cleanly for today's conditions. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Walking Topwater: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different surface look without leaving today's window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It fishes cleanly for today's conditions. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_07

- Label: Pennsylvania clear river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 82.6 F
- Noon pressure: 1015.9 mb
- Noon cloud cover: 100%
- Daily high/low: 83.1 / 67 F
- Daily wind max: 9.5 mph
- Daily precip: 0.2874015748031496 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:47 / 20:45

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Popper Fly `popper_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Squarebill Crankbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Popper Fly: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid/bottom, paces=medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Squarebill Crankbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window.
- Squarebill Crankbait how: Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.
- Suspending Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Popper Fly: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly surface look without leaving today's window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Slim Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Slim Baitfish Streamer how: Retrieve with a mix of short darts and longer glides; the thin profile tracks like a small minnow on a tight line. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_08

- Label: Pennsylvania clear river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 79.6 F
- Noon pressure: 1016.1 mb
- Noon cloud cover: 15%
- Daily high/low: 81.9 / 64 F
- Daily wind max: 10.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:16 / 20:13

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=bottom, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid/bottom, paces=medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Keep it low in the strike zone.
- Muddler Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Muddler Minnow how: Work it as a swung wet fly in current with minimal stripping; on still water, hop it along the bottom with slow, erratic pulls.
- Slim Baitfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_09

- Label: Pennsylvania clear river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 69.6 F
- Noon pressure: 1020 mb
- Noon cloud cover: 95%
- Daily high/low: 75.5 / 53.4 F
- Daily wind max: 8.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:51 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_10

- Label: Pennsylvania clear river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 51.6 F
- Noon pressure: 1020.5 mb
- Noon cloud cover: 17%
- Daily high/low: 54.2 / 40.5 F
- Daily wind max: 11.7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:21 / 18:29

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_11

- Label: Pennsylvania clear river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 38.2 F
- Noon pressure: 1004.9 mb
- Noon cloud cover: 100%
- Daily high/low: 38.9 / 33 F
- Daily wind max: 22 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:55 / 16:53

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Keep it high in the zone.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Woolly Bugger tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_pennsylvania_river_12

- Label: Pennsylvania clear river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear northern river smallmouth winter should stay lower-column and subtle with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 33.4 F
- Noon pressure: 993.9 mb
- Noon cloud cover: 100%
- Daily high/low: 25.8 / 13.3 F
- Daily wind max: 17.8 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:25 / 16:40

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Tube Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Slightly elevated runoff supports a more visible river presentation. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_wisconsin_natural_lake_05

- Label: Wisconsin natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin clear-lake spawn and postspawn should keep tube, drop-shot, and clean baitfish lanes in front.
Expected primary lanes:
- tube_jig
- drop_shot_worm
- paddle_tail_swimbait
Acceptable secondary lanes:
- hair_jig
- soft_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
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
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Tube Jig: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, precipitation_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Ned Rig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Ned Rig how: Inch it along with small rod pops and long pauses; the mushroom head keeps it nose-down and upright — let it sit longer than you think is necessary. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. Woolly Bugger tracks well when leech_worm is a realistic meal.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Balanced Leech: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. Balanced Leech tracks well when leech_worm is a realistic meal. It is the cleaner change-up if the lead look does not convert.
- Balanced Leech how: Count it down to the level you want, then use a very slow strip-pause cadence so the fly hangs horizontally through the zone. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_wisconsin_natural_lake_06

- Label: Wisconsin natural lake, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin early-summer natural-lake smallmouth can open with a soft jerkbait around a clean baitfish shift, but should still keep tube, drop-shot, and hair control nearby.
Expected primary lanes:
- soft_jerkbait
- drop_shot_worm
- tube_jig
Acceptable secondary lanes:
- hair_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 76.6 F
- Noon pressure: 1008.9 mb
- Noon cloud cover: 100%
- Daily high/low: 77.7 / 57.7 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:04 / 20:53

Actual output:
- Top 1 lure: Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Soft Plastic Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. Hair Jig stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Mouse Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane.
- Mouse Fly how: Work it with a slow, uninterrupted retrieve across open water; the V-wake is the trigger, so keep it moving at a steady pace and stay alert. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Popper Fly: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. The month is still baitfish-forward, and this stays inside that search lane. It is the cleaner change-up if the lead look does not convert.
- Popper Fly how: Work it with medium strips that spit and gurgle; slow the cadence near structure and let the fly rest after each pop — target the edge of any surface shadow. Keep it on top.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_wisconsin_natural_lake_08

- Label: Wisconsin natural lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin summer natural-lake smallmouth should still favor finesse and clean baitfish lanes even when surface windows exist.
Expected primary lanes:
- drop_shot_worm
- tube_jig
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 74.7 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 2%
- Daily high/low: 80.1 / 55.6 F
- Daily wind max: 10.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:55 / 20:09

Actual output:
- Top 1 lure: Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Hair Jig: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Hair Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses. Keep it high in the zone.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_wisconsin_natural_lake_10

- Label: Wisconsin natural lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin clear-lake fall smallmouth should move toward jerkbait, swimbait, and hair / blade lanes.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 51.5 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 8%
- Daily high/low: 56.7 / 41.8 F
- Daily wind max: 3.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:14 / 18:13

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: precipitation_disruption
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_minnesota_fall_lake_04

- Label: Minnesota northern lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Spring northern stained-lake smallmouth should still stay controlled around tube, hair, and jerkbait lanes rather than forcing a pure fall baitfish read too early.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 48.5 F
- Noon pressure: 1016 mb
- Noon cloud cover: 80%
- Daily high/low: 55.1 / 28.9 F
- Daily wind max: 13.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:26 / 20:10

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Tube Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Keep it high in the zone.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_minnesota_fall_lake_08

- Label: Minnesota northern lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- A stained northern summer lake can still lead with hair, swimbait, or tube lanes when the fish are roaming but not fully power-fishing.
Expected primary lanes:
- hair_jig
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- spinnerbait
- walking_topwater
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- bright
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
- Top 1 lure: Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Hair Jig: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=moderate
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: wind_condition, precipitation_disruption
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Hair Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_minnesota_fall_lake_10

- Label: Minnesota northern lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Stained Minnesota fall smallmouth should tighten around jerkbait, blade, hair, and swimbait lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- bright
- natural

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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_shock, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Medium-Diving Crankbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Medium-Diving Crankbait how: Retrieve at a medium pace along depth contours, pausing after any bottom contact so the bait rises before diving back when you resume.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Fly reasoning:
- Articulated Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_minnesota_fall_lake_11

- Label: Minnesota northern lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Stained Minnesota fall smallmouth should tighten around jerkbait, blade, hair, and swimbait lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 45.1 F
- Noon pressure: 1015.3 mb
- Noon cloud cover: 2%
- Daily high/low: 53.4 / 26 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:16 / 16:49

Actual output:
- Top 1 lure: Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Finesse Jig `finesse_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Finesse Jig: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=bottom/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Lure reasoning:
- Hair Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Moderate chop improves fishability and supports a stronger moving look. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Finesse Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Finesse Jig how: Pitch it to light cover or transitions and let it settle fully before moving it; small lifts and long pauses are the whole point. Slow down and lengthen the pause.
- Fly reasoning:
- Sculpin Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Rabbit-Strip Leech: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Rabbit-Strip Leech how: Cast and count it down, then use a strip-pause retrieve with exaggerated pauses — the pulse on the stop is when most fish commit. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_colorado_river_03

- Label: Colorado western river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Cold clear western river smallmouth prespawn should stay subtle and current-aware with tube, hair, and soft-minnow lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- soft_jerkbait
Acceptable secondary lanes:
- ned_rig
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 35.3 F
- Noon pressure: 1023.7 mb
- Noon cloud cover: 55%
- Daily high/low: 44.5 / 13.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 19:24

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Tube Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=mountain_west, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Paddle-Tail Swimbait stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Woolly Bugger: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Fish it on a dead-drift near the bottom, then come alive with a strip-pause retrieve through prime holding water; let the tail do most of the work. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_colorado_river_06

- Label: Colorado western river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Clear western summer river smallmouth should cover the full daily shift: tube- and bottom-fly finesse on heat- or runoff-stressed days, inline-spinner and soft-minnow search on active days.
Expected primary lanes:
- inline_spinner
- soft_jerkbait
- paddle_tail_swimbait
- tube_jig
- woolly_bugger
Acceptable secondary lanes:
- walking_topwater
- clouser_minnow
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- bright
- natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 82.5 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 0%
- Daily high/low: 90.4 / 58 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:45 / 20:39

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_suppressed
- Tube Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=mountain_west, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=surface/upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It can still drop into today's lower zone when the moment calls for it.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Soft Plastic Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Slow down and lengthen the pause.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Muddler Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Muddler Minnow how: Work it as a swung wet fly in current with minimal stripping; on still water, hop it along the bottom with slow, erratic pulls. Slow down and lengthen the pause.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_colorado_river_09

- Label: Colorado western river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Clear western fall river smallmouth should center on jerkbait, spinner, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- tube_jig
- clouser_minnow
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 72 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 0%
- Daily high/low: 76.7 / 46.2 F
- Daily wind max: 10.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:54 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=mountain_west, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_colorado_river_12

- Label: Colorado western river, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Early-winter western river smallmouth should stay lower-column and disciplined with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 49 F
- Noon pressure: 1024.3 mb
- Noon cloud cover: 44%
- Daily high/low: 49.9 / 32.4 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:16 / 16:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Drop-Shot Minnow `drop_shot_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Conehead Streamer `conehead_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Tube Jig: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Drop-Shot Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Conehead Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=mountain_west, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Hair Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different finesse subtle look without leaving today's window.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Drop-Shot Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Drop-Shot Minnow how: Use a subtle shake-pause cadence with the line tight enough to feel the bait; let the minnow suspend and look alive rather than dragging it forward. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Conehead Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Conehead Streamer how: Cast across or down, let it sink to depth, then strip with a jig-like cadence where the cone tips the fly nose-down on each pause. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_washington_river_04

- Label: Washington inland river, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Northwest clear river smallmouth should open tube, soft-minnow, and spinner lanes while staying river-specific.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 68.4 F
- Noon pressure: 1013.1 mb
- Noon cloud cover: 0%
- Daily high/low: 69.1 / 48.7 F
- Daily wind max: 15.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 19:47

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Tube Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Crawfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_washington_river_07

- Label: Washington inland river, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Summer northwest river smallmouth should allow topwater and spinner lanes, but only as current-aware river options.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 79.1 F
- Noon pressure: 1012.9 mb
- Noon cloud cover: 0%
- Daily high/low: 88.9 / 62.5 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:19 / 20:45

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Paddle-Tail Swimbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow.
- Soft Plastic Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Muddler Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Muddler Minnow how: Work it as a swung wet fly in current with minimal stripping; on still water, hop it along the bottom with slow, erratic pulls.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_washington_river_09

- Label: Washington inland river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Cool-season northwest river smallmouth should prioritize jerkbait, spinner, and swimbait lanes with a clean tube backup.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 74.1 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 0%
- Daily high/low: 82.4 / 56.1 F
- Daily wind max: 3.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:36 / 19:05

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_washington_river_11

- Label: Washington inland river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Cool-season northwest river smallmouth should prioritize jerkbait, spinner, and swimbait lanes with a clean tube backup.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 48.3 F
- Noon pressure: 1014.8 mb
- Noon cloud cover: 98%
- Daily high/low: 53.7 / 42.5 F
- Daily wind max: 5.5 mph
- Daily precip: 0.16929133858267717 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 16:28

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=inland_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Cast across current and strip steadily through the swing; add a momentary deadstop near structure so the wing collapses and then puffs back out. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_ohio_dirty_reservoir_04

- Label: Ohio dirty reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty prespawn and spawn-transition smallmouth reservoirs should stay disciplined but visible, letting spinnerbait and jerkbait lanes stay in play.
Expected primary lanes:
- spinnerbait
- tube_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- bright
- natural

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
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Spinnerbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It can still drop into today's lower zone when the moment calls for it.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Spinnerbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Spinnerbait how: Slow-roll it along the bottom edge of cover at a steady pace, keeping the blades just ticking; bump any piece of structure and let it rise. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It can still drop into today's lower zone when the moment calls for it. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_ohio_dirty_reservoir_06

- Label: Ohio dirty reservoir, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty summer smallmouth reservoirs should still use visible baitfish tools first. Controlled topwater is seasonally viable on open windows, but bright or more restrained days can still push the lead back to crankbait, spinnerbait, tube, or paddle-tail control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
- walking_topwater
Acceptable secondary lanes:
- medium_diving_crankbait
- hair_jig
- game_changer
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 78.8 F
- Noon pressure: 1012.7 mb
- Noon cloud cover: 100%
- Daily high/low: 82.8 / 67.9 F
- Daily wind max: 15.8 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:00 / 21:06

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Medium-Diving Crankbait: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Moderate chop improves fishability and supports a stronger moving look.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Suspending Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer. Keep it high in the zone.
- Medium-Diving Crankbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Medium-Diving Crankbait how: Retrieve at a medium pace along depth contours, pausing after any bottom contact so the bait rises before diving back when you resume.
- Fly reasoning:
- Game Changer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Articulated Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_ohio_dirty_reservoir_08

- Label: Ohio dirty reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty summer smallmouth reservoirs should still use visible baitfish tools first. Controlled topwater is seasonally viable on open windows, but bright or more restrained days can still push the lead back to crankbait, spinnerbait, tube, or paddle-tail control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
- walking_topwater
Acceptable secondary lanes:
- medium_diving_crankbait
- hair_jig
- game_changer
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
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
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_suppressed
- Spinnerbait: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: light_cloud_condition, precipitation_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Jerk, jerk, pause. The bait should dart and glide sideways on each twitch; dial the pause length to water temperature — colder means longer.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.
- Articulated Baitfish Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It gives you a different fly baitfish look without leaving today's window.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_ohio_dirty_reservoir_12

- Label: Ohio dirty reservoir, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty winter smallmouth reservoirs should stay lower-column and visible with jerkbait, blade, and hair/tube lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
- tube_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 38.8 F
- Noon pressure: 996.2 mb
- Noon cloud cover: 100%
- Daily high/low: 28.7 / 24.1 F
- Daily wind max: 15.5 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:42 / 17:07

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hair Jig `hair_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Conehead Streamer `conehead_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Hair Jig: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Conehead Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=midwest_interior, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=moderate
- Monthly baseline: columns=mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption
- Variables triggered: temperature_trend, light_cloud_condition, wind_condition, precipitation_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Strong wind reduces clean execution.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Fish it on a tight line at slow speed — the hair works best with tiny line pulses rather than big lifts; let it hang in the current or slack zone. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Conehead Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Dirty water demands more visibility. Conehead Streamer tracks well when baitfish is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Conehead Streamer how: Strip with consistent medium pulls; the cone keeps the fly diving nose-first on each retrieve, so use pauses to let it hunt and settle before the next strip. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_willamette_river_smb_04

- Label: Willamette River smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- April Willamette River smallmouth should open tube and soft-minnow lanes in WESTERN_MIXED spring posture with craw-primary colors.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56.2 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 0%
- Daily high/low: 63.3 / 38.8 F
- Daily wind max: 10.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:22 / 20:00

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: slightly_aggressive
- Tube Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Crawfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=pacific_northwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. That keeps a crawfish-first look in the water for the month. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. Paddle-Tail Swimbait stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Slow-roll near the bottom on a consistent retrieve; the paddle thumps best just barely above the substrate, so keep the rod tip down and the pace even. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Tick it along the bottom with short, nervous strips so the claws scratch and flare; keep it close to the substrate and pause after contact with any rock or root. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Woolly Bugger: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Woolly Bugger how: Fish it on a dead-drift near the bottom, then come alive with a strip-pause retrieve through prime holding water; let the tail do most of the work. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_willamette_river_smb_06

- Label: Willamette River smallmouth, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- June Willamette River smallmouth should be in active surface and search mode; walking topwater leads on active days with inline spinner and swimbait as baitfish support lanes.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 66 F
- Noon pressure: 1018.8 mb
- Noon cloud cover: 67%
- Daily high/low: 69.9 / 54.5 F
- Daily wind max: 11.4 mph
- Daily precip: 0.03543307086614173 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:23 / 21:03

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Popper Fly `popper_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Popper Fly: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=pacific_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: wind_condition, runoff_flow_disruption
- Lure reasoning:
- Paddle-Tail Swimbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Keep it high in the zone.
- Soft Plastic Jerkbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Soft Plastic Jerkbait how: Snap the rod sideways so the bait darts left or right, then drop the rod tip so it glides and sinks on a slack line before the next snap. Keep it high in the zone.
- Suspending Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Pop once with a short strip, let the rings settle for two seconds, then pop again; in calm conditions, longer pauses are always better. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_willamette_river_smb_09

- Label: Willamette River smallmouth, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- September Willamette River smallmouth hits the NORTHWEST_EARLY_FALL override — suspending jerkbait leads the baitfish-first fall window with inline spinner and swimbait as support.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 73.3 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 0%
- Daily high/low: 80.2 / 54.4 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 19:20

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=pacific_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Soft Plastic Jerkbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Soft Plastic Jerkbait how: Work it with a jerk-sink-jerk cadence; keep the line slightly slack between twitches so the bait moves unpredictably, and vary the pause length. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_willamette_river_smb_11

- Label: Willamette River smallmouth, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- November Willamette River smallmouth should center on suspending jerkbait and spinnerbait as baitfish lanes tighten in cool-season FALL_RIVER posture.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 57.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 78%
- Daily high/low: 58.9 / 49.5 F
- Daily wind max: 9.9 mph
- Daily precip: 0.1968503937007874 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:04 / 16:47

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=pacific_northwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Blade Bait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Fly reasoning:
- Articulated Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

## smb_matrix_northern_california_smb_river_03

- Label: Northern California smallmouth river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- March Northern California smallmouth river should open tube and soft-minnow lanes in WESTERN_MIXED spring posture with craw-primary crawfish-colored reads.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- spinnerbait
Acceptable secondary lanes:
- ned_rig
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56.4 F
- Noon pressure: 1026.3 mb
- Noon cloud cover: 100%
- Daily high/low: 60.5 / 39.6 F
- Daily wind max: 9.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 19:25

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Crawfish Streamer `crawfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Tube Jig: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Crawfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=northern_california, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.
- Crawfish Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Elevated runoff tightens fish and pulls the day lower and slower. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northern_california_smb_river_06

- Label: Northern California smallmouth river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- Northern California summer river smallmouth should be in active surface and baitfish-search mode; walking topwater leads on surface-active days, but tube jig takes over when wind and clear-water depth cues push fish to rocky mid-column holds.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 88.1 F
- Noon pressure: 1011.5 mb
- Noon cloud cover: 0%
- Daily high/low: 90.9 / 58.6 F
- Daily wind max: 14.3 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:45 / 20:41

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: neutral
- Tube Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral
- Seasonal source: region=northern_california, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast across current and let the blade flash on a quarter-downstream retrieve; speed up briefly after bumps or short strikes. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays in the middle band where the seasonal setup is most stable today.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Heat stress moves fish to cooler, deeper water and narrows the feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northern_california_smb_river_08

- Label: Northern California smallmouth river, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- Northern California summer river smallmouth should be in active surface and baitfish-search mode; walking topwater leads on surface-active days, but tube jig takes over when wind and clear-water depth cues push fish to rocky mid-column holds.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 86.9 F
- Noon pressure: 1012.6 mb
- Noon cloud cover: 0%
- Daily high/low: 93.6 / 58.2 F
- Daily wind max: 13.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:09

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Ned Rig `ned_rig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Tube Jig: natural -> green pumpkin, olive, smoke
- Ned Rig: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northern_california, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_shock, light_cloud_condition, runoff_flow_disruption
- Daily note: Bright light trims the day back toward cleaner looks.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Ned Rig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Ned Rig how: Cast and let it settle fully to the bottom, then drag very slowly with the rod held low; pause between moves so the tail stands upright and wiggles. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast across current and let the blade flash on a quarter-downstream retrieve; speed up briefly after bumps or short strikes. Slow down and lengthen the pause.
- Fly reasoning:
- Balanced Leech: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today.
- Balanced Leech how: Fish it under an indicator or on a slow hand-twist so the fly hovers level and pulses in place rather than diving nose-first. Slow down and lengthen the pause.
- Sculpin Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northern_california_smb_river_10

- Label: Northern California smallmouth river, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- October Northern California river smallmouth should center on suspending jerkbait and spinnerbait as baitfish lanes tighten in FALL_RIVER posture.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 60.1 F
- Noon pressure: 1019.1 mb
- Noon cloud cover: 100%
- Daily high/low: 63.7 / 52.2 F
- Daily wind max: 4.8 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:20 / 18:34

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=northern_california, fallback_used=false
- Daily preference: column=mid, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Blade Bait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different reaction mid column look without leaving today's window.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Slow down and lengthen the pause.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting. Slow down and lengthen the pause.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northeast_connecticut_river_04

- Label: Connecticut River smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast spring river smallmouth should open tube and soft-minnow lanes in standard NORTHERN_COLD spring posture.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 45.5 F
- Noon pressure: 1003.7 mb
- Noon cloud cover: 71%
- Daily high/low: 47.6 / 38.4 F
- Daily wind max: 16.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 19:34

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: suppressed
- Tube Jig: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=mid, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, light_cloud_condition, wind_condition, runoff_flow_disruption
- Daily note: Cold metabolism shuts down activity. Slow and low is the only play.
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Cast across, let it sink on a controlled slack line, then swim it back with short pauses so the marabou pulses and collapses.
- Fly reasoning:
- Clouser Minnow: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Use a mix of steady strips and sharp 6-inch twitches so the jointed body swims and stalls; pause when you see a follow.
- Zonker Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays in the middle band where the seasonal setup is most stable today. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Zonker Streamer how: Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northeast_connecticut_river_06

- Label: Connecticut River smallmouth, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast June river smallmouth hits the NORTHEAST_SUMMER_RIVER override — bold topwater presentation leads with walking topwater and inline spinner, confirming the northeast-specific aggressive early-summer surface window distinct from the GLUM spring-holdover posture.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- popping_topwater
- spinnerbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 69.8 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 100%
- Daily high/low: 77.8 / 63 F
- Daily wind max: 7.9 mph
- Daily precip: 0.25984251968503935 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:11 / 20:31

Actual output:
- Top 1 lure: Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Walking Topwater `walking_topwater` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Popper Fly `popper_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Walking Topwater: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Popper Fly: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=surface, pace=medium, presence=moderate
- Monthly baseline: columns=surface/upper/mid, paces=medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Slightly elevated runoff supports a more visible river presentation.
- Lure reasoning:
- Walking Topwater: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Walking Topwater how: Downrod with light wrist flicks to make it dance; the pause between twitches lets fish track and commit, so give it a beat before the next twitch. Keep it on top.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Fly reasoning:
- Popper Fly: This is today's top overall read. It matches the column/pace the conditions push toward today. Low disturbance is keeping a true surface lane open today. It is one of the lead monthly looks for this exact seasonal window.
- Popper Fly how: Make a sharp strip-pause to spit water, then wait; the longer the pause in the ring, the more time a fish has to rise and commit. Keep it on top.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northeast_connecticut_river_09

- Label: Connecticut River smallmouth, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast fall river smallmouth should center on suspending jerkbait — FALL_RIVER fires in September and NORTHEAST_LATEFALL_RIVER fires in November, both putting jerkbait at the top vs the NORTHERN_COLD WINTER_RIVER (tube-first) that would apply to GLUM November.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 67.6 F
- Noon pressure: 1021.7 mb
- Noon cloud cover: 2%
- Daily high/low: 72.9 / 51.8 F
- Daily wind max: 6.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:31 / 18:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Tube Jig `tube_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Zonker Streamer `zonker_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Tube Jig: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Zonker Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: runoff_flow_disruption
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Two or three sharp twitches, then let it suspend perfectly still for a full 3-5 count before the next sequence — the pause is everything.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Tube Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Tube Jig how: Cast, let it sink, then pop sharply and release line; the tube should corkscrew back to bottom on each drop — keep a watchful eye on the line. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Strip with short, quick pulls to make the slim profile dart; pause briefly so it hangs in the current or sinks an inch before the next strip. Keep it high in the zone.
- Zonker Streamer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Zonker Streamer how: Retrieve at moderate speed with intentional pauses where the fly sinks and the strip wing breathes; strikes often come as you restart the strip. Keep it high in the zone.
- Game Changer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It leads on today's preferred upper column. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Game Changer how: Retrieve with medium strips, then occasionally rip hard so the body compresses and then springs apart — pause after each hard strip and hold your nerve. Keep it high in the zone.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_northeast_connecticut_river_11

- Label: Connecticut River smallmouth, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast fall river smallmouth should center on suspending jerkbait — FALL_RIVER fires in September and NORTHEAST_LATEFALL_RIVER fires in November, both putting jerkbait at the top vs the NORTHERN_COLD WINTER_RIVER (tube-first) that would apply to GLUM November.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural
- dark

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 43.2 F
- Noon pressure: 1006.1 mb
- Noon cloud cover: 80%
- Daily high/low: 46.9 / 35.8 F
- Daily wind max: 10.8 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:36 / 16:32

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Daily posture: aggressive
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=northeast, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=subtle
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=false, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, light_cloud_condition, runoff_flow_disruption
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Lower light supports a slightly higher, more open lane.
- Lure reasoning:
- Suspending Jerkbait: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Suspending Jerkbait how: Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.
- Paddle-Tail Swimbait: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Paddle-Tail Swimbait how: Swim it at the speed where you feel a steady kick through the rod; use rod angle to change depth without changing retrieve speed. Keep it high in the zone.
- Hair Jig: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Hair Jig how: Swing it through current seams or drop it in pockets with minimal movement; let the marabou breathe in place before slowly pulling it along. Keep it high in the zone.
- Fly reasoning:
- Slim Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.
- Slim Baitfish Streamer how: Fish it on a dead-drift through seams, then activate with quick strips near holding structure; the slim silhouette works best in clear water at a measured pace. Keep it high in the zone.
- Woolly Bugger: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. Woolly Bugger tracks well when leech_worm is a realistic meal. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Woolly Bugger how: Cast across and swing it on a tight line through the drift, then activate on the hang-down with short strips before lifting.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_illinois_river_smb_04

- Label: Illinois River dirty smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river spring smallmouth should still center on tube, spinnerbait, ned rig, and paddle-tail lanes. Dirty water can demote the cleaner options, but eligibility still comes from the spring river pool rather than clarity acting like a hard monthly ban.
Expected primary lanes:
- spinnerbait
- ned_rig
- tube_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- hair_jig
- clouser_minnow
- inline_spinner
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
Expected color themes:
- natural
- bright
- dark
- natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 51.8 F
- Noon pressure: 1021.5 mb
- Noon cloud cover: 100%
- Daily high/low: 57.4 / 32.4 F
- Daily wind max: 10 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:11 / 19:38

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: slightly_aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Crawfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Sculpin Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=bold
- Monthly baseline: columns=upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=rippled, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_trend, runoff_flow_disruption
- Daily note: A cooling trend tightens fish and shifts preference lower and slower.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Slow down and lengthen the pause.
- Tube Jig: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.
- Tube Jig how: Hop it erratically off the bottom with sharp pops, then open the bail slightly so it spirals down freely; strikes happen on that spinning fall. Slow down and lengthen the pause.
- Inline Spinner: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Dirty water demands more visibility. Inline Spinner stays in play when baitfish is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Slow down and lengthen the pause.
- Fly reasoning:
- Crawfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window.
- Crawfish Streamer how: Cast upstream and mend for a dead-drift first; then come alive with quick, short strips that make the claw materials flex like a fleeing crawfish. Slow down and lengthen the pause.
- Clouser Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Dirty water demands more visibility. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Slow down and lengthen the pause.
- Sculpin Streamer: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays low in the zone where this day still wants fish to hold. It is the cleaner change-up if the lead look does not convert.
- Sculpin Streamer how: Cast upstream and mend for a natural drift, then activate with short strips that make the fly bumble over the bottom like a sculpin retreating. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_illinois_river_smb_07

- Label: Illinois River dirty smallmouth, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river summer smallmouth should still be bounded by the river baitfish pool, but dirty water no longer means only one legal answer; tube, suspending jerkbait, and paddle-tail can all survive when the day pulls fish lower and more restrained.
Expected primary lanes:
- paddle_tail_swimbait
- tube_jig
- suspending_jerkbait
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- muddler_sculpin
Disallowed lanes:
- squarebill_crankbait
- walking_topwater
Expected color themes:
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 85.9 F
- Noon pressure: 1009.9 mb
- Noon cloud cover: 22%
- Daily high/low: 87.9 / 72.2 F
- Daily wind max: 13.6 mph
- Daily precip: 0.15354330708661418 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:34 / 20:28

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Muddler Minnow `muddler_sculpin` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: suppressed
- Tube Jig: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Paddle-Tail Swimbait: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Muddler Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: suppressed
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=bottom, pace=slow, presence=moderate
- Monthly baseline: columns=surface/upper/mid/bottom, paces=slow/medium/fast, presence=subtle/moderate
- Guardrails: surface_allowed=false, surface_window=closed, suppress_fast_presentations=true, high_visibility_needed=true, column_shift=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, runoff_flow_disruption
- Daily note: Heat stress moves fish to cooler, deeper water and narrows the feeding window.
- Daily note: A warming trend nudges fish slightly higher in the allowed range.
- Daily note: Elevated runoff tightens fish and pulls the day lower and slower.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Tube Jig: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.
- Tube Jig how: Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Slow down and lengthen the pause.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast and retrieve at a steady clip just fast enough to keep the blade spinning; vary depth with rod angle and speed to find the feeding zone. Slow down and lengthen the pause.
- Paddle-Tail Swimbait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Paddle-Tail Swimbait how: Reel at a steady pace with the rod low so the tail thumps consistently; speed up slightly over bait schools or slow down after a follow. Slow down and lengthen the pause.
- Fly reasoning:
- Woolly Bugger: This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold.
- Woolly Bugger how: Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.
- Muddler Minnow: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different fly bottom look without leaving today's window.
- Muddler Minnow how: Sink and crawl it along bottom with rod-tip leads so the deer hair pushes water, or swing it through soft seams on a tight line. Slow down and lengthen the pause.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Cast across or slightly downstream, let it jig toward you with short strips so the weighted eyes keep the fly tracking hook-point up. Slow down and lengthen the pause.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- NO_TOP1_TIE
- EXPLANATION_ALIGNED
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

## smb_matrix_illinois_river_smb_10

- Label: Illinois River dirty smallmouth, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river fall smallmouth should still emphasize spinnerbait and paddle-tail lanes first, but suspending jerkbait can remain in-bounds as a supporting baitfish option instead of being treated as automatically wrong.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- blade_bait
Acceptable secondary lanes:
- suspending_jerkbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- squarebill_crankbait
Expected color themes:
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 66.1 F
- Noon pressure: 1023.6 mb
- Noon cloud cover: 73%
- Daily high/low: 66.3 / 57.7 F
- Daily wind max: 8.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 18:15

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Blade Bait `blade_bait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Game Changer `game_changer` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Clouser Minnow `clouser_minnow` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Daily posture: aggressive
- Spinnerbait: bright -> white/chartreuse, chartreuse, firetiger
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Blade Bait: bright -> white/chartreuse, chartreuse, firetiger
- Articulated Baitfish Streamer: bright -> white/chartreuse, chartreuse, firetiger
- Game Changer: bright -> white/chartreuse, chartreuse, firetiger
- Clouser Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: aggressive
- Seasonal source: region=great_lakes_upper_midwest, fallback_used=false
- Daily preference: column=upper, pace=medium, presence=bold
- Monthly baseline: columns=upper/mid, paces=medium/fast, presence=subtle/moderate/bold
- Guardrails: surface_allowed=true, surface_window=clean, suppress_fast_presentations=false, high_visibility_needed=true, column_shift=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: light_cloud_condition, runoff_flow_disruption
- Daily note: Lower light supports a slightly higher, more open lane.
- Daily note: Dirty water demands more visibility.
- Lure reasoning:
- Spinnerbait: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window.
- Spinnerbait how: Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Keep it high in the zone.
- Inline Spinner: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.
- Inline Spinner how: Cast parallel to cover edges and retrieve with a steady pace that keeps the blade thumping; slow a half-beat near cover, then speed back up once it clears. Keep it high in the zone.
- Blade Bait: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.
- Blade Bait how: Vertical jig it with short, sharp hops over suspended fish; the flutter-fall is the presentation — set hard the moment you feel weight.
- Fly reasoning:
- Articulated Baitfish Streamer: This is today's top overall read. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane.
- Articulated Baitfish Streamer how: Work it across current and down with a varied strip cadence; when a fish follows, slow down and kill the retrieve to let the body spiral on the sink. Keep it high in the zone.
- Game Changer: Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.
- Game Changer how: Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.
- Clouser Minnow: Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Lower light supports a slightly higher, more open lane. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.
- Clouser Minnow how: Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- NO_REGION_FALLBACK
- TOP1_TIE:fly
- EXPLANATION_ALIGNED
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

