from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from typing import List
from datetime import datetime, timezone
from pathlib import Path
import uuid
import logging

from database import db
from models import Property, PropertyCreate

logger = logging.getLogger(__name__)
router = APIRouter()


def _fix_datetimes(prop):
    if isinstance(prop.get('createdAt'), str):
        prop['createdAt'] = datetime.fromisoformat(prop['createdAt'])
    if isinstance(prop.get('updatedAt'), str):
        prop['updatedAt'] = datetime.fromisoformat(prop['updatedAt'])


@router.get("/properties", response_model=List[Property])
async def get_properties():
    properties = await db.properties.find({}, {"_id": 0}).sort("createdAt", -1).to_list(2000)
    for prop in properties:
        _fix_datetimes(prop)
    return properties


@router.get("/properties/featured", response_model=List[Property])
async def get_featured_properties():
    properties = await db.properties.find({"featured": True}, {"_id": 0}).sort("createdAt", -1).to_list(100)
    for prop in properties:
        _fix_datetimes(prop)
    return properties


@router.get("/properties/curated", response_model=List[Property])
async def get_curated_properties():
    """Get only curated listings (not inventory lots). These have tags and no inventoryId."""
    properties = await db.properties.find({
        "tags": {"$exists": True, "$ne": []},
        "$or": [
            {"inventoryId": {"$exists": False}},
            {"inventoryId": ""},
            {"inventoryId": None}
        ]
    }, {"_id": 0}).sort("createdAt", -1).to_list(100)
    for prop in properties:
        _fix_datetimes(prop)
    return properties


@router.get("/properties/inventory", response_model=List[Property])
async def get_inventory_properties():
    """Get only inventory lots (have inventoryId)."""
    properties = await db.properties.find({
        "inventoryId": {"$exists": True, "$ne": ""}
    }, {"_id": 0}).sort("createdAt", -1).to_list(2000)
    for prop in properties:
        _fix_datetimes(prop)
    return properties


@router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    prop = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    _fix_datetimes(prop)
    return prop


@router.post("/properties", response_model=Property)
async def create_property(input: PropertyCreate):
    prop_dict = input.model_dump()
    prop_obj = Property(**prop_dict)
    doc = prop_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['updatedAt'] = doc['updatedAt'].isoformat()
    await db.properties.insert_one(doc)
    return prop_obj


@router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: str, input: PropertyCreate):
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")

    update_dict = input.model_dump()
    update_dict['updatedAt'] = datetime.now(timezone.utc).isoformat()

    await db.properties.update_one(
        {"id": property_id},
        {"$set": update_dict}
    )

    updated = await db.properties.find_one({"id": property_id}, {"_id": 0})
    _fix_datetimes(updated)
    return updated


@router.patch("/properties/{property_id}/sold")
async def toggle_property_sold(property_id: str, sold: bool):
    """Quick toggle to mark a property as sold or available."""
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")

    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "sold": sold,
            "status": "sold" if sold else "available",
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }}
    )

    return {"success": True, "id": property_id, "sold": sold}


ALLOWED_STATUSES = {"available", "under_contract", "sold"}


@router.patch("/properties/{property_id}/status")
async def set_property_status(property_id: str, status: str):
    """Set listing status: available, under_contract, or sold. Keeps the public
    `sold` flag in sync so the site's Sold badge keeps working."""
    if status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Use one of: {', '.join(sorted(ALLOWED_STATUSES))}")

    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")

    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "status": status,
            "sold": status == "sold",
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }}
    )

    return {"success": True, "id": property_id, "status": status}


