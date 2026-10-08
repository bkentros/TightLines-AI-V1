"""HTTP with retries. Tests replace `fetch` with fixtures."""
from __future__ import annotations

import re
import time
import urllib.error
import urllib.request

USER_AGENT = "PierCast-LakeMap/1.0 (+https://finfindr.app)"


class HttpError(Exception):
    def __init__(self, status: int, url: str):
        url = redact(url)
        super().__init__(f"HTTP {status} for {url}")
        self.status = status
        self.url = url


def redact(text: str) -> str:
    """Never let an API key reach a log."""
    return re.sub(r"(apikey=)[^&\s]+", r"\1***", str(text))


def _fetch(url: str, timeout: float = 60, retries: int = 3) -> bytes:
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=timeout) as res:
                return res.read()
        except urllib.error.HTTPError as err:
            last = HttpError(err.code, url)
            if err.code in (400, 403, 404):
                raise last
            # 429 = rate limited: back off 10, 20, 40 … seconds
            time.sleep(2 ** attempt * (10 if err.code == 429 else 1))
        except (urllib.error.URLError, TimeoutError, ConnectionError) as err:
            last = err
            time.sleep(2 ** attempt)
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
            with urllib.request.urlopen(req, timeout=timeout) as res:
                return {key.lower(): value for key, value in res.headers.items()}
        except urllib.error.HTTPError as err:
            last = HttpError(err.code, url)
            if err.code in (400, 403, 404):
                raise last
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, TimeoutError, ConnectionError) as err:
            last = err
            time.sleep(2 ** attempt)
    raise last


head = _head
