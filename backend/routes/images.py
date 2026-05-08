from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from datetime import datetime, timezone
from io import BytesIO
from PIL import Image
import uuid
import logging

from database import db

logger = logging.getLogger(__name__)
router = APIRouter()

# Image optimization settings
MAX_WIDTH = 1600
MAX_FILE_SIZE_MB = 10
JPEG_QUALITY = 82
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"}


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image. Optimizes (resize + JPEG compression) and stores in MongoDB. Returns a URL."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    raw = await file.read()
    if len(raw) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large (max {MAX_FILE_SIZE_MB}MB)")

    try:
        img = Image.open(BytesIO(raw))
        img.load()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")

    # Convert RGBA/P -> RGB for JPEG encoding
    if img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        mask = img.split()[-1] if img.mode in ("RGBA", "LA") else None
        if mask:
            bg.paste(img, mask=mask)
        else:
            bg.paste(img.convert("RGB"))
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize if wider than MAX_WIDTH (preserve aspect ratio)
    if img.width > MAX_WIDTH:
        new_height = int(img.height * (MAX_WIDTH / img.width))
        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

    # Encode as optimized JPEG
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    optimized = buf.getvalue()

    image_id = str(uuid.uuid4())
    doc = {
        "id": image_id,
        "data": optimized,
        "contentType": "image/jpeg",
        "width": img.width,
        "height": img.height,
        "size": len(optimized),
        "originalName": file.filename or "upload.jpg",
        "originalSize": len(raw),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.images.insert_one(doc)

    return {
        "id": image_id,
        "url": f"/api/images/{image_id}",
        "width": img.width,
        "height": img.height,
        "size": len(optimized),
        "originalSize": len(raw),
    }


@router.get("/images/{image_id}")
async def get_image(image_id: str):
    """Serve an uploaded image by ID with long cache headers."""
    doc = await db.images.find_one({"id": image_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Image not found")

    return Response(
        content=doc["data"],
        media_type=doc.get("contentType", "image/jpeg"),
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Image-Width": str(doc.get("width", "")),
            "X-Image-Height": str(doc.get("height", "")),
        },
    )


@router.delete("/images/{image_id}")
async def delete_image(image_id: str):
    result = await db.images.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"success": True}
