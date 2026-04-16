#!/usr/bin/env python3
"""
Generate lure/fly PNGs for the TightLines recommender from lib/lureImages.ts and lib/flyImages.ts.

Filenames always match the basename inside each require() path (single source of truth).
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

REQUIRE_LINE = re.compile(
    r"^\s*(?P<id>[a-z0-9_]+)\s*:\s*require\(\s*['\"]\.\./assets/images/(?P<kind>lures|flies)/(?P<file>[^'\"]+)['\"]\s*\)\s*,?\s*$"
)


@dataclass(frozen=True)
class AssetJob:
    archetype_id: str
    kind: str  # "lures" | "flies"
    basename: str
    out_path: Path

    @property
    def filename_override(self) -> str | None:
        expected = f"{self.archetype_id}.png"
        return self.basename if self.basename != expected else None


def project_root() -> Path:
    # .../TightLinesAI/scripts/tightlines-asset-generation/generate_assets.py
    return Path(__file__).resolve().parent.parent.parent


def parse_registry(ts_path: Path) -> list[AssetJob]:
    text = ts_path.read_text(encoding="utf-8")
    jobs: list[AssetJob] = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("//") or not stripped:
            continue
        m = REQUIRE_LINE.match(line)
        if not m:
            continue
        archetype_id = m.group("id")
        kind = m.group("kind")
        file = m.group("file")
        if not file.endswith(".png"):
            raise ValueError(f"Non-png require in {ts_path}: {line}")
        out_dir = project_root() / "assets" / "images" / kind
        jobs.append(
            AssetJob(
                archetype_id=archetype_id,
                kind=kind,
                basename=file,
                out_path=out_dir / file,
            )
        )
    return jobs


def load_prompts(prompts_path: Path) -> dict:
    return json.loads(prompts_path.read_text(encoding="utf-8"))


def build_prompt(data: dict, job: AssetJob) -> str:
    style = data.get("style_block", "").strip()
    composition = data.get("composition_suffix", "").strip()
    subjects: dict[str, str] = data.get("subjects", {})
    subject = subjects.get(job.archetype_id)
    if not subject:
        words = job.archetype_id.replace("_", " ")
        subject = f"A recognizable {words} used in freshwater fishing, accurate proportions and hardware."
    parts = [style, subject, composition]
    return "\n\n".join(p for p in parts if p)


def ensure_openai_key() -> None:
    if os.environ.get("OPENAI_API_KEY"):
        return
    try:
        from dotenv import load_dotenv  # type: ignore
    except ImportError:
        return
    root = project_root()
    for name in (".env.local", ".env"):
        p = root / name
        if p.is_file():
            load_dotenv(p)


def resize_square_rgba_png(png_bytes: bytes, size: int) -> bytes:
    from PIL import Image

    im = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    if im.size != (size, size):
        im = im.resize((size, size), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return buf.getvalue()


def generate_one(
    client,
    model: str,
    prompt: str,
    api_size: str,
    canvas_size: int,
    quality: str,
) -> bytes:
    result = client.images.generate(
        model=model,
        prompt=prompt,
        size=api_size,
        background="transparent",
        quality=quality,
        output_format="png",
        n=1,
    )
    item = result.data[0]
    b64 = getattr(item, "b64_json", None) or item.model_extra.get("b64_json")  # type: ignore[union-attr]
    if not b64:
        raise RuntimeError("No b64_json in image response")
    raw = base64.b64decode(b64)
    return resize_square_rgba_png(raw, canvas_size)


def dry_run(jobs: Iterable[AssetJob]) -> None:
    for j in sorted(jobs, key=lambda x: (x.kind, x.archetype_id)):
        flag = f" OVERRIDE→{j.basename}" if j.filename_override else ""
        print(f"{j.kind}/{j.basename}  (id={j.archetype_id}){flag}")
        print(f"  → {j.out_path}")
    print(f"\nTotal: {len(list(jobs))} assets")


def verify_files(jobs: list[AssetJob]) -> list[str]:
    missing: list[str] = []
    for j in jobs:
        if not j.out_path.is_file():
            missing.append(str(j.out_path))
    return missing


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("--only", help="Comma-separated archetype ids")
    parser.add_argument("--model", default="gpt-image-1.5")
    parser.add_argument("--api-size", default="1024x1024")
    parser.add_argument("--canvas-size", type=int, default=512)
    parser.add_argument("--quality", default="high")
    parser.add_argument("--delay", type=float, default=1.25, help="Seconds between API calls")
    parser.add_argument(
        "--prompts",
        type=Path,
        default=Path(__file__).resolve().parent / "prompts.json",
    )
    args = parser.parse_args()

    root = project_root()
    lure_ts = root / "lib" / "lureImages.ts"
    fly_ts = root / "lib" / "flyImages.ts"
    if not lure_ts.is_file() or not fly_ts.is_file():
        print("Registry files missing.", file=sys.stderr)
        return 1

    lure_jobs = parse_registry(lure_ts)
    fly_jobs = parse_registry(fly_ts)
    jobs = lure_jobs + fly_jobs

    only = {s.strip() for s in args.only.split(",")} if args.only else None
    if only:
        jobs = [j for j in jobs if j.archetype_id in only]

    overrides = [f"{j.archetype_id} → {j.basename}" for j in jobs if j.filename_override]
    print("Filename overrides (id → output basename, from require() paths):")
    for line in overrides or ["(none — every id matches its .png basename)"]:
        print(f"  {line}")

    if args.dry_run:
        dry_run(jobs)
        return 0

    if args.verify_only:
        missing = verify_files(jobs)
        if missing:
            print("Missing files:", file=sys.stderr)
            for m in missing:
                print(f"  {m}", file=sys.stderr)
            return 1
        print(f"OK — all {len(jobs)} expected PNGs exist.")
        return 0

    ensure_openai_key()
    if not os.environ.get("OPENAI_API_KEY"):
        print(
            "OPENAI_API_KEY is not set. Supabase CLI cannot print secret values.\n"
            "Add OPENAI_API_KEY to TightLinesAI/.env.local (gitignored) matching your\n"
            "Edge Function secret, then re-run:\n"
            "  export OPENAI_API_KEY=…\n"
            "  python3 generate_assets.py --overwrite",
            file=sys.stderr,
        )
        return 1

    prompts_path = args.prompts
    if not prompts_path.is_file():
        print(f"Missing {prompts_path}", file=sys.stderr)
        return 1
    data = load_prompts(prompts_path)

    from openai import OpenAI

    client = OpenAI()
    failures: list[tuple[str, str]] = []
    for i, job in enumerate(jobs):
        if not args.overwrite and job.out_path.is_file():
            print(f"skip exists: {job.out_path.name}")
            continue
        job.out_path.parent.mkdir(parents=True, exist_ok=True)
        prompt = build_prompt(data, job)
        try:
            png = generate_one(
                client,
                model=args.model,
                prompt=prompt,
                api_size=args.api_size,
                canvas_size=args.canvas_size,
                quality=args.quality,
            )
            job.out_path.write_bytes(png)
            print(f"OK [{i+1}/{len(jobs)}] {job.out_path}")
        except Exception as e:  # noqa: BLE001
            failures.append((job.archetype_id, str(e)))
            print(f"FAIL {job.archetype_id}: {e}", file=sys.stderr)
        if args.delay > 0 and i < len(jobs) - 1:
            time.sleep(args.delay)

    if failures:
        print("\nFailures:", file=sys.stderr)
        for aid, msg in failures:
            print(f"  {aid}: {msg}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
