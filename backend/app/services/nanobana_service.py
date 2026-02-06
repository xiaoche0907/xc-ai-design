"""
XC AI Design - 图片生成服务
增强版，支持更多参数和质量控制
"""

import httpx
import asyncio
from typing import Optional, Callable, List
from app.core.config import settings


class NanoBananaService:
    """增强版图片生成服务"""

    def __init__(self):
        self.api_url = settings.NANO_BANANA_API_URL
        self.api_key = settings.YUNWU_API_KEY

    def _calculate_dimensions(self, aspect_ratio: str) -> tuple[int, int]:
        """根据宽高比计算尺寸"""
        ratio_map = {
            "1:1": (1024, 1024),
            "4:3": (1024, 768),
            "3:4": (768, 1024),
            "16:9": (1024, 576),
            "9:16": (576, 1024),
            "3:2": (1024, 683),
            "2:3": (683, 1024),
            "21:9": (1024, 439),
            "9:21": (439, 1024),
            "4:5": (819, 1024),
            "5:4": (1024, 819),
        }
        return ratio_map.get(aspect_ratio, (1024, 1024))

    async def generate_image(
        self,
        prompt: str,
        image_url: Optional[str] = None,
        negative_prompt: str = "",
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 30,
        guidance_scale: float = 7.5,
        strength: float = 0.75,
        aspect_ratio: Optional[str] = None,
    ) -> dict:
        """增强版图片生成
        
        Args:
            prompt: 生成提示词
            image_url: 参考图片URL（用于图生图）
            negative_prompt: 负面提示词
            width: 图片宽度
            height: 图片高度
            num_inference_steps: 推理步数
            guidance_scale: 引导系数
            strength: 图生图强度
            aspect_ratio: 宽高比（如果提供，会覆盖width/height）
        
        Returns:
            dict: 包含url、request_id、params的字典
        """
        # 如果提供了宽高比，使用宽高比计算尺寸
        if aspect_ratio:
            width, height = self._calculate_dimensions(aspect_ratio)
        
        async with httpx.AsyncClient(timeout=180.0) as client:
            payload = {
                "prompt": prompt,
                "negative_prompt": negative_prompt or "blurry, low quality, distorted, ugly, deformed, watermark, text, logo, signature, bad anatomy, bad proportions",
                "num_inference_steps": num_inference_steps,
                "guidance_scale": guidance_scale,
                "width": width,
                "height": height,
            }

            if image_url:
                payload["image_url"] = image_url
                payload["strength"] = strength

            response = await client.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
            result = response.json()

            # 异步轮询模式
            if "request_id" in result:
                image_url_result = await self._poll_result(client, result["request_id"])
                return {
                    "url": image_url_result,
                    "request_id": result["request_id"],
                    "params": payload,
                    "width": width,
                    "height": height,
                }

            # 直接返回结果
            if "images" in result and len(result["images"]) > 0:
                return {
                    "url": result["images"][0]["url"],
                    "params": payload,
                    "width": width,
                    "height": height,
                }

            if "image" in result:
                return {
                    "url": result["image"]["url"],
                    "params": payload,
                    "width": width,
                    "height": height,
                }

            raise Exception("No image returned from API")

    async def _poll_result(self, client: httpx.AsyncClient, request_id: str) -> str:
        """轮询异步结果"""
        status_url = f"{self.api_url}/requests/{request_id}/status"

        for _ in range(90):  # 最多等待 3 分钟
            await asyncio.sleep(2)
            
            response = await client.get(
                status_url, 
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            response.raise_for_status()
            result = response.json()

            status = result.get("status")
            if status == "COMPLETED":
                output = result.get("response", {})
                if "images" in output and output["images"]:
                    return output["images"][0]["url"]
                if "image" in output:
                    return output["image"]["url"]
                raise Exception("No image in completed result")
            
            if status == "FAILED":
                raise Exception(f"Image generation failed: {result.get('error', 'Unknown error')}")

        raise Exception("Timeout waiting for image generation")

    async def generate_batch_with_progress(
        self,
        prompts: List[dict],
        base_image_url: Optional[str] = None,
        aspect_ratio: str = "3:4",
        on_progress: Optional[Callable] = None,
    ) -> List[dict]:
        """批量生成图片（带进度回调）
        
        Args:
            prompts: 提示词列表，每个元素应包含 prompt, negative_prompt, role 等
            base_image_url: 基础产品图URL
            aspect_ratio: 统一的宽高比
            on_progress: 进度回调函数
        
        Returns:
            生成结果列表
        """
        results = []
        total = len(prompts)
        width, height = self._calculate_dimensions(aspect_ratio)

        for i, prompt_data in enumerate(prompts):
            try:
                # 获取提示词和负面提示词
                prompt = prompt_data.get("prompt", "")
                negative_prompt = prompt_data.get("negative_prompt", "")
                
                # 获取单独的宽高比设置
                item_ratio = prompt_data.get("aspect_ratio", aspect_ratio)
                item_width, item_height = self._calculate_dimensions(item_ratio)
                
                result = await self.generate_image(
                    prompt=prompt,
                    image_url=base_image_url,
                    negative_prompt=negative_prompt,
                    width=item_width,
                    height=item_height,
                )
                
                # 添加额外信息
                result["order"] = i + 1
                result["role"] = prompt_data.get("role", "")
                result["text_overlay"] = prompt_data.get("text_overlay", {})
                result["success"] = True
                results.append(result)

                # 进度回调
                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=result["url"],
                    )
                    
            except Exception as e:
                results.append({
                    "order": i + 1,
                    "role": prompt_data.get("role", ""),
                    "error": str(e),
                    "url": None,
                    "success": False,
                })
                
                # 即使失败也通知进度
                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=None,
                        error=str(e),
                    )

        return results

    async def generate_style_transfer(
        self,
        product_image_url: str,
        style_prompt: str,
        negative_prompt: str = "",
        strength: float = 0.7,
        aspect_ratio: str = "1:1",
    ) -> dict:
        """风格迁移专用方法
        
        Args:
            product_image_url: 产品图URL
            style_prompt: 风格描述提示词
            negative_prompt: 负面提示词
            strength: 风格迁移强度 (0.5-0.9 推荐)
            aspect_ratio: 输出图片宽高比
        
        Returns:
            生成结果字典
        """
        width, height = self._calculate_dimensions(aspect_ratio)
        
        return await self.generate_image(
            prompt=style_prompt,
            image_url=product_image_url,
            negative_prompt=negative_prompt or "blurry, low quality, distorted, deformed product, wrong proportions, watermark",
            strength=strength,
            num_inference_steps=35,
            guidance_scale=8.0,
            width=width,
            height=height,
        )

    async def batch_style_transfer(
        self,
        product_images: List[str],
        style_prompt: str,
        negative_prompt: str = "",
        strength: float = 0.7,
        aspect_ratio: str = "1:1",
        on_progress: Optional[Callable] = None,
    ) -> List[dict]:
        """批量风格迁移
        
        Args:
            product_images: 产品图URL列表
            style_prompt: 统一的风格描述
            negative_prompt: 负面提示词
            strength: 风格迁移强度
            aspect_ratio: 输出图片宽高比
            on_progress: 进度回调
        
        Returns:
            生成结果列表
        """
        results = []
        total = len(product_images)
        
        for i, image_url in enumerate(product_images):
            try:
                result = await self.generate_style_transfer(
                    product_image_url=image_url,
                    style_prompt=style_prompt,
                    negative_prompt=negative_prompt,
                    strength=strength,
                    aspect_ratio=aspect_ratio,
                )
                
                result["order"] = i + 1
                result["original_image"] = image_url
                result["success"] = True
                results.append(result)
                
                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=result["url"],
                    )
                    
            except Exception as e:
                results.append({
                    "order": i + 1,
                    "original_image": image_url,
                    "error": str(e),
                    "url": None,
                    "success": False,
                })
                
                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=None,
                        error=str(e),
                    )
        
        return results

    # ========== 兼容旧版方法 ==========
    
    async def generate_batch(
        self,
        prompts: list[str],
        base_image_url: str | None = None,
        on_progress: Callable | None = None,
    ) -> list[str]:
        """兼容旧版 - 批量生成图片（返回URL列表）"""
        results = []
        total = len(prompts)

        for i, prompt in enumerate(prompts):
            try:
                result = await self.generate_image(
                    prompt=prompt,
                    image_url=base_image_url,
                )
                results.append(result["url"])

                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=result["url"],
                    )
            except Exception as e:
                print(f"Failed to generate image {i + 1}: {e}")
                results.append(None)

        return [r for r in results if r is not None]


nano_banana_service = NanoBananaService()
