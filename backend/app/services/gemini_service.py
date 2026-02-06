"""
XC AI Design - Gemini 服务层
超越 Picset AI 的智能分析服务
"""

import httpx
import json
from typing import Optional
from app.core.config import settings
from app.core.prompts import (
    ECOMMERCE_VISUAL_MASTER,
    STYLE_DNA_ANALYST,
    MARKETING_COPYWRITER,
    PRODUCT_DEEP_ANALYSIS,
    DETAIL_PAGE_STRUCTURE,
    IMAGE_GENERATION_PROMPT_TEMPLATE,
    STYLE_DNA_EXTRACTION,
    STYLE_FUSION_PROMPT,
    QUALITY_ASSESSMENT,
    MULTILINGUAL_COPY
)


class GeminiService:
    """增强版 Gemini 服务"""

    def __init__(self):
        self.api_url = settings.YUNWU_API_URL
        self.api_key = settings.YUNWU_API_KEY
        self.model = "gemini-2.5-pro-exp-03-25"

    async def _call_api(
        self, 
        messages: list, 
        max_tokens: int = 4000,
        temperature: float = 0.7
    ) -> str:
        """统一的 API 调用方法"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            response.raise_for_status()
            result = response.json()
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")

    def _parse_json_response(self, result: str) -> dict:
        """健壮的 JSON 解析"""
        try:
            # 尝试提取 JSON 块
            if "```json" in result:
                json_str = result.split("```json")[1].split("```")[0]
            elif "```" in result:
                json_str = result.split("```")[1].split("```")[0]
            else:
                json_str = result
            return json.loads(json_str.strip())
        except json.JSONDecodeError:
            # 如果解析失败，返回原始结果
            return {"raw_response": result}

    async def analyze_product_deep(self, image_url: str) -> dict:
        """深度产品分析 - 360°全方位分析"""
        messages = [
            {"role": "system", "content": ECOMMERCE_VISUAL_MASTER},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": PRODUCT_DEEP_ANALYSIS}
                ]
            }
        ]
        
        result = await self._call_api(messages, max_tokens=4000)
        return self._parse_json_response(result)

    async def generate_detail_page_plan(
        self,
        product_analysis: dict,
        count: int = 8,
        platform: str = "通用",
        aspect_ratio: str = "3:4"
    ) -> dict:
        """生成详情页结构规划"""
        prompt = DETAIL_PAGE_STRUCTURE.format(
            product_analysis=json.dumps(product_analysis, ensure_ascii=False, indent=2),
            count=count,
            platform=platform,
            aspect_ratio=aspect_ratio
        )
        
        messages = [
            {"role": "system", "content": ECOMMERCE_VISUAL_MASTER},
            {"role": "user", "content": prompt}
        ]
        
        result = await self._call_api(messages, max_tokens=6000)
        return self._parse_json_response(result)

    async def generate_image_prompts(
        self,
        page_plan: dict,
        product_info: dict
    ) -> list[dict]:
        """生成高质量图片提示词"""
        prompts = []
        image_sequence = page_plan.get("image_sequence", [])
        
        for img in image_sequence:
            prompt_request = IMAGE_GENERATION_PROMPT_TEMPLATE.format(
                role=img.get("role", "产品展示"),
                purpose=img.get("purpose", "展示产品"),
                composition=img.get("visual_composition", "中心构图"),
                mood=img.get("lighting_mood", "专业商业"),
                product_info=json.dumps(product_info, ensure_ascii=False)
            )
            
            messages = [
                {"role": "system", "content": ECOMMERCE_VISUAL_MASTER},
                {"role": "user", "content": prompt_request}
            ]
            
            result = await self._call_api(messages, max_tokens=1000, temperature=0.8)
            
            prompt_data = {
                "order": img.get("order", 0),
                "role": img.get("role", ""),
                "prompt": "",
                "negative_prompt": "",
                "text_overlay": img.get("text_overlay", {})
            }
            
            # 解析 Prompt 和 Negative
            if "Prompt:" in result:
                parts = result.split("Negative:")
                prompt_data["prompt"] = parts[0].replace("Prompt:", "").strip()
                if len(parts) > 1:
                    prompt_data["negative_prompt"] = parts[1].strip()
            else:
                prompt_data["prompt"] = result.strip()
            
            prompts.append(prompt_data)
        
        return prompts

    async def extract_style_dna(self, style_image_url: str) -> dict:
        """深度风格DNA提取"""
        messages = [
            {"role": "system", "content": STYLE_DNA_ANALYST},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": style_image_url}},
                    {"type": "text", "text": STYLE_DNA_EXTRACTION}
                ]
            }
        ]
        
        result = await self._call_api(messages, max_tokens=5000)
        return self._parse_json_response(result)

    async def fuse_style_with_product(
        self,
        style_dna: dict,
        product_info: dict,
        product_image_url: str
    ) -> dict:
        """风格融合"""
        prompt = STYLE_FUSION_PROMPT.format(
            style_dna=json.dumps(style_dna, ensure_ascii=False, indent=2),
            product_info=json.dumps(product_info, ensure_ascii=False, indent=2),
            product_image_url=product_image_url
        )
        
        messages = [
            {"role": "system", "content": STYLE_DNA_ANALYST},
            {"role": "user", "content": prompt}
        ]
        
        result = await self._call_api(messages, max_tokens=2000)
        return self._parse_json_response(result)

    async def assess_quality(self, generated_image_url: str, original_prompt: str) -> dict:
        """评估生成图片质量"""
        messages = [
            {"role": "system", "content": ECOMMERCE_VISUAL_MASTER},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": generated_image_url}},
                    {"type": "text", "text": f"原始提示词：{original_prompt}\n\n{QUALITY_ASSESSMENT}"}
                ]
            }
        ]
        
        result = await self._call_api(messages, max_tokens=2000)
        return self._parse_json_response(result)

    async def generate_multilingual_copy(
        self,
        product_info: dict,
        target_languages: list = None
    ) -> dict:
        """生成多语言营销文案"""
        if target_languages is None:
            target_languages = ["en", "ja", "ko", "de", "fr"]
            
        prompt = MULTILINGUAL_COPY.format(
            product_info=json.dumps(product_info, ensure_ascii=False, indent=2),
            target_languages=", ".join(target_languages)
        )
        
        messages = [
            {"role": "system", "content": MARKETING_COPYWRITER},
            {"role": "user", "content": prompt}
        ]
        
        result = await self._call_api(messages, max_tokens=4000)
        return self._parse_json_response(result)

    # ========== 兼容旧版方法 ==========
    
    async def analyze_product(self, image_url: str) -> dict:
        """兼容旧版 - 产品分析（简化版）"""
        return await self.analyze_product_deep(image_url)

    async def generate_copywriting(
        self, 
        product_info: dict, 
        style: str, 
        count: int
    ) -> list[str]:
        """兼容旧版 - 生成文案提示词"""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": ECOMMERCE_VISUAL_MASTER},
                        {
                            "role": "user",
                            "content": f"""基于以下产品信息，生成{count}条用于AI图片生成的英文提示词。
风格要求：{style}

产���信息：
{json.dumps(product_info, ensure_ascii=False)}

要求：
1. 每条提示词用换行分隔
2. 提示词要详细描述场景、光线、角度、氛围
3. 适合电商产品展示
4. 用英文输出""",
                        }
                    ],
                    "max_tokens": 2000,
                },
            )
            response.raise_for_status()
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            return [p.strip() for p in content.split("\n") if p.strip()][:count]

    async def extract_style(self, style_image_url: str) -> dict:
        """兼容旧版 - 风格提取（简化版）"""
        return await self.extract_style_dna(style_image_url)


gemini_service = GeminiService()
