/**
 * Generate recommender species hero fish PNGs (same field-guide vibe as tackle images).
 *
 * Writes to `assets/images/fish/` with filenames expected by `lib/speciesImages.ts`:
 *   largemouth_bass.png, smallmouth_bass.png, pike_musky.png, river_trout.png
 *
 * One terminal paste (full path, replace key):
 *
 *   OPENAI_API_KEY='sk-YOUR_KEY' deno run -A "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/generate-recommender-species-fish-images.ts"
 *
 * Options (same spirit as generate-recommender-tackle-images.ts):
 *   --dry-run --skip-existing --id=<species_id> --limit=<n>
 *   --model=gpt-image-2 (default) | gpt-image-1.5 | …
 *   --quality=high --size=1024x1024 --delay-ms=1200
 *   --background=transparent   (use with --model=gpt-image-1.5; not supported on gpt-image-2)
 */

type SpeciesRow = {
  id: string;
  display_name: string;
  subject_line: string;
};

/** Must match `lib/speciesImages.ts` + RECOMMENDER_V3_UI_SPECIES. */
const SPECIES_FISH: readonly SpeciesRow[] = [
  {
    id: "largemouth_bass",
    display_name: "Largemouth Bass",
    subject_line:
      "Micropterus salmoides side profile: large terminal mouth with upper jaw extending past the eye when closed; two dorsal fins with a deep notch between spiny and soft portions; broad dark lateral band (often jagged) on olive-to-greenish back fading to pale belly; typical wild proportions—not an exaggerated cartoon bass.",
  },
  {
    id: "smallmouth_bass",
    display_name: "Smallmouth Bass",
    subject_line:
      "Micropterus dolomieu side profile: bronze-olive body with vertical dark bars on flanks; connected dorsal fin (no deep notch); smaller mouth with jaw not reaching past the eye; red-orange lower eye rim often visible; streamlined head—distinct from largemouth.",
  },
  {
    id: "pike_musky",
    display_name: "Northern Pike",
    subject_line:
      "Esox lucius side profile: long alligator-like snout, duck-bill jaws, and fully scaled cheeks; single dorsal set far back near tail; light bean-shaped markings on olive-green sides (chain pattern); forked tail—classic northern pike field-guide look.",
  },
  {
    id: "river_trout",
    display_name: "Trout",
    subject_line:
      "River trout (Salmo trutta–style) side profile: streamlined fusiform body; small adipose fin between dorsal and tail; small scales with dark spots and light halos on sides; slightly forked tail; subtle pink or butter tones optional but not rainbow-trout garish—readable as wild river trout.",
  },
];

const PROMPT_TEMPLATE = `Create a modern field-guide specimen illustration of {DISPLAY_NAME}, an accurate real freshwater game fish species. The style should be semi-realistic, tactile, and app-ready: crisp side-profile silhouette, subtle inked outline, soft natural shading, muted outdoor colors, and realistic scale and fin detail. It should feel like a premium illustrated plate from a vintage fishing field guide, adapted for a modern mobile app.

Centered single fish, transparent background, no text, no scene, no hands, no water, no tackle, no rod, no boat. The fish should fill about 82% of the square canvas and be fully visible. Accuracy matters: {SUBJECT_LINE}.

Avoid photorealistic ecommerce photography, cartoon clip art, childish mascot styling, invented or hybrid fantasy fish, glossy ad lighting, heavy shadows, extra objects, labels, logos, and over-saturated colors.`;

function buildPrompt(row: SpeciesRow): string {
  return PROMPT_TEMPLATE
    .replaceAll("{DISPLAY_NAME}", row.display_name)
    .replaceAll("{SUBJECT_LINE}", row.subject_line);
}

function outUrl(id: string): URL {
  return new URL(`../assets/images/fish/${id}.png`, import.meta.url);
}

type Cli = {
  dryRun: boolean;
  skipExisting: boolean;
  id: string | null;
  limit: number | null;
  model: string;
  quality: string;
  size: string;
  delayMs: number;
  background: "opaque" | "transparent" | "auto" | null;
};

