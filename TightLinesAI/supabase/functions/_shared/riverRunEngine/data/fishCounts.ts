import type {
  FishCountSourceConfig,
  RiverProfile,
  RiverRunFishCountRead,
  RiverRunSpecies,
} from "../types.ts";
import type { RiverRunFetch } from "./usgs.ts";

const DATA_VERSION = "river-run-fish-counts-v1";
const WDFW_REPORTS_URL =
  "https://wdfw.wa.gov/fishing/management/hatcheries/escapement";
const PROVIDER_REQUEST_INIT: RequestInit = {
  cache: "no-store",
  headers: {
    "User-Agent": "FinFindr River Migration fish-count reader",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
};

export async function fetchRiverRunFishCount(input: {
  river: RiverProfile;
  species: RiverRunSpecies;
  fetchFn: RiverRunFetch;
  now?: Date;
}): Promise<RiverRunFishCountRead | undefined> {
  const source = input.river.fishCountSources?.find((item) =>
    item.eligibleSpecies.includes(input.species as never)
  );
  if (!source || !isCountSpecies(input.species)) return undefined;
  try {
    const parsed = source.provider === "WDFW_ESCAPEMENT"
      ? await fetchWdfwCount(source, input.species, input.fetchFn)
      : await fetchTacomaPowerCount(source, input.species, input.fetchFn);
    return resolveFishCountFreshness(parsed, source, input.now ?? new Date());
  } catch (error) {
    console.error("[river-run] fish-count provider failed", {
      sourceId: source.sourceId,
      message: error instanceof Error ? error.message : String(error),
    });
    return unavailable(source, input.species, "provider_failed");
  }
}

async function fetchWdfwCount(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  const indexResponse = await fetchFn(WDFW_REPORTS_URL, PROVIDER_REQUEST_INIT);
  const html = indexResponse.ok && indexResponse.text
    ? await indexResponse.text()
    : "";
  const report = latestWdfwReport(html);
  if (!report) return unavailable(source, species, "parser_changed");
  const pdfResponse = await fetchFn(report.url, PROVIDER_REQUEST_INIT);
  if (!pdfResponse.ok || !pdfResponse.arrayBuffer) {
    return unavailable(source, species, "provider_failed");
  }
  const pageTexts = await extractPdfPageText(await pdfResponse.arrayBuffer());
  return parseWdfwFacilityCount({
    source,
    species,
    reportDate: report.reportDate,
    pageTexts,
    reportUrl: report.url,
  });
}

async function extractPdfPageText(buffer: ArrayBuffer): Promise<string[]> {
  const pdfjs = await import("npm:pdfjs-dist@4.10.38/legacy/build/pdf.mjs");
  const document = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
  } as never).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item) => "str" in item ? item.str : "").join(" ")
        .replace(/\s+/g, " ").trim(),
    );
  }
  return pages;
}

