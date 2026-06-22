"""
Blog publishing API.

Public:
  GET  /api/blogs            — list all published blogs
  GET  /api/blogs/{slug}     — single blog by slug

Authenticated (Bearer <BLOG_API_KEY>):
  POST   /api/blogs          — create new blog (publishes + pings search engines)
  PATCH  /api/blogs/{slug}   — partial update
  DELETE /api/blogs/{slug}   — delete

The shape mirrors the existing blogContent.js structure 1:1 so the frontend can
swap data sources without UI changes.
"""
import os
import re
import logging
from datetime import datetime, timezone
from typing import List, Optional, Any, Dict

from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from pydantic import BaseModel, Field

from database import db
from services.indexing import notify_search_engines

logger = logging.getLogger(__name__)
router = APIRouter()

SITE_URL = os.environ.get('SITE_URL', 'https://palmbaylots-land.com')
BLOG_API_KEY = os.environ.get('BLOG_API_KEY', '')


# ---------- Pydantic models ----------

class FAQ(BaseModel):
    q: str
    a: str


class BlogIn(BaseModel):
    slug: str = Field(..., min_length=3, max_length=120)
    title: str
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    subtitle: Optional[str] = ''
    category: Optional[str] = 'General'
    date: Optional[str] = None
    readTime: Optional[str] = '5 min read'
    image: Optional[str] = ''
    content: str
    faqs: List[FAQ] = []


class BlogPatch(BaseModel):
    title: Optional[str] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    readTime: Optional[str] = None
    image: Optional[str] = None
    content: Optional[str] = None
    faqs: Optional[List[FAQ]] = None


# ---------- Helpers ----------

def _require_auth(authorization: Optional[str]):
    if not BLOG_API_KEY:
        raise HTTPException(500, "Server misconfigured: BLOG_API_KEY not set")
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(401, "Missing Bearer token")
    if authorization.split(' ', 1)[1].strip() != BLOG_API_KEY:
        raise HTTPException(403, "Invalid API key")


_slug_re = re.compile(r'^[a-z0-9-]+$')


def _validate_slug(slug: str):
    if not _slug_re.match(slug):
        raise HTTPException(400, "Invalid slug — use lowercase letters, numbers, and hyphens only")


def _strip_id(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    doc.pop('_id', None)
    return doc


async def _ping_async(url: str, action: str = 'URL_UPDATED'):
    """Background task — fire indexing pings without blocking the response."""
    try:
        result = await notify_search_engines(url, action)
        logger.info(f"Indexing ping result: {result}")
    except Exception as e:
        logger.error(f"Background indexing ping failed: {e}")


# ---------- Public routes ----------

@router.get("/blogs")
async def list_blogs():
    """Return all blogs, newest first."""
    cursor = db.blogs.find({}, {"_id": 0}).sort([("publishedAt", -1)])
    return [doc async for doc in cursor]


@router.get("/blogs/{slug}")
async def get_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Blog not found")
    return doc


# ---------- Authenticated routes ----------

@router.post("/blogs", status_code=201)
async def create_blog(payload: BlogIn, background: BackgroundTasks, authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    _validate_slug(payload.slug)

    if await db.blogs.find_one({"slug": payload.slug}, {"_id": 1}):
        raise HTTPException(409, f"Blog with slug '{payload.slug}' already exists. Use PATCH to update.")

    now = datetime.now(timezone.utc).isoformat()
    doc = payload.model_dump()
    doc["publishedAt"] = now
    doc["updatedAt"] = now

    await db.blogs.insert_one(doc)
    url = f"{SITE_URL}/blog/{payload.slug}"

    # Fire-and-forget indexing pings
    background.add_task(_ping_async, url, 'URL_UPDATED')

    return {**_strip_id(doc), "url": url, "indexingPing": "queued"}


@router.patch("/blogs/{slug}")
async def update_blog(slug: str, payload: BlogPatch, background: BackgroundTasks, authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    _validate_slug(slug)

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")

    updates["updatedAt"] = datetime.now(timezone.utc).isoformat()
    if 'faqs' in updates:
        updates['faqs'] = [f if isinstance(f, dict) else f.model_dump() for f in updates['faqs']]

    result = await db.blogs.find_one_and_update(
        {"slug": slug},
        {"$set": updates},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(404, "Blog not found")

    url = f"{SITE_URL}/blog/{slug}"
    background.add_task(_ping_async, url, 'URL_UPDATED')

    return {**result, "url": url, "indexingPing": "queued"}


@router.delete("/blogs/{slug}")
async def delete_blog(slug: str, background: BackgroundTasks, authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    result = await db.blogs.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(404, "Blog not found")

    url = f"{SITE_URL}/blog/{slug}"
    background.add_task(_ping_async, url, 'URL_DELETED')
    return {"ok": True, "deletedSlug": slug, "indexingPing": "queued"}
