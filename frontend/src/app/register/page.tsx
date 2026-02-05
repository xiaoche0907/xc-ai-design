import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '注册',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">注册 Picset AI</h1>
            <p className="text-slate-600 dark:text-slate-400">
              创建账户开始使用 AI 图片生成
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">邮箱</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="至少 8 个字符"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">确认密码</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="再次输入密码"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              注册
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              已有账户？
            </span>
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium ml-1"
            >
              立即登录
            </Link>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="block text-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
