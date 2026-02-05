import httpx
from app.core.config import settings


class GeminiService:
    """Service for interacting with Gemini API via YunWu."""

    def __init__(self):
        self.api_url = settings.YUNWU_API_URL
        self.api_key = settings.YUNWU_API_KEY

    async def analyze_product(self, image_url: str) -> dict:
        """Analyze a product image and extract features."""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gemini-3-pro",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {"url": image_url},
                                },
                                {
                                    "type": "text",
                                    "text": """分析这张产品图片，提取以下信息（用JSON格式返回）：
1. product_name: 产品名称
2. product_category: 产品类别
3. colors: 主要颜色列表
4. features: 产品特点列表
5. style_keywords: 适合的风格关键词
6. suggested_scenes: 推荐的场景列表""",
                                },
                            ],
                        }
                    ],
                    "max_tokens": 1000,
                },
            )
            response.raise_for_status()
            result = response.json()
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")

    async def generate_copywriting(
        self, product_info: dict, style: str, count: int
    ) -> list[str]:
        """Generate copywriting for product images."""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gemini-3-pro",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""基于以下产品信息，生成{count}条用于AI图片生成的英文提示词。
风格要求：{style}

产品信息：
{product_info}

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
        """Extract style information from a reference image."""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.api_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gemini-3-pro",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {"url": style_image_url},
                                },
                                {
                                    "type": "text",
                                    "text": """分析这张风格参考图，提取以下视觉DNA信息（用JSON格式返回）：
1. color_palette: 配色方案（列出主要颜色的hex值）
2. layout: 布局结构描述
3. lighting: 光线风格
4. decorations: 装饰元素
5. mood: 整体氛围
6. style_prompt: 用于图片生成的英文风格描述（详细）""",
                                },
                            ],
                        }
                    ],
                    "max_tokens": 1000,
                },
            )
            response.raise_for_status()
            result = response.json()
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")


gemini_service = GeminiService()
