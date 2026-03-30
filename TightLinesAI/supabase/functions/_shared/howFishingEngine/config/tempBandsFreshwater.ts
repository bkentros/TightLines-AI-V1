/** Freshwater air-temp band tables — biologically grounded V2 calibration.
 *
 * Row format: [very_cold_max, cool_max, optimal_max, warm_max, [s0,s1,s2,s3,s4]]
 *   s0=very_cold score, s1=cool score, s2=optimal score, s3=warm score, s4=very_warm score
 *   Scores in range [-2, 2]; engine lerps continuously between zones.
 *   These are AIR temperatures in °F (air-to-water translation baked into calibration).
 *
 * Score patterns:
 *   WINTER   [-2,-1, 1, 2, 0]  — warmer winter days = better fishing; very_warm = unusual
 *   SHOULDER [-2,-1, 2, 1,-1]  — clear sweet spot; warm ok but pushing limits
 *   SUM_MOD  [-2,-1, 2, 0,-2]  — meaningful cool summer window; heat above kills activity
 *   SUM_HOT  [-2,-1, 1, 0,-2]  — even "optimal" compromised by broad summer heat stress
 *
 * Summer very_cold threshold rule: ~18-22°F below regional mean air temp for that month.
 * Zone widths: each zone spans ~8-14°F for smooth lerp behavior.
 */
import type { RegionKey } from "../contracts/region.ts";

type TempBandRow = [number, number, number, number, number[]];

