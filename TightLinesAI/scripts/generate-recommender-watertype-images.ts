/**
 * Generate recommender water-type chip images (lake/pond vs river) — same field-guide
 * vibe as tackle + species fish scripts.
 *
 * Writes:
 *   assets/images/watertype/lake.png   ← freshwater_lake_pond
 *   assets/images/watertype/river.png  ← freshwater_river
 *
 * Wired by `lib/watertypeImages.ts` (no TS change needed after generation).
 *
 * Full-path one-liner (replace key):
 *   OPENAI_API_KEY='sk-YOUR_KEY' deno run -A "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/generate-recommender-watertype-images.ts"
 *
 * Flags: --dry-run --skip-existing --id=lake|river --model= --quality= --size= --delay-ms=
 *        --background=transparent  (use with --model=gpt-image-1.5; not on gpt-image-2)
 */

type WatertypeRow = {
  /** basename without .png */
  id: "lake" | "river";
  display_name: string;
  subject_line: string;
};

const WATERTYPE_ROWS: readonly WatertypeRow[] = [
  {
    id: "lake",
    display_name: "Lake / Pond",
    subject_line:
      "Iconic calm freshwater: broad horizontal sheet of still water with a very soft far tree line or low hills; optional subtle lily pads or cattail silhouettes at one margin. Reads immediately as lake or pond—peaceful, enclosed basin feeling. No boats, docks, people, buildings, text, or dramatic sky.",
  },
  {
    id: "river",
    display_name: "River / Stream",
    subject_line:
      "Iconic moving water: gentle S-curve or diagonal flow with readable current lines; smooth rounded river stones along one bank margin; sense of depth and direction without a full landscape. Reads immediately as river or stream—not a lake pan. No bridges, people, boats, text, or whitewater chaos.",
  },
];

const PROMPT_TEMPLATE = `Create a modern field-guide specimen illustration of {DISPLAY_NAME}, as a compact symbolic freshwater scene for a fishing app water-type chip. The style should be semi-realistic, tactile, and app-ready: crisp readable silhouette, subtle inked outline, soft natural shading, muted outdoor colors, and believable water surface treatment. It should feel like a premium illustrated plate from a vintage fishing field guide, adapted for a modern mobile app.

Centered composition, transparent background, no text, no labels, no hands, no fishing tackle, no fish as the hero subject (tiny distant silhouettes OK if nearly invisible). The motif should fill about 82% of the square canvas. Accuracy matters: {SUBJECT_LINE}.

Avoid photorealistic stock photography, cartoon clip art, childish mascot styling, fantasy biomes, glossy ad lighting, heavy shadows, extra props, logos, and over-saturated colors.`;

function buildPrompt(row: WatertypeRow): string {
  return PROMPT_TEMPLATE
    .replaceAll("{DISPLAY_NAME}", row.display_name)
    .replaceAll("{SUBJECT_LINE}", row.subject_line);
}

function outUrl(id: string): URL {
  return new URL(`../assets/images/watertype/${id}.png`, import.meta.url);
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
    throw new Error(`OpenAI images/generations ${res.status}: ${msg}`);
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
    ? WATERTYPE_ROWS.filter((r) => r.id === cli.id)
    : [...WATERTYPE_ROWS];
  if (rows.length === 0) {
    console.error(
      cli.id ? `Unknown watertype id=${cli.id} (use lake or river)` : "No jobs.",
    );
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
    console.log(`\n── WATERTYPE ${row.id} ──`);
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

  console.log(`\nDone. ${done} image(s). See lib/watertypeImages.ts.`);
}

await main();
