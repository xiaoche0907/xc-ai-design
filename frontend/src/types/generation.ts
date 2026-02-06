/**
 * XC AI Design - 类型定义
 * 组图生成和风格复刻相关类型
 */

// ==================== 配置类型 ====================

/** 组图生成配置 */
export interface StudioGenesisConfig {
  imageCount: number;              // 1-15
  aspectRatio: AspectRatio;        
  platform: Platform;              
  language: Language;              
  style: StylePreset;              
  colorScheme: 'auto' | 'custom';
  customColors?: string[];         
  autoAnalyze: boolean;            
  showBlueprint: boolean;          
  enableQualityCheck: boolean;
  generateMultilingual: boolean;
}

/** 风格复刻配置 */
export interface AestheticMirrorConfig {
  styleStrength: number;           // 0.5-0.9
  preserveProduct: boolean;        
  colorWeight: number;             // 0-1
  lightingWeight: number;          
  compositionWeight: number;       
  textureWeight: number;           
  moodWeight: number;              
  batchMode: 'single' | 'batch';
  aspectRatio: AspectRatio;
}

// ==================== 产品分析类型 ====================

/** 产品深度分析结果 */
export interface ProductAnalysis {
  basic_info: {
    product_name: string;
    category: string;
    price_tier: string;
    target_platform: string[];
  };
  visual_identity: {
    dominant_colors: Array<{
      hex: string;
      name: string;
      percentage: string;
      emotion: string;
    }>;
    material_texture: string;
    shape_language: string;
    size_perception: string;
  };
  selling_points: {
    core_usp: string;
    functional_benefits: Array<{
      feature: string;
      benefit: string;
      proof: string;
    }>;
    emotional_benefits: Array<{
      desire: string;
      fulfillment: string;
    }>;
    pain_points_solved: string[];
  };
  target_audience: {
    demographics: string;
    psychographics: string;
    purchase_motivation: string;
    decision_factors: string[];
  };
  detail_page_blueprint: {
    hook_image: {
      concept: string;
      visual_style: string;
      key_message: string;
    };
    content_sequence: Array<{
      section: string;
      purpose: string;
      content_type: string;
      visual_direction: string;
    }>;
    recommended_image_count: string;
    aspect_ratio_suggestion: string;
  };
  style_recommendations: {
    primary_style: string;
    alternative_styles: string[];
    avoid_styles: string[];
    color_scheme: string;
    mood_keywords: string[];
  };
  raw_response?: string;
}

// ==================== 详情页规划类型 ====================

/** 详情页规划 */
export interface DetailPagePlan {
  page_strategy: {
    overall_tone: string;
    color_palette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    typography_style: string;
    visual_consistency: string;
  };
  image_sequence: ImageSequenceItem[];
  quality_checklist: string[];
  raw_response?: string;
}

/** 图片序列项 */
export interface ImageSequenceItem {
  order: number;
  role: string;
  purpose: string;
  content_focus: string;
  visual_composition: string;
  lighting_mood: string;
  text_overlay: {
    headline: string;
    subheadline: string;
    placement: string;
  };
  generation_prompt: string;
}

// ==================== 风格DNA类型 ====================

/** 风格DNA */
export interface StyleDNA {
  style_fingerprint: {
    style_name: string;
    style_era: string;
    brand_personality: string;
    one_sentence_summary: string;
  };
  color_dna: {
    palette: Array<{
      hex: string;
      role: string;
      percentage: string;
      psychological_effect: string;
    }>;
    color_temperature: string;
    saturation_profile: string;
    value_contrast: string;
    color_harmony: string;
  };
  lighting_dna: {
    main_light: {
      direction: string;
      quality: string;
      intensity: string;
      color_temp: string;
    };
    fill_light: {
      ratio: string;
      method: string;
    };
    rim_light: string;
    ambient_light: string;
    shadow_characteristics: {
      softness: string;
      density: string;
      color: string;
    };
    highlight_treatment: string;
  };
  composition_dna: {
    layout_type: string;
    visual_weight: string;
    negative_space: string;
    depth_layers: string;
    visual_flow: string;
    aspect_ratio: string;
  };
  texture_material_dna: {
    surface_qualities: string[];
    material_references: string[];
    tactile_impression: string;
  };
  decorative_dna: {
    props: string[];
    patterns: string[];
    graphic_elements: string[];
    typography_style: string;
  };
  mood_atmosphere: {
    emotional_keywords: string[];
    sensory_experience: string;
    story_narrative: string;
  };
  replication_master_prompt: {
    english_prompt: string;
    style_weights: {
      color_weight: number;
      lighting_weight: number;
      composition_weight: number;
      texture_weight: number;
      mood_weight: number;
    };
    must_preserve: string[];
    can_adapt: string[];
  };
  raw_response?: string;
}

// ==================== 生成结果类型 ====================

/** 生成结果 */
export interface GenerationResult {
  order: number;
  role: string;
  url: string | null;
  text_overlay?: {
    headline: string;
    subheadline: string;
    placement: string;
  };
  params?: Record<string, unknown>;
  width?: number;
  height?: number;
  success: boolean;
  error?: string;
  quality_score?: number;
}

/** 质量评估结果 */
export interface QualityAssessment {
  scores: {
    product_fidelity: number;
    style_consistency: number;
    lighting_quality: number;
    composition: number;
    commercial_readiness: number;
    conversion_potential: number;
    overall: number;
  };
  issues_found: string[];
  improvement_suggestions: string[];
  regeneration_needed: boolean;
  adjusted_prompt?: string;
}

/** 多语言文案结果 */
export interface MultilingualCopy {
  [language_code: string]: {
    headline: string;
    subheadline: string;
    bullet_points: string[];
    call_to_action: string;
    localization_notes: string;
  };
}

// ==================== 进度类型 ====================

/** WebSocket 进度消息 */
export interface ProgressMessage {
  stage: 'analyzing' | 'planning' | 'generating' | 'fusing' | 'transferring' | 'completed' | 'failed';
  progress: number;
  current?: number;
  total?: number;
  image_url?: string | null;
  error?: string;
  message?: string;
}

/** 任务状态 */
export type TaskStatus = 'idle' | 'analyzing' | 'planning' | 'generating' | 'completed' | 'failed';

// ==================== 枚举类型 ====================

export type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '3:2' | '2:3' | '21:9' | '9:21' | '4:5' | '5:4';

export type Platform = '通用' | 'Amazon' | 'Shopify' | '淘宝' | '京东' | '拼多多' | 'eBay' | 'Etsy';

export type Language = 
  | 'no-text' 
  | 'zh-CN' 
  | 'zh-TW' 
  | 'en' 
  | 'ja' 
  | 'ko' 
  | 'de' 
  | 'fr' 
  | 'es' 
  | 'it' 
  | 'pt' 
  | 'ru' 
  | 'ar' 
  | 'th' 
  | 'id';

export type StylePreset = 
  | 'auto' 
  | '简约现代' 
  | '轻奢高端' 
  | '国风古典' 
  | 'INS风' 
  | '科技未来' 
  | '复古怀旧'
  | '日系清新'
  | '北欧极简';

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalyzeResponse extends ApiResponse<ProductAnalysis> {}
export interface PlanResponse extends ApiResponse<DetailPagePlan> {}
export interface GenerateResponse extends ApiResponse<GenerationResult[]> {}
export interface StyleExtractResponse extends ApiResponse<StyleDNA> {}
export interface QualityResponse extends ApiResponse<QualityAssessment> {}
export interface MultilingualResponse extends ApiResponse<MultilingualCopy> {}