@router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    existing = await db.properties.find_one({"id": property_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Property not found")
    await db.properties.delete_one({"id": property_id})
    return {"success": True, "message": "Property deleted successfully"}


@router.post("/seed-inventory")
async def seed_inventory(password: str = "PalmBay2024!"):
    """Seed inventory from CSV and tax mapping data."""
    import csv
    import io
    import json as json_mod

    csv_path = Path(__file__).parent.parent / "frontend" / "public" / "inventory.csv"
    tax_path = Path(__file__).parent.parent / "frontend" / "public" / "taxMapping.json"

    # Also check relative to backend dir
    if not csv_path.exists():
        csv_path = Path(__file__).parent.parent / "frontend" / "public" / "inventory.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="inventory.csv not found")

    tax_mapping = {}
    if tax_path.exists():
        with open(tax_path, 'r') as f:
            tax_mapping = json_mod.load(f)

    with open(csv_path, 'r') as f:
        csv_text = f.read()

    reader = csv.reader(io.StringIO(csv_text))
    next(reader)

    now = datetime.now(timezone.utc).isoformat()
    records = []

    for row in reader:
        if len(row) < 10:
            continue
        inv_id = row[0].strip()
        unit_val = row[4].strip()
        block_val = row[5].strip()
        lot_val = row[6].strip()
        st_num = row[7].strip()
        st_name = row[8].strip()
        address = f"{st_num} {st_name}".strip()

        records.append({
            "id": str(uuid.uuid4()),
            "inventoryId": inv_id,
            "title": address if address else f"Unit {unit_val}, Block {block_val}, Lot {lot_val}",
            "address": address,
            "city": row[9].strip() or "Palm Bay",
            "price": "Contact for Price",
            "acres": f"{row[3].strip()} AC" if row[3].strip() else "",
            "propertyType": "Residential",
            "tags": [],
            "description": f"Residential lot in Palm Bay. Unit {unit_val}, Block {block_val}, Lot {lot_val}.",
            "featured": False,
            "image": "",
            "county": row[1].strip(),
            "owner": row[2].strip(),
            "unit": unit_val,
            "block": block_val,
            "lot": lot_val,
            "streetNumber": st_num,
            "streetName": st_name,
            "taxAccount": tax_mapping.get(inv_id, ""),
            "createdAt": now,
            "updatedAt": now,
        })

    if not records:
        raise HTTPException(status_code=400, detail="No records parsed from CSV")

    # Clean ALL residential inventory (old and new) — keeps curated listings with tags
    await db.properties.delete_many({
        "propertyType": "Residential",
        "$or": [
            {"inventoryId": {"$exists": True, "$ne": ""}},
            {"tags": {"$size": 0}},
            {"tags": {"$exists": False}},
        ]
    })

    await db.properties.insert_many(records)
    return {"success": True, "message": f"Seeded {len(records)} inventory lots into database"}


# Sitemap endpoint
@router.get("/sitemap.xml")
async def get_sitemap():
    base_url = "https://palmbaylots-land.com"

    static_pages = [
        ("", "1.0", "weekly"),
        ("/about", "0.8", "monthly"),
        ("/listings", "0.9", "daily"),
        ("/inventory", "0.9", "daily"),
        ("/price-guide", "0.8", "weekly"),
        ("/contact", "0.7", "monthly"),
        ("/sell-land", "0.8", "weekly"),
        ("/blog", "0.8", "weekly"),
        ("/palm-bay-land-for-sale", "0.9", "weekly"),
        ("/owner-financing-land-florida", "0.9", "weekly"),
        ("/quarter-acre-lots-palm-bay", "0.9", "weekly"),
        ("/buildable-lots-palm-bay", "0.9", "weekly"),
        ("/guide/build-on-land-palm-bay", "0.9", "weekly"),
        ("/guide/septic-vs-sewer-palm-bay", "0.9", "weekly"),
        ("/guide/owner-financing-what-to-watch", "0.9", "weekly"),
        ("/guide/buy-land-without-realtor", "0.9", "weekly"),
        ("/guide/flood-zones-palm-bay", "0.9", "weekly"),
        ("/listing/328-malabar-rd", "0.8", "monthly"),
        ("/listing/scattered-lots", "0.8", "monthly"),
        ("/listing/2418-fleming-ave", "0.8", "monthly"),
    ]

    properties = await db.properties.find({}, {"title": 1, "updatedAt": 1}).to_list(10000)

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    for path, priority, changefreq in static_pages:
        xml_parts.append(f'''  <url>
    <loc>{base_url}{path}</loc>
    <priority>{priority}</priority>
    <changefreq>{changefreq}</changefreq>
  </url>''')

    for prop in properties:
        title = prop.get("title", "")
        slug = title.lower()
        for char in [' ', ',', '.', '#', '&', "'", '"']:
            slug = slug.replace(char, '-')
        while '--' in slug:
            slug = slug.replace('--', '-')
        slug = slug.strip('-')

        updated = prop.get("updatedAt", "")
        lastmod = ""
        if updated:
            if isinstance(updated, str):
                lastmod = f"\n    <lastmod>{updated[:10]}</lastmod>"
            elif hasattr(updated, 'isoformat'):
                lastmod = f"\n    <lastmod>{updated.strftime('%Y-%m-%d')}</lastmod>"

        xml_parts.append(f'''  <url>
    <loc>{base_url}/property/{slug}</loc>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>{lastmod}
  </url>''')

    xml_parts.append('</urlset>')
    xml_content = '\n'.join(xml_parts)
    return Response(content=xml_content, media_type="application/xml")
