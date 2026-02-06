"""
XC AI Design - 共享提示词模块
集中管理所有 AI 角色定义和提示词模板
"""

# ==================== 系统角色定义 ====================

ECOMMERCE_VISUAL_MASTER = """你是一位顶级电商视觉策略大师,拥有以下专业背景:

【核心能力】
- 10年+跨境电商视觉设计经验(Amazon、Shopify、天猫、京东)
- 精通消费心理学与视觉营销转化逻辑
- 掌握专业商业摄影布光、构图与后期技术
- 深谙各平台A+页面、详情页的最佳实践规范

【设计哲学】
- 遵循"视觉钩子→核心参数→使用场景→信任背书"的转化漏斗
- 运用色彩心理学驱动购买决策
- 注重黄金比例与视觉重心引导
- 追求"3秒抓住眼球,30秒完成种草"的设计目标

【输出要求】
- 所有分析必须服务于"提升转化率"的终极目标
- 卖点提炼要直击用户痛点,而非堆砌产品参数
- 文案要有情感共鸣,避免自说自话
"""

STYLE_DNA_ANALYST = """你是一位视觉DNA解析专家,专精于:

【核心能力】
- 像素级视觉风格解构与重建
- 3D空间光影关系理解与重塑
- 品牌调性与设计语言提炼
- 跨品类风格迁移与融合

【技术专长】
- 色彩体系:色相、饱和度、明度的精准量化
- 光影系统:主光/辅光/轮廓光/环境光的完整建模
- 构图逻辑:视觉动线、信息层级、空间节奏的解析
- 材质表现:质感、纹理、反光特性的捕捉

【工作原则】
- 提取"美学规则"而非复制像素
- 确保风格迁移后产品主体100%不变形
- 输出的指令必须可被AI图像生成模型精确执行
"""

MARKETING_COPYWRITER = """你是一位电商爆款文案专家:

【核心能力】
- 精通AIDA、FAB、SCQA等经典文案框架
- 深谙各平台用户阅读习惯与转化路径
- 擅长多语言本地化营销表达
- 能够将产品特性转化为用户利益点

【文案风格】
- 标题:简短有力,制造悬念或利益承诺
- 卖点:痛点前置,解决方案后置
- 场景:代入感强,让用户"看见自己"
- CTA:行动指令清晰,降低决策门槛
"""

# ==================== 组图生成提示词 ====================

PRODUCT_DEEP_ANALYSIS = """请对这张产品图进行360°深度分析,输出JSON格式:

{
  "basic_info": {
    "product_name": "产品名称(精确到型号/系列)",
    "category": "一级类目 > 二级类目 > 三级类目",
    "price_tier": "价格带定位(入门/中端/高端/奢侈)",
    "target_platform": ["适合的电商平台列表"]
  },
  
  "visual_identity": {
    "dominant_colors": [
      {"hex": "#XXXXXX", "name": "色彩名称", "percentage": "占比%", "emotion": "色彩心理学含义"}
    ],
    "material_texture": "材质质感描述",
    "shape_language": "造型语言",
    "size_perception": "尺寸感知"
  },
  
  "selling_points": {
    "core_usp": "核心差异化卖点(1个,20字以内)",
    "functional_benefits": [
      {"feature": "功能特性", "benefit": "用户利益", "proof": "支撑论据"}
    ],
    "emotional_benefits": [
      {"desire": "用户渴望", "fulfillment": "产品如何满足"}
    ],
    "pain_points_solved": ["解决的用户痛点列表"]
  },
  
  "target_audience": {
    "demographics": "人口统计特征",
    "psychographics": "心理特征",
    "purchase_motivation": "购买动机",
    "decision_factors": ["决策关键因素排序"]
  },
  
  "detail_page_blueprint": {
    "hook_image": {
      "concept": "首图创意概念",
      "visual_style": "视觉风格",
      "key_message": "核心信息"
    },
    "content_sequence": [
      {
        "section": "板块名称",
        "purpose": "该板块目的",
        "content_type": "内容类型",
        "visual_direction": "视觉方向描述"
      }
    ],
    "recommended_image_count": "建议图片数量",
    "aspect_ratio_suggestion": "建议宽高比"
  },
  
  "style_recommendations": {
    "primary_style": "主推风格",
    "alternative_styles": ["备选风格列表"],
    "avoid_styles": ["应避免的风格"],
    "color_scheme": "配色方案建议",
    "mood_keywords": ["氛围关键词"]
  }
}

【分析要求】
1. 卖点必须从用户视角出发,说人话
2. 详情页蓝图要符合转化漏斗逻辑
3. 风格建议要考虑产品定位和目标人群
"""

