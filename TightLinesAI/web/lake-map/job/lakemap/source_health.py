"""Persistent THREDDS circuit-breaker state for coherent lake-map builds."""
from __future__ import annotations

import errno
import http.client
import json
import socket
import urllib.error
from copy import deepcopy

from . import store

STATE_KEY = "state/thredds-health.json"
STATE_CACHE = "private, no-store"
FORMAT_VERSION = 1
RECOVERY_PROBES = 2
HISTORY_LIMIT = 16


def initial_state():
    # Missing/corrupt state fails safe: use validated NODD while THREDDS proves
    # healthy twice. This also gives the first production deployment a gentle
    # bootstrap after the diagnosed THREDDS failures.
    return {
        "formatVersion": FORMAT_VERSION,
        "circuit": "open",
        "lastFailureType": "unknown",
        "consecutiveHealthyProbes": 0,
        "history": [],
    }


def normalize(raw):
    if not isinstance(raw, dict) or raw.get("formatVersion") != FORMAT_VERSION:
        return initial_state()
    try:
        healthy_probes = max(0, int(raw.get("consecutiveHealthyProbes") or 0))
    except (TypeError, ValueError):
        healthy_probes = 0
    state = initial_state()
    state.update({
        "circuit": raw.get("circuit") if raw.get("circuit") in ("open", "closed") else "open",
        "lastFailureType": str(raw.get("lastFailureType") or "unknown"),
        "consecutiveHealthyProbes": healthy_probes,
        "history": [item for item in raw.get("history", []) if isinstance(item, dict)][-HISTORY_LIMIT:],
    })
    if state["circuit"] == "closed":
        state["consecutiveHealthyProbes"] = 0
    return state


def load(s3):
    return normalize(store.read_json(s3, STATE_KEY))


def save(s3, state):
    store.put(s3, STATE_KEY, json.dumps(normalize(state), separators=(",", ":")).encode(), STATE_CACHE)


def is_open(state) -> bool:
    return normalize(state)["circuit"] == "open"


def _record(state, cycle):
    history = state.setdefault("history", [])
    record = next((item for item in history if item.get("cycle") == cycle), None)
    if record is None:
        record = {"cycle": cycle}
        history.append(record)
    state["history"] = history[-HISTORY_LIMIT:]
    return record


def choose_source(state, cycle):
    state = normalize(state)
    record = next((item for item in reversed(state["history"])
                   if item.get("cycle") == cycle and item.get("surfaceSource") in ("thredds", "nodd")), None)
    if record:
        return record["surfaceSource"], record.get("surfaceReason") or "existing cycle decision"
    if state["circuit"] == "open":
        return "nodd", (f"THREDDS circuit open after {state['lastFailureType']}; "
                        "using validated NODD and running a cheap THREDDS probe")
    return "thredds", "THREDDS circuit closed"


def record_source(state, cycle, component, source, reason):
    state = normalize(state)
    record = _record(state, cycle)
    record[f"{component}Source"] = source
    record[f"{component}Reason"] = reason
    return state


def source_for_depth(state, cycle):
    state = normalize(state)
    record = next((item for item in reversed(state["history"]) if item.get("cycle") == cycle), None)
    if record and record.get("surfaceSource") in ("thredds", "nodd"):
        source = record["surfaceSource"]
        return source, f"following surface cycle decision ({source})"
    return choose_source(state, cycle)


def classify_failure(error):
    seen = set()
    current = error
    while current is not None and id(current) not in seen:
        seen.add(id(current))
        status = getattr(current, "status", None) or getattr(current, "code", None)
        try:
            status = int(status)
        except (TypeError, ValueError):
            status = None
        if status == 404:
            return "http_404"
        if status == 429:
            return "http_429"
        if status is not None and status >= 500:
            return "http_5xx"
        if isinstance(current, http.client.IncompleteRead):
            return "incomplete_read"
        if isinstance(current, (ConnectionResetError, ConnectionAbortedError,
                                http.client.RemoteDisconnected, BrokenPipeError)):
            return "connection_reset"
        if isinstance(current, (TimeoutError, socket.timeout)):
            return "timeout"
        if isinstance(current, urllib.error.URLError):
            reason = current.reason
            if isinstance(reason, (TimeoutError, socket.timeout)) or "timed out" in str(reason).lower():
                return "timeout"
            return "connection_error"
        if isinstance(current, OSError):
            if current.errno in (errno.ECONNRESET, errno.ECONNABORTED, errno.EPIPE):
                return "connection_reset"
            if current.errno == errno.ETIMEDOUT:
                return "timeout"
        current = current.__cause__ or current.__context__
    text = str(error).lower()
    for marker, kind in (("http 404", "http_404"), ("http 429", "http_429"),
                         ("http 50", "http_5xx"), ("incompleteread", "incomplete_read"),
                         ("connection reset", "connection_reset"), ("timed out", "timeout")):
        if marker in text:
            return kind
    return "other"


def record_thredds_result(state, cycle, outcome, *, kind):
    """Apply a build/probe result and return a normalized copy."""
    state = normalize(deepcopy(state))
    record = _record(state, cycle)
    previous = record.get(f"thredds{kind.title()}Status")
    record[f"thredds{kind.title()}Status"] = outcome
    if outcome == "success":
        if kind == "probe" and state["circuit"] == "open":
            if previous != "success":
                state["consecutiveHealthyProbes"] += 1
            if state["consecutiveHealthyProbes"] >= RECOVERY_PROBES:
                state["circuit"] = "closed"
                state["lastFailureType"] = "none"
                state["consecutiveHealthyProbes"] = 0
        elif kind == "build":
            state["circuit"] = "closed"
            state["lastFailureType"] = "none"
            state["consecutiveHealthyProbes"] = 0
    else:
        state["circuit"] = "open"
        state["lastFailureType"] = outcome
        state["consecutiveHealthyProbes"] = 0
    return state
