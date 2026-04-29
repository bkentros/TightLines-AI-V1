# Recommender tackle images (68 lures + flies)

## What you asked for vs what the API can do

- **`gpt-image-2`** is the right default for quality, but it **does not support** `background: "transparent"` on `images/generations`. You get an opaque render.
- **App-ready transparency** is still achievable: generate on a **single flat paper color** (encoded in prompts as `#F0E8D4`, matching `paperLight` in `lib/theme.ts`), then run **`strip-recommender-tackle-backgrounds.sh`**, which uses **[rembg](https://github.com/danielgatis/rembg)** to produce **RGBA PNGs** without hand masking.

Alternative if you ever accept non–Image-2: `gpt-image-1.5` with `--background=transparent` can return alpha directly (script supports it), but you requested GPT Image 2.

## Prompt / theme wording

All copy is centralized in **`scripts/data/recommenderTackleImageManifest.ts`**:

- FinFindr **paper / ink** vibe: warm, premium, readable at small size.
- **Not** flat clip art, **not** overloaded scientific plates.
- **Anatomy-first** bullets per archetype so hardware stays believable.

Edit that file if you want to tune voice; the generator stitches shared blocks + anatomy + light engine context (`family_group`, column, forage).

Placeholder **1×1 transparent PNGs** may exist for newly added ids until you run a full generation (keeps Metro from failing on missing `require` targets).

## Replace the whole catalog (backup + delete old PNGs + regenerate)

From **`TightLinesAI/`**, with the key in **`.env`** (not committed; see `.gitignore`):

```bash
# .env
OPENAI_API_KEY=sk-...   # never EXPO_PUBLIC_* — that would ship the key in the app

npm run gen:recommender-tackle-images:replace
```

(`package.json` runs Deno with `--env-file=.env` so you do not need `export` in the shell.)

This:

1. Copies every existing `assets/images/lures/*.png` and `flies/*.png` into `assets/images/_backups/tackle-<timestamp>/`.
2. Deletes those PNGs from the asset folders.
3. Regenerates **all 37 + 31 = 68** files from the v4 catalogs.

Then strip backgrounds:

```bash
bash scripts/strip-recommender-tackle-backgrounds.sh
```

## One-off / preview

```bash
deno run -A scripts/generate-recommender-tackle-images.ts --dry-run --limit=2
deno run -A scripts/generate-recommender-tackle-images.ts --kind=lures --id=spinnerbait
```

## Client maps

`lib/lureImages.ts` and `lib/flyImages.ts` must `require()` every archetype id. The repo includes all **68** keys so new PNGs resolve immediately after generation.

## npm

`package.json` exposes `gen:recommender-tackle-images` (same Deno entry). You can add a `post` strip step locally if you want a one-liner chain.