DETAIL_PAGE_STRUCTURE = """基于产品分析结果,规划完整的详情页图片序列:

## 输入信息
产品分析:{product_analysis}
生成数量:{count}张
目标平台:{platform}
图片比例:{aspect_ratio}

## 输出要求(JSON格式)
{{
  "page_strategy": {{
    "overall_tone": "整体调性描述",
    "color_palette": {{
      "primary": "#XXXXXX",
      "secondary": "#XXXXXX", 
      "accent": "#XXXXXX",
      "background": "#XXXXXX"
    }},
    "typography_style": "字体风格建议",
    "visual_consistency": "视觉一致性要点"
  }},
  
  "image_sequence": [
    {{
      "order": 1,
      "role": "图片角色(首图/卖点图/场景图/参数图/信任图等)",
      "purpose": "这张图要达成的目的",
      "content_focus": "内容焦点",
      "visual_composition": "构图方式",
      "lighting_mood": "光影氛围",
      "text_overlay": {{
        "headline": "主标题文案",
        "subheadline": "副标题文案",
        "placement": "文字位置"
      }},
      "generation_prompt": "完整的英文图片生成提示词(150-200字)"
    }}
  ],
  
  "quality_checklist": ["生成后需检查的质量要点"]
}}

【规划原则】
1. 首图必须是"视觉炸弹",3秒抓住注意力
2. 遵循"总-分-总"的信息架构
3. 每张图只传达1个核心信息
4. 场景图要有代入感
5. 最后一张要有行动召唤
"""

IMAGE_GENERATION_PROMPT_TEMPLATE = """为电商详情图生成专业级AI绘图提示词:

## 图片要求
- 角色:{role}
- 目的:{purpose}
- 构图:{composition}
- 氛围:{mood}
- 产品信息:{product_info}

## 输出格式
生成一段英文提示词,必须包含:

1. 【���体描述】产品的精确描述
2. 【场景环境】背景环境的详细描述
3. 【光影设计】主光源、辅助光、环境光、阴影
4. 【相机参数】镜头、角度、景深
5. 【后期风格】色调、对比度、质感
6. 【画质要求】8K, ultra detailed, photorealistic等

同时生成negative prompt,排除:
- 画质问题:blurry, low quality, pixelated
- 构图问题:cropped, out of frame, distorted
- 风格问题:cartoon, anime(除非特别要求)
- 产品问题:deformed product, wrong proportions

输出格式:
Prompt: [详细的英文提示词]
Negative: [负面提示词]
"""

# ==================== 风格复刻提示词 ====================

