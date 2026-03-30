import type { EngineContext, ScoreBand } from "../contracts/mod.ts";
import { chanceDeterministic, pickDeterministic } from "../copy/deterministicPick.ts";

type SummaryFactor = { variable: string };

export type ReportSummaryInput = {
  band: ScoreBand;
  score: number;
  context: EngineContext;
  reliability: "high" | "medium" | "low";
  drivers: SummaryFactor[];
  suppressors: SummaryFactor[];
  seed: string;
};

const OPENERS: Record<ScoreBand, readonly string[]> = {
  Excellent: [
    "This is one of the stronger days you will see.",
    "Conditions look unusually good today.",
    "The overall setup is lining up very well.",
    "This is a strong-read day from the engine.",
    "The day is coming together in a very fishable way.",
    "There is a lot to like in this setup today.",
    "This looks like a high-quality fishing day.",
    "The conditions are working together better than usual today.",
    "This is the kind of day that gives you a real advantage.",
    "The overall picture looks very helpful today.",
    "This is a notably favorable setup.",
    "Most of the important pieces are lining up today.",
  ],
  Good: [
    "This looks like a solid fishing day.",
    "Overall, the setup is working in your favor.",
    "More is helping than hurting today.",
    "The day has a good, practical look to it.",
    "This is a dependable setup overall.",
    "There is a real opportunity in today's conditions.",
    "The overall picture leans your way today.",
    "This is a good day to trust the report.",
    "The setup is mostly helpful today.",
    "This looks like a fishable day with real upside.",
    "Conditions are giving you a fair amount to work with.",
    "There is enough going right to feel confident today.",
  ],
  Fair: [
    "This is a workable day, but not an easy one.",
    "The setup is fishable, but mixed.",
    "There is a path today, but it is not a freebie.",
    "Some things are helping, and some are getting in the way.",
    "This is a middle-of-the-road day overall.",
    "The day is workable, but it wants some adjustment.",
    "You can fish this day, but you will need to stay sharp.",
    "The report is balanced enough to fish, but not relaxed enough to cruise through.",
    "This is a fair day, not an easy one.",
    "The setup gives you a chance, but not much room for sloppiness.",
    "This is a day for good decisions more than blind confidence.",
    "There is enough here to stay interested, but not enough to get careless.",
  ],
  Poor: [
    "This is a tougher day than usual.",
    "The setup is mostly working against you today.",
    "The day looks narrow and demanding.",
    "This is more of a grind than a clean bite day.",
    "There is not much easy help in the conditions today.",
    "The overall picture is pretty limiting.",
    "This is the kind of day that asks for patience.",
    "The report points to a day with limited upside.",
    "This setup is making you earn it today.",
    "The engine sees more problems than help here.",
    "This is a tougher read from top to bottom.",
    "The day does not offer many free advantages.",
  ],
};

const MIXED_TEMPLATES = [
  "{driver} is helping, but {suppressor} is still the main problem.",
  "{driver} is a real plus, while {suppressor} is the biggest thing holding the day back.",
  "{driver} is doing the most to help, but {suppressor} keeps the day from being cleaner.",
  "{driver} is helping the day, but {suppressor} is still making things harder.",
  "{driver} is the clearest positive, while {suppressor} is the clearest problem.",
  "{driver} is helping more than anything else, but {suppressor} keeps this from being an easy day.",
  "{driver} is pushing the report in the right direction, but {suppressor} is still limiting the bite.",
  "{driver} gives you something to work with, although {suppressor} still keeps the day narrow.",
  "{driver} is giving the day a better look, but {suppressor} is still enough to matter.",
  "{driver} is helping the most in the report, while {suppressor} is the main thing pulling the day down.",
  "{driver} is helping the most, but {suppressor} is still the piece to watch.",
  "{driver} is the reason this still looks fishable, and {suppressor} is the reason it is not better.",
] as const;

const POSITIVE_TEMPLATES = [
  "{driver} is the clearest reason the day looks this good.",
  "{driver} is doing more than anything else to help the bite.",
  "{driver} is helping the most in the report today.",
  "{driver} is giving the day its clearest advantage.",
  "{driver} is the main thing pushing the setup in the right direction.",
  "{driver} is the biggest reason the day feels open instead of narrow.",
  "{driver} is carrying a lot of the good news today.",
  "{driver} is doing the most to keep the outlook favorable.",
] as const;

const NEGATIVE_TEMPLATES = [
  "{suppressor} is the main thing holding the day back.",
  "{suppressor} is the clearest problem in the report.",
  "{suppressor} is doing the most to make the day tougher.",
  "{suppressor} is the biggest reason the setup stays narrow.",
  "{suppressor} is the main source of resistance today.",
  "{suppressor} is the part of the day that hurts the most.",
  "{suppressor} is what keeps this from turning into a cleaner bite.",
  "{suppressor} is the first thing to respect in this setup.",
] as const;

const NEUTRAL_CLOSERS = [
  "No one factor is dominating the story.",
  "Nothing is taking over the report by itself.",
  "This is a more balanced read than a dramatic one.",
  "The details matter more than one big headline today.",
  "The day is not being carried or sunk by one obvious thing.",
  "This is more about execution than one giant condition advantage.",
  "No single variable is stealing the show.",
  "It is a broad, balanced read rather than a loud one.",
] as const;