export function latestWdfwReport(html: string): {
  url: string;
  reportDate: string;
} | null {
  const reports = [...html.matchAll(
    /(?:href=["']?)(\/sites\/default\/files\/\d{4}-\d{2}\/weekly-escapement-(\d{2})-(\d{2})-(\d{4})(?:_\d+)?\.pdf)/gi,
  )].map((match) => ({
    url: new URL(match[1], "https://wdfw.wa.gov").toString(),
    reportDate: `${match[4]}-${match[2]}-${match[3]}`,
  })).filter((report) =>
    Number.isFinite(Date.parse(`${report.reportDate}T00:00:00Z`))
  );
  return reports.toSorted((a, b) =>
    b.reportDate.localeCompare(a.reportDate)
  )[0] ?? null;
}

export function parseWdfwFacilityCount(input: {
  source: FishCountSourceConfig;
  species: RiverRunFishCountRead["species"];
  reportDate: string;
  pageTexts: string[];
  reportUrl: string;
}): RiverRunFishCountRead {
  const heading = input.species === "chinook_salmon" ? "Fall Chinook" : "Coho";
  const page = input.pageTexts.find((text) =>
    new RegExp(
      `Adult Total\\s+${heading.replace(" ", "\\s+")}\\s+Jack Total`,
      "i",
    ).test(text)
  );
  if (!page) {
    return unavailable(
      input.source,
      input.species,
      "not_reported",
      input.reportUrl,
    );
  }
  const facility = escapeRegex(
    input.source.reportFacilityName ?? input.source.facilityName.toUpperCase(),
  );
  const facilityBoundary =
    "(?=[A-Z][A-Z0-9 .&'/-]{2,}(?:HATCHERY|WEIR|TRAP|PONDS|FACILITY)\\s|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),|$)";
  const rows = [...page.matchAll(
    new RegExp(
      `${facility}\\s+(.+?)\\s+(\\d{2}\\/\\d{2}\\/\\d{2})\\s+(.+?)${facilityBoundary}`,
      "gi",
    ),
  )];
  if (!rows.length) {
    return unavailable(
      input.source,
      input.species,
      "not_reported",
      input.reportUrl,
    );
  }
  let adults = 0;
  let jacks = 0;
  let numericRows = 0;
  const dates: string[] = [];
  for (const row of rows) {
    const values = row[3].trim().split(/\s+/);
    const adult = countToken(values[0]);
    const jack = countToken(values[1]);
    if (adult == null && jack == null) continue;
    adults += adult ?? 0;
    jacks += jack ?? 0;
    numericRows++;
    const date = shortDate(row[2]);
    if (date) dates.push(date);
  }
  if (!numericRows) {
    return unavailable(
      input.source,
      input.species,
      "not_reported",
      input.reportUrl,
    );
  }
  return baseRead(input.source, input.species, {
    status: "available",
    period: "season_to_date",
    adultTotal: adults,
    jackTotal: jacks,
    observedTotal: adults + jacks,
    observedThrough: dates.toSorted().at(-1),
    reportDate: input.reportDate,
    freshness: "fresh",
    categoriesIncluded: [
      "all numeric stock/origin rows reported for this facility",
    ],
    sourceUrl: input.reportUrl,
  });
}

async function fetchTacomaPowerCount(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  const response = await fetchFn(source.sourceUrl, PROVIDER_REQUEST_INIT);
  const html = response.ok && response.text ? await response.text() : "";
  return parseTacomaPowerCount({ source, species, html });
}

export function parseTacomaPowerCount(input: {
  source: FishCountSourceConfig;
  species: RiverRunFishCountRead["species"];
  html: string;
}): RiverRunFishCountRead {
  const reportDateFromMarkup = input.html.match(
    /<p>\s*(?:<strong>)?Cowlitz Fish Report(?:<\/strong>)?\s*<\/p>\s*<p>\s*([A-Z][a-z]+ \d{1,2}, \d{4})\s*<\/p>/i,
  )?.[1];
  const text = decodeHtml(input.html).replace(/<[^>]+>/g, " ").replace(
    /\s+/g,
    " ",
  );
  const reportDate = reportDateFromMarkup ??
    text.match(/Cowlitz Fish Report\s+([A-Z][a-z]+ \d{1,2}, \d{4})/)?.[1];
  const sentence = text.match(
    /Last week, Tacoma Power employees recovered (.+?) over (\w+|\d+) days? of operations/i,
  )?.[0] ?? "";
  if (!reportDate || !sentence) {
    return unavailable(input.source, input.species, "parser_changed");
  }
  const label = input.species === "chinook_salmon"
    ? "Fall Chinook"
    : input.species === "coho_salmon"
    ? "Coho"
    : "(?:Summer-run|Winter-run) Steelhead";
  const values = { adult: 0, jack: 0 };
  let found = false;
  const pattern = new RegExp(
    `([\\d,]+|${NUMBER_WORDS})\\s+${label}\\s+(adults?|jacks?)`,
    "gi",
  );
  for (const match of sentence.matchAll(pattern)) {
    const value = numberValue(match[1]);
    if (value == null) continue;
    found = true;
    if (/jack/i.test(match[2])) values.jack += value;
    else values.adult += value;
  }
  if (!found) return unavailable(input.source, input.species, "not_reported");
  const date = longDate(reportDate);
  const daysMatch = sentence.match(/over (\w+|\d+) days? of operations/i)?.[1];
  return baseRead(input.source, input.species, {
    status: "available",
    period: "weekly",
    adultTotal: values.adult,
    jackTotal: values.jack,
    observedTotal: values.adult + values.jack,
    observedThrough: date ?? undefined,
    reportDate: date ?? undefined,
    freshness: "fresh",
    categoriesIncluded: ["weekly adults and jacks recovered at the separator"],
    operatingDays: daysMatch ? numberValue(daysMatch) ?? undefined : undefined,
    sourceUrl: input.source.sourceUrl,
  });
}

export function resolveFishCountFreshness(
  read: RiverRunFishCountRead,
  source: FishCountSourceConfig,
  now: Date,
): RiverRunFishCountRead {
  if (read.status !== "available" || !read.reportDate) return read;
  const ageHours =
    (now.getTime() - Date.parse(`${read.reportDate}T23:59:59Z`)) / 3_600_000;
  if (!Number.isFinite(ageHours) || ageHours > source.maximumAgeHours) {
    return { ...read, status: "stale", freshness: "stale" };
  }
  return read;
}

function unavailable(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  reason: NonNullable<RiverRunFishCountRead["unavailableReason"]>,
  sourceUrl = source.sourceUrl,
): RiverRunFishCountRead {
  return baseRead(source, species, {
    status: "unavailable",
    period: source.provider === "TACOMA_POWER" ? "weekly" : "season_to_date",
    adultTotal: null,
    jackTotal: null,
    observedTotal: null,
    freshness: "missing",
    categoriesIncluded: [],
    sourceUrl,
    unavailableReason: reason,
  });
}

function baseRead(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  values:
    & Pick<
      RiverRunFishCountRead,
      | "status"
      | "period"
      | "adultTotal"
      | "jackTotal"
      | "observedTotal"
      | "freshness"
      | "categoriesIncluded"
      | "sourceUrl"
    >
    & Partial<RiverRunFishCountRead>,
): RiverRunFishCountRead {
  return {
    sourceId: source.sourceId,
    provider: source.provider,
    facilityName: source.facilityName,
    observationType: source.observationType,
    species,
    preliminary: source.preliminary,
    attribution: source.attribution,
    representedReach: source.representedReach,
    limitation: source.limitation,
    dataVersion: DATA_VERSION,
    ...values,
  };
}

const NUMBER_WORDS =
  "zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty";
const WORD_VALUES: Record<string, number> = Object.fromEntries(
  NUMBER_WORDS.split("|").map((word, index) => [word, index]),
);

function numberValue(value: string): number | null {
  const normalized = value.toLowerCase().replaceAll(",", "");
  if (normalized in WORD_VALUES) return WORD_VALUES[normalized];
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function countToken(value?: string): number | null {
  if (!value || value === "-") return null;
  return numberValue(value);
}

function shortDate(value: string): string | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  return match ? `20${match[3]}-${match[1]}-${match[2]}` : null;
}

function longDate(value: string): string | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed)
    ? new Date(parsed).toISOString().slice(0, 10)
    : null;
}

function decodeHtml(value: string): string {
  return value.replaceAll("&nbsp;", " ").replaceAll("&amp;", "&").replaceAll(
    "&#8211;",
    "–",
  ).replaceAll("&#8217;", "’");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isCountSpecies(
  species: RiverRunSpecies,
): species is RiverRunFishCountRead["species"] {
  return ["chinook_salmon", "coho_salmon", "steelhead"].includes(species);
}
