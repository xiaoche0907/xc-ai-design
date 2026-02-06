"""
API 功能测试脚本
用于验证 Studio Genesis 和 Aesthetic Mirror API
"""

import asyncio
import httpx
import json

BASE_URL = "http://localhost:3001/api/v1"

# 测试图片 URL（请替换为实际的产品图片 URL）
TEST_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
TEST_STYLE_IMAGE = "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800"


async def test_health():
    """测试健康检查"""
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")
        print(f"✅ Health Check: {response.json()}")
        return response.status_code == 200


async def test_studio_genesis_analyze():
    """测试产品分析 API"""
    print("\n📊 测试产品分析...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{BASE_URL}/studio-genesis/analyze",
            json={"image_url": TEST_PRODUCT_IMAGE}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                analysis = data.get("data", {})
                print(f"✅ 产品分析成功!")
                print(f"   产品名称: {analysis.get('basic_info', {}).get('product_name', 'N/A')}")
                print(f"   核心卖点: {analysis.get('selling_points', {}).get('core_usp', 'N/A')}")
                return analysis
            else:
                print(f"❌ 分析失败: {data.get('error')}")
        else:
            print(f"❌ 请求失败: {response.status_code}")
        return None


async def test_studio_genesis_plan(product_analysis: dict):
    """测试详情页规划 API"""
    print("\n📋 测试详情页规划...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{BASE_URL}/studio-genesis/plan",
            json={
                "product_analysis": product_analysis,
                "count": 4,
                "platform": "通用",
                "aspect_ratio": "3:4"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                plan = data.get("data", {})
                print(f"✅ 规划生成成功!")
                image_sequence = plan.get("image_sequence", [])
                print(f"   生成图片数量: {len(image_sequence)}")
                for img in image_sequence[:3]:
                    print(f"   - {img.get('role', 'N/A')}: {img.get('purpose', 'N/A')[:50]}...")
                return plan
            else:
                print(f"❌ 规划失败: {data.get('error')}")
        else:
            print(f"❌ 请求失败: {response.status_code}")
        return None


async def test_aesthetic_mirror_extract():
    """测试风格提取 API"""
    print("\n🎨 测试风格提取...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{BASE_URL}/aesthetic-mirror/extract-style",
            json={"style_image_url": TEST_STYLE_IMAGE}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                style_dna = data.get("data", {})
                fingerprint = style_dna.get("style_fingerprint", {})
                print(f"✅ 风格提取成功!")
                print(f"   风格名称: {fingerprint.get('style_name', 'N/A')}")
                print(f"   风格描述: {fingerprint.get('one_sentence_summary', 'N/A')[:80]}...")
                return style_dna
            else:
                print(f"❌ 提取失败: {data.get('error')}")
        else:
            print(f"❌ 请求失败: {response.status_code}")
        return None


async def run_tests():
    """运行所有测试"""
    print("=" * 60)
    print("🚀 XC AI Design API 测试")
    print("=" * 60)
    
    # 1. 健康检查
    if not await test_health():
        print("❌ 服务未启动，请先运行: uvicorn app.main:app --reload")
        return
    
    # 2. 产品分析
    analysis = await test_studio_genesis_analyze()
    if not analysis:
        print("⚠️ 产品分析测试跳过后续测试")
        return
    
    # 3. 详情页规划
    plan = await test_studio_genesis_plan(analysis)
    
    # 4. 风格提取
    style_dna = await test_aesthetic_mirror_extract()
    
    print("\n" + "=" * 60)
    print("📊 测试结果汇总")
    print("=" * 60)
    print(f"✅ 产品分析: {'通过' if analysis else '失败'}")
    print(f"✅ 详情页规划: {'通过' if plan else '失败'}")
    print(f"✅ 风格提取: {'通过' if style_dna else '失败'}")
    print("\n💡 提示: 图片生成测试需要实际 API 调用，请在前端进行完整测试")


if __name__ == "__main__":
    asyncio.run(run_tests())
