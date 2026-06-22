"""
Indexing service — pings Google Indexing API + IndexNow when blogs are published.
Both calls are fire-and-forget: failures are logged but never block the publish action.
"""
import os
import json
import logging
import asyncio
from typing import Optional

import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request as GoogleAuthRequest

logger = logging.getLogger(__name__)

SITE_URL = os.environ.get('SITE_URL', 'https://palmbaylots-land.com')
INDEXNOW_KEY = os.environ.get('BLOG_API_KEY', '').replace('_', '').replace('-', '')[:32] or 'palmbaylotsland2026key'

_google_creds_cache: Optional[service_account.Credentials] = None


def _get_google_creds():
    global _google_creds_cache
    if _google_creds_cache is not None:
        return _google_creds_cache
    raw = os.environ.get('GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON', '')
    if not raw:
        return None
    try:
        info = json.loads(raw)
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=['https://www.googleapis.com/auth/indexing']
        )
        _google_creds_cache = creds
        return creds
    except Exception as e:
        logger.error(f"Failed to load Google service account: {e}")
        return None


def ping_google_indexing(url: str, action: str = 'URL_UPDATED') -> dict:
    """Ping Google Indexing API. action = 'URL_UPDATED' or 'URL_DELETED'."""
    creds = _get_google_creds()
    if not creds:
        return {"ok": False, "error": "no_credentials"}
    try:
        creds.refresh(GoogleAuthRequest())
        resp = requests.post(
            'https://indexing.googleapis.com/v3/urlNotifications:publish',
            headers={
                'Authorization': f'Bearer {creds.token}',
                'Content-Type': 'application/json',
            },
            json={"url": url, "type": action},
            timeout=10,
        )
        if resp.status_code == 200:
            return {"ok": True, "response": resp.json()}
        return {"ok": False, "status": resp.status_code, "body": resp.text[:300]}
    except Exception as e:
        logger.error(f"Google Indexing API error for {url}: {e}")
        return {"ok": False, "error": str(e)}


def ping_indexnow(url: str) -> dict:
    """Ping IndexNow (Bing/Yandex/DuckDuckGo). Officially supported for all URL types."""
    try:
        resp = requests.post(
            'https://api.indexnow.org/IndexNow',
            headers={'Content-Type': 'application/json'},
            json={
                "host": SITE_URL.replace('https://', '').replace('http://', ''),
                "key": INDEXNOW_KEY,
                "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
                "urlList": [url],
            },
            timeout=10,
        )
        return {"ok": resp.status_code in (200, 202), "status": resp.status_code}
    except Exception as e:
        logger.error(f"IndexNow error for {url}: {e}")
        return {"ok": False, "error": str(e)}


async def notify_search_engines(url: str, action: str = 'URL_UPDATED') -> dict:
    """Fire both pings in parallel without blocking the caller."""
    loop = asyncio.get_event_loop()
    google_task = loop.run_in_executor(None, ping_google_indexing, url, action)
    indexnow_task = loop.run_in_executor(None, ping_indexnow, url)
    google, indexnow = await asyncio.gather(google_task, indexnow_task, return_exceptions=True)
    return {
        "url": url,
        "action": action,
        "google": google if not isinstance(google, Exception) else {"ok": False, "error": str(google)},
        "indexnow": indexnow if not isinstance(indexnow, Exception) else {"ok": False, "error": str(indexnow)},
    }
