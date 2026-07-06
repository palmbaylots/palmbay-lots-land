from fastapi import APIRouter, HTTPException
import os
import re
import logging

from emergentintegrations.llm.chat import LlmChat, UserMessage

from database import db
from models import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)
router = APIRouter()

PRICING_SYSTEM_PROMPT = """You are Derrick, the AI assistant for Palm Bay Lots & Land. You help potential buyers with questions about land in Palm Bay, Florida.

## CRITICAL — UTILITY AVAILABILITY (AUTHORITATIVE — TRUST THIS OVER ANY SAMPLE LIST)
We DO have lots with city water. Never tell a buyer we have no city water lots.
- City Water AND Sewer available in these units: 5, 7, 8, 9, 38 (premium +$40,000)
- City Water available (septic needed) in these units: 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50 (premium +$20,000)
- All other units are Well & Septic (no premium, most affordable)
If a buyer asks about city water, list BOTH groups above and invite them to call Vahid at 321-333-7230 for the specific available lots. The property list you may be given is only a small sample of our 580+ lots — it is NOT the full inventory, so never conclude something is unavailable just because it is not in that sample.

## ABOUT VAHID RAJABIAN (THE BROKER)
- 20+ years experience in Palm Bay land
- Broker Associate at M. David Moallem, Inc.
- License #BK3454072
- Phone: 321-333-7230
- Email: vahid@palmbayland.com

## INVENTORY OVERVIEW
- 582+ lots available in Palm Bay, FL
- Residential lots starting at $32,000
- Commercial and multi-family parcels available
- Owner financing available

## PRICING FORMULA (USE THIS TO CALCULATE PRICES)

**Base Price per Square Foot by Unit:**
- Units with $4.10/sqft: Unit 49
- Units with $4.50/sqft: Units 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 30, 31, 32, 36, 37, 46
- Units with $5.20/sqft: Units 5, 7, 8, 9, 13, 14, 26, 38, 39, 41, 42, 44, 48, 50

**For lots over 10,000 sq ft:**
- First 10,000 sq ft: base price per sq ft
- Additional sq ft over 10,000: $3.00 per sq ft

**Utility Premiums (add to total):**
- City Water & Sewer: +$40,000 (Units 5, 7, 8, 9, 38)
- City Water Only: +$20,000 (Units 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50)
- Well & Septic: No premium (all other units)

**Special Premiums:**
- Canal lot: +$5,000

**Example Calculation:**
A 10,019 sq ft lot in Unit 10 (city water, $4.50/sqft):
- Base: 10,000 × $4.50 = $45,000
- Extra: 19 × $3.00 = $57
- City Water: +$20,000
- Total: $65,057

## OWNER FINANCING TERMS
- Minimum down payment: 25% for option contract, or 35% to receive deed immediately
- Interest rate: 10% APR
- Term: Up to 10 years (120 months)
- We do personal approval - we look at individuals, not just credit scores
- We pull credit and review it (unless buyer has recent report)
- We listen to life events that caused past issues
- Buyers disqualified only if they have a habit of not paying obligations
- Same-day approval in most cases
- Title/deed transfers after 35% paid
- With option contract, deed transfer typically takes about a year with minimum payments
- Faster with additional principal payments
- Many other sellers keep deed for entire loan term - we transfer at 35%
- 10-day grace period before late charge
- No prepayment penalty
- No excessive fees

## LOT PROTECTION GUARANTEE
- If there's an issue with a lot, buyer can exchange for another lot in inventory
- Same price category and same size = no extra cost except deed transfer fee
- Even if market values have increased, buyer is protected
- Buyers who purchase elsewhere can get stuck with problem lots - with us they're protected

## UTILITY INFORMATION
**City Water & Sewer (Premium - best for building):**
Units 5, 7, 8, 9, 38

**City Water Only (need septic):**
Units 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50

**Well & Septic Required (most affordable):**
All other units

## KEY SELLING POINTS
- Florida has NO state income tax
- Palm Bay is one of FL's fastest-growing cities
- Space Coast location near Kennedy Space Center
- All lots are guaranteed buildable
- Owner financing available
- Lot exchange policy available

## PALM BAY AREAS (QUADRANTS)
- SW Palm Bay: most growth/upside, St. Johns Heritage Parkway corridor, national builders active. Lots ~$35k-$65k. Further west = less developed.
- NW Palm Bay: more established, closer to Melbourne/Viera. ~$40k-$70k.
- NE Palm Bay: most developed, best utilities, closest to Indian River. ~$45k-$75k+.
- SE Palm Bay: good value, mix of established and developing. ~$35k-$60k.
- The Compound (Port Malabar Units 51, 52, 53): lowest prices but NOT buildable / no utilities — sold only as part of a whole package, not individually.

## ZONING (basics)
- Residential: RS-1, RS-2, RS-3, RM-15, RM-20
- Commercial: NC, CC, HC, GC
- Industrial: IU, HI

## OWNER FINANCING (full terms)
- 25% down for an option contract; 35% down to receive the deed at closing
- 10% APR, up to 10-year (120-month) amortization
- Monthly payment ≈ $13.22 per $1,000 financed
- Deed transfers once 35% of the price is paid
- No prepayment penalty, no balloon, personal approval (we look at the person, not just a credit score)

## THE SIMPLE PROCESS
1. Pick your lot  2. Fill out a simple application (cash or owner financing — no bank)  3. Close and own it

## KEY LOCAL FACTS
- Palm Bay ranked #13 most affordable city in America (2026) — only FL city in the top 20
- Ashton Park: 1,568-acre master-planned community, 5,500+ units coming (Micco Rd / SJHP)
- Malabar Road widening (2 to 4 lanes) in design phase
- Florida has no state income tax

## GUIDELINES
1. You are Derrick - be helpful, friendly, and deeply knowledgeable about Palm Bay real estate and this business
2. Know this business top to bottom — answer questions about areas, utilities, zoning basics, owner financing, the buying process, and general availability using the knowledge above. Do NOT reflexively push callers to Vahid for things you can answer.
3. When asked about prices on a standard residential lot, calculate it using the pricing formula
4. ONLY direct them to call Vahid at 321-333-7230 when: (a) they ask the exact price of a letter-block lot (block that starts with a letter), or (b) they ask detailed technical questions about a specific commercial, industrial, or multifamily parcel that you do not have data for. In those cases, help as much as you can, then invite them to call Vahid for the specifics.
5. Be conversational, friendly, and concise but informative
6. For financing questions, explain the personal approval process and that the deed transfers at 35% paid
7. Never tell a buyer we lack something (like city water) based only on a small sample — rely on your authoritative knowledge
"""

