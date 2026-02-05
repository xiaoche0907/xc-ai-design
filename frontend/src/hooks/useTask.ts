import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, getWebSocketUrl } from '@/lib/api-client';

interface Task {
  id: string;
  user_id: string;
  type: string;
  status: string;
  progress: number;
  input_images: Record<string, unknown> | null;
  output_images: Record<string, unknown> | null;
  parameters: Record<string, unknown> | null;
  error_message: string | null;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
}

interface TaskProgress {
  status: string;
  progress: number;
  message?: string;
  output_images?: string[];
}

interface GenesisRequest {
  image_url: string;
  count?: number;
  style?: string;
}

interface MirrorRequest {
  product_image_url: string;
  style_image_url: string;
}

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await apiClient.get<Task>(`/tasks/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
  });
}

export function useTasks(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ['tasks', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<Task[]>(`/tasks?limit=${limit}&offset=${offset}`);
      return response.data;
    },
  });
}

export function useTaskProgress(taskId: string | null) {
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const ws = new WebSocket(getWebSocketUrl(taskId));
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as TaskProgress;
        setProgress(data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [taskId]);

  return progress;
}

export function useStudioGenesis() {
  return useMutation({
    mutationFn: async (request: GenesisRequest) => {
      const response = await apiClient.post<Task>('/tasks/studio-genesis', request);
      return response.data;
    },
  });
}

export function useAestheticMirror() {
  return useMutation({
    mutationFn: async (request: MirrorRequest) => {
      const response = await apiClient.post<Task>('/tasks/aesthetic-mirror', request);
      return response.data;
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ url: string }>('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    },
  });
}
