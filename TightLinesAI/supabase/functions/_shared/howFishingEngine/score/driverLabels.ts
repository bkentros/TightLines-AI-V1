/**
 * Human-readable driver/suppressor lines — multi-variant so repeats read fresh.
 *
 * pick() uses Math.random() in production (intentional — avoids repetitive reads
 * across refreshes). For deterministic audit runs, call setDriverLabelSeed(str)
 * before executing the engine; the seed is hashed to an index offset.
 */

import type { ScoredVariableKey, SharedNormalizedOutput } from "../contracts/mod.ts";
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
        "Air temps are running warm for the calendar — metabolism and forage activity tend to stay up.",
        "Above-average warmth today; expect fish to be distributed in their summer-style haunts.",
        "Heat budget is on the high side of normal — good for aggressive feeders if oxygen stays solid.",
        "Warm-side readings: think faster retrieves and shallower patrol zones than on a cool snap.",
        "Thermals favor an active bite as long as you avoid the hottest flat-water midday lull.",
      ]);
    }
    if (band === "optimal") {
      return pick([
        "Water-adjacent air temps sit in the seasonal sweet spot — a classic \"no excuses\" thermal window.",
        "You’re inside the comfort band most species prefer today; turnover stress is minimal.",
        "Thermal picture is textbook: not too hot, not too cold for this time of year.",
        "Temps line up with what guides call the money zone for this month.",
        "Stable, season-appropriate warmth — fish shouldn’t be thermally shocked or sluggish.",
      ]);
    }
    return pick([
      "Temperature is a clear net positive on the model — one of the stronger green lights today.",
      "The thermal stack is doing real work for the score; plan around normal seasonal patterns.",
      "Warm/cool balance lands on the helpful side — use it to pick depth and pace confidently.",
    ]);
  }
  if (tier === 1) {
    if (band === "warm" || band === "optimal") {
      return pick([
        "Temps are cooperative — not flashy, but they’re tilting the odds toward an active bite.",
        "Thermal conditions read friendly; you’ll still want to match depth to the sun/wind combo.",
        "Air-side warmth is in your corner without being extreme — a steady, fishable baseline.",
        "Seasonal temperatures are behaving; treat it as a quiet helper behind flashier factors.",
      ]);
    }
    if (band === "cool" && trend === "warming") {
      return pick([
        "It’s cool now but warming through the day — fish often respond as the water creeps up.",
        "A warming trend off a cool morning can unlock mid-day movement; watch shallow transitions.",
        "Cool start, rising mercury: classic setup for improving feeds after the chill bleeds off.",
        "Temps are climbing from a cool baseline — patience early, opportunity as warmth builds.",
      ]);
    }
    return pick([
      "Temperature nudges the score upward — a mild tailwind, not the headline story.",
      "Thermals are a modest plus; pair them with light, wind, and flow for the full read.",
      "Slight positive on temperature — enough to notice, not enough to ignore other factors.",
    ]);
  }
  if (tier === 0) {
    if (band === "very_warm") {
      return pick([
        "It’s genuinely hot — dissolved oxygen and shade lines start to matter more than usual.",
        "Extreme warmth: expect mid-day slowdowns unless you find current, depth, or turbidity.",
        "Heat spike readings; target low-light windows and moving water when possible.",
        "Very warm air mass — fish may compress into cooler refuges until conditions ease.",
      ]);
    }
    return pick([
      "Temperature sits neutral on the model — neither carrying nor dragging the composite.",
      "Thermals are middle-of-the-road; you’ll lean on other variables for the real story.",
      "No strong thermal signal today — treat temp as background noise, not a decision driver.",
    ]);
  }
  if (tier === -1) {
    if (band === "cool") {
      return pick([
        "Below-average cool — metabolisms dip; slower presentations and deeper staging are common.",
        "Chilly for the date: fish can feel tentative until a warm spell or sun hits the water.",
        "Cool-side temps are a light headwind — not a lockout, but expect shorter feeding windows.",
        "Air is running cold; look for the warmest water you can find (sun pockets, inflows, depth).",
      ]);
    }
    if (band === "very_warm") {
      return pick([
        "Heat is past the productive band — stress and lethargy can outweigh forage opportunity.",
        "Too-warm readings: the bite often hinges on dawn, dusk, and shaded or aerated water.",
        "Thermal stress risk is elevated; prioritize oxygen and temperature breaks over aggression.",
      ]);
    }
    return pick([
      "Temperature is a small negative — enough to factor into depth and retrieve speed.",
      "Thermals lean against you mildly; compensate with timing and high-percentage water.",
    ]);
  }
  // tier === -2
  if (band === "very_cold") {
    return pick([
      "Well below seasonal norms — tough thermal conditions; pick the warmest stable water available.",
      "Deep cold: fish move slow and tight — finesse or live-bait patience is the call.",
      "Frigid readings dominate; safety and realistic catch expectations matter as much as tactics.",
    ]);
  }
  if (band === "very_warm") {
    return pick([
      "Extreme heat is suppressing the score — survival mode beats feeding mode for many fish.",
      "Blistering thermal picture; narrow your windows to low light and high-oxygen zones.",
    ]);
  }
  return pick([
    "Temperature is a major drag on today’s composite — plan around the least hostile part of the day.",
    "Thermals are working hard against you; other factors need to overperform to compensate.",
  ]);
}