const CONTEXT_TOUCHES: Record<EngineContext, readonly string[]> = {
  freshwater_lake_pond: [
    "On a lake or pond day, steady adjustments usually beat constant change.",
    "For still water, clean decisions usually matter more than extra movement.",
    "Lake days like this usually reward a patient, organized plan.",
    "On still water, simple execution usually holds up better than forcing it.",
  ],
  freshwater_river: [
    "On a river day, staying disciplined usually matters more than doing too much.",
    "River setups like this usually reward precision over extra motion.",
    "In moving water, clean decisions usually beat rushed ones.",
    "For rivers, the better move is usually to stay precise and controlled.",
  ],
  coastal: [
    "On an inshore day, timing and clean execution usually matter more than doing more.",
    "Coastal setups like this usually reward staying disciplined once the window shows up.",
    "For inshore water, a simple plan usually holds up better than forcing it.",
    "On coastal days, clean decisions usually matter more than extra effort.",
  ],
  coastal_flats_estuary: [
    "On the flats, small advantages usually matter more than big guesses.",
    "Flats days like this usually reward a calm, precise approach.",
    "In a flats setup, clean execution usually matters more than forcing the pace.",
    "For flats and estuary water, subtle adjustments usually decide more than big ones.",
  ],
};

const RELIABILITY_CLOSERS: Record<"medium" | "low", readonly string[]> = {
  medium: [
    "A couple of inputs were limited, so treat this as a slightly broader read.",
    "The call is still useful, but one or two inputs were thinner than usual.",
    "This is still actionable, just a little broader than the cleanest version of the report.",
    "The signal is good, but not as complete as it could be.",
    "Some input coverage was lighter than usual, so keep the read a little broad.",
  ],
  low: [
    "Key inputs were limited, so treat this as a broad read rather than a precise one.",
    "The report still points you in the right direction, but the precision is looser than normal.",
    "Important inputs were thinner than usual, so this is more directional than exact today.",
    "This remains useful, but the engine is working with a wider margin than usual.",
    "The call still helps, but today it should be read as broad guidance.",
  ],
};

export function buildVariableDisplayLabel(
  variable: string,
  context?: EngineContext,
): string {
  switch (variable) {
    case "temperature_condition":
      return "Temperature";
    case "pressure_regime":
      return "Pressure";
    case "wind_condition":
      return "Wind";
    case "light_cloud_condition":
      return "Light / Cloud Cover";
    case "precipitation_disruption":
      return "Rain";
    case "runoff_flow_disruption":
      return "River Flow";
    case "tide_current_movement":
      return context === "coastal" || context === "coastal_flats_estuary"
        ? "Tide / Current"
        : "Current";
    default:
      return variable
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

function trimAtWordBoundary(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen + 1);
  const cut = sliced.lastIndexOf(" ");
  return (cut > 0 ? sliced.slice(0, cut) : clean.slice(0, maxLen)).trim();
}

function appendIfFits(parts: string[], addition: string, maxLen: number): string[] {
  const next = [...parts, addition];
  if (next.join(" ").replace(/\s+/g, " ").trim().length <= maxLen) {
    return next;
  }
  return parts;
}

export function buildReportSummaryLine(input: ReportSummaryInput): string {
  const { band, reliability, drivers, suppressors, seed, context } = input;
  const opener = pickDeterministic(OPENERS[band], seed, "summary:opener");
  const driver = drivers[0] ? buildVariableDisplayLabel(drivers[0].variable, context) : null;
  const suppressor = suppressors[0]
    ? buildVariableDisplayLabel(suppressors[0].variable, context)
    : null;

  const parts: string[] = [opener];

  if (driver && suppressor) {
    parts.push(
      pickDeterministic(MIXED_TEMPLATES, seed, "summary:mixed")
        .replace("{driver}", driver)
        .replace("{suppressor}", suppressor),
    );
  } else if (driver) {
    parts.push(
      pickDeterministic(POSITIVE_TEMPLATES, seed, "summary:positive")
        .replace("{driver}", driver),
    );
  } else if (suppressor) {
    parts.push(
      pickDeterministic(NEGATIVE_TEMPLATES, seed, "summary:negative")
        .replace("{suppressor}", suppressor),
    );
  } else {
    parts.push(pickDeterministic(NEUTRAL_CLOSERS, seed, "summary:neutral"));
  }

  let built = parts.join(" ");

  if (chanceDeterministic(seed, "summary:context:include", 0.38)) {
    const contextTouch = pickDeterministic(CONTEXT_TOUCHES[context], seed, "summary:context");
    built = appendIfFits([built], contextTouch, 280).join(" ");
  }

  if (reliability !== "high" && chanceDeterministic(seed, "summary:reliability:include", 0.5)) {
    const reliabilityNote = pickDeterministic(
      RELIABILITY_CLOSERS[reliability],
      seed,
      `summary:reliability:${reliability}`,
    );
    built = appendIfFits([built], reliabilityNote, 280).join(" ");
  }

  return trimAtWordBoundary(built, 280);
}
