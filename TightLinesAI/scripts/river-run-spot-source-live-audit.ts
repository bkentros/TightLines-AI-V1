import assert from "node:assert/strict";
import { RIVER_RUN_SPOT_FINDERS } from "../lib/riverRunSpotFinder";

const TRUSTED_SOURCE_HOSTS = new Set([
  "cms3.revize.com",
  "experience.arcgis.com",
  "miottawa.org",
  "s34427.pcdn.co",
  "swmichigan.org",
  "www.berriencounty.org",
  "www.dnr.state.mi.us",
  "www.eatoncounty.org",
  "www.fs.usda.gov",
  "www.grandrapidsmi.gov",
  "www.gtrlc.org",
  "www.michigan.gov",
  "www.michiganwatertrails.org",
  "www.nilesmi.org",
  "www.villageofberriensprings.com",
  "dnr.wisconsin.gov",
  "www.village.thiensville.wi.us",
  "www.villageofgraftonwi.gov",
  "www.auburnwa.gov",
  "www.cityofpuyallup.org",
  "www.puyallupwa.gov",
  "www.co.cowlitz.wa.us",
  "www.kentwa.gov",
  "www.mylongview.com",
  "www.mytpu.org",
  "wdfw.wa.gov",
  "dec.ny.gov",
  "www.monroecounty.gov",
  "www.orleanscountytourism.com",
  "www.in.gov",
  "cityofkewauneewi.gov",
  "www.visitkewauneecounty.com",
  "myodfw.com",
  "www.manitowoc.org",
  "manitowoccountywi.gov",
]);

const MOBILE_BROWSER_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";
const DEAD_PAGE_COPY =
  /page not found|resource cannot be found|404(?:\s|&nbsp;)+(?:error|not found)/i;

const spots = Object.values(RIVER_RUN_SPOT_FINDERS).flatMap((finder) =>
  finder.sections.flatMap((section) => section.spots)
);
const sourceUrls = [
  ...new Set([
    ...spots.map((spot) => spot.sourceUrl),
    ...Object.values(RIVER_RUN_SPOT_FINDERS).flatMap((finder) =>
      finder.safetyLink ? [finder.safetyLink.url] : []
    ),
  ]),
];

for (const spot of spots) {
  const source = new URL(spot.sourceUrl);
  assert.equal(source.protocol, "https:", `${spot.id} source must use HTTPS`);
  assert(
    TRUSTED_SOURCE_HOSTS.has(source.hostname),
    `${spot.id} uses an unapproved source host: ${source.hostname}`,
  );
  assert(
    spot.sourceLocator.trim().length >= 24,
    `${spot.id} must tell the customer where its source documents the access`,
  );
}

const checkSource = async (sourceUrl: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(sourceUrl, {
      headers: { "user-agent": MOBILE_BROWSER_USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
    });
    assert.equal(
      response.status,
      200,
      `${sourceUrl} returned HTTP ${response.status}`,
    );
    assert(
      TRUSTED_SOURCE_HOSTS.has(new URL(response.url).hostname),
      `${sourceUrl} redirected outside the approved source hosts to ${response.url}`,
    );

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      const body = await response.text();
      assert.doesNotMatch(
        body.slice(0, 350_000),
        DEAD_PAGE_COPY,
        `${sourceUrl} returned a page-not-found document with HTTP 200`,
      );
    } else {
      const body = new Uint8Array(await response.arrayBuffer());
      assert(
        body.byteLength > 1_000,
        `${sourceUrl} returned an empty document`,
      );
    }
  } finally {
    clearTimeout(timeout);
  }
};

const main = async () => {
  for (let index = 0; index < sourceUrls.length; index += 5) {
    await Promise.all(sourceUrls.slice(index, index + 5).map(checkSource));
  }

  console.log(
    `Spot Finder live source audit passed: ${spots.length} entries, ${sourceUrls.length} unique reputable URLs, zero HTTP or page-not-found failures.`,
  );
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
