const WATER_YEARS = [1982, 1983, 1984, 1986] as const;
const SITE_ID = "12113000";
const MIN_YEARS_PER_DATE = 2;
const WINDOW_RADIUS_DAYS = 3;
const PDF_DIRECTORY = Deno.args.find((argument) =>
  argument.startsWith("--pdf-dir=")
)?.slice("--pdf-dir=".length);
const MONTHS = [
  ["OCTOBER", "NOVEMBER", "DECEMBER", "JANUARY"],
  ["FEBRUARY", "MARCH", "APRIL", "MAY"],
  ["JUNE", "JULY", "AUGUST", "SEPTEMBER"],
] as const;
const MONTH_NUMBER: Record<string, number> = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
};

type DailyMean = {
  localDate: string;
  year: number;
  monthDay: string;
  meanC: number;
  sourceUrl: string;
};

const pdfjs = await import("npm:pdfjs-dist@4.10.38/legacy/build/pdf.mjs");
const dailyMeans: DailyMean[] = [];
const reportCoverage: Array<{
  waterYear: number;
  sourceUrl: string;
  parsedFallDays: number;
}> = [];

for (const waterYear of WATER_YEARS) {
  const shortYear = String(waterYear).slice(2);
  const sourceUrl =
    `https://pubs.usgs.gov/wdr/${waterYear}/wa-${shortYear}-1/report.pdf`;
  const reportBytes = PDF_DIRECTORY
    ? await Deno.readFile(`${PDF_DIRECTORY}/green-usgs-${waterYear}.pdf`)
    : await fetchReport(sourceUrl, waterYear);
  const document = await pdfjs.getDocument({
    data: reportBytes,
    disableWorker: true,
  } as never).promise;
  const stationPages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => "str" in item ? item.str : "")
      .join(" ").replace(/\s+/g, " ").trim();
    if (
      text.includes(SITE_ID) &&
      (/TEMPERATURE, WATER/.test(text) || /WATER TEMPERATURES/.test(text))
    ) {
      stationPages.push(text);
    }
  }
  if (!stationPages.length) {
    throw new Error(
      `USGS water year ${waterYear} has no ${SITE_ID} temperature pages.`,
    );
  }
  const parsed = parseStationTables(
    stationPages.join(" "),
    waterYear,
    sourceUrl,
  )
    .filter((day) => Number(day.monthDay.slice(0, 2)) >= 7);
  dailyMeans.push(...parsed);
  reportCoverage.push({
    waterYear,
    sourceUrl,
    parsedFallDays: parsed.length,
  });
}

async function fetchReport(sourceUrl: string, waterYear: number) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`USGS water year ${waterYear} failed: ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

const uniqueDailyMeans = [...new Map(
  dailyMeans.map((day) => [day.localDate, day]),
).values()].toSorted((left, right) =>
  left.localDate.localeCompare(right.localDate)
);
const normals = Object.fromEntries(
  calendarMonthDays("07-01", "12-31").flatMap((monthDay) => {
    const target = monthDayIndex(monthDay);
    const days = uniqueDailyMeans.filter((day) =>
      Math.abs(monthDayIndex(day.monthDay) - target) <=
        WINDOW_RADIUS_DAYS * 86_400_000
    );
    const years = [...new Set(days.map((day) => day.year))].toSorted();
    if (years.length < MIN_YEARS_PER_DATE) return [];
    const valuesF = days.map((day) => celsiusToFahrenheit(day.meanC));
    return [[monthDay, {
      averageF: round(mean(valuesF), 1),
      p10F: round(percentile(valuesF, .1), 1),
      p25F: round(percentile(valuesF, .25), 1),
      medianF: round(percentile(valuesF, .5), 1),
      p75F: round(percentile(valuesF, .75), 1),
      p90F: round(percentile(valuesF, .9), 1),
      historicalYears: years.length,
      sampleCount: days.length,
      years,
    }]];
  }),
);

const expectedFallDays = WATER_YEARS.length * 184;
const report = {
  siteId: SITE_ID,
  sourceName: "Green River near Auburn, WA",
  recordYearsUsed:
    "1981-1986 (water years 1982, 1983, 1984, and 1986; missing dates are not imputed)",
  method:
    `USGS annual water-data reports for station ${SITE_ID}. Exact published daily means are parsed for July-December, then pooled inside the same calendar date ±${WINDOW_RADIUS_DAYS} days. No missing or malformed day is imputed, and each displayed normal requires observations from at least ${MIN_YEARS_PER_DATE} qualifying calendar years. This is archival context only, never a current water temperature.`,
  reportCoverage,
  qualifyingDailyMeans: uniqueDailyMeans.length,
  expectedFallDays,
  dailyCoveragePercent: round(
    uniqueDailyMeans.length / expectedFallDays * 100,
    2,
  ),
  calendarWindowNormals: Object.keys(normals).length,
  expectedCalendarDates: 184,
  calendarDateCoveragePercent: round(
    Object.keys(normals).length / 184 * 100,
    2,
  ),
  normals,
};

if (Deno.args.includes("--write")) {
  await Deno.mkdir("docs/audits", { recursive: true });
  await Deno.writeTextFile(
    "docs/audits/river-run-green-historical-water-temperature.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  await Deno.writeTextFile(
    "supabase/functions/_shared/riverRunEngine/config/onboarding/greenHistoricalTemperature.generated.ts",
    `// Generated by scripts/river-run-green-temperature-baseline.ts.\n` +
      `// Calendar-date ±${WINDOW_RADIUS_DAYS}-day archival context only; never a current measured reading.\n` +
      `export const GREEN_HISTORICAL_WATER_TEMPERATURE_NORMALS = ${
        JSON.stringify(normals, null, 2)
      } as const;\n`,
  );
}

