---
name: palmbay-listing-writer
description: Write compelling, accurate listing copy (title + description) for a Palm Bay lot from its raw data (unit/block/lot, size, utilities, zoning, quadrant), in brand voice and consistent with the pricing/utility rules. Use when adding or improving a property listing, preparing Crexi/marketing copy, or bulk-refreshing inventory descriptions. Matches the Property model fields.
---

# Palm Bay Listing Writer

Read `CLAUDE.md`. Copy must be **accurate to the data** — never invent utilities, price, or
buildability. Cross-check utilities against the unit rules in `CLAUDE.md`/`chat.py`.

## Inputs you need
Unit, Block, Lot, size (acres/sqft), street address, quadrant (SW/NW/NE/SE), zoning/FLU,
water/sewer, canal (y/n), and whether cash-only. Ask for anything missing rather than guess.

## What to produce (maps to `Property` in `backend/models.py`)
- **title:** clear and searchable, e.g. `"0.23-Acre Buildable Lot — Unit 10, SW Palm Bay (Owner Financing)"`.
- **description:** 60–120 words. Hit: size, quadrant + what's nearby, utility situation
  (using the correct premium tier), buildable status, owner-financing hook, and one honest
  differentiator (lot exchange guarantee / personal approval / no bank). End with the phone.
- Suggested **tags** (e.g. `["Unit 10", "Block 5", "Residential", "Owner Financing", "City Water"]`).
- If asked, compute a price with the pricing formula from `CLAUDE.md` and show the math,
  but clearly label it an estimate and defer exact letter-block/commercial pricing to Vahid.

Write results to `content/listings/<unit>-<block>-<lot>.md` (or a batch file) for review.
Never publish/edit the live DB without the user's explicit go-ahead.
