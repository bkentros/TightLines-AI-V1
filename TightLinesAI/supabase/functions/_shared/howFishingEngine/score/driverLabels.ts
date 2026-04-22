/**
 * Human-readable driver/suppressor lines — multi-variant so repeats read fresh.
 *
 * pick() uses Math.random() in production (intentional — avoids repetitive reads
 * across refreshes). For deterministic audit runs, call setDriverLabelSeed(str)
 * before executing the engine; the seed is hashed to an index offset.
 */

import type {
  ScoredVariableKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { engineScoreTier } from "./engineScoreMath.ts";

let _pickOffset = -1; // -1 = unseeded (use Math.random)

/** Call in audit/test harnesses to make pick() deterministic for a given scenario. */
export function setDriverLabelSeed(seed: string): void {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  _pickOffset = Math.abs(h);
}

/** Reset to random mode (call between unrelated test suites if needed). */
export function clearDriverLabelSeed(): void {
  _pickOffset = -1;
}

function pick<T>(arr: readonly T[]): T {
  if (_pickOffset >= 0) return arr[_pickOffset % arr.length]!;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

type Norm = SharedNormalizedOutput["normalized"];

function temperatureDriverLabel(t: NonNullable<Norm["temperature"]>): string {
  const band = t.band_label;
  const trend = t.trend_label;
  const score = t.final_score;
  const tier = engineScoreTier(score);

  if (tier === 2) {
    if (band === "warm") {
      return pick([
        "Air temps are running warm for the calendar, which can keep fish and forage more active.",
        "Above-average warmth today; expect fish to spread out more than they would after a cold snap.",
        "Warmth is on the high side of normal — good for aggressive feeders if oxygen stays solid.",
        "Warm temperatures point toward faster retrieves than you would use on a cool snap.",
        "Warmth favors an active bite as long as you avoid the hottest flat-water lull.",
      ]);
    }
    if (band === "optimal") {
      return pick([
        "Air temps sit in a strong seasonal range for fishing today.",
        "You’re inside a comfortable temperature range for most species today.",
        "Temperature is in a clean range: not too hot and not too cold for this time of year.",
        "Temps line up well for this month.",
        "Stable, season-appropriate warmth should keep fish from getting sluggish.",
      ]);
    }
    return pick([
      "Temperature is clearly helping today.",
      "Temperature is one of the better parts of the day, so plan around normal seasonal patterns.",
      "Warm/cool balance lands on the helpful side — use it to pick depth and pace confidently.",
    ]);
  }
  if (tier === 1) {
    if (band === "warm" || band === "optimal") {
      return pick([
        "Temps are cooperative — not flashy, but they’re tilting the odds toward an active bite.",
        "Temperature is friendly; you’ll still want to match depth to the sun and wind.",
        "Air-side warmth is in your corner without being extreme.",
        "Seasonal temperatures are behaving; treat it as a quiet helper behind flashier factors.",
      ]);
    }
    if (band === "near_optimal") {
      return pick([
        "Temperature is close to the seasonal comfort band — modestly helpful, but not fully open yet.",
        "Temperature is near the better window and offering a small lift without becoming the whole story.",
        "Temperature is trending toward a better range — useful, but still a secondary helper.",
      ]);
    }
    if (band === "cool" && trend === "warming") {
      return pick([
        "It’s cool now but warming through the day — fish often respond as the water creeps up.",
        "A warming trend off a cool morning can unlock mid-day movement; watch shallow transitions.",
        "A cool start with rising temps can improve the bite after the chill bleeds off.",
        "Temps are climbing from a cool start — patience early, opportunity as warmth builds.",
      ]);
    }
    return pick([
      "Temperature gives the day a small lift, but it is not the headline story.",
      "Temperature is a modest plus; pair it with light, wind, and flow for the full read.",
      "Slight positive on temperature — enough to notice, not enough to ignore other factors.",
    ]);
  }
  if (tier === 0) {
    if (band === "near_optimal") {
      return pick([
        "Temperature is close to the seasonal window, but it is not pushing the day strongly either way.",
        "Temperature is near the better range without becoming the whole story.",
        "Temperature sits near the seasonal range, but other conditions matter more today.",
      ]);
    }
    if (band === "very_warm") {
      return pick([
        "It’s genuinely hot — dissolved oxygen and shade lines start to matter more than usual.",
        "Extreme warmth: expect mid-day slowdowns unless you find current, depth, or stained water.",
        "Heat is high today; focus on low-light windows and moving water when possible.",
        "Very warm air mass — fish may tuck into cooler water until conditions ease.",
      ]);
    }
    return pick([
      "Temperature sits neutral today — neither clearly helping nor hurting.",
      "Temperature is middle-of-the-road; you’ll lean on other conditions for the real story.",
      "No strong temperature signal today — treat it as background, not the main decision.",
    ]);
  }
  if (tier === -1) {
    if (band === "near_optimal") {
      return pick([
        "Temperature is close to the seasonal window, but still a shade off the better bite.",
        "Temperature is close to the right range without fully landing in it, so the bite can stay a little tight.",
        "Temperature is almost where you want it, but still limiting just enough to matter.",
      ]);
    }
    if (band === "cool") {
      return pick([
        "Below-average cool can slow fish down; slower presentations are usually safer.",
        "Chilly for the date: fish can feel tentative until a warm spell or sun hits the water.",
        "Cool-side temps work against you a little, so expect shorter feeding windows.",
        "Air is running cold; look for the warmest water you can find (sun pockets, inflows, depth).",
      ]);
    }
    if (band === "very_warm") {
      return pick([
        "Heat is past the productive band — stress and lethargy can outweigh forage opportunity.",
        "Too-warm temperatures: the bite often hinges on dawn, dusk, and shaded or aerated water.",
        "Heat stress risk is elevated; prioritize cooler, better-oxygenated water over aggression.",
      ]);
    }
    return pick([
      "Temperature is a small negative — enough to factor into depth and retrieve speed.",
      "Temperature leans against you mildly; compensate with timing and high-percentage water.",
    ]);
  }
  // tier === -2
  if (band === "very_cold") {
    return pick([
      "Well below seasonal norms — tough cold conditions; pick the warmest stable water available.",
      "Deep cold: fish move slow and tight — finesse or live-bait patience is the call.",
      "Frigid temperatures dominate; safety and realistic expectations matter as much as tactics.",
    ]);
  }
  if (band === "very_warm") {
    return pick([
      "Extreme heat is working hard against you — survival mode beats feeding mode for many fish.",
      "Blistering heat; narrow your windows to low light and high-oxygen zones.",
    ]);
  }
  return pick([
    "Temperature is working hard against you today — plan around the least difficult part of the day.",
    "Temperature is working hard against you; other factors need to overperform to compensate.",
  ]);
}

function pressureDriverLabel(p: NonNullable<Norm["pressure_regime"]>): string {
  switch (p.label) {
    case "falling_slow":
      return pick([
        'Barometer is easing downward slowly — the classic "fish feel it coming" pre-front window.',
        "Gentle pressure fall often correlates with confident feeding ahead of a weak change.",
        "Slow pressure drop can give the bite a useful push.",
        "Soft falling pressure — enough movement to help without a hard weather change.",
      ]);
    case "falling_moderate":
      return pick([
        "Steady pressure drop with a real front attached — expect a feed-up before the blow.",
        "Moderate pressure fall can create a useful pre-front feeding window.",
        "A front is approaching — fish often feed before the main weather change arrives.",
        "Pressure tracing a clean downtrend; treat it as momentum building toward a weather change.",
      ]);
    case "falling_hard":
      return pick([
        "Pressure is dropping fast as a hard front moves in; fish the calm before the worst of it.",
        "A rapid pressure drop can make the window short. Prioritize the calmer part of the change.",
        "Steep pressure fall today; expect tight windows and be ready to adjust.",
        "Pressure is changing sharply today; aggression often fades until things flatten out again.",
      ]);
    case "rising_slow":
      return pick([
        "Pressure recovering gradually post-front — stability returns and fish settle back into rhythm.",
        "Slow rise after weather: bites can rebuild as conditions calm down.",
        "Gentle pressure rebound — patience pays as fish settle back in.",
        "Measured pressure recovery — not instant magic, but the trend is your friend.",
      ]);
    case "rising_fast":
      return pick([
        "Pressure snapped upward — fish can get selective while things settle.",
        "Fast rise often means a pause in the bite until the new pressure plateaus.",
        "Sharp pressure recovery: expect selective, finicky bites until things settle.",
        "Quick jump in pressure — presentation subtlety and repeat casts beat power fishing.",
      ]);
    case "volatile":
      return pick([
        "Mixed pressure signals over the last 24 hours — short windows; stick to high-percentage spots.",
        "Pressure has been swinging back and forth — feeding windows shrink; avoid spreading thin.",
        "Back-and-forth pressure history: quality beats quantity; patient, focused fishing wins.",
        "Choppy pressure record today — find sheltered, stable water and stay put longer than usual.",
      ]);
    case "stable_neutral":
      return pick([
        "Pressure is flat — no big weather story; other conditions carry more weight.",
        "Stable pressure removes drama; you’re not fighting a front, just local conditions.",
        "Pressure is holding steady — neither helper nor problem on its own.",
        "Neutral pressure: lean on wind, light, temperature, and flow for your clues.",
      ]);
    case "recently_stabilizing":
      return pick([
        "Pressure was jumpy but has settled down lately — the worst of the weather swing may be behind you.",
        "Post-front settling signal — conditions look calmer now than they did earlier in the cycle.",
        "Pressure is flattening after earlier swings — fish often re-engage once the chaos fades.",
      ]);
    default:
      return "Pressure is not giving a clean signal today.";
  }
}

export function labelForDriver(key: ScoredVariableKey, norm: Norm): string {
  const t = norm.temperature;
  const p = norm.pressure_regime;
  const w = norm.wind_condition;
  const l = norm.light_cloud_condition;
  const pr = norm.precipitation_disruption;
  const r = norm.runoff_flow_disruption;
  const ti = norm.tide_current_movement;

  switch (key) {
    case "temperature_condition":
      return t ? temperatureDriverLabel(t) : "";
    case "pressure_regime":
      return p ? pressureDriverLabel(p) : "";
    case "wind_condition": {
      if (!w) return "";
      const wt = engineScoreTier(w.score);
      if (wt === 2) {
        return pick([
          "Glass-calm surface — stealth presentations and spooky fish become the main puzzle.",
          "Dead flat wind: long casts and light line beat heavy hardware.",
          "Mirror water — every ripple is yours; finesse and patience rule.",
          "Calm air — great for sight-fishing and precise drifts, but it will not hide sloppy casts.",
        ]);
      }
      if (wt === 1) {
        return pick([
          "Light breeze — enough ripple to hide approach without wrecking boat control.",
          "Manageable wind: you can still work structure methodically.",
          "Soft air movement — a little chop helps natural drifts and line control.",
          "Gentle wind window — ideal for covering water without fighting the elements.",
        ]);
      }
      if (wt === 0) {
        return pick([
          "Moderate wind — factor it into cast angles, anchor plans, and drift speed.",
          "Mid-range breeze: workable, but presentations need a wind-aware tweak.",
          "Average air movement — neither a crutch nor a crisis.",
          "Wind sits in the middle; boat handling and line belly become part of the pattern.",
        ]);
      }
      if (wt === -1) {
        return pick([
          "Breeze is picking up — positioning and cast timing matter more than lure choice.",
          "Windy enough to skew drifts; use banks, points, and lee pockets strategically.",
          "Building wind — heavier tackle and shorter casts often beat forcing long casts.",
          "Air is getting pushy; expect harder boat control and more bow in the line.",
        ]);
      }
      return pick([
        "Strong wind dominates the day — safety and spot selection trump optimism.",
        "Heavy air — look for leeward shores, channels, and breaks that knock the chop down.",
        "Very strong wind today — fewer fishable windows and more safety concerns.",
      ]);
    }
    case "light_cloud_condition": {
      if (!l) return "";
      const lt = engineScoreTier(l.score);
      if (lt === 2) {
        return pick([
          "Heavy cloud deck — low light often pulls predators shallow and extends morning behavior.",
          "Dark sky filter: light drops, silhouettes matter, and fish roam more freely.",
          "Solid overcast — think aggressive retrieves and visible profiles in the upper water.",
          "Low-light ceiling — prime time can stretch well past normal sunny-hour rules.",
        ]);
      }
      if (lt === 1) {
        return pick([
          "Useful cloud cover — enough shade to help without making visibility difficult.",
          "Softened sunlight — good for wary fish and longer feeding moods.",
          "Clouds are helping — not storm-gray, just enough diffusion to spread activity.",
          "Broken to solid mid-cloud — a dependable light-quality boost.",
        ]);
      }
      if (lt === 0) {
        return pick([
          "Light is average for the date — no major glare or shade story.",
          "Sky conditions are middle-of-the-pack; neither a major help nor a problem.",
          "Sun/cloud mix is ordinary — pattern around structure and forage, not light tricks.",
        ]);
      }
      if (lt === -1) {
        return pick([
          "Bright sun — fish may hug shade, depth, or cover harder than on a gray day.",
          "High glare potential — polarized optics and natural-color baits earn their keep.",
          "Clear-sky punch — mid-day can feel stingy unless you find light breaks.",
        ]);
      }
      return pick([
        "Harsh light — harsh shadows; expect fish to hold deeper, tighter, or in stained water.",
        "Extreme brightness — short strike windows and picky fish are common.",
        "Blinding surface glare — finesse under cover beats forcing open-water shots.",
      ]);
    }
    case "precipitation_disruption": {
      if (!pr) return "";
      const prt = engineScoreTier(pr.score);
      if (prt === 2) {
        return pick([
          "Extended dry spell — flows often clear and stabilize; fish settle into predictable water.",
          "Long clear stretch — minimal runoff disruption, good for repeating a pattern.",
          "Dry stretch — clarity and comfort tend toward the friendly side.",
        ]);
      }
      if (prt === 1) {
        return pick([
          "Dry, settled weather — no rain making the water harder to read.",
          "Rain is not in play — one less thing to second-guess.",
          "Quiet flow day — clarity and comfort usually hold steady.",
        ]);
      }
      if (prt === 0) {
        return pick([
          "Light precip in the mix — enough to note, not enough to reset the whole system.",
          "Spritz-level moisture — watch inflows and stain lines if it lingers.",
          "Minor rain/snow signal — monitor visibility more than volume.",
        ]);
      }
      if (prt === -1) {
        return pick([
          "Recent rain is shifting stain, flow, and forage location — yesterday’s spots may not fish the same.",
          "Runoff tint is creeping in — softer edges and cleaner water become higher percentage.",
          "Freshwater input is changing the look of the water; follow the mud line.",
        ]);
      }
      return pick([
        "Active or heavy precip — safety aside, fish can go weird until energy passes.",
        "Significant wet weather signal — clarity and temperature can change quickly.",
        "Big water disruption from rain or snow — keep expectations realistic until things normalize.",
      ]);
    }
    case "runoff_flow_disruption": {
      if (!r) return "";
      const rt = engineScoreTier(r.score);
      if (rt === 2) {
        return pick([
          "Flows are prime — clear, wadable or floatable, with habitat in textbook shape.",
          "River conditions look clean: strong flow and clarity for this time of year.",
          "Runoff picture is clean and stable — spend time fishing, not guessing.",
        ]);
      }
      if (rt === 1) {
        return pick([
          "Flows are fishable and mostly clear — normal seasonal river tactics should translate.",
          "Healthy flow band — not blown out, not skinny; standard tactics should translate.",
          "Flow is cooperative — wading and crossing stay reasonable with care.",
        ]);
      }
      if (rt === 0) {
        return pick([
          "Elevated but workable flows — heavier water, tighter holding spots, more current breaks.",
          "Mid-high stage — fish hug slower water; expect closer quarters than at low water.",
          "Flows have some push — adjust weight and drift depth to stay in the bite.",
        ]);
      }
      return pick([
        "High or dirty flows dominate — tough wading, tough visibility, picky fish.",
        "Runoff stress is real — focus on softer banks, backwaters, and cleaner inflows.",
        "Blown river conditions today — patience or a plan B waterbody wins.",
      ]);
    }
    case "tide_current_movement": {
      if (!ti) return "";
      if (ti.score >= 1.2) {
        return pick([
          "Strong tidal exchange — current is moving nutrients and disorienting prey; lean into it.",
          "Big water movement day — set up where speed changes and bait gets pushed.",
          "Healthy tide movement — timing the push or drain matters more than lure color.",
        ]);
      }
      if (ti.score >= 0.2) {
        return pick([
          "Moderate tide — enough flow to work with, not a slam-dunk current day.",
          "Average tidal range — fish won’t ignore the moon, but it won’t do all the work.",
          "Mid-level movement — combine tide with wind and light for the full coastal read.",
        ]);
      }
      return pick([
        "Weak tide slack — less current to concentrate fish; structure and bait become critical.",
        "Flat tidal picture — precision matters more because current is not doing much for you.",
        "Minimal exchange — look for small current, wind-driven chop, or inlet flow instead.",
      ]);
    }
    default:
      return "";
  }
}