function pressureDriverLabel(p: NonNullable<Norm["pressure_regime"]>): string {
  switch (p.label) {
    case "falling_slow":
      return pick([
        "Barometer is easing downward slowly — the classic \"fish feel it coming\" pre-front window.",
        "Gentle pressure fall often correlates with confident feeding ahead of a weak change.",
        "Slow drop in mercury: subtle instability that many fisheries read as a green light.",
        "Soft falling pressure — enough movement to turn heads without a shock to the system.",
      ]);
    case "falling_moderate":
      return pick([
        "Steady pressure drop with a real front attached — expect a feed-up before the blow.",
        "Moderate fall: barometric slope is meaningful; hit stable structure before the shift peaks.",
        "Frontal approach signature — fish commonly chew on the leading edge of the gradient.",
        "Pressure tracing a clean downtrend; treat it as momentum building toward a weather change.",
      ]);
    case "falling_hard":
      return pick([
        "Pressure cliff — a hard front is moving fast; bites can vaporize once the crash lands.",
        "Rapid barometric collapse: prioritize the calm-before and expect shutdown during peak change.",
        "Violent falloff in pressure — shocky conditions; tight windows, high stakes.",
        "Steep gradient today; aggression often evaporates until things flatten out again.",
      ]);
    case "rising_slow":
      return pick([
        "Pressure recovering gradually post-front — stability returns and fish settle back into rhythm.",
        "Slow rise: post-storm mend mode; bites rebuild as barometric noise fades.",
        "Gentle rebound in mercury — patience pays as barotrauma-like stress eases.",
        "Measured pressure recovery — not instant magic, but the trend is your friend.",
      ]);
    case "rising_fast":
      return pick([
        "Barometer snapped upward — fish can go fussy while they recalibrate to the new baseline.",
        "Fast rise often means a pause in the bite until the new pressure plateaus.",
        "Sharp recovery slope: expect selective, finicky bites until the new baseline settles.",
        "Quick jump in pressure — presentation subtlety and repeat casts beat power fishing.",
      ]);
    case "volatile":
      return pick([
        "Mixed barometric signals over the last 24 hours — short windows; stick to high-percentage spots.",
        "Pressure has been swinging back and forth — commitment windows shrink; avoid spreading thin.",
        "Back-and-forth pressure history: quality beats quantity; patient, focused fishing wins.",
        "Choppy pressure record today — find sheltered, stable water and stay put longer than usual.",
      ]);
    case "stable_neutral":
      return pick([
        "Barometer is flat — no big atmospheric story; other variables carry more weight.",
        "Stable pressure removes drama; you’re not fighting a front, just local conditions.",
        "Mercury holding steady — neither helper nor villain on its own.",
        "Neutral pressure regime: lean on wind, light, temperature, and flow for edges.",
      ]);
    default:
      return `Pressure regime: ${p.label.replace(/_/g, " ")}.`;
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
          "Calm air — great for sight-fishing and precise drifts, poor for masking noise.",
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
          "Building wind — heavier tackle and shorter casts often outperform hero long bombs.",
          "Air is getting pushy; expect harder boat control and more bow in the line.",
        ]);
      }
      return pick([
        "Strong wind dominates the day — safety and spot selection trump optimism.",
        "Heavy air — look for leeward shores, channels, and breaks that knock the chop down.",
        "Gale-ish conditions on the model — fewer fishable windows, higher consequence.",
      ]);
    }
    case "light_cloud_condition": {
      if (!l) return "";
      const lt = engineScoreTier(l.score);
      if (lt === 2) {
        return pick([
          "Heavy cloud deck — low light often pulls predators shallow and extends morning behavior.",
          "Dark sky filter: UV drops, silhouettes matter, and fish roam more freely.",
          "Solid overcast — think aggressive retrieves and visible profiles in the upper water.",
          "Low-light ceiling — prime time can stretch well past normal sunny-hour rules.",
        ]);
      }
      if (lt === 1) {
        return pick([
          "Useful cloud cover — enough shade to keep fish honest without full blackout vibes.",
          "Softened sunlight — good for wary fish and longer feeding moods.",
          "Clouds are helping — not storm-gray, just enough diffusion to spread activity.",
          "Broken to solid mid-cloud — a dependable light-quality boost.",
        ]);
      }
      if (lt === 0) {
        return pick([
          "Light is average for the date — no major glare or shade story.",
          "Sky conditions are middle-of-the-pack; neither a superpower nor a penalty.",
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
        "Harsh light — harsh shadows; expect deep, tight, or turbid refuges to hold fish.",
        "Extreme brightness — short strike windows and picky fish are common.",
        "Blinding surface glare — finesse under cover beats open-water hero shots.",
      ]);
    }
    case "precipitation_disruption": {
      if (!pr) return "";
      const prt = engineScoreTier(pr.score);
      if (prt === 2) {
        return pick([
          "Extended dry spell — flows often clear and stabilize; fish settle into predictable lies.",
          "Long clear stretch — minimal runoff noise, good for pattern repetition.",
          "Dry pattern dominance — water chemistry and clarity tend toward the friendly side.",
        ]);
      }
      if (prt === 1) {
        return pick([
          "Dry, settled regime — no rain drama muddying the picture.",
          "Precipitation isn’t in play — one less variable to second-guess.",
          "Quiet hydrology day — clarity and comfort usually hold steady.",
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
          "Recent rain is shifting stain, flow, and forage location — old waypoints may lie.",
          "Runoff tint creeping in — edges and current seams become high-percentage.",
          "Freshwater input is changing the look of the water; follow the mud line.",
        ]);
      }
      return pick([
        "Active or heavy precip — safety aside, fish can go weird until energy passes.",
        "Significant wet weather signal — turnover in clarity and temperature layers is likely.",
        "Big water disruption from rain/snow — postpone heroics until things normalize.",
      ]);
    }
    case "runoff_flow_disruption": {
      if (!r) return "";
      const rt = engineScoreTier(r.score);
      if (rt === 2) {
        return pick([
          "Flows are prime — clear, wadable or floatable, with habitat in textbook shape.",
          "River reads like a brochure: ideal cfs/clarity combo for this time of year.",
          "Runoff picture is clean and stable — spend time fishing, not guessing.",
        ]);
      }
      if (rt === 1) {
        return pick([
          "Flows are fishable and mostly clear — normal seasonal river math applies.",
          "Healthy flow band — not blown out, not skinny; standard tactics should translate.",
          "Hydrology is cooperative — wading and crossing stay reasonable with care.",
        ]);
      }
      if (rt === 0) {
        return pick([
          "Elevated but workable flows — heavier water, tighter lies, more current seams.",
          "Mid-high stage — fish hug slower water; expect closer quarters than at low water.",
          "Flows have some push — adjust weight and drift depth to stay in the bite.",
        ]);
      }
      return pick([
        "High or dirty flows dominate — tough wading, tough visibility, picky fish.",
        "Runoff stress is real — focus on soft banks, backwaters, and major confluence dilution.",
        "Blown river conditions on the model — patience or a plan B watershed wins.",
      ]);
    }
    case "tide_current_movement": {
      if (!ti) return "";
      if (ti.label === "strong_moving" || ti.score >= 1.5) {
        return pick([
          "Strong tidal exchange — current is moving nutrients and disorienting prey; lean into it.",
          "Big water movement day — stage on seams, rips, and pinch points where speed changes.",
          "Healthy tidal engine — timing the push or drain matters more than lure color.",
        ]);
      }
      if (ti.label === "moving") {
        return pick([
          "Moderate tide — enough flow to work with, not a slam-dunk current day.",
          "Average tidal range — fish won’t ignore the moon, but it won’t do all the work.",
          "Mid-level movement — combine tide with wind and light for the full coastal read.",
        ]);
      }
      return pick([
        "Weak tide slack — less current to concentrate fish; structure and bait become critical.",
        "Flat tidal picture — you’re not getting a free conveyor belt; precision beats hope.",
        "Minimal exchange — look for micro-current, wind-driven chop, or inlet flow instead.",
      ]);
    }
    default:
      return "";
  }
}
