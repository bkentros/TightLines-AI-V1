/**
 * Seasonal legend body templates for the Water Read map key.
 *
 * Replaces the engine-supplied `entry.body` text with short, season-aware,
 * biologically-grounded copy that tells the angler exactly where in the
 * zone to target for the current season. Three templates per
 * (featureClass × season) so legends feel original lake-to-lake rather
 * than copy-paste — the choice is deterministic per zone (`zoneId` seed)
 * so the same lake's same zone reads the same way across opens.
 *
 * The season is shown once in the legend masthead/season badge (and again
 * on the page meta ribbon), so template copy intentionally never names the
 * season — every template assumes "according to the season above".
 */

import type {
  WaterReaderProductionSvgFeatureClass,
} from './waterReaderContracts';

export type LegendSeason = 'spring' | 'summer' | 'fall' | 'winter';

const FALLBACK_SEASON: LegendSeason = 'summer';

/**
 * Normalize whatever the engine returns (may include "autumn", capitalized
 * forms, etc.) into one of the four canonical seasons used as keys here.
 */
export function normalizeSeason(season: string | undefined | null): LegendSeason {
  if (!season) return FALLBACK_SEASON;
  const s = season.toLowerCase();
  if (s.startsWith('spr')) return 'spring';
  if (s.startsWith('sum')) return 'summer';
  if (s.startsWith('fal') || s.startsWith('aut')) return 'fall';
  if (s.startsWith('win')) return 'winter';
  return FALLBACK_SEASON;
}

/**
 * Northern-hemisphere meteorological seasons, by calendar:
 *   spring: Mar 1 – May 31
 *   summer: Jun 1 – Aug 31
 *   fall:   Sep 1 – Nov 30
 *   winter: Dec 1 – Feb (28|29)
 */
export function calendarSeasonFor(date: Date): LegendSeason {
  const m = date.getMonth(); // 0..11
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'fall';
  return 'winter';
}

/**
 * Build a season display label that surfaces regional transitions.
 *
 * When the engine's season-of-record matches the calendar season for the
 * current date, we show a single season ("SPRING"). When they DIFFER, the
 * region's climate is offset from the calendar — Florida is already on a
 * summer pattern in mid-May; far-north lakes are still on winter in early
 * March — and we surface that as "SPRING → SUMMER" so the angler knows
 * the region they're in is behaving differently than the calendar season
 * alone would suggest.
 *
 * Order in the transition label: earlier season → later season in the
 * cyclical order spring → summer → fall → winter → spring …, regardless
 * of which side the engine landed on. Reads as "the region is moving
 * from X conditions toward Y conditions."
 *
 * `now` is injectable for testing; production callers pass `new Date()`.
 */
export function seasonDisplayLabel(
  engineSeason: string | undefined | null,
  now: Date = new Date(),
): { label: string; isTransition: boolean } {
  const engine = normalizeSeason(engineSeason);
  const calendar = calendarSeasonFor(now);
  if (engine === calendar) {
    return { label: engine.toUpperCase(), isTransition: false };
  }
  const [from, to] = orderSeasons(calendar, engine);
  return {
    label: `${from.toUpperCase()} → ${to.toUpperCase()}`,
    isTransition: true,
  };
}

const SEASON_ORDER: LegendSeason[] = ['spring', 'summer', 'fall', 'winter'];

/**
 * Given two distinct seasons, return them in cyclical order (spring →
 * summer → fall → winter → spring …) for display. We pick the ordering
 * that produces the SHORTER forward step between the two — so we get
 * "WINTER → SPRING" rather than "SPRING → WINTER" (3 steps).
 */
function orderSeasons(
  a: LegendSeason,
  b: LegendSeason,
): [LegendSeason, LegendSeason] {
  if (a === b) return [a, b];
  const ai = SEASON_ORDER.indexOf(a);
  const bi = SEASON_ORDER.indexOf(b);
  const forward = (bi - ai + 4) % 4;
  if (forward <= 2) return [a, b];
  return [b, a];
}

type SeasonTemplates = Record<LegendSeason, string[]>;

