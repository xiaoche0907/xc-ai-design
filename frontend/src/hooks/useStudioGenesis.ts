/**
 * XC AI Design - Studio Genesis Hook
 * 组图生成的核心状态管理和 API 调用
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  ProductAnalysis,
  DetailPagePlan,
  GenerationResult,
  TaskStatus,
  ProgressMessage,
  AspectRatio,
  Platform,
} from '@/types/generation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface UseStudioGenesisOptions {
  onProgress?: (progress: ProgressMessage) => void;
  onError?: (error: string) => void;
  onComplete?: (results: GenerationResult[]) => void;
}

interface UseStudioGenesisReturn {
  // 状态
  uploadedImageUrl: string | null;
  productAnalysis: ProductAnalysis | null;
  pagePlan: DetailPagePlan | null;
  generatedImages: GenerationResult[];
  currentStep: number;
  status: TaskStatus;
  progress: number;
  error: string | null;
  isLoading: boolean;

  // 操作
  setUploadedImageUrl: (url: string) => void;
  analyzeProduct: (imageUrl: string) => Promise<ProductAnalysis | null>;
  generatePlan: (count?: number, platform?: Platform, aspectRatio?: AspectRatio) => Promise<DetailPagePlan | null>;
  generateImages: (aspectRatio?: AspectRatio) => Promise<GenerationResult[]>;
  regenerateImage: (index: number, prompt: string, negativePrompt?: string) => Promise<GenerationResult | null>;
  reset: () => void;
  goToStep: (step: number) => void;
}

export function useStudioGenesis(options: UseStudioGenesisOptions = {}): UseStudioGenesisReturn {
  const { onProgress, onError, onComplete } = options;

  // 状态
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);
  const [pagePlan, setPagePlan] = useState<DetailPagePlan | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GenerationResult[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // WebSocket 引用
  const wsRef = useRef<WebSocket | null>(null);
  const taskIdRef = useRef<string>('');

  // 生成唯一任务 ID
  const generateTaskId = () => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 清理 WebSocket
  const cleanupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // 连接 WebSocket
  const connectWebSocket = useCallback((taskId: string) => {
    cleanupWebSocket();
    
    const wsUrl = API_BASE.replace('http', 'ws') + `/studio-genesis/ws/${taskId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data: ProgressMessage = JSON.parse(event.data);
        setProgress(data.progress);
        
        if (data.image_url) {
          setGeneratedImages(prev => {
            const newResults = [...prev];
            const index = (data.current || 1) - 1;
            if (newResults[index]) {
              newResults[index] = {
                ...newResults[index],
                url: data.image_url!,
                success: true,
              };
            } else {
              newResults[index] = {
                order: data.current || 1,
                role: '',
                url: data.image_url!,
                success: true,
              };
            }
            return newResults;
          });
        }
        
        if (data.stage === 'completed') {
          setStatus('completed');
          setCurrentStep(5);
        } else if (data.stage === 'failed' || data.error) {
          setStatus('failed');
          setError(data.error || '生成失败');
          onError?.(data.error || '生成失败');
        }
        
        onProgress?.(data);
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };
    
    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
    };
    
    wsRef.current = ws;
  }, [cleanupWebSocket, onError, onProgress]);

  // 清理
  useEffect(() => {
    return () => {
      cleanupWebSocket();
    };
  }, [cleanupWebSocket]);

  // 分析产品
  const analyzeProduct = useCallback(async (imageUrl: string): Promise<ProductAnalysis | null> => {
    try {
      setStatus('analyzing');
      setCurrentStep(2);
      setProgress(0);
      setError(null);

      const response = await fetch(`${API_BASE}/studio-genesis/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`分析失败: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setProductAnalysis(result.data);
        setCurrentStep(3);
        setProgress(100);
        return result.data;
      } else {
        throw new Error(result.error || '分析失败');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '分析失败';
      setError(errorMsg);
      setStatus('failed');
      onError?.(errorMsg);
      return null;
    }
  }, [onError]);

  // 生成规划
  const generatePlan = useCallback(async (
    count: number = 8,
    platform: Platform = '通用',
    aspectRatio: AspectRatio = '3:4'
  ): Promise<DetailPagePlan | null> => {
    if (!productAnalysis) {
      setError('请先完成产品分析');
      return null;
    }

    try {
      setStatus('planning');
      setProgress(0);
      setError(null);

      const response = await fetch(`${API_BASE}/studio-genesis/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_analysis: productAnalysis,
          count,
          platform,
          aspect_ratio: aspectRatio,
        }),
      });

      if (!response.ok) {
        throw new Error(`规划失败: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setPagePlan(result.data);
        setProgress(100);
        return result.data;
      } else {
        throw new Error(result.error || '规划失败');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '规划失败';
      setError(errorMsg);
      setStatus('failed');
      onError?.(errorMsg);
      return null;
    }
  }, [productAnalysis, onError]);

  // 生成图片
  const generateImages = useCallback(async (
    aspectRatio: AspectRatio = '3:4'
  ): Promise<GenerationResult[]> => {
    if (!pagePlan || !uploadedImageUrl || !productAnalysis) {
      setError('请先完成规划');
      return [];
    }

    try {
      setStatus('generating');
      setCurrentStep(4);
      setProgress(0);
      setError(null);
      setGeneratedImages([]);

      // 生成任务 ID 并连接 WebSocket
      const taskId = generateTaskId();
      taskIdRef.current = taskId;
      connectWebSocket(taskId);

      const response = await fetch(`${API_BASE}/studio-genesis/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_plan: pagePlan,
          product_info: productAnalysis.basic_info,
          base_image_url: uploadedImageUrl,
          task_id: taskId,
          aspect_ratio: aspectRatio,
        }),
      });

      if (!response.ok) {
        throw new Error(`生成失败: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setGeneratedImages(result.data);
        setStatus('completed');
        setCurrentStep(5);
        setProgress(100);
        onComplete?.(result.data);
        return result.data;
      } else {
        throw new Error(result.error || '生成失败');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '生成失败';
      setError(errorMsg);
      setStatus('failed');
      onError?.(errorMsg);
      return [];
    }
  }, [pagePlan, uploadedImageUrl, productAnalysis, connectWebSocket, onComplete, onError]);

  // 重新生成单张图片
  const regenerateImage = useCallback(async (
    index: number,
    prompt: string,
    negativePrompt: string = ''
  ): Promise<GenerationResult | null> => {
    try {
      const response = await fetch(`${API_BASE}/studio-genesis/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          base_image_url: uploadedImageUrl,
          order: index + 1,
          role: generatedImages[index]?.role || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`重新生成失败: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setGeneratedImages(prev => {
          const newImages = [...prev];
          newImages[index] = {
            ...newImages[index],
            ...result.data,
            success: true,
          };
          return newImages;
        });
        return result.data;
      } else {
        throw new Error(result.error || '重新生成失败');
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '重新生成失败';
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    }
  }, [uploadedImageUrl, generatedImages, onError]);

  // 重置
  const reset = useCallback(() => {
    cleanupWebSocket();
    setUploadedImageUrl(null);
    setProductAnalysis(null);
    setPagePlan(null);
    setGeneratedImages([]);
    setCurrentStep(1);
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, [cleanupWebSocket]);

  // 跳转步骤
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  }, []);

  return {
    // 状态
    uploadedImageUrl,
    productAnalysis,
    pagePlan,
    generatedImages,
    currentStep,
    status,
    progress,
    error,
    isLoading: status === 'analyzing' || status === 'planning' || status === 'generating',

    // 操作
    setUploadedImageUrl,
    analyzeProduct,
    generatePlan,
    generateImages,
    regenerateImage,
    reset,
    goToStep,
  };
}

export default useStudioGenesis;
