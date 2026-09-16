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
const reviewScreen = readFileSync(
  resolve(root, "app/pier-cast-review.tsx"),
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
  const match = reviewScreen.match(
    new RegExp(`const ${name}:[\\s\\S]*?= \\{([\\s\\S]*?)\\n\\};`),
  );
  assert(match, `${name} record was not found`);
  return match[1];
}

function recordKeys(body: string): string[] {
  return [...body.matchAll(/^\s{2}([a-z_]+):/gm)].map((match) => match[1]);
}

test("every PierCast species has one transparent PNG and one UI label/scale", () => {
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
    recordKeys(recordBody("SPECIES_LABELS")).sort(),
    [...speciesIds].sort(),
  );
  assert.deepEqual(
    recordKeys(recordBody("FISH_SCALE")).sort(),
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

test("new species assets and the Atlantic Salmon size correction stay normalized", () => {
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

  const scales = recordBody("FISH_SCALE");
  const atlanticScale = Number(
    scales.match(/^\s{2}atlantic_salmon:\s*([\d.]+),$/m)?.[1],
  );
  assert(Number.isFinite(atlanticScale));
  assert(
    atlanticScale <= 1.1,
    `Atlantic Salmon card scale regressed above 1.10: ${atlanticScale}`,
  );
});
