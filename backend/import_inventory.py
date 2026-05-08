import csv
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def import_inventory():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Read CSV file
    csv_path = '/app/frontend/public/inventory.csv'
    properties = []
    
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Build address from street number and name
            street_num = row.get('St #', '').strip()
            street_name = row.get('St Name', '').strip()
            address = f"{street_num} {street_name}".strip()
            
            # Create property document
            prop = {
                'id': str(uuid.uuid4()),
                'inventoryId': row.get('ID Card', '').strip(),
                'title': address if address else f"Lot {row.get('Lot', '')} Block {row.get('Block', '')}",
                'address': address,
                'city': f"{row.get('City', 'Palm Bay').strip()}, FL",
                'price': 'Contact for Price',  # Price not in CSV
                'acres': f"{row.get('Acres', '0.23')} AC",
                'propertyType': 'Residential',
                'tags': ['Buildable', f"Unit {row.get('Unit', '')}", f"Block {row.get('Block', '')}"],
                'description': f"Residential lot in {row.get('City', 'Palm Bay')}. Unit {row.get('Unit', '')}, Block {row.get('Block', '')}, Lot {row.get('Lot', '')}.",
                'featured': False,
                'image': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=716&h=444&fit=crop',
                'unit': row.get('Unit', '').strip(),
                'block': row.get('Block', '').strip(),
                'lot': row.get('Lot', '').strip(),
                'createdAt': datetime.now(timezone.utc).isoformat(),
                'updatedAt': datetime.now(timezone.utc).isoformat()
            }
            properties.append(prop)
    
    # Clear existing properties (optional - comment out if you want to keep existing)
    # await db.properties.delete_many({})
    
    # Insert all properties
    if properties:
        result = await db.properties.insert_many(properties)
        print(f"Imported {len(result.inserted_ids)} properties into database")
    else:
        print("No properties to import")
    
    client.close()

if __name__ == '__main__':
    asyncio.run(import_inventory())