const TEMPLATES: Record<WaterReaderProductionSvgFeatureClass, SeasonTemplates> = {
  main_lake_point: {
    spring: [
      'Stage on the deeper edge in 8–14 ft as fish push toward spawning coves. Slow-roll a swimbait or jerkbait along the secondary break to intercept cruisers.',
      'Pre-spawners pull onto the tip first, then the inside swing. Work a jig-and-craw across the second contour and follow up with a soft jerkbait on any short strike.',
      'Wind-blown side warms first and stacks staging fish. Burn a chatterbait parallel to the bank, then back off and drag a football jig down the break.',
    ],
    summer: [
      'Deepest tip and shaded side hold fish through midday. Drag a football jig along the 18–25 ft contour, then bring a topwater across the shallow shelf at first light.',
      'Bait stacks on the wind-blown edge as oxygen pulls in. Drop a drop-shot on the deep crown and clean it up with a deep diver on any short strikes.',
      'The longest finger reaching into the basin holds the day school. Vertical jig a magnum spoon off the end and follow with a deep crank when the bite slows.',
    ],
    fall: [
      'Schoolers herd shad onto the top of the point. Burn a lipless across the crown and follow up with a tail-spinner on any blowup off the tip.',
      'Bait migration funnels right across the point edge. Fan-cast a spinnerbait through the strike zone and rotate to a walking topwater when surface flickers start.',
      'Wolfpacks roam the contour all day. Throw a swimbait on a steady cadence and let the rod load — fall fish hit hard and keep moving.',
    ],
    winter: [
      'Bass stack on the deep tip, suspended off the steep break. Vertical-jig a blade bait or hair jig over 25–35 ft and watch electronics for the cloud.',
      'Wintering fish hold tight to the deepest contour. Slow-stroke a football jig down the break, dead-sticking on every flat spot for 5–10 seconds.',
      'Suspended bait hovers off the tip on warm afternoons. Hover a jerkbait 6–10 ft down with long pauses — strikes come on the dead stick.',
    ],
  },

  secondary_point: {
    spring: [
      'Last stop before the spawning pocket — pre-spawners stage tight to the bank. Pitch a wacky worm or jig-and-craw in 4–10 ft on the cove-facing side.',
      'Cruisers circle the tip on warming afternoons. Work a swimbait slowly across the front and skip a finesse jig under any laydown along the shore.',
      'Females hold on the first deeper contour while males scout the bank. Drag a Carolina rig down the inside swing and pitch creature baits to obvious cover.',
    ],
    summer: [
      'Shaded side gets a brief shallow bite morning and evening. Skip a finesse jig under overhanging cover; midday push out to the 12–16 ft drop with a Carolina rig.',
      'Wind helps — the windward face concentrates bait through the heat. Throw a paddle-tail swimbait across the wind line and pick off followers with a drop-shot.',
      'Hard-bottom transitions on the point edge hold fish all day. Drag a football jig across rock-to-clay seams and probe brush with a Texas rig.',
    ],
    fall: [
      'Bait fans across these points en route to the back of the cove. Cast spinnerbaits or chatterbaits parallel to the bank and pick apart any shad flickers.',
      'Schooling activity fires up sundown. Walk a topwater across the tip and reload with a fluke on any boil that doesn\'t fully commit.',
      'Wind-blown points pile bait against the bank. Burn a squarebill along the rock and follow up with a jerkbait if the bite slows.',
    ],
    winter: [
      'Lay-down trees and brush on the steep face hold suspended fish. Pendulum-swing a jig down the break or hover a jerkbait above the limbs.',
      'Steepest face holds the most stable water. Hop a small jig down the rock and pause every two cranks — winter strikes are subtle.',
      'Pockets and undercuts along the deeper edge concentrate the bite. Vertical jig a spoon over the spot and let it sit on the bottom for 8–10 seconds between hops.',
    ],
  },

  cove: {
    spring: [
      'Bass slide into the back to spawn on hard bottom near the first shallow flat. Sight-fish beds in 1–4 ft and pitch wacky worms to cruisers along the wood line.',
      'Pre-spawners stage at the cove mouth before pushing all the way in. Throw a jerkbait across the throat and follow with a slower swim-jig on any chase.',
      'Hard-bottom pockets in the back hold the bulk of the spawn. Work a Texas-rigged creature bait to any visible bed and target stumps and laydowns nearby.',
    ],
    summer: [
      'Cove backs go warm and sluggish — only fish the mouth or any feeder creek with current. Throw a buzzbait at first light along the shaded shoreline, then bail out.',
      'Shaded laydowns and overhanging banks hold the only fish that stayed. Skip a senko or finesse jig deep under cover and let it sit before twitching.',
      'Look for any spring inflow or shaded ditch in the back. Drag a Texas-rigged worm through the bottom of the channel and pitch to obvious cover.',
    ],
    fall: [
      'Shad pour into the cove and bass follow all the way to the back. Run a squarebill along the wood and a wake bait across the flat at sunrise; keep moving.',
      'The cove becomes the seasonal funnel for weeks. Burn a chatterbait through the throat and rotate to a topwater whenever shad flicker on the surface.',
      'Roaming schools work the bank from mouth to back. Cast spinnerbaits along the shoreline and follow up with a fluke on any short strike.',
    ],
    winter: [
      'Skip the back — fish hold on the deeper main-lake mouth instead. Slow-roll a blade across the cove mouth in 12–18 ft on warming afternoons.',
      'Deepest part of the cove channel holds wintering fish. Drag a hair jig along the bottom of the throat and dead-stick on every contour change.',
      'A southern-exposure mouth warms two to three degrees by midday. Hover a jerkbait off the channel edge and work it slowly with long pauses.',
    ],
  },

  neck: {
    spring: [
      'Pre-spawn fish funnel through the neck moving to back-cove spawning bays. Position uplake of the pinch and cast 3/8 oz jigs to staging fish on the channel side.',
      'Bait gets squeezed through the choke and bass set up to ambush. Throw a swim-jig or chatterbait across the pinch and let it fall through the strike zone.',
      'A natural travel corridor — fish move through morning and evening. Set up on the deeper side and roll a swimbait through the gap on a steady cadence.',
    ],
    summer: [
      'Bait squeezes through and bass ambush from the lower-light shaded edge. Swim a fluke or paddle-tail 3–6 ft down with the wind and let it tumble through.',
      'Current through the neck pulls oxygen to the deeper side. Drop a drop-shot or shaky head right at the pinch and work it slowly along the bottom.',
      'Shaded edge holds fish through midday. Skip a finesse jig under any laydown right at the throat and pitch a tube to deeper rock.',
    ],
    fall: [
      'Migrating shad get bottlenecked here daily. Throw a spinnerbait or lipless across the gap on a moderate retrieve, varying speed until you find the trigger.',
      'Schools wolfpack the pinch as bait stacks up. Burn a swimbait through the choke and follow up with a topwater whenever you see surface activity.',
      'Bass set up on either side of the throat to feed. Fan-cast a chatterbait through and switch to a jerkbait for the follow-ups.',
    ],
    winter: [
      'A natural depth break holds the deepest fish in the area. Drag a small football jig along the bottom contour through the pinch on warming afternoons.',
      'Suspended bass hover in the deeper water just outside the choke. Hold a jerkbait at their depth and let strikes come on a long pause.',
      'The deepest flat at the neck stacks lethargic fish. Vertical-jig a blade bait and work it with subtle hops every 10 seconds.',
    ],
  },

  island: {
    spring: [
      'Cruisers circle the protected back side looking for hard-bottom pockets. Pitch a tube or creature bait to wind-protected shore in 2–6 ft and bed-fish any sand patches.',
      'Pre-spawners use the island as a staging hub before moving inland. Drag a jig-and-craw around the perimeter and pitch swim-jigs to any visible cover.',
      'Hard-bottom transitions on the lee side hold the bulk of the spawn. Sight-fish where you can and target laydowns with a Texas-rigged creature bait.',
    ],
    summer: [
      'Wind-blown side and deeper tips are the day spot. Crank a deep diver across the wind side, then drop a drop-shot on the shaded ledge.',
      'Look for the deepest contour around the rim — fish stack on it through midday. Drag a football jig and hop a tube around any rock seam.',
      'Surface bite fires at first and last light around the entire rim. Walk a topwater all the way around and switch to a swimbait when the sun is up.',
    ],
    fall: [
      'Bait stacks on the upwind edge as schools push around the island. Walk a topwater along the rim and follow with a swimbait if surface dies.',
      'Schoolers ring the island chasing shad. Burn a lipless or chatterbait along the rim and stay ready for blowups on every cast.',
      'Roaming wolfpacks circle the perimeter all day. Cover water fast with a spinnerbait and back off when you find the school holding.',
    ],
    winter: [
      'Steep faces of the island concentrate suspended fish. Hover a jerkbait 4–8 ft down on the bluff side and let pauses do the work.',
      'The deepest contour around the perimeter is the wintering address. Slow-stroke a hair jig and pause every hop — winter takes are barely there.',
      'Sun-warmed side holds the bite on the warmest hour of the day. Hop a small football jig along the rock and dead-stick on every flat spot.',
    ],
  },

  saddle: {
    spring: [
      'A travel corridor for pre-spawners moving between bays. Cast spinnerbaits or chatterbaits across the saddle perpendicular to the route to intercept cruisers.',
      'Mid-depth hump on the saddle stages fish before they push shallow. Drag a Carolina rig across the crown and pitch jigs to any brush.',
      'Bait moves through the saddle morning and evening. Fan-cast a swimbait across both rises and stay ready for short, hard strikes.',
    ],
    summer: [
      'Mid-depth hump within the saddle holds fish all day off the main lake. Drag a Carolina rig over the crown and probe brush or rock with a football jig.',
      'Deepest section between the humps holds suspended fish through the heat. Drop a drop-shot over 18–25 ft and let it hover with subtle shakes.',
      'Wind direction tells you which side feeds — the windward rise wins. Crank a deep diver across the windy edge and drop a spoon on any arch you mark.',
    ],
    fall: [
      'Roaming wolfpacks cross the saddle hunting bait. Burn a swimbait or lipless across the top, fan-cast — they could be anywhere on it.',
      'Schools stage between the humps for waves of bait. Throw a spinnerbait across the saddle and switch to a jerkbait the moment the bite slows.',
      'Bait migration brings schools through repeatedly. Cover the entire saddle with a chatterbait and don\'t leave until you\'re sure they aren\'t home.',
    ],
    winter: [
      'The deep flat between humps stacks lethargic fish. Slowly drag a finesse worm or shaky head across the deepest point and watch for soft bites.',
      'Suspended bass hold off either rise. Vertical-jig a blade or spoon over the deeper saddle and pause for 8–10 seconds between hops.',
      'A long, gentle saddle holds the most stable water. Drag a small football jig across the flat and dead-stick on every contour change.',
    ],
  },

  dam: {
    spring: [
      'Bass stage on the riprap rocks ahead of moving into nearby flats. Slow-roll a small spinnerbait or jerkbait parallel to the rock seam in 4–10 ft.',
      'Pre-spawners use the dam as a thermal refuge between cold fronts. Hop a jig-and-craw along the rocks and pitch into any pocket of warmer water.',
      'Sun-warmed riprap holds the bite all day on cool spring afternoons. Crank a small squarebill along the seam and follow up with a wacky worm on every short strike.',
    ],
    summer: [
      'Vertical wall holds shaded fish all day; current near generation pulls bait. Drop a jig or drop-shot tight to the wall in 15–25 ft, especially when water is moving.',
      'Look for any rubble pile or rock pocket along the face. Hop a football jig along the riprap and let it fall through the gaps for reaction strikes.',
      'Shaded side of the dam holds the day bite once sun is up. Skip a finesse jig tight to the wall and follow with a deep diver through the strike zone.',
    ],
    fall: [
      'Shad gather along the rocks and get pinned by feeding fish. Crank a medium-diver tight to the riprap and hop a jig across the rocks for follow-up.',
      'Schoolers slam bait against the wall as fall progresses. Burn a lipless along the seam and switch to a topwater on every surface boil.',
      'Migrating shad pile up against the dam face. Cover the entire wall with a swimbait and slow down on any spot that gives up a fish.',
    ],
    winter: [
      'Deepest, most stable water in the lake — bass winter on or near the wall. Vertical-jig a spoon or hair jig along the face in 25–40 ft, focusing on pockets.',
      'Suspended bass hover off the deepest part of the wall. Hold a jerkbait at their depth or slow-stroke a blade and wait out the longest pause you can stand.',
      'Sun-exposed face warms a few degrees in the afternoon. Drag a small football jig along the rubble at the base and dead-stick on every flat spot.',
    ],
  },

  structure_confluence: {
    spring: [
      'Multiple structures meeting create a high-percentage staging area. Make repeated passes with a swim-jig or jerkbait, pausing at the intersection of each contour.',
      'Pre-spawners use confluence zones as the main travel hub. Fan-cast spinnerbaits across the overlap and probe each individual structure with a jig.',
      'Hard-bottom transitions concentrate bait through the spawn. Drag a Carolina rig across the meeting point and pitch creature baits to any obvious cover.',
    ],
    summer: [
      'Convergence concentrates current, oxygen, and bait. Drop a football jig on the deepest shared contour and crank the shallowest with a squarebill.',
      'Mid-depth meeting points hold fish all day in the heat. Drag a Carolina rig across the overlap and probe rock seams with a jig.',
      'Wind direction picks the active side. Throw a deep crank across the windy edge and drop a drop-shot on any arch you mark.',
    ],
    fall: [
      'Roaming schools hit confluence zones hardest as bait routes overlap. Burn lipless cranks across the top and look for surface flickers — schoolers love these spots.',
      'Two or three bait migration paths converge here at once. Cover water fast with a swimbait or chatterbait and slow down on the spot that gives up the first fish.',
      'Schoolers wolfpack the overlap morning and evening. Fan-cast a topwater across the entire zone and reload with a fluke on every short strike.',
    ],
    winter: [
      'Best wintering address on the lake — vertical breaks stacked over a deep flat. Vertical-jig spoons or blade baits, working the spot slowly and thoroughly all day.',
      'Suspended schools stack over the deepest shared contour. Hover a hair jig over the meeting point and let strikes come on the dead stick.',
      'Most stable water in the area sits right at the convergence. Slow-stroke a football jig across the deepest part and pause every hop for 5–8 seconds.',
    ],
  },

  universal: {
    spring: [
      'Whole-pond shallow bite as fish push toward bank-line cover. Work a jig or wacky worm along any visible cover in 3–8 ft, varying retrieve to match water temp.',
      'Pre-spawners cruise the entire perimeter looking for hard bottom. Pitch creature baits to laydowns and bed-fish any visible spawning sites.',
      'Sun-warmed shallows fire up by midday. Throw a chatterbait or small swimbait around any cover and pick apart promising spots with a Texas rig.',
    ],
    summer: [
      'Look for the deepest, shadiest, most oxygenated water on the pond. Throw a topwater early, then probe shaded laydowns with a Texas-rigged worm midday.',
      'Any spring inflow or shaded cove holds the bite once sun is up. Skip a finesse jig under cover and follow with a senko on any short strike.',
      'Deepest hole holds the bigger fish through the heat. Drag a football jig across the bottom and pitch worms to any wood you can find.',
    ],
    fall: [
      'Bass roam looking for bait — high-percentage to cover water with reaction baits. Fan-cast spinnerbaits and chatterbaits along the bank and any wood until you trigger a strike.',
      'Whole-pond bite as bait scatters and fish chase. Burn a squarebill or lipless along the bank and switch to a topwater whenever you see surface activity.',
      'Schools wolfpack the entire perimeter on fall feeding sprees. Cover water fast and slow down on the first spot that gives up a fish — they\'re grouped up.',
    ],
    winter: [
      'Slow down on the deepest water available, near any rock or wood that holds heat. Drag a finesse worm or jig along the bottom and give every fish-shaped target a long pause.',
      'The deepest contour the pond offers concentrates the bite. Hop a small jig and dead-stick on every change in the bottom.',
      'Sun-warmed afternoons bring a brief midday window. Slow-stroke a hair jig along the deepest available structure and watch for the lightest tick.',
    ],
  },
};

/**
 * Pick a template deterministically using a hash of `zoneId + season` so the
 * same zone always shows the same body across opens (originality lake-to-
 * lake), without re-randomizing on every render.
 */
export function pickLegendBody(args: {
  featureClass: WaterReaderProductionSvgFeatureClass;
  season: string | undefined | null;
  zoneId: string | undefined | null;
  fallbackBody?: string;
}): string {
  const { featureClass, season, zoneId, fallbackBody } = args;
  const bucket = TEMPLATES[featureClass];
  if (!bucket) return fallbackBody ?? '';
  const list = bucket[normalizeSeason(season)];
  if (!list || list.length === 0) return fallbackBody ?? '';
  const seed = `${zoneId ?? ''}|${normalizeSeason(season)}|${featureClass}`;
  const idx = hashString(seed) % list.length;
  return list[idx];
}

/**
 * Tiny string hash (djb2 variant) — fast, dependency-free, gives a stable
 * unsigned integer for the deterministic template pick.
 */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
