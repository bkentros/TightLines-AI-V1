import { assertEquals } from "jsr:@std/assert";
import {
  BOIS_BRULE_RIVER_PROFILE,
  COWLITZ_RIVER_PROFILE,
  fetchRiverRunFishCount,
  fetchRiverRunFishCountReport,
  fishCountReadFromReport,
  GREEN_RIVER_PROFILE,
  indianaDnrTableauPdfUrl,
  latestWdfwReport,
  latestWisconsinBruleFallReport,
  parseIndianaDnrLadderCount,
  parseTacomaPowerCount,
  parseWdfwFacilityCount,
  parseWisconsinBruleCount,
  parseWisconsinRootCount,
  PUYALLUP_RIVER_PROFILE,
  resolveFishCountFreshness,
  ROOT_RIVER_PROFILE,
  ST_JOSEPH_RIVER_PROFILE,
} from "../index.ts";

Deno.test("WDFW count reader bypasses caches whenever a report is requested", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  await fetchRiverRunFishCount({
    river: GREEN_RIVER_PROFILE,
    species: "chinook_salmon",
    fetchFn: async (input, init) => {
      const url = String(input);
      requests.push({ url, init });
      if (url.includes("weekly-escapement")) {
        return {
          ok: false,
          json: async () => ({}),
          arrayBuffer: async () => new ArrayBuffer(0),
        };
      }
      return {
        ok: true,
        json: async () => ({}),
        text: async () =>
          '<a href="/sites/default/files/2026-08/weekly-escapement-08-27-2026.pdf">current</a>',
      };
    },
    now: new Date("2026-08-31T12:00:00Z"),
  });
  assertEquals(requests.length, 2);
  assertEquals(requests.map((request) => request.init?.cache), [
    "no-store",
    "no-store",
  ]);
  assertEquals(
    requests.map((request) =>
      (request.init?.headers as Record<string, string>)["Cache-Control"]
    ),
    ["no-cache", "no-cache"],
  );
});

Deno.test("WDFW weekly index resolves the newest dated report", () => {
  assertEquals(
    latestWdfwReport(`
    <a href="/sites/default/files/2026-08/weekly-escapement-08-20-2026.pdf">old</a>
    <a href="/sites/default/files/2026-08/weekly-escapement-08-27-2026.pdf">new</a>
    <a href="/sites/default/files/2025-11/weekly-escapement-11-26-2025.pdf">older year</a>
  `),
    {
      url:
        "https://wdfw.wa.gov/sites/default/files/2026-08/weekly-escapement-08-27-2026.pdf",
      reportDate: "2026-08-27",
    },
  );
});

Deno.test("WDFW parser aggregates facility origin rows without dispositions", () => {
  const source = GREEN_RIVER_PROFILE.fishCountSources![0];
  const read = parseWdfwFacilityCount({
    source,
    species: "chinook_salmon",
    reportDate: "2026-09-11",
    reportUrl: "https://wdfw.wa.gov/example.pdf",
    pageTexts: [
      "Adult Total Fall Chinook Jack Total Surplus On Hand Jacks " +
      "SOOS CREEK HATCHERY Big Soos Creek- H - - - - - - 09/04/26 820 75 - 800 70 " +
      "SOOS CREEK HATCHERY Big Soos Creek- W - - - - - - 09/05/26 205 50 - 190 40 " +
      "VOIGHTS CR HATCHERY Puyallup River- H - - - - - - 09/05/26 350 25 - 300 20 Thursday, September 10, 2026",
    ],
  });
  assertEquals(read.status, "available");
  assertEquals(read.adultTotal, 1025);
  assertEquals(read.jackTotal, 125);
  assertEquals(read.observedTotal, 1150);
  assertEquals(read.observedThrough, "2026-09-05");
});

Deno.test("WDFW parser honors provider label aliases", () => {
  const source = PUYALLUP_RIVER_PROFILE.fishCountSources![0];
  const read = parseWdfwFacilityCount({
    source,
    species: "chinook_salmon",
    reportDate: "2026-08-27",
    reportUrl: "https://wdfw.wa.gov/example.pdf",
    pageTexts: [
      "Adult Total Fall Chinook Jack Total Surplus On Hand Jacks " +
      "VOIGHTS CR HATCHERY Puyallup River- H - - - - 6 - 08/23/26 196 10 - 190 10 " +
      "GARRISON HATCHERY Garrison Springs- H - - - - - - 08/23/26 50 2 - 48 2 Wednesday, August 26, 2026",
    ],
  });
  assertEquals(read.observedTotal, 206);
});

