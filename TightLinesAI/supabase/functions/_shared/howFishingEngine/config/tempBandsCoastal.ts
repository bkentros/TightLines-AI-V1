import type { RegionKey } from "../contracts/region.ts";
import { coastalTempRegion } from "./regions.ts";

type TempBandRow = [number, number, number, number, number[]];

/** Coastal air-temp bands — saltwater species calibration.
 *
 * Row format: [very_cold_max, cool_max, optimal_max, warm_max, [s0,s1,s2,s3,s4]]
 * Saltwater species are generally more temperature-tolerant than freshwater counterparts.
 * Optimal ranges shifted slightly warmer. Summer very_cold rule: ~18-22°F below regional mean.
 *
 * Score patterns:
 *   WINTER   [-2,-1, 1, 2, 0]  — warmer winter days = better coastal fishing
 *   SHOULDER [-2,-1, 2, 1,-1]  — clear sweet spot; warm ok but pushing heat stress
 *   SUM_MOD  [-2,-1, 2, 0,-2]  — meaningful cool summer window; heat above kills activity
 *   SUM_HOT  [-2,-1, 1, 0,-2]  — even "optimal" compromised by broad summer heat stress
 */
const COASTAL_ROWS: Partial<Record<RegionKey, TempBandRow[]>> = {

  // ── NORTHEAST COASTAL ────────────────────────────────────────────────────────
  // Species: striped bass, bluefish, flounder, black sea bass, tautog, Atlantic salmon.
  // Stripers: active 50-78°F water; bluefish: 60-78°F. Flounder prefer 50-68°F.
  // July mean air ~74°F → very_cold threshold ~54°F
  northeast: [
    [24, 36, 46, 56, [-2, -1,  1,  2,  0]],  // Jan — winter; tautog and cod offshore; 36-46°F = active cold-water species
    [26, 38, 48, 58, [-2, -1,  1,  2,  0]],  // Feb — similar; stripers in deep water; warm days = tautog feeding
    [34, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Mar — WINTER: early stripers moving; flounder entering bays; above-avg warmth prime
    [42, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: striper run begins; flounder excellent; sea bass opens
    [50, 60, 70, 80, [-2, -1,  2,  1, -1]],  // May — SHOULDER: prime striper; bluefish arriving; excellent all-around
    [54, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: peak striper/bluefish season; 64-76°F = prime offshore
    [54, 66, 78, 88, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 54°F = cold front (mean ~74°F); bluefish/stripers excellent
    [54, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: tuna/mahi offshore; stripers at night; excellent summer
    [50, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: prime striper fall run; bluefish migrating; excellent
    [44, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: best striper month; bluefish blitz; tautog opening
    [36, 46, 58, 68, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late stripers; tautog prime; above-avg warmth = active fish
    [28, 38, 50, 60, [-2, -1,  1,  2,  0]],  // Dec — WINTER: cod/tautog; offshore jigging; warm days keep stripers brief
  ],

  // ── SOUTHEAST ATLANTIC COASTAL ────────────────────────────────────────────────
  // Species: redfish (red drum), speckled trout (seatrout), flounder, black sea bass, sheepshead.
  // Redfish optimal water: 60-82°F; speckled trout: 60-80°F.
  // July mean air ~88°F → very_cold threshold ~68°F
  southeast_atlantic: [
    [36, 46, 58, 68, [-2, -1,  1,  2,  0]],  // Jan — mild; redfish deep but warm days trigger feeding on flats
    [40, 50, 62, 72, [-2, -1,  1,  2,  0]],  // Feb — speckled trout beginning to move; above-avg warmth = flats fishing
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: redfish and seatrout excellent; flounder returning to inlets
    [56, 66, 78, 88, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: prime inshore; sheepshead on structure; excellent all-around
    [64, 74, 84, 92, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: excellent before peak heat; redfish very active
    [66, 76, 84, 92, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: heat arriving; early morning only for seatrout; redfish at dawn
    [68, 78, 86, 94, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 68°F = cold front (mean ~88°F); night fishing only viable
    [68, 78, 86, 94, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; offshore kingfish/mahi better than inshore
    [64, 74, 84, 92, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: cooling; redfish very active; excellent fall start
    [54, 64, 76, 86, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: prime redfish; flounder fall run; sheepshead excellent
    [44, 54, 68, 78, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: seatrout prime; redfish concentrated; excellent
    [38, 48, 60, 70, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days = active redfish on sunny flats; sheepshead on structure
  ],

  // ── FLORIDA COASTAL ──────────────────────────────────────────────────────────
  // Species: snook, redfish, speckled trout, tarpon, flounder, pompano.
  // Snook optimal water: 68-84°F (cold-sensitive; below 60°F = stress/kill); tarpon: 74-88°F.
  // Florida coastal BEST fishing = fall-winter-spring; summer = too hot.
  // July mean air ~90°F → very_cold threshold ~70°F
  florida: [
    [50, 60, 72, 82, [-2, -1,  1,  2,  0]],  // Jan — good snook/redfish; cold fronts can push snook to passes; warm days = flats
    [52, 62, 74, 84, [-2, -1,  1,  2,  0]],  // Feb — excellent pre-spawn snook staging; permit and pompano active; above-avg = prime
    [58, 68, 80, 88, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: tarpon beginning; snook excellent; redfish prime in spring
    [64, 74, 84, 92, [-2, -1,  2,  0, -2]],  // Apr — SHOULDER → SUM_MOD: tarpon arriving; permit on flats; snook pre-spawn
    [70, 80, 88, 96, [-2, -1,  1,  0, -2]],  // May — SUM_HOT: tarpon peak but heat limiting; snook night fishing
    [74, 82, 90, 96, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: brutal inshore; tarpon still running; dawn/dusk only viable
    [74, 84, 92, 98, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 74°F = cold front (mean ~90°F); offshore far better than inshore
    [74, 84, 92, 98, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; snook very sluggish midday; pompano in deeper water
    [70, 80, 90, 96, [-2, -1,  1,  0, -2]],  // Sep — SUM_HOT: still very warm; snook beginning to improve; afternoon storms help
    [62, 72, 84, 92, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: cooling; snook excellent; redfish and seatrout prime; excellent
    [56, 66, 78, 86, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: prime coastal season begins; snook, redfish, seatrout all excellent
    [52, 62, 74, 84, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days = active snook and redfish; cold fronts push fish to passes
  ],

  // ── GULF COAST COASTAL ───────────────────────────────────────────────────────
  // Species: redfish, speckled trout, flounder, pompano, sheepshead, tarpon.
  // Coastal TX/LA/MS/AL saltwater. Similar to FL but slightly cooler winters.
  // July mean air ~91°F → very_cold threshold ~72°F
  gulf_coast: [
    [44, 54, 66, 76, [-2, -1,  1,  2,  0]],  // Jan — mild; redfish on sunny flats; seatrout in passes; warm days = active
    [46, 56, 68, 78, [-2, -1,  1,  2,  0]],  // Feb — improving; speckled trout beginning spring move; above-avg warmth prime
    [54, 64, 76, 86, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: prime redfish and seatrout; flounder returning; excellent
    [62, 72, 82, 92, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: tarpon entering; pompano on beaches; topwater redfish
    [70, 78, 86, 94, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: excellent before peak heat; all inshore species very active
    [72, 80, 88, 96, [-2, -1,  1,  0, -2]],  // Jun — SUM_HOT: brutal; dawn redfish only; seatrout in deep grass
    [72, 80, 88, 96, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: very_cold 72°F = cold front (mean ~91°F); night/dawn only viable
    [70, 78, 86, 94, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: similar; pompano in cooler inlets; night seatrout viable
    [66, 76, 86, 94, [-2, -1,  1,  0, -2]],  // Sep — SUM_HOT: still hot; redfish improving in evening; tarpon departing
    [58, 68, 80, 90, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: excellent; redfish and seatrout prime; flounder migration
    [50, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: prime inshore season; seatrout concentrated; flounder run
    [44, 54, 68, 78, [-2, -1,  1,  2,  0]],  // Dec — WINTER: warm days = active redfish and seatrout; cold fronts limit activity
  ],

  // ── PACIFIC NORTHWEST COASTAL ────────────────────────────────────────────────
  // Species: salmon (chinook, coho, pink, chum), rockfish, lingcod, halibut, bottomfish.
  // Cold-water maritime. Salmon drive the season. Upwelling keeps temps very cool.
  // July mean air ~68°F → very_cold threshold ~48°F
  pacific_northwest: [
    [30, 42, 54, 64, [-2, -1,  1,  2,  0]],  // Jan — winter; bottomfish (lingcod, rockfish) offshore; 42-54°F = typical; above-avg warm = active
    [32, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Feb — similar; some winter steelhead in coastal rivers; warm days prime
    [38, 48, 60, 70, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: spring chinook season opens; rockfish/lingcod prime; halibut opening
    [42, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: spring chinook peak; rockfish excellent; halibut season prime
    [48, 58, 68, 78, [-2, -1,  2,  1, -1]],  // May — SHOULDER: excellent all coastal; salmon running; NW winds and upwelling begin
    [48, 58, 68, 78, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: peak rockfish/lingcod; coho beginning; 58-68°F = prime
    [48, 60, 70, 80, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 48°F = cold front (mean ~68°F); coho/chinook offshore; excellent
    [48, 60, 70, 80, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: coho peak offshore; salmon heading toward rivers; prime
    [46, 56, 68, 78, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: coho running in rivers; rockfish/lingcod excellent; prime coastal month
    [40, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: chum and coho; bottomfish prime; excellent fall
    [32, 44, 56, 66, [-2, -1,  1,  2,  0]],  // Nov — WINTER: late fall fishing; bottomfish; above-avg warmth extends season
    [28, 40, 52, 62, [-2, -1,  1,  2,  0]],  // Dec — WINTER: winter bottomfish; cold maritime coast; warm days = active
  ],

  // ── SOUTHERN CALIFORNIA COASTAL ──────────────────────────────────────────────
  // Species: yellowtail, calico/kelp bass, rockfish, halibut, bonito, white seabass.
  // Mediterranean coast. Summer best for pelagics. Year-round inshore fishing.
  // July mean air ~72°F → very_cold threshold ~52°F
  southern_california: [
    [40, 52, 64, 74, [-2, -1,  1,  2,  0]],  // Jan — mild; rockfish/sheephead; halibut in bays; warm days = calico bass active
    [42, 54, 66, 76, [-2, -1,  1,  2,  0]],  // Feb — improving; calico bass pre-spawn warming; rockfish excellent
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: calico bass spawn begins; white seabass arriving; excellent inshore
    [52, 62, 74, 84, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: white seabass peak; calico bass spawn; halibut prime
    [56, 66, 76, 86, [-2, -1,  2,  1, -1]],  // May — SHOULDER: yellowtail arriving; best all-around month SoCal coast
    [58, 68, 78, 88, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: yellowtail prime; tuna beginning; calico bass excellent
    [52, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 52°F = cold front (mean ~72°F); tuna/bluefin offshore; pelagic peak
    [52, 64, 76, 86, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: bluefin tuna; dorado/mahi offshore; yellowtail still running
    [52, 64, 76, 86, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: tuna/yellowtail peak; calico bass fall bite; excellent
    [50, 60, 72, 82, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: excellent all-around; yellowtail late run; rockfish prime
    [44, 54, 68, 78, [-2, -1,  1,  2,  0]],  // Nov — WINTER: rockfish/sheephead; calico bass; above-avg warmth extends season
    [40, 50, 64, 74, [-2, -1,  1,  2,  0]],  // Dec — WINTER: bottomfish; halibut in deeper water; warm days = inshore bass
  ],

  // ── NORTHERN CALIFORNIA COASTAL ──────────────────────────────────────────────
  // Humboldt Bay, Bodega Bay, SF Bay / Delta, Point Reyes area.
  // Cold upwelling year-round; 8-12°F cooler than SoCal coast.
  // Species: rockfish, lingcod, halibut, salmon (offshore), striped bass (SF Bay/Delta).
  // July mean air ~64°F (fog belt) → very_cold threshold ~44°F
  northern_california: [
    [34, 46, 58, 68, [-2, -1,  1,  2,  0]],  // Jan — cold NorCal coast; rockfish/lingcod offshore; stripers deep in Delta; 46-58°F typical
    [36, 46, 60, 70, [-2, -1,  1,  2,  0]],  // Feb — similar; SF Bay stripers beginning to move; above-avg warmth prime
    [40, 50, 62, 72, [-2, -1,  2,  1, -1]],  // Mar — SHOULDER: spring stripers in SF Bay; rockfish season opening; halibut arriving
    [44, 54, 66, 76, [-2, -1,  2,  1, -1]],  // Apr — SHOULDER: prime rockfish/halibut; upwelling begins; stripers excellent
    [48, 58, 70, 80, [-2, -1,  2,  1, -1]],  // May — SHOULDER: NW winds and upwelling peak; salmon season opening offshore; excellent
    [48, 58, 70, 78, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: fog season; 58-70°F = sweet spot; salmon offshore excellent
    [44, 56, 68, 78, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 44°F = cold front in fog belt (mean ~64°F); rockfish/salmon prime
    [44, 56, 68, 78, [-2, -1,  2,  0, -2]],  // Aug — SUM_MOD: salmon season prime offshore; lingcod spawn; rockfish excellent
    [46, 56, 68, 76, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER: fog lifting; stripers returning to Bay; salmon/rockfish prime
    [42, 52, 64, 74, [-2, -1,  2,  1, -1]],  // Oct — SHOULDER: PRIME month: salmon runs, rockfish, stripers all excellent simultaneously
    [36, 48, 60, 70, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: late salmon; steelhead in tributaries; rockfish prime
    [34, 44, 58, 68, [-2, -1,  1,  2,  0]],  // Dec — WINTER: winter rockfish; Delta stripers; 44-58°F = decent for bottomfish
  ],

  // ── ALASKA COASTAL ────────────────────────────────────────────────────────────
  // Gulf of Alaska, Inside Passage, Kodiak, Kenai Peninsula coastal areas.
  // Species: king/sockeye/coho/pink salmon, halibut, rockfish, lingcod, Dolly Varden.
  // Completely new calibration — NOT PNW copy.
  // Season: May-September primarily. Winters are dark and stormy.
  // July mean air ~58°F Kodiak/coastal → very_cold threshold ~38°F
  alaska: [
    [ 6, 22, 34, 44, [-2, -1,  1,  2,  0]],  // Jan — winter; stormy; some halibut offshore; 22-34°F = extreme conditions
    [ 6, 22, 34, 44, [-2, -1,  1,  2,  0]],  // Feb — similar; very limited coastal fishing; above-avg warmth = some activity
    [12, 26, 38, 48, [-2, -1,  1,  2,  0]],  // Mar — WINTER: winter storms; some late steelhead in SE AK streams; improving
    [18, 30, 42, 52, [-2, -1,  1,  2,  0]],  // Apr — WINTER: season beginning to open; halibut season opens; 30-42°F = typical
    [30, 42, 54, 64, [-2, -1,  2,  1, -1]],  // May — SHOULDER: halibut season prime; king salmon starting; rockfish excellent
    [36, 48, 60, 70, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: salmon + halibut prime; 48-60°F = ideal subarctic coastal; excellent
    [38, 50, 62, 72, [-2, -1,  2,  0, -2]],  // Jul — SUM_MOD: very_cold 38°F = cold front in AK (mean ~58°F); peak season; all species
    [36, 48, 60, 70, [-2, -1,  2,  1, -1]],  // Aug — coho/silver salmon arriving; halibut still excellent; pink salmon running
    [30, 44, 58, 68, [-2, -1,  2,  1, -1]],  // Sep — SHOULDER/BEST: coho peak; halibut final push; silver salmon in streams; excellent
    [20, 34, 48, 58, [-2, -1,  2,  1, -1]],  // Oct — late coho; halibut season closing; season winding down; still fishable
    [10, 24, 36, 46, [-2, -1,  1,  2,  0]],  // Nov — WINTER: season ending; storms increasing; very limited coastal fishing
    [ 6, 20, 34, 44, [-2, -1,  1,  2,  0]],  // Dec — WINTER: frozen/stormy; minimal coastal access; above-avg warmth = some halibut
  ],

  // ── HAWAII COASTAL ────────────────────────────────────────────────────────────
  // Species: bluefin/yellowfin tuna, mahi-mahi (dorado), wahoo (ono), marlin, bonefish, ulua (GT).
  // Pelagic-focused ocean fishing. Year-round warm tropical waters.
  // Tuna and mahi optimal water: 74-84°F; marlin: 76-86°F; bonefish on flats: 72-82°F.
  // Hawaii air temps stable: 72-88°F lowland year-round. Very little seasonal variation.
  hawaii: [
    [56, 68, 80, 88, [-2, -1,  2,  1, -1]],  // Jan — "coolest" season; excellent bonefish on flats; tuna slightly offshore; 68-80°F = good
    [56, 68, 80, 88, [-2, -1,  2,  1, -1]],  // Feb — similar; consistent offshore; mahi-mahi beginning to improve; excellent year-round
    [58, 70, 82, 90, [-2, -1,  2,  1, -1]],  // Mar — warming; mahi/tuna excellent; bonefish prime on flats; very stable conditions
    [60, 72, 84, 92, [-2, -1,  2,  0, -2]],  // Apr — SHOULDER: prime all-around; tuna and mahi very active; bonefish excellent
    [62, 74, 86, 94, [-2, -1,  2,  0, -2]],  // May — SUM_MOD: marlin season opening; tuna/mahi prime; offshore excellent
    [64, 76, 88, 96, [-2, -1,  2,  0, -2]],  // Jun — SUM_MOD: marlin peak season begins; tuna/mahi prime; morning best
    [66, 78, 90, 98, [-2, -1,  1,  0, -2]],  // Jul — SUM_HOT: peak marlin season; tuna/mahi excellent offshore; inshore slower
    [66, 78, 90, 98, [-2, -1,  1,  0, -2]],  // Aug — SUM_HOT: same; prime blue marlin season; offshore action best
    [64, 76, 88, 96, [-2, -1,  2,  0, -2]],  // Sep — SUM_MOD: marlin continuing; bonefish improving on flats; excellent
    [62, 74, 86, 94, [-2, -1,  2,  0, -2]],  // Oct — SUM_MOD: excellent all-around; wahoo improving; bonefish prime
    [60, 70, 82, 90, [-2, -1,  2,  1, -1]],  // Nov — SHOULDER: consistent offshore; tuna still active; bonefish on flats
    [56, 68, 80, 88, [-2, -1,  2,  1, -1]],  // Dec — SHOULDER: excellent year-round stability; same as Jan; tuna and bonefish
  ],
};

export function coastalTempRow(homeRegion: RegionKey, month1to12: number): number[] | null {
  const r = coastalTempRegion(homeRegion);
  const rows = COASTAL_ROWS[r];
  const i = month1to12 - 1;
  const row = rows?.[i];
  if (!row) return null;
  return [row[0], row[1], row[2], row[3], row[4]] as unknown as number[];
}
