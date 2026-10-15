"""HTTP with retries. Tests replace `fetch` with fixtures."""
from __future__ import annotations

import contextlib
import email.utils
import http.client
import re
import socket
import threading
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from urllib.parse import urlparse

USER_AGENT = "PierCast-LakeMap/1.0 (+https://finfindr.app)"
THREDDS_HOST = "opendap.co-ops.nos.noaa.gov"
THREDDS_CONCURRENCY = 3


class RequestGate:
    """Process-wide cap for NOAA THREDDS requests."""

    def __init__(self, limit: int):
        if limit < 1:
            raise ValueError("request concurrency must be positive")
        self.limit = limit
        self._slots = threading.BoundedSemaphore(limit)

    @contextlib.contextmanager
    def slot(self):
        self._slots.acquire()
        try:
            yield
        finally:
            self._slots.release()


THREDDS_GATE = RequestGate(THREDDS_CONCURRENCY)


class HttpError(Exception):
    def __init__(self, status: int, url: str, headers=None, confirmed_missing=False,
                 dataset_present=False):
        url = redact(url)
        detail = " (file absence confirmed)" if confirmed_missing else (
            " (dataset exists; query returned 404)" if dataset_present else ""
        )
        super().__init__(f"HTTP {status} for {url}{detail}")
        self.status = status
        self.url = url
        self.headers = {str(key).lower(): str(value) for key, value in (headers or {}).items()}
        self.confirmed_missing = bool(confirmed_missing)
        self.dataset_present = bool(dataset_present)


def redact(text: str) -> str:
    """Never let an API key reach a log."""
    return re.sub(r"(apikey=)[^&\s]+", r"\1***", str(text))


def is_thredds_url(url: str) -> bool:
    return (urlparse(url).hostname or "").lower() == THREDDS_HOST


def retry_after_seconds(headers, now=None):
    """Parse Retry-After seconds or HTTP date; return None when absent/invalid."""
    value = next((str(v).strip() for key, v in (headers or {}).items()
                  if str(key).lower() == "retry-after"), "")
    if not value:
        return None
    try:
        return max(0.0, float(value))
    except ValueError:
        try:
            retry_at = email.utils.parsedate_to_datetime(value)
            if retry_at.tzinfo is None:
                retry_at = retry_at.replace(tzinfo=timezone.utc)
            current = now or datetime.now(timezone.utc)
            return max(0.0, (retry_at - current).total_seconds())
        except (TypeError, ValueError, OverflowError):
            return None


def retry_delay(error, attempt: int, base_delay: float = 1.0, maximum: float = 120.0) -> float:
    """Exponential retry delay, slower for overload and honoring Retry-After."""
    status = getattr(error, "status", None) or getattr(error, "code", None)
    overload = status in (429, 503, 504)
    delay = base_delay * (2 ** max(0, attempt - 1)) * (2 if overload else 1)
    retry_after = retry_after_seconds(getattr(error, "headers", None))
    if retry_after is not None:
        delay = max(delay, retry_after)
    return min(maximum, delay)


def _request_slot(url):
    return THREDDS_GATE.slot() if is_thredds_url(url) else contextlib.nullcontext()


def _fetch(url: str, timeout: float = 60, retries: int = 3) -> bytes:
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with _request_slot(url):
                with urllib.request.urlopen(req, timeout=timeout) as res:
                    return res.read()
        except urllib.error.HTTPError as err:
            last = HttpError(err.code, url, headers=err.headers)
            if err.code in (400, 403, 404):
                raise last
            if attempt + 1 >= retries:
                raise last
            time.sleep(retry_delay(last, attempt + 1))
        except (urllib.error.URLError, TimeoutError, ConnectionError,
                http.client.IncompleteRead, http.client.RemoteDisconnected,
                ConnectionResetError, socket.timeout) as err:
            last = err
            if attempt + 1 >= retries:
                raise last
            time.sleep(retry_delay(err, attempt + 1))
    raise last


fetch = _fetch


def _head(url: str, timeout: float = 30, retries: int = 3) -> dict[str, str]:
    """Fetch response headers without downloading the model object."""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": USER_AGENT},
                method="HEAD",
            )
            with _request_slot(url):
                with urllib.request.urlopen(req, timeout=timeout) as res:
                    return {key.lower(): value for key, value in res.headers.items()}
        except urllib.error.HTTPError as err:
            last = HttpError(err.code, url, headers=err.headers)
            if err.code in (400, 403, 404):
                raise last
            if attempt + 1 >= retries:
                raise last
            time.sleep(retry_delay(last, attempt + 1))
        except (urllib.error.URLError, TimeoutError, ConnectionError,
                http.client.RemoteDisconnected, ConnectionResetError, socket.timeout) as err:
            last = err
            if attempt + 1 >= retries:
                raise last
            time.sleep(retry_delay(err, attempt + 1))
    raise last


head = _head
