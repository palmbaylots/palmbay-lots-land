"""
Backend tests for new image upload/get/delete endpoints and seeded property counts.
Covers:
- POST /api/upload-image (resize + compress)
- GET /api/images/{id}
- DELETE /api/images/{id}
- GET /api/properties/curated (21 listings)
- GET /api/properties/inventory (582 lots)
- Regression: /api/leads, /api/properties, /api/chat
"""
import os
import io
import pytest
import requests
from PIL import Image

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"


def _make_jpeg(width=2400, height=1800, color=(255, 0, 0)):
    img = Image.new("RGB", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()


def _make_png(width=400, height=300, color=(0, 128, 255, 255)):
    img = Image.new("RGBA", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# -------------------- Image Upload Tests --------------------
class TestImageUpload:
    def test_upload_jpeg_resizes_and_compresses(self):
        raw = _make_jpeg(2400, 1800)
        files = {"file": ("test.jpg", raw, "image/jpeg")}
        r = requests.post(f"{API}/upload-image", files=files, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("id", "url", "width", "height", "size", "originalSize"):
            assert k in data, f"missing key {k}"
        assert data["width"] == 1600
        # height preserved aspect ratio: 1800*(1600/2400)=1200
        assert data["height"] == 1200
        assert data["size"] < data["originalSize"]
        assert data["url"] == f"/api/images/{data['id']}"

        # cleanup
        requests.delete(f"{API}/images/{data['id']}")

    def test_upload_png_converts_to_jpeg(self):
        raw = _make_png(800, 600)
        files = {"file": ("test.png", raw, "image/png")}
        r = requests.post(f"{API}/upload-image", files=files, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["width"] == 800
        assert data["height"] == 600
        # GET returns JPEG content-type
        g = requests.get(f"{API}/images/{data['id']}")
        assert g.status_code == 200
        assert g.headers.get("content-type") == "image/jpeg"
        requests.delete(f"{API}/images/{data['id']}")

    def test_upload_rejects_text_file(self):
        files = {"file": ("test.txt", b"hello world", "text/plain")}
        r = requests.post(f"{API}/upload-image", files=files, timeout=30)
        assert r.status_code == 400

    def test_upload_rejects_oversize_file(self):
        # Generate >10MB raw bytes (use uncompressible random data with image/jpeg type)
        big = os.urandom(11 * 1024 * 1024)
        files = {"file": ("big.jpg", big, "image/jpeg")}
        r = requests.post(f"{API}/upload-image", files=files, timeout=60)
        assert r.status_code == 400


# -------------------- Image GET / DELETE --------------------
class TestImageGetDelete:
    def test_get_image_returns_bytes_and_headers(self):
        raw = _make_jpeg(800, 600)
        up = requests.post(
            f"{API}/upload-image",
            files={"file": ("g.jpg", raw, "image/jpeg")},
            timeout=30,
        )
        assert up.status_code == 200
        image_id = up.json()["id"]

        g = requests.get(f"{API}/images/{image_id}")
        assert g.status_code == 200
        assert g.headers.get("content-type") == "image/jpeg"
        assert g.headers.get("X-Image-Width") == "800"
        assert g.headers.get("X-Image-Height") == "600"
        assert len(g.content) > 0

        # cleanup
        requests.delete(f"{API}/images/{image_id}")

    def test_get_image_404_for_unknown(self):
        r = requests.get(f"{API}/images/this-id-does-not-exist-xyz")
        assert r.status_code == 404

    def test_delete_image_then_get_404(self):
        raw = _make_jpeg(400, 300)
        up = requests.post(
            f"{API}/upload-image",
            files={"file": ("d.jpg", raw, "image/jpeg")},
            timeout=30,
        )
        assert up.status_code == 200
        image_id = up.json()["id"]

        d = requests.delete(f"{API}/images/{image_id}")
        assert d.status_code == 200
        assert d.json() == {"success": True}

        g = requests.get(f"{API}/images/{image_id}")
        assert g.status_code == 404


# -------------------- Properties Endpoints --------------------
class TestPropertiesEndpoints:
    def test_curated_returns_21(self):
        r = requests.get(f"{API}/properties/curated", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 21, f"Expected 21 curated, got {len(data)}"
        # All curated must lack a real inventoryId
        for p in data:
            assert not p.get("inventoryId"), "curated should not have inventoryId"

    def test_inventory_returns_582(self):
        r = requests.get(f"{API}/properties/inventory", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 582, f"Expected 582 inventory, got {len(data)}"
        # all should have inventoryId
        for p in data[:5]:
            assert p.get("inventoryId"), "inventory item should have inventoryId"

    def test_all_properties(self):
        r = requests.get(f"{API}/properties", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # should be at least 582 + 21 = 603
        assert len(data) >= 603, f"Expected >=603 total, got {len(data)}"


# -------------------- Regression: leads, chat --------------------
class TestRegression:
    def test_get_leads_ok(self):
        r = requests.get(f"{API}/leads", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_lead_rejects_no_consent(self):
        r = requests.post(
            f"{API}/leads",
            json={
                "name": "TEST_NoConsent",
                "email": "noconsent@test.com",
                "phone": "1234567890",
                "agreedToContact": False,
            },
            timeout=30,
        )
        assert r.status_code == 400

    def test_chat_endpoint_responds(self):
        # POST /api/chat - should return 200 with a reply or a graceful error code
        r = requests.post(
            f"{API}/chat",
            json={"message": "Hi", "sessionId": "test-session-xyz"},
            timeout=60,
        )
        # Accept 200 (works) or 503 (LLM not configured) but never 500
        assert r.status_code in (200, 400, 422, 503), f"chat returned {r.status_code}: {r.text[:200]}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
