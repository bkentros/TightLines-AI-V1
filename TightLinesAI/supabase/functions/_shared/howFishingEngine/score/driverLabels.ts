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
        "Air temperatures are above the seasonal midpoint and still favorable for this date.",
        "Today's air-temperature read lines up on the helpful side of the seasonal range.",
        "Temperatures are a bit elevated for the calendar, but still supportive in this read.",
        "The temperature setup points toward a more usable window than a sharp change would.",
        "Air temperatures are giving the day a helpful seasonal signal.",
      ]);
    }
    if (band === "optimal") {
      return pick([
        "Air temps sit in a strong seasonal range for fishing today.",
        "Air temperatures are well aligned for this time of year.",
        "Temperature is in a clean seasonal range for this date.",
        "Temps line up well for this month.",
        "Stable, season-appropriate air temperatures are a clear positive today.",
      ]);
    }
    return pick([
      "Temperature is clearly helping today.",
      "Temperature is one of the better parts of the day, so plan around normal seasonal patterns.",
      "The seasonal temperature balance lands on the helpful side today.",
    ]);
  }
  if (tier === 1) {
    if (band === "warm" || band === "optimal") {
      return pick([
        "Temps are cooperative — not flashy, but they are tilting the read in a better direction.",
        "Temperature is friendly; you’ll still want to match depth to the sun and wind.",
        "Air temperatures are in your corner without being extreme.",
        "Seasonal temperatures are behaving; treat it as a quiet helper behind flashier factors.",
      ]);
    }
    if (band === "near_optimal") {
      return pick([
        "Temperature is close to the better seasonal range — modestly helpful, but not fully open yet.",
        "Temperature is near the better window and offering a small lift without becoming the whole story.",
        "Temperature is trending toward a better range — useful, but still a secondary helper.",
      ]);
    }
    if (band === "cool" && trend === "warming") {
      return pick([
        "Temps start below the seasonal midpoint but improve through the day.",
        "A rising air-temperature trend can make the later windows more useful.",
        "A lower-temperature start with rising temps can improve the read after the early window.",
        "Temps are climbing from a lower start — patience early, better alignment later.",
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
        "Air temperatures are well above the seasonal range, so timing matters more than usual.",
        "The temperature read is elevated for the date; the middle of the day may be less reliable.",
        "Air temperatures are high for the calendar; low-light and moving-water windows deserve more attention.",
        "The air-temperature setup is above the better seasonal range today.",
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
        "Temperature is close to the right range without fully landing in it, so the read stays a little narrower.",
        "Temperature is almost where you want it, but still limiting just enough to matter.",
      ]);
    }
    if (band === "cool") {
      return pick([
        "Air temperatures are below the seasonal midpoint, so expect tighter windows.",
        "Temperatures are lower than ideal for the date, which narrows the read a bit.",
        "Lower-side temps work against you a little, so timing matters more.",
        "Air temperatures are below the better seasonal range; look for the best local window.",
      ]);
    }
    if (band === "very_warm") {
      return pick([
        "Air temperatures are past the better seasonal band, so the day depends more on timing.",
        "Above-range temperatures make dawn, dusk, and moving-water windows more important.",
        "The temperature setup is elevated enough to narrow the most reliable window.",
      ]);
    }
    return pick([
      "Temperature is a small negative — enough to factor into depth and timing.",
      "Temperature leans against you mildly; compensate with timing and high-percentage water.",
    ]);
  }
  // tier === -2
  if (band === "very_cold") {
    return pick([
      "Air temperatures are well below seasonal norms, so keep expectations realistic.",
      "The temperature read is far below the better seasonal range; patience is the call.",
      "Very low air temperatures dominate the read; safety and realistic expectations matter.",
    ]);
  }
  if (band === "very_warm") {
    return pick([
      "Air temperatures are well above the better seasonal range and working against the day.",
      "The temperature read is extremely elevated; narrow your best windows to the most forgiving parts of the day.",
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
        "Quick jump in pressure — subtle, repeated decisions beat forcing the day.",
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
          "Glass-calm surface — stealth and easily-spooked fish become the main puzzle.",
          "Dead flat wind: extra distance and cleaner angles matter more.",
          "Mirror water — every ripple is yours; finesse and patience rule.",
          "Calm air — great for sight-fishing and precise drifts, but it will not hide sloppy positioning.",
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
          "Moderate wind — factor it into angles, boat position, and drift speed.",
          "Mid-range breeze: workable, but the plan needs a wind-aware adjustment.",
          "Average air movement — neither a crutch nor a crisis.",
          "Wind sits in the middle; boat handling and line belly become part of the pattern.",
        ]);
      }
      if (wt === -1) {
        return pick([
          "Breeze is picking up — positioning and timing matter more than extra searching.",
          "Windy enough to skew drifts; use banks, points, and lee pockets strategically.",
          "Building wind — protected water and shorter, cleaner windows beat forcing distance.",
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
          "Solid overcast — expect fish to use upper water more comfortably.",
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
          "High glare potential — shade, depth, and cleaner sight lines matter more.",
          "Clear-sky punch — mid-day can feel stingy unless you find light breaks.",
        ]);
      }
      return pick([
        "Harsh light — harsh shadows; expect fish to hold deeper, tighter, or in stained water.",
        "Extreme brightness — short strike windows and picky fish are common.",
        "Blinding surface glare — cover and depth beat forcing open-water shots.",
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
          "Flows are fishable and mostly clear — normal seasonal river positioning should translate.",
          "Healthy flow band — not blown out, not skinny; standard water choices should translate.",
          "Flow is cooperative — wading and crossing stay reasonable with care.",
        ]);
      }
      if (rt === 0) {
        return pick([
          "Elevated but workable flows — heavier water, tighter holding spots, more current breaks.",
          "Mid-high stage — fish hug slower water; expect closer quarters than at low water.",
          "Flows have some push — slower edges and depth control matter more.",
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
          "Big water movement day — set up where speed changes and forage gets pushed.",
          "Healthy tide movement — timing the push or drain matters more than extra searching.",
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
        "Weak tide slack — less current to concentrate fish; structure and forage edges become critical.",
        "Flat tidal picture — precision matters more because current is not doing much for you.",
        "Minimal exchange — look for small current, wind-driven chop, or inlet flow instead.",
      ]);
    }
    default:
      return "";
  }
}
