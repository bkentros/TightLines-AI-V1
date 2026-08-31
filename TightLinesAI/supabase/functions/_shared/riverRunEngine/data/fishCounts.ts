import type {
  FishCountSourceConfig,
  RiverProfile,
  RiverRunFishCountRead,
  RiverRunFishCountReport,
  RiverRunFishCountSpecies,
  RiverRunSpecies,
} from "../types.ts";
import type { RiverRunFetch } from "./usgs.ts";

const DATA_VERSION = "river-run-fish-counts-v2";
const WDFW_REPORTS_URL =
  "https://wdfw.wa.gov/fishing/management/hatcheries/escapement";
const TABLEAU_REFRESH_QUERY = "?:showVizHome=no&:refresh=yes";
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
  const report = await fetchRiverRunFishCountReport({
    source,
    fetchFn: input.fetchFn,
    now: input.now,
  });
  return fishCountReadFromReport(
    report,
    source,
    input.species,
    input.now ?? new Date(),
  );
}

export async function fetchRiverRunFishCountReport(input: {
  source: FishCountSourceConfig;
  fetchFn: RiverRunFetch;
  now?: Date;
}): Promise<RiverRunFishCountReport> {
  const fetchedAt = (input.now ?? new Date()).toISOString();
  const fetchFn = memoizeProviderFetch(input.fetchFn);
  const reads: RiverRunFishCountReport["reads"] = {};
  try {
    await Promise.all(input.source.eligibleSpecies.map(async (species) => {
      reads[species] = await fetchCountFromSource(
        input.source,
        species,
        fetchFn,
      );
    }));
  } catch (error) {
    console.error("[river-run] fish-count provider failed", {
      sourceId: input.source.sourceId,
      message: error instanceof Error ? error.message : String(error),
    });
    for (const species of input.source.eligibleSpecies) {
      reads[species] = unavailable(input.source, species, "provider_failed");
    }
  }
  const values = Object.values(reads).filter((
    read,
  ): read is RiverRunFishCountRead => Boolean(read));
  const hardFailures = values.filter((read) =>
    read.status === "unavailable" &&
    (read.unavailableReason === "provider_failed" ||
      read.unavailableReason === "parser_changed")
  );
  const fetchStatus = values.length > 0 && hardFailures.length === values.length
    ? "failed"
    : "success";
  return {
    sourceId: input.source.sourceId,
    provider: input.source.provider,
    fetchedAt,
    reportIdentity: await reportIdentity(input.source.sourceId, reads),
    fetchStatus,
    failureReason: fetchStatus === "failed"
      ? hardFailures.some((read) =>
          read.unavailableReason === "provider_failed"
        )
        ? "provider_failed"
        : "parser_changed"
      : undefined,
    reads,
    dataVersion: DATA_VERSION,
  };
}

export function fishCountReadFromReport(
  report: RiverRunFishCountReport,
  source: FishCountSourceConfig,
  species: RiverRunFishCountSpecies,
  now: Date,
): RiverRunFishCountRead {
  const read = report.reads[species] ??
    unavailable(source, species, "not_reported");
  const resolved = resolveFishCountFreshness(read, source, now);
  return report.fetchStatus === "failed" && resolved.status === "available"
    ? { ...resolved, status: "stale", freshness: "stale" }
    : resolved;
}

async function fetchCountFromSource(
  source: FishCountSourceConfig,
  species: RiverRunFishCountSpecies,
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  return source.provider === "WDFW_ESCAPEMENT"
    ? await fetchWdfwCount(source, species, fetchFn)
    : source.provider === "TACOMA_POWER"
    ? await fetchTacomaPowerCount(source, species, fetchFn)
    : source.provider === "INDIANA_DNR_TABLEAU"
    ? await fetchIndianaDnrCount(source, species, fetchFn)
    : source.provider === "WISCONSIN_DNR_ROOT"
    ? await fetchWisconsinRootCount(source, species, fetchFn)
    : await fetchWisconsinBruleCount(source, species, fetchFn);
}

function memoizeProviderFetch(fetchFn: RiverRunFetch): RiverRunFetch {
  const responses = new Map<
    string,
    Promise<Awaited<ReturnType<RiverRunFetch>>>
  >();
  const textBodies = new Map<string, Promise<string>>();
  const binaryBodies = new Map<string, Promise<ArrayBuffer>>();
  return async (input, init) => {
    const key = typeof input === "string" ? input : input.toString();
    const response = await (responses.get(key) ?? (() => {
      const request = fetchFn(input, init);
      responses.set(key, request);
      return request;
    })());
    return {
      ok: response.ok,
      json: () => response.json(),
      text: response.text
        ? () => {
          const body = textBodies.get(key) ?? response.text!();
          textBodies.set(key, body);
          return body;
        }
        : undefined,
      arrayBuffer: response.arrayBuffer
        ? () => {
          const body = binaryBodies.get(key) ?? response.arrayBuffer!();
          binaryBodies.set(key, body);
          return body.then((value) => value.slice(0));
        }
        : undefined,
    };
  };
}

