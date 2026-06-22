# Test Credentials

## Admin Dashboard (/admin)
- URL: `${REACT_APP_BACKEND_URL}/admin`
- Password: `PalmBay2024!`

## Blog Publishing API
- Bearer token (Authorization header): `M-quMx2zP7boDfUQ5jahRdSPJYciiAv4a2-Kt5FC60I`
- Used for: `POST/PATCH/DELETE /api/blogs/*` and `POST /api/blogs/{slug}/reindex`
- Retrievable from server via: `POST /api/admin/blog-key` with `{"password":"PalmBay2024!"}`

## IndexNow
- Key file: `https://palmbaylots-land.com/MquMx2zP7boDfUQ5jahRdSPJYciiAv4a.txt`