STYLE_DNA_EXTRACTION = """请对这张风格参考图进行像素级视觉DNA解析:

## 输出格式(JSON)
{
  "style_fingerprint": {
    "style_name": "为这个风格起一个名字",
    "style_era": "设计时代感",
    "brand_personality": "品牌性格",
    "one_sentence_summary": "一句话概括精髓"
  },
  
  "color_dna": {
    "palette": [
      {
        "hex": "#XXXXXX",
        "role": "主色/辅助色/点缀色/背景色",
        "percentage": "占比%",
        "psychological_effect": "色彩心理学效果"
      }
    ],
    "color_temperature": "整体色温",
    "saturation_profile": "饱和度特征",
    "value_contrast": "明度对比",
    "color_harmony": "色彩和谐类型"
  },
  
  "lighting_dna": {
    "main_light": {
      "direction": "主光方向",
      "quality": "光质(硬光/柔光)",
      "intensity": "强度",
      "color_temp": "色温"
    },
    "fill_light": {
      "ratio": "补光比",
      "method": "补光方式"
    },
    "rim_light": "轮廓光描述",
    "ambient_light": "环境光氛围",
    "shadow_characteristics": {
      "softness": "阴影软硬程度",
      "density": "阴影浓度",
      "color": "阴影色调"
    },
    "highlight_treatment": "高光处理方式"
  },
  
  "composition_dna": {
    "layout_type": "构图类型",
    "visual_weight": "视觉重心位置",
    "negative_space": "留白比例与位置",
    "depth_layers": "景深层次",
    "visual_flow": "视觉动线描述",
    "aspect_ratio": "画面比例"
  },
  
  "texture_material_dna": {
    "surface_qualities": ["表面质感列表"],
    "material_references": ["材质参考"],
    "tactile_impression": "触感印象描述"
  },
  
  "decorative_dna": {
    "props": ["道具元素列表"],
    "patterns": ["图案元素"],
    "graphic_elements": ["图形装饰"],
    "typography_style": "字体风格描述"
  },
  
  "mood_atmosphere": {
    "emotional_keywords": ["情感关键词列表"],
    "sensory_experience": "五感体验描述",
    "story_narrative": "画面讲述的故事"
  },
  
  "replication_master_prompt": {
    "english_prompt": "完整的英文风格复刻提示词(300-400字)",
    "style_weights": {
      "color_weight": 0.8,
      "lighting_weight": 0.9,
      "composition_weight": 0.7,
      "texture_weight": 0.6,
      "mood_weight": 0.8
    },
    "must_preserve": ["必须保留的风格要素"],
    "can_adapt": ["可以适当调整的要素"]
  }
}

【提取要求】
1. 分析要足够深入,确保AI能100%复刻
2. 英文提示词要详尽具体
3. 权重设置要反映风格核心特征
"""

STYLE_FUSION_PROMPT = """将提取的风格DNA应用到目标产品上:

## 输入信息
风格DNA:{style_dna}
产品信息:{product_info}
产品图URL:{product_image_url}

## 融合策略

### 1. 主体保护协议
- 产品主体必须100%保持原样
- 只改变环境、光影、氛围
- 融合必须自然,无PS痕迹

### 2. 3D空间感知融合
- 分析产品的三维结构
- 根据风格光影计算产品表面效果
- 确保阴影方向与环境光源一致
- 反光、高光符合材质特性

### 3. 色彩协调融合
- 环境色彩遵循风格DNA
- 产品原有颜色保持不变
- 处理好色彩过渡

### 4. 氛围一致性
- 整体氛围与风格DNA一致
- 景深、虚化处理协调
- 装饰元素恰到好处

## 输出格式
{{
  "fusion_prompt": {{
    "main_prompt": "完整的英文融合提示词",
    "negative_prompt": "负面提示词",
    "generation_params": {{
      "guidance_scale": 7.5,
      "strength": 0.7,
      "steps": 35
    }}
  }},
  "quality_checks": ["生成后需检查的质量点"],
  "regeneration_tips": "如果效果不理想的调整建议"
}}
"""

QUALITY_ASSESSMENT = """评估AI生成的图片质量:

## 评估维度(1-10分)
1. 产品还原度:产品主体是否变形/失真
2. 风格一致性:是否符合预期风格
3. 光影合理性:光影是否自然协调
4. 构图美感:构图是否专业美观
5. 商业可用性:是否达到商用标准
6. 转化潜力:是否有助于提升转化

## 输出格式
{
  "scores": {
    "product_fidelity": 0,
    "style_consistency": 0,
    "lighting_quality": 0,
    "composition": 0,
    "commercial_readiness": 0,
    "conversion_potential": 0,
    "overall": 0
  },
  "issues_found": ["发现的问题"],
  "improvement_suggestions": ["改进建议"],
  "regeneration_needed": true,
  "adjusted_prompt": "如需重新生成,调整后的提示词"
}
"""

MULTILINGUAL_COPY = """生成多语言版本的产品文案:

## 产品信息
{product_info}

## 目标语言
{target_languages}

## 输出要求
每种语言都要:
1. 符合当地表达习惯(本地化,非直译)
2. 考虑文化差异和禁忌
3. 保持品牌调性一致
4. 适配当地平台规范

## 输出格式
{{
  "language_code": {{
    "headline": "标题",
    "subheadline": "副标题",
    "bullet_points": ["要点列表"],
    "call_to_action": "行动召唤",
    "localization_notes": "本地化注意事项"
  }}
}}
"""
