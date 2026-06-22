"""Admin authentication helpers.

The /admin page is currently gated by a client-side password. We expose this
endpoint so the Admin Blog UI can retrieve the BLOG_API_KEY server-side (rather
than baking it into the JS bundle). The same password protects both gates.
"""
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'PalmBay2024!')
BLOG_API_KEY = os.environ.get('BLOG_API_KEY', '')


class AdminPasswordIn(BaseModel):
    password: str


@router.post("/admin/blog-key")
async def get_blog_api_key(payload: AdminPasswordIn):
    """Return the blog publishing API key after verifying admin password."""
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(403, "Invalid admin password")
    if not BLOG_API_KEY:
        raise HTTPException(500, "BLOG_API_KEY not configured on server")
    return {"key": BLOG_API_KEY}
