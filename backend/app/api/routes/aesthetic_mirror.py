"""
风格复刻 API 路由
Aesthetic Mirror - AI 驱动的风格迁移系统
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
from app.services.gemini_service import gemini_service
from app.services.nanobana_service import nano_banana_service
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/aesthetic-mirror", tags=["Aesthetic Mirror"])


# ==================== 请求模型 ====================

class ExtractStyleRequest(BaseModel):
    """风格提取请求"""
    style_image_url: str


class FuseStyleRequest(BaseModel):
    """风格融合请求"""
    style_dna: dict
    product_info: dict
    product_image_url: str
    strength: float = 0.7
    aspect_ratio: str = "1:1"


class BatchFuseRequest(BaseModel):
    """批量风格融合请求"""
    style_dna: dict
    products: List[dict]  # [{"info": {...}, "image_url": "..."}]
    strength: float = 0.7
    aspect_ratio: str = "1:1"
    task_id: Optional[str] = None


class QuickStyleRequest(BaseModel):
    """快速风格迁移请求（一步完成）"""
    style_image_url: str
    product_image_url: str
    strength: float = 0.7
    aspect_ratio: str = "1:1"


class BatchQuickStyleRequest(BaseModel):
    """批量快速风格迁移"""
    style_image_url: str
    product_image_urls: List[str]
    strength: float = 0.7
    aspect_ratio: str = "1:1"
    task_id: Optional[str] = None


# ==================== API 端点 ====================

@router.post("/extract-style")
async def extract_style(request: ExtractStyleRequest):
    """提取风格DNA
    
    对风格参考图进行像素级解析，提取：
    - 风格指纹（名称、时代感、品牌性格）
    - 色彩DNA（配色、色温、饱和度、色彩和谐）
    - 光影DNA（主光、补光、轮廓光、阴影特性）
    - 构图DNA（布局、视觉重心、留白、景深）
    - 材质DNA（表面质感、材质参考）
    - 装饰DNA（道具、图案、图形元素）
    - 氛围DNA（情感关键词、五感体验）
    - 复刻提示词（英文）
    """
    try:
        result = await gemini_service.extract_style_dna(request.style_image_url)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fuse-style")
async def fuse_style(request: FuseStyleRequest):
    """单个产品风格融合
    
    将提取的风格DNA应用到目标产品上，确保：
    - 产品主体100%保持原样
    - 环境、光影、氛围与风格DNA一致
    - 融合自然，无PS痕迹
    """
    try:
        # 1. 生成融合提示词
        fusion_data = await gemini_service.fuse_style_with_product(
            style_dna=request.style_dna,
            product_info=request.product_info,
            product_image_url=request.product_image_url
        )
        
        # 2. 获取融合参数
        fusion_prompt = fusion_data.get("fusion_prompt", {})
        main_prompt = fusion_prompt.get("main_prompt", "")
        negative_prompt = fusion_prompt.get("negative_prompt", "")
        gen_params = fusion_prompt.get("generation_params", {})
        
        # 3. 生成图片
        result = await nano_banana_service.generate_style_transfer(
            product_image_url=request.product_image_url,
            style_prompt=main_prompt,
            negative_prompt=negative_prompt,
            strength=gen_params.get("strength", request.strength),
            aspect_ratio=request.aspect_ratio,
        )
        
        # 4. 添加元数据
        result["fusion_data"] = fusion_data
        result["quality_checks"] = fusion_data.get("quality_checks", [])
        
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-fuse")
async def batch_fuse(request: BatchFuseRequest):
    """批量风格融合
    
    将同一风格DNA应用到多个产品上
    """
    results = []
    total = len(request.products)
    
    for i, product in enumerate(request.products):
        try:
            # 生成融合提示词
            fusion_data = await gemini_service.fuse_style_with_product(
                style_dna=request.style_dna,
                product_info=product.get("info", {}),
                product_image_url=product["image_url"]
            )
            
            fusion_prompt = fusion_data.get("fusion_prompt", {})
            main_prompt = fusion_prompt.get("main_prompt", "")
            negative_prompt = fusion_prompt.get("negative_prompt", "")
            gen_params = fusion_prompt.get("generation_params", {})
            
            # 生成图片
            result = await nano_banana_service.generate_style_transfer(
                product_image_url=product["image_url"],
                style_prompt=main_prompt,
                negative_prompt=negative_prompt,
                strength=gen_params.get("strength", request.strength),
                aspect_ratio=request.aspect_ratio,
            )
            
            result["order"] = i + 1
            result["original_image"] = product["image_url"]
            result["success"] = True
            results.append(result)
            
            # 推送进度
            if request.task_id:
                await ws_manager.send_progress(
                    task_id=request.task_id,
                    data={
                        "stage": "fusing",
                        "progress": int((i + 1) / total * 100),
                        "current": i + 1,
                        "total": total,
                        "image_url": result["url"],
                    }
                )
                
        except Exception as e:
            results.append({
                "order": i + 1,
                "original_image": product["image_url"],
                "error": str(e),
                "url": None,
                "success": False,
            })
            
            if request.task_id:
                await ws_manager.send_progress(
                    task_id=request.task_id,
                    data={
                        "stage": "fusing",
                        "progress": int((i + 1) / total * 100),
                        "current": i + 1,
                        "total": total,
                        "error": str(e),
                    }
                )
    
    return {"success": True, "data": results}


@router.post("/quick-transfer")
async def quick_style_transfer(request: QuickStyleRequest):
    """快速风格迁移
    
    一步完成风格提取和应用，适合快速预览效果
    """
    try:
        # 1. 提取风格DNA
        style_dna = await gemini_service.extract_style_dna(request.style_image_url)
        
        # 2. 获取复刻提示词
        replication_prompt = style_dna.get("replication_master_prompt", {})
        english_prompt = replication_prompt.get("english_prompt", "")
        
        if not english_prompt:
            # 如果没有生成提示词，使用简化版本
            english_prompt = f"Product photography in the style of reference image, professional e-commerce photo, high quality"
        
        # 3. 生成图片
        result = await nano_banana_service.generate_style_transfer(
            product_image_url=request.product_image_url,
            style_prompt=english_prompt,
            strength=request.strength,
            aspect_ratio=request.aspect_ratio,
        )
        
        result["style_dna"] = style_dna
        
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-quick-transfer")
async def batch_quick_style_transfer(request: BatchQuickStyleRequest):
    """批量快速风格迁移
    
    使用同一风格参考图快速批量处理多个产品
    """
    try:
        # 1. 提取风格DNA（只需一次）
        style_dna = await gemini_service.extract_style_dna(request.style_image_url)
        
        replication_prompt = style_dna.get("replication_master_prompt", {})
        english_prompt = replication_prompt.get("english_prompt", "")
        
        if not english_prompt:
            english_prompt = f"Product photography in the style of reference image, professional e-commerce photo, high quality"
        
        # 2. 批量生成
        async def on_progress(progress, current, total, image_url, error=None):
            if request.task_id:
                await ws_manager.send_progress(
                    task_id=request.task_id,
                    data={
                        "stage": "transferring",
                        "progress": progress,
                        "current": current,
                        "total": total,
                        "image_url": image_url,
                        "error": error,
                    }
                )
        
        results = await nano_banana_service.batch_style_transfer(
            product_images=request.product_image_urls,
            style_prompt=english_prompt,
            strength=request.strength,
            aspect_ratio=request.aspect_ratio,
            on_progress=on_progress if request.task_id else None,
        )
        
        return {
            "success": True, 
            "data": {
                "results": results,
                "style_dna": style_dna,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    """WebSocket 连接端点
    
    用于实时推送风格迁移进度
    """
    await ws_manager.connect(task_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(task_id, websocket)
