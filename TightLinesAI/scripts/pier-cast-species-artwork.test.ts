import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const contracts = readFileSync(
  resolve(root, "lib/pierCastContracts.ts"),
  "utf8",
);
const imagesModule = readFileSync(
  resolve(root, "lib/pierCastSpeciesImages.ts"),
  "utf8",
);
const presentation = readFileSync(
  resolve(root, "lib/pierCastConditionsPresentation.ts"),
  "utf8",
);
const conditionsUi = readFileSync(
  resolve(root, "components/pier-cast/PierCastConditionsUI.tsx"),
  "utf8",
);
const standingsUi = readFileSync(
  resolve(root, "components/pier-cast/PierCastStandings.tsx"),
  "utf8",
);

const speciesType = contracts.match(
  /export type PierCastSpeciesId =([\s\S]*?);\n\nexport type/,
);
assert(speciesType, "PierCastSpeciesId union was not found");
const speciesIds = [...speciesType[1].matchAll(/"([a-z_]+)"/g)].map(
  (match) => match[1],
);

function recordBody(name: string): string {
  const match = presentation.match(
    new RegExp(`const ${name}(?:\\s*:[^=]+)?\\s*=\\s*\\{([\\s\\S]*?)\\n\\} as const;`),
  );
  assert(match, `${name} record was not found`);
  return match[1];
}

function recordKeys(body: string): string[] {
  return [...body.matchAll(/^\s{2}([a-z_]+):/gm)].map((match) => match[1]);
}

test("every PierCast species has one transparent PNG and one conditions UI label", () => {
  assert.equal(speciesIds.length, 19);
  assert.equal(new Set(speciesIds).size, speciesIds.length);

  const imageEntries = [...imagesModule.matchAll(
    /^\s{2}([a-z_]+): require\("\.\.\/(assets\/images\/fish\/[^"\n]+\.png)"\),$/gm,
  )];
  assert.deepEqual(
    imageEntries.map((match) => match[1]).sort(),
    [...speciesIds].sort(),
  );
  assert.deepEqual(
    recordKeys(recordBody("PIER_CAST_SPECIES_LABELS")).sort(),
    [...speciesIds].sort(),
  );

  for (const [, speciesId, relativePath] of imageEntries) {
    const imagePath = resolve(root, relativePath);
    const bytes = readFileSync(imagePath);
    const stats = statSync(imagePath);
    assert.deepEqual(
      [...bytes.subarray(0, 8)],
      [137, 80, 78, 71, 13, 10, 26, 10],
      `${speciesId} is not a PNG`,
    );
    assert.equal(
      bytes.toString("ascii", 12, 16),
      "IHDR",
      `${speciesId} has no IHDR`,
    );
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    const colorType = bytes[25];
    assert(
      width >= 512 && width <= 4096,
      `${speciesId} width is unsafe: ${width}`,
    );
    assert(
      height >= 512 && height <= 4096,
      `${speciesId} height is unsafe: ${height}`,
    );
    assert(
      colorType === 4 || colorType === 6,
      `${speciesId} must have an alpha channel; PNG color type is ${colorType}`,
    );
    assert(
      stats.size <= 3 * 1024 * 1024,
      `${speciesId} exceeds the 3 MiB asset budget`,
    );
  }
});

test("new species assets and all conditions fish art stay normalized", () => {
  for (const speciesId of ["burbot", "white_perch", "white_bass", "bluegill"]) {
    const match = imagesModule.match(
      new RegExp(
        `${speciesId}: require\\("\\.\\./(assets/images/fish/[^"\\n]+)"\\)`,
      ),
    );
    assert(match, `${speciesId} image is not mapped`);
    const bytes = readFileSync(resolve(root, match[1]));
    assert.equal(bytes.readUInt32BE(16), 1254, `${speciesId} width drifted`);
    assert.equal(bytes.readUInt32BE(20), 1254, `${speciesId} height drifted`);
  }

  assert.match(conditionsUi, /resizeMode="contain"/);
  assert.match(conditionsUi, /function SpeciesFish/);
  assert.match(conditionsUi, /getPierCastSpeciesImage\(speciesId\)/);
});

test("species filters normalize different source aspect ratios", () => {
  assert.match(
    standingsUi,
    /<Fish speciesId=\{option\.speciesId\} width=\{86\} height=\{86\} \/>/,
  );
  assert.match(
    standingsUi,
    /tabFish: \{ width: 86, height: 40, overflow: "hidden"/,
  );
  assert.match(
    standingsUi,
    /<Fish speciesId=\{option\.speciesId\} width=\{48\} height=\{48\} \/>/,
  );
  assert.match(
    standingsUi,
    /tileFish: \{ width: 48, height: 32, overflow: "hidden"/,
  );
});

test("leaderboard and city report fish art is compact and never clipped", () => {
  const stripUi = readFileSync(
    resolve(root, "components/pier-cast/PierCastStatStrip.tsx"),
    "utf8",
  );
  assert.match(
    standingsUi,
    /<PierCastFishCrop speciesId=\{speciesId\} width=\{fishWidth\} height=\{34\} \/>/,
  );
  assert.match(standingsUi, /windowWidth < 360 \? 64 : 76/);
  assert.match(conditionsUi, /windowWidth < 360 \? 64 : 76/);
  assert.match(
    standingsUi,
    /<PierCastFishCrop speciesId=\{speciesId\} width=\{96\} height=\{46\} \/>/,
  );
  assert.match(
    conditionsUi,
    /<PierCastFishCrop speciesId=\{card\.speciesId\} width=\{fishWidth\} height=\{34\} \/>/,
  );
  // The crop fits each image's measured fish bounds instead of one fixed
  // ratio, so deep-bodied species such as drum are never cut off.
  assert.match(stripUi, /PIER_CAST_SPECIES_IMAGE_BOUNDS\[speciesId\]/);
  assert.match(stripUi, /Math\.min\(width \/ fishWidth, height \/ fishHeight\)/);
});

test("every PierCast species image has measured fish bounds inside the image", async () => {
  const { PIER_CAST_SPECIES_IMAGE_BOUNDS } = await import(
    "../lib/pierCastSpeciesImageBounds"
  );
  const speciesIds = [...imagesModule.matchAll(/^\s+(\w+): require\(/gm)].map((m) => m[1]);
  assert.ok(speciesIds.length >= 19);
  for (const speciesId of speciesIds) {
    const bounds = PIER_CAST_SPECIES_IMAGE_BOUNDS[speciesId as keyof typeof PIER_CAST_SPECIES_IMAGE_BOUNDS];
    assert.ok(bounds, speciesId);
    assert.ok(bounds.left >= 0 && bounds.top >= 0, speciesId);
    assert.ok(bounds.right <= bounds.imageWidth && bounds.bottom <= bounds.imageHeight, speciesId);
    assert.ok(bounds.right - bounds.left > 0 && bounds.bottom - bounds.top > 0, speciesId);
  }
});
