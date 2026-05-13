/**
 * Seasonal legend body templates for the Water Read map key.
 *
 * Replaces the server-supplied `entry.body` text with short, season-aware,
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
 * Normalize whatever the read returns (may include "autumn", capitalized
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
 * When the read season matches the calendar season for the
 * current date, we show a single season ("SPRING"). When they DIFFER, the
 * region's climate is offset from the calendar — Florida is already on a
 * summer pattern in mid-May; far-north lakes are still on winter in early
 * March — and we surface that as "SPRING → SUMMER" so the angler knows
 * the region they're in is behaving differently than the calendar season
 * alone would suggest.
 *
 * Order in the transition label: earlier season → later season in the
 * cyclical order spring → summer → fall → winter → spring …, regardless
 * of which side the seasonal read landed on. Reads as "the region is moving
 * from X conditions toward Y conditions."
 *
 * `now` is injectable for testing; production callers pass `new Date()`.
 */
export function seasonDisplayLabel(
  readSeason: string | undefined | null,
  now: Date = new Date(),
): { label: string; isTransition: boolean } {
  const read = normalizeSeason(readSeason);
  const calendar = calendarSeasonFor(now);
  if (read === calendar) {
    return { label: read.toUpperCase(), isTransition: false };
  }
  const [from, to] = orderSeasons(calendar, read);
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
type StandaloneFeatureClass = Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>;
type PublicConfluenceFeature = 'point' | 'cove' | 'neck' | 'saddle' | 'island' | 'dam' | 'universal';
type ConfluenceTemplateKey =
  | 'point+cove'
  | 'point+neck'
  | 'point+saddle'
  | 'point+island'
  | 'point+dam'
  | 'cove+neck'
  | 'cove+saddle'
  | 'cove+island'
  | 'cove+dam'
  | 'neck+saddle'
  | 'neck+island'
  | 'neck+dam'
  | 'saddle+island'
  | 'saddle+dam'
  | 'island+dam'
  | 'point+cove+island'
  | 'travel_hub'
  | 'island_travel_hub'
  | 'mouth_complex'
  | 'island_complex'
  | 'shoreline_complex'
  | 'mixed_confluence';

const CONFLUENCE_ORDER: PublicConfluenceFeature[] = ['point', 'cove', 'neck', 'saddle', 'island', 'dam', 'universal'];
const PAIR_CONFLUENCE_KEYS = new Set<ConfluenceTemplateKey>([
  'point+cove',
  'point+neck',
  'point+saddle',
  'point+island',
  'point+dam',
  'cove+neck',
  'cove+saddle',
  'cove+island',
  'cove+dam',
  'neck+saddle',
  'neck+island',
  'neck+dam',
  'saddle+island',
  'saddle+dam',
  'island+dam',
]);

const STRUCTURE_TEMPLATES: Record<StandaloneFeatureClass, SeasonTemplates> = {
  main_lake_point: {
    spring: [
      'Start on the outside tip, then work back toward the protected side. Fish moving toward spawning water often pause on this edge.',
      'Check the side that faces the nearest pocket first. A slow presentation along the break usually beats racing across the whole point.',
      'Begin where the point reaches farthest into open water. Then slide toward the inside turn if fish are moving shallow.',
      'Make the first pass across the crown and outside corner. Follow with a slower bait on the edge that leads toward protected water.',
    ],
    summer: [
      'Start on the deepest-looking tip during bright hours. Early and late, check the shallow crown before sliding down the edge.',
      'Fish the open-water side first, especially if bait is nearby. Keep one pass tight to the edge and one across the top.',
      'Use the point like a feeding shelf. Work the outer corner slowly, then check the shaded or wind-facing side.',
      'Begin where the point meets the main basin. If nothing reacts, move shallower at dawn or dusk before leaving.',
    ],
    fall: [
      'Cover the crown first; fall fish often push bait across the top. Then slow down on the first outside drop.',
      'Start on the wind-facing edge if it is present. Fish can roam, so make fan casts before settling into one angle.',
      'Work from the tip back toward the bank. Bait movement usually tells you which side deserves the slower second pass.',
      'Treat the point as a bait stop. Move quickly across the top, then pick apart the outside corner.',
    ],
    winter: [
      'Stay on the steepest outside edge and fish slowly. The best bite is usually close to the most stable water.',
      'Start at the deepest-looking tip and pause often. Winter fish may hold just off the edge rather than on top.',
      'Make fewer casts and keep them precise. Work the break, then let the bait sit near any flat spot.',
      'Use the point as a winter holding edge. The outside corner is the first place to check on a slow day.',
    ],
  },

  secondary_point: {
    spring: [
      'Start on the cove-facing side closest to protected water. Fish often stop here before sliding farther back.',
      'Work the tip first, then the inside bank. A slower bait helps confirm whether fish are staging or already shallow.',
      'Check the first point inside the pocket before running to the back. It is a natural pause spot in spring.',
      'Begin where the small point meets the cove lane. Then pick apart nearby cover with slower casts.',
    ],
    summer: [
      'Fish the shaded side early, then back out to the outer edge. Small points can reload during low light.',
      'Start on the side with the cleanest drop into nearby water. If it is flat, check cover before moving on.',
      'Use this as a quick stop, not a whole-area grind. Make a clean pass around the tip and nearest shade.',
      'Check the cove-mouth side first. Summer fish often use small points briefly before returning to safer water.',
    ],
    fall: [
      'Start with moving casts across the tip. If bait is present, work the bank side before leaving.',
      'Fish use these points while chasing into the pocket. Cover the outside face, then check the first protected turn.',
      'Begin on the wind-facing or bait-facing side. Fall fish may use the point for only a short feeding window.',
      'Work the point as a doorway into the cove. Fast first pass, slower second pass on the better edge.',
    ],
    winter: [
      'Only spend time here if the point has a steep side. Fish slowly on the edge nearest deeper water.',
      'Start on the outside face and keep the bait close to cover or bottom. Winter bites can be subtle.',
      'Check the deepest side first, then the protected pocket side. Leave quickly if both look inactive.',
      'Use this point as a small winter checkpoint. One careful pass on the steep edge is usually enough.',
    ],
  },

  cove: {
    spring: [
      'Start in the protected back half, then work toward the mouth. Hard bottom, wood, and warmer bank lines deserve the first pass.',
      'Check the mouth before committing to the back. Fish often stage at the entrance before moving shallow.',
      'Work the calmest bank first, especially near cover. Then slide toward the first turn that leads out.',
      'Begin where the cove narrows or flattens. Spring fish often pause there before spreading across the back.',
    ],
    summer: [
      'Start at the mouth or the best shade, not the warmest backwater. Leave the back quickly unless bait or cover is obvious.',
      'Fish the shaded side and any narrow lane first. Summer cove bites are often short and cover-related.',
      'Begin where the cove meets open water. If fish are shallow, they usually show themselves early or late.',
      'Work the mouth as the main target. Then check one protected bank before moving to stronger structure.',
    ],
    fall: [
      'Treat the cove as a bait pocket. Cover the mouth first, then follow activity toward the back.',
      'Start with moving casts along both banks. If bait is present, slow down around the tightest turn.',
      'Fish from the throat inward until the life disappears. Fall fish can move fast through this zone.',
      'Begin on the bank that receives bait or wind. Work the back only if the mouth shows signs of life.',
    ],
    winter: [
      'Focus on the mouth and the deepest-looking lane. The back is usually secondary unless it has cover and stable water.',
      'Start where the cove opens to the lake. Work slowly along the edge that offers the quickest escape.',
      'Fish the throat, then the first protected bend. Winter fish often hold where movement is easiest.',
      'Use the cove mouth as the winter target. Keep presentations slow and close to the most defined edge.',
    ],
  },

  neck: {
    spring: [
      'Fish the narrowest water like a travel lane. Start on the side leading toward protected spawning areas.',
      'Begin on the throat, then work both shoulders. Moving fish often pause on one edge before passing through.',
      'Set up so casts cross the gap, not just follow the bank. Then slow down on the calmer shoulder.',
      'Start where the opening pinches tightest. Spring fish may use it repeatedly as they move shallow.',
    ],
    summer: [
      'Start on the shaded or deeper-looking shoulder. The throat can reload when bait or water movement passes through.',
      'Work across the gap first, then down each side. Summer fish usually hold on the safest edge, not the middle.',
      'Begin with a moving bait through the lane. Follow with a slower bait on the best corner.',
      'Treat the neck as a compression spot. Fish the tightest section, then leave if no bait or shade is present.',
    ],
    fall: [
      'Treat the narrowest water like a bait funnel. Cover the throat first, then slow down on the downwind or protected shoulder.',
      'Start with fast casts across the lane. If fish show, repeat the same angle before changing baits.',
      'Fish both entrances to the neck. Fall schools often set up on one side and chase through.',
      'Begin where the banks squeeze bait the hardest. Then check the first widening area outside the pinch.',
    ],
    winter: [
      'Slow down on the deeper shoulder outside the pinch. Fish may sit just off the lane instead of inside it.',
      'Start on the side with the quickest access to stable water. Keep casts tight and let the bait rest.',
      'Work the throat only after checking both edges. Winter fish usually choose the safest nearby corner.',
      'Fish the neck as a slow travel stop. One patient pass on each shoulder is better than covering water fast.',
    ],
  },

  island: {
    spring: [
      'Start on the protected side, then work around to the first outside corner. Fish often circle islands before committing shallow.',
      'Check the side facing the nearest spawning pocket first. Then fish the rim until the bank shape changes.',
      'Begin where the island creates a calm pocket. Spring fish often pause on the lee edge before sliding shallow.',
      'Work the inside rim first, then the open-water corner. Cover and hard bottom are the best clues.',
    ],
    summer: [
      'Work the wind-facing rim first if it is active. Midday, shift to shade, corners, and the steepest-looking side.',
      'Start where the island drops fastest into surrounding water. Then check the shallow rim at low light.',
      'Circle the island with purpose: corners first, straight banks second. Fish often hold where the rim changes angle.',
      'Begin on the open-water side and finish on shade. The best island bite usually sits on one edge, not all around.',
    ],
    fall: [
      'Start on the upwind or bait-facing rim. Cover corners quickly, then slow down where bait stays pinned.',
      'Fish the island as a roaming target. Make a fast lap, then repeat the side that shows life.',
      'Begin on the open-water corner. Fall fish often chase around the rim before settling on one side.',
      'Work moving baits along the rim first. If fish follow, switch to slower casts on the same edge.',
    ],
    winter: [
      'Stay on the steepest or most protected side. Fish slowly and avoid wasting casts on flat, featureless rim.',
      'Start where the island gives fish quick access to stable water. The outside corner is the best first check.',
      'Work the deepest-looking rim with long pauses. Winter fish may hold slightly off the island edge.',
      'Use the island as a holding wall. Pick one strong side and fish it carefully before circling everything.',
    ],
  },

  saddle: {
    spring: [
      'Start where the crossing narrows between two open areas. Fish moving shallow often pause on either shoulder.',
      'Work across the saddle, then down each side. The best bite is usually on one rise, not the entire crossing.',
      'Begin on the side closest to protected water. Then check the opposite shoulder before leaving.',
      'Fish the saddle as a travel bridge. Make broad first passes, then slow down on the cleanest edge.',
    ],
    summer: [
      'Start on the side that faces open water. Summer fish often hold on the edge of the crossing, not the center.',
      'Work the saddle like a feeding shelf. Check the wind-facing rise first, then the deeper-looking lane.',
      'Begin where the crossing meets the main basin. If bait is absent, move to the nearest stronger edge.',
      'Fish both shoulders before writing it off. One side usually has better shade, wind, or depth access.',
    ],
    fall: [
      'Cover the whole crossing first. Fall fish can use either shoulder as bait moves through.',
      'Start with fan casts across the saddle. Slow down only after you contact fish or bait.',
      'Work from one rise to the other. The active side often changes with bait movement.',
      'Begin on the open-water edge, then sweep across the middle. Fall saddles can reload quickly.',
    ],
    winter: [
      'Stay near the deepest-looking part of the crossing. Work slowly and keep the bait near the most stable edge.',
      'Start on the lower shoulder and make patient casts. Winter fish may hold just off the rise.',
      'Fish the saddle as a slow resting place. The best bite is often on the side with quickest deep-water access.',
      'Work one shoulder thoroughly before moving across. In winter, less water covered can mean more bites.',
    ],
  },

  dam: {
    spring: [
      'Start on the sun-warmed rock or wall, then work toward nearby flats. Spring fish use hard edges as staging cover.',
      'Fish parallel to the face before casting straight at it. The best bites often come along the seam.',
      'Begin where rock changes angle or meets a corner. Then slow down on any pocket that holds warmth or cover.',
      'Work the dam as a staging bank. Fish the cleanest rock first, then the nearest transition.',
    ],
    summer: [
      'Start on shade and any water movement along the face. Keep casts tight to the wall or rock edge.',
      'Work corners and seams before straight stretches. Summer fish often hold where bait gets pinned.',
      'Begin on the deepest-looking section, then check the shallow rock at low light. The face can reload fast.',
      'Fish the dam vertically and parallel. The first few feet off the edge are usually the highest-value water.',
    ],
    fall: [
      'Cover the rock face quickly for bait-driven fish. Slow down only where bait or strikes show up.',
      'Start on corners, then run the longest clean seam. Fall fish often pin bait against hard edges.',
      'Fish moving baits along the face first. Then pick apart the best rock change with a slower bait.',
      'Begin where the dam meets natural shoreline. Transitions often hold the first feeding fish.',
    ],
    winter: [
      'Stay on the most stable section of the face. Fish slowly and keep the bait close to rock or wall contact.',
      'Start on the deepest-looking corner. Winter fish often hold tight to the edge with little movement.',
      'Work the sun-exposed face during the warmest window. Slow presentations along rock changes get the first pass.',
      'Fish the dam as a winter holding bank. Make patient casts along the wall before checking nearby flats.',
    ],
  },

  universal: {
    spring: [
      'Start on the warmest bank with visible cover. Then check the nearest transition into slightly deeper water.',
      'Work the most protected shoreline first. Spring fish often gather where cover and calm water meet.',
      'Begin with slow casts around obvious cover. If fish are active, widen out and cover the nearby bank.',
      'Check the bank that gets sun and protection. Then fish the first edge leading away from it.',
    ],
    summer: [
      'Start on shade, cover, or the deepest-looking water available. Midday fish usually choose comfort over roaming.',
      'Fish low-light edges first, then move to shade. Any cover near better water deserves a slower pass.',
      'Begin where the bank changes shape. Small ponds and simple lakes often fish best around subtle edges.',
      'Work the best-looking cover carefully. If it is empty, move quickly to the next shade or depth change.',
    ],
    fall: [
      'Cover water until you find bait or active fish. Then slow down on the best bank change nearby.',
      'Start with moving casts along the most defined shoreline. Fall fish can roam, so avoid camping too early.',
      'Fish the bank that collects bait first. Once you get a bite, repeat the angle before moving on.',
      'Begin on the cleanest edge, then check cover. Fall movement rewards a fast first look.',
    ],
    winter: [
      'Start on the deepest-looking stable water and slow everything down. Cover and rock make the spot more worth your time.',
      'Fish fewer targets with more patience. The best winter water is usually protected, deeper, or close to cover.',
      'Begin where the bank drops fastest. Keep the bait near bottom or cover and give fish time to commit.',
      'Work the most stable edge first. Winter fish rarely chase far, so precise casts matter more than speed.',
    ],
  },
};

const CONFLUENCE_TEMPLATES: Record<ConfluenceTemplateKey, SeasonTemplates> = {
  'point+cove': {
    spring: [
      'Start where the point guards the cove mouth. Work the outside corner first, then slide into the protected edge.',
      'Fish the point side before running to the back. Spring fish often pause at the mouth before moving shallow.',
    ],
    summer: [
      'Start on the mouth side that reaches open water fastest. Then check shade inside the cove if fish are shallow.',
      'Fish the point as the daytime edge and the cove as the low-light option. Do not spend long in dead backwater.',
    ],
    fall: [
      'Treat this as a bait doorway. Cover the point first, then follow activity into the cove.',
      'Start with fast casts across the mouth. Slow down where the point edge meets the protected bank.',
    ],
    winter: [
      'Stay on the mouth and point edge, not the shallow back. Fish slowly where the cove gives quick access out.',
      'Start on the outside corner closest to stable water. Then check the protected side only if it has cover.',
    ],
  },
  'point+neck': {
    spring: [
      'Start where the point feeds into the narrow lane. Fish the shoulder leading toward protected water before crossing the gap.',
      'Work the point tip first, then the throat. Moving fish often pause where the two edges meet.',
    ],
    summer: [
      'Begin on the shaded or deeper side of the point-neck corner. Then run one pass through the tight lane.',
      'Fish the point as the ambush edge and the neck as the travel lane. Slow down on the best shoulder.',
    ],
    fall: [
      'Cover the pinch and point together. Bait often gets pushed across the tip before sliding through the lane.',
      'Start with moving casts through the gap. Repeat the point-side angle if fish show themselves.',
    ],
    winter: [
      'Stay on the deeper shoulder where the point meets the neck. Fish slowly and avoid the middle until the edges are checked.',
      'Start just outside the tightest water. The point-side corner is usually the safer winter hold.',
    ],
  },
  'point+saddle': {
    spring: [
      'Start where the point reaches into the crossing. Work the point side first, then sweep across the saddle.',
      'Fish the shoulder closest to protected water. Spring movement often pauses where the point and crossing meet.',
    ],
    summer: [
      'Begin on the open-water edge of the point. Then check the saddle side that gives fish the fastest escape.',
      'Fish the point as the target and the saddle as the route. One slow pass across each edge is enough to learn it.',
    ],
    fall: [
      'Cover the point crown and saddle crossing together. Fall fish can roam between both without settling.',
      'Start on the bait-facing side. If the point is active, the saddle shoulder nearby deserves a second pass.',
    ],
    winter: [
      'Stay on the deepest-looking side of the point-saddle connection. Fish slowly across the corner, not the whole crossing.',
      'Start where the point drops into the saddle. Winter fish usually hold on the safer edge.',
    ],
  },
  'point+island': {
    spring: [
      'Start in the gap between island and point. Then work the protected side that leads toward spawning water.',
      'Fish the island-facing side of the point first. Spring fish often circle the gap before moving shallow.',
    ],
    summer: [
      'Begin on the open-water corner between point and island. Shade, wind, or the steepest edge should choose your first pass.',
      'Work the gap as the main lane. Then check whichever side gives fish the quickest slide to safety.',
    ],
    fall: [
      'Cover both rims quickly where they face each other. Bait can get trapped between the point and island.',
      'Start on the outside corner, then sweep through the gap. Slow down only where bait or strikes appear.',
    ],
    winter: [
      'Fish the deepest-looking side of the gap with patience. The point-island corner can hold fish just off the edge.',
      'Start on the protected side with the shortest route to stable water. Keep casts precise and slow.',
    ],
  },
  'point+dam': {
    spring: [
      'Start where the point meets the hard dam edge. Fish the transition first, then follow the point toward nearby flats.',
      'Work the rock-to-point seam slowly. Spring fish often use that change before moving shallow.',
    ],
    summer: [
      'Begin on shade or wall contact near the point. Then check the point tip if bait is present.',
      'Fish the dam face as the hold and the point as the feeding edge. Work the corner first.',
    ],
    fall: [
      'Start on the hard edge where bait can be pinned. Then sweep the point side with moving casts.',
      'Cover the dam seam first, then the point crown. Fall fish often slide between both quickly.',
    ],
    winter: [
      'Stay on the stable wall-point corner. Fish slowly along the hard edge before checking the point.',
      'Start on the deepest-looking side of the transition. Winter fish may hold tight to the wall.',
    ],
  },
  'cove+neck': {
    spring: [
      'Start at the neck leading into the cove. Fish both shoulders before moving into the protected back.',
      'Work the throat first, then the inside edge. Spring fish often use this as the last doorway shallow.',
    ],
    summer: [
      'Begin on the cove mouth side of the neck. If shade or bait is absent, make a quick pass and move on.',
      'Fish the narrow lane first, then the best shaded edge inside the cove. Avoid grinding warm, empty water.',
    ],
    fall: [
      'This is a bait doorway. Cover the throat quickly, then slow down on the first hard edge inside.',
      'Start outside the neck and fish inward. Fall fish often chase through the opening before settling in the cove.',
    ],
    winter: [
      'Stay near the mouth side of the neck. Fish slowly where the cove gives fish an easy exit.',
      'Start on the deeper shoulder outside the cove. The back is secondary unless it has cover and stable water.',
    ],
  },
  'cove+saddle': {
    spring: [
      'Start where the saddle leads into the cove mouth. Fish the protected shoulder before checking the back.',
      'Work the crossing as the staging route. Then slow down on the cove-side edge.',
    ],
    summer: [
      'Begin on the open-water side of the cove-saddle connection. Then check shade or cover inside the mouth.',
      'Fish the saddle side first during bright hours. Use the cove only if bait or shade makes it worth staying.',
    ],
    fall: [
      'Cover the saddle crossing, then follow bait into the cove. This zone can reload in waves.',
      'Start at the cove mouth and fan across the saddle. Slow down where the route pinches tightest.',
    ],
    winter: [
      'Stay on the saddle side of the mouth. Fish slowly near the most stable edge before entering the cove.',
      'Start on the deeper-looking shoulder. The cove back is usually a late option, not the first cast.',
    ],
  },
  'cove+island': {
    spring: [
      'Start on the island side facing the cove. Then work the protected bank leading into the pocket.',
      'Fish the gap between island and cove mouth first. Spring fish often pause there before sliding shallow.',
    ],
    summer: [
      'Begin on the island edge closest to open water. Then check the shaded cove side during low light.',
      'Work the island as the safer hold and the cove as the feeding option. Do not overstay the back.',
    ],
    fall: [
      'Start where bait can be trapped between island and cove. Cover both edges before moving deeper into the pocket.',
      'Fish the cove mouth first, then circle the island side that faces it. Fall movement can switch quickly.',
    ],
    winter: [
      'Stay on the island edge nearest the cove mouth. Fish slowly where the pocket still offers quick escape.',
      'Start on the deeper-looking side of the island-cove gap. The protected bank is the second pass.',
    ],
  },
  'cove+dam': {
    spring: [
      'Start where the hard dam edge meets the cove entrance. Then work toward the warmer protected bank.',
      'Fish the rock-to-cove transition first. Spring fish often stage on the hard edge before sliding inside.',
    ],
    summer: [
      'Begin on shade along the dam near the cove mouth. Then check the cove only if bait or cover is obvious.',
      'Fish the hard edge as the hold and the cove mouth as the feeding lane. The corner matters most.',
    ],
    fall: [
      'Start where bait can be pinned against the dam and pushed into the cove. Cover the corner quickly.',
      'Work the dam seam first, then sweep into the mouth. Slow down only where bait stays present.',
    ],
    winter: [
      'Stay on the dam side of the cove mouth. Fish slowly along the hard edge closest to stable water.',
      'Start on the deepest-looking wall near the pocket. The cove back is a secondary check.',
    ],
  },
  'neck+saddle': {
    spring: [
      'Start at the tighter part of the crossing. Fish both shoulders before widening out across the saddle.',
      'Work the neck first, then the saddle side leading toward protected water. This is a true travel route.',
    ],
    summer: [
      'Begin on the deeper-looking shoulder outside the pinch. Then check the saddle edge that faces open water.',
      'Fish the tight lane as the trigger and the saddle as the hold. One side will usually be stronger.',
    ],
    fall: [
      'Cover the neck quickly, then sweep the saddle. Bait can use both routes in the same window.',
      'Start where the crossing compresses most. Repeat any angle that contacts fish before moving wider.',
    ],
    winter: [
      'Stay on the safest edge outside the tight lane. Fish slowly where the saddle gives fish room to hold.',
      'Start on the deeper shoulder and avoid the shallow middle. Winter fish usually sit beside the route.',
    ],
  },
  'neck+island': {
    spring: [
      'Treat the island-side gap as a travel lane. Start on the tighter shoulder, then check the protected side.',
      'Fish the neck where it brushes the island edge. Spring fish often pause before entering nearby pockets.',
    ],
    summer: [
      'Start on shade or the deeper island-side shoulder. Then work one pass through the tight lane.',
      'Fish the island as the hold and the neck as the route. The best corner is usually not the middle.',
    ],
    fall: [
      'Cover the gap between island and shore first. Bait can get squeezed hard through this lane.',
      'Start with moving casts through the throat. Slow down on the island-side corner that shows life.',
    ],
    winter: [
      'Stay just outside the island gap on the deeper side. Fish slowly and keep casts close to the edge.',
      'Start on the protected shoulder, then check the outside island corner. Winter fish may sit off the lane.',
    ],
  },
  'neck+dam': {
    spring: [
      'Start where the neck meets the hard dam edge. Fish the transition before working through the gap.',
      'Work the throat first, then the rock seam. Moving fish often pause on the hard corner.',
    ],
    summer: [
      'Begin on the shaded dam side of the neck. Then run one pass across the tightest water.',
      'Fish the wall as the hold and the neck as the lane. The corner gets the first slow pass.',
    ],
    fall: [
      'Cover the neck with moving casts, then run the dam seam. Bait can be pinned against either edge.',
      'Start where the hard edge tightens the lane. Repeat the best angle before changing sides.',
    ],
    winter: [
      'Stay on the stable wall-side shoulder. Fish slowly where the neck gives quick access to deeper water.',
      'Start just outside the tight lane along the hard edge. The middle is the last check.',
    ],
  },
  'saddle+island': {
    spring: [
      'Start on the island-side rise of the saddle. Fish the protected shoulder before checking open water.',
      'Work the crossing where it touches the island rim. Spring fish often pause there before moving shallow.',
    ],
    summer: [
      'Begin on the island edge that faces the saddle. Then check the open-water shoulder during bright hours.',
      'Fish the saddle as the route and the island as the hold. The first strong corner gets the slow pass.',
    ],
    fall: [
      'Cover the saddle crossing, then the island rim that faces it. Bait can swing across both quickly.',
      'Start on the wind-facing rise if it is present. Then sweep the island-side gap with moving casts.',
    ],
    winter: [
      'Stay on the deepest-looking island-side shoulder. Fish slowly across the connection, not the whole island.',
      'Start where the saddle drops away from the island. Winter fish often hold just off that edge.',
    ],
  },
  'saddle+dam': {
    spring: [
      'Start where the saddle meets the hard edge. Fish the dam-side shoulder before crossing wider water.',
      'Work the rock transition first, then sweep across the saddle. Spring fish may stage on either edge.',
    ],
    summer: [
      'Begin on the dam side if it offers shade or water movement. Then check the saddle shoulder facing open water.',
      'Fish the wall as the hold and the saddle as the feeding route. The meeting corner is the key spot.',
    ],
    fall: [
      'Cover the hard edge first, then sweep the saddle. Bait can get pushed across the crossing into the wall.',
      'Start on the corner where the dam frames the saddle. Slow down after the first contact.',
    ],
    winter: [
      'Stay on the stable wall-side edge of the saddle. Fish slowly and keep casts close to the hard structure.',
      'Start where the crossing meets the deepest-looking wall. Winter fish often choose that secure corner.',
    ],
  },
  'island+dam': {
    spring: [
      'Start in the gap between island and hard edge. Fish the protected side before checking the outside rim.',
      'Work the dam-side island corner first. Spring fish can stage there before moving toward warmer banks.',
    ],
    summer: [
      'Begin on shade or water movement between island and wall. Then circle to the steepest island edge.',
      'Fish the hard edge as the hold and the island rim as the feeding path. Corners matter most.',
    ],
    fall: [
      'Cover the island-wall gap quickly. Bait can get pinned between the hard edge and the island rim.',
      'Start on the outside corner, then run the wall seam. Slow down where bait stays trapped.',
    ],
    winter: [
      'Stay on the deepest-looking side of the island-wall connection. Fish slowly and keep contact with the edge.',
      'Start where the island gives fish a protected corner near hard structure. The open rim is second.',
    ],
  },
  'point+cove+island': {
    spring: [
      'Start at the mouth where point, island, and cove meet. Work the protected edge after checking the outside corner.',
      'Fish this as a staging intersection. Start outside, then slide into the cove-facing side.',
    ],
    summer: [
      'Begin on the open-water corner of the complex. Then check shade between island and cove only if life is present.',
      'Work the point and island edges first. The cove side is a low-light or cover-driven follow-up.',
    ],
    fall: [
      'This is a bait pocket with multiple exits. Cover the outside corner first, then follow activity into the cove.',
      'Start with moving casts across the mouth. Slow down where bait gets pinned between island and point.',
    ],
    winter: [
      'Stay on the outside edge of the complex. Fish slowly near the point-island corner closest to stable water.',
      'Start outside the cove and avoid chasing shallow water too early. The protected side is the second pass.',
    ],
  },
  travel_hub: {
    spring: [
      'This is a travel hub, not a single cast target. Start on the lane leading toward protected water, then check each shoulder.',
      'Fish the tightest route first. Then slow down on the side that points toward spawning water.',
    ],
    summer: [
      'Start on the safest edge of the travel lane. Summer fish usually hold beside the route until food moves through.',
      'Work the most defined shoulder first. Then make one pass through the center before leaving.',
    ],
    fall: [
      'Cover the travel lane quickly and watch for bait. If fish show, repeat the same angle before widening out.',
      'Start where routes compress hardest. Fall fish can move through fast, so make the first pass efficient.',
    ],
    winter: [
      'Stay just off the main travel lane on the deepest-looking side. Fish slowly and avoid racing through the middle.',
      'Start on the most stable shoulder. Winter fish use the route, but usually hold beside it.',
    ],
  },
  island_travel_hub: {
    spring: [
      'Start on the island-side lane that points toward protected water. Fish both shoulders before circling the island.',
      'Work the gap first, then the island corner. Spring movement often pauses where the route brushes the rim.',
    ],
    summer: [
      'Begin on shade or the deeper island-side shoulder. Treat the route as a feeding window, not an all-day guarantee.',
      'Fish the island as the hold and the lane as the trigger. The best side usually has shade, wind, or depth access.',
    ],
    fall: [
      'Cover the lane beside the island first. Bait can get trapped against the rim before pushing through.',
      'Start fast through the gap, then slow down on the island corner that shows life.',
    ],
    winter: [
      'Stay on the stable side of the island route. Fish slowly just off the rim, not across the whole zone.',
      'Start where the island drops into the lane. Winter fish often hold outside the traffic.',
    ],
  },
  mouth_complex: {
    spring: [
      'Start at the mouth before running shallow. Work the outside corner first, then the protected edge inside.',
      'Fish this as the entrance to spawning water. The best cast usually crosses the mouth, not the back.',
    ],
    summer: [
      'Begin on the outside edge of the mouth. Then check shade or cover inside only if fish are active.',
      'Use the mouth as the primary target. Summer fish may visit the pocket briefly, then slide back out.',
    ],
    fall: [
      'Treat the mouth as a bait gate. Cover it quickly, then follow activity into the pocket.',
      'Start with fan casts across the entrance. Slow down where bait or strikes collect.',
    ],
    winter: [
      'Stay near the outside mouth edge. Fish slowly where the pocket gives quick access to stable water.',
      'Start outside the pocket and only move in if cover or bait makes it worth it.',
    ],
  },
  island_complex: {
    spring: [
      'Start on the island side that faces protected water. Then work the strongest corner before circling wider.',
      'Fish the island as a staging hub. The protected rim and nearest route get the first passes.',
    ],
    summer: [
      'Begin on the island edge with shade, wind, or quickest depth access. Then check the connected structure beside it.',
      'Work the island corner first. The attached structure tells you where fish can slide next.',
    ],
    fall: [
      'Cover the island-facing edges quickly. Bait can move around the rim and across the attached structure.',
      'Start where the island creates the tightest lane. Slow down only after the first sign of life.',
    ],
    winter: [
      'Stay on the island side closest to stable water. Fish slowly and avoid trying to cover every rim.',
      'Start on the strongest island corner, then check the connected edge. Winter fish usually pick one safe side.',
    ],
  },
  shoreline_complex: {
    spring: [
      'Start where the hard or shaped bank meets protected water. Fish the transition before spreading out.',
      'Work the best corner first. Spring fish often pause where shoreline changes give them cover and direction.',
    ],
    summer: [
      'Begin on shade, hard edge, or the cleanest drop. Then check the connected bank only if it has cover.',
      'Fish the strongest shoreline change first. Summer fish rarely use every part of a broad complex.',
    ],
    fall: [
      'Cover the shoreline change quickly for bait-driven fish. Then slow down on the corner that shows activity.',
      'Start where bait can be trapped against the bank. Work outward only after the edge produces.',
    ],
    winter: [
      'Stay on the most stable hard edge. Fish slowly and keep casts close to the best corner.',
      'Start where the shoreline change meets deeper-looking water. Winter fish usually hold tight to that edge.',
    ],
  },
  mixed_confluence: {
    spring: [
      'Start on the side leading toward protected water. Then work each nearby edge until the best route becomes clear.',
      'Fish the most obvious corner first. Spring movement usually favors the edge closest to safe shallow water.',
    ],
    summer: [
      'Begin on shade, wind, or the deepest-looking edge. Then check the connected structure that offers the quickest escape.',
      'Do not fish the whole overlap blindly. Pick the strongest edge and make a deliberate first pass.',
    ],
    fall: [
      'Cover the overlap quickly until bait or strikes reveal the active side. Then repeat that angle.',
      'Start where the most routes meet. Fall fish may move through fast, so keep the first pass efficient.',
    ],
    winter: [
      'Stay on the most stable edge of the overlap. Fish slowly and avoid chasing every piece of the zone.',
      'Start on the side with quickest deep-water access. Winter fish usually hold beside the intersection.',
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
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[];
  season: string | undefined | null;
  zoneId: string | undefined | null;
  zoneIds?: string[];
  title?: string;
  placementKinds?: string[];
  fallbackBody?: string;
}): string {
  const { featureClass, season, zoneId, zoneIds, fallbackBody } = args;
  const templateKey = featureClass === 'structure_confluence'
    ? confluenceTemplateKey(args)
    : featureClass;
  const bucket = featureClass === 'structure_confluence'
    ? CONFLUENCE_TEMPLATES[templateKey as ConfluenceTemplateKey]
    : STRUCTURE_TEMPLATES[templateKey as StandaloneFeatureClass];
  if (!bucket) return fallbackBody ?? '';
  const list = bucket[normalizeSeason(season)];
  if (!list || list.length === 0) return fallbackBody ?? '';
  const stableZoneSeed = zoneIds?.length ? [...zoneIds].sort().join('|') : zoneId ?? '';
  const seed = `${stableZoneSeed}|${normalizeSeason(season)}|${templateKey}`;
  const idx = hashString(seed) % list.length;
  return list[idx];
}

function confluenceTemplateKey(args: {
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[];
  title?: string;
  placementKinds?: string[];
}): ConfluenceTemplateKey {
  const features = confluenceFeatureSet(args.featureClasses, args.title, args.placementKinds);
  if (features.length < 2) return 'mixed_confluence';
  const exactKey = features.join('+') as ConfluenceTemplateKey;
  if (exactKey === 'point+cove+island') return exactKey;
  if (features.length === 2 && PAIR_CONFLUENCE_KEYS.has(exactKey)) return exactKey;

  const hasPoint = features.includes('point');
  const hasCove = features.includes('cove');
  const hasNeck = features.includes('neck');
  const hasSaddle = features.includes('saddle');
  const hasIsland = features.includes('island');
  const hasDam = features.includes('dam');
  const hasTravel = hasNeck || hasSaddle;

  if (hasIsland && hasTravel) return 'island_travel_hub';
  if (hasPoint && hasCove && hasIsland) return 'point+cove+island';
  if (hasTravel) return 'travel_hub';
  if (hasPoint && hasCove) return 'mouth_complex';
  if (hasIsland) return 'island_complex';
  if (hasDam) return 'shoreline_complex';
  return 'mixed_confluence';
}

function confluenceFeatureSet(
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[],
  title?: string,
  placementKinds?: string[],
): PublicConfluenceFeature[] {
  const labels = new Set<PublicConfluenceFeature>();
  for (const feature of featureClasses ?? []) {
    labels.add(publicConfluenceFeature(feature));
  }
  if (labels.size < 2) {
    const text = `${title ?? ''} ${(placementKinds ?? []).join(' ')}`.toLowerCase();
    if (/\bpoint\b/.test(text)) labels.add('point');
    if (/\bcove\b/.test(text)) labels.add('cove');
    if (/\bneck\b|\bpinch\b/.test(text)) labels.add('neck');
    if (/\bsaddle\b/.test(text)) labels.add('saddle');
    if (/\bisland\b/.test(text)) labels.add('island');
    if (/\bdam\b|\briprap\b|\bwall\b/.test(text)) labels.add('dam');
  }
  return CONFLUENCE_ORDER.filter((feature) => labels.has(feature) && feature !== 'universal');
}

function publicConfluenceFeature(feature: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>): PublicConfluenceFeature {
  switch (feature) {
    case 'main_lake_point':
    case 'secondary_point':
      return 'point';
    case 'cove':
    case 'neck':
    case 'saddle':
    case 'island':
    case 'dam':
    case 'universal':
      return feature;
    default:
      return 'universal';
  }
}

const FORBIDDEN_COPY_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bengine\b/i, reason: 'internal engine wording' },
  { pattern: /\balgorithm\b/i, reason: 'internal algorithm wording' },
  { pattern: /\bdetected\b/i, reason: 'internal detection wording' },
  { pattern: /\bpolygon\b/i, reason: 'internal polygon wording' },
  { pattern: /\bcandidate\b/i, reason: 'internal candidate wording' },
  { pattern: /\bconfidence\b|\bscore\b/i, reason: 'internal scoring wording' },
  { pattern: /\belectronics?\b|\bgraph\b|\bsonar\b/i, reason: 'unsupported electronics wording' },
  { pattern: /\b\d+\s*(?:-|to)\s*\d+\s*(?:ft|feet)\b/i, reason: 'exact depth range' },
  { pattern: /\b\d+\s*(?:ft|feet)\b/i, reason: 'exact depth' },
  { pattern: /\b\d+\s*(?:sec|second|seconds)\b/i, reason: 'exact pause timing' },
];

export function waterReaderLegendTemplateQualityReport(): {
  ok: boolean;
  checked: number;
  issues: Array<{ key: string; season: LegendSeason; text: string; reason: string }>;
} {
  const issues: Array<{ key: string; season: LegendSeason; text: string; reason: string }> = [];
  let checked = 0;
  const allBuckets: Record<string, SeasonTemplates> = {
    ...STRUCTURE_TEMPLATES,
    ...CONFLUENCE_TEMPLATES,
  };

  for (const [key, seasons] of Object.entries(allBuckets)) {
    for (const season of SEASON_ORDER) {
      for (const text of seasons[season] ?? []) {
        checked += 1;
        const sentenceCount = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        if (sentenceCount > 2) {
          issues.push({ key, season, text, reason: 'more than two sentences' });
        }
        if (wordCount > 38) {
          issues.push({ key, season, text, reason: `too long: ${wordCount} words` });
        }
        for (const { pattern, reason } of FORBIDDEN_COPY_PATTERNS) {
          if (pattern.test(text)) issues.push({ key, season, text, reason });
        }
      }
    }
  }

  return { ok: issues.length === 0, checked, issues };
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
