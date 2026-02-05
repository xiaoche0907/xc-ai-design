import { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '定价',
};

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    credits: 100,
    features: [
      '100 积分/月',
      '基础图片生成',
      '标准清晰度导出',
      '社区支持',
    ],
  },
  {
    name: '基础版',
    price: '¥99',
    period: '/月',
    credits: 1000,
    popular: true,
    features: [
      '1000 积分/月',
      '高级图片生成',
      '高清导出',
      '风格复刻功能',
      '优先处理',
      '邮件支持',
    ],
  },
  {
    name: '专业版',
    price: '¥299',
    period: '/月',
    credits: 5000,
    features: [
      '5000 积分/月',
      '无限图片生成',
      '4K 超清导出',
      '所有高级功能',
      '批量处理',
      'API 访问',
      '专属客服',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              选择适合您的套餐
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              灵活的定价方案，满足不同需求
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.popular
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105 border-2 border-slate-900 dark:border-white'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-1.5 rounded-full text-sm font-semibold">
                    最受欢迎
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-lg opacity-80">{plan.period}</span>
                </div>

                <div className="mb-6">
                  <div
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                      plan.popular
                        ? 'bg-white/20 dark:bg-slate-900/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {plan.credits} 积分
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? '' : 'text-slate-900 dark:text-white'
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                  }`}
                >
                  立即选择
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
