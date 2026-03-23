/**
 * Daypart note text pools — timing language lives here exclusively.
 * Tactical tip language lives in buildTips.ts — never timing language there.
 *
 * Each pool is keyed by a note_pool_key string that evaluators reference.
 * The pick() helper selects randomly from the pool (same pattern as existing tip pools).
 */

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// ── Note pools ───────────────────────────────────────────────────────────────

const POOLS: Record<string, string[]> = {
  // ── Tide-driven (coastal) ──────────────────────────────────────────────
  // tide_exchange_specific is handled dynamically in the tide evaluator
  // (it formats actual exchange times), so there's no static pool here.

  tide_moving_water: [
    "Time it around the moving water — that's when the bite turns on.",
    "Work the tide exchanges. Moving water is your trigger window today.",
    "Don't sit through the slack. Get on the water when the tide's running and make the most of it.",
    "The bite follows the tide today. Put your best effort into the moving-water windows.",
    "Plan your outing around the exchange windows — that's where the bite lives right now.",
  ],

  /** Coastal: tide is a real driver but we don't have same-day exchange times to place on the clock */
  tide_uncertain_no_clock: [
    "Tide movement is in your favor today, but the feed didn't pin today's exchange times — use a tide chart or local app to line up with high and low, then fish the moving water around those turns.",
    "Current and tide stage look supportive, yet we can't place today's exchanges on the clock from this data. Check a tide table for your spot and plan around the nearest high or low — that's where the bite usually organizes.",
    "Tides matter today, but exact turn times aren't in this bundle. Pull local tide times and treat the hour or so each side of high and low as your priority windows instead of spreading effort evenly.",
  ],

  tide_general_coastal: [
    "Work around today's tide exchanges — moving water is when inshore fish turn on. Don't spread effort evenly across the clock.",
    "Tidal movement drives the coastal bite. Fish the transitions; rest during the slack.",
    "Position for the tide changes today. Moving water is your window — slack tide is the slow stretch between them.",
    "Inshore fish key on tide exchanges. Work the moving-water windows and don't burn time during the dead-tide lulls.",
    "The bite follows the tide. Get positioned for the exchanges and fish the moving-water windows hard.",
  ],

  // ── Temperature-driven ─────────────────────────────────────────────────
  warmth_intraday_peak: [
    "The temperature curve shows the strongest warming into this part of the day — stack your best effort there while that lift is happening.",
    "Today's air temps build hardest right in this window. That's the stretch to own, not a generic midday guess.",
    "The hourly trend puts the meaningful warmup here. Fish it while it's developing rather than spreading time evenly.",
  ],

  warmth_spike_aggregate: [
    "Air temps jump sharply day-over-day — treat the warmer afternoon and evening as your flex windows while that rebound is in play.",
    "A big warmup versus yesterday means the latter half of the day is carrying the metabolic edge. Lean there instead of front-loading cold water.",
    "Today's a sharp warm swing on the mean — afternoon into evening is where the water is most likely to feel alive after the cold stretch.",
  ],

  warmest_window: [
    "The warmest stretch of the day is your prime window — lean into it.",
    "Afternoon warmth is the trigger today. Be on the water when temps peak.",
    "Time your best push around peak warmth. That's the window that'll produce.",
    "Get out there when the day is at its warmest — that's your most productive stretch.",
    "Warmth builds as the day goes. Stack your effort around the highest temps of the day.",
    "Afternoon warmth will be the trigger — plan your best push around it.",
    "Let the air warm up first. Afternoon is when cold-water fish start to move.",
    "Cold morning, then it warms. Save your prime spots for the afternoon stretch.",
    "The day builds as it goes. Your best window is the warmest part of the afternoon.",
    "Hold something back for the afternoon warmth. That's when this water comes alive.",
  ],

  cooler_low_light: [
    "Beat the heat — early morning and evening are the productive windows today.",
    "Warm temps push fish to cooler, low-light periods. Dawn and dusk are your best shots.",
    "Fish are going quiet in the heat. Hit it early, break mid-day, then close it out at dusk.",
    "Early and late are your windows. The middle of the day is a tough sell right now.",
    "Low-light edges are the move today. Morning bite and late afternoon are where it's at.",
  ],

  // ── Light-driven ───────────────────────────────────────────────────────
  low_light_geometry_shaped: [
    "Hourly cloud cover clears one transition window more than the other — put your best low-light effort where the sky actually opens, not both ends by default.",
    "The forecast socks in one end of the day but leaves the other cleaner. Fish the cleaner low-light edge hard and don’t split time evenly.",
    "Clouds aren’t symmetric today — one dawn or dusk window has the real light edge. Stack your plan on that side of the clock.",
  ],

  cloud_extended_shaped: [
    "Overcast isn’t even all day — the thickest cloud (softest light) concentrates in these windows. Fish those harder than the brighter gaps in between.",
    "Hourly cloud shows where low-light really hangs around. Target those stretches instead of treating the whole day as identical.",
    "The deck is cloudier in parts of the day than others — those are your extended feeding windows; don’t burn time in the thinner-cloud slices.",
  ],

  low_light_geometry: [
    "Dawn and dusk have the best light edges today — plan around those transitions.",
    "Clear skies mean sharp light transitions. Dawn and evening are your prime windows.",
    "Low-light periods are where it's at today. Be on the water for the transitions.",
    "The light change at dawn and dusk is your main advantage today — don't miss it.",
    "Sun angle works in your favor at the edges of the day. Dawn and evening are the call.",
  ],

  cloud_all_day: [
    "Heavy cloud cover is keeping light low all day — you can fish any window.",
    "Overcast all day means low light all day. No need to pick a window — fish it start to finish.",
    "Cloud's doing you a favor today — fish can stay active around the clock.",
    "With this cloud cover, light isn't the limiter. Fish whenever you can get out.",
  ],

  // ── Solunar ────────────────────────────────────────────────────────────
  solunar_minor: [
    "Early feeding windows look strongest — get out there at first light.",
    "First light is the move today. Get on the water before the sun gets up.",
    "Early is the word today. Dawn is when conditions peak, so make those first hours count.",
    "Don't sleep in. First light has the best of it today — be there early.",
    "Morning bite looks prime. Get your gear ready the night before and get out at first light.",
  ],

  // ── Fallback pools (combo-specific defaults) ───────────────────────────
  fallback_afternoon: [
    "Afternoon is your best bet today — that's when conditions are most supportive.",
    "The afternoon stretch is your prime window. Lean into the warmest part of the day.",
    "Plan your push around the afternoon. That's where the day is most productive.",
  ],

  fallback_dawn_evening: [
    "Early and late are your windows today. Dawn and evening offer the best conditions.",
    "Fish the edges — dawn and evening are your best bets when other signals are flat.",
    "Dawn and dusk are the default play. Low-light edges are always worth fishing.",
  ],

  fallback_morning_evening: [
    "Shoulder hours are the play today — morning and evening look strongest.",
    "Morning and evening are your best windows. Fish the transitions.",
    "The productive windows are at the shoulders today — morning and evening.",
  ],

  fallback_dawn_morning: [
    "Front-load your effort — dawn and morning have the best setup today.",
    "Get out early. Dawn through mid-morning is your most productive stretch.",
    "Morning hours are the call. Get on the water early and fish it hard.",
  ],

  fallback_morning_afternoon: [
    "Midday stretch is your most productive window today.",
    "Morning through afternoon looks strongest — stack your effort there.",
    "The middle of the day is where conditions line up best today.",
  ],

  fallback_all_day: [
    "No single window dominates — the whole day is fair game.",
    "No major timing advantage today — fish it when you can get out.",
    "No clear edge on timing. Get out when it works and fish your best water.",
    "Clock's not really a factor today. Go when it works for you.",
    "Timing's neutral today. Fish your spots when you can get out there.",
  ],

  // ── Low-reliability / degraded ─────────────────────────────────────────
  no_timing_low_reliability: [
    "No clear timing edge stands out — fish it as the day comes.",
    "Data's thin today, so no strong timing call to make. Fish when you can get out.",
    "Limited confidence right now — no single window stands clearly above another.",
    "Hard to pin down a prime window. Fish it as opportunities come.",
  ],

  // ── Cold all day (seek_warmth failed because flat cold) ────────────────
  cold_all_day: [
    "Cold temps all day — no single window stands out. Fish when you can.",
    "It's cold start to finish today. No real timing edge — just put in your time.",
    "No warming trend to exploit. Fish your best spots and stay with it all day.",
    "Cold and steady. No clear prime window — slow and deliberate all day is the play.",
  ],
};

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Pick a random note from the pool for the given key.
 * Returns a generic fallback if the key is unknown (defensive).
 */
export function pickTimingNote(poolKey: string): string {
  const pool = POOLS[poolKey];
  if (!pool || pool.length === 0) {
    return "No clear timing edge today — fish when you can get out.";
  }
  return pick(pool);
}
