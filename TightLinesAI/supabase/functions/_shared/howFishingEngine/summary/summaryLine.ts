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
    "This is a very strong fishing day.",
    "Conditions look excellent today.",
    "The overall setup is lining up very well.",
    "This is one of the better days on the calendar.",
    "A lot is lining up in your favor today.",
    "This looks like a high-end setup.",
    "Most of the important pieces are working together today.",
    "This is the kind of day anglers hope to see.",
    "The day sets up well from top to bottom.",
    "The overall picture is very favorable today.",
    "This is a standout setup.",
    "The conditions are giving you a real edge today.",
  ],
  Good: [
    "This looks like a solid fishing day.",
    "Overall, the setup is working for you.",
    "More is helping than hurting today.",
    "The day looks solid overall.",
    "This is a dependable setup overall.",
    "Today's conditions give you a good shot.",
    "The overall picture leans your way today.",
    "This is a day to fish with confidence.",
    "The setup is mostly helpful today.",
    "This looks like a fishable day with upside.",
    "Conditions are giving you something to work with.",
    "There is enough going right to feel confident today.",
  ],
  Fair: [
    "This is a workable day, but not an easy one.",
    "The setup is fishable, but mixed.",
    "There is a path today, but it is not obvious.",
    "Some things are helping, and some are getting in the way.",
    "This is a mixed day overall.",
    "The day is workable, but it will take some adjustment.",
    "You can fish this day, but you will need to stay sharp.",
    "The report is balanced enough to fish, but not easy enough to coast through.",
    "This is a fair day, not an easy one.",
    "The setup gives you a chance, but not much room for mistakes.",
    "This is a day for patience and good decisions.",
    "There is enough here to stay interested, but not enough to get careless.",
  ],
  Poor: [
    "This is a tougher day than usual.",
    "The setup is mostly working against you today.",
    "The day looks narrow and demanding.",
    "This is more of a grind than a clean day.",
    "There is not much help in the conditions today.",
    "The overall picture is fairly limiting.",
    "This is the kind of day that asks for patience.",
    "The day does not offer much easy upside.",
    "This setup is making you earn it today.",
    "The engine sees more problems than help here.",
    "This is a tougher read from top to bottom.",
    "The day does not offer many free advantages.",
  ],
};

const MIXED_TEMPLATES = [
  "{driver} is helping, but {suppressor} is still the main problem.",
  "{driver} is a real plus, while {suppressor} is the biggest thing holding the day back.",
  "{driver} is doing the most to help, but {suppressor} is still keeping the day in check.",
  "{driver} is helping the day, but {suppressor} is still making things harder.",
  "{driver} is the clearest positive, while {suppressor} is the clearest problem.",
  "{driver} is helping more than anything else, but {suppressor} keeps the day from opening up.",
  "{driver} is pushing the report in the right direction, but {suppressor} is still limiting the bite.",
  "{driver} gives you a real opening, although {suppressor} still keeps the day tight.",
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
  "{driver} is the biggest reason the day feels more open than tight.",
  "{driver} is doing a lot of the heavy work today.",
  "{driver} is doing the most to keep the outlook favorable.",
] as const;

const NEGATIVE_TEMPLATES = [
  "{suppressor} is the main thing holding the day back.",
  "{suppressor} is the clearest problem in the report.",
  "{suppressor} is doing the most to make the day tougher.",
  "{suppressor} is the biggest reason the setup stays tight.",
  "{suppressor} is the main thing working against you today.",
  "{suppressor} is the part of the day that hurts the most.",
  "{suppressor} is what keeps this from turning into a cleaner bite.",
  "{suppressor} is the first thing to pay attention to today.",
] as const;

const NEUTRAL_CLOSERS = [
  "No one factor is dominating the day.",
  "Nothing is taking over the report by itself.",
  "This is a balanced day more than a dramatic one.",
  "The details matter more than one big factor today.",
  "The day is not being carried or sunk by one obvious thing.",
  "This is more about execution than one major condition edge.",
  "No single variable stands above the rest.",
  "It is a broad, balanced setup rather than a sharp one.",
] as const;

