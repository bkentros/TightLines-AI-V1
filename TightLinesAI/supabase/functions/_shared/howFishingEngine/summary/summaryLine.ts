/**
 * Short report summary — must NOT echo driver/suppressor bullets (those are below).
 * Stochastic wording so similar scores still read fresh across refreshes.
 */

import type { ScoreBand } from "../contracts/mod.ts";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const PRIMARY: Record<ScoreBand, readonly string[]> = {
  Excellent: [
    "Rare air today — the overall picture is about as good as it gets.",
    "Stacked in your favor: conditions line up unusually well.",
    "Green lights across the board for a strong day on the water.",
    "Today’s read is elite-tier — worth clearing the calendar if you can.",
    "Big-picture outlook is excellent; odds are on the angler’s side.",
    "You’re looking at a banner day by the numbers.",
    "All signs point to a high-ceiling outing.",
    "The composite score is sitting up top — capitalize if you’re able to fish.",
  ],
  Good: [
    "Solid day ahead — more working for you than against you.",
    "Overall conditions look genuinely favorable.",
    "The deck is mostly stacked your way today.",
    "You’ve got a respectable edge — nothing fancy, just good fishing weather.",
    "Broadly speaking, it’s a thumbs-up kind of day.",
    "Net positive outlook; plenty to like in the mix.",
    "Conditions skew friendly — a dependable day to plan around.",
    "Picture looks healthy overall with a few usual caveats.",
  ],
  Fair: [
    "Middle of the road — fishable, but you’ll earn your bites.",
    "Honest mixed bag: some help, some friction.",
    "Neither a gimme nor a washout — typical grind-day energy.",
    "Conditions are workable; expect to puzzle through a few variables.",
    "Average on balance — patience and adjustments matter.",
    "You can absolutely catch fish; nothing is handing it to you.",
    "Split decision from the data — neither great nor terrible.",
    "Fair is fair: go in with realistic expectations and adapt.",
  ],
  Poor: [
    "Rough read overall — expect a slog or pick your windows carefully.",
    "Headwinds dominate today’s story.",
    "The numbers are telling you to temper expectations.",
    "Challenging composite — persistence and spot selection will matter most.",
    "Tough outlook; only the strong patterns or spots will shine.",
    "It’s a defensive day — work edges, time, and comfort zones.",
    "Conditions are fighting you more than helping.",
    "Low ceiling today unless you find a rare pocket of relief.",
  ],
};

/** Optional second sentence — never names temp, wind, pressure, etc. */
const CLOSERS: readonly string[] = [
  "The positives and headwinds below break it down factor by factor.",
  "Scroll for what’s helping versus what’s holding the score back.",
  "Details under the score spell out the why.",
  "Each bullet under the score adds a piece of the puzzle.",
  "Use the list below to see what’s carrying the day and what isn’t.",
];

/**
 * One or two sentences, max ~220 chars. Independent of driver/suppressor copy.
 */
export function buildReportSummaryLine(band: ScoreBand): string {
  const first = pick(PRIMARY[band]);
  if (Math.random() < 0.45) {
    return first.replace(/\s+/g, " ").trim().slice(0, 220);
  }
  const out = `${first} ${pick(CLOSERS)}`.replace(/\s+/g, " ").trim();
  return out.slice(0, 280);
}
