from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from datetime import datetime, timezone
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import database connection
from database import db, client
from seed_data import CREXI_LISTINGS

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import and include route modules
from routes.leads import router as leads_router
from routes.properties import router as properties_router
from routes.chat import router as chat_router
from routes.images import router as images_router
from routes.blogs import router as blogs_router
from routes.admin import router as admin_router

api_router.include_router(leads_router)
api_router.include_router(properties_router)
api_router.include_router(chat_router)
api_router.include_router(images_router)
api_router.include_router(blogs_router)
api_router.include_router(admin_router)


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_seed_inventory():
    """Auto-seed inventory from CSV if database has no inventory lots"""
    import csv
    import io
    import json as json_mod

    try:
        now = datetime.now(timezone.utc).isoformat()

        # Count only records that have a real inventoryId
        inv_count = await db.properties.count_documents({"inventoryId": {"$exists": True, "$ne": ""}})
        
        # Also count total to detect duplicates
        total_count = await db.properties.count_documents({})
        
        inventory_ok = inv_count > 0 and inv_count <= 600 and total_count <= 700
        
        if total_count > 700:
            # Duplicates detected — clean everything and re-seed
            logger.warning(f"Duplicate records detected: {total_count} total. Cleaning and re-seeding...")
            # Keep only curated listings (have tags, no inventoryId)
            await db.properties.delete_many({
                "$or": [
                    {"inventoryId": {"$exists": True, "$ne": ""}},
                    {"tags": {"$size": 0}},
                    {"tags": {"$exists": False}},
                ]
            })
            inv_count = 0  # Force re-seed
            inventory_ok = False

        if inventory_ok:
            logger.info(f"Inventory already seeded: {inv_count} lots, {total_count} total")
        else:
            csv_path = Path(__file__).parent.parent / "frontend" / "public" / "inventory.csv"
            tax_path = Path(__file__).parent.parent / "frontend" / "public" / "taxMapping.json"

            if not csv_path.exists():
                logger.warning("inventory.csv not found, skipping inventory auto-seed")
            else:
                tax_mapping = {}
                if tax_path.exists():
                    with open(tax_path, 'r') as f:
                        tax_mapping = json_mod.load(f)

                with open(csv_path, 'r') as f:
                    csv_text = f.read()

                reader = csv.reader(io.StringIO(csv_text))
                next(reader)

                records = []

                for row in reader:
                    if len(row) < 10:
                        continue
                    inv_id = row[0].strip()
                    address = f"{row[7].strip()} {row[8].strip()}".strip()
                    unit_val = row[4].strip()
                    block_val = row[5].strip()
                    lot_val = row[6].strip()

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
                        "streetNumber": row[7].strip(),
                        "streetName": row[8].strip(),
                        "taxAccount": tax_mapping.get(inv_id, ""),
                        "createdAt": now,
                        "updatedAt": now,
                    })

                if records:
                    # Clean ALL residential properties that look like inventory
                    await db.properties.delete_many({
                        "propertyType": "Residential",
                        "$or": [
                            {"inventoryId": {"$exists": True, "$ne": ""}},
                            {"tags": {"$size": 0}},
                            {"tags": {"$exists": False}},
                        ]
                    })

                    await db.properties.insert_many(records)
                    logger.info(f"Auto-seeded {len(records)} inventory lots from CSV")

        # Seed curated Crexi listings (21 real listings) — always ensure exact count
        curated_count = await db.properties.count_documents({
            "tags": {"$exists": True, "$ne": []},
            "$or": [
                {"inventoryId": {"$exists": False}},
                {"inventoryId": ""},
                {"inventoryId": None},
            ],
        })
        if curated_count != len(CREXI_LISTINGS):
            # Clear existing curated so we don't accumulate duplicates or stale data
            await db.properties.delete_many({
                "tags": {"$exists": True, "$ne": []},
                "$or": [
                    {"inventoryId": {"$exists": False}},
                    {"inventoryId": ""},
                    {"inventoryId": None},
                ],
            })
            curated_records = []
            for listing in CREXI_LISTINGS:
                curated_records.append({
                    "id": str(uuid.uuid4()),
                    "title": listing.get("title", ""),
                    "address": listing.get("address", ""),
                    "city": listing.get("city", "Palm Bay, FL"),
                    "price": listing.get("price", "Contact for Price"),
                    "acres": listing.get("acres", ""),
                    "propertyType": listing.get("propertyType", "Land"),
                    "tags": listing.get("tags", []),
                    "description": listing.get("description", ""),
                    "featured": listing.get("featured", False),
                    "image": listing.get("image", ""),
                    "crexiUrl": listing.get("crexiUrl", ""),
                    "inventoryId": "",
                    "county": "",
                    "owner": "",
                    "unit": "",
                    "block": "",
                    "lot": "",
                    "streetNumber": "",
                    "streetName": "",
                    "taxAccount": "",
                    "createdAt": now,
                    "updatedAt": now,
                })
            if curated_records:
                await db.properties.insert_many(curated_records)
                logger.info(f"Auto-seeded {len(curated_records)} curated Crexi listings")
    except Exception as e:
        logger.error(f"Auto-seed error: {str(e)}")


@app.on_event("startup")
async def startup_seed_blogs():
    """Non-destructive: seed blogs collection from seed_blogs.json on first run."""
    import json as json_mod
    try:
        existing = await db.blogs.count_documents({})
        if existing > 0:
            logger.info(f"Blogs collection already has {existing} docs — skipping seed")
            return
        seed_path = Path(__file__).parent / "seed_blogs.json"
        if not seed_path.exists():
            logger.warning("seed_blogs.json not found — skipping blog seed")
            return
        with open(seed_path, 'r') as f:
            docs = json_mod.load(f)
        if not docs:
            return
        now = datetime.now(timezone.utc).isoformat()
        for d in docs:
            d.setdefault("faqs", [])
            d["publishedAt"] = now
            d["updatedAt"] = now
        await db.blogs.insert_many(docs)
        # Ensure unique slug index
        await db.blogs.create_index("slug", unique=True)
        logger.info(f"Seeded {len(docs)} blogs into MongoDB")
    except Exception as e:
        logger.error(f"Blog seed error: {e}")


# IndexNow key verification file is served by the React frontend at
# /app/frontend/public/{KEY}.txt (see services/indexing.py for the key).


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
