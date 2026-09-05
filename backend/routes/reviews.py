"""
Client reviews / testimonials API.

Public:
  GET  /api/reviews          — list reviews (newest first) for the homepage

Authenticated (Bearer <BLOG_API_KEY>, unlocked by the admin page password):
  POST   /api/reviews          — add a review
  PATCH  /api/reviews/{id}     — edit a review
  DELETE /api/reviews/{id}     — remove a review
  POST   /api/reviews/seed     — one-time: load the existing testimonials if the
                                 collection is empty (so the admin starts populated)

Stored in the `reviews` Mongo collection. The homepage reads this live, so a new
review added in the admin appears immediately — no code change or deploy.
"""
import os
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field, ConfigDict

from database import db

logger = logging.getLogger(__name__)
router = APIRouter()

BLOG_API_KEY = os.environ.get('BLOG_API_KEY', '')


def _require_key(authorization: Optional[str]):
    """Same Bearer key the blog admin uses (unlocked via the page password)."""
    token = (authorization or '').replace('Bearer ', '').strip()
    if not BLOG_API_KEY or token != BLOG_API_KEY:
        raise HTTPException(status_code=401, detail="Not authorized")


class ReviewIn(BaseModel):
    name: str = 'Verified Client'
    title: str = ''
    text: str
    reply: str = ''
    source: str = 'Google'
    rating: int = 5
    order: int = 0


class ReviewPatch(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    text: Optional[str] = None
    reply: Optional[str] = None
    source: Optional[str] = None
    rating: Optional[int] = None
    order: Optional[int] = None


class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = 'Verified Client'
    title: str = ''
    text: str
    reply: str = ''
    source: str = 'Google'
    rating: int = 5
    order: int = 0
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).sort([("order", 1), ("createdAt", -1)]).to_list(200)
    for r in reviews:
        if isinstance(r.get('createdAt'), str):
            r['createdAt'] = datetime.fromisoformat(r['createdAt'])
    return reviews


@router.post("/reviews", response_model=Review)
async def create_review(input: ReviewIn, authorization: Optional[str] = Header(None)):
    _require_key(authorization)
    obj = Review(**input.model_dump())
    doc = obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    await db.reviews.insert_one(doc)
    return obj


@router.patch("/reviews/{review_id}")
async def update_review(review_id: str, patch: ReviewPatch, authorization: Optional[str] = Header(None)):
    _require_key(authorization)
    existing = await db.reviews.find_one({"id": review_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    update = {k: v for k, v in patch.model_dump().items() if v is not None}
    if update:
        await db.reviews.update_one({"id": review_id}, {"$set": update})
    return {"success": True, "id": review_id}


@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, authorization: Optional[str] = Header(None)):
    _require_key(authorization)
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"success": True, "id": review_id}


# The reviews currently hardcoded on the site — used once to populate the DB so
# the admin starts with them already listed and editable.
_DEFAULT_REVIEWS = [
    {"title": "Land Seller (Washington State)", "source": "RateMyAgent",
     "text": "Very informative and consistent updates. Vahid connected me with the right people to complete the sale of my property, and he was the foundation that directed the best outcome. My realtor in Washington State researched and found Vahid Rajabian to be the best — he was right!"},
    {"title": "Land Seller", "source": "RateMyAgent",
     "text": "When I first decided that I wanted to sell my land, other realtors were encouraging me to list for less than half the price of what my lot was worth. After I met Vahid he told me he would be able to sell my land at the real market value. He was patient, thorough and helpful, and even when I was willing to compromise in pricing he encouraged me that my land will sell. He gave me the confidence I needed. I highly recommend Vahid because he is honest and reliable."},
    {"title": "Lot Buyer", "source": "RateMyAgent",
     "text": "Vahid is phenomenal. He is accessible and extremely patient. My experience overall is top rated. My tip to anyone purchasing land: Do your research first and make your payments on time! It's easy as pie. Vahid is an absolute pleasure to work with."},
    {"title": "Lot Buyer", "source": "RateMyAgent",
     "text": "Exceptional Customer Service and precise and detailed information offered. Vahid offered us plot plans precisely laid out, highlighted and manually numbered each to maximize our time. We were able to complete more research in one day than previously done with another agency. We purchased our lot the exact same day."},
    {"title": "Veteran Homebuyer", "source": "RateMyAgent",
     "text": "Very Professional and very Honest!!! Thank you for an amazing experience. My family and friends now have the space to gather and participate in outdoor activities for generations to come. Thank you again for making a positive difference in our world."},
    {"title": "Buyer", "source": "RateMyAgent",
     "text": "Mr. Rajabian was extremely professional and always available to answer any questions I had. His many years of experience in Palm Bay were evident — he knows the market exceptionally well and has strong connections throughout the area."},
    {"title": "Buyer", "source": "RateMyAgent",
     "text": "Very transparent and professional."},
]


@router.post("/reviews/seed")
async def seed_reviews(authorization: Optional[str] = Header(None)):
    _require_key(authorization)
    count = await db.reviews.count_documents({})
    if count > 0:
        return {"success": True, "seeded": 0, "message": f"{count} reviews already exist — not seeding."}
    now = datetime.now(timezone.utc)
    docs = []
    for i, r in enumerate(_DEFAULT_REVIEWS):
        docs.append({
            "id": str(uuid.uuid4()),
            "name": "Verified Client",
            "title": r["title"],
            "text": r["text"],
            "source": r["source"],
            "rating": 5,
            "order": i,
            "createdAt": now.isoformat(),
        })
    await db.reviews.insert_many(docs)
    return {"success": True, "seeded": len(docs)}
