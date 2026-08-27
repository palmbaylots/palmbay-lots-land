"""
idx.py — Space Coast MLS (IDX) listings via the Spark RESO Web API.

Proxies the Spark replication OData feed so the browser never sees the token.
Modeled on parcel.py: a thin external-API proxy with a small in-process cache.

Auth: the Spark access token is read from the SPARK_ACCESS_TOKEN environment
variable (set it in Emergent's Secrets — never commit it). Requests send it as
an HTTP Bearer token against the version-3 RESO endpoint.
"""

from fastapi import APIRouter
import os
import time
import logging
import requests

logger = logging.getLogger(__name__)
router = APIRouter()

SPARK_BASE = os.environ.get(
    "SPARK_BASE_URL",
    "https://replication.sparkapi.com/Version/3/Reso/OData",
)
SPARK_TOKEN = os.environ.get("SPARK_ACCESS_TOKEN", "")

# RESO Property fields we return. Small $select = faster responses.
SELECT_FIELDS = ",".join([
    "ListingKey", "ListingId", "ListPrice", "StandardStatus",
    "PropertyType", "PropertySubType", "UnparsedAddress", "City",
    "StateOrProvince", "PostalCode", "BedroomsTotal",
    "BathroomsTotalInteger", "LivingArea", "LotSizeAcres",
    "LotSizeSquareFeet", "PublicRemarks", "ModificationTimestamp",
])

# Cache responses briefly so repeated filtering doesn't hammer Spark.
_CACHE = {}
_CACHE_TTL = 300  # seconds


def _odata_str(value: str) -> str:
    """Escape a string literal for an OData filter (single quotes double up)."""
    return value.replace("'", "''")


def _normalize(p: dict) -> dict:
    """Flatten a RESO Property record into the shape the frontend expects."""
    photo = None
    media = p.get("Media")
    if isinstance(media, list):
        for m in media:
            if m.get("MediaURL"):
                photo = m["MediaURL"]
                break
    return {
        "id": p.get("ListingKey") or p.get("ListingId"),
        "mlsNumber": p.get("ListingId"),
        "price": p.get("ListPrice"),
        "status": p.get("StandardStatus"),
        "propertyType": p.get("PropertySubType") or p.get("PropertyType"),
        "address": p.get("UnparsedAddress")
        or ", ".join(filter(None, [p.get("City"), p.get("StateOrProvince"),
                                    p.get("PostalCode")])),
        "city": p.get("City"),
        "state": p.get("StateOrProvince"),
        "zip": p.get("PostalCode"),
        "beds": p.get("BedroomsTotal"),
        "baths": p.get("BathroomsTotalInteger"),
        "livingArea": p.get("LivingArea"),
        "lotAcres": p.get("LotSizeAcres"),
        "lotSqft": p.get("LotSizeSquareFeet"),
        "description": p.get("PublicRemarks") or "",
        "photo": photo,
        "updated": p.get("ModificationTimestamp"),
    }


@router.get("/idx/listings")
def idx_listings(
    city: str = "",
    status: str = "Active",
    min_price: float = None,
    max_price: float = None,
    min_acres: float = None,
    max_acres: float = None,
    q: str = "",
    limit: int = 24,
    skip: int = 0,
):
    """Return Space Coast MLS listings, filtered. Falls back gracefully on error.

    Query params: city, status (default Active), min_price, max_price,
    min_acres, max_acres, q (keyword), limit (<=50), skip.
    """
    if not SPARK_TOKEN:
        return {"source": "error", "reason": "SPARK_ACCESS_TOKEN not configured.",
                "count": 0, "listings": []}

    limit = max(1, min(int(limit), 50))
    skip = max(0, int(skip))

    clauses = []
    if status:
        clauses.append(f"StandardStatus eq '{_odata_str(status)}'")
    if city:
        clauses.append(f"City eq '{_odata_str(city)}'")
    if min_price is not None:
        clauses.append(f"ListPrice ge {float(min_price)}")
    if max_price is not None:
        clauses.append(f"ListPrice le {float(max_price)}")
    if min_acres is not None:
        clauses.append(f"LotSizeAcres ge {float(min_acres)}")
    if max_acres is not None:
        clauses.append(f"LotSizeAcres le {float(max_acres)}")
    if q:
        s = _odata_str(q)
        clauses.append(
            f"(contains(UnparsedAddress,'{s}') or contains(City,'{s}') "
            f"or contains(PostalCode,'{s}'))"
        )
    odata_filter = " and ".join(clauses)

    params = {
        "$select": SELECT_FIELDS,
        "$expand": "Media",
        "$top": limit,
        "$skip": skip,
        "$orderby": "ModificationTimestamp desc",
    }
    if odata_filter:
        params["$filter"] = odata_filter

    cache_key = str(sorted(params.items()))
    hit = _CACHE.get(cache_key)
    if hit and time.time() - hit[0] < _CACHE_TTL:
        return hit[1]

    try:
        resp = requests.get(
            f"{SPARK_BASE}/Property",
            params=params,
            headers={
                "Authorization": f"Bearer {SPARK_TOKEN}",
                "Accept": "application/json",
                "User-Agent": "palmbaylots-land-idx/1.0",
            },
            timeout=20,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Spark IDX request failed: {e}")
        return {"source": "error",
                "reason": "Live MLS feed is temporarily unavailable.",
                "count": 0, "listings": []}

    listings = [_normalize(p) for p in data.get("value", [])]
    payload = {"source": "spark", "count": len(listings), "listings": listings,
               "hasMore": bool(data.get("@odata.nextLink"))}
    _CACHE[cache_key] = (time.time(), payload)
    return payload
