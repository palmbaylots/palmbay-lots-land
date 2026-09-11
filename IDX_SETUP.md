# Space Coast MLS IDX Integration

## Overview
This repo includes a live IDX (Internet Data eXchange) integration with Space Coast MLS via the Spark RESO Web API. Listings are fetched on-demand and displayed at `/mls-listings`.

## What's Included

### Backend (`backend/routes/idx.py`)
- **Endpoint:** `GET /api/idx/listings`
- **Purpose:** Proxies the Spark RESO OData feed so the access token is never exposed to the browser
- **Features:**
  - Caches responses for 5 minutes (to reduce API calls)
  - OData filtering by city, status, price, acreage, and keyword
  - Pagination (limit/skip)
  - RESO Property field normalization

### Frontend (`frontend/src/pages/MlsListings.jsx`)
- **Route:** `/mls-listings`
- **Features:**
  - City filter (all Space Coast MLS cities)
  - Price range filter
  - Lot size filter
  - Keyword/address search
  - Responsive grid layout
  - Photo display (when available)
  - Load more pagination
  - Graceful error handling

## Configuration

### Environment Variables

Set these in Emergent's **Secrets** management:

| Variable | Required | Example |
|----------|----------|---------|
| `SPARK_ACCESS_TOKEN` | ✅ Yes | `a50ogs64k75s2mplh1dwracpg` |
| `SPARK_BASE_URL` | ❌ No | `https://replication.sparkapi.com/Version/3/Reso/OData` |
| `CORS_ORIGINS` | ❌ No | `https://palmbaylots-land.com` |

**Note:** Never commit credentials to GitHub. Use Emergent's **Secrets** only.

### Local Development

1. Create `backend/.env` (not committed):
   ```
   SPARK_ACCESS_TOKEN=your_token_here
   SPARK_BASE_URL=https://replication.sparkapi.com/Version/3/Reso/OData
   ```

2. Backend will auto-load from `backend/.env` via `dotenv`

## Available Endpoints

### GET /api/idx/listings
Fetch MLS listings with optional filters.

**Query Parameters:**
- `city` (string) — Filter by city (e.g., "Palm Bay")
- `status` (string) — Default "Active"
- `min_price` (number)
- `max_price` (number)
- `min_acres` (number)
- `max_acres` (number)
- `q` (string) — Keyword search (searches address, city, ZIP)
- `limit` (number) — Max results per page (default 24, max 50)
- `skip` (number) — Pagination offset (default 0)

**Response:**
```json
{
  "source": "spark",
  "count": 24,
  "listings": [
    {
      "id": "ListingKey",
      "mlsNumber": "ListingId",
      "price": 89900,
      "status": "Active",
      "propertyType": "Land",
      "address": "123 Main St, Palm Bay, FL 32907",
      "city": "Palm Bay",
      "state": "FL",
      "zip": "32907",
      "beds": null,
      "baths": null,
      "livingArea": null,
      "lotAcres": 0.5,
      "lotSqft": 21780,
      "description": "Vacant residential lot…",
      "photo": "https://…",
      "updated": "2026-09-10T12:34:56Z"
    }
  ],
  "hasMore": true
}
```

## Data Flow

1. **Frontend** calls `GET /api/idx/listings?city=Palm%20Bay`
2. **Backend** builds OData filter and calls Spark API with Bearer token
3. **Spark API** returns RESO Property records
4. **Backend** normalizes fields and caches for 5 minutes
5. **Frontend** renders grid, handles pagination and filters
6. **User** clicks city/price/size filters or searches — cycle repeats

## Security

- **Token is server-side only.** The frontend never sees the Spark access token.
- **Credentials in Emergent Secrets.** Never commit `.env` files or tokens to GitHub.
- **Public repo.** The code is safe to share; only the token is sensitive.

## Deployment (Emergent)

1. **Secrets:** Add `SPARK_ACCESS_TOKEN` in Emergent workspace settings
2. **Pull from GitHub:** Latest code is ready to deploy
3. **Backend auto-loads** from Emergent's `SPARK_ACCESS_TOKEN`
4. **Re-publish:** Refresh the live site

## Troubleshooting

### "SPARK_ACCESS_TOKEN not configured"
- Check Emergent's **Secrets** has `SPARK_ACCESS_TOKEN` set
- Verify the token has valid permissions on the Spark API

### No listings returned
- Check if the city filter matches Brevard County cities in Spark's feed
- Verify the status filter (default: "Active")
- Try removing all filters to see if results load at all

### Cache issues
- Listings are cached for 5 minutes. To force a fresh pull, change a filter.

## Future Enhancements

- Store selected listings to MongoDB for featured/favorites
- Add detail page for individual MLS listings
- Email notification when a new listing matches saved criteria
- Agent contact CRM integration

## References

- Spark RESO API Docs: https://sparkapi.com/docs
- RESO Web Standard: https://www.reso.org/
- Space Coast MLS: https://www.floridamls.com/
