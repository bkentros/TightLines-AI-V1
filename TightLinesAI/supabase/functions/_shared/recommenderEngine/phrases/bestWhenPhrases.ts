/**
 * bestWhenPhrases — timing and condition cues for a given family.
 *
 * Keyed on: seasonal_flag × activity_level
 * 6 variants each for deterministic rotation.
 */

import type { ActivityLevel, SeasonalFlag } from "../contracts/behavior.ts";

type BestWhenKey = `${SeasonalFlag | "none"}:${ActivityLevel}`;

export const BEST_WHEN_PHRASES: Partial<
  Record<BestWhenKey, readonly string[]>
> = {
  // ── Peak season ──────────────────────────────────────────────────────────

  "peak_season:aggressive": [
    "Peak season — fish hard all day. Dawn and dusk are best.",
    "Mid-season peak. Any time of day can produce. Morning edges are prime.",
    "Full feeding mode. Low light windows will be especially productive.",
    "Fish are aggressive — you don't have to wait for the perfect window today.",
    "Sustained peak activity — fish the full day and work every likely spot.",
    "Best bite of the season. Cover water at first light and again at last light.",
  ],
  "peak_season:active": [
    "Active fish in season — morning and evening windows are most consistent.",
    "Good feeding conditions. Work transitions in the low-light windows.",
    "Fish are in the zone — expect consistent action through the day.",
    "Reliable active bite — fish structure transitions at dawn for the sharpest action.",
    "Consistent daytime feed — early and late are most productive, but midday is fishable.",
    "Prime calendar timing with active fish — focus on productive zones for sustained action.",
  ],
  "peak_season:neutral": [
    "Neutral mood despite good season — focus on the first and last two hours of light.",
    "Fish are catchable — hit primary structure during low-light periods.",
    "Peak month but neutral bite — slow down and focus on best spots.",
    "Good season, neutral fish — slow your presentation and stay on known structure.",
    "Calendar is right but fish need coaxing — low-light edges are your best window.",
    "Productive season with a neutral bite today — grind the first two hours hard.",
  ],
  "peak_season:low": [
    "Good season but fish are sluggish — dawn bite is your best window.",
    "Slow bite in a good month — fish early and focus on deep structure.",
    "Fish need coaxing despite seasonal timing — target transitions at first light.",
    "Slow bite mid-peak season — a weather disruption has put fish off. Be patient.",
    "Prime window overall but fish are sluggish today — work the first light hard.",
    "Best bet is the 30-minute window at sunrise. Fish won't be moving much after that.",
  ],
  "peak_season:inactive": [
    "Tough bite despite peak season — weather event likely suppressing activity.",
    "Hold off if possible. Post-front, fish will return to normal within 24–48 hours.",
    "Wait for conditions to stabilize — fish will reactivate once pressure steadies.",
    "Inactive fish during what should be a good bite — a front has shut things down.",
    "Weather is overriding the calendar. Give it 24 hours and conditions will improve.",
    "Skip today if you can. Fish will return to the peak bite once this system passes.",
  ],

  // ── Pre-spawn ────────────────────────────────────────────────────────────

  "pre_spawn:aggressive": [
    "Pre-spawn fish are feeding aggressively before moving shallow. This is the money bite.",
    "Prime pre-spawn window — fish are stacked and actively feeding.",
    "Best time of year. Work staging areas hard from first light.",
    "Pre-spawn aggression is peaking — fish hard at staging areas all day.",
    "Staging fish are fully committed to feeding. Hit the staging flats and edges hard.",
    "This is the bite of the year — fish are stacked, hungry, and aggressive. Don't miss it.",
  ],
  "pre_spawn:active": [
    "Staging fish are catchable all day — focus on transition areas and staging structure.",
    "Pre-spawn feeding window — early morning to mid-morning is most productive.",
    "Fish are moving into position. Hit the outside edges and staging flats.",
    "Active pre-spawn fish on the move — transitions and staging points are the key locations.",
    "Good consistent pre-spawn action — work staging areas from first light to mid-morning.",
    "Fish are feeding up before the spawn — staging areas and approach routes are the focus.",
  ],
  "pre_spawn:neutral": [
    "Fish are staging but not committed to feeding hard — finesse approaches work best.",
    "Pre-spawn neutral bite — present naturally and be patient.",
    "Fish are moving but picky — slow down and match the forage closely.",
    "Staging fish with a selective bite — natural presentations and low-pressure angles.",
    "Pre-spawn fish are there but need convincing. Slow down and get precise.",
    "Fish on staging structure but neutral — work slowly and thoroughly, they'll bite.",
  ],
  "pre_spawn:low": [
    "Pre-spawn but bite is slow — patience and finesse are key.",
    "Fish are present but not yet triggered — try very early morning.",
    "Slow pre-spawn bite — downsize and slow way down.",
    "Pre-spawn fish are present but lethargic — focus on the sharpest low-light window.",
    "Early pre-spawn or post-front slowing things down — tough but fish are there.",
    "Try the first 45 minutes of light on staging areas — the window is short today.",
  ],
  "pre_spawn:inactive": [
    "Cold front has suppressed pre-spawn activity — wait for it to pass.",
    "Pre-spawn fish inactive — give it 48 hours and try again.",
    "Weather event has stalled the pre-spawn — tough conditions today.",
    "Fish are staging but a front shut them down — activity resumes once temps stabilize.",
    "Pre-spawn timing is right but fish won't cooperate until pressure steadies.",
    "Give it a day or two — the pre-spawn bite will be excellent when conditions settle.",
  ],

  // ── Spawning ─────────────────────────────────────────────────────────────

  "spawning:aggressive": [
    "Spawn is active — territorial strikes are common. Fish are in the shallows.",
    "Spawning fish can be aggressive — target staging and bed areas.",
    "Active spawn window. Fish are shallow and visible in clear water.",
    "Spawning aggression is high — fish are protecting territory and will strike on sight.",
    "Territorial fish on beds will strike anything that enters their zone.",
    "Active spawn in clear water — sight-fishing is productive all day long.",
  ],
  "spawning:active": [
    "Spawning period — sight-fish in shallow clear water when possible.",
    "Fish are in or near beds — active but focused on spawning behavior.",
    "Spawn is happening — work the shallows and edges carefully.",
    "Active spawn — fish are shallow and catchable, especially at first light.",
    "Spawning fish are active but distracted — precise presentations to visible fish work best.",
    "Fish beds during midday when water is warmest and fish are most active on them.",
  ],
  "spawning:neutral": [
    "Neutral spawning fish — work adjacent cover rather than directly on beds.",
    "Fish are on beds but not feeding hard — trigger with reaction presentations.",
    "Spawning neutral bite — target non-spawning fish in the area.",
    "Fish on beds aren't committed to eating — target staging fish adjacent to the flat.",
    "Spawning fish are preoccupied — work their edges rather than directly at the beds.",
    "Neutral spawning bite — find fish that haven't committed to beds yet for easier action.",
  ],
  "spawning:low": [
    "Fish are on beds and not interested in food — patience or targeting non-spawners.",
    "Slow bite during spawn — look for fish that haven't committed to beds yet.",
    "Tough spawning bite — focus on deeper adjacent fish.",
    "Fish locked on beds but not eating — consider moving to deeper adjacent structure.",
    "Spawning fish won't chase — find the pre-spawn fish still staging nearby.",
    "Low activity on beds — best approach is to find fish that haven't moved shallow yet.",
  ],
  "spawning:inactive": [
    "Spawn is disrupted by weather — fish have retreated temporarily.",
    "Cold front paused the spawn — wait for temps to climb again.",
    "Inactive during spawn — try again in 24–48 hours.",
    "Weather interrupted the spawn cycle — fish will return to beds once it stabilizes.",
    "Front pushed fish off beds — they'll return when temps recover. Be patient.",
    "Spawning activity suspended by weather event — check back in 48 hours.",
  ],

  // ── Post-spawn ───────────────────────────────────────────────────────────

  "post_spawn:aggressive": [
    "Post-spawn recovery fish are feeding hard to rebuild. Great time to fish.",
    "Fish have recovered from spawn and are actively chasing — excellent bite.",
    "Post-spawn aggressive feed is underway — any time of day can produce.",
    "Post-spawn hunger is real — fish are aggressively making up for lost weight.",
    "Recovery feeding in full swing — fish hard all day during this window.",
    "Post-spawn fish are aggressive and rebuilding — one of the best bites of the year.",
  ],
  "post_spawn:active": [
    "Post-spawn fish are feeding up — mornings and evenings are most consistent.",
    "Recovery feeding mode — fish are catchable but work structure and shade.",
    "Post-spawn active phase — solid consistent action through the day.",
    "Fish are recovering and eating consistently — morning bite is most reliable.",
    "Post-spawn active bite — work transition areas and available forage concentrations.",
    "Good consistent post-spawn action — morning and evening will be the sharpest windows.",
  ],
  "post_spawn:neutral": [
    "Post-spawn recovery — fish are eating but won't chase far.",
    "Neutral post-spawn bite — slow down and keep presentations close to cover.",
    "Fish are recovering — natural, non-threatening presentations are best.",
    "Post-spawn neutral mode — fish need a presentation that comes to them.",
    "Recovery phase with a neutral bite — stay close to cover and slow your retrieve.",
    "Post-spawn fish are present but selective — precise natural presentations work best.",
  ],
  "post_spawn:low": [
    "Fish are still recovering from spawn — finesse and patience required.",
    "Low post-spawn activity — very early morning is the best window.",
    "Slow post-spawn bite — downsize and go slow.",
    "Post-spawn lethargy — fish are recovering and need a slow finesse approach.",
    "Early recovery phase — fish are there but need time. Hit the first light window hard.",
    "Low activity during post-spawn recovery — focus on the warmest structure at first light.",
  ],
  "post_spawn:inactive": [
    "Post-spawn recovery disrupted by weather — tough conditions today.",
    "Inactive post-spawn fish — wait for stable conditions.",
    "Weather has suppressed recovering fish — give it time.",
    "Recovering fish shut down by a front — conditions will improve in 24 hours.",
    "Post-spawn fish are recovering AND dealing with weather — very tough bite today.",
    "Double-whammy conditions: post-spawn lethargy plus weather event. Give it time.",
  ],

  // ── Off-season ───────────────────────────────────────────────────────────

  "off_season:aggressive": [
    "Unexpected aggressive bite during off-season — capitalize while it lasts.",
    "Warm spell has triggered unusual off-season activity. Fish hard.",
    "Off-season but fish are fired up — likely a brief warm-weather window.",
    "Unusual off-season aggression — a weather anomaly has triggered the bite. Go now.",
    "Brief warm-up during off-season has fish aggressive — don't wait on this one.",
    "Off-season active window — thermal event created this opportunity. Fish it hard.",
  ],
  "off_season:active": [
    "Off-season active fish — target warmest water in the system.",
    "Mild conditions have fish active despite the calendar. Fish midday.",
    "Off-season activity on warm-water discharge or sun-warmed flats.",
    "Good off-season activity — target the warmest available water from 10am–2pm.",
    "Mild off-season window — midday sun warming shallow structure creates this bite.",
    "Fish are active despite the calendar — find warmest water and fish the warmest hours.",
  ],
  "off_season:neutral": [
    "Off-season neutral bite — focus on the warmest part of the day.",
    "Fish are present but slow — midday sun may trigger a brief bite.",
    "Off-season — target warm-water areas around noon.",
    "Neutral off-season conditions — fish 11am–2pm for the best shot at a bite.",
    "Off-season fish need sun-warmed water — south-facing banks and shallow dark-bottom areas.",
    "A brief neutral bite window around midday is likely. Don't expect sustained action.",
  ],
  "off_season:low": [
    "Off-season tough bite — try around noon in the warmest water available.",
    "Low off-season activity — fish only during the warmest 2–3 hours.",
    "Very slow off-season conditions — fish for sport, not harvest.",
    "Extremely limited off-season activity — target the warmest spot in the system at midday.",
    "Low activity in the off-season — you need perfect conditions to get a bite today.",
    "Off-season with a slow bite — one or two hours around midday in warm shallow water.",
  ],
  "off_season:inactive": [
    "Deep off-season — fish are very slow. Downsize, go ultra-slow, and target the warmest water available.",
    "Cold-stressed fish will still eat, but you need the smallest presentation fished as slow as possible.",
    "Extremely slow conditions — find the warmest pocket in the system and fish the tiniest offering you have.",
    "Off-season shutdown — they are still catchable, but only with the lightest tackle and the most patience.",
    "Fish are holding deep and cold-stressed. Slow down drastically and focus on the warmest hours.",
    "Tough off-season conditions — use finesse presentations at the slowest speed you can manage.",
  ],

  // ── None (no seasonal flag) ───────────────────────────────────────────────

  "none:aggressive": [
    "Fish are in full feeding mode — fish hard during low-light windows.",
    "Aggressive conditions — dawn and dusk will be especially productive.",
    "Active aggressive bite — work transitions and edges at first light.",
    "Aggressive fish — any time of day is fishable, but morning edges are prime.",
    "Full feeding mode — work high-percentage spots and expect bites.",
    "Fish are aggressive — maximize time on the water today for the best results.",
  ],
  "none:active": [
    "Active feeding conditions — morning and evening windows are most consistent.",
    "Good feeding conditions. Focus on structure transitions during low light.",
    "Fish are in the zone — consistent action expected through the day.",
    "Reliable active bite — fish structure and forage concentrations at dawn.",
    "Active fish today — cover water efficiently and hit known producing spots.",
    "Consistent bite expected — morning is best but fish will cooperate through the day.",
  ],
  "none:neutral": [
    "Neutral bite — focus on the most productive low-light windows.",
    "Fish are catchable — be thorough on structure and transition areas.",
    "Neutral conditions — slow down and target primary holding areas.",
    "Neutral fish — precision and patience beat covering water today.",
    "Slow down and be methodical — neutral fish need a presentation that comes to them.",
    "Catchable but selective — first and last light windows with thorough coverage.",
  ],
  "none:low": [
    "Slow bite — dawn and dusk are your best opportunities.",
    "Low activity — fish only during the sharpest low-light window of the day.",
    "Tough day — fish the first 30 minutes of light and last 30 minutes only.",
    "Low activity conditions — the first 20 minutes of first light is your best window.",
    "Tough bite today — be at your best spot before dawn and work it until 9am.",
    "Fish are there but slow — grind the transition hours hard and then call it.",
  ],
  "none:inactive": [
    "Very slow conditions — downsize your presentation and fish it as slowly as possible.",
    "Tough conditions today — go finesse, slow down, and focus on the warmest water.",
    "Fish are sluggish — a front or temperature shift has slowed the bite drastically.",
    "Near-lockjaw conditions — smallest bait, slowest retrieve, most patience wins here.",
    "Fish are cold-stressed or post-frontal. They will still eat if you put it right on them.",
    "Extremely slow bite — use the lightest tackle and work it through the strike zone at a crawl.",
  ],
};

export const BEST_WHEN_FALLBACK: readonly string[] = [
  "Focus on low-light windows at dawn and dusk for the best action.",
  "Morning and evening transitions are typically most productive.",
  "Fish are most catchable during stable conditions with low light.",
  "Dawn is always your best window — be on the water before first light.",
  "Low-light edges are the highest-percentage windows for this species.",
  "Work structure transitions at first light for the most consistent action.",
];
