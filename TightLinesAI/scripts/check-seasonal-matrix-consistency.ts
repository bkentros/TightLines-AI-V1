/**
 * §17.4 — Regenerate v4 seasonal TS from `data/seasonal-matrix/*.csv` and diff committed output.
 *
 * Validates the **CSV → generated TypeScript** pipeline only. It does not prove parity with
 * legacy v3 embedded seasonal tables used by the live edge recommender.
 */
const ROOT = "supabase/functions/_shared/recommenderEngine/v4/seasonal/generated";
const SPECIES_FILES = [
  "largemouth_bass.ts",
  "smallmouth_bass.ts",
  "northern_pike.ts",
  "trout.ts",
];

async function main() {
  const tmp = await Deno.makeTempDir({ prefix: "seasonal-v4-" });

  const gen = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "scripts/generate-seasonal-rows-v4.ts",
      "--out-dir",
      tmp,
    ],
    cwd: Deno.cwd(),
    stdout: "piped",
    stderr: "piped",
  });
  const out = await gen.output();
  // Generator writes warnings to stderr; exit 0 means no G1 errors
  if (!out.success) {
    console.error(new TextDecoder().decode(out.stderr));
    Deno.exit(out.code);
  }

  let diff = false;
  for (const f of SPECIES_FILES) {
    const committed = `${ROOT}/${f}`;
    const genPath = `${tmp}/${f}`;
    const a = await Deno.readTextFile(committed);
    const b = await Deno.readTextFile(genPath);
    if (a !== b) {
      console.error(`Mismatch: ${f} (regenerate with npm run gen:seasonal-rows-v4)`);
      diff = true;
    }
  }

  if (diff) Deno.exit(1);
  console.error("check:seasonal-matrix — OK (generated matches CSV)");
}

main();
