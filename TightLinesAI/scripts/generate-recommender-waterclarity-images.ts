/**
 * Generate recommender water-clarity chip images (3 types) — field-guide vibe
 * consistent with tackle, species fish, and watertype scripts.
 *
 * Writes (must match `lib/waterclarityImages.ts`):
 *   assets/images/waterclarity/clear.png   ← WaterClarity "clear"
 *   assets/images/waterclarity/stained.png ← "stained"
 *   assets/images/waterclarity/murky.png   ← "dirty" (app label: Murky)
 *
 * Full-path one-liner:
 *   OPENAI_API_KEY='sk-YOUR_KEY' deno run -A "/Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/generate-recommender-waterclarity-images.ts"
 *
 * Flags: --dry-run --skip-existing --id=clear|stained|murky --model= --quality=
 *        --size= --delay-ms= --background=transparent (with gpt-image-1.5 only)
 */

type ClarityRow = {
  /** output basename without .png */
  id: "clear" | "stained" | "murky";
  display_name: string;
  subject_line: string;
};

const CLARITY_ROWS: readonly ClarityRow[] = [
  {
    id: "clear",
    display_name: "Clear water",
    subject_line:
      "High-visibility freshwater: reads as gin-clear—pale cool aqua to blue-green water column with subtle light rays or soft caustics, very gentle depth gradient. Instantly reads as 4+ ft visibility. No mud, no heavy tannin brown, no cartoon sparkles.",
  },
  {
    id: "stained",
    display_name: "Stained water",
    subject_line:
      "Moderate tint: tea-stain brown, weak coffee, or muted olive-green plankton haze—still translucent so you sense depth, but definitely not gin-clear. Typical stained bass water after rain or in tannin drainage. Not chocolate mud and not crystal blue.",
  },
  {
    id: "murky",
    display_name: "Murky water",
    subject_line:
      "Low-visibility freshwater: soft suspended sediment look—gray-green to tan opacity with very soft falloff so it reads as roughly 2 ft or less of visibility. Muddy or blown-out, but still a designed plate (not a gross photo). No distinct bottom detail at distance.",
  },
];

const PROMPT_TEMPLATE = `Create a modern field-guide specimen illustration of {DISPLAY_NAME}, as an abstract water-clarity swatch for a fishing app chip. The style should be semi-realistic, tactile, and app-ready: soft gradients and suspended-light feeling, subtle inked edge treatment if any silhouette exists, muted natural colors. It should feel like a premium illustrated plate from a vintage fishing field guide, adapted for a modern mobile app.

Centered square composition, transparent background, no text, no labels, no hands, no tackle, no fish as hero, no shoreline landscape as the main read—this is primarily a **water column clarity** impression (you may use a very subtle narrow tank or cylinder suggestion, but keep it minimal). Fill about 82% of the canvas. Accuracy matters: {SUBJECT_LINE}.

Avoid photorealistic stock photography, cartoon clip art, childish mascot styling, fantasy liquids, glossy ad lighting, heavy vignettes, logos, and over-saturated neon colors.`;

function buildPrompt(row: ClarityRow): string {
  return PROMPT_TEMPLATE
    .replaceAll("{DISPLAY_NAME}", row.display_name)
    .replaceAll("{SUBJECT_LINE}", row.subject_line);
}

function outUrl(id: string): URL {
  return new URL(`../assets/images/waterclarity/${id}.png`, import.meta.url);
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
    ? CLARITY_ROWS.filter((r) => r.id === cli.id)
    : [...CLARITY_ROWS];
  if (rows.length === 0) {
    console.error(
      cli.id
        ? `Unknown clarity id=${cli.id} (use clear, stained, or murky)`
        : "No jobs.",
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
    console.log(`\n── CLARITY ${row.id} ──`);
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

  console.log(
    `\nDone. ${done} image(s). dirty → murky.png in lib/waterclarityImages.ts.`,
  );
}

await main();
