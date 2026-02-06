"""
组图生成 API 路由
Studio Genesis - AI 驱动的电商详情图生成
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Optional, List
from app.services.gemini_service import gemini_service
from app.services.nanobana_service import nano_banana_service
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/studio-genesis", tags=["Studio Genesis"])


# ==================== 请求模型 ====================

class AnalyzeRequest(BaseModel):
    """产品分析请求"""
    image_url: str


class PlanRequest(BaseModel):
    """详情页规划请求"""
    product_analysis: dict
    count: int = 8
    platform: str = "通用"
    aspect_ratio: str = "3:4"


class GenerateRequest(BaseModel):
    """图片生成请求"""
    page_plan: dict
    product_info: dict
    base_image_url: str
    task_id: str
    aspect_ratio: str = "3:4"


class RegenerateRequest(BaseModel):
    """重新生成单张图片请求"""
    prompt: str
    negative_prompt: str = ""
    base_image_url: Optional[str] = None
    aspect_ratio: str = "3:4"
    order: int = 1
    role: str = ""


class QualityAssessRequest(BaseModel):
    """质量评估请求"""
    image_url: str
    original_prompt: str


class MultilingualCopyRequest(BaseModel):
    """多语言文案请求"""
    product_info: dict
    target_languages: List[str] = ["en", "ja", "ko", "de", "fr"]


# ==================== API 端点 ====================

@router.post("/analyze")
async def analyze_product(request: AnalyzeRequest):
    """深度产品分析
    
    对产品图片进行360°全方位分析，提取：
    - 基础信息（名称、类目、定位）
    - 视觉特征（颜色、材质、造型）
    - 卖点提炼（核心USP、功能利益、情感利益）
    - 目标用户画像
    - 详情页蓝图建议
    - 风格推荐
    """
    try:
        result = await gemini_service.analyze_product_deep(request.image_url)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/plan")
async def generate_plan(request: PlanRequest):
    """生成详情页结构规划
    
    基于产品分析结果，规划完整的详情页图片序列：
    - 整体策略（调性、配色、字体）
    - 图片序列（角色、目的、构图、光影、文案）
    - 质量检查清单
    """
    try:
        result = await gemini_service.generate_detail_page_plan(
            product_analysis=request.product_analysis,
            count=request.count,
            platform=request.platform,
            aspect_ratio=request.aspect_ratio
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate")
async def generate_images(request: GenerateRequest):
    """批量生成详情图
    
    根据详情页规划批量生成图片，通过 WebSocket 推送进度
    """
    try:
        # 1. 生成提示词
        prompts = await gemini_service.generate_image_prompts(
            page_plan=request.page_plan,
            product_info=request.product_info
        )
        
        # 2. 批量生成图片（带进度回调）
        async def on_progress(progress, current, total, image_url, error=None):
            await ws_manager.send_progress(
                task_id=request.task_id,
                data={
                    "stage": "generating",
                    "progress": progress,
                    "current": current,
                    "total": total,
                    "image_url": image_url,
                    "error": error,
                }
            )
        
        results = await nano_banana_service.generate_batch_with_progress(
            prompts=prompts,
            base_image_url=request.base_image_url,
            aspect_ratio=request.aspect_ratio,
            on_progress=on_progress
        )
        
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/regenerate")
async def regenerate_image(request: RegenerateRequest):
    """重新生成单张图片
    
    当某张图片效果不满意时，可以单独重新生成
    """
    try:
        result = await nano_banana_service.generate_image(
            prompt=request.prompt,
            image_url=request.base_image_url,
            negative_prompt=request.negative_prompt,
            aspect_ratio=request.aspect_ratio,
        )
        
        result["order"] = request.order
        result["role"] = request.role
        
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/assess-quality")
async def assess_quality(request: QualityAssessRequest):
    """评估生成图片质量
    
    从多个维度评估生成图片的质量：
    - 产品还原度
    - 风格一致性
    - 光影合理性
    - 构图美感
    - 商业可用性
    - 转化潜力
    """
    try:
        result = await gemini_service.assess_quality(
            generated_image_url=request.image_url,
            original_prompt=request.original_prompt
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/multilingual-copy")
async def generate_multilingual_copy(request: MultilingualCopyRequest):
    """生成多语言营销文案
    
    根据产品信息生成本地化的多语言文案
    """
    try:
        result = await gemini_service.generate_multilingual_copy(
            product_info=request.product_info,
            target_languages=request.target_languages
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    """WebSocket 连接端点
    
    用于实时推送图片生成进度
    """
    await ws_manager.connect(task_id, websocket)
    try:
        while True:
            # 保持连接活跃
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(task_id, websocket)
