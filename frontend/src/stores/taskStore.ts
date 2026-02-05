import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import apiClient from '@/lib/api-client';
import type { Task, CreateTaskRequest, TaskResponse, TaskProgressUpdate } from '@/types/task';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;

  // Actions
  createTask: (request: CreateTaskRequest) => Promise<string>;
  fetchTasks: () => Promise<void>;
  fetchTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskProgress: (update: TaskProgressUpdate) => void;
  setCurrentTask: (task: Task | null) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  devtools((set, get) => ({
    tasks: [],
    currentTask: null,
    isLoading: false,

    createTask: async (request: CreateTaskRequest) => {
      set({ isLoading: true });
      try {
        const endpoint =
          request.type === 'genesis' ? '/studio-genesis/generate' :
          request.type === 'mirror' ? '/aesthetic-mirror/generate' :
          '/refinement/edit';

        const response = await apiClient.post<TaskResponse>(endpoint, request);
        const { task_id } = response.data;

        // Create a local task object
        const newTask: Task = {
          id: task_id,
          userId: '', // Will be set by backend
          type: request.type,
          status: 'pending',
          progress: 0,
          inputImages: [request.imageUrl],
          outputImages: [],
          parameters: {
            count: request.count,
            style: request.style,
            width: request.width,
            height: request.height,
            referenceImage: request.referenceImage,
          },
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
          currentTask: newTask,
          isLoading: false,
        }));

        return task_id;
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    fetchTasks: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.get<Task[]>('/tasks');
        set({ tasks: response.data, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    fetchTask: async (taskId: string) => {
      try {
        const response = await apiClient.get<Task>(`/tasks/${taskId}`);
        const task = response.data;

        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
          currentTask: state.currentTask?.id === taskId ? task : state.currentTask,
        }));
      } catch (error) {
        throw error;
      }
    },

    updateTask: (taskId: string, updates: Partial<Task>) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
        currentTask:
          state.currentTask?.id === taskId
            ? { ...state.currentTask, ...updates }
            : state.currentTask,
      }));
    },

    updateTaskProgress: (update: TaskProgressUpdate) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === update.task_id
            ? {
                ...task,
                progress: update.progress,
                status: update.status,
                outputImages: update.output_images || task.outputImages,
                error: update.error,
              }
            : task
        ),
        currentTask:
          state.currentTask?.id === update.task_id
            ? {
                ...state.currentTask,
                progress: update.progress,
                status: update.status,
                outputImages: update.output_images || state.currentTask.outputImages,
                error: update.error,
              }
            : state.currentTask,
      }));
    },

    setCurrentTask: (task: Task | null) => {
      set({ currentTask: task });
    },

    clearTasks: () => {
      set({ tasks: [], currentTask: null });
    },
  }))
);