function parseArgs(argv: string[]): Cli {
  const get = (prefix: string): string | null => {
    const hit = argv.find((a) => a.startsWith(prefix));
    if (!hit) return null;
    return hit.slice(prefix.length);
  };
  const dryRun = argv.includes("--dry-run");
  const skipExisting = argv.includes("--skip-existing");
  const id = get("--id=");
  const limitStr = get("--limit=");
  const limit = limitStr != null && limitStr !== "" ? Number(limitStr) : null;
  const bgRaw = get("--background=");
  const background =
    bgRaw === "opaque" || bgRaw === "transparent" || bgRaw === "auto"
      ? bgRaw
      : null;
  return {
    dryRun,
    skipExisting,
    id,
    limit: limit != null && Number.isFinite(limit) ? limit : null,
    model: get("--model=") ?? "gpt-image-2",
    quality: get("--quality=") ?? "high",
    size: get("--size=") ?? "1024x1024",
    delayMs: Math.max(0, Number(get("--delay-ms=") ?? "1200") || 1200),
    background,
  };
}

type GenResponse = {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: { message?: string; type?: string; code?: string };
};

async function generateImage(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Uint8Array> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as GenResponse;
  if (!res.ok) {
    const msg = json.error?.message ?? res.statusText;
    let hint = "";
    if (/billing|hard limit|quota|insufficient/i.test(msg)) {
      hint =
        " Billing/cap: https://platform.openai.com/settings/organization/billing";
    } else if (/must be verified|verify organization/i.test(msg)) {
      hint =
        " Org verification: https://platform.openai.com/settings/organization/general — or try --model=gpt-image-1.5";
    }
    throw new Error(`OpenAI images/generations ${res.status}: ${msg}${hint}`);
  }
  const first = json.data?.[0];
  if (!first) throw new Error("OpenAI response missing data[0]");
  if (first.b64_json) {
    return Uint8Array.from(atob(first.b64_json), (c) => c.charCodeAt(0));
  }
  if (first.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) throw new Error(`Failed to download image URL: ${imgRes.status}`);
    return new Uint8Array(await imgRes.arrayBuffer());
  }
  throw new Error("OpenAI response had neither b64_json nor url");
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const cli = parseArgs(Deno.args);
  const apiKeyRaw = Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!cli.dryRun && !apiKeyRaw) {
    console.error("Missing OPENAI_API_KEY (not required for --dry-run).");
    Deno.exit(1);
  }
  const apiKey = apiKeyRaw as string;

  if (cli.background === "transparent" && cli.model === "gpt-image-2") {
    console.error(
      "gpt-image-2 does not support background: transparent. Use --model=gpt-image-1.5 --background=transparent",
    );
    Deno.exit(1);
  }

  const rows = cli.id
    ? SPECIES_FISH.filter((r) => r.id === cli.id)
    : [...SPECIES_FISH];
  if (rows.length === 0) {
    console.error(cli.id ? `Unknown species id=${cli.id}` : "No jobs.");
    Deno.exit(1);
  }

  console.log(
    `\n→ images/generations model: ${cli.model}` +
      (cli.background ? `, background: ${cli.background}` : ""),
  );

  let done = 0;
  for (const row of rows) {
    if (cli.limit != null && done >= cli.limit) break;

    const dest = outUrl(row.id);
    if (cli.skipExisting) {
      try {
        await Deno.stat(dest);
        console.log(`SKIP (exists): ${row.id} → ${dest.pathname}`);
        continue;
      } catch {
        /* not exists */
      }
    }

    const prompt = buildPrompt(row);
    console.log(`\n── FISH ${row.id} ──`);
    console.log(prompt.slice(0, 200) + (prompt.length > 200 ? "…" : ""));

    if (cli.dryRun) {
      console.log(`[dry-run] would write: ${dest.pathname}`);
      done++;
      continue;
    }

    const body: Record<string, unknown> = {
      model: cli.model,
      prompt,
      n: 1,
      size: cli.size,
      quality: cli.quality,
    };
    if (cli.background != null) body.background = cli.background;

    let bytes: Uint8Array;
    let attempt = 0;
    for (;;) {
      try {
        bytes = await generateImage(apiKey, body);
        break;
      } catch (e) {
        attempt++;
        const msg = e instanceof Error ? e.message : String(e);
        const retryable = /429|503|502|timeout/i.test(msg) && attempt < 5;
        if (!retryable) throw e;
        const backoff = Math.min(30_000, 2000 * 2 ** attempt);
        console.warn(`Retry ${attempt} after error: ${msg} (sleep ${backoff}ms)`);
        await sleep(backoff);
      }
    }

    await Deno.writeFile(dest, bytes!);
    console.log(`Wrote ${dest.pathname} (${bytes!.byteLength} bytes)`);
    done++;
    if (cli.delayMs > 0 && done < rows.length) await sleep(cli.delayMs);
  }

  console.log(`\nDone. ${done} image(s). Paths are wired in lib/speciesImages.ts.`);
}

await main();