Deno.test("Tacoma Power parser counts recoveries but ignores transported/recycled fish", () => {
  const source = COWLITZ_RIVER_PROFILE.fishCountSources![0];
  const html = `
    <p><strong>Cowlitz Fish Report</strong></p><p>August 24, 2026</p>
    <p>Last week, Tacoma Power employees recovered one Coho jack, 17 Fall Chinook adults,
    three Fall Chinook jacks over five days of operations at the Cowlitz Salmon Hatchery separator.</p>
    <p>Tacoma Power employees released 15 Fall Chinook adults and three Fall Chinook jacks into the Tilton River.</p>
    <p>Tacoma Power recycled 1,821 Summer-run Steelhead.</p>`;
  const chinook = parseTacomaPowerCount({
    source,
    species: "chinook_salmon",
    html,
  });
  const coho = parseTacomaPowerCount({ source, species: "coho_salmon", html });
  assertEquals(chinook.observedTotal, 20);
  assertEquals(chinook.operatingDays, 5);
  assertEquals(chinook.reportDate, "2026-08-24");
  assertEquals(coho.adultTotal, 0);
  assertEquals(coho.jackTotal, 1);
});

Deno.test("one source fetch produces the complete multi-species report", async () => {
  const source = COWLITZ_RIVER_PROFILE.fishCountSources![0];
  let requests = 0;
  const report = await fetchRiverRunFishCountReport({
    source,
    fetchFn: async () => {
      requests++;
      return {
        ok: true,
        json: async () => ({}),
        text: async () =>
          "<p><strong>Cowlitz Fish Report</strong></p><p>August 24, 2026</p>" +
          "<p>Last week, Tacoma Power employees recovered two Coho adults, " +
          "17 Fall Chinook adults and three Fall Chinook jacks over five days " +
          "of operations at the Cowlitz Salmon Hatchery separator.</p>",
      };
    },
    now: new Date("2026-08-31T12:00:00Z"),
  });
  assertEquals(requests, 1);
  assertEquals(report.fetchStatus, "success");
  assertEquals(report.reads.chinook_salmon?.observedTotal, 20);
  assertEquals(report.reads.coho_salmon?.observedTotal, 2);
});

Deno.test("a failed refresh marks a preserved report stale", () => {
  const source = COWLITZ_RIVER_PROFILE.fishCountSources![0];
  const parsed = parseTacomaPowerCount({
    source,
    species: "chinook_salmon",
    html: "<p><strong>Cowlitz Fish Report</strong></p><p>August 30, 2026</p>" +
      "<p>Last week, Tacoma Power employees recovered 17 Fall Chinook adults " +
      "and three Fall Chinook jacks over five days of operations at the " +
      "Cowlitz Salmon Hatchery separator.</p>",
  });
  const read = fishCountReadFromReport(
    {
      sourceId: source.sourceId,
      provider: source.provider,
      fetchedAt: "2026-08-31T12:00:00Z",
      reportIdentity: "preserved",
      fetchStatus: "failed",
      failureReason: "provider_failed",
      reads: { chinook_salmon: parsed },
      dataVersion: "test-v1",
    },
    source,
    "chinook_salmon",
    new Date("2026-08-31T12:00:00Z"),
  );
  assertEquals(read.status, "stale");
  assertEquals(read.freshness, "stale");
  assertEquals(read.observedTotal, 20);
});

Deno.test("Indiana DNR ladder parser reads the forced-refresh Tableau species totals", () => {
  const source = ST_JOSEPH_RIVER_PROFILE.fishCountSources![0];
  const html =
    "<tableau-viz src='https://datavizpublic.in.gov/views/LakeMichiganFishLadder/Home/session/ignored'></tableau-viz>";
  const reportUrl = indianaDnrTableauPdfUrl(html)!;
  assertEquals(
    reportUrl,
    "https://datavizpublic.in.gov/views/LakeMichiganFishLadder/Home.pdf?:showVizHome=no&:refresh=yes",
  );
  const text = `
    LAST UPDATED: 8/31/2026
    Total Steelhead Total Coho Total Chinook Total Brown Trout
    4,001 205 810 12
  `;
  const chinook = parseIndianaDnrLadderCount({
    source,
    species: "chinook_salmon",
    text,
    reportUrl,
  });
  assertEquals(chinook.observedTotal, 810);
  assertEquals(chinook.observedThrough, "2026-08-31");
  assertEquals(chinook.adultTotal, null);
  assertEquals(chinook.jackTotal, null);
});