async function reportIdentity(
  sourceId: string,
  reads: RiverRunFishCountReport["reads"],
): Promise<string> {
  const canonical = JSON.stringify(
    Object.entries(reads).toSorted().map(
      (
        [species, read],
      ) => [
        species,
        read?.reportDate,
        read?.observedThrough,
        read?.adultTotal,
        read?.jackTotal,
        read?.observedTotal,
        read?.sourceUrl,
      ],
    ),
  );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical),
  );
  const hash = [...new Uint8Array(digest)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return `${sourceId}:${hash}`;
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
    verbosity: 0,
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

async function extractPdfVisualText(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("npm:pdfjs-dist@4.10.38/legacy/build/pdf.mjs");
  const document = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    verbosity: 0,
  } as never).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const rows: Array<{
      y: number;
      items: Array<{
        x: number;
        width: number;
        height: number;
        value: string;
      }>;
    }> = [];
    for (const item of content.items) {
      if (!("str" in item) || !item.str) continue;
      const y = item.transform[5];
      let row = rows.find((candidate) => Math.abs(candidate.y - y) <= 1);
      if (!row) {
        row = { y, items: [] };
        rows.push(row);
      }
      row.items.push({
        x: item.transform[4],
        width: item.width,
        height: item.height,
        value: item.str,
      });
    }
    pages.push(
      rows.toSorted((a, b) => b.y - a.y).map((row) => {
        const items = row.items.toSorted((a, b) => a.x - b.x);
        let value = "";
        let previousEnd: number | null = null;
        for (const item of items) {
          if (
            previousEnd != null &&
            item.x - previousEnd > Math.max(1, item.height * 0.12)
          ) value += " ";
          value += item.value;
          previousEnd = item.x + item.width;
        }
        return value.trim();
      }).filter(Boolean).join("\n"),
    );
  }
  return pages.join("\n");
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

async function fetchIndianaDnrCount(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  const indexResponse = await fetchFn(source.sourceUrl, PROVIDER_REQUEST_INIT);
  const html = indexResponse.ok && indexResponse.text
    ? await indexResponse.text()
    : "";
  const reportUrl = indianaDnrTableauPdfUrl(html);
  if (!reportUrl) return unavailable(source, species, "parser_changed");
  const reportResponse = await fetchFn(reportUrl, PROVIDER_REQUEST_INIT);
  if (!reportResponse.ok || !reportResponse.arrayBuffer) {
    return unavailable(source, species, "provider_failed", reportUrl);
  }
  const text = await extractPdfVisualText(await reportResponse.arrayBuffer());
  return parseIndianaDnrLadderCount({ source, species, text, reportUrl });
}

export function indianaDnrTableauPdfUrl(html: string): string | null {
  const source = decodeHtml(html).match(
    /<tableau-viz[^>]+src=["'](https:\/\/[^"']+\/views\/([^/"']+)\/([^/"'?]+))[^"']*["']/i,
  );
  if (!source) return null;
  const url = new URL(source[1]);
  return `${url.origin}/views/${source[2]}/${
    source[3]
  }.pdf${TABLEAU_REFRESH_QUERY}`;
}

export function parseIndianaDnrLadderCount(input: {
  source: FishCountSourceConfig;
  species: RiverRunFishCountRead["species"];
  text: string;
  reportUrl: string;
}): RiverRunFishCountRead {
  const reportDateToken = input.text.match(
    /LAST\s*UPDATED\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
  )?.[1];
  const totals = input.text.replace(/\s+/g, " ").match(
    /Total\s*Steelhead\s+Total\s*Coho\s+Total\s*Chinook\s+Total\s*Brown\s*Trout\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)/i,
  );
  const reportDate = reportDateToken ? slashDate(reportDateToken) : null;
  if (!reportDate || !totals) {
    return unavailable(
      input.source,
      input.species,
      "parser_changed",
      input.reportUrl,
    );
  }
  const index = input.species === "steelhead"
    ? 1
    : input.species === "coho_salmon"
    ? 2
    : input.species === "chinook_salmon"
    ? 3
    : 4;
  const total = countToken(totals[index]);
  if (total == null) {
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
    adultTotal: null,
    jackTotal: null,
    observedTotal: total,
    observedThrough: reportDate,
    reportDate,
    freshness: "fresh",
    categoriesIncluded: [
      "all fish identified to species at the South Bend ladder",
    ],
    sourceUrl: input.reportUrl,
  });
}

async function fetchWisconsinRootCount(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  const response = await fetchFn(source.sourceUrl, PROVIDER_REQUEST_INIT);
  const html = response.ok && response.text ? await response.text() : "";
  return parseWisconsinRootCount({ source, species, html });
}