console.log(JSON.stringify(
  {
    ...report,
    normals: undefined,
    examples: Object.fromEntries(
      [
        "07-20",
        "08-01",
        "08-15",
        "09-01",
        "09-15",
        "10-01",
        "10-15",
        "11-01",
        "11-15",
        "12-01",
        "12-15",
      ]
        .flatMap((monthDay) =>
          normals[monthDay] ? [[monthDay, normals[monthDay]]] : []
        ),
    ),
  },
  null,
  2,
));

function parseStationTables(
  text: string,
  waterYear: number,
  sourceUrl: string,
): DailyMean[] {
  return MONTHS.flatMap((months) => {
    const heading = months.join(" ");
    const start = text.indexOf(heading);
    if (start < 0) return [];
    const end = text.indexOf(" MONTH", start);
    if (end < 0) return [];
    const header = text.slice(Math.max(0, start - 160), start);
    if (!/MEAN/.test(header)) return [];
    const body = text.slice(start + heading.length, end);
    return parseFourMonthRows(body, months, waterYear, sourceUrl);
  });
}

function calendarMonthDays(start: string, end: string): string[] {
  const values: string[] = [];
  for (
    let time = monthDayIndex(start);
    time <= monthDayIndex(end);
    time += 86_400_000
  ) {
    values.push(new Date(time).toISOString().slice(5, 10));
  }
  return values;
}

function monthDayIndex(monthDay: string): number {
  return Date.parse(`2000-${monthDay}T00:00:00Z`);
}

function parseFourMonthRows(
  body: string,
  months: readonly string[],
  waterYear: number,
  sourceUrl: string,
): DailyMean[] {
  const token = String.raw`(?:---|-?\d+(?:\.\d+)?)`;
  const rows = new RegExp(
    String
      .raw`(?:^|\s)(\d{1,2})\s+((?:${token}\s+){11}${token})(?=\s+(?:\d{1,2}\s|MONTH|$))`,
    "g",
  );
  const parsed: DailyMean[] = [];
  for (const row of body.matchAll(rows)) {
    const day = Number(row[1]);
    const values = row[2].trim().split(/\s+/);
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
      const month = MONTH_NUMBER[months[monthIndex]];
      const meanC = Number(values[monthIndex * 3 + 2]);
      const year = month >= 10 ? waterYear - 1 : waterYear;
      if (
        !Number.isInteger(day) ||
        day < 1 ||
        day > new Date(Date.UTC(year, month, 0)).getUTCDate() ||
        !Number.isFinite(meanC) ||
        meanC < -2 ||
        meanC > 30
      ) continue;
      const monthDay = `${String(month).padStart(2, "0")}-${
        String(day).padStart(2, "0")
      }`;
      parsed.push({
        localDate: `${year}-${monthDay}`,
        year,
        monthDay,
        meanC,
        sourceUrl,
      });
    }
  }
  return parsed;
}

function celsiusToFahrenheit(value: number) {
  return value * 9 / 5 + 32;
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values: number[], p: number) {
  const sorted = values.toSorted((left, right) => left - right);
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  return lower === upper
    ? sorted[lower]
    : sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
