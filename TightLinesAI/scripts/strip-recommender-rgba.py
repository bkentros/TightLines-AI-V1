#!/usr/bin/env python3
"""Strip backgrounds from recommender PNGs in place (rembg → RGBA).
Same coverage as strip-recommender-tackle-backgrounds.sh; uses Python API so
no `rembg` CLI / gradio stack is required.

Run from TightLinesAI/:
  .venv-rembg/bin/python scripts/strip-recommender-rgba.py
Or with system python if rembg + onnxruntime are installed."""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from rembg import remove
except ImportError as e:
    print(
        "rembg import failed. Create venv:\n"
        "  /usr/bin/python3 -m venv .venv-rembg && "
        "source .venv-rembg/bin/activate && pip install rembg onnxruntime",
        file=sys.stderr,
    )
    raise SystemExit(1) from e

ROOT = Path(__file__).resolve().parents[1]


def strip_one(path: Path) -> None:
    data = path.read_bytes()
    out = remove(data)
    path.write_bytes(out)
    print(f"stripped: {path}")


def strip_dir(dirpath: Path) -> None:
    if not dirpath.is_dir():
        return
    for p in sorted(dirpath.glob("*.png")):
        strip_one(p)


def main() -> None:
    dirs = [
        ROOT / "assets/images/lures",
        ROOT / "assets/images/flies",
        ROOT / "assets/images/recommendation_goal",
        ROOT / "assets/images/watertype",
        ROOT / "assets/images/waterclarity",
    ]
    fish_ids = [
        "largemouth_bass",
        "smallmouth_bass",
        "pike_musky",
        "river_trout",
    ]
    for d in dirs:
        strip_dir(d)
    for fid in fish_ids:
        p = ROOT / "assets/images/fish" / f"{fid}.png"
        if p.is_file():
            strip_one(p)
    print("Done. Recommender PNGs (except colorpalette) → RGBA where found.")


if __name__ == "__main__":
    main()
