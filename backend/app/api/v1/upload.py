import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.v1.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload an image and return its URL."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed: JPG, PNG, WEBP",
        )

    # Validate file size (10MB max)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size: 10MB",
        )

    # Generate unique filename
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"

    # For now, we'll use a mock URL
    # In production, upload to S3/OSS
    # url = await oss_service.upload(filename, contents)

    # Mock URL for development
    mock_url = f"https://storage.example.com/uploads/{filename}"

    return {
        "url": mock_url,
        "filename": filename,
        "size": len(contents),
        "content_type": file.content_type,
    }
