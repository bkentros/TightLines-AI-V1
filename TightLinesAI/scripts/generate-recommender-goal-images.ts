/**
 * Generate recommender goal chip images — **lure metaphors** (not fish):
 *   all_purpose → classic versatile crankbait (cover water, everyday game plan)
 *   big_fish    → oversized glide-style hard swimbait (PB / trophy mindset)
 *
 * Field-guide / tackle-plate vibe consistent with watertype, clarity, tackle scripts.
 *
 * Writes:
 *   assets/images/recommendation_goal/all_purpose.png
 *   assets/images/recommendation_goal/big_fish.png
 *
 * Wire in app: `lib/recommendationGoalImages.ts` + `RecommendationGoal`.
 *
 * Flags: --dry-run --skip-existing --id=all_purpose|big_fish --model= --quality= --size=
 *        --delay-ms= --background=transparent (use with --model=gpt-image-1.5; not on gpt-image-2)
 */

type GoalRow = {
  id: "all_purpose" | "big_fish";
  display_name: string;
  subject_line: string;
};

const GOAL_ROWS: readonly GoalRow[] = [
  {
    id: "all_purpose",
    display_name: "All-around fishing goal (crankbait metaphor)",
    subject_line:
      "Exactly **one** lure on the canvas: a classic **shallow or mid-depth square-bill / rounded-body crankbait** in side profile or slight three-quarter—short squared lip, chunky body, two treble hooks implied. Reads as **versatile reaction fishing**: cover water, change cadence, everyday dependable. **Forbidden on this plate:** glide baits, jointed swimbaits, giant magnum profiles, soft plastics, spinnerbaits, topwater, more than one lure, any fish, frogs, people, rods, line, nets, boats, or water scenery.",
  },
  {
    id: "big_fish",
    display_name: "Big-fish / PB goal (glide-bait metaphor)",
    subject_line:
      "Exactly **one** lure on the canvas: an **oversized hard-body glide bait or large jointed hard swimbait**—long silhouette, lazy S-glide read, deliberately **bigger and more imposing** than an everyday crankbait, premium big-fish offering. Reads as **trophy hunting / PB mindset**, fewer bites but targeting quality. **Forbidden on this plate:** crankbaits, square bills, small finesse plugs, worms, jigs, more than one lure, any fish, people, rods, boats, logos, or scenic water.",
  },
];

const PROMPT_TEMPLATE = `Create a modern field-guide **tackle specimen** illustration for {DISPLAY_NAME}, as a compact plate for a fishing app **goal** chip (small square wizard tile). Match the same illustrated vocabulary as premium vintage field-guide lure plates: crisp profile readability, subtle inked outline, soft natural shading, muted tactical greens/browns/grays—**no candy neons**, elegant and app-ready.

**Single centered lure** only—the motif fills about 78–84% of the canvas with a little margin for rounded UI masks. **Transparent background.** No text, no labels, no water, no hands, no rod, no line spool, no packaging, no extra lures in frame.

Subject discipline: {SUBJECT_LINE}

Avoid photoreal Amazon product shots, cartoon mascots, AI-gloss hyper-shine, heavy cast shadows on a fake floor, cluttered hardware, illegible micro detail, and fantasy sci-fi lures.`;

function buildPrompt(row: GoalRow): string {
  return PROMPT_TEMPLATE
    .replaceAll("{DISPLAY_NAME}", row.display_name)
    .replaceAll("{SUBJECT_LINE}", row.subject_line);
}

function outUrl(id: string): URL {
  return new URL(`../assets/images/recommendation_goal/${id}.png`, import.meta.url);
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
    ? GOAL_ROWS.filter((r) => r.id === cli.id)
    : [...GOAL_ROWS];
  if (rows.length === 0) {
    console.error(
      cli.id
        ? `Unknown goal id=${cli.id} (use all_purpose or big_fish)`
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
    console.log(`\n── GOAL ${row.id} ──`);
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

    await Deno.mkdir(new URL("./", dest), { recursive: true });
    await Deno.writeFile(dest, bytes!);
    console.log(`Wrote ${dest.pathname} (${bytes!.byteLength} bytes)`);
    done++;
    if (cli.delayMs > 0 && done < rows.length) await sleep(cli.delayMs);
  }

  console.log(`\nDone. ${done} image(s).`);
}

await main();
