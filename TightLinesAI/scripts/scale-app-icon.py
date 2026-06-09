#!/usr/bin/env python3
"""Scale FinFindr app icon logo within the 1024 canvas and render iOS previews."""

from __future__ import annotations

import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ICON = ASSETS / "icon.png"
BACKUP = ASSETS / "icon-original-build13.png"


def rgb_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def sample_background(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    px = im.load()
    corners = [(20, 20), (20, w - 21), (h - 21, 20), (h - 21, w - 21)]
    samples = [px[x, y] for y, x in corners]
    return tuple(sum(c[i] for c in samples) // len(samples) for i in range(3))


def content_bbox(im: Image.Image, bg: tuple[int, int, int], threshold: float = 18.0):
    w, h = im.size
    px = im.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if rgb_dist(px[x, y], bg) > threshold:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def solid_background(size: int, color: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGB", (size, size), color)
    return img


def scale_icon(
    source: Image.Image,
    scale: float,
    y_nudge: int = 0,
) -> Image.Image:
    bg = sample_background(source)
    x0, y0, x1, y1 = content_bbox(source, bg)
    logo = source.crop((x0, y0, x1 + 1, y1 + 1))
    new_w = max(1, round(logo.width * scale))
    new_h = max(1, round(logo.height * scale))
    logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)

    out = solid_background(source.width, bg)
    canvas_w, canvas_h = out.size
    paste_x = (canvas_w - new_w) // 2
    paste_y = (canvas_h - new_h) // 2 + y_nudge
    out.paste(logo, (paste_x, paste_y))
    return out


def ios_mask(size: int) -> Image.Image:
    """Approximate iOS home-screen icon superellipse."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    inset = round(size * 0.055)
    draw.rounded_rectangle(
        (inset, inset, size - inset - 1, size - inset - 1),
        radius=round(size * 0.2237),
        fill=255,
    )
    return mask.filter(ImageFilter.GaussianBlur(0.6))


def masked_icon_tile(icon: Image.Image, tile: int) -> Image.Image:
    icon_tile = icon.resize((tile, tile), Image.Resampling.LANCZOS)
    mask = ios_mask(tile)
    masked = Image.new("RGBA", (tile, tile), (0, 0, 0, 0))
    masked.paste(icon_tile, (0, 0))
    masked.putalpha(mask)
    return masked


def preview_on_homescreen(icon: Image.Image, label: str, out_path: Path, tile: int = 180) -> None:
    bg = (242, 242, 247)
    canvas = Image.new("RGB", (tile + 80, tile + 100), bg)
    draw = ImageDraw.Draw(canvas)
    masked = masked_icon_tile(icon, tile)

    x = (canvas.width - tile) // 2
    y = 28
    canvas.paste(masked, (x, y), masked)
    draw.text((x, y + tile + 14), label, fill=(30, 30, 30))
    draw.text((x, y + tile + 32), f"{tile}px wide on screen", fill=(120, 120, 120))
    canvas.save(out_path, quality=95)


def preview_true_phone_scale(
    before: Image.Image,
    after: Image.Image,
    out_path: Path,
    tile: int = 60,
) -> None:
    """Icons at ~60px — close to physical home-screen size when PNG viewed at 100%."""
    bg = (242, 242, 247)
    gap = 48
    pad = 24
    canvas = Image.new("RGB", (pad * 2 + tile * 2 + gap, tile + 90), bg)
    draw = ImageDraw.Draw(canvas)
    labels = ("Build 13", "Build 14 (+15%)")
    for i, (icon, label) in enumerate(((before, labels[0]), (after, labels[1]))):
        x = pad + i * (tile + gap)
        masked = masked_icon_tile(icon, tile)
        canvas.paste(masked, (x, 20), masked)
        draw.text((x, 20 + tile + 10), label, fill=(30, 30, 30))
    draw.text((pad, tile + 58), "View this image at 100% zoom — icons are ~real phone size", fill=(120, 120, 120))
    canvas.save(out_path, quality=95)


def main() -> None:
    if not ICON.exists():
        raise SystemExit(f"Missing icon: {ICON}")

    if not BACKUP.exists():
        shutil.copy2(ICON, BACKUP)
        print(f"Backed up original icon -> {BACKUP.name}")

    source = Image.open(BACKUP if BACKUP.exists() else ICON).convert("RGB")

    # 15% larger logo; nudge 6px down so the green arrow stays inside iOS corners.
    scaled = scale_icon(source, scale=1.15, y_nudge=6)
    scaled.save(ICON, format="PNG", optimize=True)
    print(f"Wrote scaled icon (1.15x, +6px down) -> {ICON}")

    preview_on_homescreen(
        source,
        "Build 13 (App Store asset)",
        ASSETS / "icon-preview-current-ios.png",
        tile=180,
    )
    preview_on_homescreen(
        scaled,
        "Build 14 (+15%)",
        ASSETS / "icon-preview-build14-ios.png",
        tile=180,
    )
    preview_true_phone_scale(
        source,
        scaled,
        ASSETS / "icon-preview-phone-scale.png",
        tile=60,
    )
    print(
        "Wrote previews -> icon-preview-current-ios.png, "
        "icon-preview-build14-ios.png, icon-preview-phone-scale.png"
    )

    bg = sample_background(source)
    _, y0, _, y1 = content_bbox(source, bg)
    _, ny0, _, ny1 = content_bbox(scaled, bg)
    print(f"Top margin before: {y0}px, after: {ny0}px")


if __name__ == "__main__":
    main()