const CONTEXT_TOUCHES: Record<EngineContext, readonly string[]> = {
  freshwater_lake_pond: [
    "On a lake or pond day, steady adjustments usually beat constant change.",
    "For still water, clean decisions usually matter more than doing too much.",
    "Lake days like this usually reward a patient, organized plan.",
    "On still water, simple execution usually beats forcing things.",
  ],
  freshwater_river: [
    "On a river day, staying disciplined usually matters more than covering too much water.",
    "River setups like this usually reward precision over extra motion.",
    "In moving water, clean decisions usually beat rushed ones.",
    "For rivers, the better move is usually to stay precise and controlled.",
  ],
  coastal: [
    "On an inshore day, timing and clean execution usually matter more than extra effort.",
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
    "This is still useful, just a little broader than the cleanest version of the report.",
    "The signal is good, but not as complete as it could be.",
    "Some input coverage was lighter than usual, so keep the read a little broad.",
  ],
  low: [
    "Key inputs were limited, so treat this as a broad read rather than a precise one.",
    "The report still points you in the right direction, but the precision is looser than normal.",
    "Important inputs were thinner than usual, so this is more directional than exact today.",
    "This remains useful, but the engine is working with a wider margin than usual.",
    "The report still helps, but it should be read as broad guidance today.",
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
      return "Cloud Cover";
    case "precipitation_disruption":
      return "Rain";
    case "runoff_flow_disruption":
      return "Rain / Runoff";
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

function buildVariableSummaryLabel(
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
      return "Cloud cover";
    case "precipitation_disruption":
      return "Rain";
    case "runoff_flow_disruption":
      return "Rain and runoff";
    case "tide_current_movement":
      return context === "coastal" || context === "coastal_flats_estuary"
        ? "Tide and current"
        : "Current";
    default: {
      const display = buildVariableDisplayLabel(variable, context).toLowerCase();
      return display.charAt(0).toUpperCase() + display.slice(1);
    }
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

function normalizeSurfaceSentence(text: string): string {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
  if (!clean) return "";
  const withCapital = clean.charAt(0).toUpperCase() + clean.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

export function listSummaryCopyForAudit(): string[] {
  return [
    ...Object.values(OPENERS).flat(),
    ...MIXED_TEMPLATES,
    ...POSITIVE_TEMPLATES,
    ...NEGATIVE_TEMPLATES,
    ...NEUTRAL_CLOSERS,
    ...Object.values(CONTEXT_TOUCHES).flat(),
    ...Object.values(RELIABILITY_CLOSERS).flat(),
  ];
}

export function buildReportSummaryLine(input: ReportSummaryInput): string {
  const { band, reliability, drivers, suppressors, seed, context } = input;
  const opener = pickDeterministic(OPENERS[band], seed, "summary:opener");
  const driver = drivers[0] ? buildVariableSummaryLabel(drivers[0].variable, context) : null;
  const suppressor = suppressors[0]
    ? buildVariableSummaryLabel(suppressors[0].variable, context)
    : null;

  const parts: string[] = [normalizeSurfaceSentence(opener)];

  if (driver && suppressor) {
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(MIXED_TEMPLATES, seed, "summary:mixed")
          .replace("{driver}", driver)
          .replace("{suppressor}", suppressor),
      ),
    );
  } else if (driver) {
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(POSITIVE_TEMPLATES, seed, "summary:positive")
          .replace("{driver}", driver),
      ),
    );
  } else if (suppressor) {
    parts.push(
      normalizeSurfaceSentence(
        pickDeterministic(NEGATIVE_TEMPLATES, seed, "summary:negative")
          .replace("{suppressor}", suppressor),
      ),
    );
  } else {
    parts.push(normalizeSurfaceSentence(pickDeterministic(NEUTRAL_CLOSERS, seed, "summary:neutral")));
  }

  let built = parts.join(" ");

  if (chanceDeterministic(seed, "summary:context:include", 0.38)) {
    const contextTouch = normalizeSurfaceSentence(
      pickDeterministic(CONTEXT_TOUCHES[context], seed, "summary:context"),
    );
    built = appendIfFits([built], contextTouch, 280).join(" ");
  }

  if (reliability !== "high" && chanceDeterministic(seed, "summary:reliability:include", 0.5)) {
    const reliabilityNote = normalizeSurfaceSentence(
      pickDeterministic(
        RELIABILITY_CLOSERS[reliability],
        seed,
        `summary:reliability:${reliability}`,
      ),
    );
    built = appendIfFits([built], reliabilityNote, 280).join(" ");
  }

  return trimAtWordBoundary(built, 280);
}
