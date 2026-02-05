'use client';

import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { tasks, currentTask } = useTaskStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          🧪 功能测试页面
        </h1>

        {/* Auth Store Test */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            🔐 Auth Store 测试
            <Badge variant={isAuthenticated ? 'default' : 'secondary'}>
              {isAuthenticated ? '已登录' : '未登录'}
            </Badge>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              用户状态: {user ? `${user.email} (${user.credits} 积分)` : '未登录'}
            </p>
            <p className="text-sm text-muted-foreground">
              Token: {useAuthStore.getState().token ? '已设置' : '未设置'}
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => {
                  useAuthStore.setState({
                    user: {
                      id: 'test-123',
                      email: 'test@example.com',
                      credits: 100,
                      createdAt: new Date().toISOString(),
                    },
                    token: 'mock-token-12345',
                    isAuthenticated: true,
                  });
                }}
              >
                模拟登录
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => useAuthStore.getState().logout()}
              >
                登出
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => useAuthStore.getState().updateCredits(50)}
                disabled={!user}
              >
                更新积分为 50
              </Button>
            </div>
          </div>
        </Card>

        {/* Task Store Test */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            📋 Task Store 测试
            <Badge>{tasks.length} 个任务</Badge>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              当前任务: {currentTask ? `${currentTask.type} (${currentTask.status})` : '无'}
            </p>
            <p className="text-sm text-muted-foreground">
              任务列表: {tasks.length === 0 ? '空' : `${tasks.length} 个任务`}
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => {
                  const mockTask = {
                    id: `task-${Date.now()}`,
                    userId: 'test-123',
                    type: 'genesis' as const,
                    status: 'pending' as const,
                    progress: 0,
                    inputImages: ['https://example.com/image.jpg'],
                    outputImages: [],
                    parameters: { count: 5, style: 'professional' },
                    createdAt: new Date().toISOString(),
                  };
                  useTaskStore.setState((state) => ({
                    tasks: [mockTask, ...state.tasks],
                    currentTask: mockTask,
                  }));
                }}
              >
                添加模拟任务
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (currentTask) {
                    useTaskStore.getState().updateTaskProgress({
                      task_id: currentTask.id,
                      progress: 75,
                      status: 'processing',
                    });
                  }
                }}
                disabled={!currentTask}
              >
                更新进度 75%
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => useTaskStore.getState().clearTasks()}
              >
                清空任务
              </Button>
            </div>
            {tasks.length > 0 && (
              <div className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-muted rounded-lg text-sm space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.type}</span>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* UI Store Test */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            🎨 UI Store 测试
            <Badge variant={sidebarOpen ? 'default' : 'secondary'}>
              侧边栏: {sidebarOpen ? '打开' : '关闭'}
            </Badge>
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Mobile Menu: {useUIStore.getState().mobileMenuOpen ? '打开' : '关闭'}
            </p>
            <p className="text-sm text-muted-foreground">
              Modal: {useUIStore.getState().modalOpen ? '打开' : '关闭'}
            </p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={toggleSidebar}>
                切换侧边栏
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => useUIStore.getState().toggleMobileMenu()}
              >
                切换移动菜单
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  useUIStore.getState().openModal(
                    <div className="p-4">
                      <h3 className="font-bold">测试 Modal</h3>
                      <p>这是一个测试模态框</p>
                    </div>
                  )
                }
              >
                打开 Modal
              </Button>
            </div>
          </div>
        </Card>

        {/* Tailwind & shadcn/ui Test */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🎨 Tailwind & shadcn/ui 测试</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">自定义动画:</p>
              <div className="flex gap-2">
                <div className="w-16 h-16 bg-blue-500 rounded-lg animate-fade-in" />
                <div className="w-16 h-16 bg-purple-500 rounded-lg animate-slide-up" />
                <div className="w-16 h-16 bg-pink-500 rounded-lg animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Glassmorphism 效果:</p>
              <div className="glassmorphism p-4 rounded-lg border border-white/20">
                <p className="text-sm">这是一个玻璃态效果的卡片</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">按钮组件:</p>
              <div className="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
                <Button size="sm" variant="destructive">Destructive</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* API Client Info */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🌐 API Client 配置</h2>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">Base URL:</span>{' '}
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">WebSocket URL:</span>{' '}
              {process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">App Name:</span>{' '}
              {process.env.NEXT_PUBLIC_APP_NAME || 'Picset AI Clone'}
            </p>
          </div>
        </Card>

        <div className="text-center pt-8">
          <a href="/" className="text-blue-600 hover:underline">
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
