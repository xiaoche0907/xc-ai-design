// Task types
export type TaskType = 'genesis' | 'mirror' | 'refinement';
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface TaskParameters {
  count?: number;
  style?: string;
  width?: number;
  height?: number;
  referenceImage?: string;
}

export interface Task {
  id: string;
  userId: string;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  inputImages: string[];
  outputImages: string[];
  parameters: TaskParameters;
  createdAt: string;
  error?: string;
}

export interface CreateTaskRequest {
  type: TaskType;
  imageUrl: string;
  count?: number;
  style?: string;
  referenceImage?: string;
  width?: number;
  height?: number;
}

export interface TaskResponse {
  task_id: string;
  status: TaskStatus;
}

export interface TaskProgressUpdate {
  task_id: string;
  progress: number;
  status: TaskStatus;
  output_images?: string[];
  error?: string;
}
