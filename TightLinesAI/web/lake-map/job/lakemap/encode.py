"""Frame PNG encoders (frame format v1, see web/lake-map/README.md)."""
from __future__ import annotations

import io

import numpy as np
from PIL import Image


def _png(arr: np.ndarray, mode: str) -> bytes:
    buf = io.BytesIO()
    Image.fromarray(arr, mode).save(buf, "PNG", optimize=True, compress_level=9)
    return buf.getvalue()


def scalar_png(values: np.ndarray, grid) -> bytes:
    """Gray PNG: byte = (value − offset) × scale, 255 = no data."""
    v = (values - grid.offset) * grid.scale
    out = np.full(values.shape, grid.nodata, np.uint8)
    ok = np.isfinite(v)
    out[ok] = np.clip(np.round(v[ok]), 0, 254).astype(np.uint8)
    return _png(out, "L")


def wind_png(u: np.ndarray, v: np.ndarray, grid) -> bytes:
    """RGBA PNG: R = u × 2 + 128, G = v × 2 + 128 (mph toward east / north)."""
    h, w = u.shape
    out = np.zeros((h, w, 4), np.uint8)
    for k, comp in enumerate((u, v)):
        c = np.where(np.isfinite(comp), comp, 0) * grid.scale + grid.offset
        out[..., k] = np.clip(np.round(c), 0, 255).astype(np.uint8)
    out[..., 3] = 255
    return _png(out, "RGBA")


def decode_scalar(png: bytes, grid) -> np.ndarray:
    a = np.asarray(Image.open(io.BytesIO(png))).astype(np.float32)
    out = a / grid.scale + grid.offset
    out[a == grid.nodata] = np.nan
    return out