export function parseWisconsinRootCount(input: {
  source: FishCountSourceConfig;
  species: RiverRunFishCountRead["species"];
  html: string;
}): RiverRunFishCountRead {
  const table = input.html.match(
    /<table[^>]*>[\s\S]*?Totals as of[\s\S]*?<\/table>/i,
  )?.[0];
  const reportDateToken = table?.match(/Totals as of\s*([^<]+)/i)?.[1]?.trim();
  const reportDate = reportDateToken
    ? longDate(decodeHtml(reportDateToken))
    : null;
  if (!table || !reportDate) {
    return unavailable(input.source, input.species, "parser_changed");
  }
  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
    [...row[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)]
      .map((cell) => htmlText(cell[1]))
  );
  const headers = rows.find((row) => row.includes("Chinook Salmon"));
  const totals = rows.find((row) => row[0] === "Total Captured");
  const label = input.species === "steelhead"
    ? "Rainbow Trout"
    : input.species === "coho_salmon"
    ? "Coho Salmon"
    : input.species === "chinook_salmon"
    ? "Chinook Salmon"
    : "Brown Trout";
  const column = headers?.indexOf(label) ?? -1;
  const total = column >= 0 ? countToken(totals?.[column]) : null;
  if (total == null) {
    return unavailable(input.source, input.species, "not_reported");
  }
  return baseRead(input.source, input.species, {
    status: "available",
    period: "season_to_date",
    adultTotal: null,
    jackTotal: null,
    observedTotal: total,
    observedThrough: reportDate,
    reportDate,
    freshness: "fresh",
    categoriesIncluded: [
      "total fish captured at the operated Steelhead Facility",
    ],
    sourceUrl: input.source.sourceUrl,
  });
}

async function fetchWisconsinBruleCount(
  source: FishCountSourceConfig,
  species: RiverRunFishCountRead["species"],
  fetchFn: RiverRunFetch,
): Promise<RiverRunFishCountRead> {
  const indexResponse = await fetchFn(source.sourceUrl, PROVIDER_REQUEST_INIT);
  const html = indexResponse.ok && indexResponse.text
    ? await indexResponse.text()
    : "";
  const report = latestWisconsinBruleFallReport(html, source.sourceUrl);
  if (!report) return unavailable(source, species, "parser_changed");
  const reportResponse = await fetchFn(report.url, PROVIDER_REQUEST_INIT);
  if (!reportResponse.ok || !reportResponse.arrayBuffer) {
    return unavailable(source, species, "provider_failed", report.url);
  }
  const text = await extractPdfVisualText(await reportResponse.arrayBuffer());
  return parseWisconsinBruleCount({
    source,
    species,
    text,
    reportUrl: report.url,
    seasonYear: report.seasonYear,
  });
}

export function latestWisconsinBruleFallReport(
  html: string,
  indexUrl: string,
): { url: string; seasonYear: number } | null {
  const reports = [...html.matchAll(
    /<a[^>]+href=["']([^"']+)["'][^>]*>\s*(\d{4})\s+Brule River fall fishway update\s*<\/a>/gi,
  )].map((match) => ({
    url: new URL(decodeHtml(match[1]), indexUrl).toString(),
    seasonYear: Number(match[2]),
  })).filter((report) => Number.isInteger(report.seasonYear));
  return reports.toSorted((a, b) => b.seasonYear - a.seasonYear)[0] ?? null;
}

export function parseWisconsinBruleCount(input: {
  source: FishCountSourceConfig;
  species: RiverRunFishCountRead["species"];
  text: string;
  reportUrl: string;
  seasonYear: number;
}): RiverRunFishCountRead {
  const totalsLine = input.text.split("\n").map((line) => line.trim()).find(
    (line) => /^(?:[\d,]+\s+){6}[\d,]+$/.test(line),
  );
  const values = totalsLine?.split(/\s+/).map(countToken) ?? [];
  const publicationToken = input.text.match(
    /([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/,
  )?.[1];
  const reportDate = publicationToken ? longDate(publicationToken) : null;
  if (
    values.length !== 7 || values.some((value) => value == null) || !reportDate
  ) {
    return unavailable(
      input.source,
      input.species,
      "parser_changed",
      input.reportUrl,
    );
  }
  const index = input.species === "lake_run_brown_trout"
    ? 0
    : input.species === "chinook_salmon"
    ? 1
    : input.species === "coho_salmon"
    ? 2
    : 3;
  return baseRead(input.source, input.species, {
    status: "available",
    period: "season_to_date",
    adultTotal: null,
    jackTotal: null,
    observedTotal: values[index]!,
    observedThrough: `${input.seasonYear}-11-30`,
    reportDate,
    freshness: "fresh",
    categoriesIncluded: [
      "fall fishway video observations identified to species",
    ],
    sourceUrl: input.reportUrl,
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

function slashDate(value: string): string | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  return `${match[3]}-${match[1].padStart(2, "0")}-${
    match[2].padStart(2, "0")
  }`;
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

function htmlText(value: string): string {
  return decodeHtml(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isCountSpecies(
  species: RiverRunSpecies,
): species is RiverRunFishCountRead["species"] {
  return [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "lake_run_brown_trout",
  ].includes(species);
}
