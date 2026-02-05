from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.task import Task, TaskStatus, TaskType
from app.models.user import User
from app.schemas.task import TaskResponse, GenesisRequest, MirrorRequest
from app.api.v1.auth import get_current_user
from app.services.websocket_manager import ws_manager
from app.services.gemini_service import gemini_service
from app.services.nanobana_service import nano_banana_service
from app.core.config import settings
import asyncio

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0,
):
    result = await db.execute(
        select(Task)
        .where(Task.user_id == current_user.id)
        .order_by(Task.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await ws_manager.connect(task_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(task_id, websocket)


async def run_genesis_task(
    task_id: str,
    image_url: str,
    count: int,
    style: str,
    db: AsyncSession,
):
    """Background task for Studio Genesis."""
    try:
        # Update status to processing
        result = await db.execute(select(Task).where(Task.id == UUID(task_id)))
        task = result.scalar_one()
        task.status = TaskStatus.PROCESSING.value
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 5,
            "message": "分析产品图片...",
        })

        # Step 1: Analyze product
        product_info = await gemini_service.analyze_product(image_url)

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 20,
            "message": "生成创意文案...",
        })

        # Step 2: Generate prompts
        prompts = await gemini_service.generate_copywriting(product_info, style, count)

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 30,
            "message": "开始生成图片...",
        })

        # Step 3: Generate images
        output_images = []

        async def on_image_progress(progress: int, current: int, total: int, image_url: str):
            output_images.append(image_url)
            overall_progress = 30 + int(progress * 0.7)
            await ws_manager.send_progress(task_id, {
                "status": "processing",
                "progress": overall_progress,
                "message": f"生成图片 {current}/{total}...",
                "output_images": output_images,
            })

        generated_images = await nano_banana_service.generate_batch(
            prompts=prompts,
            base_image_url=image_url,
            on_progress=on_image_progress,
        )

        # Update task
        task.status = TaskStatus.COMPLETED.value
        task.progress = 100
        task.output_images = {"images": generated_images}
        task.completed_at = datetime.utcnow()
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "completed",
            "progress": 100,
            "message": "生成完成！",
            "output_images": generated_images,
        })

    except Exception as e:
        result = await db.execute(select(Task).where(Task.id == UUID(task_id)))
        task = result.scalar_one()
        task.status = TaskStatus.FAILED.value
        task.error_message = str(e)
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "failed",
            "progress": 0,
            "message": f"生成失败: {str(e)}",
        })


@router.post("/studio-genesis", response_model=TaskResponse)
async def create_genesis_task(
    request: GenesisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check credits
    cost = settings.CREDIT_COST_GENESIS
    if current_user.credits < cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits",
        )

    # Deduct credits
    current_user.credits -= cost
    await db.commit()

    # Create task
    task = Task(
        user_id=current_user.id,
        type=TaskType.GENESIS.value,
        status=TaskStatus.PENDING.value,
        input_images={"image_url": request.image_url},
        parameters={"count": request.count, "style": request.style},
        credits_used=cost,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Start background task
    asyncio.create_task(
        run_genesis_task(
            str(task.id),
            request.image_url,
            request.count,
            request.style,
            db,
        )
    )

    return task


async def run_mirror_task(
    task_id: str,
    product_image_url: str,
    style_image_url: str,
    db: AsyncSession,
):
    """Background task for Aesthetic Mirror."""
    try:
        result = await db.execute(select(Task).where(Task.id == UUID(task_id)))
        task = result.scalar_one()
        task.status = TaskStatus.PROCESSING.value
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 10,
            "message": "提取配色方案...",
        })

        # Extract style
        style_info = await gemini_service.extract_style(style_image_url)

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 25,
            "message": "分析布局结构...",
        })

        # Analyze product
        product_info = await gemini_service.analyze_product(product_image_url)

        await ws_manager.send_progress(task_id, {
            "status": "processing",
            "progress": 50,
            "message": "识别装饰元素...",
        })

        # Generate 4 images with style transfer
        prompts = [
            f"Product photography, {style_info}, professional e-commerce image, variant {i + 1}"
            for i in range(4)
        ]

        output_images = []

        async def on_progress(progress: int, current: int, total: int, image_url: str):
            output_images.append(image_url)
            overall_progress = 50 + int(progress * 0.5)
            await ws_manager.send_progress(task_id, {
                "status": "processing",
                "progress": overall_progress,
                "message": f"生成新图片 {current}/{total}...",
                "output_images": output_images,
            })

        generated_images = await nano_banana_service.generate_batch(
            prompts=prompts,
            base_image_url=product_image_url,
            on_progress=on_progress,
        )

        task.status = TaskStatus.COMPLETED.value
        task.progress = 100
        task.output_images = {"images": generated_images}
        task.completed_at = datetime.utcnow()
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "completed",
            "progress": 100,
            "message": "风格复刻完成！",
            "output_images": generated_images,
        })

    except Exception as e:
        result = await db.execute(select(Task).where(Task.id == UUID(task_id)))
        task = result.scalar_one()
        task.status = TaskStatus.FAILED.value
        task.error_message = str(e)
        await db.commit()

        await ws_manager.send_progress(task_id, {
            "status": "failed",
            "progress": 0,
            "message": f"生成失败: {str(e)}",
        })


@router.post("/aesthetic-mirror", response_model=TaskResponse)
async def create_mirror_task(
    request: MirrorRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cost = settings.CREDIT_COST_MIRROR
    if current_user.credits < cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits",
        )

    current_user.credits -= cost
    await db.commit()

    task = Task(
        user_id=current_user.id,
        type=TaskType.MIRROR.value,
        status=TaskStatus.PENDING.value,
        input_images={
            "product_image_url": request.product_image_url,
            "style_image_url": request.style_image_url,
        },
        credits_used=cost,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    asyncio.create_task(
        run_mirror_task(
            str(task.id),
            request.product_image_url,
            request.style_image_url,
            db,
        )
    )

    return task