export const FRESHWATER_TEMP_ROWS: Record<RegionKey, TempBandRow[]> = {

  // ── NORTHEAST ────────────────────────────────────────────────────────────────
  // Species: bass, walleye, perch, pike, trout. Mixed cold/cool-water fishery.
  // July mean air ~72°F → very_cold threshold ~52°F (cold-front event, not normal cool day)
  northeast: [
    [22, 34, 44, 54, [-2, -1,  1,  2,  0]],  // Jan — deep winter; 34-44°F = ice fishing; warm days briefly active bass
    [24, 36, 46, 56, [-2, -1,  1,  2,  0]],  // Feb — still frozen; same pattern
    [32, 42, 52, 62, [-2, -1,  1,  2,  0]],  // Mar — WINTER: ice-out; above-avg warmth = first bass/perch
    [34, 48, 62, 72, [-2, -0.5,  2,  1, -1]],  // Apr — SHOULDER: trout prime 44-55°F; soften cool-band so trout-optimal days don't score as suppressors
    [52, 62, 72, 82, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime bass pre/spawn; walleye spawn
    [52, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: 64-76°F sweet spot; above 86°F pushes stress
    [52, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 52°F = genuine cold front; mean ~72°F
    [50, 62, 74, 84, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: slight cooling; same pattern
    [46, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: walleye/bass very active; excellent fall bite
    [38, 50, 62, 72, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: best foliage/fall fishing; pike/walleye prime
    [28, 40, 52, 62, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late-season bass slowing; warm days = activity
    [22, 34, 46, 56, [-2, -1,  1,  2,  0]],  // Dec — WINTER: ice forming; warm spells keep fish briefly active
  ],

  // ── SOUTHEAST ATLANTIC ───────────────────────────────────────────────────────
  // Species: bass, striper, crappie, catfish. Warm-water focused.
  // July mean air ~83°F → very_cold threshold ~62°F
  southeast_atlantic: [
    [32, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Jan — mild winter; bass deep but warm days trigger feeding
    [36, 46, 58, 68, [-2, -1,  1,  2,  0]],  // Feb — pre-spawn staging begins; above-avg warmth = active
    [44, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: bass pre-spawn prime; crappie bedding
    [52, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: spawn peak; topwater begins
    [60, 70, 80, 88, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: excellent before heat sets in
    [64, 74, 82, 90, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: warming fast; early morning only viable
    [62, 72, 82, 90, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 62°F = cold front event (mean ~83°F)
    [62, 72, 82, 90, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; fishing early AM/evening
    [60, 70, 80, 88, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling begins; bass very active
    [50, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: excellent fall fishing; striper run begins
    [40, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: crappie prime; bass still active
    [34, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days = active bass; cold slows crappie
  ],

  // ── FLORIDA ──────────────────────────────────────────────────────────────────
  // Species: largemouth bass, peacock bass, crappie, catfish.
  // BEST fishing = winter (Nov-Mar); summer is the WORST season due to extreme heat.
  // Bass optimal water: 65-75°F → calibrate for pre-spawn winter/spring focus.
  // July mean air ~90°F → even "optimal" summer air correlates with 88-94°F water = poor.
  florida: [
    [50, 62, 74, 82, [-2, -1,  2,  1, -1]],  // Jan — BEST MONTH: bass pre-spawn staging; crappie prime; 62-74°F = ideal water conditions
    [54, 64, 76, 84, [-2, -1,  2,  1, -1]],  // Feb — PRIME: bass spawn begins; largemouth most active; peacock bass feeding
    [58, 68, 78, 86, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: spawn peak; great bass topwater; crappie wrapping up spawn
    [64, 72, 82, 90, [-2, -1,  2,  0, -2]],  // Apr — SHOULDER: post-spawn; bass recovering; warming toward summer
    [70, 78, 86, 92, [-2, -1,  1,  0, -2]],  // May — SUM_HOT: heat arriving; morning/evening only viable
    [74, 82, 88, 94, [-2, -1,  0, -1, -2]],  // Jun — WORST: no good air temp for FL bass; water 86-92°F = stress
    [76, 84, 90, 96, [-2, -1,  0, -1, -2]],  // Jul — WORST: brutal heat; even peacock bass slow in midday
    [76, 84, 90, 96, [-2, -1,  0, -1, -2]],  // Aug — WORST: same as July; only dawn/dusk viable
    [72, 80, 88, 94, [-2, -1,  1,  0, -2]],  // Sep — SUM_HOT: slight improvement; afternoon thunderstorms help
    [62, 72, 82, 90, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: cooling; bass feeding more; excellent for peacock bass
    [56, 66, 76, 84, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER → PRIME: water cooling to ideal; bass and crappie excellent
    [52, 62, 74, 82, [-2, -1,  2,  1, -1]],  // Dec — PRIME: pre-spawn bass staging; best crappie season; comfortable air
  ],

  // ── GULF COAST ────────────────────────────────────────────────────────────────
  // Species: bass, catfish, crappie. Heat-tolerant but brutal summers.
  // July mean air ~91°F → very_cold threshold ~70°F (cold front in summer = unusual)
  gulf_coast: [
    [40, 52, 64, 74, [-2, -1,  1,  2,  0]],  // Jan — mild winter; warm days = active bass and crappie
    [44, 54, 66, 76, [-2, -1,  1,  2,  0]],  // Feb — warming; crappie spawning begins in late Feb
    [52, 62, 72, 82, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: bass spawn; crappie prime; excellent overall
    [60, 70, 80, 88, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: top-water bass; catfish very active
    [68, 76, 84, 92, [-2, -1,  1,  0, -2]],  // May — SUM_HOT: heat arriving fast; morning only
    [72, 80, 86, 92, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: brutal; deep-water catfish only during day
    [72, 80, 86, 92, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 72°F = actual cold front (mean ~91°F)
    [70, 78, 86, 92, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; slight taper; evening catfish
    [68, 76, 84, 90, [-2, -1,  1,  0, -2]],  // Sep — SUM_HOT: still very hot; catfish viable in evening
    [58, 68, 78, 88, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: cooling brings bass back; crappie active
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: excellent bass and crappie; pre-spawn staging
    [42, 52, 64, 74, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days trigger feeding; cold suppresses
  ],

  // ── GREAT LAKES / UPPER MIDWEST ──────────────────────────────────────────────
  // Species: walleye, perch, smallmouth/largemouth bass, pike, trout, Great Lakes salmon.
  // Cold-water tolerant species. Lakes buffer temperature extremes significantly.
  // July mean air ~76°F → very_cold threshold ~50°F (genuine cold-front disruption to lake fishing)
  great_lakes_upper_midwest: [
    [14, 26, 36, 46, [-2, -1,  1,  2,  0]],  // Jan — frozen lakes; ice fishing; 26-36°F = typical ice fishing days
    [16, 28, 38, 48, [-2, -1,  1,  2,  0]],  // Feb — deep ice season; perch and walleye under ice
    [22, 34, 48, 58, [-2, -0.5,  1,  2,  0]],  // Mar — WINTER: ice-out; pike & walleye staging; 34-48°F = neutral-to-good for cold-tolerant species
    [30, 42, 56, 70, [-2, -0.5,  2,  1, -1]],  // Apr — SHOULDER: walleye spawn prime at 42-56°F; soften cool-band penalty for cold-tolerant species
    [40, 52, 66, 78, [-2, -0.5,  2,  1, -1]],  // May — SHOULDER: walleye/bass pre-spawn; 52°F = cool but active for smallmouth/walleye
    [50, 62, 74, 84, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: prime Great Lakes surface; walleye/bass excellent
    [50, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 50°F = cold front event (mean ~76°F); 64-76°F = prime
    [48, 62, 74, 84, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: lake thermal inertia keeps water warm; 62°F air ≠ cold lake
    [44, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: walleye/smallmouth prime; salmon running in tributaries
    [36, 48, 60, 70, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: best walleye and pike month; coho salmon in streams
    [26, 36, 48, 58, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late-season walleye/pike; warm days keep fish active
    [16, 28, 38, 48, [-2, -1,  1,  2,  0]],  // Dec — WINTER: ice forming; transition to ice fishing
  ],

  // ── MIDWEST INTERIOR ──────────────────────────────────────────────────────────
  // Species: bass, catfish, walleye, crappie. Heat-tolerant but hot summers push fish deep.
  // July mean air ~83°F → very_cold threshold ~62°F (cold-front event in summer)
  midwest_interior: [
    [18, 30, 42, 52, [-2, -1,  1,  2,  0]],  // Jan — frozen; above-avg warmth = first river fishing
    [22, 32, 44, 54, [-2, -1,  1,  2,  0]],  // Feb — still cold; warm days bring crappie to shallows
    [32, 44, 54, 64, [-2, -1,  1,  2,  0]],  // Mar — WINTER: ice-out; walleye spawn in rivers; warm days prime
    [44, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: bass pre-spawn; crappie bedding; walleye run
    [54, 64, 76, 86, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime season; all species active
    [60, 70, 80, 88, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD transitioning to hot; early morning excellent
    [62, 74, 84, 92, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 62°F = cold front (mean ~83°F); dawn/dusk only
    [60, 72, 82, 90, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: similar; evening catfish and walleye viable
    [52, 62, 76, 86, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling; walleye/smallmouth prime; excellent fall start
    [42, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: excellent walleye/bass/crappie; fall prime
    [30, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late bass/walleye; warm days extend season
    [22, 32, 44, 54, [-2, -1,  1,  2,  0]],  // Dec — WINTER: dormant season; warm spells = brief activity
  ],

  // ── SOUTH CENTRAL ────────────────────────────────────────────────────────────
  // Species: bass, catfish, crappie, striper. Very heat-tolerant species.
  // TX Hill Country, AR, OK, KY, TN. Brutal summer heat.
  // July mean air ~90°F → very_cold threshold ~70°F
  south_central: [
    [30, 40, 52, 62, [-2, -1,  1,  2,  0]],  // Jan — mild; crappie slow; warm days trigger bass feeding
    [34, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Feb — pre-spawn crappie moving; warm days = bass active
    [44, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: crappie spawn; bass pre-spawn; excellent
    [54, 64, 74, 84, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: bass spawn peak; topwater begins; striper run
    [64, 72, 82, 90, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: last great month before heat; dawn topwater prime
    [70, 78, 86, 92, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: heat arriving; early morning bass only viable
    [70, 80, 88, 94, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 70°F = cold front event (mean ~90°F)
    [68, 78, 86, 92, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: similar; catfish in deep water overnight
    [62, 72, 82, 90, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling; bass very active; striper returning
    [52, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: prime fall; all species active; excellent overall
    [40, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: crappie prime; bass feeding heavily pre-winter
    [32, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days = active crappie and bass
  ],

  // ── MOUNTAIN WEST ────────────────────────────────────────────────────────────
  // Species: trout dominant (rainbow, brown, cutthroat), walleye/bass at lower elevations.
  // Cold-water species. Optimal narrow window. Kokanee salmon in reservoirs.
  // July mean air ~72°F → very_cold threshold ~50°F
  mountain_west: [
    [16, 28, 38, 48, [-2, -1,  1,  2,  0]],  // Jan — frozen; ice fishing on reservoirs; 28-38°F typical
    [20, 30, 42, 52, [-2, -1,  1,  2,  0]],  // Feb — still frozen; mid-elevation ice-out beginning
    [24, 38, 52, 64, [-2, -0.5,  1,  2,  0]],  // Mar — WINTER: ice-out; trout begin feeding; 38-52°F = neutral-to-good for trout
    [32, 46, 62, 74, [-2, -0.5,  2,  1, -1]],  // Apr — SHOULDER: trout prime 46-62°F; soften cool-band for cold-water species
    [50, 62, 72, 82, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime trout season; runoff starting
    [50, 62, 74, 84, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: post-runoff; trout excellent in clear water
    [50, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 50°F = genuine cold front (mean ~72°F); 64-76°F = prime
    [48, 62, 74, 84, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: late summer; fish AM/PM; kokanee deepening
    [40, 54, 68, 78, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: prime fall trout; kokanee spawn; browns staging
    [32, 44, 60, 70, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: brown trout spawn; lake trout in shallows; excellent
    [22, 34, 48, 58, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late season; trout slow; warm days = brief activity
    [16, 28, 40, 50, [-2, -1,  1,  2,  0]],  // Dec — WINTER: ice forming; late brown trout spawn wrapping
  ],

  // ── SOUTHWEST DESERT ──────────────────────────────────────────────────────────
  // Species: largemouth/striped bass, carp, catfish. Heat-adapted desert lake species.
  // Desert lakes reach 90°F+ water in summer. Very high heat tolerance.
  // July mean air ~103°F → very_cold threshold ~80°F (cold front in desert summer = dramatic)
  southwest_desert: [
    [34, 46, 58, 68, [-2, -1,  1,  2,  0]],  // Jan — mild desert winter; bass active in afternoons; 46-58°F = good
    [38, 50, 62, 72, [-2, -1,  1,  2,  0]],  // Feb — warming; bass pre-spawn staging begins
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: bass spawn begins; excellent early season
    [56, 68, 78, 88, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: prime bass spawn; topwater early morning
    [66, 76, 86, 94, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: still fishable early AM; heat arriving
    [76, 84, 92, 100, [-2, -1,  1,  0, -2]], // Jun — SUM_HOT: brutal; night fishing and dawn only
    [80, 90, 96, 104, [-2, -1,  1,  0, -2]], // Jul — SUM_HOT: very_cold 80°F = cold front event (mean ~103°F)
    [78, 88, 94, 102, [-2, -1,  1,  0, -2]], // Aug — SUM_HOT: similar; stripers in deep water midday
    [70, 80, 88, 96, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling; bass return to shallows; catfish active
    [58, 70, 80, 90, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: excellent bass season resumes; prime desert fall
    [46, 58, 68, 78, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: bass very active; catfish; best "winter" fishing begins
    [36, 48, 60, 70, [-2, -1,  1,  2,  0]],  // Dec — WINTER: mild desert winter; afternoons still productive
  ],

  // ── SOUTHWEST HIGH DESERT ─────────────────────────────────────────────────────
  // Species: trout (elevated streams/lakes), bass/walleye (lower reservoirs), catfish.
  // NM high plateau at 4000-7000ft. Moderate summers vs low desert.
  // July mean air ~82°F → very_cold threshold ~60°F
  southwest_high_desert: [
    [20, 32, 44, 54, [-2, -1,  1,  2,  0]],  // Jan — cold high desert winter; ice fishing possible at elevation
    [24, 36, 48, 58, [-2, -1,  1,  2,  0]],  // Feb — cold; trout sluggish; warm days = brief feeding
    [36, 48, 60, 70, [-2, -1,  1,  2,  0]],  // Mar — WINTER: ice-out at elevation; trout beginning to feed
    [46, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: trout prime; bass warming up; excellent spring
    [56, 66, 76, 86, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime bass and trout; widest optimal window
    [62, 72, 82, 90, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: moderate vs low desert; morning trout excellent
    [60, 72, 84, 92, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 60°F = cold front (mean ~82°F); trout still good AM
    [58, 70, 82, 90, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: monsoon season brings cooling; trout and bass active
    [52, 64, 76, 86, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: excellent trout; bass feeding hard; monsoon taper
    [44, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: prime fall trout; brown trout spawn; beautiful conditions
    [30, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late season; trout slow; warm afternoons viable
    [22, 34, 46, 56, [-2, -1,  1,  2,  0]],  // Dec — WINTER: cold; ice fishing at elevation; mild days active
  ],

  // ── PACIFIC NORTHWEST ────────────────────────────────────────────────────────
  // Species: salmon (chinook, coho, steelhead), rainbow/cutthroat trout. Cold-water adapted.
  // Maritime climate: mild, narrow range. July mean ~68°F → very_cold threshold ~48°F
  pacific_northwest: [
    [28, 40, 50, 60, [-2, -1,  1,  2,  0]],  // Jan — mild PNW winter; steelhead running in rivers; 40-50°F = active
    [30, 42, 52, 62, [-2, -1,  1,  2,  0]],  // Feb — winter steelhead peak in coastal rivers; above-avg warmth = best
    [28, 40, 56, 68, [-2, -0.5,  2,  1, -1]],  // Mar — SHOULDER: winter steelhead peak; spring chinook beginning; 40-56°F = prime
    [34, 48, 62, 74, [-2, -0.5,  2,  1, -1]],  // Apr — SHOULDER: spring salmon run; steelhead; trout prime 44-56°F
    [48, 58, 68, 78, [-2, -1,  2,  1, -1]],  // May — SHOULDER: excellent all-around; rivers clearing post-runoff
    [48, 58, 68, 76, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: steelhead summer runs; trout prime; mild PNW summer
    [48, 60, 70, 80, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 48°F = cold front (mean ~68°F); 60-70°F sweet spot
    [48, 60, 70, 80, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: chinook returning; coho entering rivers; excellent
    [46, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: coho peak; steelhead; fantastic fall salmon fishing
    [38, 50, 62, 72, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: coho/chum runs; winter steelhead beginning; prime
    [30, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Nov — WINTER: winter steelhead season opens; above-avg warmth = active
    [26, 38, 50, 60, [-2, -1,  1,  2,  0]],  // Dec — WINTER: winter steelhead; mild coastal rivers; warm days prime
  ],

  // ── SOUTHERN CALIFORNIA ──────────────────────────────────────────────────────
  // Species: largemouth/smallmouth bass, stocked trout (winter/spring), carp.
  // Mediterranean climate: warm/dry summers, mild winters.
  // July mean air ~83°F → very_cold threshold ~62°F
  southern_california: [
    [38, 48, 60, 70, [-2, -1,  1,  2,  0]],  // Jan — mild; bass slow but warm afternoons trigger feeding
    [40, 50, 62, 72, [-2, -1,  1,  2,  0]],  // Feb — trout stocking season begins; bass pre-spawn warming
    [46, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: bass pre-spawn; stocked trout prime; excellent
    [52, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: bass spawn; topwater begins; stocked trout still active
    [58, 68, 78, 88, [-2, -1,  2,  1, -1]],  // May — SHOULDER: excellent all-around; last good trout month
    [62, 70, 80, 88, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: warm but fishable AM/PM; bass topwater early morning
    [62, 72, 82, 90, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 62°F = cold front (mean ~83°F); morning bass viable
    [60, 70, 80, 88, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: slight marine layer relief vs July; similar pattern
    [58, 68, 78, 86, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: excellent fall start; bass very active; warm-water species feeding
    [50, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: prime bass; cool enough for trout interest again
    [42, 54, 66, 76, [-2, -1,  1,  2,  0]],  // Nov — WINTER: warm SoCal winters; afternoon bass active; trout stocking resumes
    [38, 50, 62, 72, [-2, -1,  1,  2,  0]],  // Dec — WINTER: mild; bass slow but warm days prime; trout stocking peak
  ],

  // ── MOUNTAIN ALPINE ──────────────────────────────────────────────────────────
  // >5,500ft elevation. Species: cutthroat, lake trout, brown trout, brook trout, kokanee.
  // Very cold-water specialists. Narrow thermal windows. Sep = BEST season.
  // July mean air ~62°F at altitude → very_cold threshold ~42°F (cold front at altitude)
  mountain_alpine: [
    [ 0, 14, 28, 40, [-2, -1,  1,  2,  0]],  // Jan — deep freeze; ice fishing 14-28°F = harsh but possible
    [ 2, 18, 32, 44, [-2, -1,  1,  2,  0]],  // Feb — frozen; 18-32°F = typical ice fishing at altitude
    [16, 28, 44, 56, [-2, -1,  1,  2,  0]],  // Mar — WINTER: ice-out starting at lower alpine; 28-44°F = some open water
    [26, 40, 56, 66, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: ice-out prime; 40-56°F air → 45-60°F water = trout very active
    [36, 50, 64, 74, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime spring; widest optimal window; cutthroat and brook trout
    [42, 54, 68, 78, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: peak pre-summer; 54-68°F = ideal alpine lake temps; excellent
    [42, 56, 70, 80, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 42°F = cold front at altitude (mean ~62°F); 56-70°F sweet spot
    [40, 54, 68, 78, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: late summer; fish AM/PM; 54-68°F still prime; fish deeper midday
    [30, 46, 64, 74, [-2, -1,  2,  1, -1]],  // Sep — BEST: kokanee spawning + big browns staging; 46-64°F air = prime
    [24, 38, 56, 66, [-2, -1,  2,  1, -1]],  // Oct — PRIME late season: lake trout + brown trout spawning; 38-56°F = very active
    [12, 26, 40, 52, [-2, -1,  1,  2,  0]],  // Nov — WINTER: closing season; ice forming; late ice-fishing begins
    [ 0, 14, 28, 40, [-2, -1,  1,  2,  0]],  // Dec — WINTER: frozen; ice fishing only
  ],

  // ── NORTHERN CALIFORNIA ──────────────────────────────────────────────────────
  // Covers: Sacramento Valley, NorCal foothills, lower Sierra, Trinity/Shasta region.
  // Species: largemouth/smallmouth bass, rainbow/brown trout, king/coho salmon, steelhead.
  // HOT summers (Sacramento Valley 95-105°F); wet mild winters; prime = spring/fall + winter steelhead.
  // July mean air ~93°F inland → very_cold threshold ~72°F (inland focus; coast cooler)
  northern_california: [
    [34, 46, 60, 72, [-2, -1,  2,  1, -1]],  // Jan — mild winter; steelhead prime in rivers; bass deep but catchable; 46-60°F = ideal
    [36, 48, 62, 74, [-2, -1,  2,  1, -1]],  // Feb — steelhead running; bass pre-spawn warming; excellent NorCal winter fishing
    [42, 54, 68, 78, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: bass pre-spawn prime; trout excellent; salmon start entering
    [50, 60, 74, 84, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: PRIME bass spawn; 60-74°F = spawn trigger; shad runs begin
    [56, 66, 78, 88, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: top-water bass excellent; trout going deeper; warming fast
    [64, 74, 84, 94, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: hot but early morning excellent; 74-84°F = still viable
    [72, 82, 90, 100, [-2, -1,  1,  0, -2]], // Jul — SUM_HOT: very_cold 72°F = cold front (inland mean ~93°F); dawn only in valley
    [70, 80, 90, 98, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: similar; evening bass topwater possible; deep-water stripers
    [62, 72, 84, 94, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling; bass very active; fall salmon/steelhead incoming; excellent
    [52, 62, 76, 86, [-2, -1,  2,  1, -1]],  // Oct — PRIME fall: salmon running; bass and trout very active; best overall month
    [42, 54, 68, 78, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER → PRIME: steelhead season opens; bass still active; rain starts
    [36, 48, 62, 74, [-2, -1,  2,  1, -1]],  // Dec — PRIME: winter steelhead peak; bass slow but catchable on warm days
  ],

  // ── APPALACHIAN ──────────────────────────────────────────────────────────────
  // WV + central Appalachian highlands. Species: trout, smallmouth/largemouth bass.
  // Mountain streams; ~4-6°F cooler than south_central lowlands.
  // July mean air ~76°F → very_cold threshold ~54°F
  appalachian: [
    [24, 36, 48, 58, [-2, -1,  1,  2,  0]],  // Jan — cold highlands; above-avg warmth = first activity
    [28, 38, 50, 60, [-2, -1,  1,  2,  0]],  // Feb — still cold; warm days bring trout to feeding
    [38, 48, 60, 70, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: trout season opens; bass warming up; excellent
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: prime trout and bass; streams clearing
    [56, 66, 76, 84, [-2, -1,  2,  1, -1]],  // May — SHOULDER: best all-around; trout and smallmouth excellent
    [54, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: warm but trout still active in cold headwaters
    [54, 66, 78, 88, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 54°F = cold front (mean ~76°F); mountain streams stay cool
    [52, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: similar; fish early and in shaded mountain streams
    [48, 60, 72, 82, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: prime fall; smallmouth and trout excellent
    [40, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: brown trout spawn; excellent fall overall; smallmouth prime
    [30, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late trout; warm days keep bass briefly active
    [24, 36, 48, 58, [-2, -1,  1,  2,  0]],  // Dec — WINTER: cold highlands; warm spells = brief trout activity
  ],

  // ── INLAND NORTHWEST ──────────────────────────────────────────────────────────
  // Eastern WA/OR rain shadow, interior NW, Snake/Columbia river system.
  // Species: steelhead, trout, bass, walleye. Semi-arid continental interior.
  // Spokane July mean ~77°F → very_cold threshold ~56°F
  inland_northwest: [
    [16, 28, 40, 50, [-2, -1,  1,  2,  0]],  // Jan — cold interior; steelhead in lower Snake/Clearwater; warm days = activity
    [20, 30, 42, 52, [-2, -1,  1,  2,  0]],  // Feb — still cold; late winter steelhead in rivers; above-avg warmth prime
    [30, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Mar — WINTER: ice-out; steelhead prime; trout waking up
    [40, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: steelhead peak; bass pre-spawn; excellent spring
    [50, 60, 72, 82, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime all-around; walleye spawn; bass excellent
    [56, 66, 76, 86, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: warm but manageable; bass and walleye active through morning
    [56, 68, 78, 88, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 56°F = cold front (mean ~77°F); 68-78°F = optimal
    [54, 66, 78, 88, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: hot interior but fish morning/evening; Columbia walleye active
    [46, 58, 72, 82, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: coho entering Snake system; bass and walleye prime fall
    [38, 50, 64, 74, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: steelhead season; fall bass and walleye; prime
    [26, 38, 50, 60, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late steelhead; warm days = last walleye opportunities
    [16, 28, 40, 50, [-2, -1,  1,  2,  0]],  // Dec — WINTER: frozen rivers; season ending; winter steelhead beginning
  ],

  // ── ALASKA ────────────────────────────────────────────────────────────────────
  // Completely new calibration — NOT Great Lakes copy.
  // Species: all salmon (chinook, sockeye, coho, pink, chum), rainbow trout, Dolly Varden,
  //          arctic grayling, lake trout. Cold-water specialists.
  // Season: May-October; ice covers Nov-Apr in most regions.
  // Anchorage: Jan mean 22°F, Jul mean 65°F → Jul very_cold threshold ~44°F
  alaska: [
    [ 4, 18, 28, 38, [-2, -1,  1,  2,  0]],  // Jan — deep freeze; -below-zero possible; 18-28°F = ice fishing (some AK regions)
    [ 4, 18, 28, 38, [-2, -1,  1,  2,  0]],  // Feb — same deep winter; all inland water frozen; ice fishing only
    [10, 22, 34, 44, [-2, -1,  1,  2,  0]],  // Mar — late winter; warming slowly; still fully frozen in most regions
    [16, 28, 40, 50, [-2, -1,  1,  2,  0]],  // Apr — WINTER: ice-out beginning in Southcentral AK; first open water
    [34, 44, 56, 66, [-2, -1,  2,  1, -1]],  // May — first open water; king (chinook) salmon entering; Dolly Varden and trout; excellent start
    [40, 50, 62, 72, [-2, -1,  2,  0, -2]],  // Jun — PRIME: sockeye and chinook peak; arctic grayling excellent; 50-62°F = ideal subarctic
    [44, 54, 65, 74, [-2, -1,  2,  0, -2]],  // Jul — PRIME: peak salmon season; pink + sockeye; grayling; very_cold 44°F = cold front (mean ~65°F)
    [40, 52, 64, 72, [-2, -1,  2,  1, -1]],  // Aug — coho (silver) arriving; sockeye tailing; rainbow feeding on eggs; excellent
    [34, 46, 60, 70, [-2, -1,  2,  1, -1]],  // Sep — BEST MONTH: coho peak + late chum; rainbow trout most active on egg patterns; lake trout
    [24, 36, 50, 60, [-2, -1,  2,  1, -1]],  // Oct — late coho; lake trout spawn; rainbow still active; season closing
    [10, 22, 34, 44, [-2, -1,  1,  2,  0]],  // Nov — WINTER: ice forming; most fisheries closed; some open-water coastal areas
    [ 4, 18, 28, 38, [-2, -1,  1,  2,  0]],  // Dec — WINTER: frozen; ice fishing in accessible spots; dormant season
  ],

  // ── HAWAII ────────────────────────────────────────────────────────────────────
  // Completely new calibration — NOT Florida copy.
  // Species: largemouth bass, peacock bass (kalua bass), tilapia, catfish, snakehead.
  // Peacock bass optimal water: 75-85°F; largemouth optimal: 70-80°F.
  // Year-round tropical. Lowland temps 70-88°F. Very stable — no cold risk in lowlands.
  // Very_cold threshold very low (50-55°F) — basically never happens in lowland Hawaii.
  hawaii: [
    [52, 64, 76, 84, [-2, -1,  2,  1, -1]],  // Jan — "coolest" month; 64-76°F air = excellent for bass/peacock; still tropical
    [52, 64, 76, 84, [-2, -1,  2,  1, -1]],  // Feb — similar; bass pre-spawn in Oahu reservoirs; peacock bass active
    [54, 66, 78, 86, [-2, -1,  2,  1, -1]],  // Mar — warming; all species active; excellent year-round fishing continues
    [56, 68, 80, 88, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: prime bass and peacock bass; 68-80°F = ideal tropical fishing
    [58, 70, 82, 90, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: warming to summer; morning fishing best; all species active
    [62, 72, 84, 92, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: hot season beginning; early morning prime for bass/peacock
    [64, 74, 86, 94, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: peak heat; dawn/dusk fishing; peacock bass still active in heat
    [64, 74, 86, 94, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; tilapia very active; bass slow midday
    [62, 72, 84, 92, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: slight cooling; all species improving; catfish active evenings
    [58, 70, 82, 90, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: excellent; peacock bass and largemouth feeding heavily; prime fall
    [54, 66, 78, 86, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: temperatures perfect; bass and peacock bass excellent
    [52, 64, 76, 84, [-2, -1,  2,  1, -1]],  // Dec — SHOULDER: same as Jan; excellent tropical winter fishing
  ],
};

export function freshwaterTempRow(region: RegionKey, month1to12: number): number[] | null {
  const rows = FRESHWATER_TEMP_ROWS[region];
  const i = month1to12 - 1;
  const row = rows?.[i];
  if (!row) return null;
  return [row[0], row[1], row[2], row[3], row[4]] as unknown as number[];
}