Deno.test("Wisconsin DNR Root parser uses Total Captured without double-counting dispositions", () => {
  const source = ROOT_RIVER_PROFILE.fishCountSources![0];
  const html = `
    <table><thead>
      <tr><th colspan="6">Totals as of October 20, 2026</th></tr>
      <tr><th></th><th>Rainbow Trout</th><th>Chinook Salmon</th><th>Coho Salmon</th><th>Brown Trout</th><th>Pink Salmon</th></tr>
    </thead><tbody>
      <tr><td>Total Captured</td><td>301</td><td>1,250</td><td>620</td><td>88</td><td>2</td></tr>
      <tr><td>Passed Upstream</td><td>250</td><td>0</td><td>500</td><td>70</td><td>0</td></tr>
      <tr><td>Spawned at Facility</td><td>175</td><td>900</td><td>300</td><td>40</td><td>0</td></tr>
    </tbody></table>`;
  const coho = parseWisconsinRootCount({
    source,
    species: "coho_salmon",
    html,
  });
  const brown = parseWisconsinRootCount({
    source,
    species: "lake_run_brown_trout",
    html,
  });
  assertEquals(coho.observedTotal, 620);
  assertEquals(brown.observedTotal, 88);
  assertEquals(coho.reportDate, "2026-10-20");
});

Deno.test("Wisconsin DNR Brule parser selects the newest final fall report and fixed summary row", () => {
  const source = BOIS_BRULE_RIVER_PROFILE.fishCountSources![0];
  const report = latestWisconsinBruleFallReport(
    `<a href="/2024.pdf">2024 Brule River fall fishway update</a>
     <a href="/2025.pdf">2025 Brule River fall fishway update</a>`,
    source.sourceUrl,
  );
  assertEquals(report, {
    url: "https://dnr.wisconsin.gov/2025.pdf",
    seasonYear: 2025,
  });
  const text = `
    2025 Bois Brule River Fall Fishway Update
    Brown Chinook Coho Fall Run Brook Pink
    Splake
    Trout Salmon Salmon Steelhead Trout Salmon
    3143 612 2090 4497 4 100 5
    DNR – Lake Superior Fisheries Team - Superior Office March 2, 2026
  `;
  const steelhead = parseWisconsinBruleCount({
    source,
    species: "steelhead",
    text,
    reportUrl: report!.url,
    seasonYear: report!.seasonYear,
  });
  const brown = parseWisconsinBruleCount({
    source,
    species: "lake_run_brown_trout",
    text,
    reportUrl: report!.url,
    seasonYear: report!.seasonYear,
  });
  assertEquals(steelhead.observedTotal, 4497);
  assertEquals(brown.observedTotal, 3143);
  assertEquals(steelhead.observedThrough, "2025-11-30");
  assertEquals(steelhead.reportDate, "2026-03-02");
});

Deno.test("every official count provider request bypasses app and intermediary caches", async () => {
  for (
    const [river, species] of [
      [ST_JOSEPH_RIVER_PROFILE, "chinook_salmon"],
      [ROOT_RIVER_PROFILE, "coho_salmon"],
      [BOIS_BRULE_RIVER_PROFILE, "steelhead"],
    ] as const
  ) {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    await fetchRiverRunFishCount({
      river,
      species,
      fetchFn: async (input, init) => {
        const url = String(input);
        requests.push({ url, init });
        if (river.riverId === "st_joseph" && requests.length === 1) {
          return {
            ok: true,
            json: async () => ({}),
            text: async () =>
              "<tableau-viz src='https://datavizpublic.in.gov/views/LakeMichiganFishLadder/Home/session'></tableau-viz>",
          };
        }
        if (river.riverId === "bois_brule" && requests.length === 1) {
          return {
            ok: true,
            json: async () => ({}),
            text: async () =>
              '<a href="/fall.pdf">2025 Brule River fall fishway update</a>',
          };
        }
        return {
          ok: false,
          json: async () => ({}),
          text: async () => "",
          arrayBuffer: async () => new ArrayBuffer(0),
        };
      },
      now: new Date("2026-08-31T12:00:00Z"),
    });
    assertEquals(
      requests.every((request) => request.init?.cache === "no-store"),
      true,
    );
    assertEquals(
      requests.every((request) =>
        (request.init?.headers as Record<string, string>)["Cache-Control"] ===
          "no-cache"
      ),
      true,
    );
  }
});

Deno.test("Fish Counts freshness is explicit and does not preserve an old number as current", () => {
  const source = COWLITZ_RIVER_PROFILE.fishCountSources![0];
  const parsed = parseTacomaPowerCount({
    source,
    species: "chinook_salmon",
    html:
      "<p><strong>Cowlitz Fish Report</strong></p><p>August 24, 2026</p><p>Last week, Tacoma Power employees recovered 17 Fall Chinook adults and three Fall Chinook jacks over five days of operations at the Cowlitz Salmon Hatchery separator.</p>",
  });
  const fresh = resolveFishCountFreshness(
    parsed,
    source,
    new Date("2026-08-30T12:00:00Z"),
  );
  const stale = resolveFishCountFreshness(
    parsed,
    source,
    new Date("2026-09-05T12:00:00Z"),
  );
  assertEquals(fresh.status, "available");
  assertEquals(fresh.freshness, "fresh");
  assertEquals(stale.status, "stale");
  assertEquals(stale.freshness, "stale");
  assertEquals(stale.observedTotal, 20);
});
