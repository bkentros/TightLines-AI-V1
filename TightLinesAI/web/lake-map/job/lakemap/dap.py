"""Minimal OPeNDAP (DAP2) binary reader for plain arrays.

A `.dods` response is the DDS text, then "\\nData:\\n", then each requested
array in order: its length twice (big-endian uint32) and the values (XDR,
big-endian). Byte arrays are padded to 4 bytes.
"""
from __future__ import annotations

import re

import numpy as np

_TYPES = {"Float32": ">f4", "Float64": ">f8", "Int32": ">i4", "UInt32": ">u4",
          "Int16": ">i4", "UInt16": ">u4", "Byte": "u1"}
_DECL = re.compile(r"^\s*(Float32|Float64|Int32|UInt32|Int16|UInt16|Byte)\s+(\w+)((?:\[[^\]]+\])*);", re.M)
_DIM = re.compile(r"\[(?:\w+\s*=\s*)?(\d+)\]")


def parse_dods(buf: bytes) -> dict:
    marker = buf.find(b"\nData:\n")
    if marker < 0:
        raise ValueError("Not a DAP2 data response")
    dds = buf[:marker].decode("utf-8", "replace")
    if "Grid {" in dds or "Structure {" in dds:
        raise ValueError("Only plain arrays are supported")
    pos = marker + len(b"\nData:\n")
    out = {}
    for m in _DECL.finditer(dds):
        kind, name, dims = m.group(1), m.group(2), m.group(3)
        shape = tuple(int(d) for d in _DIM.findall(dims))
        n = int(np.frombuffer(buf, ">u4", 1, pos)[0])
        pos += 8
        dtype = np.dtype(_TYPES[kind])
        data = np.frombuffer(buf, dtype, n, pos)
        size = n * dtype.itemsize
        pos += size + ((4 - size % 4) % 4 if kind == "Byte" else 0)
        out[name] = data.reshape(shape) if shape else data
    return out


def encode_dods(arrays: dict) -> bytes:
    """Build a DAP2 response (used by tests and fixtures)."""
    names = {">f4": "Float32", ">f8": "Float64", ">i4": "Int32"}
    lines = ["Dataset {"]
    body = b""
    for name, arr in arrays.items():
        arr = np.asarray(arr)
        kind = ">f8" if arr.dtype == np.float64 else ">i4" if arr.dtype.kind == "i" else ">f4"
        dims = "".join(f"[d{i} = {s}]" for i, s in enumerate(arr.shape))
        lines.append(f"    {names[kind]} {name}{dims};")
        n = np.array([arr.size, arr.size], ">u4").tobytes()
        body += n + arr.astype(kind).tobytes()
    lines.append("} fixture;")
    return ("\n".join(lines)).encode() + b"\nData:\n" + body
