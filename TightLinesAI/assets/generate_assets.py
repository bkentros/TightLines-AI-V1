#!/usr/bin/env python3
import argparse
import base64
import io
import json
import os
import sys
import time
from pathlib import Path

from openai import OpenAI

DEFAULT_MODEL = "gpt-image-1.5"
DEFAULT_SIZE = "1024x1024"
CANVAS_SIZE = 512  # match flyImages.ts header; lures use same export size

SCRIPT_DIR = Path(__file__).resolve().parent


def detect_repo_root() -> Path:
    """TightLinesAI root whether this file lives in assets/ or scripts/asset_generation/."""
    here = SCRIPT_DIR
    for _ in range(5):
        if (here / "lib" / "lureImages.ts").is_file():
            return here
        here = here.parent
    return SCRIPT_DIR.parent


DEFAULT_REPO_ROOT = detect_repo_root()

# App-specific filename exceptions from image registry files.
FILENAME_OVERRIDES = {
    ("lure", "weightless_stick_worm"): "texas_rigged_stick_worm.png",
}


def load_prompts(path: Path):
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data["assets"]


def resolve_output_path(asset: dict, lures_dir: Path, flies_dir: Path) -> Path:
    out_dir = lures_dir if asset["type"] == "lure" else flies_dir
    filename = asset.get("app_filename") or FILENAME_OVERRIDES.get((asset["type"], asset["slug"]), f"{asset['slug']}.png")
    return out_dir / filename


def load_env_openai_key(repo_root: Path) -> None:
    if os.environ.get("OPENAI_API_KEY"):
        return
    try:
        from dotenv import load_dotenv  # type: ignore[import-not-found]
    except ImportError:
        return
    for name in (".env.local", ".env"):
        p = repo_root / name
        if p.is_file():
            load_dotenv(p, override=False)


def postprocess_png(image_bytes: bytes, canvas: int) -> bytes:
    try:
        from PIL import Image
    except ImportError:
        return image_bytes
    im = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    if im.size != (canvas, canvas):
        im = im.resize((canvas, canvas), Image.Resampling.LANCZOS)
    out = io.BytesIO()
    im.save(out, format="PNG")
    return out.getvalue()


def main():
    parser = argparse.ArgumentParser(description="Generate TightLines lure/fly PNG assets with OpenAI image generation.")
    parser.add_argument(
        "--prompts",
        default=str(SCRIPT_DIR / "prompts.json"),
        help="Path to prompts.json (default: alongside this script)",
    )
    parser.add_argument("--repo-root", default=str(DEFAULT_REPO_ROOT), help="TightLinesAI repo root")
    parser.add_argument("--lures-dir", default=None, help="Override lures output directory")
    parser.add_argument("--flies-dir", default=None, help="Override flies output directory")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Image model, default gpt-image-1.5")
    parser.add_argument("--size", default=DEFAULT_SIZE, help="Image size, default 1024x1024")
    parser.add_argument("--sleep", type=float, default=0.5, help="Seconds to sleep between requests")
    parser.add_argument("--only", nargs="*", default=None, help="Optional list of slugs or final filenames to generate")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite files that already exist")
    parser.add_argument("--dry-run", action="store_true", help="Print output paths without generating")
    args = parser.parse_args()

    prompts_path = Path(args.prompts).expanduser().resolve()
    repo_root = Path(args.repo_root).expanduser().resolve()
    load_env_openai_key(repo_root)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key and not args.dry_run:
        print(
            "ERROR: OPENAI_API_KEY is not set. Supabase CLI cannot read secret values.\n"
            "Copy the Edge Function secret OPENAI_API_KEY into TightLinesAI/.env.local as:\n"
            "  OPENAI_API_KEY=sk-...\n"
            "(.env.local is gitignored), or export it in your shell.",
            file=sys.stderr,
        )
        sys.exit(1)
    lures_dir = Path(args.lures_dir).expanduser().resolve() if args.lures_dir else (repo_root / "assets/images/lures")
    flies_dir = Path(args.flies_dir).expanduser().resolve() if args.flies_dir else (repo_root / "assets/images/flies")
    lures_dir.mkdir(parents=True, exist_ok=True)
    flies_dir.mkdir(parents=True, exist_ok=True)

    assets = load_prompts(prompts_path)
    if args.only:
        only = set(args.only)
        assets = [a for a in assets if a["slug"] in only or a.get("app_filename") in only or a["filename"] in only]

    client = None if args.dry_run else OpenAI(api_key=api_key)
    failures: list[str] = []

    print(f"Repo root: {repo_root}")
    print(f"Lures dir: {lures_dir}")
    print(f"Flies dir: {flies_dir}")
    print(f"Processing {len(assets)} assets")

    for idx, asset in enumerate(assets, start=1):
        out_path = resolve_output_path(asset, lures_dir, flies_dir)
        print(f"[{idx}/{len(assets)}] {asset['type']}:{asset['slug']} -> {out_path}")

        if args.dry_run:
            continue

        if out_path.exists() and not args.overwrite:
            print("  - Skipping (already exists). Use --overwrite to replace it.")
            continue

        try:
            result = client.images.generate(
                model=args.model,
                prompt=asset["prompt"],
                size=args.size,
                background="transparent",
                quality="high",
                output_format="png",
                n=1,
                moderation="auto",
            )
            image_base64 = result.data[0].b64_json
            if not image_base64:
                raise RuntimeError("empty b64_json")
            image_bytes = base64.b64decode(image_base64)
            image_bytes = postprocess_png(image_bytes, CANVAS_SIZE)
            with out_path.open("wb") as f:
                f.write(image_bytes)
            print(f"  - Saved {out_path}")
        except Exception as exc:  # noqa: BLE001
            msg = f"{asset['slug']}: {exc}"
            failures.append(msg)
            print(f"  - FAIL {msg}", file=sys.stderr)
        time.sleep(args.sleep)

    if failures:
        print(f"\n{len(failures)} failure(s).", file=sys.stderr)
        for m in failures:
            print(f"  {m}", file=sys.stderr)
        sys.exit(1)

    print("Done.")


if __name__ == "__main__":
    main()
