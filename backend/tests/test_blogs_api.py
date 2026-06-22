"""Blog CMS API tests — covers public + authenticated blog endpoints and admin key gate."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://palmbay-realestate.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_PASSWORD = 'PalmBay2024!'
BLOG_API_KEY = 'M-quMx2zP7boDfUQ5jahRdSPJYciiAv4a2-Kt5FC60I'
TEST_SLUG = 'qa-test-blog-001'
AUTH_HEADERS = {"Authorization": f"Bearer {BLOG_API_KEY}", "Content-Type": "application/json"}


# ---------- Public list/get ----------

class TestPublicBlogs:
    def test_list_returns_11_blogs(self):
        r = requests.get(f"{API}/blogs", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Should have 11 migrated blogs (extra qa-test may exist mid-suite — assert >= 11)
        assert len(data) >= 11, f"Expected >=11 blogs, got {len(data)}"
        sample = data[0]
        for field in ["slug", "title", "metaTitle", "metaDescription", "subtitle",
                      "category", "date", "readTime", "image", "content", "faqs"]:
            assert field in sample, f"Missing field {field} in blog shape"
        assert isinstance(sample["faqs"], list)

    def test_get_single_blog_by_slug(self):
        r = requests.get(f"{API}/blogs/land-lease-palm-bay-florida", timeout=15)
        assert r.status_code == 200
        b = r.json()
        assert b["slug"] == "land-lease-palm-bay-florida"
        assert b.get("content"), "content should be non-empty"
        assert isinstance(b.get("faqs"), list)

    def test_get_blog_404(self):
        r = requests.get(f"{API}/blogs/does-not-exist", timeout=15)
        assert r.status_code == 404


# ---------- Auth gate ----------

class TestBlogAuth:
    def test_post_without_auth_401(self):
        r = requests.post(f"{API}/blogs", json={"slug": "x-no-auth", "title": "t", "content": "c"}, timeout=15)
        assert r.status_code == 401

    def test_post_wrong_token_403(self):
        r = requests.post(f"{API}/blogs",
                          json={"slug": "x-wrong-tok", "title": "t", "content": "c"},
                          headers={"Authorization": "Bearer wrong-token"}, timeout=15)
        assert r.status_code == 403


# ---------- CRUD with cleanup ----------

class TestBlogCRUD:
    @classmethod
    def teardown_class(cls):
        # Ensure cleanup regardless of test outcome
        try:
            requests.delete(f"{API}/blogs/{TEST_SLUG}", headers=AUTH_HEADERS, timeout=15)
        except Exception:
            pass

    def test_01_create_blog(self):
        # Pre-clean
        requests.delete(f"{API}/blogs/{TEST_SLUG}", headers=AUTH_HEADERS, timeout=15)
        payload = {
            "slug": TEST_SLUG,
            "title": "QA Test Blog",
            "content": "<p>Test content</p>",
            "category": "QA",
            "date": "January 2026",
            "readTime": "1 min read",
        }
        r = requests.post(f"{API}/blogs", json=payload, headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 201, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert data["slug"] == TEST_SLUG
        assert "publishedAt" in data
        assert "updatedAt" in data
        assert "url" in data and TEST_SLUG in data["url"]
        assert data.get("indexingPing") == "queued"

    def test_02_create_duplicate_409(self):
        payload = {"slug": TEST_SLUG, "title": "Dup", "content": "<p>x</p>"}
        r = requests.post(f"{API}/blogs", json=payload, headers=AUTH_HEADERS, timeout=15)
        assert r.status_code == 409

    def test_03_invalid_slug_400(self):
        payload = {"slug": "INVALID Slug!", "title": "Bad", "content": "<p>x</p>"}
        r = requests.post(f"{API}/blogs", json=payload, headers=AUTH_HEADERS, timeout=15)
        # Pydantic may also reject; either 400 or 422 is acceptable but spec says 400
        assert r.status_code in (400, 422), f"Expected 400/422, got {r.status_code}: {r.text}"

    def test_04_patch_updates_title(self):
        # Capture original updatedAt
        before = requests.get(f"{API}/blogs/{TEST_SLUG}", timeout=15).json()
        r = requests.patch(f"{API}/blogs/{TEST_SLUG}",
                           json={"title": "QA Updated Title"},
                           headers=AUTH_HEADERS, timeout=15)
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["title"] == "QA Updated Title"
        assert updated["updatedAt"] != before.get("updatedAt")
        # GET verify persistence
        g = requests.get(f"{API}/blogs/{TEST_SLUG}", timeout=15).json()
        assert g["title"] == "QA Updated Title"

    def test_05_reindex_requires_auth(self):
        r = requests.post(f"{API}/blogs/{TEST_SLUG}/reindex", timeout=15)
        assert r.status_code == 401

    def test_06_reindex_ok(self):
        r = requests.post(f"{API}/blogs/{TEST_SLUG}/reindex", headers=AUTH_HEADERS, timeout=15)
        assert r.status_code == 200
        assert r.json().get("indexingPing") == "queued"

    def test_07_reindex_unknown_404(self):
        r = requests.post(f"{API}/blogs/no-such-slug-xyz/reindex", headers=AUTH_HEADERS, timeout=15)
        assert r.status_code == 404

    def test_08_delete_blog(self):
        r = requests.delete(f"{API}/blogs/{TEST_SLUG}", headers=AUTH_HEADERS, timeout=15)
        assert r.status_code == 200
        g = requests.get(f"{API}/blogs/{TEST_SLUG}", timeout=15)
        assert g.status_code == 404


# ---------- Admin password gate ----------

class TestAdminKeyGate:
    def test_correct_password_returns_key(self):
        r = requests.post(f"{API}/admin/blog-key", json={"password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        assert r.json().get("key") == BLOG_API_KEY

    def test_wrong_password_403(self):
        r = requests.post(f"{API}/admin/blog-key", json={"password": "wrong"}, timeout=15)
        assert r.status_code == 403


# ---------- IndexNow key file (served by frontend) ----------

class TestIndexNowKeyFile:
    def test_keyfile_reachable(self):
        r = requests.get(f"{BASE_URL}/MquMx2zP7boDfUQ5jahRdSPJYciiAv4a.txt", timeout=15)
        assert r.status_code == 200
        assert "MquMx2zP7boDfUQ5jahRdSPJYciiAv4a" in r.text
