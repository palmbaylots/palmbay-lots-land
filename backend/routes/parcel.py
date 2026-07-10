from fastapi import APIRouter
import urllib.request
import urllib.parse
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Brevard County Property Appraiser parcels layer (public ArcGIS MapServer).
# Layer 4 = Parcels; TaxAcct field matches our lots' taxAccount.
GIS_URL = ("https://gis.brevardfl.gov/gissrv/rest/services/Base_Map/"
           "Parcel_New_WKID2881/MapServer/4/query")

# Simple in-process cache so we don't re-hit the county server for the same lot.
_cache = {}


@router.get("/parcel/{tax_account}")
def get_parcel(tax_account: str):
    """Return the parcel boundary (lat/lon ring) for a lot's tax account.
    Used by the inventory map to draw the red outline on satellite imagery."""
    acct = ''.join(c for c in str(tax_account) if c.isdigit())
    if not acct:
        return {"found": False}
    if acct in _cache:
        return _cache[acct]

    params = urllib.parse.urlencode({
        "where": f"TaxAcct={acct}",
        "outFields": "TaxAcct,Acres,SubBlock,Lot",
        "returnGeometry": "true",
        "outSR": "4326",
        "f": "json",
    })
    try:
        req = urllib.request.Request(f"{GIS_URL}?{params}",
                                     headers={"User-Agent": "palmbaylots-land"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        logger.error(f"Parcel lookup failed for {acct}: {e}")
        return {"found": False}

    feats = data.get("features", [])
    if not feats or "geometry" not in feats[0] or not feats[0]["geometry"].get("rings"):
        result = {"found": False}
        _cache[acct] = result
        return result

    ring = feats[0]["geometry"]["rings"][0]  # [[lon, lat], ...]
    latlon = [[pt[1], pt[0]] for pt in ring]
    xs = [pt[0] for pt in ring]
    ys = [pt[1] for pt in ring]
    result = {
        "found": True,
        "center": [sum(ys) / len(ys), sum(xs) / len(xs)],
        "ring": latlon,
        "acres": feats[0]["attributes"].get("Acres"),
    }
    _cache[acct] = result
    return result
