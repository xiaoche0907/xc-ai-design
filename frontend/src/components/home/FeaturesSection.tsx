'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Image, Palette, Wand2, Sparkles, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Image,
    title: 'AI 智能组图生成',
    description: '上传产品图，AI 自动生成 5-10 张专业电商详情图，自动提取卖点并生成配图文案',
    href: '/studio-genesis',
  },
  {
    icon: Palette,
    title: '视觉 DNA 风格复刻',
    description: '上传参考图，AI 精准提取配色、布局、光影、装饰元素，100% 还原爆款风格',
    href: '/aesthetic-mirror',
  },
  {
    icon: Wand2,
    title: '图片智能精修',
    description: '二次编辑调整、局部重绘、多尺寸导出，满足各大电商平台规格要求',
    href: '/refinement-studio',
  },
];

const highlights = [
  {
    icon: Sparkles,
    title: '智能卖点分析',
    description: 'AI 自动识别产品特征，提取核心卖点',
  },
  {
    icon: Zap,
    title: '5 秒极速生成',
    description: '无需等待，批量生成高质量详情图',
  },
  {
    icon: Shield,
    title: '主体完整保护',
    description: '保证产品主体不变形，细节不丢失',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            三大核心功能
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            一站式解决电商产品图制作难题，让AI成为你的专业设计师
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                  <div
                    className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform"
                  >
                    <feature.icon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <highlight.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">{highlight.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