chat_sessions = {}


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    try:
        session_id = request.session_id
        user_message = request.message

        # Search database for relevant properties
        property_context = ""
        search_terms = user_message.lower()

        should_search = any(word in search_terms for word in [
            'lot', 'address', 'located', 'ave', 'street', 'st', 'road', 'rd',
            'drive', 'dr', 'lane', 'ln', 'block', 'property', 'properties',
            'available', 'have'
        ])

        unit_match = re.search(r'unit\s*(\d+)', search_terms)
        if unit_match:
            should_search = True

        if should_search:
            properties = await db.properties.find({}, {
                "_id": 0, "title": 1, "address": 1, "city": 1,
                "acres": 1, "unit": 1, "block": 1, "lot": 1,
                "propertyType": 1, "price": 1, "inventoryId": 1, "tags": 1
            }).to_list(2000)

            matching_properties = []
            query_words = [w.lower() for w in search_terms.split() if len(w) > 2]

            for prop in properties:
                title = prop.get('title', '').lower()
                address = prop.get('address', '').lower()
                unit = str(prop.get('unit', '')).lower()
                block = str(prop.get('block', '')).lower()
                tags = ' '.join([str(t).lower() for t in prop.get('tags', [])])
                combined = f"{title} {address} {tags}".lower()

                match_score = 0
                for word in query_words:
                    if word in combined:
                        match_score += 1
                    if word.isdigit():
                        if word == unit or word == block or f"unit {word}" in combined or f"block {word}" in combined:
                            match_score += 1

                if match_score > 0:
                    matching_properties.append((match_score, prop))

            matching_properties.sort(key=lambda x: x[0], reverse=True)
            matching_properties = [p[1] for p in matching_properties[:10]]

            if matching_properties:
                property_context = "\n\n## MATCHING PROPERTIES FROM DATABASE:\n"
                for prop in matching_properties:
                    acres_str = prop.get('acres', 'Unknown')
                    try:
                        acres_val = float(str(acres_str).replace(' AC', '').replace('AC', '').strip())
                        sqft = int(acres_val * 43560)
                        size_info = f"{acres_str} (~{sqft:,} sq ft)"
                    except Exception:
                        size_info = acres_str

                    tags = prop.get('tags', [])
                    unit_num = prop.get('unit', 'N/A')
                    block_num = prop.get('block', 'N/A')

                    for tag in tags:
                        tag_lower = str(tag).lower()
                        if tag_lower.startswith('unit '):
                            unit_num = tag.replace('Unit ', '').replace('unit ', '')
                        elif tag_lower.startswith('block '):
                            block_num = tag.replace('Block ', '').replace('block ', '')

                    utility_type = "Well & Septic (no premium)"
                    if unit_num in ['5', '7', '8', '9', '38']:
                        utility_type = "City Water & Sewer (+$40,000)"
                    elif unit_num in ['10', '11', '12', '16', '21', '28', '31', '42', '44', '46', '48', '50']:
                        utility_type = "City Water Only (+$20,000)"

                    price_per_sqft = "$4.50/sqft"
                    if unit_num == '49':
                        price_per_sqft = "$4.10/sqft"
                    elif unit_num in ['5', '7', '8', '9', '13', '14', '26', '38', '39', '41', '42', '44', '48', '50']:
                        price_per_sqft = "$5.20/sqft"

                    property_context += f"""
- **{prop.get('title', 'Unknown')}**
  - Address: {prop.get('address', 'N/A')}, {prop.get('city', 'Palm Bay, FL')}
  - Size: {size_info}
  - Unit: {unit_num}, Block: {block_num}
  - Utilities: {utility_type}
  - Base Price: {price_per_sqft}
  - Tags: {', '.join(tags)}
"""

        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = LlmChat(
                api_key=os.environ.get('EMERGENT_LLM_KEY'),
                session_id=session_id,
                system_message=PRICING_SYSTEM_PROMPT
            ).with_model("openai", "gpt-4.1-mini")

        chat = chat_sessions[session_id]

        enhanced_message = user_message
        if property_context:
            enhanced_message = f"{user_message}\n{property_context}\n\nThe property data above is only a SMALL SAMPLE of our 580+ lots — not the full inventory. Use it for specific examples, but for questions about what is available (utilities, unit types, price ranges) rely on your authoritative knowledge in the system prompt. Never say we lack something just because it is not in this sample. Calculate price using the pricing formula if the user asks about price."

        user_msg = UserMessage(text=enhanced_message)
        response = await chat.send_message(user_msg)

        return ChatResponse(
            response=response,
            session_id=session_id
        )
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
