import httpx
import asyncio
from app.core.config import settings


class NanoBananaService:
    """Service for image generation via Nano Banana Pro API."""

    def __init__(self):
        self.api_url = settings.NANO_BANANA_API_URL
        self.api_key = settings.YUNWU_API_KEY

    async def generate_image(
        self,
        prompt: str,
        image_url: str | None = None,
        negative_prompt: str = "",
        num_inference_steps: int = 25,
        guidance_scale: float = 7.5,
    ) -> str:
        """Generate an image using Nano Banana Pro."""
        async with httpx.AsyncClient(timeout=120.0) as client:
            payload = {
                "prompt": prompt,
                "negative_prompt": negative_prompt or "blurry, low quality, distorted, ugly",
                "num_inference_steps": num_inference_steps,
                "guidance_scale": guidance_scale,
                "width": 1024,
                "height": 1024,
            }

            if image_url:
                payload["image_url"] = image_url
                payload["strength"] = 0.75

            # Submit task
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

            # Check if it's async polling mode
            if "request_id" in result:
                return await self._poll_result(client, result["request_id"])

            # Direct result
            if "images" in result and len(result["images"]) > 0:
                return result["images"][0]["url"]

            if "image" in result:
                return result["image"]["url"]

            raise Exception("No image returned from API")

    async def _poll_result(self, client: httpx.AsyncClient, request_id: str) -> str:
        """Poll for async result."""
        status_url = f"{self.api_url}/requests/{request_id}/status"

        for _ in range(60):  # Max 60 attempts, 2 seconds each = 2 minutes timeout
            await asyncio.sleep(2)

            response = await client.get(
                status_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            result = response.json()

            status = result.get("status")
            if status == "COMPLETED":
                output = result.get("response", {})
                if "images" in output and len(output["images"]) > 0:
                    return output["images"][0]["url"]
                if "image" in output:
                    return output["image"]["url"]
                raise Exception("No image in completed result")

            if status == "FAILED":
                raise Exception(f"Image generation failed: {result.get('error', 'Unknown error')}")

        raise Exception("Timeout waiting for image generation")

    async def generate_batch(
        self,
        prompts: list[str],
        base_image_url: str | None = None,
        on_progress: callable | None = None,
    ) -> list[str]:
        """Generate multiple images with progress callback."""
        results = []
        total = len(prompts)

        for i, prompt in enumerate(prompts):
            try:
                image_url = await self.generate_image(
                    prompt=prompt,
                    image_url=base_image_url,
                )
                results.append(image_url)

                if on_progress:
                    await on_progress(
                        progress=int((i + 1) / total * 100),
                        current=i + 1,
                        total=total,
                        image_url=image_url,
                    )
            except Exception as e:
                print(f"Failed to generate image {i + 1}: {e}")
                results.append(None)

        return [r for r in results if r is not None]


nano_banana_service = NanoBananaService()
