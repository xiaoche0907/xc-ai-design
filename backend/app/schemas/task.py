from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from app.models.task import TaskType, TaskStatus


class TaskCreate(BaseModel):
    type: TaskType
    input_images: dict | None = None
    parameters: dict | None = None


class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    status: str
    progress: int
    input_images: dict | None
    output_images: dict | None
    parameters: dict | None
    error_message: str | None
    credits_used: int
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class TaskProgress(BaseModel):
    task_id: UUID
    status: str
    progress: int
    message: str | None = None
    output_images: list[str] | None = None


class GenesisRequest(BaseModel):
    image_url: str
    count: int = 5
    style: str = "professional"


class MirrorRequest(BaseModel):
    product_image_url: str
    style_image_url: str


class RefinementRequest(BaseModel):
    image_url: str
    adjustments: dict | None = None
    export_size: str = "1080p"
